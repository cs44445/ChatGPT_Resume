<template>
  <div>
    <a-modal
      title="批量填写工时"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel" :maskClosable="false"
    >
    <a-form-model
        ref="ruleForm"
        :model="form" :rules="rules"
    >
        <a-form-model-item label="项目" prop="projectId"
        >
            <a-select
            @change="handleChangePro"
            placeholder="请选择项目"
            v-model="form.projectId"
            show-search
            :filter-option="filterOption"
            :options="proOptions"
            allowClear
            :getPopupContainer="(target) => target.parentNode">

            </a-select>
        </a-form-model-item>
        <a-form-model-item label="里程碑" prop="milepostId">
          <a-select
            placeholder="请选择里程碑"
            v-model="form.milepostId"
            show-search
            :filter-option="filterOption"
            :options="mileOptions"
            allowClear
            :getPopupContainer="(target) => target.parentNode">

            </a-select>
        </a-form-model-item>
        <a-form-model-item label="工时数(h)" prop="workHourNum">
            <a-input-number id="inputNumber" v-model="form.workHourNum" @change="onChange"  style="width: 200px;"  placeholder="请输入工时数"/>
        </a-form-model-item>
        <div style="display: flex;align-items: flex-end;">
          <a-form-model-item label="执行时间" prop="beginningTime">
              <a-date-picker @change="onChangeBegin" v-model="form.beginningTime"  placeholder="请选择开始日期" />
              <span style="margin: 0 20px;">至</span>
          </a-form-model-item>
          <a-form-model-item label="" prop="endTime">
              <a-date-picker @change="onChangeEnd" v-model="form.endTime"  placeholder="请选择结束日期" />
          </a-form-model-item>
        </div>       
        <a-form-model-item label="日报(选填)" prop="desc">
          <a-input v-model="form.desc" type="textarea"  placeholder="请输入日报内容" :rows="4"/>
        </a-form-model-item>
    </a-form-model>
       <div slot="footer" style="display: flex;justify-content: space-between;">
            <div>
               <a-button @click="handleCancel()">取消</a-button>
               <a-button @click="handleResetting()">重置</a-button>
            </div>
            <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">填报</a-button>
        </div>
    </a-modal>
  </div>
</template>
<script>
  import { postAction, getAction } from '@/api/manage'
export default {
  props:{
    checkedList:{
        type: Array,
        default: () => []
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form:{},
      proOptions:[],
      url:{
            getProject:'bus/busProjectUser/queryProjectByUserId',
            queryMilepostInfoByProjectId:'bus/busProjectUser/queryMilepostInfoByProjectId',
            addActualLists:'bus/busProjectActual/addActualLists'
      },
      mileOptions:[],
      rules: {
        workHourNum: [
          { required: true, message: '请输入工时', trigger: 'blur' },
        ],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        beginningTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        milepostId: [
          {
            required: true,
            message: '请选择里程碑',
            trigger: 'change',
          },
        ],
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' },
        ]
      },
    };
  },
    watch: {
      
    },
  mounted(){
     this.getProject()
     
  },
  methods: {

    handleSubmit(){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.form.workHourNum > 24){
            this.$message.warning('日均工时不得大于24小时')
            return
          }
          if(!this.form.endTime){
            this.$message.warning('请选择结束时间')
            return
          }
          if(!this.form.beginningTime){
            this.$message.warning('请选择开始时间')
            return
          }
          if(this.form.beginningTime>this.form.endTime){
            this.$message.warning('开始时间应小于结束时间')
            return
          }
          let params = {
            busProjectActualList: [
              {
                milepostId: this.form.milepostId,     
                projectId: this.form.projectId,  
                workHours: this.form.workHourNum,   
              }
            ],
            daily: this.form.desc,                                //日报
            endDate: this.form.endTime,                             //结束日期
            startDate: this.form.beginningTime,                             //开始日期
            workCalendar: ""
          }
          postAction(this.url.addActualLists,params).then(res=>{
            if(res.success){
              this.$message.success(res.message)
              this.$emit('handleStatus')
              this.visible = false
              this.form = {}
            }else{
              this.$message.warning(res.message)
            }
          })
        } else {
          return false;
        }
      });
      
    },
    handleCancel(){
      this.form = {}
    },
    handleResetting(){
      this.$refs.ruleForm.resetFields();
    },
    onChangeBegin(date, dateString){
      // this.form.beginningTime = dateString
      this.$set(this.form,'beginningTime',dateString)
      // this.$forceUpdate()
      console.log(date, dateString,'this.form.beginningTime',this.form.beginningTime);
        if(this.form.endTime&&this.form.beginningTime>this.form.endTime){
            this.$message.warning('开始时间应小于结束时间')
        }
        
    },
    onChangeEnd(date, dateString){
      this.$set(this.form,'endTime',dateString)
      // this.$forceUpdate()
      console.log(date, dateString,this.form.endTime);
      if(!this.form.beginningTime){
        this.$message.warning('请选择开始时间')
      }
      if(this.form.beginningTime>this.form.endTime){
        this.$message.warning('开始时间应小于结束时间')
      }
      
    },
    onChange(){

    },
    handleChangePro(e){
        console.log(e,'项目id')
        let url = this.url.queryMilepostInfoByProjectId + '?projectId=' + e + '&chooseDate='+this.checkedList
        getAction(url).then(res=>{
            if(res.success){
                let result = res.result
                let dictOptions = []
                for (let i = 0; i < result.length; i++) {
                    let temp = result[i];
                    let item = {}
                    item.label = temp.milepostCode
                    item.value = temp.id
                    dictOptions.push(item);
                }
                this.mileOptions = dictOptions
            }
        })
    },
    getProject(){
        getAction(this.url.getProject).then(res=>{
            if (res.success) {
                let result = res.result
                let dictOptions = []
                for (let i = 0; i < result.length; i++) {
                    let temp = result[i];
                    let item = {}
                    item.label = temp.projectName
                    item.value = temp.id
                    dictOptions.push(item);
                }
                this.proOptions = dictOptions
            } else {
                this.$message.warn(`获取失败：` + res.message)
            }
        })
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 500);
    },
    handleCancel(e) {
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
  ::v-deep .ant-modal-header{
        border: none;
    }
    ::v-deep .ant-modal-footer{
        border: none;
    }
    ::v-deep .ant-modal-title{
       font-weight: bold;
       font-size: 24px;
    }
</style>