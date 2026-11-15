/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ABOUT_SQUAD_IMAGE,
  handleImageError
} from '../constants';
import { Language, tr } from '../i18n';

interface AboutProps {
  currentLang?: Language;
}

const About: React.FC<AboutProps> = ({ currentLang = 'en' }) => {
  const isAr = currentLang === 'ar';

  return (
    <section id="about" className="bg-[#07080C] py-20 relative w-full max-w-full overflow-hidden overflow-x-hidden">
      <div className="max-w-[1600px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-16 w-full max-w-full">
          <div className={`lg:w-1/2 flex flex-col items-start space-y-6 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              <span className="w-5 h-px bg-[#D4AF37]" />
              <span>
                {tr(currentLang, {
                  en: 'PERFORMANCE PHILOSOPHY · YARD 300',
                  es: 'FILOSOFÍA DE RENDIMIENTO · YARD 300',
                  fr: 'PHILOSOPHIE DE PERFORMANCE · YARD 300',
                  ar: 'فلسفة التميز الرياضي · YARD 300'
                })}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {tr(currentLang, {
                en: 'FORGED IN PRECISION, ENGINEERED TO ENDURE.',
                es: 'FORJADO EN PRECISIÓN, DISEÑADO PARA RESISTIR.',
                fr: 'FORGÉ DANS LA PRÉCISION, CONÇU POUR DURER.',
                ar: 'صُممت من الانضباط الصارم، وهُندست لكسر الحدود البشرية.'
              })}
            </h2>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              {tr(currentLang, {
                en: 'At YARD 300, we unite materials engineering with clinical sports physiology to build high-precision apparel, recovery habitats, and combat performance metrics.',
                es: 'En YARD 300 unimos la ingeniería de materiales con la fisiología deportiva clínica para crear equipamiento técnico, santuarios de recuperación y métricas de combate.',
                fr: 'Chez YARD 300, nous unissons l’ingénierie textile et la physiologie clinique du sport pour concevoir des tenues de pointe, des refuges de récupération et des mesures de combat.',
                ar: 'في YARD 300، نجمع بين هندسة المواد المتقدمة وعلم الفسيولوجيا العصبية لتصنيع عتاد وبيئات تدريب مخصصة للنخبة.'
              })}
            </p>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              {tr(currentLang, {
                en: 'Our visual architecture is powered by bio-enhanced athletic modeling, real-time ACWR load intelligence, and restrained obsidian craftsmanship.',
                es: 'Nuestra arquitectura se basa en modelado atlético bio-mejorado, inteligencia de carga ACWR en tiempo real y artesanía obsidiana de alta precisión.',
                fr: 'Notre architecture repose sur la modélisation athlétique bio-optimisée, l’intelligence de charge ACWR en direct et un savoir-faire obsidien raffiné.',
                ar: 'تصاميمنا مبنية على بيانات الأداء الفعلي والذكاء الحيوي لتحسين الجاهزية العضلية وحماية الأوتار في أعلى درجات الضغط التدريبي.'
              })}
            </p>

            <div className="p-6 rounded-2xl bg-[#0C0E14] border border-white/[0.08] w-full">
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-2">
                {tr(currentLang, {
                  en: 'CORE PRINCIPLE #1:',
                  es: 'PRINCIPIO FUNDAMENTAL #1:',
                  fr: 'PRINCIPE FONDAMENTAL #1 :',
                  ar: 'المبدأ الأساسي #1:'
                })}
              </span>
              <p className="text-white font-semibold text-base md:text-lg">
                {tr(currentLang, {
                  en: '"True competition is never against others — it is against who you were yesterday."',
                  es: '"La verdadera competencia nunca es contra otros, sino contra quien eras ayer."',
                  fr: '"La vraie compétition n’est jamais contre les autres, mais contre celui que vous étiez hier."',
                  ar: '"المنافسة الحقيقية ليست ضد الآخرين، بل ضد معيارك بالأمس."'
                })}
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full">
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] group">
              <img
                src={ABOUT_SQUAD_IMAGE}
                alt="YARD 300 AI Bio-Enhanced Champions Squad"
                onError={handleImageError}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-5 right-5 left-5 flex justify-between items-end backdrop-blur-md bg-[#0C0E14]/85 border border-white/[0.08] p-4 rounded-xl">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {tr(currentLang, {
                      en: 'YARD 300 PERFORMANCE COLLECTIVE',
                      es: 'COLECTIVO DE RENDIMIENTO YARD 300',
                      fr: 'COLLECTIF PERFORMANCE YARD 300',
                      ar: 'نخبة أبطال YARD 300'
                    })}
                  </h4>
                  <p className="text-xs text-[#D4AF37] font-mono">
                    {tr(currentLang, {
                      en: 'Global Performance Architecture · 2026–2027',
                      es: 'Arquitectura Global de Rendimiento · 2026–2027',
                      fr: 'Architecture Performance Mondiale · 2026–2027',
                      ar: 'مجمع الأداء العالمي 2026–2027'
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#D4AF37] text-[#07080C] text-xs font-mono font-bold rounded-lg">
                  S-RANK LAB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-full">
          <div className="p-7 rounded-2xl bg-[#0C0E14] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors">
            <div className="text-xs font-mono font-bold text-[#D4AF37] mb-3">01 // BIOMETRICS</div>
            <h3 className="text-xl font-bold text-white mb-3">
              {tr(currentLang, {
                en: 'RELENTLESS PRECISION',
                es: 'PRECISIÓN IMPLACABLE',
                fr: 'PRÉCISION ABSOLUE',
                ar: 'التدريب القائم على البيانات'
              })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tr(currentLang, {
                en: 'Targeted recovery protocols and biometric tracking keep neuromuscular output at peak operational load.',
                es: 'Los protocolos de recuperación y seguimiento biométrico mantienen la potencia neuromuscular en carga óptima.',
                fr: 'Des protocoles de récupération ciblés et le suivi biométrique maintiennent la puissance neuromusculaire au sommet.',
                ar: 'التدريب الذكي والاستشفاء الموجه هما الأساس لإبقاء عضلاتك وجهازك العصبي في ذروة الجاهزية.'
              })}
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#0C0E14] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors">
            <div className="text-xs font-mono font-bold text-[#10B981] mb-3">02 // CRAFTSMANSHIP</div>
            <h3 className="text-xl font-bold text-white mb-3">
              {tr(currentLang, {
                en: 'OBSIDIAN ARCHITECTURE',
                es: 'ARQUITECTURA OBSIDIANA',
                fr: 'ARCHITECTURE OBSIDIENNE',
                ar: 'تصميم الأوبسيديان الفاخر'
              })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tr(currentLang, {
                en: 'Understated architectural tailoring and resilient textiles crafted for discerning global athletes.',
                es: 'Sastrería técnica minimalista y textiles de alta resistencia diseñados para atletas exigentes.',
                fr: 'Coupe architecturale épurée et textiles techniques conçus pour des athlètes d’exigence mondiale.',
                ar: 'جماليات هادئة وأقمشة تقنية عالية الجودة صُممت للرياضيين أصحاب المعايير الرفيعة.'
              })}
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#0C0E14] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-colors">
            <div className="text-xs font-mono font-bold text-[#D4AF37] mb-3">03 // LONGEVITY</div>
            <h3 className="text-xl font-bold text-white mb-3">
              {tr(currentLang, {
                en: 'SUSTAINED VICTORY',
                es: 'VICTORIA SOSTENIDA',
                fr: 'VICTOIRE DURABLE',
                ar: 'الاستدامة والتفوق البدني'
              })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tr(currentLang, {
                en: 'Every garment and algorithmic insight works in concert to protect longevity and elevate daily performance.',
                es: 'Cada prenda y métrica algorítmica trabajan en conjunto para proteger tu longevidad y elevar el rendimiento.',
                fr: 'Chaque pièce et indicateur algorithmique protègent votre longévité tout en élevant votre performance quotidienne.',
                ar: 'كل منتج وكل خوارزمية صُممت لحماية المفاصل وتعظيم الأداء على المدى الطويل.'
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
