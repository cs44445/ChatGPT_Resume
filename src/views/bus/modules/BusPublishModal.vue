<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <bus-publish-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @noticelist="noticelist"></bus-publish-form>
  </j-modal>
</template>

<script>

  import BusPublishForm from './BusPublishForm'
  export default {
    name: 'BusPublishModal',
    components: {
      BusPublishForm
    },
    props:['projectId'],
    data () {
      return {
        title:'',
        width:1000,
        visible: false,
        disableSubmit: false,
        projectId:""
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.projectId = this.projectId;
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