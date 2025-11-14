<template>
  <div class="fill-height">
    <div class="pl-quick-layer-body" style="height: calc(100vh - 210px)">
      <p>평가 문항별 배점은 소분류(분류명)에 설정할 수 있으며, 대분류와 중분류는 하위 분류 문항의 배점이 합산되어 점수가 표시됩니다. </p>
      <!-- form -->
      <v-form ref="form">
        <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-m">
          <div class="pl-form-inline">
            <span class="pl-label">
              센터
            </span>
            <div class="pl-desc" style="width: auto;">
              <v-select
                disabled
                :items="DROP_CENTER_LIST"
                class="pl-form type-middle"
                placeholder="선택"
                v-model="qstnData.CENTER_ID"
              ></v-select>
            </div>
            <span class="pl-label">
              분류유형
            </span>
            <div class="pl-desc">
              <v-select
                :disabled="isDisabledQaType"
                item-value="CD_ID"
                item-text="CD_NM"
                class="pl-form type-middle"
                :items="DROP_QSTN_TYPE"
                v-model="qstnData.QSTN_TYPE"
                :rules="validateRules.QSTN_TYPE"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              대분류
            </span>
            <div class="pl-desc">
              <v-text-field
              disabled
              class="pl-form type-middle"
              placeholder="대분류"
              v-model="qstnData.QA_LCD_NM"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              중분류
            </span>
            <div class="pl-desc">
              <v-text-field
                disabled
                class="pl-form type-middle"
                placeholder="중분류"
                v-model="qstnData.QA_MCD_NM"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              분류명
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                v-model="qstnData.QSTN_NM"
                :rules="validateRules.QSTN_NM"
                :spellcheck="false"
                v-byte-counter="500"
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
                v-model="qstnData.QSTN_DESC"
                :spellcheck="false"
                v-byte-counter="2000"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              표준 코멘트
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                v-model="qstnData.STD_OPNN"
                :spellcheck="false"
                :disabled="!isQaScd"
                v-byte-counter="2000"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              점수
            </span>
            <div class="pl-desc">
              <v-text-field
              class="pl-form type-middle flex-grow-0 is-xs"
              :disabled="!isQaScd"
              v-model="qstnData.QSTN_SCORE"
              type="number"
              oninput="this.value=this.value.replace(/[^0-9]/g,'')"
              maxlength="38"
              :rules="qstnData.REGIST_TYPE == 'S'?validateRules.QSTN_SCORE: []"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              사용 여부
            </span>
            <div class="pl-desc">
              <v-radio-group row class="pl-radio-group"
              v-model="qstnData.USE_YN"
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
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
        <v-btn class="pl-btn is-icon is-trans" v-if="isDelete"
          @click="clickDeleteBtn">
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
  name: 'QAM_M0200_DETAIL', //평가 문항관리 상세
  components: {
  },
  props: {
    propsQstnData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      // 센터
      DROP_CENTER_LIST: [],

      // 공통코드
      allCodeList:[],

      // 삭제버튼 표시 여부
      isDelete: false,

      // 분류유형 비활성화 여부
      isDisabledQaType: true,

      // 소분류 여부
      isQaScd: false,

      // 상세정보
      qstnData:{},

      // 분류유형 목록
      DROP_QSTN_TYPE:[],

      // validate
      validateRules:{
        QSTN_TYPE: [
          v => !!v || '분류유형은 필수 선택 항목입니다.',
        ],
        QSTN_NM: [
          v => !!v || '분류명은 필수 입력 항목입니다.',
        ],
        QSTN_SCORE:[
          v => !!v || '점수는 필수 입력 항목입니다.',
        ]
      },

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가문항을을 저장하시겠습니까?', callYes: this.saveQaQstn, callNo: this.closeAlert, },
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가문항을 삭제하시겠습니까?', callYes: this.deleteQaQstn, callNo: this.closeAlert, },
        },
        ALERT:{
          DEL_FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가문항을 선택해주세요.' },
        },
        TOAST : {
          SAVE_DONE : {  msg: '평가 문항이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          DEL_DONE : {  msg: '평가 문항이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    // 분류유형 조회
    async selectQaType(){
      let sUrl = '/phone-api/qa/selectQaTypeList';
      let postParam = {
        CENTER_ID: this.qstnData.CENTER_ID,
        USE_YN: "Y",
      };
      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_QSTN_TYPE = response.DATA;
      }else{
        this.DROP_QSTN_TYPE = [];
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.DROP_QSTN_TYPE.unshift({CD_ID:"", CD_NM:"선택"});
    },

    // 저장 버튼 클릭 이벤트
    clickSaveBtn(){

      // 필수값 확인
      if(!this.validate()) return;

      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가문항 저장
    async saveQaQstn(){

      this.closeAlert();

      let sUrl = '/phone-api/qa/saveQaQstn';
      let postParam = {
        CENTER_ID: this.qstnData.CENTER_ID
        , QSTN_TYPE:this.qstnData.QSTN_TYPE
        , QSTN_ID:this.qstnData.QSTN_ID
        , QSTN_NM:this.qstnData.QSTN_NM
        , QSTN_DESC: this.qstnData.QSTN_DESC
        , QA_LCD: this.qstnData.QA_LCD
        , QA_MCD: this.qstnData.QA_MCD
        , QA_SCD: this.qstnData.QA_SCD
        , QA_LCD_NM: this.qstnData.QA_LCD_NM
        , QA_MCD_NM: this.qstnData.QA_MCD_NM
        , STD_OPNN: this.qstnData.STD_OPNN
        , USE_YN: this.qstnData.USE_YN
        , QSTN_SCORE: this.qstnData.QSTN_SCORE
        , REGIST_TYPE: this.qstnData.REGIST_TYPE
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };
      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);

        // 상세정보 초기화
        this.qstnData = {};

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

      if(this.mixin_isEmpty(this.qstnData.QSTN_ID)){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL);
        return;
      }

      if(!this.mixin_isEmpty(this.qstnData.USE_CNT) && this.qstnData.USE_CNT != "0"){
        this.showAlertInfo({msg:"평가지에 사용중인 문항은 삭제할 수 없습니다."});
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 평가문항 삭제
    async deleteQaQstn(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaQstn';
      let postParam = {
        CENTER_ID: this.qstnData.CENTER_ID
        , QSTN_TYPE:this.qstnData.QSTN_TYPE
        , QSTN_ID:this.qstnData.QSTN_ID
        , QA_LCD: this.qstnData.QA_LCD
        , QA_MCD: this.qstnData.QA_MCD
        , QA_SCD: this.qstnData.QA_SCD
      };
      let headParam = { 
        head : {} 
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        this.showToast(this.MESSAGE.TOAST.DEL_DONE);

        // 상세정보 초기화
        this.qstnData = {};

        // 평가문항 목록 재조회
        this.$emit("Select");

        // 상세 팝업 닫기
        this.$emit("Close");
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    // 문항정보 셋팅
    async setQstnData(obj){
      // validate 에러 제거
      this.$refs.form.reset();
      await this.$nextTick(() => {});

      // 평가문항 상세정보 셋팅
      this.qstnData = JSON.parse(JSON.stringify(obj));

      // 분류유형 조회
      await this.selectQaType();

      // 삭제버튼 표시 여부
      // 평가문항ID가 존재하는 경우에만 표시
      this.isDelete = !this.mixin_isEmpty(this.qstnData.QSTN_ID);

      // 분류유형 비활성화 여부
      this.isDisabledQaType = this.qstnData.REGIST_TYPE == "L" && this.mixin_isEmpty(this.qstnData.QSTN_ID) ? false : true;

      // 점수 비활성화 여부
      this.isQaScd = this.qstnData.REGIST_TYPE == "S" ? true : false;
    },

  },
  async mounted() {

    // 공통코드 조회
    let codeList = ['USE_WT'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();

    // 문항정보 셋팅
    this.setQstnData(this.propsQstnData);
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