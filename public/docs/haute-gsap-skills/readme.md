# Haute · High-end GSAP Skills

> **High-end Website Front-end Design** — engineer Awwwards-grade websites with AI coding agents.
>
> 一个开源 AI Agent 技能（Skill）：把「高级感」从主观审美拆解为可执行、可验收的工程系统，教 Claude Code / Cursor / Copilot 等 40+ 编码代理产出获奖级网站。

- 仓库：<https://github.com/WJLGraph/haute-gsap-skills>
- 参考实现（本站）：<https://wjl-mine-blog.w200407162022.workers.dev/#/>（部署于 Cloudflare Workers，国内访问需代理/VPN）
- 协议：MIT · 当前版本 v1.3.0

---

## 一、为什么做这个

AI 编码代理能让动画"能动"，但默认产出的往往是：Bootstrap 感卡片、高饱和渐变、到处 parallax、与滚轮打架的动效——技术正确，观感廉价。

**Haute 解决的问题**：把获奖级网站（Awwwards / FWA 水准）的设计决策压缩为 agent 可稳定复现的条款——

1. **九条核心原则**：克制优先、排版即骨架、动-静交替、单一样式系统、近空屏呼吸感、参数有出处、动效可逆、降级三重奏、宁慢勿快；
2. **六步工作流**：Brief → 选风格体系 → 叙事骨架 → 编排动效 → 实现 → QA 验收；
3. **红线清单**：违反任一条直接返工（如动画 `top/left/width/height`、无 `pointer-events: none` 的噪点层、CJK 乱序拆字等）；
4. **验收协议**：代理自查 + 人工清单双闸，不通过不交付。

## 二、内容结构

```
haute-gsap-skills/
├── SKILL.md                  # 入口：九原则 + 工作流 + 红线 + 验收协议
├── llms.txt                  # agent 发现索引（含触发词）
├── README.md / LICENSE / CHANGELOG
├── .claude-plugin/           # Claude 插件市场配置
├── .cursor-plugin/           # Cursor 插件配置
├── .github/copilot-instructions.md
├── references/               # 五份长文档（按需加载）
│   ├── style-systems.md      # 六大风格体系 token 精确值
│   ├── motion-patterns.md    # 12 动效模式 + B1–B6 节奏律
│   ├── recipes.md            # 12+ 实战配方（自包含可整段复制）
│   ├── gsap-engine.md        # 10 节引擎纪律（蒸馏自官方 skills）
│   └── implementation.md     # 交付质检与验收协议
└── assets/
    ├── template.html         # 自包含单文件参考模板
    ├── style-packs.css       # 六套即贴 CSS 变量包
    └── banner.jpg
```

## 三、六大风格体系

| 体系 | 气质 | 强调色 | 适用 |
| --- | --- | --- | --- |
| **Nocturne**（默认） | 暗黑奢华，衬线 × 无衬线 | 香槟金 / 霓虹点缀 | 品牌站、发布页、作品集 |
| **Swiss Mono** | 网格秩序，近乎无色 | 反白黑块 | 咨询、金融、B2B |
| **Editorial** | 印刷杂志 | 砖红 / 墨绿 | 媒体、文化、作品集 |
| **Technical Brutalist** | 终端机器感 | 终端绿 | 开发者工具、AI 产品 |
| **Warm Humanist** | 柔软人文，圆角 | 陶土橙 | 教育、生活方式、NGO |
| **Immersive 3D** | WebGL + HUD 覆盖 | token 驱动 | 仅显式要求时使用 |

每套体系在 `references/style-systems.md` 给出精确 token，`assets/style-packs.css` 提供即贴 CSS——**全站只用一套，禁止混搭**。

## 四、呼吸感节奏律（B1–B6）

高级感的底层不是"动得多"，而是节奏：

- **B1 动-静交替**：密集信息区之后必须接近空屏，让视线有落点；
- **B2 近空屏**：每屏只承载一个信息点，留白即排版；
- **B3 宁慢勿快**：入场动画统一 0.9–1.2s，缓动只用 `power4.out` / `expo.out` 一族；
- **B4 一屏一信息点**：滚动叙事每次只推进一个论点；
- **B5 可逆性**：所有滚动动效必须双向可逆，反向滚动不失效；
- **B6 降级三重奏**：`prefers-reduced-motion` 触控降级、移动端关闭重特效、低端设备静帧。

## 五、引擎纪律（蒸馏自 GSAP 官方 skills）

`references/gsap-engine.md` 把 [greensock/gsap-skills](https://github.com/greensock/gsap-skills)（core / timeline / scrolltrigger / plugins / utils / performance / frameworks）压缩为 10 节可执行纪律：transform 别名、`autoAlpha`、时间线位置参数、`scrub` vs `toggleActions`、`gsap.context` + revert、`quickTo`、`gsap.utils`、免费插件（Flip / SplitText / ScrambleText…）、Vue3 生命周期规则、零警告自检。

**审美决定做什么，引擎纪律决定做得对不对。**

## 六、实战配方（节选）

- **Lenis 集成**：与 ScrollTrigger 同步的标准化接线，杜绝路由跳转后滚动状态不同步；
- **双向可逆入场**：`once: false` + 正反两套触发，反向滚动同样有动效；
- **零依赖 CJK 拆字器** `splitToCJKChars`：浅克隆包装子元素，中文与标点原位保留，不破坏阅读顺序；
- **打字机 + 手写语法高亮器**：sticky 正则 `tokenize` 单遍扫描、`sliceHtml` 逐帧截断，输出阶段才转义，零第三方依赖；
- **路由清理纪律**：`gsap.context` 包裹全部动效，`onBeforeUnmount` 一律 `revert()`。

## 七、安装（四条路径）

```bash
# 1. skills CLI（40+ agent 通用）
npx skills add WJLGraph/haute-gsap-skills

# 2. Claude Code 插件市场
# 3. Cursor 规则（.cursor-plugin/）
# 4. Copilot（.github/copilot-instructions.md）
```

## 八、合规要点（发布前逐项校验）

- 目录名与 frontmatter `name` 严格一致（agentskills.io 硬约束）；
- `license: MIT` 显式声明，description < 1024 字符；
- 英文优先描述 + 双语触发词，保证国际 agent 路由命中；
- 4 份插件市场 JSON 全部通过语法校验；
- 配方全部去个人化——不依赖本站私有路径，任何项目可整段复制。
