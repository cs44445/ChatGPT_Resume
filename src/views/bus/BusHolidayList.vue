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
      <!--<a-button type="primary" icon="download" @click="handleExportXls('法定节假日')">导出</a-button>
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

        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleEdit(record)">
            <a-icon type="edit" class="activeLogoCss"/>
          </span>
          <a-dropdown>
            <span class="ant-dropdown-link"><img src="~@/assets/more.png" alt="logo" class="activeLogoCss"></span>
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

    <bus-holiday-modal ref="modalForm" @ok="modalFormOk"></bus-holiday-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusHolidayModal from './modules/BusHolidayModal'

  export default {
    name: 'BusHolidayList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusHolidayModal
    },
    data () {
      return {
        description: '法定节假日管理页面',
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
            title:'名称',
            align:"left",
            dataIndex: 'name',
          },
          {
            title:'是否节假日',
            align:"left",
            dataIndex: 'holiday',
            customRender:function (text) {
              return text=='true' ? "是" : '否'
            }
          },
          {
            title:'日期',
            align:"left",
            dataIndex: 'date',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          // {
          //   title:'是否删除',
          //   align:"left",
          //   dataIndex: 'delFlag',
          // },
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
          list: "/bus/busHoliday/list",
          delete: "/bus/busHoliday/delete",
          deleteBatch: "/bus/busHoliday/deleteBatch",
          exportXlsUrl: "/bus/busHoliday/exportXls",
          importExcelUrl: "bus/busHoliday/importExcel",
          
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
        fieldList.push({type:'string',value:'holiday',text:'是否节假日',dictCode:''})
        fieldList.push({type:'string',value:'name',text:'名称',dictCode:''})
        fieldList.push({type:'date',value:'date',text:'日期'})
        fieldList.push({type:'string',value:'delFlag',text:'是否删除',dictCode:''})
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
