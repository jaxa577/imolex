<template>
  <div class="who-is-it-game">
    <!-- Results Screen -->
    <div v-if="gameFinished" class="results-screen">
      <div class="results-content">
        <i class="pi pi-trophy results-icon"></i>
        <h1 class="results-title">{{ $t('games.gameComplete') }}</h1>
        <div class="final-score">
          <div class="score-circle">
            <span class="score-number">{{ score }}</span>
            <span class="score-total">/ {{ totalQuestions * 10 }}</span>
          </div>
        </div>
        <div class="results-stats">
          <div class="stat-item">
            <i class="pi pi-check-circle"></i>
            <span>{{ correctAnswers }} {{ $t('games.correct') }}</span>
          </div>
          <div class="stat-item">
            <i class="pi pi-times-circle"></i>
            <span>{{ totalQuestions - correctAnswers }} {{ $t('games.wrong') }}</span>
          </div>
        </div>
        <div class="results-buttons">
          <Button
            :label="$t('games.playAgain')"
            icon="pi pi-refresh"
            class="play-again-button"
            size="large"
            @click="resetGame"
          />
          <Button
            :label="$t('games.close')"
            icon="pi pi-times"
            class="close-result-button"
            size="large"
            outlined
            @click="$emit('close')"
          />
        </div>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-else>
      <!-- Game Header -->
      <div class="game-header">
        <div class="score-board">
          <span class="score-label">{{ $t('games.score') }}</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div class="progress-info">
          <span>{{ $t('games.question') }} {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
        </div>
        <Button
          icon="pi pi-times"
          class="close-button"
          rounded
          @click="$emit('close')"
          :aria-label="$t('games.close')"
        />
      </div>

      <!-- Question Display -->
      <div v-if="currentQuestionData" class="question-section">
        <!-- Word Question -->
        <div v-if="currentQuestionData.type === 'word'" class="question-display word-question">
          <h2 class="question-title">{{ $t('whoIsIt.findPictureFor') }}</h2>
          <div class="question-content">
            <span class="question-word">{{ currentQuestionData.content }}</span>
          </div>
        </div>

        <!-- Picture Question -->
        <div v-else-if="currentQuestionData.type === 'picture'" class="question-display picture-question">
          <h2 class="question-title">{{ $t('whoIsIt.whatIsThis') }}</h2>
          <div class="question-image-container">
            <img :src="currentQuestionData.image" :alt="currentQuestionData.content" class="question-image" />
          </div>
        </div>

        <!-- Sign Language Video Question -->
        <div v-else-if="currentQuestionData.type === 'sign'" class="question-display sign-question">
          <h2 class="question-title">{{ $t('whoIsIt.whatSignIsThis') }}</h2>
          <VideoPlayer
            :video-src="currentQuestionData.videoSrc"
            :gif-src="currentQuestionData.gifSrc"
            :use-video="true"
          />
        </div>
      </div>

      <!-- Answer Options -->
      <div class="options-grid">
        <div
          v-for="option in currentOptions"
          :key="option.id"
          class="option-card"
          :class="{
            selected: selectedOption === option.id,
            correct: showResult && option.id === correctAnswer,
            incorrect: showResult && selectedOption === option.id && option.id !== correctAnswer
          }"
          @click="selectOption(option.id)"
        >
          <!-- Picture Option -->
          <div v-if="option.type === 'picture'" class="option-content">
            <div class="option-image-wrapper">
              <img :src="option.image" :alt="option.caption" class="option-image" />
            </div>
            <p class="option-caption">{{ option.caption }}</p>
          </div>

          <!-- Word Option -->
          <div v-else-if="option.type === 'word'" class="option-content">
            <span class="option-word">{{ option.content }}</span>
          </div>

          <!-- Result Icon -->
          <div v-if="showResult" class="result-icon">
            <i
              v-if="option.id === correctAnswer"
              class="pi pi-check-circle"
            ></i>
            <i
              v-else-if="selectedOption === option.id"
              class="pi pi-times-circle"
            ></i>
          </div>
        </div>
      </div>

      <!-- Feedback Message -->
      <transition name="fade">
        <div v-if="showResult" class="feedback-message" :class="{ correct: isCorrect, incorrect: !isCorrect }">
          <i :class="isCorrect ? 'pi pi-check' : 'pi pi-times'"></i>
          <span>{{ isCorrect ? $t('whoIsIt.greatJob') : $t('whoIsIt.tryAgain') }}</span>
        </div>
      </transition>

      <!-- Next Button -->
      <div v-if="showResult" class="next-button-container">
        <Button
          :label="currentQuestionIndex === totalQuestions - 1 ? $t('games.seeResults') : $t('games.nextQuestion')"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="next-button"
          size="large"
          @click="nextQuestion"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import VideoPlayer from '@/components/common/VideoPlayer.vue'
