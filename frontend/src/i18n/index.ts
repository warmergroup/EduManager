import { createI18n } from 'vue-i18n'
import uz from '../locales/uz.json'
import en from '../locales/en.json'

// Til fayllarini import qilish
const messages = {
  uz,
  en
}

// Asosiy til (default)
const defaultLocale = 'en'

// I18n instance yaratish
const i18n = createI18n({
  legacy: false, // Composition API ishlatish uchun
  locale: defaultLocale,
  fallbackLocale: 'uz', // Agar tarjima topilmasa o'zbek tiliga o'tish
  messages,
  globalInjection: true, // Barcha komponentlarda $t() ishlatish uchun
  silentTranslationWarn: true, // Tarjima topilmaganida warning bermaslik
  silentFallbackWarn: true // Fallback til uchun warning bermaslik
})

export default i18n
