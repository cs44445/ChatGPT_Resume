<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->

    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="采购订单编码">
              <j-input placeholder="请输入采购订单编码" v-model="queryParam.procureOrderCode"></j-input>
            </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item label="供应商">
                <a-select v-model="queryParam.companyId" placeholder="请选择供应商">
                    <!-- <a-select-option value="">请选择</a-select-option> -->
                    <a-select-option v-for="(item, key) in companyList" :key="key" :value="item.id">{{item.name}}</a-select-option>
                   
                  </a-select>
              <!-- <j-input placeholder="请输入供应商id" v-model="queryParam.companyId"></j-input> -->
            </a-form-item>
            </a-col>

            <template v-if="toggleSearchStatus">
              <a-col :span="6">
                <a-form-item label="项目">
                  <a-select v-model="queryParam.projectId" placeholder="请选择项目">
                    <!-- <a-select-option value="">请选择</a-select-option> -->
                    <a-select-option v-for="(item, key) in projectList" :key="key" :value="item.id">{{item.projectName}}</a-select-option>
                   
                  </a-select>
                <!-- <j-input placeholder="请输入项目id" v-model="queryParam.projectId"></j-input> -->
              </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="成本类型">
                <j-dict-select-tag v-model="queryParam.costType" placeholder="请选择成本类型" dictCode="cost_type" />
                <!-- <j-input placeholder="请输入成本类型" v-model="queryParam.costType"></j-input> -->
              </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item label="订单日期">
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择订单日期" v-model="queryParam.orderDate"></j-date>
              </a-form-item>
              </a-col>
            </template>

            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search"  class="btnCss">查询</a-button>
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
      <div>
          <a-button type="primary" @click="handleAdd(componyList,projectList)">
          新增
          </a-button>
      </div>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <!-- <a-button type="primary" icon="download" @click="handleDownloadTempl('用户信息')">下载模板</a-button>
        <a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:add'">添加用户</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>
        <j-third-app-button biz-type="user" :selected-row-keys="selectedRowKeys" syncToApp syncToLocal @sync-finally="onSyncFinally"/> -->
  <!--      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="delete" @click="batchDel"/>
              删除
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="lock" @click="batchFrozen('2')"/>
              冻结
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="unlock" @click="batchFrozen('1')"/>
              解冻
            </a-menu-item>

          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
  <!--      <j-super-query :fieldList="superQueryFieldList" @handleSuperQuery="handleSuperQuery"/>-->
      </div>
    
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('bus_company_po')">导出</a-button>
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

    <!-- </div> -->

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
          <span @click="handleEdit(record,componyList,projectList)" v-has="'user:edit'"><a-icon type="edit" class="activeLogoCss"/></span>
         

          <a-divider type="vertical" />
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

    <bus-company-po-modal ref="modalForm" :companyList="companyList" :projectList="projectList" @ok="modalFormOk"></bus-company-po-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusCompanyPoModal from './modules/BusCompanyPoModal'  
  import { getAction } from '@/api/manage'

  export default {
    name: 'BusCompanyPoList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusCompanyPoModal
    },
    data () {
      return {
        description: 'bus_company_po管理页面',
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
            title:'采购订单编码',
            align:"left",
            dataIndex: 'procureOrderCode'
          },
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
            title:'成本类型',
            align:"left",
            dataIndex: 'costType_dictText'
          },
          {
            title:'预估数量',
            align:"left",
            dataIndex: 'estimateNum'
          },
          {
            title:'价格',
            align:"left",
            dataIndex: 'price'
          },
          {
            title:'预估成本',
            align:"left",
            dataIndex: 'estimateCost'
          },
          {
            title:'订单日期',
            align:"left",
            dataIndex: 'orderDate'
          },
          {
            title:'订单状态',
            align:"left",
            dataIndex: 'orderStatus_dictText'
          },
          {
            title:'创建人',
            align:"left",
            dataIndex: 'createBy'
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
          list: "/bus/busCompanyPo/list",
          delete: "/bus/busCompanyPo/delete",
          deleteBatch: "/bus/busCompanyPo/deleteBatch",
          exportXlsUrl: "/bus/busCompanyPo/exportXls",
          importExcelUrl: "bus/busCompanyPo/importExcel",
          companyListUrl: '/bus/busCompany/list',
          projectListUrl: '/bus/busProject/list'
          
        },
        dictOptions:{},
        superFieldList:[],
        companyList:[],
        projectList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    this.getCompanyList()
    this.getprojectList()
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      getCompanyList() {
        getAction(this.url.companyListUrl).then((res) => {
            if (res.success) {   
              this.companyList = res.result.records
            }
          })
      },
      getprojectList() {
        getAction(this.url.projectListUrl).then((res) => {
            if (res.success) { 
              this.projectList = res.result.records
            }
          })
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'procureOrderCode',text:'采购订单编码',dictCode:''})
        fieldList.push({type:'string',value:'companyId',text:'供应商id',dictCode:''})
        fieldList.push({type:'string',value:'projectId',text:'项目id',dictCode:''})
        fieldList.push({type:'string',value:'costType',text:'成本类型',dictCode:''})
        fieldList.push({type:'int',value:'estimateNum',text:'预估数量',dictCode:''})
        fieldList.push({type:'double',value:'price',text:'价格',dictCode:''})
        fieldList.push({type:'double',value:'estimateCost',text:'预估成本',dictCode:''})
        fieldList.push({type:'datetime',value:'orderDate',text:'订单日期'})
        fieldList.push({type:'string',value:'orderStatus',text:'订单状态',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .activeLogoCss:hover {
  cursor: pointer;
}

</style>
