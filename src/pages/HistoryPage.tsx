import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Download,
  Printer,
  ShieldCheck,
  RotateCw,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AssessmentRecord, Language } from '../types';
import {
  loadAssessmentHistory,
  deleteAssessmentRecord,
  clearAllAssessmentHistory
} from '../lib/assessmentStore';
import { generateAssessmentCsv, downloadCsvFile } from '../lib/csvExport';
import { triggerPrintReport } from '../lib/printReport';
import { translations } from '../lib/translations';
import { PrintableReport } from '../components/PrintableReport';

interface HistoryPageProps {
  language: Language;
  onNavigate: (view: string) => void;
  onHistoryUpdated?: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  language,
  onNavigate,
  onHistoryUpdated
}) => {
  const t = translations[language];

  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  const refreshHistory = () => {
    const list = loadAssessmentHistory();
    setRecords(list);
    setSelectedRecord((prev) => {
      if (prev && list.find((r) => r.id === prev.id)) {
        return prev;
      }
      return list.length > 0 ? list[0] : null;
    });
    onHistoryUpdated?.();
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const handleDeleteRecord = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const confirmed = window.confirm(
      language === 'en'
        ? 'Are you sure you want to delete this assessment record from your local browser storage?'
        : 'இந்தப் பரிசோதனைப் பதிவை உங்கள் உலாவி சேமிப்பகத்திலிருந்து நீக்க விரும்புகிறீர்களா?'
    );
    if (confirmed) {
      deleteAssessmentRecord(id);
      refreshHistory();
    }
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      language === 'en'
        ? 'Are you sure you want to clear ALL saved assessment records? This action cannot be undone.'
        : 'அனைத்துப் பரிசோதனைப் பதிவுகளையும் மொத்தமாக நீக்க விரும்புகிறீர்களா? இதை மீட்டெடுக்க முடியாது.'
    );
    if (confirmed) {
      clearAllAssessmentHistory();
      refreshHistory();
    }
  };

  const handleExportAllCsv = () => {
    if (records.length === 0) return;
    const csv = generateAssessmentCsv(records);
    const filename = `manikkadai_history_export_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsvFile(csv, filename);
  };

  return (
    <>
      <div className="space-y-8 py-6 max-w-6xl mx-auto no-print">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-800 text-xs font-semibold text-gold-300 border border-gold-500/30">
            <History className="w-3.5 h-3.5 text-gold-400" />
            <span>{t.historyTitle}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
            {language === 'en' ? 'Local Session History' : 'உள்ளூர் அமர்வு வரலாறு'}
          </h1>
          <p className="text-xs sm:text-sm text-cream-200/80 font-light max-w-2xl">
            {language === 'en'
              ? 'Locally persisted wrist circumference evaluations stored securely in this browser with zero external network requests.'
              : 'வெளிப்புற வலையமைப்புகள் ஏதுமின்றி உங்கள் உலாவியிலேயே பத்திரமாகச் சேமிக்கப்பட்டுள்ள முந்தைய பரிசோதனைகள்.'}
          </p>
        </div>

        {/* Global History Action Buttons */}
        {records.length > 0 && (
          <div className="flex items-center space-x-2.5">
            <button
              id="history-export-all-csv-btn"
              onClick={handleExportAllCsv}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold-300 border border-gold-500/30 text-xs font-semibold transition-colors"
              title="Export all records as CSV"
            >
              <Download className="w-4 h-4 text-gold-400" />
              <span>{t.exportCsvBtn} ({records.length})</span>
            </button>

            <button
              id="history-clear-all-btn"
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-semibold transition-colors"
              title="Delete all records"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.clearAllBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* Honest Privacy Notice */}
      <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-800 flex items-center justify-between text-xs text-siddha-muted">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span>
            {language === 'en'
              ? 'Stored strictly in this browser’s localStorage. Data is not synced across other devices or uploaded to remote cloud databases.'
              : 'இத்தகவல்கள் உங்கள் உலாவியின் நினைவகத்தில் (localStorage) மட்டுமே சேமிக்கப்படுகின்றன. வெளிப்புற சர்வர்களுக்கோ மேகக்கணிணிக்கோ அனுப்பப்படுவதில்லை.'}
          </span>
        </div>
        <button
          onClick={refreshHistory}
          className="hover:text-gold-300 p-1 flex items-center space-x-1"
          title="Reload storage"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Records List or Empty State */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table / List */}
          <div className="lg:col-span-7 space-y-3">
            {records.map((r) => {
              const isSelected = selectedRecord?.id === r.id;

              return (
                <div
                  key={r.id}
                  id={`history-item-${r.id}`}
                  onClick={() => setSelectedRecord(r)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-forest-800 border-gold-500/60 shadow-gold-sm'
                      : 'bg-forest-850/80 hover:bg-forest-800/70 border-gold-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-forest-900 text-gold-300 border border-gold-500/30">
                        {r.sessionId}
                      </span>
                      <span className="text-[11px] text-cream-200/50 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(r.timestamp).toLocaleDateString()} {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteRecord(r.id, e)}
                      className="text-cream-200/40 hover:text-red-400 p-1 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-cream-200/70">Measured: </span>
                      <strong className="text-cream-100 font-serif text-sm">
                        {r.originalInput} {r.originalUnit}
                      </strong>
                      {r.originalUnit === 'virarkadai' ? (
                        <span className="text-gold-400 ml-2">
                          ({r.matchedTraditionalRecord ? `${r.matchedTraditionalRecord.displayLabel} விரற்கடை` : 'Traditional'})
                        </span>
                      ) : (
                        <span className="text-gold-400 ml-2">
                          ({r.normalizedCm != null ? `${r.normalizedCm.toFixed(2)} cm` : ''} / {r.normalizedMm != null ? `${r.normalizedMm.toFixed(1)} mm` : ''})
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        r.lookupStatus === 'traditional_match'
                          ? 'bg-forest-900 text-gold-300 border-gold-500/40'
                          : r.lookupStatus === 'metric_research_range_match'
                          ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                          : 'bg-forest-900 text-cream-200/70 border-forest-700'
                      }`}
                    >
                      {r.lookupStatus === 'traditional_match'
                        ? `Canonical Match (p. ${r.matchedTraditionalRecord?.pageNumber})`
                        : r.lookupStatus === 'traditional_no_match'
                        ? 'No Traditional Entry'
                        : r.lookupStatus === 'metric_research_range_match'
                        ? 'Provisional Range'
                        : 'No Metric Reference'}
                    </span>
                  </div>

                  {r.notes && (
                    <p className="mt-2 text-[11px] text-cream-200/60 line-clamp-1 italic">
                      Note: {r.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Selected Record Details Preview */}
          <div className="lg:col-span-5 bg-forest-850 border border-gold-500/30 rounded-2xl p-6 space-y-5 sticky top-28 shadow-card-dark">
            {selectedRecord ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-forest-800">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-cream-100">
                      Session {selectedRecord.sessionId}
                    </h3>
                    <p className="text-[11px] text-siddha-muted">
                      {new Date(selectedRecord.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      id="history-print-selected-btn"
                      onClick={triggerPrintReport}
                      className="p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-gold-300 transition-colors"
                      title="Print this record"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const csv = generateAssessmentCsv([selectedRecord]);
                        downloadCsvFile(csv, `assessment_${selectedRecord.sessionId}.csv`);
                      }}
                      className="p-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-gold-300 transition-colors"
                      title="Export CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-forest-900 border border-forest-800">
                    <span className="text-[10px] text-siddha-muted uppercase block">Measurement</span>
                    <strong className="text-sm text-gold-300">
                      {selectedRecord.originalInput} {selectedRecord.originalUnit}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-forest-900 border border-forest-800">
                    <span className="text-[10px] text-siddha-muted uppercase block">
                      {selectedRecord.originalUnit === 'virarkadai' ? 'Mode' : 'Normalized'}
                    </span>
                    <strong className="text-sm text-cream-100">
                      {selectedRecord.originalUnit === 'virarkadai'
                        ? 'Traditional Virarkadai'
                        : `${selectedRecord.normalizedCm?.toFixed(2)} cm`}
                    </strong>
                  </div>
                </div>

                {selectedRecord.repeatInput && (
                  <div className="p-2.5 rounded-xl bg-forest-900 border border-forest-800">
                    <span className="text-[10px] text-siddha-muted uppercase block">Repeat Reading</span>
                    <p className="text-cream-200">
                      {selectedRecord.repeatInput} {selectedRecord.originalUnit}
                      {selectedRecord.discrepancyDiffCm != null && (
                        <span className="ml-2 text-gold-400">
                          Δ {selectedRecord.discrepancyDiffCm.toFixed(2)} {selectedRecord.originalUnit === 'virarkadai' ? 'vir' : 'cm'}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-forest-950 border border-forest-800 space-y-1">
                  <span className="text-[10px] text-siddha-muted uppercase block">Report Summary</span>
                  <p className="text-cream-200 leading-relaxed font-light">
                    {language === 'en' ? selectedRecord.summaryMessageEn : selectedRecord.summaryMessageTa}
                  </p>
                </div>

                {selectedRecord.notes && (
                  <div className="p-3 rounded-xl bg-forest-950/60 border border-forest-800 space-y-1">
                    <span className="text-[10px] text-siddha-muted uppercase block">Notes</span>
                    <p className="text-cream-200 whitespace-pre-wrap">{selectedRecord.notes}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => handleDeleteRecord(selectedRecord.id)}
                    className="w-full py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-siddha-muted space-y-2">
                <Compass className="w-10 h-10 text-gold-400/40 mx-auto" />
                <p className="text-xs">Select any record from the left to view detailed results.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty History State */
        <div className="text-center py-16 bg-forest-850/50 border border-dashed border-forest-700 rounded-3xl p-8 space-y-4">
          <History className="w-12 h-12 text-gold-400/40 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-cream-100">
            {t.noHistoryTitle}
          </h3>
          <p className="text-xs text-cream-200/70 max-w-md mx-auto leading-relaxed">
            {t.noHistoryDesc}
          </p>
          <button
            id="start-first-assessment-btn"
            onClick={() => onNavigate('assessment')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-forest-950 font-bold text-xs shadow-gold-sm hover:from-gold-400 hover:to-gold-500 transition-all inline-flex items-center space-x-1.5"
          >
            <span>Start an Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>

    {/* Dedicated A4 Print View for the Selected History Record */}
    {selectedRecord && (
      <div id="history-print-section" className="hidden print:block">
        <PrintableReport record={selectedRecord} language={language} />
      </div>
    )}
    </>
  );
};
