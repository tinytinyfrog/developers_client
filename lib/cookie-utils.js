import jsCookie from 'js-cookie'
const TOKENKEY = '__dp_tk__'
export default {
  TOKENKEY,
  clearToken (options = {}) {
    jsCookie.remove(TOKENKEY, options)
  },
  setToken (token, options = {
    expires: 30
  }) {
    jsCookie.set(TOKENKEY, token, options)
  },
  getToken (req) {
    if (req) {
      return this.getCookie(req, TOKENKEY)
    }
    return jsCookie.get(TOKENKEY)
  },
  getCookie (req, key) {
    const strCookie = req.headers.cookie || ''
    const arrCookie = strCookie.split('; ')
    const cookie = arrCookie.find(item => item.split('=')[0] === key)
    return cookie ? cookie.split('=')[1] : ''
  }
}
