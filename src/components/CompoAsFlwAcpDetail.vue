<template>
  <div style="display: contents">
    <div class="pl-quick-layer-body pt-3" :style="isPopup ? '100%' : 'flex: 0 0 calc(100% - 155px);'">

      <!--  -->
      <div class="">
        <!-- 고객정보 -->
        <div class="pl-header is-no-boredr">
          <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
          <div class="pl-subtit ml-1">고객정보</div>
        </div>
        <div class="is-mt-s">
          <table class="pl-tbl-detail">
            <colgroup>
              <col width="127px" />
              <col width="" />
              <col width="127px" />
              <col width="" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    접수자
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="CUST_INFO.EMP_NM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    접수채널
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.ACP_CHNL_NM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    민원인
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.CVPR_NM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    연락처
                    <!-- 문자 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="문자 보내기"
                      ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 td-in-sms"
                      TooltipPositionProp="bottom"
                      :MinWidthProp=22
                      :HeightProp=22
                      @btnClick="showSidePanel('SendSms')"
                    ></compo-tooltip-btn>
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.MBL_NO"
                  disabled
                  class="pl-form is-auto"
                  placeholder=""/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- tab:  AS 접수정보  -->
        <v-tabs
          v-model="tabs2"
          slider-size="2"
          class="pl-tabs type-subtab is-mt-l">
          <CompoTabItems :TabsList=tabsList2 />
        </v-tabs>
        <v-tabs-items v-model="tabs2">
          <div class="fill-height">
              <v-tab-item>
                <div
                  :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsFlwAcpDetail_SUBTAB01`">
                  <CompoAsFlwAcpDetail_SUBTAB01 
                    :TabProp="tabs2"
                    :DataProp="data"
                    :CustInfoProp="CUST_INFO"
                    @setFlwAcpInfo="setFlwAcpInfo"
                  />
                </div>
              </v-tab-item>
              <v-tab-item>
                <div
                  :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsFlwAcpDetail_SUBTAB04`">
                  <CompoAsFlwAcpDetail_SUBTAB04 
                    :TabProp="tabs2"
                    :DataProp="{FLW_DTL_FULL_SN: FLW_ACP_INFO.FLW_DTL_FULL_SN}"
                  />
                </div>
              </v-tab-item>
              <v-tab-item>
                <div
                  :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsFlwAcpDetail_SUBTAB03`">
                  <CompoAsFlwAcpDetail_SUBTAB03 
                    :TabProp="tabs2"
                    :DataProp="data"
                    :FlwAcpInfoProp="FLW_ACP_INFO"
                  />
                </div>
              </v-tab-item>
          </div>
        </v-tabs-items>

        <!-- tab: 스케줄러 현황  -->
        <v-tabs
          v-model="tabs3"
          slider-size="2"
          class="pl-tabs type-subtab is-mt-l">
          <CompoTabItems :TabsList=tabsList3 />
          <template v-if="tabs3 === 0">
            <span class="ml-auto d-flex align-center is-txt-black">{{ RCV_SCHEDULER_STATUS.ASSGN_DT ? RCV_SCHEDULER_STATUS.ASSGN_DT + " 분배" : ""}}</span>
          </template>
        </v-tabs>

        <v-tabs-items v-model="tabs3">
          <div class="fill-height">
            <v-tab-item>
              <div
                :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsFlwAcpDetail_SCHEDULE`">
                <CompoAsFlwAcpDetail_SCHEDULE 
                  :DataProp="{FLW_DTL_FULL_SN: FLW_ACP_INFO.FLW_DTL_FULL_SN}"
                  @setRcvSchedulerStatus="setRcvSchedulerStatus"
                />
              </div>
            </v-tab-item>
            <v-tab-item>
              <div
                :class="`fill-height tab-contents mt-2 TAB_NAME_CompoAsFlwAcpDetail_HISTORY`">
                <CompoAsFlwAcpDetail_HISTORY 
                  :DataProp="{FLW_DTL_FULL_SN: FLW_ACP_INFO.FLW_DTL_FULL_SN}"
                />
              </div>
            </v-tab-item>
          </div>
        </v-tabs-items>

      </div>
    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';

// 바로처리 AS접수 상세
import CompoAsFlwAcpDetail_SUBTAB01 from '@/components/CompoAsFlwAcpDetail_SUBTAB01.vue' //AS 접수정보
import CompoAsFlwAcpDetail_SUBTAB02 from '@/components/CompoAsFlwAcpDetail_SUBTAB02.vue' //작업내용
import CompoAsFlwAcpDetail_SUBTAB03 from '@/components/CompoAsFlwAcpDetail_SUBTAB03.vue' //세대 특이사항
import CompoAsFlwAcpDetail_SUBTAB04 from '@/components/CompoAsFlwAcpDetail_SUBTAB04.vue' //접촉이력

import CompoAsFlwAcpDetail_SCHEDULE from '@/components/CompoAsFlwAcpDetail_SCHEDULE.vue' //스케줄러 현황
import CompoAsFlwAcpDetail_HISTORY from '@/components/CompoAsFlwAcpDetail_HISTORY.vue' //진행현황 이력


