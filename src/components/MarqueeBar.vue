<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger } from '../composables/useGsap'

// 分隔符直接编入序列，单一 v-for 保证文字与 ✦ 交错
// 标签与 AboutSection 技术栈严格对齐，不出现栈外词汇
const items = [
  'PYTHON',
  '✦',
  'VUE',
  '✦',
  'LLM · AGENT',
  '✦',
  'LANGGRAPH',
  '✦',
  'MULTI-AGENT',
  '✦',
  'RAG',
  '✦',
  'MCP',
  '✦',
  'FASTAPI',
  '✦',
  'POSTGRESQL',
  '✦',
  'OPENLAYERS',
  '✦',
  'GIS',
  '✦',
  'THREE.JS',
  '✦',
  'DATA-VIZ',
  '✦',
  'ECHARTS',
  '✦',
  'SCIKIT-LEARN',
  '✦',
  'INFORMER',
  '✦',
  'TIME-SERIES',
  '✦',
  'RECOMMEND SYSTEM',
  '✦',
  'MINI-PROGRAM',
  '✦',
  'PROMPT ENGINEERING',
  '✦',
  'GSAP',
  '✦'
]

const rootEl = ref(null)
let ctx = null
let decay = null
let st = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = gsap.context(() => {
    // 无限循环改由 GSAP 驱动，timeScale 可被滚动速度实时调制
    const loop = gsap.to('.marquee-track', {
      xPercent: -50,
      ease: 'none',
      duration: 44,
      repeat: -1
    })

    const clampTs = gsap.utils.clamp(-4, 4)
    let current = 1
    let target = 1

    // 滚动越快字幕越快，回滚时反向——让字幕"活着"
    st = ScrollTrigger.create({
      onUpdate: (self) => {
        target = clampTs(1 + self.getVelocity() / 1200)
      }
    })

    decay = () => {
      current += (target - current) * 0.06
      target += (1 - target) * 0.05
      loop.timeScale(current)
    }
    gsap.ticker.add(decay)
  }, rootEl.value)
})

onBeforeUnmount(() => {
  if (decay) gsap.ticker.remove(decay)
  if (st) st.kill()
  if (ctx) ctx.revert()
})
</script>

<template>
  <div class="marquee" ref="rootEl">
    <div class="marquee-track">
      <template v-for="n in 2" :key="n">
        <span v-for="(t, i) in items" :key="`${n}-${i}`" :class="{ star: t === '✦' }">{{ t }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  padding: 22px 0;
  white-space: nowrap;
  background: var(--bg-2);
}

.marquee-track {
  display: inline-flex;
  gap: 56px;
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 5px;
  color: var(--ink-faint);
  align-items: center;
  will-change: transform;
}

.marquee-track .star {
  color: var(--accent);
  font-size: 10px;
}
</style>
