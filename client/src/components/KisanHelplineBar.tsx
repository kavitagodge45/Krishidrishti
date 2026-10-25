import React from 'react';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const KisanHelplineBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-white rounded-2xl border border-emerald-900/10 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
          <PhoneCall className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              {t('kisanCallCentre')}
            </span>
            <span className="bg-red-500/10 text-red-600 font-bold text-[11px] px-2 py-0.5 rounded-full border border-red-200">
              {t('govtCertified')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            {t('kisanHelplineDesc')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('bilingualSupport')}</span>
        </div>

        <a
          href="tel:18001801551"
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-300" />
          <span>{t('tollFreeNumber')}</span>
        </a>
      </div>
    </div>
  );
};
