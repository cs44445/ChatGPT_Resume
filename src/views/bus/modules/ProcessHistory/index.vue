<template>
  <div style="margin-bottom:15px">
    <a-card>
      <div slot="title">
        流程历史跟踪
        <a-button size="small" type="primary" ghost style="margin-left:15px;" @click="lookImgs(processId)" >查看流程图</a-button>
      </div>
      <div>
        <a-table
          size="small"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        ></a-table>
      </div>
    </a-card>
    <!-- <img :src="imgRes" /> -->
    <a-modal
      :bodyStyle="{ padding: 0}"

      :visible="lookImg"
      :footer="null"
      @cancel="handleCancel"
      width="1000px"
    >
      <div style="width: 100%;padding-bottom: 13%;">
        <img style="width: 100%;margin-left: -8%;" :src="imgRes" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'

export default {
  name: 'ProcessHistory',
  props: ['processId'],
  data() {
    return {
      imgRes: '',
      lookImg: false,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 30,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '业务名称',
          align: 'center',
          dataIndex: 'busiName'
        },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'taskName'
        },
        {
          title: '审批节点',
          align: 'center',
          dataIndex: 'approverRoleName'
        },
        {
          title: '处理结果',
          align: 'center',
          dataIndex: 'approverStatusName'
        },

        {
          title: '审批意见',
          align: 'center',
          dataIndex: 'apprRemark'
        },
        {
          title: '审批人',
          align: 'center',
          dataIndex: 'approverNameShow'
        },
        {
          title: '操作时间',
          align: 'center',
          dataIndex: 'approveTime'
        },
        {
          title: '到达时间',
          align: 'center',
          dataIndex: 'arrivalTime'
        }
      ],
      //数据集
      dataSource: [],
      url: {
        list: '/api/flowProcAppr/getProcDetHisList',
        lookimage: '/api/flowProcAppr/tracePhoto'
      }
    }
  },
  mounted(){
    this.loadData(this.processId)
  },
  props: {
    processId: {
      type: String
    }
  },
  watch: {
    processId: function() {
      this.loadData(this.processId)
    }
  },
  methods: {
    lookImgs(instanceId) {
      this.lookImg = true
      var getTimestamp=new Date().getTime();
      this.imgRes = process.env.VUE_APP_API_BASE_URL + this.url.lookimage + '?processInstanceId=' + instanceId+"&timestamp="+getTimestamp
    },
    handleCancel() {
      this.lookImg = false
    },
    loadData(instanceId) {
      this.dataSource = []
      var params = { instanceId: instanceId } //查询条件
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.ant-card-body .table-operator {
  margin-bottom: 18px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}
</style>