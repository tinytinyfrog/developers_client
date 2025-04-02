<template>
  <div class="simple-rich-editor">
    <div ref="rickEditor" />
  </div>
</template>
<script>
import hljs from 'highlight.js'
import cookieUtils from '@/lib/cookie-utils'
export default {
  name: 'SimpleRichEditor',
  props: {
    htmlContent: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: 250
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
    const editor = new WangEditor(this.$refs.rickEditor)
    editor.config.menus = [
      'head',
      'bold',
      'foreColor',
      'fontSize',
      'fontName',
      'italic',
      'indent',
      'justify',
      'underline',
      'lineHeight',
      'foreColor',
      'list'
    ]
    editor.config.fontSizes = {
      'x-small': { name: '12px', value: '1' },
      small: { name: '13px', value: '2' },
      normal: { name: '14px', value: '3' },
      large: { name: '15px', value: '4' },
      'x-large': { name: '16px', value: '5' },
      'xx-large': { name: '18px', value: '6' },
      'xxx-large': { name: '20px', value: '7' }
    }
    editor.config.lineHeights = ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.8', '2.0', '2.5', '3.0']
    editor.config.colors = ['#000000', '#333', '#666', '#808080', '#999', 'red', '#FFA500', '#004fc4']
    editor.config.height = this.height

    // 代码高亮
    editor.highlight = hljs
    editor.config.onchange = function (newHtml) {
      _this.$emit('on-change', newHtml)
    }
    editor.config.uploadFileName = 'file'
    editor.config.uploadImgServer = `${this.$global.developerServer}/developers-server/rest/file/image/upload-wang-editor`
    editor.config.uploadImgHeaders = {
      Token: cookieUtils.getToken()
    }
    editor.create()
    editor.txt.append(this.htmlContent)
    this.editor = editor
  }
}
</script>

<style lang="less" scoped>
  .simple-rich-editor {
    z-index: 1;
    background-color: #fff;
    /deep/.w-e-text {
      padding-top: 10px !important;
    }
    /deep/.w-e-text p{
      font-size: 14px !important;
      color: @font-color-first !important;
      margin: 0 !important;
    }
    /deep/.w-e-toolbar {
      z-index: 3 !important;
    }
    /deep/.w-e-menu {
      z-index: 4;
    }
    /deep/.w-e-text-container {
      z-index: 2 !important;
    }
  }
</style>
