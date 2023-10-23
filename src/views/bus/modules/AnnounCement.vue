<template>
  <div>
    <div class="backgd">
      <div class="icon"><a-icon type="sound" theme="filled" /></div>
      <div class="title">公告</div>
      <div class="time">{{datatime}}</div>
      <div ref="wrap" class="content"><div ref="content" v-text="message"></div></div>
      <div class="nextbtn">
        <a type="primary" @click="getMore()">查看更多</a>
        <a-icon v-if="upperStatus=='1'" @click="nextData(1)" type="up-circle" />
        <a-icon v-if="belowStatus=='1'" @click="nextData(2)" type="down-circle" />
      </div>
    </div>
    <announ-cement-list ref="announ" @ok="getlist" :projectId='projectId'></announ-cement-list>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import AnnounCementList from './AnnounCementList'
  export default {
    name: 'AnnounCement',
    props:['projectId'],
    components: {
      AnnounCementList
    },
    data () {
      return {
        message:'',
        timer:null ,//在data上定义定时器timer，默认为null
        url:'/bus/busProjectNotice/homeNewNotice',
        datatime:'',
        upperStatus:'',//是否有上一条（0代表没有  1代表有）
        belowStatus:'',//是否有下一条 （0代表没有  1代表有）
        id:'',
        wrapWidth: 0,
        contentWidth: 0,
      }
    },
    mounted(){
      // setInterval(() => {
      //   this.start();
      // },5000)
      this.start();
      this.getannouncement()
    },
    watch: {
      projectId: function() {
        this.getannouncement()
      }
    },
    methods: {
      start() {
        const { wrap, content } = this.$refs;
        this.wrapWidth = wrap.getBoundingClientRect().width;
        this.contentWidth = content.getBoundingClientRect().width;
        this.animateFn();
      },
      // show(){
      //   if(this.timer != null) return;
      //   if(this.message.length>140){
      //     this.timer = setInterval(() => {
      //         //获取到头的第一个字符
      //         let start = this.message.substring(0,1);
      //         //获取到后面的所有字符
      //         let end = this.message.substring(1);
      //         //重新拼接得到新的字符串，并赋值给this.message
      //         this.message = end + start;
      //     },300)
      //   }
      // },
      animateFn() {
        const { content } = this.$refs;
        let distance = this.wrapWidth;
        content.style.transform = "translateX(" + distance + "px)"; //初始值
        let that = this
        setInterval(function() {
          distance = distance - 1;
          if (-distance >= that.contentWidth) {
            distance = that.wrapWidth;
          }
          content.style.transform = "translateX(" + distance + "px)";
        }, 20);
        //控制速度
      },
      getMore(){
        console.log(this.$refs.announ.visible)
        this.$refs.announ.visible = true
        // this.$refs.announ.add()
      },
      getannouncement(val){
        this.message = ''
        let param = {
          projectId:this.projectId,
          upOrDown:val,
          id:this.id
        }
        getAction(this.url,param).then(res=>{
          if(res.success && res.result){
            this.datatime = res.result.createTime
            this.upperStatus = res.result.upperStatus
            this.belowStatus = res.result.belowStatus
            // console.log('noticeContent',res.result.noticeContent)
            if(res.result.noticeContent){
              this.message = res.result.noticeContent.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi,'').replace(/<[^>]+?>/g,'').replace(/\s+/g,' ').replace(/ /g,' ').replace(/>/g,' ').replace(/&nbsp;/ig, ' ');
            }
            this.$forceUpdate()
            this.id =  res.result.id
            // console.log('message',this.message)
          }
        })
      },
      getlist(){
        this.getannouncement()
      },
      nextData(val){
        this.getannouncement(val)
      }
    },
  //   updated: function() {
  //   this.animateFn();
  // }
  }
</script>
<style lang="less" scoped>
.backgd{
  background: #FFFFFF;
  border-radius: 4px;
  padding: 10px 20px;
  overflow: hidden;
  margin-top: 5px;
  div{
    float: left;
  }
  .icon{
    color: #E7EBFC;
    margin-right: 15px;
  }
  .title{
    font-weight: bold;
    font-size: 16px;
    width: 60px;
  }
  .time{
    width: 105px;
  }
  .content{
    width:calc(100% - 330px);
    white-space:nowrap;
    overflow: hidden;
  }
  .nextbtn{
    float:right;
    color: #D3DCE5;
    a{
      color: #bb148A;
      font-size: 14px;
      margin-right: 10px;
      display:inline-block;
    }
    i{
      margin-left: 5px;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
::v-deep .ant-modal-footer{
   display: none;
}
</style>