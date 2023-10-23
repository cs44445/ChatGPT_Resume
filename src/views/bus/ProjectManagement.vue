<template>
  <div>
    <!-- <a-alert message="项目正常运作中" type="success" show-icon /> -->
    <div :class="statusClass(pageOthers.colorInfo)">
      <a-icon :type="iconType(pageOthers.colorInfo)" theme="filled" :style="{ color: iconStyle(pageOthers.colorInfo) }" />
      <span>{{ pageOthers.projectStatus }}</span>
    </div>
    <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
      <a-col :sm="24" :md="18" class="flex-bot">
        <a-card :bordered="false" class="card-one">
          <div slot="title" class="headtit">
            <a-icon type="database" theme="filled" style="color:#1990ff;margin-right: 8px;" />
            {{pageOthers.peojectName}}
          </div>
          <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
            <a-col :span="8" class="ipt">
              <p class="card-one-title">
                <a-icon type="home" style="margin-right:10px" />所属部门
              </p>
              <a-input disabled :value="pageOthers.depName" class="ipt" />
            </a-col>
            <a-col :span="8" class="ipt">
              <p class="card-one-title">
                <a-icon type="user" style="margin-right:10px" />负责人
              </p>
              <a-input disabled :value="pageOthers.owner" class="ipt" />
            </a-col>
            <a-col :span="8" class="ipt">
              <p class="card-one-title">
                <a-icon type="carry-out" style="margin-right:10px" />项目时长
              </p>
              <a-input disabled :value="pageOthers.startTime+' 至 '+pageOthers.endTime" class="ipt" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="6" class="flex-bot">
        <a-card :bordered="false" class="card-two">
          <div slot="title" class="headtit">
            <a-icon type="notification" theme="filled" style="margin-right:10px;color:#1990ff" />公告
            <a-button v-has="'notice:submit'" type="primary" style="background:#1990ff;border:#1990ff;position: absolute;right: 25px;top: 20px;" @click="handleAdd()">发布</a-button>
          </div>
          <a-card-meta :title="pagenotice.title" :description="pagenotice.createTime" @click="handleNotice(pagenotice)"></a-card-meta>
          <p class="headtit-p" v-html="pagenotice.noticeContent"></p>
          <div style="width:100%;background: #fff;padding: 10px;position: absolute;bottom: 0;left: 0;z-index: 99;">
            <a-button class="bthhover" @click="handleHistorical()">历史公告</a-button>
          </div> 
        </a-card>
      </a-col>
      <a-col :sm="24" :md="18" class="flex-bot card-list">
        <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
          <a-col :sm="24" :md="24" class="flex-bot" v-has="'project:work:distribution'">
            <a-card :bordered="false" style="height:400px">
              <a-tabs default-active-key="1">
                <a-tab-pane key="1" tab="项目工时分布" forceRender>
                  <gantt-chart :projectId="projectId"/>
                </a-tab-pane>
                <a-tab-pane key="2" tab="利润金额&利润率" forceRender>
                  <draw-chart :projectId="projectId" ref="moneychart" />
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </a-col>
          <a-col :sm="24" :md="12" class="flex-bot" v-has="'budget:card'">
            <a-card :bordered="false" style="height:400px">
              <div slot="title" class="tit">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span>预算</span>
                  <a-icon type="arrows-alt" style="color:#1990ff;" @click="handlebudget()" />
                </div>
              </div>
              <a-row>
                <a-col :span="12" class="card-list-subtitle"><span>项目总预算(元): </span><span>{{pageOthers.totalBudget|moneyFormat}}</span> </a-col>
                <a-col :span="12" class="card-list-subtitle"><span>已使用预算(元): </span><span>{{pageOthers.usedBudget|moneyFormat}}</span></a-col>
              </a-row>
              <a-table size="small" ref="table" :scroll="{y:210}" rowKey="id" :columns="columns1" :dataSource="pagebuglist" :pagination="false" class="j-table-force-nowrap">
                <span slot="money" slot-scope="text">
                    <span>{{text|moneyFormat}}</span>
                  </span>
              </a-table>
            </a-card>
          </a-col>
          <a-col :sm="24" :md="12" class="flex-bot" v-has="'team:card'">
            <a-card :bordered="false" title="团队人员" style="height:400px">
              <a-table size="small" ref="table" :scroll="{ x: true,y:250 }" rowKey="id" :columns="columns6" :dataSource="dataSource1" :pagination="false" class="j-table-force-nowrap">
                <template slot="name" slot-scope="text, record">
                 <a style="color:#1990ff" @click="handlePersonnel(record)">{{text}}</a>
               </template>
                <template slot="stageRole" slot-scope="text,record">
                <span>
                  <template v-if="record.stageRole.length > 0">
                    <template v-for="(tag,i) in record.stageRole">
                      <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag" :color="colorList[i]">
                        <a-tag :key="i">
                          {{ `${tag.slice(0, 10)}...` }}
                        </a-tag>
                      </a-tooltip>
                      <a-tag v-else :key="i" :color="colorList[i]">
                        {{ tag }}
                      </a-tag>
                    </template>
                  </template>
                  <template v-else>
                    <span>暂无</span>
                  </template>
                  </span>
                </template>
              </a-table>
            </a-card>
          </a-col>
          <a-col :sm="24" :md="12" class="flex-bot">
            <a-card :bordered="false" title="工时" style="height:400px" class="timeCss">
              <div class="extra-wrapper" slot="extra">
                <!-- <a-week-picker placeholder="请选择周">
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-week-picker> -->
                <a-range-picker @change="onChange" v-model="workDate"/>
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
          </a-col>
          <a-col :sm="24" :md="12" class="flex-bot">
            <a-card :bordered="false" title="项目动态" style="height:400px">
              <a-table size="small" ref="table" :scroll="{ x: true,y:250 }" rowKey="id" :columns="columns4" :dataSource="dataSource4" :pagination="false" class="j-table-force-nowrap">
                 <template slot="content" slot-scope="text,record">
                  <a-popover>
                    <template slot="content">
                      <span>{{text}}</span>
                    </template>
                    <div style="maxWidth:200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{text}}</div>
                  </a-popover>
                </template>
              </a-table>
            </a-card>
          </a-col>
          <a-col :sm="24" :md="12" class="flex-bot">
            <a-card :bordered="false" style="height:400px">
              <div slot="title" class="tit">
                <!-- <a-icon type="right" /> -->
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span>项目文档</span>
                  <a-icon type="arrows-alt" style="color:#1990ff;" @click="handleProject" />
                </div>
              </div>
              <a-table size="small" ref="table" :scroll="{ x: true, y:250 }" rowKey="id" :columns="columns5" :dataSource="dataSource5" :pagination="false" class="j-table-force-nowrap">
                <template slot="filePath" slot-scope="text,record">
                  <a-popover>
                    <template slot="content">
                      <span>{{text}}</span>
                    </template>
                    <div style="maxWidth:120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      <a @click="downloadFile(record.filePath)" style="color:#1990ff">{{ text }}</a>
                    </div>
                  </a-popover>
                </template>
              </a-table>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <a-col :sm="24" :md="6" class="flex-bot time-line">
        <a-card :bordered="false" title="里程碑">
          <div class="extra-wrapper" slot="extra">
            <a-button v-has="'milestone:submit'" type="primary" style="background:#1990ff;border:#1990ff" @click="Addmilestone()">提交</a-button>
          </div>
          <a-steps progress-dot :current="currents" direction="vertical">
            <a-step :key="index" v-for="(item, index) in pagelandmark" @click="landmark(item)" style="cursor: pointer;">
              <p slot="title">
                <span>{{item.milepostCode}}</span>
                <span style="margin-left:10px;">
                  <a-tooltip v-if="item.status==2">
                    <template slot="title">
                      审批中
                    </template>
                    <a-icon type="clock-circle" theme="twoTone" two-tone-color="orange"/>
                  </a-tooltip>
                  <a-tooltip v-if="item.status==3">
                    <template slot="title">
                      被驳回
                    </template>
                    <a-icon type="exclamation-circle" theme="twoTone" two-tone-color="red"/>
                  </a-tooltip>
                  <a-tooltip v-if="item.status==4">
                    <template slot="title">
                      已通过
                    </template>
                    <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
                  </a-tooltip>
                </span>     
              </p>
              <span slot="description">
                <p style="white-space: nowrap;">{{item.beginTime}} ~ {{item.endTime}}</p>
                <p style="position: absolute;top: 0;right: 0;">{{item.owner}}</p>
              </span>
            </a-step>
          </a-steps>
        </a-card>
      </a-col>
    </a-row>
    <!-- 发布公告 -->
    <bus-publish-modal ref="modalForm" @ok="noticeModalFormOk"></bus-publish-modal>
    <!-- 公告 -->
    <proc-lamation-modal ref="noticeForm"></proc-lamation-modal>
    <!-- 历史公告 -->
    <announ-cement-modal ref="historical" @ok="noticeModalFormOk"></announ-cement-modal>
    <!-- 添加里程碑 -->
    <milestone-modal ref="milestone" ></milestone-modal>
    <!-- @ok="modalFormOk2" -->
    <!-- 预算 -->
    <budget-modal ref="budget" @budgetlist="budgetlist"></budget-modal>
    <!-- 项目文档 -->
    <project-documents-modal ref="projectDoc" @uploadDocList="uploadDocList"></project-documents-modal>
    <!-- 利润 -->
    <gain-yield-modal ref="earnings"></gain-yield-modal>
    <!-- 里程碑详情 -->
    <landmark-model ref="bosom"></landmark-model>
    <!-- 用户 -->
    <organization ref="organization"></organization>
    <!-- 工时明细 -->
    <show-time-detail ref="timeDetail"></show-time-detail>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import BusPublishModal from './modules/BusPublishModal'
