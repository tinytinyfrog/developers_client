<template>
  <div class="card-carousel" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div ref="inner" class="carousel-inner">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item"
        :style="getItemStyle(index)"
        @click="handleItemClick(index)"
      >
        <slot :item="item" :is-active="index === currentIndex" />
      </div>
    </div>
    <button
      class="carousel-arrow prev"
      @click.stop="prev"
    >
      &lt;
    </button>
    <button
      class="carousel-arrow next"
      @click.stop="next"
    >
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  name: 'Marquee',
  props: {
    items: {
      type: Array,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    autoplaySpeed: {
      type: Number,
      default: 3000
    }
  },
  data () {
    return {
      currentIndex: 0,
      timer: null,
      itemWidth: 0, // Will be calculated dynamically
      resizeTimeout: null
    }
  },
  watch: {
    items: {
      handler () {
        this.currentIndex = 0
        this.$nextTick(() => {
          this.updateItemWidth()
        })
      },
      deep: true
    }
  },
  mounted () {
    this.startAutoplay()
    this.$nextTick(() => {
      this.updateItemWidth()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    this.stopAutoplay()
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    updateItemWidth () {
      if (this.$refs.inner && this.$refs.inner.children[0]) {
        this.itemWidth = this.$refs.inner.children[0].offsetWidth
      }
    },
    handleResize () {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(() => {
        this.updateItemWidth()
      }, 200)
    },
    startAutoplay () {
      if (this.autoplay && !this.timer) {
        this.timer = setInterval(() => {
          this.next()
        }, this.autoplaySpeed)
      }
    },
    stopAutoplay () {
      clearInterval(this.timer)
      this.timer = null
    },
    next () {
      this.currentIndex = (this.currentIndex + 1) % this.items.length
    },
    prev () {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length
    },
    handleItemClick (index) {
      if (index === this.currentIndex) {
        this.$emit('active-item-click', this.items[index])
      } else {
        this.currentIndex = index
      }
    },
    getItemStyle (index) {
      if (!this.itemWidth) {
        if (index === 0) {
          return { position: 'static', visibility: 'hidden' }
        }
        return { display: 'none' }
      }

      const total = this.items.length
      const offset = index - this.currentIndex
      const spacing = this.itemWidth * 0.1
      const cardWidth = this.itemWidth

      let adjustedOffset = offset
      if (offset > total / 2) {
        adjustedOffset = offset - total
      } else if (offset < -total / 2) {
        adjustedOffset = offset + total
      }

      const isVisible = Math.abs(adjustedOffset) <= 2

      if (!isVisible) {
        return { display: 'none' }
      }

      const translateX = adjustedOffset * (cardWidth * 0.4 + spacing)
      const scale = adjustedOffset === 0 ? 1 : 0.8
      const zIndex = total - Math.abs(adjustedOffset)
      const opacity = Math.abs(adjustedOffset) > 1 ? 0.5 : 1

      return {
        '--item-width': `${cardWidth}px`,
        transform: `translateX(${translateX}px) scale(${scale})`,
        zIndex,
        opacity,
        transition: 'transform 0.5s ease, opacity 0.5s ease'
      }
    }
  }
}
</script>

<style scoped>
.card-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-item {
  position: absolute;
  width: var(--item-width);
  will-change: transform, opacity, z-index;
  cursor: pointer;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.85);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  box-shadow: 0 2px 12px 0 rgba(87, 130, 183, 0.4);
  transition: opacity 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.card-carousel:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover {
  background-color: #f5f7fa;
  box-shadow: 0 2px 16px 0 rgba(87, 130, 183, 0.6);
}

.carousel-arrow.prev {
  left: 220px;
}

.carousel-arrow.next {
  right: 220px;
}

/* Responsive Arrows */
@media (max-width: 1600px) {
  .carousel-arrow.prev {
    left: 15vw;
  }
  .carousel-arrow.next {
    right: 15vw;
  }
}

@media (max-width: 1440px) {
  .carousel-arrow.prev {
    left: 10vw;
  }
  .carousel-arrow.next {
    right: 10vw;
  }
}

@media (max-width: 992px) {
  .carousel-arrow.prev {
    left: 20px;
  }
  .carousel-arrow.next {
    right: 20px;
  }
}
</style>
