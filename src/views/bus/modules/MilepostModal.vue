<template>
  <j-modal :title="title" :width="width" :visible="visible" :closable="false"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }" :maskClosable="false" class="milestone-modal modal-input">
    <a-spin :spinning="confirmLoading">
      <a-row class="milestone-box" type="flex" justify="center" align="top">
        <!-- 步骤条 -->
        <a-col :span="7">
          <a-steps direction="vertical" size="small" labelPlacement="left" :current="current" @change="onChange"
            class="steps-own">
            <a-step :title="item.title" :disabled="item.disabled" :status="item.status" v-for="item in stepsInit"
              :key="item.itemIndex">
            </a-step>
            <div @click="addStep" class="add-step-sty" v-if="detailData.projectType == '1'">
              <div class="addsty-cust" style="margin-top:0;">
              <a-icon slot="icon" type="plus" style="font-size: 16px; color: #2F3133" />
              </div>
              <span></span>
            </div>
          </a-steps>

        </a-col>
        <!-- 表单 -->
        <a-col :span="17">
          <div class="steps-right">
            <div class="steps-content">
              {{ current }}
              <a-form-model ref="stepform" :model="model" slot="detail" :rules="validatorRules">
                <a-row style="height:500px;overflow-y:scroll;">
                  
                <!-- 1.Job information -->
                <template v-if="current === 0">
                  <a-row style="height:500px;overflow-y:scroll;">
                      <a-col :span="24" style="position:relative;padding: 0 20px;" class="no-line-height">
                        <a-form-model-item label="职位名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="milepostCode"
                          colon="false" style="margin-bottom:12px;">
                          <a-auto-complete v-model="model.milepostCode" :data-source="selectDictOptions" placeholder="测试工程师"
                            @change="onSelectChange" />
                        </a-form-model-item>
                        <a-form-model-item label="职位描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="owner"
                          colon="false" style="margin-bottom:12px;">
                          <a-textarea></a-textarea>
                        </a-form-model-item>
                      </a-col>
                    </a-row>

                </template>

                <!-- 2.Basic info -->
                <template v-if="current === 1">
                  <!-- year -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '工作年限' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="工作年限" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>

                  <!-- address -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '工作地点' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="工作地点" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>

                  <!-- education -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '学历要求' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="学历要求" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>
                </template>

                <!-- 3.English skills -->
                <template v-if="current === 2">
                  <!-- certificate -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '英语证书' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="英语证书" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <!-- speaking -->
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>
                  <!-- listening -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '英语听力' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="英语听力" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>
                </template>

                <!-- 4.Resume judgment -->
                <template v-if="current === 3">
                  <!-- gap -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '空窗期判断' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="空窗期" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="是" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>

                  <!-- efficiency -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '工作效率判断' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="工作效率" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>

                  <!-- true & false -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '假简历判断' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="假简历" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="是" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>
                </template>

                <!-- 5.Professional skill -->
                <template v-if="current === 4">
                  <!-- keywords -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '专业技能' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="关键词" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="测试工程师" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>

                  <!-- keywords -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? '关键词' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="自动化测试" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>
                </template>

                <!-- 6.Plus section -->
                <template v-if="current === 5">
                  <!-- keywords -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? 'PLUS部分' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="关键词" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="测试工程师" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>

                  <!-- keywords -->
                  <template>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        :label="index === 0 ? 'Plus' : ''"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="自动化测试" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" colon="false"
                              style="width:45%;margin-bottom:0;">
                              <a-select v-model="domain.costRoleId" placeholder="1-3年" :allowClear="true">
                                <a-select-option v-for="(item, key) in laborRoleList" :key="key" :value="item.id">
                                  {{ item.roleName }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                            <a-form-model-item label="分数" :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
                              colon="false" style="width:30%;margin-right:22px;">
                              <a-input-number :min="0" v-model.lazy="domain.estimatedHours" style="width:100%;" />
                            </a-form-model-item>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="padding: 0 20px;">
                      <a-form-model-item v-for="(domain, index) in model.milepostLaborList" :key="domain.key"
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel" colon="false"
                        style="margin-bottom:0;width:100%;" :labelCol="{ span: 24 }">
                        <div style="background: #ebebed;">
                          <div style="display:flex;justify-content: space-between;width: 100%;">
                            <a-form-model-item label="评分依据" colon="false">
                            </a-form-model-item>
                            <a-textarea style="margin-right: 20px;"></a-textarea>
                          </div>
                        </div>
                      </a-form-model-item>
                    </a-col>
                  </template>
                </template>
                </a-row>
              </a-form-model>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
    <template slot="footer">
      <div class="footer-btn">
        <a-popconfirm @confirm="() => handleCancel()">
          <template v-if="tips == 'add'" slot="title">
            <div>
              <p>确定取消吗?</p>
              <p>现在取消将清空本次创建的所有里程碑！</p>
            </div>
          </template>
          <template v-else slot="title">
            <div>
              <p>确定取消吗?</p>
              <p>现在取消本次修改的里程碑将失效！</p>
            </div>
          </template>
          <a-button key="back"> 取消 </a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" @click="handleOk"> 提交 </a-button>
      </div>
    </template>
  </j-modal>
</template>
<script>
import moment from 'moment'
import { postAction, getAction } from '@/api/manage'
import AnnounCementModal from './AnnounCementModal.vue'
export default {
  components: { AnnounCementModal },
  name: 'MilepostModal',
  data() {
    return {
      title: '',
      width: 760,
      visible: false,
      disableSubmit: false,
      confirmLoading: false,
      tips: 'add',
      detailData: {},
      groubRoleList: [
        // {name:'shejishi',children:[{name:'111'}]},
        // {name:'gcs',children:[{name:'222'}]}
      ],
      leaderList: [],//负责人列表
      laborRoleList: [],//角色列表
      current: 0, //步骤条
      stepsInit: [
        {
          title: '职位信息',
          disabled: false,
          saveFlag: false, //判断是否已保存
          status: 'process',
        },
        {
          title: '基础信息',
          disabled: false,
          saveFlag: false, //判断是否已保存
          status: 'process',
        },
        {
          title: '英语能力',
          disabled: false,
          saveFlag: false, //判断是否已保存
          status: 'process',
        },
        {
          title: '简历判断',
          disabled: false,
          saveFlag: false, //判断是否已保存
          status: 'process',
        },
        {
          title: '专业技能',
          disabled: false,
          saveFlag: false, //判断是否已保存
          status: 'process',
        },
        {
          title: 'PLUS部分',
          disabled: false,
          saveFlag: false, //判断是否已保存
          status: 'process',
        },
      ],
      stepsAll: [{}],
      delSteps: [], //编辑后删除的数据
      selectDictOptions: [
        { text: '需求调研', value: '需求调研' },
        { text: '原型设计', value: '原型设计' },
        { text: 'UI设计', value: 'UI设计' },
        { text: '软件技术架构设计', value: '软件技术架构设计' },
        { text: '数据库设计', value: '数据库设计' },
        { text: '开发阶段', value: '开发阶段' },
        { text: '测试阶段', value: '测试阶段' },
        { text: '服务器搭建&试运行', value: '服务器搭建&试运行' },
        { text: '验收阶段', value: '验收阶段' },
        { text: '正式上线', value: '正式上线' },
      ],
      // 表单
      model: {
        id: null,
        milepostCode: null,//里程碑
        owner: undefined,//负责人
        period: [],//周期
        beginTime: null,//开始时间
        endTime: null,//结束时间
        milepostLaborList: [
          {
            costRoleId: undefined,//角色
            estimatedHours: '',//工时
          }
        ],//预估人力成本
        estimatedProcurementCost: 0,//预估采购成本
        estimatedTravelCost: 0,//预估差旅费用
        estimatedSubcontractingCost: 0,//预估分包费用
        estimatedOtherCost: 0,//预估其他费用
      },
      validatorRules: {
        milepostCode: [{ required: true, message: '请选择里程碑!' }],
        owner: [{ required: true, message: '请选择负责人!' }],
        beginTime: [{ required: true, message: '请选择周期' }],
        estimatedProcurementCost: [{ required: true, message: '请输入预估采购成本!' }],
        estimatedTravelCost: [{ required: true, message: '请输入预估差旅费用!' }],
        estimatedSubcontractingCost: [{ required: true, message: '请输入预估分包费用!' }],
        estimatedOtherCost: [{ required: true, message: '请输入预估其他费用!' }],
      },
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,
      },
      formItemLayout: {
        labelCol: {
          span: 24,
        },
        wrapperCol: {
          span: 24,
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          span: 24, offset: 0
        },
      },
      url: {
        add: '/bus/busProjectMilepost/add',
        getById: '/bus/busProjectMilepost/queryByProjectId',
        groubRoleUrl: '/sys/user/queyUserGroubByRoleList',
        leaderUrl: '/bus/busProjectUser/queryUserInfoByProjectId',
        getDeleteStatus: '/bus/busProjectMilepost/getDeleteStatus',
        milepostRoleList: '/bus/busProjectMilepost/milepostRoleList'
      },
    }
  },
  computed: {
    bgColor() {
      return (name) => {
        if (!name) return 'rgb(119, 153, 153)'
        var str = ''
        for (var i = 0; i < name.length; i++) {
          str += parseInt(name[i].charCodeAt(0), 10).toString(16)
        }
        return '#' + str.slice(0, 2) + str.slice(1, 2)
      }
    },
  },
  methods: {
    edit(record, resultDatas) {
      this.getGroubRole(record.id)
      this.getLeaderRole(record.id)
      this.getRoleList()
      this.visible = true
      this.tips = 'add'
      this.detailData = record
      let newResultData = []
      if (resultDatas && resultDatas.length != 0) {
        //如果编辑 获取赋值
        for (let i = 0; i < resultDatas.length; i++) {
          // if (resultDatas[i].beginTime) {
          //   resultDatas[i].period = [moment(resultDatas[i].beginTime), moment(resultDatas[i].endTime)]
          // }
          // resultDatas[i].staff = resultDatas[i].staff ? resultDatas[i].staff.split(',') : []
          newResultData.push({
            title: resultDatas[i].milepostCode,
            disabled: false,
            saveFlag: true,
            status: 'finish',
          })
        }
        this.stepsInit = newResultData
        this.stepsAll = resultDatas
        this.current = this.stepsInit.length - 1
        this.stepsInit[this.current].status = 'process'
        //表单赋值
        this.model.milepostCode = this.stepsAll[this.current].milepostCode
        this.model.owner = this.stepsAll[this.current].owner
        this.model.period = this.stepsAll[this.current].period
        this.model.beginTime = this.stepsAll[this.current].beginTime
        this.model.endTime = this.stepsAll[this.current].endTime
        this.model.milepostLaborList = (this.stepsAll[this.current].milepostLaborList && this.stepsAll[this.current].milepostLaborList.length > 0) ? this.stepsAll[this.current].milepostLaborList : [{ costRoleId: undefined, estimatedHours: '' }]
        this.model.estimatedProcurementCost = this.stepsAll[this.current].estimatedProcurementCost
        this.model.estimatedTravelCost = this.stepsAll[this.current].estimatedTravelCost
        this.model.estimatedSubcontractingCost = this.stepsAll[this.current].estimatedSubcontractingCost
        this.model.estimatedOtherCost = this.stepsAll[this.current].estimatedOtherCost
        this.model.id = this.stepsAll[this.current].id
        this.tips = 'edit'
        // console.log('编辑', this.current, this.stepsInit, this.stepsAll)
      }
    },
    //获取负责人列表
    getLeaderRole(proId) {
      getAction(this.url.leaderUrl, { projectId: proId }).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.leaderList: ', res)
          this.leaderList = res.result
        } else {
          this.leaderList = []
        }
      })
    },
    //获取分配员工列表
    getGroubRole(id) {
      getAction(this.url.groubRoleUrl, { id: id }).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.tenantsOptions: ', res)
          this.groubRoleList = res.result
        } else {
          this.groubRoleList = []
        }
      })
    },
    //获取角色列表
    getRoleList() {
      postAction(this.url.milepostRoleList).then((res) => {
        if (res.success && res.result.length != 0) {
          // console.log('this.laborRoleList: ', res)
          this.laborRoleList = res.result
        } else {
          this.laborRoleList = []
        }
      })
    },
    // 选择里程碑
    onSelectChange(value) {
      this.model.milepostCode = value
      //   console.log('onChange', this.model.milepostCode)
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
      this.model.staff = value
    },
    // 选择负责人
    changeLeader(value) {
      // console.log(`selected ${value}`)
      this.model.owner = value
    },
    // 表单日期选择
    onChangeDate(date, dateString) {
      // console.log(date, dateString, this.model.period);
      if (this.model.period) {
        this.model.beginTime = dateString[0]
        this.model.endTime = dateString[1]
      }
    },
    // 移除一条预估人力成本
    removeDomain(item) {
      let index = this.model.milepostLaborList.indexOf(item);
      if (index !== -1) {
        this.model.milepostLaborList.splice(index, 1);
      }
      // console.log('del', this.model.milepostLaborList)
    },
    // 新增一条预估人力成本
    addDomain() {
      // console.log('add', this.model.milepostLaborList)
      this.model.milepostLaborList.push({
        costRoleId: undefined,//角色
        estimatedHours: '',//工时
      });
    },
    // 校验里程碑名称是否已存在
    // 保存步骤
    saveStep() {
      this.$refs.stepform.validate((valid) => {
        // debugger
        if (valid) {
          //获取当前在操作的model
          let newModel = Object.assign({}, this.model)
          //校验里程碑名称是否已存在
          let checkList = [...this.stepsInit]
          checkList.splice(this.current, 1)
          // console.log('checkList', checkList)
          let isExsit = checkList.find((ele) => ele.title === newModel.milepostCode)
          if (!isExsit) {
            this.stepsInit[this.current].status = 'finish'
            this.stepsInit[this.current].saveFlag = true //表示此条数据已保存
            this.stepsInit[this.current].title = newModel.milepostCode
            //表单赋值
            this.stepsAll[this.current].milepostCode = newModel.milepostCode
            this.stepsAll[this.current].owner = newModel.owner
            this.stepsAll[this.current].period = newModel.period
            this.stepsAll[this.current].beginTime = newModel.beginTime
            this.stepsAll[this.current].endTime = newModel.endTime
            this.stepsAll[this.current].milepostLaborList = newModel.milepostLaborList
            this.stepsAll[this.current].estimatedProcurementCost = newModel.estimatedProcurementCost
            this.stepsAll[this.current].estimatedTravelCost = newModel.estimatedTravelCost
            this.stepsAll[this.current].estimatedSubcontractingCost = newModel.estimatedSubcontractingCost
            this.stepsAll[this.current].estimatedOtherCost = newModel.estimatedOtherCost
            // 赋值项目id
            this.stepsAll[this.current].projectId = this.detailData.id
            //"ifMilePostStatus":2//状态1新增2删除3修改
            this.stepsAll[this.current].ifMilePostStatus = newModel.id ? 3 : 1
            // console.log('newModel', this.current, newModel, this.stepsAll)
            this.$message.success(`${newModel.milepostCode}内容保存成功`)
          } else {
            this.$message.warning('里程碑名字重复，请重新命名')
          }
        } else {
          this.$message.warning('请填写里程碑信息')
        }
      })
    },
    // 增加步骤
    addStep() {
      this.stepsInit.forEach((item) => {
        if (item.saveFlag) {
          item.status = 'finish'
        }
      })
      let oldModel = Object.assign({}, this.model)
      this.stepsAll[this.current] = { ...this.stepsAll[this.current], ...oldModel }
      this.stepsInit.push({
        title: '暂未命名',
        disabled: false,
        saveFlag: false,
        status: 'process',
      })
      this.current = this.stepsInit.length - 1
      this.stepsAll.push({
        id: null,
        milepostCode: null,
        owner: undefined,
        period: [],
        beginTime: null,
        endTime: null,
        milepostLaborList: [
          {
            costRoleId: undefined,//角色
            estimatedHours: '',//工时
          }
        ],//预估人力成本
        estimatedProcurementCost: 0,//预估采购成本
        estimatedTravelCost: 0,//预估差旅费用
        estimatedSubcontractingCost: 0,//预估分包费用
        estimatedOtherCost: 0,//预估其他费用
      })
      //  清空表单
      this.model.id = null
      this.model.milepostCode = null
      this.model.owner = undefined
      this.model.period = []
      this.model.beginTime = null
      this.model.endTime = null
      this.model.milepostLaborList = [//预估人力成本
        {
          costRoleId: undefined,//角色
          estimatedHours: '',//工时
        }
      ]
      this.model.estimatedProcurementCost = 0
      this.model.estimatedTravelCost = 0
      this.model.estimatedSubcontractingCost = 0
      this.model.estimatedOtherCost = 0
      // console.log('添加', this.stepsAll)
    },
    //删除步骤
    delStep() {
      //获取当前在操作的model
      let newModel2 = Object.assign({}, this.model)
      if (newModel2.id) {
        //判断是否编辑的删除
        //判断已有里程碑是否可删除
        getAction(this.url.getDeleteStatus, { id: newModel2.id }).then((res) => {
          if (res.success && res.result == 1) {//可以删除
            this.stepsInit.splice(this.current, 1)
            this.stepsAll[this.current].ifMilePostStatus = 2
            //保存编辑操作的删除元素
            this.delSteps.push(this.stepsAll[this.current])
            // 清空对应删除的数据
            this.stepsAll.splice(this.current, 1)
            this.current = this.stepsInit.length - 1
            this.model = this.stepsAll[this.current]
            // console.log('清空对应删除的数据', this.stepsAll, this.delSteps)
          } else {
            this.$message.warning('该里程碑已使用，不可删除')
          }
        })
      } else {
        //新增删除
        this.stepsInit.splice(this.current, 1)
        this.stepsAll.splice(this.current, 1)
        this.current = this.stepsInit.length - 1
        this.model = this.stepsAll[this.current]
      }
    },
    //表单清空
    resetForm() {
      // 判断是否编辑状态数据
      if (this.stepsAll[this.current].id) {
        this.stepsAll[this.current].milepostCode = null
        this.stepsAll[this.current].owner = undefined
        this.stepsAll[this.current].period = []
        this.stepsAll[this.current].beginTime = null
        this.stepsAll[this.current].endTime = null
        this.stepsAll[this.current].milepostLaborList = [
          {
            costRoleId: undefined,//角色
            estimatedHours: '',//工时
          }
        ]
        this.stepsAll[this.current].estimatedProcurementCost = 0
        this.stepsAll[this.current].estimatedTravelCost = 0
        this.stepsAll[this.current].estimatedSubcontractingCost = 0
        this.stepsAll[this.current].estimatedOtherCost = 0
        // 清空对应表单保留id
        this.model.id = this.stepsAll[this.current].id
        this.model.milepostCode = null
        this.model.owner = undefined
        this.model.period = []
        this.model.beginTime = null
        this.model.endTime = null
        this.model.milepostLaborList = [
          {
            costRoleId: undefined,//角色
            estimatedHours: '',//工时
          }
        ]
        this.model.estimatedProcurementCost = 0
        this.model.estimatedTravelCost = 0
        this.model.estimatedSubcontractingCost = 0
        this.model.estimatedOtherCost = 0

      } else {
        this.stepsAll[this.current] = {
          id: null,
          milepostCode: null,
          owner: undefined,
          period: [],
          beginTime: null,
          endTime: null,
          milepostLaborList: [
            {
              costRoleId: undefined,//角色
              estimatedHours: '',//工时
            }
          ],
          estimatedProcurementCost: 0,
          estimatedTravelCost: 0,
          estimatedSubcontractingCost: 0,
          estimatedOtherCost: 0
        }
        // 清空对应表单清空id
        this.model.id = null
        this.model.milepostCode = null
        this.model.owner = undefined
        this.model.period = []
        this.model.beginTime = null
        this.model.endTime = null
        this.model.milepostLaborList = [
          {
            costRoleId: undefined,//角色
            estimatedHours: '',//工时
          }
        ]
        this.model.estimatedProcurementCost = 0
        this.model.estimatedTravelCost = 0
        this.model.estimatedSubcontractingCost = 0
        this.model.estimatedOtherCost = 0

      }
      //左侧重置
      this.stepsInit[this.current].title = '暂未命名'
      this.stepsInit[this.current].status = 'process'
      this.stepsInit[this.current].saveFlag = false
    },
    // 步骤条切换
    onChange(current) {
      this.stepsInit.forEach((item) => {
        if (item.saveFlag) {
          item.status = 'finish'
        }
      })
      this.current = current
      this.stepsInit[this.current].status = 'process'
      // this.model = this.stepsAll[this.current]
      console.log('this.stepsAll---', this.stepsAll,'this.current', this.current)
      this.model.id = this.stepsAll[this.current].id
      this.model.milepostCode = this.stepsAll[this.current].milepostCode
      this.model.owner = this.stepsAll[this.current].owner
      this.model.period = this.stepsAll[this.current].period
      this.model.beginTime = this.stepsAll[this.current].beginTime
      this.model.endTime = this.stepsAll[this.current].endTime
      this.model.milepostLaborList = (this.stepsAll[this.current].milepostLaborList && this.stepsAll[this.current].milepostLaborList.length > 0) ? this.stepsAll[this.current].milepostLaborList : [{ costRoleId: undefined, estimatedHours: '' }]
      this.model.estimatedProcurementCost = this.stepsAll[this.current].estimatedProcurementCost
      this.model.estimatedTravelCost = this.stepsAll[this.current].estimatedTravelCost
      this.model.estimatedSubcontractingCost = this.stepsAll[this.current].estimatedSubcontractingCost
      this.model.estimatedOtherCost = this.stepsAll[this.current].estimatedOtherCost
      // console.log('步骤条切换', current, this.stepsInit, this.stepsAll)
    },
    switchArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    // 上移
    prev() {
      if (this.current == 0) this.current = this.stepsInit - 1;
      // this.stepsInit = this.switchArray(this.stepsInit, this.current - 1, this.current)
      // this.stepsAll = this.switchArray(this.stepsAll, this.current - 1, this.current)
      this.onChange(this.current - 1)
      // console.log('上移', this.current, this.stepsInit, this.stepsAll)
    },
    // 下移
    next() {
      if (this.current == this.stepsInit - 1) this.current = 0;
      // this.stepsInit = this.switchArray(this.stepsInit, this.current, this.current + 1)
      // this.stepsAll = this.switchArray(this.stepsAll, this.current, this.current + 1)
      this.onChange(this.current + 1)
      // console.log('下移', this.current, this.stepsInit, this.stepsAll)
    },
    // 提交里程碑
    handleOk() {
      //判断每条数据是否已保存
      if (this.stepsInit.every((item) => item.saveFlag)) {
        //如果编辑有删除 组合数组
        if (this.delSteps.length != 0) {
          this.stepsAll = this.stepsAll.concat(this.delSteps)
        }
        // this.stepsAll.map((item) => {
        //   item.staff = item.staff != undefined && item.staff.length > 0 ? item.staff.join(',') : ''
        // })
        // console.log('this.delSteps', this.delSteps, this.stepsAll)
        postAction(this.url.add, { busProjectMilepostList: this.stepsAll }).then((res) => {
          if (res.success) {
            // console.log(999999, res)
            this.$message.success('提交成功')
            this.visible = false
            this.$emit("refreshMilstoneList")
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.warning('请填写并保存各阶段里程碑信息')
      }
    },
    // 取消里程碑
    handleCancel() {
      this.visible = false
      this.stepsInit = [
        {
          title: '暂未命名',
          disabled: false,
          saveFlag: false,
          status: 'process',
        },
      ]
      this.stepsAll = [
        {
          id: null,
          milepostCode: null,
          owner: undefined,
          period: [],
          beginTime: null,
          endTime: null,
          milepostLaborList: [
            {
              costRoleId: undefined,//角色
              estimatedHours: '',//工时
            }
          ],//预估人力成本
          estimatedProcurementCost: 0,//预估采购成本
          estimatedTravelCost: 0,//预估差旅费用
          estimatedSubcontractingCost: 0,//预估分包费用
          estimatedOtherCost: 0,//预估其他费用
        },
      ]
      this.model.id = null
      this.model.milepostCode = null
      this.model.owner = undefined
      this.model.period = []
      this.model.beginTime = null
      this.model.endTime = null
      this.model.milepostLaborList = [//预估人力成本
        {
          costRoleId: undefined,//角色
          estimatedHours: '',//工时
        }
      ]
      this.model.estimatedProcurementCost = 0
      this.model.estimatedTravelCost = 0
      this.model.estimatedSubcontractingCost = 0
      this.model.estimatedOtherCost = 0
      this.current = 0
    },
    //日期组件
    disabledStartDate(startValue) {
      const endValue = this.model.endTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.model.beginTime;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
  },
}
</script>
<style scoped lang="less">
.milestone-box {
  // padding-left: 17%;
  max-height: 650px;
}

.milestone-box /deep/ .ant-steps-vertical .ant-steps-item-icon {
  float: right;
}
.milestone-box /deep/ .ant-row {
  position: unset;
}

.milestone-box /deep/.ant-steps-vertical.ant-steps-small .ant-steps-item-container .ant-steps-item-tail {
  left: unset;
  right: 28px;
  padding: 24px 0 0;
}

.milestone-box /deep/ .ant-steps-vertical .ant-steps-item-content {
  text-align: right;
}

.footer-btn {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}

div:has(.footer-btn) {
  border-top: none;
}

.steps-own {
  height: 500px;
  background: #F7F9FA;
  border-radius: 0.5rem;
  padding: 20px 0px 20px 0px;
}

.milestone-box /deep/ .ant-steps-item-container {
  // width: 150px;
}

.milestone-box /deep/ .ant-steps-item-tail {
  display: none;
}

.steps-content /deep/ .ant-form-item-label {
  font-weight: bold;
  // line-height: 0px;
}

.no-line-height /deep/ .ant-form-item-label {
  line-height: 0px;
}

.steps-content {
  text-align: center;
  position: relative;
}

.steps-right-btn {
  padding-bottom: 10px;
  text-align: right;
  position: absolute;
  top: -10.5%;
  right: 10px;
}

.add-step-sty {
  position: relative;
  float: right;
  margin-right: 16px;
}

/* .add-step-sty>span { */
  /* position: absolute;
  display: inline-block;
  height: 13px;
  width: 1px;
  left: 11px;
  top: -18px;
  background: #D3DCE6; */
/* } */

.cust-select-sty {
  border-radius: 15px;
  background: #e8f4ff;
  display: flex;
  padding-right: 5px;
}
.addsty-cust{
  width:24px;
  height:24px;
  border-radius:50%;
  border:1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.cust-select-sty span:first-child {
  border-radius: 50%;
  width: 25px;
  text-align: center;
  margin-right: 5px;
  color: #fff;
  font-size: 12px;
}

.cust-select-sty span:last-child {
  color: #b2c7e0;
  font-size: 17px;
  width: 25px;
  text-align: center;
}

/deep/ .ant-select-selection__choice__content {
  &>.cust-select-sty span:last-child {
    display: none;
  }
}

/deep/ .has-error .ant-form-explain,
.has-error .ant-form-split {
  text-align: left;
}
/deep/ .ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-tail:after{
  background-color: #CD128A;
}

/deep/ .ant-modal-footer {
  border-top: 0px;
  padding: 10px 25px;
}

.milestone-modal /deep/ .ant-modal-header {
  border-bottom: none;
  padding: 24px 24px 4px 24px;
}
.milestone-modal /deep/ .ant-modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #3D3D3D;
}
</style>