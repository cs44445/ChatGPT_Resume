<template>
    <div>
        <a-card :bordered="false" class="test">
            <p class="data-title" style="font-weight: bold;color: #333333;">数据报表</p>
            <div style="display: flex;">
                <div style="width: 23%;">
                    <span class="data-subtitle" style="color: #000;">任务</span>
                    <!-- <div style="margin-top: 15px;font-size: 30px;font-weight: bold;color: #08C35C;">40%</div> -->
                    <div style="display: flex;margin-top: 15px;">
                        <div class="task" style="width: 25%;background: #E6F0F9;border-radius: 4px;">
                            <div class="tasknum" style="margin-left: 6px;color: #1E8EF6;">{{ countTasks.sumTaskCount }}</div>
                            <span class="tasknum-sub" style="margin-left: 6px;">任务</span>
                        </div>
                        <div class="task" style="width: 25%;background: #E5F5ED;margin-left: 3%;border-radius: 4px;">
                            <div class="tasknum" style="margin-left: 6px;color: #08C35C;">{{ countTasks.executeCount }}</div>
                            <span class="tasknum-sub" style="margin-left: 6px;">进行中</span>
                        </div>
                    </div>
                    <div style="margin-top: 15px;">
                        <div style="display: flex;gap:8%;">
                           <div class="task">
                              <div class="tasknum2">{{ countTasks.completedCount }}</div>
                              <span class="task-status">已完成</span>
                           </div>
                           <div class="task">
                              <div class="tasknum2">{{ countTasks.delayCount }}</div>
                              <span class="task-status">延期</span>
                           </div>
                            <div class="task">
                              <div class="tasknum2">{{ countTasks.unclaimedCount }}</div>
                              <span class="task-status">待认领</span>
                           </div>
                        </div>
                        <div style="display: flex;gap:8%;margin-top: 15px;">
                           <div class="task">
                              <div class="tasknum2">{{ countTasks.timeTbdCount }}</div>
                              <span class="task-status">时间待定</span>
                           </div>
                           <div class="task">
                              <div class="tasknum2">{{ countTasks.todayCount }}</div>
                              <span class="task-status">今日到期</span>
                           </div>
                           <div class="task">
                              <div class="tasknum2">{{ countTasks.delayCompletedCount }}</div>
                              <span class="task-status">延期完成</span>
                           </div>
                        </div>
                    </div>
                </div>
                <div style="width: 27%;">
                    <span class="data-subtitle" style="color: #000;">工时</span>
                    <div style="width: 90%;margin-top: 15px;" >
                        <div>
                            <span>整个项目{{timeCount.wholeWorkHours}}h</span>
                            <span style="margin-left: 30px;color: #8D9399;">已使用{{timeCount.usedWorkHours}}h</span>
                            <span style="float: right;color: #8D9399;">{{timeCount.workHoursRatio}}%</span>
                            <a-progress :percent="timeCount.workHoursRatio" :showInfo="false" :stroke-color="{
                                '0%': '#08C35C',
                                '100%': '#08C35C',
                            }"/>
                        </div>
                        <div style="margin-top: 10px;display: flex;justify-content: space-between;gap: 10px;">
                            <a-timeline style="width: 65%;">
                                <a-timeline-item class="timelinecss"
                                v-for="(item,index) in timeCount.milepostInfo1"
                                :key="item.id"
                                @click="handleClickMilepostInfo(item,index)"
                                :color="item.colorStatus == 3 ? '#D92929' : (item.colorStatus == 1?'#0467F1':'#F2B202')">
                                    <template slot="dot">
                                        <div :style="[
                                            {width: 10+'px'},
                                            {height: 10+'px'},
                                            {background: item.colorStatus == 3 ? '#D92929' : (item.colorStatus == 1?'#0467F1':'#F2B202')},
                                            {borderRadius:50+'%'}
                                            ]">
                                        </div>
                                    </template>
                                    <div class="time-list">
                                        <span>{{timeCount.milepostInfo1.length>0?item.milepostName:''}}</span>
                                        <span>{{timeCount.milepostInfo1.length>0?item.planHours:''}}h</span>
                                    </div>
                                   <div class="time-font" style="color: rgba(47, 49, 51, 0.27);" v-if="currentIndex==index">
                                     {{timeCount.milepostInfo1.length>0?item.startTime:''}}
                                     至
                                     {{timeCount.milepostInfo1.length>0?item.endTime:''}}
                                   </div>
                                </a-timeline-item>

                                <a-popover  placement="bottom" trigger="click" :overlayStyle="{width:'13%'}">
                                    <template slot="content">
                                        <a-timeline-item class="timelinecss1"  v-for="(v,index1) in residueTimeCount" :key="v.id" @click="handleClickMilepostInfo1(v,index1)">
                                            <template slot="dot">
                                                <div :style="[
                                                    {width: 10+'px'},
                                                    {height: 10+'px'},
                                                    {background: v.colorStatus == 3 ? '#D92929' : (v.colorStatus == 1?'#0467F1':'#F2B202')},
                                                    {borderRadius:50+'%'}
                                                    ]">
                                                </div>
                                            </template>
                                            <div class="time-list">
                                                <span>{{residueTimeCount.length>0? v.milepostName:''}}</span>
                                                <span style="margin-left: 55px;">{{residueTimeCount.length>0?v.planHours:''}}h</span>
                                            </div>
                                            <div style="color: rgba(47, 49, 51, 0.27);font-size: 11px;" v-if="currentIndex1==index1">
                                                {{residueTimeCount.length>0?v.startTime:''}}
                                                至
                                                {{residueTimeCount.length>0?v.endTime:''}}
                                            </div>
                                        </a-timeline-item>
                                    </template>
                                    <img src="~@/assets/more.png" alt="logo" v-if="residueTimeCount.length>0">
                                </a-popover >

                            </a-timeline>
                            <a-progress type="circle" :percent="milepostRatio" 
                            :width="85"
                            :stroke-color="{
                                '0%': '#F2B202',
                                '100%': '#F2B202',
                            }">
                                <template #format="percent">
                                    <div style="font-weight: bold;">{{mileRatio}}h</div>
                                    <div style="font-size: 12px;">当前里程碑</div>
                                </template>
                            </a-progress>
                        </div>
                    </div>
                </div>
                <div style="width: 25%;">
                    <span class="data-subtitle" style="color: #000;">项目预算</span>
                    <div style="width: 90%;margin-top: 15px;">
                        <div>
                            <span>总共预算</span>
                            <span style="margin-left: 30px;">{{ budgetCount.totalBudget | moneyFormat }}</span>
                            <span style="float: right;">{{budgetCount.budgetRadio}}%</span>
                            <a-progress :percent="budgetCount.budgetRadio" :showInfo="false" :stroke-color="{
                                '0%': '#08C35C',
                                '100%': '#08C35C',
                            }"/>
                        </div>
                        <div>
                            <span class="pbcss">
                                <span>已使用</span><span>￥{{budgetCount.usedBudgetInfo | moneyFormat}}</span>
                            </span>
                            <span class="pbcss">
                                <span>剩余预算</span><span>￥{{budgetCount.subtract | moneyFormat}}</span>
                            </span>
                            <span class="pbcss">
                                <span>已分配预算</span><span>￥{{budgetCount.assignBudget | moneyFormat}}</span>
                            </span>
                            <span style="font-size: 12px;color: #A2A2A2;">{{budgetCount.startTime}}至{{ budgetCount.endTime }}</span>
                        </div>
                    </div>
                </div>
                <div style="width: 25%;">
                    <span class="data-subtitle" style="color: #000;">里程碑预算</span>
                    <div style="width: 90%;margin-top: 15px;">
                        <a-timeline>
                            <a-timeline-item class="timelinecss1"  v-for="item in milepostBudgetCount" :key="item.id"
                            :color="item.colorStatus == 3 ? '#D92929' : (item.colorStatus == 1?'#0467F1':'#F2B202')">
                                <template slot="dot">
                                    <div :style="[
                                        {width: 10+'px'},
                                        {height: 10+'px'},
                                        {background: item.colorStatus == 3 ? '#D92929' : (item.colorStatus == 1?'#0467F1':'#F2B202')},
                                        {borderRadius:50+'%'}
                                        ]">
                                    </div>
                                </template>
                                <span style="display: flex;justify-content: space-between;">
                                    <span>{{ item.milepostName }}</span>
                                    <span>￥{{ item.usedBudget | moneyFormat }}/{{ item.assignBudget | moneyFormat }}</span>
                                </span>
                                <a-progress :percent="item.budgetRadio" :stroke-color="{
                                    '0%': '#08C35C',
                                    '100%': '#08C35C',
                                }"/>
                            </a-timeline-item>
                            <span >
                                <a-popover  placement="bottomRight" trigger="click" :overlayStyle="{width:'20%'}">
                                    <template slot="content">
                                        <a-timeline-item class="timelinecss1"  v-for="item in residueMilepostBudgetCount" :key="item.id">
                                            <template slot="dot">
                                                <div :style="[
                                                    {width: 10+'px'},
                                                    {height: 10+'px'},
                                                    {background: item.colorStatus == 3 ? '#D92929' : (item.colorStatus == 1?'#0467F1':'#F2B202')},
                                                    {borderRadius:50+'%'}
                                                    ]">
                                                </div>
                                            </template>
                                            <span style="display: flex;justify-content: space-between;">
                                                <span>{{ item.milepostName }}</span>
                                                <span>￥{{ item.usedBudget | moneyFormat }}/{{ item.assignBudget | moneyFormat }}</span>
                                            </span>
                                            <a-progress :percent="item.budgetRadio" :stroke-color="{
                                                '0%': '#08C35C',
                                                '100%': '#08C35C',
                                            }"/>
                                        </a-timeline-item>
                                    </template>
                                    <img src="~@/assets/more.png" alt="logo" v-if="residueMilepostBudgetCount.length>0">
                                </a-popover >

                            </span>
                        </a-timeline>
                    </div>
                </div>
            </div>
            <!-- -------------工时分布、利润金额------------ -->
            <div style="display: flex;justify-content: space-between;margin-top: 50px;">
                <!-- <div class="time-chart"> -->
                    <gantt-chart :projectId="projectId" ref="ganttchart"  style="width: 35vw;"/>
                <!-- </div> -->
                <!-- <div class="money-chart"> -->
                    <draw-chart :projectId="projectId" ref="moneychart" style="width: 40vw;" class="test1" />
                <!-- </div> -->
            </div>
            <!-- ------项目整体工时趋势图----------- -->
            <div style="margin-top: 50px;">
                <OverallProjectHours :projectId="projectId" ref="OverallProjectHours"></OverallProjectHours>
            </div>
            <!-- ---------项目成员工时统计----------- -->
            <div style="margin-top: 50px;">
                <p class="data-subtitle" style="color: #000;">项目成员工时统计</p>
                <div style="display: flex;justify-content: space-between;">
                    <div style="width: 40%">
                        <span>任务</span>
                        <div style="margin-top: 10px;">
                            <div style="display: flex;border-bottom:1px solid rgba(216, 216, 216, 0.5);padding: 8px 0;" v-for="item in memberTaskWorkHours.taskList" :key="item.realName">
                                <div class="task-bord" style="border: 1px solid #D3DCE5;
                                    border-radius: 50%;text-align: center;line-height: 22px;">
                                    {{ item.shortName }}
                                </div>
                                <span style="width: 70px;color: #3D3D3D;">{{ item.realName }}{{item.leave}}</span>
                                <div style="position: relative;width: 400px;height: 20px;margin-left: 50px;
                                background: linear-gradient(90deg, rgba(4,103,241,0.21) 0%, rgba(4,103,241,0.00) 100%);">
                                </div>
                                <span style="position: absolute;left: 35%;color: #3D3D3D;">{{ item.taskCount }}</span>
                            </div>
                        </div>
                    </div>
                    <div style="width: 40%;">
                        <span>工时</span>
                        <div style="margin-top: 10px;">
                            <div style="display: flex;border-bottom:1px solid rgba(216, 216, 216, 0.5);padding: 8px 0;" v-for="item in memberTaskWorkHours.hourList" :key="item.realName">
                                <div class="task-bord" style="border: 1px solid #D3DCE5;
                                    border-radius: 50%;text-align: center;line-height: 22px;">
                                    {{ item.shortName }}
                                </div>
                                <span style="width: 70px;color: #3D3D3D;">{{ item.realName }}{{item.leave}}</span>
                                <div style="position: relative;width: 400px;height: 20px;
                                background: linear-gradient(90deg, rgba(4,103,241,0.21) 0%, rgba(4,103,241,0.00) 100%);margin-left: 50px;">
                                </div>
                                <span style="position: absolute;left: 93.5%;color: #3D3D3D;">{{ item.hoursCount }}h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>
