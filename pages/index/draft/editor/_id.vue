<template>
  <div class="page-library-mavon-add">
    <div class="library-base-info-box">
      <div class="base-info-item base-title">
        <div class="title-box">
          <span class="title">{{ titleMap[type] }}：</span>
          <input v-model="articleTitle" class="title-content" type="text" :placeholder="`请输入${titleMap[type]}`">
        </div>
        <div>
          <a-space>
            <ASwitch checked-children="markdown" un-checked-children="富文本" :default-checked="isMarkDown" @change="isMarkDown = !isMarkDown" />
            <a-dropdown v-if="draftList.length && type === 'article'">
              <a-menu slot="overlay" @click="handleMenuClick">
                <a-menu-item v-for="item in draftList" :key="item.id">
                  <a-tooltip placement="left">
                    <template slot="title">
                      删除该草稿
                    </template>
                    <a-icon type="delete" @click.stop.prevent="delDraft(item.id)" />
                  </a-tooltip>
                  <span> {{ item.title }}</span>
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                草稿 <a-icon type="down" />
              </a-button>
            </a-dropdown>
            <Button type="primary" ghost @click="onConfirmModal">
              发布
            </Button>
          </a-space>
        </div>
      </div>
    </div>
    <Modal
      v-model="confirmModal"
      :mask-closable="false"
      title="发布"
      width="530px"
      cancel-text="继续编辑"
      ok-text="确认发布"
      :dialog-style="{ right: '10px' }"
      destroy-on-close
      @ok="onPublish"
    >
      <div :style="Object.assign({}, categoryItemStyle, { alignItems: 'flex-start' })">
        <span :style="labelStyle"><span style="color: red;">*</span>选择分类：</span>
        <div :style="contentStyle">
          <span
            v-for="(item, index) in tagGroup"
            :key="index"
            :style="categoryStyle"
            :class="{ 'g-active-tag': activeCategory === index }"
            @click="handleCategory(index)"
          >{{ item }}</span>
        </div>
      </div>
      <div :style="categoryItemStyle">
        <span :style="labelStyle"><span style="color: red;">*</span>标签：</span>
        <div :style="contentStyle">
          <Select
            mode="multiple"
            class="tag-list"
            placeholder="请为内容打上合理的标签"
            :value="selectTags"
            style="width: 400px"
            @change="handleTagChange"
          >
            <SelectOption v-for="(item, index) in filteredOptions" :key="index" :value="item.name">
              {{ item.name }}
            </SelectOption>
          </Select>
        </div>
      </div>
      <template v-if="type ==='article'">
        <div :style="categoryItemStyle">
          <span :style="labelStyle">原创：</span>
          <div :style="contentStyle">
            <ASwitch checked-children="是" un-checked-children="否" :default-checked="isOriginal" @change="isOriginal = !isOriginal" />
          </div>
        </div>
        <template v-if="!isOriginal">
          <div :style="categoryItemStyle">
            <span :style="labelStyle"><span style="color: red;">*</span>原文标题：</span>
            <div :style="contentStyle">
              <Input v-model="originalTitle" placeholder="文章为原创则忽略" />
            </div>
          </div>
          <div :style="categoryItemStyle">
            <span :style="labelStyle"><span style="color: red;">*</span>原文作者：</span>
            <div :style="contentStyle">
              <Input v-model="originalAuthor" placeholder="文章为原创则忽略" />
            </div>
          </div>
          <div :style="categoryItemStyle">
            <span :style="labelStyle"><span style="color: red;">*</span>原文地址：</span>
            <div :style="contentStyle">
              <Input v-model="originalUrl" placeholder="文章为原创则忽略" />
            </div>
          </div>
        </template>
      </template>
    </Modal>
    <Modal
      v-model="referralShow"
      :mask-closable="false"
      title="发布"
      width="530px"
      cancel-text="继续编辑"
      ok-text="确认发布"
      :dialog-style="{ right: '10px' }"
      destroy-on-close
      @ok="onPublish"
    >
      <div :style="Object.assign({}, categoryItemStyle, { alignItems: 'flex-start' })">
        <span :style="labelStyle"><span style="color: red;">*</span>选择公司：</span>
        <div :style="contentStyle">
          <span
            v-for="(item, index) in companyList"
            :key="index"
            :style="categoryStyle"
            :class="{ 'g-active-tag': activeCpIndex === index }"
            @click="activeCpIndex = index"
          >{{ item.name }}</span>
        </div>
      </div>
      <div :style="Object.assign({}, categoryItemStyle, { alignItems: 'flex-start' })">
        <span :style="labelStyle"><span style="color: red;">*</span>选择分类：</span>
        <div :style="contentStyle">
          <span
            v-for="(item, index) in referralCategoryList"
            :key="index"
            :style="categoryStyle"
            :class="{ 'g-active-tag': activeCategoryIndex === index }"
            @click="activeCategoryIndex = index"
          >{{ item.name }}</span>
        </div>
      </div>
    </Modal>
    <ByteMarkdownEditor v-show="isMarkDown" :markdown-content="markdownContent" @change="handleMarkdownChange" />
    <RichEditor v-show="!isMarkDown" :html-content="htmlContent" @change="handleRichTextChange" />
  </div>
