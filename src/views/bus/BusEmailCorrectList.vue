<template>
<div>
  <a-card :bordered="false">
    <div slot="title" style="font-weight:bold">每月个人准确率趋势图</div>
    <div style="position:absolute; top:5px; right:0">
      <a-radio-group v-model="monthvalue" button-style="solid" style="margin-right:8px" @change="(e)=>onChangeMonth(e.target.value)">
        <a-radio-button v-for="(item, i) in month" :key="i" :value="item">
          {{item}}月
        </a-radio-button>
      </a-radio-group>
      <a-button type="primary" icon="login" @click="handleAdd">导入</a-button>
    </div>

    <!-- 数据为空 -->
    <div class="empty" v-if="dataSource==''">
      <img src="~@/assets/empty.png">
      <div class="center">目前尚无数据</div>
      <div>请通过模板添加</div>
      <a-button type="primary" icon="plus" @click="handleAdd">导入数据</a-button>
    </div>

    <!-- table区域-begin -->
    <div v-show="dataSource !='' ">
      <div id="personTrendChartid" style="height: 300px;width:40%; float:left"></div>
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="dot"  slot-scope="text, record">
          <!-- <span class="dot"  :style="[{borderColor:record.color}]" ></span> -->
          <span class="dot"  style="border-color:#CB1189" ></span>
        </template>
      </a-table>
    </div>

    <bus-email-correct-modal ref="modalForm" @ok="modalFormOk"></bus-email-correct-modal>
  </a-card>
  <a-card :bordered="false">
    <div slot="title" style="font-weight:bold">个人完成情况趋势图</div>
    <a-week-picker v-if="flag" placeholder='请选择日期' @change="onChangeWeekDate" />
    <a-range-picker v-else @change="onChangeDate" v-model="workDate" separator="-" format="YYYY-MM-DD" size="small"/>

    <div style="position:absolute; top:5px; right:0">
      <a-checkbox-group button-style="solid" style="margin-right:8px">
        <!-- <a-checkbox>
          年
        </a-checkbox> -->
        <!-- <a-checkbox>
          月
        </a-checkbox> -->
        <a-checkbox  @change="onCheckChange">
          周
        </a-checkbox>
      </a-checkbox-group>
    </div>

    <!-- table区域-begin -->
    <div>
      <div id="AccuracyRate" style="height: 300px;width:40%; float:left"></div>
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="userId"
        :columns="columns1"
        :dataSource="dataSource1"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
        :customRow="rowClick">
        <template slot="dot" slot-scope="text, record">
          <!-- <span class="dot"  :style="[{borderColor:record.color}]" ></span> -->
          <span class="dot"  style="border-color:#CB1189" ></span>
        </template>
      </a-table>
    </div>
  </a-card>
  <project-detail-list ref="ProjectDetailList" @ok="handleGetDetail"></project-detail-list>
</div>
</template>

