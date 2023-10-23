<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1000"
      :visible="visible"
      @ok="handleOk"
      :maskClosable="false"
      @cancel="handleCancel"
      cancelText="关闭">
      <div class="notice-title">
        <p class="noticeType">{{notice.noticeType_dictText}}</p>
        <div class="notice-title-right">
          <p class="noticeLabel">发布人：{{notice.createBy_dictText}}</p>
          <p class="noticeLabel">发布时间：{{notice.createTime}}</p>
        </div>
      </div>
      <!-- <hr/> -->
      <p class="noticeInfo" v-html="notice.noticeInfo"></p>
    </a-modal>
    <!-- 组织 -->
    <organization ref="organization"></organization>
  </div>
</template>

<script>
import Organization from '@/views/user/Organization'
import {filterObj} from '@/utils/util'
import {getAction} from '@/api/manage'

export default {
  name: "SelectUserModal",
  components: {
    Organization
  },
  data() {
    return {
      title: "消息",
      names: [],
      visible: false,
      placement: 'right',
      description: '',

      notice: {},

      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
      noticeInfoId: '',
      url: {
        list: "/bus/busNoticeInfo/noticeUserList"
      }
    }
  },
  created() {
    window.showUserInfo = this.showUserInfo
  },
  methods: {
    async showUserInfo(id,type){
      console.log(id,"+++++",type)
      if(type=='1'){
        this.$refs.organization.userId=id
        this.$refs.organization.visible=true
      }else if(type=='2'){
        const detailRes = await getAction(this.url.detail, {id})
        //  console.log(222,detailRes)
        this.$refs.modalForm.edit(detailRes.result);
        this.$refs.modalForm.title="详情";
        this.$refs.modalForm.disableSubmit = true;
      }
    },
    getUserList(record){
      this.notice = record
    },

    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.dataSource2 = this.selectedRowKeys;
      console.log("data:" + this.dataSource2);
      this.$emit("selectFinished", this.dataSource2);
      this.visible = false;
    },
    add() {
      this.visible = true;
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
.notice-title{
  display: flex;
  justify-content: space-between;
}
.notice-title-right{
  display: flex;
  justify-content: space-between;
}
.notice-title-right p:first-child{
  border-right: 1px solid #999;
  padding-right: 8px;
  margin-right: 8px;
  height: 16px;
}
.noticeType{
  border-left: 3px solid #1478f0;
  padding-left: 8px;
  height: 18px;
  font-size: 18px;
  line-height: 18px;
  font-weight: bold;
}
.noticeLabel{
  font-size: 1em;
  line-height: 1.2;
  color: #999;
}
.noticeInfo{
  margin-top: 30px;
  font-size: 1.2em;
  line-height: 1.2;
}


/deep/ .act-title{
  text-align: center;
  padding-bottom: 30px;
  margin-bottom: 30px;
  font-size: 34px;
  border-bottom:1px solid #e8e8e8;
}
/deep/ .noticeInfo h1:nth-child(2){
  width:80%;
  margin:0 auto;
  font-size: 16px;
  font-weight: unset;
}
/deep/ .noticeInfo h1:nth-child(2) p{
  font-size: 16px !important;
}
// /deep/ .act-start{
//   float: left;
// }
// /deep/ .act-start-time{
//   float: right;
// }
// /deep/ .act-end-time{
//   clear: both;
//   float: left;
// }
// /deep/ .act-location{
//   // clear: both;
//   float: right;
// }
// /deep/ .act-must{
//   clear: both;
// }
/deep/ .act-need-user{
  color: #1478f0;
  cursor: pointer;
}
/deep/ .act-must-user{
  color: #1478f0;
  cursor: pointer;
}

</style>