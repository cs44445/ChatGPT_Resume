<template>
    <div class="box-dist">
        <!-- <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <a-form-item label="">
                        <j-dict-select-tag v-model="model.position" placeholder="请选择职位" dictCode="position" type="list"
                            style="width:200px" class="tablePageQueryCss"></j-dict-select-tag>
                    </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <div style="display: flex;" class="table-page-search-submitButtons">
                        <a-button @click="search" icon="search" class="btnCss">查询</a-button>
                        <a-button @click="reset" icon="reload" style="margin-left: 8px"
                            class="btnCss">重置</a-button>
                    </div>
                </a-col>
                <a-button @click="handleNewPrice" type="primary" icon="plus" :disabled="formDisabled">新建</a-button>
            </a-row>
        </a-form> -->
        <div style="display: flex; justify-content: end;">
            <a-button type="primary" icon="download" @click="handleExportXls('价格表')" style="margin-right: 10px;">导出</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import" style="margin-right: 10px;">导入</a-button>
            </a-upload>
            <a-button @click="handleNewPrice" type="primary" icon="plus" :disabled="formDisabled">新建</a-button>
        </div>
        <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns"
            :dataSource="priceSource" :pagination="ipagination" :loading="loading" class="j-table-force-nowrap"
            @change="handleTableChange">

            <span slot="onSite" slot-scope="text, record">
                <span v-if="record.onSite == '1'">是</span>
                <span v-else-if="record.onSite == '0'">否</span>
            </span>
            <span slot="action" slot-scope="text, record">
                <a-popconfirm title="确定删除吗?" @confirm="() => priceDelete(record.id)">
                    <a :disabled="formDisabled">删除</a>
                </a-popconfirm>
            </span>

        </a-table>

        <bus-supplier-price-modal ref="priceForm" @ok="priceFormOk"></bus-supplier-price-modal>
    </div>
</template>
<script>
import { getAction, httpAction, deleteAction } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusSupplierPriceModal from '../BusSupplierPriceModal'
import '@/assets/less/TableExpand.less'
export default {
    props: {
        projectId: {
            type: String
        }
    },
    mixins: [JeecgListMixin, mixinDevice],
    components: {
        BusSupplierPriceModal
    },
    data() {
        return {
            url: {
                getPriceList: '/bus/busCompanyPrice/list',
                deletePrice: '/bus/busCompanyPrice/delete',
                exportXlsUrl: "/bus/busCompanyPrice/exportXls",
                importExcelUrl: "/bus/busCompany/importExcel",
            },
            model:{},
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
        importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
        },
    },
    mounted() {
        // this.getPriceList()
    },
    methods: {
        getPriceList() {
            getAction(this.url.getPriceList, {companyId:this.projectId}).then((res) => {
                if (res.success) {
                    this.priceSource = res.result.records
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        handleNewPrice() {
            this.$refs.priceForm.add(this.projectId)
            this.$refs.priceForm.title = "添加价格表";
            this.$refs.priceForm.disableSubmit = false;
        },
        priceFormOk(){
            this.getPriceList()
            this.$emit('ok');
        },
        search(){
            this.getPriceList()
        },
        reset(){
            this.model={}
            this.getPriceList()
        },
        handleImportExcel(val){
            if(val.file.response){
                if(val.file.response.code == '200'){
                    
                this.$message.success('导入成功！')
                this.getPriceList()
                this.$emit('ok');
                }
                else{
                     this.$message.error('导入失败，文件中获取不到数据！')
                }
            }
        },
        priceDelete(id){
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
</style>