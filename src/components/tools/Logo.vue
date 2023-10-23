<template>
  <div class="logo" style="padding-left: 0;text-align: center;">
    <!-- <router-link :to="{name:'dashboard'}"> -->

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <img v-if="navTheme === 'dark'&& !collapsed" src="~@/assets/centific logo pink and white.png" alt="logo" style="margin-left: 6px;">
      <img v-else src="~@/assets/logo2.png" alt="logo" style="margin-left: 6px;width: 32px;height: 32px;">
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->

      <h1 v-if="showTitle">{{ title }}</h1>
    <!-- </router-link> -->
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      // background-color: #001529;
    }
  }
</style>