<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { gsap, ScrollTrigger } from './composables/useGsap'
import PreLoader from './components/PreLoader.vue'
import CustomCursor from './components/CustomCursor.vue'
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
const showPreloader = ref(true)

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
