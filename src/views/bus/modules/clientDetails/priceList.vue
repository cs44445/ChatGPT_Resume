<template>
    <div class="box-dist">
        <a-form layout="inline" @keyup.enter.native="searchQuery" style="display: flex; justify-content: space-between;">
            <a-row :gutter="24" style="width: 80%;">
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <a-form-item label="">
                        <j-dict-select-tag v-model="model.position" placeholder="请选择职位" dictCode="position" type="list"
                            style="width:200px" class="tablePageQueryCss"></j-dict-select-tag>
                    </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <div style="display: flex;" class="table-page-search-submitButtons">
                        <a-button @click="search" icon="search" class="btnCss">查询</a-button>
                        <a-button @click="reset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
                    </div>
                </a-col>
            </a-row>
            <a-button @click="handleNewPrice" type="primary" icon="plus" :disabled="formDisabled">新建</a-button>
        </a-form>
        <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="priceColumns"
            :dataSource="priceSource" :pagination="ipagination" :loading="loading" class="j-table-force-nowrap"
            @change="handleTableChange">
            <span slot="onSite" slot-scope="text, record">
                <span v-if="record.onSite == '1'">是</span>
                <span v-else-if="record.onSite == '0'">否</span>
            </span>
            <span slot="action" slot-scope="text, record" class="fix-action">
                <span @click="handleEdit(record)" v-has="'user:edit'"><a-icon type="edit" class="activeLogoCss" /></span>
                <a-dropdown>
                    <span class="ant-dropdown-link">
                        <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
                    </span>
                    <a-menu slot="overlay">
                        <!-- <a-menu-item>
                            <a @click="handleDetail(record)">详情</a>
                        </a-menu-item> -->
                        <a-menu-item>
                            <a-popconfirm title="确定删除吗?" @confirm="() => priceDelete(record.id)">
                                <a :disabled="formDisabled">删除</a>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>

        </a-table>

        <bus-price-modal ref="modalForm" @ok="modalFormOk"></bus-price-modal>
    </div>
</template>
<script>
import { getAction, httpAction, deleteAction } from '@/api/manage'
import BusPriceModal from '../BusPriceModal'
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
        BusPriceModal
    },
    mixins: [JeecgListMixin, mixinDevice],
    data() {
        return {
            url: {
                getPriceList: '/bus/busPrice/list',
                deletePrice: '/bus/busPrice/delete',
            },
            model: {},
            priceColumns: [
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
                    title: '职位',
                    align: "left",
                    dataIndex: 'position_dictText',
                    // scopedSlots: {customRender: 'districtName'}
                },
                {
                    title: '时薪（元）',
                    align: "left",
                    dataIndex: 'hourlyWage',
                },
                {
                    title: '工作地点',
                    align: "left",
                    dataIndex: 'officeLocation',
                },
                {
                    title: '驻场办公',
                    align: "left",
                    dataIndex: 'onSite',
                    scopedSlots: { customRender: 'onSite' }
                },
                {
                    title: '创建时间',
                    align: "left",
                    dataIndex: 'createTime',
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
            priceSource: [],//价格表数据
        }
    },
    watch: {
        projectId: function () {
            // this.loadData(this.projectId, '1', 1)
            this.getPriceList()
        }
    },
    computed: {
    },
    mounted() {
        // this.getPriceList()
    },
    methods: {
        getPriceList() {
            this.model.customId = this.projectId
            getAction(this.url.getPriceList, this.model).then((res) => {
                if (res.success) {
                    this.priceSource = res.result.records
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        handleNewPrice() {
            this.$refs.modalForm.add(this.projectId)
            this.$refs.modalForm.title = "添加价格表";
            this.$refs.modalForm.disableSubmit = false;
        },
        modalFormOk() {
            this.getPriceList()
            this.$emit('ok');
        },
        search() {
            this.getPriceList()
        },
        reset() {
            this.model = {}
            this.getPriceList()
        },
        priceDelete(id) {
            deleteAction(this.url.deletePrice, { id: id }).then((res) => {
                if (res.success) {
                    this.getPriceList()
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