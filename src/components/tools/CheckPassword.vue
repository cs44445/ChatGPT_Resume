<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="退出登录"
    :maskClosable="false"
    :keyboard="false"
    :closable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-alert style="margin-left: 0%;width: 100%;margin-bottom: 4%;" message="您正在使用账户的初始密码登录，需要修改密码后使用新密码重新登录。" type="info" show-icon />
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="旧密码">
          <a-input type="password" placeholder="请输入旧密码" v-decorator="[ 'oldpassword', validatorRules.oldpassword]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新密码">
          <a-input type="password" placeholder="请输入新密码" v-decorator="[ 'password', validatorRules.password]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="确认新密码">
          <a-input type="password" @blur="handleConfirmBlur" placeholder="请确认新密码" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { putAction } from '@/api/manage'
  import { mapActions, mapGetters,mapState } from 'vuex'

  export default {
    name: "CheckPassword",
    data () {
      return {
        title:"修改密码",
        modalWidth:800,
        visible: false,
        confirmLoading: false,
        validatorRules:{
          oldpassword:{
            rules: [{
              required: true, message: '请输入旧密码!',
            }],
          },
          password:{
            rules: [{
              required: true, message: '请输入新密码!',
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword:{
            rules: [{
              required: true, message: '请确认新密码!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          }
        },
        confirmDirty:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        form:this.$form.createForm(this),
        url: "sys/user/updatePassword",
        username:"",
      }
    },
    methods: {
      ...mapActions(["Logout"]),
      show(uname){
        if(!uname){
          this.$message.warning("当前系统无登录用户!");
          return
        }else{
          this.username = uname
          this.form.resetFields();
          this.visible = true;
        }
      },
      handleCancel () {
        //退出登录
        // this.close()
        this.handleLogout()
      },
      handleLogout() {
        const that = this

        that.Logout({}).then(() => {
              // update-begin author:wangshuai date:20200601 for: 退出登录跳转登录页面
              that.$router.push({ path: '/user/login' });
              window.location.reload()
              // update-end author:wangshuai date:20200601 for: 退出登录跳转登录页面
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let params = Object.assign({username:this.username},values)
            console.log("修改密码提交数据",params)
            putAction(this.url,params).then((res)=>{
              if(res.success){
                console.log(res)
                that.$message.success(res.message);

                //退出登录，修改完密码，需重新登录
                that.handleLogout()
                // that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
        })
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一样！');
        } else {
          callback()
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      }

    }
  }
</script>

<style scoped>

</style>

