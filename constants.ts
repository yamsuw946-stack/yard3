/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle } from './types';

export const HERO_IMAGE = '/images/anime_hero_demon_back_1788742125215.jpg';
export const SHAOLIN_MONASTERY_IMAGE = '/images/shaolin_mountain_monastery.jpg';
export const REALISTIC_ANIME_STRIKER_IMAGE = '/images/realistic_anime_striker.jpg';
export const REALISTIC_VALKYRIE_IMAGE = '/images/realistic_valkyrie_fighter.jpg';
export const ABOUT_SQUAD_IMAGE = '/images/aura_champions_squad.jpg';
export const LIVE_ARENA_IMAGE = '/images/live_arena_fighters_2050_1788741135197.jpg';
export const VALKYRIE_NEON_IMAGE = '/images/realistic_valkyrie_fighter.jpg';
export const TARIK_SAIYAN_IMAGE = '/images/realistic_anime_striker.jpg';
export const REN_FLAME_IMAGE = '/images/ren_flame_hashira_1788741696531.jpg';
export const TITAN_BRAWLER_IMAGE = '/images/titan_brawler_2050_1788741109327.jpg';
export const CYBER_SHINOBI_IMAGE = '/images/cyber_shinobi_2050_1788741122150.jpg';
export const KAREM_IRON_IMAGE = '/images/karem_iron_vanguard_1788741709635.jpg';
export const SAMURAI_RONIN_IMAGE = '/images/cyber_ronin_blade.jpg';
export const CYBER_SAMURAI_UNIQUE_IMAGE = '/images/cyber_samurai_unique.jpg';
export const CYBER_RONIN_BLADE_IMAGE = '/images/cyber_ronin_blade.jpg';
export const NINJA_KUNOICHI_IMAGE = '/images/ninja_kunoichi_shadow_1790712603497.jpg';
export const BOXING_STRIKER_IMAGE = '/images/boxing_striker_kenji_1790712616545.jpg';
export const BOXING_VALKYRIE_IMAGE = '/images/boxing_valkyrie_punch_1790712629802.jpg';
export const AI_COACH_IMAGE = '/images/anime_ai_coach_sensei_1788741808443.jpg';
export const CHALLENGER_IMAGE = '/images/anime_challenger_rookie_1788741832986.jpg';
export const JOURNAL_RECOVERY_IMAGE = '/images/recovery_journal_lab.jpg';
export const JOURNAL_MINDSET_IMAGE = '/images/athlete_mindset_track.jpg';
export const JOURNAL_GEAR_IMAGE = '/images/journal_gear_tech.jpg';

// Live Tournaments, Community Founders & Hero Showcase
export const YARD300_BRAND_LOGO = '/images/yard_official_logo.jpg';
export const YARD_SHARP_BW_SHIELD_LOGO = '/images/yard_official_logo.jpg';
export const AURA_EMBLEM_LOGO = '/images/yard_official_logo.jpg';
export const YARD_BRAND_HERO_BANNER = '/images/yard_brand_hero.jpg';
export const YARD_SHIRT_IMAGE = '/images/yard_tee_black_anime.jpg';
export const YARD_SHORTS_IMAGE = '/images/yard_shorts_black_anime.jpg';
export const YARD_WRAPS_IMAGE = '/images/yard_wraps_mockup.jpg';
export const LIVE_ARENA_CHALLENGES_IMAGE = '/images/live_arena_challenges_1790809292780.jpg';
export const ANIME_HERO_ROSTER_IMAGE = '/images/founders_trio_v3_1790810538938.jpg';
export const FOUNDER_YAM_SUW_IMAGE = '/images/yam_suw_athlete.jpg';
export const FOUNDER_MTK_IMAGE = '/images/mtk_athlete.jpg';
export const FOUNDER_ARB_IMAGE = '/images/arb_athlete.jpg';

