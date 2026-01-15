import React, { useState, useEffect } from 'react';
import { Page, Language } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  language: Language;
  onToggleLanguage: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, language, onToggleLanguage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const labels = {
    [Language.EN]: { HOME: 'Home', INST: 'The Institution', SERVICES: 'Services', VAULT: 'The Vault', CONC: 'Concierge' },
    [Language.AR]: { HOME: 'الرئيسية', INST: 'المؤسسة', SERVICES: 'الخدمات', VAULT: 'الخزنة', CONC: 'الكونسيرج' },
  };

  const navLinks = [
    { label: labels[language].HOME, page: Page.HOME },
    { label: labels[language].INST, page: Page.INSTITUTION },
    { label: labels[language].SERVICES, page: Page.SERVICES },
    { label: labels[language].VAULT, page: Page.VAULT },
    { label: labels[language].CONC, page: Page.CONCIERGE },
  ];

  const handleMobileNavigate = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[120] transition-all duration-500 ease-in-out px-6 md:px-12 py-6 
          ${scrolled || currentPage !== Page.HOME ? 'bg-navy border-b border-copper/20' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          
          {/* Logo */}
          <div 
            onClick={() => handleMobileNavigate(Page.HOME)}
            className={`text-gold-foil font-serif font-bold tracking-widest cursor-pointer transition-opacity duration-300 ${scrolled || currentPage !== Page.HOME ? 'opacity-100' : 'opacity-0'}`}
          >
            ANEEF
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-12 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`text-[10px] uppercase tracking-[0.2em] font-sans transition-all duration-300
                  ${currentPage === link.page ? 'text-white border-b border-copper pb-1' : 'text-white/60 hover:text-copper'}
                  ${language === Language.AR ? 'font-arabic text-xs' : ''}
                `}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onToggleLanguage}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-copper hover:text-white transition-colors border border-copper/30 px-3 py-1 rounded-sm"
            >
              <span className={language === Language.EN ? 'text-white font-bold' : 'opacity-50'}>EN</span>
              <span className="w-[1px] h-3 bg-copper/50"></span>
              <span className={language === Language.AR ? 'text-white font-bold font-arabic' : 'opacity-50 font-arabic'}>عربي</span>
            </button>

            {/* Functional Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-copper flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-all z-[130] pointer-events-auto"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Institutional Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-[110] bg-navy-dark flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] md:hidden
        ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#B7795C 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        
        <ul className="space-y-8 text-center relative z-10">
          {navLinks.map((link, i) => (
            <li 
              key={link.page} 
              className={`transition-all duration-700 delay-[${i * 100}ms] ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <button
                onClick={() => handleMobileNavigate(link.page)}
                className={`text-2xl font-serif tracking-widest transition-colors
                  ${currentPage === link.page ? 'text-copper' : 'text-white/80'}
                  ${language === Language.AR ? 'font-arabic' : ''}
                `}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-12 text-[10px] text-white/20 uppercase tracking-[0.5em]">
          Dubai • London • New York
        </div>
      </div>
    </>
  );
};

export default Navigation;