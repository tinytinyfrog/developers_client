<template>
  <span class="g-space">
    <span v-html="spaceStr" />
    <span>|</span>
    <span v-html="spaceStr" />
  </span>
</template>
<script>
export default {
  name: 'GSPACE',
  props: {
    size: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      spaceStr: Array(this.size).fill('&nbsp;').join('')
    }
  }
}
</script>
<style lang="less" scoped>
.g-space {
  font-size: @font-fifth;
  color: @font-shallow-color;
}
</style>
