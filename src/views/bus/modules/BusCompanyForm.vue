<template>
  <div>
  <a-tabs :activeKey="baseKey" @change="callback" style="color: #000;">
    <a-tab-pane key="基本信息" tab="基本信息">
      <a-spin :spinning="confirmLoading">
        <j-form-container>
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-row>
              <!-- <a-col :span="24">
                <a-form-model-item label="供应商编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyCode">
                  <a-input v-model="model.companyCode" placeholder="请输入供应商编码"  :disabled="formDisabled" ></a-input>
                </a-form-model-item>
              </a-col> -->
              <a-col :span="24">
                <a-form-model-item label="供应商名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
                  <a-auto-complete
                    v-model="model.name"
                    :data-source="barcodeOptions"
                    placeholder="请输入供应商名称"
                    @select="onSelect"
                    @change="onChange"
                    :disabled="formDisabled"
                  >
                  <!-- <a-input>
                    <a-icon slot="suffix" type="search" class="certain-category-icon" @click="doSearch"/>
                  </a-input> -->
                  </a-auto-complete>
                  <!-- <a-tooltip @click="handleShowCompanyInfoQuick" v-if="showCompanyInfo">
                    <template slot="title">
                      点击查看企业详细信息
                    </template>
                    <img style="width:30px;position: absolute;right:-40px;top:-5px;" alt="111" src="@assets/showCompanyInfo.svg" />
                  </a-tooltip> -->
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="district">
                  <j-dict-select-tag v-model="model.district" :disabled="formDisabled" placeholder="请选择地区" dictCode="area_code" type="list"></j-dict-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
                  <a-input v-model="model.address" placeholder="请输入地址"  :disabled="formDisabled" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="组织类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="organizeType">
                <j-dict-select-tag v-model="model.organizeType" placeholder="请选择组织类型" dictCode="organize_type" type="list"  :disabled="formDisabled" @change="changeType"></j-dict-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="社会统一信用代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="creditNo" :rules="[{required:isShow,message:'请输入社会统一信用代码'}]">
                  <a-input v-model="model.creditNo" placeholder="请输入社会统一信用代码"  :disabled="formDisabled" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="企业类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type" :rules="[{required:isShow,message:'请选择企业类型'}]">
                  <j-dict-select-tag v-model="model.type" placeholder="请选择企业类型" dictCode="econ_type" type="list"  :disabled="formDisabled"></j-dict-select-tag>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="行业" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="industrydata" :rules="[{required:isShow,message:'请选择行业'}]">
                  <a-cascader
                      :disabled="formDisabled"
                      change-on-select
                      v-model="model.industrydata"
                      :options="industryOptions"
                      placeholder="请选择行业"
                    />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="法定代表人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="operName">
                  <a-input v-model="model.operName" placeholder="请输入法定代表人"  :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="经营状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
                  <a-input v-model="model.operateStatus" placeholder="请输入经营状态"  :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="成立日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startDate">
                  <a-input v-model="model.startDate" placeholder="请输入成立日期"  :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col>

              <!-- <a-col :span="24">
                <a-form-model-item label="注册资本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="registCapiDesc">
                  <a-input v-model="model.registCapiDesc" placeholder="请输入注册资本"  :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col> -->

              <!-- <a-col :span="24">
                <a-form-model-item label="经营范围" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="scope">
                  <a-textarea v-model="model.scope" placeholder="请输入经营范围" :disabled="formDisabled" :rows="7"></a-textarea>
                </a-form-model-item>
              </a-col> -->

              <a-col :span="24">
                <a-form-model-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customNumber">
                  <a-input v-model="model.customNumber" placeholder="请输入用户名" :disabled="userNameEdit" ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="供应商后缀" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="suffix">
                  <a-input v-model="model.suffix" placeholder="请输入供应商后缀"  :disabled="formDisabled"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="初始密码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="password">
                  <a-input v-model="model.password" placeholder="初始密码" disabled ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
                  <a-input v-model="model.remark" placeholder="请输入备注" :disabled="formDisabled" ></a-input>
                </a-form-model-item>
              </a-col>

            </a-row>
          </a-form-model>
        </j-form-container>
      </a-spin>
    </a-tab-pane>
    <a-tab-pane key="服务类型" :tab="`服务类型(${serviceData ? serviceData.length : 0})`" v-if="contacttab">
      <div class="table-operator">
        <a-button @click="handleNewServiceType" type="primary" icon="plus"  :disabled="formDisabled">新建服务类型</a-button>
      </div>
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="serviceType"
        :dataSource="serviceData"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record" >
          <a-popconfirm title="确定删除吗?" @confirm="() => deleteServiceType(record.type)">
            <a :disabled="formDisabled">删除</a>
          </a-popconfirm>
        </span>

      </a-table>

      <bus-service-type-modal ref="modalTypeForm" @ok="modalTypeForm"></bus-service-type-modal>

    </a-tab-pane>
    <a-tab-pane key="银行信息" :tab="`银行信息(${bankData ? bankData.length : 0})`" v-if="contacttab">
      
      <div class="table-operator">
        <a-button @click="handleNewBank" type="primary" icon="plus"  :disabled="formDisabled">新建银行信息</a-button>
      </div>
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="bankColumns"
        :dataSource="bankData"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record" >
          <a-popconfirm title="确定删除吗?" @confirm="() => deleteBank(record.id)">
            <a :disabled="formDisabled">删除</a>
          </a-popconfirm>
        </span>

      </a-table>

      <bus-bank-modal ref="modalBankForm" @ok="modalBankForm"></bus-bank-modal>

    </a-tab-pane>
    <a-tab-pane key="联系人" :tab="`联系人(${dataSource ? dataSource.length : 0})`" v-if="contacttab">
      <div class="table-operator">
        <a-button @click="handleHave" type="primary" icon="plus"  :disabled="formDisabled">添加已有联系人</a-button>
        <a-button @click="handleNewPerson" type="primary" icon="plus"  :disabled="formDisabled">新建联系人</a-button>
      </div>
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="districtName" slot-scope="text, record">
          <!-- <a @click="handleDetail(record)">{{ text }}</a> -->
          {{ text }}
        </template>

        <span slot="action" slot-scope="text, record" >
          <a-popconfirm title="确定删除吗?" @confirm="() => handleClear(record.id)">
            <a :disabled="formDisabled">删除</a>
          </a-popconfirm>
        </span>

      </a-table>

      <bus-person-modal ref="modalForm" @ok="modalFormOk"></bus-person-modal>
      <bus-haveperson-modal ref="modalTable" @ok="havePersonModalOk"></bus-haveperson-modal>

    </a-tab-pane>
    <a-tab-pane key="工作者" :tab="`工作者(${workerSource ? workerSource.length : 0})`" v-if="contacttab">
      <div class="table-operator">
        <a-button @click="handleWorker" type="primary" icon="plus"  :disabled="formDisabled">添加已有工作者</a-button>
        <a-button @click="handleNewWorker" type="primary" icon="plus"  :disabled="formDisabled">新建工作者</a-button>
      </div>
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="workerColumns"
        :dataSource="workerSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="districtName" slot-scope="text, record">
          <!-- <a @click="handleDetail(record)">{{ text }}</a> -->
          {{ text }}
        </template>

        <span slot="action" slot-scope="text, record" >
          <a-popconfirm title="确定删除吗?" @confirm="() => handleClear(record.id)">
            <a :disabled="formDisabled">删除</a>
          </a-popconfirm>
        </span>

      </a-table>

      <edit-form ref="workerForm" @ok="workerFormOk"></edit-form>
      <bus-haveworker-modal ref="workerTable" @ok="haveWorkerModalOk"></bus-haveworker-modal>

    </a-tab-pane>

  </a-tabs>
  <company-infomation ref="infoModal"></company-infomation>
  </div>
