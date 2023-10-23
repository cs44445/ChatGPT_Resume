<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="11" :lg="12" :md="13" :sm="24">
              <a-form-item label="">
                <j-input placeholder="请输入姓名" v-model="queryParam.name"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->
      <a-table
        ref="table"
        size="small"
        :scroll="{x:true}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="realname" slot-scope="text, record">
          <!-- <a @click="handleDetail(record)">{{ text }}</a> -->
          {{ text }}
        </template>
        <template slot="companyId_dictText" slot-scope="text, record">
          {{record.companyId_dictText}}
        </template>
        <template slot="createBy_dictText" slot-scope="text, record">
          {{record.createBy_dictText}}
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
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
  </j-modal>
</template>

<script>

  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusPersonForm from './BusPersonForm'
  export default {
    name: 'BusPersonModal',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BusPersonForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
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
            title:'姓名',
            dataIndex: 'realname',
            scopedSlots: {customRender: 'realname'}
          },
          {
            title:'邮箱',
            dataIndex: 'email'
          }, 
          {
            title: '性别',
            dataIndex: 'sex_dictText',
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
            width: 120,
          },
          {
            title:'职务',
            dataIndex: 'workerPost'
          },
          {
            title: '供应商编码',
            dataIndex: 'supplierCode',
          },
          {
            title: '供应商名称',
            dataIndex: 'supplierName',
            slots: { title: 'companyName' },
            scopedSlots: { customRender: 'companyName' },
          },
          {
            title: '入职日期',
            dataIndex: 'inductionTime',
          },
          {
            title: '价格',
            dataIndex: 'unitPrice',
          },
          {
            title: '状态',
            dataIndex: 'status_dictText',
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align:"center",
          //   fixed:"right",
          //   width:147,
          //   scopedSlots: { customRender: 'action' }
          // }
        ],
        url: {
          list: "/sys/user/queryWorkerList",
        },
        selectedRowKeys: [],
        selectionRows:[]
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          // this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        // this.$refs.realForm.submitForm();
        this.$emit('ok', this.selectionRows);
        this.close()
        this.selectedRowKeys = []
        this.selectionRows = []
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
        console.log('this.selectedRowKeys',this.selectedRowKeys)
      }
    }
  }
</script>