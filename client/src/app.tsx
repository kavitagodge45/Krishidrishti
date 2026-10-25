import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { CropDoctor } from './pages/CropDoctor';
import { WeatherAdvisory } from './pages/WeatherAdvisory';
import { MandiPrices } from './pages/MandiPrices';
import { CropRecommendation } from './pages/CropRecommendation';
import { FarmPlanning } from './pages/FarmPlanning';
import { GovtPortalsGuide } from './pages/GovtPortalsGuide';
import { Auth } from './pages/Auth';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen flex flex-col bg-[#F8F9F5] text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/crop-doctor" element={<CropDoctor />} />
                <Route path="/weather" element={<WeatherAdvisory />} />
                <Route path="/mandi" element={<MandiPrices />} />
                <Route path="/crop-recommendation" element={<CropRecommendation />} />
                <Route path="/farm-planning" element={<FarmPlanning />} />
                <Route path="/govt-schemes" element={<GovtPortalsGuide />} />
                <Route path="/govt-portals" element={<GovtPortalsGuide />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
