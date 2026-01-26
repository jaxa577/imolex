<template>
  <div class="home-page">
    <div class="language-switcher-container">
      <LanguageSwitcher />
    </div>

    <header class="page-header">
      <h1 class="main-title">
        <i class="pi pi-book"></i>
        {{ $t('app.title') }}
      </h1>
      <p class="subtitle">{{ $t('home.subtitle') }}</p>
    </header>

    <div class="themes-grid">
      <ThemeCard
        v-for="theme in themes"
        :key="theme.id"
        :theme="theme"
        @select="goToTheme"
      />
    </div>

    <div class="games-section">
      <Button
        :label="$t('home.gamesButton')"
        icon="pi pi-gamepad"
        class="games-button"
        size="large"
        @click="goToGames"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import ThemeCard from '@/components/common/ThemeCard.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { themes } from '@/data/themes'

const router = useRouter()

const goToTheme = (themeId) => {
  router.push({ name: 'theme-detail', params: { themeId } })
}

const goToGames = () => {
  router.push({ name: 'games' })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.language-switcher-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: fadeIn 0.6s ease-out;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInDown 0.8s ease-out;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  margin: 0 0 16px 0;
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.main-title i {
  font-size: 3.5rem;
}

.subtitle {
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 500;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto 48px;
  animation: fadeInUp 1s ease-out;
}

.games-section {
  text-align: center;
  margin-top: 64px;
  animation: fadeIn 1.2s ease-out;
}

.games-button {
  font-size: 2rem;
  padding: 24px 48px;
  border-radius: 50px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  border: none !important;
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.4);
  transition: all 0.3s ease;
  color: white !important;
}

.games-button:hover {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
  color: white !important;
  transform: scale(1.1) rotate(-2deg);
  box-shadow: 0 12px 32px rgba(245, 87, 108, 0.6);
}

.games-button:active {
  transform: scale(1.05);
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 24px 16px;
  }

  .main-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 12px;
  }

  .main-title i {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.4rem;
  }

  .themes-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .games-button {
    font-size: 1.6rem;
    padding: 20px 40px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .themes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
