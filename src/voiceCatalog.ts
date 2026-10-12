// Voice Catalog & Multi-Character Story Library
// Comprehensive voice personas: Female, Other Men, Youth, Children
// Multi-character story presets and casting configuration

export type VoiceCategory = 'female' | 'male' | 'youth' | 'child';

export interface VoicePersona {
  id: string;
  category: VoiceCategory;
  nameEn: string;
  nameAr: string;
  tagEn: string;
  tagAr: string;
  gender: 'female' | 'male' | 'neutral';
  ageGroup: 'child' | 'youth' | 'adult' | 'elder';
  prebuiltVoice: string; // Prebuilt fallback or engine voice
  promptEn: string;
  promptAr: string;
  avatarEmoji: string;
  avatarColor: string;
  badgeBg: string;
  recommendedRoleEn: string;
  recommendedRoleAr: string;
}

export interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  category: VoiceCategory;
  voicePersonaId: string;
  fallbackVoice: string;
  avatarEmoji: string;
  color: string;
}

export interface DialogueTurn {
  turnIndex: number;
  characterId: string;
  speakerName: string;
  style: string;
  text: string;
  start: number;
  end: number;
}

export interface MultiCharacterStoryPreset {
  id: string;
  titleEn: string;
  titleAr: string;
  synopsisEn: string;
  synopsisAr: string;
  characters: StoryCharacter[];
  turnsEn: DialogueTurn[];
  turnsAr: DialogueTurn[];
}

