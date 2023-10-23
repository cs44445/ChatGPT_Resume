<template>
    <div>
        <a-modal
            title="添加人员池"
            :visible="visible"
            :confirm-loading="confirmLoading"
            :width="1350"
            @ok="handleOk"
            @cancel="handleCancel"
            >

            <div style="display:flex;justify-content: space-between;">
                <div style="position: relative;width: 65%;">
                    <div style="display:flex;align-items: center;justify-content: space-between;">
                        <span style="font-size: 16px;font-weight: bold;">全部人员{{ ' ' +leftData.length }}</span>
                        <div>
                          <!-- <a-button>
                            <a-checkbox @change="onChangeCHLeft" style="margin-right: 5px;"  :checked="checkAll">
                            </a-checkbox>全选
                          </a-button> -->
                          <a-button @click="handleCloseCHLeft"  style="margin-left: 10px;">
                            选中{{ selectedRowKeys.length }}<a-icon type="close" />
                          </a-button>
                        </div>

                    </div>
                    <div class="divcss leftcss">
                        <div style="display:flex;justify-content: space-between;padding: 15px;">
                            <a-radio-group v-model="radioValue" @change="onChangeTabs">
                                <a-radio-button value="a">
                                全部人员
                                </a-radio-button>
                                <a-radio-button value="b">
                                本部门
                                </a-radio-button>
                                <a-radio-button value="c">
                                常用
                                </a-radio-button>
                            </a-radio-group>
                            <a-input  placeholder="请输入姓名或工号" style="width:300px;"
                                @change="onSearch" icon="search"
                                v-model="serValue"
                                class="tablePageQueryCss" />
                        </div>
                        <a-table
                        :columns="leftColumns"  :pagination="false" size="small" :scroll="{ x: true,y: 400 }"
                        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange,onSelectAll:onSelectAllleft}"
                        :data-source="leftData">
                        </a-table>
                    </div>
                </div>
                <div style="display:flex;flex-direction: column;margin-top: 18%;">
                    <a-button  icon="right" style="margin-bottom:15px;" @click="addAndDel(1)"/>
                    <a-button  icon="left"  @click="addAndDel(2)"/>
                </div>

                <div style="width: 30%;">
                    <div style="display:flex;align-items: center;justify-content: space-between;">
                        <span style="font-size: 16px;font-weight: bold;">已选员工{{ ' ' +rightData.length }}</span>
                        <div>
                          <!-- <a-button>
                            <a-checkbox @change="onChangeCHLeft" style="margin-right: 5px;"  :checked="checkAll">
                            </a-checkbox>全选
                          </a-button> -->
                          <a-button @click="handleCloseCHRight"  style="margin-left: 10px;">
                            选中{{ rightSelectedRowKeys.length }}<a-icon type="close" />
                          </a-button>
                        </div>
                    </div>
                    <div  class="divcss rightcss">
                        <a-table
                        :columns="rightColumns"  :pagination="false" size="small" :scroll="{ x: true,y: 400 }"
                        :rowSelection="{selectedRowKeys: rightSelectedRowKeys, onChange: onChange1}"
                        :data-source="rightData">

                          <template slot="statusText" slot-scope="text,record">
                            <a-tag color="#5ED895" v-if="text == 2">
                                申请中
                            </a-tag>
                            <a-tag color="#F7CD5A" v-else>
                                正常
                            </a-tag>
                          </template>
                        </a-table>
                    </div>
                </div>

            </div>
            <template slot="footer">
              <a-button @click="handleCancel">关闭</a-button>
            </template>
        </a-modal>
    </div>
  </template>
  <script>
  import difference from 'lodash/difference';
  import { postAction, getAction } from '@/api/manage'
  const leftTableColumns = [
    {
      title: '姓名',
      dataIndex: 'realname',
      width:'100px',
      // fixed:'left'
    },
    {
      title: '工号',
      dataIndex: 'workNo',
      width:'90px',
    },
    {
      title: '职位',
      dataIndex: 'roleName',
      width:'200px',
    },
    {
        title: '部门',
        dataIndex: 'orgCodeTxt',
        width:'120px',
    },
    {
        title: '电话',
        dataIndex: 'phone',
        width:'120px',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        width:'250px',
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: 'userName',
      title: '姓名',
      width:'100px',
    },
    {
      dataIndex: 'roleName',
      title: '职位',
      width:'200px',
    },
    {
      dataIndex: 'status',
      title: '状态',
      width:'100px',
      scopedSlots: { customRender: 'statusText' }
    },
  ];

  export default {
    data() {
      return {
        leftColumns: leftTableColumns,
        rightColumns: rightTableColumns,
        visible:false,
        confirmLoading: false,
        radioValue: 'a',
        // leftData:[],
        rightData:[],
        url:{
            getAllUser:'/sys/user/queyAllUserAndDepart',
            getCurrentDepartUser:'/sys/user/queyCurrentUserAndDepart',
            commonUsers:'/bus/busProjectUser/queryCommonUser',
            addAndDel:'/bus/busProjectUser/addAndDel',
            queryByProjectId:'/bus/busProjectUser/queryByProjectId'
        },
        userTable:[],
        currentDepartUserTable:[],
        commonUsersTable:[],
        userTableId:[],
        currentDepartUserTableId:[],
        commonUsersTableId:[],
        projectData:'',
        selectedRowsId:'',
        selectedRowKeys:[],
        rightSelectedRowKeys:[],
        serValue:'',
        tagvisible1: true,
        tagvisible2: true,
        // leftSelectedRowKeys:[],
        checkAll:false
      };
    },
    computed: {
        leftData(){
           if(this.radioValue == 'a'){
             return  this.userTable
           }else if(this.radioValue == 'b'){
             return  this.currentDepartUserTable
           }else{
             return this.commonUsersTable
           }
        },
        leftSelectedRowKeys(){
          if(this.radioValue == 'a'){
             return  this.userTableId
           }else if(this.radioValue == 'b'){
             return  this.currentDepartUserTableId
           }else{
             return this.commonUsersTableId
           }
        }
    },
    methods: {
        onSelectAllleft(selected, selectedRows, changeRows) {
            this.checkAll = selected
            console.log(selected, selectedRows, changeRows,'全选---------');
        },
        onChangeCHLeft(e){
          this.checkAll = e.target.checked
          this.selectedRowKeys = e.target.checked ?  this.leftSelectedRowKeys : []
          console.log(e.target.checked,'e.target.checked',this.leftSelectedRowKeys,'this.leftSelectedRowKeys')
          console.log(this.selectedRowKeys,'this.selectedRowKeys------11---------this.selectedRowKeys')
        },
        handleCloseCHLeft(){
          this.selectedRowKeys=[]
          this.selectedRowsId = []
          this.checkAll = false
        },
        handleCloseCHRight(){
          this.rightSelectedRowKeys=[]
          this.selectedRowsId = []
          // this.checkAll = false
        },
        onChange1(selectedRowKeys, selectedRows) {
            let ids = []
            selectedRows.forEach(i=>{
                ids.push(i.userId)
            })
            this.selectedRowsId = ids
            this.rightSelectedRowKeys = selectedRowKeys
            console.log(ids.join(','), 'selectedRows: ', selectedRows);
        },
        onChange(selectedRowKeys, selectedRows) {
            let ids = []
            selectedRows.forEach(i=>{
                ids.push(i.id)
            })
            this.selectedRowsId = ids
            this.selectedRowKeys = selectedRowKeys
            this.leftSelectedRowKeys = selectedRowKeys
            console.log(this.selectedRowsId, 'selectedRows: ',selectedRows);
        },
        //所有人
      getAllUser(id){
        getAction(this.url.getAllUser,{projectId:id,title:this.serValue}).then(res=>{
            if(res.success){
              this.userTableId = []
                res.result.forEach(i=>{
                  i.checked = false
                  this.userTableId.push(i.id)
                })
                this.userTable = res.result
            }

        })
      },
    //   本部门
      getCurrentDepartUser(projectId,userId){
        getAction(this.url.getCurrentDepartUser,{projectId:projectId,userId:userId,title:this.serValue}).then(res=>{
            if(res.success){
              this.currentDepartUserTableId = []
                res.result.forEach(i=>{
                  i.checked = false
                  this.currentDepartUserTableId.push(i.id)
                })
                this.currentDepartUserTable = res.result
            }

        })
      },
    //   常用人
      getCommonUsers(projectId,userId){
        getAction(this.url.commonUsers,{projectId:projectId,title:this.serValue}).then(res=>{
            if(res.success){
              this.commonUsersTableId = []
                res.result.forEach(i=>{
                  i.checked = false
                  this.commonUsersTableId.push(i.id)
                })
                this.commonUsersTable = res.result
            }

        })
      },
      addAndDel(type){
        console.log(type,this.selectedRowKeys)
        if(type == 1){
          if(this.selectedRowKeys.length==0){
            this.$message.warning("请选择要添加的人员")
            return
          }
        }else{
          if(this.rightSelectedRowKeys.length==0){
            this.$message.warning("请选择要移除的人员")
            return
          }
        }

        let params = {
            projectId:this.projectData.id,
            type:type,
            userIds:this.selectedRowsId
        }
        postAction(this.url.addAndDel,params).then(res=>{
            if(res.success){
              this.selectedRowKeys = []
              this.rightSelectedRowKeys = []
              this.getCurrentUser(this.projectData.id)
              this.getAllUser(this.projectData.id)
              this.getCurrentDepartUser(this.projectData.id,this.projectData.principal)
              this.getCommonUsers(this.projectData.id,this.projectData.principal)
              this.$message.success(res.message)
              this.$emit('handleList')
            }else{
                this.$message.warning(res.message)
            }
        })
      },
      //右侧table
      getCurrentUser(projectId){
        getAction(this.url.queryByProjectId,{projectId:projectId}).then(res=>{
           if(res.success){
              this.rightData = res.result
           }
        })
      },
      onSearch(){
        if(this.radioValue == 'a'){
          this.getAllUser(this.projectData.id)
        }else if(this.radioValue == 'b'){
          this.getCurrentDepartUser(this.projectData.id,this.projectData.principal)
        }else{
          this.getCommonUsers(this.projectData.id,this.projectData.principal)
        }
      },
      changeSearch(e){
        console.log(e.target.value)
        if(this.radioValue == 'a'){
          this.getAllUser(this.projectData.id)
        }else if(this.radioValue == 'b'){
          this.getCurrentDepartUser(this.projectData.id,this.projectData.principal)
        }else{
          this.getCommonUsers(this.projectData.id,this.projectData.principal)
        }
      },
      onChangeTabs(e) {
        // console.log(`checked = ${e.target.value}`);
      },
      handleOk(e) {
        this.confirmLoading = true;
        this.selectedRowKeys = []
        this.rightSelectedRowKeys = []
        setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
        }, 500);
      },
      handleCancel(e) {
        this.rightSelectedRowKeys = []
        this.selectedRowKeys = []
        this.visible = false;
      },
    },
  };
  </script>
  <style scoped>
  .divcss{
    margin-top:15px;
    height: 500px;
    border: 1px solid #eeeeee;
    background:#F7F8FA ;
  }
  .leftcss{
    /* width: 43vw; */

  }
  .rightcss{
    /* width: 18vw; */
  }
  .radiusCss{
    display: block;
    width: 6px;
    height: 6px;
    border: 1px solid #3055ba;
    border-radius: 50%;
    background: #3055ba;
    margin-right: 5px;
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
::v-deep .ant-radio-button-wrapper{
  background: #F7F8FA;
}
  </style>
