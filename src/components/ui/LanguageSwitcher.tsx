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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="border-beam p-2 rounded-full glass hover:bg-white/10 transition-colors flex items-center gap-2 relative overflow-hidden"
        aria-label="Change Language"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
        <Globe size={20} className="text-primary" />
        <span className="text-sm font-bold uppercase hidden sm:block">{locale}</span>
      </motion.button>

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
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-44 glass-ultra rounded-xl border border-white/10 shadow-xl overflow-hidden z-50 border-beam"
            >
              <div className="absolute inset-0 holo-grid opacity-30 pointer-events-none" />
              {languages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    setLocale(lang.code);
                    changeGoogleLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`relative w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-colors ${
                    locale === lang.code ? 'bg-primary/20 text-primary font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {locale === lang.code && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary pulse-soft" />
                  )}
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
