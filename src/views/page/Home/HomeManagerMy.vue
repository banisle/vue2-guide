<template>
  <div class="pl-cols fill-height" style="gap: 24px;">
    <!-- 나의 오늘 상담 현황 -->
    <div class="pl-rounded-box px-5 py-4 fill-height" style="flex: 1 1 calc(70%);">
      <div class="d-flex align-center">
        <span class="pl-subtit">전일 나의 상담 현황</span>
        <div class="ml-auto">
          기준일 : {{ mixin_convertDate(PREV_CALL_DATA.TARGET_DATE, 'yyyy-MM-dd') }}
          <!-- <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            :MinWidthProp=22
            :HeightProp=22
          ></compo-tooltip-btn> -->
        </div>
      </div>
      <div class="is-mt-l">
        <!-- 호 -->
        <div class="align-center text-center" style="display:grid; grid-template-columns: repeat(6, 1fr); background-color: rgb(255, 255, 255);">
          <!-- icon -->
          <div>
            <v-icon class="pl-icon30 today-schedule"></v-icon>
          </div>
          <div
            class="justify-center"
            v-for="item in CALL_CNT_LIST"
            :key="item.id">
            <span>{{ item.title }}</span>
            <strong class="pl-subtit pt-2 justify-center">{{ item.count }}</strong>
          </div>

        </div>
        <!-- 시간 -->
        <div class="px-3 py-5 pl-rounded-box is-mt-m is-bg-light" style="border:0; display:grid; grid-template-columns: repeat(6, 1fr); background-color: rgb(255, 255, 255);">
          <div
            class="text-center"
            v-for="item in CALL_TIME_LIST"
            :key="item.id">
            <span>{{ item.title }}</span>
            <strong class="pl-subtit pt-2 justify-center">{{ item.count }}</strong>
          </div>
        </div>
      </div>
    </div>
    <!-- 나의 신청 현황 -->
    <div class="pl-rounded-box px-5 py-4 fill-height" style="width: 378px; flex: 0 0 378px;">
      <div class="d-flex align-center">
        <span class="pl-subtit">나의 신청 현황</span>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="mixin_reloadCuttStat('USER_APLY_PROC_STAT')"
        ></compo-tooltip-btn>
        <v-btn
          class="pl-btn is-esp is-sm ml-auto"
          @click="mixin_showDialog('Vacation')">
          휴가 신청
        </v-btn>
      </div>
      <div class="is-mt-m">
        <div class="d-flex flex-column " >
          <div
            :class="`d-flex py-3 hover-bold ${ index !== 0 && 'is-border-sub-top'}`"
            @click="item.slideNm ? showSlide(item.slideNm, 0) : ''"
            v-if="index<4"
            v-for="item,index in USER_APLY_PROC_STAT"
            :key="index">
            <span>{{ item.title }}</span>
            <strong class="ml-auto">
              <strong :class="item.count > 0 ? 'is-txt-red' : ''">{{ item.count }}</strong>
              <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                <strong>/</strong>
                <strong>{{ item.countBase }}</strong>
              </template>
            </strong>
          </div>
          <!-- <div :class="`d-flex py-3 hover-bold`" >
            <span>배려고객 신청 현황</span>
            <strong class="ml-auto">
              <strong>{{MY_REQUEST_INFO.REPORT_CMPL_CNT}}</strong><strong>/</strong><strong class="is-txt-org">{{ MY_REQUEST_INFO.REPORT_APLY_CNT }}</strong>
            </strong>
          </div>
          <div :class="`d-flex py-3 hover-bold is-border-sub-top`">
            <span>제보 요청 현황</span>
            <strong class="ml-auto">
              <strong>{{MY_REQUEST_INFO.B_CUSTOMER_CMPL_CNT}}</strong><strong>/</strong><strong class="is-txt-org">{{MY_REQUEST_INFO.B_CUSTOMER_APLY_CNT}}</strong>
            </strong>
          </div>
          <div @click="showSlide('sideVacation')" :class="`d-flex py-3 hover-bold is-border-sub-top`">
            <span>휴가 신청 현황</span>
            <strong class="ml-auto">
              <strong>{{MY_REQUEST_INFO.VOCATION_CMPL_CNT}}</strong><strong>/</strong><strong class="is-txt-org">{{MY_REQUEST_INFO.VOCATION_APLY_CNT}}</strong>
            </strong>
          </div> -->
        </div>
      </div>
    </div>
    <!-- dialog: 휴가 신청 -->
    <v-dialog
      persistent
      v-model="dialogVacation"
      width="480"
      content-class="pl-top-profile-dialog type-center dialog-draggable"
    >
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="휴가 신청"
        @hide="eventVacationDialog('close')"
      >
        <template slot="body">
          <HomeRegVacation ref="dialogVacationRef"  @Close="closeVacationModal"  />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="eventVacationDialog('close')">닫기</v-btn>
          <v-btn class="pl-btn" @click="eventVacationDialog('save')">신청하기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- slide: 휴가 신청 현황 -->
    <v-slide-x-reverse-transition>
      <div
          style="width: 550px;"
          class="pl-quick-layer "
          v-if=" sideVacation === true ">
        <div class="pl-quick-layer-header"><h1>휴가 신청 현황</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="sideVacation = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <HomeSideVacation />
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import HomeRegVacation from '@/views/page/Home/HomeRegVacation'
import HomeSideVacation from "@/views/page/Home/HomeSideVacation.vue";

