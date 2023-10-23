<template>

  <a-card :bordered="false">
    <a-tabs default-active-key="1">
      <a-tab-pane tab="标准人力成本" key="1" forceRender>
        <bus-manpower-cost/>
      </a-tab-pane>
      <a-tab-pane tab="加班工资模版" key="2" forceRender>
        <bus-over-time-template-list/>
      </a-tab-pane>
      <a-tab-pane tab="计划人力成本角色" key="3" forceRender>
        <bus-plan-labor-cost-role-list/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import BusManpowerCost from '@views/bus/BusManpowerCost'
import BusOverTimeTemplateList from '@views/bus/BusOverTimeTemplateList'
import BusPlanLaborCostRoleList from '@views/bus/BusPlanLaborCostRoleList'
export default {
  name: 'ProjectSettings',
  components: {
    BusManpowerCost,
    BusOverTimeTemplateList,BusPlanLaborCostRoleList
  },
  data() {
    return {
    }
  },

  mounted () {
  },
  methods: {}
}
</script>

<style scoped>

</style>