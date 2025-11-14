<template>
  <!-- 평가 대상자 -->
  <div class="is-col-fix pl-card-body" style="width: 50%">
    <!-- grid top -->
    <div class="pl-grid-top pt-2">
      <div class="pl-grid-top-left">
        <h2 class="pl-subtit">평가 대상자</h2>
      </div>
      <div class="pl-grid-top-utils">
        <v-btn class="pl-btn is-sub" @click="clickDivBtn" :disabled="!isDiv">일괄배정</v-btn>
        <v-btn class="pl-btn is-sub" @click="clickAddBtn" :disabled="!isMngr">개별추가</v-btn>
        <v-btn class="pl-btn is-sub" @click="clickDeleteBtn" :disabled="!isMngr">삭제</v-btn>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
        class="pl-grid is-mt-s has-control"
        :headers="gridheaders"
        :items="qaPlanTgtList"
        v-model="checkedQaPlanTgtList"
        show-select
        fixed-header
        item-key="ROW_NUM"
        height="calc(-262px + 100vh)"
        hide-default-footer
        disable-pagination
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
      <template v-slot:item.TGT_EMP_NM="{ item }">
        <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
      </template>
    </v-data-table>

    <v-dialog
        v-model="dialogFindCusl"
        v-if="dialogFindCusl"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="상담원 찾기"
          @hide="initFindMng"
          @submit="submitDialog('FindCusl')"
      >
        <template slot="body">
          <CompoFindCusl
              ref="CompoFindCusl"
              :PAGING_PROP="pagingProp"
              :CHK_YN_PROP="chkYnProp"
              :USER_PROP="USER_PROP"
              :CUSTCO_ID_PROP="CUSTCO_ID"
              :EVAL_TRGT_PROP="true"
              :EVAL_YM_PROP="EVAL_YM_PROP"
              @hideDialog="mixin_hideDialog('FindCusl')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
          <!-- EVAL_TRGT_PROP(String)       : 평가대상여부 -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="initFindMng">닫기</v-btn>
          <v-btn class="pl-btn" v-if="chkYnProp" @click="submitDialog">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 일괄 배정 -->
    <v-dialog
        v-model="dialogAlleAssign"
        v-if="dialogAlleAssign"
        content-class="dialog-draggable is-lg"
        hide-overlay
        width="1400px">
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="평가 대상자 일괄 배정"
          @hide="mixin_hideDialog('AlleAssign')"
          @submit="submitDialog('AlleAssign')"
      >
        <template slot="body">
          <QAM_M0400_DIALOG ref="QAM_M0400_DIALOG" :propsQaPlanData="qaPlanData" :propsQaMngrList="propsQaMngrList" @select="updateTgtInfo"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('AlleAssign')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickSaveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoFindCusl from "@/components/CompoFindCusl.vue";
import QAM_M0400_DIALOG from '@/views/page/QAM_M0400_DIALOG'

