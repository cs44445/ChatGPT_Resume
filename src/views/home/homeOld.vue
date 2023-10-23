<template>
  <div class="index-container-ty">
    <a-spin :spinning="loading">
      <div v-has="'home:projectInfo'">
        <div class="index-title">
          <span></span><span @click="getAllPro" v-if="projectList.length > 4">所有项目({{ projectList.length }})
            <a-icon type="down" />
          </span>
        </div>
        <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
          <card-chart v-for="(item, index) in getProjectList" :key="index" :cardIndex="index" :showWidth="showWidth"
            :title="item.projectName" :startTime="item.start" :endTime="item.end" :step="item.milePostInfo"
            :budget="item.budget" :work="item.timeSheet" @updateInfo="updateInfo" @toDetail="toDetail(item.id)">
            <template slot="chartTip">
              <div :class="statusClass(item.colorInfo)">
                <a-icon :type="iconType(item.colorInfo)" theme="filled" :style="{ color: iconStyle(item.colorInfo) }" />
                <span>{{ item.projectStatus }}</span>
              </div>
            </template>
            <template slot="process1">
              <a-progress :stroke-color="{ '0%': iconStyleStart(item.timeColor), '100%': iconStyle(item.timeColor) }"
                :percent="item.timeSheetUse">
                <template slot="format">
                  <div style="color:rgba(0, 0, 0, 0.45)">
                    {{ item.timeSheetUse }}%
                  </div>
                </template>
              </a-progress>
            </template>
            <template slot="process2">
              <a-progress
                :stroke-color="{ '0%': iconStyleStart(item.budgetColor), '100%': iconStyle(item.budgetColor) }"
                :percent="item.budgetUse">
                <template slot="format">
                  <div style="color:rgba(0, 0, 0, 0.45)">
                    {{ item.budgetUse }}%
                  </div>
                </template>
              </a-progress>
            </template>
          </card-chart>
        </a-row>
      </div>

      <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }" class="index-row" v-has="'todoPro:list'">
        <a-col :sm="24" :md="14" style="margin-bottom: 16px">
          <a-card>
            <div slot="title" class="index-md-title">我的工作</div>
            <!-- 日历展示 -->
              <div >
                <a-calendar :header-render="headerRender" @panelChange="onPanelChange"  :disabledDate="disabledDate">
                  <div slot="dateCellRender" slot-scope="value" :class="'events2'">
                      <div style="position: absolute;top: 6px;z-index: 999;">{{ value.date() }}</div>
                      <div style="height: 53px;margin-top: -50px;">
                                <span v-for="item in passlist" :key="item.date">
                                  <div v-if="getCheckDate(value) == item.date" 
                                    :class="item.ifWork=='2'?'bg2':'bg1'">
                                  </div>
                                    <span v-if="getCheckDate(value) == item.date && item.busProjectEstimatedList">                                      
                                        
                                        <span v-for="i in item.busProjectEstimatedList.slice(0,3)" 
                                            :key="i.id" 
                                            :style="[{marginTop: -5+'px'},{display: 'block'}]">
                                                <a-tooltip>
                                                    <template slot="title">
                                                    {{ i.textall }}
                                                    </template>
                                                    <a-badge  :color="i.color" :text="i.text" />
                                                </a-tooltip>                                
                                        </span> 
                                    </span>                           
                                </span>
                      </div>
                    </div>
                </a-calendar>
              </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" style="margin-bottom: 16px">
          <a-card>
            <div slot="title" class="index-md-title">我的项目</div>
            <div slot="extra">
              <a slot="footer" @click="goMorePro">更多
                <a-icon type="right" />
              </a>
            </div>
            <a-table :class="'j-table-force-nowrap'" ref="table2" rowKey="id" :columns="columns"
              :dataSource="dataSource" :pagination="false" :scroll="{ x: true, y: 800 }">
              <template slot="projectName" slot-scope="text,record">
                <a-popover>
                  <template slot="content">
                    <span>{{ text }}</span>
                  </template>
                  <div style="maxWidth:120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><a @click="toDetail(record.projectId)">{{ text }}</a>
                  </div>
                </a-popover>
              </template>
              <template slot="status" slot-scope="text">
                <span v-if="text == '2'"> <a-badge status="processing" /> 执行中 </span>
                <span v-if="text == '3'"> <a-badge status="error" /> 锁定 </span>
              </template>
              <template slot="position" slot-scope="text,record,index">
                <span>
                  <template v-if="record.position">
                    <template v-for="(tag, i) in record.position">
                      <a-tooltip v-if="tag.length > 5" :key="tag" :title="tag">
                        <a-tag :key="tag" :closable="true" @close="() => handleClose(tag, record.position, record.id)"
                          :color="colorList[i]">
                          {{ `${tag.slice(0, 5)}...` }}
                        </a-tag>
                      </a-tooltip>
                      <a-tag v-else :key="i" :closable="true"
                        @close="() => handleClose(tag, record.position, record.id)" :color="colorList[i]">
                        {{ tag }}
                      </a-tag>
                    </template>
                  </template>
                  <a-auto-complete v-if="inputVisible[index].visible" :autoFocus="inputVisible[index].visible"
                    v-model="tagValue[index].value" :data-source="dataSourceTag" placeholder="请选择/输入"
                    @blur="onChangeAdd(record, $event, index)" />
                  <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput(index)"
                    v-show="record.position.length < 3">
                    <a-icon type="plus" />
                  </a-tag>
                </span>

              </template>

              <span slot="action" slot-scope="text,record">
                <a @click="goTimesheet" :disabled="record.status=='3' ? true : false">填写工时</a>
              </span>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
    <!-- 项目申报审核 -->

    <project-user-apply-modal ref="busApplyAuditForm" :busApplyAuditForm="busApplyAuditForm" @handlePass="handlePass" />

    <!-- 项目驳回重新提交 -->
    <project-user-reject-modal ref="busApplyRejectForm" :busApplyRejectForm="busApplyAuditForm"
      @handlePass="handlePass" />
    <!-- milepostCompleteForm -->
    <milepost-complete-modal ref="milepostCompleteForm" :busApplyAuditForm="busApplyAuditForm"
      @handlePass="handlePass" />
    <!-- milepostCompleteForm -->
    <milepost-complete-reject-modal ref="milepostCompleteRejectForm" :busApplyRejectForm="busApplyAuditForm"
      @handlePass="handlePass" />

    <!-- 工时审核 -->
    <work-hours-audit-modal ref="timeSheetApprovalForm" :busApplyAuditForm="busApplyAuditForm"
      @handlePass="handlePass" />
    <!-- 工时驳回办理 -->
    <work-hours-reject-modal ref="timeSheetRejectForm" :busApplyRejectForm="busApplyAuditForm"
      @handlePass="handlePass" />
    <!-- 项目详情 -->
    <project-details-modal ref="projectdetails"></project-details-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { USER_AUTH } from '@/store/mutation-types'
