<template>
  <a-card :bordered="false" class="test">
    <a-calendar  :header-render="headerRender" @panelChange="onPanelChange" :disabledDate="disabledDate">
            <div slot="dateCellRender" slot-scope="value" :class="'events2'" @click="handleTest(value)">
                
                <!-- -----------------背景色----------------- -->
                <span v-for="item in passlist" :key="item.date">
                    <div v-if="getCheckDate(value) == item.date"
                        :class="[item.ifWork=='2'?'bg2':(getIfShow(value)?'bg1':'bg3'),testDate==handleDateSplicing(value)?'clickCss1':'clickCss2']">
                    </div>
                </span>
                <!-- ---------------日期--------------- --> 
                <div style="position: absolute;top: 4px;left: 11px;display: flex;">
                    <span 
                        v-if="value.date()==currentDay&&value.year()==currentYear&&value.month()==currentMonth" 
                        class="todayCss"
                        >
                        今
                    </span>
                    <span v-else style="font-weight: bold;">{{ value.date() }}</span>
                    <a-checkbox  style="margin-left: 15px;"
                        :checked="getIfCheck(value)" v-if="getIfShow(value)"
                        @change="onChange1(value,$event)"
                    />
                    <span style="margin-left: 15px;" @click="handleEditWH(value)"
                     v-if="handleDateSplicing(value)==testDate&&getIfShow(value)&&!getIfSubmit(value)&&!getIfPass(value) && !getIfRefuse(value)">                        
                        <a-tooltip>
                            <template slot="title">
                            修改
                            </template>
                            <a-icon type="form" style="color: #ddd;"/>
                        </a-tooltip>
                    </span>
                    <span style="margin-left: 15px;" @click="handleModify(value)"
                     v-if="handleDateSplicing(value)==testDate&&getIfShow(value)&&getIfFillIn(value)&&!getIfSubmit(value)&&!getIfPass(value) && !getIfRefuse(value)">                        
                        <a-tooltip>
                            <template slot="title">
                            重置
                            </template>
                            <a-icon type="redo" style="color: #ddd;" />
                        </a-tooltip>
                    </span>
                </div>
                <!-- -------------------每天做的项目------------------ -->
                <div style="height: 53px;margin-top: -50px;margin-left: 7px;"
                >
                        <span v-for="item in passlist" :key="item.date">
                            <span v-if="getCheckDate(value) == item.date && item.projectArray">
                                <span v-for="i in item.projectArray"
                                    :key="i.id"
                                    :style="[{marginTop: -5+'px'},{display: 'block'},{zIndex: 9999},{opacity:item.workHoursStatus==0?0.5:1}]">
                                        <a-tooltip>
                                            <template slot="title">
                                            {{ i.textall }}
                                            </template>
                                            <a-badge  :color="i.color" :text="i.text" 
                                            />
                                        </a-tooltip>
                                        
                                </span>
                                <div style="display: flex;justify-content: space-between;position: absolute;top: 80px;width: 90%;">
                                    <span  style="width: 20px;height: 20px;display: block;"></span>
                                    <div class="statusCss" @click="handleSureFilling(value,item)" v-if="getIfShow(value)&&getNoSubmit(value)">
                                        <a-icon type="check-circle"  style="font-size: 20px;color: #ddd;"/>
                                        <span style="margin: 0 5px;">填报</span>
                                        <span>{{ item.workingHours }}</span>
                                    </div>
                                    <div class="statusCss" v-if="getIfShow(value)&&getIfFillIn(value)" @click="handleSureFilling(value,item)">
                                        <a-icon type="check-circle"  style="font-size: 20px;color: #55C51F;"/>
                                        <span style="margin: 0 5px;">已填</span>
                                        <span>{{ item.workingHours }}</span>
                                    </div>
                                    <div class="statusCss" v-if="getIfSubmit(value)" @click="viewDetail(value)">
                                        <a-icon type="check-circle"  style="font-size: 20px;color: orange;"/>
                                        <span style="margin: 0 5px;">已提</span>
                                        <span>{{ item.workingHours }}</span>
                                    </div>
                                    <div class="statusCss" v-if="getIfPass(value)" @click="viewDetail(value)">
                                        <span class="radiusPass"><span class="iconcss">ok</span></span>
                                        <span style="margin: 0 5px;">通过</span>
                                        <span>{{ item.workingHours }}</span>
                                    </div>
                                    <div class="statusCss" v-if="getIfRefuse(value)" @click="viewDetail(value)">
                                        <a-icon type="minus-circle"  style="font-size: 20px;color: #F5242E;"/>
                                        <span style="margin: 0 5px;">驳回</span>
                                        <span>{{ item.workingHours }}</span>
                                    </div>
                                </div>
                            </span>
                        </span>
                </div>
            </div>
    </a-calendar>
    <div style="display: flex;justify-content: space-between;
    padding: 0 15px;width: 98.5%;height: 50px;
    line-height: 50px;background-color: #fff;margin-left: 0.8%;margin-top: -8px;border-radius: 0 0 20px 20px;">
        <div style="display: flex;">
            <div class="divcss">
                <span class="typecss">合计工时:</span>
                <span class="timecss">{{TotalWorkHours.totalHours}}h</span>
            </div>
            <div class="divcss">
                <span class="typecss">项目工时:</span>
                <span class="timecss">{{TotalWorkHours.projectHours}}h</span>
            </div>
            <div class="divcss">
                <span class="typecss">非项目工时:</span>
                <span class="timecss">{{TotalWorkHours.noProjectHours}}h</span>
            </div>
            <div class="divcss">
                <span class="typecss">已填工时天数:</span>
                <span class="timecss">{{TotalWorkHours.workHoursDay}}天</span>
            </div>
        </div>
        
        <div class="statusdiv" style="">
            <div class="statuscss">
                <span class="radiusNoSubmit">
                    <a-icon type="check-circle"  style="font-size: 20px;color: #ddd;"/>
                </span>
                <span class="timecss">未填写</span>
            </div>
            <div class="statuscss">
                <span class="">
                    <a-icon type="check-circle"  style="font-size: 20px;color: #55C51F;" />
                </span>
                <span class="timecss">已填写</span>
            </div>
            <div class="statuscss">
                <span class="">
                    <a-icon type="check-circle"  style="font-size: 20px;color: orange;" />
                </span>
                <span class="timecss">已提交</span>
            </div>
            <div class="statuscss">
                <span class="radiusPass"><span class="iconcss">ok</span></span>
                <span class="timecss">已通过</span>
            </div>
            <div class="statuscss">
                <span class="">
                    <a-icon type="minus-circle"  style="font-size: 20px;color: #F5242E;" />
                </span>
                <span class="timecss">被驳回</span>
            </div>
        </div>
    </div>
    <add-work-hours ref="AddWorkHours" :checkedList = 'checkedList' @handleStatus = 'handleStatus'></add-work-hours>
    <submit-work-hours ref="SubmitWorkHours"  @handleStatus = 'handleStatus'></submit-work-hours>
    <add-batch-work-hour ref="AddBatchWorkHour" @handleStatus = 'handleStatus' :checkedList = 'checkedList'></add-batch-work-hour>
    <a-modal v-model="warnningVisible" title="删除工时" ok-text="确认" cancel-text="取消" @ok="hideModal" :maskClosable="false">
      <p>确定删除此条工时记录?</p>
    </a-modal>
    <a-modal v-model="dailyVisible" ok-text="完成" cancel-text="不填写" @ok="handleSubmitDaily" :maskClosable="false" @cancel="handleSubmitDaily" width='380px'>
      <template slot="title">
        <a-icon type='check-circle' theme='filled' style="color: #55C51F;margin-right: 10px;"/><span style="font-size: 18px;font-weight: bold;">工时填写成功</span>
      </template>
      <p style="font-size: 17px;font-weight: bold;">日报描述</p>
      <a-input v-model="dailyContent" type="textarea"  :rows="4" placeholder="请输入您的日报描述"/>
      <div style="display: flex;justify-content: space-between;margin-top: 20px;">
            <a-input v-model="planNum"  placeholder="请输入分配任务数量" style="width: 48%;"/>
            <a-input v-model="realyNum"  placeholder="请输入实际任务数量" style="width: 48%;"/>
       </div>
    </a-modal>
  </a-card>
