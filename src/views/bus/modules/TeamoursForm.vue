<template>
  <div>
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <div class="table-page-search-wrapper">
          <!-- 搜索区域 -->
          <a-form-model layout="inline" ref="ruleForm" @keyup.enter.native="searchQuery" :model="queryParam">
            <a-row :gutter="24">
              <a-col :md="12" :sm="8" style="position:relative;">
                <a-form-model-item label="里程碑" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select
                    placeholder="请选择"
                    @change="handleSelectChange" v-model="milepostId"
                  >
                    <a-select-option v-for="(item, key) in dictOptions" :key="key" :value="item.id">
                      {{item.milepostCode}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <span style="position:absolute;right:5px;right: -35%;top:5px;" v-if="dataSource.length>0">【{{ mileBegin }} ~ {{ mileEnd }}】</span>
              </a-col>
              <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
                <a-col :md="12" :sm="24">
                    <a-button :disabled="dataSource&&dataSource.length <1"
                      style="margin-left: 8px;" type="primary"
                      @click="downloadFiles()">分配工时</a-button>
                </a-col>
              </span>
            </a-row>
          </a-form-model>
          <div>
            <a-table :columns="columns" :data-source="dataSource" size="small" class="components-table-demo-nested">
              <a-table ref="table" size="small"
                :scroll="{ x: true }"
                rowKey="id"
                :columns="innerColumns"
                :dataSource="recordData.projectEstimateList"
                slot="expandedRowRender"
                slot-scope="recordData"
                :pagination="false" class="j-table-force-nowrap" @change="handleTableChange">
                <template slot="realName" slot-scope="text,record">
                  <a-button type="link" @click="handlePersonnel(record)"  style="color: #d93899;">
                    {{ text }}
                  </a-button>
                </template>
                <template slot="operation1" slot-scope="text,record">
                  <a-popconfirm title="确定删除吗?" v-if="record.isDel != '1'" @confirm="() => handleDeleteEmpoyees(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </a-table>
                <span slot="operation" slot-scope="text,record" class="table-operation">
                  <a @click="handleBindEmployees(record)" style="color: #d93899;">绑定员工</a>
                </span>
            </a-table>
          </div>
        </div>
      </a-form-model>
    </j-form-container>
    <!-- 批量添加 -->
    <batchadd-modal ref="batchadd" @uploadList="uploadList"></batchadd-modal>
    <personal-work-hours ref="PersonalWorkHours" @uploadList="uploadList"></personal-work-hours>
    <bind-employees ref="BindEmployees"  @uploadList="uploadList"></bind-employees>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction, putAction } from '@/api/manage'
