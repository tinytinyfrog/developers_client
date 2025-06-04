import Vue from 'vue'
import cookieUtils from '@/lib/cookie-utils'
// import EventBus from '../lib/event-bus'
window._gAuthEvents = []
Vue.directive('auth', (el, binding) => {
  try {
    const monitorFunc = function (e) {
      const { url, handler = () => {}, noLoginCallback = () => {}, stopPrevent = false } = binding.value
      const tk = cookieUtils.getToken()
      if (!tk) {
        e.preventDefault()
        e.stopPropagation()
        const userAgent = navigator.userAgent
        const isMiniProgram = /miniProgram/gi.test(userAgent)
        if (!isMiniProgram) {
        //  EventBus.$emit('GLOGIN')
          Vue.prototype.$message.info('请先登录！')
        } else {
          Vue.prototype.$message.info('微信小程序暂不支持登录')
        }
        if (noLoginCallback) noLoginCallback()
        return
      }
      if (stopPrevent) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (url) { window.open(url, '_blank') }
      if (handler) handler()
    }
    window._gAuthEvents.push(monitorFunc)
    const lastIndex = window._gAuthEvents.length - 1
    el.setAttribute('onclick', `_gAuthEvents[${lastIndex}](event)`)
  } catch (e) {
    console.log(e)
  }
})
