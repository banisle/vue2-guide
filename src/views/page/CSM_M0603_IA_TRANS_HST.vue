<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회기간(발송일)
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
            :StartDayProp.sync="srchParam.srchStartDt"
            :EndDayProp.sync="srchParam.srchEndDt"
            @startDayChange="mixin_testLog(srchParam.srchStartDt)"
            @endDayChange="mixin_testLog(srchParam.srchEndDt)"
            ParentStyleProp="width: 306px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          기간유형
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle is-sm"
            :items="DataProp.termTypeCd"
            v-model="srchParam.srchTermType"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          유형
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            :items="mixin_common_code_get(DataProp.commonCode,'IAT', '전체')"
            v-model="srchParam.srchDivCd"
            placeholder="선택"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          메시지 유형
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle is-sm"
            :items="DataProp.msgTypeCd"
            v-model="srchParam.srchMsgType"
            placeholder="선택"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          지역
        </span>
        <compo-cutt-zone-combo
            :FormSeProp="'SRCH'"
            :ClearProp="clearProp"
            @EMIT_CUTT_ZONE="setCuttZone"
        />
      </div>

      <div>
        <v-btn class="pl-btn is-icon"
               @click="getSmsHstList(false)"
        >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="초기화"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="initSrch"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <v-btn class="pl-btn is-icon is-trans"
                 :disabled="mixin_isEmpty(checkedRow)"
                 @click="$refs.interestSendSmsList.beforeSend()"
          >
            <span class="pl-icon20 circle-plus"></span>
            재발송
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="excelHeaders"
            :DataBodyProp="smsTransHstList"
            :FileNameProp="'관심지역_발송내역_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
            HeaderColorProp="00B0F0"
        ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s has-control is-hover"
        v-model="checkedRow"
        :headers="headers"
        :items="smsTransHstList"
        :loading="isLoading"
        show-select
        single-select
        fixed-header
        item-key="SMS_GROUP_HST_ID"
        height="calc(-360px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        :item-class="isActiveRow"
        hide-default-footer
        @click:row="rowSelect"
        @dblclick:row="showDetail"
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
      >
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
          보기 {{ mixin_getPagePeriod(smsTransHstList, page) }} / {{ smsTransHstList.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            @btnClick="getSmsHstList(true)"
            :DisabledProp="pagination.nextDisabled"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

    <!-- dialog: 상세 -->
    <v-dialog
      v-model="dialogDetail"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="관심지역 SMS 발송 리스트"
        @hide="mixin_hideDialog('Detail')"
        @submit="submitDialog('Detail')"
      >
        <template slot="body">
          <CSM_M0603_IA_TRANS_HST_DIALOG
              ref="interestSendSmsList"
              :DataProp="selectedRow"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Detail')">닫기</v-btn>
          <v-btn class="pl-btn" @click="$refs.interestSendSmsList.beforeSend()">발송</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>

import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CSM_M0603_IA_TRANS_HST_DIALOG from "@/views/page/CSM_M0603_IA_TRANS_HST_DIALOG.vue";

export default {
  name: 'CSM_M0603_IA_TRANS_HST', //발송 내역
  components: {
    CompoCuttZoneCombo,
    CSM_M0603_IA_TRANS_HST_DIALOG
  },
  props : {
    DataProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      page: 1,
      pageCount: 0,
      perPage: [12,30,50,100],
      ROW_PER_PAGE: 20,
      headers: [
        { text: '번호', value: 'R0W_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'GROUP_NM', align: 'left', width: '',sortable: true },
        { text: '검색기간', value: 'SEARCH_DT', align: 'center', width: '10%',sortable: false },
        { text: '종합상담', value: 'LH_CNT', align: 'center', width: '7%', sortable: false },
        { text: '주거지원', value: 'MH_SUPP_CNT', align: 'center', width: '7%', sortable: false },
        { text: '주거급여', value: 'HB_CNT', align: 'center', width: '7%', sortable: false },
        { text: '발송건수', value: 'SEND_CNT', align: 'center', width: '7%', sortable: false },
        { text: '날짜', value: 'SEND_DT', align: 'center', width: '8%', sortable: false },
        { text: '시간', value: 'SEND_TIME', align: 'center', width: '8%', sortable: false },
        { text: '발송설정', value: 'SEND_OPT', align: '', width: '10%', sortable: false },
        { text: '구분', value: 'MESSAGE_TYPE', align: 'center', width: '7%', sortable: false },
      ],
      excelHeaders: [
        { text: '번호', value: 'R0W_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'GROUP_NM', align: 'left', width: '300px',sortable: true },
        { text: '검색기간', value: 'SEARCH_DT', align: 'center', width: '200px',sortable: false },
        { text: '종합상담', value: 'LH_CNT', align: 'center', width: '100px', sortable: false },
        { text: '주거지원', value: 'MH_SUPP_CNT', align: 'center', width: '100px', sortable: false },
        { text: '주거급여', value: 'HB_CNT', align: 'center', width: '100px', sortable: false },
        { text: '발송건수', value: 'SEND_CNT', align: 'center', width: '100px', sortable: false },
        { text: '날짜', value: 'SEND_DT', align: 'center', width: '100px', sortable: false },
        { text: '시간', value: 'SEND_TIME', align: 'center', width: '100px', sortable: false },
        { text: '발송설정', value: 'SEND_OPT', align: '', width: '200px', sortable: false },
        { text: '구분', value: 'MESSAGE_TYPE', align: 'center', width: '70px', sortable: false },
      ],
      smsTransHstList: [
        { index: 3491, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 28, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3492, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 62, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3493, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 369, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3494, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 92, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3495, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 28, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3496, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 28, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3497, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 28, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
        { index: 3498, type00: '매입임대 - 신혼부부|충북|청주시|전체', type01: '2024-06-20 1년 초과', type02: 0, type03: 0, type04: 0, type05: 28, type06: '2024-06-20', type07: '14:48:31',type08: '즉발' ,type09: 'LMS', },
      ],

      isLoading : false,
      clearProp : false,
      totCnt : 0,

      selectedRow : {},
      checkedRow : [],

      srchParam: {
        srchStartDt:  this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchDivCd: '',
        srchCntrCd: '',
        srchZone : new Array(3),
        srchAllZone: '',
        srchTermType: '',
        srchMsgType: '',
        srchSmsGroupHstType: 'SGH',
      },
      pagination: {
        PAGES_CNT : 1,
        ROW_CNT : 500,
        nextDisabled : false
      },

      // dialog
      dialogDetail: false,


    }
  },
  created() {
    this.getSmsHstList(false);
  },
  mounted() {
  },
  methods: {

    showDetail(){
      this.dialogDetail = true
    },
    rowSelect(idx) {
      this.checkedRow = []
      this.selectedRow = idx;
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    setCuttZone(data){
      this.srchParam.srchZone = []
      this.srchParam.srchZone = data;
    },
    async getSmsHstList(next){
      this.isLoading = true;
      if(!next){
        this.smsTransHstList = [];
        this.checkedRow = []
        this.pagination.PAGES_CNT = 1;
      }

      let sUrl = '/api/biz/common/select/selectInterestAreaHstList'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','') + '000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','') + '235959',
        SRCH_DIV_CD : this.srchParam.srchDivCd,
        SIDO_ID : this.srchParam.srchZone[0],
        SIGUNGU_ID : this.srchParam.srchZone[1],
        JIGU_ID : this.srchParam.srchZone[2],
        SRCH_TERM_TYPE : this.srchParam.srchTermType,
        SRCH_MSG_TYPE : this.srchParam.srchMsgType,
        SRCH_SMS_GROUP_HST_TYPE : this.srchParam.srchSmsGroupHstType,
      }
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper',
          sn : 'selectInterestAreaHstList',
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        }
      }
      console.log(postParam)
      const response = await this.common_postCall(sUrl,postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.totCnt = response.HEADER.TOT_COUNT
        response.DATA.map(item => this.smsTransHstList.push(item))
        this.pagination.PAGES_CNT++
      }else{
        this.showAlertCaution({msg : '조회 중 문제가 발생했습니다.'})
      }
      if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        if(response.HEADER.next === true){
          this.pagination.nextDisabled = false //버튼 활성화
        }else{
          this.pagination.nextDisabled = true  //버튼 비활성화
        }
      }
      this.isLoading = false;
    },
    initSrch() {
      this.clearProp = !this.clearProp
      this.srchParam= {
        srchStartDt:  this.$moment(new Date()).format('YYYY-MM-DD'),
            srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
            srchDivCd: '',
            srchCntrCd: '',
            srchZone : new Array(3),
            srchAllZone: '',
            srchTermType: '',
            srchMsgType: '',
            srchSmsGroupHstType: 'SGH',
      }
    }
  },
  computed: {
  },
  watch: {
    checkedRow (){
      console.log(this.checkedRow)
      if(!this.mixin_isEmpty(this.checkedRow)){
        this.selectedRow = this.checkedRow[0];
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>