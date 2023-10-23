<template>
  <div class="monitor-report">
    <div class="doc-title">
      <a-button type="primary" style="margin-right: 15px">简历评分系统</a-button>
      <span style="color: #000; font-weight: 700">{{ param.title }}</span>
      <a-button type="primary" style="float: right" icon="share-alt" @click="openNotification">分享</a-button>
    </div>
    <div class="office" v-if="pageLoading">
      <MonitorOffice :option="option"></MonitorOffice>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
// 组件
import MonitorOffice from './OnlineDoc.vue'

export default {
  components: {
    MonitorOffice,
  },
  data() {
    return {
      // office配置参数
      option: {
        url: '',
        isEdit: false,
        fileType: '',
        title: '',
        editUrl: '',
      },
      pageLoading: false,
      param: {},
      userInfo: Vue.ls.get(USER_INFO),
    }
  },
  mounted() {
    // console.log('this.param', this.$Base64.decode(this.$route.query.info), Vue.ls.get(USER_INFO))
    this.param = JSON.parse(this.$Base64.decode(this.$route.query.info))
    // console.log('this.param', this.param)
    if (this.param.edit) {
      this.initEdit()
    } else {
      this.initView()
    }
  },
  methods: {
    openNotification() {
      // `【简历评分系统】 ${this.userInfo.realname}将“${this.param.title}.${this.param.type}”分享给您，请点击查看`,
      let shareInfo=`【简历评分系统】 ${this.userInfo.realname}将“${this.param.title}.${this.param.type}”分享给您，请点击查看 ${window.location.href}`
      this.copyEvent(shareInfo)
      this.$notification.open({
        message: '分享信息',
        description: (h) => {
          return h('div', null, [
            h(
              'div',
              `【简历评分系统】 ${this.userInfo.realname}将“${this.param.title}.${this.param.type}”分享给您，请点击查看`
            ),
            h(
              'a',
              {
                attrs: {
                  style: 'word-break:break-all;',
                },
              },
              `${window.location.href}`
            ),
          ])
        },
        style: {
          width: '600px',
          marginLeft: `${270 - 600}px`,
        },
      })
    },
    copyEvent(url) {
      var copyInput = document.createElement('input') // 创建元素
      //val是要复制的内容
      copyInput.setAttribute('value', url)
      document.body.appendChild(copyInput)
      copyInput.select()
      try {
        var copyed = document.execCommand('copy')
        if (copyed) {
          document.body.removeChild(copyInput)
          this.$message.success('分享链接已复制到剪切板')
        }
      } catch {
        this.$message.error('复制失败，请检查浏览器兼容')
      }
    },
    initView() {
      let user = Vue.ls.get(USER_INFO)
      this.pageLoading = true
      this.option.isEdit = false
      this.option.lang = 'zh-CN'
      this.option.url =
        window._CONFIG['domianURL'] + `/bus/busFileOnline/view?fileName=${this.param.title}.${this.param.type}`
      this.option.title = this.param.title
      this.option.fileType = this.param.type
      this.option.user = { id: user.id, name: user.username }
      // this.option.editUrl = 'http://8.142.142.3:10086/docx/save'
    },
    initEdit() {
      let user = Vue.ls.get(USER_INFO)
      this.pageLoading = true
      this.option.isEdit = true
      this.option.lang = 'zh-CN'
      this.option.url =
        window._CONFIG['domianURL'] + `/bus/busFileOnline/view?fileName=${this.param.title}.${this.param.type}`
      this.option.title = this.param.title
      this.option.fileType = this.param.type
      this.option.user = { id: user.id, name: user.username }
      //编辑回调地址
      this.option.editUrl =
        window._CONFIG['domianURL'] +
        `/bus/busFileOnline/callback?path=${this.param.title}.${this.param.type}&id=${this.param.id}`
    },
  },
}
</script>
<style lang="less" scoped>
.monitor-report {
  .doc-title {
    padding: 30px 24px 24px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 1vh;
    width: 100%;
    height: 9vh;
  }

  .office {
    height: 90vh;
  }
}
</style>
   
   