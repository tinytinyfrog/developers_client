<template>
  <div class="collect-mark-container">
    <Popover v-model="visible" trigger="click" :get-popup-container="getPopContainer">
      <template slot="content">
        <div class="collect-content">
          <h3 style="padding-bottom: 10px; margin: 0;" class="g-bm-border">
            添加到收藏集
          </h3>
          <div class="collect-items" :style="collectItemsBox">
            <template v-if="collects.length">
              <p
                v-for="(item, index) in collects"
                :key="index"
                :style="collectItemStyle"
                class="g-bg-hover g-hidden-line1"
                @click="addArticleByCollect(item.collectId)"
              >
                <span>{{ item.name }}</span>
                <span :style="collectCountStyle">&nbsp;·&nbsp;{{ item.refCount }}篇</span>
              </p>
            </template>
            <Empty v-else description="请先添加收藏集" />
          </div>
          <div class="add-new-collection-box" :style="newCollectionStyle">
            <div v-show="showCollect" class="g-flex-between" style="flex: 1">
              <input ref="newC" v-model="collectName" type="text" placeholder="请输入收藏夹名" style="border: 0;width: 140px; outline: none;">
              <Button type="primary" @click="addCollectFolder">
                添加
              </Button>
            </div>
            <span v-if="!showCollect" :style="collectBtnStyle" @click="handleCollect">新建收藏夹</span>
          </div>
        </div>
      </template>
      <span><slot /></span>
    </Popover>
  </div>
</template>

<script>
import { Popover, Empty, Button } from 'ant-design-vue'
export default {
  name: 'CollentMark',
  components: {
    Popover,
    Empty,
    Button
  },
  props: {
    container: {
      type: String,
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      showCollect: false,
      visible: false,
      collectName: '',
      collects: [],
      collectItemStyle: {
        display: 'flex',
        marginBottom: 0,
        height: '35px',
        lineHeight: '35px',
        padding: '0 4px',
        alignItems: 'center'
      },
      collectBtnStyle: {
        display: 'inline-block',
        width: '100%',
        color: '#939aa3',
        paddingTop: '10px',
        cursor: 'pointer',
        textAlign: 'right'
      },
      newCollectionStyle: {
        display: 'flex',
        height: '40px',
        alignItems: 'center'
      },
      collectItemsBox: {
        fontWeight: 'bold',
        maxHeight: '220px',
        width: '214px',
        paddingBottom: '15px',
        overflowY: 'scroll'
      },
      collectCountStyle: {
        color: '#939aa3',
        lineHeight: 1,
        fontWeight: '400'
      }
    }
  },
  watch: {
    visible (val) {
      if (!val) this.showCollect = false
    }
  },
  mounted () {
    this.getCollects()
  },
  methods: {
    handleCollect () {
      this.showCollect = true
      // this.$nextTick(() => {
      //   this.$refs.newC.focus()
      // })
      setTimeout(() => {
        this.$refs.newC.focus()
      })
    },
    getPopContainer () {
      return document.getElementById(this.container)
    },
    async addArticleByCollect (collectId) {
      const res = await this.$api.addArticleForCollect({
        collectId,
        postsId: this.id
      })
      if (res) {
        this.$message.success({
          duration: 2,
          content: '收藏成功'
        })
        this.$emit('on-success')
        this.getCollects()
        this.$nextTick(() => {
          this.visible = false
        })
      }
    },
    async addCollectFolder () {
      if (!this.collectName) {
        this.$message.error({
          duration: 2,
          content: '收藏夹名称不能为空'
        })
        return
      }
      const res = await this.$api.addCollect(this.collectName)
      if (res.code === 0) {
        this.addArticleByCollect(res.data)
        this.showCollect = false
        this.collectName = ''
        return
      }
      this.$message.error({
        duration: 2,
        content: res.message
      })
    },
    async getCollects () {
      this.collects = await this.$api.getCollects()
    }
  }
}
</script>

<style lang="less">
.collect-mark-container {
  .collect-content {
    width: 300px;
    height: 300px;
  }
}
</style>
