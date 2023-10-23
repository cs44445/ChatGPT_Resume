<template>
    <div>
        <!-- 负责人视角 -->
        <a-list v-has="'home:projectInfo'" class="demo-loadmore-list" :loading="loading" item-layout="horizontal"
            :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
                <div class="list-item-box">
                    <a-icon type="star" theme="filled" :style="{ color: '#F2B202', fontSize: '18px' }" />
                    <div class="list-item-title" @click="goDetail(1, item.projectId)">{{ item.projectName }}</div>
                    <div style="font-size:12px;"><a-badge status="success" :text="item.projectStatus" /></div>
                    <div class="list-item-subtext">
                        <div class="chart-subtitle-cald">
                            <div class="cald-month"><span class="cald-month-text">{{ item.endDate | monthFilter
                            }}月</span></div>
                            <div class="cald-day">{{ item.endDate | dayFilter }}</div>
                        </div>
                        <span>{{ item.milepostName }}</span>
                        <span>{{ item.timeSheetUse }}%完成</span>
                    </div>
                </div>
            </a-list-item>
        </a-list>
        <!-- 执行人视角 -->
        <a-list v-has="'todoPro:list'" class="demo-loadmore-list" :loading="loading" item-layout="horizontal"
            :data-source="dataExecutor">
            <a-list-item slot="renderItem" slot-scope="item">
                <div class="list-item-box">
                    <a-icon type="star" theme="filled" :style="{ color: '#F2B202', fontSize: '18px' }" />
                    <div class="list-item-title" @click="goDetail(2, item.projectId)">{{ item.projectName }}</div>
                    <div class="work-task">工时投入 {{ item.timeSheet }}</div>
                    <!-- <div class="work-task">任务 10</div> -->
                    <div class="list-item-subtext">
                        <div class="chart-subtitle-cald">
                            <div class="cald-month"><span class="cald-month-text">{{ item.endDate | monthFilter
                            }}月</span></div>
                            <div class="cald-day">{{ item.endDate | dayFilter }}</div>
                        </div>
                        <span>{{ item.milepostName }}</span>
                        <span>{{ item.timeSheetUse }}%完成</span>
                    </div>
                    <template v-if="item.userTitleInfo && item.userTitleInfo.length > 0">
                        <div class="roles" v-for="(tag, tagI) in item.userTitleInfo" :key="tagI">
                            {{ tag }}
                        </div>
                    </template>
                </div>
            </a-list-item>
        </a-list>
        <milestone-detail ref="details"></milestone-detail>
        <tag-list ref="tags" @tagUpdate="tagUpdate"></tag-list>
    </div>
</template>
<script>
import { postAction, getAction } from '@/api/manage'
import MilestoneDetail from './MilestoneDetail'
import tagList from './tagList'
export default {
    data() {
        return {
            loading: true,
            url: {
                listExecutor: '/bus/home/newHomePageExecutorList',//执行人
                listAll: '/bus/home/newHomePageList',
            },
            data: [],
            dataExecutor: [],
        };
    },
    components: {
        MilestoneDetail,
        tagList
    },
    mounted() {
        this.getListAll();
        this.getlistExecutor();
    },
    methods: {
        getListAll() {
            postAction(this.url.listAll).then(res => {
                if (res.success) {
                    this.data = res.result
                    this.loading = false
                } else {
                    this.$message.warn(res.message)
                }
            })
        },
        //执行人视角
        getlistExecutor() {
            postAction(this.url.listExecutor).then(res => {
                if (res.success) {
                    this.dataExecutor = res.result
                } else {
                    this.$message.warn(res.message)
                }
            })
        },
        goDetail(type, projectId) {
            if (type == 1) {
                this.$refs.details.edit(projectId);
            } else {
                this.$refs.tags.edit(projectId);
            }
        },
        tagUpdate() {
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
};
</script>
<style scoped lang="less">
.demo-loadmore-list {
    min-height: 280px;

    .list-item-box {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
    }

    .list-item-title {
        font-size: 14px;
        font-weight: bold;
        color: #2F3133;
        cursor: pointer;
    }

    .list-item-subtext {
        font-size: 12px;
        color: #8D9399;
        display: flex;
        align-items: center;
        height: 24px;
        background: rgba(216, 216, 216, 0.2);
        border-radius: 4px;
        padding-right: 4px;
        gap: 4px;
    }

    .chart-subtitle-cald {
        min-width: 24px;
        height: 24px;
    }

    .cald-month {
        box-sizing: border-box;
        background: #F2B202;
        height: 10px;
        font-size: 10px;
        color: #fff;
        width: 100%;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .cald-month-text {
        transform: scale(0.7);
    }

    .cald-day {
        box-sizing: border-box;
        width: 100%;
        height: 14px;
        line-height: 14px;
        background: #fff;
        font-size: 12px;
        color: #3D3D3D;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        text-align: center;
        border-bottom: 0.5px solid #E8EEF7;
        // border-left: 0.5px solid #E8EEF7;
        border-right: 0.5px solid #E8EEF7;
        transform: scale(0.9);
    }

    .work-task {
        font-size: 12px;
        font-weight: 500;
        color: #2F3133;
    }

    .roles {
        // width: 50px;
        height: 16px;
        line-height: 16px;
        border-radius: 8px;
        padding: 0px 6px;
        background: #5ED895;
        color: #fff;
        font-size: 12px;
    }
}

.demo-loadmore-list /deep/ .ant-badge-status-text {
    font-size: 12px;
    color: #8D9399;
}

.demo-loadmore-list /deep/ .ant-list-item:last-child {
    border-bottom: 1px solid #e8e8e8 !important;
}
</style>