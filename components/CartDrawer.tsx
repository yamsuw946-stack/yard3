/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { Language } from '../i18n';

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
  const isFr = currentLang === 'fr';
  const isEs = currentLang === 'es';
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#0A0B10]/80 backdrop-blur-md z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 border-l-2 w-full md:w-[480px] bg-[#12131C] text-white z-[70] shadow-[0_0_50px_rgba(255,0,122,0.5)] transform transition-transform duration-500 ease-in-out border-[#FF007A] flex flex-col text-left dir-ltr ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#FF007A]/30 bg-[#1A1C2B]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h2 className="text-xl font-black font-anime text-white">
              {isFr 
                ? `PANIER D’ÉQUIPEMENT (${items.length})` 
                : isEs 
                ? `CARRITO DE EQUIPAMIENTO (${items.length})` 
                : `CHAMPION GEAR CART (${items.length})`}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-[#FF007A] hover:text-white transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-6xl animate-bounce">⚡</span>
              <p className="font-bold text-gray-400 text-lg">
                {isFr 
                  ? 'Votre panier est vide champion ! Choisissez votre équipement et commencez l’entraînement.' 
                  : isEs 
                  ? '¡Tu carrito está vacío, campeón! Equípate y comienza a entrenar.' 
                  : 'Your cart is empty champion! Equip your gear and start training.'}
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
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-white text-base font-anime">{item.name}</h3>
                      <span className="text-sm font-black text-[#FFE600] font-mono" dir="ltr">${item.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400 font-bold">{item.category}</span>
                      {item.selectedGender && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                          item.selectedGender === 'men' 
                            ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40' 
                            : 'bg-[#FF007A]/10 text-[#FF007A] border-[#FF007A]/40'
                        }`}>
                          {item.selectedGender === 'men' 
                            ? (isFr ? 'Hommes ⚔️' : isEs ? 'Hombres ⚔️' : 'Men ⚔️') 
                            : (isFr ? 'Femmes 🌸' : isEs ? 'Mujeres 🌸' : 'Women 🌸')}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-black/80 border border-gray-700 text-[#FFE600] font-black">
                          {item.selectedColor === 'white' 
                            ? (isFr ? 'Blanc Perle' : isEs ? 'Blanco Perla' : 'Pearl White') 
                            : (isFr ? 'Noir Obsidienne' : isEs ? 'Negro Obsidiana' : 'Obsidian Black')}
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
                    {isFr ? 'SUPPRIMER ✖' : isEs ? 'ELIMINAR ✖' : 'REMOVE GEAR ✖'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-[#1A1C2B]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-gray-300">
              {isFr ? 'COÛT TOTAL DU MATÉRIEL' : isEs ? 'COSTO TOTAL DEL EQUIPO' : 'TOTAL GEAR COST'}
            </span>
            <span className="text-2xl font-black text-[#FFE600] font-mono tracking-tight neon-text-yellow" dir="ltr">${total}</span>
          </div>
          <p className="text-xs text-gray-400 mb-6 text-center">
            {isFr 
              ? 'Expédition express tactique disponible dans le monde entier.' 
              : isEs 
              ? 'Envío exprés táctico disponible para todo el mundo.' 
              : 'Priority express tactical shipping available globally.'}
          </p>
          <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full py-4 bg-[#FFE600] hover:bg-white text-black font-black text-base font-anime rounded-xl shadow-[0_0_20px_rgba(255,230,0,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFr 
              ? 'PASSER LA COMMANDE ⚡' 
              : isEs 
              ? 'CONTINUAR AL PAGO ⚡' 
              : 'PROCEED TO CHECKOUT ⚡'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
