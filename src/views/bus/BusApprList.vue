<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <a-input placeholder="请输入主题" v-model="queryParam.subject" class="tablePageQueryCss"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="">
                <a-input placeholder="请输入流程名称" v-model="queryParam.busiName" class="tablePageQueryCss"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;">
        <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
        <!-- <a-button type="primary" icon="download" @click="handleExportXls('申请日期配置')">导出</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>-->
        <!-- 高级查询区域 -->
        <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel">
              <a-icon type="delete" />删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <!-- 查询区域-END -->

    

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

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
        @change="handleTableChange"
      >
      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
        <span slot="instanceId" slot-scope="text, record">
          <a-button type="primary" size="small" @click="lookImgs(text,record)">查看</a-button>
        </span>

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)"
          >下载</a-button>
        </template>


        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleVoid(record)" class="activeLogoCss" >终止流程</span>
          <span @click="handleViewApprHistory(record)" class="activeLogoCss">跟踪</span>
          <!--
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
         </a-dropdown>-->
        </span>
      </a-table>
      <a-modal
        :bodyStyle="{ padding: 0 }"
        :visible="lookImg"
        :footer="null"
        @cancel="handleCancel"
        width="1000px"
      >
        <img :src="imgRes" />
      </a-modal>
      <!-- 作废提示框 -->
      <a-modal v-model="isVoid" title="终止流程">
        <template slot="footer">
          <a-button @click="isVoid=false">取消</a-button>
          <a-button type="primary" @click="handleConfirm">确定</a-button>
        </template>
        <h3>您确定要结束流程吗？</h3>
      </a-modal>
    </div>

    <bus-appr-history-modal ref="modalApprHisForm"  />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { getAction } from '@/api/manage'
import BusApprHistoryModal from './modules/BusApprHistoryModal'

export default {
  name: 'BusApplyDateCfgList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    BusApprHistoryModal
  },
  data() {
    return {
      lookImg: false,
      imgRes: '',
      visible: false,
      isVoid: false,
      description: '申请日期配置管理页面',
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
            title: '流程号',
            dataIndex: 'instanceId',
        },
        {
          title: '任务号',
          dataIndex: 'taskId'
        },
        {
          title: '流程名称',
          dataIndex: 'busiName'
        },
        // {
        //   title: '任务名称',
        //   dataIndex: 'taskName'
        // },
        {
          title: '主题',
          dataIndex: 'subject'
        },
        // {
        //   title: '当前节点',
        //   dataIndex: 'currApproverRole'
        // },
        {
          title: '当前节点',
          dataIndex: 'taskName'
        },
        {
          title: '当前处理人',
          dataIndex: 'currApproverShow'
        },
        // {
        //     title: '流程图',
        //     dataIndex: 'sUBSCOPEID',
        //
        // },
        // {
        //   title: '流程图',
        //   dataIndex: 'instanceId',
        //   scopedSlots: { customRender: 'instanceId' }
        //
        //   //
        //   // render:(data)=>{
        //   //     return data === null?'暂无':<img src={`${config.flowableNowHeader}${data}`} className={styles.img}  onClick = {()=>this.showPic(`${config.flowableNowHeader}${data}`)}/>
        //   // }
        // },
        {
          title: '申请人',
          dataIndex: 'submitUserShow'
        },
        {
          title: '申请时间',
          dataIndex: 'submitTime'
        },
        {
          title: '到达时间',
          dataIndex: 'arrivalTime'
        },
        {
          title: '停留时间',
          dataIndex: 'dueDate'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/api/flowProcAppr/list',
        delete: '/bus/busApplyDateCfg/delete',
        deleteBatch: '/bus/busApplyDateCfg/deleteBatch',
        exportXlsUrl: '/bus/busApplyDateCfg/exportXls',
        importExcelUrl: 'bus/busApplyDateCfg/importExcel',
        lookimage: '/api/flowProcAppr/tracePhoto',
        toVoid: '/api/flowProcAppr/deleteProcessInstance'
      },
      dictOptions: {},
      superFieldList: [],
      copyRecord:{}
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    lookImgs(test, record) {
      this.lookImg = true
      this.imgRes = process.env.VUE_APP_API_BASE_URL + this.url.lookimage + '?processInstanceId=' + record.instanceId
    },
    handleCancel() {
      this.lookImg = false
    },
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'type', text: '类型', dictCode: '' })
      fieldList.push({ type: 'date', value: 'beginDate', text: '开始时间' })
      fieldList.push({ type: 'date', value: 'endDate', text: '一季度开始时间' })
      fieldList.push({ type: 'int', value: 'isUsing', text: '是否开启（0关闭，1开启）', dictCode: 'open_config' })
      fieldList.push({ type: 'string', value: 'remark', text: '备注', dictCode: '' })
      fieldList.push({ type: 'string', value: 'createBy', text: '创建人', dictCode: '' })
      fieldList.push({ type: 'date', value: 'createTime', text: '创建时间' })
      fieldList.push({ type: 'string', value: 'updateBy', text: '修改人', dictCode: '' })
      fieldList.push({ type: 'date', value: 'updateTime', text: '修改时间' })
      this.superFieldList = fieldList
    },
    //所有待办作废
    handleVoid(record) {
      this.isVoid = true;
      this.copyRecord=record;
    },
    handleConfirm() {
      this.isVoid = false
      getAction(this.url.toVoid, {
        processInstance: this.copyRecord.instanceId
      }).then(res => {
        if (res.success) {
          this.$message.success(`作废成功,流程已终止！`)
          this.loadData(1)
        } else {
          this.$message.warn(`作废失败：` + res.message)
        }
      })
    },
    //追踪
    handleViewApprHistory(record){
      let that = this;
      //
      if (record.instanceId == '' ) {
        this.$message.error("没有流程信息")
      } else {
        this.$refs.modalApprHisForm.visible = true;
        this.$refs.modalApprHisForm.loadData(1,record.instanceId);
      }

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