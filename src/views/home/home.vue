<template>
  <div class="index-container-ty">
    <div class="index-tab">
      <div class="title">简历评分系统</div>
      <resume-list ref="ResumeList"></resume-list>
      <!-- <a-tabs default-active-key="2" :active-key="tabKey" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">简历评分系统</span></template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="我的项目" force-render v-if="myProject">
          <my-project/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="我的任务" v-if="myTask">
          <bus-project-task-list ref="tasklist"/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="我的工时" v-if="myWorkhours" @click="getWh">
          <bus-working-hours/>
        </a-tab-pane>
        <a-tab-pane key="5" tab="我的客户" v-if="myClient">
          <bus-client-list ref="BusClientList" home="home"></bus-client-list>
        </a-tab-pane>
        <a-tab-pane key="6" tab="客户联系人" v-if="clientContacts">
          <client-person-list ref="BusClientList"></client-person-list>
        </a-tab-pane>
        <a-tab-pane key="7" tab="我的信息" v-if="vendorInfo">
          <bus-vendor-info/>
        </a-tab-pane>
        <a-tab-pane key="8" tab="所有供应商" v-if="allSupplier">
          <bus-supplier-list ref="BusSupplierList" home="home"></bus-supplier-list>
        </a-tab-pane>
        <a-tab-pane key="9" tab="供应商联系人" v-if="supplierContacts" force-render>
          <all-person-list  v-if="allSupplier"></all-person-list>
        </a-tab-pane>
        <a-tab-pane key="10" tab="工作者签入" v-if="workerList">
          <supplier-worker></supplier-worker>
        </a-tab-pane>
        <a-tab-pane key="11" tab="客户采购订单" v-if="clientContacts">
          <bus-client-po-list></bus-client-po-list>
        </a-tab-pane>
        <a-tab-pane key="12" tab="供应商采购订单" v-if="vendorPo">
          <bus-company-po-list></bus-company-po-list>
        </a-tab-pane>
        <a-tab-pane key="5" tab="更多...">
            更多
        </a-tab-pane>
        <div class="image-group-share">
        <div class="image-group">
        imgs
        </div>
        <button class="share-btn">分享</button>
      </div>
      </a-tabs> -->


    </div>
    <!-- <a-spin :spinning="loading">
      111
    </a-spin> -->

  </div>
</template>

<script>

import busWorkingHours from '@/views/bus/BusWorkingHours'
import BusVendorInfo from '@/views/bus/BusVendorInfo'
import MyProject from './components/MyProject.vue'
import busProjectTaskList from '@/views/bus/BusProjectTaskList'
import BusClientList from '@/views/bus/modules/BusClientList'
import BusSupplierList from '@/views/bus/modules/BusSupplierList'
import SupplierWorker from '@/views/bus/modules/SupplierWorker'
import BusClientPoList from '@/views/bus/BusClientPoList'
import BusCompanyPoList from '@/views/bus/BusCompanyPoList'
import { USER_AUTH } from '@/store/mutation-types'
import clientPersonList from '@/views/bus/modules/clientDetails/clientPersonList'
import allPersonList from '@/views/bus/modules/supplierDetails/allPersonList'
import ResumeList from '../bus/ResumeList.vue'

export default {
  name: 'Home',
  components: {
    busWorkingHours,
    MyProject,
    busProjectTaskList,
    BusClientList,
    BusSupplierList,
    SupplierWorker,
    BusCompanyPoList,
    BusVendorInfo,
    clientPersonList,
    allPersonList,
    BusClientPoList,
    ResumeList
  },
  data() {
    return {
      loading: false,
      myWorkhours: false,
      myClient:false,
      allSupplier:false,
      workerList:false,
      myProject:false,
      myTask:false,
      vendorPo:false,
      vendorInfo:false,
      supplierContacts:false,
      clientContacts:false,
      url: {
      },
      tabKey:'2'
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    this.checkLabel()
  },
  watch:{
    $route: {
      handler(newVal,oldVal){
        console.log(newVal,oldVal)
        //判断newVal有没有值监听路由变化
        if(parseInt(this.$route.query.tabKey) === 3 ){
          this.getTask()
        }
        if(parseInt(this.$route.query.myTab) === 1){
          this.getWh()
        }
        if(parseInt(this.$route.query.tabKey) === 5 ){
          this.getCus()
        }
        if(parseInt(this.$route.query.tabKey) === 6){
          this.getSup()
        }
      },
      deep: true
    }
  },
  methods: {
    getTask(){
      this.tabKey = '3'
      this.$nextTick(()=>{
        this.$refs.tasklist.handleAdd()
      })
    },
    getWh(){
      this.tabKey = '4'
    },
    getCus(){
      this.tabKey = '5'
      this.$nextTick(()=>{
        this.$refs.BusClientList.handleAdd()
      })

    },
    getSup(){
      this.tabKey = '6'
      this.$nextTick(()=>{
        this.$refs.BusSupplierList.handleAdd()
      })

    },
    callback(key) {
      // this.$route.query = {}
      // console.log(key,this.$router);
      this.tabKey = key
    },
    checkLabel() {
      let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
      for (let auth of authList) {
        if (auth.action == 'myWorkhours:view') {
          //我的工时
          this.myWorkhours = true;
        }
        if(auth.action == 'myClient:view') {
          //我的客户
          this.myClient = true;
        }
        if(auth.action == 'allSupplier:view') {
          //所有供应商
          this.allSupplier = true;
        }
        if(auth.action == 'worker:list') {
          //工作者签入
          this.workerList = true;
        }
        if(auth.action == 'myProject:list') {
          //我的项目
          this.myProject = true;
        }
        if(auth.action == 'myTask:list') {
          //我的任务
          this.myTask = true;
        }
        if(auth.action == 'vendorPo:list') {
          //采购订单
          this.vendorPo = true;
        }
        if(auth.action == 'vendorInfo:list') {
          //我的信息
          this.vendorInfo = true;
        }
        if(auth.action == 'supplierContacts:list') {
          //供应商联系人
          this.supplierContacts = true;
        }
        if(auth.action == 'clientContacts:list') {
          //供应商联系人
          this.clientContacts = true;
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.title{
  display: block;
  font-size: 17px;
  font-weight: bold;
  color: #000;
  padding: 12px 16px;
  margin: 32px 0 0 0;
  border-bottom: 1px solid #BBBBBB;
}
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
</style>
