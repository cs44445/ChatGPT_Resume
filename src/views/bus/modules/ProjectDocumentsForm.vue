<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="附件">
            <div class="table-page-search-wrapper">
              <!-- 搜索区域 -->
              <a-form-model layout="inline" ref="ruleForm" @keyup.enter.native="searchQuery" :model="queryParam">
                <a-row :gutter="24">
                  <a-col :md="12" :sm="8">
                    <a-form-model-item label="项目文档" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18, offset: 1 }">
                      <a-input placeholder="" v-model="queryParam.title"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                    <a-col :md="12" :sm="24">
                      <div style="display:flex;">
                        <a-button type="primary" @click="searchQuery" icon="search">搜索</a-button>
                        <a-button @click="showUploadModal" icon="upload" style="margin-left:8px;">上传</a-button>
                        <span>
                          <a-button v-if="selectedRowKeys.length > 0" style="margin-left: 8px"
                            @click="downloadFiles()">批量下载
                            <a-icon type="vertical-align-bottom" />
                          </a-button>
                        </span>
                      </div>
                    </a-col>
                  </span>
                </a-row>
              </a-form-model>
              <div>
                <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
                  <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
                    selectedRowKeys.length
                  }}</a>项
                  <a style="margin-left: 24px" @click="onClearSelected">清空</a>
                </div>
                <a-table ref="table" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
                  size="small" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                  :loading="loading" :pagination="false" class="j-table-force-nowrap">
                  <template slot="filePath" slot-scope="text,record">
                    <a-popover>
                      <template slot="content">
                        <span>{{ text }}</span>
                      </template>
                      <div style="maxWidth:120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                        <a @click="downloadFile(record.filePath)">{{ text }}</a>
                      </div>
                    </a-popover>
                  </template>
                  <span slot="action" slot-scope="text, record">
                    <a @click="downloadFile(record.filePath)" style="color:#1990ff">下载</a>
                    <a-divider type="vertical" v-has="'projectdocuments:details'" />
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)"
                      v-has="'projectdocuments:details'">
                      <a style="color:#1990ff">删除</a>
                    </a-popconfirm>
                  </span>
                </a-table>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="在线文档" force-render>
            <div class="table-operator">
              <a-button @click="handleFileOnlineAdd" type="primary" icon="plus">新增</a-button>
            </div>
            <div>
              <a-table ref="table" :scroll="{ x: true }" rowKey="id" :columns="columns2" :dataSource="dataSource2"
                size="small" :loading="loading" :pagination="false" class="j-table-force-nowrap">
                <template slot="fileType" slot-scope="text">
                  <span v-if="text=='.docx'">文档</span>
                  <span v-else>表格</span>
                </template>
                <span slot="action" slot-scope="text, record">
                  <a @click="handleOnlineDetail(record)" style="color:#1990ff">预览</a>
                  <a-divider type="vertical" />
                  <a @click="handleOnlineEdit(record)" style="color:#1990ff">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleOnlineDelete(record.id)"
                    v-has="'projectdocuments:details'">
                    <a style="color:#1990ff">删除</a>
                  </a-popconfirm>
                </span>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>

      </a-form-model>
      <pro-step-documents-modal ref="prostepdoc" @updateList="updateList"></pro-step-documents-modal>
      <bus-file-online-modal ref="fileOnline" @updateList="updateList2"></bus-file-online-modal>
    </j-form-container>
  </a-spin>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction } from '@/api/manage'
import ProStepDocumentsModal from './ProStepDocumentsModal.vue'
import BusFileOnlineModal from './BusFileOnlineModal.vue'

