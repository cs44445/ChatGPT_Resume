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
                <j-input placeholder="请输入姓名" v-model="queryParam.userName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :span="6">
                <a-form-item label="">
                  <j-input placeholder="请输入工号" v-model="queryParam.workNo" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            </template>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
                <div @click="handleToggleSearch"
                  style="margin-left: 8px;padding: 8px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 10px;">
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <a-button type="primary" icon="download"  @click="handleExportXls('人员汇总')">导出</a-button>
      </div>
    </div>
    <!-- 查询区域-END -->

    <!-- table区域-begin -->
    <div>
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleViewApprHistory(record)" style="color: rgb(204, 20, 138);">{{text}}{{record.leave}}</a>
        </span>
      </a-table>
    </div>
    <bus-name-details-modal ref="modalApprHisForm"  />
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusNameDetailsModal from './subTables/BusNameDetailsModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
import { postAction, getAction } from '@/api/manage'
  export default {
    name: 'BusApplyDateCfgList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusNameDetailsModal
    },
    props: {
      busiNo: {
        type: String
      }
    },
    data () {
      return {
        visible: false,
        description: '申请日期配置管理页面',
        // 表头
        columns: [
          {
              title: '工号',
              dataIndex: 'workNo',
          },
          {
              title: '姓名',
              dataIndex: 'userName',
              scopedSlots: { customRender: 'action' }
          },
          // {
          //     title: '项目编码',
          //     dataIndex: 'projectCode',
          // },
          // {
          //     title: '项目名',
          //     dataIndex: 'projectName',
          // },
          // {
          //     title: '里程碑',
          //     dataIndex: 'milepostName',
          // },
          // {
          //   title: '分配工时',
          //   dataIndex: 'planHours',
          // },
          {
              title: '总工时',
              dataIndex: 'totalHours',

          },
          {
              title: '正常工时',
              dataIndex: 'workHours',

          },
          {
              title: '加班工时',
              dataIndex: 'overtimeHours',

          },
          // {
          //     title: '剩余工时',
          //     dataIndex: 'remainingHours',
          //
          // }
        ],
        url: {
          list: "/bus/countWorkHours/personCountList",
          delete: "/bus/busApplyDateCfg/delete",
          deleteBatch: "/bus/busApplyDateCfg/deleteBatch",
          exportXlsUrl: "/bus/countWorkHours/exportPersonCountList",
          importExcelUrl: "bus/busApplyDateCfg/importExcel",
          getProject:'/bus/busProject/getHomeMyNoticeInfo',
        },
        proOptions:[],
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
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
        console.log(params,'params')
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
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'type',text:'类型',dictCode:''})
        fieldList.push({type:'date',value:'beginDate',text:'开始时间'})
        fieldList.push({type:'date',value:'endDate',text:'一季度开始时间'})
        fieldList.push({type:'int',value:'isUsing',text:'是否开启（0关闭，1开启）',dictCode:'open_config'})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'date',value:'createTime',text:'创建时间'})
        fieldList.push({type:'string',value:'updateBy',text:'修改人',dictCode:''})
        fieldList.push({type:'date',value:'updateTime',text:'修改时间'})
        this.superFieldList = fieldList
      },
      //追踪
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