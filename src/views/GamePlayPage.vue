<template>
  <div class="game-play-page">
    <!-- Game Selection / Configuration (before starting) -->
    <div v-if="!gameStarted && game" class="game-setup">
      <div class="setup-card">
        <h1 class="game-title">{{ game.name }}</h1>
        <p class="game-description">{{ game.description }}</p>

        <!-- Theme Selection -->
        <div class="setup-section">
          <h3>Choose a Theme:</h3>
          <div class="theme-selector">
            <Button
              v-for="theme in themes"
              :key="theme.id"
              :label="theme.name"
              :class="['theme-option', { selected: selectedTheme === theme.id }]"
              :style="{ backgroundColor: selectedTheme === theme.id ? theme.backgroundColor : '' }"
              @click="selectedTheme = theme.id"
            />
          </div>
        </div>

        <!-- Variation Selection (for Who Is It) -->
        <div v-if="game.variations" class="setup-section">
          <h3>Choose Game Mode:</h3>
          <div class="variation-selector">
            <Button
              v-for="variation in game.variations"
              :key="variation.id"
              :label="variation.name"
              :class="['variation-option', { selected: selectedVariation === variation.id }]"
              @click="selectedVariation = variation.id"
            >
              <template #default>
                <div class="variation-content">
                  <span class="variation-name">{{ variation.name }}</span>
                  <span class="variation-desc">{{ variation.description }}</span>
                </div>
              </template>
            </Button>
          </div>
        </div>

        <!-- Mode Selection (for Find Pair) -->
        <div v-if="game.modes" class="setup-section">
          <h3>Choose Difficulty:</h3>
          <div class="mode-selector">
            <Button
              v-for="mode in game.modes"
              :key="mode.id"
              :label="mode.name"
              :class="['mode-option', { selected: selectedMode === mode.id }]"
              @click="selectedMode = mode.id"
            >
              <template #default>
                <div class="mode-content">
                  <span class="mode-name">{{ mode.name }}</span>
                  <span class="mode-desc">{{ mode.description }}</span>
                </div>
              </template>
            </Button>
          </div>
        </div>

        <!-- Item Count Selection (for Who Disappeared) -->
        <div v-if="game.itemCounts" class="setup-section">
          <h3>Number of Items:</h3>
          <div class="count-selector">
            <Button
              v-for="count in game.itemCounts"
              :key="count"
              :label="String(count)"
              :class="['count-option', { selected: selectedItemCount === count }]"
              @click="selectedItemCount = count"
            />
          </div>
        </div>

        <!-- Start Button -->
        <div class="start-button-container">
          <Button
            label="Start Game!"
            icon="pi pi-play"
            class="start-button"
            size="large"
            :disabled="!selectedTheme"
            @click="startGame"
          />
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            class="back-button-setup"
            @click="goBack"
          />
        </div>
      </div>
    </div>

    <!-- Active Game -->
    <div v-else-if="gameStarted" class="active-game">
      <WhoIsIt
        v-if="game.type === 'who-is-it'"
        :theme-id="selectedTheme"
        :variation="selectedVariation"
        @close="endGame"
        @finish="handleGameFinish"
      />

      <FindPair
        v-else-if="game.type === 'find-pair'"
        :theme-id="selectedTheme"
        :mode="selectedMode"
        @close="endGame"
        @finish="handleGameFinish"
      />

      <WhoDisappeared
        v-else-if="game.type === 'who-disappeared'"
        :theme-id="selectedTheme"
        :item-count="selectedItemCount"
        @close="endGame"
        @finish="handleGameFinish"
      />
    </div>

    <!-- Loading -->
    <div v-else class="loading">
      <ProgressSpinner />
      <p>Loading game...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import WhoIsIt from '@/components/games/WhoIsIt.vue'
import FindPair from '@/components/games/FindPair.vue'
import WhoDisappeared from '@/components/games/WhoDisappeared.vue'
import { getGameById } from '@/data/games'
import { themes } from '@/data/themes'

