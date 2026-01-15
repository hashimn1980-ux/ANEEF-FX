import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Loader from './components/Loader';
import Home from './pages/Home';
import Institution from './pages/Institution';
import Services from './pages/Services';
import Vault from './pages/Vault';
import Concierge from './pages/Concierge';
import { Page, Language } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [pageTransitioning, setPageTransitioning] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(true);

  // Handle Page Navigation
  const handleNavigate = (page: Page) => {
    if (page === currentPage) return;
    setPageTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo(0, 0);
      setPageTransitioning(false);
    }, 500); 
  };

  // Handle Language Switch (Direction & Font)
  useEffect(() => {
    document.body.dir = language === Language.AR ? 'rtl' : 'ltr';
    if (language === Language.AR) {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.EN ? Language.AR : Language.EN);
  };

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <div className={`min-h-screen bg-navy flex flex-col ${language === Language.AR ? 'text-right' : 'text-left'}`}>
        <Navigation 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        
        <main 
          className={`flex-grow transition-opacity duration-500 ease-in-out ${pageTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {currentPage === Page.HOME && <Home onNavigate={handleNavigate} language={language} />}
          {currentPage === Page.INSTITUTION && <Institution language={language} />}
          {currentPage === Page.SERVICES && <Services onNavigate={handleNavigate} language={language} />}
          {currentPage === Page.VAULT && <Vault language={language} />}
          {currentPage === Page.CONCIERGE && <Concierge language={language} />}
        </main>

      </div>
    </>
  );
};

export default App;