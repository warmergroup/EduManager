import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  // Mavjud tillar
  const availableLanguages = [
    { code: 'uz', name: 'O\'zbek', flag: '🇺🇿', icon: 'UZ' },
    { code: 'en', name: 'English', flag: '🇺🇸', icon: 'EN' }
  ]

  // Joriy til
  const currentLanguage = ref<string>('uz')

  // I18n instance
  const { locale } = useI18n()

  // Til o'zgartirish funksiyasi
  const setLanguage = (langCode: string) => {
    if (availableLanguages.some(lang => lang.code === langCode)) {
      currentLanguage.value = langCode
      locale.value = langCode
      
      // localStorage da saqlash
      localStorage.setItem('selectedLanguage', langCode)
      
      // HTML lang atributini yangilash
      document.documentElement.lang = langCode
    }
  }

  // localStorage dan til o'qish
  const loadLanguage = () => {
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Default til
      setLanguage('uz')
    }
  }

  // Joriy til ma'lumotlari
  const currentLanguageInfo = computed(() => {
    return availableLanguages.find(lang => lang.code === currentLanguage.value) || availableLanguages[0]
  })

  // Til nomi
  const currentLanguageName = computed(() => {
    return currentLanguageInfo.value.name
  })

  // Til bayrog'i
  const currentLanguageFlag = computed(() => {
    return currentLanguageInfo.value.flag
  })

  // RTL (Right-to-Left) til tekshiruvi
  const isRTL = computed(() => {
    return currentLanguage.value === 'ar' // Agar arab tili qo'shilsa
  })

  return {
    // State
    availableLanguages,
    currentLanguage,
    
    // Getters
    currentLanguageInfo,
    currentLanguageName,
    currentLanguageFlag,
    isRTL,
    
    // Actions
    setLanguage,
    loadLanguage
  }
})
