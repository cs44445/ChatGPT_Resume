<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail" style="height: 500px;overflow-y: scroll;">
        <a-card :bordered="false" class="noticehove" v-for="(item,index) in model.records" :key="index">
            <a-popconfirm slot="extra" title="确定删除吗?" @confirm="() => deleteNotice(item.id)" v-has="'application:notice:delete'">
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
            <h1 @click="handleNotice(item)">{{item.title}}</h1>
            <p style="color:#999;">{{item.createTime}}</p>
            <p class="headtit-p" v-html="item.noticeContent"></p>
        </a-card>
      </a-form-model>
    </j-form-container>
    <proc-lamation-modal ref="noticeForm"></proc-lamation-modal>
  </a-spin>
</template>

<script>

  import { httpAction, deleteAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import ProcLamationModal from './ProcLamationModal.vue'
  export default {
    name: 'AnnounCementForm',
    components: {
      ProcLamationModal
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
          add: "/bus/busProject/add",
          edit: "/bus/busProject/edit",
          queryById: "/bus/busProject/queryById",
          delete:'/bus/busProjectNotice/delete'
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
      deleteNotice(ids){
        deleteAction(this.url.delete, { id: ids }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok');
            this.$emit('noticelist');
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
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
      handleNotice(record){
        this.$refs.noticeForm.edit(record)
        this.$refs.noticeForm.title = record.title
        this.$refs.noticeForm.disableSubmit = true
      },
    }
  }
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';
  /deep/ .noticehove h3:hover{
    color:#1990ff;
    cursor: pointer;
  }
  .headtit-p>p{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/deep/.ant-card-extra{
  position: absolute;
  right: 20px;
  top: 20px;
}
/deep/.ant-card-head{
  border-bottom: 0;
  min-height: 0;
}
</style>
