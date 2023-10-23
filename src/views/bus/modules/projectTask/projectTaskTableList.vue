<template>
<div>
    <a-table v-if="title" ref="table" size="small" rowKey="id" :columns="columns" :scroll="{ x: 950}"
    :pagination="false" :loading="loading" class="titletable" @change="handleTableChange">
    </a-table>
    <a-table v-else ref="table" size="small" rowKey="id" :columns="columns" :dataSource="dataSource" :show-header="false" :scroll="{ x: 950}"
        :pagination="false" :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">
        <template slot="operation" slot-scope="text,record">
        <a-button type="link" style="padding:0px;">
            <img v-if="checked" src="~@/assets/checked.svg" width="20px">
            <img v-else src="~@/assets/unchecked.svg" width="20px"  @click="handleDeal(record)">
        </a-button>
        </template>
        <template slot="taskTitle" slot-scope="text,record">
            <a-tooltip>
                <template slot="title">
                    {{record.taskNo}}-{{text}}
                </template>
                <span @click="taskDetail(record)" style="color: #CD128A;">{{record.taskNo}}-{{text}}</span>
            </a-tooltip>

        </template>
        <template slot="projectName" slot-scope="text,record">
            <a-tooltip>
                <template slot="title">
                    {{text}}
                </template>
                <span @click="projectTaskMore(record)" style="color: #CD128A;">{{text}}</span>
            </a-tooltip>
        </template>

        <template slot="createpersonslot" slot-scope="text,record">
          <a-tooltip>
            <template slot="title">
              {{ record.createPerson }}
            </template>
            <div class="prioritycss">
              {{ record.createPerson.substring(0,1) }}
            </div>
          </a-tooltip>

        </template>
        <template slot="priorityslot" slot-scope="text,record">
        <div class="prioritycss">
            <span v-if="record.priority == '1'" style="color:#D92929">
            <a-icon type="exclamation" />
            </span>
            <span v-if="record.priority == '2'" style="color:#F2B202">
            <a-icon type="exclamation" />
            </span>
            <span v-if="record.priority == '3'" style="color:#08C35C">
            <a-icon type="exclamation" />
            </span>
            <span v-if="record.priority == '4'">
            <a-icon type="exclamation" />
            </span>
        </div>
        </template>
        <template slot="appointUserNameslot" slot-scope="text,record">
        <span v-for="item in record.appointUserName.slice(0,2)" :key="item">
          <a-tooltip>
            <template slot="title">
              {{ item.userName }}
            </template>
            <div class="prioritycss" v-if="item.status == '0'">
                {{ item.userName.substring(0,1) }}
            </div>
            <div class="prioritycss" v-if="item.status == '1'">
                {{ item.userName.substring(0,1) }}
            </div>
            <div class="prioritycomplete" v-if="item.status == '4'">
                <img src="~@/assets/checked.svg" width="20px">
                {{ item.userName.substring(0,1) }}
            </div>
          </a-tooltip>

        </span>
        <span v-if="record.appointUserName.length>2">+{{record.appointUserName.length - 2}}</span>
        </template>
        <span slot="status" slot-scope="text, record">
            <!-- 1激活 4已处理 5已关闭 -->
            <a-tag  v-if="record.status == '1'" color="#F2B202">进行中</a-tag>
            <a-tag v-if="record.status == '0'" color="#CD128A">未开始</a-tag>
            <a-tag v-if="record.status == '4'" color="#5ED895">已完成</a-tag>
            <a-tag v-if="record.status == '5'" color="#D3DCE5">已关闭</a-tag>
            <a-tag v-if="record.status == '7'" color="#FF8888">已暂停</a-tag>
        </span>
        <span slot="projectStatus_dictText" slot-scope="text, record">
        <a-dropdown>
            <template #overlay>
            <a-menu>
                <a-menu-item key="edit" @click="handleEdit(record)">编辑</a-menu-item>
                <!-- <a-menu-item key="moveorcopy">移动或复制</a-menu-item>
                <a-menu-item key="history">查看历史</a-menu-item>
                <a-menu-item key="clone">克隆</a-menu-item>
                <a-menu-item key="add">添加附件</a-menu-item>
                <a-menu-item key="alert">设置为提醒</a-menu-item>-->
                <a-menu-item key="pause" v-if="record.status == 1" style="color:#FF8888" @click="pauseTask(record.id)">暂停</a-menu-item>
                <a-menu-item key="delete" style="color:red" @click="showConfirm(record.id)">删除</a-menu-item>
            </a-menu>
            </template>
            <a-icon type="ellipsis" />
        </a-dropdown>
        </span>
    </a-table>
    <!-- 新建任务 -->
    <bus-project-add-task-modal ref="addTaskModal" @ok="updatedList"></bus-project-add-task-modal>
    <!-- 处理 -->
    <bus-project-task-deal-modal ref="dealTaskModal" @ok="updatedList"></bus-project-task-deal-modal>
    <!-- 任务详情 -->
    <bus-project-task-detail-modal ref="detailTaskModal" @ok="updatedList"></bus-project-task-detail-modal>
    <!-- 查看本项目下所有任务 -->
    <bus-project-task-more-modal ref="taskMoreModal" @ok="updatedList"></bus-project-task-more-modal>
