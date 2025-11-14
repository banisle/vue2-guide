<template>
  <div class="fill-height">
    <div class="pl-quick-layer-body" style="height: calc(100vh - 210px)">
      <p>평가지를 등록 하신 후 평가지에 문항을 설정하시면 문항 수와 총점은 자동으로 설정됩니다. </p>
      <!-- form -->
      <v-form ref="form">
        <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-m">
          <div class="pl-form-inline">
            <span class="pl-label">
              센터
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                :items="DROP_CENTER_LIST"
                v-model="qaPaperData.CENTER_ID"
                :disabled="isDetail"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              평가지 종류
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                :items="paperTypeList"
                v-model="qaPaperData.PAPER_TYPE"
                :disabled="isDetail"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              평가지 명
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle"
                placeholder="평가지명 입력"
                :rules="validateRules.PAPER_NM"
                v-model="qaPaperData.PAPER_NM"
                v-byte-counter="500"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              일반문항 수
            </span>
            <div class="pl-desc">
              <v-text-field
                disabled
                class="pl-form type-middle is-sm flex-grow-0"
                v-model="qaPaperData.QSTN_CNT"
                />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              총점
            </span>
            <div class="pl-desc">
              <v-text-field
                disabled
                class="pl-form type-middle is-sm flex-grow-0"
                v-model="qaPaperData.TOT_SCORE"
                />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              설명
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                placeholder="평가지 설명 또는 기타내용 입력"
                v-model="qaPaperData.PAPER_DESC"
                v-byte-counter="2000"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              사용 여부
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="qaPaperData.USE_YN"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in mixin_common_code_get(this.allCodeList, 'USE_WT')"
                  :key="index"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
      </v-form>
    </div>
    <div class="pl-quick-layer-footer">
      <v-btn class="pl-btn is-esp" 
        @click="clickSaveAsBtn" v-if="isDetail">다른 이름으로 저장</v-btn>
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
        <v-btn class="pl-btn is-icon is-trans" 
          @click="clickDeleteBtn"
          v-if="isDetail">
          <span class="pl-icon20 trash"></span>
            삭제
        </v-btn>
        <v-btn class="pl-btn" @click="clickSaveBtn">저장</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QAM_M0300_DETAIL', //평가지 관리 상세
  components: {
  },
  props: {
    propsQaPaperData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      // 평가지종류 자유배점 고정
      paperTypeList: [{text:"자유배점", value:"OPTION"}],

      // 공통코드
      allCodeList: [],
      
      // 센터
      DROP_CENTER_LIST: [],

      // 상세정보
      qaPaperData:{},

      // validate
      validateRules:{
        PAPER_NM: [
          v => !!v || '평가지명은 필수 입력 항목입니다.',
        ],
        PAPER_TYPE: [
          v => !!v || '평가지 종류는 필수 선택 항목입니다.',
        ],
      },
      
      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '해당 평가지를 저장하시겠습니까?', callYes: this.saveQaPaper, callNo: this.closeAlert, },
          SAVE_AS:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '해당 평가지를 다른 이름으로 저장하시겠습니까?', callYes: this.saveAsQaPaper, callNo: this.closeAlert, },
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가지를 삭제하시겠습니까?', callYes: this.deleteQaPaper, callNo: this.closeAlert, },
        },
        ALERT:{
          DEL_FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '사용중인 평가지는 삭제할 수 없습니다.' },
        },
        TOAST : {
          SAVE_DONE : {  msg: '평가지가 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          DEL_DONE : {  msg: '평가지가 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      isDetail: false,
    }
  },
  methods: {

    // 저장 버튼 클릭 이벤트
    clickSaveBtn(){
      // 필수값 확인
      if(!this.validate()) return;

      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가지 저장
    async saveQaPaper(type){
      this.closeAlert();

      let sUrl = '/phone-api/qa/saveQaPaper';
      let postParam = {}

      if(type == "SAVE_AS"){
        postParam = {
          CENTER_ID: this.qaPaperData.CENTER_ID
          , PAPER_ID: ""
          , PAPER_NM: this.qaPaperData.PAPER_NM
          , PAPER_TYPE: this.qaPaperData.PAPER_TYPE
          , PAPER_DESC: this.qaPaperData.PAPER_DESC
          , QSTN_CNT: this.qaPaperData.QSTN_CNT
          , TOT_SCORE: this.qaPaperData.TOT_SCORE
          , USE_YN: this.qaPaperData.USE_YN
          , SAVE_AS_ID: this.qaPaperData.PAPER_ID
          , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
        };
      }else{
        postParam = {
          CENTER_ID: this.qaPaperData.CENTER_ID
          , PAPER_ID: this.qaPaperData.PAPER_ID
          , PAPER_NM: this.qaPaperData.PAPER_NM
          , PAPER_TYPE: this.qaPaperData.PAPER_TYPE
          , PAPER_DESC: this.qaPaperData.PAPER_DESC
          , QSTN_CNT: this.qaPaperData.QSTN_CNT
          , TOT_SCORE: this.qaPaperData.TOT_SCORE
          , USE_YN: this.qaPaperData.USE_YN
          , SAVE_AS_ID: this.qaPaperData.SAVE_AS_ID
          , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
        };
      }

      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);

        // 상세정보 초기화
        this.qaPaperData = {};

        // 평가문항 목록 재조회
        this.$emit("Select");

        // 상세 팝업 닫기
        this.$emit("Close");

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 삭제 버튼 클릭 이벤트
    clickDeleteBtn(){
      if(this.mixin_isEmpty(this.qaPaperData.PAPER_ID)) return;

      // 사용중인 평가지는 삭제 불가
      if(this.qaPaperData.USE_CNT != "0"){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },
    
    // 평가지 삭제
    async deleteQaPaper(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaPaper';
      let postParam = {
        CHECK_LIST: [{CENTER_ID: this.qaPaperData.CENTER_ID, PAPER_ID: this.qaPaperData.PAPER_ID}],
        CENTER_ID: this.qaPaperData.CENTER_ID,
        USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID,
      };
      let headParam = { 
        head : {
          DATA_OBJECT: "CHECK_LIST",
        } 
      };
      
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        this.showToast(this.MESSAGE.TOAST.DEL_DONE);

        this.qaPaperData = {};

        // 재조회
        this.$emit("Select");

        // 상세 팝업 닫기
        this.$emit("Close");

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 다른 이름으로 저장 버튼 클릭 이벤트
    clickSaveAsBtn(){
      if(this.mixin_isEmpty(this.qaPaperData.PAPER_ID)) return;
      this.showAlert(this.MESSAGE.CONFIRM.SAVE_AS);
    },

    saveAsQaPaper(){
      this.saveQaPaper("SAVE_AS");
    },
    
    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

  },
  async mounted() { 
    // 공통코드 조회
    let codeList = ['USE_WT'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();

    // validate 에러 제거
    this.$refs.form.reset();
    await this.$nextTick(() => {});

    this.qaPaperData = JSON.parse(JSON.stringify(this.propsQaPaperData));
    this.isDetail = !this.mixin_isEmpty(this.qaPaperData.PAPER_ID);
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