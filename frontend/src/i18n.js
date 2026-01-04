import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './locales/tr.json';
import en from './locales/en.json';

// Tarayıcıdan kayıtlı dil tercihini al, yoksa İngilizce varsayılan
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: {
        translation: tr
      },
      en: {
        translation: en
      }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
