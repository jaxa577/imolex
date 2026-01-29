<template>
  <Card
    class="game-card"
    :style="{ backgroundColor: game.backgroundColor }"
    @click="$emit('select', game.id)"
  >
    <template #header>
      <div class="game-card-image">
        <img :src="game.coverImage" :alt="getGameTitle(game.id)" />
        <div class="game-icon-overlay">
          <i :class="game.icon"></i>
        </div>
      </div>
    </template>
    <template #title>
      <div class="game-card-title">
        <span>{{ getGameTitle(game.id) }}</span>
      </div>
    </template>
    <template #content>
      <div class="game-card-content">
        <p class="game-description">{{ getGameDescription(game.id) }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'

const { t } = useI18n()

defineProps({
  game: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const gameTranslationKeys = {
  'who-is-it': 'whoIsIt',
  'find-pair': 'findPair',
  'who-disappeared': 'whoDisappeared'
}

const getGameTitle = (gameId) => {
  const key = gameTranslationKeys[gameId]
  return key ? t(`${key}.title`) : gameId
}

const getGameDescription = (gameId) => {
  const key = gameTranslationKeys[gameId]
  return key ? t(`${key}.description`) : ''
}
</script>

<style scoped>
.game-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  border: 4px solid transparent;
  animation: bounceIn 0.6s ease-out;
}

.game-card:hover {
  transform: translateY(-8px) scale(1.02) rotate(-1deg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-color: #fff;
}

.game-card:active {
  transform: translateY(-4px) scale(0.98);
}

.game-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.3);
}

.game-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-icon-overlay {
  position: absolute;
  bottom: 14px;
  right: 14px;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.8);
}

.game-icon-overlay i {
  font-size: 2rem;
  color: #333;
}

.game-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  padding: 16px 14px 10px;
  text-align: center;
}

.game-card-content {
  text-align: center;
  padding: 0 14px 14px;
}

.game-description {
  font-size: 1.1rem;
  color: #555;
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}

/* Animation on load */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .game-card-image {
    height: 180px;
  }

  .game-icon-overlay {
    width: 54px;
    height: 54px;
    bottom: 12px;
    right: 12px;
  }

  .game-icon-overlay i {
    font-size: 1.8rem;
  }

  .game-card-title {
    font-size: 1.6rem;
    padding: 14px 12px 8px;
  }

  .game-description {
    font-size: 1rem;
  }
}

/* Phone breakpoint */
@media (max-width: 768px) {
  .game-card {
    border-radius: 16px;
    border-width: 3px;
  }

  .game-card-image {
    height: 160px;
  }

  .game-icon-overlay {
    width: 50px;
    height: 50px;
    bottom: 10px;
    right: 10px;
    border-width: 2px;
  }

  .game-icon-overlay i {
    font-size: 1.6rem;
  }

  .game-card-title {
    font-size: 1.4rem;
    padding: 12px 10px 6px;
  }

  .game-card-content {
    padding: 0 12px 12px;
  }

  .game-description {
    font-size: 0.95rem;
  }
}

/* Small phone breakpoint */
@media (max-width: 480px) {
  .game-card {
    border-radius: 14px;
  }

  .game-card-image {
    height: 140px;
  }

  .game-icon-overlay {
    width: 44px;
    height: 44px;
  }

  .game-icon-overlay i {
    font-size: 1.4rem;
  }

  .game-card-title {
    font-size: 1.3rem;
  }

  .game-description {
    font-size: 0.9rem;
  }
}

@media (hover: none) {
  .game-card {
    border: 3px solid #fff;
  }

  .game-card:hover {
    transform: none;
  }

  .game-card:active {
    transform: scale(0.97);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}
</style>
