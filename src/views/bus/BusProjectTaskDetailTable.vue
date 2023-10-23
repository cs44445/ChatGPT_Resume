<template>
    <div>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24">
                    <a-col :xl="6" :lg="7" :md="8" :sm="24">
                        <a-form-item label="ID">
                            <j-input placeholder="请输入任务ID" v-model="queryParam.taskNo"></j-input>
                        </a-form-item>
                    </a-col>
                    <a-col :xl="6" :lg="7" :md="8" :sm="24">
                        <a-form-item label="任务标题">
                            <j-input placeholder="请输入任务标题" v-model="queryParam.taskTitle"></j-input>
                        </a-form-item>
                    </a-col>

                    <template v-if="toggleSearchStatus">
                        <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
                            <a-form-item label="开始时间">
                                <a-date-picker v-model="queryParam.startTime" valueFormat="YYYY-MM-DD"
                                    style="width:100%;" />
                            </a-form-item>
                        </a-col>
                        <a-col :xl="6" :lg="7" :md="8" :sm="24">
                            <a-form-item label="结束时间">
                                <a-date-picker v-model="queryParam.endTime" valueFormat="YYYY-MM-DD" style="width:100%;" />
                            </a-form-item>
                        </a-col> -->
                        <a-col :xl="6" :lg="7" :md="8" :sm="24">
                            <a-form-item label="优先级">
                                <j-dict-select-tag v-model="queryParam.priority" placeholder="请选择优先级"
                                    dictCode="task_priority" />
                            </a-form-item>
                        </a-col>
                        <a-col :xl="6" :lg="7" :md="8" :sm="24">
                            <a-form-item label="指派">
                                <a-input placeholder="请输入指派" v-model="queryParam.appoint"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :xl="6" :lg="7" :md="8" :sm="24">
                            <a-form-item label="类别">
                                <j-dict-select-tag v-model="queryParam.type" placeholder="请选择任务类别" dictCode="task_type" />
                            </a-form-item>
                        </a-col>
                    </template>
                    <a-col :xl="6" :lg="7" :md="8" :sm="24">
                        <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
                            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                            <a-button type="primary" @click="searchReset" icon="reload"
                                style="margin-left: 8px">重置</a-button>
                            <a @click="handleToggleSearch" style="margin-left: 8px">
                                {{ toggleSearchStatus ? '收起' : '展开' }}
                                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                            </a>
                        </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <!-- 查询区域-END -->

        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <a-button type="primary" icon="plus">指派</a-button>
            <a-button type="primary" icon="plus">设置</a-button>
            <a-button type="primary" icon="plus" @click="addTask">新建</a-button>
        </div>

        <!-- table区域-begin -->
        <div>
            <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

            <!-- bordered这是表格的边框属性
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"这是复选框属性 -->
            <a-table ref="table" size="small" :scroll="{ x: true }" rowKey="id" :columns="columns" :dataSource="dataSource"
                :pagination="ipagination" :loading="loading" class="j-table-force-nowrap" @change="handleTableChange">
                <span slot="priority_dictText" slot-scope="text, record">
                    <span v-if="record.priority_dictText == 1" style="color:red">{{ record.priority_dictText }}</span>
                    <span v-else>{{ record.priority_dictText }}</span>
                </span>
                <span slot="status" slot-scope="text, record">
                    <!-- 1激活 4已处理 5已关闭 -->
                    <a v-if="record.status == 1" style="color:#8666bb">激活</a>
                    <a v-if="record.status == 4" style="color:#43a047">已处理</a>
                    <a v-if="record.status == 5" style="color:#838a9d">已关闭</a>
                </span>
                <span slot="taskTitle" slot-scope="text, record">
                    <a @click="taskDetail(record)">{{ record.taskTitle }}</a>
                </span>
                <span slot="appointUserName" slot-scope="text, record">
                    <template v-if="record.appointUserName && record.appointUserName.length != 0">
                        <span v-for="(item, ind) in record.appointUserName" :key="ind">
                            <span v-if="item.status == 4 || item.status == 5"><a-icon type="check-circle" style="color:#43a047"
                                    theme="filled" />{{ item.userName }} | </span>
                            <span v-else>{{ item.userName }} | </span>
                        </span>
                    </template>
                    <!-- <template v-else>
                        <span v-if="record.appointUserName[0].status == 4"><a-icon type="check-circle" style="color:#43a047"
                                theme="filled" />{{ record.appointUserName[0].userName }}</span>
                        <span v-else>{{ record.appointUserName[0].userName }}</span>
                    </template> -->
                </span>
                <span slot="action" slot-scope="text, record">
                    <a :disabled="record.status == 4 || record.status == 5" @click="handleDeal(record)">处理</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定关闭吗?" @confirm="() => closeTask(record)">
                        <a :disabled="record.status == 5">关闭</a>
                    </a-popconfirm>
                    <!-- <a :disabled="record.status == 5" @click="closeTask(record)">关闭</a> -->
                    <a-divider type="vertical" />
                    <a @click="handleEdit(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定复制吗?" @confirm="() => copyTask(record)"><a>复制</a></a-popconfirm>
                    <a-divider type="vertical" />
                </span>
            </a-table>
        </div>
        <!-- 新建任务 -->
        <bus-project-add-task-modal ref="addTaskModal" @ok="updatedList"></bus-project-add-task-modal>
        <!-- 处理 -->
        <bus-project-task-deal-modal ref="dealTaskModal" @ok="updatedList"></bus-project-task-deal-modal>
        <!-- 任务详情 -->
        <bus-project-task-detail-modal ref="detailTaskModal" @ok="updatedList"></bus-project-task-detail-modal>
    </div>
