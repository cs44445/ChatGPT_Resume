<template>
  <div class="main">
    <a-form-model class="user-layout-login" @keyup.enter.native="handleSubmit">
      <login-account ref="alogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-account>
      <!-- <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"  @change="handleTabClick"> -->
        <!-- <a-tab-pane key="tab1" tab="账号密码登录">

        </a-tab-pane> -->

        <!-- <a-tab-pane key="tab2" tab="手机号登录">
          <login-phone ref="plogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-phone>
        </a-tab-pane> -->
      <!-- </a-tabs> -->

      <a-form-model-item>
        <!-- <a-checkbox @change="handleRememberMeChange" default-checked>自动登录</a-checkbox> -->
        <!-- <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">
          忘记密码
        </router-link>
        <router-link :to="{ name: 'register'}" class="forge-password" style="float: right;margin-right: 10px" >
          注册账户
        </router-link> -->
      </a-form-model-item>

      <a-form-item style="margin-top:24px">
        <a-button size="large"  type="primary"  htmlType="submit"  class="login-button"  :loading="loginBtn"  @click.stop.prevent="handleSubmit" :disabled="loginBtn">登&nbsp;&nbsp;&nbsp;&nbsp;录
        </a-button>
      </a-form-item>
      
      <!-- <div class="others">
        <a href="#" class="bk1"></a>
        <a href="#" class="bk2"></a>
        <a href="#" class="bk3">•••</a>
      </div> -->
      <!-- <router-link :to="{ name: 'system-config' }"></router-link> -->
    </a-form-model>

    <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
    <login-select-tenant ref="loginSelect" @success="loginSelectOk"></login-select-tenant>
    <!-- <third-login ref="thirdLogin"></third-login> -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import {ACCESS_TOKEN, ENCRYPTED_STRING, SYS_BUTTON_AUTH, USER_AUTH, USER_ROUTING} from "@/store/mutation-types"
  import ThirdLogin from './third/ThirdLogin'
  import LoginSelectTenant from "./LoginSelectTenant"
  import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { encryption , getEncryptedString } from '@/utils/encryption/aesEncrypt'
  import { timeFix } from "@/utils/util"
  import { queryPermissionsByUser } from '@/api/api'

  import LoginAccount from './LoginAccount'
  import LoginPhone from './LoginPhone'

  export default {
    components: {
      LoginSelectTenant,
      TwoStepCaptcha,
      ThirdLogin,
      LoginAccount,
      LoginPhone
    },
    data () {
      return {
        customActiveKey: 'tab1',
        rememberMe: true,
        loginBtn: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        encryptedString:{
          key:"",
          iv:"",
        },
      }
    },
    created() {
      Vue.ls.remove(ACCESS_TOKEN)
      this.getRouterData();
      this.rememberMe = true
    },
    methods:{
      handleTabClick(key){
        this.customActiveKey = key
      },
      handleRememberMeChange(e){
        this.rememberMe = e.target.checked
      },
      /**跳转到登录页面的参数-账号获取*/
      getRouterData(){
        this.$nextTick(() => {
          let temp = this.$route.params.username || this.$route.query.username || ''
          if (temp) {
            this.$refs.alogin.acceptUsername(temp)
          }
        })
      },

      //登录
      handleSubmit () {
        this.loginBtn = true;
        if (this.customActiveKey === 'tab1') {
          // 使用账户密码登录
          this.$refs.alogin.handleLogin(this.rememberMe)
        } else {
          //手机号码登录
          this.$refs.plogin.handleLogin(this.rememberMe)
        }
      },
      // 校验失败
      validateFail(){
        this.loginBtn = false;
      },
      // 登录后台成功
      requestSuccess(loginResult){
        this.$refs.loginSelect.show(loginResult)
      },
      //登录后台失败
      requestFailed (err) {
        let description = ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试"
        this.$notification[ 'error' ]({
          message: '登录失败',
          description: description,
          duration: 4,
        });
        //账户密码登录错误后更新验证码
        if(this.customActiveKey === 'tab1' && description.indexOf('密码错误')>0){
          this.$refs.alogin.handleChangeCheckCode()
        }
        this.loginBtn = false;
      },
      loginSelectOk(){
        this.loginSuccess()
      },
      //登录成功
      loginSuccess () {
        queryPermissionsByUser().then(response => {
          const menuData = response.result.menu;
          let path = "";
          if(menuData.length > 0 ){
            let menu = menuData[0];
            if(menu.component == 'layouts/RouteView'){
              let children = menu.children; //数组
              if(children.length > 0){
                path = children[0].path;
              }
            }else{
              path= menu.path
            }
          }
          this.$router.push({ path: path}).catch((err)=>{
            //console.log('登录跳转首页出错,这个错误从哪里来的')
          })
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`,
          });
        })
      },

      stepCaptchaSuccess () {
        this.loginSuccess()
      },
      stepCaptchaCancel () {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      //获取密码加密规则
      getEncrypte(){
        var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
        if(encryptedString == null){
          getEncryptedString().then((data) => {
            this.encryptedString = data
          });
        }else{
          this.encryptedString = encryptedString;
        }
      }

    }

  }
</script>
<style lang="less" scoped>
  .user-layout-login {
    margin-top: 200px;
    label {
      font-size: 14px;
    }
  .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

  .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 48px;
      width: 100%;
      background-color: #CD128A;
    }

  .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

    .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

      &:hover {
          color: #1890ff;
        }
      }

    .register {
        float: right;
      }
    }
  }
  
.others{
  border-top: #D8D8D8 1px solid;
  width: 100%;
  display: flex;
  justify-content:center;
  a{
    width:20px;
    border: #D8D8D8 1px solid;
    border-radius: 5px;
    padding: 15px;
    margin:25px 10px 10px 10px;
    width: 50px;
    display: block;
  }
  .bk1{
    background:url(~@/assets/dd.png) center no-repeat;
  }
  .bk2{
    background:url(~@/assets/wx.png)  center no-repeat;
  }
  .bk3{
    color:#2F3133;
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder{
  color: #f5222d;
}
</style>