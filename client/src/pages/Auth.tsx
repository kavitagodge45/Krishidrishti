import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth, SignUpData } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Auth: React.FC = () => {
  const { signIn, signUp, isConfigured } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State (Maharashtra-First Fields)
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regState, setRegState] = useState('Maharashtra');
  const [regDistrict, setRegDistrict] = useState('Nashik');
  const [regTaluka, setRegTaluka] = useState('Dindori');
  const [regVillage, setRegVillage] = useState('');
  const [regSoilType, setRegSoilType] = useState('Black Cotton Soil (Regur)');
  const [regAcres, setRegAcres] = useState('5.5');
  const [regLang, setRegLang] = useState<'mr' | 'hi' | 'en'>('mr');

  const maharashtraDistricts = [
    'Nashik',
    'Pune',
    'Ahmednagar',
    'Amravati',
    'Solapur',
    'Satara',
    'Kolhapur',
    'Sangli',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Jalgaon',
    'Nagpur',
    'Latur',
    'Nanded'
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!isConfigured) {
      setLoading(false);
      setErrorMessage("Supabase is not yet configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
      return;
    }

    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!isConfigured) {
      setErrorMessage("Supabase is not yet configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
      return;
    }

    setLoading(true);

    const signupPayload: SignUpData = {
      email: regEmail,
      password: regPassword,
      fullName: regFullName,
      phoneNumber: regPhone,
      state: regState,
      district: regDistrict,
      taluka: regTaluka,
      village: regVillage,
      primarySoilType: regSoilType,
      totalLandAcres: parseFloat(regAcres) || 0,
      preferredLanguage: regLang,
    };

    const { error } = await signUp(signupPayload);
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes('rate limit')) {
        setErrorMessage(
          language === 'mr'
            ? 'Supabase ईमेल मर्यादा संपली आहे (दर तासाला कमाल ३ ईमेल). अमर्यादित आणि थेट नोंदणीसाठी Supabase Dashboard > Authentication > Providers > Email मध्ये जाऊन "Confirm email" बंद (OFF) करा.'
            : language === 'hi'
            ? 'Supabase ईमेल सीमा समाप्त हो गई है। तुरंत पंजीकरण के लिए Supabase Dashboard > Authentication > Providers > Email में जाकर "Confirm email" को OFF करें।'
            : 'Email rate limit exceeded (Supabase free limit: 3-4 emails/hr). Fix: in Supabase Dashboard > Authentication > Providers > Email, turn OFF "Confirm email" to enable instant registration without email limits.'
        );
      } else {
        setErrorMessage(error.message);
      }
    } else {
      setLanguage(regLang);
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 text-left">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6">
        
        {/* Top Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#124131] flex items-center justify-center text-emerald-400 mx-auto shadow-sm">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('kisanPortalTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-devanagari font-semibold">
            {t('kisanPortalSubtitle')}
          </p>
        </div>

        {/* Supabase Unconfigured Warning Banner */}
        {!isConfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Supabase PostgreSQL Connection Pending:</strong>
              <p className="mt-0.5 leading-relaxed">
                Authentication requires real Supabase credentials. Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>client/.env</code>. In adherence to the strict Zero Fake Data policy, simulated sessions are not created.
              </p>
            </div>
          </div>
        )}

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-bold text-slate-700 border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === 'signin'
                ? 'bg-[#124131] text-white shadow-xs'
                : 'hover:text-emerald-950'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t('tabSignIn')}</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#124131] text-white shadow-xs'
                : 'hover:text-emerald-950'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('tabRegister')}</span>
          </button>
        </div>

        {/* FORM 1: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('emailAddress')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="farmer@krishidrishti.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('password')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-emerald-300" />
                    <span>{t('signInBtn')}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-emerald-800 hover:underline"
              >
                {t('needAccount')}
              </button>
            </p>
          </form>
        )}

        {/* FORM 2: REGISTER (MAHARASHTRA-FIRST) */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Jadhav"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('phoneNumber')}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('emailAddress')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="farmer@krishidrishti.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('password')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Geographic Details (State, District, Taluka, Village) */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                Maharashtra Farm Location
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('state')}</label>
                  <input
                    type="text"
                    disabled
                    value={regState}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('district')}</label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  >
                    {maharashtraDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('taluka')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dindori"
                    value={regTaluka}
                    onChange={(e) => setRegTaluka(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('village')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Vani"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Farm Soil & Acreage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">{t('primarySoilType')}</label>
                <select
                  value={regSoilType}
                  onChange={(e) => setRegSoilType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                >
                  <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur / काळी माती)</option>
                  <option value="Alluvial Soil">Alluvial Soil (गाळाची जमीन)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam (तांबडी माती)</option>
                  <option value="Laterite Soil">Laterite Soil (जांभी जमीन)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('totalLandAcres')}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={regAcres}
                  onChange={(e) => setRegAcres(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('preferredLang')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mr', label: 'मराठी' },
                  { id: 'hi', label: 'हिन्दी' },
                  { id: 'en', label: 'English' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setRegLang(l.id as any)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      regLang === l.id
                        ? 'bg-[#124131] text-white border-emerald-950'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-emerald-300" />
                    <span>{t('registerBtn')}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-emerald-800 hover:underline"
              >
                {t('alreadyRegistered')}
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
