<template>
		<div id="myChart9" style="height: 300px;width:100%"></div>
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
      datalist:[],
      categories:[],
      url:{
        queryGanttByProjectId:'/bus/busProject/queryGanttByProjectId'
        }
		}
	},
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    formatDate(date) {
      //将2020/2/3这种日期格式，转换为2020-02-03
      var arr = date.toLocaleDateString().split('/');
      if (arr[1].length < 2) {
        //对月份进行处理：如果月份的长度为1，则拼接上字符串0
        arr.splice(1, 1, '0' + arr[1]);
      }
      if (arr[2].length < 2) {
        //对天数进行处理：如果天数的长度为2，则拼接上字符串0
        arr.splice(2, 1, '0' + arr[2]);
      }
      return arr.join('-');
    },
    renderItem(params, api) {
      //params为data中的数据项的信息对象    api中是一些开发者可调用的方法集合，可以对data中的数据项进行操作
      var categoryIndex = api.value(0); //取出data中数据项的第一个维度的值

      //===============剩余工时进度条
      //计划开始日期(在屏幕上的像素值)
      var planStartDate = api.coord([api.value(1), categoryIndex]); //将数据项中的数值对应的坐标系上的点，转换为屏幕上的像素值
      //坐标系上的点：是数据项映射到坐标系的x轴和y轴后，对应的位置
      //屏幕上的像素值：是坐标系上的点，在屏幕上的位置
      //计划结束日期(在屏幕上的像素值)
      var planEndDate = api.coord([api.value(2), categoryIndex]);
      //由于data.value中维度1和维度2的数据会被映射到x轴，而x轴的type为time，即时间轴，
      //所以api.value(1)和api.value(2)获取到的值是将日期转换后的毫秒值
      //设置图形的高度
      var height = api.size([0, 1])[1] * 0.4; //获得Y轴上数值范围为1的一段所对应的像素长度
      //使用graphic图形元素组件，绘制矩形
      //clipRectByRect方法，在绘制矩形时，如果矩形大小超出了当前坐标系的包围盒，则裁剪这个矩形
      var rectShape1 = echarts.graphic.clipRectByRect(
        {
          //矩形的位置
          x: planStartDate[0],
          y: planStartDate[1]-height/2,
          //矩形的宽高
          width: planEndDate[0] - planStartDate[0],
          height: height
        },
        {
          //当前坐标系的包围盒
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        }
      );

      //===============已用工时进度条
      var rectShape2 = null;
      //判断实际开始日期是否为空，如果为空，说明项目还没开始
      if (api.value(3) !== '') {
        //如果实际开始日期不为空
        //实际开始日期(在屏幕上的像素值)
        var practiceStartDate = api.coord([api.value(3), categoryIndex]);
        //当前日期或实际结束日期
        var nowDate_or_practiceEndDate;
        //项目周期(毫秒值)：计划结束日期(毫秒值) - 计划开始日期(毫秒值)
        var projectCycle_millisecond = api.value(2) - api.value(1);
        //实际开始日期(毫秒值)
        var practiceStartDate_millisecond = +echarts.number.parseDate(api.value(3));
        //当前日期(毫秒值)
        var nowDate_millisecond = +echarts.number.parseDate(this.formatDate(new Date()));
        //如果项目进度未完成或刚好完成。
        //比如计划开始时间1月10日，计划结束时间1月20日，项目周期10天，实际开始时间1月10日，当前日期1月18日，说明项目进度未完成
        //那么在渲染已用工时的进度条时，进度条的范围为1月10日至1月18日(实际开始日期至当前日期)
        //比如计划开始时间1月10日，计划结束时间1月20日，项目周期10天，实际开始时间1月10日，当前日期1月20日，说明项目进度刚好完成
        //那么在渲染已用工时的进度条时，进度条的范围为1月10日至1月20日(实际开始日期至当前日期)
        if (
          nowDate_millisecond - practiceStartDate_millisecond <=
          projectCycle_millisecond
        ) {
          //取当前日期(在屏幕上的像素值)
          nowDate_or_practiceEndDate = api.coord([
            nowDate_millisecond,
            categoryIndex
          ]);
        } else {
          //比如计划开始时间1月10日，计划结束时间1月20日，项目周期10天，实际开始时间1月10日，当前日期1月22日，说明项目已结束
          //那么在渲染已用工时的进度条时，进度条的范围应该是1月10日至1月20日(实际开始日期至实际结束日期)，
          //而不是1月10日至1月22日(实际开始日期至当前日期)
          //实际结束日期(毫秒值)：实际开始日期(毫秒值) + 项目周期(毫秒值)
          var practiceEndDate_millisecond =
            practiceStartDate_millisecond + projectCycle_millisecond;
          //取实际结束日期(在屏幕上的像素值)
          nowDate_or_practiceEndDate = api.coord([
            practiceEndDate_millisecond,
            categoryIndex
          ]);
        }

        //使用graphic图形元素组件，绘制矩形
        //clipRectByRect方法，在绘制矩形时，如果矩形大小超出了当前坐标系的包围盒，则裁剪这个矩形
        rectShape2 = echarts.graphic.clipRectByRect(
          {
            //矩形的位置
            x: practiceStartDate[0],
            y: practiceStartDate[1]-height/2,
            //矩形的宽高
            width: planEndDate[0]-practiceStartDate[0],
            height: height
          },
          {
            //当前坐标系的包围盒
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          }
        );
      }

      //如果项目还没开始，那么只渲染剩余工时的进度条
      if (rectShape2 == null) {
        //设置绘制的矩形的元素定义
        return (
          rectShape1 && {
            type: 'group',
            children: [
              {
                //类型为矩形
                type: 'rect',
                //具体形状
                shape: rectShape1,
                //样式
                style: api.style({
                  fill: 'red'
                })
              }
            ]
          }
        );
      } else {
        //渲染剩余工时和已用工时
        //设置绘制的矩形的元素定义
        return (
          rectShape1 &&
          rectShape2 && {
            type: 'group',
            children: [
              {
                //类型为矩形
                type: 'rect',
                //具体形状
                shape: rectShape1,
                //样式
                style: api.style({
                  fill: '#5B8FF9'
                })
              },
              {
                //类型为矩形
                type: 'rect',
                //具体形状
                shape: rectShape2,
                //样式
                style: api.style({
                  fill: '#5AD8A6'
                })
              }
            ]
          }
        );
      }
    },
    init() {
      const myChart1 = echarts.init(document.getElementById("myChart9"));
      getAction(this.url.queryGanttByProjectId, {id:this.projectId}).then((res) => {
        var dayTime = 3600 * 24 * 1000;
        let option1={
            tooltip: {
                position: function(point, params, dom, rect, size) {
                  var x = 0;
                  var y = 0;
                  var pointX = point[0];
                  var pointY = point[1];
                  var boxWidth = size.contentSize[0];
                  var boxHeight = size.contentSize[1];
                  if (boxWidth > pointX) {
                    x = 5;
                  } else {
                    x = pointX - boxWidth;
                  }
                  if (boxHeight > pointY) {
                    y = 5;
                  } else {
                    y = pointY - boxHeight;
                  }
                  return [x, y];
                },
                formatter: function (params) {
                  // 项目周期(天数)
                  let projectCycle_millisecond = +echarts.number.parseDate(params.value[2]) - +echarts.number.parseDate(params.value[1])
                  let projectCycle_days = projectCycle_millisecond / dayTime + 1
                  // 当前进度
                  let currentProgress_total=parseInt(res.info[params.value[0]].usedHours)+parseInt(res.info[params.value[0]].surplusHours)
                  let currentProgress= 0;
                  if(currentProgress_total != 0){
                    currentProgress=Math.round(res.info[params.value[0]].usedHours/currentProgress_total*10000)/100
                  }
                  return params.name + '<br/><br/>'
                  + '开始时间：' + params.value[1]+ '<br/>'
                  + '结束时间：' + params.value[2]+ '<br/>'
                  + '里程碑周期：'+projectCycle_days+'天'+ '<br/>'
                  + '当前进度：'+currentProgress+'%'+ '<br/>'
                  + '计划工时：'+Number(res.info[params.value[0]].planHours).toFixed(2)+'小时'+ '<br/>'
                  + '已用工时：'+Number(res.info[params.value[0]].usedHours).toFixed(2)+'小时'+ '<br/>'
                  + '剩余工时：'+Number(res.info[params.value[0]].surplusHours).toFixed(2)+'小时';
                }
              },
              title: {
                text: '项目工时分布'
              },
            dataZoom: [
              {
                //区域缩放组件的类型为滑块，默认作用在x轴上
                type: 'slider',
                //区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
                filterMode: 'weakFilter',
                showDataShadow: false,
                top: 280,
                height: 10,
                //区域缩放组件边框颜色
                borderColor: 'transparent',
                //区域缩放组件边框背景
                backgroundColor: '#e2e2e2',
                //区域缩放组件上的手柄的样式
                handleIcon:
                  'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                //手柄大小
                handleSize: 20,
                //为手柄设置阴影效果
                handleStyle: {
                  shadowBlur: 6,
                  shadowOffsetX: 1,
                  shadowOffsetY: 2,
                  shadowColor: '#aaa'
                },
                labelFormatter: ''
              },
              {
                //区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
                type: 'inside',
                //区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
                filterMode: 'weakFilter'
              }
            ],
            //图表底板
            xAxis: {
              type: 'time', //x轴类型为时间轴
              min: res.begin, //最小值为2020-01-01
              max: res.end, //最大值为2020-12-31
              axisLabel: {
                interval: 0 //强制显示所有标签
              }
            },
            yAxis: {
              data:res.info.map(item=> item.milepostName),
              axisTick: {
                alignWithLabel: true //保证刻度线和标签对齐，当boundaryGap为true的时候有效，不过boundaryGap默认就是true
              }

            },
            grid: {
              left:'23%',
              right:'20%'
            },
            legend: {
              left: '30%',
              data: ['已用工时', '剩余工时'],
              selectedMode: false
            },
            series: [
              {
                type: 'custom',
                //使用自定义的图形元素
                renderItem: this.renderItem,
                name: '已用工时',
                itemStyle: {
                  color: '#68A7FF'
                },
                encode: {
                  //将维度1和维度2的数据映射到x轴
                  x: [1, 2],
                  //将维度0的数据映射到y轴
                  y: 0
                },
                data: res.info.map((item, index)=> {
                  return {
                    name:item.milepostName,
                    value:[index,item.planBeginDate,item.planEndDate,item.lineDate]
                  }
                })
              },
              //这个系列并没有太大作用，也没有给它设置data，只是为了通过这个系列，显示图例(legend)而已
              {
                type: 'custom',
                name: '剩余工时',
                itemStyle: {
                  color: '#7DE1AA'
                }
              }
            ]
          }
         myChart1.setOption(option1);
      })
    },
  }
}
</script>