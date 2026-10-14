import { describe, it, expect } from 'vitest';
import {
  TRADITIONAL_REFERENCES,
  validateTraditionalDatasetIntegrity
} from '../data/traditionalReferences';
import { lookupTraditionalVirarkadai } from '../lib/lookupEngine';

describe('Canonical Traditional Reference Dataset Integrity', () => {
  it('passes the runtime dataset integrity validator', () => {
    const result = validateTraditionalDatasetIntegrity();
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('contains exactly 25 canonical records', () => {
    expect(TRADITIONAL_REFERENCES.length).toBe(25);
  });

  it('has 25 unique stable IDs', () => {
    const ids = TRADITIONAL_REFERENCES.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(25);
  });

  it('has 25 unique numeric values from 4.0 to 10.0 advancing in 0.25 increments', () => {
    const values = TRADITIONAL_REFERENCES.map((r) => r.numericValue);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(25);

    for (let v = 4.0; v <= 10.0; v += 0.25) {
      const rounded = Math.round(v * 100) / 100;
      expect(uniqueValues.has(rounded)).toBe(true);
    }
  });

  it('every record has unit "virarkadai" and printed page in [368, 369, 371]', () => {
    for (const record of TRADITIONAL_REFERENCES) {
      expect(record.unit).toBe('virarkadai');
      expect([368, 369, 371]).toContain(record.pageNumber);
      expect(record.tamilDescription.trim().length).toBeGreaterThan(5);
      expect(record.sourceTitle).toBe('நோய் நாடல் நோய் முதல் நாடல் திரட்டு');
      expect(record.partVolume).toBe('பாகம் 1');
      expect(record.transcriptionStatus).toBe('transcribed_from_source');
    }
  });

  it('supports exact lookup for all 25 values and aliases', () => {
    const testCases: { input: string | number; expectedValue: number; expectedId: string }[] = [
      { input: '10', expectedValue: 10, expectedId: 'trad-10-00' },
      { input: '9 ¾', expectedValue: 9.75, expectedId: 'trad-09-75' },
      { input: '9.75', expectedValue: 9.75, expectedId: 'trad-09-75' },
      { input: '9 3/4', expectedValue: 9.75, expectedId: 'trad-09-75' },
      { input: '9½', expectedValue: 9.5, expectedId: 'trad-09-50' },
      { input: '9.5', expectedValue: 9.5, expectedId: 'trad-09-50' },
      { input: '9 ¼', expectedValue: 9.25, expectedId: 'trad-09-25' },
      { input: '9', expectedValue: 9, expectedId: 'trad-09-00' },
      { input: '8 ¾', expectedValue: 8.75, expectedId: 'trad-08-75' },
      { input: '8.75', expectedValue: 8.75, expectedId: 'trad-08-75' },
      { input: '8 ½', expectedValue: 8.5, expectedId: 'trad-08-50' },
      { input: '8 ¼', expectedValue: 8.25, expectedId: 'trad-08-25' },
      { input: '8', expectedValue: 8, expectedId: 'trad-08-00' },
      { input: '7 ¾', expectedValue: 7.75, expectedId: 'trad-07-75' },
      { input: '7 ½', expectedValue: 7.5, expectedId: 'trad-07-50' },
      { input: '7.5', expectedValue: 7.5, expectedId: 'trad-07-50' },
      { input: '7 ¼', expectedValue: 7.25, expectedId: 'trad-07-25' },
      { input: '7', expectedValue: 7, expectedId: 'trad-07-00' },
      { input: '6 ¾', expectedValue: 6.75, expectedId: 'trad-06-75' },
      { input: '6 ½', expectedValue: 6.5, expectedId: 'trad-06-50' },
      { input: '6 ¼', expectedValue: 6.25, expectedId: 'trad-06-25' },
      { input: '6', expectedValue: 6, expectedId: 'trad-06-00' },
      { input: '5 ¾', expectedValue: 5.75, expectedId: 'trad-05-75' },
      { input: '5 ½', expectedValue: 5.5, expectedId: 'trad-05-50' },
      { input: '5 ¼', expectedValue: 5.25, expectedId: 'trad-05-25' },
      { input: '5', expectedValue: 5, expectedId: 'trad-05-00' },
      { input: '4 ¾', expectedValue: 4.75, expectedId: 'trad-04-75' },
      { input: '4 ½', expectedValue: 4.5, expectedId: 'trad-04-50' },
      { input: '4 ¼', expectedValue: 4.25, expectedId: 'trad-04-25' },
      { input: '4', expectedValue: 4, expectedId: 'trad-04-00' },
    ];

    for (const tc of testCases) {
      const res = lookupTraditionalVirarkadai(tc.input);
      expect(res.status).toBe('traditional_match');
      expect(res.matchedRecord).not.toBeNull();
      expect(res.matchedRecord?.id).toBe(tc.expectedId);
      expect(res.matchedRecord?.numericValue).toBe(tc.expectedValue);
    }
  });

  it('handles unmatched values outside 4 to 10 with suggestions and no crash', () => {
    const res = lookupTraditionalVirarkadai('3.5');
    expect(res.status).toBe('traditional_no_match');
    expect(res.matchedRecord).toBeNull();
    expect(res.nearestSuggestions?.length).toBeGreaterThan(0);
    expect(res.nearestSuggestions?.[0].numericValue).toBe(4.0);
  });
});
