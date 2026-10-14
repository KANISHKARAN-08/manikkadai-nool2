import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  X,
  Copy,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TRADITIONAL_REFERENCES } from '../data/traditionalReferences';
import { TraditionalRecord, Language } from '../types';
import { parseTraditionalInput } from '../lib/normalization';
import { translations } from '../lib/translations';

interface ReferenceLibraryPageProps {
  language: Language;
  initialFilterValue?: number | null;
}

export const ReferenceLibraryPage: React.FC<ReferenceLibraryPageProps> = ({
  language,
  initialFilterValue
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState<string>(
    initialFilterValue ? String(initialFilterValue) : ''
  );
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'disease_manifestation' | 'critical_prognosis'>('all');
  const [activeRecord, setActiveRecord] = useState<TraditionalRecord | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  // Search and filter logic
  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim();

    return TRADITIONAL_REFERENCES.filter((record) => {
      // Category filter
      if (selectedCategory !== 'all' && record.category !== selectedCategory) {
        return false;
      }

      if (!query) return true;
      const lowerQuery = query.toLowerCase();

      // Check 1: If query is a recognized traditional measurement number or fraction (e.g. 4, 4¼, 6, 7½, 8¾, 10)
      const parsed = parseTraditionalInput(query);
      if (parsed.success && parsed.value !== undefined) {
        return (
          Math.abs(record.numericValue - parsed.value) < 0.001 ||
          record.displayLabel.toLowerCase() === lowerQuery ||
          record.aliases.some((a) => a.toLowerCase() === lowerQuery || a === query)
        );
      }

      // Check 2: Exact display label or alias match
      if (
        record.displayLabel.toLowerCase() === lowerQuery ||
        record.aliases.some((a) => a.toLowerCase() === lowerQuery || a === query)
      ) {
        return true;
      }

      // Check 3: Full-text keyword search in Tamil or English text
      return (
        record.tamilDescription.includes(query) ||
        record.englishTranslation.toLowerCase().includes(lowerQuery) ||
        record.aliases.some((a) => a.includes(query))
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyCitation = (record: TraditionalRecord) => {
    const citation = `நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1), பக்கம் ${record.pageNumber}. அளவு: ${record.displayLabel} விரற்கடை (${record.numericValue}). விளக்கம்: ${record.tamilDescription}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-800 text-xs font-semibold text-gold-300 border border-gold-500/30">
          <BookOpen className="w-3.5 h-3.5 text-gold-400" />
          <span>{t.libraryTitle}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
          {language === 'en' ? 'Canonical Reference Library' : 'மணிக்கடை நூல் மூலக் குறிப்பகம்'}
        </h1>
        <p className="text-sm text-cream-200/80 font-light max-w-3xl leading-relaxed">
          {t.librarySubtitle}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-forest-850/90 border border-gold-500/25 rounded-2xl p-4 sm:p-5 shadow-card-dark space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-forest-900 border border-forest-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-cream-100 placeholder-cream-200/40 outline-none transition-all"
            />
            {searchQuery && (
              <button
                id="library-clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-cream-200/50 hover:text-cream-100"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gold-500 text-forest-950 font-bold'
                  : 'bg-forest-900 text-cream-200/80 hover:bg-forest-800 border border-forest-700'
              }`}
            >
              {t.allRecords}
            </button>
            <button
              onClick={() => setSelectedCategory('disease_manifestation')}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === 'disease_manifestation'
                  ? 'bg-gold-500 text-forest-950 font-bold'
                  : 'bg-forest-900 text-cream-200/80 hover:bg-forest-800 border border-forest-700'
              }`}
            >
              {t.manifestations}
            </button>
            <button
              onClick={() => setSelectedCategory('critical_prognosis')}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === 'critical_prognosis'
                  ? 'bg-gold-500 text-forest-950 font-bold'
                  : 'bg-forest-900 text-cream-200/80 hover:bg-forest-800 border border-forest-700'
              }`}
            >
              {t.criticalSigns}
            </button>
          </div>
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-forest-800/80 text-xs text-siddha-muted">
          <span>{language === 'en' ? 'Quick lookup:' : 'விரைவுத் தேர்வு:'}</span>
          {['4', '4¼', '6', '7½', '8¾', '10'].map((val) => (
            <button
              key={val}
              onClick={() => setSearchQuery(val)}
              className="px-2.5 py-1 rounded-lg bg-forest-900 hover:bg-forest-800 text-gold-300 border border-gold-500/20 hover:border-gold-500/50 transition-colors font-medium font-serif"
            >
              {val}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-cream-200/60">
            {language === 'en' ? `Showing ${filteredRecords.length} of 25 records` : `25 இல் ${filteredRecords.length} பதிவுகள்`}
          </span>
        </div>
      </div>

      {/* Grid of Canonical Records */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => {
            const isCritical = record.category === 'critical_prognosis';
            return (
              <div
                key={record.id}
                id={`record-card-${record.id}`}
                onClick={() => setActiveRecord(record)}
                className="group cursor-pointer bg-forest-850/80 hover:bg-forest-800/90 border border-gold-500/25 hover:border-gold-500/60 rounded-2xl p-5 space-y-4 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-gold-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-2xl font-bold text-gold-400 group-hover:text-gold-300">
                        {record.displayLabel}
                      </span>
                      <span className="text-xs text-siddha-muted font-light">
                        virarkadai ({record.numericValue})
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-red-950/70 text-red-300 border-red-500/40'
                          : 'bg-forest-900 text-gold-300 border-gold-500/30'
                      }`}
                    >
                      p. {record.pageNumber}
                    </span>
                  </div>

                  {/* Tamil Description */}
                  <p className="text-sm font-tamil text-cream-100 leading-relaxed line-clamp-3">
                    {record.tamilDescription}
                  </p>

                  {/* English Translation */}
                  <p className="text-xs text-cream-200/70 font-light line-clamp-2 italic">
                    {record.englishTranslation}
                  </p>
                </div>

                <div className="pt-3 border-t border-forest-800/80 flex items-center justify-between text-xs text-gold-400 font-semibold">
                  <span className="text-[11px] text-siddha-muted font-normal">
                    {isCritical ? 'Critical Prognosis' : 'Disease Manifestation'}
                  </span>
                  <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>{language === 'en' ? 'View Entry' : 'காண்க'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-forest-850/50 border border-dashed border-forest-700 rounded-2xl p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-gold-400/40 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-cream-100">
            {language === 'en' ? 'No Canonical Records Found' : 'தேடலுக்குரிய பதிவுகள் ஏதும் கிடைக்கவில்லை'}
          </h3>
          <p className="text-xs text-cream-200/70 max-w-md mx-auto">
            {language === 'en'
              ? `No entry matched "${searchQuery}". The traditional manuscript covers discrete quarter-increments from 4 to 10 virarkadai.`
              : `"${searchQuery}" என்ற தேடலுக்குப் பதிவு இல்லை. மூல ஏடு 4 முதல் 10 வரையிலான கால்பங்கு அளவுகளை மட்டுமே கொண்டுள்ளது.`}
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-forest-800 text-gold-300 border border-gold-500/30 text-xs font-semibold hover:bg-forest-700 transition-colors"
          >
            {language === 'en' ? 'Clear Search & Show All 25' : 'தேடலை நீக்கி 25 பதிவுகளையும் காண்க'}
          </button>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER */}
      {activeRecord && (
        <div
          id="record-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveRecord(null)}
        >
          <div
            className="bg-forest-900 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-forest-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-400">
                    {activeRecord.displayLabel}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-800 text-gold-300 border border-gold-500/30">
                    {activeRecord.numericValue} Virarkadai (விரற்கடை)
                  </span>
                </div>
                <p className="text-xs text-siddha-muted mt-1">
                  {activeRecord.sourceTitle} • {activeRecord.partVolume} • பக்கம் {activeRecord.pageNumber}
                </p>
              </div>
              <button
                id="close-detail-modal-btn"
                onClick={() => setActiveRecord(null)}
                className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Tamil Manuscript Description */}
            <div className="space-y-2 p-4 rounded-2xl bg-forest-950 border border-gold-500/20">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block font-serif">
                {language === 'en' ? 'Original Tamil Manuscript Text:' : 'மூல ஏட்டுத் தமிழ் விளக்கம்:'}
              </span>
              <p className="text-base sm:text-lg font-tamil text-cream-50 leading-relaxed">
                {activeRecord.tamilDescription}
              </p>
            </div>

            {/* English Translation */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-forest-950/70 border border-forest-800">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block font-serif">
                {language === 'en' ? 'English Scholarly Translation:' : 'ஆங்கில மொழிபெயர்ப்பு:'}
              </span>
              <p className="text-sm text-cream-200/90 font-light leading-relaxed">
                {activeRecord.englishTranslation}
              </p>
            </div>

            {/* Classical Verse if available */}
            {activeRecord.verse && (
              <div className="space-y-2 p-4 rounded-2xl bg-forest-950 border border-amber-500/30">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{activeRecord.verse.tamilTitle}</span>
                </div>
                <div className="font-tamil text-sm text-cream-100 italic space-y-1 pl-3 border-l-2 border-gold-500/50">
                  {activeRecord.verse.tamilLines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
                <p className="text-[11px] text-cream-200/70 pt-1">
                  {activeRecord.verse.context}
                </p>
              </div>
            )}

            {/* Metadata & Actions */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-forest-800">
              <div className="text-xs text-siddha-muted">
                <span>Transcription Status: </span>
                <span className="text-gold-400 font-semibold capitalize">
                  {activeRecord.transcriptionStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <button
                id="copy-citation-btn"
                onClick={() => handleCopyCitation(activeRecord)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold-300 border border-gold-500/30 text-xs font-semibold transition-colors"
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-300">Citation Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Scholarly Citation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
