import { AssessmentRecord } from '../types';

const STORAGE_KEY = 'manikkadai_assessment_history_v1';

/**
 * Validates whether an unknown parsed JSON object conforms to AssessmentRecord.
 */
function isValidAssessmentRecord(obj: any): obj is AssessmentRecord {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.sessionId === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.originalInput === 'string' &&
    (obj.originalUnit === 'cm' || obj.originalUnit === 'mm' || obj.originalUnit === 'virarkadai') &&
    (obj.normalizedCm === null || typeof obj.normalizedCm === 'number') &&
    typeof obj.lookupStatus === 'string'
  );
}

/**
 * Loads all stored assessments from localStorage with safe fallback.
 */
export function loadAssessmentHistory(): AssessmentRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Corrupt assessment history format in localStorage. Resetting storage.');
      return [];
    }

    // Filter valid records only
    const validRecords = parsed.filter(isValidAssessmentRecord);
    return validRecords;
  } catch (err) {
    console.error('Failed to parse assessment history from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new assessment to local history (prepends to beginning).
 */
export function saveAssessmentRecord(record: AssessmentRecord): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const existing = loadAssessmentHistory();
    // Prevent duplicate saves of identical record ID
    const updated = [record, ...existing.filter((item) => item.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save assessment record to localStorage:', err);
    return false;
  }
}

/**
 * Deletes a single record by its ID.
 */
export function deleteAssessmentRecord(id: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const existing = loadAssessmentHistory();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete assessment record:', err);
    return false;
  }
}

/**
 * Clears the entire assessment history.
 */
export function clearAllAssessmentHistory(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear assessment history:', err);
    return false;
  }
}