</template>

<script>
  let that;
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {ajaxGetDictItems} from '@/api/api'
  import BusPersonModal from './BusPersonModal'
  import BusHavepersonModal from './BusHavepersonModal'
  import editForm from './SupplierWorkerComponents/editForm'
  import BusHaveworkerModal from './BusHaveworkerModal'
  import BusServiceTypeModal from './BusServiceTypeModal'
  import BusBankModal from './BusBankModal'
  import { httpAction, getAction,postAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  // import CompanyInfomation from './CompanyInfomation'

  export default {
    name: 'BusCompanyForm',
    mixins:[JeecgListMixin],
    components: {
      ajaxGetDictItems,
      BusPersonModal,
      BusHavepersonModal,
      BusServiceTypeModal,
      BusBankModal,
      editForm,
      BusHaveworkerModal,
      contacttab:false,
      // CompanyInfomation
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false,
      },
      // contacttab: {
      //   type: Boolean,
      //   default: true,
      //   required: true,
      // }
    },
    data () {
      return {
        baseKey: '基本信息',
        isShow:true,
        model:{
          name:'',
          registCapiDesc:'',//注册资本
          creditNo:'',
          status:'',
          startDate:'',//成立日期
          operName:'',
          scope:'',
          industrydata:'',
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          // companyCode:[{ required: true, message: '请输入供应商编码!' }],
          name: [{ required: true, message: '请输入供应商名称!' }],
          district: [{ required: true, message: '请选择地区!' }],
          address: [{ required: true, message: '请输入地址!' }],
          organizeType: [{ required: true, message: '请选择组织类型!' }],
          // creditNo: [{ required: this.isShow, message: '请输入社会统一信用代码!' }],
          // type: [{ required: this.isShow, message: '请选择企业类型!' }],
          // industry: [{ required: this.isShow, message: '请选择行业!' }],
          operName: [{ required: true, message: '请输入企业法定代表人!' }],
          suffix: [{ required: true, message: '请输入供应商后缀!' }],
          customNumber:[{ required: true, message: '请输入用户名!' }],
        },
        url: {
          getBasicInfo: '/bus/busCompany/getBasicInfo', //工商信息
          list1: '/bus/busCompany/getCompanyList', //列表
          list:"",
          getPersonListByCompanyId: "/bus/busPerson/getPersonListByCompanyId",
          getWorkerListByCompanyId: "sys/user/getworkUserList",
          delete: "/bus/busPerson/delete",
          add: "/bus/busCompany/add",
          edit: "/bus/busCompany/edit",
          queryById: "/bus/busCompany/queryById",
          getAllIndustryData: '/bus/busIndustry/listHierarchy',
          // queryByNameInfo: "/bus/busCompany/queryByNameInfo",
          serviceList: "/bus/busCompanyService/list",//服务类型
          bankList: "/bus/busCompanyBank/list"//银行信息
        },
        dataSource:[],
        serviceData:[],//服务数据
        bankData:[],//银行数据
        workerSource:[],//工作者数据
        industryOptions: [], //行业数据
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          // },
          {
            title:'姓名',
            align:"left",
            sorter: true,
            dataIndex: 'name',
            scopedSlots: {customRender: 'districtName'}
          },
          {
            title:'性别',
            align:"left",
            sorter: true,
            dataIndex: 'sex_dictText'
          },
          {
            title:'职务',
            align:"left",
            sorter: true,
            dataIndex: 'job'
          },
          {
            title:'手机号码',
            align:"left",
            sorter: true,
            dataIndex: 'phone'
          },
          {
            title:'邮箱',
            align:"left",
            sorter: true,
            dataIndex: 'email'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        serviceType: [
          {
            title:'服务类型',
            align:"left",
            sorter: true,
            dataIndex: 'type_dictText'
          },
          {
            title:'服务评级',
            align:"left",
            sorter: true,
            dataIndex: 'evaluate'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        bankColumns: [
          {
            title:'银行账号',
            align:"left",
            sorter: true,
            dataIndex: 'bankCard'
          },
          {
            title:'开户行名称',
            align:"left",
            sorter: true,
            dataIndex: 'bankName'
          },
          {
            title:'收款方名称',
            align:"left",
            sorter: true,
            dataIndex: 'name'
          },
          {
            title:'收款方联系方式',
            align:"left",
            sorter: true,
            dataIndex: 'phone'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        workerColumns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          // },
          {
            title:'姓名',
            align:"left",
            sorter: true,
            dataIndex: 'realname',
            scopedSlots: {customRender: 'districtName'}
          },
          {
            title:'邮箱',
            align:"left",
            sorter: true,
            dataIndex: 'email',
          },
          {
            title:'性别',
            align:"left",
            sorter: true,
            dataIndex: 'sex_dictText',
          },
          {
            title:'年龄',
            align:"left",
            sorter: true,
            dataIndex: 'age',
          },
          {
            title:'手机号码',
            align:"left",
            sorter: true,
            dataIndex: 'phone',
          },
          {
            title:'职务',
            align:"left",
            sorter: true,
            dataIndex: 'workerPost',
          },
          {
            title: '状态',
            dataIndex: 'status_dictText',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        flag:true,
        showCompanyInfo: false,
        barcodeOptions:[],
        selectValue:[],
        loading:false,
        userNameEdit:true
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
      that = this;
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    mounted() {
      this.initIndustryOptions()
    },
    methods: {
      // 获取公司数据
      getCompanyInfo(params){
        postAction(this.url.list1,params ).then((res) => {
          if (res.success && res.result) {
            let newList = []
            for (let i = 0; i < res.result.items.length; i++) {
              let element = res.result.items[i];
              newList.push(element.name)
            }
            // debugger
            this.barcodeOptions = newList
          }else{
            this.barcodeOptions = []
          }
        })
      },
      doSearch(){
        let params={
          keyword: this.model.name,
          method: '',
          area_code: '',
          org_type: '',
          industry_code: '',
          econ_type: '',
          capi_from: '',
          capi_to: '',
          date_from: '',
          date_to: '',
          status: '',
          canbao_from: '',
          canbao_to: '',
          skip: '',
        }
        this.getCompanyInfo(params)
      },


      onSearch(searchText) {
        this.barcodeOptions = !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)];
      },
      onSelect(value) {
        if(this.model.name){
          // 更新工商信息
          getAction(this.url.getBasicInfo, { keyword: this.model.name }).then((res) => {
            if (res.success && res.result) {
              this.model.creditNo=res.result.creditNo//社会统一信用代码
              this.model.operName=res.result.operName//法定代表人
              this.model.type=res.result.econKind//企业类型
              this.model.startDate=res.result.startDate//成立日期
              this.model.registCapiDesc=res.result.registCapi//注册资本
              this.model.status=res.result.newStatus//经营状态
              this.model.scope=res.result.scope//经营范围
            }
          })
        }else{
          this.model={}
          this.model.name = value
        }
      },
      onChange(value) {
      },
      getPersonListByCompany(companyId){
        getAction(this.url.getPersonListByCompanyId, { companyId: companyId }).then((res) => {
          if (res.success) {
            this.dataSource = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      getWorkerListByCompany(companyId){
        getAction(this.url.getWorkerListByCompanyId, { companyId: companyId }).then((res) => {
          if (res.success) {
            this.workerSource = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      //获取服务类型
      getServiceList(companyId){
        getAction(this.url.serviceList, { companyId: companyId }).then((res) => {
          if (res.success) {
            this.serviceData = res.result.records
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      //获取银行信息
      getBankList(companyId){
        getAction(this.url.bankList, { companyId: companyId }).then((res) => {
          if (res.success) {
            this.bankData = res.result.records
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      //初始化行业
      initIndustryOptions() {
        getAction(this.url.getAllIndustryData).then(res => {
          if (res.success) {
            this.industryOptions = res.result
          }
        })
      },

      companyNameChange(e){
        if (!e) {
          return
        }
        let value = e.target.value
        // this.getShowCompanyInfo(value)
      },
      // getShowCompanyInfo(name){
      //   getAction(this.url.queryByNameInfo,{name:name}).then(res => {
      //     if (res.success == 0) {
      //       this.showCompanyInfo = false;
      //     }else{
      //       this.showCompanyInfo = true;
      //     }
      //   })

      // },
      add (val) {
        this.dataSource = []
          this.userNameEdit = false
        this.edit(this.modelDefault);
      },
      edit (record) {
        if(record){
          this.$forceUpdate()
        }
        this.model = Object.assign({}, record);
        if(this.model.organizeType == '2'){
          this.isShow = false
        }
        if(this.model.id){
          this.getPersonListByCompany(this.model.id)
          this.getWorkerListByCompany(this.model.id)
          this.getServiceList(this.model.id)
          this.getBankList(this.model.id)

        }
        if(this.model.name){
          // this.getShowCompanyInfo(this.model.name);
        }

        if (this.model.industrydata) {
          if (this.model.industrydata.indexOf(',') > 0) {
            this.model.industry = this.model.industrydata.split(',')
          } else {
            let temp = []
            temp.push(this.model.industrydata)
            this.model.industry = temp
          }
        }
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            this.model.personList = this.dataSource
            this.model.serviceList = this.serviceData
            this.model.bankList = this.bankData
            this.model.workUserList = this.workerSource
            if(this.model.industrydata){
              this.model.industry = this.model.industrydata.join(',')
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      callback(key) {
        this.baseKey = key
        if (key == '工商信息') {
          getAction(this.url.getBasicInfo, { keyword: this.model1.name }).then(res => {
            if (res.success) {
              this.model2 = res.result
            } else {
              this.$message.warning(res.message)
            }
          })
        } else if (key == '法律风险') {
          getAction(this.url.getCaseDetailListByName, { keyword: this.model1.name }).then(res => {
            if (res.success) {
              this.model3 = res.result
              for (let i = 0; i < this.model3.length; i++) {
                let element = this.model3[i];
                let temp = JSON.parse(element.relatedItems)
                this.model3[i].relatedItems = temp;
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        } else if (key == '经营风险') {
          getAction(this.url.getAdminPunishByName, { keyword: this.model1.name }).then(res => {
            if (res.success) {
              this.model4 = res.result
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      },
      handleHave(){
        this.$refs.modalTable.add()
        this.$refs.modalTable.title = "添加已有联系人";
        this.$refs.modalTable.disableSubmit = false;
      },
      handleWorker(){
        this.$refs.workerTable.add()
        this.$refs.workerTable.title = "添加已有工作者";
        this.$refs.workerTable.disableSubmit = false;
      },
      handleShowCompanyInfoQuick(){
        if(this.model.name){
          this.$refs.infoModal.title = "工商信息";
          this.$refs.infoModal.disableSubmit = false;
          this.$refs.infoModal.visible = true;
          this.$refs.infoModal.isUnitname = this.model.name
          this.$refs.infoModal.callback("工商信息")
        }
      },
      handleNewPerson(){
        this.$refs.modalForm.add('companyName')
        this.$refs.modalForm.title = "添加联系人";
        this.$refs.modalForm.disableSubmit = false;
        this.$refs.modalForm.ifShowCompany = false;

      },
      handleNewWorker(){
        this.$refs.workerForm.add()
        this.$refs.workerForm.title = "添加工作者";
        this.$refs.workerForm.disableSubmit = false;

      },
      handleNewServiceType(){
        this.$refs.modalTypeForm.add()
        this.$refs.modalTypeForm.title = "添加服务类型";
        this.$refs.modalTypeForm.disableSubmit = false;
        this.$refs.modalTypeForm.ifShowCompany = false;

      },
      handleNewBank(){
        this.$refs.modalBankForm.add()
        this.$refs.modalBankForm.title = "添加银行信息";
        this.$refs.modalBankForm.disableSubmit = false;
        this.$refs.modalBankForm.ifShowCompany = false;

      },
      modalTypeForm(result){
        ajaxGetDictItems('service_type', null).then((res) => {
          if (res.success) {
            let text = res.result.find(i => i.value === result.type).text
            result.type_dictText = text
              this.serviceData.push(result)
          }
        })

        //
        // this.serviceData.push(res.result)
      },
      modalBankForm(result){
        this.bankData.push(result)
      },
      modalFormOk(result){
        this.dataSource.push(result)
      },
      workerFormOk(result){
        this.workerSource.push(result)
      },
      deleteServiceType(type){
        console.log('this.serviceData',this.serviceData)
        this.serviceData = this.serviceData.filter(item => item.type !== type);
      },
      deleteBank(id){
        this.bankData = this.bankData.filter(item => item.id !== id);
      },
      handleClear(id){
        this.workerSource = this.workerSource.filter(item => item.id !== id);
      },
      havePersonModalOk(result) {
        for (const item of this.dataSource) {
          for (const j of result) {
            if (j.id === item.id) {
              this.$message.warning("添加联系人" + item.name + "已存在，请重新添加！");
              return
            }
          }
        }
        this.dataSource = this.dataSource.concat(result)
      },
      haveWorkerModalOk(result) {
        for (const item of this.workerSource) {
          for (const j of result) {
            if (j.id === item.id) {
              this.$message.warning("添加工作者" + item.name + "已存在，请重新添加！");
              return
            }
          }
        }
        this.workerSource = this.workerSource.concat(result)
      },
      handleTableChange(){

      },
      changeType(val){
        this.$nextTick(()=>{
          if(val == '1'){
            this.isShow = true
          }
          else{
            this.isShow = false
          }
          //表单的 ref  清空验证
          this.$refs['form'].clearValidate();
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.table-operator{
  margin: 10px 0;
}
/deep/.ant-select-auto-complete.ant-select .ant-input[disabled]{
  color: #565656;
}
</style>