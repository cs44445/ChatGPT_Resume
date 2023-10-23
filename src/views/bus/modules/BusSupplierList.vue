<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="">
                <j-input placeholder="请输入供应商名称" v-model="queryParam.name" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="">
                <j-input placeholder="请输入社会统一信用代码" v-model="queryParam.creditNo" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-dict-select-tag v-model="queryParam.organizeType" placeholder="请输入组织类型" dictCode="organize_type" type="list" class="tablePageQueryCss"></j-dict-select-tag>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <a-cascader change-on-select v-model="queryParam.industry" :options="industryOptions" placeholder="请选择行业" class="tablePageQueryCss"/>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-dict-select-tag v-model="queryParam.type" placeholder="请选择企业类型" dictCode="econ_type" type="list" class="tablePageQueryCss"></j-dict-select-tag>
                </a-form-item>
              </a-col>

              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入成立日期" v-model="queryParam.startDate" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-input placeholder="请输入企业法定代表人" v-model="queryParam.operName" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>

              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="">
                  <j-dict-select-tag v-model="queryParam.district" placeholder="请选择地区" dictCode="area_code" type="list" class="tablePageQueryCss"></j-dict-select-tag>
                </a-form-item>
              </a-col>
            </template>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">查询</a-button>
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
          <a-button type="primary" @click="handleAdd">
          新增
          </a-button>
      </div>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('企业')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->

       <!-- v-if="selectedRowKeys.length > 0" -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <!-- <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button> -->
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
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

        <template slot="companyName" slot-scope="text,record">
          <a v-if="home" @click="toDetail(record.id)">{{ text }}</a>
          <a v-else @click="handleDetail(record)">{{ text }}</a>
        </template>
        
        <span slot="action" slot-scope="text, record" class="fix-action">
          <!-- <span @click="handleEdit(record)" v-has="'user:edit'"><a-icon type="edit" class="activeLogoCss"/></span> -->
          <!-- <a @click="handleEdit(record)"><a-icon type="edit"/> 编辑</a> -->
          <a-dropdown>
            <span class="ant-dropdown-link">
              <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a v-if="home" @click="toDetail(record.id)">详情</a>
                <a v-else @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="resetPassword(record.id)">重置密码</a>
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

    <bus-company-modal ref="modalForm" @ok="modalFormOk"></bus-company-modal>
  </a-card>
</template>

