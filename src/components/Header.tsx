import React, { useState } from 'react';
import { BookOpen, Compass, History, Image as ImageIcon, FileText, Menu, X, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/translations';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
  historyCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.navHome, icon: Compass },
    { id: 'assessment', label: t.navAssessment, icon: Sparkles },
    { id: 'library', label: t.navLibrary, icon: BookOpen },
    { id: 'gallery', label: t.navGallery, icon: ImageIcon },
    { id: 'research', label: t.navResearch, icon: FileText },
    { id: 'history', label: t.navHistory, icon: History, count: historyCount },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-forest-950/90 backdrop-blur-md border-b border-gold-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Emblem */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-full border border-gold-500/50 bg-forest-900 flex items-center justify-center shadow-gold-sm transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 40 40" className="w-8 h-8 text-gold-500">
                <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
                <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="20" r="3" fill="currentColor" />
                <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-cream-100 group-hover:text-gold-300 transition-colors">
                  {t.siteTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-forest-800 text-gold-400 border border-gold-500/30 hidden sm:inline-block">
                  Siddha
                </span>
              </div>
              <p className="text-xs text-siddha-muted tracking-wider font-tamil">
                {language === 'en' ? 'மணிக்கடை நூல் • சித்த மருத்துவம்' : 'Manikkadai Nool • Siddha Medical Heritage'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-gold-300 bg-forest-800/80 shadow-gold-sm border border-gold-500/30'
                      : 'text-cream-200/80 hover:text-cream-100 hover:bg-forest-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-siddha-muted'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 text-[11px] px-1.5 py-0.2 bg-gold-500/20 text-gold-300 rounded-full font-bold border border-gold-500/30">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Language Switcher */}
          <div className="flex items-center space-x-3">
            <button
              id="language-toggle-btn"
              onClick={onToggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-forest-800/80 hover:bg-forest-700/80 text-gold-300 border border-gold-500/40 shadow-sm transition-colors"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-cream-200 hover:text-gold-300 hover:bg-forest-800/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest-950/98 border-b border-gold-500/20 px-4 pt-2 pb-4 space-y-1 animate-fade-in shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-gold-300 bg-forest-800/90 border border-gold-500/30'
                    : 'text-cream-200 hover:text-white hover:bg-forest-800/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-siddha-muted'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-300 rounded-full font-bold border border-gold-500/30">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
