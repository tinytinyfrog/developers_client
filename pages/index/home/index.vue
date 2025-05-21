<template>
  <div class="home-container">
    <div class="home-container-banner">
      <img src="~/assets/images/banner.png">
    </div>
    <div class="home-content">
      <div class="item">
        <g-card class="half-card">
          <template #title>
            <div style="margin-left:20px">
              <a-radio-group v-model="value" @change="onChange">
                <a-radio-button value="a">
                  最新
                </a-radio-button>
                <a-radio-button value="b">
                  最热
                </a-radio-button>
                <a-radio-button value="c">
                  推荐
                </a-radio-button>
              </a-radio-group>
            </div>
          </template>
        </g-card>
        <g-card class="half-card" title="AI学习天地" />
      </div>
      <div class="item">
        <g-card class="full-card" title="知识地图" />
      </div>
      <div class="item">
        <g-card class="half-card" title="事故复盘" />
        <g-card class="half-card" title="优秀案例" />
      </div>
      <div class="item">
        <g-card class="half-card" title="月刊" />
        <g-card class="half-card" title="沙龙" />
      </div>
      <div class="item">
        <g-card class="half-card" title="专家墙" />
        <g-card class="half-card" title="荣誉墙" />
      </div>
      <div class="item">
        <g-card class="full-card" title="优秀团队" />
      </div>
      <div class="item">
        <g-card class="half-card" title="贡献达人" />
        <g-card class="half-card" title="数据统计" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageHome'
}
</script>
<style lang="less" scoped>
.home-container {
    background: #F6F6F6;
    min-height:100vh;
    overflow:auto;
    &-banner {
        width:100%;
        height:300px
    }
 .home-content{
    padding:20px 96px;
    .item {
        margin-bottom:20px;
        display:flex;
        column-gap:20px;
        .half-card {
            width: calc((100% - (20px * 1)) / 2);
        }

        .full-card {
        width: 100%
    }
    }

 }
}
</style>
