<template>
  <div>
    <div class="honor-header">
      <a-input placeholder="请输入关键字进行搜索" style="width: 320px" />
    </div>
    <div class="honor-list">
      <div v-for="(item,index) of honorList" :key="index" class="honor-item">
        <img :src="item.imageUrl" class="honor-img">
        </img>
        <div class="honor-mask">
          <div>
            <div class="mask-item">
              {{ item.title }}
            </div>
            <div class="mask-summary">
              {{ item.summary }}
            </div>
          </div>
          <div class="mask-button">
            <a-button type="primary" shape="round">
              查看详情
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js" name="HonorContent">
export default {
  name: 'HonorContent',
  components: {},
  data () {
    const honorList = []
    return {
      honorList
    }
  },
  mounted () {
    this.fetchPostList()
  },
  methods: {
    fetchPostList () {
      const params = {
        honorsType: '2'
      }
      this.$api.getHonorList(params).then((res) => {
        if (res) {
          this.honorList = res
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
  .honor-header {
          margin-bottom: 10px;
    }
  .honor-list {
    display: flex;
    column-gap:  20px;
    row-gap:20px;
    flex-wrap: wrap;
    .honor-item {
        width: 304px;
        height: 360px;
        position: relative;
        cursor: pointer;
        .honor-img{
            width: 100%;
            height: 360px;
        }
        .honor-mask {
            position: absolute;
            bottom: 0px;
            width:100%;
            padding: 20px 18px;
            height: 60px;
            color: rgb(255, 255, 255);
            font-size: 16px;
            font-weight: 400;
            background: rgba(0, 0, 0, 0.7);
            transition: height 0.3s ease;
            .mask-title {

            }
            .mask-summary {
                display: none;
            }
            .mask-button {
                display: none;
            }
        }

    }
    .honor-item:hover {
        .honor-mask {
            height: 360px;
            transition: height 0.3s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .mask-summary {
                display: block;
                transition: display 0.3s ease;
                margin-top: 18px;
                font-size: 12px;
                font-weight: 400;
            }
            .mask-button {
                display: block;
                transition: display 0.3s ease;
                font-size: 12px;
                font-weight: 400;
            }
        }
    }
  }
</style>
