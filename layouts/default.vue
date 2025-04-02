<template>
  <div id="developers-pub">
    <a-config-provider :locale="locale">
      <Nuxt keep-alive :keep-alive-props="{ exclude: [/wiki\/.*/] }" />
    </a-config-provider>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      locale: zhCN
    }
  }
}

</script>

<style>
#developers-pub {
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>
