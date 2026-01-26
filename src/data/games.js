// Data structure for games

export const gameTypes = {
  WHO_IS_IT: 'who-is-it',
  FIND_PAIR: 'find-pair',
  WHO_DISAPPEARED: 'who-disappeared'
}

export const games = [
  {
    id: 'who-is-it',
    name: 'Who is it?',
    nameSign: 'Кто это?',
    description: 'Look at the word and find the correct picture!',
    icon: 'pi pi-question-circle',
    backgroundColor: '#87CEEB', // Sky blue
    coverImage: '/assets/images/games/who-is-it.jpg',
    type: gameTypes.WHO_IS_IT,
    variations: [
      {
        id: 'word-to-picture',
        name: 'Word → Picture',
        description: 'See a word, find the matching picture'
      },
      {
        id: 'picture-to-word',
        name: 'Picture → Word',
        description: 'See a picture, find the matching word'
      },
      {
        id: 'sign-to-word',
        name: 'Sign → Word',
        description: 'See a sign language video, find the word'
      }
    ]
  },
  {
    id: 'find-pair',
    name: 'Find the Pair',
    nameSign: 'Найди пару',
    description: 'Match words with their pictures!',
    icon: 'pi pi-clone',
    backgroundColor: '#FFB347', // Pastel orange
    coverImage: '/assets/images/games/find-pair.jpg',
    type: gameTypes.FIND_PAIR,
    modes: [
      {
        id: 'face-down',
        name: 'Memory Mode',
        description: 'Cards are face down - remember their positions!'
      },
      {
        id: 'face-up',
        name: 'Matching Mode',
        description: 'Cards are face up - find the matching pairs!'
      }
    ],
    gridSizes: [
      { rows: 2, cols: 3, pairs: 3 },
      { rows: 3, cols: 4, pairs: 6 },
      { rows: 4, cols: 4, pairs: 8 }
    ]
  },
  {
    id: 'who-disappeared',
    name: 'Who Disappeared?',
    nameSign: 'Кто исчез?',
    description: 'Remember all the pictures - one will disappear!',
    icon: 'pi pi-eye-slash',
    backgroundColor: '#DDA0DD', // Plum
    coverImage: '/assets/images/games/who-disappeared.jpg',
    type: gameTypes.WHO_DISAPPEARED,
    itemCounts: [4, 5, 6] // Number of items to show
  }
]

// Game session data structure example
export const gameSessionExample = {
  gameId: 'who-is-it',
  themeId: 'animals',
  variation: 'word-to-picture',
  level: 1,
  score: 0,
  totalQuestions: 10,
  currentQuestion: 1,
  questions: [
    {
      questionId: 1,
      correctAnswer: 'dog',
      question: {
        type: 'word',
        content: 'Dog'
      },
      options: [
        {
          id: 'dog',
          type: 'picture',
          image: '/assets/images/themes/animals/dog.jpg',
          caption: 'Dog'
        },
        {
          id: 'cat',
          type: 'picture',
          image: '/assets/images/themes/animals/cat.jpg',
          caption: 'Cat'
        },
        {
          id: 'elephant',
          type: 'picture',
          image: '/assets/images/themes/animals/elephant.jpg',
          caption: 'Elephant'
        }
      ]
    }
    // ... more questions
  ]
}

// Find Pair game session example
export const findPairSessionExample = {
  gameId: 'find-pair',
  themeId: 'fruits',
  mode: 'face-down',
  gridSize: { rows: 2, cols: 3, pairs: 3 },
  moves: 0,
  matchedPairs: 0,
  cards: [
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
    }
    // ... more cards (shuffled)
  ]
}

// Who Disappeared game session example
export const whoDisappearedSessionExample = {
  gameId: 'who-disappeared',
  themeId: 'family',
  itemCount: 5,
  showTime: 5000, // milliseconds to show items
  score: 0,
  round: 1,
  items: [
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
      isHidden: true // This one will disappear
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
  ]
}

// Helper function to get game by ID
export function getGameById(id) {
  return games.find(game => game.id === id)
}
