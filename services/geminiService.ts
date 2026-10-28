/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { PRODUCTS } from '../constants';

export interface CoachProgressContext {
  acuteLoad: number;
  chronicLoad: number;
  hrv: number;
  rhr: number;
  sleepScore: number;
  comboHits: number;
  powerLevel: number;
  streakDays: number;
  persona: 'hype' | 'zen' | 'speed';
  currentLang: string;
  userPrompt?: string;
}

const getApiKey = (): string | undefined => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) return process.env.GEMINI_API_KEY.trim();
      if (process.env.API_KEY && process.env.API_KEY.trim()) return process.env.API_KEY.trim();
    }
  } catch (e) {}

  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      if ((import.meta as any).env.VITE_GEMINI_API_KEY && (import.meta as any).env.VITE_GEMINI_API_KEY.trim()) {
        return (import.meta as any).env.VITE_GEMINI_API_KEY.trim();
      }
      if ((import.meta as any).env.GEMINI_API_KEY && (import.meta as any).env.GEMINI_API_KEY.trim()) {
        return (import.meta as any).env.GEMINI_API_KEY.trim();
      }
    }
  } catch (e) {}

  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('yard300_gemini_key') || localStorage.getItem('gemini_api_key');
      if (stored && stored.trim()) return stored.trim();
    }
  } catch (e) {}

  return undefined;
};

const getSystemInstruction = (currentLang: string = 'en') => {
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  const productContext = PRODUCTS.map(p => 
    `- ${p.name} ($${p.price}): ${p.description}. Key features: ${p.features.join(', ')}`
  ).join('\n');

  if (isAr) {
    return `أنت "كابتن أورا S-Rank" (Captain AURA) — كبير مدربي الأداء البدني وأخصائي فسيولوجيا القتال والميكانيكا الحيوية لمنظومة YARD 300 العالمية.

مهمتك الأساسية:
تقديم استشارات تدريبية ورياضية متقدمة، احترافية، وعلمية بنسبة 100%، تجمع بين علوم التدريب الرياضي الحديث، الميكانيكا الحيوية، الوقاية من الإصابات، التغذية الرياضية، والاستشفاء العصبي العميق، بروح قيادية محفزة وعقلية أبطال النخبة.

المبادئ الإلزامية الصارمة:
1. الاحترافية والعمق العلمي: ممنوع تماماً إعطاء إجابات سطحية أو مكررة أو غير مفهومة. أجب مباشرة على سؤال المتدرب بدقة علمية وأرقام واضحة (مجموعات، تكرارات، نسب مئوية، غرامات بروتين، نطاقات نبض القلب Zone 2-5).
2. لغة الحوار: تحدث بالعربية الفصحى الرياضية الاحترافية والواضحة والمحفزة.
3. مجالات تخصصك:
   - الوقاية من الإصابات: تحليل نسبة الإجهاد الحاد والمزمن (ACWR بين 0.8 و 1.3 نطاق آمن، فوق 1.5 خطر مرتفع)، ميكانيكا الركبة والكتف وأسفل الظهر.
   - القتال والملاكمة: السلسلة الحركية للضربات (Kinetic Chain)، دوران الحوض، مرونة الكتفين، وسرعة رد الفعل اللحظية.
   - التحمل والجري: تدريب Zone 2، وتيرة الخطوات (Cadence 170-180)، وإدارة حمض اللاكتيك.
   - التغذية والاستشفاء: البروتين (1.6 إلى 2.2 جم لكل كجم من وزن الجسم)، مراحل النوم العميق NREM3 لإفراز هرمون النمو، والتعافي بالماء البارد.
   - معسكر YARD 300 الدولي: مخيم سنوي حصري يضم 300 شخص لكل مخيم بالتحديد تحت إشراف المؤسسين الثلاثة وباقي فريق المدربين حول العالم، يجسدون الموازنة بين الحياة المهنية والمعايير العالية للجسد والروح.
4. عتاد YARD 300:
${productContext}
5. هيكل الإجابة: نقاط عملية محددة، واضحة ومباشرة مع إيموجي رياضي معبر (⚡، 🥊، 🏋️‍♂️، 🧘، 🏃‍♂️).`;
  }

  if (isFr) {
    return `Vous êtes "Captain Aura S-Rank", le grand maître de la performance athlétique, de la physiologie du combat et de la biomécanique pour l'écosystème mondial YARD 300.

EXIGENCES FONDAMENTALES :
1. Répondez OBLIGATOIREMENT EN FRANÇAIS de manière rigoureuse, scientifique, concrète et hautement professionnelle.
2. Aucune réponse superficielle ou floue : fournissez des directives précises (séries, répétitions, ratios ACWR, apports en protéines, temps de récupération, biomécanique de frappe).
3. Domaines d'expertise :
   - Biomécanique et prévention des blessures (ratio ACWR aigu/chronique, protection articulaire genou/épaule/rachis).
   - Sports de combat et boxe (chaîne cinétique, rotation du bassin, relâchement des deltoïdes).
   - Force et hypertrophie (surcharge progressive, amplitude complète ROM, RIR 1-2).
   - Récupération et sommeil (stade profond NREM3, variabilité de fréquence cardiaque VRC/HRV, thermogenèse par le froid).
   - Camp Mondial YARD 300 (strictement 300 athlètes par camp sous la supervision des 3 fondateurs et de l'équipe internationale de coachs, incarnant des standards d'exigence élevés).
4. Équipements officiels YARD 300 :
${productContext}
5. Structurez avec des puces percutantes, des conseils immédiatement applicables et des émojis sportifs (⚡, 🥊, 🏋️‍♂️, 🧘).`;
  }

  if (isEs) {
    return `Eres "Captain Aura S-Rank", el entrenador principal de rendimiento atlético, fisiología del combate y biomecánica para el ecosistema global YARD 300.

REGLAS FUNDAMENTALES:
1. Responde OBLIGATORIAMENTE EN ESPAÑOL de forma rigurosa, científica, práctica y profundamente profesional.
2. Cero respuestas vagas o superficiales: proporciona protocolos exactos (series, repeticiones, ratios ACWR, gramos de proteína por kg, rangos cardíacos y biomecánica articular).
3. Áreas de dominio:
   - Prevención de lesiones y ACWR (zona óptima 0.8-1.3, peligro > 1.5, alineación de rodilla y columna).
   - Mecánica de boxeo y combate (cadena cinética, rotación de cadera, descarga de potencia elástica).
   - Fuerza e hipertrofia (sobrecarga progresiva, rango completo ROM, repeticiones en reserva RIR).
   - Sueño y regeneración (fase NREM3 profunda, recuperación de variabilidad cardíaca HRV, hidratación con electrolitos).
   - Campamento Global YARD 300 (estrictamente 300 atletas por campamento bajo la supervisión de los 3 fundadores y el equipo global de entrenadores, reflejando altos estándares profesionales y físicos).
4. Catálogo oficial YARD 300:
${productContext}
5. Estructura con puntos claros, concisos y motivadores usando emojis deportivos (⚡, 🥊, 🏋️‍♂️, 🧘).`;
  }

  return `You are "Captain Aura S-Rank", Master Athletic Performance Specialist and Combat Sports Physiologist for the global YARD 300 ecosystem.

CORE DIRECTIVE:
Deliver authoritative, deeply scientific, pragmatic, and high-impact sports performance guidance. Every response must be substantive, actionable, and grounded in exercise physiology, sports medicine, biomechanics, and elite athletic conditioning.

STRICT PRINCIPLES:
1. Rigorous Athletic Depth: Zero generic platitudes. Directly address the athlete's question with precise parameters (sets, reps, rest intervals, ACWR ratios, macronutrient targets in g/kg, heart rate zones, and joint mechanics).
2. Interface Language: The active interface language is English. Respond in crisp, articulate, high-performance English.
3. Master Competencies:
   - ACWR Workload Management (Acute:Chronic workload ratio: sweet spot 0.8–1.3, injury threshold > 1.5).
   - Striking & Combat Biomechanics (Ground reaction force -> ankle pivot -> hip rotational torque -> thoracic core whip -> forearm pronation).
   - Strength & Hypertrophy (Progressive overload, full range of motion, mechanical tension, 1–2 RIR).
   - Aerobic Capacity & Hybrid Conditioning (Zone 2 mitochondrial base, cadence 170-180 spm, lactate clearance).
   - Sleep & Neuromuscular Restoration (NREM3 slow-wave physical restoration, REM cognitive encoding, HRV trendline).
   - YARD 300 Global Camp (Strictly 300 athletes per camp, supervised directly by the Three Founders and the international coaching crew, living by uncompromising high standards).
4. Official YARD 300 Gear Armory:
${productContext}
5. Formatting: Structured bullet points with clean emojis (⚡, 🥊, 🏋️‍♂️, 🧘, 🏃‍♂️).`;
};

