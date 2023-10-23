<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model  ref="form" :model="model" :rules="validatorRules">


        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="taskDefKey"
          label="任务KEY">
          <a-input placeholder="请输入任务KEY" v-model="model.taskDefKey"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="name"
          label="任务名称">
          <a-input placeholder="请输入任务名称" v-model="model.name"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="isStartNode"
          label="是否发起人">
          <!-- <a-input placeholder="请选择是否发起人" v-model="model.isStartNode"/> -->
          <j-dict-select-tag  v-model="model.isStartNode" placeholder="请选择是否发起人" dictCode="yn"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="roleCode"
          label="角色">
          <!-- <a-input placeholder="请选择角色" v-model="model.roleCode"/> -->
          <!-- <j-dict-select-tag  v-model="model.roleCode" placeholder="请选择角色" dictCode="yes_no"/> -->
          <a-select
            placeholder="请选择角色"
            v-model="model.roleCode"
            :options="rolesOptions"
            allowClear
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="variable"
          label="变量">
          <a-input placeholder="请输入变量" v-model="model.variable"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="skipNode"
          label="是否跳过节点">
          <!-- <a-input placeholder="请选择是否跳过节点" v-model="model.skipNode"/> -->
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.skipNode"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addDictItem, editDictItem} from '@/api/api'
  import { getAction ,httpAction} from '@api/manage'
  import { queryall } from '@/api/api'

  export default {
    name: "DictItemModal",
    data() {
      return {
        title: "操作",
        visible: false,
        visibleCheck: true,
        model: {},
        dictId: "",
        status: 1,
        rolesOptions:[],
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        validatorRules: {
          itemText:  [{required: true, message: '请输入名称!'}],
          itemValue:  [{required: true, message: '请输入数据值!'},{validator: this.validateItemValue}],
        },
        url: {
          add: "/api/flowProcDeployd/insert",
          edit: "/api/flowProcDeployd/update",
        }
      }
    },
    created() {
    },
    mounted(){
      this.initRoleList()
    },
    methods: {
      //初始化角色字典
      initRoleList(){
        queryall().then((res)=>{
          if(res.success){
            this.rolesOptions = res.result.map((item,index,arr)=>{
              let c = {label:item.roleName, value:item.id}
              return c;
            })
            // console.log('this.rolesOptions: ',this.rolesOptions)
          }
        });
      },
      add(dictId) {
        console.log(dictId,'dictId')
        this.dictId = dictId;
        //初始化默认值
        this.edit({sortOrder:1,status:1});
      },
      edit(record) {
        if (record.id) {
          this.dictId = record.dictId;
        }
        this.status = record.status;
        this.visibleCheck = (record.status == 1) ? true : false;
        this.model = Object.assign({}, record);
        this.model.dictId = this.dictId;
        this.model.status = this.status;
        this.visible = true;
      },
      onChose(checked) {
        if (checked) {
          this.status = 1;
          this.visibleCheck = true;
        } else {
          this.status = 0;
          this.visibleCheck = false;
        }
      },
      // 确定
      handleOk() {
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
            this.model.procDefId = this.dictId
            this.model.procDefKey = this.dictId
            httpAction(httpurl,this.model,method).then((res)=>{
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      // 关闭
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.resetFields();
      },
      validateItemValue(rule, value, callback){
        let param = {
          itemValue:value,
          dictId:this.dictId,
        }
        if(this.model.id){
          param.id = this.model.id
        }
        if(value){
          let reg=new RegExp("[`_~!@#$^&*()=|{}'.<>《》/?！￥（）—【】‘；：”“。，、？]")
          if(reg.test(value)){
            callback("数据值不能包含特殊字符！")
          }else{
            //update--begin--autor:lvdandan-----date:20201203------for：JT-27【数据字典】字典 - 数据值可重复
            getAction("/sys/dictItem/dictItemCheck",param).then((res)=>{
              if(res.success){
                callback()
              }else{
                callback(res.message);
              }
            });
            //update--end--autor:lvdandan-----date:20201203------for：JT-27【数据字典】字典 - 数据值可重复
          }
        }else{
          callback()
        }
      }
    }
  }
</script>
