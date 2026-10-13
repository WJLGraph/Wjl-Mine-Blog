/**
 * 精选项目数据 — 来源：GitHub @wjl-cong / Gitee @wjl2004 公开仓库
 * 及本地仓库 README / docs / 源码调研（e:\agent-gauntlet、e:\Yunnan_fire_agent\*）
 * 每个对象同时驱动首页卡片与项目详情页
 */
export const projects = [{
        id: 'fire-agent',
        index: '01',
        featured: true,
        visual: 'v1',
        icon: 'fire',
        name: '焰哨系统 · Fire Agent',
        en: 'FIRE AGENT PLATFORM',
        year: '2026',
        tagline: '焰哨 FlameSentry · 智慧火险预警与多智能体协作平台',
        desc: '多 Agent 协同完成火险数据检索、风险研判与结构化报告生成，并经红队持续加固的 Agent 风格系统。',
        hero: 'shots/fire-agent/02-agent-center.png',
        overview: [
            '焰哨系统是我「火防三部曲」的终点站：本科毕业设计先以「智火卫渝」在重庆完成多源数据融合的火险智能预测，随后将研究区域转向云南、沉淀为「云南省火险可视化大屏」，最终在纯前端大屏的基础上重构为一套以大模型为核心的 Agent 风格系统 —— 由多 Agent 协同完成火险数据检索、风险研判与报告生成，把「看数据」升级为「由系统替你研判数据」。',
            '系统采用前后端分离架构：Vue3 前端提供登录注册、作战大屏、智能查询、知识库、Agent 协作中心、报告中心、个人中心、系统管理八大模块，支持 2D/3D 数字孪生切换、明暗双主题与全链路语音交互；FastAPI 后端以 LangGraph 编排 8 节点 Agent 工作流，SSE 实时推送节点级进度，PostgresSaver 持久化任务状态，支持 HITL 人工审批中断恢复。开发过程中，我同步构建了 Agent-Gauntlet 红队测试系统对其持续加固，形成「攻击 — 防御 — 修复」的安全闭环。'
        ],
        role: '独立开发 · Agent 编排 / 前端 / 后端',
        period: '2026.09 — 至今',
        status: '持续迭代中 · v1.0.1',
        archDesc: [
            '整体分为三层：前端交互层（Vue3 八大模块）通过 REST + SSE 与 FastAPI 服务层通信；编排层由 LangGraph 驱动 8 节点状态机 —— parse_task 拆解计划后，query_data 与 analyze_gis 并行 fan-out，经 join 汇聚进入 generate_report 流式生成，再经 review_report 评审循环打磨，最终在 approval_gate 接受人工审批（HITL 条件边）。',
            '支撑层提供三类能力：PostgresSaver checkpoint 让任意节点可中断/恢复；DataAgent 对历史火点与预测火险双源查询并做空结果反思重试；chaos hook 默认关闭、环境变量门控，为红队注入故障而不影响生产。'
        ],
        stackGroups: [
            { group: '前端', items: ['Vue3', 'Vite', 'Pinia', 'Element Plus', 'ECharts', 'Three.js', 'OpenLayers'] },
            { group: '后端', items: ['Python', 'FastAPI', 'LangChain', 'LangGraph', 'PostgresSaver', 'SSE 流式'] },
            { group: 'AI 工程', items: ['OpenAI Adapter', 'Prompt 编排', 'RAG 知识库', 'HITL 审批'] },
            { group: '数据', items: ['历史火点', '预测火险', '双源查询'] }
        ],
        features: [
            { title: '多 Agent 协同研判', desc: 'DataAgent / GisAgent / RagAgent 分工协作，任务在 8 节点间流转与汇聚，输出带风险判定的结构化结论。' },
            { title: 'LangGraph 8 节点编排', desc: 'parse_task → 双路并行查询 → join → 报告生成 → 评审循环 → HITL 审批门，支持并行 fan-out 与条件边。' },
            { title: 'SSE 节点级实时进度', desc: '长任务全程可观测：节点级进度推送 + 任务状态机 + 任务历史查询。' },
            { title: '报告中心', desc: 'LLM 流式生成 + 失败模板兜底；报告独立归档、分页筛选、详情查看与导出，每份报告独立留档不覆盖。' },
            { title: 'HITL 人工审批', desc: 'approval_gate 条件边挂起任务，人工审批后从 checkpoint 恢复继续执行。' },
            { title: '知识库 RAG', desc: '火险领域知识入库检索，为研判与报告提供领域依据。' }
        ],
        effects: [
            { title: '8 节点编排稳定运行', desc: '并行 fan-out、join 汇聚、评审循环与 HITL 条件边全链路跑通。' },
            { title: 'LLM 可靠性降级', desc: '生成失败自动模板兜底，报告服务不中断。' },
            { title: '八大功能模块', desc: '登录注册 / 作战大屏 / 智能查询 / 知识库 / Agent 协作中心 / 报告中心 / 个人中心 / 系统管理。' },
            { title: '异常可观测', desc: 'query_data 节点透传原始异常，错误定位精确到节点。' },
            { title: '混沌注入预留', desc: 'chaos hook 默认关闭、env 门控，红队测试生产无感。' }
        ],
        problems: [
            { problem: '长任务黑盒，用户无法感知 Agent 在做什么', solution: 'SSE 节点级进度推送 + 任务状态机 + 任务历史接口' },
            { problem: '危险操作缺少人工监督', solution: 'approval_gate 引入 HITL：任务挂起，审批后从 checkpoint 恢复' },
            { problem: 'LLM 输出不稳定、可能答非所问', solution: 'review_report 评审循环 + 生成失败模板兜底降级' },
            { problem: '历史火点与预测火险双源数据格式不一', solution: 'DataAgent 双源查询统一封装 + 空结果反思重试' },
            { problem: '报告详情页 404 与请求覆盖竞态', solution: '前端请求竞态处理 + 404 状态显式渲染' }
        ],
        difficulties: [
            { title: 'LangGraph 状态机设计', desc: '8 节点流转、并行 fan-out 与 join 汇聚、评审循环回到生成节点、HITL 条件边挂起 —— 每一步都要在图中精确建模，并配合 PostgresSaver 做状态持久化。' },
            { title: '流式报告工程化', desc: '汇总三类 Agent 结果构造报告 prompt，LLM 流式生成，注入生成时间与页脚，失败时无缝切换模板兜底。' },
            { title: '异常透传机制', desc: 'query_data 节点将原始异常完整透传到 output.error，让上层能看到真实错误而非笼统失败，定位效率大幅提升。' },
            { title: '混沌注入无感化', desc: 'chaos injection hook 以环境变量门控、默认关闭，保证生产路径零感知，测试时又可向任意节点注入故障。' }
        ],
        shots: [
            { src: 'shots/fire-agent/02-agent-center.png', caption: 'Agent 协作中心 — 多智能体协同过程可视（浅色主题）' },
            { src: 'shots/fire-agent/03-report-center.png', caption: '报告中心 — 报告独立归档与检索（浅色主题）' },
            { src: 'shots/fire-agent/04-smart-query.png', caption: '智能查询 — 自然语言驱动数据检索（浅色主题）' },
            { src: 'shots/fire-agent/05-knowledge.png', caption: '知识库 — RAG 领域知识管理（浅色主题）' },
            { src: 'shots/fire-agent/06-login.png', caption: '登录注册 — JWT 认证入口（浅色主题）' },
            { src: 'shots/fire-agent/07-arch.png', caption: '系统架构图（仓库 docs/puml）' },
            { src: 'shots/fire-agent/08-langgraph.png', caption: 'LangGraph 编排图（仓库 docs/puml）' },
            { src: 'shots/fire-agent/09-hitl.png', caption: 'HITL 人工审批流程（仓库 docs/puml）' }
        ],
        metrics: [],
        links: [
            { label: 'GITHUB', type: 'github', url: 'https://github.com/wjl-cong/fire_agent' },
            { label: 'GITEE · FRONT', type: 'gitee', url: 'https://gitee.com/wjl2004/fire_agent_front' },
            { label: 'GITEE · BACK', type: 'gitee', url: 'https://gitee.com/wjl2004/fire_agent_back' }
        ],
        docs: [
            { file: 'implementation.md', label: '整体实现 · 全栈文档' },
            { file: 'readme-frontend.md', label: '前端 README' },
            { file: 'readme-backend.md', label: '后端 README' },
            { file: 'thesis.md', label: '毕业论文 · 完整版' },
            { file: 'thesis-frontend.md', label: '毕业论文 · 前端分册' },
            { file: 'thesis-backend.md', label: '毕业论文 · 后端分册' },
            { file: 'agent-upgrade-plan.md', label: 'Agent 升级计划' }
        ]
    },
    {
        id: 'agent-gauntlet',
        index: '02',
        featured: false,
        visual: 'v2',
        icon: 'shield',
        name: 'Agent-Gauntlet',
        en: 'AGENT RED-TEAM',
        year: '2026',
        tagline: '面向 LLM 智能体的红队评测平台：故障注入 + 对抗攻击 + 判定评分',
        desc: '直接与间接提示注入、工具返回夹带、蜜罐、混沌故障注入 —— 用攻击者的方式守护自己的 Agent 系统。',
        hero: 'shots/agent-gauntlet/01-architecture.png',
        overview: [
            'Agent-Gauntlet 是我为自己的 Agent 系统（焰哨）打造的红队评测平台，核心能力为「故障注入 + 对抗攻击 + 判定评分」，默认被测对象就是焰哨森林火险业务智能体。',
            '平台分三层执行：CLI 以 `gauntlet run --suite ... --faults ... --honeypot ...` 发起评测；Runner 执行引擎按轮次调度功能轮（故障注入，考核 recovery_rate）与攻击轮（对抗攻击，考核 defense 判定）；攻击层从 YAML 载荷库装载用例 —— 每条载荷携带全局唯一 canary 标记与工具白名单，由 Injector 以直接注入、间接注入、工具返回夹带等方式送达被测 Agent，Detector 依四级判定输出 defense_score。'
        ],
        role: '独立开发 · 测试框架设计 / 攻击套件实现',
        period: '2026.10',
        status: '与焰哨系统协同演进',
        archDesc: [
            '评测流水线：CLI（--suite 用例集 / --faults 故障策略 / --concurrency 并发 / --delay 错峰 / --only 指定用例）驱动 Runner；攻击用例以 YAML 定义（id / input / attack_type / canary / tool_allowlist），蜜罐文档随 --honeypot 自动种植、purge-honeypot 一键清理。',
            '判定引擎按优先级短路判定 LEAKED_PROMPT → COMPROMISED → NOT_TRIGGERED → BLOCKED，并内置输入回声假阳性剔除；defense_score = 1 − (COMPROMISED + LEAKED) / 总数，NOT_TRIGGERED 计入总数。功能轮则以 recovery_rate 度量故障后的恢复能力。'
        ],
        stackGroups: [
            { group: '语言', items: ['Python'] },
            { group: '评测引擎', items: ['Runner 执行引擎', 'Detector 判定器', 'CLI 工具链'] },
            { group: '攻击面', items: ['YAML Payloads', 'Canary 标记', 'Injector 注入器', 'Honeypot 蜜罐'] },
            { group: '集成', items: ['HTTP 目标对接', 'env 门控 chaos', '评测库持久化'] }
        ],
        features: [
            { title: '5 类攻击任务', desc: '角色扮演、指令覆盖、目标劫持、知识库蜜罐、工具返回夹带，套件化组织、可扩展。' },
            { title: '四级防御判定', desc: 'LEAKED_PROMPT / COMPROMISED / NOT_TRIGGERED / BLOCKED 按优先级短路判定，输出量化 defense_score。' },
            { title: '工具返回夹带', desc: '对成功返回的字符串追加注入文本、对字典结果注入 _gauntlet_note 字段，模拟间接注入最隐蔽的通路。' },
            { title: '蜜罐机制', desc: '知识库蜜罐文档随攻击轮自动种植，附带 canary，事后 purge-honeypot 一键清理。' },
            { title: '故障注入（混沌）', desc: '功能轮注入依赖故障，度量 Agent 的 recovery_rate 恢复率；与焰哨 env 门控 chaos hook 联动。' },
            { title: 'CLI 进度可视化', desc: '实时输出攻击进度、defense 判定计数与 defense_score，回归结果一目了然。' }
        ],
        effects: [
            { title: '攻击轮全流程自动化', desc: '5 类攻击 × YAML 用例集自动执行，判定与评分自动落库。' },
            { title: '防御可量化', desc: 'defense_score = 1 − (COMPROMISED + LEAKED) / 总数，安全水位可回归对比。' },
            { title: '恢复可度量', desc: '功能轮故障注入输出 recovery_rate 与恢复判定计数。' },
            { title: 'W2 实战结论沉淀', desc: '角色扮演 / 指令覆盖 / 目标劫持 / 工具夹带逐类实测，输出加固建议。' }
        ],
        problems: [
            { problem: 'canary 出现在输入回声中造成误报', solution: 'detector 内置输入回声假阳性剔除逻辑' },
            { problem: '套件 canary 判定口径分散导致误判', solution: 'canary 标记统一移入 expect 断言，判定口径收敛' },
            { problem: '蜜罐文档残留污染后续评测', solution: 'purge-honeypot 单独命令一键清理' },
            { problem: '攻击过密触发被测方限流', solution: '--delay 错峰 + --concurrency 并发控制 + 限流分批补测' }
        ],
        difficulties: [
            { title: '透明的工具返回夹带', desc: '注入器在不破坏业务数据的前提下，把恶意指令追加进工具返回 —— 字符串追加注入文本、字典结果注入 _gauntlet_note 字段，复现最真实的间接注入通路。' },
            { title: '判定优先级设计', desc: '四级判定必须短路有序：先看提示词是否泄露，再看是否执行了越界工具调用，结合 canary 与输入回声剔除，才能给出可信的防御结论。' },
            { title: '双轮执行状态机', desc: '攻击轮写 defense 判定、功能轮算 recovery_rate，两条链路共用执行引擎但判定路径完全不同，在 executor 中精确分流。' },
            { title: '蜜罐闭环', desc: '蜜罐文档写入评测账号名下 → 等待 Agent 检索触发 → 收集证据 → purge 清理，任一环节泄漏都会污染下一次评测。' }
        ],
        shots: [
            { src: 'shots/agent-gauntlet/01-architecture.png', caption: '评测平台架构图（仓库 docs/puml）' },
            { src: 'shots/agent-gauntlet/02-modules.png', caption: '模块划分图（仓库 docs/puml）' },
            { src: 'shots/agent-gauntlet/03-defense.png', caption: '防御判定流程（仓库 docs/puml）' },
            { src: 'shots/agent-gauntlet/04-attack-sequence.png', caption: 'Agent 攻击时序图（仓库 docs/puml）' },
            { src: 'shots/agent-gauntlet/05-hardening-loop.png', caption: '加固闭环：攻击 → 判定 → 加固（仓库 docs/puml）' }
        ],
        metrics: [],
        links: [
            { label: 'GITHUB', type: 'github', url: 'https://github.com/wjl-cong/Agent-Gauntlet' },
            { label: 'GITEE', type: 'gitee', url: 'https://gitee.com/wjl2004/agent-gauntlet' }
        ],
        docs: [
            { file: 'readme.md', label: 'README · 项目主文档' },
            { file: 'tech-doc.md', label: '项目技术文档' },
            { file: 'test-report.md', label: '测试报告' },
            { file: 'log-platform.md', label: '开发日志 · 平台设计' },
            { file: 'log-progress.md', label: '开发日志 · 进度' },
            { file: 'thesis.md', label: '毕业论文' }
        ]
    },
    {
        id: 'yunnan-fire-map',
        index: '03',
        featured: false,
        visual: 'v3',
        icon: 'map',
        name: '云南省火险可视化大屏',
        en: 'GEO DATA PLATFORM',
        year: '2026',
        tagline: '基于 OpenLayers 的森林火险地理信息可视化大屏 —— 从被动救火到主动防火',
        desc: '毕业设计 —— 气象与火险数据落到真实地理坐标系，兼具信息密度与视觉秩序的监测大屏。',
        hero: 'shots/yunnan-fire-map/01-overview.png',
        overview: [
            '这是我的毕业设计：以云南省为对象，将气象与火险数据落到真实的地理坐标系上，构建一块兼具信息密度与视觉秩序的火险监测大屏，目标是「从被动救火转向主动防火」。',
            '它是「火防三部曲」的中间章：前期以「智火卫渝」在重庆完成了 KNN / LSTM / Attention-LSTM 的多源数据融合火险预测建模，本项目承接这套建模思路，把火险预测能力搬到云南省，专注解决「算出来的风险如何被一眼看懂」—— 基于 OpenLayers + 高德地图底图完成地图渲染，GeoJSON 承载火点数据，ECharts 驱动数据面板；支持历史 / 预测双模式切换，火点聚合渲染、四级风险着色、热力图、时空筛选与一整套地图工具链。再往后，它演化为 Agent 风格的焰哨系统。'
        ],
        role: '独立开发 · 地图渲染 / 数据可视化 / 大屏布局',
        period: '2026 · 毕业设计',
        status: '已完成 · Gitee ★ 3',
        archDesc: [
            '数据层：本地 GeoJSON 火点数据 + 高德在线底图 API + 气象数据；引擎层：OpenLayers 负责图层管理、火点聚合、热力图与四级风险着色渲染；应用层：Vue3 大屏组件通过时间 + 城市双重筛选驱动 ECharts 面板与火点详情抽屉，外接测量、画笔、图层管理、一键定位与地图导出工具。'
        ],
        stackGroups: [
            { group: '前端', items: ['Vue3', 'Vite'] },
            { group: '地图引擎', items: ['OpenLayers', '高德地图 API', 'GeoJSON'] },
            { group: '可视化', items: ['ECharts'] },
            { group: 'UI', items: ['Element Plus'] }
        ],
        features: [
            { title: '历史 / 预测双模式', desc: '历史火点等级与频次统计、预测等级占比与区域火险可视化一键切换。' },
            { title: '四级风险着色', desc: '火点按风险等级绿 / 黄 / 橙 / 红着色，区域态势一目了然。' },
            { title: '火点聚合 + 热力图', desc: '海量火点聚合渲染防卡顿，热力成像呈现时空密度。' },
            { title: '时空双重筛选', desc: '时间 + 城市维度联动筛选，火点详情抽屉展示日期 / 经纬度 / FRP / 风险评分。' },
            { title: '地图工具链', desc: '测量距离与面积、画笔标注、图层管理、一键定位云南、地图导出下载。' },
            { title: '双数据大屏', desc: '左右数据面板同步呈现统计图表，支持图表放大。' }
        ],
        effects: [
            { title: '17 项功能演示沉淀', desc: 'README 内 17 张 GIF / 截图完整记录功能效果。' },
            { title: '大屏级视觉秩序', desc: '天气 / 时间组件 + 双面板 + 地图主体，指挥中心级布局。' },
            { title: 'Gitee ★ 3', desc: '毕设项目获得社区关注。' },
            { title: '火防三部曲之中章', desc: '智火卫渝（ML 建模）→ 云南大屏（可视化）→ 焰哨（Agent 系统）。' }
        ],
        problems: [
            { problem: '海量火点直接渲染导致卡顿', solution: '火点聚合（Cluster）按缩放级别动态聚合' },
            { problem: '区域火险态势不直观', solution: '四级风险着色 + 预测区域火险可视化' },
            { problem: '火点信息分散、需逐个点击', solution: '时空筛选 + 详情抽屉聚合关键字段（FRP / 风险评分）' },
            { problem: '多图层叠加混乱', solution: '图层管理器统一开关与排序' }
        ],
        difficulties: [
            { title: 'OpenLayers 与高德底图融合', desc: '在线底图与本地 GeoJSON 的坐标系对齐、缩放层级匹配，是整个大屏的地基。' },
            { title: '动态分级渲染', desc: '火点数据按等级动态着色、按时间维度切换历史 / 预测模式，渲染状态机必须清晰。' },
            { title: '大屏自适应', desc: '指挥中心场景下多分辨率自适应布局，保证任何大屏上信息密度与秩序兼得。' }
        ],
        shots: [
            { src: 'shots/yunnan-fire-map/01-overview.png', caption: '大屏总体效果' },
            { src: 'shots/yunnan-fire-map/02-heatmap.png', caption: '火点热力成像' },
            { src: 'shots/yunnan-fire-map/03-filter.png', caption: '时间 / 城市筛选特定火点' },
            { src: 'shots/yunnan-fire-map/04-fire-detail.png', caption: '火点详情抽屉（经纬度 / FRP / 风险评分）' },
            { src: 'shots/yunnan-fire-map/05-layers.png', caption: '图层管理' },
            { src: 'shots/yunnan-fire-map/06-measure.png', caption: '测量距离工具' }
        ],
        metrics: [],
        links: [{ label: 'GITEE', type: 'gitee', url: 'https://gitee.com/wjl2004/Fire_hazard_Yunnan_system' }],
        docs: [{ file: 'readme.md', label: 'README · 大屏主文档' }]
    },
    {
        id: 'chongqing-fire',
        index: '04',
        featured: false,
        visual: 'v3',
        icon: 'map',
        name: '智火卫渝 · 火险智能预测',
        en: 'ML FIRE PREDICT',
        year: '毕设前期',
        tagline: '基于多源数据融合的重庆市火灾风险智能预测平台 —— 火防三部曲的起点',
        desc: 'KNN 状态空间重构 + Attention-LSTM + 气候态-AR 混合模型，三种算法分而治之的火险预测平台。',
        overview: [
            '「火防三部曲」的起点，也是我的本科毕业设计前期工作：重庆市地形以丘陵山地为主，极端高温干旱频发，传统单一统计模型难以同时应对火点数据的稀疏突发性与 NDVI 的强季节性 —— 于是我提出「分而治之」的建模框架：火点用 KNN 多输出回归 + 状态空间重构，NDVI 用气候态分解 + 线性自回归混合模型，气象要素用 Attention-LSTM。',
            '平台以 Flask 提供生产级 Web 应用（Gradio 作快速原型），集成多模型预测结果与火险预报指数（FE = TE + HE + NRE + WE − YRE）五分项综合评估，按绿 / 黄 / 橙 / 红 / 紫五级在区县地图上呈现火险分布；支持 CSV 数据上传、按站点检索、Folium 交互地图与 Plotly 统计图表。这套建模与评估体系随后被云南大屏继承，最终演化为焰哨系统。'
        ],
        role: '独立开发 · 建模 / 数据工程 / Web 平台',
        period: '毕业设计 · 前期',
        status: '已完成 · 演变起点',
        archDesc: [
            '四层数据管道：数据输入层汇聚火点栅格（卫星遥感，~1km / 月度）、NDVI 栅格（MODIS MOD13A3）、38 个气象站点日值与区县边界 Shapefile；预处理层完成栅格重采样、云雾插补、时空对齐与按站点分割；模型预测层三模型并行 —— 站点级 Attention-LSTM 预测气象趋势，栅格级 KNN 状态空间重构预测火点、气候态-AR 混合模型预测 NDVI；结果可视化层以 Matplotlib / Plotly / Folium / Flask 输出静态图、交互图表与 Web 平台。'
        ],
        stackGroups: [
            { group: '机器学习', items: ['KNN 多输出回归', '状态空间重构', 'Attention-LSTM', '气候态-AR 混合'] },
            { group: '深度学习', items: ['PyTorch', 'TensorFlow'] },
            { group: '地理信息', items: ['Rasterio', 'GeoPandas', 'Shapely', 'Folium', 'Shapefile'] },
            { group: 'Web 与可视化', items: ['Flask', 'Gradio', 'Plotly', 'Matplotlib', 'pandas'] }
        ],
        features: [
            { title: '分而治之建模', desc: '火点 / NDVI / 气象三类数据特性迥异，各自匹配最适模型而非一套模型硬套。' },
            { title: 'KNN 状态空间重构', desc: '月度火点栅格展平为高维向量，K=5 近邻推演未来状态，非负约束控制误差累积。' },
            { title: '气候态-AR 混合模型', desc: '剥离确定性季节背景（气候态基准）与随机性异常（AR 距平回归，滞后 t-1/t-2/t-12）。' },
            { title: 'FE 火险指数体系', desc: 'FE = TE + HE + NRE + WE − YRE 五分项合成，五级火险在区县地图五色呈现。' },
            { title: '双前端形态', desc: 'Flask 生产级多用户认证 + 后台线程异步处理；Gradio 原型快速演示模型交互。' },
            { title: '多源数据工程', desc: '栅格重采样 / 掩膜提取 / 时空对齐 / 按站点分割，2013-2021 九年数据治理。' }
        ],
        effects: [
            { title: '火点预测 R² 0.971', desc: '测试集 R² = 0.971（训练 0.982），稀疏火点背景下主要火点聚集区命中良好。' },
            { title: 'NDVI 预测 R² 0.801', desc: 'Climatology-AR 混合模型较纯气候态基准（0.787）提升 1.4%，代表对气候异常的预测能力。' },
            { title: '万州站趋势吻合', desc: 'Attention-LSTM 对 2021 年 10-12 月气温 / 湿度预测与实测整体趋势吻合。' },
            { title: '预测栅格可下载', desc: '火点 / NDVI 预测输出 GeoTIFF 栅格，MSE / MAE / R² 指标同屏展示。' }
        ],
        problems: [
            { problem: '火点数据高度稀疏（大部分栅格为 0）', solution: 'KNN 回归天然适配「预测无火背景 + 命中聚集区」，非负约束抑制误差累积' },
            { problem: 'NDVI 强季节性掩盖气候异常', solution: '气候态分解剥离季节背景，AR 只对距平分量建模' },
            { problem: '气象要素未来值不可知', solution: 'Attention-LSTM 先行预测气象趋势，为 FE 指数提供输入' },
            { problem: '多源数据时空分辨率不一', solution: '统一重采样到 ~1km / 月度栅格，站点数据按站分割独立建模' }
        ],
        difficulties: [
            { title: '状态空间重构设计', desc: '把 452×461 的月度火点栅格展平进历史状态空间，窗口长度与 K 值的取舍直接决定预测质量。' },
            { title: '栅格数据工程', desc: '投影转换、按重庆边界掩膜提取、重采样与置信度分级，九年月度栅格的批处理链路。' },
            { title: '三种模型的结果融合', desc: '站点级时序预测与栅格级空间预测口径不同，最终统一汇聚到 FE 指数与五级分档。' },
            { title: '从模型到平台', desc: '把建模脚本封装为可登录、可上传、可异步执行的 Flask Web 平台，而非一次性 notebook。' }
        ],
        metrics: [
            { label: '火点 R² · 测试', value: '0.971' },
            { label: '火点 R² · 训练', value: '0.982' },
            { label: 'NDVI R² · 测试', value: '0.801' },
            { label: 'FE 分项指数', value: '5 项' }
        ],
        links: [{ label: 'GITHUB', type: 'github', url: 'https://github.com/wjl-cong/Chongqing_fire' }],
        docs: [{ file: 'readme.md', label: 'README · 建模平台主文档' }]
    },
    {
        id: 'informer',
        index: '05',
        featured: false,
        visual: 'v5',
        icon: 'trend',
        name: 'Informer 时间序列复现',
        en: 'TIME-SERIES FORECAST',
        year: '2026',
        tagline: 'Informer2020 无阉割分步复现 —— 代码能跑，图能看，R² 能到 0.8',
        desc: '把官方 Jupyter 版拆解为分步 .py 工程，「看、学、踩坑、调参」全程留痕。',
        hero: 'shots/informer/01-series.png',
        overview: [
            '官方 Informer2020 只提供 Jupyter 版本，而我的习惯是 .py 分步实现、AI 辅助、B 站刷课 —— 于是我把「看、学、踩坑、调参」全部揉进这份 repo，官方模型无阉割。',
            '基于 ETTh1 电力变压器小时级数据完成长序列预测：seq_len=96、label_len=48、pred_len=24（可调 168 长期预测），batch_size=64、lr=1e-4、MSE 损失、type1 学习率调度；通过「6 轮 + 早停」与「30 轮不早停」的对照实验，量化验证了早停对过拟合的抑制作用。'
        ],
        role: '独立学习 · 代码复现 / 调参 / 文档',
        period: '2026.01',
        status: '已完成 · MIT · ★ 1',
        archDesc: [
            '训练管道：ETTh1 数据集 → DataLoader（seq 96 / label 48 / pred 24 滑窗切片）→ Informer 编码解码（ProbSparse Attention 稀疏注意力 + 生成式解码器）→ 训练循环（MSE 损失 / type1 学习率衰减 / 早停）→ 结果落盘（checkpoints 权重 + results 指标 CSV 与可视化 PNG）。'
        ],
        stackGroups: [
            { group: '语言', items: ['Python 3.6'] },
            { group: '深度学习', items: ['PyTorch 1.10.1', 'Informer2020', 'ProbSparse Attention'] },
            { group: '数据', items: ['ETTh1', 'pandas', 'numpy'] },
            { group: '可视化', items: ['matplotlib', 'seaborn'] }
        ],
        features: [
            { title: '.py 分步工程', desc: '数据、模型、训练、预测各自独立模块，告别 notebook，可复用可回归。' },
            { title: '对照实验', desc: '6 轮早停 vs 30 轮不早停，同口径对比验证早停价值。' },
            { title: '三类可视化', desc: '时间序列对比主图、预测结果详细对比图、误差分析图（直方图 / 置信区间 / 误差热图）。' },
            { title: '踩坑笔记', desc: '环境版本（torch 1.10.1+cu102 / numpy 1.19.5）、中文字体、训练技巧全程留痕，附 B 站教程索引。' }
        ],
        effects: [
            { title: 'R² 训练 0.80 / 测试 0.77', desc: '6 轮 + 早停配置下的最终拟合水平，CPU 全程可跑。' },
            { title: '过拟合实证', desc: '30 轮不早停：训练 0.81 / 测试 0.45 —— 用数据证明早停必要性。' },
            { title: '零阉割复现', desc: '官方模型结构完整保留，结果可复现、图可复现。' }
        ],
        problems: [
            { problem: 'Jupyter 版本不可复用、难回归', solution: '拆解为分步 .py 模块，参数集中在主脚本' },
            { problem: '训练轮数增加反而恶化测试表现', solution: '引入早停（patience）+ 双组对照实验定量验证' },
            { problem: '调参过程黑盒、经验无法沉淀', solution: 'checkpoints + results 双目录全程留痕，README 记录每个坑' }
        ],
        difficulties: [
            { title: 'ProbSparse 注意力工程化', desc: '官方实现的稀疏注意力在低版本 PyTorch 上的兼容与数值行为，是复现的第一个深坑。' },
            { title: '滑窗预测的口径对齐', desc: 'seq/label/pred 三段窗口与反归一化的对齐，直接决定对比图是否可信。' },
            { title: '可视化工程', desc: '中文字体注入、多子图布局、误差热图配色，让结果「图能看」。' }
        ],
        shots: [
            { src: 'shots/informer/01-series.png', caption: '时间序列对比 — 真实值 vs 预测值主图（README 原图）' },
            { src: 'shots/informer/02-detail-compare.png', caption: '预测结果详细对比 — 多方位对比视图（README 原图）' },
            { src: 'shots/informer/03-error-analysis.png', caption: '预测误差分析 — 直方图 / 置信区间 / 误差热图（README 原图）' }
        ],
        metrics: [
            { label: 'R² · 训练集（早停）', value: '0.80' },
            { label: 'R² · 测试集（早停）', value: '0.77' },
            { label: 'R² · 测试集（30 轮）', value: '0.45' },
            { label: '预测步长', value: '24h' }
        ],
        links: [{ label: 'GITHUB（含原始效果图）', type: 'github', url: 'https://github.com/wjl-cong/informer-' }],
        docs: [{ file: 'readme.md', label: 'README · 复现笔记' }]
    },
    {
        id: 'collaborative-filtering',
        index: '06',
        featured: false,
        visual: 'v6',
        icon: 'graph',
        name: '协同过滤推荐系统',
        en: 'RECOMMEND SYSTEM',
        year: '2026',
        tagline: 'UserCF / ItemCF 双算法完整实现 —— 并落地「臻享云牧」云养殖平台',
        desc: '相似度计算、Top-N 推荐、离线评估完整闭环，基于天池真实数据集，附 SCI 级可视化与工程化落地。',
        hero: 'shots/collaborative-filtering/08-user-simheat.png',
        overview: [
            '从零实现 UserCF 与 ItemCF 两类经典协同过滤推荐算法 —— 行为加权、评分矩阵、余弦相似度、KNN 邻居、Top-N 推荐、离线评估完整闭环。',
            '主数据集采用阿里云天池淘宝 UserBehavior 用户行为数据（用户ID / 商品ID / 行为类型 / 时间戳 / 售价），另备社交电商数据集支持不同规模对比；「SCI 级」可视化覆盖行为分布、类别热度、时段活跃、价格长尾与相似度热力图。',
            '算法不止于 notebook：「臻享云牧 · Cloud_Farming_Platform」把这套协同过滤推荐接入了一个面向畜禽云养殖场景的 B2C+B2B 双端 Web 平台 —— 未登录用户展示最新商品，登录后基于用户历史行为（浏览 / 收藏 / 加购 / 下单）个性化推荐心仪动物，完成从算法原型到在线产品的闭环。'
        ],
        role: '独立开发 · 算法实现 / 评估实验 / 平台落地',
        period: '2026.02',
        status: '已完成 · ★ 1',
        archDesc: [
            '算法管道：UserBehavior.csv → 行为加权（浏览 pv=1 / 收藏 fav=2 / 加购 cart=3 / 购买 buy=4）→ 用户-商品评分矩阵 → 余弦相似度（scikit-learn cosine_similarity）→ 分叉为 UserCF（找相似用户聚合其偏好）与 ItemCF（找相似商品外推）两条链路 → KNN 邻居筛选 → Top-N 推荐 → 离线评估（Precision / Recall / 覆盖率）与可视化落盘。',
            '工程落地管道（臻享云牧）：后端依据用户行为数据计算物品 / 用户相似度并返回推荐列表，前端推荐侧边栏按需展示；平台同时覆盖商家发布 / 管理员审核 / 用户认养的完整业务闭环，JWT + 动态路由做三角色权限隔离。'
        ],
        stackGroups: [
            { group: '语言', items: ['Python 3.8'] },
            { group: '算法', items: ['UserCF', 'ItemCF', '余弦相似度', 'KNN'] },
            { group: '数据', items: ['天池 UserBehavior', '社交电商数据集'] },
            { group: '工程与可视化', items: ['scikit-learn', 'pandas', 'seaborn', 'matplotlib'] },
            { group: '落地 · 臻享云牧', items: ['Vue2 + Vuex', 'Element UI', 'SpringBoot', 'MyBatis-Plus', 'Redis', 'JWT + RSA'] }
        ],
        features: [
            { title: '双算法对偶实现', desc: '01基于用户的协同过滤算法.py 与 02基于物品的协同过滤算法.py 独立成模块，可对比可切换。' },
            { title: '行为加权建模', desc: '浏览 / 收藏 / 加购 / 购买四级行为映射为 1-4 分，把隐式反馈变成可用评分。' },
            { title: 'SCI 级可视化', desc: '12 张图表：行为漏斗、类别 Top10、24 小时活跃（晚 20-22 点高峰）、活跃度幂律、价格长尾、相似度热力图。' },
            { title: '双算法流程图', desc: 'edraw 绘制 User-Based 与 Item-Based 完整流程图，算法思路一图看懂。' },
            { title: '工程落地 · 臻享云牧', desc: 'B2C+B2B 云养殖平台集成 CF 推荐：未登录看最新商品，登录后按历史行为个性化推荐；RSA 密码加密 + JWT 动态路由 + 三角色权限。' }
        ],
        effects: [
            { title: 'Precision · UserCF 0.96 / ItemCF 0.99', desc: '两条链路的离线精确率。' },
            { title: 'Recall · UserCF 0.49 / ItemCF 0.51', desc: '召回率水平相当，ItemCF 略优。' },
            { title: '覆盖率 1.0', desc: '推荐列表覆盖全部商品类目，无热门偏差塌缩。' },
            { title: '推荐结果落盘', desc: 'User_png / Item_png 目录内图表与推荐结果 CSV 双产出。' },
            { title: '从算法到产品', desc: '臻享云牧平台（Vue2 前端 + SpringBoot 后端）让推荐结果直接驱动在线商品列表。' }
        ],
        problems: [
            { problem: '用户行为无显式评分', solution: '行为加权映射（pv=1 / fav=2 / cart=3 / buy=4）构造隐式评分矩阵' },
            { problem: '单一算法难以解释推荐逻辑', solution: 'UserCF / ItemCF 双视角对偶实现 + 相似度热力图可视化佐证' },
            { problem: '数据规模受限', solution: '备选 30+ 标签 / 10 万条扩展数据集，支持规模对比实验' }
        ],
        difficulties: [
            { title: '稀疏共现矩阵', desc: '真实行为数据极度稀疏，共现矩阵必须稀疏化处理，KNN 邻居筛选才能高效执行。' },
            { title: '相似度质量验证', desc: '用相似度热力图直观验证矩阵质量，避免「算得出但不对劲」。' },
            { title: '评估口径设计', desc: 'Precision / Recall / 覆盖率的计算口径与切分方式，决定两组实验是否可比。' }
        ],
        shots: [
            { src: 'shots/collaborative-filtering/01-user-flow.png', caption: 'User-Based CF 算法流程图（edraw 原图）' },
            { src: 'shots/collaborative-filtering/02-item-flow.png', caption: 'Item-Based CF 算法流程图（edraw 原图）' },
            { src: 'shots/collaborative-filtering/03-user-behavior.png', caption: '用户行为类型分布 — 浏览 / 收藏 / 加购 / 购买漏斗（UserCF 产出）' },
            { src: 'shots/collaborative-filtering/04-user-category.png', caption: '商品类别热度 Top10 — 「带货王」榜单（UserCF 产出）' },
            { src: 'shots/collaborative-filtering/05-user-hourly.png', caption: '24 小时活跃度 — 晚 20-22 点高峰（UserCF 产出）' },
            { src: 'shots/collaborative-filtering/06-user-activity.png', caption: '用户活跃度幂律分布 — 二八定律实证（UserCF 产出）' },
            { src: 'shots/collaborative-filtering/07-user-price.png', caption: '商品价格长尾分布 Top 99%（UserCF 产出）' },
            { src: 'shots/collaborative-filtering/08-user-simheat.png', caption: '用户相似度热力图 — 兴趣重合度一图看清（UserCF 产出）' },
            { src: 'shots/collaborative-filtering/09-item-behavior.png', caption: '用户行为类型分布（ItemCF 视角）' },
            { src: 'shots/collaborative-filtering/10-item-category.png', caption: '商品类别热度 Top10（ItemCF 视角）' },
            { src: 'shots/collaborative-filtering/11-item-hourly.png', caption: '24 小时活跃度分布（ItemCF 视角）' },
            { src: 'shots/collaborative-filtering/12-item-activity.png', caption: '用户活跃度长尾分布（ItemCF 视角）' },
            { src: 'shots/collaborative-filtering/13-item-price.png', caption: '商品价格分布（ItemCF 视角）' },
            { src: 'shots/collaborative-filtering/14-item-simheat.png', caption: '物品相似度热力图 — 「手机与手机壳」式强关联（ItemCF 产出）' }
        ],
        metrics: [
            { label: 'Precision · UserCF', value: '0.96' },
            { label: 'Precision · ItemCF', value: '0.99' },
            { label: 'Recall · ItemCF', value: '0.51' },
            { label: '覆盖率', value: '1.0' }
        ],
        links: [
            { label: 'GITHUB · 算法', type: 'github', url: 'https://github.com/wjl-cong/Collaborative_-Filtering' },
            { label: 'GITHUB · 臻享云牧', type: 'github', url: 'https://github.com/wjl-cong/Cloud_Farming_Platform' }
        ],
        docs: [
            { file: 'readme.md', label: 'README · 协同过滤算法' },
            { file: 'cloud-farming.md', label: '臻享云牧 · Cloud_Farming_Platform' },
            { file: 'dataset-social.md', label: '数据集说明 · 社交电商' }
        ]
    },
    {
        id: 'mall-miniprogram',
        index: '07',
        featured: false,
        visual: 'v4',
        icon: 'bag',
        name: '积分商城 & 严选小程序',
        en: 'THE ORIGIN',
        year: '起点',
        tagline: '工程化起点：Vue2 积分商城（5 天交付）与微信小程序严选商城',
        desc: 'jifen36 与 yanxuan —— 从页面搭建到状态管理，完成电商核心链路的完整前端训练。',
        hero: 'shots/mall-miniprogram/01-frame.png',
        overview: [
            '我的前端工程化起点：jifen36 是第一个 Vue2 项目 —— 一个完整的 PC 端积分商城，5 天完成；yanxuan 是第一个微信小程序 —— 严选商城，原生开发 + Vant Weapp。',
            'jifen36 覆盖验证码 / 密码 / 微信扫码三种登录、首页、全部商品、购物车、个人中心与 404 页；yanxuan 覆盖首页、购物车、个人、登录、搜索五页。两个项目沉淀了 axios 拦截器、api 统一管理、路由守卫、token 存储、wx.request Promise 化等一整套可迁移的工程习惯。'
        ],
        role: '独立开发 · 页面 / 交互 / 状态管理',
        period: '早期',
        status: '已完成',
        archDesc: [
            'jifen36（Vue2 SPA）：路由守卫拦截未登录访问 → axios 拦截器统一注入 token 与错误处理 → api 目录统一管理接口 → localStorage 持久化登录态 → 滑块 / 拼图验证码组件保护登录链路。',
            'yanxuan（原生小程序）：wx.request 封装为 Promise + async/await → api.js 统一管理接口 → custom-tab-bar 自定义底部栏 → globalData 承接登录返回 → storage 持久化 token → wxs 过滤价格格式。'
        ],
        stackGroups: [
            { group: 'jifen36 · Vue2', items: ['vue-cli', 'axios 拦截器', '路由守卫', 'vue-puzzle-vcode', '滑动验证', 'rest-css'] },
            { group: 'yanxuan · 小程序', items: ['原生开发', 'Vant Weapp', 'Promise 封装', 'custom-tab-bar', 'globalData', 'wxs'] }
        ],
        features: [
            { title: '三合一登录体系', desc: '图形验证码 + 密码 + 微信扫码登录，滑块与拼图验证码双组件防护。' },
            { title: '完整电商链路', desc: '首页 → 全部商品（滚动加载更多）→ 购物车 → 个人中心 → 404 兜底页。' },
            { title: '组件封装意识', desc: '提示组件、验证组件独立封装，axios/api 层统一收口。' },
            { title: '小程序工程化', desc: 'Promise 化请求、async/await、自定义 TabBar、globalData 登录态、wxs 价格过滤。' }
        ],
        effects: [
            { title: '5 天完成 Vue2 全链路商城', desc: '从脚手架到六大页面 + 登录体系一次性交付。' },
            { title: '11 张商城演示图 + 5 张小程序演示图', desc: 'README 全量留档。' },
            { title: '可迁移工程习惯', desc: '拦截器 / 守卫 / api 管理三件套沿用至今。' }
        ],
        problems: [
            { problem: '登录态在多页面间散落管理', solution: 'localStorage / storage 集中存储 + 路由守卫与 globalData 统一校验' },
            { problem: '请求错误处理重复书写', solution: 'axios 拦截器统一注入 token、统一错误提示' },
            { problem: '后端 API 后续失效', solution: 'api.js 统一管理层将接口隔离，替换成本低' }
        ],
        difficulties: [
            { title: '滑块 / 拼图验证码集成', desc: 'vue-puzzle-vcode 与滑动验证两个组件在登录链路中的状态协调与回退处理。' },
            { title: '小程序异步范式升级', desc: '把回调式 wx.request 封装为 Promise，用 async/await 重写整条数据链。' },
            { title: '小程序登录态全局流转', desc: '登录页返回值经 globalData 广播到各页，storage 保活，TabBar 状态同步。' }
        ],
        shots: [
            { src: 'shots/mall-miniprogram/01-frame.png', caption: 'jifen36 · 基本框架' },
            { src: 'shots/mall-miniprogram/02-login.png', caption: 'jifen36 · 验证码登录' },
            { src: 'shots/mall-miniprogram/03-products.png', caption: 'jifen36 · 全部商品' },
            { src: 'shots/mall-miniprogram/04-profile.png', caption: 'jifen36 · 个人中心' },
            { src: 'shots/mall-miniprogram/05-yanxuan-home.png', caption: 'yanxuan · 首页' },
            { src: 'shots/mall-miniprogram/06-yanxuan-cart.png', caption: 'yanxuan · 购物车' },
            { src: 'shots/mall-miniprogram/07-yanxuan-login.png', caption: 'yanxuan · 登录页' },
            { src: 'shots/mall-miniprogram/08-yanxuan-search.png', caption: 'yanxuan · 搜索页' }
        ],
        metrics: [],
        links: [
            { label: '积分商城 · GITEE', type: 'gitee', url: 'https://gitee.com/wjl2004/jifen36' },
            { label: '严选小程序 · GITEE', type: 'gitee', url: 'https://gitee.com/wjl2004/yanxuan' }
        ],
        docs: [
            { file: 'jifen36.md', label: '积分商城 jifen36 · README' },
            { file: 'yanxuan.md', label: '严选小程序 yanxuan · README' }
        ]
    }
]

