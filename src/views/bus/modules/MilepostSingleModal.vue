<template>
  <j-modal :title="title" :width="width" :visible="visible" :closable="false"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" :maskClosable="false">
    <a-spin :spinning="confirmLoading">
      <div class="milestone-box">
        <div class="steps-right">
          <div class="steps-content">
            <a-form-model ref="stepform" :model="model" slot="detail" :rules="validatorRules">
              <a-row style="height:550px;overflow-y:scroll;">
                <a-col :span="24">
                  <a-form-model-item label="里程碑" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="milepostCode"
                    style="margin-bottom:12px;">
                    <a-select label-in-value placeholder="请选择里程碑" v-model="model.milepostCode" @change="onSelectChange">
                      <a-select-option v-for="d in selectDictOptions" :key="d.id" :value="d.id">{{
                        d.milepostCode
                      }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="owner"
                    style="margin-bottom:12px;">
                    <a-select placeholder="请选择负责人" v-model="model.owner" disabled>
                      <a-select-option :value="item.userId" v-for="item in leaderList" :key="item.userId">
                        {{ item.userName }}
                      </a-select-option>
                    </a-select>
                    <!-- <a-input placeholder="请输入负责人" v-model="model.owner" disabled> -->
                    <!-- </a-input> -->
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="周期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="period"
                    style="margin-bottom:12px;">
                    <a-range-picker style="width: 100%" v-model="model.period" @change="onChangeDate" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="预估采购成本" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    prop="estimatedProcurementCost" style="margin-bottom:12px;">
                    <a-input-number style="width: 100%" v-model="model.estimatedProcurementCost" placeholder="请输入预估采购成本"
                      :min="0"></a-input-number>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="预估差旅费用" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    prop="estimatedTravelCost" style="margin-bottom:12px;">
                    <a-input-number style="width: 100%" v-model="model.estimatedTravelCost" placeholder="请输入预估差旅费用"
                      :min="0"></a-input-number>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="预估分包费用" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    prop="estimatedSubcontractingCost" style="margin-bottom:12px;">
                    <a-input-number style="width: 100%" v-model="model.estimatedSubcontractingCost"
                      placeholder="请输入预估分包费用" :min="0"></a-input-number>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="预估其他费用" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    prop="estimatedOtherCost" style="margin-bottom:12px;">
                    <a-input-number style="width: 100%" v-model="model.estimatedOtherCost" placeholder="请输入预估其他费用"
                      :min="0"></a-input-number>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                    :label="index === 0 ? '预估人力成本' : ''"
                    v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" style="margin-bottom:0;">
                    <div style="display:flex;background: #ebebed;">
                      <div style="display:flex;justify-content: space-between;width: 88%;">
                        <a-form-model-item label="角色" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }"
                          style="width:45%;margin-bottom:0;">
                          <!-- <j-dict-select-tag v-model="domain.costRoleId" placeholder="请选择角色"
                              dictCode="bus_plan_labor_cost_role,rolename,id" style="width:100%;" /> -->
                          <a-select v-model="domain.costRoleId" :allowClear="true">
                            <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                              {{ item.roleName }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="预估工时(h)" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                          style="width:45%;margin-bottom:0;">
                          <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                        </a-form-model-item>
                        <a-form-model-item style="width:5%;margin-bottom:0;">
                          <a-icon v-if="model.milepostLaborList.length > 1" class="dynamic-delete-button" type="close"
                            :disabled="model.milepostLaborList.length === 1" @click="removeDomain(domain)" />
                        </a-form-model-item>
                      </div>
                      <a-form-model-item style="width:12%;margin-bottom:0;">
                        <a-icon type="plus" @click="addDomain" v-if="model.milepostLaborList.length - 1 == index" />
                      </a-form-model-item>
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="steps-right-btn">
                <!-- <a href="javascript:;" style="color: #b6b9bd" @click="resetForm">清空</a> -->
              </div>
            </a-form-model>
          </div>
        </div>
      </div>
    </a-spin>
    <template slot="footer">
      <a-popconfirm @confirm="() => handleCancel()">
        <template slot="title">
          <div>
            <p>确定取消吗?</p>
            <p>现在取消本次修改的里程碑将失效！</p>
          </div>
        </template>
        <a-button key="back"> 取消 </a-button>
      </a-popconfirm>
      <a-button key="submit" type="primary" @click="handleOk"> 提交 </a-button>
    </template>
  </j-modal>
</template>
<script>
import Vue from 'vue'
import moment from 'moment'
import { postAction, getAction } from '@/api/manage'
import { USER_INFO } from "@/store/mutation-types"
export default {
  name: 'MilepostModal',
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      confirmLoading: false,
      detailData: {},
      groubRoleList: [
        // {name:'shejishi',children:[{name:'111'}]},
        // {name:'gcs',children:[{name:'222'}]}
      ],
      leaderList: [],//负责人列表
      stepsAll: [{}],
      laborRoleList: [],//角色列表
      selectDictOptions: [],
      milepostText: '',
      model: {
        id: null,
        milepostCode: undefined,
        owner: undefined,
        period: [],
        beginTime: null,
        endTime: null,
        milepostLaborList: [
          {
            costRoleId: undefined,//角色
            estimatedHours: '',//工时
          }
        ],//预估人力成本
        estimatedProcurementCost: 0,//预估采购成本
        estimatedTravelCost: 0,//预估差旅费用
        estimatedSubcontractingCost: 0,//预估分包费用
        estimatedOtherCost: 0,//预估其他费用
      },
      validatorRules: {
        milepostCode: [{ required: true, message: '请选择里程碑!' }],
        owner: [{ required: true, message: '请选择负责人!' }],
        period: [{ required: true, message: '请选择周期' }],
        estimatedProcurementCost: [{ required: true, message: '请输入预估采购成本!' }],
        estimatedTravelCost: [{ required: true, message: '请输入预估差旅费用!' }],
        estimatedSubcontractingCost: [{ required: true, message: '请输入预估分包费用!' }],
        estimatedOtherCost: [{ required: true, message: '请输入预估其他费用!' }],
      },
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 17,
      },
      formItemLayout: {
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 17,
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          span: 17, offset: 5
        },
      },
      url: {
        add: '/bus/busProjectMilepost/add',
        groubRoleUrl: '/sys/user/queyUserGroubByRoleList',
        leaderUrl: '/bus/busProjectUser/queryUserInfoByProjectId',
        getMilepost: '/bus/busProjectMilepost/queryByProjectId',
        getMilepostDetail: '/bus/busProjectMilepost/queryById',
        milepostRoleList: '/bus/busProjectMilepost/milepostRoleList'
      },
    }
  },
  computed: {
    bgColor() {
      return (name) => {
        if (!name) return 'rgb(119, 153, 153)'
        var str = ''
        for (var i = 0; i < name.length; i++) {
          str += parseInt(name[i].charCodeAt(0), 10).toString(16)
        }
        return '#' + str.slice(0, 2) + str.slice(1, 2)
      }
    },
  },
  methods: {
    edit(record) {
      this.getMilepostData(record.id)
      this.getLeaderRole(record.id)
      this.getRoleList()
      this.visible = true
      this.model.owner = Vue.ls.get(USER_INFO).id
      this.detailData = record
    },
    //获取对应里程碑列表
    async getMilepostData(proId) {
      await getAction(this.url.getMilepost, { queryByProjectId: proId, owner: Vue.ls.get(USER_INFO).id }).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.selectDictOptions: ', res)
          this.selectDictOptions = res.result
        } else {
          this.selectDictOptions = []
        }
      })
    },
    //获取负责人列表
    getLeaderRole(proId) {
      getAction(this.url.leaderUrl, { projectId: proId }).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.leaderList: ', res)
          this.leaderList = res.result
        } else {
          this.leaderList = []
        }
      })
    },
    //获取角色列表
    getRoleList() {
      postAction(this.url.milepostRoleList).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.laborRoleList: ', res)
          this.laborRoleList = res.result
        } else {
          this.laborRoleList = []
        }
      })
    },
    //获取分配员工列表
    getGroubRole(id) {
      getAction(this.url.groubRoleUrl, { id: id }).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.tenantsOptions: ', res)
          this.groubRoleList = res.result
        } else {
          this.groubRoleList = []
        }
      })
    },
    onSelectChange(value) {
      this.model.milepostCode = value
      this.milepostText = value.label
      getAction(this.url.getMilepostDetail, { id: value.key }).then((res) => {
        if (res.success) {
          // console.log('this.selectDictOptions: ', res)
          // this.selectDictOptions = res.result
          if (res.result.beginTime) {
            this.model.period = [moment(res.result.beginTime), moment(res.result.endTime)]
            this.model.beginTime = res.result.beginTime
            this.model.endTime = res.result.endTime
          }
          this.model.milepostLaborList = (res.result.milepostLaborList && res.result.milepostLaborList.length > 0) ? res.result.milepostLaborList : [{ costRoleId: undefined, estimatedHours: '' }]
          this.model.estimatedProcurementCost = res.result.estimatedProcurementCost
          this.model.estimatedTravelCost = res.result.estimatedTravelCost
          this.model.estimatedSubcontractingCost = res.result.estimatedSubcontractingCost
          this.model.estimatedOtherCost = res.result.estimatedOtherCost
          this.model.id = res.result.id
        }
      })
      // console.log('onChange', value.key)
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
      this.model.staff = value
    },
    // 表单日期选择
    onChangeDate(date, dateString) {
      // console.log(date, dateString, this.model.period);
      if (this.model.period) {
        this.model.beginTime = dateString[0]
        this.model.endTime = dateString[1]
      }
    },
    // 移除一条预估人力成本
    removeDomain(item) {
      let index = this.model.milepostLaborList.indexOf(item);
      if (index !== -1) {
        this.model.milepostLaborList.splice(index, 1);
      }
      // console.log('del', this.model.milepostLaborList)
    },
    // 新增一条预估人力成本
    addDomain() {
      // console.log('add', this.model.milepostLaborList)
      this.model.milepostLaborList.push({
        costRoleId: undefined,//角色
        estimatedHours: '',//工时
      });
    },
    // 提交里程碑
    handleOk() {
      // 触发表单验证
      this.$refs.stepform.validate((valid) => {
        // debugger
        if (valid) {
          this.stepsAll[0].milepostCode = this.milepostText
          this.stepsAll[0].owner = this.model.owner
          this.stepsAll[0].period = this.model.period
          this.stepsAll[0].beginTime = this.model.beginTime
          this.stepsAll[0].endTime = this.model.endTime
          this.stepsAll[0].milepostLaborList = this.model.milepostLaborList
          this.stepsAll[0].estimatedProcurementCost = this.model.estimatedProcurementCost
          this.stepsAll[0].estimatedTravelCost = this.model.estimatedTravelCost
          this.stepsAll[0].estimatedSubcontractingCost = this.model.estimatedSubcontractingCost
          this.stepsAll[0].estimatedOtherCost = this.model.estimatedOtherCost
          this.stepsAll[0].id = this.model.id //里程碑id
          // 赋值项目id
          this.stepsAll[0].projectId = this.detailData.id
          //"ifMilePostStatus":2//状态1新增2删除3修改
          this.stepsAll[0].ifMilePostStatus = 3
          postAction(this.url.add, { busProjectMilepostList: this.stepsAll }).then((res) => {
            if (res.success) {
              // console.log(999999, res)
              this.$message.success('提交成功')
              this.visible = false
              this.model.milepostCode = undefined
              this.model.period = []
              this.model.beginTime = null
              this.model.endTime = null
              this.model.milepostLaborList = [//预估人力成本
                {
                  costRoleId: undefined,//角色
                  estimatedHours: '',//工时
                }
              ]
              this.model.estimatedProcurementCost = 0
              this.model.estimatedTravelCost = 0
              this.model.estimatedSubcontractingCost = 0
              this.model.estimatedOtherCost = 0
              this.model.id = null
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.warning('请填写里程碑信息')
        }
      })
      // console.log('this.delSteps', this.delSteps, this.stepsAll)

    },
    //表单清空
    resetForm() {
      this.model.id = null
      this.model.milepostCode = undefined
      this.model.owner = undefined
      this.model.period = []
      this.model.beginTime = null
      this.model.endTime = null
      this.model.milepostLaborList = [
        {
          costRoleId: undefined,//角色
          estimatedHours: '',//工时
        }
      ]
      this.model.estimatedProcurementCost = 0
      this.model.estimatedTravelCost = 0
      this.model.estimatedSubcontractingCost = 0
      this.model.estimatedOtherCost = 0
    },
    // 取消里程碑
    handleCancel() {
      this.visible = false
      this.model.id = null
      this.model.milepostCode = undefined
      this.model.owner = undefined
      this.model.period = []
      this.model.beginTime = null
      this.model.endTime = null
      this.model.milepostLaborList = [
        {
          costRoleId: undefined,//角色
          estimatedHours: '',//工时
        }
      ]
      this.model.estimatedProcurementCost = 0
      this.model.estimatedTravelCost = 0
      this.model.estimatedSubcontractingCost = 0
      this.model.estimatedOtherCost = 0
    },
  },
}
</script>
<style lang="less" scoped>
.milestone-box {
  min-height: 650px;
}

.milestone-box /deep/ .ant-steps-item-title {
  position: absolute;
  left: -22%;
  text-align: right;
  width: 22%;
}

.milestone-box /deep/ .steps-right {
  position: absolute;
  right: 2%;
  top: -15px;
  width: 96%;
  // min-height: 450px;
}

.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 650px;
  text-align: center;
  padding-top: 15px;
  position: relative;
}

.steps-right-btn {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 20px 0;
  border-top: 1px dashed #d9dbdd;
  width: 90%;
  text-align: left;
  z-index: 99;
  background: #fafafa;
}

.steps-right-btn a {
  margin-right: 20px;
}

.add-step-sty {
  position: relative;
}

.add-step-sty>span {
  position: absolute;
  display: inline-block;
  height: 13px;
  width: 1px;
  left: 11px;
  top: -18px;
  background: #e8e8e8;
}

.cust-select-sty {
  border-radius: 15px;
  background: #e8f4ff;
  display: flex;
  padding-right: 5px;
}

.cust-select-sty span:first-child {
  border-radius: 50%;
  width: 25px;
  text-align: center;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
}

.cust-select-sty span:last-child {
  color: #b2c7e0;
  font-size: 17px;
  width: 25px;
  text-align: center;
}

/deep/ .ant-select-selection__choice__content {
  &>.cust-select-sty span:last-child {
    display: none;
  }
}

/deep/ .has-error .ant-form-explain,
.has-error .ant-form-split {
  text-align: left;
}</style>