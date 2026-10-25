import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  ExternalLink, 
  RefreshCw,
  MapPin,
  Calendar,
  AlertCircle,
  Building2,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MandiRecord, fetchLiveMandiPrices } from '../services/api';
import { HonestEmptyState } from '../components/HonestEmptyState';

export const MandiPrices: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mandiRecords, setMandiRecords] = useState<MandiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnconfigured, setIsUnconfigured] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const commodities = [
    { key: 'comm_all', value: 'All' },
    { key: 'comm_soybean', value: 'Soybean (Yellow)' },
    { key: 'comm_onion', value: 'Onion (Red / Gavran)' },
    { key: 'comm_wheat', value: 'Wheat (Sharbati)' },
    { key: 'comm_cotton', value: 'Cotton (Medium Staple)' },
    { key: 'comm_gram', value: 'Gram / Chana' },
    { key: 'comm_tomato', value: 'Tomato' },
    { key: 'comm_grapes', value: 'Grapes' }
  ];

  const states = [
    { key: 'state_all', value: 'All' },
    { key: 'state_maharashtra', value: 'Maharashtra' },
    { key: 'state_mp', value: 'Madhya Pradesh' },
    { key: 'state_punjab', value: 'Punjab' },
    { key: 'state_gujarat', value: 'Gujarat' },
    { key: 'state_rajasthan', value: 'Rajasthan' },
    { key: 'state_karnataka', value: 'Karnataka' }
  ];

  const loadMandiData = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    setIsUnconfigured(false);

    try {
      const res = await fetchLiveMandiPrices(selectedCommodity, selectedState, searchQuery);
      if (res.unconfigured) {
        setIsUnconfigured(true);
        setStatusMessage(res.message || null);
        setMandiRecords([]);
      } else if (!res.success) {
        setStatusMessage(res.message || 'Failed to query Agmarknet API.');
        setMandiRecords([]);
      } else {
        setMandiRecords(res.data || []);
        if (res.data && res.data.length === 0) {
          setStatusMessage(res.message || null);
        }
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Network connection failed while querying Mandi prices.');
      setMandiRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMandiData();
  }, [selectedCommodity, selectedState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMandiData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. TOP HEADER & APMC PORTAL CONNECTORS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Ministry of Agriculture Agmarknet / e-NAM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('mandiTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-devanagari mt-0.5 font-bold text-emerald-800">
            {t('mandiSubtitleDevanagari')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            <span>{t('officialAgmarknet')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://www.enam.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all"
          >
            <span>{t('enamPortal')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between text-left">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchMandiPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-emerald-700 text-xs font-medium"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Commodity Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">{t('commodityLabel')}</span>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs focus:outline-hidden"
            >
              {commodities.map((c) => (
                <option key={c.key} value={c.value}>
                  {t(c.key as any)}
                </option>
              ))}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">{t('stateLabel')}</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs focus:outline-hidden"
            >
              {states.map((s) => (
                <option key={s.key} value={s.value}>
                  {t(s.key as any)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={loadMandiData}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            title={t('refresh')}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. LOADING INDICATOR */}
      {isLoading && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Querying live Agmarknet APMC market registers...</p>
        </div>
      )}

      {/* 4. REAL MANDI PRICES LIST / TABLE */}
      {!isLoading && mandiRecords.length > 0 && (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs text-left">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-slate-900">{t('liveApmcRates')}</h2>
              <p className="text-xs text-slate-400">{t('officialMandiSource')}</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              {mandiRecords.length} Active Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3.5">{t('marketYard')}</th>
                  <th className="px-6 py-3.5">{t('commodityVariety')}</th>
                  <th className="px-6 py-3.5">{t('districtLabel')} & {t('stateLabel')}</th>
                  <th className="px-6 py-3.5 text-right">{t('minMaxModalRate')}</th>
                  <th className="px-6 py-3.5 text-right">{t('arrivalDateLabel')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mandiRecords.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <strong className="text-slate-900 block font-bold">{m.market}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">APMC Regulated</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block font-bold">{m.commodity}</strong>
                        <span className="text-[11px] text-slate-500">{m.variety}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{m.district ? `${m.district}, ${m.state}` : m.state}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="space-y-0.5">
                        <span className="text-base font-black text-emerald-800 block">
                          ₹{m.modalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ₹{m.minPrice} - ₹{m.maxPrice} / Qtl
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-mono text-slate-500 text-[11px]">
                      {m.arrivalDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. HONEST EMPTY OR UNCONFIGURED STATE */}
      {!isLoading && mandiRecords.length === 0 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs text-left space-y-6">
          <HonestEmptyState
            type={isUnconfigured ? "unconfigured" : "empty"}
            title={isUnconfigured ? "Official Agmarknet API Key Required" : t('noMandiRecordsFound')}
            description={
              statusMessage ||
              (isUnconfigured
                ? "To query live Agmarknet APMC market rates directly from the Government of India portal, configure DATA_GOV_IN_API_KEY in server/.env with your free key from https://data.gov.in. Under KrishiDrishti's strict Zero Fake Data policy, simulated or fabricated mandi rates are prohibited."
                : t('noMandiRecordsDesc'))
            }
            actionText={t('visitAgmarknetPortal')}
            onAction={() => window.open('https://agmarknet.gov.in', '_blank')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block">{t('ministryAgmarknetTitle')}</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {t('ministryAgmarknetDesc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block">{t('modalRatesTitle')}</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {t('modalRatesDesc')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 block">{t('mspProtectionTitle')}</span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {t('mspProtectionDesc')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
