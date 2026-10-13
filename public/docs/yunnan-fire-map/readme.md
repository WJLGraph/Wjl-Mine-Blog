# 云南省火险可视化大屏 🌲🔥

## 介绍

**"看火不是火，是数据在跳舞"** 

​		注：本项目为本人的毕设，现在还未做完，未集成预测的数据

​		这是一个基于Vue3 + OpenLayers的森林火险可视化大屏项目，专门为云南这块"动植物王国"量身打造。不仅能让火险数据"看得见"，还能让火势预测"算得准"，让防火决策"搞得定"！

​		项目融合了地理信息系统(GIS)、大数据可视化和火险预警模型，为云南省森林防火工作提供了一套"黑科技"解决方案。通过实时监测、智能预警、可视化展示，让火险管理从"被动救火"变成"主动防火"。

### 项目效果速览

#### 一、通用功能

##### 1.**主页效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/01%E6%80%BB%E4%BD%93%E6%95%88%E6%9E%9C.png)

##### 2.**天气组件效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/02%E5%A4%A9%E6%B0%94%E7%BB%84%E4%BB%B6.png)

##### 3.**时间组件效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/03%E6%97%B6%E9%97%B4%E7%BB%84%E4%BB%B6.png)

##### 4.**热力图效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/04%E7%83%AD%E5%8A%9B%E5%9B%BE%E6%95%88%E6%9E%9C.png)

##### 5.**测量工具效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/05%E6%B5%8B%E9%87%8F%E8%B7%9D%E7%A6%BB.png)

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/05%E6%B5%8B%E9%87%8F%E9%9D%A2%E7%A7%AF.png)

##### 6.**画笔工具效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/06%E7%94%BB%E7%AC%94%E5%B7%A5%E5%85%B7.png)

##### 7.**图层管理工具效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/07%E5%9B%BE%E5%B1%82%E7%AE%A1%E7%90%86.png)

##### 8.**定位到云南工具效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/08%E5%AE%9A%E4%BD%8D%E5%88%B0%E4%BA%91%E5%8D%97%E9%82%A3.gif)

##### 9.**下载地图工具效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/09%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9B%BE.png)

##### **10.筛选特定火点效果**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/10%E7%AD%9B%E9%80%89%E7%89%B9%E5%AE%9A%E7%81%AB%E7%82%B9.png)

##### 11.火点详情展示

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/11%E7%81%AB%E7%82%B9%E8%AF%A6%E6%83%85.png)

#### 二、历史数据功能

##### **1.历史火点危害等级**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/00-1%E5%8E%86%E5%8F%B2%E7%81%AB%E7%82%B9%E7%AD%89%E7%BA%A7.gif)

##### **2.历史火点发生频次**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/00-2%E5%8E%86%E5%8F%B2%E7%81%AB%E7%82%B9%E9%A2%91%E6%AC%A1.gif)

#### 三、预测数据功能

##### **1.预测火险等级占比**

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/00-3%E9%A2%84%E6%B5%8B%E7%AD%89%E7%BA%A7.gif)

##### 2.预测火点占比+详情

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/00-4%E9%A2%84%E6%B5%8B%E7%81%AB%E7%82%B9%E5%8D%A0%E6%AF%94+%E8%AF%A6%E6%83%85.gif)

##### 3.预测区域火险可视化

