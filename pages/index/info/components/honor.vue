<template>
  <a-spin :spinning="loading">
    <div>
      <div class="honor-header">
        <a-input-search v-model="inputValue" placeholder="请输入关键字进行搜索" style="width: 320px" />
      </div>
      <div v-if="honorList.length > 0" class="honor-list">
        <div v-for="(item,index) of honorList" :key="index" class="honor-item">
          <img :src="item.imageUrl" class="honor-img">
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
      <div v-else>
        <a-empty />
      </div>
      <div class="honor-pagination">
        <a-pagination
          v-model="current"
          :page-size.sync="pageSize"
          :total="total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `总共${total}条`"
        />
      </div>
    </div>
  </a-spin>
</template>
<script lang="js" name="HonorContent">
export default {
  name: 'HonorContent',
  components: {},
  data () {
    const honorList = []
    const pageSize = 10
    const current = 1
    const loading = false
    const inputValue = undefined
    return {
      honorList,
      pageSize,
      current,
      loading,
      inputValue
    }
  },
  watch: {
    inputValue (nVal, oVal) {
      this.fetchHonorList()
    },
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        console.log(nVal, oVal)
        this.pageSize = nVal
        this.fetchHonorList()
      }
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        this.current = nVal
        this.fetchHonorList()
      }
    }
  },
  mounted () {
    this.fetchHonorList()
  },
  methods: {
    fetchHonorList () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          keyword: this.inputValue,
          honorsType: '2'
        }
      }
      this.loading = true
      this.$api.getInfoHonorList(params).then((res) => {
        if (res) {
          this.honorList = res
          this.total = res.total
        }
      }).finally(() => {
        this.loading = false
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

  .honor-pagination {
          margin-top:24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
      }
</style>
