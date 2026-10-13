<script setup>
/**
 * 详情子页 3：实现效果 + 解决问题 + 核心难点 + 关键指标
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
      <div class="ds-label mono">实现效果 / RESULTS</div>
      <div class="effect-grid">
        <div v-for="(e, i) in project.effects" :key="e.title" class="effect-card">
          <div class="e-num mono">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="e-title">{{ e.title }}</h3>
          <p class="e-desc">{{ e.desc }}</p>
        </div>
      </div>
    </div>

    <div class="d-section">
      <div class="ds-label mono">解决问题 / PROBLEMS SOLVED</div>
      <div class="problem-list">
        <div v-for="p in project.problems" :key="p.problem" class="p-row">
          <div class="p-problem">
            <span class="p-badge mono">!</span>
            <span>{{ p.problem }}</span>
          </div>
          <div class="p-arrow mono">→</div>
          <div class="p-solution">{{ p.solution }}</div>
        </div>
      </div>
    </div>

    <div class="d-section">
      <div class="ds-label mono">核心难点 / KEY CHALLENGES</div>
      <div class="diff-list">
        <div v-for="(df, i) in project.difficulties" :key="df.title" class="diff-card">
          <div class="diff-num mono">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="diff-body">
            <h3 class="diff-title">{{ df.title }}</h3>
            <p class="diff-desc">{{ df.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="project.metrics && project.metrics.length" class="d-section">
      <div class="ds-label mono">关键指标 / METRICS</div>
      <div class="metric-grid" :style="{ '--cols': project.metrics.length }">
        <div v-for="m in project.metrics" :key="m.label" class="metric-card">
          <div class="m-val mono">{{ m.value }}</div>
          <div class="m-label mono">{{ m.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff-body {
  flex: 1;
}
</style>
