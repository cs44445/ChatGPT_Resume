<template>
    <div class="box-dist">
        <div style="display: flex;justify-content: end;">
            <a-button type="primary" @click="detailEdit()">编辑</a-button>
        </div>
        <div style="margin: 20px 0;display: flex; flex-direction: row; flex-wrap:wrap;">
            <a-card style="width: 46%; margin: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">基础信息</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">供应商名称</div>
                        <div class="budgetCss">{{ model.name }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">地区</div>
                        <div class="budgetCss">{{ model.district_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">地址</div>
                        <div class="budgetCss">{{ model.address }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">用户名</div>
                        <div class="budgetCss">{{ model.userName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">供应商后缀</div>
                        <div class="budgetCss">{{ model.suffix }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">备注</div>
                        <div class="budgetCss">{{ model.remark }}</div>
                    </div>
                </div>
            </a-card>
            <a-card style="width: 46%; margin: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">工商信息</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">企业类型</div>
                        <div class="budgetCss">{{ model.organizeType_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">法定代表人</div>
                        <div class="budgetCss">{{ model.operName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">经营状态</div>
                        <div class="budgetCss">{{ model.operateStatus }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">成立日期</div>
                        <div class="budgetCss">{{ model.startDate }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">社会统一信用代码</div>
                        <div class="budgetCss">{{ model.creditNo }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">组织类型</div>
                        <div class="budgetCss">{{ model.organizeType_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">行业</div>
                        <div class="budgetCss">{{ model.industryText }}</div>
                    </div>
                </div>
            </a-card>
            <a-card style="width: 46%; margin: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">价格表</p>
                <div style="padding: 10px 20px;">
                    <div class="pricelist">
                        <div class="cell">职位</div>
                        <div class="cell">时薪（元）</div>
                        <div class="cell">工作地点</div>
                        <div class="cell">驻场办公</div>
                        <div class="cell">创建时间</div>
                    </div>
                    <div class="pricelist" v-for="item in pricelist" :key="item.id">
                        <div class="cell">{{ item.position_dictText }}</div>
                        <div class="cell">{{ item.hourlyWage }}</div>
                        <div class="cell">{{ item.officeLocation }}</div>
                        <div class="cell">
                            <span v-if="item.onSite=='1'">是</span>
                            <span v-else-if="item.onSite=='0'">否</span>
                        </div>
                        <div class="cell">{{ item.createTime }}</div>
                    </div>
                </div>
            </a-card>
            <a-card style="width: 46%; margin: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">关联项目</p>
                <div style="padding: 10px 20px;">
                    <div class="pricelist">
                        <div class="cell">项目名称</div>
                        <div class="cell">项目类型</div>
                        <div class="cell">负责人</div>
                        <div class="cell">起止时间</div>
                    </div>
                    <div class="pricelist" v-for="item in projectlist" :key="item.id">
                        <div class="cell">{{ item.projectName }}</div>
                        <div class="cell">{{ item.projectTypeText }}</div>
                        <div class="cell">{{ item.ownerName }}</div>
                        <div class="cell40">{{ item.startTime }}~{{ item.endTime }}</div>
                    </div>
                </div>
            </a-card>
        </div>
        <bus-company-modal ref="modalForm" @ok="updateList"></bus-company-modal>
    </div>
</template>
<script>
import { getAction } from '@/api/manage';
import BusCompanyModal from '../BusCompanyModal'
export default {
    components: {
        BusCompanyModal
    },
    props: {
        projectId: {
            type: String
        }
    },
    data() {
        return {
            url: {
                detail: 'bus/busCompany/queryById',
            },
            // projectDetail:{},
            model: {
                customName: '',
                district: '',
                address: '',
                organizeType: '',
                creditNo: '',
                type: '',
                industry: '',
                operName: '',
                operateStatus: '',
                startDate: '',
                remark: ''
            },
            pricelist: [],
            projectlist: []

        };
    },
    watch: {
        projectId: function () {
            this.getDetails()
        }
    },
    mounted() {
        // this.getDetails()
    },
    methods: {
        getDetails() {
            getAction(this.url.detail, { id: this.projectId }).then(res => {
                if (res.success) {
                    // console.log('ressssssss',res)
                    this.model = res.result
                    this.pricelist = this.model.priceList
                    this.projectlist = this.model.projectList
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        detailEdit() {
            this.$refs.modalForm.edit(this.model)
            this.$refs.modalForm.title = "编辑详情";
            this.$refs.modalForm.disableSubmit = false;
        },
        updateList() {
            this.getDetails()
            this.$emit('ok');
        },
    },
};
</script>
<style scoped>
.btnCss {
    border-color: #d93899;
    color: #d93899;
}

.costCss {
    color: #2F3133;
    width: 100px;
}

.costProportionCss {
    color: #8D9299;
}

.budgetCss {
    color: #2F3133;
    line-height: 30px;
}

.commonTitleCss {
    color: #121212;
    width: 160px;
    line-height: 30px;
}

.circularCss {
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 10px 0 0;
    text-align: center;
}

@media screen and (max-width: 1440px) {
    .box-dist {
        padding: 0 12px;
    }
}

@media screen and (min-width: 1441px) {
    .box-dist {
        padding: 0 24px;
    }
}
.pricelist{
    display: flex;
    justify-content:flex-start;
    color: #121212;
    margin-bottom: 10px;
    
    .cell{
        width: 20%;
    }
    .cell40{
        width: 40%;
    }
}
</style>