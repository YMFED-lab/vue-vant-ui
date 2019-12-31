import Vue from 'vue'
import App from './App.vue'
import router from './router'
import FastClick from 'fastclick'

import './assets/css/reset.css'
import './assets/css/common.css'

import Dialog from './components/dialog'
import Loading from './components/loading'
import toast from './components/toast'

import utils from './JS/utils'
import './JS/plugin'
import VueScroller from 'vue-scroller'
import { get, post } from './JS/ajax'

Vue.use(VueScroller)
Vue.use(utils)

Vue.prototype.$dialog = Dialog
Vue.prototype.$loading = Loading
Vue.prototype.$toast = toast
Vue.prototype.$http = { get, post }

let u = navigator.userAgent
let deviceIsIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

FastClick.prototype.focus = function (targetElement) {
  var length
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length
    targetElement.setSelectionRange(length, length)
    targetElement.focus()
  } else {
    targetElement.focus()
  }
}
FastClick.attach(document.body)
Vue.config.productionTip = false

let cale = window.screen.availWidth > 750 ? 2 : window.screen.availWidth / 375
window.document.documentElement.style.fontSize = `${100 * cale}px`

router.beforeEach((to, from, next) => {
  let name = sessionStorage.getItem('name') ? sessionStorage.getItem('name') : ''
  if (!name && to.meta.auth) {
    next('/login')
  } else {
    next()
  }
})

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
