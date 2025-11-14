<template>
  <div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-m has-control"
      :headers="gridHeaders01"
      :items="qaPlanPaperList"
      v-model="checkedQaPaperList"
      show-select
      fixed-header
      item-key="ROW_NUM"
      height="120px"
      disable-pagination
      hide-default-footer
      :item-class="isActiveRow01"
      @click:row="clickPaperRow"
      :loading="loading01"
      loading-text="조회중입니다."
      no-data-text="등록된 데이터가 없습니다.">
      <template v-slot:item.PAPER_ID = {item}>
        <compo-tooltip-btn
          TitleProp="미리보기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 board-docu"
          TooltipPositionProp="bottom"
          @btnClick="openQaPaperPreview(item)"
        ></compo-tooltip-btn>
      </template>
    </v-data-table>

    <!-- 평가자 정보 -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">평가자별 현황 </strong>
      </div>
      <div class="pl-grid-top-utils">
        <v-btn class="pl-btn is-sm is-sub" @click="openFindManager" :disabled="!isPlan">평가자 추가</v-btn>
        <v-btn class="pl-btn is-sm" @click="clickDeleteBtn02" :disabled="!isPlan">삭제</v-btn>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s has-control"
      :headers="gridHeaders02"
      :items="qaPlanMngrList"
      v-model="checkedQaMngrList"
      show-select
      fixed-header
      item-key="ROW_NUM"
      height="245px"
      disable-pagination
      hide-default-footer
      :item-class="isActiveRow02"
      :loading="loading02"
      loading-text="조회중입니다."
      no-data-text="등록된 데이터가 없습니다.">
    </v-data-table>

    <!-- dialog: 평가지 찾기 -->
    <v-dialog
      v-model="dialogFindSheet"
      v-if="dialogFindSheet"
      content-class="dialog-draggable"
      width="650"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가지 찾기"
        @hide="mixin_hideDialog('FindSheet')"
        @submit="submitDialog('FindSheet')"
      >
        <template slot="body">
          <CompoFindSheet ref="CompoFindSheet" :qaBaseData="qaPlanData" @Add="insertQaPlanPaper"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('FindSheet')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickSelectBtn01()">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 사용자 찾기 -->
    <v-dialog
        v-model="dialogFindManager"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="직원 찾기"
          @hide="[mixin_hideDialog('FindManager'), initFindMng()]"
          @submit="submitDialog('FindManager')"
      >
        <template slot="body">
          <CompoFindManager
              ref="CompoFindManager"
              :PAGING_PROP="pagingProp"
              :CHK_YN_PROP="chkYnProp"
              :SEARCH_INPUT_PROP="SRCH_USER"
              :USER_PROP="USER_PROP"
              :CUSTCO_ID_PROP="CUSTCO_ID"
              EVAL_YN_PROP="Y"
              @hideDialog="mixin_hideDialog('FindManager')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="initFindMng">닫기</v-btn>
          <v-btn class="pl-btn" v-if="chkYnProp" @click="submitDialog">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    
    <!-- 평가지 -->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogResult === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px"
              >
        <QAM_M0500_CS_DETAIL
          @Close="closeSlide()"
          :propsQaBaseData="propsQaBaseData"
          :isPreview="true"
        />
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import CompoFindUser from '@/components/CompoFindUser.vue';
import CompoFindManager from '@/components/CompoFindManager.vue';
import CompoFindSheet from '@/components/CompoFindSheet.vue';
import QAM_M0500_CS_DETAIL from '@/views/page/QAM_M0500_CS_DETAIL';

