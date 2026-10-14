# GSAP 引擎纪律（Engine Discipline）

> 来源：gsap-skills-main（GSAP 官方 agent skill 集：core / timeline / scrolltrigger / plugins / utils / performance / frameworks）。
> 本文件是"美学 skill"之下的**工程底座**——所有动效配方在执行时必须同时满足这里的每一条。违反任何一条都算 bug，不算风格。

## 1. Tween 基本纪律

- vars 里属性一律 **camelCase**（`backgroundColor`、`rotationX`）。
- 位移/缩放/旋转永远用 **transform 别名**：`x / y / z / xPercent / yPercent / scale / scaleX / scaleY / rotation / rotationX / rotationY / skewX / skewY`；禁止动画 `translate()` 字符串。
- 移动用 `x/y`，不用 `left/top`；百分比移动用 `xPercent/yPercent`（SVG 同样适用）。
- **淡入淡出用 `autoAlpha` 不用 `opacity`**：归零时自动 `visibility: hidden`，不可见元素不再挡点击；恢复时 visibility 回到 inherit。
- 相对值：`x: "+=20"`、`rotation: "-=30"`；方向旋转后缀 `rotation: "-170_short"`（走最短路径）。
- `clearProps: "transform,opacity"` 在补间结束时归还内联样式——**当 CSS 类需要接管时必须清**（防止"动画结束后 hover 失效"）。
- **immediateRender 陷阱**：`from()/fromTo()` 默认立即渲染起始态；同一元素同一属性叠加多个 `from/fromTo` 时，后一个必须 `immediateRender: false`，否则先创建的补间终态被覆盖、动画看不见。
- 冲突处理：`overwrite: "auto"`（首次渲染时仅 kill 同目标同属性的活动补间）是安全默认；确认冲突时 `overwrite: true`。
- 全局默认：项目启动时 `gsap.defaults({ ease: 'power3.out' })` 统一手感，个别处再覆盖。

## 2. Timeline 编排

- 多步编排一律 `gsap.timeline()`，**禁止用 delay 链接动画**。
- 熟练使用**位置参数**：`0`（绝对）、`"+=0.5"`（上一段结束后 0.5s）、`"-=0.2"`（提前 0.2s）、`"<"`（与上一段同时开始）、`"<0.2"`、`">"`。
- 长编排加 **label**：`tl.addLabel('intro')` + `tl.play('intro')`，可读且可跳转。
- 子补间共享时长/缓动时写 `defaults: { duration: 0.5, ease: 'power2.out' }`。
- 需要控制播放（pause/reverse/progress）时保存返回的实例。

## 3. ScrollTrigger 规则

- `gsap.registerPlugin(ScrollTrigger)` 全站一次（入口文件），禁止组件内重复注册。
- **scrub 与 toggleActions 二选一**，同用则 scrub 胜出。scrub 用数字（`scrub: 1`）制造 0.5–1s 的"追赶"呼吸。
- start/end 格式：`"triggerPos viewportPos"`（如 `"top 80%"`、`"bottom center"`）；可用 `clamp(top bottom)` 防短屏溢出；动态布局用函数值并在布局变化后 `refresh()`。
- **ScrollTrigger 只放顶层**：挂在 timeline 构造器或独立 tween 上；禁止挂进 timeline 内部子补间（`gsap.timeline().to('.a', { scrollTrigger })` 是错误）。
- **pin 的元素本身不做动画**——动画其子元素；`pinSpacing` 默认 true，别乱关。
- 假水平滚动（containerAnimation）：内部横向 tween 必须 `ease: "none"`，否则滚动与横向位置失联；嵌套触发需设 `containerAnimation`；此模式下不可 pin/snap。
- **创建顺序 = 页面顺序**（自上而下）；动态/异步创建时设 `refreshPriority` 按 DOM 顺序刷新。
- DOM/布局变化（字体加载、图片、数据渲染、路由挂载）后调 `ScrollTrigger.refresh()`（resize 已自动处理，动态内容不会）。
- SPA 离场必须清理：动画全部建在 `gsap.context()` 内，卸载时 `ctx.revert()`（会连带 kill 其中的 ScrollTrigger）。
- 列表批量入场用 **ScrollTrigger.batch()** 代替逐个创建：`onEnter: batch => gsap.to(batch, { stagger })`，可配 `interval / batchMax`。
- `markers: true` 仅限开发，交付前移除。
- 需要纯监听（不驱动动画）时用 `ScrollTrigger.create({ trigger, start, onEnter, onLeaveBack, ... })` 做状态切换（如悬浮按钮显隐）。

## 4. Lenis × ScrollTrigger × 路由（本项目实测有效）

