<template>
  <div class="index-container-ty">
    <div class="index-tabs">
      <a-tabs default-active-key="2" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">系统设置</span></template>
        </a-tab-pane>

        <a-tab-pane key="2" tab="菜单设置" force-render>
          <permission-list/>
        </a-tab-pane>

        <a-tab-pane key="3" tab="角色设置">
          <role-list/>
        </a-tab-pane>

        <a-tab-pane key="4" tab="数据字典">
          <dict-list/>
        </a-tab-pane>

        <a-tab-pane key="5" tab="节假日设置">
          <bus-holiday-list/>
        </a-tab-pane>

        <a-tab-pane key="6" tab="标准人力成本">
            <bus-manpower-cost/>
        </a-tab-pane>

        <a-tab-pane key="7" tab="加班工资模版">
            <bus-over-time-template-list/>
        </a-tab-pane>

        <a-tab-pane key="8" tab="计划人力成本角色">
            <bus-plan-labor-cost-role-list/>
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

import BusManpowerCost from '@views/bus/BusManpowerCost'
import BusOverTimeTemplateList from '@views/bus/BusOverTimeTemplateList'
import BusPlanLaborCostRoleList from '@views/bus/BusPlanLaborCostRoleList'
import BusHolidayList from '@views/bus/BusHolidayList'
import DictList from '@views/system/DictList'
import PermissionList from '@views/system/PermissionList'
import RoleList from '@views/system/RoleList'

export default {
  name: 'Home',
  components: {
      BusManpowerCost,
      BusOverTimeTemplateList,
      BusPlanLaborCostRoleList,
      BusHolidayList,
      DictList,
      PermissionList,
      RoleList
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
