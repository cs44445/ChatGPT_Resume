<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :maskClosable="false"
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="取消">
    <budget-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" @budgetlist="budgetlist"></budget-form>
  </j-modal>
</template>

<script>

  import BudgetForm from './BudgetForm.vue'
  export default {
    name: 'BudgetModal',
    components: {
      BudgetForm
    },
    data () {
      return {
        title:'',
        width:1300,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.budgetlist()
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      budgetlist(){
        this.$emit('budgetlist')
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>