export default {
  name: "CompoAsFlwAcpDetail", //AS접수 상세
  props: {
    DataProp: {
      type: Object,
    },
    popData: {
      type: Object,
      default: null,
    }
  },
  components: {
    CompoTabItems,
    CompoAsFlwAcpDetail_SUBTAB01,
    CompoAsFlwAcpDetail_SUBTAB02,
    CompoAsFlwAcpDetail_SUBTAB03,
    CompoAsFlwAcpDetail_SUBTAB04,
    CompoAsFlwAcpDetail_SCHEDULE,
    CompoAsFlwAcpDetail_HISTORY,
  },
  data() {
    return {
      data: {},
      dialogSendSMS: false,
      isPopup: false,

      CUST_INFO: {},
      FLW_ACP_INFO: {},
      RCV_SCHEDULER_STATUS: {},

      // tab
      tabs2: 0,
      tabsList2: [
        { title: 'AS 접수정보/작업내용', content: 'CompoAsFlwAcpDetail_SUBTAB01', badge: false},
        // { title: '작업내용 ', content: 'CompoAsFlwAcpDetail_SUBTAB02', badge: true},
        { title: '접촉이력 ', content: 'CompoAsFlwAcpDetail_SUBTAB04', badge: false},
        { title: '세대 특이사항 ', content: 'CompoAsFlwAcpDetail_SUBTAB03', badge: false},
      ],

      tabs3: 0,
      tabsList3: [
        { title: '스케줄러 현황', content: 'CompoAsFlwAcpDetail_SCHEDULE', badge: false},
        { title: '진행현황 이력', content: 'CompoAsFlwAcpDetail_HISTORY', badge: false},
      ],



    }
  },
  mounted() {
  },
  async created() {
    
    if(this.popData != null) {
      this.data = this.popData;
      this.isPopup = true;
    } else {
      this.data = this.DataProp;
    }
    if(this.data && this.data.ARA_HDQ_CD) {
      this.getFlwAcpCust();
    }

    console.log("this.popData", this.popData)
    console.log("this.isPopup", this.isPopup)
  },
  computed: {

  },
  watch: {
  },
  methods: {
    close(){
      this.$emit('Close')
    },

    async getFlwAcpCust() {
      const postParam = {
        ARA_HDQ_CD : this.data && this.data.ARA_HDQ_CD ? this.data.ARA_HDQ_CD : '',
        FLW_RGS_DT : this.data && this.data.FLW_RGS_DT ? this.data.FLW_RGS_DT : '',
        FLW_ACP_SN : this.data && this.data.FLW_ACP_SN ? this.data.FLW_ACP_SN : '',
        FLW_DTL_SN : this.data && this.data.FLW_DTL_SN ? this.data.FLW_DTL_SN : '',
        HNO : this.data && this.data.HNO ? this.data.HNO : '',
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/flwacp/selectFlwAcpCust", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.CUST_INFO = response.DATA[0] ? response.DATA[0] : {};
      }
    },

    setFlwAcpInfo(item) {
      this.FLW_ACP_INFO = _.cloneDeep(item);
    },

    setRcvSchedulerStatus(item) {
      this.RCV_SCHEDULER_STATUS = item;
    },

    showSidePanel(name){
      
      let smsInfo = {
        CUST_PHN_NO: this.FLW_ACP_INFO.MBL_NO,
        SRC: 'FLAW_DETAIL',
        
      };
      if(this.FLW_ACP_INFO && this.FLW_ACP_INFO.V_FLW_ACP_SN) {
        const mgofTpCd = this.FLW_ACP_INFO.MGOF_TP_CD;
        const smsFlwInfo = {
          V_FLW_ACP_SN: this.FLW_ACP_INFO.V_FLW_ACP_SN,
          CVPR_NM: this.FLW_ACP_INFO.CVPR_NM,
          MBL_NO: this.FLW_ACP_INFO.MBL_NO,
          MGOF_NM: (mgofTpCd == '16' || mgofTpCd == '17' || mgofTpCd == '18' || mgofTpCd == '16,29') ? this.FLW_ACP_INFO.BLDG_ADR : this.FLW_ACP_INFO.MGOF_NM,
          BLDG_NO: this.FLW_ACP_INFO.BLDG_NO,
          HS_NO: this.FLW_ACP_INFO.HS_NO,
          FLW_CTS: this.FLW_ACP_INFO.FLW_CTS,
          JOB_FRM_NM: this.FLW_ACP_INFO.JOB_FRM_NM,
          BLDG_ADR: this.FLW_ACP_INFO.BLDG_ADR,
          DIST_EMP_NM: this.FLW_ACP_INFO.SMS_DIST_EMP_NM,
        }
        smsInfo = {...smsInfo, ...smsFlwInfo};
      }

      this.$eventBus.$emit('setSidePanelCustInfo', smsInfo);
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