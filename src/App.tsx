import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Loader2,
  FileText,
  Settings,
  RotateCcw,
  Sparkles,
  X,
  AlertCircle,
  Trash2,
  Globe,
  Users,
  Mic,
  Compass,
  Plus,
  Volume2,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import {
  Language,
  TRANSLATIONS,
  AR_PRECINCT_69_TITLE,
  AR_PRECINCT_69_SUBTITLE,
  AR_PRECINCT_69_SYNOPSIS,
  AR_INITIAL_VOICE_DESIGN_PROMPT,
  AR_INITIAL_ACTING_BEATS,
  AR_VOICE_ARCHETYPES,
  AR_SCENE_PRESETS,
} from './i18n';
import {
  VOICE_CATALOG,
  VoicePersona,
  VoiceCategory,
  MULTI_CHARACTER_PRESETS,
  MultiCharacterStoryPreset,
  StoryCharacter,
  DialogueTurn,
} from './voiceCatalog';

// ============================================================================
// 1. Preset 16-Beat Screenplay ("Precinct 69 Transcripts")
// ============================================================================
export interface ActingBeat {
  index: number;
  beat: string;
  style: string;
  text: string;
  start: number;
  end: number;
}

export const PRECINCT_69_TITLE = 'The Detective’s Confession';
export const PRECINCT_69_SUBTITLE = 'One Voice ID Across 16 Emotional States';
export const PRECINCT_69_SYNOPSIS =
  'It’s 2:14 AM in Interrogation Room B. Listen as retired Brooklyn detective Marco Giancana unravels across 16 rapid emotional turns—laughing, coughing, shouting, and whispering—all generated from a single voice description.';

export const INITIAL_VOICE_DESIGN_PROMPT =
  'A 62-year-old retired Brooklyn homicide detective. Heavy, gravelly pack-a-day baritone with deep chest resonance, weathered vocal cords, and an authentic old-school flat New York street cadence.';

export const INITIAL_ACTING_BEATS: ActingBeat[] = [
  {
    index: 0,
    beat: '01. Smug & Untouchable',
    style: 'Cocky, relaxed, leaning back in a metal chair, slow amused Brooklyn drawl',
    text: "<chuckle> Twenty-eight years I worked the /kwəˈnɑːrsi/ Canarsie precinct, kid, and you think THIS little folder is gonna sweat me?",
    start: 0,
    end: 5,
  },
  {
    index: 1,
    beat: '02. Dismissive Mockery',
    style: 'Dismissive, laughing through the nose, patronizing and unbothered',
    text: "<laugh> Come on, look at your hands, they're shaking more than mine! <short pause> Sit down before you hurt yourself.",
    start: 5,
    end: 10,
  },
  {
    index: 2,
    beat: '03. Fake-Polite Sarcasm',
    style: 'Overly theatrical, mock-innocent, dripping with sarcasm, slow deliberate emphasis',
    text: "Oh, I'm SORRY, did my alibi inconvenience your little timeline? <sigh> My heart bleeds for Internal Affairs.",
    start: 10,
    end: 15,
  },
  {
    index: 3,
    beat: '04. Sudden Irritation',
    style: 'Loud, sharp, abruptly annoyed, smile vanishing, leaning forward',
    text: 'Wait a second. <short pause> Where did you get that bank ledger? That file was sealed by a grand jury.',
    start: 15,
    end: 20,
  },
  {
    index: 4,
    beat: '05. Nervous & Dry-Mouthed',
    style: 'Caught off guard, defensive, dry mouth, slightly rushed and uneasy',
    text: '<cough> <short pause> Look, that wire transfer in November was an informant payout, alright? <breath> Everyone in Narcotics signed off on it.',
    start: 20,
    end: 26,
  },
  {
    index: 5,
    beat: '06. Icy Intimidation',
    style: 'Low, dangerous, gravelly rumble, slow and menacing, dead-eyed',
    text: "You listen to me VERY carefully right now. <short pause> You keep pulling that thread, you're gonna bury half the brass in One Police Plaza.",
    start: 26,
    end: 32,
  },
  {
    index: 6,
    beat: '07. Rattled & Spiraling',
    style: 'Raised loud volume, rattled, fast-paced, defensive, losing composure as the trap closes',
    text: "<breath> Wait—Moretti wore a WIRE?! <short pause> No, no, no, Moretti was my partner for twelve years, he wouldn't flip on me!",
    start: 32,
    end: 38,
  },
  {
    index: 7,
    beat: '08. Bitter Gallows Laugh',
    style: 'Bitter, hollow, cynical laughter, disgusted realization, shaking head',
    text: '<laugh> <sigh> A wire. In my own kitchen. <chuckle> While my wife was pouring him coffee. Unbelievable.',
    start: 38,
    end: 44,
  },
  {
    index: 8,
    beat: '09. Explosive Outburst',
    style: 'Maximum booming volume, furious, veins popping, raw betrayal and righteous rage',
    text: 'I took TWO bullets for that rat in East New York! <breath> I kept his pension alive when he was face-down in a bottle!',
    start: 44,
    end: 50,
  },
  {
    index: 9,
    beat: '10. Sudden Deflation',
    style: 'Sudden drop in volume, exhausted, heavy, wind completely knocked out of him',
    text: '<sigh> <short pause> Turn the tape off. <breath> Just... turn the damn recorder off for ten seconds.',
    start: 50,
    end: 55,
  },
  {
    index: 10,
    beat: '11. Claustrophobic Whisper',
    style: 'Paranoid, hushed close-mic whisper, leaning right across the table, urgent',
    text: '<breath> Keep your voice down, the walls in this precinct bleed. <short pause> You have NO idea who actually owns that dockyard.',
    start: 55,
    end: 61,
  },
  {
    index: 11,
    beat: '12. Desperate Bargaining',
    style: 'Snap back to LOUD full-chest volume, NOT whispering, desperate, breathless, pleading, rapid pacing',
    text: "<breath> GIVE me immunity on the evidence room and I'll hand you the deputy commissioner on a silver platter! <short pause> Names, dates, offshore accounts, ALL of it!",
    start: 61,
    end: 68,
  },
  {
    index: 12,
    beat: '13. Voice Cracking / Broken',
    style: 'Heartbroken, voice trembling and cracking, holding back tears, fragile',
    text: "<sigh> My daughter starts at Columbia in three weeks. <breath> If she sees me perp-walked on the six o'clock news... <short pause> it'll kill her.",
    start: 68,
    end: 75,
  },
  {
    index: 13,
    beat: '14. Haunted & Hollow',
    style: 'Numb, hollow, thousand-yard stare, slow, flat, haunted',
    text: "You step across the line once to save a kid on a rooftop... <sigh> and ten years later you don't even recognize the guy in the mirror.",
    start: 75,
    end: 81,
  },
  {
    index: 14,
    beat: '15. Dark Self-Deprecation',
    style: 'Resigned, ironic self-deprecation, tired old-man warmth',
    text: '<chuckle> Hell of a retirement party, huh? <short pause> No gold watch, just a pair of stainless steel bracelets.',
    start: 81,
    end: 86,
  },
  {
    index: 15,
    beat: '16. Ice-Cold Final Confession',
    style: 'Deadly calm, razor-sharp, whisper-quiet finality, total stillness',
    text: "<breath> Turn the tape back on, detective. <short pause> I'll tell you where the key to the locker is buried.",
    start: 86,
    end: 92,
  },
];

export const VOICE_ARCHETYPES = [
  {
    id: 'smoky-baritone',
    label: 'Smoky Resonant Baritone',
    prompt:
      'A 55-year-old man with a resonant, smoky baritone, measured cadence, and grounded conversational warmth.',
  },
  {
    id: 'gravelly-bass',
    label: 'Gravelly Low Bass',
    prompt:
      'A 44-year-old man with a heavy, gravelly low bass, deep chest rumble, and a gritty, deliberate delivery.',
  },
  {
    id: 'velvety-contralto',
    label: 'Crisp Velvety Contralto',
    prompt:
      'A 68-year-old woman with a velvety, crystalline Received Pronunciation contralto, razor-sharp diction, and dry understated poise.',
  },
  {
    id: 'warm-soprano',
    label: 'Warm Melodic Soprano',
    prompt:
      'A 29-year-old woman with a warm, melodic soprano, clear articulation, and bright, expressive conversational pacing.',
  },
];

export const SCENE_PRESETS = [
  {
    id: 'wagyu',
    label: 'Ketchup on Wagyu',
    prompt: 'A Michelin chef catches a VIP guest pouring ketchup onto a 60-day dry-aged Wagyu ribeye',
  },
  {
    id: 'airlock',
    label: 'Sabotaged Airlock',
    prompt: 'A mission commander realizes the deep-space airlock was opened from the inside',
  },
  {
    id: 'vermeer',
    label: 'Stolen Vermeer',
    prompt: 'An antique appraiser realizes the "worthless" attic painting is a stolen Vermeer',
  },
  {
    id: 'alibi',
    label: 'Best Man Alibi',
    prompt: 'A best man realizes mid-speech that the groom used his wedding as an alibi for a heist',
  },
];

/**
 * Dynamically resolves prebuilt fallback voice based on user's voice prompt description.
 * - Male / man / baritone -> Charon
 * - Female / woman / contralto -> Sulafat
 */
export function getDynamicFallbackVoice(voicePrompt: string, manualFallback = 'auto'): string {
  if (manualFallback && manualFallback !== 'auto') {
    return manualFallback;
  }
  if (!voicePrompt) {
    return 'Charon';
  }
  const text = voicePrompt.toLowerCase();

  const femaleMatches =
    text.match(
      /\b(female|females|woman|women|girl|girls|lady|ladies|actress|actresses|she|her|hers|herself|mother|mom|daughter|daughters|sister|sisters|aunt|matron|grandmother|grandma|contralto|soprano|mezzo-soprano|mezzo|feminine|heroine|waitress|princess|queen|empress|wife|niece|schoolgirl|duchess)\b/gi,
    ) || [];

  const maleMatches =
    text.match(
      /\b(male|males|man|men|guy|guys|boy|boys|gentleman|gentlemen|actor|actors|he|him|his|himself|father|dad|son|sons|brother|brothers|uncle|patron|grandfather|grandpa|baritone|bass|tenor|masculine|hero|waiter|prince|king|emperor|husband|nephew|schoolboy|duke)\b/gi,
    ) || [];

  if (femaleMatches.length > maleMatches.length) {
    return 'Sulafat';
  }
  if (maleMatches.length > femaleMatches.length) {
    return 'Charon';
  }

  if (/\b(female|woman|girl|lady|contralto|soprano|feminine)\b/i.test(text)) {
    return 'Sulafat';
  }
  if (/\b(male|man|boy|baritone|bass|tenor|masculine)\b/i.test(text)) {
    return 'Charon';
  }

  return 'Charon';
}

// ============================================================================
// 2. 24kHz PCM, WAV Builder & Gemini 3.5 Flash Lite Multimodal Aligner
// ============================================================================
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(sub));
  }
  return window.btoa(binary);
}

/**
 * Extracts strictly the raw 16-bit linear PCM audio samples from the 'data' chunk
 * of a RIFF WAVE stream. Discards all metadata, IPTC watermarks, and C2PA manifest chunks
 * (which otherwise play as a loud burst of harsh static/glitch noise at the end of the audio).
 */
function extractRawPcm(bytes: Uint8Array): Uint8Array {
  // Check for 'RIFF' header and 'WAVE' format tag
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 && // 'R'
    bytes[1] === 0x49 && // 'I'
    bytes[2] === 0x46 && // 'F'
    bytes[3] === 0x46 && // 'F'
    bytes[8] === 0x57 && // 'W'
    bytes[9] === 0x41 && // 'A'
    bytes[10] === 0x56 && // 'V'
    bytes[11] === 0x45    // 'E'
  ) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 12; // Start scanning chunks right after 'RIFF....WAVE'

    while (offset + 8 <= bytes.length) {
      const chunkId =
        String.fromCharCode(bytes[offset]) +
        String.fromCharCode(bytes[offset + 1]) +
        String.fromCharCode(bytes[offset + 2]) +
        String.fromCharCode(bytes[offset + 3]);
      const chunkSize = view.getUint32(offset + 4, true);
      const chunkDataStart = offset + 8;

      if (chunkId === 'data') {
        const pcmEnd = Math.min(chunkDataStart + chunkSize, bytes.length);
        // Ensure 16-bit word alignment (even byte count)
        const validLen = (pcmEnd - chunkDataStart) & ~1;
        return bytes.slice(chunkDataStart, chunkDataStart + validLen);
      }

      // RIFF chunks are padded to 2-byte boundary
      offset = chunkDataStart + chunkSize + (chunkSize % 2);
    }

    // Fallback: If 'data' chunk header was somehow missing, slice standard 44-byte header
    return bytes.slice(44);
  }
  return bytes;
}

function buildWavBytesFromPcm(pcmBytes: Uint8Array, sampleRate = 24000): Uint8Array {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const uint8 = new Uint8Array(buffer);
  uint8.set(pcmBytes, 44);
  return uint8;
}

function buildWavFromPcm(pcmBytes: Uint8Array, sampleRate = 24000): Blob {
  const wavUint8 = buildWavBytesFromPcm(pcmBytes, sampleRate);
  return new Blob([wavUint8 as unknown as BlobPart], { type: 'audio/wav' });
}

function build8kWavBase64ForAlignment(pcm24k: Uint8Array): string {
  const srcSamples = new Int16Array(
    pcm24k.buffer,
    pcm24k.byteOffset,
    Math.floor(pcm24k.byteLength / 2),
  );
  const ratio = 3; // 24000 / 8000
  const dstLen = Math.floor(srcSamples.length / ratio);
  const dstSamples = new Int16Array(dstLen);
  for (let i = 0; i < dstLen; i++) {
    dstSamples[i] = srcSamples[i * ratio];
  }
  const pcm8kBytes = new Uint8Array(
    dstSamples.buffer,
    dstSamples.byteOffset,
    dstSamples.byteLength,
  );
  const wav8kBytes = buildWavBytesFromPcm(pcm8kBytes, 8000);
  return uint8ArrayToBase64(wav8kBytes);
}

