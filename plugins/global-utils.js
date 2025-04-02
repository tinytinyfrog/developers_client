import globalConfig from '../global'

export const utils = {
  // 跳转个人中心
  openUserCenter: (id) => {
    window.open(`/user/${id}`, '_blank')
  },
  // 打开新窗口
  openNewWindow: (url, title = '') => {
    const userAgent = navigator.userAgent
    const isMiniProgram = /miniProgram/gi.test(userAgent)
    // const isWeChat = /MicroMessenger/gi.test(ua)
    // eslint-disable-next-line no-undef
    if (isMiniProgram) {
      utils.openNewMiniProgramView(url, title)
    } else {
      window.open(url, '_blank')
    }
  },
  openNewMiniProgramView: (url, title) => {
    // eslint-disable-next-line no-undef
    if (window.wx && wx.miniProgram) {
      // eslint-disable-next-line no-undef
      wx.miniProgram.navigateTo({
        url: `/pages/new-web-view/index?url=${globalConfig.developerServer}${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      })
    }
  },
  openWxOauth: (scene, url) => {
    // eslint-disable-next-line no-undef
    if (wx && wx.miniProgram) {
      // eslint-disable-next-line no-undef
      wx.miniProgram.redirectTo({
        url: `/pages/oauth/index?scene=${scene}&url=${globalConfig.developerServer}${encodeURIComponent(url)}`
      })
    }
  }
}

export default ({ req }, inject) => {
  inject('utils', utils)
}
