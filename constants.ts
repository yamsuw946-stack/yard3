/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle } from './types';

export const HERO_IMAGE = '/images/hero_banderas_muscular.jpg';
export const YARD_COMMUNITY_TRIO_IMAGE = '/images/yard_community_trio.jpg';
export const SHAOLIN_MONASTERY_IMAGE = '/images/shaolin_mountain_monastery.jpg';
export const REALISTIC_ANIME_STRIKER_IMAGE = '/images/ai_human_striker_male.jpg';
export const REALISTIC_VALKYRIE_IMAGE = '/images/ai_human_valkyrie_female.jpg';
export const REALISTIC_MMA_BRAWLER_IMAGE = '/images/ai_human_heavyweight_boxer.jpg';
export const REALISTIC_TACTICAL_SHINOBI_IMAGE = '/images/ai_human_tactical_male.jpg';
export const REALISTIC_VALKYRIE_APEX_IMAGE = '/images/ai_human_female_runner.jpg';
export const REALISTIC_FLAME_STRIKER_IMAGE = '/images/ai_human_aerial_male.jpg';
export const ABOUT_SQUAD_IMAGE = '/images/ai_human_arena_duo.jpg';
export const LIVE_ARENA_IMAGE = '/images/athlete_brazilian_bjj.jpg';
export const VALKYRIE_NEON_IMAGE = '/images/athlete_canadian_cyclist.jpg';
export const TARIK_SAIYAN_IMAGE = '/images/ai_human_gulf_champion.jpg';
export const REN_FLAME_IMAGE = '/images/athlete_nordic_runner.jpg';
export const TITAN_BRAWLER_IMAGE = '/images/athlete_german_rower.jpg';
export const CYBER_SHINOBI_IMAGE = '/images/athlete_moroccan_marathoner.jpg';
export const SAMURAI_RONIN_IMAGE = '/images/athlete_australian_triathlete.jpg';
export const CYBER_SAMURAI_UNIQUE_IMAGE = '/images/athlete_italian_muaythai.jpg';
export const CYBER_RONIN_BLADE_IMAGE = '/images/athlete_korean_calisthenics.jpg';
export const NINJA_KUNOICHI_IMAGE = '/images/athlete_japanese_judoka.jpg';
export const BOXING_STRIKER_IMAGE = '/images/athlete_nigerian_sprinter.jpg';
export const BOXING_VALKYRIE_IMAGE = '/images/athlete_french_fencer.jpg';
export const AI_COACH_IMAGE = '/images/ai_human_performance_coach.jpg';
export const CHALLENGER_IMAGE = '/images/athlete_mexican_boxer.jpg';
export const JOURNAL_RECOVERY_IMAGE = '/images/recovery_journal_lab.jpg';
export const JOURNAL_MINDSET_IMAGE = '/images/athlete_mindset_track.jpg';
export const JOURNAL_GEAR_IMAGE = '/images/journal_gear_tech.jpg';
export const YARD_ARCH_BOARD_IMAGE = '/images/yard_arch_board.jpg';
export const YARD_BAZARUTO_RESORT_IMAGE = '/images/yard_arch_board.jpg';
export const YARD_BAZARUTO_VILLA_IMAGE = '/images/yard_bazaruto_villa.jpg';
export const YARD_BAZARUTO_VILLA_BEDROOM_IMAGE = '/images/yard_villa_bedroom.jpg';
export const YARD_BAZARUTO_VILLA_LIVING_IMAGE = '/images/yard_villa_living.jpg';
export const YARD_BAZARUTO_VILLA_BATHROOM_IMAGE = '/images/yard_villa_bathroom.jpg';
export const YARD_BAZARUTO_VILLA_DINING_IMAGE = '/images/yard_villa_dining.jpg';
export const YARD_BAZARUTO_ENTERTAINMENT_MALL_IMAGE = '/images/yard_mall_pavilion.jpg';
export const YARD_ISLAND_AERIAL_NIGHT_IMAGE = '/images/yard_aerial_master_v2.jpg';
export const YARD_SPORTS_HOSPITAL_IMAGE = '/images/yard_sports_hospital.jpg';
export const YARD_ROOFTOP_VIEW_IMAGE = '/images/yard_rooftop_view_v2.jpg';
export const YARD_MARINA_HELIPAD_IMAGE = '/images/yard_marina_helipad.jpg';

// Live Tournaments, Community Founders & Hero Showcase
export const YARD300_BRAND_LOGO = '/images/yard_official_logo.jpg';
export const YARD_SHARP_BW_SHIELD_LOGO = '/images/yard_official_logo.jpg';
export const AURA_EMBLEM_LOGO = '/images/yard_official_logo.jpg';
export const YARD_BRAND_HERO_BANNER = '/images/ai_human_arena_duo.jpg';
export const YARD_SHIRT_IMAGE = '/images/yard_tee_black_anime.jpg';
export const YARD_SHORTS_IMAGE = '/images/yard_shorts_black_anime.jpg';
export const YARD_WRAPS_IMAGE = '/images/yard_wraps_mockup.jpg';
export const LIVE_ARENA_CHALLENGES_IMAGE = '/images/athlete_british_pentathlete.jpg';
export const ANIME_HERO_ROSTER_IMAGE = '/images/athlete_turkish_weightlifter.jpg';
export const FOUNDER_YAM_SUW_IMAGE = '/images/yam_suw_athlete.jpg';
export const FOUNDER_MTK_IMAGE = '/images/mtk_pilates_anime.jpg';
export const FOUNDER_ARB_IMAGE = '/images/arb_athlete.jpg';

