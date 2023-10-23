<template>
  <a-card :bordered="false">

    <a-tabs>
      <a-tab-pane tab="员工" key="1" forceRender>
        <bus-user-list/>
      </a-tab-pane>

      <a-tab-pane tab="客户" key="2" forceRender>
        <bus-custom-list/>
      </a-tab-pane> 
      
    </a-tabs>
  </a-card>
</template>

<script>
  import BusUserList from '@views/sys/BusUserList'
  import BusCustomList from '@views/sys/BusCustomList'

  export default {
    name: 'usermanege',
    components: {BusUserList, BusCustomList},
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped>

</style>