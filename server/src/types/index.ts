import { Request } from 'express';
import { User } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status: 'SUCCESS' | 'ERROR' | 'UNCONFIGURED' | 'EMPTY';
  message: string;
  data: T | null;
  meta: {
    dataSource: string;
    apiStatus: string;
    databaseStatus: string;
    timestamp: string;
  };
}

export interface FarmerProfile {
  id: string;
  fullName: string;
  phoneNumber?: string;
  state: string;
  district: string;
  taluka: string;
  village?: string;
  pincode?: string;
  primarySoilType: string;
  totalLandAcres: number;
  kisanRegId?: string;
  preferredLanguage: 'mr' | 'hi' | 'en';
}

export interface TreatmentStep {
  stepNumber: number;
  category: string;
  description: string;
}

export interface DiseaseDiagnosisResult {
  caseReference: string;
  timestamp: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidenceScore?: number | null;
  symptoms: string[];
  epidemiologicalTriggers?: string[];
  criticalWeatherAlert?: string;
  treatmentProtocol: TreatmentStep[];
  recommendedNextSteps: string[];
  uncertainty?: string;
  isUnclear?: boolean;
  isNonPlant?: boolean;
  disclaimer: string;
  rawAnalysisText?: string;
}

export interface CropDoctorDiagnoseRequest {
  imageBase64: string;
  cropHint?: string;
  notes?: string;
}

export interface AssistantChatRequest {
  message: string;
  language?: 'mr' | 'hi' | 'en';
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  farmContext?: {
    state?: string;
    district?: string;
    taluka?: string;
    soilType?: string;
    landAcres?: number;
    crops?: string[];
  };
}
