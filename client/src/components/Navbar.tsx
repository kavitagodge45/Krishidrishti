import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  LayoutDashboard, 
  Bot, 
  Stethoscope, 
  CloudSun, 
  TrendingUp, 
  Compass, 
  Calculator, 
  Landmark,
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ChevronRight,
  UserCheck,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const navLinks = [
    { to: '/', label: t('navHome'), icon: Sprout },
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/assistant', label: t('navAssistant'), icon: Bot },
    { to: '/crop-doctor', label: t('navCropDoctor'), icon: Stethoscope },
    { to: '/weather', label: t('navWeather'), icon: CloudSun },
    { to: '/mandi', label: t('navMandi'), icon: TrendingUp },
    { to: '/crop-recommendation', label: t('navRecommendation'), icon: Compass },
    { to: '/farm-planning', label: t('navFarmPlanning'), icon: Calculator },
    { to: '/govt-schemes', label: t('navGovtPortals'), icon: Landmark },
  ];

  const handleVoiceWelcome = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    let message = "Welcome to KrishiDrishti smart agriculture platform for Indian farmers.";
    let voiceLang = "en-IN";

    if (language === 'mr') {
      message = "कृषिदृष्टी स्मार्ट शेती मंचावर आपले स्वागत आहे. अचूक हवामान, पीक रोग निदान आणि थेट बाजार भाव मिळवा.";
      voiceLang = "mr-IN";
    } else if (language === 'hi') {
      message = "कृषिदृष्टि स्मार्ट कृषि मंच पर आपका स्वागत है। सटीक मौसम, फसल रोग निदान और लाइव मंडी भाव प्राप्त करें।";
      voiceLang = "hi-IN";
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = voiceLang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-950/5 shadow-xs">
      {/* Top Advisory Ticker Ribbon */}
      <div className="bg-[#EAF3EA] border-b border-emerald-200/60 px-4 py-1.5 text-xs text-emerald-950">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block shrink-0" />
            <span className="truncate">{t('tickerAlert')}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800 text-[11px] sm:text-xs shrink-0">
            <span className="hidden sm:inline bg-emerald-100/90 text-emerald-900 px-2 py-0.5 rounded font-medium">
              {t('govtPortal')}
            </span>
            <Link to="/govt-schemes" className="hover:underline flex items-center font-semibold text-emerald-950">
              {t('readGuide')} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#124131] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-[#124131] flex items-center">
                {t('brandTitle')}
              </div>
              <p className="text-[11px] font-semibold text-emerald-700 tracking-wide font-devanagari">
                {t('brandSubtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#124131] text-white shadow-xs'
                      : 'text-slate-700 hover:text-emerald-950 hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Language, Voice, Profile & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Trilingual Language Selector */}
            <div className="bg-slate-100 border border-slate-200/90 p-0.5 rounded-full flex items-center text-xs font-bold text-slate-700 shadow-xs">
              {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                    language === lang
                      ? 'bg-[#124131] text-white shadow-xs'
                      : 'hover:text-emerald-900'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                </button>
              ))}
            </div>

            {/* Voice Readout Toggle */}
            <button
              type="button"
              onClick={handleVoiceWelcome}
              title="Voice Reader / आवाज सहाय्यक"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isSpeaking
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Authentication Buttons & User Profile Badge */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-[#124131] text-emerald-300 flex items-center justify-center text-xs font-bold">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="leading-tight hidden sm:block">
                    <div className="text-xs font-bold text-slate-900">
                      {profile?.fullName || user.email?.split('@')[0] || 'Kisan'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {profile ? `${profile.taluka}, ${profile.district}` : 'Maharashtra, India'}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{profile?.fullName || 'Farmer Profile'}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                      {profile?.kisanRegId && (
                        <p className="text-[10px] text-emerald-800 font-mono mt-0.5">{profile.kisanRegId}</p>
                      )}
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                      <span>{t('navDashboard')}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-semibold text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('signOut')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t('signInRegister')}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-[#124131] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 mt-2">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('signOut')}</span>
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-xl"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('signInRegister')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
