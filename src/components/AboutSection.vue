<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, ScrollTrigger, splitToCJKChars } from '../composables/useGsap'

const rootEl = ref(null)
let ctx = null

const skillGroups = [
  {
    title: '语言 / LANGUAGES',
    tags: ['Python', 'JavaScript / TS', 'SQL', 'HTML / CSS']
  },
  {
    title: '前端 / FRONTEND',
    tags: ['Vue2 · Vue3', 'Vite', 'Pinia', 'Element Plus', 'OpenLayers', 'Turf.js', 'Three.js', 'ECharts', '微信小程序', 'Vant Weapp', 'GSAP 动效']
  },
  {
    title: '后端 · 工程 / BACKEND',
    tags: ['FastAPI', 'SQLAlchemy + PostgreSQL', 'JWT 认证', 'SSE 流式', 'Alembic', 'GeoPandas / Shapely']
  },
  {
    title: 'AI · AGENT',
    tags: ['LangChain / LangGraph', 'LLM Agent 编排', 'Prompt 工程', 'RAG 知识库', 'HITL 人工审批', 'Agent 红队测试', '混沌注入', 'MCP 协议', 'Langfuse 观测', 'OpenAI / DashScope']
  },
  {
    title: '算法 · 数据 / ALGORITHM',
    tags: ['协同过滤 UserCF / ItemCF', 'Informer 时间序列', 'scikit-learn', 'pandas / numpy', '数据可视化']
  }
]

const stats = [
  { target: 16, suffix: '+', desc: '公开仓库 / REPOS' },
  { target: 7, suffix: '+', desc: '完整项目 / PROJECTS' },
  { target: 5, suffix: '+', desc: '技术方向 / FIELDS' }
]

onMounted(() => {
  // 中文段落逐字拆分
  const paras = rootEl.value.querySelectorAll('.split-words')
  paras.forEach((p) => splitToCJKChars(p))

  ctx = gsap.context(() => {
    // 逐字点亮（scrub 跟随滚动）
    paras.forEach((p) => {
      gsap.to(p.querySelectorAll('.w'), {
        opacity: 1,
        stagger: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true }
      })
    })

    // 数字滚动
    rootEl.value.querySelectorAll('.count').forEach((el) => {
      const target = +el.dataset.target
      const obj = { v: 0 }
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.v)
            }
          })
      })
    })
  }, rootEl.value)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section id="about" ref="rootEl">
    <div class="sec-label">01 — 关于我 / ABOUT</div>
    <div class="sec-title"><span class="en">WHO I AM</span>写代码，也构建智能体。</div>

    <div class="about-wrap">
      <div>
        <p class="about-text split-words">
          我是一名专注于 <em>AI Agent</em> 与 <em>数据可视化</em> 的开发者。从 Vue
          小程序起步，经历地理信息大屏、推荐算法与时间序列预测的锤炼，如今专注于以大模型为核心的多 Agent 系统与 Agent 安全测试。
        </p>
        <p class="about-text split-words">
          我相信好的工程是<em>理性架构</em>与<em>审美直觉</em>的结合 ——
          系统要可靠，界面要克制，体验要有呼吸感。
        </p>

        <div v-for="g in skillGroups" :key="g.title" class="skill-group">
          <div class="sg-title">{{ g.title }}</div>
          <div class="skill-tags">
            <span v-for="t in g.tags" :key="t">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="stats">
        <div v-for="s in stats" :key="s.desc" class="stat">
          <div class="num"><span class="count" :data-target="s.target">0</span><i>{{ s.suffix }}</i></div>
          <div class="desc">{{ s.desc }}</div>
        </div>
        <div class="stat">
          <div class="num">20<i>23</i></div>
          <div class="desc">持续创造 / SINCE</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-wrap {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 80px;
  align-items: start;
}

.about-text {
  font-size: clamp(1.15rem, 2vw, 1.7rem);
  font-weight: 300;
  line-height: 1.9;
  letter-spacing: 0.5px;
}

.about-text + .about-text {
  margin-top: 28px;
}

.about-text :deep(em) {
  font-style: normal;
  color: var(--accent);
}

.skill-group {
  margin-top: 32px;
}

.sg-title {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 4px;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tags span {
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--ink-dim);
  border: 1px solid var(--line);
  background: var(--glass);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s, color 0.3s, transform 0.3s;
}

.skill-tags span:hover {
  color: var(--ink);
  border-color: rgba(158, 203, 255, 0.5);
  transform: translateY(-2px);
}

.stats {
  display: grid;
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
}

.stat {
  background: var(--bg-2);
  padding: 34px 30px;
  position: relative;
  overflow: hidden;
}

.stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(158, 203, 255, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}

.stat:hover::before {
  opacity: 1;
}

.num {
  font-family: var(--font-mono);
  font-size: clamp(2.2rem, 3.6vw, 3.2rem);
  font-weight: 300;
  line-height: 1;
}

.num i {
  font-style: normal;
  color: var(--accent);
}

.desc {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ink-faint);
}

@media (max-width: 900px) {
  .about-wrap {
    grid-template-columns: 1fr;
    gap: 50px;
  }
}
</style>
