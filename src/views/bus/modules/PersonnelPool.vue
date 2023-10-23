<template>
    <div class="box-dist">
        <a-row type="flex">
            <a-col :span="16">
                <div style="display: flex;align-items: center;">
                    <span style="font-size: 18px;font-weight: bold;margin-right: 20px;">人员</span>
                    <a-form-model layout="inline" :model="formInline">
                        <a-form-model-item>
                            <a-input v-model="formInline.user" placeholder="搜索人员姓名或工号"  class="tablePageQueryCss">

                            </a-input>
                        </a-form-model-item>
                        <a-form-model-item>
                            <a-button
                                icon="search"  class="btnCss" @click="handleSubmit"
                            >
                                搜索
                            </a-button>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-col>
            <a-col :span="8" style="text-align: right;">
                <a-popconfirm title="确定删除吗?" @confirm="() => delMore()" v-has="'person:operate'">
                    <a-button  class="btnCss" style="margin-right: 20px;" >
                        批量删除
                    </a-button>
                </a-popconfirm>
                <a-button icon="plus" type="primary" @click="handleAddPersonnel()" v-has="'person:operate'">
                    添加人员
                </a-button>
            </a-col>
        </a-row>
        <a-radio-group v-model="employeeType" style="margin-top:30px;" @change="onChangeRadio">
            <a-radio-button value="1">
                内部员工
            </a-radio-button>
            <a-radio-button value="2">
                外部员工
            </a-radio-button>
        </a-radio-group>
        <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns" size="small"
        :data-source="data" rowKey="id"
        :scroll="{x:true}"
        class="j-table-force-nowrap"
        style="margin-top: 30px;"
        >
            <template slot="userName" slot-scope="text,record">
                <a @click="handleShowOrg(record)">{{ text }}</a>
            </template>
            <template slot="workNo" slot-scope="text,record">
                <a @click="handleShowOrg(record)">{{ text }}</a>
            </template>
            <template slot="userTitleInfo" slot-scope="text,record">
                <a-popover  placement="bottom"  :overlayStyle="{width:'13%'}"  v-if="record.userTitleInfo2.length>0">
                    <template slot="content">
                        <a-tag :color="color16()" v-for="item in record.userTitleInfo2" :key="item">
                          {{ item }}
                        </a-tag>
                    </template>
                    <a-tag :color="color16()" v-for="item in record.userTitleInfo1" :key="item">
                      {{ item }}
                    </a-tag>
                </a-popover >
                <a-tag :color="color16()" v-for="item in record.userTitleInfo1" :key="item" v-else>
                    {{ item }}
                </a-tag>
            </template>
            <template slot="userMilepostInfo" slot-scope="text,record">
                <a-popover  placement="bottom"  :overlayStyle="{width:'13%'}"  v-if="record.userMilepostInfo2.length>0">
                    <template slot="content">
                        <a-tag :color="getcolor(item.value)" v-for="item in record.userMilepostInfo2" :key="item">
                          {{ item.milepostName }}
                        </a-tag>
                    </template>
                    <a-tag :color="getcolor(item.value)" v-for="item in record.userMilepostInfo1" :key="item">
                      {{ item.milepostName }}
                    </a-tag>
                </a-popover >
                <a-tag :color="getcolor(item.value)" v-for="item in record.userMilepostInfo1" :key="item" v-else>
                      {{ item.milepostName }}
                </a-tag>
            </template>
           <template slot="statusText" slot-scope="text">
            <a-tag color="#5ED895" v-if="text == 2">
                申请中
            </a-tag>
            <a-tag color="#AAAAAA" v-else-if="text == 3">
                离职
            </a-tag>
             <a-tag color="#F7CD5A" v-else>
               正常
             </a-tag>
            </template>
            <span slot="action" slot-scope="text, record" v-has="'person:operate'" v-if="record.deleteFlag != '1' && record.type != null">
                <span @click="handleEdit(record)" style="margin-right: 10px;">
                    <a-icon type="edit" class="activeLogoCss" />
                </span>
                <a-dropdown>
                    <span class="ant-dropdown-link">
                        <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
                    </span>
                    <a-menu slot="overlay">
                        <a-menu-item>
                            <a-popconfirm title="确定签入吗?" @confirm="() => signInOrOut(1,record.userId)">
                                签入
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item>
                            <a-popconfirm title="确定签出吗?" @confirm="() => signInOrOut(2,record.userId)">
                                签出
                            </a-popconfirm>
                        </a-menu-item>
                        <a-menu-item>                            
                            <a-popconfirm title="确定删除吗?" @confirm="() => del(record.userId)">
                                删除
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>
        </a-table>
        <bus-personnel ref="busPersonnel" @handleList="getCurrentUser"></bus-personnel>
        <organization ref="organization"></organization>
        <editPersonPoolForm ref="editPersonPoolForm" @handleList="getCurrentUser"></editPersonPoolForm>
    </div>
