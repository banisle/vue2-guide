<template>
  <div>
    <v-data-table
    class="pl-grid is-mt-s"
    :headers="headers"
    :items="items"
    fixed-header
    item-key="RNUM"
    height="300px"
    :items-per-page="-1"
    hide-default-footer
    no-data-text="등록된 데이터가 없습니다."
    @page-count="pageCount = $event"
  >
  <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
    <template v-if="header.telYn">
      <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
    </template>
    <template v-else>
      <template v-if="header.value === 'CUTOFF_PERIOD_DT'">
        {{ mixin_convertDate(item['CUTOFF_BGNG_DT'], 'yyyy-MM-dd') + ' ~ ' + mixin_convertDate(item['CUTOFF_END_DT'], 'yyyy-MM-dd') }}
      </template>
      <template v-else>{{ item[header.value] }}</template>
    </template>
  </template>
  </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'StatusBoardSlideDetail_TAB_02', //배려고객 상세 - 배려고객 이력
  props:{
    PropData: {
      type: Object,
    },
  },
  components: {
  },
  data() {
    return {
      headers: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        { text: '구분', value: 'CAUTION_CUST_STTS_NM', align: 'center', width: '15%',sortable: false },
        { text: '차단유형', value: 'WARN_TYPE_NM', sortable: false},
        { text: '차단 기간', value: 'CUTOFF_PERIOD_DT', align: 'center', width: '30%',sortable: false },
        { text: '차단일', value: 'CUTOFF_PERIOD', align: 'center', width: '15%',sortable: false },
      ],
      items: [],
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  async created() {
    this.getCustCautionHstryList();
  },
  methods: {
    //배려고객 이력 목록
    async getCustCautionHstryList() {
      this.items = [];
      let postParam = {
        CUST_ID : this.PropData.CUST_ID
      };

      let headParam = {
        head: {
          ns: "lhcs.cust.dao.CustMapper",
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/custCautionHstryList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.items = response.DATA;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>