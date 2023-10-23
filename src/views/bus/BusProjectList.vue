<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="项目名称" v-model="queryParam.projectName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="">
                <j-dict-select-tag v-model="queryParam.projectStatus" placeholder="项目状态" dictCode="project_status"
                  class="tablePageQueryCss" style="width: 100%;" />
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :span="6">
                <a-form-item label="">
                  <j-dict-select-tag v-model="queryParam.projectType" placeholder="项目类别" dictCode="project_type"
                    class="tablePageQueryCss" style="width: 100%;" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="">
                  <j-input placeholder="项目编号" v-model="queryParam.projectCode" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="">
                  <a-range-picker v-model="queryParam.customTime" @change="onChangeTime" class="tablePageQueryCss" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="">
                  <j-input placeholder="机会编号" v-model="queryParam.chanceCode" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px;" class="btnCss">重置</a-button>
                <div @click="handleToggleSearch"
                  style="margin-left: 8px;padding: 8px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 10px;">
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- <div style="display: flex;">
        <a-button v-has="'project:add'" icon="import" style="margin-right: 10px;" class="btnCss">导入</a-button>
        <a-button @click="handleAdd" v-has="'project:add'" type="primary" icon="plus"
          style="margin-right: 10px;">添加</a-button>
        <a-button type="primary" icon="plus" v-has="'application:add'" @click="handleapplication()">加入项目申请</a-button>
        <a-dropdown placement="bottomRight">
          <div class=""
            style="width: 30px;height: 30px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 30px;">
            <img src="~@/assets/more.png" alt="logo">
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">导出</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">下载模板</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">报表</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">批量编辑</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div> -->
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->


    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

      <!-- bordered这是表格的边框属性
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"这是复选框属性 -->
      <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
        :pagination="ipagination" :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">
        <template slot="depart" slot-scope="text,record">
          <a @click="handledepart(record)">{{ text }}</a>
        </template>
        <template slot="projectCode" slot-scope="text,record">
          <a @click="handledepart(record)">{{ text }}</a>
        </template>

        <template slot="depart2" slot-scope="text,record">
          <a @click="handledepart(record)" v-if="record.userStatus == null || record.userStatus == 4">{{ text }}</a>
          <span v-else>{{ text }}</span>
        </template>
        <template slot="projectCode2" slot-scope="text,record">
          <a @click="handledepart(record)" v-if="record.userStatus == null || record.userStatus == 4">{{ text }}</a>
          <span v-else>{{ text }}</span>
        </template>


        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>
        <span slot="projectStatus_dictText" slot-scope="text, record">
          <a-tag v-if="record.projectStatus_dictText == '执行中'" style="width:52px;text-align:center"
            color="green">执行中</a-tag>
          <a-tag v-if="record.projectStatus_dictText == '新建'" style="width:52px;text-align:center">新建</a-tag>
          <a-tag v-if="record.projectStatus_dictText == '锁定'" style="width:52px;text-align:center" color="red">锁定</a-tag>
          <a-tag v-if="record.projectStatus_dictText == '完成'" style="width:52px;text-align:center"
            color="orange">完成</a-tag>
        </span>
        <span slot="userStatus" slot-scope="text">
          <span v-if="text == null">正常</span>
          <span v-if="text == 2">审批中</span>
          <span v-if="text == 3">被驳回</span>
          <span v-if="text == 4">已通过</span>
        </span>
        <span slot="actions" slot-scope="text, record" class="fix-action" v-if="record.userStatus == null || record.userStatus == 4">
          <a @click="handledepart(record)">详情</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-has="'project:timesheet'">
                <a @click="handleWorking(record)">工时分配</a>
              </a-menu-item>
              <a-menu-item v-has="'project:milepost'">
                <a @click="handleTimelineSingle(record)">里程碑信息</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

        </span>
        <span slot="actions" slot-scope="text, record" class="fix-action" v-else>
          <a @click="handleViewApprHistory(record)">跟踪</a>
        </span>
        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleEdit(record)" v-if="record.projectStatus != 4"><a-icon
              type="edit" class="activeLogoCss" /></span>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-if="record.projectStatus != 4">
            <img src="~@/assets/del.png" class="activeLogoCss" alt="logo">
          </a-popconfirm>
          <a-dropdown>
            <span class="ant-dropdown-link"><img src="~@/assets/more.png" alt="logo" class="activeLogoCss"></span>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.projectStatus == 2">
                <a-popconfirm title="确定锁定吗?" @confirm="() => handleLock(record)">
                  <a>锁定</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.projectStatus == 1">
                <a @click="handleStartup(record)">启动</a>
              </a-menu-item>
              <a-menu-item v-if="record.projectStatus == 3">
                <a-popconfirm title="确定解除锁定吗?" @confirm="() => handleEndLock(record)">
                  <a>解除锁定</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAddPersonnel(record)">人员池</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleTimeline(record)">里程碑</a>
              </a-menu-item>
              <a-menu-item v-has="'project:timesheet'">
                <a @click="handleWorking(record)">工时分配</a>
              </a-menu-item>
              <a-menu-item v-has="'project:timesheet'">
                <a @click="handleEstimatedCost(record)">预估成本</a>
              </a-menu-item>
              <a-menu-item v-has="'project:milepost'">
                <a @click="handleTimelineSingle(record)">里程碑信息</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <!-- <a-menu-item v-if="record.projectStatus==1">

              </a-menu-item> -->
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>

    <bus-project-modal ref="modalForm" @ok="modalFormOk"></bus-project-modal>
    <project-application-modal ref="projectForm" @ok="modalFormOk"></project-application-modal>
    <!-- 里程碑 -->
    <milepost-modal ref="milepostModal" @ok="modalFormOk"></milepost-modal>
    <bus-personnel ref="busPersonnel"></bus-personnel>
    <!-- 工时 -->
    <teamours-modal ref="teamours"></teamours-modal>
    <!-- 启动项目 -->
    <startup-modal ref="startup" @uploadList="uploadList"></startup-modal>
    <!-- 跟踪 -->
    <bus-appr-history-modal ref="modalApprHisForm" />
    <!-- 项目详情 -->
    <project-details-modal ref="projectdetails"></project-details-modal>
    <!-- 里程碑信息 -->
    <milepost-single-modal ref="milepostSingleModal" @ok="modalFormOk"></milepost-single-modal>
    <!-- 预估成本 -->
    <estimated-cost ref="EstimatedCost"></estimated-cost>
    <project-edit-form ref="ProjectEditForm" @ok="modalFormOk"></project-edit-form>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { getAction } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusProjectModal from './modules/BusProjectModal'
