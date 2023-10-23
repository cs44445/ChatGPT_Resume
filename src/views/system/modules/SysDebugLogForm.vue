<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="类名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="clazzName">
              <a-input v-model="model.clazzName" placeholder="请输入类名" :readonly="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报错方法名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="postMethod">
              <a-input v-model="model.postMethod" placeholder="请输入报错方法名" :readonly="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
          
          <a-col :span="24">
            <a-form-model-item label="报错数据" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="errorData">
              <a-textarea v-model="model.errorData" rows="30" placeholder="请输入报错数据" />
            </a-form-model-item>
          </a-col>
          
          <!-- <a-col :span="24">
            <a-form-model-item label="是否是异常" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ifException">
              <j-dict-select-tag type="list" v-model="model.ifException" dictCode="" placeholder="请选择是否是异常" />
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'SysDebugLogForm',
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
          add: "/bus/sysDebugLog/add",
          edit: "/bus/sysDebugLog/edit",
          queryById: "/bus/sysDebugLog/queryById"
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