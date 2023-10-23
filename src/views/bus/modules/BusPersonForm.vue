<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" v-if="type == '1'">
            <a-form-model-item v-if="isCompanyName" label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyId">
              <a-select placeholder="请选择供应商名称" v-model="model.companyId" :options="comOptions" :disabled="listDisabled">
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-else-if="type == '2'">
            <a-form-model-item v-if="isCompanyName" label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customId">
              <a-select placeholder="请选择客户名称" v-model="model.customId" :options="cusOptions" :disabled="listDisabled">
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入姓名" :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="姓别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
                <a-select placeholder="请选择姓别" v-model="model.sex" :disabled="formDisabled">
                  <a-select-option value="1">男</a-select-option>
                  <a-select-option value="2">女</a-select-option>
                </a-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24" v-if="ifShowCompany">
            <a-form-model-item label="企业/外部单位" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="companyId">
              <a-select show-search :filter-option="filterOption" v-model="model.companyId" :options="companyOptions"
            allowClear placeholder="请选择大厦名称" :getPopupContainer="(target) => target.parentNode"
            :disabled="formDisabled" />
              <a-tooltip @click="handleAddQuick">
                <template slot="title">
                  快速添加企业
                </template>
                <a-icon style="width:20px;position: absolute;right:-35px;top:-3px; font-size: 25px; color: #3055BA; cursor: pointer;" type="plus-circle"/>
              </a-tooltip>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="job">
              <a-input v-model="model.job" placeholder="请输入职务" :disabled="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入手机号码" :disabled="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="座机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="model.landline" placeholder="请输入座机号码" :disabled="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="邮箱地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
              <a-input v-model="model.email" placeholder="请输入邮箱地址" :disabled="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-model="model.remark" placeholder="请输入备注" :disabled="formDisabled" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    
    <company-modal ref="modalForm" @ok="modalFormOk"></company-modal>
  </a-spin>
</template>

<script> 

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { duplicateCheck } from '@/api/api'
  // import BusCompanyModal from '../modules/BusCompanyModal'

  export default {
    name: 'BusPersonForm',
    components: {
      CompanyModal:()=> import("../modules/BusCompanyModal")
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      ifShowCompany2: {
        type: Boolean,
        default: false,
        required: false
      },
      type:{
        type:String
      }
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        model:{},
        confirmLoading: false,
        validatorRules: {
          companyId: [
            { required: true, message: '请选择供应商名称!'},
          ],
          customId: [
            { required: true, message: '请选择客户名称!'},
          ],
          name: [
            { required: true, message: '请输入姓名!'},
          ],
          sex: [
            { required: true, message: '请选择性别!'},
          ],
          job: [
            { required: true, message: '请输入职务!'},
          ],
          phone:[
            { required: true, message: '请输入手机号码!'}, {validator: this.validatePhone}
          ],
          email: [
            {  required: true, pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/, message: '请输入正确的电子邮件!'},{validator: this.validateEmail}
          ],
        },
        url: {
          add: "/bus/busPerson/add",
          edit: "/bus/busPerson/edit",
          queryById: "/bus/busPerson/queryById",
          companyList:"/bus/busCompany/list",
          customList:"/bus/busCustom/list",
        },
        companyOptions: [],
        comOptions: [],
        cusOptions: [],
        isCompanyName:true,
        // supplier:'',
        // client:'',
        projectId:'',
        type:'',
        listDisabled:false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
      ifShowCompany(){
        return this.ifShowCompany2
      },
    },
    created () {
      //备份model原始值
      console.log('this.model',this.model)
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    mounted(){
      // if(this.type == '1'){
      //   this.getCompanyList()
      // }
      // else if(this.type == '2'){
      //   this.getCustomList()
      // }
    },
    methods: {
      add (val) {
        this.edit(this.modelDefault);
        if(val == 'companyName'){
          this.isCompanyName = false
        }
        if(val.type == '1'){
          // this.supplier = val.supplier
          this.type = '1'
          this.projectId = val.projectId
          if(val.projectId){
            this.model.companyId = val.projectId
          }
          this.getCompanyList()
        }
        else if(val.type == '2'){
          // this.client = val.client
          this.type = '2'
          this.projectId = val.projectId
          this.getCustomList()
          if(val.projectId){
            this.model.customId = val.projectId
          }
        }
        if(val.list){
          this.listDisabled = true
        }
      },
      edit (record) {
        if(record.companyId){
          this.type = '1'
          this.model.companyId = record.companyId
          this.getCompanyList()
        }
        else if(record.customId){
          this.type = '2'
          this.model.customId = record.customId
          this.getCustomList()
        }
        // if(params.type == '2'){
          
        // }
        this.model = Object.assign({}, record);
        this.projectId = record.id
        this.visible = true;
      },
      getCompanyList(){
        getAction(this.url.companyList).then((res)=>{
          console.log('companyList',res)
          if(res.success){
            console.log('resresres',res)
            let result = res.result.records
            let dictOptions = []
            for (let i = 0; i < result.length; i++) {
              let temp = result[i];
              let item = {}
              item.label = temp.name
              item.value = temp.id
              dictOptions.push(item);
            }
            this.comOptions = dictOptions
          }else{
            this.$message.warning(`获取失败：` + res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
      getCustomList(){
        getAction(this.url.customList).then((res)=>{
          if(res.success){
            let result = res.result.records
            let dictOptions = []
            for (let i = 0; i < result.length; i++) {
              let temp = result[i];
              let item = {}
              item.label = temp.customName
              item.value = temp.id
              dictOptions.push(item);
            }
            this.cusOptions = dictOptions
          }else{
            this.$message.warning(`获取失败：` + res.message);
          }
        }).finally(() => {
          this.loading = false
        })
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            this.model.type = this.type
              // console.log('this.supplier',this.supplier)
              // console.log('this.client',this.client)
            if(this.type == '1' || this.type == '2'){
              this.model.id = this.projectId
            }
            // else if(this.type == '2'){
            //   this.model.id = this.projectId
            // }
            console.log('this.model',this.model)
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);

                that.$emit('ok',res.result);
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      handleAddQuick() {
        console.log(this.$refs,'快速添加企业')
        this.$refs.modalForm.add();
        this.$refs.modalForm.title = "快速添加";
        this.$refs.modalForm.contacttab = false;
      },
      modalFormOk(){
        this.getCompanyList()
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
            var params = {
              tableName: 'sys_user',
              fieldName: 'phone',
              fieldVal: value,
              dataId: this.projectId
            };
            duplicateCheck(params).then((res) => {
              if (res.success) {
                callback()
              } else {
                callback("手机号已存在!")
              }
            })
          }else{
            callback("请输入正确格式的手机号码!");
          }
        }
      },
      validateEmail(rule, value, callback){
        console.log('this.projectId',this.projectId)
        if(!value){
          callback()
        }else{
          if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)){
            var params = {
              tableName: 'bus_person',
              fieldName: 'email',
              fieldVal: value,
              dataId: this.projectId
            };
            duplicateCheck(params).then((res) => {
              console.log(res)
              if (res.success) {
                callback()
              } else {
                callback("邮箱已存在!")
              }
            })
          }else{
            callback("请输入正确格式的邮箱!")
          }
        }
      },
    }
  }
</script>