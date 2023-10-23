<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <a-range-picker v-model="queryParam.workCalendars" @change="onChangeTime" class="tablePageQueryCss"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="">
                  <j-input placeholder="请输入项目" v-model="queryParam.projectName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
                <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                </a> -->
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <a-button type="primary" icon="download" @click="handleExportXls('项目汇总')">导出</a-button>
      </div>
    </div>
    <!-- 查询区域-END -->

   
    <div> 
      <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
        :pagination="ipagination" :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewApprHistory(record)" style="color: rgb(204, 20, 138);">{{text}}</a>
        </span>
         <!-- 内嵌table区域 begin -->
        <template slot="expandedRowRender" slot-scope="record">
            <bus-project-sub-table :record="record"/>
        </template>
        <!-- 内嵌table区域 end -->
      </a-table>
    </div>
    <bus-mile-post-modal ref="modalApprHisForm"  />
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { getAction } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusProjectSubTable from './subTables/BusProjectSubTable'
import BusMilePostModal from './subTables/BusMilePostModal'
import { USER_AUTH } from '@/store/mutation-types'
export default {
  name: 'BusProjectList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    BusProjectSubTable,
    BusMilePostModal
  },
  data() {
    return {
      description: 'bus_project管理页面',
      // 表头
      columns:[
        {
          title: '项目编码',
          align: "left",
          dataIndex: 'projectCode'
        },
        {
          title: '项目名',
          align: "left",
          dataIndex: 'projectName',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '开始时间',
          align: "left",
          dataIndex: 'beginTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '结束时间',
          align: "left",
          dataIndex: 'endTime',
          customRender: function (text) {
            return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '计划总人数',
          align: "left",
          dataIndex: 'peopleNum',
        },
        {
          title: '实际总人数',
          align: "left",
          dataIndex: 'actualPeopleNum',
        },
        {
          title: '计划总工时',
          align: "left",
          dataIndex: 'planHours'
        },
        {
          title: '实际总工时',
          align: "left",
          dataIndex: 'totalHours',
        },

      ],
      url: {
        list: "/bus/countWorkHours/projectCountList",
        delete: "/bus/busProject/delete",
        deleteBatch: "/bus/busProject/deleteBatch",
        exportXlsUrl: '/bus/countWorkHours/exportProjectCountList',
        importExcelUrl: "bus/busProject/importExcel",
        getProject:'/bus/busProject/getHomeMyNoticeInfo',
      },
      proOptions:[],
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  mounted(){
    this.getProject()
  },
  methods: {
    onChangeTime(date, dateString) {
      if (dateString.length != 0) {
        this.queryParam.beginTime = dateString[0]
        this.queryParam.endTime = dateString[1]
      } else {
        this.queryParam.beginTime = ''
        this.queryParam.endTime = ''
      }
    },
    getProject(){
        getAction(this.url.getProject).then(res=>{
          let result = res.result
          let dictOptions = []
          for (let i = 0; i < result.length; i++) {
              let temp = result[i];
              let item = {}
              item.label = temp.projectName
              item.value = temp.projectId
              dictOptions.push(item);
          }
          this.proOptions = dictOptions
        })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      handleViewApprHistory(record){
        this.$refs.modalApprHisForm.visible = true;
        this.$refs.modalApprHisForm.loadData(1,record);
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
