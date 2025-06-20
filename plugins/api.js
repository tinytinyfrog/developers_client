import cookieUtils from '@/lib/cookie-utils'
import globalConfig from '../global'
import { api } from '~/api/index.js'
const https = require('https')

export default ({ $axios, req, $cookies }, inject) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  })

  $axios.onRequest((config) => {
    if (process.server && globalConfig.singleServer) {
      config.baseURL = `${globalConfig.singleServer}${globalConfig.basePath}`
      console.log('****singleServer****:', config.baseURL)
    }
    config.httpsAgent = agent
    console.log(cookieUtils.getToken(req), 'token---------->', new Date())
    config.headers.common.Token = cookieUtils.getToken(req)
    if (config.method === 'get') {
      // 获取当前时间的时间戳
      const timestamp = new Date().getTime()
      // 将时间戳添加到URL的查询参数中
      config.url += (config.url.includes('?') ? '&' : '?') + `_t=${timestamp}`
    }
  })
  inject('api', api($axios))
}