/** 成长轨迹数据（按时间升序校对：毕业设计前期 → 算法复现 → 毕设大屏 → Agent → 安全） */
export const timeline = [{
        date: '起点 · ORIGIN',
        title: '前端筑基',
        desc: 'Vue2 积分商城 jifen36（5 天完整交付）与微信小程序严选商城 yanxuan —— 验证码 / 密码 / 微信扫码三合一登录、购物车与商品全链路，沉淀 axios 拦截器、路由守卫、api 统一管理、wx.request Promise 化等可迁移工程习惯，建立工程化思维。'
    },
    {
        date: '2023 · FULL-STACK',
        title: '打通全栈 & 初触 AI 应用',
        desc: '以 Vue3 为核心完成全栈应用开发，并第一次把大模型能力接入自己的产品（New Bing 演示站点与 ChatGPT 提示词支持），从「写页面」转向「做产品」，开始关注 LLM 的产品化落地方式。'
    },
    {
        date: '毕业前期 · ML',
        title: '智火卫渝 · 火险智能预测',
        desc: '火防三部曲的起点（毕业设计前期）：多源数据融合的重庆市火灾风险预测平台 —— 火点 KNN 状态空间重构（测试 R² 0.971）+ 气象 Attention-LSTM + NDVI 气候态-AR 混合模型（R² 0.801），FE 五分项火险指数五级分档，Flask 生产级 Web + Gradio 原型双前端，九年栅格数据治理。'
    },
    {
        date: '2026.01 · TIME-SERIES',
        title: 'Informer2020 分步复现',
        desc: '把官方 Jupyter 版拆解为分步 .py 工程，ProbSparse Attention 无阉割复现：seq96 / label48 / pred24 滑窗预测，通过「6 轮早停 vs 30 轮不早停」对照实验定量验证早停价值（测试 R² 0.77 vs 0.45），环境踩坑与调参笔记全程留痕。'
    },
    {
        date: '2026.02 · RECOMMEND',
        title: '协同过滤 & 臻享云牧落地',
        desc: 'UserCF / ItemCF 双算法从零实现（行为加权 → 余弦相似度 → KNN 邻居 → Top-N → 离线评估），Precision 0.96 / 0.99、覆盖率 1.0，12 张 SCI 级可视化；算法不止于 notebook —— 落地「臻享云牧」云养殖平台（Vue2 + SpringBoot + Redis + JWT），登录后按历史行为个性化推荐心仪动物。'
    },
    {
        date: '2026 · DATAVIZ',
        title: '毕业设计：云南省火险可视化大屏',
        desc: '火防三部曲的中章：把智火卫渝的建模思路搬到云南，专注「算出来的风险如何被一眼看懂」—— OpenLayers + 高德底图 + GeoJSON + ECharts，火点聚合 / 四级风险着色 / 热力成像 / 时空筛选 / 测量标注导出工具链，17 项功能演示沉淀，收获 Gitee 3 Stars。'
    },
    {
        date: '2026.09 · AI AGENT',
        title: '焰哨系统 · Fire Agent',
        desc: '三部曲的终点站：在毕设大屏基础上重构为 Agent 风格系统 —— Vue3 前端八大模块（2D/3D 数字孪生 + 明暗双主题 + 语音交互）+ FastAPI 后端 LangGraph 8 节点编排，SSE 节点级进度、PostgresSaver 断点恢复、HITL 人工审批、RAG 知识库与报告中心，迭代至 v1.0.1。'
    },
    {
        date: '2026.10 · SECURITY',
        title: 'Agent-Gauntlet · 红队测试',
        desc: '为自己的 Agent 系统打造红队评测平台：5 类攻击（角色扮演 / 指令覆盖 / 目标劫持 / 蜜罐 / 工具返回夹带）+ 混沌故障注入 + 四级防御判定（defense_score 量化），与焰哨 env 门控 chaos 联动，形成「攻击 — 防御 — 修复」安全闭环。'
    }
]