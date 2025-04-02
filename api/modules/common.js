/**
 * 公共
 * */
import _get from 'lodash/get'
const commonApi = ($axios) => {
  return {
    // SIDEBAR_CAROUSEL HOME_CAROUSEL
    getSchemeUrl (params) {
      return $axios.post('/rest/wx-mini/scheme-url', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    getWxMiniTicket () {
      return $axios.post('/rest/wx-account/jsapi-ticket', {}).then((res) => {
        return _get(res, 'data.data', '')
      })
    },
    getHtmlByUrl (url) {
      return $axios.get(`/dps-api/html2mdl?url=${encodeURIComponent(url)}`).then((res) => {
        return _get(res, 'data', null)
      })
    },
    /**
     * 首页轮播图
     * HOME_CAROUSEL("HOME_CAROUSEL", "首页轮播图")
     * 侧边栏轮播图
     * SIDEBAR_CAROUSEL("SIDEBAR_CAROUSEL", "侧边栏轮播图")
     */
    getBannerList (types) {
      return $axios.post('/rest/config/query-available', types).then((res) => {
        return _get(res, 'data', null)
      })
    }
  }
}

export default commonApi
