import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'uz',
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    uz
  }
})

export default i18n
