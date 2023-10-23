<template>
  <div class="doc-box box-dist">
    <div class="mytask-head">
      <!-- <div class="head-title">文件</div> -->
      <div class="btn-list">
        <!-- <a-button v-if="!searchVisible" @click="showSearch">
          <a-icon type="filter" :style="{ color: filterNum.length == 0 ? '' : '#CC148A' }" />
          <a-badge :count="filterNum.length" :number-style="{ backgroundColor: '#CC148A' }"
            v-if="filterNum.length != 0"></a-badge>
        </a-button> -->
        <!-- <a-button v-if="searchVisible"><a-icon type="plus" /></a-button> -->
        <a-button @click="batchDownload">批量下载</a-button>
        <a-button @click="batchDelete">批量删除</a-button>
        <!-- <a-button icon="cloud" type="primary" ghost @click="handleFileOnlineAdd">新建在线文档</a-button> -->
        <a-button type="primary" icon="plus" @click="handleAdd">添加文件</a-button>
      </div>
    </div>
    <a-row :gutter="24">
      <!-- <a-button @click="showUploadModal" icon="upload" style="margin-left:8px;">上传</a-button> -->
      <a-col :md="{ span: searchVisible ? 14 : 24 }" :xxl="{ span: searchVisible ? 17 : 24 }">
        <!-- <div class="has-select" style="margin-bottom: 16px;" v-if="selectStatus">
          筛选结果： <span style="font-weight: bold;color: #CC148A;">{{
            dataSource.length
          }}个结果</span>
          <a-button style="margin-left: 24px;font-size: 12px;font-weight: bold;padding: 0 12px;color: #2F3133;"
            @click="resetForm('filterForm')" size="small">重置</a-button>
        </div> -->
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
      </a-col>
      <!-- <a-col :md="{ span: searchVisible ? 10 : 0 }" :xxl="{ span: searchVisible ? 7 : 0 }" class="modal-input">
        <div class="search-box">
          <div class="search-head">
            <span>筛选</span>
            <a-icon type="close" style="font-size:12px;cursor:pointer;"
              @click="showSearch" />
          </div>
          <a-form-model ref="filterForm" :model="queryParam" slot="detail">
            <a-row class="form-content">
              <a-col :span="24">
                <a-form-model-item label="关键词" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                  prop="keyword">
                  <a-input v-model="queryParam.keyword" placeholder="搜索文件名或上传人" @blur="searchQuery"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="添加人" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                  prop="createBy">

                  <a-select show-search placeholder="请选择添加人" option-filter-prop="children" :filter-option="filterOption"
                    v-model="queryParam.createBy" @change="createBySelectChange">
                    <a-select-option v-for="(item, key) in selectDictOptions" :key="key" :value="item.realname">
                      {{ item.realname }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-row type="flex" justify="start" :gutter="16">
                <a-col :span="11">
                  <a-form-model-item label="开始结束时间" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    prop="startTime">
                    <a-date-picker style="min-width: 100px !important;width: 100%;" v-model="queryParam.startTime"
                      placeholder="请选择开始时间" @change="searchQuery" valueFormat="YYYY-MM-DD"></a-date-picker>
                  </a-form-model-item>
                </a-col>
                <a-col :span="13">
                  <a-form-model-item label=" " labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    prop="endTime">
                    <span>至</span>
                    <a-date-picker style="min-width: 100px !important;width: 80%;margin-left:10%;"
                      v-model="queryParam.endTime" valueFormat="YYYY-MM-DD" placeholder="请选择结束时间"
                      @change="searchQuery"></a-date-picker>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-col :span="24">
                <a-form-model-item label="文件格式" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                  prop="fileSuffix">
                  <a-select v-model="queryParam.fileSuffix" placeholder="请选择文件格式" @change="changeType">
                    <a-select-option v-for="(item, key) in docType" :key="key" :value="item.value">
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item label="文件更新时间" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                  prop="filterUpdateTimeType">
                  <a-select v-model="queryParam.filterUpdateTimeType" placeholder="请选择文件更新时间" @change="changeUpTime">
                    <a-select-option value="0">
                      任何
                    </a-select-option>
                    <a-select-option value="1">
                      最近1个月
                    </a-select-option>
                    <a-select-option value="2">
                      最近1周
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-button @click="resetForm('filterForm')">
                    重置
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-col> -->
    </a-row>
    <pro-step-documents-modal ref="prostepdoc" @updateList="updateList"></pro-step-documents-modal>
    <!-- <bus-file-online-modal ref="fileOnline" @updateList="updateList"></bus-file-online-modal> -->
    <j-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreviewVisible" switchFullscreen width="1000px">
      <div style="width: 100%;padding: 30px 0 10px 0;">
        <img alt="" style="width: 100%" :src="previewImage" />
      </div>
    </j-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction, downFile } from '@/api/manage'
