<template>
  <div :class="isPopup && 'px-5'">
    <!-- grid top -->
    <div v-if="isPopup" class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left spacing-wrap sp-16">
        &nbsp;
      </div>
      <div class="pl-grid-top-utils">
        <compo-excel TypeProp="Download" :DataHeaderProp="HIST_TYPE == 'NEW' ? headersExcelNew : headersExcelOld"
          :DataBodyProp="HIST_FLW_ACP"
          :FileNameProp="(HIST_TYPE == 'NEW' ? '(신)AS 접수이력' : '(구)AS 접수이력') + this.$moment(new Date()).format('YYYYMMDDHHmmss')"
          :SheetNameProp="HIST_TYPE == 'NEW' ? '(신)AS 접수이력' : '(구)AS 접수이력'" />
      </div>
    </div>
    <div class="pl-cols">
      <div>
        <v-data-table class="pl-grid is-hover" :headers="HIST_TYPE == 'NEW' ? headersNew : headersOld"
          :items="HIST_FLW_ACP" fixed-header :height="isPopup ? '629px' : computedGridHeight" item-key="index"
          :items-per-page="ROW_PER_PAGE" :item-class="isActiveRow" hide-default-footer no-data-text="등록된 데이터가 없습니다."
          @click:row="rowClick" @dblclick:row="showDetail()" @mouseover:row="rowMouseover" :loading="isLoading"
          loading-text="조회중입니다." :page.sync="page" @page-count="pageCount = $event">
          <!-- AS 접수 내용 -->
          <template v-slot:item.FLW_CTS="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ item.FLW_CTS }}
                </span>
              </template>
              <span>{{ item.FLW_CTS }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
      <div v-if="!isPopup" class="is-col-fix ml-2" style="width: 30%">
        <table class="pl-tbl-detail fill-height">
          <thead>
            <tr>
              <th class="text-left">
                <div class="d-flex align-center">
                  <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                  <span class="ml-2">AS 접수 내용</span>
                  <div class="ml-auto spacing-wrap sp-4">
                    <compo-tooltip-btn TitleProp="복사하기" ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 copyPaste" TooltipPositionProp="bottom" :MinWidthProp=22 :HeightProp=22
                      @btnClick="copyCuttCn"></compo-tooltip-btn>
                    <compo-tooltip-btn :TitleProp="!isLockFlwCts ? '잠금' : '해제'" ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 lock" TooltipPositionProp="bottom" :MinWidthProp=22 :HeightProp=22
                      @btnClick="isLockFlwCts = !isLockFlwCts"></compo-tooltip-btn>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="vertical-align: top;">
                <div :style="`overflow-y: scroll; white-space: pre-wrap; height: ${computedTextareaHeight} !important;`"
                  class="pl-txt-area pl-scroll-body flex-grow-1 CompoTabHistAsFlwAcp">
                  {{ FLW_CTS }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- side panel : 상담 상세정보-->
    <!-- <v-slide-x-reverse-transition>
      <div v-if=" dialogCsDetail === true "
        style="width: 1100px"
        :style="isPopup ? 'top:0; right: 0; ' : tempCenterStyle"
        class="pl-quick-layer" >
        <div class="pl-quick-layer-header"><h1>AS 접수 상세 </h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '1040', '785', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData : {histType: HIST_TYPE, ARA_HDQ_CD: SEL_ITEM.ARA_HDQ_CD, FLW_RGS_DT: SEL_ITEM.FLW_RGS_DT, FLW_ACP_SN: SEL_ITEM.FLW_ACP_SN, FLW_DTL_SN: SEL_ITEM.FLW_DTL_SN, MGOF_CD: SEL_ITEM.MGOF_CD, HNO: SEL_ITEM.HNO}})"
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
          :DataProp="{histType: HIST_TYPE, ARA_HDQ_CD: SEL_ITEM.ARA_HDQ_CD, FLW_RGS_DT: SEL_ITEM.FLW_RGS_DT, FLW_ACP_SN: SEL_ITEM.FLW_ACP_SN, FLW_DTL_SN: SEL_ITEM.FLW_DTL_SN, MGOF_CD: SEL_ITEM.MGOF_CD, HNO: SEL_ITEM.HNO}"
          :IsPopupProp="isPopup"
        />
      </div>
    </v-slide-x-reverse-transition> -->

  </div>
