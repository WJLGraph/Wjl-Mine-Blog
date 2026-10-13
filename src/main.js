import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { gsap, ScrollTrigger } from './composables/useGsap'
import { initTheme } from './composables/useTheme'
import './assets/styles/main.css'

gsap.registerPlugin(ScrollTrigger)
initTheme()

createApp(App).use(router).mount('#app')
