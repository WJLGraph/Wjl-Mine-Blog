# jifen36:wjl积分商城

## 一、项目简介

​	本人大学纯摆子，人生中看课第一个项目，主要用**Vue2**去写这个商城，因**后端API失效**，所以实现不了真正意义上的接口。

​	跟的叩丁狼![4](https://gitee.com/wjl2004/jifen36/raw/master/assets/4-20240904204919-9wrfgh8.png)这个教程。

​	它官方真实项目参考地址：[http://sc.wolfcode.cn/](http://sc.wolfcode.cn/)

​	它的接口文档地址：[http://www.docway.net/project/1h9xcTeAZzV/share/1iUU09vKhMm](http://www.docway.net/project/1h9xcTeAZzV/share/1iUU09vKhMm)（都已**失效**）

​	现在写了5天，目前完成：头部、切换栏，页脚，微信和验证码登录，提示组件封装，首页，购物车,404，全部商品，个人中心



### 1.1、项目介绍

《wjl积分商城》是一个由vue-cli搭建的PC端SPA商城，该商城主要涉及登录注册、商品列表、商品详情、个人中心、购物车及商品检索等主体功能。该项目主要用于平台用户参与积分兑换商品，是一个中大型的PC端商城项目。

### 1.2、项目技术点

1. 使用vue-cli搭建项目，并结合蓝湖+PS进行页面切图，实现对设计稿的高保真还原；
2. 使用axios进行数据请求，并对其进行请求拦截器响应拦截器封装；
3. 封装所有请求的api，统一管理项目所有的请求路径
4. 鉴权,认证机制采用手机+验证码、手机+密码及微信扫码登录认证，其中微信扫码登录结合环境变量，调用后端接口实现平台切换验证；
5. 使用localStorage对token进行存储;
6. 使用原生JS在组件mounted中监听滚动，并实现向下滚动加载更多；
7. 使用组内导航守卫对每个进入个人中心页的路由进行拦截，判断路径后保证有token方能进入该路由；
8. 使用路由监听解决路由跳转而页面不跳转的问题；
9. 给组件绑定key属性，通过修改key值来进行组件重载;



## 二、现阶段实现的效果图（如下）

### 基本效果框架

![7](https://gitee.com/wjl2004/jifen36/raw/master/assets/1-20240904204638-opqacdx.png)

### 静态页面-首页效果：

![5](https://gitee.com/wjl2004/jifen36/raw/master/assets/1.gif)


### 动态页面-首页效果（接口已失效）：

![6](https://gitee.com/wjl2004/jifen36/raw/master/assets/2.gif)

### 验证码登录页面效果：

![2](https://gitee.com/wjl2004/jifen36/raw/master/assets/2-20240904204650-rt2rgsf.png)​

### 微信登录页面效果

![3](https://gitee.com/wjl2004/jifen36/raw/master/assets/5.png)

### 提示组件

![3](https://gitee.com/wjl2004/jifen36/raw/master/assets/3-20240904204701-fyi08g0.png)



### 购物车（接口失效）

![9](https://gitee.com/wjl2004/jifen36/raw/master/assets/3.gif)

### 404页面

![10](https://gitee.com/wjl2004/jifen36/raw/master/assets/6.png)

### 全部商品（接口失效）

### ![11](https://gitee.com/wjl2004/jifen36/raw/master/assets/7.png)

### 个人中心（接口失效）：

由于接口没有作用，所以一直显示

![12](https://gitee.com/wjl2004/jifen36/raw/master/assets/8.png)

我在转换静态页面一瞬间可以看到以下效果：

![13](https://gitee.com/wjl2004/jifen36/raw/master/assets/9.png)

## 三、项目运行搭建

### 项目搭建

```
npm install
```

### 编译和热加载开发

```
npm run serve
```

### 编译和最小化产品

```
npm run build
```

## 四、参考页面

```html
https://cli.vuejs.org/config/
```



## 五、已经下载的组件

```
  npm install vue-puzzle-vcode --save
  npm i axios
  npm install --save vue-monoplasty-slide-verify
  npm i rest-css
```



### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

