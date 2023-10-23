<template>
  <div class="cust-container2">
    <a-card :bordered="false" class="cust-style" style="background: #F7F8FA;">
      <!-- 登录日志页面 -->

      <!--导航区域-->
      <!-- <div>
        <a-tabs defaultActiveKey="1" @change="callback">
          <a-tab-pane tab="登录日志" key="1"></a-tab-pane>
          <a-tab-pane tab="操作日志" key="2"></a-tab-pane>
        </a-tabs>
      </div> -->

      <!-- 查询区域 -->
      
      <div class="table-page-search-wrapper" style="display: flex;justify-content: space-between;">
        <div style="width: 70%;">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">

              <a-col :span="6">
                <a-form-item label="">
                  <a-input placeholder="请输入搜索关键词" v-model="queryParam.keyWord" class="tablePageQueryCss"></a-input>
                </a-form-item>
              </a-col>

              <a-col :span="7">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-range-picker class="tablePageQueryCss"
                    v-model="queryParam.createTimeRange"
                    format="YYYY-MM-DD"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange"
                    @ok="onDateOk"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6" v-if="tabKey === '2'">
                <a-form-item label="">
                  <j-dict-select-tag v-model="queryParam.operateType" placeholder="请选择操作类型" dictCode="operate_type" class="tablePageQueryCss"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <div style="display: flex;" class="table-page-search-submitButtons">
                    <a-button  style="left: 10px" @click="searchQuery" icon="search" class="btnCss">搜索</a-button>
                    <a-button  @click="searchReset" icon="reload" style="margin-left: 8px;left: 10px" class="btnCss">重置</a-button>
                </div>
            </a-col>
            </a-row>
          </a-form>
        </div>
      </div>

      <!-- table区域-begin -->
      <div class="pri-content">
        <a-table
          ref="table"
          size="small"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">

          <!-- <div v-show="queryParam.logType==2" slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <div style="margin-bottom: 5px"><a-badge status="success" style="vertical-align: middle;"/><span style="vertical-align: middle;">请求方法:{{ record.method }}</span></div>
            <div><a-badge status="processing" style="vertical-align: middle;"/><span style="vertical-align: middle;">请求参数:{{ record.requestParam }}</span></div>
          </div> -->
          <!-- 字符串超长截取省略号显示-->
          <!-- <span slot="logContent" slot-scope="text, record">
            <j-ellipsis :value="text" :length="40"/>
          </span> -->
        </a-table>
        <!-- table区域-end -->
      </div>
    </a-card>
  </div>

</template>

<script>
import { filterObj } from '@/utils/util';
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  name: "LogList",
  mixins:[JeecgListMixin],
  components: {
    JEllipsis
  },
  data () {
    return {
      description: '这是日志管理页面',
      // 查询条件
      queryParam: {
        ipInfo:'',
        createTimeRange:[],
        logType:'1',
        keyWord:'',
      },
      tabKey: "1",
      // 表头
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key:'rowIndex',
        //   align: 'left',
        //   customRender:function (t,r,index) {
        //     return parseInt(index)+1;
        //   }
        // },
        {
          title: '用户名',
          align: 'left',
          dataIndex: 'username'
        },
        {
          title: '登录时间',
          align: 'left',
          dataIndex: 'createTime'
        },
        {
          title: 'IP地址',
          dataIndex: 'ip',
          align: 'left',
          // sorter: true
        },
        {
          title: '地理位置',
          align: 'left',
          dataIndex: 'ipAddress'
        },
        {
          title: '登录错误',
          align:"left",
          dataIndex: 'loginFildType'
        },
        // {
        //   title: '日志内容',
        //   align:"left",
        //   dataIndex: 'logContent',
        //   scopedSlots: { customRender: 'logContent' },
        //   sorter: true
        // },
        // {
        //   title: '操作人ID',
        //   dataIndex: 'userid',
        //   align: 'left',
        //   sorter: true
        // },
        // {
        //   title: '操作人名称',
        //   dataIndex: 'username',
        //   align: 'left',
        //   sorter: true
        // },
        // {
        //   title: '耗时(毫秒)',
        //   dataIndex: 'costTime',
        //   align: 'left',
        //   sorter: true
        // },
        // {
        //   title: '日志类型',
        //   dataIndex: 'logType_dictText',
        //   /*customRender:function (text) {
        //     if(text==1){
        //       return "登录日志";
        //     }else if(text==2){
        //       return "操作日志";
        //     }else{
        //       return text;
        //     }
        //   },*/
        //   align: 'left',
        // },
        // {
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   align: 'left',
        //   sorter: true
        // }
      ],
      operateColumn:
        {
          title: '操作类型',
          dataIndex: 'operateType_dictText',
          align: 'left',
        },
      labelCol: {
        xs: { span: 1 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 16 },
      },
      url: {
        list: "/sys/log/list",
      },
    }
  },
  mounted(){
    this.callback(1)
  },
  methods: {
    getQueryParams(){
      var param = Object.assign({}, this.queryParam,this.isorter);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      delete param.createTimeRange; // 时间参数不传递后台
      if (this.superQueryParams) {
        param['superQueryParams'] = encodeURI(this.superQueryParams)
        param['superQueryMatchType'] = this.superQueryMatchType
      }
      return filterObj(param);
    },

    // 重置
    searchReset(){
      var that = this;
      var logType = that.queryParam.logType;
      that.queryParam = {}; //清空查询区域参数
      that.queryParam.logType = logType;
      that.loadData(this.ipagination.current);
    },
    // 日志类型
    callback(key){

      // 动态添加操作类型列

      this.tabKey = '1';
      this.columns.splice(7,1);


      let that=this;
      that.queryParam.logType=key;
      that.loadData();
    },
    onDateChange: function (value, dateString) {
      console.log(dateString[0],dateString[1]);
      this.queryParam.createTime_begin=dateString[0];
      this.queryParam.createTime_end=dateString[1];
    },
    onDateOk(value) {
      console.log(value);
    },
  }
}
</script>
<style scoped>
.layout .ant-card{
  margin-top:0;
  padding:0;
}
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