</template>

<script>
import { Select, Button, Switch, Modal, Input } from 'ant-design-vue'
import { generateDirectory, userRoleStatus } from '@/lib/utils'
import _get from 'lodash/get'
import dayjs from 'dayjs'
import ByteMarkdownEditor from '~/pages/components/byte-markdown-editor/index.vue'
import RichEditor from '~/pages/components/rich-editor/index.vue'
const SelectOption = Select.Option
const ASwitch = Switch
const MDDRAFT = '__md_draft_content__'
const methodMap = {
  qa: 'getQuestionDetail',
  article: 'getArticleDetail',
  wiki: 'getWikiMenuDetail'
}
export default {
  name: 'PageLibraryMavonEditor',
  components: {
    ByteMarkdownEditor,
    RichEditor,
    Select,
    Button,
    Modal,
    Input,
    ASwitch,
    SelectOption
  },
  async asyncData ({ route, $api, store }) {
    const userRole = userRoleStatus(store)
    const id = route.params.id // 文章或问题id
    const { t, wikiId } = route.query
    let content = {
      title: '',
      tags: [],
      markdownContent: '',
      htmlContent: ''
    }
    let isSelf = true
    if (id !== 'new') {
      const userId = store.state.user.userInfo.id
      content = await $api[methodMap[t]](id)
      if (content && content.authorId) {
        isSelf = userId === content.authorId
      }
    }
    const tagGroup = store.state.tag.tagGroup
    return {
      id,
      userRole,
      content,
      isSelf,
      tagGroup,
      type: t,
      wikiId,
      originalTitle: content.originalTitle || '',
      originalAuthor: content.originalAuthor || '',
      originalUrl: content.originalUrl || '',
      isOriginal: !content.originalUrl,
      isMarkDown: id === 'new' || !!content.markdownContent,
      articleTitle: content.title,
      selectTags: content.tags?.map(tag => tag.name) || [],
      selectTagIds: content.tags?.map(tag => tag.id) || [],
      markdownContent: content.markdownContent,
      htmlContent: content.htmlContent || '<p data-we-empty-p=""><br></p>'
    }
  },
  data () {
    return {
      articleUrl: '',
      codeType: 'js',
      codeTypeList: ['js', 'ts', 'java', 'css', 'shell', 'xml', 'html'],
      showArticleMd: false,
      tLoading: false,
      referralShow: false,
      confirmModal: false,
      isSelf: true,
      articleId: '',
      content: null,
      articleTitle: '',
      markdownContent: '',
      isMarkDown: true,
      selectTags: [],
      selectTagIds: [],
      activeCategory: 0,
      tags: [],
      allTags: [],
      tagGroup: [],
      companyList: [],
      activeCpIndex: -1,
      categoryItemStyle: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      },
      labelStyle: {
        display: 'inline-block',
        textAlign: 'right',
        color: '#282f38',
        width: '80px'
      },
      contentStyle: {
        width: '400px'
      },
      categoryStyle: {
        display: 'inline-block',
        backgroundColor: '#fff',
        padding: '4px 6px',
        width: '92px',
        fontSize: '12px',
        textAlign: 'center',
        border: '1px solid #dedede',
        marginBottom: '10px',
        marginRight: '4px',
        cursor: 'pointer'
      },
      titleMap: {
        article: '文章标题',
        qa: '问题',
        wiki: 'wiki目录',
        referral: 'JD 标题'
      },
      activeCategoryIndex: -1,
      referralCategoryList: [],
      draftId: '',
      draftList: '',
      draftTimer: 0
    }
  },
  computed: {
    filteredOptions () {
      return this.tags.filter(tag => !this.selectTags.includes(tag.name))
    },
    md: {
      get () {
        return this.html2md(this.html)
      }
    }
  },
  watch: {
    articleTitle (val) {
      if (val) {
        this.updateDraft(val)
      }
    }
  },
  mounted () {
    this.getArticleTags()
    this.getDraftList()
    this.checkoutLogin()
    const content = this.content.markdownContent || this.content.htmlContent
    /**
     * 文章更新时间如果大于本地缓存时间则不使用缓存
     * */
    const localTime = _get(this.getDraft(), 'time', 0)
    const updateTime = dayjs(this.content.updateAt).valueOf()
    if (this.getDraft() && this.type !== 'article' && (!content || (this.getDraft().id === this.id && localTime > updateTime))) {
      this.markdownContent = this.getDraft().content
      this.articleTitle = this.getDraft().title
    } else {
      this.clearDraft()
    }
  },
  methods: {
    checkoutLogin () {
      if (this.userRole.noLogin) {
        this.$message.warning('请先登录')
        setTimeout(() => {
          this.$router.replace('/article')
        }, 2000)
      }
    },
    onConfirmModal () {
      if (this.type === 'wiki') {
        this.$confirm({
          title: '确认发布当前文章为 wiki 一级目录？',
          onText: '确认',
          cancelText: '继续编辑',
          onOk: () => {
            this.onPublish()
          }
        })
        return
      }
      if (this.type === 'referral') {
        this.referralShow = true
        return
      }
      this.confirmModal = true
    },
    setDraft (ctx = '') {
      localStorage.setItem(MDDRAFT, JSON.stringify({
        id: this.id === 'new' ? '' : this.id,
        time: Date.now(),
        title: this.articleTitle,
        content: ctx
      }))
    },
    getDraft () {
      return localStorage.getItem(MDDRAFT) ? JSON.parse(localStorage.getItem(MDDRAFT)) : null
    },
    clearDraft () {
      localStorage.removeItem(MDDRAFT)
    },
    async handleMenuClick (val) {
      const articleId = val.key
      const article = await this.$api.getArticleDetail(articleId)
      this.articleTitle = article.title
      this.draftId = article.id
      this.originalTitle = article.originalTitle
      this.originalUrl = article.originalUrl
      this.originalAuthor = article.originalAuthor
      this.markdownContent = article.markdownContent
      this.htmlContent = article.htmlContent
      if (article.originalUrl) {
        this.isOriginal = false
      }
    },
    handleRichTextChange (val) {
      this.htmlContent = val
      this.updateDraft(val)
    },
    handleMarkdownChange (val) {
      this.markdownContent = val
      if (val) {
        this.setDraft(val)
      }
      this.updateDraft(val)
    },
    updateDraft (val) {
      if (this.draftTimer) {
        clearTimeout(this.draftTimer)
      }
      this.draftTimer = setTimeout(() => {
        const content = this.markdownContent || this.htmlContent
        if (this.type !== 'article') return
        if (!this.articleTitle || !content) return
        this.saveArticle(true)
      }, 3000)
    },
    handleTagChange (tags) {
      const list = []
      this.tags.forEach((tag) => {
        if (tags.includes(tag.name)) { list.push(tag.id) }
      })
      this.selectTags = tags
      this.selectTagIds = list
    },
    handleCategory (index) {
      this.activeCategory = index
      this.selectTags = []
      this.selectTagIds = []
      if (this.activeCategory > 0) {
        this.tags = this.allTags.filter(item => item.groupName === this.tagGroup[index])
        return
      }
      this.tags = [...this.allTags]
    },
    async getArticleTags () {
      this.tags = await this.$api.getArticleTags()
      this.allTags = [...this.tags]
      const group = new Set()
      this.tags.forEach((item) => {
        group.add(item.groupName)
      })
      this.tagGroup = ['全部', ...group]
    },
    onPublish () {
      if (!this.articleTitle) {
        this.$notification.error({
          duration: 2,
          message: `${this.titleMap[this.type]}不能为空！`
        })
        return
      }
      if (['article', 'qa'].includes(this.type) && !this.selectTagIds.length) {
        this.$notification.error({
          duration: 2,
          message: '请选择合理的标签'
        })
        return
      }
      if (!this.markdownContent && !this.htmlContent) {
        this.$notification.error({
          duration: 2,
          message: `${this.titleMap[this.type]}内容不能为空！`
        })
        return
      }
      const saveMap = {
        qa: 'saveFq',
        article: 'saveArticle',
        wiki: 'saveWiki'
      }
      if (this.type) {
        this[saveMap[this.type]]()
      }
      this.confirmModal = false
    },
    getArticleImgs () {
      const id = this.isMarkDown ? 'library-markdown-editor' : 'library-rich-editor'
      const headImg = []
      const imgs = document.getElementById(id).getElementsByTagName('img')
      for (let i = 0; i < imgs.length; i++) {
        headImg.push({
          alt: imgs[i].alt,
          url: imgs[i].src
        })
      }
      return JSON.stringify(headImg)
    },
    saveWiki () {
      const contentType = this.isMarkDown ? 'MARKDOWN' : 'HTML'
      let directory = []
      const el = document.getElementsByClassName('bytemd-preview')[0]
      if (this.isMarkDown && el) {
        directory = generateDirectory(el)
      }
      this.$api.createWikiNode({
        wikiId: this.wikiId,
        title: this.articleTitle,
        directory: JSON.stringify(directory),
        contentType,
        htmlContent: this.htmlContent,
        headImg: this.getArticleImgs(),
        id: this.content?.id,
        markdownContent: this.markdownContent
      }).then((res) => {
        if (res.success) {
          this.clearDraft()
          this.$notification.success({
            duration: 2,
            message: '发布成功！'
          })
          setTimeout(() => {
            window.history.back()
          }, 1000)
        } else {
          this.$notification.error({
            duration: 2,
            message: res.message
          })
        }
      })
    },
    saveArticle (draft = '') {
      // 防止草稿更新状态
      if (!draft) clearTimeout(this.draftTimer)
      const contentType = this.isMarkDown ? 'MARKDOWN' : 'HTML'
      let directory = []
      const el = document.getElementsByClassName('bytemd-preview')[0]
      if (this.isMarkDown && el) {
        directory = generateDirectory(el)
      }
      this.$api.saveNewArticle({
        title: this.articleTitle,
        directory: JSON.stringify(directory),
        contentType,
        htmlContent: this.htmlContent,
        headImg: this.getArticleImgs(),
        id: this.draftId || this.content?.id,
        draft,
        markdownContent: this.markdownContent,
        tagIds: this.selectTagIds,
        originalTitle: this.originalTitle.trim(),
        originalUrl: this.originalUrl.trim(),
        originalAuthor: this.originalAuthor.trim()
      }).then((res) => {
        if (res.success) {
          if (draft) {
            this.draftId = res.data
            this.$message.success('已存为草稿')
          } else {
            this.clearDraft()
            this.draftId = ''
            this.$notification.success({
              duration: 2,
              message: '发布成功！'
            })
            setTimeout(() => {
              if (this.content?.id) {
                window.history.back()
                return
              }
              window.location.replace('/')
            }, 1000)
          }
        } else {
          this.$notification.error({
            duration: 2,
            message: res.message
          })
        }
      })
    },
    saveFq () {
      const contentType = this.isMarkDown ? 'MARKDOWN' : 'HTML'
      this.$api.saveNewQuestion({
        title: this.articleTitle.trim(),
        contentType,
        htmlContent: this.htmlContent,
        headImg: this.getArticleImgs(),
        id: this.content?.id,
        markdownContent: this.markdownContent,
        tagIds: this.selectTagIds
      }).then((res) => {
        if (res.success) {
          this.clearDraft()
          this.$notification.success({
            duration: 2,
            message: '发布成功！'
          })
          if (this.content?.id) {
            window.history.back()
            return
          }
          window.location.replace('/')
        } else {
          this.$notification.error({
            duration: 2,
            message: res.message
          })
        }
      })
    },
    getDraftList () {
      if (this.type !== 'article' || this.id !== 'new') return
      this.$api.getTopicList({
        filter: {
          state: 'DRAFT',
          userId: _get(this, '$store.state.user.userInfo.id')
        }
      }).then((list) => {
        this.draftList = list
        if (!list.length) {
          this.articleTitle = ''
          this.markdownContent = this.htmlContent = ''
          this.draftId = ''
        }
      })
    },
    delDraft (articleId) {
      this.$api.delArticleBy(articleId).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getDraftList()
          return
        }
        this.$message.error(res.message)
      })
    }
  }
}
</script>

