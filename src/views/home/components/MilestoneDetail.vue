<template>
    <a-drawer title="里程碑" :width="width" placement="right" :maskClosable="false" @close="close" destroyOnClose
        :visible="visible" class="miles-detail-box">
        <div class="miles-detail-list">
            <div class="detail-list-container" v-for="(item, i) in detailData" :key="i">
                <div class="miles-detail-left">
                    <div class="miles-detail-cald">
                        <div class="cald-month"
                            :style="{ background: item.colorStatus == '1' ? '#136DEB' : (item.colorStatus == '2' ? '#F2B202' : '#D92929') }">
                            {{ item.endTime.substr(5, 2).replace(/\b(0+)/gi, '') + '月' }}</div>
                        <div class="cald-day">{{ item.endTime.substr(8, 2).replace(/\b(0+)/gi, '') }}</div>
                        <div class="cald-week">{{ getWeek(item.endTime) }}</div>
                    </div>
                    <div class="cald-today"
                        :style="{ background: item.colorStatus == '1' ? 'rgba(19, 109, 235, 0.3)' : (item.colorStatus == '2' ? 'rgba(242, 178, 2, 0.3)' : 'rgba(217, 41, 41, 0.3)') }">
                        {{ item.dayNum }}
                    </div>
                </div>
                <div class="miles-detail-con">
                    <div class="detail-con-title">{{ item.milepostCode }}</div>
                    <div class="detail-con-name">{{ item.owner }}</div>
                    <div class="detail-con-perc"><a-progress size="small" :percent="getPercent(item.info)"
                            strokeColor="#08C35C" :format="(percent) => `${percent} %完成`" /></div>
                    <div class="detail-con-date">{{ item.beginTime }} 至 {{ item.endTime }}</div>
                    <div class="detail-con-time">
                        <template v-if="item.roleHours && item.roleHours.length > 0">
                            <span v-for="(val, tagi) in item.roleHours" :key="tagi">{{ val }}</span>
                        </template>
                    </div>
                    <div class="detail-con-buget">
                        <div class="buget-body">
                            <span class="buget-cost">预估人力成本</span>
                            <span class="buget-money">{{ item.estimatedLaborCosts | moneyFormat }}</span>
                            <span class="buget-has-money"
                                :style="{ color: item.laborCostsWarning == 0 ? '#8D9399' : (item.laborCostsWarning == 1 ? '#F2B202' : '#D92929') }">
                                已产生{{ item.laborCosts | moneyFormat }}</span>
                            <a-icon type="exclamation-circle" class="buget-icon" theme="twoTone"
                                :two-tone-color="item.laborCostsWarning == 1 ? '#F2B202' : '#D92929'"
                                v-show="item.laborCostsWarning !== 0" />
                        </div>
                        <div class="buget-body">
                            <span class="buget-cost">预估采购成本</span>
                            <span class="buget-money">{{ item.estimatedProcurementCost | moneyFormat }}</span>
                            <span class="buget-has-money"
                                :style="{ color: item.procurementCostWarning == 0 ? '#8D9399' : (item.procurementCostWarning == 1 ? '#F2B202' : '#D92929') }">
                                已产生{{ item.realProcurementCost | moneyFormat }}</span>
                            <a-icon type="exclamation-circle" class="buget-icon" theme="twoTone"
                                :two-tone-color="item.procurementCostWarning == 1 ? '#F2B202' : '#D92929'"
                                v-show="item.procurementCostWarning !== 0" />
                        </div>
                        <div class="buget-body">
                            <span class="buget-cost">预估差旅成本</span>
                            <span class="buget-money">{{ item.estimatedTravelCost | moneyFormat }}</span>
                            <span class="buget-has-money"
                                :style="{ color: item.travelCostWarning == 0 ? '#8D9399' : (item.travelCostWarning == 1 ? '#F2B202' : '#D92929') }">
                                已产生{{ item.realTravelCost | moneyFormat }}</span>
                            <a-icon type="exclamation-circle" class="buget-icon" theme="twoTone"
                                :two-tone-color="item.travelCostWarning == 1 ? '#F2B202' : '#D92929'"
                                v-show="item.travelCostWarning !== 0" />
                        </div>
                        <div class="buget-body">
                            <span class="buget-cost">预估分包费用</span>
                            <span class="buget-money">{{ item.estimatedSubcontractingCost | moneyFormat }}</span>
                            <span class="buget-has-money"
                                :style="{ color: item.subcontractingCostWarning == 0 ? '#8D9399' : (item.subcontractingCostWarning == 1 ? '#F2B202' : '#D92929') }">
                                已产生{{ item.realSubcontractingCost | moneyFormat }}</span>
                            <a-icon type="exclamation-circle" class="buget-icon" theme="twoTone"
                                :two-tone-color="item.subcontractingCostWarning == 1 ? '#F2B202' : '#D92929'"
                                v-show="item.subcontractingCostWarning !== 0" />
                        </div>
                        <div class="buget-body">
                            <span class="buget-cost">预估其他费用</span>
                            <span class="buget-money">{{ item.estimatedOtherCost | moneyFormat }}</span>
                            <span class="buget-has-money"
                                :style="{ color: item.otherCostWarning == 0 ? '#8D9399' : (item.otherCostWarning == 1 ? '#F2B202' : '#D92929') }">
                                已产生{{ item.realOtherCost | moneyFormat }}</span>
                            <a-icon type="exclamation-circle" class="buget-icon" theme="twoTone"
                                :two-tone-color="item.otherCostWarning == 1 ? '#F2B202' : '#D92929'"
                                v-show="item.otherCostWarning !== 0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-drawer>
