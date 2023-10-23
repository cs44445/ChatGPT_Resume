<template>
    <div>
            <!-- -----------添加工时--------- -->
        <a-modal
        title="添加工时"
        :visible="addvisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :maskClosable="false"
        >
        <a-form-model
            ref="addRuleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            
        >
        <a-form-model-item  label="选择日期"  prop="date">
            <a-range-picker @change="onChange"  v-model="form.date"/>
        </a-form-model-item>
        <a-form-model-item label="是否包含节假日" prop="ifHoliday">
            <a-select v-model="form.ifHoliday" placeholder="请选择">
            <a-select-option value="y">
                是
            </a-select-option>
            <a-select-option value="n">
                否
            </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="批量添加工时(h)" prop="batchWorkHour">
            <a-input-number id="inputNumber" v-model="form.batchWorkHour" placeholder="请输入工时" @change="onChangeWorkHour"  style="width: 100%;"/>
            <span style="color: red;">为选择日期范围内每一天的工时</span>
        </a-form-model-item>
        <a-form-model-item label="当前选择人数">
            <span>{{ choiceNum +' '}}人</span>
        </a-form-model-item>
        <a-form-model-item label="合计工时">
            <span>{{ form.totalWork +' '}}h</span>
        </a-form-model-item>
        </a-form-model>
        </a-modal>
    <!-- ------警告-------- -->
      <a-modal
        title="警告"
        :visible="warningVisible"
        @ok="handleForceBinding"
        @cancel="handleBackCancel"
        :maskClosable="false"
        >
          <p style="color:red">{{ msg }}</p>
          <p style="color:red">强制绑定将会导致项目预期收入低于公司标准，并将通知到以下用户</p>
          <a-table :columns="warningColumns" :data-source="data" :pagination="false" size="small">
          </a-table>
          <template slot="footer">
              <a-button @click="handleBackCancel">返回修改</a-button>
              <a-button @click="handleForceBinding" type="primary">强制分配</a-button>
          </template>
      </a-modal>
    </div>
</template>
<script>
  import { httpAction, getAction,postAction, putAction  } from '@/api/manage'
export default {
    props:{
        personalInfo:{}
    },
    data(){
       return {
        addvisible:false,
        warningVisible:false,
        ifForce:0,
        confirmLoading: false,
        form:{
            totalWork:0
        },
        data:[],
        warningColumns:[
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
        days:0,
        rules:{
          ifHoliday:[
           { required: true, message: '请选择是否包含节假日', trigger: 'change' },
          ],
          date:{ required: true, message: '请选择日期', trigger: 'change' },
          batchWorkHour:{ required: true, message: '请输入工时', trigger: 'blur' },
        }, 
        msg:'',
        choiceNum:0,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        roleName:'',
        projectId:'',
        milepostId:'',
        ifFlag:false,
        selectedRole:[],
        url:{            
          byRoleDistributionHours:'bus/busProjectMilepost/byRoleDistributionHours',
        }
       }
    },
    methods:{
        edit(projectId,milepostId,roleName){
            this.roleName=roleName,
            this.projectId=projectId,
            this.milepostId=milepostId
            console.log(this.milepostId,'this.milepostId----------this.milepostId')
        },
        handleBackCancel(){   
          this.ifForce = 0       
          this.warningVisible = false
          this.addvisible = true
        },
        onChange(date, dateString) {
            console.log(date, dateString);
            this.days = this.daysDiff(new Date(dateString[0]),new Date(dateString[1]))+1
            if(dateString){
            this.form.date = dateString
            }    
            if(this.form.batchWorkHour){
                this.form.totalWork = this.form.batchWorkHour*this.choiceNum*this.days
            }    
        },
        onChangeWorkHour(e){
          this.form.totalWork = e*this.choiceNum*this.days
        },
        daysDiff(date1, date2) { 
            return Math.ceil(Math.abs(date1 - date2) / 86400000)
        },
              //添加工时
      handleOk(e) {
        this.$refs.addRuleForm.validate(valid => {
          if (valid) {
            let params = {
              userId: this.ifFlag ? this.personalInfo.userId : this.selectedRole.join(','),
              beginTime:this.form.date[0],
              endTime:this.form.date[1],
              ifHoliday:this.form.ifHoliday,
              planHours:this.form.batchWorkHour,
              costRoleId:this.roleName,
              projectId:this.projectId,
              milepostId:this.milepostId,
              ifForce:this.ifForce
            }
            console.log(params)
            // return
            postAction(this.url.byRoleDistributionHours,params).then(res=>{
                this.addvisible = false
               if(res.success){
                this.ifFlag = false
                 this.$emit('uploadList') //新增完刷新列表
                 this.$message.success(res.message)
                 this.warningVisible = false
                 
               }else{
                this.warningVisible = true
                this.msg = res.result.msg
                this.data = res.result.noticeUser
                this.$message.warning(res.message)
               }
            })
          } else {
            return false;
          }
        });
      },
      handleCancel(e) {
        this.addvisible = false;
        this.$refs.addRuleForm.resetFields();
      },
      handleForceBinding(){
        this.ifForce = 1
        this.handleOk()
      },
    }
}
</script>
<style scoped>

</style>