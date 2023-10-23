<template>
    <j-modal :title="title" :width="width" :visible="visible" @ok="handleOk" @cancel="handleCancel" :maskClosable="false"
        cancelText="取消" class="online-box modal-input">
        <a-spin :spinning="confirmLoading">
            <j-form-container>
                <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
                    <a-row>
                        <a-col :span="24">
                            <a-form-model-item label="里程碑" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                prop="id">
                                <a-select v-model="model.referId" placeholder="请选择里程碑名称" @change="handleChange">
                                    <a-select-option v-for="(item, key) in datalist" :key="key" :value="item.id">
                                        {{ item.milepostCode }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item label="文件名称" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                prop="fileName">
                                <a-input v-model="model.fileName" placeholder="请输入文件名称"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-model-item label="文件类型" labelAlign="left" :labelCol="labelCol" :wrapperCol="wrapperCol"
                                prop="fileSuffix">
                                <!-- <a-select @change="handleChangeType" placeholder="请选择文件类型" v-model="model.file_suffix">
                                    <a-select-option value=".docx">文档</a-select-option>
                                    <a-select-option value=".xlsx">表格</a-select-option>
                                </a-select> -->
                                <div style="display:flex;align-items:center;gap:18px;">
                                    <div class="doc-type" :class="{ typeact: model.fileSuffix == '.docx' }"
                                        @click="docTypeChange('.docx')">
                                        <img src="@/assets/word.png" alt="">
                                        <span>Word</span>
                                    </div>
                                    <div class="doc-type" :class="{ typeact: model.fileSuffix == '.xlsx' }"
                                        @click="docTypeChange('.xlsx')">
                                        <img src="@/assets/excel.png" alt="">
                                        <span>Excel</span>
                                    </div>
                                </div>

                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </a-form-model>
            </j-form-container>
        </a-spin>
    </j-modal>
</template>
  
<script>
import { getAction, httpAction } from '@/api/manage'
export default {
    name: 'BusFileOnlineModal',
    data() {
        return {
            title: '',
            width: 480,
            visible: false,
            model: {
                fileSuffix: '.docx'
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
                add: "/bus/busFileOnline/add",
                edit: "/bus/busFileOnline/edit",
                queryById: "/bus/busFileOnline/queryById",
                queryMilepostByProjectId: '/bus/busProject/queryMilepostByProjectId',
                uploadMilepostFile: '/bus/busProjectMilepost/uploadMilepostFile'
            },
            confirmLoading: false
        }
    },
    methods: {
        edit(projectId) {
            this.projectId = projectId
            this.handleMilepost()
            this.visible = true;
        },
        handleCancel() {
            this.visible = false;
            this.model.referId = undefined
            this.model.fileName = undefined
        },
        // 里程碑切换
        handleChange(value) {
            this.model.referId = value
            // console.log(999, this.model.id, value)
        },
        //文件类型切换
        docTypeChange(type) {
            this.model.fileSuffix = type
        },
        // 获取里程碑下拉数据
        handleMilepost() {
            getAction(this.url.queryMilepostByProjectId, { id: this.projectId }).then((res) => {
                this.datalist = res.result
            })
        },
        // 提交里程碑在线文档
        handleOk() {
            const that = this;
            that.confirmLoading = true;
            that.model.projectId = that.projectId
            if (!this.model.fileName || !this.model.referId) {
                that.confirmLoading = false;
                return that.$message.warning('请填写文件信息');
            }
            httpAction(that.url.add, that.model, 'post').then((res) => {
                if (res.success) {
                    that.$message.success(res.message);
                    that.$emit('updateList')
                    that.visible = false
                    this.model.referId = undefined
                    this.model.fileName = undefined
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

.online-box {
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