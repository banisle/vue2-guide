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
                :disabled="true"
                ></v-select>
              <v-select
                v-model="RCPT_CHN_CD"
                :items="mixin_common_code_get(this.list_common_code, 'CVC', '')"
                class="pl-form is-auto"
                placeholder="선택"
                :disabled="true"
                ></v-select>
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
                :disabled="true"
                class="pl-radio">
              </v-radio>
              <template v-if="PRVC_CLCT_AGRE_YN === 'N'">
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
              {{ ARS_INFO }}
            </span>
          </td>
          <th scope="row">
            <span class="pl-label">
              고객전화번호
            </span>
          </th>
          <td>
            <span class="pl-value-txt">
              {{ mixin_setPhoneNo(CUST_PHN_NO.replace(/[^0-9]/g, '')) }}
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
              :CustcoProp="DataProp?DataProp.CUSTCO_ID:popData.CUSTCO_ID"
              :DisabledProp="editAble?false:true"
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
                  :disabled="SCH_CUSTCO_ID !== '4'?editAble?false:true:true"
                  class="pl-radio">
                  </v-radio>
              </v-radio-group>
            </div>
          </td>
        </tr>
        <tr v-if="SCH_CUSTCO_ID !== '4'">
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
              class="pl-form is-noresize"
              :spellcheck="false"
              :height="textareaH"
              :disabled="editAble?false:true"
              />
          </td>
        </tr>
        <tr v-if="SCH_CUSTCO_ID !== '4'">
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
                :items="GVIFMT_HSTRY_LIST"
                multiple
                :disabled="true"
              />
              <v-text-field
                v-model="modelChkRequestTime"
                class="pl-form "
                style="width: 52px"
                :disabled="true"
                />
                <v-text-field
                v-model="modelChkReason"
                class="pl-form "
                :disabled="true"
                />
            </div>
          </td>
          <th scope="row">
            <span class="pl-label">
              민원 접수
            </span>
          </th>
          <td>
            <div class="spacing-wrap sp-4 align-center">
              <div>
                <v-checkbox
                  v-model="VOC_CHK"
                  class="pl-check flex-grow-0"
                  :disabled="true"
                ></v-checkbox>
                <!-- :disabled="editAble?false:true" -->
              </div>
              <v-select
                v-model="VOC_DV"
                class="pl-form flex-grow-1"
                :items="VOC_LIST"
                :disabled="true"
              />
              <!-- :disabled="CVLCPT_RCPT_MNG_ID?true:editAble?VOC_CHK?false:true:true" -->
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
    <!-- dialog: 호전환-센터내 이관 -->
    <v-dialog
      v-model="dialogTransCenter"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="호전환-센터내 이관"
        @hide="mixin_hideDialog('TransCenter')"
        @submit="submitDialog('TransCenter')"
        >
        <template slot="body">
          <CompoTransCenter />
        </template>
        <template slot="footer">
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
            <v-btn class="pl-btn" @click="tryTrans">전환시도</v-btn>
            <v-btn class="pl-btn is-sub" @click="transExtNo">전환</v-btn>
            <v-btn class="pl-btn is-sub" @click="transCancel">전환 취소</v-btn>
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
                  class="pl-form is-search type-middle is-auto"
                  placeholder="고객명 입력"
                  @keydown.enter="mixin_testLog('search btn')"
                >
                <template v-slot:append>
                  <v-btn
                    @click="mixin_testLog('search btn')"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
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
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 배려고객ARS -->
    <v-dialog
      v-model="dialogBalckArs"
      content-class="dialog-draggable"
      hide-overlay
      persistent
      width=400>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="배려고객ARS"
        @hide="mixin_hideDialog('BalckArs')"
        @submit="submitDialog('BalckArs')"
        >
        <template slot="body">
          <!-- info -->
          <div class="is-mt-m">
            <h3 class="pl-subtit">임시 차단</h3>
            <div class="pl-subdesc">
              <p>[임시차단 하기] 버튼을 클릭 하시면 즉시 임시 차단됩니다.</p>
            </div>
            <div class="pl-rounded-box pa-3 is-mt-s">
              <span class="pl-label">
                <v-icon class="pl-icon20 phone-ban"></v-icon>
                <span class="ml-1">전화번호</span>
                <span class="ml-2 pl-value-txt">{{ dataBalckArs.phone }}</span>
                <v-btn class="pl-btn is-esp ml-auto">임시차단 하기</v-btn>
              </span>
            </div>
          </div>
          <!-- tab -->
          <v-tabs class="pl-tabs is-mt-s" >
            <v-tab>배려고객 등록 요청</v-tab>
            <v-tab>특이사항</v-tab>
            <!-- 배려고객 등록 요청 -->
            <v-tab-item >
              <div class="is-mt-s">
                <p>배려고객으로 등록할 유형과 사유를 입력하신 후, [요청하기] 버튼을 클릭하시면 절차에 따라 IVR 차단관리가 진행됩니다. </p>
                <!-- form -->
                <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
                  <div class="pl-form-inline">
                    <span class="pl-label" style="flex: 0 0 60px">
                      배려 유형
                    </span>
                    <div class="pl-desc">
                      <v-combobox
                        class="pl-form type-middle"
                        :items="dataBalckArs.itemsType"
                        multiple
                        placeholder="선택"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label" style="flex: 0 0 60px">
                      사유
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        height="90"
                        class="pl-form is-noresize"
                        :spellcheck="false"
                        placeholder="사유 입력"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 버튼 -->
              <div class="pl-btn-wrap is-mt-m">
                <v-btn
                  @click="dialogResponseScript = true"
                  class="pl-btn is-icon is-sub is-trans">
                  <span class="pl-icon20 ai-script"></span>
                  응대 스크립트
                </v-btn>
                <v-btn
                  class="pl-btn ml-auto"
                  @click="modelBalckArs = false">배려고객 요청하기</v-btn>
              </div>
            </v-tab-item>
            <!-- 특이사항 -->
            <v-tab-item >
              <div class="is-mt-s">
                <p>등록하신 특이사항은 관리자의 승인 후 전화상담 화면 좌측 상단의 고객정보 영역에 조회되어 집니다. </p>
                <!-- form -->
                <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
                  <div class="pl-form-inline">
                    <span class="pl-label" style="flex: 0 0 60px">
                      주의 메모
                    </span>
                    <div class="pl-desc">
                      <v-textarea
                        height="90"
                        class="pl-form is-noresize"
                        :spellcheck="false"
                        placeholder="주의메모 입력"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 버튼 -->
              <div class="pl-btn-wrap is-mt-m">
                <v-btn class="pl-btn ml-auto">주의메모 저장</v-btn>
              </div>
            </v-tab-item>
          </v-tabs>
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
import { eventBus } from "@/store/eventBus.js";

