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
        <div style="display: flex;justify-content: space-between;margin-bottom: 30px;">
            <div>
                <span>预估成本(元)：</span><span>{{ estimateCost }}</span>
            </div>
            <div>
                <span>预估利润率(%)：</span><span>{{ estimateProfitRate }}</span>
            </div>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination = 'false' size="small">
            
        </a-table>
        <template slot="footer">
          <a-button @click="visible=false">取消</a-button>
        </template>
    </j-modal>
  </template>

<script>
import { httpAction, getAction } from '@/api/manage'
export default {
  name: 'EstimatedCost',
  data () {
    return {
      title:'预估成本',
      width:600,
      visible: false,
      disableSubmit: false,
      columns:[
        {
            title: '预估成本明细',
            dataIndex: 'estimateCostItem',
            key: 'estimateCostItem',
            scopedSlots: { customRender: 'estimateCostItem' },
        },
        {
            title: '金额(元)',
            dataIndex: 'cost',
            key: 'cost',
        },
        {
            title: '占比',
            dataIndex: 'gdp',
            key: 'gdp',
        }
      ],
      estimateCost:'',
      estimateProfitRate:'',
      data:[],
      url:{
        queryEstimateCostByProjectId:'bus/busProject/queryEstimateCostByProjectId'
      }
    }
  },
  methods: {
    loadData(id){
      getAction(this.url.queryEstimateCostByProjectId,{projectId:id}).then(res=>{
         if(res.success){
            this.data = res.result.item
            this.estimateCost = res.result.estimateCost
            this.estimateProfitRate = res.result.estimateProfitRate
         }
      })
    },
    edit (record) {
      this.visible=true
      this.$nextTick(()=>{
        
      })
    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      
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