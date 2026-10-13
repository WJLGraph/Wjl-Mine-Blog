<script setup></script>

<template>
  <main class="nf">
    <div class="nf-code">404</div>
    <p class="nf-text">页面走丢了 —— 这里没有你要找的内容。</p>
    <router-link to="/" class="btn-ghost">返回首页 →</router-link>
  </main>
</template>

<style scoped>
.nf {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  text-align: center;
  padding: 0 6vw;
}

.nf-code {
  font-family: var(--font-display);
  font-size: clamp(5rem, 18vw, 12rem);
  font-weight: 700;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(242, 242, 240, 0.5);
}

.nf-text {
  font-weight: 300;
  letter-spacing: 3px;
  color: var(--ink-dim);
}
</style>
