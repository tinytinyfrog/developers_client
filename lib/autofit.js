// 原生等比缩放，等同 autofit.js 主流实现
// 用法：import autofit from '@/lib/autofit'; autofit.init('login-container', 1920, 1080, 'left top')

const autofit = {
  _resizeHandler: null,
  init (domId = 'login-container', designWidth = 1920, designHeight = 1080, origin = 'left top') {
    function resize () {
      const dom = document.getElementById(domId)
      if (!dom) return
      const scaleX = window.innerWidth / designWidth
      const scaleY = window.innerHeight / designHeight
      const scale = Math.min(scaleX, scaleY)
      dom.style.width = designWidth + 'px'
      dom.style.height = designHeight + 'px'
      dom.style.transform = `scale(${scale})`
      dom.style.transformOrigin = origin
      dom.style.position = 'absolute'
      dom.style.left = '0'
      dom.style.top = '0'
      dom.style.right = 'auto'
      dom.style.bottom = 'auto'
      dom.style.margin = '0'
      dom.style.zIndex = '1'
      dom.style.display = 'block'
      dom.style.transition = '' // 无动画
      dom.style.opacity = '1' // 缩放后显示
    }
    resize()
    autofit._resizeHandler = resize
    window.addEventListener('resize', autofit._resizeHandler)
  },
  off () {
    if (autofit._resizeHandler) {
      window.removeEventListener('resize', autofit._resizeHandler)
      autofit._resizeHandler = null
    }
  }
}

export default autofit