export default {
  name: "QAM_M0400_TARGET", // 평가 계획 관리
  components: {
    CompoFindCusl,
    QAM_M0400_DIALOG,
  },
  data() {
    return {

      // grid
      gridheaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '센터', value: 'LHCS_CENTER_NM', align: 'left', width: '20%',sortable: true },
        { text: '소속', value: 'LHCS_DEPT_NM', align: 'left', width: '20%',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: 'left', width: '15%', sortable: true },
        { text: '사번', value: 'TGT_EMP_NO', align: 'left', width: '15%', sortable: true },
        { text: '배정자', value: 'MGR_EMP_NM', align: 'left', width: '15%', sortable: true },
        { text: '배정일', value: 'REG_DT', align: 'left', width: '15%', sortable: true },
      ],

      // dialog: 일괄배정
      dialogAlleAssign: false,
      // dialog: 직원찾기
      dialogFindCusl: false,

      chkYnProp: false, //체크박스사용여무
      pagingProp: false, //페이징여부
      USER_PROP : [],
      CUSTCO_ID : '1',
      EVAL_YM_PROP : this.$moment(new Date()).format('YYYYMM'),
      // 평가계획 평가지 정보
      qaPlanData:{},

      // 평가자 선택 여부
      isMngr: false,
      checkedQaMngrList: [],

      // 마감여부
      isClosed: false,

      // 평가지 선택 여부
      isPaper: false,

      // 일괄배정 가능여부
      isDiv: false,

      // 평가대상자 목록
      qaPlanTgtList:[],
      checkedQaPlanTgtList:[],
      propsQaMngrList:[],

      loading: false,

      addUserData:{},

      MESSAGE: {
        CONFIRM: {
          ADD:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '', callYes: this.insertQaPlanTgt, callNo: this.closeAlert, },
          DELETE: { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가대상자를 삭제하시겠습니까?', callYes: this.deleteQaPlanTgt, callNo: this.closeAlert, },
        },
        ALERT:{
          ADD_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가자를 선택해주세요.' },
          CLOSED: { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 계획이 마감되었습니다.' },
          DEL_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가대상자를 선택해주세요.' },
          DEL_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가결과가 존재하는 평가대상자는 삭제할 수 없습니다.' },
        },
        TOAST : {
          ADD_DONE : {  msg: '평가대상자가 추가되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          DEL_DONE : {  msg: '평가대상자가 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    // 평가계획 정보 셋팅
    setQaPlanData(obj, mngrList, checkedList){
      // 평가계획 평가지 정보
      this.qaPlanData = obj;

      // 초기화
      this.checkedQaPlanTgtList = [];

      this.propsQaMngrList = mngrList;

      // 마감여부
      this.isClosed = this.qaPlanData.PROC_STAT == "CLOSED" ? true : false;

      // 평가지 선택여부
      this.isPaper = this.mixin_isEmpty(this.qaPlanData.PAPER_ID) ? false : true;

      // 일괄배정 가능여부
      this.isDiv = this.mixin_isEmpty(mngrList) ? false : true;

      // 평가자 선택여부
      this.checkedQaMngrList = [...checkedList];
      if(this.checkedQaMngrList.length <= 0){
        this.isMngr = false;
        this.qaPlanTgtList = [];
      }else{
        this.isMngr = true;
        this.selectQaPlanTgtList()
      }
    },

    // 평가 대상자 목록 조회
    async selectQaPlanTgtList(){
      let sUrl = '/phone-api/qa/selectQaPlanTgtList';
      // let sUrl = '/api/biz/common/select/selectQaPlanTgtList';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        // , MGR_EMP_NO: this.qaPlanData.MGR_EMP_NO
        , MGR_EMP_NO_LIST: this.checkedQaMngrList.map(row=>{return row.MGR_EMP_NO}).join(",")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaPlanTgtList'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaPlanTgtList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          return row;
        });
        this.addUserData = {};
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 개별추가 버튼 클릭 시 이벤트
    clickAddBtn(){
      if(!this.isMngr) return;

      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.CLOSED);
        return;
      }

      if(this.checkedQaMngrList.length > 1){
        this.showAlertInfo({msg:"평가자를 한 명만 선택해 주세요."});
        return false;
      }

      // 센터구분
      this.CUSTCO_ID = this.qaPlanData.CENTER_ID;
      // 평가기간
      this.EVAL_YM_PROP = this.qaPlanData.STD_MT;

      this.openFindMngDialog();
    },

    // 평가대상자 등록여부 확인
    async checkQaPlanTgt(){

      if(this.mixin_isEmpty(this.addUserData.USER_ID)) return ;

      let sUrl = '/api/biz/common/select/selectQaPlanTgtList';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        , TGT_EMP_NO: this.addUserData.USER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaPlanTgtList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        let list = response.DATA;

        if(list.length > 0){
          this.MESSAGE.CONFIRM.ADD.msg = "이미 추가된 대상자 입니다. (평가자:"+list[0].MGR_EMP_NM+")<br>추가하시겠습니까?";
          this.showAlert(this.MESSAGE.CONFIRM.ADD);
        }else{
          this.insertQaPlanTgt(this.addUserData.USER_ID);
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가대상자 등록
    async insertQaPlanTgt(){

      this.closeAlert();

      if(this.mixin_isEmpty(this.addUserData.USER_ID)) return;

      let sUrl = '/phone-api/qa/insertQaPlanTgt';
      // let sUrl = '/api/biz/common/select/insertQaPlanTgt';

      let mgtEmpNo = this.checkedQaMngrList[0].MGR_EMP_NO;

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        , mngrList: [{MGR_EMP_NO: mgtEmpNo}]
        , addTgtList: [{TGT_EMP_NO: this.addUserData.USER_ID, MGR_EMP_NO: mgtEmpNo}]
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };

      let headParam = { head : {
        DATA_OBJECT: "addTgtList,mngrList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.$emit("callFunc", {type:"MNGR_LIST", obj:this.qaPlanData});
        this.showToast(this.MESSAGE.TOAST.ADD_DONE);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 삭제 버튼 클릭 이벤트
    clickDeleteBtn(){
      if(!this.isMngr) return;

      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.CLOSED);
        return;
      }

      if(this.checkedQaPlanTgtList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL01);
        return;
      }

      for(let i=0; i<this.checkedQaPlanTgtList.length; i++){
        if(this.checkedQaPlanTgtList[i].STD_CNT != "0"){
          this.showAlert(this.MESSAGE.ALERT.DEL_FAIL02);
          return;
        }
      }

      // 삭제
      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 평가대상자 삭제 처리
    async deleteQaPlanTgt(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaPlanTgt';
      // let sUrl = '/api/biz/common/select/deleteQaPlanTgt';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , tgtList: this.checkedQaPlanTgtList.map(row=>{return {
            CENTER_ID: row.CENTER_ID
            , STD_MT: row.STD_MT.replaceAll("-","")
            , STD_MT_ORD: row.STD_MT_ORD
            , PAPER_ID: row.PAPER_ID
            , MGR_EMP_NO: row.MGR_EMP_NO
            , TGT_EMP_NO: row.TGT_EMP_NO
        }})
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };

      let headParam = { head : {
        DATA_OBJECT: "tgtList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.$emit("callFunc", {type:"MNGR_LIST", obj:this.qaPlanData});
        this.showToast(this.MESSAGE.TOAST.DEL_DONE);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    updateTgtInfo(){
      this.$emit("callFunc", {type:"MNGR_LIST", obj:this.qaPlanData});
      this.mixin_hideDialog('AlleAssign');
    },

    clickDivBtn(){
      if(!this.isDiv) return;
      if(this.isClosed){
        this.showAlert(this.MESSAGE.ALERT.CLOSED);
        return;
      }
      this.mixin_showDialog('AlleAssign');
    },

    clickSaveBtn(){
      if(this.$refs.QAM_M0400_DIALOG) this.$refs.QAM_M0400_DIALOG.clickSaveBtn();
    },

    // 평가대상자 정보 초기화
    initData(){
      this.qaPlanData = {};
      this.qaPlanTgtList = [];
      this.checkedQaPlanTgtList = [];

      this.isMngr = false;
      this.isClosed = false;
      this.isPaper = false;
      this.isDiv = false;
      this.addUserData = {};
      this.propsQaMngrList = [];
    },

    // 상담원 찾기 초기화 이벤트 송신
    initFindMng(){
      this.mixin_hideDialog('FindCusl')
      this.$eventBus.$emit('initFindMng');
    },

    openFindMngDialog(){
      this.mixin_showDialog('FindCusl')
      this.$eventBus.$emit('findCusl','');
    },

    // 체크박스 사용 시 선택 이벤트
    submitDialog(){
      this.$refs.CompoFindCusl.submitData();
    },
  },
  mounted() {

  },
  created() {
    // 직원 정보 수신
    this.$eventBus.$on('setCuslInfo',(cuslInfo)=> {
      this.addUserData = cuslInfo;
      this.checkQaPlanTgt();
    });
  },
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuslInfo");
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>