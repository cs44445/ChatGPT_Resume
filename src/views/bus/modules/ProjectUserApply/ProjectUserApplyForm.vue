<template>
  <a-spin :spinning="confirmLoading">
    单据号：{{ model.recCode }}
      <a-divider />
      <j-form-container >
        <a-form-model ref="form" :model="model" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="申请人" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input disabled v-model="model.userName" placeholder="请输入申请人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="项目编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input disabled v-model="model.projectCode" placeholder="请输入编号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input disabled v-model="model.projectName" placeholder="请输入名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input disabled v-model="model.principal" placeholder="请输入负责人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input disabled v-model="model.remark" placeholder="请输入备注"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>

      <a-divider />
      <process-history :processId="busApplyAuditForm.instanceId" />
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
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import { validateDuplicateValue } from '@/utils/util'
import {ajaxGetDictItems} from "../../../../api/api";

export default {
  name: 'BusApplyAuditForm',
  mixins: [JEditableTableModelMixin],
  components: { ProcessHistory },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      model: {},
      url: {
        details: '/bus/busProjectUser/queryById',
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
        id: record.apprId,
      }).then((res) => {
        if (res.success) {
          console.log(res.result,'res.resultres.resultres.result---')
          this.model = res.result
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
  },
}
</script>

<style scoped>
</style>