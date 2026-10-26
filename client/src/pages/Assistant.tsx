import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Camera, 
  MapPin, 
  CloudSun, 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Upload, 
  ChevronRight, 
  User, 
  Info, 
  RotateCcw 
} from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { sendAssistantQuery } from '../services/api';
import { HonestEmptyState } from '../components/HonestEmptyState';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  timestamp: string;
  badge?: string;
  content: string;
  isError?: boolean;
}

export const Assistant: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile } = useAuth();

  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWaitingAi, setIsWaitingAi] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickQueries = [
    { textEn: "What is the recommended sowing depth for soybean in black soil?", textMr: "काळी जमिनीत सोयाबीन पेरणीची शिफारस केलेली खोली किती असावी?", textHi: "काली मिट्टी में सोयाबीन बुवाई की सही गहराई क्या है?", icon: "🌱" },
    { textEn: "How to manage fungal root rot in tomato seedlings?", textMr: "टोमॅटो रोपांमधील मूळकूज (root rot) व्यवस्थापन कसे करावे?", textHi: "टमाटर के पौधों में जड़ गलन रोग का प्रबंधन कैसे करें?", icon: "🌿" },
    { textEn: "What is the optimal water requirement for onion bulb formation?", textMr: "कांदा कंद वाढीच्या अवस्थेत पाणी देण्याची वेळ व प्रमाण काय?", textHi: "प्याज की कंद विकास अवस्था में सिंचाई का सही समय क्या है?", icon: "💧" },
    { textEn: "Which bio-fertilizers are recommended for pulses in Maharashtra?", textMr: "महाराष्ट्रात कडधान्य पिकांसाठी कोणती जैविक खते शिफारसित आहेत?", textHi: "दलहनी फसलों के लिए कौन से जैव उर्वरक अनुशंसित हैं?", icon: "🧪" }
  ];

  // Speech Recognition (Web Speech API)
  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Text-To-Speech (Web Speech API)
  const playAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isWaitingAi) return;

    const currentInput = inputQuery.trim();
    setInputQuery('');

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: currentInput
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsWaitingAi(true);

    const history = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }]
    }));

    const farmContext = profile
      ? {
          district: profile.district,
          taluka: profile.taluka,
          soilType: profile.primarySoilType,
          landAcres: profile.totalLandAcres
        }
      : undefined;

    try {
      const res = await sendAssistantQuery(currentInput, language, history, farmContext);

      if (res.unconfigured) {
        const unconfiguredMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge: 'Service Unconfigured',
          content: res.message || (language === 'mr'
            ? 'कृषि मित्र AI सेवा अद्याप सक्रिय नाही. थेट मराठीत मार्गदर्शन मिळवण्यासाठी कृपया सर्व्हरवर GEMINI_API_KEY कॉन्फिगर करा. झिरो फेक डेटा धोरणानुसार बनावट उत्तरे दिली जात नाहीत.'
            : language === 'hi'
            ? 'कृषि मित्र AI सेवा अभी कॉन्फ़िगर नहीं है। लाइव हिंदी परामर्श के लिए कृपया सर्वर में GEMINI_API_KEY सेट करें। जीरो फेक डेटा नीति के तहत बनावटी उत्तर नहीं दिए जाते हैं।'
            : 'Krishi Mitra AI conversational service is not configured. Please set GEMINI_API_KEY in server/.env to enable genuine AI answers. Under our Zero Fake Data policy, simulated responses are prohibited.'),
          isError: true
        };
        setMessages((prev) => [...prev, unconfiguredMsg]);
      } else if (!res.success || !res.reply) {
        const errorMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge: 'Service Notice',
          content: res.message || 'Unable to receive AI response. Please try again.',
          isError: true
        };
        setMessages((prev) => [...prev, errorMsg]);
      } else {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge: 'Gemini Verified',
          content: res.reply
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      const networkErrorMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'Connection Error',
        content: `Network connection error: ${err.message}. Ensure backend is running.`,
        isError: true
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsWaitingAi(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingAi]);

  const getQuickQueryText = (q: typeof quickQueries[0]) => {
    if (language === 'mr') return q.textMr;
    if (language === 'hi') return q.textHi;
    return q.textEn;
  };

  const farmerInitials = profile?.fullName
    ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user
    ? user.email?.slice(0, 2).toUpperCase()
    : 'KM';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{t('aiCoreTrilingual')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('navAssistant')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('aiAssistantDesc')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex items-center text-xs font-bold text-slate-700">
            {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === lang
                    ? 'bg-[#124131] text-white shadow-xs'
                    : 'hover:text-emerald-950'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. QUICK FARMING QUERIES */}
      <div className="space-y-1 text-left">
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
          {t('quickFarmingQueries')}
        </span>
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {quickQueries.map((q, idx) => {
            const queryText = getQuickQueryText(q);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setInputQuery(queryText)}
                className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-950 border border-slate-200/90 text-xs font-semibold shadow-2xs transition-all"
              >
                <span>{q.icon}</span>
                <span>{queryText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE (CHAT + SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Chat Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[680px]">
          
          {/* Scrollable Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <Bot className="w-8 h-8 text-[#124131]" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-lg font-bold text-slate-900">
                    {t('welcomeToKrishiMitra')}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t('krishiMitraIntroDesc')}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full pt-2">
                  {quickQueries.map((q, idx) => {
                    const queryText = getQuickQueryText(q);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputQuery(queryText)}
                        className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 text-xs text-slate-700 transition-all flex items-start gap-2"
                      >
                        <span className="text-sm shrink-0">{q.icon}</span>
                        <span className="line-clamp-2">{queryText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isAi = msg.sender === 'ai';

                return (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isAi ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {isAi ? 'KD' : t('you')}
                      </div>
                      <span className="font-bold text-slate-800">
                        {isAi ? 'KrishiDrishti AI' : profile?.fullName || t('farmer')}
                      </span>
                      <span className="font-mono text-[11px]">{msg.timestamp}</span>
                      {msg.badge && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          msg.isError ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {msg.badge}
                        </span>
                      )}
                    </div>

                    <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? msg.isError
                          ? 'bg-rose-50/70 border border-rose-200 text-rose-950'
                          : 'bg-[#FAFDF9] border border-emerald-900/10 text-slate-800 shadow-2xs'
                        : 'bg-emerald-900 text-white ml-8 shadow-xs'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {isAi && !msg.isError && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <button
                            type="button"
                            onClick={() => playAudio(msg.content)}
                            className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:underline"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isSpeaking ? t('stopReading') : t('listenAudio')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isWaitingAi && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    KD
                  </div>
                  <span className="font-bold text-slate-800">KrishiDrishti AI</span>
                  <span className="font-mono text-[11px]">Thinking...</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAFDF9] border border-emerald-900/10 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-500 font-medium">
                    {t('thinkingStatus')}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Mic Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3.5 rounded-2xl flex items-center gap-1.5 font-bold text-xs transition-all shrink-0 shadow-xs ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white border border-slate-200 text-emerald-900 hover:bg-emerald-50'
                }`}
                title="Speak in your language"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-800" />}
                <span className="hidden sm:inline font-devanagari">
                  {isRecording ? t('listening') : t('speakToAsk')}
                </span>
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={t('typeQueryPlaceholder')}
                className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:outline-hidden focus:border-emerald-700 text-xs sm:text-sm font-medium shadow-2xs"
              />

              {/* Camera Shortcut */}
              <Link
                to="/crop-doctor"
                className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-all shrink-0"
                title="Scan Leaf Photo"
              >
                <Camera className="w-5 h-5" />
              </Link>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isWaitingAi || !inputQuery.trim()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#124131] hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0"
              >
                <span>{t('send')}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400">
              {t('zeroFakeDataPolicy')}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Context, Weather, Helplines (4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Field Context Profile */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('fieldContextProfile')}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {user ? t('cloudSynced') : t('guestMode')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#124131] text-emerald-300 flex items-center justify-center font-bold text-sm">
                {farmerInitials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {profile?.fullName || (user ? user.email?.split('@')[0] : t('kisanFriend'))}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {profile?.district ? `${profile.taluka}, ${profile.district}` : t('districtUnconfigured')}
                </p>
                <p className="text-[11px] font-semibold text-emerald-800">
                  {t('holdingAcres', { acres: profile?.totalLandAcres || 0 })}
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
              <span className="font-bold text-slate-700 block text-[11px]">{t('soilClassification')}</span>
              <span className="text-slate-500">{profile?.primarySoilType || t('notSpecifiedInProfile')}</span>
            </div>
          </div>

          {/* Local Weather Window (Phase 5 Notice) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('localMeteoTelemetry')}
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold">Phase 5</span>
            </div>

            <HonestEmptyState
              type="unconfigured"
              title={t('liveWeatherUnconnected')}
              description={t('liveWeatherPhase5Desc')}
            />
          </div>

          {/* Certified Input Centers & Government Helplines */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('officialKisanHelplines')}
              </span>
              <span className="text-[11px] font-bold text-emerald-800">{t('tollFree')}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900">{t('kccGovtTitle')}</h5>
                  <p className="text-[11px] text-slate-500">{t('kccGovtDesc')}</p>
                </div>
                <a
                  href="tel:18001801551"
                  className="font-mono font-bold text-emerald-800 hover:underline"
                >
                  1800-180-1551
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900">{t('mahadbtTitle')}</h5>
                  <p className="text-[11px] text-slate-500">{t('mahadbtDesc')}</p>
                </div>
                <a
                  href="tel:18001208040"
                  className="font-mono font-bold text-emerald-800 hover:underline"
                >
                  1800-120-8040
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
