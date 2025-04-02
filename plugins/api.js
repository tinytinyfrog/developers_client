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
    config.headers.common.Token = cookieUtils.getToken(req)
  })
  inject('api', api($axios))
}