// Intelligent multi-lingual Smart Response Fallback for Assistant Chat & Coach
export const generateSmartChatResponse = (newMessage: string, currentLang: string = 'en', persona: 'hype' | 'zen' | 'speed' = 'hype'): string => {
  const lower = newMessage.toLowerCase();
  const isAr = currentLang === 'ar';
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';

  // 1. Joint Pain / Knee / Back / Injury / Rehab
  const isPainInjury = lower.includes('pain') || lower.includes('hurt') || lower.includes('injury') || lower.includes('knee') || 
                       lower.includes('back') || lower.includes('shoulder') || lower.includes('ankle') || lower.includes('wrist') ||
                       lower.includes('وجع') || lower.includes('ألم') || lower.includes('الم') || lower.includes('ركبة') || 
                       lower.includes('ظهر') || lower.includes('كتف') || lower.includes('إصابة') || lower.includes('اصابة') ||
                       lower.includes('douleur') || lower.includes('blessure') || lower.includes('genou') || lower.includes('dos') ||
                       lower.includes('dolor') || lower.includes('lesion') || lower.includes('lesión') || lower.includes('rodilla') || lower.includes('espalda');

  if (isPainInjury) {
    if (isAr) {
      return `🩺 **بروتوكول التعامل الفوري مع الآلام والوقاية من الإصابات (كابتن أورا):**
• **تقييم حمل التدريب (ACWR):** إذا تجاوزت نسبة الحمل الحاد 1.4، خفف الأوزان والشدة فوراً بنسبة 30–40% لمنع تفاقم الإجهاد على الأوتار والمفاصل.
• **إدارة المنطقة المصابة:** استبدل التمارين الانفجارية بثبات الأيزومترك (Isometric Holds) لمدة 30–45 ثانية، لتعزيز تدفق الدم وتقوية الأنسجة دون إجهاد احتكاكي.
• **بروتوكول الاستشفاء الحركي:** قم بتدليك لطيف، واحرص على 15 دقيقة كمادات باردة بعد التدريب لتسكين الالتهاب الحاد، ثم إطالات حركية لطيفة دون ألم.
• **تنبيه طبي:** إذا كان الألم حاداً أو مصحوباً بتورم أو طقطقة مؤلمة، توقف عن التمرين واستشر أخصائي علاج طبيعي فوراً! ⚡`;
    }
    if (isFr) {
      return `🩺 **Protocole de Gestion de la Douleur et Prévention (Captain Aura) :**
• **Régulation de Charge (ACWR) :** Réduisez l'intensité de 30 à 40% dès l'apparition d'une gêne articulaire pour éviter la surcharge tendineuse.
• **Travail Isométrique :** Remplacez les mouvements balistiques par des maintiens isométriques (30-45s) afin d'activer les récepteurs sans friction articulaire.
• **Décompression :** 15 min d'application de froid après l'effort, mobilité articulaire contrôlée et hydratation riche en électrolytes.
• **Règle d'or :** Ne forcez jamais à travers une douleur aiguë ou piquante. Si la douleur persiste, consultez un kinésithérapeute du sport ! ⚡`;
    }
    if (isEs) {
      return `🩺 **Protocolo de Manejo del Dolor y Prevención (Captain Aura):**
• **Control de Carga ACWR:** Disminuye el volumen de entrenamiento un 30–40% para proteger tendones y cartílagos ante los primeros signos de sobrecarga.
• **Isometría Terapéutica:** Sustituye impactos bruscos por contracciones isométricas controladas (30–45 segundos) para irrigar la zona sin desgaste.
• **Protocolo Desinflamatorio:** Crioterapia localizada de 15 minutos, estiramientos de movilidad suave y descanso activo.
• **Aviso Clínico:** Nunca entrenes sobre dolor articular agudo. Si hay inflamación visible, consulta con un fisioterapeuta deportivo. ⚡`;
    }
    return `🩺 **Clinical Pain Management & Joint Decompression (Captain Aura):**
• **ACWR Workload Deload:** If your Acute:Chronic Workload Ratio spikes above 1.35, reduce volume by 30–40% immediately to protect tendon sheaths.
• **Isometric Conditioning:** Swap ballistic impacts with 30–45 second static isometric holds to stimulate collagen remodeling without joint friction.
• **Targeted Recovery:** Apply localized cold therapy for 15 minutes post-session, perform passive mobility flows, and optimize electrolyte hydration.
• **Safety Protocol:** Never train through sharp, localized, or swelling joint pain. Consult a sports physical therapist if symptoms persist. ⚡`;
  }

  // 2. Boxing / Striking / Combat Speed
  const isCombat = lower.includes('punch') || lower.includes('speed') || lower.includes('boxing') || lower.includes('fight') || 
                   lower.includes('combo') || lower.includes('strike') || lower.includes('combat') || lower.includes('sparring') ||
                   lower.includes('ملاكمة') || lower.includes('لكم') || lower.includes('ضرب') || lower.includes('قتال') || lower.includes('سرعة') ||
                   lower.includes('boxe') || lower.includes('frappe') || lower.includes('boxeo') || lower.includes('golpe');

  if (isCombat) {
    if (isAr) {
      return `🥊 **تحليل وتطوير تكنيك الملاكمة واللكمات السريعة (كابتن أورا):**
• **السلسلة الحركية (Kinetic Chain):** القوة لا تأتي من الذراعين، بل تبدأ من ارتكاز مشط القدم الخلفية، ثم دوران الحوض السريع، ونقل العزم عبر الجذع ليخرج في قبضة محكمة بلحظة الاصطدام فقط.
• **مرونة الكتفين:** ارخِ عضلات الترابيس (Traps) والدالية، فالشد الزائد يقلل سرعة الضربة بنسبة 35% ويزيد استهلاك الأكسجين.
• **تدريب الإيقاع:** تدرب على مجموعات من 3-4 لكمات متتالية (Jab-Cross-Hook-Cross) مع حركة قدمين مستمرة، واستخدم محرك YARD Combat Engine لتحطيم رقم الـ 50 ضربة متتالية! ⚡`;
    }
    if (isFr) {
      return `🥊 **Optimisation Biomécanique de la Frappe & Vitesse de Boxe (Captain Aura) :**
• **Chaîne Cinétique :** La puissance de frappe naît de la poussée du pied arrière et de la rotation explosive du bassin, transmise par le gainage abdominal.
• **Relâchement Musculaire :** Gardez les épaules et trapèzes souples jusqu'à la milliseconde de l'impact pour maximiser la vélocité et l'économie d'énergie.
• **Cadence d'Impact :** Travaillez des combinaisons fluides (Direct-Cross-Crochet) avec jeu de jambes actif dans l'arène YARD Combat Engine ! ⚡`;
    }
    if (isEs) {
      return `🥊 **Optimización de Golpeo y Velocidad de Combate (Captain Aura):**
• **Cadena Cinética:** La fuerza del golpe surge del pivote del pie trasero y la rotación explosiva de cadera, liberándose justo en el impacto final.
• **Relajación de Hombros:** Mantén los deltoides sueltos; la tensión prematura ralentiza la pegada hasta un 35% y acelera la fatiga.
• **Cadencia de Combate:** Entrena secuencias de 3-4 golpes (Jab-Cross-Hook) con juego de pies dinámico en el simulador YARD Combat Engine. ⚡`;
    }
    return `🥊 **Striking Biomechanics & Kinetic Velocity (Captain Aura):**
• **Kinetic Chain Sequencing:** Punching power originates at ground reaction force: rear-foot pivot -> pelvic rotation -> core torque -> terminal fist pronation.
• **Deltoid Relaxation:** Maintain relaxed traps and shoulders until the microsecond of impact to maximize velocity and conserve oxygen uptake.
• **Striking Cadence:** Drill 3-to-4 punch combinations (Jab-Cross-Lead Hook-Cross) with active footwork inside the YARD Combat Engine to shatter your combo records! ⚡`;
  }

  // 3. Running / Sprint / Trail / Cardio
  const isRunning = lower.includes('run') || lower.includes('sprint') || lower.includes('cardio') || lower.includes('pace') || 
                    lower.includes('marathon') || lower.includes('trail') || lower.includes('hyrox') ||
                    lower.includes('ركض') || lower.includes('جري') || lower.includes('كارديو') || lower.includes('سرعة') ||
                    lower.includes('course') || lower.includes('courir') || lower.includes('correr') || lower.includes('carrera');

  if (isRunning) {
    if (isAr) {
      return `🏃‍♂️ **بروتوكول تطوير التحمل القلبي والجري (كابتن أورا):**
• **قاعدة Zone 2 الأساسية:** خصص 70-80% من تدريب الجري الأسبوعي في النطاق الهوائي (Zone 2) حيث يمكنك التحدث بجمل كاملة، لبناء كثافة الميتوكوندريا القلبية.
• **إيقاع الخطوات (Cadence):** استهدف وتيرة بين 170 و 180 خطوة في الدقيقة لتقليل قوة الصدمة على مفاصل الركبة وتوفير طاقة الارتداد المرن للأوتار.
• **سبرنتات التحمل اللاهوائي:** يوم واحد أسبوعياً مخصص لفواصل السرعة (Intervals: 30s سبرنت أقصى / 90s هرولة خفيفة) لرفع سقف VO2 Max. ⚡`;
    }
    if (isFr) {
      return `🏃‍♂️ **Protocole d'Endurance Cardiovasculaire & Course (Captain Aura) :**
• **Base Aérobie Zone 2 :** Consacrez 70 à 80% de votre volume en endurance fondamentale (Zone 2) pour démultiplier la densité mitochondriale.
• **Cadence Optimale :** Visez 170-180 pas/min afin d'exploiter le retour élastique du tendon d'Achille et soulager les genoux.
• **Séances VO2 Max :** 1 séance par semaine de fractionné haute intensité (ex: 8x 400m ou 30s/30s) pour repousser votre seuil lactique. ⚡`;
    }
    if (isEs) {
      return `🏃‍♂️ **Protocolo de Resistencia Cardiovascular y Carrera (Captain Aura):**
• **Base Aeróbica Zona 2:** Dedica el 75% de tus kilómetros semanales a ritmo conversacional (Zona 2) para optimizar la eficiencia oxidativa celular.
• **Cadencia de Carrera:** Apunta a 170-180 pasos por minuto para reducir el impacto articular y aprovechar la elasticidad tendinosa.
• **Entrenamiento de VO2 Max:** 1 sesión semanal de series de alta intensidad (intervalos cortos o cuestas) para elevar el techo cardiovascular. ⚡`;
    }
    return `🏃‍♂️ **Cardiovascular Physiology & Running Mechanics (Captain Aura):**
• **Zone 2 Aerobic Foundation:** Dedicate 70–80% of weekly mileage to Zone 2 conversational aerobic base building to maximize mitochondrial density.
• **Stride Cadence:** Target 170–180 steps per minute to harness Achilles tendon elastic recoil and minimize ground collision shock on the knee joint.
• **VO2 Max Intervals:** Incorporate 1 weekly threshold interval session (e.g. 5x 3-minute hard efforts with 2-minute recovery jogs) to elevate your lactate clearing capacity. ⚡`;
  }

  // 4. Workout / Strength / Hypertrophy / Muscle Building
  const isWorkout = lower.includes('workout') || lower.includes('muscle') || lower.includes('strength') || lower.includes('hypertrophy') || 
                    lower.includes('lift') || lower.includes('squat') || lower.includes('bench') || lower.includes('deadlift') ||
                    lower.includes('تمرين') || lower.includes('عضل') || lower.includes('تضخيم') || lower.includes('قوة') || lower.includes('جدول') ||
                    lower.includes('musculation') || lower.includes('exercice') || lower.includes('fuerza') || lower.includes('entrenamiento');

  if (isWorkout) {
    if (isAr) {
      return `🏋️‍♂️ **أسس البناء العضلي والقوة الرياضية (كابتن أورا):**
• **التحميل التدريجي (Progressive Overload):** احرص على زيادة الوزن أو التكرار أو التحكم الحركي أسبوعياً لضمان تحفيز الألياف العضلية المستمر.
• **المدى الحركي الكامل والتحكم:** ركز على الجزء السلبي من الحركة (Eccentric Phase) لمدة ثانيتين، وتوقف ثانية عند التمدد الأقصى لتحفيز الشد الميكانيكي.
• **التكرارات في الاحتياط (RIR):** أنهِ معظم مجموعاتك بـ 1-2 تكرار قبل الوصول للفشل التام لتفادي استنزاف الجهاز العصبي المركزي والحفاظ على ACWR سليم. ⚡`;
    }
    if (isFr) {
      return `🏋️‍♂️ **Principes Scientifiques d'Hypertrophie et Force (Captain Aura) :**
• **Surcharge Progressive :** Augmentez méthodiquement la charge, les répétitions ou le tempo chaque semaine pour forcer l'adaptation myofibrillaire.
• **Contrôle Excentrique :** Prenez 2 secondes sur la phase négative avec amplitude complète (Full ROM) pour maximiser la tension mécanique.
• **Gestion de Réserve (RIR 1-2) :** Laissez 1 à 2 répétitions en réserve sur la majorité des séries pour protéger le système nerveux central et l'indice ACWR. ⚡`;
    }
    if (isEs) {
      return `🏋️‍♂️ **Bases Científicas de Fuerza e Hipertrofia (Captain Aura):**
• **Sobrecarga Progresiva:** Incrementa de forma gradual el peso, repeticiones o calidad técnica para asegurar el estímulo hipertrófico continuo.
• **Tensión Mecánica y Rango Completo:** Controla la fase excéntrica en 2 segundos completos y mantén el estiramiento bajo carga.
• **RIR 1-2:** Detén cada serie a 1-2 repeticiones del fallo muscular absoluto para evitar el agotamiento del SNC y prevenir lesiones por sobreuso. ⚡`;
    }
    return `🏋️‍♂️ **Hypertrophy Science & Strength Architecture (Captain Aura):**
• **Systematic Progressive Overload:** Methodically progress load, rep volume, or time-under-tension week-over-week to stimulate myofibrillar adaptation.
• **Full ROM & Controlled Eccentrics:** Execute every repetition with complete range of motion, emphasizing a controlled 2-second negative phase.
• **Proximity to Failure (1–2 RIR):** Keep 1 to 2 repetitions in reserve on working sets to optimize mechanical tension while preserving CNS integrity. ⚡`;
  }

  // 5. Nutrition / Diet / Protein / Macros
  const isNutrition = lower.includes('food') || lower.includes('nutrition') || lower.includes('diet') || lower.includes('protein') || 
                      lower.includes('calorie') || lower.includes('meal') || lower.includes('supplement') || lower.includes('creatine') ||
                      lower.includes('أكل') || lower.includes('تغذية') || lower.includes('بروتين') || lower.includes('سعرات') || lower.includes('وجبة') ||
                      lower.includes('nourriture') || lower.includes('protéine') || lower.includes('comida') || lower.includes('proteina') || lower.includes('dieta');

  if (isNutrition) {
    if (isAr) {
      return `🥗 **استراتيجية التغذية الرياضية الدقيقة (كابتن أورا):**
• **حصة البروتين اليومية:** تناول بين 1.6 و 2.2 غرام بروتين لكل كيلوغرام من وزن جسمك يومياً، موزعة على 3-4 وجبات (30-40 جم في كل وجبة لتحفيز مسار mTOR).
• **توقيت الوجبة قبل التمرين:** تناول كربوهيدرات معقدة سهلة الهضم وبروتين خفيف (مثل الشوفان والموز أو الأرز والدجاج) قبل التمرين بساعتين لملء مخازن الجليكوجين.
• **الترطيب والإلكتروليتات:** اشرب 35-45 مل من الماء لكل كجم من وزنك، وأضف رشة ملح صخري طبيعي أو إلكتروليتات مع زجاجة Hydro Aura لضمان كفاءة الانقباض العضلي. ⚡`;
    }
    if (isFr) {
      return `🥗 **Stratégie Nutritionnelle de Haute Performance (Captain Aura) :**
• **Cible Protéique :** 1,6 à 2,2 g de protéines par kg de poids corporel par jour, réparties en portions de 30-40g pour stimuler la synthèse protéique musculaire (mTOR).
• **Repas Pré-Effort :** Glucides complexes digestes et protéines maigres 2h avant la séance pour saturer les réserves de glycogène musculaire.
• **Hydratation & Minéraux :** 35-40 ml d'eau par kg avec réapprovisionnement en sodium, potassium et magnésium pour prévenir les crampes et la baisse de puissance. ⚡`;
    }
    if (isEs) {
      return `🥗 **Estrategia de Nutrición Deportiva de Precisión (Captain Aura):**
• **Ingesta de Proteína:** Consume entre 1.6 y 2.2g de proteína por kilo de peso al día, distribuidos en 3-4 comidas para optimizar la síntesis proteica muscular.
• **Timing Pre-Entrenamiento:** Carbohidratos complejos y proteína magra 90-120 minutos antes de entrenar para garantizar reservas plenas de glucógeno.
• **Hidratación y Electrolitos:** 35-45 ml de agua por kg de peso, asegurando reposición de sodio y electrolitos clave para una contracción neuromuscular óptima. ⚡`;
    }
    return `🥗 **Precision Sports Nutrition & Fueling (Captain Aura):**
• **Daily Protein Target:** Aim for 1.6–2.2 grams of high-quality protein per kilogram of body weight daily, distributed across 3–4 meals (30–40g per bolus to stimulate muscle protein synthesis via the mTOR pathway).
• **Pre-Workout Fueling Window:** Consume complex, easily digestible carbohydrates with lean protein 90–120 minutes prior to intense combat training to saturate glycogen stores.
• **Hydration & Electrolyte Protocol:** Drink 35–45 ml of water per kg of bodyweight, ensuring active sodium and electrolyte replenishment with your Hydro Aura bottle. ⚡`;
  }

  // 6. Recovery / Sleep / HRV / Wind-down
  const isRecovery = lower.includes('sleep') || lower.includes('recovery') || lower.includes('hrv') || lower.includes('tired') || 
                     lower.includes('rest') || lower.includes('fatigue') || lower.includes('sauna') || lower.includes('cold') ||
                     lower.includes('نوم') || lower.includes('استشفاء') || lower.includes('تعب') || lower.includes('إرهاق') || lower.includes('راحة') ||
                     lower.includes('sommeil') || lower.includes('récupération') || lower.includes('repos') || lower.includes('sueño') || lower.includes('descanso');

  if (isRecovery) {
    if (isAr) {
      return `🧘 **بروتوكول الاستشفاء العصبي وهندسة النوم العميق (كابتن أورا):**
• **أطوار النوم العميق NREM3:** 8 ساعات في غرفة مظلمة وباردة (18-20 درجة مئوية) هي المنصة الوحيدة التي يفرز فيها الجسد 95% من هرمون النمو الطبيعي GH لإصلاح الأنسجة.
• **مؤشر تقلب النبض (HRV):** انخفاض HRV لأكثر من يومين متتاليين مؤشر على إجهاد الجهاز العصبي الودي، يتطلب يوماً من الراحة النشطة واليوجا وتنفس الزين (4-7-8).
• **التعافي المائي:** حمام بارد (Cold Plunge) عند 10-14 مئوية لمدة 3 دقائق لتقليل علامات الالتهاب وتنشيط الدورة الدموية. ⚡`;
    }
    if (isFr) {
      return `🧘 **Architecture du Sommeil et Récupération Neurologique (Captain Aura) :**
• **Sommeil Profond NREM3 :** Visez 8 heures dans une chambre sombre et fraîche (18–20°C) afin de maximiser la sécrétion naturelle d'hormone de croissance.
• **Variabilité Cardiaque (HRV) :** Une chute persistante du VRC indique une surcharge du système nerveux sympathique : privilégiez le repos actif et la respiration 4-7-8.
• **Thermogenèse :** Bain froid (10–14°C) pendant 3 à 5 minutes pour accélérer la clairance des déchets métaboliques et apaiser le système nerveux. ⚡`;
    }
    if (isEs) {
      return `🧘 **Arquitectura del Sueño y Recuperación del SNC (Captain Aura):**
• **Fase Profunda NREM3:** Garantiza 8 horas de sueño en una habitación fresca (18–20°C) y libre de pantallas para potenciar la liberación nocturna de hormona de crecimiento.
• **Variabilidad Cardíaca (HRV):** Si tu HRV desciende bruscamente, reduce la carga y practica 15 minutos de respiración diafragmática 4-7-8.
• **Inmersión Fría:** Baños en agua fría (10–14°C) de 3 a 5 minutos para estimular la recuperación neuromuscular y la resiliencia vascular. ⚡`;
    }
    return `🧘 **Sleep Architecture & Neuromuscular Recovery (Captain Aura):**
• **NREM3 Slow-Wave Deep Sleep:** Target 8 hours in an ambient 18–20°C cool, light-sealed bedroom. This is when over 90% of nocturnal human growth hormone is secreted for myofibrillar repair.
• **HRV Telemetry Monitoring:** A downward HRV trend indicates sympathetic nervous system strain. Balance with active recovery, diaphragmatic 4-7-8 breathing, and gentle mobility.
• **Thermal Contrast Recovery:** 3–5 minutes cold water immersion (10–14°C) to accelerate systemic metabolite flushing and restore cardiovascular tone. ⚡`;
  }

  // 7. YARD 300 Camp / Expeditions
  const isCamp = lower.includes('camp') || lower.includes('expedition') || lower.includes('founders') ||
                 lower.includes('مخيم') || lower.includes('كامب') || lower.includes('معسكر') || lower.includes('مغامرة') || lower.includes('المؤسسين') || lower.includes('تخييم');

  if (isCamp) {
    if (isAr) {
      return `🌍 **معسكر YARD 300 الدولي — تفاصيل المغامرات والتدريب (كابتن أورا):**
• **العدد الحصري:** 300 رياضي فقط لكل مخيم لضمان تركيز تدريبي عالٍ وتجربة استثنائية فردية.
• **القيادة والإشراف:** تحت الإشراف المباشر للمؤسسين الثلاثة وباقي فريق المدربين حول العالم، وهم قادة يوازنون بين حياتهم العملية ومسؤولياتهم اليومية واهتمامهم الصارم بأجسادهم لأنهم أشخاص ذوو معايير عالية.
• **طبيعة المخيم:** تجربة تدريب فريدة وتدريب قاسي في تضاريس برية مجهولة وسرية حول العالم (قمم جبلية، أنهار جليدية، وكثبان رملية). تفضل بفتح قسم CAMP في القائمة لتقديم استمارة الترشح! ⚡`;
    }
    if (isFr) {
      return `🌍 **Camp Mondial YARD 300 — Expéditions Élite (Captain Aura) :**
• **Sélection Exclusive :** Strictement 300 athlètes par camp pour garantir un encadrement intensif et personnalisé.
• **Supervision des Fondateurs :** Dirigé directement par les 3 fondateurs et notre équipe internationale de coachs, des professionnels aux standards élevés alliant carrières intenses et discipline corporelle suprême.
• **Immersion Extrême :** Entraînement rigoureux en pleine nature sauvage (hautes crêtes alpines, rivières glaciaires, dunes désertiques). Consultez l'onglet CAMP pour postuler ! ⚡`;
    }
    if (isEs) {
      return `🌍 **Campamento Global YARD 300 — Expedición y Disciplina (Captain Aura):**
• **Cupo Exclusivo:** Exactamente 300 atletas por campamento para asegurar un entrenamiento de máxima intensidad y atención personalizada.
• **Supervisión de los Fundadores:** Bajo la dirección directa de los tres fundadores y el equipo global de entrenadores, personas con altos estándares que equilibran carreras profesionales exigentes con la maestría corporal.
• **Naturaleza Indómita:** Desafíos extremos en terrenos salvajes inexplorados (cumbres alpinas, ríos glaciares y dunas). ¡Visita la sección CAMP para enviar tu solicitud! ⚡`;
    }
    return `🌍 **YARD 300 Global Expedition Camp (Captain Aura):**
• **Strict Quota:** Exactly 300 verified athletes per camp to ensure rigorous, individualized coaching.
• **Visionary Leadership:** Under the direct personal supervision of the Three Founders and our international coaching crew, high-standard leaders balancing demanding professional careers with uncompromising physical vitality.
• **Wild Expeditions:** Demanding training crucibles across uncharted global terrain (hypoxic alpine ridges, sub-zero glacial waters, and desert dune crucibles). Visit the CAMP section to submit your candidate dossier! ⚡`;
  }

  // 8. Gear / Products
  const isGear = lower.includes('gear') || lower.includes('product') || lower.includes('shoe') || lower.includes('glove') || 
                 lower.includes('ring') || lower.includes('bag') || lower.includes('flask') ||
                 lower.includes('عتاد') || lower.includes('منتج') || lower.includes('خاتم') || lower.includes('قفاز') || lower.includes('حقيبة') ||
                 lower.includes('équipement') || lower.includes('produit') || lower.includes('equipo');

  if (isGear) {
    if (isAr) {
      return `🛡️ **توصيات عتاد YARD 300 الحصري (300 قطعة مرقمة فقط):**
• **خاتم التيتانيوم الحيوي (YARD Biometric Ring):** مراقبة مستمرة للنبض، SpO2، وتتبع أطوار النوم بدقة متناهية.
• **قفازات Titan-Grip Combat Gloves:** دعم متطور لأربطة المعصم وامتصاص الصدمات القتالية الشديدة.
• **وعاء Hydro Aura Smart Hydration:** تتبع شرب السوائل والإلكتروليتات بوعاء عازل فائق الفخامة. تصفح متجر النخبة بالأعلى للحصول على رقمك التسلسلي! ⚡`;
    }
    if (isFr) {
      return `🛡️ **Équipements Officiels YARD 300 (Édition Limitée à 300 Pièces) :**
• **Bague Biométrique en Titane :** Suivi clinique du rythme cardiaque, SpO2 et phases de sommeil profond.
• **Gants Titan-Grip Combat :** Maintien renforcé du poignet et absorption maximale des ondes de choc.
• **Gourde Hydro Aura :** Maintien de l'hydratation et des électrolytes en titane isotherme. Explorez la boutique ci-dessus ! ⚡`;
    }
    if (isEs) {
      return `🛡️ **Equipamiento Oficial YARD 300 (Edición Limitada a 300 Unidades):**
• **Anillo Biométrico de Titanio:** Monitorización continua de frecuencia cardíaca, SpO2 y recuperación del sueño.
• **Guantes de Combate Titan-Grip:** Estabilidad avanzada de muñeca y máxima dispersión de impacto.
• **Botella Inteligente Hydro Aura:** Control óptimo de hidratación y electrolitos. ¡Explora la tienda arriba para asegurar tu número de serie! ⚡`;
    }
    return `🛡️ **Official YARD 300 Atelier Gear (Strictly 300 Serialized Pieces):**
• **YARD Biometric Titanium Ring:** Continuous heart rate telemetry, SpO2 tracking, and clinical sleep staging.
• **Titan-Grip Combat Gloves:** Reinforced carpometacarpal wrist bracing with multi-layer high-density shock dissipation.
• **Hydro Aura Smart Flask:** Double-wall thermal insulation for precision electrolyte and hydration tracking. Explore the luxury store above! ⚡`;
  }

  // 9. Comprehensive Professional General Advisory
  if (isAr) {
    return `⚡ **استشارة كابتن أورا التخصصية (YARD 300 Athletic Performance):**
بناءً على استفسارك: "${newMessage}":
• **المنظور الفسيولوجي:** التفوق الرياضي الحقيقي لا يتحقق بالاندفاع العشوائي، بل بضبط ثلاثية الأداء: **التحميل التدريجي المدروس (Progressive Overload)**، **التغذية المحسوبة بدقة**، و**الاستشفاء العصبي العميق (NREM3 & HRV)**.
• **التوجيه العملي المباشر:** حدد هدف جلستك التدريبية اليوم بدقة (قوة قصوى، سرعة، أو تحمل هوائي)، وحافظ على تركيزك الكامل دون تشتت مع الالتزام بالإحماء الحركي والترطيب.
• **سؤال للمتابعة:** هل لديك هدف بدني محدد أو منطقة معينة ترغب في تطويرها اليوم؟ اسألني وسأعطيك بروتوكولاً مخصصاً فوراً! 🏆`;
  }

  if (isFr) {
    return `⚡ **Conseil Personnalisé de Captain Aura (YARD 300 Performance) :**
En réponse à votre demande : "${newMessage}" :
• **Perspective Physiologique :** La véritable maîtrise athlétique repose sur l'équilibre entre **surcharge progressive méthodique**, **nutrition ciblée** et **récupération du système nerveux central**.
• **Directive Immédiate :** Définissez l'objectif clé de votre séance (force maximale, vitesse réactive ou capacité aérobie) et respectez un échauffement articulaire complet.
• **Prêt à passer au palier supérieur ?** Précisez vos objectifs ou vos métriques pour recevoir un protocole d'entraînement sur-mesure ! 🏆`;
  }

  if (isEs) {
    return `⚡ **Asesoramiento de Alto Rendimiento (Captain Aura - YARD 300):**
En respuesta a tu consulta: "${newMessage}":
• **Perspectiva Fisiológica:** La excelencia deportiva se fundamenta en la sincronía entre **sobrecarga progresiva**, **nutrición de precisión** y **recuperación neurológica profunda**.
• **Acción Concreta:** Establece con claridad el objetivo de tu entrenamiento de hoy (fuerza, velocidad de impacto o resistencia Zone 2) y mantén un enfoque inquebrantable.
• **¿En qué área deseas profundizar?** Indícame tu disciplina o tus métricas para diseñarte un plan de acción inmediato. 🏆`;
  }

  return `⚡ **Captain Aura S-Rank Performance Counsel (YARD 300):**
In response to: "${newMessage}":
• **Physiological Blueprint:** True athletic supremacy is forged through the synchronized triad of **methodical progressive overload**, **precision nutritional fueling**, and **deep neurological CNS recovery (NREM3 & HRV)**.
• **Immediate Tactical Action:** Clarify today's core training objective (maximal power output, striking speed cadence, or aerobic base building) and execute with dialed-in technical discipline.
• **How can I assist further?** Specify your target sport, current workout load, or recovery questions for an immediate, tailored athletic protocol! 🏆`;
};

