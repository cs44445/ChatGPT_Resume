<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen @cancel="handleCancel"
    :maskClosable="false" cancelText="关闭">
    <div>
      <h4 style="margin:0 0 20px 0;">计划工时： {{ planHours }} h<span style="margin-left:20px;">投入工时： {{
        actualHours}}h</span>
      <a-button type="primary" :disabled="selectionRows.length==0" style="float:right;" @click="sendNotice" :loading="loading">批量提醒</a-button>
      </h4>
    </div>
    <div style="border: 1px solid #E1E9F5; background: #F7F8FA; border-radius: 4px; padding:16px">
      <a-table size="small" ref="table" :scroll="{ y: 220 }" rowKey="id" :columns="columns2" :dataSource="dataSource"
      :pagination="false" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      <template slot="userTitle" slot-scope="text,record">
        <span>
          <template v-if="record.userTitle && record.userTitle.length > 0">
            <template v-for="(tag, i) in record.userTitle">
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
    </div>
    
    <template slot="footer">
      <a-button key="back" @click="handleCancel">关闭</a-button>
    </template>
  </j-modal>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
export default {
  name: 'ShowTimeDetail',
  data() {
    return {
      title: '',
      width: 1000,
      visible: false,
      loading:false,
      dataSource: [],
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      colorList: ['blue', 'pink', 'cyan'],
      columns2: [
        {
          title: '姓名',
          align: "left",
          dataIndex: 'userName',
          width:100
        },
        {
          title: '工号',
          align: "left",
          dataIndex: 'workNo',
          width:100
        },
        {
          title: '阶段角色',
          align: "left",
          dataIndex: 'userTitle',
          scopedSlots: { customRender: 'userTitle' }
        },
        {
          title: '已分配工时(H)',
          align: "left",
          dataIndex: 'planHours',
          width:100
        },
        {
          title: '已填报工时(H)',
          align: "left",
          key:'5',
          dataIndex: 'fillInHours',
          width:100
        },
        {
          title: '已提交工时(H)',
          align: "left",
          key:'6',
          dataIndex: 'totalHours',
          width:100
        },
        {
          title: '已审批工时(H)',
          align: "left",
          dataIndex: 'approveHours',
          width:100
        },
      ],
      planHours: 0,
      actualHours: 0,
      statDate: 0,
      endDate: 0,
      getActualByProjectAndWeek: '/bus/busProjectActual/getActualByProjectAndWeek',
      workHoursBatchSendNoticeUser: '/bus/busProjectEstimated/workHoursBatchSendNoticeUser'
    }
  },
  methods: {
    edit(record, id) {
      this.planHours = record.planHours
      this.actualHours = record.actualHours
      this.statDate = record.statDate
      this.endDate = record.endDate
      postAction(this.getActualByProjectAndWeek, { projectId: id, beginTime: record.date, endTime: record.date }).then((res) => {
        if (res.success && res.result.length > 0) {
          this.dataSource = res.result
        } else {
          this.dataSource = []
          // this.$message.warning(res.message)
        }
      })
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    sendNotice() {
      this.loading = true
      let userIds = this.selectionRows.map(item => { return item.userId }).join(',')
      getAction(this.workHoursBatchSendNoticeUser, { userIds }).then(res => {
        if (res.success) {
          this.$message.success(res.result)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';

// /deep/ .ant-btn-primary {
//   background-color: #EBA0D0;
//   border-color: #EBA0D0;
//   color:#fff
// }
/deep/ .ant-table-column-title{
  font-size: 14px;
}
/deep/ .ant-modal-header{
  border-bottom:none;
}
/deep/  .ant-table-tbody{
  background-color: #F7F8FA;
}
</style>