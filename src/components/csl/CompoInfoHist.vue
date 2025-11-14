<template>
  <div :class="`CS_LOG_TAB center-${centerClass}`">
    <!-- 이력 영역 - 공통(마이홈, 공가해소, 전세임대, 주택지원센터) Start-->
    <template v-if="SCH_CUSTCO_ID === '1' || SCH_CUSTCO_ID === '2' || SCH_CUSTCO_ID === '3' || SCH_CUSTCO_ID === '5'">
      <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs type-subtab">
        <CompoTabItems :TabsList=tabsListCommon @layoutPopup="layoutPopup">
          <!-- sms용 검색 -->
          <template slot="search">
            <div class="ml-auto pl-btn-wrap" v-if="tabs2 === 2">
              <v-text-field v-model="SCH_SMS_TXT" class="pl-form is-md"
                placeholder="발송내용 검색"
                @keyup.enter="$eventBus.$emit('searchSmsHist', {SCH_SMS_TXT: SCH_SMS_TXT})"
              />
                <v-btn
                  class="pl-btn is-sm"
                  @click="$eventBus.$emit('searchSmsHist', {SCH_SMS_TXT: SCH_SMS_TXT})">
                  조회
                </v-btn>
            </div>
          </template>
        </CompoTabItems>
      </v-tabs>
      <v-tabs-items v-model="tabs2">
        <div class="fill-height">
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistCutt`">
              <CompoTabHistCutt :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistCuttCustco`">
              <CompoTabHistCuttCustco :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistSendSms`">
              <CompoTabHistSendSms :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistSendSmsEx`">
              <CompoTabHistSendSmsEx :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistPhnNo`">
              <CompoTabHistPhnNo :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistRcvTel`">
              <CompoTabHistRcvTel :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistCaution`">
              <CompoTabHistCaution :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />

            </div>
          </v-tab-item>
          <!-- <v-tab-item >
            <div
              :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistComplaint`">
              <CompoTabHistComplaint
                :TabProp="tabs2"
                :CustInfoProp="CUST_INFO"
              />
            </div>
          </v-tab-item> -->
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistCamapin`">
              <CompoTabHistCampain :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />

            </div>
          </v-tab-item>
        </div>
      </v-tabs-items>
    </template>

    <!-- 이력 영역 - 바로처리, 특수채널 상담 -->
    <template v-if="SCH_CUSTCO_ID === '4'">
      <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs type-subtab">
        <CompoTabItems :TabsList=tabsListAs @layoutPopup="layoutPopup">
          <template slot="search">
            <!-- 신,구(as 접수이력)용 검색 -->
            <div class="ml-auto pl-btn-wrap">
              <template v-if="tabs2 === 0 || tabs2 === 1">
                <v-select v-model="AS_FLW_ACP_SRCH_ITEM" :items="AS_FLW_ACP_SRCH_ITEM_LIST" class="pl-form is-sm"
                  placeholder="선택"></v-select>
                <v-select v-if="AS_FLW_ACP_SRCH_ITEM == 'FLW_PGRS_SS_CD'" v-model="FLW_PGRS_SS_CD"
                  :items="FLW_PGRS_SS_CD_LIST" class="pl-form is-sm" placeholder="선택"></v-select>
                <v-text-field v-if="AS_FLW_ACP_SRCH_ITEM != 'FLW_PGRS_SS_CD'" v-model="AS_FLW_ACP_SRCH_KWRD"
                  class="pl-form " placeholder="검색어" />
                <v-btn class="pl-btn is-sm" @click="searchFlwAcpHist"
                  :disabled="CUST_INFO && CUST_INFO.HO_ADM_NO ? false : true">조회</v-btn>
              </template>
              <!-- sms용 검색 -->
              <template v-else-if="tabs2 === 4">
                <v-text-field v-model="SCH_SMS_TXT" class="pl-form is-md"
                  placeholder="발송내용 검색"
                  @keyup.enter="$eventBus.$emit('searchSmsHist', {SCH_SMS_TXT: SCH_SMS_TXT})"
                />
                <v-btn
                  class="pl-btn is-sm"
                  @click="$eventBus.$emit('searchSmsHist', {SCH_SMS_TXT: SCH_SMS_TXT})">
                  조회
                </v-btn>
              </template>

            </div>
          </template>
        </CompoTabItems>
      </v-tabs>
      <v-tabs-items v-model="tabs2">
        <div class="fill-height">
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistAsFlwAcp`">
              <CompoTabHistAsFlwAcp HistTypeProp="NEW" :TabProp="tabs2" :CustInfoProp="CUST_INFO"
                :SrchProp="AS_FLW_ACP_SRCH_PROP" :SCH_CUSTCO_ID="SCH_CUSTCO_ID" :readOnly="readOnly"
                :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistAsFlwAcp`">
              <CompoTabHistAsFlwAcp HistTypeProp="OLD" :TabProp="tabs2" :CustInfoProp="CUST_INFO"
                :SrchProp="AS_FLW_ACP_SRCH_PROP" :SCH_CUSTCO_ID="SCH_CUSTCO_ID" :readOnly="readOnly"
                :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistAsCutt`">
              <CompoTabHistAsCutt :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistCuttCustco`">
              <CompoTabHistCuttCustco :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistSendSms`">
              <CompoTabHistSendSms :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistSendSmsEx`">
              <CompoTabHistSendSmsEx :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistSendAtalk`">
              <CompoTabHistSendAtalk :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistPhnNo`">
              <CompoTabHistPhnNo :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistRcvTel`">
              <CompoTabHistRcvTel :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div :class="`fill-height tab-contents mt-2 TAB_NAME_CompoTabHistCaution`">
              <CompoTabHistCaution :TabProp="tabs2" :CustInfoProp="CUST_INFO" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
                :readOnly="readOnly" :detailYn="detailYn" />
            </div>
          </v-tab-item>
        </div>
      </v-tabs-items>
    </template>
    <!-- else -->

  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoTabHistCutt from '@/components/csl/CompoTabHistCutt.vue' //상담이력
