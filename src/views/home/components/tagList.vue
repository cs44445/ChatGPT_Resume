<template>
    <a-drawer title="我在里程碑中的标签" :width="width" placement="right" :maskClosable="false" @close="close" destroyOnClose
        :visible="visible" class="miles-detail-box">
        <div class="miles-detail-list">
            <div class="detail-list-container" v-for="(item, i) in tagData" :key="i">
                <div class="miles-detail-left">
                    <div class="miles-detail-cald">
                        <div class="cald-month"
                            :style="{ background: item.colorStatus == '1' ? '#136DEB' : (item.colorStatus == '2' ? '#F2B202' : '#D92929') }">
                            {{ item.endTime.substr(5, 2).replace(/\b(0+)/gi, '') + '月' }}</div>
                        <div class="cald-day">{{ item.endTime.substr(8, 2).replace(/\b(0+)/gi, '') }}</div>
                        <div class="cald-week">{{ getWeek(item.endTime) }}</div>
                    </div>
                    <div class="cald-today"
                        :style="{ background: item.colorStatus == '1' ? 'rgba(19, 109, 235, 0.3)' : (item.colorStatus == '2' ? 'rgba(242, 178, 2, 0.3)' : 'rgba(217, 41, 41, 0.3)') }">
                        {{ item.dayNum }}</div>
                </div>
                <div class="miles-detail-con">
                    <div class="detail-con-title"><span>{{ item.milepostName }}</span><span class="tag-text">标签</span></div>
                    <div class="detail-con-name">{{ item.owner }}</div>
                    <div class="detail-con-date">
                        <span>{{ item.beginTime }} 至 {{ item.endTime }}</span>
                        <div class="tag-box">
                            <template v-if="item.userTitleInfo">
                                <template v-for="(tag, tagi) in item.userTitleInfo">
                                    <a-tag :key="tagi" :closable="true"
                                        @close="() => handleClose(tag, item.userTitleInfo, item.estimateId)"
                                        :color="colorList[tagi]">
                                        {{ tag }}
                                    </a-tag>  
                                </template>
                            </template>
                            <a-auto-complete v-if="inputVisible[i].visible" :autoFocus="inputVisible[i].visible"
                                v-model="tagValue[i].value" :data-source="dataSourceTag" placeholder="请选择/输入"
                                @blur="onChangeAdd(item, $event, i)" />
                            <a-icon type="plus-circle" class="tag-icon" @click="showInput(i)"
                                v-show="item.userTitleInfo.length < 3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-drawer>
</template>
  
<script>
import { postAction, putAction } from '@/api/manage'
import { ajaxGetDictItems } from '@/api/api'
export default {
    name: 'MilestoneDetail',
    data() {
        return {
            width: '800px',
            visible: false,
            tagInfo: '/bus/home/getMilepostTagInfoByProjectId',
            tagEdit: '/bus/busProjectEstimate/edit',//表格标签编辑
            tagData: [],
            inputVisible: [],
            colorList: ['#B5D160', '#63D7D0', '#5ED895'],
            tagValue: [],
            projectIdCopy: '',
            dataSourceTag: [],
        }
    },
    created() {
        this.getTagsDict()
    },
    methods: {
        //根据字典Code, 初始化字典数组
        getTagsDict() {
            ajaxGetDictItems('stage_role', null).then((res) => {
                if (res.success) {
                    // console.log(res.result);
                    this.dataSourceTag = res.result;
                }
            })
        },
        edit(projectId) {
            this.projectIdCopy = projectId
            this.getTagInfo(projectId)
            this.visible = true
        },
        getTagInfo(projectId) {
            postAction(this.tagInfo + '?projectId=' + projectId).then(res => {
                if (res.success) {
                    this.tagData = res.result
                    let copyTagValue = []
                    let copyInputVisible = []
                    for (let i = 0; i < this.tagData.length; i++) {
                        copyTagValue.push({ value: '' })
                        copyInputVisible.push({ visible: false })
                    }
                    this.tagValue = copyTagValue
                    this.inputVisible = copyInputVisible
                } else {
                    this.$message.warn(res.message)
                }
            })
        },
        //周几格式化
        getWeek(date) {
            let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            return datelist[new Date(date).getDay()]
        },
        showInput(i) {
            this.inputVisible[i].visible = true;
        },
        handleClose(removedTag, position, id) {
            let tags = position.filter(tag => tag !== removedTag);
            if (tags.length == 0) {
                tags = ''
            } else {
                tags = tags.join(',')
            }
            console.log('clear', removedTag, position, tags);
            putAction(this.tagEdit, { id: id, userTitle: tags }).then((res) => {
                if (res.success) {
                    this.getTagInfo(this.projectIdCopy);
                    this.$emit('tagUpdate')
                    this.$message.success('修改成功')
                } else {
                    this.$message.warning('修改失败')
                }
            });
            // this.tags = tags;
        },
        onChangeAdd(record, e, i) {
            console.log('blur', record, e);
            if (e) {
                let isExsit = record.userTitleInfo.find((ele) => ele === e)
                if (isExsit) {
                    this.$message.warning('标签已存在请重新选择')
                } else {
                    let addTags = ''
                    if (record.userTitleInfo.length == 0) {
                        addTags = e
                    } else {
                        addTags = record.userTitleInfo.join(',') + ',' + e
                    }
                    console.log('addTags', addTags);
                    this.inputVisible[i].visible = false;
                    putAction(this.tagEdit, { id: record.estimateId, userTitle: addTags }).then((res) => {
                        if (res.success) {
                            this.getTagInfo(this.projectIdCopy);
                            this.$emit('tagUpdate')
                            this.$message.success('修改成功')
                        } else {
                            this.$message.warning('修改失败')
                        }
                    });
                }
            } else {
                this.inputVisible[i].visible = false;
            }
        },
        close() {
            this.$emit('close');
            this.visible = false;
        },
        handleOk() {
            this.$refs.realForm.submitForm();
        },
        submitCallback() {
            this.$emit('ok');
            this.visible = false;
        },
        handleCancel() {
            this.close()
        }
    }
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
}

