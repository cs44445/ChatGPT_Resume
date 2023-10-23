<template>
  <div>
    <a-table
      rowKey="id"
      size="small"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource" 
      :pagination="false"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleViewApprHistory(record)">{{text}}</a>
      </span>
    </a-table>
    <bus-mile-post-modal ref="modalApprHisForm"  />
  </div>
</template>

<script>
  import { getAction ,putAction} from '@api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BusMilePostModal from './BusMilePostModal'
  export default {
    name: 'BusProjectAmountSubTable',
    mixins: [JeecgListMixin],
    props: {
      record: {
        type: Object,
        default: null,
      }
    },
    components:{
      BusMilePostModal
    },
    data() { 
      return {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '里程碑',
            dataIndex: 'milepostName',
            scopedSlots: { customRender: 'action' }
          },
          {
            title: '开始时间',
            dataIndex: 'beginTime',
          },          {
            title: '结束时间',
            dataIndex: 'endTime',
          },
          {
            title: '计划人数',
            dataIndex: 'peopleNum',
          },
          {
            title: '计划总工时',
            dataIndex: 'planHours',
          },
          {
            title: '实际总工时',
            dataIndex: 'totalHours',
          },
          {
            title: '正常工时',
            dataIndex: 'workHours',
          },
          {
            title: '加班工时',
            dataIndex: 'overtimeHours',
          },
        ],
        url: {
          listByMainId: '/bus/countWorkHours/projectCountDetailedList',
        },
      }
    },
    watch: {
      record: {
        immediate: true,
        handler() {
          if (this.record != null) {
            this.loadData(this.record)
          }
        }
      }
    },
    methods: {
      loadData(record) {
        this.loading = true
        this.dataSource = []
        getAction(this.url.listByMainId, {
          projectId: record.projectId
        }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records
          }
        }).finally(() => {
          this.loading = false
        })
      },
      handleViewApprHistory(record){
        this.$refs.modalApprHisForm.visible = true;
        this.$refs.modalApprHisForm.loadData(1,record);
      }
    }
  }
</script>

<style scoped>

</style>
