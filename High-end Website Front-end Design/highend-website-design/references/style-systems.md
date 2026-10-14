# 风格体系库（Style Systems）

6 个经过验证的高端网站风格体系。**一次只用一个**，将 token 落为 CSS 变量后贯穿全站。所有体系共享的用户审美基线：克制、细线、低饱和、大量留白、无 3D 滥用、无高饱和色块。

通用 token 命名（所有体系一致，只换值）：

```css
:root {
  --bg: ;          /* 页面背景 */
  --bg-alt: ;      /* 区块交替背景 */
  --fg: ;          /* 主文字 */
  --fg-dim: ;      /* 次级文字 */
  --accent: ;      /* 全站唯一强调色 */
  --hairline: ;    /* 细分隔线 */
  --font-display: ;/* 展示字体（大标题） */
  --font-body: ;   /* 正文字体 */
  --font-mono: ;   /* 等宽/标签字体 */
}
```

---

## 1. Nocturne — 暗黑奢华（默认推荐）

品牌官网、设计工作室、科技产品发布。黑场 + 象牙白文字 + 单一金属/荧光强调色，Awwwards 上最常见的获奖气质。

| Token | 值 |
|---|---|
| `--bg` | `#0A0A0A` |
| `--bg-alt` | `#111111` |
| `--fg` | `#EDEDED` |
| `--fg-dim` | `rgba(237,237,237,.55)` |
| `--accent` | `#C8A96A`（香槟金）或 `#D9FF3D`（荧光绿，科技感） |
| `--hairline` | `rgba(237,237,237,.14)` |
| `--font-display` | `"Cormorant Garamond", "Noto Serif SC", serif`（衬线优雅）或 `"Space Grotesk", "Noto Sans SC", sans-serif`（现代） |
| `--font-body` | `"Inter", "Noto Sans SC", sans-serif` |
| `--font-mono` | `"Space Mono", monospace`（标签、编号、数据） |

排版规范：标题衬线 + 正文无衬线的混排；display 字号 `clamp(3.5rem, 10vw, 9rem)`，行高 0.95；小标签一律 mono 字体大写 + `letter-spacing: .2em`。图片 hover 从 grayscale(1) 过渡到彩色。

## 2. Swiss Mono — 瑞士极简（黑白灰 + 网格）

咨询、法务、金融、B2B 高端服务。绝对的秩序感：裸露网格、大黑体、几乎无彩色。

| Token | 值 |
|---|---|
| `--bg` | `#F4F3F1`（暖白） |
| `--bg-alt` | `#EBE9E6` |
| `--fg` | `#101010` |
| `--fg-dim` | `rgba(16,16,16,.6)` |
| `--accent` | `#101010`（用黑白反色块做强调，而非彩色） |
| `--hairline` | `rgba(16,16,16,.12)` |
| `--font-display` | `"Archivo", "Noto Sans SC", sans-serif`（900 字重） |
| `--font-body` | 同 display，400 字重 |
| `--font-mono` | `"IBM Plex Mono", monospace` |

排版规范：12 列网格裸露（区块间用 1px 细线分隔成"表格感"）；标题用超大无衬线 + 全大写；数字与坐标用 mono 标注（如 "01 / WORKS"）；强调靠**黑白反转块**与字号对比，不靠颜色。

## 3. Editorial — 杂志编辑风

内容型品牌、媒体、文化机构、精品作品集。像翻一本印刷杂志。

| Token | 值 |
|---|---|
| `--bg` | `#FAF7F2`（米纸色） |
| `--bg-alt` | `#F1ECE3` |
| `--fg` | `#1A1713` |
| `--fg-dim` | `rgba(26,23,19,.62)` |
| `--accent` | `#8C3B2E`（砖红）或 `#2F4538`（墨绿） |
| `--hairline` | `rgba(26,23,19,.14)` |
| `--font-display` | `"Playfair Display", "Noto Serif SC", serif` |
| `--font-body` | `"Source Serif 4", "Noto Serif SC", serif` |
| `--font-mono` | `"Space Mono", monospace` |

排版规范：首字下沉、多栏文本（`columns: 2`，栏间距 3–4rem）、图注用 mono 小字、图文混排的错位布局；标题与正文都用衬线，靠字重与字号分层。

