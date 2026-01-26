<template>
  <div class="find-pair-game">
    <!-- Game Header -->
    <div class="game-header">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Moves:</span>
          <span class="stat-value">{{ moves }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Pairs:</span>
          <span class="stat-value">{{ matchedPairs }} / {{ totalPairs }}</span>
        </div>
      </div>
      <Button
        icon="pi pi-times"
        class="close-button"
        rounded
        @click="$emit('close')"
        aria-label="Close game"
      />
    </div>

    <!-- Cards Grid -->
    <div class="cards-grid" :style="gridStyle">
      <div
        v-for="card in cards"
        :key="card.id"
        class="card"
        :class="{
          flipped: card.isFlipped || card.isMatched || mode === 'face-up',
          matched: card.isMatched,
          disabled: isProcessing || card.isMatched
        }"
        @click="flipCard(card)"
      >
        <!-- Card Back -->
        <div class="card-back">
          <i class="pi pi-question"></i>
        </div>

        <!-- Card Front -->
        <div class="card-front">
          <!-- Picture Card -->
          <div v-if="card.type === 'picture'" class="card-content picture-card">
            <img :src="card.image" :alt="card.caption" />
            <p class="card-caption">{{ card.caption }}</p>
          </div>

          <!-- Word Card -->
          <div v-else-if="card.type === 'word'" class="card-content word-card">
            <span class="card-word">{{ card.content }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Win Message -->
    <transition name="scale">
      <div v-if="isComplete" class="win-message">
        <div class="win-content">
          <i class="pi pi-trophy"></i>
          <h2>Congratulations!</h2>
          <p>You completed the game in {{ moves }} moves!</p>
          <div class="win-buttons">
            <Button
              label="Play Again"
              icon="pi pi-refresh"
              class="play-again-button"
              @click="resetGame"
            />
            <Button
              label="Back to Games"
              icon="pi pi-arrow-left"
              class="back-button-win"
              @click="$emit('close')"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  themeId: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'face-down' // 'face-down' or 'face-up'
  },
  gridSize: {
    type: Object,
    default: () => ({ rows: 3, cols: 4, pairs: 6 })
  }
})

const emit = defineEmits(['close', 'finish'])

// Game state
const moves = ref(0)
const matchedPairs = ref(0)
const totalPairs = computed(() => props.gridSize.pairs)
const flippedCards = ref([])
const isProcessing = ref(false)

// Mock cards data (in real app, generate from theme data)
const cards = ref([
  // Pair 1
  {
    id: 'apple-word',
    pairId: 'apple',
    type: 'word',
    content: 'Apple',
    isFlipped: false,
    isMatched: false
  },
  {
    id: 'apple-picture',
    pairId: 'apple',
    type: 'picture',
    image: '/assets/images/themes/fruits/apple.jpg',
    caption: 'Apple',
    isFlipped: false,
    isMatched: false
  },
  // Pair 2
  {
    id: 'banana-word',
    pairId: 'banana',
    type: 'word',
    content: 'Banana',
    isFlipped: false,
    isMatched: false
  },
  {
    id: 'banana-picture',
    pairId: 'banana',
    type: 'picture',
    image: '/assets/images/themes/fruits/banana.jpg',
    caption: 'Banana',
    isFlipped: false,
    isMatched: false
  },
  // Pair 3
  {
    id: 'orange-word',
    pairId: 'orange',
    type: 'word',
    content: 'Orange',
    isFlipped: false,
    isMatched: false
  },
  {
    id: 'orange-picture',
    pairId: 'orange',
    type: 'picture',
    image: '/assets/images/themes/fruits/orange.jpg',
    caption: 'Orange',
    isFlipped: false,
    isMatched: false
  }
  // Add more pairs based on gridSize
])

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.gridSize.cols}, 1fr)`,
  gridTemplateRows: `repeat(${props.gridSize.rows}, 1fr)`
}))

const isComplete = computed(() => matchedPairs.value === totalPairs.value)

const flipCard = (card) => {
  if (isProcessing.value || card.isMatched || card.isFlipped) return
  if (props.mode === 'face-down' && flippedCards.value.length >= 2) return

  card.isFlipped = true
  flippedCards.value.push(card)

  if (flippedCards.value.length === 2) {
    moves.value++
    checkMatch()
  }
}

const checkMatch = () => {
  isProcessing.value = true
  const [card1, card2] = flippedCards.value

  if (card1.pairId === card2.pairId) {
    // Match found
    setTimeout(() => {
      card1.isMatched = true
      card2.isMatched = true
      matchedPairs.value++
      flippedCards.value = []
      isProcessing.value = false

      if (isComplete.value) {
        emit('finish', { moves: moves.value, pairs: totalPairs.value })
      }
    }, 600)
  } else {
    // No match
    setTimeout(() => {
      card1.isFlipped = false
      card2.isFlipped = false
      flippedCards.value = []
      isProcessing.value = false
    }, 1000)
  }
}

const resetGame = () => {
  moves.value = 0
  matchedPairs.value = 0
  flippedCards.value = []
  isProcessing.value = false

  cards.value.forEach(card => {
    card.isFlipped = false
    card.isMatched = false
  })

  // Shuffle cards (in real app, use proper shuffle algorithm)
}
</script>

<style scoped>
.find-pair-game {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
}

.stat-label {
  color: #666;
  font-weight: 600;
}

.stat-value {
  color: #667eea;
  font-weight: bold;
  font-size: 1.8rem;
}

.close-button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background: #f44336;
}

.cards-grid {
  display: grid;
  gap: 16px;
  flex: 1;
  max-height: calc(100vh - 200px);
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
}

.card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  perspective: 1000px;
  min-height: 150px;
}

.card.disabled {
  cursor: not-allowed;
}

.card:hover:not(.disabled) {
  transform: scale(1.05);
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.6s ease;
  border: 4px solid white;
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 4rem;
}

.card-front {
  background: white;
  transform: rotateY(180deg);
}

.card.flipped .card-back {
  transform: rotateY(180deg);
}

.card.flipped .card-front {
  transform: rotateY(0deg);
}

.card.matched {
  animation: matchPulse 0.6s ease;
}

.card.matched .card-front {
  border-color: #4caf50;
  background: #e8f5e9;
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.picture-card img {
  width: 100%;
  max-height: 60%;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
}

.card-caption {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-align: center;
}

.word-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
}

.card-word {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-align: center;
}

.win-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.win-content {
  background: white;
  padding: 48px;
  border-radius: 24px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
}

.win-content i {
  font-size: 6rem;
  color: #ffd700;
  margin-bottom: 24px;
  animation: bounce 1s infinite;
}

.win-content h2 {
  font-size: 2.5rem;
  color: #333;
  margin: 0 0 16px 0;
}

.win-content p {
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 32px 0;
}

.win-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.play-again-button {
  background: #4caf50;
  border: none;
  font-size: 1.2rem;
  padding: 12px 24px;
}

.back-button-win {
  background: #666;
  border: none;
  font-size: 1.2rem;
  padding: 12px 24px;
}

/* Animations */
@keyframes matchPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.scale-enter-active, .scale-leave-active {
  transition: all 0.4s ease;
}

.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (max-width: 768px) {
  .find-pair-game {
    padding: 12px;
  }

  .cards-grid {
    gap: 12px;
    padding: 12px;
  }

  .card {
    min-height: 120px;
  }

  .card-word {
    font-size: 1.4rem;
  }

  .win-content {
    padding: 32px;
    margin: 16px;
  }

  .win-buttons {
    flex-direction: column;
  }
}
</style>
