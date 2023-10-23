export const chanceMixin = {
    data(){
        return {
            chanceStatus:"",
            model:{},
            stepForm:{}
        }
    },
    created() {
      this.$bus.$on('chanceStatus', res=>{
         this.chanceStatus = res
      })           
      this.$bus.$on('title', res=>{
         this.$set(this.model, 'title', res)  
         this.$set(this.stepForm, 'title', res) 
      })
      this.$bus.$on('owner', res=>{
         this.$set(this.model, 'owner', res)  
         this.$set(this.stepForm, 'owner', res)  
      })
      this.$bus.$on('contacts', res=>{
         this.$set(this.model, 'contacts', res)  
         this.$set(this.stepForm, 'contacts', res) 
      })
      this.$bus.$on('companyId', res=>{
         this.$set(this.model, 'companyId', res)  
         this.$set(this.stepForm, 'companyId', res) 
      })
      this.$bus.$on('investmentScale', res=>{
         this.$set(this.model, 'investmentScale', res)  
         this.$set(this.stepForm, 'investmentScale', res) 
      })
      this.$bus.$on('closeDate', res=>{
         this.$set(this.model, 'closeDate', res)  
         this.$set(this.stepForm, 'closeDate', res) 
      })
      this.$bus.$on('industry', res=>{
         this.$set(this.model, 'industry', res)  
         this.$set(this.stepForm, 'industry', res) 
      })
      this.$bus.$on('projectContext', res=>{
         this.$set(this.model, 'projectContext', res)  
         this.$set(this.stepForm, 'projectContext', res) 
      })
      this.$bus.$on('industryNature', res=>{
         this.$set(this.model, 'industryNature', res)  
         this.$set(this.stepForm, 'industryNature', res) 
      })
      this.$bus.$on('projectAsset', res=>{
         this.$set(this.model, 'projectAsset', res)  
         this.$set(this.stepForm, 'projectAsset', res) 
      })
      this.$bus.$on('projectAssetUnit', res=>{
         this.$set(this.model, 'projectAssetUnit', res)  
         this.$set(this.stepForm, 'projectAssetUnit', res) 
      })
    },
    methods: { 
        changeChanceStatus(status){
            console.log(status,'status')
            this.$bus.$emit('chanceStatus',status)
         },
        handleChangeUnit(value) {
            console.log(`selected ${value}`)
            this.model.projectAssetUnit = value
            this.stepForm.projectAssetUnit = value
            this.$bus.$emit('projectAssetUnit',value)
        },
        changeTitle(e){
            this.$bus.$emit('title',e)
            this.stepForm.title = e
         },
         changeOwner(e){
           this.$bus.$emit('owner',e)
         },
         changeContacts(e){
           this.$bus.$emit('contacts',e)
         },
         changeUnitName(e){
           this.$bus.$emit('companyId',e)
         },
         onChangeInvestmentScale(e){
           this.stepForm.investmentScale = e.target.value
           this.$bus.$emit('investmentScale',e.target.value)
         },
         onChangeDate(date, dateString) {
           console.log(date, dateString);
           this.stepForm.closeDate = dateString
           this.$bus.$emit('closeDate',dateString)
         },
         onChangeIndustry(e){
           console.log(e)
           this.stepForm.industry = e
           this.$bus.$emit('industry',e)
         },
         onChangeProjectContext(e){
           this.$bus.$emit('projectContext',e.target.value)
         },
         onChangeIndustryNature(e){
           this.$bus.$emit('industryNature',e)
         },
         onChangeProjectAsset(e){
           this.$bus.$emit('projectAsset',e.target.value)
         },
         onChangeProjectLocationName(e){
             console.log(e)
           this.$bus.$emit('projectLocationName',e)
         },
     }
}