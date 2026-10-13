<script setup>
/**
 * 项目架构图组件 — 按项目 id 渲染手绘 SVG 架构图
 * 数据结构：nodes[{x,y,w,h,l1,l2?,accent?,dashed?,ghost?}] + edges[{points,el?,dashed?}]
 * marker id 携带项目前缀，避免多实例冲突；移动端容器横向滚动
 */
import { computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true }
})

const DIAGRAMS = {
  /* ─── 01 焰哨系统：三层 + LangGraph 8 节点 ─── */
  'fire-agent': {
    w: 960,
    h: 520,
    nodes: [
      { x: 100, y: 30, w: 760, h: 56, l1: '前端交互层 · Vue3（八大模块）', l2: '作战大屏 · 智能查询 · Agent 协作中心 · 报告中心 · 知识库 · 系统管理' },
      { x: 380, y: 134, w: 200, h: 50, l1: 'FastAPI 服务层', accent: true },
      { x: 40, y: 232, w: 110, h: 54, l1: 'parse_task', l2: '任务拆解' },
      { x: 210, y: 170, w: 120, h: 54, l1: 'query_data', l2: '双源检索', accent: true },
      { x: 210, y: 296, w: 120, h: 54, l1: 'analyze_gis', l2: 'GIS 分析', accent: true },
      { x: 390, y: 232, w: 80, h: 54, l1: 'join', l2: '汇聚' },
      { x: 510, y: 232, w: 130, h: 54, l1: 'generate_report', l2: '报告生成' },
      { x: 680, y: 232, w: 120, h: 54, l1: 'review_report', l2: '评审' },
      { x: 838, y: 232, w: 112, h: 54, l1: 'approval_gate', l2: 'HITL 门', accent: true },
      { x: 838, y: 350, w: 112, h: 48, l1: '人工审批', l2: 'approve / reject', dashed: true },
      { x: 40, y: 410, l1: 'SUPPORT · 支撑层', ghost: true },
      { x: 40, y: 430, w: 280, h: 56, l1: 'PostgresSaver Checkpoint', l2: '状态持久化 · 中断恢复' },
      { x: 360, y: 430, w: 280, h: 56, l1: 'DataAgent 双源查询', l2: '历史火点 + 预测火险 · 空结果反思' },
      { x: 680, y: 430, w: 280, h: 56, l1: 'Chaos Hook（env 门控）', l2: '红队故障注入 · 生产零感知', dashed: true }
    ],
    edges: [
      { points: [[480, 86], [480, 134]], el: 'REST + SSE' },
      { points: [[430, 184], [95, 232]] },
      { points: [[150, 250], [210, 197]] },
      { points: [[150, 268], [210, 323]] },
      { points: [[330, 197], [390, 250]] },
      { points: [[330, 323], [390, 268]] },
      { points: [[470, 259], [510, 259]] },
      { points: [[640, 259], [680, 259]] },
      { points: [[740, 232], [740, 150], [575, 150], [575, 232]], el: '评审循环', dashed: true },
      { points: [[800, 259], [838, 259]] },
      { points: [[894, 286], [894, 350]], el: '挂起 / 恢复', dashed: true }
    ]
  },
  /* ─── 02 Agent-Gauntlet：攻击流水线 + 双轮判定 ─── */
  'agent-gauntlet': {
    w: 960,
    h: 340,
    nodes: [
      { x: 40, y: 70, w: 210, h: 64, l1: 'CLI · gauntlet run', l2: '--suite --faults --honeypot' },
      { x: 300, y: 70, w: 180, h: 64, l1: 'YAML Payloads', l2: 'id · canary · allowlist' },
      { x: 300, y: 190, w: 180, h: 56, l1: 'Honeypot 蜜罐', l2: 'canary 文档 · purge 清理', dashed: true },
      { x: 530, y: 70, w: 170, h: 64, l1: 'Injector 注入器', l2: '直接 / 间接 / 工具夹带' },
      { x: 750, y: 70, w: 170, h: 64, l1: '被测 Agent · 焰哨', accent: true },
      { x: 40, y: 240, w: 210, h: 64, l1: 'Faults 功能轮', l2: '混沌故障 · recovery_rate' },
      { x: 530, y: 240, w: 170, h: 64, l1: 'Detector 判定器', l2: '四级短路判定' },
      { x: 750, y: 240, w: 170, h: 64, l1: 'defense_score', l2: '1−(COMP+LEAK)/N', accent: true }
    ],
    edges: [
      { points: [[250, 102], [300, 102]] },
      { points: [[480, 102], [530, 102]] },
      { points: [[700, 102], [750, 102]], el: '注入' },
      { points: [[835, 134], [835, 190], [615, 190], [615, 240]], el: 'Agent 响应' },
      { points: [[700, 272], [750, 272]] },
      { points: [[145, 134], [145, 240]], el: '功能轮' },
      { points: [[250, 272], [530, 272]], el: '恢复判定' },
      { points: [[480, 218], [760, 218], [760, 134]], el: '检索触发', dashed: true }
    ]
  },
  /* ─── 03 云南省火险可视化大屏：数据层 → 引擎层 → 应用层 ─── */
  'yunnan-fire-map': {
    w: 960,
    h: 330,
    nodes: [
      { x: 40, y: 50, w: 180, h: 56, l1: 'GeoJSON 火点', l2: '历史 + 预测' },
      { x: 40, y: 132, w: 180, h: 56, l1: '高德地图底图', l2: '在线瓦片' },
      { x: 40, y: 214, w: 180, h: 56, l1: '气象数据', l2: '火险要素' },
      { x: 330, y: 110, w: 210, h: 80, l1: 'OpenLayers 引擎', l2: '聚合 · 热力 · 四级着色', accent: true },
      { x: 620, y: 60, w: 300, h: 56, l1: '地图工具链', l2: '测量 · 画笔 · 图层管理 · 一键定位 · 导出' },
      { x: 620, y: 160, w: 300, h: 56, l1: 'Vue3 大屏组件', l2: '历史/预测双模式 · 时空筛选 · 详情抽屉' },
      { x: 620, y: 260, w: 300, h: 56, l1: 'ECharts 数据面板', l2: '左右双面板 · 图表放大' }
    ],
    edges: [
      { points: [[220, 78], [330, 130]] },
      { points: [[220, 160], [330, 150]] },
      { points: [[220, 242], [330, 170]] },
      { points: [[540, 130], [620, 88]] },
      { points: [[540, 150], [620, 188]] },
      { points: [[540, 170], [620, 288]] }
    ]
  },
  /* ─── 04 智火卫渝：四层多源数据融合管道 ─── */
  'chongqing-fire': {
    w: 960,
    h: 420,
    nodes: [
      { x: 40, y: 40, w: 180, h: 56, l1: '火点栅格', l2: '卫星遥感 · 月度 2013-2021' },
      { x: 240, y: 40, w: 180, h: 56, l1: 'NDVI 栅格', l2: 'MODIS MOD13A3' },
      { x: 440, y: 40, w: 180, h: 56, l1: '气象站点', l2: '38 站 · 日值' },
      { x: 640, y: 40, w: 180, h: 56, l1: '区县边界', l2: 'Shapefile 矢量' },
      { x: 40, y: 140, w: 780, h: 50, l1: '数据预处理层', l2: '栅格重采样 · 云雾插补 · 时空对齐 · 按站点分割 · 8:1:1 划分' },
      { x: 40, y: 230, w: 250, h: 64, l1: 'Attention-LSTM', l2: '气象时序预测 · 站点级', accent: true },
      { x: 330, y: 230, w: 250, h: 64, l1: '火点 KNN', l2: '状态空间重构 · K=5', accent: true },
      { x: 620, y: 230, w: 200, h: 64, l1: '气候态-AR 混合', l2: 'NDVI 距平回归', accent: true },
      { x: 330, y: 336, w: 250, h: 52, l1: 'FE 火险指数', l2: 'TE+HE+NRE+WE−YRE · 五级分档' },
      { x: 620, y: 336, w: 300, h: 52, l1: 'Flask 平台 · Gradio 原型', l2: '五级火险地图 · 预测栅格下载' }
    ],
    edges: [
      { points: [[130, 96], [130, 140]] },
      { points: [[330, 96], [330, 140]] },
      { points: [[530, 96], [530, 140]] },
      { points: [[730, 96], [730, 140]] },
      { points: [[165, 190], [165, 230]] },
      { points: [[455, 190], [455, 230]] },
      { points: [[720, 190], [720, 230]] },
      { points: [[165, 294], [165, 362], [330, 362]], el: '气象要素输入' },
      { points: [[455, 294], [455, 336]], el: '火点预测' },
      { points: [[720, 294], [720, 362], [580, 362]], el: '植被态势' },
      { points: [[580, 362], [620, 362]], el: '五级评估' }
    ]
  },
  /* ─── 05 Informer：训练管道 ─── */
  informer: {
    w: 960,
    h: 240,
    nodes: [
      { x: 40, y: 90, w: 150, h: 64, l1: 'ETTh1 数据集', l2: '变压器小时级' },
      { x: 240, y: 90, w: 180, h: 64, l1: 'DataLoader 滑窗', l2: 'seq96 · label48 · pred24' },
      { x: 470, y: 90, w: 200, h: 64, l1: 'Informer 模型', l2: 'ProbSparse Attention', accent: true },
      { x: 720, y: 90, w: 110, h: 64, l1: '训练', l2: 'MSE · 早停' },
      { x: 870, y: 90, w: 80, h: 64, l1: '落盘', l2: 'ckpt+png' }
    ],
    edges: [
      { points: [[190, 122], [240, 122]] },
      { points: [[420, 122], [470, 122]] },
      { points: [[670, 122], [720, 122]] },
      { points: [[830, 122], [870, 122]] },
      { points: [[775, 90], [775, 50], [570, 50], [570, 90]], el: '早停 / lr 调度', dashed: true }
    ]
  },
  /* ─── 05 协同过滤：算法管道分叉 ─── */
  'collaborative-filtering': {
    w: 960,
    h: 350,
    nodes: [
      { x: 40, y: 60, w: 180, h: 60, l1: 'UserBehavior.csv', l2: '用户行为数据' },
      { x: 280, y: 60, w: 200, h: 60, l1: '行为加权', l2: 'pv1 · fav2 · cart3 · buy4' },
      { x: 540, y: 60, w: 200, h: 60, l1: '用户-商品评分矩阵', l2: '隐式反馈构造' },
      { x: 800, y: 60, w: 120, h: 60, l1: '余弦相似度', l2: 'cosine', accent: true },
      { x: 620, y: 220, w: 160, h: 60, l1: 'UserCF', l2: '找相似用户', accent: true },
      { x: 810, y: 220, w: 140, h: 60, l1: 'ItemCF', l2: '找相似商品', accent: true },
      { x: 360, y: 220, w: 180, h: 60, l1: 'KNN 邻居筛选', l2: 'Top-N 推荐' },
      { x: 80, y: 220, w: 220, h: 60, l1: '离线评估 + 可视化', l2: 'Precision · Recall · 覆盖率' }
    ],
    edges: [
      { points: [[220, 90], [280, 90]] },
      { points: [[480, 90], [540, 90]] },
      { points: [[740, 90], [800, 90]] },
      { points: [[860, 120], [700, 220]], el: '用户维度' },
      { points: [[860, 120], [880, 220]], el: '物品维度' },
      { points: [[620, 250], [540, 250]] },
      { points: [[880, 280], [880, 318], [450, 318], [450, 280]] },
      { points: [[360, 250], [300, 250]] }
    ]
  },
  /* ─── 06 积分商城 & 严选小程序：双工程并列 ─── */
  'mall-miniprogram': {
    w: 960,
    h: 420,
    nodes: [
      { x: 80, y: 40, l1: 'JIFEN36 · VUE2 积分商城', ghost: true },
      { x: 80, y: 60, w: 240, h: 56, l1: '验证码 / 密码 / 扫码登录', l2: '滑块 · 拼图双验证' },
      { x: 80, y: 152, w: 240, h: 56, l1: '路由守卫 · localStorage', l2: '登录态集中校验' },
      { x: 80, y: 244, w: 240, h: 56, l1: 'axios 拦截器 · api 目录', l2: 'token 注入 · 错误处理' },
      { x: 80, y: 336, w: 240, h: 56, l1: '六大页面', l2: '首页 · 商品 · 购物车 · 个人 · 404' },
      { x: 560, y: 40, l1: 'YANXUAN · 微信小程序', ghost: true },
      { x: 560, y: 60, w: 240, h: 56, l1: 'wx.login 登录', l2: 'globalData 广播' },
      { x: 560, y: 152, w: 240, h: 56, l1: 'storage 持久化', l2: 'token 保活' },
      { x: 560, y: 244, w: 240, h: 56, l1: 'wx.request Promise 化', l2: 'async/await 数据链' },
      { x: 560, y: 336, w: 240, h: 56, l1: '五大页面 + TabBar', l2: '首页 · 购物车 · 个人 · 登录 · 搜索' }
    ],
    edges: [
      { points: [[200, 116], [200, 152]] },
      { points: [[200, 208], [200, 244]] },
      { points: [[200, 300], [200, 336]] },
      { points: [[680, 116], [680, 152]] },
      { points: [[680, 208], [680, 244]] },
      { points: [[680, 300], [680, 336]] }
    ]
  }
}

