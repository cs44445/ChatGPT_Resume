<template>
  <a-drawer  :width="width" placement="right"  :maskClosable="false" @close="close" :title="title"
    destroyOnClose :visible="visible">
    <!-- <div style="display: flex;justify-content: space-between;margin-top: 20px;"> -->
          <!-- <p style="font-size: 24px;font-weight: bold;color: #2F3133;">{{ title }}</p> -->
          <!-- <a-button type="primary" @click="handleOk">
          保存
          </a-button> -->
      <!-- </div> -->
    <bus-project-add-task-form ref="realForm" @ok="submitCallback" :ifPro="ifPro"></bus-project-add-task-form>
    <div class="drawer-footer">
      <a-button v-if="!disableSubmit" @click="handleOk" type="primary" style="margin-bottom: 0;">确定</a-button>
      <a-button @click="handleCancel" style="margin-bottom: 0;">取消</a-button>
    </div>

  </a-drawer>
</template>

<script>

import BusProjectAddTaskForm from './BusProjectAddTaskForm'
export default {
  name: 'BusProjectAddTaskModal',
  components: {
    BusProjectAddTaskForm
  },
  data() {
    return {
      title: '',
      width: '800px',
      visible: false,
      disableSubmit: false,
      ifPro:false
    }
  },
  methods: {
    add(proId) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add(proId);
      })
    },
    edit(record) {
      this.title = '编辑任务'
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
</style>