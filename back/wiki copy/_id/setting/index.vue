<template>
  <div class="page-wiki-setting">
    <a-tabs default-active-key="baseInfo">
      <a-tab-pane key="baseInfo" tab="基础信息">
        <div v-if="wiki" class="wiki-base-info">
          <div class="header-cover-img">
            <Cropper :screenshot-number="[4, 5]" @on-img="onImgChange">
              <img class="cover-img" :src="wiki.headImg" alt="avatar">
            </Cropper>
            <p class="wiki-cover-tips">
              知识库封面(点击修改)
            </p>
          </div>
          <div class="input-form">
            <div class="input-item">
              <span class="label">知识库名称：</span>
              <a-input v-model="wiki.name" placeholder="请输入知识库名称" :disabled="disabled" />
            </div>
            <div class="input-item">
              <span class="label">知识库名称：</span>
              <div class="category-tags-container">
                <div class="categories">
                  <span
                    v-for="(item, index) in categoryList"
                    :key="index"
                    class="tag-category"
                    :class="{'active-category': activeCategoryIndex === index}"
                    @click="activeCategoryIndex = index"
                  >{{ item.name }}</span>
                </div>
              </div>
            </div>
            <div class="input-item">
              <span class="label">知识库摘要：</span>
              <a-textarea
                v-model="wiki.summary"
                placeholder="请输入知识库摘要"
                :disabled="disabled"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </div>
            <div class="input-item">
              <span class="label">是否展示：</span>
              <a-checkbox v-model="wiki.show" :disabled="disabled" />
            </div>
            <div class="input-item submit-box">
              <a-space>
                <a-button type="danger" @click="delWiki">
                  删除
                </a-button>
                <a-button
                  :disabled="disabled"
                  class="submit-btn"
                  type="primary"
                  :loading="loading"
                  @click="onUpdateWiki"
                >
                  更新wiki
                </a-button>
              </a-space>
            </div>
          </div>
        </div>
        <h4 class="desc-title">
          其它信息<span class="g-sub-title">（更新日志等）</span>
        </h4>
        <ByteMarkdownEditor :markdown-content="markdownContent" @change="handleMarkdownChange" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="协作者" force-render>
        <UserList :wiki-id="wikiId" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="待审核提交" force-render>
        <PendingArticleList :wiki-id="wikiId" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Cropper from '@/pages/components/cropper'
import UserList from './components/user-list'
import PendingArticleList from './components/pending-article-list'
import ByteMarkdownEditor from '~/pages/components/byte-markdown-editor/index.vue'
export default {
  name: 'WikiSetting',
  components: {
    Cropper,
    UserList,
    PendingArticleList,
    ByteMarkdownEditor
  },
  async asyncData ({ route, $api }) {
    const wikiId = route.params.id
    const wiki = await $api.getWikiNodeListInfoById(wikiId)
    console.log()
    return {
      wiki,
      wikiId,
      markdownContent: wiki.desc
    }
  },
  data () {
    return {
      disabled: false,
      loading: false,
      activeCategoryIndex: -1,
      categoryList: []
    }
  },
  mounted () {
    this.getWikiCategoryList()
  },
  methods: {
    handleMarkdownChange (md) {
      this.markdownContent = md
    },
    delWiki () {
      this.$confirm({
        title: '确认要删除当前知识库吗？',
        content: h => <div style="color: #606a78;">警告：删除该知识库后，知识库下所有内容也将删除，清谨慎操作</div>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$api.delWiki(this.wikiId).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              setTimeout(() => {
                location.replace('/wiki')
              }, 2000)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    onImgChange (url) {
      this.headImg = url
      this.wiki.headImg = url
    },
    getWikiCategoryList () {
      this.$api.getWikiCategoryList().then((list) => {
        this.categoryList = list
        const categoryId = this.wiki.categoryId
        if (categoryId) {
          list.forEach((item, index) => {
            if (item.id === categoryId) this.activeCategoryIndex = index
          })
        }
      })
    },
    onUpdateWiki () {
      if (this.loading) return
      this.loading = true
      const { id, name, summary, headImg, show } = this.wiki
      const { categoryList, activeCategoryIndex } = this
      if (!name || !summary || activeCategoryIndex === -1) {
        this.$message.error('知识库名称、类别、摘要不能为空')
        this.loading = false
        return
      }
      this.$api.updateWiki({
        id,
        name,
        summary,
        headImg,
        show,
        desc: this.markdownContent,
        categoryId: categoryList[activeCategoryIndex].id
      }).then((res) => {
        this.loading = false
        if (res.success) {
          this.$message.success('更新成功')
          setTimeout(() => {
            location.reload()
          }, 1500)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~/pages/components/byte-markdown-editor/theme.less';
.page-wiki-setting {
  padding: @g-padding @g-padding * 2;
  .wiki-base-info {
    display: flex;
    border-bottom: 1px solid @border-3-color;
    .input-form {
      padding-right: @g-padding * 2;
      .input-item {
        display: flex;
        align-items: center;
        margin-top: @g-margin * 2;
        &:first-child {
          margin-top: 0;
        }
        .label {
          display: inline-block;
          width: 130px;
          min-width: 130px;
          text-align: right;
        }
        .ant-input {
          width: 350px;
        }
        .submit-btn {
          width: 350px;
          align-self: flex-end;
        }
      }
      .category-tags-container {
        background-color: #fff;
        font-size: @font-fourth;
        width: 100%;
        .categories {
          display: flex;
          align-items: center;
          margin: 0 auto;
          max-width: @max-width;
          .tag-category {
            cursor: pointer;
            color: @font-color-second;
            font-size: 15px;
            margin: 0 6px;
            padding: 3px 14px;
            word-break: keep-all;
            border: 1px solid @border-4-color;
            &:first-child {
              margin-left: 0;
            }
            &:last-child {
              border-bottom-width: 0
            }
            &:hover {
              color: @g-active-color;
              background-color: @g-bg-blue;
            }
          }
          .active-category {
            color: #fff;
            background-color: @g-main-color;
            font-weight: bold;
            border-radius: @g-radius;
            &:hover {
              background-color: @g-bg-blue;
            }
          }
        }
      }
      .submit-box {
        justify-content: flex-end;
      }
    }
    .header-cover-img {
      .cover-img {
        display: inline-block;
        width: 200px;
        height: 250px;
        cursor: pointer;
        border-radius: @g-radius;
        border: 1px solid @border-3-color;
      }
      .wiki-cover-tips {
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: @font-color-third;
        text-align: center;
      }
    }
  }
  .desc-title {
    padding: @g-padding * 2 0;
  }
}
</style>
