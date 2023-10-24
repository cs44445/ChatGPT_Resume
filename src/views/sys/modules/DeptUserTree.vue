<template>
  <a-tree 
    :tree-data="treeData" 
    showIcon
    showLine
    multiple
    default-expand-all 
    @select="onSelect"
    @check="onCheck"   
    :selectedKeys="selectedKeys"     
    class="treeCss">
    <img src="@/assets/dot2.png" slot="child" style="margin-right: 0px" width="10px" />
    <template slot="custom" slot-scope="{ departName,post,bgColor,title }" class="bgcss">
      <span :style="{backgroundColor:bgColor}" class="headPortrait">{{title.substring(0, 1)}}</span>
      <!-- <span class="postCss">{{post}}</span> -->
      <span class="depCss" >{{departName}}</span>
    </template>
  </a-tree>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
export default {
  name:"DeptUserTree",
  data() {
    return {
      currentDeptId: "",
      currentDept:[],
      treeData:[],
      selectedKeys: [],
      url:{
        queryTreeLists: "/sys/user/queryTreeLists"
      }
    };
  },
  mounted(){
    // this.getRootData();
  },
  methods: {
    open(record) {
      //console.log(record);
      this.currentDeptId = record.id;
      this.currentDept = record;
      this.getRootData(this.currentDeptId);
    },
    getRootData(id){
      getAction(this.url.queryTreeLists, {depId:id}).then(res => {
        console.log(res.result,'res.result-----------------res.result')
        this.treeData = res.result
        this.getFirstName(res.result[0])
      })
    },
    onSelect(selectedKeys,e) {
      console.log('selected', selectedKeys,e,[e.node.dataRef.key]);
      let record = e.node.dataRef
      this.selectedKeys = [record.key]
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
    },
    getFirstName(data) {
      let that = this
      data.title = data.realname
      data.post = data.post
      data.departName = data.departName
      data.scopedSlots.icon= 'custom' 
      let firstName = data.title.substring(0, 1); 
      data.bgColor = that.tranColor(firstName)
      if (data.children && data.children.length > 0) {
          for (let a = 0; a < data.children.length; a++) {
            that.getFirstName(data.children[a])
          }
      }
    },
    tranColor(name){
        var str ='';
        for(var i=0; i<name.length; i++) {
         str += parseInt(name[i].charCodeAt(0), 10).toString(16);
        }
        return '#' + str.slice(0, 2)+str.slice(1, 2);
    }
  },
}
</script>
<style scoped>
.headPortrait{
    position: absolute;
    left: 20px;
    top: 6px;
    width: 65px;
    height: 65px;
    font-size: 30px;
    color: #fff;
    line-height: 60px;
    border-radius: 50%;
    border: solid #ddd 1px; 
}
.postCss{
    position: absolute;
    left: 100px;
    top: 29px;
    font-size: 14px;
}
.depCss{
    position: absolute;
    left: 100px;
    top: 44px;
    font-size: 16px;
}
</style>
<style>
.treeCss li .ant-tree-node-content-wrapper{
    width: 350px;
    height: 80px;
    border: solid #ddd 1px; 
    position: relative;
    border-radius: 4px;
}
.treeCss .ant-tree-title{
    position: absolute;
    left: 100px;
    top: 11px;
    font-weight: bold;
    font-size: 16px;
}
.treeCss li .ant-tree-treenode-switcher-close,.treeCss li .ant-tree-treenode-switcher-open{
  left:50px;

}
.treeCss .ant-tree-node-content-wrapper-normal{
  
}
</style>