export const ANIME_FIGHTER_RYU_IMAGE = '/images/anime_fighter_ryu.jpg';
export const ANIME_FIGHTER_REN_IMAGE = '/images/anime_fighter_ren.jpg';
export const ANIME_FIGHTER_KIRA_IMAGE = '/images/anime_fighter_kira.jpg';
export const ANIME_FIGHTER_RYU_IMPACT_IMAGE = '/images/anime_fighter_ryu_impact.jpg';
export const ANIME_FIGHTER_REN_IMPACT_IMAGE = '/images/anime_fighter_ren_impact.jpg';
export const ANIME_FIGHTER_KIRA_IMPACT_IMAGE = '/images/anime_fighter_kira_impact.jpg';

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
    img.src = './images/' + fileName;
  } else {
    const fallbacks: Record<string, string> = {
      'valkyrie_neon': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      'tarik_saiyan': 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=800&auto=format&fit=crop&q=80',
      'ren_flame': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'karem_iron': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
      'anime_ai_coach': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      'anime_challenger': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'anime_fast_recovery': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      'anime_journal_mindset': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      'anime_journal_gear': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      'anime_hero': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      'aura_headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'aura_smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'aura_kinetic': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'aura_hydro': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'aura_vr': 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&auto=format&fit=crop&q=80',
      'aura_ignite': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'titan_brawler': 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=800&auto=format&fit=crop&q=80',
      'cyber_shinobi': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      'live_arena': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
      'anime_audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'anime_watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'anime_kinetic': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'anime_hydro': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'anime_vr': 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&auto=format&fit=crop&q=80',
      'anime_preworkout': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      'anime_about': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80'
    };
    const key = Object.keys(fallbacks).find(k => fileName.includes(k));
    img.src = key ? fallbacks[key] : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80';
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
        { id: 'black', nameEn: 'Obsidian Black (Screenless Woven Band)', nameAr: 'الأسود الليلي (سوار نسيجي بدون شاشة)', hex: '#0D0E12', textColor: '#FFFFFF', imageUrl: '/images/yard_smartband_black.jpg' },
        { id: 'white', nameEn: 'Pearl White (Screenless Woven Band)', nameAr: 'الأبيض اللؤلؤي (سوار نسيجي بدون شاشة)', hex: '#F8F9FA', textColor: '#000000', imageUrl: '/images/yard_smartband_white.jpg' }
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
      name: 'YARD Biometric Smart Recovery Ring',
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
        { id: 'black', nameEn: 'Brushed Obsidian Black Titanium', nameAr: 'تيتانيوم أسود مطفي', hex: '#0D0E12', textColor: '#FFFFFF', imageUrl: '/images/yard_ring_black_solo.jpg' },
        { id: 'white', nameEn: 'Pure Arctic White Zirconia Ceramic', nameAr: 'سيراميك أبيض ناصع', hex: '#F8F9FA', textColor: '#000000', imageUrl: '/images/yard_ring_white_solo.jpg' }
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
      name: 'YARD 300 Innovative Geometric Hydration Vessel',
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
        { id: 'black', nameEn: 'Stealth Obsidian Black', nameAr: 'الأسود المبتكر (Obsidian Black)', hex: '#0D0E12', textColor: '#FFFFFF', imageUrl: '/images/yard_vessel_innovative_black.jpg' },
        { id: 'white', nameEn: 'Arctic Frost White', nameAr: 'الأبيض المبتكر (Arctic White)', hex: '#F8F9FA', textColor: '#000000', imageUrl: '/images/yard_vessel_innovative_white.jpg' }
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
      name: 'YARD 300 Cyber Anime Combat Pro T-Shirt',
      tagline: tr(
        'Innovative Anime Cyber-Combat Compression Tee — Stylized "YARD 300" Mecha Lettering (Men\x27s Stealth Black & Women\x27s Pearl White)',
        'Camiseta Innovadora Anime YARD 300 — Tipografía Mecha Estilizada (Negro para Hombres y Blanco para Mujeres)',
        'T-Shirt Innovant Anime YARD 300 — Typographie Mecha Stylisée (Noir Homme & Blanc Femme)',
        'تي شيرت أنمي قتالي مبتكر — كتابة YARD 300 بطريقة ميكا يابانية مستقبلية (الأسود للرجال والأبيض المنساب للنساء)'
      ),
      description: tr(
        'Innovative anime-inspired athletic combat t-shirt engineered in Stealth Obsidian Black for men and Pure Arctic White with feminine tailored contours for women. Emblazoned with futuristic stylized "YARD 300" anime mecha calligraphy.',
        'Camiseta de combate de última generación inspirada en el anime con tipografía YARD 300 mecha en Negro Sigilo para hombres y Blanco Ártico para mujeres.',
        'T-shirt de combat haute performance inspiré de l\x27anime avec typographie YARD 300 futuriste en Noir Furtif homme et Blanc Arctique femme.',
        'تي شيرت رياضي قتالي مبتكر مستوحى من عالم الأنمي: اللون الأسود الليلي للرجال بقصة رغلان ضاغطة، واللون الأبيض اللؤلؤي للنساء بقصة رياضية أنثوية انسيابية، مع طباعة كتابة YARD 300 بطريقة هندسية مبتكرة تشبه شعارات الأنمي وميكا الساموراي.'
      ),
      longDescription: tr(
        'Elevated into an authentic anime combat statement piece. Designed with bespoke cuts tailored for both genders: Men\x27s Stealth Obsidian Black featuring bonded compression contours, and Women\x27s Pure Arctic White featuring ergonomic feminine silhouette tailoring. Both editions showcase the innovative stylized "YARD 300" anime mecha typography boldly across the chest, fused with four-way stretch athletic fabric, lateral breathability panels, and frictionless flatlock seams.',
        'Diseño exclusivo inspirado en el anime de combate. Corte anatómico de compresión para hombre en Negro y silueta femenina ergonómica para mujer en Blanco, ambos con tipografía mecha YARD 300.',
        'Design exclusif inspiré des mangas de combat. Coupe athlétique homme en Noir et coupe féminine ajustée en Blanc, toutes deux arborant la typographie mecha YARD 300.',
        'تصميم استثنائي يجمع بين الفخامة وعالم الأنمي القتالي: تم تخصيص نسختين متميزتين — نسخة الرجال باللون الأسود الليلي مع خطوط ضاغطة هندسية، ونسخة النساء باللون الأبيض اللؤلؤي بقصة رياضية أنثوية راقية تبرز الرشاقة، مع إبراز كتابة YARD 300 بطريقة مبتكرة بخط الأنمي الميكا المستقبلي.'
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
        { id: 'black', nameEn: 'Men\x27s Stealth Black (Anime YARD 300)', nameAr: 'الأسود الليلي للرجال (كتابة أنمي YARD 300)', hex: '#0D0E12', textColor: '#FFFFFF', imageUrl: '/images/yard_tee_men_anime.jpg' },
        { id: 'white', nameEn: 'Women\x27s Pearl White (Feminine Anime YARD 300)', nameAr: 'الأبيض اللؤلؤي للنساء (تصميم أنثوي أنمي)', hex: '#F8F9FA', textColor: '#000000', imageUrl: '/images/yard_tee_women_anime.jpg' }
      ],
      selectedColor: 'black',
      genders: ['men', 'women'],
      selectedGender: 'men',
      features: trList(
        ['Innovative anime mecha "YARD 300" chest typography rendered in high-definition cyber styling', 'Men\x27s edition tailored in Stealth Obsidian Black with ergonomic muscle compression panels', 'Women\x27s edition tailored in Pure Pearl White with elegant feminine silhouette curves', 'Four-way stretch high-mobility micro-mesh cooling zones for zero friction', 'Special limited reduction: $20 OFF original retail price ($115 vs $135)'],
        ['Tipografía anime mecha "YARD 300" en el pecho con diseño cibernético de alta definición', 'Edición para hombre en Negro Obsidiana con paneles de compresión muscular', 'Edición para mujer en Blanco Perla con silueta femenina anatómica', 'Zonas de ventilación de micro-malla elástica en 4 direcciones', 'Descuento especial: 20 $ de ahorro (115 $ vs 135 $)'],
        ['Typographie anime mecha "YARD 300" haute définition sur la poitrine', 'Édition homme en Noir Obsidienne avec panneaux de compression ergonomiques', 'Édition femme en Blanc Perle avec silhouette féminine ajustée', 'Empiècements respirants en micro-mesh extensible 4 sens', 'Remise spéciale : 20 $ de réduction (115 $ vs 135 $)'],
        ['كتابة مبتكرة لشعار "YARD 300" بأسلوب خطوط الأنمي والميكا المستقبلية عالية الدقة', 'إصدار رجالي باللون الأسود الليلي مع خطوط ضاغطة لتحديد العضلات وتعزيز الأداء', 'إصدار نسائي باللون الأبيض اللؤلؤي الناصع بقصة أنثوية رشيقة ومريحة جداً', 'ألياف تقنية مرنة في 4 اتجاهات مع شبك تهوية مسامي يمنع التعرق والاحتكاك', 'خصم حصري ومباشر بقيمة 20 دولار (115$ بدلاً من 135$)']
      )
    }
  ];
};

