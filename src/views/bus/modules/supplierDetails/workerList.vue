<template>
    <div class="box-dist">
        <div style="display: flex; justify-content: end;">
            <!-- <a-button @click="handleWorker" type="primary" icon="plus" :disabled="formDisabled" style="margin-right: 8px;">添加已有工作者</a-button> -->
            <a-button @click="handleNewWorker" type="primary" icon="plus" :disabled="formDisabled">签入工作者</a-button>
        </div>
        <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="workerColumns"
            :dataSource="workerSource" :pagination="ipagination" :loading="loading" class="j-table-force-nowrap"
            @change="handleTableChange">

            <template slot="districtName" slot-scope="text, record">
                <!-- <a @click="handleDetail(record)">{{ text }}</a> -->
                {{ text }}
            </template>

            <span slot="action" slot-scope="text, record">
                <a-popconfirm title="确定删除吗?" @confirm="() => deleteWorker(record.id)">
                    <a :disabled="formDisabled">删除</a>
                </a-popconfirm>
            </span>

        </a-table>

        <edit-form ref="workerForm" @ok="updateList"></edit-form>
        <bus-haveworker-modal ref="workerTable" @ok="updateList"></bus-haveworker-modal>
    </div>
</template>
<script>
import { getAction, httpAction, deleteAction } from '@/api/manage'
import editForm from '.././SupplierWorkerComponents/editForm'
import BusHaveworkerModal from '.././BusHaveworkerModal'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
    props: {
        projectId: {
            type: String
        }
    },
    components: {
        editForm,
        BusHaveworkerModal
    },
    mixins: [JeecgListMixin, mixinDevice],
    data() {
        return {
            url: {
                getWorkerList: '/sys/user/getworkUserList',
                deleteWorker: '/sys/user/deleteWorkUser',
            },
            model: {},
            workerColumns: [
                // {
                //   title: '#',
                //   dataIndex: '',
                //   key:'rowIndex',
                //   width:60,
                //   align:"center",
                //   customRender:function (t,r,index) {
                //     return parseInt(index)+1;
                //   }
                // },
                {
                    title: '姓名',
                    align: "left",
                    sorter: true,
                    dataIndex: 'realname',
                    scopedSlots: { customRender: 'districtName' }
                },
                {
                    title: '邮箱',
                    align: "left",
                    sorter: true,
                    dataIndex: 'email',
                },
                {
                    title: '性别',
                    align: "left",
                    sorter: true,
                    dataIndex: 'sex_dictText',
                },
                {
                    title: '年龄',
                    align: "left",
                    sorter: true,
                    dataIndex: 'age',
                },
                {
                    title: '手机号码',
                    align: "left",
                    sorter: true,
                    dataIndex: 'phone',
                },
                {
                    title: '职务',
                    align: "left",
                    sorter: true,
                    dataIndex: 'workerPost',
                },
                {
                    title: '状态',
                    dataIndex: 'status_dictText',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: "center",
                    fixed: "right",
                    width: 147,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            workerSource:[],
            priceSource: [],//价格表数据
        }
    },
    watch: {
        projectId: function () {
            // this.loadData(this.projectId, '1', 1)
            this.getWorkerList()
        }
    },
    computed: {
    },
    mounted() {
        // this.getWorkerList()
    },
    methods: {
        getWorkerList() {
            getAction(this.url.getWorkerList, { companyId: this.projectId }).then((res) => {
                if (res.success) {
                    this.workerSource = res.result
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        handleWorker() {
            this.$refs.workerTable.add()
            this.$refs.workerTable.title = "添加已有工作者";
            this.$refs.workerTable.disableSubmit = false;
        },
        handleNewWorker() {
            let params = {
                suppliermark : true,
                projectId : this.projectId
            }
            this.$refs.workerForm.add(params)
            this.$refs.workerForm.title = "添加工作者";
            this.$refs.workerForm.disableSubmit = false;
        },
        updateList() {
            this.getWorkerList()
            this.$emit('ok');
        },
        deleteWorker(id){
            deleteAction(this.url.deleteWorker, { id: id }).then((res) => {
                if (res.success) {
                    this.getWorkerList()
                    this.$message.success(res.message)
                    this.$emit('ok')
                } else {
                    this.$message.warning(res.message)
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
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

.iconCss {
    font-size: 24px;
}

.tab-list {
    display: flex;
    width: 555px;
    height: 32px;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    box-sizing: border-box;
    border: 1px solid #EDEFF0;
    border-radius: 4px;
    font-size: 12px;
    color: #8D9399;
    margin-left: 40px;

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

.btn-list {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
}

.tab-active {
    background: #FFFFFF;
    color: #2F3133;
    font-weight: bold;
    font-size: 14px;
}

.btnCss {
    border-color: #d93899;
    color: #d93899;
}

::v-deep .ant-table-small>.ant-table-content>.ant-table-fixed-right>.ant-table-body-outer>.ant-table-body-inner>table>.ant-table-thead>tr>th {
    background-color: #F7F8FA;
}

::v-deep .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
    /* .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td */
    background: #fff !important;
}

::v-deep .ant-table-tbody>tr>td {
    background: #F7F8FA;
}

::v-deep .ant-table-tbody>tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
    background: #fff;
}

::v-deep .ant-table-thead>tr>th {
    background: #F7F8FA;
}

.cust-select-sty {
    border-radius: 15px;
    background: #e8f4ff;
    display: flex;
    padding-right: 5px;
}

.cust-select-sty span:first-child {
    border-radius: 50%;
    width: 25px;
    text-align: center;
    margin-right: 5px;
    color: #fff;
    font-size: 12px;
}

.cust-select-sty span:last-child {
    color: #b2c7e0;
    font-size: 17px;
    width: 25px;
    text-align: center;
}

/deep/ .ant-select-selection__choice__content {
    &>.cust-select-sty span:last-child {
        display: none;
    }
}

::v-deep .labelcss .ant-form-item-label>label {
    font-weight: bold;
    color: #2F3337;
    font-size: 14px;
}

::v-deep .ant-input {
    background: #F7F9FA;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important;
}

::v-deep .ant-select-selection {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important;
}

.circularCss {
    width: 24px;
    height: 24px;
    border: 1px solid #D3DCE5;
    border-radius: 50%;
    margin: 0 5px 0 0;
    text-align: center;
}

::v-deep .ant-checkbox-inner {
    width: 21px;
    height: 21px;
    background-color: #D4D8DC;
    border: 1px solid #D4D8DC;
    border-radius: 50%;
}

::v-deep .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #08C35C;
    border-color: #D3DCE5;
    border: 1px solid #08C35C;
}

::v-deep .ant-checkbox-wrapper:hover .ant-checkbox-inner,
.ant-checkbox:hover .ant-checkbox-inner,
.ant-checkbox-input:focus+.ant-checkbox-inner {
    border-color: #D3DCE5;
}

::v-deep .ant-checkbox .ant-checkbox-inner::after {
    color: #fff;
}
</style>