const d = computed(() => DIAGRAMS[props.id] || null)

/* 折线 → SVG path */
function edgeD(e) {
  return 'M ' + e.points.map((pt) => pt.join(' ')).join(' L ')
}

/* 折线标签锚点：取中间段中点 */
function edgeMid(e) {
  const p = e.points
  const i = Math.floor((p.length - 1) / 2)
  if (p.length % 2 === 0) return [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2]
  return p[i]
}
</script>

<template>
  <div v-if="d" class="arch-box">
    <div class="arch-scroll">
      <svg class="arch" :viewBox="`0 0 ${d.w} ${d.h}`" role="img" :aria-label="`${id} 架构图`">
        <defs>
          <marker
            :id="`arr-${id}`"
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(158,203,255,0.8)"></path>
          </marker>
        </defs>

        <!-- 连线 -->
        <g v-for="(e, i) in d.edges" :key="'e' + i">
          <path :d="edgeD(e)" :class="['edge', { dashed: e.dashed }]" :marker-end="`url(#arr-${id})`"></path>
          <text
            v-if="e.el"
            :x="edgeMid(e)[0]"
            :y="edgeMid(e)[1] - 6"
            class="edge-label"
            text-anchor="middle"
          >{{ e.el }}</text>
        </g>

        <!-- 节点 -->
        <g v-for="(n, i) in d.nodes" :key="'n' + i">
          <template v-if="!n.ghost">
            <rect
              :x="n.x"
              :y="n.y"
              :width="n.w"
              :height="n.h"
              rx="8"
              :class="['node', { accent: n.accent, dashed: n.dashed }]"
            ></rect>
            <text
              :x="n.x + n.w / 2"
              :y="n.y + n.h / 2 + (n.l2 ? -5 : 4.5)"
              class="n-l1"
              text-anchor="middle"
            >{{ n.l1 }}</text>
            <text v-if="n.l2" :x="n.x + n.w / 2" :y="n.y + n.h / 2 + 13" class="n-l2" text-anchor="middle">{{ n.l2 }}</text>
          </template>
          <text v-else :x="n.x" :y="n.y" class="ghost-l">{{ n.l1 }}</text>
        </g>
      </svg>
    </div>
    <div class="arch-hint mono">ARCHITECTURE DIAGRAM · 可横向滚动查看</div>
  </div>
