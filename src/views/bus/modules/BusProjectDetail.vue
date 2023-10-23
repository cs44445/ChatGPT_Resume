<template>
    <div class="box-dist">
        <div style="display: flex;justify-content: space-between;align-items: center;">
            <div>
                <span style="font-size: 20px;font-weight: bold;color: #2F3133;">{{ projectDetail.projectName }}</span>
                <span style="color: #2F3133;margin-left: 20px;" v-if="projectDetail.startTime">{{ projectDetail.startTime +' '}}</span>至
                <span style="color: #2F3133;" v-if="projectDetail.endTime">{{ ' '+ projectDetail.endTime}}</span>
                <div style="display: flex;margin-top: 10px;">
                    <div class="circularCss"
                    v-for="item in peopledata" :key="item">
                         {{ item.substring(0,1) }}
                    </div>
                    <img :src="require('@assets/add.png')" @click="handleAddPersonnel()"/>
                </div>
            </div>
            <div>
                <a-button class="btnCss"  @click="handleStartup()" v-if="ifShowStart">
                    <a-icon type="caret-right" theme="filled"/>启动项目
                </a-button>
                <a-select default-value="" style="width: 120px" @change="handleChange" v-if="!ifShowStart" v-model="projectStatus" :disabled="projectStatus =='项目已停止'">
                    <a-select-option value="1"  v-if="projectStatus !='项目进行中'">
                        <img :src="require('@/assets/qdxm.png')" style="margin-right:10px;"/>启动项目
                    </a-select-option>
                    <a-select-option value="2"  v-if="projectStatus !='项目已暂停'">
                        <img :src="require('@/assets/ztxm.png')" style="margin-right:10px;"/>暂停项目
                    </a-select-option>
                    <a-select-option value="3"  v-if="projectStatus !='项目已停止'">
                        <img :src="require('@/assets/tzxm.png')" style="margin-right:10px;"/>停止项目
                    </a-select-option>
                </a-select>
                <a-button type="primary" style="margin-left: 10px;"  @click="handleWorking()">分配工时</a-button>
                <a-button type="primary" style="margin-left: 10px;" @click="showDrawer">编辑</a-button>
            </div>
        </div>
        <announ-cement :projectId="projectId"></announ-cement>
        <div style="margin: 25px 0;display: flex;justify-content: space-between;">
            <a-card  style="width: 49%" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">基础信息</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">项目名称</div>
                        <div class="budgetCss">{{ projectDetail.projectName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">项目类别</div>
                        <div class="budgetCss">
                            {{ projectDetail.projectType=='1'?'项目外包':(projectDetail.projectType=='2'?'人员外包':'') }}
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">负责人</div>
                        <div style="color: #2F3133;display: flex;" v-if="projectDetail.ownerName">
                            <div  class="circularCss"  style="margin-right: 5px;">
                                {{ projectDetail.ownerName.slice(0,1) }}
                            </div>
                            <span>{{ projectDetail.ownerName }}</span>
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">客户</div>
                        <div class="budgetCss">{{ projectDetail.customer }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">起止时间</div>
                        <div class="budgetCss">
                            <span  v-if="projectDetail.startTime">{{ projectDetail.startTime + ' '}}</span>
                            至
                            <span  v-if="projectDetail.endTime">{{ ' ' +projectDetail.endTime }}</span>
                        </div>
                    </div>
                </div>
            </a-card>
            <a-card  style="width: 49%" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">高级信息</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">签约实体</div>
                        <div class="budgetCss" v-if="projectDetail.contractEntity=='1'">
                            上海文思海辉软件技术有限公司北京分公司
                        </div>
                        <div class="budgetCss" v-if="projectDetail.contractEntity=='2'">
                            上海文思海辉软件技术有限公司无锡分公司
                        </div>
                        <div class="budgetCss" v-if="projectDetail.contractEntity=='3'">
                            上海文思海辉软件技术有限公司深圳分公司
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">交付地点</div>
                        <div class="budgetCss" v-if="projectDetail.deliveryPlace=='1'">
                            北京
                        </div>
                        <div class="budgetCss" v-if="projectDetail.deliveryPlace=='2'">
                            上海
                        </div>
                        <div class="budgetCss" v-if="projectDetail.deliveryPlace=='3'">
                            无锡
                        </div>
                        <div class="budgetCss" v-if="projectDetail.deliveryPlace=='4'">
                            深圳
                        </div>
                        <div class="budgetCss" v-if="projectDetail.deliveryPlace=='5'">
                            苏州
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">销售</div>
                        <div class="budgetCss">{{ projectDetail.sale }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">机会编号</div>
                        <div class="budgetCss">{{ projectDetail.chanceCode }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">外部项目编号</div>
                        <div class="budgetCss">{{ projectDetail.otherCode }}</div>
                    </div>
                </div>
            </a-card>
        </div>
        <div style="margin: 25px 0;display: flex;justify-content: space-between;">
            <!-- -----------回款信息-------------- -->
            <a-card  style="width: 49%" :bordered="false">
                <div style="display: flex;justify-content: space-between;">
                    <p style="font-size: 16px;font-weight: bold;color: #2F3133;">回款信息</p>
                    <span><a-switch disabled style="margin-right: 5px;" v-model="projectDetail.ifStart"/>开启回款周期</span>
                </div>

                <div style="padding: 10px 20px;"  v-if="projectDetail.ifStart">
                    <div style="display: flex;">
                        <div class="commonTitleCss">回款周期设置</div>
                        <div class="budgetCss" v-if="projectDetail.collectionCycle=='1'">
                            多次
                        </div>
                        <div class="budgetCss" v-if="projectDetail.collectionCycle=='2'">
                            循环
                        </div>
                        <div class="budgetCss" v-if="projectDetail.collectionCycle=='3'">
                            无
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;" v-for="item in projectDetail.collectionTimesArr" :key="item">
                        <div class="commonTitleCss">回款时间</div>
                        <div class="budgetCss">{{ item }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">回款通知人</div>
                        <div style="color: #2F3133;display: flex;" v-for="item in projectDetail.collectionNoticePerson" :key="item">
                            <div  class="circularCss"
                            style="margin-right: 5px;"
                            >
                                {{ item.slice(0,1) }}
                            </div>
                            <span>{{ item }}</span>
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">回款通知方式</div>
                        <div class="budgetCss" v-if="projectDetail.collectionWarningType=='1'">
                            {{ '邮件' }}
                        </div>
                        <div class="budgetCss" v-if="projectDetail.collectionWarningType=='2'">
                            {{ '站内信' }}
                        </div>
                        <div class="budgetCss" v-if="projectDetail.collectionWarningType=='3'">
                            {{ '邮件/站内信' }}
                        </div>
                    </div>
                </div>
            </a-card>
            <!-- ------------预警设置---------------- -->
            <a-card  style="width: 49%" :bordered="false">
                <div  style="display: flex;justify-content: space-between;">
                    <p style="font-size: 16px;font-weight: bold;color: #2F3133;">预警设置</p>
                    <span><a-switch v-model="projectDetail.ifWarning1" @change="onChange" disabled style="margin-right: 5px;"/>开启预警</span>
                </div>

                <div style="padding: 10px 20px;" v-if="projectDetail.ifWarning1">
                    <div style="display: flex;">
                        <div class="commonTitleCss">预算-即将耗尽预警值(%)</div>
                        <div class="budgetCss" style="margin-left: 15px;">{{ projectDetail.bugExhaustionWarning }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">预算-超出预警值(%)</div>
                        <div class="budgetCss" style="margin-left: 15px;">{{ projectDetail.bugExceedWarning }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">工时-即将耗尽预警值(%)</div>
                        <div class="budgetCss" style="margin-left: 15px;">{{ projectDetail.workExhaustionWarning }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">工时-超出预警值(%)</div>
                        <div class="budgetCss" style="margin-left: 15px;">{{ projectDetail.workExceedWarning }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">预警通知人</div>
                        <div style="color: #2F3133;display: flex;margin-left: 15px;" v-for="item in projectDetail.noticePerson" :key="item">
                            <div  class="circularCss"
                            style="margin-right: 5px;"
                            >
                                {{ item.slice(0,1) }}
                            </div>
                            <span>{{ item }}</span>
                        </div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">预警通知方式</div>
                        <div class="budgetCss" style="margin-left: 15px;" v-if="projectDetail.warningType=='1'">
                            {{ '邮件' }}
                        </div>
                        <div class="budgetCss" style="margin-left: 15px;" v-if="projectDetail.warningType=='2'">
                            {{ '站内信' }}
                        </div>
                        <div class="budgetCss" style="margin-left: 15px;" v-if="projectDetail.warningType=='3'">
                            {{ '邮件/站内信' }}
                        </div>
                    </div>
                </div>
            </a-card>
        </div>
        <div style="margin: 25px 0;display: flex;justify-content: space-between;">
            <!-- ----------预算设置----------- -->
            <a-card  style="width: 49%" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">预算设置</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss" >合同金额(¥)</div>
                        <div class="budgetCss">{{ projectDetail.agreementAmount | moneyFormat }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">目标利润率(%)</div>
                        <div class="budgetCss">{{ projectDetail.targetProfitRate }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">税点(%)</div>
                        <div class="budgetCss">{{ projectDetail.taxPoint }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">项目预算(¥)</div>
                        <div>
                            <div class="budgetCss">{{ projectDetail.totalBudget | moneyFormat }}</div>
                            <span style="color: #BCC4CC;">最大可用预算(¥):{{ maxTotalBudget | moneyFormat }}</span>
                        </div>

                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">加班费设置</div>
                        <div class="budgetCss">{{ projectDetail.overTimeTemplateName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">预估利润率(%)</div>
                        <div class="budgetCss">{{ estimateProfitRate }}</div>
                    </div>
                </div>
            </a-card>
            <!-- ----------预估成本-------- -->
            <a-card  style="width: 49%" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">预估成本</p>
                <div style="background: #F7F9FA;width: 97%;height: 60px;border-radius: 4px;display: flex;gap: 20%;">
                    <div style="display: flex;align-items: center;margin-left: 30px;">
                        <img :src="require('@assets/path.png')"/>
                        <div style="margin-left: 10px;">
                            <div style="color: #1E8EF6;font-size: 20px;font-weight: 500;">{{estimateCost | moneyFormat}}元</div>
                            <div style="font-size: 13px;color: #2F2F2F;">预估成本</div>
                        </div>
                    </div>
                    <div style="display: flex;align-items: center;">
                        <img :src="require('@assets/yglrl.png')"/>
                        <div style="margin-left: 10px;">
                            <div style="color: #1E8EF6;font-size: 20px;font-weight: 500;">{{estimateProfitRate}}</div>
                            <div style="font-size: 13px;color: #2F2F2F;">预估利润率</div>
                        </div>
                    </div>
                </div>
                <!-- {{  data}}{{ data[0].cost }} -->
                <div style="padding: 10px 20px;">
                    <div style="display: flex;margin-bottom:16px" v-for="item in data" :key="item.estimateCostItem">
                        <div class="commonTitleCss">{{ item.estimateCostItem }}</div>
                        <div class="costCss">{{ item.cost | moneyFormat }}元</div>
                        <div class="costProportionCss">占总成本 {{ item.gdp }}</div>
                    </div>
                </div>
            </a-card>
        </div>
        <project-edit-form ref="ProjectEditForm" @ok="handleGetDetail"></project-edit-form>
        <bus-personnel ref="busPersonnel" @handleList="getCurrentUser"></bus-personnel>
        <teamours-modal ref="teamours"></teamours-modal>
          <!-- 启动项目 -->
        <startup-modal ref="startup" @uploadList="uploadList"></startup-modal>
    </div>
</template>
<script>
import { getAction } from '../../../api/manage';
import BusPersonnel from '../modules/BusPersonnel'
import TeamoursModal from '../modules/TeamoursModal.vue'
import ProjectEditForm from '../modules/ProjectEditForm.vue'
import StartupModal from '../modules/StartupModal.vue'
import AnnounCement from './AnnounCement'
export default {
    props: {
        projectId: {
          type: String
        }
    },
    components:{BusPersonnel,TeamoursModal,ProjectEditForm,StartupModal,AnnounCement},
  data() {
    return {
        url:{
            queryById:'bus/busProject/queryById',
            queryEstimateCostByProjectId:'bus/busProject/queryEstimateCostByProjectId',
            list:'/bus/busProjectUser/queryByProjectId',
            lockPro: '/bus/busProject/startProject',//项目锁定
            endLockPro: '/bus/busProject/recoveryProject',//解除锁定
        },
        projectDetail:{},
        maxTotalBudget:0,
        estimateCost:'',
        estimateProfitRate:'',
        data:[],
        peopledata:[],
        ifShowStart:true,
        projectStatus:''

    };
  },
  watch: {
      projectId: function() {
        this.loadData()
        this.handleGetDetail()
        this.getCurrentUser()
      }
  },
  mounted(){
    this.loadData()
    this.handleGetDetail()
    this.getCurrentUser()
  },
  methods: {
    handleLock(status) {//2 启动 3 锁定
      getAction(this.url.lockPro, { projectId: this.projectId, status: status }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功！');
        //   this.loadData(1);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    //解除锁定
    handleEndLock() {
      getAction(this.url.endLockPro, { id: this.projectId, status: 2 }).then((res) => {
        if (res.success) {
          this.$message.success('解除锁定成功');
        //   this.loadData(1);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    handleChange(value) {
        if(value=='1'){
            console.log(value=='1' , this.projectStatus );
            this.projectStatus = '项目进行中'
            this.handleEndLock()
        }else if(value=='2'){
            console.log(value=='2',this.projectStatus );
            this.projectStatus = '项目已暂停'
            this.handleLock(3)
        }else if(value=='3'){
            this.projectStatus = '项目已停止'
            this.handleLock(6)
        }


    },
    uploadList(){
      this.ifShowStart = false
      this.projectStatus = '项目进行中'
    },
    handleStartup() {
      this.$refs.startup.edit(this.projectDetail)
      this.$refs.startup.title = '启动项目'
      this.$refs.startup.disableSubmit = false
    },
    showDrawer() {
        this.$refs.ProjectEditForm.visible = true;
        this.$refs.ProjectEditForm.edit(this.projectDetail)
    },
    handleWorking() {
      this.$refs.teamours.edit(this.projectDetail)
      this.$refs.teamours.title = '团队工时管理'
      this.$refs.teamours.ifMilepostId = false
      this.$refs.teamours.disableSubmit = true
    },
    handleAddPersonnel() {
        this.$refs.busPersonnel.visible = true
        this.$refs.busPersonnel.projectData = this.projectDetail
        this.$refs.busPersonnel.getAllUser(this.projectId)
        this.$refs.busPersonnel.getCurrentDepartUser(this.projectId, this.projectDetail.principal)
        this.$refs.busPersonnel.getCommonUsers(this.projectId)
        this.$refs.busPersonnel.getCurrentUser(this.projectId)
    },
    getCurrentUser(){
        if(!this.projectId){
            return
        }
        getAction(this.url.list,{projectId:this.projectId,title:''}).then(res=>{
            if(res.success){
                let a = []
                res.result.forEach(element => {
                    a.push(element.userName)
                });
                this.peopledata = a
            }
        })
    },
    loadData(){
      getAction(this.url.queryEstimateCostByProjectId,{projectId:this.projectId}).then(res=>{
         if(res.success){
            this.data = res.result.item
            this.estimateCost = res.result.estimateCost
            this.estimateProfitRate = res.result.estimateProfitRate
            // console.log(res.result.item,'res.result.item-------------res.result.item')
         }
      })
    },
    handleGetDetail(){
      getAction(this.url.queryById+'?id='+this.projectId).then(res=>{
        if(res.success){
            if(res.result.agreementAmount && res.result.targetProfitRate){
                let a = res.result.agreementAmount *(1-res.result.targetProfitRate/100)
                let b = 1 + (res.result.taxPoint?res.result.taxPoint:0)/100
                this.maxTotalBudget = (a / b).toFixed(2)
            }else if(res.result.agreementAmount && !res.result.targetProfitRate){
                let b = 1 + (res.result.taxPoint?res.result.taxPoint:0)/100
                this.maxTotalBudget = (res.result.agreementAmount/b).toFixed(2)
            }else{
                this.maxTotalBudget = 0
            }
            if(res.result.projectStatus=='1'){
                this.projectStatus = ''
                this.ifShowStart = true
            }
            if(res.result.projectStatus=='2'){
                this.projectStatus = '项目进行中'
                this.ifShowStart = false
            }
            if(res.result.projectStatus=='3'){
                this.projectStatus = '项目已暂停'
                this.ifShowStart = false
            }
            if(res.result.projectStatus=='6'){
                this.projectStatus = '项目已停止'
                this.ifShowStart = false
            }
            res.result.ifStart  = res.result.collectionCycle=='3' ? false : true
            res.result.collectionTimesArr = res.result.collectionTimes ? res.result.collectionTimes.split(',') :[]
            res.result.ifWarning1 = res.result.ifWarning == '1' ? true :false
            this.projectDetail = res.result
            // console.log('this.projectDetail',this.projectDetail)
        }
      })
    },
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
      //切换之后给数据重新复制
      this.projectDetail.ifWarning1 = checked
      this.projectDetail.ifWarning = checked ? '1' : '0'
    },
  },
};
</script>
<style scoped>
.btnCss{
    border-color: #d93899;
    color: #d93899;
}
.costCss{
    color: #2F3133;
    width: 100px;
}
.costProportionCss{
    color: #8D9299;
}
.budgetCss{
    color: #2F3133;
}
.commonTitleCss{
    color: #8D9299;
    width: 160px;
}
.circularCss{
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 10px 0 0;
    text-align: center;
}
@media screen and (max-width: 1440px) {
    .box-dist{
        padding: 0 12px;
    }
}

@media screen and (min-width: 1441px) {
    .box-dist{
        padding: 0 24px;
    }
}
</style>