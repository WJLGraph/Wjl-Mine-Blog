<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from '../composables/useGsap'
import { splitToChars } from '../composables/useGsap'
import { onPreloaderDone } from '../composables/preloaderBus'

const rootEl = ref(null)
const glowEl = ref(null)
let ctx = null
let mousemove = null

// 与 AboutSection 技术栈严格对应
const tags = ['PYTHON', 'VUE', 'LLM · AGENT', 'DATA-VIZ', 'FASTAPI']

function play() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('#main-title .ch', { yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.045 })
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9 }, '-=0.9')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.hero-tags', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .from('.floating-shape', { scale: 0.6, opacity: 0, duration: 1.6, stagger: 0.15 }, '-=1.2')
}

onMounted(() => {
  // 主标题逐字拆分
  rootEl.value.querySelectorAll('#main-title .line').forEach((line) => splitToChars(line))

  ctx = gsap.context(() => {
    // 初始态（等待预加载结束后播放）
    gsap.set('.hero-eyebrow, .hero-sub, .hero-tags', { opacity: 0, y: 24 })

    // 光晕跟随鼠标
    const glow = glowEl.value
    mousemove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      gsap.to(glow, { x: x * 120, y: y * 120, duration: 1, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', mousemove)

    // 漂浮几何体持续律动
    gsap.utils.toArray('.floating-shape', rootEl.value).forEach((sh, i) => {
      gsap.to(sh, {
        y: 'random(-30, 30)',
        x: 'random(-20, 20)',
        rotation: 'random(-25, 25)',
        duration: 'random(4, 6)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.4
      })
    })

    // 滚动视差
    gsap.to('.floating-shape', {
      scrollTrigger: { trigger: rootEl.value, start: 'top top', end: 'bottom top', scrub: 1 },
      y: 300,
      rotation: 180,
      opacity: 0.15
    })
    gsap.to('.hero-grid', {
      scrollTrigger: { trigger: rootEl.value, start: 'top top', end: 'bottom top', scrub: 1 },
      yPercent: 18,
      opacity: 0.3
    })

    // 滚动叙事：主内容随离场缓缓上浮淡出，交给下一区块
    gsap.to('.hero-content', {
      scrollTrigger: { trigger: rootEl.value, start: 'top top', end: 'bottom 35%', scrub: 0.6 },
      y: -140,
      opacity: 0,
      ease: 'none'
    })

    // 预加载结束后播放入场
    onPreloaderDone(play)
  }, rootEl.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', mousemove)
  if (ctx) ctx.revert()
})
</script>

<template>
  <section ref="rootEl" class="hero">
    <div class="hero-grid"></div>
    <div ref="glowEl" class="bg-glow"></div>
    <div class="floating-shape" id="shape1"></div>
    <div class="floating-shape" id="shape2"></div>
    <div class="floating-shape" id="shape3"></div>

    <div class="hero-content">
      <p class="hero-eyebrow">WJLGRAPH — PERSONAL DIGITAL SPACE / 个人数字空间</p>
      <h1 id="main-title">
        <span class="line solid">CREATIVE</span>
        <span class="line outline">DEVELOPER</span>
      </h1>
      <p class="hero-sub">构建 智能 AGENT · 数据可视化 · 极致前端体验</p>
      <div class="hero-tags mono">
        <span v-for="t in tags" :key="t">{{ t }}</span>
      </div>
    </div>

    <div class="scroll-indicator">SCROLL</div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0 8vw;
}

.bg-glow {
  position: absolute;
  width: 62vw;
  height: 62vh;
  background: radial-gradient(circle, rgba(158, 203, 255, 0.1) 0%, rgba(138, 255, 234, 0.04) 40%, rgba(0, 0, 0, 0) 70%);
  filter: blur(90px);
  border-radius: 50%;
  z-index: 1;
}

.hero-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 75%);
}

.floating-shape {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20% 50% 30% 40%;
  z-index: 2;
}

#shape1 {
  top: 16%;
  left: 12%;
  width: 150px;
  height: 150px;
}

#shape2 {
  bottom: 18%;
  right: 11%;
  width: 230px;
  height: 230px;
  border-radius: 50% 30% 45% 35%;
}

#shape3 {
  top: 24%;
  right: 20%;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border-style: dashed;
  border-color: rgba(158, 203, 255, 0.35);
}

.hero-content {
  z-index: 10;
  text-align: center;
  position: relative;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 5px;
  color: var(--ink-faint);
  margin-bottom: 34px;
}

#main-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 11vw, 8.6rem);
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -2px;
}

#main-title .line {
  display: block;
  overflow: hidden;
}

#main-title .line.outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(242, 242, 240, 0.85);
}

#main-title :deep(.ch) {
  display: inline-block;
}

.hero-sub {
  margin-top: 30px;
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
  font-weight: 300;
  letter-spacing: 6px;
  color: var(--ink-dim);
}

.hero-tags {
  margin-top: 26px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--ink-faint);
}

.hero-tags span {
  border: 1px solid var(--line);
  padding: 7px 14px;
  border-radius: 20px;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ink-faint);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.scroll-indicator::after {
  content: '';
  width: 1px;
  height: 44px;
  background: linear-gradient(var(--ink-faint), transparent);
  animation: drop 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes drop {
  0% {
    transform: scaleY(0);
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
  }
  51% {
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
  }
}

@media (max-width: 900px) {
  .hero-sub {
    letter-spacing: 3px;
  }
}
</style>
