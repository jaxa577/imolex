<template>
  <div class="games-page">
    <div class="language-switcher-container">
      <LanguageSwitcher />
    </div>

    <header class="page-header">
      <Button
        icon="pi pi-arrow-left"
        class="back-button"
        rounded
        @click="goBack"
        :aria-label="$t('games.backButton')"
      />
      <div class="header-content">
        <h1 class="main-title">
          <i class="pi pi-gamepad"></i>
          {{ $t('games.title') }}
        </h1>
        <p class="subtitle">{{ $t('games.subtitle') }}</p>
      </div>
    </header>

    <div class="games-grid">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        @select="selectGame"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import GameCard from '@/components/common/GameCard.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { games } from '@/data/games'

const router = useRouter()

const selectGame = (gameId) => {
  router.push({ name: 'game-play', params: { gameId } })
}

const goBack = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.language-switcher-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
  position: relative;
  animation: fadeInDown 0.8s ease-out;
  padding-top: 20px;
}

.back-button {
  position: absolute;
  left: 0;
  top: 20px;
  width: 56px;
  height: 56px;
  font-size: 1.4rem;
  background: white !important;
  color: #333 !important;
  border: 3px solid rgba(255, 255, 255, 0.5) !important;
}

.back-button:hover {
  transform: scale(1.1);
  background: #f0f0f0 !important;
  color: #333 !important;
}

.back-button:active {
  transform: scale(1.05);
}

.header-content {
  padding: 0 70px;
}

.main-title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: 0 0 16px 0;
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.main-title i {
  font-size: 3rem;
}

.subtitle {
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  font-weight: 500;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
  animation: fadeInUp 1s ease-out;
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

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Phone breakpoint */
@media (max-width: 768px) {
  .games-page {
    padding: 20px 16px;
  }

  .page-header {
    margin-bottom: 32px;
    padding-top: 10px;
  }

  .back-button {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
    top: 10px;
  }

  .header-content {
    padding: 0 56px;
  }

  .main-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }

  .main-title i {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1.2rem;
    padding: 0 10px;
  }

  .games-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-bottom: 24px;
  }
}

/* Small phone breakpoint */
@media (max-width: 480px) {
  .games-page {
    padding: 16px 12px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .back-button {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }

  .header-content {
    padding: 0 50px;
  }

  .main-title {
    font-size: 1.6rem;
    gap: 8px;
  }

  .main-title i {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .language-switcher-container {
    top: 12px;
    right: 12px;
  }

  .games-grid {
    gap: 16px;
  }
}
</style>
