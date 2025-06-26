<template>
  <a-spin :spinning="loading">
    <div>
      <div class="salon-header">
        <a-input-search
          v-model="inputValue"
          placeholder="请输入关键字进行搜索"
          style="width: 320px"
        />
      </div>
      <div v-if="salonList.length > 0" class="salon-list">
        <div v-for="(item, index) of salonList" :key="index" class="salon-item">
          <img :src="item.coverImageUrl" class="salon-img">
          <div class="salon-mask">
            <div>
              <div class="mask-item">
                {{ item.title }}
              </div>
              <div class="mask-summary">
                {{ item.summary }}
              </div>
            </div>
            <div class="mask-button">
              <a-button
                type="primary"
                shape="round"
                @click="(e) => handleGoto(`/info/${item.id}?type=salon`)"
              >
                查看详情
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <div class="salon-pagination">
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
<script lang="js" name="SalonContent">
export default {
  name: 'SalonContent',
  components: {},
  data () {
    const salonList = []
    const pageSize = 10
    const current = 1
    const loading = false
    const inputValue = undefined
    return {
      salonList,
      pageSize,
      current,
      loading,
      inputValue
    }
  },
  watch: {
    inputValue (nVal, oVal) {
      this.fetchsalonList()
    },
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        console.log(nVal, oVal)
        this.pageSize = nVal
        this.fetchsalonList()
      }
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        this.current = nVal
        this.fetchsalonList()
      }
    }
  },
  mounted () {
    this.fetchsalonList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchsalonList () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          keyword: this.inputValue,
          activityType: '2'
        }
      }
      this.loading = true
      this.$api.getInfoNews(params).then((res) => {
        if (res) {
          this.salonList = res.list
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
.salon-header {
  margin-bottom: 10px;
}
.salon-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1300px;
  margin: 0 auto;
  .salon-item {
    width: 100%;
    height: 360px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    .salon-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      transition: transform 0.3s ease;
    }
    .salon-mask {
      position: absolute;
      bottom: 0px;
      width: 100%;
      padding: 20px 18px;
      height: 60px;
      color: rgb(255, 255, 255);
      font-size: 16px;
      font-weight: 400;
      background: rgba(0, 0, 0, 0.7);
      transition: height 0.3s ease;
      .mask-summary {
        display: none;
      }
      .mask-button {
        display: none;
      }
    }
  }
  .salon-item:hover {
    .salon-img {
      transform: scale(1.1);
    }
    .salon-mask {
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
@media (max-width: 1200px) {
  .salon-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 992px) {
  .salon-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .salon-list {
    grid-template-columns: 1fr;
  }
}

.salon-pagination {
  margin-top: 24px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
