<template>
  <a-drawer
    :title="title"
    :width="1200"
    :visible="visible"
    placement="right"
    :closable="false"
    :maskClosable="false"
    @close="close"
    destroyOnClose
  >
    <bus-apply-reject-form
      ref="realForm"
      @addok="submitCallback"
      :disabled="disableSubmit"
      :busApplyRejectForm="busApplyRejectForm"
    />
    <div class="drawer-footer">
      <a-button @click="handleCancel">取消</a-button>
      <!-- <a-button @click="handleExamine(2)" type="danger">驳回</a-button> -->
      <a-button type="primary" @click="handleExamine(1)" style="margin-bottom: 0;margin-left:10px;">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import BusApplyRejectForm from './ProjectUserRejectForm'

export default {
  name: 'BusProjectModal',
  props: ['busApplyRejectForm'],
  components: {
    BusApplyRejectForm
  },
  data() {
    return {
      title: '',
      visible: false,
      disableSubmit: false,

    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleExamine(status) {
      this.$refs.realForm.handleSubmit(status)
    },
    submitCallback() {
      this.visible = false
      this.$emit('handlePass')
    },
    handleCancel() {
      this.close()
    }
  },
  mounted() {}
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