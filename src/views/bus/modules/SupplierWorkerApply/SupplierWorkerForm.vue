<template>
  <a-modal :title="title" :maskClosable="true" :width="drawerWidth" placement="right" :closable="false"
    @close="handleCancel" :visible="visible" style="height: 100%;overflow: auto;padding-bottom: 53px;" class="aaaa">

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>

    </template>

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules" labelAlign="left">
        <!-- <a-form-model-item label="ID" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="id">
                <a-input placeholder="请输入ID" v-model="model.id" disabled :readOnly="!!model.id"/>
            </a-form-model-item> -->
        <!-- <a-form-model-item label="供应商编码" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="supplierCode">
                <a-input placeholder="请输入供应商编码" v-model="model.supplierCode" />
            </a-form-model-item> -->
        <a-form-model-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierCode">
          <a-select @change="handleChangeSupplier" placeholder="请选择供应商名称" v-model="model.supplierCode" show-search
            :filter-option="filterOption" :options="companyOption" allowClear :readOnly="!!model.id"
            :disabled="isEdit" :getPopupContainer="(target) => target.parentNode">

          </a-select>
        </a-form-model-item>
        <a-form-model-item label="采购订单编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="procureOrderCode">
          <a-auto-complete :disabled="isEdit" v-model="model.procureOrderCode" :data-source="dataSource"
            placeholder="请输入采购订单编号" @search="onSearch" @blur="getPostList" :readOnly="!!model.id" />
          <!-- <a-input :disabled="disableSubmit" placeholder="请输入采购订单编号" v-model="model.projectCode"
            @change="handlePidBlur" /> -->
        </a-form-model-item>
        <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="realname">
          <a-input placeholder="请输入姓名" :disabled="isEdit" v-model="model.realname" :readOnly="!!model.id" />
        </a-form-model-item>
        <a-form-model-item label="证件类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="idType">
          <j-dict-select-tag type="list" :disabled="isEdit" v-model="model.idType" dictCode="id_type"
            style="width:100%;" placeholder="请选择证件类型" :readOnly="!!model.id"/>
        </a-form-model-item>
        <a-form-model-item label="证件号码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="idNo">
          <a-input placeholder="请输入证件号码" :disabled="isEdit" v-model="model.idNo" :readOnly="!!model.id" />
        </a-form-model-item>
        <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
          <a-select :disabled="isEdit" v-model="model.sex" placeholder="请选择性别"
            :getPopupContainer="(target) => target.parentNode" :readOnly="!!model.id">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item label="经理" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="companyManage">
              <a-input placeholder="请输入经理" v-model="model.companyManage" disabled :readOnly="!!model.id"/>
          </a-form-model-item> -->
        <a-form-model-item label="汇报对象" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportTo">
          <a-input placeholder="请输入汇报对象" v-model="model.reportTo" :disabled="isEdit" :readOnly="!!model.id"/>
        </a-form-model-item>
        <a-form-model-item label="职位（供应商）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyDutiesName">
          <a-select @change="handleChangeWorkerPost" v-model="model.companyDutiesName" placeholder="请选择职位">
            <a-select-option v-for="item in dutiesList" :key="item.id" :value="item.id" :disabled="isEdit" :readOnly="!!model.id">{{
              item.position_dictText }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="价格（供应商）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyPrice">
          <!-- <a-input placeholder="请输入价格" v-model="model.companyPrice" disabled :readOnly="!!model.id"/> -->
          <a-input-number :step="0.01" placeholder="请输入价格" v-model="model.companyPrice" :disabled="priceDisabled || isEdit"
            :readOnly="!!model.id && priceDisabled" style="width:100%"/>

          <a-checkbox :disabled="isEdit" @change="onPriceChange" v-model="model.ifChangePrice" :readOnly="!!model.id">是否修改价格
          </a-checkbox>
        </a-form-model-item>
        <a-form-model-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
          <a-input :disabled="isEdit" placeholder="请输入手机号码" v-model="model.phone" :readOnly="!!model.id" />
        </a-form-model-item>

        <a-form-model-item label="个人邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
          <a-input :disabled="isEdit" placeholder="请输入邮箱地址" v-model="model.email" :readOnly="!!model.id"/>
        </a-form-model-item>

        <a-form-model-item label="企业邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyEmail">
          <a-input :disabled="isEdit" placeholder="请输入邮箱地址" v-model="model.companyEmail" :readOnly="!!model.id" />
        </a-form-model-item>

        <a-form-model-item label="申请客户邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ifApplyEmail">
          <a-checkbox @change="onMailChange" v-model="model.ifApplyEmail" :disabled="isEdit" :readOnly="!!model.id">
          </a-checkbox>
        </a-form-model-item>

        <a-form-model-item label="别名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="alias"
          v-if="roleCode=='supplier_manager'">
          <a-input placeholder="请输入别名" v-model="model.alias" :disabled="disableSubmit ||roleCode == 'suppliers' || !roleCode=='supplier_manager'" />
        </a-form-model-item>

        <a-form-model-item label="入职日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inductionTime"
          v-if="roleCode=='supplier_manager'">
          <j-date placeholder="请输入入职日期" :disabled="disableSubmit || roleCode == 'suppliers' || !roleCode=='supplier_manager'" v-model="model.inductionTime" style="width: 100%" />
        </a-form-model-item>
        <a-form-model-item label="邮箱（客户）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customEmail"
          v-if="roleCode=='supplier_manager'">
          <a-input :disabled="disableSubmit || roleCode == 'suppliers' || !roleCode=='supplier_manager'" placeholder="请输入邮箱地址" v-model="model.customEmail" />
        </a-form-model-item>
        <a-form-model-item label="职位（客户）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customDutiesName"
          v-if="roleCode=='supplier_manager'">
          <a-select @change="handleChangeCustomDuties" placeholder="请选择职位" v-model="model.customDutiesName" show-search
            :filter-option="filterOption" :options="customWorkerPost" allowClear :disabled="disableSubmit || roleCode == 'suppliers' || !roleCode=='supplier_manager'"
            :getPopupContainer="(target) => target.parentNode">
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="价格（客户）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customPrice"
          v-if="roleCode=='supplier_manager'">
          <a-input-number :step="0.01" placeholder="请输入价格" v-model="model.customPrice" disabled :readOnly="!!model.id"
            style="width:100%" />
        </a-form-model-item>
        <a-form-model-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="age">
          <a-input placeholder="请输入年龄" v-model="model.age" :disabled="isEdit" />
        </a-form-model-item>



        <!-- <a-form-model-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="projectName">
              <a-input placeholder="请输入项目名称" v-model="model.projectName" disabled :readOnly="!!model.id"/>
            </a-form-model-item> -->
        <!-- <a-form-model-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol"  prop="customId">
                <a-select
                    @change="handleChangeCustom"
                    placeholder="请选择客户"
                    v-model="model.customId"
                    show-search
                    :filter-option="filterOption"
                    :options="customListData"
                    allowClear 
                    :disabled="disableSubmit"
                    :getPopupContainer="(target) => target.parentNode">

                </a-select>
            </a-form-model-item>  -->

        <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="model.id">
          <a-select v-model="model.status" placeholder="请选择状态" :disabled="isEdit">
            <a-select-option v-for="item in workStatus" :key="item.sValue" :value="item.sValue">{{ item.text
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户账号" v-model="model.email" disabled :readOnly="!!model.id" />
        </a-form-model-item>
        <a-form-model-item label="初始密码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="initialPassword"
          v-if="model.id">
          <a-input placeholder="" v-model="model.initialPassword" disabled />
        </a-form-model-item>

        <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
          <a-textarea v-model="model.remark" placeholder="请输入备注" :auto-size="{ minRows: 4, maxRows: 5 }"
            :disabled="isEdit"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-spin>


    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <!-- <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消"> -->
        <a-button  @click="handleCancel" style="margin-right: .8rem">取消</a-button>
      <!-- </a-popconfirm> -->
      <a-button @click="handleSave" type="primary" :loading="confirmLoading" style="margin-right: .8rem">保存</a-button>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading"
        v-if="roleCode == 'suppliers'">保存并提交</a-button>
    </div>
  </a-modal>
</template>
  
<script>
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getAction, httpAction } from '@/api/manage'
import { addOrgUser, editUser, queryUserRole, queryall } from '@/api/api'
import { disabledAuthFilter } from "@/utils/authFilter"
import { duplicateCheck } from '@/api/api'
import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
import { USER_INFO } from '@/store/mutation-types'
export default {
  name: "supplierWorkerForm",
  components: {
    JSelectDepart
  },
  data() {
    return {
      departDisabled: false, //是否是我的部门调用该页面
      roleDisabled: false, //是否是角色维护调用该页面
      modalWidth: 830,
      drawerWidth: 830,
      modaltoggleFlag: true,
      confirmDirty: false,
      userId: "", //保存用户id
      disableSubmit: false,
      dateFormat: "YYYY-MM-DD",
      validatorRules: {
        realname: [{ required: true, message: '请输入用户名称!' }],
        supplierCode: [{ required: true, message: '请选择供应商' }],
        phone: [{ required: true, message: '请输入手机号' }, { validator: this.validatePhone }],
        email: [{ required: true, message: '请输入邮箱' }, { validator: this.validateEmail }],
        companyEmail: [{ validator: this.validateEmail }],
        customEmail: [{ validator: this.validateEmail }, { validator: this.validateFields }],
        roles: {},
        workNo: [{ required: true, message: '请输入工号' },
        { validator: this.validateWorkNo }],
        selectedroles: [{ required: true, message: '请选择角色！' }],
        ifHasChildData: [{ required: true, message: '请选择是否有下级单位数据权限！' }],
        personType: [{ required: true, message: '请选择是否负责人！' }],
        sex: [{ required: true, message: '请选择性别！', trigger: 'change' }],
        idType: [{ required: true, message: '请选择证件类型！', trigger: 'change' }],
        idNo: [{ required: true, message: '请输入证件号码！', trigger: 'blur' }, { validator: this.validateIdCard }],
        workerPost: [{ required: true, message: '请选择职位！', trigger: 'change' }],
        unitPrice: [{ required: true, message: '请输入价格！', trigger: 'blur' }],
        procureOrderCode: [{ required: true, message: '请输入采购订单编号！', trigger: 'change' }],
        inductionTime: [{ validator: this.validateFields }],
        companyPrice: [{ required: true, message: '请输入价格！' }],
        alias: [{ validator: this.validateFields }],
        customDutiesName: [{ validator: this.validateFields }]
      },
      departIdShow: false,
      title: "",
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      url: {
        fileUpload: window._CONFIG['domianURL'] + "/sys/common/upload",
        userWithDepart: "/sys/user/userDepartList", // 引入为指定用户查看部门信息需要的url
        userId: "/sys/user/generateUserId", // 引入生成添加用户情况下的url
        syncUserByUserName: "/act/process/extActProcess/doSyncUserByUserName",//同步用户到工作流
        queryTenantList: '/sys/tenant/queryList',
        busCompany: "/bus/busCompany/list",
        edit: '/sys/user/workerEdit',
        add: '/sys/user/addWorkerUser',
        getProjectCodeList: '/bus/busProject/getProjectCodeList',
        companyDuties: '/bus/busCompanyDuties/list',
        customList: '/bus/busCustom/list',
        getCustomDutiesById: '/bus/busCustom/getCustomDutiesById',
        queryById: '/bus/busCompany/queryById',
        queryOrderCodeUrl: '/bus/busCompanyPo/queryByCompanyCode',
        price: "",
      },
      rolesOptions: [],
      nextDepartOptions: [],
      fileList: [],
      workStatus: [
        {
          sValue: 1,
          text: '正常'
        },
        {
          sValue: 2,
          text: '冻结'
        }
      ],
      companyOption: [],
      addWorker: false,
      projectId: '',
      projectCodeOption: [],
      dutiesList: [],
      customListData: [],
      customWorkerPost: [],
      roleCode: Vue.ls.get(USER_INFO).roleCode,
      priceDisabled: true,
      dataSource: [],
      isEditPriceCheckbox: true,
      count: 0,
      price:"",
      isEdit: false,
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token }
    this.initRoleList()
    this.getCompany()
    this.getProjectCodeList()
    // this.initCustomList()
    console.log(Vue.ls.get(USER_INFO).roleCode)
    this.isEdit = this.disableSubmit|| this.roleCode=='supplier_manager'
  },
  computed: {
    uploadAction: function () {
      return this.url.fileUpload;
    },
    importExcelUrl: function () {
      return window._CONFIG['domianURL'] + '/sys/common/upload'
    }
  },
  watch: {
    'model.companyPrice': function (newVal, oldVal) {
      //判断是否未初始化该值，如果是初始化不需要判断
      if (this.count == 0) return
      if(parseFloat(newVal).toFixed(2) !== parseFloat(this.price).toFixed(2)) {
        this.isEditPriceCheckbox = false
        this.count++
      } else this.isEditPriceCheckbox = true
    },
  },
  methods: {
    onPriceChange(e) {
      if (this.isEditPriceCheckbox) {
        this.priceDisabled = !this.priceDisabled
        if (e.target.checked) 
          this.model.ifChangePrice = 1
         else 
          this.model.ifChangePrice = 0
        
        this.count++
      } else this.model.ifChangePrice = true
    },
    onMailChange(element) {
      if (element.target.checked) this.model.ifApplyEmail = 1
      else this.model.ifApplyEmail = 0
    },
    onSearch(value) {
      if (value == "") {
        this.dataSource = []
        return
      }
      getAction(this.url.queryOrderCodeUrl, { orderCode: value }).then(res => {
        if (res.success) {
          this.dataSource = res.result.map((value) => { return value.procureOrderCode })
        } else this.dataSource = []
      })
    },
    getPostList() {
      this.handleChangeCustom(this.model.procureOrderCode)
    },
    handleChangeCustom(id) {
      getAction(this.url.getCustomDutiesById, { procureOrderCode: id }).then(res => {
        if (res.success) {
          let result = res.result
          let dictOptions = []
          for (let i = 0; i < result.length; i++) {
            let temp = result[i];
            let item = {}
            item.label = temp.position_dictText
            item.value = temp.position_dictText
            item.hourlyWage = temp.hourlyWage
            item.position = temp.position
            dictOptions.push(item);
          }
          this.customWorkerPost = dictOptions
        } else this.customWorkerPost = []
      })
    },
    initCustomList() {
      getAction(this.url.customList).then(res => {
        if (res.success) {
          let result = res.result.records
          let dictOptions = []
          for (let i = 0; i < result.length; i++) {
            let temp = result[i];
            let item = {}
            item.label = temp.customName
            item.value = temp.customCode
            item.id = temp.id
            dictOptions.push(item);
          }
          this.customListData = dictOptions
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleChangeCustomDuties(e, label) {
      console.log(label.data.props, 'label.data.props')
      let hourlyWage = label.data.props.hourlyWage
      this.$set(this.model, 'customPrice', hourlyWage)
      this.$set(this.model, 'customDutiesName', e)
      this.model.customId = label.data.props.position
    },
    handleChangeWorkerPost(e) {
      let arr = this.dutiesList.filter(item => e == item.id)
      this.$set(this.model, 'companyPrice', arr[0].hourlyWage)
      this.$set(this.model, 'companyDutiesName', arr[0].position_dictText)
      this.model.companyDutiesId = arr[0].position
      this.price = arr[0].hourlyWage
      this.count = 0
      this.isEditPriceCheckbox = true
      console.log(arr)
    },
    handlePidBlur(e) {
      this.getProjectCodeList(e.target.value)
    },
    getProjectCodeList(projectCode) {
      getAction(this.url.getProjectCodeList, { projectCode: projectCode }).then(res => {
        if (res.success) {
          this.$set(this.model, 'projectName', res.result.projectName)
          this.$set(this.model, 'reportTo', res.result.ownerName)
          this.$set(this.model, 'customId', res.result.customId)
          this.$set(this.model, 'customer', res.result.customer)
          this.handleChangeCustom(res.result.customId)
        }
      })
    },
    handleChangeSupplier(e, label) {
      console.log(e, label, label.data.props.id)
      let id = label.data.props.id
      getAction(this.url.queryById, { id: id }).then(res => {
        if (res.success) {
          this.dutiesList = res.result.priceList
        }
      })
      // this.model.supplierName = label.componentOptions.children[0].elm.data.trim()
      this.model.supplierId = label.data.props.id
    },
    getCompany() {
      getAction(this.url.busCompany).then(res => {
        //   console.log(res.result.records,'供应商')
        let result = res.result.records
        let dictOptions = []
        for (let i = 0; i < result.length; i++) {
          let temp = result[i];
          let item = {}
          item.label = temp.name
          item.value = temp.companyCode
          item.id = temp.id
          dictOptions.push(item);
        }
        this.companyOption = dictOptions
      })
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    add(val) {
      if (val && val.suppliermark) {
        this.addWorker = val.suppliermark
        this.projectId = val.projectId
      }
      this.refresh();
      this.edit({ activitiSync: '1', userIdentity: 1 });
    },
    edit(record) {

      let that = this;
      that.visible = true;
      //根据屏幕宽度自适应抽屉宽度
      this.resetScreenSize();
      that.count = 0
      that.isEditPriceCheckbox = true
      that.userId = record.id;
      that.model = Object.assign({}, { selectedroles: '', selecteddeparts: '' }, record);
      if(that.model.companyPrice!=="") that.price = that.model.companyPrice
      else that.price = ""
      that.getPostList()
      // if(that.model.approverName=="vendoradmin") {
      //   that.roleCode = "supplier_manager"
      //   that.disableSubmit = true
      // }
      console.log(that.model, 'that.model------------that.model')

      // //身份为上级显示负责部门，否则不显示
      // if(this.model.userIdentity==2){
      //   this.departIdShow=true;
      // }else{
      //   this.departIdShow=false;
      // }

      if (record.hasOwnProperty("id")) {
        that.getUserRoles(record.id);
        that.getUserDeparts(record.id);
        //初始化checkbox值
        if (that.model.ifApplyEmail == "1") that.model.ifApplyEmail = true
        else that.model.ifApplyEmail = false
        
        if (that.model.ifChangePrice == "1") {
          that.priceDisabled = false
          that.model.ifChangePrice = true
        }
        else {
          that.priceDisabled = true
          that.model.ifChangePrice = false
        }
      }
      console.log('that.model=', that.model)
    },
    isDisabledAuth(code) {
      return disabledAuthFilter(code);
    },
    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth;
      } else {
        this.modalWidth = 830;
      }
      this.modaltoggleFlag = !this.modaltoggleFlag;
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth;
      } else {
        this.drawerWidth = 830;
      }
    },
    //初始化角色字典
    initRoleList() {
      queryall().then((res) => {
        if (res.success) {
          this.rolesOptions = res.result.map((item, index, arr) => {
            let c = { label: item.roleName, value: item.id }
            return c;
          })
          // console.log('this.rolesOptions: ',this.rolesOptions)
        }
      });
    },
    getUserRoles(userid) {
      queryUserRole({ userid: userid }).then((res) => {
        if (res.success) {
          this.model.selectedroles = res.result.join(",");
          console.log('that.model.selectedroles=', this.model.selectedroles)
        }
      });
    },
    getUserDeparts(userid) {
      let that = this;
      getAction(that.url.userWithDepart, { userId: userid }).then((res) => {
        if (res.success) {
          let departOptions = [];
          let selectDepartKeys = []
          for (let i = 0; i < res.result.length; i++) {
            selectDepartKeys.push(res.result[i].key);
            //新增负责部门选择下拉框
            departOptions.push({
              value: res.result[i].key,
              label: res.result[i].title
            })
          }
          that.model.selecteddeparts = selectDepartKeys.join(",")
          that.nextDepartOptions = departOptions;
          console.log('that.nextDepartOptions=', that.nextDepartOptions)
        }
      })
    },
    backDepartInfo(info) {
      this.nextDepartOptions = info.map((item, index, arr) => {
        let c = { label: item.text, value: item.value + "" }
        return c;
      })
    },
    refresh() {
      this.userId = ""
      this.nextDepartOptions = [];
      this.departIdShow = false;
    },
    close() {
      this.$refs.form.resetFields();
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.nextDepartOptions = [];
      this.departIdShow = false;
    },
    moment,
    handleSave() {
      const that = this;
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          if (this.addWorker) {
            this.model.supplier_id = this.projectId
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok', res.result);
              this.visible = false
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        } else {
          return false;
        }
      })
    },
    handleSubmit() {
      const that = this;
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
          let httpurl = '/sys/user/submitWorkerUser';
          let method = 'post';
          if (this.addWorker) {
            this.model.supplier_id = this.projectId
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok', res.result);
              this.visible = false
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        } else {
          return false;
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'phone',
            fieldVal: value,
            dataId: this.userId
          };
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback("手机号已存在!")
            }
          })
        } else {
          callback("请输入正确格式的手机号码!");
        }
      }
    },
    validateIdCard(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/).test(value)) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'id_no',
            fieldVal: value,
            dataId: this.userId
          };
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback("身份证号码已存在!")
            }
          })
        } else {
          callback("请输入正确格式的身份证号码!");
        }
      }
    },
    validateFields(rule, value, callback) {
      if (!value && (this.roleCode == 'suppliers'|| this.roleCode == 'supplier_manager')) {
        if (rule.fullField == "customEmail") callback("请输入客户邮箱")
        else if (rule.fullField == "alias") callback("请输入别名")
        else if (rule.fullField == "inductionTime") callback("请选择入职日期")
        else if (rule.fullField == "customDutiesName") callback("请选择客户职位")
      } else callback()
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'email',
            fieldVal: value,
            dataId: this.userId
          };
          duplicateCheck(params).then((res) => {
            console.log(res)
            if (res.success) {
              callback()
            } else {
              callback("邮箱已存在!")
            }
          })
        } else {
          callback("请输入正确格式的邮箱!")
        }
      }
    },
    validateUsername(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId,
        delFlag: 0
      };
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback("用户名已存在!")
        }
      })
    },
    validateWorkNo(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'work_no',
        fieldVal: value,
        dataId: this.userId
      };
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback("工号已存在!")
        }
      })
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value
    },
    beforeUpload: function (file) {
      var fileType = file.type;
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片');
        return false;
      }
      //TODO 验证文件大小
    },
    identityChange(e) {
      if (e.target.value === 1) {
        this.departIdShow = false;
      } else {
        this.departIdShow = true;
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
}
</script>
  
<style scoped>

.avatar-uploader>.ant-upload {
  width: 104px;
  height: 104px;
}

.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 15px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
  z-index: 999;
}
/deep/.ant-modal-body {
  overflow-y: scroll;
  height: 550px;
}
</style>

<!-- 供应商登录：供应商名称只读，默认自己，客户几个字段需要隐藏；
供应商管理员：供应商名称是下拉可选，所有字段可见，客户字段可见非必填 -->
