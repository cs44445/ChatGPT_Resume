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
    <batchadd-form ref="realForm" 
    @ok="submitCallback" 
    :disabled="disableSubmit"  @passfunction="meetfunction" @passfunction1="meetfunction1"
    @uploadList="uploadList"></batchadd-form>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <!-- <a-form-model-item label="预计投入工时（h）" :labelCol="{ span: 10 }" :wrapperCol="{ span: 6 }" style="position:absolute;left:20px;bottom:-18px;">
        <a-input v-model="estimateTime" disabled style="height:30px"></a-input>
      </a-form-model-item>
      <a-form-model-item label="预计人力成本（元）" :labelCol="{ span: 10 }" :wrapperCol="{ span: 6 }" style="position:absolute;left:300px;bottom:-18px;">
        <a-input v-model="estimateSlr" disabled style="height:30px"></a-input>
      </a-form-model-item> -->
    </template>
  </j-modal>
</template>

<script>

  import BatchaddForm from './BatchaddForm.vue'
  export default {
    name: 'BatchaddModal',
    components: {
      BatchaddForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        estimateTime:'',
        estimateSlr:''
      }
    },
    methods: {
      meetfunction(val){
        this.estimateTime = val
      },
      meetfunction1(val){
        this.estimateSlr = val
      },
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (projectId,milepostId) {
        this.visible=true
        this.$bus.$emit('handleVis');
        this.$nextTick(()=>{
          this.$refs.realForm.edit(projectId,milepostId);
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
</style>