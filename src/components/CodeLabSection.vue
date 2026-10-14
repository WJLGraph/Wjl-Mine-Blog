<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap, ScrollTrigger } from '../composables/useGsap'
import { tokenize, highlightCode, sliceHtml } from '../composables/useCodeHighlight'
import { snippets } from '../data/codeLab'

const rootEl = ref(null)
const winEl = ref(null)
const typedEl = ref(null)
const activeIdx = ref(0)
const done = ref(false)

const active = computed(() => snippets[activeIdx.value])
const langLabel = computed(() => (active.value.lang === 'python' ? 'PYTHON 3.11' : 'JAVASCRIPT ES2023'))

/* 行号列：与代码层共享 font / line-height / padding，保证逐行对齐 */
const gutterText = computed(() => {
  const n = active.value.code.split('\n').length
  return Array.from({ length: n }, (_, i) => i + 1).join('\n')
})

const fullHtml = computed(() => highlightCode(active.value.code, active.value.lang))

/* 打字机：代理对象 + 预分词截断，scrub 驱动、可倒带 */
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let segs = []
let typeTween = null

function renderAt(n) {
  const el = typedEl.value
  if (!el) return
  const html = sliceHtml(segs, n)
  el.innerHTML = done.value ? html : `${html}<span class="cl-cursor"></span>`
}

function buildTypeTween() {
  typeTween?.scrollTrigger?.kill()
  typeTween?.kill()
  typeTween = null

  const code = active.value.code
  segs = tokenize(code, active.value.lang)
  done.value = false

  if (reducedMotion) {
    done.value = true
    renderAt(code.length)
    return
  }

  const proxy = { n: 0 }
  typeTween = gsap.to(proxy, {
    n: code.length,
    ease: 'none',
    scrollTrigger: {
      trigger: winEl.value,
      start: 'top 78%',
      end: '+=60%',
      scrub: 0.8
    },
    onUpdate: () => {
      const n = Math.floor(proxy.n)
      done.value = n >= code.length
      renderAt(n)
    }
  })
}

function setTab(i) {
  if (i === activeIdx.value) return
  activeIdx.value = i
  nextTick(() => {
    buildTypeTween()
    ScrollTrigger.refresh()
  })
}

let ctx = null

onMounted(() => {
  if (reducedMotion) {
    buildTypeTween()
    return
  }

  ctx = gsap.context(() => {
    // lead 副文案滚动显现
    gsap.from('.lab-lead', {
      scrollTrigger: { trigger: rootEl.value, start: 'top 80%' },
      y: 32,
      opacity: 0,
      duration: 1,
      ease: 'expo.out'
    })
    buildTypeTween()
    // JetBrains Mono webfont 加载完成后校准布局
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, rootEl.value)
})

onBeforeUnmount(() => {
  // typeTween 在 setTab 中创建，不在 ctx 捕获范围内，需手动 kill
  typeTween?.scrollTrigger?.kill()
  typeTween?.kill()
  typeTween = null
  if (ctx) ctx.revert()
})
</script>

<template>
  <section id="codelab" ref="rootEl">
    <div class="sec-label">02 — 代码实验室 / CODE LAB</div>
    <div class="sec-title"><span class="en">SHOW ME THE CODE</span>代码，是最诚实的作品集。</div>
    <p class="lab-lead">
      三个片段，两门语言，全部来自真实项目 —— 包括你现在正在看的这个网站。
    </p>

    <div class="cl-window reveal" :class="{ 'is-done': done }" ref="winEl">
      <div class="cl-titlebar">
        <span class="cl-dot r"></span><span class="cl-dot y"></span><span class="cl-dot g"></span>
        <div class="cl-tabs">
          <button
            v-for="(t, i) in snippets"
            :key="t.file"
            class="cl-tab"
            :class="{ active: i === activeIdx }"
            @click="setTab(i)"
          >
            {{ t.tab }}
          </button>
        </div>
      </div>

      <div class="cl-body">
        <div class="cl-gutter" aria-hidden="true">{{ gutterText }}</div>
        <div class="cl-scroll">
          <div class="cl-code">
            <pre class="cl-sizer" v-html="fullHtml"></pre>
            <pre class="cl-typed" ref="typedEl"></pre>
          </div>
        </div>
      </div>

      <div class="cl-statusbar">
        <span>{{ langLabel }}</span>
        <span class="hide-s">UTF-8</span>
        <span class="hide-s">LF</span>
        <span class="hide-s">main</span>
        <span class="cl-run">{{ active.runOutput }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lab-lead {
  margin-top: 26px;
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  color: var(--ink-dim);
}

.cl-window {
  margin-top: 44px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--bg-2);
  overflow: hidden;
  transition: border-color 0.4s;
}

.cl-window:hover {
  border-color: rgba(158, 203, 255, 0.3);
}

/* ── 标题栏 ── */
.cl-titlebar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
}

.cl-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  opacity: 0.85;
  flex: none;
}

.cl-dot.r { background: #ff5f57; }
.cl-dot.y { background: #febc2e; }
.cl-dot.g { background: #28c840; }

.cl-tabs {
  display: flex;
  gap: 6px;
  margin-left: 18px;
  overflow-x: auto;
  scrollbar-width: none;
}

.cl-tabs::-webkit-scrollbar {
  display: none;
}

.cl-tab {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--ink-faint);
  background: transparent;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s, background 0.3s;
  white-space: nowrap;
}

.cl-tab:hover {
  color: var(--ink-dim);
}

.cl-tab.active {
  color: var(--accent);
  background: var(--glass);
}

/* ── 主体：行号 + 代码 ── */
.cl-body {
  display: flex;
  align-items: stretch;
}

.cl-gutter {
  flex: none;
  user-select: none;
  text-align: right;
  padding: 18px 0 20px 20px;
  min-width: 3.4em;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.75;
  color: var(--ink-faint);
  white-space: pre;
}

.cl-scroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}

.cl-code {
  position: relative;
  width: max-content;
  min-width: 100%;
}

.cl-sizer,
.cl-typed {
  margin: 0;
  padding: 18px 24px 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.75;
  white-space: pre;
  tab-size: 4;
}

.cl-sizer {
  visibility: hidden;
}

.cl-typed {
  position: absolute;
  inset: 0;
}

/* ── 光标 ── */
.cl-cursor {
  display: inline-block;
  width: 7px;
  height: 1.05em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--accent-2);
  animation: cl-blink 1.1s steps(2) infinite;
}

.cl-window.is-done .cl-cursor {
  display: none;
}

@keyframes cl-blink {
  50% {
    opacity: 0;
  }
}

/* ── 状态栏 ── */
.cl-statusbar {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 10px 20px;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--ink-faint);
}

.cl-run {
  margin-left: auto;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.5s, transform 0.5s, color 0.5s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cl-window.is-done .cl-run {
  opacity: 1;
  transform: none;
  color: var(--accent-2);
}

@media (max-width: 900px) {
  .cl-gutter,
  .cl-sizer,
  .cl-typed {
    font-size: 11px;
  }

  .cl-gutter {
    min-width: 2.4em;
    padding-left: 12px;
  }

  .cl-sizer,
  .cl-typed {
    padding: 14px 16px 16px;
  }

  .hide-s {
    display: none;
  }

  .cl-statusbar {
    gap: 14px;
  }
}
</style>
