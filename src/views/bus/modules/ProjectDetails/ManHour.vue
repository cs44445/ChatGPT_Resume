<template>
  <div>
    <!-- {{projectId}} -->
    <a-card :bordered="false" class="timeCss">
      <div style="display: flex;justify-content: space-between;">
        <div style="display: flex;">
          <div slot="title" style="font-weight:bold">本周项目整体工时趋势图</div>
          <div class="extra-wrapper" slot="extra">
            <a-range-picker @change="onChange" v-model="workDate" separator="-" format="YYYY-MM-DD" size="small"/>
          </div>
        </div>
        
        <a-button type="primary" style="margin-left: 10px;"  @click="handleWorking()">分配工时</a-button>
      </div>
      

      <div>
          <!-- <ProjectHours :projectId="projectId" ref="OverallProjectHours"></ProjectHours> -->
          <div id="ProjectHours" style="height: 300px;width:100%;"></div>
      </div>
    </a-card>
    <a-card :bordered="false" class="timeCss">
      <div slot="title" style="font-weight:bold">本周项目工时统计</div>
      <div v-has="'project:totalhours'" class="projecttime">
        <a-col :span="12" class="card-list-subtitle"><span>项目总工时: </span><span>{{projectSumOverTime}}</span>h </a-col>
        <a-col :span="12" class="card-list-subtitle"><span>已投入工时: </span><span>{{putOverTime}}h</span></a-col>
      </div>
      <a-table size="small" ref="table" :scroll="{y:273 }" rowKey="id" :columns="columns2" :dataSource="dataSource" :pagination="false" class="j-table-force-nowrap">
        <template slot="date" slot-scope="text,record">
          <span>{{ text }}</span>
        </template>
        <template slot="check" slot-scope="text,record">
        <a-tooltip placement="top">
          <template slot="title">
            <span>查看</span>
          </template>
          <span style="cursor:pointer" @click="getShowTDetail(record)"><img style="width:20px" src="@/assets/check.png" /></span>
        </a-tooltip>
        </template>
      </a-table>
    </a-card>
    <!-- 工时明细 -->
    <show-t-detail ref="timeDetail"></show-t-detail>
    <teamours-modal ref="teamours"></teamours-modal>
  </div>

</template>

<script>
import * as echarts from 'echarts'
import { getAction } from '@/api/manage'
import moment from 'moment'
import GanttChart from '../GanttChart'
import DrawChart from '../DrawChart'
import ShowTDetail from './ShowTDetail'

import TeamoursModal from '../TeamoursModal.vue'
// import ProjectHours from './ProjectHours'
// import { mixinDevice } from '@/utils/mixin'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'