import CompoTabHistCuttCustco from '@/components/csl/CompoTabHistCuttCustco.vue' //타센터 상담이력
import CompoTabHistSendSms from '@/components/csl/CompoTabHistSendSms.vue' //SMS 이력
import CompoTabHistSendSmsEx from '@/components/csl/CompoTabHistSendSmsEx.vue' //SMS 이력(고객외외)
import CompoTabHistPhnNo from '@/components/csl/CompoTabHistPhnNo.vue' //전화번호 변경이력
import CompoTabHistRcvTel from '@/components/csl/CompoTabHistRcvTel.vue' //통화 예약현황
import CompoTabHistCaution from '@/components/csl/CompoTabHistCaution.vue' //배려 고객 이력
import CompoTabHistComplaint from '@/components/csl/CompoTabHistComplaint.vue' //대 내/외 민원
import CompoTabHistCampain from '@/components/csl/CompoTabHistCampain.vue' //캠페인

import CompoTabHistAsFlwAcp from '@/components/csl/CompoTabHistAsFlwAcp.vue' // 신 AS 접수이력
import CompoTabHistAsCutt from '@/components/csl/CompoTabHistAsCutt.vue' // 바로처리 상담이력
import CompoTabHistSendAtalk from '@/components/csl/CompoTabHistSendAtalk.vue' //알림톡 이력


