import express from 'express';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const KEY_FILE = path.resolve(process.cwd(), '.api-key.json');
const ALIGNMENT_LOG_FILE = path.resolve(process.cwd(), '.alignment-logs.json');
const VOICE_LOG_FILE = path.resolve(process.cwd(), '.voice-logs.json');

function getApiKey(req?: express.Request): string {
  // 1. Authoritative server environment variable injected by AI Studio
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    return process.env.GEMINI_API_KEY;
  }
  // 2. Saved in local key file if configured
  if (fs.existsSync(KEY_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(KEY_FILE, 'utf-8'));
      if (parsed.apiKey && parsed.apiKey !== 'MY_GEMINI_API_KEY') return parsed.apiKey;
    } catch {
      // ignore
    }
  }
  // 3. Fall back to client request body / headers / query param
  const clientKey =
    (req?.body?.apiKey as string) ||
    (req?.query?.apiKey as string) ||
    (req?.headers?.['x-gemini-api-key'] as string) ||
    '';
  if (clientKey && clientKey !== 'MY_GEMINI_API_KEY') {
    return clientKey;
  }
  return '';
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // CORS & Cache-Control headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-api-key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Local key storage endpoints
  app.get('/api/key', (req, res) => {
    const key = getApiKey(req);
    res.json({ apiKey: key });
  });

  app.post('/api/key', (req, res) => {
    try {
      const { apiKey } = req.body || {};
      if (typeof apiKey === 'string') {
        fs.writeFileSync(KEY_FILE, JSON.stringify({ apiKey }, null, 2), 'utf-8');
      }
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // Custom voices count
  app.get('/api/voices-count', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.json({ count: 0, error: 'No API key configured' });
      }
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/voices?pageSize=100&key=${encodeURIComponent(key)}`,
      );
      if (resp.status === 501 || resp.status === 404) {
        return res.json({ count: 0, hasMore: false });
      }
      if (!resp.ok) {
        return res.json({ count: 0, status: resp.status });
      }
      const data = await resp.json();
      const count = Array.isArray(data.voices) ? data.voices.length : 0;
      res.json({ count, hasMore: !!data.next_page_token });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // =========================================================================
  // SERVER-SIDE AI ROUTES (Gemini Voice API, TTS, Story Generation, Alignment)
  // =========================================================================

  // 1. Create Custom Prompted Voice (POST /v1beta/voices)
  app.post('/api/create-voice', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const {
        prompt,
        displayName = 'Monologue Voice',
        modelName = 'models/gemini-3.8-flash-tts',
      } = req.body || {};
      if (!prompt) {
        return res.status(400).json({ error: 'Voice prompt is required.' });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/voices?key=${encodeURIComponent(key)}`;
      const payload = {
        voice: {
          model: modelName,
          type: 'prompted',
          display_name: displayName,
          prompted: {
            input: prompt,
          },
        },
        store: true,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 16000);

      let resp: Response;
      try {
        resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!resp.ok) {
        const errText = await resp.text();
        let parsedErr: any = null;
        try { parsedErr = JSON.parse(errText); } catch {}
        const errMsg = parsedErr?.error?.message || errText.slice(0, 300) || `HTTP error ${resp.status}`;
        const isSafety =
          /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(errMsg) ||
          /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(errText);

        return res.status(resp.status).json({
          error: errMsg,
          isSafetyBlock: isSafety,
          rawBody: parsedErr || errText,
        });
      }

      const data = await resp.json();
      const createdId = data.id || data.voice?.id || data.name || data.voice?.name;
      // Strip massive 2MB sample_audio to avoid network failures and high memory usage
      res.json({
        id: createdId,
        name: createdId,
        voice: {
          id: createdId,
          name: createdId,
          display_name: data.display_name || data.voice?.display_name || displayName,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // 2. Synthesize Monologue (POST /v1beta/models/gemini-3.8-flash-tts:generateContent)
  app.post('/api/synthesize-monologue', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const {
        modelName = 'models/gemini-3.8-flash-tts',
        voiceId,
        fallbackVoice = 'Charon',
        compiledParts,
      } = req.body || {};

      if (!Array.isArray(compiledParts) || compiledParts.length === 0) {
        return res.status(400).json({ error: 'compiledParts array is required.' });
      }

      const modelPath = modelName.startsWith('models/') ? modelName : `models/${modelName}`;
      const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${encodeURIComponent(key)}`;
      const chosenVoice = voiceId || fallbackVoice || 'Charon';

      const payload = {
        contents: [
          {
            role: 'user',
            parts: compiledParts,
          },
        ],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              voice: chosenVoice,
            },
          },
        },
      };

      let resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });

      // If custom voice was pruned or invalid, fall back automatically to prebuilt voice
      if (!resp.ok && chosenVoice !== fallbackVoice) {
        console.warn(`[Server TTS] Voice "${chosenVoice}" failed (HTTP ${resp.status}). Retrying with fallback prebuilt voice "${fallbackVoice}"...`);
        const fallbackPayload = {
          contents: [
            {
              role: 'user',
              parts: compiledParts,
            },
          ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                voice: fallbackVoice || 'Charon',
              },
            },
          },
        };
        resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(fallbackPayload),
        });
      }

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: errText });
      }

      const data = await resp.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // Audio helper utilities for Multi-Character Audio Concatenation
  function extractPcmFromBase64(base64Str: string): Buffer {
    const buf = Buffer.from(base64Str, 'base64');
    if (buf.length > 44 && buf.toString('ascii', 0, 4) === 'RIFF') {
      const dataIdx = buf.indexOf('data');
      if (dataIdx !== -1 && dataIdx + 8 < buf.length) {
        return buf.subarray(dataIdx + 8);
      }
      return buf.subarray(44);
    }
    return buf;
  }

  function applyMicroFade(buf: Buffer, sampleRate = 24000) {
    const samples = Math.min(240, Math.floor(buf.length / 2));
    for (let i = 0; i < samples; i++) {
      const offset = buf.length - (samples - i) * 2;
      if (offset >= 0 && offset + 1 < buf.length) {
        const val = buf.readInt16LE(offset);
        const gain = (samples - i) / samples;
        buf.writeInt16LE(Math.round(val * gain), offset);
      }
    }
  }

  function buildWavFromPcmBuffer(pcmBuf: Buffer, sampleRate = 24000): Buffer {
    const numChannels = 1;
    const bitDepth = 16;
    const dataLen = pcmBuf.length;
    const byteRate = sampleRate * numChannels * (bitDepth / 8);
    const blockAlign = numChannels * (bitDepth / 8);

    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLen, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitDepth, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLen, 40);

    return Buffer.concat([header, pcmBuf]);
  }

  // 2B. Synthesize Multi-Character Dialogue (POST /api/synthesize-dialogue)
  app.post('/api/synthesize-dialogue', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const {
        modelName = 'models/gemini-3.8-flash-tts',
        turns,
      } = req.body || {};

      if (!Array.isArray(turns) || turns.length === 0) {
        return res.status(400).json({ error: 'turns array is required.' });
      }

      const modelPath = modelName.startsWith('models/') ? modelName : `models/${modelName}`;
      const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${encodeURIComponent(key)}`;

      console.log(`[Multi-Voice TTS] Synthesizing ${turns.length} dialogue turns with model ${modelPath}...`);

      // Synthesize turns with concurrency limit of 3 to avoid timeouts
      const pcmTurnResults: { turnIndex: number; pcm: Buffer; characterId: string; speakerName: string; style: string; text: string }[] = [];

      // Concurrency worker
      const queue = [...turns];
      const executeTurn = async (turn: any, index: number) => {
        const chosenVoice = turn.voiceId || turn.fallbackVoice || 'Aoede';
        const fallbackVoice = turn.fallbackVoice || 'Aoede';

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: turn.text,
                  speech_metadata: { style: turn.style || '' },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                voice: chosenVoice,
              },
            },
          },
        };

        let resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
        });

        // Fallback retry if custom voice ID was pruned or failed
        if (!resp.ok && chosenVoice !== fallbackVoice) {
          console.warn(`[Multi-Voice TTS] Turn ${index} voice "${chosenVoice}" failed (${resp.status}). Retrying with fallback voice "${fallbackVoice}"...`);
          const fbPayload = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: turn.text,
                    speech_metadata: { style: turn.style || '' },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  voice: fallbackVoice,
                },
              },
            },
          };
          resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(fbPayload),
          });
        }

        if (!resp.ok) {
          const errText = await resp.text();
          console.error(`[Multi-Voice TTS] Turn ${index} failed: ${errText.slice(0, 150)}`);
          // Generate 1 second of silence so the conversation sequence isn't broken
          return {
            turnIndex: index,
            pcm: Buffer.alloc(24000 * 2), // 1s silence
            characterId: turn.characterId,
            speakerName: turn.speakerName,
            style: turn.style,
            text: turn.text,
          };
        }

        const data = await resp.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const pcmChunks: Buffer[] = [];
        for (const p of parts) {
          if (p.inlineData?.data) {
            pcmChunks.push(extractPcmFromBase64(p.inlineData.data));
          }
        }
        const fullPcm = Buffer.concat(pcmChunks);
        if (fullPcm.length > 0) {
          applyMicroFade(fullPcm);
        }
        return {
          turnIndex: index,
          pcm: fullPcm.length > 0 ? fullPcm : Buffer.alloc(24000 * 2),
          characterId: turn.characterId,
          speakerName: turn.speakerName,
          style: turn.style,
          text: turn.text,
        };
      };

      // Run up to 3 turns concurrently
      const CONCURRENCY = 3;
      const turnResults: any[] = new Array(turns.length);
      let nextIdx = 0;

      async function worker() {
        while (nextIdx < turns.length) {
          const current = nextIdx++;
          try {
            turnResults[current] = await executeTurn(turns[current], current);
          } catch (e: any) {
            console.error(`[Multi-Voice TTS] Turn ${current} exception:`, e);
            turnResults[current] = {
              turnIndex: current,
              pcm: Buffer.alloc(24000 * 2),
              characterId: turns[current].characterId,
              speakerName: turns[current].speakerName,
              style: turns[current].style,
              text: turns[current].text,
            };
          }
        }
      }

      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, turns.length) }, () => worker()));

      // Assemble all turns into a continuous audio master with 0.22s natural dialogue pauses
      const pauseBytes = Math.round(24000 * 0.22) * 2; // 0.22s pause = 10,560 bytes
      const pauseBuf = Buffer.alloc(pauseBytes);

      const combinedPcmChunks: Buffer[] = [];
      const updatedTurns: any[] = [];
      let runningTimeSec = 0.0;

      for (let i = 0; i < turnResults.length; i++) {
        const item = turnResults[i];
        const durationSec = Number((item.pcm.length / (24000 * 2)).toFixed(2));
        const startSec = Number(runningTimeSec.toFixed(2));
        const endSec = Number((startSec + durationSec).toFixed(2));

        updatedTurns.push({
          turnIndex: i,
          characterId: item.characterId,
          speakerName: item.speakerName,
          style: item.style,
          text: item.text,
          start: startSec,
          end: endSec,
        });

        combinedPcmChunks.push(item.pcm);
        runningTimeSec = endSec;

        // Add pause after each turn except the last
        if (i < turnResults.length - 1) {
          combinedPcmChunks.push(pauseBuf);
          runningTimeSec += 0.22;
        }
      }

      const masterPcm = Buffer.concat(combinedPcmChunks);
      const wavBuffer = buildWavFromPcmBuffer(masterPcm, 24000);
      const wavBase64 = wavBuffer.toString('base64');

      console.log(`[Multi-Voice TTS] Successfully synthesized ${updatedTurns.length} turns! Total duration: ${runningTimeSec.toFixed(2)}s`);

      res.json({
        wavBase64,
        turns: updatedTurns,
        totalDurationSec: Number(runningTimeSec.toFixed(2)),
      });
    } catch (err: any) {
      console.error('[Multi-Voice TTS Error]', err);
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // 2C. Generate Multi-Character Story Script (Gemini Flash)
  app.post('/api/generate-dialogue-story', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const { sceneTopic, characters, language = 'en' } = req.body || {};
      const isArabic = language === 'ar';
      const models = ['models/gemini-2.5-flash', 'models/gemini-3.8-flash', 'models/gemini-3.5-flash'];

      const characterDescriptions = Array.isArray(characters)
        ? characters
            .map((c: any) => `- ID: "${c.id}", Name: "${c.name}", Role: "${c.role}", Category: "${c.category || 'general'}"`)
            .join('\n')
        : '- Character A: Detective\n- Character B: Suspect';

      const systemPrompt = isArabic
        ? `أنت كاتب سيناريو ومسرح درامي محترف للغاية. مطلوب منك كتابة نص حواري درامي مثير ومشوق من 6 إلى 8 مقاطع (turns) بين الشخصيات التالية:
${characterDescriptions}

سياق وفكرة المشهد:
"${sceneTopic || 'مواجهة درامية مثيرة ومؤثرة'}"

قواعد السيناريو الإلزامية:
1. وزّع الحوار بالتناوب الطبيعي بين هذه الشخصيات المحددة حصراً (استخدم نفس معرف الشخصية characterId واسمها speakerName).
2. يجب أن يعكس أسلوب كل شخصية فئتها العمرية ونوعها (مثلاً: إذا كانت الشخصية طفلاً، استخدم نبرة وبراءة طفولية وتساؤلات مرحة أو خائفة؛ وإذا كانت أنثى أو رجلاً أو شاباً فليكن الأسلوب معبراً ومتقناً).
3. اكتب الحوار باللغة العربية الفصيحة الدرامية الحية والمعبرة.
4. استخدم في نصوص الحوار (text) وسوماً صوتية تمثيلية بين أقواس مثلثية فقط: <laugh>, <chuckle>, <sigh>, <cough>, <breath>, <short pause>.
5. حدد في حقل "style" توجيهاً إخراجياً صوتياً دقيقاً ومفصلاً لكل مقطع (مثل: "صوت هامس مذعور قريب من الميكروفون"، "صوت طفل مرتفع ومتحمس يقفز فرحاً"، "صوت جهوري عميق وأجش"، "ضحكة خيبة مريرة").
6. أخرج النتيجة بتنسيق JSON حصراً.`
        : `You are an elite dramatic screenwriter creating a gripping, dynamic multi-character dialogue script of 6 to 8 turns between these characters:
${characterDescriptions}

Scene Setting / Scenario:
"${sceneTopic || 'Tense confrontation and revelation'}"

CRITICAL SCRIPT RULES:
1. Alternate turns naturally between the exact provided characters, matching their "characterId" and "speakerName".
2. Distinct vocal persona per character: Tailor dialogue and rhythm to their age and role (e.g. child characters should have innocent high-energy wonder or fear; youth characters rapid and spirited; adults commanding or empathetic).
3. Every turn's "text" must include 1 to 2 discrete vocal tags from: <laugh>, <chuckle>, <sigh>, <cough>, <breath>, <short pause>.
4. Provide a rich, descriptive "style" for each turn directing vocal tone, volume, and pacing.
5. Output pure JSON matching the schema.`;

      for (const m of models) {
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${m}:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  temperature: 0.85,
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: 'OBJECT',
                    properties: {
                      title: { type: 'STRING' },
                      turns: {
                        type: 'ARRAY',
                        items: {
                          type: 'OBJECT',
                          properties: {
                            characterId: { type: 'STRING' },
                            speakerName: { type: 'STRING' },
                            style: { type: 'STRING' },
                            text: { type: 'STRING' },
                          },
                          required: ['characterId', 'speakerName', 'style', 'text'],
                        },
                      },
                    },
                    required: ['title', 'turns'],
                  },
                },
              }),
            },
          );
          if (!resp.ok) continue;
          const data = await resp.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) continue;
          const parsed = JSON.parse(rawText);
          if (parsed && Array.isArray(parsed.turns) && parsed.turns.length >= 4) {
            return res.json(parsed);
          }
        } catch (e) {
          // try next model
        }
      }
      res.status(500).json({ error: 'Failed to generate dialogue story.' });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // 3. Generate 16-Beat Story Script (Gemini Flash)
  app.post('/api/generate-story', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const { sceneTopic, voiceDescription, language = 'en' } = req.body || {};
      const isArabic = language === 'ar';
      const models = ['models/gemini-2.5-flash', 'models/gemini-3.8-flash', 'models/gemini-3.5-flash'];
      const systemPrompt = isArabic
        ? `أنت كاتب سيناريو ومسرح درامي خبير ومحترف تقوم بكتابة مونولوج فيروسي مؤثر من 16 مشهداً شعورياً سريعاً لنظام الذكاء الاصطناعي الصوتي Gemini 3.8 Flash TTS.

فكرة المشهد أو السياق الدرامي:
"${sceneTopic || 'اعتراف درامي مثير'}"

شخصية ونبرة صوت المتحدث:
"${voiceDescription || 'ممثل درامي بصوت عميق ومؤثر'}"

اكتب مونولوجاً متصلاً ومثيراً بصيغة المتكلم (أنا) يتألف من 16 مشهداً درامياً سريعاً، حيث تتغير الحالة الشعورية وطريقة الإلقاء الصوتي بشكل درامي كل 3 إلى 4 ثوانٍ (16 مقطعاً، حوالي 14 إلى 22 كلمة لكل مقطع).

قوس التطور الشعوري الإلزامي عبر المشاهد الـ 16:
- Beat 01: صوت محادثة طبيعي واثق، مسترخٍ، متهكم وساخر (يتضمن <chuckle>)
- Beat 02: صوت واضح، استهزاء وسخرية، لا مبالاة (يتضمن <laugh> و <short pause>)
- Beat 03: صوت مسرحي مرتفع، تهكم مصطنع الأدب وتصنع البراءة (يتضمن <sigh> وكلمات بارزة للتأكيد)
- Beat 04: صوت حاد ومتقطع، انزعاج وغضب مباغت، اختفاء الابتسامة (يتضمن <short pause>)
- Beat 05: صوت محادثة متوتر، جفاف في الريق، تبرير دفاعي (يتضمن <cough> <short pause> و <breath>)
- Beat 06: صوت عميق صادر من الصدر، جليدي، تهديد بارد ومخيف (يتضمن <short pause>)
- Beat 07: صوت مرتفع مذعور، وتيرة سريعة ودفاعية، ذعر مع انكشاف الحقيقة (يتضمن <breath> و <short pause>)
- Beat 08: صوت مسموع واضح، ضحكة خيبة وألم مريرة على الخيانة (يتضمن <laugh> <sigh> و <chuckle>)
- Beat 09: أقصى درجات الصوت المدوية، صراخ وانفجار غضب هائل (يتضمن <breath>)
- Beat 10: انخفاض مفاجئ في الصوت، إنهاك تام وخروج الهواء من الصدر (يتضمن <sigh> <short pause> و <breath>)
- Beat 11: همس خافت حذر قريب من الميكروفون، ذعر وتكتم (يتضمن <breath> و <short pause>)
- Beat 12: عودة مباغتة لصوت جهوري مرتفع كامل الصدر (غير هامس)، مساومة يائسة وسريعة (يبدأ بـ <breath> وتوجيه Snap back to loud full-chest volume, NOT whispering)
- Beat 13: صوت متهدج ومكسور، حبس الدموع وهشاشة صادقة (يتضمن <sigh> و <breath> و <short pause>)
- Beat 14: صوت خادر وتائه، نظرة متبلدة في الفراغ، صدمة وخواء (يتضمن <sigh>)
- Beat 15: صوت دافئ هادئ، سخرية ذاتية وتهكم أسود (يتضمن <chuckle> و <short pause>)
- Beat 16: هدوء مميت، حاسم، اعتراف أخير بهدوء تام وسكون (يتضمن <breath> و <short pause>)

قواعد الوسوم الصوتية الإلزامية:
1. يجب كتابة نصوص الحوار (text) باللغة العربية الفصيحة المعبرة أو الدرامية الطبيعية.
2. احتفظ بالوسوم الصوتية الإنجليزية المحددة حصراً بين الأقواس المثلثة: <breath>, <laugh>, <chuckle>, <sigh>, <cough>, <short pause>.
3. في Beat 12 بعد الهمس، يجب أن يبدأ حقل "style" بالعبارة: "Snap back to loud full-chest volume, NOT whispering، صوت جهوري مرتفع"، وأن يبدأ "text" بـ "<breath>".
4. لا تضع أي توجيهات إخراجية بين أقواس دائرية () أو مربعة [] في النص المنطوق، فقط الوسوم المسموحة أعلاه.`
        : `You are a master dramatic screenwriter creating a viral "One Voice, 20 Emotions" monologue for Gemini 3.8 Flash TTS.

User's Scene / Setting / Subject:
"${sceneTopic || 'Dramatic confession'}"

Speaker Voice Persona:
"${voiceDescription || 'Compelling dramatic actor'}"

Write a gripping 16-beat continuous first-person monologue where the speaker's emotional and vocal direction shifts dramatically EVERY 3 TO 4 SECONDS (16 beats total, ~16–24 words per beat).

MANDATORY EMOTIONAL & VOLUME ARC ACROSS THE 16 BEATS:
- Beat 01: Full conversational volume, smug, cocky, amused composure (include <chuckle>)
- Beat 02: Full clear volume, dismissive mockery, laughing it off (include <laugh> and <short pause>)
- Beat 03: Projected room volume, overly polite theatrical sarcasm (include <sigh> and CAPS emphasis)
- Beat 04: Loud clipped volume, abrupt irritation, smile vanishing (include <short pause>)
- Beat 05: Normal conversational volume, nervous dry-mouthed excuse (include <cough> <short pause> and <breath>)
- Beat 06: Firm chest-resonating volume, low icy dangerous intimidation (include CAPS emphasis and <short pause>)
- Beat 07: Raised loud volume, rattled fast-paced panic as a twist hits (include <breath> and <short pause>)
- Beat 08: Full audible volume, bitter hollow gallows laughter at the betrayal (include <laugh> <sigh> and <chuckle>)
- Beat 09: Maximum booming shouting volume, explosive outburst of rage (include CAPS emphasis and <breath>)
- Beat 10: Sudden drop in volume, exhausted deflation, wind knocked out of them (include <sigh> <short pause> and <breath>)
- Beat 11: Paranoid, hushed close-mic whisper, urgent secrecy (include <breath> and <short pause>)
- Beat 12: SNAP BACK TO LOUD FULL-CHEST VOLUME, NOT whispering, desperate rapid-fire bargaining (start with <breath> + ALL-CAPS word, plus <short pause>)
- Beat 13: Clear full room volume, heartbroken voice trembling and cracking (include <sigh>, <breath>, and <short pause>)
- Beat 14: Audible conversational volume, numb thousand-yard stare, haunted (include <sigh>)
- Beat 15: Normal warm room volume, ironic self-deprecation and dark humor (include <chuckle> and <short pause>)
- Beat 16: Deadly calm, razor-sharp, whisper-quiet final confession (include <breath> and <short pause>)

CRITICAL TAGGING & VOLUME RULES:
1. VOLUME RESET AFTER QUIET BEATS: Whenever a beat follows a quiet/whispered beat (especially Beat 12 after Beat 11), its "style" MUST explicitly start with "Snap back to loud full-chest volume, NOT whispering," and its "text" MUST start with "<breath>" followed by an ALL-CAPS word so the TTS engine immediately raises the volume back up.
2. Every single beat's "text" MUST be strictly verbatim spoken dialogue containing 1 to 3 discrete vocal tags from this exact allowlist: <breath>, <laugh>, <chuckle>, <sigh>, <cough>, <short pause>.
3. Use ALL-CAPS on 1 or 2 key stressed words in most beats (e.g. THIS, SORRY, VERY, NEVER, ALL) to drive vocal emphasis.
4. Never put stage directions in parentheses or brackets in "text" (only the allowed angle-bracket vocal tags).`;

      for (const m of models) {
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${m}:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
                generationConfig: {
                  temperature: 0.85,
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: 'OBJECT',
                    properties: {
                      title: { type: 'STRING' },
                      beats: {
                        type: 'ARRAY',
                        items: {
                          type: 'OBJECT',
                          properties: {
                            beat: { type: 'STRING' },
                            style: { type: 'STRING' },
                            text: { type: 'STRING' },
                          },
                          required: ['beat', 'style', 'text'],
                        },
                      },
                    },
                    required: ['title', 'beats'],
                  },
                },
              }),
            },
          );
          if (!resp.ok) continue;
          const data = await resp.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) continue;
          const parsed = JSON.parse(rawText);
          if (parsed && parsed.beats && Array.isArray(parsed.beats) && parsed.beats.length >= 8) {
            return res.json(parsed);
          }
        } catch {}
      }
      res.status(500).json({ error: 'Failed to generate story with Gemini models.' });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // 4. Enhance Voice Prompt (Gemini Flash)
  app.post('/api/enhance-voice', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const { rawVoiceIdea, language = 'en' } = req.body || {};
      const isArabic = language === 'ar';
      const prompt = isArabic
        ? `حوّل هذه الفكرة المقتضبة عن الصوت إلى وصف احترافي دقيق من جملتين لتصميم صوت بشري لمحرّك تحويل النص إلى كلام (Voice Design prompt):
"${rawVoiceIdea || ''}"

قواعد مهمة وحاسمة:
1. صِف السمات الصوتية الجسدية الدائمة فقط: العمر التقريبي، الجنس، طبقة الصوت ورنينه (مثلاً: باريتون، باس، كونترالتو، سوبرانو)، ملمس الأوتار الصوتية (مثلاً: خشن، أجش، مخملي، عميق الصدر، نقي)، والإيقاع الطبيعي المعتاد للكلام.
2. لا تدرج أي حالات شعورية مؤقتة (لا تستخدم كلمات مثل: غاضب، حزين، يهمس، يضحك) لأن المشاعر يتم ضبطها لكل مشهد على حدة.
3. اكتب النتيجة النهائية فقط في جملتين واضحتين بدون أي مقدمات أو علامات تنصيص.`
        : `Transform this brief voice description into a concise, studio-grade 2-sentence Voice Design prompt for a text-to-speech engine:
"${rawVoiceIdea || ''}"

CRITICAL RULES:
1. Describe ONLY immutable physical vocal traits: approximate age, gender/pitch range (e.g. baritone, contralto, tenor), vocal cord texture (e.g. gravelly, velvety, papery, smoky, resonant), and natural cadence.
2. Do NOT include any temporary emotional states (never include words like angry, sad, whispering, laughing, nervous) because emotion is controlled separately per turn.
3. Output ONLY the enhanced 2-sentence description text with no quotes or preamble.`;

      const models = ['models/gemini-2.5-flash', 'models/gemini-3.8-flash', 'models/gemini-3.5-flash'];
      for (const m of models) {
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${m}:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                },
              }),
            },
          );
          if (!resp.ok) continue;
          const data = await resp.json();
          const text = data.candidates?.[0]?.content?.parts
            ?.map((p: any) => p.text || '')
            .join('')
            .trim();
          if (text) {
            return res.json({ enhancedPrompt: text.replace(/^["']|["']$/g, '') });
          }
        } catch {}
      }
      res.json({ enhancedPrompt: rawVoiceIdea });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // 5. Align Beats Multimodal Audio (Gemini Flash)
  app.post('/api/align-beats', async (req, res) => {
    try {
      const key = getApiKey(req);
      if (!key) {
        return res.status(400).json({ error: 'No Gemini API key available on server.' });
      }
      const { wavBase64, alignmentInstruction } = req.body || {};
      const candidateModels = [
        'models/gemini-2.5-flash',
        'models/gemini-3.5-flash-lite',
        'models/gemini-3.1-flash-lite',
      ];

      for (const alignModel of candidateModels) {
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${alignModel}:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      { inlineData: { mimeType: 'audio/wav', data: wavBase64 } },
                      { text: alignmentInstruction },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.0,
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        beat_index: { type: 'INTEGER' },
                        start_sec: { type: 'STRING' },
                        end_sec: { type: 'STRING' },
                      },
                      required: ['beat_index', 'start_sec', 'end_sec'],
                    },
                  },
                },
              }),
            },
          );
          if (!resp.ok) continue;
          const data = await resp.json();
          const rawJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawJsonText) continue;
          const parsed = JSON.parse(rawJsonText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({ modelUsed: alignModel, parsed });
          }
        } catch {}
      }
      res.status(500).json({ error: 'Alignment failed across models.' });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  // Logging persistence
  app.post('/api/alignment-log', (req, res) => {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        ...(req.body || {}),
      };
      console.log(`\n=== [ALIGNMENT INSPECTOR LOG @ ${entry.timestamp}] ===`);
      console.log(
        `Story: "${entry.storyTitle || 'Unknown'}" | Total Audio Duration: ${entry.totalDurationSec}s | Status: ${entry.status} | Model: ${entry.modelUsed || 'heuristic-only'}`,
      );
      if (entry.error) {
        console.log(`⚠️ Alignment Warning/Error: ${entry.error}`);
      }
      if (Array.isArray(entry.rows)) {
        for (const r of entry.rows) {
          console.log(
            `  Beat ${String(r.beatIndex + 1).padStart(2, '0')} | Init: ${r.initialStart}s–${r.initialEnd}s | GeminiRaw: ${r.geminiStart ?? 'N/A'}s–${r.geminiEnd ?? 'N/A'}s | FinalSnapped: ${r.finalStart}s–${r.finalEnd}s (Δ=${r.deltaSec}s)`,
          );
        }
      }
      console.log(`=========================================================\n`);

      let existing: any[] = [];
      if (fs.existsSync(ALIGNMENT_LOG_FILE)) {
        try {
          existing = JSON.parse(fs.readFileSync(ALIGNMENT_LOG_FILE, 'utf-8'));
        } catch {
          existing = [];
        }
      }
      existing.unshift(entry);
      fs.writeFileSync(ALIGNMENT_LOG_FILE, JSON.stringify(existing.slice(0, 25), null, 2), 'utf-8');
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  app.post('/api/voice-log', (req, res) => {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        ...(req.body || {}),
      };
      console.log(`\n=== [VOICE API LOG @ ${entry.timestamp}] ===`);
      console.log(`Endpoint: ${entry.endpoint || 'POST /v1beta/voices'}`);
      console.log(`Target Prompt: "${entry.prompt || 'None'}"`);
      console.log(`Model: ${entry.model || 'Unknown'}`);
      console.log(`Status: ${entry.status?.toUpperCase()} (HTTP ${entry.httpStatus ?? 'N/A'})`);
      if (entry.voiceId) {
        console.log(`✅ Success! Created Custom Voice ID: "${entry.voiceId}"`);
      }
      if (entry.error) {
        console.log(`❌ Error: ${entry.error}`);
      }
      if (entry.fallbackUsed) {
        console.log(`⚠️ Fallback Active: Prebuilt voice "${entry.fallbackUsed}" will be used for synthesis.`);
      }
      if (entry.responseBody) {
        console.log(`Response Body:`, JSON.stringify(entry.responseBody, null, 2));
      }
      console.log(`============================================\n`);

      let existing: any[] = [];
      if (fs.existsSync(VOICE_LOG_FILE)) {
        try {
          existing = JSON.parse(fs.readFileSync(VOICE_LOG_FILE, 'utf-8'));
        } catch {
          existing = [];
        }
      }
      existing.unshift(entry);
      fs.writeFileSync(VOICE_LOG_FILE, JSON.stringify(existing.slice(0, 30), null, 2), 'utf-8');
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  app.get('/api/voice-log', (_req, res) => {
    try {
      if (fs.existsSync(VOICE_LOG_FILE)) {
        res.json(JSON.parse(fs.readFileSync(VOICE_LOG_FILE, 'utf-8')));
      } else {
        res.json([]);
      }
    } catch {
      res.json([]);
    }
  });

  app.get('/api/alignment-log', (_req, res) => {
    try {
      if (fs.existsSync(ALIGNMENT_LOG_FILE)) {
        res.json(JSON.parse(fs.readFileSync(ALIGNMENT_LOG_FILE, 'utf-8')));
      } else {
        res.json([]);
      }
    } catch (err: any) {
      res.status(500).json({ error: err?.message || String(err) });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Monologue app running at http://localhost:${PORT}`);
  });
}

startServer();
