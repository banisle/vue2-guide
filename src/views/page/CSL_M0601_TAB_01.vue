<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          발송일
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
              :StartDayProp.sync="srchParam.srchStartDt"
              :EndDayProp.sync="srchParam.srchEndDt"
              @startDayChange="mixin_testLog(srchParam.srchStartDt)"
              @endDayChange="mixin_testLog(srchParam.srchEndDt)"
              ParentStyleProp="width: 306px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터
        </span>
        <div class="pl-desc">
          <v-select
              :items="centerList"
              v-model="srchParam.srchCntrCd"
              class="pl-form type-middle"
              placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          발송타입
        </span>
        <div class="pl-desc">
          <v-select
              v-model="srchParam.srchSendType"
              :items="sendTypeList"
              class="pl-form type-middle"
              placeholder="선택"
          ></v-select>
        </div>
      </div>
      <template v-if="srchParam.srchSendType ==='S'">
        <div class="pl-form-inline">
        <span class="pl-label">
          수신번호
        </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle"
                v-model="srchParam.srchCalledNum"
                @keyup.enter="search(false)"
                oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '');"
                @input="setPhnNum"
                maxlength="13"
                placeholder="전화번호 입력"/>
          </div>
        </div>
        <div class="pl-form-inline">
        <span class="pl-label">
          발송자 ID
        </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle"
                v-model="srchParam.srchSenderId"
                @keyup.enter="search(false)"
                placeholder="발송자 ID 입력"/>
          </div>
        </div>
        <div class="pl-form-inline">
        <span class="pl-label">
          발송자
        </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle"
                v-model="srchParam.srchSenderNm"
                @keyup.enter="search(false)"
                placeholder="발송자 입력"/>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="pl-form-inline">
        <span class="pl-label">
          유형
        </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle"
                placeholder="선택"
                :items="mixin_common_code_get(commonCode,'IAT', '전체')"
                v-model="srchParam.srchDivCd"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
        <span class="pl-label">
          지역
        </span>
          <compo-cutt-zone-combo
              :FormSeProp="'SRCH'"
              :ClearProp="clearProp"
              @EMIT_CUTT_ZONE="setCuttZone"
          />
        </div>
      </template>
      <div>
        <v-btn
            class="pl-btn is-icon"
            @click="search(false)"
        >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <span class="pl-bullet-txt is-blue"> {{
                  srchParam.srchSendType === 'S' ? "단순 SMS 발송 이력" : "관심지역 발송 이력"
                }}</span>
              <!--              <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #E1FFEF">9,467</strong>-->
            </div>
            <!--            <div>-->
            <!--              <span class="pl-bullet-txt is-green">통화시간</span>-->
            <!--              <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #DDEBFB">566:01:41</strong>-->
            <!--            </div>-->
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(totCnt) }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TypeProp="Download"
              v-if="srchParam.srchSendType === 'S'"
              :DataHeaderProp="excelSendSmsHeaders"
              :DataBodyProp="smsSendHstList"
              :FileNameProp="'단순_SMS__발송_목록_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              HeaderColorProp="00B0F0"
          ></compo-excel>
          <compo-excel
              TypeProp="Download"
              v-if="srchParam.srchSendType !== 'S'"
              :DataHeaderProp="excelInterestAreaHeaders"
              :DataBodyProp="smsInterestHstList"
              :FileNameProp="'관심지역_발송_목록_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              HeaderColorProp="00B0F0"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="srchParam.srchSendType === 'S' ? sendSmsHeaders : interestAreaHeaders"
          :items="srchParam.srchSendType === 'S' ? smsSendHstList : smsInterestHstList"
          fixed-header
          item-key="index"
          height="calc(-360px + 100vh)"
          :loading="isLoading"
          :item-class="isActiveRow"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          @click:row="rowSelected"
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
      </v-data-table>
      <div class="pl-pager">
        <div class="pl-pager-row">
          <span>페이지당 항목 수</span>
          <v-select
              class="pl-form"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
          ></v-select>
        </div>
        <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
        </v-pagination>

        <!-- 더보기 다음 있을때만 노출 -->
        <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(srchParam.srchSendType === 'S' ? smsSendHstList : smsInterestHstList, page) }} / {{ (srchParam.srchSendType === 'S' ? smsSendHstList : smsInterestHstList).length }}
          <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp="pagination.nextDisabled"
              @btnClick="search(true)"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

    <!-- side panel : SMS 발송 상세 정보-->
    <v-slide-x-reverse-transition>
      <div
          class="pl-quick-layer "
          style="width: 550px"
          :style="tempCenterStyle"
          v-if=" dialogSmsDetail === true ">
        <div class="pl-quick-layer-header"><h1>SMS 발송 상세 정보</h1>
          <compo-tooltip-btn
              TitleProp="윈도우 팝업 열기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 openPop"
              TooltipPositionProp="bottom"
              @btnClick="mixin_openWindow( 'LayoutPopup', '675', '850', {compo_name : 'CompoSmsLog', callback : 'getPopData', title: 'SMS 발송 상세 정보'}), dialogSmsDetail = false"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="dialogSmsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoSmsLog :DataProp="selectedRow" @Close="dialogSmsDetail = false"/>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>

