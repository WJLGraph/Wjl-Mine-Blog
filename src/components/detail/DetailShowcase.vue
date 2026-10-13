<script setup>
/**
 * 详情子页 4：结果图集（仅有截图的项目挂载）
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from '../../composables/useGsap'
import ShotGallery from '../ShotGallery.vue'

defineProps({
  project: { type: Object, required: true }
})

const rootEl = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.d-section', {
      y: 56,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.d-section', start: 'top 90%' }
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
      <div class="ds-label mono">结果图集 / RESULTS GALLERY</div>
      <ShotGallery :shots="project.shots" />
    </div>
  </div>
</template>
