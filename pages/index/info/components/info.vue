<template>
  <a-spin :spinning="loading">
    <div>
      <div class="info-header">
        <a-input placeholder="请输入关键字进行搜索" style="width: 320px" />
      </div>
      <div v-for="(item,index) of infoList" :key="index" class="info-item">
        <div class="info-left">
          <img :src="item.icon" class="info-img">
        </div>
        <div class="info-right">
          <div class="info-title" @click="e => handleGoto(`/info/${item.id}`)">
            {{ item.title }}
          </div>
          <div class="info-content">
            {{ item.introduction }}
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
      <div class="info-pagination">
        <a-pagination
          v-model="current"
          :page-size="pageSize"
          :total="total"
          show-size-changer
          show-quick-jumper
        />
      </div>
    </div>
    </div>
  </a-spin>
</template>
<script lang="js" name="InfoContent">

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
  name: 'InfoContent',
  components: {},
  data () {
    const infoList = []
    const pageSize = 5
    const current = 1
    const loading = false
    return {
      infoList,
      pageSize,
      current,
      loading
    }
  },
  watch: {
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) this.fetchPostList()
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) this.fetchPostList()
    }
  },
  mounted () {
    this.fetchPostList()
  },
  methods: {
    fetchPostList () {
      const params = { pageSize: this.pageSize, pageNo: this.current, filter: { category: 'INFORMATION' }, data: true }
      this.loading = true
      this.$api.getPostList(params).then((res) => {
        console.log(res, 'info res')
        this.infoList = res.list
        this.total = res.total
      }).catch().finally(() => {
        this.loading = false
      })
    },
    handleGoto (path) {
      this.$router.push(path)
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
            background: rgb(247, 249, 253);
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
                    margin: 12px 0px 30px 0px;
                    display: -webkit-box;
                    overflow: hidden; /* 隐藏溢出的内容 */
                    -webkit-line-clamp: 3;
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
