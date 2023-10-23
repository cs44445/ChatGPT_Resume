<template>
  <div>
    <div style="margin: 50px;">
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <div class="steps-content">
        <!-- -------------第一步------------- -->
        <div v-if="current==0">
          <div style="margin-bottom: 10px;text-align: left;">从模板创建项目</div>
          <a-tabs default-active-key="1" tab-position="left">
            <a-tab-pane key="1" tab="软件开发">
                <div style="display: flex;">
                    <div @click="handleClick(1)" :class="type == 1 ? 'itemCSS' : ''">
                        <img :src="require('@assets/xmwb.png')"/>
                        <div class="typeCss">
                          <span> 项目外包</span>
                        </div>
                    </div>
                    <div style="margin-left: 20px;" @click="handleClick(2)" :class="type == 2 ? 'itemCSS' : ''">
                      <img :src="require('@assets/rlwb.png')"/>
                      <div class="typeCss">
                          <span>人力外包</span>
                      </div>
                    </div>
                </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <!-- -------------第二步------------- -->
        <div v-if="current==1">
          <a-form-model layout="vertical" :model="form">
            <a-form-model-item label="项目名称">
              <a-input v-model="form.projectName" placeholder="请输入内容" />
            </a-form-model-item>
            <a-form-model-item label="描述（选填）">
              <a-input v-model="form.desc" placeholder="请输入项目描述" type="textarea" rows="3"/>
            </a-form-model-item>
          </a-form-model>
        </div>
        <!-- ------------第三步-------------------- -->
        <div  v-if="current==2">
          <a-form-model layout="vertical" :model="form3">
            <div style="display: flex;align-items: flex-end;">
              <a-form-model-item label="执行时间" prop="beginningTime">
                  <a-date-picker @change="onChangeBegin" v-model="form3.beginningTime"  placeholder="请选择开始日期" />
                  <span style="margin: 0 20px;">至</span>
              </a-form-model-item>
              <a-form-model-item label="" prop="endTime">
                  <a-date-picker @change="onChangeEnd" v-model="form3.endTime"  placeholder="请选择结束日期" />
              </a-form-model-item>
            </div>
            <a-form-model-item label="负责人">
              <a-select
                show-search
                placeholder="选择项目负责人管理项目"
                option-filter-prop="children"
                :filter-option="filterOption"
                @change="handleChange"
                v-model="form3.leader"
                allowClear
                :getPopupContainer="(target) => target.parentNode"
              >
                <a-select-option :value="item.value" v-for="item in leaderOptions" :key="item.id">
                  <div style="display: flex;align-items: center;">
                    <div class="selectoptionCss">{{ item.label.slice(0,1) }}</div>
                    <span>{{ item.label + ' '+item.email }}</span>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="标签(选填)">
                <div style="text-align: left;">
                  <span>
                    <a-tag :color="item.colorValue" closable v-for="(item,index) in labelTags" :key="item.itemText" @close="handleCloseTag(item,index)">
                      {{ item.itemText }}
                    </a-tag>
                  </span>
                  <a-popover title="" trigger="click"  placement="bottom"  :overlayStyle="{width:'400px'}"  v-clickoutside="handkeyCode">
                    <template slot="content">
                      <a-input  v-model="tags" placeholder="搜索" style="margin-bottom: 13px;" @change="handleSearchTag(e)">
                        <a-icon slot="prefix" type="search" />
                      </a-input>
                      <span style="font-weight: bold;color: #3D3D3D;margin-right: 5px;">常用</span>
                      <span style="color: #8D9399;font-size: 12px;">点击即可选择标签</span>
                      <div style="margin: 13px 0;">
                        <a-tag :color="item.colorValue" @click="handleAddTag(item)" v-for="item in freUsedTags" :key="item.itemText">
                          {{ item.itemText }}
                        </a-tag>
                        <a-input ref="userNameInput" v-model="tagName" placeholder="" style="width: 150px;margin: 8px 5px 0 0;" v-if="ifShow">
                          <div style="margin-right:6px;border-left:1px solid #2F3133;padding-left: 6px;" slot="suffix">
                              <div  :style="[{width: 12+'px'},{height: 12+'px'},{background: tagColor},{marginRight: 8+'px'}]"></div>
                          </div>
                          <a-popover  trigger="click"  slot="suffix"  :overlayStyle="{width:'13%'}">
                            <template slot="content">
                                <div style="display: flex;justify-content: space-between;">
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #D92929;" @click="handleTagColor('#D92929')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #F67F1E;" @click="handleTagColor('#F67F1E')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #F2B202;" @click="handleTagColor('#F2B202')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #98CA02;" @click="handleTagColor('#98CA02')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #08C35C;" @click="handleTagColor('#08C35C')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #0FC2B6;" @click="handleTagColor('#0FC2B6')"></div>
                                </div>
                                <div style="display: flex;justify-content: space-between;margin-top:10px ;">
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #04A4E3;" @click="handleTagColor('#04A4E3')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #1E8EF6;" @click="handleTagColor('#1E8EF6')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #136DEB;" @click="handleTagColor('#136DEB')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #752EF0;" @click="handleTagColor('#752EF0')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #A12AD3;" @click="handleTagColor('#A12AD3')"></div>
                                  <div style="width: 16px;height: 16px;border-radius: 2px;background: #CA12C7;" @click="handleTagColor('#CA12C7')"></div>
                                </div>
                            </template>
                            <a-icon type="down" />
                          </a-popover>

                        </a-input>
                        <a-button type="dashed" icon="plus" size="small" @click="handleAddNewTag" style="margin-top: 8px;">
                          添加标签
                        </a-button>
                      </div>
                    </template>
                    <img :src="require('@/assets/addtags.png')"/>
                  </a-popover>
                </div>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
    </div>
    <div class="steps-action">
      <a-button @click="handleCancel">
         取消
      </a-button>
      <div>
        <a-button v-if="current > 0"  @click="prev">
          上一步
        </a-button>
        <a-button  style="margin-right: 8px;margin-left: 8px;" @click="handleCreateProjectDirectly">
          直接创建项目
        </a-button>
        <a-button  type="primary" @click="next">
          下一步
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { postAction,getAction } from '@/api/manage'

