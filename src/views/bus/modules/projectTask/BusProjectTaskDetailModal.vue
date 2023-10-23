<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen :maskClosable="false"
    @cancel="handleCancel" cancelText="取消" class="cust-task">
     <bus-project-task-detail-form ref="realForm" @ok="submitCallback" ></bus-project-task-detail-form>
    <div slot="footer">
        <a-button @click="handleCancel">取消</a-button>
    </div>
  </j-modal>
</template>

<script>
import BusProjectTaskDetailForm from './BusProjectTaskDetailForm'
export default {
  name: 'BusProjectTaskDetailModal',
  components: {
    BusProjectTaskDetailForm
  },
  data() {
    return {
      title: '',
      width: '75vw',
      visible: false,
      disableSubmit: false,
    }
  },
  created(){

  },
  methods: {

    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record.id);
      })
    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    submitCallback() {
      this.$emit('ok');
      // this.visible = false;
    },
    handleCancel() {
      this.close()
    },
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-modal-content{
  background-color: #f6f6f6;
}
.con-title {
  font-size: 14px;
  font-weight: bold;
  color: #2F3133;
}

.con-desc {
  font-size: 12px;
  color: #8D9399;
  display: flex;
  gap: 15px;
}
.fix-action span {
  display: flex;
  align-items: center;
}
.table-item {
  display: flex;
  gap: 11px;
  align-items: center;
  margin: 2px 0;
}

.table-item img {
  width: 32px;
  height: 32px;
}
.activeLogoCss:hover {
  cursor: pointer;
}
.finishBtnCss,.continueBtnCss{
  border: 1px solid #D8D8D8;
  color: #2F3133;
}
.iconCss{
  margin-right: 10px;
  font-size: 24px;
}
.btnCss{
    border-color: #d93899;
    color: #d93899;
}
.mileMonthCss{
  width: 38px;
  border-radius: 4px 4px 0 0;
  background-color: #F2B202;
  color: #FFFFFF;
  text-align: center;
  font-size: 8px;
}
.mileDayCss{
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #3D3D3D;
}
::v-deep .ant-upload.ant-upload-drag{
  background-color: #ffffff !important;
    border: none!important;
    color: #8D9399 !important ;
}
.uploadBtn{
  color: #CD128A;
  border-color: #d93899;
}
p{
  overflow:hidden;
  white-space:pre-line;
  text-overflow:ellipsis
}
.taskTypeBtn,.taskTypeBtn:hover{
  background: #136DEB;
  color: #FFFFFF;
  margin-left: 20px;
  border: 1px solid #136DEB;
}
.cust-task /deep/.ant-modal-body {
  position: relative;
}

.info-box {
  /deep/ img {
    max-width: 100%;
  }
}

.title-taskno {
  padding: 2px 10px;
  border-radius: 4px;
  background-color: rgba(25, 144, 255, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  margin-right: 10px;
}

.title-act {
  border: 1px solid #8666bb;
  padding: 2px 10px;
  font-size: 12px;
  background: #f0ebf9;
  border-radius: 4px;
}

.title-dea {
  border: 1px solid #43a047;
  padding: 2px 10px;
  font-size: 12px;
  background: #eff9f0;
  border-radius: 4px;
}

.title-clo {
  border: 1px solid #838a9d;
  padding: 2px 10px;
  font-size: 12px;
  background: #ebebeb;
  border-radius: 4px;
}

.info-box {
  background: #f5f5f5;
  padding: 15px 25px;
}

.title-margin {
  margin: 20px 0;
}

.appoint-box {
  display: flex;
  align-items: center;
}

.appoint-box-con {
  background: #fff;
  padding: 5px 5px 0 5px;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.appoint-items {
  width: 30%;
  padding-right: 5px;
  height: 25px;
  // line-height: 20px;
  border-radius: 24px;
  background-color: rgba(232, 244, 255, 1);
  color: rgba(16, 16, 16, 1);
  display: flex;
  align-items: center;
  margin-right: 5px;
  margin-bottom: 5px;
  // margin-top: 5px;
}

.appoint-items span {
  display: flex;
  width: 25px;
  height: 25px;
  // line-height: 20px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}

.task-action {
  position: absolute;
  left: 41%;
  bottom: -15px;
  width: 290px;
  border-radius: 5px;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 1);
  z-index: 999;
  background: #bbbbbb;
  padding: 15px;
  display: flex;
  align-items: center;
}

.task-action-item {
  flex: 1;
  color: #fff;
  font-size: 18px;
  padding: 0 10px;
  border-right: 1px solid #fff;
  cursor: pointer;
}

.task-action .task-action-item:last-child {
  border-right: none;
}

.circularCss{
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 10px 0 0;
    text-align: center;
}
.active {
  display: none; // 隐藏
}
.active1 {
  display: none; // 隐藏
}
</style>