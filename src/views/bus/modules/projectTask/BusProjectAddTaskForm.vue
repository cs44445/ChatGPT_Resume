<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" v-if="ifPro">
            <a-form-model-item
              label="项目"
              prop="projectId"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              >
                <a-select
                @change="handleChangePro"
                placeholder="请选择项目"
                :disabled="formDisabled"
                v-model="model.projectId"
                show-search
                :filter-option="filterOption"
                :options="proOptions"
                allowClear
                :getPopupContainer="(target) => target.parentNode">

                </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="里程碑" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="milepostId">
              <a-select
                @change="handleChangeMile"
                placeholder="请选择里程碑"
                v-model="model.milepostId"
                show-search
                :filter-option="filterOption"
                :options="mileOptions"
                allowClear
                :getPopupContainer="(target) => target.parentNode">

              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskTitle">
              <a-input :disabled="formDisabled" v-model="model.taskTitle" placeholder="请输入标题"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="优先级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="priority">
              <!-- <j-dict-select-tag :disabled="formDisabled" v-model="model.priority" placeholder="请选择优先级"
                dictCode="task_priority" /> -->
              <a-select default-value=""  v-model="model.priority" style="width: 100%;"  placeholder="请选择优先级">
                <a-select-option value="1">
                  <div style="display: flex;align-items: center;">
                    <a-icon type="exclamation-circle" style="color:#D92929;font-size: 24px;margin-right: 10px;"/>
                    <span>高</span>
                  </div>
                </a-select-option>
                <a-select-option value="2">
                  <div style="display: flex;align-items: center;">
                    <a-icon type="exclamation-circle" style="color:#F2B202;font-size: 24px;margin-right: 10px;"/><span>中</span>
                  </div>
                </a-select-option>
                <a-select-option value="3">
                  <div style="display: flex;align-items: center;">
                    <a-icon type="exclamation-circle" style="color:#08C35C;font-size: 24px;margin-right: 10px;"/><span>低</span>
                  </div>
                </a-select-option>
                <a-select-option value="4">
                  <div style="display: flex;align-items: center;">
                    <a-icon type="exclamation-circle" style="color:#D3DCE6;font-size: 24px;margin-right: 10px;"/>
                    <span>未定义</span>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker :disabled="formDisabled" v-model="model.startTime" valueFormat="YYYY-MM-DD"
                style="width:100%;" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="截止时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <a-date-picker :disabled="formDisabled" v-model="model.endTime" valueFormat="YYYY-MM-DD"
                             style="width:100%;" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag :disabled="formDisabled" v-model="model.type" placeholder="请选择任务类别"
                                 dictCode="task_type" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="指派" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="appoint">
              <!-- <a-input :disabled="formDisabled" v-model="model.appoint" placeholder="请输入指派"></a-input> -->
              <a-select
                style="width: 100%" mode="multiple"
                placeholder="请选择指派人"
                v-model="model.appoint"
              >
                <a-select-option :value="item.value" v-for="item in groubRoleList.other" :key="item.name">
                  <div style="display: flex;align-items: center;font-size: 12px;">
                    <div style="width: 20px;
                        height: 20px;
                        border: 1px solid #D3DCE5;
                        border-radius: 50%;
                        text-align: center;
                        margin-right: 20px;
                        line-height: 20px;">
                      {{ item.name.slice(0,1) }}
                    </div>
                    <span>{{ item.name }}</span>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="附件"  :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="fileList">
              <a-upload-dragger
                name="file"
                ref="headerUploadRef"
                :multiple="true"
                :disabled="formDisabled"
                :action="uploadAction"
                :headers="headers"
                @change="handleChangeFile"
                @download="(file)=>{handleDownload(file.url)}"
                :fileList="defaultFileList"
                :default-file-list="defaultFileList"
                :data="{ 'biz': '10003' }"
                :remove="(file)=>{removeFile(file, data)}"
                @preview="handlePreview"
                :showUploadList="{
                  showRemoveIcon: true
                }"
              >
                <img :src="require('@/assets/upload.png')"/>
                <div style="margin-top:13px">
                  拖拽您的附件到这里
                </div>
                <div style="margin:13px 0">或者</div>
                <a-button>点击上传</a-button>
              </a-upload-dragger>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="describeInfo">
              <j-editor :disabled="formDisabled" v-model="model.describeInfo" v-if="ifDesEditorShow"  @mouseleave="handleDesleave"/>
              <a-textarea placeholder="请输入描述" :rows="4" v-model="model.describeInfo" @mousedown="handleDes" v-if="!ifDesEditorShow"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <j-editor :disabled="formDisabled" v-model="model.remark" v-if="ifRemarkEditorShow" />
              <a-textarea placeholder="请输入备注" :rows="4" v-model="model.remark" @mousedown="handleRemark" v-if="!ifRemarkEditorShow" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { httpAction, getAction,getFileAccessHttpUrl,deleteAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { ACCESS_TOKEN } from "@/store/mutation-types"
export default {
  name: 'BusProjectAddTaskForm',
  components: {
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    ifPro:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dictOptions: [],
      groubRoleList: [],
      model: {
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {
        projectId: [{
          required: true, message: '请选择项目!',
        }],
        milepostId: [{
          required: true, message: '请选择里程碑!',
        }],
        taskTitle: [{
          required: true, message: '请输入任务标题!',
        }],
        priority: [{
          required: true, message: '请选择优先级!',
        }],
        type: [{
          required: true, message: '请选择任务类别!',
        }],
        // endTime: [{
        //   required: true, message: '请选择截止时间!',
        // }],
      },
      url: {
        add: "/bus/busProjectTaskDetail/add",
        edit: "/bus/busProjectTaskDetail/edit",
        queryById: "/bus/busProjectTaskDetail/queryById",
        getById: '/bus/busProjectMilepost/queryByProjectId',//获取里程碑下拉列表
        groubRoleUrl: '/bus/busProjectTaskDetail/searchAppointList',// 分配员工
        getProject:'bus/busProject/list',
        queryMilepostInfoByProjectId:'bus/busProjectMilepost/queryListByProjectId',
        deleteBatch: "/bus/busFileOnline/deleteBatch",
      },
      proId: '',
      headers: {
      },
      uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
      ifDesEditorShow:false,
      ifRemarkEditorShow:false,
      defaultFileList:[],
      fileList:[],
      proOptions:[],
      mileOptions:[],

    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
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
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model));
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
  },
  mounted(){
      this.getProject()
  },
  methods: {
    handlePreview(file){
      console.log(file,'file------preview-----file')
      let text = '10003/'+file.name
      console.log(text,'text------------text')
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
    handleChangeMile(e){
      this.model.milepostId = e
    },
    handleChangePro(e){
        this.proId = e
        this.handleAssignOptions(e)
        let url = this.url.queryMilepostInfoByProjectId + '?projectId=' + e
        getAction(url).then(res=>{
            if(res.success){
                let result = res.result
                let dictOptions = []
                for (let i = 0; i < result.length; i++) {
                    let temp = result[i];
                    let item = {}
                    item.label = temp.milepostCode
                    item.value = temp.id
                    dictOptions.push(item);
                }
                this.mileOptions = dictOptions
            }
        })
    },
    getProject(){
        getAction(this.url.getProject).then(res=>{
            if (res.success) {
                let result = res.result.records
                let dictOptions = []
                for (let i = 0; i < result.length; i++) {
                    let temp = result[i];
                    let item = {}
                    item.label = temp.projectName
                    item.value = temp.id
                    dictOptions.push(item);
                }
                this.proOptions = dictOptions
            } else {
                this.$message.warn(`获取失败：` + res.message)
            }
        })
    },
    handleDes(){
      console.log('--------')
      this.ifDesEditorShow = true
    },
    handleDesleave(){
      console.log('---22-----')
      this.ifDesEditorShow = false
    },
    handleRemark(){
      this.ifRemarkEditorShow = true
    },
    handleDownload (fileUrl) {
      let text = '10003/'+fileUrl
      console.log(text,'text------------text')
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
    removeFile(file) {
        let ids = ''
        if(this.model.detailFileList){
          this.model.detailFileList.forEach((item,index) => {
            if(item.fileName==file.name) {
              ids=item.id
            }
          })
        }
        if(ids){
          deleteAction(this.url.deleteBatch + '?ids=' + ids).then((res) => {
            if (res.success && res.code == 200) {
              this.$message.success(`删除成功`);
            } else {
              that.$message.warning(res.message);
            }
          })
        }

    },
    handleChangeFile(info) {
      console.log(status, info.fileList);
      let  leng =   this.model.detailFileList?this.model.detailFileList.length:0
        let fileList = info.fileList.slice(leng,info.fileList.length).map( function(item) {
            return '10003/'+item.name
        })
        this.model.fileList = fileList.join(',')
        this.defaultFileList = info.fileList


      const status = info.file.status;
      if (status !== 'uploading') {


      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} 上传成功.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    },
    add(proId) {
      this.proId = proId
      this.handleChangePro(proId)
      this.model = Object.assign({}, this.modelDefault);
      this.visible = true;
    },
    edit(record) {
      this.proId = record.projectId
      this.handleChangePro(record.projectId)
      this.handleAssignOptions(record.projectId)
      this.handleGetItemDetail(record.id)
      this.visible = true;
    },
    handleGetItemDetail(id){
      this.fileList = []
      this.defaultFileList = []
      getAction(this.url.queryById,{id:id}).then(res=>{
        if (res.success) {
          this.model = Object.assign({}, res.result);
          if (this.model.appoint) {
            this.model.appoint = this.model.appoint.split(',')
          } else {
            this.model.appoint = undefined
          }
          if (res.result.detailFileList) {
            this.defaultFileList = res.result.detailFileList.map((item, index) => {
              return {
                        uid: index,
                        name: item.fileName,
                        status: 'done',
                        response: 'Server Success 200',
                        url: item.fileName,
                    }
            })
            console.log(this.defaultFileList);
          }

          console.log(this.model,'this.model.fileList-------this.model.fileList')
        }else{
          this.$message.error(res.message)
        }
      })
    },
    // 分配员工
    handleAssignOptions(proId) {
      getAction(this.url.groubRoleUrl, { projectId: proId }).then(res => {
        if (res.success && res.result.length != 0) {
          this.groubRoleList = res.result
        } else {
          this.groubRoleList = []
          // this.$message.warning(res.message)
        }
      })
    },
    submitForm() {
      const that = this;
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
            this.model.projectId = this.proId
          } else {
            httpurl += this.url.edit;
            method = 'put';
            this.model.flag = '1'
          }
          if (this.model.appoint) {
            if (this.model.appoint.length > 0) {
              this.model.appoint = this.model.appoint.join(',')
            } else {
              this.model.appoint = ''
            }
          } else {
            this.model.appoint = ''
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
  }
}
</script>
<style lang="less" scoped>
.cust-select-sty {
  border-radius: 15px;
  background: #e8f4ff;
  display: flex;
  padding-right: 5px;
}

.cust-select-sty span:first-child {
  border-radius: 50%;
  width: 25px;
  text-align: center;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
}

.cust-select-sty span:last-child {
  color: #b2c7e0;
  font-size: 17px;
  width: 25px;
  text-align: center;
}

/deep/ .ant-select-selection__choice__content {
  &>.cust-select-sty span:last-child {
    display: none;
  }
}
::v-deep .ant-input{
  background: #F7F9FA;
  border: 1px solid #EEF0F1;
  color: #8D9399 !important ;
}
::v-deep .ant-select-selection {
  background-color: #F7F9FA !important;
  border: 1px solid #EEF0F1;
  color: #8D9399 !important ;
}
::v-deep .ant-upload.ant-upload-drag{
  background-color: #ffffff !important;
  border: none!important;
  color: #8D9399 !important ;
}
</style>
