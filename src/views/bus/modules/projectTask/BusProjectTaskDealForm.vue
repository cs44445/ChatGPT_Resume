<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model layout="vertical" ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col>
            <a-form-model-item label="解决方案"  prop="handleScheme">
              <j-dict-select-tag :disabled="formDisabled" v-model="model.handleScheme" placeholder="请选择解决方案"
                dictCode="handle_scheme" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="解决日期"  prop="handleDate">
              <a-date-picker :disabled="formDisabled" valueFormat="YYYY-MM-DD" v-model="model.handleDate"
                style="width:100%;" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="指派"  prop="appoint">
              <div style="display: flex;margin-top: 10px;">
                <div style="display: flex;margin-right: 10px;align-items: center;" v-for="item in record.appointUserName" :key="item.userName">
                    <div class="circularCss" >
                      {{ item.userName.slice(0,1) }}
                    </div>
                    <span>{{ item.userName }}</span>
                </div>
                <assign-people ref="assignPeople" :projectId="proId" :record="record"></assign-people>                  
              </div>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="备注(选填)"  prop="remark">
              <!-- <j-editor :disabled="formDisabled" v-model="model.remark" /> -->
              <a-textarea placeholder="描述" :rows="4" v-model="model.remark"/>
              <!-- <div v-html="model.remark"></div> -->
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="附件(选填)" 
             prop="fileList">
              
                <a-upload-dragger
                  name="file"
                  :multiple="true" :disabled="formDisabled"
                  :action="uploadAction" :headers="headers"
                  @change="handleChange" v-model="model.fileList" :data="{ 'biz': '10003' }"
                >
                  <img :src="require('@/assets/upload.png')"/>
                  <div style="margin-top:13px">
                    拖拽您的附件到这里
                  </div>
                  <div style="margin:13px 0">或者</div>
                  <a-button @click="handleChange">点击上传</a-button>
                </a-upload-dragger>
            </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="24">
             <div>
              <a-icon type="plus" style="margin-right:10px"/>添加标签
             </div>
          </a-col> -->
        </a-row>
      </a-form-model>
      <!-- <div style="padding-bottom:30px;">
        <p>历史记录：</p>
        <p v-for="(item, i) in historyList" :key="i"><span style="margin-right:20px;">{{ i + 1 }}</span>{{ item.createTime
        }}，{{ item.content }}</p>
      </div> -->
    </j-form-container>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import assignPeople from './assignPeople.vue'
export default {
  name: 'BusProjectAddTaskForm',
  components: {
    assignPeople
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
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
        handleDate: [{
          required: true, message: '请选择解决日期!',
        }],
        handleScheme: [{
          required: true, message: '请选择解决方案!',
        }],
      },
      url: {
        add: "/bus/busProjectTaskDetail/add",
        edit: "/bus/busProjectTaskDetail/edit",
        queryById: "/bus/busProjectTaskDetail/queryById",
        getById: '/bus/busProjectMilepost/queryByProjectId',//获取里程碑下拉列表
        groubRoleUrl: '/bus/busProjectTaskDetail/searchAppointList',// 分配员工
        taskHistory: '/bus/busProjectTaskHistory/list',//历史记录
      },
      proId: '',
      record: {},
      historyList: [],
      headers: {
      },
      uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
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
  methods: {
    handleChange(info) {
      console.log('点击上传------------处理');
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
    
    edit(record) {
      this.proId = record.projectId
      this.record = record
      
      this.getTaskHistory()
      console.log(record,'record------------处理')
      // if (this.record.appoint) { this.record.appoint = this.record.appoint.split(',') }
      this.model = Object.assign({}, record);
      this.model.remark=null;
      this.visible = true;
    },
    // 分配员工
    handleAssignOptions() {
      getAction(this.url.groubRoleUrl, { projectId: this.proId }).then(res => {
        if (res.success && res.result.length != 0) {
          this.groubRoleList = res.result
        } else {
          this.groubRoleList = []
          // this.$message.warning(res.message)
        }
      })
    },
    // 历史记录
    getTaskHistory() {
      getAction(this.url.taskHistory, { taskId: this.record.id }).then(res => {
        if (res.success && res.result.records.length != 0) {
          this.historyList = res.result.records
          // console.log(999, this.historyList)
        } else {
          this.historyList = []
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
          httpurl += this.url.edit;
          method = 'put';
          this.model.flag = '4'
          this.model.id = this.record.id
          this.model.projectId = this.record.projectId
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
  background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
.circularCss{
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 10px 0 0;
    text-align: center;
}
</style>
