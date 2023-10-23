<template>
  <a-card :bordered="false" style="background: #F7F8FA;">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="">
                <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
                <j-input placeholder="输入用户账号" v-model="queryParam.username" class="tablePageQueryCss"></j-input>
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item label="">
                <j-input placeholder="请输入用户姓名" v-model="queryParam.realname" class="tablePageQueryCss"></j-input>
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
                  <a-input placeholder="请输入手机号码查询" v-model="queryParam.phone" class="tablePageQueryCss"></a-input>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="">
                  <a-select v-model="queryParam.status" placeholder="请选择" class="tablePageQueryCss">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option value="1">正常</a-select-option>
                    <a-select-option value="2">冻结</a-select-option>
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
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <a-button type="primary" icon="download" @click="handleDownloadTempl('用户信息')">下载模板</a-button>
        <a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:add'">添加用户</a-button>
        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">导入</a-button>
        </a-upload>
        <j-third-app-button biz-type="user" :selected-row-keys="selectedRowKeys" syncToApp syncToLocal @sync-finally="onSyncFinally"/>
  <!--      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="delete" @click="batchDel"/>
              删除
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="lock" @click="batchFrozen('2')"/>
              冻结
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="unlock" @click="batchFrozen('1')"/>
              解冻
            </a-menu-item>

          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
  <!--      <j-super-query :fieldList="superQueryFieldList" @handleSuperQuery="handleSuperQuery"/>-->
      </div>
    </div>



    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
<!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
       <template slot="username" slot-scope="text,record">
          <a @click="handleShowOrg(record)">{{ text }}</a>
       </template>
        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>
        <template slot="person" slot-scope="text,record">
         {{ text==1?"是":"否" }}
        </template>
        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleEdit(record)" v-has="'user:edit'"><a-icon type="edit" class="activeLogoCss"/></span>
          <a-dropdown>
            <span class="ant-dropdown-link">
              <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
            </span>
            <a-menu slot="overlay">
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
                <a-popconfirm title="确定重置密码吗?" @confirm="() => resetPassword(record.id,1,record.username)">
                  <a>重置密码</a>
                </a-popconfirm>
              </a-menu-item>
<!--              <a-menu-item>-->
<!--                <a href="javascript:;" @click="handleAgentSettings(record.username)">代理人</a>-->
<!--              </a-menu-item>-->

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>
    <organization ref="organization"></organization>
  </a-card>
</template>

<script>
  import Organization from '@/views/user/Organization'
  import UserModal from './modules/UserModal'
  import PasswordModal from './modules/PasswordModal'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import JInput from '@/components/jeecg/JInput'
  import UserRecycleBinModal from './modules/UserRecycleBinModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery'
  import JThirdAppButton from '@/components/jeecgbiz/thirdApp/JThirdAppButton'
  import {frozenBatch,resetPasswordBatch} from '@/api/api'

  export default {
    name: "leaveList",
    mixins: [JeecgListMixin],
    components: {
      JThirdAppButton,
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      JInput,
      UserRecycleBinModal,
      JSuperQuery,
      Organization
    },
    data() {
      return {
        description: '这是用户管理页面',
        queryParam: {
          userStatus:3
        },
        recycleBinVisible: false,
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
          {
            title: '工号',
            dataIndex: 'workNo',
          },
          {
            title: '用户账号',
            dataIndex: 'username',
            slots: { title: 'username' },
            scopedSlots: { customRender: 'username' },
            sorter: true
          },
          {
            title: '用户姓名',
            dataIndex: 'realname',
          },
          // {
          //   title: '头像',
          //   align: "center",
          //   width: 120,
          //   dataIndex: 'avatar',
          //   scopedSlots: {customRender: "avatarslot"}
          // },
          {
            title: '部门',

            dataIndex: 'orgCodeTxt'
          },
          // {
          //   title: '是否负责人',
          //   dataIndex: 'personType',
          //   scopedSlots: {customRender: 'person'},
          // },
          // {
          //   title: '职级',
          //   dataIndex: 'post'
          // },
          {
            title: '角色',
            dataIndex: 'roleName'
          },
          // {
          //   title: '性别',
          //
          //   dataIndex: 'sex_dictText',
          //   sorter: true
          // },
          // {
          //   title: '生日',

          //   dataIndex: 'birthday'
          // },
          // {
          //   title: '年龄',
          //
          //   dataIndex: 'age'
          // },
          {
            title: '手机号码',

            dataIndex: 'phone'
          },
          // {
          //   title: '城市级别',
          //   dataIndex: 'cityLevel_dictText'
          // },
          // {
          //   title: 'CCC',
          //
          //   dataIndex: 'ccc'
          // },
          // {
          //   title: '状态',
          //
          //   dataIndex: 'status_dictText'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
          }

        ],
        superQueryFieldList: [
          { type: 'input', value: 'username', text: '用户账号', },
          { type: 'input', value: 'realname', text: '用户姓名', },
          { type: 'select', value: 'sex', text: '性别', dictCode: 'sex' },
        ],
        url: {
          syncUser: "/act/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
          downloadTempl: '/sys/common/static/usertemplate/用户导入模板.xls',
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleShowOrg(record){
        // console.log(111,record)
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