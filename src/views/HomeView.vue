<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from '../composables/useGsap'
import { projects } from '../data/projects'
import HeroSection from '../components/HeroSection.vue'
import MarqueeBar from '../components/MarqueeBar.vue'
import AboutSection from '../components/AboutSection.vue'
import ProjectCard from '../components/ProjectCard.vue'
import TimelineSection from '../components/TimelineSection.vue'
import ContactSection from '../components/ContactSection.vue'

const rootEl = ref(null)
let ctx = null

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    // 通用滚动显现
    gsap.utils.toArray('.reveal', rootEl.value).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: 56,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
      })
    })

    // 区块标题入场
    gsap.utils.toArray('.sec-label, .sec-title', rootEl.value).forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        x: -36,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
      })
    })
  }, rootEl.value)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <main ref="rootEl">
    <HeroSection />
    <MarqueeBar />

    <!-- ABOUT -->
    <AboutSection />

    <!-- PROJECTS -->
    <section id="projects">
      <div class="sec-label">02 — 精选项目 / PROJECTS</div>
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
