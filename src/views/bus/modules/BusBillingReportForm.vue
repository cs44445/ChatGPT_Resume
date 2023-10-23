<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customCode">
              <a-select
                    @change="handleChangeCustom"
                    placeholder="请选择客户"
                    v-model="model.customId"
                    show-search
                    :filter-option="filterOption"
                    :options="customListData"
                    allowClear 
                    :disabled="disableSubmit"
                    :getPopupContainer="(target) => target.parentNode">

                </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <a-select
                    @change="handleChangeProject"
                    placeholder="请选择项目"
                    v-model="model.projectId"
                    show-search
                    :filter-option="filterOption"
                    :options="projectCodeOption"
                    allowClear 
                    :disabled="disableSubmit"
                    :getPopupContainer="(target) => target.parentNode">

                </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startTime">
              <j-date placeholder="请选择开始时间" :disabled="formDisabled" v-model="model.startTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <j-date placeholder="请选择结束时间" :disabled="formDisabled" v-model="model.endTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input :disabled="formDisabled" v-model="model.remark" placeholder="请输入备注"  ></a-input>
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
    name: 'BusBillingReportForm',
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
          add: "/bus/busCustomPayment/add",
          edit: "/bus/busCustomPayment/edit",
          // queryById: "/bus/busPaymentReport/queryById",
          getProjectCodeList:'/bus/busProject/list',
          customList: "/bus/busCustom/list",
        },
        projectCodeOption:[],
        customListData:[]
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
      this.getProjectCodeList()
      this.initCustomList()
    },
    methods: {
      initCustomList(){
        getAction(this.url.customList).then(res => {
          if(res.success){
            let result = res.result.records
            let dictOptions = []
            for (let i = 0; i < result.length; i++) {
                let temp = result[i];
                let item = {}
                item.label = temp.customName
                item.value = temp.id
                dictOptions.push(item);
            }
            this.customListData = dictOptions
          }else{
            this.$message.warning(res.message)
          }          
        })
      },
      getProjectCodeList(){
        getAction(this.url.getProjectCodeList).then(res=>{
          if(res.success){
          let result = res.result.records
          let dictOptions = []
            for (let i = 0; i < result.length; i++) {
                let temp = result[i];
                let item = {}
                item.label = temp.projectName
                item.value = temp.id
                dictOptions.push(item);
            }
            this.projectCodeOption = dictOptions
          }
        })
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      handleChangeCustom(val){
        this.model.customId = val
      },
      handleChangeProject(val){
        this.model.projectId = val
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
