<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 左侧面板 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="12">
            <a-col :span="6">
              <a-form-item label="" :labelCol="{span: 6}" :wrapperCol="{span: 14, offset: 1}">
                <a-input placeholder="请输入流程KEY" v-model="queryParam.key" class="tablePageQueryCss"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="" :labelCol="{span: 6}" :wrapperCol="{span: 14, offset: 1}">
                <a-input placeholder="请输入流程名称" v-model="queryParam.name" class="tablePageQueryCss"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button
                  @click="searchReset"
                  icon="reload"
                  style="margin-left: 8px"
                  class="btnCss">重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div style="display: flex;gap:10px;">
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
        <a-button type="primary" icon="download" @click="handleExportXls('字典信息')">导出</a-button>-->
        <a-upload
          name="files"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          @change="handleImportExcel"
        >
          <a-button type="primary" icon="import">部署流程</a-button>
        </a-upload>

      </div>
    </div>
      <a-table
        ref="table"
        rowKey="id"
        size="small"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="deployment_id" slot-scope="text, record">
          <a-button type="primary" size="small" @click="lookImgs(text,record)">查看</a-button>
        </span>
        <span slot="action" slot-scope="text, record" class="fix-action">
          <!-- <a @click="handleEdit(record)">
            <a-icon type="edit"/>
            编辑
          </a>-->
          <span @click="handFlowConfig(record)">
            <a-icon type="setting" class="activeLogoCss" />流程配置
          </span>
          <a-popconfirm title="确定删除吗?" @confirm="() =>handleDelete(record)">
            <img src="~@/assets/del.png" class="activeLogoCss" alt="logo">
          </a-popconfirm>
        </span>
      </a-table>
      <a-modal :bodyStyle="{ padding: 0 }" :visible="lookImg" :footer="null" @cancel="handleCancel" width="1000px">
        <div style="width:100%;padding-bottom:13%;">
          <img :src="imgRes" style="width:100%;margin-left:-8%;" />
        </div>
      </a-modal>
    
    <dict-modal ref="modalForm" @ok="modalFormOk"></dict-modal>
    <!-- 字典类型 -->
    <flow-process-definition-item-list ref="flowProcessItemList"></flow-process-definition-item-list>
  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DictModal from './modules/DictModal'
import FlowProcessDefinitionItemList from './FlowProcessDefinitionItemList'
import { deleteAction,getAction } from '@/api/manage'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  name: 'DictList',
  mixins: [JeecgListMixin],
  components: { DictModal, FlowProcessDefinitionItemList },
  data() {
    return {
      description: '流程部署页面',
      visible: false,
      lookImg: false,
      imgRes: '',
      // 查询条件
      queryParam: {
        dictCode: '',
        dictName: ''
      },
      // 表头
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key: 'rowIndex',
        //   width: 120,
        //   align: 'center',
        //   customRender: function(t, r, index) {
        //     return parseInt(index) + 1
        //   }
        // },
        {
          title: 'ID',
          // align: 'left',
          dataIndex: 'id'
        },
        {
          title: '流程图',
          // align: 'center',
          dataIndex: 'deployment_id', //转换成图片
          scopedSlots: { customRender: 'deployment_id' }
        },
        {
          title: '流程KEY',
          // align: 'left',
          dataIndex: 'key'
        },
        {
          title: '流程名称',
          dataIndex: 'name',
          // align: 'left'
        },
        {
          title: '流程版本',
          dataIndex: 'version',
          // align: 'left'
        },
        {
          title: '是否挂起',
          dataIndex: 'suspension_state',
          // dataIndex: suspension_state==true?'是':'否',
          // align: 'left'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dict: '',
      labelCol: {
        xs: { span: 8 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 19 }
      },
      url: {
        list: '/api/flowDeploy/list',
        delete: '/api/flowDeploy/delete',
        importExcelUrl: 'api/flowDeploy/deploy',
        lookimage: '/api/flowDeploy/viewImage'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleDelete: function (record) {
      if(!this.url.delete){
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {id: record.id,deployment_id:record.deployment_id}).then((res) => {
        if (res.success) {
          //重新计算分页问题
          that.reCalculatePage(1)
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    lookImgs(test, record) {
      // console.log(test, record)
      this.lookImg = true
      this.imgRes = process.env.VUE_APP_API_BASE_URL + this.url.lookimage + "?deploymentId=" +record.deployment_id
      // getAction(this.url.lookimage, { deploymentId: record.deployment_id }).then(res => {
      //   this.imgRes = res
      // })
    },
    handleCancel() {
      this.lookImg = false
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      if (this.superQueryParams) {
        param['superQueryParams'] = encodeURI(this.superQueryParams)
        param['superQueryMatchType'] = this.superQueryMatchType
      }
      return filterObj(param)
    },
    //取消选择
    cancelDict() {
      this.dict = ''
      this.visible = false
      this.loadData()
    },
    //流程配置
    handFlowConfig(record) {
      this.$refs.flowProcessItemList.edit(record)
    },
    // 重置字典类型搜索框的内容
    searchReset() {
      var that = this
      that.queryParam.key = ''
      that.queryParam.name = ''
      that.loadData(this.ipagination.current)
    },
    
    
  },
  watch: {
    openKeys(val) {
      console.log('openKeys', val)
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