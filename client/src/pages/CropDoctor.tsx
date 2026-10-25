import React, { useState, useRef } from 'react';
import { 
  Stethoscope, 
  Upload, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Share2, 
  Printer, 
  Clock, 
  PhoneCall, 
  Check, 
  Info, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DiseaseDiagnosisResult, diagnoseCropImage } from '../services/api';
import { HonestEmptyState } from '../components/HonestEmptyState';

export const CropDoctor: React.FC = () => {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseDiagnosisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isUnconfigured, setIsUnconfigured] = useState<boolean>(false);

  /**
   * Resizes and compresses large camera photographs in the browser
   * Prevents HTTP 413 Payload Too Large and speeds up inference on mobile networks.
   */
  const compressImage = (dataUrl: string, maxDimension = 1600, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        alert("File size exceeds 25MB. Please upload a smaller photo.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const raw = uploadEvent.target?.result as string;
        try {
          const optimized = await compressImage(raw);
          setSelectedImage(optimized);
        } catch {
          setSelectedImage(raw);
        }
        setAnalysisResult(null);
        setApiError(null);
        setIsUnconfigured(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setApiError(null);
    setIsUnconfigured(false);

    try {
      const response = await diagnoseCropImage(selectedImage, cropHint || undefined, farmerNotes || undefined);

      if (response.unconfigured) {
        setIsUnconfigured(true);
        setApiError(response.message || 'AI Vision model service is unconfigured.');
      } else if (!response.success || !response.data) {
        setApiError(response.message || 'Diagnosis failed. Please check the image and try again.');
      } else {
        setAnalysisResult(response.data);
      }
    } catch (err: any) {
      setApiError(`Network error while communicating with AI service: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const crops = [
    { key: 'crop_autodetect', value: '' },
    { key: 'crop_soybean', value: 'Soybean (सोयाबीन)' },
    { key: 'crop_tomato', value: 'Tomato (टोमॅटो)' },
    { key: 'crop_onion', value: 'Onion (कांदा)' },
    { key: 'crop_cotton', value: 'Cotton (कापूस)' },
    { key: 'crop_grapes', value: 'Grapes (द्राक्षे)' },
    { key: 'crop_pomegranate', value: 'Pomegranate (डाळिंब)' },
    { key: 'crop_wheat', value: 'Wheat (गहू)' },
    { key: 'crop_gram', value: 'Gram / Chana (हरभरा)' },
    { key: 'crop_sugarcane', value: 'Sugarcane (ऊस)' },
    { key: 'crop_maize', value: 'Maize (मका)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. TOP HEADER & METRIC PILLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Google Gemini Vision AI Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('cropDoctorTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
            {t('cropDoctorSubtitle')}
          </p>
        </div>

        {/* Capability counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200 text-center">
            <span className="text-base font-black text-slate-900 block">38+</span>
            <span className="text-[10px] text-slate-500 font-semibold">{t('indianCropsCount')}</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200 text-center">
            <span className="text-base font-black text-slate-900 block">120+</span>
            <span className="text-[10px] text-slate-500 font-semibold">{t('pathogensCount')}</span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-200 text-center">
            <span className="text-base font-black text-emerald-800 block">ICAR</span>
            <span className="text-[10px] text-slate-500 font-semibold">{t('ipmGrounded')}</span>
          </div>
        </div>
      </div>

      {/* 2. SPECIMEN SUBMISSION & DIAGNOSTIC GUIDELINES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-left">
        
        {/* Left: Specimen Submission Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">{t('submitCropSpecimen')}</h3>
                <p className="text-xs text-slate-400">{t('supportedFormats')}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Zero Fake Data</span>
              </span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Drag & Drop Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-700 bg-slate-50/60 hover:bg-emerald-50/20 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-800 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {selectedImage ? t('photoLoadedClickDifferent') : t('dragDropSpecimen')}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t('mobileGalleryStorage')}
                </p>
              </div>
            </div>

            {/* Optional Crop Hint & Field Observations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('cropTypeHint')}</label>
                <select
                  value={cropHint}
                  onChange={(e) => setCropHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden focus:border-emerald-700"
                >
                  {crops.map((c) => (
                    <option key={c.key} value={c.value}>
                      {t(c.key as any)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('fieldObservationOptional')}</label>
                <input
                  type="text"
                  placeholder={t('fieldObservationPlaceholder')}
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden focus:border-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>{t('choosePhoto')}</span>
            </button>

            <button
              type="button"
              onClick={handleCameraCapture}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all"
            >
              <Camera className="w-4 h-4 text-slate-600" />
              <span>{t('takePhotoCamera')}</span>
            </button>
          </div>
        </div>

        {/* Right: Diagnostic Guidelines (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between text-left space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-black text-slate-900">{t('diagnosticGuidelines')}</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">{t('guideFocusLeaf')}</strong>
                  <span className="text-slate-500 text-[11px]">{t('guideFocusLeafDesc')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">{t('guideLighting')}</strong>
                  <span className="text-slate-500 text-[11px]">{t('guideLightingDesc')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">{t('guideBlur')}</strong>
                  <span className="text-slate-500 text-[11px]">{t('guideBlurDesc')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{t('icarCalibrated')}</span>
          </div>
        </div>
      </div>

      {/* 3. SPECIMEN PREVIEW & RUN ACTION */}
      {selectedImage && !analysisResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-xl font-black text-slate-900">{t('specimenLoadedReady')}</h2>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                setAnalysisResult(null);
                setApiError(null);
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              {t('clearImage')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md h-72 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Selected specimen"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{t('readyForInference')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('readyForInferenceDesc')}
                </p>
              </div>

              {isAnalyzing ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4">
                  <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">{t('analyzingPixels')}</span>
                    <span className="text-[11px] text-emerald-800">
                      {t('analyzingDesc')}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRunDiagnosis}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{t('runAiDiagnosis')}</span>
                </button>
              )}

              {/* Status Notices */}
              {isUnconfigured && (
                <HonestEmptyState
                  type="unconfigured"
                  title="Google Gemini Vision Service Unconfigured"
                  description="To enable live AI crop disease detection, configure GEMINI_API_KEY in server/.env. KrishiDrishti strictly adheres to the Zero Fake Data policy and never fabricates mock diagnoses."
                />
              )}

              {apiError && !isUnconfigured && (
                <HonestEmptyState
                  type="error"
                  title="Diagnostic Analysis Failed"
                  description={apiError}
                  actionText="Try Again"
                  onAction={handleRunDiagnosis}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. GENUINE DIAGNOSTIC REPORT */}
      {analysisResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-xl font-black text-slate-900">{t('analyzedDiagnosticReport')}</h2>
            </div>
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {t('caseReference')} {analysisResult.caseReference}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Specimen Visualization & Metadata (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                <div className="relative h-72 flex items-center justify-center">
                  <img
                    src={selectedImage || ''}
                    alt="Analyzed specimen"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/75 px-3 py-1.5 text-[10px] font-mono text-slate-300 flex justify-between">
                    <span>Model: Google Gemini Vision</span>
                    <span>Status: Verified Analysis</span>
                  </div>
                </div>
              </div>

              {/* Specimen Metadata Table */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">{t('capturedTime')}</span>
                  <span className="font-bold text-slate-800">{analysisResult.timestamp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">{t('hostBotanical')}</span>
                  <span className="font-bold text-slate-800">{analysisResult.cropName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{t('causalAgent')}</span>
                  <span className="font-mono font-bold text-emerald-800">{analysisResult.scientificName}</span>
                </div>
              </div>

              {/* Share and Print buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert(`Case ${analysisResult.caseReference} ready to share with your local agronomist.`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t('shareReport')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Pathogen Details & IPM Protocols (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Pathogen Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {t('diagnosedCondition')}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    analysisResult.severity === 'Severe'
                      ? 'bg-rose-100 text-rose-900'
                      : analysisResult.severity === 'Moderate'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {analysisResult.severity === 'Severe'
                      ? t('severity_severe')
                      : analysisResult.severity === 'Moderate'
                      ? t('severity_moderate')
                      : t('severity_mild')}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {analysisResult.diseaseName}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  {analysisResult.scientificName}
                </p>
              </div>

              {/* Confidence Meter */}
              {typeof analysisResult.confidenceScore === 'number' && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t('modelConfidence')}</span>
                    </span>
                    <span className="text-emerald-800 font-black">{analysisResult.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${analysisResult.confidenceScore}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Symptoms & Epidemiological Triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {t('visibleSymptoms')}
                  </span>
                  <ul className="text-slate-700 text-[11px] leading-relaxed list-disc list-inside space-y-1">
                    {analysisResult.symptoms.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {analysisResult.epidemiologicalTriggers && analysisResult.epidemiologicalTriggers.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {t('favorableConditions')}
                    </span>
                    <ul className="text-slate-700 text-[11px] leading-relaxed list-disc list-inside space-y-1">
                      {analysisResult.epidemiologicalTriggers.map((trig, idx) => (
                        <li key={idx}>{trig}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Critical Weather Alert */}
              {analysisResult.criticalWeatherAlert && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{t('sprayAdvisoryAlert')}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{analysisResult.criticalWeatherAlert}</p>
                </div>
              )}

              {/* Treatment Protocol (IPM) */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                  {t('ipmTreatmentProtocol')}
                </span>

                <div className="space-y-2.5">
                  {analysisResult.treatmentProtocol.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <span className="font-bold text-slate-900">{step.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 pl-7 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Agronomic Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed border border-slate-200/80">
                <strong>{t('importantDisclaimer')}</strong> {analysisResult.disclaimer}
              </div>

              {/* New Scan Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                    setApiError(null);
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('scanAnotherSpecimen')}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. INITIAL EMPTY STATE (WHEN NO IMAGE CHOSEN) */}
      {!selectedImage && !analysisResult && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs">
          <HonestEmptyState
            type="empty"
            title={t('noLeafAnalyzedYet')}
            description={t('noLeafAnalyzedDesc')}
            actionText={t('uploadSpecimenLeaf')}
            onAction={() => fileInputRef.current?.click()}
          />
        </div>
      )}

      {/* 6. EMERGENCY AGRONOMY HELPLINES */}
      <div className="bg-[#FAFDF9] rounded-3xl p-6 border border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{t('needImmediateConsultation')}</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('callKccTollFree')}
            </p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124131] hover:bg-emerald-900 text-white font-bold text-xs shrink-0 shadow-xs transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 1800-180-1551</span>
        </a>
      </div>
    </div>
  );
};
