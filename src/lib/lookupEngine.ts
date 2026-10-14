import { TRADITIONAL_REFERENCES } from '../data/traditionalReferences';
import { METRIC_RESEARCH_RANGES } from '../data/metricResearchRanges';
import {
  TraditionalRecord,
  MetricResearchRange,
  LookupResultType,
  AssessmentRecord,
  UnitType
} from '../types';
import {
  validateMetricInput,
  normalizeMetric,
  parseTraditionalInput,
  calculateRepeatDiscrepancy
} from './normalization';

export interface TraditionalLookupResult {
  status: 'traditional_match' | 'traditional_no_match' | 'invalid_input';
  matchedRecord: TraditionalRecord | null;
  parsedValue?: number;
  nearestSuggestions?: TraditionalRecord[];
  messageEn: string;
  messageTa: string;
}

export interface MetricAssessmentResult {
  status: LookupResultType;
  error?: string;
  originalInput: string;
  originalUnit: UnitType;
  normalizedCm: number | null;
  normalizedMm: number | null;
  parsedTraditionalValue?: number | null;
  matchedTraditionalRecord: TraditionalRecord | null;
  matchedRange: MetricResearchRange | null;
  nearestSuggestions?: TraditionalRecord[];
  assessmentRecord: AssessmentRecord | null;
  messageEn: string;
  messageTa: string;
}

/**
 * MODE A: TRADITIONAL VIRARKADAI LOOKUP
 * Exact match into the 25 canonical manuscript records.
 */
export function lookupTraditionalVirarkadai(rawInput: string | number): TraditionalLookupResult {
  const parsed = parseTraditionalInput(rawInput);
  if (!parsed.success || parsed.value === undefined) {
    return {
      status: 'invalid_input',
      matchedRecord: null,
      messageEn: parsed.error || 'Invalid traditional input format.',
      messageTa: 'செல்லுபடியாகாத விரற்கடை அளவு. 4, 4¼, 7½, 8¾ போன்ற வடிவங்களில் உள்ளிடவும்.'
    };
  }

  const targetValue = parsed.value;

  // Search by exact numeric value
  const matched = TRADITIONAL_REFERENCES.find(
    (record) => Math.abs(record.numericValue - targetValue) < 0.001
  );

  if (matched) {
    return {
      status: 'traditional_match',
      matchedRecord: matched,
      parsedValue: targetValue,
      messageEn: `Matched canonical manuscript entry for ${matched.displayLabel} virarkadai (${matched.numericValue}) from page ${matched.pageNumber}.`,
      messageTa: `நோய் நாடல் நோய் முதல் நாடல் திரட்டு ஏட்டில் பக்கம் ${matched.pageNumber}-ல் உள்ள ${matched.displayLabel} விரற்கடை (${matched.numericValue}) பதிவு வெற்றிகரமாகக் கண்டறியப்பட்டது.`
    };
  }

  // If outside supported 4 to 10 table or not a quarter-step, find nearest suggestions
  const sorted = [...TRADITIONAL_REFERENCES].sort(
    (a, b) => Math.abs(a.numericValue - targetValue) - Math.abs(b.numericValue - targetValue)
  );
  const nearest = sorted.slice(0, 3);

  return {
    status: 'traditional_no_match',
    matchedRecord: null,
    parsedValue: targetValue,
    nearestSuggestions: nearest,
    messageEn: `No authentic manuscript entry found for ${targetValue} virarkadai. The canonical table covers values strictly from 4 to 10 in ¼ increments.`,
    messageTa: `${targetValue} விரற்கடைக்குரிய மூல நூல் குறிப்பு ஏட்டில் இல்லை. மூல ஏட்டின் அட்டவணை 4 முதல் 10 வரை ¼ இடைவெளிகளில் உள்ள 25 அளவுகளை மட்டுமே கொண்டுள்ளது.`
  };
}

/**
 * UNIFIED ASSESSMENT COORDINATOR
 * Handles two distinct modes cleanly without conflating units:
 * - Mode A: Traditional Virarkadai -> exact lookup into canonical 25-record dataset.
 *           Zero centimetre/millimetre conversions are applied.
 * - Mode B: Physical Metric (cm or mm) -> strict numeric normalization and lookup
 *           against explicitly configured provisional research ranges.
 *           Zero traditional lookup is applied to cm/mm values.
 */
