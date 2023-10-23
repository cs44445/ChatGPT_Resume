<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="里程碑名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="id">
              <a-select v-model="model.id" placeholder="请选择里程碑名称" @change="handleChange">
                <a-select-option  v-for="(item, key) in datalist" :key="key" :value="item.id">
                  {{item.milepostCode}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="计划投入工时" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="planHours">
              <a-input disabled v-model="model.planHours" addonAfter="小时" placeholder="请输入计划投入工时"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="实际投入工时" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="actualHours">
              <a-input disabled v-model="model.actualHours" addonAfter="小时" placeholder="请输入实际投入工时"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="相关文档" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileList">
              <j-upload v-model="model.fileList" :showUploadBtn="!formDisabled" :disabled="formDisabled"></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="补充说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" placeholder="请补充说明" :disabled="formDisabled" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'BusProjectForm',
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
    data () {
      return {
        model:{
          actualHours:'',
          planHours:''
         },
         defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/xxx.png',
        },
        {
          uid: '2',
          name: 'yyy.png',
          status: 'done',
          url: 'http://www.baidu.com/yyy.png',
        },
        {
          uid: '3',
          name: 'zzz.png',
          status: 'error',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/zzz.png',
        },
      ],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {},
        projectId:'',
        datalist:[],
        url: {
          add: "/bus/busProjectMilepost/complete",
          edit: "/bus/busProjectMilepost/complete",
          queryById: "/bus/busProject/queryById",
          queryMilepostByProjectId:'/bus/busProject/queryMilepostByProjectId',
          queryPlanActualHoursById:'/bus/busProjectMilepost/queryPlanActualHoursById'
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.projectId = record.projectId
        this.handleMilepost()
        // this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'post';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
     handleChange(value) {
       getAction(this.url.queryPlanActualHoursById, {id:value}).then((res) => {
          this.model.planHours=res.result.planHours
          this.model.actualHours=res.result.actualHours
        })
      },
      handleMilepost(){
        getAction(this.url.queryMilepostByProjectId, {id:this.projectId}).then((res) => {
          this.datalist=res.result
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
</style>
