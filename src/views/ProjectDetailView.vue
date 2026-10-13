<script setup>
/**
 * 项目详情页 — 布局壳：头部 / 视觉横幅 / 子页面 Tab 导航 / 上下一篇
 * 具体内容由嵌套路由子页面渲染（overview / architecture / results / showcase）
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap, ScrollTrigger } from '../composables/useGsap'
import { projects } from '../data/projects'
import RepoIcon from '../components/RepoIcon.vue'
import VisualIcon from '../components/VisualIcon.vue'

const route = useRoute()
const router = useRouter()
const rootEl = ref(null)
let ctx = null

const current = computed(() => projects.find((p) => p.id === route.params.id))
const idx = computed(() => projects.findIndex((p) => p.id === route.params.id))
const prev = computed(() => (idx.value > 0 ? projects[idx.value - 1] : null))
const next = computed(() => (idx.value < projects.length - 1 ? projects[idx.value + 1] : null))

/* 未知项目 id → 回首页 */
watch(
  current,
  (v) => {
    if (!v) router.replace('/')
  },
  { immediate: true }
)

/* 子页面 Tab（无效果图的项目不显示图集；所有项目均有文档页） */
const tabs = computed(() => {
  const t = [
    { name: 'project-overview', path: '', label: '概览' },
    { name: 'project-architecture', path: 'architecture', label: '架构与技术' },
    { name: 'project-results', path: 'results', label: '成果与难点' }
  ]
  if (current.value && current.value.shots && current.value.shots.length) {
    t.push({ name: 'project-showcase', path: 'showcase', label: '结果图集' })
  }
  t.push({ name: 'project-docs', path: 'docs', label: '项目文档' })
  return t
})

function tabTo(t) {
  return `/projects/${current.value.id}${t.path ? '/' + t.path : ''}`
}

function playEntrance() {
  if (ctx) ctx.revert()
  ctx = gsap.context(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('.d-head > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 })
      .from('.d-visual', { y: 60, opacity: 0, duration: 1 }, '-=0.55')
      .from('.d-tabs', { y: 24, opacity: 0, duration: 0.8 }, '-=0.5')
  }, rootEl.value)
  ScrollTrigger.refresh()
}

onMounted(async () => {
  await nextTick()
  playEntrance()
})

watch(
  () => route.params.id,
  async (nv, ov) => {
    if (nv && ov && nv !== ov) {
      await nextTick()
      window.scrollTo({ top: 0, behavior: 'auto' })
      playEntrance()
    }
  }
)

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})

/* 子页面切换过渡 */
function onEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 26 },
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'expo.out',
      onComplete: () => {
        ScrollTrigger.refresh()
        done()
      }
    }
  )
}

function onLeave(el, done) {
  gsap.to(el, { opacity: 0, y: -16, duration: 0.25, ease: 'power2.in', onComplete: done })
}
</script>

