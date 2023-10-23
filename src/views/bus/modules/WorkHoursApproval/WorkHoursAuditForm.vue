<template>
  <a-spin :spinning="confirmLoading">
    <!-- 单据号：{{ model.recCode }} -->
    <!-- <a-divider /> -->
    <!-- 数据表格嵌套展示 -->
    <a-table :columns="columns" :data-source="data1" :pagination="false" rowKey="id">
      <template slot="daily" slot-scope="text, record">
        <a-tooltip placement="left">
          <template slot="title">
            {{ text }}
          </template>
          <a-icon type="read" style="font-size:20px" v-if="text"/>
      </a-tooltip>
      <a-icon type="read" style="font-size:20px" v-if="!text"/>
      </template>
    </a-table>
    <a-divider />
    <process-history :processId="busApplyAuditForm.instanceId" />
    <!-- 处理意见 --> 
    <a-row>
      <a-col :xs="12" :sm="8">
        <a-form-model-item label="处理意见：" :labelCol="labelCol2" :wrapperCol="wrapperCol">
          <j-dict-select-tag @change="opinionsChange" type="list" v-model="model.handleOpinions" dictCode="opinions"
            style="width: 100%" placeholder="常用审批语" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="12" :sm="8" v-if="ifShow=='1'">
        <a-form-model-item label="选择审批人：" :labelCol="labelCol2" :wrapperCol="wrapperCol">
          <a-select  style="width: 100%" @change="handleChange" v-model="model.nextApproveUser"  placeholder="请选择审批人">
            <a-select-option v-for="d in approveUserList" :key="d.id" :value="d.id">{{ d.realname }}</a-select-option>
          </a-select>
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
import { getAction, postAction } from '@/api/manage'
import ProcessHistory from '../ProcessHistory'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import { ajaxGetDictItems } from '@/api/api'
export default {
  name: 'WorkHoursAuditForm',
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
        sm: { span: 5 },
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      model: {},
      url: {
        details: '/bus/busProjectActual/getWorkHoursByapprId',
        getApproveUserList:'bus/busProjectActual/getApproveUserList',
        getStatusByUser:'bus/busProjectActual/getStatusByUser'
      },
      opinionsDict: [],
      columns: [
        {
          title: '项目名称',
          key: 'projectName',
          dataIndex: 'projectName',
        },
        {
          title: '里程碑',
          key: 'milepostCode',
          dataIndex: 'milepostCode',
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

      ],
      data1: [
        // {
        //   key: '1',
        //   datetime: '2022-12-9',
        //   alldatetime: 10,
        //   daily: '啦啦啦啦啦啦啦'
        // }
      ],
      approveUserList:[],
      ifShow:''
      
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
    this.getApproveUserList()
    this.getStatusByUser()
  },
  mounted() { },
  methods: {
    getStatusByUser(){
      getAction(this.url.getStatusByUser).then(res=>{
        if (res.success) {
          this.ifShow = res.result
        }
      })
    },
    handleChange(e){
      this.model.nextApproveUser = e
    },
    getApproveUserList(){
       getAction(this.url.getApproveUserList).then(res=>{
        if (res.success) {
          this.approveUserList = res.result
        }
       })
    },
    loadData(record) {
      postAction(this.url.details + '?id=' + record.apprId).then((res) => {
        if (res.success) {
          // console.log(res.result, 'res.resultres.resultres.result---')
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
  },
}
</script>

<style scoped>

</style>