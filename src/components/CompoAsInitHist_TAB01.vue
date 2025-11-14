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
                @btnClick="searchNewInitHist('next')"
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
            @btnClick="mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: 'NEW', ARA_HDQ_CD: DataProp.ARA_HDQ_CD, FLW_RGS_DT: SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: SEL_ROW.FLW_DTL_SN, MGOF_CD: DataProp.MGOF_CD}})"
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
          :DataProp="{histType: 'NEW', ARA_HDQ_CD: DataProp.ARA_HDQ_CD, FLW_RGS_DT: SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: SEL_ROW.FLW_DTL_SN, MGOF_CD: DataProp.MGOF_CD}"
        />
      </div>
    </v-slide-x-reverse-transition> -->

  </div>
</template>

<script>
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail'
export default {
  name: "CompoAsInitHist_TAB01", //(신)공용부 이력
  components: {
    CompoAsFlwAcpDetail,
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

      //(신)공용부 이력
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
        { text: '공종', value: 'MNTN_FLW_CS_NM', align: 'center text-left-important',  width: '200px', sortable: false },
        { text: '담당자', value: 'ICPR_NM',  width: '80px', sortable: false },
        { text: '민원인', value: 'CVPR_NM',  width: '80px', sortable: false },
        { text: 'AS 내용', value: 'FLW_CTS', align: 'center text-left-important',  width: '', sortable: false },
      ],
      items: [
        {
          index: 110,
          type01: '콜센터',
          type02: '240813-44-00259',
          type03: '시공하자',
          type04: '보수처리중',
          type05: '코오롱글로벌 주식회사',
          type06: '나업체',
          type07: '난간 - 누락 - 건축 - 잡철공사',
          type08: '나담당',
          type09: '관리사무소',
          type010: '[107동] 107동3층 엘리베이터 난간 설치누락(다른 층 난간 설치외어있으나 해당층만 설치되어 있지 않음)',
        },
        { index: 111, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 112, type01: '관리사무소', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 113, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 114, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 115, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 116, type01: '관리사무소', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 117, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 118, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 119, type01: '관리사무소', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 120, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 121, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 122, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 123, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 124, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 125, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 126, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 127, type01: '콜센터', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '107동 2309호와 2306호 복도 끝 창호 주변 및 천장 누수', },
        { index: 128, type01: '관리사무소', type02: '240813-44-00259', type03: '시공하자', type04: '완료신청', type05: '코오롱글로벌 주식회사', type06: '나업체', type07: '벽면 - 균열 - 건축 - 철근콘크리트 ', type08: '나담당', type09: '나고객', type010: '[107동] 107동3층 엘리베이터 난간 설치누락(다른 층 난간 설치외어있으나 해당층만 설치되어 있지 않음)', },
      ],
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
    async searchNewInitHist(next = '') {
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
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisNewInitHist", postParam, headParam);
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
      this.mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: 'NEW', ARA_HDQ_CD: this.DataProp.ARA_HDQ_CD, FLW_RGS_DT: this.SEL_ROW.FLW_RGS_DT, FLW_ACP_SN: this.SEL_ROW.FLW_ACP_SN, FLW_DTL_SN: this.SEL_ROW.FLW_DTL_SN, MGOF_CD: this.DataProp.MGOF_CD}})
    },

    getPopData(item) {
      this.mixin_hideDialog('CsDetail');
      this.windowPopup.close();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>