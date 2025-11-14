<template>
  <div style="display: contents;">
    <table class="pl-tbl-detail">
      <colgroup>
        <col width="17%" />
        <col width="35%" />
        <col width="17%" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">
            <span class="pl-label">
              상담채널
            </span>
          </th>
          <td>
            <div class="spacing-wrap sp-4">
              <v-select
                v-model="DRWI_TYPE_CD"
                :items="['IN', 'OUT']"
                class="pl-form "
                item-text="title"
                style="flex: 0 0 120px"
                placeholder="선택"
                :disabled="editAble?false:true"
                ></v-select>
              <v-select
                v-model="RCPT_CHN_CD"
                :items="mixin_common_code_get(this.list_common_code, 'CVC', '')"
                class="pl-form is-auto"
                placeholder="선택"
                :disabled="editAble?false:true"
                ></v-select>
              <!-- 상담채널 : 카카오톡일때  -->
              <template v-if="RCPT_CHN_CD === 'CVCK' || RCPT_CHN_CD === 'CVCS' || RCPT_CHN_CD === 'CVCE'">
                <v-text-field
                  class="pl-form "
                  placeholder="티켓 아이디 입력"
                  v-model="TICKET_ID"
                ></v-text-field>
              </template>
            </div>
          </td>
          <th scope="row">
            <span class="pl-label">
              개인정보수집
            </span>
          </th>
          <td>
            <v-radio-group
              v-model="PRVC_CLCT_AGRE_YN"
              row
              class="pl-radio-group">
              <v-radio
                v-for="(rad01, index) in PRVC_CLCT_AGRE_LIST"
                :key="rad01.value"
                :label="rad01.text"
                :value="rad01.value"
                :disabled="editAble?false:true"
                class="pl-radio">
              </v-radio>
              <template v-if="PRVC_CLCT_AGRE_YN === 'N'">
                <!-- <v-icon :class="`pl-icon20 terms-ani ${DRWI_TYPE_CD === 'OUT' ? 'blink-off' : ''}`"></v-icon> -->
                <v-icon class="pl-icon20 terms-ani blink-off"></v-icon>
                <strong class="is-txt-red pl-value-txt">미동의 고객</strong>
              </template>
            </v-radio-group>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              접속정보
            </span>
          </th>
          <td>
            <span class="pl-value-txt">
              {{ CTI_INFO.ARS_INFO }}
            </span>
          </td>
          <th scope="row">
            <span class="pl-label">
              고객전화번호
            </span>
          </th>
          <td>
            <span class="pl-value-txt">
              {{ mixin_setPhoneNo(CTI_INFO.PHN_NO.replace(/[^0-9]/g, '')) }}
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              상담유형
            </span>
          </th>
          <td colspan="3">
            <compo-cutt-type-combo
              :DataProp="SCH_ALL_CUTT_TYPE"
              :FormSeProp="'CUTT'"
              :DisabledProp="editAble?false:true"
              :StrHeadTextProp="'전체'"
              @EMIT_CUTT_TYPE="setCuttType"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              처리방법
            </span>
          </th>
          <td colspan="3">
            <div class="d-flex">
              <v-radio-group
                v-model="PRCS_CHN_CD"
                row
                class="pl-radio-group">
                <v-radio
                  v-for="(rad01, index) in PRCS_CHN_LIST"
                  :key="rad01.value"
                  :label="rad01.text"
                  :value="rad01.value"
                  :disabled="rad01.disabled"
                  @click="prcsChnCtrl(rad01)"
                  class="pl-radio">
                  </v-radio>
              </v-radio-group>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              상담지역
            </span>
          </th>
          <td colspan="3">
            <compo-cutt-zone-combo
              :DataProp="SCH_ALL_CUTT_ZONE"
              :FormSeProp="'CUTT'"
              :DisabledProp="editAble?false:true"
              @EMIT_CUTT_ZONE="setCuttZone"
              @EMIT_ADD_CUTT_CN="setAddCuttCn"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              상담메모
            </span>
          </th>
          <td colspan="3" class="has-textarea">
            <v-textarea
              v-model="CUTT_CN"
              ref="CUTT_CN"
              class="pl-form is-noresize"
              @mousedown="setCursorPosition"
              @keydown="setCursorPosition"
              :spellcheck="false"
              :height="computedUserCenter === '2' && RCPT_CLBK_ID && editAble? 73:103"
              :disabled="editAble?false:true"
              />
          </td>
        </tr>
        <tr v-if="computedUserCenter === '2' && RCPT_CLBK_ID && editAble"><!--공가해소 인 경우 계약희망여부-->
          <th scope="row">
            <span class="pl-label">
              계약희망여부
            </span>
          </th>
          <td colspan="3">
            <div class="spacing-wrap sp-4 align-center">
              <div>
                <v-checkbox
                  v-model="CONTRACK_CHK"
                  class="pl-check flex-grow-0"
                  :disabled="editAble?false:true"
                ></v-checkbox>
              </div>
              <v-select
                v-model="CONTRACK_TASK_TP"
                class="pl-form"
                style="flex:0 0 120px"
                :items="CONTRACK_TASK_LIST"
                :disabled="editAble?CONTRACK_CHK?false:true:true"
              />
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              제보 요청
            </span>
          </th>
          <td >
            <div class="spacing-wrap sp-4 align-center">
              <v-combobox
                v-model="modelChkRequest"
                class="pl-form is-sm"
                :items="mixin_common_code_get(this.common_code, 'RECM', '')"
                multiple
                :disabled="editAble?false:true"
              />
              <v-text-field
                v-model="modelChkRequestTime"
                class="pl-form "
                style="width: 52px"
                :disabled="modelChkRequest.length > 0?false:true"
                />
                <v-text-field
                v-model="modelChkReason"
                class="pl-form "
                :disabled="modelChkRequest.length > 0?false:true"
                />
            </div>
          </td>
          <th scope="row">
            <span class="pl-label" @click="openPhnCvlcptPopup">
              민원 접수
            </span>
          </th>
          <td>
            <div class="spacing-wrap sp-4 align-center">
              <div>
                <v-checkbox
                  v-model="VOC_CHK"
                  class="pl-check flex-grow-0"
                  :disabled="editAble?false:true"
                ></v-checkbox>
              </div>
              <v-select
                v-model="VOC_DV"
                class="pl-form flex-grow-1"
                :items="VOC_LIST"
                :disabled="CVLCPT_RCPT_MNG_ID?true:editAble?VOC_CHK?false:true:true"
                @change="openPhnCvlcptPopup"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- dialog: 지구 검색 -->
    <v-dialog
      v-model="dialogFindArea"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="지구 검색"
        @hide="mixin_hideDialog('FindArea')"
        @submit="submitDialog('FindArea')">
        <template slot="body">
          <CompoFindArea />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 이첩 대상자 선택 -->
    <v-dialog
      v-model="dialogTransManager"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="이첩 대상자 선택"
        @hide="mixin_hideDialog('TransManager')"
        @submit="submitDialog('TransManager')"
        >
        <template slot="body">
          <CompoTransManager />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 호전환 -->
    <v-dialog
      v-model="dialogTransCenter"
      content-class="dialog-draggable is-lg"
      hide-overlay
      :width="computedUserCenter !== '5'?computedUserCenter !== '3'?480:550:1000">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="호전환"
        @hide="mixin_hideDialog('TransCenter')"
        @submit="submitDialog('TransCenter')"
        >
        <template slot="body">
          <CompoTransCenter @setTransPhnNo="setTransPhnNo" @transPhnNoClear="TRANS_EXT_NO = ''"/>
        </template>
        <template slot="footer" v-if="computedUserCenter === '5'"><!--주택지원센터(렌트홈)인 경우만 사용-->
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-icon class="pl-icon20 swap"></v-icon>
                <strong class="ml-1">전환</strong>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="TRANS_EXT_NO"
                  class="pl-form type-middle ml-1"
                  :readonly="true"
                ></v-text-field>
              </div>
            </div>
          </div>
          <div class="pl-btn-wrap ml-1">
            <v-btn
              class="pl-btn"
              :disabled="TRANS_EXT_NO?Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6 ? false : true:true"
              @click="tryTrans"
            >전환시도</v-btn>
            <v-btn
              class="pl-btn is-sub"
              :disabled="TRANS_EXT_NO?Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6 && PREV_CONN_ID ? false : true:true"
              @click="transExtNo"
            >전환</v-btn>
            <v-btn
              class="pl-btn is-sub"
              :disabled="TRANS_EXT_NO?Number(CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6 && PREV_CONN_ID ? false : true:true"
              @click="transCancel"
            >전환 취소</v-btn>
          </div>
          <div class="pl-btn-wrap ml-auto">
            <v-btn
              @click="mixin_hideDialog('TransCenter')"
              class="pl-btn is-trans">닫기</v-btn>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 통화예약 -->
    <v-dialog
      v-model="dialogCallReserve"
      content-class="dialog-draggable"
      hide-overlay
      width=350>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="통화예약"
        @hide="mixin_hideDialog('CallReserve')"
        @submit="submitDialog('CallReserve')"
        >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                고객명
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="RSRV_CUST_NM"
                  class="pl-form type-middle is-auto"
                  placeholder="고객명 입력"
                >
                <!-- <template v-slot:append>
                  <v-btn
                    @click="mixin_testLog('search btn')"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template> -->
              </v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                전화번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="RSRV_TEL_NO"
                  class="pl-form type-middle is-auto"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo(RSRV_TEL_NO)"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                예약일시
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="RSRV_DT"
                  :TimesProp.sync='RSRV_TIME'
                  :AmpmProp.sync='timeAmpm'
                  />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                예약내용
              </span>
              <div class="pl-desc">
                <v-textarea
                  v-model="RSRV_CNTNT"
                  height="90"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  placeholder="예약내용 입력"
                />
              </div>
            </div>
            <div class=" is-mt-s pt-3 is-border-sub-top">
              <p class="">※ 통화예약 후 상담저장 버튼을 클릭하셔야 예약이 완료 됩니다.</p>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn" @click="mixin_hideDialog('CallReserve')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 배려고객ARS -->
    <v-dialog
      v-model="dialogBalckArs"
      content-class="dialog-draggable is-esp-border"
      hide-overlay
      persistent
      width=850>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="배려고객ARS"
        @hide="mixin_hideDialog('BalckArs')"
        @submit="submitDialog('BalckArs')"
        >
        <template slot="body">
          <CompoBlackArs :CUST_INFO="CUST_INFO" :CUTT_EXEC_CAUTION_LIST="EXEC_CAUTION_LIST"/>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- slide: 응대 스크립트 -->
    <v-slide-x-transition>
      <div v-if=" dialogResponseScript === true "
        class="pl-quick-layer type-left "
        style="width: 975px; z-index: 11;"
        >
        <div class="pl-quick-layer-header ">
          <div class="d-flex align-center">
            <h1>블랙컨슈머 응대 스크립트 </h1>
          </div>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick=""
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogResponseScript = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoResponseScript />
      </div>
    </v-slide-x-transition>
  </div>
