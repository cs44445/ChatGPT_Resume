<template>
  <div>
    <BusProjectTaskDetailForm ref="taskDetail" newPageShow="true"></BusProjectTaskDetailForm>
  </div>
</template>
<script>
import BusProjectTaskDetailForm from './modules/projectTask/BusProjectTaskDetailForm'
export default {
  name: 'taskDetail',
  components: {
    BusProjectTaskDetailForm
  },
  data() {
    return {
      taskId:window.location.href.split('?')[1].split('=')[1]
    }
  },
  mounted(){
     this.$refs.taskDetail.edit(this.taskId)
  },
  methods: { 

  }
}
</script>
<style lang="less" scoped>
</style>