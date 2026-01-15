import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { ASSETS } from '../constants';
import { Language } from '../types';

interface VaultProps {
  language: Language;
}

type Collection = 'POWER' | 'VOYAGE' | 'ESSENCE' | 'SINGULARITY';

/* --- HOOKS --- */
const useParallax = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10 deg
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return;
      // Clamp values
      const x = Math.min(Math.max(e.gamma, -20), 20);
      const y = Math.min(Math.max(e.beta, -20), 20);
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return offset;
};

/* --- SUB-COMPONENTS --- */

// 1. Biometric Entry Animation - "The Sovereign Reveal"
const BiometricGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [scanLineTop, setScanLineTop] = useState(0);
  const [status, setStatus] = useState('AUTHENTICATING...');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Phase 1: Scan
    const interval = setInterval(() => {
      setScanLineTop(prev => (prev + 3) % 100);
    }, 16);

    // Phase 2: Authenticate
    setTimeout(() => {
      setStatus('ACCESS GRANTED');
    }, 1500);

    // Phase 3: Open (Shutter)
    setTimeout(() => {
      clearInterval(interval);
      setIsOpen(true);
      setTimeout(onUnlock, 1200); // Wait for animation
    }, 2200);

    return () => clearInterval(interval);
  }, [onUnlock]);

  return (
    <div className={`fixed inset-0 z-[60] flex flex-col items-center justify-center font-mono text-[10px] tracking-[0.3em] text-[#F5F5F0] pointer-events-none`}>
      
      {/* Top Shutter */}
      <div className={`absolute top-0 left-0 w-full bg-[#0A0A0A] z-50 transition-all duration-[1000ms] ease-[cubic-bezier(0.8,0,0.2,1)]
        ${isOpen ? '-translate-y-full' : 'h-1/2 translate-y-0'}`}>
         <div className="absolute bottom-0 w-full h-[1px] bg-[#D4AF37]/30"></div>
      </div>

      {/* Bottom Shutter */}
      <div className={`absolute bottom-0 left-0 w-full bg-[#0A0A0A] z-50 transition-all duration-[1000ms] ease-[cubic-bezier(0.8,0,0.2,1)]
        ${isOpen ? 'translate-y-full' : 'h-1/2 translate-y-0'}`}>
         <div className="absolute top-0 w-full h-[1px] bg-[#D4AF37]/30"></div>
      </div>

      {/* Content Layer (Fades out when opening) */}
      <div className={`relative z-[60] flex flex-col items-center transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="relative w-64 h-64 border border-white/5 flex items-center justify-center overflow-hidden bg-black/50 backdrop-blur-sm">
          {/* Scan Line */}
          <div 
            className="absolute left-0 w-full h-[1px] bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] z-10"
            style={{ top: `${scanLineTop}%` }}
          ></div>
          
          <div className="relative z-20 text-center">
            <span className="material-symbols-outlined text-4xl mb-4 text-[#D4AF37] opacity-80 animate-pulse">fingerprint</span>
            <p className={status === 'ACCESS GRANTED' ? 'text-[#D4AF37] animate-pulse' : 'text-white/40'}>{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Singularity Artifact Card (Touch Lume + Gyro Seal)
const SingularityArtifact = ({ item, index, parallax }: { item: any, index: number, parallax: {x: number, y: number} }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--lume-x', `${x}px`);
    cardRef.current.style.setProperty('--lume-y', `${y}px`);
    cardRef.current.style.setProperty('--lume-opacity', '1');
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--lume-opacity', '0');
  };

  return (
    <div className="w-full max-w-md mx-auto mb-32 relative group perspective-1000">
      
      {/* 4:5 Aspect Ratio Container */}
      <div 
        ref={cardRef}
        className="relative w-full aspect-[4/5] overflow-hidden bg-[#050505] cursor-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.9)'
        }}
      >
         {/* Ghost Gradient Border */}
         <div className="absolute inset-0 border border-white/5 z-20 pointer-events-none"></div>

         {/* Base Image */}
         <img 
           src={item.src} 
           alt="Singularity Artifact" 
           className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.9] grayscale-[0.1] transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
         />

         {/* Touch Lume Layer (Flashlight Effect) */}
         <div 
           className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300 z-10"
           style={{
             opacity: 'var(--lume-opacity, 0)',
             background: 'radial-gradient(circle 250px at var(--lume-x, 50%) var(--lume-y, 50%), rgba(255,255,255,0.15), transparent 100%)'
           }}
         />

         {/* Inner Shadow / Vignette */}
         <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none z-10"></div>

         {/* 1/1 Seal - Bottom Right INSIDE the frame */}
         <div 
           className="absolute bottom-6 right-6 z-30 flex items-center justify-center pointer-events-none"
           style={{
             transform: `rotateX(${parallax.y * 0.5}deg) rotateY(${parallax.x * 0.5}deg)`,
             transition: 'transform 0.1s ease-out',
           }}
         >
            <div className="relative border border-[#D4AF37]/60 px-3 py-1 bg-black/40 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent opacity-50"></div>
               <span className="text-[#D4AF37] text-[10px] font-serif italic tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                 1/1
               </span>
            </div>
         </div>
      </div>

      {/* Metadata */}
      <div className="mt-8 flex justify-between items-end px-2 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
         <div className="flex flex-col gap-2">
            <span className="text-[#F5F5F0] font-sans text-[8px] uppercase tracking-[0.4em]">
              Archive {String(index + 1).padStart(3, '0')}
            </span>
            <span className="text-[#F5F5F0] font-serif text-sm tracking-wide">
              {item.metadata[3].val}
            </span>
         </div>
         <div className="h-[1px] flex-grow mx-6 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         <span className="text-[#F5F5F0] text-[8px] uppercase tracking-[0.3em]">Verified</span>
      </div>
    </div>
  );
};


/* --- HIGH PERFORMANCE ZOOM VIEWER --- */
const ZoomModal = ({ src, onClose, isSingularity = false }: { src: string, onClose: () => void, isSingularity?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scaleDisplay, setScaleDisplay] = useState(100); 
  
  const state = useRef({
    scale: 1, // Start scale
    panning: false,
    pointX: 0,
    pointY: 0,
    startX: 0,
    startY: 0
  });

  const updateTransform = () => {
    if (imgRef.current) {
      const { pointX, pointY, scale } = state.current;
      imgRef.current.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }
  };

  // Macro-Drill Entrance Effect
  useEffect(() => {
    if (isSingularity && imgRef.current) {
        // Start zoomed in significantly
        imgRef.current.style.transition = 'none';
        state.current.scale = 2.5; 
        updateTransform();

        // Force reflow
        void imgRef.current.offsetWidth;

        // Animate out to 1.5 (still zoomed but viewable)
        imgRef.current.style.transition = 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        state.current.scale = 1.2;
        updateTransform();
    }
  }, [isSingularity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = state.current;
      const delta = -Math.sign(e.deltaY) * 0.2;
      const newScale = Math.min(Math.max(1, s.scale + delta), 5);
      s.scale = newScale;
      setScaleDisplay(Math.round(newScale * 100));
      updateTransform();
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    state.current.panning = true;
    state.current.startX = e.clientX - state.current.pointX;
    state.current.startY = e.clientY - state.current.pointY;
    if (imgRef.current) {
        imgRef.current.style.transition = 'none'; // Disable transition for drag
        imgRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!state.current.panning) return;
    e.preventDefault();
    state.current.pointX = e.clientX - state.current.startX;
    state.current.pointY = e.clientY - state.current.startY;
    updateTransform();
  };

  const handlePointerUp = () => {
    state.current.panning = false;
    if (imgRef.current) {
        imgRef.current.style.cursor = 'grab';
        imgRef.current.style.transition = 'transform 0.1s ease-out'; // Re-enable slight smoothing
    }
  };

  const handleZoomBtn = (delta: number) => {
    const s = state.current;
    const newScale = Math.min(Math.max(1, s.scale + delta), 5);
    s.scale = newScale;
    if (newScale === 1) { s.pointX = 0; s.pointY = 0; }
    setScaleDisplay(Math.round(newScale * 100));
    if (imgRef.current) imgRef.current.style.transition = 'transform 0.3s ease-out';
    updateTransform();
  };

  const handleReset = () => {
     state.current = { ...state.current, scale: 1, pointX: 0, pointY: 0 };
     setScaleDisplay(100);
     if (imgRef.current) imgRef.current.style.transition = 'transform 0.5s ease-out';
     updateTransform();
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden animate-fade-in backdrop-blur-sm touch-none
        ${isSingularity ? 'bg-[#0A0A0A]' : 'bg-black/95'}`}
    >
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-[1px] ${isSingularity ? 'bg-[#D4AF37]/50' : 'bg-copper/50'}`}></div>
           <span className={`${isSingularity ? 'text-[#D4AF37]' : 'text-copper/80'} text-[10px] tracking-[0.3em] uppercase font-mono`}>
             {isSingularity ? 'Singularity // Macro Analysis' : 'Audit Mode // High Resolution'}
           </span>
        </div>
        <button 
          onClick={onClose} 
          className="pointer-events-auto w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-copper transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div 
        className="relative w-full h-full flex items-center justify-center touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleReset}
      >
        <img 
          ref={imgRef}
          src={src} 
          className="max-w-none origin-center select-none cursor-grab"
          draggable={false}
          style={{ maxHeight: '85vh', maxWidth: '90vw', transform: 'scale(1) translate(0px, 0px)', willChange: 'transform' }}
          alt="Zoomed Detail"
        />
      </div>

      <div className="absolute bottom-10 flex gap-4 z-50 pointer-events-auto">
        <button 
          onClick={() => handleZoomBtn(-0.5)} 
          className={`w-12 h-12 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all backdrop-blur-md ${isSingularity ? 'hover:border-[#D4AF37] hover:text-[#D4AF37]' : 'hover:border-copper hover:text-copper'}`}
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <div 
          onClick={handleReset}
          className="h-12 flex items-center justify-center px-4 bg-black/40 border border-white/10 rounded-full font-mono text-xs text-white/60 backdrop-blur-md min-w-[80px] cursor-pointer hover:text-white"
        >
          {scaleDisplay}%
        </div>
        <button 
          onClick={() => handleZoomBtn(0.5)} 
          className={`w-12 h-12 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center transition-all backdrop-blur-md ${isSingularity ? 'hover:border-[#D4AF37] hover:text-[#D4AF37]' : 'hover:border-copper hover:text-copper'}`}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
};

const Vault: React.FC<VaultProps> = ({ language }) => {
  const [selectedNode, setSelectedNode] = useState<Collection | null>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClosingGesture, setIsClosingGesture] = useState(false);
  
  // Singularity Specific State
  const [isSingularityUnlocked, setIsSingularityUnlocked] = useState(false);
  const parallax = useParallax();

  // Gesture Hook for Swipe to Close
  const bind = useDrag(({ swipe: [swipeX, swipeY], tap, down, movement: [mx, my] }) => {
    if (tap) return; 
    
    // Feedback during drag
    if (down && my > 100) {
      setIsClosingGesture(true);
    } else {
      setIsClosingGesture(false);
    }

    // Trigger close on swipe down
    if (swipeY === 1 || (down === false && my > 150)) {
       handleSwitchCategory(null);
       setIsClosingGesture(false);
    }
  }, { 
    filterTaps: true, 
    axis: 'y',
    bounds: { top: 0 },
    rubberband: true
  });

  const archiveWorld = useMemo(() => {
    if (!selectedNode) return [];
    // @ts-ignore
    const urls = ASSETS.ARCHIVE[selectedNode] || [];
    return urls.map((url: string, i: number) => ({
      id: `${selectedNode}-${i}`,
      src: url,
      collection: selectedNode,
      title: `${selectedNode} Dossier ${String(i + 1).padStart(3, '0')}`,
      metadata: [
        { label: "ID", val: `ANF-${Math.random().toString(36).substr(2, 4).toUpperCase()}` },
        { label: "ZONE", val: selectedNode },
        { label: "AUTH", val: "INSTITUTIONAL" },
        { label: "IMG_HASH", val: Math.random().toString(16).substr(2, 8).toUpperCase() },
        { label: "STATUS", val: "VERIFIED" },
      ]
    }));
  }, [selectedNode]);

  const content = {
    [Language.EN]: {
      title: "THE VAULT",
      subtitle: "Enter the architectural realms of visual sovereignty.",
      tapHint: "Tap to Flip",
      categories: { 
        POWER: "Power", 
        VOYAGE: "Voyage", 
        ESSENCE: "Essence",
        SINGULARITY: "The Singularity"
      },
      descriptions: {
        POWER: "Authority. Strength. Command.",
        VOYAGE: "Motion. Journey. Horizon.",
        ESSENCE: "Soul. Detail. Texture.",
        SINGULARITY: "Absolute. Unique. Eternal."
      }
    },
    [Language.AR]: {
      title: "الخزنة",
      subtitle: "ادخل إلى عوالم السيادة البصرية.",
      tapHint: "اضغط للقلب",
      categories: { 
        POWER: "القوة", 
        VOYAGE: "الرحلة", 
        ESSENCE: "الأصالة",
        SINGULARITY: "التفرد"
      },
      descriptions: {
        POWER: "سلطة. قوة. قيادة.",
        VOYAGE: "حركة. رحلة. أفق.",
        ESSENCE: "روح. تفصيل. ملمس.",
        SINGULARITY: "مطلق. فريد. أبدي."
      }
    }
  };

  const txt = content[language];

  const handleCardFlip = (id: string) => {
    setFlippedId(flippedId === id ? null : id);
  };

  const handleSwitchCategory = (category: Collection | null) => {
    if (category === selectedNode && category !== null) return;
    
    setIsTransitioning(true);
    setFlippedId(null);
    setIsSingularityUnlocked(false); // Reset gate
    
    setTimeout(() => {
      setSelectedNode(category);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const getAssetForCategory = (c: Collection) => {
     switch(c) {
       case 'POWER': return ASSETS.VAULT.NODE_POWER;
       case 'VOYAGE': return ASSETS.VAULT.NODE_VOYAGE;
       case 'ESSENCE': return ASSETS.VAULT.NODE_ESSENCE;
       case 'SINGULARITY': return ASSETS.VAULT.NODE_SINGULARITY;
       default: return '';
     }
  };

  return (
    <div className={`vault-world-system h-screen overflow-hidden relative ${selectedNode === 'SINGULARITY' ? 'bg-[#0A0A0A]' : 'bg-black'}`}>
      <style>{`
        .vault-world-system {
          perspective: 2000px;
          background: ${selectedNode === 'SINGULARITY' ? '#0A0A0A' : 'radial-gradient(circle at center, #0a1a2a 0%, #050505 100%)'};
        }

        /* --- STAGE 1: THE VOID (Floating Nodes) --- */
        .nodes-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start; /* Changed from center to allow scrolling */
          gap: 2.5rem; /* Better separation */
          padding: 0 1rem;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .nodes-container::-webkit-scrollbar { display: none; }

        @media (min-width: 768px) {
          .nodes-container {
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 4rem;
            padding-top: 0;
            overflow-y: hidden;
          }
        }
        
        @media (min-width: 1024px) {
          .nodes-container {
            gap: 6rem;
          }
        }

        .portal-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          flex-shrink: 0;
          group: hover;
        }

        .node-portal {
          position: relative;
          width: clamp(140px, 45vw, 200px); /* Slightly smaller max size for mobile */
          aspect-ratio: 1/1;
          border-radius: 50%;
          transform-style: preserve-3d;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          border: 1px solid rgba(183, 121, 92, 0.4);
          box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(183, 121, 92, 0.1);
          background: #000;
        }

        @media (min-width: 1024px) {
          .node-portal {
             width: clamp(180px, 18vw, 260px);
          }
        }

        .portal-wrapper:hover .node-portal {
          transform: scale(1.08) translateZ(30px);
          border-color: #B7795C;
          box-shadow: 0 0 80px rgba(183, 121, 92, 0.4), inset 0 0 50px rgba(183, 121, 92, 0.2);
        }

        .node-portal img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.8) contrast(1.1);
          transition: transform 1.2s ease, filter 0.8s ease;
        }

        .portal-wrapper:hover img {
          filter: grayscale(0) contrast(1);
          transform: scale(1.15);
        }

        .node-label {
          font-family: 'Public Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          color: #B7795C;
          text-transform: uppercase;
          opacity: 0.8;
          transition: all 0.5s;
        }

        @media (min-width: 1024px) {
           .node-label {
             font-size: 11px;
             opacity: 0.6;
             letter-spacing: 0.6em;
           }
        }

        .portal-wrapper:hover .node-label {
          opacity: 1;
          letter-spacing: 0.8em;
          color: white;
          text-shadow: 0 0 10px rgba(183,121,92,0.5);
        }

        .node-description {
           height: 0;
           overflow: hidden;
           opacity: 0;
           transform: translateY(10px);
           transition: all 0.5s ease;
           font-family: 'Public Sans', sans-serif;
           font-size: 9px;
           color: rgba(255, 255, 255, 0.5);
           text-transform: uppercase;
           letter-spacing: 0.2em;
           margin-top: 0.5rem;
           text-align: center;
        }

        .portal-wrapper:hover .node-description {
           height: auto;
           opacity: 1;
           transform: translateY(0);
        }

        /* --- STAGE 2: NAVIGATION DOCK (BOTTOM) --- */
        .vault-dock {
          position: fixed;
          bottom: calc(1rem + env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(183, 121, 92, 0.2);
          border-radius: 9999px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.8);
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        .dock-item {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
          font-weight: bold;
          font-family: 'Public Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease-out;
        }
        .dock-item:hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }
        .dock-item.active {
          color: #000;
          background: #B7795C;
          box-shadow: 0 0 15px rgba(183, 121, 92, 0.4);
        }

        .dock-separator {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.25rem;
        }
        
        .dock-action {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #B7795C;
          border: 1px solid rgba(183, 121, 92, 0.3);
          transition: all 0.2s;
          cursor: pointer;
        }
        .dock-action:hover {
           background: #B7795C;
           color: white;
        }

        /* --- GALLERY LAYOUT --- */
        .gallery-container {
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-out;
        }
        .gallery-container.fade-out {
          opacity: 0;
          transform: scale(0.98);
          pointer-events: none;
        }
        
        .immersive-gallery {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          background: #050505;
          transform-style: preserve-3d;
          
          /* Mobile: Vertical */
          flex-direction: column;
          align-items: center;
          padding: 8rem 0 calc(8rem + env(safe-area-inset-bottom)); /* More padding for dock */
          overflow-x: hidden;
          overflow-y: scroll; 
          scroll-snap-type: y mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .immersive-gallery::-webkit-scrollbar { display: none; }

        @media (min-width: 1024px) {
          .immersive-gallery {
            flex-direction: row;
            padding: 0 10vw;
            overflow-x: scroll;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            align-items: center;
          }
        }

        /* --- CARD FLIP LOGIC --- */
        .dossier-card {
          width: 90vw;
          height: 55vh; /* Shorter card for mobile */
          margin-bottom: 2rem;
          scroll-snap-align: center;
          position: relative;
          perspective: 1500px;
          flex-shrink: 0;
          cursor: default;
          -webkit-tap-highlight-color: transparent;
        }

        @media (min-width: 1024px) {
          .dossier-card {
            width: auto;
            min-width: 55vw;
            height: 70vh;
            margin-bottom: 0;
            margin-right: 12vw;
          }
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .dossier-card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front, .card-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .card-front {
          background-color: #050505;
          transform: rotateY(0deg);
          border: 1px solid rgba(183,121,92,0.15);
        }
        
        .dossier-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.2) contrast(1.1);
          cursor: zoom-in;
          transition: filter 0.3s;
        }
        .dossier-image:hover {
           filter: grayscale(0) contrast(1);
        }

        .card-back {
          background-color: #0F1720;
          transform: rotateY(180deg);
          display: flex;
          flex-col: column;
          align-items: center;
          justify-content: center;
          border: 1px solid #B7795C;
          background-image: 
            linear-gradient(rgba(183,121,92,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(183,121,92,0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          cursor: pointer;
        }

        .card-back::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .card-front::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 40%, rgba(183, 121, 92, 0.1) 50%, transparent 60%);
          background-size: 200% 100%;
          background-position: 150% 0;
          transition: background-position 1s;
          pointer-events: none;
        }
        .dossier-card:hover .card-front::after {
           background-position: -150% 0;
        }

        .floating-anim {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* --- SINGULARITY SCROLLBAR --- */
        .singularity-scroll::-webkit-scrollbar {
          width: 2px;
        }
        .singularity-scroll::-webkit-scrollbar-track {
          background: #0A0A0A;
        }
        .singularity-scroll::-webkit-scrollbar-thumb {
          background: #333;
        }
      `}</style>

      {/* FIXED UI ELEMENTS - VOID TITLE (DESKTOP) */}
      {!selectedNode && (
        <div className="hidden md:flex absolute inset-0 flex-col items-center justify-start pt-32 px-12 text-center pointer-events-none z-20">
          <h1 className="font-serif text-8xl text-white tracking-tighter mb-4 animate-fade-in">{txt.title}</h1>
          <p className="text-copper text-[11px] uppercase tracking-[0.6em] opacity-60 animate-fade-in" style={{animationDelay: '0.4s'}}>{txt.subtitle}</p>
        </div>
      )}

      {/* THE VOID: PORTAL NODES */}
      {!selectedNode && (
        <div className="nodes-container">
          
          {/* MOBILE TITLE (Scrolls with content) */}
          <div className="md:hidden flex flex-col items-center text-center mt-24 mb-4 px-6 animate-fade-in">
             <h1 className="font-serif text-5xl text-white tracking-tighter mb-3">{txt.title}</h1>
             <p className="text-copper text-[10px] uppercase tracking-[0.4em] opacity-60 leading-relaxed max-w-[250px]">{txt.subtitle}</p>
          </div>

          {(['POWER', 'VOYAGE', 'ESSENCE', 'SINGULARITY'] as Collection[]).map((c, i) => (
            <div 
              key={c}
              className={`portal-wrapper animate-fade-in floating-anim`}
              style={{ 
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${5 + i}s`
              }}
              onClick={() => handleSwitchCategory(c)}
            >
              <div className="node-portal">
                <img 
                  src={getAssetForCategory(c)} 
                  alt={c} 
                  loading="lazy"
                />
              </div>
              <span className={`node-label ${language === Language.AR ? 'font-arabic' : ''}`}>{txt.categories[c]}</span>
              <p className={`node-description ${language === Language.AR ? 'font-arabic' : ''}`}>{txt.descriptions[c]}</p>
            </div>
          ))}

          {/* Spacer for bottom scroll on mobile */}
          <div className="h-12 w-full md:hidden"></div>
        </div>
      )}

      {/* --- FLOATING NAVIGATION DOCK (VISIBLE WHEN NODE SELECTED) --- */}
      {selectedNode && (
         <>
            {/* Gesture Hint Layer */}
            <div className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-300 ${isClosingGesture ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl text-white animate-bounce">keyboard_double_arrow_down</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white mt-4">Release to Exit</span>
                    </div>
                </div>
            </div>

            {/* Bottom Dock */}
            <div className="vault-dock">
                {(['POWER', 'VOYAGE', 'ESSENCE', 'SINGULARITY'] as Collection[]).map((c) => (
                  <div 
                    key={c}
                    className={`dock-item ${selectedNode === c ? 'active' : ''}`}
                    onClick={() => handleSwitchCategory(c)}
                    title={txt.categories[c]}
                  >
                    {c.charAt(0)}
                  </div>
                ))}
                
                <div className="dock-separator"></div>
                
                <div 
                  className="dock-action" 
                  onClick={() => handleSwitchCategory(null)}
                  title="Return to Vault"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </div>
            </div>
         </>
      )}

      {/* --- THE SINGULARITY EXPERIENCE --- */}
      {selectedNode === 'SINGULARITY' && (
        <div {...bind()} className="touch-none h-full w-full">
           {/* Biometric Gate */}
           {!isSingularityUnlocked && (
             <BiometricGate onUnlock={() => setIsSingularityUnlocked(true)} />
           )}

           {/* Vertical Feed (Visible after Unlock) */}
           <div 
             className={`fixed inset-0 z-40 bg-[#0A0A0A] overflow-y-auto singularity-scroll transition-opacity duration-1000 ${isSingularityUnlocked ? 'opacity-100' : 'opacity-0'}`}
           >
              {/* Singularity Header */}
              <div className="fixed top-0 left-0 w-full p-8 flex justify-center items-center z-50 pointer-events-none">
                 <div className="text-[#F5F5F0] text-[10px] tracking-[0.4em] uppercase font-bold mix-blend-difference opacity-50">Singularity</div>
              </div>

              <div className="max-w-xl mx-auto pt-32 pb-[calc(8rem+env(safe-area-inset-bottom))] px-6">
                 <div className="text-center mb-24 opacity-60">
                    <h2 className="text-[#F5F5F0] font-serif italic text-2xl mb-4">Sovereign Archives</h2>
                    <p className="text-[#F5F5F0] text-[9px] uppercase tracking-[0.3em]">Restricted Access // 1 of 1</p>
                 </div>

                 {archiveWorld.map((item, i) => (
                    <div key={item.id} onClick={() => setZoomedImage(item.src)}>
                       <SingularityArtifact item={item} index={i} parallax={parallax} />
                    </div>
                 ))}
                 
                 <div className="text-center mt-32 mb-12">
                    <span className="material-symbols-outlined text-[#D4AF37] opacity-40 text-2xl animate-pulse">check_circle</span>
                 </div>
                 
                 {/* Scroll Spacer for Dock */}
                 <div className="h-24"></div>
              </div>
           </div>
        </div>
      )}


      {/* --- STANDARD IMMERSIVE WORLD (POWER / VOYAGE / ESSENCE) --- */}
      {selectedNode && selectedNode !== 'SINGULARITY' && (
        <div {...bind()} className="touch-none h-full w-full">
          <div className={`immersive-gallery no-scrollbar gallery-container ${isTransitioning ? 'fade-out' : ''}`}>
            
            {/* Top Hint (Optional) */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-[9px] text-white/20 uppercase tracking-[0.2em] pointer-events-none md:hidden animate-pulse">
                Swipe Down to Exit
            </div>

            {archiveWorld.map((item, idx) => (
              <div 
                key={item.id} 
                className={`dossier-card ${flippedId === item.id ? 'flipped' : ''}`}
              >
                <div className="card-inner">
                  
                  {/* FRONT: IMAGE (Click to Zoom) */}
                  <div className="card-front">
                    <div className="relative w-full h-full cursor-zoom-in group" onClick={(e) => { e.stopPropagation(); setZoomedImage(item.src); }}>
                       <img src={item.src} alt={item.title} className="dossier-image" loading="eager" />
                       
                       {/* Zoom Affordance */}
                       <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="material-symbols-outlined text-sm">zoom_in</span>
                       </div>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                       <span className="font-serif text-white/40 text-4xl">{String(idx + 1).padStart(2, '0')}</span>
                       
                       {/* Flip Trigger Button */}
                       <button 
                         className="pointer-events-auto text-[9px] text-copper uppercase tracking-[0.2em] border border-copper/30 px-3 py-1 bg-black/60 backdrop-blur-sm hover:bg-copper hover:text-white transition-all flex items-center gap-1"
                         onClick={(e) => { e.stopPropagation(); handleCardFlip(item.id); }}
                       >
                         {txt.tapHint} <span className="material-symbols-outlined text-[10px]">flip_camera_android</span>
                       </button>
                    </div>
                  </div>

                  {/* BACK: DATA TERMINAL (Click to Flip Back) */}
                  <div className="card-back" onClick={() => handleCardFlip(item.id)}>
                    <div className="p-8 w-full h-full flex flex-col justify-center relative z-10">
                       <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-copper opacity-50"></div>
                       <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-copper opacity-50"></div>
                       <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-copper opacity-50"></div>
                       <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-copper opacity-50"></div>

                       <h3 className="text-white font-serif text-xl mb-8 italic">{item.title}</h3>
                       
                       <div className="space-y-4 w-full px-4">
                         {item.metadata.map((meta, i) => (
                           <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                             <span className="text-[10px] text-copper uppercase tracking-widest">{meta.label}</span>
                             <span className="text-[10px] text-white/80 font-mono tracking-widest">{meta.val}</span>
                           </div>
                         ))}
                       </div>

                       <div className="mt-12 text-center">
                         <div className="inline-block border border-copper px-4 py-2 text-copper text-[10px] uppercase tracking-[0.3em]">
                           Classified
                         </div>
                       </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
            
            {/* Scroll Padding for Mobile */}
            <div className="min-h-[10vh] lg:min-w-[10vw]"></div>
          </div>
        </div>
      )}

      {/* ZOOM MODAL OVERLAY */}
      {zoomedImage && (
        <ZoomModal 
          src={zoomedImage} 
          onClose={() => setZoomedImage(null)}
          isSingularity={selectedNode === 'SINGULARITY'}
        />
      )}

      {/* NOISE & GRAIN OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.04]" style={{ backgroundImage: `url('${ASSETS.VAULT.TEXTURE}')` }}></div>
    </div>
  );
};

export default Vault;