import ProStepDocumentsModal from './ProStepDocumentsModal.vue'
// import BusFileOnlineModal from './BusFileOnlineModal.vue'

export default {
  name: "ProjectDocumentsForm",
  mixins: [JeecgListMixin, mixinDevice],
  props: {
    projectId: {
      type: String
    }
  },
  components: {
    ProStepDocumentsModal,
    // BusFileOnlineModal
  },
  data() {
    return {
      searchVisible: false,
      queryParam: {
      },
      columns: [
        {
          title: '文件名',
          align: "left",
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '',
          dataIndex: 'action',
          align: "center",
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: null,
      url: {
        fileListByProjectId: '/bus/busFileOnline/companyFileList',//列表
        fileDelete: "/bus/busFileOnline/delete",
        userSearch: "/bus/busFileOnline/userSearch",
        downloadList: "/bus/busFileOnline/downloadList",
        deleteBatch: "/bus/busFileOnline/deleteBatch",
      },
      selectedRows: [],
      selectedRowKeys: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      datalist: [],
      selectDictOptions: [],
      docType: [{ text: '任何', value: '0' },
      { text: 'xlsx', value: '.xlsx' },
      { text: 'xls', value: '.xls' },
      { text: 'docx', value: '.docx' },
      { text: 'doc', value: '.doc' },
      { text: 'zip', value: '.zip' },
      { text: 'rar', value: '.rar' },
      { text: 'pptx', value: '.pptx' },
      { text: 'ppt', value: '.ppt' },
      { text: 'pdf', value: '.pdf' },
      { text: 'png', value: '.png' },
      { text: 'jpg', value: '.jpg' },
      { text: 'jpeg', value: '.jpeg' },
      { text: 'gif', value: '.gif' },
      ],
      filterNum: [],
      selectStatus: false,
      previewVisible: false,
      previewImage: '',
    }
  },
  watch: {
    projectId: function () {
      // console.log('wahtch')
      this.edit()
    }
  },
  mounted(){
    // this.edit()
  },
  methods: {
    edit() {
      this.handleList(this.projectId, {})
      this.getUserSearch('')
    },
    //文件列表
    handleList(projectId, queryParam) {
      console.log('projectId',projectId)
      getAction(this.url.fileListByProjectId, { referId:projectId , ...queryParam }).then((res) => {
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
    //搜索筛选
    searchQuery() {
      this.handleList(this.projectId, this.queryParam)
      this.filterNum = Object.values(this.queryParam).filter(el => {
        if (el) {
          return true
        }
      })
      this.selectStatus = true
      // console.log('this.filterNum', this.filterNum)
    },
    //添加人列表
    getUserSearch(name) {
      getAction(this.url.userSearch, { name }).then((res) => {
        if (res.success) {
          // let userData = []
          // res.result.map(t => userData.push({ text: t.realname, value: t.id }))
          this.selectDictOptions = res.result
        } else {
          this.selectDictOptions = []
        }
      })
    },
    createBySelectChange(value) {
      this.queryParam.createBy = value
      this.searchQuery()
    },
    changeType(value) {
      this.queryParam.fileSuffix = value
      this.searchQuery()
    },
    changeUpTime(value) {
      this.queryParam.filterUpdateTimeType = value
      this.searchQuery()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    showSearch() {
      this.searchVisible = !this.searchVisible
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.handleList(this.projectId, {})
      this.filterNum = []
      this.selectStatus = false
      this.selectedRows = []
      this.selectedRowKeys = []
    },
    // 添加文件
    handleAdd() {
      this.$refs.prostepdoc.edit(this.projectId)
      this.$refs.prostepdoc.title = '添加文件'
      this.$refs.prostepdoc.model = {}
    },
    // 新建在线文档
    // handleFileOnlineAdd() {
    //   this.$refs.fileOnline.edit(this.projectId)
    //   this.$refs.fileOnline.title = '新建在线文档'
    // },
    // 文件编辑
    handleOnlineEdit(record) {
      let queryTitle = record.fileName.split('.')[0]
      let queryType = record.fileName.split('.')[1]
      let newQuery={ edit: true, title: queryTitle, type: queryType,id: record.id }
      newQuery=this.$Base64.encode(JSON.stringify(newQuery))
      let newhref = this.$router.resolve({ path: '/document/index', query: { info:newQuery } });
      // console.log('newhref',newhref)
      window.open(newhref.href, '_blank')
    },
    // 文件查看
    handleOnlineDetail(record) {
      let queryTitle = record.fileName.split('.')[0]
      let queryType = record.fileName.split('.')[1]
      let newQuery={ edit: false, title: queryTitle, type: queryType }
      newQuery=this.$Base64.encode(JSON.stringify(newQuery))
      console.log('query',record)
      let newhref = this.$router.resolve({ path: '/document/index', query: { info:newQuery } });
      // console.log('this.$router',newhref)
      window.open(newhref.href, '_blank')
    },
    // 图片查看
    async handlePicView(file) {
      this.previewImage = process.env.VUE_APP_API_BASE_URL + '/sys/common/static/' +file
      this.previewVisible = true;
    },
    handleCancelPreviewVisible(){
      this.previewVisible = false;
    },
    // 文件删除
    handleDelete(record) {
      deleteAction(this.url.fileDelete + '?id=' + record).then((res) => {
        // console.log(res)
        if (res.success && res.code == 200) {
          this.handleList(this.projectId, this.queryParam)
          this.$message.success(`删除成功`);
        } else {
          that.$message.warning(res.message);
        }
      })
    },
    // 批量文件下载
    batchDownload() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.success(`请至少选择一条数据`);
        return false
      }
      let ids = this.selectedRowKeys.join(',')
      downFile(this.url.downloadList, { ids }).then((res) => {
        // console.log(9999, res)
        const blob = new Blob([res], { type: 'application/zip' }) // new一个二进制对象
        const url = window.URL.createObjectURL(blob) // 转化为url
        const link = document.createElement('a') // 创建个a标签
        link.href = url
        link.download = 'donwload'// 重命名
        link.click()
        URL.revokeObjectURL(url)
        this.selectedRows = []
        this.selectedRowKeys = []
      })
    },
    // 批量文件删除
    batchDelete() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.success(`请至少选择一条数据`);
        return false
      }
      let ids = this.selectedRowKeys.join(',')
      deleteAction(this.url.deleteBatch + '?ids=' + ids).then((res) => {
        // console.log(res)
        if (res.success && res.code == 200) {
          this.handleList(this.projectId, this.queryParam)
          this.$message.success(`删除成功`);
        } else {
          that.$message.warning(res.message);
        }
      })
    },
    updateList() {
      this.edit()
      this.$emit('ok');
    },
    // 批量选择
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log('selectedRowKeys', selectedRowKeys);
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys;
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@assets/css/common.css';
@import '~@assets/less/common.less';
@media screen and (max-width: 1440px) {
    .box-dist{
        padding: 0 12px;
    }
}

@media screen and (min-width: 1441px) {
    .box-dist{
        padding: 0 24px;
    }
}
.doc-box {

  .has-select {
    border-radius: 4px;
    background: #F2F4F5;
    box-sizing: border-box;
    border-left: 8px solid #CD128A;
    border-top: 1px solid #EDEFF0;
    border-right: 1px solid #EDEFF0;
    border-bottom: 1px solid #EDEFF0;
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 15px;
  }

  /deep/ .ant-table-column-title {
    font-size: 14px;
  }

  /deep/ .ant-badge-count {
    min-width: 16px;
    height: 16px;
    padding: 0 3px;
    line-height: 15px;
  }

  .fix-action span {
    display: flex;
    align-items: center;
  }
}

.mytask-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

// .head-title {
//   font-size: 16px;
//   font-weight: bold;
//   color: #2F3133;
// }

.btn-list {
  display: flex;
  align-items: center;
  gap: 8px;
  // width: 40%;
}

.table-item {
  display: flex;
  gap: 11px;
  align-items: center;
  margin: 2px 0;
}

.table-item img {
  width: 32px;
  height: 32px;
}

.con-title {
  font-size: 14px;
  font-weight: bold;
  color: #2F3133;
}

.con-desc {
  font-size: 12px;
  color: #8D9399;
  display: flex;
  gap: 15px;
}

.search-box {
  width: 100%;
  height: 760px;
  padding: 16px 24px;
  border-radius: 4px;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 0px rgba(6, 31, 55, 0.1);

  /deep/ .ant-form-item-label>label::after {
    content: '';
  }

  /deep/ .ant-form-item label {
    font-weight: bold;
  }

  /deep/ .ant-form-item {
    margin-bottom: 10px;
  }
}

.search-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #2F3133;
  margin-bottom: 10px;
}

.activeLogoCss:hover {
  cursor: pointer;
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
  border-bottom: 1px solid #e7edf7;
}

::v-deep .ant-table-tbody>tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
  background: #fff;
}

::v-deep .ant-table-thead>tr>th {
  background: #F7F8FA;
  border-bottom: 1px solid #e7edf7;
}

::v-deep .ant-table-row:last-child td {
  border-bottom: 1px solid #e7edf7 !important;
}
</style>