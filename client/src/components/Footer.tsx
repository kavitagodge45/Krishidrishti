import React from 'react';
import { Sprout, ShieldAlert, Award, ExternalLink } from 'lucide-react';
import { KisanHelplineBar } from './KisanHelplineBar';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-10 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Kisan Call Centre Helpline component */}
        <KisanHelplineBar />

        {/* 3-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 text-left">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#124131] flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-base font-extrabold text-[#124131]">{t('brandTitle')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Official Data Attribution */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>{t('footerAttributionTitle')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {t('footerAttributionDesc')}
            </p>
          </div>

          {/* Advisory & Legal Notice */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>{t('footerLegalTitle')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {t('footerLegalDesc')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            {t('footerCopyright')}
          </div>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-emerald-900 transition-colors">{t('privacyPolicy')}</a>
            <a href="#terms" className="hover:text-emerald-900 transition-colors">{t('termsOfService')}</a>
            <a 
              href="https://icar.org.in" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-emerald-900 transition-colors flex items-center gap-1"
            >
              <span>{t('kvkDirectory')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
