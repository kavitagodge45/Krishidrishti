/**
 * KrishiDrishti Frontend API Client & Types
 * Real-Data-Only Architecture
 */
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PlotRecord {
  id: string;
  plotName: string;
  cropName: string;
  variety: string;
  areaAcres: number;
  sownDate: string;
  stage: string;
  healthStatus: 'Optimal' | 'Watchlist' | 'Attention';
  waterNeed: string;
  targetHarvestDays: number;
  nextAction: string;
  photoUrl?: string;
}

export interface FarmActivityLog {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  type: 'soil' | 'disease' | 'irrigation' | 'fertilizer';
  labId?: string;
  confidence?: number;
}

export interface ActionCenterAlert {
  id: string;
  priority: 'HIGH PRIORITY' | 'MANDI STRATEGIC ALERT' | 'ROUTINE MAINTENANCE';
  timing: string;
  title: string;
  description: string;
  dosage?: string;
  completed: boolean;
}

export interface DiseaseDiagnosisResult {
  caseReference: string;
  timestamp: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidenceScore?: number;
  symptoms: string[];
  epidemiologicalTriggers?: string[];
  criticalWeatherAlert?: string;
  treatmentProtocol: {
    stepNumber: number;
    category: string;
    description: string;
  }[];
  disclaimer: string;
  rawAnalysisText?: string;
}

export interface MandiRecord {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: string;
  dailyChangePercent?: number;
}

export interface HourlyForecastItem {
  time: string;
  temperatureC: number;
  humidityPercent: number;
  rainProbabilityPercent: number;
  spraySuitability: 'Spray OK' | 'Too hot to spray' | 'Turn Light Traps' | 'Caution' | 'Dew Heavy';
  windKmh: number;
}

export interface DailyForecastItem {
  dayName: string;
  date: string;
  maxTempC: number;
  minTempC: number;
  rainProbabilityPercent: number;
  weatherCondition: string;
  agriculturalAdvisory: string;
  isSpraySafe: boolean;
  alertType?: 'Safe' | 'Storm Alert' | 'Caution';
}

export interface WeatherData {
  locationName: string;
  taluka: string;
  district: string;
  coordinates?: { lat: number; lon: number };
  currentTempC: number;
  feelsLikeC: number;
  dewPointC: number;
  uvIndex: number;
  conditionText: string;
  rainProbabilityPercent: number;
  relativeHumidityPercent: number;
  windSpeedKmh: number;
  windDirection: string;
  soilMoisturePercent: number;
  sprayStatusText: string;
  forecastTimestamp?: string;
  dataSource?: string;
  state?: string;
  hourlyForecast: HourlyForecastItem[];
  weeklyForecast: DailyForecastItem[];
}

export interface FarmEconomicsRequest {
  landAreaAcres: number;
  cropName: string;
  expectedYieldQuintalsPerAcre: number;
  expectedMandiPricePerQuintal: number;
  costs: {
    landPreparation: number;
    seeds: number;
    fertilizers: number;
    pesticidesAndProtection: number;
    irrigationAndElectricity: number;
    labor: number;
    harvestingAndTransport: number;
  };
}

export interface FarmEconomicsResult {
  totalCultivationCost: number;
  costPerAcre: number;
  projectedTotalYieldQuintals: number;
  projectedGrossRevenue: number;
  projectedNetProfit: number;
  netProfitPerAcre: number;
  returnOnInvestmentPercent: number;
  breakEvenYieldQuintalsPerAcre: number;
  breakEvenPricePerQuintal: number;
  costBreakdownPercentage: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface FarmTask {
  id: string;
  plotName: string;
  taskDescription: string;
  plannedDate: string;
  priority: 'High' | 'Medium' | 'Routine';
  status: 'Pending' | 'Completed';
  notes?: string;
}

/**
 * Pure arithmetic Farm Economics Calculator
 * Based solely on user-entered values. No fake data.
 */
export const calculateFarmEconomics = (req: FarmEconomicsRequest): FarmEconomicsResult => {
  const { landAreaAcres, expectedYieldQuintalsPerAcre, expectedMandiPricePerQuintal, costs } = req;
  const area = Math.max(0.1, landAreaAcres || 1);

  const costPerAcre =
    (costs.landPreparation || 0) +
    (costs.seeds || 0) +
    (costs.fertilizers || 0) +
    (costs.pesticidesAndProtection || 0) +
    (costs.irrigationAndElectricity || 0) +
    (costs.labor || 0) +
    (costs.harvestingAndTransport || 0);

  const totalCultivationCost = costPerAcre * area;
  const projectedTotalYieldQuintals = (expectedYieldQuintalsPerAcre || 0) * area;
  const projectedGrossRevenue = projectedTotalYieldQuintals * (expectedMandiPricePerQuintal || 0);
  const projectedNetProfit = projectedGrossRevenue - totalCultivationCost;
  const netProfitPerAcre = projectedNetProfit / area;
  const returnOnInvestmentPercent =
    totalCultivationCost > 0
      ? Math.round(((projectedNetProfit / totalCultivationCost) * 100) * 10) / 10
      : 0;

  const breakEvenYieldQuintalsPerAcre =
    expectedMandiPricePerQuintal > 0
      ? Math.round((costPerAcre / expectedMandiPricePerQuintal) * 10) / 10
      : 0;

  const breakEvenPricePerQuintal =
    expectedYieldQuintalsPerAcre > 0
      ? Math.round(costPerAcre / expectedYieldQuintalsPerAcre)
      : 0;

  const categories = [
    { category: 'Land Preparation', amount: costs.landPreparation || 0 },
    { category: 'Quality Seeds', amount: costs.seeds || 0 },
    { category: 'Fertilizers & Nutrients', amount: costs.fertilizers || 0 },
    { category: 'Crop Protection / Spray', amount: costs.pesticidesAndProtection || 0 },
    { category: 'Irrigation & Power', amount: costs.irrigationAndElectricity || 0 },
    { category: 'Field Labor', amount: costs.labor || 0 },
    { category: 'Harvest & Mandi Logistics', amount: costs.harvestingAndTransport || 0 },
  ];

  const costBreakdownPercentage = categories.map((cat) => ({
    category: cat.category,
    amount: cat.amount * area,
    percentage: costPerAcre > 0 ? Math.round((cat.amount / costPerAcre) * 100) : 0,
  }));

  return {
    totalCultivationCost,
    costPerAcre,
    projectedTotalYieldQuintals,
    projectedGrossRevenue,
    projectedNetProfit,
    netProfitPerAcre,
    returnOnInvestmentPercent,
    breakEvenYieldQuintalsPerAcre,
    breakEvenPricePerQuintal,
    costBreakdownPercentage,
  };
};

/**
 * Genuine Crop Doctor AI Vision API call
 * Calls the secure server-side endpoint which invokes Google Gemini Vision.
 */
export const diagnoseCropImage = async (
  imageBase64: string,
  cropHint?: string,
  notes?: string
): Promise<{ success: boolean; data?: DiseaseDiagnosisResult; message?: string; unconfigured?: boolean }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/crop-doctor/diagnose`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ imageBase64, cropHint, notes })
    });

    const body = await response.json();

    if (response.status === 503 || body.status === 'UNCONFIGURED') {
      return { success: false, unconfigured: true, message: body.message };
    }

    if (!response.ok || !body.success) {
      return { success: false, message: body.message || 'Diagnosis failed.' };
    }

    return { success: true, data: body.data };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to KrishiDrishti AI Vision server: ${err.message}. Ensure backend is running on ${API_BASE_URL}.`
    };
  }
};

