import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 使用 hash 模式：静态托管（GitHub Pages / Gitee Pages）无需 404 回退配置
const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/projects/:id',
            component: () =>
                import ('../views/ProjectDetailView.vue'),
            children: [{
                    path: '',
                    name: 'project-overview',
                    component: () =>
                        import ('../components/detail/DetailOverview.vue')
                },
                {
                    path: 'architecture',
                    name: 'project-architecture',
                    component: () =>
                        import ('../components/detail/DetailArchitecture.vue')
                },
                {
                    path: 'results',
                    name: 'project-results',
                    component: () =>
                        import ('../components/detail/DetailResults.vue')
                },
                {
                    path: 'showcase',
                    name: 'project-showcase',
                    component: () =>
                        import ('../components/detail/DetailShowcase.vue')
                },
                {
                    path: 'docs',
                    name: 'project-docs',
                    component: () =>
                        import ('../components/detail/DetailDocs.vue')
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () =>
                import ('../views/NotFoundView.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        // 浏览器前进 / 后退：恢复原位置
        if (savedPosition) return savedPosition
            // 同一项目详情内切换子页面（Tab）：保持当前滚动位置
        if (
            to.matched[0] &&
            from.matched[0] &&
            to.matched[0] === from.matched[0] &&
            to.matched[0].path === '/projects/:id' &&
            to.params.id === from.params.id
        ) {
            return false
        }
        // 从项目详情返回首页：定位到项目列表区块而非页顶
        // 布局会因字体/图片加载与入场 transform 持续变化，故轮询等文档位置稳定后再滚动，
        // 并在滚动后校准一次；resolve(false) 阻止 vue-router 二次滚动
        if (to.name === 'home' && from.matched[0] && from.matched[0].path === '/projects/:id') {
            return new Promise((resolve) => {
                const t0 = Date.now()
                const measure = () => {
                    const el = document.getElementById('projects')
                    if (!el) return -1
                        // rect 法：文档绝对位置（offsetTop 链在本页 DOM 结构下会漏算）
                    return Math.round(el.getBoundingClientRect().top + window.scrollY)
                }
                let stable = -1
                const settle = (y) => {
                    if (y < 0) return resolve({ top: 0 })
                        // 瞬时定位：smooth 动画会被路由过渡完成时的 ScrollTrigger.refresh() 打断并重置到中途位置
                    window.scrollTo({ top: Math.max(0, y - 90), behavior: 'instant' })
                    resolve(false)
                        // 6s 观察期：字体子集 / 懒加载导致的布局漂移自动校正；
                        // 用户一旦手动滚动（wheel / 触摸 / 按键 / 按下）立即停止校正
                    let stopped = false
                    let ro
                    const stop = () => {
                        stopped = true
                        if (ro) ro.disconnect();
                        ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
                            window.removeEventListener(ev, stop)
                        )
                    }
                    const check = () => {
                        if (stopped || router.currentRoute.value.name !== 'home') return stop()
                        const y2 = measure()
                        if (y2 > 0 && Math.abs(window.scrollY - Math.max(0, y2 - 90)) > 2) {
                            window.scrollTo({ top: Math.max(0, y2 - 90), behavior: 'instant' })
                        }
                    }
                    ro = new ResizeObserver(() => setTimeout(check, 60))
                    ro.observe(document.body)
                        // 定时兜底：总高不变的位置漂移不会触发 ResizeObserver
                    ;
                    [1000, 2000, 3500, 5000].forEach((ms) => setTimeout(check, ms));
                    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
                        window.addEventListener(ev, stop, { passive: true })
                    )
                    setTimeout(stop, 6000)
                }
                const wait = () => {
                    if (router.currentRoute.value.name !== 'home') return resolve({ top: 0 })
                    const y = measure()
                    if (y > 0 && y === stable) return settle(y)
                    stable = y
                    if (Date.now() - t0 > 4000) return settle(y)
                    setTimeout(() => requestAnimationFrame(wait), 120)
                }
                setTimeout(wait, 400)
            })
        }
        return { top: 0 }
    }
})

export default router