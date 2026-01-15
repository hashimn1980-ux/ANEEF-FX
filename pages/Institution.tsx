import React, { useRef, useEffect, useState } from 'react';
import { ASSETS } from '../constants';
import { Language } from '../types';

// --- GLOBAL CACHE (Singleton Pattern) ---
const frameCount = 192;
const imageCache: HTMLImageElement[] = [];
let isGlobalInitializationStarted = false;
let isGlobalLoaded = false;

interface InstitutionProps {
  language: Language;
}

const Institution: React.FC<InstitutionProps> = ({ language }) => {
  // Cinematic Scroll Refs
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); 
  
  // Text Refs
  const textHeroRef = useRef<HTMLDivElement>(null);
  
  // State
  const [imagesLoaded, setImagesLoaded] = useState(isGlobalLoaded);
  const [loadProgress, setLoadProgress] = useState(isGlobalLoaded ? 100 : 0);

  // 1. URL Generation Helper
  const currentFrame = (index: number) => {
    const safeIndex = Math.min(index, frameCount - 1);
    const paddedIndex = safeIndex.toString().padStart(3, '0');
    return `https://fhshakiacgnsnsvbrsdz.supabase.co/storage/v1/object/public/Ayman/webp-frames/frame_${paddedIndex}_delay-0.04s.jpg`;
  };

  // 2. Preload Logic
  useEffect(() => {
    if (isGlobalLoaded) {
      setImagesLoaded(true);
      setLoadProgress(100);
      return;
    }

    // Safety Timeout: Force load completion after 5 seconds to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!isGlobalLoaded) {
        console.warn('Asset loading timed out. Forcing navigation.');
        isGlobalLoaded = true;
        setImagesLoaded(true);
      }
    }, 5000);

    if (!isGlobalInitializationStarted) {
      isGlobalInitializationStarted = true;
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        imageCache[i] = img;
      }
    }

    const checkProgress = () => {
      if (isGlobalLoaded) {
          setImagesLoaded(true);
          setLoadProgress(100);
          return;
      }

      let loadedCount = 0;
      let allComplete = true;

      for (let i = 0; i < frameCount; i++) {
        if (imageCache[i] && imageCache[i].complete) {
          loadedCount++;
        } else {
          allComplete = false;
        }
      }

      const progress = Math.round((loadedCount / frameCount) * 100);
      setLoadProgress(progress);

      if (allComplete && loadedCount === frameCount) {
        isGlobalLoaded = true;
        setImagesLoaded(true);
      } else {
        requestAnimationFrame(checkProgress);
      }
    };

    requestAnimationFrame(checkProgress);

    return () => clearTimeout(timeoutId);
  }, []);

  // 3. Canvas Rendering Logic
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imageCache[index];

    // If image isn't loaded yet (e.g. timeout forced entry), skip or use first frame if avail
    if (!ctx || !img || !img.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 4. Initial Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (imagesLoaded || isGlobalLoaded) renderFrame(0);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [imagesLoaded]);

  // 5. Cinematic Scroll Scrubbing Logic
  useEffect(() => {
    const wrapper = heroWrapperRef.current;
    const heroText = textHeroRef.current;

    if (!wrapper) return;

    const handleScrollScrub = () => {
      if (!imagesLoaded && !isGlobalLoaded) return;

      const rect = wrapper.getBoundingClientRect();
      const startScroll = rect.top; 
      const scrollDistance = wrapper.offsetHeight - window.innerHeight;
      
      let progress = 0;
      if (startScroll <= 0 && Math.abs(startScroll) < scrollDistance) {
        progress = Math.abs(startScroll) / scrollDistance;
      } else if (startScroll > 0) {
        progress = 0;
      } else {
        progress = 1;
      }

      // Canvas Update
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * (frameCount - 1))
      );
      requestAnimationFrame(() => renderFrame(frameIndex));

      // Hero Title Fade Out (0.0 -> 0.4)
      if (heroText) {
        let opacity = 1;
        if (progress > 0.15) opacity = 1 - ((progress - 0.15) / 0.2); 
        heroText.style.opacity = Math.max(0, opacity).toString();
        heroText.style.transform = `translateY(${progress * 50}px)`; // Reduced movement
        heroText.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
      }
    };

    window.addEventListener('scroll', handleScrollScrub);
    handleScrollScrub();

    return () => {
      window.removeEventListener('scroll', handleScrollScrub);
    };
  }, [imagesLoaded]);

  return (
    <div className="bg-navy min-h-screen">
      
      {/* 1. CINEMATIC HERO HEADER */}
      <section 
        ref={heroWrapperRef}
        className="relative h-[300vh] w-full"
      >
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black">
          
          {/* Loading Indicator */}
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-navy text-copper">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] animate-pulse mb-2">Initializing Assets</p>
                <p className="font-serif text-2xl">{loadProgress}%</p>
              </div>
            </div>
          )}

          {/* Canvas Layer */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full block transition-opacity duration-1000 ${imagesLoaded ? 'opacity-50' : 'opacity-0'}`}
          />
          
          <div className="absolute inset-0 bg-navy/60 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/80 opacity-80 pointer-events-none"></div>

          {/* Stage 1: Hero Title (CENTERED) */}
          <div ref={textHeroRef} className="absolute inset-0 flex items-center justify-center z-10 p-12 transition-opacity duration-100 ease-out">
              <div className="text-center max-w-4xl">
                <div className="mb-4 flex items-center justify-center gap-4 opacity-0 animate-fade-in" style={{animationDelay: '1s'}}>
                   <div className="w-12 h-px bg-copper"></div>
                   <span className="text-copper text-xs font-bold tracking-[0.3em] uppercase">Est. 2024</span>
                   <div className="w-12 h-px bg-copper"></div>
                </div>
                
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6 animate-fade-in">
                    {language === Language.AR ? 'المؤسسة' : 'THE INSTITUTION'}
                </h1>
                <p className="text-white/60 font-sans text-lg uppercase tracking-[0.4em] animate-fade-in" style={{animationDelay: '0.5s'}}>
                    {language === Language.AR ? 'حُراس السيادة البصرية' : 'Guardians of Visual Sovereignty'}
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* 2. THE DEFINITION - REDESIGNED */}
      <section className="min-h-screen relative z-40 -mt-24 border-t border-white/10 flex items-center py-24 px-6 md:px-12" style={{ backgroundColor: '#050505' }}>
         <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-32 relative">
            
            {/* Left: Arabic Essence */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end text-center lg:text-right order-2 lg:order-1">
                {/* 
                   UPDATED FONT SIZE:
                   Reduced to ensure it fits without cutting off. 
                   Added 'leading-relaxed' and padding to prevent clipping of diacritics.
                */}
                <h2 className="font-arabic text-[6rem] sm:text-[8rem] md:text-[9rem] leading-relaxed text-gold-foil mb-4 select-none drop-shadow-2xl py-4">
                  أنيف
                </h2>
                <div className="relative flex flex-col items-center lg:items-end">
                  <h3 className="font-arabic text-2xl md:text-4xl text-white mb-6 leading-tight" dir="rtl">
                    لم يُمَس. نقي. فريد.
                  </h3>
                  <div className="font-arabic text-lg md:text-xl text-white/80 leading-relaxed max-w-lg space-y-4" dir="rtl">
                    <p>
                      أنيف يمثل ما هو جديد، أصيل، ويُختبر لأول مرة. 
                      كأرض لم تُحرث من قبل، أو فن يرفض أن يُكرر.
                    </p>
                    <p>
                      يحمل نفَساً من الكبرياء الراقي — رفضاً لأن يكون عادياً. 
                      كل صورة أخلقها هي "أنيف": لحظة فريدة، لن تتكرر أبداً.
                    </p>
                  </div>
                  <p className="font-serif text-copper/60 text-sm tracking-widest mt-8 opacity-60">
                    (Arabic Pronunciation: A-neef)
                  </p>
                </div>
            </div>

            {/* Center Divider (Desktop Only) */}
            <div className="hidden lg:block w-[1px] h-96 bg-gradient-to-b from-transparent via-white/10 to-transparent order-2"></div>

            {/* Right: English Essence */}
            <div className="w-full lg:w-1/2 text-left order-1 lg:order-3">
              <span className="text-copper text-xs uppercase tracking-[0.4em] mb-6 block font-bold animate-pulse-slow">The Essence</span>
              
              <h3 className="font-serif text-5xl md:text-6xl text-white leading-[1.1] mb-10">
                UNTOUCHED.<br/>
                PRISTINE.<br/>
                <span className="italic font-light text-white/50">UNIQUE.</span>
              </h3>
              
              <div className="space-y-8 text-white/60 font-sans text-base md:text-lg leading-relaxed max-w-lg border-l border-copper/30 pl-8">
                <p>
                  <span className="text-white font-bold">ANEEF</span> represents that which is fresh, pristine, and encountered for the very first time. Like land that has never been tilled, or art that refuses to be replicated.
                </p>
                <p>
                  It carries a breath of sophisticated pride—a refusal to be ordinary. Every image I create is "Aneef": a singular moment, never to be replicated.
                </p>
              </div>
            </div>

         </div>
      </section>

      {/* 4. THE FOUNDER'S GENESIS - DUAL LANGUAGE LAYOUT */}
      <section className="py-24 border-t border-white/5 bg-navy relative z-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Top: Bilingual Headings */}
          <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
             <div>
                <h3 className="text-copper text-xs uppercase tracking-[0.3em] mb-4 font-bold">
                   The Founder's Genesis
                </h3>
                <h2 className="font-serif text-5xl md:text-6xl text-white leading-tight">
                  Born from the <br/><span className="italic text-white/50">Necessity of Silence.</span>
                </h2>
             </div>
             <div className="text-right">
                <h2 className="font-arabic text-3xl md:text-4xl text-white/80 leading-tight">
                   وُلدت من <br/><span className="text-copper">ضرورة الصمت.</span>
                </h2>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
             
             {/* Left: The Dual-Language Dossier Box */}
             <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="bg-[#0A1826] border border-white/10 p-8 md:p-12 relative">
                   {/* Decorative Corner */}
                   <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-copper"></div>
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-copper"></div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* English Quote */}
                      <div className="text-left">
                         <div className="w-8 h-[1px] bg-copper mb-6"></div>
                         <p className="text-white/90 font-sans text-lg italic leading-relaxed">
                           "We don't create images; we craft digital sovereignty for those who refuse to be just a copy."
                         </p>
                         <p className="mt-6 text-xs uppercase tracking-widest text-white/40">
                            Ayman Al-Majali, Founder
                         </p>
                      </div>

                      {/* Arabic Quote */}
                      <div className="text-right border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                         <div className="w-8 h-[1px] bg-copper mb-6 ml-auto"></div>
                         <p className="text-white/90 font-arabic text-lg leading-relaxed" dir="rtl">
                           "نحن لا نبتكر صوراً؛ نحن نصيغ سيادة رقمية لأولئك الذين يرفضون أن يكونوا مجرد نسخة."
                         </p>
                         <p className="mt-6 text-xs uppercase tracking-widest text-white/40 font-arabic">
                            المؤسس ايمن المجالي
                         </p>
                      </div>
                   </div>
                </div>

                {/* Additional Context Removed as requested */}
             </div>

             {/* Right: Image */}
             <div className="lg:col-span-5 order-1 lg:order-2">
                <div className="relative w-full aspect-[3/4] p-2 bg-navy-light border border-white/5 mx-auto">
                   <div className="absolute inset-0 bg-navy/10 mix-blend-overlay z-10"></div>
                   <img 
                     src={ASSETS.INSTITUTION.FOUNDER_PORTRAIT} 
                     alt="Ayman Al-Majali" 
                     className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
                   />
                   <div className="absolute -bottom-6 -left-6 bg-navy border border-copper px-8 py-4 shadow-2xl z-20">
                      <span className="text-gold-foil font-serif text-xl italic">Est. 2024</span>
                   </div>
                </div>
             </div>

          </div>
          
        </div>
      </section>

    </div>
  );
};

export default Institution;