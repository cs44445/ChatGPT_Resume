<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row class="form-content">
          <a-col :span="24">
            <a-form-model-item label="里程碑" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="milepostId">
              <a-select v-model="model.milepostId" placeholder="请选择里程碑名称">
                <a-select-option  v-for="(item, key) in datalist" :key="key" :value="item.id">
                  {{item.milepostCode}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
            <a-col :span="12">
              <a-form-model-item label="每期金额(元)" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="money">
                <a-input-number style="width:100%" :formatter="value => `¥ ${value}`" :disabled="formDisabled" v-model="model.money" placeholder="每期金额"></a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="预算税费系数" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxCoefficient">
                <a-input-number :disabled="formDisabled" style="width:100%" v-model="model.taxCoefficient" placeholder="请输入预算税费系数"></a-input-number>
              </a-form-model-item>
            </a-col>
        </a-row>
        <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
          <a-col :span="12">
            <a-form-model-item label="周期" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="budgetCycle">
             <j-dict-select-tag v-model="model.budgetCycle" placeholder="请选择周期" dictCode="budgetCycle" :disabled="formDisabled" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="期数" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dateNumber">
              <a-input :disabled="formDisabled" v-model="model.dateNumber" placeholder="请输入期数"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
         <a-col :span="24">
            <a-form-model-item label="开始时间" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="beginTime">
              <j-date style="width: 100%"  v-model="model.beginTime"  placeholder="请选择开始时间" showTime dateFormat="YYYY-MM-DD" ></j-date>
            </a-form-model-item>
          </a-col>

        </a-row>

          <a-col :span="24">
            <a-form-model-item label="预算流向说明" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="budgetExplain">
              <a-input :disabled="formDisabled" v-model="model.budgetExplain" placeholder="请输入预算流向说明" ></a-input>
           </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <!-- 预览 -->
    <preview-modal ref="preview" @uploadList="uploadList"></preview-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import PreviewModal from './PreviewModal.vue'
  export default {
    name: 'BusProjectForm',
    components: {
      PreviewModal
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
          sm: { span: 24 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
        confirmLoading: false,
        validatorRules: {
          budgetExplain:{required: true, message: '请输入预算流向说明!'},
          budgetCycle:{required: true, message: '请选择周期!'},
          dateNumber:{required: true, message: '请输入期数!'},
          beginTime:{required: true, message: '请输入开始时间!'},
          money:{required: true, message: '请输入每期金额!'},
        },
        datalist:[],
        url: {
          add: "/bus/busProjectBudget/add",
          edit: "/bus/busProjectBudget/edit",
          queryById: "/bus/busProject/queryById",
          queryMilepostByProjectId:'/bus/busProject/queryMilepostByProjectId'
        },
        projectId:"",
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
        this.projectId = this.model.projectId
        this.handleMilepost()
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            // that.confirmLoading = true;
            this.$refs.preview.edit(this.model)
            this.$refs.preview.title = '预览循环采购'
            this.$refs.preview.disableSubmit = false
            // let httpurl = '';
            // let method = '';
            // if(!this.model.id){
            //   httpurl+=this.url.add;
            //   method = 'post';
            // }else{
            //   httpurl+=this.url.edit;
            //    method = 'put';
            // }
            // this.model.projectId=this.$route.query.projectId
            // this.model.purchaseType=1
            // httpAction(httpurl,this.model,method).then((res)=>{
            //   if(res.success){
            //     that.$message.success(res.message);
            //     that.$emit('ok');
            //     this.$emit('uploadList')
            //   }else{
            //     that.$message.warning(res.message);
            //   }
            // }).finally(() => {
              // that.confirmLoading = false;
            // })
          }

        })
      },
      searchReset() {
      this.model = {}
      },
       uploadList(){
        this.$emit('uploadList')
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
.form-content {
  margin-bottom: 20px;
  /deep/ .ant-form-item {
    margin-bottom: 0px;
  }
  /deep/ .ant-form-item label {
    font-weight: bold;
  }
}

::v-deep .ant-select-selection {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
::v-deep .ant-input-number{
  border: none;
}
::v-deep .ant-input-number-input {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
::v-deep .ant-input {
  background: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
</style>