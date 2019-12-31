# vue-mobile

## 简介

这是基于 vue-cli3 实现的移动端 H5 开发模板，其中包含移动端常用功能模块，可供快速开发使用。
技术栈：vue + webpack + vant + axios + less + AMap + echarts

## 功能列表

- 基础框架(UI 库(vant),移动端适配,axios 封装，工具类函数封装)
- 基础组件封装(toast, dialog,loading, 底部导航)
- 常规页面(app 首页，列表页，门店详情页，个人中心页，登录页，城市选择页)
- 常用功能(高德地图使用，echart 使用，二维码，登录权限校验)

## 基础框架

### 搭建项目目录

按如下文件目录搭建项目框架

```
src                               主要源码目录
|-- assets                        静态资源，统一管理
|-- components                    公用组件，全局组件
|-- JS                            JS相关操作处理
    |-- ajax                      axios封装的请求拦截
    |-- utils                     全局封装的工具类
    |-- shopData                  模拟数据，临时存放
|-- router                        路由，统一管理
|-- store                         vuex, 统一管理
|-- views                         视图目录
```

### 配置 vant

1. 安装依赖

```
npm i vant -S
```

2. 在.babelrc 中添加配置

```js
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
```

3. 局部注册使用

```js
import { Rate } from 'vant'
<rate value="4" color="#FA7022" size="9" readonly allow-half />
```

### 移动端适配

1. 安装依赖

```
npm install px2rem-loader --save-dev
```

2. 在 vue.config.js 进行如下配置

```js
  css: {
    // css预设器配置项
    loaderOptions: {
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100
          })
        ]
      }
    }
  },
```

3. 在 main.js 设置 html 跟字体大小

```js
function initRem() {
  let cale = window.screen.availWidth > 750 ? 2 : window.screen.availWidth / 375
  window.document.documentElement.style.fontSize = `${100 * cale}px`
}

window.addEventListener('resize', function() {
  initRem()
})
```

### axios 请求封装

1. 设置请求拦截和响应拦截

```js
const PRODUCT_URL = 'https://xxxx.com'
const MOCK_URL = 'http://xxxx.com'
let http = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? PRODUCT_URL : MOCK_URL
})
// 请求拦截器
http.interceptors.request.use(
  config => {
    // 设置token，Content-Type
    var token = sessionStorage.getItem('token')
    config.headers['token'] = token
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 请求显示loading效果
    if (config.loading === true) {
      vm.$loading.show()
    }
    return config
  },
  error => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)
// 响应拦截器
http.interceptors.response.use(
  res => {
    vm.$loading.hide()
    // token失效，重新登录
    if (res.data.code === 401) {
      //  重新登录
    }
    return res
  },
  error => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)
```

2. 封装 get 和 post 请求方法

```js
function get(url, data, lodaing) {
  return new Promise((resolve, reject) => {
    http
      .get(url)
      .then(
        response => {
          resolve(response)
        },
        err => {
          reject(err)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

function post(url, data, loading) {
  return new Promise((resolve, reject) => {
    http
      .post(url, data, { loading: loading })
      .then(
        response => {
          resolve(response)
        },
        err => {
          reject(err)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

export { get, post }
```

3. 把 get，post 方法挂载到 vue 实例上。

```js
// main.js
import { get, post } from './js/ajax'
Vue.prototype.$http = { get, post }
```

### 工具类函数封装

1. 添加方法到 vue 实例的原型链上

```js
export default {
  install (Vue, options) {
    Vue.prototype.util = {
      method1(val) {
        ...
      },
      method2 (val) {
       ...
      },
  }
}
```

2. 在 main.js 通过 vue.use()注册

```js
import utils from './js/utils'
Vue.use(utils)
```

本文提供以下函数封装

- 获取 url 参数值
- 判断浏览器类型
- 判断 IOS/android
- 校验手机号码
- 检验车牌号
- 校验车架号
- 检验身份证号码
- 日期格式化
- 时间格式化
- 城市格式化
- 压缩图片
- 图片转成 base64

## 基础组件封装

toast 和 dialog 组件基本是每一个移动端项目都会用到的。本文封装了这两个组件，可供直接调用，如：

```js
this.$toast({ msg: '手机号码不能为空' })

this.$toast({
  msg: '成功提示',
  type: 'success'
})

this.$dialog({
  title: '删除提示',
  text: '是否确定删除此标签？',
  showCancelBtn: true,
  confirmText: '确认',
  confirm(content) {
    alert('删除成功')
  }
})
```

