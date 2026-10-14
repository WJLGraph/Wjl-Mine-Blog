# 签名手法配方（GSAP 3 + Vue3 组合式，原理通用）

以下代码均在本博客实战验证过，可直接移植。统一前置：`npm i gsap lenis`，封装 `useGsap.js` 导出 `gsap / ScrollTrigger`。

## 1. 平滑滚动（呼吸感地基）

```js
// composables/useSmoothScroll.js
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './useGsap'

let lenis = null

export function initSmoothScroll() {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 })
  lenis.on('scroll', ScrollTrigger.update)     // ScrollTrigger 单一事实源
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
```

App.vue `onMounted` 里调用一次即可全站生效。锚点导航必须走 `lenis.scrollTo`，原生 `scrollIntoView` 会与惯性抢滚动权。

## 2. 双向 reveal（上滑也有呼应）

```js
const REV = 'play none none reverse'
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: REV },
    y: 56, opacity: 0, duration: 1.2, ease: 'expo.out'
  })
})
```

要点：`from` 补间默认只播一次；加 `toggleActions` 后上滚越过起点会反向收回，再下滚重新入场。scrub 类不需要此参数（天然可逆）。

## 3. 滚动叙事退场

```js
// Hero 主内容离场：上浮淡出交给下一区块
gsap.to('.hero-content', {
  scrollTrigger: { trigger: rootEl, start: 'top top', end: 'bottom 35%', scrub: 0.6 },
  y: -140, opacity: 0, ease: 'none'
})

// 区块大标题幽灵英文：±4% 水平漂移制造纵深
gsap.utils.toArray('.sec-title .en').forEach((el) => {
  gsap.fromTo(el, { xPercent: -4 }, {
    xPercent: 4, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
  })
})
```

## 4. 速度感应字幕（快滚加速、回滚反向）

```js
const loop = gsap.to('.marquee-track', { xPercent: -50, ease: 'none', duration: 44, repeat: -1 })
const clampTs = gsap.utils.clamp(-4, 4)
let current = 1, target = 1

ScrollTrigger.create({
  onUpdate: (self) => { target = clampTs(1 + self.getVelocity() / 1200) }
})

const decay = () => {           // ticker 里缓慢回落到常速，避免突变
  current += (target - current) * 0.06
  target += (1 - target) * 0.05
  loop.timeScale(current)
}
gsap.ticker.add(decay)
// onBeforeUnmount: gsap.ticker.remove(decay)
```

HTML 结构需内容精确复制两份（`v-for="n in 2"`），`xPercent: -50` 无缝循环。

## 5. 逐字拆分 + 解码乱码

拆分（CJK 保留子元素）见 `src/composables/useGsap.js` 的 `splitToChars / splitToCJKChars`。解码：

```js
const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789' // 剔除 0/O/1/l/I

export function scrambleIn(el, { duration = 0.9 } = {}) {
  const original = el.textContent
  const chars = [...original]
  let p = 0
  const tick = () => {
    p = Math.min(1, p + (gsap.ticker.deltaRatio() * 1.8) / (duration * 60))
    el.textContent = [...chars]
      .map((ch, i) =>
        i < p * chars.length || !/[A-Za-z0-9]/.test(ch)   // 中文/标点永远原位
          ? ch
          : POOL[(Math.random() * POOL.length) | 0]
      ).join('')
    if (p >= 1) { el.textContent = original; cleanup() }
  }
  const cleanup = () => gsap.ticker.remove(tick)
  gsap.ticker.add(tick)
  return cleanup
}
// 触发：ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => scrambleIn(el) })
```

与入场淡出共存：同一 trigger 同一 start，label 只做 opacity 淡入（不做 x 位移），title 才滑入——否则"一行乱码从左滑入"很乱。

## 6. 磁吸交互

```js
import { gsap } from './useGsap'

export function magnetic(el, strength = 0.3) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    xTo(gsap.utils.clamp(-r.width / 2, r.width / 2, (e.clientX - (r.left + r.width / 2)) * strength))
    yTo(gsap.utils.clamp(-r.height / 2, r.height / 2, (e.clientY - (r.top + r.height / 2)) * strength))
  }
  const onLeave = () => { xTo(0); yTo(0) }
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
  return () => { // 组件卸载清理
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
    gsap.set(el, { x: 0, y: 0 })
  }
}
```

