<template>
  <Card
    class="game-card"
    :style="{ backgroundColor: game.backgroundColor }"
    @click="$emit('select', game.id)"
  >
    <template #header>
      <div class="game-card-image">
        <img :src="game.coverImage" :alt="game.name" />
        <div class="game-icon-overlay">
          <i :class="game.icon"></i>
        </div>
      </div>
    </template>
    <template #title>
      <div class="game-card-title">
        <span>{{ game.name }}</span>
      </div>
    </template>
    <template #content>
      <div class="game-card-content">
        <p class="game-description">{{ game.description }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'

defineProps({
  game: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
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
}

.game-card:hover {
  transform: translateY(-8px) scale(1.02) rotate(-1deg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-color: #fff;
}

.game-card:active {
  transform: translateY(-4px) scale(1.01);
}

.game-card-image {
  width: 100%;
  height: 220px;
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
  bottom: 16px;
  right: 16px;
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 4px solid rgba(255, 255, 255, 0.8);
}

.game-icon-overlay i {
  font-size: 2.5rem;
  color: #333;
}

.game-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  padding: 20px 16px 12px;
  text-align: center;
}

.game-card-content {
  text-align: center;
  padding: 0 16px 16px;
}

.game-description {
  font-size: 1.2rem;
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

.game-card {
  animation: bounceIn 0.6s ease-out;
}

@media (hover: none) {
  .game-card {
    border: 4px solid #fff;
  }
}
</style>
