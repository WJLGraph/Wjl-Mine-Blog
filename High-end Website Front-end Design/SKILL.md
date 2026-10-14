---
name: high-end-website-frontend-design
description: 高端现代网站前端设计实施系统（Awwwards 级）。当用户要求网页有高级感、呼吸感、滚动叙事、现代高端交互、获奖网站风格，或要把普通页面升级为高端展示页、检查动效细节时使用。涵盖风格体系、呼吸感节奏律、签名动效模式、即用代码配方、单文件模板与交付质检。
agent_created: true
---

# High-end Website Front-end Design

"高级感"不是某个特效，而是一套可复制的系统 = **克制的美术方向 × 排版功底 × 节奏化动效 × 工程纪律**。本 skill 融合风格体系库、动效模式库与实战代码配方，适用于品牌官网、产品发布页、作品集、数据展示等以"展示与叙事"为目的的页面。

## 核心原则（九条，先读）

1. **先定调，再写码。** 动手前必须从 `references/style-systems.md` 六大体系中选一个（用户未指定时默认 Nocturne 暗黑奢华或 Swiss Mono 瑞士极简），提取字体对/配色/间距落为 CSS 变量，全站贯穿，禁止混搭。
2. **呼吸感是高端与廉价的第一分界线。** 页面像乐章：动-静-动交替；高密度区块之间插入 60–100vh 近空屏（仅单行大字或留白 + mono 小标签）；每屏只讲一个信息点；动画组之间留 ≥ 0.3s 呼吸位。**现代简约感来自"少"，高端感来自"慢"**——入场 0.9–1.2s 宁慢勿快，缓动统一 `power4.out / expo.out / cubic-bezier(0.65, 0, 0.35, 1)`。
3. **克制优于炫技。** 每页大型动效（pinned / 水平滚动 / 3D）≤ 2 处；强调色全站 1 个；一个区块只允许一个"花哨"；分隔线用 0.5–1px hairline 细线，不用粗边框与阴影堆叠。
4. **字体是第一动效。** 高端感 70% 来自排版：display 字号 clamp 到 8–12vw、字距 -0.02~-0.05em（中文标题只用 -0.01~0，压狠了会糊）、至少 4 级字号阶梯且层级比 ≥ 2.5、正文行长 ≤ 35em、mono 大写小标签体系（编号/坐标/单位）贯穿全站。
5. **一切滚动效果必须双向呼应。** 向下滚有入场，向上滚必须能收回/倒带——scrub 类天然可逆；补间类必须 `toggleActions: 'play none none reverse'`。单向动画会被用户感知为"卡死"。
6. **动画跟手，不跟时间。** 叙事类（退场/视差/打字/揭示）一律 `scrub`；强调类（入场/磁吸/hover）才用 duration 补间。
7. **动效必须有叙事职能。** 每个动画要么引导视线、要么揭示信息、要么建立节奏；纯装饰动画一律删除。
8. **交付形态看场景。** 展示型页面默认产出可直接打开的单文件 HTML（复制 `assets/template.html` 为起点）；用户明确要求 Vue/React 工程化时，按 `references/recipes.md` 配方实现。
9. **降级完备 + 生命周期清理。** 三重降级（`prefers-reduced-motion` / 触屏无 hover / < 768px）缺一不可；每个动画必须在卸载时 kill/revert；特效颜色只准引用设计令牌，不自造色值。

## 工作流程（六步，按序执行）

### Step 1 — 需求定位（最多 1 次询问）
确认三件事：网站类型与内容、情绪调性关键词、品牌资产（logo/色/字体/图）。用户只给模糊描述（"做个高级感的官网"）时，直接选定体系出实物供迭代，不空转追问。

### Step 2 — 选定风格体系
读 `references/style-systems.md`，从 Nocturne / Swiss Mono / Editorial / Technical Brutalist / Warm Humanist / Immersive 3D 中选一个，token 落为 CSS 变量。

### Step 3 — 页面结构规划（叙事骨架）
按需取舍，不是全都要：Preloader → 固定导航（hairline 底边）→ Hero 炸场 → 宣言空屏 → 内容主体（密疏交替）→ Marquee 过渡 → 大图 / pinned 高潮段 → CTA / Footer 收束。长页面每 3–5 屏安排一个节拍点。

### Step 4 — 动效编排
读 `references/motion-patterns.md`（12 个模式 + 呼吸感节奏律 B1–B6），挑 5–8 个组合。黄金组合 = Preloader + Lenis + 逐行揭示 + 图片 clip-path + Marquee + 自定义光标 + 磁性按钮 + hairline 分隔。参数一律从模式库默认值起步微调，不自己发明数值。

### Step 5 — 实现
- **单文件交付**：整文件复制 `assets/template.html`（已内置 Preloader / Lenis / 自定义光标 / 磁吸 / 逐行揭示 / 图片揭示 / Marquee / Grain / 全部降级），替换 token 与内容，删除未用区块。
- **工程化交付（Vue3/React）**：按 `references/recipes.md` 逐条移植配方。Lenis 挂布局层而非页面组件；`document.fonts.ready` 后再切分文字；路由切换时 `lenis.scrollTo(0, { immediate: true })` + `ScrollTrigger.refresh()`。

