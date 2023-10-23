<template>
    <div style="display: flex;position: relative;">
        <div id="OverallProjectHours" style="height: 300px;width:100%;"/>
        {{projectId}}
        <!-- <a-select  style="position:absolute;right: 0;top: 0;" @change="handleChange"  v-model="eachMonth">
            <a-select-option v-for="item in months" :key="item">
                {{ item }}月
            </a-select-option>
        </a-select> -->
    </div>


</template>
<script>
import * as echarts from 'echarts'
import { postAction,getAction } from '@/api/manage'
export default {
    props: ['projectId'],
    data(){
       return {
        //   months:['1','2','3','4','5','6','7','8','9','10','11','12'],
        //   eachMonth:new Date().getMonth()+1+'',
          wholeWorkHoursMap:{},
          url:{
            projectDetailWorkTimeInfo:'bus/count/countProjectWholeWorkHoursMap'
          },
       }
    },
    mounted(){
        this.handleInit()
    },
    watch: {
      projectId: function() {
        this.handleInit()
      }
    },
    methods:{
        handleChange(value){
            // this.eachMonth = value
            this.handleInit()
        },
        handleInit(){
            console.log('777')
            getAction(this.url.projectDetailWorkTimeInfo,params).then(res=>{
                console.log('cart',res)
              if(res.success){

                var chartDom = document.getElementById('OverallProjectHours');
                var myChart = echarts.init(chartDom);
                var option;

                option = {
                    title: {
                        text: '项目整体工时趋势图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                        }
                    },
                    legend: {
                        data: ['进行中', '已完成'],
                        left: '15%',
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: res.result.dateList
                        }
                    ],
                    yAxis: [
                        {
                           type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '已分配',
                            type: 'line',

                            areaStyle: {
                                color: 'white'
                            },
                            itemStyle: {
                                color: '#7DE1AA'
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: res.result.execute
                        },
                        {
                            name: '已完成',
                            type: 'line',
                            stack: 'Total',

                            areaStyle: {
                                color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                    offset: 0,
                                    color: '#CDDFF9' // 0% 处的颜色
                                    },
                                    {
                                    offset: 1,
                                    color: '#fff' // 100% 处的颜色
                                    }
                                ],
                                global: false
                                }
                            },
                            itemStyle: {
                                color: '#0467F1'
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: res.result.completed
                        }
                    ]
                };
                option && myChart.setOption(option);
              }
           })



        }
    }
}
</script>
<style scoped>

</style>