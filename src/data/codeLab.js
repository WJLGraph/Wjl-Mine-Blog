/**
 * CODE LAB 代码片段 — 全部来自真实项目
 * 1. agent.py     呼应 fire-agent 的 LangGraph 多 Agent 编排
 * 2. useGsap.js   本站自己的逐字拆分工具（自指彩蛋）
 * 3. stream.py    呼应焰哨系统的 FastAPI SSE 节点级推送
 */
export const snippets = [
  {
    file: 'agent.py',
    tab: 'agent.py',
    lang: 'python',
    code: `from typing import TypedDict
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    task: str
    data: dict
    report: str
    next: str

def parse_task(state: AgentState) -> dict:
    intent = router_llm.invoke(state["task"])
    return {"next": intent.route}

def query_data(state: AgentState) -> dict:
    rows = db.fetch(state["task"])
    return {"data": rows, "next": "compose"}

def compose(state: AgentState) -> dict:
    report = writer_llm.invoke(state["data"])
    return {"report": report, "next": END}

graph = StateGraph(AgentState)
graph.add_node("parse_task", parse_task)
graph.add_node("query_data", query_data)
graph.add_node("compose", compose)
graph.set_entry_point("parse_task")
graph.add_conditional_edges("parse_task", lambda s: s["next"])
app = graph.compile()`,
    runOutput: '✓ graph compiled · 8 nodes · 2 conditional edges'
  },
  {
    file: 'useGsap.js',
    tab: 'useGsap.js',
    lang: 'javascript',
    code: `import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export { gsap, ScrollTrigger }

// 将元素文本拆分为逐字 span，用于大标题逐字入场
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
}`,
    runOutput: '✓ 你现在看到的打字动画，正由这段代码驱动'
  },
  {
    file: 'stream.py',
    tab: 'stream.py',
    lang: 'python',
    code: `from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json

router = APIRouter()

@router.get("/agents/{run_id}/stream")
async def stream(run_id: str):
    async def event_flow():
        async for chunk in graph.astream(run_id):
            node, state = chunk
            payload = json.dumps({"node": node})
            yield f"event: node\\ndata: {payload}\\n\\n"
        yield 'event: done\\ndata: {"status": "ok"}\\n\\n'

    return StreamingResponse(
        event_flow(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache"},
    )`,
    runOutput: '✓ stream closed · 128 events · 0 dropped'
  }
]
