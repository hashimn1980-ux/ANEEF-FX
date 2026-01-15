import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-navy border-t border-white/5 pt-20 pb-12 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Column */}
        <div className="md:col-span-1">
          <h2 className="font-serif text-3xl text-gold-foil mb-6 tracking-widest">ANEEF</h2>
          <p className="text-white/60 text-sm font-sans leading-relaxed">
            The custodian of institutional legacy. We do not merely predict the future; we build the infrastructure that sustains it.
          </p>
        </div>

        {/* Links: Legal */}
        <div>
          <h4 className="text-copper text-xs uppercase tracking-[0.2em] mb-6 font-bold">Legal</h4>
          <ul className="space-y-4 text-sm text-white/80 font-sans">
            <li className="hover:text-copper cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-copper cursor-pointer transition-colors">Terms of Mandate</li>
            <li className="hover:text-copper cursor-pointer transition-colors">Regulatory</li>
          </ul>
        </div>

        {/* Links: Services */}
        <div>
          <h4 className="text-copper text-xs uppercase tracking-[0.2em] mb-6 font-bold">Services</h4>
          <ul className="space-y-4 text-sm text-white/80 font-sans">
            {/* UPDATED: Visual Audit now routes to CONCIERGE (Application Form) */}
            <li className="hover:text-copper cursor-pointer transition-colors" onClick={() => onNavigate(Page.CONCIERGE)}>Visual Audit</li>
            <li className="hover:text-copper cursor-pointer transition-colors" onClick={() => onNavigate(Page.VAULT)}>Asset Management</li>
            <li className="hover:text-copper cursor-pointer transition-colors" onClick={() => onNavigate(Page.CONCIERGE)}>Private Concierge</li>
          </ul>
        </div>

        {/* Trust Seal */}
        <div className="flex flex-col items-end justify-start">
           <div className="border border-copper p-4 inline-block text-center rounded-sm">
              <span className="material-symbols-outlined text-copper text-4xl mb-2">verified_user</span>
              <div className="text-[10px] text-copper uppercase tracking-[0.2em]">ANEEF</div>
              <div className="text-[8px] text-white/60 uppercase tracking-widest mt-1">Privacy Guaranteed</div>
           </div>
        </div>
      </div>

      {/* Decorative Stamp Background */}
      <div className="absolute -bottom-24 -right-24 text-white/[0.02] pointer-events-none select-none">
        <span className="material-symbols-outlined text-[300px]">local_police</span>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 font-sans uppercase tracking-widest">
        <div>© 2024 ANEEF. All Rights Reserved.</div>
        <div className="mt-4 md:mt-0">Dubai • London • New York</div>
      </div>
    </footer>
  );
};

export default Footer;