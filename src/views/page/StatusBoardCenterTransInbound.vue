<template>
  <div class="py-5">
    <v-tabs
      v-model="tabs1"
      hide-slider
      class="pl-tabs type-fill tab-grow px-5">
      <v-tab>이관 요청</v-tab>
      <v-tab>반려 접수</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs1">
      <!-- 이관요청 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ STC_LIST.length }}</span>)건</span>
          <v-checkbox
            v-model="stcEmerYn"
            class="pl-check ml-4"
            label="긴급"
          ></v-checkbox>
          <div class="pl-btn-wrap ml-auto">
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="getStcList"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list is-border-top pl-scroll-body no-link">
          <template v-for="item in STC_LIST">
            <div
            v-if="!stcEmerYn || (stcEmerYn && item.EMER_YN == 'Y')"
            class="pl-notice-list--unit"
            :key="item.PHN_CUTT_ID">
              <div class="d-flex ">
                <img :src="item.img" :alt="item.name" style="max-width: 35px; max-height: 35px; border-radius: 50%;">
                <img
                  :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')"
                  :alt="item['CUSL_NM']"
                  style="max-width: 35px; max-height: 35px; border-radius: 50%;"
                  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
                <div class="d-flex align-center flex-grow-1">
                  <div class="ml-3">
                    <div class="d-flex align-center"
                      @click="viewDetail(item)">
                      <strong style="font-size: 14px">{{ item.EMP_NM }}</strong>
                      <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
                      <span v-if="item.EMER_YN == 'Y'"
                        class="pl-badge is-red ml-1">긴급</span>
                    </div>
                    <div >
                      <strong>요청일시 </strong><span class="ml-1">{{ item.REG_YMD }}</span>
                    </div>
                    <div class="d-flex">
                      <strong>AS접수번호 </strong>
                      <span class="ml-1 spacing-wrap sp-8" style="flex-wrap: wrap;">
                        <template v-for="flwLinkItem in item.FLW_LINK_INFO">
                          <span @dblclick="flwDetailLinkClick(flwLinkItem)" :key="flwLinkItem.FLW_DTL_FULL_SN" class="pl-badge is-blueGray hover-line" style="width: auto;">
                            {{ flwLinkItem.FLW_DTL_FULL_SN }}
                          </span>
                        </template>
                      </span>
                    </div>
                    <div class="d-flex">
                      <strong class="flex-shrink-0">전달내용</strong>
                      <span class="ml-2">{{ item.REQ_CNTNT }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- footer -->
        <!-- <div class="is-border-top pl-list-footer justify-center">
          <v-btn class="pl-btn is-round is-sub px-4">더보기</v-btn>
        </div> -->
      </v-tab-item>
      <!-- 반려 접수 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ STRC_LIST.length }}</span>)건</span>
          <v-checkbox
            v-model="strcEmerYn"
            class="pl-check ml-4"
            label="긴급"
            input-value="true"
          ></v-checkbox>
          <div class="pl-btn-wrap ml-auto">
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="getStrcList"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list is-border-top pl-scroll-body no-link">
          <template v-for="item in STRC_LIST">
            <div
            v-if="!strcEmerYn || (strcEmerYn && item.EMER_YN == 'Y')"
            class="pl-notice-list--unit"

            :key="item.PHN_CUTT_ID">
              <div class="d-flex ">
                <img :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
                <div class="d-flex align-center flex-grow-1">
                  <div class="ml-3">
                    <div class="d-flex align-center"
                      @click="viewDetail(item)">
                      <strong style="font-size: 14px">{{ item.EMP_NM }}</strong>
                      <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
                      <span v-if="item.EMER_YN == 'Y'"
                        class="pl-badge is-red ml-1">긴급</span>
                    </div>
                    <div >
                      <strong>반려일시 </strong><span class="ml-1">{{ item.REG_YMD }}</span>
                    </div>
                    <div class="d-flex">
                      <strong>AS접수번호 </strong>
                      <span class="ml-1 spacing-wrap sp-8" style="flex-wrap: wrap;">
                        <template v-for="flwLinkItem in item.FLW_LINK_INFO">
                          <span @dblclick="flwDetailLinkClick(flwLinkItem)" :key="flwLinkItem.FLW_DTL_FULL_SN" class="pl-badge is-blueGray hover-line" style="width: auto;">
                            {{ flwLinkItem.FLW_DTL_FULL_SN }}
                          </span>
                        </template>
                      </span>
                    </div>
                    <div class="d-flex">
                      <strong class="flex-shrink-0">반려사유</strong>
                      <span class="ml-2">{{ item.REQ_CNTNT }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!-- footer -->
        <!-- <div class="is-border-top pl-list-footer justify-center">
          <v-btn class="pl-btn is-round is-sub px-4">더보기</v-btn>
        </div> -->
      </v-tab-item>

    </v-tabs-items>
    <!-- side panel : 상담 상세정보-->
    <!-- <v-slide-x-reverse-transition>
      <div v-if=" dialogCsDetail === true "
        style="width: 1040px"
        :style="tempCenterStyle"
        class="pl-quick-layer" >
        <div class="pl-quick-layer-header"><h1>AS 접수 상세 </h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', popData : {histType: 'NEW', ARA_HDQ_CD: SEL_ITEM.ARA_HDQ_CD, FLW_RGS_DT: SEL_ITEM.FLW_RGS_DT, FLW_ACP_SN: SEL_ITEM.FLW_ACP_SN, FLW_DTL_SN: SEL_ITEM.FLW_DTL_SN, MGOF_CD: SEL_ITEM.MGOF_CD}})"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogCsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <CompoAsFlwAcpDetail
          :DataProp="{histType: 'NEW', ARA_HDQ_CD: SEL_ITEM.ARA_HDQ_CD, FLW_RGS_DT: SEL_ITEM.FLW_RGS_DT, FLW_ACP_SN: SEL_ITEM.FLW_ACP_SN, FLW_DTL_SN: SEL_ITEM.FLW_DTL_SN, MGOF_CD: SEL_ITEM.MGOF_CD}"
        />
      </div>
    </v-slide-x-reverse-transition> -->
  </div>
</template>

<script>
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail.vue'
export default {
  name: "StatusBoardCenterTransInbound", //인바운드 상담 모니터링 - 이관요청, 반려 접수
  components: {
    CompoAsFlwAcpDetail
  },
  props:{
    TabProp: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      tabs1: 0,
      dialogCsDetail: false,


      stcEmerYn: false,
      strcEmerYn: false,
      SEL_ITEM: {},

      // 이관요청
      STC_LIST: [],

      // 반려 접수
      STRC_LIST: [],
      detailList: [
        { title: '요청일시'},
        { title: 'AS 접수번호'},
        { title: '상담사'},
      ],
      detailList2: [
        { title: '반려일시'},
        { title: 'AS 접수번호'},
        { title: '상담사'},
      ],

    }
  },
  computed: {
  },
  watch: {
    TabProp() {
      this.tabs1 = this.TabProp - 1;
    },
    tabs1() {
      if(this.tabs1 == 0) {
        this.getStcList();
      } else {
        this.getStrcList();
      }
    }
  },
  mounted() {
  },
  created() {
    this.tabs1 = this.TabProp - 1;
    console.log("StatusBoardCenterTransInbound, tabs1", this.CUTT_MONITOR_STAT, this.tabs1);
    if(this.tabs1 == 0) {
      this.getStcList();
    } else {
      this.getStrcList();
    }

  },
  methods: {
    //이관 요청 목록 조회
    async getStcList() {
      console.log("getStcList - 이관 요청 목록 조회");
      this.STC_LIST = [];
      const postParam = {
        TRANS_TYPE: 'ISMATRDV001'
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/select/selectStcStrcList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        response.DATA.map(item => {
          if(item.FLW_INFO) {
            const flwInfoList = item.FLW_INFO.split(",");
            let flwLinkList = [];
            //ara_hdq_cd, flw_rgs_dt, flw_acp_sn, flw_dtl_sn, mgof_cd, hno
            for (let idx=0; idx<flwInfoList.length; idx++) {
              let splitInfo = flwInfoList[idx].split("|");
              flwLinkList.push({FLW_DTL_FULL_SN: splitInfo[0], ARA_HDQ_CD: splitInfo[1], FLW_RGS_DT: splitInfo[2], FLW_ACP_SN: splitInfo[3], FLW_DTL_SN: splitInfo[4], MGOF_CD: splitInfo[5], HNO: splitInfo[6]})

            }
            item.FLW_LINK_INFO = flwLinkList;
          }
        })

        this.STC_LIST = response.DATA
        console.log("this.STC_LIST", this.STC_LIST)
      }
    },


    //반려 접수 목록 조회
    async getStrcList() {
      console.log("getStrcList - 반려 접수 목록 조회");
      this.STRC_LIST = [];
      const postParam = {
        TRANS_TYPE: 'ISMATRDV002'
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/select/selectStcStrcList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        response.DATA.map(item => {
          if(item.FLW_INFO) {
            const flwInfoList = item.FLW_INFO.split(",");
            let flwLinkList = [];
            //ara_hdq_cd, flw_rgs_dt, flw_acp_sn, flw_dtl_sn, mgof_cd, hno
            for (let idx=0; idx<flwInfoList.length; idx++) {
              let splitInfo = flwInfoList[idx].split("|");
              flwLinkList.push({FLW_DTL_FULL_SN: splitInfo[0], ARA_HDQ_CD: splitInfo[1], FLW_RGS_DT: splitInfo[2], FLW_ACP_SN: splitInfo[3], FLW_DTL_SN: splitInfo[4], MGOF_CD: splitInfo[5], HNO: splitInfo[6]})

            }
            item.FLW_LINK_INFO = flwLinkList;
          }
        })
        this.STRC_LIST = response.DATA
        console.log("this.STRC_LIST", this.STRC_LIST)
      }
    },


    flwDetailLinkClick(item) {//isLockFlwCts
      this.SEL_ITEM = item;
      // this.dialogCsDetail = true
      this.mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', popData : {histType: 'NEW', HNO: this.SEL_ITEM.HNO, ARA_HDQ_CD: this.SEL_ITEM.ARA_HDQ_CD, FLW_RGS_DT: this.SEL_ITEM.FLW_RGS_DT, FLW_ACP_SN: this.SEL_ITEM.FLW_ACP_SN, FLW_DTL_SN: this.SEL_ITEM.FLW_DTL_SN, MGOF_CD: this.SEL_ITEM.MGOF_CD}})
    },

    //전화상담 - 고객전화번호 조회 호출
    viewDetail(item) {
      //전화상담탭이 있는지 확인
      let m0100 = false;
      if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

      if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
      setTimeout(() => {
        this.$eventBus.$emit("setCuttUnProcCustInfo", {CUST_NO: item.CUST_ID, PHN_CUTT_ID: item.PHN_CUTT_ID, MON_Q_TASK: this.tabs1 == 0 ? "STC" : "STRC"})
      }, !m0100?1000:10);

    },
  },
};
</script>

<style lang="scss" scoped>

</style>