只用于大目标（卡片、按钮）；`strength` 卡片 0.22、按钮 0.25 左右。

## 7. 数字滚动（统计面板）

```js
rootEl.querySelectorAll('.count').forEach((el) => {
  const target = +el.dataset.target
  const obj = { v: 0 }
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.v) }
    })
  })
})
```

代理对象惯用法：不进 Vue 响应式，每帧只写 textContent。

## 8. 代码窗口滚动打字机（本站 CODE LAB 核心）

结构三件套：**隐形 sizer 层**（`visibility:hidden; white-space:pre` 锁最终高度，零布局抖动）+ **typed 层**（absolute 叠加）+ **行号列**（与代码层共享 font/line-height/padding）。

```js
// tokenize 一次，逐帧截断（见 src/composables/useCodeHighlight.js 的 sliceHtml）
const segs = tokenize(code, lang)
const proxy = { n: 0 }
typeTween = gsap.to(proxy, {
  n: code.length, ease: 'none',
  scrollTrigger: { trigger: winEl, start: 'top 78%', end: '+=60%', scrub: 0.8 },
  onUpdate: () => {
    const n = Math.floor(proxy.n)
    done.value = n >= code.length          // is-done 类驱动光标消失/输出浮现，纯 CSS
    typedEl.innerHTML = sliceHtml(segs, n) + '<span class="cl-cursor"></span>'
  }
})
```

三大纪律：
- `typeTween` 在 tab 切换回调中创建时**必须手动 kill**（不在 gsap.context 捕获范围）：`typeTween?.scrollTrigger?.kill(); typeTween?.kill()`
- 切 tab 后 `ScrollTrigger.refresh()`；webfont 加载后 `document.fonts.ready.then(() => ScrollTrigger.refresh())`
- 完成态（光标隐藏、runOutput 浮现）全部由 `.is-done` CSS 类驱动，不写第二个补间

手写高亮器要点（`useCodeHighlight.js`）：sticky 正则单遍扫描，优先级 注释 > 字符串(三引号/f-string/模板串) > 装饰器 > 关键字 > 数字 > 函数调用(前瞻`(`) > 标点；对原始源码 tokenize、输出阶段才转义（`&` 最先）。markdown 场景先反转义再高亮，`&amp;` 最后替换。

## 9. 阅读进度条

```html
<div class="scroll-progress" ref="progressEl"></div>
```
```css
.scroll-progress {
  position: fixed; top: 0; left: 0; width: 100%; height: 2px; z-index: 950;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform-origin: left center; transform: scaleX(0); pointer-events: none;
}
```
```js
gsap.fromTo(progressEl, { scaleX: 0 }, {
  scaleX: 1, ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
})
```

## 10. 清理纪律（最容易踩的坑）

```js
let ctx = null, extraTween = null

onMounted(() => {
  ctx = gsap.context(() => { /* 所有 onMounted 期动画 */ }, rootEl.value)
})
onBeforeUnmount(() => {
  extraTween?.scrollTrigger?.kill()   // 在回调/交互中创建的 tween
  extraTween?.kill()
  ctx?.revert()                        // onMounted 期的全部动画
})
```

路由切换后若页面高度变化：`ScrollTrigger.refresh()`（配合 `<transition>` 的 onComplete 调用）。

## 11. 验收清单（每次动效改动的固定动作）

- [ ] 构建 0 报错，console 无 GSAP warning
- [ ] 滚轮有惯性；锚点导航走 Lenis
- [ ] 每个效果上滚可逆（scrub 或 toggleActions）
- [ ] prefers-reduced-motion 全量降级
- [ ] 亮/暗主题特效颜色均可用（只引用成对令牌）
- [ ] ≤900px：字号/间距降档，长内容横向滚动而非截断
- [ ] 子页面/详情页路由往返无动画失效或泄漏