const route = useRoute()
const router = useRouter()

const game = ref(null)
const gameStarted = ref(false)
const selectedTheme = ref('')
const selectedVariation = ref('')
const selectedMode = ref('')
const selectedItemCount = ref(5)

onMounted(() => {
  const gameId = route.params.gameId
  game.value = getGameById(gameId)

  // Set defaults
  if (game.value) {
    if (game.value.variations) {
      selectedVariation.value = game.value.variations[0].id
    }
    if (game.value.modes) {
      selectedMode.value = game.value.modes[0].id
    }
    if (game.value.itemCounts) {
      selectedItemCount.value = game.value.itemCounts[0]
    }
  }
})

const startGame = () => {
  gameStarted.value = true
}

const endGame = () => {
  gameStarted.value = false
  selectedTheme.value = ''
}

const handleGameFinish = (result) => {
  console.log('Game finished:', result)
  // Could show a results screen here
  endGame()
}

const goBack = () => {
  router.push({ name: 'games' })
}
</script>

<style scoped>
.game-play-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-setup {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.setup-card {
  background: white;
  border-radius: 24px;
  padding: 48px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.5s ease-out;
}

.game-title {
  font-size: 3rem;
  color: #333;
  text-align: center;
  margin: 0 0 16px 0;
}

.game-description {
  font-size: 1.4rem;
  color: #666;
  text-align: center;
  margin: 0 0 40px 0;
}

.setup-section {
  margin-bottom: 32px;
}

.setup-section h3 {
  font-size: 1.6rem;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: bold;
}

.theme-selector,
.variation-selector,
.mode-selector,
.count-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.theme-option,
.count-option {
  flex: 1;
  min-width: 150px;
  padding: 16px 24px;
  font-size: 1.3rem;
  border-radius: 12px;
  border: 3px solid #e0e0e0;
  background: white;
  color: #333;
  transition: all 0.3s ease;
}

.theme-option:hover,
.count-option:hover {
  transform: scale(1.05);
  border-color: #667eea;
}

.theme-option.selected,
.count-option.selected {
  border-color: #333;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.variation-option,
.mode-option {
  flex: 1;
  min-width: 200px;
  padding: 20px;
  border-radius: 12px;
  border: 3px solid #e0e0e0;
  background: white;
  transition: all 0.3s ease;
}

.variation-option:hover,
.mode-option:hover {
  transform: scale(1.05);
  border-color: #667eea;
}

.variation-option.selected,
.mode-option.selected {
  border-color: #667eea;
  background: #667eea;
  transform: scale(1.05);
}

.variation-option.selected .variation-content,
.mode-option.selected .mode-content {
  color: white;
}

.variation-content,
.mode-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.variation-name,
.mode-name {
  font-size: 1.3rem;
  font-weight: bold;
}

.variation-desc,
.mode-desc {
  font-size: 1rem;
  opacity: 0.8;
}

.start-button-container {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
}

.start-button {
  font-size: 1.8rem;
  padding: 20px 48px;
  border-radius: 50px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.start-button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 8px 28px rgba(76, 175, 80, 0.5);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-button-setup {
  font-size: 1.3rem;
  padding: 16px 32px;
  border-radius: 50px;
  background: #666;
  border: none;
}

.active-game {
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
  font-size: 1.5rem;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .setup-card {
    padding: 32px 24px;
  }

  .game-title {
    font-size: 2.2rem;
  }

  .game-description {
    font-size: 1.2rem;
  }

  .theme-selector,
  .variation-selector,
  .mode-selector,
  .count-selector {
    flex-direction: column;
  }

  .theme-option,
  .variation-option,
  .mode-option,
  .count-option {
    min-width: 100%;
  }

  .start-button-container {
    flex-direction: column;
  }

  .start-button,
  .back-button-setup {
    width: 100%;
  }
}
</style>
