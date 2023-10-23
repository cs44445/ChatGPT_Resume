<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <!-- <div class="budget"> -->
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail" class="budget">
        <a-row type="flex" justify="space-between" v-has="'project:budget1'">
          <a-col :xxl="4" :xl="4" :sm="8" >
            <a-card :bordered="false" class="card">
              <p>可用项目总预算(￥)</p>
              <h3><span :style="{color:getColor(pageOthers.residueTotalBudget, 'default')}">{{pageOthers.residueTotalBudget | moneyFormat}}</span> /<span style="font-size:12px;color: #8d9399;">{{
               pageOthers.totalBudget | moneyFormat  }}</span></h3>
              <a-progress :percent="(pageOthers.totalBudgetCost || '').slice(0, -1)" size="small"
                :strokeColor="getColor(pageOthers.totalBudgetCost,'percent')" :show-info="false" />

                <span class="percent" :style="{color:getColor(pageOthers.totalBudgetCost,'percent')}">{{getText(pageOthers.totalBudgetCost) }}</span>
            </a-card>
          </a-col>
          <a-col :xxl="4" :xl="4" :sm="8" >
            <a-card :bordered="false" class="card">
              <p>可用人力预算(￥)</p>
              <h3><span :style="{color:getColor(pageOthers.residueRoleBudget, 'default')}">{{ pageOthers.residueRoleBudget | moneyFormat}}</span> /<span style="font-size:12px;color: #8d9399;">{{ pageOthers.roleBudget | moneyFormat
              }}</span></h3>
              <a-progress :percent="(pageOthers.roleBudgetCost || '').slice(0, -1)" size="small"
                :strokeColor="getColor(pageOthers.roleBudgetCost,'percent')" :show-info="false" />
              <span class="percent" :style="{color:getColor(pageOthers.roleBudgetCost,'percent')}">{{getText(pageOthers.roleBudgetCost) }}</span>
            </a-card>

          </a-col>
          <a-col :xxl="4" :xl="4" :sm="8" >
            <a-card :bordered="false" class="card">
              <p>可用采购预算(￥)</p>
              <h3><span :style="{color:getColor(pageOthers.residuePurchaseBudget, 'default')}">{{pageOthers.residuePurchaseBudget | moneyFormat}}</span> /<span style="font-size:12px;color: #8d9399;">{{
                pageOthers.purchaseBudget | moneyFormat }}</span></h3>
              <a-progress :percent="(pageOthers.purchaseBudgetCost || '').slice(0, -1)" size="small"
                :strokeColor="getColor(pageOthers.purchaseBudgetCost,'percent')" :show-info="false" />
              <span class="percent" :style="{color:getColor(pageOthers.purchaseBudgetCost,'percent')}">{{getText(pageOthers.purchaseBudgetCost) }}</span>
            </a-card>
          </a-col>
          <a-col :xxl="4" :xl="4" :sm="8">
            <a-card :bordered="false" class="card">
              <p>可用分包预算(￥)</p>
              <h3><span :style="{color:getColor(pageOthers.residueSubpackageBudget, 'default')}">{{ pageOthers.residueSubpackageBudget | moneyFormat}}</span> /<span style="font-size:12px;color: #8d9399;">{{
                pageOthers.subpackageBudget | moneyFormat}}</span></h3>
              <a-progress :percent="(pageOthers.subpackageBudgetCost || '').slice(0, -1)" size="small"
                :strokeColor="getColor(pageOthers.subpackageBudgetCost,'percent')" :show-info="false" />
              <span class="percent" :style="{color:getColor(pageOthers.subpackageBudgetCost,'percent')}">{{getText(pageOthers.subpackageBudgetCost) }}</span>
            </a-card>
          </a-col>
          <a-col :xxl="4" :xl="4" :sm="8" >
            <a-card :bordered="false" class="card">
              <p>可用差旅预算(￥)</p>
              <h3><span :style="{color:getColor(pageOthers.residueTravelBudget, 'default')}">{{ pageOthers.residueTravelBudget | moneyFormat}}</span> /<span style="font-size:12px;color: #8d9399;">{{
                pageOthers.travelBudget | moneyFormat }}</span></h3>
              <a-progress :percent="(pageOthers.travelBudgetCost || '').slice(0, -1)" size="small"
                :strokeColor="getColor(pageOthers.travelBudgetCost,'percent')" :show-info="false" />
              <span class="percent" :style="{color:getColor(pageOthers.travelBudgetCost,'percent')}">{{getText(pageOthers.travelBudgetCost) }}</span>
            </a-card>
          </a-col>
          <a-col :xxl="4" :xl="4" :sm="8" >
            <a-card :bordered="false" class="card">
              <p>可用其他预算(元)</p>
              <h3><span :style="{color:getColor(pageOthers.residueOtherBudget, 'default')}">{{ pageOthers.residueOtherBudget | moneyFormat }}</span> /<span style="font-size:12px;color: #8d9399;">{{
               pageOthers.otherBudget | moneyFormat }}</span></h3>
              <a-progress :percent="(pageOthers.otherBudgetCost || '').slice(0, -1)" size="small"
                :strokeColor="getColor(pageOthers.otherBudgetCost,'percent')" :show-info="false" />
              <span class="percent" :style="{color:getColor(pageOthers.otherBudgetCost,'percent')}">{{getText(pageOthers.otherBudgetCost) }}</span>
            </a-card>
          </a-col>
        </a-row>
        <a-card :bordered="false" title="采购" class="table" v-has="'project:budget2'">
          <div class="extra-wrapper" slot="extra">
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleLoop">
                  <a-menu-item key="Circular">循环采购</a-menu-item>
                  <a-menu-item key="Onlyone">一次性采购</a-menu-item>
                  <a-menu-item key="Subpackage">分包费用</a-menu-item>
                  <a-menu-item key="Travel">差旅报销</a-menu-item>
                  <a-menu-item key="Other">其他</a-menu-item>
                </a-menu>
              </template>
              <a-button icon="plus" type="primary" style="border:#1990ff; font-weight: bold;">添加 </a-button>
            </a-dropdown>
          </div>
          <a-table ref="table" size="small" rowKey="id" :columns="columns" :dataSource="datasoure"
            :loading="loading" :pagination="true" class="j-table-force-nowrap">
            <span slot="money" slot-scope="text">
              <span>{{ text | moneyFormat }}</span>
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="handleLoopEdit(record)" style="color:#2f3133" v-if="record.purchaseType!=='人力成本'"><a-icon type="edit"></a-icon></a>
              <!-- <a-divider type="vertical" /> -->
              &nbsp;&nbsp;
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a style="color:#1990ff" v-if="record.purchaseType!=='人力成本'"><img src="~@/assets/delete.svg" width="20px" style="margin-bottom:5px;"></a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-card>

        <a-card :bordered="false" title="预算使用情况" class="chart" v-has="'project:budget3'">

          <div id="myChart1" style="height: 300px;width:100%"></div>
        </a-card>
      </a-form-model>
      <!-- </div> -->
    </j-form-container>
    <!-- 循环采购 -->
    <circulate-modal ref="circle" @uploadList="uploadList"></circulate-modal>
    <!-- 编辑循环采购 -->
    <editloop-modal ref="editloop" @uploadList="uploadList"></editloop-modal>
    <!-- 一次性采购 -->
    <onlyone-modal ref="onlyone" @uploadList="uploadList"></onlyone-modal>
    <!-- 差旅报销 -->
    <reimbursement-modal ref="reimbursement" @uploadList="uploadList"></reimbursement-modal>
    <!-- 其他 -->
    <hetero-modal ref="hetero" @uploadList="uploadList"></hetero-modal>
    <!-- 分包采购 -->
    <subpackages-modal ref="subpackage" @uploadList="uploadList"></subpackages-modal>
  </a-spin>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, deleteAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import CirculateModal from './CirculateModal.vue'
