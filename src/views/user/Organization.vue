<template>
  <div>
    <j-modal :title="title" :width="1000" :visible="visible" :maskClosable="false" @cancel="handleCancel">
      <a-card :bordered="false">
        <div class="person-header">
          <div class="person-img" :style="{ backgroundColor: bgColor(sysUser.realname) }">
            {{ sysUser.realname ? sysUser.realname.substring(0, 1) : '' }}
          </div>
          <div class="person-name">
            <div style="margin-bottom: 10px">{{ sysUser.realname }}</div>
            <div class="base-info">
              <div>
                <a-icon type="mail" class="base-icon" /><span>{{ sysUser.email ? sysUser.email : '暂无' }}</span>
              </div>
              <div>
                <a-icon type="phone" class="base-icon" /><span>{{ sysUser.telephone ? sysUser.telephone : sysUser.phone }}</span>
              </div>
              <div>
                <a-icon type="team" class="base-icon" /><span>{{ sysUser.departName ? sysUser.departName : '暂无' }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 切换 -->
        <div class="info-tab">
          <a-tabs default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="基本信息">
              <div class="contact-info">
                <h2>联系人信息</h2>
                <div class="info-item">
                  <div class="info-mail">
                    <div class="info-icon">
                      <a-icon type="mail" />
                    </div>
                    <div class="info-content">
                      <div>邮箱</div>
                      <div>{{ sysUser.email ? sysUser.email : '暂无' }}</div>
                    </div>
                  </div>
                  <div class="info-mail">
                    <div class="info-icon">
                      <a-icon type="phone" />
                    </div>
                    <div class="info-content">
                      <div>电话</div>
                      <div>{{ sysUser.telephone ? sysUser.telephone : sysUser.phone }}</div>
                    </div>
                  </div>
                  <div class="info-mail">
                    <div class="info-icon">
                      <a-icon type="team" />
                    </div>
                    <div class="info-content">
                      <div>单位</div>
                      <div>{{ sysUser.departName ? sysUser.departName : '暂无' }}</div>
                    </div>
                  </div>
                  <div class="info-mail">
                    <div class="info-icon">
                      <a-icon type="user" />
                    </div>
                    <div class="info-content">
                      <div>工号</div>
                      <div>{{ sysUser.workNo ? sysUser.workNo : '暂无' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="组织" force-render>
              <div class="org-container">
                <div class="org-header" v-if="topUserList">
                  <div
                    class="header-item"
                    :class="{ 'high-color': nextShow(index) }"
                    v-for="(item, index) in topUserList"
                    :key="item.id"
                    @click="changeOrg(item, index)"
                  >
                    <div class="person-img header-img1" :style="{ backgroundColor: bgColor(item.name) }" v-if="item.name">
                      {{ item.name ? item.name.substring(0, 1) : '' }}
                    </div>
                    <div v-else class="header-img"><img src="@/assets/head.png" alt="" /></div>
                    <div class="header-content">
                      <p>{{ item.name }}</p>
                      <p>{{ item.dep }}</p>
                      <!-- <p>{{ item.post }}</p> -->
                    </div>
                    <div class="header-next" v-show="nextShow(index)">
                      <a-icon type="right" />
                    </div>
                  </div>
                </div>
                <div v-else class="noList">
                  <p>暂无数据</p>
                </div>
                <div class="org-main">
                  <div class="main-title">成员</div>
                  <transition>
                    <div class="main-content" v-if="userList">
                      <div
                        class="m-con-item"
                        v-for="(items, i) in userList"
                        :key="items.id"
                        @click="changeMember(items, i)"
                      >
                        <div
                          class="person-img m-con-img1"
                          :style="{ backgroundColor: bgColor(items.name) }"
                          v-if="items.name"
                        >
                          {{ items.name ? items.name.substring(0, 1) : '' }}
                        </div>
                        <div v-else class="m-con-img"><img src="@/assets/head.png" alt="" /></div>
                        <div class="m-con-content">
                          <p>{{ items.name }}</p>
                          <p>{{ items.dep }}</p>
                          <!-- <p>{{ items.post }}</p> -->
                        </div>
                      </div>
                    </div>
                    <div v-else class="noList">
                      <p>暂无数据</p>
                    </div>
                  </transition>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="个人总结" force-render>
              <a-table 
              :columns="percolumns" 
              :data-source="perdata" :pagination="false"
              class="components-table-demo-nested"
              @expand="handleExpand">
                <a-table
                  slot="expandedRowRender"
                  slot-scope="text"
                  :columns="innerColumns"
                  :data-source="innerData"
                  :pagination="false"
                >
                
                <template slot="projectName" slot-scope="text,record">
                  <a  @click="handleSummaryDetail(text,record)">{{ record.projectName }}</a>
                </template>
                </a-table>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
    </j-modal>
    <a-modal
      title="项目管理平台"
      :visible="detailvisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk" :width="1100"
      @cancel="handleCancel1" :maskClosable="false"
    >
      <a-table :columns="detailcolumns" :data-source="detaildata" :pagination="false">
        <template slot-scope="userTitleInfo">
          <span>
            <a-tag v-for="tag in userTitleInfo" :key="tag" color="blue">{{ tag }}</a-tag>
          </span>
        </template>
      </a-table>
      <template slot="footer">
        <a-button @click="handleCancel1">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
export default {
  name: 'Organization',
  // props: {
  //   userId: {
  //     type: String,
  //     default: 'e9ca23d68d884d4ebb19d07889727dae',
  //     // required: true,
  //   },
  // },
  data() {
    return {
      userId: '',
      title: '',
      visible: false,
      url: '/sys/user/userTree',
      sysUser: {}, //用户信息
      //组织信息
      topUserList: [
        // { id: 1, name: 'Sarah Cheng', title: 'Regional GM - China/SGP', department: 'EDGE_CN' },
        // { id: 2, name: 'Sarah Cheng', title: 'Regional GM - China/SGP', department: 'EDGE_CN' },
        // { id: 3, name: 'Sarah Cheng', title: 'Regional GM - China/SGP', department: 'EDGE_CN' },
      ],
      //成员信息
      userList: [
        // { id: 1, name: 'Sarah Cheng', title: 'Regional GM - China/SGP' },
        // { id: 2, name: 'Sarah Cheng', title: 'Regional GM - China/SGP' },
        // { id: 3, name: 'Sarah Cheng', title: 'Regional GM - China/SGP' },
      ],
      percolumns:[
      { title: '年份', dataIndex: 'year', key: 'year' },
      { title: '参与项目', dataIndex: 'joinProjectCount', key: 'joinProjectCount' },
      { title: '总分配工时(h)', dataIndex: 'sumAssignWorkHours', key: 'sumAssignWorkHours' },
      { title: '总提交工时(h)', dataIndex: 'sumSubmitWorkHours', key: 'sumSubmitWorkHours' },
      { title: '非项目工时(h)', dataIndex: 'noProjectWorkHours', key: 'noProjectWorkHours' },
      { title: '总加班工时(h)', dataIndex: 'sumOverTimeHours', key: 'sumOverTimeHours' },
      { title: '请假/调休(h)', dataIndex: 'leaveHours', key: 'leaveHours' },
      { title: '需求指派', dataIndex: 'taskAppoint', key: 'taskAppoint' },
      { title: '需求处理', dataIndex: 'taskHandle', key: 'taskHandle' },
      { title: 'BUG指派', dataIndex: 'bugAppoint', key: 'bugAppoint' },
      { title: 'BUG处理', dataIndex: 'bugHandle', key: 'bugHandle' },
      ],
      perdata:[],
      innerColumns:[
      { title: '项目名', dataIndex: 'projectName', key: 'projectName',scopedSlots: { customRender: 'projectName' } },
      { title: '项目经理', dataIndex: 'projectManage', key: 'projectManage' },
      { title: '总分配工时(h)', dataIndex: 'sumAssignWorkHours', key: 'sumAssignWorkHours' },
      { title: '总提交工时(h)', dataIndex: 'sumSubmitWorkHours', key: 'sumSubmitWorkHours' },
      { title: '总加班工时(h)', dataIndex: 'sumOverTimeHours', key: 'sumOverTimeHours' },
      { title: '请假/调休(h)', dataIndex: 'leaveHours', key: 'leaveHours' },
      { title: '需求指派', dataIndex: 'taskAppoint', key: 'taskAppoint' },
      { title: '需求处理', dataIndex: 'taskHandle', key: 'taskHandle' },
      { title: 'BUG指派', dataIndex: 'bugAppoint', key: 'bugAppoint' },
      { title: 'BUG处理', dataIndex: 'bugHandle', key: 'bugHandle' },
      ],
      innerData:[],
      perUrl:{
        personalSummary:'/sys/user/personalSummary',
        personalProjectSummary:'/sys/user/personalProjectSummary',
        personalProjectMilepostSummary:'/sys/user/personalProjectMilepostSummary'
      },
      detailvisible:false,
      confirmLoading: false,
      detailcolumns:[
      { title: '里程碑', dataIndex: 'milepostName', key: 'milepostName' },
      { title: '阶段角色', dataIndex: 'userTitleInfo', key: 'userTitleInfo',scopedSlots: { customRender: 'userTitleInfo' } },
      { title: '总分配工时(h)', dataIndex: 'sumAssignWorkHours', key: 'sumAssignWorkHours' },
      { title: '总提交工时(h)', dataIndex: 'sumSubmitWorkHours', key: 'sumSubmitWorkHours' },
      { title: '总加班工时(h)', dataIndex: 'sumOverTimeHours', key: 'sumOverTimeHours' },
      { title: '请假/调休(h)', dataIndex: 'leaveHours', key: 'leaveHours' },
      { title: '需求指派', dataIndex: 'taskAppoint', key: 'taskAppoint' },
      { title: '需求处理', dataIndex: 'taskHandle', key: 'taskHandle' },
      { title: 'BUG指派', dataIndex: 'bugAppoint', key: 'bugAppoint' },
      { title: 'BUG处理', dataIndex: 'bugHandle', key: 'bugHandle' },

      ],
      detaildata:[],
      yearValue:''
    }
  },
  created() {
    this.getUserInfo(1, this.userId)
  },
  computed: {
    nextShow() {
      return (index) => {
        return index === this.topUserList.length - 1
      }
    },
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
  watch: {
    userId: function (val) {
      // console.log(22, val)
      this.getUserInfo(1, this.userId)
    },
  },
  methods: {
    handleOk(e) {
      this.confirmLoading = true;
      setTimeout(() => {
        this.detailvisible = false;
        this.confirmLoading = false;
      }, 500);
    },
    handleCancel1(e) {
      this.detailvisible = false;
    },
    handleSummaryDetail(text,record){
      console.log(record)
      getAction(this.perUrl.personalProjectMilepostSummary,{userId:this.userId,year:this.yearValue,projectId:record.id}).then(res=>{
        if(res.success){
          this.detaildata = res.result
          this.detailvisible = true;
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    handleExpand(expanded, record){
      if(expanded){
        this.yearValue = record.year
        getAction(this.perUrl.personalProjectSummary,{userId:this.userId,year:record.year}).then(res=>{
          if(res.success){
            this.innerData = res.result
          }else{
          this.$message.warning(res.message)
        }
        })
      }
      
    },
    handlePersonalSummary(){
      getAction(this.perUrl.personalSummary,{userId:this.userId}).then(res=>{
        if(res.success){
          this.perdata = res.result
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    async getUserInfo(key, userId) {
      const resInfo = await getAction(this.url, { userId })
      if (key == 1) {
        if (resInfo.success && resInfo.result.length>0) {
          this.sysUser = resInfo.result[0].sysUser
        } else {
          this.sysUser = {}
        }
      } else {
        if (resInfo.success && resInfo.result) {
          this.topUserList = resInfo.result[0].topUserList
          this.userList = resInfo.result[0].userList
        } else {
          console.log(2222, resInfo)
          this.topUserList = null
          this.userList = null
        }
      }
    },
    handleCancel() {
      this.visible = false
    },
    callback(key) {
      if (key == 1) {
        // this.getUserInfo(1, this.userId)
      } else {
        this.getUserInfo(2, this.userId)
      }
    },
    changeOrg(item, index) {
      this.getUserInfo(2, item.id)
    },
    changeMember(item, index) {
      this.getUserInfo(2, item.id)
    },
  },
}
</script>
<style scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 3s;
}

/* 头部 */
.person-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.person-img {
  margin-right: 30px;
  border-radius: 50%;
  text-align: center;
  width: 110px;
  height: 110px;
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  line-height: 100px;
  border: solid #ddd 1px;
}

.person-img img {
  width: 100%;
}

.person-name {
  color: #323130;
  font-weight: 300;
  font-size: 32px;
  cursor: text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.base-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.base-info div {
  flex: 1;
  font-size: 16px;
}
.base-info .base-icon {
  font-size: 15px;
  margin-right: 10px;
}
/* 基本信息 */
.info-item {
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
  padding: 10px 0 10px 0;
  justify-content: space-between;
  flex-wrap: wrap;
}

.info-mail {
  display: flex;
  align-items: center;
  width: 50%;
  /* margin-right: 20px; */
  padding: 10px 0;
}

.info-icon {
  padding: 0 15px;
}

.info-content div:first-child {
  font-size: 12px;
  color: #605e5c;
}

.info-content div:nth-child(2) {
  color: #323130;
}

/* 组织菜单 */
.org-container {
  margin: 10px auto;
}

.noList {
  height: 50px;
  text-align: center;
}
.org-header {
  display: flex;
  flex-direction: column;
  height: auto;
  margin: 0 auto;
  width: 400px;
  align-content: space-between;
}

.header-item {
  border: 1px solid #dddddd;
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 6px 0;
  cursor: pointer;
}

.m-con-item {
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 6px 0;
  cursor: pointer;
  width: 33.33%;
}
.m-con-content {
  width: 70%;
}
.header-item:hover,
.m-con-item:hover,
.info-mail:hover {
  background: #edebe9;
}
.high-color {
  border: 1px solid #0f6cbd;
}
.header-img {
  width: 20%;
}
.header-img1 {
  width: 60px;
  height: 60px;
  font-size: 20px;
  line-height: 55px;
  margin-right: 15px;
}
.m-con-img {
  width: 27%;
}
.m-con-img1 {
  width: 40px;
  height: 40px;
  font-size: 14px;
  line-height: 35px;
  margin-right: 15px;
}
.header-img img,
.m-con-img img {
  width: 100%;
  padding: 10px 15px;
}

.header-content {
  width: 70%;
}

.header-content p,
.m-con-item p {
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
  color: #605e5c;
}

.header-content p:first-child,
.m-con-item p:first-child {
  color: #000;
  font-size: 16px;
  color: #323130;
}

.header-content p:not(:first-child),
.m-con-item p:not(:first-child) {
  font-size: 12px;
}

/* .header-content p:last-child {
  font-size: 16px;
} */

.header-next {
  padding-left: 3%;
  width: 10%;
  color: #47a6e6;
}

.org-main {
  width: 800px;
  margin: 6px auto 10px auto;
  background-color: #faf9f8;
  border: 1px solid #edebe9;
}
.main-title {
  margin-top: 10px;
  margin-left: 3%;
}
.main-content {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px 2%;
}
</style>