// ============================================================================
// 1. Comprehensive Voice Library (Female, Other Men, Youth, Children)
// ============================================================================
export const VOICE_CATALOG: VoicePersona[] = [
  // --- FEMALE VOICES (أصوات إناث) ---
  {
    id: 'aoede-female',
    category: 'female',
    nameEn: 'Aoede',
    nameAr: 'أويدي',
    tagEn: 'Warm & Expressive',
    tagAr: 'دافئة ومُعبّرة',
    gender: 'female',
    ageGroup: 'adult',
    prebuiltVoice: 'Aoede',
    promptEn: 'A 38-year-old articulate woman with a warm, empathetic mezzo-soprano timbre, clear diction, and natural conversational melody.',
    promptAr: 'امرأة في الـ 38 من عمرها بصوت ميزو سوبرانو دافئ ومُعبّر، ونطق دقيق وإيقاع كلام طبيعي مفعم بالتعاطف.',
    avatarEmoji: '👩‍💼',
    avatarColor: 'bg-rose-500 text-white',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    recommendedRoleEn: 'Lead Detective, Doctor, Mother, Professional Host',
    recommendedRoleAr: 'طبيبة، محققة، أم حنون، مذيعة محترفة',
  },
  {
    id: 'kore-female',
    category: 'female',
    nameEn: 'Kore',
    nameAr: 'كوري',
    tagEn: 'Gentle & Soothing',
    tagAr: 'هادئة وناعمة',
    gender: 'female',
    ageGroup: 'adult',
    prebuiltVoice: 'Kore',
    promptEn: 'A 32-year-old woman with a serene, soft-spoken voice, gentle breathy warmth, and calm reflective cadence.',
    promptAr: 'امرأة في الـ 32 من عمرها بنبرة صوت رقيقة وهادئة، ونفَس دافئ رقيق وإيقاع كلام متأمل ومطمئن.',
    avatarEmoji: '👩‍⚕️',
    avatarColor: 'bg-emerald-500 text-white',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    recommendedRoleEn: 'Counselor, Caregiver, Confidante, Poet',
    recommendedRoleAr: 'مرشدة نفسية، راوية، شريكة متفهمة، شاعرة',
  },
  {
    id: 'zephyr-female',
    category: 'female',
    nameEn: 'Zephyr',
    nameAr: 'زفير',
    tagEn: 'Crisp & Modern',
    tagAr: 'عصرية وحيوية',
    gender: 'female',
    ageGroup: 'adult',
    prebuiltVoice: 'Aoede',
    promptEn: 'A 28-year-old dynamic woman with a bright, crisp contemporary voice, sharp articulation, and decisive pacing.',
    promptAr: 'شابة في الـ 28 من عمرها بصوت عصري واثق وحيوي، ومخارج حروف حادة وإيقاع كلام سريع وحاسم.',
    avatarEmoji: '👩‍💻',
    avatarColor: 'bg-cyan-600 text-white',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    recommendedRoleEn: 'Investigator, Tech Engineer, Journalist, Strategist',
    recommendedRoleAr: 'مهندسة تقنية، صحفية استقصائية، ضابطة تخطيط',
  },
  {
    id: 'calliope-female',
    category: 'female',
    nameEn: 'Calliope',
    nameAr: 'كاليوبي',
    tagEn: 'Theatrical & Poised',
    tagAr: 'مسرحية ورصينة',
    gender: 'female',
    ageGroup: 'adult',
    prebuiltVoice: 'Sulafat',
    promptEn: 'A 45-year-old woman with a stately, resonant theatrical contralto, commanding projection, and aristocratic poise.',
    promptAr: 'سيدة في الـ 45 من عمرها بصوت كونترالتو مسرحي وقور ورنان، مع إلقاء جهوري فخم ونبرة أرستقراطية.',
    avatarEmoji: '⚖️',
    avatarColor: 'bg-purple-600 text-white',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    recommendedRoleEn: 'Prosecutor, Judge, Royalty, Academy Director',
    recommendedRoleAr: 'قاضية، مدعية عامة، سيدة أعمال، شخصية قيادية',
  },
  {
    id: 'grandma-female',
    category: 'female',
    nameEn: 'Grandmother Nora',
    nameAr: 'الجدة نورا',
    tagEn: 'Maternal Elder',
    tagAr: 'جدة حنونة ومسنة',
    gender: 'female',
    ageGroup: 'elder',
    prebuiltVoice: 'Kore',
    promptEn: 'A 68-year-old gentle grandmother with a warm, slightly raspy, comforting maternal voice and slow loving cadence.',
    promptAr: 'جدة حنونة في الـ 68 من عمرها بصوت دافئ ومتهدج بلطف، مع بحة وقورة وإيقاع كلام أمومي حنون.',
    avatarEmoji: '👵',
    avatarColor: 'bg-amber-600 text-white',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    recommendedRoleEn: 'Wise Grandmother, Village Elder, Matriarch',
    recommendedRoleAr: 'جدة حكيمة، سيدة البيت الكبيرة، راوية حكايات',
  },

  // --- MEN VOICES (رجال آخرون) ---
  {
    id: 'charon-male',
    category: 'male',
    nameEn: 'Charon',
    nameAr: 'شارون',
    tagEn: 'Gravelly Baritone',
    tagAr: 'باريتون عميق وأجش',
    gender: 'male',
    ageGroup: 'adult',
    prebuiltVoice: 'Charon',
    promptEn: 'A 60-year-old retired detective with a heavy, gravelly baritone, deep chest resonance, and authentic gritty street cadence.',
    promptAr: 'محقق متقاعد في الـ 60 من عمره بصوت باريتون أجش وثقيل، مع رنين صدري عميق ونبرة شوارع حازمة ومجروحة.',
    avatarEmoji: '🕵️‍♂️',
    avatarColor: 'bg-slate-700 text-white',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    recommendedRoleEn: 'Hardboiled Detective, Veteran, Tough Negotiator',
    recommendedRoleAr: 'محقق مخضرم، عسكري متقاعد، رجل عصامي خشن',
  },
  {
    id: 'fenrir-male',
    category: 'male',
    nameEn: 'Fenrir',
    nameAr: 'فنرير',
    tagEn: 'Commanding & Powerful',
    tagAr: 'جهوري وقوي',
    gender: 'male',
    ageGroup: 'adult',
    prebuiltVoice: 'Fenrir',
    promptEn: 'A 44-year-old commanding man with an intense, booming bass-baritone, deep diaphragmatic power, and authoritative weight.',
    promptAr: 'رجل في الـ 44 من عمره بنبرة باس-باريتون مدوية وقوية، ورنين صدري مهيب وإيقاع حازم قاطع.',
    avatarEmoji: '👮‍♂️',
    avatarColor: 'bg-blue-700 text-white',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    recommendedRoleEn: 'Chief of Police, Military Commander, Stern Father',
    recommendedRoleAr: 'قائد شرطة، جنرال، أب صارم، شخصية نافذة',
  },
  {
    id: 'orpheus-male',
    category: 'male',
    nameEn: 'Orpheus',
    nameAr: 'أورفيوس',
    tagEn: 'Theatrical Storyteller',
    tagAr: 'حكواتي ومسرحي',
    gender: 'male',
    ageGroup: 'adult',
    prebuiltVoice: 'Charon',
    promptEn: 'A 50-year-old dramatic actor with a melodic, resonant baritone, rich vocal inflections, and poetic cadence.',
    promptAr: 'ممثل مسرحي في الـ 50 من عمره بصوت باريتون رخيم ومعبر، مع نبرة أدبية بليغة وإيقاع درامي مؤثر.',
    avatarEmoji: '🎭',
    avatarColor: 'bg-indigo-600 text-white',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    recommendedRoleEn: 'Dramatic Narrator, Professor, Romantic Lead',
    recommendedRoleAr: 'حكواتي، أستاذ جامعي، فنان، فيلسوف',
  },
  {
    id: 'achilles-male',
    category: 'male',
    nameEn: 'Achilles',
    nameAr: 'أخيل',
    tagEn: 'Sharp & Direct',
    tagAr: 'حاسم وجريء',
    gender: 'male',
    ageGroup: 'adult',
    prebuiltVoice: 'Fenrir',
    promptEn: 'A 34-year-old confident man with a crisp, athletic tenor-baritone, direct delivery, and intense focused rhythm.',
    promptAr: 'رجل واثق في الـ 34 من عمره بنبرة تينور-باريتون واضحة ورياضية، وإلقاء سريع وجريء ومباشر.',
    avatarEmoji: '🏃‍♂️',
    avatarColor: 'bg-stone-700 text-white',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    recommendedRoleEn: 'Rookie Partner, Defense Lawyer, Athletic Hero',
    recommendedRoleAr: 'محامي دفاع، شريك شاب، ضابط ميداني متحمس',
  },
  {
    id: 'grandpa-male',
    category: 'male',
    nameEn: 'Grandpa Ibrahim',
    nameAr: 'الجد إبراهيم',
    tagEn: 'Wise Elder',
    tagAr: 'شيخ حكيم ووقور',
    gender: 'male',
    ageGroup: 'elder',
    prebuiltVoice: 'Charon',
    promptEn: 'A 74-year-old grandfather with a gentle, raspy, distinguished voice and reflective measured cadence.',
    promptAr: 'جد حكيم في الـ 74 من عمره بصوت دافئ ومبحوح بوقار، ورزانة هادئة وإيقاع حكيم حنون.',
    avatarEmoji: '👴',
    avatarColor: 'bg-amber-700 text-white',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    recommendedRoleEn: 'Wise Elder, Grandfather, Village Sage',
    recommendedRoleAr: 'جد وقور، حكيم العائلة، شيخ القبيلة',
  },

  // --- YOUTH VOICES (شباب - فتيات وشبان) ---
  {
    id: 'puck-youth',
    category: 'youth',
    nameEn: 'Puck',
    nameAr: 'باك (شاب)',
    tagEn: 'Energetic & Playful',
    tagAr: 'مرح وشبابي مفعم بالطاقة',
    gender: 'male',
    ageGroup: 'youth',
    prebuiltVoice: 'Puck',
    promptEn: 'A 19-year-old lively male student with an upbeat, high-tenor voice, buoyant pacing, and youthful spontaneity.',
    promptAr: 'شاب في الـ 19 من عمره بصوت تينور مرتفع ومفعم بالحيوية، وإيقاع كلام سريع ومرح ومندفع بعفوية.',
    avatarEmoji: '👦',
    avatarColor: 'bg-violet-600 text-white',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    recommendedRoleEn: 'College Student, Mischievous Teen, Rookie Sidekick',
    recommendedRoleAr: 'طالب جامعي، مراهق مندفع، مساعد ذكي ومرح',
  },
  {
    id: 'maya-youth',
    category: 'youth',
    nameEn: 'Maya',
    nameAr: 'مايا (شابة)',
    tagEn: 'Spirited Student',
    tagAr: 'شابة طموحة وحيوية',
    gender: 'female',
    ageGroup: 'youth',
    prebuiltVoice: 'Aoede',
    promptEn: 'A 20-year-old vibrant female student with an enthusiastic, bright tone, clear highs, and expressive pacing.',
    promptAr: 'شابة في الـ 20 من عمرها بصوت رنان ومشرق، ونبرة متفائلة مليئة بالحماس والذكاء والإيقاع السريع.',
    avatarEmoji: '👧',
    avatarColor: 'bg-pink-600 text-white',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    recommendedRoleEn: 'Tech Hacker, University Leader, Spirited Daughter',
    recommendedRoleAr: 'طالبة متفوقة، مبرمجة شابة، ابنة ذكية وطموحة',
  },

  // --- CHILDREN VOICES (أطفال - أولاد وبنات) ---
  {
    id: 'sami-child-boy',
    category: 'child',
    nameEn: 'Little Sami (7yo Boy)',
    nameAr: 'الطفل سامي (7 سنوات)',
    tagEn: 'Curious & Eager Child',
    tagAr: 'طفل فضولي وبراءة طفولية',
    gender: 'male',
    ageGroup: 'child',
    prebuiltVoice: 'Puck',
    promptEn: 'A 7-year-old sweet, curious young boy with a high-pitched, enthusiastic voice, slight breathy excitement, and innocent wonder.',
    promptAr: 'طفل صغير محبوب في الـ 7 من عمره بنبرة صوت طفولية بريئة عالية النبرة، وضحكات عفوية وتساؤلات مليئة بالدهشة.',
    avatarEmoji: '🧒',
    avatarColor: 'bg-teal-600 text-white',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    recommendedRoleEn: 'Curious Young Son, Little Brother, Adventurous Kid',
    recommendedRoleAr: 'طفل فضولي، ابن صغير، فتى مغامر ومرح',
  },
  {
    id: 'lily-child-girl',
    category: 'child',
    nameEn: 'Little Lily (6yo Girl)',
    nameAr: 'الطفلة ليلى (6 سنوات)',
    tagEn: 'Sweet & Innocent Girl',
    tagAr: 'طفلة بريئة وعذبة',
    gender: 'female',
    ageGroup: 'child',
    prebuiltVoice: 'Kore',
    promptEn: 'A 6-year-old delicate little girl with a sweet, high-pitched voice, playful sing-song cadence, and pure childlike innocence.',
    promptAr: 'طفلة بريئة في الـ 6 من عمرها بصوت طفولي ناعم وعذب ورقيق، ونبرة دافئة وضحكات بريئة مليئة بالعفوية.',
    avatarEmoji: '👧',
    avatarColor: 'bg-rose-400 text-white',
    badgeBg: 'bg-rose-50 text-rose-600 border-rose-200',
    recommendedRoleEn: 'Sweet Young Daughter, Little Sister, Bedtime Story Child',
    recommendedRoleAr: 'ابنة صغيرة، أخت صغرى، طفلة الحكايات الساحرة',
  },
  {
    id: 'tariq-tween',
    category: 'child',
    nameEn: 'Tariq (11yo Kid)',
    nameAr: 'طارق (فتى 11 سنة)',
    tagEn: 'Clever Older Kid',
    tagAr: 'فتى ذكي وملاحظ',
    gender: 'male',
    ageGroup: 'child',
    prebuiltVoice: 'Puck',
    promptEn: 'An 11-year-old observant boy with an articulate, energetic tone, quick wit, and confident childhood curiosity.',
    promptAr: 'فتى نبيه في الـ 11 من عمره بنبرة طفولية ناضجة وسريعة، وذكاء متقد وثقة وفضول استكشافي كبير.',
    avatarEmoji: '🧢',
    avatarColor: 'bg-indigo-500 text-white',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    recommendedRoleEn: 'Young Detective Kid, Tech Prodigy, Inquisitive Boy',
    recommendedRoleAr: 'محقق صغير، فتى ذكي، أخ أكبر فضولي',
  },
];

