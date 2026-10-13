<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../composables/useGsap'

const dot = { x: null, y: null }
const ring = { x: null, y: null }
let mousemove = null

onMounted(() => {
  const dotEl = document.getElementById('cursor-dot')
  const ringEl = document.getElementById('cursor-ring')
  if (!dotEl || !ringEl) return

  const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'power2.out' })
  const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'power2.out' })
  const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.35, ease: 'power2.out' })
  const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.35, ease: 'power2.out' })

  mousemove = (e) => {
    dotX(e.clientX - 3)
    dotY(e.clientY - 3)
    ringX(e.clientX - 18)
    ringY(e.clientY - 18)
  }
  window.addEventListener('mousemove', mousemove)

  /* 可交互元素 hover 时放大光圈（事件委托，路由切换后依然有效） */
  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
})

function onOver(e) {
  if (e.target.closest('a, button, .project-card, .skill-tags span')) {
    const ringEl = document.getElementById('cursor-ring')
    if (ringEl) {
      ringEl.style.width = '58px'
      ringEl.style.height = '58px'
      ringEl.style.opacity = '0.4'
    }
  }
}

function onOut(e) {
  if (e.target.closest('a, button, .project-card, .skill-tags span')) {
    const ringEl = document.getElementById('cursor-ring')
    if (ringEl) {
      ringEl.style.width = '36px'
      ringEl.style.height = '36px'
      ringEl.style.opacity = '1'
    }
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseover', onOver)
  document.removeEventListener('mouseout', onOut)
})
</script>

<template>
  <div>
    <div id="cursor-dot" class="cursor-dot"></div>
    <div id="cursor-ring" class="cursor-ring"></div>
  </div>
</template>

<style scoped>
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}

.cursor-dot {
  width: 6px;
  height: 6px;
  background: #fff;
}

.cursor-ring {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: width 0.3s, height 0.3s, opacity 0.3s;
}

@media (hover: none) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}
</style>