export function performAssessment(params: {
  inputValue: string | number;
  inputUnit: UnitType;
  repeatValue?: string | number;
  notes?: string;
  sessionId?: string;
}): MetricAssessmentResult {
  const { inputValue, inputUnit, repeatValue, notes, sessionId } = params;
  const rawInputStr = String(inputValue ?? '').trim();

  const sid = sessionId && sessionId.trim() !== ''
    ? sessionId.trim()
    : `MN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // =========================================================================
  // MODE A: TRADITIONAL VIRARKADAI UNIT
  // =========================================================================
  if (inputUnit === 'virarkadai') {
    const parsed = parseTraditionalInput(rawInputStr);
    if (!parsed.success || parsed.value === undefined) {
      const errorMsg = parsed.error || 'Please enter a valid traditional Virarkadai value (e.g. 4, 4¼, 7½, 8¾, 10).';
      return {
        status: 'invalid_input',
        error: errorMsg,
        originalInput: rawInputStr,
        originalUnit: 'virarkadai',
        normalizedCm: null,
        normalizedMm: null,
        parsedTraditionalValue: null,
        matchedTraditionalRecord: null,
        matchedRange: null,
        assessmentRecord: null,
        messageEn: errorMsg,
        messageTa: 'செல்லுபடியாகாத விரற்கடை அளவு. 4, 4¼, 7½, 8¾, 10 போன்ற வடிவங்களில் உள்ளிடவும்.'
      };
    }

    const targetVal = parsed.value;

    // Search exact canonical 25 records
    const matchedRecord = TRADITIONAL_REFERENCES.find(
      (r) => Math.abs(r.numericValue - targetVal) < 0.001
    ) || null;

    // Handle repeat reading for Virarkadai if provided
    let repeatParsedVal: number | null = null;
    let hasDiscrepancy = false;
    let discrepancyDiff: number | null = null;

    if (repeatValue !== undefined && String(repeatValue).trim() !== '') {
      const repParsed = parseTraditionalInput(String(repeatValue).trim());
      if (repParsed.success && repParsed.value !== undefined) {
        repeatParsedVal = repParsed.value;
        discrepancyDiff = Number(Math.abs(targetVal - repeatParsedVal).toFixed(2));
        hasDiscrepancy = discrepancyDiff > 0.25; // > ¼ viralai tolerance
      }
    }

    let nearest: TraditionalRecord[] | undefined = undefined;
    let resultStatus: LookupResultType;
    let messageEn: string;
    let messageTa: string;

    if (matchedRecord) {
      resultStatus = 'traditional_match';
      messageEn = `Matched canonical manuscript record for ${matchedRecord.displayLabel} virarkadai (${matchedRecord.numericValue}) from page ${matchedRecord.pageNumber}.`;
      messageTa = `நோய் நாடல் நோய் முதல் நாடல் திரட்டு மூல ஏட்டில் பக்கம் ${matchedRecord.pageNumber}-ல் உள்ள ${matchedRecord.displayLabel} விரற்கடை (${matchedRecord.numericValue}) பதிவு வெற்றிகரமாகக் கண்டறியப்பட்டது.`;
    } else {
      resultStatus = 'traditional_no_match';
      const sorted = [...TRADITIONAL_REFERENCES].sort(
        (a, b) => Math.abs(a.numericValue - targetVal) - Math.abs(b.numericValue - targetVal)
      );
      nearest = sorted.slice(0, 3);
      messageEn = `No authentic manuscript entry found for ${targetVal} virarkadai. The canonical table covers values strictly from 4 to 10 in ¼ increments.`;
      messageTa = `${targetVal} விரற்கடைக்குரிய மூல நூல் குறிப்பு ஏட்டில் இல்லை. மூல ஏட்டின் அட்டவணை 4 முதல் 10 வரை ¼ இடைவெளிகளில் உள்ள 25 அளவுகளை மட்டுமே கொண்டுள்ளது.`;
    }

    const record: AssessmentRecord = {
      id: `assess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId: sid,
      timestamp: new Date().toISOString(),
      originalInput: rawInputStr,
      originalUnit: 'virarkadai',
      normalizedCm: null,
      normalizedMm: null,
      repeatInput: repeatValue !== undefined && String(repeatValue).trim() !== '' ? String(repeatValue).trim() : undefined,
      repeatNormalizedCm: null,
      repeatNormalizedMm: null,
      discrepancyDiffCm: discrepancyDiff,
      hasDiscrepancy,
      toleranceThresholdCm: 0.25,
      lookupStatus: resultStatus,
      matchedTraditionalRecord: matchedRecord,
      matchedMetricRange: null,
      reviewStatus: matchedRecord ? matchedRecord.transcriptionStatus : 'unmatched',
      notes: notes && notes.trim() !== '' ? notes.trim() : undefined,
      summaryMessageEn: messageEn,
      summaryMessageTa: messageTa
    };

    return {
      status: resultStatus,
      originalInput: rawInputStr,
      originalUnit: 'virarkadai',
      normalizedCm: null,
      normalizedMm: null,
      parsedTraditionalValue: targetVal,
      matchedTraditionalRecord: matchedRecord,
      matchedRange: null,
      nearestSuggestions: nearest,
      assessmentRecord: record,
      messageEn,
      messageTa
    };
  }

  // =========================================================================
  // MODE B: PHYSICAL METRIC ASSESSMENT (cm or mm)
  // =========================================================================
  const metricUnit: 'cm' | 'mm' = inputUnit === 'mm' ? 'mm' : 'cm';

  // 1. Strict input validation
  const validation = validateMetricInput(rawInputStr, metricUnit);
  if (!validation.isValid || validation.parsedNumber === undefined) {
    const errorMsg = validation.error || 'Invalid metric input.';
    return {
      status: 'invalid_input',
      error: errorMsg,
      originalInput: rawInputStr,
      originalUnit: metricUnit,
      normalizedCm: null,
      normalizedMm: null,
      parsedTraditionalValue: null,
      matchedTraditionalRecord: null,
      matchedRange: null,
      assessmentRecord: null,
      messageEn: errorMsg,
      messageTa: validation.error || 'செல்லுபடியாகாத அளவீட்டு உள்ளீடு.'
    };
  }

  const primaryNum = validation.parsedNumber;
  const normalized = normalizeMetric(primaryNum, metricUnit);

  // 2. Repeat reading validation if provided
  let repeatNum: number | undefined = undefined;
  let repeatNormCm: number | null = null;
  let repeatNormMm: number | null = null;

  if (repeatValue !== undefined && String(repeatValue).trim() !== '') {
    const repeatVal = validateMetricInput(String(repeatValue).trim(), metricUnit);
    if (repeatVal.isValid && repeatVal.parsedNumber !== undefined) {
      repeatNum = repeatVal.parsedNumber;
      const rNorm = normalizeMetric(repeatNum, metricUnit);
      repeatNormCm = rNorm.cm;
      repeatNormMm = rNorm.mm;
    }
  }

  // 3. Discrepancy calculation (tolerance: 0.3 cm)
  const discrepancy = calculateRepeatDiscrepancy(primaryNum, repeatNum, metricUnit, 0.3);

  // 4. Research range query (using normalized cm with inclusive bounds)
  // Do NOT query traditional records for cm/mm values!
  const measuredCm = normalized.cm;
  const matchedRange = METRIC_RESEARCH_RANGES.find(
    (range) => measuredCm >= (range.minCm - 0.0001) && measuredCm <= (range.maxCm + 0.0001)
  ) || null;

  const resultStatus: LookupResultType = matchedRange
    ? 'metric_research_range_match'
    : 'no_compatible_metric_reference';

  const messageEn = matchedRange
    ? `Measurement ${normalized.formattedCm} falls within provisional research range [${matchedRange.minCm}–${matchedRange.maxCm} cm] (Status: Pending Review).`
    : `Measurement recorded: ${normalized.formattedCm} (${normalized.formattedMm}). No compatible metric reference available in the provisional research dataset.`;

  const messageTa = matchedRange
    ? `அளவீடு ${normalized.formattedCm} முதற்கட்ட ஆய்வு வரம்பான [${matchedRange.minCm}–${matchedRange.maxCm} செ.மீ] உடன் ஒத்துள்ளது (மறுஆய்வு நிலை: ஆய்வுக்குரியது).`
    : `அளவீடு பதிவு செய்யப்பட்டது: ${normalized.formattedCm} (${normalized.formattedMm}). தற்போதைய ஆய்வுத் தொகுப்பில் இதற்கு இணையான ஆய்வு வரம்பு இல்லை.`;

  const record: AssessmentRecord = {
    id: `assess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sessionId: sid,
    timestamp: new Date().toISOString(),
    originalInput: rawInputStr,
    originalUnit: metricUnit,
    normalizedCm: normalized.cm,
    normalizedMm: normalized.mm,
    repeatInput: repeatValue !== undefined && String(repeatValue).trim() !== '' ? String(repeatValue).trim() : undefined,
    repeatNormalizedCm: repeatNormCm,
    repeatNormalizedMm: repeatNormMm,
    discrepancyDiffCm: discrepancy.hasRepeat ? discrepancy.diffCm : null,
    hasDiscrepancy: discrepancy.hasRepeat ? discrepancy.hasDiscrepancy : false,
    toleranceThresholdCm: 0.3,
    lookupStatus: resultStatus,
    matchedTraditionalRecord: null,
    matchedMetricRange: matchedRange,
    reviewStatus: matchedRange ? matchedRange.reviewStatus : 'unmatched',
    notes: notes && notes.trim() !== '' ? notes.trim() : undefined,
    summaryMessageEn: messageEn,
    summaryMessageTa: messageTa
  };

  return {
    status: resultStatus,
    originalInput: rawInputStr,
    originalUnit: metricUnit,
    normalizedCm: normalized.cm,
    normalizedMm: normalized.mm,
    parsedTraditionalValue: null,
    matchedTraditionalRecord: null,
    matchedRange,
    assessmentRecord: record,
    messageEn,
    messageTa
  };
}

/**
 * Backward compatibility wrapper for callers of performMetricAssessment
 */
export function performMetricAssessment(params: {
  inputValue: string | number;
  inputUnit: 'cm' | 'mm';
  repeatValue?: string | number;
  notes?: string;
  sessionId?: string;
}): MetricAssessmentResult {
  return performAssessment(params);
}
