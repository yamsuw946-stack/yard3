/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { Language, tr } from '../i18n';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  currentLang?: Language;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
  currentLang = 'en'
}) => {
  const isAr = currentLang === 'ar';
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#0A0B10]/80 backdrop-blur-md z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 ${isAr ? 'left-0 border-r-2' : 'right-0 border-l-2'} w-full md:w-[480px] bg-[#12131C] text-white z-[70] shadow-[0_0_50px_rgba(255,0,122,0.4)] transform transition-transform duration-500 ease-in-out border-[#FF007A] flex flex-col ${
          isAr ? 'text-right' : 'text-left'
        } ${isOpen ? 'translate-x-0' : isAr ? '-translate-x-full' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#FF007A]/30 bg-[#1A1C2B]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="text-xl font-black font-anime text-white">
              {tr(currentLang, {
                en: `CHAMPION GEAR CART (${items.length})`,
                es: `CARRITO DE EQUIPAMIENTO (${items.length})`,
                fr: `PANIER D’ÉQUIPEMENT (${items.length})`,
                ar: `سلة عتاد الأبطال (${items.length})`
              })}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#FF007A] hover:text-white transition-colors cursor-pointer"
            aria-label={tr(currentLang, { en: 'Close cart', es: 'Cerrar carrito', fr: 'Fermer le panier', ar: 'إغلاق السلة' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-6xl">⚡</span>
              <p className="font-bold text-gray-400 text-lg">
                {tr(currentLang, {
                  en: 'Your cart is empty champion! Equip your gear and start training.',
                  es: '¡Tu carrito está vacío, campeón! Equípate y comienza a entrenar.',
                  fr: 'Votre panier est vide champion ! Choisissez votre équipement et commencez l’entraînement.',
                  ar: 'سلتك فارغة أيها البطل! اختر عتادك وابدأ التحدي.'
                })}
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 rounded-2xl bg-[#181A28] border border-gray-800 hover:border-[#00F0FF] transition-all">
                <div className="w-20 h-24 bg-[#0A0B10] rounded-xl overflow-hidden flex-shrink-0 border border-[#FF007A]/40">
                  <img loading="lazy" decoding="async" src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-white text-base font-anime">{item.name}</h3>
                      <span className="text-sm font-black text-[#FFE600] font-mono tabular-nums" dir="ltr">${item.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400 font-bold">{item.category}</span>
                      {item.selectedGender && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                            item.selectedGender === 'men'
                              ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40'
                              : 'bg-[#FF007A]/10 text-[#FF007A] border-[#FF007A]/40'
                          }`}
                        >
                          {item.selectedGender === 'men'
                            ? tr(currentLang, { en: 'Men ⚔️', es: 'Hombres ⚔️', fr: 'Hommes ⚔️', ar: 'رجالي ⚔️' })
                            : tr(currentLang, { en: 'Women 🌸', es: 'Mujeres 🌸', fr: 'Femmes 🌸', ar: 'نسائي 🌸' })}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-black/80 border border-gray-700 text-[#FFE600] font-black">
                          {item.selectedColor === 'white'
                            ? tr(currentLang, { en: 'Pearl White', es: 'Blanco Perla', fr: 'Blanc Perle', ar: 'الأبيض اللؤلؤي' })
                            : tr(currentLang, { en: 'Obsidian Black', es: 'Negro Obsidiana', fr: 'Noir Obsidienne', ar: 'الأسود الليلي' })}
                        </span>
                      )}
                      {item.size && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-xs text-red-400 hover:underline self-end font-bold transition-colors cursor-pointer"
                  >
                    {tr(currentLang, {
                      en: 'REMOVE GEAR ✖',
                      es: 'ELIMINAR ✖',
                      fr: 'SUPPRIMER ✖',
                      ar: 'إزالة من السلة ✖'
                    })}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1A1C2B]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-gray-300">
              {tr(currentLang, {
                en: 'TOTAL GEAR COST',
                es: 'COSTO TOTAL DEL EQUIPO',
                fr: 'COÛT TOTAL DU MATÉRIEL',
                ar: 'إجمالي الطلب'
              })}
            </span>
            <span className="text-2xl font-black text-[#FFE600] font-mono tracking-tight neon-text-yellow tabular-nums" dir="ltr">${total}</span>
          </div>
          <p className="text-xs text-gray-400 mb-6 text-center">
            {tr(currentLang, {
              en: 'Priority express tactical shipping available globally.',
              es: 'Envío exprés táctico disponible para todo el mundo.',
              fr: 'Expédition express tactique disponible dans le monde entier.',
              ar: 'شحن دولي سريع لجميع أنحاء العالم.'
            })}
          </p>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full py-4 bg-[#FFE600] hover:bg-white text-black font-black text-base font-anime rounded-xl shadow-[0_0_20px_rgba(255,230,0,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tr(currentLang, {
              en: 'PROCEED TO CHECKOUT ⚡',
              es: 'CONTINUAR AL PAGO ⚡',
              fr: 'PASSER LA COMMANDE ⚡',
              ar: 'متابعة الدفع ⚡'
            })}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
