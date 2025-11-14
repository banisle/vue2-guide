<template>
  <div class="pl-card-body">
    <CSL_M0503_SRCH
      :DataProp="{HIST_TYPE: HIST_TYPE}"
      @search="search"
    />
    <div class="pl-grid-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">AS 접수 목록</strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totalCount }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="excelDown"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers2"
      :items="NEW_AS_HIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="calc(-501px + 100vh)"
      @click:row="rowClick"
      @dblclick:row="showDetail()"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      :page.sync="page"
      >
      <template v-slot:item.ACP_CHNL_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.ACP_CHNL_NM }}</span>
          </template>
          <span>{{ item.ACP_CHNL_NM }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.MNTN_FLW_CS_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.MNTN_FLW_CS_NM }}</span>
          </template>
          <span>{{ item.MNTN_FLW_CS_NM }}</span>
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
        @input="handlePage"
        :total-visible="10">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(NEW_AS_HIST, page) }} / {{ totalCount }}
        <!-- <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchNewAsHist('next')"
        ></compo-tooltip-btn> -->
      </span>
    </div>

    <!-- side panel : 상담 상세정보-->
    <!-- <v-slide-x-reverse-transition>
      <div v-if=" dialogCsDetail === true "
        style="width: 1100px"
        :style="tempCenterStyle"
        class="pl-quick-layer" >
        <div class="pl-quick-layer-header"><h1>AS 접수 상세 </h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: HIST_TYPE, ARA_HDQ_CD: SEL_ROW.ARA_HDQ_CD, FLW_RGS_DT: SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: SEL_ROW.FLW_DTL_SN, MGOF_CD: SEL_ROW.MGOF_CD}})"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogCsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <CompoAsFlwAcpDetail
          :DataProp="{histType: HIST_TYPE, ARA_HDQ_CD: SEL_ROW.ARA_HDQ_CD, FLW_RGS_DT: SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: SEL_ROW.FLW_DTL_SN, MGOF_CD: SEL_ROW.MGOF_CD}"
        />
      </div>
    </v-slide-x-reverse-transition> -->

  </div>
</template>

<script>
import CSL_M0503_SRCH from '@/views/page/CSL_M0503_SRCH.vue'
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail.vue'

