<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="请输入角色名称" v-model="queryParam.roleName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
                <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </a> -->
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <!--<a-button type="primary" icon="download" @click="handleExportXls('bus_plan_labor_cost_role')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>-->
        <!-- 高级查询区域 -->
        <!--<j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
        </a-dropdown>-->

      </div>
    </div>
    <!-- 查询区域-END -->

    

    <!-- table区域-begin -->
    <div>
     <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

     <!-- bordered这是表格的边框属性
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"这是复选框属性 -->
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

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleEdit(record)"><a-icon
            type="edit" class="activeLogoCss" /></span>
          <a-dropdown>
            <span class="ant-dropdown-link">
              <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
            </span>
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
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <bus-plan-labor-cost-role-modal ref="modalForm" @ok="modalFormOk"></bus-plan-labor-cost-role-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusPlanLaborCostRoleModal from './modules/BusPlanLaborCostRoleModal'

  export default {
    name: 'BusPlanLaborCostRoleList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusPlanLaborCostRoleModal
    },
    data () {
      return {
        description: 'bus_plan_labor_cost_role管理页面',
        // 表头
        columns: [
         // {
         //  title: '#',
         //   dataIndex: '',
         //   key:'rowIndex',
         //   width:60,
         //   align:"center",
         //   customRender:function (t,r,index) {
         //     return parseInt(index)+1;
         //   }
         // },
          {
            title:'角色名称',
            align:"left",
            dataIndex: 'roleName'
          },
          {
            title:'标准人力成本',
            align:"left",
            dataIndex: 'slr'
          },
          {
            title:'备注',
            align:"left",
            dataIndex: 'remark',
            scopedSlots: {customRender: 'htmlSlot'}
          },
          {
            title:'创建人',
            align:"left",
            dataIndex: 'createBy_dictText'
          },
          {
            title:'创建时间',
            align:"left",
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/bus/busPlanLaborCostRole/list",
          delete: "/bus/busPlanLaborCostRole/delete",
          deleteBatch: "/bus/busPlanLaborCostRole/deleteBatch",
          exportXlsUrl: "/bus/busPlanLaborCostRole/exportXls",
          importExcelUrl: "bus/busPlanLaborCostRole/importExcel",

        },
        dictOptions:{},
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
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'roleName',text:'角色名称',dictCode:''})
        fieldList.push({type:'string',value:'slr',text:'标准人力成本',dictCode:''})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        this.superFieldList = fieldList
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
