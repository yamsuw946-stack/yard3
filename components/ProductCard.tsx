/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Language } from '../i18n';
import { handleImageError } from '../constants';
import { Check, Sparkles } from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { OwnerConfigService } from '../services/ownerConfigService';

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

  // Synchronize with parent props when filter or product updates
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
    { id: 'black', nameEn: 'Obsidian Black', nameAr: 'الأسود الليلي', hex: '#0D0E12', textColor: '#FFFFFF' },
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

  const handleColorClick = (e: React.MouseEvent, colorId: string) => {
    e.stopPropagation();
    soundFX.playButtonClick();
    setSelectedColorId(colorId);
    if (colorId === 'white') {
      setSelectedGender('women');
    } else if (colorId === 'black') {
      setSelectedGender('men');
    }
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
      className="group relative flex flex-col bg-[#12131C] rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(255,230,0,0.2)] hover:-translate-y-1.5"
      onClick={handleCardClick}
    >
      {/* Brand YARD300 & S-Rank Badge with New Emblem */}
      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-[#07080D]/90 backdrop-blur-md rounded-xl text-[10px] font-black font-yard-logo italic text-gray-200 flex items-center gap-1.5 shadow-md">
        <img 
          src="/images/yard_red_black_white_logo.jpg" 
          alt="YARD 300 Logo" 
          className="w-4 h-4 rounded object-cover shadow-[0_0_6px_rgba(229,9,20,0.8)]"
        />
        <span>YARD<span className="text-[#E50914]">300</span></span>
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-[#07080D]/90 backdrop-blur-md rounded-xl text-[10px] font-bold text-gray-300">
        {product.category}
      </div>

      {/* Image Container - Borderless */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#0C0E17]">
        <img 
          src={displayImage} 
          alt={product.name} 
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Small Discrete YARD 300 Emblem on corner */}
        <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></span>
          <span className="text-[10px] font-black font-yard-logo italic tracking-wide text-gray-200">
            YARD<span className="text-[#FFE600]">300</span>
          </span>
        </div>

        {/* Hover View Details Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-white text-black font-black font-anime text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,230,0,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-transform">
            {isAr ? 'عرض تفاصيل العتاد ←' : 'VIEW DETAILS →'}
          </span>
        </div>
      </div>
      
      {/* Details Body */}
      <div className="p-6 flex flex-col flex-1 justify-between bg-[#12131C] space-y-4">
        <div>
          {/* Edition / Gender Switcher */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2.5 border-b border-gray-800/60">
            {product.isMenOnly ? (
              <>
                <span className="text-[10px] font-black font-anime text-[#00F0FF] flex items-center gap-1">
                  <span>⚔️</span>
                  <span>{isAr ? 'رجالي متطور حصرياً:' : 'MEN ONLY (HYPER-EVOLVED):'}</span>
                </span>
                <span className="text-[9px] font-mono text-gray-400 font-bold bg-[#141624] px-2 py-0.5 rounded-md border border-gray-800">
                  {isAr ? 'بدون نسخة نسائية ⚡' : 'NO WOMEN VARIANT ⚡'}
                </span>
              </>
            ) : product.isWomenOnly ? (
              <>
                <span className="text-[10px] font-black font-anime text-[#FF80BF] flex items-center gap-1">
                  <span>🌸</span>
                  <span>{isAr ? 'نسائي حصري (لونين):' : 'WOMEN ONLY (2 COLORS):'}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playButtonClick();
                      setSelectedColorId('white');
                      setSelectedGender('women');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-anime transition-all cursor-pointer ${
                      selectedColorId === 'white'
                        ? 'bg-[#FF007A]/25 text-[#FF80BF] border border-[#FF007A] shadow-[0_0_10px_rgba(255,0,122,0.4)] scale-105'
                        : 'bg-[#151722] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'أبيض كوتور' : 'WHITE'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playButtonClick();
                      setSelectedColorId('black');
                      setSelectedGender('women');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-anime transition-all cursor-pointer ${
                      selectedColorId === 'black'
                        ? 'bg-white/10 text-white border border-gray-400 shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-105'
                        : 'bg-[#151722] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'أسود ملكي' : 'BLACK'}
                  </button>
                </div>
              </>
            ) : product.isUnisex ? (
              <>
                <span className="text-[10px] font-black font-anime text-[#00F0FF] flex items-center gap-1">
                  <span>⚡</span>
                  <span>{isAr ? 'نظارة موحدة (لونين):' : 'ONE VR (2 COLORS):'}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playButtonClick();
                      setSelectedColorId('black');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-anime transition-all cursor-pointer ${
                      selectedColorId === 'black'
                        ? 'bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)] scale-105'
                        : 'bg-[#151722] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'أسود كربوني' : 'BLACK'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playButtonClick();
                      setSelectedColorId('white');
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-anime transition-all cursor-pointer ${
                      selectedColorId === 'white'
                        ? 'bg-white/20 text-white border border-white shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105'
                        : 'bg-[#151722] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    {isAr ? 'أبيض سيبراني' : 'WHITE'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-[10px] font-black font-anime text-[#FFE600]">
                  {isAr ? 'النسخة (متوفر للجنسين):' : 'EDITION (BOTH AVAILABLE):'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playButtonClick();
                      setSelectedGender('men');
                      setSelectedColorId('black');
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black font-anime transition-all cursor-pointer flex items-center gap-1 ${
                      selectedGender === 'men'
                        ? 'bg-[#00F0FF]/25 text-[#00F0FF] border border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105'
                        : 'bg-[#151722] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    <span>⚔️</span>
                    <span>{isAr ? 'رجالي (أسود)' : 'MEN (BLACK)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playButtonClick();
                      setSelectedGender('women');
                      setSelectedColorId('white');
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black font-anime transition-all cursor-pointer flex items-center gap-1 ${
                      selectedGender === 'women'
                        ? 'bg-[#FF007A]/25 text-[#FF80BF] border border-[#FF007A] shadow-[0_0_12px_rgba(255,0,122,0.4)] scale-105'
                        : 'bg-[#151722] text-gray-400 border border-gray-800 hover:text-white'
                    }`}
                  >
                    <span>🌸</span>
                    <span>{isAr ? 'نسائي (أبيض)' : 'WOMEN (WHITE)'}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Dual Color Switcher Pill */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-800/80">
            <span className="text-[10px] font-black font-anime text-gray-400">
              {isAr ? 'اللون المتاح:' : 'AVAILABLE COLORS:'}
            </span>
            <div className="flex items-center gap-2">
              {colors.map(col => {
                const isSelected = selectedColorId === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={(e) => handleColorClick(e, col.id)}
                    title={isAr ? col.nameAr : col.nameEn}
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected ? 'border-[#FFE600] scale-110 shadow-[0_0_8px_#FFE600]' : 'border-gray-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && (
                      <Check className="w-2.5 h-2.5" style={{ color: col.textColor || '#FFFFFF' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Selection Tags */}
          <div className="mb-2 flex items-center gap-1.5 flex-wrap">
            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black border ${
              selectedGender === 'men' 
                ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40' 
                : 'bg-[#FF007A]/10 text-[#FF007A] border-[#FF007A]/40'
            }`}>
              {selectedGender === 'men' ? (isAr ? 'رجالي ⚔️' : 'Men’s Edition') : (isAr ? 'نسائي 🌸' : 'Women’s Edition')}
            </span>

            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-[#1A1D2E] text-[#FFE600] border border-gray-700">
              {product.id === 'p12' 
                ? (activeColor.id === 'white' ? 'Pro Gloves (White)' : 'Pro Gloves (Black)')
                : product.id === 'p11'
                ? (activeColor.id === 'white' ? 'Roman Bag (White)' : 'Roman Bag (Black)')
                : product.id === 'p6'
                ? (activeColor.id === 'white' ? 'Screenless Band (White)' : 'Screenless Band (Black)')
                : product.id === 'p10'
                ? (activeColor.id === 'white' ? 'Pilates Set (White)' : 'Pilates Set (Black)')
                : activeColor.nameEn
              }
            </span>
          </div>

          {/* Bespoke Gender Feature Highlight */}
          {((selectedGender === 'men' && (product.menEditionDetailAr || product.menEditionDetailEn)) ||
            (selectedGender === 'women' && (product.womenEditionDetailAr || product.womenEditionDetailEn))) && (
            <div className="mb-2.5 px-2.5 py-1.5 rounded-xl bg-[#090A10] border border-gray-800 text-[10px] text-gray-300 leading-snug">
              <span className="font-black text-[#FFE600] font-anime block mb-0.5">
                {selectedGender === 'men' 
                  ? (isAr ? '⚔️ ميزة النسخة الرجالية (الأسود):' : '⚔️ Men’s Feature (Black):') 
                  : (isAr ? '🌸 ميزة النسخة النسائية (الأبيض):' : '🌸 Women’s Feature (White):')}
              </span>
              <span className="line-clamp-2 text-gray-400">
                {selectedGender === 'men'
                  ? (isAr ? product.menEditionDetailAr : product.menEditionDetailEn)
                  : (isAr ? product.womenEditionDetailAr : product.womenEditionDetailEn)}
              </span>
            </div>
          )}

          <h3 className="text-xl font-black font-anime text-white mb-1.5 group-hover:text-[#FFE600] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs font-bold text-gray-300 line-clamp-1 mb-2">
            {product.tagline}
          </p>
          <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'السعر الرسمي' : 'PRICE'}</span>
              {product.originalPrice && (
                <span className="text-[9px] font-black font-anime px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  -$20 OFF
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#FFE600] font-anime neon-text-yellow">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-gray-500 font-mono">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#1A1C2C] hover:bg-[#FFE600] border border-gray-700 hover:border-[#FFE600] text-gray-200 hover:text-black text-xs font-black font-anime transition-all flex items-center gap-1.5">
            <span>{isAr ? 'تجهيز العتاد' : 'EQUIP'}</span>
            <span>{isAr ? '←' : '→'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
