<template>
  <div id="byte-viewer-container" class="byte-viewer-container">
    <Viewer v-if="markdownContent" :plugins="plugins" :value="markdownContent" />
  </div>
</template>

<script>
import { Viewer } from '@bytemd/vue'
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
import copy from 'copy-to-clipboard'
export default {
  name: 'ByteViewer',
  components: {
    Viewer
  },
  props: {
    markdownContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
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
      ]
    }
  },
  mounted () {
    this.insertCopyBtn()
  },
  methods: {
    insertCopyBtn () {
      try {
        const preList = document.getElementsByClassName('markdown-body')[0].getElementsByTagName('pre')
        for (let i = 0; i < preList.length; i++) {
          const copyBtn = document.createElement('span')
          copyBtn.setAttribute('class', 'copy-code-btn')
          const text = document.createTextNode('复制')
          copyBtn.appendChild(text)
          copyBtn.addEventListener('click', () => {
            if (copy(preList[i].firstChild.textContent)) {
              this.$message.success({
                duration: 1,
                content: '复制成功'
              })
            }
          })
          preList[i].appendChild(copyBtn)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less">
.byte-viewer-container {
  @import '../byte-markdown-editor/theme.less';
}
</style>
