<template>
  <div class="milestone">
    <a-tabs default-active-key="1" @change="callback" :tabBarGutter="5">
      <a-tab-pane key="1">
        <template #tab>全部<span class="tab-menu-num">{{numData.allNum || 0}}</span></template>
         <milestone-list ref="milestoneList" :projectId="projectId" :num="1"/>
      </a-tab-pane>
      <!-- <a-tab-pane key="2">
        <template #tab>将来<span class="tab-menu-num">{{numData.futureNum || 0}}</span></template>
        <milestone-list  :projectId="projectId" :num="2"/>
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #tab>延期<span class="tab-menu-num">{{numData.extensionNum || 0}}</span></template>
        <milestone-list  :projectId="projectId" :num="3"/>
      </a-tab-pane> -->
      <template #tabBarExtraContent>
        <a-button type="primary" @click="handleTimeline" v-has="'milepost:operate'"><img src="~@/assets/edit.svg" width="18px" style="margin:0px 5px 5px 0px;">里程碑</a-button>
      </template>

    </a-tabs>

    <!-- {{projectId}} -->
    <!-- 里程碑 -->
    <milepost-modal ref="milepostModal" @refreshMilstoneList="refreshMilstoneList" @ok="modalFormOk"></milepost-modal>
  </div>

</template>

<script>
import { getAction } from '@/api/manage'
// import { mixinDevice } from '@/utils/mixin'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import MilestoneList from './MileStoneList'
import MilepostModal from './../MilepostModal'


export default {
  name: 'MileStone',
  // mixins: [JeecgListMixin, mixinDevice],
  props: ['projectId'],
  components: {
    MilestoneList,
    MilepostModal
  },
  data() {
    return {
      numData: {},
      url: {
        num: '/bus/busProjectMilepost/milepostNum',
        getById: '/bus/busProjectMilepost/queryByProjectId',
        queryById: "/bus/busProject/queryById",
      }
    }
  },
  mounted(){
    this.loadData(this.projectId)
  },
  props: {
    projectId: {
      type: String
    }
  },
  watch: {
    projectId: function() {
      this.loadData(this.projectId)
    }
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    loadData(projectId) {
      // this.dataSource = []
      var params = { projectId: projectId } //查询条件
      getAction(this.url.num, params).then(res => {

        if (res.success) {
          this.numData = res.result
        }
      })
    },
    async handleTimeline() {
      const detailData = await getAction(this.url.queryById, { id: this.projectId })
      const record=detailData.result
      // console.log('detailData',detailData)
      const resultData = await getAction(this.url.getById, { queryByProjectId: record.id })
      if (resultData.success && resultData.result.length != 0) {
        this.$refs.milepostModal.title = '编辑里程碑'
        this.$refs.milepostModal.edit(record, resultData.result)
      } else {
        this.$refs.milepostModal.edit(record, [])
        this.$refs.milepostModal.title = '添加里程碑'
      }
    },
    refreshMilstoneList() {
      this.$refs.milestoneList.loadData(this.projectId)
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
.milestone /deep/ .ant-tabs-nav .ant-tabs-tab-active {
  // color: #3d3d3d;
}
.milestone /deep/ .ant-tabs-bar {
  border: none;
  position: unset !important;
  padding-top: unset !important;
}
.milestone /deep/ .ant-tabs-ink-bar {
  // background-color: #ededed;
}
.milestone /deep/ .ant-tabs-tabpane {
  margin-top: unset !important;
}
.tab-menu-num {
  display: inline-block;
    width: 25px;
    height: 17px;
    border-radius: 40%;
    background-color: #ededed;
    text-align: center;
    margin: 0px 3px;
    color: #3d3d3d;
    font-size: 10px;
}
@media screen and (max-width: 1440px) {
  .milestone {
    padding: 0px 12px;
  }
}

@media screen and (min-width: 1441px) {
  .milestone {
    padding: 0px 24px;
  }
}
</style>