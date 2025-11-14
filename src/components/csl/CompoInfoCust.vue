<template>
  <div>
    <div class="pl-header">
      <div class="pl-header--title">고객정보</div>
      <div class="spacing-wrap sp-4 ml-auto" v-if="!detailYn">
        <v-text-field
          v-model="INPUT_CUST_PHN_NO"
          class="pl-form is-search is-line"
          placeholder="전화번호"
          maxlength="14"
          hide-spin-buttons
          type="text"
          @keyup="setPhoneNo('INPUT_CUST_PHN_NO')"
          @keyup.enter="schCustPhnNo"
          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
          >
          <template v-slot:append>
            <v-btn
              @click="schCustPhnNo"
              class="pl-btn has-icon-only">
              <span class="pl-icon20 in-search"></span>
            </v-btn>
          </template>
        </v-text-field>
        <v-btn v-if="!readOnly"
          class="pl-btn is-sub is-sm"
          @click="mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100', callback : 'getPopData', title: '조회전용', popData: {}, readOnly: true})"
        >조회전용</v-btn>
        <v-btn
          class="pl-btn is-sub is-sm"
          :disabled="CUST_INFO.CUST_ID?false:true"
          @click="allReSet()"
        >초기화</v-btn>
        <v-btn
          class="pl-btn is-sub is-sm"
          :disabled="CUST_INFO.CUST_ID?false:true"
          @click="copyCustInfo('')"
        >복사</v-btn>
        <v-btn v-if="!readOnly"
          class="pl-btn is-sm"
          @click="custValid('')"
        >저장</v-btn>
      </div>
    </div>
    <div class="is-mt-s">
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="20%" />
          <col width="33%" />
          <col width="20%" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">
              <span class="pl-label">
                고객 ID
              </span>
            </th>
            <td >
              <v-text-field
                v-model="CUST_IDNTF_NO"
                class="pl-form is-auto has-cv"
                disabled>
                <template v-if="CUST_IDNTF_NO" v-slot:append>
                  <v-tooltip content-class="pl-tooltip bottom" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="copyCustInfo('CUST_IDNTF_NO')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 copyPaste"></span>
                      </v-btn>
                    </template>
                    <span>복사하기</span>
                  </v-tooltip>
                </template>
              </v-text-field>
            </td>
            <th scope="row">
              <span class="pl-label">
                고객 명
              </span>
            </th>
            <td>
              <div class="d-flex align-center">
                <v-text-field
                  v-model="CUST_NM"
                  class="pl-form is-auto">
                </v-text-field>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <div class="d-flex align-center">
                <span class="pl-label">
                  휴대전화
                </span>
                <div class="pl-btn-wrap ml-auto">
                  <!-- 문자 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO.indexOf('010') === 0"
                    TitleProp="문자 보내기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-sms"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO?false:true:true"
                    @btnClick="showSidePanel('SendSms')"
                  ></compo-tooltip-btn>
                  <!-- 문자 버튼 -->
