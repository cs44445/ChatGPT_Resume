<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="10" :sm="12">
            <a-form-item label="用户名" style="margin-left:8px">
              <a-input placeholder="请输入用户名" v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
             <a-button type="primary" @click="searchQuery" icon="search" style="margin-left: 18px">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" :md="24" :sm="24" style="margin-top: -15px">
      <!--<a-button @click="handleEdit" type="primary" icon="edit" style="margin-top: 16px">用户编辑</a-button>-->
      <!-- <a-button @click="handleAddUserDepart" type="primary" icon="plus">添加已有用户</a-button> -->
      <!-- <a-button @click="handleAdd" type="primary" icon="plus" style="margin-top: 16px">新建用户</a-button> -->

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <!-- <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            取消关联
          </a-menu-item> -->
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
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

        @change="handleTableChange">
<!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
        <template slot="username" slot-scope="text,record">
          <a @click="handleDetail(record)">{{ text }}</a>
        </template>
        <template slot="person" slot-scope="text,record">
          {{ text==1?"是":"否" }}
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)"><a-icon type="edit"/> 编辑</a>

          <!-- <a-divider type="vertical"/>

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定取消与选中团队关联吗?" @confirm="() => handleDelete(record.id)">
                  <a>取消关联</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>
    <bus-user-modal ref="userModalForm" @ok="modalFormOk"></bus-user-modal>
    <My-Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></My-Select-User-Modal>
    <dept-role-user-modal ref="deptRoleUser"></dept-role-user-modal>
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction, postAction, deleteAction} from '@/api/manage'
  import MySelectUserModal from '../../system/modules/MySelectUserModal'
  import UserModal from '../../system/modules/UserModal'
  import DeptRoleUserModal from '../../system/modules/DeptRoleUserModal'
  import BusUserModal from './BusUserModal'

  export default {
    name: "DeptUserInfo",
    mixins: [JeecgListMixin],
    components: {
      DeptRoleUserModal,
      MySelectUserModal,
      UserModal,
      BusUserModal
    },
    data() {
      return {
        description: '用户信息',
        currentDeptId: '',
        currentDept: {},
        // 表头
        columns: [{
            title: '用户名',
            dataIndex: 'username',
            slots: { title: 'username' },
            scopedSlots: { customRender: 'username' },
          },
          {
            title: '姓名',
            dataIndex: 'realname'
          },
          {
            title: '单位',
            dataIndex: 'orgCode'
          },
          {
            title: '是否负责人',
            dataIndex: 'personType',
            scopedSlots: {customRender: 'person'},
          },
          {
            title: '性别',
            dataIndex: 'sex_dictText'
          },
          {
            title: '电话',
            dataIndex: 'phone'
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   scopedSlots: {customRender: 'action'},
          //   width: 150
          // }
        ],
        url: {
          list: "/sys/user/departUserList",
          edit: "/sys/user/editSysDepartWithUser2",
          delete: "/sys/user/deleteUserInDepart",
          deleteBatch: "/sys/user/deleteUserInDepartBatch",
        }
      }
    },
    created() {
    },

    methods: {
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
      },
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        //if (this.currentDeptId === '') return;
        let params = this.getQueryParams();//查询条件
        params.depId = this.currentDeptId;
        getAction(this.url.list, params).then((res) => {
          if (res.success && res.result) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
        })
      },
      batchDel: function () {

        if (!this.url.deleteBatch) {
          this.$message.error("请设置url.deleteBatch属性!")
          return
        }
        if (!this.currentDeptId) {
          this.$message.error("未选中任何单位，无法取消单位与用户的关联!")
          return
        }

        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var ids = "";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
          var that = this;
          console.log(this.currentDeptId);
          this.$confirm({
            title: "确认取消",
            content: "是否取消用户与选中团队的关联?",
            onOk: function () {
              deleteAction(that.url.deleteBatch, {depId: that.currentDeptId, userIds: ids}).then((res) => {
                if (res.success) {
                  that.$message.success("删除用户与选中单位关系成功！");
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
      handleDelete: function (id) {
        if (!this.url.delete) {
          this.$message.error("请设置url.delete属性!")
          return
        }
        if (!this.currentDeptId) {
          this.$message.error("未选中任何单位，无法取消单位与用户的关联!")
          return
        }

        var that = this;
        deleteAction(that.url.delete, {depId: this.currentDeptId, userId: id}).then((res) => {
          if (res.success) {
            that.$message.success("删除用户与选中单位关系成功！");
            if (this.selectedRowKeys.length>0){
               for(let i =0; i<this.selectedRowKeys.length;i++){
                   if (this.selectedRowKeys[i] == id){
                     this.selectedRowKeys.splice(i,1);
                     break;
                   }
               }
            }
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      open(record) {
        //console.log(record);
        this.currentDeptId = record.id;
        this.currentDept = record;
        this.loadData(1);
      },
      clearList() {
        this.currentDeptId = '';
        this.dataSource = [];
      },
      hasSelectDept() {
        if (this.currentDeptId == '') {
          this.$message.error("请选择一个单位!")
          return false;
        }
        return true;
      },
      handleAddUserDepart() {
        if (this.currentDeptId == '' ) {
          this.$message.error("请选择一个单位!")
        } else {
          this.$refs.selectUserModal.visible = true;
        }
      },
      handleEdit: function (record) {
        this.$refs.userModalForm.title = "编辑";
        this.$refs.userModalForm.departDisabled = true;
        this.$refs.userModalForm.disableSubmit = false;
        this.$refs.userModalForm.edit(record);
      },
      handleAdd: function () {
        if (this.currentDeptId == '') {
          this.$message.error("请选择一个单位!")
        } else {
          this.$refs.userModalForm.departDisabled = true;
          //初始化负责团队
          this.$refs.userModalForm.nextDepartOptions=[{value:this.currentDept.key,label:this.currentDept.title}]
          this.$refs.userModalForm.title = "添加";
          this.$refs.userModalForm.edit({activitiSync:'1',userIdentity:1,selecteddeparts:this.currentDeptId})
        }
      },
      selectOK(data) {
        let params = {};
        params.depId = this.currentDeptId;
        params.userIdList = [];
        for (var a = 0; a < data.length; a++) {
          params.userIdList.push(data[a]);
        }
        console.log(params);
        postAction(this.url.edit, params).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      handleDeptRole(record){
        if(this.currentDeptId != ''){
          this.$refs.deptRoleUser.add(record,this.currentDeptId);
          this.$refs.deptRoleUser.title = "单位角色分配";
        }else{
          this.$message.warning("请先选择一个单位!");
        }
      }
    }
  }
</script>
<style scoped>

  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }

  /* .ant-card {
    margin-left: -30px;
    margin-right: -30px;
  } */

  .table-page-search-wrapper {
    margin-top: -16px;
    margin-bottom: 16px;
  }
</style>