</template>
<script>
import { filterObj } from '@/utils/util';
import '@/assets/less/TableExpand.less'
import { getAction, httpAction } from '@/api/manage'
import BusProjectAddTaskModal from './modules/projectTask/BusProjectAddTaskModal'
import BusProjectTaskDealModal from './modules/projectTask/BusProjectTaskDealModal'
import BusProjectTaskDetailModal from './modules/projectTask/BusProjectTaskDetailModal'

export default {
    name: 'BusProjectTaskDetailListForm',
    components: {
        BusProjectAddTaskModal,
        BusProjectTaskDealModal,
        BusProjectTaskDetailModal
    },
    data() {
        return {
            description: 'bus_project_task_detail管理页面',
            // 表头
            columns: [
                // {
                //  title: '#',
                //   dataIndex: '',
                //   key:'rowIndex',
                //   width:60,
                //   align:"center",
                //   customRender:function (t,r,index) {
                //     return parseInt(index)+1;
                //   }
                // },
                {
                    title: 'ID',
                    align: 'left',
                    dataIndex: 'taskNo',
                },
                {
                    title: '优先级',
                    align: 'left',
                    dataIndex: 'priority_dictText',
                    scopedSlots: { customRender: 'priority_dictText' }
                },
                {
                    title: '类别',
                    align: 'left',
                    dataIndex: 'type_dictText',
                },
                {
                    title: '任务标题',
                    align: 'left',
                    dataIndex: 'taskTitle',
                    scopedSlots: { customRender: 'taskTitle' }
                },
                {
                    title: '里程碑',
                    align: 'left',
                    dataIndex: 'milepostName',
                },
                {
                    title: '状态',
                    align: 'left',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                {
                    title: '创建者',
                    align: 'left',
                    dataIndex: 'createBy_dictText',
                },
                {
                    title: '创建日期',
                    align: 'left',
                    dataIndex: 'createTime',
                },
                {
                    title: '指派',
                    align: 'left',
                    dataIndex: 'appointUserName',
                    scopedSlots: { customRender: 'appointUserName' },
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 147,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            url: {
                getlist: '/bus/busProjectTaskDetail/list',
                edit: "/bus/busProjectTaskDetail/edit",
            },
            dictOptions: {},
            superFieldList: [],
            /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
            queryParam: {},
            /* 数据源 */
            dataSource: [],
            /* 分页参数 */
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '30', '50', '100'],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条"
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            /* 排序参数 */
            // isorter:{
            //   column: 'createTime',
            //   order: 'desc',
            // },
            isorter: {
                column: '',
                order: '',
            },
            /* 筛选参数 */
            filters: {},
            /* table加载状态 */
            loading: false,
            /* table选中keys*/
            selectedRowKeys: [],
            /* table选中records*/
            selectionRows: [],
            /* 查询折叠 */
            toggleSearchStatus: false,
            /* 高级查询条件 */
            superQueryParams: '',
            /** 高级查询拼接方式 */
            superQueryMatchType: 'and',
            isRecord: {},
            isStatus: ''
        }
    },
    created() {

    },
    computed: {

    },
    methods: {
        onChangeTime(date, dateString) {
            if (dateString.length != 0) {
                this.queryParam.startTime = dateString[0]
                this.queryParam.endTime = dateString[1]
            } else {
                this.queryParam.startTime = ''
                this.queryParam.endTime = ''
            }
        },
        edit(record, status) {
            this.isRecord = record;
            this.isStatus = status
            // console.log(3333, record)
            this.loadData(record.id, status, 1)
        },
        loadData(projectId, status, arg) {
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            var params = this.getQueryParams();//查询条件
            params.projectId = projectId;
            params.flag = status;
            this.loading = true;
            getAction(this.url.getlist, params).then((res) => {
                if (res.success) {
                    //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                    this.dataSource = res.result.records || res.result;
                    // console.log(55555, this.dataSource)
                    if (res.result.total) {
                        this.ipagination.total = res.result.total;
                    } else {
                        this.ipagination.total = 0;
                    }
                    //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                }
                if (res.code === 510) {
                    this.$message.warning(res.message)
                }
                this.loading = false;
            })
        },
        handleTableChange(pagination, filters, sorter) {
            //分页、排序、筛选变化时触发
            //TODO 筛选
            // console.log(pagination)
            if (Object.keys(sorter).length > 0) {
                this.isorter.column = sorter.field;
                this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
            }
            this.ipagination = pagination;
            this.loadData(this.isRecord.id, this.isStatus);
        },
        getQueryParams() {
            //获取查询条件
            let sqp = {}
            if (this.superQueryParams) {
                sqp['superQueryParams'] = encodeURI(this.superQueryParams)
                sqp['superQueryMatchType'] = this.superQueryMatchType
            }
            var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
            param.field = this.getQueryField();
            param.pageNo = this.ipagination.current;
            param.pageSize = this.ipagination.pageSize;
            return filterObj(param);
        },
        getQueryField() {
            //TODO 字段权限控制
            var str = "id,";
            this.columns.forEach(function (value) {
                str += "," + value.dataIndex;
            });
            return str;
        },
        handleToggleSearch() {
            this.toggleSearchStatus = !this.toggleSearchStatus;
        },
        onSelectChange(selectedRowKeys, selectionRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectionRows = selectionRows;
        },
        onClearSelected() {
            this.selectedRowKeys = [];
            this.selectionRows = [];
        },
        searchQuery() {
            this.loadData(this.isRecord.id, this.isStatus, 1);
        },
        searchReset() {
            this.queryParam = {}
            this.loadData(this.isRecord.id, this.isStatus, 1);
        },
        //新建
        addTask() {
            // console.log('ddd', this.isRecord.id)
            this.$refs.addTaskModal.add(this.isRecord.id);
        },
        updatedList() {
            this.loadData(this.isRecord.id, this.isStatus, 1);
        },
        // 编辑
        handleEdit(record) {
            this.$refs.addTaskModal.edit(record);
        },
        // 处理
        handleDeal(record) {
            this.$refs.dealTaskModal.edit(record);
        },
        // 关闭任务
        closeTask(record) {
            record.flag = '5'
            // if (record.appoint && record.appoint.length > 0) {
            //     record.appoint = record.appoint.join(',')
            // } else if (record.appoint.length == 0) {
            //     record.appoint = ''
            // }
            httpAction(this.url.edit, record, 'put').then((res) => {
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
        // 复制任务
        copyTask(record) {
            record.flag = '6'
            // if (record.appoint && record.appoint.length > 0) {
            //     record.appoint = record.appoint.join(',')
            // } else if (record.appoint.length == 0) {
            //     record.appoint = ''
            // }
            httpAction(this.url.edit, record, 'put').then((res) => {
                if (res.success) {
                    this.$message.success(res.message);
                    this.updatedList();
                } else {
                    this.$message.warning(res.message);
                }
            })
        },
        // 任务详情
        taskDetail(record) {
            this.$refs.detailTaskModal.edit(record);
        }
    },
}
</script>