// ============================================================================
// 2. Preset Multi-Character Stories (Ready to Play in English & Arabic)
// ============================================================================
export const MULTI_CHARACTER_PRESETS: MultiCharacterStoryPreset[] = [
  // Preset 1: The Midnight Interrogation
  {
    id: 'midnight-interrogation',
    titleEn: 'The Midnight Interrogation',
    titleAr: 'تحقيق منتصف الليل',
    synopsisEn:
      'A tense three-way clash at 2:00 AM between veteran detective Marco, defiant ER surgeon Dr. Nora, and young rookie officer Tariq.',
    synopsisAr:
      'مواجهة مشتعلة في الثانية فجراً بين المحقق الخشن ماركو، والطبيبة الجريئة د. نورا، والضابط الشاب المتوتر طارق.',
    characters: [
      {
        id: 'char-marco',
        name: 'Det. Marco',
        role: 'Veteran Detective (Baritone)',
        category: 'male',
        voicePersonaId: 'charon-male',
        fallbackVoice: 'Charon',
        avatarEmoji: '🕵️‍♂️',
        color: 'border-slate-500 bg-slate-50 text-slate-800',
      },
      {
        id: 'char-nora',
        name: 'Dr. Nora',
        role: 'ER Surgeon (Female)',
        category: 'female',
        voicePersonaId: 'aoede-female',
        fallbackVoice: 'Aoede',
        avatarEmoji: '👩‍⚕️',
        color: 'border-rose-400 bg-rose-50 text-rose-800',
      },
      {
        id: 'char-tariq',
        name: 'Officer Tariq',
        role: 'Rookie Officer (Youth)',
        category: 'youth',
        voicePersonaId: 'puck-youth',
        fallbackVoice: 'Puck',
        avatarEmoji: '👮‍♂️',
        color: 'border-blue-400 bg-blue-50 text-blue-800',
      },
    ],
    turnsEn: [
      {
        turnIndex: 0,
        characterId: 'char-marco',
        speakerName: 'Det. Marco',
        style: 'Low, gravelly, menacing baritone, leaning forward onto metal desk',
        text: '<chuckle> Midnight in Interrogation Room B, Doctor. <short pause> Care to explain why your surgical gloves were found in the evidence vault?',
        start: 0,
        end: 6.2,
      },
      {
        turnIndex: 1,
        characterId: 'char-nora',
        speakerName: 'Dr. Nora',
        style: 'Indignant, sharp, defensive female voice, pacing back and forth',
        text: "<laugh> Are you SERIOUS, Detective? <breath> I was in Trauma Room Three cracking open a chest cavity until four in the morning!",
        start: 6.2,
        end: 12.5,
      },
      {
        turnIndex: 2,
        characterId: 'char-tariq',
        speakerName: 'Officer Tariq',
        style: 'Nervous youthful voice, rushing over with an open tablet, slightly breathless',
        text: '<breath> Lieutenant! <short pause> The security footage from the west wing just uploaded. She’s telling the truth... but someone swiped her keycard at eleven!',
        start: 12.5,
        end: 19.1,
      },
      {
        turnIndex: 3,
        characterId: 'char-marco',
        speakerName: 'Det. Marco',
        style: 'Loud sudden irritation, slamming hand on table, gravelly snap',
        text: 'Wait a second. <short pause> Who in this precinct had access to her badge? <cough> Tariq, lock down every exit right NOW!',
        start: 19.1,
        end: 25.8,
      },
      {
        turnIndex: 4,
        characterId: 'char-nora',
        speakerName: 'Dr. Nora',
        style: 'Whispering, terrified realization, leaning across the table, hushed',
        text: '<breath> Keep your voice down. <short pause> It wasn’t a stranger. It was the chief of surgery.',
        start: 25.8,
        end: 31.4,
      },
      {
        turnIndex: 5,
        characterId: 'char-marco',
        speakerName: 'Det. Marco',
        style: 'Snap back to loud full-chest volume, NOT whispering, explosive realization, gallows laugh',
        text: '<laugh> <sigh> UNBELIEVABLE. Thirty years on the force and the rot goes straight to the board of directors!',
        start: 31.4,
        end: 38.0,
      },
    ],
    turnsAr: [
      {
        turnIndex: 0,
        characterId: 'char-marco',
        speakerName: 'المحقق ماركو',
        style: 'صوت باريتون منخفض وخشن ومهيب، متكئ للأمام على الطاولة المعدنية',
        text: '<chuckle> منتصف الليل في غرفة التحقيق (ب) يا دكتورة. <short pause> هل تتكرمين بتفسير وجود قفازاتك الجراحية داخل خزانة الأحراز؟',
        start: 0,
        end: 6.5,
      },
      {
        turnIndex: 1,
        characterId: 'char-nora',
        speakerName: 'د. نورا',
        style: 'صوت نسائي حاد ومستنكر، وتيرة سريعة وواثقة مع وقفة دفاعية',
        text: '<laugh> هل تمزح معي يا محقق؟ <breath> كنت في غرفة العمليات الطارئة أنقذ حياة مريض حتى الرابعة فجراً!',
        start: 6.5,
        end: 12.8,
      },
      {
        turnIndex: 2,
        characterId: 'char-tariq',
        speakerName: 'الضابط طارق',
        style: 'صوت شاب متوتر وسريع، يتقدم حاملاً شاشة إلكترونية، أنفاس متقطعة',
        text: '<breath> سيدي المحقق! <short pause> تسجيلات كاميرات الجناح الغربي وصلت للتو. الدكتورة بريئة... لكن أحدهم سرق بطاقتها الممغنطة في الحادية عشرة!',
        start: 12.8,
        end: 20.2,
      },
      {
        turnIndex: 3,
        characterId: 'char-marco',
        speakerName: 'المحقق ماركو',
        style: 'غضب حاد مباغت، ضرب الطاولة بقوة، صوت أجش صارم',
        text: 'انتظر لحظة! <short pause> من في هذا القسم يمكنه الوصول إلى بطاقتها؟ <cough> يا طارق، أغلق جميع المخارج فوراً!',
        start: 20.2,
        end: 27.0,
      },
      {
        turnIndex: 4,
        characterId: 'char-nora',
        speakerName: 'د. نورا',
        style: 'همس مذعور قريب، نبرة خوف وتكتم، اقتراب فوق الطاولة',
        text: '<breath> اخفض صوتك أرجوك. <short pause> لم يكن شخصاً غريباً... إنه رئيس قسم الجراحة بنفسه.',
        start: 27.0,
        end: 33.1,
      },
      {
        turnIndex: 5,
        characterId: 'char-marco',
        speakerName: 'المحقق ماركو',
        style: 'عودة لصوت جهوري مرتفع كامل الصدر، ضحكة خيبة مريرة وغضب عارم',
        text: '<laugh> <sigh> أمر لا يصدق! ثلاثون عاماً في الشرطة والفساد متجذر في أعلى الهرم الطبي!',
        start: 33.1,
        end: 40.0,
      },
    ],
  },

  // Preset 2: The Bedtime Dinosaur Mystery (Featuring a 7yo Child, Warm Mother, Wise Grandpa)
  {
    id: 'bedtime-mystery',
    titleEn: 'The Lost Dinosaur Secret',
    titleAr: 'سر الديناصور المفقود',
    synopsisEn:
      'A heartwarming bedtime caper featuring 7-year-old Sami, his warm mother Sarah, and wise storytelling grandfather Ibrahim.',
    synopsisAr:
      'مغامرة عائلية دافئة ومرحة قبل النوم بين الطفل سامي (7 سنوات)، ووالدته الحنونة سارة، وجده الحكيم إبراهيم.',
    characters: [
      {
        id: 'char-sami',
        name: 'Little Sami',
        role: '7-Year-Old Boy (Child Voice)',
        category: 'child',
        voicePersonaId: 'sami-child-boy',
        fallbackVoice: 'Puck',
        avatarEmoji: '🧒',
        color: 'border-teal-400 bg-teal-50 text-teal-800',
      },
      {
        id: 'char-sarah',
        name: 'Mama Sarah',
        role: 'Warm Mother (Female Voice)',
        category: 'female',
        voicePersonaId: 'aoede-female',
        fallbackVoice: 'Aoede',
        avatarEmoji: '👩',
        color: 'border-rose-400 bg-rose-50 text-rose-800',
      },
      {
        id: 'char-grandpa',
        name: 'Grandpa Ibrahim',
        role: 'Wise Grandfather (Elder Voice)',
        category: 'male',
        voicePersonaId: 'grandpa-male',
        fallbackVoice: 'Charon',
        avatarEmoji: '👴',
        color: 'border-amber-400 bg-amber-50 text-amber-800',
      },
    ],
    turnsEn: [
      {
        turnIndex: 0,
        characterId: 'char-sami',
        speakerName: 'Little Sami',
        style: 'High-pitched eager child voice, breathless, jumping on the bed',
        text: "<breath> Mama! Mama! Look! <short pause> Captain Rex didn't get lost under the bed, he went on a secret space mission!",
        start: 0,
        end: 6.0,
      },
      {
        turnIndex: 1,
        characterId: 'char-sarah',
        speakerName: 'Mama Sarah',
        style: 'Warm, affectionate mother voice, gentle laughter, tucking the blanket',
        text: '<chuckle> A space mission? <short pause> Then why did Captain Rex leave biscuit crumbs all over my clean rug, mister?',
        start: 6.0,
        end: 12.2,
      },
      {
        turnIndex: 2,
        characterId: 'char-grandpa',
        speakerName: 'Grandpa Ibrahim',
        style: 'Deep, warm, raspy grandfather chuckle, theatrical old-school warmth',
        text: '<laugh> Now, Sarah, don’t question a brave astronaut! <short pause> Every great explorer needs emergency biscuits for the journey!',
        start: 12.2,
        end: 18.8,
      },
      {
        turnIndex: 3,
        characterId: 'char-sami',
        speakerName: 'Little Sami',
        style: 'Giggling, proud high child voice, nodding excitedly',
        text: '<laugh> See, Mama? Grandpa knows science! <breath> Tomorrow we’re flying to the moon before breakfast!',
        start: 18.8,
        end: 24.5,
      },
      {
        turnIndex: 4,
        characterId: 'char-sarah',
        speakerName: 'Mama Sarah',
        style: 'Soft, gentle, sleepy maternal warmth, whispering softly',
        text: '<sigh> The moon will be waiting right outside your window, sweetheart. <short pause> Close your eyes and dream.',
        start: 24.5,
        end: 31.0,
      },
    ],
    turnsAr: [
      {
        turnIndex: 0,
        characterId: 'char-sami',
        speakerName: 'الطفل سامي',
        style: 'صوت طفل صغير مرتفع النبرة ومليء بالحماس والضحك، يقفز على السرير',
        text: '<breath> أمي! أمي انظري! <short pause> الديناصور ريكس لم يضع تحت السرير، بل ذهب في رحلة سرية إلى الفضاء!',
        start: 0,
        end: 6.2,
      },
      {
        turnIndex: 1,
        characterId: 'char-sarah',
        speakerName: 'الأم سارة',
        style: 'صوت أموي دافئ وحنون، ضحكة رقيقة وترتيب الغطاء بمحبة',
        text: '<chuckle> رحلة إلى الفضاء؟ <short pause> إذن لماذا ترك رائد الفضاء الصغير فتات البسكويت على السجادة النظيفة؟',
        start: 6.2,
        end: 12.6,
      },
      {
        turnIndex: 2,
        characterId: 'char-grandpa',
        speakerName: 'الجد إبراهيم',
        style: 'ضحكة دافئة من رجل مسن، بحة وقورة ودفء حكواتي مرح',
        text: '<laugh> دعي الصغير وشأنه يا سارة! <short pause> كل رائد فضاء عظيم يحتاج إلى وقود من البسكويت لمواجهة النجوم!',
        start: 12.6,
        end: 19.5,
      },
      {
        turnIndex: 3,
        characterId: 'char-sami',
        speakerName: 'الطفل سامي',
        style: 'ضحك طفولي مبتهج، صوت عالي وصادق، حماس طفولي نقي',
        text: '<laugh> رأيتِ يا أمي؟ جدي يفهم في العلوم! <breath> غداً سنطير إلى كوكب المشتري قبل الفطور!',
        start: 19.5,
        end: 25.8,
      },
      {
        turnIndex: 4,
        characterId: 'char-sarah',
        speakerName: 'الأم سارة',
        style: 'همس هادئ ومريح، حنان أموي ناعم، نبرة استرخاء دافئة',
        text: '<sigh> والقمر سينتظرك عند نافذتك يا حبيبي. <short pause> أغمض عينيك الجميلتين الآن ونم بسلام.',
        start: 25.8,
        end: 32.5,
      },
    ],
  },

  // Preset 3: The Radio Station Emergency (Booming Male Captain, Techie Youth Female, Innocent Little Girl)
  {
    id: 'lighthouse-emergency',
    titleEn: 'The Lighthouse Rescue',
    titleAr: 'نداء المنارة في العاصفة',
    synopsisEn:
      'A thrilling sea rescue dialogue between a thunderous sea captain, an agile young female radio engineer, and a 6-year-old child holding the lighthouse beam.',
    synopsisAr:
      'حوار إنقاذ بحري مثير في قلب العاصفة بين القبطان الهادر فنسنت، ومهندسة اللاسلكي الشابة مايا، والطفلة ليلى (6 سنوات).',
    characters: [
      {
        id: 'char-capt',
        name: 'Captain Vincent',
        role: 'Sea Captain (Booming Male)',
        category: 'male',
        voicePersonaId: 'fenrir-male',
        fallbackVoice: 'Fenrir',
        avatarEmoji: '⚓',
        color: 'border-blue-500 bg-blue-50 text-blue-900',
      },
      {
        id: 'char-maya',
        name: 'Engineer Maya',
        role: 'Radio Tech (Youth Female)',
        category: 'youth',
        voicePersonaId: 'maya-youth',
        fallbackVoice: 'Aoede',
        avatarEmoji: '📻',
        color: 'border-pink-500 bg-pink-50 text-pink-900',
      },
      {
        id: 'char-lily',
        name: 'Little Lily',
        role: '6-Year-Old Girl (Child Voice)',
        category: 'child',
        voicePersonaId: 'lily-child-girl',
        fallbackVoice: 'Kore',
        avatarEmoji: '👧',
        color: 'border-rose-300 bg-rose-50 text-rose-800',
      },
    ],
    turnsEn: [
      {
        turnIndex: 0,
        characterId: 'char-capt',
        speakerName: 'Capt. Vincent',
        style: 'Booming, powerful male voice over wind static, urgent shouting',
        text: '<breath> MAYDAY, MAYDAY! The rudder snapped on the reef! <short pause> Maya, can you reboot the lighthouse beacon before the wave hits?!',
        start: 0,
        end: 6.8,
      },
      {
        turnIndex: 1,
        characterId: 'char-maya',
        speakerName: 'Engineer Maya',
        style: 'Rapid-fire, determined youth female voice, breathless over static',
        text: "<breath> Generator's fried! I'm manually rerouting the auxiliary line, but the switch is jammed!",
        start: 6.8,
        end: 12.8,
      },
      {
        turnIndex: 2,
        characterId: 'char-lily',
        speakerName: 'Little Lily',
        style: 'Sweet, delicate 6yo girl voice, shouting bravely above the wind',
        text: '<breath> I got it, Maya! <short pause> I pulled the red lever just like you showed me! Look, the light is shining!',
        start: 12.8,
        end: 19.2,
      },
      {
        turnIndex: 3,
        characterId: 'char-capt',
        speakerName: 'Capt. Vincent',
        style: 'Booming relief, hearty thunderous sea laughter, joyful shout',
        text: '<laugh> By the saints, I see the beam! Full rudder to port! <chuckle> You little heroes just saved forty souls tonight!',
        start: 19.2,
        end: 26.5,
      },
    ],
    turnsAr: [
      {
        turnIndex: 0,
        characterId: 'char-capt',
        speakerName: 'القبطان فنسنت',
        style: 'صوت جهوري هادر لرجل بحار وسط العاصفة، صراخ حاسم واستغاثة عاجلة',
        text: '<breath> نداء استغاثة! تحطمت دفة السفينة على الصخور! <short pause> مايا، هل يمكنك تشغيل ضوء المنارة قبل وصول الموجة الكبرى؟!',
        start: 0,
        end: 7.2,
      },
      {
        turnIndex: 1,
        characterId: 'char-maya',
        speakerName: 'المهندسة مايا',
        style: 'صوت شابة سريع وحماسي، لهاث وسط أزيز أجهزة اللاسلكي',
        text: '<breath> المولد الرئيسي احترق! أحاول توصيل الخط الاحتياطي يدوياً لكن المفتاح الكهربائي عالق!',
        start: 7.2,
        end: 13.5,
      },
      {
        turnIndex: 2,
        characterId: 'char-lily',
        speakerName: 'الطفلة ليلى',
        style: 'صوت طفلة صغيرة 6 سنوات شجاعة، بريء وعذب ومرتفع وسط صوت الريح',
        text: '<breath> أنا سحبته يا مايا! <short pause> سحبت المقبض الأحمر الصغير كما علمتِني! انظري، النور يضيء البحر كله!',
        start: 13.5,
        end: 20.2,
      },
      {
        turnIndex: 3,
        characterId: 'char-capt',
        speakerName: 'القبطان فنسنت',
        style: 'صوت متهلل بالفرح والارتياح، ضحكة بحار مدوية وفخر عظيم',
        text: '<laugh> يا للروعة، أرى شعاع النور! حولوا الدفة نحو المرفأ! <chuckle> لقد أنقذتما أرواح أربعين بحاراً هذه الليلة يا أبطال!',
        start: 20.2,
        end: 28.0,
      },
    ],
  },
];