const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
      // console.log( binding,'el, binding')
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};
export default {
  data() {
    return {
      current: 0,
      steps: [
        {
          title: '创建',
        },
        {
          title: '详情',
        },
        {
          title: '更多',
        },
      ],
      type:0,
      form:{},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form3:{},
      labelTags:[ //已经选择的

      ],
      freUsedTags:[
      ],
      url:{
        queryProjectOwnerList:'bus/busProject/queryProjectOwnerList',
        add:'bus/busProject/add',
        getProjectTag:'bus/busProject/getProjectTag',
        addProjectTag:'sys/dictItem/addProjectTag'
      },
      leaderOptions:[],
      tagName:'',
      tagColor:'',
      ifShow:false,
      tags:'',
      itemText:[],
      colorValue:[]
    };
  },
  directives: {clickoutside},
  mounted(){

  },
  methods: {
    handleSearchTag(){
      getAction(this.url.getProjectTag+'?keyword='+this.tags).then(res=>{
         if(res.success){
          this.freUsedTags = res.result
         }else{
           this.$message.warning(res.message)
         }
      })
    },
    // 回车和空格键提交右侧信息
    handkeyCode(e) {
      //  if(e.keyCode === 13 || e.keyCode === 32){
        if(this.tagName !='' && this.tagColor!=''){
          postAction('sys/dictItem/addProjectTag?colorValue='+encodeURIComponent(this.tagColor)+'&itemText='+this.tagName).then(res=>{
            if(res.success){
              this.handleSearchTag()
              this.tagName = ''
              this.tagColor = ''
            }else{
              this.$message.warning(res.message)
            }
          })
          this.ifShow = false
          console.log(this.freUsedTags)
        }

      //  }
    },
    handleAddNewTag(){
      this.tagName = ''
      this.tagColor = ''
      this.ifShow = true
    },
    handleTagColor(color){
      this.tagColor = color
    },
    handleQueryProjectOwnerList(){
      getAction(this.url.queryProjectOwnerList).then(res=>{
        if (res.success) {
              let result = res.result
              let dictOptions = []
              for (let i = 0; i < result.length; i++) {
                  let temp = result[i];
                  let item = {}
                  item.label = temp.realname
                  item.value = temp.id
                  item.email = temp.email
                  item.workNo = item.workNo
                  dictOptions.push(item);
              }
              this.leaderOptions = dictOptions
          } else {
              this.$message.warn(`获取失败：` + res.message)
          }
      })
    },
    handleTags(){
      let url = 'sys/dictItem/list?dictId=1660477174837874690&field=id,,itemText,itemValue,sortOrder,action&pageNo=1&pageSize=10'
      getAction(url).then(res=>{
        this.freUsedTags = res.result.records
      })
    },
    handleCreateProjectDirectly(){
      this.handleAdd()

    },
    handleAdd(){
      if(this.type<1){
        this.$message.warning('请选择软件开发类型')
        return
      }
      let a = []
      this.labelTags.forEach(v=>{
        a.push(v.itemText)
      })
      let b = []
      this.freUsedTags.forEach(v=>{
        b.push(v.itemText)
      })
      let params = {
        projectType: this.type,//1项目外包 2人员外包
        projectName: this.form.projectName,//项目名称
        projectDescribe:this.form.desc,//项目描述
        startTime:this.form3.beginningTime,//开始
        endTime:this.form3.endTime,//结束
        principal:this.form3.leader,//负责人
        projectLabel:b.join(','),//项目标签添加用的
        projectTag:a//标签列表展示用的
      }
      postAction(this.url.add,params).then(res=>{
         if(res.success){
            this.$message.success(res.message)
            this.$emit('close');
            this.$emit('loadProjectData');
            this.$router.push({ path: '/bus/projectDetails',query: { projectId: res.result.projectId  } })
         }else{
          this.$message.warning(res.message)
         }
      })
    },
    handleAddTag(item){
      let that = this 
      if(this.itemText.includes(item.itemText)&&this.colorValue.includes(item.colorValue)){
          that.$message.warning('该标签已经存在')
          return 
      }else{
        that.labelTags.push(item)
        this.labelTags.forEach((arr)=>{
          this.itemText.push(arr.itemText)
          this.colorValue.push(arr.colorValue)
        })
      }
    },
    handleCloseTag(item,index){
      this.labelTags.splice(index,1)
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    onChangeBegin(date, dateString){
      this.$set(this.form3,'beginningTime',dateString)
        if(this.form3.endTime&&this.form3.beginningTime>this.form3.endTime){
            this.$message.warning('开始时间应小于结束时间')
        }

    },
    onChangeEnd(date, dateString){
      this.$set(this.form3,'endTime',dateString)
      if(!this.form3.beginningTime){
        this.$message.warning('请选择开始时间')
      }
      if(this.form3.beginningTime>this.form3.endTime){
        this.$message.warning('开始时间应小于结束时间')
      }

    },
    next() {
      if(this.current==2){
        this.handleAdd()
      }
      if(this.current<2){
        this.current++;
      }

    },
    prev() {
      this.current--;
    },
    handleCancel () {
      this.$emit('close');
    },
    handleClick(type){
      this.type = type
      console.log(type,'e------type------------e')
    }
  },
};
</script>
<style scoped>
.steps-content {
  margin-top: 30px;
  border-radius: 6px;
  min-height: 200px;
  text-align: center;
  /* padding-top: 80px; */
}

.steps-action {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
}
.typeCss{
  width: 100%;
  height: 48px;
  background: #F1F5FA;
  border-radius: 0 0 8px 8px;
  text-align: left;
  line-height: 48px;
  padding-left: 10px;
  font-weight: bold;
}
.itemCSS{
  border: 2px solid #CC148A;
  border-radius: 8px;
}
.selectoptionCss{
  width: 24px;
  height: 24px;
  border: 1px solid #D3DCE5;
  border-radius: 50%;
  text-align: center;
  margin-right: 10px;
  line-height: 24px;
}
::v-deep .ant-input {
  background: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
::v-deep .ant-select-selection {
    background-color: #F7F9FA !important;
    border: 1px solid #EEF0F1;
    color: #8D9399 !important ;
}
</style>

