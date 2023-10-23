<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-tabs default-active-key="1" @change="selectTab">
          <a-tab-pane tab="一线城市" key="1" forceRender>
            <bus-labor-cost-list :setType="setType" :templateId="templateId"/>
          </a-tab-pane>
          <a-tab-pane tab="二线城市" key="2" forceRender>
            <bus-labor-cost-list :setType="setType" :templateId="templateId"/>
          </a-tab-pane>
          <a-tab-pane tab="三线城市" key="3" forceRender>
            <bus-labor-cost-list :setType="setType" :templateId="templateId"/>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
  import BusLaborCostList from '@views/bus/BusLaborCostList'
  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'BusDetailedConfigurationForm',
    components: {
      BusLaborCostList
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        setType:'',
        templateId:'',
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
        },
        url: {
          add: "/bus/busOverTimeTemplate/add",
          edit: "/bus/busOverTimeTemplate/edit",
          queryById: "/bus/busOverTimeTemplate/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      selectTab(key){
        if(key == "1"){
          this.setType = "1";
        }
        if(key == "2"){
          this.setType = "2";
        }
        if(key == "3"){
          this.setType = "3";
        }
        // console.log(key)
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.templateId=record.id
        this.model = Object.assign({}, record);
        this.visible = true;
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
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>