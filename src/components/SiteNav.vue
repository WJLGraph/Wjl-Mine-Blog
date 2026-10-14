<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { scrollToSection } from '../composables/useSmoothScroll'

const router = useRouter()
const { theme, toggle } = useTheme()

/* 平滑滚动到首页锚点区块；若当前不在首页则先跳回首页 */
function goSection(id) {
  if (router.currentRoute.value.name !== 'home') {
    router.push('/')
    setTimeout(() => scrollToSection(id), 450)
  } else {
    scrollToSection(id)
  }
}
</script>

<template>
  <nav>
    <router-link to="/" class="logo">WJLGraph<span class="logo-sub">©26</span></router-link>
    <div class="links">
      <button @click="goSection('about')">关于</button>
      <button @click="goSection('codelab')">代码</button>
      <button @click="goSection('projects')">项目</button>
      <button @click="goSection('timeline')">轨迹</button>
      <button @click="goSection('contact')">联系</button>
      <button class="theme-btn" @click="toggle">{{ theme === 'dark' ? '◐ LIGHT' : '◑ DARK' }}</button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 26px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 900;
  mix-blend-mode: difference;
}

.logo {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 3px;
}

.logo-sub {
  opacity: 0.4;
}

.links {
  display: flex;
  gap: 34px;
}

.links button {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2.5px;
  color: var(--ink-dim);
  position: relative;
  transition: color 0.3s;
  padding: 0;
}

.links button::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
}

.links button:hover {
  color: #fff;
}

.links button:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.theme-btn {
  border: 1px solid currentColor;
  padding: 7px 14px !important;
  border-radius: 16px;
  opacity: 0.75;
}

.theme-btn:hover {
  opacity: 1;
}

.theme-btn::after {
  display: none !important;
}

@media (max-width: 900px) {
  nav {
    padding: 20px 24px;
  }
  .links {
    gap: 18px;
  }
}

@media (max-width: 700px) {
  .links {
    gap: 13px;
  }
  .links button {
    font-size: 10px;
    letter-spacing: 1.5px;
  }
}
</style>
