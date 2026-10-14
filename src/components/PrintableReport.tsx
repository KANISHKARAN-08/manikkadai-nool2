import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { AssessmentRecord, Language, TraditionalRecord } from '../types';
import { TRADITIONAL_REFERENCES } from '../data/traditionalReferences';
import { parseTraditionalInput } from '../lib/normalization';

interface PrintableReportProps {
  record: AssessmentRecord;
  language?: Language;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  record,
  language = 'en'
}) => {
  // Resolve the canonical traditional record from record or fallback by parsing original input
  let canonicalRecord: TraditionalRecord | null = record.matchedTraditionalRecord || null;
  let parsedValue: number | null = canonicalRecord ? canonicalRecord.numericValue : null;

  if (!canonicalRecord && record.originalUnit === 'virarkadai') {
    const parsed = parseTraditionalInput(record.originalInput);
    if (parsed.success && parsed.value !== undefined) {
      parsedValue = parsed.value;
      canonicalRecord =
        TRADITIONAL_REFERENCES.find(
          (r) => Math.abs(r.numericValue - (parsed.value ?? 0)) < 0.001
        ) || null;
    }
  }

  const isMatched = record.lookupStatus === 'traditional_match' || !!canonicalRecord;

  return (
    <div className="print-report-container p-6 sm:p-8 bg-white text-gray-900 space-y-6">
      {/* 1. INSTITUTIONAL MASTHEAD / HEADER */}
      <div className="border-b-2 border-forest-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-800">
              Siddha Medical Heritage • Archival Diagnostic Assessment
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mt-1">
            Manikkadai Nool (மணிக்கடை நூல்)
          </h1>
          <p className="text-xs text-gray-600 font-serif">
            நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1, பக். 368–371)
          </p>
        </div>

        <div className="text-left sm:text-right space-y-1 text-xs text-gray-700">
          <div className="font-bold font-mono text-gray-900">
            Session: {record.sessionId}
          </div>
          <div>
            Recorded: {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[11px] font-semibold border border-gray-300">
            Mode: Wrist Measurement (Traditional Wrist Unit)
          </div>
        </div>
      </div>

      {/* 2. MEASUREMENT BREAKDOWN GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print-avoid-break">
        <div className="p-3 rounded-lg border border-gray-300 bg-gray-50">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
            Wrist Measurement
          </span>
          <span className="text-base sm:text-lg font-bold text-gray-900 font-serif">
            {record.originalInput} {record.originalUnit}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-gray-300 bg-gray-50">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
            Proportional Value
          </span>
          <span className="text-base sm:text-lg font-bold text-amber-800 font-serif">
            {canonicalRecord ? `${canonicalRecord.displayLabel} vir` : parsedValue != null ? `${parsedValue.toFixed(2)} vir` : `${record.originalInput} vir`}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-gray-300 bg-gray-50">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
            Manuscript Status
          </span>
          <span className="text-sm font-bold text-gray-900 block mt-0.5">
            {canonicalRecord ? `Page ${canonicalRecord.pageNumber} Entry` : 'No Manuscript Match'}
          </span>
        </div>

        <div className="p-3 rounded-lg border border-gray-300 bg-gray-50">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block">
            Review Status
          </span>
          <span className="text-xs font-bold text-gray-800 capitalize block mt-1">
            {canonicalRecord ? canonicalRecord.transcriptionStatus.replace(/_/g, ' ') : record.reviewStatus}
          </span>
        </div>
      </div>

      {/* Repeat Measurement Discrepancy (if present) */}
      {record.repeatInput && (
        <div className="p-3 rounded-lg border border-gray-300 bg-gray-50 text-xs flex items-center justify-between print-avoid-break">
          <div>
            <strong className="text-gray-900">Duplicate Reading:</strong> {record.repeatInput} {record.originalUnit}
          </div>
          {record.discrepancyDiffCm != null && (
            <div className={`font-semibold ${record.hasDiscrepancy ? 'text-red-700' : 'text-gray-800'}`}>
              Variance: Δ {record.discrepancyDiffCm.toFixed(2)} vir (Tolerance: ¼ virarkadai)
            </div>
          )}
        </div>
      )}

      {/* 3. CANONICAL MANUSCRIPT MATCH DETAILS */}
      {canonicalRecord ? (
        <div className="p-5 rounded-xl border border-gray-300 bg-white space-y-4 print-avoid-break">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
                {canonicalRecord.displayLabel} விரற்கடை ({canonicalRecord.numericValue} Virarkadai)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                Page {canonicalRecord.pageNumber}
              </span>
              <span className={`px-2.5 py-0.5 rounded border ${
                canonicalRecord.category === 'critical_prognosis'
                  ? 'bg-red-50 text-red-800 border-red-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}>
                {canonicalRecord.category === 'critical_prognosis' ? 'Critical Prognosis (மரணக் குறிகுணங்கள்)' : 'Disease Manifestation (நோயினிலைகள்)'}
              </span>
            </div>
          </div>

          {/* Original Manuscript Tamil Text */}
          <div className="space-y-1.5 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block font-serif">
              Original Manuscript Tamil Verse / Prose (மூல ஏட்டு விளக்கம்):
            </span>
            <p className="text-base sm:text-lg font-tamil text-gray-950 leading-relaxed font-normal">
              {canonicalRecord.tamilDescription}
            </p>
          </div>

          {/* English Scholarly Translation */}
          <div className="space-y-1 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block font-serif">
              English Scholarly Translation:
            </span>
            <p className="text-sm text-gray-800 font-light leading-relaxed">
              {canonicalRecord.englishTranslation}
            </p>
          </div>

          {/* Classical Verse Lines (if present) */}
          {canonicalRecord.verse && (
            <div className="space-y-2 p-4 rounded-lg bg-amber-50/50 border border-amber-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{canonicalRecord.verse.tamilTitle}</span>
              </div>
              <div className="font-tamil text-sm text-gray-900 italic space-y-1 pl-3 border-l-2 border-amber-600">
                {canonicalRecord.verse.tamilLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
              {canonicalRecord.verse.context && (
                <p className="text-xs text-gray-600 pt-1">
                  {canonicalRecord.verse.context}
                </p>
              )}
            </div>
          )}

          {/* Source Attribution */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 gap-2 border-t border-gray-200">
            <div>
              <strong>Primary Source:</strong> {canonicalRecord.sourceTitle} ({canonicalRecord.partVolume}), பக்கம் {canonicalRecord.pageNumber}
            </div>
            <div>
              <strong>Transcription:</strong> {canonicalRecord.transcriptionStatus.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      ) : (
        /* Unmatched Record */
        <div className="p-5 rounded-xl border border-gray-300 bg-gray-50 space-y-2 print-avoid-break">
          <h3 className="font-serif text-lg font-bold text-gray-900">
            No Authentic Manuscript Entry Found
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            The recorded measurement ({record.originalInput} virarkadai) does not match any of the 25 discrete canonical records. The classical manuscript table covers values strictly from 4 to 10 in ¼ increments.
          </p>
        </div>
      )}

      {/* 4. REPORT SUMMARY */}
      {(record.summaryMessageEn || record.summaryMessageTa) && (
        <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 text-xs space-y-1 print-avoid-break">
          <strong className="text-amber-900 block font-serif uppercase tracking-wider">
            {language === 'ta' ? 'அறிக்கை சுருக்கம் (Report Summary):' : 'Report Summary:'}
          </strong>
          <p className="text-gray-800 leading-relaxed font-light">
            {language === 'ta'
              ? (record.summaryMessageTa || record.summaryMessageEn)
              : (record.summaryMessageEn || record.summaryMessageTa)}
          </p>
        </div>
      )}

      {/* 5. CLINICAL / ARCHIVAL NOTES */}
      {record.notes && (
        <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 text-xs space-y-1 print-avoid-break">
          <strong className="text-amber-900 block font-serif uppercase tracking-wider">
            Observational / Clinical Notes:
          </strong>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{record.notes}</p>
        </div>
      )}

      {/* 6. ARCHIVAL FOOTER & DISCLAIMER */}
      <div className="pt-4 border-t border-gray-300 text-[11px] text-gray-500 space-y-1 print-avoid-break">
        <p className="leading-relaxed">
          <strong>Archival Notice:</strong> This clinical reference report is generated by the Manikkadai Nool Digital Research Platform for historical transcription, academic scholarship, and traditional Siddha research. It does not replace professional medical consultation.
        </p>
        <p className="text-gray-400">
          Canonical Source: நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1) • Printed pages 368, 369, 371.
        </p>
      </div>
    </div>
  );
};