import CompoSmsLog from '@/components/CompoSmsLog'
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import moment from "moment";

export default {
  name: 'CSL_M0601_TAB_01', // 문자 발송 이력
  components: {
    CompoCuttZoneCombo,
    CompoSmsLog,
  },
  data() {
    return {

      modelSelect01: '단순 SMS',
      sendTypeList: [
        {text: "단순 SMS", value: "S"},
        {text: "관심지역발송", value: "I"}
      ],
      centerList: [
        {text: "통합상담", value: "tot"},
        {text: "바로처리", value: "as"}
      ],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,40,60,80,100],
      ROW_PER_PAGE: 20,
      sendSmsHeaders: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '구분', value: 'CENTER_NM', align: 'left', width: '110px', sortable: false},
        {text: '발송일시', value: 'RG_DATE', align: 'left', width: '140px', sortable: true},
        {text: '발송타입', value: 'TYPE_NM', align: 'left', width: '9%', sortable: false},
        {text: '발송자', value: 'RG_EMP_NM', align: 'left', width: '9%', sortable: false},
        {text: '센터', value: 'CENTER_NM', align: 'left', width: '9%', sortable: false},
        {text: '수신자 번호', value: 'RECEIVER', align: 'left', width: '120px', sortable: false},
        {text: '내용', value: 'MSG', align: 'left', width: '', sortable: false},
      ],
      excelSendSmsHeaders: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '구분', value: 'SE_NM', align: 'left', width: '110px', sortable: false},
        {text: '발송일시', value: 'RG_DATE', align: 'left', width: '200px', sortable: true},
        {text: '발송타입', value: 'TYPE_NM', align: 'left', width: '90px', sortable: false},
        {text: '발송자', value: 'RG_EMP_NM', align: 'left', width: '90px', sortable: false},
        {text: '센터', value: 'CENTER_NM', align: 'left', width: '90px', sortable: false},
        {text: '수신자 번호', value: 'RECEIVER', align: 'left', width: '120px', sortable: false},
        {text: '내용', value: 'MSG', align: 'left', width: '1000px', sortable: false},
      ],
      interestAreaHeaders: [
        {text: '번호', value: 'R0W_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '날짜', value: 'SEND_DT', align: 'left', width: '15%', sortable: false},
        {text: '시간', value: 'SEND_TIME', align: 'left', width: '15%', sortable: true},
        {text: '유형', value: 'INTEREST_DIV_CD', align: 'left', width: '20%', sortable: false},
        {text: '시도', value: 'SIDO_ID', align: 'left', width: '20%', sortable: false},
        {text: '시군구', value: 'SI_GUNGU_ID', align: 'left', width: '20%', sortable: false},
        {text: '지구', value: 'JIGU_ID', align: 'left', width: '20%', sortable: false},
      ],
      excelInterestAreaHeaders: [
        {text: '번호', value: 'R0W_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '날짜', value: 'SEND_DT', align: 'left', width: '150px', sortable: false},
        {text: '시간', value: 'SEND_TIME', align: 'left', width: '150px', sortable: true},
        {text: '유형', value: 'INTEREST_DIV_CD', align: 'left', width: '200px', sortable: false},
        {text: '시도', value: 'SIDO_ID', align: 'left', width: '200px', sortable: false},
        {text: '시군구', value: 'SI_GUNGU_ID', align: 'left', width: '200px', sortable: false},
        {text: '지구', value: 'JIGU_ID', align: 'left', width: '200px', sortable: false},
      ],

      // sms profile dialog
      dialogSmsDetail: false,
      data: {
        PROFILE: {
          name: '한소미',
          img: require('@/assets/img/@manager_profile6.png'),
          part: '마이홈센터 - 마이홈1팀',
          send_date: '2024-06-20 09:30:25',
          send_type: '단순 LMS 발송',
        },
        SMS_DATA: {
          rcv_phone: '010-1004-1004',
          send_phone: '1600-1004',
          text: `안녕하십니까? LH 관심지역 알리미서비스입니다.

▶ 제목 : 광주광역시 지역 국민임대주택 예비입주자 모집 공고
▶ 주택형 :
[광주선운1 : 29~51㎡]
[광주수완2 : 46㎡]
[광주수완3 : 46㎡]
[광주수완4 : 46~51㎡]
[광주수완5 : 46㎡]
[광주수완6 : 46~51㎡]
[광주수완7 : 39~46㎡]
[광주수완8 : 59㎡]
[카이스트빌1 : 34㎡]
[신촌대주파크빌 : 59㎡]
[광주용봉 : 51~59㎡]
[광주연제 : 39~49㎡]
[광주송화2 : 59㎡]
[광주송화4 : 59㎡]
[광주동천1 : 39㎡]
[광주동천6 : 39~51㎡]
[광주용산 : 29㎡]
[광주신가 : 51㎡]
[광주아름마을1: 46~51㎡]

☞ 국민임대 통합공고로 인하여 전화 및 문자상담 폭주로 연결이 어려울 수 있습니다.

☞ 신청자격, 모집일정 등 자세한 사항은 LH청약센터( https://apply.lh.or.kr → 임대주택 → 임대정보) 에서 공고문을 먼저 꼭! 확인하시기 바랍니다.

☎ 수신거부 080-850-8880
`
        },
      },
      srchParam: {
        srchSmsGroupHstType: 'SGH',
        srchStartDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCntrCd: '',
        srchSendType: 'S',
        srchCalledNum: '',
        srchSenderId: '',
        srchSenderNm: '',
        srchZone: new Array(3),
        srchAllZone: '',
        srchDivCd: '',
      },
      commonCode: [],
      smsInterestHstList: [],
      smsSendHstList: [],
      clearProp: false,
      isLoading: false,

      totCnt: 0,
      selectedRow: {},

      pagination: {
        PAGES_CNT: 1,
        ROW_CNT: 500,
        nextDisabled: false
      },

    }
  },
  async created() {
    let codeName = ['IAT']
    this.commonCode = await this.mixin_common_code_get_all(codeName);
    this.srchParam.srchCntrCd = this.centerList[0].value
  },
  mounted() {
  },
  methods: {
    showDetail() {
      this.dialogSmsDetail = true
    },
    dayChange(type) {
      if (new Date(this.srchParam.srchStartDt) > new Date(this.srchParam.srchEndDt)) {
        if (type === 'start') {
          this.showAlertCaution({msg: '시작일자는 종료일자 이후일 수 없습니다. '})
          this.srchParam.srchStartDt = this.srchParam.srchEndDt
        } else {
          this.showAlertCaution({msg: '종료일자는 시작일자 이전일 수 없습니다. '})
          this.srchParam.srchEndDt = this.srchParam.srchStartDt
        }
      }
    },
    setCuttZone(data) {
      this.srchParam.srchZone = []
      this.srchParam.srchZone = data;
    },
    search(next) {
      if (this.srchParam.srchSendType === 'S') {
        this.getSmsSendHstList(next);
      } else {
        this.getSmsInterestHstList(next);
      }
    },
    async getSmsSendHstList(next) {
      this.isLoading = true;
      if (!next) {
        this.smsSendHstList = [];
        this.pagination.PAGES_CNT = 1;
      }
      let sUrl = '/api/biz/common/external/select/selectHistSendSms'
      let postParam = {
        SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', '') + '000000',
        SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', '') + '235959',
        SRCH_CENTER: this.srchParam.srchCntrCd,
        SRCH_CALLED_NUMBER: this.srchParam.srchCalledNum.replaceAll('-', ''),
        SRCH_SENDER_ID: this.srchParam.srchSenderId,
        SRCH_SENDER_NM: this.srchParam.srchSenderNm,
        SRCH_TYPE: this.srchParam.srchSendType,
      }
      let headParam = {
        head: {
          ROW_CNT: this.pagination.ROW_CNT,
          PAGES_CNT: this.pagination.PAGES_CNT,
          PAGING: "Y",
          ns: "lhcs.external_db.sms.dao.ExternalMapper_Sms",
          sn: "selectHistSendSms",
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT
        response.DATA.map(item => {
          item.CENTER_NM = item.CENTER === 'tot' ? '통합상담' : '바로처리'
          item.SE_NM = item.CENTER_NM
          item.TYPE_NM = item.CENTER == 'tot' && item.TYPE != '' ? '관심 지역 발송' : '단순SMS발송'
          item.RECEIVER = this.mixin_setPhoneNo(item.RECEIVER);
          this.smsSendHstList.push(item)
        })
        this.pagination.PAGES_CNT++
      } else {
        this.showAlertCaution({msg: '조회 중 문제가 발생했습니다.'})
      }
      if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
        if (response.HEADER.next === true) {
          this.pagination.nextDisabled = false //버튼 활성화
        } else {
          this.pagination.nextDisabled = true  //버튼 비활성화
        }
      }
      this.isLoading = false;
    },
    async getSmsInterestHstList(next) {
      this.isLoading = true;
      if (!next) {
        this.smsInterestHstList = [];
        this.pagination.PAGES_CNT = 1;
      }
      let sUrl = '/api/biz/common/select/selectInterestAreaHstListBySms'
      let postParam = {
        SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', '') + '000000',
        SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', '') + '235959',
        SRCH_DIV_CD: this.srchParam.srchDivCd,
        SIDO_ID: this.srchParam.srchZone[0],
        SIGUNGU_ID: this.srchParam.srchZone[1],
        JIGU_ID: this.srchParam.srchZone[2],
        SRCH_SMS_GROUP_HST_TYPE: this.srchParam.srchSmsGroupHstType,
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper',
          sn: 'selectInterestAreaHstListBySms',
          ROW_CNT: this.pagination.ROW_CNT,
          PAGES_CNT: this.pagination.PAGES_CNT,
          PAGING: "Y",
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT
        response.DATA.map(item => this.smsInterestHstList.push(item))
        this.pagination.PAGES_CNT++
      } else {
        this.showAlertCaution({msg: '조회 중 문제가 발생했습니다.'})
      }
      if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
        if (response.HEADER.next === true) {
          this.pagination.nextDisabled = false //버튼 활성화
        } else {
          this.pagination.nextDisabled = true  //버튼 비활성화
        }
      }
      this.isLoading = false;
    },
    rowSelected(item) {
      let selectItem = {};
      if (this.srchParam.srchSendType === 'S') {
        this.selectedRow = item;
      } else {
        selectItem.RG_DATE = item.REG_DT;
        selectItem.TYPE = this.sendTypeList.find(item => item.value === this.srchParam.srchSendType).text;
        // selectItem.RECEIVER
        // selectItem.SENDER
        selectItem.MSG = item.SMS_MSG
        selectItem.RG_EMP_NO = item.REG_EMP_NO

        this.selectedRow = selectItem;
      }
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    setPhnNum() {

      let arrNum = new Array(3);
      arrNum[0] = this.srchParam.srchCalledNum.replaceAll('-', '').slice(0, 3)
      arrNum[1] = this.srchParam.srchCalledNum.replaceAll('-', '').slice(3, 7)
      arrNum[2] = this.srchParam.srchCalledNum.replaceAll('-', '').slice(7, 11)

      this.srchParam.srchCalledNum = arrNum.filter(item => item !== '').join('-');
    }
  },
  computed: {
  },
  watch: {
    "srchParam.srchSendType" : {
      handler(newValue, oldValue) {
        if(newValue === 'S'){
          this.srchParam.srchStartDt = this.srchParam.srchStartDt;
        }
      },
    }
  },
};
</script>

<style lang="scss" scoped>

</style>