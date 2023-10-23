<template>
  <div class="index-container-ty">
    <div class="index-tabs">
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">日志管理</span></template>
        </a-tab-pane>

        <a-tab-pane key="2" tab="登录日志" force-render>
          <log-list/>
        </a-tab-pane>

        <a-tab-pane key="3" tab="操作日志">
          <log-handle-list/>
        </a-tab-pane>

        <a-tab-pane key="4" tab="系统异常日志">
          <sys-debug-log-list/>
        </a-tab-pane>

        <!-- <a-tab-pane key="5" tab="数据导入/导出">
          <sys-import-export-log-list/>
        </a-tab-pane> -->
      </a-tabs>
        <!-- <div class="image-group-share">
        <div class="image-group">
        imgs
        </div>
        <button class="share-btn">分享</button>
      </div> -->



    </div>
    <!-- <a-spin :spinning="loading">
      111
    </a-spin> -->

  </div>
</template>

<script>

import LogList from '@views/system/LogList'
import LogHandleList from '@views/system/LogHandleList'
import SysDebugLogList from '@views/system/SysDebugLogList'
import SysImportExportLogList from '@views/system/SysImportExportLogList'

export default {
  name: 'Home',
  components: {
    LogList,
    LogHandleList,
    SysDebugLogList,
    SysImportExportLogList
  },
  data() {
    return {
      loading: false,
      url: {
      },
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    callback(key) {
      console.log(key);
    },
  },
}
</script>

<style lang="less" scoped>

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
</style>