</div>
</template>
<script>
import { httpAction, getAction, deleteAction, postAction } from '@/api/manage'
import BusProjectAddTaskModal from '../../modules/projectTask/BusProjectAddTaskModal'
import BusProjectTaskDealModal from './BusProjectTaskDealModal'
import BusProjectTaskDetailModal from '../../modules/projectTask/BusProjectTaskDetailModal'
import BusProjectTaskMoreModal from '../../modules/projectTask/BusProjectTaskMoreModal'
export default {
    props: ['dataSource','checked','title'],
    components: {
        BusProjectAddTaskModal,
        BusProjectTaskDetailModal,
        BusProjectTaskMoreModal,
        BusProjectTaskDealModal
    },
    data(){
        return{
            // 表头
            // columns: [
            //     {
            //     title:"",
            //     align: "left",
            //     scopedSlots: { customRender: 'operation' },
            //     width:30,

            //     },
            //     {
            //     title:"任务名称",
            //     align: "left",
            //     dataIndex: 'taskTitle',
            //     scopedSlots: { customRender: 'taskTitle' },
            //     width:400,
            //     // fixed: 'left',
            //     ellipsis: true
            //     },
            //     {
            //     title:"类别",
            //     align: "left",
            //     dataIndex: 'typeDict',
            //     ellipsis: true,
            //     width:50,
            //     },
            //     {
            //     title:"项目名称",
            //     align: "left",
            //     dataIndex: 'projectName',
            //     scopedSlots: { customRender: 'projectName' },
            //     ellipsis: true,
            //     width:140
            //     },
            //     {
            //     title:"里程碑",
            //     align: "left",
            //     dataIndex: 'milepostName',
            //     ellipsis: true,
            //     },
            //     {
            //     title:"到期时间",
            //     align: "left",
            //     dataIndex: 'endTime',
            //     customRender: function (text) {
            //         return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            //     },
            //     },
            //     {
            //     title:"优先级",
            //     align: "left",
            //     dataIndex: 'priority',
            //     scopedSlots: { customRender: 'priorityslot' },
            //     width:60,
            //     },
            //     {
            //     title:"创建者",
            //     align: "left",
            //     dataIndex: 'createPerson',
            //     scopedSlots: { customRender: 'createpersonslot' },
            //     width:60,
            //     },
            //     {
            //     title:"创建时间",
            //     align: "left",
            //     dataIndex: 'createTime',
            //     customRender: function (text) {
            //         return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            //     },
            //     },
            //     {
            //     title:"指派",
            //     align: "left",
            //     dataIndex: 'appointUserName.userName',
            //     scopedSlots: { customRender: 'appointUserNameslot' },
            //     },
            //     {
            //     title:"状态",
            //     align: "left",
            //     dataIndex: 'status',
            //     scopedSlots: { customRender: 'status' },
            //     },
            //     {
            //     title:"操作",
            //     align: "left",
            //     dataIndex: '',
            //     scopedSlots: { customRender: 'projectStatus_dictText' },
            //     width:50
            //     }
            // ],
            columns:[],
            url:{
                delete:'/bus/busProjectTaskDetail/delete',
                edit: "/bus/busProjectTaskDetail/edit",

            },
            clientWidth:''
        }
    },
    watch: {
    },
    mounted() {
      this.clientWidth = document.documentElement.clientWidth
      this.columnsdata()
    },
    methods:{
        columnsdata(){
          if(this.clientWidth<'1900'){
            this.columns= [
                {
                title:"",
                align: "left",
                scopedSlots: { customRender: 'operation' },
                width:30,
                },
                {
                title:"任务名称",
                align: "left",
                dataIndex: 'taskTitle',
                scopedSlots: { customRender: 'taskTitle' },
                width:400,
                // fixed: 'left',
                ellipsis: true
                },
                {
                title:"类别",
                align: "left",
                dataIndex: 'typeDict',
                ellipsis: true,
                width:50,
                },
                {
                title:"项目名称",
                align: "left",
                dataIndex: 'projectName',
                scopedSlots: { customRender: 'projectName' },
                ellipsis: true,
                width:140
                },
                // {
                // title:"里程碑",
                // align: "left",
                // dataIndex: 'milepostName',
                // ellipsis: true,
                // },
                {
                title:"到期时间",
                align: "left",
                dataIndex: 'endTime',
                customRender: function (text) {
                    return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
                },
                },
                {
                title:"优先级",
                align: "left",
                dataIndex: 'priority',
                scopedSlots: { customRender: 'priorityslot' },
                width:60,
                },
                // {
                // title:"创建者",
                // align: "left",
                // dataIndex: 'createPerson',
                // scopedSlots: { customRender: 'createpersonslot' },
                // width:60,
                // },
                // {
                // title:"创建时间",
                // align: "left",
                // dataIndex: 'createTime',
                // customRender: function (text) {
                //     return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
                // },
                // },
                {
                title:"指派",
                align: "left",
                dataIndex: 'appointUserName.userName',
                scopedSlots: { customRender: 'appointUserNameslot' },
                },
                {
                title:"状态",
                align: "left",
                dataIndex: 'status',
                scopedSlots: { customRender: 'status' },
                },
                {
                title:"操作",
                align: "left",
                dataIndex: '',
                scopedSlots: { customRender: 'projectStatus_dictText' },
                width:50
                }
            ]
          }
          else{
            this.columns= [
                {
                title:"",
                align: "left",
                scopedSlots: { customRender: 'operation' },
                width:30,

                },
                {
                title:"任务名称",
                align: "left",
                dataIndex: 'taskTitle',
                scopedSlots: { customRender: 'taskTitle' },
                width:400,
                // fixed: 'left',
                ellipsis: true
                },
                {
                title:"类别",
                align: "left",
                dataIndex: 'typeDict',
                ellipsis: true,
                width:50,
                },
                {
                title:"项目名称",
                align: "left",
                dataIndex: 'projectName',
                scopedSlots: { customRender: 'projectName' },
                ellipsis: true,
                width:140
                },
                {
                title:"里程碑",
                align: "left",
                dataIndex: 'milepostName',
                ellipsis: true,
                },
                {
                title:"到期时间",
                align: "left",
                dataIndex: 'endTime',
                customRender: function (text) {
                    return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
                },
                },
                {
                title:"优先级",
                align: "left",
                dataIndex: 'priority',
                scopedSlots: { customRender: 'priorityslot' },
                width:60,
                },
                {
                title:"创建者",
                align: "left",
                dataIndex: 'createPerson',
                scopedSlots: { customRender: 'createpersonslot' },
                width:60,
                },
                {
                title:"创建时间",
                align: "left",
                dataIndex: 'createTime',
                customRender: function (text) {
                    return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
                },
                },
                {
                title:"指派",
                align: "left",
                dataIndex: 'appointUserName.userName',
                scopedSlots: { customRender: 'appointUserNameslot' },
                },
                {
                title:"状态",
                align: "left",
                dataIndex: 'status',
                scopedSlots: { customRender: 'status' },
                },
                {
                title:"操作",
                align: "left",
                dataIndex: '',
                scopedSlots: { customRender: 'projectStatus_dictText' },
                width:50
                }
            ]
          }
        },
        showConfirm(id) {
          let that = this
          this.$confirm({
                title: '确认要删除这条数据？',
                onOk() {
                    let param = {
                        id : id
                    }
                    return deleteAction(that.url.delete,param).then(res=>{
                        console.log('res',res)
                        if(res.success){
                            that.$message.success(res.message);
                            that.updatedList();
                        }else {
                          that.$message.warning(res.message);
                        }
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    }).catch(() => console.log('出现错误!'));
                },
                onCancel() {},
            });
        },
      //暂停
       pauseTask(id){
         let that = this
         let param = {
           id : id,
           status : 7,
           flag : 1
         }
         httpAction(that.url.edit, param, 'put').then((res) => {
           if (res.success) {
             this.$message.success(res.message);
             this.updatedList();
           } else {
             this.$message.warning(res.message);
           }
         })
       },
        // 编辑
        handleEdit(record) {
            this.$refs.addTaskModal.ifPro = true
            this.$refs.addTaskModal.edit(record);
            this.$refs.addTaskModal.title='编辑任务'
        },

        taskDetail(record){
            console.log(record)
           this.$refs.detailTaskModal.edit(record)
        },
        projectTaskMore(record){
          console.log(record)
          this.$refs.taskMoreModal.edit(record)
        },
        // 处理
        handleDeal(record) {
            console.log(record,'处理-----------')
            this.$refs.dealTaskModal.edit(record);
        },
        updatedList(){
            this.$emit('ok');
        }
    }
}
</script>
<style lang="less" scoped>

.prioritycss{
  width: 30px;
  height: 30px;
  border: 1px solid #D7DFE8;
  text-align: center;
  line-height: 30px;
  border-radius: 30px;
  display: inline-block;
  margin: 0 1px;
}
.prioritycomplete{
  width: 30px;
  height: 30px;
  border: 1px solid #08C35C;
  text-align: center;
  line-height: 30px;
  border-radius: 30px;
  display: inline-block;
  position: relative;
  margin: 0 1px;
  img{
    position: absolute;
    right: 0px;
    top: 0px;
    width: 10px;
    height: 10px;
  }
}
/deep/ .titletable{
  padding: 0 16px;
  .ant-table-placeholder{
    display: none;
  }
}
/deep/ .ant-table-column-title{
  font-size: 14px;
}
</style>