import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn, ShieldAlert, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Checking Farmer Authentication...</span>
      </div>
    );
  }

  // If user is authenticated, render protected content
  if (user) {
    return <>{children}</>;
  }

  // If unauthenticated or Supabase not configured, show honest access card
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200/70">
          <Lock className="w-8 h-8 text-[#124131]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {language === 'mr' ? 'शेतकरी खाते प्रमाणीकरण आवश्यक' : language === 'hi' ? 'किसान खाता प्रमाणीकरण आवश्यक' : 'Farmer Authentication Required'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            {language === 'mr'
              ? 'हे पान तुमच्या खाजगी शेतजमीन, पिके, आणि आर्थिक लेजरशी संबंधित आहे. गोपनीयतेसाठी आणि डेटा सुरक्षिततेसाठी कृपया आधी लॉगिन किंवा नवीन नोंदणी करा.'
              : 'This section contains your private farm holdings, crop plots, and operational ledger. Please sign in or register to securely access your data.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>लॉगिन / नोंदणी करा (Sign In / Register)</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
          >
            मुख्यपृष्ठावर जा (Home)
          </Link>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-700" />
          <span>Strict Zero Fake Data • Row Level Security Enforced</span>
        </div>
      </div>
    </div>
  );
};
