# 臻享云牧 — 基于协同过滤算法的云养殖平台

## 项目简介
版本1.0详细说明文档请看“说明文档.pdf”

"臻享云牧"是一款面向畜禽云养殖场景的 B2C+B2B 双端 Web 平台，旨在连接养殖户（商家）与认养者（用户），通过互联网平台实现养殖过程可视化、在线认养与产销一体化。

平台基于**协同过滤推荐算法**为用户智能推荐心仪动物，基于**RSA 非对称加密**保障用户密码安全。商家可发布动物商品、管理上下架与订单，用户可浏览、收藏、加入购物车、下单认养及评价，管理员负责全平台内容审核与用户管理。

---

## 技术栈

| 类别 | 技术选型 |
|---|---|
| 前端框架 | Vue 2 + Vue Router 3 + Vuex 3 |
| UI 组件库 | Element UI 2.x |
| 构建工具 | Vue CLI 4.x |
| HTTP 通信 | Axios（封装请求拦截器与 Token 认证） |
| 富文本编辑 | WangEditor 4.x |
| 数据可视化 | ECharts 5.x |
| 样式预处理 | SCSS（SASS） |
| 权限控制 | JWT Token + 动态路由（路由守卫） |
| 图标 | SVG Sprite（阿里 iconfont） |
| 模拟数据 | MockJS |

后端技术栈：SpringBoot + MyBatis-Plus + MySQL + Redis（据项目文档）

---

## 系统角色

平台分为**三种角色**，各自拥有独立的权限菜单与功能模块：

- **用户（普通用户）**：个人资料管理、收藏管理、留言管理、发布帖子、购物车、订单管理与评价
- **商家**：个人资料管理、留言管理、商品管理（上架/下架）、订单管理、前台浏览
- **管理员**：系统管理（用户/角色/菜单 CRUD）、分类管理、统计管理（ECharts 折线图）、日志管理、轮播图管理、留言管理、商品审核、帖子管理、订单管理

---

## 核心功能模块

### 用户端
- 登录注册（含图形验证码、前端表单校验）
- 个人资料修改（账号/邮箱/手机/头像）
- 收藏管理（收藏/取消动物商品）
- 留言管理（向管理员留言与查看回复）
- 发布帖子（富文本编辑器，支持编辑/删除/查询）
- 购物车（添加/删除/下单）
- 订单管理（查询/评价）
- 首页轮播图展示、动物列表、帖子动态、商品推荐

### 商家端
- 商品管理：新增商品、上下架（需管理员审核）、销售数据查询
- 订单管理：查看自家商品订单
- 留言管理：与管理员沟通

### 管理员端
- 用户/角色/菜单 CRUD，系统级权限配置
- 商品审核（商家上架须管理员审核通过）
- 统计管理：ECharts 折线图展示每日成交量
- 日志、轮播图、帖子、订单全面管控

### 推荐系统
- 基于协同过滤算法，根据用户历史行为推荐商品
- 未登录用户展示最新商品，登录后切换为个性化推荐

---

## 版本说明

### V1（platform-web）
- 基础版，完成了平台全部核心功能的实现
- 登录页采用深色暗夜风格表单布局
- 首页（前台）采用 Bootstrap 样式，轮播图 + 帖子区域 + 动物区域 + 固定推荐侧边栏
- 动物卡片组件采用行内样式，视觉较为朴素

### V2（platform-web-v2）
- 在 V1 基础上完成**界面全面改版升级**，定位为正式发布版
- 新增 `high-end.scss` 高端主题：深蓝主色 + 金色强调色、CSS 变量体系、毛玻璃效果、圆角卡片阴影、悬停动效
- 首页重构为 Hero 大图Banner + 现代渐变背景，个人中心侧栏改版
- 推荐侧边栏支持**跟随页面滚动动态定位**，始终保持在视口内
- 帖子列表支持**加载更多/收起**分页交互，动物卡片组件采用高端主题统一样式（hover 放大、卡片阴影、分类标签）
- Element UI 全局样式覆盖，统一按钮与分页组件主题色
- 代码规范优化，样式抽取为全局 SCSS 主题文件

---

## 项目结构

