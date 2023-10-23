<template>
  <div class="index-container-ty">
    <div class="index-tabs">
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">系统监控</span></template>
        </a-tab-pane>

        <a-tab-pane key="2" tab="Redis监控" force-render>
          <redis-info/>
        </a-tab-pane>

        <a-tab-pane key="3" tab="Tomcat信息">
          <tomcat-info/>
        </a-tab-pane>

        <a-tab-pane key="4" tab="服务器信息">
          <system-info/>
        </a-tab-pane>

        <a-tab-pane key="5" tab="JVM信息">
          <jvm-info/>
        </a-tab-pane>

        <a-tab-pane key="6" tab="请求追踪">
            <http-trace/>
        </a-tab-pane>

        <a-tab-pane key="7" tab="磁盘监控">
            <disk-monitoring/>
        </a-tab-pane>

        <!-- <a-tab-pane key="8" tab="数据日志">
            <data-log-list/>
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

import RedisInfo from '@views/modules/monitor/RedisInfo'
import TomcatInfo from '@views/modules/monitor/TomcatInfo'
import SystemInfo from '@views/modules/monitor/SystemInfo'
import JvmInfo from '@views/modules/monitor/JvmInfo'
import HttpTrace from '@views/modules/monitor/HttpTrace'
import DiskMonitoring from '@views/modules/monitor/DiskMonitoring'
import DataLogList from '@views/system/DataLogList'

export default {
  name: 'Home',
  components: {
      RedisInfo,
      TomcatInfo,
      SystemInfo,
      JvmInfo,
      HttpTrace,
      DiskMonitoring,
      DataLogList,
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