export default {
  name: 'CSL_M0503_TAB_01', //(신)AS 이력조회
  components: {
    CSL_M0503_SRCH,
    CompoAsFlwAcpDetail
  },
  data() {
    return {
      // dialog
      dialogCsDetail: false,

      HIST_TYPE: "NEW",

      searchCondition: {},
      NEW_AS_HIST: [],
      SEL_ROW: {},

      isLoading: false,

      totalCount: 0,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      ROW_PER_PAGE: 15, //페이징 없이 전체 화면 뿌릴때
      pagination: {
        page: 1,
        rowsPerPage: 500,
      },
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      headers2: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px',sortable: false },
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '9%',sortable: true },
        { text: '대상여부', value: 'TARGET_YN', align: '', width: '6%',sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: '', width: '8%', sortable: false },
        { text: '경과기간', value: 'RPR_XPC_OV_DAY_FLAW', align: '', width: '8%', sortable: false },
        { text: '상담번호', value: 'CNSLT_SEQ_NO', align: '', width: '6%', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: '', width: '8%', sortable: false },
        { text: '접수자', value: 'FLW_RCPR', align: '', width: '8%', sortable: false },
        { text: '접수일자', value: 'FLW_RGS_DT', align: '', width: '6%', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: '', width: '6%', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: '', width: '6%', sortable: false },
        { text: '공간', value: 'SPCE_NM', align: '', width: '6%', sortable: false },
        { text: '공종', value: 'MNTN_FLW_CS_NM', align: '', width: '', sortable: false },
      ],
      
      //엑셀 다운로드 관련
      table_head: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px',sortable: false },
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '160',sortable: true },
        { text: '대상여부', value: 'TARGET_YN', align: 'center', width: '80',sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: 'left', width: '130', sortable: false },
        { text: '경과기간', value: 'RPR_XPC_OV_DAY_FLAW', align: 'left', width: '120', sortable: false },
        { text: '상담번호', value: 'CNSLT_SEQ_NO', align: 'left', width: '120', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'left', width: '120', sortable: false },
        { text: '접수자', value: 'FLW_RCPR', align: 'left', width: '180', sortable: false },
        { text: '접수일자', value: 'FLW_RGS_DT', align: 'center', width: '120', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: 'left', width: '200', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '100', sortable: false },
        { text: '공간', value: 'SPCE_NM', align: 'left', width: '150', sortable: false },
        { text: '공종', value: 'MNTN_FLW_CS_NM', align: 'left', width: '400', sortable: false },
        { text: '감독사유', value: 'ARA_HDQ_RSN', align: 'left', width: '100', sortable: false },
        { text: 'AS내용', value: 'FLW_CTS', align: 'left', width: '400', sortable: false },
      ],
      table_body: [],
      file_name: '',
      sheet_name: "(신)AS 이력",
      header_color: "EFF5FC"
    }
  },
  methods: {
    rowClick(item) {
      this.SEL_ROW = item;
    },
    showDetail(){
      // this.dialogCsDetail = true
      this.mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: this.HIST_TYPE, HNO: this.SEL_ROW.HNO, ARA_HDQ_CD: this.SEL_ROW.ARA_HDQ_CD, FLW_RGS_DT: this.SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: this.SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: this.SEL_ROW.FLW_DTL_SN, MGOF_CD: this.SEL_ROW.MGOF_CD}})
    },

    async search(searchCondition = '') {
      this.searchCondition = searchCondition;
      this.searchNewAsHist();
    },

    //페이지 클릭
    handlePage( p ) {
      this.pagination.page = p;
      this.searchNewAsHist("next");
    },

    //(신)AS 이력 조회
    async searchNewAsHist(next = '') {
      console.log("(신)AS 이력 조회 search", this.searchCondition)
      //다음버튼 클릭 유무
      if (next == 'next'){
        this.NEW_AS_HIST = [];
      } else {
        this.NEW_AS_HIST = [];
        this.totalCount = 0;
        this.pageCount = 0;
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      const postParam = this.searchCondition
      const headParam = {head: {
        "ROW_CNT" : this.ROW_PER_PAGE,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/phone-api/as/common/searchCotisAsHist", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.NEW_AS_HIST =  [...this.NEW_AS_HIST, ...response.DATA];
        this.totalCount = response.HEADER.TOT_COUNT;

        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //총 페이지 수 = Math.ceil(전체 컨텐츠 개수 / 한 페이지에 보여주고자 하는 컨텐츠의 개수)
        this.pageCount = Math.ceil((this.totalCount + this.ROW_PER_PAGE) / this.ROW_PER_PAGE) - 1;

        // this.pagination.page += 1;
      }
      this.isLoading = false;
    },


    // 엑셀형식으로 다운로드 한다 
    async excelDown() {   

      let headParam = {head: {}};

      let postParam = this.searchCondition;

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      const response = await this.common_postCall("/phone-api/as/common/searchCotisAsHist", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        const table_b = response.DATA;
        this.sheet_name = "(신)AS 이력";//mixin_common_exportExcel_all 에서 초기화 하여 다시 선언.
        const table_h = this.table_head;

        this.file_name = this.sheet_name + "-" + this.$moment(new Date()).format('YYYYMMDDHHmmss');
        const isMulti = false;


        // 헤더에 없는 body filter
        let tempBodyObj = [];
        tempBodyObj = table_b.map(row=>{
          let tempBodyJson = {};
          if(isMulti){
            let headerKey = table_h[table_h.length-1].map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }else{
          let headerKey = table_h.map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }
          return tempBodyJson
        });

        this.table_body = tempBodyObj;

        this.mixin_common_exportExcel_all(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
      }
    },
    
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>