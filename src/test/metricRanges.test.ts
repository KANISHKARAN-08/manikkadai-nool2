import { describe, it, expect } from 'vitest';
import { performMetricAssessment } from '../lib/lookupEngine';

describe('Metric Research Range Boundary and Gap Matrix', () => {
  it('correctly matches and distinguishes all specified test boundary points and gaps', () => {
    const matrix: {
      input: number;
      unit: 'cm';
      expectedStatus: 'metric_research_range_match' | 'no_compatible_metric_reference';
      expectedRangeId?: string;
    }[] = [
      { input: 11, unit: 'cm', expectedStatus: 'no_compatible_metric_reference' },
      { input: 11.8, unit: 'cm', expectedStatus: 'no_compatible_metric_reference' },
      { input: 11.9, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-low' },
      { input: 12, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-low' },
      { input: 12.5, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-low' },
      { input: 13, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-low' },
      { input: 14.3, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-low' },
      { input: 14.5, unit: 'cm', expectedStatus: 'no_compatible_metric_reference' }, // gap between 14.3 and 14.7
      { input: 14.7, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-mid' },
      { input: 16.5, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-mid' },
      { input: 16.6, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-mid' },
      { input: 17.1, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-high' },
      { input: 18, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-high' },
      { input: 19, unit: 'cm', expectedStatus: 'metric_research_range_match', expectedRangeId: 'metric-range-high' },
    ];

    for (const testCase of matrix) {
      const result = performMetricAssessment({
        inputValue: testCase.input,
        inputUnit: testCase.unit
      });

      expect(result.status).toBe(testCase.expectedStatus);
      if (testCase.expectedRangeId) {
        expect(result.matchedRange?.id).toBe(testCase.expectedRangeId);
        expect(result.matchedRange?.reviewStatus).toBe('pending_review');
        expect(result.assessmentRecord?.reviewStatus).toBe('pending_review');
      } else {
        expect(result.matchedRange).toBeNull();
      }

      // Valid inputs must always yield an assessment record and formatted normalization
      expect(result.assessmentRecord).not.toBeNull();
      expect(result.normalizedCm).toBe(testCase.input);
      expect(result.normalizedMm).toBe(Number((testCase.input * 10).toFixed(1)));
    }
  });

  it('correctly handles inputs provided in millimeters corresponding to research ranges', () => {
    // 125 mm = 12.5 cm -> metric-range-low
    const r1 = performMetricAssessment({ inputValue: 125, inputUnit: 'mm' });
    expect(r1.status).toBe('metric_research_range_match');
    expect(r1.matchedRange?.id).toBe('metric-range-low');
    expect(r1.normalizedCm).toBe(12.5);
    expect(r1.normalizedMm).toBe(125.0);

    // 165 mm = 16.5 cm -> metric-range-mid
    const r2 = performMetricAssessment({ inputValue: 165, inputUnit: 'mm' });
    expect(r2.status).toBe('metric_research_range_match');
    expect(r2.matchedRange?.id).toBe('metric-range-mid');
    expect(r2.normalizedCm).toBe(16.5);
    expect(r2.normalizedMm).toBe(165.0);

    // 110 mm = 11.0 cm -> no compatible metric reference
    const r3 = performMetricAssessment({ inputValue: 110, inputUnit: 'mm' });
    expect(r3.status).toBe('no_compatible_metric_reference');
    expect(r3.matchedRange).toBeNull();
    expect(r3.normalizedCm).toBe(11.0);
  });
});