import { postAction, getAction, putAction,myPostAction } from '@/api/manage'
import { ajaxGetDictItems } from '@/api/api'
import CardChart from './components/CardChart.vue'
import ProjectUserApplyModal from '@/views/bus/modules/ProjectUserApply/ProjectUserApplyModal'
import ProjectUserRejectModal from '@/views/bus/modules/ProjectUserApply/ProjectUserRejectModal'
import MilepostCompleteModal from '@/views/bus/modules/MilepostComplete/MilepostCompleteModal'
import MilepostCompleteRejectModal from '@/views/bus/modules/MilepostComplete/MilepostCompleteRejectModal'
import WorkHoursAuditModal from '@/views/bus/modules/WorkHoursApproval/WorkHoursAuditModal'
import WorkHoursRejectModal from '@/views/bus/modules/WorkHoursApproval/WorkHoursRejectModal'
import ProjectDetailsModal from '@/views/bus/modules/ProjectDetailsModal'


export default {
  name: 'IndexTask',
  components: {
    CardChart,
    ProjectUserApplyModal,
    ProjectUserRejectModal,
    MilepostCompleteModal,
    MilepostCompleteRejectModal,
    WorkHoursAuditModal,
    WorkHoursRejectModal,
    ProjectDetailsModal
  },
  data() {
    return {
      roleType: true, //角色判断
      loading: false,
      isAll: false,
      myWorkList: [],
      projectList: [],
      taskList: [],
      busApplyAuditForm: {},
      dataSource: [
        // {
        //   name: '中电金信',
        //   status: '执行中',
        //   dup: '需求分析师',
        //   createTime: '2022-10-01',
        //   endTime: '2022-10-01',
        //   timeLine: '开发中',
        // },
      ],
      columns: [
        {
          key: 'projectName',
          title: '项目名',
          align: 'left',
          dataIndex: 'projectName',
          width: 150,
          scopedSlots: { customRender: 'projectName' },
          fixed: 'left'
        },
        {
          key: 'status',
          title: '状态',
          align: 'left',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          key: 'milePost',
          title: '里程碑',
          align: 'left',
          dataIndex: 'milePost',
          width: 150
        },
        {
          key: 'position',
          title: '阶段角色',
          align: 'left',
          dataIndex: 'position',
          scopedSlots: { customRender: 'position' },
          width: 300
        },
        {
          key: 'start',
          title: '开始时间',
          align: 'left',
          dataIndex: 'start',
          width: 120
        },
        {
          key: 'end',
          title: '结束时间',
          align: 'left',
          dataIndex: 'end',
          width: 120
        },
        {
          key: 'action',
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        noticeInfo: '/bus/busProject/getHomeMyNoticeInfo', //我的提醒
        projectInfo: '/bus/busProject/getHomePageProjectInfo', //项目列表
        workInfo: '/bus/busProject/getHomeMyWorkInfo', //我的工作
        taskInfo: '/bus/home/getNewTaskList', //待办列表
        tagEdit: '/bus/busProjectEstimate/edit',//表格标签编辑
        holidayJudgment:'bus/busProjectEstimate/holidayJudgment'
      },
      dataSourceTag: [],
      tagValue: [],
      inputVisible: [],
      colorList: ['blue', 'pink', 'cyan'],
      weekStart:'',
      weekEnd:'',
      passlist:[],
      holidayList:[]
    }
  },
  computed: {
    showWidth() {
      if (this.projectList.length == 1 || this.projectList.length == 2) {
        return 12
      } else if (this.projectList.length == 3) {
        return 8
      } else {
        return 6
      }
    },
    getProjectList() {
      if (this.projectList.length <= 4) {
        return this.projectList
      } else {
        if (this.isAll) {
          return this.projectList
        } else {
          return this.projectList.slice(0, 4)
        }
      }
    },
    statusClass() {
      return itemProstatus => {
        if (itemProstatus == '1') {
          return 'chart-tip-normal'
        }
        if (itemProstatus == '3') {
          return 'chart-tip-danger'
        }
        if (itemProstatus == '2') {
          return 'chart-tip-warning'
        }
      }
    },
    iconType() {
      return itemProstatus => {
        if (itemProstatus == '1') {
          return 'check-circle'
        }
        if (itemProstatus == '3') {
          return 'exclamation-circle'
        }
        if (itemProstatus == '2') {
          return 'warning'
        }
      }
    },
    iconStyleStart() {
      return itemProstatus => {
        if (itemProstatus == '1') {
          return '#e3f5db'
        }
        if (itemProstatus == '3') {
          return '#fddbdd'
        }
        if (itemProstatus == '2') {
          return '#fff4e0'
        }
      }
    },
    iconStyle() {
      return itemProstatus => {
        if (itemProstatus == '1') {
          return '#52c41b'
        }
        if (itemProstatus == '3') {
          return '#f5222d'
        }
        if (itemProstatus == '2') {
          return '#fbad14'
        }
      }
    },
  },
  created() {
    this.getProjectInfo()
    this.getWorkInfo()
    this.getNoticeInfo()
    this.getTaskInfo()
    this.getTagsDict()
  },
  mounted() {
    let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
    // console.log('authList', authList)
    for (let auth of authList) {
      if (auth.action == 'show:allPro') {
        //全部展示
        this.isAll = true;
      }
    }
    let month = new Date().getMonth()+1 < 10 ? '0'+(new Date().getMonth()+1) : (new Date().getMonth()+1)
    let a = new Date().getFullYear() + '-' + month
    this.getUserWorkHoursStatus(a)
    this.handleHolidayJudgment(a)
  },
  methods: {
    handleHolidayJudgment(date){
      let url = this.url.holidayJudgment + '?date=' + date
      getAction(url).then(res=>{
        //  console.log(res.result,'节假日-----------------')
         if(res.success){
           this.holidayList = res.result
         }else{
           this.$message(res.message)
         }
      })
    },
    getUserWorkHoursStatus(date){            
        let url = 'bus/busProjectEstimate/getPersonWorkHoursDetailed?date='+date
        getAction(url).then(res=>{
          if(res.success){
            for (let index = 0; index < res.result.length; index++) {
                const element = res.result[index];
                element.dateNum = element.date.split('-')[2]
                if(element.busProjectEstimatedList){
                  for (let j = 0; j < element.busProjectEstimatedList.length; j++) {
                    const item = element.busProjectEstimatedList[j];
                    const h = item.planHours?parseFloat(item.planHours):0
                    const te = item.projectName.length >4 ? item.projectName.slice(0, 4) +'...' : item.projectName
                    item.text = ' ' + '('+h +'h)' + te 
                    item.textall = '('+h +'h)' + ' ' + item.projectName 
                    item.color = '#f' +item.projectId.slice(12, 14) +'c'+item.projectId.slice(15, 17);
                    // console.log(item.color,item.projectId.slice(11, 14),item.projectId.slice(14, 17),item.projectId)
                  }
                }
                
            }
            this.passlist = res.result
            // console.log(this.passlist,'this.passlist---节假日是否--')
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    getCheckDate(value){
        let month = value.month()+1 < 10 ? '0'+(value.month()+1) : (value.month()+1)
        let a = value.year() + '-' + month
        let y = a + '-' + ( value.date() < 10 ? '0' + value.date() : value.date() )
        return y
    },
    onPanelChange(value, mode) {
      // eslint-disable-next-line no-console
      // console.log(value, mode);
    },
    disabledDate(current) {
        if((current.month()+1) != (this.choiceMonth)){
            return true
        }else {
            return false
        }
    },
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
      return (
        <div style={{ padding: '10px' }}>
          <a-row type="flex">
            <a-col>
              <a-select
                size="small"
                dropdownMatchSelectWidth={false}
                class="my-year-select"
                onChange={newYear => {
                  const now = value.clone().year(newYear);
                  let month = now.month()+1 < 10 ? '0'+(now.month()+1) : (now.month()+1)
                  let date = now.year() + '-' + month
                  this.getUserWorkHoursStatus(date)
                  this.handleHolidayJudgment(date)
                  onChange(now);
                }}
                value={String(year)}
              >
                {options}
              </a-select>
            </a-col>
            <a-col>
              <a-select
                size="small" style='margin-left:20px;'
                dropdownMatchSelectWidth={false}
                value={String(month)}
                onChange={selectedMonth => {
                  const newValue = value.clone();
                  newValue.month(parseInt(selectedMonth, 10));
                  let month = newValue.month()+1 < 10 ? '0'+(newValue.month()+1) : (newValue.month()+1)
                  let date = newValue.year() + '-' + month
                  this.getUserWorkHoursStatus(date)
                  this.handleHolidayJudgment(date)
                  onChange(newValue);
                }}
              >
                {monthOptions}
              </a-select>
            </a-col>
          </a-row>
        </div>
      );
    },
    //根据字典Code, 初始化字典数组
    getTagsDict() {
      ajaxGetDictItems('stage_role', null).then((res) => {
        if (res.success) {
          // console.log(res.result);
          this.dataSourceTag = res.result;
        }
      })
    },
    handleClose(removedTag, position, id) {
      let tags = position.filter(tag => tag !== removedTag);
      if (tags.length == 0) {
        tags = ''
      } else {
        tags = tags.join(',')
      }
      console.log('clear', removedTag, position, tags);
      putAction(this.url.tagEdit, { id: id, userTitle: tags }).then((res) => {
        if (res.success) {
          this.getNoticeInfo();
          this.$message.success('修改成功')
        } else {
          this.$message.warning('修改失败')
        }
      });
      // this.tags = tags;
    },

    showInput(i) {
      this.inputVisible[i].visible = true;
    },

    onChange(record, e) {
      console.log('onChange', record, e);
    },
    onChangeAdd(record, e, i) {
      console.log('blur', record, e);
      if (e) {
        let isExsit = record.position.find((ele) => ele === e)
        if (isExsit) {
          this.$message.warning('标签已存在请重新选择')
        } else {
          let addTags = ''
          if (record.position.length == 0) {
            addTags = e
          } else {
            addTags = record.position.join(',') + ',' + e
          }
          console.log('addTags', addTags);
          this.inputVisible[i].visible = false;
          putAction(this.url.tagEdit, { id: record.id, userTitle: addTags }).then((res) => {
            if (res.success) {
              this.getNoticeInfo();
              this.$message.success('修改成功')
            } else {
              this.$message.warning('修改失败')
            }
          });
        }
      } else {
        this.inputVisible[i].visible = false;
      }
    },
    // 项目列表
    getProjectInfo() {
      getAction(this.url.projectInfo).then((res) => {
        if (res.success && res.result.length > 0) {
          // console.log(222, res.result)
          this.projectList = res.result
        } else {
          this.projectList = []
        }
      })
    },
    //更新项目内容
    updateInfo(index, res) {
      // console.log('www', index, res)
      this.projectList[index].budget = res.budget
      this.projectList[index].timeSheet = res.timeSheet
      this.projectList[index].budgetUse = res.budgetUse
      this.projectList[index].timeSheetUse = res.timeSheetUse
      this.projectList[index].projectStatus = res.projectStatus
      this.projectList[index].start = res.start
      this.projectList[index].end = res.end
      this.projectList[index].colorInfo = res.colorInfo
      this.projectList[index].budgetColor = res.budgetColor
      this.projectList[index].timeColor = res.timeColor
      // this.$set(this.projectList,index,res)
    },
    //跳转到项目详情
    toDetail(id) {
      this.$refs.projectdetails.edit({projectId: id})
      this.$refs.projectdetails.title = '项目详情'
      this.$refs.projectdetails.disableSubmit = false
    },
    // 工作安排
    getWorkInfo() {
      getAction(this.url.workInfo,{startDate:this.weekStart,endDate:this.weekEnd}).then((res) => {
        if (res.success && res.result.length > 0) {
          // console.log(222,res.result)
          this.myWorkList = res.result
        } else {
          this.myWorkList = []
        }
      })
    },
    //按周查询工作安排
    weekChange(date, dateString) {
      if(date){
        this.weekStart = moment(date).day(1).format('YYYY-MM-DD'); // 周一日期
        this.weekEnd = moment(date).day(7).format('YYYY-MM-DD'); // 周日日期
        // console.log(666,this.weekStart, this.weekEnd);
        this.getWorkInfo()
      }else{
        this.weekStart =''
        this.weekEnd =''
        this.getWorkInfo()
      }
    },
    // 我的提醒
    getNoticeInfo() {
      getAction(this.url.noticeInfo).then((res) => {
        if (res.success && res.result.length > 0) {
          this.dataSource = res.result
          let copyTagValue = []
          let copyInputVisible = []
          for (let i = 0; i < this.dataSource.length; i++) {
            copyTagValue.push({ value: '' })
            copyInputVisible.push({ visible: false })
          }
          this.tagValue=copyTagValue
          this.inputVisible=copyInputVisible
        } else {
          this.dataSource = []
        }
      })
    },
    // 待办列表
    getTaskInfo() {
      postAction(this.url.taskInfo).then((res) => {
        if (res.success && res.result.length > 0) {
          this.taskList = res.result
        } else {
          this.taskList = []
        }
      })
    },
    // 更多待办列表
    goMoreTodo() {
      this.$router.push({ path: '/bus/BusApplyDoApprList' })
    },
    // 更多我的项目
    goMorePro() {
      this.$router.push({ path: '/bus/BusProjectList' })
    },
    // 填写工时
    goTimesheet() {
      this.$router.push({ path: '/bus/BusWorkingHours' })
    },
    handleTodo(record) {
      this.busApplyAuditForm = record
      if (record.formUrl == 'addPersonApply:check') {
        this.$refs['busApplyAuditForm'].visible = true
        this.$refs['busApplyAuditForm'].title = '审核'
      } else if (record.formUrl == 'addPersonApply:resubmit') {
        this.$refs['busApplyRejectForm'].visible = true
        this.$refs['busApplyRejectForm'].title = '办理'
      } else if (record.formUrl == 'milepostComplete:check') {
        this.$refs['milepostCompleteForm'].visible = true
        this.$refs['milepostCompleteForm'].title = '审核'
      } else if (record.formUrl == 'milepostComplete:resubmit') {
        this.$refs['milepostCompleteRejectForm'].visible = true
        this.$refs['milepostCompleteRejectForm'].title = '办理'
      } else if (record.formUrl == 'timesheetApproval:check') {
        this.$refs['timeSheetApprovalForm'].visible = true
        this.$refs['timeSheetApprovalForm'].title = '审核'
      } else if (record.formUrl == 'timesheetApproval:resubmit') {
        this.$refs['timeSheetRejectForm'].visible = true
        this.$refs['timeSheetRejectForm'].title = '办理'
      }
    },
    handlePass() {
      this.getTaskInfo()
    },
    // 更多跳转
    goPage(key) {
      // if(key == '1'){
      //   this.$router.push({ path: '/bus/BusPolicyList' })
      // }
    },
    getAllPro() {
      this.isAll = !this.isAll
    },
  },
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1441px) {
  .index-container-ty {
    padding: 0 12px 12px 12px;
    height: 100%;
  }

  .index-container-ty .index-title {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: rgba(2, 10, 26, 0.85);
    font-weight: bold;
    margin-top: -10px;
    margin-bottom: 4px;
    min-height: 15px;
    // align-items: flex-end;
  }

  .index-container-ty .index-title span {
    font-size: 12px;
    color: rgba(2, 10, 26, 0.65);
    cursor: pointer;
  }

  .index-row /deep/ .ant-card-bordered {
    min-height: 815px;
  }

  .index-container-ty .pad-top {
    padding-top: 12px;
  }

  .index-container-ty /deep/ .ant-card-bordered {
    border-radius: 4px;
    border: none;
  }

  .index-row /deep/ .ant-card-head {
    padding: 0;
    margin: 0 24px;
    color: rgba(2, 10, 26, 0.85);
  }

  .index-row /deep/ .ant-card-body {
    padding: 15px 24px;
  }

  .index-container-ty .cardbox-title {
    margin-bottom: 24px;
    color: rgba(2, 10, 26, 0.65);
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .index-container-ty .cardbox-title img {
    margin-right: 8px;
  }

  .index-container-ty .cardbox-title-todo {
    justify-content: space-between;
  }

  .index-container-ty .cardbox-title-todo div {
    display: flex;
    align-items: center;
  }

  .index-container-ty .cardbox-title-todo span {
    font-size: 12px;
  }

  .index-container-ty .cardbox-content {
    display: flex;
    justify-content: space-between;
    padding-left: 22px;
    flex-wrap: wrap;
  }

  .index-container-ty .cardbox-noData {
    text-align: center;
    padding: 40px 0 40px 22px;
  }

  .index-container-ty .cardbox-con-item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 48.5%;
  }

  .index-container-ty .cardbox-con-item:hover {
    cursor: pointer;

    &>.cardbox-item-title span:first-child {
      color: #1990ff;
    }
  }

  .index-container-ty .cardbox-item-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 500;
    color: rgba(2, 10, 26, 0.85);
  }

  .index-container-ty .cardbox-item-title span:nth-child(2) {
    font-weight: 400;
    font-size: 12px;
    color: rgba(2, 10, 26, 0.45);
  }

  .index-container-ty .cardbox-item-list {
    background: rgba(2, 10, 26, 0.04);
    border-radius: 4px 4px 0px 0px;
    padding: 16px 16px 0;
    width: 100%;
    margin-bottom: 16px;
  }

  .index-container-ty .list-plan .list-plan-hei{
    height: 115px;
  }

  .list-plan>div:first-child {
    border-bottom: 1px solid rgba(2, 10, 26, 0.1);
    margin-bottom: 16px;
  }

  .index-container-ty .item-list-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    color: rgba(2, 10, 26, 0.85);
    margin-bottom: 16px;
  }

  .index-container-ty .cardbox-item-todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    color: rgba(2, 10, 26, 0.4);
    margin-bottom: 16px;
  }

  .index-container-ty .todo-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .index-container-ty .todo-left span:first-child {
    color: rgba(2, 10, 26, 0.8);
    margin-bottom: 16px;
  }

  .index-container-ty .item-list-detail span:first-child {
    color: rgba(2, 10, 26, 0.45);
  }

  .index-container-ty .deep-detail span {
    color: rgba(2, 10, 26, 0.85) !important;
  }

  .index-container-ty .ant-card-extra a {
    color: rgba(2, 10, 26, 0.65);
    font-size: 12px;
    height: 32px;
    display: block;
    line-height: 32px;
  }

  /deep/ .ant-btn-background-ghost.ant-btn-primary {
    color: #1990ff;
    border-color: #1990ff;
  }

  /deep/ .ant-btn-background-ghost.ant-btn-primary:hover {
    background-color: #1990ff !important;
    color: #fff;
  }

  // 插槽
  .index-container-ty .chart-tip-normal {
    background: rgba(82, 196, 27, 0.1);
    border: rgba(82, 196, 27, 0.1);
    height: 32px;
    border-radius: 2px;
    line-height: 20px;
    padding: 6px;
  }

  .index-container-ty .chart-tip-normal span {
    margin-left: 6px;
    color: #54c21b;
  }

  .index-container-ty .chart-tip-danger {
    background: rgba(245, 34, 45, 0.1);
    border: rgba(245, 34, 45, 0.1);
    height: 32px;
    border-radius: 2px;
    line-height: 20px;
    padding: 6px;
  }

  .index-container-ty .chart-tip-danger span {
    margin-left: 6px;
    color: #f5222d;
  }

  .index-container-ty .chart-tip-warning {
    background: rgba(251, 173, 20, 0.1);
    border: rgba(251, 173, 20, 0.1);
    height: 32px;
    border-radius: 2px;
    line-height: 20px;
    padding: 6px;
  }

  .index-container-ty .chart-tip-warning span {
    margin-left: 6px;
    color: #fbad14;
  }
}

@media screen and (max-width: 1440px) {
  .index-container-ty {
    padding: 6px 6px 0;
    height: 100%;
  }

  .index-container-ty .index-title {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    color: rgba(2, 10, 26, 0.85);
    font-weight: bold;
    margin-top: -17px;
    margin-bottom: 3px;
    min-height: 15px;
  }

  .index-container-ty .index-title span {
    font-size: 12px;
    color: rgba(2, 10, 26, 0.65);
    cursor: pointer;
  }

  .index-row /deep/ .ant-card-bordered {
    min-height: 815px;
  }

  .index-container-ty .pad-top {
    padding-top: 12px;
  }

  .index-row /deep/ .ant-card-head-title {
    padding: 12px 0;
  }

  .index-container-ty /deep/ .ant-card-bordered {
    border-radius: 4px;
    border: none;
  }

  .index-row /deep/ .ant-card-head {
    padding: 0;
    margin: 0 18px;
    color: rgba(2, 10, 26, 0.85);
    min-height: unset;
    font-size: 14px;
  }

  .index-row /deep/ .ant-card-body {
    padding: 15px 18px;
  }

  .index-container-ty .cardbox-title {
    margin-bottom: 18px;
    color: rgba(2, 10, 26, 0.65);
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .index-container-ty .cardbox-title img {
    margin-right: 5px;
  }

  .index-container-ty .cardbox-title-todo {
    justify-content: space-between;
  }

  .index-container-ty .cardbox-title-todo div {
    display: flex;
    align-items: center;
  }

  .index-container-ty .cardbox-title-todo span {
    font-size: 12px;
  }

  .index-container-ty .list-plan .list-plan-hei{
    height: 115px;
  }

  .index-container-ty .cardbox-content {
    display: flex;
    justify-content: space-between;
    padding-left: 18px;
    flex-wrap: wrap;
  }

  .index-container-ty .cardbox-noData {
    text-align: center;
    padding: 40px 0 40px 22px;
  }

  .index-container-ty .cardbox-con-item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 48.5%;
  }

  .index-container-ty .cardbox-con-item:hover {
    cursor: pointer;

    &>.cardbox-item-title span:first-child {
      color: #1990ff;
    }
  }

  .index-container-ty .cardbox-item-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 500;
    color: rgba(2, 10, 26, 0.85);
  }

  .index-container-ty .cardbox-item-title span:nth-child(2) {
    font-weight: 400;
    font-size: 12px;
    color: rgba(2, 10, 26, 0.45);
  }

  .index-container-ty .cardbox-item-list {
    background: rgba(2, 10, 26, 0.04);
    border-radius: 4px 4px 0px 0px;
    padding: 12px 12px 0;
    width: 100%;
    margin-bottom: 12px;
    font-size: 13px;
  }

  .list-plan>div:first-child {
    border-bottom: 1px solid rgba(2, 10, 26, 0.1);
    margin-bottom: 16px;
  }

  .index-container-ty .item-list-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    color: rgba(2, 10, 26, 0.85);
    margin-bottom: 12px;
  }

  .index-container-ty .cardbox-item-todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    color: rgba(2, 10, 26, 0.4);
    margin-bottom: 16px;
  }

  .index-container-ty .todo-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .index-container-ty .todo-left span:first-child {
    color: rgba(2, 10, 26, 0.8);
    margin-bottom: 16px;
  }

  .index-container-ty .item-list-detail span:first-child {
    color: rgba(2, 10, 26, 0.45);
  }

  .index-container-ty .deep-detail span {
    color: rgba(2, 10, 26, 0.85) !important;
  }

  .index-container-ty /deep/ .ant-card-extra {
    // padding: 9px 0;
    font-size: 12px;
  }

  .index-container-ty /deep/ .ant-input {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }

  .index-container-ty .ant-card-extra a {
    color: rgba(2, 10, 26, 0.65);
    font-size: 12px;
    height: 24px;
    display: block;
    line-height: 24px;
  }

  /deep/ .ant-btn-background-ghost.ant-btn-primary {
    color: #1990ff;
    border-color: #1990ff;
  }

  /deep/ .ant-btn-background-ghost.ant-btn-primary:hover {
    background-color: #1990ff !important;
    color: #fff;
  }

  .todo-pass /deep/ .ant-btn {
    height: 24px;
    line-height: 22px;
    padding: 0 14px;
    font-size: 13px;
  }

  /deep/ .ant-table {
    font-size: 13px;
  }

  /deep/ .ant-table-thead>tr>th {
    padding: 12px 12px;
  }

  /deep/ .ant-table-tbody>tr>td {
    padding: 12px 12px;
  }

  // 插槽
  .index-container-ty /deep/ .ant-progress {
    font-size: 12px;
  }

  // .index-container-ty /deep/ .ant-progress-text{
  //   color: #54c21b;
  // }

  .index-container-ty .chart-tip-normal {
    background: rgba(82, 196, 27, 0.1);
    border: rgba(82, 196, 27, 0.1);
    height: 32px;
    border-radius: 2px;
    line-height: 20px;
    padding: 6px;
  }

  .index-container-ty .chart-tip-normal span {
    margin-left: 6px;
    color: #54c21b;
  }

  .index-container-ty .chart-tip-danger {
    background: rgba(245, 34, 45, 0.1);
    border: rgba(245, 34, 45, 0.1);
    height: 32px;
    border-radius: 2px;
    line-height: 20px;
    padding: 6px;
  }

  .index-container-ty .chart-tip-danger span {
    margin-left: 6px;
    color: #f5222d;
  }

  .index-container-ty .chart-tip-warning {
    background: rgba(251, 173, 20, 0.1);
    border: rgba(251, 173, 20, 0.1);
    height: 32px;
    border-radius: 2px;
    line-height: 20px;
    padding: 6px;
  }

  .index-container-ty .chart-tip-warning span {
    margin-left: 6px;
    color: #fbad14;
  }
}
.events {
list-style: none;
margin: 0;
padding: 82px 5px 0 5px;
position: absolute;
top: 1px;
left: -1px;
background-color: #eeeeee;
width: 103%;
height: 98%;

}
.bg2{
  position: absolute;
    background-color: #eeeeee;
    width: 101%;
    height: 100px;
    top: -1px;
    left: -1px;
}
.bg1{
  position: absolute;
    background-color: #fff;
    width: 104%;
    height: 100px;
    top: -1px;
    left: -3px;
}
.events2 {
list-style: none;
margin: 0;
padding: 82px 5px 0 5px;
position: absolute;
top: 1px;
left: -1px;
background-color: #ffffff;
width: 103%;
height: 98%;
}
.events .ant-badge-status {
overflow: hidden;
white-space: nowrap;
width: 100%;
text-overflow: ellipsis;
font-size: 12px;
}
::v-deep .ant-badge-status-text{
    margin-left: 0px;
    font-size: 10px;
}
::v-deep .ant-badge-status-dot{
    width: 8px;
    height: 8px;
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
    border: 2px solid #e8e8e8;
    height: 40px;
}
::v-deep .ant-fullcalendar-fullscreen .ant-fullcalendar-date {
    display: block;
    height: 100px;
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
</style>