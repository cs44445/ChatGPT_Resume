<template>
      <a-layout-sider
        :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
        width="270px"
        :collapsible="collapsible"
        v-model="collapsed" style="position: relative;"
        :trigger="null">
          <div >
            <div  :class="theme" class="iconcss" :style="[{left:collapsed? 75+'px' : 250+'px'}]" @click="toggle">
              <a-icon
                class="trigger" style="color: #fff;line-height: 40px;padding: 0;font-size: 16px;"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                />
            </div>
            <logo :collapsed="collapsed"/>
            <div style="padding: 24px;text-align: center;">
                <a-popover placement="rightTop"  trigger="click" class="test">
                  <template slot="content">
                    <span  style="font-size: 18px;font-weight: 500;color: #2F3337;margin-top: 4px;">
                      快捷入口
                    </span>
                    <div @click="handleAddPro()" class="itemCss">
<!--                      <img class="imgcss" alt="example" style="margin-right: 10px;" :src="require('@assets/xm.png')" /><span class="">项目</span>-->
                    </div>
                    <div @click="handleAddTask()"  class="itemCss">
<!--                      <img class="imgcss" alt="example" style="margin-right: 10px;" :src="require('@assets/rw.png')" /><span>任务</span>-->
                    </div>
                    <!-- <div @click="handleAdd('成员')" class="itemCss">
                      <img class="imgcss" alt="example" style="margin-right: 10px;" :src="require('@assets/cy.png')" /><span>成员</span>
                    </div> -->
                    <div @click="handleAddWH()" class="itemCss">
