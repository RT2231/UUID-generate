import { useState, useEffect } from 'react';
import type { Language } from './translations';
import { translations } from './translations';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved === 'ja' || saved === 'en') {
        return saved;
      }
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ja')) {
        return 'ja';
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = translations[language];

  return { ...t, language, setLanguage };
}
