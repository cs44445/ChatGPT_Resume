<template>
    <div>
        <a-modal
            title="添加人员池"
            :visible="visible"
            :confirm-loading="confirmLoading"
            :width="1750"
            @ok="handleOk"
            @cancel="handleCancel"
            >

            <div style="display:flex;justify-content: space-between;">
                <div style="position: relative;width: 40%;">
                    <div style="display:flex;align-items: center;justify-content: space-between;">
                        <span style="font-size: 16px;font-weight: bold;">全部人员{{ ' ' +leftData.length }}</span>
                        <div>
                          <a-button @click="handleCloseCHLeft"  style="margin-left: 10px;">
                            选中{{ leftSelectedRows.length }}<a-icon type="close" />
                          </a-button>
                        </div>

                    </div>
                    <div class="divcss leftcss">
                        <div style="display:flex;justify-content: space-between;padding: 15px;">
                            <a-radio-group v-model="radioValue" @change="onChangeTabs">
                                <a-radio-button value="a">
                                全部人员
                                </a-radio-button>
                                <!-- <a-radio-button value="b">
                                本部门
                                </a-radio-button>
                                <a-radio-button value="c">
                                常用
                                </a-radio-button> -->
                            </a-radio-group>
                            <a-input  placeholder="请输入姓名或工号" style="width:300px;"
                                @change="onSearch" icon="search"
                                v-model="serValue"
                                class="tablePageQueryCss" />
                        </div>
                        <a-table
                        :columns="leftColumns"  
                        :pagination="false" 
                        size="small" 
                        rowKey="id"
                        :scroll="{ x: true,y: 400 }"
                        :rowSelection="{selectedRowKeys: leftSelectedRowKeys, onChange: onChange}"
                        :data-source="leftData">
                        </a-table>
                    </div>
                </div>
                <div style="display:flex;flex-direction: column;margin-top: 18%;">
                    <a-button  icon="right" style="margin-bottom:15px;" @click="addBtn()"/>
                    <a-button  icon="left"  @click="delBtn()"/>
                </div>

                <div style="width: 55%;">
                    <div style="display:flex;align-items: center;justify-content: space-between;">
                        <span style="font-size: 16px;font-weight: bold;">已选员工{{ ' ' +rightData.length }}</span>
                        <div>
                          <a-button @click="handleCloseCHRight"  style="margin-left: 10px;">
                            选中{{ rightSelectedRows.length }}<a-icon type="close" />
                          </a-button>
                        </div>
                    </div>
                    <div  class="divcss rightcss">
                        <a-table
                        :columns="rightColumns"  
                        :pagination="false" 
                        size="small" 
                        :scroll="{ x: true }"
                        rowKey="id"
                        :rowSelection="{selectedRowKeys: rightSelectedRowKeys, onChange: onChange1}"
                        :data-source="rightData">

                          <template slot="customDutiesName" slot-scope="text,record">
                            <!-- <a-input v-model="record.customDutiesName"></a-input> -->
                              <a-select
                                    placeholder="请选择职位"
                                    v-model="record.customDutiesName"
                                    show-search
                                    :filter-option="filterOption"
                                    :options="customWorkerPost"
                                    allowClear 
                                    :disabled="disableSubmit"
                                    style="width: 100%;"
                                    :getPopupContainer="(target) => target.parentNode">

                                </a-select>
                          </template>
                          <template slot="alias" slot-scope="text,record">
                             <a-input v-model="record.alias"></a-input>
                          </template>
                          <template slot="inductionTime" slot-scope="text,record">
                            <a-date-picker @change="onChangeInductionTime" v-model="record.inductionTime"/>
                          </template>
                        </a-table>
                    </div>
                </div>

            </div>
            <template slot="footer">
              <a-button @click="handleCancel">关闭</a-button>
              <a-button @click="handleSure" type="primary">确定</a-button>
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
      width:'50px',
      // fixed:'left'
    },
    {
      title: '工号',
      dataIndex: 'workNo',
      width:'70px',
    },
    {
      title: '职位',
      dataIndex: 'roleName',
      width:'80px',
    },
    {
        title: '部门',
        dataIndex: 'orgCodeTxt',
        width:'100px',
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: 'realname',
      title: '姓名',
      width:'80px',
    },
    {
      dataIndex: 'roleName',
      title: '职位',
      width:'160px',
    },
    {
      dataIndex: 'customDutiesName',
      title: '职位（客户）',
      width:'100px',
      scopedSlots: { customRender: 'customDutiesName' }
    },
    {
      dataIndex: 'customPrice',
      title: '价格（客户）',
      width:'100px'
    },
    {
      dataIndex: 'alias',
      title: '别名',
      width:'100px',
      scopedSlots: { customRender: 'alias' }
    },
    {
      dataIndex: 'inductionTime',
      title: '签入日期',
      width:'100px',
      scopedSlots: { customRender: 'inductionTime' }
    },
    // {
    //   dataIndex: 'status',
    //   title: '状态',
    //   width:'100px',
    //   scopedSlots: { customRender: 'statusText' }
    // },
  ];
