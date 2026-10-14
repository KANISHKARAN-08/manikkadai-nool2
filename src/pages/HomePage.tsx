import React from 'react';
import { Sparkles, Image as ImageIcon, BookOpen, Compass, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RadialMeasurementGraphic } from '../components/RadialMeasurementGraphic';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface HomePageProps {
  language: Language;
  onNavigate: (view: string) => void;
  onSelectSampleValue?: (val: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onNavigate,
  onSelectSampleValue
}) => {
  const t = translations[language];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-forest-850 to-forest-900 border border-gold-500/25 p-6 sm:p-10 lg:p-14 shadow-card-dark">
        {/* Subtle background decorative motifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-forest-700/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Siddha Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-forest-800/90 border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-gold-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{t.badgeSiddha}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-cream-50 leading-[1.15]">
              {language === 'en' ? (
                <>
                  Ancient Wisdom, <br className="hidden sm:inline" />
                  <span className="gold-gradient-text">Presented for a Digital Generation.</span>
                </>
              ) : (
                <>
                  பழங்கால ஞானம், <br className="hidden sm:inline" />
                  <span className="gold-gradient-text">நவீன டிஜிட்டல் தலைமுறைக்கு.</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-cream-200/90 font-light leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-explore-assessment-btn"
                onClick={() => onNavigate('assessment')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold text-sm sm:text-base shadow-gold-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Compass className="w-5 h-5 text-forest-950" />
                <span>{t.exploreAssessmentBtn}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                id="hero-explore-gallery-btn"
                onClick={() => onNavigate('gallery')}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-forest-800/80 hover:bg-forest-700/80 text-cream-100 font-semibold text-sm sm:text-base border border-gold-500/35 hover:border-gold-400/60 shadow-sm transition-all"
              >
                <ImageIcon className="w-5 h-5 text-gold-400" />
                <span>{t.exploreGalleryBtn}</span>
              </button>
            </div>

            {/* Archival Status Indicators */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-forest-800/80 text-xs">
              <div className="flex items-center space-x-2 text-cream-200/80">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="font-medium">{t.statusArchival}</span>
              </div>
              <div className="flex items-center space-x-2 text-cream-200/80">
                <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="font-medium">{t.statusDataset}</span>
              </div>
              <div className="flex items-center space-x-2 text-cream-200/80">
                <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="font-medium">{t.statusNoDb}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Radial Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full relative">
              <RadialMeasurementGraphic
                onSelectValue={(val) => {
                  if (onSelectSampleValue) {
                    onSelectSampleValue(val);
                  }
                  onNavigate('library');
                }}
              />
              <p className="text-center text-xs text-siddha-muted mt-2 font-light">
                {language === 'en'
                  ? 'Interactive Virarkadai Radial Continuum (4 to 10 விரற்கடை). Click any ring to inspect.'
                  : 'விரற்கடை வட்ட வடிவ அளவுகோல் (4 முதல் 10 வரை). பார்வையிட வளையத்தைத் தொடவும்.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES & METHODOLOGY */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            {language === 'en' ? 'Methodological Architecture' : 'ஆய்வு அணுகுமுறை'}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            {language === 'en'
              ? 'Rigorous Separation of Traditional Text and Modern Metric Research'
              : 'பாரம்பரிய ஏட்டுத் தகவல்களும் நவீன செ.மீ ஆய்வு அளவுகளும்'}
          </h2>
          <p className="text-sm text-cream-200/80">
            {language === 'en'
              ? 'Manikkadai Nool distinguishes between canonical manuscript verses and provisional observational millimeter/centimeter ranges.'
              : 'மணிக்கடை நூல் மூல ஏட்டுப் பாடல்களையும், முதற்கட்ட ஆய்வு வரம்புகளையும் முறையான தகுதியுடன் தனித்தனியாகப் பிரித்து வழங்குகிறது.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Authentic Manuscript */}
          <div className="bg-forest-850/90 border border-gold-500/25 rounded-2xl p-6 space-y-4 hover:border-gold-500/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-forest-900 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-cream-100">
              {language === 'en' ? '25 Canonical Manuscript Records' : '25 மூல ஏட்டுப் பதிவுகள்'}
            </h3>
            <p className="text-xs text-cream-200/80 leading-relaxed font-light">
              {language === 'en'
                ? 'Complete manual transcription of printed pages 368–371 in Noi Nadal Noi Mudal Nadal Thirattu, with exact Tamil verses and translations.'
                : '‘நோய் நாடல் நோய் முதல் நாடல் திரட்டு’ நூலின் 368 முதல் 371 வரை உள்ள 25 அளவுகளும், மூலப் பாடல்களுடன் பிழையின்றி உள்ளீடு செய்யப்பட்டுள்ளது.'}
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center space-x-1"
            >
              <span>{language === 'en' ? 'Open Reference Library' : 'குறிப்பகத்தைக் காண்க'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Metric Normalization */}
          <div className="bg-forest-850/90 border border-gold-500/25 rounded-2xl p-6 space-y-4 hover:border-gold-500/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-forest-900 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-cream-100">
              {language === 'en' ? 'Metric Assessment & Discrepancy' : 'செ.மீ/மி.மீ அளவீட்டுப் பரிசோதனை'}
            </h3>
            <p className="text-xs text-cream-200/80 leading-relaxed font-light">
              {language === 'en'
                ? 'Precise input validation in cm and mm, repeat reading discrepancy checks against 0.3 cm clinical tolerance, and honest range reporting.'
                : 'செ.மீ மற்றும் மி.மீ அளவீடுகளைச் சீரமைத்து, 0.3 செ.மீ துல்லியப் பிழையைக் கணக்கிட்டு ஆய்வு வரம்புகளோடு ஒப்பிடுகிறது.'}
            </p>
            <button
              onClick={() => onNavigate('assessment')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center space-x-1"
            >
              <span>{language === 'en' ? 'Start Assessment' : 'பரிசோதனையைத் தொடங்குக'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: 100% Local & Privacy-First */}
          <div className="bg-forest-850/90 border border-gold-500/25 rounded-2xl p-6 space-y-4 hover:border-gold-500/50 transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-forest-900 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-cream-100">
              {language === 'en' ? 'Local History & Export' : 'உள்ளூர் சேமிப்பும் CSV பதிவிறக்கமும்'}
            </h3>
            <p className="text-xs text-cream-200/80 leading-relaxed font-light">
              {language === 'en'
                ? 'No Supabase or external database required. History persists strictly in your browser. Complete CSV export and printable clinical reports.'
                : 'வெளிப்புற தரவுத்தளம் ஏதுமின்றி, உங்கள் உலாவியிலேயே சேமிக்கப்படுகிறது. CSV கோப்பு மற்றும் அச்சிடத்தக்க அறிக்கைகள் வசதி உள்ளது.'}
            </p>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center space-x-1"
            >
              <span>{language === 'en' ? 'View Session History' : 'வரலாற்றைக் காண்க'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