</template>

<script>
import CompoFindArea from '@/components/CompoFindArea'
import CompoTransManager from '@/components/CompoTransManager.vue';
import CompoTransCenter from '@/components/CompoTransCenter.vue';
import CompoBlackArs from '@/components/CompoBlackArs'
import { eventBus } from "@/store/eventBus.js";

import CompoResponseScript from '@/views/page/CompoResponseScript'
import CompoCuttTypeCombo from '@/components/CompoCuttTypeCombo'
import CompoCuttZoneCombo from '@/components/CompoCuttZoneCombo.vue'

import { ipronCallUtil } from "@/store/ipronCallUtil.js";

export default {
  name: "CompoCsInfoTable", //name은 'MENU_' + 파일명 조합
  components: {
    CompoFindArea,
    CompoTransManager,
    CompoTransCenter,
    CompoResponseScript,
    CompoCuttTypeCombo,
    CompoCuttZoneCombo,
    CompoBlackArs
  },
  props: {
    DataProp: {
      type: Object,
    },
    cuttEditAble: {
      type: Boolean,
      default : false
    },
    CHG_CUTT_CN: {
      type: String
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    SAVE_AFTER_ACTION: {
      type: Object,
    },
  },
  data() {
    return {
      //이첩 dialog
      dialogTransManager: false,

      //호전환 센터 dialog
      dialogTransCenter: false,

      // 지구 검색 dialog
      dialogFindArea: false,

      // 배려고객 ARS
      dialogBalckArs: false,


      editAble : false, //등록 수정 가능 여부

      PRVC_CLCT_AGRE_YN : '', //개인정보 수집 동의 여부
      PRVC_CLCT_AGRE_LIST: [
        { text: '동의', value : 'Y' },
        { text: '미동의', value : 'N' },
      ],

      PRCS_CHN_CD : 'ISMAPCMC001', //처리 방법 코드
      PRCS_STTS_CD : 'ISMACNST009', //처리 상태 코드
      //처리 방법 목록
      PRCS_CHN_LIST: [
        { text: '일반', value : 'ISMAPCMC001' },
        { text: '호전환', value : 'ISMAPCMC008', dialog : 'TransCenter' },
        { text: '호전환(협업)', value : 'ISMAPCMC009' },
      ],

      list_common_code : [],
      common_code : [],

      SCH_CUTT_TYPE : new Array(3), //상담유형
      SCH_ALL_CUTT_TYPE : [], //상담유형(검색)
      SCH_CUTT_ZONE : new Array(3), //상담지역
      SCH_ALL_CUTT_ZONE : [], //상담지역(검색)
      SCH_CUTT_TYPE_PATH_NM : '', //선택된 상담유형명 FULL_PATH_NM

      CUTT_ITEMS : [],
      CUTT_TYPE_ITEMS : [],

      CUTT_ORG_ITEMS : [],
      CUTT_ZONE_ITEMS : [],

      DRWI_TYPE_CD : 'IN', //인입유형코드
      RCPT_CHN_CD : 'CVCT', //접수채널
      TICKET_ID: '',        //티켓ID = CHT_USER_KEY
      CHT_CUTT_ID: '',      //채팅상담id

      CUST_INFO : {}, //고객정보
      CUTT_CN_ALL : '', //상담메모
      textareaH : '', //상담메모 textarea 높이
      TMP_CUTT_CN : `
문)
답)`,
      CUTT_CN : `
문)
답)`,
      PHN_CUTT_ID : '', //상담 ID

      TRANS_EXT_NO : '', //호전환 대상 내선번호

      //접수부서, 접수자
      RCPT_DEPT_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_ID,
      RCPT_DEPT_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_NM,
      RCPT_CUSL_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID,
      RCPT_CUSL_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_NM,

      //처리부서, 처리자 - 스케줄러이관 시 담당자 지정하면 바뀜.
      PRCS_DEPT_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_ID, //처리부서
      PRCS_DEPT_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_NM, //처리부서
      PRCR_EMP_NO: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID, //처리자 ID
      PRCR_EMP_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_NM, //처리자

      CTI_INFO : {
        ARS_INFO : ''
        , PHN_NO : ''
        , CALL_ID : ''
        , CALL_TYPE : 2 //인바운드
      },

      UP_PHN_CUTT_ID : '', //상위 상담 ID
      RCPT_TRNSF_ID : '', //이첩 ID
      TRNSF_PRCS_STTS_CD : '', //이첩 이관 처리 상태 코드
      REQ_EMP_NO : '', //이첩 요청자 ID

      // 통화예약
      dialogCallReserve: false,
      RSRV_CUST_NM : '', //통화예약 고객명
      RSRV_TEL_NO : '', //통화예약 고객 전화번호
      RSRV_CNTNT : '', //예약내용
      RSRV_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      RSRV_TIME: '09:00',
      timeAmpm: '오후',

      // slide: 블랙컨슈머 응대 스크립트
      dialogResponseScript: false,

      CNTCT_RSLT_CD : 'ISMACTRT005', //접촉결과 코드

      // 제보요청
      modelChkRequest: [],
      modelChkRequestTime: '00:00',
      modelChkReason: '',
      // REC_FILE_PSTN_HR : '00:00:00', //제보 요청 시간

      PREV_CONN_ID : '', //이전 전화 연결 ID

      //민원접수 여부
      VOC_CHK: false,
      VOC_LIST: [], //민원 접수 유형 목록
      VOC_DV: '', //민원 접수 유형
      CVLCPT_RCPT_MNG_ID : '', //민원 접수 ID

      //배려 고객
      EXEC_CAUTION_LIST : [], //경고 구사 이력
      TEMP_CUST_BLOCK_YN : false, //임시 차단 여부

      RSRV_CUTT_YN : 'N', //통화예약 상담 여부

      afterFocus: false,
      afterKeyDown: 0,

      //공가해소콜백 업무구분
      CONTRACK_CHK:false,
      CONTRACK_TASK_LIST: [], //공가해소 계약 업무구분 목록
      CONTRACK_TASK_TP: '',
      CONTRACK_CALL_UCID:'', //콜 UCID
      CL_ID: '',//콜백에 등록된 ucid
      CALL_DATE: '',//콜백 등록 일자

      RCPT_PHN_ID : '', //전화 접수 ID
      RCPT_CLBK_ID : '', //콜백 접수 ID

      PHN_CVLCPT_ID: '',  // 종합 민원 ID

      TRANS_DATA : {}, //호전환 데이터
    }
  },
  computed: {
    dialogJobParts: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_SIDE_FINDMANAGER'];
      },
      set(data) {
        this.$store.dispatch('commonStore/AC_SIDE_FINDMANAGER', data);
      },
    },
  },
  watch: {
    'CUST_INFO.CUST_ID': function (NEW_CUST_ID, OLD_CUST_ID) {
      console.log('CUST_ID가 변경되었습니다:', OLD_CUST_ID, '→', NEW_CUST_ID);
      this.RSRV_CUST_NM = this.CUST_INFO.CUST_NM;
      this.RSRV_TEL_NO = this.CUST_INFO.CUST_PHN_NO;

      if(!this.CUST_INFO.CUST_SAVE_TO_CS_SAVE){//고객 정보 저장 이후 상담 저장
        this.init();
      }
    },
    'CUST_INFO.CALL_DATA': function (NEW_CALL_DATA, OLD_CALL_DATA) {
      console.log('CALL_DATA가 변경되었습니다:', OLD_CALL_DATA, '→', NEW_CALL_DATA);
      this.CUST_INFO.CALL_DATA = NEW_CALL_DATA;
      this.setCtiInfo(); //CTI 정보 셋팅
    },
    // CUST_INFO() {

    // },
    cuttEditAble() {
      this.init();
      this.editAble = this.cuttEditAble;
    },
    CUTT_CN() {
      this.$emit('sendCuttCn', this.CUTT_CN);
    },
    CHG_CUTT_CN() {
      this.CUTT_CN = this.CHG_CUTT_CN;
    },
    PRCS_CHN_CD() {

      if(this.PRCS_CHN_CD === 'ISMAPCMC001'){ //일반
        //상담완료
        this.PRCS_STTS_CD = 'ISMACNST009';
      }else if(this.PRCS_CHN_CD === 'ISMAPCMC008'){ //호전환
        //호전환 요청
        this.PRCS_STTS_CD = 'ISMACNST010';
      }else if(this.PRCS_CHN_CD === 'ISMAPCMC009'){ //호전환(현업)
        //호전환 요청
        this.PRCS_STTS_CD = 'ISMACNST010';
      }else if(this.PRCS_CHN_CD === 'ISMAPCMC007'){ //통화예약
        //예약완료
        this.PRCS_STTS_CD = 'ISMACNST006';
      }else if(this.PRCS_CHN_CD === 'ISMAPCMC006'){ //이첩
        //이첩요청
        this.PRCS_STTS_CD = 'ISMACNST003';
      }else if(this.PRCS_CHN_CD === 'ISMAPCMC010'){ //배려고객ARS
        //상담완료
        this.PRCS_STTS_CD = 'ISMACNST009';
      }else if(this.PRCS_CHN_CD === 'ISMAPCMC011'){ //운영단축
        //상담완료
        this.PRCS_STTS_CD = 'ISMACNST009';
      }

      if(this.PRCS_CHN_CD !== 'ISMAPCMC007'){ //통화예약이 아닌 경우
        this.RSRV_CUST_NM = this.CUST_INFO.CUST_NM;
        this.RSRV_TEL_NO = this.CUST_INFO.CUST_PHN_NO;
        this.RSRV_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.RSRV_TIME = '09:00';
        this.timeAmpm = '오후';
        this.RSRV_CNTNT = '';
        this.RSRV_YN = 'N';

        if(this.PRCS_CHN_CD !== 'ISMAPCMC006'){ //이첩이 아닌 경우
          this.PRCS_DEPT_ID = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_ID; //처리부서 ID
          this.PRCS_DEPT_NM = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_NM; //처리부서 명
          this.PRCR_EMP_NO = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID; //처리자 ID
          this.PRCR_EMP_NM = this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_NM; //처리자 명
        }
      }
    },

    RESET_ABLE() {
      // if(this.RESET_ABLE){
        this.init();
        this.editAble = false;
        this.PHN_CUTT_ID = '';
        this.CTI_INFO = {
          ARS_INFO : ''
          , PHN_NO : ''
          , CALL_ID : ''
          , CALL_TYPE : 2 //인바운드드
        }; //CTI 받아온 값
        this.CUST_INFO.CALL_DATA = '';
      // }
    },

    SAVE_AFTER_ACTION() {
      console.log('SAVE_AFTER_ACTION : ', this.SAVE_AFTER_ACTION);
    },

    //제보요청 시간
    modelChkRequest(){
      if(this.modelChkRequest.length > 0){
        if(this.CUTT_TIME !== '00:00:00'){
          let HHMMSS = this.mixin_seconds_toHHMMSS(this.mixin_timeToSec(this.CUTT_TIME));
          if(Number(HHMMSS.split(':')[0]) > 0){
            let sMM = (Number(HHMMSS.split(':')[0]) * 60) + HHMMSS.split(':')[1];
            this.modelChkRequestTime = sMM+':'+HHMMSS.split(':')[2];
          }else{
            this.modelChkRequestTime = HHMMSS.split(':')[1]+':'+HHMMSS.split(':')[2];
          }
        }else{
          this.modelChkRequestTime = '00:00';
        }
      }else if(this.modelChkRequest.length === 0){
        this.modelChkRequestTime = '00:00';
        this.modelChkReason = '';
      }
    },

    CTI_CALL_STAT() {
      setTimeout(() => {
        this.PRCS_CHN_LIST = this.setPrcsChnList(); //센터별 처리방법 목록
      }, 500);
    },

    editAble(){
      setTimeout(() => {
        this.PRCS_CHN_LIST = this.setPrcsChnList(); //센터별 처리방법 목록
      }, 500);
    },

    VOC_CHK(){
      if(!this.VOC_CHK){
        this.VOC_DV = '';
      } 
    }
  },
  mounted() {

  },
  beforeDestroy(){
    this.$eventBus.$off("setCuttCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("addCuttCnTransfInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("addCuttCnReduceOper"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("addCuttCn"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("orgCuttSelect"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setRcvId"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("chatMessagePaste"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CUST_CAUTION_HIST"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("TEMP_CUST_BLOCK_YN"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CloseBalckArs"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCallId"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setSttAutoCuttInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuttPrcsList"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("addTrnsfInfoCuttCn"); //eventBus 중복방지를 위해 off
  },
  async created() {
    this.$emit('sendCuttCn', this.CUTT_CN); //관심지역 등록 수정시 상담메모 내용 필요로 인해 최초 전송

    //처리방법 배려고객 ARS 비활성화 처리
    this.$eventBus.$on("setCuttPrcsList", () => {
      this.PRCS_CHN_LIST.forEach((item, idx) => {
        if(item.value === 'ISMAPCMC010'){
          item.disabled = true;
        }
      });
    });

    //STT 추천 상담 유형 및 상담내용
    this.$eventBus.$on("setSttAutoCuttInfo", (autoData) => {

      if( !this.mixin_isEmpty(autoData.ALL_CUTT_TYPE) ) {
        this.SCH_CUTT_TYPE = autoData.ALL_CUTT_TYPE;
        this.SCH_ALL_CUTT_TYPE = autoData.ALL_CUTT_TYPE;

        setTimeout(() => {
          this.$eventBus.$emit('setCuttTypeTxt');
        }, 500);
      }
      if( !this.mixin_isEmpty(autoData.CUTT_CN) ) {
        this.CUTT_CN = this.CUTT_CN + '\n' + autoData.CUTT_CN;
      }
    });

    //호전환시 상담메모 추가
    this.$eventBus.$on("addTrnsfInfoCuttCn", (item) => {
      this.addTrnsfInfoCuttCn(item);
    });

    //배려곡ARS 닫기
    this.$eventBus.$on("CloseBalckArs", () => {
      this.mixin_hideDialog('BalckArs');
      this.TEMP_CUST_BLOCK_YN = true;
    });

    //호전환 dialog 닫기
    this.$eventBus.$on("CloseTransCenter", () => {
      this.$eventBus.$emit('closeCallId', {CALL_ID: ipronCallUtil.CALL_ID});
      this.mixin_hideDialog('TransCenter');
    });

    //아웃바운드시 CALL_ID 가져오기
    this.$eventBus.$on("setCallId", (data) => {
      console.log('아웃바운드시 CALL_ID 가져오기 : ', data.CALL_ID);
      this.CALL_ID = data.CALL_ID;
      this.CTI_INFO.CALL_ID = data.CALL_ID;
      this.CTI_INFO.CALL_TYPE = 3; //아웃바운드
      if('CALL_DATA' in this.CUST_INFO){
        this.CUST_INFO.CALL_DATA.CALL_ID = data.CALL_ID;
        this.CUST_INFO.CALL_DATA.OB_CALL = true; //아웃바운드
      }

      if(this.CTI_INFO.CALL_TYPE) this.DRWI_TYPE_CD = this.CTI_INFO.CALL_TYPE === 2 ? 'IN':'OUT';
    });

    //인바운드 또는 고객정보 검색후 고객정보 셋팅시 호출된 DATA
    this.$eventBus.$on("setCuttCustInfo", (CUST_INFO) => {
      this.CUST_INFO = CUST_INFO;

      if(CUST_INFO.RSRV_CUTT_YN) this.RSRV_CUTT_YN = CUST_INFO.RSRV_CUTT_YN;
      else this.RSRV_CUTT_YN = 'N';

      if(CUST_INFO.CUST_SAVE_TO_CS_SAVE){//고객 정보 저장 이후 상담 저장
        this.cuttRegValid();
      }
    });

    //이첩 대상자 정보 상담메모 추가
    this.$eventBus.$on("addCuttCnTransfInfo", (TRANSF_INFO) => {

      if(TRANSF_INFO.USER_ID === this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID){
        this.showAlertInfo({msg: '이첩 대상자로 본인을 선택할 수 없습니다.<br>다른 이첩 대상자를 선택해 주세요.'});
        return;
      }else{
        this.CUTT_CN = this.CUTT_CN + '\n*' + TRANSF_INFO.DEPT_NM + ' [ ' + TRANSF_INFO.USER_NM + ' ]_이첩';

        //처리자 변경
        this.PRCS_DEPT_ID = TRANSF_INFO.DEPT_ID; //처리부서 ID
        this.PRCS_DEPT_NM = TRANSF_INFO.DEPT_NM; //처리부서 명
        this.PRCR_EMP_NO = TRANSF_INFO.USER_ID; //처리자 ID
        this.PRCR_EMP_NM = TRANSF_INFO.USER_NM; //처리자 명

        this.mixin_hideDialog('TransManager');
      }
    });

    //운영단축 상담메모 추가
    this.$eventBus.$on("addCuttCnReduceOper", (DATA) => {
      this.CUTT_CN = this.CUTT_CN + '\n' + DATA;
    });

    //상담도구 상담메모 추가
    this.$eventBus.$on("addCuttCn", (item) => {
      this.SCH_ALL_CUTT_TYPE = [];
      this.SCH_CUTT_TYPE = new Array(3);

      this.SCH_CUTT_TYPE[0] = item.CUTT_LCD;
      this.SCH_CUTT_TYPE[1] = item.CUTT_MCD;
      this.SCH_CUTT_TYPE[2] = item.CUTT_SCD;

      this.SCH_ALL_CUTT_TYPE = this.SCH_CUTT_TYPE;

      setTimeout(() => {
        this.$eventBus.$emit('setCuttTypeTxt');
      }, 500);

      this.CUTT_CN = item.CONTENTS;
    });

    //상담ID로 상담 정보 조회
    this.$eventBus.$on("orgCuttSelect", (item) => {
      console.log('item : ', item);

      setTimeout(() => {
        if('UP_PHN_CUTT_ID' in item) this.UP_PHN_CUTT_ID = item.UP_PHN_CUTT_ID;
        if('PRCS_STTS_CD' in item) this.TRNSF_PRCS_STTS_CD = item.PRCS_STTS_CD;
        if('REQ_EMP_NO' in item) this.REQ_EMP_NO = item.REQ_EMP_NO;
        if('RCPT_TRNSF_ID' in item) this.RCPT_TRNSF_ID = item.RCPT_TRNSF_ID;
        if('RCPT_PHN_ID' in item){
          this.RCPT_PHN_ID = item.RCPT_PHN_ID;
          this.RCPT_CHN_CD = 'CVCT';
        }
        if('RCPT_CLBK_ID' in item) this.RCPT_CLBK_ID = item.RCPT_CLBK_ID;
        
        if('CL_ID' in item) this.CL_ID = item.CL_ID;
        else this.CL_ID = '';

        if('CALL_DATE' in item) this.CALL_DATE = item.CALL_DATE;
        if('CTI_INFO' in item) this.CTI_INFO.PHN_NO = item.CTI_INFO.PHN_NO;

        if(item.PHN_CUTT_ID) this.cuttSelect(item.PHN_CUTT_ID);
        this.editAble = true;
      }, 500);
    });

    //접수 ID 셋
    this.$eventBus.$on("setRcvId", (DATA) => {
      console.log('setRcvId : ', DATA);
      if(DATA.RCV_TP === 'RCPT_PHN_ID'){ //전화
        this.RCPT_PHN_ID = DATA.RCV_ID;
        this.RCPT_CHN_CD = 'CVCT';
      }else if(DATA.RCV_TP === 'RCPT_CLBK_ID'){ //콜백
        this.RCPT_CLBK_ID = DATA.RCV_ID;
        this.RCPT_CHN_CD = 'CVCT';
      }else if(DATA.RCV_TP === 'RCPT_ETC_ID'){ //기타
        this.RCPT_ETC_ID = DATA.RCV_ID;
      }
    });

    this.$eventBus.$on('chatMessagePaste' , (type, message) => {
      //상담중 상태에서만 붙여넣기 처리.
        if(!this.editAble) {
          this.showToastInfo({msg : '상담 중일 때 사용가능합니다.'})
        } else {
          message = message.replace(/(?:\r\n|\r|\n)/g, "\n")
          if(type === "NEW") {
            //새로 붙이기
            this.CUTT_CN = message;
          } else {
            //이어 붙이기
            // this.CUTT_CN += message;
            const textarea = this.$refs.CUTT_CN.$refs.input;  // textarea의 실제 DOM 요소 참조
            const orgString = this.CUTT_CN;
            let start = this.afterFocus ? textarea.selectionStart : 0
            let end = this.afterFocus ? textarea.selectionEnd : 0
            let nextLineCnt = (orgString.substring(0, start).match(/\n/g) || []).length
            // 현재 텍스트에서 커서 위치에 새 텍스트를 삽입
            this.CUTT_CN = orgString.substring(0, this.afterKeyDown ? start : start+nextLineCnt ) + message + orgString.slice(this.afterKeyDown ? end : end+nextLineCnt );

            // 삽입 후 커서 위치 업데이트
            this.$nextTick(() => {
              this.$refs.CUTT_CN.$refs.input.setSelectionRange(start + message.length, start + message.length);
              this.$refs.CUTT_CN.$refs.input.focus();
            });
          }
          this.setFocus('CUTT_CN');
        }
    });

    this.$eventBus.$on("CUST_CAUTION_HIST", (EXEC_CAUTION_LIST) => {
      this.EXEC_CAUTION_LIST = EXEC_CAUTION_LIST;
    });

    //공통코드설정
    let codeName = ['CVC', 'PCMC']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    let codeName2 = ['RECM', 'VOC_DV', 'CALLBACK_TASK_TP']; //제보유형, 민원유형, 공가해소콜백 업무구분
    this.common_code = await this.mixin_common_code_get_all(codeName2);

    let vocList = this.mixin_common_code_get(this.common_code, 'VOC_DV', '');

    this.VOC_LIST = [];
    vocList.forEach((item, idx) => {
      if(item.cd_vl1 === 'Y') this.VOC_LIST.push({text:item.text, value: item.value});
    });

    let contrackTaskList = this.mixin_common_code_get(this.common_code, 'CALLBACK_TASK_TP', '');

    this.CONTRACK_TASK_LIST = [];
    contrackTaskList.forEach((item, idx) => {
      if(item.value === 'CS002' || item.value === 'CS003' || item.value === 'CS004' || item.value === 'CS005') this.CONTRACK_TASK_LIST.push({text:item.text, value: item.value});
    });    

    this.init(); //초기화

    //채팅에서 고객정보 조회 -> 새상담,카카오톡,티켓id 넣어준다
    this.$eventBus.$on("newCuttOnCsInfoTable", (chtUserKey,chnl,chtCuttId) => {
      if(chnl == 'KAKAO'){
        this.RCPT_CHN_CD = 'CVCK';
      } else if (chnl == 'MO'){
        this.RCPT_CHN_CD = 'CVCS';
      } else if (chnl == 'EMAIL'){
        this.RCPT_CHN_CD = 'CVCE';
      }
      this.TICKET_ID = chtUserKey;
      this.CHT_CUTT_ID = chtCuttId;
    });
  },
  methods: {
    //초기화
    init() {
      console.log('상담영역 초기화');
      this.RCPT_CHN_CD = 'CVCT'; //상담채널
      this.PRVC_CLCT_AGRE_YN = ''; //개인정보수집 동의 여부

      this.UP_PHN_CUTT_ID = ''; //상위 상담 ID
      this.RCPT_TRNSF_ID = ''; //이첩 ID
      this.TRNSF_PRCS_STTS_CD = ''; //이첩 이관 처리 상태 코드
      this.REQ_EMP_NO = ''; //이첩 요청자 ID

      // this.CTI_INFO = {
      //   ARS_INFO : ''
      //   , PHN_NO : ''
      //   , CALL_ID : ''
      //   , CALL_TYPE : 2 //인바운드드
      // }; //CTI 받아온 값

      if(this.CTI_INFO.CALL_TYPE) this.DRWI_TYPE_CD = this.CTI_INFO.CALL_TYPE === 2 ? 'IN':'OUT';

      this.PRCS_CHN_LIST = this.setPrcsChnList(); //센터별 처리방법 목록
      this.PRCS_CHN_CD = 'ISMAPCMC001'; //처리방법 코드(일반)

      this.SCH_ALL_CUTT_TYPE = [], //상담유형
      this.SCH_CUTT_TYPE.forEach((cuttType, idx) => {
        this.SCH_CUTT_TYPE[idx] = '';
      });

      this.SCH_ALL_CUTT_ZONE = ['99999','99996','-99996']; //지역없음>없음>없음
      this.SCH_CUTT_ZONE[0] = 99999;
      this.SCH_CUTT_ZONE[1] = 99996;
      this.SCH_CUTT_ZONE[2] = -99996;
      // this.changeCuttZoneSch();

      this.CUTT_CN = this.TMP_CUTT_CN; //상담메모

      //제보요청
      this.modelChkRequest = [];
      this.modelChkRequestTime = '00:00';
      this.modelChkReason = '';

      //민원접수 여부
      this.VOC_CHK = false;
      this.VOC_DV = ''; //민원 접수 유형
      this.CVLCPT_RCPT_MNG_ID = ''; //민원 접수 ID

      this.EXEC_CAUTION_LIST = []; //경고 구사 이력
      this.TEMP_CUST_BLOCK_YN = false; //임시 차단 여부

      this.CONTRACK_CHK = false;
      this.CONTRACK_TASK_TP = '';
      this.CONTRACK_CALL_UCID = ''; //콜 UCID
      this.RCPT_CLBK_ID = '';
      // this.CL_ID = ''; //콜백에 등록된 ucid
      this.CALL_DATE = ''; //콜백 등록 일자

      this.CTI_INFO.PHN_NO = '';

      this.PHN_CVLCPT_ID = ''; // 종합민원ID

      this.setCtiInfo(); //CTI 정보 셋팅

      this.TRANS_DATA = {}; //호전환 데이터
    },

    //CTI 정보 셋팅
    setCtiInfo(){
      if(this.CUST_INFO.CALL_DATA){
        console.log('this.CUST_INFO.CALL_DATA : ', this.CUST_INFO.CALL_DATA);
        this.CTI_INFO = {
          ARS_INFO : this.CUST_INFO.CALL_DATA.extensiondata ? this.CUST_INFO.CALL_DATA.extensiondata.UEI20[0] : '' //접속정보
          , PHN_NO : this.CUST_INFO.CALL_DATA.ani //인입번호
          , CALL_ID : this.CUST_INFO.CALL_DATA.CALL_ID ? this.CUST_INFO.CALL_DATA.CALL_ID : '' //CALL_ID
          , CALL_TYPE : this.CUST_INFO.CALL_DATA.OB_CALL ? 3 : 2 //CALL_TYPE
        };
        if(this.CTI_INFO.CALL_TYPE) this.DRWI_TYPE_CD = this.CTI_INFO.CALL_TYPE === 2 ? 'IN':'OUT';
        if(!this.PRVC_CLCT_AGRE_YN) this.PRVC_CLCT_AGRE_YN = this.CUST_INFO.CALL_DATA.extensiondata ? this.CUST_INFO.CALL_DATA.extensiondata.UEI22[0] : 'N'; //개인정보수집 동의여부
        this.editAble = true;

        if(this.CUST_INFO.CALL_DATA.extensiondata){
          if('UEI21' in this.CUST_INFO.CALL_DATA.extensiondata){ //지사 인입 연결 센터명 (오후 5시부터 마이홈 서비스로 인입 - 운영단축)
            this.CTI_INFO.ARS_INFO = this.CUST_INFO.CALL_DATA.extensiondata.UEI21[0];
            this.PRCS_CHN_CD = 'ISMAPCMC011'; //운영단축

            this.$eventBus.$emit('reduceOprerationCn', true);
          }
        }

        if(this.CUST_INFO.CALL_DATA.CVLCPT_RCPT_MNG_ID) this.CVLCPT_RCPT_MNG_ID = this.CUST_INFO.CALL_DATA.CVLCPT_RCPT_MNG_ID; //민원 접수 ID
      }
    },

    //상담 정보 조회
    async cuttSelect(PHN_CUTT_ID){
      let postParam = {
        SCH_CUSTCO_ID : this.computedUserCenter
        , PHN_CUTT_ID : PHN_CUTT_ID
      };

      console.log('this.TRNSF_PRCS_STTS_CD : ', this.TRNSF_PRCS_STTS_CD);
      if(this.TRNSF_PRCS_STTS_CD){
        postParam.SAVE_PRCS_CHN_CD = 'ISMAPCMC006'; //처리 채널 코드(이첩)
        postParam.PRCS_STTS_CD = 'ISMACNST004'; //이첩접수
        postParam.TRNSF_PRCS_STTS_CD = this.TRNSF_PRCS_STTS_CD;
        postParam.REQ_EMP_NO = this.REQ_EMP_NO;
        postParam.TRNSF_PROC = 'Y';
      }

      let headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/cutt/selectCuttHistDetail", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          let item = response.DATA[0];
          this.CALL_ID = item.CALL_ID; //콜 ID
          this.ARS_INFO = item.ARS_INFO; //접속정보
          this.CUST_PHN_NO = item.CUST_PHN_NO; //인입번호
          this.PHN_CUTT_ID = item.PHN_CUTT_ID; //상담 ID
          this.DRWI_TYPE_CD = item.DRWI_TYPE_CD; //상담채널 IN,OUT
          this.RCPT_CHN_CD = item.RCPT_CHN_CD; //상담채널(접수채널)
          this.PRVC_CLCT_AGRE_YN = item.PRVC_CLCT_AGRE_YN; //개인정보 수집동의 여부
          this.PRCS_CHN_CD = (item.PRCS_CHN_CD === 'ISMAPCMC006' ? 'ISMAPCMC001' : item.PRCS_CHN_CD); //처리 방법 코드
          this.CUTT_CN = item.CUTT_CN; //상담메모
          this.textareaH = item.textareaH; //상담메모 textarea 높이

          //상담 유형
          if(item.FULL_CUTT_TYPE_ID){
            if(item.FULL_CUTT_TYPE_ID.split(',').length !== 3){
              for(let i=0; i<item.FULL_CUTT_TYPE_ID.split(',').length; i++){
                this.SCH_CUTT_TYPE[i] = item.FULL_CUTT_TYPE_ID.split(',')[i];
              }
            }else{
              this.SCH_CUTT_TYPE = item.FULL_CUTT_TYPE_ID.split(',');
              this.SCH_ALL_CUTT_TYPE = item.FULL_CUTT_TYPE_ID.split(',');
            }
          }

          //상담 지역
          if(!item.CTPV_CD || !item.SGG_CD || !item.DSTRCT_CD){
            if(item.CTPV_CD) this.SCH_CUTT_ZONE[0] = item.CTPV_CD;
            if(item.SGG_CD) this.SCH_CUTT_ZONE[1] = item.SGG_CD;
            if(item.DSTRCT_CD) this.SCH_CUTT_ZONE[2] = item.DSTRCT_CD;
          }else{
            this.SCH_CUTT_ZONE = [item.CTPV_CD, item.SGG_CD, item.DSTRCT_CD];
            this.SCH_ALL_CUTT_ZONE = [item.CTPV_CD, item.SGG_CD, item.DSTRCT_CD];
          }

          setTimeout(() => {this.$eventBus.$emit('setCuttTypeTxt');}, 500);

          this.$store.commit("statusStore/MU_CUTT_ING", true);
        }
      }
    },

    //센터별 처리방법 목록
    setPrcsChnList() {
      let tempPrcsChnList = this.mixin_common_code_get_global(this.list_common_code, 'PCMC', this.computedUserCenter);

      let arrPrcsChnList = [];
      tempPrcsChnList.forEach((code, idx) => {
        if(code.cd_vl === 'Y'){
          if(code.value === 'ISMAPCMC006'){ //이첩
            code.dialog = 'TransManager';
          }else if(code.value === 'ISMAPCMC007'){ //통화예약
            code.dialog = 'CallReserve';
          }else if(code.value === 'ISMAPCMC008'){ //호전환
            code.dialog = 'TransCenter';
          }else if(code.value === 'ISMAPCMC010'){ //배려고객ARS
            code.dialog = 'BalckArs';
          }

          if(!this.CUST_INFO.CUST_ID){ //고객 ID가 없는 경우 비활성화
            code.disabled = true;
          }else{ //고객 ID가 있는 경우
            if(!this.editAble){
              code.disabled = true;
            }else{
              if(code.value === 'ISMAPCMC001' || code.value === 'ISMAPCMC006' || code.value === 'ISMAPCMC008' || code.value === 'ISMAPCMC009' || code.value === 'ISMAPCMC007'){ //일반,이첩,호전환, 호전환(협업), 통화예약은 항상 활성화
                code.disabled = !this.editAble;
              }else{
                const ctiNum = Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, ''));
                const codeNum = Number(code.value.replace(/[^0-9]/g, ''));
                if(ctiNum > 1){ //CTI 연결한 상태
                  if(ctiNum === 6){ //통화중
                    code.disabled = false;
                  }else{ //통화중이 아닌 경우
                    if(codeNum === 8 || codeNum === 9 || codeNum === 11){ //호전환, 호전환(협업), 운영단축
                      code.disabled = true;
                    }else{
                      code.disabled = false;
                    }
                  }
                }else{ //CTI 로그아웃
                  code.disabled = true;
                }
              }
            }
          }

          arrPrcsChnList.push(code);
        }
      });

      let result = arrPrcsChnList.sort((a, b) => a.cd_vl2.toLowerCase() < b.cd_vl2.toLowerCase() ? -1 : 1);
      return result;
    },

    showRightSlide(){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogJobParts', active:false});
    },

    //상담메모에 적용
    setAddCuttCn(item){
      let addZoneCn = this.CUTT_CN.split('\n')
      addZoneCn[0] = item
      this.CUTT_CN = addZoneCn.join('\n');
    },
    
    //호전화시 상담메모에 추가
    addTrnsfInfoCuttCn(item){
      //호전환 구분(1:호전환,2:그룹 전환,3:호전환(현업))
      if(item.TRNSF_GB === 1){
        this.CUTT_CN = this.CUTT_CN + '\n' + '*'+item.DEPT_NM+' [' + item.USER_NM +']_호전환';
      }else if(item.TRNSF_GB === 2){
        this.CUTT_CN = this.CUTT_CN + '\n' + '*'+item.GROUP_NM+' 그룹 전환';
      }else if(item.TRNSF_GB === 3){
        this.CUTT_CN = this.CUTT_CN + '\n' + '*'+(this.mixin_isEmpty(item.DEPT_WHOL_PATH)?'':item.DEPT_WHOL_PATH)+' [' + (this.mixin_isEmpty(item.USER_NM)?'':item.USER_NM) +'('+ item.TRANS_TEL_NO+')]_호전환(현업)';
      }
    },

    //호전환 전화번호 Set
    setTransPhnNo(item){
      console.log('setTransPhnNo : ', item);
      this.TRANS_DATA = item;
      // if(item.AGENT_STATUS === '대기'){
        if(item.EXT_NO === this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO){
          this.showAlertInfo({msg : '본인에게는 호전환 시도를 할 수 없습니다.'});
          return;
        }else{
          this.TRANS_EXT_NO = item.EXT_NO;
        }
      // }else{
      //   this.showAlertInfo({msg : 'CTI 상태가 <font color="red"><b>대기</b></font> 상태인 대상자만 호전환 시도가 가능 합니다.'});
      //   return;
      // }
    },

    //호전환 전환시도
    tryTrans() {
      if(this.TRANS_EXT_NO){

        this.PREV_CONN_ID = ipronCallUtil.ConnId;
        ipronCallUtil.PREV_CALL_ID = this.CTI_INFO.CALL_ID;

        ipronCallUtil.holdCall();

        ipronCallUtil.createExtension(); //extension 생성
        ipron.EXTAddRecord(ipronCallUtil.newExHandle, 'CUSTCO_NM', this.$store.getters["userStore/GE_USER_ROLE"].CUSTCO_NM);
        ipron.EXTAddRecord(ipronCallUtil.newExHandle, 'DEPT_NM', this.$store.getters["userStore/GE_USER_ROLE"].DEPT_NM);
        ipron.EXTAddRecord(ipronCallUtil.newExHandle, 'USER_NM', this.$store.getters["userStore/GE_USER_ROLE"].USER_NM);
        ipron.EXTAddRecord(ipronCallUtil.newExHandle, 'EXT_NO', this.$store.getters["userStore/GE_USER_ROLE"].EXT_NO);

        ipronCallUtil.obCall(this.TRANS_EXT_NO, ipronCallUtil.newExHandle);
      }else{
        this.showAlertInfo({msg: '호전환할 내선번호가 존재하지 않습니다.'});
        return;
      }
    },

    //호전환
    transExtNo() {
      if(this.TRANS_EXT_NO){
        ipronCallUtil.transferMuteCall(this.TRANS_EXT_NO, this.PREV_CONN_ID);

        this.TRANS_DATA.TRNSF_GB = 1;//호전환 구분(1:호전환,2:그룹전환,3:호전환(현업))
        this.addTrnsfInfoCuttCn(this.TRANS_DATA);

        this.mixin_hideDialog('TransCenter');
      }else{
        this.showAlertInfo({msg: '호전환할 내선번호가 존재하지 않습니다.'});
        return;
      }
    },

    //전환 취소
    transCancel() {
      ipronCallUtil.retrieveCall(this.PREV_CONN_ID); //보류해제
      ipronCallUtil.clearCall();//호전환 취소
    },

    //상담 저장 Validation
    cuttRegValid() {
      if(!this.DRWI_TYPE_CD || !this.RCPT_CHN_CD){
        this.showAlertInfo({msg: '상담채널을 선택해 주세요.'});
        return;
      }
      if(!this.PRVC_CLCT_AGRE_YN){
        this.showAlertInfo({msg: '개인정보수집 동의 여부를 선택해 주세요.'});
        return;
      }
      if(!this.SCH_CUTT_TYPE[0] || !this.SCH_CUTT_TYPE[1] || !this.SCH_CUTT_TYPE[2]){
        this.showAlertInfo({msg: '상담유형을 소분류까지 선택하세요.'});
        return;
      }
      if(!this.PRCS_CHN_CD){
        this.showAlertInfo({msg: '처리방법을 선택해 주세요.'});
        return;
      }
      if(!this.SCH_CUTT_ZONE[0] || !this.SCH_CUTT_ZONE[1] || !this.SCH_CUTT_ZONE[2]){
        this.showAlertInfo({msg: '상담지역 소분류까지 선택하세요.'});
        return;
      }
      if(!this.CUTT_CN){
        this.showAlertInfo({msg: '상담메모를 입력해 주세요.'});
        return;
      }

      //처리방법을 이첩으로 선택 후 대상자를 지정하지 않은 경우
      if(this.PRCS_CHN_CD === 'ISMAPCMC006'){
        if(this.PRCR_EMP_NO === this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID){
          this.showAlertInfo({msg: '이첩 대상자를 선택해 주세요.'});
          return;
        }
      }

      if(this.modelChkRequest.length > 0){
        if(!this.modelChkRequestTime){
          this.showAlertInfo({msg: '제보 요청 시간을 입력해 주세요.'});
          return;
        }else{
          if(this.modelChkRequestTime.indexOf(':') > -1){
            if(this.modelChkRequestTime.split(':').length !== 2){
              this.showAlertInfo({msg: '제보 요청 시간 입력 유형은 "00:00" 형태로 입력해 주세요.'});
              return;
            }else{
              if(isNaN(this.mixin_timeToSec(this.modelChkRequestTime))){
                this.showAlertInfo({msg: '제보 요청 시간은 숫자와 ":" 문자만 입력 가능 합니다.'});
                return;
              }else{
                //칭찬콜은 제보 사유 필수 입력 제외 
                const isRecm2Call = this.modelChkRequest.length == 1 && this.modelChkRequest[0].value == "RECM2" ? true : false;
                if(!isRecm2Call && !this.modelChkReason.trim()){
                  this.showAlertInfo({msg: '제보 요청 사유를 입력해 주세요.'});
                  return;
                }
              }
            }
          }else{
            this.showAlertInfo({msg: '제보 요청 시간 입력 유형은 "00:00" 형태로 입력해 주세요.'});
            return;
          }
        }
      }

      if(this.VOC_CHK){ //민원 접수 인 경우
        if(!this.VOC_DV){
          this.showAlertInfo({msg: '민원 접수 유형을 선택해 주세요.'});
          return;
        }
      }
      
      if(this.computedUserCenter === '2'){ //공가해소인경우
        if(this.RCPT_CLBK_ID){
          if(this.CONTRACK_CHK){ //계약희망여부
            if(!this.CONTRACK_TASK_TP){
              this.showAlertInfo({msg: '계약희망 여부를 선택해 주세요.'});
              return;
            }
          }
        }
      }

      // if(this.PRCS_CHN_CD === 'ISMAPCMC010'){ //배려고객 ARS
      //   if(this.EXEC_CAUTION_LIST.length === 0 && !this.TEMP_CUST_BLOCK_YN){
      //     this.showAlertInfo({msg: '배려고객 임시차단 내역과 배려고객 경고 구사 이력이 존재 하지 않습니다.'});
      //     return;
      //   }
      // }

      this.showAlert({
        alertDialogToggle: true
        , msg: '상담내용을 저장 하시겠습니까?'
        , iconClass: 'is-info'
        , type: 'confirm'
        , callYes: () => {
          this.cuttSave();
        }
        , callNo: () => {
          this.closeMsg();
        }
      });
    },

    //상담저장 처리
    async cuttSave(){
      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , UP_PHN_CUTT_ID : this.UP_PHN_CUTT_ID //상위 상담 ID
        , RCPT_TRNSF_ID : this.RCPT_TRNSF_ID //이첩 ID
        , CUST_ID : this.CUST_INFO.CUST_ID //고객 ID
        , LAST_PHN_NO: (this.CTI_INFO.PHN_NO !== '' ? this.CTI_INFO.PHN_NO : this.CUST_INFO.CUST_PHN_NO).replace(/[^0-9]/g, '')
        , DRWI_TYPE_CD : this.DRWI_TYPE_CD //콜 유형(IN, OUT)
        , RCPT_PHN_ID : this.RCPT_PHN_ID //전화접수 ID
        , RCPT_CHN_CD : this.RCPT_CHN_CD //접수채널코드
        , RCPT_CLBK_ID : this.RCPT_CLBK_ID //콜백접수 ID
        , PRVC_CLCT_AGRE_YN : this.mixin_isEmpty(this.PRVC_CLCT_AGRE_YN)?'N':this.PRVC_CLCT_AGRE_YN //개인정보수집 동의 여부
        , ARS_INFO : this.CTI_INFO.ARS_INFO //접속정보(CTI에서 넘어온 값)
        , CALL_ID : this.CTI_INFO.CALL_ID //CALL ID
        , CPLMT_CL_YN : 'N' //칭찬콜 여부
        , AUTO_CL_YN : 'N' //오토콜 여부
        , FORC_CRT_YN : !this.CTI_INFO.CALL_ID ? 'Y' : 'N' //CALL_ID가 없으면 강제 등록
        , CNSLT_DIV_CD_1 : this.SCH_CUTT_TYPE[0] //상담유형 1Dept 코드
        , CNSLT_DIV_CD_2 : this.SCH_CUTT_TYPE[1] //상담유형 2Dept 코드
        , CNSLT_DIV_CD_3 : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CUTT_TYPE_ID : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CNSLT_DIV_PATH_NM : this.SCH_CUTT_TYPE_PATH_NM.replace(/\>/g, ' -> ') //상담유형 FULL_PATH
        , PRCS_CHN_CD : this.PRCS_CHN_CD //처리방법
        , PRCS_STTS_CD : this.PRCS_STTS_CD //처리상태 코드
        , CTPV_CD : this.SCH_CUTT_ZONE[0] //상담지역(시도)
        , SGG_CD : this.SCH_CUTT_ZONE[1] //상담지역(시군구)
        , DSTRCT_CD : this.SCH_CUTT_ZONE[2] //상담지역(지구)
        , CUTT_CN : this.CUTT_CN //상담메모
        , RCPT_DEPT_ID: this.RCPT_DEPT_ID //접수_부서_ID
        , PRCS_DEPT_ID: this.PRCS_DEPT_ID //처리_부서_ID
        , PRCR_EMP_NO: this.PRCR_EMP_NO //처리자_사원_번호
        , CNTCT_RSLT_CD : this.CNTCT_RSLT_CD //접촉결과 코드
        , CALL_ST_DT : this.CALL_ST_DT //호 연결 시작 시간
        , CALL_END_DT : this.CALL_END_DT //호 연결 종료 시간
        , PHN_HR : this.mixin_timeToSec(this.CUTT_TIME) //상담 시간
        , AFTPRCS_HR : this.mixin_timeToSec(this.AFT_PROC_TIME) //후처리 시간
        , CVLCPT_RCPT_MNG_ID : this.CVLCPT_RCPT_MNG_ID //민원 접수 ID
        , RSRV_CUTT_YN : this.RSRV_CUTT_YN //통화예약 상담 여부
        , CUTT_BGNG_DT : this.CALL_ST_DT //호 연결 시작 시간
        , CUTT_END_DT : this.CALL_END_DT //호 연결 종료 시간

        , CHT_CUTT_ID: this.RCPT_CHN_CD == 'CVCK' || this.RCPT_CHN_CD == 'CVCS' || this.RCPT_CHN_CD == 'CVCE' ? this.CHT_CUTT_ID : ''
        , KAKAO_CHT_ID: this.RCPT_CHN_CD == 'CVCK' || this.RCPT_CHN_CD == 'CVCS' || this.RCPT_CHN_CD == 'CVCE' ? this.TICKET_ID : ''

        , PHN_CVLCPT_ID: this.PHN_CVLCPT_ID // 종합 민원 ID
      }

      if(this.PRCS_CHN_CD === 'ISMAPCMC007'){ //통화예약
        postParam.RSRV_CUST_NM = this.RSRV_CUST_NM; //통화예약 고객명
        postParam.RSRV_TEL_NO = this.RSRV_TEL_NO.replace(/[^0-9]/g, ''); //통화예약 고객 전화번호
        postParam.RSRV_DT = (this.RSRV_DT + this.RSRV_TIME).replace(/[^0-9]/g, '') + '00'; //통화예약 일시
        postParam.RSRV_CNTNT = this.RSRV_CNTNT; //예약내용
        postParam.RSRV_YN = 'Y'; //예약여부
      }

      if(this.modelChkRequest.length > 0){ //제보 요청이 있는 경우
        postParam.CUTT_GVIFMT = JSON.stringify(this.modelChkRequest);
        postParam.GVIFMT_CN = this.modelChkRequestTime + '/' + this.modelChkReason;
      }

      if(!this.CVLCPT_RCPT_MNG_ID){ //민원 접수를 통한 상담이 아닌 경우
        if(this.VOC_CHK){ //민원 접수인 경우
          postParam.CVLCPT_SE_CD = this.VOC_DV;
          postParam.CVLCPT_RCPT_PATH_CD = 'WIRED'; //접수 경로(유선)
        }
      }

      if(this.PRCS_CHN_CD === 'ISMAPCMC010'){ //배려고객 ARS
        postParam.EXEC_CAUTION_LIST = JSON.stringify(this.EXEC_CAUTION_LIST);
        postParam.CAUTION_CUST_STTS_CD = this.TEMP_CUST_BLOCK_YN?'REQ01':''; //임시차단인 경우 상태값 임시차단(REQ01)
      }

      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/cutt/cuttProc', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        //고객정보 컴포넌트에 CUST_SAVE_TO_CS_SAVE 값 false로 지정
        this.$eventBus.$emit('setSaveEvtReset');
        //상담이력 탭으로 이동 및 새로고침
        this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: this.CUST_INFO, CUTT_HIST_RELOAD:true});

        //이첩인 경우 전광판 이첩 현황 새로고침
        if(this.PRCS_CHN_CD === 'ISMAPCMC006'){
          this.mixin_reloadCuttStat('TRANSF_STAT');
        }

        //CALL_ID가 있는 경우 녹취 서버에 고객 정보 전달
        if(this.CTI_INFO.CALL_ID){
          this.$eventBus.$emit('callCuttAftSendVeloce', {CTI_INFO:this.CTI_INFO, CUST_INFO: this.CUST_INFO, CUTT_TYPE_PATH_NM:this.SCH_CUTT_TYPE_PATH_NM});
          // try{this.callCuttAftSendVeloce();}catch(e){}
        }

        //공가해소 계약 희망 여부 관련
        if(this.computedUserCenter === '2'){
          // this.$store.commit("statusStore/MU_CALL_ST_DT", '20250114095135'); //호 연결 종료 시간
          // this.$store.commit("statusStore/MU_CALL_END_DT", '20250114095247'); //호 연결 종료 시간
          if(this.CONTRACK_CHK && this.CONTRACK_TASK_TP){
            this.CL_ID = this.CL_ID ? this.CL_ID : this.CTI_INFO.CALL_ID.split('_')[1];
            console.log('this.CL_ID : ', this.CL_ID, this.CALL_DATE);
            if(this.CL_ID){
              let sendParam = {
                UCID : this.CL_ID
                , CALL_DATE : this.CALL_DATE
                , CUST_ID : this.CUST_INFO.CUST_ID
                , CONTACT_PHONE : this.CUST_INFO.CUST_PHN_NO
                , AGT_CONTACT_CODE : this.CONTRACK_TASK_TP
                , AGT_CONTACT_TEXT : this.CUTT_CN
                , CALL_BEGIN_DATETIME : this.CALL_ST_DT //호 연결 시작 시간
                , CALL_END_DATETIME : this.CALL_END_DT //호 연결 종료 시간
              }
              console.log('sendParam : ', sendParam);
              this.$eventBus.$emit('hopeContractCuttProc', sendParam);
            }
          }
        }

        //채팅상담일 경우 상담 저장 후 채팅목록 새로고침
        if(this.$route.path === '/CSL_M0200'){
          this.$eventBus.chtListSrch();
        }

        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.$emit('clear');
        this.init(); //초기화
        this.editAble = false;
        this.PHN_CUTT_ID = ''; //상담 ID 초기화
        // this.CTI_INFO.ARS_INFO = '';
        // this.CTI_INFO.PHN_NO = '';
        this.CUST_INFO.CALL_DATA = '';
        this.CTI_INFO = {
          ARS_INFO : ''
          , PHN_NO : ''
          , CALL_ID : ''
          , CALL_TYPE : 2 //인바운드드
        }; //CTI 받아온 값
      }

      this.$store.dispatch("statusStore/AC_CUTT_ING", false); //상담중 아님
      this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드

      console.log('this.CTI_CALL_STAT : ', this.CTI_CALL_STAT);
      //상담저장 시 IN후처리 이거나 OUT후처리인 경우 저장 후 CTI 상태 지정
      if(this.CTI_CALL_STAT === 'stat3' || this.CTI_CALL_STAT === 'stat4'){
        this.$eventBus.$emit('setCtiBtnEvt', this.SAVE_AFTER_ACTION);
      }
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    //전화번호 하이픈 추가
    setPhoneNo(val){
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.RSRV_TEL_NO = res;
    },
    setCuttType(data, selectedItem){
      this.SCH_CUTT_TYPE_PATH_NM = selectedItem.text;
      this.SCH_CUTT_TYPE = data;
    },
    setCuttZone(data){
      this.SCH_CUTT_ZONE = data;
      if(data.length === 3){
        this.$eventBus.$emit('setCuttZoneTxt');
      }
    },

    //처리방법 클릭 이벤트 처리
    prcsChnCtrl(item){
      if(item.value === 'ISMAPCMC009'){ //호전환(협업);
        this.showRightSlide();
        this.$eventBus.$emit('reduceOprerationCn', false);
      }else{
        if(item.value === 'ISMAPCMC011'){ //운영단축
          this.$eventBus.$emit('reduceOprerationCn', true);
        }else if(item.value === 'ISMAPCMC010'){//배려고객
          this.$eventBus.$emit('reSetCautionCustInfo'); //배려고객 초기화
          this.$eventBus.$emit('reduceOprerationCn', false);
        }else if(item.value === 'ISMAPCMC008'){//호전환
          this.$eventBus.$emit('reSetTrnsfInfo'); //호전환 초기화
          this.$eventBus.$emit('reduceOprerationCn', false);
        }else{
          this.$eventBus.$emit('reduceOprerationCn', false);
        }

        if(item.dialog) this.mixin_showDialog(item.dialog);
      }
    },
    setCursorPosition(event){
      this.afterFocus = true;
      if(event.type === 'keydown') this.afterKeyDown = true;
    },

    // 종합민원 이송 팝업 호출
    openPhnCvlcptPopup(){
      if(this.VOC_DV != "CALLVOC") return false;
      this.mixin_openWindow('LayoutPopup', '850', '815', {compo_name: 'CSM_M1600_POP', title: '종합민원 이송 접수', popData:{PHN_CVLCPT_ID: this.PHN_CVLCPT_ID}, callback : 'savePhnCvlcptCallBack'});
    },

    // 종합민원 이송 접수 콜백함수
    savePhnCvlcptCallBack(data){
      if(!this.mixin_isEmpty(data.PHN_CVLCPT_ID)) this.PHN_CVLCPT_ID = data.PHN_CVLCPT_ID;
    },
  },
};
</script>

<style lang="scss" scoped></style>