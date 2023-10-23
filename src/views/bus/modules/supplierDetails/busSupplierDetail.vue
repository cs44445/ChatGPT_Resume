<template>
    <div class="box-dist">
        <div style="display: flex;justify-content: end;">
            <a-button type="primary" @click="detailEdit()" style="margin-right: 10px;">上传简历</a-button>
            <a-button type="primary" @click="detailEdit()">编辑岗位</a-button>
        </div>
        <div style="margin: 20px 0;display: flex; flex-direction: row; flex-wrap:wrap;">
            <a-card style="width: 32%; margin-right: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">基础信息</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">学历</div>
                        <div class="budgetCss">{{ model.name }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">工作年限</div>
                        <div class="budgetCss">{{ model.district_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">英语证书</div>
                        <div class="budgetCss">{{ model.address }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">工作地点</div>
                        <div class="budgetCss">{{ model.userName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">技术栈</div>
                        <div class="budgetCss">{{ model.suffix }}</div>
                    </div>
                    <!-- <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">备注</div>
                        <div class="budgetCss">{{ model.remark }}</div>
                    </div> -->
                </div>
            </a-card>
            <a-card style="width: 32%; margin-right: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">额外信息</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">空档期判断</div>
                        <div class="budgetCss">{{ model.organizeType_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">假简历判断</div>
                        <div class="budgetCss">{{ model.operName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">换工作频率判断</div>
                        <div class="budgetCss">{{ model.operateStatus }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">关键词</div>
                        <div class="budgetCss">{{ model.startDate }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">关键词</div>
                        <div class="budgetCss">{{ model.creditNo }}</div>
                    </div>
                    <!-- <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">组织类型</div>
                        <div class="budgetCss">{{ model.organizeType_dictText }}</div>
                    </div> -->
                    <!-- <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">行业</div>
                        <div class="budgetCss">{{ model.industryText }}</div>
                    </div> -->
                </div>
            </a-card>
            <a-card style="width: 32%; margin-right: 1%;" :bordered="false">
                <p style="font-size: 16px;font-weight: bold;color: #2F3133;">职位描述</p>
                <div style="padding: 10px 20px;">
                    <div style="display: flex;">
                        <div class="commonTitleCss">1.</div>
                        <div class="budgetCss">{{ model.organizeType_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">2.</div>
                        <div class="budgetCss">{{ model.operName }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">3.</div>
                        <div class="budgetCss">{{ model.operateStatus }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">4.</div>
                        <div class="budgetCss">{{ model.startDate }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">5.</div>
                        <div class="budgetCss">{{ model.creditNo }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">6.</div>
                        <div class="budgetCss">{{ model.organizeType_dictText }}</div>
                    </div>
                    <div style="display: flex;margin-top: 16px;">
                        <div class="commonTitleCss">7.</div>
                        <div class="budgetCss">{{ model.industryText }}</div>
                    </div>
                </div>
            </a-card>
            <a-card style="width: 100%; margin-top: 1%;" :bordered="false">
                <!-- <p style="font-size: 16px;font-weight: bold;color: #2F3133;">价格表</p> -->

                
                <a-table ref="table" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource" size="small"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :loading="loading"
                :pagination="false" class="j-table-force-nowrap">
                <template slot="fileName" slot-scope="text,record">
                    <div class="table-item">
                    <span>
                        <img src="@/assets/word.png" alt="" v-if="record.fileSuffix == '.docx' || record.fileSuffix == '.doc'">
                        <img src="@/assets/excel.png" alt=""
                        v-else-if="record.fileSuffix == '.xlsx' || record.fileSuffix == '.xls'">
                        <img src="@/assets/pdf.png" alt="" v-else-if="record.fileSuffix == '.pdf'">
                        <img src="@/assets/zip.png" alt="" v-else-if="record.fileSuffix == '.zip' || record.fileSuffix == '.rar'">
                        <img src="@/assets/imgicon.png" alt=""
                        v-else-if="record.fileSuffix == '.png' || record.fileSuffix == '.jpg' || record.fileSuffix == '.jpeg' || record.fileSuffix == '.gif'">
                        <img src="@/assets/other.png" style="width:unset;" alt="" v-else>
                    </span>
                    <div class="table-item-con">
                        <div class="con-title">{{ record.fileName }}</div>
                        <div class="con-desc"><span>{{ record.milepostName }}</span><span>{{ record.createBy
                        }}</span><span>{{ record.createTime }}</span><span>{{ record.fileSize }}</span>
                        </div>
                    </div>
                    </div>
                </template>
                <span slot="action" slot-scope="text, record" class="fix-action"
                    style="gap:30px;justify-content: flex-end;padding-right: 30px;">
                    <a-tooltip v-if="record.fileSuffix == '.docx' || record.fileSuffix == '.xlsx'">
                    <template slot="title">
                        查看
                    </template>
                    <span @click="handleOnlineDetail(record)"><img src="@/assets/see.png" class="activeLogoCss"
                        alt="logo"></span>
                    </a-tooltip>
                    <a-tooltip v-if="record.fileSuffix == '.png' || record.fileSuffix == '.jpg' || record.fileSuffix == '.jpeg' || record.fileSuffix == '.gif'">
                        <template slot="title">
                            查看
                        </template>
                        <span @click="handlePicView(record.filePath)" >
                            <img src="@/assets/see.png" class="activeLogoCss" alt="logo">
                        </span>
                    </a-tooltip>
                    <a-tooltip>
                    <template slot="title">
                        下载
                    </template>
                    <span @click="downloadFile(record.filePath)"><img src="@/assets/download.png" class="activeLogoCss"
                        alt="logo"></span>
                    </a-tooltip>
                    <a-tooltip v-if="record.fileSuffix == '.docx' || record.fileSuffix == '.xlsx'">
                    <template slot="title">
                        编辑
                    </template>
                    <span @click="handleOnlineEdit(record)"><img src="@/assets/edit2.png" class="activeLogoCss"
                        alt="logo"></span>
                    </a-tooltip>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)" v-has="'projectdocuments:details'">
                    <span><img src="@/assets/del2.png" class="activeLogoCss" alt="logo"></span>
                    </a-popconfirm>
                </span>
                </a-table>
                <!-- <div style="padding: 10px 20px;">
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
                </div> -->
            </a-card>
            <!-- <a-card style="width: 46%; margin: 1%;" :bordered="false">
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
            </a-card> -->
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
                fileListByProjectId: '/bus/busFileOnline/list',//列表
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
            projectlist: [],
            dataSource: null,
            columns: [
                {
                title: '文件名',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '总分',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '学历',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '工作年限',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '英语能力',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '工作地点',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '加分项',
                align: "left",
                dataIndex: 'fileName',
                scopedSlots: { customRender: 'fileName' }
                },
                {
                title: '操作',
                dataIndex: 'action',
                align: "center",
                scopedSlots: { customRender: 'action' }
                }
            ],

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
    //文件列表
    handleList(projectId, queryParam) {
      getAction(this.url.fileListByProjectId, { ...{ projectId }, ...queryParam }).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.selectedRows = []
          this.selectedRowKeys = []
        } else {
          this.dataSource = []
          this.selectedRows = []
          this.selectedRowKeys = []
        }
      })
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