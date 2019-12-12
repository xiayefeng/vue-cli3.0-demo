import req from '@/utils/request'
import { hasOwn } from './index'

const CryptoJS = require('crypto-js')

// 十六位字符串作为密钥
const key = CryptoJS.enc.Utf8.parse('sptaicaresnetspt')

// 需加密的参数key
const secParamList = ['adminPassword', 'idCard', 'birthday', 'pwd', 'password']

// 加密方法
const Encrypt = (word) => {
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}

/**
 * 加密参数过滤并加密
 * @export
 * @param {*} data
 * @returns
 */
function secParams (data) {
  for (let key in data) {
    if (hasOwn(data, key) && secParamList.includes(key)) {
      data[key] = Encrypt(data[key])
    }
  }
  return data
}

// 发送get请求
export function reqGet (url, params) {
  params = secParams(params)
  return req({ url, params })
}

// 发送post请求
export function reqPost (url, data) {
  data = secParams(data)
  return req({ url, data, method: 'post' })
}
