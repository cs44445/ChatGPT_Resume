<template>
  <a-card :bordered="false" :class="'cust-erp-sub-tab'" style="background: #F7F8FA;">
    <!-- 操作按钮区域 -->
    <div class="table-operator" v-if="mainId">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('配置明细')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown> -->
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
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        
        @change="handleTableChange">
        <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->

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

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <!-- <a-divider type="vertical" /> -->
          <!-- <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm> -->
        </span>

      </a-table>
    </div>

    <flowProcTaskConfigd-modal ref="modalForm" @ok="modalFormOk" :mainId="mainId"></flowProcTaskConfigd-modal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlowProcTaskConfigdModal from './modules/FlowProcTaskConfigdModal'

  export default {
    name: "FlowProcTaskConfigdList",
    mixins:[JeecgListMixin],
    components: { FlowProcTaskConfigdModal },
    props:{
      mainId:{
        type:String,
        default:'',
        required:false
      }
    },
    watch:{
      mainId:{
        immediate: true,
        handler(val) {
          if(!this.mainId){
            this.clearList()
          }else{
            this.queryParam['configId'] = val
            this.loadData(1);
          }
        }
      }
    },
    data () {
      return {
        description: '流程配置管理页面',
        disableMixinCreated:true,
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          // },
          // {
          //   title:'流程编号',
          //   align:"center",
          //   dataIndex: 'configId'
          // },
          {
            title:'流程定义的key',
            // align:"left",
            dataIndex: 'taskDefKey'
          },
          {
            title:'表单链接',
            // align:"center",
            dataIndex: 'formUrl'
          },
          // {
          //   title:'备注信息',
          //   align:"center",
          //   dataIndex: 'remarks'
          // },
          // {
          //   title:'删除标记（0：正常；1：删除）',
          //   align:"center",
          //   dataIndex: 'delFlag'
          // },
          // {
          //   title:'机构id',
          //   align:"center",
          //   dataIndex: 'orgCode'
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
          list: "/api/flowProcTaskConfig/listFlowProcTaskConfigdByMainId",
          delete: "/api/flowProcTaskConfig/deleteFlowProcTaskConfigd",
          deleteBatch: "/api/flowProcTaskConfig/deleteBatchFlowProcTaskConfigd",
          exportXlsUrl: "/api/flowProcTaskConfig/exportFlowProcTaskConfigd",
          importUrl: "/api/flowProcTaskConfig/importFlowProcTaskConfigd",
        },
        dictOptions:{
        },
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importUrl}/${this.mainId}`;
      }
    },
    methods: {
      clearList(){
        this.dataSource=[]
        this.selectedRowKeys=[]
        this.ipagination.current = 1
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