### Step 6 — 质检验收
过 `references/implementation.md` 的《交付质检清单》+ 下方《验收协议》，未过不交付。

## 签名手法总表（选型速查，实现见 references/）

| 分组 | 手法 | 一句话 | 配方位置 |
|---|---|---|---|
| 地基 | Lenis 平滑滚动 | gsap.ticker 驱动 lerp 0.1，全站惯性 | recipes §1 / P2 |
| 地基 | 双向 reveal | `toggleActions: 'play none none reverse'` | recipes §2 |
| 入场 | Preloader 计数揭幕 | 0→100 计数 + "揭幕即开场"，≤2.5s 且 session 只播一次 | P1 / template |
| 入场 | 文字逐行/逐字揭示 | overflow mask + `yPercent 110→0`，power4.out | P3 / recipes §5 |
| 入场 | 图片 clip-path 揭示 | `inset(100%→0)` + 内图 scale 1.3→1 反差动效 | P4 / template |
| 入场 | 数字滚动 | 代理对象 `{v:0}` + onUpdate 计数 | recipes §7 |
| 叙事 | Hero 滚动退场 | 内容随滚动上浮淡出，给下一区块让路 | recipes §3 |
| 叙事 | scrub 视差 / 幽灵字 | ±4~15% 漂移制造纵深，禁止过山车 | recipes §3 / P9 |
| 叙事 | 速度感应 Marquee | timeScale 随滚动速度调制，回滚反向 | recipes §4 / P5 |
| 叙事 | Pinned 驻留讲解 | pin + scrub 图片序列/文字替换，全站 ≤2 处 | P8 |
| 微交互 | 磁吸按钮 | quickTo 吸附 + elastic 回弹，仅 ≤3 处 CTA | recipes §6 / P7 |
| 微交互 | 自定义光标 | 点 + 环双层，difference 混合，全站唯一 mix-blend | P6 / template |
| 微交互 | 3D 倾斜卡片 | quickTo rotationX/Y + 指针光斑 | recipes |
| 微交互 | 代码窗口打字 | 隐形 sizer 锁布局 + tokenize 逐帧截断 | recipes §8 |
| 质感 | Grain 颗粒 | feTurbulence 噪点 opacity .05，消除塑料感 | P12 / template |
| 质感 | 阅读进度条 | 2px 渐变 scaleX(0→1) scrub 全页 | recipes §9 |
| 路由 | 页面转场 | 遮幕盖下 → 换页 → 揭开 | P11 |

## 红线（出现即返工）

- 无惯性滚轮滚动 / 动画不跟手 / easing 全用 `linear` 或默认 ease
- 高饱和渐变色块、紫色 Tailwind 渐变、卡片阴影堆叠、Bootstrap 感圆角卡片阵列
- 同元素两个 transform 动画源打架（CSS `:hover` transform vs GSAP inline transform）
- 解码乱码打乱中文（CJK 必须原位）；回滚不重置、重复播放、动画堆叠泄漏
- 到处 parallax / 到处发光 / 到处磁吸 / 到处 3D
- 特效颜色脱离设计令牌自造色值
- 动画化 `top/left/width/height/margin`；噪点层、光标层忘加 `pointer-events: none`
- 连续两个区块都带大动效；一屏两个焦点抢戏
- 系统默认字体细字重大段正文、行长 > 35em

## 验收协议（每次动效改动的固定动作）

- [ ] 构建 0 报错，console 无 GSAP warning（target not found / overlap）
- [ ] 滚轮有惯性；锚点导航走 Lenis；每处效果上滚可逆（scrub 或 toggleActions）
- [ ] 逐屏截图：每屏能用 ≤5 个字说清焦点；全页 ≥ 2 处近空屏
- [ ] reduced-motion / 触屏 / 375px 三重降级下内容完整可见、无横向溢出
- [ ] 亮暗主题特效颜色均可用（只引用成对令牌）
- [ ] 子页面/详情页路由往返无动画失效或泄漏；resize 后文字切分正确
- [ ] Lighthouse：FCP < 2s、无 CLS（字体 swap + aspect-ratio 锁定）

## 资源索引

| 文件 | 用途 | 何时读 |
|---|---|---|
| `references/style-systems.md` | 6 大风格体系：字体对、配色 token、排版规范 | Step 2 选体系时 |
| `references/motion-patterns.md` | 12 动效模式 + 呼吸感节奏律 B1–B6 | Step 4 编排动效时 |
| `references/recipes.md` | 12+ 个实战验证的即用代码配方（GSAP 3 / Vue3） | 工程化实现时 |
| `references/implementation.md` | CDN 清单、工程化集成、性能红线、降级矩阵、质检清单 | Step 5–6 实现与质检时 |
| `assets/template.html` | 单文件高端模板（自包含约 700 行） | 单文件交付时整文件复制 |
