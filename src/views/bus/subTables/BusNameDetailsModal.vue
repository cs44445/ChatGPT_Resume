<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1500"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel">
      <name-details :processId="instanceId" />
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import NameDetails from './NameDetails'
  export default {
    name: "BusNameDetailsModal",
    components: {
      NameDetails
    },
    data() {
      return {
        instanceId:"",
        title: "详情",
        names: [],
        visible: false,
        placement: 'right',
        description: '',
        loading: false,
        url: {
          list: "/api/flowProcAppr/getProcDetHisList",
        }
      }
    },
    created() {
    },
    methods: {
      handleCancel() {
        this.visible = false;
      },
      handleOk() {
        this.visible = false;
      },
      loadData(arg,instanceId) {
        this.instanceId = instanceId;

      },
    }
  }
</script>
<style lang="less" scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>