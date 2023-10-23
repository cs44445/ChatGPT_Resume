<template>
  <div>
    <!-- 负责人视角 -->
    <a-row :gutter="16" v-has="'home:projectInfo'">
      <a-col class="chart-container" :span="6" v-for="(item, i) in listDataAll" :key="i">
        <a-card class="chart-radius">
          <div slot="title">
            <div class="chart-title" @click="goDetail(1, item.projectId)">
              <a-icon type="star" theme="filled" :style="{ color: '#F2B202', fontSize: '18px' }" />
              <span>{{ item.projectName }}</span>
            </div>
            <div class="chart-subtitle">
              <div class="chart-subtitle-left">
                <div class="chart-subtitle-cald">
                  <div class="cald-month"><span class="cald-month-text">{{ item.endDate | monthFilter }}月</span></div>
                  <div class="cald-day">{{ item.endDate | dayFilter }}</div>
                </div>
                <div class="chart-subtitle-date">
                  <span class="date-title">{{ item.milepostName }}</span>
                  <span class="date-range">{{ item.milepostStartDate }} 至 {{ item.milepostEndDate }}</span>
                </div>
              </div>
              <!-- 后续调整 -->
              <div class="chart-subtitle-fins">{{item.stageUsedInfo}}%完成</div>
            </div>
          </div>
          <div>
            <div style="font-size:12px;"><a-badge status="success" :text="item.projectStatus" /></div>
            <div class="chart-detail">
              <div class="chart-detail-con">
                <span>
                  工时投入(h) {{ item.timeSheet }}
                </span>
                <a-progress type="circle" :percent="item.timeSheetUse" :width="72"
                  :strokeColor="workClass(item.timeColor)">
                  <template #format="percent">
                    <div class="circle-text">
                      <span>{{ percent }}%</span>
                      <span>工时使用率</span>
                    </div>
                  </template>
                </a-progress>
              </div>
              <div class="chart-detail-con">
                <span>
                  预算(¥) {{ item.budget | moneyFormat }}
                </span>
                <a-progress type="circle" :width="72" :percent="item.budgetUse"
                  :strokeColor="bugtClass(item.budgetColor)">
                  <template #format="percent">
                    <div class="circle-text">
                      <span>{{ percent }}%</span>
                      <span>预算使用率</span>
                    </div>
                  </template>
                </a-progress>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!-- 执行人视角 -->
    <a-row :gutter="16" v-has="'todoPro:list'">
      <a-col class="chart-container" :span="6" v-for="(eitem, ind) in listDataExecutor" :key="ind">
        <a-card class="chart-radius">
          <div slot="title">
            <div class="chart-title" @click="goDetail(2, eitem.projectId)">
              <a-icon type="star" theme="filled" :style="{ color: '#F2B202', fontSize: '18px' }" />
              <span>{{ eitem.projectName }}</span>
            </div>
            <div class="chart-subtitle">
              <div class="chart-subtitle-left">
                <div class="chart-subtitle-cald">
                  <div class="cald-month"><span class="cald-month-text">{{ eitem.endDate | monthFilter }}月</span></div>
                  <div class="cald-day">{{ eitem.endDate | dayFilter }}</div>
                </div>
                <div class="chart-subtitle-date">
                  <span class="date-title executor">
                    <span>{{ eitem.milepostName }}</span>
                    <template v-if="eitem.userTitleInfo && eitem.userTitleInfo.length > 0">
                      <span class="roles" v-for="(tag, tagI) in eitem.userTitleInfo" :key="tagI">{{ tag }}</span>
                      <img src="@/assets/tag.svg" alt="" />
                    </template>
                  </span>
                  <span class="date-range">{{ eitem.milepostStartDate }} 至 {{ eitem.milepostEndDate }}</span>
                </div>
              </div>
              <div class="chart-subtitle-fins">{{eitem.timeSheetUse}}%完成</div>
            </div>
          </div>
          <div>
            <div style="font-size:12px;color: #2F3133;font-weight: bold;">工时投入(h) {{ eitem.sumTimeHours }}</div>
            <div class="chart-work">
              <div :id="`chartId${ind}`" style="height: 80px;"></div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <milestone-detail ref="details"></milestone-detail>
    <tag-list ref="tags" @tagUpdate="tagUpdate"></tag-list>
  </div>
</template>
<script>
import { postAction, getAction } from '@/api/manage'
import MilestoneDetail from './MilestoneDetail'
import tagList from './tagList'

