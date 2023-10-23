<template>
    <div>
      <a-modal
        :title='title'
        :visible="visible"
        :width="650"
        @cancel="handleCancel" :maskClosable="false"
      >
        <!-- <p>您当前的选择日期为：<span v-for="item in checkedList" :key="item" style="font-weight: bold;">{{item + ' '}}</span></p> -->
        <div style="padding: 15px 0;">
            <a-form-model
                ref="dynamicValidateForm"
                :model="dynamicValidateForm"
            >
                <a-form-model-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"  ref="ruleForm"  >
                        <a-row>
                            <a-col :span="6">
                                <a-form-model-item
                                label="项目"
                                prop="projectId"
                                >
                                    <a-select
                                    @change="handleChangePro"
                                    @select="selectPro(domain)"
                                    placeholder="请选择项目"
                                    v-model="domain.projectId"
                                    show-search
                                    :filter-option="filterOption"
                                    :options="proOptions"
                                    allowClear
                                    :getPopupContainer="(target) => target.parentNode">

                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-form-model-item label="里程碑"
                                prop="milepostId">
                                <a-select
                                    @change="handleChange"
                                    placeholder="请选择里程碑"
                                    v-model="domain.milepostId"
                                    show-search
                                    :filter-option="filterOption"
                                    :options="mileOptions"
                                    allowClear
                                    :getPopupContainer="(target) => target.parentNode">

                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-form-model-item label="工时(h)"
                                    prop="workHours">
                                    <a-input-number id="inputNumber"
                                        v-model.lazy="domain.workHours" style="width: 100%;"
                                        placeholder="请填写正常工时"
                                        @change="getAllWorkHours"
                                    />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="2" :offset="1" style="margin-top: 38px;text-align: right;">
                                    <a-form-model-item >
                                        <a-icon
                                            v-if="dynamicValidateForm.domains.length > 1"
                                            class="dynamic-delete-button"
                                            type="delete"
                                            :disabled="dynamicValidateForm.domains.length === 1"
                                            @click="removeDomain(domain)"
                                        />
                                    </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row v-if="domain.projectType=='2'">
                            <a-col :span="6">
                                <a-form-model-item label="分配任务数量" prop="planNum">
                                    <a-input v-model="domain.planNum"  placeholder="请输入分配任务数量"/>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-form-model-item label="实际任务数量" prop="realyNum">
                                    <a-input v-model="domain.realyNum"  placeholder="请输入实际任务数量"/>
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="6">
                                <a-form-model-item
                                    label="" v-if="checkedList.length==1"
                                    >
                                    <a-switch
                                    default-checked 
                                    v-model="domain.ifOverTime1"
                                    @change="onChange"/><span style="margin-left: 5px;">是否加班</span>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-form-model-item
                                    label=""                                
                                    prop="overtimeType" v-if="domain.ifOverTime1&&ifShow">
                                    <a-select                                    
                                        @change="handleChange"
                                        placeholder="请选择加班类型"
                                        v-model="domain.overtimeType"
                                        show-search
                                        :filter-option="filterOption"
                                        :options="typeOptions"
                                        allowClear
                                        :getPopupContainer="(target) => target.parentNode"
                                        >

                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="6" :offset="1">
                                <a-form-model-item
                                    label=""                                 
                                    prop="overtimeHours"
                                    v-if="domain.ifOverTime1&&ifShow">
                                    <a-input-number id="inputNumber"
                                        v-model="domain.overtimeHours"
                                        placeholder="请填写加班工时" style="width: 100%;"
                                        @change="getAllWorkHours"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <a-form-model-item >
                            <a-button  style="" @click="addDomain" v-if="dynamicValidateForm.domains.length - 1 == index">
                                <a-icon type="plus" />添加项目
                            </a-button>
                        </a-form-model-item>
                </a-form-model-item>
                <a-form-model-item label="日报(选填)" prop="daily">
                    <a-input v-model="dynamicValidateForm.daily" type="textarea"  :rows="4" placeholder="请输入日报内容"/>
                </a-form-model-item>
            </a-form-model>
        </div>
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
        title:'填写工时',
        visible: false,
        confirmLoading: false,
        formItemLayout: {
            labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
            },
            wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
            },
        },
        formItemLayoutWithOutLabel: {
            wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
            },
        },
        rules:{

        },
        dynamicValidateForm: {
            domains: [{
                workHours: '',
                id: Date.now(),
                // projectId:'',
                ifOverTime1:false,
                overtimeType:null,
                overtimeHours:'',
                planNum:500,
                realyNum:0
            }],
            daily:'',
        },
        proOptions:[],
        typeOptions :[{
            label :'周末加班',
            value : '2'
        },{
            label :'普通加班',
            value : '1'
        },{
            label :'节假日加班',
            value : '3'
        }],
        ifShow:false,
        url:{
            addActualList:'bus/busProjectActual/addActualList',
            getProject:'bus/busProjectUser/queryProjectByUserId',
            getWorkHoursByDate:'bus/busApprovalActual/getWorkHoursByDate',
            queryMilepostInfoByProjectId:'bus/busProjectUser/queryMilepostInfoByProjectId'
        },
        visibleWorkHours:false,
        allNormalWorkHours:0,
        mileOptions:[],
        proType:null
      };
    },
    mounted(){
        this.getProject()
    },
    methods: {
        selectPro(domain){
        //   console.log(domain)
          this.$set(domain,'projectType',this.proType)
        },
        handleChangePro(e, option){
            console.log(option,'option---------option')
            if(option){
                this.proType = typeof(option) == 'string' ?  option : option.data.props.type 
            }
          
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
        loadData(date){
            let url = this.url.getWorkHoursByDate + '?date=' + date
            getAction(url).then(res=>{
            if(res.success&&res.result.length>0){
                res.result[0].childList.forEach(i=>{
                    i.ifOverTime1 = i.ifOvertime == '1' ?true :false
                    this.handleChangePro(i.projectId,i.projectType)
                })
                this.dynamicValidateForm={
                        domains: res.result[0].childList,
                        daily:res.result[0].daily
                    }

            }
            })
            console.log(this.dynamicValidateForm,'this.dynamicValidateForm')
        },
        getProject(){
            getAction(this.url.getProject).then(res=>{
                if (res.success) {
                    // console.log(res.result,'res.result---------')
                    let result = res.result
                    let dictOptions = []
                    for (let i = 0; i < result.length; i++) {
                        let temp = result[i];
                        let item = {}
                        item.label = temp.projectName
                        item.value = temp.id
                        item.type = temp.projectType
                        dictOptions.push(item);
                    }
                    this.proOptions = dictOptions
                } else {
                    this.$message.warn(`获取失败：` + res.message)
                }
            })
        },
        getAllWorkHours(){
            let overtimeHours = 0
            let workHours = 0
            this.dynamicValidateForm.domains.forEach((i,index)=>{
                if(i.ifOverTime1){
                    overtimeHours += i.overtimeHours-0
                }
                workHours +=(i.workHours-0)
            })
            this.allNormalWorkHours = workHours
        },
        handleSubmit(){
            console.log(this.dynamicValidateForm,'提交的时候',this.$refs.dynamicValidateForm.ruleForm)


            let reg = /^[0-9]+.{0,1}[0-9]{0,2}$/

            if(this.ifShow&&this.allNormalWorkHours > 8){
                this.$message.warning('正常工时不得大于法定工作时长8小时')
                return
            }
            if( !this.dynamicValidateForm.domains[0].projectId && !this.dynamicValidateForm.domains[0].workHours){
                this.$message.warning('至少填写一条工时')
                return
            }
            // if(!this.dynamicValidateForm.daily){
            //     this.$message.warning('请填写日报')
            //     return
            // }
            for (let index = 0; index < this.dynamicValidateForm.domains.length; index++) {
                const element = this.dynamicValidateForm.domains[index];
                element.workCalendar = this.checkedList.join(",")
                element.ifOvertime = element.ifOverTime1 == true ? '1' :'0'
                if(!reg.test(element.workHours)){
                        this.$message.warning('正常工时应为数字')
                        return
                }
                if(!element.milepostId){
                        this.$message.warning('请选择里程碑')
                        return
                }
                if(element.ifOverTime1){
                    if(!element.overtimeType && !element.overtimeHours){
                       this.$message.warning('请完善加班工时')
                       return
                    }
                    if(!reg.test(element.overtimeHours)){
                        this.$message.warning('加班工时应为数字')
                        return
                    }
                }
            }
            this.confirmLoading = true;
            this.dynamicValidateForm.domains[0].daily = this.dynamicValidateForm.daily
            this.dynamicValidateForm.domains[0].workCalendar = this.checkedList.join(",")
            let params = {
                workCalendar: this.checkedList.join(","),
                daily:this.dynamicValidateForm.daily,
                busProjectActualList:this.dynamicValidateForm.domains,
            }
            // return
            postAction(this.url.addActualList,params).then(res=>{
                if(res.success){
                    const a = JSON.parse(JSON.stringify(this.checkedList))
                    this.$emit('handleStatus')
                    setTimeout(() => {
                        this.visible = false;
                        this.confirmLoading = false;
                        this.dynamicValidateForm={
                            domains: [{
                                workHours: '',
                                id: Date.now(),
                                projectId:'',
                                ifOverTime1:false,
                                overtimeType:'',
                                overtimeHours:''
                            }],
                            daily:'',
                        }
                    }, 500);
                }else{
                    this.confirmLoading = false;
                    this.$message.warning(res.message)
                }
            })
        },
        onChange(checked) {
        //   console.log(`a-switch to ${checked}`);
        },
        removeDomain(item) {
            let index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        addDomain() {
            this.dynamicValidateForm.domains.push({
                workHours: '',
                id: Date.now(),
                projectId:'',
                ifOverTime1:false,
                overtimeType:'',
                overtimeHours:'',
                planNum:500,
                realyNum:0
            });
        },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel() {
        this.dynamicValidateForm={
            domains: [{
                workHours: '',
                id: Date.now(),
                // projectId:'',
                ifOverTime1:false,
                // overtimeType:'',
                overtimeHours:''
            }],
            daily:'',
        },
        this.$emit('handleStatus')
        this.close()
      },
      handleResetting(){
        this.dynamicValidateForm={
            domains: [{
                workHours: '',
                id: Date.now(),
                // projectId:'',
                ifOverTime1:false,
                // overtimeType:'',
                overtimeHours:''
            }],
            daily:'',
        }
      },
      filterOption(input, option) {
        console.log(input,option)
        return (
            option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      handleChange(e){

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
        padding: 10px 24px;
    }
    ::v-deep .ant-modal-title{
       font-weight: bold;
       font-size: 24px;
    }
  </style>
