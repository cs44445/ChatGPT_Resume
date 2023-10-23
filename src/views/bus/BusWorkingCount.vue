<template>
  <div class="index-container-ty">
    <div class="index-tab">
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">工时统计</span></template>
        </a-tab-pane>
        <a-tab-pane tab="工时明细" key="2" forceRender v-if="details">
          <bus-work-details/>
        </a-tab-pane>
        <a-tab-pane tab="按人员汇总" key="3" forceRender v-if="usercount">
          <bus-personnel-summary/>
        </a-tab-pane>
        <a-tab-pane tab="按项目汇总" key="4" forceRender v-if="project">
          <bus-project-summary/>
        </a-tab-pane>
        <a-tab-pane tab="非项目工时汇总" key="5" forceRender v-if="project">
          <bus-not-project-summary/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import BusWorkDetails from './BusWorkDetails'
  import BusPersonnelSummary from './BusPersonnelSummary'
  import BusProjectSummary from './BusProjectSummary'
  import BusNotProjectSummary from './BusNotProjectSummary'
  import { USER_AUTH } from '@/store/mutation-types'
  export default {
    name: 'BusWorkingCount',
    components: {
      BusWorkDetails,
      BusPersonnelSummary,
      BusProjectSummary,
      BusNotProjectSummary
    },
    data() {
      return {
        details:false,
        usercount:false,
        project:false
      }
    },

    mounted () {
      this.checkLabel()
    },
    methods: {
      checkLabel(){
        let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
        for (let auth of authList) {
          if(auth.action == 'work:details') {
            this.details = true;
          }
          if(auth.action == 'work:usercount') {
            this.usercount = true;
          }
          if(auth.action == 'work:project') {
            this.project = true;
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>

.image-group-share {
  position: absolute;
  right: 15px;
  top: 20px;
  .image-group {
    width: auto;
    display: inline-block;
  }
  .share-btn {
    margin-left: 10px;
  }
}
.index-tab /deep/ .ant-tabs-nav-container {
  font-size: 14px;
}
.first-tab {
  display: block;
  font-size: 17px;
  font-weight: bold;
  color: #000;
}
.index-tab /deep/ .ant-tabs-nav div:has(.first-tab){
  border-right: 1px solid #e8e8e8;
  &:hover {
    cursor: default;
  }
}
.index-tab /deep/ .ant-tabs-bar {
  position: fixed;
  z-index: 9 !important;
  width: 99%;
  background: #F7F8FA;
  padding-top: 12px;
}
.index-tab /deep/ .ant-tabs-tabpane {
  margin-top:80px;
}
</style>
