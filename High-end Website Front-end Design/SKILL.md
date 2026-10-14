---
name: high-end-website-frontend-design
description: 高端现代网站前端美学与动效实施指南。当用户要求网页有高级感、呼吸感、滚动叙事、现代交互、Awwwards 风格动效，或要求检查动效细节时使用。涵盖平滑滚动、双向滚动呼应、视差、磁吸、打字机等 12 个签名手法的即用配方。
---

# High-end Website Front-end Design

让页面看起来"很贵"的不是堆特效，而是**节奏、克制与呼应**。本 skill 是一套可复用的实施纪律 + 签名手法配方（GSAP 3 / Vue3 语境，原理通用）。

## 核心美学原则（先读这个）

1. **呼吸感 = 留白 + 缓动 + 惯性**。section 上下 padding ≥ 120px；全局缓动统一用 `expo.out / power3.out`；滚动必须有惯性（Lenis），生硬的逐格滚动会毁掉一切。
2. **一个区块只允许一个"花哨"**。其余全部用同一套设计令牌（双色 accent + 单一线宽 + 等宽字标签）。特效堆叠 = 廉价感。
3. **一切滚动效果必须双向呼应**。向下滚有入场，向上滚必须能收回/倒带。单向动画会被用户感知为"卡死"。
4. **动画跟手，不跟时间**。叙事类效果（退场、视差、打字）一律 `scrub`；强调类效果（入场、磁吸）才用 duration 补间。
5. **纪律**：每个动画必须 (a) 尊重 `prefers-reduced-motion`，(b) 在 onBeforeUnmount 清理（gsap.context + 手动 kill 在回调中创建的 tween），(c) 不触发布局抖动（用 transform/opacity，隐形 sizer 层锁尺寸）。

## 签名手法清单（按优先级，配方见 references/recipes.md）

| # | 手法 | 一句话 | 性价比 |
|---|------|--------|--------|
| 1 | 平滑滚动 | Lenis × gsap.ticker，全站呼吸感的地基 | ★★★★★ |
| 2 | 双向 reveal | `toggleActions: 'play none none reverse'` | ★★★★★ |
| 3 | 滚动叙事退场 | Hero 内容随滚动上浮淡出交给下一区块（scrub） | ★★★★★ |
| 4 | 速度感应字幕 | 无限 marquee 的 timeScale 由滚动速度调制，回滚反向 | ★★★★ |
| 5 | 逐字/解码文字 | splitToChars 入场 + scramble 解码（只拉丁字符乱码，CJK 原位） | ★★★★ |
| 6 | 磁吸交互 | quickTo 吸附指针，离开弹回；只用于大目标（卡片/按钮） | ★★★★ |
| 7 | scrub 视差 | 幽灵字/背景层 ±4% 漂移，制造纵深 | ★★★★ |
| 8 | 数字滚动 | 代理对象 `{v:0}` + onUpdate，计数统计 | ★★★ |
| 9 | 3D 倾斜卡片 | quickTo rotationX/Y + 指针光斑 radial-gradient | ★★★ |
| 10 | 代码窗口打字 | 隐形 sizer 锁布局 + tokenize 一次逐帧截断 + 完成态 CSS 驱动 | ★★★ |
| 11 | 阅读进度条 | 2px 渐变 scaleX(0→1) scrub 全页 | ★★ |
| 12 | Preloader 门控 | 首屏动画等预加载完成事件再播放 | ★★ |

## 实施流程

1. **先定令牌再写动效**：双色 accent（主+辅）、bg 两级、ink 三级透明度、line/glass。亮暗主题所有令牌成对定义，特效颜色只准引用令牌。
2. **逐区块应用**：每区块 = 通用 sec-label（编号+中英文 mono 小字）+ sec-title（幽灵英文 + 中文大字）+ 内容层。入场错峰（label→title→内容）。
3. **滚动叙事线**：检查从上到下的"故事"——Hero 退场 → 字幕过渡 → 区块接力。每个区块离场时给下一个让路。
4. **双向自检**：每一处 ScrollTrigger 问一遍"上滚会怎样？"——scrub 天然可逆；补间必须加 `toggleActions`。
5. **验收协议**（必做）：
   - 构建 0 报错；console 无 GSAP warning（target not found / overlap）
   - 浏览器实测：滚轮顺滑度、进度条、双向收回、速度感应、磁吸、reduced-motion 降级、亮暗双主题配色、移动端 900px 断点
   - 详情/子页面回归：路由切换后 ScrollTrigger.refresh()，无失效无重复

## 红线（做了就掉价）

- 无惯性滚轮滚动 / 动画不跟手
- 同元素两个 transform 动画源打架（CSS :hover transform vs GSAP inline transform）
- 解码乱码打乱中文（CJK 必须原位）
- 回滚不重置、重复播放、动画堆叠泄漏
- 特效颜色脱离设计令牌自造色值
