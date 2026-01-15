import React, { useEffect, useState } from 'react';
import { Page, Language } from '../types';

interface ServicesProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const Services: React.FC<ServicesProps> = ({ onNavigate, language }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Content Configuration
  const content = {
    [Language.EN]: {
      title: "Services",
      commission: {
        title: "COMMISSION",
        subtitle: "One session. Beautifully crafted imagery for your brand.",
        idealTitle: "Ideal for:",
        list: [
          "Executive & Leadership Portraits",
          "Personal Branding",
          "Milestone Events & Special Occasions"
        ],
        cta: "One-Time Booking"
      },
      retainer: {
        title: "RETAINER",
        subtitle: "Continuous photography and care for your visual presence.",
        idealTitle: "Ideal for:",
        list: [
          "Ongoing Personal Branding",
          "Regular Content Creation",
          "Sustained Visual Identity Management"
        ],
        cta: "Apply for Membership"
      }
    },
    [Language.AR]: {
      title: "خدماتنا",
      commission: {
        title: "التكليف",
        subtitle: "جلسة واحدة. صور مصممة بإتقان لعلامتك.",
        idealTitle: "مثالي لـ:",
        list: [
          "صور القيادات والمسؤولين التنفيذيين",
          "بناء العلامة الشخصية",
          "المناسبات الخاصة واللحظات المميزة"
        ],
        cta: "حجز لمرة واحدة"
      },
      retainer: {
        title: "الرعاية المستمرة",
        subtitle: "تصوير مستمر ورعاية دائمة لحضورك البصري.",
        idealTitle: "مثالي لـ:",
        list: [
          "بناء مستمر للعلامة الشخصية",
          "إنتاج محتوى دوري",
          "إدارة متكاملة للهوية البصرية"
        ],
        cta: "قدّم طلب العضوية"
      }
    }
  };

  const txt = content[language];

  return (
    <div className="bg-navy min-h-screen pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
      
      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-1000 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="font-serif text-5xl md:text-6xl text-gold-foil uppercase tracking-wider mb-4">{txt.title}</h1>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-copper to-transparent mx-auto"></div>
      </div>

      {/* Split Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-stretch">
        
        {/* Card A: COMMISSION */}
        <div 
          className={`
            relative bg-navy-light border border-gold/30 p-12 md:p-16 flex flex-col items-center text-center justify-between
            transition-all duration-500 delay-200 transform group cursor-default
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
            hover:scale-[1.02] hover:border-gold hover:shadow-[0_0_30px_rgba(236,146,19,0.1)]
          `}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="mb-8 w-full">
            <span className="material-symbols-outlined text-5xl text-white/80 mb-6 font-thin transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-gold">visibility</span>
            <h2 className="font-serif text-3xl text-white mb-4 group-hover:text-gold-foil transition-colors duration-300">
              {txt.commission.title}
            </h2>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6 group-hover:bg-gold/50 transition-colors duration-300"></div>
            <p className="font-sans text-white/70 leading-relaxed max-w-sm mx-auto mb-8">
              {txt.commission.subtitle}
            </p>

            {/* Ideal For List */}
            <div className={`text-left ${language === Language.AR ? 'text-right' : ''} bg-navy-dark/30 p-6 border border-white/5`}>
               <h4 className="text-copper text-xs uppercase tracking-widest mb-4 font-bold">{txt.commission.idealTitle}</h4>
               <ul className="space-y-3">
                 {txt.commission.list.map((item, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-sm text-white/80 font-sans">
                     <span className="mt-1.5 w-1 h-1 bg-gold rounded-full flex-shrink-0"></span>
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <button 
            onClick={() => onNavigate(Page.CONCIERGE)}
            className="w-full px-8 py-4 border border-gold text-white transition-all duration-300 uppercase text-xs font-bold tracking-[0.2em]
            hover:bg-gold hover:text-navy hover:shadow-[0_0_20px_rgba(236,146,19,0.3)] hover:-translate-y-1 mt-6"
          >
            {txt.commission.cta}
          </button>
        </div>

        {/* Card B: RETAINER */}
        <div 
          className={`
            relative bg-navy-lighter shadow-2xl p-12 md:p-16 flex flex-col items-center text-center justify-between
            transition-all duration-500 delay-400 transform border border-transparent group cursor-default
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
             hover:scale-[1.02] hover:border-gold hover:shadow-[0_0_30px_rgba(236,146,19,0.15)]
          `}
        >
          {/* Gold Accent Overlay */}
          <div className="absolute inset-0 border border-gold/10 pointer-events-none group-hover:border-transparent transition-colors duration-300"></div>
          
          <div className="mb-8 w-full">
            <span className="material-symbols-outlined text-5xl text-gold mb-6 font-thin transition-transform duration-500 group-hover:-translate-y-2 group-hover:text-gold-light">diamond</span>
            <h2 className="font-serif text-3xl text-gold-foil mb-4">
              {txt.retainer.title}
            </h2>
            <div className="w-12 h-px bg-gold/40 mx-auto mb-6 group-hover:bg-gold transition-colors duration-300"></div>
            <p className="font-sans text-white/90 leading-relaxed max-w-sm mx-auto mb-8">
              {txt.retainer.subtitle}
            </p>

            {/* Ideal For List */}
            <div className={`text-left ${language === Language.AR ? 'text-right' : ''} bg-navy/40 p-6 border border-gold/20`}>
               <h4 className="text-gold text-xs uppercase tracking-widest mb-4 font-bold">{txt.retainer.idealTitle}</h4>
               <ul className="space-y-3">
                 {txt.retainer.list.map((item, idx) => (
                   <li key={idx} className="flex items-start gap-3 text-sm text-white/90 font-sans">
                     <span className="mt-1.5 w-1 h-1 bg-gold rounded-full flex-shrink-0"></span>
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          <button 
             onClick={() => onNavigate(Page.CONCIERGE)}
             className="w-full px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-navy-dark font-bold 
             transition-all duration-300 uppercase text-xs tracking-[0.2em]
             hover:bg-none hover:bg-gold hover:text-navy-dark hover:shadow-[0_0_30px_rgba(191,155,48,0.6)] hover:-translate-y-1 mt-6"
          >
            {txt.retainer.cta}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Services;