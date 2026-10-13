/**
 * 预加载完成事件总线
 * Hero 等首屏动画需要等待 PreLoader 结束后再播放
 */
let done = false
const listeners = new Set()

export function markPreloaderDone() {
  if (done) return
  done = true
  listeners.forEach((fn) => fn())
  listeners.clear()
}

export function onPreloaderDone(fn) {
  if (done) fn()
  else listeners.add(fn)
}

export function isPreloaderDone() {
  return done
}
