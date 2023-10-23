<template>
  <a-drawer :title="title" :width="width" placement="right" @close="close" :visible="visible">

    <div>
      <!-- 待办列表 -->
      <a-row class="todo-list" v-for="(item, key) in todoArray" :key="key">
        <a-col :span="22">
          <a-button type="link" :id=item.id @click="handleUpdateStatus(item.id)" style="padding:0px;"><img
              src="~@/assets/unchecked.svg" width="20px" style="margin-bottom:5px;"></a-button>
          {{ item.title }}
        </a-col>
        <a-col :span="2">
          <a-dropdown>
            <a class="ant-dropdown-link dash" @click="e => e.preventDefault()">
              ...
            </a>
            <a-menu slot="overlay">
              <a-menu-item key="bindProject" @click="handleLoop(item.id,'bindProject')">
                添加项目
              </a-menu-item>
              <a-menu-item key="setDate"  @click="handleLoop(item.id,'setDate')">
                设定时间
              </a-menu-item>
              <a-menu-item key="delete"  @click="handleLoop(item.id,'delete')" style="color:#D92929">
                删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-col>
      </a-row>

      <!-- 添加事项 -->
      <a-row style="padding: 10px 0px;">
        <a-button type="link" style="font-weight: bold;color: #2f3133;" @click="handleAddList">
          + 添加事项
        </a-button>

        <a-form-model layout="inline" :model="formInline" :rules="validatorRules"  
          
          v-if="addListTag" ref="ruleForm" class="input-text">
          <a-form-model-item :wrapperCol="{ span: 24 }" prop="title">
            <a-input v-model="formInline.title" placeholder="请输入待做事项" @blur="submitTodoList()" @keyup.enter.native="submitTodoList">
            </a-input>
          </a-form-model-item>
        </a-form-model>

      </a-row>
      <!-- 已完成事项 -->
      <a-collapse destroyInactivePanel="true">
        <a-collapse-panel key="1" header="折叠已完成事项" :disabled="false">
          <a-row class="todo-list" v-for="(item, key) in doneArray" :key="key">
            <a-col :span="22">
              <img src="~@/assets/checked.svg" width="20px" style="margin-bottom:5px;">
              <span style="text-decoration:line-through;margin-left: 5px;">{{ item.title }}</span>
            </a-col>
            <a-col :span="2">
              <a-dropdown>
                <a class="ant-dropdown-link dash" @click="e => e.preventDefault()">
                  ...
                </a>
                <a-menu slot="overlay">
              <a-menu-item key="bindProject" @click="handleLoop(item.id,'bindProject')">
                添加项目
              </a-menu-item>
              <a-menu-item key="setDate"  @click="handleLoop(item.id,'setDate')">
                设定时间
              </a-menu-item>
              <a-menu-item key="delete"  @click="handleLoop(item.id,'delete')" style="color:#D92929">
                删除
              </a-menu-item>
            </a-menu>
              </a-dropdown>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <!-- <div class="drawer-footer">
      <a-button @click="handleCancel" style="margin-bottom: 0;">关闭</a-button>
    </div> -->
    <bindproject-Modal ref="bindProject"></bindproject-Modal>
  </a-drawer>
</template>

<script>

// import BusHolidayForm from './BusHolidayForm'
import { getAction, postAction, putAction, deleteAction } from '@/api/manage'
import bindprojectModal from './BindprojectModal.vue'

export default {
  name: 'BusTodoList',
  components: {
    bindprojectModal
  },
  data() {
    return {
      title: "待做清单",
      width: 800,
      visible: false,
      disableSubmit: false,
      addListTag: false,
      formInline: {
      },
      validatorRules: {
        title: { required: true, message: '请输入待做事项!' }
      },
      todoArray: [],
      doneArray: [],
      url: {
        todo: '/bus/busProjectTodolist/getTodolist',
        done: '/bus/busProjectTodolist/getCompletedTodolist',
        add: '/bus/busProjectTodolist/add',
        updateStatus: '/bus/busProjectTodolist/editComplete',
        delete: '/bus/busProjectTodolist/delete'
      },
    }
  },
  mounted() {
    this.loadTodoData()
    this.loadDoneData()
  },
  methods: {
    show() {
      this.visible = true
    },
    close() {
      this.$emit('close');
      this.visible = false;
    },
    handleCancel() {
      this.close()
    },
    handleAddList() {
      this.addListTag = !this.addListTag
    },
    submitTodoList() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            title: this.formInline.title
          }
          postAction(this.url.add, params).then(res => {

            if (res.success) {
              this.loadTodoData()
              this.formInline.title = ""
              this.$message.success("添加成功")

              this.addListTag = false
            } else {
              this.$message.error("添加失败")
            }
          })
        }
      })

    },
    loadTodoData() {
      getAction(this.url.todo).then((res) => {
        if (res.success && res.result) {
          this.todoArray = res.result
        } else {
          console.log('todo list: ' + JSON.stringify(res))
        }
      })
    },
    loadDoneData() {
      getAction(this.url.done).then((res) => {
        if (res.success && res.result) {
          this.doneArray = res.result
        } else {
          console.log('done list: ' + JSON.stringify(res))
        }
      })
    },
    handleUpdateStatus(iid) {
      putAction(this.url.updateStatus + '?id=' + iid).then((res) => {
        if (res.success) {
          this.loadDoneData()
          this.loadTodoData()
          this.$message.success('更新成功')
        } else {
          this.$message.warning('更新失败')
        }
      });
    },
    handleLoop(id, key) {
      console.log(key + id)
      if (key == 'bindProject') {
        this.$refs.bindProject.add({ todoId: id })
        this.$refs.bindProject.title = '添加到项目'
        this.$refs.bindProject.disableSubmit = false
      } else if (key == 'delete') this.deleteTodoList(id)
    },
    deleteTodoList(id) {
      var that = this;
      deleteAction(that.url.delete + '?id=' + id).then((res) => {
        if (res.success) {
          this.loadDoneData()
          this.loadTodoData()
          this.$message.success('删除成功')
        } else {
          this.$message.warning('删除失败')
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
// .ant-btn {
//   margin-left: 30px;
//   margin-bottom: 30px;
//   float: right;
// }

.drawer-footer {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

.todo-list {
  height: 40px;
  border-bottom: 1px solid #EDEFF0;
  padding: 10px 0;

  /deep/ .ant-col-2 {
    text-align: right;
  }

  .dash {
    font-weight: bold;
    font-size: 20px;
    line-height: 10px;
  }
}

.input-text {
  width: 100%;

  /deep/ .ant-form-item {
    width: 100%;
  }
}

/deep/ .ant-collapse {
  background-color: #fff;
  border: none;
}

/deep/ .ant-collapse-content {
  border-top: none;
}

/deep/ .ant-collapse>.ant-collapse-item>.ant-collapse-header .ant-collapse-arrow {
  left: 1px;
}

/deep/ .ant-collapse>.ant-collapse-item>.ant-collapse-header {
  padding-left: 20px;
}

/deep/ .ant-collapse-content>.ant-collapse-content-box {
  padding: 0px;
}

/deep/ .ant-collapse>.ant-collapse-item {
  border-bottom: none;
}
</style>