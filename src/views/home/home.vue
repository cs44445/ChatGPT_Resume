<template>
  <div class="index-container-ty">
    <div class="index-tab">
      <a-tabs default-active-key="2" :active-key="tabKey" @change="callback" class="index-tab" :tabBarGutter="5">
        <a-tab-pane key="1" disabled>
          <template #tab><span class="first-tab">快速问答</span></template>
        </a-tab-pane>
        
      </a-tabs>


    </div>
    <!-- <a-spin :spinning="loading">
      111
    </a-spin> -->

  </div>
</template>

<script>

import { USER_AUTH } from '@/store/mutation-types'

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      loading: false,
      myWorkhours: false,
      roleContent: "",
      url: {
      },
      tabKey:'2'
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    this.checkLabel()
    // console.log('this.$route.query.tabKey ',this.$route.query.tabKey )
    // if(this.$route.query.tabKey == 3){
    //   this.tabKey = 3
    // }

    if(parseInt(this.$route.query.tabKey) === 3 ){
      this.getTask()
    }
  },
  watch:{
        $route: {
            handler(newVal,oldVal){
                // console.log(newVal,oldVal)
                //判断newVal有没有值监听路由变化
                console.log('this.$route.query.tabKey ',this.$route.query.tabKey )
                if(parseInt(this.$route.query.tabKey) === 3 ){
                  this.getTask()
                }
                if(parseInt(this.$route.query.myTab) === 1){
                  this.getWh()
                }
            },
            deep: true
        }
  },
  methods: {
    getTask(){
      this.tabKey = '3'
      this.$nextTick(()=>{
        this.$refs.tasklist.handleAdd()
      })
    },
    getWh(){
      this.tabKey = '4'
    },
    callback(key) {
      // this.$route.query = {}
      console.log(key,this.$router);
      this.tabKey = key
    },
    checkLabel() {
      let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]")
      for (let auth of authList) {
        if (auth.action == 'myWorkhours:view') {
          //我的工时
          this.myWorkhours = true;
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>

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