</template>
<script>
import Organization from '@/views/user/Organization'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction, getAction } from '@/api/manage'
import BusPersonnel from './BusPersonnel.vue'
import editPersonPoolForm from '../modules/editPersonPoolForm.vue'
export default {
    mixins: [JeecgListMixin, mixinDevice],
    props: {
        projectId: {
          type: String
        },
        projectDetails:{
            type: Object,
            required: false,
            default: ()=>{}
        },
    },

    components:{BusPersonnel,Organization,editPersonPoolForm},
    data(){
        return{
            formInline:{
                user:''
            },
            selectedRowKeys: [],
            columns:[
                {
                    title: '姓名',
                    dataIndex: 'userName',
                    scopedSlots: { customRender: 'userName' }
                },
                {
                    title: '工号',
                    dataIndex: 'workNo',
                    scopedSlots: { customRender: 'workNo' }
                },
                {
                    title: '职位',
                    dataIndex: 'roleName',
                },
                {
                    title: '部门',
                    dataIndex: 'departName',
                },
                {
                    title: '职位(客户)',
                    dataIndex: 'customWorkerPost',
                },
                {
                    title: '价格(客户)',
                    dataIndex: 'customWorkerPrice',
                },
                {
                    title: '别名',
                    dataIndex: 'alias',
                },
                {
                    title: '签入日期',
                    dataIndex: 'inductionTime',
                },
                {
                    dataIndex: 'userStatus',
                    title: '状态',
                    scopedSlots: { customRender: 'statusText' }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 120,
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            data:[],
            url:{
                list:'/bus/busProjectUser/queryByProjectId',
                addAndDel:'/bus/busProjectUser/addAndDel',
                updateCheckStatusByUserId:'/bus/busProjectUser/updateCheckStatusByUserId',
                deleteProjectUser:'bus/busProjectUser/deleteProjectUser',
                deleteProjectUserList:'bus/busProjectUser/deleteProjectUserList'
            },
            selectedRowsId:[],
            employeeType:'1'
        }
    },
    watch: {
      projectId: function() {
        this.getCurrentUser(1)
      }
    },
    mounted(){
        this.getCurrentUser(1)
    },
    methods:{
        signInOrOut(checkStatus,userId){
            console.log(checkStatus,userId)
            let params = {
                userId,
                checkStatus,
                projectId:this.projectId
            }
           postAction(this.url.updateCheckStatusByUserId,params).then(res=>{
              if(res.success){
                this.$message.success(res.result)
                this.getCurrentUser(this.employeeType)
              }else{
                this.$message.warning(res.result)
              }
           })
        },
        onChangeRadio(e) {
          console.log(`checked = ${e.target.value}`);
          this.employeeType = e.target.value
          this.getCurrentUser(this.employeeType)
          this.selectedRowsId = []
          this.selectedRowKeys = []
          if(e.target.value == '1'){
            this.columns=[
                {
                    title: '姓名',
                    dataIndex: 'userName',
                    scopedSlots: { customRender: 'userName' }
                },
                {
                    title: '工号',
                    dataIndex: 'workNo',
                    scopedSlots: { customRender: 'workNo' }
                },
                {
                    title: '职位',
                    dataIndex: 'roleName',
                },
                {
                    title: '部门',
                    dataIndex: 'departName',
                },
                {
                    title: '职位(客户)',
                    dataIndex: 'customWorkerPost',
                },
                {
                    title: '价格(客户)',
                    dataIndex: 'customWorkerPrice',
                },
                {
                    title: '别名',
                    dataIndex: 'alias',
                },
                {
                    title: '签入日期',
                    dataIndex: 'inductionTime',
                },
                {
                    dataIndex: 'userStatus',
                    title: '状态',
                    scopedSlots: { customRender: 'statusText' }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 120,
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ]
          }else{
            this.columns=[
                {
                    title: '姓名',
                    dataIndex: 'userName',
                    scopedSlots: { customRender: 'userName' }
                },
                {
                    title: '工号',
                    dataIndex: 'workNo',
                    scopedSlots: { customRender: 'workNo' }
                },
                {
                    title: '职位',
                    dataIndex: 'roleName',
                },
                {
                    title: '部门',
                    dataIndex: 'departName',
                },
                {
                    dataIndex: 'userStatus',
                    title: '状态',
                    scopedSlots: { customRender: 'statusText' }
                },
            ]
          }
        },
        handleShowOrg(record){
            console.log(111,record)
            this.$refs.organization.userId=record.userId
            this.$refs.organization.visible=true
            this.$refs.organization.handlePersonalSummary()
        },
        handleEdit(record){
            this.$refs.editPersonPoolForm.visible = true
            this.$refs.editPersonPoolForm.projectData = JSON.parse(JSON.stringify(this.projectDetails))
            this.$refs.editPersonPoolForm.getProjectCodeList(this.projectDetails.projectCode)
            this.$refs.editPersonPoolForm.userId = record.userId
        },
        handleAddPersonnel() {
            // console.log(this.projectDetails.principal,'this.projectDetails.principal',JSON.parse(JSON.stringify(this.projectDetails)) )
            this.$refs.busPersonnel.visible = true
            this.$refs.busPersonnel.projectData = JSON.parse(JSON.stringify(this.projectDetails))
            this.$refs.busPersonnel.getAllUser(this.projectId)
            this.$refs.busPersonnel.getCurrentDepartUser(this.projectId, this.projectDetails.principal)
            this.$refs.busPersonnel.getCommonUsers(this.projectId)
            this.$refs.busPersonnel.rightData = []
        },
        handleSubmit(){
            this.getCurrentUser(this.employeeType)
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            let ids = []
            selectedRows.forEach(i=>{
                ids.push(i.userId)
            })
            this.selectedRowsId = ids
            this.selectedRowKeys = selectedRowKeys
        },
        getcolor(value){
            return value == '3' ? '#D92929' : (value == '1'?'#0467F1':'#F2B202')
        },
        color16(){//十六进制颜色随机
            let arr = [];
            for (var i = 0; i < 3; i++) {
                // 暖色
                arr.push(Math.floor(Math.random() * 128 + 64));
                // 亮色
                arr.push(Math.floor(Math.random() * 128 + 128));
            }
            let [r, g, b] = arr;
            // rgb颜色
            // var color=`rgb(${r},${g},${b})`;
            // 16进制颜色
            var color = `#${r.toString(16).length > 1 ? r.toString(16) : 'b' +
             r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : 'a' +
              g.toString(16)}${b.toString(16).length > 1 ? b.toString(16) : 'd' + b.toString(16)}`;
            return color;
        },
        getCurrentUser(type){
            if(!this.projectId){
                return
            }
            getAction(this.url.list,{projectId:this.projectId,title:this.formInline.user,type:type}).then(res=>{
                if(res.success){
                    res.result.forEach(y=>{
                        if(y.userTitleInfo){
                            y.userTitleInfo1= y.userTitleInfo.length>3 ? y.userTitleInfo.slice(0,3):y.userTitleInfo
                            y.userTitleInfo2= y.userTitleInfo.length>3 ? y.userTitleInfo.slice(3,y.userTitleInfo.length):[]
                        }

                        // console.log(newArr.length>3,y.userTitleInfo1)
                    })
                    res.result.forEach(y=>{
                        if(y.userMilepostInfo){
                           y.userMilepostInfo1=y.userMilepostInfo.length>3 ? y.userMilepostInfo.slice(0,3):y.userMilepostInfo
                           y.userMilepostInfo2=y.userMilepostInfo.length>3 ? y.userMilepostInfo.slice(3,y.userMilepostInfo.length):[]
                        }

                        // console.log(newArr1.length>3,y.userMilepostInfo1)
                    })

                    this.data = res.result
                    // console.log(res.result,'this.projectId===',this.projectId)
                }
            })
        },
        del(userId){
            let params = {
                projectId:this.projectId,
                // type:type,
                userId
            }
            postAction(this.url.deleteProjectUser,params).then(res=>{
                if(res.success){
                    this.getCurrentUser(this.employeeType)
                    this.$message.success(res.message)
                }else{
                    this.$message.warning(res.message)
                }
            })
        },
        delMore(){
            if(this.selectedRowKeys.length==0){
                this.$message.warning("请选择要删除的人员")
                return
            }
            let params = {
                projectId:this.projectId,
                // type:type,
                userIds:this.selectedRowsId
            }
            postAction(this.url.deleteProjectUserList,params).then(res=>{
                if(res.success){
                    this.getCurrentUser(this.employeeType)
                    this.$message.success(res.message)
                }else{
                    this.$message.warning(res.message)
                }
            })
        }
    }
}
</script>
<style scoped>
::v-deep .ant-checkbox-inner{
  background-color: #F7F8FA;
}
::v-deep .ant-checkbox-checked .ant-checkbox-inner{
    background-color: #CC148A;
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
::v-deep .ant-table-thead tr{
  height: 50.5px !important;
}
@media screen and (max-width: 1440px) {
    .box-dist{
        padding: 0 12px;
    }
}

@media screen and (min-width: 1441px) {
    .box-dist{
        padding: 0 24px;
    }
}
::v-deep .ant-radio-button-wrapper, ::v-deep .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
    background: #F7F8FA;
}
.activeLogoCss:hover {
  cursor: pointer;
}
</style>