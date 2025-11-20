"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Locale } from './dictionaries';

type Dictionary = typeof dictionaries.en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load saved locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('portfolio-locale') as Locale;
    if (savedLocale && dictionaries[savedLocale]) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('portfolio-locale', newLocale);
  };

  const value = {
    locale,
    setLocale,
    // Always return English dictionary so the DOM is rendered in English
    // and Google Translate can translate it correctly.
    t: dictionaries['en'],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
