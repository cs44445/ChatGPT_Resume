<template>
  <div>
    <!-- 数据统计表格 TODO -->
    <a-table ref="table" :columns="columns" :data-source="data" :pagination="false">
      <template slot="title" slot-scope="currentPageData">
        <h1 style="text-align: center">{{ submitTime_begin }} ~ {{ submitTime_end }}全市利用内资（省外省内）情况</h1>
      </template>
    </a-table>
    <!-- 统计图 -->
    <div ref="myChart" style="width: 1600px; height: 600px; margin-top: 5%"></div>
  </div>
</template>

<script>
import { postAction } from '@/api/manage'
export default {
  name: 'ProjectResourceView',
  props: ['submitTime_begin', 'submitTime_end'],
  data() {
    return {
      url: {
        listcountAction: '/bus/count/countProjectResource',
      },
      data: [],
      columns: [
        {
          title: '申报单位',
          align: 'center',
          dataIndex: 'departName',
        },
        {
          title: '到位资金(万元)',
          align: 'center',
          dataIndex: 'actualAmountMonth',
        },
        {
          title: '新开工项目(个数)',
          align: 'center',
          dataIndex: 'constructionType',
        },
        {
          title: '新投产项目(个数)',
          align: 'center',
          dataIndex: 'productionType',
        },
        {
          title: '去年同期(万元)',
          align: 'center',
          dataIndex: 'lastActualAmountMonth',
        },
        {
          title: '同比增幅(%)',
          align: 'center',
          dataIndex: 'yearGrowth',
        },
      ],
    }
  },
  mounted() {
    this.initactiondata()
  },
  methods: {
    getEchartData(map) {
      const myChart = this.$echarts.init(this.$refs.myChart)
      var option

      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: map.departName,
        },
        series: [
          {
            name: '到位资金(万元)',
            type: 'bar',
            data: map.actualAmountMonth,
          },
          {
            name: '新开工项目(个数)',
            type: 'bar',
            data: map.constructionType,
          },
          {
            name: '新投资项目(个数)',
            type: 'bar',
            data: map.productionType,
          },
          {
            name: '去年同期(万元)',
            type: 'bar',
            data: map.lastActualAmountMonth,
          },
          {
            name: '同比增幅(%)',
            type: 'line',
            data: map.yearGrowth,
          },
        ],
      }
      option && myChart.setOption(option)
    },
    initactiondata() {
      postAction(this.url.listcountAction, {
        startMonth: this.submitTime_begin,
        endMonth: this.submitTime_end,
      }).then((res) => {
        this.data = res.result.list
        this.getEchartData(res.result.map)
      })
    },
  },
  watch: {
    submitTime_begin() {
      postAction(this.url.listcountAction, {
        startMonth: this.submitTime_begin,
        endMonth: this.submitTime_end,
      }).then((res) => {
        this.data = res.result.list
        this.getEchartData(res.result.map)
      })
    },
    submitTime_end() {
      postAction(this.url.listcountAction, {
        startMonth: this.submitTime_begin,
        endMonth: this.submitTime_end,
      }).then((res) => {
        this.data = res.result.list
        this.getEchartData(res.result.map)
      })
    },
  },
}
</script>

<style scoped>
</style>