<template>
  <div class="who-disappeared-game">
    <!-- Game Header -->
    <div class="game-header">
      <div class="score-board">
        <span class="score-label">Score:</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="round-info">
        <span>Round {{ round }}</span>
      </div>
      <Button
        icon="pi pi-times"
        class="close-button"
        rounded
        @click="$emit('close')"
        aria-label="Close game"
      />
    </div>

    <!-- Game Phases -->
    <div class="game-content">
      <!-- Phase 1: Memorize -->
      <div v-if="phase === 'memorize'" class="memorize-phase">
        <div class="instruction">
          <h2>Remember all these items!</h2>
          <div class="timer">
            <i class="pi pi-clock"></i>
            <span>{{ timeRemaining }}s</span>
          </div>
        </div>

        <div class="items-grid">
          <div
            v-for="item in items"
            :key="item.id"
            class="item-card memorize"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <p class="item-name">{{ item.name }}</p>
          </div>
        </div>
      </div>

      <!-- Phase 2: Find Missing -->
      <div v-else-if="phase === 'guess'" class="guess-phase">
        <div class="instruction">
          <h2>Who disappeared?</h2>
          <p>Click on the item that is missing!</p>
        </div>

        <div class="items-grid">
          <div
            v-for="item in items"
            :key="item.id"
            class="item-card"
            :class="{ hidden: item.isHidden, selected: selectedItem === item.id }"
          >
            <div v-if="!item.isHidden" class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div v-else class="question-mark">
              <i class="pi pi-question"></i>
            </div>
            <p class="item-name">{{ item.name }}</p>
          </div>
        </div>

        <div class="guess-options">
          <h3>Who is missing?</h3>
          <div class="options-list">
            <Button
              v-for="item in items"
              :key="item.id"
              :label="item.name"
              :class="['option-button', { selected: selectedItem === item.id }]"
              @click="selectItem(item.id)"
            />
          </div>
        </div>
      </div>

      <!-- Phase 3: Result -->
      <div v-else-if="phase === 'result'" class="result-phase">
        <div class="result-message" :class="{ correct: isCorrect, incorrect: !isCorrect }">
          <i :class="isCorrect ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
          <h2>{{ isCorrect ? 'Excellent!' : 'Not quite!' }}</h2>
          <p v-if="isCorrect">You found the missing item!</p>
          <p v-else>The correct answer was: <strong>{{ correctAnswer }}</strong></p>
        </div>

        <div class="items-grid">
          <div
            v-for="item in items"
            :key="item.id"
            class="item-card"
            :class="{
              revealed: item.isHidden,
              correct: isCorrect && item.isHidden,
              incorrect: !isCorrect && selectedItem === item.id
            }"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <p class="item-name">{{ item.name }}</p>
            <div v-if="item.isHidden" class="reveal-badge">
              <i class="pi pi-eye"></i>
              <span>This one!</span>
            </div>
          </div>
        </div>

        <div class="next-button-container">
          <Button
            label="Next Round"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="next-button"
            size="large"
            @click="nextRound"
          />
        </div>
      </div>
    </div>
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
  itemCount: {
    type: Number,
    default: 5
  },
  showTime: {
    type: Number,
    default: 5000 // milliseconds
  }
})

const emit = defineEmits(['close', 'finish'])

// Game state
const phase = ref('memorize') // 'memorize', 'guess', 'result'
const score = ref(0)
const round = ref(1)
const timeRemaining = ref(5)
const selectedItem = ref(null)
const isCorrect = ref(false)
let timerInterval = null

// Mock items data (in real app, load from theme data)
const items = ref([
  {
    id: 'mother',
    name: 'Mother',
    image: '/assets/images/themes/family/mother.jpg',
    isHidden: false
  },
  {
    id: 'father',
    name: 'Father',
    image: '/assets/images/themes/family/father.jpg',
    isHidden: false
  },
  {
    id: 'sister',
    name: 'Sister',
    image: '/assets/images/themes/family/sister.jpg',
    isHidden: true // This one disappears
  },
  {
    id: 'brother',
    name: 'Brother',
    image: '/assets/images/themes/family/brother.jpg',
    isHidden: false
  },
  {
    id: 'grandmother',
    name: 'Grandmother',
    image: '/assets/images/themes/family/grandmother.jpg',
    isHidden: false
  }
])

