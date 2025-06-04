<template>
  <a-drawer
    title=""
    placement="top"
    :closable="false"
    :height="340"
    :visible="showDrawer"
    :get-container="false"
    :body-style="{paddingBottom: '10px'}"
    :wrap-style="{ position: 'absolute' }"
    @close="closeDrawer"
  >
    <div class="wiki-drawer">
      <div class="header-cover-img">
        <Cropper :screenshot-number="[4, 5]" @on-img="onImgChange">
          <img class="cover-img" :src="headImg" alt="avatar">
        </Cropper>
        <p class="wiki-cover-tips">
          知识库封面(点击修改)
        </p>
      </div>
      <div class="input-form">
        <div class="input-item">
          <span class="label">知识库名称：</span>
          <a-input v-model="name" placeholder="请输入知识库名称" />
        </div>
        <div class="input-item">
          <span class="label">分类：</span>
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
            v-model="summary"
            placeholder="请输入知识库摘要"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </div>
        <div class="input-item">
          <span class="label">是否展示：</span>
          <a-checkbox v-model="show" />
        </div>
        <div class="input-item submit-box">
          <a-button class="submit-btn" type="primary" @click="creatWiki">
            保存
          </a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import Cropper from '@/pages/components/cropper'
import EventBus from '@/lib/event-bus'
const defaultHeadImg = 'https://static.developers.pub/e50b00dc8fa3437590df5c5561c8e97b'
export default {
  name: 'CreateWiki',
  components: {
    Cropper
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    categoryList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      name: '',
      summary: '',
      show: false,
      loading: false,
      headImg: defaultHeadImg,
      activeCategoryIndex: -1
    }
  },
  methods: {
    closeDrawer () {
      this.$emit('update:showDrawer', false)
    },
    clearData () {
      this.name = this.summary = ''
      this.show = false
      this.headImg = defaultHeadImg
    },
    onImgChange (url) {
      this.headImg = url
    },
    creatWiki () {
      this.loading = true
      const { name, summary, headImg, show, categoryList, activeCategoryIndex } = this
      if (!name || !summary || activeCategoryIndex === -1) {
        this.$message.error('知识库名称、类别、摘要不能为空')
        this.loading = false
        return
      }
      this.$api.createWiki({
        name,
        summary,
        headImg,
        show,
        categoryId: categoryList[activeCategoryIndex].id
      }).then((res) => {
        this.loading = false
        if (res.success) {
          this.$message.success('知识库添加成功')
          EventBus.$emit('on-update-wiki')
          this.clearData()
          this.closeDrawer()
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .wiki-drawer {
    display: flex;
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
</style>
