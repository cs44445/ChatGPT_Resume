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
    <template slot="custom" slot-scope="{ bgColor,dutiesName,cccName,title }" class="bgcss">
      <span :style="{backgroundColor:bgColor}" class="headPortrait">{{title.substring(0, 1)}}</span>
      <!-- <span class="postCss">{{post}}</span> -->
      <span class="postCss" >{{dutiesName}}</span>
      <span class="depCss" >{{cccName}}</span>
    </template>
  </a-tree>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
export default {
  name: "DeptUserTree",
  data() {
    return {
      currentDeptId: "",
      currentDept: [],
      treeData: [],
      selectedKeys: [],
      url: {
        // queryTreeLists: "/sys/user/queryTreeLists"
        queryTreeLists: "/sys/user/queryUserTreeLists"

      }
    };
  },
  mounted() {
    // this.getRootData();
  },
  methods: {
    open(record) {
      //console.log(record);
      this.currentDeptId = record.ccc;
      this.currentDept = record;
      this.getRootData(this.currentDeptId);
    },
    getRootData(id) {
      var that = this
      getAction(this.url.queryTreeLists, { ccc: id }).then(res => {
        if (res.success) {
          that.treeData = res.result
          if (res.result.length>0) that.getFirstName(res.result[0])
        }


  // that.treeData = [
  //         {
  //           "birthday": null,
  //           "relTenantIds": null,
  //           "ccc": null,
  //           "activitiSync": 1,
  //           "userIdentity": 1,
  //           "title": "万华",
  //           "delFlag": 0,
  //           "workNo": "P0000423",
  //           "leaderStatus": null,
  //           "password": "2d1d2cabae18a827edad5cd8b56ec5cc",
  //           "post": "P10",
  //           "scopedSlots": {
  //             "switcherIcon": "parent"
  //           },
  //           "slots": {
  //             "icon": "smile"
  //           },
  //           "updateBy": "1412614058177925122",
  //           "children": [

  //             {
  //               "birthday": null,
  //               "relTenantIds": null,
  //               "ccc": null,
  //               "activitiSync": 1,
  //               "userIdentity": 1,
  //               "title": "栗大勇",
  //               "delFlag": 0,
  //               "workNo": "P0003259",
  //               "leaderStatus": null,
  //               "password": "d04eb609f7c34227046763dd2f50578d",
  //               "post": "P10",
  //               "scopedSlots": {
  //                 "switcherIcon": "parent"
  //               },
  //               "slots": {
  //                 "icon": "smile"
  //               },
  //               "updateBy": "1412614058177925122",
  //               "children": [
  //                 {
  //                   "birthday": null,
  //                   "relTenantIds": null,
  //                   "ccc": null,
  //                   "activitiSync": 1,
  //                   "userIdentity": 1,
  //                   "title": "董爽",
  //                   "delFlag": 0,
  //                   "workNo": "P0148503",
  //                   "leaderStatus": null,
  //                   "password": "e1e252acdd2482a6746337e5d2d7d523",
  //                   "post": "P8",
  //                   "scopedSlots": {
  //                     "switcherIcon": "child"
  //                   },
  //                   "slots": {
  //                     "icon": "smile"
  //                   },
  //                   "updateBy": "1412614058177925122",
  //                   "children": null,
  //                   "orgCode": "A01A01A02A01",
  //                   "id": "1645253862336598017",
  //                   "key": "P0148503",
  //                   "email": "shuang.dong1@centific.com",
  //                   "departName": null,
  //                   "salt": "PgmibTGN",
  //                   "clientId": null,
  //                   "sex": 2,
  //                   "telephone": null,
  //                   "updateTime": 1693808124000,
  //                   "departIds": null,
  //                   "avatar": null,
  //                   "leaf": true,
  //                   "parentId": null,
  //                   "realname": "董爽",
  //                   "manage": "P0003259",
  //                   "createBy": "1412614058177925122",
  //                   "value": null,
  //                   "phone": "18910757753",
  //                   "createTime": 1681094063000,
  //                   "orgCodeTxt": null,
  //                   "depId": null,
  //                   "userType": null,
  //                   "cccName": null,
  //                   "username": "P0148503",
  //                   "status": 1
  //                 }
  //               ],
  //               "orgCode": "A01A01A02",
  //               "id": "1620312567356403714",
  //               "key": "P0000423",
  //               "email": "li_dayong@centific.com",
  //               "departName": null,
  //               "salt": "pYicEuPg",
  //               "clientId": null,
  //               "sex": 1,
  //               "telephone": null,
  //               "updateTime": 1693809556000,
  //               "departIds": null,
  //               "avatar": null,
  //               "leaf": false,
  //               "parentId": null,
  //               "realname": "栗大勇",
  //               "manage": "P0000423",
  //               "createBy": "1412614058177925122",
  //               "value": null,
  //               "phone": "13811436710",
  //               "createTime": 1675147595000,
  //               "orgCodeTxt": null,
  //               "depId": null,
  //               "userType": null,
  //               "cccName": null,
  //               "username": "P0003259",
  //               "status": 1
  //             }
  //           ],
  //           "orgCode": "A01A01",
  //           "id": "1620312567243157505",
  //           "key": "P0000423",
  //           "email": "wan_hua@centific.com",
  //           "departName": null,
  //           "salt": "Jp7ckcmY",
  //           "clientId": null,
  //           "sex": 1,
  //           "telephone": null,
  //           "updateTime": "2023-09-01 16:04:33",
  //           "departIds": null,
  //           "avatar": null,
  //           "leaf": false,
  //           "parentId": null,
  //           "realname": "万华",
  //           "manage": null,
  //           "createBy": "1412614058177925122",
  //           "value": null,
  //           "phone": "13811924324",
  //           "createTime": "2023-01-31 14:46:35",
  //           "orgCodeTxt": null,
  //           "depId": null,
  //           "userType": null,
  //           "cccName": null,
  //           "username": "P0000423",
  //           "status": 1
  //         },
  //         {
  //           "birthday": null,
  //           "relTenantIds": null,
  //           "ccc": null,
  //           "activitiSync": 1,
  //           "userIdentity": 1,
  //           "title": "张梦琪",
  //           "delFlag": 0,
  //           "workNo": "P0198832",
  //           "leaderStatus": null,
  //           "password": "c1283d38463d5cb41be2ab3a4e100f54",
  //           "post": "I1",
  //           "scopedSlots": {
  //             "switcherIcon": "child"
  //           },
  //           "slots": {
  //             "icon": "smile"
  //           },
  //           "updateBy": "1412614058177925122",
  //           "children": null,
  //           "orgCode": "A01A01A01",
  //           "id": "1621072245350801409",
  //           "key": "P0198832",
  //           "email": "mengqi.zhang@centific.com",
  //           "departName": null,
  //           "salt": "9s18gzrg",
  //           "clientId": null,
  //           "sex": 2,
  //           "telephone": null,
  //           "updateTime": "2023-06-08 16:12:00",
  //           "departIds": null,
  //           "avatar": null,
  //           "leaf": true,
  //           "parentId": null,
  //           "realname": "张梦琪",
  //           "manage": null,
  //           "createBy": "1412614058177925122",
  //           "value": null,
  //           "phone": "18246843418",
  //           "createTime": "2023-02-02 17:05:16",
  //           "orgCodeTxt": null,
  //           "depId": null,
  //           "userType": null,
  //           "cccName": null,
  //           "username": "P0198832",
  //           "status": 3
  //         }

  //       ]
        // that.getFirstName(that.treeData)

      })
    },
    onSelect(selectedKeys, e) {
      console.log('selected', selectedKeys, e, [e.node.dataRef.key]);
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
    tranColor(name) {
      var str = '';
      for (var i = 0; i < name.length; i++) {
        str += parseInt(name[i].charCodeAt(0), 10).toString(16);
      }
      return '#' + str.slice(0, 2) + str.slice(1, 2);
    }
  },
}
</script>
<style scoped>
.headPortrait {
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

.postCss {
  position: absolute;
  left: 100px;
  top: 31px;
    color: #727171;
    font-size: 13px;
}

.depCss {
  position: absolute;
    left: 100px;
    top: 48px;
    font-size: 16px;
    color: #727171;
}
</style>
<style>
.treeCss li .ant-tree-node-content-wrapper {
  width: 380px;
  height: 80px;
  border: solid #ddd 1px;
  position: relative;
  border-radius: 4px;
}

.treeCss .ant-tree-title {
  position: absolute;
  left: 100px;
  top: 11px;
  font-weight: bold;
  font-size: 16px;
}

.treeCss li .ant-tree-treenode-switcher-close,
.treeCss li .ant-tree-treenode-switcher-open {
  left: 50px;

}

.treeCss .ant-tree-node-content-wrapper-normal {}
</style>