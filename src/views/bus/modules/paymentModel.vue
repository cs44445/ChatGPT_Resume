<template>
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="供应商">
                <j-input placeholder="请输入供应商" v-model="queryParam.teamName"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="项目">
                <j-input placeholder="请输入项目" v-model="queryParam.describeInfo"></j-input>
              </a-form-item>
            </a-col>
              <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="时间范围">
                    <a-range-picker @change="onChange" />
                </a-form-item>
              </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->
  
      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>  
      </div>
  
      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="small"
          :scroll="{x:true}"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          class="j-table-force-nowrap"
          @change="handleTableChange">
  
          <template slot="htmlSlot" slot-scope="text">
            <div v-html="text"></div>
          </template>
          <template slot="imgSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
            <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
          </template>
          <template slot="fileSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
            <a-button
              v-else
              :ghost="true"
              type="primary"
              icon="download"
              size="small"
              @click="downloadFile(text)">
              下载
            </a-button>
          </template>
  
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
  
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleDetail(record)">详情</a>
                </a-menu-item>
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
  
      <bus-teams-modal ref="modalForm" @ok="modalFormOk"></bus-teams-modal>
    </a-card>
</template>

<script>
  
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'BusTeamsList',
  mixins:[JeecgListMixin, mixinDevice],
  components: {
    
  },
  data () {
    return {
      description: '团队表管理页面',
      // 表头
      columns: [
        {
          title:'供应商',
          align:"left",
          dataIndex: 'teamName'
        },
        {
          title:'项目',
          align:"left",
          dataIndex: 'describeInfo'
        },
        {
          title:'开始时间',
          align:"left",
          dataIndex: 'teamType'
        },
        {
          title:'结束时间',
          align:"left",
          dataIndex: 'version'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align:"center",
          fixed:"right",
          width:147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: "/bus/busTeams/list",
        delete: "/bus/busTeams/delete",
        deleteBatch: "/bus/busTeams/deleteBatch",
        exportXlsUrl: "/bus/busTeams/exportXls",
        importExcelUrl: "bus/busTeams/importExcel",

      },
      dictOptions:{},
      superFieldList:[],
    }
  },
  created() {
  this.getSuperFieldList();
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    initDictConfig(){
    },
    getSuperFieldList(){
      let fieldList=[];
      fieldList.push({type:'string',value:'teamName',text:'团队名称',dictCode:''})
      fieldList.push({type:'string',value:'describeInfo',text:'团队号',dictCode:''})
      fieldList.push({type:'string',value:'teamType',text:'团队类型',dictCode:''})
      fieldList.push({type:'string',value:'version',text:'版本',dictCode:''})
      fieldList.push({type:'string',value:'teamScale',text:'团队规模',dictCode:''})
      fieldList.push({type:'string',value:'status',text:'状态',dictCode:''})
      fieldList.push({type:'int',value:'appid',text:'appid',dictCode:''})
      fieldList.push({type:'BigDecimal',value:'price',text:'价格',dictCode:''})
      fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped  lang="less">
@import '~@assets/less/common.less';
</style>