<template>
  <main v-if="current" ref="rootEl" class="detail">
    <!-- 头部 -->
    <div class="d-head">
      <router-link to="/" class="back mono">← 返回项目列表</router-link>
      <div class="d-index mono">PROJECT {{ current.index }} / {{ String(projects.length).padStart(2, '0') }} · {{ current.en }}</div>
      <h1 class="d-title">{{ current.name }}</h1>
      <p class="d-tagline">{{ current.tagline }}</p>
      <div class="d-meta">
        <div class="meta-item">
          <span class="meta-label">周期 PERIOD</span>
          <span class="meta-val">{{ current.period }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">角色 ROLE</span>
          <span class="meta-val">{{ current.role }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">状态 STATUS</span>
          <span class="meta-val accent">{{ current.status }}</span>
        </div>
      </div>
      <div class="d-links">
        <a
          v-for="l in current.links"
          :key="l.url"
          class="btn-ghost"
          :href="l.url"
          target="_blank"
          rel="noopener"
        >
          <RepoIcon :type="l.type" class="link-ico" />
          {{ l.label }} ↗
        </a>
      </div>
    </div>

    <!-- 视觉横幅：有真实项目图则展示图片，否则回退抽象视觉 -->
    <div class="d-visual">
      <template v-if="current.hero">
        <img class="v-hero" :src="current.hero" :alt="current.name" loading="lazy" />
        <div class="v-hero-shade"></div>
        <div class="v-index">{{ current.index }}</div>
      </template>
      <template v-else>
        <div class="v-bg" :class="current.visual"></div>
        <div class="v-lines"></div>
        <div class="v-glow"></div>
        <div class="v-orbit"></div>
        <VisualIcon :icon="current.icon" class="d-icon" />
        <div class="v-index">{{ current.index }}</div>
      </template>
    </div>

    <!-- 子页面导航 -->
    <div class="d-tabs">
      <router-link
        v-for="t in tabs"
        :key="t.name"
        :to="tabTo(t)"
        class="tab mono"
        :class="{ active: route.name === t.name }"
      >{{ t.label }}</router-link>
    </div>

    <!-- 子页面出口 -->
    <router-view v-slot="{ Component }">
      <transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
        <component :is="Component" :key="route.fullPath" :project="current" />
      </transition>
    </router-view>

    <!-- 上一篇 / 下一篇 -->
    <div class="d-nav">
      <router-link v-if="prev" :to="`/projects/${prev.id}`" class="nav-card">
        <span class="mono nav-dir">← PREV</span>
        <span class="nav-name">{{ prev.name }}</span>
      </router-link>
      <span v-else class="nav-card empty"></span>
      <router-link v-if="next" :to="`/projects/${next.id}`" class="nav-card right">
        <span class="mono nav-dir">NEXT →</span>
        <span class="nav-name">{{ next.name }}</span>
      </router-link>
      <span v-else class="nav-card empty"></span>
    </div>
  </main>
</template>

<style scoped>
.detail {
  padding: 160px 8vw 80px;
  min-height: 100vh;
}

/* 头部 */
.back {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--ink-faint);
  margin-bottom: 40px;
  transition: color 0.3s;
}

.back:hover {
  color: var(--accent);
}

.d-index {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--accent);
  margin-bottom: 18px;
}

.d-title {
  font-size: clamp(2.2rem, 5.5vw, 4.4rem);
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.1;
}

.d-tagline {
  margin-top: 16px;
  font-size: clamp(0.95rem, 1.6vw, 1.15rem);
  font-weight: 300;
  letter-spacing: 2px;
  color: var(--ink-dim);
}

.d-meta {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  margin-top: 36px;
  border-top: 1px solid var(--line);
  padding-top: 28px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ink-faint);
}

.meta-val {
  font-size: 0.9rem;
  color: var(--ink);
}

.meta-val.accent {
  color: var(--accent);
}

.d-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
}

.link-ico {
  width: 15px;
  height: 15px;
}

/* 视觉横幅 */
.d-visual {
  height: 360px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  margin-top: 56px;
}

/* 真实项目图横幅 */
.v-hero {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.v-hero-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(8, 12, 20, 0.08) 0%, rgba(8, 12, 20, 0) 35%, rgba(8, 12, 20, 0.55) 100%),
    linear-gradient(90deg, rgba(8, 12, 20, 0.28) 0%, rgba(8, 12, 20, 0) 45%);
  pointer-events: none;
}

.d-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.d-visual .v-orbit {
  width: 280px;
  height: 280px;
}

/* 子页面 Tab */
.d-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 44px;
  border-bottom: 1px solid var(--line);
}

.tab {
  position: relative;
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--ink-faint);
  padding: 16px 22px;
  transition: color 0.3s;
}

.tab::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform: scaleX(0);
  transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
}

.tab:hover {
  color: var(--ink-dim);
}

.tab.active {
  color: var(--ink);
}

.tab.active::after {
  transform: scaleX(1);
}

/* 上 / 下篇 */
.d-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 110px;
}

.nav-card {
  border: 1px solid var(--line);
  background: var(--glass);
  padding: 28px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.3s, transform 0.3s;
}

.nav-card.right {
  text-align: right;
  align-items: flex-end;
}

.nav-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
}

.nav-card.empty {
  visibility: hidden;
}

.nav-dir {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ink-faint);
}

.nav-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink-dim);
  transition: color 0.3s;
}

.nav-card:hover .nav-name {
  color: var(--ink);
}

@media (max-width: 900px) {
  .detail {
    padding: 130px 6vw 60px;
  }
  .d-nav {
    grid-template-columns: 1fr;
  }
  .d-visual {
    height: 240px;
  }
  .tab {
    padding: 14px 14px;
    letter-spacing: 2px;
    font-size: 11px;
  }
}
</style>
