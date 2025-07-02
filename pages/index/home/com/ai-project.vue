<template>
  <g-card class="half-card" title="AI项目实践" hide-more>
    <a-spin :spinning="loading">
      <template>
        <div v-if="projectList.length > 0" class="project">
          <a-carousel>
            <div v-for="(item, index) of projectList" :key="index" class="project-list">
              <div
                v-for="(k, i) of item.child"
                :key="i"
                class="project-item"
                @click="
                  (e) => {
                    handleGoto(k.actionUrl)
                  }
                "
              >
                <img class="img" :src="k.imgUrl">
                <div class="project-title">
                  <div :title="k.name" class="truncate">
                    <a-tag :color="stateColor[k.state]">
                      {{ k.stateDesc }}
                    </a-tag>
                    {{ k.name }}
                  </div>
                </div>
              </div>
            </div>
          </a-carousel>
        </div>
        <div v-else class="project project-empty">
          <a-empty />
        </div>
      </template>
    </a-spin>
  </g-card>
</template>
<script lang="js" name="Project">
import cookieUtils from '../../../../lib/cookie-utils'

export default {
  name: 'Project',
  data () {
    const projectList = []
    const loading = false
    const stateColor = {
      ONLINE: 'green',
      TESTING: 'purple',
      DEVELOPING: 'blue',
      PLANNING: 'orange'
    }
    return {
      projectList,
      loading,
      stateColor
    }
  },
  beforeMount () {
    this.fetchWikiprojects()
  },
  methods: {
    handleClick (e) {
      console.log(e, 'e')
    },
    handleGoto (path) {
      if (cookieUtils.getToken()) {
        window.open(path)
      } else {
        this.$message.warning('请先登录！')
      }
    },
    fetchWikiprojects () {
      const params = { pageNo: 1, pageSize: 100, filter: { } }
      this.loading = true
      this.$api.getAiPracticeList(params).then((res) => {
        console.log(res, 'res')
        if (Array.isArray(res)) {
          const list = []
          const count = Math.ceil(res.length / 2)
          for (let i = 0; i < count; i++) {
            list.push({ child: res.splice(0, 2) })
          }
          this.projectList = list
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
.project {
  padding: 36px 0px;
  .project-list {
    display: flex !important;
    column-gap: 30px;
    justify-content: center;
    .project-item {
      max-width: 250px;
      border-radius: 4px;
      box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
      padding: 14px;
      .img {
        width: 218px;
        height: 140px;
      }
      .project-title {
        margin: 26px 0px 6px 0px;
        width: 100%;
        color: rgb(40, 40, 40);
        cursor: pointer;
        font-size: 16px;
        font-weight: 400;
        display: flex;
        justify-content: center;
      }
    }
  }
  ::v-deep .ant-carousel .slick-slide {
    height: 260px !important;
    // line-height: 160px;
    // background: #364d79 !important;
    overflow: hidden;
  }
}
.project-empty {
  height: 332px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.truncate {
  text-align: center;
  width: 218px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
