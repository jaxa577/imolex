<template>
  <div class="language-switcher" :class="{ expanded: isExpanded }">
    <!-- Mobile: Show dropdown toggle -->
    <button
      class="lang-toggle"
      @click="toggleExpanded"
      :aria-label="$t('settings.language')"
    >
      <span class="current-lang">{{ currentLanguage.flag }}</span>
      <i class="pi pi-chevron-down toggle-icon" :class="{ rotated: isExpanded }"></i>
    </button>

    <!-- Mobile dropdown / Desktop buttons -->
    <div class="lang-options" :class="{ show: isExpanded }">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="lang-button"
        :class="{ active: currentLocale === lang.code }"
        @click="changeLanguage(lang.code)"
        :aria-label="`Switch to ${lang.name}`"
      >
        <span class="lang-flag">{{ lang.flag }}</span>
        <span class="lang-short">{{ lang.short }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isExpanded = ref(false)
const switcherRef = ref(null)

const languages = [
  { code: 'uz', name: "O'zbek", short: 'UZ', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' }
]

const currentLocale = computed(() => locale.value)

const currentLanguage = computed(() => {
  return languages.find(l => l.code === locale.value) || languages[0]
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  isExpanded.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const switcher = document.querySelector('.language-switcher')
  if (switcher && !switcher.contains(event.target)) {
    isExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: flex;
  gap: 6px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Hide mobile toggle on desktop */
.lang-toggle {
  display: none;
}

.lang-options {
  display: flex;
  gap: 6px;
}

.lang-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  color: #333;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.lang-flag {
  font-size: 1.1rem;
}

.lang-short {
  font-size: 0.9rem;
}

.lang-button:hover {
  background: #f5f5f5;
}

.lang-button:active {
  transform: scale(0.95);
}

.lang-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* Tablet and below - show compact dropdown */
@media (max-width: 768px) {
  .language-switcher {
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    -webkit-tap-highlight-color: transparent;
  }

  .current-lang {
    font-size: 1.3rem;
  }

  .toggle-icon {
    font-size: 0.7rem;
    color: #666;
    transition: transform 0.2s ease;
  }

  .toggle-icon.rotated {
    transform: rotate(180deg);
  }

  .lang-options {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 100;
  }

  .lang-options.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .lang-button {
    padding: 10px 16px;
    justify-content: flex-start;
    gap: 8px;
  }

  .lang-flag {
    font-size: 1.2rem;
  }

  .lang-short {
    font-size: 1rem;
  }
}

/* Small phone */
@media (max-width: 480px) {
  .lang-toggle {
    padding: 6px 10px;
  }

  .current-lang {
    font-size: 1.2rem;
  }

  .lang-options {
    padding: 6px;
  }

  .lang-button {
    padding: 8px 14px;
  }
}
</style>
