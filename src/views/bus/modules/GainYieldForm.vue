<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container >
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
         <div id="myChart2" style="height: 500px;width:100%"></div>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'ProcLamationForm',
    components: {
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
        },
        url: {
          add: "/bus/busProject/add",
          edit: "/bus/busProject/edit",
          queryById: "/bus/busProject/queryById"
        }
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
    mounted() {
      this.drawChart();
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
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
       drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        legend: {
          data: ['实际利润率', '估计利润金额', '目标利润金额']
        },
        xAxis: [
          {
            type: 'category',
            data: ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '利润金额(¥)',
            min: 0,
            max: 200,
            interval: 50,
            axisLabel: {
              formatter: '{value} w'
            }
          },
          {
            type: 'value',
            name: '利润率(%)',
            min: 0,
            max: 100,
            interval: 25,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '实际利润率',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            data: [150, 165, 110, 120, 166, 170]
          },
          {
            name: '实际利润率',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: [
              90, 90, 60, 70, 92, 90
            ]
          },
          {
            name: '估计利润金额',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            data: [60,130, 80,74, 60, 98, 99]
          },
          {
            name: '估计利润金额',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: [50, 75, 70,60, 65, 80]
          },
          {
            name: '目标利润金额',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' w';
              }
            },
            data: [70, 80, 60, 50, 75, 80]
          },
          {
            name: '目标利润金额',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: [48,48,48,48,48,48]
          }
        ]
      };
      myChart.setOption(option);
    },
    }
  }
</script>
