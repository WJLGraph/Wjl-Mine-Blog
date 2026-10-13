# WJL严选

## 一、项目介绍（接口失效）

​		第一个小程序。《WJL严选》项目是受新中产喜爱的生活方式品牌，覆盖居家生活、服饰鞋包、美食酒水、个护清洁、母婴亲子、运动户外、数码加点、严选全球8大品类。该项目是一个使用Vant-weapp搭建的微信小程序商城。包含 模块

## 二、技术要点

1、使用微信小程序开发者工具，结合Vant Weapp组件库进行商城UI界面的开发；

2、对wx.request进行网络请求，并结合promise对请求进行封装；

3、封装api.js，对项目所有api请求进行统一管理；

4、使用async+await处理封装过的异步请求，将异步函数同步化，请求时不使用回调函数的写法；

5、实现自定义tabbar，使用custom-tab-bar，结合Vant Weapp中的组件进行自定义；

6、搜索功能

7、购物车模块

需要用到的组件：

提示Tips组件。来源：封装过的组件。

Checkbox 复选框。用途：购物车复选框选项。来源：Vant Weapp。

Card 商品卡片。用途：购物车列表展示。来源：Vant Weapp。

SubmitBar 提交订单栏。用途：购物车底部全选，总价等展示。来源：Vant Weapp。

SwipeCell 滑动单元格。用途：滑动展示删除按钮。来源：Vant Weapp。

8、封装强制登录跳转的工具函数，实现登录后返回原来页面的功能，利用globalData存储是否需要返回原来页面的标志；

9、针对自定义的tabbar不能使用navigate的相关操作，利用globalData存储是否是来自自定义tabbar的跳转，从而区分返回原来页面是tabbar的切换还是普通页面的跳转；

10、使用wx.setStorageSync和wx.getStorageSync对token对用户信息和token进行存储和操作；

11、使用wxs对价格等数据的格式进行过滤和重复利用；

12、使用template对相同布局的结构进行抽取和重复利用；

13、使用rich-text渲染后端返回的富文本；

14、使用less预编译语言对项目样式进行快速开发；

15、使用gitee对项目进行版本管理

## 三、项目实现效果

### （1）首页

![1](https://gitee.com/wjl2004/yanxuan/raw/master/assets/%E9%A6%96%E9%A1%B51.png)

### （2）点击购物车显示

![2](https://gitee.com/wjl2004/yanxuan/raw/master/assets/%E7%82%B9%E5%87%BB%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%98%BE%E7%A4%BA2.png)

### （3）个人

![3](https://gitee.com/wjl2004/yanxuan/raw/master/assets/%E4%B8%AA%E4%BA%BA3.png)

### (4)登录

### ![4](https://gitee.com/wjl2004/yanxuan/raw/master/assets/%E4%B8%AA%E4%BA%BA4.png)

### (5)搜索

![5](https://gitee.com/wjl2004/yanxuan/raw/master/assets/%E6%90%9C%E7%B4%A25.png)

