<template>
    <a-drawer
        title=""
        placement="right"
        :closable="true"
        :visible="visible" 
        width="750"  
        :after-visible-change="afterVisibleChange"
        @close="onClose"
        >
        <div style="display: flex;justify-content: space-between;margin-top: 20px;">
            <p style="font-size: 24px;font-weight: bold;color: #2F3133;">{{title}} 详情</p>
        </div>
        <div>
            <a-table
                ref="table"
                size="small"
                :scroll="{x:true}"
                rowKey="workNo"
                :columns="columns2"
                :dataSource="dataSource2"
                :pagination="ipagination"
                :loading="loading"
                class="j-table-force-nowrap"
                @change="handleTableChange">
                <!-- <template slot="dot" slot-scope="text, record">
                <span class="dot" :style="[{borderColor:record.color}]"></span>
                </template> -->
            </a-table>
        </div>
    </a-drawer>
</template>
<script>
import { httpAction, getAction } from '@/api/manage'
export default {
    data(){
        return{
            visible: false,
            url: {
                personFinishNum: "/bus/busEmailCorrect/personFinishNum",
            },
            columns2: [
            {
                title:'日期',
                align:"left",
                dataIndex: 'workCalendar'
            },
            {
                title:'工号',
                align:"left",
                dataIndex: 'workNo'
            },
            {
                title:'Alias',
                align:"left",
                dataIndex: 'alias'
            },
            {
                title:'姓名',
                align:"left",
                dataIndex: 'userName'
            },
            {
                title:'分配数',
                align:"left",
                dataIndex: 'planNum'
            },
            {
                title:'完成数',
                align:"left",
                dataIndex: 'realyNum'
            },
            ],
            title:''
            }
    },
    watch: {
    },
    mounted() {
    },
    methods:{
        
        //个人完成详情
        detail(projectId,userId,workDate,workNo){
        this.title = workNo
        let params = {
          projectId:projectId,
          userId:userId,
          startTime:workDate[0],
          endTime:workDate[1],
        }
            getAction(this.url.personFinishNum,params).then((res) => {
                if (res.success) {
                    this.dataSource2 = res.result.records||res.result;
                this.$forceUpdate()
                }
            })
        },
        onClose() {
          this.visible = false;
        },
    }
}
</script>
<style lang="less" scoped>
 /deep/ .j-table-force-nowrap{
    width: 100% !important;
  }
</style>