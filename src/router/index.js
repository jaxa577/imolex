import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ThemeDetailPage from '@/views/ThemeDetailPage.vue'
import GamesPage from '@/views/GamesPage.vue'
import GamePlayPage from '@/views/GamePlayPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      title: 'Learn Sign Language'
    }
  },
  {
    path: '/theme/:themeId',
    name: 'theme-detail',
    component: ThemeDetailPage,
    meta: {
      title: 'Learning'
    }
  },
  {
    path: '/games',
    name: 'games',
    component: GamesPage,
    meta: {
      title: 'Games'
    }
  },
  {
    path: '/games/:gameId',
    name: 'game-play',
    component: GamePlayPage,
    meta: {
      title: 'Play Game'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title based on route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Learn Sign Language'
  next()
})

export default router
