import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  CloudSun, 
  Droplets, 
  Activity, 
  TrendingUp, 
  Plus, 
  Camera, 
  Mic, 
  Clock, 
  FileText, 
  ArrowRight,
  MapPin,
  Maximize2,
  X,
  Sparkles,
  LogIn,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { PlotRecord, FarmActivityLog, ActionCenterAlert } from '../services/api';
import { HonestEmptyState } from '../components/HonestEmptyState';
import { CROP_VISUALS_REGISTRY, getCropVisual, resolvePlotPhoto, DEFAULT_CROP_IMAGE } from '../data/cropVisuals';

export const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Active Plots & Activity Logs
  const [plots, setPlots] = useState<PlotRecord[]>([]);
  const [logs, setLogs] = useState<FarmActivityLog[]>([]);
  const [alerts, setAlerts] = useState<ActionCenterAlert[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Modals
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form states
  const [newPlotName, setNewPlotName] = useState('');
  const [newCropName, setNewCropName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newArea, setNewArea] = useState('2.0');
  const [selectedCropPhoto, setSelectedCropPhoto] = useState<string>('');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [showCustomPhotoInput, setShowCustomPhotoInput] = useState<boolean>(false);
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogDesc, setNewLogDesc] = useState('');
  const [newLogType, setNewLogType] = useState<'soil' | 'disease' | 'irrigation' | 'fertilizer'>('fertilizer');

  // Load real plots, logs, and tasks from Supabase or authenticated local session
  const loadUserData = async () => {
    if (!user) {
      setPlots([]);
      setLogs([]);
      setAlerts([]);
      return;
    }

    if (!isSupabaseConfigured) {
      try {
        const localPlots = localStorage.getItem(`krishidrishti_plots_${user.id}`);
        if (localPlots) {
          const parsed = JSON.parse(localPlots);
          setPlots(parsed.map((p: any) => ({
            ...p,
            photoUrl: resolvePlotPhoto(p.photoUrl, p.cropName)
          })));
        }
        const localLogs = localStorage.getItem(`krishidrishti_logs_${user.id}`);
        if (localLogs) setLogs(JSON.parse(localLogs));
        const localTasks = localStorage.getItem(`krishidrishti_tasks_${user.id}`);
        if (localTasks) setAlerts(JSON.parse(localTasks));
      } catch (e) {
        console.error('Failed reading local farm records:', e);
      }
      return;
    }

    setLoadingData(true);
    setDbError(null);

    try {
      // 1. Fetch Plots for this user
      const { data: plotsData, error: plotsError } = await supabase
        .from('plots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (plotsError) throw plotsError;

      if (plotsData) {
        setPlots(plotsData.map((p: any) => ({
          id: p.id,
          plotName: p.plot_name,
          cropName: p.crop_name,
          variety: p.variety || 'Certified',
          areaAcres: parseFloat(p.area_acres) || 1.0,
          sownDate: p.sown_date ? `Sown on ${p.sown_date}` : 'Recently sown',
          stage: p.stage || 'Vegetative',
          healthStatus: p.health_status || 'Optimal',
          waterNeed: p.water_need || 'Moderate',
          targetHarvestDays: p.target_harvest_days || 90,
          nextAction: p.next_action || 'Regular monitoring',
          photoUrl: resolvePlotPhoto(p.photo_url, p.crop_name)
        })));
      }

      // 2. Fetch Activity Logs for this user
      const { data: logsData, error: logsError } = await supabase
        .from('farm_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      if (logsData) {
        setLogs(logsData.map((l: any) => ({
          id: l.id,
          title: l.title,
          timestamp: new Date(l.created_at).toLocaleDateString(),
          description: l.description,
          type: l.log_type,
          labId: l.lab_id
        })));
      }

      // 3. Fetch Tasks/Alerts for this user from farm_tasks table
      const { data: tasksData, error: tasksError } = await supabase
        .from('farm_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('planned_date', { ascending: true });

      if (!tasksError && tasksData) {
        setAlerts(tasksData.map((t: any) => ({
          id: t.id,
          priority: t.priority === 'High' ? 'HIGH PRIORITY' : 'ROUTINE MAINTENANCE',
          timing: t.planned_date,
          title: t.task_description,
          description: t.notes || `Scheduled operation on ${t.plot_name}.`,
          dosage: undefined,
          completed: t.status === 'Completed'
        })));
      }
    } catch (err: any) {
      console.error('Failed to load user farm data:', err);
      setDbError(err.message || 'Failed to fetch database records.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  const handleRegisterPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;

    const visual = getCropVisual(newCropName.trim());
    const finalPhotoUrl = (showCustomPhotoInput && customPhotoUrl.trim())
      ? customPhotoUrl.trim()
      : (selectedCropPhoto || visual.imageUrl);

    const harvestDays = visual.meta?.defaultHarvestDays || 90;
    const waterNeed = visual.meta?.defaultWaterNeed || 'Moderate (Drip)';
    const stage = visual.meta?.defaultStage || 'Vegetative';
    const finalVariety = newVariety.trim() || visual.meta?.popularVarieties[0] || 'Certified Seed';

    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('plots').insert({
          user_id: user.id,
          plot_name: newPlotName.trim() || `Plot ${String.fromCharCode(65 + plots.length)}`,
          crop_name: newCropName.trim(),
          variety: finalVariety,
          area_acres: parseFloat(newArea) || 1.0,
          stage: stage,
          health_status: 'Optimal',
          water_need: waterNeed,
          target_harvest_days: harvestDays,
          next_action: 'Vegetative growth monitoring in 7 days',
          photo_url: finalPhotoUrl
        });

        if (error) throw error;
        await loadUserData();
      } catch (err: any) {
        alert(`Error saving plot: ${err.message}`);
      }
    } else {
      const localPlot: PlotRecord = {
        id: `plot-${Date.now()}`,
        plotName: newPlotName.trim() || `Plot ${String.fromCharCode(65 + plots.length)}`,
        cropName: newCropName.trim(),
        variety: finalVariety,
        areaAcres: parseFloat(newArea) || 1.0,
        sownDate: new Date().toISOString().split('T')[0],
        stage: stage,
        healthStatus: 'Optimal',
        waterNeed: waterNeed,
        targetHarvestDays: harvestDays,
        nextAction: 'First basal weeding in 10 days',
        photoUrl: finalPhotoUrl
      };
      const updated = [localPlot, ...plots];
      setPlots(updated);
      if (user) {
        localStorage.setItem(`krishidrishti_plots_${user.id}`, JSON.stringify(updated));
      }
    }

    setIsAddPlotOpen(false);
    setNewPlotName('');
    setNewCropName('');
    setNewVariety('');
    setNewArea('2.0');
    setSelectedCropPhoto('');
    setCustomPhotoUrl('');
    setShowCustomPhotoInput(false);
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle) return;

    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('farm_activity_logs').insert({
          user_id: user.id,
          title: newLogTitle,
          log_type: newLogType,
          description: newLogDesc || 'Manual entry recorded in digital Kisan Bahi.',
          lab_id: newLogType === 'soil' ? `SOIL-${Date.now().toString().slice(-4)}` : null
        });

        if (error) throw error;
        await loadUserData();
      } catch (err: any) {
        alert(`Error saving activity log: ${err.message}`);
      }
    } else {
      const localLog: FarmActivityLog = {
        id: `log-${Date.now()}`,
        title: newLogTitle,
        timestamp: new Date().toLocaleDateString(),
        description: newLogDesc || 'Manual field entry saved to digital Kisan Bahi.',
        type: newLogType
      };
      const updated = [localLog, ...logs];
      setLogs(updated);
      if (user) {
        localStorage.setItem(`krishidrishti_logs_${user.id}`, JSON.stringify(updated));
      }
    }

    setIsLogModalOpen(false);
    setNewLogTitle('');
    setNewLogDesc('');
  };

  const toggleAlertCompleted = async (id: string) => {
    const target = alerts.find(a => a.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;

    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from('farm_tasks')
          .update({
            status: nextCompleted ? 'Completed' : 'Pending',
            completed_at: nextCompleted ? new Date().toISOString() : null
          })
          .eq('id', id);
        await loadUserData();
      } catch (err: any) {
        console.error('Error toggling task:', err);
      }
    } else {
      const updated = alerts.map(a => a.id === id ? { ...a, completed: nextCompleted } : a);
      setAlerts(updated);
      if (user) {
        localStorage.setItem(`krishidrishti_tasks_${user.id}`, JSON.stringify(updated));
      }
    }
  };

  const soilLogs = logs.filter(l => l.type === 'soil');

  const matchedCropMeta = getCropVisual(newCropName);
  const activeCropPhotoPreview = (showCustomPhotoInput && customPhotoUrl.trim())
    ? customPhotoUrl.trim()
    : (selectedCropPhoto || matchedCropMeta.imageUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. TOP HEADER & TELEMETRY SYNC STATUS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-2">
              <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-600' : 'bg-amber-600'} animate-ping`} />
              <span>
                {user
                  ? `${t('cloudSynced')} • ${t('kisanRegId')}: ${profile?.kisanRegId || 'MH-NSK-ACTIVE'}`
                  : t('guestMode')}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('welcomeGreeting')}, {profile?.fullName || (user ? user.email?.split('@')[0] : t('kisanFriend'))}!
            </h1>
            
            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {profile?.district
                    ? `${profile.taluka}, ${profile.district}, ${profile.state}`
                    : user
                    ? t('districtUnconfigured')
                    : t('unregisteredProfile')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {profile?.totalLandAcres ? `${profile.totalLandAcres} ${t('acres')}` : user ? `0.0 ${t('acresRegistered')}` : t('holdingUnspecified')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('soilClassification')} {profile?.primarySoilType || t('soilUnconfigured')}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/crop-doctor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{t('scanNewLeaf')}</span>
            </Link>

            <Link
              to="/mandi"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs transition-all"
            >
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>{t('todayMandi')}</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-2xs transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{t('logEntry')}</span>
            </button>

            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>{t('voiceQuery')}</span>
            </Link>
          </div>
        </div>

        {/* VERIFIED FARMER PROFILE & LAND REGISTRY CARD (REAL USER DATA) */}
        {user && profile ? (
          <div className="bg-[#FAFDF9] rounded-3xl p-6 sm:p-7 border border-emerald-900/15 shadow-xs text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-900/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{t('farmerProfileCardTitle')}</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {t('kisanIdLabel')}: <strong className="text-emerald-800">{profile.kisanRegId || 'MH-ACTIVE'}</strong>
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('verifiedFarmerStatus')}</span>
              </div>
            </div>

            {/* 10+ Real Submitted Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('farmerFullName')}</span>
                <strong className="text-slate-900 truncate block mt-0.5">{profile.fullName || user.email?.split('@')[0]}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('mobileNumber')}</span>
                <strong className="text-slate-900 font-mono block mt-0.5">{profile.phoneNumber || t('notSpecified')}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('villageLabel')}</span>
                <strong className="text-slate-900 block mt-0.5">{profile.village || t('notSpecified')}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('talukaLabel')}</span>
                <strong className="text-slate-900 block mt-0.5">{profile.taluka || t('notSpecified')}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('districtLabel')}</span>
                <strong className="text-slate-900 block mt-0.5">{profile.district || t('notSpecified')}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('stateLabel')}</span>
                <strong className="text-slate-900 block mt-0.5">{profile.state || 'Maharashtra'}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('totalLandHolding')}</span>
                <strong className="text-emerald-800 font-bold block mt-0.5">
                  {profile.totalLandAcres ? `${profile.totalLandAcres} ${t('acres')}` : t('holdingUnspecified')}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('soilTypeLabel')}</span>
                <strong className="text-slate-900 block mt-0.5">{profile.primarySoilType || t('soilUnconfigured')}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('preferredLanguageLabel')}</span>
                <strong className="text-slate-900 block mt-0.5">
                  {profile.preferredLanguage === 'mr' ? 'मराठी' : profile.preferredLanguage === 'hi' ? 'हिन्दी' : 'English'}
                </strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 col-span-2 sm:col-span-1 lg:col-span-3">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t('emailAddress')}</span>
                <strong className="text-slate-900 font-mono text-[11px] truncate block mt-0.5">{user.email}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-xs text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900">{t('unregisteredFarmerTitle')}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {t('unregisteredFarmerDesc')}
                  </p>
                </div>
              </div>

              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs shrink-0 shadow-xs transition-all self-start sm:self-auto"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('registerNewFarmerBtn')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. FIELD OPERATIONS MATRIX */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
            <span>{t('operationalStatus')}</span>
            <span className="flex items-center gap-1 text-[11px] font-mono normal-case">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> {t('databaseLive')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Weather & Field Work */}
            <Link to="/weather" className="bg-[#FAFDF9] rounded-2xl p-4 border border-emerald-900/10 shadow-2xs hover:border-emerald-600 transition-all text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{t('weatherTelemetry')}</span>
                <CloudSun className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-slate-800">{t('pendingPhase5')}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">{t('liveOpenMeteo')}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{t('configureLiveWeather')}</span>
              </div>
            </Link>

            {/* Card 2: Irrigation Advisory */}
            <div className="bg-[#FAFDF9] rounded-2xl p-4 border border-emerald-900/10 shadow-2xs text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{t('irrigationAdvisory')}</span>
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-slate-800">
                  {plots.length > 0 ? t('plotsTracked', { count: plots.length }) : t('noPlots')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                {plots.length > 0 ? t('plotsTracked', { count: plots.length }) : t('addPlotToTrack')}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{plots.length > 0 ? t('waterNeedModerate') : t('zeroActivePlots')}</span>
              </div>
            </div>

            {/* Card 3: Crop Health Score */}
            <div className="bg-[#FAFDF9] rounded-2xl p-4 border border-emerald-900/10 shadow-2xs text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{t('cropHealthTracker')}</span>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-slate-900">
                  {plots.length > 0 ? t('activePlotsCount', { count: plots.length }) : `0 ${t('acres')}`}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mb-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: plots.length > 0 ? '100%' : '0%' }} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{plots.length > 0 ? t('cultivationActive') : t('noRecordsFound')}</span>
              </div>
            </div>

            {/* Card 4: Top Mandi */}
            <Link to="/mandi" className="bg-[#FAFDF9] rounded-2xl p-4 border border-emerald-900/10 shadow-2xs hover:border-emerald-600 transition-all text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">{t('apmcMandiRates')}</span>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-slate-800">{t('pendingPhase6')}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">{t('agmarknetFeeds')}</p>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                <span>{t('viewMandiSection')}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Active Crops, Ask AI Banner, Farm Log */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Crops Tracker */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {t('cultivationTrackerTag')}
                </span>
                <h2 className="text-xl font-black text-slate-900">{t('myActiveCrops')}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPlotOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('registerNewPlot')}</span>
              </button>
            </div>

            {/* Plot Cards Grid */}
            {plots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {plots.map((plot) => (
                  <div key={plot.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                      {/* Photo Header */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={resolvePlotPhoto(plot.photoUrl, plot.cropName)}
                          alt={plot.cropName}
                          className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const fallback = getCropVisual(plot.cropName).imageUrl;
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Health Status Pill */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                            plot.healthStatus === 'Optimal'
                              ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40'
                              : 'bg-amber-900/80 text-amber-200 border border-amber-500/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${plot.healthStatus === 'Optimal' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {plot.healthStatus === 'Optimal' ? t('healthOptimal') : t('attentionNeeded')}
                          </span>
                        </div>

                        {/* Plot Area Tag */}
                        <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                          {plot.plotName} • {plot.areaAcres} {t('acres')}
                        </div>
                      </div>

                      {/* Plot Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{plot.cropName}</h3>
                          <p className="text-xs text-slate-500">
                            {plot.sownDate?.includes('Sown on') || plot.sownDate?.includes('-')
                              ? t('sownOnDate', { date: plot.sownDate.replace('Sown on ', '') })
                              : t('sownToday')} • {t('status')}: <strong className="text-slate-800">{plot.stage === 'Vegetative' ? t('vegetativeStage') : plot.stage}</strong>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-medium">{t('waterNeed')}</span>
                            <span className="font-bold text-slate-800">
                              {plot.waterNeed?.toLowerCase().includes('drip') || plot.waterNeed?.toLowerCase().includes('moderate') || plot.waterNeed?.toLowerCase().includes('medium')
                                ? t('moderateDrip')
                                : plot.waterNeed}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-slate-400 block font-medium">{t('targetHarvest')}</span>
                            <span className="font-bold text-slate-800">{t('inDays', { days: plot.targetHarvestDays })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Action Link */}
                    <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">{t('nextAction')}</span>
                      <span className="text-emerald-800">
                        {plot.nextAction?.toLowerCase().includes('monitoring')
                          ? t('regularMonitoring')
                          : plot.nextAction?.toLowerCase().includes('weeding')
                          ? t('basalWeedingHint')
                          : plot.nextAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <HonestEmptyState
                type="empty"
                title={t('noPlotsTitle')}
                description={t('noPlotsDesc')}
                actionText={t('registerFirstPlot')}
                onAction={() => setIsAddPlotOpen(true)}
              />
            )}
          </div>

          {/* Ask AI Banner */}
          <div className="rounded-3xl bg-[#124131] text-white p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t('cropQuestionBannerTitle')}</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {t('cropQuestionBannerSubtitle')}
                </p>
              </div>
            </div>

            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#124131] hover:bg-emerald-50 font-bold text-xs shrink-0 shadow-xs transition-all"
            >
              <span>{t('openAiKisanMitra')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Activities & Farm Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t('auditTrail')}
                </span>
                <h3 className="text-lg font-black text-slate-900">{t('recentActivities')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                {t('addEntry')}
              </button>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      log.type === 'soil' ? 'bg-amber-100 text-amber-800' : log.type === 'disease' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.type === 'soil' ? '🧪' : log.type === 'disease' ? '🌿' : '💧'}
                    </div>
                    <div className="space-y-1 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{log.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{log.description}</p>
                      {log.labId && (
                        <span className="inline-block text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Ref: {log.labId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <HonestEmptyState
                type="empty"
                title={t('noActivitiesTitle')}
                description={t('noActivitiesDesc')}
                actionText={t('recordFirstActivity')}
                onAction={() => setIsLogModalOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Action Center & Diagnostics Overview */}
        <div className="lg:col-span-4 space-y-8 text-left">
          
          {/* Action Center */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {t('tasksAndAlerts')}
                </span>
                <h3 className="text-base font-black text-slate-900">{t('actionCenter')}</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                {t('pendingTasksCount', { count: alerts.filter(a => !a.completed).length })}
              </span>
            </div>

            {alerts.length > 0 ? (
              <div className="space-y-3.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      alert.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : alert.priority === 'HIGH PRIORITY'
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-blue-50/50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                      <span className={alert.priority === 'HIGH PRIORITY' ? 'text-rose-700' : 'text-blue-800'}>
                        {alert.priority === 'HIGH PRIORITY' ? t('highPriority') : t('routineMaintenance')}
                      </span>
                      <span className="text-slate-500">{alert.timing}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mb-1">{alert.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{alert.description}</p>

                    <div className="flex items-center justify-end pt-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => toggleAlertCompleted(alert.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                          alert.completed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {alert.completed ? `${t('completed')} ✓` : t('markCompleted')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <HonestEmptyState
                type="empty"
                title={t('noAlertsTitle')}
                description={t('noAlertsDesc')}
                actionText={t('openFarmPlanner')}
                onAction={() => navigate('/farm-planning')}
              />
            )}
          </div>

          {/* Field Diagnostics Overview (NPK & Soil Health) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {t('soilHealthCard')}
              </span>
              <h3 className="text-base font-black text-slate-900">{t('fieldDiagnosticsOverview')}</h3>
            </div>

            {soilLogs.length > 0 ? (
              <div className="space-y-3.5 text-xs">
                {soilLogs.map(s => (
                  <div key={s.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{s.title}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{s.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-xs">{s.description}</p>
                    {s.labId && (
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Ref: {s.labId}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <HonestEmptyState
                type="empty"
                title={t('noSoilTestTitle')}
                description={t('noSoilTestDesc')}
                actionText={t('logSoilTestReport')}
                onAction={() => {
                  setNewLogType('soil');
                  setNewLogTitle('Soil Health Card Report');
                  setIsLogModalOpen(true);
                }}
              />
            )}
          </div>

        </div>
      </div>

      {/* MODAL 1: REGISTER NEW PLOT */}
      {isAddPlotOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 text-left my-8 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{t('registerPlotModalTitle')}</h3>
                  <p className="text-[11px] text-slate-500">Zero Fake Data • Authentic crop photo matching</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddPlotOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPlot} className="space-y-4 text-xs">
              {/* LIVE SOWN CROP PHOTO PREVIEW BANNER */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900 h-36">
                <img
                  src={activeCropPhotoPreview}
                  alt={newCropName || 'Sown Crop Preview'}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    const fallback = DEFAULT_CROP_IMAGE;
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                {/* Badge top-left */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-[10px] text-emerald-200 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{t('verifiedVisualBadge')}</span>
                </div>

                {/* Crop Name & Details bottom-left */}
                <div className="absolute bottom-2.5 left-3 text-white max-w-[70%]">
                  <div className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                    <span>{newCropName || t('cropSownLabel')}</span>
                    {matchedCropMeta.meta && (
                      <span className="text-[11px] font-normal text-emerald-300">
                        ({language === 'mr' ? matchedCropMeta.meta.marathiName : matchedCropMeta.meta.hindiName})
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-300 font-medium truncate">
                    {matchedCropMeta.meta 
                      ? `${matchedCropMeta.meta.category} • Target harvest ~${matchedCropMeta.meta.defaultHarvestDays} days` 
                      : 'Auto-mapped to verified authentic crop photography'}
                  </div>
                </div>

                {/* Area Preview bottom-right */}
                {newArea && (
                  <div className="absolute bottom-2.5 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-200 border border-white/10">
                    {newPlotName || 'Plot'} • {newArea} {t('acres')}
                  </div>
                )}
              </div>

              {/* QUICK SELECT COMMON CROPS */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5 text-[11px] flex items-center justify-between">
                  <span>{t('quickSelectCrop')}</span>
                  <span className="text-[10px] text-emerald-800 font-semibold">Tap to auto-fill crop & image</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200/80">
                  {CROP_VISUALS_REGISTRY.slice(0, 14).map((crop) => {
                    const isSelected = newCropName.toLowerCase() === crop.name.toLowerCase() ||
                      newCropName === crop.marathiName ||
                      newCropName === crop.hindiName ||
                      selectedCropPhoto === crop.imageUrl;

                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => {
                          const displayName = language === 'mr' ? crop.marathiName : language === 'hi' ? crop.hindiName : crop.name;
                          setNewCropName(displayName);
                          setSelectedCropPhoto(crop.imageUrl);
                          setShowCustomPhotoInput(false);
                          if (crop.popularVarieties.length > 0) {
                            setNewVariety(crop.popularVarieties[0]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#124131] text-white shadow-xs scale-102'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                        <span>{language === 'mr' ? crop.marathiName : language === 'hi' ? crop.hindiName : crop.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('plotNameLabel')}</label>
                  <input
                    type="text"
                    placeholder={t('plotNamePlaceholder')}
                    value={newPlotName}
                    onChange={(e) => setNewPlotName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('cropSownLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('cropSownPlaceholder')}
                    value={newCropName}
                    onChange={(e) => {
                      setNewCropName(e.target.value);
                      setSelectedCropPhoto(''); // dynamic resolve from typed text
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium bg-white"
                  />
                </div>
              </div>

              {/* VARIETY WITH SUGGESTIONS & AREA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('varietyLabel')}</label>
                  <input
                    type="text"
                    placeholder={t('varietyPlaceholder')}
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium bg-white"
                  />
                  {matchedCropMeta.meta && matchedCropMeta.meta.popularVarieties.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 items-center">
                      <span className="text-[10px] text-slate-400 font-medium">{t('varietySuggestions')}</span>
                      {matchedCropMeta.meta.popularVarieties.slice(0, 3).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setNewVariety(v)}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold border border-emerald-200/60"
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('areaAcresLabel')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium bg-white"
                  />
                </div>
              </div>

              {/* CUSTOM PHOTO ACCORDION / TOGGLE */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomPhotoInput(!showCustomPhotoInput)}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{showCustomPhotoInput ? '▲ Hide Custom Photo Option' : '▼ Want to provide custom field photo URL?'}</span>
                </button>

                {showCustomPhotoInput && (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 block text-[11px]">{t('customPhotoToggle')}</label>
                    <input
                      type="url"
                      placeholder={t('customPhotoPlaceholder')}
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-mono text-xs bg-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      If left blank, KrishiDrishti assigns the verified high-definition photo for {newCropName || 'this crop'}.
                    </p>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPlotOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#124131] text-white font-bold hover:bg-emerald-900 transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('savePlotBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK ACTIVITY LOG ENTRY */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">{t('logModalTitle')}</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('logTitleLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('logTitlePlaceholder')}
                  value={newLogTitle}
                  onChange={(e) => setNewLogTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('logCategoryLabel')}</label>
                <select
                  value={newLogType}
                  onChange={(e) => setNewLogType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium bg-white"
                >
                  <option value="fertilizer">{t('catFertilizer')}</option>
                  <option value="soil">{t('catSoil')}</option>
                  <option value="disease">{t('catDisease')}</option>
                  <option value="irrigation">{t('catIrrigation')}</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('notesObservationsLabel')}</label>
                <textarea
                  rows={3}
                  placeholder={t('notesPlaceholder')}
                  value={newLogDesc}
                  onChange={(e) => setNewLogDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-700 font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#124131] text-white font-bold hover:bg-emerald-900"
                >
                  {t('recordEntryBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
