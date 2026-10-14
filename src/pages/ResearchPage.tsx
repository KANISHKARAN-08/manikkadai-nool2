import React from 'react';
import { FileText, BookOpen, AlertTriangle } from 'lucide-react';
import { METRIC_RESEARCH_RANGES } from '../data/metricResearchRanges';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface ResearchPageProps {
  language: Language;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-800 text-xs font-semibold text-gold-300 border border-gold-500/30">
          <FileText className="w-3.5 h-3.5 text-gold-400" />
          <span>{t.researchTitle}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
          {language === 'en' ? 'Research, Provenance & Scholarly DOIs' : 'ஆய்வு விவரங்கள், மூல ஆதாரங்கள் மற்றும் மேற்கோள்கள்'}
        </h1>
        <p className="text-sm text-cream-200/80 font-light max-w-3xl leading-relaxed">
          {t.researchSubtitle}
        </p>
      </div>

      {/* Honest Scientific Integrity Notice */}
      <div className="bg-forest-950 border-2 border-amber-500/40 rounded-2xl p-6 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>{language === 'en' ? 'Scientific Transparency & Non-Fabrication Guarantee' : 'அறிவியல் வெளிப்படைத்தன்மை மற்றும் நம்பகத்தன்மை உறுதி'}</span>
        </div>
        <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed font-light">
          {language === 'en'
            ? 'In accordance with scientific and archival rigor, this application strictly refuses to fabricate digital object identifiers (DOIs), PubMed IDs (PMIDs), or clinical validation certifications. Modern observational metric ranges (11.9–19.0 cm) are explicitly flagged as "Pending Review" and must not be interpreted as definitive clinical diagnostic standards.'
            : 'அறிவியல் நேர்மையின் அடிப்படையில், போலியான DOI எண்களையோ அல்லது சரிபார்க்கப்படாத மருத்துவ சான்றுகளையோ இத்தளம் உருவாக்குவதில்லை. நவீன ஆய்வுக் குறிப்புகளான 11.9–19.0 செ.மீ வரம்புகள் "மறுஆய்வுக்குரியது" (Pending Review) என்று தெளிவாகக் குறிப்பிடப்பட்டுள்ளன.'}
        </p>
      </div>

      {/* Section 1: Classical Siddha Wrist Circumference Metrology */}
      <section className="bg-forest-850/80 border border-gold-500/25 rounded-2xl p-6 sm:p-8 space-y-4 shadow-card-dark">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-gold-400" />
          <span>{language === 'en' ? 'Anatomical Metrology of Virarkadai (விரற்கடை)' : 'விரற்கடை அளவீட்டின் உடற்கூறியல் பின்னணி'}</span>
        </h2>
        <div className="text-xs sm:text-sm text-cream-200/90 space-y-3 leading-relaxed font-light">
          <p>
            {language === 'en'
              ? 'In the classical Siddha medical corpus, Virarkadai (விரற்கடை) represents an individual-specific anatomical proportional unit, defined by the transverse breadth of the interphalangeal joint of the subject’s own thumb or index finger. The diagnostic procedure known as Manikkadai Nool (மணிக்கடை நூல்) evaluates the perimeter circumference around the styloid processes of the distal wrist (Manikkattu).'
              : 'சித்த மருத்துவத்தில் ‘விரற்கடை’ என்பது நோயாளியின் சொந்த விரல் அகலத்தை அடிப்படையாகக் கொண்ட உடற்கூறியல் அளவீட்டு அலகாகும். மணிக்கட்டின் எலும்புப் பகுதியில் (Styloid processes) எடுக்கப்படும் சுற்றளவை விரற்கடை அளவில் கணித்து, நோயின் தீவிரத்தை அறிவதே மணிக்கடை நூல் முறையாகும்.'}
          </p>
          <p>
            {language === 'en'
              ? 'Because finger dimensions scale proportionally with constitutional skeletal frame and body mass index, Virarkadai historically served as an autologous normalizing ratio rather than a rigid fixed centimeter value.'
              : 'ஒவ்வொரு மனிதரின் விரல் அளவும் அவரது உடல் எடை மற்றும் எலும்பு அமைப்பிற்கு ஏற்ப மாறுபடுவதால், விரற்கடை என்பது அந்தந்த மனிதரின் உடலமைப்பிற்கு ஏற்ப இயல்பாகச் சீரமைக்கப்பட்ட ஒரு விகிதாச்சார அளவீடாக அமைந்தது.'}
          </p>
        </div>
      </section>

      {/* Section 2: Provisional Metric Research Ranges */}
      <section className="bg-forest-850/80 border border-gold-500/25 rounded-2xl p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="space-y-1">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream-100">
            {language === 'en' ? 'Provisional Metric Research Cohorts (2019 Gunmam Study)' : 'முதற்கட்ட செ.மீ ஆய்வு வரம்புகள் (2019 குன்ம நோய் ஆய்வு)'}
          </h2>
          <p className="text-xs text-siddha-muted">
            {language === 'en'
              ? 'Observed physical wrist circumference measurements documented in preliminary observational cohorts.'
              : 'குன்ம நோய் தொடர்பான முதற்கட்ட ஆய்வில் ஆவணப்படுத்தப்பட்ட மணிக்கட்டு சுற்றளவு வரம்புகள்.'}
          </p>
        </div>

        <div className="space-y-4">
          {METRIC_RESEARCH_RANGES.map((range) => (
            <div
              key={range.id}
              className="p-5 rounded-xl bg-forest-900 border border-forest-700 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-lg font-bold text-gold-400">
                    {range.minCm} cm – {range.maxCm} cm
                  </span>
                  <span className="text-xs text-siddha-muted">
                    ({(range.minCm * 10).toFixed(0)} mm – {(range.maxCm * 10).toFixed(0)} mm)
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/30 font-semibold">
                  Status: Pending Peer-Reviewed Validation
                </span>
              </div>

              <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed font-light">
                {language === 'en' ? range.provisionalInterpretation.en : range.provisionalInterpretation.ta}
              </p>

              <div className="pt-2 border-t border-forest-800 text-xs text-siddha-muted flex flex-wrap items-center justify-between gap-2">
                <span>
                  <strong className="text-cream-200">Study Source: </strong>
                  {range.sourceTitle} ({range.publicationYear})
                </span>
                <span className="text-cream-200/50">DOI: None assigned (Provisional Report)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Classical Bibliographic Citations */}
      <section className="bg-forest-850/80 border border-gold-500/25 rounded-2xl p-6 sm:p-8 space-y-4 shadow-card-dark">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-gold-400" />
          <span>{language === 'en' ? 'Canonical Archival Citations' : 'அங்கீகரிக்கப்பட்ட வரலாற்று நூல்கள்'}</span>
        </h2>
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-1.5">
            <h4 className="font-bold text-cream-100 font-tamil">
              1. நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)
            </h4>
            <p className="text-cream-200/80 text-xs font-light leading-relaxed">
              தொகுப்பாசிரியர்: மருத்துவர் க. சண்முகவேலு மற்றும் தமிழ்நாடு சித்த மருத்துவக் குழு. இந்திய மருத்துவ இயக்குநரகம், சென்னை. பக். 368–371. (Primary canonical source for all 25 Virarkadai records).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-1.5">
            <h4 className="font-bold text-cream-100 font-tamil">
              2. அகத்தியர் மணிக்கடை நூல் (Agathiyar Manikkadai Nool)
            </h4>
            <p className="text-cream-200/80 text-xs font-light leading-relaxed">
              அகத்திய முனிவர் அருளிய பாரம்பரிய கைந்நூல் மற்றும் விரற்கடை கணிப்பு ஏட்டுப் பிரதி. சரசுவதி மகால் நூல் நிலையம், தஞ்சாவூர்.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-forest-900 border border-forest-800 space-y-1.5">
            <h4 className="font-bold text-cream-100 font-tamil">
              3. பதார்த்த குண சிந்தாமணி (Pathartha Guna Chinthamani)
            </h4>
            <p className="text-cream-200/80 text-xs font-light leading-relaxed">
              சித்த மருத்துவக் கோட்பாடுகள், நாடி மற்றும் உடற்கூறு பரிசோதனை முறைகள். தாமரை நூலகம், சென்னை.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