import BatchaddModal from './BatchaddModal.vue'
import { ajaxGetDictItems } from '@/api/api'
import PersonalWorkHours from './PersonalWorkHours.vue'
import BindEmployees from './BindEmployees'
export default {
  name: "TeamoursForm",
  mixins: [JeecgListMixin, mixinDevice],
   components: {
    BatchaddModal,PersonalWorkHours,BindEmployees
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
          title: '角色',
          align: "left",
          dataIndex: 'roleName',
          scopedSlots: { customRender: 'roleName' },
        },
        {
          title: '预估工时',
          align: "left",
          dataIndex: 'estimateHours'
        },
        {
          title: '已分配工时',
          align: "left",
          dataIndex: 'distributionHours',
          scopedSlots: { customRender: 'distributionHours' },
        },
        {
          title: '未分配工时',
          align: "left",
          dataIndex: 'unassignedHours'
        },
        {
          title: '已分配员工数',
          align: "left",
          dataIndex: 'peopleNum'
        },
        { title: '操作',
          align: "left",
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        },
      ],
      innerColumns: [
        {
          title: '姓名',
          align: "left",
          dataIndex: 'realName',
          scopedSlots: { customRender: 'realName' },
        },
        {
          title: '工号',
          align: "left",
          dataIndex: 'workNo'
        },
        // {
        //   title: '阶段角色',
        //   align: "left",
        //   dataIndex: 'userTitleInfo',
        //   scopedSlots: { customRender: 'userTitleInfo' },
        // },
        // {
        //   title: '剩余工时(h)',
        //   align: "left",
        //   dataIndex: 'totalHoursAllocateds'
        // },
        {
          title: '分配工时(h)',
          align: "left",
          dataIndex: 'totalHoursAllocated'
        },
          { title: '操作',
            align: "left",
            dataIndex: 'operation1',
            scopedSlots: { customRender: 'operation1' },

          },
      ],
      dataSource: [],
      innerData:[],
      dictOptions:[],
      url: {
        fileListByProjectId: '/bus/file/getFileListByProjectId',
        fileDelete: '/bus/file/delete',
        delete: "/bus/busProjectEstimate/delete",
        list:'',
        getById:'/bus/busProjectMilepost/queryByProjectId',
        queryMilepostRoleList:'/bus/busProjectMilepost/queryMilepostRoleList',
        tagEdit: '/bus/busProjectEstimate/edit',//表格标签编辑
      },
      associateddataSource: [],
      selectedRows: [],
      selectedRowKeys: [],
      model: {},
      listId: '',
      projectId:'',
      milepostId:'',
      dataSourceTag: [],
      tagValue: [],
      inputVisible: [],
      colorList:['blue','pink','cyan'],
      mileBegin:'',
      mileEnd:''
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
    this.getTagsDict()
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  methods: {
    handleBindEmployees(row){
      console.log(row,'-----绑定员工---row------')
      // row.projectEstimateList = row.projectEstimateList ? row.projectEstimateList : []
      let a = []
      if(row.projectEstimateList&&row.projectEstimateList.length>0){
        row.projectEstimateList.forEach(i=>{
          a.push(i.userId)
        })
      }
      row.roleList = a
      this.$refs.BindEmployees.edit(row)
      this.$refs.BindEmployees.visible = true
      this.$refs.BindEmployees.projectId = this.projectId
      this.$refs.BindEmployees.milepostId = this.milepostId
      this.$refs.BindEmployees.handleAssignOptions(this.projectId)
    },
    handlePersonnel(record){
      console.log(record,'这一人员')
      record.estimateId = record.id
      this.$refs.PersonalWorkHours.getList(record.id)
      this.$refs.PersonalWorkHours.personalInfo = record
      // this.$refs.batchadd.visible = true
      this.$refs.PersonalWorkHours.visible = true
    },
    handleDeleteEmpoyees(ids){
      deleteAction(this.url.delete, { id: ids }).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.teamList(this.milepostId)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //修改标签start
    //根据字典Code, 初始化字典数组
    getTagsDict() {
      ajaxGetDictItems('stage_role', null).then((res) => {
        if (res.success) {
          // console.log(res.result);
          this.dataSourceTag = res.result;
        }
      })
    },
    handleClose(removedTag, position, id) {
      let tags = position.filter(tag => tag !== removedTag);
      if (tags.length == 0) {
        tags = ''
      } else {
        tags = tags.join(',')
      }
      console.log('clear', removedTag, position, tags);
      putAction(this.url.tagEdit, { id: id, userTitle: tags }).then((res) => {
        if (res.success) {
          this.teamList(this.milepostId)
          this.$message.success('修改成功')
        } else {
          this.$message.warning('修改失败')
        }
      });
      // this.tags = tags;
    },

    showInput(i) {
      this.inputVisible[i].visible = true;
    },

    onChange(record, e) {
      console.log('onChange', record, e);
    },
    onChangeAdd(record, e, i) {
      console.log('blur', record, e,i);
      if (e) {
        let isExsit = record.userTitleInfo.find((ele) => ele === e)
        if (isExsit) {
          this.$message.warning('标签已存在请重新选择')
        } else {
          let addTags = ''
          if (record.userTitleInfo.length == 0) {
            addTags = e
          } else {
            addTags = record.userTitleInfo.join(',') + ',' + e
          }
          console.log('addTags', addTags);
          this.inputVisible[i].visible = false;
          putAction(this.url.tagEdit, { id: record.id, userTitle: addTags }).then((res) => {
            if (res.success) {
              this.teamList(this.milepostId)
              this.$message.success('修改成功')
            } else {
              this.$message.warning('修改失败')
            }
          });
        }
      } else {
        this.inputVisible[i].visible = false;
      }
    },//修改标签end

    uploadList(){
      this.teamList(this.milepostId)
    },
    handleSelectChange(val){
      this.milepostId=val
      this.teamList(val)
    },
    teamList(val){
      getAction(this.url.queryMilepostRoleList,{id:val}).then((res)=> {
        if(res.success){
          this.dataSource=res.result
          this.mileBegin = this.dataSource[0].beginTime
          this.mileEnd = this.dataSource[0].endTime
          if(res.result.length>0){
            this.$emit("passfunction",res.result[0].estimateTime)
            this.$emit("passfunction1",res.result[0].estimateSlr)
            for (let i = 0; i < this.dataSource.length; i++) {
              this.tagValue.push({ value: '' })
              this.inputVisible.push({ visible: false })
            }
          }else{
            this.$emit("passfunction",'')
            this.$emit("passfunction1",'')
          }
        }

      })
    },
    milepost(){
      getAction(this.url.getById,{queryByProjectId:this.projectId}).then((res)=> {
        this.dictOptions = res.result
      })
    },
    downloadFiles(){
      this.$refs.batchadd.edit(this.projectId,this.milepostId)
      this.$refs.batchadd.title ="分配工时"
      this.$refs.batchadd.disableSubmit = false
      console.log(this.$parent)
      // this.$refs.batchadd.visible = true
      //  for(let i = 0; i< this.selectedRows.length; i++){
      //   this.downloadFile(this.selectedRows[i].filePath)
      //  }
    },
    edit(record) {
      this.milepostId=''
      this.listId = record
      this.projectId=record.id
      this.milepost(this.projectId)
      // this.teamList()
      this.handleList(record, '')
    },
    handleList(projectId, fileName) {
      getAction(this.url.fileListByProjectId, { projectId, fileName }).then((res) => {
        this.dataSource = res.result
      })
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.handleList(this.listId, '')
        this.$message.success(`${info.file.name}上传成功`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败，请稍后重试`);
      }
    },
    searchQuery() {
      this.handleList(this.listId, this.queryParam.title)
    },
    handleDelete(record) {
      console.log(22, record)
      deleteAction(this.url.fileDelete + '?id=' + record).then((res) => {
        console.log(res)
        if (res.success && res.code == 200) {
          //重新计算分页问题
          this.queryParam.title = ''
          this.handleList(this.listId, '')
          this.$message.success(`删除成功`);
        } else {
          that.$message.warning(res.message);
        }
      })
    },
    handleOk(e) {
      let that = this;
      that.$refs.ruleForm.resetFields();
      if (that.selectedRows.length < 1) {
        that.$message.warning("请选择机会或点击取消按钮")
        return
      }
      let names = ""
      let flag = true;
      if (that.associateddataSource.length > 0) {
        that.selectedRows.forEach(v => {
          that.associateddataSource.forEach(item => {
            if (v.id == item.id) {
              names += v.title + ","
              flag = false
            }
          })
        })
      }
      if (!flag) {
        that.$message.warning("选择的机会已存在，请检查！已存在机会为" + "【" + names + "】");
        return
      } else {
        that.confirmLoading = true;
        that.selectedRows.forEach(item => {
          that.associateddataSource.push(item)
        })
        setTimeout(() => {
          that.visible = false;
          that.confirmLoading = false;
        }, 500);
      }
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
</style>