import ProcLamationModal from './modules/ProcLamationModal.vue'
import AnnounCementModal from './modules/AnnounCementModal.vue'
import MilestoneModal from './modules/MilestoneModal.vue'
import BudgetModal from './modules/BudgetModal.vue'
import ProjectDocumentsModal from './modules/ProjectDocumentsModal.vue'
import GainYieldModal from './modules/GainYieldModal.vue'
import LandmarkModel from './modules/LandmarkModel.vue'
import Organization from '@/views/user/Organization'
import { getAction,getFileAccessHttpUrl } from '@/api/manage'
import GanttChart from './modules/GanttChart'
import DrawChart from './modules/DrawChart'
import ShowTimeDetail from './modules/ShowTimeDetail'
import moment from 'moment'
export default {
  name: 'ProjectManagement',
  mixins: [ mixinDevice],
  props: ['projectId'],
  components: {
    BusPublishModal,
    ProcLamationModal,
    AnnounCementModal,
    MilestoneModal,
    BudgetModal,
    ProjectDocumentsModal,
    GainYieldModal,
    LandmarkModel,
    GanttChart,
    DrawChart,
    Organization,
    ShowTimeDetail
  },
  data() {
    return {
      dataSource:[],
      dataSource1:[],
      dataSource4:[],
      dataSource5:[],
      // 表头
      columns1: [
        {
          title:'预算流向',
          align:"left",
          dataIndex: 'purchaseType'
        },
        {
          title:'流向说明',
          align:"left",
          dataIndex: 'budgetExplain'
        },
        {
          title:'里程碑',
          align:"left",
          dataIndex: 'milepostName'
        },
        {
          title:'金额(元)',
          align:"left",
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' }
        },
        {
          title:'开始时间',
          align:"left",
          dataIndex: 'beginTime'
        }
      ],
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
      columns4: [
        {
          title:'事件',
          align:"left",
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
          width:220,
        },
        {
          title:'发生时间',
          align:"left",
          dataIndex: 'createTime',
          width:150,
        },
        {
          title:'操作人',
          align:"left",
          dataIndex: 'createBy',
          // width:150,
        }
      ],
      columns5: [
        {
          title:'文档名称',
          align:"left",
          dataIndex: 'filePath',
          // fixed: "left",
          width:150,
          // customCell:() => {
          //   return {
          //     style: {
          //       wordWrap:'break-word',
          //       wordBreak:'break-all',
          //       whiteSpace:'normal',
          //       width:100,
          //       minHeight:'50px',
          //     }
          //   }
          // },
          scopedSlots: { customRender: 'filePath' }
        },
        {
          title: '上传人',
          align: "left",
          dataIndex: 'createBy',
          width:150
        },
        {
          title:'上传时间',
          align:"left",
          dataIndex: 'createTime',
          width:200
        },
      ],
      columns6: [
        {
          title:'姓名',
          align:"left",
          width:100,
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title:'里程碑',
          align:"left",
          width:100,
          dataIndex: 'milePostName'
        },
        {
          title:'电话',
          align: "left",
          width:120,
          dataIndex: 'phone'
        },
        {
          title:'阶段角色',
          align:"left",
          dataIndex: 'stageRole',
          width:300,
          scopedSlots: { customRender: 'stageRole' }
        }
      ],
      url: {
        list: "/bus/busProject/list",
        delete: "/bus/busProject/delete",
        deleteBatch: "/bus/busProject/deleteBatch",
        exportXlsUrl: "/bus/busProject/exportXls",
        importExcelUrl: "bus/busProject/importExcel",
        homeNewNotice:"/bus/busProjectNotice/homeNewNotice",
        homeHistoryNotices:"/bus/busProjectNotice/homeHistoryNotices",
        homeBudgetList:"/bus/busProjectBudget/queryByProjectId",
        homeMilepost:"/bus/busProjectMilepost/list",
        homeprojectRelated:"/bus/busProject/projectRelatedData",
        busProjectTrends:'/bus/busProjectTrends/queryByProjectId',
        fileList:'/bus/file/getFileListByProjectId',
        // busProjectOne:'/bus/busProject/projectRelatedUser',
        busProjectOne:'/bus/busProject/projectDetailRelatedUser',//新换接口
        queryGanttByProjectId:'/bus/busProject/queryGanttByProjectId',
        queryProfitMarginByProjectId:'/bus/busProject/queryProfitMarginByProjectId',
        projectDetailWorkTimeInfo:'bus/busProject/projectDetailWorkTimeInfo'
      },
      dictOptions: {},
      superFieldList: [],
      // projectId:'',
      pagenotice:{},
      pagebuglist:[],
      pagelandmark:[],
      pageOthers:[],
      colorList:['blue','pink','cyan'],
      currents:0,      
      startDate:"",
      endDate:"",
      beginYear:"",
      beginWeek:"",
      endYear:"",
      endWeek:"",
      timeSheetObj:{},
      workDate:[]
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
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
  },
  mounted(){
    //默认调取本周一至本周日的工时
    this.workDate = [moment().day(1).format('YYYY-MM-DD'),moment().day(7).format('YYYY-MM-DD')]
    // this.projectDetailWorkTimeInfo(this.workDate[0],this.workDate[1])
  },
  props: {
    projectId: {
      type: String
    }
  },
  watch: {
    projectId: function() {
      this.init(this.projectId)
    }
  },
  methods: {
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
    onChange(date, dateString) {
      console.log(date, dateString);
      this.workDate = dateString
      this.projectDetailWorkTimeInfo(dateString[0],dateString[1])
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
            this.pageOthers.timeSheet = res.result.projectSumOverTime
            this.pageOthers.investmentSime = res.result.putOverTime
            this.timeSheetObj.timeSheet = res.result.projectSumOverTime
            this.timeSheetObj.investmentSime = res.result.putOverTime
         }else{
          this.$message.warning(res.message)
         }
      })
    },
    init(projectId){
      this.projectId=projectId
      this.firstProjectOthers()
      this.getSuperFieldList();
      this.firstNotice()
      this.firstBudgetList()
      this.firstmilepost()
      this.getProList()
      this.getFileList()
      this.getOneList()
      this.projectDetailWorkTimeInfo(this.workDate[0],this.workDate[1])
    },
    getOneList(){
      getAction(this.url.busProjectOne,{id:this.projectId}).then(res=>{
         this.dataSource1 = res.result
      })
    },
    getProList(){
      getAction(this.url.busProjectTrends,{projectId:this.projectId}).then(res=>{
         this.dataSource4 = res.result
      })
    },
    getFileList(){
      getAction(this.url.fileList,{projectId:this.projectId}).then(res=>{
         this.dataSource5 = res.result
      })
    },
    budgetlist(){
      this.firstBudgetList()
      this.firstProjectOthers()
      this.projectDetailWorkTimeInfo(this.workDate[0],this.workDate[1])
      this.$refs.moneychart.init()
    },
    noticelist(){
      this.firstNotice()
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = [];
      fieldList.push({ type: 'string', value: 'depart', text: '部门', dictCode: '' })
      fieldList.push({ type: 'string', value: 'bindStaff', text: '绑定员工', dictCode: '' })
      fieldList.push({ type: 'string', value: 'inheritRenewal', text: '继承/续建', dictCode: '' })
      fieldList.push({ type: 'string', value: 'projectName', text: '项目名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'projectCode', text: '项目编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'incomeType', text: '收入确认类型', dictCode: '' })
      fieldList.push({ type: 'string', value: 'projectStatus', text: '项目状态', dictCode: '' })
      fieldList.push({ type: 'string', value: 'projectType', text: '项目类别', dictCode: '' })
      fieldList.push({ type: 'date', value: 'startTime', text: '起止时间' })
      fieldList.push({ type: 'date', value: 'endTime', text: '结束时间' })
      fieldList.push({ type: 'string', value: 'customer', text: '客户', dictCode: '' })
      fieldList.push({ type: 'string', value: 'principal', text: '负责人', dictCode: '' })
      fieldList.push({ type: 'string', value: 'contractEntity', text: '签约实体', dictCode: '' })
      fieldList.push({ type: 'string', value: 'deliveryPlace', text: '交付地点', dictCode: '' })
      fieldList.push({ type: 'string', value: 'sale', text: '销售', dictCode: '' })
      fieldList.push({ type: 'string', value: 'chanceCode', text: '机会编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'budget', text: '预算GM%', dictCode: '' })
      fieldList.push({ type: 'string', value: 'subpackage', text: '分包关系', dictCode: '' })
      fieldList.push({ type: 'string', value: 'otherCode', text: '其他编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'currencyType', text: '币种', dictCode: '' })
      fieldList.push({ type: 'string', value: 'overTimeId', text: '加班费设置', dictCode: '' })
      fieldList.push({ type: 'string', value: 'purchaseTax', text: '采购税费系数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'milepostId', text: '里程碑', dictCode: '' })
      fieldList.push({ type: 'string', value: 'remark', text: '备注', dictCode: '' })
      fieldList.push({ type: 'date', value: 'updateTime', text: '修改时间' })
      this.superFieldList = fieldList
    },
    landmark(val){
      this.$refs.bosom.edit(val)
      this.$refs.bosom.title = val.milepostCode
      this.$refs.bosom.disableSubmit = true
    },
    handleNotice(record) {
      this.$refs.noticeForm.edit(record)
      this.$refs.noticeForm.title = record.title
      this.$refs.noticeForm.disableSubmit = true
    },
    handleHistorical() {
      getAction(this.url.homeHistoryNotices, {projectId:this.projectId}).then((res) => {
        this.$refs.historical.edit(res.result)
      })
      this.$refs.historical.title = '历史公告'
      this.$refs.historical.disableSubmit = true
    },
    Addmilestone() {
      this.$refs.milestone.edit({projectId:this.projectId})
      this.$refs.milestone.title = '提交里程碑'
      this.$refs.milestone.disableSubmit = false
    },
    handlebudget() {
      this.$refs.budget.edit({projectId:this.projectId})
      this.$refs.budget.title = '预算'
      this.$refs.budget.disableSubmit = true
    },
    handleProject() {
      this.$refs.projectDoc.edit(this.projectId)
      this.$refs.projectDoc.title = '项目文档'
      this.$refs.projectDoc.disableSubmit = true
    },
    handleProfit(){
      this.$refs.earnings.add()
      this.$refs.earnings.title = '利润金额&利润率'
      this.$refs.earnings.disableSubmit = true
    },
    firstNotice(){
      getAction(this.url.homeNewNotice, {projectId:this.projectId}).then((res) => {
        console.log(res.result)
        if(res.result){
          this.pagenotice=res.result
        }else{
          this.pagenotice={}
        }
      })
    },
    firstBudgetList(){
      getAction(this.url.homeBudgetList, {projectId:this.projectId}).then((res) => {
        this.pagebuglist=res.result
      })
    },
    firstmilepost(){
      getAction(this.url.homeMilepost, {projectId:this.projectId}).then((res) => {
        this.pagelandmark=res.result.records
        let nowDate = moment().format('YYYY-MM-DD')
        res.result.records.map((item, index)=> {
          if(item.beginTime <= nowDate){
            return this.currents=index
          }
        })
      })
    },
    firstProjectOthers(){
      getAction(this.url.homeprojectRelated, {id:this.projectId}).then((res) => {
        this.pageOthers=res.result
      })
    },
    handleAdd(){
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "添加";
      this.$refs.modalForm.projectId = this.projectId
      this.$refs.modalForm.disableSubmit = false;
    },
    noticeModalFormOk() {
      //发布公告重新加载
      this.firstNotice()
    },
    handlePersonnel(record){
      this.$refs.organization.userId=record.userId
      this.$refs.organization.visible=true
    },
     //刷新文档列表
     uploadDocList(){
      this.getFileList()
    },
    //展示工时明细
    getShowTimeDetail(record){
      console.log(record)
      this.$refs.timeDetail.title = record.date+"工时";
      this.$refs.timeDetail.edit(record,this.projectId)
    }
  }
}
</script>
<style lang="less" scoped>
// @import '~@assets/less/common.less';
@media screen and (min-width: 1441px) {

  /deep/.ant-steps-item-finish .ant-steps-item-icon>.ant-steps-icon .ant-steps-icon-dot,
  /deep/.ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-tail::after,
  /deep/.ant-steps-vertical.ant-steps-dot .ant-steps-item-process .ant-steps-icon-dot {
    color: #1990ff;
    background: #1990ff !important;
  }

  /deep/ .ant-steps-item-title {
    font-size: 14px;
  }

  /deep/ .ipt .ant-input[disabled] {
    font-weight: bold;
    color: rgba(2, 10, 26, 0.85);
    font-size: 24px;
    height: 56px;
  }

 /deep/ .ant-alert {
    padding: 0 32px;
    line-height: 40px;
    height: 40px;
    margin-bottom: 12px;
  }

  /deep/ .ant-alert-icon {
    top: 13px;
  }

  /deep/ .ant-alert-message {
    color: #52C41B;
  }

  /deep/.ant-card-meta .ant-card-meta-detail div:hover,
  /deep/ .tit:hover {
    color: #1990ff;
    // cursor: pointer;
  }

  /deep/ .ant-card-meta-detail>div:not(:last-child) {
    font-weight: bold;
    margin-bottom: 0;
  }


  /deep/ .ant-card-bordered {
    border-radius: 4px;
    border: none;
  }

  /deep/ .ant-card-head {
    padding: 0;
    margin: 0 24px;
    color: rgba(2, 10, 26, 0.85);
  }
  .chart-tip-normal {
    background: #f6ffed;
    height: 40px;
    border-radius: 2px;
    line-height: 30px;
    padding: 6px 15px;
    border: 1px solid #b7eb8f;
    margin-bottom: 15px;
  }

  .chart-tip-normal span {
    margin-left: 6px;
    color: #54c21b;
  }

  .chart-tip-danger {
    background: #fff1f0;
    border: 1px solid #ffa39e;
    height: 40px;
    border-radius: 2px;
    line-height: 30px;
    padding: 6px 15px;
    margin-bottom: 15px;
  }

  .chart-tip-danger span {
    margin-left: 6px;
    color: #f5222d;
  }

  .chart-tip-warning {
    background: #fffbe6;
    // border: rgba(251, 173, 20, 0.1);
    height: 40px;
    border-radius: 2px;
    line-height: 30px;
    padding: 6px 15px;
    border: 1px solid #ffe58f;
    margin-bottom: 15px;
  }

  .chart-tip-warning span {
    margin-left: 6px;
    color: #fbad14;
  }
  .card-one {
    height: 210px;
  }

  .card-one-title {
    font-size: 16px;
    color: rgba(2, 10, 26, 0.65);
  }

  .card-one /deep/ .ant-card-head {
    border-bottom: none;
  }

  .card-one /deep/ .ant-input[disabled] {
    border: none;
    border-radius: 2px;
    padding: 0 16px;
  }

  .card-two{
    height: 210px;
    overflow: hidden;
  }
  .card-list /deep/ .ant-card-head-title,
  .time-line /deep/ .ant-card-head-title {
    font-weight: bold;
  }

  .card-list-subtitle {
    font-weight: 500;
    color: rgba(2, 10, 26, 0.85);
    margin-bottom: 16px;
  }

  .card-list-subtitle span:first-child {
    color: rgba(2, 10, 26, 0.45);
  }

  /deep/ .ant-card-body {
    padding: 15px 24px;
  }

  /deep/ .headtit {
    font-size: 24px;
    color: rgba(2, 10, 26, 0.85);
    font-weight: bold;
  }

  /deep/ .ant-card-extra {
    padding: 0
  }

  .flex-bot {
    margin-bottom: 16px;
  }
}

@media screen and (max-width: 1440px) {

  /deep/.ant-steps-item-finish .ant-steps-item-icon>.ant-steps-icon .ant-steps-icon-dot,
  /deep/.ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-tail::after,
  /deep/.ant-steps-vertical.ant-steps-dot .ant-steps-item-process .ant-steps-icon-dot {
    color: #1990ff;
    background: #1990ff !important;
  }

  /deep/ .ant-steps-item-title {
    font-size: 13px;
  }

  /deep/ .ipt .ant-input[disabled] {
    font-weight: bold;
    color: rgba(2, 10, 26, 0.85);
    font-size: 20px;
    height: 42px;
  }

  /deep/ .ant-alert {
    padding: 0 32px;
    line-height: 40px;
    height: 40px;
    margin-bottom: 12px;
  }

  /deep/ .ant-alert-icon {
    top: 13px;
  }

  /deep/ .ant-alert-message {
    color: #52C41B;
    font-size: 13px;
  }

  /deep/.ant-card-meta .ant-card-meta-detail div:hover,
  /deep/ .tit:hover {
    color: #1990ff;
    // cursor: pointer;
  }

  /deep/ .ant-card-meta-detail>div:not(:last-child) {
    font-weight: bold;
    margin-bottom: 0;
    font-size: 14px;
  }

  .headtit-p {
    font-size: 12px;
  }

  .card-two /deep/ .ant-card-body {
    padding: 0 18px 12px 18px;
  }

  .time-line /deep/ .ant-btn {
    height: 24px;
    line-height: 24px;
    font-size: 13px;
  }

  .card-two /deep/ .ant-btn {
    height: 24px;
    line-height: 22px;
    font-size: 12px;
  }

  /deep/ .ant-card-bordered {
    border-radius: 4px;
    border: none;
  }

  /deep/ .ant-card-head {
    padding: 0;
    margin: 0 18px;
    color: rgba(2, 10, 26, 0.85);
  }

  .card-one,
  .card-two {
    height: 160px;
  }
  .card-two{
    overflow: hidden;
  }

  .card-one-title {
    font-size: 12px;
    color: rgba(2, 10, 26, 0.65);
  }

  .card-one /deep/ .ant-card-head,
  .card-two /deep/ .ant-card-head {
    border-bottom: none;
  }

  .card-one /deep/ .ant-input[disabled] {
    border: none;
    border-radius: 2px;
    padding: 0 12px;
  }

  .card-list /deep/ .ant-card-head-title,
  .time-line /deep/ .ant-card-head-title,
  .card-one /deep/ .ant-card-head-title,
  .card-two /deep/ .ant-card-head-title {
    font-weight: bold;
    padding: 12px 0;
    font-size: 13px;
  }

  .card-list /deep/ .ant-input {
    height: 24px;
    font-size: 13px;
    line-height: 16px;
  }

  .card-list-subtitle {
    font-weight: 500;
    color: rgba(2, 10, 26, 0.85);
    margin-bottom: 12px;
    font-size: 13px;
  }

  .card-list-subtitle span:first-child {
    color: rgba(2, 10, 26, 0.45);
  }

  /deep/ .ant-card-body {
    padding: 12px 24px;
  }

  /deep/ .headtit {
    font-size: 18px;
    color: rgba(2, 10, 26, 0.85);
    font-weight: bold;
  }

  /deep/ .ant-card-extra {
    padding: 0
  }

  .flex-bot {
    margin-bottom: 16px;
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
}
/deep/ .bthhover{
  width: 100%;
}
/deep/ .bthhover:hover{
  color:#1990ff;
  border-color:#1990ff;
}
/deep/.headtit-p {
  margin-top:6px;
  margin-bottom:0px;
}
/deep/.headtit-p>p{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/deep/ .ant-steps-dot .ant-steps-item-content, .ant-steps-dot.ant-steps-small .ant-steps-item-content{
  width: 200px;
}
.timeCss /deep/ .ant-card-extra{
width: 80%;
}
.chart-tip-normal {
    background: #f6ffed;
    height: 35px;
    border-radius: 2px;
    line-height: 22px;
    padding: 6px 15px;
    border: 1px solid #b7eb8f;
    margin-bottom: 15px;
  }

  .chart-tip-normal span {
    margin-left: 6px;
    color: #54c21b;
  }

  .chart-tip-danger {
    background: #fff1f0;
    border: 1px solid #ffa39e;
    height: 35px;
    border-radius: 2px;
    line-height: 22px;
    padding: 6px 15px;
    margin-bottom: 15px;
  }

  .chart-tip-danger span {
    margin-left: 6px;
    color: #f5222d;
  }

  .chart-tip-warning {
    background: #fffbe6;
    // border: rgba(251, 173, 20, 0.1);
    height: 35px;
    border-radius: 2px;
    line-height: 22px;
    padding: 6px 15px;
    border: 1px solid #ffe58f;
    margin-bottom: 15px;
  }

  .chart-tip-warning span {
    margin-left: 6px;
    color: #fbad14;
  }
</style>
