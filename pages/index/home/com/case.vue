<template>
  <g-card class="half-card" title="优秀案例" :go-to="e => handleGoto(`/wiki?wikiId=1052949`)">
    <template>
      <a-spin :spinning="loading">
        <div class="info-content">
          <div v-for="(item,index) of caseList" :key="index" class="info-item" @click="e => handleGoto(`/wiki/${item.postsId}?wikiId=1052949`)">
            <div class="item-left">
              <div class="case-icon">
                <img src="~/assets/images/home/like.png" class="img">
              </div>
              <div class="content" :title="item.postsTitle">
                {{ item.postsTitle }}
              </div>
            </div>
            <div class="item-right">
              <a-avatar style="width:20px;height:20px" :src="item.authorAvatar ||defaultImg" />
              <div class="name">
                {{ item.authorNickname || '-' }}
              </div>
              <div class="divier" />
              <div>
                {{ item.createAtString }}
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Case">
export default {
  name: 'Case',
  data () {
    const caseList = []
    const loading = false
    return {
      caseList,
      loading
    }
  },
  beforeMount () {
    this.fetchCaseList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchCaseList () {
      this.loading = true
      this.$api.getCaseList().then((res) => {
        console.log(res, 'res')
        if (res?.nodeList.length > 0)
          this.caseList = res.nodeList
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
    .info-content {
        padding: 22px 20px;
        height: 542px;
        .block {
          display: flex;
          column-gap: 20px;
          .block-item {
            width: calc((100% - (20px * 1)) / 2);
            border-radius: 4px;
            background: rgb(241, 247, 254);
            height: 150px;
            display: flex;
            column-gap: 20px;
            padding: 16px;
            .img {
              width: 118px;
              height: 118px;
            }
            margin-bottom: 28px;
            .content {
              flex: 1;
              color: rgb(40, 40, 40);
              font-size: 14px;
              font-weight: 400;
              display: -webkit-box;
              overflow: hidden; /* 隐藏溢出的内容 */
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
              height: 108px;
            }
          }
        }
        .info-item {
            display:flex;
            column-gap: 20px;
            justify-content: space-between;
            padding: 18px 12px;
            border-bottom: 1px solid rgb(226, 232, 246);
            cursor: pointer;
            .full-item {
                display:flex;
                column-gap: 8px;
                width: 100%;
                align-items:center;
            }
            .item-left {
                display:flex;
                column-gap: 8px;
                flex:1;
                align-items:center;
                width: 0;
                .review-icon {
                  width:24px;
                  height:24px;
                  border-radius: 2px;
                  background: rgb(250, 100, 1);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }

                .case-icon {
                  width:24px;
                  height:24px;
                  border-radius: 2px;
                  background: rgb(28, 196, 121);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .img {
                        width:14px;
                        height:14px;
                    }
                .tag {
                    min-width:40px
                }
                .content {
                    flex:1;
                    color: rgb(40, 40, 40);
                    font-size: 14px;
                    font-weight: 400;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */

                }
                .content-warning {
                    flex:1;
                    color:rgb(250, 100, 1);
                    font-size: 14px;
                    font-weight: 400;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */

                }
            }
            .item-right {
                display:flex;
                column-gap: 8px;
                align-items:center;
                min-width: 38%;
                .item-avatar {
                  width: 24px;
                  height: 24px;
                }
                .name {
                    width:60px;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */

                }
                .divier {
                    width :1px;
                    background:rgb(196, 196, 196);
                    height:18px
                }
            }
        }

    }
</style>
