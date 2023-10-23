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
            <p style="font-size: 24px;font-weight: bold;color: #2F3133;">项目编辑</p>
            <a-button type="primary" @click="submitForm">
            保存
            </a-button>
        </div>
        <div style="margin-bottom:30px">
            <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
                <!-- -----------基础信息-------------- -->
                <div>
                    <div style="display: flex;justify-content: space-between;align-items: center;" @click="handleClick(1)">
                        <sapn style="font-size: 16px;font-weight: bold;color: #2F3133;">基础信息</sapn>
                        <div style="width: 80%;border: 1px dotted #E8EEF7;height: 1px;"></div>
                        <span><a-icon :type=" ifShow1?'down':'right' " /></span>
                    </div>
                    <div style="margin-top:30px;margin-left:30px;" v-show="ifShow1">
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>项目名称
                            </a-col>
                            <a-col :span="18">
                                <a-input style="width: 90%;" v-model="model.projectName" placeholder="请输入项目名称"></a-input>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>项目类别
                            </a-col>
                            <a-col :span="18">
                                <j-dict-select-tag v-model="model.projectType" placeholder="请选择项目类别" dictCode="project_type"
                                style="width: 90%;"/>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>负责人
                            </a-col>
                            <a-col :span="18">
                                <a-select
                                    show-search
                                    placeholder="选择项目负责人管理项目"
                                    option-filter-prop="children"
                                    :filter-option="filterOption"
                                    @change="handleChange"
                                    v-model="model.principal"
                                    allowClear style="width: 90%;"
                                    :getPopupContainer="(target) => target.parentNode"
                                >
                                    <a-select-option :value="item.value" v-for="item in leaderOptions" :key="item.id">
                                    <div style="display: flex;align-items: center;">
                                        <div class="selectoptionCss">{{ item.label.slice(0,1) }}</div>
                                        <span>{{ item.label }}</span>
                                    </div>
                                    </a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>客户
                            </a-col>
                            <a-col :span="18">
                                <!-- <a-input style="width: 90%;" v-model="model.customer" placeholder="请输入客户"></a-input> -->
                                <a-select
                                    @change="handleChangeCustom"
                                    placeholder="请选择客户"
                                    v-model="model.customId"
                                    show-search
                                    :filter-option="filterOption"
                                    :options="customListData"
                                    allowClear 
                                    :disabled="disableSubmit"
                                    :getPopupContainer="(target) => target.parentNode"
                                    style="width: 90%;">

                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>起止时间
                            </a-col>
                            <a-col :span="18">
                                <j-date :show-time="true"  date-format="YYYY-MM-DD" placeholder="请选择开始时间" v-model="model.startTime" style="width: 43%;"></j-date>
                                <span class="query-group-split-cust" style="width: 10%;"></span>
                                <j-date :show-time="true"  date-format="YYYY-MM-DD" placeholder="请选择结束时间" v-model="model.endTime" style="width: 43%;"></j-date>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <!-- -----------高级信息--------------- -->
                <div style="margin-top:30px">
                    <div style="display: flex;justify-content: space-between;align-items: center;" @click="handleClick(2)">
                        <sapn style="font-size: 16px;font-weight: bold;color: #2F3133;">高级信息</sapn>
                        <div style="width: 80%;border: 1px dotted #E8EEF7;height: 1px;"></div>
                        <span><a-icon  :type=" ifShow2?'down':'right' " /></span>
                    </div>
                    <div  style="margin-left:30px;margin-top:30px" v-if="ifShow2">
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                签约实体
                            </a-col>
                            <a-col :span="18">
                                <j-dict-select-tag v-model="model.contractEntity" placeholder="请选择签约实体" dictCode="contract_entity"
                                style="width: 90%;"/>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                交付地点
                            </a-col>
                            <a-col :span="18">
                                <j-multi-select-tag v-model="model.deliveryPlace" placeholder="请输入交付地点" dictCode="delivery_place"
                                style="width: 90%;" />
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                销售
                            </a-col>
                            <a-col :span="18">
                                <a-input  v-model="model.sale" placeholder="请输入销售名" style="width: 90%;"></a-input>
                            </a-col>
                            </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                机会编号
                            </a-col>
                            <a-col :span="18">
                                <a-input style="width: 90%;" v-model="model.chanceCode" placeholder="请输入机会编号"></a-input>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                外部项目编号
                            </a-col>
                            <a-col :span="18">
                                <a-input style="width: 90%;" v-model="model.otherCode" placeholder="请输入编号"></a-input>
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <!-- -----------回款信息----------------- -->
                <div style="margin-top:30px">
                    <div style="display: flex;justify-content: space-between;align-items: center;" @click="handleClick(3)">
                        <sapn style="font-size: 16px;font-weight: bold;color: #2F3133;">回款信息</sapn>
                        <div style="width: 80%;border: 1px dotted #E8EEF7;height: 1px;"></div>
                        <span><a-icon  :type=" ifShow3?'down':'right' " /></span>
                    </div>
                    <div  style="margin-left:30px;margin-top:30px" v-if="ifShow3">
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>回款周期设置
                            </a-col>
                            <a-col :span="18">
                                <j-dict-select-tag
                                v-model="model.collectionCycle"
                                placeholder="请选择回款周期设置"
                                dictCode="collection_cycle"
                                :getPopupContainer="node => node.parentNode"
                                style="width: 90%;"/>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>回款通知人
                            </a-col>
                            <a-col :span="18">
                                <a-select
                                    mode="tags"
                                    placeholder="请选择回款通知人"
                                    option-filter-prop="children"
                                    :filter-option="filterOption"
                                    @change="handleChange"
                                    v-model="model.collectionWarningUid"
                                    allowClear style="width: 90%;"
                                    :getPopupContainer="(target) => target.parentNode"
                                >
                                    <a-select-option :value="item.value" v-for="item in warningUidOptions" :key="item.id">
                                    <div style="display: flex;align-items: center;">
                                        <div class="selectoptionCss">{{ item.text.slice(0,1) }}</div>
                                        <span>{{ item.text }}</span>
                                    </div>
                                    </a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>回款通知方式
                            </a-col>
                            <a-col :span="18">
                                <j-dict-select-tag v-model="model.collectionWarningType"
                                        dictCode="warning_type" style="width: 90%;"
                                        placeholder="邮件/站内信/邮件+站内信"
                                        />
                            </a-col>
                        </a-row>
                        <a-row v-if="model.collectionCycle==1">
                            <div v-for="(item, index) in backtoArticle" :key="index" >
                                <a-col :span="6" style="margin-top:15px">
                                    回款时间
                                </a-col>
                                <a-col :span="18" style="margin-top:15px">
                                    <a-date-picker
                                    valueFormat="YYYY-MM-DD"
                                    placeholder="请选择回款时间"
                                    v-model="item.collectionTimes"
                                    style="width: 90%; margin-right: 3%"/>
                                    <img :src="require('@/assets/sc.png')" v-if="backtoArticle.length >1" @click="() => DeleteCollectiontime(item)"/>
                                </a-col>
                            </div>

                        </a-row>
                        <a-row v-if="model.collectionCycle==1">
                            <a-col :span="24" style="width: 103px;margin-top:15px;margin-left: 78.1%;color: #CD128A;">
                                <div  @click="AddCollectiontime">
                                    <a-icon type="plus"/> 添加回款时间
                                </div>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px"  v-if="model.collectionCycle==2">
                            <a-col :span="6">
                                <span style="color: red;">*</span>选择提醒时间
                            </a-col>
                            <a-col :span="18">
                                <a-date-picker  valueFormat="YYYY-MM-DD" style="width: 90%;" placeholder="选择提醒时间" v-model="model.reminderTime"/>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px"  v-if="model.collectionCycle==2">
                            <a-col :span="6">
                                <span style="color: red;">*</span>重复类型
                            </a-col>
                            <a-col :span="18">
                                <j-dict-select-tag v-model="model.repetitionType" placeholder="请选择重复类型" dictCode="repetition_type" style="width: 90%;" />
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px"  v-if="model.collectionCycle==2">
                            <a-col :span="6">
                                <span style="color: red;">*</span>重复次数
                            </a-col>
                            <a-col :span="18">
                                <a-input  v-model="model.repetitions" placeholder="请输入重复次数" style="width: 90%;"></a-input>
                            </a-col>
                        </a-row>

                    </div>
                </div>
                <!-- -----------预警设置----------------- -->
                <div style="margin-top:30px">
                    <div style="display: flex;justify-content: space-between;align-items: center;" @click="handleClick(4)">
                        <sapn style="font-size: 16px;font-weight: bold;color: #2F3133;">预警设置</sapn>
                        <div style="width: 80%;border: 1px dotted #E8EEF7;height: 1px;"></div>
                        <span><a-icon  :type=" ifShow4?'down':'right' " /></span>
                    </div>
                    <div  style="margin-left:30px;margin-top:30px" v-if="ifShow4">
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>是否开启预警
                            </a-col>
                            <a-col :span="18">
                                <a-switch v-model="model.ifWarning1" @change="onChange" style="margin-right: 5px;"/>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>预算-即将耗尽预警值(%)
                            </a-col>
                            <a-col :span="18">
                                <a-input v-model="model.bugExhaustionWarning" style="width: 90%;"
                                    placeholder="请输入预警值(0 ~ 100)">
                                    </a-input>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>预算-超出预警值(%)
                            </a-col>
                            <a-col :span="18">
                                <a-input  v-model="model.bugExceedWarning" style="width: 90%;"
                                    placeholder="请输入预警值(100 ~ ∞)">
                                    </a-input>
                            </a-col>
                            </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>工时-即将耗尽预警值(%)
                            </a-col>
                            <a-col :span="18">
                                <a-input  v-model="model.workExhaustionWarning" style="width: 90%;"
                                    placeholder="请输入预警值(0 ~ 100)">
                                    </a-input>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>工时-超出预警值(%)
                            </a-col>
                            <a-col :span="18">
                                <a-input  v-model="model.workExceedWarning" style="width: 90%;"
                                    placeholder="请输入预警值(100 ~ ∞)">
                                    </a-input>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>预警通知人
                            </a-col>
                            <a-col :span="18">
                                <a-select
                                    mode="tags"
                                    placeholder="请选择预警通知人"
                                    option-filter-prop="children"
                                    :filter-option="filterOption"
                                    @change="handleChange"
                                    v-model="model.warningUid"
                                    allowClear style="width: 90%;"
                                    :getPopupContainer="(target) => target.parentNode"
                                >
                                    <a-select-option :value="item.value" v-for="item in warningUidOptions" :key="item.id">
                                    <div style="display: flex;align-items: center;">
                                        <div class="selectoptionCss">{{ item.text.slice(0,1) }}</div>
                                        <span>{{ item.text }}</span>
                                    </div>
                                    </a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px" v-if="model.ifWarning1">
                            <a-col :span="6">
                                <span style="color: red;">*</span>预警通知方式
                            </a-col>
                            <a-col :span="18">
                                <j-dict-select-tag v-model="model.warningType"
                                        dictCode="warning_type" style="width: 90%;"
                                        placeholder="邮件/站内信/邮件+站内信"
                                        />
                            </a-col>
                        </a-row>
                    </div>
                </div>
                <!-- -----------预算设置--------------------- -->
                <div style="margin-top:30px">
                    <div style="display: flex;justify-content: space-between;align-items: center;" @click="handleClick(5)">
                        <sapn style="font-size: 16px;font-weight: bold;color: #2F3133;">预算设置</sapn>
                        <div style="width: 80%;border: 1px dotted #E8EEF7;height: 1px;"></div>
                        <span><a-icon  :type=" ifShow5?'down':'right' " /></span>
                    </div>
                    <div  style="margin-left:30px;margin-top:30px"  v-if="ifShow5">
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>合同金额(元)
                            </a-col>
                            <a-col :span="18">
                                <a-input-number @change="handleTotalBudget" v-model="model.agreementAmount" placeholder="请输入合同金额"  style="width:90%;"></a-input-number>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>目标利润率(%)
                            </a-col>
                            <a-col :span="18">
                                <a-input-number  v-model="model.targetProfitRate"  @change="handleTotalBudget" placeholder="请输入目标利润率(%)" style="width:90%;"/>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>税点(%)
                            </a-col>
                            <a-col :span="18">
                                <a-input-number  v-model="model.taxPoint"  @change="handleTotalBudget"  placeholder="请输入税点(%)" style="width:90%;"/>
                            </a-col>
                            </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>项目预算
                            </a-col>
                            <a-col :span="18">
                                <a-input-number v-model="model.totalBudget" placeholder="请输入项目预算"  style="width:90%;"></a-input-number>
                                <br/><span style="color:red;">最大可用预算(元):{{maxTotalBudget}}</span>
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                <span style="color: red;">*</span>加班费设置
                            </a-col>
                            <a-col :span="18">
                                <j-search-select-tag v-model="model.overTimeId" style="width: 90%;"
                                    dict="bus_over_time_template,template,id,del_flag!='1' order by create_time desc" placeholder="请选择加班费模板"
                                    />
                            </a-col>
                        </a-row>
                        <a-row style="margin-top:15px">
                            <a-col :span="6">
                                预估利润率
                            </a-col>
                            <a-col :span="18">
                                <span>{{ model.estimateProfitRate }}%</span>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </a-form-model>
        </div>
    </a-drawer>
