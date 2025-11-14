<template>
  <div class="py-5">
    <v-tabs
      v-model="tabs1"
      hide-slider
      class="pl-tabs type-fill tab-grow px-5">
      <v-tab>이관 접수</v-tab>
      <v-tab>반려 요청</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs1">
      <!-- 이관접수 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ RTC_LIST.length }}</span>)건</span>
          <v-checkbox
            v-model="rtcEmerYn"
            class="pl-check ml-4"
            label="긴급"
          ></v-checkbox>
          <div class="pl-btn-wrap ml-auto">
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="getRtcList"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list is-border-top pl-scroll-body no-link">
          <template v-for="item, index in RTC_LIST">
            <div
            v-if="!rtcEmerYn || (rtcEmerYn && item.EMER_YN == 'Y')"
            class="pl-notice-list--unit"
            :key="item.id">
              <div class="d-flex ">
                <img :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
                <div class="flex-grow-1">
                  <div class="ml-3" @dblclick="searchOtherClick(item.SEARCH_CONDITION)">
                    <div class="d-flex align-center">
                      <strong style="font-size: 14px">{{ item.EMP_NM }}</strong>
                      <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
                      <span v-if="item.EMER_YN == 'Y'"
                          class="pl-badge is-red ml-1">긴급</span>
                    </div>
                    <div>
                      <strong>요청일자 </strong><span class="ml-1">{{ item.REG_DT }}</span>
                    </div>
                    <div class="d-flex">
                      <strong>AS접수번호 </strong>
                      <span class="ml-1 spacing-wrap sp-8" style="flex-wrap: wrap;">
                        <template v-for="(textItem, idx) in item.TEXT_LIST">
                          <span :key="textItem.PHN_CUTT_ID +'-' + idx" class="pl-badge is-blueGray hover-line" style="width: auto;">
                            {{ textItem }}
                          </span>
                        </template>
                      </span>
                    </div>
                    <div class="d-flex">
                      <strong class="flex-shrink-0">전달내용</strong>
                      <span class="ml-2">{{ item.REQ_CNTNT }}</span>
                    </div>
                    <div class="d-flex" v-if="item.cus_info">
                      <strong class="flex-shrink-0">고객정보</strong>
                      <span class="ml-2">{{ item.CUST_PHN_NO ? mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : '' }}({{ item.CUST_NM }})</span>
                    </div>
                    <div class="pl-btn-wrap is-mt-s">
                      <!-- 반려 -->
                      <v-menu
                        v-model="item.modelReject"
                        min-width="350"
                        offset-overflow
                        bottom
                        left
                        content-class="pl-menu-drop"
                        :close-on-content-click=false
                        :close-on-click=false
                      >
                        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                          <v-btn
                            v-bind="menuAttrs"
                            v-on="menuOn"
                            class="pl-btn is-sm is-esp ml-auto ">반려</v-btn>
                        </template>
                        <!-- 반려 v-menu -->
                        <div class="px-3 py-2">
                          <!-- header -->
                          <div class="d-flex">
                            <h3 style="font-size: 16px">반려사유</h3>
                            <v-btn
                              @click="item.modelReject = false"
                              plain
                              min-width="22"
                              height="22"
                              class="pl-tooltip-btn ml-auto"
                              >
                              <v-icon
                                small
                                class="pl-icon20 dialog-close-black">
                              </v-icon>
                            </v-btn>
                          </div>
                          <!-- form -->
                          <div class="is-mt-s">
                            <v-form :ref="'rejectForm-' + index">
                              <v-textarea
                                v-model="item.TRANS_REQ_CNTNT"
                                height="80"
                                class="pl-form is-noresize"
                                :spellcheck="false"
                                placeholder="사유 입력"
                                :rules="rejectValidateRules.TRANS_REQ_CNTNT"
                              />
                            </v-form>
                          </div>
                          <div class="pl-btn-wrap is-mt-m">
                            <v-btn
                              class="pl-btn is-trans ml-auto"
                              @click="item.modelReject = false">취소</v-btn>
                            <v-btn class="pl-btn" @click="btnReject(item, index)">등록</v-btn>
                          </div>
                        </div>
                      </v-menu>
                      <v-btn class="pl-btn is-sm" @click="btnComplete(item)">완료</v-btn>
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
      <!-- 반려 요청 -->
      <v-tab-item >
        <!-- list top -->
        <div class="d-flex align-center is-mt-s px-5">
          <span class="pl-label">전체 (<span class="is-txt-blue">{{ RTRC_LIST.length }}</span>)건</span>
          <v-checkbox
            v-model="rtrcEmerYn"
            class="pl-check ml-4"
            label="긴급"
          ></v-checkbox>
          <div class="pl-btn-wrap ml-auto">
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="getRtrcList"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- list -->
        <div
          style="height: calc(-262px + 100vh);"
          class="is-mt-s pl-notice-list is-border-top pl-scroll-body no-link">
          <template v-for="item in RTRC_LIST">
            <div
            v-if="!rtrcEmerYn || (rtrcEmerYn && item.EMER_YN == 'Y')"
            class="pl-notice-list--unit"
            :key="item.id">
              <div class="d-flex ">
                <img :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
                <div class="d-flex align-center flex-grow-1">
                  <div class="ml-3" @dblclick="searchOtherClick(item.SEARCH_CONDITION)">
                    <div class="d-flex align-center">
                      <strong style="font-size: 14px">{{ item.EMP_NM }}</strong>
                      <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
                      <span v-if="item.EMER_YN == 'Y'"
                          class="pl-badge is-red ml-1">긴급</span>
                    </div>
                    <div>
                      <strong>반려일자 </strong><span class="ml-1">{{ item.REG_DT }}</span>
                    </div>
                    <div class="d-flex">
                      <strong>AS접수번호 </strong>
                      <span class="ml-1 spacing-wrap sp-8" style="flex-wrap: wrap;">
                        <template v-for="(textItem, idx) in item.TEXT_LIST">
                          <span :key="textItem.PHN_CUTT_ID +'-' + idx" class="pl-badge is-blueGray hover-line" style="width: auto;">
                            {{ textItem }}
                          </span>
                        </template>
                      </span>
                    </div>
                    <div class="d-flex">
                      <strong class="flex-shrink-0">반려사유</strong>
                      <span class="ml-2">{{ item.REQ_CNTNT }}</span>
                    </div>
                    <div class="d-flex" v-if="item.cus_info">
                      <strong class="flex-shrink-0">고객정보</strong>
                      <span class="ml-2">{{ item.CUST_PHN_NO ? mixin_setPhoneNo(item.CUST_PHN_NO.replace(/[^0-9]/g, "")) : '' }}({{ item.CUST_NM }})</span>
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
  </div>
