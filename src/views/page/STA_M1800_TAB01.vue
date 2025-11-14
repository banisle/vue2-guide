<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          상담일자
        </span>
        <div class="pl-desc">
          <div class="d-flex">
            <compo-date-range-picker
                :StartDayProp.sync="srchParam.srchStartDt"
                :EndDayProp.sync="srchParam.srchEndDt"
                :IsViewDropPickerProp="false"
                :selectTermProp="true"
                @startDayChange="()=>{ }"
                @endDayChange="()=>{ }"
                ParentStyleProp="width: 370px"
            />
          </div>
        </div>
      </div>

      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="getStatsVocDetail(false)"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">VOC 상세</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              :DataHeaderProp="headersExcel"
              :DataBodyProp="itemsRowSpan"
              :FileNameProp="`지역본부별_VOC_상세_${srchParam.srchStartDt}~${srchParam.srchEndDt}`"
              SheetNameProp="지역본부별VOC상세"
              HeaderColorProp="00B0F0"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-header-lg"
        style="max-width: calc(100vw - 360px)"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        :loading="isLoading"
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(-360px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        hide-default-header
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
        >
        <!-- 헤더 -->
        <template v-slot:header>
          <thead class="v-data-table-header multi-row">
            <tr>
              <th rowspan="2" width="50px" class="text-center"><span>NO</span></th>
              <th rowspan="2" width="100px" class="text-center"><span>상담번호</span></th>
              <th rowspan="2" class="text-center"><span>상담날짜</span></th>
              <th rowspan="2" class="text-center"><span>공급유형</span></th>
              <th rowspan="2" class="text-center"><span>단지유형</span></th>
              <th rowspan="2" class="text-center"><span>본부코드</span></th>
              <th rowspan="2" class="text-center"><span>본부명</span></th>
              <th rowspan="2" width="80px" class="text-center"><span>단지코드</span></th>
              <th rowspan="2" class="text-center"><span>단지명</span></th>
              <th rowspan="2" class="text-center"><span>상담사</span></th>
              <th rowspan="2" class="text-center"><span>소속</span></th>
              <th rowspan="2" width="50px" class="text-center"><span>상세경로</span></th>
              <th rowspan="2" class="text-center"><span>접촉채널</span></th>
              <th rowspan="2" class="text-center"><span>처리결과</span></th>

              <th colspan="3" class="text-center"><span>상담유형</span></th>

              <th rowspan="2" class="text-center"><span>AS접수건</span></th>
              <th rowspan="2" class="text-center"><span>접촉횟수</span></th>
              <th rowspan="2" width="100px" class="text-center"><span>상담내용</span></th>
              <th rowspan="2" class="text-center"><span>고객명</span></th>
              <th rowspan="2" class="text-center"><span>통화시간</span></th>
              <th rowspan="2" class="text-center"><span>상담일</span></th>
              <th rowspan="2" width="65px" class="text-center"><span>상담시각</span></th>
              <th rowspan="2" width="100px" class="text-center"><span>연락처</span></th>
              <th rowspan="2" class="text-center"><span>블랙컨슈머</span></th>
              <th rowspan="2" class="text-center"><span>AS 접수번호</span></th>
              <th rowspan="2" class="text-center"><span>보수구분</span></th>
              <th rowspan="2" class="text-center"><span>진행상태</span></th>
              <th rowspan="2" class="text-center"><span>공간</span></th>

              <th colspan="3" class="text-center"><span>공종</span></th>

              <th rowspan="2" class="text-center"><span>업체명</span></th>
              <th rowspan="2" class="text-center"><span>보수지시일</span></th>
            </tr>
            <tr>
              <th class="text-center"><span>대분류</span></th>
              <th class="text-center"><span>중분류</span></th>
              <th class="text-center"><span>소분류</span></th>
              <th class="text-center"><span>대공종</span></th>
              <th class="text-center"><span>중공종</span></th>
              <th class="text-center"><span>소공종</span></th>
            </tr>
          </thead>
        </template>

        <!-- 스크립트명 툴팁 -->
        <template v-slot:item.CUTT_CN="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.CUTT_CN }}</span>
            </template>
            <span>{{ item.CUTT_CN }}</span>
          </v-tooltip>
        </template>

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
          보기 {{ mixin_getPagePeriod(itemsRowSpan, page) }} / {{ itemsRowSpan.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            @btnClick="getStatsVocDetail(true)"
            :DisabledProp="pagination.nextDisabled"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'STA_M1800_TAB01', //VOC 상세
  components: {
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '상담번호', value: 'PHN_CUTT_ID', align: 'center pl-text-pre-wrap', width: '200px', sortable: false },
        { text: '상담날짜', value: 'REG_YMD', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '공급유형', value: 'SPL_TP_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '단지유형', value: 'MNTN_LS_TP_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '본부코드', value: 'ARA_HDQ_CD', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '본부명', value: 'ARA_HDQ_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '단지코드', value: 'MGOF_CD', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '단지명', value: 'MGOF_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '상담사', value: 'USER_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '소속', value: 'DEPT_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '상세경로', value: 'DRWI_TYPE_CD', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '접촉채널', value: 'RG_CHNL_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '처리결과', value: 'PROC_STAT_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '대분류', value: 'L_CUTT_TYPE_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '중분류', value: 'M_CUTT_TYPE_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '소분류', value: 'S_CUTT_TYPE_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: 'AS접수건', value: 'FLW_CNT', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '접촉횟수', value: 'OB_CNT', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '상담내용', value: 'CUTT_CN', align: 'center', width: '80px', sortable: false },
        { text: '고객명', value: 'CUST_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '통화시간', value: 'CALL_TIME', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '상담일', value: 'REG_YMD', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '상담시각', value: 'REG_HM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '연락처', value: 'LAST_PHN_NO', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '블랙컨슈머', value: 'BLACK_C_RESULTFG', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '진행상태', value: 'FLW_PGRS_SS_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '공간', value: 'SPCE_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '대공종', value: 'MCLS_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '중공종', value: 'SCLS_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '소공종', value: 'DCLS_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '업체명', value: 'FRM_NM', align: 'center pl-text-pre-wrap', width: '', sortable: false },
        { text: '보수지시일', value: 'RPR_NSTC_DT', align: 'center pl-text-pre-wrap', width: '', sortable: false },
      ],
      // headersExcel: [
      //   { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
      //   { text: '상담번호', value: 'PHN_CUTT_ID', align: 'center pl-text-pre-wrap', width: '200px', sortable: false },
      //   { text: '상담날짜', value: 'REG_YMD', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '공급유형', value: 'SPL_TP_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '단지유형', value: 'MNTN_LS_TP_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '본부코드', value: 'ARA_HDQ_CD', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '본부명', value: 'ARA_HDQ_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '단지코드', value: 'MGOF_CD', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '단지명', value: 'MGOF_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '상담사', value: 'USER_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '소속', value: 'DEPT_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '상세경로', value: 'DRWI_TYPE_CD', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '접촉채널', value: 'RG_CHNL_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '처리결과', value: 'PROC_STAT_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '대분류', value: 'L_CUTT_TYPE_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '중분류', value: 'M_CUTT_TYPE_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '소분류', value: 'S_CUTT_TYPE_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: 'AS접수건', value: 'FLW_CNT', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '접촉횟수', value: 'OB_CNT', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '상담내용', value: 'CUTT_CN', align: 'center', width: '500px', sortable: false },
      //   { text: '고객명', value: 'CUST_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '통화시간', value: 'CALL_TIME', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '상담일', value: 'REG_YMD', align: 'center pl-text-pre-wrap', width: '120px', sortable: false },
      //   { text: '상담시각', value: 'REG_HM', align: 'center pl-text-pre-wrap', width: '120px', sortable: false },
      //   { text: '연락처', value: 'LAST_PHN_NO', align: 'center pl-text-pre-wrap', width: '120px', sortable: false },
      //   { text: '블랙컨슈머', value: 'BLACK_C_RESULTFG', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center pl-text-pre-wrap', width: '120px', sortable: false },
      //   { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'center pl-text-pre-wrap', width: '150px', sortable: false },
      //   { text: '진행상태', value: 'FLW_PGRS_SS_NM', align: 'center pl-text-pre-wrap', width: '100px', sortable: false },
      //   { text: '공간', value: 'SPCE_NM', align: 'center pl-text-pre-wrap', width: '150px', sortable: false },
      //   { text: '대공종', value: 'MCLS_NM', align: 'center pl-text-pre-wrap', width: '150px', sortable: false },
      //   { text: '중공종', value: 'SCLS_NM', align: 'center pl-text-pre-wrap', width: '150px', sortable: false },
      //   { text: '소공종', value: 'DCLS_NM', align: 'center pl-text-pre-wrap', width: '150px', sortable: false },
      //   { text: '업체명', value: 'FRM_NM', align: 'center pl-text-pre-wrap', width: '200px', sortable: false },
      //   { text: '보수지시일', value: 'RPR_NSTC_DT', align: 'center pl-text-pre-wrap', width: '120px', sortable: false },
      // ],
      totCnt: 0,
      headersExcel: [],
      itemsRowSpan: [],
      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttZone : [],
        srchCustcoId : '4',
        srchDeptId : '',
        srchCallTp : '',
        srchRcptChnCd : '',
      },
      selectedCustcoItem : {},
      selectedDeptItem : {},
      totCntObject : {},
      isLoading : false,
      pagination : {
        ROW_CNT : 500
        , PAGES_CNT : 0
        , nextDisabled : false
      },

    }
  },
  created() {
    let tempHeader = _.cloneDeep(this.headersRowSpan)
    tempHeader.map(item=>{
      if(this.mixin_isEmpty(item.width)) {
        item.width = '120px'
      }else if(Number(item.width.replaceAll('%',''))< 20){
        item.width = '120px'
      }
      this.headersExcel.push(item)
    })
  },
  mounted() {
  },
  methods: {
    async getStatsVocDetail(next){

      this.isLoading = true
      if( !next ){
        this.itemsRowSpan = []
        this.pagination.PAGES_CNT = 1
      }
      let sUrl = '/api/biz/common/select/selectVocDetailList'
      let postParam = {
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsVocMapper',
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        },
        timeout : 300000
      }
      try{
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          this.totCnt = response.HEADER.TOT_COUNT
          response.DATA.map(item => {
            this.itemsRowSpan.push(item)
          })
        }else{
          this.showAlertCaution({msg : '조회 중 문제가 발생했습니다.'})
        }
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.pagination.nextDisabled = true //버튼 활성화
          }else{
            this.pagination.nextDisabled = false  //버튼 비활성화
          }
        }
        this.pagination.page += 1
      }catch(e){
        this.isLoading = false
      }
      this.isLoading = false
    },
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>