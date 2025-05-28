<template>
  <div v-if="article" class="home-article-item-container">
    <div class="home-article-item">
      <div class="item-content" @click="onNative(`/article/${article.id}`)">
        <p class="vice-title-message">
          <GUserPopover :user-id="article.authorId">
            <Avatar
              class="user-header g-avatar-border"
              size="small"
              :src="article.authorAvatar"
              @click="$utils.openUserCenter(article.authorId)"
            />
          </GUserPopover>
          <span class="user-name g-hover" @click.stop.prevent="$utils.openUserCenter(article.authorId)">
            {{ article.authorNickname }}
          </span>
          <GSpace />
          <span class="question-time">{{ article.createAt | dateCountDown }}</span>
          <span class="tag-container">
            <g-space />
            <span
              v-for="(item, index) in article.tags"
              :key="index"
              class="g-tag g-hover"
              @click.stop.prevent="handleTagSearch(item)"
            >{{ item.name }}</span>
          </span>
        </p>
        <div class="title-line">
          <Tag v-if="article.official" color="pink">
            官
          </Tag>
          <Tag v-if="article.top" color="blue">
            顶
          </Tag>
          <Tag v-if="article.marrow" color="green">
            精
          </Tag>
          <h2 class="title g-hover">
            {{ article.title }}
          </h2>
          <Tag v-if="article.state !== 'PASS'" color="'red'">
            {{ article.solutionDesc }}
          </Tag>
        </div>
        <div class="article-content-box">
          <p
            v-if="article.introduction"
            class="article-simple-content g-hidden-line2"
            v-text="article.introduction.replace(/\!\[\w*\]\(https:\/\/static.developers.pub\/[\w]*\)/gi, '')"
          />
          <img v-if="headImg" class="article-picture" :src="`${headImg}?imageView2/1/w/120/h/80`" alt="">
        </div>
      </div>
      <img v-if="headImg" class="article-big-picture" :src="`${headImg}?imageView2/1/w/160/h/110`" alt="">
    </div>
    <div class="article-operation">
      <span class="article-operation-actions">
        <span class="operation-item">
          <Icon class="operation-icon g-hover" type="eye" />&nbsp;{{ article.views }}
        </span>
        <g-space />
        <span class="operation-item">
          <Icon class="operation-icon g-hover" type="like" />&nbsp;{{ article.approvals }}
        </span>
        <g-space />
        <span class="operation-item" @click.stop.prevent="openArticleByComment(article.id)">
          <Icon class="operation-icon g-hover" type="message" />&nbsp;{{ article.comments }}
        </span>
      </span>
      <span class="mobile-tags">
        <span
          v-for="(item, index) in article.tags.slice(0, 2)"
          :key="index"
          class="mobile-tag g-hover"
          @click.stop.prevent="handleTagSearch(item)"
        >{{ item.name }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { Tag, Icon, Avatar } from 'ant-design-vue'
export default {
  name: 'PageArticleItem',
  components: {
    Tag, Icon, Avatar
  },
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      textReg: /[#|-|>|[x\]]/ig
    }
  },
  computed: {
    headImg () {
      if (!this.article.headImg) {
        return
      }
      return JSON.parse(this.article.headImg)[0]?.url
    }
  },
  methods: {
    openArticleByComment (id) {
      this.$utils.openNewWindow(`/article/${id}#article-comment`)
    },
    handleTagSearch ({ id, name }) {
      this.$utils.openNewWindow(`/tag/${id}?name=${encodeURIComponent(name)}`)
    },
    onNative (url) {
      this.$router.push(url)
      // this.$utils.openNewWindow(url, this.article.title)
    }
  }
}
</script>

<style lang="less" scoped>
.home-article-item-container {
  flex: 1;
  padding: 15px @g-padding * 2;
  border-bottom: 1px solid @border-3-color;
  background-color: #fff;
  &:hover {
    background-color: @g-hover-blue;
  }
  &:last-child {
    border: 0;
  }
  .home-article-item {
    display: flex;
    align-items: center;
    min-height: 100px;
    cursor: pointer;
    justify-content: space-between;
    .article-big-picture {
      width: 160px;
      height: 110px;
      object-fit: cover;
      border-radius: @g-radius;
      vertical-align: middle;
    }
    .item-content {
      flex: 1;
      margin-right: @g-margin * 2;
      .title-line {
        display: flex;
        align-items: center;
        .ant-tag {
          background-color: #fff;
        }
      }
      .article-content-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .title {
        color: #1d2129;
        font-size: @font-first;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .article-simple-content {
        color: @font-color-second;
        font-size: @font-third;
        line-height: 28px;
        word-break: break-all;
        margin-bottom: 10px;
      }
      .vice-title-message {
        display: flex;
        align-items: center;
        color: @font-color-third;
        font-size: @font-fourth;
        margin-bottom: 16px;
      }
      .user-header {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .user-name {
        color: @font-color-first;
      }
      .article-picture {
        display: none;
        width: 120px;
        height: 80px;
        border-radius: @g-radius;
        background-position: center;
        object-fit: cover;
        margin-left: 20px;
      }
    }
  }
  .article-operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: @font-fourth;
    color: @font-color-third;
    .article-operation-actions {
      display: flex;
    }
    .operation-item {
      display: flex;
      align-items: center;
    }
    .operation-icon {
      font-size: @font-third;
      font-weight: bold;
      margin-right: 4px;
    }
    .mobile-tags {
      display: none;
    }
  }
}
@media screen and (max-width: 1000px) {
  .home-article-item-container {
    padding: 10px 16px;
    .home-article-item {
      .item-content {
        margin-right: 0;
      }
      .vice-title-message {
        margin-bottom: 10px !important;
      }

      .title {
        color: #1d2129;
        font-size: 18px !important;
        font-weight: bold;
        margin-bottom: 0;
      }
      .article-content-box {
        margin-bottom: 10px;
        .article-picture {
          display: inline-block;
          width: 80px;
          height: 55px;
          border-radius: @g-radius;
        }
      }

      .article-simple-content {
        font-size: @font-fourth !important;
      }
      .article-big-picture {
        display: none;
      }
    }
    .article-operation {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px !important;

      .mobile-tags {
        display: inline !important;

        .mobile-tag {
          color: @font-color-third;
          border-radius: @g-radius;
          margin-left: @g-margin;
          padding: 1px 6px;
          font-size: 10px;
          background-color: @g-bg-blue;
        }
      }
    }

    .item-content {
      span {
        white-space: nowrap;
        word-break: keep-all;
      }

      .tag-container {
        display: none;
      }
      .title-line {
        margin-bottom: 5px;
        .title {
          color: #1d2129;
          font-size: 18px !important;
          font-weight: bold;
          margin-bottom: 0;
        }
      }
      .article-content-box {
        .article-simple-content {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
