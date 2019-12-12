import qs from 'qs'
import { toArray, hasOwn } from '@/utils'

export function getParams (url) {
  if (!url) return {}
  let search = url.split('?')[1]
  return qs.parse(search)
}

export function getData (str) {
  if (!str) return {}
  return JSON.parse(str)
}

export function getReqUrl (url) {
  return url.split('/saas')[1]
}

export function validateParams (params) {
  return function () {
    let args = toArray(arguments)
    if (args.length === 0) {
      return false
    }
    return args.every(item => (hasOwn(params, item) && hasValue(params[item])))
  }
}

export function hasValue (val) {
  return val != null && val !== ''
}

export function validateGetParams (config, ...args) {
  let params = getParams(config.url)
  let func = validateParams(params)
  let validate = func.apply(this, args)
  if (!validate) {
    console.log(params)
    throw new Error(getReqUrl(config.url) + '\n请求参数错误')
  }
}

export function validatePostParams (config, ...args) {
  let data = getData(config.body)
  let func = validateParams(data)
  let validate = func.apply(this, args)
  if (!validate) {
    console.log(data)
    throw new Error(getReqUrl(config.url) + '\n请求参数错误')
  }
}