### toast

**Props**

| name | type   | default | description                                                            |
| ---- | ------ | ------- | ---------------------------------------------------------------------- |
| msg  | String | ''      | 弹窗提示语                                                             |
| type | String | ''      | 弹窗类型：success(成功提示),fail(失败提示),warning(警告),loading(加载) |

### dialog

**Props**

| name        | type   | default | description               |
| ----------- | ------ | ------- | ------------------------- |
| title       | String | ''      | 标题                      |
| text        | String | ''      | 文本内容                  |
| type        | String | ''      | 默认纯文本，input(输入框) |
| maxlength   | Number | 20      | 输入的最多字数            |
| confirmText | String | 确定    | 右边按钮                  |
| cancelText  | String | 取消    | 左边按钮                  |

**Events**

| name    | params | description  |
| ------- | ------ | ------------ |
| confirm | null   | 选择后的回调 |
| cancel  | ull    | 取消后的回调 |

## 常用功能

### 登录权限判断

在应用中，有些页面是不需要登录即可访问的，如首页，门店列表，门店详情等对公众公开的页面；也有是需要登录后才能访问的，如个人中心里面的页面。此时就需要对页面访问进行控制了。

1. 配置路由的 meta 对象的 auth 属性

```js
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', keepAlive: false, auth: false }
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('../views/mine.vue'),
    meta: { title: '我的', keepAlive: false, auth: true }
  }
]
```

2. 在路由首页进行判断
   当`to.meta.auth`为`true`(需要登录),且不存在登录信息缓存时，需要重定向去登录页面

```js
router.beforeEach((to, from, next) => {
  let name = sessionStorage.getItem('name') ? sessionStorage.getItem('name') : ''
  if (!name && to.meta.auth) {
    next('/login')
  } else {
    next()
  }
})
```

### 高德地图

1. 在 index.html 引入 cdn 链接

```html
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.4&key=xxx"></script>
```

2. 在 vue.config 的 externals 属性添加配置

```js
configureWebpack: config => {
  config.externals = {
    AMap: 'AMap'
  }
}
```

3. 页面调用

```js
import AMap from 'AMap' // 引入高德地图

var map = new AMap.Map('container', {
  zoom: 11, //级别
  center: [116.397428, 39.90923] //中心点坐标
})
```

浏览器定位

```js
AMap.plugin('AMap.Geolocation', function() {
  var geolocation = new AMap.Geolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    zoomToAccuracy: true,
    buttonPosition: 'RB'
  })

  geolocation.getCurrentPosition()
  AMap.event.addListener(geolocation, 'complete', onComplete)
  AMap.event.addListener(geolocation, 'error', onError)

  function onComplete(data) {
    // data是具体的定位信息
  }

  function onError(data) {
    // 定位出错
  }
})
```

此方法定位在部分手机浏览器定位不准或者获取不到定位。如果只想要获取城市定位，则使用可以使用以下方法：

```js
AMap.plugin('AMap.CitySearch', function() {
  var citySearch = new AMap.CitySearch()
  citySearch.getLocalCity(function(status, result) {
    if (status === 'complete' && result.info === 'OK') {
      // 查询成功，result即为当前所在城市信息
    }
  })
})
```

### echarts(柱状图，饼图，折线图)

1. 在 index.html 引入 cdn 链接

```html
<script src="https://cdn.bootcss.com/echarts/3.7.1/echarts.min.js"></script>
```

2. 在 vue.config 的 externals 属性添加配置

```js
configureWebpack: config => {
  config.externals = {
    echarts: 'echarts'
  }
}
```

3. 页面调用

```js
import echarts from 'echarts'

drawBar () {
  let myChart = echarts.init(document.getElementById('bar'))
  myChart.setOption({
    // ....
  })
},
```

### 二维码

1. 安装依赖

```
npm install qrcodejs2 --save
```

2. 调用，初始化实例

```js
import QRCode from 'qrcodejs2'

let qrcode = new QRCode('qrcode', {
  text: 'https:baidu.com',
  width: 200, // 图像宽度
  height: 200, // 图像高度
  colorDark: '#000000', // 前景色
  colorLight: '#ffffff', // 背景色
  typeNumber: 4,
  correctLevel: QRCode.CorrectLevel.H // 容错级别
})
```

如果要生成图片，可以使用 htmlToCanvas 生成 canvas 画布

```js
import html2canvas from 'html2canvas'

html2canvas(document.body).then(function(canvas) {
  document.body.appendChild(canvas)
})
```
