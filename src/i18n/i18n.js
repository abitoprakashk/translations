import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'
import arabicLang from './ar/ar.json'
import englishLang from './en/en.json'
import hindiLang from './hi/hi.json'
import indonesiaLang from './ind/ind.json'
import frenchLang from './fr/fr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': {
        translations: englishLang,
      },
      hi: {
        translations: hindiLang,
      },
      ar: {
        translations: arabicLang,
      },
      in: {
        translations: indonesiaLang,
      },
      fr: {
        translations: frenchLang,
      },
    },
    loadPath: '/{{lng}}/{{lng}}.json',

    fallbackLng: 'en-US',
    // fallbackLng: 'hi',
    // fallbackLng: 'ar',
    debug: false,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: '.', // we use content as keys

    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
