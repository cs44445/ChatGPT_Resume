<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail" class="bindpro-model">
        <a-col :span="24">
          <a-form-model-item label="项目" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
            <!-- <a-input :disabled="formDisabled" v-model="model.milepostId" placeholder="请选择里程碑"></a-input> -->
            <a-select :disabled="formDisabled" placeholder="请选择项目" v-model="model.projectId"  @change="handleProject">
              <a-select-option v-for="(item, key) in projectOptions" :key="key" :value="item.id">
                {{ item.projectName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="里程碑" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
            prop="milepostId">
            <!-- <a-input :disabled="formDisabled" v-model="model.milepostId" placeholder="请选择里程碑"></a-input> -->
            <a-select :disabled="formDisabled" placeholder="请选择里程碑" v-model="model.milepostId">
              <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.id">
                {{ item.milepostCode }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="24">
            <a-form-model-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taskTitle">
              <a-input :disabled="formDisabled" v-model="model.taskTitle" placeholder="请输入标题"></a-input>
            </a-form-model-item>
          </a-col> -->
        <a-row type="flex" :gutter="{ md: 12, xxl: 16 }">
          <a-col :span="12">
            <a-form-model-item label="优先级" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
              prop="priority">
              <j-dict-select-tag :disabled="formDisabled" v-model="model.priority" placeholder="请选择优先级"
                dictCode="task_priority" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="类别" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag :disabled="formDisabled" v-model="model.type" placeholder="请选择任务类别"
                dictCode="task_type" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="指派" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="appoint">
              <!-- <a-input :disabled="formDisabled" v-model="model.appoint" placeholder="请输入指派"></a-input> -->
              <a-select mode="multiple" v-model="model.appoint" placeholder="请选择指派" :disabled="formDisabled">
                <a-select-opt-group v-for="item in groubRoleList" :key="item.name" :label="item.name" class="test">
                  <a-select-option :value="child.id" v-for="child in item.children" :key="child.id">
                    <div class="cust-select-sty">
                      <span :style="{ backgroundColor: bgColor(child.name) }">{{ child.name.substring(0, 1) }}</span>
                      <span>{{ child.name }}</span>
                      <span>+</span>
                    </div>
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="{ md: 12, xxl: 16 }">
          <a-col :span="12">
            <a-form-model-item label="执行时间" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">

              <a-date-picker :disabled="formDisabled" v-model="model.startTime" valueFormat="YYYY-MM-DD"
                style="width:100%;" /> </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="    " labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker :disabled="formDisabled" v-model="model.endTime" valueFormat="YYYY-MM-DD"
                style="width:100%;" /></a-form-model-item></a-col>


        </a-row>

        <a-col :span="24">
          <a-form-model-item label="描述(选填)" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
            prop="content">
            <a-textarea v-model="model.content" :disabled="formDisabled" placeholder="请输入任务描述" :auto-size="{ minRows: 3}" />
            <!-- <j-editor :disabled="formDisabled" v-model="model.content" /> -->
          </a-form-model-item>
        </a-col>

        <!-- <a-col :span="24">
            <a-form-model-item label="附件" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileList">
              <j-upload :file-type="'10002'" v-model="model.fileList" :showUploadBtn="!formDisabled"
                :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <j-editor :disabled="formDisabled" v-model="model.remark" />
            </a-form-model-item>
          </a-col> -->

      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'BindprojectForm',
  components: {
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
      projectOptions: [],
      groubRoleList: [],
      model: {
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
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
      },
      url: {
        add: "/bus/busProjectTodolist/bindProject",
        edit: "/bus/busProjectTaskDetail/edit",
        queryById: "/bus/busProjectTaskDetail/queryById",
        getById: '/bus/busProjectMilepost/queryByProjectId',//获取里程碑下拉列表
        groubRoleUrl: '/sys/user/queyUserGroubByRoleList',// 分配员工
        getProject: "/bus/busProject/queryMyProjectList"
      },
      todoId: '',
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
    this.getProject();
  },
  methods: {
    add(record) {
      this.todoId = record.todoId
      // console.log('add',this.proId)
      this.milepost()
      this.handleAssignOptions()
      // this.edit(this.modelDefault);
      this.model = Object.assign({}, this.modelDefault);
      this.visible = true;
    },
    edit(record) {
      // 2023-5-12 待开发功能
      this.todoId = record.todoId
      this.milepost()
      this.handleAssignOptions()
      this.model = Object.assign({}, record);
      if (this.model.appoint) {
        this.model.appoint = this.model.appoint.split(',')
      } else {
        this.model.appoint = undefined
      }
      this.visible = true;
    },
    //获取项目列表
    getProject(){
      getAction(this.url.getProject).then((res) => {
        this.projectOptions = res.result
      })
    },
    //获取里程碑下拉列表
    milepost(id) {
      getAction(this.url.getById, { queryByProjectId: id }).then((res) => {
        this.dictOptions = res.result
      })
    },
    // 分配员工
    handleAssignOptions(id) {
      getAction(this.url.groubRoleUrl, { id: id }).then(res => {
        if (res.success && res.result.length != 0) {
          this.groubRoleList = res.result
        } else {
          this.groubRoleList = []
          // this.$message.warning(res.message)
        }
      })
    },
    handleProject(value) {
      this.milepost(value)
      this.handleAssignOptions(value)
    },
    submitForm(id) {
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
            this.model.id = this.todoId
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

.bindpro-model {
  /deep/ .ant-form-item {
    margin-bottom: 0;
  }

  /deep/ .ant-form-item label {
    font-weight: bold;
  }

  /deep/ .ant-form-item-label>label::after {
    content: ""
  }
}
</style>
