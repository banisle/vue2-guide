<template>
  <div>
    <!-- form -->
    <v-form ref="form">
      <div class="pl-form-inline-wrap vertical label-80 is-mt-m gap-8">
        <div class="pl-form-inline">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc" style="width: 180px;">
            <v-select
              v-model="qaPlanData.CENTER_ID"
              :items="DROP_CENTER_LIST"
              class="pl-form type-middle "
              placeholder="선택"
              disabled
            ></v-select>
          </div>
          <span class="pl-label ml-6">
            평가년월
          </span>
          <div class="pl-desc">
            <compo-date-picker
              NoTitleProp
              PickerType="month"
              DateType="dateInput"
              :DateProp.sync="qaPlanData.STD_MT"
              :DisabledProp="!qaPlanData.isNew"/>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            회차
          </span>
          <div class="pl-desc" style="width: 180px;">
            <v-text-field
              v-model="qaPlanData.STD_MT_ORD"
              class="pl-form type-middle "
              placeholder="회차"
              disabled
            ></v-text-field>
          </div>
          <span class="pl-label ml-6">
            평가 기간
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
              :StartDayProp.sync="qaPlanData.STD_ST_DD"
              :EndDayProp.sync="qaPlanData.STD_EN_DD"
              :IsViewDropPickerProp="false"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            진행상태
          </span>
          <div class="pl-desc" style="width: 180px;">
            <v-select
              v-model="qaPlanData.PROC_STAT"
              :items="mixin_common_code_get(this.allCodeList, 'QA_STAT_TP', '')"
              class="pl-form type-middle"
              placeholder="선택"
              :disabled="qaPlanData.isNew"
            ></v-select>
          </div>
          <span class="pl-label ml-6">
            마감일시
          </span>
          <div class="pl-desc">
            <div class="pl-calendar-range-form">
              <v-text-field
                  class="pl-form type-middle"
                  placeholder="마감일시"
                  v-model="qaPlanData.CLOS_DATE"
                  disabled
                ></v-text-field>
            </div>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            일정 공개
          </span>
          <div class="pl-desc">
            <v-radio-group
              v-model="qaPlanData.RLS_YN"
              row
              class="pl-radio-group"
            >
              <v-radio
                v-for="(rad01, index) in radioGroup"
                :key="radioGroup[index].text"
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
    <div class="is-border-top mt-2 pt-2">
      <div class="pl-form-inline-wrap vertical label-80 gap-8">
        <div class="pl-form-inline">
          <span class="pl-label">
            설명
          </span>
          <div class="pl-desc ">
            <v-textarea
              height="253px"
              class="pl-form is-noresize"
              :spellcheck="false"
              placeholder="평가계획 설명 입력"
              v-model="qaPlanData.RM"
              v-byte-counter="2000"
            />
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap is-mt-s">
        <!-- <v-btn
          @click="mixin_showDialog('ViewExceptManager')"
          class="pl-btn is-esp ml-auto">평가 제외 대상자 확인</v-btn> -->
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogViewExceptManager"
      content-class="dialog-draggable is-nopadding"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가 제외 대상자 확인"
        @hide="mixin_hideDialog('ViewExceptManager')"
      >
        <template slot="body">
          <!-- component -->
          <QAM_M0400_TAB_01_DIALOG />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('ViewExceptManager')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('ViewExceptManager')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import QAM_M0400_TAB_01_DIALOG from '@/views/page/QAM_M0400_TAB_01_DIALOG'