![](https://gitee.com/wjl2004/Fire_hazard_Yunnan_system/raw/master/README.assets/00-5%E9%A2%84%E6%B5%8B%E5%8C%BA%E5%9F%9F%E7%81%AB%E9%99%A9%E5%8F%AF%E8%A7%86%E5%8C%96.gif)

#### 软件架构

**技术栈：**

- **前端框架**：Vue3（响应式比云南的天气变化还快）
- **地图引擎**：OpenLayers（地图界的"老司机"）
- **图表库**：ECharts（数据界的"画家"）
- **UI组件**：ElementPlus（颜值担当）
- **数据格式**：GeoJSON（地理数据的"通用语言"）

**系统架构：**
- 前端：Vue3单页面应用(SPA)
- 地图服务：OpenLayers + 高德地图API
- 数据可视化：ECharts图表库
- 数据存储：本地GeoJSON文件 + 在线API

#### 安装教程

**"三步走"战略，让你快速上手：**

1. **克隆项目**（把代码"拐"回家）
   ```bash
   git https://gitee.com/wjl2004/Fire_hazard_Yunnan_system.git
   cd Fire_hazard_Yunnan_system
   ```

2. **安装依赖**（给项目"喂饱饭"）
   ```bash
   npm install
   ```
   
3. **启动项目**（让项目"跑起来"）
   ```bash
   npm run dev
   ```

**环境要求：**

- Node.js >= 22.11.0（老版本请"退休"）
- npm >= 10.9.0
- 现代浏览器（IE请"走开"）

#### 使用说明

**"保姆级"操作指南（包教包会，不会退票）：**

1.  **🚀 穿越时空（模式切换）**
    *   点击屏幕顶部的“历史火点”或“预测火点”按钮，即可在“过去”与“未来”之间反复横跳。
    *   **历史模式**：复盘过去，看看哪里曾经“火”过，吸取教训。
    *   **预测模式**：偷看2025-2026年的剧本，提前拿捏火险趋势，运筹帷幄之中。

2.  **🌏 上帝视角（火险分布）**
    *   地图上密密麻麻的小圆圈不是芝麻，那是实打实的火点/风险点！
    *   **聚合魔法**：点多的时候会自动抱团（聚合），数字越大代表这里越“热闹”。
    *   **五彩斑斓**：预测模式下，地图会自动根据风险等级给各州市“上色”。
        *   🟩 **绿色**：稳如老狗（低风险，可以散步）
        *   🟨 **黄色**：有点东西（中风险，保持警惕）
        *   🟧 **橙色**：大事不妙（高风险，准备摇人）
        *   🟥 **红色**：这是要火啊！（极高风险，消防员叔叔请就位）

3.  **🔥 热力追踪（热力图）**
    *   点击右上角的“热力图”开关，地图瞬间开启“红外成像”模式。
    *   哪里红得发紫？恭喜你，找到了最“火热”的区域（高危预警区）。
    *   **贴心设计**：边缘带点绿，中心红彤彤，既科学准确又保护视力。

4.  **🎯 瞬间移动（精准打击）**
    *   想看哪里点哪里？不，是用搜索框！
    *   选择具体的年份月份（比如2026年2月），或者直接选个城市（比如昆明市），嗖的一下镜头就飞过去了。
    *   支持时间+地点的双重锁定，绝不迷路。

5.  **📝 查户口（详情查询）**
    *   对某个点位感兴趣？直接点它！
    *   右侧会自动弹出“八卦”小窗口（抽屉），把它的前世今生（日期、经纬度、FRP辐射功率、风险评分）扒得干干净净。
    *   **数据修正**：我们修复了预测数量显示Bug，现在能看到真实的预测火点数了！

6.  **👜 多啦A梦的口袋（工具箱）**
    *   📏 **测量工具**：想知道火线有多长？燃烧面积有多大？拿尺子量一量，数据精确到小数点后好几位。
    *   🎨 **画笔工具**：想在地图上圈圈点点？神笔马良上线，圆的方的随便画，战术部署必备。
    *   🍰 **图层管理**：像剥洋葱一样控制地图显示，底图、标注、火点层，想看哪层看哪层。

7.  **📊 数据大屏（老板最爱）**
    *   左右两侧的图表不是摆设，是实打实的数据可视化。
    *   **左侧历史**：回顾过去，分析频次与危害。
    *   **右侧预测**：展望未来，采用了SCI级专业配色（绿-黄-橙-红），数据动态跳动，看着就显得很专业（很贵）。

#### 参与贡献

**"众人拾柴火焰高"（虽然我们不希望真有火）：**

1. **Fork本仓库**（复制一份"你的地盘"）
2. **新建Feat_xxx分支**（开辟"新战场"）
3. **提交代码**（献上你的"智慧结晶"）
4. **新建Pull Request**（让我们"欣赏"你的杰作）

**贡献指南：**
- 代码风格：请保持"整洁如新"
- 提交信息：请写得"明明白白"
- 功能测试：请确保"稳如老狗"

#### 特技

**我们的"独门绝技"：**

1. **实时预警**：基于气象数据的火险预测模型，比"天气预报"还准（还未实现）
2. **智能推荐**：根据火险等级，支持"最佳应对策略"（还未实现）

**参考资源：**

- Gitee**[黄现鹏](https://gitee.com/huang-xianpeng6)/[2024四川地质灾害可视化平台](https://gitee.com/huang-xianpeng6/disaster_sichuan)**

---

**最后的话：**

这个项目不仅能让你"看懂"火险，更能让你"看透"火险。我们用代码为云南省的森林防火工作贡献一份力量，用技术守护这片绿色的家园。记住，预防胜于治疗，防火重于救火！

**"让数据多跑路，让防火人员少跑腿"** —— 这就是我们项目的初心和使命！ 🌲💚
