import axios from 'axios'
import qs from 'qs'
import utils, { uuid } from './index'
import store from '@/vuex'
import { msgCode } from '@/container/global'

// const CancelToken = axios.CancelToken

const BASE_URL = process.env.VUE_APP_URL
let baseURL = BASE_URL
// 创建一个拦截器实例
const instance = axios.create({
  baseURL, // 会加在请求url的头部
  timeout: 1.5e4 // 请求超时时间
})

// 拦截请求
instance.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json'
    config.data = JSON.stringify(config.data)
    // console.log(store.state.token)
    let token = store.state.token || utils.store.getSession('token')
    if (token) {
      config.headers['token'] = token
    }
    const UUID = uuid()
    config.headers['requestId'] = UUID
    let params = config.params
    for (let item in params) {
      if (params[item] == null || params[item] === '') {
        delete params[item]
      } else {
        if (params[item] instanceof Object) {
          params[item] = JSON.stringify(params[item])
        }
      }
    }
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
    config.params = params
    return config
  },
  error => Promise.reject(error)
)

// 拦截服务器响应
instance.interceptors.response.use(
  resp => {
    // console.log(resp.status)
    const res = resp.data
    if (res.code === msgCode.success) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    console.log(error)
    if (error.message.includes('Network')) {
      error.message = '网络故障或服务链接中断，请稍后再试！'
    } else if (error.message.includes('timeout')) {
      error.message = '请求超时，请稍后重试！'
    } else if (error.message.includes('status code 404')) {
      error.message = '请求地址404！'
    } else if (error.message.includes('status code 500')) {
      error.message = '服务器错误，请稍后重试！'
    } else if (!error.message && error.code === void 0) {
      error.message = '连接出错，请重试！'
    }
    return Promise.reject(error)
  }
)

/**
 * 公共axios请求方法封装
 * @export
 * @param {*} { url, method = 'get', params = {}, data = {} }
 * @returns
 */
export default function request ({
  url,
  method = 'get',
  params = {},
  data = {}
} = {}) {
  // console.log(url)
  if (!url) {
    throw new Error('url不能为空')
  }

  let params2
  if (params.isDict) {
    params2 = JSON.parse(JSON.stringify(params))
    delete params.isDict
  }
  return instance.request({
    url,
    params,
    data,
    method
  })
    .then(res => {
      if (params2 && params2.isDict) {
        res.dictType = params2.typeCode
      }
      return Promise.resolve(res)
    })
    .catch(error => {
      // console.log(error)
      if (error.errMsg && !error.message) {
        error.message = error.errMsg
      } else if (!error.errMsg && !error.message) {
        error.message = '请求数据错误！'
      }
      return Promise.reject(error)
    })
}