.miles-detail-box /deep/ .ant-drawer-content {
    background-color: #F7F8FA;
}

.miles-detail-box /deep/ .ant-drawer-header {
    border-bottom: none;
    padding: 24px;
    background: #F7F8FA;
}

.miles-detail-box /deep/ .ant-drawer-title {
    font-size: 24px;
    font-weight: bold;
    color: #2F3133;
}

.miles-detail-box /deep/ .ant-tag {
    padding: 2px 12px;
    border-radius: 20px;
}

.miles-detail-box {
    .miles-detail-list {
        width: 100%;
    }

    .detail-list-container {
        display: flex;
        gap: 16px;
        padding-bottom: 24px;
        border-bottom: 1px solid #EDEFF0;
        margin-bottom: 24px;
    }

    .miles-detail-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
    }

    .miles-detail-cald {
        width: 92px;
        display: flex;
        flex-direction: column;
    }

    .cald-month {
        box-sizing: border-box;
        background: #136DEB;
        height: 30px;
        font-size: 20px;
        color: #fff;
        width: 100%;
        border-top-left-radius: 19px;
        border-top-right-radius: 19px;
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .cald-day {
        background: #FFFFFF;
        font-size: 28px;
        // font-weight: bold;
        color: #090909;
        text-align: center;
        line-height: 25px;
        padding-top: 10px;
    }

    .cald-week {
        background: #FFFFFF;
        border-bottom-left-radius: 19px;
        border-bottom-right-radius: 19px;
        color: #999999;
        font-size: 12px;
        text-align: center;
        padding: 0 0 3px 5px;
    }

    .cald-today {
        height: 21px;
        border-radius: 150px;
        background: rgba(19, 109, 235, 0.3);
        color: #fff;
        padding: 0 11px;
    }

    .miles-detail-con {
        display: flex;
        flex-direction: column;
        color: #2F3133;
        flex: 1;
        padding-right: 56px;
    }

    .detail-con-title {
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
    }

    .tag-text {
        color: rgba(47, 49, 51, 0.4);
        font-size: 14px;
    }

    .detail-con-name {
        margin-top: 8px;
    }

    .detail-con-date {
        font-size: 13px;
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
    }

    .tag-sty {
        height: 24px;
        border-radius: 375px;
        padding: 4px 12px;
        background: #B5D160;
        font-size: 12px;
        color: #FFFFFF;
        font-weight: 500;
    }

    .tag-box {
        display: flex;
        align-items: center;
    }

    .tag-icon {
        font-size: 24px;
        color: #D3DCE5;
    }
}
</style>