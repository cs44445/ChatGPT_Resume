<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="职位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="position">
              <!-- <j-dict-select-tag v-model="model.position" placeholder="请选择职位" type="list" class="tablePageQueryCss"></j-dict-select-tag> -->
              
              <a-select class="tablePageQueryCss" @change="handleChange" v-model="model.position"  placeholder="请选择职位">
                <a-select-option v-for="item in dutiesList" :key="item.id" :value="item.id">{{ item.dutiesName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="时薪" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hourlyWage" type='number'>
              <a-input v-model="model.hourlyWage" placeholder="请输入时薪"  :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="工作地点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="officeLocation" type='number'>
              <a-input v-model="model.officeLocation" placeholder="请输入工作地点"  :disabled="formDisabled"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="驻场办公" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="onSite" type='number'>
                  <a-select v-model="model.onSite" placeholder="请选择是否驻场办公" :disabled="formDisabled">
                    <a-select-option value="1">是</a-select-option>
                    <a-select-option value="0">否</a-select-option>
                  </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    
    <company-modal ref="modalForm" @ok="modalFormOk"></company-modal>
  </a-spin>
</template>

<script> 

  import { httpAction, getAction, postAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { duplicateCheck } from '@/api/api'
  // import BusCompanyModal from '../modules/BusCompanyModal'

  export default {
    name: 'BusSupplierPriceForm',
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
      }
    },
    data () {
      return {
        model:{},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules: {
          position: [
            { required: true, message: '请选择职位!'},
          ],
          hourlyWage:[
            { required: true, message: '请输入时薪!'},
          ],
          officeLocation:[
            { required: true, message: '请输入工作地点!'},
          ],
          onSite:[
            { required: true, message: '请选择是否驻场办公!'},
          ],
        },
        url: {
          priceAdd: "/bus/busCompanyPrice/add",
          companyDuties:'/bus/busCompanyDuties/list'
        },
        companyOptions: [],
        projectId:'',
        dutiesList:[]
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
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    mounted(){
      this.initCompanyList()
      this.getCompanyDuties()
    },
    methods: {
      add (projectId) {
      if (projectId) {
        this.projectId = projectId
      }
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
         this.$refs.form.validate(valid => {
          if (valid) {
            this.model.companyId = this.projectId
            postAction(this.url.priceAdd, this.model).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.$emit('ok');
              } else {
                this.$message.warning(res.message)
              }
            })
          }

        })
      },
      handleAddQuick() {
        this.$refs.modalForm.add();
        this.$refs.modalForm.title = "快速添加";
        this.$refs.modalForm.contacttab = false;
      },
      modalFormOk(){
        this.initCompanyList()
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      initCompanyList() {
        getAction("/sys/dict/getDictItems/" + "bus_company,name,id,del_flag!='1' order by create_time desc").then(res => {
          if (res.success) {
            let result = res.result
            let dictOptions = []
            for (let i = 0; i < result.length; i++) {
              let temp = result[i];
              let item = {}
              item.label = temp.title
              item.value = temp.value
              dictOptions.push(item);
            }
            this.companyOptions = dictOptions
          } else {
            this.$message.warn(`获取失败：` + res.message)
          }
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
            var params = {
              tableName: 'bus_company_bank',
              fieldName: 'phone',
              fieldVal: value,
              dataId: ''
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
      getCompanyDuties(){
        getAction(this.url.companyDuties).then((res) => {
            if (res.success) {
              console.log('123123123',res.result.records)
              this.dutiesList = res.result.records
            } else {
                this.$message.warning(res.message)
            }
        })
      }
    }
  }
</script>