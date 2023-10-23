<template>
    <div>
        <template>
            <a-card :bordered="false" style="background: #F7F8FA;">
                <!-- 查询区域 -->
                <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
                    <div style="width: 70%;">
                        <a-form layout="inline" @keyup.enter.native="searchQuery">
                            <div>
                                <a-row :gutter="24">
                                        <a-col :span="6">
                                        <a-form-item label="">
                                            <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
                                            <j-input placeholder="请输入用户账号" v-model="queryParam.username" class="tablePageQueryCss"></j-input>
                                        </a-form-item>
                                        </a-col>

                                        <a-col :span="6">
                                        <a-form-item label="">
                                            <j-input placeholder="请输入姓名" v-model="queryParam.realname" class="tablePageQueryCss"></j-input>
                                        </a-form-item>
                                        </a-col>

                                        <template v-if="toggleSearchStatus">
                                        <a-col :span="6">
                                            <a-form-item label="">
                                            <a-select v-model="queryParam.sex" placeholder="请选择性别" class="tablePageQueryCss">
                                                <a-select-option value="">请选择</a-select-option>
                                                <a-select-option value="1">男</a-select-option>
                                                <a-select-option value="2">女</a-select-option>
                                            </a-select>
                                            </a-form-item>
                                        </a-col>

                                        <a-col :span="6">
                                            <a-form-item label="">
                                            <a-input placeholder="请输入手机号码" v-model="queryParam.phone" class="tablePageQueryCss"></a-input>
                                            </a-form-item>
                                        </a-col>

                                        <a-col :span="6">
                                            <a-form-item label="">
                                                <a-select v-model="queryParam.status" placeholder="请选择状态" class="tablePageQueryCss">
                                                    <a-select-option value="">请选择</a-select-option>
                                                    <a-select-option value="1">正常</a-select-option>
                                                    <a-select-option value="2">冻结</a-select-option>
                                                    <a-select-option value="3">签出</a-select-option>
                                                </a-select>
                                            </a-form-item>
                                        </a-col>
                                        </template>

                                        <a-col :span="6">
                                            <div style="display: flex;" class="table-page-search-submitButtons">
                                                <a-button @click="searchQuery" icon="search"  class="btnCss">查询</a-button>
                                                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
                                                <div @click="handleToggleSearch"
                                                style="margin-left: 8px;padding: 8px;border: 1px solid #cdcdcd;border-radius: 50%;text-align: center;line-height: 10px;">
                                                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                                                </div>
                                            </div>
                                        </a-col>
                                </a-row>
                            </div>
                        </a-form>
                    </div>
                    <div>
                        <a-button type="primary" @click="handleAdd">
                        签入工作者
                        </a-button>
                    </div>
                </div>
                <div>
                    <a-table
                        ref="table"
                        size="small"
                        rowKey="id"
                        :columns="columns"
                        :dataSource="dataSource"
                        :pagination="ipagination"
                        :loading="loading"

                        class="j-table-force-nowrap"
                        @change="handleTableChange">
                        <template slot="realname" slot-scope="text,record">
                            <a @click="handleShowOrg(record)">{{ text }}</a>

                        </template>
                        <template slot="companyName" slot-scope="text,record">
                          <a @click="handleCompanyDetail(record)">{{ text }}</a>
                        </template>
                        <template slot="avatarslot" slot-scope="text, record">
                        <div class="anty-img-wrap">
                            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
                        </div>
                        </template>

                        <template slot="chanceCode" slot-scope="text, record">
                          <a @click="handleChanceDetail(record)">{{ text }}</a>
                        </template>
                          <span slot="dataStatus" slot-scope="text, record">
                            <a-tag v-if="record.checkinStatus == 1" color="cyan">待提交</a-tag>
                            <a-tag v-if="record.checkinStatus == 2" color="orange">审批中</a-tag>
                            <a-tag v-if="record.checkinStatus == 3" color="red">已退回</a-tag>
                            <a-tag v-if="record.checkinStatus == 4" color="green">已通过</a-tag>
                            <a-tag v-if="record.checkinStatus == 5" color="purple">
                              <!-- pink -->
                              已作废
                            </a-tag>
                          </span>
                        <template slot="person" slot-scope="text">
                        {{ text==1?"是":"否" }}
                        </template>
                        <span slot="action" slot-scope="text, record" class="fix-action">
                        <span @click="handleEdit(record)" v-has="'user:edit'"><a-icon type="edit" class="activeLogoCss"/></span>
                        <a-dropdown>
                            <span class="ant-dropdown-link">
                            <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
                            </span>
                            <a-menu slot="overlay">
                            <a-menu-item v-if="record.checkinStatus!=1">
                                <a @click="handleViewApprHistory(record)">跟踪</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;" @click="handleDetail(record)">详情</a>
                            </a-menu-item>

                            <a-menu-item>
                                <a href="javascript:;" @click="handleChangePassword(record.username)">密码</a>
                            </a-menu-item>

                            <a-menu-item>
                                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                                <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>


                            <a-menu-item v-if="record.status==1">
                                <a-popconfirm title="确定冻结吗?" @confirm="() => handleFrozen(record.id,2,record.username)">
                                <a>冻结</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item v-if="record.status==2">
                                <a-popconfirm title="确定解冻吗?" @confirm="() => handleFrozen(record.id,1,record.username)">
                                <a>解冻</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item>
                                <a-popconfirm title="确定签出吗?" @confirm="() => handleFrozen(record.id,3,record.username)">
                                <a>签出</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item>
                                <a-popconfirm title="确定重置密码吗?"  @confirm="() => resetPassword(record.id,1,record.username)">
                                <a>重置密码</a>
                                </a-popconfirm>
                            </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                        </span>
                    </a-table>
                </div>
            </a-card>
        </template>
        <organization ref="organization" :isShow="false"></organization>
        <edit-form ref="modalForm" @ok="modalFormOk"></edit-form>
        <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>
        <bus-company-modal ref="companyModalForm" @ok="companyModalFormOk"></bus-company-modal>
        <bus-appr-history-modal ref="modalApprHisForm" />


        <!-- 申请记录 -->
        <application-record-model ref="modalChmodForm" @ok="modalFormOk"></application-record-model>
    </div>