<!--                      <img class="imgcss" alt="example" style="margin-right: 10px;" :src="require('@assets/gs.png')" /><span>工时</span>-->
                    </div>
                    <!-- <div @click="handleAdd('审批')" class="itemCss" style="margin: 15px 0 4px 5px;">
                      <img class="imgcss" alt="example" style="margin-right: 10px;" :src="require('@assets/sp.png')" /><span>审批</span>
                    </div> -->
                  </template>
                  <a-button
                      style="width: 100%;background-color: #CC148A;border: none;height: 40px;color: #fff;font-size: 16px;display: flex;justify-content: space-between;align-items: center;"
                      v-if="!collapsed"
                      v-has="'project:fastAdd'">
                    <span><a-icon type="plus" style="margin-right: 10px;"/>快捷入口</span><a-icon type="right" />
                  </a-button>
                  <a-button icon="plus"
                    style="width: 48px;background-color: #CC148A;border: none;height: 40px;color: #fff;font-size: 16px;"
                    v-else>
                  </a-button>
                </a-popover>
            </div>
            <s-menu
              :collapsed="collapsed"
              :menu="menus"
              :theme="theme"
              @select="onSelect"
              @updateMenuTitle="onUpdateMenuTitle"
              :mode="mode"
              style="margin-left: -10px;font-size: 14px;"
              >
            </s-menu>
            <a-divider/>
            <div>
              <span class="allProCss" style="color: #fff;display: flex;justify-content: space-between;padding: 0 25px;" v-if="!collapsed">
                <span>使用记录</span>
                <!-- <a-icon type="plus" @click="handleAddPro()" v-has="'project:fastAdd'"/> -->
              </span>
              <div style="margin-top: 15px;overflow-y: auto;" :id="!collapsed?'prodiv':'prodiv1'">
                  <div tabIndex="1" v-for="item in projectNameList"
                  :key="item.id" @click="handleRouter(item)"
                  class="itemprocss" :style="[{display: flex},{alignItems: center},{paddingLeft: collapsed ? 23+'px' : 9+'px'}]">
                    <a-badge  :color="item.color" v-if="!collapsed" />
                    <span class="pronamecss"  v-if="!collapsed">{{ item.projectNameView }}</span>
                    <span class="pronamecss" v-if="collapsed">{{ item.projectName.length >2 ? item.projectName.slice(0, 2) : item.projectName }}</span>
                    <!-- <span>X</span> -->
                  </div>
              </div>

            </div>
            <div :style="[{position: 'fixed'},{bottom: 0},{zIndex:999},{background:'#001529'}]">
                <div style="color: #8D9399;display: flex;justify-content: space-between;align-items: center;padding: 22px;width: 270px;"  v-if="!collapsed">
                  <!-- <header-task-appr-list class="action"/> -->
                  <header-notice class="action"/>
                  <header-todo-list class="action"/>
                </div>
                <div style="padding: 22px;text-align: center;"  v-if="collapsed">
                  <div style="padding: 10px 0;"><header-task-appr-list class="action"/></div>
                  <div style="padding: 10px 0;"><header-notice class="action"/></div>
                  <div style="padding: 10px 0;"><header-todo-list class="action"/></div>
                </div>
                <div class="userCss"  :style="[{ textAlign: collapsed ? 'center' :''}]">
                  <a-popover placement="topLeft"  trigger="click">
                    <template slot="content">
                      <div style="display: flex;align-items: center;">
                        <img src="~@/assets/head.png" style="width: 40px;height: 40px;margin-right: 6px;border-radius: 50%;"/>
                        <span  v-if="!collapsed" style="font-size: 18px;font-weight: 700;color: #2F3133;">{{ nickname() }}</span>
                      </div>
                      <div class="userMenuCss">
                        <router-link :to="{ name: 'account-settings-base' }">
                          <img alt="example" style="margin-right: 10px;" :src="require('@assets/grxx.png')"/>
                          <span style="color: #2F3237;">账户设置</span>
                        </router-link>
                      </div>
                      <div class="userMenuCss" v-has="'systemconfig:show'">
                        <router-link :to="{ name: 'system-config' }">
                          <img alt="example" style="margin-right: 10px;" :src="require('@assets/xtsz.png')"/>
                          <span style="color: #2F3237;">系统设置</span>
                        </router-link>
                      </div>
                      <div @click="updatePassword()" class="userMenuCss">
                        <img alt="example" style="margin-right: 10px;" :src="require('@assets/cy.png')" />密码修改
                      </div>
                      <div class="userMenuCss" v-has="'logconfig:show'">
                        <router-link :to="{ name: 'log-manege' }">
                          <img alt="example" style="margin-right: 10px;" :src="require('@assets/zzgl.png')"/>
                          <span style="color: #2F3237;">日志管理</span>
                        </router-link>
                      </div>
                      <div class="userMenuCss" v-has="'monitorconfig:show'">
                        <router-link :to="{ name: 'monitor-config' }">
                          <img alt="example" style="margin-right: 10px;" :src="require('@assets/zzgl.png')"/>
                          <span style="color: #2F3237;">监控管理</span>
                        </router-link>
                      </div>
                      <div class="userMenuCss" v-has="'orgconfig:show'">
                        <router-link :to="{ name: 'org-config' }">
                          <img alt="example" style="margin-right: 10px;" :src="require('@assets/zzgl.png')"/>
                          <span style="color: #2F3237;" >组织管理</span>
                        </router-link>
                      </div>
                      <div class="userMenuCss" v-has="'flowableconfig:show'">
                        <router-link :to="{ name: 'flowable-config' }">
                          <img alt="example" style="margin-right: 10px;" :src="require('@assets/zzgl.png')"/>
                          <span style="color: #2F3237;">流程设置</span>
                        </router-link>
                      </div>




                      <div @click="handleLogout()" class="userMenuCss loginOut" v-if="isDesktop()" style="">
                        <img  alt="example" style="margin-right: 10px;" :src="require('@assets/dcxt.png')"/>登出系统
                      </div>
                    </template>
                    <img src="~@/assets/head.png" style="width: 48px;height: 48px;margin-right: 10px;"/>
                    <span  v-if="!collapsed">{{ nickname() }}</span>
                  </a-popover>
                </div>
            </div>
          </div>

        <user-password ref="userPassword"></user-password>
        <!-- <bus-project-modal ref="modalForm" @ok="modalFormOk" :typeFlag="typeFlag" @loadProjectData="loadData"></bus-project-modal> -->

      </a-layout-sider>
</template>

