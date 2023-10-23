<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <!-- <a-col :span="24">
            <a-form-model-item label="采购订单编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="procureOrderCode">
              <a-input :disabled="formDisabled" v-model="model.procureOrderCode" placeholder="请输入采购订单编码"  ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="供应商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyId">
              <a-select :disabled="formDisabled" v-model="model.companyId" placeholder="请选择供应商" class="tablePageQueryCss">
                    <!-- <a-select-option value="">请选择</a-select-option> -->
                    <a-select-option v-for="(item, key) in companyList" :key="key" :value="item.id">{{item.name}}</a-select-option>
                   
                  </a-select>
              <!-- <a-input :disabled="formDisabled" v-model="model.companyId" placeholder="请输入供应商id"  ></a-input> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <!-- <a-input :disabled="formDisabled" v-model="model.projectId" placeholder="请输入项目id"  ></a-input> -->
              <a-select :disabled="formDisabled" v-model="model.projectId" placeholder="请选择项目" class="tablePageQueryCss">
                    <!-- <a-select-option value="">请选择</a-select-option> -->
                    <a-select-option v-for="(item, key) in projectList" :key="key" :value="item.id">{{item.projectName}}</a-select-option>
                   
                  </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="成本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="costType">
              <j-dict-select-tag :disabled="formDisabled" v-model="model.costType" placeholder="请选择成本类型" dictCode="cost_type" />
              <!-- <a-input :disabled="formDisabled" v-model="model.costType" placeholder="请输入成本类型"  ></a-input> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="预估数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="estimateNum">
              <a-input-number :disabled="formDisabled" v-model="model.estimateNum" placeholder="请输入预估数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="价格" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="price">
              <a-input-number :disabled="formDisabled" v-model="model.price" placeholder="请输入价格" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="预估成本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="estimateCost">
              <a-input-number :disabled="formDisabled" v-model="model.estimateCost" placeholder="请输入预估成本" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订单日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderDate">
              <j-date placeholder="请选择订单日期" :disabled="formDisabled" v-model="model.orderDate" :show-time="false" date-format="YYYY-MM-DD" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订单状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderStatus">
              <j-dict-select-tag :disabled="formDisabled" v-model="model.orderStatus" placeholder="请输入订单状态" dictCode="order_status" />
              <!-- <a-input :disabled="formDisabled" v-model="model.orderStatus" placeholder="请输入订单状态"  ></a-input> -->
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
    name: 'BusCompanyPoForm',
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
          companyId: [{ required: true, message: '请选择供应商' }],
          projectId: [{ required: true, message: '请选择项目' }],
          costType: [{ required: true, message: '请选择成本类型' }],
          orderDate: [{ required: true, message: '请选择订单日期' }],
          estimateNum: [ { validator: this.validateEstimateNum }],
          price: [ { validator: this.validatePrice }],
          estimateCost: [ { validator: this.validateEstimateCost }],
        },
        url: {
          add: "/bus/busCompanyPo/add",
          edit: "/bus/busCompanyPo/edit",
          queryById: "/bus/busCompanyPo/queryById",
        },
        companyList: [],
        projectList: [],
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
      // this.getCompanyList()
      // this.getprojectList()
    },
    methods: {
      add (companyList,projectList) {
        this.edit(this.modelDefault,companyList,projectList);
      },
      edit (record,companyList,projectList) {
        this.companyList = companyList
        this.projectList = projectList
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
      validateEstimateNum(rule, value, callback) {
         //成本类型为计件
        if (this.model.costType == '2' && !value)   
          callback("请输入预估数量")
        else callback()
      },
      validatePrice(rule, value, callback) {
         //成本类型为计件
        if (this.model.costType == '2' && !value)   
          callback("请输入价格")
        else callback()
      },
      validateEstimateCost(rule, value, callback) {
         //成本类型为计件或固定成本
        if ((this.model.costType == '2' || this.model.costType == '3') && !value)   
          callback("请输入预估成本")
          else callback()
      },
    }
  }
</script>
<style lang="less" scoped>
/deep/ .ant-select-selection {
    background-color: #ffffff !important;
}
</style>
