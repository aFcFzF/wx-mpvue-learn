<template>
  <div class="start-page">
    <div class="logo"></div>
    <div class="bottom">
      <!-- <button @click.prevent="captureLice" class="btn start">扫描资质文件</button> -->
      <button hover-class="btn-hover" @click.prevent="chooseLice" class="btn start">扫描资质文件</button>
    </div>
  </div>
</template>


<style scoped lang="less">

.start-page {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  padding:10px;
  box-sizing: border-box;
}

.start-page .logo {
  flex-grow: 1;
  background: url('http://jsplayer.cn/wx/start.png') no-repeat center;
  background-size: 100%;
}

.start-page .bottom {
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.btn{
  background-color: #3859F6;
  color: #fff;
  font-weight: bold;
  padding:0 30px;
  &.btn-hover {
    background-color: rgb(39, 69, 219);
  }
}

</style>


<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World'
    }
  },

  components: {
    card
  },

  methods: {
    captureLice () {
      console.log('要跳转')
      wx.navigateTo({
        url: '/pages/capture/main'
      })
    },

    chooseLice () {
      console.log('要选择')
      wx.chooseImage({
        count: 1,
        // sizeType: 'origin',
        success (fileObj) {
          wx.navigateTo({
            url: '/pages/cope/main?file=' + fileObj.tempFilePaths[0]
          })
        },
        fail (a, b) {
          wx.showModal({
            title: '出错了',
            content: '请联系管理员查看具体出错原因',
            showCancel: false,
            success (res) {
              console.log(res)
            }
          })
        }
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>


