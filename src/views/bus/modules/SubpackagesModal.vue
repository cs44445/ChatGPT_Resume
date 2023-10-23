<!--
 * @Author: dongshuang 1qazxsw2
 * @Date: 2023-04-10 14:27:20
 * @LastEditors: dongshuang 1qazxsw2
 * @LastEditTime: 2023-05-09 15:06:42
 * @FilePath: /project-manage-web/src/views/bus/modules/SubpackagesModal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" @cancel="handleCancel" :maskClosable="false" cancelText="取消">
    <subpackages-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"
      @uploadList="uploadList"></subpackages-form>
    <template slot="footer">
      <div class="default-btn">
        <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handleReset">重置</a-button>
      </div>
     
      <a-button @click="handleOk" type="primary">保存</a-button>
    </template>
  </j-modal>
</template>

<script>

import SubpackagesForm from './SubpackagesForm.vue'
export default {
  name: 'SubpackagesModal',
  components: {
    SubpackagesForm
  },
  data() {
    return {
      title: '',
      width: 600,
      visible: false,
      disableSubmit: false
    }
  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add();
      })
    },
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
    handleReset() {
        this.$refs.realForm.searchReset();
      },
    submitCallback() {
      this.$emit('ok');
      this.visible = false;
    },
    uploadList() {
      this.$emit('uploadList')
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';

/deep/ .ant-btn-primary {
  // background-color: #1990ff;
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
</style>