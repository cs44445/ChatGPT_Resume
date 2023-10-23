<template>
  <a-spin :spinning="confirmLoading">
    <p style="font-size: 24px;font-weight: bold;color: #2F3133;">启动项目</p>
    <div style="height: 40px;width: 100%;
    background: #F2F4F5;border: 1px solid #EDEFF0;
    border-radius: 4px;margin-bottom:30px;
    line-height: 40px;padding-left: 15px;border-left:8px solid #CD128A">
      项目启动前请确认并检查所有项目相关字段及设置
    </div>
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <div class="table-page-search-wrapper">
            <a-table ref="table" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :loading="loading"
              :pagination="false" class="j-table-force-nowrap" size="small">
              <template slot="titkey" slot-scope="text, record">
                <!-- <a style="color:#1990ff" @click="handlePopup(text)">{{text}}</a> -->
                {{ text }}
              </template>
            </a-table>
        </div>
      </a-form-model>
    </j-form-container>
    <!-- 基础/高级信息 -->
    <bus-project-modal ref="modalForm" @ok="modalFormOk"></bus-project-modal>
    <!-- 成员管理 -->
    <bus-personnel ref="busPersonnel"></bus-personnel>
    <!-- 里程碑 -->
    <milepost-modal ref="milepostModal" @ok="modalFormOk"></milepost-modal>
    <!-- 工时 -->
    <teamours-modal ref="teamours"></teamours-modal>
    <!-- 预估成本 -->
    <estimated-cost ref="EstimatedCost"></estimated-cost>
    <!-- 警告 -->
    <warning-modal ref="warningModal" @handleSure="handleSure"></warning-modal>
  </a-spin>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction,httpAction} from '@/api/manage'
import BusProjectModal from './BusProjectModal'
import BusPersonnel from './BusPersonnel'
import MilepostModal from './MilepostModal'
import TeamoursModal from './TeamoursModal.vue'
import EstimatedCost from './EstimatedCost'
import warningModal from './warningModal'
export default {
  name: "StartupForm",
  mixins: [JeecgListMixin, mixinDevice],
   components: {
     BusProjectModal,
     BusPersonnel,
     MilepostModal,
     TeamoursModal,
     EstimatedCost,
     warningModal
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      visible: false,
      headers: {
      },
      confirmLoading: false,
      uploadAction: window._CONFIG['domianURL'] + "/bus/file/uploadProjectFile",
      queryParam: {
        title: ''
      },
      validatorRules: {},
      rules: {
        title: { required: true, message: '请输入', trigger: 'blur' },
      },
      columns: [
        {
          title: '确认项',
          align: "left",
          dataIndex: 'key',
          scopedSlots: { customRender: 'titkey' }
        },
        {
          title: '最后修改人',
          align: "left",
          dataIndex: 'owner'
        },
        {
          title: '最后修改日期',
          align: "left",
          dataIndex: 'date'
        }
      ],
      dataSource: [],
      dictOptions:[],
      url: {
        fileListByProjectId: '/bus/file/getFileListByProjectId',
        fileDelete: '/bus/file/delete',
        list:'/bus/busProject/getProjectStartMessage',
        getById:'/bus/busProjectMilepost/queryByProjectId',
        queryByProjectIdAndMileId:'/bus/busProjectEstimate/queryByProjectIdAndMileId',
        startProject:'bus/busProject/startProject'
      },
      associateddataSource: [],
      selectedRows: [],
      selectedRowKeys: [],
      model: {},
      listId: '',
      projectId:'',
      milepostId:'',
      type:1//判断是否强制启动，1是不强制，2是强制
    }
  },
  created() {
    this.modelDefault = JSON.parse(JSON.stringify(this.model));
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  methods: {
    milepost(){
      getAction(this.url.list,{id:this.listId.id}).then((res)=> {
        if(res.success){
          this.dataSource = res.result
        }else{
          this.$message.warning(res.message)
        }
        
      })
    },
    handlePopup(val){
      console.log(val)
      if(val=="基础/高级信息"){
        this.$refs.modalForm.edit(this.listId)
        this.$refs.modalForm.title = '基础/高级信息'
        this.$refs.modalForm.disableSubmit = true
      }else if(val=="成员管理"){
        this.$refs.busPersonnel.visible = true
        this.$refs.busPersonnel.projectData = this.listId
        this.$refs.busPersonnel.getAllUser(this.listId.id)
        this.$refs.busPersonnel.getCurrentDepartUser(this.listId.id,this.listId.principal)
        this.$refs.busPersonnel.getCommonUsers()
        this.$refs.busPersonnel.getCurrentUser(this.listId.id)
      }else if(val=="里程碑"){
        getAction(this.url.getById, { queryByProjectId: this.listId.id }).then(res=>{
          if (res.success && res.result.length != 0) {
            this.$refs.milepostModal.title = '编辑里程碑'
            this.$refs.milepostModal.edit(this.listId, res.result)
          } else {
            this.$refs.milepostModal.edit(this.listId, [])
            this.$refs.milepostModal.title = '添加里程碑'
          }
        })
      }else if(val=="预估成本"){
        this.$refs.EstimatedCost.visible = true
        this.$refs.EstimatedCost.title = '预估成本'
        this.$refs.EstimatedCost.loadData(this.projectId)
      }else{
        this.$refs.teamours.edit(this.listId)
        this.$refs.teamours.title = '团队工时管理'
        this.$refs.teamours.disableSubmit = true
      }
    },
    add () {
      this.edit(this.modelDefault);
    },
    edit(record) {
      this.listId = record
      this.projectId=record.id
      this.milepost()
    },
    handleSure(){
      this.type = 5
      this.submitForm()
    },
    submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            if(this.selectedRowKeys.length==this.dataSource.length){
              that.confirmLoading = true;
              getAction(this.url.startProject,{projectId:this.listId.id,status:this.type}).then((res)=>{
                if(res.success){                  
                  that.$message.success(res.message);
                  that.$emit('ok');
                  this.$emit('uploadList')
                }else{
                  if(res.code==500){
                    that.$message.warning(res.message);
                  }else{
                    that.$refs.warningModal.edit(this.listId.id)
                    that.$refs.warningModal.title = '警告'
                  }
                  
                }
              }).finally(() => {
                that.confirmLoading = false;
              })
            }else{
              that.$message.warning("请确认并检查所有项目相关字段及设置！");
            }
          }
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys;
    },
    onSelect(record, selected, selectedRows) {
      console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
      console.log(selected, selectedRows, changeRows);
    },
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';

/deep/ .bthhover {
  background-color: #1990ff;
  border-color: #1990ff;
}
::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #F7F8FA;
}
::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  /* .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td */
  background: #fff !important;
}
::v-deep .ant-table-tbody > tr > td{
  background: #F7F8FA;
}
::v-deep .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  background: #fff;
}
::v-deep .ant-table-thead > tr > th{
  background: #F7F8FA!important;
}
::v-deep .ant-checkbox-inner{
  width: 21px;
  height: 21px;
  background-color: #D4D8DC;
  border: 1px solid #D4D8DC;
  border-radius: 50%;
}
::v-deep .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #08C35C;
    border-color: #D3DCE5;
    border: 1px solid #08C35C;
}
::v-deep .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #D3DCE5;
}
::v-deep .ant-checkbox .ant-checkbox-inner::after {
    color: #fff;
}
</style>