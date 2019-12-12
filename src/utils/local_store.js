
export class Store {
  constructor () {
    this.checkBrows()
  }
  getSession (key) {
    if (typeof key !== 'string') {
      throw new Error('params must be string')
    }
    let val = this.getItem(key)
    if (val === null) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`no exist such ${key} sessionStorage`)
      }
      return null
    }
    let parseVal
    try {
      parseVal = JSON.parse(val)
      parseVal = this.checkStr(parseVal)
    } catch (err) {
      if (err.message.includes('JSON')) {
        return val
      }
    }
    return parseVal
  }

  getLocal (key) {
    if (typeof key !== 'string') {
      throw new Error('params must be string')
    }
    let val = this.getItem(key, 2)
    if (val === null) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`no exist such ${key} localStorage`)
      }
      return null
    }
    let parseVal
    try {
      parseVal = JSON.parse(val)
      parseVal = this.checkStr(parseVal)
    } catch (err) {
      if (err.message.includes('JSON')) {
        return val
      }
    }
    return parseVal
  }

  setSession (key, val) {
    this.setItem(key, val)
  }

  setLocal (key, val) {
    this.setItem(key, val, 2)
  }

  removeSession (key) {
    this.removeItem(key)
  }

  removeLocal (key) {
    this.removeItem(key, 2)
  }

  removeAllSession () {
    this.removeAll()
  }

  removeAllLocal () {
    this.removeAll(2)
  }

  removeAllStorage () {
    this.removeAll(3)
  }

  getItem (key, lx = 1) {
    let val
    if (lx === 1) {
      val = window.sessionStorage.getItem(key)
    } else if (lx === 2) {
      val = window.localStorage.getItem(key)
    }
    return val
  }

  setItem (key, val, lx = 1) {
    if (typeof key !== 'string') {
      throw new Error('Items key params must be string')
    }
    if (typeof val === 'undefined') {
      throw new Error('set value is not defind')
    }
    if (typeof val === 'object') {
      val = JSON.stringify(val)
    } else if (typeof val === 'string') {
      val = JSON.stringify({ str: val, isString2Object: true })
    }
    if (lx === 1) {
      window.sessionStorage.setItem(key, val)
    } else {
      window.localStorage.setItem(key, val)
    }
  }

  removeItem (key, lx = 1) {
    if (typeof key !== 'string') {
      throw new Error('Items key params must be string')
    }
    if (lx === 1 && window.sessionStorage.hasOwnProperty(key)) {
      window.sessionStorage.removeItem(key)
    } else if (lx === 2 && window.localStorage.hasOwnProperty(key)) {
      window.localStorage.removeItem(key)
    }
  }

  removeAll (lx = 1) {
    if (lx === 1) {
      window.sessionStorage.clear()
    } else if (lx === 2) {
      window.localStorage.clear()
    } else if (lx === 3) {
      window.sessionStorage.clear()
      window.localStorage.clear()
    } else {
      throw new Error('param error, param must be one of 1,2,3')
    }
  }
  checkBrows () {
    if (!window.sessionStorage || !window.localStorage) {
      throw new Error('浏览器不支持本地存储')
    }
  }
  checkStr (obj) {
    let target = obj
    if (this.checkedType(target) === 'Object') {
      if (target.hasOwnProperty('isString2Object') && target.isString2Object) {
        target = target.str
      }
    }
    return target
  }
  checkedType (target) {
    return Object.prototype.toString.call(target).slice(8, -1)
  }
}
