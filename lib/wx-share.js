export const setWxShare = ({ title = '开发者客栈', link = 'https://www.developers.pub', imgUrl = 'https://static.developers.pub/50b531e95e224027adefa8e1d3e50fc7', desc = '一个帮助开发者面试的平台。开发者客栈集成各类面试经验分享和面试题专业解答、一线互联网公司内推等多功能多元化平台,致力于构建一个专业度高、知识共享、内容丰富的有爱社区' }) => {
  console.log(title, link, imgUrl, desc)
  window.wx.updateTimelineShareData({
    title, // 分享标题
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success () {
      console.log(1)
      // 用户确认分享后执行的回调函数
    },
    cancel () {
      console.log(1.1)
      // 用户取消分享后执行的回调函数
    }
  })
  window.wx.onMenuShareTimeline({
    title, // 分享标题
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success () {
      console.log(2)
      // 用户确认分享后执行的回调函数
    },
    cancel () {
      console.log(2.2)
      // 用户取消分享后执行的回调函数
    }
  })
  window.wx.updateAppMessageShareData({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success () {
      console.log(3)
      // 用户确认分享后执行的回调函数
    },
    cancel () {
      console.log(3.3)
      // 用户取消分享后执行的回调函数
    }
  })
  window.wx.onMenuShareAppMessage({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl, // 分享图标
    success () {
      console.log(4)
      // 用户确认分享后执行的回调函数
    },
    cancel () {
      console.log(4.4)
      // 用户取消分享后执行的回调函数
    }
  })
  // 暂时无用
  if (window.wx && window.wx.miniProgram) {
    window.wx.miniProgram.postMessage({ data: { title, path: 'pages/index/index', imageUrl: imgUrl } })
  }
}
