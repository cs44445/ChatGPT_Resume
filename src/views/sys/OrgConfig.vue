<template>
  <div class="index-container-ty">
    <div class="index-tabs">
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">组织管理</span></template>
        </a-tab-pane>

        <a-tab-pane key="2" tab="单位管理" force-render>
          <team-list/>
        </a-tab-pane>

        <a-tab-pane key="3" tab="用户管理">
          <user-list/>
        </a-tab-pane>

        <a-tab-pane key="5" tab="离职管理">
          <leave-list/>
        </a-tab-pane>

        <a-tab-pane key="4" tab="职级管理">
          <sys-position-list/>
        </a-tab-pane>

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

import TeamList from '@views/sys/TeamList'
import UserList from '@views/system/UserList'
import SysPositionList from '@views/system/SysPositionList'
import LeaveList from '@views/system/LeaveList'
export default {
  name: 'Home',
  components: {
      TeamList,
      UserList,
      SysPositionList,
      LeaveList,
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
