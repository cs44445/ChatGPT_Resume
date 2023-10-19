<template>
  <div class="main">
    <a-form-model class="user-layout-login">
      <login-account ref="alogin"></login-account>
      <a-form-model-item>
      </a-form-model-item>
      <a-form-item style="margin-top:24px">
        <a-button size="large"  type="primary"  htmlType="submit"  class="login-button">登&nbsp;&nbsp;&nbsp;&nbsp;录
        </a-button>
      </a-form-item>
    </a-form-model>
  </div>
</template>

<script>
  import LoginAccount from './LoginAccount'

  export default {
    name: "Login",
    components: { LoginAccount },
    data () {
      return {}
    },
    mounted () {
      document.body.classList.add('userLayout')
    },
    beforeDestroy () {
      document.body.classList.remove('userLayout')
    },
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
}
</style>
<style>
.valid-error .ant-select-selection__placeholder{
  color: #f5222d;
}

.ant-btn-primary {
  border-color: #CD128A !important;
}
</style>