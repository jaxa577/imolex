import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ThemeDetailPage from '@/views/ThemeDetailPage.vue'
import GamesPage from '@/views/GamesPage.vue'
import GamePlayPage from '@/views/GamePlayPage.vue'
import i18n from '@/i18n'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      titleKey: 'routes.home'
    }
  },
  {
    path: '/theme/:themeId',
    name: 'theme-detail',
    component: ThemeDetailPage,
    meta: {
      titleKey: 'routes.learning'
    }
  },
  {
    path: '/games',
    name: 'games',
    component: GamesPage,
    meta: {
      titleKey: 'routes.games'
    }
  },
  {
    path: '/games/:gameId',
    name: 'game-play',
    component: GamePlayPage,
    meta: {
      titleKey: 'routes.playGame'
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
  const { t } = i18n.global
  document.title = to.meta.titleKey ? t(to.meta.titleKey) : t('routes.home')
  next()
})

export default router