</template>

<script>
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail.vue'
import CompoManagerInfo from '@/components/CompoManagerInfo.vue'
import CompoAudioWave from '@/components/CompoAudioWave.vue'

export default {
  name: 'CompoTabHistAsFlwAcp', //상담 - 이력 정보 - 바로처리 AS접수이력 탭(신,구 같이 씀)
  components: {
    CompoAsFlwAcpDetail,
    CompoManagerInfo,
    CompoAudioWave,
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    HistTypeProp: {
      type: String,
      default: null,
    },
    CustInfoProp: {
      type: Object,
      default: () => { },
    },
    SrchProp: {
      type: Object,
      default: () => { },
    },
    injectionObj: {
      type: Object,
      default: null,
    },
    detailYn: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      //고객사 ID : 바로처리 : '4'
      CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

      isPopup: false,

      // 녹취
      dialogListenAudio: false,
      //이력 유형(신,구)
      HIST_TYPE: '',
      //주택번호
      HNO: '',
      //AS 접수 이력
      HIST_FLW_ACP: [],

      //선택된 항목의 AS 접수 내용
      V_FLW_ACP_SN: '',
      FLW_CTS: '',

      //선택된 항목
      SEL_ITEM: {},
      //mouseover index
      mouseOverIndex: -1,
      //AS접수내용 잠금 여부 - click:row 시 toggle 처리
      isLockFlwCts: false,

      data: {
        PROFILE: {
          name: '김한나',
          img: require('@/assets/img/@manager_profile4.png'),
          part: '마이홈센터 - 마이홈1팀',
          rcv_date: '2024-06-20 09:30:25',
          exc_date: '2024-06-20 09:38:05',
          excuter: '김한나',
          status: '상담완료',
          statusColor: 'is-bg-green',
        },
        CUS_INFO: [
          { title: '인입번호', icon: 'cs-phone', val: '010-5303-4545' },
          { title: '휴대전화', val: '010-5303-4545' },
          { title: '전화번호1', val: '02-1234-8975' },
          { title: '전화번호2', val: '02-9876-2826' },
          { title: '전화번호3', val: '02-1234-8975' },
          { title: '이메일', val: 'Heons@hkcloud.co.kr' },
          { title: '고객 ID', icon: 'cs-black', val: 'CT169776487781660258' },
          { title: '고객명', val: '나고객' },
        ],
        CS_INFO: {
          audio: { audioSrc: require('@/assets/file_example_MP3_700KB.mp3'), },
        },
      },

      textareaValue: `공용욕실 박 타일 6장 크랙, 벽 타일 2개 크랙`,

      isLoading: false,
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 1000,
      headersNew: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'left', width: '105px' },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '130px', sortable: false },
        { text: '공종', value: 'MNTN_FLW_CS_NM', align: 'center text-left-important', width: '259px', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: 'left', width: '108px', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '87px', sortable: false },
        { text: '업체', value: 'FRM_NM', align: 'center text-left-important', width: '162px', sortable: false },
        { text: '처리결과', value: 'FLW_PGRS_SS_NM', align: 'left', width: '108px', sortable: false },
        { text: '경과일수', value: 'CLOSE_DATE', align: 'center', width: '70px', sortable: false },
      ],
      headersOld: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'left', width: '105px' },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '130px', sortable: false },
        { text: '공종', value: 'FULL_CLS_NM', align: 'center text-left-important', width: '259px', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: 'left', width: '108px', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '87px', sortable: false },
        { text: '업체', value: 'FRM_NM', align: 'center text-left-important', width: '162px', sortable: false },
        { text: '처리결과', value: 'FLW_PGRS_SS_NM', align: 'left', width: '108px', sortable: false },
        { text: '경과일수', value: 'CLOSE_DATE', align: 'center', width: '70px', sortable: false },
      ],

      headersExcelNew: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'left', width: '135px' },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '160px', sortable: false },
        { text: '공종', value: 'MNTN_FLW_CS_NM', align: 'left', width: '300px', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: 'left', width: '200px', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '100px', sortable: false },
        { text: '업체', value: 'FRM_NM', align: 'left', width: '200px', sortable: false },
        { text: '처리결과', value: 'FLW_PGRS_SS_NM', align: 'left', width: '130px', sortable: false },
        { text: '경과일수', value: 'CLOSE_DATE', align: 'center', width: '80px', sortable: false },
        { text: 'AS 접수 내용', value: 'FLW_CTS', align: 'left', width: '600px', sortable: false }
      ],
      headersExcelOld: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'left', width: '135px' },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '160px', sortable: false },
        { text: '공종', value: 'FULL_CLS_NM', align: 'left', width: '300px', sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM', align: 'left', width: '200px', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '100px', sortable: false },
        { text: '업체', value: 'FRM_NM', align: 'left', width: '200px', sortable: false },
        { text: '처리결과', value: 'FLW_PGRS_SS_NM', align: 'left', width: '130px', sortable: false },
        { text: '경과일수', value: 'CLOSE_DATE', align: 'center', width: '80px', sortable: false },
        { text: 'AS 접수 내용', value: 'FLW_CTS', align: 'left', width: '600px', sortable: false }
      ],


      // dialog
      dialogCsDetail: false,
    }
  },
  beforeDestroy() {
    this.$eventBus.$off("refreshCompoTabHistAsFlwAcpNew");
    this.$eventBus.$off("refreshCompoTabHistAsFlwAcpOld");
  },
  created() {
    

    if (this.injectionObj != null && this.injectionObj.TabProp > -1) {
      this.HistTypeProp = this.injectionObj.HistTypeProp
      this.TabProp = this.injectionObj.TabProp
      this.CustInfoProp = this.injectionObj.CustInfoProp

      this.headersNew.push({ text: 'AS 접수 내용', value: 'FLW_CTS', align: 'left', width: '400px', sortable: false })
      this.headersOld.push({ text: 'AS 접수 내용', value: 'FLW_CTS', align: 'left', width: '400px', sortable: false })

      this.isPopup = true;
    }

    this.HIST_TYPE = this.HistTypeProp;
    if (this.CustInfoProp && this.CustInfoProp.HO_ADM_NO) {
      this.HNO = this.CustInfoProp.HO_ADM_NO;
    }

    if(this.HIST_TYPE == "NEW") {
      this.$eventBus.$on("refreshCompoTabHistAsFlwAcpNew", () => {
        this.getHistAsFlwAcp();
      });
    } else {
      this.$eventBus.$on("refreshCompoTabHistAsFlwAcpOld", () => {
        this.getHistAsFlwAcp();
      });
    }
    
    this.getHistAsFlwAcp();


  },
  watch: {
    CustInfoProp() {
      const hno = this.CustInfoProp.HO_ADM_NO;
      console.log("CustInfoProp", this.CustInfoProp, hno)
      if (this.HNO != hno) {
        this.HNO = hno;
        this.getHistAsFlwAcp();
      }
    },
    TabProp() {
      console.log("TabProp", this.TabProp)
      if ((this.HIST_TYPE == "NEW" && this.TabProp == 0) || (this.HIST_TYPE == "OLD" && this.TabProp == 1)) {
        this.getHistAsFlwAcp();
      }
    },
    SrchProp() {
      if (this.SrchProp && this.SrchProp.IS_SEARCH && (this.HIST_TYPE == "NEW" && this.TabProp == 0) || (this.HIST_TYPE == "OLD" && this.TabProp == 1)) {
        this.getHistAsFlwAcp(this.SrchProp);
      }
    }
  },
  methods: {
    async getHistAsFlwAcp(srchProp = null) {
      this.HIST_FLW_ACP = [];
      this.V_FLW_ACP_SN = '';
      this.FLW_CTS = '';
      if (this.HIST_TYPE && this.HNO && this.HNO != '') {
        let response;
        let postParam = {
          HNO: this.HNO
        };
        if (srchProp && srchProp.IS_SEARCH) {
          postParam = { ...postParam, ...srchProp };
        }
        let headParam = { head: {} };

        this.isLoading = true;
        if (this.HIST_TYPE == "NEW") {
          //(신)AS 접수이력 조회
          response = await this.common_postCall("/phone-api/as/cutt/selectCotisFlwAcpNewHist", postParam, headParam);
        } else if (this.HIST_TYPE == "OLD") {
          //(구)AS 접수이력 조회
          response = await this.common_postCall("/phone-api/as/cutt/selectCotisFlwAcpOldHist", postParam, headParam);
        }
        if (response && !response.HEADER.ERROR_FLAG) {
          this.HIST_FLW_ACP = response.DATA;
        }
        this.isLoading = false;
      }
    },

    rowClick(item) {//isLockFlwCts
      console.log("rowClick", item)
      this.dialogCsDetail = false
      if (this.SEL_ITEM.ROW_NUM == item.ROW_NUM) {
        this.isLockFlwCts = !this.isLockFlwCts;
      } else {
        this.isLockFlwCts = true;
      }
      this.SEL_ITEM = item;
      this.V_FLW_ACP_SN = item.V_FLW_ACP_SN;
      this.FLW_CTS = item.FLW_CTS;
    },
    rowMouseover(event) {
      //상담 내용 잠김 상태가 아닐 시
      if (!this.isLockFlwCts) {
        const rowElement = event.target.closest('tr'); // 마우스오버한 tr 찾기
        const index = [...rowElement.parentNode.children].indexOf(rowElement); // 인덱스 계산
        if (index != this.mouseOverIndex && index >= 0) {
          this.mouseOverIndex = index;
          this.V_FLW_ACP_SN = this.HIST_FLW_ACP[this.mouseOverIndex].V_FLW_ACP_SN;
          this.FLW_CTS = this.HIST_FLW_ACP[this.mouseOverIndex].FLW_CTS;
        }
      }
    },

    showDetail() {
      //this.dialogCsDetail = true
      this.mixin_openWindow('LayoutPopup', '1040', '895', { compo_name : 'CompoAsFlwAcpDetail', callback: 'getPopData', title: 'AS 접수 상세', popData: { histType: this.HIST_TYPE, ARA_HDQ_CD: this.SEL_ITEM.ARA_HDQ_CD, FLW_RGS_DT: this.SEL_ITEM.FLW_RGS_DT, FLW_ACP_SN: this.SEL_ITEM.FLW_ACP_SN, FLW_DTL_SN: this.SEL_ITEM.FLW_DTL_SN, MGOF_CD: this.SEL_ITEM.MGOF_CD, HNO: this.SEL_ITEM.HNO } })
    },

    isActiveRow(item) {
      const activeClass = item === this.SEL_ITEM ? "active" : "";
      return activeClass;
    },

    //AS 접수 내용 복사
    copyCuttCn() {
      if (this.FLW_CTS) {
        navigator.clipboard.writeText(this.V_FLW_ACP_SN + ' ' + this.FLW_CTS);
        this.$eventBus.$emit("chatMessagePaste", 'CONTINUE', this.V_FLW_ACP_SN + ' ' + this.FLW_CTS + '\n')
        this.showToast({ msg: 'AS 접수 내용을 복사 하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' });
      }
    },

    getPopData(item) {
      this.mixin_hideDialog('CsDetail');
      this.windowPopup.close();
    },
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
    computedGridHeight() {
      let cal_height = this.computedAsCuttAddRowCnt * 30 || 0
      if (this.detailYn) {
        return `629px`
      } else {
        return `calc(100vh - ${cal_height}px - 735px)`
      }
    },
    computedTextareaHeight() {
      let cal_height = this.computedAsCuttAddRowCnt * 30 || 0
      if (this.isPopup) {
        return "100%";
      } else {
        return `calc(100vh - ${cal_height}px - 770px)`
      }

    }
  },
}
</script>

<style lang="scss" scoped></style>