<script>
  import '@/assets/less/TableExpand.less'
  import { postAction, getAction } from '@/api/manage'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusCompanyModal from './BusCompanyModal'

  export default {
    name: 'BusSupplierList',
    props:['home'],
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusCompanyModal
    },
    data () {
      return {
        description: '企业管理页面',
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
            title:'供应商名称',
            align:"left",
            sorter: true,
            dataIndex: 'name',
            slots: { title: 'companyName' },
            scopedSlots: { customRender: 'companyName' },
          },
          {
            title:'供应商编码',
            align:"left",
            sorter: true,
            dataIndex: 'companyCode',
            slots: { title: 'companyName' },
            scopedSlots: { customRender: 'companyName' },
          },
          {
            title:'社会统一信用代码',
            align:"left",
            sorter: true,
            dataIndex: 'creditNo'
          },
          {
            title:'组织类型',
            align:"left",
            sorter: true,
            dataIndex: 'organizeType_dictText',
          },

          {
            title:'行业',
            align:"left",
            sorter: true,
            dataIndex: 'industryText'//暂无
          },
          {
            title:'企业类型',
            align:"left",
            sorter: true,
            dataIndex: 'type_dictText',//暂无
          },


          {
            title:'成立日期',
            align:"left",
            sorter: true,
            dataIndex: 'startDate'
          },
          {
            title:'企业法定代表人',
            align:"left",
            sorter: true,
            dataIndex: 'operName'
          },

          {
            title:'地区',
            align:"left",
            sorter: true,
            dataIndex: 'district_dictText'
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
          list: "/bus/busCompany/list",
          delete: "/bus/busCompany/delete",
          // deleteBatch: "/bus/busCompany/deleteBatch",
          // exportXlsUrl: "/bus/busCompany/exportXls",
          // importExcelUrl: "bus/busCompany/importExcel",
          getAllIndustryData: '/bus/busIndustry/listHierarchy',
          resetPassword:'/sys/user/resetPasswordBatch'

        },
        dictOptions:{},
        superFieldList:[],
        industryOptions: [], //行业数据
        dataSource:[],
        home:''
      }
    },
    created() {
      // this.getSuperFieldList();
    },
    computed: {
      // importExcelUrl: function(){
      //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      // },
    },
    watch:{
      home(newVal) {
        if (newVal) {
          this.home = newVal
        }
      }
    },
    mounted(){
      this.initIndustryOptions()
    },
    methods: {
      searchQuery(){
        let oldIndustry;
        if(this.queryParam.industry){
          oldIndustry =  this.queryParam.industry
          this.queryParam.industry = this.queryParam.industry.join(',');
        }
        this.loadData(1);
        if(this.queryParam.industry){
          this.queryParam.industry = oldIndustry
        }
      },
      //初始化行业
      initIndustryOptions(){
        let that = this;
        getAction(that.url.getAllIndustryData).then((res)=>{
          if(res.success){
            that.industryOptions = res.result
          }
        })
      },
      initDictConfig(){
      },
      // getSuperFieldList(){
      //   let fieldList=[];
      //   fieldList.push({type:'string',value:'name',text:'企业名称',dictCode:''})
      //   fieldList.push({type:'string',value:'startDate',text:'成立日期',dictCode:''})
      //   fieldList.push({type:'string',value:'operName',text:'企业法定代表人',dictCode:''})
      //   fieldList.push({type:'string',value:'creditNo',text:'社会统一信用代码',dictCode:''})
      //   fieldList.push({type:'string',value:'regNo',text:'工商注册号',dictCode:''})
      //   fieldList.push({type:'string',value:'type',text:'企业类型',dictCode:''})
      //   fieldList.push({type:'string',value:'sourceId',text:'来源id',dictCode:''})
      //   fieldList.push({type:'Text',value:'matchItems',text:'匹配关键字(高级搜索存json)',dictCode:''})
      //   fieldList.push({type:'string',value:'matchType',text:'匹配类型',dictCode:''})
      //   fieldList.push({type:'string',value:'categoryNew',text:'新分类',dictCode:''})
      //   fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
      //   fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
      //   fieldList.push({type:'date',value:'createTime',text:'创建时间'})
      //   fieldList.push({type:'string',value:'delFlag',text:'删除状态（0，正常，1已删除）',dictCode:''})
      //   fieldList.push({type:'string',value:'registCapiDesc',text:'注册资本',dictCode:''})
      //   fieldList.push({type:'string',value:'searchType',text:'搜索类型（1普通搜索，2高级搜索）',dictCode:''})
      //   fieldList.push({type:'Text',value:'searchCondition',text:'查询条件',dictCode:''})
      //   fieldList.push({type:'string',value:'status',text:'存续（在营、开业、在册）',dictCode:''})
      //   fieldList.push({type:'string',value:'industry',text:'行业',dictCode:''})
      //   fieldList.push({type:'string',value:'organizeType',text:'组织类型',dictCode:''})
      //   fieldList.push({type:'string',value:'district',text:'地区',dictCode:''})
      //   this.superFieldList = fieldList
      // },
      initList(){
        getAction(this.url.list).then(res => {
          this.dataSource = res.result.records;
        })
      },
      modalFormOk(){
        this.initList()
      },
      toDetail(id){
        this.$router.push({ path: '/bus/supplierDetails',query: { projectId: id  } })
      },
      resetPassword(id){
        postAction(this.url.resetPassword,{userId:id}).then(res => {
          if(res.success){
            this.$message.success(res.message);
            this.initList()
          }
        })
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