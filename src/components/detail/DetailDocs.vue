<script setup>
/**
 * 详情子页 5：项目文档 — 多 md 文件渲染 + 右侧侧边栏（文件切换 + 标题树导航，Word 导航窗格式）
 * md 文件位于 public/docs/{id}/{file}.md（构建时静态可用），图片链接已重写为可直连源
 * 支持 KaTeX 公式（$..$ / $$..$$）与 GitHub 风格标题锚点（slugger 保证 md 内 #锚点 正确定位）
 */
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import { highlightCode } from '../../composables/useCodeHighlight'
import markedKatex from 'marked-katex-extension'
import { gsap } from '../../composables/useGsap'
import 'katex/dist/katex.min.css'

const props = defineProps({
  project: { type: Object, required: true }
})

marked.use(markedKatex({ throwOnError: false, nonStandard: true }))
marked.setOptions({ breaks: false, gfm: true })

const docList = computed(() =>
  props.project.docs && props.project.docs.length
    ? props.project.docs
    : [{ file: 'readme.md', label: 'README' }]
)
const activeIdx = ref(0)
const activeLabel = computed(() => docList.value[activeIdx.value]?.label || '文档')

const html = ref('')
const headings = ref([]) // { id, text, level }
const activeId = ref('')
const loading = ref(true)
const failed = ref(false)
const bodyEl = ref(null)
const rootEl = ref(null)
let ctx = null
let loadSeq = 0

/* GitHub 风格 slug：小写、剔除标点（保留字母/数字/CJK/-_）、空格转 -，重复标题自动 -1 -2 */
function makeSlugger() {
  const seen = new Map()
  return (raw) => {
    let s = String(raw)
      .replace(/<[^>]+>/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s\-_]/gu, '')
      .replace(/\s/g, '-')
    if (!s) s = 'section'
    const n = seen.get(s) || 0
    seen.set(s, n + 1)
    return n === 0 ? s : `${s}-${n}`
  }
}

function findHeadingEl(id) {
  try {
    return bodyEl.value ? bodyEl.value.querySelector(`[id="${CSS.escape(id)}"]`) : null
  } catch {
    return bodyEl.value ? bodyEl.value.querySelector(`[id="${id}"]`) : null
  }
}

function scrollToHeading(id) {
  const el = findHeadingEl(id)
  if (el && bodyEl.value) bodyEl.value.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' })
}

/* md 内 #锚点 链接拦截 + 外链新窗打开 */
function onBodyClick(e) {
  const a = e.target.closest('a')
  if (!a) return
  const href = a.getAttribute('href') || ''
  if (href.startsWith('#')) {
    e.preventDefault()
    let id = href.slice(1)
    try { id = decodeURIComponent(id) } catch { /* 保持原样 */ }
    scrollToHeading(id)
  } else if (/^https?:/i.test(href)) {
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener')
  }
}

/* 容器滚动 → 高亮当前标题（Word 导航窗格效果） */
function onScroll() {
  const box = bodyEl.value
  if (!box || !headings.value.length) return
  const st = box.scrollTop + 40
  let cur = headings.value[0].id
  for (const h of headings.value) {
    const el = h.el || findHeadingEl(h.id)
    if (el && el.offsetTop <= st) cur = h.id
    else break
  }
  activeId.value = cur
}

function collectHeadings() {
  const box = bodyEl.value
  if (!box) return
  headings.value = Array.from(box.querySelectorAll('.md-body h2[id], .md-body h3[id], .md-body h4[id]')).map((el) => ({
    id: el.id,
    text: el.textContent.trim(),
    level: Number(el.tagName.slice(1)),
    el
  }))
  activeId.value = headings.value.length ? headings.value[0].id : ''
}

