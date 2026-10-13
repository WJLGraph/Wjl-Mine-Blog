<script setup>
// 分隔符直接编入序列，单一 v-for 保证文字与 ✦ 交错
// 标签与 7 个精选项目的真实技术栈对齐：焰哨 / Gauntlet / 云南大屏 / 智火卫渝 / Informer / 协同过滤+臻享云牧 / 小程序
const items = [
  'PYTHON',
  '✦',
  'VUE',
  '✦',
  'LLM · AGENT',
  '✦',
  'LANGGRAPH',
  '✦',
  'MULTI-AGENT',
  '✦',
  'RAG',
  '✦',
  'FASTAPI',
  '✦',
  'OPENLAYERS',
  '✦',
  'GIS',
  '✦',
  'DATA-VIZ',
  '✦',
  'KNN',
  '✦',
  'LSTM',
  '✦',
  'TIME-SERIES',
  '✦',
  'RECOMMEND SYSTEM',
  '✦',
  'FLASK',
  '✦',
  'GRADIO',
  '✦',
  'MINI-PROGRAM',
  '✦',
  'PROMPT ENGINEERING',
  '✦',
  'GSAP',
  '✦'
]
</script>

<template>
  <div class="marquee">
    <div class="marquee-track">
      <template v-for="n in 2" :key="n">
        <span v-for="(t, i) in items" :key="`${n}-${i}`" :class="{ star: t === '✦' }">{{ t }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  padding: 22px 0;
  white-space: nowrap;
  background: var(--bg-2);
}

.marquee-track {
  display: inline-flex;
  gap: 56px;
  animation: marquee 44s linear infinite;
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 5px;
  color: var(--ink-faint);
  align-items: center;
}

.marquee-track .star {
  color: var(--accent);
  font-size: 10px;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
