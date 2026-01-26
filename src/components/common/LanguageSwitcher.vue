<template>
  <div class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang.code"
      class="lang-button"
      :class="{ active: currentLocale === lang.code }"
      @click="changeLanguage(lang.code)"
      :aria-label="`Switch to ${lang.name}`"
    >
      {{ lang.flag }} {{ lang.short }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'uz', name: "O'zbek", short: 'UZ', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' }
]

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lang-button {
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #333;
}

.lang-button:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.lang-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .lang-button {
    padding: 6px 12px;
    font-size: 1rem;
  }
}
</style>
