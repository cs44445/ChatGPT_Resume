<template>
    <div>
      <div style="display: flex;justify-content: space-between;align-items: baseline;margin-top: 30px;">
        <div style="width: 75%;">
            <div style="font-size: 16px;font-weight: bold;color: #2F3133;margin-bottom: 10px;">
                <span style="padding: 5px;color: #fff;background-color: #d93899;border-radius: 6px;" v-if="newPageShow">
                   {{ record.projectName }}
                </span>
                {{ record.taskTitle }}
            </div>
            <span style="color: #8D9399;margin: 0 20px 0 0;" >ID:{{ record.taskNo }}</span>
            <span style="color: #8D9399;" >{{ record.createTime }}创建</span>
            <a-dropdown placement="bottomCenter">
              <a-button class="taskTypeBtn" shape="round">{{ record.typeDict }}</a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="handleTaskType(1)">
                  需求
                </a-menu-item>
                <a-menu-item @click="handleTaskType(2)">
                  Bug
                </a-menu-item>
                <a-menu-item @click="handleTaskType(3)">
                  设计
                </a-menu-item>
                <a-menu-item @click="handleTaskType(5)">
                  运维
                </a-menu-item>
                <a-menu-item @click="handleTaskType(4)">
                  其他
                </a-menu-item>
              </a-menu>
            </a-dropdown>
            <a-button style="background: #FFFFFF;color: #8D9399;margin-left: 10px;" shape="round" v-if="record.status=='0'">
              未开始
            </a-button>
            <a-button style="background: #5ED895;color: #fff;margin-left: 10px;border: none;" shape="round" v-if="record.status=='1'">
              进行中
            </a-button>
            <a-button style="background: #F2B202;color: #fff;margin-left: 10px;border: none;" shape="round" v-if="record.status=='4'">
              已完成
            </a-button>
            <span style="margin-left: 10px;">
              <a-popover trigger="click" :visible="endTimeClicked"
                  @visibleChange="handleClickChange">
                  <template slot="content">
                      <a-calendar :fullscreen="false" @select="onPanelChange" />
                  </template>
                  <span v-if="getToday() > record.endTime" style="color: #D92929;">
                    <img :src="require('@assets/r.png')" style="margin-right: 5px;"/>
                    {{ '逾期'+record.endTime+'截止' }}
                  </span>
                  <span v-if="getToday() <= record.endTime">
                    {{ `还有${getDiffDay(getToday(), record.endTime)}天`+' '+record.endTime+'截止' }}
                  </span>

              </a-popover>
            </span>

            <div style="display: flex;margin-top: 10px;">
               <div style="display: flex;margin-right: 10px;align-items: center;" v-for="item in record.appointUserName" :key="item.userName">
                  <div class="circularCss" v-if="item.status == '0'">
                      {{ item.userName.substring(0,1) }}
                  </div>
                  <div class="circularCss" v-if="item.status == '1'">
                      {{ item.userName.substring(0,1) }}
                  </div>
                  <div class="prioritycomplete" v-if="item.status == '4'">
                      <img src="~@/assets/checked.svg" width="20px">
                      {{ item.userName.substring(0,1) }}
                  </div>
                  <span>{{ item.userName }}</span>
               </div>
               <assign-people ref="assignPeople" :projectId="record.projectId" @submitForm="handleSubmitForm">
                  <template slot="addAppoint">
                    <img :src="require('@assets/add.png')" @click="handleAddPeo()"/>
                  </template>
              </assign-people>
            </div>
        </div>
        <div>
          <!-- 右侧的按钮“开始任务”是切换任务的，“任务未开始状态”：左侧状态标签显示“未开始”，右侧按钮为“开始任务”按钮。
                用户点击了“开始任务”，任务变为“任务进行中状态”即：左侧状态标签显示“进行中”，右侧按钮为“完成任务”按钮。
                用户点击了“任务完成”，任务变为“任务完成状态”即：左侧状态标签显示“已完成”，右侧按钮为“继续任务”按钮。
                用户点击了“继续任务”，任务又变为“任务进行中状态”。  status:0 未开始  1进行中 4代表已完成
                flag:4处理  5关闭  6复制 1正常编辑   2开始任务 3继续任务 7暂停任务-->
            <a-button class="btnCss" :class="{ active1: isActive1 }"  @click="handleBtnStatus('1','2')" >
              <a-icon type="caret-right" theme="filled" style="font-size: 20px;"/>{{ btntext }} <!--未开始---------开始任务--->
            </a-button>
            <a-button type="primary" style="margin-left: 10px;"
             :class="{ active: isActive }" @click="handleDeal()"
             v-if="record.appointUserName&&record.appointUserName[0].isMe=='1'">
                <img :src="require('@/assets/clicon.png')" style="margin-right: 5px;margin-bottom: 2px;"/>
                处理
            </a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="handleEdit()" v-if="newPageShow">
               <a-icon type="edit"/>编辑
            </a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="handleBack()" v-if="newPageShow">
                <a-icon type="rollback"/>返回
            </a-button>
            <a-popover  trigger="click"  placement="bottomRight">
                <template slot="content">
                    <div style="margin:15px 0;cursor: pointer;"  @click="handleEdit()" v-if="record.userFlag == '1'&& !newPageShow">
                      <img :src="require('@/assets/plbj.png')" style="margin-right: 15px;"/>
                      编辑
                    </div>
                    <div  style="margin:15px 0;cursor: pointer;"  @click="pauseTask()">
                      <a-icon type="pause-circle" theme="filled" style="margin-right: 15px;color: #D3DCE5;font-size: 16px;" />暂停
                    </div>
                    <div style="margin:15px 0;cursor: pointer;" @click="copyTask(record)">
                      <img :src="require('@/assets/clone.png')" style="margin-right: 15px;"/>克隆
                    </div>
                    <div style="margin:15px 0;cursor: pointer;"  @click="handleNewLink">
                      <img :src="require('@/assets/link.png')" style="margin-right: 15px;"/>在新的标签打开
                    </div>
                    <div style="margin:15px 0;cursor: pointer;"  @click="handleCopyTaskLink">
                      <img :src="require('@/assets/fzlink.png')" style="margin-right: 15px;"/>复制任务链接
                    </div>
                    <div style="margin:15px 0;cursor: pointer;"  @click="closeTask()" v-if="newPageShow">
                        <a-icon type="close-circle"  theme="filled" style="margin-right: 15px;color: #D3DCE5;"/>关闭任务
                    </div>
                    <div style="margin:15px 0;cursor: pointer;" @click="handleDelete()" v-if="record.userFlag == '1'">
                      <img :src="require('@/assets/sc.png')" style="margin-right: 15px;"/>删除任务
                    </div>
                </template>
                <a-button style="margin-left: 10px;"><img :src="require('@/assets/more.png')"/></a-button>
            </a-popover>
        </div>
      </div>

       <div style="display: flex;justify-content: space-between;">
        <div  style="width: 62%;">
            <!-- -------------正文------------ -->
          <a-row style="margin-top: 20px;">
            <a-col :span="24" style="margin-top: 20px;">
              <a-card  style="min-height: 200px;overflow: auto;" :bordered="false">
                <div style="display: flex;justify-content: space-between;">
                  <span style="font-size: 16px;font-weight: bold;color: #2F3133;">正文</span>
                  <a-icon type="fullscreen" @click="handleAmplifyPho"/>
                </div>
                <div style="margin-top: 20px;" v-html="record.describeInfo" @dblclick="handleAmplifyPho" class="test">

                </div>
              </a-card>
            </a-col>
          </a-row>
          <!-- -------------备注------------ -->
          <a-row style="margin-top: 20px;">
            <a-col :span="24">
              <a-card  style="min-height: 200px;overflow: auto;"  :bordered="false">
                <div>
                  <span style="font-size: 16px;font-weight: bold;color: #2F3133;">备注</span>
                </div>
                <div style="margin-top: 20px;" v-html="record.remark">

                </div>
              </a-card>
            </a-col>
          </a-row>
          <!-- ---------------附件------------ -->
          <a-row style="margin-top: 20px;">
            <a-col :span="24">
              <a-card  style="min-height: 200px;overflow: auto;" :bordered="false">
                <div style="margin-bottom: 10px;display: flex;justify-content: space-between;">
                  <span style="font-size: 16px;font-weight: bold;color: #2F3133;">附件</span>
                  <a-upload name="file" :showUploadList="false" :multiple="false" :headers="headers" :action="uploadAction" @change="handleImport" :data="{ 'biz': '10003' }">
                    <a-button type="primary" icon="upload">上传</a-button>
                </a-upload>
                </div>
                <!-- 文件 -->
                <a-table ref="table" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="record.detailFileList" size="small"
                  :pagination="false" class="j-table-force-nowrap">
                  <template slot="fileName" slot-scope="text,col">
                    <div class="table-item">
                      <span>
                        <img src="@/assets/word.png" alt="" v-if="col.fileSuffix == '.docx' || col.fileSuffix == '.doc'">
                        <img src="@/assets/excel.png" alt=""
                          v-else-if="col.fileSuffix == '.xlsx' || col.fileSuffix == '.xls'">
                        <img src="@/assets/pdf.png" alt="" v-else-if="col.fileSuffix == '.pdf'">
                        <img src="@/assets/zip.png" alt="" v-else-if="col.fileSuffix == '.zip' || col.fileSuffix == '.rar'">
                        <img src="@/assets/imgicon.png" alt=""
                          v-else-if="col.fileSuffix == '.png' || col.fileSuffix == '.jpg' || col.fileSuffix == '.jpeg' || col.fileSuffix == '.gif'">
                        <img src="@/assets/other.png" style="width:unset;" alt="" v-else>
                      </span>
                      <div class="table-item-con">
                        <div class="con-title">{{ col.fileName }}</div>
                        <div class="con-desc">
                          <span>{{ col.milepostName }}</span>
                          <span>{{ col.createBy}}</span>
                          <span>{{ col.createTime }}</span>
                          <span>{{ col.fileSize }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <span slot="action" slot-scope="text, col" class="fix-action"
                    style="gap:15px;display: flex; justify-content: flex-end;padding-right: 30px;">
                    <a-tooltip>
                        <template slot="title">
                            查看
                        </template>
                        <span @click="handlePicView(col.filePath)"
                           v-if="col.fileSuffix == '.png' || col.fileSuffix == '.jpg' || col.fileSuffix == '.jpeg' || col.fileSuffix == '.gif'">
                            <img src="@/assets/see.png" class="activeLogoCss" alt="logo">
                        </span>
                    </a-tooltip>
                    <a-tooltip>
                      <template slot="title">
                        下载
                      </template>
                      <span @click="downloadFile(col.filePath)">
                        <img src="@/assets/download.png" class="activeLogoCss" alt="logo">
                      </span>
                    </a-tooltip>

                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteFile(col.id)">
                        <span>
                            <img src="@/assets/del2.png" class="activeLogoCss" alt="logo">
                        </span>
                      </a-popconfirm>
                  </span>
                </a-table>
              </a-card>
            </a-col>
          </a-row>
        </div>
        <div style="width: 33%;">
          <!-- ----------基本信息------------- -->
          <a-row style="margin-top: 20px;">
            <a-col :span="24" style="margin-top: 20px;">
              <a-card  style="min-height: 200px;overflow: auto;" :bordered="false">
                <div>
                  <span style="font-size: 16px;font-weight: bold;color: #2F3133;">基本信息</span>
                </div>
                <div style="margin-top: 20px;" >
                  <div style="display: flex;align-items: center;">
                      <div style="width: 150px;color: #8D9299;">里程碑</div>
                      <div style="display: flex;">
                        <div style="width: 40px;height: 40px;border: 0.5px solid #E8EEF7;background: #FFFFFF;border-radius: 4px;">
                          <div class="mileMonthCss">{{ record.milepostEndDate?record.milepostEndDate.split('-')[1]:'' }}月</div>
                          <div class="mileDayCss">{{ record.milepostEndDate?record.milepostEndDate.split('-')[2]:'' }}</div>
                        </div>
                        <div style="margin-left: 10px;">
                          <div style="font-size: 12px;color: #2F3133;">{{ record.milepostName }}</div>
                          <div style="font-size: 10px;color: #8D9399;">{{ record.milepostStartDate }} 至 {{ record.milepostEndDate }}</div>
                        </div>
                      </div>
                  </div>
                  <div style="display: flex;align-items: center;margin-top: 20px;">
                      <div style="width: 150px;color: #8D9299;">任务类型</div>
                      <div style="color: #2F3133;">{{ record.typeDict }}</div>
                  </div>
                  <div style="display: flex;align-items: center;margin-top: 20px;">
                      <div style="width: 150px;color: #8D9299;">优先级</div>
                      <div style="color: #2F3133;display: flex;align-items: center;">
                          <a-icon type="exclamation-circle" :style="{color:record.color}" class="iconCss"/>
                          <span v-if="record.priority=='1'">高</span>
                          <span v-if="record.priority=='2'">中</span>
                          <span v-if="record.priority=='3'">低</span>
                          <span v-if="record.priority=='4'">未定义</span>
                      </div>
                  </div>
                  <div style="display: flex;align-items: center;margin-top: 20px;">
                      <div style="width: 150px;color: #8D9299;">创建时间</div>
                      <div style="color: #2F3133;">{{ record.createTime }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
          <!-- ----------历史记录------------ -->
          <a-row>
            <a-col :span="24" style="margin-top: 20px;">
              <a-card  style="min-height: 200px;overflow: auto;" :bordered="false">
                <div>
                  <span style="font-size: 16px;font-weight: bold;color: #2F3133;">历史记录</span>
                </div>
                <div style="margin-top: 20px;">
                    <div style="margin-top: 15px;" v-for="item in historyList" :key="item.id">
                      <div style="display: flex;">
                        <div class="circularCss"  style="color: #2F3133;">
                          {{ item.info?item.info.slice(0,1):'' }}
                        </div>
                        <span style="color: #2F3133;margin: 0 20px;width: 100px;">{{ item.createTime }}</span>
                        <span style="color: #2F3133;width: 60%;">{{ item.content }}</span>
                      </div>

                        <div style="display: flex;font-size: 12px;" v-if="item.handleRemark">
                            <div  style="color: #fff;width: 35px;">
                            {{ item.info?item.info.slice(0,1):'' }}
                            </div>
                            <span style="color: #ffff;margin: 0 20px;width: 100px;">{{ item.createTime }}</span>
                            <div style="color: #2F3133;width: 60%;background-color: #F6F6F6;word-wrap: break-word;">
                              <span  v-html="item.handleRemark"></span>
                            </div>

                        </div>
                    </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
          <!-- ----------状态记录-------------- -->
          <a-row>
            <a-col :span="24" style="margin-top: 20px;">
              <a-card  style="min-height: 200px;overflow: auto;" :bordered="false">
                <div>
                  <span style="font-size: 16px;font-weight: bold;color: #2F3133;">状态记录</span>
                </div>
                <div style="margin-top: 20px;">
                    <div style="display: flex;margin-top: 15px;align-items: center;" v-for="item in statusList" :key="item.id">
                        <div class="circularCss"  style="color: #2F3133;">
                              {{ item.info.slice(0,1) }}
                        </div>
                        <span style="color: #2F3133;margin: 0 20px;">{{ item.createTime }}</span>
                        <span style="color: #2F3133;">{{ item.content }}</span>
                    </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
       </div>
          <bus-project-add-task-modal ref="addTaskModal" @ok="updatedList"></bus-project-add-task-modal>
          <!-- 处理 -->
          <bus-project-task-deal-modal ref="dealTaskModal" @ok="updatedList"></bus-project-task-deal-modal>
          <j-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreviewVisible" switchFullscreen width="1000px">
            <img alt="" style="width: 100%" :src="previewImage" />
          </j-modal>
          <a-modal v-model="continueTaskvisible"  @ok="handleContinueTaskModel" :maskClosable="false">
            <p>备注</p>
            <a-textarea
              v-model="continueTaskRemark"
              placeholder="请输入继续任务的原因"
              :auto-size="{ minRows: 4, maxRows: 5 }"
            />
          </a-modal>
          <!-- 正文里的图片点击放大 -->
          <j-modal :visible="ifVisible" :footer="null" @cancel="handleCancelVisible" fullscreen="true" switchFullscreen width="1000px">
            <div  v-html="record.describeInfo" style="margin-top: 30px;" class="test"></div>
          </j-modal>
    </div>
  </template>

  <script>
  import moment from 'moment'
  import { httpAction, getAction, getFileAccessHttpUrl,deleteAction } from '@/api/manage'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import BusProjectTaskDealModal from './BusProjectTaskDealModal'
  import BusProjectAddTaskModal from './BusProjectAddTaskModal'
  import assignPeople from './assignPeople'
  export default {
    name: 'BusProjectTaskDetailForm',
    components: {
      BusProjectTaskDealModal,BusProjectAddTaskModal,assignPeople
    },
    props:{
        newPageShow:{
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
      return {
        title: '',
        isActive: false,
        isActive1: true,
        width: '75vw',
        disableSubmit: false,
        record: {},
        url: {
          statusInfo: '/bus/busProjectTaskDetail/queryStatusInfoByTaskId',
          taskHistory: '/bus/busProjectTaskHistory/list',//历史记录
          edit: "/bus/busProjectTaskDetail/edit",
          groubRoleUrl: '/bus/busProjectTaskDetail/searchAppointList',// 分配员工
          add: "/bus/busProjectTaskDetail/add",
          detail:'bus/busProjectTaskDetail/queryById',
          delete:'/bus/busProjectTaskDetail/delete',
          lookimage: '/api/flowProcAppr/tracePhoto',
          fileDelete: "/bus/busFileOnline/delete",
        },
        historyList: [],
        statusList: [],
        fileList: [],
        taskType:'',
        ifExpand:false,
        headers: {
        },
        uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
        groubRoleList:[],
        btntext:'开始任务',
        endTimeClicked:false,
        columns: [
          {
            title: '',
            align: "left",
            dataIndex: 'fileName',
            scopedSlots: { customRender: 'fileName' }
          },
          {
            title: '',
            dataIndex: 'action',
            align: "center",
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataSource: null,
        selectedRows: [],
        selectedRowKeys: [],
        previewVisible: false,
        ifVisible:false,
        previewImage: '',
        showPhoto:'',
        continueTaskvisible:false,
        continueTaskRemark:''
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
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = { "X-Access-Token": token };
    },
    methods: {
            //暂停
      pauseTask(){
         let that = this
         let param = {
           id : this.record.id,
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
      handleContinueTaskModel(){
        this.handleSubmit({flag:3,id:this.record.id,remark:this.continueTaskRemark})
        this.continueTaskvisible = false
      },
            // 文件删除
        handleDeleteFile(id) {
            deleteAction(this.url.fileDelete + '?id=' + id).then((res) => {
                // console.log(res)
                if (res.success && res.code == 200) {
                  this.handleSubmit({fileList:this.record.fileList,flag:'1',id:this.record.id,projectId:this.record.projectId})
                  this.$message.success(`删除成功`);
                } else {
                  this.$message.warning(res.message);
                }
            })
        },
        handleImport(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file.response.message, info.fileList);
            }
            if (info.file.status === 'done') {
                let pic = info.file.response.message
                if(this.record.fileList){
                    let arr =  this.record.fileList.split(',')
                    arr.push(pic)
                    this.record.fileList = arr.join(',')
                }else{
                    this.$set(this.record,'fileList',pic)
                }
                this.handleSubmit({fileList:this.record.fileList,flag:'1',id:this.record.id,projectId:this.record.projectId})
                // this.$message.success(`上传成功`);
            } else if (info.file.status === 'error') {
                this.$message.error(`上传失败`);
            }
        },
      handleCancelPreviewVisible(){
        this.previewVisible = false;
      },
      handleCancelVisible(){
        this.ifVisible = false;
      },
      handleAmplifyPho(){
        this.ifVisible = true;
      },
      async handlePicView(file) {
        this.previewImage = process.env.VUE_APP_API_BASE_URL + '/sys/common/static/' +file
        this.previewVisible = true;
      },
      handleBack(){
        window.open('/bus/projectDetails?projectId='+this.record.projectId)
      },
      handleNewLink(){
        window.open('/bus/taskDetails?taskId='+this.record.id)
      },
      getDiffDay(date_1, date_2) {
        // 计算两个日期之间的差值
        let totalDays,diffDate
        let myDate_1 = Date.parse(date_1)
        let myDate_2 = Date.parse(date_2)
        // 将两个日期都转换为毫秒格式，然后做差
        diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值

        totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整

        return totalDays    // 相差的天数
      },
      onPanelChange(value) {
        this.$set(this.record,'endTime',moment(value).format("YYYY-MM-DD"))
        this.endTimeClicked = false
        this.handleSubmit({flag:'1',id:this.record.id,endTime:moment(value).format("YYYY-MM-DD")})
      },
      handleClickChange(visible) {
          this.endTimeClicked = visible
      },
      getToday(){
          let today = new Date();
          let year = today.getFullYear();
          let month = today.getMonth()+1<10?'0'+(today.getMonth()+1) : today.getMonth()+1;
          let date = today.getDate()<10?'0'+today.getDate() : today.getDate();
          return year + "-" + month + "-" + date;
      },
      handleAddPeo(){
          this.$refs.assignPeople.handleAssignOptions()
      },
      loadDetail(id){
        //console.log(res.result.appointUserName[0].isMe);
        getAction(this.url.detail,{id:id}).then(res=>{
          if(res.success){
            if (res.result.fileList) {
              this.fileList = res.result.fileList.split(',')
            }
            if(res.result.appointUserName){
              //如果是指派人他的状态是0就是未开始，未开始不能处理任务 要隐藏处理按钮
              if(res.result.appointUserName[0].status == '0' && res.result.appointUserName[0].isMe == '1'){
                this.isActive = true;  //当点击按钮触发事件时改变两个按钮的显示
                this.isActive1 = false;  //当点击按钮触发事件时改变两个按钮的显示

                this.btntext = '开始任务'
                //如果状态是1就是用户开始了 开始只能处理
              }else if(res.result.appointUserName[0].status == '1' && res.result.appointUserName[0].isMe == '1'){
                this.isActive1 = true;  //当点击按钮触发事件时改变两个按钮的显示
                this.isActive = false;  //当点击按钮触发事件时改变两个按钮的显示
                this.btntext = ''
                //如果处理了 处理按钮就要隐藏
              }else if((res.result.appointUserName[0].status == '4'||res.result.appointUserName[0].status == '5') && res.result.appointUserName[0].isMe == '1'){
                this.isActive = true;  //当点击按钮触发事件时改变两个按钮的显示
                this.isActive1 = false;  //当点击按钮触发事件时改变两个按钮的显示

                this.btntext = '继续任务'
              }else {
                if(res.result.status == '4' || res.result.status == '5') {
                  this.btntext = '继续任务'
                  this.isActive1 = false;  //当点击按钮触发事件时改变两个按钮的显示

                }else{
                  this.isActive1 = true;  //当点击按钮触发事件时改变两个按钮的显示

                }
              }
            }
            if(res.result.priority=='1'){
              res.result.color='#D92929'
            }else if(res.result.priority=='2'){
              res.result.color='#F2B202'
            }else if(res.result.priority=='3'){
              res.result.color='#08C35C'
            }else if(res.result.priority=='4'){
              res.result.color='#D3DCE6'
            }
            this.record = res.result

          }else {
            this.$message.warning('获取任务详情失败')
          }
        })
      },
      handleBtnStatus(status,flag){
        // status:0 未开始  1进行中 4代表已完成
        // flag:4处理  5关闭  6复制 1正常编辑   2开始任务 3继续任务 7暂停任务
        this.$set(this.record,'status',status)
        if(this.record.appointUserName){
          this.$set(this.record.appointUserName[0],'status',status)
        }
        this.continueTaskvisible = true
        // if(status == '0'){
        //   this.btntext = '开始任务'
        // }else if(status == '4'){
        //   this.btntext = '继续任务'
        // }else if(status == '1'){
        //   this.btntext = '任务完成'
        // }
        //
      },
      copyEvent (url) {
        var copyInput = document.createElement("input"); // 创建元素
        //val是要复制的内容
        copyInput.setAttribute("value", url);
        document.body.appendChild(copyInput);
        copyInput.select()
        try {
          var copyed = document.execCommand("copy");
          if (copyed) {
            document.body.removeChild(copyInput);
            this.$message.success("复制成功");
          }
        } catch {
          this.$message.error("复制失败，请检查浏览器兼容");
        }

      },
      handleCopyTaskLink(){
        let url=window.location.href
         console.log(url)
         this.copyEvent(url)
      },
        handleDelete(){
            deleteAction(this.url.delete,{id:this.record.id}).then(res=>{
                if (res.success) {
                    this.$message.success(res.message);
                    this.$emit('ok')
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
        // 编辑
        handleEdit() {
            this.$refs.addTaskModal.title='编辑任务'
            this.$refs.addTaskModal.edit(this.record);
        },
        // 处理
        handleDeal() {
            this.$refs.dealTaskModal.edit(this.record);
        },
      handleChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
      expandText(){
         this.ifExpand = !this.ifExpand
      },
      handleSubmit(params){
        httpAction(this.url.edit, params, 'put').then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadDetail(this.record.id)
            this.getStatusHistory(this.record.id)
            this.getTaskHistory(this.record.id)
            this.$emit('ok');
          } else {
            this.$message.warning(res.message);
          }
        }).finally(() => {
        })
      },
      handleTaskType(type){
          // this.taskType = type
        this.$set(this.record,'type',type)
        if(type==1){
          this.$set(this.record,'typeDict','需求')
        }else if(type==2){
          this.$set(this.record,'typeDict','BUG')
        }else if(type==3){
          this.$set(this.record,'typeDict','设计')
        }else if(type==4){
          this.$set(this.record,'typeDict','其他')
        }else if(type==5){
          this.$set(this.record,'typeDict','运维')
        }
        this.handleSubmit({type:type,flag:'1',id:this.record.id})
      },
      handleSubmitForm(appointId){
        this.record.appoint = this.record.appoint + ',' + appointId
        this.handleSubmit({flag:'1',id:this.record.id,appoint:this.record.appoint})
        console.log(this.record,'this.record')
      },
      submitForm() {
        const that = this;
        let httpurl = '';
        let method = '';
        if (!this.record.id) {
          httpurl += this.url.add;
          method = 'post';
          this.record.projectId = this.proId
        } else {
          httpurl += this.url.edit;
          method = 'put';
          this.record.flag = '1'
        }
        httpAction(httpurl, this.record, method).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit('ok');
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
        })
      },
      handleAddPersonnel(){

      },
      edit(taskId) {
        this.getStatusHistory(taskId)
        this.getTaskHistory(taskId)
        this.loadDetail(taskId)
      },
      close() {
        this.$emit('close');
        this.fileList = []
      },
      // 状态记录
      getStatusHistory(id) {
        getAction(this.url.statusInfo, { taskId: id }).then(res => {
          if (res.success && res.result.length != 0) {
            this.statusList = res.result
          } else {
            this.statusList = []
            // this.$message.warning(res.message)
          }
        })
      },
      // 历史记录
      getTaskHistory(id) {
        getAction(this.url.taskHistory, { taskId: id }).then(res => {
          if (res.success && res.result.records.length != 0) {
            this.historyList = res.result.records
          } else {
            this.historyList = []
            // this.$message.warning(res.message)
          }
        })
      },
      /* 文件下载 */
      // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
      downloadFile(text) {
        if (!text) {
          this.$message.warning("未知的文件")
          return;
        }
        if (text.indexOf(",") > 0) {
          text = text.substring(0, text.indexOf(","))
        }
        let url = getFileAccessHttpUrl(text)
        window.open(url);
      },
      // 编辑
      handleEdit() {
        this.$refs.addTaskModal.edit(this.record);
      },
      // 处理
      handleDeal() {
        this.$refs.dealTaskModal.edit(this.record);
      },
      // 关闭任务
      closeTask() {
        this.record.flag = '5'
        httpAction(this.url.edit, this.record, 'put').then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.updatedList();
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      updatedList() {
        this.loadDetail(this.record.id)
        this.getStatusHistory(this.record.id)
        this.getTaskHistory(this.record.id)
        this.$emit('ok')
      }
    }
  }
  </script>
  <style lang="less" scoped>
  .test ::v-deep img{
    max-width: 100%;
  }
  ::v-deep .ant-modal-content{
    background-color: #f6f6f6;
  }
  .con-title {
    font-size: 14px;
    font-weight: bold;
    color: #2F3133;
  }

  .con-desc {
    font-size: 12px;
    color: #8D9399;
    display: flex;
    gap: 15px;
  }
  .fix-action span {
    display: flex;
    align-items: center;
  }
  .table-item {
    display: flex;
    gap: 11px;
    align-items: center;
    margin: 2px 0;
  }

  .table-item img {
    width: 32px;
    height: 32px;
  }
  .activeLogoCss:hover {
    cursor: pointer;
  }
  .finishBtnCss,.continueBtnCss{
    border: 1px solid #D8D8D8;
    color: #2F3133;
  }
  .iconCss{
    margin-right: 10px;
    font-size: 24px;
  }
  .btnCss{
      border-color: #d93899;
      color: #d93899;
  }
  .mileMonthCss{
    width: 38px;
    border-radius: 4px 4px 0 0;
    background-color: #F2B202;
    color: #FFFFFF;
    text-align: center;
    font-size: 8px;
  }
  .mileDayCss{
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #3D3D3D;
  }
  ::v-deep .ant-upload.ant-upload-drag{
    background-color: #ffffff !important;
      border: none!important;
      color: #8D9399 !important ;
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
    margin: 0 10px 0 0;
    img{
      position: absolute;
      right: 0px;
      top: 0px;
      width: 10px;
      height: 10px;
    }
  }
  .uploadBtn{
    color: #CD128A;
    border-color: #d93899;
  }
  p{
    overflow:hidden;
    white-space:pre-line;
    text-overflow:ellipsis
  }
  .taskTypeBtn,.taskTypeBtn:hover{
    background: #136DEB;
    color: #FFFFFF;
    margin-left: 20px;
    border: 1px solid #136DEB;
  }
  .cust-task /deep/.ant-modal-body {
    position: relative;
  }

  .info-box {
    /deep/ img {
      max-width: 100%;
    }
  }

  .title-taskno {
    padding: 2px 10px;
    border-radius: 4px;
    background-color: rgba(25, 144, 255, 1);
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    margin-right: 10px;
  }

  .title-act {
    border: 1px solid #8666bb;
    padding: 2px 10px;
    font-size: 12px;
    background: #f0ebf9;
    border-radius: 4px;
  }

  .title-dea {
    border: 1px solid #43a047;
    padding: 2px 10px;
    font-size: 12px;
    background: #eff9f0;
    border-radius: 4px;
  }

  .title-clo {
    border: 1px solid #838a9d;
    padding: 2px 10px;
    font-size: 12px;
    background: #ebebeb;
    border-radius: 4px;
  }

  .info-box {
    background: #f5f5f5;
    padding: 15px 25px;
  }

  .title-margin {
    margin: 20px 0;
  }

  .appoint-box {
    display: flex;
    align-items: center;
  }

  .appoint-box-con {
    background: #fff;
    padding: 5px 5px 0 5px;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }

  .appoint-items {
    width: 30%;
    padding-right: 5px;
    height: 25px;
    // line-height: 20px;
    border-radius: 24px;
    background-color: rgba(232, 244, 255, 1);
    color: rgba(16, 16, 16, 1);
    display: flex;
    align-items: center;
    margin-right: 5px;
    margin-bottom: 5px;
    // margin-top: 5px;
  }

  .appoint-items span {
    display: flex;
    width: 25px;
    height: 25px;
    // line-height: 20px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }

  .task-action {
    position: absolute;
    left: 41%;
    bottom: -15px;
    width: 290px;
    border-radius: 5px;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 1);
    z-index: 999;
    background: #bbbbbb;
    padding: 15px;
    display: flex;
    align-items: center;
  }

  .task-action-item {
    flex: 1;
    color: #fff;
    font-size: 18px;
    padding: 0 10px;
    border-right: 1px solid #fff;
    cursor: pointer;
  }

  .task-action .task-action-item:last-child {
    border-right: none;
  }

  .circularCss{
      width: 30px;
      height: 30px;
      border: 1px solid #D3DCE5;
      border-radius: 50%;
      margin: 0 10px 0 0;
      text-align: center;
      line-height: 28px;
  }
  .active {
    display: none; // 隐藏
  }
  .active1 {
    display: none; // 隐藏
  }
  </style>