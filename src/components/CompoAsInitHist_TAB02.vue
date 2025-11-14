<template>
  <div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="INIT_HIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="480px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      @page-count="pageCount = $event"
      @click:row="rowClick"
      @dblclick:row="showDetail()"
      :loading="isLoading"
      loading-text="조회중입니다."
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
        보기 {{ mixin_getPagePeriod(INIT_HIST, page) }} / {{ INIT_HIST.length }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchOldInitHist('next')"
        ></compo-tooltip-btn>
      </span>
    </div>

    <!-- side panel : 상담 상세정보-->
    <!-- <v-slide-x-reverse-transition>
      <div v-if=" dialogCsDetail === true "
        style="width: 1040px"
        :style="tempCenterStyle"
        class="pl-quick-layer" >
        <div class="pl-quick-layer-header"><h1>AS 접수 상세 </h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: 'OLD', ARA_HDQ_CD: DataProp.ARA_HDQ_CD, FLW_RGS_DT: SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: SEL_ROW.FLW_DTL_SN, MGOF_CD: DataProp.MGOF_CD}})"
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
          :DataProp="{histType: 'OLD', ARA_HDQ_CD: DataProp.ARA_HDQ_CD, FLW_RGS_DT: SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: SEL_ROW.FLW_DTL_SN, MGOF_CD: DataProp.MGOF_CD}"
        />
      </div>
    </v-slide-x-reverse-transition> -->
  </div>
</template>

<script>
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail'
export default {
  name: "CompoAsInitHist_TAB02", //(구)공용부 이력
  components: {
    CompoAsFlwAcpDetail
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
      // dialog
      dialogCsDetail: false,

      //(구)공용부 이력
      INIT_HIST: [],
      SEL_ROW: {},

      isLoading: false,

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

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '접수채널', value: 'CHNL_NM',  width: '80px', sortable: false },
        { text: 'AS 접수번호', value: 'ACP_SN', align: 'center', width: '120px', sortable: false },
        { text: 'AS 구분', value: 'DS_NM', align: 'center', width: '80px',sortable: false },
        { text: '처리 상태', value: 'PGRS_SS_NM',  width: '80px', sortable: false },
        { text: '업체명', value: 'FRM_NM', align: 'center text-left-important', width: '150px' , sortable: false},
        { text: '업체 담당', value: 'PRCR', align: '', width: '70px', sortable: false },
        { text: '소공종', value: 'DCLS_NM', align: 'center text-left-important',  width: '200px', sortable: false },
        { text: '담당자', value: 'ICPR_NM',  width: '80px', sortable: false },
        { text: '민원인', value: 'CVPR_NM',  width: '80px', sortable: false },
        { text: 'AS 내용', value: 'FLW_CTS', align: 'center text-left-important',  width: '', sortable: false },
      ],
      items: [

      ]
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
  methods: {
    async searchOldInitHist(next = '') {
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.INIT_HIST = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      const postParam = {
        ARA_HDQ_CD : this.DataProp.ARA_HDQ_CD,
        MGOF_CD: this.DataProp.MGOF_CD,
        BLDG_NO : this.DataProp.BLDG_NO,
        FLW_CTS : this.DataProp.FLW_CTS
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsFlwAcpMapper_Cotis',
        "ROW_CNT" : this.pagination.rowsPerPage,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisOldInitHist", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.INIT_HIST = response.DATA;

        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        this.pagination.page += 1;
      }
      this.isLoading = false;
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    showDetail(){
      //this.dialogCsDetail = true
      this.mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: 'OLD', ARA_HDQ_CD: this.DataProp.ARA_HDQ_CD, FLW_RGS_DT: this.SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: this.SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: this.SEL_ROW.FLW_DTL_SN, MGOF_CD: this.DataProp.MGOF_CD}})
    },
  },
};
</script>

<style lang="scss" scoped>

</style>