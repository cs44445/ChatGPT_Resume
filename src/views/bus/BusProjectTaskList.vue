<template>
  <a-card :bordered="false" style="background: #F7F8FA;">
    <!-- 操作按钮区域 -->
    <div class="mytask-head">
      <div class="head-title">我的任务</div>
      <!-- <a-button @click="handleAdd" v-has="'project:add'" type="primary" icon="plus">添加任务</a-button> -->
      <div>
        <!-- <a-input  placeholder="搜索任务ID/任务标题" @pressEnter="searchQuery" v-model="filterform.keyword">
          <a-icon slot="prefix" type="search" />
        </a-input> -->
        <a-popover  trigger="click" placement="bottomRight" ref="filtrate" :visible="clicked"  :overlayStyle="{width:'23%'}">
            <template slot="content">
                <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                    <span style="font-size: 16px;font-weight: bold;color: #2F3133;">筛选</span>
                    <span  @click="hide">x</span>
                </div>
                <a-form-model layout="vertical" :model="filterform" ref="ruleForm">
                    <a-form-model-item label="关键词" class="labelcss">
                        <a-input v-model="filterform.keyword" placeholder="搜索任务ID/任务标题"  @blur="searchQuery"/>
                    </a-form-model-item>
                    <a-form-model-item label="指派人" class="labelcss">
                        <a-select  v-model="filterform.appoint" placeholder="请选择指派人"   @change="searchQuery">
                            <!-- <a-select-opt-group  label="">
                                <a-select-option :value="item.id" v-for="item in groubRoleList" :key="item.id">
                                    {{ item.realname }}
                                </a-select-option>
                            </a-select-opt-group> -->
                            <a-select-opt-group label="其他人">
                                <a-select-option :value="item.id" v-for="item in groubRoleList" :key="item.id">
                                    <div style="display: flex;align-items: center;">
                                        <div style="width: 24px;
                                        height: 24px;
                                        border: 1px solid #D3DCE5;
                                        border-radius: 50%;
                                        text-align: center;
                                        margin-right: 20px;
                                        line-height: 24px;">
                                            {{ item.realname.slice(0,1) }}
                                        </div>
                                        <span>{{ item.realname }}</span>
                                    </div>

                                </a-select-option>
                            </a-select-opt-group>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="创建人" class="labelcss">
                        <a-input v-model="filterform.createPerson" placeholder="任何"  @blur="searchQuery"/>
                    </a-form-model-item>
                    <a-form-model-item label="选择项目" class="labelcss">
                        <a-select  placeholder="任何" v-model="projectlist.id" @change="(value) => searchQuery(value,'projectId')">
                            <a-select-option v-for="(item, key) in projectlist" :key="key" :value="item.id">
                            {{ item.projectName }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="里程碑" class="labelcss">
                        <a-select  placeholder="任何" v-model="milestone.id" @change="(value) => searchQuery(value,'milepostId')">
                            <a-select-option v-for="(item, key) in milestone" :key="key" :value="item.id">
                            {{ item.milepostCode }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="类别" class="labelcss">
                        <j-dict-select-tag  v-model="filterform.type" placeholder="任何" @change="searchQuery"
                          dictCode="task_type" />
                    </a-form-model-item>
                    <a-form-model-item label="截止时间" class="labelcss">
                        <a-date-picker  v-model="filterform.endTime" valueFormat="YYYY-MM-DD" @change="searchQuery"
                          style="width:100%;" />
                    </a-form-model-item>
                    <a-form-model-item >
                    <a-button  @click="resetForm" style="font-size: 14px;font-weight: bold;color: #2F3133;">
                        重置
                    </a-button>
                    </a-form-model-item>
                </a-form-model>
            </template>
          <a-button  @click="flashTaskList">
            <!-- 刷新任务 -->
            <a-icon type="sync" />
          </a-button>
            <a-button :style="`margin:0 10px; color:${filterNum.length>0?'#CC148A':''};`" @click="handlePopoverClicked">
              <img style="margin-right:3px" src="@assets/screen.png"/>筛选<a-badge :count="filterNum.length" :number-style="{ backgroundColor: '#CC148A' }" style="margin-left: 10px;"
                    v-if="filterNum.length != 0"></a-badge>
            </a-button>
        </a-popover>
        <a-button  @click="openTodoList()" icon="unordered-list" class="marr10">个人待做清单</a-button>
        <a-button @click="handleAdd()" type="primary" icon="plus">添加任务</a-button>
      </div>
    </div>
    <!-- table区域-begin -->
    <div>
        <project-task-table-list title="true"></project-task-table-list>
        <template>
          <div>
            <a-collapse default-active-key="1" :bordered="false" v-model="activeNames">
              <a-collapse-panel key="1">
                <template slot="header">延期 {{delayCount}}</template>
                <project-task-table-list :dataSource="dataSource1" @getList='getList' @ok="updatedList"></project-task-table-list>
              </a-collapse-panel>
              <a-collapse-panel key="2">
                <template slot="header">进行中 {{executeCount}}</template>
                <project-task-table-list :dataSource="dataSource2" @getList='getList' @ok="updatedList"></project-task-table-list>
              </a-collapse-panel>
              <a-collapse-panel key="3">
                <template slot="header">暂停 {{pauseCount}}</template>
                <project-task-table-list :dataSource="dataSource3" @getList='getList' @ok="updatedList"></project-task-table-list>
              </a-collapse-panel>
              <a-collapse-panel key="4">
                <template slot="header">完成 {{completeCount}}</template>
                <project-task-table-list :dataSource="dataSource4" @getList='getList' checked="true" @ok="updatedList"></project-task-table-list>
                <div style="text-align:center">
                  <a-button @click="loadMore()" size="small">加载更多</a-button>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </template>




    </div>
    <!-- 新建任务 -->
    <bus-project-add-task-modal ref="addTaskModal" @ok="updatedList"></bus-project-add-task-modal>

    <bus-todo-list ref="busTodoList"></bus-todo-list>
    <bus-project-task-detail-list-modal ref="modalForm" @ok="modalFormOk"></bus-project-task-detail-list-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { getAction } from '@/api/manage'
import BusProjectAddTaskModal from './modules/projectTask/BusProjectAddTaskModal'
// import { mixinDevice } from '@/utils/mixin'
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusTodoList from '@views/bus/modules/BusTodoList'
import BusProjectTaskDetailListModal from './BusProjectTaskDetailListModal'
import projectTaskTableList from './modules/projectTask/projectTaskTableList'
import AnnounCement from './modules/AnnounCement'
import Icons from '../system/modules/icon/Icons.vue'
import { defineComponent, ref } from 'vue';

export default {
  name: 'BusProjectList',
  // mixins: [JeecgListMixin, mixinDevice],
  components: {
    BusTodoList,
    BusProjectTaskDetailListModal,
    projectTaskTableList,
    BusProjectAddTaskModal,
    defineComponent,
    AnnounCement,
    setup(props,context){
      console.log('props',props)
      console.log('context',context)
    // setup 可接受两个参数，一个props，和 context
    const filtrate = ref<any>(null);
    // 关闭
    const handleClose = () => {
      filtrate.value.hide();
    };
    return {
      filtrate,
      handleClose,
    };
  }
  },
  props: {
    projectId: {
      type: String
    }
  },
  data() {
    return {
      description: 'bus_project_task_list管理页面',
      dataSource:[],
      url: {
        list: "/bus/busProjectTaskDetail/taskList",
        groubRoleUrl: '/bus/busProjectTaskDetail/homeSearchAppointList',// 分配员工
        getById: '/bus/busProjectMilepost/queryByProjectId',//获取里程碑下拉列表
        getMyTaskProjectList:'/bus/busProject/list',//我参与的任务项目列表
        queryByProjectId:'/bus/busProjectMilepost/queryListByProjectId',//通过项目id查询项目里程碑
      },
      dataSource1:[],
      dataSource2:[],
      dataSource3:[],
      dataSource4:[],
      activeNames:['2'],
      filterNum: [],
      filterform:{},
      groubRoleList: [],
      dictOptions: [],
      clicked: false,
      delayCount:0,//延期计数
      executeCount:0,//执行中计数
      pauseCount:0,//暂停技计数
      completeCount:0,//完场计数
      projectlist:[],//选择项目
      milestone:[],//选择里程碑
      queryCount:10,//完成显示条数
      projectId:'',
      milepostId:'',
      appoint:''
    }
  },
  created() {
  },
  computed: {
  },
  mounted(){
    this.getList(this.queryCount)
    this.getProject()
  },
  methods: {
    updatedList(){
      this.getList(this.queryCount)
    },
    getList(queryCount){
      let param={
        queryCount:queryCount,
        createPerson:this.filterform.createPerson,
        keyword:this.filterform.keyword,
        appoint:this.filterform.appoint,
        projectId:this.projectId ,
        milepostId:this.milepostId,
        type:this.filterform.type,
        endTime:this.filterform.endTime,
      }
      console.log('11233',param)
      getAction(this.url.list,param).then(res=>{
        console.log("--*******",res)
        if(res.success){
          this.dataSource1 = res.result.delayList//延期任务
          this.dataSource2 = res.result.executeList//进行中
          this.dataSource3 = res.result.pauseList//暂停
          this.dataSource4 = res.result.completeList//完成
          this.delayCount = res.result.delayCount
          this.executeCount = res.result.executeCount
          this.pauseCount = res.result.pauseCount
          this.completeCount = res.result.completeCount
        }
          // let result = res.result
          // let dictOptions = []
          // for (let i = 0; i < result.length; i++) {
          //     let temp = result[i];
          //     let item = {}
          //     item.label = temp.projectName
          //     item.value = temp.projectId
          //     dictOptions.push(item);
          // }
          // this.proOptions = dictOptions
        })
    },
    getProject(){
      getAction(this.url.getMyTaskProjectList).then(res=>{
        console.log("++++++",res)
        if(res.success){
          this.projectlist = res.result.records
        }
        })
    },
    loadMore(){
      this.getList(9999)
    },
    onChangeTime(date, dateString) {
      if (dateString.length != 0) {
        this.queryParam.startTime = dateString[0]
        this.queryParam.endTime = dateString[1]
      } else {
        this.queryParam.startTime = ''
        this.queryParam.endTime = ''
      }
    },
    openTodoList() {
      this.$refs.busTodoList.show()
    },
    searchQuery(value,project){
      console.log('value',value)
      console.log('project',project)
      if(project == 'projectId'){
        console.log('0011')
        this.getMilestone(value);
        this.projectId = value
      }
      if(project == 'milepostId'){
        this.milepostId = value
      }

      // this.filterNum = Object.values(this.filterform).filter(el => {
      //     console.log(el,'---------------el')
      //     if (el) {
      //       return true
      //     }
      // })
      this.getList(10)
    },
    getMilestone(value){
      console.log('value',value)
      let param={
        projectId:value
      }
      getAction(this.url.queryByProjectId,param).then(res=>{
        if(res.success){
          this.milestone = res.result
        }
        })
    },
    handledepart(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '任务详情'
      this.$refs.modalForm.disableSubmit = false
    },
    // 新建
    handleAdd(){
        this.$refs.addTaskModal.ifPro = true
        this.$refs.addTaskModal.add(this.projectId);
        this.$refs.addTaskModal.title='新建任务'
    },
    handlePopoverClicked(){
        this.handleAssignOptions()
        this.milepost()

    },
    flashTaskList(){
      this.getList(this.queryCount)
      this.$message.success("刷新成功")
    },
    resetForm() {
      this.filterform = {}
      this.projectlist = []
      this.milestone = []
      this.projectId = ''
      this.milepostId = ''
      this.appoint = ''
      this.getProject()
      this.getList(10)
    },
    // 分配员工
    handleAssignOptions() {
          this.clicked = true; //控制弹出框是否显示
          console.log('this.projectId ',this.projectId )
        getAction(this.url.groubRoleUrl).then(res => {
          console.log('--------',res)
          if (res.success && res.result.length != 0) {
          this.groubRoleList = res.result
          this.clicked = true; //控制弹出框是否显示
          } else {
          this.groubRoleList = []
          // this.$message.warning(res.message)
          }
      })
    },
    //获取里程碑下拉列表
    milepost() {
      // getAction(this.url.getById, { queryByProjectId: this.projectId }).then((res) => {
      //   console.log('*************',res)
      //   this.dictOptions = res.result
      // })
    },
    hide() {
      this.clicked = false;
    },
    uploadList() {
      this.loadData(1);
    },
  }
}
</script>
<style lang="less" scoped>
.head-title {
    font-size: 16px;
    font-weight: bold;
    color: #2F3133;
}
.mytask-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.marr10{
  margin-right: 10px;
}
.ant-collapse-borderless > .ant-collapse-item{
  border-bottom:1px solid #E8EDF6
}
.ant-collapse-borderless{
  background-color:#F7F8FA
}
/deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header{
  font-weight: bold;
}
</style>