export default {
  name: 'QAM_M0400_TAB_02', //평가지/평가자 정보
  components: {
    CompoFindUser,
    CompoFindManager,
    CompoFindSheet,
    QAM_M0500_CS_DETAIL
  },
  data() {
    return {

      // 평가 대상사별 현황
      gridHeaders01: [
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '10%',sortable: false },
        { text: '평가지', value: 'PAPER_NM', align: '', width: '',sortable: true },
        { text: '평가지', value: 'PAPER_ID', align: 'center', width: '13%', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: '', width: '15%', sortable: true },
        { text: '등록일', value: 'REG_DT', align: '', width: '15%', sortable: true },
      ],

      // 평가자 정보
      gridHeaders02: [
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '10%',sortable: false },
        { text: '평가지', value: 'PAPER_NM', align: '', width: '',sortable: false },
        { text: '평가자', value: 'MGR_EMP_NM', align: '', width: '10%', sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '13%', sortable: true },
        { text: '배정', value: 'TGT_EMP_CNT', align: 'center', width: '10%', sortable: true },
        { text: '등록자', value: 'REG_EMP_NM', align: '', width: '10%', sortable: true },
        { text: '등록일', value: 'REG_DT', align: '', width: '13%', sortable: true },
      ],

      dialogResult: false,
      
      // dialog: 평가지 찾기
      dialogFindSheet: false,

      // dialog: 사용자 찾기
      dialogFindUser: false,

      dialogFindManager: false,
      SRCH_USER:{},
      chkYnProp: true, //체크박스사용여무
      pagingProp: false, //페이징여부
      USER_PROP : [],
      CUSTCO_ID : '4',

      // 평가계획 정보
      qaPlanData: {},

      // 평가계획 선택여부
      isPlan: false,

      // 평가계획 마감여부
      isClosed: false,

      // 평가계획 평가지 목록
      qaPlanPaperList: [],
      checkedQaPaperList: [],
      selectedQaPaper: {},

      // 평가계획 평가자 목록
      qaPlanMngrList: [],
      checkedQaMngrList: [],
      selectedQaMngr: {},

      loading01: false,
      loading02: false,

      MESSAGE: {
        CONFIRM: {
          DELETE01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가지를 삭제하시겠습니까?', callYes: this.deleteQaPlanPaper, callNo: this.closeAlert, },
          DELETE02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가자를 삭제하시겠습니까?', callYes: this.deleteQaPlanMngr, callNo: this.closeAlert, },
        },
        ALERT:{
          FAIL00:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 계획을 선택해주세요.' },
          FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가지를 선택해주세요.' },
          FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 계획이 마감되었습니다.'},
          FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가자가 존재하는 평가지는 삭제할 수 없습니다.' },
          FAIL04:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가자를 선택해주세요.' },
          FAIL05:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가대상자가 배정된 평가자는 삭제할 수 없습니다.' },
          FAIL06:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가지를 선택해주세요.' },
        },
        TOAST : {
          DEL_DONE01 : {  msg: '평가지가 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          DEL_DONE02 : {  msg: '평가자가 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          ADD_DONE01 : {  msg: '평가지가 추가되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          ADD_DONE02 : {  msg: '평가자가 추가되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

    }
  },
  methods: {

    // 평가계획 평가지 목록 조회
    async selectQaPlanPaperList(obj){
      // 초기화
      this.checkedQaPaperList = [];
      this.selectedQaPaper = {};
      this.qaPlanMngrList = [];

      // let sUrl = '/phone-api/qa/selectQaPlanPaperList';
      let sUrl = '/api/biz/common/select/selectQaPlanPaperList';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaPlanPaperList'
      }};

      this.loading01 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaPlanPaperList = response.DATA;

        // 선택처리
        if(!this.mixin_isEmpty(obj)){
          let temp = this.qaPlanPaperList.filter(row=>{return row.CENTER_ID == obj.CENTER_ID 
                                            && row.STD_MT == obj.STD_MT 
                                            && row.STD_MT_ORD == obj.STD_MT_ORD
                                            && row.PAPER_ID == obj.PAPER_ID});

          if(temp.length > 0){
            this.clickPaperRow(temp[0]);
          }
        }

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading01 = false;
    },

    // 평가계획 평가지별 평가자 조회
    async selectQaPlanMngrList(obj){
      // 초기화
      this.checkedQaMngrList = [];
      this.selectedQaMngr = {};

      // let sUrl = '/phone-api/qa/selectQaPlanMngrList';
      let sUrl = '/api/biz/common/select/selectQaPlanMngrList';

      let postParam = {
        CENTER_ID: this.selectedQaPaper.CENTER_ID
        , STD_MT: this.selectedQaPaper.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.selectedQaPaper.STD_MT_ORD
        , PAPER_ID: this.selectedQaPaper.PAPER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaPlanMngrList'
      }};

      this.loading02 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaPlanMngrList = response.DATA;
        this.$emit("callFunc", {type: "SET_TGT", obj: this.selectedQaPaper, mngrList: this.qaPlanMngrList, checkedList:this.checkedQaMngrList});
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading02 = false;
    },

    // 평가지 선택 버튼 클릭 이벤트
    clickSelectBtn01(){
      if(this.dialogFindSheet){
        this.$refs.CompoFindSheet.addQaPlanPaper();
      }
    },
    
    // 평가지 추가
    async insertQaPlanPaper(data){
      // 팝업 닫기
      this.mixin_hideDialog("FindSheet");
      
      let existPaperId = this.qaPlanPaperList.map(e => {return e.PAPER_ID}).join(",");
			let addPaperList = data.filter(e => {return existPaperId.indexOf(e.PAPER_ID) === -1});
      
      if(addPaperList.length <= 0) return;

      let sUrl = '/phone-api/qa/insertQaPlanPaper';
      // let sUrl = '/api/biz/common/select/insertQaPlanPaper';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , addPaperList: addPaperList.map(row=>{return {PAPER_ID: row.PAPER_ID}})
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };

      let headParam = { head : {
        DATA_OBJECT: "addPaperList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        // 평가계획 평가표 재조회
        this.$emit("callFunc", {type:"PLAN_LIST", obj:this.qaPlanData});
        this.selectQaPlanPaperList();
        this.showToast(this.MESSAGE.TOAST.ADD_DONE01);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가지 삭제 버튼 클릭 이벤트
    clickDeleteBtn01(){

      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.FAIL02);
        return;
      }

      if(this.checkedQaPaperList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.FAIL01);
        return;
      }

      for(let i=0; i<this.checkedQaPaperList.length; i++){
        if(this.checkedQaPaperList[i].MGR_EMP_CNT != "0"){
          this.showAlert(this.MESSAGE.ALERT.FAIL03);
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE01);
    },

    // 평가지 삭제
    async deleteQaPlanPaper(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaPlanPaper';

      let postParam = {
        paperList: this.checkedQaPaperList.map(row=>{return {
          CENTER_ID: row.CENTER_ID
          , STD_MT: row.STD_MT.replaceAll("-", "")
          , STD_MT_ORD: row.STD_MT_ORD
          , PAPER_ID: row.PAPER_ID
        }})
      };

      let headParam = { head : {
        DATA_OBJECT: "paperList",
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.$emit("callFunc", {type:"PLAN_LIST", obj:this.qaPlanData});
        this.selectQaPlanPaperList();
        this.showToast(this.MESSAGE.TOAST.DEL_DONE01);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가자 추가
    async insertQaPlanMngr(data){
      let existMngrId = this.qaPlanMngrList.map(e => {return e.MGR_EMP_NO}).join(",");
			let addMngrList = data.filter(e => {return existMngrId.indexOf(e.USER_ID) === -1});

      if(addMngrList.length <= 0) return;

      let sUrl = '/phone-api/qa/insertQaPlanMngr';
      // let sUrl = '/api/biz/common/select/insertQaPlanMngr';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.selectedQaPaper.PAPER_ID
        , addMngrList: addMngrList.map(row=>{return {MGR_EMP_NO: row.USER_ID}})
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };

      let headParam = { head : {
        DATA_OBJECT: "addMngrList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.selectQaPlanPaperList(this.selectedQaPaper);
        this.showToast(this.MESSAGE.TOAST.ADD_DONE02);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가자 삭제 버튼 클릭 이벤트
    clickDeleteBtn02(){
      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.FAIL02);
        return;
      }

      if(this.checkedQaMngrList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.FAIL04);
        return;
      }

      for(let i=0; i<this.checkedQaMngrList.length; i++){
        if(this.checkedQaMngrList[i].TGT_EMP_CNT != "0"){
          this.showAlert(this.MESSAGE.ALERT.FAIL05);
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE02);
    },

    // 평가계획 삭제
    async deleteQaPlanMngr(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaPlanMngr';

      let postParam = {
        mngrList: this.checkedQaMngrList.map(row=>{return {
          CENTER_ID: row.CENTER_ID
          , STD_MT: row.STD_MT.replaceAll("-", "")
          , STD_MT_ORD: row.STD_MT_ORD
          , PAPER_ID: row.PAPER_ID
          , MGR_EMP_NO: row.MGR_EMP_NO
        }})
      };

      let headParam = { head : {
        DATA_OBJECT: "mngrList",
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.selectQaPlanPaperList(this.selectedQaPaper);
        this.showToast(this.MESSAGE.TOAST.DEL_DONE02);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },


    // 평가지 추가 팝업 오픈
    openFindSheetPopup(){
      if(!this.isPlan){
        // 등록된 평가계획을 선택하지 않은 경우
        this.showAlert(this.MESSAGE.ALERT.FAIL00);
        return;
      }

      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.FAIL02);
        return;
      }

      this.mixin_showDialog('FindSheet');
    },

    // 평가자 조회
    openFindManager(){
      // 마감여부
      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.FAIL02);
        return;
      }
      
      // 평가지 선택 여부
      if(this.mixin_isEmpty(this.selectedQaPaper.PAPER_ID)){
        this.showAlert(this.MESSAGE.ALERT.FAIL06);
        return;
      }

      this.USER_PROP = this.qaPlanMngrList.map(row=>{return {USER_ID: row.MGR_EMP_NO}});

      this.mixin_showDialog('FindManager')
      this.$eventBus.$emit('findMng','');
    },

    // 평가계획 정보 셋팅
    setQaPlanData(obj){
      this.qaPlanData = JSON.parse(JSON.stringify(obj));

      this.isPlan = !(this.mixin_isEmpty(this.qaPlanData.CENTER_ID) || this.mixin_isEmpty(this.qaPlanData.STD_MT) || this.mixin_isEmpty(this.qaPlanData.STD_MT_ORD));
      this.isClosed = this.qaPlanData.PROC_STAT == "CLOSED";

      if(this.isPlan){
        this.selectQaPlanPaperList();
      }
    },

    // 평가지 미리보기
    openQaPaperPreview(item){
      if(this.dialogResult) this.dialogResult = false;

      this.$nextTick(() => {
        // 평가지 팝업 변수 정보 셋팅
        this.propsQaBaseData = item;

        // 평가실행 평가지 팝업 열기
        this.dialogResult = true;
      });
    },

    closeSlide(){
      this.dialogResult = false
    },

    // 탭 정보 초기화
    initData(){
      // 평가계획 정보 초기화
      this.qaPlanData = {};

      // 평가계획 평가지 정보 초기화
      this.qaPlanPaperList = [];
      this.checkedQaPaperList = [];
      this.selectedQaPaper = {};

      // 평가계획 평가자 정보 초기화
      this.qaPlanMngrList = [];
      this.checkedQaMngrList = [];
      this.selectedQaMngr = {};
    },

    // 평가지 클릭 이벤트
    async clickPaperRow(item){
      this.selectedQaPaper = item;

      // 평가자 조회
      await this.selectQaPlanMngrList();

      // 평가대상자 조회
      this.$emit("callFunc", {type: "SET_TGT", obj: item, mngrList: this.qaPlanMngrList, checkedList:[]});
    },

    // 평가자 클릭 이벤트
    clickMngrRow(item){
      this.selectedQaMngr = item;
      item.PROC_STAT = this.qaPlanData.PROC_STAT;

      // 평가대상자 조회
      this.$emit("callFunc", {type: "SET_TGT", obj: item, mngrList: this.qaPlanMngrList});
    },

    isActiveRow01(item) {
      const activeClass = item === this.selectedQaPaper ? "active" : "";
      return activeClass;
    },

    isActiveRow02(item) {
      const activeClass = item === this.selectedQaMngr ? "active" : "";
      return activeClass;
    },

    // 체크박스 사용 시 선택 이벤트
    submitDialog(){
      this.$refs.CompoFindManager.submitData();
    },

    // 직원 찾기 초기화 이벤트 송신
    initFindMng(){
      this.mixin_hideDialog('FindManager')
      this.$eventBus.$emit('initFindMng');
    },
  },
  mounted() {
  },
  created() {
    // 직원 정보 수신
    this.$eventBus.$on('setManagerInfo',(managerInfo)=> {
      this.insertQaPlanMngr(managerInfo);
    });
  },
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("setManagerInfo");
  },
  computed: {
  },
  watch: {
    checkedQaMngrList(){
      // 평가대상자 조회
      this.$emit("callFunc", {type: "SET_TGT", obj: this.selectedQaPaper, mngrList: this.qaPlanMngrList, checkedList:this.checkedQaMngrList});
    },
  },
};
</script>

<style lang="scss" scoped>

</style>