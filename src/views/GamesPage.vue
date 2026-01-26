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
  padding: 40px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  position: relative;
  animation: fadeInDown 0.8s ease-out;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  background: white !important;
  color: #333 !important;
  border: 3px solid rgba(255, 255, 255, 0.5) !important;
}

.back-button:hover {
  transform: scale(1.1);
  background: #f0f0f0 !important;
  color: #333 !important;
}

.header-content {
  padding: 0 80px;
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

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
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

@media (max-width: 768px) {
  .games-page {
    padding: 24px 16px;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .back-button {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }

  .header-content {
    padding: 0 60px;
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

  .games-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
