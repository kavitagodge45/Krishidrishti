import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  Radio, 
  TrendingUp, 
  ShieldCheck, 
  Stethoscope, 
  CloudSun, 
  Sprout, 
  Camera, 
  Mic, 
  Check, 
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-900 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('heroBadge')}</span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {t('heroTitleStart')}{' '}
                <span className="relative whitespace-nowrap text-[#124131]">
                  {t('heroTitleHighlight')}
                  <svg className="absolute -bottom-2 left-0 w-full text-emerald-600" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 9.5C85.5 3.5 214.5 2.5 297.5 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
                {t('heroSubtitle')}
              </p>

              {/* Primary Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t('exploreSmartFarming')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/assistant"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all hover:border-slate-300"
                >
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>{t('askAiAssistant')}</span>
                </Link>
              </div>

              {/* Value Feature Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('zeroSetup')}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('availableLanguages')}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-2xs">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('offlineSupport')}</span>
                </div>
              </div>

              {/* Social proof avatars */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">RP</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-700 text-white font-bold text-xs flex items-center justify-center">GS</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-teal-800 text-white font-bold text-xs flex items-center justify-center">RJ</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-800 text-white font-bold text-xs flex items-center justify-center">+4k</div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t('farmersOnboarded')}
                </p>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Live Telemetry Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                {/* Farmer Image Background */}
                <div className="relative h-[430px] w-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80')` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Telemetry 1: Soil Moisture */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 px-3.5 shadow-lg border border-white/40 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      💧
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{t('soilMoisture')}</div>
                      <div className="text-xs font-black text-slate-900">68% <span className="text-emerald-700 font-semibold">({t('optimal')})</span></div>
                    </div>
                  </div>

                  {/* Floating Telemetry 2: Soybean Modal Price */}
                  <div className="absolute top-24 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 px-3.5 shadow-lg border border-white/40 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{t('soybeanModalPrice')}</div>
                      <div className="text-xs font-black text-slate-900">₹2,450 <span className="text-[11px] font-normal text-slate-500">/{t('quintal')}</span> <span className="text-emerald-700 font-bold">(+6%)</span></div>
                    </div>
                  </div>

                  {/* Bottom Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-white">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold block">{t('activeFieldSpecimen')}</span>
                      <span className="text-xs font-bold">Nashik Agro-Cluster</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-emerald-700/50">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('zeroAlerts')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          <div className="bg-white rounded-3xl p-6 border border-emerald-950/10 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹14,500</div>
              <p className="text-xs font-semibold text-slate-500">{t('statSavings')}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-emerald-950/10 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-800 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">94.8%</div>
              <p className="text-xs font-semibold text-slate-500">{t('statAccuracy')}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-emerald-950/10 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1,200+</div>
              <p className="text-xs font-semibold text-slate-500">{t('statMandis')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR PILLARS OF PRECISION FARMING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              {t('fourPillarsTag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('fourPillarsTitle')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            {t('fourPillarsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Pillar 1: AI Crop Advice */}
          <Link to="/crop-recommendation" className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{t('pillarCropAdviceTitle')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('pillarCropAdviceDesc')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span className="truncate">{t('navRecommendation')}</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 2: Crop Disease Detection */}
          <Link to="/crop-doctor" className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-lime-50 text-lime-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{t('pillarDiseaseTitle')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('pillarDiseaseDesc')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>94.8% field accuracy</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 3: Hyper-Local Weather */}
          <Link to="/weather" className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{t('pillarWeatherTitle')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('pillarWeatherDesc')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{t('navWeather')}</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 4: Live Mandi Price Insights */}
          <Link to="/mandi" className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{t('pillarMandiTitle')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('pillarMandiDesc')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>{t('openLiveMandi')}</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. TEST CROP DOCTOR WITH A SINGLE PHOTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                {t('testCropDoctorTag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t('testCropDoctorTitle')}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {t('testCropDoctorDesc')}
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t('cropCoverage')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t('cibrcApproved')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t('voiceReadoutSupport')}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/crop-doctor"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('openCameraReporter')}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Specimen Preview */}
            <div className="lg:col-span-7">
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Soybean (Glycine max)
                  </span>
                  <span className="bg-emerald-900/80 text-emerald-300 font-mono text-[11px] px-2 py-0.5 rounded">
                    {t('navCropDoctor')}
                  </span>
                </div>

                <div className="relative h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1599582296065-272e61678564?auto=format&fit=crop&w=600&q=80"
                    alt="Specimen preview"
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs text-slate-200">
                      {t('cropDoctorSubtitle')}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{t('needImmediateConsultation')}</span>
                  <a href="tel:18001801551" className="text-emerald-400 font-bold hover:underline">1800-180-1551</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW KRISHIDRISHTI WORKS (3-STEP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
            {t('howItWorksTag')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
            {t('howItWorksDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-800/40">01</span>
              <Mic className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('step1Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-800/40">02</span>
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('step2Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-800/40">03</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('step3Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 6. TODAY'S KEY COMMODITY RATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4 text-left">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
              {t('todaysRatesTag')}
            </span>
            <h3 className="text-lg font-bold text-slate-900">{t('todaysRatesTitle')}</h3>
          </div>
          <Link to="/mandi" className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1">
            <span>{t('openLiveMandi')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-500">Wheat (Sharbati)</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">+2.5%</span>
            </div>
            <div className="text-xs font-bold text-slate-800 mb-2">Khanna APMC</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">₹2,840</span>
              <span className="text-[11px] text-slate-500">{t('perQuintal')}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-500">Soybean (Yellow)</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">+1.8%</span>
            </div>
            <div className="text-xs font-bold text-slate-800 mb-2">Indore APMC</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">₹4,950</span>
              <span className="text-[11px] text-slate-500">{t('perQuintal')}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-500">Onion (Red)</span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">-3.1%</span>
            </div>
            <div className="text-xs font-bold text-slate-800 mb-2">Lasalgaon APMC</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">₹1,720</span>
              <span className="text-[11px] text-slate-500">{t('perQuintal')}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-500">Cotton (Medium)</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">+0.9%</span>
            </div>
            <div className="text-xs font-bold text-slate-800 mb-2">Rajkot APMC</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">₹7,180</span>
              <span className="text-[11px] text-slate-500">{t('perQuintal')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FARMER VOICES (TESTIMONIALS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-left">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
              {t('testimonialsTag')}
            </span>
            <h3 className="text-xl font-black text-slate-900">{t('testimonialsTitle')}</h3>
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <div className="flex text-amber-400">
              {'★'.repeat(5)}
            </div>
            <span className="text-slate-600">4.9/5 (12,000+ Kisan)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
              "The early detection alert for Soybean Rust saved nearly 40% of my harvest last monsoon. Speaking to it in Marathi makes it feel like having an expert standing right next to me in the field."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                RJ
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Rameshwar Jadhav</div>
                <div className="text-[11px] text-slate-500">Soybean & Cotton Grower • Amravati, Maharashtra</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
              "Mandi price tracking alone made me an extra ₹32,000 on my wheat lot. The app notified me that Ludhiana prices were rising due to fewer arrivals, so I delayed my harvest sale by 4 days."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-amber-800 text-white font-bold text-xs flex items-center justify-center">
                GS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Gurpreet Singh</div>
                <div className="text-[11px] text-slate-500">Wheat & Paddy Cultivator • Khanna, Punjab</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERNACULAR VOICE CTA BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#124131] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left max-w-xl">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-800/80 text-emerald-200 font-bold text-[10px] uppercase tracking-wider">
              {t('voiceCtaTag')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {t('voiceCtaTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 font-devanagari italic">
              {t('voiceCtaExample')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>{t('speakNowBtn')}</span>
            </Link>
            <a
              href="https://wa.me/9118001801551"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-700/60 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp / 18001801551</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. DATA COMPLIANCE BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <span className="font-bold text-slate-900">{t('dataComplianceTitle')}</span>{' '}
              <span>{t('dataComplianceDesc')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500">
            <span>🔒 Zero PII Stored</span>
            <span>⚡ Daily API Synchronization</span>
            <span>🌱 Free for Progressive Kisan</span>
          </div>
        </div>
      </section>
    </div>
  );
};
