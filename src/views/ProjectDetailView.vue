<script setup>
/**
 * 项目详情页 — 布局壳：头部 / 视觉横幅 / 子页面 Tab 导航 / 上下一篇
 * 具体内容由嵌套路由子页面渲染（overview / architecture / results / showcase）
 */
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap, ScrollTrigger } from '../composables/useGsap'
import { scrollInstant } from '../composables/useSmoothScroll'
import { projects } from '../data/projects'
import RepoIcon from '../components/RepoIcon.vue'
import VisualIcon from '../components/VisualIcon.vue'

const route = useRoute()
const router = useRouter()
const rootEl = ref(null)
const fabEl = ref(null)
const backEl = ref(null)
let ctx = null
let fabSt = null

const prefersReduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
  /* 切换项目后回到页顶：返回按钮状态重置为文字版 */
  if (fabEl.value) {
    gsap.killTweensOf(fabEl.value)
    gsap.set(fabEl.value, { clearProps: 'all' })
  }
  ctx = gsap.context(() => {
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from('.d-head > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 })
      .from('.d-visual', { y: 60, opacity: 0, duration: 1 }, '-=0.55')
      .from('.d-tabs', { y: 24, opacity: 0, duration: 0.8 }, '-=0.5')
    /* 真实项目图 scrub 视差（±6% + 恒定 1.15 缩放防露边）：本区块唯一动效，
       scrub 天然双向可逆，滚动叙事纵深 */
    if (!prefersReduce() && current.value && current.value.hero) {
      gsap.fromTo(
        '.d-visual .v-hero',
        { yPercent: -6, scale: 1.15 },
        {
          yPercent: 6,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: '.d-visual', start: 'top bottom', end: 'bottom top', scrub: 0.5 }
        }
      )
    }
  }, rootEl.value)
  ScrollTrigger.refresh()
}

/* ── 双返回按钮互斥系统 ─────────────────────────────
 * 顶部文字版「← 返回项目列表」是原生锚点；
 * 滚动使其完全离开视口后，右上角方框按钮（FAB）滑入接管；
 * 上滚回到顶部时，FAB 以 FLIP 手势飞回文字版位置并溶解——
 * 任意时刻两者只有一个可见。 */
function showFab() {
  const fab = fabEl.value
  if (!fab) return
  gsap.killTweensOf(fab)
  if (prefersReduce()) return gsap.set(fab, { autoAlpha: 1 })
  gsap.fromTo(
    fab,
    { autoAlpha: 0, x: -18, scale: 0.85 }, /* 左上角：从左侧滑入 */
    { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: true }
  )
}

function hideFab() {
  const fab = fabEl.value
  const back = backEl.value
  if (!fab) return
  gsap.killTweensOf(fab)
  if (prefersReduce() || !back) return gsap.set(fab, { autoAlpha: 0 })
  /* FLIP 归位：测量 FAB 与文字返回键的矩形差，飞回原位并溶解；
   * 结束 clearProps 归还内联样式，回到 CSS 初始隐藏态 */
  const f = fab.getBoundingClientRect()
  const t = back.getBoundingClientRect()
  gsap.to(fab, {
    x: `+=${(t.left + t.width / 2 - (f.left + f.width / 2)).toFixed(1)}`,
    y: `+=${(t.top + t.height / 2 - (f.top + f.height / 2)).toFixed(1)}`,
    scale: Math.min(0.5, Math.max(0.15, t.height / f.height)),
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power3.inOut',
    overwrite: true,
    onComplete: () => gsap.set(fab, { clearProps: 'all' })
  })
}

onMounted(async () => {
  await nextTick()
  playEntrance()
  /* FAB 显隐监听独立于入场 context：入场动画会改触发元素的 y，
     若在 refresh 期间创建会算错位置；入场完成后再由固定布局测量 */
  fabSt = ScrollTrigger.create({
    trigger: backEl.value,
    start: 'bottom -32', // 文字返回键完全离开视口上方 32px 后 FAB 接管
    onEnter: showFab,
    onLeaveBack: hideFab
  })
})

watch(
  () => route.params.id,
  async (nv, ov) => {
    if (nv && ov && nv !== ov) {
      await nextTick()
      scrollInstant(0)
      playEntrance()
    }
  }
)

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
  if (fabSt) fabSt.kill()
  if (fabEl.value) gsap.killTweensOf(fabEl.value)
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
      <router-link to="/" custom v-slot="{ href, navigate }">
        <a :href="href" ref="backEl" class="back mono" @click="navigate">← 返回项目列表</a>
      </router-link>
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
    <!-- 左上角方框返回键（Teleport 到 body：App 转场会给页面根加 transform，
         会劫持 fixed 定位使其随页滚动，故必须挂在组件树之外；
         Teleport 置于 main 内部保持组件单根，避免破坏 <Transition>） -->
    <Teleport to="body">
      <button
        ref="fabEl"
        class="fab-back"
        type="button"
        aria-label="返回项目列表"
        title="返回项目列表"
        @click="router.push('/')"
      >←</button>
    </Teleport>
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
  color: var(--ink-dim);
  margin-bottom: 40px;
  padding: 12px 20px;
  border: 1px solid var(--line);
  transition: color 0.3s, border-color 0.3s;
}

.back:hover {
  color: var(--accent);
  border-color: var(--accent);
}

/* 左上角方框返回键：与导航 logo 同列对齐（logo left 50px），位于导航下方；
   与顶部文字版互斥，飞回动画由 GSAP 驱动
   （transition 只允许 color/border，transform 归 GSAP 所有，防止双动画源打架） */
.fab-back {
  position: fixed;
  top: 92px;
  left: 50px;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 17px;
  color: var(--ink-dim);
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg-2) 72%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  z-index: 880; /* 低于导航 900，不遮顶部条 */
  transition: color 0.3s, border-color 0.3s;
}

.fab-back:hover {
  color: var(--accent);
  border-color: var(--accent);
}

@media (max-width: 700px) {
  .fab-back {
    top: 78px;
    left: 24px; /* 与 <900px 时导航 padding 对齐 */
    width: 40px;
    height: 40px;
    font-size: 15px;
  }
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
