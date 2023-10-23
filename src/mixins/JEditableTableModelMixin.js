import JEditableTable from '@/components/jeecg/JEditableTable'
import MyEditableTable from '@/components/jeecg/MyEditableTable'
import { VALIDATE_NO_PASSED, getRefPromise, validateFormModelAndTables } from '@/utils/JEditableTableUtil'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'

export const JEditableTableModelMixin = {
    components: {
        JEditableTable,
        MyEditableTable
    },
    data() {
        return {
            title: '操作',
            visible: false,
            confirmLoading: false,
            model: {},
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        }
    },
    methods: {

        /** 获取所有的editableTable实例 */
        getAllTable() {
            if (!(this.refKeys instanceof Array)) {
                throw this.throwNotArray('refKeys')
            }
            let values = this.refKeys.map(key => getRefPromise(this, key))
            return Promise.all(values)
        },

        /** 遍历所有的JEditableTable实例 */
        eachAllTable(callback) {
            // 开始遍历
            this.getAllTable().then(tables => {
                tables.forEach((item, index) => {
                    if (typeof callback === 'function') {
                        callback(item, index)
                    }
                })
            })
        },
        /** 当点击新增按钮时调用此方法 */
        add() {
            //update-begin-author:lvdandan date:20201113 for:LOWCOD-1049 JEditaTable,子表默认添加一条数据，addDefaultRowNum设置无效 #1930
            return new Promise((resolve) => {
                    this.tableReset();
                    resolve();
                }).then(() => {
                    // 默认新增空数据
                    let rowNum = this.addDefaultRowNum
                    if (typeof rowNum !== 'number') {
                        rowNum = 1
                        console.warn('由于你没有在 data 中定义 addDefaultRowNum 或 addDefaultRowNum 不是数字，所以默认添加一条空数据，如果不想默认添加空数据，请将定义 addDefaultRowNum 为 0')
                    }
                    this.eachAllTable((item) => {
                        item.add(rowNum)
                    })
                    if (typeof this.addAfter === 'function') this.addAfter(this.model)
                    this.edit(this.model)
                })
                //update-end-author:lvdandan date:20201113 for:LOWCOD-1049 JEditaTable,子表默认添加一条数据，addDefaultRowNum设置无效 #1930
        },
        /** 当点击了编辑（修改）按钮时调用此方法 */
        edit(record) {
            if (record && '{}' != JSON.stringify(record) && record.id) {
                this.tableReset();
            }
            if (typeof this.editBefore === 'function') this.editBefore(record)
            this.visible = true
            this.activeKey = this.refKeys[0]
            this.$refs.form.resetFields()
            this.model = Object.assign({}, record)
            if (typeof this.editAfter === 'function') this.editAfter(this.model)
        },
        /** 关闭弹窗，并将所有JEditableTable实例回归到初始状态 */
        close() {
            this.visible = false
            this.$emit('close')
        },
        //清空子表table的数据
        tableReset() {
            this.eachAllTable((item) => {
                item.clearRow()
            })
        },
        /** 查询某个tab的数据 */
        requestSubTableData(url, params, tab, success) {
            tab.loading = true
            getAction(url, params).then(res => {
                let { result } = res
                let dataSource = []
                if (result) {
                    if (Array.isArray(result)) {
                        dataSource = result
                    } else if (Array.isArray(result.records)) {
                        dataSource = result.records
                    }
                }
                tab.dataSource = dataSource
                typeof success === 'function' ? success(res) : ''
            }).finally(() => {
                tab.loading = false
            })
        },
        /** 发起请求，自动判断是执行新增还是修改操作 */
        request(formData) {
            let url = this.url.add,
                method = 'post'
            if (this.model.id) {
                url = this.url.edit
                method = 'put'
            }
            this.confirmLoading = true
            httpAction(url, formData, method).then((res) => {
                if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.close()
                } else {
                    this.$message.warning(res.message)
                }
            }).finally(() => {
                this.confirmLoading = false
            })
        },
        /** 发起请求，自动判断是执行新增还是修改操作 */
        processApprRequest(formData) {
            let url = this.url.add,
                method = 'post'
            if (this.model.id) {
                url = this.url.edit
                method = 'put'
            }
            // this.confirmLoading = true
            httpAction(url, formData, method).then((res) => {
                if (res.success) {
                    // this.$message.success(res.message)
                    // this.$emit('ok')
                    // this.close()
                    console.log('test', formData.params)
                    postAction(this.url.passUrl, formData.params).then(res => {
                        if (res.success) {
                            this.$message.success(res.message)
                            this.$emit('addok')
                        } else {
                            this.$message.warning(res.message)
                        }
                    })
                } else {
                    this.$message.warning(res.message)
                }
            }).finally(() => {
                // this.confirmLoading = false
            })
        },
        /** 资金追加接口发起请求，自动判断是执行新增还是修改操作 */
        request1(formData) {
            if (formData.unitSource) {
                formData.unitSource = formData.unitSource.join(',')
            }
            if (formData.projectLocationName) {
                formData.projectLocationName = formData.projectLocationName.join(',')
            }
            let params = {
                applyType: 2,
                busApplyAmountList: [{
                    actualAmountMonth: formData.actualAmountMonth,
                    applyDate: formData.applyDate,
                    applyId: formData.applyId,
                    constructionType: formData.constructionType,
                    delFlag: formData.delFlag,
                    // id: formdate.id,
                    productionType: formData.productionType,
                    remark: '',
                    // sysOrgCode: formdate.sysOrgCode
                }],
                busFileList: formData.busProjectFileList,
                delFlag: formData.delFlag,
                id: formData.id,
                industryNature: formData.industryNature,
                industryType: formData.industryType,
                investmentScale: formData.investmentScale,
                projectAsset: formData.projectAsset,
                projectAssetUnit: formData.projectAssetUnit,
                projectCode: formData.projectCode,
                projectContext: formData.projectContext,
                projectId: formData.projectId,
                projectLocationId: formData.projectLocationId,
                projectLocationName: formData.projectLocationName,
                projectName: formData.projectName,
                remark: formData.remark,
                status: formData.status,
                submitTime: formData.submitTime,
                sysOrgCode: formData.sysOrgCode,
                unitName: formData.unitName,
                unitSource: formData.unitSource,
                assigneeList: formData.assigneeList //会签人
            }
            let url = '/bus/busAddApply/add',
                method = 'post'
            this.confirmLoading = true
            httpAction(url, params, method).then((res) => {
                if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.close()
                } else {
                    this.$message.warning(res.message)
                }
            }).finally(() => {
                this.confirmLoading = false
            })
        },
        /* --- handle 事件 --- */

        /** ATab 选项卡切换事件 */
        handleChangeTabs(key) {
            // 自动重置scrollTop状态，防止出现白屏
            getRefPromise(this, key).then(editableTable => {
                editableTable.resetScrollTop()
            })
        },
        /** 关闭按钮点击事件 */
        handleCancel() {
            this.close()
        },
        /** 确定按钮点击事件 */
        handleOk() {
            /** 触发表单验证 */
            this.getAllTable().then(tables => {
                /** 一次性验证主表和所有的次表 */
                return validateFormModelAndTables(this.$refs.form, this.model, tables)
            }).then(allValues => {
                /** 一次性验证一对一的所有子表 */
                return this.validateSubForm(allValues)
            }).then(allValues => {
                if (typeof this.classifyIntoFormData !== 'function') {
                    throw this.throwNotFunction('classifyIntoFormData')
                }
                // console.log("allValues",allValues)
                let formData = this.classifyIntoFormData(allValues)
                    // 发起请求
                return this.request(formData)
            }).catch(e => {
                if (e.error === VALIDATE_NO_PASSED) {
                    // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                    //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                    this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
                        //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                } else {
                    console.error(e)
                }
            })
        },
        /** 申报项目确定按钮点击事件 */
        handleDeclareOk() {
            /** 触发表单验证 */
            this.getAllTable().then(tables => {
                /** 一次性验证主表和所有的次表 */
                console.log(tables, this.model, this.$refs.form, "-------")
                return validateFormModelAndTables(this.$refs.form, this.model, tables)
            }).then(allValues => {
                /** 一次性验证一对一的所有子表 */
                return this.validateSubForm(allValues)
            }).then(allValues => {
                if (typeof this.classifyIntoFormData !== 'function') {
                    throw this.throwNotFunction('classifyIntoFormData')
                }
                console.log("allValues", allValues)
                let formData = this.classifyIntoFormData(allValues)
                    // 发起请求
                return this.declarerequest(formData)
            }).catch(e => {
                if (e.error === VALIDATE_NO_PASSED) {
                    // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                    //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                    this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
                        //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                } else {
                    console.error(e)
                }
            })
        },
        /** 申报项目发起请求，自动判断是执行新增还是修改操作 */
        declarerequest(formData) {
            let a = {
                handType: formData.handType,
                applyId: formData.applyId,
                applyType: 1,
                busApplyAmountList: [{
                    actualAmountMonth: formData.actualAmountMonth,
                    applyDate: formData.applyDate,
                    applyId: formData.applyId,
                    constructionType: formData.constructionType,
                    delFlag: formData.delFlag,
                    // id: formdate.id,
                    productionType: formData.productionType,
                    remark: '',
                    // sysOrgCode: formdate.sysOrgCode
                }],
                busFileList: formData.busFileList,
                delFlag: formData.delFlag,
                id: formData.id,
                industryNature: formData.industryNature,
                industryType: formData.industryType,
                investmentScale: formData.investmentScale,
                projectAsset: formData.projectAsset,
                projectAssetUnit: formData.projectAssetUnit,
                projectCode: formData.projectCode,
                projectContext: formData.projectContext,
                projectLocationId: formData.projectLocationId,
                projectLocationName: formData.projectLocationName,
                projectName: formData.projectName,
                remark: formData.remark,
                status: formData.status,
                submitTime: null,
                sysOrgCode: formData.sysOrgCode,
                unitName: formData.unitName,
                unitSource: formData.unitSource,
                assigneeList: formData.assigneeList //会签人
            }
            let url = this.url.add,
                method = 'post'
            this.confirmLoading = true
            httpAction(url, a, method).then((res) => {
                if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.close()
                } else {
                    this.$message.warning(res.message)
                }
            }).finally(() => {
                this.confirmLoading = false
            })
        },
        /** 资金追加确定按钮点击事件 */
        handleOk1() {
            /** 触发表单验证 */
            this.getAllTable().then(tables => {
                /** 一次性验证主表和所有的次表 */
                return validateFormModelAndTables(this.$refs.form, this.model, tables)
            }).then(allValues => {
                /** 一次性验证一对一的所有子表 */
                return this.validateSubForm(allValues)
            }).then(allValues => {
                if (typeof this.classifyIntoFormData !== 'function') {
                    throw this.throwNotFunction('classifyIntoFormData')
                }
                let formData = this.classifyIntoFormData(allValues)
                console.log(formData, 'formData')
                    // 发起请求
                return this.request1(formData)
            }).catch(e => {
                if (e.error === VALIDATE_NO_PASSED) {
                    // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                    //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                    this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
                        //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                } else {
                    console.error(e)
                }
            })
        },
        /** 资金追加列表保存的按钮点击事件 */
        handleAddOk() {
            /** 触发表单验证 */
            this.getAllTable().then(tables => {
                /** 一次性验证主表和所有的次表 */
                return validateFormModelAndTables(this.$refs.form, this.model, tables)
            }).then(allValues => {
                /** 一次性验证一对一的所有子表 */
                return this.validateSubForm(allValues)
            }).then(allValues => {
                if (typeof this.classifyIntoFormData !== 'function') {
                    throw this.throwNotFunction('classifyIntoFormData')
                }
                // console.log("allValues",allValues)
                let formData = this.classifyIntoFormData(allValues)
                    // 发起请求
                return this.addrequest(formData)
            }).catch(e => {
                if (e.error === VALIDATE_NO_PASSED) {
                    // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                    //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                    this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
                        //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                } else {
                    console.error(e)
                }
            })
        },
        /** 确定按钮点击事件 */
        handleProcessApprOk() {
            /** 触发表单验证 */
            this.getAllTable().then(tables => {
                /** 一次性验证主表和所有的次表 */
                return validateFormModelAndTables(this.$refs.form, this.model, tables)
            }).then(allValues => {
                /** 一次性验证一对一的所有子表 */
                return this.validateSubForm(allValues)
            }).then(allValues => {
                if (typeof this.classifyIntoFormData !== 'function') {
                    throw this.throwNotFunction('classifyIntoFormData')
                }
                let formData = this.classifyIntoFormData(allValues)
                console.log("fsdfgdgdfg", formData)
                    // 发起请求
                return this.processApprRequest(formData)
            }).catch(e => {
                if (e.error === VALIDATE_NO_PASSED) {
                    // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                    //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                    this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
                        //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                } else {
                    console.error(e)
                }
            })
        },
        /** 资金追加接口发起请求，自动判断是执行新增还是修改操作 */
        addrequest(formData) {
            let params = {
                handType: formData.handType,
                applyType: 2,
                busApplyAmountList: [{
                    actualAmountMonth: formData.actualAmountMonth,
                    applyDate: formData.applyDate,
                    applyId: formData.applyId,
                    constructionType: formData.constructionType,
                    delFlag: formData.delFlag,
                    // id: formdate.id,
                    productionType: formData.productionType,
                    remark: '',
                    // sysOrgCode: formdate.sysOrgCode
                }],
                busFileList: formData.busFileList,
                delFlag: formData.delFlag,
                id: formData.id,
                industryNature: formData.industryNature,
                industryType: formData.industryType,
                investmentScale: formData.investmentScale,
                projectAsset: formData.projectAsset,
                projectAssetUnit: formData.projectAssetUnit,
                projectCode: formData.projectCode,
                projectContext: formData.projectContext,
                projectId: formData.projectId,
                projectLocationId: formData.projectLocationId,
                projectLocationName: formData.projectLocationName,
                projectName: formData.projectName,
                remark: formData.remark,
                status: formData.status,
                // sysOrgCode: formdate.sysOrgCode,
                unitName: formData.unitName,
                unitSource: formData.unitSource,
                assigneeList: formData.assigneeList, //会签人
                chanceId :formData.chanceId,
                chanceCode:formData.chanceCode,
            }

            let url = '/bus/busAddApply/add',
                method = 'post'
            if (this.model.id) {
                url = '/bus/busAddApply/edit',
                method = 'put'
            }
            httpAction(url, params, method).then(res => {
                if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.close()
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        /** 项目申报列表保存的按钮点击事件 */
        handleApplyOk() {
            /** 触发表单验证 */
            this.getAllTable().then(tables => {
                /** 一次性验证主表和所有的次表 */
                return validateFormModelAndTables(this.$refs.form, this.model, tables)
            }).then(allValues => {
                /** 一次性验证一对一的所有子表 */
                return this.validateSubForm(allValues)
            }).then(allValues => {
                if (typeof this.classifyIntoFormData !== 'function') {
                    throw this.throwNotFunction('classifyIntoFormData')
                }
                console.log("allValues", allValues)
                let formData = this.classifyIntoFormData(allValues)
                    // 发起请求
                return this.applyrequest(formData)
            }).catch(e => {
                if (e.error === VALIDATE_NO_PASSED) {
                    // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                    //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                    this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
                        //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
                } else {
                    console.error(e)
                }
            })
        },
        /** 项目申报接口发起请求，自动判断是执行新增还是修改操作 */
        applyrequest(formdate) {
            let url = this.url.add,
                method = 'post'
            if (this.model.id) {
                url = this.url.edit
                method = 'put'
            }
            let params = {
                handType: formdate.handType,
                applyType: 1,
                busApplyAmountList: [{
                    actualAmountMonth: formdate.actualAmountMonth,
                    applyDate: formdate.applyDate,
                    applyId: formdate.applyId,
                    constructionType: formdate.constructionType,
                    delFlag: formdate.delFlag,
                    // id: formdate.id,
                    productionType: formdate.productionType,
                    remark: '',
                    // sysOrgCode: formdate.sysOrgCode
                }],
                busFileList: formdate.busFileList,
                delFlag: formdate.delFlag,
                id: formdate.id,
                industryNature: formdate.industryNature,
                industryType: formdate.industryType,
                investmentScale: formdate.investmentScale,
                projectAsset: formdate.projectAsset,
                projectAssetUnit: formdate.projectAssetUnit,
                projectCode: formdate.projectCode,
                projectContext: formdate.projectContext,
                projectId: formdate.projectId,
                projectLocationId: formdate.projectLocationId,
                projectLocationName: formdate.projectLocationName,
                projectName: formdate.projectName,
                remark: formdate.remark,
                status: formdate.handType == 1 ? 1 : 2,
                // sysOrgCode: formdate.sysOrgCode,
                unitName: formdate.unitName,
                unitSource: formdate.unitSource,
                assigneeList: formdate.assigneeList, //会签人
                chanceId :formdate.chanceId,
                chanceCode:formdate.chanceCode,
            }
            httpAction(url, params, method).then(res => {
                if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.close()
                } else {
                    this.$message.warning(res.message)
                }
            })
        },
        //校验所有子表表单
        validateSubForm(allValues) {
            return new Promise((resolve) => {
                resolve(allValues)
            })
        },
        /* --- throw --- */

        /** not a function */
        throwNotFunction(name) {
            return `${name} 未定义或不是一个函数`
        },

        /** not a array */
        throwNotArray(name) {
            return `${name} 未定义或不是一个数组`
        }

    }
}