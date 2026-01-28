<template>
  <div class="who-disappeared-game">
    <!-- Game Header -->
    <div class="game-header">
      <div class="score-board">
        <span class="score-label">{{ $t('games.score') }}</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div class="round-info">
        <span>{{ $t('games.question') }} {{ round }}</span>
      </div>
      <Button
        icon="pi pi-times"
        class="close-button"
        rounded
        @click="$emit('close')"
        :aria-label="$t('games.close')"
      />
    </div>

    <!-- Game Phases -->
    <div class="game-content">
      <!-- Phase 1: Memorize -->
      <div v-if="phase === 'memorize'" class="memorize-phase">
        <div class="instruction">
          <h2>{{ $t('whoDisappeared.memorize') }}</h2>
          <div class="timer">
            <i class="pi pi-clock"></i>
            <span>{{ $t('whoDisappeared.timeLeft') }} {{ timeRemaining }}s</span>
          </div>
        </div>

        <div class="items-grid">
          <div
            v-for="item in displayItems"
            :key="item.id"
            class="item-card memorize"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
          </div>
        </div>
      </div>

      <!-- Phase 2: Find Missing -->
      <div v-else-if="phase === 'guess'" class="guess-phase">
        <div class="instruction">
          <h2>{{ $t('whoDisappeared.guess') }}</h2>
        </div>

        <div class="items-grid">
          <div
            v-for="item in displayItems"
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
          </div>
        </div>

        <div class="guess-options">
          <div class="options-list">
            <Button
              v-for="item in displayItems"
              :key="item.id"
              :label="getItemName(item.id)"
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
          <h2>{{ isCorrect ? $t('whoIsIt.greatJob') : $t('whoIsIt.tryAgain') }}</h2>
        </div>

        <div class="items-grid">
          <div
            v-for="item in displayItems"
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
            <div v-if="item.isHidden" class="reveal-badge">
              <i class="pi pi-eye"></i>
            </div>
          </div>
        </div>

        <div class="next-button-container">
          <Button
            :label="$t('games.nextQuestion')"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { themes } from '@/data/themes.js'

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

const { t } = useI18n()

// Game state
const phase = ref('memorize') // 'memorize', 'guess', 'result'
const score = ref(0)
const round = ref(1)
const timeRemaining = ref(5)
const selectedItem = ref(null)
const isCorrect = ref(false)
const displayItems = ref([])
let timerInterval = null

// Mapping for theme IDs to their translation category names
const themeToItemCategory = {
  'action-words': 'actionWords',
  'domestic-animals': 'animals',
  'body-parts': 'bodyParts',
  'clothes': 'clothes',
  'colors': 'colors',
  'dishes': 'dishes',
  'family': 'family',
  'food': 'food',
  'fruits': 'fruits',
  'furniture': 'furniture',
  'household-appliances': 'householdAppliances',
  'insects': 'insects',
  'natural-phenomena': 'naturalPhenomena',
  'occupations': 'occupations',
  'places': 'places',
  'school-supplies': 'schoolSupplies',
  'transports': 'transports',
  'vegetables': 'vegetables',
  'wild-animals': 'wildAnimals'
}

// Get theme data
const getThemeData = () => {
  return themes.find(theme => theme.id === props.themeId)
}

// Helper to get translated item name
const getItemName = (itemId) => {
  const category = themeToItemCategory[props.themeId]
  if (category) {
    const translationKey = `items.${category}.${itemId}`
    const translated = t(translationKey)
    if (translated !== translationKey) {
      return translated
    }
  }
  const theme = getThemeData()
  const item = theme?.items?.find(i => i.id === itemId)
  return item?.name || itemId
}

// Shuffle array helper
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Initialize items from theme
const initializeItems = () => {
  const theme = getThemeData()
  if (!theme || theme.items.length < props.itemCount) return

  const shuffledItems = shuffleArray(theme.items)
  const selectedItems = shuffledItems.slice(0, props.itemCount)

  // Randomly select one item to hide
  const hiddenIndex = Math.floor(Math.random() * selectedItems.length)

  displayItems.value = selectedItems.map((item, index) => ({
    id: item.id,
    name: item.name,
    image: item.image,
    isHidden: index === hiddenIndex
  }))
}

// Start memorization timer
const startMemorizePhase = () => {
  phase.value = 'memorize'
  timeRemaining.value = Math.floor(props.showTime / 1000)
  selectedItem.value = null

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
  const hiddenItem = displayItems.value.find(item => item.isHidden)
  isCorrect.value = itemId === hiddenItem?.id

  if (isCorrect.value) {
    score.value += 10
  }

  phase.value = 'result'
}

const nextRound = () => {
  round.value++
  initializeItems()
  startMemorizePhase()
}

// Initialize
onMounted(() => {
  initializeItems()
  startMemorizePhase()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
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
}

.question-mark i {
  font-size: 5rem;
  color: white;
}

.reveal-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #4caf50;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.guess-options {
  text-align: center;
  padding: 32px;
  background: #f9f9f9;
  border-radius: 16px;
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
