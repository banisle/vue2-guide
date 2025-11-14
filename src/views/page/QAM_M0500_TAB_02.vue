<template>
  <div class="pl-card-body">
    <!-- 평가 실행 현황 -->
    <div class="pl-grid-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">평가 실행 현황 </strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaExecPaperList.length }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="gridheaders"
          :DataBodyProp="qaExecPaperList"
          FileNameProp="평가 실행 현황"
          SheetNameProp="sheetDown"
        />
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s "
      :headers="gridheaders"
      :items="qaExecPaperList"
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
      <!-- 배정 -->
      <template v-slot:item.TGT_EMP_CNT="{ item }">
        <strong >{{ item.TGT_EMP_CNT }}</strong>
      </template>
      <!-- 평가완료 -->
      <template v-slot:item.COMPLETE_CNT="{ item }">
        <span class="is-txt-cyan">{{ item.COMPLETE_CNT }}</span>
      </template>
      <!-- 적용 -->
      <template v-slot:item.APPLY_CNT="{ item }">
        <span class="is-txt-cyan">{{ item.APPLY_CNT }}</span>
      </template>
    </v-data-table>

    <!-- (2차) 상담품질 통합평가 변경(24.06)_마이홈센터 -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">{{this.selectedPaper.FULL_PAPER_NM}}</strong>
      </div>
      <div class="pl-grid-top-utils">
        <v-btn class="pl-btn is-sub" :disabled="isDisabled" @click="clickApplyResultBtn('Y')">결과 공개</v-btn>
        <v-btn class="pl-btn is-sub" :disabled="isDisabled" @click="clickApplyResultBtn('N')">결과 미공개</v-btn>
        <v-btn class="pl-btn is-sub" :disabled="isDisabled" @click="clickDeleteBtn">평가삭제</v-btn>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s has-control"
      :headers="gridheaders2"
      :items="qaExecResultList"
      v-model="checkedResultList"
      show-select
      fixed-header
      item-key="ROW_NUM"
      height="400px"
      hide-default-footer
      disable-pagination
      :loading="loading02"
      loading-text="조회중입니다."
      no-data-text="등록된 데이터가 없습니다.">
      <!-- 대상자 -->
      <template v-slot:item.TGT_EMP_NM="{ item }">
        <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
      </template>

      <!-- 평가상태 -->
      <template v-slot:item.COMPLETE_YN_NM="{ item }">
        <span :class="`is-txt-${mixin_displayStatus(item.COMPLETE_YN, 'STAT_LIST2')}`">{{ item.COMPLETE_YN_NM }}</span>
      </template>
      <!-- 적용 -->
      <template v-slot:item.APPLY_YN_NM="{ item }">
        <span :class="`is-txt-${mixin_displayStatus(item.APPLY_YN, 'STAT_LIST2')}`">{{ item.APPLY_YN_NM }}</span>
      </template>
      <!-- 콜 구분 -->
      <template v-slot:item.CALL_TYPE_NM="{ item }">
        <strong :class="`is-txt-${mixin_displayStatus(item.CALL_TYPE, 'STAT_LIST2')}`">{{ item.CALL_TYPE_NM }}</strong>
      </template>
      <!-- 평가 -->
      <template v-slot:item.STD_ID="{ item }">
        <compo-tooltip-btn
          TitleProp="평가하기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 manager_test"
          TooltipPositionProp="bottom"
          @btnClick="clickExecuteBtn(item)"
          :DisabledProp=!item.STD_ID
        ></compo-tooltip-btn>
      </template>

    </v-data-table>

    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogResult === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px"
              >
        <QAM_M0500_CS_DETAIL
          @Close="closeSlide()"
          @Refresh="refreshQaExecute"
          :propsQaBaseData="propsQaBaseData"
        />
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import QAM_M0500_CS_DETAIL from '@/views/page/QAM_M0500_CS_DETAIL';