const correctAnswer = computed(() => {
  const hidden = items.value.find(item => item.isHidden)
  return hidden?.name || ''
})

// Start memorization timer
const startMemorizePhase = () => {
  phase.value = 'memorize'
  timeRemaining.value = Math.floor(props.showTime / 1000)

  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval)
      phase.value = 'guess'
    }
  }, 1000)
}

const selectItem = (itemId) => {
  selectedItem.value = itemId
  const hiddenItem = items.value.find(item => item.isHidden)
  isCorrect.value = itemId === hiddenItem?.id

  if (isCorrect.value) {
    score.value += 10
  }

  phase.value = 'result'
}

const nextRound = () => {
  round.value++
  selectedItem.value = null

  // In real app: shuffle items and randomly select one to hide
  // For now, just restart
  startMemorizePhase()
}

// Initialize
startMemorizePhase()
</script>

<style scoped>
.who-disappeared-game {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
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

.score-board {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.6rem;
  font-weight: bold;
}

.score-label {
  color: #666;
}

.score-value {
  color: #f5576c;
  font-size: 2rem;
}

.round-info {
  font-size: 1.4rem;
  color: #666;
  font-weight: 600;
}

.close-button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background: #f44336;
}

.game-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.instruction {
  text-align: center;
  margin-bottom: 32px;
}

.instruction h2 {
  font-size: 2.5rem;
  color: #333;
  margin: 0 0 16px 0;
}

.instruction p {
  font-size: 1.4rem;
  color: #666;
  margin: 0;
}

.timer {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50px;
  font-size: 1.8rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  animation: pulse 1s infinite;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.item-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 4px solid #e0e0e0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.item-card.memorize {
  animation: fadeIn 0.6s ease-out;
  border-color: #667eea;
}

.item-card.hidden {
  opacity: 0.3;
}

.item-card.revealed {
  border-color: #4caf50;
  background: #e8f5e9;
  animation: revealPulse 0.6s ease;
}

.item-card.correct {
  border-color: #4caf50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.item-card.incorrect {
  border-color: #f44336;
}

.item-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
  margin-bottom: 12px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.question-mark {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 12px;
}

.question-mark i {
  font-size: 5rem;
  color: white;
}

.item-name {
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.reveal-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.guess-options {
  text-align: center;
  padding: 32px;
  background: #f9f9f9;
  border-radius: 16px;
}

.guess-options h3 {
  font-size: 2rem;
  color: #333;
  margin: 0 0 24px 0;
}

.options-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.option-button {
  font-size: 1.3rem;
  padding: 16px 32px;
  border-radius: 50px;
  background: white;
  border: 3px solid #e0e0e0;
  color: #333;
  transition: all 0.3s ease;
}

.option-button:hover {
  transform: scale(1.05);
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.option-button.selected {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.result-message {
  text-align: center;
  padding: 32px;
  border-radius: 20px;
  margin-bottom: 32px;
}

.result-message.correct {
  background: #4caf50;
  color: white;
}

.result-message.incorrect {
  background: #ff9800;
  color: white;
}

.result-message i {
  font-size: 5rem;
  margin-bottom: 16px;
}

.result-message h2 {
  font-size: 2.5rem;
  margin: 0 0 16px 0;
}

.result-message p {
  font-size: 1.4rem;
  margin: 0;
}

.next-button-container {
  text-align: center;
  margin-top: 32px;
}

.next-button {
  font-size: 1.6rem;
  padding: 20px 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes revealPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .who-disappeared-game {
    padding: 16px;
  }

  .game-content {
    padding: 24px;
  }

  .instruction h2 {
    font-size: 2rem;
  }

  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .options-list {
    flex-direction: column;
  }

  .option-button {
    width: 100%;
  }
}
</style>
