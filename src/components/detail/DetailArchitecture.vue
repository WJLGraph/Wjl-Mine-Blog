<script setup>
/**
 * 详情子页 2：系统架构（SVG 架构图）+ 技术栈分组
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from '../../composables/useGsap'
import ArchDiagram from '../ArchDiagram.vue'

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
      <div class="ds-label mono">系统架构 / ARCHITECTURE</div>
      <p v-for="(p, i) in project.archDesc" :key="i" class="ds-para">{{ p }}</p>
      <ArchDiagram :id="project.id" />
    </div>

    <div class="d-section">
      <div class="ds-label mono">技术栈 / STACK</div>
      <div class="stack-groups">
        <div v-for="g in project.stackGroups" :key="g.group" class="stack-row">
          <div class="sg-name mono">{{ g.group }}</div>
          <div class="sg-tags">
            <span v-for="t in g.items" :key="t" class="sg-tag">{{ t }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