```
platform-web / platform-web-v2/
├── build/                  # Vue CLI 构建配置
├── mock/                   # MockJS 模拟数据
├── public/                 # 静态资源入口
├── src/
│   ├── api/                # 接口封装（按模块分文件）
│   │   ├── dianzan.js      # 点赞接口
│   │   ├── fenlei.js      # 分类接口
│   │   ├── fenxiang.js    # 帖子接口
│   │   ├── liuyan.js      # 留言接口
│   │   ├── lunbo.js       # 轮播图接口
│   │   ├── menuManage.js  # 菜单管理接口
│   │   ├── order.js       # 订单接口
│   │   ├── pinglun.js     # 评论接口
│   │   ├── rizhi.js       # 日志接口
│   │   ├── roleManage.js  # 角色管理接口
│   │   ├── shangpin.js    # 商品/动物接口
│   │   ├── shoucang.js    # 收藏接口
│   │   ├── tuijian.js     # 推荐接口
│   │   ├── user.js        # 用户登录接口
│   │   └── userManage.js  # 用户管理接口
│   ├── assets/            # 静态图片
│   ├── components/        # 公共组件（Breadcrumb/Hamburger/SvgIcon）
│   ├── icons/             # SVG 图标库
│   ├── layout/            # 后台管理布局（Navbar/Sidebar/TagsView）
│   ├── router/index.js    # 路由配置（含常量路由与动态路由）
│   ├── store/            # Vuex 状态管理
│   │   └── modules/
│   │       ├── app.js     # 系统配置（侧栏折叠等）
│   │       ├── permission.js  # 权限模块
│   │       ├── settings.js   # 系统设置
│   │       ├── tagsView.js  # 多标签页
│   │       └── user.js      # 用户登录/Token/菜单权限
│   ├── styles/            # SCSS 样式
│   │   ├── element-ui.scss  # Element UI 主题覆盖
│   │   ├── high-end.scss     # V2 高端主题（仅 V2）
│   │   ├── index.scss        # 全局入口
│   │   ├── mixin.scss       # SCSS 混入
│   │   ├── sidebar.scss     # 侧栏样式
│   │   ├── transition.scss  # 页面切换动画
│   │   └── variables.scss    # SCSS 变量
│   ├── utils/
│   │   ├── auth.js       # Token 读写（Cookie）
│   │   ├── request.js    # Axios 封装（请求/响应拦截器）
│   │   ├── validate.js   # 表单校验规则
│   │   └── get-page-title.js
│   ├── views/            # 页面组件
│   │   ├── about/        # 前台页面（首页/列表/详情/帖子/头尾组件）
│   │   ├── dashboard/    # 后台首页
│   │   ├── fenlei/       # 分类管理
│   │   ├── fenxiang/     # 帖子管理（用户/管理员）
│   │   ├── form/         # 表单示例
│   │   ├── liuyan/       # 留言管理（用户/管理员）
│   │   ├── login/         # 登录 & 注册页
│   │   ├── lunbo/        # 轮播图管理
│   │   ├── nested/        # 嵌套路由示例
│   │   ├── order/         # 订单 & 购物车
│   │   ├── rizhi/         # 日志管理
│   │   ├── shangp/        # 商品管理 & 审核
│   │   ├── shoucang/      # 收藏管理
│   │   ├── sys/           # 系统管理（用户/角色/菜单）
│   │   ├── tongji/        # 统计管理
│   │   └── userinfo/      # 个人中心（资料/发布帖子/我的分享）
│   ├── App.vue
│   ├── main.js
│   └── permission.js     # 全局路由守卫（Token 校验 + 动态路由挂载）
└── tests/                # 单元测试配置
```

---

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产环境打包
npm run build:prod

# ESLint 检查
npm run lint
```

> 环境要求：Node.js >= 8.9，npm >= 3.0
>
> 后端接口地址默认：`http://localhost:9999`（OSS 文件服务与 API 网关）

---

## 主要技术亮点

1. **JWT Token + 动态路由**：用户登录后从后端获取菜单权限树，前端路由守卫中动态 `addRoutes`，实现完全的角色权限控制
2. **Axios 封装**：统一请求/响应拦截器，自动携带 Token，401 自动跳转登录
3. **协同过滤推荐**：后端根据用户行为数据计算相似度，返回推荐商品列表，前端按需展示
4. **RSA 密码加密**：用户密码经 RSA 公钥加密后传输，提升安全性
5. **ECharts 可视化**：管理员统计页面以折线图展示每日成交额，辅助决策
6. **富文本编辑**：使用 WangEditor 实现帖子内容的多媒体编辑发布
7. **高端主题系统**（V2）：CSS 变量驱动的统一主题，高端卡片、悬停动效、毛玻璃侧边栏，支持快速换肤

---

## 参考项目

本项目前端架构参考自 [PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)，后端架构参考了其配套 Spring Boot 后台模板。
