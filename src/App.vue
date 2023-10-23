<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enquireScreen from '@/utils/device'
  // import DevicePixelRatio from './utils/devicePixelRatio'
  export default {
    data () {
      return {
        locale: zhCN,
      }
    },
    created () {
      // new DevicePixelRatio().init()
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })
    }
  }
</script>
<style>
  @import './assets/fonts/fonts.css';
  #app {
    height: 100%;
  }
  body{
    font-family: '-apple-system, BlinkMacSystemFont, Source Han Sans CN, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-seri' !important;
    /* font-family: 'Source Han Sans CN' !important; */
    /* font-weight: 600 !important; */
    font-size: 14px !important;
  }
</style>