import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  // baseURL: 'http://192.168.2.11:8080',
  baseURL: 'http://124.220.206.34:8080',
  timeout: 5000
})

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let requests: Array<any> = []

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 刷新token的函数
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    const { data } = await axios.post('/user/refresh', { refreshToken })
    if (data.success) {
      localStorage.setItem('token', data.result.accessToken)
      localStorage.setItem('refreshToken', data.result.refreshToken)
      return data.result.accessToken
    }
    return null
  } catch (error) {
    return null
  }
}

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (error.response) {
      const { config, response } = error
      
      if (response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true
          const newToken = await refreshToken()
          isRefreshing = false
          
          if (newToken) {
            // 重新发送队列中的请求
            requests.forEach(cb => cb(newToken))
            requests = []
            
            // 重试当前请求
            config.headers['Authorization'] = `Bearer ${newToken}`
            return request(config)
          } else {
            // 刷新token失败，清除用户信息并跳转到登录页
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            router.push('/login')
            message.error('登录已过期，请重新登录')
          }
        } else {
          // 正在刷新token，将请求加入队列
          return new Promise(resolve => {
            requests.push((token: string) => {
              config.headers['Authorization'] = `Bearer ${token}`
              resolve(request(config))
            })
          })
        }
      } else if (response.status === 403) {
        message.error('没有权限访问')
      } else if (response.status === 404) {
        message.error('请求的资源不存在')
      } else if (response.status === 500) {
        message.error('服务器错误')
      } else {
        message.error(response.data.message || '请求失败')
      }
    }
    return Promise.reject(error)
  }
)

export default request 