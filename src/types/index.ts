export type UnitType = 'cm' | 'mm' | 'virarkadai';

export type TranscriptionStatus = 'transcribed_from_source' | 'verified' | 'needs_review';

export type ReferenceCategory = 'disease_manifestation' | 'critical_prognosis';

export interface TraditionalVerse {
  tamilTitle: string;
  tamilLines: string[];
  context: string;
}

export interface TraditionalRecord {
  id: string;
  numericValue: number;
  displayLabel: string;
  unit: 'virarkadai';
  aliases: string[];
  tamilDescription: string;
  englishTranslation: string;
  sourceTitle: string;
  partVolume: string;
  pageNumber: number;
  category: ReferenceCategory;
  transcriptionStatus: TranscriptionStatus;
  sourceNotes: string;
  verse?: TraditionalVerse;
}

export type ReviewStatus = 'pending_review' | 'provisional_research' | 'verified';

export interface MetricResearchRange {
  id: string;
  minCm: number;
  maxCm: number;
  unit: 'cm';
  sourceTitle: string;
  authors: string;
  publication: string;
  publicationYear: number;
  doi: string | null;
  reviewStatus: ReviewStatus;
  provisionalInterpretation: {
    en: string;
    ta: string;
  };
  disclaimer: {
    en: string;
    ta: string;
  };
}

export type LookupResultType =
  | 'traditional_match'
  | 'metric_research_range_match'
  | 'no_compatible_metric_reference'
  | 'traditional_no_match'
  | 'invalid_input'
  | 'data_integrity_error';

export interface AssessmentRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  originalInput: string;
  originalUnit: UnitType;
  normalizedCm: number | null;
  normalizedMm: number | null;
  repeatInput?: string;
  repeatNormalizedCm?: number | null;
  repeatNormalizedMm?: number | null;
  discrepancyDiffCm?: number | null;
  hasDiscrepancy?: boolean;
  toleranceThresholdCm: number;
  lookupStatus: LookupResultType;
  matchedTraditionalRecord?: TraditionalRecord | null;
  matchedMetricRange?: MetricResearchRange | null;
  reviewStatus: string;
  notes?: string;
  summaryMessageEn: string;
  summaryMessageTa: string;
}

export type Language = 'en' | 'ta';
