<template>
  <div id="library-rich-editor" class="common-rich-editor">
    <div ref="richEditor" class="rick-container" />
  </div>
</template>
<script>
import hljs from 'highlight.js'
import cookieUtils from '@/lib/cookie-utils'
export default {
  name: 'RichEditor',
  props: {
    htmlContent: {
      type: String,
      default: '<p data-we-empty-p=""><br></p>'
    },
    change: {
      type: Function,
      default: () => ({})
    }
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    /**
     * https://doc.wangeditor.com/
     * */
    const _this = this
    const WangEditor = require('wangeditor')
    const editor = new WangEditor(this.$refs.richEditor)
    // 代码高亮
    editor.highlight = hljs
    editor.config.onchange = function (newHtml) {
      _this.$emit('change', newHtml)
    }
    editor.config.uploadFileName = 'file'
    editor.config.uploadImgServer = `${this.$global.developerServer}/developers-server/rest/file/image/upload-wang-editor`
    editor.config.uploadImgHeaders = {
      Token: cookieUtils.getToken()
    }
    // 配置颜色（文字颜色、背景色）
    editor.config.colors = [
      '#f8f8f9',
      '#e8eaec',
      '#dcdee2',
      '#c5c8ce',
      '#808695',
      '#515a6e',
      '#17233d',
      '#000000',
      '#ed4014',
      '#ff9900',
      '#19be6b',
      '#2db7f5',
      '#2b85e4',
      '#5cadff',
      '#2d8cf0',
      '#EB71F3'
    ]
    editor.create()
    editor.txt.append(this.htmlContent)
    this.editor = editor
  }
}
</script>

<style lang="less">
  @import '../byte-markdown-editor/theme.less';
  .common-rich-editor{
    .w-e-toolbar {
      border: 0 !important;
      z-index: 2 !important;
      background-color: #fbfbfb !important;
      border-bottom: 1px solid @border-3-color !important;
    }
    .w-e-toolbar .w-e-menu i {
      color: @font-color-first;
    }
    .w-e-menu {
      width: 39px;
      height: 33px !important;
    }
    .w-e-menu .w-e-panel-container {
      box-shadow: none !important;
      border: 1px solid @border-3-color;
      .w-e-panel-tab-content textarea, select {
        border: 1px solid @border-3-color;
      }
    }
    .w-e-panel-container {
      width: 600px !important;
    }
    .w-e-text-container {
      min-height: calc(100vh - 92px) !important;
      border: 0 !important;
      z-index: 1 !important;
    }
  }
</style>
