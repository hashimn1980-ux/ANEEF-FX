import React, { useEffect, useRef, useState } from 'react';
import { Page, Language } from '../types';
import { ASSETS } from '../constants';

interface HomeProps {
  onNavigate: (page: Page) => void;
  language: Language;
}

const Home: React.FC<HomeProps> = ({ onNavigate, language }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Normalized -1 to 1
  const [cursorPos, setCursorPos] = useState({ x: 500, y: 500 }); // Pixel values
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // if (!containerRef.current) return; // Allow mouse tracking even if not hovering directly for smoothness
      
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized position for Parallax (-1 to 1)
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      
      setMousePos({ x, y });
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const content = {
    [Language.EN]: {
      tagline: "One Shot... Forever.",
      philHeading: "First impressions form digitally. We search people before we meet them.",
      philBody: "Your digital presence is your moment to shine. Never settle for 'good enough'—it is a strategic loss. We don't make images; we architect a presence that commands respect.",
      cta: "Application for Visual Audit",
      mandateTitle: "THE INSTITUTION",
      mandateSub: "For the Executive. Privacy Guaranteed.",
      mandateLink: "Discover The Mandate",
      archiveTitle: "THE ARCHIVE",
      archiveSub: "Hyper-Realism. Deconstructed Reality.",
      archiveLink: "Enter The Gallery",
      sysStatus: "SYSTEM::SECURE // AUDIT_READY"
    },
    [Language.AR]: {
      tagline: "لقطة واحدة... إلى الأبد",
      philHeading: "نُكوّن انطباعاتنا الأولى رقمياً، نبحث عن الآخرين قبل لقائهم.",
      philBody: "حضورك الرقمي هو لحظتك للتألق. لا ترضَ بـ \"الجيد بما فيه الكفاية\"—فهي خسارة استراتيجية. نحن لا نصنع صوراً؛ بل نهندس حضوراً يفرض الاحترام.",
      cta: "طلب تدقيق بصري",
      mandateTitle: "المؤسسة",
      mandateSub: "للتنفيذيين. خصوصية مضمونة.",
      mandateLink: "اكتشف المؤسسة",
      archiveTitle: "الأرشيف",
      archiveSub: "واقعية فائقة. تفكيك الواقع.",
      archiveLink: "ادخل المعرض",
      sysStatus: "النظام::آمن // جاهز للتدقيق"
    }
  };

  const txt = content[language];

  // Calculated Opacity for Scroll Fade
  const heroOpacity = Math.max(0, 1 - scrollY / 700);
  const heroScale = 1 + scrollY * 0.0005;

  return (
    <div className="w-full relative bg-navy-dark">
      
      {/* --- SECTION ONE: THE SOVEREIGN LENS HERO --- */}
      <section 
        ref={containerRef} 
        className="relative h-screen w-full overflow-hidden flex items-center justify-center perspective-1000"
      >
        
        {/* LAYER 1: Parallax Background (Moves Opposite to Mouse & Scrolls Slower) */}
        <div 
          className="absolute inset-[-5%] w-[110%] h-[110%] z-0 transition-transform duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)"
          style={{ 
            // Combined Mouse Parallax and Scroll Parallax
            transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -25 + scrollY * 0.5}px, 0) scale(${1.1 + (scrollY * 0.0002)})`,
            backgroundImage: `url('${ASSETS.HOME.HERO_BG}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4) contrast(1.1) saturate(0.8)'
          }}
        />

        {/* LAYER 2: The Darkness (Revealed by Spotlight) */}
        {/* Changed gradient colors to match Navy aesthetic better */}
        <div 
           className="absolute inset-0 z-10 bg-navy-dark mix-blend-hard-light opacity-95 pointer-events-none"
           style={{
             background: `radial-gradient(circle 500px at ${cursorPos.x}px ${cursorPos.y}px, rgba(20, 50, 80, 0.15) 0%, rgba(10, 28, 48, 0.98) 100%)`
           }}
        />

        {/* LAYER 3: Film Grain Texture */}
        <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url('${ASSETS.VAULT.TEXTURE}')` }}></div>

        {/* LAYER 4: The Content (Moves With Mouse for Depth & Fades on Scroll) */}
        <div 
          className="relative z-20 text-center px-4 flex flex-col items-center transition-transform duration-700 ease-out"
          style={{ 
            transform: `translate3d(${mousePos.x * 15}px, ${mousePos.y * 15}px, 0) scale(${heroScale})`,
            opacity: heroOpacity 
          }}
        >
          {/* Logo Assembly */}
          <div className="relative mb-8 group">
             {/* Glow behind logo */}
             <div className="absolute inset-0 bg-copper/10 blur-[80px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             <img 
               src={ASSETS.LOGO.HOME_HERO} 
               alt="ANEEF" 
               className="relative w-80 md:w-[32rem] lg:w-[42rem] h-auto object-contain drop-shadow-2xl brightness-110 contrast-125" 
             />
             
             {/* "Est" Divider */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-60 w-full justify-center">
                <div className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-copper to-transparent"></div>
                <span className="text-[10px] text-copper uppercase tracking-[0.4em]">Est. 2024</span>
                <div className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-copper to-transparent"></div>
             </div>
          </div>

          {/* Interactive Tagline */}
          <div className="mt-12 overflow-hidden">
            <h2 className="text-gold-foil font-serif italic text-2xl md:text-3xl tracking-wide animate-fade-in translate-y-0 opacity-100 transition-all duration-1000">
              {txt.tagline}
            </h2>
          </div>
        </div>

        {/* LAYER 5: Tactical HUD Element (Follows Mouse with Lag) */}
        <div 
          className="absolute z-30 pointer-events-none hidden md:block mix-blend-color-dodge opacity-60"
          style={{ 
            left: cursorPos.x, 
            top: cursorPos.y,
            transform: 'translate(40px, 40px)',
            transition: 'left 0.1s ease-out, top 0.1s ease-out'
          }}
        >
          <div className="flex flex-col gap-1">
             <div className="h-[1px] w-8 bg-copper/50"></div>
             <div className="text-[8px] text-copper/80 font-mono tracking-widest uppercase whitespace-nowrap">
               {txt.sysStatus}
             </div>
             <div className="text-[8px] text-white/30 font-mono tracking-widest">
               X:{Math.round(cursorPos.x)} Y:{Math.round(cursorPos.y)}
             </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 transition-opacity duration-300"
          style={{ opacity: heroOpacity }}
        >
          <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] mb-2">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-copper via-white/20 to-transparent animate-pulse-slow"></div>
        </div>
      </section>


      {/* --- SECTION TWO: PHILOSOPHY --- */}
      <section className="relative py-32 px-6 md:px-12 bg-navy border-t border-white/5 z-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-white/40 font-sans text-xs uppercase tracking-[0.2em] mb-8 block">{language === Language.AR ? 'الفلسفة' : 'The Philosophy'}</span>
          <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-white leading-tight mb-12">{txt.philHeading}</h2>
          <p className="font-sans text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-12">{txt.philBody}</p>
          <button onClick={() => onNavigate(Page.CONCIERGE)} className="px-10 py-5 border border-copper text-copper hover:bg-copper hover:text-white transition-all duration-500 ease-out text-xs uppercase tracking-[0.25em] font-bold">{txt.cta}</button>
        </div>
      </section>

      {/* --- SECTION THREE: DUAL GATEWAY --- */}
      <section className="relative h-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Institution */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative group cursor-pointer border-b md:border-b-0 md:border-r border-white/10" onClick={() => onNavigate(Page.INSTITUTION)}>
          <div className="absolute inset-0 bg-navy transition-all duration-1000 md:group-hover:w-[110%] z-0">
             <div className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${ASSETS.HOME.MANDATE_BG}')`}}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80"></div>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center md:items-start p-12 transition-all duration-500 group-hover:translate-x-4">
            <h3 className="font-serif text-4xl md:text-5xl text-white mb-4 relative">
              {txt.mandateTitle}
              <span className="absolute -left-8 top-0 text-copper opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-lg">›</span>
            </h3>
            <p className="font-sans text-white/60 text-sm uppercase tracking-widest mb-8">{txt.mandateSub}</p>
            <span className="text-copper text-xs border-b border-copper pb-1">{txt.mandateLink}</span>
          </div>
        </div>

        {/* Right: Vault */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative group cursor-pointer" onClick={() => onNavigate(Page.VAULT)}>
          <div className="absolute inset-0 bg-navy-light transition-all duration-1000 md:group-hover:w-[110%] md:group-hover:-translate-x-[10%] z-0">
             <div className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${ASSETS.HOME.ACCELERATE_BG}')`}}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80"></div>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center md:items-end p-12 text-right transition-all duration-500 group-hover:-translate-x-4">
            <h3 className="font-serif text-4xl md:text-5xl text-white mb-4 relative">
              {txt.archiveTitle}
              <span className="absolute -right-8 top-0 text-copper opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-lg">‹</span>
            </h3>
            <p className="font-sans text-white/60 text-sm uppercase tracking-widest mb-8">{txt.archiveSub}</p>
            <span className="text-copper text-xs border-b border-copper pb-1">{txt.archiveLink}</span>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;