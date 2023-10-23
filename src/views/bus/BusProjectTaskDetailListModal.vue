<template>
  <a-drawer class="task-detail-cust" :title="title" :width="width" placement="right" :closable="false"
    :maskClosable="false" @close="close" destroyOnClose :visible="visible">
    <bus-project-task-detail-list-form ref="realForm"></bus-project-task-detail-list-form>
    <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
      <!-- <a-button v-if="!disableSubmit"  @click="handleOk" type="primary" style="margin-bottom: 0;">确定</a-button> -->
    </div>

  </a-drawer>
</template>

<script>

import BusProjectTaskDetailListForm from './BusProjectTaskDetailListForm'
export default {
  name: 'BusProjectTaskDetailListModal',
  components: {
    BusProjectTaskDetailListForm
  },
  data() {
    return {
      title: '',
      width: '93vw',
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
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}

.drawer-footer {
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

.task-detail-cust /deep/ .ant-drawer-content {
  background-color: #F7F8FA;
}

.task-detail-cust /deep/.ant-drawer-body {
  background: #F7F8FA;
}
</style>