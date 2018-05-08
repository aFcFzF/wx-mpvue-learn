<template>
  <div class="info-page">
    <h3>一共 {{info.words_result_num}} 条</h3>
    <p :key="value.id" v-for="(name, value) in info.words_result">{{name - value}}</p>
  </div>
</template>

<style scoped lang="less">

.info-page {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  box-sizing: border-box;
}

</style>


<script>

export default {
  data () {
    return {
      motto: 'Hello World',
      info: {
        words_result_num: '',
        words_result: []
      }
    }
  },

  methods: {

  },

  mounted () {
    const query = this.$root.$mp.query
    const data = query.data
    const info = this.info = JSON.parse(data)
    console.log('没传过来?', info)
    // info.words_result.forEach((e, i) => (e.id = '_' + i))
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>