import OnlyoneModal from './OnlyoneModal.vue'
import ReimbursementModal from './ReimbursementModal.vue'
import HeteroModal from './HeteroModal.vue'
import EditloopModal from './EditloopModal.vue'
import SubpackagesModal from './SubpackagesModal.vue'
export default {
  name: 'BudgetForm',
  components: {
    CirculateModal, OnlyoneModal, ReimbursementModal, HeteroModal, EditloopModal, SubpackagesModal
  },
  props: ['projectId'],
  props: {
    projectId: {
      type: String
    },
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      projectId: "",
      greenColor: "#08C35C",
      yellowColor: "#F2B202",
      redColor: "#D92929",
      paramsObj: {},
      model: {
      },
      loading: false,
      columns: [
        {
          title: '预算流向',
          align: "left",
          dataIndex: 'purchaseType'
        },
        {
          title: '流向说明',
          align: "left",
          dataIndex: 'budgetExplain'
        },
        {
          title: '里程碑',
          align: "left",
          dataIndex: 'milepostName'
        },
        {
          title: '金额(元)',
          align: "left",
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' }
        },
        {
          title: '期数',
          align: "left",
          dataIndex: 'dateNumber'
        },
        {
          title: '税费系数',
          align: "left",
          dataIndex: 'taxCoefficient'
        },
        {
          title: '开始时间',
          align: "left",
          dataIndex: 'beginTime'
        },
        {
          title: '结束时间',
          align: "left",
          dataIndex: 'endTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: "center",
          scopedSlots: { customRender: 'action' }
        }
      ],
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
        add: "/bus/busProject/add",
        edit: "/bus/busProject/edit",
        queryById: "/bus/busProject/queryById",
        delete: "/bus/busProjectBudget/delete",
        list: '/bus/busProjectBudget/queryByProjectId',
        // homeprojectRelated:"/bus/busProject/projectRelatedData",
        homeprojectRelated: "/bus/busProject/queryProjectEstimate",
        budgetStatistics: '/bus/busProjectBudget/budgetStatistics'
      },
      datasoure: [],
      pageOthers: {},
      budgetStaticData: {manpowerCostList:[],dateList:[],procurementList:[],subpackageList:[],travelList:[],otherList:[]},
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  watch: {
    projectId: function () {
      this.drawChart();
      this.pagebudget()
      this.firstProjectOthers()
    }
  },
  created() {
    //备份model原始值
    // this.modelDefault = JSON.parse(JSON.stringify(this.model));


  },
  mounted() {
    this.getBudgetStaticData();
    this.pagebudget()
    this.firstProjectOthers()
  },
  methods: {
    uploadList() {
      this.pagebudget()
      this.getBudgetStaticData()
      this.firstProjectOthers()
    },
    add() {
      // this.edit(this.modelDefault);
    },
    // edit (record) {
    //   this.model = Object.assign({}, record);
    //   this.projectId=this.model.projectId
    //   this.drawChart();
    //   this.pagebudget()
    //   this.firstProjectOthers()
    //   this.visible = true;
    // },
    submitForm() {
      const that = this;
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
    handleChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
    async getBudgetStaticData() {
      await getAction(this.url.budgetStatistics, { projectId: this.projectId }).then((res) => {
        this.budgetStaticData = res.result.result
        
      })
      setTimeout(() => {
        this.drawChart() // 绘制图表
      }, 200)
    },
     drawChart() {
    
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          // data: ['循环采购', '一次性采购','人力成本']
          data: ['人力成本', '采购成本', '分包费用', '差旅费用', '其他费用'],
          left: 50,
          // itemWidth: 10,
          // itemHeight: 10,
          // icon: "circle",
        },
        xAxis: [
          {
            type: 'category',
            data: this.budgetStaticData.dateList,
            // data: ['2023-02','2023-03'],
            // axisPointer: {
            //   type: 'shadow'
            // }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额(¥)',
            // nameLocation: "middle",
            // nameTextStyle: {
            //   lineHeight: 258
            // },
            min: 0,
            // max: 200,
            // interval: 50,
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name: '人力成本',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            itemStyle: {
              color: '#7d97bf'
            },
            data: this.budgetStaticData.manpowerCostList
          },
          {
            name: '采购成本',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            itemStyle: {
              color: '#ffa500'
            },
            data: this.budgetStaticData.procurementList
          },
          {
            name: '分包费用',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            itemStyle: {
              color: '#566280'
            },
            data: this.budgetStaticData.subpackageList
          },
          {
            name: '差旅费用',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            itemStyle: {
              color: '#70ad47'
            },
            data: this.budgetStaticData.travelList
          },
          {
            name: '其他费用',
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            itemStyle: {
              color: '#8085e9'
            },
            data: this.budgetStaticData.otherList
          },
        ]
      };
      myChart.setOption(option,true);
    },
    handleLoop(eve) {
      console.log(JSON.stringify("eve   "+ eve))
      if (eve.key == 'Circular') {
        this.$refs.circle.edit({ projectId: this.projectId })
        this.$refs.circle.title = '新增循环采购'
        this.$refs.circle.disableSubmit = false
      } else if (eve.key == "Onlyone") {
        this.$refs.onlyone.edit({ projectId: this.projectId })
        this.$refs.onlyone.title = '新增一次性采购'
        this.$refs.onlyone.disableSubmit = false
      } else if (eve.key == "Travel") {
        this.$refs.reimbursement.edit({ projectId: this.projectId })
        this.$refs.reimbursement.title = '新增差旅报销'
        this.$refs.reimbursement.disableSubmit = false
      } else if (eve.key == "Other") {
        this.$refs.hetero.edit({ projectId: this.projectId })
        this.$refs.hetero.title = '新增其他'
        this.$refs.hetero.disableSubmit = false
      } else if (eve.key == "Subpackage") {
        this.$refs.subpackage.edit({ projectId: this.projectId })
        this.$refs.subpackage.title = '新增分包费用'
        this.$refs.subpackage.disableSubmit = false
      }
    },
    handleLoopEdit(record) {
      if (record.purchaseType == "循环采购") {
        this.$refs.editloop.edit(record)
        this.$refs.editloop.title = '编辑循环采购'
        this.$refs.editloop.disableSubmit = false
      } else if (record.purchaseType == "一次性采购") {
        this.$refs.onlyone.edit(record)
        this.$refs.onlyone.title = '编辑一次性采购'
        this.$refs.onlyone.disableSubmit = false
      } else if (record.purchaseType == "差旅报销") {
        this.$refs.reimbursement.edit(record)
        this.$refs.reimbursement.title = '编辑差旅报销'
        this.$refs.reimbursement.disableSubmit = false
      } else if (record.purchaseType == "其他") {
        this.$refs.hetero.edit(record)
        this.$refs.hetero.title = '编辑其他'
        this.$refs.hetero.disableSubmit = false
      } else if (record.purchaseType == "分包费用") {
        this.$refs.subpackage.edit(record)
        this.$refs.subpackage.title = '编辑分包费用'
        this.$refs.subpackage.disableSubmit = false
      }
    },
    handleDelete(record) {
      deleteAction(this.url.delete, { id: record }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.pagebudget()
          this.drawChart()
          this.firstProjectOthers()
        } else {
          this.$message.warning(res.message)
        }
      });
    },
    pagebudget() {
      getAction(this.url.list, { projectId: this.projectId }).then((res) => {
        this.datasoure = res.result
      })
    },
    firstProjectOthers() {
      getAction(this.url.homeprojectRelated, { projectId: this.projectId }).then((res) => {
        this.pageOthers = res.result
      })
    },
    getColor(data, value) {
				if (value === "default") {
					return data < 0 ? this.redColor : ""
				} else if (value === "percent") {
					if (data.indexOf('—') > -1) {
						return this.redColor
					} else {
						data = (data || '').slice(0, -1)
						return data > 99 ? this.redColor : data > 79 ? this.yellowColor : this.greenColor
					}
				}
			},
			getText(data) {
				if (data.indexOf('—') > -1)
					return "已超支"
				else if(data.slice(0, -1) > 100)
					return "已超支" + data
				 else if (data.slice(0, -1) < 101) return "已用" + data
			},
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-card {
  background: #fff0;
}

.card {
  p {
    color: #2f3133;
    font-weight: bold;
  }

  .percent {
    font-size: 12px;
  }
}

.table {
  /deep/ .ant-card-head-wrapper {
    border-top: 1px solid #EDEFF0;
  }

  /deep/ .ant-card-head {
    border-bottom: none;
  }
}

.chart {
  /deep/ .ant-card-head {
    border-bottom: none;
  }
}
</style>