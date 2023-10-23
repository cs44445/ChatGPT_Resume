<template>

  <a-card :bordered="false">
    <a-tabs default-active-key="1" @change="selectTab">
      <a-tab-pane tab="一线城市" key="1" forceRender>
        <bus-labor-cost-list :setType="setType"/>
      </a-tab-pane>
      <a-tab-pane tab="二线城市" key="2" forceRender>
        <bus-labor-cost-list :setType="setType"/>
      </a-tab-pane>
      <a-tab-pane tab="三线城市" key="3" forceRender>
        <bus-labor-cost-list :setType="setType"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
  import BusLaborCostList from '@views/bus/BusLaborCostList'
  export default {
    name: 'ProjectSettings',
    components: {
      BusLaborCostList,
    },
    data() {
      return {
        setType:'',
      }
    },

    mounted () {
    },
    methods: {
      selectTab(key){
        if(key == "1"){
          this.setType = "1";
        }
        if(key == "2"){
          this.setType = "2";
        }
        if(key == "3"){
          this.setType = "3";
        }
        // console.log(key)
      },
    }
  }
</script>

<style scoped>

</style>