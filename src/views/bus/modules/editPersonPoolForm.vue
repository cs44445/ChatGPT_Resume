<template>
    <a-modal
      title="编辑"
      :visible="visible"
      :width='800'
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
    <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
        <a-form-model-item label="职位（客户）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customDutiesId">
            <a-select
                @change="handleChangeCustomDuties"
                placeholder="请选择职位"
                v-model="form.customDutiesId"
                show-search
                :filter-option="filterOption"
                :options="customWorkerPost"
                allowClear 
                :getPopupContainer="(target) => target.parentNode">

            </a-select>
        </a-form-model-item> 
        <a-form-model-item label="价格（客户）" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="customPrice">
            <a-input-number placeholder="请输入价格" v-model="form.customPrice" style="width: 100%" />
        </a-form-model-item> 
        <a-form-model-item  label="别名" prop="alias">
          <a-input v-model="form.alias" placeholder="请输入别名"/>
        </a-form-model-item>        
        <a-form-model-item label="入职日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkDate">
            <j-date placeholder="请选择入职日期"  v-model="form.checkDate"  style="width: 100%" />
        </a-form-model-item> 
    </a-form-model>
    </a-modal>
</template>
<script>
import { postAction,getAction } from '../../../api/manage';
export default {
    name:'editPersonPoolForm',
    data(){
       return{
        visible: false,
        confirmLoading: false,
        labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        },
        wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        },
        form:{},
        rules: {
            alias: [{required: true, message: '请输入别名！', trigger: 'blur'}],
            customPrice: [{required: true, message: '请输入价格！', trigger: 'blur'}],
            customDutiesId: [{required: true, message: '请选择职位！', trigger: 'change'}],
            checkDate: [{required: true, message: '请选择入职日期！', trigger: 'change'}],
        },
        url:{           
          edit:'sys/user/updateProjectUser',
          getCustomDutiesById:'/bus/busCustom/getCustomDutiesById',
          getProjectCodeList:'/bus/busProject/getProjectCodeList',
        },        
        customWorkerPost:[],
        projectData:{},
        userId:''
       }
    },
    methods:{
        handleChangeCustomDuties(e, label){
          this.$set(this.form,'id',this.userId)
          this.$set(this.form,'customDutiesName',label.componentOptions.children[0].elm.data.trim())
        },
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
                  item.value = temp.customId
                  item.hourlyWage = temp.hourlyWage
                  item.position = temp.position
                  dictOptions.push(item);
              }
               this.customWorkerPost = dictOptions
               console.log(this.customWorkerPost,'this.customWorkerPost')
            }
          })
        }, 
        handleOk(e) {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {               
                  this.confirmLoading = true;
                  postAction(this.url.edit,this.form).then(res=>{
                     if(res.success){
                        this.$message.success(res.result)
                        this.$emit('handleList')
                        setTimeout(() => {
                            this.visible = false;
                            this.confirmLoading = false;
                        }, 500);
                     }else{
                        this.$message.warning(res.result)
                     }
                  })
                    
                } else {
                  return false;
                }
            });
        },
        handleCancel(e) {
          this.visible = false;
          this.$refs.ruleForm.resetFields();
        },
    }
}
</script>
<style scoped>

</style>