import { describe, it, expect } from 'vitest';
import { validateMetricInput, parseTraditionalInput } from '../lib/normalization';
import { performMetricAssessment } from '../lib/lookupEngine';

describe('Strict Input Validation Suite', () => {
  it('rejects invalid, trailing-alpha, empty, or negative inputs in metric assessment', () => {
    const invalidInputs = [
      'abc',
      '16.5abc',
      '',
      '   ',
      '-5',
      '-12.5',
      '12..5',
      '--12',
      '12,5', // commas not allowed in strict numeric mode
      'NaN',
      'Infinity'
    ];

    for (const bad of invalidInputs) {
      const valRes = validateMetricInput(bad, 'cm');
      expect(valRes.isValid).toBe(false);
      expect(valRes.error).toBeDefined();

      const assessRes = performMetricAssessment({
        inputValue: bad,
        inputUnit: 'cm'
      });
      expect(assessRes.status).toBe('invalid_input');
      expect(assessRes.assessmentRecord).toBeNull();
      expect(assessRes.error).toBeDefined();
    }
  });

  it('rejects biologically implausible wrist circumference values', () => {
    // Under 4 cm
    const tooLow = validateMetricInput(2.5, 'cm');
    expect(tooLow.isValid).toBe(false);
    expect(tooLow.error).toContain('outside plausible anatomical range');

    // Over 35 cm
    const tooHigh = validateMetricInput(45, 'cm');
    expect(tooHigh.isValid).toBe(false);
    expect(tooHigh.error).toContain('outside plausible anatomical range');
  });

  it('validates traditional Virarkadai input parsing strictly', () => {
    // Valid formats
    expect(parseTraditionalInput('4').success).toBe(true);
    expect(parseTraditionalInput('4¼').success).toBe(true);
    expect(parseTraditionalInput('4 1/4').success).toBe(true);
    expect(parseTraditionalInput('7½').success).toBe(true);
    expect(parseTraditionalInput('8¾').success).toBe(true);
    expect(parseTraditionalInput('10').success).toBe(true);

    // Invalid formats
    expect(parseTraditionalInput('').success).toBe(false);
    expect(parseTraditionalInput('xyz').success).toBe(false);
    expect(parseTraditionalInput('7/invalid').success).toBe(false);
  });
});
