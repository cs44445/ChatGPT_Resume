import { getAction } from '@/api/manage'

export const addchanceMixin = {
    data(){
        return {
            chanceOptions:[],
            url: {
              detail:"/bus/busChance/getActivityListByChanceId",  
              busChance:'/bus/busChance/queryById'//通过机会id查询机会详情信息  
            },
        }
    },
    created(){
        this.initChanceList()
    },
    methods: {
      //点击 、申报、资金list中的机会编码，弹出机会详情弹出框
      handleChanceDetail(record){
        // 获取机会信息
        getAction(this.url.busChance,{id:record.chanceId}).then(res=>{
          if(res.success==true){
            // 获取活动列表
            getAction(this.url.detail, {chanceId:record.chanceId}).then(res1 => {
              res.result.activityList = res1.result
              this.$refs.modalChanceForm.edit(res.result);
              this.$refs.modalChanceForm.title="详情";
              this.$refs.modalChanceForm.disableSubmit = true;
              localStorage.setItem('flag','detail')
            })
          }
        })       
      },
        handleAddChance(){ 
          this.$refs.modalChanceForm.add();
        },
        modalChanceFormOk(){
          this.initChanceList()
        },
        initChanceList(){
            getAction("/sys/dict/getDictItems/" + "bus_chance,title,id,del_flag!='1' order by create_time desc").then(res => {
              if (res.success) {
                let result = res.result
                let dictOptions = []
                for (let i = 0; i < result.length; i++) {
                  let temp = result[i];
                  let item = {}
                  item.label = temp.title
                  item.value = temp.value
                  dictOptions.push(item);
                }
                this.chanceOptions = dictOptions
              } else {
                this.$message.warn(`获取失败：` + res.message)
              }
            }).finally(() => {
              this.loading = false
            })
        },
        filterChanceOption(input, option) {
          console.log(input, option,'input, option')
          return (
            option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        },
    }
}