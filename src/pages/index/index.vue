<template>
  <div class="start-page">
    <div class="logo"></div>
    <div class="bottom">
      <!-- <button @click.prevent="captureLice" class="btn start">扫描资质文件</button> -->
      <button @click.prevent="chooseLice" class="btn start">选择资质文件</button>
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

import config from '@/utils/config'

import {selectAndUpload} from '@/utils/index'

export default {
  data () {
    return {
      motto: 'Hello World'
    }
  },

  methods: {
    captureLice () {
      wx.navigateTo({
        url: '/pages/capture/main'
      })
    },
    chooseLice () {
      selectAndUpload(config.domain.getDomain() + '/sendToAuthAjax', {callbackkey: this.callbackkey})
      .then(data => {
        if (data === false) return null
        const {licePic, checkresult, callbackkey} = data
        wx.navigateTo({
            url: '/pages/cope/main?file=' + licePic + '&recoInfo=' + JSON.stringify({checkresult, callbackkey})
        })
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>


