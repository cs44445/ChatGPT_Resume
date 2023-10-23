<template>
  <div>
    <div v-show="milestoneArray.length == 0">暂无数据</div>
    <a-row class="milestone-list" :gutter="{ md: 12, xxl: 16 }" type="flex" justify="space-around" align="center"
      v-for="(item, key) in milestoneArray" :key="key">
      <!-- 左 -->
      <a-col :xl="3" :xxl="2" :md="4" :sm="4" :xs="5">
        <div class="card">
          <span :class="(item.colorStatus == 2 ? 'yellow' : item.colorStatus == 3 ? 'red' : 'blue') + ' card-month'">{{
            item.endTime.substr(5, 2).replace(/\b(0+)/gi, '') + '月' }}</span>
          <span class="card-day">
            {{ item.endTime.substr(8, 2).replace(/\b(0+)/gi, '') }}
            <span class="card-week">{{ getWeek(item.endTime) }}</span>
          </span>
        </div>
        <a-row class="another-day">
          <span v-if="item.milepostStatus === '4'" :class="(item.colorStatus == 2 ? 'yellow' : item.colorStatus == 3 ? 'red' : 'blue')">已完成</span>
          <span v-else :class="(item.colorStatus == 2 ? 'yellow' : item.colorStatus == 3 ? 'red' : 'blue')">{{
            item.dayNum }}</span>
        </a-row>
      </a-col>
      <!-- 中 -->
      <a-col  :xl="8" :xxl="9" :md="8" :sm="8" :xs="7" class="detail">
        <span class="title">
          {{ item.milepostCode }}
          <a-button type="link" @click="handleUpdateStatus(item)" style="padding:0px;" v-if="item.milepostStatus!=='4'"><img
              src="~@/assets/unchecked.svg" width="20px" style="margin-bottom:5px;"></a-button>
        </span>
        <span class="pm-name">{{ item.owner }}</span>
        <div class="process">
          <a-progress :percent="getPercent(item.info)" strokeColor="#08C35C" strokeWidth="10"
            :format="(percent) => `${percent} %完成`" />
        </div>
        <span class="period">{{ item.beginTime }}&nbsp;至&nbsp;{{ item.endTime }}</span>
        <div class="develop-time">
          <span v-for="value in item.roleHours"> {{ value }} </span>
        </div>
      </a-col>
      <!-- 右 -->
      <a-col  :xl="13" :xxl="13" :md="12" :sm="12" :xs="12">
        <a-row type="flex" justify="space-between" align="bottom" style="height: 100%;">
          <div class="stats">
            <a-statistic title="预估人力成本" :value="item.estimatedLaborCosts | moneyFormat" style="font-size: 12px"
              valueStyle="font-size:18px;color:#3d3d3d;" />
            <span :class="item.laborCostsWarning == 1 ? 'yellow-font' : item.laborCostsWarning == 2 ? 'red-font' : ''">已产生
              {{ item.laborCosts | moneyFormat }}</span>
            <div class="warn-icon">
              <a-icon type="exclamation-circle" :style="{ fontSize: '18px' }" theme="twoTone"
                :two-tone-color="item.laborCostsWarning == 1 ? '#F2B202' : '#D92929'"
                v-show="item.laborCostsWarning !== 0" />
            </div>
          </div>
          <div class="stats">
            <a-statistic title="预估采购成本" :value="item.estimatedProcurementCost | moneyFormat" style="font-size: 12px"
              valueStyle="font-size:18px;color:#3d3d3d;" />
            <span
              :class="item.procurementCostWarning == 1 ? 'yellow-font' : item.procurementCostWarning == 2 ? 'red-font' : ''">已产生{{
                item.realProcurementCost | moneyFormat }}</span>
            <div class="warn-icon">
              <a-icon type="exclamation-circle" :style="{ fontSize: '18px' }" theme="twoTone"
                :two-tone-color="item.procurementCostWarning == 1 ? '#F2B202' : '#D92929'"
                v-show="item.procurementCostWarning !== 0" />
            </div>
          </div>
          <div class="stats">
            <a-statistic title="预估差旅成本" :value="item.estimatedTravelCost | moneyFormat" style="font-size: 12px"
              valueStyle="font-size:18px;color:#3d3d3d;" />
            <span
              :class="item.travelCostWarning == 1 ? 'yellow-font' : item.travelCostWarning == 2 ? 'red-font' : ''">已产生{{
                item.realTravelCost | moneyFormat }}</span>
            <div class="warn-icon">
              <a-icon type="exclamation-circle" :style="{ fontSize: '18px' }" theme="twoTone"
                :two-tone-color="item.travelCostWarning == 1 ? '#F2B202' : '#D92929'"
                v-show="item.travelCostWarning !== 0" />
            </div>
          </div>
          <div class="stats">
            <a-statistic title="预估分包费用" :value="item.estimatedSubcontractingCost | moneyFormat" style="font-size: 12px"
              valueStyle="font-size:18px;color:#3d3d3d;" />
            <span
              :class="item.subcontractingCostWarning == 1 ? 'yellow-font' : item.subcontractingCostWarning == 2 ? 'red-font' : ''">已产生{{
                item.realSubcontractingCost | moneyFormat }}</span>
            <div class="warn-icon">
              <a-icon type="exclamation-circle" :style="{ fontSize: '18px' }" theme="twoTone"
                :two-tone-color="item.subcontractingCostWarning == 1 ? '#F2B202' : '#D92929'"
                v-show="item.subcontractingCostWarning !== 0" />
            </div>
          </div>
          <div class="stats">
            <a-statistic title="预估其他费用" :value="item.estimatedOtherCost | moneyFormat" style="font-size: 12px"
              valueStyle="font-size:18px;color:#3d3d3d;" />
            <span :class="item.otherCostWarning == 1 ? 'yellow-font' : item.otherCostWarning == 2 ? 'red-font' : ''">已产生{{
              item.realOtherCost | moneyFormat }}</span>
            <div class="warn-icon">
              <a-icon type="exclamation-circle" :style="{ fontSize: '18px' }" theme="twoTone"
                :two-tone-color="item.otherCostWarning == 1 ? '#F2B202' : '#D92929'"
                v-show="item.otherCostWarning !== 0" />
            </div>
          </div>
        </a-row>
      </a-col>
    </a-row>
    <!-- {{projectId}} -->
  </div>
