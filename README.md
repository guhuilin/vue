# vue
### vue-learn
**随着学习前端的脚步加快，突然之间感觉自己的知识点有一些遗漏，为了巩固所学知识，同时也为了查漏补缺，
以根据自己学习和做项目的情况整理了我个人的vue技术栈，梳理一下知识点(想到啥就写啥)**
[vue官网](https://router.vuejs.org/zh/)

#### 知识点 （vue指令, vue组件系统, vue-router, vuex）
在非MVVM开发过程中我们使用的jquery，zepto.js， 我们使用它最多的是对dom的操作，一部分是ajax请求；
而在MVVM项目中如angular和vue，我们对dom的操作使用的是指令
---
组件是vue中的核心概念，几乎所有的应用都是围绕着组件来展开的。在vue的设计中将组件作为基础元素，由它组成了整个应用的布局。
因此整个项目的架构看起来就像是一个组件树,一些公用的组件如果封装的好了能极大提升开发效率
不多说了
---
vue的状态管理,借鉴了redux,与redux派发action不同的是,它运用的是namespaced, 主要用来处理一些大型的项目中的复杂的业务逻辑,数据的传递使用

### 备注
**vuedemo** 删除了`package.json` `package-lock.json`,本地文件有 (避免github warning,强迫症...)

较杂. . .
