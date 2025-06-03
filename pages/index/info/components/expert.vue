<template>
  <a-spin :spinning="loading">
    <div>
      <div class="expert-header">
        <a-input-search placeholder="请输入关键字进行搜索" style="width: 320px" />
      </div>
      <div v-if="expertList.length > 0">
        <div v-for="(item,index) of expertList" :key="index" class="expert-item">
          <div class="expert-left">
            <img :src="item.imageUrl" class="expert-img">
          </div>
          <div class="expert-right">
            <div class="expert-title">
              {{ item.title }}
            </div>
            <div class="expert-content">
              {{ item.summary }}
            </div>
            <div class="expert-bottom">
              <div class="bottom-left">
                <img src="~/assets/images/info/info.png" class="bottom-img">
                {{ item.honorsDomain }}
              </div>
              <div class="expert-divier" />
              <div>时间：{{ item.createAtString || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <div class="expert-pagination">
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
    </div>
  </a-spin>
</template>
<script lang="js" name="HonorContent">

// const salon1Img = require('@/assets/images/home/salon1.png')
// const salon2Img = require('@/assets/images/home/salon2.png')
// const infoList = [{
//   title: '资讯标题展示信息文案',
//   content: '低代码开发平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率。低代码开过可视化界面和少量代码快速构建应用程序的工具，显著降低平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率',
//   type: '资讯中心',
//   createAt: '2025-03-21',
//   icon: salon1Img
// },
// {
//   title: '资讯标题展示信息文案',
//   content: '低代码开发平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率。低代码开过可视化界面和少量代码快速构建应用程序的工具，显著降低平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率',
//   type: '资讯中心',
//   createAt: '2025-03-21',
//   icon: salon2Img
// },
// {
//   title: '资讯标题展示信息文案',
//   content: '低代码开发平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率。低代码开过可视化界面和少量代码快速构建应用程序的工具，显著降低平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率',
//   type: '资讯中心',
//   createAt: '2025-03-21',
//   icon: salon1Img
// }, {
//   title: '资讯标题展示信息文案',
//   content: '低代码开发平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率。低代码开过可视化界面和少量代码快速构建应用程序的工具，显著降低平台(Low-Code Development Platform，LCDP)是一种通过可视化界面和少量代码快速构建应用程序的工具，显著降低了开发门槛并提升了效率',
//   type: '资讯中心',
//   createAt: '2025-03-21',
//   icon: salon2Img
// }]
export default {
  name: 'HonorContent',
  components: {},
  data () {
    const expertList = []
    const pageSize = 10
    const current = 1
    const loading = false
    return {
      expertList,
      pageSize,
      current,
      loading
    }
  },
  watch: {
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) this.fetchExpertList()
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) this.fetchExpertList()
    },
    inputValue (nVal, oVal) {
      this.fetchExpertList()
    }
  },
  mounted () {
    this.fetchExpertList()
  },
  methods: {
    fetchExpertList () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          keyword: this.inputValue,
          honorsType: '1'
        }
      }
      this.loading = true
      this.$api.getInfoHonorList(params).then((res) => {
        if (res) {
          this.expertList = res.list
          this.total = res.total
        }
      }).finally(() => {
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
       .expert-header {
          margin-bottom: 10px;

       }
       .expert-item {
              display: flex;
              column-gap: 24px;
              padding: 18px 24px;
              // background: rgb(247, 249, 253);
              background:white;
              margin-top: 10px;
              .expert-left {
                  .expert-img {
                      width: 140px;
                      height: 152px;
                  }
              }
              .expert-right {
                  .expert-title {
                      color: rgb(40, 40, 40);
                      font-size: 18px;
                      font-weight: 400;
                      &:hover {
                          color: #0070ff;
                          cursor: pointer;
                      }
                  }

                  .expert-content {
                      color: rgb(89, 89, 89);
                      font-size: 14px;
                      font-weight: 400;
                      margin: 12px 0px 30px 0px;
                      display: -webkit-box;
                      overflow: hidden; /* 隐藏溢出的内容 */
                      -webkit-line-clamp: 3;
                      -webkit-box-orient: vertical;
                      height:60px;
                  }
                  .expert-bottom {
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
                      .expert-divier {
                          height: 14px;
                          width: 1px;
                          background:  rgb(196, 196, 196);
                      }
                  }

              }
          }
      .expert-pagination {
          margin-top:24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
      }

  </style>
