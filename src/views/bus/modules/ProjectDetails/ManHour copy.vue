<template>
  <div>
    <!-- {{projectId}} -->

    <a-card :bordered="false" title="工时" class="timeCss">
      <div class="extra-wrapper" slot="extra">
        <!-- <a-week-picker placeholder="请选择周">
          <a-icon slot="suffixIcon" type="calendar" />
        </a-week-picker> -->
        <a-range-picker @change="onChange" v-model="workDate"/>
      </div>
      <div>
          <!-- <ProjectHours :projectId="projectId" ref="OverallProjectHours"></ProjectHours> -->
          <div id="ProjectHours" style="height: 300px;width:100%;"></div>
      </div>
      <a-row v-has="'project:totalhours'">
        <a-col :span="12" class="card-list-subtitle"><span>项目总工时(H): </span><span>{{timeSheetObj.timeSheet}}</span> </a-col>
        <a-col :span="12" class="card-list-subtitle"><span>已投入工时(H): </span><span>{{timeSheetObj.investmentSime}}</span></a-col>
      </a-row>
      <a-table size="small" ref="table" :scroll="{y:220 }" rowKey="id" :columns="columns2" :dataSource="dataSource" :pagination="false" class="j-table-force-nowrap">
        <template slot="date" slot-scope="text,record">
          <a @click="getShowTimeDetail(record)">{{ text }}</a>
        </template>
      </a-table>
    </a-card>
  </div>

</template>

<script>
import * as echarts from 'echarts'
import { getAction } from '@/api/manage'
import moment from 'moment'
import GanttChart from '../GanttChart'
import DrawChart from '../DrawChart'
// import ProjectHours from './ProjectHours'
// import { mixinDevice } from '@/utils/mixin'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'


