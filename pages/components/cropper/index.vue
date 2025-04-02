<template>
  <div @click="uploadFile">
    <input
      ref="uploadInput"
      class="upload-img-box"
      type="file"
      hidden
      accept="image/png,image/jpeg"
      @change="onChange"
    >
    <slot />
    <a-modal
      v-model="showCropper"
      title="裁剪头像"
      width="600px"
    >
      <div class="cropper-content" style="display: flex; min-width: 350px; height: 350px">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
          :center-box="option.centerBox"
          :info-true="option.infoTrue"
          :fixed-box="option.fixedBox"
          :mode="option.mode"
          @realTime="realTime"
        />
        <div class="preview-img" :style="previewBoxStyle">
          <div v-if="previews.url" :style="previewStyle">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button key="back" @click="retryUpload">
          重新上传
        </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="upload">
          开始上传
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    screenshotNumber: {
      type: Array,
      default: () => [7, 10]
    }
  },
  data () {
    return {
      loading: false,
      showCropper: false,
      option: {
        img: 'https://static.developers.pub/12fc1084f5884fd898d73ebe5d8d7357', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 120, // 默认生成截图框宽度
        autoCropHeight: 172, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: this.screenshotNumber, // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        mode: 'cover' // cover  图片铺满容器
      },
      previews: {},
      previewBoxStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '25px',
        minWidth: '140px'
      }
    }
  },
  methods: {
    retryUpload () {
      this.showCropper = false
      this.$nextTick(() => {
        this.uploadFile()
      })
    },
    uploadFile () {
      try {
        this.$refs.uploadInput.value = ''
        this.$refs.uploadInput.click()
      } catch (e) {
      }
    },
    // 点击上传按钮后的事件
    onChange (e) {
      const file = e.target.files[0]
      // this.createReader(file, (w, h) => {
      //   // if (w < 1200 || h < 240) {
      //   //   self.$message.error('请上传宽度大于 1200px，高度大于 240px 的封面图片。')
      //   //   const UFI = document.getElementById('uploadFileInput')
      //   //   UFI.value = ''
      //   // } else {
      //   //   self.file2base64(file)
      //   // }
      //   self.file2base64(file)
      // })
      this.file2base64(file)
    },
    realTime (previews) {
      this.previewStyle = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '0',
        border: '1px solid #dedede',
        borderRadius: '3px',
        zoom: (140 / previews.w)
      }
      this.previews = previews
    },
    // 获取图片宽高
    createReader (file, whenReady) {
      const reader = new FileReader()
      reader.onload = function (evt) {
        const image = new Image()
        image.onload = function () {
          const width = this.width
          const height = this.height
          if (whenReady) {
            whenReady(width, height)
          }
        }
        image.src = evt.target.result
      }
      reader.readAsDataURL(file)
    },
    // file类型文件 转base64文件类型
    file2base64 (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      const self = this
      reader.onload = function (e) {
        // 图片base64化
        const newUrl = this.result // 图片路径
        self.$nextTick(() => {
          // self.pageImage = newUrl
          self.option.img = newUrl
          self.dialogVisible = true
          self.showCropper = true
        })
      }
    },
    // 点击确定，这一步是可以拿到处理后的地址, 然后上传到服务器
    upload () {
      this.loading = true
      try {
        this.$refs.cropper.getCropBlob((data) => {
          console.log(data)
          // 将接收到blod文件对象转为file
          const file = new File([data], 'cropper.jpg', {
            type: data.type,
            lastModified: Date.now()
          })
          const params = new FormData()
          params.append('file', file)
          this.$api.uploadImageByArticle(params).then((res) => {
            this.loading = false
            if (res.length) {
              this.$emit('on-img', res[0].url)
              this.showCropper = false
              return
            }
            this.$message.error('图片上传异常')
          })
        })
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>
