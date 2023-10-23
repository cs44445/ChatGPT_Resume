<template>
  <j-modal :title="title" :width="width" :visible="visible" @ok="handleOk" @cancel="handleCancel"
    :maskClosable="false" cancelText="取消" class="doc-box modal-input">
    <a-spin :spinning="confirmLoading">
      <j-form-container>
        <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
          <a-row>
            <!-- <a-col :span="24">
              <a-form-model-item label="里程碑名称" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="id">
                <a-select v-model="model.id" placeholder="请选择里程碑名称" @change="handleChange">
                  <a-select-option v-for="(item, key) in datalist" :key="key" :value="item.id">
                    {{ item.milepostCode }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="24">
              <a-form-model-item label="相关文档" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
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
  </j-modal>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getAction, httpAction } from '@/api/manage'
export default {
  name: 'ProStepDocumentsModal',
  data() {
    return {
      headers: {
      },
      title: '',
      width: 480,
      visible: false,
      model: {

      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      validatorRules: {},
      datalist: [],
      projectId: '',
      url: {
        // add: "/bus/busProjectMilepost/complete",
        // edit: "/bus/busProjectMilepost/complete",
        // queryById: "/bus/busProject/queryById",
        queryMilepostByProjectId: '/bus/busProject/queryMilepostByProjectId',
        uploadMilepostFile: '/bus/busProjectMilepost/uploadMilepostFile',
        uploadCompanyFile: 'bus/busCompany/uploadCompanyFile'
      },
      confirmLoading: false,
      uploadAction: window._CONFIG['domianURL'] + "/sys/common/upload",
      fileList2: [],
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };
    // console.log('test', window._CONFIG['domianURL'])
  },
  methods: {
    edit(projectId) {
      this.projectId = projectId
      this.handleMilepost()
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.fileList2 = []
    },
    // 里程碑切换
    handleChange(value) {
      this.model.id = value
      // console.log(999, this.model.id, value)
    },
    // 获取里程碑下拉数据
    handleMilepost() {
      getAction(this.url.queryMilepostByProjectId, { id: this.projectId }).then((res) => {
        this.datalist = res.result
      })
    },
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
      if (this.fileList2.length == 0) {
        that.confirmLoading = false;
        that.$message.warning('请完善文件上传信息');
        return false
      }
      let fileList = []
      this.fileList2.map((t) => { fileList.push(t.response.message) })
      this.model.fileList = fileList.join(',')
      this.model.id = this.projectId
      httpAction(that.url.uploadCompanyFile, that.model, 'post').then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.$emit('updateList')
          that.visible = false
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
@import '~@assets/less/common.less';

.doc-box {
  /deep/ .ant-modal-header {
    border-bottom: none;
    padding: 24px 24px 4px 24px;
  }

  /deep/ .ant-modal-title {
    font-size: 24px;
    font-weight: bold;
    color: #3D3D3D;
  }

  /deep/ .ant-form-item-label {
    font-weight: bold;
    line-height: unset;
  }

  /deep/ .ant-form-item {
    margin-bottom: 14px;
  }

  /deep/ .ant-modal-footer {
    border-top: none;

    &>div {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }

  /deep/ .ant-upload.ant-upload-drag {
    border: 1px dashed #EEF0F1;
    background: #F7F9FA;
    margin-top: 4px;
  }

  /deep/ .ant-upload.ant-upload-drag p.ant-upload-drag-icon {
    margin-bottom: 15px;
  }

  .doc-type {
    width: 55px;
    height: 62px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7px 0;
    box-sizing: border-box;
    margin-top: 4px;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
    }

    span {
      line-height: 20px;
      font-size: 12px;
      color: #000000;
    }
  }

  .typeact {
    background: #F7F9FA;
    border: 1px solid #EEF0F1;
  }
}
</style>