import { createI18n } from 'vue-i18n'
import uz from '../locales/uz.json'
import en from '../locales/en.json'

// Til fayllarini import qilish
const messages = {
  uz,
  en
}

// Asosiy til (default)
const defaultLocale = 'uz'

// I18n instance yaratish
const i18n = createI18n({
  legacy: false, // Composition API ishlatish uchun
  locale: defaultLocale,
  fallbackLocale: 'en', // Agar tarjima topilmasa ingliz tiliga o'tish
  messages,
  globalInjection: true, // Barcha komponentlarda $t() ishlatish uchun
  silentTranslationWarn: true, // Tarjima topilmaganida warning bermaslik
  silentFallbackWarn: true // Fallback til uchun warning bermaslik
})

export default i18n
