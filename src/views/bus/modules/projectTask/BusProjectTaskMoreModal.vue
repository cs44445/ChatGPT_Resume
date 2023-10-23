<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen :maskClosable="false" @ok="handleOk"
    @cancel="handleCancel" cancelText="取消" class="cust-task">
      <task-list :projectId="record.projectId"></task-list>
      <div slot="footer">
          <a-button @click="handleCancel">取消</a-button>
      </div>
  </j-modal>
</template>

<script>
import { httpAction, getAction, getFileAccessHttpUrl } from '@/api/manage'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import BusProjectTaskDealModal from './BusProjectTaskDealModal'
import BusProjectAddTaskModal from './BusProjectAddTaskModal'
import assignPeople from './assignPeople'
import TaskList from '../projectTask/TaskList'

export default {
  name: 'BusProjectTaskDetailModal',
  components: {
    BusProjectTaskDealModal,BusProjectAddTaskModal,assignPeople,TaskList
  },
  data() {
    return {
      title: '',
      width: '90vw',
      visible: false,
      disableSubmit: false,
      record: {},
      url: {
        statusInfo: '/bus/busProjectTaskDetail/queryStatusInfoByTaskId',
        taskHistory: '/bus/busProjectTaskHistory/list',//历史记录
        edit: "/bus/busProjectTaskDetail/edit",
        groubRoleUrl: '/bus/busProjectTaskDetail/searchAppointList',// 分配员工
        add: "/bus/busProjectTaskDetail/add",
        detail:'bus/busProjectTaskDetail/queryById'
      },
      historyList: [],
      statusList: [],
      fileList: [],
      taskType:'',
      ifExpand:false,
      headers: {
      },
      uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
      groubRoleList:[],
      btntext:'开始任务',
    }
  },
  computed: {
    bgColor() {
      return (name) => {
        if (!name) return 'rgb(119, 153, 153)'
        var str = ''
        for (var i = 0; i < name.length; i++) {
          str += parseInt(name[i].charCodeAt(0), 10).toString(16)
        }
        return '#' + str.slice(0, 2) + str.slice(1, 2)
      }
    },
  },
  created(){
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
  },
  methods: {    
    handleAddPeo(){
        this.$refs.assignPeople.handleAssignOptions()
    },
    loadDetail(id){
      getAction(this.url.detail,{id:id}).then(res=>{
        if(res.success){
          res.result.taskTitle1 = res.result.taskTitle.length > 16 ? res.result.taskTitle.slice(0,17)+'...' : res.result.taskTitle
          if (res.result.fileList) {
            this.fileList = res.result.fileList.split(',')
          }
          if(res.result.status == '0'){
            this.btntext = '开始任务'
          }else if(res.result.status == '4'){
            this.btntext = '继续任务'
          }else{
            this.btntext = '任务完成'
          }
          this.record = res.result
          
        }else {
          this.$message.warning('获取任务详情失败')
        }
      })
    },
    handleBtnStatus(status,flag){
      // status:0 未开始  1进行中 4代表已完成 
      // flag:4处理  5关闭  6复制 1正常编辑   2开始任务 3继续任务 7暂停任务
      this.$set(this.record,'status',status)
      this.$set(this.record.appointUserName[0],'status',status)
      if(status == '0'){
        this.btntext = '开始任务'
        // this.handleSubmit({flag:'2',id:this.record.id})
      }else if(status == '4'){
        this.btntext = '继续任务'
        // this.handleSubmit({flag:'4',id:this.record.id})
      }else if(status == '1'){
        this.btntext = '任务完成'
        // this.handleSubmit({flag:'3',id:this.record.id})
      }
      this.handleSubmit({flag:flag,id:this.record.id})
    },
    copyEvent (url) {
      var copyInput = document.createElement("input"); // 创建元素
      //val是要复制的内容
      copyInput.setAttribute("value", url);
      document.body.appendChild(copyInput);
      copyInput.select()
      try {
        var copyed = document.execCommand("copy");
        if (copyed) {
          document.body.removeChild(copyInput);
          this.$message.success("复制成功");
        }
      } catch {
        this.$message.error("复制失败，请检查浏览器兼容");
      }
      
    },
    handleCopyTaskLink(){
      let url=window.location.href
       console.log(url)
       this.copyEvent(url)
    },
      handleDelete(){
            deleteAction(this.url.delete,{id:this.record.id}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
       // 复制任务
       copyTask(record) {
            record.flag = '6'
            httpAction(this.url.edit, record, 'put').then((res) => {
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
        // 编辑
        handleEdit() {
            this.$refs.addTaskModal.title='编辑任务'
            this.$refs.addTaskModal.edit(this.record);
        },
      // 处理
      handleDeal() {
          this.$refs.dealTaskModal.edit(this.record);
      },
    handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    expandText(){
       this.ifExpand = !this.ifExpand
    },
    handleSubmit(params){
      httpAction(this.url.edit, params, 'put').then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadDetail(this.record.id)
          this.$emit('ok');
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
      })
    },
    handleTaskType(type){
        // this.taskType = type
      this.$set(this.record,'type',type)
      if(type==1){
        this.$set(this.record,'typeDict','需求')
      }else if(type==2){
        this.$set(this.record,'typeDict','BUG')
      }else if(type==3){
        this.$set(this.record,'typeDict','设计')
      }else if(type==4){
        this.$set(this.record,'typeDict','其他')
      }
      this.handleSubmit({type:type,flag:'1',id:this.record.id})
    },
    handleSubmitForm(appointId){
      this.record.appoint = this.record.appoint + ',' + appointId
      this.handleSubmit({flag:'1',id:this.record.id,appoint:this.record.appoint})
      console.log(this.record,'this.record')
    },
    submitForm() {
      const that = this;
      let httpurl = '';
      let method = '';
      if (!this.record.id) {
        httpurl += this.url.add;
        method = 'post';
        this.record.projectId = this.proId
      } else {
        httpurl += this.url.edit;
        method = 'put';
        this.record.flag = '1'
      }
      httpAction(httpurl, this.record, method).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.$emit('ok');
        } else {
          that.$message.warning(res.message);
        }
      }).finally(() => {
      })
    },
    handleAddPersonnel(){

    },
    edit(record) {
      // console.log(record)
      // record.taskTitle1 = record.taskTitle.length > 16 ? record.taskTitle.slice(0,17)+'...' : record.taskTitle
      // this.record = record
      this.title = record.projectName + " - 任务列表"
      this.getStatusHistory(record.id)
      this.getTaskHistory(record.id)
      this.handleAssignOptions(record.projectId)
      this.loadDetail(record.id)
      this.visible = true
    },
    close() {
      this.$emit('close');
      this.visible = false;
      this.fileList = []
    },
    handleOk() {
      this.$refs.realForm.submitForm();
    },
    submitCallback() {
      this.$emit('ok');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
      // 分配员工
    handleAssignOptions(id) {
      getAction(this.url.groubRoleUrl, { projectId: id }).then(res => {
          if (res.success && res.result.length != 0) {
          this.groubRoleList = res.result
          this.clicked = true; //控制弹出框是否显示
          } else {
          this.groubRoleList = []
          // this.$message.warning(res.message)
          }
      })
    },
    // 状态记录
    getStatusHistory(id) {
      getAction(this.url.statusInfo, { taskId: id }).then(res => {
        if (res.success && res.result.length != 0) {
          this.statusList = res.result
          console.log('statusList-----', this.statusList)
        } else {
          this.statusList = []
          // this.$message.warning(res.message)
        }
      })
    },
    // 历史记录
    getTaskHistory(id) {
      getAction(this.url.taskHistory, { taskId: id }).then(res => {
        if (res.success && res.result.records.length != 0) {
          this.historyList = res.result.records
          console.log('historyList-----', this.historyList)
        } else {
          this.historyList = []
          // this.$message.warning(res.message)
        }
      })
    },
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
    // 编辑
    handleEdit() {
      this.$refs.addTaskModal.edit(this.record);
    },
    // 处理
    handleDeal() {
      this.$refs.dealTaskModal.edit(this.record);
    },
    // 关闭任务
    closeTask() {
      this.record.flag = '5'
      httpAction(this.url.edit, this.record, 'put').then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.updatedList();
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    updatedList() {
      this.loadDetail(this.record.id)
      this.$emit('ok')
      this.visible = false;
    }
  }
}
</script>
<style lang="less" scoped>
.finishBtnCss,.continueBtnCss{
  border: 1px solid #D8D8D8;
  color: #2F3133;
}
.iconCss{
  margin-right: 10px;
  font-size: 24px;
}
.btnCss{
    border-color: #d93899;
    color: #d93899;
}
.mileMonthCss{
  width: 38px;
  border-radius: 4px 4px 0 0;
  background-color: #F2B202;
  color: #FFFFFF;
  text-align: center;
  font-size: 8px;
}
.mileDayCss{
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #3D3D3D;
}
::v-deep .ant-upload.ant-upload-drag{
  background-color: #ffffff !important;
    border: none!important;
    color: #8D9399 !important ;
}
.uploadBtn{
  color: #CD128A;
  border-color: #d93899;
}
p{
  overflow:hidden;
  white-space:pre-line;
  text-overflow:ellipsis
}
.taskTypeBtn,.taskTypeBtn:hover{
  background: #136DEB;
  color: #FFFFFF;
  margin-left: 20px;
  border: 1px solid #136DEB;
}
.cust-task /deep/.ant-modal-body {
  position: relative;
}

.info-box {
  /deep/ img {
    max-width: 100%;
  }
}

.title-taskno {
  padding: 2px 10px;
  border-radius: 4px;
  background-color: rgba(25, 144, 255, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  margin-right: 10px;
}

.title-act {
  border: 1px solid #8666bb;
  padding: 2px 10px;
  font-size: 12px;
  background: #f0ebf9;
  border-radius: 4px;
}

.title-dea {
  border: 1px solid #43a047;
  padding: 2px 10px;
  font-size: 12px;
  background: #eff9f0;
  border-radius: 4px;
}

.title-clo {
  border: 1px solid #838a9d;
  padding: 2px 10px;
  font-size: 12px;
  background: #ebebeb;
  border-radius: 4px;
}

.info-box {
  background: #f5f5f5;
  padding: 15px 25px;
}

.title-margin {
  margin: 20px 0;
}

.appoint-box {
  display: flex;
  align-items: center;
}

.appoint-box-con {
  background: #fff;
  padding: 5px 5px 0 5px;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.appoint-items {
  width: 30%;
  padding-right: 5px;
  height: 25px;
  // line-height: 20px;
  border-radius: 24px;
  background-color: rgba(232, 244, 255, 1);
  color: rgba(16, 16, 16, 1);
  display: flex;
  align-items: center;
  margin-right: 5px;
  margin-bottom: 5px;
  // margin-top: 5px;
}

.appoint-items span {
  display: flex;
  width: 25px;
  height: 25px;
  // line-height: 20px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}

.task-action {
  position: absolute;
  left: 41%;
  bottom: -15px;
  width: 290px;
  border-radius: 5px;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 1);
  z-index: 999;
  background: #bbbbbb;
  padding: 15px;
  display: flex;
  align-items: center;
}

.task-action-item {
  flex: 1;
  color: #fff;
  font-size: 18px;
  padding: 0 10px;
  border-right: 1px solid #fff;
  cursor: pointer;
}

.task-action .task-action-item:last-child {
  border-right: none;
}

.circularCss{
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 10px 0 0;
    text-align: center;
}


////
/deep/ .ant-modal-body {
  background-color: #F7F8FA;
}
</style>