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
    <bus-project-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @close="handleCancel" @loadProjectData="loadProjectData"></bus-project-form>
    <div slot="footer" style="display: none;">
    </div>
  </j-modal>
</template>

<script>

  import BusProjectForm from './BusProjectForm'
  export default {
    name: 'BusProjectModal',
    props:{
      typeFlag:{
        type: Boolean,
        required: false,
        default: false
      },
    },
    components: {
      BusProjectForm
    },
    data () {
      return {
        title:'',
        width:900,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      loadProjectData(){
        this.$emit('loadProjectData');
      },
      add () {
        this.visible=true
        this.$nextTick(()=>{
          // this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.handleQueryProjectOwnerList();
          this.$refs.realForm.handleTags();
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        // this.$refs.realForm.submitForm();
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
<style scoped>
::v-deep .ant-modal-footer{
   display: none;
} 
</style>