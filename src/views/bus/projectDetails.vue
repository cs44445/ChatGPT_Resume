<template>
  <div class="index-container-ty">
    <div class="index-tab">
      <a-tabs default-active-key="3" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">{{projectDetails.projectName}}</span></template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="详情" force-render v-if="detailsShow">
          <bus-project-detail :projectId="projectId"></bus-project-detail>
        </a-tab-pane>
        <a-tab-pane key="3" tab="任务" force-render v-if="taskShow">
          <!-- <bus-project-task-detail-list-form :projectId="projectId"/> -->
          <task-list :projectId="projectId"></task-list>
        </a-tab-pane>
        <a-tab-pane key="4" tab="数据报表" force-render v-if="dataReportShow">
          <!-- <project-management :projectId="projectId"/> -->
          <!-- <mile-stone :projectId="projectId"/> -->
          <data-report :projectId="projectId"></data-report>
        </a-tab-pane>
        <a-tab-pane key="5" tab="文件" force-render v-if="fileShow">
          <project-documents-list :projectId="projectId"></project-documents-list>
        </a-tab-pane>
<!--        <a-tab-pane key="5" tab="甘特图">-->
<!--            甘特图-->
<!--        </a-tab-pane>-->
        <a-tab-pane key="6" tab="预算" v-if="budgetShow">
            <budget-form :projectId="projectId"/>
        </a-tab-pane>
        <a-tab-pane key="7" tab="人员" :force-render="true" v-if="personPoolShow">
            <personnel-pool :projectId="projectId" :projectDetails="projectDetails"></personnel-pool>
        </a-tab-pane>
        <a-tab-pane key="8" tab="里程碑" force-render v-if="milepostShow">
          <mile-stone :projectId="projectId"/>
        </a-tab-pane>
        <!-- <a-tab-pane key="9" tab="工时分配">
            工时分配
        </a-tab-pane> -->
        <a-tab-pane key="10" tab="工时" force-render v-if="workHoursShow">
            <man-hour :projectId="projectId"/>
        </a-tab-pane>
        <a-tab-pane key="11" tab="准确率" v-if="projectDetails.projectType == '2' && accuracyShow == true">

            <bus-email-correct-list :projectId="projectId"/>
        </a-tab-pane>
<!--        <a-tab-pane key="11" tab="更多">-->
<!--            更多-->
<!--        </a-tab-pane>-->
      </a-tabs>
        <!-- <div class="image-group-share">
        <div class="image-group">
        imgs
        </div>
        <button class="share-btn">分享</button>
      </div> -->
    </div>

  </div>
</template>

<script>
import MileStone from '@views/bus/modules/ProjectDetails/MileStone'
import ManHour from '@views/bus/modules/ProjectDetails/ManHour'
import ProjectManagement from '@views/bus/ProjectManagement'
import BusProjectList from './BusProjectList'
import BusEmailCorrectList from './BusEmailCorrectList'
import BusProjectTaskDetailListForm from './BusProjectTaskDetailListForm'
import BudgetForm from './modules/BudgetForm'
import dataReport from './dataReport'
import PersonnelPool from './modules/PersonnelPool'
import ProjectDocumentsList from '@views/bus/modules/ProjectDocumentsList'
import BusProjectDetail from './modules/BusProjectDetail.vue'
import TaskList from './modules/projectTask/TaskList.vue'
import {USER_AUTH} from "@/store/mutation-types";
import { getAction } from '@/api/manage'

export default {
  name: 'Home',
  components: {
    MileStone,
    ManHour,
    ProjectManagement,
    BusProjectList,
    BusProjectTaskDetailListForm,
    BudgetForm,
    dataReport,
    PersonnelPool,
    BusEmailCorrectList,
    ProjectDocumentsList,
    BusProjectDetail,TaskList
  },
  data() {
    return {
      loading: false,
      projectId:"1",
      projectName:"",
      url: {
      },
      projectDetails:{},
      projectType:'',
      //控制页签展示权限
      detailsShow: false,
      taskShow: false,
      dataReportShow: false,
      fileShow: false,
      budgetShow: false,
      personPoolShow: false,
      milepostShow: false,
      workHoursShow: false,
      accuracyShow: false,
      getProjectById: '/bus/busProject/queryById',      
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.getParam();
  },
  watch: {
       $route: {
            handler(newVal,oldVal){
              //newVal.path =='/bus/projectDetails'
                // console.log(newVal.query,oldVal)
                if(newVal.path =='/bus/projectDetails'){
                  let query =  JSON.parse(JSON.stringify(newVal.query))
                  if(query.projectId){
                    this.projectId = query.projectId;
                    this.getParam();
                  }
                }

            },
            deep: true
        }
  },
  mounted() {
    this.getParam();
    this.checkLabel();
  },
  methods: {
    getParam() {
      let query =  JSON.parse(JSON.stringify(this.$route.query))
      this.projectId = query.projectId;
      getAction(this.getProjectById, { id: this.projectId }).then((res) => {
        if (res.success) {
          this.projectDetails = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    callback(key) {
      // console.log(key);
    },
    checkLabel(){
      let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
      for (let auth of authList) {
        if(auth.action == 'project:details') {
          //详情
          this.detailsShow = true;
        }
        if(auth.action == 'project:task') {
          //任务
          this.taskShow = true;
        }
        if(auth.action == 'project:dataReport') {
          //数据报表
          this.dataReportShow = true;
        }
        if(auth.action == 'project:file') {
          //文件
          this.fileShow = true;
        }
        if(auth.action == 'project:budget') {
          //预算
          this.budgetShow = true;
        }
        if(auth.action == 'project:personPool') {
          //人员池
          this.personPoolShow = true;
        }
        if(auth.action == 'project:milepostShow') {
          //里程碑
          this.milepostShow = true;
        }
        if(auth.action == 'project:workHours') {
          //工时
          this.workHoursShow = true;
        }
        if(auth.action == 'project:accuracy') {
          //准确率
          this.accuracyShow = true;
        }

      }

    }
  }

}
</script>

<style lang="less" scoped>

.image-group-share {
  position: absolute;
  right: 15px;
  top: 20px;
  .image-group {
    width: auto;
    display: inline-block;
  }
  .share-btn {
    margin-left: 10px;
  }
}
.index-tab /deep/ .ant-tabs-nav-container {
  font-size: 14px;
}
.index-tab /deep/ .ant-tabs-bar {
  position: fixed;
  z-index: 9 !important;
  width: 99%;
  background: #F7F8FA;
  padding-top: 12px;
}
.index-tab /deep/ .ant-tabs-tabpane {
  margin-top:80px;
}
.first-tab {
  display: block;
  font-size: 17px;
  font-weight: bold;
  color: #000;
}
.index-tab /deep/ .ant-tabs-nav div:has(.first-tab){
  border-right: 1px solid #e8e8e8;
  &:hover {
    cursor: default;
  }
}
</style>
