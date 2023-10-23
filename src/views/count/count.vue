<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :sm="24">
            <a-form-item style="display: flex">
              <my-date v-model="submitTime_begin" placeholder="请选择开始日期" /> ~
              <my-date v-model="submitTime_end" placeholder="请选择结束日期" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-tabs default-active-key="1" :active-key="activeKey" @tabClick="selectTab">
      <a-tab-pane tab="项目利用内资情况统计" key="1" forceRender>
        <project-resource-view v-bind:submitTime_begin="submitTime_begin" v-bind:submitTime_end="submitTime_end" />
      </a-tab-pane>
      <!-- <a-tab-pane tab="楼层测试" key="1">
        <floor-container></floor-container>
      </a-tab-pane> -->
    </a-tabs>
  </a-card>
</template>

<script>
import ProjectResourceView from '@views/count/countmod/ProjectResourceView'
import FloorContainer from '@views/count/countmod/FloorContainer'
export default {
  name: 'count',
  components: {
    ProjectResourceView,
    FloorContainer,
  },
  data() {
    return {
      activeKey: 1,
      submitTime_begin: '2022-02',
      submitTime_end: '2022-04',
    }
  },
  mounted() {
    this.activeKey = '1'
  },
  methods: {
    selectTab(e) {
      this.activeKey = e
    },
  },
}
</script>