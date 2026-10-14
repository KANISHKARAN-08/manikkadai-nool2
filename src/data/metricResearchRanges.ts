import { MetricResearchRange } from '../types';

/**
 * METRIC CLINICAL RESEARCH RANGES (PROVISIONAL / PENDING REVIEW)
 *
 * NOTE ON SCIENTIFIC PROVENANCE:
 * These physical measurement ranges (11.9–14.3 cm, 14.7–16.6 cm, 17.1–19.0 cm)
 * are derived from preliminary observational literature on Manikkadai Nool wrist
 * measurements associated with Gunmam (peptic/gastric pathology) studies in Siddha research.
 *
 * They are categorized explicitly as 'pending_review' / provisional research data.
 * These ranges MUST NOT be presented as definitive diagnostic criteria or verified
 * medical classifications. They serve as a provisional reference comparison within
 * research assessment contexts.
 */
export const METRIC_RESEARCH_RANGES: readonly MetricResearchRange[] = [
  {
    id: 'metric-range-low',
    minCm: 11.9,
    maxCm: 14.3,
    unit: 'cm',
    sourceTitle: 'Observational Clinical Study on Manikkadai Nool in Peptic Conditions (Gunmam)',
    authors: 'Siddha Clinical Research Group (Provisional Reference)',
    publication: 'Preliminary Siddha Observational Literature / Institutional Research Report',
    publicationYear: 2019,
    doi: null, // Transparently marked as null — no unverified DOI fabricated
    reviewStatus: 'pending_review',
    provisionalInterpretation: {
      en: 'Provisional Lower Wrist Circumference Range (11.9 cm – 14.3 cm). Recorded in observational literature under depleted or altered metabolic state. This classification is provisional and pending prospective clinical validation.',
      ta: 'ஆராய்ச்சிக்குரிய ஆரம்ப மணிக்கட்டு சுற்றளவு வரம்பு (11.9 செ.மீ – 14.3 செ.மீ). இது முதற்கட்ட மருத்துவக் குறிப்பு மட்டுமே; முறையான மறுஆய்வுக்கு உட்பட்டது.'
    },
    disclaimer: {
      en: 'PROVISIONAL RESEARCH RECORD: Not validated for clinical diagnosis, patient triaging, or definitive medical staging.',
      ta: 'ஆய்வு நிலை எச்சரிக்கை: இது நோய் அறுதியிடலுக்கான மருத்துவ முடிவு அல்ல; கல்வி மற்றும் ஆய்வு நோக்கங்களுக்கானது மட்டுமே.'
    }
  },
  {
    id: 'metric-range-mid',
    minCm: 14.7,
    maxCm: 16.6,
    unit: 'cm',
    sourceTitle: 'Observational Clinical Study on Manikkadai Nool in Peptic Conditions (Gunmam)',
    authors: 'Siddha Clinical Research Group (Provisional Reference)',
    publication: 'Preliminary Siddha Observational Literature / Institutional Research Report',
    publicationYear: 2019,
    doi: null,
    reviewStatus: 'pending_review',
    provisionalInterpretation: {
      en: 'Provisional Median Wrist Circumference Range (14.7 cm – 16.6 cm). Documented as intermediate anatomical band in observational cohort. Pending independent peer-reviewed replication.',
      ta: 'ஆராய்ச்சிக்குரிய இடைப்பட்ட மணிக்கட்டு சுற்றளவு வரம்பு (14.7 செ.மீ – 16.6 செ.மீ). இது ஆய்வுக்குரிய இடைநிலை அளவு; முழுமையான மருத்துவ சான்றிதழ் இன்னும் பெறப்படவில்லை.'
    },
    disclaimer: {
      en: 'PROVISIONAL RESEARCH RECORD: Not validated for clinical diagnosis, patient triaging, or definitive medical staging.',
      ta: 'ஆய்வு நிலை எச்சரிக்கை: இது நோய் அறுதியிடலுக்கான மருத்துவ முடிவு அல்ல; கல்வி மற்றும் ஆய்வு நோக்கங்களுக்கானது மட்டுமே.'
    }
  },
  {
    id: 'metric-range-high',
    minCm: 17.1,
    maxCm: 19.0,
    unit: 'cm',
    sourceTitle: 'Observational Clinical Study on Manikkadai Nool in Peptic Conditions (Gunmam)',
    authors: 'Siddha Clinical Research Group (Provisional Reference)',
    publication: 'Preliminary Siddha Observational Literature / Institutional Research Report',
    publicationYear: 2019,
    doi: null,
    reviewStatus: 'pending_review',
    provisionalInterpretation: {
      en: 'Provisional Upper Wrist Circumference Range (17.1 cm – 19.0 cm). Documented as elevated/hypertrophic circumference cohort in preliminary study. Pending prospective clinical validation.',
      ta: 'ஆராய்ச்சிக்குரிய உயர் மணிக்கட்டு சுற்றளவு வரம்பு (17.1 செ.மீ – 19.0 செ.மீ). இது ஆய்வுக்குரிய மேல்நிலை அளவு; மருத்துவ சான்றிதழ் இன்னும் பெறப்படவில்லை.'
    },
    disclaimer: {
      en: 'PROVISIONAL RESEARCH RECORD: Not validated for clinical diagnosis, patient triaging, or definitive medical staging.',
      ta: 'ஆய்வு நிலை எச்சரிக்கை: இது நோய் அறுதியிடலுக்கான மருத்துவ முடிவு அல்ல; கல்வி மற்றும் ஆய்வு நோக்கங்களுக்கானது மட்டுமே.'
    }
  }
];
