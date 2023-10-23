<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="">
                <j-input placeholder="请输入客户编码" v-model="queryParam.companyCode" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="">
                <j-input placeholder="请输入客户名称" v-model="queryParam.companyName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入姓名" v-model="queryParam.name" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <a-select placeholder="请选择姓别" v-model="queryParam.sex" class="tablePageQueryCss">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="2">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入职务" v-model="queryParam.job" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入手机号码" v-model="queryParam.phone" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入座机号码" v-model="queryParam.landline" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入邮箱" v-model="queryParam.email" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="search()" icon="search" class="btnCss">查询</a-button>
                <a-button @click="reset()" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
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
          <a-button type="primary" @click="handleAdd">
          新增
          </a-button>
      </div>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('联系人')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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
        <template slot="districtName" slot-scope="text, record">
          <a @click="handleDetail(record,'detail')">{{ text }}</a>
        </template>
        <template slot="customCode" slot-scope="text, record">
          <a @click="handleEnterpriseDetail(record)">{{record.customCode}}</a>
        </template>
        <template slot="customName" slot-scope="text, record">
          <a @click="handleEnterpriseDetail(record)">{{record.customName}}</a>
        </template>

        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleEdit(record)" v-has="'user:edit'"><a-icon type="edit" class="activeLogoCss"/></span>
          <!-- <a @click="handleEdit(record)"><a-icon type="edit"/> 编辑</a> -->

          <a-dropdown>
            <span class="ant-dropdown-link">
              <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record,'detail')">详情</a>
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

    <bus-person-modal ref="modalForm" @ok="modalFormOk" :type="queryParam.type"></bus-person-modal>
    <bus-company-modal ref="enterpriseModal"></bus-company-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusPersonModal from './BusPersonModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import BusCompanyModal from './BusCompanyModal'
  import {getAction } from '@/api/manage'
  export default {
    name: 'BusPersonList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusPersonModal,
      BusCompanyModal
    },
    data () {
      return {
        description: '联系人管理页面',
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
            title:'客户编码',
            align:"left",
            sorter: true,
            dataIndex: 'customCode',
            scopedSlots: {customRender: 'customCode'}
          },
          {
            title:'客户名称',
            align:"left",
            sorter: true,
            dataIndex: 'customName',
            scopedSlots: {customRender: 'customName'}
          },
          {
            title:'姓名',
            align:"left",
            sorter: true,
            dataIndex: 'name',
            scopedSlots: {customRender: 'districtName'}
          },
          {
            title:'性别',
            align:"left",
            sorter: true,
            dataIndex: 'sex_dictText',
          },
          {
            title:'职务',
            align:"left",
            sorter: true,
            dataIndex: 'job'
          },
          {
            title:'手机号码',
            align:"left",
            sorter: true,
            dataIndex: 'phone'
          },
          {
            title:'座机号码',
            align:"left",
            sorter: true,
            dataIndex: 'landline'
          },
          {
            title:'邮箱地址',
            align:"left",
            sorter: true,
            dataIndex: 'email'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            // fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/bus/busPerson/list",
          delete: "/bus/busPerson/delete",
          deleteBatch: "/bus/busPerson/deleteBatch",
          exportXlsUrl: "/bus/busPerson/exportXls",
          importExcelUrl: "bus/busPerson/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
        queryParam:{
          type:'2',
          companyCode:'',
          companyName:'',
          name:'',
          sex:'',
          job:'',
          phone:'',
          landline:'',
          email:''

        }
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
      handleEnterpriseDetail(record){
        getAction("/bus/busCompany/queryById",{id:record.companyId}).then(res=>{
          this.$refs.enterpriseModal.edit(res.result);
        })
        this.$refs.enterpriseModal.title="详情";
        this.$refs.enterpriseModal.disableSubmit = true;
        this.$refs.enterpriseModal.visible=true
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'name',text:'姓名',dictCode:''})
        fieldList.push({type:'string',value:'companyId',text:'企业/外部单位',dictCode:'bus_company,name,id'})
        fieldList.push({type:'string',value:'job',text:'职务',dictCode:''})
        fieldList.push({type:'string',value:'phone',text:'电话',dictCode:''})
        fieldList.push({type:'string',value:'email',text:'邮箱',dictCode:''})
        fieldList.push({type:'string',value:'address',text:'地址',dictCode:''})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        this.superFieldList = fieldList
      },
      search(){
        getAction(this.url.list,this.queryParam).then(res=>{
          if(res.success){
            this.dataSource = res.result.records
          }

        })
      },
      reset(){
        this.queryParam={
          type:'2',
          companyCode:'',
          companyName:'',
          name:'',
          sex:'',
          job:'',
          phone:'',
          landline:'',
          email:''
        }
        this.search()
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>