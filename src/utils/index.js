import { Store } from './local_store'
import reg from '@/container/reg'

const _toString = Object.prototype.toString
const _has = Object.prototype.hasOwnProperty
const store = new Store()
const utils = {
  store
}

export function checkedType (target) {
  return _toString.call(target).slice(8, -1)
}

export function len (str) {
  return [...str].length
}

export const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj))()

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find (list, f) {
  return list.filter(f)[0]
}

export function hasOwn (obj, key) {
  return _has.call(obj, key)
}

export const round = (n, decimals = 0) =>
  Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy (obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export function isFunction (val) {
  return typeof val === 'function'
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isSimpleData (val) {
  return !(val instanceof Object)
}

export function padZero (num) {
  return String(num).padStart(2, '0')
}

// 检测属性是否在原型链上
export function hasPrototypeProperty (object, name) {
  return !hasOwn(object, name) && name in object
}

export function isMobile () {
  const agent = navigator.userAgent
  return (
    agent.match(/Android/i) || agent.includes('iPhone') || agent.includes('iPad')
  )
}

export function calcBaseRem () {
  let docEl = document.documentElement
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let recalc = null
  if (isMobile()) {
    recalc = function () {
      let clientWidth = docEl.clientWidth
      console.log(clientWidth)
      let clientHight = docEl.clientHeight
      console.log(clientHight)
      let width = Math.min(clientWidth, clientHight)
      if (typeof clientWidth === 'undefined') return
      docEl.style.fontSize = width / 10 + 'px'
      console.log(width / 10)
    }
  } else {
    recalc = function () {
      let clientWidth = docEl.clientWidth
      if (clientWidth === undefined) return
      if (clientWidth <= 720) {
        docEl.style.fontSize = '18px'
      } else if (clientWidth > 720 && clientWidth <= 1200) {
        docEl.style.fontSize = '16px'
      } else {
        docEl.style.fontSize = '14px'
      }
    }
  }

  if (!document.addEventListener) return
  window.addEventListener(resizeEvt, recalc, false)
  window.document.addEventListener('DOMContentLoaded', recalc, false)
}

/**
 *  时间格式化
 * @param {date: 时间, format: 格式}
 */
export function dateFormat ({ date = new Date(), format = 'yyyy-MM-dd' } = {}) {
  if (date instanceof Date) {
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return format
  } else {
    if (isDev()) {
      console.log('params error!')
    }
    return ''
  }
}

// 数字转化为3位一逗号
export function splitNum (num) {
  if (!num) return 0
  let str = String(num)
  let str2 = str.replace(reg.numCut, ',')
  return str2
}
// 转化为两位数字
export function twoBit (num) {
  let str = ''
  if (num < 10) {
    str = '0' + num
  } else {
    str += num
  }
  return str
}

export function getArrMaxVal (arr) {
  if (!(arr instanceof Array)) {
    throw new Error('params must be a Array')
  }
  var isNum = arr.every(item => typeof item === 'number')
  if (!isNum) {
    throw new Error('params array all member must be number')
  }
  return Math.max.apply(Math, arr)
}

export function getArrSum (arr, key) {
  if (!(arr instanceof Array)) {
    throw new Error('params must be a Array')
  }
  if (typeof arr[0] === 'number') {
    return arr.reduce((prev, curr) => {
      return prev + curr
    })
  } else if (typeof arr[0] === 'object' && key) {
    let sum = 0
    arr.reduce((prev, curr) => {
      sum += curr[key] || 0
      return { [key]: prev[key] + curr[key] }
    }, { [key]: 0 })
    return sum
  }
}

// 开发环境判断
export function isDev () {
  return process.env.NODE_ENV === 'development'
}

// 生产环境判断
export function isProd () {
  return process.env.NODE_ENV === 'production'
}

// 测试环境判断
export function isTest () {
  return process.env.NODE_ENV === 'test'
}

export function uuid () {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  var radix = chars.length

  // Compact form
  for (i = 0; i < 32; i++) uuid[i] = chars[0 | Math.random() * radix]
  return uuid.join('')
}

export function parseQueryString (url) {
  const ret = {}
  const search = decodeURIComponent(url).split('?')[1]
  if (!search) {
    return ret
  }
  var regPara = /([^&=]+)=([\w\W]*?)(?:&|#|$)/g
  var arrUrl
  while ((arrUrl = regPara.exec(search)) != null) {
    // console.log(arrUrl)
    ret[arrUrl[1]] = arrUrl[2]
  }
  return ret
}

export default utils
