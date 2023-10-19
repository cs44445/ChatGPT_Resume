<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <img src="~@/assets/bk1.png" class="left">
      <img src="~@/assets/bk2.png" class="right">
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="~@/assets/logo-white.svg" class="logo" alt="logo">
            <span class="title"></span>
          </a>
        </div>
        <div class="desc">
        </div>
      </div>
      <login></login>
    </div>
  </div>
</template>

<script>
  import Login from "@/components/LoginComponent/index"

  export default {
    name: "UserLayout",
    components: { Login },
    data () {
      return {}
    },
    mounted () {
      document.body.classList.add('userLayout')
    },
    beforeDestroy () {
      document.body.classList.remove('userLayout')
    },
  }
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      overflow: hidden;
      width: 100%;
      min-height: 100%;
      height: 100vh;
      background-color:#EFEFEF;
      position: relative;
      .left{
        position: absolute;
        width: 24%;
        zoom:10;
        left: 0;
        top: 3px;
      }
      .right{
        position: absolute;
        width: 38%;
        zoom:10;
        right: 0;
        top: 6px;
        margin-right: -14%;
      }

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            margin-top: 100px;
            height: 90px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 500px;
        margin: 0 auto;
      }
    }
  }
  
</style>