export default {
  name: 'QAM_M0400_TAB_01', //평가계획 정보
  components: {
    QAM_M0400_TAB_01_DIALOG,
  },
  data() {
    return {
      // dialog: 평가제외 대상자
      dialogViewExceptManager: false,

      radioGroup: [
        {
          text: "공개", value:"Y"
        },
        {
          text: "미공개", value:"N"
        },
      ],


      // 평가 제외자 보기
      DropExout: false,



      // 공통코드
      allCodeList: [],

      // 센터
      DROP_CENTER_LIST: [],

      // 평가계획정보
      qaPlanData: {
        CENTER_ID: ""
        , STD_MT: this.$moment().format('YYYY-MM')
        , STD_MT_ORD: ""
        , STD_ST_DD: this.$moment().format('YYYY-MM-DD')
        , STD_EN_DD: this.$moment().format('YYYY-MM-DD')
        , RLS_YN:"Y"
        , CLOS_DATE: ""
        , PROC_STAT: "PROCEEDING"
        , RM: ""
        , isNew: true
      },

      // validate
      validateRules:{
        STD_MT: [
          v => !!v || '평가년월은 필수 입력 항목입니다.',
        ],
        STD_ST_DD: [
          v => !!v || '평가시작일은 필수 입력 항목입니다.',
        ],
        STD_EN_DD: [
          v => !!v || '평가종료일은 필수 입력 항목입니다.',
        ],
        PROC_STAT: [
          v => !!v || '진행상태는 필수 선택 항목입니다.',
        ],
        CENTER_ID: [
          v => !!v || '센터는 필수 선택 항목입니다.',
        ],
      },

      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가계획을 저장하시겠습니까?', callYes: this.saveQaPlan, callNo: this.closeAlert, },
        },
        ALERT:{
          SAVE_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '센터는 필수 선택 항목입니다.' },
          SAVE_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '진행상태는 필수 선택 항목입니다.' },
          SAVE_FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가년월은 필수 입력 항목입니다.' },
          SAVE_FAIL04:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가기간은 필수 입력 항목입니다.' },
        },
        TOAST : {
          SAVE_DONE : {  msg: '평가계획이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    // 평가계획정보 저장 버튼 클릭 이벤트
    clickSaveBtn(){
      if(this.validate()){
        this.showAlert(this.MESSAGE.CONFIRM.SAVE);
      }
    },

    // 평가계획정보 저장
    async saveQaPlan(){

      this.closeAlert();

      let sUrl = '/phone-api/qa/saveQaPlan';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , STD_ST_DD: this.qaPlanData.STD_ST_DD.replaceAll("-", "")
        , STD_EN_DD: this.qaPlanData.STD_EN_DD.replaceAll("-", "")
        , RLS_YN: this.qaPlanData.RLS_YN
        , RM: this.qaPlanData.RM
        , PROC_STAT: this.qaPlanData.PROC_STAT
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };

      let headParam = { head : {}};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);
        this.initData();
        this.$emit("callFunc", {type:"PLAN_LIST"});
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //필수값 체크
    validate () {
      if(this.mixin_isEmpty(this.qaPlanData.CENTER_ID)){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL01);
        return false;
      }

      if(this.mixin_isEmpty(this.qaPlanData.PROC_STAT)){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL02);
        return false;
      }

      if(this.mixin_isEmpty(this.qaPlanData.STD_MT)){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL03);
        return false;
      }

      if(this.mixin_isEmpty(this.qaPlanData.STD_ST_DD) || this.mixin_isEmpty(this.qaPlanData.STD_EN_DD)){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL04);
        return false;
      }

      // 마감 가능 여부 확인
      if(!this.mixin_isEmpty(this.qaPlanData.STD_MT_ORD) && this.qaPlanData.PROC_STAT == "CLOSED"){
        if(!this.selectQaPlanCloseable()){
          return false;
        }
      }

      return true;
    },

    // 마감 가능 여부 조회
    async selectQaPlanCloseable(){
      let rst = false;
      // let sUrl = '/phone-api/qa/selectQaPlanCloseable';
      let sUrl = '/api/biz/common/select/selectQaPlanCloseable';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaPlanCloseable'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length >0){
          if(response.DATA[0].NOT_COMPLETE_CNT != "0"){
            this.showAlertInfo({msg:"진행중인 평가가 존재해 마감 처리할 수 없습니다."});
            rst = false;
          }else{
            rst = true;
          }
        }else{
          rst = true;
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      return rst;
    },

    // 평가계획정보
    setQaPlanData(obj){
      this.qaPlanData = JSON.parse(JSON.stringify(obj));
      this.qaPlanData.isNew = this.mixin_isEmpty(this.qaPlanData.STD_MT_ORD);
    },

    // 탭 정보 초기화
    initData(){
      this.qaPlanData = {
        CENTER_ID: ""
        , STD_MT: this.$moment().format('YYYY-MM')
        , STD_MT_ORD: ""
        , STD_ST_DD: this.$moment().format('YYYY-MM-DD')
        , STD_EN_DD: this.$moment().format('YYYY-MM-DD')
        , RLS_YN:"Y"
        , CLOS_DATE: ""
        , PROC_STAT: "PROCEEDING"
        , RM: ""
        , isNew: true
      };
    },
  },
  async mounted() {

    // 공통코드 조회
    let codeList = ['QA_STAT_TP'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
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