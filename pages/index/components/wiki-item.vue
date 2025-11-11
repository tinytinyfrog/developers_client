<template>
  <!-- 新布局 - 与post.vue保持一致 -->
  <div v-if="article" class="info-item" @click="onNative(`/wiki/${article.postsId}`)">
    <div class="item-left">
      <!-- <div style="width: 14px">
        <img v-if="article.icon" :src="article.icon" class="img">
      </div> -->
      <!-- <div class="tag">
        <a-tag color="blue">
          {{ article.categoryDesc || 'Wiki' }}
        </a-tag>
      </div> -->
      <div class="content" :title="article.postsTitle">
        {{ article.postsTitle }}
      </div>
    </div>
    <div class="item-right">
      <GUserPopover :user-id="article.authorId">
        <Avatar
          v-if="article.authorAvatar"
          class="user-header g-avatar-border"
          size="small"
          :src="article.authorAvatar"
          @click="$utils.openUserCenter(article.authorId)"
        />
      </GUserPopover>
      <!-- <a-avatar class="item-avatar" :src="article.authorAvatar || defaultImg" /> -->
      <div class="name" :title="article.authorNickname">
        {{ article.authorNickname }}
      </div>
      <div class="divier" />
      <div class="views" :title="article.views">
        <a-icon style="margin-right: 4px" type="eye" />{{ article.views }}
      </div>
      <div class="divier" />
      <div>
        {{ article.createAtString || '-' }}
      </div>
    </div>
  </div>

  <!-- 老布局 - 保留注释 -->
  <!-- <div v-if="article" class="home-article-item-container">
    <div class="home-article-item">
      <div class="item-content" @click="onNative(`/wiki/${article.postsId}`)">
        <p class="vice-title-message">
          <GUserPopover :user-id="article.authorId">
            <Avatar
              v-if="article.authorAvatar"
              class="user-header g-avatar-border"
              size="small"
              :src="article.authorAvatar"
              @click="$utils.openUserCenter(article.authorId)"
            />
          </GUserPopover>
          <span
            class="user-name g-hover"
            @click.stop.prevent="$utils.openUserCenter(article.authorId)"
          >
            {{ article.authorNickname }}
          </span>
          <GSpace />
          <span class="question-time">{{ article.createAtString | dateCountDown }}</span>
          <span v-if="article.tags.length > 0" class="tag-container">
            <g-space />
            <template v-for="(item, index) in article.tags">
              <span
                v-if="item.name"
                :key="index"
                class="g-tag g-hover"
                @click.stop.prevent="handleTagSearch(item)"
              >
                {{ item.name }}
              </span>
            </template>
          </span>
        </p>
        <div class="title-line">
          <h2 class="title g-hover">
            {{ article.postsTitle }}
          </h2>
        </div>
        <div class="article-content-box">
          <p
            v-if="article.markdownContent"
            class="article-simple-content g-hidden-line2"
            v-text="
              article.markdownContent.replace(
                /\!\[\w*\]\(https:\/\/static.developers.pub\/[\w]*\)/gi,
                ''
              )
            "
          />
          <img
            v-if="headImg"
            class="article-picture"
            :src="`${headImg}?imageView2/1/w/120/h/80`"
            alt=""
          >
        </div>
      </div>
      <img
        v-if="headImg"
        class="article-big-picture"
        :src="`${headImg}?imageView2/1/w/160/h/110`"
        alt=""
      >
    </div>
  </div> -->
</template>

<script>
// import { Tag, Icon } from 'ant-design-vue'
export default {
  name: 'PageArticleItem',
  components: {
    // Tag, Icon
    //  Avatar
  },
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    const defaultImg = require('@/assets/images/home/default-user.png')
    return {
      textReg: /[#|-|>|[x\]]/gi,
      defaultImg
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
/* 新布局样式 - 与post.vue保持一致 */
.info-item {
  display: flex;
  column-gap: 20px;
  justify-content: space-between;
  padding: 18px 12px;
  border-bottom: 1px solid rgb(226, 232, 246);
  cursor: pointer;

  .item-left {
    display: flex;
    column-gap: 8px;
    flex: 1;
    align-items: center;
    width: 0;

    .img {
      width: 14px;
      height: 14px;
    }

    .tag {
      min-width: 40px;
    }

    .content {
      flex: 1;
      color: rgb(40, 40, 40);
      font-size: 14px;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .item-right {
    display: flex;
    column-gap: 8px;
    align-items: center;
    min-width: 28%;

    .item-avatar {
      width: 24px;
      height: 24px;
    }

    .name {
      width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .views {
      width: 60px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .divier {
      width: 1px;
      background: rgb(196, 196, 196);
      height: 18px;
    }
  }
}

/* 老布局样式 - 保留注释 */
/*
.home-article-item-container {
  flex: 1;
  padding: 8px @g-padding * 2;
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
      }
      .article-simple-content {
        color: @font-color-second;
        font-size: @font-third;
        line-height: 28px;
        word-break: break-all;
      }
      .vice-title-message {
        display: flex;
        align-items: center;
        color: @font-color-third;
        font-size: @font-fourth;
        margin-bottom: 8px;
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
*/
</style>