</template>
<script>
import { httpAction, getAction } from '@/api/manage'
export default {
    data(){
        return{
            visible: false,
            model: {
                warningType:'3',
                bugExhaustionWarning:90,
                bugExceedWarning:100,
                workExhaustionWarning:90,
                workExceedWarning:100

            },
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 18
            },
            ifShow1:true,
            ifShow2:true,
            ifShow3:true,
            ifShow4:true,
            ifShow5:true,
            maxTotalBudget:0,
            activeKey: ['1','2','3','4','5'],
            validatorRules: {
                overTimeId: [{
                   required: true, message: '请选择加班费模板!',
                }],
                totalBudget: [{
                   required: true,message: '请输入项目预算!',
                },{
                   validator: this.validateToMax
                }],
                taxPoint: [{
                   required: true, message: '请输入税点!',
                }],
                targetProfitRate: [{
                   required: true, message: '请输入目标利润率!',trigger: 'blur'
                },{
                   validator: this.validateToRate
                }],
                agreementAmount: [{
                   required: true, message: '请输入合同金额!',trigger: 'blur'
                },{
                   validator: this.validateToAmount
                }],
                projectName: [{
                   required: true, message: '请输入项目名称!',
                }],
                principal: [{
                   required: true, message: '请选择负责人!',
                }],
                customer: [{
                   required: true, message: '请输入客户!',
                }],
                inheritNumber: [{
                   required: true, message: '请输入继承项目编号!',
                }],
                projectType: [{
                   required: true, message: '请选择项目类别!',
                }],
                startTime: [{
                   required: true, message: '请选择开始时间!',
                }],
                endTime: [{
                   required: true, message: '请选择结束时间!',
                }],
                collectionCycle:[{
                   required: true, message: '请选择回款周期设置!',
                }],
                collectionWarningUid: [{
                   required: true, message: '请选择回款通知人!',
                }],
                collectionWarningType: [{
                   required: true, message: '请选择回款通知方式!',
                }],
                reminderTime: [{
                   required: true, message: '请选择提醒时间!',
                }],
                repetitionType: [{
                   required: true, message: '请选择重复类型!',
                }],
                repetitions: [{
                   required: true, message: '请选择重复次数!',
                }],
                bugExhaustionWarning: [{
                   required: true, message: '请输入预算-即将耗尽预警值!',
                }],
                bugExceedWarning: [{
                   required: true, message: '请输入预算-超出预警值!',
                }],
                workExhaustionWarning: [{
                   required: true, message: '请输入工时-即将耗尽预警值!',
                }],
                workExceedWarning: [{
                   required: true, message: '请输入工时-超出预警值!',
                }],
                warningUid: [{
                   required: true, message: '请选择预警通知人!',
                }],
                warningType: [{
                   required: true, message: '请选择预警通知方式!',
                }],
                ifWarning1: [{
                   required: true, message: '请选择是否开启预警!',
                }],
        },
        backtoArticle:[{
            id:Date.now(),
            collectionTimes:''
        }],
        url: {
            add: "/bus/busProject/add",
            edit: "/bus/busProject/edit",
            queryById: "/bus/busProject/queryById",
            queryByProjectId:'/bus/busProjectUser/getWarningUserIds',
            queryProjectOwnerList:'bus/busProject/queryProjectOwnerList',
            customList:'/bus/busCustom/list',
        },
        principalOptions: [],
        warningUidOptions:[],
        leaderOptions:[],
        customListData:[]
        }
    },
    watch: {
        activeKey(key) {
          console.log(key);
        },
    },
    mounted() {
      this.initWarningUid()
      this.initCustomList()
    },
    methods:{
        handleChangeCustom(e, label){
          console.log(e, label.componentOptions.children[0].elm.data.trim(),label.data.props)
          let name = label.componentOptions.children[0].elm.data.trim()
          let id = label.data.props.id
          this.$set(this.model,'customId',id)
          this.$set(this.model,'customer',name)
        }, 
        initCustomList(){
          getAction(this.url.customList).then(res => {
            if(res.success){
              let result = res.result.records
              let dictOptions = []
                for (let i = 0; i < result.length; i++) {
                    let temp = result[i];
                    let item = {}
                    item.label = temp.customName
                    item.value = temp.id
                    item.id = temp.id
                    dictOptions.push(item);
                }
              this.customListData = dictOptions
            }else{
              this.$message.warning(res.message)
            }          
          })
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        handleQueryProjectOwnerList(){
            getAction(this.url.queryProjectOwnerList).then(res=>{
                if (res.success) {
                    let result = res.result
                    let dictOptions = []
                    for (let i = 0; i < result.length; i++) {
                        let temp = result[i];
                        let item = {}
                        item.label = temp.realname
                        item.value = temp.id
                        item.email = temp.email
                        item.workNo = item.workNo
                        dictOptions.push(item);
                    }
                    this.leaderOptions = dictOptions
                } else {
                    this.$message.warn(`获取失败：` + res.message)
                }
            })
        },
        handleClick(num){
           if(num == 1){
            this.ifShow1 = !this.ifShow1
           }else if(num == 2){
            this.ifShow2 = !this.ifShow2
           }else if(num == 3){
            this.ifShow3 = !this.ifShow3
           }else if(num == 4){
            this.ifShow4 = !this.ifShow4
           }else if(num == 5){
            this.ifShow5 = !this.ifShow5
           }
        },
        afterVisibleChange(val) {
        },
        onClose() {
          this.visible = false;
        },
        handleTotalBudget(){
            if(this.model.agreementAmount && this.model.targetProfitRate){
                let a = this.model.agreementAmount *(1-this.model.targetProfitRate/100)
                let b = 1 + (this.model.taxPoint?this.model.taxPoint:0)/100
                this.maxTotalBudget = (a / b).toFixed(2)
            }else if(this.model.agreementAmount && !this.model.targetProfitRate){
                let b = 1 + (this.model.taxPoint?this.model.taxPoint:0)/100
                this.maxTotalBudget = (this.model.agreementAmount/b).toFixed(2)
            }else{
                this.maxTotalBudget = 0
            }
        },
        validateToRate(rule, value, callback){
            if(this.model.targetProfitRate<=0){
                callback('目标利润率需大于0');
            }else {
                callback()
            }
        },
        validateToAmount(rule, value, callback){
            if(this.model.agreementAmount<=0){
                callback('合同金额需大于0元');
            }else {
                callback()
            }
        },
        validateToMax(rule, value, callback){
            if(this.model.totalBudget&&(!this.model.agreementAmount || !this.model.targetProfitRate)){
                callback('请先填写合同金额、目标利润率、税点！');
            }else {
                callback()
            }
        },
        initWarningUid(){
            getAction(this.url.queryByProjectId).then(res => {
            if(res.success){
                res.result.forEach(i=>{
                i.text = i.realName
                i.value = i.userId
            })
            this.warningUidOptions = res.result
            }

            })
        },
        onChange(checked) {
            this.model.ifWarning1 = checked
            this.model.ifWarning = checked ? '1' : '0'
        },
        DeleteCollectiontime(item) {
            let index = this.backtoArticle.indexOf(item);
            if (index !== -1) {
                this.backtoArticle.splice(index, 1);
            }
        },
        AddCollectiontime() {
            this.backtoArticle.push({
                collectionTimes:'',
                id: Date.now(),
            });
        },
        add() {
        this.edit(this.modelDefault);
        },
        edit(record) {
            console.log(record,'项目详情编辑')
            this.model = Object.assign({}, record);
            this.handleQueryProjectOwnerList()
            this.handleTotalBudget()
            if(this.model.collectionTimes){
                let collection=this.model.collectionTimes.split(',')
                let backtoArticles=[]
                collection.map(item=>{
                backtoArticles.push({
                    id:Date.now(),
                    collectionTimes:item
                })
                })
                this.backtoArticle=backtoArticles
            }
            if(this.model.warningUid){
                this.model.warningUid = this.model.warningUid.split(',')
            }else{
                this.model.warningUid = []
            }
            this.visible = true;
        },
        submitForm() {
            const that = this;
            if(!that.model.projectName){
                this.$message.warning("请填写项目名称!");
                return
            }
            if(!that.model.projectType){
                this.$message.warning("请填写项目类别!");
                return
            }
            if(!that.model.principal){
                this.$message.warning("请选择负责人!");
                return
            }
            if(!that.model.customer){
                this.$message.warning("请输入客户!");
                return
            }
            if(!that.model.startTime){
                this.$message.warning("请选择开始时间!");
                return
            }
            if(!that.model.endTime){
                this.$message.warning("请选择结束时间!");
                return
            }
            if(that.model.startTime > that.model.endTime){
                this.$message.warning("开始时间不得大于结束时间!");
                return
            }
            if(!that.model.collectionCycle){
                this.$message.warning("请选择回款周期设置!");
                return
            }
            if(that.model.collectionCycle==2){
                if(!that.model.reminderTime){
                    this.$message.warning("请选择提醒时间!");
                    return
                }
                if(!that.model.repetitionType){
                    this.$message.warning("请选择重复类型!");
                    return
                }
                if(!that.model.repetitions){
                    this.$message.warning("请选择重复次数!");
                    return
                }
            }


            if(!that.model.agreementAmount){
                this.$message.warning("请输入合同金额!");
                return
            }
            if(!that.model.ifWarning){
                this.$message.warning("请选择是否开启预警!");
                return
            }
            if(that.model.ifWarning == 1){
                if(!that.model.bugExhaustionWarning){
                    this.$message.warning("请输入预算-即将耗尽预警值!");
                    return
                }
                if(!that.model.bugExceedWarning){
                    this.$message.warning("请输入预算-超出预警值!");
                    return
                }
                if(!that.model.workExhaustionWarning){
                    this.$message.warning("请输入工时-即将耗尽预警值!");
                    return
                }
                if(!that.model.workExceedWarning){
                    this.$message.warning("请输入工时-超出预警值!");
                    return
                }
                if(!that.model.warningUid){
                    this.$message.warning("请选择预警通知人!");
                    return
                }
                if(!that.model.warningType){
                    this.$message.warning("请选择预警通知方式!");
                    return
                }

                if(that.model.bugExhaustionWarning<0 || that.model.bugExhaustionWarning>100){
                    this.$message.warning("预算-即将耗尽预警值需大于0小于100");
                    return
                }
                if(that.model.bugExceedWarning<100){
                    this.$message.warning("预算-超出预警值值需大于100");
                    return
                }
                if(that.model.workExhaustionWarning<0 || that.model.workExhaustionWarning>100){
                    this.$message.warning("工时-即将耗尽预警值需大于0小于100");
                    return
                }
                if(that.model.workExceedWarning<100){
                    this.$message.warning("工时-超出预警值需大于100");
                    return
                }
            }
            if(!that.model.targetProfitRate){
                this.$message.warning("请输入目标利润率!");
                return
            }
            if(!that.model.taxPoint){
                this.$message.warning("请输入税点!");
                return
            }
            if(!that.model.totalBudget){
                this.$message.warning("请输入项目预算!");
                return
            }
            if(!that.model.overTimeId){
                this.$message.warning("请选择加班费模板!");
                return
            }

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
                let collection=''
                this.backtoArticle.map(item=>{
                    collection+=item.collectionTimes+','
                    this.model.collectionTimes=collection.slice(0,collection.length-1);
                })
                for(let ind=0;ind<this.backtoArticle.length;ind++){
                    if(this.backtoArticle[ind].collectionTimes==''&&this.model.collectionCycle==1){
                    this.$message.warning("请选择回款时间!");
                    this.confirmLoading = false;
                    return false;
                    }
                }
                this.model.collectionWarningUid = this.model.collectionWarningUid?this.model.collectionWarningUid.join(','):''
                this.model.warningUid = this.model.warningUid?this.model.warningUid.join(','):''
                httpAction(httpurl, this.model, method).then((res) => {
                    if (res.success) {
                     that.$message.success(res.message);
                     that.$emit('ok');
                     this.visible = false;
                    } else {
                     that.$message.warning(res.message);
                    }
                }).finally(() => {
                    that.confirmLoading = false;
                })
                }
            })
        },
    }
}
</script>
<style scoped>
.selectoptionCss{
  width: 24px;
  height: 24px;
  border: 1px solid #D3DCE5;
  border-radius: 50%;
  text-align: center;
  margin-right: 10px;
  line-height: 24px;
}
::v-deep .ant-input {
  background: #F7F9FA !important;
  border: 1px solid #EEF0F1;
  color: #8D9399 !important ;
}
::v-deep .ant-input-number-input {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
::v-deep .ant-select-selection {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
::v-deep .ant-input-number{
  border: none;
}
</style>