<script>
  import ALayoutSider from 'ant-design-vue/es/layout/Sider'
  import Logo from '../tools/Logo'
  import SMenu from './index'
  import { mixin, mixinDevice } from '@/utils/mixin.js'
  import HeaderNotice from '../tools/HeaderNotice.vue'
  import { getAction } from '@/api/manage'
  import { mapActions, mapGetters,mapState } from 'vuex'
  import UserPassword from '../tools/UserPassword'
  import HeaderTodoList from '../tools/HeaderTodoList'
  // import BusProjectModal from '../../views/bus/modules/BusProjectModal'
  // import HeaderTaskApprList from '../tools/HeaderTaskApprList'


  export default {
    name: "SideMenu",
    components: { ALayoutSider, Logo, SMenu,HeaderNotice ,UserPassword,HeaderTodoList},
    mixins: [mixin, mixinDevice],
    props: {
      mode: {
        type: String,
        required: false,
        default: 'inline'
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsible: {
        type: Boolean,
        required: false,
        default: false
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      menus: {
        type: Array,
        required: true
      }
    },
    data(){
      return{
        projectNameList:[],
        url: {
          list: "/bus/busProject/list",
        },
        typeFlag:false
      }
    },
    computed:{

    },
    mounted(){
      // this.loadData()
      // console.log(screen.height,'screen.height-----5----screen.height',screen.width)
      // 1440*900  125% 高度720   宽度1152  4.2%;
      // 1440*900  100% 高度900  宽度  1440   3.35%;
      // 1920*1080  100%  高度1080  宽度1920  2.5%;
      // 1920*1080  125%  高度864  宽度1536  3.15%;


    },
    methods: {
      ...mapGetters(["nickname", "avatar","userInfo"]),
      updatePassword(){
        console.log(this.userInfo())
        let username = this.userInfo().username
        this.$refs.userPassword.show(username)
      },
      ...mapActions(["Logout"]),
      handleLogout() {
        const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
              // update-begin author:wangshuai date:20200601 for: 退出登录跳转登录页面
              that.$router.push({ path: '/user/login' });
              // window.location.reload()
              // update-end author:wangshuai date:20200601 for: 退出登录跳转登录页面
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },
      handleRouter(item){
        this.$router.push({ path: '/bus/projectDetails',query: { projectId: item.id  } })
      },
      //添加项目
      handleAddPro(){
        this.typeFlag = true
        this.$refs.modalForm.visible = true
        this.$refs.modalForm.edit()
      },
      //添加任务
      handleAddTask(){
        this.$router.push({ path: '/home/home'},)
        this.$router.push({ path: '/home/home',query:{tabKey:3}},)
      },
      handleAddWH(){
        console.log('路径',window.location.href,this.$router  )
        if(window.location.href.indexOf('myTab')){
          this.$router.push({ path: '/home/home' },()=>{},()=>{})
        }
        this.$router.push({ path: '/home/home',query: {myTab:1} })
      },
      toggle() {
        this.$emit('toggle')
      },
      onSelect (obj) {
        this.$emit('menuSelect', obj)
      },
      onUpdateMenuTitle (obj) {
        this.$emit('updateMenuTitle', obj)
      },
      loadData() {
        getAction(this.url.list).then((res) => {
          if (res.success) {
            this.projectNameList = res.result.records||res.result;
            for (let j = 0; j < this.projectNameList.length; j++) {
              const item = this.projectNameList[j];
              item.color = '#f' +item.id.slice(12, 14) +'c'+item.id.slice(15, 17);
              item.projectNameView = item.projectName.length>25?item.projectName.slice(0,25)+'...':item.projectName
            }
          }
        })
      },

    }
  }
</script>
<style lang="less" scoped>
@media screen and (max-height: 1100px) {
  #prodiv {
    // height: 380px;
  }
}
@media screen and (max-height: 800px) {
  #prodiv {
    height: 180px;
  }
}
@media screen and (max-height: 1100px) {
  #prodiv1 {
    height: 305px;
  }
}
@media screen and (max-height: 800px) {
  #prodiv1 {
    height: 125px;
  }
}

