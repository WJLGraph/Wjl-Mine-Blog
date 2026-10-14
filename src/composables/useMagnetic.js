import { gsap } from './useGsap'

/**
 * 磁吸交互：指针靠近时元素被轻微"吸附"，离开后弹回
 * 返回清理函数；reduced-motion 下为空操作
 * @param {HTMLElement} el
 * @param {number} strength 吸附强度（相对指针偏离中心距离的比例）
 */
export function magnetic(el, strength = 0.3) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    const dx = gsap.utils.clamp(-r.width / 2, r.width / 2, (e.clientX - (r.left + r.width / 2)) * strength)
    const dy = gsap.utils.clamp(-r.height / 2, r.height / 2, (e.clientY - (r.top + r.height / 2)) * strength)
    xTo(dx)
    yTo(dy)
  }

  const onLeave = () => {
    xTo(0)
    yTo(0)
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)

  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
    gsap.set(el, { x: 0, y: 0 })
  }
}