export default {
  name: 'MileStone',
  // mixins: [JeecgListMixin, mixinDevice],
  props: ['projectId'],
  components: {
    GanttChart,
    DrawChart,
    // ProjectHours
  },
  data() {
    return {
      dataSource:[],
      url: {
        projectDetailWorkTimeInfo:'/bus/busProject/projectDetailWorkTimeInfo',
        projectDetailWorkTimeInfoImage:'/bus/busProject/projectDetailWorkTimeInfoImage'
      },
      timeSheetObj:{},
      columns2: [
      {
          title:'时间',
          align:"left",
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' }
        },
        {
          title:'计划工时(H)',
          align:"left",
          dataIndex: 'planHours'
        },
        {
          title:'计划人力(人)',
          align:"left",
          dataIndex: 'planPerson'
        },
        {
          title: '投入工时(H)',
          align: "left",
          dataIndex: 'actualHours'
        },
        {
          title:'投入人力(人)',
          align:"left",
          dataIndex: 'actualPerson'
        },
      ],
      
      workDate:[]
    }
  },
  mounted(){
    // this.loadData(this.projectId)
    //默认调取本周一至本周日的工时
    this.workDate = [moment().day(1).format('YYYY-MM-DD'),moment().day(7).format('YYYY-MM-DD')]
    // if (this.projectId){
    //   this.init(this.projectId)
    // }
    var chartDom = document.getElementById('OverallProjectHours');
    if (chartDom == null) {
        return
      }
      echarts.dispose(chartDom)
      var myChart = echarts.init(chartDom);//实例化一个echart实例
      var option;
      var riqi=['1','2','3'];
      var jx=['1','2','3'];
      var wc=['1','2','3']
      option = {
        title: {
            text: '项目整体工时趋势图'
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
            data: ['进行中', '已完成'],
            left: '15%',
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
                data: riqi
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '进行中',
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
                data: jx
            },
            {
                name: '已完成',
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
                data: wc
                }
        ]
      }
      option && myChart.setOption(option);
      
      console.log(chartDom)

  },
  props: {
    projectId: {
      type: String
    }
  },
  // watch: {
  //   projectId: function() {
  //     this.loadData(this.projectId)
  //     console.log('watch')
  //     this.init(this.projectId)
  //   }
  // },
  methods: {
    loadData(projectId) {
      // this.dataSource = []
      var params = { projectId: projectId } //查询条件
      getAction(this.url.num, params).then(res => {
        
        if (res.success) {
          this.numData = res.result
        }
      })
    },
    init(projectId){
      // this.projectId=projectId
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
        console.log('000')
      let params = {
        startTime:startDate,
        endTime:endDate,
        id:this.projectId
      }
      getAction(this.url.projectDetailWorkTimeInfo,params).then(res=>{
        console.log('111',res)
         if(res.success){
            this.dataSource = res.result.list
            this.pageOthers.timeSheet = res.result.projectSumOverTime
            this.pageOthers.investmentSime = res.result.putOverTime
            this.timeSheetObj.timeSheet = res.result.projectSumOverTime
            this.timeSheetObj.investmentSime = res.result.putOverTime
            
         }else{
          this.$message.warning(res.message)
         }
      })
    },
    projectDetailWorkTimeInfoImage(startDate,endDate){
      var chartDom = document.getElementById('OverallProjectHours');
      var myChart = echarts.init(chartDom);//实例化一个echart实例
      var option;
      var riqi=['1','2','3'];
      var jx=['1','2','3'];
      var wc=['1','2','3']
      option = {
        title: {
            text: '项目整体工时趋势图'
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
            data: ['进行中', '已完成'],
            left: '15%',
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
                data: riqi
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '进行中',
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
                data: jx
            },
            {
                name: '已完成',
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
                data: wc
                }
        ]
      }
      option && myChart.setOption(option);
    }
    // projectDetailWorkTimeInfoImage(startDate,endDate){
    //     console.log('999')
    //   let params = {
    //     startTime:startDate,
    //     endTime:endDate,
    //     id:this.projectId
    //   }
    //   console.log('params',params)
    //   getAction(this.url.projectDetailWorkTimeInfoImage,params).then(res=>{
    //     console.log('888',res)
    //      if(res.success){
    //         var chartDom = document.getElementById('OverallProjectHours');
    //         var myChart = echarts.init(chartDom);//实例化一个echart实例
    //         var option;

    //         option = {
    //             title: {
    //                 text: '项目整体工时趋势图'
    //             },
    //             tooltip: {
    //                 trigger: 'axis',
    //                 axisPointer: {
    //                 type: 'cross',
    //                 label: {
    //                     backgroundColor: '#6a7985'
    //                 }
    //                 }
    //             },
    //             legend: {
    //                 data: ['进行中', '已完成'],
    //                 left: '15%',
    //             },
    //             grid: {
    //                 left: '3%',
    //                 right: '4%',
    //                 bottom: '3%',
    //                 containLabel: true
    //             },
    //             xAxis: [
    //                 {
    //                     type: 'category',
    //                     boundaryGap: false,
    //                     data: res.result.date
    //                 }
    //             ],
    //             yAxis: [
    //                 {
    //                     type: 'value'
    //                 }
    //             ],
    //             series: [
    //                 {
    //                     name: '进行中',
    //                     type: 'line',

    //                     areaStyle: {
    //                         color: 'white'
    //                     },
    //                     itemStyle: {
    //                         color: '#7DE1AA'
    //                     },
    //                     emphasis: {
    //                         focus: 'series'
    //                     },
    //                     data: res.result.planHours
    //                 },
    //                 {
    //                     name: '已完成',
    //                     type: 'line',
    //                     stack: 'Total',

    //                     areaStyle: {
    //                         color: {
    //                         type: 'linear',
    //                         x: 0,
    //                         y: 0,
    //                         x2: 0,
    //                         y2: 1,
    //                         colorStops: [
    //                             {
    //                             offset: 0,
    //                             color: '#CDDFF9' // 0% 处的颜色
    //                             },
    //                             {
    //                             offset: 1,
    //                             color: '#fff' // 100% 处的颜色
    //                             }
    //                         ],
    //                         global: false
    //                         }
    //                     },
    //                     itemStyle: {
    //                         color: '#0467F1'
    //                     },
    //                     emphasis: {
    //                         focus: 'series'
    //                     },
    //                     data: res.result.realityHours
    //                 }
    //               ]
    //           };
    //           option && myChart.setOption(option);
    //      }else{
    //       this.$message.warning(res.message)
    //      }
    //   })
    // },
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
</style>