export const ANIME_FIGHTER_RYU_IMAGE = '/images/ai_human_striker_male.jpg';
export const ANIME_FIGHTER_REN_IMAGE = '/images/athlete_indian_wrestler.jpg';
export const ANIME_FIGHTER_KIRA_IMAGE = '/images/ai_human_valkyrie_female.jpg';
export const ANIME_FIGHTER_RYU_IMPACT_IMAGE = '/images/athlete_mexican_boxer.jpg';
export const ANIME_FIGHTER_REN_IMPACT_IMAGE = '/images/athlete_italian_muaythai.jpg';
export const ANIME_FIGHTER_KIRA_IMPACT_IMAGE = '/images/athlete_french_fencer.jpg';

// 1-Second Cinematic Combat Videos for Ryu, Ren & Kira
export const RYU_COMBAT_VIDEO = '/videos/ryu_combat_move.mp4';
export const REN_COMBAT_VIDEO = '/videos/ren_combat_move.mp4';
export const KIRA_COMBAT_VIDEO = '/videos/kira_combat_move.mp4';

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.currentTarget;
  const originalSrc = img.src || '';
  const fileName = originalSrc.split('/').pop()?.split('?')[0] || '';
  
  if (!img.dataset.failCount) {
    img.dataset.failCount = '1';
    img.src = '/images/' + fileName;
  } else if (img.dataset.failCount === '1') {
    img.dataset.failCount = '2';
    img.src = HERO_IMAGE;
  }
};

export const standardDualColors = (isAr: boolean) => [
  { 
    id: 'black', 
    nameEn: 'Obsidian Black (Men’s Edition)', 
    nameAr: 'الأسود الليلي (إصدار رجالي)', 
    hex: '#0D0E12', 
    textColor: '#FFFFFF',
    typeNoteEn: 'Men’s High-Torque Combat Fit',
    typeNoteAr: 'إصدار رجالي معتمد باللون الأسود'
  },
  { 
    id: 'white', 
    nameEn: 'Pearl White (Women’s Edition)', 
    nameAr: 'الأبيض اللؤلؤي (إصدار نسائي)', 
    hex: '#F8F9FA', 
    textColor: '#000000',
    typeNoteEn: 'Women’s Ergonomic Sculpt Fit',
    typeNoteAr: 'إصدار نسائي معتمد باللون الأبيض'
  }
];

export const deodorantDualColors = (isAr: boolean) => [
  { 
    id: 'black', 
    nameEn: 'Obsidian Shield Spray (Men)', 
    nameAr: 'بخاخ الأسود الليلي (رجالي)', 
    hex: '#0D0E12', 
    textColor: '#FFFFFF',
    typeNoteEn: 'Men’s 72H Carbon Shield Aerosol Spray',
    typeNoteAr: 'رجالي — بخاخ أيروسول كربوني نشط 72 ساعة'
  },
  { 
    id: 'white', 
    nameEn: 'Silk Hydra-Mineral Spray (Women)', 
    nameAr: 'بخاخ الأبيض اللؤلؤي (نسائي)', 
    hex: '#F8F9FA', 
    textColor: '#000000',
    typeNoteEn: 'Women’s 72H Soft Silk Hydrating Aerosol Spray',
    typeNoteAr: 'نسائي — بخاخ أيروسول حريري مرطب 72 ساعة'
  }
];

