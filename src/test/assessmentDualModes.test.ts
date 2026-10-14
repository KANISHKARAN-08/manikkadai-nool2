import { describe, it, expect } from 'vitest';
import { performAssessment } from '../lib/lookupEngine';
import { generateAssessmentCsv } from '../lib/csvExport';
import { TRADITIONAL_REFERENCES } from '../data/traditionalReferences';

describe('Dual Assessment Modes & Regression Suite', () => {
  const all25Values = [
    4, 4.25, 4.5, 4.75,
    5, 5.25, 5.5, 5.75,
    6, 6.25, 6.5, 6.75,
    7, 7.25, 7.5, 7.75,
    8, 8.25, 8.5, 8.75,
    9, 9.25, 9.5, 9.75,
    10
  ];

  it('Mode A: verifies exact mapping for all 25 canonical Virarkadai inputs', () => {
    expect(all25Values.length).toBe(25);

    all25Values.forEach((val) => {
      const result = performAssessment({
        inputValue: String(val),
        inputUnit: 'virarkadai'
      });

      expect(result.status).toBe('traditional_match');
      expect(result.matchedTraditionalRecord).not.toBeNull();
      expect(result.matchedRange).toBeNull();

      // Zero metric normalization applied to traditional values
      expect(result.normalizedCm).toBeNull();
      expect(result.normalizedMm).toBeNull();

      // Matches expected record
      const rec = result.matchedTraditionalRecord!;
      expect(Math.abs(rec.numericValue - val)).toBeLessThan(0.001);
      expect(rec.tamilDescription.length).toBeGreaterThan(5);
      expect([368, 369, 371]).toContain(rec.pageNumber);
      expect(rec.transcriptionStatus).toBe('transcribed_from_source');
      expect(result.assessmentRecord).not.toBeNull();
      expect(result.assessmentRecord?.lookupStatus).toBe('traditional_match');
    });
  });

  it('Mode A: accepts fractions like 4¼, 6, 7½, 8¾, 10 and maps to canonical records', () => {
    const fractions = [
      { input: '4¼', expectedNum: 4.25, page: 371 },
      { input: '6', expectedNum: 6.0, page: 371 },
      { input: '7½', expectedNum: 7.5, page: 368 },
      { input: '8¾', expectedNum: 8.75, page: 368 },
      { input: '10', expectedNum: 10.0, page: 368 }
    ];

    fractions.forEach(({ input, expectedNum, page }) => {
      const res = performAssessment({
        inputValue: input,
        inputUnit: 'virarkadai'
      });
      expect(res.status).toBe('traditional_match');
      expect(res.matchedTraditionalRecord).not.toBeNull();
      expect(res.matchedTraditionalRecord?.numericValue).toBe(expectedNum);
      expect(res.matchedTraditionalRecord?.pageNumber).toBe(page);
    });
  });

  it('Strict Contrast Test: 10 Virarkadai returns traditional entry 10; 10 cm returns no metric range match', () => {
    // 10 Virarkadai -> Canonical Match
    const tradRes = performAssessment({
      inputValue: '10',
      inputUnit: 'virarkadai'
    });
    expect(tradRes.status).toBe('traditional_match');
    expect(tradRes.matchedTraditionalRecord).not.toBeNull();
    expect(tradRes.matchedTraditionalRecord?.displayLabel).toBe('10');
    expect(tradRes.matchedTraditionalRecord?.numericValue).toBe(10);
    expect(tradRes.matchedTraditionalRecord?.pageNumber).toBe(368);
    expect(tradRes.matchedTraditionalRecord?.tamilDescription).toContain('வாயுவினால்');
    expect(tradRes.matchedTraditionalRecord?.transcriptionStatus).toBe('transcribed_from_source');
    expect(tradRes.normalizedCm).toBeNull();
    expect(tradRes.normalizedMm).toBeNull();

    // 10 cm -> No Metric Range Match (10 cm is outside 11.9–14.3, 14.7–16.6, 17.1–19.0 cm)
    const metricRes = performAssessment({
      inputValue: '10',
      inputUnit: 'cm'
    });
    expect(metricRes.status).toBe('no_compatible_metric_reference');
    expect(metricRes.matchedRange).toBeNull();
    expect(metricRes.matchedTraditionalRecord).toBeNull();
    expect(metricRes.normalizedCm).toBe(10.00);
    expect(metricRes.normalizedMm).toBe(100.0);
    expect(metricRes.messageEn).toContain('No compatible metric reference available');
  });

  it('Mode B: normalizes mm to cm correctly and queries research ranges', () => {
    // 125 mm = 12.5 cm -> Falls into Range 1 (11.9–14.3 cm)
    const res = performAssessment({
      inputValue: '125',
      inputUnit: 'mm'
    });
    expect(res.status).toBe('metric_research_range_match');
    expect(res.normalizedCm).toBe(12.50);
    expect(res.normalizedMm).toBe(125.0);
    expect(res.matchedRange).not.toBeNull();
    expect(res.matchedRange?.minCm).toBe(11.9);
    expect(res.matchedRange?.maxCm).toBe(14.3);
    expect(res.matchedRange?.reviewStatus).toBe('pending_review');
    expect(res.matchedTraditionalRecord).toBeNull();
  });

  it('Mode B: enforces repeat discrepancy tolerance of 0.3 cm', () => {
    // Within tolerance: 15.0 cm and 15.2 cm (diff = 0.20 cm <= 0.3 cm)
    const within = performAssessment({
      inputValue: '15.0',
      inputUnit: 'cm',
      repeatValue: '15.2'
    });
    expect(within.assessmentRecord?.discrepancyDiffCm).toBe(0.20);
    expect(within.assessmentRecord?.hasDiscrepancy).toBe(false);

    // Exceeds tolerance: 15.0 cm and 15.5 cm (diff = 0.50 cm > 0.3 cm)
    const exceeded = performAssessment({
      inputValue: '15.0',
      inputUnit: 'cm',
      repeatValue: '15.5'
    });
    expect(exceeded.assessmentRecord?.discrepancyDiffCm).toBe(0.50);
    expect(exceeded.assessmentRecord?.hasDiscrepancy).toBe(true);
  });

  it('handles out-of-table Virarkadai inputs gracefully with nearest suggestions', () => {
    const res = performAssessment({
      inputValue: '3.5',
      inputUnit: 'virarkadai'
    });
    expect(res.status).toBe('traditional_no_match');
    expect(res.matchedTraditionalRecord).toBeNull();
    expect(res.nearestSuggestions).toBeDefined();
    expect(res.nearestSuggestions!.length).toBeGreaterThan(0);
    // Nearest should be 4.0
    expect(res.nearestSuggestions![0].numericValue).toBe(4);
  });

  it('updates state immediately across repeated assessments without stale values', () => {
    // 1st submission: 10 virarkadai
    const first = performAssessment({ inputValue: '10', inputUnit: 'virarkadai', sessionId: 'test-1' });
    expect(first.status).toBe('traditional_match');
    expect(first.matchedTraditionalRecord?.numericValue).toBe(10);

    // 2nd submission: 16.5 cm
    const second = performAssessment({ inputValue: '16.5', inputUnit: 'cm', sessionId: 'test-2' });
    expect(second.status).toBe('metric_research_range_match');
    expect(second.normalizedCm).toBe(16.50);
    expect(second.matchedTraditionalRecord).toBeNull();

    // 3rd submission: 11.0 cm (unmatched)
    const third = performAssessment({ inputValue: '11.0', inputUnit: 'cm', sessionId: 'test-3' });
    expect(third.status).toBe('no_compatible_metric_reference');
    expect(third.matchedRange).toBeNull();

    // 4th submission: 6 virarkadai
    const fourth = performAssessment({ inputValue: '6', inputUnit: 'virarkadai', sessionId: 'test-4' });
    expect(fourth.status).toBe('traditional_match');
    expect(fourth.matchedTraditionalRecord?.numericValue).toBe(6);
    expect(fourth.matchedTraditionalRecord?.pageNumber).toBe(371);
  });

  it('exports combined CSV with UTF-8 BOM containing both metric and virarkadai records', () => {
    const rec1 = performAssessment({ inputValue: '10', inputUnit: 'virarkadai' }).assessmentRecord!;
    const rec2 = performAssessment({ inputValue: '16.5', inputUnit: 'cm' }).assessmentRecord!;

    const csv = generateAssessmentCsv([rec1, rec2]);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('virarkadai');
    expect(csv).toContain('cm');
    expect(csv).toContain('16.50');
    expect(csv).toContain('trad-10-00');
  });
});
