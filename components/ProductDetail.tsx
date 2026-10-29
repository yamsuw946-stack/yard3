/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Language } from '../i18n';
import { handleImageError, getProducts, YARD300_BRAND_LOGO } from '../constants';
import { Check, ShieldCheck, Truck, RefreshCw, Zap, Sparkles } from 'lucide-react';
import { soundFX } from '../services/soundFX';

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
    { id: 'black', nameEn: 'Obsidian Black', nameAr: 'الأسود الليلي', hex: '#0D0E12', textColor: '#FFFFFF' },
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
    if (isAr) {
      if (currentProduct.category === 'Audio') return 'الصوتيات والتركيز';
      if (currentProduct.category === 'Wearable') return 'العتاد الحركي والمستشعرات';
      if (currentProduct.category === 'Apparel') return 'الملابس الرياضية الفاخرة';
      if (currentProduct.category === 'Equipment') return 'المعدات والأجهزة القتالية';
      if (currentProduct.category === 'Accessories') return 'الإكسسوارات وحماية المفاصل';
      if (currentProduct.category === 'Home') return 'أجهزة الاستشفاء والترطيب';
      if (currentProduct.category === 'Footwear') return 'أحذية الركض النيتروجينية';
    }
    return currentProduct.category.toUpperCase();
  }, [currentProduct.category, isAr]);

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
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-[#FFE600] transition-colors mb-10 cursor-pointer"
        >
          <span className="text-xl">{isAr ? '→' : '←'}</span>
          <span>{isAr ? 'العودة إلى متجر عتاد الأبطال' : 'Back to Gear Store'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left / Hero Product Artwork */}
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
                ⚡ OFFICIAL CHAMPION GEAR
              </div>

              {/* Small discrete YARD300 logo overlay on bottom right */}
              <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md flex items-center gap-2 shadow-lg">
                <img 
                  src="/images/yard_red_black_white_logo.jpg" 
                  alt="YARD 300 Logo" 
                  className="w-4 h-4 rounded object-cover shadow-[0_0_6px_rgba(229,9,20,0.8)]"
                />
                <span className="text-xs font-black font-yard-logo italic tracking-wide text-white">
                  YARD<span className="text-[#E50914]">300</span> // AUTHENTIC
                </span>
              </div>
            </div>
          </div>

          {/* Right / Specs & CTAs */}
          <div className="flex flex-col justify-center bg-[#12131C] p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
             <div className="flex items-center justify-between">
               <span className="text-xs font-black text-[#FFE600] uppercase tracking-widest font-anime">
                 {isAr ? `القسم // ${categoryLabel}` : `CATEGORY // ${categoryLabel}`}
               </span>
               <span className="px-3 py-1 rounded-full bg-[#0A0B10] border border-gray-700 text-[10px] font-black text-gray-300">
                 {currentLang === 'ar' ? 'جودة رياضية معتمدة' : currentLang === 'es' ? 'CALIDAD CERTIFICADA' : currentLang === 'fr' ? 'QUALITÉ CERTIFIÉE' : 'ATHLETIC GRADE'}
               </span>
             </div>
             
             <h1 className="text-3xl md:text-5xl font-black font-anime text-white leading-tight">
               {currentProduct.name}
             </h1>

             <p className="text-sm font-bold text-[#FFE600]">
               {currentProduct.tagline}
             </p>

             <div className="flex items-baseline gap-4 flex-wrap">
               <span className="text-4xl font-black text-[#FFE600] font-mono tracking-tight neon-text-yellow" dir="ltr">${currentProduct.price}</span>
               {currentProduct.originalPrice && (
                 <>
                   <span className="text-xl line-through text-gray-500 font-mono">
                     ${currentProduct.originalPrice}
                   </span>
                   <span className="text-xs font-black font-anime px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                     -$20 OFF
                   </span>
                 </>
               )}
               <span className="text-xs font-bold px-3 py-1 bg-[#1A1C28] text-gray-300 rounded-lg border border-gray-800">
                 {isAr ? 'شامل الضريبة والشحن السريع ⚡' : 'Includes Tax & Priority Express Shipping ⚡'}
               </span>
             </div>

             {/* Luxury & 300 Limited Edition Badge */}
             <div className="p-4 rounded-2xl bg-[#0A0B10] flex items-center gap-3.5">
               <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-[0_0_10px_rgba(255,230,0,0.2)] bg-black">
                 <img loading="lazy" decoding="async" 
                   src={YARD300_BRAND_LOGO} 
                   alt="Official YARD 300 Emblem" 
                   onError={handleImageError}
                   className="w-full h-full object-cover"
                 />
               </div>
               <div className="text-xs leading-relaxed">
                 <span className="font-black text-[#FFE600] font-anime block">
                    {currentLang === 'ar' ? 'عتاد YARD300 الرياضي الأصلي' : currentLang === 'es' ? 'EQUIPAMIENTO DEPORTIVO YARD300' : currentLang === 'fr' ? 'ÉQUIPEMENT SPORTIF YARD300' : 'OFFICIAL YARD300 ATHLETIC GEAR'}
                  </span>
                  <span className="text-gray-400 font-bold">
                    {currentLang === 'ar' ? 'خامات رياضية متينة وعملية مصممة للراحة وطول العمر.' : currentLang === 'es' ? 'Materiales resistentes y transpirables para entrenar con comodidad.' : currentLang === 'fr' ? 'Matériaux durables et respirants conçus pour le confort et la longévité.' : 'Durable athletic-grade materials built for workout comfort and longevity.'}
                  </span>
               </div>
             </div>

             {/* Gender / Edition Selection */}
             {currentProduct.isMenOnly ? (
               <div className="space-y-3 pt-2 pb-1">
                 <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl">⚔️</span>
                     <div>
                       <span className="text-xs font-black block font-anime text-[#00F0FF]">
                         {isAr ? 'إصدار تكتيكي فائق التطور (رجالي حصرياً)' : 'HYPER-EVOLVED TACTICAL CUT (MEN ONLY)'}
                       </span>
                       <span className="text-[11px] text-gray-300 block font-bold">
                         {isAr ? 'تمت هندسته خصيصاً للمقاتلين الأبطال — لا تتوفر منه نسخة نسائية' : 'Engineered exclusively for male combat athletes — strictly no women variant'}
                       </span>
                     </div>
                   </div>
                   <span className="px-3 py-1 rounded-full bg-[#00F0FF] text-black text-[10px] font-black font-anime shadow-[0_0_12px_rgba(0,240,255,0.5)] shrink-0">
                     {isAr ? 'رجالي حصرياً' : 'MEN ONLY'}
                   </span>
                 </div>
               </div>
             ) : currentProduct.isWomenOnly ? (
               <div className="space-y-3 pt-2 pb-1">
                 <div className="p-4 rounded-2xl bg-[#FF007A]/10 border border-[#FF007A]/40 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl">🌸</span>
                     <div>
                       <span className="text-xs font-black block font-anime text-[#FF80BF]">
                         {isAr ? 'إصدار نسائي حصري (نسائي فقط)' : 'EXCLUSIVE WOMEN’S COUTURE (WOMEN ONLY)'}
                       </span>
                       <span className="text-[11px] text-gray-300 block font-bold">
                         {isAr ? 'طقم بيلاتس كوتور متاح بلونين ساحرين: الأبيض اللؤلؤي والأسود الليلي' : 'Haute couture pilates set available in Pearl White & Obsidian Black'}
                       </span>
                     </div>
                   </div>
                   <span className="px-3 py-1 rounded-full bg-[#FF007A] text-white text-[10px] font-black font-anime shadow-[0_0_12px_rgba(255,0,122,0.5)] shrink-0">
                     {isAr ? 'نسائي فقط' : 'WOMEN ONLY'}
                   </span>
                 </div>
               </div>
             ) : currentProduct.isUnisex ? (
               <div className="space-y-3 pt-2 pb-1">
                 <div className="p-4 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/40 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="text-2xl">⚡</span>
                     <div>
                       <span className="text-xs font-black block font-anime text-[#00F0FF]">
                         {isAr ? 'نظارة واقع افتراضي واحدة موحدة (للجميع)' : 'UNIFIED NEURAL VR VISOR (FOR ALL)'}
                       </span>
                       <span className="text-[11px] text-gray-300 block font-bold">
                         {isAr ? 'هيكل رياضي فائق التطور متاح بلونين: الأسود الكربوني والأبيض السيبراني اللؤلؤي' : 'Next-gen spatial visor in Carbon Black & Cyber Pearl White'}
                       </span>
                     </div>
                   </div>
                   <span className="px-3 py-1 rounded-full bg-[#00F0FF] text-black text-[10px] font-black font-anime shadow-[0_0_12px_rgba(0,240,255,0.5)] shrink-0">
                     {isAr ? 'لونين أسود وأبيض' : '2 COLORS'}
                   </span>
                 </div>
               </div>
             ) : (
               <div className="space-y-3 pt-2 pb-1">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-black uppercase text-gray-300">
                     {isAr ? 'اختر إصدار العتاد (متاح رجالي ونسائي):' : 'SELECT EDITION (MEN / WOMEN):'}
                   </span>
                   <span className="text-xs font-bold text-[#00F0FF]">
                     {selectedGender === 'men' 
                       ? (isAr ? 'إصدار رجالي معتمد ⚔️' : 'Men’s Kinetic Fit ⚔️') 
                       : (isAr ? 'إصدار نسائي معتمد 🌸' : 'Women’s Kinetic Fit 🌸')
                     }
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
                       <div className="text-left rtl:text-right">
                         <span className="text-xs font-black block font-anime">
                           {isAr ? 'إصدار رجالي (الأسود)' : 'MEN’S (BLACK)'}
                         </span>
                         <span className="text-[10px] text-gray-400 block font-bold">
                           {isAr ? 'قصة رياضية قتالية' : 'Athletic Combat Fit'}
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
                       <div className="text-left rtl:text-right">
                         <span className="text-xs font-black block font-anime">
                           {isAr ? 'إصدار نسائي (الأبيض)' : 'WOMEN’S (WHITE)'}
                         </span>
                         <span className="text-[10px] text-gray-400 block font-bold">
                           {isAr ? 'قصة نحت أنثوية' : 'Sculpted Couture Fit'}
                         </span>
                       </div>
                     </div>
                     {selectedGender === 'women' && <Check className="w-4 h-4 text-[#FF007A]" />}
                   </button>
                 </div>
               </div>
             )}

             {/* Bespoke Edition Differences Comparison Box */}
             {(currentProduct.menEditionDetailAr || currentProduct.womenEditionDetailAr) && (
               <div className="p-4 rounded-2xl bg-[#090A12] border border-gray-800 space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-black uppercase text-[#FFE600] font-anime flex items-center gap-2">
                     <Sparkles className="w-3.5 h-3.5" />
                     <span>
                       {currentProduct.isWomenOnly
                         ? (isAr ? 'المواصفات الهندسية للونين (الأبيض والأسود):' : 'COLORWAY CRAFTSMANSHIP & DETAILS:')
                         : currentProduct.isUnisex
                         ? (isAr ? 'المواصفات الفنية للونين (الأسود والأبيض):' : 'FINISH SPECIFICATIONS & OPTICS:')
                         : (isAr ? 'الفروقات الهندسية الحصرية بين النسختين:' : 'BESPOKE GENDER SPECIFICATIONS:')}
                     </span>
                   </span>
                   <span className="text-[10px] font-mono text-gray-400">
                     {currentProduct.isWomenOnly
                       ? (isAr ? 'كوتور نسائي' : 'Women Couture')
                       : currentProduct.isUnisex
                       ? (isAr ? 'هيكل رياضي 8K' : '8K Optics')
                       : (isAr ? 'تصميم مخصص لكل جنس' : 'Tailored Per Gender')}
                   </span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {/* Left / Black Card */}
                   <div className={`p-3 rounded-xl border transition-all ${
                     (selectedColorId === 'black' || (!currentProduct.isWomenOnly && !currentProduct.isUnisex && selectedGender === 'men'))
                       ? 'bg-[#00F0FF]/10 border-[#00F0FF]/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                       : 'bg-[#10121C] border-gray-800/80 opacity-60'
                   }`}>
                     <div className="flex items-center gap-2 mb-1">
                       <span className="w-2.5 h-2.5 rounded-full bg-[#0D0E12] border border-white/40"></span>
                       <span className="text-xs font-black text-[#00F0FF] font-anime">
                         {currentProduct.isWomenOnly
                           ? (isAr ? '🖤 الأسود الليلي (كوتور ملكي)' : '🖤 Obsidian Black Couture')
                           : currentProduct.isUnisex
                           ? (isAr ? '🖤 الأسود الكربوني (هيكل قتالي)' : '🖤 Carbon Black Chassis')
                           : (isAr ? '⚔️ النسخة الرجالية (الأسود الليلي)' : '⚔️ Men’s Edition (Obsidian Black)')}
                       </span>
                     </div>
                     <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                       {isAr 
                         ? (currentProduct.menEditionDetailAr || currentProduct.womenEditionDetailAr) 
                         : (currentProduct.menEditionDetailEn || currentProduct.womenEditionDetailEn)}
                     </p>
                   </div>

                   {/* Right / White Card */}
                   <div className={`p-3 rounded-xl border transition-all ${
                     (selectedColorId === 'white' || (!currentProduct.isWomenOnly && !currentProduct.isUnisex && selectedGender === 'women'))
                       ? 'bg-[#FF007A]/10 border-[#FF007A]/60 shadow-[0_0_15px_rgba(255,0,122,0.2)]'
                       : 'bg-[#10121C] border-gray-800/80 opacity-60'
                   }`}>
                     <div className="flex items-center gap-2 mb-1">
                       <span className="w-2.5 h-2.5 rounded-full bg-[#F8F9FA] border border-gray-400"></span>
                       <span className="text-xs font-black text-[#FF80BF] font-anime">
                         {currentProduct.isWomenOnly
                           ? (isAr ? '🌸 الأبيض اللؤلؤي (كوتور دولتشي)' : '🌸 Dolce Pearl White')
                           : currentProduct.isUnisex
                           ? (isAr ? '⚡ الأبيض السيبراني اللؤلؤي' : '⚡ Cyber Pearl White')
                           : (isAr ? '🌸 النسخة النسائية (الأبيض اللؤلؤي)' : '🌸 Women’s Edition (Pearl White)')}
                       </span>
                     </div>
                     <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                       {isAr ? currentProduct.womenEditionDetailAr : currentProduct.womenEditionDetailEn}
                     </p>
                   </div>
                 </div>
               </div>
             )}

             {/* Color Selection - TWO COLORS (BLACK & WHITE) */}
             <div className="space-y-3 pt-2 pb-2">
               <div className="flex items-center justify-between">
                 <span className="text-xs font-black uppercase text-gray-300">
                   {isAr ? 'اختر لون العتاد (متاح بلونين):' : 'SELECT COLORWAY (2 CHOICES):'}
                 </span>
                 <span className="text-xs font-bold text-[#FFE600]">
                   {currentProduct.id === 'p12'
                     ? (activeColor.id === 'white' ? 'Pearl White (Pro Boxing Gloves)' : 'Obsidian Black (Pro Boxing Gloves)')
                     : currentProduct.id === 'p11'
                     ? (activeColor.id === 'white' ? 'Pearl White (Roman Combat Bag)' : 'Obsidian Black (Roman Combat Bag)')
                     : currentProduct.id === 'p6'
                     ? (activeColor.id === 'white' ? 'Pearl White (Screenless Whoop Band)' : 'Obsidian Black (Screenless Whoop Band)')
                     : currentProduct.id === 'p10'
                     ? (activeColor.id === 'white' ? 'Pearl White (Studio Pilates Set)' : 'Obsidian Black (Studio Pilates Set)')
                     : activeColor.nameEn
                   }
                 </span>
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
                         <div className="text-left rtl:text-right">
                           <span className="text-xs font-black block text-white font-anime">
                             {isAr ? col.nameAr : col.nameEn}
                           </span>
                           {currentProduct.id === 'p12' && (
                             <span className="text-[10px] font-bold text-gray-400 block">
                               {col.id === 'white' ? 'Pro Gloves (White)' : 'Pro Gloves (Black)'}
                             </span>
                           )}
                           {currentProduct.id === 'p11' && (
                             <span className="text-[10px] font-bold text-gray-400 block">
                               {col.id === 'white' ? 'Roman Bag (White)' : 'Roman Bag (Black)'}
                             </span>
                           )}
                           {currentProduct.id === 'p6' && (
                             <span className="text-[10px] font-bold text-gray-400 block">
                               {col.id === 'white' ? 'Screenless Band (White)' : 'Screenless Band (Black)'}
                             </span>
                           )}
                           {currentProduct.id === 'p10' && (
                             <span className="text-[10px] font-bold text-gray-400 block">
                               {col.id === 'white' ? 'Pilates Set (White)' : 'Pilates Set (Black)'}
                             </span>
                           )}
                         </div>
                       </div>
                       {isSelected && <Check className="w-4 h-4 text-[#FFE600]" />}
                     </button>
                   );
                 })}
               </div>
             </div>
             
             <p className="text-gray-300 font-medium leading-relaxed text-sm md:text-base py-4">
               {currentProduct.longDescription || currentProduct.description}
             </p>

             {showSizes && (
                <div className="space-y-3">
                  <span className="block text-xs font-black text-gray-300 uppercase">
                    {isAr ? 'اختر القياس:' : 'SELECT SIZE:'}
                  </span>
                  <div className="flex gap-3">
                    {sizes.map(size => (
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
                   {isAr ? `إضافة العتاد لسلة الأبطال — $${currentProduct.price}` : `ADD TO CART — $${currentProduct.price}`}
                 </span>
                 <Zap className="w-5 h-5 fill-current" />
               </button>

               <div className="p-5 rounded-2xl bg-[#0A0B10] border border-gray-800 space-y-3">
                 <h4 className="text-xs font-black text-[#FFE600] uppercase font-anime">
                   {isAr ? 'المواصفات الفنية المعتمدة:' : 'S-RANK SPECIFICATIONS:'}
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
