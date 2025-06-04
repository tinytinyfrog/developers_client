import articleApi from './modules/article'
import questionApi from './modules/question'
import userApi from './modules/user'
import tagApi from './modules/tag'
import collectApi from './modules/collect'
import commonApi from './modules/common'
import messageApi from './modules/message'
import wikiApi from './modules/wiki'
import infoApi from './modules/info'
import platformApi from './modules/platform'

export const api = function ($axios) {
  // $axios.setHeader('Token', jsCookie.get('__dp_tk__'))
  return {
    ...articleApi($axios),
    ...questionApi($axios),
    ...userApi($axios),
    ...tagApi($axios),
    ...collectApi($axios),
    ...commonApi($axios),
    ...messageApi($axios),
    ...wikiApi($axios),
    ...infoApi($axios),
    ...platformApi($axios)
  }
}
