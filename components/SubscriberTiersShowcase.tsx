import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Download,
  Check,
  CheckCircle2,
  Crown,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import { Language, tr } from '../i18n';
import { soundFX } from '../services/soundFX';
import { YARD300_BRAND_LOGO, handleImageError } from '../constants';
import { OwnerConfigService } from '../services/ownerConfigService';

import goldenDragonArt from '../src/assets/images/card_golden_dragon_1794697100851.jpg';
import crimsonMeteorArt from '../src/assets/images/card_crimson_meteor_1794697101889.jpg';
import medusaEmeraldArt from '../src/assets/images/card_medusa_emerald_1794697101547.jpg';
import waterGoddessArt from '../src/assets/images/card_water_goddess_1794697102754.jpg';

interface SubscriberTiersShowcaseProps {
  currentLang?: Language;
  onNavigateToClub?: () => void;
}

interface TierCardModel {
  level: 1 | 2 | 3 | 4;
  roman: string;
  id: string;
  name: { en: string; es: string; fr: string; ar: string };
  mythicTag: { en: string; es: string; fr: string; ar: string };
  subtitle: { en: string; es: string; fr: string; ar: string };
  accentHex: string;
  glowHex: string;
  artwork: string;
  artworkAlt: string;
  yardxTokens: string;
  serialPrefix: string;
  privileges: { en: string[]; es: string[]; fr: string[]; ar: string[] };
  oath: { en: string; es: string; fr: string; ar: string };
}

