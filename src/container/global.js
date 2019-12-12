/**
 * 请求错误返回码 data.code
 */
export const msgCode = {
  success: '0', // 成功
  systemErr: '50003', // 系统异常
  paramErr: '40001', // 参数验证错误
  tokenTimeOut: '80001', // 认证错误
  authErr: '50001', // 授权错误(没有权限)
  businessErr: '50000' // 业务错误
}
