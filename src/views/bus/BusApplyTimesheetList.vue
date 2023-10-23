<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <a-input placeholder="请输入主题" v-model="queryParam.subject" class="tablePageQueryCss"></a-input>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="6">
              <a-form-item label="申请人">
                <j-input v-model="queryParam.submitUserShow" placeholder="请输入申请人" dictCode="projectStatus_dictText" />
              </a-form-item>
            </a-col> -->
            <!-- <a-col :span="6">
              <a-form-item label="单据号">
                <j-input v-model="queryParam.projectType" placeholder="请输入单据号" dictCode="project_type" />
              </a-form-item>
            </a-col> -->
            <a-col :xl="7" :lg="7" :md="8" :sm="24">
              <a-form-item label="">
                <a-range-picker @change="onChangeTime" v-model="queryParam.customTime" class="tablePageQueryCss"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <a-popconfirm title="确定审核吗?" @confirm="() => batchAudit()">
          <a-button v-has="'timesheetBatch:check'" type="primary" ghost icon="check" :disabled="selectionRows.length==0"
            style="margin-left: 8px">批量审核</a-button>
        </a-popconfirm>
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
        <!-- <a-button type="primary" icon="download" @click="handleExportXls('申请日期配置')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>-->
        <!-- 高级查询区域 -->
        <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel">
              <a-icon type="delete" />删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>
    </div>
    <!-- 查询区域-END -->

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
      <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="apprId" :columns="columns" :dataSource="dataSource"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="ipagination"
        :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">
        <span slot="instanceId" slot-scope="text, record">
          <a-button type="primary" size="small" @click="lookImgs(text, record)">查看</a-button>
        </span>

        <template slot="allHours" slot-scope="text,record">
          <span v-if="record.allHours > record.planHours" style="color:red;font-weight: bold;text-decoration: underline;font-size: 18px;">
            {{ text }}
          </span>
          <span v-else>
            {{ text }}
          </span>
        </template>

        <span slot="action" slot-scope="text, record" class="fix-action">
          <!-- 1通过 2 驳回 -->
          <span @click="handleCheck(record)" v-if="record.formUrl == 'timesheetApproval:check'" class="activeLogoCss">审核</span>
          <span @click="handleCheck(record)" v-else-if="record.formUrl == 'timesheetApproval:resubmit'" class="activeLogoCss">办理</span>
          <span @click="handleViewApprHistory(record)" v-if="record.status != 1" class="activeLogoCss">跟踪</span>
        </span>
      </a-table>
      <a-modal :bodyStyle="{ padding: 0 }" :visible="lookImg" :footer="null" @cancel="handleCancel" width="1000px">
        <img :src="imgRes" />
      </a-modal>
      <a-modal
        title="审批人"
        :visible="approveVisible"
        @ok="handleApproveOk"
        @cancel="handleApproveCancel"
      >
        <a-select  style="width: 100%" @change="handleChange" v-model="nextApproveUser"  placeholder="请选择审批人">
          <a-select-option v-for="d in approveUserList" :key="d.id" :value="d.id">{{ d.realname }}</a-select-option>
        </a-select>
      </a-modal>
    </div>
    <!-- 工时审核 -->
    <work-hours-audit-modal ref="timeSheetApprovalForm" :busApplyAuditForm="busApplyAuditForm"
      @handlePass="handlePass" />
    <!-- 工时驳回办理 -->
    <work-hours-reject-modal ref="timeSheetRejectForm" :busApplyRejectForm="busApplyAuditForm"
      @handlePass="handlePass" />
    <bus-appr-history-modal ref="modalApprHisForm" />
  </a-card>


