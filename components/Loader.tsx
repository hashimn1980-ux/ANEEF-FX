import React, { useEffect, useState } from 'react';
import { ASSETS } from '../constants';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'drawing' | 'filling' | 'done'>('drawing');

  useEffect(() => {
    // 1. Transition from initial fade-in to "filling" (full opacity/glow)
    // Accelerated start for better pacing
    const fillTimer = setTimeout(() => {
      setStage('filling');
    }, 800);

    // 2. Complete and reveal
    // Shorter hold time, transitioning to curtain reveal sooner
    const doneTimer = setTimeout(() => {
      setStage('done');
      // Wait for the curtain animation to mostly finish before unmounting
      setTimeout(onComplete, 1600);
    }, 2800);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
      {/* Top Curtain */}
      <div 
        className={`absolute top-0 left-0 w-full h-[50vh] bg-black transition-transform duration-[1500ms] ease-[cubic-bezier(0.87,0,0.13,1)] pointer-events-auto shadow-2xl z-20
        ${stage === 'done' ? '-translate-y-full' : 'translate-y-0'}`}
      />
      
      {/* Bottom Curtain */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-[50vh] bg-black transition-transform duration-[1500ms] ease-[cubic-bezier(0.87,0,0.13,1)] pointer-events-auto shadow-2xl z-20
        ${stage === 'done' ? 'translate-y-full' : 'translate-y-0'}`}
      />

      {/* Center Content (Logo) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out z-30 ${stage === 'done' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden">
          {/* Logo Image */}
          <img 
            src={ASSETS.LOGO.MAIN} 
            alt="ANEEF"
            className={`
              w-48 h-auto object-contain transition-all duration-[1200ms] ease-out
              ${stage === 'drawing' ? 'opacity-0 scale-90 blur-sm' : ''}
              ${stage === 'filling' ? 'opacity-100 scale-100 blur-0' : ''}
            `}
          />
          
          {/* Shine Effect Overlay */}
          <div 
            className={`
              absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12
              transition-transform duration-[1200ms] ease-in-out
              ${stage === 'filling' ? 'translate-x-full' : '-translate-x-full'}
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;