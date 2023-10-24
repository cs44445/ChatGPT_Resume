<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="20" :lg="20" :md="20" :sm="24">
            <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="分类">
              <j-dict-select-tag placeholder="请输入分类" v-model="queryParam.classification" dictCode="dict_classification" class="tablePageQueryCss"></j-dict-select-tag>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="提示词">
              <j-input placeholder="请输入提示词" v-model="queryParam.prompt" class="tablePageQueryCss"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="提出人">
                <j-input placeholder="请输入提出人" v-model="queryParam.promptPeople" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="可行性">
                <j-dict-select-tag placeholder="请输入可行性" v-model="queryParam.feasibility" dictCode="dict_feasibility" class="tablePageQueryCss"></j-dict-select-tag>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button @click="searchQuery" icon="search" class="btnCss">查询</a-button>
              <a-button @click="searchReset" icon="reload"  class="btnCss" style="margin-left: 8px">重置</a-button>
              <span @click="handleToggleSearch" style="margin-left: 8px;padding: 5px 8px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 10px;">
                
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </span>
            </span>
          </a-col>
        </a-row>
        </a-col>
        <a-col :xl="4" :lg="4" :md="4" :sm="24" style="text-align: right;">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      
      <!--<a-button type="primary" icon="download" @click="handleExportXls('提示词库')">导出</a-button>
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

        <span slot="action" slot-scope="text, record">
          <span @click="handleEdit(record)"><a-icon
            type="edit" class="activeLogoCss" /></span>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link"> <img src="~@/assets/more.png" alt="logo" class="activeLogoCss"> </a>
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

    <bus-project-prompts-modal ref="modalForm" @ok="modalFormOk"></bus-project-prompts-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusProjectPromptsModal from './modules/BusProjectPromptsModal'

  export default {
    name: 'BusProjectPromptsListChild',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusProjectPromptsModal
    },
    data () {
      return {
        description: '提示词库管理页面',
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
            title:'提示词',
            align:"left",
            dataIndex: 'prompt'
          },
          {
            title:'分类',
            align:"left",
            dataIndex: 'classification_dictText'
          },
          {
            title:'说明',
            align:"left",
            dataIndex: 'illustrate'
          },
          {
            title:'提出人',
            align:"left",
            dataIndex: 'promptPeople'
          },
          {
            title:'可行性',
            align:"left",
            dataIndex: 'feasibility_dictText'
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
          list: "/bus/busProjectPrompts/list",
          delete: "/bus/busProjectPrompts/delete",
          deleteBatch: "/bus/busProjectPrompts/deleteBatch",
          exportXlsUrl: "/bus/busProjectPrompts/exportXls",
          importExcelUrl: "bus/busProjectPrompts/importExcel",
          
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
        fieldList.push({type:'string',value:'classification',text:'分类',dictCode:''})
        fieldList.push({type:'string',value:'illustrate',text:'说明',dictCode:''})
        fieldList.push({type:'string',value:'prompt',text:'提示词',dictCode:''})
        fieldList.push({type:'string',value:'promptPeople',text:'提出人',dictCode:''})
        fieldList.push({type:'string',value:'feasibility',text:'可行性',dictCode:''})
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
.activeLogoCss:hover {
  cursor: pointer;
}
</style>
