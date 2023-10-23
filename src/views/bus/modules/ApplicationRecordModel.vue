<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    :okButtonProps="{}"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns1"
        :dataSource="dataSource1"
        style="margin-bottom: 10px;"
      >
        <template slot="salename" slot-scope="text, record">
          <a @click="handleDetail(record)"> {{ text }}</a>
        </template>
        <template slot="areaUnit" slot-scope="text, record"> 
          <a-tag v-if="record.checkinStatus == 1" color="cyan">待提交</a-tag>
          <a-tag v-if="record.checkinStatus == 2" color="orange">审批中</a-tag>
          <a-tag v-if="record.checkinStatus == 3" color="red">已退回</a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleViewApprHistory(record)">跟踪</a>
        </template> 
      </a-table>
      <!-- <a-upload
      name="file"
      :multiple="true"
      :fileList="fileList"
      :remove="handleRemove"
      :beforeUpload="beforeUpload">
      <a-button>
        <a-icon type="upload" />
        选择导入文件
      </a-button>
    </a-upload> -->
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
       <!-- <a-button
        type="primary"
        @click="handleImport"
        :disabled="fileList.length === 0"
        :loading="uploading">
        {{ uploading ? '上传中...' : '开始上传' }}
      </a-button> -->
    </template>
  </j-modal>
</template>

<script>
import { httpAction,postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
export default {
  name: 'BusCustomerModal',
  components: {},
  data() {
    return {
      title: '操作',
      width: 1200,
      visible: false,
      model: {},
      confirmLoading: false,
      columns1: [
        {
          title: '单据号',
          align: 'left',
          dataIndex: 'recCode',
          scopedSlots: { customRender: 'salename' },
        },
        {
          title: '审核状态',
          align: 'left',
          dataIndex: 'checkinStatus',
          scopedSlots: { customRender: 'areaUnit' },
        },
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'submitUser',
        },
        {
          title: '创建时间',
          align: 'left',
          dataIndex: 'createTime',
        },
        {
          title: '提交时间',
          align: 'left',
          dataIndex: 'submitTime',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSource1: [],
      url: {
        add: '/bus/busCustomer/add',
        edit: '/bus/busCustomer/edit',
        addParticipants: '/bus/busCustomer/addParticipants',
        getParticipants: '/bus/busCustomer/getParticipants',
      },
      fileList:[],
      uploading:false,
      uploadAction:'',
    }
  },
   watch: {
      url (val) {
        if(val){
         this.uploadAction = window._CONFIG['domianURL']+val
        }
      }
    },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
    this.uploadAction = window._CONFIG['domianURL']+this.url
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false;
    },
    handleImport() {
        const { fileList } = this;
        // this.uploading = true
        console.log(fileList)
      },
    add(obj) {
      this.modelDefault.pid = ''
      this.edit(Object.assign(this.modelDefault, obj))
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.dataSource1 = []
      this.dataSource1.push(this.model)
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleCancel () {
        this.close()
      }
  },
}
</script>
