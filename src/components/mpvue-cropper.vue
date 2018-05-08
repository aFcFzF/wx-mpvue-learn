<template>
  <canvas
      canvas-id="__mpvue_cropper__"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      disable-scroll
      :style="{ width: _width + 'px', height: _height + 'px', background: 'rgba(0, 0, 0, .8)' }">
  </canvas>
</template>

<script>
  import WeCropper from 'we-cropper'
  console.log('引入了吗', WeCropper)

  const CANVAS_ID = '__mpvue_cropper__'

  export default {
    name: 'mpvue-cropper',
    props: {
      option: {
        type: Object
      }
    },
    data () {
      return {
        _we_cropper: null
      }
    },
    computed: {
      _width () {
        return this.option.width
      },
      _height () {
        return this.option.height
      }
    },
    methods: {
      touchstart ($event) {
        console.log('start')
        this._we_cropper.touchStart($event.mp)
      },
      touchmove ($event) {
        console.log('move')
        this._we_cropper.touchMove($event.mp)
        // wx.showToast({
        //   title: '滑动了'
        // })
      },
      touchend ($event) {
        this._we_cropper.touchEnd($event.mp)
      },
      pushOrigin (src) {
        this._we_cropper.pushOrign(src)
      },
      updateCanvas () {
        this._we_cropper.updateCanvas()
      },
      getCropperBase64 () {
        return new Promise((resolve, reject) => {
          this._we_cropper.getCropperImage(src => {
            src ? resolve(src) : reject()
          })
        })
      },
      getCropperImage () {
        return new Promise((resolve, reject) => {
          this._we_cropper.getCropperImage(src => {
            src ? resolve(src) : reject()
          })
        })
      }
    },
    mounted () {
      console.log('第一次this', this)
      this._we_cropper = new WeCropper(Object.assign(this.option, {
        id: CANVAS_ID
      }))
      .on('ready', (...args) => {
        this.$emit('ready', ...args)
      })
      .on('beforeImageLoad', (...args) => {
        this.$emit('beforeImageLoad', ...args)
      })
      .on('imageLoad', (...args) => {
        this.$emit('imageLoad', ...args)
      })
      .on('beforeDraw', (...args) => {
        this.$emit('beforeDraw', ...args)
      })
      .updateCanvas()
    }
  }
</script>