<script>

  import * as echarts from 'echarts'
  import '@/assets/less/TableExpand.less'
  import moment from 'moment'
  // import { mixinDevice } from '@/utils/mixin'
  // import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import BusEmailCorrectModal from './modules/BusEmailCorrectModal'
  import ProjectDetailList from './modules/ProjectDetailList.vue'

  export default {
    name: 'BusEmailCorrectList',
    // mixins:[JeecgListMixin, mixinDevice],
    props: ['projectId'],
    components: {
      BusEmailCorrectModal,
      ProjectDetailList
    },
    data () {
      return {
        description: 'bus_email_correct管理页面',
        // 表头
        columns: [
         // {
         //  title: '',
         //    dataIndex: '',
         //    width:60,
         //    align:"center",
         //    scopedSlots: { customRender: 'dot' }
         // },
          {
            title:'工号',
            align:"left",
            dataIndex: 'workNo'
          },
          {
            title:'Alias',
            align:"left",
            dataIndex: 'alias'
          },
          {
            title:'姓名',
            align:"left",
            dataIndex: 'userName'
          },
          {
            title:'准确率',
            align:"left",
            dataIndex: 'cor'
          },
        ],
        columns1: [
         // {
         //  title: '',
         //    dataIndex: '',
         //    width:60,
         //    align:"center",
         //    scopedSlots: { customRender: 'dot' }
         // },
          {
            title:'工号',
            align:"left",
            dataIndex: 'workNo'
          },
          {
            title:'Alias',
            align:"left",
            dataIndex: 'alias'
          },
          {
            title:'姓名',
            align:"left",
            dataIndex: 'userName'
          },
          {
            title:'分配数',
            align:"left",
            dataIndex: 'planNum'
          },
          {
            title:'完成数',
            align:"left",
            dataIndex: 'realyNum'
          },
        ],
        url: {
          list: "/bus/busEmailCorrect/list",
          personTrendChart: "/bus/busEmailCorrect/personTrendChart",
          finishNumberCount: "/bus/busEmailCorrect/finishNumberCount",
          finishNumTrendChart2: "/bus/busEmailCorrect/finishNumTrendChart2",

        },
        dictOptions:{},
        superFieldList:[],
        projectNameList:[],
        monthvalue:[],
        month:[],
        workDate:[],
        choosedate:[],
        flag:false,
        currentColor: '',
        previousColor: ''
      }
    },
    computed: {
    },
    created() {
    },
    mounted(){
      //默认调取本周一至本周日的工时
      this.workDate = [moment().day(1).format('YYYY-MM-DD'),moment().day(7).format('YYYY-MM-DD')]
      this.choosedate = this.workDate
      //默认调取当前月份
      this.month = [moment().month()][0]+1
      this.monthvalue = this.month
      this.getRateList(this.projectId,this.month)
      this.personTrendChart(this.projectId)
      this.finishNumberCount(this.projectId,this.workDate)
      this.finishNumTrendChart2(this.projectId,this.workDate)
    },
    props: {
      projectId: {
        type: String
      }
    },
    watch: {
      projectId: function() {
        this.workDate = [moment().day(1).format('YYYY-MM-DD'),moment().day(7).format('YYYY-MM-DD')]
        this.choosedate = this.workDate
        //默认调取当前月份
        this.month = [moment().month()][0]+1
        this.monthvalue = this.month
        this.getRateList(this.projectId,this.month)
        this.personTrendChart(this.projectId)
        this.finishNumberCount(this.projectId,this.workDate)
        this.finishNumTrendChart2(this.projectId,this.workDate)
      },
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      generateRandomColor() {
        let color;
        do {
          color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        } while (color === this.previousColor); // 确保颜色不与上一个颜色重复
        this.previousColor = this.currentColor;
        this.currentColor = color;
      },
      initDictConfig(){
      },

      //个人准确率列表
      getRateList(projectId,month){
        let params = {
          projectId:projectId,
          month:month
        }
        getAction(this.url.list,params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records||res.result;
            let itemcolor = '';
            for (let j = 0; j < this.dataSource.length; j++) {
              const item = this.dataSource[j];
              if(item.id){
                itemcolor = item.id.slice(26)
              }
              item.color = '#' +itemcolor;
            }
          this.$forceUpdate()
          }
        })
      },
      //每月个人准确率趋势图（左上）
      personTrendChart(projectId){
        let params = {
          // startTime:startDate,
          // endTime:endDate,
          projectId:projectId
        }
        var myChart = echarts.init(document.getElementById('personTrendChartid'));
        getAction(this.url.personTrendChart,params).then(res=>{
          if(res.success){
            let result = ''
            let resultdate = []
            if(res.result){
              result = res.result.dtoList
              resultdate= res.result.date
            }
            let newResult = []
            if(result.length) {
              let itemcolor = ''
              result.map(item => {
                // if(item.id){
                //   // itemcolor = item.id.slice(26)
                //   itemcolor = color
                // }
                this.generateRandomColor()
                newResult.push({
                  type: "line",
                  areaStyle: {
                      color: 'white'
                  },
                  itemStyle: {
                      color: this.currentColor
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  name:item.userName,
                  data:item.corList,
                  ...item
                })
              })
            }
            console.log('newResult',newResult)
            let nameselect={}
            newResult.forEach((item,i)=>{
              if(i>2){
                let name=item.name
                nameselect[name]=false
              }
            })

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
                    left: '0',
                    selected:nameselect
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
                        data: resultdate
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
                series: newResult
              };
            myChart.clear();
            option && myChart.setOption(option);
            // setTimeout(() => {
            //     // this.setOption();
            //     try {
            //     myChart.clear();
            //     myChart.setOption(option);
            //     } catch (error) {}
            // }, 5000)
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      //个人完成情况趋势图（左下）
      finishNumTrendChart2(projectId,date){
        let params = {
          startTime:date[0],
          endTime:date[1],
          projectId:projectId
        }
        var myChart = echarts.init(document.getElementById('AccuracyRate'));
        getAction(this.url.finishNumTrendChart2,params).then(res=>{
          if(res.success){
            let result = ''
            let resultdate = []
            if(res.result){
              result = res.result.dtoList
              resultdate= res.result.date
            }
            let newResult = []
            if(result.length) {
              // let itemcolor = '';
              result.map(item => {
              // if(item.userId){
              //   itemcolor = item.userId.slice(13)
              // }
                this.generateRandomColor()
                newResult.push({
                  type: "line",
                  areaStyle: {
                      color: 'white'
                  },
                  itemStyle: {
                      color: this.currentColor
                  },
                  emphasis: {
                      focus: 'series'
                  },
                  name:item.userName,
                  data:item.corList,
                  ...item
                })
              })
            }

            let nameselect={}
            newResult.forEach((item,i)=>{
              if(i>2){
                let name=item.name
                nameselect[name]=false
              }
            })
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
                    left: '0',
                    selected:nameselect
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
                        data: resultdate
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
                series: newResult
              };
            myChart.clear();
            option && myChart.setOption(option);
            // setTimeout(() => {
            //     // this.setOption();
            //     try {
            //     myChart.clear();
            //     myChart.setOption(option);
            //     } catch (error) {}
            // }, 5000)


          }else{
            this.$message.warning(res.message)
          }
        })
      },

      //完成情况统计
      finishNumberCount(projectId,workDate){
        let params = {
          projectId:projectId,
          startTime:workDate[0],
          endTime:workDate[1],
        }
        getAction(this.url.finishNumberCount,params).then((res) => {
          if (res.success) {
            this.dataSource1 = res.result.records||res.result;
            let itemcolor = '';
            for (let j = 0; j < this.dataSource1.length; j++) {
              const item = this.dataSource1[j];
              if(item.userId){
                itemcolor = item.userId.slice(13)
              }
              item.color = '#' +itemcolor;
            }
          this.$forceUpdate()
          }
        })
      },
      onChangeMonth(month){
        this.getRateList(this.projectId,month)
        this.personTrendChart(this.projectId)
      },
      handleAdd(){
        // this.$refs.modalForm.visible = true;
        // this.$nextTick(() => {
          this.$refs.modalForm.edit(this.projectId)
        // })

      },
      onChangeDate(date, dateString){
        this.finishNumberCount(this.projectId,dateString)
        this.finishNumTrendChart2(this.projectId,dateString)
        this.choosedate = dateString
      },
      onChangeWeekDate(weekData) {
        let dates = ['','']
        if(weekData){
          dates = [moment(weekData).day(1).format('YYYY-MM-DD'),moment(weekData).day(7).format('YYYY-MM-DD')]//周一日期,周日日期
        }
        this.finishNumberCount(this.projectId,dates)
        this.finishNumTrendChart2(this.projectId,dates)
        this.choosedate = dates
      },
      onCheckChange(checkedList){
        let target = checkedList.target.checked
        if(target){
          this.flag = true
        }
        else{
          this.flag = false
        }
        console.log('this.workDate',this.workDate)
        this.workDate = []
        this.finishNumberCount(this.projectId,this.workDate)
        this.finishNumTrendChart2(this.projectId,this.workDate)
        this.choosedate = this.workDate
      },
      rowClick(row){
        return {
          on: {

            click: () => {
              this.$refs.ProjectDetailList.visible = true;
              this.$refs.ProjectDetailList.detail(this.projectId,row.userId,this.choosedate,row.workNo)
            },

            dblclick: () => {
            },

            // ...
          }
        }
      },
      handleGetDetail(){

      }
    }
  }
</script>
<style lang="less" scoped>
  /* @import '~@assets/less/common.less'; */
  /deep/ .ant-card-head {
    border-bottom: none;
  }
  /deep/ .ant-radio-button-wrapper:first-child{
    border-left:none;
  }
  /deep/ .ant-radio-button-wrapper{
    border:none
  }
  /deep/ .ant-radio-button-wrapper:not(:first-child)::before{
    background-color:#F2F4F5
  }
  /deep/ .ant-radio-group{
    background: #F2F4F5;
    padding: 3px 6px;
    border-radius: 4px;
  }
  /deep/ .ant-radio-button-wrapper{
    background: none;
  }
  /deep/ .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
    background: #FFFFFF;
    color: #2F3133;
    font-weight: bold;
    border-radius: 4px;
  }



 /deep/ .ant-checkbox-group{
    background: #F2F4F5;
    padding: 3px 6px;
    border-radius: 4px;
    margin-top: 10px;
  }

  /deep/ .j-table-force-nowrap{
    width: 60%;
    float: right;
  }
  /deep/ .ant-calendar-picker{
    position:absolute;
    right:65px;
    top: 17px;
    width: 200px;
  }
 /deep/ .ant-input{
  border: none;
  background: none !important;
 }
  .dot{
    display: block;
    width: 8px;
    height: 8px;
    background: #FFFFFF;
    border: 2px solid ;
    box-sizing: border-box;
    border-radius: 8px;
  }
  .empty{
    text-align: center;
    .center{
      font-size: 16px;
      font-weight: bold;
      margin: 15px 0 10px 0;
      color: #000000;
    }
    button{
      margin-top: 15px;
      height: 50px;
      border-radius: 0;
    }
  }
</style>
