<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../composables/useGsap'
import RepoIcon from './RepoIcon.vue'
import VisualIcon from './VisualIcon.vue'

const props = defineProps({
  project: { type: Object, required: true }
})

/* 卡片直接展示系统真实截图（无截图的项目回退到抽象视觉） */
const shot = computed(() => (props.project.shots && props.project.shots[0]) || null)
const tags = computed(() => (props.project.stackGroups || []).flatMap((g) => g.items).slice(0, 5))

const rootEl = ref(null)
let ctx = null

onMounted(() => {
  // router-link 的 ref 是组件实例，需取其根 DOM 元素
  const el = rootEl.value?.$el || rootEl.value

  ctx = gsap.context(() => {
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' })
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' })
    gsap.set(el, { transformPerspective: 1000 })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    function onMove(e) {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      el.style.setProperty('--mx', mx + 'px')
      el.style.setProperty('--my', my + 'px')
      rotY(((mx / r.width) - 0.5) * 5)
      rotX(-((my / r.height) - 0.5) * 5)
    }

    function onLeave() {
      rotX(0)
      rotY(0)
    }
  }, el)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <router-link
    ref="rootEl"
    :to="`/projects/${project.id}`"
    class="project-card"
    :class="{ featured: project.featured }"
  >
    <div class="card-visual">
      <img v-if="shot" class="v-shot" :src="shot.src" :alt="shot.caption" loading="lazy" />
      <template v-else>
        <div class="v-bg" :class="project.visual"></div>
        <div class="v-lines"></div>
        <div class="v-glow"></div>
        <div class="v-orbit"></div>
        <VisualIcon :icon="project.icon" class="v-icon" />
      </template>
      <div class="v-index">{{ project.index }}</div>
    </div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="card-title">{{ project.name }}</h3>
        <span class="card-year">{{ project.year }}</span>
      </div>
      <p class="card-desc">{{ project.desc }}</p>
      <div class="card-tags">
        <span v-for="t in tags" :key="t">{{ t.toUpperCase() }}</span>
      </div>
      <div class="card-links">
        <span
          v-for="l in project.links.slice(0, 2)"
          :key="l.url"
          class="fake-link"
        >
          <RepoIcon v-if="l.type !== 'text'" :type="l.type" class="repo-ico" />
          {{ l.label }} ↗
        </span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.project-card {
  position: relative;
  display: block;
  border: 1px solid var(--line);
  background: var(--glass);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: border-color 0.4s;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: pointer;
}

.project-card:hover {
  border-color: rgba(158, 203, 255, 0.35);
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(158, 203, 255, 0.09), transparent 55%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  z-index: 3;
}

.project-card:hover::before {
  opacity: 1;
}

.project-card.featured {
  grid-column: span 2;
}

.card-visual {
  height: 210px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.featured .card-visual {
  height: 280px;
}

.card-visual .v-bg {
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 系统真实截图背景 */
.card-visual .v-shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card:hover .v-shot {
  transform: scale(1.06);
}

.card-visual::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(6, 6, 7, 0.55));
  pointer-events: none;
}

.project-card:hover .v-bg {
  transform: scale(1.06);
}

.v-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  opacity: 0.9;
}

.featured .v-orbit {
  width: 230px;
  height: 230px;
}

.card-body {
  padding: 30px 30px 32px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.card-year {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: 2px;
}

.card-desc {
  font-size: 0.92rem;
  font-weight: 300;
  line-height: 1.85;
  color: var(--ink-dim);
  max-width: 640px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.card-tags span {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--accent);
  border: 1px solid rgba(158, 203, 255, 0.22);
  padding: 5px 11px;
  border-radius: 14px;
}

.card-links {
  display: flex;
  gap: 22px;
  margin-top: 22px;
}

.fake-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--ink-dim);
  transition: color 0.3s;
}

.repo-ico {
  width: 15px;
  height: 15px;
}

.project-card:hover .fake-link {
  color: var(--accent);
}
</style>