export default {
  name: "ProjectDocumentsForm",
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    ProStepDocumentsModal,
    BusFileOnlineModal
  },
  data() {
    return {
      visible: false,
      headers: {
      },
      confirmLoading: false,
      uploadAction: window._CONFIG['domianURL'] + "/bus/file/uploadProjectFile",
      queryParam: {
        title: ''
      },
      validatorRules: {},
      rules: {
        title: { required: true, message: '请输入', trigger: 'blur' },
      },
      columns: [
        {
          title: '文档名称',
          align: "left",
          dataIndex: 'filePath',
          width: 150,
          scopedSlots: { customRender: 'filePath' }
        },
        {
          title: '里程碑',
          align: "left",
          dataIndex: 'milepostName'
        },
        // {
        //   title: '文件大小',
        //   align: "left",
        //   dataIndex: 'fileSize'
        // },
        {
          title: '上传人',
          align: "left",
          dataIndex: 'createBy'
        },
        {
          title: '上传日期',
          align: "left",
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        {
          title: '文件名称',
          align: "left",
          dataIndex: 'fileName'
        },
        {
          title: '里程碑',
          align: "left",
          dataIndex: 'referName'
        },
        {
          title: '文件类型',
          align: "left",
          dataIndex: 'fileType',
          scopedSlots: { customRender: 'fileType' }
        },
        {
          title: '创建人',
          align: "left",
          dataIndex: 'createBy_dictText'
        },
        {
          title: '创建时间',
          align: "left",
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          fixed: "right",
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      dataSource2: [],
      url: {
        fileListByProjectId: '/bus/file/getFileListByProjectId',
        fileDelete: '/bus/file/delete',
        onlineDocList: "/bus/busFileOnline/list",
        onlineDocdelete: "/bus/busFileOnline/delete",
      },
      associateddataSource: [],
      selectedRows: [],
      selectedRowKeys: [],
      model: {},
      listId: ''
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
    console.log('test', window._CONFIG['domianURL'])
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    downloadFiles() {
      for (let i = 0; i < this.selectedRows.length; i++) {
        this.downloadFile(this.selectedRows[i].filePath)
      }
    },
    edit(record) {
      this.listId = record
      // console.log(66, record)
      this.handleList(record, '')
      this.handleOnlineDoc(record)
      // this.model = Object.assign({}, record);'1584380492112105473'
    },
    showUploadModal() {
      this.$refs.prostepdoc.edit(this.listId)
      this.$refs.prostepdoc.title = '上传'
      this.$refs.prostepdoc.model = {}
    },
    updateList() {
      this.handleList(this.listId, '')
    },
    updateList2() {
      this.handleOnlineDoc(this.listId)
    },
    handleList(projectId, fileName) {
      getAction(this.url.fileListByProjectId, { projectId, fileName }).then((res) => {
        this.dataSource = res.result
      })
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.handleList(this.listId, '')
        this.$message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败，请稍后重试`);
      }
    },
    searchQuery() {
      this.handleList(this.listId, this.queryParam.title)
    },
    handleDelete(record) {
      deleteAction(this.url.fileDelete + '?id=' + record).then((res) => {
        console.log(res)
        if (res.success && res.code == 200) {
          this.queryParam.title = ''
          this.handleList(this.listId, '')
          this.$message.success(`删除成功`);
        } else {
          that.$message.warning(res.message);
        }
      })
    },
    handleAdd() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = true;
    },
    handleCancel(e) {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelect(record, selected, selectedRows) {
      console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      console.log(selected, selectedRows, changeRows);
    },
    //在线文档
    handleOnlineDoc(projectId) {
      getAction(this.url.onlineDocList, { projectId }).then((res) => {
        console.log('online', res.result.records)
        this.dataSource2 = res.result.records
      })
    },
    handleOnlineEdit(record) {
      let queryTitle = record.fileName.split('.')[0]
      let queryType = record.fileName.split('.')[1]
      let newhref = this.$router.resolve({ path: '/document/index', query: { edit: true, title: queryTitle, type: queryType } });
      window.open(newhref.href, '_blank')
    },
    handleOnlineDetail(record) {
      let queryTitle = record.fileName.split('.')[0]
      let queryType = record.fileName.split('.')[1]
      let newhref = this.$router.resolve({ path: '/document/index', query: { edit: false, title: queryTitle, type: queryType } });
      window.open(newhref.href, '_blank')
    },
    handleFileOnlineAdd() {
      this.$refs.fileOnline.edit(this.listId)
      this.$refs.fileOnline.title = '新建'
      // this.$refs.prostepdoc.model = {}
    },
    handleOnlineDelete(record) {
      deleteAction(this.url.onlineDocdelete + '?id=' + record).then((res) => {
        // console.log(res)
        if (res.success && res.code == 200) {
          this.handleOnlineDoc(this.listId)
          this.$message.success(`删除成功`);
        } else {
          that.$message.warning(res.message);
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';

/deep/ .bthhover {
  background-color: #1990ff;
  border-color: #1990ff;
}
</style>