## 4. Technical Brutalist — 技术粗野主义

开发者工具、AI 产品、极客品牌。裸露的"机器感"：等宽字体、终端绿/警示橙、扫描线。

| Token | 值 |
|---|---|
| `--bg` | `#0D0F0E` |
| `--bg-alt` | `#141716` |
| `--fg` | `#E8EDE9` |
| `--fg-dim` | `rgba(232,237,233,.5)` |
| `--accent` | `#57E389`（终端绿） |
| `--hairline` | `rgba(232,237,233,.16)` |
| `--font-display` | `"Space Grotesk", "Noto Sans SC", sans-serif` |
| `--font-body` | `"Space Grotesk", "Noto Sans SC", sans-serif` |
| `--font-mono` | `"JetBrains Mono", monospace` |

排版规范：大量 mono 标签（`[SYS.01]`、`/v2.0.4`）；细线方框（`border: 1px solid var(--hairline)`）而非圆角卡片；可加细微 grain 噪点与扫描线；数据用表格 + mono 呈现。强调色只用于状态点、下划线、光标闪烁。

## 5. Warm Humanist — 温暖人文

人文品牌、教育、公益、生活方式。无衬线 + 柔和米色 + 手写感点缀。

| Token | 值 |
|---|---|
| `--bg` | `#F7F4EF` |
| `--bg-alt` | `#EFEBE3` |
| `--fg` | `#2B2622` |
| `--fg-dim` | `rgba(43,38,34,.62)` |
| `--accent` | `#B4552D`（赤陶橙） |
| `--hairline` | `rgba(43,38,34,.14)` |
| `--font-display` | `"Fraunces", "Noto Serif SC", serif`（有温度的软衬线） |
| `--font-body` | `"Work Sans", "Noto Sans SC", sans-serif` |
| `--font-mono` | 不使用 mono，标签用 body 字体大写 |

排版规范：超大但圆润的标题（display 用 `font-variation-settings` 调 optical size）；大圆角图片（`border-radius: 2rem` 只用在这一体系）；柔和的 slow ease 动效。

## 6. Immersive 3D — 沉浸式（谨慎使用）

仅当用户明确要 3D/WebGL 时启用：Three.js 场景 + 极简 HUD 式 UI 覆盖层。

- 背景交给 WebGL 场景（粒子、流体、地形），前景文字层保持 Nocturne token
- 文字层必须有半透明底或模糊背板保证可读性
- 必须提供"跳过 3D"的静态降级；移动端自动降为静态图
- 约束：全站 1 个 3D 场景；纹理与几何体总量 < 5MB；用 `requestAnimationFrame` 内的 `renderer.setAnimationLoop`，禁止与 GSAP 抢滚动主线程

---

## 通用排版细则（所有体系适用）

- 字号阶梯示例：display `clamp(3.5rem, 10vw, 9rem)` / h2 `clamp(2.2rem, 5vw, 4.5rem)` / lead `clamp(1.1rem, 2vw, 1.5rem)` / body `1rem–1.125rem` / caption `.75rem`
- 大标题行高 0.95–1.05；正文行高 1.6–1.75；正文行长上限 35em（约 65–75 字符）
- 留白节奏：区块垂直 padding ≥ `clamp(6rem, 12vw, 12rem)`；文字块与屏幕边缘安全距离 ≥ 5vw
- **呼吸感留白**：全页至少 2 处"近空屏"（60–100vh 高度内仅单行大字或纯留白 + mono 小标签）；相邻区块的内容密度必须一密一疏交替；留白不是"没做完"，是设计本身——交付时向用户说明这些空屏是节奏位，不是缺内容
- **现代简约的密度红线**：任何一屏内的文字总量 ≤ 2 个层级（大字 + 一段说明）；一屏内图片 ≤ 1 张主图（图集画廊除外）；出现第 3 个层级就拆屏
- 中文额外规则：中文与西文之间手动加空格感（`word-spacing` 微调或直接排版空格）；中文大标题不强行 -0.05em 字距（会糊），用 -0.01em ~ 0；中西混排标题让西文用斜体或衬线制造对比
- 字体加载：Google Fonts CDN + `font-display: swap`；衬线 display 字体可加 `size-adjust` 防 CLS