.todoCss1{
   width: 270px;
}
.userCss{
  color: #fff;
  font-size: 18px;
  padding: 20px 16px;
  border-top: 1px solid rgb(141, 147, 153,0.3);
}
.iconcss{
  position: absolute;
  left: 250px;
  top: 30px;
  background-color: #0C355C;
  z-index: 999;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  text-align: center;
}
.layout .trigger:hover{
  background: none;
}
.menuCss{
  top:5px;
}
.imgcss{
  width: 12.63%;
  height: 11.31%;
}
.allProCss{
  font-size: 14px;
    font-weight: 600;
}
.pronamecss{
  font-size: 14px;
}
.itemprocss{
  padding: 10px 0;
  color: #8D9399;
  display: block;
  width: 98%;
  border-radius: 4px;
}
.itemprocss:hover{
  color: #fff;
  cursor: pointer;
}
.itemprocss:focus{
  color: #fff;
  cursor: pointer;
  background-color: #445362;
  border-radius: 4px;
}
.loginOut{
  border-top: 1px solid rgba(223,223,223);
  padding-top: 10px;
  margin-top: 10px;

}
::v-deep .ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: #445362;
}
::v-deep .ant-menu.ant-menu-root > .ant-menu-item:first-child{
  background-color: none;
}
.userMenuCss{
  margin: 15px 0;
  font-size: 16px;
  color: #2F3237;
}
.userMenuCss:hover{
   cursor: pointer;
}
.userMenuCss .router-link-active{
  color: #000;
}
.itemCss{
  margin: 15px 0 15px 5px;
  font-size: 16px;
  color: #2F3237;
  width: 100px;
}
.itemCss:hover{
   cursor: pointer;
}
::v-deep .ant-popover-title{
  border-bottom: none;
  padding: 15px 16px 4px;
}
::v-deep .ant-popover-arrow{
  display: none;
}
.ant-divider{
  background-color: #8D9399;
  opacity: 0.3;
}
.logout_title {
    color: inherit;
    text-decoration: none;
  }
.ant-dropdown{
  left: 255px;
    top: 78px;
    min-width: 130px;
}
::v-deep .ant-badge-status-dot{
    width: 8px;
    height: 8px;
}
::v-deep .ant-menu-inline .ant-menu-item{
  font-size: 14px;
}
  /* update_begin author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
  .sider {
    @scrollBarSize: 10px;

    ul.ant-menu {

      /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
      &::-webkit-scrollbar {
        width: @scrollBarSize;
        height: @scrollBarSize;
        background-color: transparent;
        display: none;
      }

      & .-o-scrollbar {
        display: none;
      }

      /* 兼容IE */
      -ms-overflow-style: none;
      -ms-scroll-chaining: chained;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);

      /* 定义滚动条轨道 */
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      /* 定义滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: @scrollBarSize;
        background-color: #eee;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: #dddddd;
        }

        &:active {
          background-color: #bbbbbb;
        }
      }
    }

    /** 暗色系滚动条样式 */
    &.dark ul.ant-menu {
      &::-webkit-scrollbar-thumb {
        background-color: #666666;

        &:hover {
          background-color: #808080;
        }

        &:active {
          background-color: #999999;
        }
      }
    }

  }

  /* update_end author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
</style>

<!-- update_begin author:sunjianlei date:20190530 for: 选中首页的时候不显示背景颜色 -->
<style lang="less">


  .ant-menu.ant-menu-root {
    font-size: 16px;
    & > .ant-menu-item:first-child {
      // background-color: transparent;

      & > a, & > a:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: @primary-color;
        }
      }
    }

    &.ant-menu-dark > .ant-menu-item:first-child {
      & > a, & > a:hover {
        color: rgba(255, 255, 255, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    &:not(.ant-menu-horizontal) .ant-menu-item-selected {

      object:nth-child(1){
        display: none;
      }
      object:nth-child(2){
        display: block;
      }
    }
  }
</style>
<!-- update_end author:sunjianlei date:20190530 for: 选中首页的时候不显示背景颜色 -->
