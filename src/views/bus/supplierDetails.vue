<template>
  <div class="index-container-ty">
    <div class="index-tab">
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">{{details.name}}</span></template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="详情" force-render>
          <bus-supplier-detail :projectId="projectId" ref="supplierDetail" :data="details"></bus-supplier-detail>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="`服务类型(${serviceData ? serviceData.length : 0})`" force-render>
          <service-list :projectId="projectId" @ok="updateList" :data="serviceData"></service-list>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="`银行信息(${bankData ? bankData.length : 0})`" force-render>
          <bank-list :projectId="projectId" @ok="updateList" :data="bankData"></bank-list>
        </a-tab-pane>
        <a-tab-pane key="5" :tab="`联系人(${personData ? personData.length : 0})`" force-render>
          <!-- <bus-project-task-detail-list-form :projectId="projectId"/> -->
          <person-list :projectId="projectId" @ok="updateList" :data="personData"></person-list>
        </a-tab-pane>
        <a-tab-pane key="6" :tab="`工作者(${workerData ? workerData.length : 0})`" force-render>
          <worker-list :projectId="projectId" @ok="updateList" :data="workerData"></worker-list>
        </a-tab-pane>
        <a-tab-pane key="7" :tab="`价格表(${priceList ? priceList.length : 0})`" force-render>
          <price-list :projectId="projectId" @ok="updateList" :data="priceSource"></price-list>
        </a-tab-pane>
        <a-tab-pane key="8" :tab="`合同文件(${fileListDto ? fileListDto.length : 0})`" force-render v-if="fileShow">
          <supplier-documents-list :projectId="projectId" @ok="updateList"></supplier-documents-list>
        </a-tab-pane>
      </a-tabs>
    </div>

  </div>
</template>

<script>
import MileStone from '@views/bus/modules/ProjectDetails/MileStone'
import ManHour from '@views/bus/modules/ProjectDetails/ManHour'
import busSupplierDetail from './modules/supplierDetails/busSupplierDetail'
import serviceList from './modules/supplierDetails/serviceList'
import bankList from './modules/supplierDetails/bankList'
import personList from './modules/supplierDetails/personList'
import workerList from './modules/supplierDetails/workerList'
import priceList from './modules/supplierDetails/priceList'
import supplierDocumentsList from './modules/supplierDetails/supplierDocumentsList'
import { getAction } from '@/api/manage'
import BusApplyTimesheetList from './BusApplyTimesheetList.vue'

export default {
  name: 'supplierDetails',
  components: {
    MileStone,
    ManHour,

    busSupplierDetail,
    serviceList,
    personList,
    bankList,
    workerList,
    priceList,
    supplierDocumentsList
  },
  data() {
    return {
      loading: false,
      projectId:'',
      projectName:"",
      url: {
        getCompanyById: '/bus/busCompany/queryById',
      },
      details:{},
      //控制页签展示权限
      bankData:[],
      dataSource:[],
      priceSource:[],
      priceList:[],
      fileListDto:[],
      fileShow:true
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.getParam();
  },
  watch: {
       $route: {
            handler(newVal,oldVal){
                if(newVal.path =='/bus/supplierDetails'){
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
      //   console.log('id变了000', this.projectId)
      //       this.getParam();
      //   }
  },
  mounted() {
    this.$nextTick(() => {
      this.getParam();
    })
  },
  methods: {
    getParam() {
      let query =  JSON.parse(JSON.stringify(this.$route.query))
      this.projectId = query.projectId;
      getAction(this.url.getCompanyById, { id: this.projectId }).then((res) => {
        if (res.success) {
          this.details = res.result
          this.serviceData = this.details.serviceList
          this.bankData = this.details.bankList
          this.personData = this.details.personList
          this.workerData = this.details.workUserList
          this.priceList = this.details.priceList
          this.fileListDto = this.details.fileListDto
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    callback(key) {
      if(key=="2"){
        this.$refs.supplierDetail.getDetails()
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
