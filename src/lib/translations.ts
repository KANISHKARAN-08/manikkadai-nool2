export interface Translations {
  siteTitle: string;
  siteSubtitle: string;
  badgeSiddha: string;
  navHome: string;
  navAssessment: string;
  navLibrary: string;
  navGallery: string;
  navResearch: string;
  navHistory: string;
  heroHeadline: string;
  heroSubtitle: string;
  exploreAssessmentBtn: string;
  exploreGalleryBtn: string;
  statusArchival: string;
  statusDataset: string;
  statusNoDb: string;
  medicalNoticeTitle: string;
  medicalNoticeBody: string;
  measurementStepsTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  circumferenceDisclaimer: string;
  assessmentFormTitle: string;
  sessionIdLabel: string;
  sessionIdPlaceholder: string;
  generateIdBtn: string;
  measurementLabel: string;
  measurementPlaceholder: string;
  unitLabel: string;
  repeatLabel: string;
  repeatPlaceholder: string;
  repeatHelp: string;
  notesLabel: string;
  notesPlaceholder: string;
  findRefBtn: string;
  livePreview: string;
  historyTitle: string;
  clearAllBtn: string;
  exportCsvBtn: string;
  deleteBtn: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  libraryTitle: string;
  librarySubtitle: string;
  searchPlaceholder: string;
  allRecords: string;
  manifestations: string;
  criticalSigns: string;
  galleryTitle: string;
  gallerySubtitle: string;
  researchTitle: string;
  researchSubtitle: string;
}

