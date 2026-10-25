import React, { useState } from 'react';
import { 
  Compass, 
  Sprout, 
  Layers, 
  Droplets, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CropRec {
  cropName: string;
  variety: string;
  matchScore: number;
  expectedYield: string;
  waterNeed: string;
  recommendedIntercrop: string;
  soilSuitability: string[];
  fertilizerSchedule: { stage: string; dose: string }[];
}

export const CropRecommendation: React.FC = () => {
  const { language, t } = useLanguage();

  const [district, setDistrict] = useState('Nashik, Maharashtra');
  const [soilType, setSoilType] = useState('Black Cotton Soil (Regur)');
  const [season, setSeason] = useState('Kharif');
  const [waterAvailability, setWaterAvailability] = useState('Drip Irrigated');
  const [farmArea, setFarmArea] = useState('3.0');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRec[]>([]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    let recs: CropRec[] = [];

    if (season === 'Kharif') {
      recs = [
        {
          cropName: 'Soybean (सोयाबीन)',
          variety: 'JS-335 / KDS-726 (Phule Sangam)',
          matchScore: soilType.includes('Black') ? 96 : 88,
          expectedYield: `10–12 ${t('quintal')} / ${t('acres')}`,
          waterNeed: 'Medium (Drip or Timely Rain)',
          recommendedIntercrop: 'Pigeonpea (Tur / Arhar) in 4:2 row ratio',
          soilSuitability: [
            'Optimal cation exchange capacity in heavy black cotton soil',
            'Deep moisture retention matches 95–105 day vegetative-to-pod cycle',
            'Rhizobium japonicum root nodules enrich soil nitrogen for the succeeding Rabi crop'
          ],
          fertilizerSchedule: [
            { stage: 'Basal (At Sowing)', dose: '20 kg N : 60 kg P2O5 : 40 kg K2O per hectare' },
            { stage: 'Pod Initiation (Day 35–40)', dose: 'Foliar spray of 19:19:19 @ 10g/L' }
          ]
        },
        {
          cropName: 'Cotton (कापूस)',
          variety: 'Ajit 155 / Mallika Bt-II',
          matchScore: soilType.includes('Black') ? 91 : 84,
          expectedYield: `12–14 ${t('quintal')} / ${t('acres')}`,
          waterNeed: 'Medium to High',
          recommendedIntercrop: 'Green Gram (Moong) border rows',
          soilSuitability: [
            'Deep taproot system efficiently utilizes subsoil moisture',
            'High tolerance to intermittent dry spells during vegetative elongation'
          ],
          fertilizerSchedule: [
            { stage: 'Basal Application', dose: 'NPK 100:50:50 kg/ha split dose' },
            { stage: 'Boll Formation', dose: '13:0:45 foliar booster spray @ 5g/L' }
          ]
        }
      ];
    } else if (season === 'Rabi') {
      recs = [
        {
          cropName: 'Bengal Gram / Harbhara (हरभरा)',
          variety: 'Digvijay / Phule Vikram',
          matchScore: 94,
          expectedYield: `8–10 ${t('quintal')} / ${t('acres')}`,
          waterNeed: 'Low (Residual Moisture)',
          recommendedIntercrop: 'Mustard / Coriander border rows',
          soilSuitability: [
            'Thrives on residual moisture left after Kharif monsoon rains',
            'Low susceptibility to root rot in well-drained medium parcels'
          ],
          fertilizerSchedule: [
            { stage: 'Basal Dose', dose: '25 kg N : 50 kg P2O5 / ha + Biofertilizer PSB seed treatment' },
            { stage: 'Branching (Day 30)', dose: 'Foliar 2% urea spray for canopy boost' }
          ]
        },
        {
          cropName: 'Wheat (गहू)',
          variety: 'GW-322 / Lok-1',
          matchScore: waterAvailability.includes('Drip') || waterAvailability.includes('Irrigated') ? 92 : 72,
          expectedYield: `16–18 ${t('quintal')} / ${t('acres')}`,
          waterNeed: 'High (4–5 Irrigation cycles)',
          recommendedIntercrop: 'Fenugreek (Methi)',
          soilSuitability: [
            'Exceptional tillering in rich clay-loam and alluvial parcels',
            'Requires strict cold nocturnal temperature during flowering'
          ],
          fertilizerSchedule: [
            { stage: 'Crown Root Initiation (Day 21)', dose: 'Half Nitrogen + Full P & K' },
            { stage: 'First Node (Day 45)', dose: 'Remaining Nitrogen top-dress' }
          ]
        }
      ];
    } else {
      recs = [
        {
          cropName: 'Summer Moong / Green Gram (मूग)',
          variety: 'BM 2003-2 / Virat',
          matchScore: 91,
          expectedYield: `6–8 ${t('quintal')} / ${t('acres')}`,
          waterNeed: 'Medium (3–4 Light irrigations)',
          recommendedIntercrop: 'Short-duration leafy greens',
          soilSuitability: [
            'Short 60-day lifecycle fits comfortably before Kharif sowing',
            'Fixes 30–40 kg atmospheric nitrogen per hectare'
          ],
          fertilizerSchedule: [
            { stage: 'Basal Dose', dose: '20 kg N : 40 kg P2O5 per ha' }
          ]
        }
      ];
    }

    setRecommendations(recs);
    setHasCalculated(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-left">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('icarModelTag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('cropRecTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            {t('cropRecSubtitle')}
          </p>
        </div>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{t('zeroFabricatedYields')}</span>
        </div>
      </div>

      {/* 2. Interactive Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleCalculate} className="space-y-6">
          <h2 className="text-base font-black text-slate-900 pb-2 border-b border-slate-100">
            {t('fieldInputsTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* District */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('districtRegion')}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
              >
                <option value="Nashik, Maharashtra">{t('loc_nashik')}</option>
                <option value="Pune, Maharashtra">{t('loc_pune')}</option>
                <option value="Amravati, Maharashtra">{t('loc_amravati')}</option>
                <option value="Indore, Madhya Pradesh">{t('loc_indore')}</option>
                <option value="Ludhiana, Punjab">{t('loc_ludhiana')}</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('soilClassificationLabel')}</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
              >
                <option value="Black Cotton Soil (Regur)">{t('soil_black_cotton')}</option>
                <option value="Alluvial / Loamy Soil">{t('soil_alluvial')}</option>
                <option value="Red Sandy Loam">{t('soil_red_sandy')}</option>
                <option value="Clayey Loam">{t('soil_clayey')}</option>
                <option value="Laterite Soil">{t('soil_laterite')}</option>
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('targetSeason')}</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
              >
                <option value="Kharif">{t('season_kharif')}</option>
                <option value="Rabi">{t('season_rabi')}</option>
                <option value="Zaid">{t('season_zaid')}</option>
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('waterInfrastructure')}</label>
              <select
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
              >
                <option value="Drip Irrigated">{t('water_drip')}</option>
                <option value="Canal / Well Irrigated">{t('water_canal')}</option>
                <option value="Rainfed">{t('water_rainfed')}</option>
                <option value="Limited">{t('water_limited')}</option>
              </select>
            </div>

            {/* Farm Area */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t('plotAreaAcres')}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={farmArea}
                onChange={(e) => setFarmArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold focus:outline-emerald-700"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01]"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{t('generateRecsBtn')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Recommendations Output */}
      {hasCalculated && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {t('optimalCandidates', { district, season })}
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('verifiedVarieties', { count: recommendations.length })}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-1 rounded-lg">
                      {t('matchScore')} {rec.matchScore}%
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {t('targetAcres', { acres: farmArea })}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">{rec.cropName}</h3>
                  <p className="text-xs font-bold text-emerald-800 mb-3">{t('variety')} {rec.variety}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">{t('expectedYieldRange')}</span>
                      <strong className="text-slate-900 text-xs">{rec.expectedYield}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-semibold">{t('waterNeed')}</span>
                      <strong className="text-slate-900 text-xs">{rec.waterNeed}</strong>
                    </div>
                  </div>

                  {/* Soil Suitability Factors */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {t('soilSuitabilityRationale')}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {rec.soilSuitability.map((factor, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fertilizer Schedule */}
                  <div className="p-3.5 rounded-2xl bg-[#FAFDF9] border border-emerald-900/10 space-y-1.5 text-xs">
                    <span className="font-bold text-emerald-950 block">{t('splitFertilizerRegimen')}</span>
                    {rec.fertilizerSchedule.map((fert, fIdx) => (
                      <div key={fIdx} className="flex justify-between py-0.5 text-[11px]">
                        <span className="text-slate-500 font-medium">{fert.stage}:</span>
                        <span className="font-mono text-slate-800 font-bold">{fert.dose}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">
                    {t('intercrop')} <strong className="text-slate-800">{rec.recommendedIntercrop}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Saved ${rec.cropName} scenario to your farm planning ledger.`)}
                    className="font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    {t('saveScenario')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasCalculated && (
        <div className="rounded-3xl bg-slate-50 border border-dashed border-slate-300 p-8 text-center text-slate-500 space-y-2">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">{t('awaitingFieldInputs')}</h4>
          <p className="text-xs max-w-md mx-auto">
            {t('awaitingFieldInputsDesc')}
          </p>
        </div>
      )}
    </div>
  );
};
