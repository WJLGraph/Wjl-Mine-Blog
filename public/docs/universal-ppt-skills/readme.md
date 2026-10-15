# Universal PPT · 全场景演示文稿提炼技能

> **Universal Presentation Generation** — 六类场景 × 30+ 风格 × 8 条渲染路径 × G1–G15 机器门禁的 AI Agent 演示文稿技能。
>
> 一个开源 AI Agent 技能（Skill）：提炼 17 个开源 PPT skill 的精华，把「AI 生成 PPT」最常见的三类翻车——全是文字、图片来源不可信、流程不透明——从"靠模型自觉"变成"机器判死的门禁 + 落盘的物证"。

- 仓库：<https://github.com/WJLGraph/universal-ppt-skills>
- 技能名：`universal-ppt-skill` · 提炼自 17 个开源 skill · MIT

---

## 一、为什么做这个

直接让大模型"帮我做个 PPT"，通常遇到三个问题：

| 顽疾 | 典型症状 | 本 skill 的对策 |
| --- | --- | --- |
| **全是文字** | 10 页有 9 页纯文字 bullet，号称"图文并茂"其实全是形状色块 | 视觉页严格定义（图片/原生图表/表格才算），G5/G6/G7 门禁判死 |
| **图片来源不可信** | 论文有现成的架构图不用，自己画一个示意版本；或贴来路不明的图 | 论文原图优先铁律 + `crop_paper_figs.py` 裁原文 + sha256 台账溯源（G10/G11/G15） |
| **流程不透明** | 跳过大纲确认直接出片，讲稿字数凭感觉，QA 全靠一句"已完成" | 两阶段 STOP-AND-WAIT 确认门 + 脚本实测留痕 + 交付证据块模板 |

## 二、内容结构

```
universal-ppt-skills/
├── SKILL.md                    # 主入口：10 条铁律 + 规则分级(R0/G/P) + 五阶段工作流
├── prompts/stage-prompts.md    # 两阶段 Prompt 模板（10 个可直接复制）
├── references/                 # 6 份长文档（按阶段加载）
│   ├── qa-gates.md             # G1-G15 门禁细则与机器判定方式
│   ├── render-paths.md         # R1-R8 渲染路径决策树（含 12 条实战坑）
│   ├── design-language.md      # 版式 / 字号 / AI 味反模式 / 呼吸感法则
│   ├── style-library.md        # 6 大场景 30+ 风格预设
│   ├── narrative-patterns.md   # 学术/商务/教学/政务/竞赛叙事结构
│   └── delivery-template.md    # 交付证据块模板（不可豁免字段）
├── scripts/
│   ├── deck_qa.py              # 单入口门禁：G1-G15 全自动判定，FAIL → exit 1
│   └── crop_paper_figs.py      # 论文原图裁切 + figures.json 溯源台账
│                               #   + paper-figures.json 论文图片清单
├── docs/                       # 素材与基准（论文 PDF、个人档案、80 页截图）
└── example/                    # 8 份实验产物（4 模型 × 2 主题）
```

## 三、门禁一览（G1–G15）

| 门禁 | 检查项 | 判定方式 |
| --- | --- | --- |
| G1 | 页数与 spec 一致 | python-pptx |
| G2 | 讲稿逐页 80–120 字 | `len()` 实测 |
| G3/G4 | 形状越界 / 文字溢出 | 几何估算 + 不可断行 token 宽度 |
| G5/G6/G7 | 视觉页占比 ≥60% / 无连续 3 页非视觉 / 视觉锚点 | 图片·原生图表·表格才算，形状色块不算 |
| G8/G9 | 占位符残留 / 中文模板化禁语 | 正则扫描 |
| G10 | 图片溯源：sha256 ↔ 台账，仅接受 pdf-crop / docs-asset / 已留痕 self-made | 哈希 + 台账 |
| G11 | 含图页 in-slide citation | 文本扫描 |
| G12 | 大纲/风格两阶段确认证据 | spec 字段 |
| G13/G14 | action title / 字体族收敛与阴影继承 | 黑名单启发 / XML 遍历 |
| G15 | **论文原图使用核查**：清单里每个 Figure 要么上片、要么给 ≥8 字理由；自绘图不得多于论文原图 | 题注扫描清单 vs 台账 |

规则分三级：**R0 铁律**（不可豁免）→ **G 门禁**（脚本机器判死）→ **P 偏好**（可说明理由后偏离）。

## 四、五阶段工作流

1. **Stage 1 素材拆解**：结构化提取 + 术语台账 + 主张清单；
2. **Stage 2 大纲设计**：action title 串 + ghost deck 测试，**STOP-AND-WAIT 等用户确认**；
3. **Stage 3 视觉系统**：2-3 个风格候选等锁定，定视觉规格卡；
4. **Stage 4 多路渲染**：八条路径按决策树选路；论文 deck 先跑 `crop_paper_figs.py` 建台账；
5. **Stage 5 质检交付**：`deck_qa.py` G1–G15 + 渲图逐页目检 + 交付证据块。

## 五、快速开始

```bash
git clone https://github.com/WJLGraph/universal-ppt-skills ~/.claude/skills/universal-ppt-skill

# 论文 deck：先裁原图（同时产出论文图片清单）
python scripts/crop_paper_figs.py --pdf 论文.pdf --out work/figs --manifest work/figures.json

# 再跑单入口门禁（任何 FAIL → exit 1）
python scripts/deck_qa.py 成品.pptx \
    --spec work/deck-spec.json --figures work/figures.json \
    --paper-figures work/paper-figures.json --mode A --out work/qa_output.txt
```

之后对 agent 说「做一份答辩 PPT」「把这篇论文转成 slides」「述职汇报」等触发词即自动路由。技能不绑定单一模型或宿主环境。

## 六、实测基准：8 份 deck 横评

同一套素材（个人档案 + iTransformer 论文）交给 4 个平台模型各生成 2 份 deck（10 页/份），全部 80 页在仓库 README 中以截图对照展示：

- **讲稿字数门禁 100% 有效**：80 页讲稿全部落在 80–120 字（脚本逐页实测）；
- **图文并茂差距悬殊（0% → 100%）**：有论文素材可裁的 deck 视觉占比明显更高，无图 deck 文件体积只有 0.06–0.08 MB；
- **「看起来像论文图」≠「可验证」**：18 张嵌入图与重裁原图逐一比对 sha256，0 张一致 —— 这正是 G10/G15 要堵住的口子；
- **结论：素材决定上限，门禁决定下限。**