import MilepostModal from './modules/MilepostModal'
import ProjectApplicationModal from './modules/ProjectApplicationModal'
import BusPersonnel from './modules/BusPersonnel'
import TeamoursModal from './modules/TeamoursModal.vue'
import StartupModal from './modules/StartupModal.vue'
import { USER_AUTH } from '@/store/mutation-types'
import BusApprHistoryModal from './modules/BusApprHistoryModal'
import ProjectDetailsModal from './modules/ProjectDetailsModal'
import MilepostSingleModal from './modules/MilepostSingleModal'
import EstimatedCost from './modules/EstimatedCost'
import ProjectEditForm from './modules/ProjectEditForm'
export default {
  name: 'BusProjectList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    BusProjectModal,
    ProjectApplicationModal,
    MilepostModal,
    BusPersonnel,
    TeamoursModal,
    StartupModal,
    BusApprHistoryModal,
    ProjectDetailsModal,
    MilepostSingleModal,
    EstimatedCost,
    ProjectEditForm
  },
  data() {
    return {
      description: 'bus_project管理页面',
      // 表头
      columns: [],
      url: {
        list: "/bus/busProject/list",
        delete: "/bus/busProject/delete",
        deleteBatch: "/bus/busProject/deleteBatch",
        exportXlsUrl: "/bus/busProject/exportXls",
        importExcelUrl: "bus/busProject/importExcel",
        getById: '/bus/busProjectMilepost/queryByProjectId',
        lockPro: '/bus/busProject/startProject',//项目锁定
        endLockPro: '/bus/busProject/recoveryProject',//解除锁定

      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
    let flag = false;
    for (let auth of authList) {
      if (auth.action == 'dev:person:columns') {
        flag = true;
        break
      }
    }
    if (!flag) {
      this.columns = [

        {
          title: '项目编号',
          align: "left",
          dataIndex: 'projectCode',
          scopedSlots: { customRender: 'projectCode' }
        },
        {
          title: '项目名称',
          align: "left",
          dataIndex: 'projectName',
          scopedSlots: { customRender: 'depart' }
        }, {
          title: '部门',
          align: "left",
          dataIndex: 'departNameEn'
        },
        {
          title: '项目类别',
          align: "left",
          dataIndex: 'projectType_dictText'
        },
        {
          title: '机会编号',
          align: "left",
          dataIndex: 'chanceCode'
        },
        {
          title: '销售',
          align: "left",
          dataIndex: 'sale'
        },
        {
          title: '更新日期',
          align: "left",
          dataIndex: 'updateTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        // {
        //   title: '预算GM%',
        //   align: "left",
        //   dataIndex: 'budget'
        // },
        {
          title: '签约实体',
          align: "left",
          dataIndex: 'contractEntity_dictText'
        },
        // {
        //   title: '分包关系',
        //   align: "left",
        //   dataIndex: 'subpackage_dictText'
        // },

        {
          title: '开始日期',
          align: "left",
          dataIndex: 'startTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '结束日期',
          align: "left",
          dataIndex: 'endTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '项目状态',
          align: "left",
          dataIndex: 'projectStatus_dictText',
          scopedSlots: { customRender: 'projectStatus_dictText' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ]
    } else {
      this.columns = [

        {
          title: '项目编号',
          align: "left",
          dataIndex: 'projectCode',
          scopedSlots: { customRender: 'projectCode2' }
        },
        {
          title: '项目名称',
          align: "left",
          dataIndex: 'projectName',
          scopedSlots: { customRender: 'depart2' }
        }, {
          title: '部门',
          align: "left",
          dataIndex: 'departNameEn'
        },
        {
          title: '开始日期',
          align: "left",
          dataIndex: 'startTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '结束日期',
          align: "left",
          dataIndex: 'endTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '项目状态',
          align: "left",
          dataIndex: 'projectStatus_dictText',
          scopedSlots: { customRender: 'projectStatus_dictText' }
        },
        {
          title: '申请状态',
          align: "left",
          dataIndex: 'userStatus',
          scopedSlots: { customRender: 'userStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 147,
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
    this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    handleEstimatedCost(record) {
      this.$refs.EstimatedCost.visible = true
      this.$refs.EstimatedCost.title = '预估成本'
      this.$refs.EstimatedCost.loadData(record.id)
    },
    onChangeTime(date, dateString) {
      if (dateString.length != 0) {
        this.queryParam.startTime = dateString[0]
        this.queryParam.endTime = dateString[1]
      } else {
        this.queryParam.startTime = ''
        this.queryParam.endTime = ''
      }
    },
    handleAddPersonnel(record) {
      console.log(this.$refs.busPersonnel, 'this.$refs.busPersonnel', record.principal)
      this.$refs.busPersonnel.visible = true
      this.$refs.busPersonnel.projectData = record
      this.$refs.busPersonnel.getAllUser(record.id)
      this.$refs.busPersonnel.getCurrentDepartUser(record.id, record.principal)
      this.$refs.busPersonnel.getCommonUsers(record.id, record.principal)
      this.$refs.busPersonnel.getCurrentUser(record.id)
    },
    async handleTimeline(record) {
      // if(){
      const resultData = await getAction(this.url.getById, { queryByProjectId: record.id })
      if (resultData.success && resultData.result.length != 0) {
        this.$refs.milepostModal.title = '编辑里程碑'
        this.$refs.milepostModal.edit(record, resultData.result)
      } else {
        this.$refs.milepostModal.edit(record, [])
        this.$refs.milepostModal.title = '添加里程碑'
      }
    },
    initDictConfig() {
    },
    handledepart(record) {
      this.$router.push({ path: "/bus/projectDetails", query: { projectId: record.id,projectDetails: record } })
      // this.$refs.projectdetails.edit({projectId: record.id})
      // this.$refs.projectdetails.title = '项目详情'
      // this.$refs.projectdetails.disableSubmit = false
    },
    handleEdit(record){
      this.$refs.ProjectEditForm.visible = true;
      this.$refs.ProjectEditForm.edit(record)
    },
    handleDetail(record){
      this.$router.push({ path: "/bus/projectDetails", query: { projectId: record.id,projectDetails: record,name: record.projectName } })
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
    handleapplication() {
      this.$refs.projectForm.add()
      this.$refs.projectForm.title = '项目申请'
      this.$refs.projectForm.disableSubmit = false
    },
    handleWorking(record) {
      this.$refs.teamours.edit(record)
      this.$refs.teamours.title = '团队工时管理'
      this.$refs.teamours.ifMilepostId = false
      this.$refs.teamours.disableSubmit = true
    },
    handleStartup(record) {
      this.$refs.startup.edit(record)
      this.$refs.startup.title = '启动项目'
      this.$refs.startup.disableSubmit = false
    },
    handleLock(record) {//2 启动 3 锁定
      getAction(this.url.lockPro, { projectId: record.id, status: 3 }).then((res) => {
        if (res.success) {
          this.$message.success('锁定成功');
          this.loadData(1);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    //解除锁定
    handleEndLock(record) {
      getAction(this.url.endLockPro, { id: record.id, status: 2 }).then((res) => {
        if (res.success) {
          this.$message.success('解除锁定成功');
          this.loadData(1);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    handleTimelineSingle(record) {
      this.$refs.milepostSingleModal.title = '里程碑信息'
      this.$refs.milepostSingleModal.edit(record)
    },
    uploadList() {
      this.loadData(1);
    },
    handleViewApprHistory(record) {
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