const TIERS: TierCardModel[] = [
  {
    level: 1,
    roman: 'TIER I',
    id: 'golden-dragon',
    name: {
      en: 'GOLDEN DRAGON',
      es: 'DRAGÓN DORADO',
      fr: 'DRAGON D’OR',
      ar: 'التنين الذهبي'
    },
    mythicTag: {
      en: 'Obsidian · 24K Dragon Gold',
      es: 'Obsidiana · Oro Dragón 24K',
      fr: 'Obsidienne · Or Dragon 24K',
      ar: 'أسود أوبسيديان · ذهب عيار 24'
    },
    subtitle: {
      en: 'Foundational Conditioning & Biometric Ledger',
      es: 'Acondicionamiento Base y Registro Biométrico',
      fr: 'Conditionnement Fondamental & Registre Biométrique',
      ar: 'التأسيس البدني والسجل البيومتري الموثق'
    },
    accentHex: '#D4AF37',
    glowHex: 'rgba(212, 175, 55, 0.32)',
    artwork: goldenDragonArt,
    artworkAlt: 'Black Obsidian Card with Golden Dragon Crest',
    yardxTokens: '4,200 YARDX',
    serialPrefix: 'GD-100',
    privileges: {
      en: [
        'Official YARD 300 Verified Digital Identity & Biometric Ledger',
        'Welcome Grant of 4,200 YARDX Athletic Utility Tokens',
        'Full Access to Level 1 Calisthenics & Mobility Library',
        'Weekly Qualification on the Global Combat Leaderboard',
        'Obsidian & 24K Gold Dragon Collector Pass Edition'
      ],
      es: [
        'Identidad Digital Verificada YARD 300 y Registro Biométrico',
        'Asignación Inicial de 4,200 Tokens Atléticos YARDX',
        'Acceso Completo a Biblioteca de Calistenia y Movilidad Nivel 1',
        'Clasificación Semanal en el Ranking Mundial de Combate',
        'Edición de Coleccionista Obsidiana y Oro 24K'
      ],
      fr: [
        'Identité Numérique Vérifiée YARD 300 & Registre Biométrique',
        'Dotation de Bienvenue de 4 200 Jetons Athlétiques YARDX',
        'Accès Complet à la Bibliothèque Callisthénie & Mobilité Niveau 1',
        'Qualification Hebdomadaire au Classement Mondial de Combat',
        'Édition Collector Obsidienne & Or Dragon 24K'
      ],
      ar: [
        'هوية YARD 300 الرقمية المعتمدة وسجل بيومتري دائم للأداء',
        'منحة ترحيبية فورية بقيمة 4,200 عملة YARDX الرياضية',
        'وصول كامل لمكتبة التأسيس البدني والمرونة الحركية',
        'التأهل الأسبوعي في قائمة المتصدرين العالمية للأبطال',
        'إصدار التنين الذهبي على قاعدة سوداء مطفية مرقمة'
      ]
    },
    oath: {
      en: 'Precision and patience forge sovereign gold under pressure.',
      es: 'La precisión y la paciencia forjan oro soberano bajo presión.',
      fr: 'La précision et la patience forgent l’or souverain sous pression.',
      ar: 'الانضباط والصبر يصنعان القوة الذهبية قبل أن تبدأ المواجهة.'
    }
  },
  {
    level: 2,
    roman: 'TIER II',
    id: 'crimson-meteor',
    name: {
      en: 'CRIMSON METEOR',
      es: 'METEORO CARMESÍ',
      fr: 'MÉTÉORE POURPRE',
      ar: 'النيزك الأحمر'
    },
    mythicTag: {
      en: 'Obsidian · Crimson Impact',
      es: 'Obsidiana · Impacto Carmesí',
      fr: 'Obsidienne · Impact Pourpre',
      ar: 'أسود أوبسيديان · نيزك أحمر متوهج'
    },
    subtitle: {
      en: 'Explosive Velocity, ACWR Shield & Arena Priority',
      es: 'Velocidad Explosiva, Escudo ACWR y Prioridad Arena',
      fr: 'Vélocité Explosive, Bouclier ACWR & Priorité Arène',
      ar: 'السرعة الانفجارية، درع الإصابات وأولوية الحلبة'
    },
    accentHex: '#EF4444',
    glowHex: 'rgba(239, 68, 68, 0.35)',
    artwork: crimsonMeteorArt,
    artworkAlt: 'Black Obsidian Card with Crimson Red Meteor Impact',
    yardxTokens: '7,450 YARDX',
    serialPrefix: 'CM-200',
    privileges: {
      en: [
        'All Tier I Privileges + Continuous ACWR & Sleep Debt Risk Alerts',
        'Allocation of 7,450 YARDX Tokens + 2x Challenge Multiplier',
        'Unrestricted Access to Hyrox Velocity & Sand Combat Drills',
        'Priority Ringside Ticket Allocation for World Tour Events',
        'Crimson Meteor Impact Edition Serialized Credential'
      ],
      es: [
        'Todos los privilegios Nivel I + Alertas Continuas ACWR y Sueño',
        'Asignación de 7,450 Tokens YARDX + Multiplicador 2x en Retos',
        'Acceso Total a Velocidad Hyrox y Entrenamiento en Arena',
        'Prioridad en Entradas Ringside del Tour Mundial',
        'Credencial Serializada Edición Meteoro Carmesí'
      ],
      fr: [
        'Tous les privilèges Niveau I + Alertes ACWR & Dette de Sommeil',
        'Allocation de 7 450 Jetons YARDX + Multiplicateur Défis 2x',
        'Accès Illimité aux Programmes Vélocité Hyrox & Sable',
        'Priorité Billets Ringside pour la Tournée Mondiale',
        'Accréditation Numérotée Édition Météore Pourpre'
      ],
      ar: [
        'جميع مزايا المستوى الأول + تنبيهات خوارزمية الإصابات والنوم المباشرة',
        'رصيد 7,450 عملة YARDX مع مضاعف 2x في التحديات',
        'دخول كامل لبرامج السرعة والهايروكس وتمارين الرمال القتالية',
        'أولوية حجز تذاكر الصفوف الأولى لبطولات YARD العالمية',
        'إصدار النيزك الأحمر المتوهج بواجهة قتالية سوداء'
      ]
    },
    oath: {
      en: 'Strike with meteoric force; never waste a single motion.',
      es: 'Golpea con fuerza meteórica; nunca desperdicies un movimiento.',
      fr: 'Frappe avec une force météorique ; ne gaspille aucun mouvement.',
      ar: 'اضرب بقوة النيزك وبدقة لا تهدر أي حركة في الميدان.'
    }
  },
  {
    level: 3,
    roman: 'TIER III',
    id: 'medusa-emerald',
    name: {
      en: 'MEDUSA POWER',
      es: 'PODER MEDUSA',
      fr: 'PUISSANCE MÉDUSE',
      ar: 'قوة الميدوسا'
    },
    mythicTag: {
      en: 'Obsidian · Emerald Medusa',
      es: 'Obsidiana · Medusa Esmeralda',
      fr: 'Obsidienne · Méduse Émeraude',
      ar: 'أسود أوبسيديان · ميدوسا الزمردية'
    },
    subtitle: {
      en: 'Private Club Ownership Key & AI Recovery Lab',
      es: 'Licencia de Club Privado y Laboratorio IA',
      fr: 'Licence Club Privé & Laboratoire Récupération IA',
      ar: 'مفتاح ملكية النادي الخاص وبروتوكول الاستشفاء الذكي'
    },
    accentHex: '#10B981',
    glowHex: 'rgba(16, 185, 129, 0.35)',
    artwork: medusaEmeraldArt,
    artworkAlt: 'Black Obsidian Card with Emerald Green Medusa Crest',
    yardxTokens: '9,120 YARDX',
    serialPrefix: 'MP-300',
    privileges: {
      en: [
        'Full Private Athletic Club Ownership License (Custom Name & Squad)',
        'Broadcast 24-Hour Training Stories & Daily Member Combat Drills',
        'Direct Invite URL & QR Matrix to Recruit Global Squad Members',
        'Staked Allocation of 9,120 YARDX Utility Tokens',
        'Emerald Medusa Basalt Edition with Encrypted NFC Key'
      ],
      es: [
        'Licencia Completa de Club Atlético Privado (Nombre y Escuadrón)',
        'Emisión de Stories 24h y Rutinas Diarias para Miembros',
        'Enlace Directo y Matriz QR para Reclutar Miembros Globales',
        'Asignación Bloqueada de 9,120 Tokens YARDX',
        'Edición Basalto Medusa Esmeralda con Llave NFC Cifrada'
      ],
      fr: [
        'Licence Complète de Club Athlétique Privé (Nom & Équipe)',
        'Diffusion Stories 24h & Séances Quotidiennes des Membres',
        'Lien d’Invitation Direct & Matrice QR pour Recruter Partout',
        'Allocation Stakée de 9 120 Jetons YARDX',
        'Édition Basalte Méduse Émeraude avec Clé NFC Chiffrée'
      ],
      ar: [
        'ترخيص كامل لامتلاك ناديك الرياضي الخاص (اسم، شعار وألوان مخصصة)',
        'بث ستوريات التمارين اليومية لمدة 24 ساعة وجدولة تحديات الأعضاء',
        'رابط دعوة مباشر ورمز QR لضم متابعين من داخل وخارج المنصة',
        'رصيد موثق بقيمة 9,120 عملة YARDX مدمج في المحفظة',
        'إصدار قوة الميدوسا الأخضر الزمردي مع شريحة NFC مشفرة'
      ]
    },
    oath: {
      en: 'Command the arena with unwavering focus that freezes all doubt.',
      es: 'Domina la arena con una concentración que congela toda duda.',
      fr: 'Domine l’arène avec une concentration absolue qui fige tout doute.',
      ar: 'امتلك زمام الميدان بتركيز صلب يجمّد كل تردد أمامك.'
    }
  },
  {
    level: 4,
    roman: 'TIER IV',
    id: 'water-goddess',
    name: {
      en: 'WATER GODDESS',
      es: 'DIOSA DEL AGUA',
      fr: 'DÉESSE DE L’EAU',
      ar: 'إلهة الماء'
    },
    mythicTag: {
      en: 'Obsidian · Azure Sovereign',
      es: 'Obsidiana · Azul Soberano',
      fr: 'Obsidienne · Azur Souverain',
      ar: 'أسود أوبسيديان · إلهة الماء الزرقاء'
    },
    subtitle: {
      en: 'Bazaruto Sanctuary Concierge, Camps VIP & Sovereign Seal',
      es: 'Concierge Santuario Bazaruto, Campamentos VIP y Sello Soberano',
      fr: 'Conciergerie Sanctuaire Bazaruto, Camps VIP & Sceau Souverain',
      ar: 'كونسيرج منتجع بازاروتو، معسكرات يارد والعضوية السيادية'
    },
    accentHex: '#38BDF8',
    glowHex: 'rgba(56, 189, 248, 0.38)',
    artwork: waterGoddessArt,
    artworkAlt: 'Black Obsidian Card with Azure Water Goddess',
    yardxTokens: '9,999 YARDX',
    serialPrefix: 'WG-001',
    privileges: {
      en: [
        'Priority Villa & Suite Reservation for Bazaruto Island Sanctuary (Oct 2027)',
        'Guaranteed Invitation Slot in YARD 300 Global Expedition Camps (300 Cap)',
        'Maximum 9,999 YARDX Sovereign Allocation + All Custom Club Rights',
        'Lifetime VIP Access to Global Events & Next-Gen Gear Council',
        'Abyssal Azure Water Goddess Edition (Serialized X / 300)'
      ],
      es: [
        'Reserva Prioritaria de Villas en Santuario Bazaruto (Oct 2027)',
        'Plaza Garantizada en Campamentos Globales YARD 300 (Máx. 300)',
        'Máxima Asignación Soberana de 9,999 YARDX + Derechos de Club',
        'Acceso VIP Vitalicio a Eventos Mundiales y Consejo de Diseño',
        'Edición Azul Abisal Diosa del Agua (Numerada X / 300)'
      ],
      fr: [
        'Réservation Prioritaire Villas au Sanctuaire Bazaruto (Oct 2027)',
        'Place Garantie aux Camps d’Expédition YARD 300 (Cap 300)',
        'Allocation Souveraine Maximale 9 999 YARDX + Droits Club',
        'Accès VIP à Vie aux Événements Mondiaux & Conseil Équipement',
        'Édition Azur Abyssal Déesse de l’Eau (Numérotée X / 300)'
      ],
      ar: [
        'أولوية الكونسيرج لحجز الفيلل والأجنحة الملكية في جزيرة بازاروتو (أكتوبر 2027)',
        'مقعد أولوية مضمون في معسكرات يارد 300 الدولية المغلقة (سعة 300 فقط)',
        'أعلى تخصيص بقيمة 9,999 عملة YARDX سيادية + جميع صلاحيات النادي الخاص',
        'دخول VIP مدى الحياة لجميع البطولات والمشاركة في تصميم الإصدارات القادمة',
        'إصدار إلهة الماء الأزرق على معدن أسود فاحم مرقم من 300 نسخة فقط'
      ]
    },
    oath: {
      en: 'Boundless like the ocean; serene in stillness, unstoppable in motion.',
      es: 'Sin límites como el océano; serena en calma, imparable en acción.',
      fr: 'Sans limites comme l’océan ; sereine au calme, imparable en mouvement.',
      ar: 'بلا حدود كالمحيط؛ هدوء مطلق في السكون وقوة لا تُقهر عند الحركة.'
    }
  }
];

