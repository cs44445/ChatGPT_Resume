<template>
  <a-drawer :title="title" :width="width" placement="right" @close="close" :visible="visible">
    <div style="text-align:right"><a-button @click="handleAdd()" type="primary" v-has="'notice:submit'">发布公告</a-button></div>
    <div>
      <div class="listcss" v-for="item in records" :key="item.id">
        <div class="top">
          <div>{{item.createTime}}</div>
          <a-popconfirm @confirm="deleteDate(item.id)" title="确认要删除吗？" ok-text="Yes" cancel-text="No">
            <div class="delete" v-has="'notice:submit'">删除</div>
          </a-popconfirm>
        </div>
        <div v-html="item.noticeContent"></div>
      </div>
    </div>
    <bus-publish-modal ref="modalForm" @ok="noticeModalFormOk" :projectId="projectId"></bus-publish-modal>
  </a-drawer>
</template>

<script>
import { getAction, deleteAction } from '@/api/manage'
import BusPublishModal from './BusPublishModal'
import { nextTick } from 'vuedraggable'

export default {
  name: 'AnnounCementList',
  components: {
    BusPublishModal
  },
  props:['projectId'],
  data() {
    return {
      title: "公告详情",
      width: 800,
      visible: false,
      url: {
        notice: '/bus/busProjectNotice/homeHistoryNotices',
        delete: '/bus/busProjectNotice/delete',
      },
      records:[],
      projectId:''
    }
  },
  mounted() {
    console.log('projectId',this.projectId)
    this.getDetailList()
  },
  watch: {
    projectId: function() {
      this.getDetailList()
    }
  },
  methods: {
    getDetailList(){
      let param = {
        projectId:this.projectId,
      }
      // console.log('this.projectId',this.projectId)
      getAction(this.url.notice,param).then(res=>{
        if(res.success && res.result){
          this.records = res.result.records
        }
      })
      // this.$forceUpdate();
    },
    noticeModalFormOk(){
      this.getDetailList()
      this.$emit('ok');
    },
    firstNotice(){
      getAction(this.url.homeNewNotice, {projectId:this.projectId}).then((res) => {
        console.log(res.result)
        if(res.result){
          this.pagenotice=res.result
        }else{
          this.pagenotice={}
        }
      })
    },
    deleteDate(id){
      deleteAction(this.url.delete, {id:id}).then((res) => {
        console.log(res.result)
        if(res.result){
          this.getDetailList()
          this.$emit('ok');
        }else{
          this.$message.warn('删除失败！')
        }
      })
    },
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
    handleAdd(){
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = '发布公告'
    }
  }
}
</script>

<style lang="less" scoped>
.listcss{
  border-bottom: 1px solid #eee;
  padding: 20px 15px;
  .top{
    display: flex;
    justify-content: space-between;
    margin-bottom:10px;
  }
  .delete{
    color: red;
    cursor: pointer;
  }
}
</style>