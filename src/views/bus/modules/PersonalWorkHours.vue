<template>
    <div>
        <j-modal
            title="个人工时"
            :width="width"
            :visible="visible"
            switchFullscreen
            @cancel="handleCancel1"
            :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
            
            :maskClosable="false"
            cancelText="关闭">
                <div style="display: flex;justify-content: space-between;margin-bottom: 30px;">
                    <div>
                        <span style="font-size:18px;margin-right: 20px;">{{ personalInfo.username}}</span>
                        <span style="font-size:18px;">工号:{{ ' '+personalInfo.workNo}}</span>
                    </div>
                    <a-button type="primary" @click="handleAddWorkHour">新增</a-button>
                </div>
                <a-table ref="table" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" 
                 class="j-table-force-nowrap" >
                    <span slot="action" slot-scope="text, record">
                        <a @click="handleEditDis(record)"  style="color: #d93899;">修改</a>
                        <a-divider type="vertical" />
                        <a-popconfirm
                            title="确认删除?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="confirm(record)"
                            @cancel="cancel"
                        >
                          <a  @click="handleDelDis(record)"  style="color: #d93899;">删除</a>
                        </a-popconfirm>
                        
                    </span>
                </a-table>
                <template slot="footer">
                    <a-button @click="handleCancel1">取消</a-button>
                </template>
        </j-modal>
        <a-modal
            title="修改工时"
            :visible="editVisible"
            @ok="handleEditForm"
            @cancel="handleEditFormCancel"
            :maskClosable="false"
            >
            <a-form-model
                ref="ruleForm"
                :model="editform"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
                <a-form-model-item label="日期" required prop="date1">
                    <a-date-picker
                        v-model="editform.date1"
                          disabled
                        placeholder="请选择日期"
                        style="width: 100%;"
                    />
                </a-form-model-item>
                <a-form-model-item label="添加工时(h)" prop="workHour">
                  <a-input-number v-model="editform.workHour"  style="width: 100%;" placeholder="请输入工时"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <add-work-assignment ref="AddWorkAssignment" :personalInfo="personalInfo" @uploadList="uploadList"></add-work-assignment>
    </div>
   
</template>

<script>
import { getAction, deleteAction, putAction } from '@/api/manage'
import { httpAction, postAction } from '../../../api/manage'
import AddWorkAssignment from './AddWorkAssignment.vue'
import moment from 'moment'
export default {
    components: {
      AddWorkAssignment
    },
    data () {
      return {
        width:800,
        visible: false,
        disableSubmit: false,
        personalInfo:{},
        url:{
            list:'bus/busProjectEstimate/getPersonWorkHoursByEstimateId',
            edit:'bus/busProjectEstimated/personWorkHourEdit',
            add:'bus/busProjectEstimated/add',
            delete:'bus/busProjectEstimated/delete'
        },
        columns:[
            {
            title: '日期',
            align: "left",
            dataIndex: 'workDate',
            scopedSlots: { customRender: 'workDate' },
            },
            // {
            // title: '开始时间',
            // align: "left",
            // dataIndex: 'beginTime'
            // },
            // {
            // title: '结束时间',
            // align: "left",
            // dataIndex: 'endTime',
            // scopedSlots: { customRender: 'endTime' },
            // },
            // {
            //   title: '剩余工时(h)',
            //   align: "left",
            //   dataIndex: 'totalHoursAllocateds'
            // },
            {
            title: '分配工时(h)',
            align: "left",
            dataIndex: 'planHours'
            },
            {
                title: '操作',
                key: 'action',
                scopedSlots: { customRender: 'action' },
            },
        ],
        dataSource: [],
        selectedRows: [],
        selectedRowKeys: [],
        distributionvisible:false,
        confirmLoading: false,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        form: {
            planWeek:'',
            planHours:''
        },
        estimateTime:'',
        estimateSlr:'',
        editform:{},
        editVisible:false,
        rules:{
            date1:{ required: true, message: '请选择日期', trigger: 'change' },
            workHour:{ required: true, message: '请输入工时', trigger: 'blur' },
        }
      }
    },
    methods:{
        handleEditFormCancel(){
            this.editVisible = false
            this.$refs.ruleForm.resetFields();
        },
        handleEditForm(){
            let that = this
            that.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params = {
                        beginTime:that.editform.date1,
                        planHours:that.editform.workHour,
                        id:that.editform.id
                    }
                   putAction(that.url.edit,params).then(res=>{
                      if(res.success){
                        that.$message.success(res.message);
                        that.editVisible = false
                        that.getList(that.personalInfo.estimateId)
                      }else{
                        that.$message.warning(res.message);
                      }
                   })
                } else {
                  return false;
                }
            });
        },
        handleAddWorkHour(){
          console.log(this.personalInfo,'-------000')
          this.visible = false
          this.$refs.AddWorkAssignment.choiceNum = 1
          this.$refs.AddWorkAssignment.ifFlag = true
          this.$refs.AddWorkAssignment.addvisible = true
          this.$refs.AddWorkAssignment.edit(this.personalInfo.projectId,this.personalInfo.milepostId,this.personalInfo.costRoleId)
        },
        handleEditDis(row){
            // this.visible = false
            this.editform={
                date1:row.workDate,
                workHour:row.planHours,
                id:row.id
            }
            console.log(row,'------------------------row',this.edidform)
            this.editVisible = true
        },
        handleDelDis(row){
            
        },
        confirm(row) {
            deleteAction(this.url.delete,{id:row.id}).then(res=>{
                if(res.success){
                    this.$message.success(res.message);
                    this.getList(this.personalInfo.estimateId)
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
        cancel(e) {
          
        },
        uploadList(){
            this.getList(this.personalInfo.estimateId)
        },
        getList(id){
           getAction(this.url.list,{estimateId:id}).then(res=>{
                if(res.success){
                    this.dataSource = res.result.items.records
                    this.$emit('uploadList');
                }else{
                    this.$message.warning(res.message);
                }
              
           })
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.selectedRows = selectedRows
            this.selectedRowKeys = selectedRowKeys;
        },
        handleCancel1 () {
            this.visible = false
        },
        close () {
            this.$emit('close');
            this.visible = false;
        },
    }
}
</script>

<style>

</style>