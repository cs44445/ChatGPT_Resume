<template>
    <div class="mytask-container">
        <div class="mytask-head">
            <div class="head-title">我的项目</div>
            <div class="btn-list">
                <!-- <a-button style="border-color:#C8CBD0;"><img src="@/assets/sort.svg" /></a-button> -->
                <div class="tab-list">
                    <div :class="{ 'tab-active': currentView == 'CardChart' }" @click="onTabClick('card')">
                        <img v-if="currentView == 'CardChart'" src="@/assets/cardact.svg" />
                        <img v-else src="@/assets/card.svg" />
                        <span>卡片</span>
                    </div>
                    <div :class="{ 'tab-active': currentView == 'ProjectList' }" @click="onTabClick('list')">
                        <img v-if="currentView == 'ProjectList'" src="@/assets/listact.svg" />
                        <img v-else src="@/assets/list.svg" />
                        <span>列表</span>
                    </div>
                    <div :class="{ 'tab-active': currentView == 'busProjectList' }" @click="onTabClick('table')">
                        <img v-if="currentView == 'busProjectList'" src="@/assets/tableact.svg" />
                        <img v-else src="@/assets/table.svg" />
                        <span>表格</span>
                    </div>
                </div>
                <a-button type="primary" icon="plus" v-has="'project:add'" @click="handleAdd">添加项目</a-button>
                <a-button type="primary" icon="plus" v-has="'application:add'"
                    @click="handleapplication()">加入项目申请</a-button>
            </div>
        </div>
        <!-- {{ '$route.query.currentView=' + $route.query.currentView+'---------------'}}{{ 'currentView=' + currentView }} -->
        <div class="mytask-body">
            <transition>
                <component :is="currentView"></component>
            </transition>

            <!-- <card-Chart></card-Chart> -->
            <!-- <project-list></project-list> -->
        </div>
        <bus-project-modal ref="modalForm"></bus-project-modal>
        <project-application-modal ref="projectForm"></project-application-modal>
    </div>
</template>
  
<script>

import busProjectList from '@/views/bus/BusProjectList'
import CardChart from './CardChart.vue'
import ProjectList from './ProjectList.vue'
import BusProjectModal from '@/views/bus/modules/BusProjectModal'
import ProjectApplicationModal from '@/views/bus/modules/ProjectApplicationModal'

export default {
    name: 'MyProject',
    components: {
        busProjectList,
        CardChart,
        ProjectList,
        BusProjectModal,
        ProjectApplicationModal
    },
    data() {
        return {
            currentView: 'CardChart',
        }
    },
    created() {

    },
    watch:{
        $route: {
            handler(newVal,oldVal){
                //判断newVal有没有值监听路由变化
                if(newVal.query.currentView){
                    this.currentView = "busProjectList";
                }else{
                    this.currentView = "CardChart";
                }
            },
            deep: true
        }
    },
    methods: {
        onTabClick(index) {
            if (index == 'card') this.currentView = "CardChart";
            if (index == 'list') this.currentView = "ProjectList";
            if (index == 'table') this.currentView = "busProjectList";
        },
        handleAdd() {
            this.$refs.modalForm.add();
            this.$refs.modalForm.title = "添加";
            this.$refs.modalForm.disableSubmit = false;
            localStorage.setItem('flag', 'add')
        },
        handleapplication() {
            this.$refs.projectForm.add()
            this.$refs.projectForm.title = '项目申请'
            this.$refs.projectForm.disableSubmit = false
        },
    },
}
</script>
  
<style lang="less" scoped>
.mytask-container {
    padding: 0 12px;
    width: 100;
    height: 100%;
}

.mytask-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.head-title {
    font-size: 16px;
    font-weight: bold;
    color: #2F3133;
}

.btn-list {
    display: flex;
    align-items: center;
    gap: 8px;
    // width: 40%;
}

.tab-list {
    display: flex;
    width: 240px;
    height: 32px;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    box-sizing: border-box;
    border: 1px solid #CED0D5;
    border-radius: 4px;
    font-size: 12px;
    color: #8D9399;

    &>div {
        flex: 1;
        height: 24px;
        display: flex;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
    }
}

.tab-active {
    background: #FFFFFF;
    color: #2F3133;
    font-weight: bold;
}

.mytask-body {
    margin-top: 16px;
}

.v-enter {
    /*过度进入时初始状态*/
    opacity: 0;
    transform: translateX(100px);
}

.v-enter-to,
.v-leave {
    /*进入过度结束状态 & 过度结束离开初始状态*/
    opacity: 1;
    transform: translateX(0px);
}

.v-leave-to {
    /*过度结束状态*/
    opacity: 0;
    transform: translateX(-100px);
}

.v-enter-active,
.v-leave-active {
    /*过度动效*/
    transition: all .2s ease;
}

p {
    position: absolute;
    /* 解决当translateX 进入和离开时的状态 朝同一方向移动时，会发生该节点从Dom树上删除而导致重绘 发生闪跳*/
}
</style>
  