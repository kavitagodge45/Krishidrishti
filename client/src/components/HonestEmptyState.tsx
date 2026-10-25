import React from 'react';
import { AlertCircle, Database, CloudOff, KeyRound, PlusCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HonestEmptyStateProps {
  type: 'empty' | 'unconfigured' | 'offline' | 'error';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  requiredConfigKey?: string;
}

export const HonestEmptyState: React.FC<HonestEmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  requiredConfigKey,
}) => {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (type) {
      case 'unconfigured':
        return <KeyRound className="w-8 h-8 text-amber-600" />;
      case 'offline':
        return <CloudOff className="w-8 h-8 text-rose-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-rose-600" />;
      case 'empty':
      default:
        return <Database className="w-8 h-8 text-emerald-600" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'unconfigured':
        return t('configureApiCredentials');
      case 'offline':
      case 'error':
        return t('liveDataUnavailable');
      case 'empty':
      default:
        return t('noRecordsFound');
    }
  };

  const getDefaultDesc = () => {
    if (requiredConfigKey) {
      return `Real-time integration requires setting [${requiredConfigKey}] in environment variables. In adherence to the platform's strict Zero Fake Data policy, simulated or mock data is not displayed.`;
    }
    return t('noVerifiedData');
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 sm:p-8 text-center flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        {getIcon()}
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">
        {title || getDefaultTitle()}
      </h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
        {description || getDefaultDesc()}
      </p>

      {requiredConfigKey && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-mono mb-4">
          <span>Required Env:</span>
          <strong>{requiredConfigKey}</strong>
        </div>
      )}

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#124131] hover:bg-[#0c2f23] text-white text-xs sm:text-sm font-medium shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
