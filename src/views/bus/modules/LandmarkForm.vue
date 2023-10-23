<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-card :bordered="false">
          <div class="detail-card">
            <p>项目：<span>{{ datalist.projectName }}</span></p>
            <p>项目负责人：<span>{{ datalist.principal }}</span></p>
          </div>
          <div class="detail-card">
            <p>里程碑：<span>{{ model.milepostCode }}</span></p>
            <p>阶段负责人：<span>{{ datalist.stageOwner }}</span></p>
          </div>
          <div class="detail-card">
            <p>计划完成时间：{{ datalist.planDate }}</p>
            <p>实际完成时间：{{ datalist.finalDate }}</p>
          </div>
        </a-card>
        <a-collapse v-model="activeKey">
          <a-collapse-panel key="1" v-has="'demandresearch:details'">
            <template slot="header">
              <div>阶段成员 计划投入工时：{{ datalist.plan_input_hours }}h 实际投入工时：{{ datalist.final_input_hours }}h</div>
            </template>
            <a-table ref="table" :scroll="{ y: 200 }" rowKey="id" :columns="columns"
              :dataSource="datalist.milePostUserDtos" :pagination="false" class="j-table-force-nowrap">
              <template slot="userName" slot-scope="text, record">
                <a style="color:#1990ff" @click="handlePersonnel(record)">{{ text }}</a>
              </template>
              <template slot="position" slot-scope="text,record">
                <span>
                  <template v-if="record.position.length > 0">
                    <template v-for="(tag, i) in record.position">
                      <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag" :color="colorList[i]">
                        <a-tag :key="i">
                          {{ `${tag.slice(0, 10)}...` }}
                        </a-tag>
                      </a-tooltip>
                      <a-tag v-else :key="i" :color="colorList[i]">
                        {{ tag }}
                      </a-tag>
                    </template>
                  </template>
                  <template v-else>
                    <span>暂无</span>
                  </template>
                </span>
              </template>
            </a-table>
          </a-collapse-panel>
          <a-collapse-panel key="2" v-has="'demandresearch:details'">
            <template slot="header">
              <div>可使用预算：{{ datalist.availableBudget|moneyFormat }}元 实际使用预算：{{ datalist.actualBudget|moneyFormat }}元</div>
            </template>
            <a-table ref="table" :scroll="{ y: 200 }" rowKey="id" :columns="columns1"
              :dataSource="datalist.busProjectBudgets" :pagination="false" class="j-table-force-nowrap">
                <span slot="money" slot-scope="text">
                  <span>{{text|moneyFormat}}</span>
                </span>
              </a-table>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="项目文档">
            <a-table ref="table" :scroll="{ y: 200 }" rowKey="id" :columns="columns2"
              :dataSource="datalist.busProjectTrends" :pagination="false" class="j-table-force-nowrap">
              <span slot="action" slot-scope="text, record">
                <a @click="downloadFile(record.filePath)" style="color:#1990ff">下载</a>
              </span>
              <template slot="titletit" slot-scope="text, record">
                <a-popover>
                  <template slot="content">
                    <span>{{ text }}</span>
                  </template>
                  <div style="maxWidth:120px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"><a
                      @click="downloadFile(record.filePath)" style="color:#1990ff">{{ text }}</a></div>
                </a-popover>
              </template>
            </a-table>
          </a-collapse-panel>
        </a-collapse>
      </a-form-model>
    </j-form-container>
    <!-- 用户 -->
    <organization ref="organization"></organization>
  </a-spin>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
// import { mixinDevice } from '@/utils/mixin'
//import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction,getFileAccessHttpUrl } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import Organization from '@/views/user/Organization'
export default {
  name: 'AnnounCementForm',
  components: { Organization },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      activeKey: ['1'],
      dataSource: [],
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
      columns: [
        {
          title: '姓名',
          align: "left",
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '阶段角色',
          align: "left",
          dataIndex: 'position',
          width: 300,
          scopedSlots: { customRender: 'position' }
        },
        {
          title: '分配工时',
          align: "left",
          dataIndex: 'planHours'
        },
        {
          title: '实际工时',
          align: "left",
          dataIndex: 'finalHours'
        },
        {
          title: '电话',
          align: "left",
          dataIndex: 'phone'
        }
      ],
      columns1: [
        {
          title: '预算流向',
          align: "left",
          dataIndex: 'purchaseType'
        },
        {
          title: '流向说明',
          align: "left",
          dataIndex: 'budgetExplain',
          ellipsis: true
        },
        {
          title: '金额',
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
        }
      ],
      columns2: [
        {
          title: '文档名称',
          align: "left",
          dataIndex: 'filePath',
          scopedSlots: { customRender: 'titletit' }
        },
        {
          title: '上传时间',
          align: "left",
          dataIndex: 'createTime'
        },
        {
          title: '上传人',
          align: "left",
          dataIndex: 'createBy'
        },
        {
          title: '操作',
          align: "left",
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datalist: [],
      listId: [],
      projectId: '',
      url: {
        add: "/bus/busProject/add",
        edit: "/bus/busProject/edit",
        queryById: "/bus/busProject/queryById",
        list: '/bus/busProjectBudget/queryByProjectId',
        fileListByProjectId: '/bus/file/getFileListByProjectId',
        queryByMilepostId: '/bus/busProjectMilepost/queryByMilepostId'
      },
      colorList: ['blue', 'pink', 'cyan']
    }
  },
  watch: {
    activeKey(key) {
      // console.log(key);
    },
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model));
  },
  methods: {
    add() {
      this.edit(this.modelDefault);
    },
    edit(record) {
      this.listId = record
      this.handleMilepostId()
      this.projectId = record.projectId
      this.model = Object.assign({}, record);
      this.visible = true;
    },
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
    handleMilepostId() {
      getAction(this.url.queryByMilepostId, { id: this.listId.id }).then((res) => {
        this.datalist = res.result
      })
    },
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
    handlePersonnel(record) {
      this.$refs.organization.userId = record.userId
      this.$refs.organization.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
.detail-card {
  display: flex;
  justify-content: space-between;

  & p {
    flex: 1;
  }

  & span {
    font-weight: bold;
  }
}
</style>