<style lang="less">
  .page-library-mavon-add {
    width: @max-width;
    margin: 0 auto;
    min-height: 100%;
    background-color: #fff;
    border-radius: @g-radius;
    padding-top: 5px;
    .base-title {
      justify-content: space-between;
    }
    .base-info-item {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      justify-content: space-between;
      border-bottom: 1px solid @border-4-color;
      .draft-sync {
        color: green;
      }
      .ant-switch {
        color: #fff;
        background-color: @g-main-color;
      }
      .ant-switch-inner {
        width: 60px
      }
      .ant-select-selection__choice {
        background-color: #fff;
        border-radius: 4px;
        border-color: #e5f0e5;
        box-sizing: border-box;
        font-size: @font-third;
      }
      .ant-select-selection__placeholder {
        font-size: 15px;
      }
      .ant-select-selection__choice__content {
        color: @font-color-second;
        font-size: 12px;
      }
      .ant-select-selection {
        border: 0;
      }
      .title-box {
        display: flex;
        align-items: center;
        margin-right: 15px;
      }
      .title {
        min-width: 60px;
        font-size: @font-third;
        font-weight: bold;
      }
      .title-content {
        width: 580px;
        border: 0;
        outline: none;
        font-size: @font-third;
        color: @font-color-first;
        font-weight: bold;
        text-indent: 12px;
        &::placeholder {
          color: @font-color-third;
          font-weight: 400;
        }
      }
      .category-input, .tag-list {
        font-size: @font-third;
      }
      .tag-container {
        flex: 1;
        border: 0;
      }
    }
  }
</style>
