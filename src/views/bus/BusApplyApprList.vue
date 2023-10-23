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
            <a-col :span="7">
              <a-form-item label="">
                <a-range-picker @change="onChangeTime" v-model="queryParam.customTime" class="tablePageQueryCss" />
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
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
        <!-- <a-button type="primary" icon="download" @click="handleExportXls('申请日期配置')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>-->
        <!-- 高级查询区域 -->
        <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel">
              <a-icon type="delete" />删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <!-- 查询区域-END -->

    

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->
      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
      <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
        :pagination="ipagination" :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">
        <span slot="instanceId" slot-scope="text, record">
          <a-button type="primary" size="small" @click="lookImgs(text, record)">查看</a-button>
        </span>

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt
            style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small"
            @click="downloadFile(text)">下载</a-button>
        </template>

        <span slot="action" slot-scope="text, record" class="fix-action">
          <!-- 1通过 2 驳回 -->
          <span @click="handleCheck(record)" v-if="record.formUrl == 'addPersonApply:check'" class="activeLogoCss">审核</span>
          <span @click="handleCheck(record)" v-else-if="record.formUrl == 'addPersonApply:resubmit'" class="activeLogoCss">办理</span>
          <span @click="handleCheck(record)" v-if="record.formUrl == 'milepostComplete:check'" class="activeLogoCss">审核</span>
          <span @click="handleCheck(record)" v-else-if="record.formUrl == 'milepostComplete:resubmit'" class="activeLogoCss">办理</span>

          <span @click="handleViewApprHistory(record)" v-if="record.status != 1" class="activeLogoCss">跟踪</span>

          <!--
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>
      </a-table>
      <a-modal :bodyStyle="{ padding: 0 }" :visible="lookImg" :footer="null" @cancel="handleCancel" width="1000px">
        <img :src="imgRes" />
      </a-modal>
    </div>
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
    <bus-appr-history-modal ref="modalApprHisForm" />
  </a-card>


</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ProjectUserApplyModal from './modules/ProjectUserApply/ProjectUserApplyModal'
import ProjectUserRejectModal from './modules/ProjectUserApply/ProjectUserRejectModal'
import BusApprHistoryModal from './modules/BusApprHistoryModal'
import MilepostCompleteModal from './modules/MilepostComplete/MilepostCompleteModal'
import MilepostCompleteRejectModal from './modules/MilepostComplete/MilepostCompleteRejectModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { getAction } from '@/api/manage'

export default {
  name: 'BusApplyApprList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    ProjectUserApplyModal,
    ProjectUserRejectModal,
    BusApprHistoryModal,
    MilepostCompleteModal,
    MilepostCompleteRejectModal,
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
        list: '/api/flowProcAppr/taskList',
        delete: '/bus/busApplyDateCfg/delete',
        deleteBatch: '/bus/busApplyDateCfg/deleteBatch',
        exportXlsUrl: '/bus/busApplyDateCfg/exportXls',
        importExcelUrl: 'bus/busApplyDateCfg/importExcel',
        lookimage: '/api/flowProcAppr/tracePhoto',
        passUrl: '/bus/busApply/applyPass2'
      },
      dictOptions: {},
      superFieldList: []
    }
  },
  props: {
    busiNo: {
      type: String
    }
  },
  watch: {
    busiNo: function () {
      this.loadData(1, this.busiNo)
    }
  },
  created() {
    // console.log(this.busiNo, 'this.busiNo')
  },
  methods: {
    onChangeTime(date, dateString) {
      if (dateString.length != 0) {
        this.queryParam.stDate = dateString[0]
        this.queryParam.enDate = dateString[1]
      } else {
        this.queryParam.stDate = ''
        this.queryParam.enDate = ''
      }
    },
    loadData(arg, busiNo) {
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
      // console.log(params, 'params')
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

    }
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