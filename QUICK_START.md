# Quick Start Guide

Get your deaf children's educational website up and running in minutes!

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- A code editor (VS Code recommended)

## Installation (5 minutes)

### Step 1: Create Vue Project

```bash
npm create vue@latest deaf-kids-learning
```

When prompted:
- Project name: `deaf-kids-learning`
- Add TypeScript? **No**
- Add JSX? **No**
- Add Vue Router? **Yes** ✓
- Add Pinia? **No**
- Add Vitest? **No**
- Add ESLint? **Yes** (optional)

```bash
cd deaf-kids-learning
```

### Step 2: Install Dependencies

```bash
npm install
npm install primevue primeicons @primevue/themes
```

### Step 3: Copy Project Files

Copy all the provided files from the `dictionary` folder into your project:

```
Your project/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          ← Copy this
│   ├── components/
│   │   ├── common/               ← Copy entire folder
│   │   └── games/                ← Copy entire folder
│   ├── data/                     ← Copy entire folder
│   │   ├── themes.js
│   │   └── games.js
│   ├── router/
│   │   └── index.js              ← Replace this
│   ├── views/                    ← Copy entire folder
│   ├── App.vue                   ← Replace this
│   └── main.js                   ← Replace this
├── package.json                  ← Update dependencies
├── vite.config.js                ← Replace this
└── README.md                     ← Copy this
```

### Step 4: Add Sample Images

Create placeholder folders and add some sample images:

```bash
mkdir -p public/assets/images/theme-covers
mkdir -p public/assets/images/themes/family
mkdir -p public/assets/images/themes/animals
mkdir -p public/assets/images/themes/fruits
mkdir -p public/assets/videos/sign-language/family
```

**Quick tip**: Use free stock images from:
- Unsplash.com
- Pexels.com
- Pixabay.com

### Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## What You Should See

1. **Homepage**: Colorful cards for Family, Animals, Fruits, Colors themes
2. **Theme Pages**: Click a card to see the learning interface with video player
3. **Games**: Click "Play Games!" to see game selection
4. **Game Play**: Choose a game, select a theme, and start playing!

## Common Issues & Solutions

### Issue: Videos not loading
**Solution**: Make sure video files are in `public/assets/videos/` and paths in `themes.js` match exactly.

### Issue: Images not showing
**Solution**: All asset paths should start with `/assets/` and files must be in the `public/` folder.

### Issue: Blank page
**Solution**: Check browser console (F12) for errors. Likely a missing import or typo in a component.

### Issue: Styles look wrong
**Solution**: Make sure `main.css` is imported in `main.js` and PrimeVue is properly configured.

### Issue: Router not working
**Solution**: Verify `router/index.js` is imported in `main.js` with `app.use(router)`.

## Next Steps

### 1. Add Your Content (30 minutes)

Replace placeholder data in `src/data/themes.js`:

```javascript
{
  id: 'family',
  name: 'Family',
  coverImage: '/assets/images/theme-covers/family.jpg', // Your image
  backgroundColor: '#FFB6C1',
  icon: 'pi pi-users',
  items: [
    {
      id: 'mother',
      name: 'Mother',
      image: '/assets/images/themes/family/mother.jpg',  // Your image
      signVideo: '/assets/videos/sign-language/family/mother.MP4', // Your video
      signGif: '/assets/videos/sign-language/family/mother.gif',
      description: 'A person who takes care of you'
    }
    // Add more family members...
  ]
}
```

### 2. Customize Colors (10 minutes)

Update theme colors in `themes.js` and gradient backgrounds in component styles:

```javascript
// In themes.js
backgroundColor: '#YOUR_HEX_COLOR'

// In HomePage.vue (for main background)
background: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
```

### 3. Test on Devices (15 minutes)

- Open on tablet (primary target device)
- Test on phone (should work but not optimal)
- Click every button
- Play each game
- Navigate back and forth
- Check video playback

### 4. Get Feedback (ongoing)

- Show to a child (if possible)
- Show to teachers/parents
- Watch how they interact
- Note confusion points
- Iterate on design

## File Structure Overview

```
Key Files:
├── src/main.js              → App entry, PrimeVue config
├── src/App.vue              → Root component
├── src/router/index.js      → Route definitions
│
├── Data:
├── src/data/themes.js       → Learning content
├── src/data/games.js        → Game configurations
│
├── Pages:
├── src/views/HomePage.vue           → Theme selection
├── src/views/ThemeDetailPage.vue    → Learning interface
├── src/views/GamesPage.vue          → Game selection
├── src/views/GamePlayPage.vue       → Game container
│
├── Reusable Components:
├── src/components/common/ThemeCard.vue    → Theme display cards
├── src/components/common/SideMenu.vue     → Navigation menu
├── src/components/common/VideoPlayer.vue  → Sign language videos
├── src/components/common/GameCard.vue     → Game selection cards
│
└── Game Components:
    ├── src/components/games/WhoIsIt.vue        → Multiple choice game
    ├── src/components/games/FindPair.vue       → Memory matching game
    └── src/components/games/WhoDisappeared.vue → Missing item game
```

## Customization Quick Reference

### Change Main Title
**File**: `src/views/HomePage.vue`
```vue
<h1 class="main-title">
  Your Custom Title Here
</h1>
```

### Add a New Theme
**File**: `src/data/themes.js`
```javascript
export const themes = [
  // ... existing themes
  {
    id: 'numbers',
    name: 'Numbers',
    coverImage: '/assets/images/theme-covers/numbers.jpg',
    backgroundColor: '#FFB347',
    icon: 'pi pi-hashtag',
    items: [/* your items */]
  }
]
```

### Change Font
**File**: `src/assets/styles/main.css`
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

### Adjust Animation Speed
**File**: Component `.vue` files
```css
.card {
  transition: all 0.3s ease; /* Change 0.3s to your preferred speed */
}
```

## Build for Production

When ready to deploy:

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

### Deploy Options

**Free hosting options**:
- Netlify: Drag-and-drop `dist` folder
- Vercel: Connect GitHub repo
- GitHub Pages: Enable in repo settings
- Firebase Hosting: `firebase deploy`

## Getting Help

### Documentation
- This README
- `IMPLEMENTATION_GUIDE.md` - Detailed technical guide
- `DESIGN_DECISIONS.md` - Design rationale
- `PROJECT_STRUCTURE.md` - File organization

### External Resources
- Vue 3 Docs: https://vuejs.org
- PrimeVue Docs: https://primevue.org
- PrimeIcons: https://primevue.org/icons

### Troubleshooting Steps
1. Check browser console (F12) for errors
2. Verify all files are in correct locations
3. Ensure paths match exactly (case-sensitive)
4. Clear browser cache (Ctrl+Shift+R)
5. Restart dev server

## Development Workflow

```bash
# Start development server
npm run dev

# Check for linting errors
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Tips for Success

1. **Start Small**: Get one theme working perfectly before adding more
2. **Test Often**: Check changes immediately in browser
3. **Use Real Content**: Placeholder content doesn't show real UX issues
4. **Get Feedback Early**: Show to users as soon as possible
5. **Iterate**: Make small improvements based on feedback
6. **Document Changes**: Keep notes on what works and what doesn't

## Congratulations!

You now have a fully functional educational website for deaf children.

The foundation is solid, and you can:
- Add unlimited themes and content
- Customize the design to your needs
- Extend with new games
- Integrate with backend systems
- Track user progress
- Deploy to production

**Next**: Read `IMPLEMENTATION_GUIDE.md` for detailed customization instructions.

Happy building! 🚀
