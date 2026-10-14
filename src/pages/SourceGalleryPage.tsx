import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface SourceGalleryPageProps {
  language: Language;
}

interface GalleryPlate {
  id: string;
  pageNumber: number;
  titleEn: string;
  titleTa: string;
  imageSrc: string;
  coveredValues: string;
  categoryEn: string;
  categoryTa: string;
  descriptionEn: string;
  descriptionTa: string;
}

const GALLERY_PLATES: GalleryPlate[] = [
  {
    id: 'plate-page-368',
    pageNumber: 368,
    titleEn: 'Page 368: Disease Manifestations (10 to 7 Virarkadai)',
    titleTa: 'பக்கம் 368: நோயினிலைகள் (10 முதல் 7 விரற்கடை வரை)',
    imageSrc: '/images/manuscript/page-368.jpg',
    coveredValues: '10, 9 ¾, 9 ½, 9 ¼, 9, 8 ¾, 8 ½, 8 ¼, 8, 7 ¾, 7 ½, 7 ¼, 7',
    categoryEn: 'Disease Manifestations (நோயினிலைகள்)',
    categoryTa: 'நோயினிலைகள்',
    descriptionEn: 'Covers traditional disease symptoms including Gunmam, Araiyaappu, Peenisam, Kuttam, and Elumburukki as wrist circumference progresses from 10 down to 7 virarkadai.',
    descriptionTa: '10 முதல் 7 விரற்கடை வரையிலான குன்மம், அரையாப்பு, பீனிசம், குட்டம் மற்றும் எலும்புருக்கி முதலான நோயினிலைகளின் மூல அட்டவணைப் பதிவு.'
  },
  {
    id: 'plate-page-369',
    pageNumber: 369,
    titleEn: 'Page 369: Disease Manifestations & Prognostic Verses (6 ¾ to 6 ¼)',
    titleTa: 'பக்கம் 369: நோயினிலைகளும் மரணக் குறிகுணப் பாடல்களும் (6 ¾ முதல் 6 ¼)',
    imageSrc: '/images/manuscript/page-369.jpg',
    coveredValues: '6 ¾, 6 ½, 6 ¼ + Verses for 6, 5 ¾, 5 ½',
    categoryEn: 'Transition & Critical Verses',
    categoryTa: 'இடைநிலை மற்றும் பாடல்கள்',
    descriptionEn: 'Contains table entries for 6 ¾, 6 ½, 6 ¼ virarkadai, followed by classical Siddha poetic verses for 6, 5 ¾, and 5 ½ virarkadai.',
    descriptionTa: '6 ¾, 6 ½, 6 ¼ விரற்கடை அளவுகளுக்கான அட்டவணையும், அதனைத் தொடர்ந்து 6, 5 ¾ மற்றும் 5 ½ விரற்கடை அளவுகளுக்கான மரணக் குறிகுணப் பாடல்களும் உள்ளன.'
  },
  {
    id: 'plate-page-371',
    pageNumber: 371,
    titleEn: 'Page 371: Critical Prognosis Table (6 to 4 Virarkadai)',
    titleTa: 'பக்கம் 371: மரணக் குறிகுணங்கள் அட்டவணை (6 முதல் 4 விரற்கடை வரை)',
    imageSrc: '/images/manuscript/page-371.jpg',
    coveredValues: '6, 5 ¾, 5 ½, 5 ¼, 5, 4 ¾, 4 ½, 4 ¼, 4 + Verse for 4',
    categoryEn: 'Critical Prognosis (மரணக் குறிகுணங்கள்)',
    categoryTa: 'மரணக் குறிகுணங்கள்',
    descriptionEn: 'The classical terminal prognosis table enumerating severe physical manifestations and fatal timelines from 6 virarkadai down to 4 virarkadai.',
    descriptionTa: '6 முதல் 4 விரற்கடை வரையிலான கடுமையான மரணக் குறிகுணங்கள் மற்றும் மரணம் நிகழும் நாட்களைத் தெளிவாகக் கூறும் மூல அட்டவணை.'
  }
];

