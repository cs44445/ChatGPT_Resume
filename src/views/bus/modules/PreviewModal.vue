<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    :maskClosable="false"
    cancelText="取消">
    <preview-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @uploadList="uploadList"></preview-form>
    <template slot="footer">
      <a-button @click="handleOk" type="primary">保存</a-button>
    </template>
  </j-modal>
</template>

<script>

  import PreviewForm from './PreviewForm.vue'
  export default {
    name: 'PreviewModal',
    components: {
      PreviewForm
    },
    data () {
      return {
        title:'',
        width:800,
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
      uploadList(){
        this.$emit('uploadList')
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