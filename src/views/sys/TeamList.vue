<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-row :gutter="10">
    <a-col :md="8" :sm="24" style="height: 70vh">
      <a-card :bordered="false" >
        <!-- 按钮操作区域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd(1)" type="primary" icon="plus">添加单位</a-button>
          <!-- <a-button @click="handleAdd(2)" type="primary">添加下级</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('团队信息')">导出</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">导入</a-button>
          </a-upload> -->
          <a-button title="删除多条数据" @click="delTeam" type="default">删除单位</a-button>
          <!--<a-button @click="refresh" type="default" icon="reload" :loading="loading">刷新</a-button>-->
        </a-row>
        <div style="background: #fff; padding-left: 16px; height: 100%; margin-top: 5px">
          <a-alert type="info" :showIcon="true">
            <div slot="message">
              当前选择：<span v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</span>
              <a v-if="this.currSelected.title" style="margin-left: 10px" @click="onClearSelected">取消选择</a>
            </div>
          </a-alert>
          <!-- <a-input-search @search="onSearch" style="width: 100%; margin-top: 10px" placeholder="请输入单位名称" /> -->
          <!-- 树-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
                <span style="user-select: none">
                  <!-- checkable -->

                  <a-tree
                    showIcon
                    showLine
                    multiple
                    @select="onSelect"
                    @check="onCheck"
                    @rightClick="rightHandle"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :treeData="departTree"
                    :checkStrictly="checkStrictly"
                    :expandedKeys="iExpandedKeys"
                    :autoExpandParent="autoExpandParent"
                    @expand="onExpand"
                  >
                    <!-- <a-tree :tree-data="treeData" show-icon default-expand-all :default-selected-keys="['0-0-0']"> -->
                    <!-- <a-icon slot="switcherIcon" type="down" /> -->
                    <!-- <a-icon slot="switcherIcon" type="plus-square" /> -->
                    <!-- <a-icon slot="child" type="line" /> -->
                    <img src="@/assets/dot2.png" slot="child" style="margin-right: 0px" width="10px" />
                    <!-- <a-icon type="ellipsis" /> -->
                    <!-- <a-icon type="line" /> -->
                    <!-- <a-icon slot="parent" type="down" /> -->
                    <a-icon slot="smile" type="team" />
                    <!--<a-icon slot="switcherIcon" type="down" /> -->
                  </a-tree>
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <!-- <a-menu slot="overlay">
                  <a-menu-item @click="handleAdd(3)" key="1">添加</a-menu-item>
                  <a-menu-item @click="handleDelete" key="2">删除</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu> -->
              </a-dropdown>
            </template>
          </a-col>
        </div>
      </a-card>
      <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
      <!-- <div class="drawer-bootom-button">
        <a-dropdown :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
            <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
            <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作 <a-icon type="up" />
          </a-button>
        </a-dropdown>
      </div> -->
      <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
    </a-col>
    <a-col :md="16" :sm="26">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基本信息" key="1">
          <a-card :bordered="false" v-if="selectedKeys.length > 0">
            <a-form-model ref="form" :model="model" :rules="validatorRules">
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departName" label="单位名称">
                <a-input placeholder="请输入单位名称" v-model="model.departName" />
              </a-form-model-item>
              <!-- <a-form-model-item  :labelCol="labelCol" :wrapperCol="wrapperCol"  label="负责人">
                <a-input placeholder="请选择负责人" v-model="model.leaderId"/>
              </a-form-model-item> -->
              <!-- <a-form-model-item label="单位所在地" :labelCol="labelCol" :wrapperCol="wrapperCol"> -->
                <!--<j-area-linkage type="cascader" v-model="model.projectLocationName" placeholder="请输入省市区" />-->
                <!-- <a-cascader
                  v-model="model.projectLocationName"
                  :options="areaOptions"
                  :load-data="getLoadData"
                  placeholder="请选择省/市/区"
                />
              </a-form-model-item> -->
              <!--              <a-form-model-item v-if="model.leaderName?true:false" :labelCol="labelCol" :wrapperCol="wrapperCol" label="负责人">-->
              <!--                <a-input disabled v-model="model.leaderName" />-->
              <!--              </a-form-model-item>-->
              <!--              <a-form-model-item-->
              <!--                v-if="!model.leaderName?true:false"-->
              <!--                :labelCol="labelCol"-->
              <!--                :wrapperCol="wrapperCol"-->
              <!--                label="负责人">-->
              <!--                <a-select-->
              <!--                  v-model="model.leaderId"-->
              <!--                  :options="dictOptions"-->
              <!--                  allowClear-->
              <!--                  placeholder="请选择负责人"-->
              <!--                />-->
              <!--              </a-form-model-item>-->
              <!-- <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级团队">
                <a-tree-select
                  style="width:100%"
                  :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
                  :treeData="treeData"
                  :disabled="disable"
                  v-model="model.parentId"
                  placeholder="无">
                </a-tree-select>
              </a-form-model-item> -->
              <!-- <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orgCode" label="机构编码">
                <a-input disabled placeholder="请输入机构编码" v-model="model.orgCode" />
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orgCategory" label="机构类型">
                <template v-if="orgCategoryDisabled">
                  <a-radio-group v-model="model.orgCategory" placeholder="请选择机构类型">
                    <a-radio value="1">
                      公司
                    </a-radio>
                  </a-radio-group>
                </template>
                <template v-else>
                  <a-radio-group v-model="model.orgCategory" placeholder="请选择机构类型">
                    <a-radio value="2">
                      团队
                    </a-radio>
                    <a-radio value="3">
                      岗位
                    </a-radio>
                  </a-radio-group>
                </template>
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
                <a-input-number v-model="model.departOrder" />
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
                <a-input placeholder="请输入手机号" v-model="model.mobile" />
              </a-form-model-item>
              <a-form-model-item  :labelCol="labelCol" :wrapperCol="wrapperCol"  label="地址">
                <a-input placeholder="请输入地址" v-model="model.address"/>
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
                <a-textarea placeholder="请输入备注" v-model="model.memo"/>
              </a-form-model-item> -->
            </a-form-model>
            <div class="anty-form-btn">
              <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
              <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">保存</a-button>
            </div>
          </a-card>
          <a-card v-else>
            <a-empty>
              <span slot="description"> 请先选择一个单位! </span>
            </a-empty>
          </a-card>
        </a-tab-pane>
        <!-- <a-tab-pane tab="用户信息" key="2" forceRender>
          <depart-auth-modal ref="departAuth"/>
        </a-tab-pane> -->
        <a-tab-pane tab="用户信息" key="2" forceRender>
          <Dept-User-Info ref="DeptUserInfo" @clearSelectedDepartKeys="clearSelectedDepartKeys"></Dept-User-Info>
        </a-tab-pane>
        <a-tab-pane tab="组织" key="3" forceRender>
          <Dept-User-Tree ref="DeptUserTree" @clearSelectedDepartKeys="clearSelectedDepartKeys"/>
        </a-tab-pane>
      </a-tabs>
    </a-col>

    <bus-depart-modal ref="departModal" @ok="loadTree"></bus-depart-modal>
  </a-row>
