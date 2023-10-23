<template>
  <div class="index-container-ty">
    <div class="index-tabs">
      <a-tabs default-active-key="2" @change="selectTab" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">消息通知</span></template>
        </a-tab-pane>
        <a-tab-pane tab="消息提醒" key="2">
          <a-card :bordered="false">
            <!-- 查询区域 -->
            <div class="table-page-search-wrapper">
              <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">

                  <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <a-form-item label="消息类型">
                      <j-dict-select-tag placeholder="请选择消息类型" v-model="queryParam.noticeType" dictCode="notice_type" />
                    </a-form-item>
                  </a-col>
                  <a-col :xl="6" :lg="7" :md="8" :sm="24" class="test">
                    <a-form-item label="消息标题">
                      <a-input placeholder="请输入消息标题" v-model="queryParam.noticeInfo" ></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :xl="6" :lg="7" :md="8" :sm="24" class="test">
                    <a-form-item label="阅读状态">
                      <j-dict-select-tag placeholder="请选择阅读状态" v-model="queryParam.ifRead" dictCode="read_status"/>
                    </a-form-item>
                  </a-col>

                  <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                      <a-button type="primary" @click="clearIfRead" style="margin-left: 8px" v-if="dataSource.length>0">
                        <img src="~@/assets/yjyd.png" class="" style="margin-right: 5px">一键已读
                      </a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <!-- 查询区域-END -->


            <!-- table区域-begin -->
            <div class="pri-content">
              <!-- 操作按钮区域 -->
              <div class="table-operator">
                <!-- <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
                <a-button type="primary" icon="download" @click="handleExportXls('bus_notice_info')">导出</a-button>
                <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
                  <a-button type="primary" icon="import">导入</a-button>
                </a-upload>
                <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query> -->
                <a-dropdown v-if="selectedRowKeys.length > 0">
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
                  </a-menu>
                  <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
                </a-dropdown>
              </div>
              <!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 30px;">-->
              <!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
              <!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
              <!--      </div>-->

              <a-table
                ref="table"
                size="middle"
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

                <span slot="action" slot-scope="text, record">
                  <!-- <a @click="handleViewNoticeUser(record)">查看通知详情</a> -->
                  <a @click="handleViewNoticeUser(record)">查看</a>

                  <a-divider type="vertical" />

                  <a>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                          <a>删除</a>
                    </a-popconfirm>
                  </a>

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
            <bus-notice-info-modal ref="modalForm" @ok="modalFormOk"></bus-notice-info-modal>
            <Bus-Notice-User-Modal ref="noticeUserModal" @selectFinished="selectOK"></Bus-Notice-User-Modal>
            <Bus-Notice-View-Modal ref="noticeViewModal" @selectFinished="selectOK"></Bus-Notice-View-Modal>

          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusNoticeInfoModal from './modules/BusNoticeInfoModal'
import BusNoticeUserModal from './modules/BusNoticeUserModal'
import BusNoticeViewModal from './modules/BusNoticeViewModal'
import { getAction,putAction } from '@/api/manage'
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 4 },
}
export default {
  name: 'BusNoticeInfoList',
  mixins:[JeecgListMixin, mixinDevice],
  components: {
    BusNoticeInfoModal,
    BusNoticeUserModal,
    BusNoticeViewModal
  },
  data () {
    return {
      formItemLayout,
      description: 'bus_notice_info管理页面',
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
        // {
        //   title:'业务id',
        //   align: 'left',
        //   dataIndex: 'busId'
        // },
        {
          title:'消息类型',
          align: 'left',
          dataIndex: 'noticeType_dictText'
        },
        {
          title:'消息标题',
          align: 'left',
          dataIndex: 'noticeTitle'
        },
        {
          title:'发布人',
          align: 'left',
          dataIndex: 'createBy_dictText'
        },
        {
          title:'发布时间',
          align: 'left',
          dataIndex: 'createTime',
          // customRender:function (text) {
          //   return !text?"":(text.length>10?text.substr(0,10):text)
          // }
        },
        // {
        //   title:'优先级',
        //   align: 'left',
        //   dataIndex: 'priorityType_dictText'
        // },
        {
          title:'阅读状态',
          align: 'left',
          dataIndex: 'ifRead_dictText'
        },

        // {
        //   title:'提醒用户',
        //   align: 'left',
        //   dataIndex: 'noticeUser'
        // },
        // {
        //   title:'备注',
        //   align: 'left',
        //   dataIndex: 'remark'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed:"right",
          width:147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: "/bus/busNoticeInfo/list",
        delete: "/bus/busNoticeInfo/delete",
        deleteBatch: "/bus/busNoticeInfo/deleteBatch",
        exportXlsUrl: "/bus/busNoticeInfo/exportXls",
        importExcelUrl: "bus/busNoticeInfo/importExcel",
        setInfoRead: "/bus/busNoticeInfo/setInfoRead",
        setAllInfoRead:'bus/busNoticeInfo/setAllInfoRead'
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
    clearIfRead(){
      putAction(this.url.setAllInfoRead).then(res=>{
         if(res.success){
           this.loadData()
           this.$message.success(res.message)
         }else{
           this.$message.warning(res.message)
         }
      })
    },
    initDictConfig(){
    },
    getSuperFieldList(){
      let fieldList=[];
      fieldList.push({type:'string',value:'busId',text:'业务id',dictCode:''})
      fieldList.push({type:'string',value:'noticeType',text:'提醒类型',dictCode:''})
      fieldList.push({type:'date',value:'noticeTime',text:'提醒时间'})
      fieldList.push({type:'string',value:'ifRead',text:'是否已读',dictCode:''})
      fieldList.push({type:'string',value:'noticeInfo',text:'提醒详情',dictCode:''})
      fieldList.push({type:'string',value:'noticeUser',text:'提醒用户',dictCode:''})
      fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
      this.superFieldList = fieldList
    },
    handleViewNoticeUser(record) {
      putAction(this.url.setInfoRead,{id:record.id}).then((res)=>{
        if(res.success){
          this.loadData();
        }
      });
      this.$refs.noticeViewModal.visible = true;
      this.$refs.noticeViewModal.getUserList(record);
    },
    selectOK(data) {
      // let params = {};
      // params.depId = this.currentDeptId;
      // params.userIdList = [];
      // for (var a = 0; a < data.length; a++) {
      //   params.userIdList.push(data[a]);
      // }
      console.log(data);
      // postAction(this.url.edit, params).then((res) => {
      //   if (res.success) {
      //     this.$message.success(res.message);
      //     this.loadData();
      //   } else {
      //     this.$message.warning(res.message);
      //   }
      // })
    },
  },

}
</script>
<style lang="less" scoped>

.image-group-share {
  position: absolute;
  right: 15px;
  top: 20px;
  .image-group {
    width: auto;
    display: inline-block;
  }
  .share-btn {
    margin-left: 10px;
  }
}
.index-tab /deep/ .ant-tabs-nav-container {
  font-size: 14px;
}
.first-tab {
  display: block;
  font-size: 17px;
  font-weight: bold;
  color: #000;
}
.index-tab /deep/ .ant-tabs-nav div:has(.first-tab){
  border-right: 1px solid #e8e8e8;
  &:hover {
    cursor: default;
  }
}
</style>
