<template>
  <g-card class="half-card" title="专家墙" :go-to="e => handleGoto(`/info?type=expert`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="expertList.length > 0" class="expert">
          <a-carousel>
            <div v-for="(item,index) of expertList" :key="index" class="expert-list">
              <div v-for="(k,i) of item.child" :key="i" class="expert-item" @click="e => handleGoto(`/info/${k.id}?type=expert`)">
                <div class="expert-img">
                  <img class="img" :src="k.imageUrl">
                  <img class="medal" src="~/assets/images/home/medal.png">
                </div>
                <div class="text">
                  <div class="name" :title="`${ k.honorsOwner || '-' }(${k.userCode || '-' })`">
                    {{ `${ k.honorsOwner || '-' }(${k.userCode || '-' })` }}
                  </div>
                  <div class="info" :title="k.honorsDomain || '-' ">
                    擅长领域：{{ k.honorsDomain || '-' }}
                  </div>
                  <div class="info" :title=" k.honorsDept|| '-' ">
                    部门：{{ k.honorsDept|| '-' }}
                  </div>
                </div>
              </div>
            </div>
          </a-carousel>
        </div>
        <div v-else class="expert expert-empty">
          <a-empty />
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Expert">
export default {
  name: 'Expert',
  data () {
    const expertList = []
    const loading = false
    return {
      expertList,
      loading
    }
  },
  beforeMount () {
    this.fetchExpertList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchExpertList () {
      const params = {
        honorsType: '1'
      }
      this.loading = true
      this.$api.getHonorList(params).then((res) => {
        if (res.length <= 4) {
          this.expertList = [{
            child: res
          }]
        } else {
          this.expertList = [{
            child: res.splice(0, 4)
          }, {
            child: res.splice(0, 4)
          }]
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
  <style scoped lang="less">
    .expert {
    padding: 16px 22px;
    width: 100%;
    padding-bottom: 32px;
    .expert-list {
      background-image: url('~/assets/images/home/expert-bg.png');
      height: 300px;
      display: flex !important;
      flex-wrap: wrap;
      column-gap:14px;
      padding: 26px 16px;
      row-gap: 14px;
     .expert-item {
      width: calc((100% - (14px * 1)) / 2);
      display: flex;
      border: 1px solid rgb(255, 255, 255);
      border-radius: 8px;
      box-shadow: 0px 4px 24px 0px rgba(0, 159, 255, 0.12);
      background: rgba(255, 255, 255, 0.6);
      padding: 16px;
      column-gap:20px;
      height: 116px;
      cursor:pointer;
       .expert-img {
         position: relative;
            .img {
            width: 70px;
            height: 70px;
            border-radius: 70px;
            object-fit: cover;
          }
          .medal{
            width: 60px;
            height: 30px;
            position: absolute;
            bottom: 4px;
            right: 5px;
          }

       }

       .name {
        color: rgb(40, 40, 40);
        font-size: 18px;
        font-weight: 400;
        width:160px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
       }
       .info {
        color: rgb(89, 89, 89);
        font-size: 14px;
        font-weight: 400;
        margin-top: 4px;
        width:180px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
       }
     }
    }
  }
  .expert-empty {
       height: 348px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  </style>
