<template>
  <div class="account-settings-info-view"> 
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form-model ref="form" :model="model" :rules="validatorRules"  >
          <a-form-model-item label="用户名"  prop="customerName">
            <a-input disabled v-model="model.username" />
            <!-- <a-input v-model="model.customerName" placeholder="请输入客户名称" :disabled="disableSubmit"></a-input>
            <a-alert message="请输入客户企业的工商注册全称" type="info" show-icon /> -->
          </a-form-model-item>
          <a-form-model-item label="姓名"  prop="contacts">
            <a-input v-model="model.realname" placeholder="请填写姓名" />
          </a-form-model-item>
          <a-form-model-item label="联系电话"  prop="phone">
            <a-input v-model="model.phone" placeholder="请填写联系电话"/> 
          </a-form-model-item>
          <a-form-model-item label="邮箱地址"  prop="email">
            <a-input v-model="model.email" placeholder="请填写邮箱地址"/>
          </a-form-model-item>

            <a-form-item>
              <a-button type="primary" @click="save">保存修改</a-button>
              <!-- <a-button style="margin-left: 8px">保存</a-button> -->
            </a-form-item>
        </a-form-model>

        

      </a-col>
      <!-- <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }" disabled>
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col> -->
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }" disabled>
        <div class="ant-upload-preview" >
          
          <img src="@/assets/head.png"/>
        </div>
      </a-col>
      

    </a-row>

    <avatar-modal ref="modal">

    </avatar-modal>
  </div>
</template>

<script>
  import AvatarModal from './AvatarModal'
  import { getAction,httpAction } from '@/api/manage'

  export default {
    components: {
      AvatarModal
    },
    data () {
      return {
        model: {},
        validatorRules: {
          phone: [
            { required: true, message: '请输入联系电话!' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!' },
          ],
          email: [{required: true, message: '请输入邮箱!'}, {validator: this.validateEmail}],
        },
        // cropper
        preview: {},
        option: {
          img: '/avatar2.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        url:{
          getCurrentUserInfo: "/sys/user/getCurrentUserInfo",
          saveUserInfo: "/sys/user/saveUserInfo",
        }
      }
    },
    mounted(){
      this.getUserInfo()
    },
    methods: {
      getUserInfo(){
        getAction(this.url.getCurrentUserInfo,{}).then((res)=>{
          if(res.success){
            this.model = res.result
          }else{
            this.$message.warning(res.message);
          }
        });
        
      },
      save(){
        const that = this;
        // 触发表单验证
        // that.$refs.form.validate(valid => {
        //   if (valid) {
            that.confirmLoading = true;
            //如果是上级择传入departIds,否则为空
            this.confirmLoading = true;
            let param = {
              id: this.model.id,
              realname: this.model.realname,
              phone: this.model.phone,
              email: this.model.email,
            }
            httpAction(this.url.saveUserInfo,param,'put').then((res)=>{
              if(res.success){
                this.$message.success(res.message);
              }else{
                this.$message.warning(res.message);
              }
            }).finally(() => {
              
            })

          // }else{
          //   return false;
          // }
        // })
      },
      validateEmail(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)){
            var params = {
              tableName: 'sys_user',
              fieldName: 'email',
              fieldVal: value,
              dataId: this.userId
            };
            duplicateCheck(params).then((res) => {
              console.log(res)
              if (res.success) {
                callback()
              } else {
                callback("邮箱已存在!")
              }
            })
          }else{
            callback("请输入正确格式的邮箱!")
          }
        }
      },
    }
  }
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>