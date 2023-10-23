<template>

  <a-card :bordered="false">
    <a-tabs default-active-key="1" @change="selectTab">
      <a-tab-pane tab="省份" key="1" forceRender>
        <sys-region-province-list/>
      </a-tab-pane>
      <a-tab-pane tab="城市" key="2" forceRender>
        <sys-region-city-list/>
      </a-tab-pane>
       <a-tab-pane tab="区县" key="3" forceRender>
         <sys-region-area-list/>
        </a-tab-pane>

    </a-tabs>
  </a-card>
</template>

<script>
  import SysRegionAreaList from '@views/system/SysRegionAreaList'
  import SysRegionCityList from '@views/system/SysRegionCityList'
  import SysRegionProvinceList from '@views/system/SysRegionProvinceList'

  import { getAction } from '@/api/manage'
  import { USER_AUTH } from '@/store/mutation-types'

  export default {
    name: 'count',
    components: {
      SysRegionAreaList,
      SysRegionCityList,
      SysRegionProvinceList
    },
    data() {
      return {
        activeKey: 1,
      }
    },
    mounted() {
      this.selectPage(1)
    },

    methods: {
      selectPage (type) {
        let that = this
        if(!type){
          that.activeKey = "1";
          return;
        }
        that.activeKey = type;
      },
      selectTab(e){
        this.activeKey = e;
      }
    },
  }
</script>

<style scoped>

</style>