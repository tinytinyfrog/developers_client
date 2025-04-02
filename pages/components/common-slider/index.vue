<template>
  <GSidebar>
    <slot name="header" />
    <slot />
    <slot name="footer" />
    <slider-beian />
  </GSidebar>
</template>

<script>
import SliderBeian from '@/pages/components/slider-beian'
export default {
  name: 'CommonSlider',
  components: {
    SliderBeian
  }
}
</script>

<style scoped>

</style>