export const getProducts = (lang: string = 'en'): Product[] => {
  const tr = (en: string, es: string, fr: string, ar: string) => {
    if (lang === 'es') return es;
    if (lang === 'fr') return fr;
    if (lang === 'ar') return ar;
    return en;
  };

  const trList = (en: string[], es: string[], fr: string[], ar: string[]) => {
    if (lang === 'es') return es;
    if (lang === 'fr') return fr;
    if (lang === 'ar') return ar;
    return en;
  };

  return [
    {
      id: 'p6',
      name: 'YARD Kinetic Biometric Screenless Band',
      tagline: tr(
        'Screenless 24/7 Biometric Tracker Band — Strain, Recovery & Sleep Tracking for Training & Everyday Wear (Obsidian Black & Pearl White)',
        'Pulsera Biométrica Sin Pantalla 24/7 — Esfuerzo, Recuperación y Sueño para Entrenar y Uso Diario (Negro y Blanco)',
        'Bracelet Biométrique Sans Écran 24/7 — Charge d’Entraînement, Récupération et Sommeil au Quotidien (Noir et Blanc)',
        'سوار ذكي مبتكر بدون شاشة (بفكرة ووب) — لمتابعة الجهد والاستشفاء والنوم أثناء التدريب وخارجه طوال اليوم (أسود وأبيض)'
      ),
      description: tr(
        'Innovative screenless biometric wearable engineered like Whoop 4.0. Features an ultra-slim, low-profile curved micro-sensor capsule completely flush beneath a high-density woven knit strap with an engraved YARD 300 micro-clasp. Zero bulky boxes, zero screen distractions — built for brutal training and elegant everyday wear.',
        'Pulsera biométrica ultradelgada sin pantalla inspirada en Whoop 4.0. Cápsula de microsensores curvada y plana bajo la correa de punto elástico con cierre YARD 300 grabado. Sin cajas voluminosas, para deporte y uso diario.',
        'Bracelet biométrique ultra-fin sans écran inspiré de Whoop 4.0. Capsule de micro-capteurs incurvée et plate sous la sangle tissée avec fermoir gravé YARD 300. Zéro volume superflu, pour le sport et le quotidien.',
        'سوار ذكي مبتكر فائق النحافة وبدون شاشة مستوحى بدقة من معمارية ووب (Whoop 4.0): حساس ميكرو بيومتري نحيف جداً ومنحنٍ ومدمج بسلاسة تامة أسفل السوار النسيجي بدون أي بروز أو علب مربعة ضخمة. حزام نسيجي مطاطي محبوك فائق النعومة مع مشبك معدني مصقول محفور عليه درع YARD 300، مريح للغاية وأنيق للارتداء 24 ساعة في أقسى التمارين وفي الحياة اليومية.'
      ),
      longDescription: tr(
        'Engineered for athletes who demand pure biometrics without screen distractions or bulky hardware. Inspired directly by the ultra-thin Whoop 4.0 architecture, the YARD Kinetic Screenless Band houses an ultra-slim, featherlight curved micro-sensor capsule resting flush against the skin beneath the strap. Dual multi-spectrum PPG LEDs measure resting heart rate, heart rate variability (HRV), skin temperature deviations, and sleep staging around the clock. Paired with a breathable high-density woven knit elastic band and a low-profile anodized titanium slide micro-clasp bearing the YARD 300 insignia, it delivers seamless all-day comfort from combat sparring to casual wear.',
        'Diseñada para atletas que buscan biometría pura sin pantallas ni módulos voluminosos. Con arquitectura ultradelgada tipo Whoop 4.0, cápsula micro curvada y correa de punto técnico con microcierre YARD 300.',
        'Conçu pour les athlètes recherchant une télémétrie pure sans écran ni boîtier encombrant. Architecture ultra-fine Whoop 4.0, micro-capteurs plats et sangle élastique respirante avec fermoir YARD 300.',
        'صُمم للرياضيين الباحثين عن دقة بيومترية نقية وراحة تامة دون شاشات مشتتة ودون أي قطع ضخمة: تم تصميمه بمعمارية ميكرو فائقة النحافة والانسيابية مستوحاة مباشرة من Whoop 4.0. كبسولة الاستشعار نحيفة جداً ومنحنية ومنبسطة كلياً ومدمجة تحت السوار النسيجي لتستقر بنعومة على الجلد دون أي إزعاج أو بروز خارجي. تقيس نبض الراحة وتقلبات الـ HRV وحرارة الجسم ومراحل النوم العميق على مدار 24 ساعة، مع حزام نسيجي محبوك مطاطي مسامي ومشبك تيتانيوم ميكرو محفور عليه YARD 300 لمظهر أنيق وانسيابي في الجيم وخارجه.'
      ),
      price: 189,
      category: 'Wearable',
      imageUrl: '/images/yard_smartband_black.jpg',
      menImageUrl: '/images/yard_smartband_black.jpg',
      womenImageUrl: '/images/yard_smartband_white.jpg',
      gallery: [
        '/images/yard_smartband_black.jpg',
        '/images/yard_smartband_white.jpg'
      ],
      colors: [
        {
          id: 'black',
          nameEn: tr(
            'Obsidian Black (Screenless Woven Band)',
            'Negro Obsidiana (Banda Sin Pantalla)',
            'Noir Obsidienne (Bracelet Sans Écran)',
            'الأسود الليلي (سوار نسيجي بدون شاشة)'
          ),
          nameAr: 'الأسود الليلي (سوار نسيجي بدون شاشة)',
          hex: '#0D0E12',
          textColor: '#FFFFFF',
          imageUrl: '/images/yard_smartband_black.jpg'
        },
        {
          id: 'white',
          nameEn: tr(
            'Pearl White (Screenless Woven Band)',
            'Blanco Perla (Banda Sin Pantalla)',
            'Blanc Perle (Bracelet Sans Écran)',
            'الأبيض اللؤلؤي (سوار نسيجي بدون شاشة)'
          ),
          nameAr: 'الأبيض اللؤلؤي (سوار نسيجي بدون شاشة)',
          hex: '#F8F9FA',
          textColor: '#000000',
          imageUrl: '/images/yard_smartband_white.jpg'
        }
      ],
      selectedColor: 'black',
      genders: ['men', 'women'],
      selectedGender: 'men',
      features: trList(
        ['Innovative screenless zero-display architecture: zero light distraction, focus 100% on performance', 'Continuous 24/7 PPG telemetry: HRV, resting heart rate, recovery score & sleep staging', 'High-density woven athletic knit elastic band with engraved YARD 300 alloy clasp', 'Versatile hybrid design: engineered for high-intensity training & stylish everyday wear outside the gym', '50m water resistance (5 ATM) with 5+ day battery life and slide-on wireless charge pack'],
        ['Arquitectura innovadora sin pantalla: cero distracciones, enfoque total en el rendimiento', 'Telemetría continua 24/7: HRV, pulso en reposo, puntuación de recuperación y sueño', 'Correa elástica tejida de alta densidad con cierre metálico grabado YARD 300', 'Diseño versátil apto para entrenamiento intenso y ropa informal de calle', 'Resistencia al agua 50m (5 ATM) con batería de más de 5 días'],
        ['Architecture innovante sans écran : zéro distraction lumineuse, focus total sur la performance', 'Télémétrie continue 24/7 : VFC, rythme au repos, score de récupération et sommeil', 'Sangle en tricot élastique respirant avec fermoir gravé YARD 300', 'Design polyvalent parfait pour les entraînements extrêmes et le style de tous les jours', 'Étanche 50m (5 ATM) avec autonomie de plus de 5 jours'],
        ['تصميم مبتكر بدون شاشة: تخلص كامل من إضاءة الشاشات وتشتيتها مع تركيز 100% على الأداء البدني', 'متابعة بيومترية متواصلة 24/7: قياس الـ HRV، نبض الراحة، مؤشر الجهد، ومراحل النوم', 'حزام نسيجي محبوك مطاطي مريح للغاية مع مشبك معدني أنيق محفور عليه درع YARD 300', 'تصميم هجين مزدوج: مخصص للتمارين الرياضية العنيفة وأنيق جداً للارتداء خارج التدريب طوال اليوم', 'مقاوم للماء حتى عمق 50 متراً (5 ATM) مع بطارية تدوم أكثر من 5 أيام وشاحن لاسلكي منزلق']
      )
    },
    {
      id: 'p2',
      name: tr(
        'YARD Biometric Smart Recovery Ring',
        'Anillo Inteligente Biométrico YARD',
        'Bague Connectée Biométrique YARD',
        'خاتم YARD الذكي للاستشفاء والبيومتري'
      ),
      tagline: tr(
        'Aerospace Titanium & Zirconia Ceramic Smart Ring — Sleep, Temp & HRV Staging (Black & White Edition)',
        'Anillo Inteligente de Titanio y Cerámica — Sueño, Temperatura y HRV (Negro y Blanco)',
        'Bague Connectée en Titane & Céramique — Sommeil, Température et VFC (Noir et Blanc)',
        'خاتم استشفاء صحي ذكي — تيتانيوم وسيراميك زركونيا لمتابعة النبض والحرارة والنوم (إصدار الأسود والأبيض فقط)'
      ),
      description: tr(
        'Ultra-lightweight biometric recovery smart ring offered in Brushed Obsidian Black Titanium and Pure Arctic White Ceramic. Clinical sleep staging and HRV analysis.',
        'Anillo inteligente ultraligero disponible en Titanio Negro Obsidiana y Cerámica Blanca Ártica.',
        'Bague connectée ultra-légère en Titane Noir Obsidienne et Céramique Blanche Arctique.',
        'خاتم استشفاء ذكي فائق الخفة متوفر بخيارين حصريين: تيتانيوم أسود مطفي وسيراميك زركونيا أبيض ناصع مع دقة طبية في تحليل النوم والجهد.'
      ),
      longDescription: tr(
        'Precision biometric monitoring in a minimal, distraction-free luxury ring. Choose between Aerospace-grade brushed obsidian black titanium or diamond-polished pure arctic white zirconia ceramic with brushed platinum interior. Dual-wavelength optical PPG sensors calculate resting heart rate, HRV trends, and overnight temperature deviations with 7-day battery life.',
        'Monitoreo biométrico de precisión en un anillo de lujo. Elige entre titanio negro obsidiana o cerámica blanca ártica pulida.',
        'Surveillance biométrique de haute précision dans une bague élégante. Choisissez entre le titane noir brossé ou la céramique blanche immaculée.',
        'مراقبة بيومترية عالية الدقة في خاتم أنيق خفيف: اختر بين التيتانيوم الأسود المطفي فائق المتانة أو سيراميك الزركونيا الأبيض الناصع المصقول ببطانة بلاتينية. مستشعرات مزدوجة تقرأ نبض الراحة، تقلبات حرارة الجلد، ومراحل النوم العميق مع بطارية تدوم 7 أيام.'
      ),
      price: 299,
      category: 'Wearable',
      imageUrl: '/images/yard_ring_black_solo.jpg',
      menImageUrl: '/images/yard_ring_black_solo.jpg',
      womenImageUrl: '/images/yard_ring_white_solo.jpg',
      gallery: [
        '/images/yard_ring_black_solo.jpg',
        '/images/yard_ring_white_solo.jpg'
      ],
      colors: [
        {
          id: 'black',
          nameEn: tr('Brushed Obsidian Black Titanium', 'Titanio Negro Obsidiana Cepillado', 'Titane Noir Obsidienne Brossé', 'تيتانيوم أسود مطفي'),
          nameAr: 'تيتانيوم أسود مطفي',
          hex: '#0D0E12',
          textColor: '#FFFFFF',
          imageUrl: '/images/yard_ring_black_solo.jpg'
        },
        {
          id: 'white',
          nameEn: tr('Pure Arctic White Zirconia Ceramic', 'Cerámica Circonio Blanco Ártico', 'Céramique Zircone Blanc Arctique', 'سيراميك أبيض ناصع'),
          nameAr: 'سيراميك أبيض ناصع',
          hex: '#F8F9FA',
          textColor: '#000000',
          imageUrl: '/images/yard_ring_white_solo.jpg'
        }
      ],
      selectedColor: 'black',
      genders: ['men', 'women'],
      selectedGender: 'men',
      features: trList(
        ['Available exclusively in Brushed Obsidian Black Titanium or Pure White Zirconia Ceramic', 'Dual-wavelength optical PPG sensors for continuous resting heart rate & HRV recovery', 'Skin temperature deviation monitoring and deep REM sleep architecture staging', 'Up to 7 days battery life on a single magnetic dock charge with 50m water resistance (5 ATM)'],
        ['Disponible exclusivamente en Titanio Negro Obsidiana o Cerámica Blanca de Circonio', 'Sensores ópticos continuos para pulso y recuperación HRV', 'Seguimiento de variaciones térmicas y arquitectura del sueño', 'Hasta 7 días de batería con base magnética y resistencia al agua 50m (5 ATM)'],
        ['Disponible exclusivement en Titane Noir Obsidienne ou Céramique Blanche Zircone', 'Capteurs optiques continus pour la fréquence cardiaque et la VFC', 'Mesure des tendances thermiques et des phases de sommeil', 'Jusqu’à 7 jours d’autonomie avec socle magnétique et étanchéité 50m (5 ATM)'],
        ['متوفر حصرياً بإصدارين: تيتانيوم أسود مطفي أو سيراميك زركونيا أبيض ناصع', 'مستشعرات ضوئية متطورة لمتابعة النبض والاستشفاء البدني ومعدل HRV', 'متابعة تقلبات درجة حرارة الجلد ومراحل النوم العميق', 'بطارية تدوم حتى 7 أيام بشحنة واحدة ومقاومة للماء حتى 50 متراً (5 ATM)']
      )
    },
    {
      id: 'p4',
      name: tr(
        'YARD 300 Innovative Geometric Hydration Vessel',
        'Botella Geométrica Innovadora YARD 300',
        'Gourde Géométrique Innovante YARD 300',
        'وعاء YARD 300 الهندسي المبتكر للترطيب'
      ),
      tagline: tr(
        'Next-Gen Geometric Hydration Vessel — Kinetic Temp LED Ring & Magnetic Spout (Stealth Black & Arctic White)',
        'Botella Geométrica Innovadora — Anillo LED Térmico y Tapa Magnética (Negro y Blanco)',
        'Gourde Géométrique Innovante — Bague LED Thermique & Bouchon Magnétique (Noir & Blanc)',
        'وعاء ترطيب رياضي بتصميم هندسي مبتكر مع شاشة LED حرارية وغطاء مغناطيسي (أسود وأبيض)'
      ),
      description: tr(
        'Next-gen faceted geometric silhouette with magnetic quick-lock spout and integrated kinetic LED temperature indicator ring. Double-wall thermal insulation at zero added cost.',
        'Silueta geométrica facetada de última generación con tapón magnético y anillo indicador de temperatura LED. Aislamiento térmico al vacío sin costo adicional.',
        'Silhouette géométrique innovante avec bouchon magnétique et indicateur de température LED intégré. Isolation thermique double paroi sans surcoût.',
        'تصميم مستقبلي مبتكر بجسم هندسي مضلع مانع للانزلاق، غطاء مغناطيسي سريع الفتح، ومؤشر LED لدرجة الحرارة، مع عزل حراري 24 ساعة دون أي تكاليف إضافية.'
      ),
      longDescription: tr(
        'Re-engineered with an innovative faceted geometric silhouette that prevents rolling and ensures zero-slip grip during high-intensity training. Features an integrated kinetic LED temperature indicator ring (displays real-time chill status), magnetic rapid-action spout that snaps securely, and food-grade 18/8 stainless steel double-wall vacuum insulation (24-hour ice chilled retention). Available in Stealth Obsidian Black and Arctic Frost White — maintaining our accessible price with zero extra cost.',
        'Diseño geométrico facetado que evita que ruede y asegura agarre antideslizante. Incorpora anillo LED de temperatura, tapón magnético de apertura rápida y aislamiento al vacío de 24 horas. Disponible en Negro Sigilo y Blanco Ártico al mismo precio sin aumento.',
        'Conception géométrique novatrice anti-roulis pour une prise en main ultra-sûre. Équipée d’une bague LED cinétique indiquant la fraîcheur, d’un bouchon magnétique et d’une isolation 24h en inox 18/8. Proposée en Noir Furtif et Blanc Arctique sans aucun surcoût.',
        'تمت ترقية وعاء الترطيب إلى جيل مبتكر كلياً: هيكل خارجي مضلع مانع للدحرجة ومريح لقبضة اليد أثناء التمارين الشاقة، حلقة رقمية تفاعلية LED تقرأ درجة حرارة وترطيب المشروب، غطاء مغناطيسي ذكي ينفتح بلمسة واحدة، وعزل مزدوج بالتفريغ الهوائي يحفظ البرودة المثلجة حتى 24 ساعة. متوفر باللون الأسود الكربوني المطفي والأبيض القطبي النقي الإصدار الهندسي الحصري.'
      ),
      price: 110,
      category: 'Home',
      imageUrl: '/images/yard_vessel_innovative_black.jpg',
      menImageUrl: '/images/yard_vessel_innovative_black.jpg',
      womenImageUrl: '/images/yard_vessel_innovative_white.jpg',
      gallery: [
        '/images/yard_vessel_innovative_black.jpg',
        '/images/yard_vessel_innovative_white.jpg'
      ],
      colors: [
        {
          id: 'black',
          nameEn: tr('Stealth Obsidian Black', 'Negro Obsidiana Sigilo', 'Noir Obsidienne Furtif', 'الأسود المبتكر (Obsidian Black)'),
          nameAr: 'الأسود المبتكر (Obsidian Black)',
          hex: '#0D0E12',
          textColor: '#FFFFFF',
          imageUrl: '/images/yard_vessel_innovative_black.jpg'
        },
        {
          id: 'white',
          nameEn: tr('Arctic Frost White', 'Blanco Escarcha Ártico', 'Blanc Givre Arctique', 'الأبيض المبتكر (Arctic White)'),
          nameAr: 'الأبيض المبتكر (Arctic White)',
          hex: '#F8F9FA',
          textColor: '#000000',
          imageUrl: '/images/yard_vessel_innovative_white.jpg'
        }
      ],
      selectedColor: 'black',
      genders: ['men', 'women'],
      selectedGender: 'men',
      features: trList(
        ['Innovative faceted geometric silhouette prevents rolling & provides non-slip grip', 'Integrated kinetic LED lid ring displays temperature and hydration status', 'One-touch magnetic quick-flip cap with 100% leakproof seal', 'Double-wall 18/8 stainless steel vacuum insulation keeps cold up to 24 hours', 'Next-generation innovative upgrade in Black & White with zero added cost'],
        ['Silueta geométrica facetada anti-rodamiento con agarre antideslizante', 'Anillo LED cinético que muestra la temperatura y estado de hidratación', 'Tapa magnética de apertura rápida 100% a prueba de fugas', 'Aislamiento al vacío de doble pared en acero 18/8 (24h frío)', 'Actualización innovadora en Blanco y Negro sin coste adicional'],
        ['Silhouette géométrique anti-roulement avec préhension antidérapante', 'Bague LED cinétique affichant la température et le niveau de fraîcheur', 'Bouchon magnétique à ouverture instantanée hermétique à 100%', 'Isolation sous vide double paroi en acier inoxydable 18/8 (24h au frais)', 'Mise à niveau innovante en Noir et Blanc sans aucun coût supplémentaire'],
        ['تصميم هندسي مضلع ومبتكر يمنع التدحرج ويوفر قبضة يد فائقة الثبات', 'مؤشر رقمي LED مدمج في الغطاء لعرض درجة الحرارة وحالة الترطيب', 'غطاء مغناطيسي سريع الفتح والإغلاق بلمسة واحدة مانع للتسريب 100%', 'عزل حراري مزدوج بجدارين من الفولاذ 18/8 يحفظ البرودة حتى 24 ساعة', 'ترقية مبتكرة متوفرة باللونين الأسود والأبيض دون أي زيادة في التكلفة']
      )
    },
    {
      id: 'p7',
      name: tr(
        'YARD 300 Apex Carbon Compression Tee',
        'Camiseta de Compresión Carbono YARD 300',
        'T-Shirt de Compression Carbone YARD 300',
        'تي شيرت YARD 300 الكربوني الضاغط'
      ),
      tagline: tr(
        'Precision Kinetic Compression Apparel — Geometric "YARD 300" Engineering (Men\x27s Obsidian Black & Women\x27s Pearl White)',
        'Camiseta de Compresión Técnica YARD 300 — Corte Preciso (Negro para Hombres y Blanco para Mujeres)',
        'T-Shirt de Compression Technique YARD 300 — Coupe Précise (Noir Homme & Blanc Femme)',
        'تي شيرت ضاغط بتقنية الكربون المبتكرة — شعار YARD 300 الهندسي (الأسود للرجال والأبيض المنساب للنساء)'
      ),
      description: tr(
        'Precision kinetic compression t-shirt engineered in Obsidian Black for men and Pure Pearl White with sculpted contours for women.',
        'Camiseta técnica de última generación en Negro Obsidiana para hombres y Blanco Perla para mujeres.',
        'T-shirt de compression haute performance en Noir Obsidienne homme et Blanc Perle femme.',
        'تي شيرت رياضي ضاغط عالي الأداء: اللون الأسود الليلي للرجال بقصة رغلان ضاغطة، واللون الأبيض اللؤلؤي للنساء بقصة انسيابية، مع شعار YARD 300 الهندسي.'
      ),
      longDescription: tr(
        'Engineered for peak neuromuscular ventilation and zero-drag motion. Tailored separately for men in Obsidian Black and women in Pure Pearl White with breathable micro-mesh panels and laser-cut flatlock seams.',
        'Diseñado para ventilación neuromuscular y movimiento sin fricción. Corte ergonómico masculino y femenino con costuras planas.',
        'Conçu pour une ventilation optimale et une liberté de mouvement totale. Coupes dédiées homme et femme sans couture irritante.',
        'مصمم هندسياً للتهوية القصوى والانسيابية أثناء الأداء البدني العالي: نسخة الرجال باللون الأسود الليلي، ونسخة النساء باللون الأبيض اللؤلؤي مع نسيج مسامي خفيف الوزن.'
      ),
      price: 115,
      originalPrice: 135,
      category: 'Apparel',
      imageUrl: '/images/yard_tee_men_anime.jpg',
      menImageUrl: '/images/yard_tee_men_anime.jpg',
      womenImageUrl: '/images/yard_tee_women_anime.jpg',
      gallery: [
        '/images/yard_tee_men_anime.jpg',
        '/images/yard_tee_women_anime.jpg'
      ],
      colors: [
        {
          id: 'black',
          nameEn: tr("Men's Obsidian Black (YARD 300)", 'Negro Obsidiana Hombre (YARD 300)', 'Noir Obsidienne Homme (YARD 300)', 'الأسود الليلي للرجال (YARD 300)'),
          nameAr: 'الأسود الليلي للرجال (YARD 300)',
          hex: '#0D0E12',
          textColor: '#FFFFFF',
          imageUrl: '/images/yard_tee_men_anime.jpg'
        },
        {
          id: 'white',
          nameEn: tr("Women's Pearl White (YARD 300)", 'Blanco Perla Mujer (YARD 300)', 'Blanc Perle Femme (YARD 300)', 'الأبيض اللؤلؤي للنساء (YARD 300)'),
          nameAr: 'الأبيض اللؤلؤي للنساء (YARD 300)',
          hex: '#F8F9FA',
          textColor: '#000000',
          imageUrl: '/images/yard_tee_women_anime.jpg'
        }
      ],
      selectedColor: 'black',
      genders: ['men', 'women'],
      selectedGender: 'men',
      features: trList(
        ['Architectural "YARD 300" precision typography across chest', 'Men\x27s edition tailored in Obsidian Black with supportive muscle compression zones', 'Women\x27s edition tailored in Pure Pearl White with ergonomic contoured seams', 'Four-way stretch micro-mesh cooling ventilation for zero friction', 'Direct release pricing: $115 (save $20 off $135 retail)'],
        ['Tipografía arquitectónica YARD 300 en el pecho', 'Edición hombre en Negro Obsidiana con compresión muscular', 'Edición mujer en Blanco Perla con costuras ergonómicas', 'Malla elástica respirable en 4 direcciones', 'Precio directo de lanzamiento: 115 $ (ahorro de 20 $)'],
        ['Typographie architecturale YARD 300 sur la poitrine', 'Édition homme en Noir Obsidienne à compression ciblée', 'Édition femme en Blanc Perle à coupe ergonomique', 'Tissu respirant extensible 4 sens sans frottement', 'Prix direct lancement : 115 $ (20 $ d\x27économie)'],
        ['طباعة هندسية دقيقة لشعار "YARD 300" على الصدر', 'إصدار رجالي باللون الأسود الليلي مع دعم ضاغط للألياف العضلية', 'إصدار نسائي باللون الأبيض اللؤلؤي بقصة مريحة وانسيابية', 'ألياف تقنية مرنة في 4 اتجاهات مع شبك تهوية مسامي', 'سعر الإطلاق المباشر: 115$ (توفير 20$)']
      )
    }
  ];
};