```js
// 平滑滚动接入（官方推荐模式）
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

- **路由切换后的滚动复位必须感知 Lenis**：vue-router 的 `window.scrollTo(0)` 会被 Lenis 惯性写回旧位置，随后新页高度不足被钳制到底部。统一走 `lenis.scrollTo(y, { immediate: true, force: true })`（未启用 Lenis 回退原生 instant），并 `return false` 阻止 router 二次滚动。
- 路由转场（out-in）期间滚动复位在导航确认时执行——此刻旧页仍在 DOM，属正常；关键是让 Lenis 的 target 同步为 0。
- 锚点导航一律走 Lenis 缓动，禁止原生 `scrollIntoView` 与惯性滚动并存。

## 5. 响应式与可访问性：gsap.matchMedia()

```js
const mm = gsap.matchMedia()
mm.add(
  { isDesktop: '(min-width: 800px)', reduceMotion: '(prefers-reduced-motion: reduce)' },
  (ctx) => {
    const { isDesktop, reduceMotion } = ctx.conditions
    // 建动画；条件不匹配时自动 revert
    return () => { /* 可选自定义清理 */ }
  },
  rootEl // 第三参作用域，等价 selector 收敛
)
// 卸载时 mm.revert()
```

- **不要在 matchMedia 内再套 gsap.context**（它自带 context），清理只靠 `mm.revert()`。
- reduced-motion 用户：`duration: 0` 或直接跳过动画——这是无障碍红线，不是可选项。
- 前庭敏感用户靠它保命：所有大幅位移/pin 效果必须在 reduceMotion 分支下降级。

## 6. 性能（60fps 红线）

- 只动画 **transform 与 opacity**；`width/height/top/left/margin/padding` 触发重排，禁止。
- `will-change: transform` 只加给真正在动的元素，禁止"以防万一"全局加。
- 高频更新（鼠标跟随、指针视差）必须用 **gsap.quickTo()**：复用单个补间而不是每帧新建。

```js
const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY) })
```

- 相同动画用 **stagger** 代替 N 个手动 delay 的补间；`stagger: { amount: 0.3, from: 'center' }` 可做中心扩散。
- 读/写分离：先批量 getBoundingClientRect，再批量写样式，避免交错造成布局抖动。
- 离屏/不可见的动画要 pause 或 kill；长列表只动画可视项。
- 数百个同发补间是事故，不是效果——低端机上必须实测。

## 7. utils 工具箱（免注册）

- `clamp(min, max, v)` / `mapRange(inMin,inMax,outMin,outMax,v)` / `normalize(min,max,v)`——省略末参返回**可复用函数**（滚动回调里高频使用）。
- `interpolate(a, b, t)`：数值/颜色/对象插值。
- `snap(step, v)`：网格吸附；`random(-100,100,5)`：区间随机+步进；`shuffle(arr)` 洗牌。
- `pipe(f1, f2, f3)(v)`：函数管道（normalize → map → snap）。
- **`gsap.utils.selector(scopeEl)`**：返回收敛在容器内的选择器函数——组件里用它代替全局 `'.box'`，杜绝跨组件误伤。
- `wrap(0, 360, v)`：循环值（无限 marquee/旋转）。

## 8. 插件（全部免费，公共 npm 包即含）

- **Flip**（3.10 起免费）：布局状态切换的 FLIP 动画。`Flip.getState()` → 改 DOM → `Flip.from(state, { duration, ease })`；`Flip.fit(a, b)` 可把 A 对齐到 B 的矩形（悬浮元素"归位"类动效首选）。关键参数：`scale`（缩放适配防拉伸）、`absolute`、`nested`、`simple`。
- **SplitText**（Webflow 收购后全免费）：`SplitText.create(el, { type: 'words,chars', mask: 'lines', autoSplit: true, onSplit(self){ return gsap.from(self.lines, ...) } })`。自绘字体必须等 `document.fonts.ready` 或用 autoSplit；只拆需要的层级（不用 chars 就别拆）；`aria: 'auto'` 保持可读性。中文 CJK 场景注意：默认按空格分词不适用，需 `prepareText` 或自拆——本项目沿用自研 `splitToChars / splitToCJKChars`，仅在需要 mask/自动重排时引入 SplitText。
- **ScrollToPlugin**：`gsap.to(window, { scrollTo: { y: '#sec', offsetY: 50 } })`——未启用 Lenis 时的锚点方案。
- **Observer**：跨设备统一手势（swipe/方向/容差），做自定义交互但不绑定滚动位置时用。
- **ScrambleText / DrawSVG / MorphSVG / MotionPath**：字符乱码收敛、描边绘制、形变、路径动画——引入前先过"叙事职能"审查（skill 原则 7）。
- 规矩：用前 `gsap.registerPlugin()` 一次性注册；组件卸载时 revert 插件实例（如 `split.revert()`）；GSDevTools 只在开发用，禁止上线。

## 9. 框架集成（Vue 3 铁律）

- 动画只在 **onMounted 之后**创建（DOM 已存在）；禁止在 setup 同步顶层建动画。
- **永远传 scope**：`gsap.context(() => { ... }, rootRef.value)`——组件内 `.box` 只搜本组件子树。
- **永远 revert**：`onBeforeUnmount(() => ctx.revert())`——kill 全部补间与 ScrollTrigger 并归还内联样式。
- 插件注册全站一次（入口文件），不在组件体内反复注册。
- `nextTick` 后再 `ScrollTrigger.refresh()`（数据渲染/子路由挂载改变布局时）。
- 同页两个 transform 动画源（CSS `:hover` transform vs GSAP inline）打架 = 红线：动画期 `transition: 'none'`，结束 `clearProps` 归还。

## 10. 引擎自查清单（与《验收协议》并用）

- [ ] 无 delay 链式编排；多步全走 timeline + 位置参数
- [ ] 所有隐藏用 autoAlpha；出现/消失的元素不残留 pointer 事件
- [ ] scrub 与 toggleActions 未混用；容器动画 ease 为 none
- [ ] ScrollTrigger 全部在 context 内、卸载即 revert；refresh 在布局变化后调用
- [ ] 路由滚动复位走 Lenis（immediate+force），无"落底/回弹"现象
- [ ] matchMedia 覆盖 ≥768px 断点与 reduced-motion；触屏无 hover 降级
- [ ] 高频指针效果走 quickTo；无 width/height/top/left 动画
- [ ] console 零 GSAP warning（target not found / missing plugin / overlap）