export default {
  name: "CompoInfoHist", //상담 - 이력 정보 영역
  props: {
    RESET_ABLE: {
      type: Boolean,
      default: false
    },
    SCH_CUSTCO_ID: {
      type: String,
      default: '1'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    detailYn: {
      type: Boolean,
      default: false
    },
  },
  components: {
    CompoTabItems,
    CompoTabHistCutt,
    CompoTabHistCuttCustco,
    CompoTabHistSendSms,
    CompoTabHistSendSmsEx,
    CompoTabHistPhnNo,
    CompoTabHistRcvTel,
    CompoTabHistCaution,
    CompoTabHistComplaint,
    CompoTabHistCampain,
    CompoTabHistAsFlwAcp,
    CompoTabHistAsCutt,
    CompoTabHistSendAtalk,
  },
  data() {
    return {
      //고객사 ID : 바로처리 : '4'
      CUSTCO_ID: this.SCH_CUSTCO_ID ? this.SCH_CUSTCO_ID : this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,
      centerClass: this.SCH_CUSTCO_ID ? this.SCH_CUSTCO_ID : this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID === '4' ? 'as' : 'common',
      //고객정보
      CUST_INFO: {},
      AS_FLW_ACP_SRCH_ITEM: '',
      AS_FLW_ACP_SRCH_ITEM_LIST: [
        { text: '선택', value: '' },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN' },
        { text: '공종', value: 'FLW_NM' },
        { text: '처리결과', value: 'FLW_PGRS_SS_CD' },
        { text: 'AS접수내용', value: 'FLW_CTS' },
      ],
      FLW_PGRS_SS_CD: '',
      FLW_PGRS_SS_CD_LIST: [],
      AS_FLW_ACP_SRCH_KWRD: '',
      AS_FLW_ACP_SRCH_PROP: {},


      // 상담이력
      tabs2: 0,
      tabsListCommon: [
        { title: '상담이력', content: 'CompoTabHistCutt', badge: false, dblclick: 'dblclick' },//CSL_M0100_CS_TAB01
        { title: '타센터 상담이력', content: 'CompoTabHistCuttCustco', badge: false },//CSL_M0100_CS_TAB02
        { title: 'SMS 이력', content: 'CompoTabHistSendSms', badge: false },//CSL_M0100_CS_TAB03
        { title: 'SMS 이력(고객정보외)', content: 'CompoTabHistSendSmsEx', badge: false },//CSL_M0100_CS_TAB07
        { title: '전화번호 변경이력', content: 'CompoTabHistPhnNo', badge: false },//CSL_M0100_CS_TAB04
        { title: '통화 예약현황', content: 'CompoTabHistRcvTel', badge: false },//CSL_M0100_CS_TAB05
        { title: '배려고객이력', content: 'CompoTabHistCaution', badge: false },//CSL_M0100_CS_TAB06
        // { title: '대 내/외 민원', content: 'CompoTabHistComplaint', badge: false},//CSL_M0100_CS_TAB06
        { title: '캠페인', content: 'CompoTabHistCampain', badge: false },//CSL_M0100_CS_TAB06
      ],


      tabsListAs: [
        { title: '(신)AS 접수이력', content: 'CompoTabHistAsFlwAcpNew', badge: false, tabClickRefresh: true, dblclick: 'dblclick' },//CSL_M0100_CS_IC_TAB01
        { title: '(구)AS 접수이력', content: 'CompoTabHistAsFlwAcpOld', badge: false, tabClickRefresh: true, dblclick: 'dblclick' },//CSL_M0100_CS_IC_TAB01
        { title: '상담이력', content: 'CompoTabHistAsCutt', badge: false, dblclick: 'dblclick' },//CSL_M0100_CS_IC_TAB02
        { title: '타센터 상담이력', content: 'CompoTabHistCuttCustco', badge: false},//CSL_M0100_CS_TAB02
        { title: 'SMS 이력', content: 'CompoTabHistSendSms', badge: false, tabClickRefresh: true },//CSL_M0100_CS_TAB03
        { title: 'SMS 이력(고객정보외)', content: 'CompoTabHistSendSmsEx', badge: false },//CSL_M0100_CS_TAB07
        { title: '알림톡 이력', content: 'CompoTabHistSendAtalk', badge: false, tabClickRefresh: true },//CSL_M0100_CS_IC_TAB05
        { title: '전화번호 변경이력', content: 'CompoTabHistPhnNo', badge: false },//CSL_M0100_CS_TAB04
        { title: '통화 예약현황', content: 'CompoTabHistRcvTel', badge: false },//CSL_M0100_CS_TAB05
        { title: '배려고객이력', content: 'CompoTabHistCaution', badge: false },//CSL_M0100_CS_TAB06
      ],
      centerNmae: '',

      SCH_SMS_TXT:'',
    }
  },
  created() {
    //상담 - 이력 정보의 특정 탭 목록 호출
    this.$eventBus.$off("setCuttHistInfo");
    this.$eventBus.$on("setCuttHistInfo", (obj) => {
      this.setCuttHistInfo(obj);
    });
    this.getFlwPgrsSsCdList();
  },
  mounted() {
  },

  methods: {
    //상담 - 이력 정보의 특정 탭 목록 호출
    setCuttHistInfo(obj) {
      console.log('obj : ', obj, obj.CUST_INFO);
      if (obj && obj.TAB_IDX) {//TAB_IDX - string으로 받아야 함.
        this.tabs2 = parseInt(obj.TAB_IDX);
      }
      if (obj && obj.CUST_INFO) {
        this.CUST_INFO = obj.CUST_INFO;
        if (obj.CUTT_HIST_RELOAD) this.$eventBus.$emit('reloadHistCutt', this.CUST_INFO); //상담 저장 후 상담이력 새로고침
      }
    },

    //처리상태 코드 목록 조회
    async getFlwPgrsSsCdList() {
      this.FLW_PGRS_SS_CD_LIST = await this.mixinAsGetCommonCode("FLW_PGRS_SS_CD", [], "선택");
    },

    //AS 접수이력 조회
    searchFlwAcpHist() {
      if (this.AS_FLW_ACP_SRCH_ITEM == "") {
        this.showAlertInfo({ msg: '검색 항목을 선택해 주세요.' })
        return
      }
      this.AS_FLW_ACP_SRCH_PROP = { IS_SEARCH: false }
      if (this.AS_FLW_ACP_SRCH_ITEM == "V_FLW_ACP_SN") {
        this.AS_FLW_ACP_SRCH_PROP = {
          SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
          V_FLW_ACP_SN: this.AS_FLW_ACP_SRCH_KWRD,
          IS_SEARCH: true
        }

      } else if (this.AS_FLW_ACP_SRCH_ITEM == "FLW_NM") {
        if (this.tabs2 == 0) {
          const flwNms = this.AS_FLW_ACP_SRCH_KWRD.split(",");
          if (flwNms.length == 1) {
            this.AS_FLW_ACP_SRCH_PROP = {
              SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
              FLW_NM1: flwNms[0],
              IS_SEARCH: true
            }
          } else if (flwNms.length == 2) {
            this.AS_FLW_ACP_SRCH_PROP = {
              SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
              FLW_NM1: flwNms[0],
              FLW_NM2: flwNms[1],
              IS_SEARCH: true
            }
          }
        } else if (this.tabs2 == 1) {
          this.AS_FLW_ACP_SRCH_PROP = {
            SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
            FLW_NM: this.AS_FLW_ACP_SRCH_KWRD,
            IS_SEARCH: true
          }
        }
      } else if (this.AS_FLW_ACP_SRCH_ITEM == "FLW_PGRS_SS_CD") {
        this.AS_FLW_ACP_SRCH_PROP = {
          SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
          FLW_PGRS_SS_CD: this.FLW_PGRS_SS_CD,
          IS_SEARCH: true
        }
      } else if (this.AS_FLW_ACP_SRCH_ITEM == "FLW_CTS") {
        this.AS_FLW_ACP_SRCH_PROP = {
          SCH_CUSTCO_ID: this.SCH_CUSTCO_ID,
          FLW_CTS: this.AS_FLW_ACP_SRCH_KWRD,
          IS_SEARCH: true
        }
      }
    },
    layoutPopup(index) {
      console.log("layoutPopuplayoutPopuplayoutPopuplayoutPopup ", index)
      if (index == 0) {
        const injectionObj = {
          HistTypeProp: "NEW",
          TabProp: index,
          CustInfoProp: this.CUST_INFO
        }

        if (this.SCH_CUSTCO_ID === '4') {
          this.mixin_openWindow('LayoutPopup', '1620', '755', { title: '(신)AS접수이력', compo_name: 'CompoTabHistAsFlwAcp', injectionObj: injectionObj })
        } else {
          if (!this.readOnly && !this.detailYn && this.CUST_INFO.CUST_ID) this.mixin_openWindow('LayoutPopup', '1620', '755', { title: '상담이력', compo_name: 'CompoTabHistCutt', CustInfoProp: this.CUST_INFO, dbClckTabYn: true })
        }
      } else if (index == 1) {
        const injectionObj = {
          HistTypeProp: "OLD",
          TabProp: index,
          CustInfoProp: this.CUST_INFO
        }
        this.mixin_openWindow('LayoutPopup', '1620', '755', { title: '(구)AS접수이력', compo_name: 'CompoTabHistAsFlwAcp', injectionObj: injectionObj })
      } else if (index == 2) {
        const injectionObj = {
          TabProp: index,
          CustInfoProp: this.CUST_INFO
        }
        this.mixin_openWindow('LayoutPopup', '1620', '755', { title: '상담이력', compo_name: 'CompoTabHistAsCutt', injectionObj: injectionObj })
      }

    }
  },

  computed: {

  },
  watch: {
    tabs2() {
      console.log("watch tabs2", this.tabs2)
    },
    RESET_ABLE() {
      // if(this.RESET_ABLE){
      this.tabs2 = 0;
      this.CUST_INFO = {};
      // }
    }
  },
};
</script>

<style lang="scss">
.CS_LOG_TAB.center-common {
  &.favToggle {
    &-false {

      .TAB_NAME_CompoTabHistCutt,
      .TAB_NAME_CompoTabHistCuttCustco,
      .TAB_NAME_CompoTabHistSendSms,
      .TAB_NAME_CompoTabHistSendSmsEx,
      .TAB_NAME_CompoTabHistPhnNo,
      .TAB_NAME_CompoTabHistRcvTel,
      .TAB_NAME_CompoTabHistComplaint,
      .TAB_NAME_CompoTabHistCampain,
      .TAB_NAME_CompoTabHistCaution {
        .v-data-table__wrapper {
          height: 424px !important;
        }

        .CompoTabHistCutt,
        .CompoTabHistCuttCustco {
          overflow-y: auto;
          height: 390px !important;
        }
      }
    }

    &-true {

      .TAB_NAME_CompoTabHistCutt,
      .TAB_NAME_CompoTabHistCuttCustco,
      .TAB_NAME_CompoTabHistAsCutt,
      .TAB_NAME_CompoTabHistAsFlwAcp,
      .TAB_NAME_CompoTabHistSendSms,
      .TAB_NAME_CompoTabHistSendSmsEx,
      .TAB_NAME_CompoTabHistSendAtalk,
      .TAB_NAME_CompoTabHistPhnNo,
      .TAB_NAME_CompoTabHistRcvTel,
      .TAB_NAME_CompoTabHistComplaint,
      .TAB_NAME_CompoTabHistCampain,
      .TAB_NAME_CompoTabHistCaution {
        .v-data-table__wrapper {
          height: 211px !important;
        }

        .CompoTabHistCutt,
        .CompoTabHistCuttCustco,
        .CompoTabHistAsCutt,
        .CompoTabHistAsFlwAcp {
          overflow-y: auto;
          height: 177px !important;
        }
      }
    }
  }
}
</style>