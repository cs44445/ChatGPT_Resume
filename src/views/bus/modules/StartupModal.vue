<template>
  <j-modal
    
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :maskClosable="false"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <startup-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @uploadList="uploadList"></startup-form>
    <div slot="footer">
      <div style="display: flex;justify-content: space-between;">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk">确定启动</a-button>
      </div>
       
    </div>
  </j-modal>
</template>

<script>

  import StartupForm from './StartupForm'
  export default {
    name: 'StartupModal',
    components: {
      StartupForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      uploadList(){
        this.$emit('uploadList')
      },
      handleOk () {
        this.$refs.realForm.type = 2
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';

</style>