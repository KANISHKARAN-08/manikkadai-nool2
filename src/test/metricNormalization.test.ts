import { describe, it, expect } from 'vitest';
import {
  normalizeMetric,
  calculateRepeatDiscrepancy
} from '../lib/normalization';

describe('Metric Normalization Engine', () => {
  it('correctly normalizes centimeters to millimeters', () => {
    // 6 cm -> 60 mm
    const r1 = normalizeMetric(6, 'cm');
    expect(r1.cm).toBe(6.0);
    expect(r1.mm).toBe(60.0);
    expect(r1.formattedCm).toBe('6.00 cm');
    expect(r1.formattedMm).toBe('60.0 mm');

    // 7 cm -> 70 mm
    const r2 = normalizeMetric(7, 'cm');
    expect(r2.cm).toBe(7.0);
    expect(r2.mm).toBe(70.0);

    // 12 cm -> 120 mm
    const r3 = normalizeMetric(12, 'cm');
    expect(r3.cm).toBe(12.0);
    expect(r3.mm).toBe(120.0);

    // 12.5 cm -> 125 mm
    const r4 = normalizeMetric(12.5, 'cm');
    expect(r4.cm).toBe(12.5);
    expect(r4.mm).toBe(125.0);

    // 16.5 cm -> 165 mm
    const r5 = normalizeMetric(16.5, 'cm');
    expect(r5.cm).toBe(16.5);
    expect(r5.mm).toBe(165.0);
  });

  it('correctly normalizes millimeters to centimeters', () => {
    // 70 mm -> 7 cm
    const r1 = normalizeMetric(70, 'mm');
    expect(r1.cm).toBe(7.0);
    expect(r1.mm).toBe(70.0);

    // 120 mm -> 12 cm
    const r2 = normalizeMetric(120, 'mm');
    expect(r2.cm).toBe(12.0);
    expect(r2.mm).toBe(120.0);

    // 125 mm -> 12.5 cm
    const r3 = normalizeMetric(125, 'mm');
    expect(r3.cm).toBe(12.5);
    expect(r3.mm).toBe(125.0);
  });

  it('correctly evaluates repeat measurement discrepancy', () => {
    // Within tolerance (diff: 0.1 cm <= 0.3 cm)
    const d1 = calculateRepeatDiscrepancy(12.5, 12.6, 'cm', 0.3);
    expect(d1.hasRepeat).toBe(true);
    expect(d1.diffCm).toBe(0.1);
    expect(d1.hasDiscrepancy).toBe(false);

    // Exceeds tolerance (diff: 0.5 cm > 0.3 cm)
    const d2 = calculateRepeatDiscrepancy(12.5, 13.0, 'cm', 0.3);
    expect(d2.hasRepeat).toBe(true);
    expect(d2.diffCm).toBe(0.5);
    expect(d2.hasDiscrepancy).toBe(true);

    // No repeat reading entered
    const d3 = calculateRepeatDiscrepancy(12.5, undefined, 'cm', 0.3);
    expect(d3.hasRepeat).toBe(false);
    expect(d3.hasDiscrepancy).toBe(false);
  });
});
