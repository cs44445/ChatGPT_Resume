<template>
    <div>
        <a-popover trigger="click"
         placement="rightTop" :visible="clicked"
         overlayClassName="poperLayTable"  @visibleChange="handleClickChange"
        :getPopupContainer=" triggerNode => { 
 		  return triggerNode.parentNode
 	    }">
            <template slot="content">
            <a-input ref="userNameInput"  placeholder="" v-model="keyword" style="padding: 0 16px;" @change="handleSearch">
                <a-icon slot="prefix" type="search"  style="margin-left: 10px;"/>
            </a-input>
            <div  v-for="item in groubRoleList" :key="item.id">
                <div style="display: flex;align-items: center;width: 350px;justify-content: space-between;padding: 0 16px;" 
                class="addPeoCss" tabIndex="1" @click="handleItem(item)">
                    <div style="display: flex;align-items: center;">
                        <div style="" class="peopleCss">
                            {{ item.realname.slice(0,1) }}
                        </div>
                        <div >
                            <span style="font-size: 14px;" class="nameHover"  tabIndex="1">{{ item.realname }}</span>
                            <span style="color: #8D9399;margin-left:5px;">{{ '('+item.email +')' }}</span>
                        </div>
                    </div>                   
                    <div style="">
                        <a-icon type="check" :style="{color:'#CD128A'}" v-if="currentItem == item.id"/>
                    </div>
                    
                </div>
            </div>
            </template>
            <slot name="addAppoint"/>
            
        </a-popover>
    </div>
</template>
<script>
import { httpAction, getAction } from '@/api/manage'
export default {
    props: ['projectId','record'],
    data(){
        return{
            url:{
                groubRoleUrl: '/bus/busProjectTaskDetail/myAppointList',// 分配员工
                edit: "/bus/busProjectTaskDetail/edit",
            },
            groubRoleList: [],
            currentItem:'',
            keyword:'',
            clicked: false,
        }
    },
    methods:{
        handleClickChange(visible) {
            this.clicked = visible;
        },
        handleItem(item){
            console.log(item,'item')
           this.currentItem = item.id
           this.$emit('submitForm',item.id)
           setTimeout(()=>{
            this.clicked = false;
           },500)
           
        },
        handleSearch(){
            this.handleAssignOptions()
        },
            // 分配员工
        handleAssignOptions() {
            getAction(this.url.groubRoleUrl, { projectId: this.projectId,keyword:this.keyword }).then(res => {
                if (res.success && res.result.length != 0) {
                this.groubRoleList = res.result
                } else {
                this.groubRoleList = []
                // this.$message.warning(res.message)
                }
            })
        }
    }
}
</script>
<style scoped>
::v-deep .ant-popover-inner-content{
    padding: 12px 0px !important;
    height: 400px;
    overflow: auto;
}
.peopleCss{
  width: 24px;
  height: 24px;
  border: 1px solid #D3DCE5;
  border-radius: 50%;
  text-align: center; 
  margin: 8px 20px 8px 0;font-size: 12px;
  line-height: 24px;
}
.addPeoCss:hover,.addPeoCss:active{
  background: #F4F5F6;
  cursor: pointer;
  
}
.addPeoCss:hover .nameHover,.addPeoCss:active .nameHover{
  color: #CD128A;
}
</style>