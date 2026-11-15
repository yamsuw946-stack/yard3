/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Language, tr } from '../i18n';
import { handleImageError, YARD300_BRAND_LOGO } from '../constants';
import { OwnerConfigService } from '../services/ownerConfigService';
import { Check, Zap, Sparkles } from 'lucide-react';
import { soundFX } from '../services/soundFX';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  currentLang?: Language;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const [configVersion, setConfigVersion] = useState(0);

  useEffect(() => {
    return OwnerConfigService.subscribe(() => setConfigVersion((v) => v + 1));
  }, []);

  const currentProduct = useMemo(() => {
    const list = OwnerConfigService.getConfiguredProducts(currentLang, true);
    return list.find((p) => p.id === product.id) || product;
  }, [product, currentLang, configVersion]);

  const [selectedSize, setSelectedSize] = useState<string>('M-HERO');
  const sizes = ['S-RANK', 'M-HERO', 'L-TITAN'];
  const showSizes = currentProduct.category === 'Wearable' || currentProduct.category === 'Apparel';

  const colors = currentProduct.colors || [
    {
      id: 'black',
      nameEn: tr(currentLang, { en: 'Obsidian Black', es: 'Negro Obsidiana', fr: 'Noir Obsidienne', ar: 'الأسود الليلي' }),
      nameAr: 'الأسود الليلي',
      hex: '#0D0E12',
      textColor: '#FFFFFF'
    },
    {
      id: 'white',
      nameEn: tr(currentLang, { en: 'Pearl White', es: 'Blanco Perla', fr: 'Blanc Perle', ar: 'الأبيض النقي' }),
      nameAr: 'الأبيض النقي',
      hex: '#F8F9FA',
      textColor: '#000000'
    }
  ];

  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>(product.selectedGender || 'men');
  const [selectedColorId, setSelectedColorId] = useState<string>(
    product.selectedColor || (product.selectedGender === 'women' ? 'white' : 'black')
  );

  useEffect(() => {
    if (product.selectedGender) {
      setSelectedGender(product.selectedGender);
      setSelectedColorId(product.selectedColor || (product.selectedGender === 'women' ? 'white' : 'black'));
    }
  }, [product.id, product.selectedGender, product.selectedColor]);

  const activeColor = colors.find((c) => c.id === selectedColorId) || colors[0];
  const heroImage = currentProduct.isWomenOnly
    ? (selectedColorId === 'black' ? (currentProduct.menImageUrl || activeColor?.imageUrl) : (currentProduct.womenImageUrl || activeColor?.imageUrl))
    : currentProduct.isUnisex
    ? (selectedColorId === 'white' ? (currentProduct.womenImageUrl || activeColor?.imageUrl) : (currentProduct.menImageUrl || activeColor?.imageUrl))
    : (selectedGender === 'women' || selectedColorId === 'white')
    ? (currentProduct.womenImageUrl || activeColor?.imageUrl || currentProduct.imageUrl)
    : (currentProduct.menImageUrl || activeColor?.imageUrl || currentProduct.imageUrl);

  const categoryLabel = useMemo(() => {
    switch (currentProduct.category) {
      case 'Audio':
        return tr(currentLang, { en: 'AUDIO & FOCUS', es: 'AUDIO Y ENFOQUE', fr: 'AUDIO & FOCUS', ar: 'الصوتيات والتركيز' });
      case 'Wearable':
        return tr(currentLang, { en: 'BIOMETRIC WEARABLE', es: 'TECNOLOGÍA BIOMÉTRICA', fr: 'CAPTEUR BIOMÉTRIQUE', ar: 'العتاد الحركي والمستشعرات' });
      case 'Apparel':
        return tr(currentLang, { en: 'PERFORMANCE APPAREL', es: 'INDUMENTARIA TÉCNICA', fr: 'TEXTILE PERFORMANCE', ar: 'الملابس الرياضية الفاخرة' });
      case 'Equipment':
        return tr(currentLang, { en: 'COMBAT EQUIPMENT', es: 'EQUIPO DE COMBATE', fr: 'ÉQUIPEMENT COMBAT', ar: 'المعدات القتالية' });
      case 'Accessories':
        return tr(currentLang, { en: 'ACCESSORIES', es: 'ACCESORIOS', fr: 'ACCESSOIRES', ar: 'الإكسسوارات' });
      case 'Home':
        return tr(currentLang, { en: 'HYDRATION & RECOVERY', es: 'HIDRATACIÓN Y RECUPERACIÓN', fr: 'HYDRATATION & RÉCUPÉRATION', ar: 'أجهزة الاستشفاء والترطيب' });
      case 'Footwear':
        return tr(currentLang, { en: 'FOOTWEAR', es: 'CALZADO', fr: 'CHAUSSURES', ar: 'أحذية الركض' });
      default:
        return currentProduct.category.toUpperCase();
    }
  }, [currentProduct.category, currentLang]);

  const handleAddToCartClick = () => {
    soundFX.playSuccess();
    onAddToCart({
      ...currentProduct,
      selectedColor: selectedColorId,
      selectedGender: selectedGender,
      size: selectedSize
    });
  };

  return (
    <div className={`pt-28 min-h-screen bg-[#0A0B10] text-white ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#FFE600] transition-colors mb-10 cursor-pointer"
        >
          <span className="text-xl">{isAr ? '→' : '←'}</span>
          <span>
            {tr(currentLang, {
              en: 'Back to Gear Store',
              es: 'Volver a la Tienda de Equipamiento',
              fr: 'Retour à la Boutique Officielle',
              ar: 'العودة إلى متجر عتاد الأبطال'
            })}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Artwork */}
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-square bg-[#12131C] rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl relative group">
              <img
                src={heroImage}
                alt={currentProduct.name}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-[#0A0B10]/90 text-xs font-black text-[#FFE600] font-anime shadow-lg">
                {tr(currentLang, {
                  en: '⚡ OFFICIAL CHAMPION GEAR',
                  es: '⚡ EQUIPO OFICIAL DE CAMPEONES',
                  fr: '⚡ ÉQUIPEMENT OFFICIEL CHAMPION',
                  ar: '⚡ عتاد الأبطال الرسمي'
                })}
              </div>

              <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md flex items-center gap-2 shadow-lg" dir="ltr">
                <img
                  src="/images/yard_red_black_white_logo.jpg"
                  alt="YARD 300 Logo"
                  className="w-4 h-4 rounded object-cover shadow-[0_0_6px_rgba(229,9,20,0.8)]"
                />
                <span className="text-xs font-black font-yard-brand tracking-wide text-white">
                  YARD<span className="text-[#E50914]">300</span> // AUTHENTIC
                </span>
              </div>
            </div>
          </div>

          {/* Right Specs & CTAs */}
          <div className="flex flex-col justify-center bg-[#12131C] p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#FFE600] uppercase tracking-widest font-anime">
                {tr(currentLang, { en: 'CATEGORY', es: 'CATEGORÍA', fr: 'CATÉGORIE', ar: 'القسم' })} // {categoryLabel}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0A0B10] border border-gray-700 text-[10px] font-black text-gray-300">
                {tr(currentLang, {
                  en: 'ATHLETIC GRADE',
                  es: 'CALIDAD CERTIFICADA',
                  fr: 'QUALITÉ CERTIFIÉE',
                  ar: 'جودة رياضية معتمدة'
                })}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black font-anime text-white leading-tight">
              {currentProduct.name}
            </h1>

            <p className="text-sm font-bold text-[#FFE600]">
              {currentProduct.tagline}
            </p>

            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-4xl font-black text-[#FFE600] font-mono tracking-tight neon-text-yellow tabular-nums" dir="ltr">
                ${currentProduct.price}
              </span>
              {currentProduct.originalPrice && (
                <>
                  <span className="text-xl line-through text-gray-500 font-mono tabular-nums" dir="ltr">
                    ${currentProduct.originalPrice}
                  </span>
                  <span className="text-xs font-black font-anime px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" dir="ltr">
                    -$20 OFF
                  </span>
                </>
              )}
              <span className="text-xs font-bold px-3 py-1 bg-[#1A1C28] text-gray-300 rounded-lg border border-gray-800">
                {tr(currentLang, {
                  en: 'Includes Tax & Priority Express Shipping ⚡',
                  es: 'Incluye Impuestos y Envío Exprés Prioritario ⚡',
                  fr: 'Taxes Incluses & Livraison Express Prioritaire ⚡',
                  ar: 'شامل الضريبة والشحن السريع ⚡'
                })}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0B10] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-[0_0_10px_rgba(255,230,0,0.2)] bg-black">
                <img
                  loading="lazy"
                  decoding="async"
                  src={YARD300_BRAND_LOGO}
                  alt="Official YARD 300 Emblem"
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs leading-relaxed">
                <span className="font-black text-[#FFE600] font-anime block">
                  {tr(currentLang, {
                    en: 'OFFICIAL YARD300 ATHLETIC GEAR',
                    es: 'EQUIPAMIENTO DEPORTIVO YARD300',
                    fr: 'ÉQUIPEMENT SPORTIF YARD300',
                    ar: 'عتاد YARD300 الرياضي الأصلي'
                  })}
                </span>
                <span className="text-gray-400 font-bold">
                  {tr(currentLang, {
                    en: 'Durable athletic-grade materials built for workout comfort and longevity.',
                    es: 'Materiales resistentes y transpirables para entrenar con comodidad.',
                    fr: 'Matériaux durables et respirants conçus pour le confort et la longévité.',
                    ar: 'خامات رياضية متينة وعملية مصممة للراحة وطول العمر.'
                  })}
                </span>
              </div>
            </div>

            {/* Gender / Edition Selection */}
            {currentProduct.isMenOnly ? (
              <div className="space-y-3 pt-2 pb-1">
                <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚔️</span>
                    <div>
                      <span className="text-xs font-black block font-anime text-[#00F0FF]">
                        {tr(currentLang, {
                          en: 'HYPER-EVOLVED TACTICAL CUT (MEN ONLY)',
                          es: 'CORTE TÁCTICO EVOLUCIONADO (SOLO HOMBRES)',
                          fr: 'COUPE TACTIQUE ÉVOLUÉE (HOMMES UNIQUEMENT)',
                          ar: 'إصدار تكتيكي فائق التطور (رجالي حصرياً)'
                        })}
                      </span>
                      <span className="text-[11px] text-gray-300 block font-bold">
                        {tr(currentLang, {
                          en: 'Engineered exclusively for male combat athletes.',
                          es: 'Diseñado exclusivamente para atletas masculinos.',
                          fr: 'Conçu exclusivement pour les athlètes masculins.',
                          ar: 'تمت هندسته خصيصاً للمقاتلين الأبطال.'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00F0FF] text-black text-[10px] font-black font-anime shrink-0">
                    {tr(currentLang, { en: 'MEN ONLY', es: 'SOLO HOMBRE', fr: 'HOMMES', ar: 'رجالي' })}
                  </span>
                </div>
              </div>
            ) : currentProduct.isWomenOnly ? (
              <div className="space-y-3 pt-2 pb-1">
                <div className="p-4 rounded-2xl bg-[#FF007A]/10 border border-[#FF007A]/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌸</span>
                    <div>
                      <span className="text-xs font-black block font-anime text-[#FF80BF]">
                        {tr(currentLang, {
                          en: 'EXCLUSIVE WOMEN’S COUTURE (WOMEN ONLY)',
                          es: 'EDICIÓN EXCLUSIVA FEMENINA (SOLO MUJERES)',
                          fr: 'ÉDITION COUTURE FÉMININE (FEMMES UNIQUEMENT)',
                          ar: 'إصدار نسائي حصري'
                        })}
                      </span>
                      <span className="text-[11px] text-gray-300 block font-bold">
                        {tr(currentLang, {
                          en: 'Available in Pearl White & Obsidian Black.',
                          es: 'Disponible en Blanco Perla y Negro Obsidiana.',
                          fr: 'Disponible en Blanc Perle et Noir Obsidienne.',
                          ar: 'متاح بلونين: الأبيض اللؤلؤي والأسود الليلي.'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FF007A] text-white text-[10px] font-black font-anime shrink-0">
                    {tr(currentLang, { en: 'WOMEN ONLY', es: 'SOLO MUJER', fr: 'FEMMES', ar: 'نسائي' })}
                  </span>
                </div>
              </div>
            ) : currentProduct.isUnisex ? (
              <div className="space-y-3 pt-2 pb-1">
                <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <span className="text-xs font-black block font-anime text-[#00F0FF]">
                        {tr(currentLang, {
                          en: 'UNIFIED EDITION (FOR ALL)',
                          es: 'EDICIÓN UNIFICADA (UNISEX)',
                          fr: 'ÉDITION UNIFIÉE (UNISEXE)',
                          ar: 'إصدار موحد للجميع'
                        })}
                      </span>
                      <span className="text-[11px] text-gray-300 block font-bold">
                        {tr(currentLang, {
                          en: 'Available in Carbon Black & Cyber Pearl White.',
                          es: 'Disponible en Negro Carbono y Blanco Perla.',
                          fr: 'Disponible en Noir Carbone et Blanc Perle.',
                          ar: 'متاح بالأسود الكربوني والأبيض اللؤلؤي.'
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00F0FF] text-black text-[10px] font-black font-anime shrink-0">
                    {tr(currentLang, { en: '2 COLORS', es: '2 COLORES', fr: '2 COLORIS', ar: 'لونان' })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase text-gray-300">
                    {tr(currentLang, {
                      en: 'SELECT EDITION (MEN / WOMEN):',
                      es: 'ELIGE EDICIÓN (HOMBRE / MUJER):',
                      fr: 'CHOISIR L’ÉDITION (HOMME / FEMME) :',
                      ar: 'اختر إصدار العتاد (رجالي / نسائي):'
                    })}
                  </span>
                  <span className="text-xs font-bold text-[#00F0FF]">
                    {selectedGender === 'men'
                      ? tr(currentLang, { en: 'Men’s Kinetic Fit ⚔️', es: 'Corte Hombre ⚔️', fr: 'Coupe Homme ⚔️', ar: 'إصدار رجالي ⚔️' })
                      : tr(currentLang, { en: 'Women’s Kinetic Fit 🌸', es: 'Corte Mujer 🌸', fr: 'Coupe Femme 🌸', ar: 'إصدار نسائي 🌸' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playButtonClick();
                      setSelectedGender('men');
                      setSelectedColorId('black');
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      selectedGender === 'men'
                        ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'border-gray-800 bg-[#0A0B10] text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">⚔️</span>
                      <div className="text-start">
                        <span className="text-xs font-black block font-anime">
                          {tr(currentLang, { en: 'MEN’S (BLACK)', es: 'HOMBRE (NEGRO)', fr: 'HOMME (NOIR)', ar: 'رجالي (أسود)' })}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-bold">
                          {tr(currentLang, { en: 'Athletic Combat Fit', es: 'Ajuste Atlético', fr: 'Coupe Athlétique', ar: 'قصة رياضية قتالية' })}
                        </span>
                      </div>
                    </div>
                    {selectedGender === 'men' && <Check className="w-4 h-4 text-[#00F0FF]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playButtonClick();
                      setSelectedGender('women');
                      setSelectedColorId('white');
                    }}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      selectedGender === 'women'
                        ? 'border-[#FF007A] bg-[#FF007A]/10 text-white shadow-[0_0_15px_rgba(255,0,122,0.25)]'
                        : 'border-gray-800 bg-[#0A0B10] text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🌸</span>
                      <div className="text-start">
                        <span className="text-xs font-black block font-anime">
                          {tr(currentLang, { en: 'WOMEN’S (WHITE)', es: 'MUJER (BLANCO)', fr: 'FEMME (BLANC)', ar: 'نسائي (أبيض)' })}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-bold">
                          {tr(currentLang, { en: 'Sculpted Couture Fit', es: 'Corte Ergonómico', fr: 'Coupe Sculptée', ar: 'قصة نحت مريحة' })}
                        </span>
                      </div>
                    </div>
                    {selectedGender === 'women' && <Check className="w-4 h-4 text-[#FF007A]" />}
                  </button>
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div className="space-y-3 pt-2 pb-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase text-gray-300">
                  {tr(currentLang, {
                    en: 'SELECT COLORWAY:',
                    es: 'ELIGE EL COLOR:',
                    fr: 'CHOISIR LE COLORIS :',
                    ar: 'اختر اللون:'
                  })}
                </span>
                <span className="text-xs font-bold text-[#FFE600]">
                  {isAr ? activeColor.nameAr : activeColor.nameEn}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {colors.map((col) => {
                  const isSelected = selectedColorId === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        setSelectedColorId(col.id);
                        if (col.id === 'white') {
                          setSelectedGender('women');
                        } else if (col.id === 'black') {
                          setSelectedGender('men');
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FFE600] bg-[#1A1D2E] shadow-[0_0_15px_rgba(255,230,0,0.25)]'
                          : 'border-gray-800 bg-[#0A0B10] hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full border border-gray-600 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div className="text-start">
                          <span className="text-xs font-black block text-white font-anime">
                            {isAr ? col.nameAr : col.nameEn}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#FFE600]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-gray-300 font-medium leading-relaxed text-sm md:text-base py-2">
              {currentProduct.longDescription || currentProduct.description}
            </p>

            {showSizes && (
              <div className="space-y-3">
                <span className="block text-xs font-black text-gray-300 uppercase">
                  {tr(currentLang, { en: 'SELECT SIZE:', es: 'ELIGE TALLA:', fr: 'CHOISIR LA TAILLE :', ar: 'اختر القياس:' })}
                </span>
                <div className="flex gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        soundFX.playButtonClick();
                        setSelectedSize(size);
                      }}
                      className={`px-5 py-3 rounded-xl font-black text-xs font-anime transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#FFE600] text-black border-2 border-[#FFE600] shadow-[0_0_15px_rgba(255,230,0,0.4)]'
                          : 'bg-[#1D1F30] text-gray-300 border border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-2">
              <button
                onClick={handleAddToCartClick}
                className="w-full py-4.5 bg-[#FFE600] hover:bg-white text-black font-black text-base font-anime rounded-2xl shadow-[0_0_25px_rgba(255,230,0,0.35)] transition-all duration-300 hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>
                  {tr(currentLang, {
                    en: `ADD TO CART — $${currentProduct.price}`,
                    es: `AÑADIR AL CARRITO — $${currentProduct.price}`,
                    fr: `AJOUTER AU PANIER — $${currentProduct.price}`,
                    ar: `إضافة للسلة — $${currentProduct.price}`
                  })}
                </span>
                <Zap className="w-5 h-5 fill-current" />
              </button>

              <div className="p-5 rounded-2xl bg-[#0A0B10] border border-gray-800 space-y-3">
                <h4 className="text-xs font-black text-[#FFE600] uppercase font-anime flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {tr(currentLang, {
                      en: 'S-RANK SPECIFICATIONS:',
                      es: 'ESPECIFICACIONES S-RANK:',
                      fr: 'SPÉCIFICATIONS S-RANK :',
                      ar: 'المواصفات الفنية المعتمدة:'
                    })}
                  </span>
                </h4>
                <ul className="space-y-2 text-xs font-bold text-gray-300">
                  {currentProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
