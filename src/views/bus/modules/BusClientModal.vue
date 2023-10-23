<template>
  <a-drawer
    :title="title"
    :width="width"
    :visible="visible"
    placement="right"
    :closable="false"
    :maskClosable="false"
    @close="close"
    destroyOnClose>
    <bus-client-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :contacttab="contacttab"></bus-client-form>
    <div class="drawer-footer">
      <div v-if="!disableSubmit">
        <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
          <a-button style="margin-right: .8rem">关闭</a-button>
        </a-popconfirm>
        <a-button v-if="!disableSubmit"  @click="handleOk" type="primary" style="margin-bottom: 0;margin-left:10px;">确定</a-button>
      </div>
      <a-button v-else style="margin-right: .8rem" @click="handleCancel">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>

  import BusClientForm from './BusClientForm'
  export default {
    name: 'BusClientModal',
    components: {
      BusClientForm
    },
    data () {
      return {
        title:'',
        width:1100,
        visible: false,
        disableSubmit: false,
        contacttab:true,
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
      handleCancel () {
        this.close()
      }
    }
  }
</script>
<style scoped>
  .drawer-footer{
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>