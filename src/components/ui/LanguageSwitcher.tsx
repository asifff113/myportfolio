"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/dictionaries';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  // Function to trigger Google Translate
  const changeGoogleLanguage = (langCode: string) => {
    const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleTranslateCombo) {
      googleTranslateCombo.value = langCode;
      googleTranslateCombo.dispatchEvent(new Event('change'));
    }
  };

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full glass hover:bg-white/10 transition-colors flex items-center gap-2"
        aria-label="Change Language"
      >
        <Globe size={20} className="text-primary" />
        <span className="text-sm font-bold uppercase hidden sm:block">{locale}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-40 glass-ultra rounded-xl border border-white/10 shadow-xl overflow-hidden z-50"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    changeGoogleLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-colors ${
                    locale === lang.code ? 'bg-primary/20 text-primary font-bold' : 'text-muted-foreground'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
