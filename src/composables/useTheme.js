/**
 * 全站黑白主题切换 — html.light 类 + localStorage 持久化
 */
import { ref } from 'vue'

const theme = ref('dark')
let inited = false

function apply() {
  document.documentElement.classList.toggle('light', theme.value === 'light')
}

/** 应用启动时调用（防闪烁） */
export function initTheme() {
  if (inited) return
  inited = true
  theme.value = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  apply()
}

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    apply()
  }
  return { theme, toggle }
}
