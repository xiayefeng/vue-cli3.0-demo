import { Message, Loading } from 'element-ui'
import { hasOwn } from './index'

let loadingInstance = null

// 'element-ui' 错误提示二次封装
export function toastError ({
  message,
  type = 'error',
  duration = 3000,
  showClose = false
} = {}) {
  Message({
    message,
    type,
    duration,
    showClose
  })
}

// 根据身份证号获取性别
export function getSex (idCard) {
  let sex = ''
  if (idCard.length === 18) {
    // 18位身份证号
    sex = idCard.substr(-2, 1) // 第17位数字
  } else if (idCard.length === 15) {
    // 15位身份证号
    sex = idCard.substr(-1) // 最后一位数字
  } else {
    return ''
  }
  return sex % 2 === 0 ? 2 : 1 // 性别：奇数为男,偶数为女
}

// 获取生日
export function getBirthday (idCard) {
  let y = ''
  let m = ''
  let d = ''
  if (idCard.length === 18) {
    // 18位身份证号
    y = idCard.substring(6, 10)
    m = idCard.substring(10, 12)
    d = idCard.substring(12, 14)
  } else if (idCard.length === 15) {
    // 15位身份证号
    y = '19' + idCard.substring(6, 8)
    m = idCard.substring(8, 10)
    d = idCard.substring(10, 12)
  } else {
    return ''
  }
  return `${y}-${m}-${d}`
}

/**
 *
 * @param {number} day 星期数返回星期几 例如 0 -> '日'
 */
export function getWeek (day) {
  if (typeof day === 'undefined') {
    return ''
  }
  let dayArr = ['日', '一', '二', '三', '四', '五', '六']
  if (hasOwn(dayArr, day)) {
    return dayArr[day]
  } else {
    return ''
  }
}

// 打开加载遮罩层
export function openLoading () {
  loadingInstance = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

// 关闭加载遮罩层
export function closeLoading () {
  setTimeout(() => {
    loadingInstance && loadingInstance.close()
    loadingInstance = null
  }, 200)
}

export function toFullScreen (el) {
  if (el.requestFullscreen) {
    return el.requestFullscreen()
  } else if (el.webkitRequestFullScreen) {
    return el.webkitRequestFullScreen()
  } else if (el.mozRequestFullScreen) {
    return el.mozRequestFullScreen()
  } else if (el.msRequestFullScreen) {
    return el.msRequestFullScreen()
  } else {
    return false
  }
}

export function exitFullScreen () {
  if (document.fullscreenElement) {
    return document.exitFullscreen()
  } else if (document.webkitFullscreenElement) {
    return document.webkitExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen()
  } else {
    return false
  }
}

// 引入xlsx依赖
export function writeXLSX () {
  if (!window.XLSX) {
    // var script = document.createElement('script')
    // script.src = '/static/js/xlsx.full-0.15.1.min.js'
    let url = '/static/js/xlsx.full-0.15.1.min.js'
    let script = addScript(url)
    // document.body.appendChild(script)
    script.onload = () => {
      // console.log('script onload')
      document.body.removeChild(script)
    }
  }
}

function addScript (url) {
  var script = document.createElement('script')
  script.src = url
  document.body.appendChild(script)
  return script
}

export function getScrollWidth () {
  var noScroll
  var scroll
  var oDiv = document.createElement('DIV')
  oDiv.style.cssText =
    'position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;'
  noScroll = document.body.appendChild(oDiv).clientWidth
  oDiv.style.overflowY = 'scroll'
  scroll = oDiv.clientWidth
  document.body.removeChild(oDiv)
  return noScroll - scroll
}