// 定义函数
const isContained = (a, b) => {
    // a和b其中一个不是数组，直接返回false
    if (!(a instanceof Array) || !(b instanceof Array)) return false;
    const len = b.length;
    // a的长度小于b的长度，直接返回false
    if (a.length < len) return false;
    for (let i = 0; i < len; i++) {
        // 遍历b中的元素，遇到a没有包含某个元素的，直接返回false
        if (!a.includes(b[i])) return false;
    }
    // 遍历结束，返回true
    return true;
};

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
            queryByProjectId:'/bus/busProjectUser/queryByProjectId',
            addUserToProject:'/bus/busProjectUser/addUserToProject',
            addUserToProject:'bus/busProjectUser/addUserToProject',
            getCustomDutiesById:'/bus/busCustom/getCustomDutiesById',
            getProjectCodeList:'/bus/busProject/getProjectCodeList',
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
        leftSelectedRows:[],
        rightSelectedRows:[],
        checkAll:false,
        customWorkerPost:[]
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
        // leftSelectedRowKeys(){
        //   if(this.radioValue == 'a'){
        //      return  this.userTableId
        //    }else if(this.radioValue == 'b'){
        //      return  this.currentDepartUserTableId
        //    }else{
        //      return this.commonUsersTableId
        //    }
        // }
    },
    created(){
      this.getProjectCodeList(this.projectData.projectCode)
    },
    methods: {
      getProjectCodeList(projectCode){
        getAction(this.url.getProjectCodeList,{projectCode:projectCode}).then(res=>{
          if(res.success){
            this.handleChangeCustom(res.result.customId)
          }
        })
      },
      handleChangeCustom(id){
          getAction(this.url.getCustomDutiesById,{customId:id}).then(res=>{
            if(res.success){
              let result = res.result
              let dictOptions = []
              for (let i = 0; i < result.length; i++) {
                  let temp = result[i];
                  let item = {}
                  item.label = temp.position_dictText
                  item.value = temp.position_dictText
                  item.hourlyWage = temp.hourlyWage
                  item.position = temp.position
                  dictOptions.push(item);
              }
               this.customWorkerPost = dictOptions
               console.log(this.customWorkerPost,'this.customWorkerPost')
            }
          })
        }, 
      addBtn(){
        this.leftSelectedRows.forEach(i=>{
          this.userTable = this.userTable.filter(item=>item.id != i.id)
          this.currentDepartUserTable = this.currentDepartUserTable.filter(item=>item.id != i.id)
          this.commonUsersTable = this.commonUsersTable.filter(item=>item.id != i.id)
        })
        this.rightData = [...this.rightData,...this.leftSelectedRows]
        this.leftSelectedRows = []
        this.leftSelectedRowKeys = []
        this.getProjectCodeList(this.projectData.projectCode)
      },
      delBtn(){
        this.rightSelectedRows.forEach(i=>{
          this.rightData = this.rightData.filter(item=>item.id != i.id)
        })
        // if(this.radioValue == 'a'){
          this.userTable = [...this.userTable,...this.rightSelectedRows]
        // }else if(this.radioValue == 'b'){
        //   this.currentDepartUserTable = [...this.currentDepartUserTable,...this.rightSelectedRows]
        // }else{
        //   this.commonUsersTable = [...this.commonUsersTable,...this.rightSelectedRows]
        // }
        this.rightSelectedRows = []
        this.rightSelectedRowKeys=[]
        
      },
      handleSure(){
          console.log(this.rightData)
          let params = {
            userList:this.rightData,
            projectId:this.projectData.id
          }
          postAction(this.url.addUserToProject,params).then(res=>{
             if(res.success){
              this.$message.success(res.message)
              this.$emit('handleList')
              this.visible = false;
             }else{
              this.$message.warning(res.message)
             }
          })
      },
      onChangeInductionTime(date, dateString) {
        console.log(date, dateString);
      },
        handleCloseCHLeft(){
          this.leftSelectedRowKeys=[]
          this.leftSelectedRows = []
          this.checkAll = false
        },
        handleCloseCHRight(){
          this.rightSelectedRowKeys=[]
          this.rightSelectedRows = []
        },
        onChange1(selectedRowKeys, selectedRows) {
            let ids = []
            selectedRows.forEach(i=>{
                ids.push(i.userId)
            })
            // this.selectedRowsId = ids
            this.rightSelectedRowKeys = selectedRowKeys
            this.rightSelectedRows = selectedRows
            console.log(selectedRows,'selectedRows----------selectedRows')
        },
        onChange(selectedRowKeys, selectedRows) {
            let ids = []
            selectedRows.forEach(i=>{
                ids.push(i.id)
            })
            // this.selectedRowsId = ids
            // this.selectedRowKeys = selectedRowKeys
            this.leftSelectedRowKeys = selectedRowKeys
            this.leftSelectedRows = selectedRows
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
      filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
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
