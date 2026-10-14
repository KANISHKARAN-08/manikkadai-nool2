import React, { useState } from 'react';
import {
  Compass,
  AlertCircle,
  CheckCircle2,
  Printer,
  Download,
  BookOpen,
  Info,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { Language, UnitType } from '../types';
import { performAssessment } from '../lib/lookupEngine';
import type { MetricAssessmentResult } from '../lib/lookupEngine';
import { parseTraditionalInput } from '../lib/normalization';
import { TRADITIONAL_REFERENCES } from '../data/traditionalReferences';
import { saveAssessmentRecord } from '../lib/assessmentStore';
import { generateAssessmentCsv, downloadCsvFile } from '../lib/csvExport';
import { triggerPrintReport } from '../lib/printReport';
import { translations } from '../lib/translations';
import { PrintableReport } from '../components/PrintableReport';

interface AssessmentPageProps {
  language: Language;
  onNavigate: (view: string) => void;
  onRecordSaved?: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  language,
  onNavigate,
  onRecordSaved
}) => {
  const t = translations[language];

  // Form states - strictly Virarkadai unit
  const [sessionId, setSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('10');
  const unit: UnitType = 'virarkadai';
  const [repeatValue, setRepeatValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Assessment outcome state
  const [assessmentResult, setAssessmentResult] = useState<MetricAssessmentResult | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live traditional preview calculation
  const parsedTrad = parseTraditionalInput(inputValue);
  let livePreviewContent: React.ReactNode = null;
  if (parsedTrad.success && parsedTrad.value !== undefined) {
    const canonicalMatch = TRADITIONAL_REFERENCES.find(
      (r) => Math.abs(r.numericValue - (parsedTrad.value ?? 0)) < 0.001
    );
    livePreviewContent = (
      <div className="flex items-center space-x-2 font-semibold text-cream-100">
        <span className="px-2 py-0.5 rounded bg-forest-800 text-gold-300 border border-gold-500/30">
          {parsedTrad.normalizedLabel || parsedTrad.value} விரற்கடை
        </span>
        <span className="text-xs text-gold-400/90 font-normal">
          {canonicalMatch
            ? `(✓ Page ${canonicalMatch.pageNumber} • ${canonicalMatch.category === 'critical_prognosis' ? 'Critical Prognosis' : 'Disease Manifestation'})`
            : '(Outside 4–10 table)'}
        </span>
      </div>
    );
  } else {
    livePreviewContent = (
      <span className="text-cream-200/40 italic">
        {inputValue ? 'Awaiting valid Virarkadai (e.g. 4, 4¼, 7½, 8¾, 10)...' : 'Enter measurement'}
      </span>
    );
  }

  const handleGenerateSessionId = () => {
    const randomId = `MN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionId(randomId);
  };

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSavedNotification(null);

    const result = performAssessment({
      inputValue,
      inputUnit: 'virarkadai',
      repeatValue: repeatValue.trim() !== '' ? repeatValue : undefined,
      notes: notes.trim() !== '' ? notes : undefined,
      sessionId: sessionId.trim() !== '' ? sessionId : undefined
    });

    if (result.status === 'invalid_input') {
      setValidationError(result.error || 'Please enter a valid traditional Virarkadai value (4 to 10).');
      setAssessmentResult(null);
      return;
    }

    // Set new result immediately to prevent stale report state
    setAssessmentResult(result);

    // Save to local history immediately
    if (result.assessmentRecord) {
      saveAssessmentRecord(result.assessmentRecord);
      onRecordSaved?.();
      setSavedNotification(
        language === 'en'
          ? 'Assessment record saved to browser history.'
          : 'பரிசோதனை உலாவி வரலாற்றில் வெற்றிகரமாகச் சேமிக்கப்பட்டது.'
      );
    }
  };

  const handleReset = () => {
    setInputValue('10');
    setRepeatValue('');
    setNotes('');
    setAssessmentResult(null);
    setValidationError(null);
    setSavedNotification(null);
  };

  const handleExportCurrentCsv = () => {
    if (!assessmentResult?.assessmentRecord) return;
    const csv = generateAssessmentCsv([assessmentResult.assessmentRecord]);
    const filename = `manikkadai_assessment_${assessmentResult.assessmentRecord.sessionId}.csv`;
    downloadCsvFile(csv, filename);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2 no-print">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-800 text-xs font-semibold text-gold-300 border border-gold-500/30">
          <Compass className="w-3.5 h-3.5 text-gold-400" />
          <span>{t.assessmentFormTitle}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
          {language === 'en' ? 'Wrist Circumference Assessment' : 'மணிக்கட்டு சுற்றளவுப் பரிசோதனை'}
        </h1>
        <p className="text-sm text-cream-200/80 font-light max-w-2xl">
          {language === 'en'
            ? 'Enter wrist circumference in Virarkadai (4 to 10 in ¼ increments) to perform authenticated Siddha manuscript reference lookup.'
            : 'பாரம்பரிய நோய் நாடல் நோய் முதல் நாடல் திரட்டு ஏட்டின்படி மணிக்கட்டு சுற்றளவை விரற்கடையில் (4 முதல் 10 வரை) உள்ளிட்டு மூல ஏட்டுப் பதிவுகளைக் காண்க.'}
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-forest-950/80 border-l-4 border-gold-500 rounded-r-xl p-4 sm:p-5 flex items-start space-x-3 text-xs sm:text-sm text-cream-200/90 shadow-sm no-print">
        <ShieldAlert className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-gold-300 block">{t.medicalNoticeTitle}</span>
          <p className="font-light leading-relaxed">{t.medicalNoticeBody}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-7 bg-forest-850/90 border border-gold-500/25 rounded-2xl p-6 sm:p-8 shadow-card-dark space-y-6">
          <form onSubmit={handleAssessmentSubmit} className="space-y-6">
            {/* Session ID Field */}
            <div className="space-y-1.5">
              <label htmlFor="session-id-input" className="block text-xs font-semibold text-gold-300">
                {t.sessionIdLabel}
              </label>
              <div className="flex space-x-2">
                <input
                  id="session-id-input"
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder={t.sessionIdPlaceholder}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-forest-900 border border-forest-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-cream-100 placeholder-cream-200/40 outline-none transition-all"
                />
                <button
                  type="button"
                  id="generate-session-id-btn"
                  onClick={handleGenerateSessionId}
                  className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold-300 border border-gold-500/30 text-xs font-medium transition-colors"
                >
                  {t.generateIdBtn}
                </button>
              </div>
            </div>

            {/* Clearly labelled Unit Badge — Virarkadai only */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gold-300">
                {t.unitLabel}
              </label>
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-700 text-xs font-bold text-gold-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-gold-400 shadow-sm" />
                  <span>Traditional Wrist Unit (விரற்கடை)</span>
                </div>
                <span className="text-[11px] font-normal text-cream-200/60">
                  Canonical Proportional Unit
                </span>
              </div>
            </div>

            {/* Primary Measurement Input */}
            <div className="space-y-1.5">
              <label htmlFor="wrist-measurement-input" className="block text-xs font-semibold text-gold-300">
                {language === 'en'
                  ? 'Wrist Measurement (4 to 10) *'
                  : 'மணிக்கட்டு அளவீடு (4 முதல் 10 வரை) *'}
              </label>
              <div className="relative">
                <input
                  id="wrist-measurement-input"
                  type="text"
                  required
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="e.g. 10, 8, 7½, 6, 4¼"
                  className={`w-full px-4 py-3 rounded-xl bg-forest-900 border ${
                    validationError ? 'border-red-500 ring-1 ring-red-500' : 'border-forest-700 focus:border-gold-500'
                  } focus:ring-1 focus:ring-gold-500 text-base font-medium text-cream-100 placeholder-cream-200/40 outline-none transition-all`}
                />
                <span className="absolute right-3.5 top-3.5 text-xs font-bold text-gold-400">
                  விரற்கடை
                </span>
              </div>
            </div>

            {/* Live Normalized Traditional Preview */}
            <div className="bg-forest-900/90 border border-gold-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <span className="text-siddha-muted font-medium flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-gold-400" />
                <span>{t.livePreview}:</span>
              </span>
              {livePreviewContent}
            </div>

            {/* Repeat Reading Field */}
            <div className="space-y-1.5">
              <label htmlFor="repeat-measurement-input" className="block text-xs font-semibold text-gold-300">
                {t.repeatLabel}
              </label>
              <div className="relative">
                <input
                  id="repeat-measurement-input"
                  type="text"
                  value={repeatValue}
                  onChange={(e) => setRepeatValue(e.target.value)}
                  placeholder="e.g. 10 or 7.5 (Optional duplicate check)"
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-cream-100 placeholder-cream-200/40 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-3 text-xs text-siddha-muted font-bold">
                  விரற்கடை
                </span>
              </div>
              <p className="text-[11px] text-siddha-muted">
                {language === 'en'
                  ? 'Confirms reproducibility within ¼ Virarkadai (one quarter-step) tolerance.'
                  : '¼ விரற்கடை எல்லைக்குள் மீண்டும் பரிசோதிக்க பரிந்துரைக்கப்படுகிறது.'}
              </p>
            </div>

            {/* Notes Field */}
            <div className="space-y-1.5">
              <label htmlFor="assessment-notes-input" className="block text-xs font-semibold text-gold-300">
                {t.notesLabel}
              </label>
              <textarea
                id="assessment-notes-input"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-forest-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs text-cream-100 placeholder-cream-200/40 outline-none transition-all resize-none"
              />
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div id="assessment-validation-error" className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                id="find-reference-entry-btn"
                className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-forest-950 font-bold text-sm shadow-gold-sm transition-all"
              >
                <Compass className="w-4 h-4 text-forest-950" />
                <span>{t.findRefBtn}</span>
              </button>
              <button
                type="button"
                id="assessment-reset-btn"
                onClick={handleReset}
                className="p-3.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-200 border border-forest-700 hover:border-gold-500/40 transition-colors"
                title="Reset form"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Circumference Measurement Protocol Reminder */}
          <div className="pt-4 border-t border-forest-800 text-xs text-siddha-muted space-y-1">
            <span className="font-semibold text-cream-200 block">
              {t.circumferenceDisclaimer}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Standard Protocol Guide */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-forest-850/80 border border-gold-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center space-x-2">
              <Info className="w-4 h-4 text-gold-400" />
              <span>{t.measurementStepsTitle}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-forest-900 border border-forest-800 space-y-1">
                <span className="font-bold text-gold-300 block">{t.step1Title}</span>
                <p className="text-cream-200/80 font-light leading-relaxed">{t.step1Desc}</p>
              </div>

              <div className="p-3 rounded-xl bg-forest-900 border border-forest-800 space-y-1">
                <span className="font-bold text-gold-300 block">{t.step2Title}</span>
                <p className="text-cream-200/80 font-light leading-relaxed">{t.step2Desc}</p>
              </div>

              <div className="p-3 rounded-xl bg-forest-900 border border-forest-800 space-y-1">
                <span className="font-bold text-gold-300 block">{t.step3Title}</span>
                <p className="text-cream-200/80 font-light leading-relaxed">{t.step3Desc}</p>
              </div>
            </div>

            {/* Provenance note */}
            <div className="pt-2 flex items-center justify-between text-xs text-gold-400">
              <button
                onClick={() => onNavigate('library')}
                className="hover:underline flex items-center space-x-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Explore 25 Traditional Verses' : '25 பாரம்பரிய மூலப் பாடல்களைக் காண்க'}</span>
              </button>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* ASSESSMENT OUTPUT REPORT CARD */}
      {assessmentResult && assessmentResult.assessmentRecord && (
        <>
          <section
            id="assessment-report-section"
            className="bg-forest-900 border-2 border-gold-500/40 rounded-2xl p-6 sm:p-8 shadow-card-dark space-y-6 animate-fade-in no-print"
          >
            {/* Header of Report */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-bold text-gold-400">
                  {language === 'en' ? 'Canonical Traditional Report' : 'பாரம்பரிய மூல ஏட்டு அறிக்கை'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-forest-800 text-cream-200 border border-forest-700">
                  Session: {assessmentResult.assessmentRecord.sessionId}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-cream-50 mt-1">
                {language === 'en' ? 'Assessment Outcome' : 'பரிசோதனை முடிவு'}
              </h2>
              <p className="text-xs text-siddha-muted">
                {new Date(assessmentResult.assessmentRecord.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Action Bar (Print, CSV) */}
            <div className="flex items-center space-x-2 no-print">
              <button
                id="print-report-btn"
                onClick={triggerPrintReport}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-xs font-semibold text-cream-100 border border-forest-700 transition-colors"
                title="Print report"
              >
                <Printer className="w-3.5 h-3.5 text-gold-400" />
                <span>{language === 'en' ? 'Print / PDF' : 'அச்சிடு / PDF'}</span>
              </button>

              <button
                id="export-csv-btn"
                onClick={handleExportCurrentCsv}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-xs font-semibold text-cream-100 border border-forest-700 transition-colors"
                title="Export this assessment to CSV"
              >
                <Download className="w-3.5 h-3.5 text-gold-400" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Saved Notification */}
          {savedNotification && (
            <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs flex items-center space-x-2 no-print">
              <CheckCircle2 className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <span>{savedNotification}</span>
            </div>
          )}

          {/* Measurements Breakdown Table — Wrist Measurement in Virarkadai */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800">
              <span className="text-[11px] text-siddha-muted uppercase tracking-wider block">
                {language === 'en' ? 'Wrist Measurement' : 'மணிக்கட்டு சுற்றளவு'}
              </span>
              <span className="text-lg font-bold text-cream-100">
                {assessmentResult.originalInput} virarkadai
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800">
              <span className="text-[11px] text-siddha-muted uppercase tracking-wider block">
                {language === 'en' ? 'Siddha Proportional Value' : 'மரபு விரற்கடை அளவு'}
              </span>
              <span className="text-lg font-bold text-gold-400">
                {assessmentResult.parsedTraditionalValue != null
                  ? `${assessmentResult.parsedTraditionalValue.toFixed(2)} vir`
                  : 'N/A'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800">
              <span className="text-[11px] text-siddha-muted uppercase tracking-wider block">
                {language === 'en' ? 'Canonical Status' : 'மூல ஏட்டு நிலை'}
              </span>
              <span className="text-sm font-bold text-gold-300">
                {assessmentResult.matchedTraditionalRecord
                  ? `Matched (p. ${assessmentResult.matchedTraditionalRecord.pageNumber})`
                  : 'No Manuscript Match'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800">
              <span className="text-[11px] text-siddha-muted uppercase tracking-wider block">
                {language === 'en' ? 'Review Status' : 'மறுஆய்வு நிலை'}
              </span>
              <span className="text-xs font-bold text-cream-100 capitalize">
                {assessmentResult.matchedTraditionalRecord?.transcriptionStatus.replace(/_/g, ' ') || 'Unmatched'}
              </span>
            </div>
          </div>

          {/* Repeat reading discrepancy if provided */}
          {assessmentResult.assessmentRecord.repeatInput && (
            <div className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-800 flex items-center justify-between text-xs">
              <span className="text-cream-200">
                <strong>Repeat Reading:</strong> {assessmentResult.assessmentRecord.repeatInput} virarkadai
              </span>
              {assessmentResult.assessmentRecord.discrepancyDiffCm != null && (
                <span className={`font-semibold ${assessmentResult.assessmentRecord.hasDiscrepancy ? 'text-red-400' : 'text-gold-300'}`}>
                  Δ {assessmentResult.assessmentRecord.discrepancyDiffCm.toFixed(2)} vir (Tolerance: ¼ virarkadai)
                </span>
              )}
            </div>
          )}

          {/* 1. TRADITIONAL CANONICAL MATCH */}
          {assessmentResult.status === 'traditional_match' && assessmentResult.matchedTraditionalRecord && (
            <div className="p-6 rounded-2xl bg-forest-950 border border-gold-500/40 shadow-inner space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-forest-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-gold-400 shadow-sm" />
                  <span className="font-serif text-xl font-bold text-gold-300">
                    {assessmentResult.matchedTraditionalRecord.displayLabel} விரற்கடை ({assessmentResult.matchedTraditionalRecord.numericValue} Virarkadai)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-forest-800 text-gold-300 border border-gold-500/30 text-xs font-semibold">
                    Page {assessmentResult.matchedTraditionalRecord.pageNumber}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    assessmentResult.matchedTraditionalRecord.category === 'critical_prognosis'
                      ? 'bg-red-950/80 text-red-300 border-red-500/40'
                      : 'bg-forest-850 text-gold-300 border-gold-500/30'
                  }`}>
                    {assessmentResult.matchedTraditionalRecord.category === 'critical_prognosis' ? 'Critical Prognosis' : 'Disease Manifestation'}
                  </span>
                </div>
              </div>

              {/* Tamil Source Text */}
              <div className="space-y-1.5 p-4 rounded-xl bg-forest-900 border border-gold-500/20">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block font-serif">
                  {language === 'en' ? 'Original Manuscript Tamil Verse / Prose:' : 'மூல ஏட்டு விளக்கம்:'}
                </span>
                <p className="text-base sm:text-lg font-tamil text-cream-50 leading-relaxed font-normal">
                  {assessmentResult.matchedTraditionalRecord.tamilDescription}
                </p>
              </div>

              {/* English Scholarly Translation */}
              <div className="space-y-1 p-4 rounded-xl bg-forest-900/60 border border-forest-800">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block font-serif">
                  {language === 'en' ? 'English Translation:' : 'ஆங்கில விளக்கம்:'}
                </span>
                <p className="text-sm text-cream-200/90 font-light leading-relaxed">
                  {assessmentResult.matchedTraditionalRecord.englishTranslation}
                </p>
              </div>

              {/* Classical Verse (if available on record) */}
              {assessmentResult.matchedTraditionalRecord.verse && (
                <div className="space-y-2 p-4 rounded-xl bg-forest-900/40 border border-amber-500/30">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{assessmentResult.matchedTraditionalRecord.verse.tamilTitle}</span>
                  </div>
                  <div className="font-tamil text-sm text-cream-100 italic space-y-1 pl-3 border-l-2 border-gold-500/40">
                    {assessmentResult.matchedTraditionalRecord.verse.tamilLines.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Provenance Footer */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-siddha-muted gap-2">
                <div>
                  <strong className="text-cream-200">Source:</strong> {assessmentResult.matchedTraditionalRecord.sourceTitle} ({assessmentResult.matchedTraditionalRecord.partVolume}), பக்கம் {assessmentResult.matchedTraditionalRecord.pageNumber}
                </div>
                <div>
                  <strong className="text-cream-200">Transcription:</strong> {assessmentResult.matchedTraditionalRecord.transcriptionStatus.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          )}

          {/* 2. TRADITIONAL NO MATCH */}
          {assessmentResult.status === 'traditional_no_match' && (
            <div className="p-6 rounded-2xl bg-forest-950 border border-forest-700 space-y-4">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="font-serif text-lg font-bold text-cream-100">
                  {language === 'en'
                    ? 'No Authentic Manuscript Entry Found'
                    : 'மூல நூல் குறிப்பு ஏட்டில் இல்லை'}
                </span>
              </div>
              <p className="text-xs text-cream-200/80 leading-relaxed font-light">
                {language === 'en'
                  ? `The entered measurement (${assessmentResult.originalInput} virarkadai) does not match any of the 25 discrete canonical records. The classical manuscript table covers values strictly from 4 to 10 in ¼ increments.`
                  : `${assessmentResult.originalInput} விரற்கடைக்குரிய மூல நூல் குறிப்பு ஏட்டில் இல்லை. மூல ஏட்டின் அட்டவணை 4 முதல் 10 வரை ¼ இடைவெளிகளில் உள்ள 25 அளவுகளை மட்டுமே கொண்டுள்ளது.`}
              </p>

              {assessmentResult.nearestSuggestions && assessmentResult.nearestSuggestions.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-semibold text-gold-300 block">
                    {language === 'en' ? 'Nearest Canonical Values in Manuscript:' : 'மூல ஏட்டில் உள்ள அருகிலுள்ள அளவுகள்:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {assessmentResult.nearestSuggestions.map((sug) => (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => {
                          setInputValue(String(sug.numericValue));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-gold-300 border border-gold-500/30 text-xs font-serif font-bold transition-colors"
                      >
                        {sug.displayLabel} விரற்கடை (p. {sug.pageNumber})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes if entered */}
          {assessmentResult.assessmentRecord.notes && (
            <div className="p-3.5 rounded-xl bg-forest-950/50 border border-forest-800 text-xs">
              <strong className="text-gold-400 block mb-1">
                {language === 'en' ? 'Observational Notes:' : 'ஆய்வுக் குறிப்புகள்:'}
              </strong>
              <p className="text-cream-200/90 whitespace-pre-wrap">{assessmentResult.assessmentRecord.notes}</p>
            </div>
          )}
        </section>

        {/* Print-only publication-grade A4 report */}
        <div id="assessment-print-section" className="hidden print:block">
          <PrintableReport record={assessmentResult.assessmentRecord} language={language} />
        </div>
      </>
      )}
    </div>
  );
};