export const PRODUCTS: Product[] = getProducts('en');

export const getJournalArticles = (lang: string = 'en'): JournalArticle[] => {
  const isAr = lang === 'ar';
  return [
    {
      id: 1,
      title: isAr ? "عقلية محارب الساموراي: كسر الحدود 100% وتحطيم سقف الإجهاد العضلي" : "Samurai Warrior Mindset: Shattering Limits Past 100% & Conquering Muscle Fatigue",
      date: isAr ? "28 سبتمبر 2026" : "September 28, 2026",
      excerpt: isAr 
        ? "الفرق بين الممارس العادي وبطل القتال الخارق ليس في الجينات، بل في التركيز الشرس والانضباط التكتيكي ومواصلة الضغط عند أعلى درجات الاحتراق."
        : "The difference between an ordinary lifter and an elite combat champion isn't genetics — it's razor-sharp focus, tactical discipline, and pushing through deep burn.",
      image: JOURNAL_MINDSET_IMAGE,
      content: isAr ? React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "عندما تشعر باحتراق أليافك العضلية ويطالبك عقلك بالتوقف، يظهر محارب الساموراي الكامن بداخلك. في منهجية YARD300، لا نؤمن بالحدود الثابتة؛ فالإرهاق مجرد إشارة عصبية عابرة تعلن بدء التدريب الحقيقي."
        ),
        React.createElement("p", { className: "mb-8 text-lg leading-relaxed text-[#D0D8ED]" },
          "دمج التوافق العصبي العضلي، ومراقبة هرمونات التحمل، والتنفس القتالي العميق يتيح لك تحقيق كومبو لا نهائي وكسر حاجز الـ 100% دون التعرض للإصابات المفاجئة."
        ),
        React.createElement("blockquote", { className: "border-r-4 border-[#E50914] pr-6 italic text-2xl text-[#FFE600] my-10 font-anime" },
          "\"النصل لا يُصقل إلا باللهب العالي، وعضلات البطل لا تُبنى إلا بكسر حاجز الخوف!\""
        )
      ) : React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "When muscles burn and your mind screams to drop the barbell, the inner samurai awakens. In the YARD300 combat philosophy, fixed ceilings do not exist; fatigue is merely the neurological bell signaling that real growth has begun."
        ),
        React.createElement("p", { className: "mb-8 text-lg leading-relaxed text-[#D0D8ED]" },
          "Synthesizing neuromuscular coordination, endurance hormone monitoring, and tactical deep combat respiration allows you to shatter the 100% threshold safely."
        ),
        React.createElement("blockquote", { className: "border-l-4 border-[#E50914] pl-6 italic text-2xl text-[#FFE600] my-10 font-anime" },
          "\"The katana is forged only in fierce flame, and champion muscle is sculpted only by annihilating self-doubt!\""
        )
      )
    },
    {
      id: 2,
      title: isAr ? "ثورة عتاد براند YARD300 القتالي: دمج ألياف الكربون مع مستشعرات الأنمي 2050" : "YARD300 Combat Gear Revolution: Carbon Armor & 2050 Biometric Precision",
      date: isAr ? "25 سبتمبر 2026" : "September 25, 2026",
      excerpt: isAr
        ? "استكشف كيف ابتكر مهندسو YARD300 دروعاً رياضية وأحزمة مقاومة وسماعات هجينة تتفاعل مع ضربات القلب ونبضات الهالة الحركية."
        : "Discover how YARD300 engineered titanium wearables, kinetic harnesses, and hybrid audio that sync directly with heart-rate spikes.",
      image: JOURNAL_GEAR_IMAGE,
      content: isAr ? React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "لم يعد عتاد التمرين مجرد أقمشة تمتص العرق. في عصر براند YARD300، تحول كل منتج إلى قطعة درع سيبرانية تحسب الإجهاد الحركي وتدعم المفاصل الحساسة لتوفير طاقة انفجارية فورية."
        ),
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "من سماعات إلغاء الضوضاء التيتانية إلى أحزمة المقاومة البوليمرية، صنعت كل قطعة لتصمد أمام أشرس جلسات الملاكمة وتمارين الـ CrossFit القاسية."
        )
      ) : React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "Athletic gear is no longer passive fabric. Under brand YARD300, every piece is cyber-armor calculating kinetic strain and stabilizing joints for instantaneous explosive force."
        ),
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "From titanium noise-cancelling headphones to high-load kinetic harnesses, every item is built to outlast the most punishing boxing rounds."
        )
      )
    },
    {
      id: 3,
      title: isAr ? "بروتوكول الاستشفاء النينجا: استعادة معدل HRV والشفاء العضلي العميق في 4 ساعات" : "Ninja Recovery Protocol: HRV Restoration & Deep Tissue Healing in 4 Hours",
      date: isAr ? "20 سبتمبر 2026" : "September 20, 2026",
      excerpt: isAr
        ? "خوارزميات الذكاء الاصطناعي تكشف أسرار كبسولات الضوء الأحمر والكمادات الثلجية لاستعادة الجاهزية القتالية التامة بدون إهدار أيام راحة سلبية."
        : "AI algorithms reveal the secrets of photobiomodulation and cold exposure to restore full combat readiness without passive downtime.",
      image: JOURNAL_RECOVERY_IMAGE,
      content: isAr ? React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "المحارب الذكي لا ينتظر أن يشفى جسده بالمصادفة. الاستشفاء النشط يُدار بنفس الدقة والصرامة التي تُدار بها جولات الملاكمة."
        ),
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "باستخدام قراءات SpO2، وموجات الضوء الأحمر 850nm، وتتبع مراحل النوم العميق بمحرك YARD300، يعود المحارب إلى كامل طاقته في صباح اليوم التالي."
        )
      ) : React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "A modern warrior never leaves recovery to luck. Active healing is tracked with the exact rigor applied to heavy boxing rounds."
        ),
        React.createElement("p", { className: "mb-6 text-lg leading-relaxed text-[#D0D8ED]" },
          "Utilizing SpO2 metrics, 850nm red light wavelengths, and YARD300 deep sleep staging, athletes reboot to peak 9999 AU capacity overnight."
        )
      )
    }
  ];
};

export const JOURNAL_ARTICLES: JournalArticle[] = getJournalArticles('en');

export const BRAND_NAME = 'YARD300';
export const BRAND_TAGLINE = 'AURA CHAMPION // 限界突破 2026';
export const PRIMARY_COLOR = '#FF007A'; 
export const ACCENT_COLOR = '#00F0FF';
