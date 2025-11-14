<template>
  <div>
    <div class="pl-grid-top">
      <div class="pl-grid-top-left">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <strong class="pl-bullet-txt is-blue">승인(반려)일자</strong>
          <span>{{ '프로모션: '+    (this.mixin_isEmpty(detailItems)? 0 : detailItems[0].RECM1_CNT) + '/' + totCnt }}</span>
          <span>{{ '칭찬: '+    (this.mixin_isEmpty(detailItems)? 0 : detailItems[0].RECM2_CNT) + '/' + totCnt }}</span>
          <span>{{ '업체비협조: '+    (this.mixin_isEmpty(detailItems)? 0 : detailItems[0].RECM3_CNT)+ '/' + totCnt }}</span>
        </div>
      </div>
      <div class="pl-grid-top-utils">
        <compo-tooltip-btn
          TitleProp="초기화"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('초기화')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <v-data-table
      class="pl-grid is-mt-s"
      :headers="headers"
      :items="detailItems"
      :loading="isLoading"
      fixed-header
      item-key="ROW_NUMBER"
      height="460px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event">
    </v-data-table>
    <div class="pl-pager">
      <div class="pl-pager-row">
        <span>페이지당 항목 수</span>
        <v-select
          class="pl-form"
          :value="ROW_PER_PAGE"
          :items="perPage"
          :item-text="toString(ROW_PER_PAGE)"
          @change="ROW_PER_PAGE = parseInt($event, 10);"
        ></v-select>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        :total-visible="7">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(detailItems, page) }} / {{ detailItems.length }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :disabled="pagination.nextDisabled"
          @btnClick="getStatsGvifmtDetail(true)"
        ></compo-tooltip-btn>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'STA_M1900_DIALOG', //제보현황 통계 - 상세
  components: {
  },
  props:{
    SRCH_PROP : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      pagination : {
        ROW_CNT : 500
        , PAGES_CNT : 0
        , nextDisabled : false
      },

      isLoading : false,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px',sortable: false },
        { text: '승인(반려)일시', value: 'PRCS_DT', align: 'center', width: '140px', sortable: false },
        { text: '상담번호', value: 'PHN_CUTT_ID', align: 'center', width: '100px', sortable: false },
        { text: '휴대폰', value: 'LAST_PHN_NO', align: 'center', width: '120px', sortable: false },
        { text: '팀', value: 'DEPT_NM', align: 'center', width: '100px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: 'center', width: '70px', sortable: false },
        { text: '제보유형', value: 'GVIFMT_TYPE_NM', align: 'center', width: '100px', sortable: false },
        { text: '제보일시', value: 'REG_DT', align: 'center', width: '140px', sortable: false },
        { text: '승인반려사유', value: 'GVIFMT_CN', align: ' pl-text-pre-wrap', width: '', sortable: false },
      ],
      detailItems: [],
      totCnt: 0,
    }
  },
  created() {
    if(!this.mixin_isEmpty(this.SRCH_PROP)){
      this.getStatsGvifmtDetail()
    }
  },
  mounted() {
  },
  methods: {
    async getStatsGvifmtDetail( next ){
      this.isLoading = true
      if( !next ){
        this.detailItems = []
        this.pagination.PAGES_CNT = 1
      }
      let sUrl = '/api/biz/common/select/selectStatsGvifmtDetail'
      let postParam = {
        SRCH_CUSTCO_ID : this.SRCH_PROP.srchCustcoId,
        SRCH_DEPT_ID : this.SRCH_PROP.srchDeptId,
        SRCH_TERM_TYPE : this.SRCH_PROP.srchTermType,
        SRCH_GVIFMT_TYPE_CD : this.SRCH_PROP.srchRecmCd,
        SRCH_USER_ID : this.SRCH_PROP.srchUserId,
        SRCH_YEAR  : this.SRCH_PROP.srchYear,
        SRCH_MONTH  : this.SRCH_PROP.srchMonth,
        SRCH_DAY  : this.SRCH_PROP.srchDay,
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsUserMapper',
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        }
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      this.totCnt = response.HEADER.TOT_COUNT
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          this.detailItems.push(item)
        })
      }else{
        this.showAlertCaution({msg: '조회 중 오류가 발생했습니다.'})
      }
      if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        if (response.HEADER.next === true) {
          this.pagination.nextDisabled = false //버튼 활성화
        } else {
          this.pagination.nextDisabled = true  //버튼 비활성화
        }
      }else{
        this.pagination.nextDisabled = true //버튼 활성화
      }
      this.isLoading = false
    },
  },
  computed: {
  },
  watch: {
    SRCH_PROP : {
      handler(newValue, oldValue) {
        if(!this.mixin_isEmpty(newValue)){
          this.getStatsGvifmtDetail()
        }
      },
      deep: true,
      immediate: true
    }
  },
};
</script>

<style lang="scss" scoped>

</style>