</template>
  
<script>
import { getAction } from '@/api/manage'
export default {
    name: 'MilestoneDetail',
    data() {
        return {
            width: '800px',
            visible: false,
            milepostList: '/bus/busProjectMilepost/milepostList',
            detailData: []
        }
    },
    methods: {
        edit(projectId) {
            console.log('record', projectId)
            this.getDetail(projectId)
            this.visible = true
        },
        getDetail(projectId) {
            getAction(this.milepostList, { projectId, selectTableStatus: '1' }).then(res => {
                if (res.success) {
                    this.detailData = res.result.records
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        //周几格式化
        getWeek(date) {
            let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            return datelist[new Date(date).getDay()]
        },
        //计算进度条百分比
        getPercent(info) {
            if (info.usedHours == 0) {
                return 0
            }
            return ((info.usedHours * 100) / info.planHours).toFixed(0)
        },
        close() {
            this.$emit('close');
            this.visible = false;
        },
        handleOk() {
            this.$refs.realForm.submitForm();
        },
        submitCallback() {
            this.$emit('ok');
            this.visible = false;
        },
        handleCancel() {
            this.close()
        }
    }
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
}

.miles-detail-box /deep/ .ant-drawer-content {
    background-color: #F7F8FA;
}

.miles-detail-box /deep/ .ant-drawer-header {
    border-bottom: none;
    padding: 24px;
    background: #F7F8FA;
}

.miles-detail-box /deep/ .ant-drawer-title {
    font-size: 24px;
    font-weight: bold;
    color: #2F3133;
}

.miles-detail-box {
    .miles-detail-list {
        width: 100%;
    }

    .detail-list-container {
        display: flex;
        gap: 16px;
        padding-bottom: 24px;
        border-bottom: 1px solid #EDEFF0;
        margin-bottom: 24px;
    }

    .miles-detail-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
    }

    .miles-detail-cald {
        width: 92px;
        display: flex;
        flex-direction: column;
    }

    .cald-month {
        box-sizing: border-box;
        // background: ;
        height: 30px;
        font-size: 20px;
        color: #fff;
        width: 100%;
        border-top-left-radius: 19px;
        border-top-right-radius: 19px;
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .cald-day {
        background: #FFFFFF;
        font-size: 28px;
        // font-weight: bold;
        color: #090909;
        text-align: center;
        line-height: 25px;
        padding-top: 10px;
    }

    .cald-week {
        background: #FFFFFF;
        border-bottom-left-radius: 19px;
        border-bottom-right-radius: 19px;
        color: #999999;
        font-size: 12px;
        text-align: center;
        padding: 0 0 3px 5px;
    }

    .cald-today {
        height: 21px;
        border-radius: 150px;
        // background: rgba(19, 109, 235, 0.3);
        color: #fff;
        padding: 0 11px;
    }

    .miles-detail-con {
        display: flex;
        flex-direction: column;
        color: #2F3133;
        flex: 1;
        padding-right: 56px;
    }

    .detail-con-title {
        font-size: 16px;
        font-weight: bold;
    }

    .detail-con-name {
        margin-top: 8px;
    }

    .detail-con-perc {
        width: 60%;
    }

    .perc-fins {
        width: 30%;
        color: #9199A1;
        font-size: 13px;
    }

    .detail-con-date {
        font-size: 13px;
        margin-top: 8px;
    }

    .detail-con-time {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 4px;
    }

    .detail-con-time span {
        height: 22px;
        line-height: 22px;
        border-radius: 216px;
        background: #FFFFFF;
        color: #8D9399;
        padding: 0 6px;
        font-size: 12px;
    }

    .detail-con-buget {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
    }

    .buget-body {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .buget-cost {
        font-size: 13px;
        color: #2F3133;
    }

    .buget-money {
        font-size: 14px;
        font-weight: bold;
        color: #3D3D3D;
    }

    .buget-has-money {
        font-size: 12px;
        color: #8D9399;
        margin-top: 7px;
    }

    .buget-icon {
        font-size: 24px;
        margin-top: 5px;
    }
}
</style>