<template>
  <div class="is-mt-s">
    <v-data-table
      class="pl-grid"
      height="150px"
      :headers="headers"
      :items="RCV_SCHEDULER_HIST"
      fixed-header
      item-key="ROW_NUM"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >
    </v-data-table>

  </div>
</template>

<script>
export default {
  name: "CompoAsFlwAcpDetail_HISTORY", //진행현황 이력
  components: {
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
    }
  },
  data() {
    return {
      FLW_DTL_FULL_SN: '',
      
      RCV_SCHEDULER_HIST: [],


      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: false },
        { text: '업무유형', value: 'WORK_TYPE_NM', align: '', width: '80px',sortable: false },
        { text: '통화 예약일', value: 'RSRV_YMD',width: '90px', sortable: false},
        { text: '보수 예정일', value: 'VISIT_DT', align: '', width: '130px',sortable: false },
        { text: '메모', value: 'RSRV_CNTNT', align: '', width: '15%',sortable: false },
        { text: '완료유형', value: 'SCH_STAT_TYPE_NM', align: '', width: '60px',sortable: false },
        { text: '처리자', value: 'PROC_EMP_NM', align: '', width: '70px',sortable: false },
        { text: '처리일', value: 'PROC_DT', align: '', width: '130px',sortable: false },
      ],
      items: [
        { index: 1, type1: '', type2: '2024-06-20', type3: '', type4: '고객만족도 조사차', type5: '', type6: '우성아', type7: '2024-06-20 13:02:28', },
        { index: 2, type1: '', type2: '2024-06-20', type3: '', type4: '고객만족도 조사차', type5: '', type6: '우성아', type7: '2024-06-20 13:02:28', },
        { index: 3, type1: '', type2: '2024-06-20', type3: '', type4: '고객만족도 조사차', type5: '', type6: '우성아', type7: '2024-06-20 13:02:28', },
        { index: 4, type1: '', type2: '2024-06-20', type3: '', type4: '고객만족도 조사차', type5: '', type6: '우성아', type7: '2024-06-20 13:02:28', },
        { index: 5, type1: '', type2: '2024-06-20', type3: '', type4: '고객만족도 조사차', type5: '', type6: '우성아', type7: '2024-06-20 13:02:28', },
        { index: 6, type1: '', type2: '2024-06-20', type3: '', type4: '고객만족도 조사차', type5: '', type6: '우성아', type7: '2024-06-20 13:02:28', },
        { index: 7, type1: '', type2: '', type3: '2024-06-20 9시 ~ 16시', type4: '해피콜완료', type5: '완료', type6: '우성아', type7: '2024-06-20 13:02:28', },
      ],
    }
  },
  mounted() {
  },
  created() {
    if(this.DataProp && this.DataProp.FLW_DTL_FULL_SN) {
        this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN;
        this.getRcvSchedulerHist();
      }
  },
  computed: {
    
  },
  watch: {
    DataProp() {
      if(this.DataProp && this.DataProp.FLW_DTL_FULL_SN && this.FLW_DTL_FULL_SN != this.DataProp.FLW_DTL_FULL_SN) {
        this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN;
        this.getRcvSchedulerHist();
      }
    }
  },
  methods: {

    async getRcvSchedulerHist() {
      this.RCV_SCHEDULER_HIST = [];
      const postParam = {
        FLW_DTL_FULL_SN: this.FLW_DTL_FULL_SN
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsFlwAcpMapper'
      }};
      const response = await this.common_postCall("/api/biz/common/select/selectRcvSchedulerHist", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.RCV_SCHEDULER_HIST = response.DATA;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>