function snapToSilenceValley(
  pcm24k: Uint8Array,
  targetSec: number,
  sampleRate = 24000,
  searchRadiusSec = 0.65,
): number {
  const int16 = new Int16Array(
    pcm24k.buffer,
    pcm24k.byteOffset,
    Math.floor(pcm24k.byteLength / 2),
  );
  // Use a 140ms window so we lock onto true inter-sentence pauses rather than brief mid-word stop consonants
  const windowSamples = Math.floor(sampleRate * 0.14);
  const searchRadius = Math.floor(sampleRate * searchRadiusSec);
  const centerSample = Math.floor(targetSec * sampleRate);
  const minSample = Math.max(windowSamples, centerSample - searchRadius);
  const maxSample = Math.min(int16.length - windowSamples - 1, centerSample + searchRadius);

  if (maxSample <= minSample) return targetSec;

  let bestSample = centerSample;
  let lowestScore = Infinity;
  const step = Math.floor(sampleRate * 0.015);

  for (let s = minSample; s <= maxSample; s += step) {
    let sumAbs = 0;
    for (let k = 0; k < windowSamples; k += 4) {
      sumAbs += Math.abs(int16[s + k]);
    }
    const avgAmp = sumAbs / (windowSamples / 4);
    const distSec = Math.abs(s - centerSample) / sampleRate;
    // Gentle distance penalty so a real silence valley 0.4s away beats loud speech at 0.0s
    const score = avgAmp + distSec * 185;
    if (score < lowestScore) {
      lowestScore = score;
      bestSample = s + Math.floor(windowSamples * 0.6);
    }
  }
  return bestSample / sampleRate;
}

export interface AlignmentInspectorRow {
  beatIndex: number;
  beatLabel: string;
  initialStart: number;
  initialEnd: number;
  geminiStart: number | null;
  geminiEnd: number | null;
  finalStart: number;
  finalEnd: number;
  deltaSec: number;
}

export interface AlignmentInspectorReport {
  storyTitle: string;
  totalDurationSec: number;
  status: 'heuristic-initial' | 'gemini-aligned' | 'gemini-fallback-error' | 'multi-chunk-exact';
  modelUsed: string;
  error?: string;
  rows: AlignmentInspectorRow[];
  updatedAt: string;
}

export interface VoiceApiLogEntry {
  id: string;
  timestamp: string;
  endpoint: string;
  prompt: string;
  displayName: string;
  model: string;
  status: 'pending' | 'success' | 'failed';
  httpStatus?: number;
  voiceId?: string;
  responseBody?: any;
  error?: string;
  fallbackUsed?: string;
  durationMs?: number;
}

async function postVoiceLogToServer(entry: VoiceApiLogEntry) {
  try {
    const cleanEntry = {
      ...entry,
      responseBody:
        entry.responseBody && typeof entry.responseBody === 'object' && entry.responseBody.sample_audio
          ? { ...entry.responseBody, sample_audio: '[truncated]' }
          : entry.responseBody,
    };
    await fetch('/api/voice-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanEntry),
    });
  } catch {
    // ignore
  }
}

async function postAlignmentLogToServer(report: AlignmentInspectorReport) {
  try {
    console.groupCollapsed(
      `[Alignment Inspector] ${report.storyTitle} (${report.status} via ${report.modelUsed})`,
    );
    console.table(report.rows);
    if (report.error) console.warn('Alignment warning:', report.error);
    console.groupEnd();

    await fetch('/api/alignment-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
  } catch {
    // ignore in static browser-only mode
  }
}

function buildInitialTimestamps(
  beats: ActingBeat[],
  pcmChunks: Uint8Array[],
  mergedPcm: Uint8Array,
  sampleRate = 24000,
): ActingBeat[] {
  const totalDurationSec = mergedPcm.length / (sampleRate * 2);

  if (pcmChunks.length === beats.length) {
    let cursor = 0;
    return beats.map((b, i) => {
      const dur = pcmChunks[i].length / (sampleRate * 2);
      const start = cursor;
      const end = cursor + dur;
      cursor = end;
      return { ...b, start: Number(start.toFixed(2)), end: Number(end.toFixed(2)) };
    });
  }

  const weights = beats.map((b) => {
    const cleanWords = b.text
      .replace(/<[^>]+>/g, ' ')
      .replace(/\/[^/]+\//g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const charCount = cleanWords.join('').length;
    let baseSec = charCount * 0.058 + cleanWords.length * 0.14;

    const pauses = (b.text.match(/<short pause>/gi) || []).length;
    const sighs = (b.text.match(/<sigh>/gi) || []).length;
    const laughs = (b.text.match(/<laugh>/gi) || []).length;
    const chuckles = (b.text.match(/<chuckle>/gi) || []).length;
    const coughs = (b.text.match(/<cough>/gi) || []).length;
    const breaths = (b.text.match(/<breath>/gi) || []).length;
    const ellipses = (b.text.match(/\.\.\.|…/g) || []).length;

    baseSec +=
      pauses * 0.58 +
      sighs * 0.78 +
      laughs * 0.82 +
      chuckles * 0.58 +
      coughs * 0.48 +
      breaths * 0.38 +
      ellipses * 0.65;

    // Slow/whispered/broken/deflated beats (typically Beats 10–16) are spoken ~22% slower per syllable
    const isSlowDelivery =
      /\b(whisper|hushed|slow|deflation|exhausted|cracking|broken|trembling|numb|hollow|stare|resigned|calm|stillness|finality)\b/i.test(
        `${b.beat} ${b.style}`,
      ) && !/\b(rapid|fast-paced|rushed)\b/i.test(b.style);

    const isFastDelivery = /\b(rapid|fast-paced|rushed|spiraling)\b/i.test(b.style);

    if (isSlowDelivery) {
      baseSec *= 1.22;
    } else if (isFastDelivery) {
      baseSec *= 0.9;
    }

    return baseSec + 0.45;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  let runningWeight = 0;
  const boundaries: number[] = [0.0];
  for (let i = 0; i < beats.length - 1; i++) {
    runningWeight += weights[i];
    const rawTargetSec = (runningWeight / totalWeight) * totalDurationSec;
    const snapped = snapToSilenceValley(mergedPcm, rawTargetSec, sampleRate, 0.55);
    const prev = boundaries[boundaries.length - 1];
    boundaries.push(Math.max(prev + 1.2, Math.min(totalDurationSec - 1.0, snapped)));
  }
  boundaries.push(totalDurationSec);

  return beats.map((b, i) => ({
    ...b,
    start: Number(boundaries[i].toFixed(2)),
    end: Number(boundaries[i + 1].toFixed(2)),
  }));
}

// Decode Gemini's native audio timestamps whether returned as "1:05.82", 105.82 (colon-stripped MMSS.ss), or 65.82
function parseGeminiTimestamp(
  rawVal: string | number | undefined | null,
  prevSec: number,
  totalDurationSec: number,
): number | null {
  if (rawVal === undefined || rawVal === null) return null;
  const str = String(rawVal).trim();
  if (!str) return null;

  // Case 1: Explicit "MM:SS.ss" string (e.g. "1:05.82" -> 65.82s)
  if (str.includes(':')) {
    const parts = str.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return Number((parts[0] * 60 + parts[1]).toFixed(2));
    }
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return Number((parts[0] * 3600 + parts[1] * 60 + parts[2]).toFixed(2));
    }
  }

  const num = Number(str);
  if (isNaN(num)) return null;

  // Case 2: Colon-stripped MMSS.ss number (e.g., 105.82 after 59.54 means 1:05.82 = 65.82s, Adding +40s!)
  if (num >= 100) {
    const mins = Math.floor(num / 100);
    const secs = num - mins * 100;
    if (secs < 60) {
      const asMmSs = Number((mins * 60 + secs).toFixed(2));
      // If raw num jumped >25s ahead of prevSec (or exceeds totalDurationSec) while asMmSs is right after prevSec:
      if (num > totalDurationSec + 0.5 || (num - prevSec > 25 && asMmSs >= prevSec - 0.5)) {
        return asMmSs;
      }
    }
  }

  return Number(num.toFixed(2));
}

async function alignBeatsWithGeminiFlashLite(
  mergedPcm24k: Uint8Array,
  initialBeats: ActingBeat[],
  storyTitle: string,
  apiKey: string,
): Promise<{ alignedBeats: ActingBeat[] | null; report: AlignmentInspectorReport }> {
  const totalDurationSec = Number((mergedPcm24k.length / (24000 * 2)).toFixed(2));
  // Send the clean 24kHz WAV directly (no 8kHz downsampling/aliasing)
  const wavBytes = buildWavBytesFromPcm(mergedPcm24k, 24000);
  const wavBase64 = uint8ArrayToBase64(wavBytes);

  // Strip <vocal tags> and /IPA/ so Gemini simply matches the spoken words of each line
  const scriptLinesPrompt = initialBeats
    .map((b, idx) => {
      const cleanSpokenWords = b.text
        .replace(/<[^>]+>/g, ' ')
        .replace(/\/[^/]+\//g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return `${idx}: "${cleanSpokenWords}"`;
    })
    .join('\n');

  const alignmentInstruction = `Listen to the audio and match each of the ${initialBeats.length} storyline lines below to the exact timestamp (in MM:SS.ss format, e.g. "0:08.35", "0:59.54", "1:05.82") when that line starts and ends in the audio.

Storyline lines:
${scriptLinesPrompt}`;

  try {
    const resp = await fetch('/api/align-beats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        wavBase64,
        alignmentInstruction,
        apiKey,
      }),
    });

    if (resp.ok) {
      const data = await resp.json();
      const parsed = data.parsed;
      const alignModel = data.modelUsed || 'gemini-2.5-flash';

      if (Array.isArray(parsed) && parsed.length > 0) {
        const byIndex = new Map<number, { start_sec: string | number; end_sec: string | number }>();
        for (const item of parsed) {
          if (typeof item?.beat_index === 'number') {
            byIndex.set(item.beat_index, item);
          }
        }

        let runningPrevSec = 0.0;
        const alignedBeats: ActingBeat[] = initialBeats.map((b, i) => {
          const item = byIndex.get(i) || parsed[i];
          const parsedStart = parseGeminiTimestamp(item?.start_sec, runningPrevSec, totalDurationSec);
          const start = i === 0 ? 0.0 : parsedStart !== null ? parsedStart : runningPrevSec;
          const parsedEnd = parseGeminiTimestamp(item?.end_sec, start, totalDurationSec);
          const end =
            i === initialBeats.length - 1
              ? totalDurationSec
              : parsedEnd !== null && parsedEnd > start
                ? parsedEnd
                : b.end;
          runningPrevSec = end;
          return { ...b, start, end };
        });

        const rows: AlignmentInspectorRow[] = alignedBeats.map((b, i) => ({
          beatIndex: i,
          beatLabel: b.beat,
          initialStart: initialBeats[i].start,
          initialEnd: initialBeats[i].end,
          geminiStart: b.start,
          geminiEnd: b.end,
          finalStart: b.start,
          finalEnd: b.end,
          deltaSec: Number((b.end - initialBeats[i].end).toFixed(2)),
        }));

        const report: AlignmentInspectorReport = {
          storyTitle,
          totalDurationSec,
          status: 'gemini-aligned',
          modelUsed: alignModel,
          rows,
          updatedAt: new Date().toLocaleTimeString(),
        };

        return { alignedBeats, report };
      }
    }
  } catch (e: any) {
    console.warn('[Alignment] Server align endpoint warning:', e);
  }

  const fallbackReport: AlignmentInspectorReport = {
    storyTitle,
    totalDurationSec,
    status: 'gemini-fallback-error',
    modelUsed: 'initial-estimate',
    error: 'Alignment endpoint returned fallback estimate.',
    rows: initialBeats.map((b, i) => ({
      beatIndex: i,
      beatLabel: b.beat,
      initialStart: b.start,
      initialEnd: b.end,
      geminiStart: null,
      geminiEnd: null,
      finalStart: b.start,
      finalEnd: b.end,
      deltaSec: 0,
    })),
    updatedAt: new Date().toLocaleTimeString(),
  };

  return { alignedBeats: null, report: fallbackReport };
}

// ============================================================================
// 3. Gemini 3.8 Flash AI Voice Prompt Enhancer & 16-Beat Story Generator
// ============================================================================
async function enhanceVoicePromptWithGemini38Flash(
  rawVoiceIdea: string,
  apiKey: string,
  language: Language = 'en',
): Promise<string> {
  try {
    const resp = await fetch('/api/enhance-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ rawVoiceIdea, apiKey, language }),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.enhancedPrompt) return data.enhancedPrompt;
    }
  } catch (err) {
    console.warn('[Voice Enhancer] Server endpoint fallback:', err);
  }
  return rawVoiceIdea;
}

interface GeneratedStoryResult {
  title: string;
  beats: ActingBeat[];
}

async function generate16BeatStoryWithGemini38Flash(
  sceneTopic: string,
  voiceDescription: string,
  apiKey: string,
  language: Language = 'en',
): Promise<GeneratedStoryResult> {
  try {
    const resp = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ sceneTopic, voiceDescription, apiKey, language }),
    });
    if (resp.ok) {
      const parsed = await resp.json();
      if (Array.isArray(parsed.beats) && parsed.beats.length >= 8) {
        const formattedBeats: ActingBeat[] = parsed.beats.slice(0, 16).map((b: any, i: number) => ({
          index: i,
          beat: b.beat || `${String(i + 1).padStart(2, '0')}. Beat ${i + 1}`,
          style: String(b.style || '').replace(/^["']|["']$/g, ''),
          text: String(b.text || ''),
          start: i * 5,
          end: (i + 1) * 5,
        }));
        return {
          title: parsed.title || 'Custom Studio Monologue',
          beats: formattedBeats,
        };
      }
    }
  } catch (err) {
    console.warn('[Story Generator] Server endpoint error:', err);
  }
  throw new Error('Failed to generate storyline with Gemini 3.8 Flash.');
}

