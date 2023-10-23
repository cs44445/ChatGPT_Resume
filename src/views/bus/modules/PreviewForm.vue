<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="datasoure" :pagination="false" class="j-table-force-nowrap">         
          <span slot="action" slot-scope="text, record">
            <a @click="handlePreviewEdit(record)" style="color:#1990ff">编辑</a>
          </span>
        </a-table>
      </a-form-model>
    </j-form-container>
    <previsualization-modal ref="preview" @ok="submitCallback" @uploadList="uploadList"></previsualization-modal>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import PrevisualizationModal from './PrevisualizationModal.vue'
  import moment from 'moment'
  export default {
    name: 'PreviewForm',
    components: {
      PrevisualizationModal
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
          budgetExplain:'预算流向说明',
          money:'2000',
          dateNumber:'5',
          taxCoefficient:'0.2',
          beginTime:'2021-10-11',
          endTime:'',
          budgetCycle:'12'
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
         columns: [
          {
            title:'预算流向说明',
            align:"left",
            dataIndex: 'budgetExplain'
          },
          {
            title:'金额',
            align:"left",
            dataIndex: 'money'
          },
          {
            title:'期数',
            align:"left",
            dataIndex: 'dateNumber'
          },
          {
            title:'税费系数',
            align:"left",
            dataIndex: 'taxCoefficient'
          },
          {
            title:'开始时间',
            align:"left",
            dataIndex: 'beginTime'
          },
          {
            title:'结束时间',
            align:"left",
            dataIndex: 'endTime'
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
        datasoure:[],
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/bus/busProjectBudget/add",
          edit: "/bus/busProjectBudget/edit",
          queryById: "/bus/busProject/queryById",
          list:'/bus/busProjectBudget/queryByProjectId',
        },
        projectId:""
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
    },
    mounted(){

    },
    methods: {
      moment,
      uploadList(){
      },
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.projectId=this.model.projectId
        this.visible = true;
        this.pagebudget()
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

            let busProjectBudgets={}
            busProjectBudgets={"busProjectBudgets":this.datasoure}
            httpAction(httpurl,busProjectBudgets,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                this.$emit('uploadList')
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      pagebudget(){
        let beginTime = this.model.beginTime
        let endTime = this.calcEndTime(this.model.beginTime,this.model.budgetCycle)
        for(let i=0;i<this.model.dateNumber;i++){
          endTime = this.calcEndTime(beginTime,this.model.budgetCycle)

           this.datasoure.push({
            projectId:this.projectId,
            purchaseType:1,
            idx:i,
            budgetExplain:this.model.budgetExplain,
            money:this.model.taxCoefficient? (this.model.money*1.0*(1+this.model.taxCoefficient*1.0)).toFixed(2) : this.model.money,
            dateNumber:(i+1)+'/'+this.model.dateNumber,
            taxCoefficient:this.model.taxCoefficient?this.model.taxCoefficient:0,
            beginTime:beginTime,
            endTime:endTime,
            milepostId:this.model.milepostId
           })


           if(this.model.budgetCycle == "3"){
              beginTime = this.dateAddDays(endTime,1)
           }else{
              beginTime = endTime
           }

        }
      },

      calcEndTime(date, budgetCycle){
        if(budgetCycle == "1"){ //年
          return this.dateAddYear(date,1)
        }

        if(budgetCycle == "2"){ //月
          return this.dateAddMonths(date,1)
        }

        if(budgetCycle == "3"){ //周
          let date1 = this.dateAddDays(date,7)
          let date2 = moment(date1).subtract(1, 'days').format('YYYY-MM-DD')
          return date2
        }
      },


      /**
       * @param date
       * 获取指定时间1个月后的时间
       */
      dateAddMonths(date,months) {
        return moment(date).add(months, 'months').format('YYYY-MM-DD')
      },
      /**
       * @param date
       * 获取指定时间1个月后的时间
       */
       dateAddDays(date,days) {
        return moment(date).add(days, 'days').format('YYYY-MM-DD')
      },

      dateAddYear(date, years) {
        return moment(date).add(years, 'years').format('YYYY-MM-DD')
      },
      handlePreviewEdit(record){
        this.$refs.preview.edit(record)
        this.$refs.preview.title = '编辑'
        this.$refs.preview.disableSubmit = false
      },
      submitCallback(result){
        let idx = result.idx
        let data =  this.datasoure
        data[idx] = result
        this.datasoure = []
        this.datasoure = data
      },
    }
  }
</script>
