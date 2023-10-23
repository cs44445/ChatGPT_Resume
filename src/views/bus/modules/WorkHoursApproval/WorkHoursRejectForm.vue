<template>
  <a-spin :spinning="confirmLoading">
    <a-table :columns="columns" :data-source="data1" :pagination="false" rowKey="id">
      <template slot="daily" slot-scope="text">
        <a-tooltip placement="left">
          <template slot="title">
            {{ text }}
          </template>
          <a-icon type="read" style="font-size:20px" />
        </a-tooltip>
      </template>
      <span slot="action" slot-scope="text, record">
        <!-- 修改工时 -->
        <a @click="handleTimeSheet(record)">修改</a>
      </span>
    </a-table>
    <a-divider />
    <process-history :processId="busApplyRejectForm.instanceId" />
    <!-- 处理意见 -->
    <a-row>
      <a-col :xs="24" :sm="8">
        <a-form-model-item label="处理意见：" :labelCol="labelCol2" :wrapperCol="wrapperCol">
          <j-dict-select-tag @change="opinionsChange" type="list" v-model="model.handleOpinions" dictCode="opinions"
            style="width: 100%" placeholder="常用审批语" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :sm="24">
        <a-form-model-item label :labelCol="labelCol" :wrapperCol="wrapperCol2">
          <a-textarea v-model="model.handleOpinions2" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
        </a-form-model-item>
      </a-col>
    </a-row>
    <!-- 修改弹窗 -->
    <div>
      <a-modal title="工时修改" :visible="timeSheetvisible" @ok="handleOk" @cancel="handleCancel">
        <a-form-model ref="timeSheetForm" :model="timeSheetModel" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }"
          :rules="validatorRules">
          <a-form-model-item label="正常工时(h)" prop="workHours">
            <a-input-number :min="0" v-model="timeSheetModel.workHours" placeholder="请输入文件名称" style="width:100%;"></a-input-number>
          </a-form-model-item>
          <a-form-model-item label="是否加班" prop="ifOvertime">
            <j-dict-select-tag v-model="timeSheetModel.ifOvertime" placeholder="请选择是否加班" dictCode="yn" />
          </a-form-model-item>
          <a-form-model-item label="加班类型"
            v-show="timeSheetModel.ifOvertime == '1'"
            :rules="timeSheetModel.ifOvertime == '1' ? validatorRules.overtimeType : []"
            prop="overtimeType">
            <j-dict-select-tag v-model="timeSheetModel.overtimeType" placeholder="请选择项加班类型" dictCode="overtime_type" />
          </a-form-model-item>
          <a-form-model-item label="加班工时(h)"
            v-show="timeSheetModel.ifOvertime == '1'"
            :rules="timeSheetModel.ifOvertime == '1' ? validatorRules.overtimeHours : []"
            prop="overtimeHours">
            <a-input-number style="width:100%;" :min="0" v-model="timeSheetModel.overtimeHours" placeholder="请输入文件名称"></a-input-number>
          </a-form-model-item>
          <a-form-model-item label="日报" prop="daily">
            <a-textarea v-model="timeSheetModel.daily" placeholder="请输入文件名称"></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
import { postAction, putAction } from '@/api/manage'
import ProcessHistory from '../ProcessHistory'
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import { validateDuplicateValue } from '@/utils/util'
import { ajaxGetDictItems } from '../../../../api/api'

