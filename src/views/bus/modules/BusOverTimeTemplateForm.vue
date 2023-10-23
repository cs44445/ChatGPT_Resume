<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="模板名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="template">
              <a-input v-model="model.template" placeholder="请输入模板名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="普通加班工资系数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ordinaryOtSalaryRate">
              <a-input-number v-model="model.ordinaryOtSalaryRate" placeholder="请输入普通加班工资系数" style="width:100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="周六日加班工资系数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="saturdayDayRate">
              <a-input-number v-model="model.saturdayDayRate" placeholder="请输入周六日加班工资系数" style="width:100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="节假日加班工资系数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="specialOtSalaryRate">
              <a-input-number v-model="model.specialOtSalaryRate" placeholder="请输入节假日加班工资系数" style="width:100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="加班工时上限" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="overTimeLimit">
              <a-input-number v-model="model.overTimeLimit" placeholder="请输入加班工时上限" style="width:100%"></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  ></a-input>
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
    name: 'BusOverTimeTemplateForm',
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
          add: "/bus/busOverTimeTemplate/add",
          edit: "/bus/busOverTimeTemplate/edit",
          queryById: "/bus/busOverTimeTemplate/queryById"
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
    }
  }
</script>