<template>
  <a-modal  :width="width"  :maskClosable="false" @cancel="handleCancel"
    destroyOnClose :visible="visible">
    <p style="font-size: 24px;font-weight: bold;color: #2F3133;">处理</p>
    <bus-project-task-deal-form ref="realForm" @ok="submitCallback"></bus-project-task-deal-form>
    <template slot="footer">
      <div style="display: flex;justify-content: space-between;">
        <a-button @click="handleCancel" style="margin-bottom: 0;">取消</a-button>
        <a-button v-if="!disableSubmit" @click="handleOk" type="primary" style="margin-bottom: 0;">提交</a-button>
      </div>
    </template>

  </a-modal>
</template>

<script>

import BusProjectTaskDealForm from './BusProjectTaskDealForm'
export default {
  name: 'BusProjectTaskDealModal',
  components: {
    BusProjectTaskDealForm
  },
  data() {
    return {
      title: '',
      width: '500px',
      visible: false,
      disableSubmit: false
    }
  },
  methods: {
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record);
      })
    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleOk() {
      this.$refs.realForm.submitForm();
    },
    submitCallback() {
      this.$emit('ok');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */



</style>