export default {
  name: 'HomeManagerMy', //나의 오늘 상담, 신청 현황
  components: {
    HomeSideVacation,
    HomeRegVacation
  },
  data() {
    return {
      dialogVacation: false,
      sideVacation: false,

      // 나의 오늘 상담 현황
      CALL_CNT_LIST: [
        { title: '응대호', count: 62 },
        { title: '발신시도', count: 8 },
        { title: '발신성공', count: 0 },
        { title: '보류건', count: 8 },
        { title: '호전환', count: 8 },
      ],
      CALL_TIME_LIST: [
        { title: 'IB 통화 시간', count: '4:58:48' },
        { title: 'OB 통화 시간', count: '0:00:00' },
        { title: '총 통화 시간', count: '4:58:48' },
        { title: 'IB 후처리시간', count: '0:41:19' },
        { title: 'OB 후처리시간', count: '0:00:00' },
        { title: '총 후처리시간', count: '0:41:19' },

      ],
      //나의 신청 현황( 제보, 배려, 휴가.)
      MY_REQUEST_INFO: {},

      //전일 나의 상담
      PREV_CALL_DATA : {},
    }
  },
  methods: {
    eventVacationDialog(type) {
      if( type === 'save' ) {
        this.$refs.dialogVacationRef.eventSaveVacationInfo();
      }else if( type === 'close' ) {
        this.$refs.dialogVacationRef.eventCloseModal();
      }
    },
    closeVacationModal(){
      this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
      this.mixin_hideDialog('Vacation');
    },

    showSlide(slide, tabNum){
      this.$eventBus.$emit('showVSlideXreverse', {slide : slide, tabNum : tabNum})
    },

    // showSlide(slide, tabNum){
    //   this.removeSlide()
    //   this[`${slide}`] = true
    //   this.tabNum = tabNum
    //   console.log("🚀 ~ showSlide ~ tabNum:", tabNum)
    // },
    // removeSlide(){
    //   const slideList = [
    //     'sideVacation',
    //   ]
    //   for (let index = 0; index < slideList.length; index++) {
    //     let slide = slideList[index]
    //     this[`${slide}`] = false
    //   }
    // },

    async getRecentWeekCuttStatic(){
      let sURL = '/api/biz/common/select/ctiStaticChartData';
      let postParam = {USER_DTL_TYPE : this.computedUserDetailType};
      let headParam = {head:{ns:'lhcs.statistics.dao.xml.StaticticsUserMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.PREV_CALL_DATA = response.DATA[response.DATA.length-1];
        
        this.CALL_CNT_LIST[0].count = this.PREV_CALL_DATA.RSPD_CNT;
        this.CALL_CNT_LIST[1].count = this.PREV_CALL_DATA.DSPTCH_CTPV_CNT;
        this.CALL_CNT_LIST[2].count = this.PREV_CALL_DATA.DSPTCH_SCS_CNT;
        this.CALL_CNT_LIST[3].count = this.PREV_CALL_DATA.HOLD_CNT;
        this.CALL_CNT_LIST[4].count = this.PREV_CALL_DATA.TRANSPHN_CNT;
        
        this.CALL_TIME_LIST[0].count = this.mixin_seconds_toHHMMSS(this.PREV_CALL_DATA.IB_CALL_HR);
        this.CALL_TIME_LIST[1].count = this.mixin_seconds_toHHMMSS(this.PREV_CALL_DATA.OB_CALL_HR);
        this.CALL_TIME_LIST[2].count = this.mixin_seconds_toHHMMSS(this.PREV_CALL_DATA.WHOL_CALL_HR);
        this.CALL_TIME_LIST[3].count = this.mixin_seconds_toHHMMSS(this.PREV_CALL_DATA.IB_AFTPRCS_HR);
        this.CALL_TIME_LIST[4].count = this.mixin_seconds_toHHMMSS(this.PREV_CALL_DATA.OB_AFTPRCS_HR);
        this.CALL_TIME_LIST[5].count = this.mixin_seconds_toHHMMSS(this.PREV_CALL_DATA.WHOL_AFTPRCS_HR);
      }
    }
  },
  mounted() {
  },
  created() {

    // this.selectMyRequestList(); //나의선청현황

    //상담사 event
    // this.$eventBus.$on("eventRequestApplyList", (e) => {
    //   if (e !== undefined || !this.mixin_isEmpty(e)) {
    //     this.selectMyRequestList(); //신청현황 조회
    //   }
    // });
    this.getRecentWeekCuttStatic();
  },
  beforeDestroy(){
    // this.$eventBus.$off("eventRequestApplyList"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>