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
    <circulate-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @uploadList="uploadList"></circulate-form>
    <template slot="footer">
      <div class="default-btn">
        <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handleReset">重置</a-button>
      </div>
     
      <a-button @click="handleOk" type="primary">填报</a-button>
    </template>
  </j-modal>
</template>

<script>

  import CirculateForm from './CirculateForm.vue'
  export default {
    name: 'CirculateModal',
    components: {
      CirculateForm
    },
    data () {
      return {
        title:'',
        width:600,
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
        this.visible = false;
      },
      handleReset() {
        this.$refs.realForm.searchReset();
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
  // background-color:#1990ff;
  // border-color: #1990ff;
}
/deep/ .ant-modal-footer {
  border-top: 0px;
  display: flex;
  justify-content: space-between;
  padding: 20px 25px;
}
.default-btn {
  /deep/ .ant-btn {
    color: #2f3133;
  }
}
.ant-btn {
    bottom: 10px;
    font-weight: bold;
}
::v-deep .ant-modal-title{
  font-size: 24px;
}
</style>