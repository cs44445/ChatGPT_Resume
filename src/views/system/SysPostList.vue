<template>
  <a-card :bordered="false" style="background: #F7F8FA;">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
      <div style="width: 70%;">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :span="6">
                <a-form-item label="">
                  <j-input v-model="queryParam.dutiesName" placeholder="请输入职务" class="tablePageQueryCss"></j-input>
                </a-form-item>
              </a-col>
            <!-- <a-col :md="6" :sm="8">
              <a-form-item label="职务编码">
                <j-input placeholder="请输入职务编码" v-model="queryParam.code"></j-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="职务名称">
                <j-input placeholder="请输入职务名称" v-model="queryParam.name"></j-input>
              </a-form-item>
            </a-col> -->
            <!-- <template v-if="toggleSearchStatus">
              

            </template> -->
            <a-col :md="6" :sm="8">
              <div style="display: flex;" class="table-page-search-submitButtons">
                <a-button @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                <a-button @click="searchReset" icon="reload" style="margin-left: 8px" class="btnCss">重置</a-button>
                <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </a> -->
              </div>
            </a-col>

          </a-row>
        </a-form>
      </div>
      <!-- 操作按钮区域 -->
      <div style="display: flex;gap:10px;">
        <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
  <!--      <a-button type="primary" icon="download" @click="handleExportXls('职务表')">导出</a-button>-->
  <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
  <!--        <a-button type="primary" icon="import">导入</a-button>-->
  <!--      </a-upload>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel">
              <a-icon type="delete"/>
              删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>
    </div>
    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="small"

        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"

        @change="handleTableChange">
<!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
        <span slot="action" slot-scope="text, record" class="fix-action">
          <span @click="handleEdit(record)"><a-icon
            type="edit" class="activeLogoCss" /></span>
          <a-dropdown>
            <span class="ant-dropdown-link">
              <img src="~@/assets/more.png" alt="logo" class="activeLogoCss">
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!-- <sysPosition-modal ref="modalForm" @ok="modalFormOk"></sysPosition-modal> -->
    <sysPost-modal ref="modalForm" @ok="modalFormOk"></sysPost-modal>
  </a-card>
</template>

<script>
  import SysPostModal from './modules/SysPostModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'

  export default {
    name: 'SysPostList',
    mixins: [JeecgListMixin],
    components: {
      SysPostModal,
      JDictSelectTag
    },
    data() {
      return {
        description: '职务表管理页面',
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key: 'rowIndex',
          //   width: 60,
          //   align: 'center',
          //   customRender: function (t, r, index) {
          //     return parseInt(index) + 1
          //   }
          // },
          // {
          //   title: '职务编码',
          //   dataIndex: 'code',
          //   align: 'left',
          // },
          // {
          //   title: '职务名称',
          //   align: 'left',
          //   dataIndex: 'name'
          // },
          {
            title: '职务',
            align: 'left',
            dataIndex: 'dutiesName',
          },
          {
            title: '创建时间',
            align: 'left',
            dataIndex: 'createTime'
          },
          {
            title: '备注',
            align: 'left',
            dataIndex: 'remark'
          },
          {
            title: '排序',
            align: 'left',
            dataIndex: 'sorter',
          },
          // {
          //   title: '标准人力成本（元）',
          //   align: 'center',
          //   dataIndex: 'slr'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          // list: '/sys/position/list',
          list: '/system/sysDuties/list',
          delete: '/system/sysDuties/delete',
          deleteBatch: '/sys/position/deleteBatch',
          exportXlsUrl: '/sys/position/exportXls',
          importExcelUrl: 'sys/position/importExcel',
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    }
  }
</script>
<style scoped>
@import '~@assets/css/common.css';
@import '~@assets/less/common.less';
.activeLogoCss:hover {
  cursor: pointer;
}

::v-deep .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #F7F8FA;
}
::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  /* .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td */
  background: #fff !important;
}
::v-deep .ant-table-tbody > tr > td{
  background: #F7F8FA;
}
::v-deep .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
  background: #fff;
}
::v-deep .ant-table-thead > tr > th{
  background: #F7F8FA;
}
</style>