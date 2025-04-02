import Vue from 'vue'
const options = {
  root: null, // 默认浏览器视窗
  threshold: 1 // 元素完全出现在浏览器视窗内才执行callback函数。
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target && entry.isIntersecting) {
      const el = entry.target
      const binding = el.binding
      console.log('binding:', binding)
      if (binding.value.handler) {
        binding.value.handler()
      }
    }
  })
}, options)
const addListenner = (ele, binding) => {
  ele.binding = binding
  observer.observe(ele)
}
const removeListener = (ele) => {
  observer.unobserve(ele)
}
// 自定义曝光指令
Vue.directive('exposure', {
  bind: addListenner,
  unbind: removeListener
})