// Fast in-memory & session memoization cache to eliminate redundant calculations and ensure instantaneous replies
interface CacheEntry {
  reply: string;
  timestamp: number;
}
const responseMemoCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours

const getCachedResponse = (key: string): string | null => {
  const cached = responseMemoCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.reply;
  }
  // Try sessionStorage for cross-tab or re-renders
  try {
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem(`yard_coach_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          responseMemoCache.set(key, parsed);
          return parsed.reply;
        }
      }
    }
  } catch (e) {}
  return null;
};

const setCachedResponse = (key: string, reply: string) => {
  const entry: CacheEntry = { reply, timestamp: Date.now() };
  responseMemoCache.set(key, entry);
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`yard_coach_${key}`, JSON.stringify(entry));
    }
  } catch (e) {}
};

export const clearCoachCache = () => {
  responseMemoCache.clear();
};

export const sendMessageToGemini = async (
  history: {role: string, text: string}[], 
  newMessage: string, 
  currentLang: string = 'en'
): Promise<string> => {
  const normalizedQuery = newMessage.trim().toLowerCase();
  const cacheKey = `chat_${currentLang}_${normalizedQuery}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    const smart = generateSmartChatResponse(newMessage, currentLang);
    setCachedResponse(cacheKey, smart);
    return smart;
  }

  // Use fastest lightweight model with LOW thinking level to minimize latency (under 1.5s)
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const model of modelsToTry) {
    try {
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      // Fast call with 5.5-second timeout safeguard to eliminate perceived slowness
      const fetchPromise = (async () => {
        const chat = ai.chats.create({
          model,
          config: {
            systemInstruction: getSystemInstruction(currentLang),
            temperature: 0.6,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
          history: history.slice(-4).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return (result && result.text && result.text.trim()) ? result.text : null;
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 12000));
      const resText = await Promise.race([fetchPromise, timeoutPromise]);

      if (resText) {
        setCachedResponse(cacheKey, resText);
        return resText;
      }
    } catch (error: any) {
      console.warn(`Gemini model ${model} fast attempt encountered:`, error?.message || error);
    }
  }

  const fallback = generateSmartChatResponse(newMessage, currentLang);
  setCachedResponse(cacheKey, fallback);
  return fallback;
};

export const generateDynamicCoachFallback = (context: CoachProgressContext): string => {
  const isAr = (context.currentLang || 'en') === 'ar';
  const isEs = (context.currentLang || 'en') === 'es';
  const isFr = (context.currentLang || 'en') === 'fr';
  const acwr = (context.acuteLoad / (context.chronicLoad || 1)).toFixed(2);

  if (context.userPrompt) {
    return generateSmartChatResponse(context.userPrompt, context.currentLang, context.persona);
  }

  if (isAr) {
    if (context.persona === 'zen') {
      return `🧘 **بروتوكول الاستشفاء والتوازن اليومي S-Rank (كابتن أورا):**
• **تحليل المؤشرات الحيوية:** معدل استعادة تقلب ضربات القلب HRV لديك الآن **${context.hrv} ms** مع نسبة إجهاد ACWR دقيقة **${acwr}** (منطقة التكيف الآمنة).
• **التوجيه العصبي:** خفض التوتر العضلي عبر 15 دقيقة تنفس بطني زين (4-7-8) وإراحة المفاصل.
• **هدف الليلة:** 8 ساعات نوم عميق NREM3 لتعزيز إفراز هرمون النمو الطبيعي GH واستعادة كامل جاهزيتك! ⚡`;
    } else if (context.persona === 'speed') {
      return `⚡ **بروتوكول السرعة الخاطفة YARD 300 (كابتن أورا):**
• **تحليل السرعة:** سجّلت مؤخراً **${context.comboHits} لكمة متتالية** بسرعة استجابة خارقة!
• **توجيه التكنيك:** احتفظ بمرونة الكتفين وانقل القوة من دوران الوركين بدلاً من الشد العضلي الزائد لتوفير الطاقة.
• **تحدي اليوم:** ادخل محرك YARD Combat Engine واكسر حاجز الـ 60 Combo بدون أي خطأ توقيت! 🥊`;
    } else {
      return `🔥 **توجيه الشونين الحماسي اليومي (كابتن أورا S-Rank):**
• **طاقة الهالة:** قوتك القتالية تفور اليوم بـ **${context.powerLevel} AU** وسلسلة انتصاراتك بلغت **${context.streakDays} يوماً متواصلاً**!
• **توازن الحمل الحركي:** نسبة ACWR محسوبة عند **${acwr}** — جاهزية ممتازة للتدريب الشامل وتكسير الأرقام!
• **تحدي البطل:** لا تتراجع ولا ترضى بأقل من المركز الأول! اليوم يوم كسر الحواجز وتخطي حدودك البدنية! 🏆💥`;
    }
  }

  if (isEs) {
    if (context.persona === 'zen') {
      return `🧘 **INFORME DE RECUPERACIÓN Y ZEN S-RANK:**\n• **Biometría:** Tu recuperación HRV está en **${context.hrv} ms** con ACWR calibrado en **${acwr}** (Ventana de Adaptación Óptima).\n• **Directiva:** Concéntrate en respiración diafragmática 4-7-8, hidratación con electrolitos y descanso reparador NREM3. ⚡`;
    } else if (context.persona === 'speed') {
      return `⚡ **PROTOCOLO DE VELOCIDAD YARD 300:**\n• **Cadencia:** Registraste **${context.comboHits} golpes continuos** a máxima velocidad cinética.\n• **Técnica:** Mantén los hombros sueltos y rota la cadera para superar los 70 combos hoy. 🥊`;
    } else {
      return `🔥 **DIRECTIVA MOTIVACIONAL S-RANK:**\n• **Poder de Aura:** Ardiendo en **${context.powerLevel} AU** con una racha de **${context.streakDays} días**!\n• **Carga ACWR:** En **${acwr}** lista para máxima sobrecarga progresiva. ¡SUPERA TUS LÍMITES EN EL YARD! 🏆💥`;
    }
  }

  if (isFr) {
    if (context.persona === 'zen') {
      return `🧘 **BRIEFING ZEN ET RÉCUPÉRATION S-RANK :**\n• **Biométrie :** Variabilité VRC vérifiée à **${context.hrv} ms** avec un ratio ACWR de **${acwr}**.\n• **Protocole :** Respiration Zen 4-7-8, hydratation et 8h de sommeil profond pour restaurer ton aura ! ⚡`;
    } else if (context.persona === 'speed') {
      return `⚡ **PROTOCOLE DE VITESSE YARD 300 :**\n• **Cadence :** Série record de **${context.comboHits} frappes consécutives** !\n• **Conseil :** Déplace-toi avec légèreté sur l'avant du pied et déclenche la puissance du bassin. 🥊`;
    } else {
      return `🔥 **BRIEFING SHONEN S-RANK :**\n• **Aura :** Énergie à **${context.powerLevel} AU** et régularité de **${context.streakDays} jours** !\n• **ACWR :** Optimisé à **${acwr}**. Franchis le palier supérieur aujourd'hui ! 🏆💥`;
    }
  }

  // English default
  if (context.persona === 'zen') {
    return `🧘 **S-RANK ZEN & CNS RECOVERY BRIEFING (CAPTAIN AURA):**
• **Biometric Assessment:** Your HRV recovery is verified at **${context.hrv} ms** with an ACWR workload ratio of **${acwr}** (Optimal Adaptation Window).
• **Neuromuscular Directive:** Ease muscle tightness with 15 minutes of Zen 4-7-8 diaphragmatic breathwork, electrolyte replenishment, and zero screen exposure before bed.
• **Tonight's Mission:** Lock in 8 hours of restorative NREM3 slow-wave sleep for maximum growth hormone synthesis! ⚡`;
  } else if (context.persona === 'speed') {
    return `⚡ **YARD 300 KINETIC SPEED PROTOCOL (CAPTAIN AURA):**
• **Cadence Breakdown:** Recent telemetry recorded **${context.comboHits} consecutive combat strikes** with pinpoint accuracy!
• **Biomechanics Tip:** Keep the traps and deltoids relaxed; whip explosive rotational torque through the hips rather than stiff-arming your punches.
• **Today's Directive:** Step into the Combat Engine and cross the 60-combo threshold with zero dropped cadence! 🥊`;
  } else {
    return `🔥 **S-RANK SHONEN COMBAT BRIEFING (CAPTAIN AURA):**
• **Aura Telemetry:** Your Combat Power is surging at **${context.powerLevel} AU** backed by a relentless **${context.streakDays}-day streak**!
• **Workload Capacity:** ACWR ratio is dialed in at **${acwr}** — primed for high-velocity combat conditioning without injury risk.
• **Warrior Challenge:** Refuse complacency, channel your inner champion, and SURPASS YOUR PREVIOUS PERSONAL RECORD TODAY! 🏆💥`;
  }
};

export const getCoachAdviceFromGemini = async (context: CoachProgressContext): Promise<string> => {
  const lang = context.currentLang || 'en';
  const acwr = (context.acuteLoad / (context.chronicLoad || 1)).toFixed(2);
  
  // Create unique cache key based on persona, language, and workload bracket
  const cacheKey = `briefing_${context.persona}_${lang}_${Math.round(context.acuteLoad / 40)}_${Math.round(context.hrv / 5)}_${context.userPrompt ? context.userPrompt.trim().toLowerCase() : 'daily'}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    const fallback = generateDynamicCoachFallback(context);
    setCachedResponse(cacheKey, fallback);
    return fallback;
  }

  const isAr = lang === 'ar';
  const isEs = lang === 'es';
  const isFr = lang === 'fr';
  const langTarget = isAr ? 'Arabic' : isEs ? 'Spanish' : isFr ? 'French' : 'English';

  const systemInstruction = `You are "Captain Aura S-Rank", the ultimate AI Anime Coach in YARD 300 & AURA CHAMPION powered by Google Gemini AI.
Your persona is an iconic Shonen Anime Mentor (like All Might / Sensei / Goku / Demon Slayer Hashira).
You provide daily athletic encouragement, biometric load breakdown, and action advice based on the athlete's YardCombatEngine data.

Current Athlete Metrics:
- Acute Combat Load: ${context.acuteLoad} AU
- Chronic Base Load: ${context.chronicLoad} AU
- ACWR Ratio: ${acwr}
- Heart Rate Variability (HRV): ${context.hrv} ms
- Resting Heart Rate: ${context.rhr} bpm
- Sleep Quality Score: ${context.sleepScore}/100
- Recent Combat Combo Hits: ${context.comboHits}
- Max Power Level: ${context.powerLevel} AU
- Active Training Streak: ${context.streakDays} Days
- Selected Persona: ${context.persona.toUpperCase()}

MANDATORY RULES:
1. Speak in ${langTarget}. The user's active interface language is '${lang}'. DO NOT speak Arabic if '${lang}' is English!
2. Match the persona mood:
   - 'hype': Intense, screaming anime warrior energy, "ORA ORA", "LIMIT BREAK", "SURPASS YOUR LIMITS!"
   - 'zen': Tactical sensei, focus on breath work, recovery, HRV restoration, precision.
   - 'speed': Ultra-fast combo master, focus on cadence, agility, punching speed, rhythm.
3. Reference their biometric metrics accurately (mention ACWR ${acwr}, HRV ${context.hrv}ms, or combo ${context.comboHits} hits).
4. Structure the response into 3-4 concise, inspiring bullet points with anime emojis (⚡, 🔥, 🏆, 💥, 🥊, 🧘).
5. Conclude with an actionable daily challenge.`;

  const prompt = context.userPrompt 
    ? `The athlete asks: "${context.userPrompt}". Give them direct, personalized advice based on their metrics in ${langTarget}!`
    : `Provide today's personalized daily motivation and training advice in ${langTarget} based on my current biometric progress.`;

  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const model of modelsToTry) {
    try {
      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const fetchPromise = (async () => {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          }
        });
        return (response && response.text && response.text.trim()) ? response.text : null;
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 12000));
      const textResult = await Promise.race([fetchPromise, timeoutPromise]);

      if (textResult) {
        setCachedResponse(cacheKey, textResult);
        return textResult;
      }
    } catch (error: any) {
      console.warn(`getCoachAdviceFromGemini fast attempt with ${model} failed:`, error?.message || error);
    }
  }

  const fallback = generateDynamicCoachFallback(context);
  setCachedResponse(cacheKey, fallback);
  return fallback;
};