export default {
  name: 'CardChart',
  components: {
    MilestoneDetail,
    tagList
  },
  data() {
    return {
      url: {
        listExecutor: '/bus/home/newHomePageExecutorList',//执行人
        listAll: '/bus/home/newHomePageList',
      },
      listDataAll: [],
      listDataExecutor: [],
    }
  },
  computed: {
    workClass() {
      return color => {
        if (color == '1') return '#54C286'
        if (color == '2') return '#DEB851'
        if (color == '3') return '#CF6868'
      }
    },
    bugtClass() {
      return color => {
        if (color == '1') return '#54C286'
        if (color == '2') return '#DEB851'
        if (color == '3') return '#CF6868'
      }
    },
  },
  created() { },
  mounted() {
    this.getListAll()
    this.getlistExecutor()
  },
  methods: {
    goDetail(type, projectId) {
      if (type == 1) {
        this.$refs.details.edit(projectId);
      } else {
        this.$refs.tags.edit(projectId);
      }
    },
    //负责人视角
    async getListAll() {
      await postAction(this.url.listAll).then(res => {
        if (res.success) {
          this.listDataAll = res.result
        } else {
          this.$message.warn(res.message)
        }
      })
    },
    //执行人视角
    async getlistExecutor() {
      await postAction(this.url.listExecutor).then(res => {
        if (res.success) {
          this.listDataExecutor = res.result
        } else {
          this.$message.warn(res.message)
        }
      })
      // setTimeout(() => {
      this.drawChart() // 绘制图表
      // }, 0)
    },
    drawChart() {
      // this.$nextTick(() => {
      for (let i = 0; i < this.listDataExecutor.length; i++) {
        // 基于准备好的dom，初始化echarts实例
        let mychart = this.$echarts.init(document.getElementById(`chartId${i}`))
        // console.log('mychart', mychart)
        // 指定图表的配置项和数据
        let option = {
          grid: {
            bottom: '20px',
            left: '16px',
            right: '30px',
            top: '10px'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.listDataExecutor[i].dateList,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },

            axisLabel: {
              showMaxLabel: true,
              interval: 9
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
          },
          series: [
            {
              data: this.listDataExecutor[i].dateTimeHours,
              type: 'line',
              symbol: "none",//没有小球和hover效果
              lineStyle: {
                color: '#68A7FF',
                width: 2
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 1,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(4,103,241,0.2)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(4,103,241,0)' // 100% 处的颜色
                  }
                  ],
                  global: false // 缺省为 false
                }
              }
            }
          ],
          tooltip: { // 鼠标悬浮提示框显示
            trigger: 'axis',
            backgroundColor: 'rgba(32, 33, 36, .7)',
            borderColor: 'rgba(32, 33, 36, 0.20)',
            borderWidth: 1,
            textStyle: { // 文字提示样式
              color: '#fff',
              fontSize: 12
            }
          }
        };
        mychart.setOption(option);
      }
      // })
    },
    tagUpdate(){
      this.getlistExecutor()
    }
  },
  filters: {
    monthFilter(date) {
      if (!date) return ''
      let month = date.split('-')[1]
      if (month.includes('0')) {
        return month.slice(1)
      }
      return month
    },
    dayFilter(date) {
      if (!date) return ''
      return date.split('-')[2]
    },
  },
}
</script>
<style lang="less" scoped>
.chart-container {
  margin-bottom: 16px;

  .chart-radius {
    border-radius: 8px;
    border: 0.5px solid #E8EEF7;
  }

  .ant-card-head {
    border-bottom: none;
  }

  .chart-title {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: bold;
    color: #2F3133;
  }

  .chart-subtitle {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    background: #F7F9FA;
    padding: 4px;
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  .chart-subtitle-left {
    display: flex;
    gap: 8px;
  }

  .chart-subtitle-cald {
    width: 32px;
    height: 32px;
  }

  .cald-month {
    box-sizing: border-box;
    background: #F2B202;
    height: 12px;
    font-size: 12px;
    color: #fff;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .cald-month-text {
    transform: scale(0.75);
  }

  .cald-day {
    box-sizing: border-box;
    width: 100%;
    height: 20px;
    line-height: 20px;
    background: #fff;
    font-size: 14px;
    font-weight: bold;
    color: #3D3D3D;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    border-bottom: 0.5px solid #E8EEF7;
    border-left: 0.5px solid #E8EEF7;
    border-right: 0.5px solid #E8EEF7;
  }

  .chart-subtitle-date {
    height: 32px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }

  .date-title {
    color: #2F3133;
  }

  .executor {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .roles {
    // width: 50px;
    height: 16px;
    line-height: 14px;
    border-radius: 8px;
    padding: 0px 6px;
    background: #5ED895;
    color: #fff;
    font-size: 12px;
  }

  .date-range {
    color: #8D9399;
    transform: scale(0.95);
    margin-left: -5px;
  }

  .chart-subtitle-fins {
    font-size: 10px;
    text-align: right;
    color: #8D9399;
  }

  .chart-detail {
    display: flex;
    justify-content: space-around;
    margin-top: 8px;
    width: 100%;
  }

  .chart-work {
    margin-top: 20px;
  }

  .chart-detail-con {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .chart-detail-con span:first-child {
    font-size: 12px;
    font-weight: bold;
    color: #2F3133;
  }

  .circle-text {
    display: flex;
    flex-direction: column;
    color: #3D3D3D;
  }

  .circle-text span:last-child {
    transform: scale(0.7);
  }
}

// /deep/ .ant-card:hover {
//   box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.16);
// }

.chart-container /deep/ .ant-card-head {
  padding: 0;
  margin: 0 12px;
  border-bottom: none;
}

.chart-container /deep/ .ant-card-body {
  padding: 12px 16px 16px 16px;
  background: #F1F5FA;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  height: 155px;
  width: 100%;
}

.chart-container /deep/ .ant-card-head-title {
  padding: 16px 0 12px 0;
}

.chart-container /deep/ .ant-progress-circle-trail {
  stroke: #D4DCE5 !important;
}
</style>