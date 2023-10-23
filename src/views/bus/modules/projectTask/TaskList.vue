<template>
    <div class="box-dist">
        <announ-cement :projectId="projectId"></announ-cement>
        <div  class="btn-list">
            <div style="display:flex;">
                <p style="font-size: 20px;font-weight: bold;color: #2F3133;">任务</p>
                <div class="tab-list">
                        <div :class="{ 'tab-active': currentTab == '1'}" @click="onTabClick('1')">
                            <span>所有</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '2'}" @click="onTabClick('2')">
                            <span>进行中</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '3'}" @click="onTabClick('3')">
                            <span>由我创建</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '4'}" @click="onTabClick('4')">
                            <span>指派给我</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '5'}" @click="onTabClick('5')">
                            <span>由我解决</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '6'}" @click="onTabClick('6')">
                            <span>待关闭</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '7'}" @click="onTabClick('7')">
                            <span>延期</span>
                        </div>
                        <div :class="{ 'tab-active': currentTab == '8'}" @click="onTabClick('8')">
                            <span>未指派</span>
                        </div>
                </div>
            </div>
            <div style="display: flex;">

                    <a-input  placeholder="搜索任务ID/任务标题" @pressEnter="searchQuery" v-model="filterform.keyword">
                        <a-icon slot="prefix" type="search" />
                    </a-input>
                <a-popover  trigger="click" placement="bottomRight" :visible="clicked"  :overlayStyle="{width:'23%'}">
                    <template slot="content">
                        <div style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                            <span style="font-size: 16px;font-weight: bold;color: #2F3133;">筛选</span>
                            <span  @click="hide" style="width: 30px;height: 30px;text-align: center;line-height: 30px;"><a-icon type="close" /></span>
                        </div>
                        <a-form-model layout="vertical" :model="filterform" ref="ruleForm">
                            <a-form-model-item label="关键词" class="labelcss">
                               <a-input v-model="filterform.keyword" placeholder="搜索任务ID/任务标题"  @blur="searchQuery"/>
                            </a-form-model-item>
                            <a-form-model-item label="指派人" class="labelcss">
                                <a-select  v-model="filterform.appoint" placeholder="请选择指派人"   @change="createBySelectChange">
                                    <a-select-opt-group  label="">
                                        <a-select-option :value="item.value" v-for="item in groubRoleList.myOrAll" :key="item.name">
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select-opt-group>
                                    <a-select-opt-group label="其他人">
                                        <a-select-option :value="item.value" v-for="item in groubRoleList.other" :key="item.name">
                                            <div style="display: flex;align-items: center;">
                                                <div style="width: 24px;
                                                height: 24px;
                                                border: 1px solid #D3DCE5;
                                                border-radius: 50%;
                                                text-align: center;
                                                margin-right: 20px;
                                                line-height: 24px;">
                                                    {{ item.name.slice(0,1) }}
                                                </div>
                                                <span>{{ item.name }}</span>
                                            </div>

                                        </a-select-option>
                                    </a-select-opt-group>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="创建人" class="labelcss">
                               <a-input v-model="filterform.createPerson" placeholder="任何"  @blur="searchQuery"/>
                            </a-form-model-item>
                            <a-form-model-item label="里程碑" class="labelcss">
                                <a-select  placeholder="任何" v-model="filterform.milepostId" @change="handleSearchByMile">
                                    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.id">
                                    {{ item.milepostCode }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="类别" class="labelcss">
                                <j-dict-select-tag  v-model="filterform.type" placeholder="任何" @change="handleSearchByType"
                                  dictCode="task_type" />
                            </a-form-model-item>
                            <a-form-model-item label="状态" class="labelcss">
                                  <a-select   @change="handleSearchByStatus" v-model="filterform.status" placeholder="任何">
                                    <a-select-option value="1">
                                        进行中
                                    </a-select-option>
                                    <a-select-option value="4">
                                        已完成
                                    </a-select-option>
                                  </a-select>
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
                    <a-button :style="`margin:0 10px; color:${filterNum>0?'#CC148A':''};`" icon="filter" @click="handlePopoverClicked">
                        筛选<a-badge :count="filterNum" :number-style="{ backgroundColor: '#CC148A' }" style="margin-left: 10px;"
                            v-if="filterNum != 0"></a-badge>
                    </a-button>
                </a-popover>
                <a-button type="primary" style="margin-left: 10px;" icon="plus"  @click="handleAdd()">
                    <!-- <img :src="require('@/assets/clicon.png')" style="margin-right: 5px;margin-bottom: 2px;"/> -->
                    新任务
                </a-button>

            </div>
        </div>
        <a-table ref="table" size="small"  rowKey="id" :columns="columns" :dataSource="dataSource"
            :pagination="ipagination" :loading="loading"  @change="handleTableChange"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <span slot="priority_dictText" slot-scope="text, record">
                <a-dropdown>
                    <a-icon type="exclamation-circle" :style="{color:record.color}" class="iconCss"/>
                    <a-menu slot="overlay">
                        <a-menu-item @click="handleEditPriority(record,'1')">
                            <a-icon type="exclamation-circle" style="color:#D92929;font-size: 24px;margin-right: 10px;"/>高
                        </a-menu-item>
                        <a-menu-item @click="handleEditPriority(record,'2')">
                            <a-icon type="exclamation-circle" style="color:#F2B202;font-size: 24px;margin-right: 10px;"/>中
                        </a-menu-item>
                        <a-menu-item @click="handleEditPriority(record,'3')">
                            <a-icon type="exclamation-circle" style="color:#08C35C;font-size: 24px;margin-right: 10px;"/>低
                        </a-menu-item>
                        <a-menu-item @click="handleEditPriority(record,'4')">
                            <a-icon type="exclamation-circle" style="color:#D3DCE6;font-size: 24px;margin-right: 10px;"/>未定义
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>

            </span>
            <span slot="status" slot-scope="text, record">
                <!-- 1激活 4已处理 5已关闭 -->
                <a-tag  v-if="record.status == '1'" color="#F2B202">进行中</a-tag>
                <a-tag v-if="record.status == '0'" color="#CD128A">未开始</a-tag>
                <a-tag v-if="record.status == '4'" color="#5ED895">已完成</a-tag>
                <a-tag v-if="record.status == '5'" color="#DDDDDD">已关闭</a-tag>
                <a-tag v-if="record.status == '7'" color="#FF8888">已暂停</a-tag>

            </span>
            <template slot="taskTitle" slot-scope="text,record">
                <a-tooltip>
                    <template slot="title">
                        {{text}}
                    </template>
                    <span @click="taskDetail(record)" style="color: #CD128A;">{{text}}</span>
                </a-tooltip>
            </template>
            <span slot="endTime" slot-scope="text, record">
                <a-popover trigger="click" :visible="record.endTimeClicked"
                    @visibleChange="handleClickChange($event,record)">
                    <template slot="content">
                        <a-calendar :fullscreen="false" @select="onPanelChange($event, record)" />
                    </template>
                    <span  style="color: #E15454;">{{ text }}</span>
                </a-popover>

            </span>
            <!-- 里程碑 -->
            <span slot="milepostName" slot-scope="text, record">
                <a-dropdown>
                    <span>{{ text }}</span>
                    <a-menu slot="overlay">
                        <a-menu-item  v-for="item in dictOptions" :key="item.id" @click="handleEditMile(record,item)">
                            {{ item.milepostCode }}
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>
            <span slot="appointUserName" slot-scope="text, record">
                <template v-if="record.appointUserName && record.appointUserName.length != 0">
                    <a-dropdown :trigger="['click']">
                        <div style="display: flex;align-items: center;">
                            <div class="circularCss" >
                            {{ record.appointUserName[0].userName.slice(0,1) }}
                            </div>
                            <span>{{ record.appointUserName[0].userName }} </span>
                            <span style="margin-left: 8px;" v-if="record.appointUserName.length>1">
                                +{{ record.appointUserName.length-1 }}
                            </span>
                        </div>
                        <a-menu slot="overlay">
                            <a-menu-item  v-for="item in record.appointUserName" :key="item.id">
                                <div style="display: flex;align-items: center;">
                                    <div class="circularCss" >
                                    {{ item.userName.slice(0,1) }}
                                    </div>
                                    <span>{{ item.userName }} </span>
                                </div>
                            </a-menu-item>
                            <assign-people ref="assignPeople" :projectId="record.projectId" @submitForm="handleSubmitForm($event,record)">
                                <template slot="addAppoint">
                                    <a-menu-item style="color: #2F3133;font-weight: bold;padding: 5px 12px;cursor: pointer;" @click="handleAddPeo()">
                                        <a-icon type="plus" />添加指派人
                                    </a-menu-item>
                                </template>
                            </assign-people>
                        </a-menu>
                    </a-dropdown>
                </template>
            </span>
            <span slot="createByDictText" slot-scope="text, record">
                <div style="display: flex;align-items: center;">
                    <div class="circularCss" >
                      {{ text.slice(0,1) }}
                    </div>
                    <span>{{ text}}</span>
                </div>
            </span>
            <span slot="action" slot-scope="text, record">
               <!-- <a-tooltip placement="top" style="margin-right:20px;">
                   <template slot="title">
                      <span>处理</span>
                   </template>
                   <img :src="require('@/assets/cl.png')" @click="handleDeal(record)"/>
               </a-tooltip> -->
                <a-tooltip placement="top" style="margin-right:20px;">
                    <template slot="title">
                       <span>编辑</span>
                    </template>
                    <img :src="require('@/assets/edit2.png')" @click="handleEdit(record)"/>
                </a-tooltip>
                <a-dropdown style="margin-right:20px;">
                    <img :src="require('@/assets/more.png')"/>
                    <a-menu slot="overlay">
                        <a-menu-item  @click="pauseTask(record.id)">暂停</a-menu-item>
                        <a-menu-item @click="copyTask(record)">
                            克隆
                        </a-menu-item>
                        <!--关闭需要完成的任务才能关闭 -->
                        <a-menu-item @click="closeTask(record)" v-if="record.status != '5'">
                            关闭
                        </a-menu-item>
                        <a-menu-item v-if="record.userFlag == '1'">
                            <a-popconfirm
                                title="确认删除?"
                                ok-text="删除"
                                cancel-text="取消"
                                @confirm="handleDelete(record)"
                                @cancel="cancel" placement="bottomRight"
                            >
                            <span >删除</span>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>
        </a-table>
        <!-- <div style="font-weight: bold;color: #2F3133;width: 80px;position: fixed;bottom: 50px;" @click="handleAdd()">
            <a-icon type="plus" />添加任务
        </div> -->
                <!-- 新建任务 -->
        <bus-project-add-task-modal ref="addTaskModal" @ok="updatedList"></bus-project-add-task-modal>
        <!-- 处理 -->
        <bus-project-task-deal-modal ref="dealTaskModal" @ok="updatedList"></bus-project-task-deal-modal>
        <!-- 任务详情 -->
        <bus-project-task-detail-modal ref="detailTaskModal" @ok="updatedList"></bus-project-task-detail-modal>
    </div>
</template>
<script>
import { getAction, httpAction,deleteAction } from '@/api/manage'
import BusProjectAddTaskModal from './BusProjectAddTaskModal.vue'
import BusProjectTaskDealModal from './BusProjectTaskDealModal'
import BusProjectTaskDetailModal from './BusProjectTaskDetailModal'
import assignPeople from '../projectTask/assignPeople'
import AnnounCement from '../AnnounCement'
import moment from 'moment'
import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
    props: {
        projectId: {
          type: String
        }
    },
    components: {
        BusProjectAddTaskModal,
        BusProjectTaskDealModal,
        BusProjectTaskDetailModal,
        assignPeople,
        AnnounCement
    },
    mixins:[JeecgListMixin, mixinDevice],
    data(){
        return{
            currentTab:'1',
            columns: [

            ],
            url: {
                getlist: '/bus/busProjectTaskDetail/list',
                edit: "/bus/busProjectTaskDetail/edit",
                groubRoleUrl: '/bus/busProjectTaskDetail/searchAppointList',// 分配员工
                getById: '/bus/busProjectMilepost/queryListByProjectId',//获取里程碑下拉列表
                delete:'/bus/busProjectTaskDetail/delete',
            },
             /* 数据源 */
             dataSource: [],
                         /* 分页参数 */
            ipagination: {
                current: 1,
                pageSize: 12,
                pageSizeOptions: ['10', '30', '50', '100'],
                showTotal: (total, range) => {
                    return ''
                },
                showQuickJumper: false,
                showSizeChanger: false,
                total: 0
            },
            selectedRowKeys: [],
            clicked: false,
            filterform:{},
            groubRoleList: [],
            dictOptions: [],
            filterNum: [],
            endTimeClicked:false,
            searchNum:0,
            clientWidth:''
        }
    },
    watch: {
      projectId: function() {
        this.loadData(this.projectId, '1', 1)
      }
   },
   computed: {
        bgColor() {
            return (name) => {
                if (!name) return 'rgb(119, 153, 153)'
                var str = ''
                for (var i = 0; i < name.length; i++) {
                str += parseInt(name[i].charCodeAt(0), 10).toString(16)
                }
                return '#' + str.slice(0, 2) + str.slice(1, 2)
            }
        },
    },
    mounted(){
        this.milepost()
        this.loadData(this.projectId, '1', 1)
        this.clientWidth = document.documentElement.clientWidth
        this.columnsdata()
        console.log(this.clientWidth,'this.clientWidth')
    },
    methods:{
        columnsdata(){
          if(this.clientWidth<1900){
            this.columns= [
            {
                    title: 'ID',
                    align: 'left',
                    dataIndex: 'taskNo'
                },
                {
                    title: '任务标题',
                    align: 'left',
                    dataIndex: 'taskTitle',
                    scopedSlots: { customRender: 'taskTitle' },
                    width: 300,
                    ellipsis: true,
                },
                // {
                //     title: '里程碑',
                //     align: 'left',
                //     dataIndex: 'milepostName',
                //     scopedSlots: { customRender: 'milepostName' },
                // },
                {
                    title: '类别',
                    align: 'left',
                    dataIndex: 'type_dictText',
                    with:70
                },
                {
                    title: '指派',
                    align: 'left',
                    dataIndex: 'appointUserName',
                    scopedSlots: { customRender: 'appointUserName' },
                },
                // {
                //     title: '创建时间',
                //     align: 'left',
                //     dataIndex: 'createTime',
                // },
                {
                    title: '截止时间',
                    align: 'left',
                    dataIndex: 'endTime',
                    scopedSlots: { customRender: 'endTime' },
                },
                {
                    title: '紧急程度',
                    align: 'left',
                    dataIndex: 'priority_dictText',
                    scopedSlots: { customRender: 'priority_dictText' },
                },
                // {
                //     title: '创建者',
                //     align: 'left',
                //     dataIndex: 'createBy_dictText',
                //     scopedSlots: { customRender: 'createByDictText' },
                // },
                {
                    title: '状态',
                    align: 'left',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 147,
                    scopedSlots: { customRender: 'action' },
                },
            ]
          }
          else{
            this.columns= [
            {
                    title: 'ID',
                    align: 'left',
                    dataIndex: 'taskNo',
                    width: 70,
                },
                {
                    title: '任务标题',
                    align: 'left',
                    dataIndex: 'taskTitle',
                    scopedSlots: { customRender: 'taskTitle' },
                    width: 330,
                    ellipsis: true,
                },
                {
                    title: '里程碑',
                    align: 'left',
                    dataIndex: 'milepostName',
                    scopedSlots: { customRender: 'milepostName' },
                    width: 150,
                },
                {
                    title: '类别',
                    align: 'left',
                    dataIndex: 'type_dictText',
                    width: 60,
                },
                {
                    title: '指派',
                    align: 'left',
                    dataIndex: 'appointUserName',
                    scopedSlots: { customRender: 'appointUserName' },
                    width: 140,
                },
                {
                    title: '创建时间',
                    align: 'left',
                    dataIndex: 'createTime',
                },
                {
                    title: '截止时间',
                    align: 'left',
                    dataIndex: 'endTime',
                    scopedSlots: { customRender: 'endTime' },
                },
                {
                    title: '紧急程度',
                    align: 'left',
                    dataIndex: 'priority_dictText',
                    scopedSlots: { customRender: 'priority_dictText' },
                },
                {
                    title: '创建者',
                    align: 'left',
                    dataIndex: 'createBy_dictText',
                    scopedSlots: { customRender: 'createByDictText' },
                },
                {
                    title: '状态',
                    align: 'left',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                    width: 60,
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 147,
                    scopedSlots: { customRender: 'action' },
                },
            ]
          }
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
        handleSearchByStatus(status){
            this.filterform.status = status
            this.searchQuery()
        },
        handleSearchByType(value) {
            console.log(value,'类别')
            this.filterform.type = value
            this.searchQuery()
        },
        handleSearchByMile(value) {
            this.filterform.milepostId = value
            this.searchQuery()
        },
        createBySelectChange(value) {
            this.filterform.appoint = value
            this.searchQuery()
        },
        cancel(e) {
           console.log(e);
        },
        handleClickChange(visible,record) {
           this.$set(record,'endTimeClicked',visible)
        },
        onPanelChange(value,record) {
          console.log(moment(value).format("YYYY-MM-DD"),record);
          let time = moment(value).format("YYYY-MM-DD")
          this.$set(record,'endTime',time)
          this.submitForm({endTime:time,id:record.id})
          this.$set(record,'endTimeClicked',false)
        },
        handleSubmitForm(appointId,record){
           console.log(appointId,record,'appointId,record')
           let a = record.appoint + ',' + appointId
           this.$set(record,'appoint',a)
            this.submitForm({appoint:a,id:record.id})
        },
        handleAddPeo(){
            this.$refs.assignPeople.handleAssignOptions()
        },
        handleEditMile(record,item){
          this.$set(record,'milepostId',item.id)
          this.submitForm({milepostId:item.id,id:record.id})
        },
        submitForm(record) {
            const that = this;
            let httpurl = '';
            let method = '';
            httpurl += this.url.edit;
            method = 'put';
            record.flag = '1'
            httpAction(httpurl, record, method).then((res) => {
                if (res.success) {
                    that.$message.success(res.message);
                    that.updatedList();
                } else {
                    that.$message.warning(res.message);
                }
            }).finally(() => {
            })
        },
        handleEditPriority(record,priority){
            this.$set(record,'priority',priority)
            this.submitForm({priority:priority,id:record.id})
        },
        taskDetail(record){
            console.log(record)
           this.$refs.detailTaskModal.edit(record)
        },
        async searchQuery() {
           await this.loadData(this.projectId, this.currentTab, 1);
           this.filterNum = this.searchNum
        //    console.log(this.filterNum,'this.filterNum')
        },
        resetForm() {
          this.filterform = {}
          this.filterNum = 0
          this.loadData(this.projectId, this.currentTab, 1);
        },
            //获取里程碑下拉列表
        milepost() {
            getAction(this.url.getById, { projectId: this.projectId }).then((res) => {
                this.dictOptions = res.result
            })
        },
                // 分配员工
        handleAssignOptions() {
            getAction(this.url.groubRoleUrl, { projectId: this.projectId }).then(res => {
                if (res.success && res.result.length != 0) {
                this.groubRoleList = res.result
                this.clicked = true; //控制弹出框是否显示
                } else {
                this.groubRoleList = []
                // this.$message.warning(res.message)
                }
            })
        },
        hide() {
          this.clicked = false;
        },
        handlePopoverClicked(){
            this.handleAssignOptions()
            this.milepost()

        },
        handleAdd(){
            this.$refs.addTaskModal.add(this.projectId);
            this.$refs.addTaskModal.title='新建任务'
            this.$refs.addTaskModal.ifPro = false
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
        },
                // 编辑
        handleEdit(record) {
            this.$refs.addTaskModal.edit(record);
            this.$refs.addTaskModal.title='编辑任务'
        },
        // 处理
        handleDeal(record) {
            this.$refs.dealTaskModal.edit(record);
        },
        // 关闭任务
        closeTask(record) {
            record.flag = '5'
            httpAction(this.url.edit, record, 'put').then((res) => {
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
                // 复制任务
        copyTask(record) {
            record.flag = '6'
            httpAction(this.url.edit, record, 'put').then((res) => {
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
        updatedList() {
            this.filterform = {}
            this.filterNum = 0
            this.loadData(this.projectId, this.currentTab, 1);
        },
        handleDelete(record){
            deleteAction(this.url.delete,{id:record.id}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
        onTabClick(tab){
            this.currentTab = tab
            this.loadData(this.projectId, tab, 1)
        },
        async loadData(projectId, status, arg) {
            this.dataSource = []
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            var params = {};//查询条件
            params = this.filterform;
            params.flag = status;
            params.projectId = projectId;
            params.pageNo = arg
            params.pageSize = this.ipagination.pageSize;
            this.loading = true;
            await getAction(this.url.getlist, params).then((res) => {
                if (res.success) {
                    //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                    this.dataSource = res.result.records || res.result;
                    this.ipagination.total = res.result.total;
                    this.searchNum = res.result.total;
                    this.dataSource.forEach(i=>{
                        i.endTimeClicked = false
                        if(i.priority_dictText == '1'){
                            i.color = '#D92929'
                        }else if(i.priority_dictText == '2'){
                            i.color = '#F2B202'
                        }else if(i.priority_dictText == '3'){
                            i.color = '#08C35C'
                        }else if(i.priority_dictText == '4'){
                            i.color = '#D3DCE5'
                        }
                    })
                    // console.log(this.dataSource,'this.dataSource----------------this.dataSource')
                    //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                }
                if (res.code === 510) {
                    this.$message.warning(res.message)
                }
                this.loading = false;
            })
        },
        handleTableChange(pagination, filters, sorter) {
            //分页、排序、筛选变化时触发
            //TODO 筛选
            console.log(pagination)
            if (Object.keys(sorter).length > 0) {
                this.isorter.column = sorter.field;
                this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
            }
            this.ipagination = pagination;
            this.loadData(this.projectId, this.currentTab,pagination.current);
        },
    }
}
</script>
<style scoped lang="less">
@media screen and (max-width: 1440px) {
    .box-dist{
        padding: 0 12px;
    }
}

@media screen and (min-width: 1441px) {
    .box-dist{
        padding: 0 24px;
    }
}
.iconCss{
    font-size: 24px;
}
.tab-list {
    display: flex;
    width: 555px;
    height: 32px;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    box-sizing: border-box;
    border: 1px solid #EDEFF0;
    border-radius: 4px;
    font-size: 12px;
    color: #8D9399;
    margin-left: 40px;
    &>div {
        flex: 1;
        height: 24px;
        display: flex;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
    }
}
.btn-list {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
}
.tab-active {
    background: #FFFFFF;
    color: #2F3133;
    font-weight: bold;
    font-size: 14px;
}
.btnCss{
    border-color: #d93899;
    color: #d93899;
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
.cust-select-sty {
  border-radius: 15px;
  background: #e8f4ff;
  display: flex;
  padding-right: 5px;
}

.cust-select-sty span:first-child {
  border-radius: 50%;
  width: 25px;
  text-align: center;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
}

.cust-select-sty span:last-child {
  color: #b2c7e0;
  font-size: 17px;
  width: 25px;
  text-align: center;
}

/deep/ .ant-select-selection__choice__content {
  &>.cust-select-sty span:last-child {
    display: none;
  }
}
::v-deep .labelcss .ant-form-item-label > label{
   font-weight: bold;
   color: #2F3337;
   font-size: 14px;
}
::v-deep .ant-input{
  background: #F7F9FA;
  border: 1px solid #EEF0F1;
  color: #8D9399 !important ;
}
::v-deep .ant-select-selection {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
.circularCss{
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 5px 0 0;
    text-align: center;
}
::v-deep .ant-checkbox-inner{
  width: 21px;
  height: 21px;
  background-color: #D4D8DC;
  border: 1px solid #D4D8DC;
  border-radius: 50%;
}
::v-deep .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #08C35C;
    border-color: #D3DCE5;
    border: 1px solid #08C35C;
}
::v-deep .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #D3DCE5;
}
::v-deep .ant-checkbox .ant-checkbox-inner::after {
    color: #fff;
}
</style>