<script setup>
/**
 * 项目效果图画廊 — 网格布局 + 点击放大 lightbox
 * 支持 Esc 关闭、左右方向键切换
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  shots: { type: Array, default: () => [] }
})

const active = ref(-1)

function open(i) {
  active.value = i
}

function close() {
  active.value = -1
}

function step(dir) {
  if (active.value < 0) return
  const n = props.shots.length
  active.value = (active.value + dir + n) % n
}

function onKey(e) {
  if (active.value < 0) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

watch(active, (v) => {
  document.body.style.overflow = v >= 0 ? 'hidden' : ''
})
</script>

<template>
  <div class="gallery">
    <figure v-for="(s, i) in shots" :key="s.src" class="shot" @click="open(i)">
      <div class="shot-img">
        <img :src="s.src" :alt="s.caption" loading="lazy" />
        <div class="shot-zoom mono">放大查看</div>
      </div>
      <figcaption class="shot-cap mono">{{ String(i + 1).padStart(2, '0') }} · {{ s.caption }}</figcaption>
    </figure>

    <Teleport to="body">
      <Transition name="lb">
        <div v-if="active >= 0" class="lightbox" @click="close">
          <button class="lb-close mono" @click.stop="close">✕ ESC</button>
          <button class="lb-arrow left mono" @click.stop="step(-1)">←</button>
          <img :src="shots[active].src" :alt="shots[active].caption" @click.stop />
          <button class="lb-arrow right mono" @click.stop="step(1)">→</button>
          <div class="lb-cap mono">{{ String(active + 1).padStart(2, '0') }} / {{ String(shots.length).padStart(2, '0') }} · {{ shots[active].caption }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.shot {
  cursor: zoom-in;
}

.shot-img {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  aspect-ratio: 16 / 9;
}

.shot-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
}

.shot:hover .shot-img img {
  transform: scale(1.04);
}

.shot-zoom {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--accent);
  border: 1px solid rgba(158, 203, 255, 0.35);
  background: var(--chip-bg);
  backdrop-filter: blur(6px);
  padding: 6px 12px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
}

.shot:hover .shot-zoom {
  opacity: 1;
  transform: translateY(0);
}

.shot-cap {
  margin-top: 12px;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--ink-faint);
  transition: color 0.3s;
}

.shot:hover .shot-cap {
  color: var(--ink-dim);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--overlay);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5vh 5vw;
}

.lightbox img {
  max-width: 82vw;
  max-height: 78vh;
  border: 1px solid rgba(158, 203, 255, 0.25);
  box-shadow: 0 0 80px rgba(158, 203, 255, 0.08);
}

.lb-cap {
  position: absolute;
  bottom: 3.5vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--ink-dim);
  white-space: nowrap;
}

.lb-close {
  position: absolute;
  top: 24px;
  right: 28px;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--ink-faint);
  background: none;
  border: 1px solid var(--line);
  padding: 10px 16px;
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s;
}

.lb-close:hover {
  color: var(--accent);
  border-color: rgba(158, 203, 255, 0.4);
}

.lb-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--ink-dim);
  background: none;
  border: 1px solid var(--line);
  width: 46px;
  height: 46px;
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s;
}

.lb-arrow:hover {
  color: var(--accent);
  border-color: rgba(158, 203, 255, 0.4);
}

.lb-arrow.left {
  left: 3vw;
}

.lb-arrow.right {
  right: 3vw;
}

/* 过渡 */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.3s;
}

.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .gallery {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .lb-arrow.left {
    left: 8px;
  }
  .lb-arrow.right {
    right: 8px;
  }
}
</style>
