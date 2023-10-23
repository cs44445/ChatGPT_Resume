<template>
  <div>
    <a-card :bordered="false" class="card-head">
      <div slot="title" class="headtit">
        <a-icon type="database" theme="filled" style="color: #1990ff; margin-right: 8px" />
        {{ projectInfo.projectName }}
      </div>
      <a-row type="flex" justify="start" :gutter="{ md: 12, xxl: 16 }">
        <a-col :span="4" class="ipt">
          <p class="card-one-title"><a-icon type="home" style="margin-right: 10px" />所属部门</p>
          <a-input disabled :value="projectInfo.departName" class="ipt" />
        </a-col>
        <a-col :span="4" class="ipt">
          <p class="card-one-title"><a-icon type="user" style="margin-right: 10px" />负责人</p>
          <a-input disabled :value="projectInfo.ownerName" class="ipt" />
        </a-col>
        <a-col :span="4" class="ipt">
          <p class="card-one-title"><a-icon type="file-search" style="margin-right: 10px" />所有任务</p>
          <a-input disabled :value="projectInfo.allTask" class="ipt" />
        </a-col>
        <a-col :span="4" class="ipt">
          <p class="card-one-title"><a-icon type="like" style="margin-right: 10px" />已完成任务</p>
          <a-input disabled :value="projectInfo.completeTask" class="ipt" />
        </a-col>
        <a-col :span="4" class="ipt">
          <p class="card-one-title"><a-icon type="hourglass" style="margin-right: 10px" />未完成任务</p>
          <a-input disabled :value="projectInfo.noCompleteTask" class="ipt" />
        </a-col>
        <a-col :span="4" class="ipt">
          <p class="card-one-title"><a-icon type="carry-out" style="margin-right: 10px" />参与人数</p>
          <a-input disabled :value="projectInfo.numberOfPeople" class="ipt" />
        </a-col>
      </a-row>
    </a-card>
    <a-card :bordered="false">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="所有">
          <bus-project-task-detail-table ref="tableStatus1"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="未关闭" force-render>
          <bus-project-task-detail-table ref="tableStatus2"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="由我创建">
          <bus-project-task-detail-table ref="tableStatus3"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="4" tab="指派给我">
          <bus-project-task-detail-table ref="tableStatus4"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="5" tab="由我解决">
          <bus-project-task-detail-table ref="tableStatus5"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="6" tab="待关闭">
          <bus-project-task-detail-table ref="tableStatus6"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="7" tab="延期">
          <bus-project-task-detail-table ref="tableStatus7"></bus-project-task-detail-table>
        </a-tab-pane>
        <a-tab-pane key="8" tab="未指派">
          <bus-project-task-detail-table ref="tableStatus8"></bus-project-task-detail-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { getAction } from '@/api/manage'
import BusProjectTaskDetailTable from './BusProjectTaskDetailTable'
export default {
  name: 'BusProjectTaskDetailListForm',
  components: {
    BusProjectTaskDetailTable
  },
  props: ['projectId'], 
  data() {
    return {
      description: 'bus_project_task_detail管理页面',
      record: {},
      projectDetail: '/bus/busProjectTaskDetail/getProjectDetailByProjectId',
      getProjectById: '/bus/busProject/queryById',
      projectInfo: {}
    }
  },
  created() {
  },
  computed: {

  },
  props: {
    projectId: {
      type: String
    }
  },
  watch: {
    projectId: function() {
      getAction(this.getProjectById, { id: this.projectId }).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.record = res.result
          this.edit(this.record)
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  },
  methods: {
    edit(record) {
      this.record = record
      this.getProjectDetail(record.id)
      // console.log(9999,this.$refs)
      // this.$nextTick(() => {
      this.$refs.tableStatus1.edit(record, 1);
      // })
    },
    callback(key) {
      // console.log(key);
      this.$nextTick(() => {
        this.$refs[`tableStatus${key}`].edit(this.record, key);
      })
    },
    getProjectDetail(projectId) {
      getAction(this.projectDetail, { projectId: projectId }).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.projectInfo = res.result;
        } else {
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
.card-head {
  margin-bottom: 17px;
  height: 160px;
  border-radius: 3px;
}

.card-head /deep/ .ant-card-head {
  border-bottom: none;
}

.card-one-title {
  font-size: 12px;
}

.ipt {
  font-size: 16px;
  border: none;
  height: 40px;
  color: #000;
}
</style>
