<template>
    <div class="index-tab">
      <a-tabs default-active-key="2" :active-key="tabKey" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">计费报告</span></template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="计费报告" force-render>            
           <BusBillingReportList></BusBillingReportList>
        </a-tab-pane>
      </a-tabs>
    </div>
  </template>
  
  <script>
  
    import '@/assets/less/TableExpand.less'
    import { mixinDevice } from '@/utils/mixin'
    import BusBillingReportList from './modules/BusBillingReportList.vue'
    export default {
      name: 'billingReport',
      mixins:[mixinDevice],
      components: {
        BusBillingReportList
      },
      data () {
        return {
          description: '团队表管理页面',
          tabKey:'2'
        }
      },
      methods: {
        callback(key) {
          this.tabKey = key
        },
      }
    }
  </script>
  <style scoped  lang="less">
    @import '~@assets/less/common.less';
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
  