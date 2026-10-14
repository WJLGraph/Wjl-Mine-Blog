import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './useGsap'

/**
 * 全站平滑滚动（Lenis × GSAP ticker）
 * - 惯性滚轮带来"呼吸感"，与 ScrollTrigger 单一事实源同步
 * - prefers-reduced-motion 时返回 null，全部滚动行为回退原生
 */
let lenis = null

export function initSmoothScroll() {
    if (lenis) return lenis
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

    lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.6
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return lenis
}

export function getLenis() {
    return lenis
}

/**
 * 锚点滚动：优先走 Lenis 缓动，未启用时回退原生 scrollIntoView
 */
export function scrollToSection(id) {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) {
        lenis.scrollTo(el, { offset: 0, duration: 1.4 })
    } else {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

/**
 * 即时滚动复位（路由切换用，必须感知 Lenis）：
 * 原生 window.scrollTo 会被 Lenis 惯性动画写回旧位置——用户点卡片时惯性尚未停止，
 * 复位被覆盖 → 新页挂载后文档变矮 → 浏览器把滚动钳制到底部（"进详情页落底"的根因）。
 * lenis.scrollTo + immediate 强制把 Lenis 内部 target/animated 同步到目标位并取消进行中的惯性。
 */
export function scrollInstant(y = 0) {
    if (lenis) {
        lenis.scrollTo(y, { immediate: true, force: true })
    } else {
        window.scrollTo({ top: y, behavior: 'instant' })
    }
}