<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="请输入业务编号" v-model="queryParam.busiNo" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="请输入业务名称" v-model="queryParam.busiName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <!-- <template v-if="toggleSearchStatus"> -->
              <!-- <a-col :span="6">
                <a-form-item label="主题类型">
                  <a-input placeholder="请输入主题类型" v-model="queryParam.subjectType"></a-input>
                </a-form-item>
              </a-col> -->
            <!-- </template> -->
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
        <!-- <a-button type="primary" icon="download" @click="handleExportXls('flow_proc_busi')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload> -->
        <!-- 高级查询区域 -->
        <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
        </a-dropdown>
      </div>
    </div>
    <!-- 查询区域-END -->

    

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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

    <flow-proc-busi-modal ref="modalForm" @ok="modalFormOk"></flow-proc-busi-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FlowProcBusiModal from './modules/FlowProcBusiModal'

  export default {
    name: 'FlowProcBusiList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      FlowProcBusiModal
    },
    data () {
      return {
        description: 'flow_proc_busi管理页面',
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
          {
            title:'业务编号',
            dataIndex: 'busiNo'
          },
          {
            title:'业务名称',
            dataIndex: 'busiName'
          },
          {
            title:'主题类型',
            dataIndex: 'subjectType_dictText'
          },
          {
            title:'创建者',
            dataIndex: 'createBy_dictText'
          },
          {
            title:'创建时间',
            dataIndex: 'createTime'
          },
          // {
          //   title:'更新者',
          //   align:"center",
          //   dataIndex: 'updateBy_dictText'
          // },
          // {
          //   title:'更新时间',
          //   align:"center",
          //   dataIndex: 'updateTime'
          // },
          {
            title:'备注信息',
            dataIndex: 'remarks'
          },
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
            align: 'center',
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/api/flowProcBusi/list",
          delete: "/api/flowProcBusi/delete",
          deleteBatch: "/api/flowProcBusi/deleteBatch",
          exportXlsUrl: "/api/flowProcBusi/exportXls",
          importExcelUrl: "/api/flowProcBusi/importExcel",
          
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
        fieldList.push({type:'int',value:'busiNo',text:'业务编号',dictCode:''})
        fieldList.push({type:'string',value:'busiName',text:'业务名称',dictCode:''})
        fieldList.push({type:'string',value:'subjectType',text:'主题类型 流程名-日期',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建者',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        fieldList.push({type:'string',value:'updateBy',text:'更新者',dictCode:''})
        fieldList.push({type:'datetime',value:'updateTime',text:'更新时间'})
        fieldList.push({type:'string',value:'remarks',text:'备注信息',dictCode:''})
        fieldList.push({type:'string',value:'delFlag',text:'删除标记（0：正常；1：删除）',dictCode:''})
        fieldList.push({type:'string',value:'orgCode',text:'机构id',dictCode:''})
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