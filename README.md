# Deaf Children Educational Website

An interactive, child-friendly educational website built with Vue 3 to help deaf children learn sign language through engaging lessons and games.

## Features

### Learning Pages
- **Thematic Learning**: Organized themes (Family, Animals, Fruits, Colors)
- **Interactive Cards**: Large, colorful cards with images and names
- **Sign Language Videos**: Each word includes sign language video/GIF demonstrations
- **Side Navigation**: Easy-to-use menu for browsing theme items
- **Previous/Next Navigation**: Smooth navigation between items

### Games
1. **Who Is It? / What Is It?**
   - Multiple choice game with 3 variations:
     - Word → Picture: See a word, find the matching picture
     - Picture → Word: See a picture, find the matching word
     - Sign → Word: See a sign language video, find the word
   - Score tracking and immediate feedback

2. **Find the Pair**
   - Memory matching game
   - Two modes:
     - Memory Mode: Cards face down (traditional memory game)
     - Matching Mode: Cards face up (easier for younger children)
   - Match words with pictures
   - Move counter and completion celebration

3. **Who Disappeared?**
   - Memory challenge game
   - Shows 4-6 items for a few seconds
   - One item disappears
   - Child must identify the missing item
   - Adjustable difficulty (item count)

## Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Router**: Vue Router 4
- **UI Library**: PrimeVue 4
- **Icons**: PrimeIcons
- **Build Tool**: Vite
- **Font**: Fredoka (child-friendly, easy to read)

## Project Structure

```
deaf-kids-learning/
├── public/
│   └── assets/
│       ├── images/          # Theme images and game images
│       └── videos/          # Sign language videos
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css     # Global styles
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── ThemeCard.vue
│   │   │   ├── SideMenu.vue
│   │   │   ├── VideoPlayer.vue
│   │   │   └── GameCard.vue
│   │   └── games/           # Game components
│   │       ├── WhoIsIt.vue
│   │       ├── FindPair.vue
│   │       └── WhoDisappeared.vue
│   ├── views/               # Page components
│   │   ├── HomePage.vue
│   │   ├── ThemeDetailPage.vue
│   │   ├── GamesPage.vue
│   │   └── GamePlayPage.vue
│   ├── data/                # Data files
│   │   ├── themes.js
│   │   └── games.js
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── package.json
├── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup Steps

1. **Create the project**:
```bash
npm create vue@latest deaf-kids-learning
# Select: Vue Router - Yes, other options - No
cd deaf-kids-learning
```

2. **Install dependencies**:
```bash
npm install
npm install primevue primeicons @primevue/themes
```

3. **Copy the provided files** into your project structure:
   - Copy all `.vue` files to their respective locations
   - Copy `themes.js` and `games.js` to `src/data/`
   - Copy `main.css` to `src/assets/styles/`
   - Copy `router/index.js` to `src/router/`
   - Update `main.js` and `App.vue`

4. **Add your images and videos**:
   - Place theme images in `public/assets/images/themes/[theme-name]/`
   - Place theme covers in `public/assets/images/theme-covers/`
   - Place sign language videos in `public/assets/videos/sign-language/[theme-name]/`
   - Update paths in `themes.js` to match your files

5. **Run the development server**:
```bash
npm run dev
```

6. **Build for production**:
```bash
npm run build
```

## Design Principles

### Child-Friendly Design
- **Large Touch Targets**: Minimum 44px for easy clicking/tapping
- **Bright Colors**: Eye-catching gradients and vibrant backgrounds
- **Clear Typography**: Fredoka font, large text sizes (1.4rem+)
- **Visual Feedback**: Hover effects, animations, and transitions
- **No Small Text**: All text is large and easy to read

### Responsive Design
- Works on tablets (primary target) and desktop
- Responsive grid layouts
- Touch-friendly on mobile devices
- Adjusts font sizes based on screen size

### Accessibility
- High contrast colors
- Keyboard navigation support
- Focus indicators
- Reduced motion support for users who need it
- Semantic HTML

### User Experience
- **Immediate Feedback**: Visual and audio cues (optional)
- **Progress Tracking**: Scores, rounds, completion status
- **Error Tolerance**: Forgiving game mechanics
- **Celebratory Moments**: Win screens, success animations
- **Easy Navigation**: Back buttons, clear paths

## Customization Guide

### Adding New Themes

Edit `src/data/themes.js`:

```javascript
{
  id: 'new-theme',
  name: 'Theme Name',
  coverImage: '/assets/images/theme-covers/new-theme.jpg',
  backgroundColor: '#FF69B4', // Pick a color
  icon: 'pi pi-star', // PrimeIcons class
  items: [
    {
      id: 'item1',
      name: 'Item Name',
      image: '/assets/images/themes/new-theme/item1.jpg',
      signVideo: '/assets/videos/sign-language/new-theme/item1.MP4',
      signGif: '/assets/videos/sign-language/new-theme/item1.gif',
      description: 'Description of the item'
    }
    // Add more items...
  ]
}
```

### Customizing Colors

The app uses gradient backgrounds. Main gradients:
- **Homepage**: Purple gradient (`#667eea` to `#764ba2`)
- **Games Page**: Pink gradient (`#f093fb` to `#f5576c`)
- **Learning Pages**: Uses theme's `backgroundColor`

