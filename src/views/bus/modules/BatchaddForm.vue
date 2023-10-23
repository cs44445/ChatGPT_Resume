<template>
  <a-spin :spinning="confirmLoading">
    <!-- <j-form-container > -->
      <a-form-model layout="inline" ref="ruleForm" @keyup.enter.native="searchQuery" :model="queryParam" style="margin-bottom: 30px;">
        <a-row :gutter="24"  style="margin-bottom: 10px;">
          <a-col :md="18" :sm="24" :xs="24">
            <a-form-model-item label="计划工时角色" >
              <a-select v-model="queryParam.roleName"  @change="onChangeRoleName" placeholder="请选择计划工时角色" style="width: 200px;">
                <a-select-option
                  v-for="mode in rolesOptions"
                  :key="mode.value"
                  :value="mode.value">
                  {{ mode.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24" :xs="24">
                <a-button  :disabled="selectedRowKeys.length <1" 
                  style="margin-left: 8px;" type="primary" 
                  @click="addOrEdit()">批量添加</a-button>
            </a-col>
          </span>
        </a-row>
        <a-row>
           当前分配角色：{{ timeDataSource.roleName }}  可分配工时：{{ timeDataSource.doAssignHours }}
        </a-row>
      </a-form-model>
      <a-table ref="table" :scroll="{ x: true }" rowKey="userid" :columns="timeColumns" :dataSource="timeDataSource.items"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" 
          :pagination="false" class="j-table-force-nowrap" >
          <template slot="userTitleInfo" slot-scope="text,record,index">
            <span>
              <template v-if="record.userTitleInfo">
                <template v-for="(tag,i) in record.userTitleInfo">
                  <a-tooltip v-if="tag.length > 5" :key="tag" :title="tag">
                    <a-tag :key="i" :closable="true" @close="() => handleClose(tag, record.userTitleInfo, record.id)" :color="colorList[i]">
                      {{ `${tag.slice(0, 5)}...` }}
                    </a-tag>
                  </a-tooltip>
                  <a-tag v-else :key="i" :closable="true"
                    @close="() => handleClose(tag, record.userTitleInfo, record.id)" :color="colorList[i]">
                    {{ tag }}
                  </a-tag>
                </template>
              </template>
              <a-auto-complete v-if="inputVisible[index].visible" :autoFocus="inputVisible[index].visible"
                v-model="tagValue[index].value" :data-source="dataSourceTag" placeholder="请选择/输入"
                @blur="onChangeAdd(record, $event, index)" />
              <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput(index)" v-show="record.userTitleInfo.length<3">
                <a-icon type="plus" />
              </a-tag>
            </span>

          </template>
          <span slot="operation" slot-scope="text,record" class="table-operation">
            <a @click="handleViewDetails(record)"  style="color: #d93899;">查看</a>
          </span>
        </a-table>
      <!--  -->
    <!-- </j-form-container> -->
      <add-work-assignment ref="AddWorkAssignment" @uploadList="uploadList"></add-work-assignment>
      <personal-work-hours ref="PersonalWorkHours" @addPersonnalWH="addPersonnalWH" @uploadList="uploadList"></personal-work-hours>
  </a-spin>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { httpAction, getAction,postAction, putAction  } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { ajaxGetDictItems } from '@/api/api'
  import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import PersonalWorkHours from './PersonalWorkHours.vue'
import AddWorkAssignment from './AddWorkAssignment.vue'
import moment from 'moment'
  export default {
    name: 'BatchaddForm',
    components: {
      PersonalWorkHours,AddWorkAssignment
    },
    mixins: [JeecgListMixin, mixinDevice],
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
    },
    data () {
      return {
        addvisible:false,
        queryParam: {
          
        },
        model:{
         },
         timeColumns: [
            {
              title: '姓名',
              align: "left",
              dataIndex: 'username'
            },
            {
              title: '工号',
              align: "left",
              dataIndex: 'workNo'
            },
            {
              title: '阶段角色',
              align: "left",
              dataIndex: 'userTitleInfo',
              scopedSlots: { customRender: 'userTitleInfo' },
            },
            // {
            //   title: '剩余工时(h)',
            //   align: "left",
            //   dataIndex: 'totalHoursAllocateds'
            // },
            {
              title: '分配工时(h)',
              align: "left",
              dataIndex: 'assignWorks'
            },
            { title: '分配日期', 
              align: "left",
              dataIndex: 'operation', 
              scopedSlots: { customRender: 'operation' } 
            },
          ],
          columns: [
          {
            title:'已选员工数（人）',
            align:"left",
            dataIndex: 'numbers',
            scopedSlots: { customRender: 'numbers' }
          },
          {
            title:'统一工时（h）',
            align:"left",
            dataIndex: 'totalHoursAllocated',
            scopedSlots: { customRender: 'totalHoursAllocated' }
          },
          {
            title:'工时合计（h）',
            align:"left",
            dataIndex: 'noticeContent',
            scopedSlots: { customRender: 'noticeContent' }
          },
        ],
        dataSource:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/bus/busProjectEstimate/upTeamTimeSheet",
          edit: "/bus/busProjectEstimate/upTeamTimeSheet",
          queryById: "/bus/busProject/queryById",          
          queryByProjectIdAndMileId:'/bus/busProjectEstimate/queryByProjectIdAndMileId',
          tagEdit: '/bus/busProjectEstimate/edit',//表格标签编辑
          milepostRoleList:'bus/busProjectMilepost/milepostRoleList',
          getAssignWorksInfoByPlanRole:'bus/busProjectEstimate/getAssignWorksInfoByPlanRole',
          assignUserList:'bus/busProjectMilepost/assignUserList'
        },
        selectedRows: [],
        selectedRowKeys: [],
        colorList:['blue','pink','cyan'],
        tagValue: [],
        inputVisible: [],
        timeDataSource:[],
        dataSourceTag: [],
        milepostId:'',
        projectId:'',
        startDate:"",
        endDate:"",
        rolesOptions:[],
        form:{
          totalWork:0
        },              
       
        
        
       
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
      this.getTagsDict()
    },
    mounted(){
       
    },
    methods: {
      addPersonnalWH(flag){
        console.log('新增----------')
        this.choiceNum = 1
        this.addvisible = true
        this.ifFlag = flag
      },



      onChangeDate(){

      },
      handleViewDetails(record){
        console.log(record,'record------点击查看----record')
        record.costRoleId = record.roleId
        this.$refs.PersonalWorkHours.getList(record.estimateId)
        this.$refs.PersonalWorkHours.personalInfo = record
        this.$refs.PersonalWorkHours.visible = true
      },
      uploadList(){
          this.onChangeRoleName(this.queryParam.roleName)
      },
      onChangeRoleName(roleId){
        this.queryParam.roleName = roleId
        let params = {
          milepostId:this.milepostId,
          projectId:this.projectId,
          roleId:roleId,
          // userId:
        }
         getAction(this.url.getAssignWorksInfoByPlanRole,params).then(res=>{
            if(res.success){
              this.timeDataSource = res.result
              if (this.timeDataSource.items && this.timeDataSource.items.length > 0) {
                let copyTagValue = []
                let copyInputVisible = []
                for (let i = 0; i < this.timeDataSource.items.length; i++) {
                  copyTagValue.push({ value: '' })
                  copyInputVisible.push({ visible: false })
                }
                this.tagValue = copyTagValue
                this.inputVisible = copyInputVisible
              }
              this.$emit('uploadList');
            }else{
              this.$message.warning(res.message)
            }
         })
      },
      handleRolesOptions(){
           postAction(this.url.assignUserList,{milepostId:this.milepostId}).then(res=>{
              if(res.success){
                this.rolesOptions = res.result.map((item,index,arr)=>{
                    let c = {label:item.roleName, value:item.id}
                    return c;
                })
              }else{
                this.$message.warning(res.message)
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
            this.onChangeRoleName(this.queryParam.roleName) //新增完刷新列表
            this.$message.success('修改成功')
          } else {
            this.$message.warning('修改失败')
          }
        });
        // this.tags = tags;
      },
      getTagsDict() {
        ajaxGetDictItems('stage_role', null).then((res) => {
          if (res.success) {
            console.log(res.result);
            this.dataSourceTag = res.result;
          }
        })
      },
      showInput(i) {
        this.inputVisible[i].visible = true;
      },
      onChangeAdd(record, e, i) {
      console.log('blur', record, e);
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
          putAction(this.url.tagEdit, { id: record.estimateId, userTitle: addTags }).then((res) => {
            if (res.success) {
              this.onChangeRoleName(this.queryParam.roleName) //新增完刷新列表
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

      onSelectChange(selectedRowKeys, selectedRows) {
        let a = []
        selectedRows.forEach(element => {
           a.push(element.userId)
        });
        this.selectedRows = selectedRows
        this.selectedRowKeys = selectedRowKeys;
        this.dataSource = selectedRows
        this.$refs.AddWorkAssignment.choiceNum = this.selectedRows.length
        this.$refs.AddWorkAssignment.selectedRole = a
        console.log(`selectedRowKeys: ${a}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      addOrEdit(){
          
          this.$refs.AddWorkAssignment.addvisible = true
          this.$refs.AddWorkAssignment.edit(this.projectId,this.milepostId,this.queryParam.roleName)
      },


      add () {
        this.edit(this.modelDefault);
      },
      edit (projectId,milepostId) {
        this.milepostId=milepostId,
        this.projectId=projectId
        this.handleRolesOptions()
      },
    }
  }
</script>
<style lang="less" scoped>

</style>

