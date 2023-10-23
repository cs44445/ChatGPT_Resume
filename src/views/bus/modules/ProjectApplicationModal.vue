<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false">
    <project-application-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @noticelist="noticelist"></project-application-form>
  </j-modal>
</template>

<script>

  import ProjectApplicationForm from './ProjectApplicationForm'
  export default {
    name: 'ProjectApplicationModal',
    components: {
      ProjectApplicationForm
    },
    data () {
      return {
        title:'',
        width:1000,
        visible: false,
        disableSubmit: false
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
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      noticelist(){
        this.$emit('noticelist');
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
/deep/ .ant-btn-primary{ 
  background-color:#1990ff;
  border-color: #1990ff;
}
</style>