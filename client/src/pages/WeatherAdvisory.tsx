import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  Info,
  MapPin,
  RefreshCw,
  Sun,
  ShieldCheck,
  Compass,
  Navigation,
  Search,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WeatherData, fetchWeatherAdvisory } from '../services/api';
import { HonestEmptyState } from '../components/HonestEmptyState';
import { 
  INDIAN_AGRO_LOCATIONS, 
  getAllStates, 
  getDistrictsByState, 
  getTalukasByDistrict,
  LocationGeo 
} from '../data/indianLocations';

export const WeatherAdvisory: React.FC = () => {
  const { language, t } = useLanguage();

  // State, District, Taluka cascading state
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nashik');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('Dindori');
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lon: number }>({ lat: 20.2033, lon: 73.8317 });
  const [locationLabel, setLocationLabel] = useState<string>('Dindori Block, Nashik, Maharashtra');

  // Direct search input
  const [searchInput, setSearchInput] = useState<string>('');

  // Telemetry state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available districts and talukas based on selections
  const availableStates = getAllStates();
  const availableDistricts = getDistrictsByState(selectedState);
  const availableTalukas = getTalukasByDistrict(selectedState, selectedDistrict);

  // Locations list covering Maharashtra districts and benchmark agro-climatic zones
  const locations = [
    { key: 'loc_dindori', value: 'Dindori Block, Nashik, MH (422202)', state: 'Maharashtra', district: 'Nashik', taluka: 'Dindori', lat: 20.2033, lon: 73.8317 },
    { key: 'loc_niphad', value: 'Niphad Taluka, Nashik, MH (422303)', state: 'Maharashtra', district: 'Nashik', taluka: 'Niphad', lat: 20.0766, lon: 74.1100 },
    { key: 'loc_baramati', value: 'Baramati Taluka, Pune, MH (413102)', state: 'Maharashtra', district: 'Pune', taluka: 'Baramati', lat: 18.1519, lon: 74.5772 },
    { key: 'loc_amravati', value: 'Amravati District Cluster, MH (444601)', state: 'Maharashtra', district: 'Amravati', taluka: 'Warud (Rajura Bazar)', lat: 21.4667, lon: 78.2667 },
    { key: 'loc_khanna', value: 'Khanna APMC Cluster, Ludhiana, PB (141401)', state: 'Punjab', district: 'Ludhiana', taluka: 'Khanna', lat: 30.7073, lon: 76.2167 },
    { key: 'loc_indore', value: 'Indore Agro-Meteorological Grid, MP (452001)', state: 'Madhya Pradesh', district: 'Indore', taluka: 'Indore Central', lat: 22.7196, lon: 75.8577 }
  ];

  // Quick Preset Locations
  const presets = [
    { label: 'Dindori (Nashik, MH)', state: 'Maharashtra', district: 'Nashik', taluka: 'Dindori', lat: 20.2033, lon: 73.8317 },
    { label: 'Niphad (Nashik, MH)', state: 'Maharashtra', district: 'Nashik', taluka: 'Niphad', lat: 20.0766, lon: 74.1100 },
    { label: 'Umri (Nanded, MH)', state: 'Maharashtra', district: 'Nanded', taluka: 'Umri', lat: 19.0391, lon: 77.6454 },
    { label: 'Baramati (Pune, MH)', state: 'Maharashtra', district: 'Pune', taluka: 'Baramati', lat: 18.1519, lon: 74.5772 },
    { label: 'Warud (Amravati, MH)', state: 'Maharashtra', district: 'Amravati', taluka: 'Warud (Rajura Bazar)', lat: 21.4667, lon: 78.2667 },
    { label: 'Khanna (Ludhiana, PB)', state: 'Punjab', district: 'Ludhiana', taluka: 'Khanna', lat: 30.7073, lon: 76.2167 },
    { label: 'Indore (MP)', state: 'Madhya Pradesh', district: 'Indore', taluka: 'Indore Central', lat: 22.7196, lon: 75.8577 },
    { label: 'Gondal (Rajkot, GJ)', state: 'Gujarat', district: 'Rajkot', taluka: 'Gondal', lat: 21.9600, lon: 70.8000 }
  ];

  const loadWeather = async (
    label: string, 
    coords?: { lat: number; lon: number }, 
    extra?: { state?: string; district?: string; taluka?: string }
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetchWeatherAdvisory(label, coords, extra);
      if (res.success && res.data) {
        setWeatherData(res.data);
      } else {
        setErrorMessage(res.message || 'Unable to fetch weather telemetry.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to weather service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadWeather(locationLabel, activeCoords, {
      state: selectedState,
      district: selectedDistrict,
      taluka: selectedTaluka
    });
  }, []);

  // When State changes: reset district and taluka
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = getDistrictsByState(newState);
    if (districts.length > 0) {
      const firstDist = districts[0];
      setSelectedDistrict(firstDist.name);
      if (firstDist.talukas.length > 0) {
        const firstTal = firstDist.talukas[0];
        setSelectedTaluka(firstTal.name);
        setActiveCoords({ lat: firstTal.lat, lon: firstTal.lon });
        const label = `${firstTal.name}, ${firstDist.name}, ${newState}`;
        setLocationLabel(label);
        loadWeather(label, { lat: firstTal.lat, lon: firstTal.lon }, {
          state: newState,
          district: firstDist.name,
          taluka: firstTal.name
        });
      }
    }
  };

  // When District changes: reset taluka
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    const talukas = getTalukasByDistrict(selectedState, newDistrict);
    if (talukas.length > 0) {
      const firstTal = talukas[0];
      setSelectedTaluka(firstTal.name);
      setActiveCoords({ lat: firstTal.lat, lon: firstTal.lon });
      const label = `${firstTal.name}, ${newDistrict}, ${selectedState}`;
      setLocationLabel(label);
      loadWeather(label, { lat: firstTal.lat, lon: firstTal.lon }, {
        state: selectedState,
        district: newDistrict,
        taluka: firstTal.name
      });
    }
  };

  // When Taluka changes
  const handleTalukaChange = (newTaluka: string) => {
    setSelectedTaluka(newTaluka);
    const talukaObj = availableTalukas.find(t => t.name === newTaluka);
    if (talukaObj) {
      setActiveCoords({ lat: talukaObj.lat, lon: talukaObj.lon });
      const label = `${talukaObj.name}, ${selectedDistrict}, ${selectedState}`;
      setLocationLabel(label);
      loadWeather(label, { lat: talukaObj.lat, lon: talukaObj.lon }, {
        state: selectedState,
        district: selectedDistrict,
        taluka: talukaObj.name
      });
    }
  };

  // GPS Geolocation trigger
  const handleUseCurrentGPS = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setActiveCoords(coords);
        const label = `Current GPS Location (${coords.lat.toFixed(3)}°N, ${coords.lon.toFixed(3)}°E)`;
        setLocationLabel(label);
        loadWeather(label, coords);
      },
      (err) => {
        setIsLoading(false);
        alert(`Could not retrieve location: ${err.message}. Please select your state and district manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Preset quick click
  const handleSelectPreset = (p: typeof presets[0]) => {
    setSelectedState(p.state);
    setSelectedDistrict(p.district);
    setSelectedTaluka(p.taluka);
    setActiveCoords({ lat: p.lat, lon: p.lon });
    setLocationLabel(p.label);
    loadWeather(p.label, { lat: p.lat, lon: p.lon }, {
      state: p.state,
      district: p.district,
      taluka: p.taluka
    });
  };

  // Search by keyword / town name
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const place = searchInput.trim();
    setLocationLabel(place);
    loadWeather(place);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 text-left">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Open-Meteo Verified Live Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('liveWeatherTelemetryTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-devanagari mt-0.5">
              Hyper-local agro-meteorological advisory with 6-hour spray window & 7-day forecast
            </p>
          </div>

          {/* Current GPS Button & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleUseCurrentGPS}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 transition-all shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('gpsCurrentLocation')}</span>
            </button>

            <button
              type="button"
              onClick={() => loadWeather(locationLabel, activeCoords, { state: selectedState, district: selectedDistrict, taluka: selectedTaluka })}
              disabled={isLoading}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-xs"
              title={t('refresh')}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. CASCADING SELECTOR: STATE -> DISTRICT -> TALUKA */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* STATE SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t('selectStatePrompt')} ({t('state')})
              </label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-emerald-700"
                >
                  {availableStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* DISTRICT SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t('selectDistrictPrompt')} ({t('district')})
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-emerald-700"
                >
                  {availableDistricts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* TALUKA / BLOCK SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t('selectTalukaPrompt')} ({t('taluka')})
              </label>
              <div className="relative">
                <select
                  value={selectedTaluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-800 focus:outline-emerald-700"
                >
                  {availableTalukas.map((tItem) => (
                    <option key={tItem.name} value={tItem.name}>
                      {tItem.name} {tItem.pincode ? `(${tItem.pincode})` : ''}
                    </option>
                  ))}
                </select>
                <Compass className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Hubs:</span>
            {locations.map((loc) => {
              const isActive = selectedDistrict === loc.district && selectedTaluka === loc.taluka;
              return (
                <button
                  key={loc.key}
                  type="button"
                  onClick={() => handleSelectPreset(loc as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#124131] text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {t(loc.key as any)}
                </button>
              );
            })}
          </div>

          {/* Search box for any town/village across India */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchAnyPlace')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold focus:outline-emerald-700"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shrink-0 transition-colors"
            >
              {t('search')}
            </button>
          </form>
        </div>
      </div>

      {/* 3. ERROR OR LOADING STATE */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading && !weatherData && (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Connecting to Open-Meteo high-resolution atmospheric models...</p>
        </div>
      )}

      {/* 4. LIVE WEATHER ADVISORY DASHBOARD */}
      {weatherData && (
        <div className="space-y-6 text-left">
          
          {/* Main Current Conditions Hero Card */}
          <div className="rounded-3xl bg-[#124131] text-white p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-300 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-semibold">{weatherData.locationName}</span>
                  {weatherData.coordinates && (
                    <span className="text-[10px] text-emerald-400/80 font-mono">
                      ({weatherData.coordinates.lat.toFixed(2)}°N, {weatherData.coordinates.lon.toFixed(2)}°E)
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                    {weatherData.currentTempC}°C
                  </span>
                  <div>
                    <span className="text-base font-bold text-emerald-200 block">{weatherData.conditionText}</span>
                    <span className="text-xs text-emerald-300">
                      {t('feelsLike')}: {weatherData.feelsLikeC}°C • {t('dewPoint')}: {weatherData.dewPointC}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Source & Timestamp Badge */}
              <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 text-[11px] text-emerald-200 space-y-1 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('lastUpdated', { time: weatherData.forecastTimestamp || 'Just now' })}</span>
                </div>
                <p className="text-[10px] text-emerald-300/80">Open-Meteo Real Atmospheric Observation</p>
              </div>
            </div>

            {/* Micro-climate 6-Metric Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t('humidity')}</span>
                <span className="text-lg font-black text-white mt-0.5 block">{weatherData.relativeHumidityPercent}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t('windSpeedDirection')}</span>
                <span className="text-lg font-black text-white mt-0.5 block">{weatherData.windSpeedKmh} km/h {weatherData.windDirection}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t('rainProbability')}</span>
                <span className="text-lg font-black text-amber-300 mt-0.5 block">{weatherData.rainProbabilityPercent}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t('dewPoint')}</span>
                <span className="text-lg font-black text-white mt-0.5 block">{weatherData.dewPointC}°C</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t('soilMoisture')}</span>
                <span className="text-lg font-black text-emerald-200 mt-0.5 block">{weatherData.soilMoisturePercent}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-900/50 border border-emerald-700/40">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{t('uvIndexLabel')}</span>
                <span className="text-lg font-black text-white mt-0.5 block">{weatherData.uvIndex} (Moderate)</span>
              </div>
            </div>

            {/* Spray Feasibility Advisory Banner */}
            <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
              weatherData.windSpeedKmh > 15
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                : weatherData.currentTempC > 32
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
            }`}>
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <strong className="text-xs font-bold block">{t('sprayFeasibility')}:</strong>
                <span className="text-xs">{weatherData.sprayStatusText}</span>
              </div>
            </div>
          </div>

          {/* Hourly Forecast (Next 6 Hours) */}
          {weatherData.hourlyForecast && weatherData.hourlyForecast.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">{t('hourlySprayWindow')}</h3>
                <span className="text-xs text-slate-400 font-mono">Next 6 Hours</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {weatherData.hourlyForecast.map((hour, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 block font-mono">{hour.time}</span>
                    <span className="text-xl font-black text-slate-900 block">{hour.temperatureC}°C</span>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500">
                      <Droplets className="w-3 h-3 text-blue-600" />
                      <span>{hour.rainProbabilityPercent}%</span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      hour.spraySuitability === 'Spray OK'
                        ? 'bg-emerald-100 text-emerald-900'
                        : hour.spraySuitability === 'Caution'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}>
                      {hour.spraySuitability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Precision Agronomic Forecast Table */}
          {weatherData.weeklyForecast && weatherData.weeklyForecast.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">{t('sevenDayAgroForecast')}</h3>
                <span className="text-xs text-slate-400 font-medium">{t('forecastSourceNote')}</span>
              </div>

              <div className="space-y-3">
                {weatherData.weeklyForecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 w-48">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-bold shrink-0">
                        <CloudSun className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <strong className="text-slate-900 block">{day.dayName}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">{day.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Max / Min</span>
                        <strong className="text-slate-900 text-sm">{day.maxTempC}° / {day.minTempC}°C</strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Rain Prob.</span>
                        <div className="flex items-center gap-1 font-bold text-blue-700">
                          <Droplets className="w-3.5 h-3.5" />
                          <span>{day.rainProbabilityPercent}%</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Condition</span>
                        <span className="font-semibold text-slate-700">{day.weatherCondition}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        day.alertType === 'Safe'
                          ? 'bg-emerald-100 text-emerald-900'
                          : day.alertType === 'Caution'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}>
                        {day.alertType || 'Safe'}
                      </span>
                      <p className="text-slate-600 font-medium sm:max-w-xs">{day.agriculturalAdvisory}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
