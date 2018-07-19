<template>
  <div class="start-page">
    <div class="logo"></div>
    <div class="bottom">
      <!-- <button @click.prevent="captureLice" class="btn start">扫描资质文件</button> -->
      <button @click.prevent="chooseLice" class="btn start">扫描资质文件</button>
    </div>
  </div>
</template>


<style scoped lang="less">
@import '~@/common/var.less';
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
  .color-primary-btn();
  color: #fff;
  font-weight: bold;
  padding:0 30px;

}

</style>


<script>
import card from '@/components/card'
import res from './mock.json'

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
          wx.showLoading({
            title: '数据请求中',
            mask: true
          })

          setTimeout(_ => {
            if (res.status) {
              wx.hideLoading()
              return wx.showModal({
                title: '错误信息',
                content: res.msg,
                showCancel: false
              })
            }
            wx.hideLoading()
            wx.navigateTo({
              url: '/pages/cope/main?file=' + fileObj.tempFilePaths[0] + '&recoInfo=' + JSON.stringify(res.data)
            })
          }, 1000)
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


