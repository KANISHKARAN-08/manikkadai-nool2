import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadAssessmentHistory,
  saveAssessmentRecord,
  deleteAssessmentRecord,
  clearAllAssessmentHistory
} from '../lib/assessmentStore';
import { escapeCsvField, generateAssessmentCsv } from '../lib/csvExport';
import { AssessmentRecord } from '../types';

describe('Local Persistence & CSV Export Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockRecord: AssessmentRecord = {
    id: 'test-rec-1',
    sessionId: 'MN-2026-TEST',
    timestamp: '2026-10-14T10:00:00.000Z',
    originalInput: '12.5',
    originalUnit: 'cm',
    normalizedCm: 12.5,
    normalizedMm: 125.0,
    toleranceThresholdCm: 0.3,
    lookupStatus: 'metric_research_range_match',
    reviewStatus: 'pending_review',
    notes: 'Patient shows "mild, observable symptoms"\nLine 2 notes',
    summaryMessageEn: 'Measurement 12.50 cm falls within provisional research range.',
    summaryMessageTa: 'அளவீடு 12.50 செ.மீ முதற்கட்ட ஆய்வு வரம்புடன் ஒத்துள்ளது.'
  };

  it('saves, loads, deletes, and clears assessment records reliably', () => {
    expect(loadAssessmentHistory()).toEqual([]);

    // Save
    const saved = saveAssessmentRecord(mockRecord);
    expect(saved).toBe(true);

    const loaded = loadAssessmentHistory();
    expect(loaded.length).toBe(1);
    expect(loaded[0].sessionId).toBe('MN-2026-TEST');
    expect(loaded[0].normalizedCm).toBe(12.5);

    // Save a second record
    const mockRecord2: AssessmentRecord = {
      ...mockRecord,
      id: 'test-rec-2',
      sessionId: 'MN-2026-TEST-2',
      normalizedCm: 16.5
    };
    saveAssessmentRecord(mockRecord2);
    expect(loadAssessmentHistory().length).toBe(2);

    // Delete first record
    deleteAssessmentRecord('test-rec-1');
    const afterDelete = loadAssessmentHistory();
    expect(afterDelete.length).toBe(1);
    expect(afterDelete[0].id).toBe('test-rec-2');

    // Clear all
    clearAllAssessmentHistory();
    expect(loadAssessmentHistory()).toEqual([]);
  });

  it('handles corrupt localStorage content safely without throwing', () => {
    localStorage.setItem('manikkadai_assessment_history_v1', 'corrupt-non-json-string');
    const records = loadAssessmentHistory();
    expect(records).toEqual([]);
  });

  it('properly escapes CSV fields containing commas, quotes, and newlines', () => {
    expect(escapeCsvField('simple')).toBe('"simple"');
    expect(escapeCsvField('hello, world')).toBe('"hello, world"');
    expect(escapeCsvField('hello "quoted" world')).toBe('"hello ""quoted"" world"');
    expect(escapeCsvField('line 1\nline 2')).toBe('"line 1\nline 2"');
  });

  it('generates compliant CSV with UTF-8 BOM and preserves Tamil Unicode characters', () => {
    const csv = generateAssessmentCsv([mockRecord]);

    // Check for UTF-8 Byte Order Mark at start
    expect(csv.startsWith('\uFEFF')).toBe(true);

    // Check header presence
    expect(csv).toContain('Session ID,Timestamp (ISO),Original Input');

    // Check values
    expect(csv).toContain('"MN-2026-TEST"');
    expect(csv).toContain('"12.50"');
    expect(csv).toContain('"125.0"');

    // Check Tamil text is preserved intact
    expect(csv).toContain('அளவீடு 12.50 செ.மீ முதற்கட்ட ஆய்வு வரம்புடன் ஒத்துள்ளது.');
  });
});