import { themes } from '@/data/themes.js'

const props = defineProps({
  themeId: {
    type: String,
    required: true
  },
  variation: {
    type: String,
    default: 'word-to-picture'
  }
})

const emit = defineEmits(['close', 'finish'])

const { t } = useI18n()

// Game state
const score = ref(0)
const correctAnswers = ref(0)
const currentQuestionIndex = ref(0)
const totalQuestions = ref(10)
const selectedOption = ref(null)
const showResult = ref(false)
const isCorrect = ref(false)
const gameFinished = ref(false)
const questions = ref([])
const correctAnswer = ref(null)

// Get theme data
const getThemeData = () => {
  return themes.find(t => t.id === props.themeId)
}

// Mapping for theme IDs to their translation category names
const themeToItemCategory = {
  'action-words': 'actionWords',
  'animals': 'animals',
  'body-parts': 'bodyParts',
  'clothes': 'clothes',
  'colors': 'colors',
  'dishes': 'dishes',
  'food': 'food',
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

// Helper to get translated item name
const getItemName = (themeId, itemId) => {
  const category = themeToItemCategory[themeId]
  if (category) {
    const translationKey = `items.${category}.${itemId}`
    const translated = t(translationKey)
    // If translation exists and is different from the key, return it
    if (translated !== translationKey) {
      return translated
    }
  }
  // Fallback: find the item in theme.items and return its default name
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

// Generate questions from theme data
const generateQuestions = () => {
  const theme = getThemeData()
  if (!theme || theme.items.length < 3) return []

  const allItems = theme.items
  const numQuestions = Math.min(totalQuestions.value, allItems.length)
  const selectedItems = shuffleArray(allItems).slice(0, numQuestions)

  return selectedItems.map(item => {
    const wrongOptions = allItems
      .filter(i => i.id !== item.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    const allOptions = shuffleArray([item, ...wrongOptions])

    // Determine question type based on variation
    if (props.variation === 'word-to-picture') {
      return {
        type: 'word',
        content: getItemName(props.themeId, item.id),
        correctAnswer: item.id,
        options: allOptions.map(opt => ({
          id: opt.id,
          type: 'picture',
          image: opt.image,
          caption: getItemName(props.themeId, opt.id)
        }))
      }
    } else if (props.variation === 'picture-to-word') {
      return {
        type: 'picture',
        image: item.image,
        content: getItemName(props.themeId, item.id),
        correctAnswer: item.id,
        options: allOptions.map(opt => ({
          id: opt.id,
          type: 'word',
          content: getItemName(props.themeId, opt.id)
        }))
      }
    } else if (props.variation === 'sign-to-word') {
      return {
        type: 'sign',
        videoSrc: item.signVideo,
        gifSrc: item.signGif,
        correctAnswer: item.id,
        options: allOptions.map(opt => ({
          id: opt.id,
          type: 'word',
          content: getItemName(props.themeId, opt.id)
        }))
      }
    }
  })
}

// Computed properties
const currentQuestionData = computed(() => {
  return questions.value[currentQuestionIndex.value]
})

const currentOptions = computed(() => {
  return currentQuestionData.value?.options || []
})

// Game actions
const selectOption = (optionId) => {
  if (showResult.value) return

  selectedOption.value = optionId
  correctAnswer.value = currentQuestionData.value.correctAnswer
  isCorrect.value = optionId === correctAnswer.value
  showResult.value = true

  if (isCorrect.value) {
    score.value += 10
    correctAnswers.value++
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value === totalQuestions.value - 1) {
    gameFinished.value = true
    emit('finish', { score: score.value, total: totalQuestions.value * 10 })
  } else {
    currentQuestionIndex.value++
    selectedOption.value = null
    showResult.value = false
    correctAnswer.value = null
  }
}

const resetGame = () => {
  score.value = 0
  correctAnswers.value = 0
  currentQuestionIndex.value = 0
  selectedOption.value = null
  showResult.value = false
  isCorrect.value = false
  gameFinished.value = false
  questions.value = generateQuestions()
  correctAnswer.value = null
}

// Initialize game
onMounted(() => {
  questions.value = generateQuestions()
})
</script>

<style scoped>
.who-is-it-game {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
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

.progress-info {
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

.question-section {
  margin-bottom: 40px;
}

.question-display {
  text-align: center;
  padding: 32px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.question-title {
  font-size: 2rem;
  color: #333;
  margin: 0 0 24px 0;
  font-weight: bold;
}

.question-word {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.question-image-container {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.question-image {
  width: 100%;
  height: auto;
  display: block;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.option-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 4px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.option-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  border-color: #667eea;
}

.option-card.selected {
  border-color: #667eea;
  transform: scale(1.05);
}

.option-card.correct {
  border-color: #4caf50;
  background: #e8f5e9;
  animation: correctPulse 0.6s ease;
}

.option-card.incorrect {
  border-color: #f44336;
  background: #ffebee;
  animation: shake 0.5s ease;
}

.option-content {
  text-align: center;
}

.option-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  background: #f5f5f5;
}

.option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.option-caption {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.option-word {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  display: block;
  padding: 40px 20px;
}

.result-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 2.5rem;
}

.result-icon .pi-check-circle {
  color: #4caf50;
}

.result-icon .pi-times-circle {
  color: #f44336;
}

.feedback-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-radius: 16px;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 24px;
  animation: slideIn 0.4s ease-out;
}

.feedback-message.correct {
  background: #4caf50;
  color: white;
}

.feedback-message.incorrect {
  background: #ff9800;
  color: white;
}

.feedback-message i {
  font-size: 2.5rem;
}

.next-button-container {
  text-align: center;
}

.next-button {
  font-size: 1.6rem;
  padding: 20px 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.next-button:hover {
  transform: scale(1.05);
}

/* Results Screen */
.results-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 24px;
}

.results-content {
  text-align: center;
  background: white;
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 100%;
  animation: slideIn 0.6s ease-out;
}

.results-icon {
  font-size: 6rem;
  color: #ffd700;
  margin-bottom: 24px;
  animation: correctPulse 1s ease infinite;
}

.results-title {
  font-size: 3rem;
  color: #333;
  margin: 0 0 32px 0;
  font-weight: bold;
}

.final-score {
  margin-bottom: 32px;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.score-number {
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
}

.score-total {
  font-size: 1.8rem;
  opacity: 0.9;
}

.results-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 40px;
  padding: 24px;
  background: #f5f5f5;
  border-radius: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.6rem;
  font-weight: 600;
}

.stat-item .pi-check-circle {
  color: #4caf50;
  font-size: 2rem;
}

.stat-item .pi-times-circle {
  color: #f44336;
  font-size: 2rem;
}

.results-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.play-again-button,
.close-result-button {
  font-size: 1.4rem;
  padding: 16px 32px;
  border-radius: 12px;
}

.play-again-button {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  border: none;
}

.play-again-button:hover {
  transform: scale(1.05);
}

.close-result-button:hover {
  transform: scale(1.05);
}

/* Animations */
@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .who-is-it-game {
    padding: 16px;
  }

  .game-header {
    flex-wrap: wrap;
    gap: 12px;
  }

  .question-word {
    font-size: 2.5rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
