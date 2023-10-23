<template>
  <a-spin :spinning="confirmLoading">
    <!-- 单据号：{{ model.recCode }} -->
      <!-- <a-divider /> -->
      <h4>工作者信息</h4>
      <j-form-container >
        
        <a-form-model ref="form" :model="model" slot="detail">
          <a-row class="form-info">
            <a-col :span="12">
              <a-form-model-item label="供应商名称" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.supplierName}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="个人邮箱" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.email==null?"":model.email}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="采购订单编号" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.procureOrderCode}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="公司邮箱" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.companyEmail}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="姓名" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.realname}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="申请客户邮箱" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.ifApplyEmail_dictText}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="证件类型" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.idType_dictText}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="年龄" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.age}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="证件号码" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.idNo}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="用户账号" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.username}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="性别" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.sex_dictText}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="别名" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.alias}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="汇报对象" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.reportTo}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="入职日期" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.inductionTime}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="职位（供应商）" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.companyDutiesName}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="邮箱（客户）" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.customEmail}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="价格（供应商）" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.companyPrice}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="职位（客户）" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.customDutiesName}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="是否修改价格" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.ifChangePrice_dictText}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="价格（客户）" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.customPrice}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="手机号码" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.phone}}
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="备注" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol">
                {{model.remark}}
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>
      <a-button type="default" @click="openModal">修改工作者信息</a-button>
      <a-divider />
      <process-history :processId="busApplyAuditForm.instanceId" />
      <supplier-worker-form ref="supplierWorkerModal"  @ok="modalFormOk"/>
       <!-- 处理意见 -->
      <a-row>
        <a-col :xs="24" :sm="8">
          <a-form-model-item label="处理意见：" :labelCol="labelCol2" :wrapperCol="wrapperCol">
            <j-dict-select-tag
              @change="opinionsChange"
              type="list"
              v-model="model.handleOpinions"
              dictCode="opinions" style="width:100%;"
              placeholder="常用审批语"
            />
          </a-form-model-item>
        </a-col>
        <a-col :xs="24" :sm="24">
          <a-form-model-item label :labelCol="labelCol" :wrapperCol="wrapperCol2">
            <a-textarea v-model="model.handleOpinions2" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
          </a-form-model-item>
        </a-col>
      </a-row>
  </a-spin>
</template>

<script>
import { getAction } from '../../../../api/manage'
import ProcessHistory from '../ProcessHistory'
import SupplierWorkerForm from './SupplierWorkerForm.vue'
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import { validateDuplicateValue } from '@/utils/util'
import {ajaxGetDictItems} from "../../../../api/api";

export default {
  name: 'SupplierWorkerRejectForm',
  mixins: [JEditableTableModelMixin],
  components: { 
    ProcessHistory,
    SupplierWorkerForm
  },
  data() {
    return {
      labelCol: {
        xs: { span: 14 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 17 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      model: {},
      url: {
        details: '/bus/busProjectUser/getWorkerInfoByApprId',
        // /busProjectUser/getWorkerInfoByApprId
      },
      opinionsDict:[],
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    busApplyAuditForm: {},
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {
    this.loadData(this.busApplyAuditForm)
  },
  mounted() {},
  methods: {
    loadData(record) {
      getAction(this.url.details, {
        apprId: record.apprId,
      }).then((res) => {
        if (res.success) {
          console.log(res.result,'res.resultres.resultres.result---')
          this.model = res.result.records[0]
        }
      })
      ajaxGetDictItems('opinions', null).then((res) => {
        if (res.success) {
          this.opinionsDict = res.result
        }
      })
    },
    opinionsChange(val) {
      this.opinionsDict.map((item) => {
        if (item.value === val) {
          this.model.handleOpinions2 = item.text
        }
      })
    },
    close() {
      this.visible = false
      this.$emit('close')
      this.$refs.form.clearValidate()
    },
    openModal() {
      this.$refs['supplierWorkerModal'].title = '完善信息'
      this.$refs.supplierWorkerModal.edit(this.model)
      // this.$refs.supplierWorkerModal.disableSubmit = true;
    },
    modalFormOk() {
      debugger
      this.loadData(this.busApplyAuditForm)
    },
  },
}
</script>

<style scoped>
.form-info /deep/.ant-form-item-children {
    display: inline-block;
}
</style>