<template>
    <div class="box-dist">
        <div style="display: flex;justify-content: end;">
            <!-- <a-button @click="handleHave" type="primary" icon="plus" :disabled="formDisabled" style="margin-right: 8px;">添加已有联系人</a-button> -->
            <a-button @click="handleNewPerson" type="primary" icon="plus" :disabled="formDisabled">新建联系人</a-button>
        </div>
        <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
            :pagination="ipagination" :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">

            <template slot="districtName" slot-scope="text, record">
                <!-- <a @click="handleDetail(record)">{{ text }}</a> -->
                {{ text }}
            </template>

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
                            <a-popconfirm title="确定删除吗?" @confirm="() => personDelete(record.id)">
                                <a :disabled="formDisabled">删除</a>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>

        </a-table>

        <bus-person-modal ref="modalForm" @ok="modalFormOk"></bus-person-modal>
        <bus-haveperson-modal ref="modalTable" @ok="havePersonModalOk"></bus-haveperson-modal>
    </div>
</template>
<script>
import { getAction, httpAction, deleteAction } from '@/api/manage'
import BusPersonModal from '../BusPersonModal'
import BusHavepersonModal from '../BusHavepersonModal'
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
        BusPersonModal,
        BusHavepersonModal,
    },
    mixins: [JeecgListMixin, mixinDevice],
    data() {
        return {
            url: {
                getPersonList: "/bus/busPerson/list",
                deletePerson: "/bus/busPerson/delete",
            },
            columns: [
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
                    dataIndex: 'name',
                    scopedSlots: { customRender: 'districtName' }
                },
                {
                    title: '性别',
                    align: "left",
                    dataIndex: 'sex_dictText'
                },
                {
                    title: '职务',
                    align: "left",
                    dataIndex: 'job'
                },
                {
                    title: '手机号码',
                    align: "left",
                    dataIndex: 'phone'
                },
                {
                    title: '邮箱',
                    align: "left",
                    dataIndex: 'email'
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
            dataSource: [],
        }
    },
    watch: {
        projectId: function () {
            // this.loadData(this.projectId, '1', 1)
            this.getPersonList()
        }
    },
    computed: {
    },
    mounted() {
        // this.getPersonList()
    },
    methods: {
        getPersonList() {
            getAction(this.url.getPersonList, { customId: this.projectId, type: 2 }).then((res) => {
                if (res.success) {
                    // console.log('2222',res)
                    this.dataSource = res.result.records
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        handleHave() {
            this.$refs.modalTable.add()
            this.$refs.modalTable.title = "添加已有联系人";
            this.$refs.modalTable.disableSubmit = false;
        },
        handleNewPerson() {
            let params = {
                projectId:this.projectId,
                type:'2',
                list:true
            }
            this.$refs.modalForm.add(params)
            this.$refs.modalForm.title = "添加联系人";
            this.$refs.modalForm.disableSubmit = false;
            this.$refs.modalForm.ifShowCompany = false;

        },
        modalFormOk(){
            this.getPersonList()
            this.$emit('ok');
        },
        personDelete(id){
            deleteAction(this.url.deletePerson, { id: id }).then((res) => {
                if (res.success) {
                    this.getPersonList()
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