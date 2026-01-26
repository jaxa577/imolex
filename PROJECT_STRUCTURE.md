# Deaf Children Educational Website - Project Structure

## Recommended Folder Structure

```
deaf-kids-learning/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── themes/
│   │   │   │   ├── family/
│   │   │   │   ├── animals/
│   │   │   │   ├── fruits/
│   │   │   │   └── ...
│   │   │   └── theme-covers/
│   │   └── videos/
│   │       └── sign-language/
│   │           ├── family/
│   │           ├── animals/
│   │           └── ...
│   └── sounds/ (optional feedback sounds)
│
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css
│   │       └── theme.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── ThemeCard.vue          # Reusable theme card
│   │   │   ├── ImageViewer.vue        # Image display with caption
│   │   │   ├── VideoPlayer.vue        # Sign language video player
│   │   │   ├── SideMenu.vue           # Left navigation menu
│   │   │   ├── GameCard.vue           # Game selection card
│   │   │   └── FeedbackMessage.vue    # Success/error feedback
│   │   │
│   │   ├── games/
│   │   │   ├── WhoIsIt.vue            # Game 1: Multiple choice
│   │   │   ├── FindPair.vue           # Game 2: Memory matching
│   │   │   ├── WhoDisappeared.vue     # Game 3: Missing item
│   │   │   └── GameLayout.vue         # Shared game layout wrapper
│   │   │
│   │   └── layout/
│   │       ├── AppHeader.vue          # Main navigation header
│   │       └── AppFooter.vue          # Footer (optional)
│   │
│   ├── views/
│   │   ├── HomePage.vue               # Theme selection page
│   │   ├── ThemeDetailPage.vue        # Learning page with menu
│   │   ├── GamesPage.vue              # Game selection page
│   │   └── GamePlayPage.vue           # Individual game container
│   │
│   ├── data/
│   │   ├── themes.js                  # Theme data
│   │   ├── games.js                   # Game configurations
│   │   └── constants.js               # App constants
│   │
│   ├── composables/
│   │   ├── useThemes.js               # Theme data logic
│   │   ├── useGameLogic.js            # Game state management
│   │   └── useSound.js                # Sound effects (optional)
│   │
│   ├── router/
│   │   └── index.js                   # Vue Router configuration
│   │
│   ├── App.vue                        # Root component
│   └── main.js                        # App entry point
│
├── package.json
├── vite.config.js
└── README.md
```

## Why PrimeVue?

1. **Rich component library**: Cards, Buttons, Menus, Dialogs
2. **Highly customizable**: Easy to create bright, playful themes
3. **Good accessibility**: Important for educational content
4. **Responsive by default**: Works on tablets and desktops
5. **Active development**: Well-maintained and documented

## Installation Commands

```bash
npm create vue@latest deaf-kids-learning
cd deaf-kids-learning
npm install primevue primeicons
npm install @primevue/themes
```
