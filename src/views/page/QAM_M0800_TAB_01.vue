<template>
  <div>

    <!-- 평가 진행 현황 -->
    <div class="pl-grid-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">평가 진행 현황</strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaProgressPaperList.length }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="gridHeaders1"
          :DataBodyProp="qaProgressPaperList"
          FileNameProp="평가 진행 현황"
          SheetNameProp="평가 진행 현황"
        />
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover "
      :headers="gridHeaders1"
      :items="qaProgressPaperList"
      :item-class="isActiveRow"
      fixed-header
      item-key="ROW_NUM"
      height="180px"
      disable-pagination
      hide-default-footer
      @click:row="clickPaperRow"
      :loading="loading01"
      loading-text="조회중입니다."
      no-data-text="등록된 데이터가 없습니다.">

      <!-- 진행상태 -->
      <template v-slot:item.PROC_STAT_NM="{ item }">
        <span
          :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT, 'STAT_LIST')}`"
          style="width: 40px;"
          >
        {{ item.PROC_STAT_NM }}</span>
      </template>

      <!-- 마감 -->
      <template v-slot:item.CLOSE_BTN="{ item }">
        <template v-if="item.CLOSE_YN === 'Y' && item.CLOSEABLE != 'X'">
          <v-btn class="pl-btn is-sm is-esp" @click.stop="clickCloseBtn(item, 'PROCEEDING')">마감취소</v-btn>
        </template>
        <template v-else-if="item.CLOSE_YN === 'N' && item.CLOSEABLE != 'X'">
          <v-btn class="pl-btn is-sm" @click.stop="clickCloseBtn(item, 'CLOSED')">마감하기</v-btn>
        </template>
        <template v-else>
          <v-btn class="pl-btn is-sm is-sub" @click.stop="()=>{}">마감불가</v-btn>
        </template>
      </template>

      <!-- 공개 -->
      <template v-slot:item.RSLT_RLS_BTN="{ item }">
        <template v-if="item.RSLT_RLS_YN === 'N'">
          <v-btn class="pl-btn is-sm" @click.stop="clickRsltRlsBtn(item, 'Y')" :disabled="item.CLOSE_YN == 'N'">공개하기</v-btn>
        </template>
        <template v-else-if="item.RSLT_RLS_YN === 'Y'">
          <v-btn class="pl-btn is-sm is-esp" @click.stop="clickRsltRlsBtn(item, 'N')" :disabled="item.CLOSE_YN == 'N'">공개취소</v-btn>
        </template>
        <template v-else>
          <v-btn class="pl-btn is-sm is-sub" >공개불가</v-btn>
        </template>
      </template>

      <template v-slot:item.PAPER_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs" v-html="item.PAPER_NM" />
          </template>
          <div v-html="item.PAPER_NM"></div>
        </v-tooltip>
      </template>

      <!-- 이의제기 기간 -->
      <template v-slot:item.OBJT_RANGE_BTN="{ item }">
        <v-btn
          @click.stop="clickObjtRangeBtn(item)"
          :class="`pl-btn is-sm ${item.OBJT_RANGE_YN == 'Y' ? 'is-esp2' : 'is-sub'}`"
          :disabled="item.CLOSE_YN == 'N'">
          기간 설정
        </v-btn>

      </template>
    </v-data-table>

    <!-- 평가 마감 결과 -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">{{ this.selectedPaper.FULL_PAPER_NM }}</strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaProgressRstList.length }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="gridHeaders2"
          :DataBodyProp="qaProgressRstList"
          :FileNameProp="selectedPaper.EXCEL_FILE_NM"
          SheetNameProp="평가진행현황"
        />
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover "
      :headers="gridHeaders2"
      :items="qaProgressRstList"
      fixed-header
      item-key="ROW_NUM"
      height="400px"
      disable-pagination
      hide-default-footer
      :loading="loading02"
      loading-text="조회중입니다."
      no-data-text="등록된 데이터가 없습니다.">
      <!-- 대상자 -->
      <template v-slot:item.TGT_EMP_NM="{ item }">
        <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
      </template>

      <!-- 진행 상태 -->
      <template v-slot:item.OBJECTION_NM="{ item }">
        <template v-if="item.OBJECTION_NM">
          있음(<span :class="`is-txt-${mixin_displayStatus(item.OBJECTION_NM, 'STAT_LIST2')}`">{{ item.type10 }}</span>)
        </template>
      </template>

      <!-- 1회(환산) -->
      <template v-slot:item.FST_STD_SCORE="{ item }">
        <template v-if="!mixin_isEmpty(item.FST_STD_ID)">
          <v-btn class="pl-btn is-sm is-sub" style="width:50px" @click="openQaResultPaper(item, 'FIRST')">{{ item.FST_STD_SCORE }}</v-btn>
        </template>
        <template v-else>
          {{ item.FST_STD_SCORE }}
        </template>
      </template>

      <!-- 2회(환산) -->
      <template v-slot:item.SCN_STD_SCORE="{ item }">
        <template v-if="!mixin_isEmpty(item.SCN_STD_ID)">
          <v-btn class="pl-btn is-sm is-sub" style="width:50px" @click="openQaResultPaper(item, 'SECOND')">{{ item.SCN_STD_SCORE }}</v-btn>
        </template>
        <template v-else>
          {{ item.SCN_STD_SCORE }}
        </template>
      </template>

      <template v-slot:item.FST_OBJT_TEXT="{ item, index }">
        <span v-if="item.FST_OBJT_ID">{{ item.FST_OBJT_TYPE }}<span :class="`is-txt-${mixin_displayStatus(item.FST_STTS_CD_NM, 'STAT_LIST3')}`">({{ item.FST_STTS_CD_NM }})</span></span>
      </template>
      <template v-slot:item.SCN_OBJT_TEXT="{ item, index }">
        <span v-if="item.SCN_OBJT_ID">{{ item.SCN_OBJT_TYPE }}<span :class="`is-txt-${mixin_displayStatus(item.SCN_STTS_CD_NM, 'STAT_LIST3')}`">({{ item.SCN_STTS_CD_NM }})</span></span>
      </template>

    </v-data-table>

    <!-- dialog: 이의제기기간 - 기간설정  -->
    <v-dialog
      v-model="dialogSetDate"
      v-if="dialogSetDate"
      content-class=""
      width="430"
      hide-overlay>
      <compo-dialog
        @hide="mixin_hideDialog('SetDate')"
        @submit="submitDialog('SetDate')"
      >
        <template slot="header">
          <div class="d-flex align-center px-6 py-4 is-bg-white" >
            <strong style="font-size: 15px">이의제기 기간</strong>
            <v-btn
              @click="mixin_hideDialog('SetDate')"
              plain
              min-width="22"
              height="22"
              class="pl-tooltip-btn ml-auto"
          >
            <v-icon
                small
                class="pl-icon20 dialog-close-black">
            </v-icon>
          </v-btn>
          </div>
        </template>
        <template slot="body" >
          <QAM_M0800_TAB_01_DIALOG ref="QAM_M0800_TAB_01_DIALOG" @close="mixin_hideDialog('SetDate')" @refresh="selectQaProgressPaperList" :propsData="propsData"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SetDate')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickObjtRangeSaveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import QAM_M0800_TAB_01_DIALOG from '@/views/page/QAM_M0800_TAB_01_DIALOG'

export default {
  name: 'QAM_M0800_TAB_01',//평가 진행 현황
  components: {
    QAM_M0800_TAB_01_DIALOG,
  },
  props:{
    propsSearchParams:{
      type: Object,
      default: {}
    }
  },
  data() {
    return {

      // 평가 진행 현황 grid
      gridHeaders1: [
        { text: '평가년월', value: 'STD_MT', align: 'center', width: '75px',sortable: true },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '50px',sortable: true },
        { text: '평가지', value: 'PAPER_NM', align: 'left', width: '', sortable: true },
        { text: '평가기간', value: 'STD_DATE', align: 'center', width: '160px', sortable: true },
        { text: '대상자', value: 'TGT_EMP_CNT', align: 'center', width: '70px', sortable: true },
        { text: '평가중', value: 'NOT_COMPLETE_CNT', align: 'center', width: '70px', sortable: true },
        { text: '평가완료', value: 'COMPLETE_CNT', align: 'center', width: '70px', sortable: true },
        { text: '이의제기', value: 'OBJT_CNT', align: 'center', width: '70px', sortable: true },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '75px', sortable: true },
        { text: '마감일시', value: 'CLOS_DATE', align: 'center', width: '135px', sortable: true },
        { text: '처리자', value: 'UPD_EMP_NM', align: 'center', width: '60px', sortable: true },
        { text: '마감', value: 'CLOSE_BTN', align: 'center', width: '75px', sortable: false },
        { text: '공개', value: 'RSLT_RLS_BTN', align: 'center', width: '75px', sortable: false },
        { text: '공개일자', value: 'RSLT_RLS_BGNG_DT', align: 'center', width: '80px', sortable: true },
        { text: '이의제기기간', value: 'OBJT_RANGE_BTN', align: 'center', width: '90px', sortable: false },
        { text: '이의제기 마감일', value: 'OBJT_END_DT1', align: 'center', width: '120px', sortable: true },
        { text: '재결요청 마감일', value: 'OBJT_END_DT2', align: 'center', width: '120px', sortable: true },
      ],

      // 평가결과
      gridHeaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: 'left', width: '120px',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: 'left', width: '120px',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: 'left', width: '100px', sortable: true },
        { text: '1회(환산)', value: 'FST_STD_SCORE', align: 'center', width: '100px', sortable: true },
        { text: '1회 이의제기', value: 'FST_OBJT_TEXT', align: 'center', width: '100px', sortable: true },
        { text: '2회(환산)', value: 'SCN_STD_SCORE', align: 'center', width: '100px', sortable: true },
        { text: '2회 이의제기', value: 'SCN_OBJT_TEXT', align: 'center', width: '100px', sortable: true },
        { text: '평균(환산)', value: 'AVG_SCORE', align: 'center', width: '100px', sortable: true },
        { text: '평가상태', value: 'TOT_COMPLETE_YN_NM', align: 'center', width: '90px', sortable: true },
        { text: '결과공개', value: 'TOT_APPLY_YN_NM', align: 'center', width: '90px', sortable: true },
        { text: '평가자', value: 'MGR_EMP_NM', align: 'center', width: '90px', sortable: true },
      ],

      STAT_LIST: [
        { code: 'CLOSED', value: 'red'},
        { code: 'PROCEEDING', value: 'green'},
      ],

      STAT_LIST2: [
        { code: '진행', value: 'cyan'},
        { code: '종결', value: 'green'},
      ],

      // 상태 컬러
      STAT_LIST3: [
        { code: '종결', value: 'green'},
        { code: '요청', value: 'cyan'},
        { code: '취소', value: 'red'},
        { code: '신청', value: 'org'},
      ],

      // 이의제기 상세
      dialogSetDate: false,

      qaProgressPaperList:[],
      selectedPaper:{},
      qaProgressRstList:[],

      // 평가결과 정보
      propsQaBaseData:{},
      closeData: {},
      rsltRlsData: {},

      propsData:{},

      loading01: false,
      loading02: false,

      MESSAGE: {
        CONFIRM: {
          CLOSE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '', callYes: this.updateQaPlanProcStat, callNo: this.closeAlert, },
          RSLT_RLS:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '', callYes: this.updateQaPlanRsltRlsYn, callNo: this.closeAlert, },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    async selectQaProgressPaperList(){
      // 초기화
      this.selectedPaper = {};
      this.qaProgressRstList = [];
      this.dialogResult = false;
      this.closeData = {};
      this.rsltRlsData = {};

      // let sUrl = '/phone-api/qa/selectQaProgressPaperList';
      let sUrl = '/api/biz/common/select/selectQaProgressPaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'selectQaProgressPaperList'
      }};

      this.loading01 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaProgressPaperList = response.DATA.map(row=>{
          row.STD_DATE = row.STD_ST_DD + " ~ " + row.STD_EN_DD;
          row.FULL_PAPER_NM = "(" + row.STD_MT_ORD + "차) " +  row.PAPER_NM;
          row.EXCEL_FILE_NM = row.STD_MT + " (" + row.STD_MT_ORD + "차) " +  row.PAPER_NM + "_" + row.CENTER_NM;
          
          row.OBJT_END_DT1 =  this.mixin_isEmpty(row.OBJT_END_DT_1CYCL) ? "" : this.$moment(row.OBJT_END_DT_1CYCL, 'YYYYMMDDHHmmss').format("YYYY-MM-DD HH:mm");
          row.OBJT_END_DT2 =  this.mixin_isEmpty(row.OBJT_END_DT_2CYCL) ? "" :this.$moment(row.OBJT_END_DT_2CYCL, 'YYYYMMDDHHmmss').format("YYYY-MM-DD HH:mm");

          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading01 = false;
    },

    async selectQaProgressRstList(){
      // 초기화
      this.propsQaBaseData = {};
      this.dialogResult = false;

      // let sUrl = '/phone-api/qa/selectQaProgressRstList';
      let sUrl = '/api/biz/common/select/selectQaProgressRstList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'selectQaProgressRstList'
      }};

      this.loading02 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaProgressRstList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          row.FST_STD_SCORE = this.mixin_isEmpty(row.FST_STD_SCORE) ? '-' : parseFloat(row.FST_STD_SCORE).toFixed(2);
          row.SCN_STD_SCORE = this.mixin_isEmpty(row.SCN_STD_SCORE) ? '-' : parseFloat(row.SCN_STD_SCORE).toFixed(2);
          row.AVG_SCORE = this.mixin_isEmpty(row.AVG_SCORE) ? '-' : parseFloat(row.AVG_SCORE).toFixed(2);

          // 이의제기 표시
          row.FST_OBJT_TEXT = row.FST_OBJT_TYPE+"("+row.FST_STTS_CD_NM+")";
          row.SCN_OBJT_TEXT = row.SCN_OBJT_TYPE+"("+row.SCN_STTS_CD_NM+")";

          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading02 = false;
    },

    // 마감수정 버튼 클릭 이벤트
    clickCloseBtn(item, type){
      this.closeData = item;
      this.closeData.UPD_PROC_STAT = type;

      if(type == "CLOSED" && item.CLOSEABLE == "N"){
        this.showAlertInfo({msg:"진행중인 평가가 존재합니다."});
        return false;
      }

      this.MESSAGE.CONFIRM.CLOSE.msg = (type == "CLOSED" ? "마감" : "마감취소") + " 처리 하시겠습니까?";
      this.showAlert(this.MESSAGE.CONFIRM.CLOSE);
    },

    // 평가계획 진행상태 수정
    async updateQaPlanProcStat(){
      this.closeAlert();

      // let sUrl = '/phone-api/qa/updateQaPlanProcStat';
      let sUrl = '/api/biz/common/update/updateQaPlanProcStat';

      let postParam = {
        CENTER_ID: this.closeData.CENTER_ID
        , STD_MT: this.closeData.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.closeData.STD_MT_ORD
        , PROC_STAT: this.closeData.UPD_PROC_STAT
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'updateQaPlanProcStat'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg:(this.closeData.UPD_PROC_STAT == "CLOSED" ? "마감" : "마감취소") + " 처리 되었습니다."});
        this.selectQaProgressPaperList();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 공개수정 버튼 클릭 이벤트
    clickRsltRlsBtn(item, type){
      // if(item.CLOSE_YN == "Y"){
      //   this.showAlertCaution({msg: "평가가 마감되어 공개취소가 불가합니다."});
      //   return;
      // }

      this.rsltRlsData = item;
      this.rsltRlsData.UPD_RSLT_RLS_YN = type;

      this.MESSAGE.CONFIRM.RSLT_RLS.msg = (type == "Y" ? "공개" : "공개취소") + " 처리 하시겠습니까?";
      this.showAlert(this.MESSAGE.CONFIRM.RSLT_RLS);
    },

    async updateQaPlanRsltRlsYn(){
      this.closeAlert();

      // let sUrl = '/phone-api/qa/updateQaPlanRsltRlsYn';
      let sUrl = '/api/biz/common/update/updateQaPlanRsltRlsYn';

      let postParam = {
        CENTER_ID: this.rsltRlsData.CENTER_ID
        , STD_MT: this.rsltRlsData.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.rsltRlsData.STD_MT_ORD
        , RSLT_RLS_YN: this.rsltRlsData.UPD_RSLT_RLS_YN
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'updateQaPlanRsltRlsYn'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg:(this.closeData.UPD_PROC_STAT == "Y" ? "공개" : "공개취소") + " 처리 되었습니다."});
        this.selectQaProgressPaperList();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가결과 팝업 열기
    openQaResultPaper(item, type){
      if(type == "FIRST") this.mixin_showQaResult(item.FST_STD_ID, item.CENTER_ID);
      else this.mixin_showQaResult(item.SCN_STD_ID, item.CENTER_ID);
    },

    // 기간설정
    clickObjtRangeBtn(item){

      this.propsData = {
        CENTER_ID: item.CENTER_ID
        , PAPER_NM: item.PAPER_NM
        , STD_MT: item.STD_MT
        , STD_MT_ORD: item.STD_MT_ORD
        , OBJT_END_DT_1CYCL: item.OBJT_END_DT_1CYCL
        , OBJT_END_DT_2CYCL: item.OBJT_END_DT_2CYCL
      }

      this.mixin_showDialog('SetDate');
    },

    clickObjtRangeSaveBtn(){
      if(this.$refs.QAM_M0800_TAB_01_DIALOG) this.$refs.QAM_M0800_TAB_01_DIALOG.clickSaveBtn();
    },

    setSearchParams(obj){
      this.searchParams = obj;
      this.selectQaProgressPaperList();
    },

    clickPaperRow(item){
      this.selectedPaper = item;
      console.log(item);
      this.selectQaProgressRstList();
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedPaper ? "active" : "";
      return activeClass;
    },
  },
  mounted() {
    this.setSearchParams(this.propsSearchParams);
  },
  created() {
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", (item) => {
      this.selectQaProgressRstList();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {

  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>