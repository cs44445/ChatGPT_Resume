<template>
  <div class="cust-container2">
    <a-card :bordered="false" class="cust-style">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="数据模块">
                <a-input placeholder="请输入数据模块" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="操作类型">
                <j-dict-select-tag placeholder="请选择操作类型" v-model="queryParam.type" dictCode="export_type"/>
              </a-form-item>
            </a-col>
            <template v-if="toggleSearchStatus">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="用户名">
                  <a-input placeholder="请输入用户名" v-model="queryParam.userName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择创建时间" v-model="queryParam.createTime"></j-date>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="成功数量">
                  <a-input placeholder="请输入成功数量" v-model="queryParam.successNum"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="失败数量">
                  <a-input placeholder="请输入失败数量" v-model="queryParam.failNum"></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="状态">
                  <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.status" dictCode="export_status"/>
                </a-form-item>
              </a-col>
            </template>
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                <a @click="handleToggleSearch" style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </a>
              </a-col>
            </span>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->


      <!-- table区域-begin -->
      <div class="pri-content">

        <!-- 操作按钮区域 -->
        <!-- <div class="table-operator"> -->
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <a-button type="primary" icon="download" @click="handleExportXls('sys_import_export_log')">导出</a-button>
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
        <!-- </div> -->
        <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 30px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div> -->

        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true}"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">

          <!-- <template slot="htmlSlot" slot-scope="text">
            <div v-html="text"></div>
          </template> -->
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

          <!-- <span slot="action" slot-scope="text, record">
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
          </span> -->

          <span slot="operationtype" slot-scope="text, record">
            <span v-if="record.type == 1">导入</span>
            <span v-else-if="record.type == 2">导出</span>
          </span>

          <span slot="statusslot" slot-scope="text, record">
            <span v-if="record.status == 1">完成</span>
            <span v-else-if="record.status == 2">进行中</span>
            <span v-else-if="record.status == 3">终止</span>
          </span>

        </a-table>
      </div>

      <sys-import-export-log-modal ref="modalForm" @ok="modalFormOk"></sys-import-export-log-modal>
    </a-card>
  </div>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SysImportExportLogModal from './modules/SysImportExportLogModal'

export default {
  name: 'SysImportExportLogList',
  mixins:[JeecgListMixin, mixinDevice],
  components: {
    SysImportExportLogModal
  },
  data () {
    return {
      description: 'sys_import_export_log管理页面',
      // 表头
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key:'rowIndex',
        //   width:60,
        //   align: 'left',
        //   customRender:function (t,r,index) {
        //     return parseInt(index)+1;
        //   }
        // },
        {
          title:'数据模块',
          align: 'left',
          dataIndex: 'name'
        },
        {
          title:'操作类型',//1导入，2导出
          align: 'left',
          dataIndex: 'type',
          scopedSlots: { customRender: 'operationtype' }
        },
        {
          title:'用户名',
          align: 'left',
          dataIndex: 'userName'
        },
        {
          title:'成功数量',
          align: 'left',
          dataIndex: 'successNum'
        },
        {
          title:'失败数量',
          align: 'left',
          dataIndex: 'failNum'
        },
        {
          title:'状态',//1完成，2进行中，3终止
          align: 'left',
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusslot' }
        },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'left',
        //   fixed:"right",
        //   width:147,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: "/system/sysImportExportLog/list",
        delete: "/system/sysImportExportLog/delete",
        deleteBatch: "/system/sysImportExportLog/deleteBatch",
        exportXlsUrl: "/system/sysImportExportLog/exportXls",
        importExcelUrl: "/system/sysImportExportLog/importExcel",

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
      fieldList.push({type:'string',value:'name',text:'数据模块'})
      fieldList.push({type:'string',value:'type',text:'操作类型（1导入，2导出）'})
      fieldList.push({type:'string',value:'userName',text:'用户名'})
      fieldList.push({type:'int',value:'successNum',text:'成功数量'})
      fieldList.push({type:'int',value:'failNum',text:'失败数量'})
      fieldList.push({type:'string',value:'status',text:'状态（1完成，2进行中，3终止）'})
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
.layout .ant-card{
  margin-top:0;
  padding:0;
}
@import '~@assets/less/common.less';
</style>