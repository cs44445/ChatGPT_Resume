<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    destroyOnClose
    :visible="visible">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="单位名称"
          prop="departName"
          :hidden="false"
          hasFeedback >
          <a-input id="departName" placeholder="单位名称" v-model="model.departName"/>
        </a-form-model-item>

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级单位" prop="parentId" hasFeedback>
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
            v-model="model.parentId"
            placeholder="请选择上级单位"
            :disabled="condition">
          </a-tree-select>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
    <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
      <a-button v-if="!disableSubmit"  @click="handleOk" type="primary" style="margin-bottom: 0;">确定</a-button>
    </div>
  </a-drawer>
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
        width:800,
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
          departName:[{ required: true, message: '请输入单位名称!' }],
          parentId:[{ required: true, message: '请选择上级单位' }],
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
      // this.initTeamUserList()
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

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
  .drawer-footer{
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>