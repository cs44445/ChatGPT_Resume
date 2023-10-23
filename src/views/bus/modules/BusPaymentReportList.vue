<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <a-form layout="inline" @keyup.enter.native="searchQuery"  style="width: 90%;">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="供应商">
              <j-input placeholder="请输入供应商" v-model="queryParam.companyId" class="tablePageQueryCss" allowClear></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="项目">
              <j-input placeholder="请输入项目" v-model="queryParam.projectId" class="tablePageQueryCss"></j-input>
            </a-form-item>
          </a-col>
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="时间范围">
                  <a-range-picker @change="onChange"  class="tablePageQueryCss"/>
              </a-form-item>
            </a-col> -->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <div class="table-operator">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      </div>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
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
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <bus-payment-report-modal ref="modalForm" @ok="modalFormOk"></bus-payment-report-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusPaymentReportModal from './BusPaymentReportModal'

  export default {
    name: 'BusPaymentReportList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusPaymentReportModal
    },
    data () {
      return {
        description: 'bus_payment_report管理页面',
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
            title:'供应商',
            align:"left",
            dataIndex: 'companyName'
          },
          {
            title:'项目',
            align:"left",
            dataIndex: 'projectName'
          },
          {
            title:'开始时间',
            align:"left",
            dataIndex: 'startTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'结束时间',
            align:"left",
            dataIndex: 'endTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'备注',
            align:"left",
            dataIndex: 'remark'
          },
          // {
          //   title:'删除状态（0，正常，1已删除）',
          //   align:"left",
          //   dataIndex: 'delFlag'
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
          list: "/bus/busPaymentReport/list",
          delete: "/bus/busPaymentReport/delete",
          deleteBatch: "/bus/busPaymentReport/deleteBatch",
          exportXlsUrl: "/bus/busPaymentReport/exportXls",
          importExcelUrl: "bus/busPaymentReport/importExcel",
          
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
        fieldList.push({type:'string',value:'companyId',text:'供应商id'})
        fieldList.push({type:'string',value:'projectId',text:'项目id'})
        fieldList.push({type:'date',value:'startTime',text:'开始时间'})
        fieldList.push({type:'date',value:'endTime',text:'结束时间'})
        fieldList.push({type:'string',value:'remark',text:'备注'})
        fieldList.push({type:'string',value:'delFlag',text:'删除状态（0，正常，1已删除）'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
@import '~@assets/css/common.css';
  @import '~@assets/less/common.less';
  
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
