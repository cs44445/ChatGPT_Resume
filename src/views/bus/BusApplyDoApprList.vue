<template>
  <div class="index-container-ty">
    <div class="index-tabs">
      <a-tabs default-active-key="2" @change="selectTab" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">流程审批</span></template>
        </a-tab-pane>
        
        <a-tab-pane :tab="`工时审批(${length1})`" key="2" forceRender v-if="additionalfunds">
          <bus-apply-timesheet-list :busiNo="busiNoData" @changeLength="changeLength" />
        </a-tab-pane>
        <a-tab-pane :tab="`项目人员申请(${length2})`" key="3" forceRender v-if="investmentnegotiation">
          <bus-apply-appr-list :busiNo="busiNoData" @changeLength="changeLength" />
        </a-tab-pane>
        <a-tab-pane :tab="`里程碑(${length3})`" key="4" forceRender v-if="declareproject">
          <bus-apply-appr-list :busiNo="busiNoData" @changeLength="changeLength" />
        </a-tab-pane>
        <a-tab-pane :tab="`工作者签入(${length5})`" key="5" forceRender v-if="supplierWorker">
          <bus-apply-worker-list :busiNo="busiNoData" @changeLength="changeLength" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import BusApplyApprList from '@views/bus/BusApplyApprList'
import BusApplyWorkerList from '@views/bus/BusApplyWorkerList'
import BusApplyTimesheetList from '@views/bus/BusApplyTimesheetList'
import { postAction } from '@/api/manage'
import { USER_AUTH } from '@/store/mutation-types'
export default {
  name: 'BusApplyDoApprList',
  components: {
    BusApplyApprList,
    BusApplyTimesheetList,
    BusApplyWorkerList
  },
  data() {
    return {
      busiNoData: "1003",
      investmentnegotiation: false,
      declareproject: false,
      additionalfunds: false,
      supplierWorker: false,
      length1: 0,
      length2: 0,
      length3: 0,
      length5: 0,
      countTaskList: '/api/flowProcAppr/countTaskList'
    }
  },

  mounted() {
    this.checkLabel()
    this.getTodoLength()
  },
  methods: {
    selectTab(key) {
      if (key == "2") {
        this.busiNoData = "1003";
      }
      if (key == "4") {
        this.busiNoData = "1002";
      }
      if (key == "5") {
        this.busiNoData = "1005";
      }
      if (key == "3") {
        this.busiNoData = "1001";
      }
      // console.log(key)
    },
    checkLabel() {
      let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
      for (let auth of authList) {
        if (auth.action == 'tobedonez:list') {
          //工时审批
          this.additionalfunds = true;
          this.busiNoData = "1003";
        }
        if (auth.action == 'tobedonex:list') {
          //项目人员申请
          this.investmentnegotiation = true;
        }
        if (auth.action == 'tobedoney:list') {
          //里程碑
          this.declareproject = true;
        }
        if (auth.action == 'tobedoneo:list') {
          //工作者签入
          this.supplierWorker = true;
        }
      }
      if (this.additionalfunds == true) {
        this.busiNoData = "1003"
      } else if (this.additionalfunds == false && this.investmentnegotiation == true) {
        this.busiNoData = "1001"
      } else if (this.additionalfunds == false && this.investmentnegotiation == false && this.declareproject == true) {
        this.busiNoData = "1002"
      } else if (this.supplierWorker == true) this.busiNoData = "1005"

    },
    getTodoLength() {
      // 获取任务数量
      postAction(this.countTaskList, {}).then((res) => {
        if (res.success) {
          this.length1 = res.result.hoursCount;
          this.length2 = res.result.userCount;
          this.length3 = res.result.milepostCount;
          this.length5 = res.result.milepostCount;
        }
      })
    },
    changeLength() {
      this.getTodoLength()
      this.$bus.$emit('openDemandList')
    },

  },
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
</style>
