import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck,
  Check,
  Clock,
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { FarmTask, calculateFarmEconomics, FarmEconomicsRequest } from '../services/api';
import { HonestEmptyState } from '../components/HonestEmptyState';

export const FarmPlanning: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calculator' | 'tasks'>('calculator');

  // --- TAB 1: PROFIT CALCULATOR STATE ---
  const [landArea, setLandArea] = useState<number>(3.0);
  const [cropName, setCropName] = useState<string>('Soybean (JS-335)');
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(10.0);
  const [expectedMandiPrice, setExpectedMandiPrice] = useState<number>(4850);

  // Per Acre Input Costs
  const [landPrepCost, setLandPrepCost] = useState<number>(2500);
  const [seedsCost, setSeedsCost] = useState<number>(3000);
  const [fertilizerCost, setFertilizerCost] = useState<number>(3200);
  const [pesticidesCost, setPesticidesCost] = useState<number>(2100);
  const [irrigationCost, setIrrigationCost] = useState<number>(1200);
  const [laborCost, setLaborCost] = useState<number>(3500);
  const [harvestCost, setHarvestCost] = useState<number>(2500);

  const economicsRequest: FarmEconomicsRequest = {
    landAreaAcres: landArea,
    cropName,
    expectedYieldQuintalsPerAcre: expectedYieldPerAcre,
    expectedMandiPricePerQuintal: expectedMandiPrice,
    costs: {
      landPreparation: landPrepCost,
      seeds: seedsCost,
      fertilizers: fertilizerCost,
      pesticidesAndProtection: pesticidesCost,
      irrigationAndElectricity: irrigationCost,
      labor: laborCost,
      harvestingAndTransport: harvestCost
    }
  };

  const economics = calculateFarmEconomics(economicsRequest);

  const applyPreset = (crop: string) => {
    setCropName(crop);
    if (crop === 'Soybean') {
      setExpectedYieldPerAcre(10);
      setExpectedMandiPrice(4850);
      setLandPrepCost(2500);
      setSeedsCost(3000);
      setFertilizerCost(3200);
      setPesticidesCost(2100);
      setIrrigationCost(1200);
      setLaborCost(3500);
      setHarvestCost(2500);
    } else if (crop === 'Onion') {
      setExpectedYieldPerAcre(85);
      setExpectedMandiPrice(1750);
      setLandPrepCost(4500);
      setSeedsCost(7500);
      setFertilizerCost(6500);
      setPesticidesCost(4800);
      setIrrigationCost(3500);
      setLaborCost(14000);
      setHarvestCost(6500);
    } else if (crop === 'Cotton') {
      setExpectedYieldPerAcre(12);
      setExpectedMandiPrice(7200);
      setLandPrepCost(3500);
      setSeedsCost(2800);
      setFertilizerCost(5500);
      setPesticidesCost(4500);
      setIrrigationCost(2000);
      setLaborCost(8500);
      setHarvestCost(3200);
    } else if (crop === 'Wheat') {
      setExpectedYieldPerAcre(16);
      setExpectedMandiPrice(2840);
      setLandPrepCost(2800);
      setSeedsCost(2200);
      setFertilizerCost(4000);
      setPesticidesCost(1500);
      setIrrigationCost(2500);
      setLaborCost(4000);
      setHarvestCost(2500);
    }
  };

  // --- TAB 2: FARM TASKS & PLANNER STATE ---
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [newTaskPlot, setNewTaskPlot] = useState('Plot A (Soybean)');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('2026-10-30');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Routine'>('Medium');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const loadTasks = async () => {
    if (!user || !isSupabaseConfigured) {
      setTasks([]);
      return;
    }

    setLoadingTasks(true);
    try {
      const { data, error } = await supabase
        .from('farm_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('planned_date', { ascending: true });

      if (error) throw error;

      if (data) {
        setTasks(data.map((t: any) => ({
          id: t.id,
          plotName: t.plot_name,
          taskDescription: t.task_description,
          plannedDate: t.planned_date,
          priority: t.priority,
          status: t.status,
          notes: t.notes
        })));
      }
    } catch (err: any) {
      console.error('Failed to load farm tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc) return;

    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('farm_tasks').insert({
          user_id: user.id,
          plot_name: newTaskPlot,
          task_description: newTaskDesc,
          planned_date: newTaskDate,
          priority: newTaskPriority,
          status: 'Pending',
          notes: newTaskNotes
        });

        if (error) throw error;
        await loadTasks();
      } catch (err: any) {
        alert(`Error saving task: ${err.message}`);
      }
    } else {
      const newTask: FarmTask = {
        id: `task-${Date.now()}`,
        plotName: newTaskPlot,
        taskDescription: newTaskDesc,
        plannedDate: newTaskDate,
        priority: newTaskPriority,
        status: 'Pending',
        notes: newTaskNotes
      };
      setTasks([newTask, ...tasks]);
    }

    setNewTaskDesc('');
    setNewTaskNotes('');
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';

    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('farm_tasks')
          .update({
            status: nextStatus,
            completed_at: nextStatus === 'Completed' ? new Date().toISOString() : null
          })
          .eq('id', id);

        if (error) throw error;
        await loadTasks();
      } catch (err: any) {
        alert(`Error updating task: ${err.message}`);
      }
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    }
  };

  const deleteTask = async (id: string) => {
    if (user && isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('farm_tasks').delete().eq('id', id);
        if (error) throw error;
        await loadTasks();
      } catch (err: any) {
        alert(`Error deleting task: ${err.message}`);
      }
    } else {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-left">
      {/* 1. Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('farmEconomicsTag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('plannerTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            {t('plannerSubtitle')}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-[#124131] text-white shadow-xs'
                : 'hover:text-emerald-950'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{t('tabProfitCalculator')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'bg-[#124131] text-white shadow-xs'
                : 'hover:text-emerald-950'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('tabFarmTasks', { count: tasks.filter(t => t.status === 'Pending').length })}</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: PROFIT CALCULATOR --- */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Column (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">{t('productionRevenueInputs')}</h2>
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span className="text-slate-400">{t('benchmarks')}</span>
                <button type="button" onClick={() => applyPreset('Soybean')} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 rounded text-slate-700">{t('preset_soybean')}</button>
                <button type="button" onClick={() => applyPreset('Onion')} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 rounded text-slate-700">{t('preset_onion')}</button>
                <button type="button" onClick={() => applyPreset('Cotton')} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 rounded text-slate-700">{t('preset_cotton')}</button>
                <button type="button" onClick={() => applyPreset('Wheat')} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 rounded text-slate-700">{t('preset_wheat')}</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('plotAreaAcres')}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('cropTitle')}</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('expectedYieldPerAcre')}</label>
                <input
                  type="number"
                  step="0.5"
                  value={expectedYieldPerAcre}
                  onChange={(e) => setExpectedYieldPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('expectedMandiRate')}</label>
                <input
                  type="number"
                  step="50"
                  value={expectedMandiPrice}
                  onChange={(e) => setExpectedMandiPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h2 className="text-base font-black text-slate-900 mb-3">{t('cultivationExpenses')}</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('landPreparation')}</span>
                  <input
                    type="number"
                    value={landPrepCost}
                    onChange={(e) => setLandPrepCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('certifiedSeeds')}</span>
                  <input
                    type="number"
                    value={seedsCost}
                    onChange={(e) => setSeedsCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('fertilizersNutrients')}</span>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('cropProtection')}</span>
                  <input
                    type="number"
                    value={pesticidesCost}
                    onChange={(e) => setPesticidesCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('irrigationPower')}</span>
                  <input
                    type="number"
                    value={irrigationCost}
                    onChange={(e) => setIrrigationCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('manualLabor')}</span>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{t('harvestingTransport')}</span>
                  <input
                    type="number"
                    value={harvestCost}
                    onChange={(e) => setHarvestCost(parseInt(e.target.value, 10) || 0)}
                    className="w-28 text-right px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outputs Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#124131] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span className="uppercase font-bold tracking-wider">
                    {t('projectedFinancialOutcome', { acres: landArea })}
                  </span>
                  <span className="bg-emerald-900/90 text-emerald-200 px-2.5 py-0.5 rounded font-mono text-[11px]">
                    {cropName}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className={`text-4xl sm:text-5xl font-black ${economics.projectedNetProfit >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                    ₹{economics.projectedNetProfit.toLocaleString()}
                  </span>
                  <span className="text-emerald-200 text-xs font-semibold">
                    {t('netProfit')}
                  </span>
                </div>

                <p className="text-xs text-emerald-200 mt-1">
                  {t('netProfitPerAcre')} <strong className="text-white">₹{Math.round(economics.netProfitPerAcre).toLocaleString()} / {t('acres')}</strong>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 text-xs">
                <div>
                  <span className="text-emerald-300 text-[11px] block">{t('grossRevenue')}</span>
                  <p className="font-black text-white text-sm mt-0.5">
                    ₹{economics.projectedGrossRevenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-300 text-[11px] block">{t('totalExpenses')}</span>
                  <p className="font-black text-amber-200 text-sm mt-0.5">
                    ₹{economics.totalCultivationCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-300 text-[11px] block">{t('projectedRoi')}</span>
                  <p className="font-black text-emerald-300 text-sm mt-0.5">
                    {economics.returnOnInvestmentPercent}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-700/50">
                <div>
                  <span className="text-emerald-300 text-[11px]">{t('breakEvenYield')}</span>
                  <p className="font-bold text-white mt-0.5">
                    {economics.breakEvenYieldQuintalsPerAcre} {t('quintal')} / {t('acres')}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-300 text-[11px]">{t('breakEvenMandiRate')}</span>
                  <p className="font-bold text-white mt-0.5">
                    ₹{economics.breakEvenPricePerQuintal} / {t('quintal')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{t('costDistribution')}</h3>
                <span className="text-xs text-slate-400 font-medium">
                  {t('totalPerAcre', { cost: economics.costPerAcre.toLocaleString() })}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {economics.costBreakdownPercentage.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1 text-slate-700">
                      <span className="font-medium">{item.category}</span>
                      <span className="font-mono font-semibold text-slate-900">
                        ₹{item.amount.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: FARM TASKS & PLANNER --- */}
      {activeTab === 'tasks' && (
        <div className="space-y-8">
          {/* Add Task Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <h2 className="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {t('scheduleNewTask')}
            </h2>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">{t('taskDescriptionLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('taskDescPlaceholder')}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('targetPlotLabel')}</label>
                  <input
                    type="text"
                    value={newTaskPlot}
                    onChange={(e) => setNewTaskPlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('plannedDateLabel')}</label>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('priorityLabel')}</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
                  >
                    <option value="High">{t('priorityHigh')}</option>
                    <option value="Medium">{t('priorityMedium')}</option>
                    <option value="Routine">{t('priorityRoutine')}</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('scheduleTaskBtn')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">
                {t('scheduledOperations', { count: tasks.length })}
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {t('pendingTasksCount', { count: tasks.filter(t => t.status === 'Pending').length })}
              </span>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                      task.status === 'Completed'
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : task.priority === 'High'
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-white border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority === 'High' ? t('priorityHigh') : t('priorityMedium')}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{task.plannedDate}</span>
                        <span className="font-bold text-slate-600">• {task.plotName}</span>
                      </div>
                      <h4 className={`text-sm font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.taskDescription}
                      </h4>
                      {task.notes && (
                        <p className="text-[11px] text-slate-500">{task.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                          task.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#124131] text-white hover:bg-emerald-900'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{task.status === 'Completed' ? `${t('completed')} ✓` : t('markCompleted')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title={t('clear')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <HonestEmptyState
                type="empty"
                title={t('noScheduledTasksTitle')}
                description={t('noScheduledTasksDesc')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
