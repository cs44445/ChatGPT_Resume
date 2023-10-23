<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="请输入操作账号" v-model="queryParam.loginName" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="请输入操作人" v-model="queryParam.username" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :span="6">
                <a-form-item label="">
                  <j-input placeholder="请输入报错方法名" v-model="queryParam.postMethod" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="">
                  <j-input placeholder="请输入报错数据" v-model="queryParam.errorData" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="">
                  <j-input placeholder="请输入类名" v-model="queryParam.clazzName" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="">
                  <a-select v-model="queryParam.ifException" placeholder="请选择否是异常" class="tablePageQueryCss">
                    <!-- <a-select-option value="">请选择</a-select-option> -->
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                  </a-select>
                  <!-- <j-input placeholder="请输入是否是异常" v-model="queryParam.ifException"></j-input> -->
                </a-form-item>
              </a-col>
            </template>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
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
      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <a-button type="primary" icon="download" @click="handleExportXls('sys_debug_log')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload> -->
        <!-- 高级查询区域 -->
        <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
        </a-dropdown> -->
      </div>
    </div>
    <!-- 查询区域-END -->

    

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <span @click="handleDetail(record)" class="activeLogoCss">详情</span>

          <!-- <a-divider type="vertical" />
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
          </a-dropdown> -->
        </span>

      </a-table>
    </div>

    <sys-debug-log-modal ref="modalForm" @ok="modalFormOk"></sys-debug-log-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysDebugLogModal from './modules/SysDebugLogModal'

  export default {
    name: 'SysDebugLogList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      SysDebugLogModal
    },
    data () {
      return {
        description: 'sys_debug_log管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            // align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'操作账号',
            // align:"center",
            dataIndex: 'loginName'
          },
          {
            title:'操作人',
            // align:"center",
            dataIndex: 'username'
          },
          {
            title:'报错方法名',
            // align:"center",
            dataIndex: 'postMethod'
          },
          // {
          //   title:'报错数据',
          //   align:"center",
          //   dataIndex: 'errorData'
          // },
          {
            title:'类名',
            // align:"center",
            dataIndex: 'clazzName'
          },
          {
            title:'是否是异常',
            // align:"center",
            dataIndex: 'ifException',
            customRender:function (t) {
              if(t == 1)
              return t == 1 ? '是':'否';
            }
          },
          {
            title:'创建时间',
            // align:"center",
            dataIndex: 'createTime',
            // customRender:function (text) {
            //   return !text?"":(text.length>10?text.substr(0,10):text)
            // }
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
          list: "/bus/sysDebugLog/list",
          delete: "/bus/sysDebugLog/delete",
          deleteBatch: "/bus/sysDebugLog/deleteBatch",
          exportXlsUrl: "/bus/sysDebugLog/exportXls",
          importExcelUrl: "bus/sysDebugLog/importExcel",
          
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
        fieldList.push({type:'string',value:'loginName',text:'操作账号',dictCode:''})
        fieldList.push({type:'string',value:'username',text:'操作人',dictCode:''})
        fieldList.push({type:'string',value:'postMethod',text:'报错方法名',dictCode:''})
        fieldList.push({type:'Text',value:'errorData',text:'报错数据',dictCode:''})
        fieldList.push({type:'string',value:'clazzName',text:'类名',dictCode:''})
        fieldList.push({type:'string',value:'ifException',text:'是否是异常',dictCode:''})
        fieldList.push({type:'date',value:'createTime',text:'创建时间'})
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