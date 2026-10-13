import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export { gsap, ScrollTrigger }

/**
 * 将元素文本拆分为逐字 span（用于英文大标题逐字入场）
 * 返回拆分后的 span 集合
 */
export function splitToChars(el) {
  const text = el.textContent
  el.textContent = ''
  const frag = document.createDocumentFragment()
  const spans = []
  for (const ch of text) {
    const s = document.createElement('span')
    s.className = 'ch'
    s.textContent = ch
    frag.appendChild(s)
    spans.push(s)
  }
  el.appendChild(frag)
  return spans
}

/**
 * 将中文段落逐字拆分（保留子元素如 <em>），用于滚动渐显
 * 返回所有 .w span 集合
 */
export function splitToCJKChars(el) {
  const nodes = Array.from(el.childNodes)
  el.textContent = ''
  const out = []
  nodes.forEach((node) => {
    const target = node.nodeType === Node.ELEMENT_NODE ? node.cloneNode(false) : el
    const text = node.textContent
    for (const ch of text) {
      const s = document.createElement('span')
      s.className = 'w'
      s.textContent = ch
      target.appendChild(s)
      if (target !== el) out.push(s)
      else out.push(s)
    }
    if (target !== el) el.appendChild(target)
  })
  return out
}
