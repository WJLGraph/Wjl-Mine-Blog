<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap, ScrollTrigger } from '../composables/useGsap'
import { projects } from '../data/projects'
import HeroSection from '../components/HeroSection.vue'
import MarqueeBar from '../components/MarqueeBar.vue'
import AboutSection from '../components/AboutSection.vue'
import CodeLabSection from '../components/CodeLabSection.vue'
import ProjectCard from '../components/ProjectCard.vue'
import TimelineSection from '../components/TimelineSection.vue'
import ContactSection from '../components/ContactSection.vue'
import { scrambleIn } from '../composables/useScramble'
import { magnetic } from '../composables/useMagnetic'

const rootEl = ref(null)
let ctx = null
let magneticCleanups = []

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    // 通用滚动显现：上滑越过起点时反向收回，双向都有呼应
    const REV = 'play none none reverse'
    gsap.utils.toArray('.reveal', rootEl.value).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: REV },
        y: 56,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
      })
    })

    // 区块大标题：保留滑入，双向可逆
    gsap.utils.toArray('.sec-title', rootEl.value).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: REV },
        x: -36,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
      })
    })

    // 区块小标签：淡入 + 解码乱码（解码只触发一次，淡入双向可逆）
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.utils.toArray('.sec-label', rootEl.value).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: REV },
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      })
      if (!reducedMotion) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => scrambleIn(el)
        })
      }
    })

    // 大标题英文幽灵字：轻微视差漂移，增强滚动纵深
    gsap.utils.toArray('.sec-title .en', rootEl.value).forEach((el) => {
      gsap.fromTo(
        el,
        { xPercent: -4 },
        {
          xPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        }
      )
    })

    // 幽灵按钮磁吸
    magneticCleanups = gsap.utils
      .toArray('.btn-ghost', rootEl.value)
      .map((el) => magnetic(el, 0.25))
  }, rootEl.value)
})

onBeforeUnmount(() => {
  magneticCleanups.forEach((fn) => fn())
  magneticCleanups = []
  if (ctx) ctx.revert()
})
</script>

<template>
  <main ref="rootEl">
    <HeroSection />
    <MarqueeBar />

    <!-- ABOUT -->
    <AboutSection />

    <!-- CODE LAB -->
    <CodeLabSection />

    <!-- PROJECTS -->
    <section id="projects">
      <div class="sec-label">03 — 精选项目 / PROJECTS</div>
      <div class="sec-title"><span class="en">SELECTED WORKS</span>每一个项目，都是一次系统性的抵达。</div>

      <div class="projects-grid">
        <ProjectCard v-for="p in projects" :key="p.id" :project="p" class="reveal" />
      </div>

      <div class="projects-more reveal">
        <a class="btn-ghost" href="https://github.com/wjl-cong?tab=repositories" target="_blank" rel="noopener">
          查看全部 · GITHUB →
        </a>
        <a class="btn-ghost" href="https://gitee.com/wjl2004/projects" target="_blank" rel="noopener">
          查看全部 · GITEE →
        </a>
      </div>
    </section>

    <!-- TIMELINE -->
    <TimelineSection />

    <!-- CONTACT -->
    <ContactSection />
  </main>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
}

.projects-more {
  margin-top: 48px;
  display: flex;
  gap: 26px;
  justify-content: center;
}

@media (max-width: 900px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
