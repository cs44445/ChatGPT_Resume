<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="服务类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag v-model="model.type" placeholder="请选择服务类型" dictCode="service_type" type="list" class="tablePageQueryCss"></j-dict-select-tag>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="服务评级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="evaluate">
              <a-input v-model="model.evaluate" placeholder="请输入服务评级" disabled></a-input>
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
    
    <company-modal ref="modalForm" @ok="modalFormOk"></company-modal>
  </a-spin>
</template>

<script> 

  import { httpAction, getAction, postAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  // import BusCompanyModal from '../modules/BusCompanyModal'

  export default {
    name: 'BusServiceTypeForm',
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
        model:{
        },
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
          type: [
            { required: true, message: '请输入服务类型!'},
          ],
          // evaluate:[
          //   { required: true, message: '请输入服务评级!'},
          // ]
        },
        url: {
          serviceAdd: "bus/busCompanyService/add",
          // edit: "/bus/busPerson/edit",
          // queryById: "/bus/busPerson/queryById"
        },
        companyOptions: [],
        projectId:''
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
    },
    methods: {
      add (val) {
        if(val.servicelist){
          this.projectId=val.projectId
        }
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
         this.$refs.form.validate(valid => {
          if (valid) {
            if(this.projectId){
              this.model.companyId = this.projectId
              postAction(this.url.serviceAdd, this.model).then((res) => {
                if (res.success) {
                    this.$message.success(res.message)
                    that.$emit('ok');
                } else {
                    this.$message.warning(res.message)
                }
              })
            }
            else{
              that.$emit('ok',this.model);
            }
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
          this.loading = false
        })
      },
    }
  }
</script>