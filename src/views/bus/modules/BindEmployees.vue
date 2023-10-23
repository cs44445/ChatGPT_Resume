<template>
    <div>
        <a-modal
        title="绑定员工"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :maskClosable="false"
        >
            <div>
                <a-form-model ref="ruleForm" :model="model" :rules="validatorRules" slot="detail">
                    <a-row>
                        <a-col :span="24">
                            <a-form-model-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="roleName">
                                <a-select
                                    placeholder="请选择角色" disabled
                                    @change="handleRole" v-model="model.roleName"
                                >
                                    <a-select-option v-for="(item, key) in rolesOptions" :key="key" :value="item.id">
                                    {{item.label}}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item label="预估工时(h)" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="estimateHours">
                                <a-input  v-model="model.estimateHours" placeholder="请输入预估工时" disabled></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item label="分配员工" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="roleList">
                                <a-select mode="multiple" v-model="model.roleList" @change="handleUser" placeholder="请选择分配员工">
                                    <a-select-opt-group v-for="item in groubRoleList" :key="item.name" :label="item.name"
                                        class="test">
                                        <a-select-option :value="child.id" v-for="child in item.children" :key="child.id">
                                        <div class="cust-select-sty">
                                            <span :style="{ backgroundColor: bgColor(child.name) }">{{ child.name.substring(0,1)}}</span>
                                            <span>{{ child.name }}</span>
                                            <span>+</span>
                                        </div>
                                        </a-select-option>
                                    </a-select-opt-group>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </a-form-model>
            </div>
        </a-modal>
        <a-modal
          title="警告"
         :visible="warningVisible"
         @ok="handleForceBinding"
         @cancel="handleBackCancel"
         >
            <p style="color:red">{{ msg }}</p>
            <p style="color:red">强制绑定将会导致项目预期收入低于公司标准，并将通知到以下用户</p>
            <a-table :columns="columns" :data-source="data" :pagination="false" size="small">
            </a-table>
            <template slot="footer">
                <a-button @click="handleBackCancel">返回修改</a-button>
                <a-button @click="handleForceBinding" type="primary">强制绑定</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
import { getAction, deleteAction, postAction } from '@/api/manage'
export default {
    name:'BindEmployees',
    data() {
        return {
            visible: false,
            warningVisible:false,
            confirmLoading: false,
            validatorRules:{
                roleName:{ required: true, message: '请选择角色', trigger: 'change' },
                estimateHours:{ required: true, message: '请输入预估工时', trigger: 'blur' },
                roleList:{ required: true, message: '请选择配员工', trigger: 'change' },
            },
            groubRoleList:[],
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 18
            },
            url:{
                milepostRoleList:'bus/busProjectMilepost/milepostRoleList',
                getProjectUserPoolList:'bus/busProjectMilepost/getProjectUserPoolList',
                groubRoleUrl: '/sys/user/queyUserGroubByRoleList1',
                milepostBindingUser:'bus/busProjectMilepost/milepostBindingUser'
            },
            rolesOptions:[],
            assignOptions:[],
            model:{},
            columns:[
                {
                    title: '用户',
                    dataIndex: 'name',
                    key: 'name',
                    scopedSlots: { customRender: 'name' },
                },
                {
                    title: '角色',
                    dataIndex: 'role',
                    key: 'role',
                },
                {
                    title: '部门',
                    dataIndex: 'depart',
                    key: 'depart',
                }
            ],
            data:[],
            msg:'',
            ifForce:0,
            projectId:'',
            milepostId:'',
        };
    },
    computed: {
        bgColor() {
        return (name) => {
            if (!name) return 'rgb(119, 153, 153)'
            var str = ''
            for (var i = 0; i < name.length; i++) {
            str += parseInt(name[i].charCodeAt(0), 10).toString(16)
            }
            return '#' + str.slice(0, 2) + str.slice(1, 2)
        }
        },
    },
    mounted(){
       this.handleRolesOptions()
    },
    methods: {
        handleRole(e){
           this.model.roleName = e
        },
        handleUser(e){
            console.log(e,'分配员工0000000')
        //    this.model.roleList = e
           this.$set(this.model,'roleList',e)
        },
        handleRolesOptions(){
           postAction(this.url.milepostRoleList).then(res=>{
              if(res.success){
                this.rolesOptions = res.result.map((item,index,arr)=>{
                    let c = {label:item.roleName, value:item.id}
                    return c;
                })
              }else{
                this.$message.warning(res.message)
              }
           })
        },
        // 分配员工
        handleAssignOptions(id){
            getAction(this.url.groubRoleUrl,{id:id}).then(res=>{
              if(res.success&& res.result.length != 0){
                this.groubRoleList = res.result
              }else{
                this.groubRoleList = []
                this.$message.warning(res.message)
              }
           })
        },
        showModal() {
            this.visible = true;
        },
        handleOk() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.confirmLoading = true;
                    let params = {
                        userId:this.model.roleList.length>0?this.model.roleList.join(','):'',
                        costRoleId:this.model.planRoleId,
                        planHours:this.model.estimateHours,
                        ifForce:this.ifForce,
                        milepostId:this.milepostId,
                        projectId:this.projectId
                    }
                    // console.log(params,'params-----')
                    postAction(this.url.milepostBindingUser,params).then(res=>{
                        this.confirmLoading = false
                        if(res.success){
                            this.visible = false
                            this.$message.success(res.message)
                            this.model.roleList = []
                            this.$emit('uploadList');
                            this.warningVisible = false
                        }else{
                            this.$message.warning(res.message)
                            this.msg = res.result.msg
                            this.data = res.result.noticeUser
                            this.warningVisible = true
                        }
                    })
                } else {
                    return false;
                }
            });

        },
        handleCancel(e) {
            this.visible = false;

        },
        edit(record){
            this.model = Object.assign({}, record);
            this.model.roleList = []
        },
        handleForceBinding(){
            this.ifForce = 1
            this.handleOk()
        },
        handleBackCancel(){
            this.ifForce = 0
            this.warningVisible = false
            this.visible = true
        },
    },
}
</script>
<style lang="less" scoped>
.milestone-box {
  min-height: 450px;
}

.milestone-box /deep/ .ant-steps-item-title {
  position: absolute;
  left: -22%;
  text-align: right;
  width: 22%;
}

.milestone-box /deep/ .steps-right {
  position: absolute;
  right: 2%;
  top: -15px;
  width: 96%;
  min-height: 450px;
}

.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 450px;
  text-align: center;
  padding-top: 15px;
  position: relative;
}

.steps-right-btn {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding-top: 20px;
  border-top: 1px dashed #d9dbdd;
  width: 90%;
  text-align: left;
}

.steps-right-btn a {
  margin-right: 20px;
}

.add-step-sty {
  position: relative;
}

.add-step-sty>span {
  position: absolute;
  display: inline-block;
  height: 13px;
  width: 1px;
  left: 11px;
  top: -18px;
  background: #e8e8e8;
}

.cust-select-sty {
  border-radius: 15px;
  background: #e8f4ff;
  display: flex;
  padding-right: 5px;
}

.cust-select-sty span:first-child {
  border-radius: 50%;
  width: 25px;
  text-align: center;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
}

.cust-select-sty span:last-child {
  color: #b2c7e0;
  font-size: 17px;
  width: 25px;
  text-align: center;
}

/deep/ .ant-select-selection__choice__content {
  &>.cust-select-sty span:last-child {
    display: none;
  }
}

/deep/ .has-error .ant-form-explain,
.has-error .ant-form-split {
  text-align: left;
}
</style>