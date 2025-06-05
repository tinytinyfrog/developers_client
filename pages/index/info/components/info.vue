<template>
  <a-spin :spinning="loading">
    <div>
      <div class="info-header">
        <a-input-search v-model="inputValue" placeholder="请输入关键字进行搜索" style="width: 320px" />
      </div>
      <div v-if="infoList.length > 0">
        <div v-for="(item,index) of infoList" :key="index" class="info-item">
          <div class="info-left">
            <img :src="item.coverImageUrl" class="info-img">
          </div>
          <div class="info-right">
            <div class="info-title" @click="e =>handleGoto(`/info/${item.id}?type=news`)">
              {{ item.title }}
            </div>
            <div class="info-content">
              {{ item.summary }}
            </div>
            <div class="info-bottom">
              <div class="bottom-left">
                <img src="~/assets/images/info/info.png" class="bottom-img">
                {{ item.categoryDesc }}
              </div>
              <div class="info-divier" />
              <div>时间：{{ item.createAtString }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <div class="info-pagination">
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
<script lang="js" name="InfoContent">

export default {
  name: 'InfoContent',
  components: {},
  data () {
    const infoList = []
    const pageSize = 10
    const current = 1
    const loading = false
    const inputValue = undefined
    return {
      infoList,
      pageSize,
      current,
      loading,
      inputValue
    }
  },
  watch: {
    inputValue (nVal, oVal) {
      this.fetchPostList()
    },
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        console.log(nVal, oVal)
        this.pageSize = nVal
        this.fetchPostList()
      }
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        this.current = nVal
        this.fetchPostList()
      }
    }
  },
  mounted () {
    this.fetchPostList()
  },
  methods: {
    fetchPostList () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          keyword: this.inputValue,
          activityType: 3
        }
      }
      this.loading = true
      this.$api.getInfoNews(params).then((res) => {
        this.infoList = res.list
        this.total = res.total
      }).catch().finally(() => {
        this.loading = false
      })
    },
    handleGoto (path) {
      this.$router.push(path)
    },
    getImgUrl (urlList) {
      console.log(urlList)
      if (!(typeof urlList === 'string')) {
        return ''
      }
      const urls = JSON.parse(urlList)

      if (urls.length > 0) {
        return urls[0]?.url
      } else {
        return ''
      }
    }
  }
}
</script>
<style scoped lang="less">
     .info-header {
        margin-bottom: 10px;

     }
     .info-item {
            display: flex;
            column-gap: 24px;
            padding: 18px 24px;
            // background: rgb(247, 249, 253);
            background:white;
            margin-top: 10px;
            .info-left {
                .info-img {
                    width: 228px;
                    height: 146px;
                }
            }
            .info-right {
                .info-title {
                    color: rgb(40, 40, 40);
                    font-size: 18px;
                    font-weight: 400;
                    &:hover {
                        color: #0070ff;
                        cursor: pointer;
                    }
                }

                .info-content {
                    color: rgb(89, 89, 89);
                    font-size: 14px;
                    font-weight: 400;
                    height: 70px;
                    margin: 10px 0;
                    display: -webkit-box;
                    overflow: hidden; /* 隐藏溢出的内容 */
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                }
                .info-bottom {
                    color: rgb(40, 40, 40);
                    font-size: 14px;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    column-gap: 12px;
                    .bottom-left {
                        display: flex;
                        align-items: center;
                        column-gap: 4px;
                        .bottom-img {
                        width: 18px;
                        height: 18px;

                    }
                    }
                    .info-divier {
                        height: 14px;
                        width: 1px;
                        background:  rgb(196, 196, 196);
                    }
                }

            }
        }
    .info-pagination {
        margin-top:24px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

</style>
