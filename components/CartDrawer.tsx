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
  const t = (en: string, es: string, fr: string, ar: string) => tr(currentLang, { en, es, fr, ar });
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        dir={isAr ? 'rtl' : 'ltr'}
        className={`fixed inset-y-0 ${
          isAr ? 'left-0 border-r border-emerald-500/40' : 'right-0 border-l border-emerald-500/40'
        } w-full md:w-[460px] bg-[#080D0B] text-white z-[70] shadow-[0_0_50px_rgba(16,185,129,0.25)] transform transition-transform duration-500 ease-in-out flex flex-col ${
          isAr ? 'text-right' : 'text-left'
        } ${
          isOpen
            ? 'translate-x-0'
            : isAr
              ? '-translate-x-full'
              : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-[#050807]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-black font-anime text-white tabular-nums">
              {t(
                `CHAMPION GEAR CART (${items.length})`,
                `CARRITO DE EQUIPAMIENTO (${items.length})`,
                `PANIER D’ÉQUIPEMENT (${items.length})`,
                `سلة المشتريات (${items.length})`
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#0C1411] border border-white/[0.1] text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            aria-label={t('Close cart', 'Cerrar carrito', 'Fermer le panier', 'إغلاق السلة')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto yard-slim-scrollbar p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
              <span className="text-5xl animate-bounce">⚡</span>
              <p className="font-bold text-slate-400 text-base leading-relaxed">
                {t(
                  'Your cart is empty champion! Equip your gear and start training.',
                  '¡Tu carrito está vacío, campeón! Equípate y comienza a entrenar.',
                  'Votre panier est vide champion ! Choisissez votre équipement et commencez l’entraînement.',
                  'سلة المشتريات فارغة حالياً! اختر معداتك القتالية المرقمة وابدأ رحلتك.'
                )}
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex gap-4 p-4 rounded-2xl bg-[#0C1411] border border-white/[0.08] hover:border-emerald-500/40 transition-all"
              >
                <div className="w-20 h-24 bg-[#050807] rounded-xl overflow-hidden flex-shrink-0 border border-emerald-500/30">
                  <img loading="lazy" decoding="async" src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-white text-sm font-anime truncate">{item.name}</h3>
                      <span className="text-sm font-black text-[#D4AF37] font-mono tabular-nums shrink-0" dir="ltr">
                        ${item.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-bold">{item.category}</span>
                      {item.selectedGender && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-black border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                          {item.selectedGender === 'men'
                            ? t('Men', 'Hombres', 'Hommes', 'رجالي')
                            : t('Women', 'Mujeres', 'Femmes', 'نسائي')}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-black/80 border border-white/15 text-[#D4AF37] font-black">
                          {item.selectedColor === 'white'
                            ? t('Pearl White', 'Blanco Perla', 'Blanc Perle', 'أبيض لؤلؤي')
                            : t('Obsidian Black', 'Negro Obsidiana', 'Noir Obsidienne', 'أسود أوبسيديان')}
                        </span>
                      )}
                      {item.size && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-slate-300 font-mono border border-white/10">
                          {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-xs text-red-400 hover:underline self-end font-bold transition-colors cursor-pointer mt-2"
                  >
                    {t('REMOVE ✖', 'ELIMINAR ✖', 'SUPPRIMER ✖', 'إزالة ✖')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.08] bg-[#050807]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t('TOTAL GEAR COST', 'COSTO TOTAL DEL EQUIPO', 'COÛT TOTAL DU MATÉRIEL', 'الإجمالي الكلي')}
            </span>
            <span className="text-2xl font-black text-[#D4AF37] font-mono tabular-nums" dir="ltr">
              ${total}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-5 text-center">
            {t(
              'Priority express tactical shipping available globally.',
              'Envío exprés táctico disponible para todo el mundo.',
              'Expédition express tactique disponible dans le monde entier.',
              'شحن دولي سريع ومجاني لجميع القطع المرقمة.'
            )}
          </p>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm font-anime rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('PROCEED TO CHECKOUT ⚡', 'CONTINUAR AL PAGO ⚡', 'PASSER LA COMMANDE ⚡', 'إتمام الطلب والدفع ⚡')}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
