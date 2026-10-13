<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from '../composables/useGsap'
import { markPreloaderDone } from '../composables/preloaderBus'

const emit = defineEmits(['done'])
const count = ref(0)
const rootEl = ref(null)

onMounted(() => {
  const counter = { v: 0 }
  const countEl = rootEl.value.querySelector('.pl-count')
  const barEl = rootEl.value.querySelector('.pl-bar i')

  const tl = gsap.timeline({
    onComplete: () => emit('done')
  })

  tl.to(counter, {
    v: 100,
    duration: 1.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      count.value = Math.round(counter.v)
      countEl.textContent = Math.round(counter.v)
      barEl.style.transform = `scaleX(${counter.v / 100})`
    }
  })
    .add(() => markPreloaderDone()) // 揭幕开始时通知 Hero 播放入场
    .to(rootEl.value, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' })
})
</script>

<template>
  <div ref="rootEl" class="preloader">
    <div class="pl-name">WJL · PORTFOLIO</div>
    <div class="pl-count">{{ count }}</div>
    <div class="pl-bar"><i></i></div>
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 18px;
}

.pl-name {
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 8px;
  color: var(--ink-dim);
}

.pl-count {
  font-family: var(--font-mono);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 300;
  color: var(--ink);
}

.pl-bar {
  width: 180px;
  height: 1px;
  background: var(--line);
  position: relative;
  overflow: hidden;
}

.pl-bar i {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform: scaleX(0);
  transform-origin: left;
}
</style>
