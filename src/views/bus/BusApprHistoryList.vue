<template>
  <a-card :bordered="false">
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
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button> -->
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('申请日期配置')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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

        <span slot="instanceId" slot-scope="text, record">
          <a-button type="primary" size="small" @click="lookImgs(text,record)">查看</a-button>
        </span>

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

        <span slot="action" slot-scope="text, record" v-if="record.status!=1">
          <a @click="handleViewApprHistory(record)">跟踪</a>

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
      <a-modal :bodyStyle="{ padding: 0 }" :visible="lookImg" :footer="null" @cancel="handleCancel" width="1000px">
        <img :src="imgRes" />
      </a-modal>
    </div>

    <bus-appr-history-modal ref="modalApprHisForm"  />
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusApprHistoryModal from './modules/BusApprHistoryModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
import { postAction, getAction } from '@/api/manage'
  export default {
    name: 'BusApplyDateCfgList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusApprHistoryModal
    },
    props: {
      busiNo: {
        type: String
      }
    },
    data () {
      return {
        lookImg: false,
        imgRes: '',
        visible: false,
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
              dataIndex: 'taskId',

          },
          {
              title: '流程名称',
              dataIndex: 'busiName',

          },
          // {
          //     title: '任务名称',
          //     dataIndex: 'taskName',

          // },
          {
              title: '主题',
              dataIndex: 'subject',

          },
          // {
          //     title: '当前节点',
          //     dataIndex: 'currApproverRole',

          // },
          {
              title: '当前节点',
              dataIndex: 'taskName',

          },
          {
              title: '当前处理人',
              dataIndex: 'currApproverShow',

          },
          // {
          //     title: '流程图',
          //     dataIndex: 'sUBSCOPEID',
          //
          // },
          // {
          //     title: '流程图',
          //     dataIndex: 'instanceId',
          //     scopedSlots: { customRender: 'instanceId' }

              //
              // render:(data)=>{
              //     return data === null?'暂无':<img src={`${config.flowableNowHeader}${data}`} className={styles.img}  onClick = {()=>this.showPic(`${config.flowableNowHeader}${data}`)}/>
              // }
          // },
          {
              title: '申请人',
              dataIndex: 'submitUserShow',

          },
          {
              title: '申请时间',
              dataIndex: 'submitTime',

          },
          // {
          //     title: '到达时间',
          //     dataIndex: 'arrivalTime',

          // },
          // {
          //     title: '停留时间',
          //     dataIndex: 'dueDate',

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
          // list: "/api/flowProcAppr/queryHistoricTaskByUser?category=1",
          list: "/api/flowProcAppr/queryHistoricTaskByUser",
          delete: "/bus/busApplyDateCfg/delete",
          deleteBatch: "/bus/busApplyDateCfg/deleteBatch",
          exportXlsUrl: "/bus/busApplyDateCfg/exportXls",
          importExcelUrl: "bus/busApplyDateCfg/importExcel",
          lookimage: '/api/flowProcAppr/tracePhoto',
          list1: '/api/flowProcAppr/taskList',

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    watch: {
      busiNo: function() {
        this.loadData(1, this.busiNo)
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      loadData(arg, busiNo) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        var params = this.getQueryParams() //查询条件
        params.busiNo = this.busiNo
        this.loading = true
        console.log(params,'params')
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
      lookImgs(test, record) {
        this.lookImg = true
        this.imgRes = process.env.VUE_APP_API_BASE_URL + this.url.lookimage + "?processInstanceId=" +record.instanceId
      },
      handleCancel() {
        this.lookImg = false
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'type',text:'类型',dictCode:''})
        fieldList.push({type:'date',value:'beginDate',text:'开始时间'})
        fieldList.push({type:'date',value:'endDate',text:'一季度开始时间'})
        fieldList.push({type:'int',value:'isUsing',text:'是否开启（0关闭，1开启）',dictCode:'open_config'})
        fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建人',dictCode:''})
        fieldList.push({type:'date',value:'createTime',text:'创建时间'})
        fieldList.push({type:'string',value:'updateBy',text:'修改人',dictCode:''})
        fieldList.push({type:'date',value:'updateTime',text:'修改时间'})
        this.superFieldList = fieldList
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
  @import '~@assets/less/common.less';
</style>