export default {
  name: 'MileStone',
  components: {
    GanttChart,
    DrawChart,
    ShowTDetail,
    TeamoursModal
  },
  data() {
    return {
      dataSource:[],
      url: {
        projectDetailWorkTimeInfo:'/bus/busProject/projectDetailWorkTimeInfo',
        projectDetailWorkTimeInfoImage:'/bus/busProject/projectDetailWorkTimeInfoImage',
        queryById:'bus/busProject/queryById',
      },
      projectSumOverTime:'',
      putOverTime:'',
      columns2: [
      {
          title:'时间',
          align:"left",
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' }
        },
        {
          title:'计划总人数',
          align:"left",
          dataIndex: 'planPerson'
        },
        {
          title:'实际总人数',
          align:"left",
          dataIndex: 'actualPerson'
        },
        {
          title:'计划总工时(h)',
          align:"left",
          dataIndex: 'planHours'
        },
        {
          title: '实际工时(h)',
          align: "left",
          dataIndex: 'actualHours'
        },
        {
          title:'',
          align:"center",
          scopedSlots: { customRender: 'check' }
        },
      ],
      
      workDate:[],
      projectDetail:{},
    }
  },
  mounted(){
    // this.loadData(this.projectId)
    //默认调取本周一至本周日的工时
    this.workDate = [moment().day(1).format('YYYY-MM-DD'),moment().day(7).format('YYYY-MM-DD')]
    if (this.projectId){
    }
      this.init(this.projectId)
      this.handleGetDetail()
  },
  props: {
    projectId: {
      type: String
    }
  },
  watch: {
    projectId: function() {
      this.workDate = [moment().day(1).format('YYYY-MM-DD'),moment().day(7).format('YYYY-MM-DD')]
      this.init(this.projectId)
      this.handleGetDetail()
    }
  },
  methods: {
    handleGetDetail(){
      getAction(this.url.queryById+'?id='+this.projectId).then(res=>{
        if(res.success){
            res.result.ifStart  = res.result.collectionCycle=='3' ? false : true
            res.result.collectionTimesArr = res.result.collectionTimes ? res.result.collectionTimes.split(',') :[]
            res.result.ifWarning1 = res.result.ifWarning == '1' ? true :false
            this.projectDetail = res.result
        }
      })
    },
    handleWorking() {
      this.$refs.teamours.edit(this.projectDetail)
      this.$refs.teamours.title = '团队工时管理'
      this.$refs.teamours.ifMilepostId = false
      this.$refs.teamours.disableSubmit = true
    },
    init(projectId){
      this.projectId=projectId
      this.projectDetailWorkTimeInfo(this.workDate[0],this.workDate[1])
      this.projectDetailWorkTimeInfoImage(this.workDate[0],this.workDate[1])
    },
    onChange(date, dateString) {
      this.workDate = dateString
      this.projectDetailWorkTimeInfo(dateString[0],dateString[1])
      this.projectDetailWorkTimeInfoImage(this.workDate[0],this.workDate[1])
    },
    
    budgetlist(){
      // this.firstBudgetList()
      // this.firstProjectOthers()
      this.projectDetailWorkTimeInfo(this.workDate[0],this.workDate[1])
      this.$refs.moneychart.init()
    },
    projectDetailWorkTimeInfo(startDate,endDate){
      let params = {
        startTime:startDate,
        endTime:endDate,
        id:this.projectId
      }
      getAction(this.url.projectDetailWorkTimeInfo,params).then(res=>{
         if(res.success){
            this.dataSource = res.result.list
            // this.pageOthers.timeSheet = res.result.projectSumOverTime
            // this.pageOthers.investmentSime = res.result.putOverTime
            this.projectSumOverTime = res.result.projectSumOverTime
            this.putOverTime = res.result.putOverTime
            
         }else{
          this.$message.warning(res.message)
         }
      })
    },
    projectDetailWorkTimeInfoImage(startDate,endDate){
      let params = {
        startTime:startDate,
        endTime:endDate,
        id:this.projectId
      }
      getAction(this.url.projectDetailWorkTimeInfoImage,params).then(res=>{
         if(res.success){
            var chartDom = document.getElementById('ProjectHours');
            if (chartDom == null) {
              return
            }
            echarts.dispose(chartDom)
            var myChart = echarts.init(chartDom);//实例化一个echart实例
            var option;

            option = {
                title: {
                    text: '',
                    left:'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                    }
                },
                legend: {
                    data: ['实际工时', '计划工时'],
                    left: '0',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: res.result.date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {show: false},
                        position:'right',
                        // axisLabel: { // y轴文字的配置
                        //   textStyle: {
                        //     align: 'right',
                        //   },
                        // },
                    }
                ],
                series: [
                    {
                        name: '实际工时',
                        type: 'line',

                        areaStyle: {
                            color: 'white'
                        },
                        itemStyle: {
                            color: '#7DE1AA'
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: res.result.realityHours
                    },
                    {
                        name: '计划工时',
                        type: 'line',
                        stack: 'Total',

                        areaStyle: {
                            color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                offset: 0,
                                color: '#CDDFF9' // 0% 处的颜色
                                },
                                {
                                offset: 1,
                                color: '#fff' // 100% 处的颜色
                                }
                            ],
                            global: false
                            }
                        },
                        itemStyle: {
                            color: '#0467F1'
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data:  res.result.planHours
                    }
                  ]
              };
              option && myChart.setOption(option);
         }else{
          this.$message.warning(res.message)
         }
      })
    },
    //展示工时明细
    getShowTDetail(record){
      this.$refs.timeDetail.title = record.date+"工时";
      this.$refs.timeDetail.edit(record,this.projectId)
    }
  }
}
</script>
<style lang="less" scoped>
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
.tab-menu-num {
  display: inline-block;
    width: 25px;
    height: 17px;
    border-radius: 40%;
    background-color: #ededed;
    text-align: center;
    margin: 0px 3px;
    color: #3d3d3d;
    font-size: 10px;
}
/deep/ .ant-table-column-title{
  font-size: 14px;
}
.projecttime{
  position: absolute;
  top: 10px;
  left: 170px;
  background: #F2F4F5;
  border: 1px solid #EDEFF0;
  padding-left: 13px;
  width: calc(100% - 194px);
  border-radius: 4px;
  box-sizing: border-box;
  line-height: 32px;
  // margin-left: -170px;
}
/deep/ .ant-card-head{
  border-bottom: none;
}
/deep/ .ant-col-12{
  width:auto;
  margin-right: 25px;
}
/deep/ .ant-card-extra{
  position:absolute;
  left:210px;
  top: 2px;
  width: 200px;
}
 /deep/ .ant-calendar-date{
  border-radius: 100px !important;
 }
 /deep/ .ant-calendar-range {
  background: url(~@/assets/arrows.png) !important;
 }
 /deep/ .ant-input{
  border: none;
  background: none !important;
 }
</style>
<style scoped>
 /* .ant-calendar-tbody >>> .ant-calendar-date{
  border-radius: 50% !important;
 } */
</style>