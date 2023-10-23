<template>
      <div class="index-container-ty">
    <div class="index-tab">
      <a-tabs default-active-key="2"  class="index-tab"  @change="callback"  :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">供应商管理</span></template>
        </a-tab-pane>
        <a-tab-pane key="2" tab="供应商" force-render >
          <bus-supplier-list></bus-supplier-list>
        </a-tab-pane>
        <a-tab-pane key="3" tab="联系人" force-render >
          <bus-person-list></bus-person-list>
        </a-tab-pane>
        <a-tab-pane key="4" tab="工作者" force-render >
            <supplier-worker></supplier-worker>
        </a-tab-pane>
      </a-tabs>
    </div>

  </div>
</template>
<script>
import BusSupplierList from './modules/BusSupplierList'
import BusPersonList from './modules/BusPersonList'
import SupplierWorker from './modules/SupplierWorker'

export default {
  name: 'Supplier', 
  components: {
    BusSupplierList,
    BusPersonList,
    SupplierWorker
  },
  data() {
    return {};
  },
  methods: {
    callback(key) {
      console.log(key);
    },
  },
}
</script>
<style lang="less"  scoped>
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
