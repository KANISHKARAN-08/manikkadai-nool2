import { UnitType } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  parsedNumber?: number;
}

export interface MetricNormalizationResult {
  cm: number;
  mm: number;
  formattedCm: string;
  formattedMm: string;
}

/**
 * Validates a string or number input for strict numeric metric compliance.
 * Rejects trailing non-numeric characters (e.g. '16.5abc'), negatives, NaN, and empty inputs.
 */
export function validateMetricInput(rawInput: string | number, unit: UnitType): ValidationResult {
  if (rawInput === undefined || rawInput === null) {
    return { isValid: false, error: 'Measurement input is required.' };
  }

  const str = String(rawInput).trim();
  if (str === '') {
    return { isValid: false, error: 'Please enter a wrist circumference value.' };
  }

  // Regex for strict positive decimal or integer number (no trailing letters, no negative sign)
  const strictNumericRegex = /^\d+(\.\d+)?$/;
  if (!strictNumericRegex.test(str)) {
    return {
      isValid: false,
      error: `Invalid numeric format "${str}". Please enter a positive number without letters or symbols.`
    };
  }

  const num = Number(str);
  if (!Number.isFinite(num) || isNaN(num)) {
    return { isValid: false, error: 'Input is not a valid finite number.' };
  }

  if (num <= 0) {
    return { isValid: false, error: 'Measurement must be greater than zero.' };
  }

  // Plausible physiological boundaries for human wrist circumference:
  // In cm: 5 cm to 35 cm (or 50 mm to 350 mm)
  if (unit === 'cm') {
    if (num < 4.0 || num > 35.0) {
      return {
        isValid: false,
        error: `Value ${num} cm is outside plausible anatomical range (4.0 cm to 35.0 cm).`
      };
    }
  } else if (unit === 'mm') {
    if (num < 40.0 || num > 350.0) {
      return {
        isValid: false,
        error: `Value ${num} mm is outside plausible anatomical range (40 mm to 350 mm).`
      };
    }
  }

  return { isValid: true, parsedNumber: num };
}

/**
 * Normalizes valid metric input in cm or mm to dual cm and mm representations.
 * Handles precision cleanly without floating-point artifacts.
 */
export function normalizeMetric(value: number, unit: 'cm' | 'mm'): MetricNormalizationResult {
  let cm: number;
  let mm: number;

  if (unit === 'cm') {
    cm = Number(value.toFixed(2));
    mm = Number((value * 10).toFixed(1));
  } else {
    mm = Number(value.toFixed(1));
    cm = Number((value / 10).toFixed(2));
  }

  return {
    cm,
    mm,
    formattedCm: `${cm.toFixed(2)} cm`,
    formattedMm: `${mm.toFixed(1)} mm`
  };
}

/**
 * Parses traditional Virarkadai input which can be in various formats:
 * '4', '4.25', '4¼', '4 1/4', '7½', '8¾', '8.75', etc.
 */
export function parseTraditionalInput(input: string | number): {
  success: boolean;
  value?: number;
  normalizedLabel?: string;
  error?: string;
} {
  if (input === undefined || input === null) {
    return { success: false, error: 'Traditional measurement input required.' };
  }

  let str = String(input).trim();
  if (str === '') {
    return { success: false, error: 'Input cannot be empty.' };
  }

  // Strip optional unit words
  str = str
    .replace(/(virarkadai|viralai|விரற்கடை|விரல்)/gi, '')
    .replace(/¼/g, ' 1/4')
    .replace(/½/g, ' 1/2')
    .replace(/¾/g, ' 3/4')
    .replace(/\s+/g, ' ')
    .trim();

  const getLabel = (v: number): string => {
    const whole = Math.floor(v);
    const frac = Math.round((v - whole) * 100);
    if (frac === 25) return whole > 0 ? `${whole} ¼` : '¼';
    if (frac === 50) return whole > 0 ? `${whole} ½` : '½';
    if (frac === 75) return whole > 0 ? `${whole} ¾` : '¾';
    return `${v}`;
  };

  // Pattern 1: Simple decimal or integer (e.g. '7', '7.5', '8.75', '10')
  if (/^\d+(\.\d+)?$/.test(str)) {
    const val = Number(str);
    const rounded = Math.round(val * 100) / 100;
    return { success: true, value: rounded, normalizedLabel: getLabel(rounded) };
  }

  // Pattern 2: Mixed fraction like '7 1/2' or '8 3/4' or '4 1/4'
  const mixedMatch = str.match(/^(\d+)\s+([13])\/([24])$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    const fractionVal = num / den;
    const total = Math.round((whole + fractionVal) * 100) / 100;
    return { success: true, value: total, normalizedLabel: getLabel(total) };
  }

  // Pattern 3: Pure fraction like '1/2' (though traditional table is 4 to 10)
  const fracMatch = str.match(/^([13])\/([24])$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    const val = Math.round((num / den) * 100) / 100;
    return { success: true, value: val, normalizedLabel: getLabel(val) };
  }

  return {
    success: false,
    error: `Could not parse traditional value "${input}". Expected format like 4, 4¼, 4.25, 7½, 8¾.`
  };
}

/**
 * Checks discrepancy between a primary measurement and a repeat reading.
 * Threshold defaults to 0.3 cm (or 3 mm).
 */
export function calculateRepeatDiscrepancy(
  reading1: number,
  reading2: number | undefined,
  unit: UnitType,
  thresholdCm: number = 0.3
): {
  hasRepeat: boolean;
  diffCm: number;
  hasDiscrepancy: boolean;
  statusText: string;
} {
  if (reading2 === undefined || isNaN(reading2) || reading2 <= 0) {
    return {
      hasRepeat: false,
      diffCm: 0,
      hasDiscrepancy: false,
      statusText: 'No repeat reading provided'
    };
  }

  const reading1Cm = unit === 'mm' ? reading1 / 10 : reading1;
  const reading2Cm = unit === 'mm' ? reading2 / 10 : reading2;

  const diffCm = Math.abs(reading1Cm - reading2Cm);
  const roundedDiff = Number(diffCm.toFixed(2));
  const hasDiscrepancy = roundedDiff > thresholdCm;

  return {
    hasRepeat: true,
    diffCm: roundedDiff,
    hasDiscrepancy,
    statusText: hasDiscrepancy
      ? `Discrepancy of ${roundedDiff} cm exceeds tolerance (${thresholdCm} cm). Consider repeating measurement.`
      : `Discrepancy of ${roundedDiff} cm is within clinical tolerance (${thresholdCm} cm).`
  };
}
