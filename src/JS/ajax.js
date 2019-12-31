import axios from 'axios'
import vm from '../main'

/* 全局默认配置 */
const PRODUCT_URL = 'xxxxxxxxx'
const MOCK_URL = 'abcdefg'
var http = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? PRODUCT_URL : MOCK_URL
})
/* 请求拦截器 */
http.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['timestamp'] = Math.floor(new Date().getTime() / 1000)
    config.headers['token'] = sessionStorage.getItem('token')
    if (config.loading === true) {
      vm.$loading.hide()
      vm.$loading.show()
    }
    return config
  },
  error => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)
/* 响应拦截器 */
http.interceptors.response.use(
  res => {
    vm.$loading.hide()
    return res
  },
  error => {
    vm.$loading.hide()
    return Promise.reject(error)
  }
)

function get (url, data, loading) {
  return new Promise((resolve, reject) => {
    http.get(url).then(
      response => {
        resolve(response.data)
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

function post (url, data, loading) {
  return new Promise((resolve, reject) => {
    http.post(url, data, { loading: loading }).then(
      response => {
        resolve(response.data)
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

export { http, get, post }
