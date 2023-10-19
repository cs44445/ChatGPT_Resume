<template>
  <div>
    <h1 style="text-align:center;margin-bottom: 30px;">简历评分系统</h1>
    <a-form-model ref="form" :model="model" :rules="validatorRules">
      <a-form-model-item required prop="username">
        <a-input v-model="model.username" size="large" placeholder="请输入用户名">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-model-item>
      <a-form-model-item required prop="password">
        <a-input v-model="model.password" size="large" type="password" autocomplete="false" placeholder="请输入密码">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-model-item>

      <a-row :gutter="0">
        <a-col :span="16">
          <a-form-model-item required prop="inputCode">
            <a-input v-model="model.inputCode" size="large" type="text" placeholder="请输入验证码">
              <a-icon slot="prefix" type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <img v-if="requestCodeSuccess" style="margin-top: 2px; height:48px" :src="randCodeImage"/>
          <img v-else style="margin-top: 2px;" src="../../assets/checkcode.png"/>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>

export default {
  name: 'LoginAccount',
  data(){
    return {
      requestCodeSuccess: false,
      randCodeImage: '',
      currdatetime: '',
      loginType: 0,
      model:{
        username: '',
        password: '',
        inputCode: '',
        clause:[],
      },
      validatorRules:{
        username: [
          { required: true, message: '请输入用户名!' },
          { validator: this.handleUsernameOrEmail }
        ],
        password: [{
          required: true, message: '请输入密码!', validator: 'click'
        }],
        inputCode: [{
          required: true, message: '请输入验证码!'
        }],
        clause: [{
          type: 'array',required: true, message: '请阅读服务条款与隐私条款后并勾选!',trigger: 'change',
        }]
      }

    }
  },
  created() {},
  methods:{}
}
</script>

<style lang="less" scoped>
    /deep/ .ant-input{
  border:0px solid #d9d9d9;
  background-color: #fff !important;
  }
  /deep/ .ant-checkbox-inner{
    border-radius: 100px;
  }
  /deep/ .ant-checkbox-inner:hover{
    border-radius: 100px;
  }
  /deep/ .ant-checkbox-checked::after{
    border-radius: 100px;
  }
  .clause{
    font-family: '思源黑体';
    margin-bottom:0;
  }
  .clause a{
    color:#116CE9;
  }
  /deep/ .ant-input-lg{
    height: 48px;
  }
</style>