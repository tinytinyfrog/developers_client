<template>
  <div id="g-header-comment-container" class="g-header-comment-container">
    <a-rawer
      placement="top"
      height="350"
      :body-style="{padding: 0}"
      :drawer-style="{width: '1000px', margin: '0 auto', boxSizing: 'border-box', paddingTop: '20px'}"
      :closable="false"
      :visible="show"
      :get-container="getContainer"
      @close="onClose"
    >
      <div slot="title">
        <a-icon type="number" class="g-active" /> 请仔细描述你的问题，方便答题者回答哦~
      </div>
      <a-input class="question-title" placeholder="请输入您的问题" auto-focus size="large" />
      <a-textarea class="question-describe" placeholder="若需要，请对问题进行简单描述~" :rows="4" />
      <div class="other-info">
        <a-select
          class="category"
          show-search
          placeholder="请选择一个分类"
          option-filter-prop="children"
          style="width: 200px"
        >
          <a-select-option value="jack">
            大前端
          </a-select-option>
          <a-select-option value="lucy">
            java
          </a-select-option>
          <a-select-option value="tom">
            IOS
          </a-select-option>
        </a-select>
        <a-select
          mode="multiple"
          placeholder="请为问题打上合理的标签"
          :value="selectTags"
          style="width: 100%"
          @change="onHandleTagChange"
        >
          <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </div>
      <div class="ask-footer-btn-box" style="padding-top: 20px; text-align: right">
        <a-button class="question-cancel-btn" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="onClose">
          发起提问
        </a-button>
      </div>
    </a-rawer>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: '',
      confirmLoading: false,
      selectTags: ['vue', 'typeScript'],
      tags: ['vue', 'typeScript', 'react', 'nodejs', 'chrome', 'java', 'vscode', 'webpack', 'tomcat']
    }
  },
  computed: {
    filteredOptions () {
      return this.tags.filter(tag => !this.selectTags.includes(tag))
    }
  },
  methods: {
    onClose () {
      this.$emit('update:show', false)
    },
    onHandleTagChange (tags) {
      this.selectTags = tags
    },
    getContainer () {
      return document.getElementById('g-header-comment-container')
    }
  }
}
</script>

<style lang="less">
  .g-header-comment-container {
    width: @max-width;
    /*height: 260px;*/
    margin: 0 auto;
    /*padding: 20px 0;*/
    transition: height 0.5s;
    .ask-title {
      color: @font-color-second;
    }
    .ask-footer-btn-box {
      padding-top: 20px;
      text-align: right;
    }
    .ant-drawer-title {
      font-size: @font-third;
      color: #777;
    }
    .ant-drawer-header {
      background-color: transparent;
      padding: 15px 0;
      border: 0;
    }
    .ant-drawer-content {
      background-color: #fff;
    }
    .question-title {
      margin-bottom: 15px;
      border: 0;
      border-radius: 0;
      border-bottom: 1px solid @border-3-color;
      background-color: transparent;
      font-weight: bold;
      color: @font-color-first;
      font-size: @font-second;
      &:focus {
        border: 0;
        box-shadow: none;
        border-bottom: 1px solid @g-active-color;
      }
    }
    .other-info {
      padding-top: 15px;
      display: flex;
      .category {
        margin-right: 15px;
      }
      .ant-select-selection__choice {
        background-color: #fff;
        border-radius: 4px;
        border-color: #e5f0e5;
      }
    }
    .question-describe {
      font-size: @font-third;
    }
  }
</style>