export default {
  name: 'QAM_M0500_TAB_02', //평가콜 조회
  components: {
    QAM_M0500_CS_DETAIL
  },
  props:{
    propsSearchParams:{
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // dialog
      dialogResult: false,

      // grid
      gridheaders: [
        { text: '평가년월', value: 'STD_MT', align: 'center', width: '100px',sortable: true },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '50px',sortable: true },
        { text: '평가지', value: 'PAPER_NM', align: 'left', width: '400px', sortable: true },
        { text: '배정', value: 'TGT_EMP_CNT', align: 'center', width: '110px', sortable: true },
        { text: '평가중', value: 'NOT_COMPLETE_CNT', align: 'center', width: '110px', sortable: true },
        { text: '평가완료', value: 'COMPLETE_CNT', align: 'center', width: '110px', sortable: true },
        { text: '결과 미공개', value: 'NOT_APPLY_CNT', align: 'center', width: '110px', sortable: true },
        { text: '결과 공개', value: 'APPLY_CNT', align: 'center', width: '110px', sortable: true },
        // { text: '적용율', value: 'APPLY_RATE', align: 'center', width: '110px', sortable: true },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '110px', sortable: true },
      ],

      // (2차) 상담품질 통합평가 변경(24.06)_마이홈센터
      gridheaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '70px',sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: '', width: '12%',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '12%',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: '', width: '10%', sortable: true },
        { text: '평가상태', value: 'COMPLETE_YN_NM', align: 'center', width: '10%', sortable: true },
        { text: '결과 공개', value: 'APPLY_YN_NM', align: 'center', width: '10%', sortable: true },
        { text: '총점', value: 'STD_SCORE', align: 'center', width: '10%', sortable: true },
        { text: '환산점수', value: 'TOT_SCORE', align: 'center', width: '10%', sortable: true },
        { text: '콜 구분', value: 'CALL_TYPE_NM', align: 'center', width: '10%', sortable: true },
        { text: '평가자', value: 'MGR_EMP_NM', align: '', width: '10%', sortable: true },
        { text: '소속', value: 'MGR_EMP_DEPT', align: '', width: '12%', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'center', width: '12%', sortable: true },
        { text: '평가', value: 'STD_ID', align: 'center', width: '8%', sortable: false },
      ],

      STAT_LIST: [
        { code: 'CLOSED', value: 'red'},
        { code: 'PROCEEDING', value: 'green'},
      ],

      STAT_LIST2: [
        { code: 'Y', value: 'cyan'},
        { code: 'B', value: 'org'},
      ],

      // 조회조건
      searchParams:{},

      // 평가실행 평가지 목록
      qaExecPaperList:[],
      selectedPaper: {},

      // 평가결과 목록
      qaExecResultList:[],
      checkedResultList:[],

      // 평가결과 정보
      propsQaBaseData:{},

      // 평가적용 여부
      isApply: false,

      // 버튼 비활성화 여부
      isDisabled: true,

      loading01: false,
      loading02: false,

      MESSAGE: {
        CONFIRM: {
          APPLY:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '', callYes: this.updateQaResultApplyYn, callNo: this.closeAlert, },
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '선택된 평가콜을 삭제 하시겠습니까?', callYes: this.deleteQaResult, callNo: this.closeAlert, },
        },
        ALERT:{
        },
        TOAST : {
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    setSearchParams(obj){
      this.searchParams = obj;
      this.selectQaExecutePaperList();
    },

    async selectQaExecutePaperList(obj){
      // 초기화
      this.selectedPaper = {};
      this.qaExecResultList= [];
      this.checkedResultList = [];
      this.propsQaBaseData = {};
      this.isDisabled = true;

      // let sUrl = '/phone-api/qa/selectQaExecutePaperList';
      let sUrl = '/api/biz/common/select/selectQaExecutePaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
        , MGR_EMP_NO: this.searchParams.MGR_EMP_NO
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecutePaperList'
      }};

      this.loading01 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaExecPaperList = await response.DATA.map(row=>{
          row.FULL_PAPER_NM = "(" + row.STD_MT_ORD + "차) " + row.PAPER_NM;
          return row;
        });

        this.autoSelectPaper(obj);

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading01 = false;
    },

    // 평가결과 목록 조회
    async selectQaExecuteResultList(){

      this.checkedResultList = [];
      this.propsQaBaseData = {};
      this.isDisabled = true;

      // let sUrl = '/phone-api/qa/selectQaExecuteResultList';
      let sUrl = '/api/biz/common/select/selectQaExecuteResultList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
        , MGR_EMP_NO: this.selectedPaper.MGR_EMP_NO
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecuteResultList'
      }};

      this.loading02 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaExecResultList = response.DATA.map(row=>{    
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          row.TOT_SCORE = parseInt(row.CNVT_SCORE).toFixed(2);
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading02 = false;
    },

    // 평가적용/취소 버튼 클릭 이벤트
    clickApplyResultBtn(type){

      this.isApply = type == "Y";
      
      let text = type == "Y" ? "결과 공개" : "결과 미공개"

      if(this.checkedResultList.length <= 0 ){
        this.showAlertInfo({msg: text + "할 평가콜을 선택해주세요"});
        return;
      }

      for(let i=0; i<this.checkedResultList.length; i++){
        if(this.checkedResultList[i].PROC_STAT == "CLOSED"){
          this.showAlertCaution({msg:"이미 마감된 평가입니다."});
          return;
        }

        if(this.checkedResultList[i].COMPLETE_YN != "Y" && this.isApply){
          this.showAlertInfo({msg:"평가완료 상태의 평가콜만 공개할 수 있습니다."});
          return;
        }

        if(this.checkedResultList[i].APPLY_YN != "Y" && !this.isApply){
          this.showAlertInfo({msg:"공개된 평가만 미공개할 수 있습니다."});
          return;
        }
      }

      this.MESSAGE.CONFIRM.APPLY.msg = "선택된 평가콜을 " + text + " 하시겠습니까?";
      this.showAlert(this.MESSAGE.CONFIRM.APPLY);

    },

    // 평가 적용여부 저장
    async updateQaResultApplyYn(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/updateQaResultApplyYn';
      // let sUrl = '/api/biz/common/save/updateQaResultApplyYn';

      let postParam = {
        resultList: this.checkedResultList.map(row=>{return {
            CENTER_ID: row.CENTER_ID
            , STD_ID: row.STD_ID
            , STD_MT: row.STD_MT.replaceAll("-", "")
            , STD_MT_ORD: row.STD_MT_ORD
            , PAPER_ID: row.PAPER_ID
            , APPLY_YN: this.isApply ? "Y" : "N"
          }})
      };

      let headParam = { head : {
        DATA_OBJECT: "resultList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : this.isApply ? '적용 처리되었습니다.' : '적용 취소되었습니다.'});
        this.selectQaExecutePaperList(this.selectedPaper);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
            
    },

    // 평가삭제 버튼 클릭 이벤트
    clickDeleteBtn(){
      if(this.checkedResultList.length <= 0 ){
        this.showAlertInfo({msg:"삭제할 평가콜을 선택해주세요"});
        return;
      }

      for(let i=0; i<this.checkedResultList.length; i++){
        if(this.checkedResultList[i].PROC_STAT == "CLOSED"){
          this.showAlertCaution({msg:"이미 마감된 평가입니다."});
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 평가결과 삭제
    async deleteQaResult(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaResult';
      // let sUrl = '/api/biz/common/save/updateQaResultApplyYn';

      let postParam = {
        resultList: this.checkedResultList.map(row=>{return {
            CENTER_ID: row.CENTER_ID
            , STD_ID: row.STD_ID
            , STD_MT: row.STD_MT.replaceAll("-", "")
            , STD_MT_ORD: row.STD_MT_ORD
            , PAPER_ID: row.PAPER_ID
          }})
      };

      let headParam = { head : {
        DATA_OBJECT: "resultList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg :'평가콜이 삭제되었습니다.'});
        this.selectQaExecutePaperList(this.selectedPaper);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가하기 버튼 클릭 시 평가지 팝업 오픈
    clickExecuteBtn(item){
      if(item.PROC_STAT == "CLOSED"){
        this.showAlertCaution({msg:"이미 마감된 평가입니다."});
        return;
      }

      // 평가지 팝업 변수 정보 셋팅
      this.propsQaBaseData = item;

      // 평가실행 평가지 팝업 열기
      this.dialogResult = true;
    },

    async refreshQaExecute(){
      
      // 평가지 닫기
      this.dialogResult = false;

      // 실행 평가지 재조회
      await this.selectQaExecutePaperList(this.selectedPaper);
    },

    autoSelectPaper(obj){
      if(this.mixin_isEmpty(obj)) return;
      let temp = this.qaExecPaperList.filter(e=>{return e.CENTER_ID == obj.CENTER_ID 
                                                    && e.STD_MT == obj.STD_MT
                                                    && e.STD_MT_ORD == obj.STD_MT_ORD
                                                    && e.PAPER_ID == obj.PAPER_ID});
      // 선택처리
      if(temp.length > 0) this.clickPaperRow(temp[0]);
    },

    clickPaperRow(item){
      this.selectedPaper = item;
      this.selectQaExecuteResultList();
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedPaper ? "active" : "";
      return activeClass;
    },

    showDetail(){
      this.dialogResult = true
    },
    closeSlide(){
      this.dialogResult = false
    }
  },
  mounted() {
    this.setSearchParams(this.propsSearchParams);
  },
  created() {
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", (item) => {
      this.selectQaExecuteResultList();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
    checkedResultList(){
      this.isDisabled = this.checkedResultList.length > 0 ? false : true;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>