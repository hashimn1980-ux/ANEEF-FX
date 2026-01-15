import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';

interface ConciergeProps {
  language: Language;
}

const Concierge: React.FC<ConciergeProps> = ({ language }) => {
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mandate, setMandate] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const content = {
    [Language.EN]: {
      title: "Application for",
      titleHighlight: "Visual Audit",
      description: "Membership is by invitation or application only. Please complete the mandate to initiate your dossier review.",
      secureLine: "Secure Line",
      headquarters: "Headquarters",
      address: "EMMAR Square, Dubai Downtown, UAE",
      placeholderName: "Full Name",
      placeholderEmail: "Corporate Email",
      placeholderCompany: "Company Name",
      placeholderLinkedIn: "LinkedIn URL",
      mandateType: "Select Mandate Type",
      submit: "Submit Mandate",
      successTitle: "Mandate Received.",
      successBody: "The Directorate will review your profile within 48 hours. Secure communication channels will be established upon approval.",
      options: [
        { value: 'audit', label: 'Visual Audit' },
        { value: 'retainer', label: 'Monthly Retainer' },
        { value: 'advisory', label: 'Strategic Advisory' }
      ]
    },
    [Language.AR]: {
      title: "تقديم طلب لـ",
      titleHighlight: "التدقيق البصري",
      description: "العضوية عن طريق الدعوة أو الطلب فقط. يرجى إكمال التفويض لبدء مراجعة ملفك.",
      secureLine: "خط آمن",
      headquarters: "المقر الرئيسي",
      address: "إعمار سكوير، وسط مدينة دبي، الإمارات العربية المتحدة",
      placeholderName: "الاسم الكامل",
      placeholderEmail: "البريد الإلكتروني للشركة",
      placeholderCompany: "اسم الشركة",
      placeholderLinkedIn: "رابط لينكد إن",
      mandateType: "اختر نوع التفويض",
      submit: "إرسال التفويض",
      successTitle: "تم استلام الطلب.",
      successBody: "ستقوم المديرية بمراجعة ملفك الشخصي في غضون 48 ساعة. سيتم إنشاء قنوات اتصال آمنة فور الموافقة.",
      options: [
        { value: 'audit', label: 'تدقيق بصري' },
        { value: 'retainer', label: 'عقد شهري' },
        { value: 'advisory', label: 'استشارات استراتيجية' }
      ]
    }
  };

  const txt = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-navy min-h-screen pt-20 flex flex-col md:flex-row">
      
      {/* Left Column: Info */}
      <div className="w-full md:w-[40%] bg-navy p-12 md:p-24 flex flex-col justify-between border-r border-white/5">
        <div>
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight">
            {txt.title} <br/><span className="text-copper italic">{txt.titleHighlight}</span>
          </h1>
          <p className="text-white/80 font-sans text-sm leading-relaxed max-w-sm">
            {txt.description}
          </p>
        </div>

        <div className="mt-16 md:mt-0">
          <div className="mb-8">
            <h4 className="text-copper text-xs uppercase tracking-widest mb-2 font-bold">{txt.secureLine}</h4>
            <p className="text-white font-serif tracking-widest">+971 58 935 3703</p>
          </div>
          <div>
            <h4 className="text-copper text-xs uppercase tracking-widest mb-2 font-bold">{txt.headquarters}</h4>
            <p className="text-white/80 text-sm font-sans leading-relaxed">
              {txt.address.split(', ').map((line, i) => (
                <React.Fragment key={i}>
                  {line}<br/>
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full md:w-[60%] bg-navy-light p-12 md:p-24 flex items-center justify-center relative">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-12">
            
            {/* Input Group */}
            <div className="group">
              <input 
                type="text" 
                placeholder={txt.placeholderName} 
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/20 focus:outline-none focus:border-copper transition-colors font-serif text-xl"
                required
              />
            </div>

            <div className="group">
              <input 
                type="email" 
                placeholder={txt.placeholderEmail} 
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/20 focus:outline-none focus:border-copper transition-colors font-serif text-xl"
                required
              />
            </div>

            <div className="group">
              <input 
                type="text" 
                placeholder={txt.placeholderCompany} 
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/20 focus:outline-none focus:border-copper transition-colors font-serif text-xl"
              />
            </div>

            <div className="group">
              <input 
                type="text" 
                placeholder={txt.placeholderLinkedIn} 
                className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/20 focus:outline-none focus:border-copper transition-colors font-serif text-xl"
              />
            </div>

            {/* Custom Dropdown */}
            <div className="group relative" ref={dropdownRef}>
                <div 
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white/60 cursor-pointer flex justify-between items-center"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <span className={mandate ? 'text-white font-serif text-xl' : 'font-serif text-xl'}>
                        {mandate ? txt.options.find(o => o.value === mandate)?.label : txt.mandateType}
                    </span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                </div>
                
                <div className={`absolute top-full left-0 w-full bg-navy border border-copper z-50 transition-all duration-300 origin-top ${dropdownOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                    <ul className="flex flex-col">
                        {txt.options.map((opt) => (
                            <li 
                                key={opt.value}
                                className="px-6 py-4 hover:bg-copper/20 text-white font-serif cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                onClick={() => {
                                    setMandate(opt.value);
                                    setDropdownOpen(false);
                                }}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-6 border border-copper bg-transparent text-copper hover:bg-copper/20 hover:text-white transition-all duration-500 ease-out uppercase text-xs font-bold tracking-[0.3em] hover:tracking-[0.4em]"
            >
              {txt.submit}
            </button>

          </form>
        ) : (
          <div className="text-center animate-shine">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-2 border-copper mb-8 relative">
              <span className="material-symbols-outlined text-6xl text-copper">verified</span>
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-copper"></div>
            </div>
            <h2 className="font-serif text-3xl text-white mb-4">{txt.successTitle}</h2>
            <p className="text-white/80 font-sans max-w-sm mx-auto leading-relaxed">
              {txt.successBody}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Concierge;