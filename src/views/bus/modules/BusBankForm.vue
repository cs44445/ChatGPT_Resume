<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="银行账号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bankCard">
              <a-input v-model="model.bankCard" placeholder="请输入银行账号" :disabled="formDisabled" type='number'></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开户行名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bankName">
              <a-input v-model="model.bankName" placeholder="请输入开户行名称" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收款方名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入收款方名称" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收款方联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入收款方联系方式" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>

    <company-modal ref="modalForm" @ok="modalFormOk"></company-modal>
  </a-spin>
</template>

<script>

import { httpAction, getAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { duplicateCheck } from '@/api/api'
// import BusCompanyModal from '../modules/BusCompanyModal'

export default {
  name: 'BusBankForm',
  components: {
    CompanyModal: () => import("../modules/BusCompanyModal")
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    ifShowCompany2: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {
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
        bankCard: [
          { required: true, message: '请输入银行账号!' },
        ],
        bankName: [
          { required: true, message: '请输入开户行名称!' },
        ],
        name: [
          { required: true, message: '请输入收款方名称!' },
        ],
        phone: [
          { required: true, message: '请输入收款方联系方式!' }, { validator: this.validatePhone }
        ]
      },
      url: {
        bankAdd: "/bus/busCompanyBank/add"
      },
      companyOptions: [],
      projectId:'',
      current:''
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
    ifShowCompany() {
      return this.ifShowCompany2
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model));
  },
  mounted() {
    this.initCompanyList()
  },
  methods: {
    add(val) {
      if(val.supplier){
        this.current = 'supplier'
        this.projectId = val.projectId
      }
      else if(val.client){
        this.current = 'client'
        this.projectId = val.projectId
      }
      this.edit(this.modelDefault);
    },
    edit(record) {
      this.model = Object.assign({}, record);
      this.visible = true;
    },
    submitForm() {
      const that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (that.current == 'supplier' || that.current == 'client') {
            if(that.current == 'supplier'){
              this.model.companyId = this.projectId
            }
            else if(that.current == 'client'){
              this.model.customId = this.projectId
            }
            postAction(that.url.bankAdd, this.model).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok');
              } else {
                that.$message.warning(res.message)
              }
            })
          }
          else {
            that.$emit('ok', this.model);
          }
        }

      })
    },
    handleAddQuick() {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "快速添加";
      this.$refs.modalForm.contacttab = false;
    },
    modalFormOk() {
      this.initCompanyList()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    initCompanyList() {
      getAction("/sys/dict/getDictItems/" + "bus_company,name,id,del_flag!='1' order by create_time desc").then(res => {
        if (res.success) {
          let result = res.result
          let dictOptions = []
          for (let i = 0; i < result.length; i++) {
            let temp = result[i];
            let item = {}
            item.label = temp.title
            item.value = temp.value
            dictOptions.push(item);
          }
          this.companyOptions = dictOptions
        } else {
          this.$message.warn(`获取失败：` + res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          var params = {
            tableName: 'bus_company_bank',
            fieldName: 'phone',
            fieldVal: value,
            dataId: ''
          };
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback("手机号已存在!")
            }
          })
        } else {
          callback("请输入正确格式的手机号码!");
        }
      }
    },
  }
}
</script>