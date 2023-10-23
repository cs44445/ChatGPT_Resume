<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" style="float: right;">新增</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('流程配置')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="small"
       
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        
        :customRow="clickThenSelect"
        @change="handleTableChange">
<!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type:'radio'}" -->
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
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <img src="~@/assets/del.png" class="activeLogoCss" alt="logo">
          </a-popconfirm>
          <!-- <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="配置明细" key="1" >
        <FlowProcTaskConfigdList :mainId="selectedMainId" />
      </a-tab-pane>
    </a-tabs>

    <flowProcTaskConfig-modal ref="modalForm" @ok="modalFormOk"></flowProcTaskConfig-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlowProcTaskConfigModal from './modules/FlowProcTaskConfigModal'
  import { getAction } from '@/api/manage'
  import FlowProcTaskConfigdList from './FlowProcTaskConfigdList'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "FlowProcTaskConfigList",
    mixins:[JeecgListMixin],
    components: {
      FlowProcTaskConfigdList,
      FlowProcTaskConfigModal
    },
    data () {
      return {
        description: '流程配置管理页面',
        // 表头
        columns: [
          {
            title:'业务编号',
            sorter: true,
            dataIndex: 'busiNo'
          },
          {
            title:'流程id',
            dataIndex: 'procDefId'
          },
          {
            title:'流程key',
            dataIndex: 'procDefKey'
          },
          {
            title:'流程名称',
            dataIndex: 'procDefKeyName'
          },
          {
            title:'低版本隐藏',
            dataIndex: 'isVer',
            customRender: (text) => {
              let re = ''
              if (text === '0') {
                re = '否'
              } else if (text === '1') {
                re = '隐藏'
              }
              return re
            }
          },
          {
            title:'版本号',
            dataIndex: 'ver'
          },
          // {
          //   title:'创建者',
          //   align:"center",
          //   dataIndex: 'createBy'
          // },
          {
            title:'创建时间',
            dataIndex: 'createTime'
          },
          // {
          //   title:'备注信息',
          //   align:"center",
          //   dataIndex: 'remarks'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/api/flowProcTaskConfig/list",
          delete: "/api/flowProcTaskConfig/delete",
          deleteBatch: "/api/flowProcTaskConfig/deleteBatch",
          exportXlsUrl: "/api/flowProcTaskConfig/exportXls",
          importExcelUrl: "api/flowProcTaskConfig/importExcel",
        },
        dictOptions:{
        },
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '50'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        selectedMainId:'',
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      clickThenSelect(record) {
        return {
          on: {
            click: () => {
              this.onSelectChange(record.id.split(","), [record]);
            }
          }
        }
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
        this.selectedMainId=''
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedMainId=selectedRowKeys[0]
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      loadData(arg) {
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.onClearSelected()
        var params = this.getQueryParams();//查询条件
        this.loading = true;
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'busiNo',text:'业务编号',dictCode:''})
        fieldList.push({type:'string',value:'procDefId',text:'流程定义的id',dictCode:''})
        fieldList.push({type:'string',value:'procDefKey',text:'流程定义的key',dictCode:''})
        fieldList.push({type:'string',value:'procDefKeyName',text:'流程定义的名称',dictCode:''})
        fieldList.push({type:'int',value:'isVer',text:'低版本隐藏0否1隐藏',dictCode:''})
        fieldList.push({type:'int',value:'ver',text:'版本号',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建者',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        fieldList.push({type:'string',value:'remarks',text:'备注信息',dictCode:''})
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