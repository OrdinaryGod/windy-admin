/** 
 * 统一 api 管理
 * version: 1.0.0
 */
import axios from "axios";
import qs from "qs";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { serverConf } from "../config/serverconf";
import { message } from "antd";
import { getToken } from '../utils/auth'
import CommonStore from '../store/common.Store'
 
 // 开发中应逐步补充
 type HttpResCode =
   | 200 // success
   | 201 // success
   | 304 // success
   | 301 // success
   | 404 //
   | 403 //
   | 402 //
   | 401 //
   | 1001 // Invalid token
   | 4001 // wt ?
   | 4004 // wt ?
   | 500103 // 首次登录
   | 500104 // 到设定期限未修改密码
   | 500107 // 未绑定手机
   | 500108 // 开启双因素验证
 
export type HttpRes<R, C = HttpResCode> = [err: null, res: R, code: C] | [err: string, res: R | null, code: C] // 兼容 code 非 200 时 data 可用，实属接口不规范
 
 type HttpResRaw<D = unknown> = {
   msg: string
   data: D
   code: HttpResCode
 } | Blob | string
 
 interface HttpInstance extends AxiosInstance {
   request<T, R = HttpRes<T>, D = unknown> (config: AxiosRequestConfig<D>): Promise<R>
   get<T, R = HttpRes<T>, D = unknown> (url: string, config?: AxiosRequestConfig<D>): Promise<R>
   delete<T, R = HttpRes<T>, D = unknown> (url: string, config?: AxiosRequestConfig<D>): Promise<R>
   head<T, R = HttpRes<T>, D = unknown> (url: string, config?: AxiosRequestConfig<D>): Promise<R>
   options<T, R = HttpRes<T>, D = unknown> (url: string, config?: AxiosRequestConfig<D>): Promise<R>
   post<T, R = HttpRes<T>, D = unknown> (url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
   put<T, R = HttpRes<T>, D = unknown> (url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
   patch<T, R = HttpRes<T>, D = unknown> (url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
   fork: typeof createHttp
 }
 
 type RequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig
 type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse
 
const config: AxiosRequestConfig = {
  transformRequest: [
    (data, headers) => {
      if (headers!['Content-Type'] === 'application/json') {
        return JSON.stringify(data)
      }
      return qs.stringify(data)
    },
  ],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 120000,
}
 
export const http: HttpInstance = createHttp(config)
 
/**
  * 创建带有预设参数的 axios http 实例。
  * 注意：拦截器是按注册顺序执行的
  * @param config 同 axios.create 方法参数
  * @param requestInterceptors 请求拦截器
  * @param responseInterceptors 响应拦截器
  */
function createHttp (
  config?: AxiosRequestConfig,
  requestInterceptors?: RequestInterceptor[],
  responseInterceptors?: ResponseInterceptor[],
): HttpInstance {
  const http = axios.create({
    baseURL: serverConf.api,
    ...config,
    timeout: 120000,
  })
   
     ;[setRequestCredentials]
    .concat(requestInterceptors || [])
    .forEach(intcp => http.interceptors.request.use(intcp))
   
  ;[printResponseWarning, useOnTokenExpired]
    .concat(responseInterceptors || [])
    .forEach(intcp => http.interceptors.response.use(intcp))
   
  // 此拦截器会改变响应体，拦截后仅返回接口数据
  // 因此要在最后注册！
  http.interceptors.response.use(transformResponse)
   
  Object.assign(http, { fork: createHttp }) // 扩展用
   
  return http as HttpInstance
}
 
/**
  * 请求拦截器。
  * 在请求发出时，设置凭证信息，如 token
  */
function setRequestCredentials (config: AxiosRequestConfig): AxiosRequestConfig {
  const token = getToken()
   
  if (!config.headers) {
    config.headers = {}
  }
   
  if (token) {
    config.headers['WIN-TOKEN'] = token
  }
   
  return config
}
   
/**
    * 响应拦截器。
    * 当请求的响应值存在风险时，在控制台打印出数据明细，
    * 以方便开发者调试，同时弹窗显示返回的错误消息。
    */
function printResponseWarning (response: AxiosResponse): AxiosResponse {
  const { method, url, headers } = response.config
  const { code, msg, data } = resolveData(response)
  const SUCCESS = Number(code) === 200
  const request = getRequest(response.config)
   
  // 错误警告 或者 data 为 null 警告
  if (!SUCCESS || (SUCCESS && data == null)) {
    warn(code, msg || 'No Data!', method, url, request, data)
  }
   
  // 错误弹窗，可通过特定的 header 配置禁用
  if (!SUCCESS && !headers?.['x-suppress-warning']) {
    message.warning(msg)
  }
   
  return response
}
 
/**
  * 响应拦截器。
  * 在 token 失效后执行一些操作
  */
function useOnTokenExpired (response: AxiosResponse): AxiosResponse {
  const commonStore = new CommonStore()
  if (resolveData(response).code === 1001) {
    commonStore.clearPermission()
  }
   
  return response
}
 
/**
  * 转换响应值为 `error first` 的形式
  */
function transformResponse (response: AxiosResponse<HttpResRaw>): HttpRes<unknown> {
  const { code, msg, data } = resolveData(response)
  const error = (code < 200 || code >= 300) ? msg : null
  return [error, data, code as HttpResCode]
}
   
/**
    * 解析 axios response.
    * 返回 `msg` `code` `data` 字段
    */
function resolveData (response: AxiosResponse<HttpResRaw>) {
  if (response.data instanceof Blob || typeof response.data === 'string') {
    return {
      code: response.status,
      msg: response.statusText,
      data: response.data,
    }
  }
   
  // hack: 兼容不规范的状态码
  if (typeof response.data.code === 'string') {
    response.data.code = Number(response.data.code) as HttpResCode
    console.error('后端接口返回状态码不规范！code 是字符串' + `'${response.data.code}'`)
  }
   
  return response.data
}
 
/**
  * 控制台输出警告
  */
function warn (code: number, msg: string, method = '', url = '', req: unknown, res: unknown) {
  console.group(`%c ${code} %c ${msg} `, 'color:yellow; background: black', 'background: yellow; color: red')
  console.log(`%c ${method?.toUpperCase()} %c ${url} `, 'background: green; color: white', 'background: #eeecda')
  console.log('%c req ', 'background: grey; color: white', req)
  console.log('%c res ', 'background: black; color: white', res)
  console.groupEnd()
}
   
/**
  * 解析请求体、响应体
  */
function getRequest (config: AxiosRequestConfig) {
  // 剔除对象 __proto__ 展开对象时结构更清晰
  const bare = <O> (obj: O): O => {
    if (obj && typeof obj == 'object') {
      let bareObj = Object.create(null)
      if (Array.isArray(obj)) {
        bareObj = obj.map(bare)
        bareObj.__proto__ = null
      } else {
        for (const k in obj) {
          bareObj[k] = bare(obj[k])
        }
      }
      return bareObj
    }
    return obj
  }
   
  const getFormData = (formData: FormData) => {
    const keys = [...formData.keys()]
    return keys.reduce((obj, k) => {
      return { ...obj, [k]: formData.get(k) }
    }, bare({}))
  }
   
  const request: { query?: unknown, body?: unknown } = bare({})
   
  if (config.params) {
    request.query = bare(config.params)
  }
   
  if (config.data) {
    const { data, headers } = config
    const body = data instanceof FormData
      ? getFormData(data)
      : headers?.['Content-Type'] === 'application/x-www-form-urlencoded'
        ? qs.parse(data)
        : JSON.parse(data)
   
    request.body = bare(body)
  }
   
  return request
}
 
   
export default http