<script>
import GanttChart from './modules/GanttChart'
import DrawChart from './modules/DrawChart'
import OverallProjectHours from './modules/OverallProjectHours'
import { postAction,getAction } from '@/api/manage'
export default {
    props: {
        projectId: {
        type: String
        }
    },
    components: {
        GanttChart,
        DrawChart,
        OverallProjectHours
    },
    data(){
       return {
          url:{
            countWorkHours:'bus/count/countWorkHours',
            countProjectBudget:'bus/count/countProjectBudget',
            countMilepostBudget:'bus/count/countMilepostBudget',
            countProjectWholeWorkHoursMap:'bus/count/countProjectWholeWorkHoursMap',
            countMemberTaskWorkHours:'bus/count/countMemberTaskWorkHours',
            countTasks:'bus/count/countTasks'
          },
          timeCount:{},
          mileRatio:'0/0',
          budgetCount:{},
          milepostBudgetCount:[],
          memberTaskWorkHours:{},
          countTasks:{},
          currentIndex:0,
          residueMilepostBudgetCount:[],
          residueTimeCount:[],
          milepostRatio:0,
          currentIndex1:0

       }
    },
    watch: {
      projectId: function() {
        this.handleCountWorkHours()
        this.handleCountProjectBudget()
        this.handleCountMilepostBudget()
        this.handleCountMemberTaskWorkHours()
        this.handleCountTasks()
      }
    },
    mounted(){
        this.handleCountWorkHours()
        this.handleCountProjectBudget()
        this.handleCountMilepostBudget()
        this.handleCountMemberTaskWorkHours()
        this.handleCountTasks()
        this.$refs.moneychart.init()
        this.$refs.ganttchart.init()
        this.$refs.OverallProjectHours.handleInit()
    },
    methods:{
        handleCountWorkHours(){
           postAction(this.url.countWorkHours+'?projectId='+this.projectId).then(res=>{
              if(res.success){
                res.result.milepostInfo1 = res.result.milepostInfo.length>3 ? res.result.milepostInfo.slice(0,3) : res.result.milepostInfo
                this.timeCount = res.result
                this.residueTimeCount = res.result.milepostInfo.length>3 ? res.result.milepostInfo.slice(3,res.result.milepostInfo.length) : []
                if(res.result.milepostInfo.length>0){
                    this.milepostRatio = res.result.milepostInfo[0].milepostRatio
                    this.mileRatio = res.result.milepostInfo[0].usedHours + '/' + res.result.milepostInfo[0].planHours
                }
                
              }
           })
        },
        handleClickMilepostInfo(item,index){
           this.mileRatio = item.usedHours + '/' + item.planHours
           this.milepostRatio = item.milepostRatio
           this.currentIndex = index
        },
        handleClickMilepostInfo1(item,index){
           this.mileRatio = item.usedHours + '/' + item.planHours
           this.milepostRatio = item.milepostRatio
           this.currentIndex1 = index
        },
        handleCountProjectBudget(){
            postAction(this.url.countProjectBudget+'?projectId='+this.projectId).then(res=>{
              if(res.success){
                this.budgetCount = res.result
              }
           })
        },
        handleCountMilepostBudget(){
            postAction(this.url.countMilepostBudget+'?projectId='+this.projectId).then(res=>{
              if(res.success){
                this.milepostBudgetCount = res.result.length>3 ? res.result.slice(0,3) : res.result
                this.residueMilepostBudgetCount = res.result.length>3 ? res.result.slice(3,res.result.length) : []
              }
           })
        },
        handleCountProjectWholeWorkHoursMap(){
            postAction(this.url.countProjectWholeWorkHoursMap+'?projectId='+this.projectId).then(res=>{
              if(res.success){
                this.wholeWorkHoursMap = res.result
              }
           })
        },
        handleCountMemberTaskWorkHours(){
            postAction(this.url.countMemberTaskWorkHours+'?projectId='+this.projectId).then(res=>{
              if(res.success){
                res.result.taskList.forEach(element => {
                    element.shortName=element.realName.slice(0,1)
                });
                res.result.hourList.forEach(element => {
                    element.shortName=element.realName.slice(0,1)
                });
                this.memberTaskWorkHours = res.result
              }
           })
        },
        handleCountTasks(){
            postAction(this.url.countTasks+'?projectId='+this.projectId).then(res=>{
              if(res.success){
                this.countTasks = res.result
              }
           })
        },
    }

}
</script>
<style scoped>
.test{
  background: none !important;
}
.task{
    width: 23%;
}
.pbcss{
    display: flex;
    justify-content: space-between;
    border-bottom:1px solid rgba(216, 216, 216, 0.5);
    padding-bottom: 8px;
    margin-bottom: 8px;
}
.timelinecss{
    padding: 0 0 8px;
}
.timelinecss1{
    padding: 0 0 10px;
}
::v-deep .ant-timeline-item-head{
    background-color: #F7F8FA;
}
.task-status{
    font-size: 12px;
    color: #8D9399;
}
.tasknum-sub{
    font-size: 13px;
}
.tasknum2{
    font-weight: 500;
    font-size: 16px;
    color: #3D3D3D;
}
@media screen and (max-width: 1440px) {
    .test /deep/ .ant-card-body{
        padding: 0 12px 12px 12px;
    }
    .data-title{
        font-size: 20px;
    }
    .data-subtitle{
        font-size: 18px;
        font-weight: bold;
    }
    .tasknum{
        font-weight: 500;
        font-size: 20px;
        color: #3D3D3D;
    }
    .time-list{
        display: flex;
        justify-content: space-between;
    }
    .time-font{
        font-size: 11px;
        transform: scale(0.9);
        margin-left: -5%;
    }
    .time-chart{
        width: 47%;
    }
    .money-chart{
        width: 53%;
    }
    .task-bord{
        width: 30px;
        height: 25px;
        margin-right: 11px;
    }
}

@media screen and (min-width: 1441px) {
    .test /deep/ .ant-card-body{
        padding: 0 24px 24px 24px;
    }
    .data-title{
        font-size: 20px;
    }
    .data-subtitle{
        font-size: 18px;
        font-weight: bold;
    }
    .tasknum{
        font-weight: bold;
        font-size: 18px;
        color: #3D3D3D;
    }
    .time-list{
        display: flex;
        justify-content: space-between;
    }
    .time-font{
        font-size: 11px;
    }
    .time-chart{
        width: 47%;
    }
    .money-chart{
        width: 50%;
    }
    .task-bord{
        width: 25px;
        height: 25px;
        margin-right: 11px;
    }
}
</style>