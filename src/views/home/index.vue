<!--
 * @Description: 首页
 * @Author: lxd
 * @Date: 2020-06-08 17:31:42
 * @LastEditTime: 2020-07-28 16:14:07
-->
<template>
  <div class="home-wrap">
    <div class="text">
      欢迎使用
      <p>{{ nowDate | formatDate('yyyy-MM-dd hh:mm:ss') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      nowDate: new Date()
    }
  },
  mounted() {
    const interval = setInterval(() => {
      this.nowDate = new Date()
    }, 1000)
    this.$once('hook:beforeDestroy', () => {
      console.log('clear')
      clearInterval(interval)
    })
  }
}
</script>

<style lang="scss" scoped>
.home-wrap {
  .text {
    margin-top: 100px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