</template>
<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import editForm from './SupplierWorkerComponents/editForm'
  import PasswordModal from '../../system/modules/PasswordModal'
  import {frozenBatch,resetPasswordBatch} from '@/api/api'
  import {putAction,getFileAccessHttpUrl,getAction} from '@/api/manage';
  import Organization from '@/views/user/Organization'
  import BusCompanyModal from './BusCompanyModal'
  import ApplicationRecordModel from './ApplicationRecordModel'
  import BusApprHistoryModal from './BusApprHistoryModal'
export default {
    name: 'SupplierWorker',
    mixins: [JeecgListMixin],
    components: {
        editForm,PasswordModal,Organization,BusCompanyModal,ApplicationRecordModel,BusApprHistoryModal
    },
    data() {
      return {
        queryParam: {},
        columns: [
        //   {
        //     title: 'ID',
        //     dataIndex: 'id',
        //   },
          {
            title: '姓名',
            dataIndex: 'realname',
            slots: { title: 'realname' },
            scopedSlots: { customRender: 'realname' },
          },
          {
            title: '供应商编码',
            dataIndex: 'supplierCode',
          },
          {
            title: '供应商名称',
            dataIndex: 'supplierName',
            slots: { title: 'companyName' },
            scopedSlots: { customRender: 'companyName' },
          },
          {
            title: '采购订单编号',
            dataIndex: 'procureOrderCode',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '性别',
            dataIndex: 'sex_dictText',
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
            width: 120,
          },
          {
            title: '职位（供应商）',
            dataIndex: 'workerPost',
          },
          // {
          //   title: '价格（供应商）',
          //   dataIndex: 'companyPrice',
          // },
          {
            title: '入职日期',
            dataIndex: 'inductionTime',
          },
           {
            title: '审核状态',
            dataIndex: 'checkinStatus_dictText',
            scopedSlots: { customRender: 'dataStatus' }
          },
          {
            title: '账号状态',
            dataIndex: 'status_dictText',
          },


          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center"
          }
        ],
        url: {
            list: "/sys/user/workerList",
            delete: "/sys/user/delete",
            deleteBatch: "/sys/user/deleteBatch",
            exportXlsUrl: "/sys/user/exportXls",
            importExcelUrl: "sys/user/importExcel",
            downloadTempl: '/sys/common/static/usertemplate/用户导入模板.xls',
            syncUser: "/act/process/extActProcess/doSyncUser",
            personalBasicInfo:'/sys/user/personalBasicInfo',
            getSupplierDetail:'/bus/busCompany/queryById'
        }
      }
    },
    methods: {
      handleCompanyDetail(record){
        console.log(record)
        getAction(this.url.getSupplierDetail,{id:record.supplierId}).then(res=>{
           if(res.success){
              this.$refs.companyModalForm.edit(res.result)
              this.$refs.companyModalForm.title="详情";
              this.$refs.companyModalForm.disableSubmit = true;
           }else{
             this.$message.warning(res.message)
           }
        })

      },
      async handleShowOrg(record){
        const baseUserInfo =  await getAction(this.url.personalBasicInfo,{userId:record.id})
        this.$refs.organization.sysUser = baseUserInfo.result
        this.$refs.organization.userId=record.id
        this.$refs.organization.visible=true
        this.$refs.organization.handlePersonalSummary()
      },
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
      },

      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning('管理员账号不允许此操作,请重新选择！');
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "确认操作",
            content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      resetPassword: function (id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning('管理员账号不允许此操作！');
          return;
        }
        resetPasswordBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning('管理员账号不允许此操作！');
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      handleAgentSettings(username){
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "用户代理人设置";
      },
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      },
      companyModalFormOk(){

      },
      onSyncFinally({isToLocal}) {
        // 同步到本地时刷新下数据
        if (isToLocal) {
          this.loadData()
        }
      },
      /* 下载模板 */
      handleDownloadTempl() {
        let url = `${window._CONFIG['domianURL']}/${this.url.downloadTempl}`
        window.location.href = url
      },
      handleTable(record){
        this.$refs.modalChmodForm.edit(record);
        this.$refs.modalChmodForm.title = "申请记录";
        this.$refs.modalChmodForm.disableSubmit = false;
      },
      //追踪
      handleViewApprHistory(record) {
        let that = this
        //
        if (record.instanceId == '') {
          this.$message.error('没有流程信息')
        } else {
          this.$refs.modalApprHisForm.visible = true
          this.$refs.modalApprHisForm.loadData(1, record.instanceId)
        }
      }
    }
}
</script>
<style scoped>
@import '~@assets/css/common.css';
@import '~@assets/less/common.less';

.activeLogoCss:hover {
  cursor: pointer;
}

::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #F7F8FA;
}
::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  /* .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td */
  background: #fff !important;
}
::v-deep .ant-table-tbody > tr > td{
  background: #F7F8FA;
}
::v-deep .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  background: #fff;
}
::v-deep .ant-table-thead > tr > th{
  background: #F7F8FA;
}
</style>