export const translations: Record<'en' | 'ta', Translations> = {
  en: {
    siteTitle: 'Manikkadai Nool',
    siteSubtitle: 'மணிக்கடை நூல்',
    badgeSiddha: 'Ancient Siddha Diagnostic Heritage',
    navHome: 'Home',
    navAssessment: 'Assessment',
    navLibrary: 'Reference Library',
    navGallery: 'Source Gallery',
    navResearch: 'Research & DOIs',
    navHistory: 'Session History',
    heroHeadline: 'Ancient Wisdom, Presented for a Digital Generation.',
    heroSubtitle: 'A canonical digital research platform for Manikkadai Nool (மணிக்கடை நூல்) from Noi Nadal Noi Mudal Nadal Thirattu. Combining 25 authentic manuscript records with rigorous physical metric assessment—operating 100% locally and offline without external databases.',
    exploreAssessmentBtn: 'Explore Assessment',
    exploreGalleryBtn: 'Explore Source Gallery',
    statusArchival: 'Canonical Manuscript: 25 Records',
    statusDataset: 'Source: Pages 368–371',
    statusNoDb: '100% Local & Offline',
    medicalNoticeTitle: 'Educational and Research Safety Notice',
    medicalNoticeBody: 'This system is an academic research transcription and historical reference tool. It is not an automated medical diagnostic device, clinical decision support system, or substitute for professional medical consultation.',
    measurementStepsTitle: 'Standard Wrist Circumference Measurement Protocol',
    step1Title: '1. Anatomical Landmark',
    step1Desc: 'Locate the styloid processes of the radius and ulna at the distal wrist crease.',
    step2Title: '2. Circumference Measurement',
    step2Desc: 'Wrap a non-elastic flexible measuring tape snugly around the wrist circumference (do NOT measure straight-line diameter).',
    step3Title: '3. Duplicate Reading',
    step3Desc: 'Take a second reading to ensure reproducibility within 0.3 cm clinical tolerance.',
    circumferenceDisclaimer: 'Note: Manikkadai measurements correspond to circumference (சுற்றளவு) around the wrist, never straight-line width or diameter.',
    assessmentFormTitle: 'Wrist Measurement Assessment',
    sessionIdLabel: 'Anonymous Session Identifier (Optional)',
    sessionIdPlaceholder: 'e.g. MN-2026-001',
    generateIdBtn: 'Generate ID',
    measurementLabel: 'Wrist Circumference Reading *',
    measurementPlaceholder: 'e.g. 12.5 or 16.5',
    unitLabel: 'Measurement Unit',
    repeatLabel: 'Repeat Wrist Reading (Optional)',
    repeatPlaceholder: 'e.g. 10 or 7.5 (Optional duplicate check)',
    repeatHelp: 'Recommended to confirm reproducibility within 1/4 Virarkadai tolerance.',
    notesLabel: 'Clinical or Archival Notes (Optional)',
    notesPlaceholder: 'Enter any observational context or patient notes...',
    findRefBtn: 'Find Reference Entry',
    livePreview: 'Live Wrist Measurement Preview',
    historyTitle: 'Saved Assessment History',
    clearAllBtn: 'Clear All History',
    exportCsvBtn: 'Export CSV',
    deleteBtn: 'Delete',
    noHistoryTitle: 'No Assessments Recorded Yet',
    noHistoryDesc: 'Assessments submitted in the Assessment tab will be preserved here in this browser.',
    libraryTitle: 'Canonical Traditional Reference Library',
    librarySubtitle: 'Explore all 25 authenticated entries from Noi Nadal Noi Mudal Nadal Thirattu (பாகம் 1, பக். 368–371).',
    searchPlaceholder: 'Search by value (e.g. 4, 4¼, 6, 7½, 8¾, 10), fraction, or Tamil term...',
    allRecords: 'All 25 Records',
    manifestations: 'Disease Manifestations (pp. 368–369)',
    criticalSigns: 'Critical Prognosis (p. 371)',
    galleryTitle: 'Manuscript Source Gallery',
    gallerySubtitle: 'High-resolution photographic plates of pages 368, 369, and 371 from the source text.',
    researchTitle: 'Research & Scholarly Literature',
    researchSubtitle: 'Methodological provenance, observational studies, and pending clinical review status.'
  },
  ta: {
    siteTitle: 'மணிக்கடை நூல்',
    siteSubtitle: 'Manikkadai Nool',
    badgeSiddha: 'பாரம்பரிய சித்த மருத்துவக் கணிப்பு முறை',
    navHome: 'முகப்பு',
    navAssessment: 'அளவீட்டுப் பரிசோதனை',
    navLibrary: 'நூல் குறிப்பகம்',
    navGallery: 'மூல ஏட்டுப் படங்கள்',
    navResearch: 'ஆய்வும் மேற்கோள்களும்',
    navHistory: 'அமர்வு வரலாறு',
    heroHeadline: 'பழங்கால ஞானம், நவீன டிஜிட்டல் தலைமுறைக்கு.',
    heroSubtitle: '‘நோய் நாடல் நோய் முதல் நாடல் திரட்டு’ (பாகம் 1) நூலில் உள்ள மணிக்கடை நூல் மூல அட்டவணைப் பதிவுகளுக்கான டிஜிட்டல் ஆய்வு தளம். 25 மூல ஏட்டுத் தரவுகள் மற்றும் செ.மீ/மி.மீ அளவீடுகளைக் கொண்டு, வெளிப்புற தரவுத்தளங்கள் ஏதுமின்றி முழுமையாக உள்ளூர் கணினியிலேயே இயங்குகிறது.',
    exploreAssessmentBtn: 'பரிசோதனைக்குச் செல்க',
    exploreGalleryBtn: 'மூல ஏடுகளைக் காண்க',
    statusArchival: 'மூல ஏட்டுப் பதிவுகள்: 25',
    statusDataset: 'மூலப் பக்கங்கள்: 368–371',
    statusNoDb: '100% உள்ளூர் சேமிப்பகம்',
    medicalNoticeTitle: 'கல்வி மற்றும் மருத்துவப் பாதுகாப்பு எச்சரிக்கை',
    medicalNoticeBody: 'இத்தளம் ஒரு வரலாற்று மற்றும் கல்வி ஆய்வுப் பதிவு மட்டுமே. இது நேரடி மருத்துவப் பரிசோதனைக் கருவி அல்ல; மருத்துவ ஆலோசனைக்குத் தகுதியான சித்த மருத்துவரையே அணுக வேண்டும்.',
    measurementStepsTitle: 'சரியான மணிக்கட்டு சுற்றளவு எடுக்கும் முறை',
    step1Title: '1. மணிக்கட்டு எலும்புப் பகுதி',
    step1Desc: 'மணிக்கட்டின் இருபுறமும் உள்ள எலும்பு முடிச்சுகளின் (Styloid processes) விளிம்பைக் கண்டறியவும்.',
    step2Title: '2. சுற்றளவு அளவீடு',
    step2Desc: 'நெகிழாத மெல்லிய நாடா கொண்டு மணிக்கட்டைச் சுற்றி சுற்றளவை அளவிடவும் (நேர்கோட்டு விட்டம் அல்ல).',
    step3Title: '3. மறுபரிசோதனை',
    step3Desc: 'அளவீட்டின் துல்லியத்தை உறுதி செய்ய 0.3 செ.மீ இடைவெளிக்குள் இரண்டாவது அளவீட்டை எடுக்கவும்.',
    circumferenceDisclaimer: 'முக்கியக் குறிப்பு: மணிக்கடை நூல் குறிப்பிடுவது மணிக்கட்டின் சுற்றளவு (Circumference) மட்டுமே; விட்டம் அல்லது அகலம் அல்ல.',
    assessmentFormTitle: 'மணிக்கட்டு சுற்றளவுப் பரிசோதனை',
    sessionIdLabel: 'அமர்வு அடையாளக் குறியீடு (விருப்பப்பட்டால்)',
    sessionIdPlaceholder: 'எ.கா: MN-2026-001',
    generateIdBtn: 'புதிய எண்',
    measurementLabel: 'மணிக்கட்டு சுற்றளவு அளவு *',
    measurementPlaceholder: 'எ.கா: 12.5 அல்லது 16.5',
    unitLabel: 'அளவீட்டு அலகு',
    repeatLabel: 'மணிக்கட்டு இரண்டாவது அளவீடு (விருப்பப்பட்டால்)',
    repeatPlaceholder: 'எ.கா: 10 அல்லது 7.5 (மறுசரிபார்ப்பு)',
    repeatHelp: '¼ விரற்கடை எல்லைக்குள் அளவீட்டை மறுசரிபார்க்கப் பரிந்துரைக்கப்படுகிறது.',
    notesLabel: 'ஆய்வுக் குறிப்புகள் (விருப்பப்பட்டால்)',
    notesPlaceholder: 'நோயாளி அல்லது ஆய்வு பற்றிய குறிப்புகளை உள்ளிடவும்...',
    findRefBtn: 'நூல் குறிப்பைத் தேடுக',
    livePreview: 'நேரலை மணிக்கட்டு அளவீட்டுக் காட்சி',
    historyTitle: 'சேமிக்கப்பட்ட பரிசோதனை வரலாறு',
    clearAllBtn: 'வரலாற்றை நீக்குக',
    exportCsvBtn: 'CSV கோப்பாகப் பதிவிறக்கு',
    deleteBtn: 'நீக்கு',
    noHistoryTitle: 'இதுவரை பரிசோதனைப் பதிவுகள் இல்லை',
    noHistoryDesc: 'பரிசோதனைப் பக்கத்தில் நீங்கள் பதிவு செய்யும் தகவல்கள் உங்கள் உலாவியிலேயே பத்திரமாகச் சேமிக்கப்படும்.',
    libraryTitle: 'மணிக்கடை நூல் மூலக் குறிப்பகம்',
    librarySubtitle: '‘நோய் நாடல் நோய் முதல் நாடல் திரட்டு’ (பாகம் 1, பக். 368–371) நூலின் 25 மூல ஏட்டுப் பதிவுகள்.',
    searchPlaceholder: 'அளவை (4, 4¼, 6, 7½, 8¾, 10) அல்லது தமிழ் சொற்களைத் தேடுக...',
    allRecords: 'அனைத்து 25 பதிவுகள்',
    manifestations: 'நோயினிலைகள் (பக். 368–369)',
    criticalSigns: 'மரணக் குறிகுணங்கள் (பக். 371)',
    galleryTitle: 'மூல ஏட்டுப் புகைப்படக் காட்சியகம்',
    gallerySubtitle: 'நூலின் 368, 369 மற்றும் 371-ஆம் பக்கங்களின் தெளிவான அசல் புகைப்படங்கள்.',
    researchTitle: 'ஆய்வு விவரங்களும் மேற்கோள்களும்',
    researchSubtitle: 'மணிக்கடை நூலின் வரலாற்று பின்னணி மற்றும் முதற்கட்ட மருத்துவ ஆய்வுத் தரவுகள்.'
  }
};
