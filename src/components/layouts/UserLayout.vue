<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
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
          <!-- 招商引资平台管理系统 -->
        </div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <!-- <div class="links">
          <a href="http://doc.jeecg.com" target="_blank">帮助</a>
          <a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">隐私</a>
          <a href="https://github.com/zhangdaiscott/jeecg-boot/blob/master/LICENSE" target="_blank">条款</a>
        </div> -->
        <div class="copyright" style="color:#999">
          Copyright &copy; 2022 <a href="#" target="_blank"  style="color:#999">项目管理平台</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RouteView from "@/components/layouts/RouteView"
  import { mixinDevice } from '@/utils/mixin.js'

  export default {
    name: "UserLayout",
    components: { RouteView },
    mixins: [mixinDevice],
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
      // background: #f0f2f5 url(~@/assets/background.jpg) no-repeat 50% 2%;
      // background-size: 100% 130%;
      // padding: 110px 0 144px;
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
            // margin-left: 11px;
            // margin-top: 66px;
            // height: 102px;
            // vertical-align: top;
            // margin-right: 16px;
            // border-style: none;

            // margin-left: 57px;
            margin-top: 100px;
            height: 90px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, .85);
            // font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
  
</style>