</template>

<script>
import { getAction, putAction } from '@/api/manage'

export default {
  name: 'MileStoneList',
  props: ['projectId', 'num'],
  data() {
    return {
      milestoneArray: [],
      url: {
        list: '/api/flowProcAppr/getProcDetHisList',
        lookimage: '/api/flowProcAppr/tracePhoto',
        milestone: '/bus/busProjectMilepost/milepostList',
        updateMilestoneStatusUrl: '/bus/busProjectMilepost/edit',
      },
    }
  },
  components: {},
  mounted() {
    this.loadData(this.projectId)
  },
  props: {
    projectId: {
      type: String,
    },
    num: {
      type: String,
    },
  },
  watch: {
    projectId: function () {
      this.loadData(this.projectId)
    },
  },
  methods: {
    loadData(projectId) {
      // this.dataSource = []
      // var params = { instanceId: instanceId } //查询条件
      // getAction(this.url.list, params).then(res => {
      //   if (res.success) {
      //     this.dataSource = res.result.records
      //   }
      // })
      getAction(this.url.milestone, { projectId: projectId, selectTableStatus: this.num || 1 }).then((res) => {
        if (res.success && res.result) {
          this.milestoneArray = res.result.records
        } else {
          // console.log('milestone list: ' + JSON.stringify(res))
        }
      })
    },
    //转换成货币格式
    moneyFormat(num) {
      return num.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    //周几格式化
    getWeek(date) {
      let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return datelist[new Date(date).getDay()]
    },
    //计算进度条百分比
    getPercent(info) {
      if (info.usedHours == 0) {
        return 0
      }
      return ((info.usedHours * 100) / info.planHours).toFixed(0)
    },
        handleUpdateStatus(item) {
          let params = {
            id: item.id,
            milepostStatus: '4'
          }
          putAction(this.url.updateMilestoneStatusUrl,params).then(res=>{
          if(res.success){
            this.loadData(this.projectId)
            this.$message.success(res.message)
          }else{
            this.$message.warning(res.message)
          }
        })
        }
  },
}
</script>
<style lang="less" scoped>
@red: #D92929;
@yellow: #F2B202;
@blue: #136deb;

.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

// 不同色块样式
.blue {
  background-color: @blue ;
}

.yellow {
  background-color: @yellow;
}

.red {
  background-color: @red;
}

.yellow-font {
  color: @yellow !important;
}

.red-font {
  color: @red !important;
}

.milestone-list {
  // font-size: 10px;
  padding: 15px 0;
  border-bottom: 1px solid #e4e4e4;

  .card {
    width: 90px;

    span {
      display: block;
      text-align: center;
    }

    .card-month {
      height: 30px;
      font-size: 20px;
      border-radius: 1rem 1rem 0 0;
      color: #ffffff;
    }

    .card-day {
      height: 55px;
      background: #ffffff;
      border-radius: 0 0 1rem 1rem;
      font-size: 28px;
      color: #090909;
    }

    .card-week {
      font-size: 10px;
      margin-top: -7px;
      color: #999999;
      transform: scale(0.9);
    }
  }

  .another-day {
    text-align: center;
    width: 90px;

    span {
      display: inline-block;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      width: auto;
      opacity: 0.3;
      border-radius: 1rem;
      margin-top: 5px;
      font-size: 14px;
      padding: 2px 6px;
    }
  }

  .detail {
    color: #2f3133;
    font-size: 12px;

    span {
      display: block;
    }

    .title {
      font-size: 18px;
    }

    .name {
      font-size: 14px;
    }

    .process {
      width: 65%;
    }

    .develop-time {
      margin-top: 5px;

      span {
        display: inline-block;
        color: #8d9399;
        background-color: #ffffff;
        padding: 2px 10px;
        border-radius: 10px;
        margin-right: 10px;
        // width: 100px;
        text-align: center;
        height: 22px;
      }
    }

    .process /deep/ .ant-progress-inner {
      background-color: rgba(8, 195, 92, 0.1);
    }
  }

  .stats {
    text-align: center;

    span {
      font-size: 11px;
      color: #9199a1;
    }

    .warn-icon {
      height: 18px;
    }
  }

  .stats /deep/ .ant-statistic-title {
    color: #2f3133;
    font-size: 16px;
  }
  .stats /deep/ .ant-statistic-content-value-decimal {
    color: #2f3133;
    font-size: 18px;
  }
}</style>