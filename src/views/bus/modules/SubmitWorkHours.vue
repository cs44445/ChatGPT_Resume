<template>
    <a-modal
      :title="ifShow?'查看工时':'提交工时'"
      :visible="visible"
      :width="800"

      @ok="handleOk"
      @cancel="handleCancel"
    >

        <a-table :columns="columns" :data-source="parentData"  size="small" :expandIcon="expandIcon" :pagination="false" class="ptable">
          <template slot="daily" slot-scope="text">
              <a-tooltip placement="left">
                <template slot="title">
                  {{ text }}
                </template>
                <!-- <a-icon type="read" style="font-size:20px"/> -->
                <img :src="require('@assets/read.png')"/>
            </a-tooltip>
            </template>
            <a-table
            slot="expandedRowRender"
            slot-scope="record" class="sontable"
            :columns="innerColumns"
            :data-source="record.childList?record.childList:[]"
            :pagination="false"
            size="small"
            >
            </a-table>
        </a-table>
        <div slot="footer" style="display: flex;justify-content: space-between;">
          <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
          <a-button v-if="!ifShow" @click="handleOk" type="primary" style="margin-bottom: 0;" :loading="confirmLoading">提交</a-button>
        </div>
    </a-modal>
  </template>
  <script>
  import { getAction,postAction } from '@/api/manage'

  export default {
    name:'SubmitWorkHours',
    data() {
      return {
        parentData:[],
        columns: [
          {
            title: '日期',
            key: 'date',
            dataIndex: 'date',
          },
          {
            title: '总工时(h)',
            key: 'allHours',
            dataIndex: 'allHours',
          },
          {
            title: '正常工时(h)',
            key: 'workHours',
            dataIndex: 'workHours',
          },
          {
            title: '加班工时(h)',
            key: 'overTimeHours',
            dataIndex: 'overTimeHours',
          },
          {
            title: '日报',
            key: 'daily',
            dataIndex: 'daily',
            scopedSlots: { customRender: 'daily' }
          }

        ],
        visible: false,
        confirmLoading: false,
        innerColumns: [
          {
            title: '项目名称',
            key: 'projectName',
            dataIndex: 'projectName',
          },{
            title: '项目编号',
            key: 'projectCode',
            dataIndex: 'projectCode',
          },
          {
            title: '项目里程碑',
            key: 'milepostCode',
            dataIndex: 'milepostCode',
          },
          // {
          //   title: '总工时',
          //   dataIndex: 'totalHours',
          //   key: 'totalHours',
          // },{
          //   title: '正常工时',
          //   dataIndex: 'workHours',
          //   key: 'workHours',
          // },
          {
            title: '是否加班',
            dataIndex: 'ifOvertime',
            key: 'ifOvertime',
            customRender: function (text) {
              if (text === '1') {
                return '是'
              }  else {
                return '否'
              }
            }
          },
          {
            title: '加班类型',
            dataIndex: 'overtimeType',
            key: 'overtimeType',
            customRender: function (text) {
              if (text === '1') {
                return '普通加班'
              }else if(text === '2'){
                return '周末加班'
              }else if(text === '3') {
                return '节假日加班'
              }else{
                return ''
              }
            }
          },
          // {
          //   title: '加班工时',
          //   dataIndex: 'overtimeHours',
          //   key: 'overtimeHours',
          // }
        ],
        innerData: [],
        url:{
          commitWorkHours:'bus/busProjectActual/commitWorkHours',
          getWorkHoursByDate:'bus/busApprovalActual/getWorkHoursByDate'
        },
        dateList:[],
        ifShow:false
      };
    },
    methods:{
      // 展开图标
      expandIcon(props) {
     //判断当有子级时添加图标
        if (props.record.childList.length > 0) {
        //有数据-展开时候图标
          if (props.expanded) {
          //这里的margin-right是为了让图标和字体有一点间距
            return (
              <span
                 style="margin-right:10px"
                onClick={(e) => {
                  props.onExpand(props.record, e);
                }}
              >
                <a-icon type="down" />
              </span>
            );
           //无数据时-关闭的图标
          } else {
            return (
              <span
                style="margin-right:10px"
                onClick={(e) => {
                  props.onExpand(props.record, e);
                }}
              >
                <a-icon type="right" />
              </span>
            );
          }
        } else {
        //这里是为了让无图标子级的父元素也给了个margin-right，让它跟有子级的父元素在同一竖线上
          return <span style="margin-right:19px"></span>;
        }
      },
      loadData(date){
        let url = this.url.getWorkHoursByDate + '?date=' + date
        this.parentData = []
         getAction(url).then(res=>{
           if(res.success){
             this.parentData = res.result
           }
         })
      },
        handleOk(e) {
            this.confirmLoading = true;
            let url = this.url.commitWorkHours + '?date=' + this.dateList.join(',')
            postAction(url).then(res=>{
              if(res.success){
                this.$message.success(res.message)
                this.$emit('handleStatus')
                setTimeout(() => {
                    this.visible = false;
                    this.confirmLoading = false;
                }, 1500);
              }else{
                this.$message.warning(res.message)
              }
            })

        },
        handleCancel(e) {
            this.visible = false;
        },
    }
  };
  </script>
  <style scoped>
  ::v-deep .ant-modal-header{
        border: none;
    }
    ::v-deep .ant-modal-footer{
        border: none;
    }
    ::v-deep .ant-modal-title{
       font-weight: bold;
       font-size: 24px;
    }
    ::v-deep .ant-table-row-expand-icon{
       background: none;
       border: none;
    }
    ::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td{
      background: #f4f5f6;
    }
    ::v-deep .sontable .ant-table-column-title{
      font-size: 14px;
      font-weight: normal;
      color: #8D9399;
    }
    ::v-deep .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{
      font-size: 14px;
      font-weight: normal;
      color: #2F3133;
    }
    ::v-deep .sontable .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td{
      font-size: 14px;
      font-weight: normal;
      color: #2F3133;
    }
    ::v-deep .ptable .ant-table-column-title{
      font-size: 14px;
      font-weight: bold;
      color: #3D3D3D;
    } 
</style>
