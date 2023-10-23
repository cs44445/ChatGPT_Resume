<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="预算流向说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="budgetExplain">
              <a-input :disabled="true" v-model="model.budgetExplain" placeholder="请输入预算流向说明" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="money">
              <a-input :disabled="formDisabled" v-model="model.money" addonAfter="(¥)" placeholder="请输入金额(¥)"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="期数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dateNumber">
              <a-input :disabled="true" v-model="model.dateNumber" placeholder="请输入期数"  ></a-input>
            </a-form-model-item>
          </a-col>
         <a-col :span="24">
            <a-form-model-item label="税费系数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxCoefficient">
              <a-input :disabled="true" v-model="model.taxCoefficient" placeholder="请输入税费系数"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="beginTime">
              <j-date style="width: 100%"  v-model="model.beginTime"  placeholder="请选择开始时间" showTime dateFormat="YYYY-MM-DD" ></j-date>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endTime">
              <j-date style="width: 100%"  v-model="model.endTime"  placeholder="请选择结束时间" showTime dateFormat="YYYY-MM-DD" ></j-date>
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
    name: 'PrevisualizationForm',
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
          add: "/bus/busProjectBudget/add",
          edit: "/bus/busProjectBudget/edit",
          queryById: "/bus/busProject/queryById"
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

            that.$emit('ok',this.model);

            that.confirmLoading = false;
          }
        })
      },
    }
  }
</script>
