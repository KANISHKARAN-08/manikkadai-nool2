import { AssessmentRecord } from '../types';

/**
 * Escapes a field for CSV according to RFC 4180:
 * Wrap in quotes if it contains commas, double quotes, or newlines.
 * Double up any inner quotes.
 */
export function escapeCsvField(val: string | number | null | undefined): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generates CSV string from an array of AssessmentRecord objects.
 * Prepends UTF-8 Byte Order Mark (\uFEFF) to guarantee Excel / spreadsheet
 * applications correctly render Tamil Unicode text.
 */
export function generateAssessmentCsv(records: AssessmentRecord[]): string {
  const headers = [
    'Session ID',
    'Timestamp (ISO)',
    'Original Input',
    'Original Unit',
    'Normalized (cm)',
    'Normalized (mm)',
    'Repeat Reading',
    'Repeat Normalized (cm)',
    'Discrepancy (cm)',
    'Tolerance Exceeded',
    'Lookup Result Status',
    'Matched Reference ID',
    'Reference Source Title',
    'Review Status',
    'Notes',
    'Summary (English)',
    'Summary (Tamil)'
  ];

  const rows = records.map((r) => [
    escapeCsvField(r.sessionId),
    escapeCsvField(r.timestamp),
    escapeCsvField(r.originalInput),
    escapeCsvField(r.originalUnit),
    escapeCsvField(r.normalizedCm != null ? r.normalizedCm.toFixed(2) : ''),
    escapeCsvField(r.normalizedMm != null ? r.normalizedMm.toFixed(1) : ''),
    escapeCsvField(r.repeatInput || ''),
    escapeCsvField(r.repeatNormalizedCm != null ? r.repeatNormalizedCm.toFixed(2) : ''),
    escapeCsvField(r.discrepancyDiffCm != null ? r.discrepancyDiffCm.toFixed(2) : ''),
    escapeCsvField(r.hasDiscrepancy ? 'YES' : 'NO'),
    escapeCsvField(r.lookupStatus),
    escapeCsvField(r.matchedMetricRange?.id || r.matchedTraditionalRecord?.id || 'none'),
    escapeCsvField(r.matchedMetricRange?.sourceTitle || r.matchedTraditionalRecord?.sourceTitle || 'none'),
    escapeCsvField(r.reviewStatus),
    escapeCsvField(r.notes || ''),
    escapeCsvField(r.summaryMessageEn),
    escapeCsvField(r.summaryMessageTa)
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  return '\uFEFF' + csvContent;
}

/**
 * Initiates browser download of the generated CSV file.
 */
export function downloadCsvFile(content: string, filename: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