export default {
  name: 'WorkHoursRejectForm',
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
      columns: [
        {
          title: '项目名称',
          key: 'projectName',
          dataIndex: 'projectName',
        },
        {
          title: '工时日期',
          key: 'workCalendar',
          dataIndex: 'workCalendar',
        },
        {
          title: '姓名',
          key: 'userName',
          dataIndex: 'userName',
        },
        {
          title: '总工时(h)',
          key: 'totalHours',
          dataIndex: 'totalHours',
        },
        {
          title: '正常工时(h)',
          key: 'workHours',
          dataIndex: 'workHours',
        },
        {
          title: '是否加班',
          key: 'ifOvertime_dictText',
          dataIndex: 'ifOvertime_dictText',
        },
        {
          title: '加班类型',
          key: 'overtimeType_dictText',
          dataIndex: 'overtimeType_dictText',
        },
        {
          title: '加班工时(h)',
          key: 'overtimeHours',
          dataIndex: 'overtimeHours',
        },
        {
          title: '日报',
          key: 'daily',
          dataIndex: 'daily',
          scopedSlots: { customRender: 'daily' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data1: [
        // {
        //   key: '1',
        //   datetime: '2022-12-9',
        //   alldatetime: 10,
        //   daily: '啦啦啦啦啦啦啦'
        // }
      ],
      url: {
        details: '/bus/busProjectActual/getWorkHoursByapprId',
        passUrl: '/bus/busProjectActual/workHoursPass',
        editTimesheet: '/bus/busProjectActual/editProjectActual'
      },
      opinionsDict: [],
      timeSheetModel: {
        workHours: "",
        ifOvertime: "",
        overtimeType: undefined,
        overtimeHours: "",
        daily: "",

      },
      timeSheetvisible: false,
      tableRecord: {},
      validatorRules: {
        workHours: [{ required: true, message: '请输入正常工时(h)' }],
        ifOvertime: [{ required: true, message: '请选择是否加班' }],
        overtimeType: [{ required: true, message: '请选择加班类型' }],
        overtimeHours: [{ required: true, message: '请输入正常工时(h)' }],
        daily: [{ required: true, message: '请输入日报' }]
      },
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    busApplyRejectForm: {},
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {
    this.loadData(this.busApplyRejectForm)
  },
  mounted() { },
  methods: {
    loadData(record) {
      postAction(this.url.details + '?id=' + record.apprId).then((res) => {
        if (res.success) {
          console.log(res.result, 'res.resultres.resultres.result---')
          this.data1 = res.result
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
    handleSubmit(status) {
      let that = this

      //如果表单有变化，需要在此处保存表单

      let params = {
        apprId: that.busApplyRejectForm.apprId,
        taskId: that.busApplyRejectForm.taskId,
        instanceId: that.busApplyRejectForm.instanceId,
        submitUser: that.busApplyRejectForm.submitUser,
        apprStatus: status, //1通过  2驳回
        apprRemark: that.model.handleOpinions2,
        remark: '',
      }
      postAction(that.url.passUrl, params).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('addok')
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleTimeSheet(record) {
      this.tableRecord = record
      this.timeSheetvisible = true
      this.timeSheetModel.workHours = record.workHours
      this.timeSheetModel.overtimeType = record.overtimeType
      this.timeSheetModel.overtimeHours = record.overtimeHours
      this.timeSheetModel.ifOvertime = record.ifOvertime
      this.timeSheetModel.daily = record.daily
    },
    handleCancel() {
      this.timeSheetvisible = false
    },
    handleOk() {
      // 触发表单验证
      this.$refs.timeSheetForm.validate(valid => {
        if (valid) {
          this.tableRecord.workHours = this.timeSheetModel.workHours
          this.tableRecord.ifOvertime = this.timeSheetModel.ifOvertime
          this.tableRecord.overtimeType = this.timeSheetModel.ifOvertime == '1' ?this.timeSheetModel.overtimeType : ''
          this.tableRecord.overtimeHours = this.timeSheetModel.ifOvertime == '1' ?this.timeSheetModel.overtimeHours : 0
          this.tableRecord.daily = this.timeSheetModel.daily
          putAction(this.url.editTimesheet, { ...this.tableRecord }).then((res) => {
            if (res.success) {
              this.loadData(this.busApplyRejectForm)
              this.$message.success('修改成功')
              this.timeSheetvisible = false
            } else {
              this.$message.warning(res.message)
            }
          });
        } else {
          return false;
        }
      })
    }
  },
}
</script>

<style scoped>

</style>