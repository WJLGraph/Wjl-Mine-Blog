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