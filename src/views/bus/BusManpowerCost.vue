<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
      <!-- <a-form layout="inline" @keyup.enter.native="searchQuery"> -->
        <a-row :gutter="24">
          <a-col :xl="6">
            <a-form-item label="">
              <j-input placeholder="模版编号" v-model="queryParam.templateNum" class="tablePageQueryCss"></j-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6">
            <a-form-item label="">
              <j-input placeholder="模板名称" v-model="queryParam.templateName" class="tablePageQueryCss"></j-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6">
              <a-form-item label="">
                <a-select v-model="queryParam.ifOpen" placeholder="是否启用" style="width: 100%;" class="tablePageQueryCss">
                  <a-select-option value="1">启用</a-select-option>
                  <a-select-option value="0">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6">
              <a-form-item label="">
                <j-input placeholder="备注" v-model="queryParam.remark" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button  @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button  @click="searchReset" icon="reload" style="margin-left: 8px;" class="btnCss">重置</a-button>
                <div @click="handleToggleSearch" style="margin-left: 8px;padding: 8px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 10px;">
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </div>
              </div>
            </a-col>
        </a-row>
      </div>
      <!-- </a-form> -->
      <!-- 查询区域-END -->

      <!-- 操作按钮区域 -->
      <div style="display: flex;">
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
        <a-button type="primary" icon="download" @click="handleDowunloadTemplate()" v-has="'laborCost:edit'" style="margin-right: 10px;">下载模版</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import" v-has="'laborCost:edit'">导入</a-button>
        </a-upload>
        <!-- <a-dropdown placement="bottomRight">
          <div class=""  style="width: 30px;height: 30px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 30px;">
            <img src="~@/assets/more.png" alt="logo" 
            >
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
      </div>
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
        <template slot="ifOpen" slot-scope="text">
          <a-tag v-if='text==1' style="width:52px;text-align:center" color="green">启用</a-tag>
          <a-tag v-if='text==0' style="width:52px;text-align:center" color="red" >停用</a-tag>
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
          <span @click="handleEdit(record)" v-has="'laborCost:edit'"><a-icon type="edit" class="activeLogoCss" /></span>
          <a-dropdown>
            <span class="ant-dropdown-link" ><img src="~@/assets/more.png" alt="logo" class="activeLogoCss"></span>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.ifOpen==1">
                <a-popconfirm v-has="'laborCost:edit'"  :title="'确定停用吗?'" @confirm="() => handleClose(record.id)">
                  <a>停用</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.ifOpen==0">
                <a-popconfirm v-has="'laborCost:edit'"  :title="'确定启用吗?'" @confirm="() => handleOpen(record.id)">
                  <a>启用</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleDetailedDetail(record)">详细配置</a>
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
    <bus-manpower-cost-modal ref="modalForm" @ok="modalFormOk"></bus-manpower-cost-modal>
    <bus-detailed-configuration-modal ref="modaldetailedForm"></bus-detailed-configuration-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusManpowerCostModal from './modules/BusManpowerCostModal'
  import BusDetailedConfigurationModal from './modules/BusDetailedConfigurationModal'
  import { getAction,putAction } from '@/api/manage'
  export default {
    name: 'BusManpowerCost',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusManpowerCostModal,
      BusDetailedConfigurationModal
    },
    data () {
      return {
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
            title:'模板编号',
            align:"left",
            dataIndex: 'templateNum'
          },
          {
            title:'模板名称',
            align:"left",
            dataIndex: 'templateName'
          },
          {
            title:'是否启用',
            align:"left",
            dataIndex: 'ifOpen',
            scopedSlots: { customRender: 'ifOpen' }
          },
          {
            title:'启动时间',
            align:"left",
            dataIndex: 'openTime'
          },
          {
            title:'停用时间',
            align:"left",
            dataIndex: 'closeTime'
          },
          {
            title:'备注',
            align:"left",
            dataIndex: 'remark'
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
          list: "/bus/busLaborCostTemp/list",
          delete: "/bus/busLaborCostTemp/delete",
          deleteBatch: "/bus/busLaborCostTemp/deleteBatch",
          exportXlsUrl: "/bus/busLaborCostTemp/exportXls",
          importExcelUrl: "bus/busLaborCostTemp/importExcel",
          openTemp:'/bus/busLaborCostTemp/openTemp',
          closeTemp:'/bus/busLaborCostTemp/closeTemp',
          downloadTemplate:"bus/busLaborCostTemp/downloadTemplate"
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
    props: {
      setType: {
        type: String
      }
    },
    watch: {
      setType: function() {
        this.loadData2(1, this.setType)
      }
    },
    methods: {
      handleDowunloadTemplate(){
        getAction(this.url.downloadTemplate, {}).then(res => {
          if (res.success) {
            window.open(window._CONFIG['staticDomainURL'] + "/" + res.result.fileUrl);
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      handleClose(id) {
        putAction(this.url.closeTemp,{id:id}).then((res)=>{
          if (res.success) {
            this.$message.success(res.message)
            this.loadData2(1, this.setType)
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      handleOpen(id) {
        putAction(this.url.openTemp,{id:id}).then((res)=>{
          if (res.success) {
            this.$message.success(res.message)
            this.loadData2(1, this.setType)
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      loadData2(arg, setType) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams() //查询条件
        params.cityType = this.setType
        this.loading = true
        getAction(this.url.list, params).then(res => {
          if (res.success) {
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result
            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'template',text:'模板名称',dictCode:''})
        fieldList.push({type:'string',value:'ordinaryOtSalaryRate',text:'普通加班工资系数',dictCode:''})
        fieldList.push({type:'string',value:'saturdayDayRate',text:'周六日加班工资系数',dictCode:''})
        fieldList.push({type:'string',value:'specialOtSalaryRate',text:'节假日加班工资系数',dictCode:''})
        fieldList.push({type:'string',value:'overTimeLimit',text:'加班工时上限',dictCode:''})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        this.superFieldList = fieldList
      },
      handleDetailedDetail(record){
        this.$refs.modaldetailedForm.edit(record)
        this.$refs.modaldetailedForm.title = '详细配置'
        this.$refs.modaldetailedForm.disableSubmit = false
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  @import '~@assets/css/common.css';
  .activeLogoCss:hover{
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