<template>
		<div id="myChart3" style="height: 300px;width:100%"/>
</template>
<script>
import { getAction } from '@/api/manage'
import * as echarts from 'echarts'
export default {
  components: {
  },
  props: {
    projectId: {
      type: String
    }
  },
  watch: {
      projectId: function() {
        this.init()
      }
  },
  data() {
	  return {
      url:{
        queryProfitMarginByProjectId:'/bus/busProject/queryProfitMarginByProjectId'
      }
		}
	}, 
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    init() {
      let myChart = echarts.init(document.getElementById("myChart3"));
      getAction(this.url.queryProfitMarginByProjectId, {id:this.projectId}).then((res) => {
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
          title: {
            text: '利润金额&利润率'
          },
          legend: {
            data: ['实际利润率', '预估利润率', '目标利润率','利润金额'],
            left: '25%',
          },
           grid: {
            top:'20%',
            bottom:'10%',
            left:'20%',
            right:'23%'
          },
          xAxis: [
            {
              type: 'category',
              data: res.weekList,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '利润率(%)',
              min: 0,
              axisLabel: {
                formatter: '{value} %'
              }
            },{
              type: 'value',
              name: '利润金额(元)',
              min: 0,
              axisLabel: {
                formatter: '{value} 元'
              }
            }
          ],
          series: [
            {
              name: '实际利润率',
              type: 'line',
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' w';
                }
              },
              itemStyle:{
                color:'#7DE1AA'
              },
              data: res.actualRateList
            },
            {
              name: '预估利润率',
              type: 'line',
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' %';
                }
              },
              itemStyle:{
                color:'#F2B202'
              },
              data: res.budgetRateList
            },
            {
              name: '目标利润率',
              type: 'line',
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' %';
                }
              },
              itemStyle: {
                color: '#8D9399'
              },
              lineStyle: {
                color: '#8D9399',
                type: 'dashed'
              },
              data: res.targetProfitRateList
            },
            {
              name: '利润金额',
              type: 'bar',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value) {
                  return value + '元';
                }
              },
              barWidth:'10%',
              itemStyle: {
                color: '#68A7FF'
              },
              data: res.agreementAmountList
            }
          ]
        };
        myChart.setOption(option);
        })
    },
  }
}
</script>