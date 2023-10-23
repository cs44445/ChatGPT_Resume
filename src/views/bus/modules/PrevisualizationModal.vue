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
    <previsualization-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @uploadList="uploadList"></previsualization-form>
  </j-modal>
</template>

<script>

  import PrevisualizationForm from './PrevisualizationForm.vue'
  export default {
    name: 'PrevisualizationModal',
    components: {
      PrevisualizationForm
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
      submitCallback(result){
        this.$emit('ok',result);
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