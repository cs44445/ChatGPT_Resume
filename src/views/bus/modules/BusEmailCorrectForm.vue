<template>
  <a-spin :spinning="confirmLoading">
    <div>
      <p style="font-size: 24px;font-weight: bold;color: #2F3133;">导入</p>
    </div>
    <j-form-container>
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="导入月份" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="id">
              <a-select placeholder="请选择年份" @change="handleChangeyear">
                <a-select-option value="2023">
                  2023
                </a-select-option>
              </a-select>
               <!-- v-model="model.id" -->
              <a-select placeholder="请选择月份" @change="handleChangemonth">
                <a-select-option v-for="(item, key) in datalist" :key="key" :value="item">
                  {{ item }}月
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="添加文件" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
              prop="fileList">
              <!-- <j-upload v-model="model.fileList"></j-upload> -->
              <!-- <a-upload-dragger name="file" :action="uploadAction" :headers="headers" :fileList="model.fileList" @change="handleFileChange">
                <p class="ant-upload-drag-icon">
                  <img src="@/assets/upload.png" alt="">
                </p>
                <p class="ant-upload-text">
                  拖拽您的文档到这里
                </p>
                <div class="ant-upload-hint">
                  <p style="margin-bottom:10px;">或者</p>
                  <a-button type="primary" size="small" ghost style="height:unset;padding:5px 15px;">点击上传</a-button>
                </div>
              </a-upload-dragger> -->
              <a-upload-dragger name="file" :action="uploadAction" :headers="headers" :data="{ 'biz': '10001' }"
                @change="handleChangeFile">
                <p class="ant-upload-drag-icon">
                  <img src="@/assets/upload.png" alt="">
                </p>
                <p class="ant-upload-text">
                  拖拽您的文档到这里
                </p>
                <div class="ant-upload-hint">
                  <p style="margin-bottom:10px;">或者</p>
                  <a-button type="primary" size="small" ghost style="height:unset;padding:5px 15px;">点击上传</a-button>
                </div>
              </a-upload-dragger>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getAction, httpAction } from '@/api/manage'

  export default {
    name: 'BusEmailCorrectForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
    return {
      headers: {
      },
      title: '',
      width: 480,
      visible: false,
      year:'',
      month:'',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      validatorRules: {},
      datalist: [1,2,3,4,5,6,7,8,9,10,11,12],
      projectId: '',
      url: {
        // queryMilepostByProjectId: '/bus/busProject/queryMilepostByProjectId',
        importExcel: '/bus/busEmailCorrect/importExcel',
        // importExcelUrl: "sys/user/importExcel",
      },
      confirmLoading: false,
      uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
      fileList2: [],
    }
    },
    computed:{
      // importExcelUrl: function(){
      //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      // }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = { "X-Access-Token": token };
    },
    methods: {
      edit(projectId) {
        this.projectId = projectId
        // this.handleMilepost()
        this.visible = true;
      },
      handleCancel() {
        this.visible = false;
        this.fileList2 = []
      },
      // 年份切换
      handleChangeyear(value) {
        this.year = value
      },
      // 月份切换
      handleChangemonth(value) {
        this.month = value
      },
      // 获取里程碑下拉数据
      // handleMilepost() {
      //   getAction(this.url.queryMilepostByProjectId, { id: this.projectId }).then((res) => {
      //     this.datalist = res.result
      //   })
      // },
      //文件拖拽
      handleChangeFile(info) {
        const status = info.file.status;
        // if (status !== 'uploading') {
        // console.log(info.fileList);
        // }
        if (status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully.`);
          // for(let i=0;i<info.fileList.length;i++){
          //   this.model.fileList=info.fileList[i].name+','
          // }
          this.fileList2 = info.fileList
        }
        // else if (status === 'error') {
        //   this.$message.error(`${info.file.name} file upload failed.`);
        // }
      },
      // 提交里程碑阶段文档
      handleOk() {
        const that = this;
        that.confirmLoading = true;
        if (!that.projectId || that.fileList2.length == 0) {
          that.confirmLoading = false;
          that.$message.warning('请完善文件上传信息');
          return false
        }
        let fileList = []
        that.fileList2.map((t) => { fileList.push(t.response.message) })
        fileList = fileList.join(',')
        
        let params = {
          // year:this.year,
          // month:this.month,
          // projectId:this.projectId,
          // file:fileList,
        }


        httpAction(that.url.importExcel+'?projectId='+that.projectId+"&year="+that.year+"&month="+that.month+"&filePath="+fileList,params, 'post').then((res) => {
          if (res.success) {
            that.$emit('updateList')
            that.visible = false
            that.$emit('close');
            that.$message.success(res.message);
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.confirmLoading = false;
        })

      },
    }
  }
</script>
<style lang="less" scoped>
/deep/ .ant-select{
  width: 50%;
}
</style>