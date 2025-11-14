<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
    <!-- sub top -->
    <compo-sub-layout-top  >
      <template slot="search">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              조회기간
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
              센터구분
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  placeholder="전체"
                  :items="custcoList"
                  v-model="selectedCustcoItem"
                  return-object
                  :disabled="computedUserCenter < 0 ? false : true"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              불만유형
            </span>
            <div class="pl-desc">
              <v-select
                :items="mixin_common_code_get(common_code, 'VOC_CMP_TP', '전체')"
                v-model="srchParam.srchCmpTpCd"
                class="pl-form type-middle"
                placeholder="전체"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              처리결과
            </span>
            <div class="pl-desc">
              <v-select
                  :items="mixin_common_code_get(common_code, 'VOC_PRS_TP', '전체')"
                v-model="srchParam.srchPrsTpCd"
                class="pl-form type-middle"
                placeholder="전체"
              ></v-select>
            </div>
          </div>

          <div>
            <v-btn
              class="pl-btn is-icon"
              @click="getVocList(false)"
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>

        </div>
      </template>
    </compo-sub-layout-top>
    <!-- sub content -->
    <div class="pl-card-body">
       <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left">
          <v-btn
            class="pl-btn is-icon is-trans"
            @click="openWindow(false)"
          >
<!--            @click="mixin_openWindow( 'LayoutPopup', '850', '670', send_item)"-->
            <span class="pl-icon20 circle-plus"></span>
             등록
          </v-btn>
          <v-btn class="pl-btn is-icon is-trans"
                 @click="beforeDel"
          >
            <span class="pl-icon20 trash"></span>
             삭제
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              HeaderColorProp="00B0F0"
              :DataHeaderProp="headersExcel"
              :DataBodyProp="vocList"
              :FileNameProp="'모회사_VOC_목록_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              :SheetNameProp="'모회사_VOC_목록'"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s has-control is-hover"
        :headers="headers"
        :items="vocList"
        v-model="selectedVocList"
        show-select
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(-306px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        @click:row="rowClick"
        @dblclick:row="openWindow(true)"
        :loading="isLoading"
        :page.sync="page"
        no-data-text="등록된 데이터가 없습니다."
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
          보기 {{ mixin_getPagePeriod(vocList, page) }} / {{ vocList.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            @click="getVocList(true)"
            :DisabledProp="nextDisabled"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

   </div>
 </div>
</template>

<script>
export default {
  name: "MENU_CSM_M1500", //모회사 VOC
  components: {
  },
  data() {
    return {
      // search
      date1: '2025-02-03',
      date2: '2025-02-03',
      modelCenter: '전체',
      centerItems: ['전체'],
      modelVoc: '전체',
      vocItems: ['전체'],
      modelResult: '전체',
      resultItems: ['전체'],

      totCnt : 0,
      common_ognz_list : [],
      custcoList : [],
      common_code : [],
      selectedCustcoItem : {},
      srchParam : {
        srchStartDt : this.$moment().subtract(7,'days').format('YYYY-MM-DD')
        , srchEndDt : this.$moment().format('YYYY-MM-DD')
        , srchCmpTpCd : ''
        , srchPrsTpCd : ''
      },

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled : false,
      isLoading : false,

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '상담일', value: 'CUTT_YMD', align: 'left', width: '82px', sortable: true },
        { text: '상담시간', value: 'CUTT_HMS', align: 'center', width: '82px', sortable: false },
        { text: '불만유형', value: 'VOC_CVLCPT_TYPE_NM', align: 'left', width: '150px', sortable: false },
        { text: '내용', value: 'CN', align: 'left pl-text-pre-wrap', width: '', sortable: false },
        { text: '처리결과', value: 'VOC_PRCS_RSLT_NM', align: 'left', width: '8%', sortable: false },
        { text: '지역', value: 'RGN_NM', align: 'left', width: '8%', sortable: false },
        { text: '지구', value: 'DSTRCT_NM', align: 'left pl-text-pre-wrap', width: '8%', sortable: false },
        { text: '고객인입번호', value: 'CUST_PHN_NO', align: 'left', width: '100px', sortable: false },
        { text: '센터', value: 'CUSTCO_NM', align: 'left', width: '7%', sortable: false },
        { text: '등록일', value: 'V_REG_DT', align: 'center', width: '82px', sortable: false },
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '82px', sortable: false },
      ],
      headersExcel: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '상담일', value: 'CUTT_YMD', align: 'left', width: '100px', sortable: true },
        { text: '상담시간', value: 'CUTT_HMS', align: 'center', width: '100px', sortable: false },
        { text: '불만유형코드', value: 'VOC_CVLCPT_TYPE_CD', align: 'left', width: '150px', sortable: false },
        { text: '불만유형', value: 'VOC_CVLCPT_TYPE_NM', align: 'left', width: '200px', sortable: false },
        { text: '내용', value: 'CN', align: 'left pl-text-pre-wrap', width: '500px', sortable: false },
        { text: '처리결과코드', value: 'VOC_PRCS_RSLT_CD', align: 'left', width: '100px', sortable: false },
        { text: '처리결과', value: 'VOC_PRCS_RSLT_NM', align: 'left', width: '200px', sortable: false },
        { text: '지역', value: 'RGN_NM', align: 'left', width: '100px', sortable: false },
        { text: '지구', value: 'DSTRCT_NM', align: 'left pl-text-pre-wrap', width: '100px', sortable: false },
        { text: '상담번호', value: 'PHN_CUTT_ID', align: 'left', width: '200px', sortable: false },
        { text: '고객인입번호', value: 'CUST_PHN_NO', align: 'left', width: '200px', sortable: false },
        { text: '센터', value: 'CUSTCO_NM', align: 'left', width: '200px', sortable: false },
        { text: '등록일', value: 'V_REG_DT', align: 'center', width: '100px', sortable: false },
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '100px', sortable: false },
      ],
      vocList : [],
      selectedVocList : [],
      // popup
      send_item: {
        compo_name: 'CSL_M1500_POP',
        title: '모회사 VOC 상세 정보',
        callback : 'getVocList'
      },

    }
  },
  async created() {
    // 조직정보 조회
    this.common_ognz_list = await this.mixin_ognz_list();
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )
    this.custcoList.unshift({text : '전체', value : '', CUSTCO_ID : '', DEPT_NM : '전체'})

    // 센터 설정
    if(this.mixin_isEmpty(this.selectedCustcoItem)){
      if(this.computedUserCenter !== '-1'){
        this.selectedCustcoItem = await this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      }else{
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
    // 공통코드 조회
    let codeName = ['VOC_PRS_TP', 'VOC_CMP_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    // 헤더 변경
    if(this.computedUserCenter === '4'){
      const index = this.headers.findIndex(item => item.value === "CUST_PHN_NO");
      if (index !== -1) {
        this.headers.splice(index, 1,
            { text: '상담번호', value: 'PHN_CUTT_ID', align: 'left', width: '100px', sortable: false }
        );
      }
    }

    this.getVocList(false);

    this.$eventBus.$on("getVocList",()=>{
     this.getVocList(false)
    });

  },
  mounted() {
  },
  methods: {
    openWindow(flag){
      this.$set(this.send_item, 'injectionObj', {
        props : {
          common_cd : this.common_code
          , center_cd : this.custcoList
        }
        , data : flag ? this.selectedRow : {}
      });
      console.log("send_item", this.send_item)
      this.mixin_openWindow( 'LayoutPopup', '850', '670', this.send_item)
      window.removeEventListener('message', this.refresh);
      window.addEventListener('message', this.refresh);
    },
    refresh(event){
      if(event.data) {
        let flag = event.data.message;
        if(flag) this.getVocList(false)
      }
    },
    rowClick(item) {
      this.selectedRow = item;
    },
    async getVocList(next){
      if( !next ){
        this.vocList = [];
        this.selectedVocList = []
        this.pagination.page = 1;
        this.nextDisabled = false;
      }
      let sUrl = '/api/biz/common/select/selectMcVocList';
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.selectedCustcoItem.CUSTCO_ID,
        SRCH_CMP_TP_CD : this.srchParam.srchCmpTpCd,
        SRCH_PRS_TP_CD : this.srchParam.srchPrsTpCd,
      }
      let headParam = {
        head: {
          ns : 'lhcs.phone.cuttMng.data.dao.PhoneCuttMngVocMapper'
          , ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : "Y"
        }
      }

      let response = await this.common_postCall(sUrl,postParam,headParam)
      if(!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT;
        this.vocList = [...this.vocList, ...response.DATA];

        if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
          if (response.HEADER.next === true) {
            this.nextDisabled = false //버튼 활성화
          } else {
            this.nextDisabled = true  //버튼 비활성화
          }
        }
      }
        this.pagination.page += 1
    },
    beforeDel(){
      if(this.mixin_isEmpty(this.selectedVocList)) {
        this.showToastCaution({msg: '삭제할 항목을 선택해 주세요.'})
      }else{
        this.showConfirmCaution({msg : "선택한 항목이 삭제됩니다.\n 계속하시겠습니까?", callYes : ()=>{
            this.delVoc()
            this.closeAlert()}
          , callNo : this.closeAlert })
      }
    },
    async delVoc(){
      let sUrl = '/phone-api/cuttMng/voc/deleteVoc'

      let postParam = {
        delVocList: this.selectedVocList.map(row=>{return {VOC_ID: row.VOC_ID}})
      }

      let headParam ={
        head: {
          DATA_OBJECT : "delVocList"
        }}
      const response = await this.common_postCall(sUrl,postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.showToastSuccess({msg : '정상 처리 되었습니다.', callAfter : ()=>{
          this.getVocList(false)
          }})
      }else{
        this.showToastCaution({msg : '처리 중 문제가 발생했니다.'})
      }
    }
  },
  computed: {

  },
  watch: {

  },

  beforeDestroy() {
    this.$eventBus.$off("reloadVocList");
  },
};
</script>

<style lang="scss" scoped>

</style>