async function load() {
  const seq = ++loadSeq
  loading.value = true
  failed.value = false
  html.value = ''
  headings.value = []
  activeId.value = ''
  try {
    const doc = docList.value[activeIdx.value]
    const base = import.meta.env.BASE_URL || '/'
    const res = await fetch(`${base}docs/${props.project.id}/${doc.file}`)
    if (seq !== loadSeq) return
    if (!res.ok) throw new Error(res.status)
    let md = await res.text()
    // 首行大标题若与详情页标题重复，降级为一级分节
    md = md.replace(/^#\s+(.+?)\n/, '## $1\n')
    const slug = makeSlugger()
    marked.use({
      renderer: {
        heading(token) {
          let text = ''
          try {
            text = this.parser.parseInline(token.tokens)
          } catch {
            text = token.text || ''
          }
          const id = slug(text)
          return `<h${token.depth} id="${id}">${text}</h${token.depth}>`
        }
      }
    })
    // python / javascript 代码块套用手写高亮器（bash/sql/yaml 等原样保留）
    const unescapeHtml = (s) =>
      s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
    const parsed = marked
      .parse(md)
      .replace(/<img /g, '<img loading="lazy" ')
      .replace(
        /<pre><code(?: class="language-([\w#+-]+)")?>([\s\S]*?)<\/code><\/pre>/g,
        (m, lang, body) => {
          const norm = (lang || 'python').toLowerCase()
          const mapped = norm.startsWith('py')
            ? 'python'
            : /^(js|javascript|jsx|ts|tsx)$/.test(norm)
              ? 'javascript'
              : null
          if (!mapped) return m
          return `<pre><code class="language-${norm}">${highlightCode(unescapeHtml(body), mapped)}</code></pre>`
        }
      )
    if (seq !== loadSeq) return
    html.value = parsed
  } catch {
    if (seq !== loadSeq) return
    failed.value = true
  } finally {
    if (seq !== loadSeq) return
    loading.value = false
    await nextTick()
    if (seq !== loadSeq) return
    const box = bodyEl.value
    if (box) box.scrollTop = 0
    collectHeadings()
    if (ctx) ctx.revert()
    ctx = gsap.context(() => {
      gsap.from('.docs-main', { opacity: 0, y: 26, duration: 0.6, ease: 'expo.out' })
      gsap.from('.docs-side', { opacity: 0, x: 22, duration: 0.7, ease: 'expo.out', delay: 0.1 })
    }, rootEl.value)
  }
}

/* 切换 md 文件（防双载：唯一入口，项目切换时由 pid watch 直接 load） */
function switchDoc(i) {
  if (i === activeIdx.value) return
  activeIdx.value = i
  load()
}

watch(
  () => props.project.id,
  () => {
    activeIdx.value = 0
    load()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div ref="rootEl" class="detail-page">
    <div class="d-section docs-section">
      <div class="ds-label mono">项目文档 / DOCS · {{ docList.length }} 份</div>
      <div class="docs-layout">
        <!-- 文档主体：自带与页面风格一致的右侧滚动条
             data-lenis-prevent：Lenis 全局接管了滚轮，必须放行此内部滚动容器，否则滚轮无法滚动文档 -->
        <article ref="bodyEl" class="docs-main md-scroll" data-lenis-prevent @scroll="onScroll" @click="onBodyClick">
          <div v-if="loading" class="md-state mono">加载中 …</div>
          <div v-else-if="failed" class="md-state mono">文档加载失败 — 请稍后重试</div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-else class="md-body" v-html="html"></div>
        </article>

        <!-- 右侧侧边栏：多 md 文件切换 + 当前文档标题树定位 -->
        <aside class="docs-side">
          <div class="side-block">
            <div class="side-title mono">文档 · FILES</div>
            <button
              v-for="(d, i) in docList"
              :key="d.file"
              class="side-file mono"
              :class="{ active: i === activeIdx }"
              @click="switchDoc(i)"
            >{{ d.label }}</button>
          </div>
          <div v-if="headings.length" class="side-block">
            <div class="side-title mono">目录 · ON THIS PAGE</div>
            <div class="side-toc" data-lenis-prevent>
              <button
                v-for="h in headings"
                :key="h.id"
                class="toc-item"
                :class="[`lv${h.level}`, { active: h.id === activeId }]"
                :title="h.text"
                @click="scrollToHeading(h.id)"
              >{{ h.text }}</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs-layout {
  display: flex;
  align-items: flex-start;
  gap: 26px;
}

/* 文档主体：独立滚动容器，右侧 6px 细滚动条（与全站同风格，见 main.css） */
.docs-main {
  flex: 1;
  min-width: 0;
  position: relative;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  overscroll-behavior: contain; /* 滚到边界不连带页面滚动 */
  border: 1px solid var(--line);
  background: var(--glass);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 36px 40px 56px;
  scrollbar-gutter: stable;
}

/* 右侧侧边栏：粘性跟随 */
.docs-side {
  flex: 0 0 270px;
  position: sticky;
  top: 118px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: calc(100vh - 210px);
}

.side-block {
  border: 1px solid var(--line);
  background: var(--glass);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 18px 14px;
  overflow: hidden;
}

.side-title {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ink-faint);
  margin-bottom: 12px;
  padding: 0 6px;
}

.side-file {
  display: block;
  width: 100%;
  text-align: left;
  font-size: 11.5px;
  letter-spacing: 0.5px;
  line-height: 1.5;
  color: var(--ink-dim);
  padding: 9px 10px;
  border-radius: 6px;
  border-left: 2px solid transparent;
  transition: color 0.25s, background 0.25s, border-color 0.25s;
  word-break: break-all;
}

.side-file:hover {
  color: var(--ink);
  background: var(--glass);
}

.side-file.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: rgba(158, 203, 255, 0.07);
}

html.light .side-file.active {
  background: rgba(47, 111, 206, 0.08);
}

.side-toc {
  max-height: calc(100vh - 320px);
  overflow-y: auto;
  padding-right: 4px;
}

.toc-item {
  display: block;
  width: 100%;
  text-align: left;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-faint);
  padding: 5px 8px;
  border-radius: 5px;
  border-left: 2px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.25s, background 0.25s, border-color 0.25s;
}

.toc-item.lv3 {
  padding-left: 22px;
  font-size: 11.5px;
}

.toc-item.lv4 {
  padding-left: 36px;
  font-size: 11px;
}

.toc-item:hover {
  color: var(--ink-dim);
}

.toc-item.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: rgba(158, 203, 255, 0.07);
}

html.light .toc-item.active {
  background: rgba(47, 111, 206, 0.08);
}

.md-state {
  padding: 60px 0;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--ink-faint);
  text-align: center;
}

/* 窄屏：侧边栏移到文档上方 */
@media (max-width: 1100px) {
  .docs-layout {
    flex-direction: column;
  }
  .docs-side {
    position: static;
    flex-direction: row;
    width: 100%;
    max-height: none;
    flex-wrap: wrap;
  }
  .side-block {
    flex: 1 1 240px;
  }
  .side-toc {
    max-height: 240px;
  }
  .docs-main {
    max-height: none;
    overflow: visible;
    padding: 28px 22px 40px;
  }
}
</style>