export const SourceGalleryPage: React.FC<SourceGalleryPageProps> = ({ language }) => {
  const t = translations[language];
  const [selectedPlate, setSelectedPlate] = useState<GalleryPlate | null>(null);

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-800 text-xs font-semibold text-gold-300 border border-gold-500/30">
          <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
          <span>{t.galleryTitle}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50">
          {language === 'en' ? 'Manuscript Photographic Plates' : 'அசல் மூல ஏட்டுப் புகைப்படக் காட்சியகம்'}
        </h1>
        <p className="text-sm text-cream-200/80 font-light max-w-3xl leading-relaxed">
          {t.gallerySubtitle}
        </p>
      </div>

      {/* Provenance Card */}
      <div className="p-4 rounded-2xl bg-forest-850/80 border border-gold-500/25 flex items-start space-x-3 text-xs text-cream-200/90">
        <BookOpen className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-gold-300 block">
            {language === 'en' ? 'Archival Provenance Authentication' : 'மூல நூல் ஆதாரத் தகவல்'}
          </strong>
          <p className="font-light leading-relaxed">
            {language === 'en'
              ? 'These plates are photographs taken directly from printed pages 368, 369, and 371 of Noi Nadal Noi Mudal Nadal Thirattu (பாகம் 1). Every single record in our database is transcribed directly from these authenticated leaves.'
              : 'இப்புகைப்படங்கள் ‘நோய் நாடல் நோய் முதல் நாடல் திரட்டு’ (பாகம் 1) நூலின் 368, 369, 371 ஆகிய பக்கங்களின் நேரடிப் புகைப்படங்கள் ஆகும். நமது தரவுத்தளத்தில் உள்ள 25 பதிவுகளும் இவற்றிலிருந்தே பிழையின்றி எடுக்கப்பட்டுள்ளன.'}
          </p>
        </div>
      </div>

      {/* Plates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GALLERY_PLATES.map((plate) => (
          <div
            key={plate.id}
            id={`gallery-card-${plate.id}`}
            onClick={() => setSelectedPlate(plate)}
            className="group cursor-pointer bg-forest-850/90 hover:bg-forest-800 border border-gold-500/25 hover:border-gold-500/60 rounded-2xl overflow-hidden shadow-card-dark transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[4/3] bg-forest-950 overflow-hidden flex items-center justify-center">
              <img
                src={plate.imageSrc}
                alt={plate.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-forest-950/80 border border-gold-500/40 text-gold-300 text-xs flex items-center space-x-1 backdrop-blur-sm">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gold-400">Page {plate.pageNumber}</span>
                <span className="px-2 py-0.5 rounded bg-forest-900 border border-forest-700 text-cream-200/70 text-[10px]">
                  {plate.categoryTa}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                {language === 'en' ? plate.titleEn : plate.titleTa}
              </h3>

              <p className="text-xs text-cream-200/70 font-light line-clamp-2 leading-relaxed">
                {language === 'en' ? plate.descriptionEn : plate.descriptionTa}
              </p>

              <div className="pt-2 border-t border-forest-800 text-[11px] text-siddha-muted">
                <strong className="text-cream-200">Values: </strong>
                <span>{plate.coveredValues}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedPlate && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPlate(null)}
        >
          <div
            className="bg-forest-900 border-2 border-gold-500/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-forest-800">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
                  {language === 'en' ? selectedPlate.titleEn : selectedPlate.titleTa}
                </h3>
                <p className="text-xs text-gold-400">
                  Noi Nadal Noi Mudal Nadal Thirattu • Page {selectedPlate.pageNumber}
                </p>
              </div>
              <button
                id="close-gallery-lightbox-btn"
                onClick={() => setSelectedPlate(null)}
                className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image Display */}
            <div className="rounded-2xl overflow-hidden border border-gold-500/30 bg-black flex items-center justify-center max-h-[60vh]">
              <img
                src={selectedPlate.imageSrc}
                alt={selectedPlate.titleEn}
                className="max-h-[60vh] w-auto object-contain mx-auto"
              />
            </div>

            {/* Detailed Description */}
            <div className="p-4 rounded-xl bg-forest-950 border border-forest-800 text-xs sm:text-sm text-cream-200/90 leading-relaxed space-y-2">
              <p>{language === 'en' ? selectedPlate.descriptionEn : selectedPlate.descriptionTa}</p>
              <div className="text-xs text-siddha-muted pt-1">
                <strong className="text-gold-300">Documented Values: </strong>
                {selectedPlate.coveredValues}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