</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusApprHistoryModal from './modules/BusApprHistoryModal'
import WorkHoursAuditModal from './modules/WorkHoursApproval/WorkHoursAuditModal'
import WorkHoursRejectModal from './modules/WorkHoursApproval/WorkHoursRejectModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'BusApplyApprList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    BusApprHistoryModal,
    WorkHoursAuditModal,
    WorkHoursRejectModal
  },
  data() {
    return {
      busApplyAuditForm: {},
      lookImg: false,
      imgRes: '',
      visible: false,
      description: '申请日期配置管理页面',
      // 表头
      columns: [
        // {
        //   title: '流程号',
        //   dataIndex: 'instanceId',
        // },
        // {
        //   title: '任务号',
        //   dataIndex: 'taskId'
        // },
        // {
        //   title: '流程名称',
        //   dataIndex: 'busiName'
        // },
        // {
        //   title: '任务名称',
        //   dataIndex: 'taskName'
        // },
        {
          title: '主题',
          dataIndex: 'subject'
        },
        // {
        //   title: '当前节点',
        //   dataIndex: 'approverRoleName'
        // },
        // {
        //   title: '当前节点',
        //   dataIndex: 'taskName'
        // },
        {
          title: '当前处理人',
          dataIndex: 'approverNameShow'
        },
        {
          title: '申请人',
          dataIndex: 'submitUserShow'
        },
        {
          title: '预计工时',
          dataIndex: 'planHours'
        },
        {
          title: '总工时',
          dataIndex: 'allHours',
          scopedSlots: { customRender: 'allHours' }
        },
        {
          title: '正常工时',
          dataIndex: 'normalHours'
        },
        {
          title: '加班工时',
          dataIndex: 'overtimeHours'
        },
        {
          title: '申请时间',
          dataIndex: 'submitTime'
        },
        {
          title: '到达时间',
          dataIndex: 'arrivalTime'
        },
        {
          title: '停留时间',
          dataIndex: 'dueDate'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/api/flowProcAppr/taskWorkHoursList',//工时审核列表
        delete: '/bus/busApplyDateCfg/delete',
        deleteBatch: '/bus/busApplyDateCfg/deleteBatch',
        exportXlsUrl: '/bus/busApplyDateCfg/exportXls',
        importExcelUrl: 'bus/busApplyDateCfg/importExcel',
        lookimage: '/api/flowProcAppr/tracePhoto',
        batchPassUrl: '/bus/busProjectActual/manyWorkHoursPass',//工时批量审核
        getApproveUserList:'bus/busProjectActual/getApproveUserList',
        getStatusByUser:'bus/busProjectActual/getStatusByUser'
      },
      dictOptions: {},
      superFieldList: [],
      approveVisible:false,
      nextApproveUser:'',
      approveUserList:[],
      ifShow:''
    }
  },
  props: {
    busiNo: {
      type: String
    }
  },
  watch: {
    busiNo: function () {
      this.loadData(1)
    }
  },
  created() {
    this.getApproveUserList()
    this.getStatusByUser()
  },

  computed: {
    // importExcelUrl: function () {
    //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    // },
  },
  methods: {    
    getStatusByUser(){
      getAction(this.url.getStatusByUser).then(res=>{
        if (res.success) {
          this.ifShow = res.result
        }
      })
    },
    handleChange(e){
      this.nextApproveUser = e
    },
    getApproveUserList(){
       getAction(this.url.getApproveUserList).then(res=>{
        if (res.success) {
          this.approveUserList = res.result
        }
       })
    },
    handleApproveOk(){
      for (let i = 0; i < this.selectionRows.length; i++) {
        this.selectionRows[i].apprStatus = 1 //1通过  2驳回
        this.selectionRows[i].apprRemark = '同意'
        this.selectionRows[i].assignee = this.nextApproveUser
      }
      postAction(this.url.batchPassUrl, this.selectionRows).then((res) => {
        if (res.success) {
          // console.log(999999, res)
          this.$message.success('操作成功')
          this.loadData(1)
          this.selectedRowKeys = [];
          this.selectionRows = [];
          this.$emit('changeLength')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleApproveCancel(){
      this.approveVisible = false
    },
    opinionsChange(){

    },
    onChangeTime(date, dateString) {
      if (dateString.length != 0) {
        this.queryParam.stDate = dateString[0]
        this.queryParam.enDate = dateString[1]
      } else {
        this.queryParam.stDate = ''
        this.queryParam.enDate = ''
      }
      // console.log(date,dateString, this.queryParam.stDate,this.queryParam.enDate)
    },
    isGetCheckboxProps(record) {
      return {
        props: {
          disabled: record.formUrl != 'timesheetApproval:check', // Column configuration not to be checked
        }
      }
    },
    batchAudit() {
      
      
      if(this.ifShow=='1'){
        this.approveVisible = true
      }else{
        this.handleApproveOk()
      }
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      params.busiNo = this.busiNo
      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    lookImgs(test, record) {
      this.lookImg = true
      this.imgRes = process.env.VUE_APP_API_BASE_URL + this.url.lookimage + '?processInstanceId=' + record.instanceId
    },
    handleCancel() {
      this.lookImg = false
    },
    handleCheck(record) {
      this.busApplyAuditForm = record
      if (record.formUrl == 'timesheetApproval:check') {
        this.$refs['timeSheetApprovalForm'].visible = true
        this.$refs['timeSheetApprovalForm'].title = '审核'
      } else if (record.formUrl == 'timesheetApproval:resubmit') {
        this.$refs['timeSheetRejectForm'].visible = true
        this.$refs['timeSheetRejectForm'].title = '办理'
      }
    },
    handlePass() {
      let that = this
      //重新计算分页问题
      that.reCalculatePage(1)
      that.loadData(1, this.busiNo)
      that.$emit('changeLength')
    },
    //追踪
    handleViewApprHistory(record) {
      let that = this;
      //
      if (record.instanceId == '') {
        this.$message.error("没有流程信息")
      } else {
        this.$refs.modalApprHisForm.visible = true;
        this.$refs.modalApprHisForm.loadData(1, record.instanceId);
      }
    },
  }
}
</script>
<style scoped>
@import '~@assets/css/common.css';
@import '~@assets/less/common.less';
.activeLogoCss:hover {
  cursor: pointer;
}

::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #F7F8FA;
}
::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  /* .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td */
  background: #fff !important;
}
::v-deep .ant-table-tbody > tr > td{
  background: #F7F8FA;
}
::v-deep .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  background: #fff;
}
::v-deep .ant-table-thead > tr > th{
  background: #F7F8FA;
}
</style>