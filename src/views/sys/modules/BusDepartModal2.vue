<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="团队名称"
          prop="departName"
          :hidden="false"
          hasFeedback >
          <a-input id="departName" placeholder="团队名称" v-model="model.departName"/>
        </a-form-model-item>

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="parentId" label="上级部门" hasFeedback>
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
            v-model="model.parentId"
            placeholder="请选择上级部门"
            :disabled="condition">
          </a-tree-select>
        </a-form-model-item>
        
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="负责人">
          <!-- <a-input placeholder="请输入地址" v-model="model.address"/> -->
          <!-- <j-multi-select-tag
            type="select"
            mode="default"
            v-model="model.userId"
            :options="dictOptions"
            placeholder="请选择负责人">
          </j-multi-select-tag> -->
          <a-select
            v-model="model.leaderId"
            :options="dictOptions"
            allowClear
            placeholder="请选择负责人"
          />
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction ,postAction} from '@/api/manage'
  import { queryIdTree } from '@/api/api'
  import pick from 'lodash.pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  export default {
    name: "SysDepartModal",
    components: { ATextarea },
    data () {
      return {
        dictOptions:[],
        departTree:[],
        orgTypeData:[],
        phoneWarning:'',
        departName:"",
        title:"操作",
        seen:false,
        visible: false,
        condition:false,
        disableSubmit:false,
        model: {},
        defaultModel:{
          departOrder:0,
          orgCategory:'1'
        },
        menuhidden:false,
        menuusing:true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules:{
          departName:[{ required: true, message: '请输入团队名称!' }],
          parentId:[{ required: true, message: '请选择上级团队!' }],
          orgCode:[{ required: true, message: '请输入机构编码!' }],
          mobile: [{validator:this.validateMobile}],
          orgCategory:[{required: true, message: '请输入机构类型!'}]
        },
        url: {
          add: "/sys/sysDepart/addTeam",
          teamUserList: "/sys/user/teamUserList",
        },
        dictDisabled:true,
      }
    },
    created () {
    },
    mounted() {
      this.initTeamUserList()
    },
    methods: {
      initTeamUserList(){
        postAction(this.url.teamUserList).then(res => {
          if (res.success) {
            let result = res.result
            let dictOptions = []
            for (let i = 0; i < result.length; i++) {
              let temp = result[i];
              let item = {}
              item.label = temp.realname
              item.value = temp.id
              dictOptions.push(item);
            }
            this.dictOptions = dictOptions
          } else {
            this.$message.warn(`获取失败：` + res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      loadTreeData(){
        var that = this;
        queryIdTree().then((res)=>{
          if(res.success){
            that.departTree = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.departTree.push(temp);
            }
          }

        })
      },
      add (depart) {
        this.loadTreeData();
        if(depart){
          this.seen = false;
          this.dictDisabled = false;
        }else{
          this.seen = true;
          this.dictDisabled = true;
        }
        this.edit(depart);
      },
      edit (record) {
          this.visible = true;
          this.model = Object.assign({}, this.defaultModel, record)
          this.loadTreeData();
          if(record){
            this.model.parentId = record.toString();
          }
          
          //  if(this.seen){
          //    this.model.orgCategory = '1';
          //  }else{
          //    this.model.orgCategory = '2';
          //  }
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
        this.$refs.form.resetFields();
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            httpAction(this.url.add,this.model,"post").then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadTreeData();
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }else{
            return false;
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateMobile(rule,value,callback){
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
          callback();
        }else{
          callback("您的手机号码格式不正确!");
        }

      }
    }
  }
</script>

<style scoped>

</style>