export const PRODUCTS: Product[] = getProducts('en');

export const getJournalArticles = (lang: string = 'en'): JournalArticle[] => {
  const isAr = lang === 'ar';
  const isEs = lang === 'es';
  const isFr = lang === 'fr';
  const tr = (en: string, es: string, fr: string, ar: string) =>
    isAr ? ar : isEs ? es : isFr ? fr : en;

  return [
    {
      id: 1,
      title: tr(
        "Samurai Warrior Mindset: Shattering Limits Past 100% & Conquering Muscle Fatigue",
        "Mentalidad de Guerrero Samurái: Superando el 100% y la Fatiga Muscular",
        "Mentalité de Guerrier Samouraï : Dépasser les 100% et Vaincre la Fatigue",
        "عقلية محارب الساموراي: كسر الحدود 100% وتحطيم سقف الإجهاد العضلي"
      ),
      date: tr("September 28, 2026", "28 de Septiembre, 2026", "28 Septembre 2026", "28 سبتمبر 2026"),
      excerpt: tr(
        "The difference between an ordinary lifter and an elite combat champion isn't genetics — it's razor-sharp focus, tactical discipline, and pushing through deep burn.",
        "La diferencia entre un atleta común y un campeón de élite reside en el enfoque táctico y la disciplina bajo fatiga extrema.",
        "La différence entre un athlète ordinaire et un champion réside dans la concentration tactique et la discipline sous fatigue.",
        "الفرق بين الممارس العادي وبطل القتال الخارق ليس في الجينات، بل في التركيز الشرس والانضباط التكتيكي ومواصلة الضغط عند أعلى درجات الاحتراق."
      ),
      image: JOURNAL_MINDSET_IMAGE,
      content: React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          tr(
            "When muscles burn and your mind screams to drop the barbell, the inner samurai awakens. In the YARD300 combat philosophy, fixed ceilings do not exist; fatigue is merely the neurological bell signaling that real growth has begun.",
            "Cuando los músculos arden, despierta el guerrero interior. En la filosofía YARD300 no existen techos fijos; la fatiga es la señal neurológica de adaptación real.",
            "Lorsque les muscles brûlent, le guerrier intérieur s’éveille. Dans l’approche YARD300, il n’y a pas de plafond fixe ; la fatigue annonce le progrès réel.",
            "عندما تشعر باحتراق أليافك العضلية ويطالبك عقلك بالتوقف، يظهر محارب الساموراي الكامن بداخلك. في منهجية YARD300، لا نؤمن بالحدود الثابتة؛ فالإرهاق مجرد إشارة عصبية عابرة تعلن بدء التدريب الحقيقي."
          )
        ),
        React.createElement("p", { className: "mb-8 text-lg leading-relaxed text-[#D0D8ED]" },
          tr(
            "Synthesizing neuromuscular coordination, endurance hormone monitoring, and tactical deep combat respiration allows you to shatter the 100% threshold safely.",
            "Combinar coordinación neuromuscular, monitoreo de resistencia y respiración táctica te permite superar el umbral del 100% con seguridad.",
            "Allier coordination neuromusculaire, suivi de l’endurance et respiration tactique permet de dépasser vos limites en toute sécurité.",
            "دمج التوافق العصبي العضلي، ومراقبة هرمونات التحمل، والتنفس القتالي العميق يتيح لك تحقيق كومبو لا نهائي وكسر حاجز الـ 100% دون التعرض للإصابات المفاجئة."
          )
        ),
        React.createElement("blockquote", { className: `${isAr ? 'border-r-4 pr-6' : 'border-l-4 pl-6'} border-[#E50914] italic text-2xl text-[#FFE600] my-10 font-anime` },
          tr(
            "\"The katana is forged only in fierce flame, and champion muscle is sculpted only by annihilating self-doubt!\"",
            "\"¡La katana se forja solo en fuego intenso, y el físico de campeón se esculpe superando toda duda!\"",
            "\"Le katana ne se forge que dans la flamme vive, et le physique d’un champion se sculpte sans le moindre doute !\"",
            "\"النصل لا يُصقل إلا باللهب العالي، وعضلات البطل لا تُبنى إلا بكسر حاجز الخوف!\""
          )
        )
      )
    },
    {
      id: 2,
      title: tr(
        "YARD300 Combat Gear Revolution: Carbon Armor & 2050 Biometric Precision",
        "Revolución de Equipamiento YARD300: Armadura de Carbono y Precisión Biométrica",
        "Révolution Équipement YARD300 : Armure Carbone & Précision Biométrique",
        "ثورة عتاد براند YARD300 القتالي: دمج ألياف الكربون مع مستشعرات الأداء 2050"
      ),
      date: tr("September 25, 2026", "25 de Septiembre, 2026", "25 Septembre 2026", "25 سبتمبر 2026"),
      excerpt: tr(
        "Discover how YARD300 engineered titanium wearables, kinetic harnesses, and hybrid audio that sync directly with heart-rate spikes.",
        "Descubre cómo YARD300 diseñó sensores de titanio y arneses cinéticos sincronizados con el ritmo cardíaco.",
        "Découvrez comment YARD300 a conçu des capteurs en titane et des tenues cinétiques synchronisées au rythme cardiaque.",
        "استكشف كيف ابتكر مهندسو YARD300 دروعاً رياضية وأحزمة مقاومة وسماعات هجينة تتفاعل مع ضربات القلب ونبضات الهالة الحركية."
      ),
      image: JOURNAL_GEAR_IMAGE,
      content: React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          tr(
            "Athletic gear is no longer passive fabric. Under brand YARD300, every piece is cyber-armor calculating kinetic strain and stabilizing joints for instantaneous explosive force.",
            "El equipamiento deportivo ya no es tela pasiva. Cada pieza de YARD300 estabiliza articulaciones y maximiza la fuerza explosiva.",
            "L’équipement sportif n’est plus un simple textile. Chaque pièce YARD300 stabilise les articulations et libère une puissance explosive.",
            "لم يعد عتاد التمرين مجرد أقمشة تمتص العرق. في عصر براند YARD300، تحول كل منتج إلى قطعة درع سيبرانية تحسب الإجهاد الحركي وتدعم المفاصل الحساسة لتوفير طاقة انفجارية فورية."
          )
        ),
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          tr(
            "From titanium noise-cancelling headphones to high-load kinetic harnesses, every item is built to outlast the most punishing boxing rounds.",
            "Desde wearables de titanio hasta prendas cinéticas, cada artículo está fabricado para resistir los asaltos más duros.",
            "Des capteurs en titane aux textiles de compression cinétique, chaque pièce résiste aux entraînements les plus exigeants.",
            "من سماعات إلغاء الضوضاء التيتانية إلى أحزمة المقاومة البوليمرية، صنعت كل قطعة لتصمد أمام أشرس جلسات الملاكمة وتمارين الـ CrossFit القاسية."
          )
        )
      )
    },
    {
      id: 3,
      title: tr(
        "Ninja Recovery Protocol: HRV Restoration & Deep Tissue Healing in 4 Hours",
        "Protocolo de Recuperación Ninja: Restauración de HRV en 4 Horas",
        "Protocole de Récupération Ninja : Restauration VRC en 4 Heures",
        "بروتوكول الاستشفاء النينجا: استعادة معدل HRV والشفاء العضلي العميق في 4 ساعات"
      ),
      date: tr("September 20, 2026", "20 de Septiembre, 2026", "20 Septembre 2026", "20 سبتمبر 2026"),
      excerpt: tr(
        "AI algorithms reveal the secrets of photobiomodulation and cold exposure to restore full combat readiness without passive downtime.",
        "Los algoritmos de IA revelan protocolos térmicos y de fotobiomodulación para recuperar la preparación total sin pausa pasiva.",
        "Les algorithmes d’IA révèlent les secrets de récupération active et de restauration VRC sans temps mort.",
        "خوارزميات الذكاء الاصطناعي تكشف أسرار كبسولات الضوء الأحمر والكمادات الثلجية لاستعادة الجاهزية القتالية التامة بدون إهدار أيام راحة سلبية."
      ),
      image: JOURNAL_RECOVERY_IMAGE,
      content: React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          tr(
            "A modern warrior never leaves recovery to luck. Active healing is tracked with the exact rigor applied to heavy boxing rounds.",
            "Un guerrero moderno nunca deja la recuperación al azar; el descanso activo se mide con el mismo rigor que cada asalto.",
            "Un athlète moderne ne laisse jamais sa récupération au hasard ; la régénération est mesurée avec rigueur.",
            "المحارب الذكي لا ينتظر أن يشفى جسده بالمصادفة. الاستشفاء النشط يُدار بنفس الدقة والصرامة التي تُدار بها جولات الملاكمة."
          )
        ),
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          tr(
            "Utilizing SpO2 metrics, 850nm red light wavelengths, and YARD300 deep sleep staging, athletes reboot to peak 9999 AU capacity overnight.",
            "Utilizando métricas SpO2 y análisis de sueño profundo de YARD300, los atletas restauran su capacidad máxima durante la noche.",
            "Grâce aux mesures SpO2 et à l’analyse du sommeil profond YARD300, les athlètes retrouvent leur plein potentiel chaque matin.",
            "باستخدام قراءات SpO2، وموجات الضوء الأحمر 850nm، وتتبع مراحل النوم العميق بمحرك YARD300، يعود المحارب إلى كامل طاقته في صباح اليوم التالي."
          )
        )
      )
    }
  ];
};

export const JOURNAL_ARTICLES: JournalArticle[] = getJournalArticles('en');

export const BRAND_NAME = 'YARD300';
export const BRAND_TAGLINE = 'YARD 300 GLOBAL PERFORMANCE LAB';
export const PRIMARY_COLOR = '#D4AF37'; 
export const ACCENT_COLOR = '#10B981';
