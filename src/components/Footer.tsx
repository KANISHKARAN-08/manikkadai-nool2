import React from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface FooterProps {
  language: Language;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <footer className="no-print bg-forest-950 border-t border-gold-500/20 text-cream-200/70 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: System Identification */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-gold-500/50 bg-forest-900 flex items-center justify-center text-gold-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-cream-100">
                {t.siteTitle} <span className="font-tamil text-sm text-gold-400 font-normal">({t.siteSubtitle})</span>
              </span>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed max-w-md font-light">
              {language === 'en'
                ? 'An authenticated digital scholarly edition of the classical Siddha Manikkadai Nool wrist circumference diagnostic treatise, faithfully transcribed from Noi Nadal Noi Mudal Nadal Thirattu (Part 1, pp. 368–371).'
                : '‘நோய் நாடல் நோய் முதல் நாடல் திரட்டு’ (பாகம் 1, பக். 368–371) நூலின் மணிக்கடை நூல் பதிவுகளைப் பாதுகாத்து, நவீன கால ஆய்வுக்கு வழங்கும் அதிகாரப்பூர்வ மென்பொருள்.'}
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-forest-900 border border-gold-500/30 text-xs text-gold-300">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>{language === 'en' ? 'Zero Remote Database • 100% Client-Side Privacy' : 'முழுக்க உள்ளூர் கணினி சேமிப்பகம் • தனியுரிமைப் பாதுகாப்பு'}</span>
            </div>
          </div>

          {/* Col 2: Canonical References */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gold-400 font-serif">
              {language === 'en' ? 'Archival Source' : 'மூல நூல் விவரம்'}
            </h4>
            <ul className="text-xs space-y-2 text-cream-200/80">
              <li className="flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="font-tamil">நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)</span>
              </li>
              <li>{language === 'en' ? 'Printed Pages: 368, 369, 371' : 'அச்சிடப்பட்ட பக்கங்கள்: 368, 369, 371'}</li>
              <li>{language === 'en' ? 'Canonical Records: 25 Unique Values' : 'மூலப் பதிவுகள்: 25 தனித்த அளவுகள்'}</li>
              <li>{language === 'en' ? 'Unit: Virarkadai (4 to 10)' : 'அலகு: விரற்கடை (4 முதல் 10 வரை)'}</li>
            </ul>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-gold-400 font-serif">
              {language === 'en' ? 'Navigation' : 'பக்கங்கள்'}
            </h4>
            <ul className="text-xs space-y-2">
              {['home', 'assessment', 'library', 'gallery', 'research', 'history'].map((key) => (
                <li key={key}>
                  <button
                    onClick={() => onNavigate(key)}
                    className="hover:text-gold-300 transition-colors capitalize text-left"
                  >
                    {t[`nav${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof t] || key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-200/50 space-y-4 sm:space-y-0">
          <p>
            © 2026 Manikkadai Nool Scholarly Project. Built with fidelity to classical Siddha palm-leaf and printed archives.
          </p>
          <div className="flex items-center space-x-1">
            <span>Preserving ancient wisdom for health sciences</span>
            <Heart className="w-3.5 h-3.5 text-gold-500 fill-current inline-block ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