const DISCIPLINES = ['HYROX PRO', 'COMBAT BOXING', 'REFORMER PILATES', 'ENDURANCE'];

export const SubscriberTiersShowcase: React.FC<SubscriberTiersShowcaseProps> = ({
  currentLang = 'en',
  onNavigateToClub
}) => {
  const isAr = currentLang === 'ar';
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4>(1);
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({});
  const [athleteName, setAthleteName] = useState<string>('YAM SUW');
  const [discipline, setDiscipline] = useState<string>('COMBAT BOXING');
  const [serialSuffix, setSerialSuffix] = useState<string>('001/300');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [showPrivilegesModal, setShowPrivilegesModal] = useState<boolean>(false);
  const [activatedLevels, setActivatedLevels] = useState<Record<number, boolean>>({});
  const [clubFee, setClubFee] = useState<number>(
    () => OwnerConfigService.getConfig().siteSettings?.clubMembershipPrice ?? 30
  );

  useEffect(() => {
    return OwnerConfigService.subscribe((cfg) => {
      setClubFee(cfg.siteSettings?.clubMembershipPrice ?? 30);
    });
  }, []);

  const getTierText = (obj: { en: string; es: string; fr: string; ar: string }) =>
    tr(currentLang, obj);

  const getTierPrivileges = (privs: { en: string[]; es: string[]; fr: string[]; ar: string[] }) => {
    if (currentLang === 'ar') return privs.ar;
    if (currentLang === 'es') return privs.es;
    if (currentLang === 'fr') return privs.fr;
    return privs.en;
  };

  const activeTier = TIERS.find((t) => t.level === selectedLevel) || TIERS[0];
  const fullSerial = `${activeTier.serialPrefix}-${serialSuffix}`;
  const isSubscribed = Boolean(activatedLevels[activeTier.level]);

  const handleSelectTier = (lvl: 1 | 2 | 3 | 4) => {
    soundFX.playButtonClick();
    setSelectedLevel(lvl);
  };

  const handleToggleFlip = (lvl: 1 | 2 | 3 | 4, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundFX.playButtonClick();
    setSelectedLevel(lvl);
    setFlippedMap((prev) => ({ ...prev, [lvl]: !prev[lvl] }));
  };

  const handleRandomizeSerial = () => {
    soundFX.playButtonClick();
    const num = String(Math.floor(Math.random() * 299) + 1).padStart(3, '0');
    setSerialSuffix(`${num}/300`);
  };

  const handleDownloadCardImage = async (tierToExport: TierCardModel = activeTier) => {
    soundFX.playButtonClick();
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1012;
      canvas.height = 638;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#050507';
        ctx.fillRect(0, 0, 1012, 638);

        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            ctx.globalAlpha = 0.78;
            ctx.drawImage(img, 0, 0, 1012, 638);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = tierToExport.artwork;
        });

        const scrim = ctx.createLinearGradient(0, 0, 1012, 638);
        scrim.addColorStop(0, 'rgba(5, 5, 7, 0.85)');
        scrim.addColorStop(0.55, 'rgba(5, 5, 7, 0.45)');
        scrim.addColorStop(1, 'rgba(5, 5, 7, 0.88)');
        ctx.fillStyle = scrim;
        ctx.fillRect(0, 0, 1012, 638);

        ctx.strokeStyle = tierToExport.accentHex;
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, 972, 598);

        ctx.fillStyle = tierToExport.accentHex;
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`YARD 300 · ${tierToExport.roman}`, 52, 74);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText(tierToExport.name.en, 52, 128);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '19px sans-serif';
        ctx.fillText(tierToExport.mythicTag.en, 52, 162);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 34px monospace';
        ctx.fillText(athleteName || 'YARD ATHLETE', 52, 524);

        ctx.fillStyle = tierToExport.accentHex;
        ctx.font = 'bold 22px monospace';
        ctx.fillText(`${tierToExport.serialPrefix}-${serialSuffix}`, 52, 562);

        ctx.textAlign = 'right';
        ctx.fillStyle = tierToExport.accentHex;
        ctx.font = 'bold 28px monospace';
        ctx.fillText(tierToExport.yardxTokens, 956, 524);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '20px monospace';
        ctx.fillText(discipline, 956, 562);

        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `YARD300_${tierToExport.id}_${(athleteName || 'PASS').replace(/\s+/g, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      soundFX.playSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopySerial = () => {
    soundFX.playButtonClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullSerial).catch(() => {});
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2200);
  };

  return (
    <section
      id="subscriber-tiers"
      className={`py-5 sm:py-6 px-3 sm:px-5 md:px-6 max-w-[1440px] mx-auto relative overflow-hidden ${
        isAr ? 'text-right' : 'text-left'
      }`}
    >
      {/* Compact Header */}
      <div className="max-w-2xl mx-auto text-center mb-5 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em]">
          <Crown className="w-3 h-3" />
          <span>
            {tr(currentLang, {
              en: 'OBSIDIAN BLACK CREDENTIALS · 4 MYTHIC EDITIONS',
              es: 'CREDENCIALES NEGRO OBSIDIANA · 4 EDICIONES',
              fr: 'ACCRÉDITATIONS NOIR OBSIDIENNE · 4 ÉDITIONS',
              ar: 'بطاقات العضوية السوداء · 4 مستويات أسطورية مستقلة'
            })}
          </span>
        </div>

        <h2
          className="text-2xl md:text-3xl font-extrabold text-white tracking-tight"
          style={{ textWrap: 'balance' }}
        >
          {tr(currentLang, {
            en: 'YARD 300 ',
            es: 'SERIE ',
            fr: 'SÉRIE ',
            ar: 'بطاقات المشتركين '
          })}
          <span className="text-[#D4AF37]">
            {tr(currentLang, {
              en: 'OBSIDIAN SERIES',
              es: 'OBSIDIANA YARD 300',
              fr: 'OBSIDIENNE YARD 300',
              ar: 'الرباعية السوداء'
            })}
          </span>
        </h2>

        <p className="text-[11px] md:text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          {tr(currentLang, {
            en: 'Four matte obsidian membership cards: Golden Dragon, Crimson Meteor, Emerald Medusa, and Azure Water Goddess.',
            es: 'Cuatro tarjetas negro obsidiana: Dragón Dorado, Meteoro Carmesí, Medusa Esmeralda y Diosa del Agua.',
            fr: 'Quatre cartes noir obsidienne : Dragon d’Or, Météore Pourpre, Méduse Émeraude et Déesse de l’Eau.',
            ar: 'أربع بطاقات باللون الأسود الفاحم بتصاميم مستقلة: التنين الذهبي، النيزك الأحمر، قوة الميدوسا، وإلهة الماء.'
          })}
        </p>
      </div>

      {/* The 4 Compact Obsidian Black Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-5">
        {TIERS.map((tier) => {
          const isSelected = selectedLevel === tier.level;
          const isCardFlipped = Boolean(flippedMap[tier.level]);
          const cardSerial = `${tier.serialPrefix}-${serialSuffix}`;
          const cardActive = Boolean(activatedLevels[tier.level]);

          return (
            <div key={tier.id} className="flex flex-col gap-2">
              {/* Compact Pitch-Black Physical Card (1.68:1 Ratio for sleek profile) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelectTier(tier.level)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectTier(tier.level);
                  }
                }}
                className={`group relative w-full aspect-[1.68/1] rounded-xl overflow-hidden bg-[#050507] border transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? '-translate-y-0.5 ring-1 ring-offset-1 ring-offset-[#07080C]'
                    : 'border-white/[0.12] hover:border-white/30'
                }`}
                style={{
                  borderColor: isSelected ? tier.accentHex : undefined,
                  boxShadow: isSelected
                    ? `0 16px 32px -12px ${tier.glowHex}`
                    : '0 10px 22px -10px rgba(0,0,0,0.8)'
                }}
              >
                <img
                  src={tier.artwork}
                  alt={tier.artworkAlt}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${
                    isCardFlipped ? 'opacity-20 scale-105' : 'opacity-85 group-hover:scale-[1.03]'
                  }`}
                />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: isCardFlipped
                      ? 'linear-gradient(145deg, rgba(5,5,7,0.94), rgba(5,5,7,0.88))'
                      : 'linear-gradient(135deg, rgba(5,5,7,0.86) 0%, rgba(5,5,7,0.38) 52%, rgba(5,5,7,0.88) 100%)'
                  }}
                />

                <div
                  className="absolute inset-1.5 rounded-lg border pointer-events-none"
                  style={{ borderColor: `${tier.accentHex}44` }}
                />

                {!isCardFlipped ? (
                  <div className="relative z-10 h-full p-3.5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={YARD300_BRAND_LOGO}
                          alt="YARD 300"
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-6 h-6 rounded-md object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold text-white tracking-wide block leading-tight">
                            YARD 300
                          </span>
                          <span
                            className="text-[9px] font-mono font-bold tracking-wider uppercase block truncate"
                            style={{ color: tier.accentHex }}
                          >
                            {tier.roman} · {getTierText(tier.name)}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[9px] font-mono font-bold tabular-nums shrink-0 bg-black/75 px-1.5 py-0.5 rounded border"
                        style={{ color: tier.accentHex, borderColor: `${tier.accentHex}55` }}
                      >
                        {tier.yardxTokens}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-white/[0.14] flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block">
                          {discipline}
                        </span>
                        <span className="font-mono font-bold text-[11px] text-white tracking-[0.1em] uppercase truncate block">
                          {athleteName || 'YARD ATHLETE'}
                        </span>
                      </div>

                      <span
                        className="font-mono font-bold text-[10px] tabular-nums shrink-0"
                        style={{ color: tier.accentHex }}
                      >
                        {cardSerial}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 h-full p-3.5 flex flex-col justify-between">
                    <div className="-mx-3.5 -mt-1 h-6 bg-black/95 border-y border-white/15 flex items-center justify-between px-3.5 text-[9px] font-mono text-slate-400">
                      <span>{tier.roman} · NFC SEAL</span>
                      <span style={{ color: tier.accentHex }}>
                        {cardActive
                          ? tr(currentLang, { en: 'ACTIVE', es: 'ACTIVA', fr: 'ACTIVE', ar: 'مفعلة' })
                          : 'YARD300.CLUB'}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-200 text-center leading-relaxed px-1 my-auto">
                      “{getTierText(tier.oath)}”
                    </p>

                    <div className="pt-1.5 border-t border-white/[0.12] flex items-center justify-between text-[9px] font-mono text-slate-400 tabular-nums">
                      <span>{tier.yardxTokens}</span>
                      <span style={{ color: tier.accentHex }}>{cardSerial}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Tier Action Bar */}
              <div
                className={`rounded-xl p-2.5 bg-[#0A0B10] border transition-colors ${
                  isSelected ? 'border-white/25' : 'border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold text-white truncate">
                      {getTierText(tier.name)}
                    </h3>
                    <span className="text-[9px] font-mono text-slate-400 block truncate">
                      {getTierText(tier.mythicTag)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFlip(tier.level, e)}
                    title={tr(currentLang, { en: 'Flip Card', es: 'Voltear', fr: 'Retourner', ar: 'اقلب البطاقة' })}
                    className="p-1.5 rounded-lg bg-[#12141E] hover:bg-[#1B1F2E] border border-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <RotateCw className="w-3 h-3" style={{ color: tier.accentHex }} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playStartTrainingSound();
                      setSelectedLevel(tier.level);
                      setActivatedLevels((prev) => ({ ...prev, [tier.level]: true }));
                      setShowPrivilegesModal(true);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold text-black transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
                    style={{ backgroundColor: tier.accentHex }}
                  >
                    {cardActive
                      ? tr(currentLang, { en: 'Active · View', es: 'Activa · Ver', fr: 'Active · Voir', ar: 'مفعلة · المزايا' })
                      : tr(currentLang, { en: 'Activate & View', es: 'Activar y Ver', fr: 'Activer & Voir', ar: 'تفعيل والمزايا' })}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLevel(tier.level);
                      handleDownloadCardImage(tier);
                    }}
                    disabled={downloading}
                    title={tr(currentLang, { en: 'Download PNG', es: 'Descargar PNG', fr: 'Télécharger PNG', ar: 'تنزيل PNG' })}
                    className="py-1.5 px-2 rounded-lg bg-[#12141E] hover:bg-[#1B1F2E] border border-white/[0.1] text-slate-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Download className="w-3 h-3" style={{ color: tier.accentHex }} />
                    <span>PNG</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Shared Engraver & Active Tier Privileges Bar */}
      <div className="bg-[#0A0B10] border border-white/[0.08] rounded-xl p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white">
              {tr(currentLang, {
                en: 'Engrave All 4 Black Cards Live',
                es: 'Grabar las 4 Tarjetas en Vivo',
                fr: 'Graver les 4 Cartes en Direct',
                ar: 'نقش وتخصيص البطاقات الأربع مباشرة'
              })}
            </span>
            <span className="text-[10px] font-mono tabular-nums" style={{ color: activeTier.accentHex }}>
              {getTierText(activeTier.name)} · {fullSerial}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              value={athleteName}
              onChange={(e) => setAthleteName(e.target.value.toUpperCase())}
              maxLength={20}
              placeholder="YAM SUW"
              aria-label={tr(currentLang, { en: 'Cardholder Name', es: 'Titular', fr: 'Titulaire', ar: 'الاسم المنقوش' })}
              className="w-full px-3 py-2 rounded-lg bg-[#12141E] border border-white/[0.12] text-white font-mono text-xs uppercase outline-none focus:border-[#D4AF37]"
            />

            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              aria-label={tr(currentLang, { en: 'Discipline', es: 'Disciplina', fr: 'Discipline', ar: 'التخصص' })}
              className="w-full px-3 py-2 rounded-lg bg-[#12141E] border border-white/[0.12] text-white font-mono text-xs outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadCardImage(activeTier)}
              disabled={downloading}
              className="py-1.5 px-3 rounded-lg bg-[#12141E] hover:bg-[#1B1F2E] border border-white/[0.12] text-slate-200 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3" style={{ color: activeTier.accentHex }} />
              <span>
                {downloadSuccess
                  ? tr(currentLang, { en: 'Saved PNG', es: 'PNG Guardado', fr: 'PNG Enregistré', ar: 'تم الحفظ PNG' })
                  : tr(currentLang, { en: 'Export Selected PNG', es: 'Exportar PNG', fr: 'Exporter PNG', ar: 'حفظ المحددة PNG' })}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopySerial}
              className="py-1.5 px-3 rounded-lg bg-[#12141E] hover:bg-[#1B1F2E] border border-white/[0.12] text-slate-200 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Check className={`w-3 h-3 ${copiedId ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>
                {copiedId
                  ? tr(currentLang, { en: 'Copied', es: 'Copiado', fr: 'Copié', ar: 'تم النسخ' })
                  : tr(currentLang, { en: 'Copy Serial', es: 'Copiar Serie', fr: 'Copier Série', ar: 'نسخ التسلسلي' })}
              </span>
            </button>

            <button
              type="button"
              onClick={handleRandomizeSerial}
              className="py-1.5 px-3 rounded-lg bg-[#12141E] hover:bg-[#1B1F2E] border border-white/[0.12] text-slate-200 text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>{tr(currentLang, { en: 'New Serial', es: 'Nueva Serie', fr: 'Nouvelle Série', ar: 'رقم تسلسلي جديد' })}</span>
            </button>
          </div>
        </div>

        {/* Right: Concise Active Tier Privileges & Actions */}
        <div className="lg:col-span-6 space-y-2 border-t lg:border-t-0 lg:border-s border-white/[0.08] pt-3 lg:pt-0 lg:ps-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white">
              {getTierText(activeTier.name)}{' '}
              {tr(currentLang, { en: 'Privileges', es: '· Privilegios', fr: '· Privilèges', ar: '· المزايا' })}
            </span>
            <button
              type="button"
              onClick={() => {
                soundFX.playButtonClick();
                setShowPrivilegesModal(true);
              }}
              className="text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
              style={{ color: activeTier.accentHex }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{tr(currentLang, { en: 'Full Certificate', es: 'Certificado', fr: 'Certificat', ar: 'الشهادة الكاملة' })}</span>
            </button>
          </div>

          <ul className="space-y-1">
            {getTierPrivileges(activeTier.privileges).slice(0, 3).map((priv, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: activeTier.accentHex }} />
                <span>{priv}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                soundFX.playStartTrainingSound();
                setActivatedLevels((prev) => ({ ...prev, [activeTier.level]: true }));
                setShowPrivilegesModal(true);
              }}
              className="py-2 px-3.5 rounded-lg text-black font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: activeTier.accentHex }}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>
                {isSubscribed
                  ? tr(currentLang, { en: 'Credential Active', es: 'Credencial Activa', fr: 'Accréditation Active', ar: 'البطاقة مفعلة' })
                  : `${tr(currentLang, { en: 'Activate', es: 'Activar', fr: 'Activer', ar: 'تفعيل' })} ${getTierText(activeTier.name)}`}
              </span>
            </button>

            {activeTier.level >= 3 && onNavigateToClub && (
              <button
                type="button"
                onClick={onNavigateToClub}
                className="py-2 px-3.5 rounded-lg bg-[#12141E] hover:bg-[#1A1D2B] border border-white/[0.15] text-white font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition-colors tabular-nums"
              >
                <span>
                  {tr(currentLang, {
                    en: `Launch Private Club ($${clubFee})`,
                    es: `Abrir Club Privado ($${clubFee})`,
                    fr: `Lancer Club Privé ($${clubFee})`,
                    ar: `نادي خاص مدمج ($${clubFee})`
                  })}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: activeTier.accentHex }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Certificate / Activation Modal */}
      {showPrivilegesModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0B10] border border-white/[0.14] rounded-2xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowPrivilegesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-[#141724] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span
                className="text-[10px] font-mono uppercase tracking-widest block tabular-nums"
                style={{ color: activeTier.accentHex }}
              >
                {activeTier.roman} · {fullSerial}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {getTierText(activeTier.name)}
              </h3>
              <p className="text-xs text-slate-400">
                {tr(currentLang, {
                  en: `Authorized Holder: ${athleteName}`,
                  es: `Titular Autorizado: ${athleteName}`,
                  fr: `Titulaire Autorisé : ${athleteName}`,
                  ar: `حامل البطاقة: ${athleteName}`
                })}
              </p>
            </div>

            <div className="space-y-2">
              {getTierPrivileges(activeTier.privileges).map((priv, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#121520] border border-white/[0.06] text-xs text-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: activeTier.accentHex }} />
                  <span>{priv}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              <span className="text-xs font-mono tabular-nums text-slate-400">{activeTier.yardxTokens}</span>
              <button
                type="button"
                onClick={() => {
                  soundFX.playSuccess();
                  setActivatedLevels((prev) => ({ ...prev, [activeTier.level]: true }));
                  setShowPrivilegesModal(false);
                }}
                className="px-4 py-2 rounded-lg text-black font-bold text-xs cursor-pointer"
                style={{ backgroundColor: activeTier.accentHex }}
              >
                {tr(currentLang, {
                  en: 'Confirm & Save Credential',
                  es: 'Confirmar y Guardar',
                  fr: 'Confirmer & Enregistrer',
                  ar: 'تأكيد واعتماد البطاقة'
                })}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default SubscriberTiersShowcase;
