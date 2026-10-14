import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ReferenceLibraryPage } from './pages/ReferenceLibraryPage';
import { SourceGalleryPage } from './pages/SourceGalleryPage';
import { ResearchPage } from './pages/ResearchPage';
import { HistoryPage } from './pages/HistoryPage';
import { Language } from './types';
import { loadAssessmentHistory } from './lib/assessmentStore';
import { validateTraditionalDatasetIntegrity } from './data/traditionalReferences';

export const App: React.FC = () => {
  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');
  // Selected sample value when navigating from radial graphic to library
  const [selectedSampleValue, setSelectedSampleValue] = useState<number | null>(null);

  // Language state with local persistence
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('manikkadai_language_pref');
      if (stored === 'ta' || stored === 'en') return stored;
    }
    return 'en';
  });

  // History count badge state
  const [historyCount, setHistoryCount] = useState<number>(0);

  const updateHistoryCount = () => {
    const list = loadAssessmentHistory();
    setHistoryCount(list.length);
  };

  useEffect(() => {
    updateHistoryCount();
    // Validate dataset integrity at startup
    const integrity = validateTraditionalDatasetIntegrity();
    if (!integrity.isValid) {
      console.error('Traditional reference dataset integrity error:', integrity.errors);
    }
  }, []);

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'ta' : 'en';
    setLanguage(nextLang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('manikkadai_language_pref', nextLang);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-forest-900 text-cream-100 font-sans selection:bg-gold-500/30 selection:text-gold-300">
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        historyCount={historyCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {currentView === 'home' && (
          <HomePage
            language={language}
            onNavigate={handleNavigate}
            onSelectSampleValue={(val) => {
              setSelectedSampleValue(val);
            }}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentPage
            language={language}
            onNavigate={handleNavigate}
            onRecordSaved={updateHistoryCount}
          />
        )}

        {currentView === 'library' && (
          <ReferenceLibraryPage
            language={language}
            initialFilterValue={selectedSampleValue}
          />
        )}

        {currentView === 'gallery' && (
          <SourceGalleryPage language={language} />
        )}

        {currentView === 'research' && (
          <ResearchPage language={language} />
        )}

        {currentView === 'history' && (
          <HistoryPage
            language={language}
            onNavigate={handleNavigate}
            onHistoryUpdated={updateHistoryCount}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default App;
