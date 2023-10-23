<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :maskClosable="false"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <teamours-form 
    ref="realForm" 
    @ok="submitCallback" 
    :disabled="disableSubmit" 
    @passfunction="meetfunction" 
    @passfunction1="meetfunction1" @milepostId = 'milepostId'></teamours-form>
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-form-model-item 
      label="预计投入工时（h）" 
      :labelCol="{ span: 10 }" 
      :wrapperCol="{ span: 6 }" 
      style="position:absolute;left:20px;bottom:-18px;"
      v-if="ifMilepostId">
        <a-input v-model="estimateTime" disabled style="height:30px"></a-input>
      </a-form-model-item>
      <a-form-model-item 
      label="预计人力成本（元）" 
      :labelCol="{ span: 10 }" 
      :wrapperCol="{ span: 6 }" 
      style="position:absolute;left:300px;bottom:-18px;"
      v-if="ifMilepostId">
        <a-input v-model="estimateSlr" disabled style="height:30px"></a-input>
      </a-form-model-item>
    </template>
  </a-modal>
</template>

<script>

  import TeamoursForm from './TeamoursForm'
  export default {
    name: 'TeamoursModal',
    components: {
      TeamoursForm
    },
    data () {
      return {
        title:'',
        width:1200,
        visible: false,
        disableSubmit: false,
        estimateTime:'',
        estimateSlr:'',
        ifMilepostId:false,
      }
    },
    created() {
        let self = this
        this.$bus.$on('handleVis', function(value) {
          self.$emit('close');
          self.visible = false;
        })
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
      handleVis(){
        this.visible = false;
      },
      milepostId(a){
        this.ifMilepostId = a;
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
      handleCancel () {
        this.close()
      }
    }
  }
</script>
<style lang="less" scoped>

</style>