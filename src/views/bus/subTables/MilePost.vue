<template>
  <div style="margin-bottom:15px">
    <a-table
      size="small"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="handleTableChange"
    >
    <template slot="userTitle" slot-scope="text,record">
      <span>
        <template v-if="record.userTitle && record.userTitle.length > 0">
          <template v-for="(tag,i) in record.userTitle">
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
      <template slot="userName" slot-scope="text,record">
        <a-tooltip>
          <span>{{text}}{{record.leave}}</span>
        </a-tooltip>

      </template>
  </a-table>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'

export default {
  name: 'ProcessHistory',
  props: ['processId'],
  data() {
    return {
      columns: [
        {
          title: '工号',
          align: 'center',
          dataIndex: 'workNo'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },

        },
        // {
        //   title: '时间',
        //   align: 'center',
        //   dataIndex: 'workCalendar'
        // },
        {
          title: '里程碑',
          align: 'center',
          dataIndex: 'milepostName'
        },
        {
          title: '阶段角色',
          align: 'center',
          dataIndex: 'userTitle',
          scopedSlots: { customRender: 'userTitle' }
        },
        {
          title: '总工时',
          align: 'center',
          dataIndex: 'totalHours'
        },
        {
          title: '正常工时',
          align: 'center',
          dataIndex: 'workHours'
        },
        {
          title: '加班工时',
          align: 'center',
          dataIndex: 'overtimeHours'
        },
         {
          title: '分配工时',
          align: 'center',
          dataIndex: 'planHours'
        },
        {
          title: '剩余工时',
          align: 'center',
          dataIndex: 'remainingHours'
        },
      ],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      //数据集
      dataSource: [],
      url: {
        list: '/bus/countWorkHours/getActualByMilepostId',
      },
      colorList:['blue','pink','cyan']
    }
  },
  mounted(){
    this.loadData(this.processId)
  },
  watch: {
    processId: function() {
      this.loadData(this.processId)
    }
  },
  methods: {
    loadData(instanceId) {
      this.dataSource = []
      if(instanceId.milepostId && instanceId.projectId){
        getAction(this.url.list, {
          milepostId:instanceId.milepostId,
          projectId:"",
          pageNo :this.ipagination.current,
          pageSize :this.ipagination.pageSize
        }).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total;
          }
        })
      }else{
        getAction(this.url.list, {
          milepostId:"",
          projectId:instanceId.projectId,
          pageNo :this.ipagination.current,
          pageSize :this.ipagination.pageSize
        }).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
          }
        })
      }
    },
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination;
      this.loadData(this.processId)
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