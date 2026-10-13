<script setup>
/**
 * 详情子页 1：项目概述 + 核心功能
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from '../../composables/useGsap'

defineProps({
  project: { type: Object, required: true }
})

const rootEl = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.utils.toArray('.d-section').forEach((sec) => {
      gsap.from(sec, {
        y: 56,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: sec, start: 'top 90%' }
      })
    })
  }, rootEl.value)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div ref="rootEl" class="detail-page">
    <div class="d-section">
      <div class="ds-label mono">项目概述 / OVERVIEW</div>
      <p v-for="(p, i) in project.overview" :key="i" class="ds-para">{{ p }}</p>
    </div>

    <div class="d-section">
      <div class="ds-label mono">核心功能 / FEATURES</div>
      <div class="feature-grid">
        <div v-for="(f, i) in project.features" :key="f.title" class="feature-card">
          <div class="f-num mono">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="f-title">{{ f.title }}</h3>
          <p class="f-desc">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
