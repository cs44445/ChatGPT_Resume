<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="formDisabled" v-model="model.projectCode" placeholder="请输入编号" @input="ChangeIdentifier"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input disabled v-model="model.projectName" placeholder="请输入名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input disabled v-model="model.principalText" placeholder="请输入负责人"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="formDisabled" v-model="model.remark" placeholder="请输入备注"></a-input>
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
    name: 'ProjectApplicationForm',
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
          projectName:'',
          principalText:''
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
        },
        url: {
          add: "/bus/busProjectUser/add",
          edit: "/bus/busProjectUser/add",
          queryById: "/bus/busProject/queryById",
          selectByProjectCode:"/bus/busProject/selectByProjectCode"
        },
        principalOptions:[],
        employId:''
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
      this.employId=this.$route.query.ids
    },
    methods: {
      onChange(checked) {
        console.log(`a-switch to ${checked}`);
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
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
               method = 'put';
            }
            this.model.projectId=this.employId
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                this.$emit('noticelist');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      ChangeIdentifier(eve){
        getAction(this.url.selectByProjectCode, {projectCode: eve.target.value}).then((res) => {
          if(res.success){
            this.model.projectName=res.result.projectName
            this.model.principalText=res.result.principalText
          }else{
            this.model.projectName=""
            this.model.principalText=""
          }
        })
      }
    }
  }
</script>
<style scoped>
.titleCss{
  font-family: SourceHanSansSC;
    font-weight: 400;
    font-size: 18px;
}
</style>
