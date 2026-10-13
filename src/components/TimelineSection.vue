<script setup>
import { timeline } from '../data/projects'
</script>

<template>
  <section id="timeline">
    <div class="sec-label">03 — 成长轨迹 / TIMELINE</div>
    <div class="sec-title"><span class="en">EVOLUTION</span>从页面到智能体。</div>

    <div class="timeline">
      <div v-for="t in timeline" :key="t.date" class="t-item reveal">
        <div class="t-date">{{ t.date }}</div>
        <div class="t-title">{{ t.title }}</div>
        <p class="t-desc">{{ t.desc }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  position: relative;
  max-width: 880px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(var(--accent), var(--line) 60%, transparent);
}

.t-item {
  position: relative;
  padding: 0 0 58px 52px;
}

.t-item:last-child {
  padding-bottom: 0;
}

.t-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid rgba(158, 203, 255, 0.6);
  background: var(--bg);
  transition: background 0.3s, box-shadow 0.3s;
}

.t-item:hover::before {
  background: var(--accent);
  box-shadow: 0 0 16px rgba(158, 203, 255, 0.8);
}

.t-date {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--accent);
  margin-bottom: 10px;
}

.t-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.t-desc {
  font-size: 0.92rem;
  font-weight: 300;
  line-height: 1.85;
  color: var(--ink-dim);
  max-width: 620px;
}
</style>