</template>
<script>
import moment from 'moment'
import AddWorkHours from './modules/AddWorkHours'
import SubmitWorkHours from './modules/SubmitWorkHours'
import AddBatchWorkHour from './modules/AddBatchWorkHour'
import { myPostAction,postAction,getAction } from '@/api/manage'
export default {
  components: { AddWorkHours,SubmitWorkHours,AddBatchWorkHour },
    data(){
       return {
            planNum:'',
            realyNum:'',
            backColor:'',
            currentMonth:new Date().getMonth(),
            currentYear:new Date().getFullYear(),
            currentDay:new Date().getDate(),
          //年度计划的打开关闭状态，true为打开，false为关闭
            yearShowOne:false,
            //添加对话框的表单绑定
            yaerMode:moment(new Date()).format('YYYY'),
            //monthArr:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            checkedList:[],
            dateNum:[],
            ifChecked:false,
            yearOptions:[],
            monthOptions:[],
            indeterminate: true,
            checkAll:false,
            ifPass:false, //工时审批通过
            ifSubmit:false,//工时审批提交
            ifRefuse:false,//工时审批未通过
            ifCheckBoxShow:false,//周六日不显示
            warnningVisible:false,
            modifyday:0, //选择取消哪天的工时
            submitList:[],
            url:{
                addActualList:'bus/busProjectActual/addActual',
                getUserWorkHoursStatus:'bus/busProjectActual/queryUserWorkHoursStatus',
                deleteByDate:'bus/busProjectActual/deleteByDate',
                getTotalWorkHours:'bus/busProjectActual/getTotalWorkHours',
                updateActualDaily:'bus/busProjectActual/updateActualDaily'
            },
            passlist:[],
            nowYearMonth:'',
            dayArr:[],
            choiceMonth:'',
            choiceYear:'',
            TotalWorkHours:{},
            ifForbidList:[],
            yearArr:[],//判断是否同一年
            monthArr:[],//判断是否同一月
            weekArr:[], //判断是否同一周
            thisWeek:[],//是否是本周
            dailyVisible:false,
            dailyContent:'',
            testDate:'',
            checkDays:[]

       }
    },
    created() {
      this.choiceYear = new Date().getFullYear()
      this.choiceMonth = new Date().getMonth()+1
    },
    mounted(){
        let month = this.currentMonth+1 < 10 ? '0'+(this.currentMonth+1) : (this.currentMonth+1)
        let a = this.currentYear + '-' + month
        this.getDate(this.currentYear)
        this.getUserWorkHoursStatus(a)
        // console.log(document.body.clientWidth,'screen.height-----5----screen.height',screen.width)
    },
    methods: {
        handleEditWH(value){
            const y= this.handleDateSplicing(value)
            this.checkedList = [y]
            this.$refs.AddWorkHours.loadData(y)
            this.$refs.AddWorkHours.ifShow = true
            this.$refs.AddWorkHours.visible = true
        },
        // 判断哪个日历框有编辑icon
        handleTest(value){
           const y= this.handleDateSplicing(value)
           this.testDate = y
        },
        //把日期拼接的代码抽出来
        handleDateSplicing(value){
            let month = value.month()+1 < 10 ? '0'+(value.month()+1) : (value.month()+1)
            let a = value.year() + '-' + month
            let y = a + '-' + ( value.date() < 10 ? '0' + value.date() : value.date() )
            return y
        },
        handleSubmitDaily(y){
            let params = {
                daily:this.dailyContent,
                workCalendar:this.checkedList.join(","),
                planNum:this.planNum,
                realyNum:this.realyNum
            }
            postAction(this.url.updateActualDaily,params).then(res=>{
                if(res.success){
                    let month = this.currentMonth+1 < 10 ? '0'+(this.currentMonth+1) : (this.currentMonth+1)
                    let a = this.currentYear + '-' + month
                    let b = this.nowYearMonth
                    let c = b ? b : a //如果用户没有切换过年月，那就是当前年月
                    this.getUserWorkHoursStatus(c)
                    this.$message.success(res.message)
                    this.dailyVisible = false
                }else{
                    this.$message.warning(res.message)
                }
            })
        },
        handleSureFilling(value,item){
            // console.log(item,'item-------------item')
            this.dailyContent = ''
            const y= this.handleDateSplicing(value)
            this.checkedList = [y]
            //如果未提交，则调用提交填报的接口，同时弹出日报弹框
            if(item.workHoursStatus == '0'&&item.projectArray.length>0){
                let params = {
                    workCalendar: this.checkedList.join(","),
                    daily:'',
                    busProjectActualList:item.projectHourDto
                }
                postAction(this.url.addActualList,params).then(res=>{
                    if(res.success){
                        this.dailyVisible = true
                    }else{
                        this.confirmLoading = false;
                        this.$message.warning(res.message)
                    }
                })
            }else{
                // console.log(this.$refs.AddWorkHours)
                this.$refs.AddWorkHours.loadData(y)
                this.$refs.AddWorkHours.ifShow = true
                this.$refs.AddWorkHours.visible = true
            }
            
        },
        getCheckDate(value){
            const specificDate = this.handleDateSplicing(value)
            return specificDate
        },
        viewDetail(value){
            const y= this.handleDateSplicing(value)
            this.$refs.SubmitWorkHours.loadData(y)
            this.$refs.SubmitWorkHours.ifShow = true
            this.$refs.SubmitWorkHours.visible = true
        },
        moment,
        getUserWorkHoursStatus(date){
            this.checkDays = []
            let url = 'bus/busProjectActual/queryUserWorkHoursStatus?date='+date
            myPostAction(url).then(res=>{
              if(res.success){
                for (let index = 0; index < res.result.length; index++) {
                    const element = res.result[index];
                    element.dateNum = element.date.split('-')[2]
                    let projectArray = element.workHoursStatus == '1' ? element.children : element.projectHourDto

                    
                    if(projectArray){
                        for (let j = 0; j < projectArray.length; j++) {
                            const item = projectArray[j];
                            const h = (item.workHours?parseFloat(item.workHours):0) + (item.overtimeHours?parseFloat(item.overtimeHours):0)
                            if(document.body.clientWidth<=1800){
                                let te = item.projectName.length >6 ? item.projectName.slice(0, 6) +'...' : item.projectName
                                item.text = ' ' + '('+h +'h)' + te
                            }else{
                                let te = item.projectName.length >10 ? item.projectName.slice(0, 10) +'...' : item.projectName
                                item.text = ' ' + '('+h +'h)' + te
                            }
                            
                            
                            item.textall = ' ' + '('+h +'h)' + item.projectName
                            item.color = '#f' +item.projectId.slice(12, 14) +'c'+item.projectId.slice(15, 17);
                        }
                        if(document.body.clientWidth<=1800){
                            element.projectArray = projectArray.length>2?projectArray.slice(0,2):projectArray
                        }else{
                            element.projectArray = projectArray.length>3?projectArray.slice(0,3):projectArray
                        }
                    }
                    // 获取可填工时的周的工作日天数
                    this.thisWeek.forEach(item=>{
                       if(item==res.result[index].date){
                          if(res.result[index].ifWork=='1'){
                            this.checkDays.push(item)
                          }
                       }
                    })
                    //-----------------------------------------
                }
                this.checkDays = this.checkDays.sort()
                this.passlist = res.result
                // console.log(this.checkDays,'this.checkDays')
                // console.log(this.thisWeek,'this.thisWeek')
                this.ifForbidList = []
                for (let j = 0; j < this.checkedList.length; j++) {
                    const element = this.checkedList[j];
                    for(let i = 0; i<this.passlist.length; i++){
                        if(this.passlist[i].date==element){
                            this.ifForbidList.push(this.passlist[i].status)
                        }
                    }
                }
              }else{
                this.$message.warning(res.message)
              }
           })
           let httpurl = this.url.getTotalWorkHours + '?date='+date
           getAction(httpurl).then(res=>{
              this.TotalWorkHours = res.result
           })
        },
        //判断是否显示
        getIfShow(value){
            const y= this.handleDateSplicing(value)
            for (let index = 0; index < this.thisWeek.length; index++) {
                const element = this.thisWeek[index];
                if(element==y){
                    return true
                }
            }
        },
        // 判断是否是提交的状态
        getIfSubmit(value){
            const y= this.handleDateSplicing(value)
                for (let index = 0; index < this.passlist.length; index++) {
                    const element = this.passlist[index];
                    if(element.date==y&&element.status == '2'){
                        return true
                    }
                }
        },
        getIfFillIn(value){
            const y= this.handleDateSplicing(value)
                for (let index = 0; index < this.passlist.length; index++) {
                    const element = this.passlist[index];
                    if(element.date==y&&element.status == '1'){
                        return true
                    }
                }
        },
                // 判断是否是未提交的状态
        getNoSubmit(value){
            const y= this.handleDateSplicing(value)
                for (let index = 0; index < this.passlist.length; index++) {
                    const element = this.passlist[index];
                    if(element.date==y&&element.status == '0'){
                        return true
                    }
                }
        },
        getIfPass(value){
            const y= this.handleDateSplicing(value)
            // if(moment(value).format('dddd') != '星期日' && moment(value).format('dddd') != '星期六'){
                for (let index = 0; index < this.passlist.length; index++) {
                    const element = this.passlist[index];
                    if(element.date==y&&element.status == '4'){
                        return true
                    }
                }
            // }
        },
        getIfRefuse(value){
            const y= this.handleDateSplicing(value)
            // if(moment(value).format('dddd') != '星期日' && moment(value).format('dddd') != '星期六'){
                for (let index = 0; index < this.passlist.length; index++) {
                    const element = this.passlist[index];
                    if(element.date==y&&element.status == '3'){
                        return true
                    }
                }
            // }
        },
        handleModify(value){
            this.warnningVisible = true
            this.modifyday = value
        },
        // 关闭删除弹框时做的一些操作
        hideModal() {
            let m = this.modifyday.month() +1 < 10 ? '0' + (this.modifyday.month() +1) : (this.modifyday.month() +1)
            let d = this.modifyday.date() < 10 ? '0' + this.modifyday.date() : this.modifyday.date()
            let n = this.modifyday.year() +'-'+m + '-' + d
            // console.log(date)
            let url = 'bus/busProjectActual/deleteByDate?date='+n
            postAction(url).then(res=>{
               if(res.success){
                    this.warnningVisible = false;
                    this.checkedList = this.checkedList.filter(j=>j != n) //先把这天过滤掉
                    this.ifDisabled = this.passlist.length === this.dateNum.length //点击确定之后，全选框禁止勾选
                    this.checkAll = this.passlist.length === this.dateNum.length;
                    // this.getIfSubmit(this.modifyday) //再判断页面显示什么icon
                    this.getUserWorkHoursStatus(this.modifyday.year() +'-'+m)
               }else{
                    this.$message.warning(res.message)
               }
            })
        //    console.log( this.checkedList,' this.checkedList---------------- this.checkedList')
        },
        //子组件传过来的参数
        handleStatus(){
            let month = this.currentMonth+1 < 10 ? '0'+(this.currentMonth+1) : (this.currentMonth+1)
            let a = this.currentYear + '-' + month 
            let b = this.nowYearMonth
            let c = b ? b : a //如果用户没有切换过年月，那就是当前年月
            this.getUserWorkHoursStatus(c)
            this.ifDisabled = this.passlist.length === this.dateNum.length //点击确定之后，全选框禁止勾选
            this.checkAll = this.passlist.length === this.dateNum.length; //如果全部提交，全选框就禁止勾选
            // this.checkedList = []
        },
        handleSingle(value){
            //只有勾选了这天才允许点击添加工时
            const y= this.handleDateSplicing(value)
            this.checkedList = [y]
            // if(this.checkedList.indexOf(n)>-1){
                this.$refs.AddWorkHours.ifShow = true
                this.$refs.AddWorkHours.visible = true
                this.$refs.AddWorkHours.title = '添加工时'
            // }else {
            //     this.$message.warning("请先勾选工作日")
            // }
        },
        getIfCheck(value){
            const y= this.handleDateSplicing(value)
                if(this.checkedList.indexOf(y)>-1){
                    return true
                }else{
                    return false
                }

        },
        onChange1(value,e) {
            const n = this.handleDateSplicing(value)
            if(e.target.checked == true) {
                this.checkedList.push(n)
                this.weekArr.push(value.week())
                this.yearArr.push(value.year())
                this.monthArr.push(value.month() +1)
            }else{
                this.weekArr = this.weekArr.filter(j=>j != value.week())
                this.yearArr = this.yearArr.filter(j=>j != value.year())
                this.monthArr = this.monthArr.filter(j=>j != (value.month() +1))
                this.checkedList = this.checkedList.filter(j=>j != n)
            }
            this.ifForbidList = []
            //判断两个数组是否一致
                 this.checkedList = this.checkedList.sort()  //需要先排序再去比对
				 let a = this.thisWeek.every((val, index)=> { 
                    console.log(val,this.checkedList[index])
					return val === this.checkedList[index]
				 })
				 let b = this.checkDays.every((val, index)=> { 
                    console.log(val,this.checkedList[index])
					return val === this.checkedList[index]
				 })
				let c = ((this.checkedList.length==this.thisWeek.length&&a) || (this.checkedList.length==this.checkDays.length && b))
				this.checkAll = c//判断是否全选
            for (let j = 0; j < this.checkedList.length; j++) {
                const element = this.checkedList[j];
                for(let i = 0; i<this.passlist.length; i++){
                    if(this.passlist[i].date==element){
                        this.ifForbidList.push(this.passlist[i].status)
                    }
                }
            }
        },
        //这个月有几天
        getDate(year, month){ 
            let d = new Date(year, month, 0);
            let num = d.getDate()   
            for (let index = 1; index < num+1; index++) {
                this.dateNum.push(
                    year + '-' + (month< 10 ? (0 + month) : month) + '-' + (index < 10 ? (0 + index) : index)
                )
            }
            let w = moment().days() //星期几
            let monday = (w==1 || w==2) ? moment().day(-6).format("DD"):moment().day(1).format("DD") //如果今天是周一，填报日期为上周，否则为本周
            let sunday = (w==1 || w==2) ? moment().day(0).format("DD"):moment().day(7).format("DD")
            let startmonth = (w==1 || w==2) ? parseFloat(moment().day(-6).format("M")) : parseFloat(moment().day(1).format("M")) //如果是跨月的周，需要获取本周一是几月，周日是几月
            let endmonth = (w==1 || w==2) ? parseFloat(moment().day(0).format("M")) : parseFloat(moment().day(7).format("M"))
            let fillMonth = (w==1 || w==2) ? moment().day(-6).format("MM"):moment().day(1).format("MM") //判断当前可填写工时的月份，如果周一周日是同一个月份的，直接拿周一周二的月份
            let newMonth = month ? parseFloat(month) : parseFloat(fillMonth)
            let connectSundayMonth = (w==1 || w==2) ? moment().day(0).format("MM"):moment().day(7).format("MM")
            // console.log(parseFloat(month)==parseFloat(fillMonth) , year!=this.currentYear,'month!=newMonth',parseFloat(month),parseFloat(fillMonth))
            // console.log(connectSundayMonth,fillMonth,moment().day(1).format("DD"))
            if((monday-0)<=(sunday-0)){
                // 判断正常情况下的一个星期，日期数从小到大
                for (let index = (monday-0); index <= (sunday-0); index++) {
                    let currentWeekDate = year + '-' + (newMonth< 10 ? ('0' + newMonth) : newMonth) + '-' + (index < 10 ? ('0' + index) : index)
                    if(newMonth==parseFloat(fillMonth) && year==this.currentYear){
                        if(this.thisWeek.indexOf(currentWeekDate)>-1) return
                        this.thisWeek.push(currentWeekDate) //如果有传入月份，并且传入的月份不等于可填的月份就不继续执行
                    }
                }
                // console.log(this.thisWeek,'thisWeek------111------thisWeek')
            }else{
                // console.log('----',newMonth,(this.currentMonth+1),'moment().day(1).format("MM")==',moment().day(1).format("MM"))
                //判断两个月衔接处的星期，由上个月末的几天和下个月初的几天组成
                let lastMonth = []
                for (let index = (monday-0); index <= new Date(year, startmonth, 0).getDate(); index++) { //需要获取上个月的天数
                    let currentWeekDate = year + '-' + (startmonth< 10 ? ('0' + startmonth) : startmonth) + '-' + (index < 10 ? ('0' + index) : index)
                    if(year!=this.currentYear||fillMonth!=(this.currentMonth)) return //必须是当前年月
                    if(this.thisWeek.indexOf(currentWeekDate)>-1) return
                    lastMonth.push(currentWeekDate)
                }
                let nextMonth = []
                for (let index = 1; index <= (sunday-0); index++) {
                    let currentWeekDate = year + '-' + (endmonth< 10 ? '0'+(endmonth) : endmonth) + '-' + (index < 10 ? ('0' + index) : index)
                    if(year!=this.currentYear||connectSundayMonth!=(this.currentMonth+1)) return
                    if(this.thisWeek.indexOf(currentWeekDate)>-1) return
                    nextMonth.push(currentWeekDate)
                }
                this.thisWeek = lastMonth.concat(nextMonth)
                // console.log('--lastMonth--',lastMonth,'-----nextMonth----',nextMonth)
                // console.log(this.thisWeek,'thisWeek-----222-------thisWeek')
            }
           
        },
        disabledDate(current) {
            this.backColor = (current.day()==6 || current.day() == 0) ? '#e8e8e8' : '#ffffff'
            if((current.month()+1) != (this.choiceMonth)){
                return true
            }else {
                return false
            }
        },
        onPanelChange(value, mode) {
            this.dateNum = []
            this.getDate(value.year(), value.month()+1)
        },
        handleDateSort(date){
            let dates = date
            dates.sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
            // this.$refs.AddBatchWorkHour.form.beginningTime = dates[0]
            // this.$refs.AddBatchWorkHour.form.endTime = dates[dates.length-1]
            this.$set(this.$refs.AddBatchWorkHour.form,'beginningTime',dates[0])
            this.$set(this.$refs.AddBatchWorkHour.form,'endTime',dates[dates.length-1])
        },
        //自定义头部
        headerRender({ value, type, onChange, onTypeChange }) {
            const start = 0;
            const end = 12;
            const monthOptions = [];

            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
                current.month(i);
                months.push(localeData.monthsShort(current));
            }

            for (let index = start; index < end; index++) {
                monthOptions.push(
                <a-select-option class="month-item" key={`${index}`}>
                    {months[index]}
                </a-select-option>,
                );
            }
            const elementsAreEqual = array => array.every(el => el === array[0])
            const month = value.month();

            const year = value.year();
            const options = [];
            for (let i = year - 10; i < year + 10; i += 1) {
                options.push(
                <a-select-option key={i} value={i} class="year-item">
                    {i}
                </a-select-option>,
                );
            }
            const ifDisabled = this.ifDisabled
            const checkAll=this.checkAll

            const nextYear = () => {
                this.choiceYear++
                let newYear = moment(value).add(1, 'y');
                onChange(newYear);
                this.checkedList = []
                let month = this.choiceMonth < 10 ? '0'+(this.choiceMonth) : (this.choiceMonth)
                let date = this.choiceYear + '-' + month
                this.nowYearMonth = date
                this.getDate(this.choiceYear, month)
                this.getUserWorkHoursStatus(date)
            }
            const lastYear = () => {
                this.choiceYear--
                let newYear = moment(value).subtract(1, 'years')
                onChange(newYear);
                this.checkedList = []
                let month = this.choiceMonth < 10 ? '0'+(this.choiceMonth) : (this.choiceMonth)
                let date = this.choiceYear + '-' + month
                this.nowYearMonth = date
                this.getDate(this.choiceYear, month)
                this.getUserWorkHoursStatus(date)
            }

            return (
                <div style={{ padding: '10px' }}>
                    <a-row type="flex" justify="space-between">
                        <a-col style="display:flex;align-items:center">
                            <span style='font-size: 16px;font-weight: bold;margin-right: 50px;'>我的工时</span>
                            <a-icon type="caret-left" onClick={() =>lastYear()} class='caretleftcss'/>
                            <a-select
                                dropdownMatchSelectWidth={false} class="my-month-select"
                                value={String(month)}
                                onChange={selectedMonth => {
                                    this.checkedList = []
                                    const newValue = value.clone();
                                    newValue.month(parseInt(selectedMonth, 10));
                                    this.choiceMonth = newValue.month()+1
                                    let month = newValue.month()+1 < 10 ? '0'+(newValue.month()+1) : (newValue.month()+1)
                                    let date = newValue.year() + '-' + month
                                    {/* sessionStorage.setItem("date",date) */}
                                    this.getDate(newValue.year(), month)
                                    this.nowYearMonth = date
                                    onChange(newValue);
                                    this.getUserWorkHoursStatus(date)
                                }}
                            >
                                {monthOptions}
                            </a-select>
                            <span class='choiceYearCss'>{this.choiceYear}</span>
                            <a-icon type="caret-right" onClick={() => nextYear()} class='caretrightcss'/>
                        </a-col>
                        <a-col>
                            <a-checkbox
                                checked={checkAll}  disabled={ifDisabled}
                                onChange={e => {
                                    this.checkAll = e.target.checked
                                    this.checkedList= e.target.checked ? this.checkDays : []
                                    this.ifForbidList = []
                                    for (let j = 0; j < this.checkedList.length; j++) {
                                        const element = this.checkedList[j];
                                        for(let i = 0; i<this.passlist.length; i++){
                                            if(this.passlist[i].date==element){
                                                this.ifForbidList.push(this.passlist[i].status)
                                            }
                                        }
                                    }
                               }}
                               
                            >
                                全选本周
                            </a-checkbox>
                           <a-button  style="margin-left: 15px;background:#f7f8fa" onClick={e => {
                                   if(this.ifForbidList.includes('2')||this.ifForbidList.includes('3')||this.ifForbidList.includes('4')){
                                        this.$message.warning("请选择【未填写】或者【已填写】工时的日期进行填写")
                                        return
                                    }else if(this.checkedList.length > 1){
                                        if( !(elementsAreEqual(this.weekArr) )){
                                            this.$message.warning("请选择同一周内的日期进行工时填写")
                                            return
                                        }
                                        this.handleDateSort(this.checkedList)
                                        this.$refs.AddBatchWorkHour.visible = true
                                    }else if(this.checkedList.length <2){
                                        this.$message.warning("请选择多个日期填写工时")
                                        return
                                    }
                               }}>
                            批量填写工时
                            </a-button>
                            <a-button
                                type="primary"
                                style="margin-left: 15px;"
                                onClick={e => {
                                    console.log(this.checkedList,'全选',this.ifForbidList)
                                    {/* 0未填写  1已填写  2已提交  4已通过   3 被驳回 */}
                                    if(this.checkedList.length<1){
                                        this.$message.warning("请先勾选【已填写未提交】日期")
                                        return
                                    }else if(this.checkedList.length>7){
                                        this.$message.warning("每次最多可提交7天工时")
                                        return
                                    }else if(this.ifForbidList.length !=this.checkedList.length||
                                            this.ifForbidList.includes('2')||
                                            this.ifForbidList.includes('3')||
                                            this.ifForbidList.includes('0')||
                                            this.ifForbidList.includes('4')){
                                        this.$message.warning("请选择【已填写未提交】工时进行提交")
                                        return
                                    }else if(!(elementsAreEqual(this.weekArr))){
                                        this.$message.warning("请选择同一周内的日期提交")
                                        return
                                    }else if(moment().format('d')=='1'&&this.checkedList.includes(moment().format('YYYY-MM-DD'))){
                                        this.$message.warning("周一为上周工时最晚提交时间，请在周一之后提交本周工时")
                                        return
                                    }
                                    else{
                                        this.dayArr = []
                                        this.$refs.SubmitWorkHours.ifShow = false
                                        this.$refs.SubmitWorkHours.visible = true
                                        this.$refs.SubmitWorkHours.loadData(this.checkedList.join(','))
                                        this.$refs.SubmitWorkHours.dateList = this.checkedList
                                    }
                                }}>
                                批量提交
                            </a-button>
                        </a-col>
                    </a-row>
                    <a-row>
                        <div style='font-size: 10px;height:20px;margin:10px 0;'>
                            <p>温馨提示 : 当周工时建议当周完成填写和提交，最晚填写和提交时间不能晚于下周一下午6:00。
                                下周一之后不允许补填上周工时。<br/>工时填报需按周填报 , 可选范围为当周 ( 如 : 周一 ~ 周日 ) , 
                                不可跨周提交 , ( 如 : 本周三 ~ 下周二 )</p>
                        </div>
                    </a-row>
                </div>
            );
        },
        handleChange(value) {
        //   console.log(`selected ${value}`);
        },
        onChange(value) {

        }
    },
};
</script>
<style scoped>
 @media (min-width: 1440px){ 
    .events2 {
        list-style: none;
        margin: 0;
        padding: 82px 5px 0 5px;
        position: absolute;
        top: 1px;
        left: -3px;
        width: 107%;
        height: 98%;
    }
    .bg3{
        position: absolute;
        background-color: #F9FBFF;
        width: 102%;
        height: 120px;
        top: -3px;
        left: -3px;
    }
    .bg2{
        position: absolute;
        background-color: #F0F2F5;
        width: 102%;
        height: 120px;
        top: -3px;
        left: -3px;
    }
    .bg1{
        position: absolute;
        background-color:#fff;
        width: 102%;
        height: 120px;
        top: -3px;
        left: -3px;
    }
}
@media (min-width: 1900px){ 
    .events2 {
        list-style: none;
        margin: 0;
        padding: 82px 5px 0 5px;
        position: absolute;
        top: 1px;
        left: -3px;
        width: 103%;
        height: 98%;
    }
    .bg3{
        position: absolute;
        background-color: #F9FBFF;
        width: 102.8%;
        height: 120px;
        top: -3px;
        left: -3px;
    }
    .bg2{
        position: absolute;
        background-color: #F0F2F5;
        width: 102.8%;
        height: 120px;
        top: -3px;
        left: -4px;
    }
    .bg1{
        position: absolute;
        background-color:#fff;
        width: 102.8%;
        height: 120px;
        top: -3px;
        left: -3px;
    }
}
.test{
  background: none !important;
}
.todayCss{
    display: block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: #cc148a;
    border-radius: 50%;
    text-align: center;
    color: #fff;
}
.statusCss{
    /* z-index: 999; */
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    /* width: 53%; */
    justify-content: space-between;
    font-size: 10px;
}
.events {
list-style: none;
margin: 0;
padding: 82px 5px 0 5px;
position: absolute;
top: 1px;
left: -3px;
background-color: #eeeeee;
width: 103%;
height: 98%;

}
.clickCss1{
    border:2px solid #cc148a
}
.clickCss2{
    border:none
}
.events .ant-badge-status {
overflow: hidden;
white-space: nowrap;
width: 100%;
text-overflow: ellipsis;
font-size: 12px;
}
.notes-month {
text-align: center;
font-size: 28px;
}
.notes-month section {
font-size: 28px;
}
.my-year-select{
    margin-right: 15px;
}
.plusCss{
    width: 25px;
    height: 25px;
    background-color: #ddd;
    border-color: #ddd;
    text-align: center;
    z-index: 999;
}
.radius1{
    position: absolute;
    top: 10px;
    right: 10px;
}
.radius2{
    width: 20px;
    height: 20px;
    line-height: 19px;
    background-color: #3055BA;
    display: block;
    border-radius: 50%;
    text-align: center;
    position: absolute;
    top: 10px;
    right: 10px;
}
.radiusPass{
    width: 20px;
    height: 20px;
    line-height: 18px;
    display: block;
    border-radius: 50%;
    text-align: center;
    border: 1px solid #3055BA;
}
.radius3{
    position: absolute;
    top: 10px;
    right: 10px;
}
.iconcss{
    color: #3055BA;
}
.timecss{
    margin-left: 5px;
    color: #000;
    font-weight: 700;
}
.typecss{
    color: #9CA0A6;
    font-size: 13px;
}
.divcss{
    margin-right: 60px;
    display: flex;
}
.statusdiv{
    width: 550px;
    display: flex;
    /* padding: 0 0 0 50px; */
}
.statuscss{
    width: 33%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.caretleftcss{
    font-size: 25px;
    margin-right: 10px;
}
.caretrightcss{
    font-size: 25px;
    margin-left: 20px;
}
.choiceYearCss{
    font-size: 16px;
    font-weight: 700;
}
::v-deep .ant-select-selection-selected-value{
    font-weight: 700;
    font-size: 16px;
}
::v-deep .ant-fullcalendar-fullscreen .ant-fullcalendar-value {
    width: auto;
    text-align: left;
    background: transparent;
}

::v-deep .ant-fullcalendar-column-header .ant-fullcalendar-column-header-inner {
    display: block;
    font-weight: normal;
    text-align: center;
}
::v-deep .ant-fullcalendar-fullscreen .ant-fullcalendar-column-header {
    padding-right: 12px;
    padding-bottom: 5px;
    text-align: right;
    border: 1px solid #e8e8e8;
    height: 40px;
    background: #fff;
}
::v-deep .ant-fullcalendar-fullscreen .ant-fullcalendar-date {
    display: block;
    height: 116px;
    margin: 0 4px;
    /* padding: 4px 8px; */
    color: rgba(0, 0, 0, 0.65);
    text-align: left;
    border: none;
    transition: background 0.3s;
    position: relative;
}
::v-deep .ant-fullcalendar-cell{
    border: 2px solid #e8e8e8;
    position: relative;
}
::v-deep .ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-date {
    background: #fff;
}
::v-deep .ant-fullcalendar-disabled-cell .ant-fullcalendar-date{
    cursor: pointer;
}
::v-deep .ant-fullcalendar-fullscreen .ant-fullcalendar-date:hover{
    background: #fff;
}
.textCss{
    font-size: 10px;
}
::v-deep .ant-badge-status-text{
    font-size: 10px;
}
::v-deep .ant-modal-header{
    border: none;
}
::v-deep .ant-modal-footer{
    border: none;
}
::v-deep .ant-modal-footer div{
    display: flex;
    justify-content: space-between;
}
::v-deep .my-month-select .ant-select-selection{
  border: none;
  background-color: #f7f8fa;
}
::v-deep .my-month-select .ant-select-open .ant-select-selection{
  box-shadow: none;
}
::v-deep .ant-fullcalendar-table{
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 20px;
    /* border: solid 2px #dfdfdf; */
}
::v-deep .ant-fullcalendar-table th:last-child{
    border-radius: 0 20px 0 0;
}
::v-deep .ant-fullcalendar-table th:first-child{
    border-radius: 20px 0 0 0;
}
/* ::v-deep .ant-fullcalendar-table tr:last-child td:first-child,::v-deep .ant-fullcalendar-table tr:last-child td:first-child .bg3{
    border-radius: 0 0 0 20px;
}
::v-deep .ant-fullcalendar-table tr:last-child td:last-child,::v-deep .ant-fullcalendar-table tr:last-child td:last-child .bg2{
    border-radius: 0 0 20px 0;
} */
</style>
