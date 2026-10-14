/**
 * 手写轻量语法高亮器（零依赖）
 * 单遍 sticky 正则扫描，对原始源码 tokenize，输出阶段才逐段转义
 * 支持 python / javascript
 */

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// 规则顺序即优先级：注释 > 字符串 > 装饰器 > 关键字 > 数字 > 函数调用 > 标点
const RULES = {
  python: [
    ['cmt', /#[^\n]*/y],
    [
      'str',
      /(?:[fFrRbBuU]{0,2})(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/y
    ],
    ['dec', /@[\w.]+/y],
    [
      'kw',
      /\b(?:def|class|return|if|elif|else|for|while|in|import|from|as|with|try|except|finally|raise|async|await|yield|lambda|not|and|or|pass|break|continue|global|assert|del|is|None|True|False)\b/y
    ],
    ['num', /\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y],
    ['fn', /[A-Za-z_]\w*(?=\s*\()/y],
    ['pun', /[{}()[\],.:;=+\-*/<>!|&%^~@]+/y]
  ],
  javascript: [
    ['cmt', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['str', /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y],
    [
      'kw',
      /\b(?:const|let|var|function|return|if|else|for|while|of|in|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|this|null|undefined|true|false|switch|case|break|continue)\b/y
    ],
    ['num', /\b\d[\d_]*(?:\.\d+)?\b/y],
    ['fn', /[$A-Za-z_]\w*(?=\s*\()/y],
    ['pun', /[{}()[\],.:;=+\-*/<>!|&%^~?]+/y]
  ]
}

/**
 * tokenize: 原始代码 -> [{ cls: 'tk-xxx' | '', text }]（未转义）
 */
export function tokenize(code, lang) {
  const rules = RULES[lang] || RULES.python
  const segs = []
  let i = 0
  let buf = ''
  const flush = () => {
    if (buf) {
      segs.push({ cls: '', text: buf })
      buf = ''
    }
  }
  outer: while (i < code.length) {
    for (const [name, re] of rules) {
      re.lastIndex = i
      const m = re.exec(code)
      if (m && m[0]) {
        flush()
        segs.push({ cls: 'tk-' + name, text: m[0] })
        i += m[0].length
        continue outer
      }
    }
    buf += code[i++]
  }
  flush()
  return segs
}

const wrap = (seg, text) =>
  seg.cls ? `<span class="${seg.cls}">${esc(text)}</span>` : esc(text)

/**
 * 全量高亮（详情页文档代码块 / CodeLab sizer 层）
 */
export function highlightCode(code, lang) {
  return tokenize(code, lang)
    .map((s) => wrap(s, s.text))
    .join('')
}

/**
 * 打字机截断：取前 n 个字符的高亮 HTML，跨 token 段正确切分
 * tokenize 一次，逐帧截断，永不重复分词
 */
export function sliceHtml(segs, n) {
  let html = ''
  let remain = n
  for (const s of segs) {
    if (remain <= 0) break
    const t = s.text.slice(0, remain)
    html += wrap(s, t)
    remain -= t.length
  }
  return html
}
