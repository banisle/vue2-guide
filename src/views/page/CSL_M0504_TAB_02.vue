<template>
  <div class="pl-card-body">
    <CSL_M0504_SRCH
      :DataProp="{HIST_TYPE: HIST_TYPE}"
      @search="search"
    />
    <div class="pl-grid-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">미대상 목록 </strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totalCount }})</em> 건</span>
        <v-btn class="pl-btn is-sub is-sm" @click="btnAssignToMe">나에게 분배하기</v-btn>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="headersExcel"
          :DataBodyProp="OLD_UNTARGET_LIST"
          :FileNameProp="'(구)미대상조회-'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
          :SheetNameProp="'(구)미대상조회'"
        />
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      v-model="chkSelected"
      class="pl-grid is-mt-s is-hover has-control"
      show-select
      :headers="headers2"
      :items="OLD_UNTARGET_LIST"
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
      <template v-slot:item.MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.MGOF_NM }}</span>
          </template>
          <span>{{ item.MGOF_NM }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.MNTN_RPSN_CSTP_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.MNTN_RPSN_CSTP_NM }}</span>
          </template>
          <span>{{ item.MNTN_RPSN_CSTP_NM }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.TDN_RSN="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.TDN_RSN }}</span>
          </template>
          <span>{{ item.TDN_RSN }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.NOTICE_YN="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.NOTICE_YN }}</span>
          </template>
          <span>{{ item.NOTICE_YN }}</span>
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
        보기 {{ mixin_getPagePeriod(OLD_UNTARGET_LIST, page) }} / {{ totalCount }}
        <!-- <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
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
import CSL_M0504_SRCH from '@/views/page/CSL_M0504_SRCH.vue'
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail.vue'

export default {
  name: 'CSL_M0504_TAB_02', //(구)미대상조회
  components: {
    CSL_M0504_SRCH,
    CompoAsFlwAcpDetail
  },
  data() {
    return {
      // dialog
      dialogCsDetail: false,

      HIST_TYPE: 'OLD',

      searchCondition: {},
      OLD_UNTARGET_LIST: [],
      SEL_ROW: {},
      chkSelected: [],

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
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '120px',sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: '', width: '4.5%',sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: '', width: '8%', sortable: false },
        { text: '단지', value: 'MGOF_NM', align: '', sortable: false },
        { text: '상담번호', value: 'FLW_ACP_SN', align: '', width: '6%', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: '', width: '6%', sortable: false },
        { text: '상담사', value: 'EMP_NM', align: '', width: '4%', sortable: false },
        { text: '접수일자', value: 'FLW_RGS_DT_SHOW', align: '', width: '5.5%', sortable: false },
        { text: '시설구분', value: 'LCLS_NM', align: '', width: '4.5%', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: '', width: '7%', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: '', width: '4.5%', sortable: false },
        { text: '공간', value: 'SPCE_NM', align: '', width: '6%', sortable: false },
        { text: '대표공종', value: 'MNTN_RPSN_CSTP_NM', align: '', width: '8%', sortable: false },
        { text: '반려사유', value: 'TDN_RSN', align: '', width: '10%', sortable: false },
        { text: '통보여부', value: 'NOTICE_YN', align: '', width: '4.5%', sortable: false },
      ],

      headersExcel: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70',sortable: false },
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '160',sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: 'left', width: '130',sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '180', sortable: false },
        { text: '단지', value: 'MGOF_NM', align: 'left', width: '250', sortable: false },
        { text: '상담번호', value: 'FLW_ACP_SN', align: '', width: '150', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'left', width: '100', sortable: false },
        { text: '상담사', value: 'EMP_NM', align: 'left', width: '100', sortable: false },
        { text: '접수일자', value: 'FLW_RGS_DT_SHOW', align: 'left', width: '120', sortable: false },
        { text: '시설구분', value: 'LCLS_NM', align: 'left', width: '120', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: 'left', width: '150', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '150', sortable: false },
        { text: '공간', value: 'SPCE_NM', align: '', width: '150', sortable: false },
        { text: '대표공종', value: 'MNTN_RPSN_CSTP_NM', align: '', width: '250', sortable: false },
        { text: '반려사유', value: 'TDN_RSN', align: 'left', width: '400', sortable: false },
        { text: '통보여부', value: 'NOTICE_YN', align: 'left', width: '120', sortable: false },
      ],
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
      this.searchOldUntargetList();
    },

    //페이지 클릭
    handlePage( p ) {
      this.pagination.page = p;
      this.searchOldUntargetList("next");
    },
    
    //(구)미대상 조회
    async searchOldUntargetList(next = '') {
      console.log("(신)미대상 조회 search", this.searchCondition)
      this.chkSelected = [];
      //다음버튼 클릭 유무
      if (next == 'next'){
        this.OLD_UNTARGET_LIST = [];
      } else {
        this.OLD_UNTARGET_LIST = [];
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
      const response = await this.common_postCall("/phone-api/as/common/searchUntargetList", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.OLD_UNTARGET_LIST =  [...this.OLD_UNTARGET_LIST, ...response.DATA];
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

    //나에게 분배하기 버튼 
    btnAssignToMe() {
      if(this.chkSelected.length == 0) {
        this.showAlertInfo({msg: "미대상 목록을 체크 해주세요."})
        return
      }

      this.showConfirmInfo({
        msg : this.chkSelected.length + '건의 미대상 목록을 자신에게 분배하시겠습니까?', 
        callYes: ()=>{
          this.assignToMe();
        },
        callNo: this.closeAlert
      })
    },

    //나에게 분배하기
    async assignToMe() {
      let flwDtlFullSnList = "";
      this.chkSelected.map((item, index) => {
        if(index > 0) {
          flwDtlFullSnList += ",";
        }
        flwDtlFullSnList += item.FLW_DTL_FULL_SN
      }) 
      const headParam = {head: { }};
      const postParam = {
        FLW_DTL_FULL_SN_LIST: flwDtlFullSnList
      }
      console.log("assignToMe postParam : ", postParam)
      this.isLoading = true;
      const response = await this.common_postCall("/phone-api/as/common/updateAssignToMe", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg: "정상 처리되었습니다."})
				this.searchOldUntargetList();
      }
      this.isLoading = false;
    }
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