</template>
<script>
import moment from 'dayjs'
import BusDepartModal from '../sys/modules/BusDepartModal'
import { queryDepartTreeLists, searchByKeywords, deleteByDepartId } from '@/api/api'
import { httpAction, deleteAction, postAction, getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import DepartAuthModal from '../system/modules/DepartAuthModal'
import DeptUserInfo from './modules/DeptUserInfo'
import DeptUserTree from './modules/DeptUserTree'
// 表头
const columns = [
  {
    title: '机构名称',
    dataIndex: 'departName',
  },
  {
    title: '机构类型',
    align: 'center',
    dataIndex: 'orgType',
  },
  {
    title: '机构编码',
    dataIndex: 'orgCode',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '传真',
    dataIndex: 'fax',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'departOrder',
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'DepartList',
  mixins: [JeecgListMixin],
  components: {
    DepartAuthModal,
    BusDepartModal,
    DeptUserInfo,DeptUserTree
  },
  data() {
    return {
      dictOptions: [],
      iExpandedKeys: [],
      loading: false,
      autoExpandParent: true,
      currFlowId: '',
      currFlowName: '',
      disable: true,
      treeData: [],
      visible: false,
      departTree: [],
      rightClickSelectedKey: '',
      rightClickSelectedOrgCode: '',
      hiding: true,
      model: {},
      dropTrigger: '',
      depart: {},
      columns: columns,
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      allTreeKeys: [],
      checkStrictly: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      graphDatasource: {
        nodes: [],
        edges: [],
      },
      validatorRules: {
        departName: [{ required: true, message: '请输入机构/单位名称!' }],
        orgCode: [{ required: true, message: '请输入机构编码!' }],
        orgCategory: [{ required: true, message: '请输入机构类型!' }],
        mobile: [{ validator: this.validateMobile }],
      },
      url: {
        delete: '/sys/sysDepart/delete',
        edit: '/sys/sysDepart/editTeam',
        beforeEdit: '/sys/sysDepart/beforeEdit',
        deleteBatch: '/sys/sysDepart/deleteBatch',
        exportXlsUrl: 'sys/sysDepart/exportXls',
        importExcelUrl: 'sys/sysDepart/importExcel',
        teamUserList: '/sys/user/teamUserList',
        getAreaData: '/system/sysRegionProvince/selectAllNameAndCode',
        selectByProvinceCode: '/system/sysRegionProvince/selectByProvinceCode',
        selectByCityCode: '/system/sysRegionProvince/selectByCityCode',
        areaOptions: '/bus/busDistrict/queryByAreaCodes',
      },
      orgCategoryDisabled: false,
      areaOptions: [],
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  created() {
    this.currFlowId = this.$route.params.id
    this.currFlowName = this.$route.params.name
    // this.loadTree()
    this.initAreaData()
  },
  mounted() {
    this.initTeamUserList()
  },
  methods: {
    loadData() {
      this.refresh()
    },
    loadTree() {
      var that = this
      that.treeData = []
      that.departTree = []
      queryDepartTreeLists().then((res) => {
        if (res.success) {
          //团队全选后，再添加团队，选中数量增多
          this.allTreeKeys = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            // temp.slots = {icon: 'smile'},
            that.treeData.push(temp)
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
            that.getAllKeys(temp)
            // console.log(temp.id)
          }
          this.loading = false
        }
      })
    },
    initTeamUserList() {
      postAction(this.url.teamUserList)
        .then((res) => {
          if (res.success) {
            let result = res.result
            let dictOptions = []
            for (let i = 0; i < result.length; i++) {
              let temp = result[i]
              let item = {}
              item.label = temp.realname
              item.value = temp.id
              dictOptions.push(item)
            }
            this.dictOptions = dictOptions
          } else {
            this.$message.warn(`获取失败：` + res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    refresh() {
      this.loading = true
      this.loadTree()
    },
    // 右键操作方法
    rightHandle(node) {
      this.dropTrigger = 'contextmenu'
      console.log(node.node.eventKey)
      this.rightClickSelectedKey = node.node.eventKey
      this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    backFlowList() {
      this.$router.back(-1)
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    // 右键下拉关闭下拉框
    closeDrop() {
      this.dropTrigger = ''
    },
    addRootNode() {
      this.$refs.nodeModal.add(this.currFlowId, '')
    },
    delTeam() {
      if (!this.currSelected.title) {
        this.$message.warning('请选择一条记录！')
        return
      }
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '确定要删除所选中- ' + that.currSelected.title + ' ，以及子节点数据吗?',
        onOk: function () {
          deleteAction(that.url.deleteBatch, { ids: that.currSelected.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadTree()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },

    batchDel: function () {
      // console.log(this.checkedKeys)
      if (this.checkedKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.checkedKeys.length; a++) {
          ids += this.checkedKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，以及子节点数据吗?',
          onOk: function () {
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTree()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          },
        })
      }
    },
    onSearch(value) {
      let that = this
      if (value) {
        searchByKeywords({ keyWord: value }).then((res) => {
          if (res.success) {
            that.departTree = []
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.departTree.push(temp)
            }
          } else {
            that.$message.warning(res.message)
          }
        })
      } else {
        that.loadTree()
      }
    },
    nodeModalOk() {
      this.loadTree()
    },
    nodeModalClose() {},
    hide() {
      this.visible = false
    },
    onCheck(checkedKeys, info) {
      // console.log('onCheck', checkedKeys, info)
      this.hiding = false
      //---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
      //---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------
    },
    onSelect(selectedKeys, e) {
      // console.log('selected', selectedKeys, e)
      this.hiding = false
      let record = e.node.dataRef
      if (record.projectLocationName) {
        if (record.projectLocationName.indexOf(',') > 0) {
          this.setLoadData(record.projectLocationName.split(','))
          record.projectLocationName = record.projectLocationName.split(',')
        }
      }
      this.currSelected = Object.assign({}, record)
      this.model = this.currSelected
      this.selectedKeys = [record.key]
      this.model.parentId = record.parentId
      this.setValuesToForm(record)
      // this.$refs.departAuth.show(record.id);

      this.$refs.DeptUserInfo.onClearSelected()
      this.$refs.DeptUserInfo.open(record)
      this.$refs.DeptUserTree.open(record)
    },
    clearSelectedDepartKeys() {
      this.checkedKeys = []
      this.selectedKeys = []
      this.currentDeptId = ''
      this.$refs.DeptUserInfo.currentDeptId = ''
    },
    // 触发onSelect事件时,为团队树右侧的form表单赋值
    setValuesToForm(record) {
      if (record.orgCategory == '1') {
        this.orgCategoryDisabled = true
      } else {
        this.orgCategoryDisabled = false
      }
    },
    getCurrSelectedTitle() {
      return !this.currSelected.title ? '' : this.currSelected.title
    },
    onClearSelected() {
      this.hiding = true
      this.checkedKeys = []
      this.currSelected = {}
      this.selectedKeys = []
      // this.$refs.departAuth.departId = ''
    },
    handleNodeTypeChange(val) {
      this.currSelected.nodeType = val
    },
    notifyTriggerTypeChange(value) {
      this.currSelected.notifyTriggerType = value
    },
    receiptTriggerTypeChange(value) {
      this.currSelected.receiptTriggerType = value
    },
    test() {},
    submitCurrForm() {
      var that = this

      let msg = ''
      let status = 200
      // if (this.currSelected.projectLocationName) {
      //   this.currSelected.projectLocationName = this.currSelected.projectLocationName.join(',')
      // }
      this.model.createTime = moment(new Date(this.model.createTime)).format('YYYY-MM-DD HH:mm:ss')
      this.model.updateTime = moment(new Date(this.model.updateTime)).format('YYYY-MM-DD HH:mm:ss')
      // await httpAction(this.url.beforeEdit, this.currSelected, 'put').then((res) => {
      //   if (res.success) {
      //     status = 200
      //     this.setLoadData(this.model.projectLocationName.split(','))
      //   } else {
      //     status = 201
      //     msg = res.message
      //   }
      // })

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.currSelected.id) {
            this.$message.warning('请点击选择要修改团队!')
            return
          }

          if (status == 201) {
            that.$confirm({
              title: '确认操作',
              content: msg,
              onOk: function () {
                //如果
                httpAction(that.url.edit, that.currSelected, 'put').then((res) => {
                  // console.log(1111,that.currSelected)
                  if (res.success) {
                    that.$message.success('保存成功!')
                    that.loadTree()
                  } else {
                    that.$message.error(res.message)
                  }
                })
              },
            })
          } else {
            //如果
            httpAction(that.url.edit, that.currSelected, 'put').then((res) => {
              //  console.log(22222,that.currSelected)
              if (res.success) {
                that.$message.success('保存成功!')
                that.loadTree()
              } else {
                that.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    emptyCurrForm() {
      this.$refs.form.resetFields()
      this.model = {}
    },
    nodeSettingFormSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('Received values of form: ', this.model)
        }
      })
    },
    openSelect() {
      this.$refs.sysDirectiveModal.show()
    },
    handleAdd(num) {
      if (num == 1) {
        this.$refs.departModal.add()
        this.$refs.departModal.title = '新增'
      } else if (num == 2) {
        let key = this.currSelected.key
        if (!key) {
          this.$message.warning('请先点击选中上级单位！')
          return false
        }
        this.$refs.departModal.add(this.selectedKeys)
        this.$refs.departModal.title = '新增'
      } else {
        this.$refs.departModal.add(this.rightClickSelectedKey)
        this.$refs.departModal.title = '新增'
      }
    },
    handleDelete() {
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '确定要删除此单位以及子节点数据吗?',
        onOk: function () {
          deleteByDepartId({ id: that.rightClickSelectedKey }).then((resp) => {
            if (resp.success) {
              //删除成功后，去除已选中中的数据
              that.checkedKeys.splice(
                that.checkedKeys.findIndex((key) => key === that.rightClickSelectedKey),
                1
              )
              that.$message.success('删除成功!')
              that.loadTree()
              //删除后同步清空右侧基本信息内容
              let orgCode = that.model.orgCode
              if (orgCode && orgCode === that.rightClickSelectedOrgCode) {
                that.onClearSelected()
              }
            } else {
              that.$message.warning('删除失败!')
            }
          })
        },
      })
    },
    selectDirectiveOk(record) {
      console.log('选中指令数据', record)
      this.nodeSettingForm.setFieldsValue({ directiveCode: record.directiveCode })
      this.currSelected.sysCode = record.sysCode
    },
    getFlowGraphData(node) {
      this.graphDatasource.nodes.push({
        id: node.id,
        text: node.flowNodeName,
      })
      if (node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          let temp = node.children[a]
          this.graphDatasource.edges.push({
            source: node.id,
            target: temp.id,
          })
          this.getFlowGraphData(temp)
        }
      }
    },
    //---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------
    expandAll() {
      this.iExpandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.iExpandedKeys = []
    },
    checkALL() {
      this.checkStriccheckStrictlytly = false
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      //this.checkedKeys = this.defaultCheckedKeys
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    getAllKeys(node) {
      // console.log('node',node);
      this.allTreeKeys.push(node.key)
      if (node.children && node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          this.getAllKeys(node.children[a])
        }
      }
    },
    //---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------
    /**
     * 初始化省市县三级联动
     */
    initAreaData() {
      let that = this
      getAction(that.url.getAreaData).then((res) => {
        if (res.success) {
          if (res.result.length > 0) {
            for (let i = 0; i < res.result.length; i++) {
              let element = res.result[i]
              element.isLeaf = false
            }
          }
          that.areaOptions = res.result
        }
      })
    },
    getLoadData(selectedOptions) {
      let that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      let flag = targetOption.parentCode
      if (targetOption.parentCode) {
        // load options lazily
        getAction(that.url.selectByCityCode, { cityCode: targetOption.value }).then((res) => {
          if (res.success) {
            targetOption.loading = false

            if (res.result.length > 0) {
              for (let i = 0; i < res.result.length; i++) {
                let element = res.result[i]
                element.isLeaf = true
              }
            }
            targetOption.children = res.result
            this.areaOptions = [...this.areaOptions]
          }
        })
      } else {
        // load options lazily
        let that = this
        getAction(that.url.selectByProvinceCode, { provinceCode: targetOption.value }).then((res) => {
          if (res.success) {
            targetOption.loading = false

            if (res.result.length > 0) {
              for (let i = 0; i < res.result.length; i++) {
                let element = res.result[i]
                element.isLeaf = false
              }
            }
            targetOption.children = res.result
            this.areaOptions = [...this.areaOptions]
          }
        })
      }
    },
    // 省市区组件回显
    setLoadData(arraycity) {
      let that = this
      getAction(that.url.getAreaData).then((res) => {
        if (res.success) {
          if (res.result.length > 0) {
            for (let i = 0; i < res.result.length; i++) {
              let element = res.result[i]
              element.isLeaf = false
            }
          }
          that.areaOptions = res.result

          //省
          getAction(that.url.selectByProvinceCode, { provinceCode: arraycity[0] }).then((res) => {
            if (res.success) {
              if (res.result.length > 0) {
                let thisdata = that.areaOptions.find((t) => t.value == arraycity[0])
                // console.log(that.areaOptions)
                // console.log(thisdata)
                thisdata.children = res.result
                that.areaOptions = [...that.areaOptions]
                // 市
                getAction(that.url.selectByCityCode, { cityCode: arraycity[1] }).then((res1) => {
                  if (res1.success) {
                    if (res1.result.length > 0) {
                      that.areaOptions
                        .find((t) => t.value == arraycity[0])
                        .children.find((t) => t.value == arraycity[1]).children = res1.result
                      that.areaOptions = [...that.areaOptions]
                      that.model.projectLocationName = arraycity
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.ant-col-md-16 {
  background-color: #fff;
}
.ant-card-body .table-operator {
  margin: 15px;
}

.anty-form-btn {
  width: 100%;
  text-align: center;
}

.anty-form-btn button {
  margin: 0 5px;
}

.anty-node-layout .ant-layout-header {
  padding-right: 0;
}

.header {
  padding: 0 8px;
}

.header button {
  margin: 0 3px;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

#app .desktop {
  height: auto !important;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.drawer-bootom-button {
  /*position: absolute;*/
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

/deep/ .ant-input[disabled] {
  color: rgb(0 0 0);
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 1;
}

/deep/ .ant-select-disabled {
  color: rgb(0 0 0 / 1);
}
.anty-form-btn[data-v-5388d457] {
  margin-top: 200px;
}
</style>