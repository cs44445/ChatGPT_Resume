<template>
  <a-drawer
    :title="title"
    :width="1200"
    :visible="visible"
    placement="right"
    :closable="false"
    :maskClosable="false"
    @close="close"
    destroyOnClose>

    <supplier-worker-apply-form
      ref="realForm"
      @ok="submitCallback"
      :disabled="disableSubmit"
      :busApplyAuditForm="busApplyAuditForm"
    />
    <div class="drawer-footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handleExamine(2)" type="danger" style="margin-bottom: 0;margin-left:10px;">驳回</a-button>
      <a-button type="primary" @click="handleExamine(1)" style="margin-bottom: 0;margin-left:10px;">通过</a-button>
    </div>
  </a-drawer>
</template>

<script>
import SupplierWorkerApplyForm from './SupplierWorkerApplyForm'
import { postAction,getAction } from '@/api/manage'
export default {
  name: 'SupplierWorkerApplyModal',
  props: ['busApplyAuditForm'],
  components: {
    SupplierWorkerApplyForm
  },
  data() {
    return {
      title: '',
      visible: false,
      disableSubmit: false,
      url: {
        passUrl: '/bus/busProjectUser/applyPass'
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleExamine(status) {
      let that = this
      let params = {
        apprId: that.busApplyAuditForm.apprId,
        taskId: that.busApplyAuditForm.taskId,
        instanceId: that.busApplyAuditForm.instanceId,
        // submitUser: that.busApplyAuditForm.submitUser,
        apprStatus: status, //1通过  2驳回
        apprRemark: that.$refs.realForm.model.handleOpinions2
      }
      postAction(that.url.passUrl, params).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.visible = false
          that.$emit('handlePass')
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
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