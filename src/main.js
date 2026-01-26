import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// PrimeVue components (register globally the most used ones)
import Button from 'primevue/button'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

// PrimeVue styles
import 'primeicons/primeicons.css'

// Custom styles
import './assets/styles/main.css'

const app = createApp(App)

// Configure PrimeVue with child-friendly theme
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false,
      cssLayer: false
    }
  },
  ripple: true // Enable ripple effect for better interaction feedback
})

app.use(router)
app.use(i18n)

// Register global components
app.component('Button', Button)
app.component('Card', Card)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app')
