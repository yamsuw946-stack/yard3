/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Language, tr } from '../i18n';
import { handleImageError, getProducts, YARD300_BRAND_LOGO } from '../constants';
import { Check, Zap, Sparkles } from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { Yard300Logo } from './Yard300Logo';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  currentLang?: Language;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart, currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  const currentProduct = useMemo(() => {
    const list = getProducts(currentLang);
    return list.find(p => p.id === product.id) || product;
  }, [product, currentLang]);

  const [selectedSize, setSelectedSize] = useState<string>('M-HERO');
  const sizes = ['S-RANK', 'M-HERO', 'L-TITAN'];
  const showSizes = currentProduct.category === 'Wearable' || currentProduct.category === 'Apparel';

  const colors = currentProduct.colors || [
    { id: 'black', nameEn: 'Obsidian Black', nameAr: 'الأسود الليلي', hex: '#050807', textColor: '#FFFFFF' },
    { id: 'white', nameEn: 'Pearl White', nameAr: 'الأبيض النقي', hex: '#F8F9FA', textColor: '#000000' }
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

  const activeColor = colors.find(c => c.id === selectedColorId) || colors[0];
  const heroImage = currentProduct.isWomenOnly
    ? (selectedColorId === 'black' ? (currentProduct.menImageUrl || activeColor?.imageUrl) : (currentProduct.womenImageUrl || activeColor?.imageUrl))
    : currentProduct.isUnisex
    ? (selectedColorId === 'white' ? (currentProduct.womenImageUrl || activeColor?.imageUrl) : (currentProduct.menImageUrl || activeColor?.imageUrl))
    : (selectedGender === 'women' || selectedColorId === 'white')
    ? (currentProduct.womenImageUrl || activeColor?.imageUrl || currentProduct.imageUrl)
    : (currentProduct.menImageUrl || activeColor?.imageUrl || currentProduct.imageUrl);

  const categoryLabel = useMemo(() => {
    const map: Record<string, { en: string; es: string; fr: string; ar: string }> = {
      Audio: { en: 'AUDIO & FOCUS', es: 'AUDIO Y ENFOQUE', fr: 'AUDIO & FOCUS', ar: 'الصوتيات والتركيز' },
      Wearable: { en: 'BIOMETRIC WEARABLES', es: 'VESTIBLES BIOMÉTRICOS', fr: 'OBJETS BIOMÉTRIQUES', ar: 'العتاد الحركي والمستشعرات' },
      Apparel: { en: 'ELITE ATHLETIC APPAREL', es: 'ROPA ATLÉTICA DE ÉLITE', fr: 'TENUES ATHLÉTIQUES D’ÉLITE', ar: 'الملابس الرياضية الفاخرة' },
      Equipment: { en: 'COMBAT EQUIPMENT', es: 'EQUIPO DE COMBATE', fr: 'ÉQUIPEMENT DE COMBAT', ar: 'المعدات القتالية' },
      Accessories: { en: 'ACCESSORIES', es: 'ACCESORIOS', fr: 'ACCESSOIRES', ar: 'الإكسسوارات' },
      Home: { en: 'RECOVERY & HYDRATION', es: 'RECUPERACIÓN E HIDRATACIÓN', fr: 'RÉCUPÉRATION & HYDRATATION', ar: 'الاستشفاء والترطيب' },
      Footwear: { en: 'NITROGEN FOOTWEAR', es: 'CALZADO TÉCNICO', fr: 'CHAUSSURES DE COURSE', ar: 'أحذية الركض' }
    };
    const entry = map[currentProduct.category];
    return entry ? tr(currentLang, entry) : currentProduct.category.toUpperCase();
  }, [currentProduct.category, currentLang]);

  const getColorName = (col: { id: string; nameEn: string; nameAr: string }) => {
    if (isAr) return col.nameAr;
    if (col.id === 'black') {
      return tr(currentLang, { en: col.nameEn || 'Obsidian Black', es: 'Negro Obsidiana', fr: 'Noir Obsidienne' });
    }
    return tr(currentLang, { en: col.nameEn || 'Pearl White', es: 'Blanco Perla', fr: 'Blanc Perle' });
  };

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
    <div className={`pt-24 min-h-screen bg-[#050807] text-white ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-[1680px] mx-auto px-4 md:px-10 pb-20">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#080D0B] hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 text-xs font-black font-anime transition-all mb-8 cursor-pointer"
        >
          <span>{isAr ? '→' : '←'}</span>
          <span>
            {tr(currentLang, {
              en: 'Back to Gear Store',
              es: 'Volver a la Tienda YARD 300',
              fr: 'Retour à la Boutique YARD 300',
              ar: 'العودة إلى متجر عتاد الأبطال'
            })}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Left / Hero Product Artwork */}
          <div className="flex flex-col gap-5">
            <div className="w-full aspect-square bg-[#080D0B] border border-emerald-500/25 rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl relative group">
              <img 
                src={heroImage} 
                alt={currentProduct.name} 
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-[#050807]/90 border border-[#D4AF37]/40 text-xs font-black text-[#D4AF37] font-anime shadow-lg">
                ⚡ {tr(currentLang, {
                  en: '300 SERIALIZED EDITION',
                  es: 'EDICIÓN LIMITADA 300',
                  fr: 'ÉDITION LIMITÉE 300',
                  ar: 'إصدار محدود 300 قطعة'
                })}
              </div>

              <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-xl bg-black/85 border border-emerald-500/30 backdrop-blur-md flex items-center gap-2 shadow-lg">
                <Yard300Logo variant="badge" size="xs" showSubtext={false} />
              </div>
            </div>
          </div>

          {/* Right / Specs & CTAs */}
          <div className="flex flex-col justify-center bg-[#080D0B] border border-emerald-500/20 p-6 md:p-10 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest font-anime">
                {tr(currentLang, { en: 'CATEGORY', es: 'CATEGORÍA', fr: 'CATÉGORIE', ar: 'القسم' })} // {categoryLabel}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#050807] border border-emerald-500/30 text-[10px] font-black text-gray-300">
                {tr(currentLang, {
                  en: 'ATHLETIC GRADE',
                  es: 'CALIDAD CERTIFICADA',
                  fr: 'QUALITÉ CERTIFIÉE',
                  ar: 'جودة رياضية معتمدة'
                })}
              </span>
            </div>
             
            <h1 className="text-3xl md:text-4xl font-black font-anime text-white leading-tight">
              {currentProduct.name}
            </h1>

            <p className="text-sm font-bold text-[#D4AF37]">
              {currentProduct.tagline}
            </p>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-black text-[#D4AF37] font-mono tracking-tight tabular-nums" dir="ltr">${currentProduct.price}</span>
              {currentProduct.originalPrice && (
                <>
                  <span className="text-xl line-through text-gray-500 font-mono tabular-nums" dir="ltr">
                    ${currentProduct.originalPrice}
                  </span>
                  <span className="text-xs font-black font-anime px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    -$20 OFF
                  </span>
                </>
              )}
              <span className="text-xs font-bold px-3 py-1 bg-[#050807] text-gray-300 rounded-lg border border-emerald-500/20">
                {tr(currentLang, {
                  en: 'Includes Tax & Priority Express Shipping ⚡',
                  es: 'Incluye Impuestos y Envío Exprés ⚡',
                  fr: 'Taxes & Livraison Express Incluses ⚡',
                  ar: 'شامل الضريبة والشحن السريع ⚡'
                })}
              </span>
            </div>

            {/* Official Badge */}
            <div className="p-4 rounded-2xl bg-[#050807] border border-emerald-500/20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-black border border-emerald-500/30">
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
                <span className="font-black text-emerald-400 font-anime block">
                  {tr(currentLang, {
                    en: 'OFFICIAL YARD 300 ATHLETIC GEAR',
                    es: 'EQUIPAMIENTO DEPORTIVO YARD 300',
                    fr: 'ÉQUIPEMENT SPORTIF YARD 300',
                    ar: 'عتاد YARD 300 الرياضي الأصلي'
                  })}
                </span>
                <span className="text-gray-400 font-bold">
                  {tr(currentLang, {
                    en: 'Durable athletic-grade materials engineered for peak combat comfort and recovery.',
                    es: 'Materiales resistentes y transpirables para entrenar con máximo rendimiento.',
                    fr: 'Matériaux durables et respirants conçus pour la performance et la longévité.',
                    ar: 'خامات رياضية متينة وعملية مصممة للراحة والأداء العالي.'
                  })}
                </span>
              </div>
            </div>

            {/* Edition / Gender Selector */}
            {!currentProduct.isMenOnly && !currentProduct.isWomenOnly && !currentProduct.isUnisex && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-gray-300">
                    {tr(currentLang, {
                      en: 'SELECT EDITION (MEN / WOMEN):',
                      es: 'SELECCIONAR EDICIÓN (HOMBRE / MUJER):',
                      fr: 'CHOISIR L’ÉDITION (HOMME / FEMME) :',
                      ar: 'اختر إصدار العتاد (رجالي / نسائي):'
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { soundFX.playButtonClick(); setSelectedGender('men'); setSelectedColorId('black'); }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      selectedGender === 'men'
                        ? 'border-emerald-400 bg-emerald-500/10 text-white'
                        : 'border-gray-800 bg-[#050807] text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚔️</span>
                      <div className="text-start">
                        <span className="text-xs font-black block font-anime">
                          {tr(currentLang, { en: 'MEN’S (BLACK)', es: 'HOMBRES (NEGRO)', fr: 'HOMMES (NOIR)', ar: 'إصدار رجالي (أسود)' })}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-bold">
                          {tr(currentLang, { en: 'Athletic Combat Fit', es: 'Corte de Combate', fr: 'Coupe Combat', ar: 'قصة رياضية قتالية' })}
                        </span>
                      </div>
                    </div>
                    {selectedGender === 'men' && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { soundFX.playButtonClick(); setSelectedGender('women'); setSelectedColorId('white'); }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                      selectedGender === 'women'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                        : 'border-gray-800 bg-[#050807] text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🌸</span>
                      <div className="text-start">
                        <span className="text-xs font-black block font-anime">
                          {tr(currentLang, { en: 'WOMEN’S (WHITE)', es: 'MUJERES (BLANCO)', fr: 'FEMMES (BLANC)', ar: 'إصدار نسائي (أبيض)' })}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-bold">
                          {tr(currentLang, { en: 'Sculpted Couture Fit', es: 'Corte Esculpido', fr: 'Coupe Sculptée', ar: 'قصة نحت أنثوية' })}
                        </span>
                      </div>
                    </div>
                    {selectedGender === 'women' && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </button>
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-300">
                  {tr(currentLang, {
                    en: 'SELECT COLORWAY:',
                    es: 'SELECCIONAR COLOR:',
                    fr: 'CHOISIR LA COULEUR :',
                    ar: 'اختر لون العتاد:'
                  })}
                </span>
                <span className="text-xs font-bold text-[#D4AF37]">{getColorName(activeColor)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {colors.map(col => {
                  const isSelected = selectedColorId === col.id;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        soundFX.playButtonClick();
                        setSelectedColorId(col.id);
                        if (col.id === 'white') setSelectedGender('women');
                        else if (col.id === 'black') setSelectedGender('men');
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-400 bg-emerald-500/10' 
                          : 'border-gray-800 bg-[#050807] hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full border border-gray-600 shrink-0" style={{ backgroundColor: col.hex }} />
                        <span className="text-xs font-black text-white font-anime text-start">
                          {getColorName(col)}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <p className="text-gray-300 font-medium leading-relaxed text-sm py-2">
              {currentProduct.longDescription || currentProduct.description}
            </p>

            {showSizes && (
              <div className="space-y-2.5">
                <span className="block text-xs font-black text-gray-300 uppercase">
                  {tr(currentLang, { en: 'SELECT SIZE:', es: 'SELECCIONAR TALLA:', fr: 'CHOISIR LA TAILLE :', ar: 'اختر القياس:' })}
                </span>
                <div className="flex gap-3">
                  {sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => { soundFX.playButtonClick(); setSelectedSize(size); }}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs font-anime transition-all cursor-pointer ${
                        selectedSize === size 
                          ? 'bg-emerald-500 text-black border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'bg-[#050807] text-gray-300 border border-gray-800 hover:border-emerald-500/40'
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
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#D4AF37] hover:opacity-95 text-black font-black text-sm md:text-base font-anime rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.01] flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>
                  {tr(currentLang, {
                    en: `ADD TO CART — $${currentProduct.price}`,
                    es: `AÑADIR AL CARRITO — $${currentProduct.price}`,
                    fr: `AJOUTER AU PANIER — $${currentProduct.price}`,
                    ar: `إضافة العتاد للسلة — $${currentProduct.price}`
                  })}
                </span>
                <Zap className="w-5 h-5 fill-current" />
              </button>

              <div className="p-5 rounded-2xl bg-[#050807] border border-emerald-500/20 space-y-2.5">
                <h4 className="text-xs font-black text-emerald-400 uppercase font-anime flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {tr(currentLang, {
                      en: 'S-RANK SPECIFICATIONS:',
                      es: 'ESPECIFICACIONES TÉCNICAS RANGO S:',
                      fr: 'SPÉCIFICATIONS TECHNIQUES RANG S :',
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
