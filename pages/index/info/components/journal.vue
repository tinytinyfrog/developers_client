<template>
  <a-spin :spinning="loading">
    <div>
      <div class="journal-header">
        <a-input-search v-model="inputValue" placeholder="请输入关键字进行搜索" style="width: 320px" />
      </div>
      <div v-if="journalList.length > 0" class="journal-list">
        <div v-for="(item,index) of journalList" :key="index" class="journal-item">
          <img :src="item.coverImageUrl" class="journal-img">
          <div class="journal-mask">
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
      <div class="journal-pagination">
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
<script lang="js" name="JournalContent">
export default {
  name: 'JournalContent',
  components: {},
  data () {
    const journalList = []
    const pageSize = 10
    const current = 1
    const loading = false
    return {
      journalList,
      pageSize,
      current,
      loading
    }
  },
  watch: {
    inputValue (nVal, oVal) {
      this.fetchjournalList()
    },
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        console.log(nVal, oVal)
        this.pageSize = nVal
        this.fetchjournalList()
      }
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        this.current = nVal
        this.fetchjournalList()
      }
    }
  },
  mounted () {
    this.fetchjournalList()
  },
  methods: {
    fetchjournalList () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          keyword: this.inputValue,
          activityType: 1
        }
      }
      this.loading = true
      this.$api.getInfoNews(params).then((res) => {
        if (res) {
          this.journalList = res.list
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
 .journal-header {
          margin-bottom: 10px;
    }
  .journal-list {
    display: flex;
    column-gap:  20px;
    row-gap:20px;
    flex-wrap: wrap;
    .journal-item {
        width: 304px;
        height: 360px;
        position: relative;
        cursor: pointer;
        .journal-img{
            width: 100%;
            height: 360px;
        }
        .journal-mask {
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
    .journal-item:hover {
        .journal-mask {
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

  .journal-pagination {
          margin-top:24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
      }
</style>
