<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-model-item label="业务编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="busiNo">
              <a-input-number v-model="model.busiNo" placeholder="请输入业务编号" style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="业务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="busiName">
              <a-input v-model="model.busiName" placeholder="请输入业务名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="主题类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subjectType">
              <!-- <a-input v-model="model.subjectType" placeholder="请输入主题类型 流程名-日期"  ></a-input> -->
              <j-dict-select-tag  v-model="model.subjectType" placeholder="请选择主题类型" dictCode="busi_type"/>
            </a-form-model-item>
            
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注信息" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remarks">
              <a-input v-model="model.remarks" placeholder="请输入备注信息"  ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="删除标记（0：正常；1：删除）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag">
              <a-input v-model="model.delFlag" placeholder="请输入删除标记（0：正常；1：删除）"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="机构id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orgCode">
              <a-input v-model="model.orgCode" placeholder="请输入机构id"  ></a-input>
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
    name: 'FlowProcBusiForm',
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
           busiNo: [
              { required: true, message: '请输入业务编号!'},
           ],
           busiName: [
              { required: true, message: '请输入业务名称!'},
           ],
           delFlag: [
              { required: true, message: '请输入删除标记（0：正常；1：删除）!'},
           ],
        },
        url: {
          add: "/api/flowProcBusi/insert",
          edit: "/api/flowProcBusi/update",
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