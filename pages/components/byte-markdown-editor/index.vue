<template>
  <div id="library-markdown-editor" class="byte-markdown-editor-container">
    <Editor
      :value="value"
      :plugins="plugins"
      :locale="locale"
      :editor-config="editorConfig"
      :upload-images="uploadImages"
      placeholder="请输入正文"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { Editor } from '@bytemd/vue'
import highlight from '@bytemd/plugin-highlight-ssr'
import mermaid from '@bytemd/plugin-mermaid'
import mermaidLocales from '@bytemd/plugin-mermaid/lib/locales/zh_Hans.json'
import frontmatter from '@bytemd/plugin-frontmatter'
import gfm from '@bytemd/plugin-gfm'
import gmfLocales from '@bytemd/plugin-gfm/lib/locales/zh_Hans.json'
import zoom from '@bytemd/plugin-medium-zoom'
import breaks from '@bytemd/plugin-breaks'
import footnotes from '@bytemd/plugin-footnotes'
import gemoji from '@bytemd/plugin-gemoji'
import math from '@bytemd/plugin-math-ssr'
import mathLocales from '@bytemd/plugin-math-ssr/lib/locales/zh_Hans.json'
import zhHans from 'bytemd/lib/locales/zh_Hans.json'
export default {
  name: 'ByteMarkdownEditorVue',
  components: {
    Editor
  },
  props: {
    markdownContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: this.markdownContent,
      locale: zhHans,
      plugins: [
        breaks(),
        highlight(),
        mermaid({
          locale: mermaidLocales
        }),
        frontmatter(),
        gfm({
          locale: gmfLocales
        }),
        zoom(),
        footnotes(),
        gemoji(),
        math({
          locale: mathLocales
        })
      ],
      editorConfig: {
        tabSize: 2,
        indentUnit: 4,
        height: '300px'
      }
    }
  },
  watch: {
    markdownContent (val) {
      this.value = val
    }
  },
  methods: {
    async uploadImages (files) {
      const data = new FormData()
      data.append('file', files[0])
      return await this.$api.uploadImageByArticle(data)
    },
    handleChange (val) {
      this.value = val
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="less">
.byte-markdown-editor-container {
  .bytemd {
    border: 0;
    height: calc(100vh - 60px);
    min-height: 300px;
    z-index: 101;
  }
  .bytemd-toolbar {
    border-top: 0;
    height: 34px;
    border-bottom: 1px solid @border-3-color !important;
  }
  .bytemd-mermaid {
    text-align: center;
  }
  .bytemd-preview {
    border-left: 1px solid @border-3-color !important;
  }
  .bytemd-status {
    display: none;
  }
  @import './theme.less';
}
</style>