/**
 * Genuine Krishi Mitra AI Conversational API call
 * Calls the secure server-side endpoint which invokes Google Gemini Pro/Flash LLM.
 */
export const sendAssistantQuery = async (
  message: string,
  language: 'mr' | 'hi' | 'en' = 'mr',
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[],
  farmContext?: any
): Promise<{ success: boolean; reply?: string; message?: string; unconfigured?: boolean }> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, language, history, farmContext })
    });

    const body = await response.json();

    if (response.status === 503 || body.status === 'UNCONFIGURED') {
      return { success: false, unconfigured: true, message: body.message };
    }

    if (!response.ok || !body.success) {
      return { success: false, message: body.message || 'Assistant response failed.' };
    }

    return { success: true, reply: body.data?.reply };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to Krishi Mitra server: ${err.message}. Ensure backend is running on ${API_BASE_URL}.`
    };
  }
};

/**
 * Genuine Open-Meteo Weather Telemetry API call
 * Queries backend endpoint which connects to Open-Meteo with real farm coordinates.
 */
export const fetchWeatherAdvisory = async (
  locationString?: string,
  coords?: { lat: number; lon: number },
  extra?: { state?: string; district?: string; taluka?: string }
): Promise<{ success: boolean; data?: WeatherData; message?: string; unconfigured?: boolean }> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/weather`);
    if (locationString) {
      url.searchParams.set('location', locationString);
    }
    if (coords && typeof coords.lat === 'number' && typeof coords.lon === 'number') {
      url.searchParams.set('lat', coords.lat.toString());
      url.searchParams.set('lon', coords.lon.toString());
    }
    if (extra?.state) url.searchParams.set('state', extra.state);
    if (extra?.district) url.searchParams.set('district', extra.district);
    if (extra?.taluka) url.searchParams.set('taluka', extra.taluka);

    const response = await fetch(url.toString());
    const body = await response.json();

    if (response.status === 503 || body.status === 'UNCONFIGURED') {
      return { success: false, unconfigured: true, message: body.message };
    }

    if (!response.ok || !body.success) {
      return { success: false, message: body.message || 'Failed to fetch weather telemetry.' };
    }

    return { success: true, data: body.data };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to KrishiDrishti weather service: ${err.message}. Ensure backend is running on ${API_BASE_URL}.`
    };
  }
};

/**
 * Genuine Agmarknet / Data.gov.in Live Mandi API call
 * Queries backend endpoint with official filters.
 */
export const fetchLiveMandiPrices = async (
  commodity?: string,
  state?: string,
  search?: string
): Promise<{ success: boolean; data?: MandiRecord[]; message?: string; unconfigured?: boolean }> => {
  try {
    const url = new URL(`${API_BASE_URL}/api/mandi/prices`);
    if (commodity && commodity !== 'All') url.searchParams.set('commodity', commodity);
    if (state && state !== 'All') url.searchParams.set('state', state);
    if (search && search.trim()) url.searchParams.set('search', search.trim());

    const response = await fetch(url.toString());
    const body = await response.json();

    if (response.status === 503 || body.status === 'UNCONFIGURED') {
      return { success: false, unconfigured: true, message: body.message, data: [] };
    }

    if (!response.ok || !body.success) {
      return { success: false, message: body.message || 'Mandi request failed.', data: [] };
    }

    return { success: true, data: body.data || [] };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to connect to KrishiDrishti mandi service: ${err.message}. Ensure backend is running on ${API_BASE_URL}.`,
      data: []
    };
  }
};