// Render inline <tags> and /IPA/ inside each story line with clean, subtle styling
function renderStoryLineWithTags(text: string) {
  const parts = text.split(/(<[^>]+>|\/[^/]+\/)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('<') && part.endsWith('>')) {
      return (
        <span
          key={idx}
          className="inline-block font-mono-code text-[12px] sm:text-[13.5px] font-medium px-1.5 py-0.5 mx-0.5 rounded-[4px] bg-[#F4F4F2] text-[#75736E] border border-[#E4E2DC] align-baseline tracking-tight select-all"
        >
          {part}
        </span>
      );
    }
    if (part.startsWith('/') && part.endsWith('/')) {
      return (
        <span
          key={idx}
          className="inline-block font-mono-code text-[12px] sm:text-[13.5px] font-medium px-1.5 py-0.5 mx-0.5 rounded-[4px] bg-[#F4F4F2] text-[#75736E] border border-[#E4E2DC] align-baseline select-all"
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function App() {
  // Language State: 'en' | 'ar'
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('monologue_lang');
    if (saved === 'ar' || saved === 'en') return saved;
    if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ar')) {
      return 'ar';
    }
    return 'en';
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('monologue_lang', lang);
  }, [lang]);

  // API Key & Model state
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('GEMINI_TTS_API_KEY') ||
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      ''
    );
  });
  const [modelName, setModelName] = useState<'models/gemini-3.8-flash-tts' | 'models/gemini-3.8-flash-lite-tts'>(
    'models/gemini-3.8-flash-tts',
  );

  const currentArchetypes = lang === 'ar' ? AR_VOICE_ARCHETYPES : VOICE_ARCHETYPES;
  const currentScenePresets = lang === 'ar' ? AR_SCENE_PRESETS : SCENE_PRESETS;

  // Front-Page Mode: 'preset' (Precinct 69 Transcripts) vs 'custom' (Create Your Own)
  const [storySourceMode, setStorySourceMode] = useState<'preset' | 'custom'>('preset');
  const [storyTitle, setStoryTitle] = useState<string>(() => (lang === 'ar' ? AR_PRECINCT_69_TITLE : PRECINCT_69_TITLE));

  // Custom Story & Voice Builder State
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>(VOICE_ARCHETYPES[0].id);
  const [customVoiceInput, setCustomVoiceInput] = useState<string>(() =>
    lang === 'ar' ? AR_VOICE_ARCHETYPES[0].prompt : VOICE_ARCHETYPES[0].prompt,
  );
  const [isEnhancingVoice, setIsEnhancingVoice] = useState<boolean>(false);
  const [selectedScenePresetId, setSelectedScenePresetId] = useState<string>(SCENE_PRESETS[0].id);
  const [customSceneTopic, setCustomSceneTopic] = useState<string>(() =>
    lang === 'ar' ? AR_SCENE_PRESETS[0].prompt : SCENE_PRESETS[0].prompt,
  );

  // Active Voice Design & Beats State
  const [voicePrompt, setVoicePrompt] = useState<string>(() =>
    lang === 'ar' ? AR_INITIAL_VOICE_DESIGN_PROMPT : INITIAL_VOICE_DESIGN_PROMPT,
  );
  const [voiceId, setVoiceId] = useState<string>('');
  const [fallbackPrebuiltVoice, setFallbackPrebuiltVoice] = useState<string>('auto');
  const [beats, setBeats] = useState<ActingBeat[]>(() =>
    lang === 'ar' ? AR_INITIAL_ACTING_BEATS : INITIAL_ACTING_BEATS,
  );
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const [isStoryMode, setIsStoryMode] = useState<boolean>(false);

  // Cache for Precinct 69 vs Custom WAV so switching back to Precinct 69 keeps it ready
  const [presetWavCache, setPresetWavCache] = useState<{
    url: string | null;
    beats: ActingBeat[];
    voiceId: string;
  }>({
    url: null,
    beats: lang === 'ar' ? AR_INITIAL_ACTING_BEATS : INITIAL_ACTING_BEATS,
    voiceId: '',
  });

  // Modals (Script & Tags Drawer + Settings Drawer)
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'script' | 'settings'>('none');
  const [alignmentReport, setAlignmentReport] = useState<AlignmentInspectorReport | null>(null);
  const [voiceApiLogs, setVoiceApiLogs] = useState<VoiceApiLogEntry[]>([]);

  // Load existing voice API logs from server on mount
  useEffect(() => {
    fetch('/api/voice-log')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVoiceApiLogs(data);
        }
      })
      .catch(() => {});
  }, []);

  // Top Studio Mode: 'solo' (Solo 16-Beat Monologue) vs 'multi' (Multi-Character Ensemble Story)
  const [appMode, setAppMode] = useState<'solo' | 'multi'>('solo');

  // Multi-Character Mode States
  const [multiSubMode, setMultiSubMode] = useState<'preset' | 'custom'>('preset');
  const [selectedMultiPresetId, setSelectedMultiPresetId] = useState<string>(MULTI_CHARACTER_PRESETS[0].id);

  // Cast of Characters for Custom Dialogue Story
  const [customCast, setCustomCast] = useState<StoryCharacter[]>(() => [
    {
      id: 'char-1',
      name: lang === 'ar' ? 'المحقق كريم' : 'Det. Karim',
      role: lang === 'ar' ? 'محقق جرائم غامضة' : 'Lead Detective',
      category: 'male',
      voicePersonaId: 'charon-male',
      fallbackVoice: 'Charon',
      avatarEmoji: '🕵️‍♂️',
      color: 'border-slate-500 bg-slate-50 text-slate-800',
    },
    {
      id: 'char-2',
      name: lang === 'ar' ? 'د. ليلى' : 'Dr. Layla',
      role: lang === 'ar' ? 'طبيبة طوارئ' : 'ER Surgeon',
      category: 'female',
      voicePersonaId: 'aoede-female',
      fallbackVoice: 'Aoede',
      avatarEmoji: '👩‍⚕️',
      color: 'border-rose-400 bg-rose-50 text-rose-800',
    },
    {
      id: 'char-3',
      name: lang === 'ar' ? 'الطفل سامي' : 'Little Sami',
      role: lang === 'ar' ? 'طفل شاهد 7 سنوات' : '7yo Witness Boy',
      category: 'child',
      voicePersonaId: 'sami-child-boy',
      fallbackVoice: 'Puck',
      avatarEmoji: '🧒',
      color: 'border-teal-400 bg-teal-50 text-teal-800',
    },
  ]);

  const [customDialogueTopic, setCustomDialogueTopic] = useState<string>(() =>
    lang === 'ar'
      ? 'جلسة تحقيق سريعة في المستشفى مع طبيبة وطفل شاهد حول ليلة الحادث الغامض'
      : 'A fast-paced hospital interrogation between a detective, a doctor, and a 7yo witness boy about the mysterious incident',
  );
  const [customDialogueTurns, setCustomDialogueTurns] = useState<DialogueTurn[]>([]);
  const [isGeneratingDialogueScript, setIsGeneratingDialogueScript] = useState<boolean>(false);

  // Active Multi-Character Playback State (for Teleprompter in Multi-Character Mode)
  const [activeDialogueTitle, setActiveDialogueTitle] = useState<string>('');
  const [activeDialogueCharacters, setActiveDialogueCharacters] = useState<StoryCharacter[]>([]);
  const [activeDialogueTurns, setActiveDialogueTurns] = useState<DialogueTurn[]>([]);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [isMultiStoryActive, setIsMultiStoryActive] = useState<boolean>(false);
  const [multiWavCache, setMultiWavCache] = useState<Record<string, { url: string; turns: DialogueTurn[] }>>({});

  // Voice Catalog Explorer Modal
  const [isVoiceExplorerOpen, setIsVoiceExplorerOpen] = useState<boolean>(false);
  const [voiceFilterCategory, setVoiceFilterCategory] = useState<'all' | 'female' | 'male' | 'youth' | 'child'>('all');
  const [voiceTargetCharacterId, setVoiceTargetCharacterId] = useState<string | null>(null);

  // Playback Speed (0.75x, 1x, 1.25x)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // 1-Take Audio State
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthStatus, setSynthStatus] = useState<string>('');
  const [oneTakeWavUrl, setOneTakeWavUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const turnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

  // Smoothly center the active beat inside the vertical scrolling teleprompter
  useEffect(() => {
    if (!isStoryMode) return;
    if (isMultiStoryActive) {
      const activeEl = turnRefs.current[activeTurnIndex];
      const viewport = scrollViewportRef.current;
      if (activeEl && viewport) {
        const targetScrollTop =
          activeEl.offsetTop - viewport.clientHeight / 2 + activeEl.clientHeight / 2;
        viewport.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    } else {
      const activeEl = beatRefs.current[activeBeatIndex];
      const viewport = scrollViewportRef.current;
      if (activeEl && viewport) {
        const targetScrollTop =
          activeEl.offsetTop - viewport.clientHeight / 2 + activeEl.clientHeight / 2;
        viewport.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [activeBeatIndex, activeTurnIndex, isStoryMode, isMultiStoryActive, isSynthesizing]);

  // Auto-fetch authoritative API key from server environment on mount
  useEffect(() => {
    fetch('/api/key')
      .then((r) => r.json())
      .then((data) => {
        if (data?.apiKey) {
          setApiKey(data.apiKey);
        }
      })
      .catch(() => {});
  }, []);

  // Helper to ensure Gemini API key injected via AI Studio / server environment
  const ensureApiKey = async (): Promise<string> => {
    let key = apiKey;
    if (!key) {
      try {
        const r = await fetch('/api/key');
        const data = await r.json();
        if (data?.apiKey) {
          key = data.apiKey;
          setApiKey(data.apiKey);
        }
      } catch {
        // ignore
      }
    }
    return key;
  };

  // Save API Key to localStorage + backend
  const handleSaveApiKey = async (newKey: string) => {
    const trimmed = newKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('GEMINI_TTS_API_KEY', trimmed);
    try {
      await fetch('/api/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmed }),
      });
    } catch {
      // ignore in static mode
    }
  };

  // Stop playing the transcript and return to the front page
  const handleBackToStart = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveBeatIndex(0);
    setActiveTurnIndex(0);
    setIsStoryMode(false);
    setIsMultiStoryActive(false);
  };

  // Switch between Precinct 69 Preset and Create Your Own on the Front Page
  const handleSelectMode = (mode: 'preset' | 'custom') => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setStorySourceMode(mode);
    setErrorMsg(null);
    if (mode === 'preset') {
      const activeTitle = lang === 'ar' ? AR_PRECINCT_69_TITLE : PRECINCT_69_TITLE;
      const activePrompt = lang === 'ar' ? AR_INITIAL_VOICE_DESIGN_PROMPT : INITIAL_VOICE_DESIGN_PROMPT;
      const activeBeats = lang === 'ar' ? AR_INITIAL_ACTING_BEATS : INITIAL_ACTING_BEATS;

      setStoryTitle(activeTitle);
      setVoicePrompt(activePrompt);
      setBeats(presetWavCache.url ? presetWavCache.beats : activeBeats);
      setOneTakeWavUrl(presetWavCache.url);
      setVoiceId(presetWavCache.voiceId);
      setActiveBeatIndex(0);
    }
  };

  // Toggle Language between Arabic and English
  const handleToggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);

    if (storySourceMode === 'preset') {
      if (nextLang === 'ar') {
        if (storyTitle === PRECINCT_69_TITLE) setStoryTitle(AR_PRECINCT_69_TITLE);
        if (voicePrompt === INITIAL_VOICE_DESIGN_PROMPT) setVoicePrompt(AR_INITIAL_VOICE_DESIGN_PROMPT);
        if (beats === INITIAL_ACTING_BEATS || beats === presetWavCache.beats) {
          setBeats(AR_INITIAL_ACTING_BEATS);
        }
      } else {
        if (storyTitle === AR_PRECINCT_69_TITLE) setStoryTitle(PRECINCT_69_TITLE);
        if (voicePrompt === AR_INITIAL_VOICE_DESIGN_PROMPT) setVoicePrompt(INITIAL_VOICE_DESIGN_PROMPT);
        if (beats === AR_INITIAL_ACTING_BEATS) {
          setBeats(INITIAL_ACTING_BEATS);
        }
      }
    } else {
      const prevArchetypes = lang === 'ar' ? AR_VOICE_ARCHETYPES : VOICE_ARCHETYPES;
      const nextArchetypes = nextLang === 'ar' ? AR_VOICE_ARCHETYPES : VOICE_ARCHETYPES;
      const prevScenes = lang === 'ar' ? AR_SCENE_PRESETS : SCENE_PRESETS;
      const nextScenes = nextLang === 'ar' ? AR_SCENE_PRESETS : SCENE_PRESETS;

      const matchedArchIdx = prevArchetypes.findIndex((a) => a.prompt === customVoiceInput);
      if (matchedArchIdx !== -1) {
        setCustomVoiceInput(nextArchetypes[matchedArchIdx].prompt);
        setSelectedArchetypeId(nextArchetypes[matchedArchIdx].id);
      }

      const matchedSceneIdx = prevScenes.findIndex((s) => s.prompt === customSceneTopic);
      if (matchedSceneIdx !== -1) {
        setCustomSceneTopic(nextScenes[matchedSceneIdx].prompt);
        setSelectedScenePresetId(nextScenes[matchedSceneIdx].id);
      }
    }
  };

  // Enhance user's custom voice description using Gemini 3.8 Flash
  const handleEnhanceVoice = async () => {
    if (!customVoiceInput.trim()) return;
    const key = await ensureApiKey();
    if (!key) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      return;
    }
    setIsEnhancingVoice(true);
    setErrorMsg(null);
    try {
      const enhanced = await enhanceVoicePromptWithGemini38Flash(customVoiceInput, key, lang);
      setCustomVoiceInput(enhanced);
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
    } finally {
      setIsEnhancingVoice(false);
    }
  };

  // Keyboard navigation in Story Mode
  useEffect(() => {
    if (!isStoryMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (isMultiStoryActive && activeDialogueTurns.length > 0) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = Math.min(activeDialogueTurns.length - 1, activeTurnIndex + 1);
          setActiveTurnIndex(nextIdx);
          if (audioRef.current && oneTakeWavUrl) {
            audioRef.current.currentTime = activeDialogueTurns[nextIdx].start + 0.04;
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = Math.max(0, activeTurnIndex - 1);
          setActiveTurnIndex(prevIdx);
          if (audioRef.current && oneTakeWavUrl) {
            audioRef.current.currentTime = activeDialogueTurns[prevIdx].start + 0.04;
          }
        }
      } else {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = Math.min(beats.length - 1, activeBeatIndex + 1);
          setActiveBeatIndex(nextIdx);
          if (audioRef.current && oneTakeWavUrl) {
            audioRef.current.currentTime = beats[nextIdx].start + 0.04;
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = Math.max(0, activeBeatIndex - 1);
          setActiveBeatIndex(prevIdx);
          if (audioRef.current && oneTakeWavUrl) {
            audioRef.current.currentTime = beats[prevIdx].start + 0.04;
          }
        }
      }

      if (e.key === ' ') {
        if (oneTakeWavUrl && audioRef.current) {
          e.preventDefault();
          if (audioRef.current.paused) {
            setIsStoryMode(true);
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeBeatIndex, activeTurnIndex, beats, activeDialogueTurns, oneTakeWavUrl, isStoryMode, isMultiStoryActive]);

  // ============================================================================
  // Step 1: Create Prompted Voice (`POST /v1beta/voices` with store=True)
  // ============================================================================
  const createPromptedVoiceWithPrompt = useCallback(
    async (
      targetPrompt: string,
      displayName: string,
      keyToUse?: string,
      isRetry = false,
    ): Promise<string> => {
      const activeKey = keyToUse || apiKey;
      const url = '/api/create-voice';
      const payload = {
        prompt: targetPrompt,
        displayName,
        modelName,
        apiKey: activeKey,
      };

      const dynamicFallback = getDynamicFallbackVoice(targetPrompt, fallbackPrebuiltVoice);

      const logId = String(Date.now());
      const startTime = performance.now();
      const timestamp = new Date().toLocaleTimeString();

      console.groupCollapsed(
        `%c[Voice API] POST /api/create-voice - Requesting Custom Voice Design`,
        'color: #2563eb; font-weight: bold; font-size: 11px;',
      );
      console.log('Timestamp:', new Date().toISOString());
      console.log('Endpoint: /api/create-voice');
      console.log('Model Selected:', modelName);
      console.log('Display Name:', displayName);
      console.log('Voice Prompt Input:', targetPrompt);
      console.log('Dynamic Fallback Voice:', dynamicFallback);
      console.log('Full JSON Request Payload:', payload);

      let resp: Response;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 14000);
        resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        const elapsedMs = Math.round(performance.now() - startTime);
        console.warn(`[Voice API] Custom voice creation timed out or network error (${fetchErr?.message}). Using fallback prebuilt voice: "${dynamicFallback}"`);
        console.groupEnd();

        const failEntry: VoiceApiLogEntry = {
          id: logId,
          timestamp,
          endpoint: 'POST /v1beta/voices',
          prompt: targetPrompt,
          displayName,
          model: modelName,
          status: 'failed',
          error: fetchErr?.message || 'Network request failed or timed out',
          fallbackUsed: dynamicFallback,
          durationMs: elapsedMs,
        };
        setVoiceApiLogs((prev) => [failEntry, ...prev.slice(0, 49)]);
        postVoiceLogToServer(failEntry);
        return dynamicFallback;
      }

      const elapsedMs = Math.round(performance.now() - startTime);
      console.log(`[Voice API] Response Received: HTTP ${resp.status} ${resp.statusText} (${elapsedMs}ms)`);

      if (!resp.ok) {
        const errText = await resp.text();
        let parsedErr: any = null;
        try {
          parsedErr = JSON.parse(errText);
        } catch {
          // not json
        }

        const errMsg = parsedErr?.error?.message || errText.slice(0, 300) || `HTTP error ${resp.status}`;
        const isSafety =
          /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(
            errMsg,
          ) ||
          /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(
            errText,
          );

        if (isSafety) {
          console.warn(
            `[Voice API] ⛔ Voice prompt was blocked by safety policies. Returning user to original inputs.`,
          );
          console.groupEnd();
          const throwErr = new Error('Voice prompt was blocked by safety policies.');
          (throwErr as any).isSafetyBlock = true;
          throw throwErr;
        }

        console.warn(
          `[Voice API] Custom voice design failed (HTTP ${resp.status}: ${errMsg}). Falling back to prebuilt voice: "${dynamicFallback}"`,
        );
        console.groupEnd();

        const failEntry: VoiceApiLogEntry = {
          id: logId,
          timestamp,
          endpoint: 'POST /v1beta/voices',
          prompt: targetPrompt,
          displayName,
          model: modelName,
          status: 'failed',
          httpStatus: resp.status,
          error: errMsg,
          responseBody: parsedErr || errText,
          fallbackUsed: dynamicFallback,
          durationMs: elapsedMs,
        };
        setVoiceApiLogs((prev) => [failEntry, ...prev.slice(0, 49)]);
        postVoiceLogToServer(failEntry);

        return dynamicFallback;
      }

      const data = await resp.json();
      console.log('[Voice API] Response Data:', data);

      const voiceInfo = data.voice || data;
      const createdId = voiceInfo.id || voiceInfo.name;

      if (!createdId) {
        console.warn('[Voice API] No voice ID found in response object, using fallback:', dynamicFallback);
        console.groupEnd();
        return dynamicFallback;
      }

      console.log(
        `%c[Voice API] ✅ Custom Voice Creation SUCCESSFUL! Voice ID: "${createdId}"`,
        'color: #16a34a; font-weight: bold;',
        {
          voiceId: createdId,
          displayName,
          details: voiceInfo,
          durationMs: elapsedMs,
        },
      );
      console.groupEnd();

      setVoiceId(createdId);

      const successEntry: VoiceApiLogEntry = {
        id: logId,
        timestamp,
        endpoint: 'POST /v1beta/voices',
        prompt: targetPrompt,
        displayName,
        model: modelName,
        status: 'success',
        httpStatus: resp.status,
        voiceId: createdId,
        responseBody: data,
        durationMs: elapsedMs,
      };
      setVoiceApiLogs((prev) => [successEntry, ...prev.slice(0, 49)]);
      postVoiceLogToServer(successEntry);

      return createdId;
    },
    [apiKey, modelName, fallbackPrebuiltVoice],
  );

  // ============================================================================
  // Step 2: Unified Synthesis & Playback Pipeline (Preset OR Custom Story)
  // ============================================================================
  const runSynthesisPipeline = async (
    targetBeats: ActingBeat[],
    targetVoicePrompt: string,
    targetTitle: string,
    existingVoiceId: string,
    isPreset: boolean,
    overrideApiKey?: string,
  ) => {
    setIsSynthesizing(true);
    setErrorMsg(null);
    setIsStoryMode(true);

    const activeApiKey = overrideApiKey || (await ensureApiKey());
    if (!activeApiKey) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      setIsSynthesizing(false);
      setSynthStatus('');
      return;
    }

    try {
      let activeVoice = existingVoiceId;
      if (!activeVoice) {
        if (isPreset) {
          // The featured detective story uses Charon (deep Brooklyn baritone) directly for instant high-quality playback
          activeVoice = fallbackPrebuiltVoice !== 'auto' ? fallbackPrebuiltVoice : 'Charon';
        } else {
          setSynthStatus(t.statusDesigningVoice);
          console.log(`[TTS Pipeline] Requesting custom voice design for: "${targetTitle}"`);
          try {
            activeVoice = await createPromptedVoiceWithPrompt(targetVoicePrompt, targetTitle, activeApiKey);
            console.log(`[TTS Pipeline] Voice resolved: "${activeVoice}"`);
          } catch (vErr: any) {
            const isSafety =
              vErr?.isSafetyBlock ||
              /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(
                vErr?.message || '',
              );
            if (isSafety) {
              console.warn(
                '[TTS Pipeline] ⛔ Voice prompt was blocked by safety policies. Halting synthesis and returning user to original inputs.',
              );
              setIsSynthesizing(false);
              setSynthStatus('');
              setIsStoryMode(false);
              if (!isPreset) {
                setStorySourceMode('custom');
              }
              setErrorMsg('Voice prompt was blocked by safety policies. Please adjust your voice description.');
              return;
            }
            const dynamicFallback = getDynamicFallbackVoice(targetVoicePrompt, fallbackPrebuiltVoice);
            console.warn(
              `[TTS Pipeline] Custom voice creation fallback: "${dynamicFallback}"`,
            );
            activeVoice = dynamicFallback;
          }
        }
      } else {
        console.log(`[TTS Pipeline] Reusing already created voice ID: "${activeVoice}"`);
      }

      setSynthStatus(isPreset ? t.statusGeneratingStory : t.statusNarratingStory);
      const dynamicFallback = getDynamicFallbackVoice(targetVoicePrompt, fallbackPrebuiltVoice);

      // Helper to detect whether a beat style is intentionally quiet/whispered
      const isQuietStyle = (styleStr: string) =>
        /\b(whisper|whispering|whisper-quiet|hushed|quiet|drop in volume|softly|murmur|under breath)\b/i.test(
          styleStr,
        ) &&
        !/\b(not whispering|snap back|loud|full-chest|full volume|normal volume|room volume|booming)\b/i.test(
          styleStr,
        );

      const compiledParts = targetBeats.map((b, idx) => {
        const prevStyle = idx > 0 ? targetBeats[idx - 1].style : '';
        const prevWasQuiet = idx > 0 && isQuietStyle(prevStyle);
        const currIsQuiet = isQuietStyle(b.style);

        // Volume Reset Directive: break autoregressive whisper bleed immediately
        let volumeDirective = '';
        let spokenText = b.text;

        if (!currIsQuiet && prevWasQuiet) {
          volumeDirective =
            'SNAP BACK TO LOUD FULL-CHEST ROOM VOLUME, strong vocal projection, NOT whispering — ';
          // Ensure opening glottal attack breaks out of whisper phonation via <breath> + ALL-CAPS first word
          if (!/^<(breath|laugh|cough)>/i.test(spokenText.trim())) {
            spokenText = `<breath> ${spokenText.trim()}`;
          }
          spokenText = spokenText.replace(
            /^((?:<[^>]+>\s*)*)([a-zA-Z']+)/,
            (_, tagsPrefix, firstWord) => `${tagsPrefix}${firstWord.toUpperCase()}`,
          );
        }

        const compiledStyle = `${volumeDirective}${b.style}`;

        return {
          text: spokenText,
          speech_metadata: { style: compiledStyle },
        };
      });

      const resp = await fetch('/api/synthesize-monologue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          modelName,
          voiceId: activeVoice,
          fallbackVoice: dynamicFallback,
          compiledParts,
          apiKey: activeApiKey,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`GenerateContent HTTP ${resp.status}: ${errText.slice(0, 240)}`);
      }

      const data = await resp.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const pcmChunks: Uint8Array[] = [];
      let totalLen = 0;

      for (const part of parts) {
        if (part.inlineData?.data) {
          const raw = extractRawPcm(base64ToUint8Array(part.inlineData.data));
          pcmChunks.push(raw);
          totalLen += raw.length;
        }
      }

      if (totalLen === 0) {
        throw new Error('No audio returned from GenerateContent request.');
      }

      const mergedPcm = new Uint8Array(totalLen);
      let offset = 0;
      for (const chunk of pcmChunks) {
        mergedPcm.set(chunk, offset);
        offset += chunk.length;
      }

      // Micro-fadeout (10ms = 240 samples @ 24kHz) at tail to guarantee zero pop or DC snap
      const fadeSamples = Math.min(240, Math.floor(mergedPcm.length / 2));
      const int16View = new Int16Array(
        mergedPcm.buffer,
        mergedPcm.byteOffset,
        Math.floor(mergedPcm.byteLength / 2),
      );
      const startIdx = int16View.length - fadeSamples;
      for (let i = 0; i < fadeSamples; i++) {
        const gain = 1 - i / fadeSamples;
        int16View[startIdx + i] = Math.round(int16View[startIdx + i] * gain);
      }

      // 1. Beat 01 ALWAYS starts at 0.00s. Start playing immediately!
      const initialBeats = buildInitialTimestamps(targetBeats, pcmChunks, mergedPcm, 24000);
      setBeats(initialBeats);

      const totalAudioSec = Number((mergedPcm.length / (24000 * 2)).toFixed(2));
      const initialReport: AlignmentInspectorReport = {
        storyTitle: targetTitle,
        totalDurationSec: totalAudioSec,
        status: pcmChunks.length === targetBeats.length ? 'multi-chunk-exact' : 'heuristic-initial',
        modelUsed:
          pcmChunks.length === targetBeats.length
            ? 'pcm-part-chunks'
            : 'pacing-weighted-heuristic (awaiting gemini-3.5-flash-lite)',
        rows: initialBeats.map((b, i) => ({
          beatIndex: i,
          beatLabel: b.beat,
          initialStart: b.start,
          initialEnd: b.end,
          geminiStart: null,
          geminiEnd: null,
          finalStart: b.start,
          finalEnd: b.end,
          deltaSec: 0,
        })),
        updatedAt: new Date().toLocaleTimeString(),
      };
      setAlignmentReport(initialReport);
      postAlignmentLogToServer(initialReport);

      const wavBlob = buildWavFromPcm(mergedPcm, 24000);
      const wavUrl = URL.createObjectURL(wavBlob);
      setOneTakeWavUrl(wavUrl);
      setActiveBeatIndex(0);
      setIsSynthesizing(false);
      setSynthStatus('');

      if (isPreset) {
        setPresetWavCache({ url: wavUrl, beats: initialBeats, voiceId: activeVoice });
      }

      if (audioRef.current) {
        audioRef.current.src = wavUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      // 2. Fire background request to `gemini-3.5-flash-lite` while Beat 01 plays at 0.00s
      if (pcmChunks.length !== targetBeats.length) {
        alignBeatsWithGeminiFlashLite(mergedPcm, initialBeats, targetTitle, activeApiKey).then(
          ({ alignedBeats, report }) => {
            setAlignmentReport(report);
            postAlignmentLogToServer(report);
            if (alignedBeats) {
              setBeats(alignedBeats);
              if (isPreset) {
                setPresetWavCache({ url: wavUrl, beats: alignedBeats, voiceId: activeVoice });
              }
            }
          },
        );
      }
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
      setIsSynthesizing(false);
      setSynthStatus('');
    }
  };

  // Handler for Precinct 69 Preset Story
  const handleStartPresetStory = async () => {
    const activePresetTitle = lang === 'ar' ? AR_PRECINCT_69_TITLE : PRECINCT_69_TITLE;
    const activePresetPrompt = lang === 'ar' ? AR_INITIAL_VOICE_DESIGN_PROMPT : INITIAL_VOICE_DESIGN_PROMPT;
    const activePresetBeats = lang === 'ar' ? AR_INITIAL_ACTING_BEATS : INITIAL_ACTING_BEATS;

    if (presetWavCache.url && audioRef.current) {
      setStoryTitle(activePresetTitle);
      setVoicePrompt(activePresetPrompt);
      setBeats(presetWavCache.beats);
      setOneTakeWavUrl(presetWavCache.url);
      setIsStoryMode(true);
      if (audioRef.current.src !== presetWavCache.url) {
        audioRef.current.src = presetWavCache.url;
      }
      audioRef.current.play();
      return;
    }

    const key = await ensureApiKey();
    if (!key) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      return;
    }

    setStoryTitle(activePresetTitle);
    setVoicePrompt(activePresetPrompt);
    await runSynthesisPipeline(
      activePresetBeats,
      activePresetPrompt,
      activePresetTitle,
      presetWavCache.voiceId,
      true,
      key,
    );
  };

  // Handler for "Create Your Own" Story:
  // Sequential states: 1. "Writing your story..." -> 2. "Designing your voice..." -> 3. "Narrating your story..."
  const handleGenerateAndPlayCustomStory = async () => {
    const key = await ensureApiKey();
    if (!key) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      return;
    }
    if (!customSceneTopic.trim() || !customVoiceInput.trim()) return;

    setIsSynthesizing(true);
    setErrorMsg(null);
    setIsStoryMode(true);

    try {
      // 1. Writing your story...
      setSynthStatus(t.statusWritingStory);
      const generatedStory = await generate16BeatStoryWithGemini38Flash(
        customSceneTopic,
        customVoiceInput,
        key,
        lang,
      );

      // 2. Designing your voice...
      setSynthStatus(t.statusDesigningVoice);
      let createdVoiceId = fallbackPrebuiltVoice;
      try {
        createdVoiceId = await createPromptedVoiceWithPrompt(
          customVoiceInput,
          lang === 'ar' ? 'صوت القصة المخصصة' : 'Custom Story Voice',
          key,
        );
      } catch (voiceErr: any) {
        const isSafety =
          voiceErr?.isSafetyBlock ||
          /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(
            voiceErr?.message || '',
          );
        if (isSafety) {
          console.warn(
            '[Custom Story] ⛔ Voice prompt was blocked by safety policies. Halting without fallback; taking user back to original entries.',
          );
          setIsSynthesizing(false);
          setSynthStatus('');
          setIsStoryMode(false);
          setStorySourceMode('custom');
          setErrorMsg(
            'Voice prompt was blocked by safety policies. Please adjust your voice description and try again.',
          );
          return;
        }
        const dynamicFallback = getDynamicFallbackVoice(customVoiceInput, fallbackPrebuiltVoice);
        console.warn(
          `[Custom Story] Voice creation failed (${voiceErr?.message}), using dynamic prebuilt fallback "${dynamicFallback}"`,
        );
        createdVoiceId = dynamicFallback;
      }

      setStoryTitle(generatedStory.title);
      setVoicePrompt(customVoiceInput);
      setBeats(generatedStory.beats);
      setVoiceId(createdVoiceId);

      // 3. Narrating your story... (handled inside runSynthesisPipeline with isPreset = false)
      await runSynthesisPipeline(
        generatedStory.beats,
        customVoiceInput,
        generatedStory.title,
        createdVoiceId,
        false,
        key,
      );
    } catch (err: any) {
      console.error('[Custom Story] Generation error:', err);
      setIsSynthesizing(false);
      setSynthStatus('');
      setIsStoryMode(false);
      setStorySourceMode('custom');
      const isSafety =
        err?.isSafetyBlock ||
        /safety polic|blocked by safety|safety filter|safety violation|voice prompt was blocked/i.test(
          err?.message || '',
        );
      setErrorMsg(
        isSafety
          ? 'Voice prompt was blocked by safety policies. Please adjust your voice description and try again.'
          : err?.message || String(err),
      );
    }
  };

  // ============================================================================
  // MULTI-CHARACTER STORY HANDLERS (Presets, Custom Studio, Synthesis & Playback)
  // ============================================================================
  const handleStartMultiPresetStory = async (presetId: string) => {
    const preset = MULTI_CHARACTER_PRESETS.find((p) => p.id === presetId) || MULTI_CHARACTER_PRESETS[0];
    const turns = lang === 'ar' ? preset.turnsAr : preset.turnsEn;
    const title = lang === 'ar' ? preset.titleAr : preset.titleEn;
    const cacheKey = `${preset.id}_${lang}`;

    if (multiWavCache[cacheKey] && audioRef.current) {
      const cached = multiWavCache[cacheKey];
      setActiveDialogueTitle(title);
      setActiveDialogueCharacters(preset.characters);
      setActiveDialogueTurns(cached.turns);
      setOneTakeWavUrl(cached.url);
      setIsMultiStoryActive(true);
      setIsStoryMode(true);
      setActiveTurnIndex(0);
      if (audioRef.current.src !== cached.url) {
        audioRef.current.src = cached.url;
      }
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
      return;
    }

    const key = await ensureApiKey();
    if (!key) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      return;
    }

    setIsSynthesizing(true);
    setErrorMsg(null);
    setSynthStatus(t.synthesizingDialogue);
    setIsMultiStoryActive(true);
    setIsStoryMode(true);
    setActiveDialogueTitle(title);
    setActiveDialogueCharacters(preset.characters);
    setActiveDialogueTurns(turns);
    setActiveTurnIndex(0);

    try {
      const turnsPayload = turns.map((turn) => {
        const char = preset.characters.find((c) => c.id === turn.characterId);
        const persona = VOICE_CATALOG.find((v) => v.id === char?.voicePersonaId);
        return {
          turnIndex: turn.turnIndex,
          characterId: turn.characterId,
          speakerName: turn.speakerName,
          voiceId: persona?.prebuiltVoice || char?.fallbackVoice || 'Aoede',
          fallbackVoice: char?.fallbackVoice || 'Aoede',
          style: turn.style,
          text: turn.text,
        };
      });

      const resp = await fetch('/api/synthesize-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          modelName,
          turns: turnsPayload,
          apiKey: key,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`SynthesizeDialogue error (HTTP ${resp.status}): ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      if (!data.wavBase64) {
        throw new Error('No audio returned from dialogue synthesis.');
      }

      const wavBytes = base64ToUint8Array(data.wavBase64);
      const wavBlob = new Blob([wavBytes as unknown as BlobPart], { type: 'audio/wav' });
      const wavUrl = URL.createObjectURL(wavBlob);

      const finalTurns: DialogueTurn[] = data.turns || turns;
      setMultiWavCache((prev) => ({
        ...prev,
        [cacheKey]: { url: wavUrl, turns: finalTurns },
      }));

      setActiveDialogueTurns(finalTurns);
      setOneTakeWavUrl(wavUrl);
      setIsSynthesizing(false);
      setSynthStatus('');

      if (audioRef.current) {
        audioRef.current.src = wavUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.error('[Multi-Voice TTS] Synthesis failed:', err);
      setIsSynthesizing(false);
      setSynthStatus('');
      setErrorMsg(err?.message || String(err));
    }
  };

  const handleGenerateCustomDialogueScript = async () => {
    const key = await ensureApiKey();
    if (!key) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      return;
    }
    if (!customDialogueTopic.trim() || customCast.length < 2) return;

    setIsGeneratingDialogueScript(true);
    setErrorMsg(null);
    try {
      const resp = await fetch('/api/generate-dialogue-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          sceneTopic: customDialogueTopic,
          characters: customCast,
          language: lang,
          apiKey: key,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Story generation error: ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      if (Array.isArray(data.turns) && data.turns.length > 0) {
        const formattedTurns: DialogueTurn[] = data.turns.map((t: any, i: number) => ({
          turnIndex: i,
          characterId: t.characterId || customCast[i % customCast.length].id,
          speakerName: t.speakerName || customCast[i % customCast.length].name,
          style: t.style || 'Expressive dialogue',
          text: t.text || '',
          start: i * 5,
          end: (i + 1) * 5,
        }));
        setCustomDialogueTurns(formattedTurns);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || String(err));
    } finally {
      setIsGeneratingDialogueScript(false);
    }
  };

  const handleSynthesizeAndPlayCustomDialogue = async () => {
    const key = await ensureApiKey();
    if (!key) {
      setErrorMsg('Gemini API key is not configured in the AI Studio environment.');
      return;
    }

    let turnsToPlay = customDialogueTurns;
    if (turnsToPlay.length === 0) {
      setIsSynthesizing(true);
      setSynthStatus(t.generatingScript);
      setErrorMsg(null);
      try {
        const resp = await fetch('/api/generate-dialogue-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            sceneTopic: customDialogueTopic,
            characters: customCast,
            language: lang,
            apiKey: key,
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data.turns)) {
            turnsToPlay = data.turns.map((t: any, i: number) => ({
              turnIndex: i,
              characterId: t.characterId || customCast[i % customCast.length].id,
              speakerName: t.speakerName || customCast[i % customCast.length].name,
              style: t.style || 'Expressive dialogue',
              text: t.text || '',
              start: i * 5,
              end: (i + 1) * 5,
            }));
            setCustomDialogueTurns(turnsToPlay);
          }
        }
      } catch (err: any) {
        setIsSynthesizing(false);
        setSynthStatus('');
        setErrorMsg(err?.message || String(err));
        return;
      }
    }

    if (turnsToPlay.length === 0) return;

    setIsSynthesizing(true);
    setSynthStatus(t.synthesizingDialogue);
    setErrorMsg(null);
    setIsMultiStoryActive(true);
    setIsStoryMode(true);
    setActiveDialogueTitle(customDialogueTopic);
    setActiveDialogueCharacters(customCast);
    setActiveDialogueTurns(turnsToPlay);
    setActiveTurnIndex(0);

    try {
      const turnsPayload = turnsToPlay.map((turn) => {
        const char = customCast.find((c) => c.id === turn.characterId);
        const persona = VOICE_CATALOG.find((v) => v.id === char?.voicePersonaId);
        return {
          turnIndex: turn.turnIndex,
          characterId: turn.characterId,
          speakerName: turn.speakerName,
          voiceId: persona?.prebuiltVoice || char?.fallbackVoice || 'Aoede',
          fallbackVoice: char?.fallbackVoice || 'Aoede',
          style: turn.style,
          text: turn.text,
        };
      });

      const resp = await fetch('/api/synthesize-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          modelName,
          turns: turnsPayload,
          apiKey: key,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Synthesize error: ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      const wavBytes = base64ToUint8Array(data.wavBase64);
      const wavBlob = new Blob([wavBytes as unknown as BlobPart], { type: 'audio/wav' });
      const wavUrl = URL.createObjectURL(wavBlob);

      setActiveDialogueTurns(data.turns);
      setOneTakeWavUrl(wavUrl);
      setIsSynthesizing(false);
      setSynthStatus('');

      if (audioRef.current) {
        audioRef.current.src = wavUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      setIsSynthesizing(false);
      setSynthStatus('');
      setErrorMsg(err?.message || String(err));
    }
  };

  const handleAddCharacter = () => {
    if (customCast.length >= 4) return;
    const availableCategories: VoiceCategory[] = ['female', 'male', 'youth', 'child'];
    const nextCat = availableCategories[customCast.length % availableCategories.length];
    const candidateVoices = VOICE_CATALOG.filter((v) => v.category === nextCat);
    const chosenVoice = candidateVoices[0] || VOICE_CATALOG[0];

    const newChar: StoryCharacter = {
      id: `char-${Date.now()}`,
      name: lang === 'ar' ? (chosenVoice.category === 'child' ? 'طفل صغير' : chosenVoice.nameAr) : chosenVoice.nameEn,
      role: lang === 'ar' ? chosenVoice.recommendedRoleAr.split('،')[0] : chosenVoice.recommendedRoleEn.split(',')[0],
      category: chosenVoice.category,
      voicePersonaId: chosenVoice.id,
      fallbackVoice: chosenVoice.prebuiltVoice,
      avatarEmoji: chosenVoice.avatarEmoji,
      color:
        chosenVoice.category === 'female'
          ? 'border-rose-400 bg-rose-50 text-rose-800'
          : chosenVoice.category === 'child'
            ? 'border-teal-400 bg-teal-50 text-teal-800'
            : chosenVoice.category === 'youth'
              ? 'border-violet-400 bg-violet-50 text-violet-800'
              : 'border-blue-400 bg-blue-50 text-blue-800',
    };
    setCustomCast((prev) => [...prev, newChar]);
  };

  const handleRemoveCharacter = (id: string) => {
    if (customCast.length <= 2) return;
    setCustomCast((prev) => prev.filter((c) => c.id !== id));
  };

  const handleOpenVoicePickerForCharacter = (characterId: string) => {
    setVoiceTargetCharacterId(characterId);
    setIsVoiceExplorerOpen(true);
  };

  const handleSelectVoiceFromExplorer = (persona: VoicePersona) => {
    if (voiceTargetCharacterId) {
      setCustomCast((prev) =>
        prev.map((c) => {
          if (c.id !== voiceTargetCharacterId) return c;
          return {
            ...c,
            voicePersonaId: persona.id,
            fallbackVoice: persona.prebuiltVoice,
            category: persona.category,
            avatarEmoji: persona.avatarEmoji,
          };
        }),
      );
      setVoiceTargetCharacterId(null);
    } else {
      // Applied to Solo Voice prompt
      setCustomVoiceInput(lang === 'ar' ? persona.promptAr : persona.promptEn);
    }
    setIsVoiceExplorerOpen(false);
  };

  const handleTogglePlaybackSpeed = () => {
    const nextSpeed = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 0.75 : 1.0;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const jumpToTurn = (idx: number) => {
    const clamped = Math.max(0, Math.min(activeDialogueTurns.length - 1, idx));
    setActiveTurnIndex(clamped);
    if (audioRef.current && oneTakeWavUrl) {
      audioRef.current.currentTime = activeDialogueTurns[clamped].start + 0.04;
      if (audioRef.current.paused) {
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);
    setDuration(audioRef.current.duration || 0);

    if (isMultiStoryActive && activeDialogueTurns.length > 0) {
      const match = activeDialogueTurns.find((turn) => t >= turn.start && t < turn.end);
      if (match && match.turnIndex !== activeTurnIndex) {
        setActiveTurnIndex(match.turnIndex);
      }
    } else {
      const match = beats.find((b) => t >= b.start && t < b.end);
      if (match && match.index !== activeBeatIndex) {
        setActiveBeatIndex(match.index);
      }
    }
  };

  const jumpToBeat = (idx: number) => {
    const clamped = Math.max(0, Math.min(beats.length - 1, idx));
    setActiveBeatIndex(clamped);
    if (audioRef.current && oneTakeWavUrl) {
      audioRef.current.currentTime = beats[clamped].start + 0.04;
      if (audioRef.current.paused) {
        audioRef.current.play();
      }
    }
  };

  const plainTextTurnByTurn = isMultiStoryActive
    ? activeDialogueTurns
        .map((t, i) => `${i + 1}. [${t.speakerName}] (${t.style}):\n${t.text}`)
        .join('\n\n')
    : beats
        .map((b, i) => `${i + 1}. Style: ${b.style}\n${b.text}`)
        .join('\n\n');

  const plainTextContinuous = isMultiStoryActive
    ? activeDialogueTurns.map((t) => `${t.speakerName}: ${t.text}`).join('\n')
    : beats.map((b) => b.text).join(' ');

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#F6F5F2] text-[#141413] flex flex-col justify-start sm:justify-center p-2.5 sm:p-6 md:p-10 overflow-x-hidden">
      {/* Hidden Audio Player */}
      <audio
        id="monologue-audio-player"
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setIsPlaying(true);
          setIsStoryMode(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Exhibition Card */}
      <div id="monologue-card" className="w-full max-w-[1280px] mx-auto bg-white rounded-[16px] sm:rounded-[22px] border border-[#E6E4DF] shadow-[0_2px_24px_rgba(20,20,19,0.03)] px-3.5 sm:px-8 md:px-16 py-4 sm:py-8 md:py-10 min-h-[520px] sm:min-h-[760px] flex flex-col justify-between overflow-hidden">
        {/* ====================================================================
            TOP BAR: Brand + Mode Switcher + Voice Catalog + Language + Settings
           ==================================================================== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full pb-3 border-b border-[#F0EEE8]">
          <div className="flex items-center gap-3 shrink-0">
            <div>
              <span className="text-[20px] sm:text-[24px] font-bold tracking-[-0.025em] text-[#141413] block leading-tight">
                {t.brand}
              </span>
              {!isStoryMode && (
                <span className="text-[11px] sm:text-[12px] text-[#8E8D8A] font-normal leading-snug block">
                  {appMode === 'multi' ? t.multiCharacter : t.tagline}
                </span>
              )}
            </div>

            {isStoryMode && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[#DCDAD4] select-none">|</span>
                <button
                  onClick={handleBackToStart}
                  className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] text-[#8E8D8A] hover:text-[#141413] transition-colors cursor-pointer"
                >
                  <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  <span>{t.back}</span>
                </button>

                <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[6px] border border-[#D4D2CC] bg-[#FAF9F6] text-[10.5px] sm:text-[11px] font-semibold tracking-[0.06em] uppercase text-[#141413]">
                  {isMultiStoryActive ? (
                    <>
                      {t.turnCounter} {String(activeTurnIndex + 1).padStart(2, '0')}/{activeDialogueTurns.length}
                    </>
                  ) : (
                    <>
                      {t.beatCounter} {String(activeBeatIndex + 1).padStart(2, '0')}/{beats.length}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Center Mode Switcher (When not in playback reader mode) */}
          {!isStoryMode && (
            <div className="inline-flex p-1 rounded-[10px] bg-[#F2F1EC] border border-[#E4E2DC] self-center sm:self-auto shadow-2xs">
              <button
                onClick={() => {
                  setAppMode('solo');
                  setErrorMsg(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all cursor-pointer ${
                  appMode === 'solo'
                    ? 'bg-white text-[#141413] shadow-xs'
                    : 'text-[#6E6D69] hover:text-[#141413]'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'مونولوج فردي' : 'Solo Monologue'}</span>
              </button>

              <button
                onClick={() => {
                  setAppMode('multi');
                  setErrorMsg(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition-all cursor-pointer ${
                  appMode === 'multi'
                    ? 'bg-white text-[#141413] shadow-xs'
                    : 'text-[#6E6D69] hover:text-[#141413]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'قصة متعددة الشخصيات' : 'Multi-Character'}</span>
              </button>
            </div>
          )}

          {/* Top-Right Action Buttons: Voice Catalog, WAV Download, Script, Settings & Language */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto">
            {/* Voice Catalog Explorer Button */}
            <button
              onClick={() => {
                setVoiceTargetCharacterId(null);
                setIsVoiceExplorerOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border border-[#E2E0D8] hover:border-[#141413] text-[12px] text-[#454440] hover:text-[#141413] transition-colors cursor-pointer bg-white shrink-0 shadow-2xs"
              title={t.voiceExplorer}
              aria-label={t.voiceExplorer}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline font-medium">{t.voiceExplorer}</span>
            </button>

            {isStoryMode && oneTakeWavUrl && (
              <a
                href={oneTakeWavUrl}
                download={`${(isMultiStoryActive ? activeDialogueTitle : storyTitle).toLowerCase().replace(/\s+/g, '-')}.wav`}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border border-[#E2E0D8] hover:border-[#141413] text-[12px] text-[#454440] hover:text-[#141413] transition-colors bg-white shrink-0 shadow-2xs"
                title={t.downloadWav}
                aria-label={t.downloadWav}
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline font-medium">{t.downloadWav}</span>
              </a>
            )}

            <button
              onClick={() => setActiveDrawer('script')}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-[7px] border border-[#E2E0D8] hover:border-[#141413] text-[12px] text-[#454440] hover:text-[#141413] transition-colors cursor-pointer shrink-0 bg-white"
              title={t.scriptAndTags}
              aria-label={t.scriptAndTags}
            >
              <FileText className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{t.scriptAndTags}</span>
            </button>

            <button
              onClick={() => setActiveDrawer('settings')}
              className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-[7px] border border-[#E2E0D8] hover:border-[#141413] text-[12px] text-[#454440] hover:text-[#141413] transition-colors cursor-pointer shrink-0 bg-white"
              title={t.settings}
              aria-label={t.settings}
            >
              <Settings className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{t.settings}</span>
            </button>

            {/* Language Selection Button (Placed directly next to Settings) */}
            <button
              onClick={handleToggleLanguage}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border border-[#E2E0D8] hover:border-[#141413] text-[12px] text-[#454440] hover:text-[#141413] transition-colors cursor-pointer shrink-0 bg-white shadow-2xs"
              title={t.switchLanguage}
              aria-label={t.switchLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-[#141413]" />
              <span className="font-semibold text-[11.5px] sm:text-[12px]">
                {lang === 'en' ? 'العربية' : 'English'}
              </span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            MAIN STAGE:
            - Story Mode: Wider single-column vertical scrolling teleprompter
              (no left/right border lines), generous vertical padding (`space-y-10`
              + `py-1.5`), smaller emotion font size (`text-[13px]`), and lighter
              grey vocal tag chips.
            - Start Page Mode: Choose between "Precinct 69 Transcripts" or
              "Create Your Own" (Voice Description + AI Enhance + Story Subject).
           ==================================================================== */}
        {isStoryMode ? (
          <div className="my-auto flex flex-col items-center justify-center py-2">
            {/* Wider Single-Column Vertical Scrolling Stage (No Left/Right Vertical Lines) */}
            <div className="w-full max-w-[960px] px-4 sm:px-8">
              {isSynthesizing ? (
                <div className="h-[460px] flex flex-col items-center justify-center text-center">
                  <div className="inline-flex items-center gap-2.5 text-[17px] font-medium text-[#141413]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{synthStatus || t.statusWritingStory}</span>
                  </div>
                </div>
              ) : (
                <div
                  ref={scrollViewportRef}
                  className="relative h-[460px] overflow-y-auto no-scrollbar select-none"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                    scrollbarWidth: 'none',
                  }}
                >
                  {/* Top spacer so first element centers vertically */}
                  <div className="h-[140px]" />

                  {isMultiStoryActive ? (
                    /* Multi-Character Dialogue Teleprompter */
                    <div className="space-y-6 sm:space-y-8">
                      {activeDialogueTurns.map((turn, idx) => {
                        const isCurrent = idx === activeTurnIndex;
                        const char = activeDialogueCharacters.find((c) => c.id === turn.characterId);
                        const persona = VOICE_CATALOG.find((v) => v.id === char?.voicePersonaId);
                        const distance = Math.abs(idx - activeTurnIndex);

                        let opacityClass = 'opacity-25';
                        if (isCurrent) {
                          opacityClass = 'opacity-100 ring-2 ring-[#141413]/25 shadow-lg scale-[1.01]';
                        } else if (distance === 1) {
                          opacityClass = 'opacity-50 hover:opacity-80';
                        } else {
                          opacityClass = 'opacity-25 hover:opacity-50';
                        }

                        return (
                          <div
                            key={turn.turnIndex}
                            ref={(el) => {
                              turnRefs.current[idx] = el;
                            }}
                            onClick={() => jumpToTurn(idx)}
                            className={`p-4 sm:p-6 rounded-[16px] bg-white border border-[#E5E3DC] transition-all duration-300 cursor-pointer text-start ${opacityClass}`}
                          >
                            {/* Header: Speaker Avatar, Name, Voice Badge, and Timestamp */}
                            <div className="flex items-center justify-between gap-3 mb-2.5">
                              <div className="flex items-center gap-2.5">
                                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[16px] sm:text-[18px] bg-[#F4F3EE] border border-[#E0DED7] shrink-0">
                                  {char?.avatarEmoji || '🎭'}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[14px] sm:text-[16px] font-bold text-[#141413] leading-tight">
                                      {turn.speakerName}
                                    </span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4F3EE] text-[#55534E] border border-[#E4E2DC]">
                                      {persona ? (lang === 'ar' ? persona.nameAr : persona.nameEn) : char?.fallbackVoice}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-[#888681] font-medium block mt-0.5">
                                    {persona ? (lang === 'ar' ? persona.tagAr : persona.tagEn) : ''}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10.5px] font-mono-code px-2 py-0.5 rounded bg-[#FAF9F6] text-[#787672] border border-[#E5E3DC]">
                                  {turn.start.toFixed(1)}s - {turn.end.toFixed(1)}s
                                </span>
                                {isCurrent && isPlaying && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                              </div>
                            </div>

                            {/* Directorial Style Prompt */}
                            <div className="text-[12px] sm:text-[13px] font-semibold text-[#52514D] mb-2 italic">
                              « {turn.style} »
                            </div>

                            {/* Dialogue Spoken Line */}
                            <div className="text-[20px] sm:text-[26px] font-normal leading-[1.48] text-[#141413]">
                              {renderStoryLineWithTags(turn.text)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Solo Monologue Acting Beats Teleprompter */
                    <div className="space-y-10">
                      {beats.map((b, idx) => {
                        const distance = Math.abs(idx - activeBeatIndex);
                        const isCurrent = idx === activeBeatIndex;

                        let opacityClass = 'opacity-10';
                        if (isCurrent) {
                          opacityClass = 'opacity-100';
                        } else if (distance === 1) {
                          opacityClass = 'opacity-25 hover:opacity-45';
                        } else if (distance === 2) {
                          opacityClass = 'opacity-10 hover:opacity-25';
                        }

                        return (
                          <div
                            key={b.index}
                            ref={(el) => {
                              beatRefs.current[idx] = el;
                            }}
                            onClick={() => jumpToBeat(idx)}
                            className={`py-1.5 transition-all duration-500 ease-out cursor-pointer text-start ${opacityClass}`}
                          >
                            {/* Style Prompt: Smaller bold font directly above spoken line */}
                            <div className="text-[12.5px] sm:text-[13.5px] font-bold text-[#3D3C38] tracking-[-0.005em] mb-2">
                              {b.style}
                            </div>

                            {/* Spoken Line */}
                            <div className="text-[24px] sm:text-[30px] font-normal leading-[1.46] tracking-[-0.015em] text-[#141413]">
                              {renderStoryLineWithTags(b.text)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Bottom spacer so last element centers vertically */}
                  <div className="h-[175px]" />
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 text-[12.5px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded px-3.5 py-2.5">
                  {errorMsg}
                </div>
              )}

              {/* Minimal Playback & Step Controls at Bottom of Single-Column Frame */}
              <div className="pt-6 mt-2 border-t border-[#EFECE6] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isMultiStoryActive) {
                        jumpToTurn(activeTurnIndex - 1);
                      } else {
                        jumpToBeat(activeBeatIndex - 1);
                      }
                    }}
                    disabled={isMultiStoryActive ? activeTurnIndex === 0 : activeBeatIndex === 0}
                    className="p-1.5 rounded border border-[#E2E0D8] hover:border-[#141413] disabled:opacity-30 transition-colors cursor-pointer"
                    title={t.prevBeat}
                  >
                    <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      if (!oneTakeWavUrl) {
                        if (isMultiStoryActive) {
                          handleStartMultiPresetStory(selectedMultiPresetId);
                        } else if (storySourceMode === 'custom') {
                          handleGenerateAndPlayCustomStory();
                        } else {
                          handleStartPresetStory();
                        }
                        return;
                      }
                      if (!audioRef.current) return;
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                    }}
                    disabled={isSynthesizing}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[7px] bg-[#141413] hover:bg-[#2A2A28] text-white text-[12.5px] font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>{t.pauseStory}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>{oneTakeWavUrl ? t.resumeStory : t.playStory}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (isMultiStoryActive) {
                        jumpToTurn(activeTurnIndex + 1);
                      } else {
                        jumpToBeat(activeBeatIndex + 1);
                      }
                    }}
                    disabled={
                      isMultiStoryActive
                        ? activeTurnIndex === activeDialogueTurns.length - 1
                        : activeBeatIndex === beats.length - 1
                    }
                    className="p-1.5 rounded border border-[#E2E0D8] hover:border-[#141413] disabled:opacity-30 transition-colors cursor-pointer"
                    title={t.nextBeat}
                  >
                    <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Playback Speed Button */}
                  <button
                    onClick={handleTogglePlaybackSpeed}
                    className="px-2 py-1 rounded border border-[#E2E0D8] hover:border-[#141413] text-[11px] font-mono-code text-[#4D4B47] transition-colors cursor-pointer bg-white shrink-0 ml-1"
                    title={t.playbackSpeed}
                  >
                    {playbackSpeed}x
                  </button>
                </div>

                {/* Chapter or Turn Dots */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isMultiStoryActive ? (
                    activeDialogueTurns.map((turn, i) => (
                      <button
                        key={turn.turnIndex}
                        onClick={() => jumpToTurn(i)}
                        title={`${turn.speakerName}: ${turn.style}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          i === activeTurnIndex
                            ? 'w-6 bg-[#141413]'
                            : 'w-2 bg-[#DCDAD4] hover:bg-[#8E8D8A]'
                        }`}
                      />
                    ))
                  ) : (
                    beats.map((b, i) => (
                      <button
                        key={b.index}
                        onClick={() => jumpToBeat(i)}
                        title={`${b.beat}: ${b.style}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          i === activeBeatIndex
                            ? 'w-6 bg-[#141413]'
                            : 'w-2 bg-[#DCDAD4] hover:bg-[#8E8D8A]'
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================
             START PAGE: Multi-Character Studio OR Solo Monologue Reel
             ================================================================== */
          appMode === 'multi' ? (
            /* Multi-Character Studio View */
            <div className="w-full flex-1 flex flex-col justify-between py-2 sm:py-4">
              {/* Sub-Mode Tabs */}
              <div className="flex items-center justify-between border-b border-[#EBE8E1] pb-3 mb-4 gap-3 flex-wrap">
                <div className="inline-flex p-0.5 sm:p-1 rounded-[8px] bg-[#F2F1EB] border border-[#E4E2DC]">
                  <button
                    onClick={() => {
                      setMultiSubMode('preset');
                      setErrorMsg(null);
                    }}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-[6px] text-[11.5px] sm:text-[12.5px] font-semibold transition-all cursor-pointer ${
                      multiSubMode === 'preset'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#6E6D69] hover:text-[#141413]'
                    }`}
                  >
                    {t.readyPresets}
                  </button>
                  <button
                    onClick={() => {
                      setMultiSubMode('custom');
                      setErrorMsg(null);
                    }}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-[6px] text-[11.5px] sm:text-[12.5px] font-semibold transition-all cursor-pointer ${
                      multiSubMode === 'custom'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-[#6E6D69] hover:text-[#141413]'
                    }`}
                  >
                    {t.customScriptStudio}
                  </button>
                </div>

                <div className="text-[12px] text-[#787672]">
                  {multiSubMode === 'preset' ? t.presetStoriesDesc : t.customScriptStudioDesc}
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 text-[12px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] px-3.5 py-2.5 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
                  <div className="flex-1">
                    <span className="font-semibold block text-[12.5px]">{t.noticeTitle}</span>
                    <span className="leading-snug">{errorMsg}</span>
                  </div>
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="text-[#991B1B] hover:text-[#141413] cursor-pointer text-[12px] p-0.5 font-medium"
                    title={t.dismiss}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Sub-Mode 1: Preset Stories Grid */}
              {multiSubMode === 'preset' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-auto">
                  {MULTI_CHARACTER_PRESETS.map((preset) => {
                    const title = lang === 'ar' ? preset.titleAr : preset.titleEn;
                    const synopsis = lang === 'ar' ? preset.synopsisAr : preset.synopsisEn;
                    const turns = lang === 'ar' ? preset.turnsAr : preset.turnsEn;
                    const isSelected = selectedMultiPresetId === preset.id;

                    return (
                      <div
                        key={preset.id}
                        className={`p-5 sm:p-6 rounded-[16px] border transition-all flex flex-col justify-between gap-4 bg-white ${
                          isSelected
                            ? 'border-[#141413] shadow-md ring-1 ring-[#141413]'
                            : 'border-[#E6E4DF] hover:border-[#8E8D8A]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[#F4F3EE] text-[#5E5D59] border border-[#E5E3DC]">
                              {turns.length} {t.turnsCount}
                            </span>
                            <span className="text-[11.5px] font-medium text-[#787672]">
                              {preset.characters.length} {lang === 'ar' ? 'شخصيات وأصوات' : 'distinct voices'}
                            </span>
                          </div>

                          <h3 className="text-[17px] sm:text-[19px] font-bold text-[#141413] mb-2 leading-snug">
                            {title}
                          </h3>

                          <p className="text-[12.5px] sm:text-[13px] text-[#55534F] leading-relaxed mb-4">
                            {synopsis}
                          </p>

                          {/* Characters Preview Pills */}
                          <div className="space-y-1.5 pt-2 border-t border-[#F0EEE8]">
                            <div className="text-[10.5px] font-semibold text-[#8E8D8A] uppercase tracking-wider">
                              {lang === 'ar' ? 'الشخصيات والأصوات:' : 'Characters:'}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {preset.characters.map((char) => {
                                const persona = VOICE_CATALOG.find((v) => v.id === char.voicePersonaId);
                                return (
                                  <span
                                    key={char.id}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11px] font-medium border ${char.color}`}
                                  >
                                    <span>{char.avatarEmoji}</span>
                                    <span className="font-semibold">{char.name}</span>
                                    <span className="opacity-75 text-[10px]">
                                      ({persona ? (lang === 'ar' ? persona.nameAr : persona.nameEn) : char.fallbackVoice})
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedMultiPresetId(preset.id);
                            handleStartMultiPresetStory(preset.id);
                          }}
                          disabled={isSynthesizing}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[8px] bg-[#141413] hover:bg-[#2A2A28] disabled:opacity-50 text-white text-[12.5px] font-semibold transition-all cursor-pointer shadow-xs"
                        >
                          {isSynthesizing && selectedMultiPresetId === preset.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>{synthStatus || t.synthesizingDialogue}</span>
                            </>
                          ) : (
                            <>
                              <Play className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                              <span>{lang === 'ar' ? 'استماع للقصة' : 'Play Story'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Sub-Mode 2: AI Multi-Character Script Studio */
                <div className="space-y-4 sm:space-y-5 my-auto max-w-4xl mx-auto w-full">
                  {/* 1. Cast of Characters */}
                  <div className="p-4 sm:p-5 rounded-[14px] bg-[#FAF9F6] border border-[#E5E3DC]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-bold text-[#141413]">
                          {t.castTitle}
                        </h4>
                        <p className="text-[11.5px] text-[#787672]">
                          {t.castSubtitle}
                        </p>
                      </div>

                      {customCast.length < 4 && (
                        <button
                          type="button"
                          onClick={handleAddCharacter}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-[#D4D2CC] hover:border-[#141413] bg-white text-[11.5px] font-semibold text-[#141413] transition-colors cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addCharacter}</span>
                        </button>
                      )}
                    </div>

                    {/* Character Slots Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {customCast.map((char) => {
                        const persona = VOICE_CATALOG.find((v) => v.id === char.voicePersonaId);
                        return (
                          <div
                            key={char.id}
                            className="p-3.5 rounded-[10px] bg-white border border-[#E0DED7] flex flex-col justify-between gap-2.5 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] bg-[#F4F3EE] border border-[#E2E0D8]">
                                  {char.avatarEmoji}
                                </span>
                                <input
                                  type="text"
                                  value={char.name}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomCast((prev) =>
                                      prev.map((c) => (c.id === char.id ? { ...c, name: val } : c)),
                                    );
                                  }}
                                  className="text-[13px] font-bold text-[#141413] border-b border-transparent hover:border-[#D4D2CC] focus:border-[#141413] focus:outline-none bg-transparent w-28"
                                  placeholder={t.characterName}
                                />
                              </div>

                              {customCast.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCharacter(char.id)}
                                  className="p-1 text-[#8E8D8A] hover:text-[#DC2626] transition-colors cursor-pointer"
                                  title={t.removeCharacter}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <input
                              type="text"
                              value={char.role}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomCast((prev) =>
                                  prev.map((c) => (c.id === char.id ? { ...c, role: val } : c)),
                                );
                              }}
                              className="text-[11.5px] text-[#55534F] border-b border-transparent hover:border-[#D4D2CC] focus:border-[#141413] focus:outline-none bg-transparent w-full"
                              placeholder={t.characterRole}
                            />

                            {/* Voice Selection Pill */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#F0EEE8]">
                              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#141413]">
                                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                                <span>{persona ? (lang === 'ar' ? persona.nameAr : persona.nameEn) : char.fallbackVoice}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenVoicePickerForCharacter(char.id)}
                                className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-[#F4F3EE] hover:bg-[#EAE8E2] text-[#3D3C38] transition-colors cursor-pointer"
                              >
                                {t.changeVoice}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Scene Topic / Dramatic Premise */}
                  <div className="space-y-2">
                    <label className="block text-[12.5px] font-bold text-[#141413]">
                      {t.sceneTopicLabel}
                    </label>

                    {/* Quick Scenario Preset Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(lang === 'ar'
                        ? [
                            'جلسة تحقيق مع طبيبة وطفل شاهد على الحادث',
                            'عائلة في رحلة سرية تكتشف كنزاً قديماً',
                            'طبيب وممرضة وطفل خائف في العيادة',
                            'مغامرة إنقاذ فضائية في محطة مهجورة',
                          ]
                        : [
                            'Hospital interrogation between detective, doctor, and a 7yo witness',
                            'Family road trip uncovering an ancient secret map',
                            'Emergency clinic rescue during a thunderstorm blackout',
                            'Deep space crew trying to repair the life support airlock',
                          ]
                      ).map((premise, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setCustomDialogueTopic(premise)}
                          className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-[#FAF9F6] text-[#575652] border border-[#E2E0D8] hover:border-[#141413] transition-colors cursor-pointer"
                        >
                          {premise}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      value={customDialogueTopic}
                      onChange={(e) => setCustomDialogueTopic(e.target.value)}
                      placeholder={lang === 'ar' ? 'اكتب موضوع أو فكرة المشهد الدرامي...' : 'Describe what happens in this dramatic dialogue...'}
                      className="w-full px-3.5 py-2 rounded-[8px] border border-[#D4D2CC] focus:border-[#141413] focus:outline-none text-[13px] leading-relaxed text-[#141413] bg-[#FAF9F6] resize-none"
                    />
                  </div>

                  {/* 3. Action Buttons & Generated Turns Preview */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleGenerateCustomDialogueScript}
                      disabled={isGeneratingDialogueScript || !customDialogueTopic.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-white border border-[#D4D2CC] hover:border-[#141413] disabled:opacity-50 text-[12.5px] font-semibold text-[#141413] transition-colors cursor-pointer shadow-2xs"
                    >
                      {isGeneratingDialogueScript ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#141413]" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      )}
                      <span>{isGeneratingDialogueScript ? t.generatingScript : t.generateScript}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSynthesizeAndPlayCustomDialogue}
                      disabled={isSynthesizing || !customDialogueTopic.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#141413] hover:bg-[#2A2A28] disabled:opacity-50 text-white text-[12.5px] font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      {isSynthesizing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      )}
                      <span>{t.synthesizeDialogue}</span>
                    </button>
                  </div>

                  {/* Generated Script Turns Accordion / Preview */}
                  {customDialogueTurns.length > 0 && (
                    <div className="p-4 rounded-[12px] bg-white border border-[#E5E3DC] space-y-3 max-h-[220px] overflow-y-auto">
                      <div className="flex items-center justify-between border-b border-[#F0EEE8] pb-2">
                        <span className="text-[12px] font-bold text-[#141413]">
                          {t.turnsLabel} ({customDialogueTurns.length})
                        </span>
                      </div>
                      {customDialogueTurns.map((turn, tIdx) => (
                        <div key={tIdx} className="text-[12px] pb-2 border-b border-[#F5F4F0] last:border-b-0">
                          <span className="font-bold text-[#141413]">{turn.speakerName}: </span>
                          <span className="italic text-[#787672] text-[11px]">«{turn.style}» </span>
                          <span className="text-[#3D3C38]">{turn.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Solo Monologue Start Page */
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 md:gap-10 lg:gap-12 my-auto py-2 sm:py-4 w-full">
              {/* Left Column: Monograph Drawing */}
              <div className="w-[130px] sm:w-[210px] md:w-[260px] lg:w-[310px] shrink-0 flex flex-col items-center justify-center">
                <div
                  onClick={
                    storySourceMode === 'preset'
                      ? handleStartPresetStory
                      : handleGenerateAndPlayCustomStory
                  }
                  className="relative group w-full cursor-pointer"
                  title="Click to start the story"
                >
                  <img
                    src="/drawing.jpg"
                    alt="Precinct 69 Transcripts — Det. M. Giancana Monograph Drawing"
                    className="w-full h-auto rounded-[2px] transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                </div>
              </div>

              {/* Right Column: Mode Switcher + Story Overview / Custom Creator */}
              <div
                className={`min-w-0 w-full flex-1 ${
                  storySourceMode === 'custom'
                    ? 'space-y-2 sm:space-y-3 md:space-y-3.5'
                    : 'space-y-2.5 sm:space-y-3.5 md:space-y-4'
                }`}
              >
                {/* Minimalist 2-Option Story Selector */}
                <div className="border-l border-r border-[#DCDAD4] px-2.5 sm:px-6 md:px-9 py-1">
                  <div className="inline-flex p-0.5 sm:p-1 rounded-[7px] sm:rounded-[9px] bg-[#F4F3EF] border border-[#E5E3DC] mb-2 sm:mb-3 flex-wrap">
                    <button
                      onClick={() => handleSelectMode('preset')}
                      className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-[5px] sm:rounded-[6px] text-[10.5px] sm:text-[12.5px] font-medium transition-all cursor-pointer ${
                        storySourceMode === 'preset'
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#6E6D69] hover:text-[#141413]'
                      }`}
                    >
                      {t.featuredStory}
                    </button>
                    <button
                      onClick={() => handleSelectMode('custom')}
                      className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-[5px] sm:rounded-[6px] text-[10.5px] sm:text-[12.5px] font-medium transition-all cursor-pointer ${
                        storySourceMode === 'custom'
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#6E6D69] hover:text-[#141413]'
                      }`}
                    >
                      {t.createYourOwn}
                    </button>
                  </div>

                  {storySourceMode === 'preset' ? (
                    <div>
                      <h1 className="text-[18px] sm:text-[23px] md:text-[26px] font-semibold tracking-[-0.025em] text-[#141413] leading-tight pt-2 sm:pt-[12px] px-0">
                        {storyTitle}
                      </h1>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-[17px] sm:text-[24px] md:text-[28px] font-semibold tracking-[-0.025em] text-[#141413] leading-tight">
                        {t.createStoryTitle}
                      </h1>
                      <p className="text-[11.5px] sm:text-[13px] text-[#8E8D8A] mt-0.5">
                        {t.createStorySubtitle}
                      </p>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="mx-2.5 sm:mx-6 md:mx-9 text-[12px] text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] px-3.5 py-2.5 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
                    <div className="flex-1">
                      <span className="font-semibold block text-[12.5px]">{t.noticeTitle}</span>
                      <span className="leading-snug">{errorMsg}</span>
                    </div>
                    <button
                      onClick={() => setErrorMsg(null)}
                      className="text-[#991B1B] hover:text-[#141413] cursor-pointer text-[12px] p-0.5 font-medium"
                      title={t.dismiss}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {storySourceMode === 'preset' ? (
                  /* Solo Option 1: Precinct 69 Story */
                  <>
                    <div className="border-l border-r border-[#DCDAD4] px-2.5 sm:px-6 md:px-9 py-1">
                      <p className="text-[13px] sm:text-[14px] md:text-[14.5px] leading-[1.6] sm:leading-[1.65] text-[#222220]">
                        {lang === 'ar' ? AR_PRECINCT_69_SYNOPSIS : PRECINCT_69_SYNOPSIS}
                      </p>
                    </div>

                    <div className="border-l border-r border-[#DCDAD4] px-2.5 sm:px-6 md:px-9 py-1">
                      <div className="text-[10.5px] sm:text-[12px] text-[#8E8D8A]">{t.voicePromptLabel}</div>
                      <div className="text-[14.5px] font-normal italic text-[#535252] mt-0.5 sm:mt-1 leading-[1.55] sm:leading-[1.65]">
                        {voicePrompt}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap mt-3 sm:mt-5">
                        <button
                          onClick={handleStartPresetStory}
                          disabled={isSynthesizing}
                          className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-[7px] bg-[#141413] hover:bg-[#2A2A28] text-white text-[11.5px] sm:text-[13.5px] font-medium transition-colors cursor-pointer shadow-xs"
                        >
                          <Play className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                          <span>
                            {presetWavCache.url ? t.playStory : t.generateAndPlay}
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Solo Option 2: Create Your Own Solo Story */
                  <>
                    <div className="border-l border-r border-[#DCDAD4] px-2.5 sm:px-6 md:px-9 py-0.5 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10.5px] sm:text-[12.5px] text-[#8E8D8A]">
                          {t.step1Voice}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setVoiceTargetCharacterId(null);
                            setIsVoiceExplorerOpen(true);
                          }}
                          className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Compass className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'اختر من مكتبة الأصوات' : 'Pick from Catalog'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        {currentArchetypes.map((arch) => (
                          <button
                            key={arch.id}
                            type="button"
                            onClick={() => {
                              setSelectedArchetypeId(arch.id);
                              setCustomVoiceInput(arch.prompt);
                            }}
                            className={`px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border transition-colors cursor-pointer ${
                              selectedArchetypeId === arch.id
                                ? 'bg-[#141413] text-white border-[#141413]'
                                : 'bg-[#FAF9F6] text-[#575652] border-[#E2E0D8] hover:border-[#141413]'
                            }`}
                          >
                            {arch.label}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <textarea
                          rows={2}
                          value={customVoiceInput}
                          onChange={(e) => {
                            setSelectedArchetypeId('custom');
                            setCustomVoiceInput(e.target.value);
                          }}
                          placeholder={t.voicePlaceholder}
                          className={`w-full py-1.5 sm:py-2 rounded-[8px] border border-[#D4D2CC] focus:border-[#141413] focus:outline-none text-[11.5px] sm:text-[13.5px] leading-relaxed text-[#141413] bg-[#FAF9F6] resize-none ${
                            lang === 'ar' ? 'pl-20 sm:pl-28 pr-2.5 sm:pr-3.5' : 'pr-20 sm:pr-28 pl-2.5 sm:pr-3.5'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleEnhanceVoice}
                          disabled={isEnhancingVoice || !customVoiceInput.trim()}
                          className={`absolute bottom-2 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-[6px] bg-white border border-[#D4D2CC] hover:border-[#141413] text-[10px] sm:text-[11.5px] font-medium text-[#141413] shadow-2xs disabled:opacity-50 transition-colors cursor-pointer ${
                            lang === 'ar' ? 'left-2' : 'right-2'
                          }`}
                          title={t.enhanceTitle}
                        >
                          {isEnhancingVoice ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          <span>{isEnhancingVoice ? t.enhancingVoice : t.enhanceVoice}</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Scene / Story Subject */}
                    <div className="border-l border-r border-[#DCDAD4] px-2.5 sm:px-6 md:px-9 py-0.5 space-y-1.5 sm:space-y-2">
                      <label className="block text-[10.5px] sm:text-[12.5px] text-[#8E8D8A]">
                        {t.step2Scene}
                      </label>
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        {currentScenePresets.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setSelectedScenePresetId(preset.id);
                              setCustomSceneTopic(preset.prompt);
                            }}
                            className={`px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium border transition-colors cursor-pointer ${
                              selectedScenePresetId === preset.id
                                ? 'bg-[#141413] text-white border-[#141413]'
                                : 'bg-[#FAF9F6] text-[#575652] border-[#E2E0D8] hover:border-[#141413]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={2}
                        value={customSceneTopic}
                        onChange={(e) => {
                          setSelectedScenePresetId('custom');
                          setCustomSceneTopic(e.target.value);
                        }}
                        placeholder={t.scenePlaceholder}
                        className="w-full px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-[8px] border border-[#D4D2CC] focus:border-[#141413] focus:outline-none text-[11.5px] sm:text-[13.5px] leading-relaxed text-[#141413] bg-[#FAF9F6] resize-none"
                      />

                      <div className="pt-0.5 sm:pt-1">
                        <button
                          onClick={handleGenerateAndPlayCustomStory}
                          disabled={
                            isSynthesizing || !customSceneTopic.trim() || !customVoiceInput.trim()
                          }
                          className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-[7px] bg-[#141413] hover:bg-[#2A2A28] disabled:opacity-50 text-white text-[11.5px] sm:text-[13.5px] font-medium transition-colors cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          <span>{t.generateAndPlay}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        )}

        {/* ====================================================================
            BOTTOM BAR: Minimal Scrubber (Only shown in Story Reader Mode)
           ==================================================================== */}
        {isStoryMode ? (
          <div className="pt-4 border-t border-[#F0EEE8] flex items-center justify-between gap-4 text-[11.5px] font-mono-code text-[#8E8D8A]">
            <div>{oneTakeWavUrl ? `${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s` : ''}</div>
            {oneTakeWavUrl && (
              <div className="flex-1 max-w-md flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.05}
                  value={currentTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentTime(val);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="w-full accent-[#141413] h-1 bg-[#E5E3DC] rounded-lg cursor-pointer"
                />
              </div>
            )}
            <div>{t.keyboardHint}</div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* ====================================================================
          DRAWER 1: Script & Tags (Plain Text Copy & Verbatim Prompt Block)
         ==================================================================== */}
      {activeDrawer === 'script' && (
        <div className={`fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex ${lang === 'ar' ? 'justify-start' : 'justify-end'}`}>
          <div className={`bg-white w-full max-w-2xl h-full shadow-2xl ${lang === 'ar' ? 'border-r' : 'border-l'} border-[#E5E3DC] p-6 sm:p-8 flex flex-col`}>
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#141413]" />
                <h3 className="text-[15px] font-semibold text-[#141413]">
                  {t.drawerScriptTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveDrawer('none')}
                className="p-1.5 text-[#8E8D8A] hover:text-[#141413] cursor-pointer"
                title={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 pr-4 sm:pr-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2 gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[13px] font-semibold text-[#141413] block">
                      {t.scriptTurnByTurnTitle}
                    </span>
                    <span className="text-[11.5px] text-[#8E8D8A]">
                      {t.scriptTurnByTurnDesc}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('turns', plainTextTurnByTurn)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[#E2E0D8] bg-[#FAF9F6] text-[11.5px] font-mono-code text-[#5E5D59] hover:text-[#141413] hover:border-[#141413] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'turns' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-700 font-medium">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyScript}</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 sm:p-4 rounded-[8px] bg-[#F7F6F2] border border-[#E5E3DC] text-[12px] font-mono-code whitespace-pre-wrap leading-relaxed text-[#222220]">
                  {plainTextTurnByTurn}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-[13px] font-semibold text-[#141413] block">
                      {t.scriptContinuousTitle}
                    </span>
                    <span className="text-[11.5px] text-[#8E8D8A]">
                      {t.scriptContinuousDesc}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('continuous', plainTextContinuous)}
                    className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[#E2E0D8] bg-[#FAF9F6] text-[11.5px] font-mono-code text-[#5E5D59] hover:text-[#141413] hover:border-[#141413] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'continuous' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-700 font-medium">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyPrompt}</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 sm:p-4 rounded-[8px] bg-[#F7F6F2] border border-[#E5E3DC] text-[12px] font-mono-code whitespace-pre-wrap leading-relaxed text-[#222220]">
                  {plainTextContinuous}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DRAWER 2: Voice Design & API Key Settings (Hidden under "Settings")
         ==================================================================== */}
      {activeDrawer === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] border border-[#E5E3DC] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <h3 className="text-[16px] font-semibold text-[#141413]">
                {t.drawerSettingsTitle}
              </h3>
              <button
                onClick={() => setActiveDrawer('none')}
                className="p-1 text-[#8E8D8A] hover:text-[#141413] cursor-pointer"
                title={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-[#454440] mb-1">
                    {t.ttsModelLabel}
                  </label>
                  <select
                    value={modelName}
                    onChange={(e) => {
                      setModelName(e.target.value as any);
                      setOneTakeWavUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded border border-[#D4D2CC] text-[13px] bg-white"
                  >
                    <option value="models/gemini-3.8-flash-tts">models/gemini-3.8-flash-tts (Gemini 3.8 Flash TTS)</option>
                    <option value="models/gemini-3.8-flash-lite-tts">models/gemini-3.8-flash-lite-tts (Gemini 3.8 Flash Lite TTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#454440] mb-1">
                    {t.fallbackVoiceLabel}
                  </label>
                  <select
                    value={fallbackPrebuiltVoice}
                    onChange={(e) => {
                      setFallbackPrebuiltVoice(e.target.value);
                      setOneTakeWavUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded border border-[#D4D2CC] text-[13px] bg-white"
                  >
                    <option value="auto">{t.autoFallback}</option>
                    <option value="Charon">{t.charonDesc}</option>
                    <option value="Sulafat">{t.sulafatDesc}</option>
                    <option value="Fenrir">{t.fenrirDesc}</option>
                    <option value="Puck">{t.puckDesc}</option>
                    <option value="Kore">{t.koreDesc}</option>
                    <option value="Aoede">{t.aoedeDesc}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setOneTakeWavUrl(null);
                  setVoiceId('');
                  setActiveDrawer('none');
                  runSynthesisPipeline(beats, voicePrompt, storyTitle, '', storySourceMode === 'preset');
                }}
                className="inline-flex items-center gap-1.5 text-[12px] text-[#5E5D59] hover:text-[#141413] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.reGenerateStory}</span>
              </button>

              <button
                onClick={() => setActiveDrawer('none')}
                className="px-4 py-2 rounded bg-[#141413] text-white text-[12.5px] font-medium hover:bg-[#2A2A28] cursor-pointer"
              >
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          VOICE EXPLORER MODAL: Female, Other Men, Youth, Children
         ==================================================================== */}
      {isVoiceExplorerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-[18px] border border-[#E5E3DC] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-[#EFECE6] flex items-center justify-between gap-4 bg-[#FAF9F6]">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-[17px] font-bold text-[#141413]">
                    {t.voiceExplorer}
                  </h3>
                </div>
                <p className="text-[12px] text-[#787672] mt-0.5">
                  {voiceTargetCharacterId
                    ? (lang === 'ar'
                        ? `اختيار صوت للشخصية: ${customCast.find((c) => c.id === voiceTargetCharacterId)?.name || ''}`
                        : `Selecting voice for: ${customCast.find((c) => c.id === voiceTargetCharacterId)?.name || ''}`)
                    : t.voiceExplorerDesc}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsVoiceExplorerOpen(false);
                  setVoiceTargetCharacterId(null);
                }}
                className="p-1.5 text-[#8E8D8A] hover:text-[#141413] rounded-md hover:bg-black/5 transition-colors cursor-pointer"
                title={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-5 sm:px-7 py-3 border-b border-[#F0EEE8] flex items-center gap-1.5 sm:gap-2 flex-wrap bg-white">
              {(
                [
                  { id: 'all', label: t.categoryAll },
                  { id: 'female', label: t.categoryFemale },
                  { id: 'male', label: t.categoryMale },
                  { id: 'youth', label: t.categoryYouth },
                  { id: 'child', label: t.categoryChild },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setVoiceFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer ${
                    voiceFilterCategory === cat.id
                      ? 'bg-[#141413] text-white shadow-2xs'
                      : 'bg-[#F4F3EE] text-[#55534E] hover:text-[#141413] hover:bg-[#EAE8E0]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Voices Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              {VOICE_CATALOG.filter(
                (v) => voiceFilterCategory === 'all' || v.category === voiceFilterCategory,
              ).map((persona) => {
                const name = lang === 'ar' ? persona.nameAr : persona.nameEn;
                const tag = lang === 'ar' ? persona.tagAr : persona.tagEn;
                const prompt = lang === 'ar' ? persona.promptAr : persona.promptEn;
                const roles = lang === 'ar' ? persona.recommendedRoleAr : persona.recommendedRoleEn;

                return (
                  <div
                    key={persona.id}
                    className="p-4 sm:p-5 rounded-[14px] border border-[#E5E3DC] hover:border-[#141413] transition-all bg-white flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs group"
                  >
                    <div>
                      {/* Avatar, Name, Prebuilt Voice & Category */}
                      <div className="flex items-start justify-between gap-2.5 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-[20px] shadow-2xs shrink-0 ${persona.avatarColor}`}
                          >
                            {persona.avatarEmoji}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-[15px] font-bold text-[#141413] leading-tight">
                                {name}
                              </h4>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${persona.badgeBg}`}
                              >
                                {tag}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#888681] font-mono-code block mt-0.5">
                              {lang === 'ar' ? `محرك الصوت: ${persona.prebuiltVoice}` : `Engine: ${persona.prebuiltVoice}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Prompt description */}
                      <p className="text-[12px] sm:text-[12.5px] text-[#42413E] leading-relaxed italic bg-[#FAF9F6] p-2.5 rounded-[8px] border border-[#F0EEE8] mb-2.5">
                        « {prompt} »
                      </p>

                      {/* Recommended roles */}
                      <div className="text-[11px] text-[#73716C] leading-snug">
                        <span className="font-semibold text-[#141413]">
                          {lang === 'ar' ? 'أدوار مقترحة: ' : 'Suggested Roles: '}
                        </span>
                        {roles}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-2 border-t border-[#F0EEE8] flex items-center justify-end">
                      <button
                        onClick={() => handleSelectVoiceFromExplorer(persona)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[7px] bg-[#141413] hover:bg-[#2A2A28] text-white text-[12px] font-medium transition-colors cursor-pointer shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {voiceTargetCharacterId
                            ? t.selectThisVoice
                            : (lang === 'ar' ? 'استخدام في المونولوج' : 'Use in Monologue')}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-7 py-3 border-t border-[#EFECE6] flex items-center justify-between bg-[#FAF9F6]">
              <span className="text-[11.5px] text-[#888681]">
                {lang === 'ar'
                  ? `${VOICE_CATALOG.length} أصوات مسجلة في المكتبة (إناث، رجال، شباب، أطفال)`
                  : `${VOICE_CATALOG.length} voice personas in catalog (Female, Men, Youth, Children)`}
              </span>
              <button
                onClick={() => {
                  setIsVoiceExplorerOpen(false);
                  setVoiceTargetCharacterId(null);
                }}
                className="px-4 py-1.5 rounded-[7px] border border-[#D4D2CC] hover:border-[#141413] text-[12px] font-medium text-[#141413] bg-white cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
