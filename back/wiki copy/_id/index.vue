<template>
  <div class="page-wiki-detail">
    <div class="header-info">
      <img class="wiki-headimg" :src="wikiInfo.headImg" alt="">
      <div class="base-info">
        <h1>{{ wikiInfo.name }}</h1>
        <p class="g-margin-top">
          Owner:
          <GUserPopover :user-id="wikiInfo.ownerId">
            <span @click.stop.prevent="$utils.openUserCenter(wikiInfo.ownerId)">
              <b class="g-hover">{{ wikiInfo.ownerName }}</b>
            </span>
          </GUserPopover>
        </p>
        <p class="g-margin-top description">
          简介：{{ wikiInfo.summary }}
        </p>
      </div>
    </div>
    <p class="mobile-description">
      简介：{{ wikiInfo.summary }}
    </p>
    <div class="contribution-block">
      <a-collapse v-model="activeKey" @change="collapseChange">
        <span slot="expandIcon">
          <a-icon type="alert" class="expand-icon" />
        </span>
        <a-collapse-panel key="1" header="点击这里贡献知识库文章">
          <div class="contribute-container">
            <a-alert message="您提交的文章信息我们会尽快审核和整理，优质文章将被收纳进知识库，期待您的参与~" banner />
            <div class="submit-item">
              <b class="label">贡献文章：</b>
              <a-input ref="articleUrl" v-model="articleUrl" placeholder="请输入文章url（支持任何网站的文章地址）" />
            </div>
            <div class="submit-item submit-btn">
              <a-button type="primary" :loading="loading" @click="pushArticle">
                提交
              </a-button>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <byte-viewer id="byte-article-viewer-container" :markdown-content="wikiInfo.desc" />
    <CommentList :article="article" />
  </div>
</template>

<script>
import ByteViewer from '@/pages/components/byte-viewer/index.vue'
import CommentList from '@/pages/index/article/_id/components/comment-list.vue'
export default {
  name: 'WikiInfoDetail',
  components: {
    ByteViewer,
    CommentList
  },
  props: {
    wikiInfo: {
      type: Object,
      default: () => null
    }
  },
  data () {
    const wikiInfo = this.wikiInfo
    const article = wikiInfo ? {
      id: wikiInfo.descPostsId,
      authorId: wikiInfo.ownerId
    } : null
    return {
      article,
      loading: false,
      activeKey: 0,
      articleUrl: ''
    }
  },
  methods: {
    collapseChange () {
      this.$nextTick(() => {
        this.$refs.articleUrl.focus()
      })
    },
    pushArticle () {
      if (this.loading) return
      this.loading = true
      this.$api.createWikiNodeRecord({
        wikiId: this.wikiInfo.id,
        content: this.articleUrl
      }).then((res) => {
        this.loading = false
        if (res.success) {
          this.articleUrl = ''
          this.$message.success('提交成功')
          return
        }
        this.$message.error(res.message)
      })
    }
  }
}
</script>

<style lang="less">
@import '~/pages/components/byte-markdown-editor/theme.less';
.page-wiki-detail {
  height: 100%;
  padding: @g-padding * 2;
  .header-info {
    display: flex;
    margin-bottom: @g-margin * 3;
    padding-bottom: @g-padding * 2;
    border-bottom: 1px solid @border-4-color;
  }
  .wiki-headimg {
    width: 200px;
    margin-right: @g-margin * 2;
    border-radius: @g-radius;
    border: 1px dashed @border-1-color;
  }
  .description {
    font-size: 15px;
    color: @font-color-first;
  }
  .mobile-description {
    display: none;
  }
  .ant-collapse {
    margin-bottom: @g-margin * 2;
  }
  .expand-icon {
    font-size: 20px;
    color: @g-main-color;
  }
  .ant-collapse-content-box {
    padding: 0;
  }
  .ant-collapse-header {
    background-color: #fff;
  }
  .contribute-container {
    padding: @g-padding * 2;
    background-color: @g-bg-blue;
    border-right: @g-radius;
    .submit-item {
      display: flex;
      align-items: center;
      text-align: right;
      margin-top: @g-margin * 2;
      .label {
        white-space: nowrap;
      }
    }
    .submit-btn {
      justify-content: flex-end;
    }
  }
  @media screen and (max-width: 1000px) {
    .contribution-block {
      display: none;
    }
    .wiki-headimg {
      width: 70px;
      border: 0
    }
    .header-info {
      display: flex;
      margin-bottom: @g-margin;
      align-items: flex-end;
      border: 0;
      .base-info {
        h1 {
          font-size: @font-third;
        }
        p {
          margin-top: 10px;
        }
      }
    }
    .description {
      display: none;
    }
    .mobile-description {
      display: block;
      font-size: 14px;
      margin-bottom: @g-margin * 2;
      padding-bottom: @g-padding * 2;
      border-bottom: 1px dashed @border-4-color
    }
  }
}
</style>
