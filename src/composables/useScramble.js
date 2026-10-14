import { gsap } from './useGsap'

// 随机字符池：剔除易混淆的 0/O/1/l/I
const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

/**
 * 解码乱码入场：ASCII 字母数字逐位从乱码收敛为原文，CJK / 标点保持原位
 * 使用 gsap.ticker 与全站动画共用心跳，deltaRatio 自动适配高刷屏
 * @param {HTMLElement} el
 * @param {{ duration?: number }} [opts]
 * @returns {() => void} cleanup
 */
export function scrambleIn(el, { duration = 0.9 } = {}) {
    const original = el.textContent
    const chars = [...original]
    const total = chars.length
    let frame = 0
    let p = 0

    const tick = () => {
        frame++
        p = Math.min(1, p + (gsap.ticker.deltaRatio() * 1.8) / (duration * 60))
        let out = ''
        chars.forEach((ch, i) => {
            out +=
                i < p * total || !/[A-Za-z0-9]/.test(ch) ?
                ch :
                POOL[(Math.random() * POOL.length) | 0]
        })
        el.textContent = out
        if (p >= 1) {
            el.textContent = original
            cleanup()
        }
    }

    const cleanup = () => gsap.ticker.remove(tick)
    gsap.ticker.add(tick)
    return cleanup
}