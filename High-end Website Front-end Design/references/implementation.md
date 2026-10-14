# 实现指南（Implementation）

## CDN 清单（单文件模板已内置，版本以此为准）

```html
<!-- 样式 -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&family=Space+Mono&display=swap" rel="stylesheet">

<!-- 脚本（GSAP 3.12 全家桶 + Lenis + SplitType） -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js"></script>
```

字体按所选风格体系替换（见 style-systems.md 各体系 token 中的字体清单），中文加 `Noto Serif SC` / `Noto Sans SC` 对应字重。**注意**：中文字体只引 300/500 少量字重，全量字重文件巨大。

## 单文件模板用法

`assets/template.html` 是自包含可运行文件，使用流程：

1. 整文件复制为交付起点（如 `index.html`）
2. 替换 `:root` 中 token 为所选风格体系值
3. 替换 Google Fonts 链接为体系字体
4. 按内容改写区块（结构注释已标明每个区块对应哪个动效模式）
5. 删除未使用的区块与对应 JS 段（每段 JS 均有注释标号，与 motion-patterns.md 的 P1–P12 对应）

模板默认风格：Nocturne 暗黑奢华。模板内已实现：P1 Preloader、P2 Lenis、P3 逐行揭示、P4 图片揭示、P5 Marquee、P6 光标、P7 磁性按钮、P12 Grain，以及响应式断点与全部降级。

## 工程化集成（Vue / React，用户明确要求时）

### 关键纪律：动效库的生命周期

- **Vue3**：GSAP 动画在 `onMounted` 建立、`onBeforeUnmount` 中 `kill()` 所有 tween 与 ScrollTrigger（`ScrollTrigger.getAll().forEach(t => t.kill())`）；SplitType 在卸载前 `revert()`，避免 SSR/CSR 不一致导致的 hydration 报错
- **React**：同上，用 `useLayoutEffect` 建立、cleanup 函数销毁；`useGSAP`（@gsap/react）优先
- **路由转场**：用路由守卫等待 P11 转场动画完成后再真正切换组件（Vue Router 的 `onBeforeRouteLeave` 返回 Promise / React 的 startTransition + 手动 delay）
- **字体加载后再切分文字**：监听 `document.fonts.ready`，否则 SplitType 按错误度量切行
- Lenis 在 SPA 中要挂在布局层而非页面组件，路由切换时 `lenis.scrollTo(0, { immediate: true })`

更细粒度的清理纪律（gsap.context + 回调中创建的 tween 手动 kill）与 12 个即用配方见 `recipes.md` §10。

### 推荐栈

- Vite + Vue3/React + GSAP + Lenis + SplitType（与单文件同一套库，迁移零成本）
- 3D 场景：Three.js + `@tresjs/core`（Vue）或 react-three-fiber，场景独立 chunk 懒加载

## 性能红线

- 单页 DOM 节点 < 3000；动画只改 `transform` / `opacity` / `clip-path`，禁止动画化 `top/left/width/height/margin`
- 图片：`loading="lazy"` + `decoding="async"` + 明确 `aspect-ratio`；首屏大图可 `fetchpriority="high"`
- `will-change` 只加在动画进行中的元素，结束即移除（GSAP 自动处理大部分）
- 噪点层、光标层必须 `pointer-events: none`，且禁止放进任何会被频繁重排的容器
- Lighthouse 目标：FCP < 2s、无 CLS（字体 swap + aspect-ratio 锁定）

## 降级矩阵（三重降级，缺一不可）

| 场景 | 策略 |
|---|---|
| `prefers-reduced-motion: reduce` | 跳过 Preloader；ScrollTrigger 动画改为立即显示（`gsap.set` 终态）；关闭 Lenis；保留 Grain（静态无妨） |
| 触屏（`hover: none` / `pointer: coarse`） | 隐藏自定义光标；磁性按钮改普通点击态；水平画廊改原生横滑或纵向堆叠；hover 揭示效果改为常显 |
| 窄屏（< 768px） | 标题 `clamp` 自动缩；多栏文本降单栏；pinned 段降为普通纵向滚动；导航折叠为全屏菜单 |

模板中已写好前两条的完整实现（CSS media query + JS `gsap.matchMedia`），改写时保留。

## 交付质检清单（逐项过，未过不交付）

**定调**
- [ ] 打开页面 3 秒内能说出这是什么调性吗（风格体系是否贯彻）
- [ ] Preloader ≤ 2.5s 且只播一次（session 内）
- [ ] 强调色全站是否只出现 1 种

**呼吸感（B 法则逐条过）**
- [ ] 全页是否有 ≥ 2 处近空屏（60–100vh 纯留白或单行大字）
- [ ] 是否存在连续两个区块都带大动效（有 = 返工）
- [ ] 逐屏截图：每一屏都能用 ≤5 个字说出焦点；有抢焦点的屏就拆
- [ ] 时间线内动画组之间是否有 ≥ 0.3s 呼吸位
- [ ] 页面级动画时长是否落在 0.8–1.2s（快节奏只存在于微交互）
- [ ] 快速滚动全程无"动画打架"（同时有 3 个以上 tween 在跑 = 编排失败）

**排版**
- [ ] 标题/正文是否至少 4 级字号且层级比 ≥ 2.5
- [ ] 大标题字距、行高是否符合体系规范；中文标题没有被错误压字距
- [ ] 正文行长 ≤ 35em；行长与行高成比例（1.6–1.75）
- [ ] 分隔是否用 hairline 细线而非粗边框/阴影
- [ ] 区块垂直留白 ≥ 6rem

**动效**
- [ ] 大型动效（pinned/水平滚动/3D）≤ 2 处
- [ ] 每个动画能说出叙事职能（引导视线/揭示/节奏），否则删
- [ ] 所有 easing 来自约定清单，无 linear
- [ ] 同时入场元素统一 timeline + stagger
- [ ] resize 后文字切分正确（拉动窗口宽度验证）
- [ ] 每处滚动效果上滚可逆（scrub 天然可逆；补间加 `toggleActions: 'play none none reverse'`）

**降级与移动端**
- [ ] `prefers-reduced-motion` 模拟下内容完整可见
- [ ] 375px 宽度下无横向滚动条、无重叠、无溢出
- [ ] 触屏无 hover 死角（本靠 hover 显示的信息常显）

**工程**
- [ ] 无 console 报错；字体 swap 无长时间白屏
- [ ] 图片全部 lazy + aspect-ratio，无布局抖动
- [ ] 噪点层/光标层 pointer-events: none
- [ ] （多页时）转场后滚动位置重置正确

**内容**
- [ ] mono 小标签体系一致（编号、坐标、单位）
- [ ] 文案层级真实（不是 lorem 假文就交付）