import CompoResponseScript from '@/views/page/CompoResponseScript'
import CompoCuttTypeCombo from '@/components/CompoCuttTypeCombo'
import CompoCuttZoneCombo from '@/components/CompoCuttZoneCombo.vue'
export default {
  name: "CompoCsInfoDtlTable", //name은 'MENU_' + 파일명 조합
  components: {
    CompoFindArea,
    CompoTransManager,
    CompoTransCenter,
    CompoResponseScript,
    CompoCuttTypeCombo,
    CompoCuttZoneCombo
  },
  props: {
    DataProp: {
      type: Object,
    },
    popData: {
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
    SCH_CUSTCO_ID: {
      type: String,
      default : ''
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

      editAble : false, //등록 수정 가능 여부

      PRVC_CLCT_AGRE_YN : 'N', //개인정보 수집 동의 여부
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
      ARS_INFO : '', //접속정보
      CALL_ID : '', //콜 ID
      CUST_PHN_NO : '', //인입번호

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

      TRANS_EXT_NO : '', //호전환 (내선 번호)

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

      // 통화예약
      dialogCallReserve: false,
      RSRV_CUST_NM : '', //통화예약 고객명
      RSRV_TEL_NO : '', //통화예약 고객 전화번호
      RSRV_CNTNT : '', //예약내용
      RSRV_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      RSRV_TIME: '09:00',
      timeAmpm: '오후',

      // 배려고객 ARS
      dialogBalckArs: false,
      dataBalckArs: {
        phone: '010-1004-1004',
        itemsType: [
          {text: '성희롱'},
          {text: '욕설 폭언'},
          {text: '반복억지'},
          {text: '민원요지 불분명'},
          {text: '사유 없는 콜백요청'},
          {text: '반말'},
          {text: '기타'},
        ],
      },

      // slide: 블랙컨슈머 응대 스크립트
      dialogResponseScript: false,

      CNTCT_RSLT_CD : 'ISMACTRT005', //접촉결과 코드
      SAVE_AFTER_ACTION : {}, //상담 저장 후 ACTION

      // 제보요청
      GVIFMT_HSTRY_LIST : [],
      modelChkRequest: [],
      modelChkRequestTime: '00:00',
      modelChkReason: '',
      GVIFMT_STTS_CD: '',

      //민원접수 여부
      VOC_CHK: false,
      VOC_LIST: [], //민원 접수 유형 목록
      VOC_DV: '', //민원 접수 유형
      CVLCPT_RCPT_MNG_ID : '', //민원 접수 ID

      CUST_ID : '',
      CUSTCO_ID : '',
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
    CUST_INFO() {
      this.RSRV_CUST_NM = this.CUST_INFO.CUST_NM;
      this.RSRV_TEL_NO = this.CUST_INFO.CUST_PHN_NO;
    },
    cuttEditAble() {
      this.editAble = this.cuttEditAble;
    },
    CUTT_CN() {
      this.$emit('sendCuttCn', this.CUTT_CN);
    },
    CHG_CUTT_CN() {
      this.CUTT_CN = this.CHG_CUTT_CN;
    },
    DataProp() {
      this.setCsInfo(this.DataProp);
    },
    popData() {
      this.setCsInfo(this.popData);
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
  },
  mounted() {

  },
  beforeDestroy(){
    this.$eventBus.$off("setCuttCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuttDetailInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("saveCsDtlInfoValid"); //eventBus 중복방지를 위해 off
  },
  async created() {
    if(this.DataProp) this.setCsInfo(this.DataProp);

    if(this.popData){
      this.SCH_CUSTCO_ID = this.popData.CUSTCO_ID?this.popData.CUSTCO_ID:this.computedUserCenter;
      this.setCsInfo(this.popData); //팝업 상태인 경우
    }

    this.$emit('sendCuttCn', this.CUTT_CN); //관심지역 등록 수정시 상담메모 내용 필요로 인해 최초 전송

    //인바운드 또는 고객정보 검색후 고객정보 셋팅시 호출된 DATA
    this.$eventBus.$on("setCuttCustInfo", (CUST_INFO) => {
      this.CUST_INFO = CUST_INFO;
    });

    //상담 상세보기 팝업
    this.$eventBus.$on("setCuttDetail", (item) => {
      this.$eventBus.$emit('cuttDtlSaveBtnControl', item);
      this.popData = item;
      this.SCH_CUSTCO_ID = item.CUSTCO_ID;
      setTimeout(() => {
        this.PRCS_CHN_LIST = this.setPrcsChnList(); //센터별 처리방법 목록
      }, 500);
    });

    //이첩 대상자 정보 상담메모 추가
    this.$eventBus.$on("addCuttCnTransfInfo", (TRANSF_INFO) => {

      if(TRANSF_INFO.USER_ID === this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID){
        this.showAlert({alertDialogToggle: true, msg: '이첩 대상자로 본인을 선택할 수 없습니다.<br>다른 이첩 대상자를 선택해 주세요.', iconClass: 'is-info', type: 'default'});
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

    //상담 상세보기 DATA
    // this.$eventBus.$on("setCuttDetailInfo", (CS_INFO) => {
    //   this.setCsInfo(CS_INFO);
    // });

    //상담 내용 저장
    this.$eventBus.$on("saveCsDtlInfoValid", (CS_INFO) => {
      this.saveCsInfoValid();
    });

    //공통코드설정
    let codeName = ['CVC', 'PCMC']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    let codeName2 = ['RECM', 'VOC_DV']; //제보유형, 민원유형
    this.common_code = await this.mixin_common_code_get_all(codeName2);

    this.GVIFMT_HSTRY_LIST = await this.mixin_common_code_get(this.common_code, 'RECM', '');

    let vocList = await this.mixin_common_code_get(this.common_code, 'VOC_DV', '');
    this.VOC_LIST = [];
    vocList.forEach((item, idx) => {
      if(item.cd_vl1 === 'Y') this.VOC_LIST.push({text:item.text, value: item.value});
    });

    this.PRCS_CHN_LIST = this.setPrcsChnList(); //센터별 처리방법 목록
  },
  methods: {
    //센터별 처리방법 목록
    setPrcsChnList() {
      let tempPrcsChnList = [];
      console.log('this.computedUserCenter : ', this.SCH_CUSTCO_ID);
      if(this.SCH_CUSTCO_ID === '-1'){
        if(this.DataProp){
          tempPrcsChnList = this.mixin_common_code_get_global(this.list_common_code, 'PCMC', this.DataProp.CUSTCO_ID);
        }
        if(this.popData){
          tempPrcsChnList = this.mixin_common_code_get_global(this.list_common_code, 'PCMC', this.SCH_CUSTCO_ID);
        }
      }else{
        if(this.DataProp){
          tempPrcsChnList = this.mixin_common_code_get_global(this.list_common_code, 'PCMC', this.DataProp.CUSTCO_ID);
        } else {
          tempPrcsChnList = this.mixin_common_code_get_global(this.list_common_code, 'PCMC', this.SCH_CUSTCO_ID);
        }
        
      }

      console.log('tempPrcsChnList : ', tempPrcsChnList);
      let arrPrcsChnList = [];
      tempPrcsChnList.forEach((code, idx) => {
        if(code.cd_vl === 'Y'){
          if(code.value === 'ISMAPCMC007'){ //통화예약
            code.dialog = 'CallReserve';
          }else if(code.value === 'ISMAPCMC008'){ //호전환
            code.dialog = 'TransCenter';
          }else if(code.value === 'ISMAPCMC009'){ //호전환(협업)
            code.dialog = 'TransManager';
          }else if(code.value === 'ISMAPCMC010'){ //배려고객ARS
            code.dialog = 'BalckArs';
          }
          arrPrcsChnList.push(code);
        }
      });

      let result = arrPrcsChnList.sort((a, b) => a.cd_vl3.toLowerCase() < b.cd_vl3.toLowerCase() ? -1 : 1);

      // console.log('this.PRCS_CHN_CD : ', this.PRCS_CHN_CD);

      if(this.DataProp) this.PRCS_CHN_CD = this.DataProp.PRCS_CHN_CD;
      if(this.popData) this.PRCS_CHN_CD = this.popData.PRCS_CHN_CD;

      console.log('result : ', result);

      return result;
    },

    showRightSlide(){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: 'dialogJobParts', active:false});
    },

    async setCsInfo(CS_INFO) {
      console.log('CS_INFO : ', CS_INFO);
      let currentDate = await this.mixin_getSvrDate("YYYYMMDD");
      if(this.computedUserType === 'MANAGER'){ //상담사인경우 당일 상담건에 대해서만 수정 가능
        if(CS_INFO.REG_DT.replace(/[^0-9]/g, '').substring(0, 8) === currentDate) this.editAble = true;
        else this.editAble = false;
      }else{ //그외 권한자는 3일 이내 상담건에 대해서만 수정 가능
        if(this.computedUserDetailType === 'TEAM_LEADER'){
          if(this.computedUserDeptId === CS_INFO.RCPT_DEPT_ID){
            if(currentDate <= this.$moment(this.mixin_convertDate(CS_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
              this.editAble = true;
            }else{
              this.editAble = false;
            }
          }else{
            this.editAble = false;
          }
        }else{
          if(currentDate <= this.$moment(this.mixin_convertDate(CS_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
            this.editAble = true;
          }else{
            this.editAble = false;
          }
        }
      }

      this.CUST_ID = CS_INFO.CUST_ID;
      this.CUSTCO_ID = CS_INFO.CUSTCO_ID;
      this.CALL_ID = CS_INFO.CALL_ID; //콜 ID
      this.ARS_INFO = CS_INFO.ARS_INFO; //접속정보
      this.CUST_PHN_NO = CS_INFO.CUST_PHN_NO; //인입번호
      this.PHN_CUTT_ID = CS_INFO.PHN_CUTT_ID; //상담 ID
      this.DRWI_TYPE_CD = CS_INFO.DRWI_TYPE_CD; //상담채널 IN,OUT
      this.RCPT_CHN_CD = CS_INFO.RCPT_CHN_CD; //상담채널(접수채널)
      this.PRVC_CLCT_AGRE_YN = CS_INFO.PRVC_CLCT_AGRE_YN; //개인정보 수집동의 여부
      this.PRCS_CHN_CD = CS_INFO.PRCS_CHN_CD; //처리 방법 코드
      this.CUTT_CN = CS_INFO.CUTT_CN; //상담메모
      this.textareaH = CS_INFO.textareaH; //상담메모 textarea 높이

      //상담 유형
      if(CS_INFO.FULL_CUTT_TYPE_ID){
        if(CS_INFO.FULL_CUTT_TYPE_ID.split(',').length !== 3){
          for(let i=0; i<CS_INFO.FULL_CUTT_TYPE_ID.split(',').length; i++){
            this.SCH_CUTT_TYPE[i] = CS_INFO.FULL_CUTT_TYPE_ID.split(',')[i];
          }
        }else{
          this.SCH_CUTT_TYPE = CS_INFO.FULL_CUTT_TYPE_ID.split(',');
          this.SCH_ALL_CUTT_TYPE = CS_INFO.FULL_CUTT_TYPE_ID.split(',');
        }
      }

      setTimeout(() => {
        this.$eventBus.$emit('setCuttTypeTxt');
      }, 500);

      //상담 지역
      if(!CS_INFO.CTPV_CD || !CS_INFO.SGG_CD || !CS_INFO.DSTRCT_CD){
        if(CS_INFO.CTPV_CD) this.SCH_CUTT_ZONE[0] = CS_INFO.CTPV_CD;
        if(CS_INFO.SGG_CD) this.SCH_CUTT_ZONE[1] = CS_INFO.SGG_CD;
        if(CS_INFO.DSTRCT_CD) this.SCH_CUTT_ZONE[2] = CS_INFO.DSTRCT_CD;
      }else{
        this.SCH_CUTT_ZONE = [CS_INFO.CTPV_CD, CS_INFO.SGG_CD, CS_INFO.DSTRCT_CD];
        this.SCH_ALL_CUTT_ZONE = [CS_INFO.CTPV_CD, CS_INFO.SGG_CD, CS_INFO.DSTRCT_CD];
      }

      //제보 요청
      this.modelChkRequest = [];
      this.modelChkRequestTime = '00:00';
      this.modelChkReason = '';
      this.GVIFMT_STTS_CD = '';
      if('GVIFMT_HSTRY_LIST' in CS_INFO){
        if(CS_INFO.GVIFMT_HSTRY_LIST){
          let arrGvifmtHstryList = CS_INFO.GVIFMT_HSTRY_LIST.split('||');
          setTimeout(() => {
            this.GVIFMT_HSTRY_LIST.forEach((item, idx) => {
              arrGvifmtHstryList.forEach((data, seq) => {
                if(data.split(',')[0] === item.value){
                  this.modelChkRequest.push(item);
                }

                if(seq === 0){
                  let sTimeRs = data.split(',')[1];
                  this.modelChkRequestTime = sTimeRs.split('/')[0];
                  this.modelChkReason = sTimeRs.split('/')[1];
                  this.GVIFMT_STTS_CD = data.split(',')[2];
                }
              });

            });
          }, 500);
        }
      }

      //민원접수
      this.VOC_CHK = false;
      this.VOC_DV = '';
      if('CVLCPT_SE_CD' in CS_INFO){
        if(CS_INFO.CVLCPT_SE_CD){
          this.VOC_CHK = true;
          this.VOC_DV = CS_INFO.CVLCPT_SE_CD.split(',')[1];
        }
      }

      // this.PRCS_CHN_LIST = this.setPrcsChnList(); //센터별 처리방법 목록
    },

    //상담메모에 적용
    setAddCuttCn(item){
      let addZoneCn = this.CUTT_CN.split('\n')
      addZoneCn[0] = item
      this.CUTT_CN = addZoneCn.join('\n');
    },

    //호전환 전화번호 Set
    setTransPhnNo(item){
      this.TRANS_EXT_NO = item.EXT_NO;
    },

    //호전환 전환시도
    tryTrans() {
      if(this.TRANS_EXT_NO){
        this.showAlert({alertDialogToggle: true, msg: '호전환 전환시도(기능 개발 필요)', iconClass: 'is-info', type: 'default'});
        return;
      }else{
        this.showAlert({alertDialogToggle: true, msg: '호전환할 내선번호가 존재하지 않습니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

    //호전환
    transExtNo() {
      if(this.TRANS_EXT_NO){
        this.showAlert({alertDialogToggle: true, msg: '호전환(기능 개발 필요)', iconClass: 'is-info', type: 'default'});
        return;
      }else{
        this.showAlert({alertDialogToggle: true, msg: '호전환할 내선번호가 존재하지 않습니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

    //전환 취소
    transCancel() {
      this.showAlert({alertDialogToggle: true, msg: '전환 취소(기능 개발 필요)', iconClass: 'is-info', type: 'default'});
      return;
    },

    //상담 저장 Validation
    saveCsInfoValid() {
      if(!this.SCH_CUTT_TYPE[0] || !this.SCH_CUTT_TYPE[1] || !this.SCH_CUTT_TYPE[2]){
        this.showAlertInfo({msg: '상담유형을 소분류까지 선택하세요.'});
        return;
      }
      if(!this.PRCS_CHN_CD){
        this.showAlertInfo({msg: '처리방법을 선택해 주세요.'});
        return;
      }
      if(!this.CUTT_CN){
        this.showAlertInfo({msg: '상담메모를 입력해 주세요.'});
        return;
      }

      this.showAlert({
          alertDialogToggle: true
          , msg: '상담 정보를 저장 하시겠습니까?'
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
        , CNSLT_DIV_CD_1 : this.SCH_CUTT_TYPE[0] //상담유형 1Dept 코드
        , CNSLT_DIV_CD_2 : this.SCH_CUTT_TYPE[1] //상담유형 2Dept 코드
        , CNSLT_DIV_CD_3 : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CUTT_TYPE_ID : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CNSLT_DIV_PATH_NM : this.SCH_CUTT_TYPE_PATH_NM.replace(/\>/g, ' -> ') //상담유형 FULL_PATH
        , CUTT_CN : this.CUTT_CN //상담메모
        
        , CTPV_CD : this.SCH_CUTT_ZONE[0] //상담지역(시도)
        , SGG_CD : this.SCH_CUTT_ZONE[1] //상담지역(시군구)
        , DSTRCT_CD : this.SCH_CUTT_ZONE[2] //상담지역(지구)

        , CHT_CUTT_ID : ''    //채팅상담인지 아닌지 판단을 위한 코드
      }

      if(this.SCH_CUSTCO_ID !== '4'){
        postParam.PRCS_CHN_CD = this.PRCS_CHN_CD; //처리방법
        postParam.PRCS_STTS_CD = this.PRCS_STTS_CD; //처리상태 코드
      }

      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/cutt/cuttProc', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();

        this.$eventBus.$emit('setSelectCustId', this.CUST_ID); //고객정보 조회 호출
        this.$eventBus.$emit('clearVSlideXreverse');
        // //상담이력 탭으로 이동 및 새로고침
        // this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: this.CUST_INFO, CUTT_HIST_RELOAD:true});
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
  },
};
</script>

<style lang="scss" scoped></style>