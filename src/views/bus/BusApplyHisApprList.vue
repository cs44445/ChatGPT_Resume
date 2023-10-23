<template>

  <a-card :bordered="false">
    <a-tabs default-active-key="1"  @change="selectTab">
      <a-tab-pane tab="工时审批" key="1" forceRender v-if="additionalfunds">
        <bus-appr-history-list :busiNo="busiNoData"/>
      </a-tab-pane>
      <a-tab-pane tab="项目人员申请" key="2" forceRender v-if="investmentnegotiation">
        <bus-appr-history-list :busiNo="busiNoData"/>
      </a-tab-pane>
      <a-tab-pane tab="里程碑" key="3" forceRender v-if="declareproject">
        <bus-appr-history-list :busiNo="busiNoData"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
  import BusApprHistoryList from '@views/bus/BusApprHistoryList'
  import { getAction } from '@/api/manage'
import { USER_AUTH } from '@/store/mutation-types'
  export default {
    name: 'count',
    components: {
      BusApprHistoryList,
    },
    data() {
      return {
        investmentnegotiation: false,
        declareproject: false,
        additionalfunds:false,
        busiNoData:"1003",
      }
    },

    mounted () {
      this.checkLabel()
    },
    methods: {
      selectTab(key){
        if(key == "1"){
          this.busiNoData = "1003";
        }
        if(key == "2"){
          this.busiNoData = "1001";
        }
        if(key == "3"){
          this.busiNoData = "1002";
        }
      },
      checkLabel(){
        let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
        for (let auth of authList) {
          if(auth.action == 'beencompletedz:list') {
            //工时审批
            this.additionalfunds = true;
            this.busiNoData = "1003";
          }
          if(auth.action == 'beencompletedx:list') {
            //项目人员申请
            this.investmentnegotiation = true;
          }
          if(auth.action == 'beencompletedy:list') {
            //里程碑
            this.declareproject = true;
          }
          
        }
        if(this.additionalfunds == true){
          this.busiNoData = "1003"
        }else if(this.additionalfunds == false && this.investmentnegotiation == true){
          this.busiNoData = "1001"
        }else if(this.additionalfunds == false && this.investmentnegotiation == false && this.declareproject == true){
          this.busiNoData = "1002"
        }
      }
    },
  }
</script>

<style scoped>

</style>