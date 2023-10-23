<template>
  <j-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    switchFullscreen
    wrapClassName="my-user-select-modal"
    @ok="handleSubmit"
    @cancel="close"
    style="top:50px"
    cancelText="关闭"
  >
    <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false">
          <!--组织机构-->
          <a-directory-tree
            :show-line="false"
            :show-icon="false"
            selectable
            :selectedKeys="selectedDepIds"
            :checkStrictly="true"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
            :expandAction="false"
            :expandedKeys.sync="expandedKeys"
            @select="onDepSelect"
          >
          <a-icon slot="switcherIcon" type="down" />
          <!-- <img src="@/assets/dot2.png" slot="child" style="margin-right: 0px;" width="10px" /> -->
          <!-- <a-icon slot="smile" type="team" /> -->
          <!-- <a-icon slot="child" type="team" /> -->
          <!-- <a-icon slot="switcherIcon" type="down" /> -->
          </a-directory-tree>
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form layout="inline"  @keyup.enter.native="searchQuery">
              <a-row :gutter="24">

                <a-col :span="10">
                <a-form-item label="用户名">
                  <a-input placeholder="请输入用户名" v-model="queryParam.username"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                      <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                        <a-button type="primary" @click="onSearch" icon="search">查询</a-button>
                        <a-button type="primary" @click="searchReset(1)" icon="reload" style="margin-left: 8px">重置</a-button>
                      </span>
              </a-col>

              </a-row>
            </a-form>
          </div>

          <!-- 用户名:
          <a-input-search
            :style="{width:'150px',marginBottom:'15px'}"
            placeholder="请输入用户名"
            v-model="queryParam.realname"
            @search="onSearch"
          ></a-input-search>
          <a-button @click="searchReset(1)" style="margin-left: 20px" icon="redo">重置</a-button> -->
          <!--用户列表-->
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
            :loading="loading"
            @change="handleTableChange">
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </j-modal>
</template>

<script>
  import { pushIfNotExist, filterObj } from '@/utils/util'
  import {queryDepartTreeLists, getUserList, queryUserByDepId} from '@/api/api'
  import { getAction } from '@/api/manage'

  export default {
    name: 'JSelectUserByDepModal',
    components: {},
    props: ['modalWidth', 'multi', 'userIds'],
    data() {
      return {
        queryParam: {
          username: "",
        },
        columns: [
          {
            title: '用户名',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'realname'
          },
          {
            title: '性别',
            align: 'center',
            dataIndex: 'sex',
            customRender: function (text) {
              if (text === 1) {
                return '男'
              } else if (text === 2) {
                return '女'
              } else {
                return text
              }
            }
          },
          {
            title: '手机',
            align: 'center',
            dataIndex: 'phone'
          },
          {
            title: '团队',
            align: 'center',
            dataIndex: 'orgCodeTxt'
          }
        ],
        scrollTrigger: {},
        dataSource: [],
        selectionRows: [],
        selectedRowKeys: [],
        selectUserRows: [],
        selectUserIds: [],
        title: '根据团队选择用户',
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        selectedDepIds: [],
        departTree: [],
        visible: false,
        form: this.$form.createForm(this),
        loading: false,
        expandedKeys: [],
      }
    },
    computed: {
      // 计算属性的 getter
      getType: function () {
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
      userIds: {
        immediate: true,
        handler() {
          this.initUserNames()
        }
      },
    },
    created() {
      // 该方法触发屏幕自适应
      this.resetScreenSize();
      this.loadData()
    },
    methods: {
      initUserNames() {
        if (this.userIds) {
          // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
          let values = this.userIds.split(',') + ','
          getUserList({
            id: values,
            pageNo: 1,
            pageSize: values.length
          }).then((res) => {
            if (res.success) {
              this.selectionRows = []
              let selectedRowKeys = []
              let realNames = []
              res.result.records.forEach(user => {
                realNames.push(user['realname'])
                selectedRowKeys.push(user['id'])
                this.selectionRows.push(user)
              })
              this.selectedRowKeys = selectedRowKeys
              this.$emit('initComp', realNames.join(','))
            }
          })
        } else {
          // JSelectUserByDep组件bug issues/I16634
          this.$emit('initComp', '')
        }
      },
      async loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams()//查询条件
        if(!params.departId){
          params.pageNo = 1;
          params.pageSize = 9999;
        }
        this.loading = true
        getAction('/sys/user/queryUserComponentData', params).then(res=>{
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 触发屏幕自适应
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal() {
        this.visible = true;
        this.queryDepartTree();
        this.initUserNames()
        // this.loadData();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.departId = this.selectedDepIds.join(',')
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        that.selectedRowKeys = [];
        that.selectUserIds = [];
        // that.selectedDepIds = [];
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
      },
      close() {
        this.searchReset(0);
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleSubmit() {
        let that = this;
        this.getSelectUserRows();
        that.$emit('ok', that.selectUserRows, that.selectUserIds);
        that.searchReset(0)
        that.close();
      },
      //获取选择用户信息
      getSelectUserRows() {
        this.selectUserRows = []
        for (let row of this.selectionRows) {
          if (this.selectedRowKeys.includes(row.id)) {
            this.selectUserRows.push(row)
          }
        }
        this.selectUserIds = this.selectUserRows.map(row => row.id).join(',')
      },
      // 点击树节点,筛选出对应的用户
      onDepSelect(selectedDepIds) {
        if (selectedDepIds[0] != null) {
          if (this.selectedDepIds[0] !== selectedDepIds[0]) {
            this.selectedDepIds = [selectedDepIds[0]];
          }
          this.loadData(1);
        }
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        selectionRows.forEach(row => pushIfNotExist(this.selectionRows, row, 'id'))
      },
      onSearch() {
        this.loadData(1);
      },
      // 根据选择的id来查询用户信息
      initQueryUserByDepId(selectedDepIds) {
        this.loading = true
        return queryUserByDepId({id: selectedDepIds.toString()}).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
            this.ipagination.total = res.result.length;
          }
        }).finally(() => {
          this.loading = false
        })
      },
      queryDepartTree() {
        let that = this
        queryDepartTreeLists().then((res) => {
          if (res.success) {
            that.departTree = res.result;

            that.dataSource = []
            that.ipagination.total = 0

            that.selectedDepIds = [res.result[0].id];
            that.loadData();
            // 默认展开父节点
            that.expandedKeys = that.departTree.map(item => item.id)
          }
        })
      },
      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style lang="less" scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }

  /** 隐藏文件小图标 */
  .template-5-tree.ant-tree {
    li span.ant-tree-switcher.ant-tree-switcher-noop {
      display: none;
    }
  }
  /deep/ .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-switcher, .ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-switcher {
    color: #996c6c;
  }

  /deep/ .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-switcher, .ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-switcher {
    color: #996c6c;
  }
</style>