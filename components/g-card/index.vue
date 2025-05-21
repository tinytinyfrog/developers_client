<template>
  <div class="g-card">
    <div class="title">
      <div class="title-left">
        <slot name="title">
          <div class="block" />
          <div class="default">
            {{ title }}
          </div>
        </slot>
      </div>
      <div class="title-right">
        <slot name="extra">
          <div class="more">
            更多 ><div />
          </div>
        </slot>
      </div>
    </div>
    <div>
      <slot>
        默认内容
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GCard',
  props: {
    title: {
      type: String,
      default: '默认标题'
    }

  }
}
</script>
<style lang="less" scoped>
    .g-card {
        border-radius:4px;
        background:#fff;
        width:100%;
        height:100%;
        box-shadow: 0px 4px 24px 0px rgba(193, 207, 227, 0.24);
        .title {
            padding: 16px 14px 16px 0;
            height:54px;
            display:flex;
            justify-content: space-between;
            width:100%;
            border-bottom: 1px solid rgb(226, 232, 246);
            &-right {

                    .more {
                        color:#0060ff;
                        cursor:pointer;
                    }

            }
            &-left {
                display:flex;
                column-gap:10px;
                align-items: center;
                .block{
                    width: 6px;
                    height: 16px;
                    background: rgb(0, 112, 255);
                }
                .default {
                    color: rgb(40, 40, 40);
                    font-family: PingFang SC;
                    font-size: 18px;
                    font-weight: 400;
                }

            }
        }
    }
</style>
