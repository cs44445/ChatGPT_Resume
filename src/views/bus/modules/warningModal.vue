<template>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      @ok="handleOk"
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
      @cancel="handleCancel"
      :maskClosable="false"      
      cancelText="取消">
        <div style="margin-bottom: 30px;">
            <p style="color: red;">当前项目预估利润率{{ estimateProfitRate }}%，低于目标利润率{{ lowTargetProfitRate }}%</p>
            <p style="color: red;">强制启动将会导致项目预期收入低于公司标准，将会通知到以下用户</p>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination = 'false' size="small">
            
        </a-table>
        <template slot="footer">
          <a-button @click="handleCancel">返回修改</a-button>
          <a-button @click="handleOk" type="primary">强制启动</a-button>
        </template>
    </j-modal>
  </template>

<script>
import { httpAction, getAction } from '@/api/manage'
export default {
  name: 'warningModal',
  data () {
    return {
      title:'',
      width:600,
      visible: false,
      disableSubmit: false,
      columns:[
        {
            title: '用户',
            dataIndex: 'name',
            key: 'name',
            scopedSlots: { customRender: 'name' },
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '部门',
            dataIndex: 'depart',
            key: 'depart',
        }
      ],
      lowTargetProfitRate:'',
      estimateProfitRate:'',
      data:[],
      url:{        
        projectWarnLowTargetByProjectId:"/bus/busProject/projectWarnLowTargetByProjectId",
      }
    }
  },
  methods: {
    edit (id) {         
      this.visible=true
      getAction(this.url.projectWarnLowTargetByProjectId,{projectId:id}).then(res=>{
         if(res.success){ 
          this.data = res.result.noticeItem
          this.estimateProfitRate =(res.result.estimateProfitRate-0).toFixed(2)
          this.lowTargetProfitRate = (res.result.lowTargetProfitRate-0).toFixed(2)
         }else{
          this.$message.warning(res.message);
         }
      })
      
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
        this.$emit('handleSure');
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
/deep/ .ant-btn-primary{ 
background-color:#1990ff;
border-color: #1990ff;
}
</style>