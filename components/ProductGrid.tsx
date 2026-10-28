/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Language } from '../i18n';
import { getProducts } from '../constants';
import ProductCard from './ProductCard';
import { ShoppingBag, Sparkles, Filter, ShieldCheck, Flame } from 'lucide-react';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  currentLang?: Language;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick, currentLang = 'en' }) => {
  const isEs = currentLang === 'es';
  const isFr = currentLang === 'fr';
  const isAr = currentLang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');

  const allProducts = getProducts(currentLang);

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesGender = 
      selectedGender === 'all' || 
      product.isUnisex || 
      (selectedGender === 'women' ? (product.isWomenOnly || product.genders?.includes('women')) : product.genders?.includes('men'));
    return matchesCategory && matchesGender;
  });

  return (
    <div className="max-w-[1800px] w-full max-w-full overflow-x-hidden mx-auto px-3 sm:px-4 md:px-8 py-8">
      {/* Header Banner */}
      <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-r from-[#0C0E1A] via-[#141628] to-[#0A0C16] shadow-[0_0_40px_rgba(0,240,255,0.15)] mb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] text-xs font-black font-anime uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE600] animate-bounce" />
              <span>
                {isEs ? 'COLECCIÓN EXCLUSIVA 300 UNIDADES' : isFr ? 'COLLECTION EXCLUSIVE 300 PIÈCES' : isAr ? 'إصدار حصري محدود — 300 قطعة فقط' : 'STRICTLY SERIALIZED // 300 PIECES ONLY'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black font-anime text-white tracking-wide">
              {isEs 
                ? 'EQUIPO ATLÉTICO DE LUJO YARD300' 
                : isFr 
                ? 'ÉQUIPEMENT ATHLÉTIQUE DE LUXE YARD300' 
                : isAr 
                ? 'عتاد وأزياء YARD300 الفخمة (إصدار النخبة)' 
                : 'YARD300 LUXURY COMBAT & ATHLETIC STORE'}
            </h1>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl font-bold leading-relaxed">
              {isEs
                ? 'Tejidos de tecnología militar, diseño anime cinético e ingeniería de prevención de lesiones. Solo 300 unidades producidas por modelo.'
                : isFr
                ? 'Tissus d\'ingénierie avancée, design anime cinétique et prévention des blessures. Seulement 300 unités numérotées par modèle.'
                : isAr
                ? 'أقمشة رياضية متطورة بمواصفات نخبوية وتصميم أنمي حركي مانع للإجهاد. ننتج 300 قطعة فقط لكل تصميم لضمان التميز المطلق.'
                : 'Military-grade athletic textiles, kinetic anime contours, and injury-reduction mechanics. Strictly 300 serialized units minted per drop.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-[#141624] text-center font-mono">
              <span className="block text-[10px] text-gray-400 uppercase">BATCH STATUS</span>
              <span className="text-sm font-black font-anime text-[#10B981]">ACTIVE DROP ⚡</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-8 pt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Gender Filter */}
          <div className="flex items-center bg-[#0E101D] p-1 rounded-2xl text-xs font-anime">
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-black ${
                selectedGender === 'all' ? 'bg-[#00F0FF] text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isEs ? 'Todos' : isFr ? 'Tous' : isAr ? 'الكل' : 'ALL'}
            </button>
            <button
              onClick={() => setSelectedGender('men')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-black ${
                selectedGender === 'men' ? 'bg-[#E50914] text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isEs ? 'Hombres' : isFr ? 'Hommes' : isAr ? 'رجالي' : 'MEN'}
            </button>
            <button
              onClick={() => setSelectedGender('women')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-black ${
                selectedGender === 'women' ? 'bg-[#FF007A] text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isEs ? 'Mujeres' : isFr ? 'Femmes' : isAr ? 'نسائي' : 'WOMEN'}
            </button>
          </div>

          <div className="text-xs font-mono text-gray-400">
            <span>{filteredProducts.length} </span>
            <span>{isEs ? 'Productos encontrados' : isFr ? 'Produits trouvés' : isAr ? 'منتجات حصرية' : 'Products Available'}</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-full">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            currentLang={currentLang}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
