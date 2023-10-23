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
    ></a-table>
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
          dataIndex: 'userName'
        },
        {
          title: '时间',
          align: 'center',
          dataIndex: 'workCalendar'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '里程碑',
          align: 'center',
          dataIndex: 'milepostCode'
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
          title: '加班类型',
          align: 'center',
          dataIndex: 'overtimeType_dictText'
        },
      ],
      // 分页参数
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
        list: '/bus/countWorkHours/personCountDetailedList',
      }
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
      getAction(this.url.list, {
        milepostId:instanceId.milepostId,
        projectId:instanceId.projectId,
        userId:instanceId.userId,
        pageNo :this.ipagination.current,
        pageSize :this.ipagination.pageSize
      }).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total;
        }
      })
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

::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #F7F8FA;
}
::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  /* .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td */
  background: #fff !important;
}
::v-deep .ant-table-tbody > tr > td{
  background: #F7F8FA;
}
::v-deep .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  background: #fff;
}
::v-deep .ant-table-thead > tr > th{
  background: #F7F8FA;
}
::v-deep .ant-table-bordered .ant-table-tbody > tr > td , ::v-deep .ant-table-small.ant-table-bordered .ant-table-content {
   border-right: none; 
}
::v-deep .ant-table-bordered .ant-table-thead > tr > th{
  border-right: none;
}
::v-deep .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th{
  background: #F7F8FA;
}
</style>