<!--                  <compo-tooltip-btn-->
<!--                    v-if="CUST_INFO.CUST_ID && CUST_PHN_NO.indexOf('010') === 0"-->
<!--                    TitleProp="문자 보내기"-->
<!--                    ClassProp="pl-tooltip-btn ml-auto"-->
<!--                    IconProp="pl-icon20 td-in-sms"-->
<!--                    TooltipPositionProp="bottom"-->
<!--                    :MinWidthProp=22-->
<!--                    :HeightProp=22-->
<!--                    :DisabledProp="CUST_INFO.CUST_ID?CUST_PHN_NO?false:true:true"-->
<!--                    @btnClick="showSidePanel('EmailSend')"-->
<!--                  ></compo-tooltip-btn>-->
                  <!-- 전화 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO"
                    TitleProp="전화 걸기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-call"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO?false:true:true"
                    @btnClick="custPhnNoOutCall('CUST_PHN_NO')"
                  ></compo-tooltip-btn>
                </div>
              </div>
            </th>
            <td >
              <v-text-field
                v-model="CUST_PHN_NO"
                class="pl-form is-auto has-cv"
                maxlength="14"
                hide-spin-buttons
                type="text"
                @keyup="setPhoneNo('CUST_PHN_NO')"
                @keyup.enter="detailYn?'':schCustPhnNo()"
                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                >
                <template v-if="CUST_PHN_NO" v-slot:append>
                  <v-tooltip content-class="pl-tooltip bottom" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="copyCustInfo('CUST_PHN_NO')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 copyPaste"></span>
                      </v-btn>
                    </template>
                    <span>복사하기</span>
                  </v-tooltip>
                </template>
              </v-text-field>
            </td>
            <th scope="row">
              <div class="d-flex align-center">
                <span class="pl-label">
                  전화번호1
                </span>
                <div class="pl-btn-wrap ml-auto">
                  <!-- 문자 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO1.indexOf('010') === 0"
                    TitleProp="문자 보내기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-sms"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO1?false:true:true"
                    @btnClick="showSidePanel('SendSms')"
                  ></compo-tooltip-btn>
                  <!-- 전화 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO1"
                    TitleProp="전화 걸기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-call"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO1?false:true:true"
                    @btnClick="custPhnNoOutCall('CUST_PHN_NO1')"
                  ></compo-tooltip-btn>
                </div>
              </div>
            </th>
            <td>
              <v-text-field
                v-model="CUST_PHN_NO1"
                class="pl-form is-auto has-cv"
                maxlength="14"
                hide-spin-buttons
                type="text"
                @keyup="setPhoneNo('CUST_PHN_NO1')"
                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                >
                <template v-if="CUST_PHN_NO1" v-slot:append>
                  <v-tooltip content-class="pl-tooltip bottom" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="copyCustInfo('CUST_PHN_NO1')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 copyPaste"></span>
                      </v-btn>
                    </template>
                    <span>복사하기</span>
                  </v-tooltip>
                </template>
              </v-text-field>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <div class="d-flex align-center">
                <span class="pl-label">
                  전화번호2
                </span>
                <div class="pl-btn-wrap ml-auto">
                  <!-- 문자 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO2.indexOf('010') === 0"
                    TitleProp="문자 보내기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-sms"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO2?false:true:true"
                    @btnClick="showSidePanel('SendSms')"
                  ></compo-tooltip-btn>
                  <!-- 전화 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO2"
                    TitleProp="전화 걸기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-call"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO2?false:true:true"
                    @btnClick="custPhnNoOutCall('CUST_PHN_NO2')"
                  ></compo-tooltip-btn>
                </div>
              </div>
            </th>
            <td >
              <v-text-field
                v-model="CUST_PHN_NO2"
                class="pl-form is-auto has-cv"
                maxlength="14"
                hide-spin-buttons
                type="text"
                @keyup="setPhoneNo('CUST_PHN_NO2')"
                oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                >
                <template v-if="CUST_PHN_NO2" v-slot:append>
                  <v-tooltip content-class="pl-tooltip bottom" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="copyCustInfo('CUST_PHN_NO2')"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 copyPaste"></span>
                      </v-btn>
                    </template>
                    <span>복사하기</span>
                  </v-tooltip>
                </template>
              </v-text-field>
            </td>
            <th scope="row">
              <div class="d-flex align-center">
                <span class="pl-label">
                  전화번호3
                </span>
                <div class="pl-btn-wrap ml-auto">
                  <!-- 문자 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO3.indexOf('010') === 0"
                    TitleProp="문자 보내기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-sms"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO3?false:true:true"
                    @btnClick="showSidePanel('SendSms')"
                  ></compo-tooltip-btn>
                  <!-- 전화 버튼 -->
                  <compo-tooltip-btn
                    v-if="(!readOnly && !detailYn) && CUST_INFO.CUST_ID && CUST_PHN_NO3"
                    TitleProp="전화 걸기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-call"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    :DisabledProp="(!readOnly && !detailYn) && CUST_INFO.CUST_ID?CUST_PHN_NO3?false:true:true"
                    @btnClick="custPhnNoOutCall('CUST_PHN_NO3')"
                  ></compo-tooltip-btn>
                </div>
              </div>
            </th>
            <td>
              <div class="d-flex align-center">
                <v-text-field
                  v-model="CUST_PHN_NO3"
                  class="pl-form is-auto has-cv"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo('CUST_PHN_NO3')"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                  >
                  <template v-if="CUST_PHN_NO3" v-slot:append>
                    <v-tooltip content-class="pl-tooltip bottom" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          @click="copyCustInfo('CUST_PHN_NO3')"
                          class="pl-btn has-icon-only">
                          <span class="pl-icon20 copyPaste"></span>
                        </v-btn>
                      </template>
                      <span>복사하기</span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <div class="d-flex align-center">
                <span class="pl-label">
                  이메일
                </span>
                <!-- 이메일 버튼 -->
                <!-- <compo-tooltip-btn
                  v-if="CUST_INFO.CUST_ID && EML"
                  TitleProp="이메일 보내기"
                  ClassProp="pl-tooltip-btn ml-auto"
                  IconProp="pl-icon20 td-in-email"
                  TooltipPositionProp="bottom"
                  :MinWidthProp=22
                  :HeightProp=22
                  :DisabledProp="CUST_INFO.CUST_ID?EML?false:true:true"
                  @btnClick="sideEmailSend = true"
                ></compo-tooltip-btn> -->
              </div>
            </th>
            <td >
              <v-text-field
                v-model="EML"
                class="pl-form is-auto"
                value="heons@hkcloud.co.kr">
              </v-text-field>
            </td>
            <th scope="row">
              <span class="pl-label">
                배려 상태
              </span>
            </th>
            <td>
              <div class="d-flex align-center">
                <v-icon v-if="CUST_INFO.CUST_ID && CUST_INFO.CAUTION_CUST_YN === 'Y' && (CUST_INFO.CAUTION_CUST_STTS_CD === 'REQ01' || CUST_INFO.CAUTION_CUST_STTS_CD === 'REQ04')" class="pl-icon20 userGrade-01"></v-icon>
                <span class="pl-value-txt ml-1">
                  {{ CUST_INFO.CUST_ID && CUST_INFO.CAUTION_CUST_YN === 'Y' && (CUST_INFO.CAUTION_CUST_STTS_CD === 'REQ01' || CUST_INFO.CAUTION_CUST_STTS_CD === 'REQ04') ? CAUTION_CUST_NM+'중' : '' }}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                배려고객 메시지
              </span>
            </th>
            <td colspan="3">
              <span class="pl-value-txt ml-1">
                {{ CUST_INFO.CUST_ID && CUST_INFO.CAUTION_CUST_YN === 'Y' && (CUST_INFO.CAUTION_CUST_STTS_CD === 'REQ01' || CUST_INFO.CAUTION_CUST_STTS_CD === 'REQ04') ? CAUTION_CN : '' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 고객 조회 -->
    <v-dialog
      v-model="dialogFindCus"
      content-class="dialog-draggable "
      :width="SCH_CUSTCO_ID === '4' ? 1400 : 1000"
      persistent
      no-click-animation>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="고객 조회"
        @hide="mixin_hideDialog('FindCus')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-cus
            :SearchInputProp="SRCH_CUST_PHN_NO"
            :CALLING="CALLING"
            @saveCustInfo="saveCustInfo"
            @setCustInfo="setCustInfo"
            @hideDialog="mixin_hideDialog('FindCus')"
            MultiSelYnProp="true"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('FindCus')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- SMS 발송 -->
<!--    <v-dialog-->
<!--      v-model="dialogSendSMS"-->
<!--      content-class="dialog-draggable is-lg is-maxheight"-->
<!--      hide-overlay>-->
<!--      <div class="draggable-area">drag area</div>-->
<!--      <compo-dialog-->
<!--        header-title="SMS 발송"-->
<!--        @hide="mixin_hideDialog('SendSMS')"-->
<!--      >-->
<!--        <template slot="body">-->
<!--          &lt;!&ndash; component &ndash;&gt;-->
<!--           <CompoSendSms />-->

<!--        </template>-->
<!--        <template slot="footer">-->
<!--          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SendSMS')">닫기</v-btn>-->
<!--          <v-btn class="pl-btn is-icon" >-->
<!--            <span class="pl-icon20 chat-send-white"></span>-->
<!--            메시지 보내기</v-btn>-->
<!--        </template>-->
<!--      </compo-dialog>-->
<!--    </v-dialog>-->

    <!-- slide: 이메일 발송 -->
    <v-slide-x-reverse-transition>
      <div
        v-if=" sideEmailSend === true "
        style="width: 800px"
        class="pl-quick-layer">
        <div class="pl-quick-layer-header"><h1>이메일 발송</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="sideEmailSend = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0" style="flex: 0 0 calc(100% - 217px);">
          <CompoSendEmailWrite
            :DataProp=email_content
           />
        </div>
        <div class="pl-quick-layer-footer pl-btn-wrap">
          <v-btn class="pl-btn is-trans ml-auto" @click="sideEmailSend = false">취소</v-btn>
          <v-btn class="pl-btn" >보내기</v-btn>
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import CompoSendSms from '@/components/CompoSendSms.vue'
import CompoSendEmailWrite from '@/views/page/Chat/CompoSendEmailWrite.vue'

export default {
  name: "CompoInfoCust", //상담 - 고객정보
  props: {
    popData: {
      type: Object,
    },
    SCH_CUSTCO_ID: {
      type: String,
      default : ''
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    readOnly: {
      type: Boolean,
      default : false
    },
    detailYn: {
      type: Boolean,
      default : false
    },
  },
  components: {
    CompoSendSms,
    CompoSendEmailWrite
  },
  data() {
    return {
      //고객사 ID : 바로처리 : '4'
      // CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

      MON_Q_ITEM: null, //바로처리 상담 모니터링 업무 정보

      // 고객 조회 다이얼로그
      dialogFindCus: false,
      // 고객 조회 전화번호
      INPUT_CUST_PHN_NO: '',
      SRCH_CUST_PHN_NO: '',

      //고객 정보
      CUST_INFO : {}, //고객정보 전체
      CUST_IDNTF_NO: '',
      CUST_NM: '',
      CUST_PHN_NO: '',
      CUST_PHN_NO1: '',
      CUST_PHN_NO2: '',
      CUST_PHN_NO3: '',
      EML: '',
      CAUTION_CUST_STTS_CD : '',
      CAUTION_CUST_NM: '',
      CAUTION_CN: '',

      AGREE_YN: '',//개인정보 동의 여부

      DropCus: {
        stat: [ '전체', '정상', '휴면', '삭제' ],
        name: [ '고객명', '고객 ID' ],
      },
      SearchInputCus: '',
      HeadersFindCus: [
        { text: '번호', value: 'index', align: 'center', width: '60px', sortable: false },
        { text: '고객ID', value: 'type',  sortable: false },
        { text: '전화번호', value: 'type01', width: '150px',sortable: false},
        { text: '고객명', value: 'type02', width: '14%', sortable: false},
        { text: '이메일', value: 'type03', width: '20%', sortable: false},
        { text: '수정일', value: 'type04',  width: '14%', sortable: false },
      ],
      ItemsFindCus:[
        { index: 1, type: 'CT169700123456849323', type01: '010-5303-4545', type02: '성명미상', type03: 'jyzoo@hkcloud.co.kr', type04: '2024-06-10 16:34:54', },
        { index: 2, type: '3007554579', type01: '010-3456-1004', type02: '나준영', type03: 'nayoung@naver.com', type04: '2024-06-10 16:34:54', },
        { index: 3, type: 'CT169776487786493404', type01: '010-4758-9486', type02: '이상훈', type03: 'sylee2024@gmail.com', type04: '2024-06-10 16:34:54', },
        { index: 4, type: 'CT169776484568930432', type01: '010-4839-4563', type02: '윤건식', type03: 'yoonks1004@hkcloud.co.kr', type04: '2024-06-10 16:34:54', },
        { index: 5, type: 'CT169776448596045633', type01: '010-4789-1234', type02: '김태준', type03: 'kimtj@daum.net', type04: '2024-06-10 16:34:54', },
      ],

      // SMS발송
      dialogSendSMS: false,

      // 이메일
      sideEmailSend: false,
      email_content: {},

      CALLING : false, //전화 링 이벤트 여부

      CUST_SAVE_TO_CS_SAVE : false, //고객 정보 저장 후 상담 저장 여부
      SAVE_AFTER_ACTION : {}, ////고객 정보 저장 후 상담 저장인 경우 저장 후 상태 처리용

      MESSAGE : {
        CONFIRM : {
          DONT_AGREE_SAVE : {alertDialogToggle: true, msg: "개인정보 수집 여부를 선택하지 않았습니다. \n저장 하시겠습니까?", iconClass: 'is-info', type: 'confirm', callYes: this.custSelect, callNo: this.closeMsg}
        },
        
      },

      CALL_DATA : {},
      RSRV_CUTT_YN : 'N', //예약여부
      TEL_NO_SEARCH : false,
    }
  },
  computed: {
  },
  watch: {
    RESET_ABLE() {
      // if(this.RESET_ABLE){
        this.custInit();
        if(this.SCH_CUSTCO_ID === "4") {
          this.CALL_DATA = {}
        }
      // }
    }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("setCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("custValid"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setSaveEvtReset"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setAgreeYn"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuttUnProcCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCallData"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setSelectCustId"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("searchCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setBlackCust"); //eventBus 중복방지를 위해 off
  },
  async created() {
    // this.SCH_CUSTCO_ID = !this.mixin_isEmpty(this.SCH_CUSTCO_ID)?this.SCH_CUSTCO_ID:this.computedUserCenter;
    if(this.popData){
      console.log('CompoInfoCust this.popData : ', this.popData);
      this.CUST_SAVE_TO_CS_SAVE = false;
      this.custSelect(this.popData.CUST_ID, this.popData.HNO);
    }

    //배려고객 임시 차단 또는 배려고객 문자 발송시 즉시 고객 정보 처리
    this.$eventBus.$on("setBlackCust", () => {
      this.CUST_INFO.CAUTION_CUST_YN = 'Y';
      this.CUST_INFO.CAUTION_CUST_STTS_CD = 'REQ01';
      this.CAUTION_CUST_NM = '임시차단';

      this.$eventBus.$emit('setCuttPrcsList');//상담정보 영역 처리방법 배려고객 ARS 비활성화 처리
    });

    // 고객정보 받은 후 세팅 - 바로처리 AS 접수 영역 주소검색 시, 사용자 세팅에 사용됨
    this.$eventBus.$on("setCustInfo", (custInfo) => {
      this.setCustInfo(custInfo);
    });
    
    this.$eventBus.$on("setSelectCustId", (CUST_ID) => {
      this.custSelect(CUST_ID);
    });
    
    //상담 미처리 현황의 고객 정보 클릭시 이벤트
    //바로처리 인바운드 상담 모니터링 클릭 이벤트
    this.$eventBus.$on("setCuttUnProcCustInfo", (custInfo) => {
      console.log('setCuttUnProcCustInfo : ', custInfo);
      if(this.computedUserCenter === '4'){
        //초기화 이후 고객 전화번호 셋
        this.$emit('allReSet');
        setTimeout(() => {
          this.MON_Q_ITEM = custInfo;
          this.CUST_SAVE_TO_CS_SAVE = false;
          if(custInfo.RSRV_CUTT_YN) this.RSRV_CUTT_YN = custInfo.RSRV_CUTT_YN;
          else this.RSRV_CUTT_YN = 'N';

          if(custInfo.CUST_NO && custInfo.CUST_NO > 0){
            //자체사후처리 시 HNO 전달.
            this.custSelect(custInfo.CUST_NO, custInfo.HNO);
          }else{
            if(custInfo.TEL_NO){
              this.CUST_PHN_NO = custInfo.TEL_NO;
              this.TEL_NO_SEARCH = true;
              this.custSelect();
            }else{
              this.CUST_PHN_NO = custInfo.TEL_NO?this.mixin_setPhoneNo(custInfo.TEL_NO.replace(/[^0-9]/g, '')):custInfo.TEL_NO;
            }
          }
        }, 700);
      }else{
        this.MON_Q_ITEM = custInfo;
        this.CUST_SAVE_TO_CS_SAVE = false;
        if(custInfo.RSRV_CUTT_YN) this.RSRV_CUTT_YN = custInfo.RSRV_CUTT_YN;
        else this.RSRV_CUTT_YN = 'N';

        if(custInfo.CUST_NO && custInfo.CUST_NO > 0){
          this.custSelect(custInfo.CUST_NO);
        }else{
          if(custInfo.TEL_NO){
            this.CUST_PHN_NO = custInfo.TEL_NO;
            this.TEL_NO_SEARCH = true;
            this.custSelect();
          }else{
            //초기화 이후 고객 전화번호 셋
            this.$emit('allReSet');
            setTimeout(() => {
              this.CUST_PHN_NO = custInfo.TEL_NO?this.mixin_setPhoneNo(custInfo.TEL_NO.replace(/[^0-9]/g, '')):custInfo.TEL_NO;
            }, 300);
          }
        }
      }
      
      this.$eventBus.$emit('trnsfBtnCtrl', custInfo); //상담 폼 버튼 컨트롤
    });

    this.$eventBus.$on("custValid", (DATA) => {
      this.CUST_SAVE_TO_CS_SAVE = true;
      this.SAVE_AFTER_ACTION = DATA.SAVE_AFTER_ACTION;
      this.custValid(DATA.CUST_ID);
    });

    this.$eventBus.$on("setSaveEvtReset", () => {
      this.CUST_SAVE_TO_CS_SAVE = false;
      if(this.CUST_INFO.CUST_ID) this.CUST_INFO.CUST_SAVE_TO_CS_SAVE = false;
      this.MON_Q_ITEM = null;
    });

    //개인정보수집여부 선택 시, 전달됨.
    this.$eventBus.$on("setAgreeYn", (agreeYn) => {
      this.AGREE_YN = agreeYn;
    });
    
    //전화받기 or 전화걸기 클릭 이벤트
    this.$eventBus.$on("setCallData", (data) => {
      this.CALLING = true;
      //고객정보 초기화.
      this.custInit();
      this.custSearch(data);//인입 고객 전화번호 OR 아웃바운드 고객 전화번호
    });

    //채팅에서 고객정보 조회
    this.$eventBus.$on("searchCustInfo", (phnNo,chtUserKey,chnl,chtCuttId) => {
      this.INPUT_CUST_PHN_NO = phnNo
      this.schCustPhnNo();

      //상담정보 - 새상담 - 카카오톡,티켓id를 넣어준다
      //바로처리와 나머지센터 컴포넌트 차이로 인해 분기처리
      if(this.computedUserCenter === '4'){
        this.$eventBus.$emit("searchCustInfoNewCutt_4",chtUserKey,chnl,chtCuttId);
      } else {
        this.$eventBus.$emit("searchCustInfoNewCutt",chtUserKey,chnl,chtCuttId);
      }
    });
  },
  methods: {
    setCustInfo(item) {
      console.log("CompoInfoCust setCustInfo", item, this.CALL_DATA)
      
      item.CUST_SAVE_TO_CS_SAVE = this.CUST_SAVE_TO_CS_SAVE; //고객 정보 저장 이후 상담 저장 여부 값 설정

      this.CUST_INFO = item;
      this.CUST_IDNTF_NO = item.CUST_IDNTF_NO;
      this.CUST_NM = item.CUST_NM;
      this.CUST_PHN_NO = this.mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, ''));
      this.CUST_PHN_NO1 = this.mixin_setPhoneNo(item.CUST_PHN_NO1.replace(/[^0-9]/g, ''));
      this.CUST_PHN_NO2 = this.mixin_setPhoneNo(item.CUST_PHN_NO2.replace(/[^0-9]/g, ''));
      this.CUST_PHN_NO3 = this.mixin_setPhoneNo(item.CUST_PHN_NO3.replace(/[^0-9]/g, ''));
      this.EML = item.EML;
      this.CAUTION_CUST_STTS_CD = item.CAUTION_CUST_STTS_CD;
      this.CAUTION_CUST_NM = item.CAUTION_CUST_NM;
      this.CAUTION_CN = item.CAUTION_CN;
      this.INPUT_CUST_PHN_NO = '';

      if('CALL_DATA' in item){
        
      }else{
        if('CALL_ID' in this.CALL_DATA){
          if(this.CALL_DATA.CALL_ID) item.CALL_DATA = this.CALL_DATA;
        }
      }
      console.log("CompoInfoCust setCustInfo222", item) 

      if(this.SCH_CUSTCO_ID !== '4') {
        this.$emit('setCustInfo', item);
        //우측 사이드패널 고객정보 셋
        this.$eventBus.$emit('setSidePanelCustInfo', item);
        //특이사항 고객정보 셋
        this.$eventBus.$emit('setExpctnCnCustInfo', item);
        //관심지역 고객정보 셋
        this.$eventBus.$emit('setFavorCustInfo', item);
        //상담정보 영역 고객정보 셋
        this.$eventBus.$emit('setCuttCustInfo', item);
        //상담이력 조회
        this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: item, CUTT_HIST_RELOAD : true});
      } else if(this.SCH_CUSTCO_ID === '4') {
        //상담정보 영역 고객정보 셋
        this.$eventBus.$emit('setCuttCustInfo', item, this.MON_Q_ITEM);
        // 상담(바로처리) - 계약정보 세팅
        this.$eventBus.$emit('setCuttContractInfo', item);
        //특이사항 고객정보 셋
        this.$eventBus.$emit('setExpctnCnCustInfo', item);
        //AS 접수 조회 및 설정
        this.$eventBus.$emit('setCuttAsInfo', item);
        //우측 사이드패널 고객정보 셋
        this.$eventBus.$emit('setSidePanelCustInfo', item);
      }
    },

    //고객 전화번호 검색
    schCustPhnNo() {
      if(this.INPUT_CUST_PHN_NO) this.SRCH_CUST_PHN_NO = this.INPUT_CUST_PHN_NO;
      else this.SRCH_CUST_PHN_NO = this.CUST_PHN_NO;

      this.mixin_showDialog('FindCus');
    },

    //전화번호 하이픈 추가
    setPhoneNo(sTarget){
      let res = this.mixin_setPhoneNo(this[sTarget].replace(/[^0-9]/g, ""));
      this[sTarget] = res;
    },

    //고객 정보 복사
    copyCustInfo(sTarget){
      let sMsg = '';
      if(sTarget === 'CUST_IDNTF_NO') sMsg = '고객 ID';
      else if(sTarget === 'CUST_PHN_NO') sMsg = '휴대전화';
      else if(sTarget === 'CUST_PHN_NO1') sMsg = '전화번호1';
      else if(sTarget === 'CUST_PHN_NO2') sMsg = '전화번호2';
      else if(sTarget === 'CUST_PHN_NO3') sMsg = '전화번호3';
      else sMsg = '고객 정보';

      let allInfo = '';
      if(this.computedUserCenter === '4'){
        allInfo = '고객명 : ' + this.CUST_NM;
        allInfo += '\n휴대전화 : ' + this.CUST_PHN_NO;
        allInfo += '\n주소(코티스) : ' + this.CUST_INFO.MGOF_ADR;
        allInfo += '\n주소(동주소) : ' + this.CUST_INFO.CONTRACT_ADDR;
      }else{
        allInfo = '고객 ID : ' + this.CUST_IDNTF_NO;
        allInfo += '\n고객명 : ' + this.CUST_NM;
        allInfo += '\n휴대전화 : ' + this.CUST_PHN_NO;
        allInfo += '\n전화번호1 : ' + this.CUST_PHN_NO1;
        allInfo += '\n전화번호2 : ' + this.CUST_PHN_NO2;
        allInfo += '\n전화번호3 : ' + this.CUST_PHN_NO3;
        allInfo += '\n이메일 : ' + this.EML;
      }

      if(sTarget === '') navigator.clipboard.writeText(allInfo);
      else navigator.clipboard.writeText(this[sTarget]);
      
      if(this.SCH_CUSTCO_ID == "4") {
        if(sTarget === 'CUST_PHN_NO') {
          this.$eventBus.$emit("pasteCustPhnNo", this.CUST_PHN_NO);
        } else if(sTarget === 'CUST_PHN_NO1') {
          this.$eventBus.$emit("pasteCustPhnNo", this.CUST_PHN_NO1);
        } else if(sTarget === 'CUST_PHN_NO2') {
          this.$eventBus.$emit("pasteCustPhnNo", this.CUST_PHN_NO2);
        } else if(sTarget === 'CUST_PHN_NO3') {
          this.$eventBus.$emit("pasteCustPhnNo", this.CUST_PHN_NO3);
        }
      }

      this.showToast({msg: sMsg + '를(을) 복사 하였습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle'});
    },

    //전체 초기화
    allReSet() {
      this.showAlert({
          alertDialogToggle: true
          , msg: '전체 초기화를 진행하시겠습니까?'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.$emit('allReSet');
            this.custInit();
            this.$store.commit("alertStore/hideAlert");
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    //고객정보 초기화
    custInit() {
      // 고객 조회 전화번호
      this.INPUT_CUST_PHN_NO = '';
      this.SRCH_CUST_PHN_NO = '';

      //고객 정보
      this.CUST_INFO = {}; //고객정보 전체
      this.CUST_IDNTF_NO = '';
      this.CUST_NM = '';
      this.CUST_PHN_NO = '';
      this.CUST_PHN_NO1 = '';
      this.CUST_PHN_NO2 = '';
      this.CUST_PHN_NO3 = '';
      this.EML = '';
      this.CAUTION_CUST_STTS_CD = '';
      this.CAUTION_CUST_NM = '';
      this.CAUTION_CN = '';

      this.SAVE_AFTER_ACTION = {};
      this.CUST_SAVE_TO_CS_SAVE = false;
      this.TEL_NO_SEARCH = false;
      
      //바로처리 상담 모니터링 업무 정보
      this.MON_Q_ITEM = null;
    },

    //고객정보 Validation
    custValid(custId) {
      //공통 저장 체크
      if(this.SCH_CUSTCO_ID != '4') {
        if(!this.CUST_NM && !this.CUST_PHN_NO && !this.CUST_PHN_NO1 && !this.EML){
          this.showAlert({alertDialogToggle: true, msg: '[ 고객명, 휴대전화, 전화번호1, 이메일 ] 중 1가지 이상 입력해 주세요.', iconClass: 'is-info', type: 'default'});
          return;
        } else{
          if(custId) this.custSave(custId);
          else this.custSelect(); //전화번호로 고객 존재 유무 체크
        }
      } else if(this.SCH_CUSTCO_ID == '4') { //바로처리 저장 체크
        if(!this.CUST_PHN_NO && !this.CUST_PHN_NO1 && !this.CUST_PHN_NO2 && !this.CUST_PHN_NO3 && !this.EML){
          this.showAlert({alertDialogToggle: true, msg: "고객정보 중 최소 1가지 이상의 정보를 입력해 주세요.", iconClass: 'is-info', type: 'default'});
          return;
        } else{
          if(custId) this.custSave(custId);
          else this.custSelect(); //전화번호로 고객 존재 유무 체크
        }
      }
      
    },

    //고객 정보 조회
    async custSelect(custId = '', hno = ''){
      //TODO ::: 유종현 수석과 논의 - 892500 김신영 부팀장 - 미처리 건 클릭 시 고객 초기화.
      let URLData = "/api/biz/common/select/custList";
        let postParam = {
          SCH_CUSTCO_ID: this.SCH_CUSTCO_ID?this.SCH_CUSTCO_ID:this.computedUserCenter
        };

        if(custId){
          postParam.CUST_ID = custId;
        }else{
          postParam.CUST_PHN_NO = this.CUST_PHN_NO.replace(/[^0-9]/g, '');
        }
        //바로처리 상담이력 상세 호출 시 hno가 있으면 고객 조회에 함께 넘긴다.
        if(this.SCH_CUSTCO_ID == '4' && hno && hno != '') {
          postParam.HNO = hno;
        }

        let headParam = {
          head: {
            ns : 'lhcs.cust.dao.CustMapper'
          }
        }
        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA.length > 0){
            if(this.computedUserCenter === '4'){//바로처리인 경우
              if(response.DATA.length > 1){
                this.schCustPhnNo(); //전화번호 검색 팝업
              }else{
                this.CUST_INFO = response.DATA[0];
                this.CUST_INFO.CUST_SAVE_TO_CS_SAVE = this.CUST_SAVE_TO_CS_SAVE; //고객 존재 유무 체크 이후 상담저장 여부 셋
                this.CUST_INFO.RSRV_CUTT_YN = this.RSRV_CUTT_YN;
                
                if(this.CUST_SAVE_TO_CS_SAVE || !this.mixin_isEmpty(custId) || this.TEL_NO_SEARCH){ //상담 저장인 경우엔 고객 정보 저장 confirm 사용 안함
                  this.setCustInfo(this.CUST_INFO);
                  // this.custSave();
                }else{
                  this.showAlert({alertDialogToggle: true, msg: '고객 정보를 저장 하시겠습니까?1', iconClass: 'is-info', type: 'confirm', callYes: this.custSave, callNo: this.closeAlert});
                }
              }
            }else{
              this.CUST_INFO = response.DATA[0];
              this.CUST_INFO.CUST_SAVE_TO_CS_SAVE = this.CUST_SAVE_TO_CS_SAVE; //고객 존재 유무 체크 이후 상담저장 여부 셋
              this.CUST_INFO.RSRV_CUTT_YN = this.RSRV_CUTT_YN;
              
              if(this.CUST_SAVE_TO_CS_SAVE || !this.mixin_isEmpty(custId) || this.TEL_NO_SEARCH){ //상담 저장인 경우엔 고객 정보 저장 confirm 사용 안함
                this.setCustInfo(this.CUST_INFO);
                // this.custSave();
              }else{
                this.showAlert({alertDialogToggle: true, msg: '고객 정보를 저장 하시겠습니까?1', iconClass: 'is-info', type: 'confirm', callYes: this.custSave, callNo: this.closeAlert});
              }
            }
          }else{
            this.CUST_INFO = {};
            if(this.CUST_SAVE_TO_CS_SAVE){ //상담 저장인 경우엔 고객 정보 저장 confirm 사용 안함
              this.custSave();
            }else{
              this.showAlert({alertDialogToggle: true, msg: '고객 정보를 저장 하시겠습니까?2', iconClass: 'is-info', type: 'confirm', callYes: this.custSave, callNo: this.closeAlert});
            }
          }
        }
    },

    //고객정보 저장
    async custSave(custId) {
      let sUrl = '/api/cust/custProc';
      let postParam = {
        CUST_ID : this.CUST_INFO.CUST_ID
        , CUST_NM : this.CUST_NM
        , CUST_IDNTF_NO : this.CUST_INFO.CUST_IDNTF_NO
        , CUST_TYPE_CD : this.CUST_INFO.CUST_TYPE_CD
        , FAX : ''
        , EML : this.EML
        , CUST_PHN_NO : this.CUST_PHN_NO.replace(/[^0-9]/g, "")
        , CUST_PHN_NO1 : this.CUST_PHN_NO1.replace(/[^0-9]/g, "")
        , CUST_PHN_NO2 : this.CUST_PHN_NO2.replace(/[^0-9]/g, "")
        , CUST_PHN_NO3 : this.CUST_PHN_NO3.replace(/[^0-9]/g, "")
        , CAUTION_MEMO : ''
        , BSC_ADDR: ''
        , DTL_ADDR: ''
        , ZIP: ''
        , CNTRY_CD: ''
        , LANG_CD: ''
        , SYS_DIV: ''
        , SMS_RCV_YN: ''
        , EMAIL_RCV_YN: ''
        , POST_RCV_YN: ''
        , FAX_RCV_YN: ''
        , AGREE_YN: this.AGREE_YN
        , PVC_YN: ''
        , SCH_CUSTCO_ID: this.SCH_CUSTCO_ID?this.SCH_CUSTCO_ID:this.computedUserCenter
      }

      let headParam = {
          head : {
          }
        }

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.CUST_INFO = response.DATA[0];
        this.CUST_INFO.CUST_SAVE_TO_CS_SAVE = custId?true:this.CUST_SAVE_TO_CS_SAVE; //고객 저장 이후 상담저장 여부 셋
        this.setCustInfo(this.CUST_INFO);
        
        if(!this.CUST_SAVE_TO_CS_SAVE){
          this.showToast(this.MESSAGE.TOAST.SUCCESS);
          this.closeAlert();
        }
      }

    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    //고객전화번호 조회 후 전화번호가 없는 경우 저장 처리
    saveCustInfo(data){
      this.mixin_hideDialog('FindCus');
      this.CUST_SAVE_TO_CS_SAVE = false;
      this.CUST_INFO = {};
      this.CUST_PHN_NO = data;
      this.custSave();
    },

    //고객 전화번호 전화걸기 버튼 이벤트
    custPhnNoOutCall(sTarget){
      // if(this.CUTT_ING){
      //   this.showAlertInfo({msg : '상담 중에는 통화를 할 수 없습니다.<br>상담을 먼저 저장하세요.'});
      //   return;
      // }else{
        this.$eventBus.$emit('topOutCall', {CUST_PHN_NO : this[sTarget], CUST_ID : this.CUST_INFO.CUST_ID});
      // }
    },

    //전화 인입 혹은 아웃바운드시 고객 전화번호로 고객 조회용
    async custSearch(data){
      this.CALL_DATA = data;

      let URLData = "/api/biz/common/select/custList";
      let postParam = {
        SCH_CUSTCO_ID: this.computedUserCenter
      };

      if(data.CUST_ID) postParam.CUST_ID = data.CUST_ID;
      else postParam.CUST_PHN_NO = data.ani.replace(/[^0-9]/g, '')

      let headParam = {
        head: {
          ns : 'lhcs.cust.dao.CustMapper'
          , sn : 'custList'
        }
      }

      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0){
          if(this.computedUserCenter === '4'){//바로처리인 경우
            if(response.DATA.length > 1){ //고객전화번호로 고객 조회시 다건 조회인 경우 팝업창 호출
              this.SRCH_CUST_PHN_NO = data.ani.replace(/[^0-9]/g, ''); //인입 고객 전화번호 OR 아웃바운드 고객 전화번호
              this.mixin_showDialog('FindCus');
            }else{

              response.DATA[0].CALL_DATA = data;
              response.DATA[0].RSRV_CUTT_YN = this.RSRV_CUTT_YN;
              
              this.setCustInfo(response.DATA[0]);
            }
          }else{
            response.DATA[0].CALL_DATA = data;
            response.DATA[0].RSRV_CUTT_YN = this.RSRV_CUTT_YN;
            
            this.setCustInfo(response.DATA[0]);
          }
        }else{
          this.CUST_PHN_NO = this.mixin_setPhoneNo(data.ani.replace(/[^0-9]/g, ''));
          this.custSave();
        }
      }
    },
    showSidePanel(name){
      this.$eventBus.$emit('setSidePanelCustInfo', this.CUST_INFO);
      if(name.includes('slide')){
        this.$eventBus.$emit('clearVSlideXreverse');
        this.$eventBus.$emit('showRightSlide', {ACT_NM: 'slideEmailSend', active:false});
      }else{
          this.$eventBus.$emit('showRightDialog', {dialogNm : name})
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>