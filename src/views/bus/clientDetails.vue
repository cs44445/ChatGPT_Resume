<template>
  <div class="index-container-ty">
    <div class="index-tab">
      <!-- default-active-key="2"  :active-key="activeKey"  -->
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">{{projectDetails.customName}}</span></template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="详情" force-render>
          <bus-client-detail :projectId="projectId" ref="clientDetail" :data="projectDetails"></bus-client-detail>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="`联系人(${dataSource ? dataSource.length : 0})`" force-render>
          <!-- <bus-project-task-detail-list-form :projectId="projectId"/> -->
          <person-list :projectId="projectId" @ok="updateList" :data="dataSource"></person-list>
        </a-tab-pane>
        <a-tab-pane key="5" :tab="`价格表(${priceSource ? priceSource.length : 0})`" force-render>
          <!-- <project-management :projectId="projectId"/> -->
          <!-- <mile-stone :projectId="projectId"/> -->
          <price-list :projectId="projectId" @ok="updateList" :data="priceSource"></price-list>
        </a-tab-pane>
        <a-tab-pane key="6" :tab="`合同文件(${fileListDto ? fileListDto.length : 0})`" force-render>
          <client-documents-list @ok="updateList" :projectId="projectId"></client-documents-list>
        </a-tab-pane>
        <a-tab-pane key="7" :tab="`银行信息(${bankData ? bankData.length : 0})`" force-render>
          <bank-list :projectId="projectId" @ok="updateList" :data="bankData"></bank-list>
        </a-tab-pane>
      </a-tabs>
    </div>

  </div>
</template>

<script>
import MileStone from '@views/bus/modules/ProjectDetails/MileStone'
import ManHour from '@views/bus/modules/ProjectDetails/ManHour'
import busClientDetail from './modules/clientDetails/busClientDetail'
import bankList from './modules/clientDetails/bankList'
import personList from './modules/clientDetails/personList'
import priceList from './modules/clientDetails/priceList'
import { getAction } from '@/api/manage'
import clientDocumentsList from './modules/clientDetails/clientDocumentsList'
import BusApplyTimesheetList from './BusApplyTimesheetList.vue'

export default {
  name: 'clientDetails',
  components: {
    MileStone,
    ManHour,

    busClientDetail,
    personList,
    bankList,
    priceList,
    clientDocumentsList
  },
  data() {
    return {
      loading: false,
      projectId:'',
      projectName:"",
      url: {
        getCustomById: '/bus/busCustom/queryById',
      },
      projectDetails:{},
      //控制页签展示权限
      bankData:[],
      dataSource:[],
      priceSource:[],
      fileListDto:[],
      activeKey:2,
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.getParam();
  },
  watch: {
      //  $route: {
      //       handler(newVal,oldVal){
      //           console.log('newVal.query',newVal.query)
      //           if(oldVal.path !='/bus/clientDetails'){
      //             let query =  JSON.parse(JSON.stringify(newVal.query))
      //             if(query.projectId){
      //               this.projectId = query.projectId;
      //               this.getParam();
      //             }
      //           }

      //       },
      //       deep: true
      //   }
      $route: {
          handler(newVal,oldVal){
              if(newVal.path =='/bus/clientDetails'){
                let query =  JSON.parse(JSON.stringify(newVal.query))
                if(query.projectId){
                  this.projectId = query.projectId;
                  this.getParam();
                }
              }

          },
          deep: true
      },
      
      // projectId: function () {
      //   this.activeKey = 2;
      //   // this.getParam();
      //   }
  },
  mounted() {
    this.getParam();
  },
  methods: {
    getParam() {
      let query =  JSON.parse(JSON.stringify(this.$route.query))
      this.projectId = query.projectId;
      getAction(this.url.getCustomById, { id: this.projectId }).then((res) => {
        if (res.success) {
          this.projectDetails = res.result.records[0]
          this.bankData = this.projectDetails.bankList
          this.dataSource = this.projectDetails.personList
          this.priceSource = this.projectDetails.priceList
          this.fileListDto = this.projectDetails.fileListDto
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    callback(key) {
      if(key=="2"){
      this.$refs.clientDetail.getDetails()
      }
      // console.log(key);
    },
    updateList(){
      this.getParam();
    }
  }

}
</script>

<style lang="less" scoped>
@import '~@assets/css/common.css';
@import '~@assets/less/common.less';

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
