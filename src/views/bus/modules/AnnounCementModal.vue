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
    cancelText="关闭">
    <announ-cement-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @noticelist="noticelist"></announ-cement-form>
  </j-modal>
</template>

<script>

  import AnnounCementForm from './AnnounCementForm.vue'
  export default {
    name: 'AnnounCementModal',
    components: {
      AnnounCementForm
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
      noticelist(){
        this.$emit('noticelist');
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