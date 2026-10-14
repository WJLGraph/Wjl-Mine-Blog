<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { gsap, ScrollTrigger } from './composables/useGsap'
import { initSmoothScroll } from './composables/useSmoothScroll'
import PreLoader from './components/PreLoader.vue'
import CustomCursor from './components/CustomCursor.vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
const showPreloader = ref(true)
const progressEl = ref(null)

onMounted(() => {
  initSmoothScroll()
  // 顶部阅读进度条：scrub 跟随全页滚动
  if (progressEl.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(
      progressEl.value,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
      }
    )
  }
})

/* 路由切换过渡（GSAP JS 钩子） */
function onEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 26 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      onComplete: () => {
        ScrollTrigger.refresh()
        done()
      }
    }
  )
}

function onLeave(el, done) {
  gsap.to(el, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', onComplete: done })
}
</script>

<template>
  <div class="scroll-progress" ref="progressEl" aria-hidden="true"></div>
  <CustomCursor />
  <PreLoader v-if="showPreloader" @done="showPreloader = false" />
  <SiteNav />
  <router-view v-slot="{ Component }">
    <transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
      <!-- key 取一级路由：详情页子 tab 切换时不重挂整页 -->
      <component :is="Component" :key="route.matched[0] ? route.matched[0].path : route.fullPath" />
    </transition>
  </router-view>
  <SiteFooter />
  <div class="noise"></div>
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 950;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform-origin: left center;
  transform: scaleX(0);
  pointer-events: none;
}
</style>