</template>

<script>
export default {
  name: "StatusBoardCenterTransScheduler", //스케줄러 상담 모니터링 - 이관접수, 반려요청
  components: {
  },
  props:{
    TabProp: {
      type: Number,
      default: null,
    },
    InjectionProp: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      tabs1: 0,


      rtcEmerYn: false,
      rtrcEmerYn: false,

      // 이관 접수
      RTC_LIST: [
        { img: require('@/assets/img/@manager_profile4.png'),
          name: '최혜미',
          center: '바로처리센터 - 바로처리1팀',
          type: '긴급',
          req_date: '2024-06-20 09:35:02',
          as_id: '240610-47-04567',
          note: '세대내 욕실 세면대 하부 누수로 인한 유지보수 요청',
          cus_info: '010-1004-1004(나고객)',
          modelReject: false
        },
        { img: require('@/assets/img/@manager_profile.png'),
          name: '김진아',
          center: '바로처리센터 - 바로처리1팀',
          type: '일반',
          req_date: '2024-06-20 09:35:02',
          as_id: '240610-47-04567',
          note: '공용부 유지보수',
          cus_info: '010-1004-1004(나고객)',
          modelReject: false
        },
      ],

      // 반려 요청
      RTRC_LIST: [
        { img: require('@/assets/img/@manager_profile4.png'),
          name: '최혜미',
          center: '바로처리센터 - 바로처리1팀',
          req_date: '2024-06-20 09:35:02',
          as_id: '240610-47-04567',
          note: '스케줄러 담당 업무가 아닙니다.',
          cus_info: '010-1004-1004(나고객)',
          type: '일반',
        },
        { img: require('@/assets/img/@manager_profile.png'),
          name: '김진아',
          center: '바로처리센터 - 바로처리1팀',
          req_date: '2024-06-20 09:35:02',
          as_id: '240610-47-04567',
          note: '스케줄러 담당 업무가 아닙니다. 스케줄러 담당 업무가 아닙니다. 스케줄러 담당 업무가 아닙니다.',
          cus_info: '010-1004-1004(나고객)',
          type: '긴급',
        },
      ],
      detailList: [
        { title: '요청일자'},
        { title: 'AS 접수번호'},
        { title: '상담사'},
      ],
      detailList2: [
        { title: '반려일자'},
        { title: 'AS 접수번호'},
        { title: '상담사'},
      ],

      rejectValidateRules: {
        TRANS_REQ_CNTNT: [
          v => !!v || '반려 사유는 필수 항목 입니다.',
        ],
      },
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
        this.getRtcList();
      } else {
        this.getRtrcList();
      }
    }
  },
  mounted() {
  },
  created() {
    this.tabs1 = this.TabProp - 1;
    console.log("StatusBoardCenterTransScheduler, tabs1", this.CUTT_MONITOR_STAT, this.tabs1);
    if(this.tabs1 == 0) {
      this.getRtcList();
    } else {
      this.getRtrcList();
    }

  },
  methods: {
    //이관 접수 목록 조회
    async getRtcList() {
      console.log("getRtcList - 이관 접수 목록 조회");
      this.RTC_LIST = [];
      const postParam = {
        TRANS_TYPE: 'ISMATRDV001',
        SRCH_USER_ID: this.InjectionProp.SRCH_USER_ID
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/select/selectRtcRtrcList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        response.DATA.map(item => {
          if(item.FLW_INFO) {
            const flwInfoList = item.FLW_INFO.split(",");
            let textList = [];
            let flwDtlFullSnList = [];
            //ara_hdq_cd, flw_rgs_dt, flw_acp_sn, flw_dtl_sn, mgof_cd, hno
            for (let idx=0; idx<flwInfoList.length; idx++) {
              let splitInfo = flwInfoList[idx].split("|");
              textList.push(splitInfo[0]);
              flwDtlFullSnList.push(splitInfo[1]);
            }
            item.SEARCH_CONDITION = {SRCH_FROM:"OTHER", SELECT_ROW_YN: 'N', SELECT_ROW_DBL_YN: 'Y', FLW_DTL_FULL_SN_LIST: flwDtlFullSnList};
            item.TEXT_LIST = textList;
          }
        })

        this.RTC_LIST = response.DATA
        console.log("this.RTC_LIST", this.RTC_LIST)
      }
    },


    //반려 요청 목록 조회
    async getRtrcList() {
      console.log("getRtrcList - 반려 요청 목록 조회");
      this.RTRC_LIST = [];
      const postParam = {
        TRANS_TYPE: 'ISMATRDV002',
        SRCH_USER_ID: this.InjectionProp.SRCH_USER_ID
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/select/selectRtcRtrcList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        response.DATA.map(item => {
          if(item.FLW_INFO) {
            const flwInfoList = item.FLW_INFO.split(",");
            let textList = [];
            let flwDtlFullSnList = [];
            //ara_hdq_cd, flw_rgs_dt, flw_acp_sn, flw_dtl_sn, mgof_cd, hno
            for (let idx=0; idx<flwInfoList.length; idx++) {
              let splitInfo = flwInfoList[idx].split("|");
              textList.push(splitInfo[0]);
              flwDtlFullSnList.push(splitInfo[1]);
            }
            item.SEARCH_CONDITION = {SRCH_FROM:"OTHER", SELECT_ROW_YN: 'N', SELECT_ROW_DBL_YN: 'Y', FLW_DTL_FULL_SN_LIST: flwDtlFullSnList};
            item.TEXT_LIST = textList;
          }
        })

        this.RTRC_LIST = response.DATA
        console.log("this.RTRC_LIST", this.RTRC_LIST)
      }
    },


    searchOtherClick(searchCondition) {
      console.log("searchOtherClick", searchCondition)
      //전화상담탭이 있는지 확인
      let m0100 = false;
      if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

      if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
      setTimeout(() => {
        this.$eventBus.$emit('setSchedulerSrchFrom', "OTHER");
        this.$eventBus.$emit('searchSchedulerListPaging', searchCondition);
      }, !m0100?1000:10);

    },

   //이관접수 - 완료
   btnComplete(item) {
      this.showConfirmInfo({
        msg:'완료 처리하시겠습니까?'
        , callYes: () => {
          this.transComplete(item);
        }
        , callNo: this.closeAlert
      });
    },

    //이관 완료 처리
    async transComplete(item) {
      const postParam = {
        PHN_CUTT_ID: item.PHN_CUTT_ID, // 상담번호
        RCPT_TRNSF_ID: item.RCPT_TRNSF_ID, // 이관접수번호
      };
      const headParam = {head: {}};
      console.log("transComplete", postParam)
      let response = await this.common_postCall("/phone-api/as/scheduler/transComplete", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        this.getRtcList();
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT')
        this.showToastSuccess({msg:"정상 처리되었습니다."})
        this.closeAlert();
      }
    },


    //이관접수 - 반려 요청
   btnReject(item, index) {
      if(!this.$refs["rejectForm-" + index][0].validate()) {
        return
      }
      this.showConfirmInfo({
        msg:'반려 요청하시겠습니까?'
        , callYes: () => {
          this.transReject(item);
        }
        , callNo: this.closeAlert
      });
    },

    //이관 반려 요청 처리
    async transReject(item) {
      const postParam = {
        PHN_CUTT_ID: item.PHN_CUTT_ID, // 상담번호
        RCPT_TRNSF_ID: item.RCPT_TRNSF_ID, // 이관접수번호
        REQ_CNTNT: item.TRANS_REQ_CNTNT //반려 요청 내용
      };
      const headParam = {head: {}};
      console.log("transReject", postParam)
      let response = await this.common_postCall("/phone-api/as/scheduler/transReject", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        item.modelReject = false;
        this.getRtcList();
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT')
        this.showToastSuccess({msg:"정상 처리되었습니다."})
        this.closeAlert();
      }
    }
  },



};
</script>

<style lang="scss" scoped>

</style>