# Implementation Guide: Deaf Children Educational Website

This guide provides detailed instructions for implementing and extending the educational website.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Component Details](#component-details)
3. [Data Structure Guide](#data-structure-guide)
4. [Interaction Patterns](#interaction-patterns)
5. [Styling Guide](#styling-guide)
6. [Adding Content](#adding-content)
7. [Game Development](#game-development)
8. [Best Practices](#best-practices)

---

## Quick Start

### Initial Setup

1. **Install dependencies**:
```bash
npm install
```

2. **File structure verification**:
Ensure all files are in their correct locations as shown in PROJECT_STRUCTURE.md

3. **Add placeholder assets**:
Create placeholder images and videos for testing:
```bash
# Example structure
public/assets/
├── images/
│   ├── theme-covers/
│   │   ├── family.jpg
│   │   ├── animals.jpg
│   │   └── fruits.jpg
│   └── themes/
│       ├── family/
│       │   ├── mother.jpg
│       │   └── father.jpg
│       └── animals/
│           ├── dog.jpg
│           └── cat.jpg
└── videos/
    └── sign-language/
        ├── family/
        │   ├── mother.MP4
        │   └── mother.gif
        └── animals/
            ├── dog.MP4
            └── dog.gif
```

4. **Run development server**:
```bash
npm run dev
```

5. **Test the application**:
- Navigate to http://localhost:3000
- Click through themes
- Test games
- Verify responsive design on different screen sizes

---

## Component Details

### 1. ThemeCard Component (`src/components/common/ThemeCard.vue`)

**Purpose**: Displays a theme on the homepage with image, name, and item count.

**Props**:
- `theme` (Object, required): Theme data object

**Events**:
- `@select`: Emitted when card is clicked, passes theme ID

**Usage**:
```vue
<ThemeCard :theme="themeObject" @select="handleThemeSelect" />
```

**Customization**:
- Hover effect: Adjust `transform` in `:hover` state
- Card height: Change `.theme-card` height
- Border radius: Modify `border-radius` property

---

### 2. SideMenu Component (`src/components/common/SideMenu.vue`)

**Purpose**: Navigation menu for theme detail pages showing all items.

**Props**:
- `theme` (Object, required): Theme data
- `activeItemId` (String, required): Currently selected item ID

**Events**:
- `@select`: Emitted when menu item clicked, passes item ID
- `@back`: Emitted when back button clicked

**Features**:
- Sticky positioning
- Auto-scroll to active item
- Visual active state
- Custom scrollbar

**Usage**:
```vue
<SideMenu
  :theme="theme"
  :active-item-id="currentItemId"
  @select="selectItem"
  @back="goToHome"
/>
```

---

### 3. VideoPlayer Component (`src/components/common/VideoPlayer.vue`)

**Purpose**: Plays sign language videos or GIFs with controls.

**Props**:
- `videoSrc` (String): Path to video file
- `gifSrc` (String): Path to GIF fallback
- `alt` (String): Alt text for accessibility
- `caption` (String): Display caption below video
- `useVideo` (Boolean): Whether to use video (true) or GIF (false)

**Features**:
- Autoplay with loop
- Play/Pause control
- Replay button
- Fallback to GIF if video fails
- Responsive sizing

**Usage**:
```vue
<VideoPlayer
  :video-src="item.signVideo"
  :gif-src="item.signGif"
  :caption="`Sign: ${item.name}`"
/>
```

---

### 4. GameCard Component (`src/components/common/GameCard.vue`)

**Purpose**: Displays a game option on games page.

**Props**:
- `game` (Object, required): Game data object

**Events**:
- `@select`: Emitted when clicked, passes game ID

**Features**:
- Animated entrance
- Icon overlay
- Hover effects with rotation

---

### 5. WhoIsIt Component (`src/components/games/WhoIsIt.vue`)

**Purpose**: Multiple choice game matching words, pictures, or signs.

**Props**:
- `themeId` (String, required): Theme to pull questions from
- `variation` (String): Game variation (word-to-picture, picture-to-word, sign-to-word)

**Events**:
- `@close`: Emitted when game closed
- `@finish`: Emitted when game complete, passes result object

**Implementation Notes**:
```javascript
// Generate questions from theme data
function generateQuestions(theme, variation, count = 10) {
  const questions = []
  const items = [...theme.items] // Clone array

  for (let i = 0; i < count; i++) {
    // Pick random correct answer
    const correctItem = items[Math.floor(Math.random() * items.length)]

    // Pick 2-3 random wrong answers
    const wrongItems = items
      .filter(item => item.id !== correctItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    // Create question based on variation
    const question = {
      correctAnswer: correctItem.id,
      question: createQuestionFromVariation(correctItem, variation),
      options: shuffleArray([
        createOptionFromItem(correctItem),
        ...wrongItems.map(item => createOptionFromItem(item))
      ])
    }

    questions.push(question)
  }

  return questions
}
```

---

### 6. FindPair Component (`src/components/games/FindPair.vue`)

**Purpose**: Memory matching game pairing words with pictures.

**Props**:
- `themeId` (String, required): Theme for cards
- `mode` (String): 'face-down' or 'face-up'
- `gridSize` (Object): Grid configuration { rows, cols, pairs }

**Game Logic**:
```javascript
// Card matching logic
function checkMatch(card1, card2) {
  // Cards match if they have the same pairId
  if (card1.pairId === card2.pairId) {
    // Mark as matched
    card1.isMatched = true
    card2.isMatched = true
    matchedPairs++

    // Check for game completion
    if (matchedPairs === totalPairs) {
      showWinScreen()
    }
  } else {
    // No match - flip back after delay
    setTimeout(() => {
      card1.isFlipped = false
      card2.isFlipped = false
    }, 1000)
  }
}

// Card generation from theme
function generateCards(theme, pairCount) {
  const items = theme.items.slice(0, pairCount)
  const cards = []

  items.forEach(item => {
    // Add word card
    cards.push({
      id: `${item.id}-word`,
      pairId: item.id,
      type: 'word',
      content: item.name,
      isFlipped: false,
      isMatched: false
    })

    // Add picture card
    cards.push({
      id: `${item.id}-picture`,
      pairId: item.id,
      type: 'picture',
      image: item.image,
      caption: item.name,
      isFlipped: false,
      isMatched: false
    })
  })

  // Shuffle cards
  return shuffleArray(cards)
}
```

---

### 7. WhoDisappeared Component (`src/components/games/WhoDisappeared.vue`)

**Purpose**: Memory game where one item disappears.

**Props**:
- `themeId` (String, required): Theme for items
- `itemCount` (Number): Number of items to show (4-6)
- `showTime` (Number): Milliseconds to show items (default 5000)

**Game Flow**:
1. **Memorize Phase**: Show all items for `showTime` ms
2. **Guess Phase**: Hide one random item, show others as question marks
3. **Result Phase**: Reveal answer, show if correct

**Implementation**:
```javascript
function setupRound(theme, itemCount) {
  // Pick random items
  const items = theme.items
    .sort(() => Math.random() - 0.5)
    .slice(0, itemCount)

  // Randomly select one to hide
  const hiddenIndex = Math.floor(Math.random() * items.length)
  items[hiddenIndex].isHidden = true

  return {
    items,
    correctAnswer: items[hiddenIndex].id
  }
}

// Timer for memorize phase
function startMemorizeTimer(duration, onComplete) {
  let remaining = duration / 1000

  const interval = setInterval(() => {
    remaining--
    timeRemaining.value = remaining

    if (remaining <= 0) {
      clearInterval(interval)
      onComplete()
    }
  }, 1000)

  return interval
}
```

---

## Data Structure Guide

### Theme Data Structure

```javascript
{
  id: 'unique-id',              // Unique identifier
  name: 'Display Name',         // Shown to users
  nameSign: 'Native Name',      // Optional translation
  coverImage: '/path/to/cover.jpg',
  backgroundColor: '#HEX',      // Theme color
  icon: 'pi pi-icon-name',      // PrimeIcon class
  items: [
    {
      id: 'item-id',
      name: 'Item Name',
      nameSign: 'Native Name',
      image: '/path/to/image.jpg',
      signVideo: '/path/to/video.MP4',
      signGif: '/path/to/animation.gif',
      description: 'Short description'
    }
  ]
}
```

### Game Data Structure

```javascript
{
  id: 'game-id',
  name: 'Game Name',
  description: 'What the game does',
  icon: 'pi pi-icon',
  backgroundColor: '#HEX',
  coverImage: '/path/to/cover.jpg',
  type: 'game-type',           // Links to component

  // Optional: For games with variations
  variations: [
    {
      id: 'variation-id',
      name: 'Variation Name',
      description: 'What this does'
    }
  ],

  // Optional: For games with modes
  modes: [...],

  // Optional: For configurable games
  gridSizes: [...],
  itemCounts: [4, 5, 6]
}
```

---

## Interaction Patterns

### 1. Menu Item Selection

**Pattern**: Active state highlighting
```javascript
// In parent component
const activeItemId = ref('first-item-id')

function selectItem(itemId) {
  activeItemId.value = itemId
  // Update URL query param (optional)
  router.replace({ query: { itemId } })
}
```

**CSS**:
```css
.menu-item.active {
  background: white;
  border-color: #333;
  transform: translateX(8px);
}
```

### 2. Previous/Next Navigation

```javascript
const currentIndex = computed(() => {
  return items.findIndex(item => item.id === activeItemId.value)
})

const hasPrevious = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < items.length - 1)

function goToPrevious() {
  if (hasPrevious.value) {
    selectItem(items[currentIndex.value - 1].id)
  }
}

function goToNext() {
  if (hasNext.value) {
    selectItem(items[currentIndex.value + 1].id)
  }
}
```

### 3. Card Flip Animation

```css
.card {
  perspective: 1000px;
}

.card-front, .card-back {
  backface-visibility: hidden;
  transition: transform 0.6s;
}

.card-back {
  transform: rotateY(0deg);
}

.card-front {
  transform: rotateY(180deg);
}

.card.flipped .card-back {
  transform: rotateY(180deg);
}

.card.flipped .card-front {
  transform: rotateY(0deg);
}
```

### 4. Answer Feedback

```javascript
function selectAnswer(answerId) {
  const isCorrect = answerId === correctAnswer.value

  // Show feedback
  showResult.value = true
  selectedAnswer.value = answerId

  // Update score
  if (isCorrect) {
    score.value += 10
  }

  // Wait before next question
  setTimeout(() => {
    if (isLastQuestion) {
      finishGame()
    } else {
      nextQuestion()
    }
  }, 2000)
}
```

---

## Styling Guide

### Color Palette

```css
/* Primary Colors */
--purple-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--pink-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--green-success: #4caf50;
--red-error: #f44336;
--orange-warning: #ff9800;

/* Theme Colors */
--family-color: #FFB6C1;    /* Light Pink */
--animals-color: #98FB98;   /* Pale Green */
--fruits-color: #FFD700;    /* Gold */
--colors-color: #DDA0DD;    /* Plum */

/* Neutral Colors */
--white: #ffffff;
--light-gray: #f5f5f5;
--gray: #666666;
--dark-gray: #333333;
```

### Typography Scale

```css
/* Headings */
h1 { font-size: 3.5rem; }   /* Main titles */
h2 { font-size: 2.5rem; }   /* Section titles */
h3 { font-size: 2rem; }     /* Subsection titles */

/* Body Text */
p, span { font-size: 1.4rem; }
.small-text { font-size: 1.2rem; }
.large-text { font-size: 1.8rem; }

/* Buttons */
.button-text { font-size: 1.2-1.6rem; }
```

### Spacing System

```css
/* Margins and Padding */
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;

/* Gaps */
--gap-sm: 12px;
--gap-md: 16px;
--gap-lg: 24px;
--gap-xl: 32px;
```

### Border Radius

```css
--radius-sm: 8px;     /* Small elements */
--radius-md: 12px;    /* Buttons */
--radius-lg: 16px;    /* Cards */
--radius-xl: 20px;    /* Large cards */
--radius-full: 50%;   /* Circles */
```

### Shadows

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.2);
```

---

## Adding Content

### Adding a New Theme

1. **Prepare assets**:
```
public/assets/images/
├── theme-covers/new-theme.jpg
└── themes/new-theme/
    ├── item1.jpg
    ├── item2.jpg
    └── ...

public/assets/videos/sign-language/new-theme/
├── item1.MP4
├── item1.gif
├── item2.MP4
└── ...
```

2. **Add to themes.js**:
```javascript
export const themes = [
  // ... existing themes
  {
    id: 'new-theme',
    name: 'New Theme',
    coverImage: '/assets/images/theme-covers/new-theme.jpg',
    backgroundColor: '#87CEEB',
    icon: 'pi pi-star',
    items: [
      {
        id: 'item1',
        name: 'Item 1',
        image: '/assets/images/themes/new-theme/item1.jpg',
        signVideo: '/assets/videos/sign-language/new-theme/item1.MP4',
        signGif: '/assets/videos/sign-language/new-theme/item1.gif',
        description: 'Description of item 1'
      }
      // ... more items
    ]
  }
]
```

3. **Test**:
- Verify theme appears on homepage
- Click to open theme detail page
- Navigate through all items
- Check video playback

### Content Guidelines

**Images**:
- Minimum 800x800px
- JPG format for photos, PNG for illustrations
- Optimized file size (<200KB per image)
- Consistent style within theme

**Videos**:
- 2-5 seconds duration
- 720p resolution minimum
- MP4 format (H.264 codec)
- Clean background
- Good lighting
- Clear hand movements

**Text**:
- Keep item names short (1-2 words)
- Simple descriptions (1 sentence, <100 characters)
- Age-appropriate language
- Avoid jargon

---

## Game Development

### Creating a New Game

1. **Create component** (`src/components/games/NewGame.vue`):
```vue
<template>
  <div class="new-game">
    <!-- Game header with score/close -->
    <div class="game-header">
      <div class="score">{{ score }}</div>
      <Button icon="pi pi-times" @click="$emit('close')" />
    </div>

    <!-- Game content -->
    <div class="game-content">
      <!-- Your game logic here -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  themeId: { type: String, required: true }
})

const emit = defineEmits(['close', 'finish'])

const score = ref(0)

// Game logic...
</script>
```

2. **Add to games.js**:
```javascript
{
  id: 'new-game',
  name: 'New Game',
  description: 'What the game does',
  icon: 'pi pi-gamepad',
  backgroundColor: '#YOUR_COLOR',
  coverImage: '/assets/images/games/new-game.jpg',
  type: 'new-game'
}
```

3. **Register in GamePlayPage.vue**:
```vue
<script setup>
import NewGame from '@/components/games/NewGame.vue'

// In template:
<NewGame
  v-else-if="game.type === 'new-game'"
  :theme-id="selectedTheme"
  @close="endGame"
  @finish="handleGameFinish"
/>
</script>
```

### Game Design Principles

1. **Clear Objectives**: Child knows what to do immediately
2. **Immediate Feedback**: Visual response to every action
3. **Progressive Difficulty**: Start easy, get harder
4. **Error Tolerance**: Allow mistakes without punishment
5. **Celebration**: Reward success with animations/sounds
6. **Exit Anytime**: Always provide close/back button

---

## Best Practices

### Performance

```javascript
// Use computed for expensive calculations
const filteredItems = computed(() => {
  return items.value.filter(item => /* condition */)
})

// Lazy load images
<img :src="imageSrc" loading="lazy" alt="..." />

// Debounce user input
import { debounce } from 'lodash-es'
const handleInput = debounce((value) => {
  // Process input
}, 300)
```

### Accessibility

```vue
<!-- Always use semantic HTML -->
<nav>
  <button aria-label="Close game">
    <i class="pi pi-times" aria-hidden="true"></i>
  </button>
</nav>

<!-- Provide alt text -->
<img :src="image" :alt="`Picture of ${name}`" />

<!-- Use ARIA labels -->
<div role="button" aria-label="Play video" @click="play">
  <i class="pi pi-play"></i>
</div>
```

### Code Organization

```javascript
// Composables for reusable logic
// src/composables/useGameLogic.js
export function useGameLogic(themeId) {
  const score = ref(0)
  const questions = ref([])

  function generateQuestions() {
    // Logic here
  }

  return {
    score,
    questions,
    generateQuestions
  }
}

// Use in component
import { useGameLogic } from '@/composables/useGameLogic'

const { score, questions, generateQuestions } = useGameLogic(props.themeId)
```

### Error Handling

```javascript
// Handle video load errors
function handleVideoError(error) {
  console.error('Video failed to load:', error)
  // Fallback to GIF
  useGifFallback.value = true
}

// Handle missing data
const theme = computed(() => {
  const found = getThemeById(route.params.themeId)
  if (!found) {
    router.push({ name: 'home' })
    return null
  }
  return found
})
```

---

## Troubleshooting

### Videos not playing
- Check file paths are correct
- Verify video format (MP4/H.264)
- Ensure autoplay is allowed
- Provide GIF fallback

### Images not loading
- Verify paths start with `/assets/`
- Check file names match exactly (case-sensitive)
- Ensure images are in `public/` folder

### Routing issues
- Verify route names match `router/index.js`
- Check parameters are passed correctly
- Use router.push with proper format

### Styling not applied
- Check CSS selector specificity
- Verify scoped styles use correct syntax
- Ensure PrimeVue theme is imported

---

## Next Steps

1. Add your actual content (images, videos)
2. Test on target devices (tablets)
3. Get feedback from children/teachers
4. Iterate on design and interactions
5. Add sound effects (optional)
6. Implement progress tracking
7. Deploy to production

For more help, refer to:
- Vue 3 docs: https://vuejs.org
- PrimeVue docs: https://primevue.org
- PrimeIcons: https://primevue.org/icons
