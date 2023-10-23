<template>
  <a-tooltip placement="left">
    <template slot="title">
      待办任务数量：{{ taskCount }}
    </template>
    <span class="header-notice" @click="goMoreTodo">
      <a-badge :count="taskCount">

        <img src="@/assets/appr.png" alt="" style="height: 20px;" />
      </a-badge>
    </span>
  </a-tooltip>
</template>

<script>
import Vue from 'vue'
import { postAction } from '@/api/manage'

export default {
  name: "HeaderTodoList",
  data() { 
    return {
      url: {
        countTaskList: "/api/flowProcAppr/countTaskList",
      },
      taskCount: 0,
      stopTimer: false,
    }
  },
  created() {
    this.$bus.$on('openDemandList', () => {
      //绑定任务数量变更事件
      this.loadData()
    })
  },
  mounted() {
    this.loadData();
    this.timerFun();
  },
  beforeDestroy() {
    this.$bus.$off('openDemandList')
  },
  methods: {
    timerFun() {
      this.stopTimer = false;
      let myTimer = setInterval(() => {
        // 停止定时器
        if (this.stopTimer == true) {
          clearInterval(myTimer);
          return;
        }
        this.loadData()
      }, 6000 * 10)
    },
    loadData() {
      try {
        // 获取任务数量
        postAction(this.url.countTaskList, {}).then((res) => {
          if (res.success) {
            this.taskCount = res.result.count;
          }
        }).catch(error => {
          console.log("系统任务数量获取异常", error);//这行打印permissionName is undefined
          this.stopTimer = true;
          console.log("清理timer");
        });
      } catch (err) {
        this.stopTimer = true;
        console.log("获取任务数量通知异常", err);
      }
    },
    // 更多待办列表
    goMoreTodo() {
      this.$router.push({ path: '/bus/BusApplyDoApprList' })
    },
  }
}
</script>

<style lang="css">
.header-notice-wrapper {
  /* top: 50px !important; */
}
</style>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>