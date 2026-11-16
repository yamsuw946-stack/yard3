/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Language, tr } from '../i18n';
import { handleImageError } from '../constants';
import { Check } from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';
import { Yard300Logo } from './Yard300Logo';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  currentLang?: Language;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';
  const [selectedColorId, setSelectedColorId] = useState<string>(
    product.selectedColor || (product.selectedGender === 'women' ? 'white' : 'black')
  );
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>(product.selectedGender || 'men');

  useEffect(() => {
    if (product.selectedGender) {
      setSelectedGender(product.selectedGender);
      setSelectedColorId(product.selectedGender === 'women' ? 'white' : 'black');
    } else if (product.selectedColor) {
      setSelectedColorId(product.selectedColor);
      setSelectedGender(product.selectedColor === 'white' ? 'women' : 'men');
    }
  }, [product.selectedGender, product.selectedColor]);

  const colors = product.colors || [
    { id: 'black', nameEn: 'Obsidian Black', nameAr: 'الأسود الليلي', hex: '#050807', textColor: '#FFFFFF' },
    { id: 'white', nameEn: 'Pearl White', nameAr: 'الأبيض النقي', hex: '#F8F9FA', textColor: '#000000' }
  ];

  const activeColor = colors.find(c => c.id === selectedColorId) || colors[0];
  const baseImage = product.isWomenOnly
    ? (selectedColorId === 'black' ? (product.menImageUrl || activeColor?.imageUrl) : (product.womenImageUrl || activeColor?.imageUrl))
    : product.isUnisex
    ? (selectedColorId === 'white' ? (product.womenImageUrl || activeColor?.imageUrl) : (product.menImageUrl || activeColor?.imageUrl))
    : (selectedGender === 'women' || selectedColorId === 'white')
    ? (product.womenImageUrl || activeColor?.imageUrl || product.imageUrl)
    : (product.menImageUrl || activeColor?.imageUrl || product.imageUrl);

  const displayImage = OwnerConfigService.getConfig().media.productImageOverrides?.[product.id] || baseImage;

  const translateCategory = (cat: string) => {
    const map: Record<string, { en: string; es: string; fr: string; ar: string }> = {
      Wearable: { en: 'WEARABLE', es: 'VESTIBLE', fr: 'CONNECTÉ', ar: 'المستشعرات' },
      Apparel: { en: 'APPAREL', es: 'ROPA PRO', fr: 'TENUE PRO', ar: 'الملابس' },
      Home: { en: 'HYDRATION', es: 'HIDRATACIÓN', fr: 'HYDRATATION', ar: 'الترطيب' },
      Audio: { en: 'AUDIO', es: 'AUDIO', fr: 'AUDIO', ar: 'الصوتيات' },
      Equipment: { en: 'EQUIPMENT', es: 'EQUIPO', fr: 'ÉQUIPEMENT', ar: 'المعدات' },
      Accessories: { en: 'ACCESSORIES', es: 'ACCESORIOS', fr: 'ACCESSOIRES', ar: 'الإكسسوارات' },
      Footwear: { en: 'FOOTWEAR', es: 'CALZADO', fr: 'CHAUSSURES', ar: 'الأحذية' },
      Mobile: { en: 'MOBILE', es: 'MÓVIL', fr: 'MOBILE', ar: 'الموبايل' }
    };
    const m = map[cat];
    return m ? tr(currentLang, m) : cat;
  };

  const getColorLabel = (col: { id: string; nameEn: string; nameAr: string }) => {
    if (isAr) return col.nameAr;
    if (col.id === 'black') {
      return tr(currentLang, {
        en: col.nameEn || 'Obsidian Black',
        es: 'Negro Obsidiana',
        fr: 'Noir Obsidienne'
      });
    }
    return tr(currentLang, {
      en: col.nameEn || 'Pearl White',
      es: 'Blanco Perla',
      fr: 'Blanc Perle'
    });
  };

  const handleColorClick = (e: React.MouseEvent, colorId: string) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    setSelectedColorId(colorId);
    if (colorId === 'white') setSelectedGender('women');
    else if (colorId === 'black') setSelectedGender('men');
  };

  const handleCardClick = () => {
    onClick({
      ...product,
      selectedColor: selectedColorId,
      selectedGender: selectedGender
    });
  };

  return (
    <div 
      className="group relative flex flex-col bg-[#080D0B] border border-emerald-500/20 hover:border-emerald-400/50 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Brand YARD300 Badge */}
      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-[#050807]/90 border border-emerald-500/30 backdrop-blur-md rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-md">
        <Yard300Logo variant="badge" size="xs" showSubtext={false} />
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#050807]/90 border border-white/10 backdrop-blur-md rounded-xl text-[10px] font-bold text-emerald-300">
        {translateCategory(product.category)}
      </div>

      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#050807]">
        <img 
          src={displayImage} 
          alt={product.name} 
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* 300 Serialized Edition Badge */}
        <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-black/85 border border-emerald-500/25 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[10px] font-black font-mono tracking-wide text-gray-200">
            {tr(currentLang, { en: '300 EDITION', es: 'EDICIÓN 300', fr: 'ÉDITION 300', ar: 'إصدار 300' })}
          </span>
        </div>

        {/* Hover View Details Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/45 backdrop-blur-[2px]">
          <span className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-white text-black font-black font-anime text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transform translate-y-2 group-hover:translate-y-0 transition-transform">
            {tr(currentLang, {
              en: 'VIEW DETAILS →',
              es: 'VER DETALLES →',
              fr: 'VOIR DÉTAILS →',
              ar: 'عرض تفاصيل العتاد ←'
            })}
          </span>
        </div>
      </div>
      
      {/* Details Body */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#080D0B] space-y-3.5">
        <div>
          {/* Edition / Gender Switcher */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2.5 border-b border-emerald-500/15">
            {product.isMenOnly ? (
              <>
                <span className="text-[10px] font-black font-anime text-emerald-400 flex items-center gap-1">
                  <span>⚔️</span>
                  <span>{tr(currentLang, { en: 'MEN ONLY:', es: 'SOLO HOMBRES:', fr: 'HOMMES UNIQUEMENT :', ar: 'رجالي متطور حصرياً:' })}</span>
                </span>
                <span className="text-[9px] font-mono text-gray-400 font-bold bg-[#050807] px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {tr(currentLang, { en: 'PRO CUT ⚡', es: 'CORTE PRO ⚡', fr: 'COUPE PRO ⚡', ar: 'نسخة رجالية ⚡' })}
                </span>
              </>
            ) : product.isWomenOnly ? (
              <>
                <span className="text-[10px] font-black font-anime text-[#FF80BF] flex items-center gap-1">
                  <span>🌸</span>
                  <span>{tr(currentLang, { en: 'WOMEN ONLY:', es: 'SOLO MUJERES:', fr: 'FEMMES UNIQUEMENT :', ar: 'نسائي حصري:' })}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); soundFX.playButtonClick(); setSelectedColorId('white'); setSelectedGender('women'); }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-anime transition-all cursor-pointer ${
                      selectedColorId === 'white'
                        ? 'bg-[#FF007A]/25 text-[#FF80BF] border border-[#FF007A]'
                        : 'bg-[#050807] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    {tr(currentLang, { en: 'WHITE', es: 'BLANCO', fr: 'BLANC', ar: 'أبيض' })}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); soundFX.playButtonClick(); setSelectedColorId('black'); setSelectedGender('women'); }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-anime transition-all cursor-pointer ${
                      selectedColorId === 'black'
                        ? 'bg-white/10 text-white border border-gray-400'
                        : 'bg-[#050807] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    {tr(currentLang, { en: 'BLACK', es: 'NEGRO', fr: 'NOIR', ar: 'أسود' })}
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-[10px] font-black font-anime text-[#D4AF37]">
                  {tr(currentLang, { en: 'EDITION:', es: 'EDICIÓN:', fr: 'ÉDITION :', ar: 'النسخة:' })}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); soundFX.playButtonClick(); setSelectedGender('men'); setSelectedColorId('black'); }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black font-anime transition-all cursor-pointer flex items-center gap-1 ${
                      selectedGender === 'men'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60'
                        : 'bg-[#050807] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    <span>⚔️</span>
                    <span>{tr(currentLang, { en: 'MEN (BLACK)', es: 'HOMBRE', fr: 'HOMME', ar: 'رجالي' })}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); soundFX.playButtonClick(); setSelectedGender('women'); setSelectedColorId('white'); }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black font-anime transition-all cursor-pointer flex items-center gap-1 ${
                      selectedGender === 'women'
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/60'
                        : 'bg-[#050807] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    <span>🌸</span>
                    <span>{tr(currentLang, { en: 'WOMEN (WHITE)', es: 'MUJER', fr: 'FEMME', ar: 'نسائي' })}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Dual Color Switcher Pill */}
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-emerald-500/15">
            <span className="text-[10px] font-black font-anime text-gray-400">
              {tr(currentLang, { en: 'AVAILABLE COLORS:', es: 'COLORES:', fr: 'COULEURS :', ar: 'الألوان المتاحة:' })}
            </span>
            <div className="flex items-center gap-2">
              {colors.map(col => {
                const isSelected = selectedColorId === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={(e) => handleColorClick(e, col.id)}
                    title={getColorLabel(col)}
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected ? 'border-emerald-400 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" style={{ color: col.textColor || '#FFFFFF' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Selection Tags */}
          <div className="mb-2 flex items-center gap-1.5 flex-wrap">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black border ${
              selectedGender === 'men' 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/35' 
                : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/35'
            }`}>
              {selectedGender === 'men'
                ? tr(currentLang, { en: 'Men’s Edition', es: 'Edición Hombre', fr: 'Édition Homme', ar: 'رجالي ⚔️' })
                : tr(currentLang, { en: 'Women’s Edition', es: 'Edición Mujer', fr: 'Édition Femme', ar: 'نسائي 🌸' })}
            </span>

            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-[#050807] text-[#D4AF37] border border-white/10">
              {getColorLabel(activeColor)}
            </span>
          </div>

          <h3 className="text-lg font-black font-anime text-white mb-1 group-hover:text-emerald-400 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs font-bold text-gray-300 line-clamp-1 mb-1.5">
            {product.tagline}
          </p>
          <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3.5 border-t border-emerald-500/15 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-gray-400 block font-bold">
                {tr(currentLang, { en: 'PRICE', es: 'PRECIO', fr: 'PRIX', ar: 'السعر الرسمي' })}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] font-black font-anime px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  -$20
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#D4AF37] font-mono tracking-tight tabular-nums" dir="ltr">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-gray-500 font-mono tabular-nums" dir="ltr">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-300 hover:text-black text-xs font-black font-anime transition-all flex items-center gap-1.5">
            <span>{tr(currentLang, { en: 'EQUIP', es: 'ELEGIR', fr: 'ÉQUIPER', ar: 'تجهيز' })}</span>
            <span>{isAr ? '←' : '→'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