Change these in the respective `.vue` files or in `main.css`.

### Adding New Games

1. Create a new component in `src/components/games/`
2. Add game data to `src/data/games.js`
3. Import and register in `GamePlayPage.vue`
4. Follow existing game patterns for consistency

### Changing Fonts

Update `src/assets/styles/main.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

## Content Guidelines

### Images
- **Resolution**: Minimum 800x800px for quality
- **Format**: JPG or PNG
- **Style**: Bright, clear, child-friendly illustrations or photos
- **Consistency**: Similar style across all images in a theme

### Videos/GIFs
- **Duration**: 2-5 seconds per sign
- **Quality**: HD quality (720p minimum)
- **Background**: Clean, uncluttered background
- **Loop**: Videos should loop seamlessly
- **Format**: MP4 for videos, GIF for fallback

### Text
- **Language**: Simple, child-appropriate language
- **Length**: Short descriptions (1-2 sentences)
- **Clarity**: Clear, direct wording

## Game Logic Implementation Notes

### WhoIsIt Component
- Randomly selects items from chosen theme
- Generates 3-4 options with one correct answer
- Shuffles options to prevent patterns
- Tracks score and question progress
- Can be extended with difficulty levels

### FindPair Component
- Creates pairs (word + picture) from theme items
- Shuffles cards randomly
- Implements flip logic with delay
- Tracks matched pairs and moves
- Face-up mode shows all cards (easier)
- Face-down mode is traditional memory game

### WhoDisappeared Component
- Displays items for configurable time (default 5s)
- Randomly hides one item
- Tests visual memory
- Progressive difficulty by adding more items
- Round-based gameplay

## Interaction Patterns

### Menu Navigation
- Click theme card → Navigate to theme detail page
- Click menu item → Show item details in main area
- Back button → Return to homepage
- Previous/Next buttons → Navigate through items

### Game Flow
1. Select game from games page
2. Choose theme and game options
3. Start game
4. Play through rounds/questions
5. See results/feedback
6. Option to play again or return

### Active States
- Selected menu items have different styling
- Clicked options get immediate visual feedback
- Matched items get success animation
- Incorrect answers show gentle error state

## Performance Optimization

- **Lazy Loading**: Consider lazy-loading game components
- **Image Optimization**: Compress images before deployment
- **Video Optimization**: Use appropriate video codecs and compression
- **Code Splitting**: Vite automatically splits code by route

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile devices (responsive, but tablets preferred)

## Future Enhancements

- [ ] Add sound effects and background music
- [ ] Implement user progress tracking
- [ ] Add more game variations
- [ ] Parent/teacher dashboard
- [ ] Multilingual support
- [ ] Offline mode (PWA)
- [ ] Achievement system
- [ ] Custom theme creation tool
- [ ] Print worksheets feature
- [ ] Video recording for practice

## Contributing

When adding content:
1. Follow existing data structure patterns
2. Maintain consistent styling
3. Test on multiple screen sizes
4. Ensure accessibility standards
5. Keep child-friendly design principles

## License

[Your License Here]

## Credits

- Built with Vue 3 and PrimeVue
- Icons by PrimeIcons
- Fonts by Google Fonts

## Support

For questions or issues, please [create an issue](link-to-your-repo/issues).
