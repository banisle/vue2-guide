<template>
  <div class="fill-height">
    <div class="pl-quick-layer-body" style="height: calc(100vh - 210px)">
      <p>평가계획은 센터를 기준으로 수립할 수 있으며, 평가 계획에 적용할 확정된 평가지를 선택하여야 등록할 수 있습니다. 미확정 평가지 또는 이미 사용된 평가지는 조회되지 않습니다. </p>
      <!-- form -->      
      <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-m">
        <div class="pl-form-inline">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc">
            <v-select
              v-model="qstnPlanData.CENTER_ID"
              :items="DROP_CENTER_LIST"
              class="pl-form type-middle is-md flex-grow-0"
              placeholder="선택"
              @change="changeCenter"
              :disabled="!isConfirm"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가종류
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-md flex-grow-0"
              placeholder="선택"
              :items="mixin_common_code_get(this.allCodeList, 'TEST_DV', '')"
              v-model="qstnPlanData.EVAL_MNG"
              @change="changeCenter"         
              :disabled="!isConfirm"  
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">평가지</span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
              item-text="PAPER_TITLE"       
              item-value="PAPER_ID"  
              no-data-text="결과 없음"            
              :items="evalQstnPaperList"    
              :rules="validateRules.PAPER_ID"
              @change="changePaper"          
              v-model="qstnPlanData.PAPER_ID"
              :disabled="!isConfirm"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">문제 수</span>
          <div class="pl-desc">
            <v-text-field
              disabled
              class="pl-form type-middle is-md flex-grow-0"
              v-model="QSTN_CNT"
              />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">총 점수</span>
          <div class="pl-desc">
            <v-text-field
              disabled
              class="pl-form type-middle is-md flex-grow-0"
              v-model="TOT_SCORE"
              />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">문제배열</span>
          <div class="pl-desc">
            <v-text-field
              disabled
              class="pl-form type-middle is-md flex-grow-0"
              v-model="QSTN_ARR_NM"
              />
          </div>
        </div>
      </div>      
      <v-form ref="form">
        <div class="pl-form-inline-wrap vertical label-80 gap-8 mt-3 pt-3 is-border-sub-top">
          <div class="pl-form-inline">
            <span class="pl-label">평가 제목</span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle"
                placeholder="평가 제목 입력" 
                v-model="qstnPlanData.EVAL_TITLE"
                :rules="validateRules.EVAL_TITLE"
                :disabled="!isConfirm"
                />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">평가 시작일</span>
            <div class="pl-desc">
              <compo-date-picker
                DateType="dateTime"
                :DateProp.sync="startDT"
                :TimesProp.sync='startTime'
                :AmpmProp.sync='timeAmpm'   
                :DisabledProp="!isConfirm"
                />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">평가 시간</span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle is-sm flex-grow-0"
                v-model="qstnPlanData.EVAL_TIME"
                :rules="validateRules.EVAL_TIME"
                :disabled="!isConfirm"
                type="number"
                oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                suffix="분" />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">안내 문</span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                :disabled="!isConfirm"
                v-model="qstnPlanData.EVAL_COMMENT"
                placeholder="평가 시행 시 평가 대상자에게 안내문 되는 문구 입력"
              />
            </div>
          </div>
        </div>
      </v-form>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
        <v-btn class="pl-btn is-icon is-trans" :disabled="!isConfirm">
          <span class="pl-icon20 trash"></span>삭제</v-btn>
        <v-btn class="pl-btn" :disabled="!isConfirm" @click="clickSaveBtn">저장</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QTM_M0200_DETAIL', //평가계확 관리 상세
  components: {
  },
  props: {
    propsQstnPlanData:{
      type: Object,
      default: () => {},
    },
    propsQstnPlanPaperData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      modelTopCenter: '마이홈센터',
      itemsTopCenter: ['마이홈센터'],
      subject: 15,
      textareaValue: ``,
      startDT: "",
      //startTime: '10:00',
      startTime: "",
      timeAmpm: '오후',

      // 공통코드
      allCodeList: [],
      // 센터
      DROP_CENTER_LIST: [],

      // 평가지 목록
      evalQstnPaperList: [],

      // 계획 상세정보
      qstnPlanData:{},

      addItemSet:{},

      searchParams:{
        USER_ID:"",
        CENTER_ID: "",
        EVAL_MNG: "EVTYPE01",  // 평가 종류
      },     

      // 평가 계획 정보  
      PAPER_ID: "",
      CENTER_ID: "",
      EVAL_TITLE: "",    
      EVAL_ST_DD: "",  // 평가 시작일자
      EVAL_TIME: 15, //평가시간
      EVAL_MNG: "", // 문제 주관   // 평가 종류
      EVAL_COMMENT: "", // 시험안내문       
      
      TOT_SCORE: "", //총점
      REG_EMP_NO: "",  

      QSTN_CNT: "", // 문제 갯수
      QSTN_ARR: "", // 문제 배열
      QSTN_ARR_NM:"",
      PROC_STAT: "", //진행상태     
      
      isNew : true,
      isConfirm : true,

      vaild : true,
      // validate
      validateRules:{
        EVAL_TITLE: [
          v => !!v || '평가 제목은 필수 입력 항목입니다.',
        ],
        EVAL_TIME: [
          v => !!v || '평가 시간은 필수 입력 항목입니다.',
        ],
        PAPER_ID: [
          v => !!v || '평가지는 필수 입력 항목입니다.',
        ]       
      },


      MESSAGE : {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가 계획을 저장하시겠습니까?', callYes: this.saveEval, callNo: this.closeAlert, },
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가 계을 삭제하시겠습니까?', callYes: this.deleteQaQstn, callNo: this.closeAlert, },
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '평가 계획 정보가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {          
          REG_SUCCESS: {  msg: '평가 계획 정보가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

    }
  },
  methods: {
    
    //평가지 선택시 
    changePaper(){
      const filterArray = this.evalQstnPaperList.filter( (item) => item.PAPER_ID == this.qstnPlanData.PAPER_ID);
      if(filterArray.length > 0){
        this.QSTN_CNT = filterArray[0].QSTN_CNT;
        this.TOT_SCORE = filterArray[0].TOT_SCORE;
        this.QSTN_ARR_NM = filterArray[0].QSTN_ARR_NM;
      }
    },

    // 센터 조건 변경 시 이벤트
    changeCenter(){
      this.qstnPlanData.PAPER_ID = "";
      this.selectEvalQstnPaperList();
    },

    // 평가지 (미확정) 조회
    async selectEvalQstnPaperList(){
      // 초기화
      this.evalQstnPaperList = [];      

      let sUrl = '/phone-api/qt/selectEvalQstnPList';
      let postParam = {      
        CENTER_ID: this.qstnPlanData.CENTER_ID,
        EVAL_MNG: this.qstnPlanData.EVAL_MNG,
        isNew: this.isNew,
        PAPER_ID: this.isNew === true ? '' : this.qstnPlanData.PAPER_ID
      };
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.evalQstnPaperList = response.DATA;
      }else{
        //this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

      //필수값 체크
    validate(){
      return this.$refs.form.validate();
    },

    clickSaveBtn(){
       // 필수값 확인
      if(!this.validate()) return;
      if(this.qstnPlanData.PAPER_ID == ''){
        this.showAlert(this.MESSAGE.ALERT.VALID); 
        return;
      }

      let diffDD = this.$moment.duration(this.$moment(this.startDT + " " + this.startTime, "YYYY-MM-DD HH:mm").diff(this.$moment())).days();
      let diffHH = this.$moment.duration(this.$moment(this.startDT + " " + this.startTime, "YYYY-MM-DD HH:mm").diff(this.$moment())).hours();
      let diffMM = this.$moment.duration(this.$moment(this.startDT + " " + this.startTime, "YYYY-MM-DD HH:mm").diff(this.$moment())).minutes();
      let diffSS = this.$moment.duration(this.$moment(this.startDT + " " + this.startTime, "YYYY-MM-DD HH:mm").diff(this.$moment())).seconds();

      if(diffDD < 0 || diffHH < 0 || diffMM < 0 || diffSS < 0){
        this.showAlertCaution({msg:"평가 시작일이 현재 시간 보다 늦습니다.<br>평가 시작일을 다시 입력해주세요."});
        return;
      }

      let timeMsg = "";
      if(diffDD > 0) timeMsg += diffDD+"일 ";
      if(diffHH > 0) timeMsg += diffHH+"시간 ";
      if(diffMM > 0) timeMsg += diffMM+"분 ";
      if(diffSS > 0) timeMsg += diffSS+"초 ";

      this.showConfirmInfo({
        msg:"평가 시작일은 <span class='is-txt-red is-bold'>"+ this.startDT + " " + this.startTime +"</span> 입니다."
          + "<br><span class='is-txt-red'>"+timeMsg+"</span>후 평가가 시작됩니다."
          // +"<br> 평가 시작 시 평가계획을 삭제 및 수정할 수 없습니다."
          + '<br>평가 계획을 저장하시겠습니까?'
        , callYes: () => {
          this.saveEval();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });

      // this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가계획 정보 등록  
    async saveEval(){
      //, ST_STD_MT: this.$moment().subtract(2, "months").format('YYYY-MM-DD')
      //, EN_STD_MT: this.$moment().add(1, "months").format('YYYY-MM-DD')
      const set_EVAL_ST_DD = this.startDT.replaceAll('-', '')+this.startTime.replaceAll(':', '') +"00"

      let sUrl = '/phone-api/qt/insertEvalQstnPlan';

      if(!this.isNew){
        sUrl = '/phone-api/qt/updateEvalQstnPlan';
      }

      let postParam = {
        isNew: this.isNew ? 'Y':'N',        
        CENTER_ID: this.qstnPlanData.CENTER_ID,
        EVAL_TITLE : this.qstnPlanData.EVAL_TITLE,
        PAPER_ID : this.qstnPlanData.PAPER_ID,
        EVAL_TIME : this.qstnPlanData.EVAL_TIME,   
        EVAL_ID : this.qstnPlanData.EVAL_ID,
        REG_EMP_NO: this.$store.getters["userStore/GE_USER_ROLE"].userId,
        EVAL_COMMENT: this.qstnPlanData.EVAL_COMMENT,          
        EVAL_MNG: this.qstnPlanData.EVAL_MNG,
        EVAL_ST_DD : set_EVAL_ST_DD,
        EVAL_YYYY : set_EVAL_ST_DD.substring(0, 4)     
      };      

      let headParam = { head : {} };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        // 평가문항 목록 재조회
        this.$emit("Select");
        // 상세 팝업 닫기
        this.$emit("Close");          
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.closeAlert();
      //this.$emit('Close')
    },

    // 등록 초기 설정
    async setQstnPlanPaperData(obj){      
      this.qstnPlanData = {};
      // 평가 계획 평가지 정보 셋팅
      this.qstnPlanData = JSON.parse(JSON.stringify(obj));

      this.isConfirm = this.qstnPlanData.isConfirm;
      this.isNew = this.qstnPlanData.isNew;
      this.selectEvalQstnPaperList();
      this.changePaper();
    },

    // 계획 셋팅 ( 수정시 )
    async setQstnPlanData(obj){

      this.qstnPlanData = {};

      // 평가 계획 상세정보 셋팅
      this.qstnPlanData = JSON.parse(JSON.stringify(obj));
      this.QSTN_CNT = 0;
      this.isConfirm = this.qstnPlanData.isConfirm;
      this.isNew = this.qstnPlanData.isNew;
      if(this.isNew) this.qstnPlanData.EVAL_MNG = 'EVTYPE01';

      this.startDT = this.mixin_isEmpty(this.qstnPlanData.EVAL_ST_DD) ? "" : this.qstnPlanData.EVAL_ST_DD.substring(0,10);
      this.startTime = this.mixin_isEmpty(this.qstnPlanData.EVAL_ST_DD) ? "" : this.qstnPlanData.EVAL_ST_DD.substring(11,16);
      this.PAPER_ID = this.qstnPlanData.PAPER_ID;
      this.EVAL_ID = this.qstnPlanData.EVAL_ID;
      this.QSTN_CNT = this.qstnPlanData.QSTN_CNT;
      this.QSTN_ARR_NM = this.qstnPlanData.QSTN_ARR_NM;
      this.TOT_SCORE = this.qstnPlanData.TOT_SCORE;
      this.searchParams.EVAL_MNG = this.qstnPlanData.EVAL_MNG;

      await this.selectEvalQstnPaperList();
      this.changePaper();

      // 비활성화 여부
      //this.isDisabledQstn = this.qstnPlanData. == "S" ? false : true;
    },

  },
  async mounted() {
    let codeList = ['TEST_DV'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    this.setQstnPlanData(this.propsQstnPlanData);
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