</template>

<style scoped>
.arch-box {
  margin-top: 40px;
}

.arch-scroll {
  border: 1px solid var(--line);
  background: var(--glass);
  overflow-x: auto;
}

.arch {
  display: block;
  width: 100%;
  min-width: 780px;
  height: auto;
}

.arch-hint {
  margin-top: 12px;
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ink-faint);
}

/* 连线 */
.edge {
  fill: none;
  stroke: var(--arch-edge);
  stroke-width: 1.2;
}

.edge.dashed {
  stroke-dasharray: 5 5;
}

.edge-label {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--accent);
  paint-order: stroke;
  stroke: var(--bg);
  stroke-width: 5px;
}

/* 节点 */
.node {
  fill: var(--arch-node-fill);
  stroke: var(--arch-node-stroke);
  stroke-width: 1;
  transition: stroke 0.3s;
}

.node:hover {
  stroke: var(--accent);
}

.node.accent {
  fill: var(--arch-node-fill-strong);
  stroke: var(--arch-node-stroke-strong);
}

.node.dashed {
  stroke-dasharray: 4 4;
}

.n-l1 {
  font-size: 12px;
  font-weight: 600;
  fill: var(--ink);
}

.n-l2 {
  font-size: 10px;
  fill: var(--ink-dim);
}

.ghost-l {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  fill: var(--ink-faint);
}
</style>
