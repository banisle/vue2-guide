<template>
  <div
      class=" is-border-right pl-home-profile d-flex flex-column"
      :style="computedUserType === 'MANAGER' ? 'flex: 1 0 370px' : 'flex: 0 0 293px'">
    <!-- 프로필 -->
    <div class="px-8 pt-5">
      <div class="d-flex">
        <div style="flex: 0 0 60px">
          <img :src="USER_PROFILE.IMG" :alt="USER_PROFILE.USER_NM" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" style="width: 100%; max-height: 60px; border-radius: 50%;" />
        </div>
        <div class="ml-4">
          <div class="pl-home-profile--name">
            {{ USER_PROFILE.USER_NM }}
            <span class="pl-home-profile--grade">{{ (USER_PROFILE.JBPS_CD_NM!= '' && USER_PROFILE.JBPS_CD_NM!= '-')?USER_PROFILE.JBPS_CD_NM:USER_PROFILE.atrtGroupNm }}</span>
          </div>
          <div>{{ USER_PROFILE.DEPT_NM }}</div>
          <div>내선({{ USER_PROFILE.EXT_NO}})<span class="pl-unit">&bull;</span>IP {{ USER_PROFILE.CNTN_IP }}</div>
        </div>
      </div>
    </div>

    <!-- 신청 현황 -->
    <div :class="`is-mt-m ${computedUserType !== 'MANAGER' ? 'px-4' : 'px-8'}`" v-if="computedUserType === 'LEADER'">
      <div
          style="background: #FFF;"
          class=" pl-rounded-box px-4 py-3 pt-2">
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 stat-sign"></v-icon>
          <div class="pl-subtit ml-1">신청/접수 현황</div>
          <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              StyleProp="margin-right: -4px;"
              @btnClick="mixin_reloadCuttStat('USER_APLY_PROC_STAT')"
          ></compo-tooltip-btn>
        </div>
        <div class="is-border-top spacing-wrap sp-8 flex-column pt-3 is-mt-s">
          <div
            class="d-flex align-center mr-1 hover-bold"
            @click="item.MENU_PATH? setActiveTab({PATH_NM:'/'+item.MENU_PATH, NODE_TITLE:item.MENU_NM, AUTO_SRCH : true, item : item}) : item.slideNm ? showSlide(item.slideNm, 0, item) : (!mixin_isEmpty(item.homeTabNum)?activateTab(item):'')"
            v-for="item,index in USER_APLY_PROC_STAT"
            :key="index">
            <span class="">{{ item.title }}</span>
            <span class="ml-auto">
              <span :class="item.count > 0 ? 'is-txt-red' : ''">{{ item.count }}</span>
              <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                <strong>/</strong>
                <strong>{{ item.countBase }}</strong>
              </template>
            </span>
          </div>
          <!-- <div @click="showSlide('sideVacation')" class="d-flex align-center mr-1 hover-bold">
            <span class="">휴가 신청 현황</span>
            <span class="ml-auto">{{ LEADER_JOIN_STAT.VOCATION_CMPL_CNT }}<template v-if="LEADER_JOIN_STAT.VOCATION_APLY_CNT" >/<span :class="LEADER_JOIN_STAT.VOCATION_APLY_CNT > 0 ? 'is-txt-red' : ''">{{ LEADER_JOIN_STAT.VOCATION_APLY_CNT }}</span></template></span>
          </div>
          <div @click="showSlide('slideBlack')" class="d-flex align-center mr-1 hover-bold">
            <span class="">배려고객 신청 현황</span>
            <span class="ml-auto">{{ LEADER_JOIN_STAT.B_CUSTOMER_CMPL_CNT }}<template v-if="LEADER_JOIN_STAT.B_CUSTOMER_APLY_CNT" >/<span :class="LEADER_JOIN_STAT.B_CUSTOMER_APLY_CNT > 0 ? 'is-txt-red' : ''">{{ LEADER_JOIN_STAT.B_CUSTOMER_APLY_CNT }}</span></template></span>
          </div>
          <div @click="showSlide('slideRequest')" class="d-flex align-center mr-1 hover-bold">
            <span class="">제보 요청 현황</span>
            <span class="ml-auto">{{ LEADER_JOIN_STAT.REPORT_CMPL_CNT }}</span>
          </div>
          <div class="d-flex align-center mr-1 hover-bold">
            <span class="">대 내/외 민원 접수 현황</span>
            <span class="ml-auto">{{ LEADER_JOIN_STAT.ISUE_APLY_CNT }}</span>
          </div>
          <div @click="activateTab(7)" class="d-flex align-center mr-1 hover-bold">
            <span class="">코칭 현황</span>
            <span class="ml-auto">{{ LEADER_JOIN_STAT.COACHING_CNT }}</span>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 주간 근태 -->
    <div v-if="computedUserType === 'MANAGER'" :class="`is-mt-m mx-8 pl-home-profile--workBoard ${WORK_STAT.toggle}`">
      <div class="pl-home-profile--workBoard-summary">
        <div class="d-flex">
          <span class="pl-home-profile--workBoard-summary--title">Today</span>
          <strong>{{ WORK_STAT.today }}</strong>
          <span class="pl-home-profile--workBoard-badge">{{ WORK_STAT.today_stat }}</span>
        </div>
        <div class="pl-home-profile--workBoard-summary--sub">
          <span class="pl-home-profile--workBoard-summary--title">주간 근태</span>
          <div class="pl-home-profile--workBoard-summary--day">
            <div :class="(item.TODAY === 'Y')?'select':'false'" v-for="item in WORK_STAT.weekList">
              {{ item.DAYDAY }}
            </div>
          </div>
        </div>
      </div>
      <div class="pl-home-profile--workBoard-detailWrap">
        <div
            v-if="WORK_STAT.toggle"
            class="pl-home-profile--workBoard-detail">
          <div class="pl-home-profile--workBoard-detail-content">
            <div
                :class="`pl-home-profile--workBoard-detail-card active-${ (item.TODAY === 'Y')?true:false }`"
                v-for="item in WORK_STAT.togleData">
              <div>
                {{ item.WEEKLY_DT_FMT }}
                <div class="mt-1">
                  {{ item.LGN_TIME_HH24MISS }}
                </div>
              </div>
              <strong :class="`ml-auto ${item.class}`">
                {{ item.WKATTD_ARTCL_CLSF_CD_NM }}
              </strong>
            </div>
          </div>
        </div>
        <div
            @click="WORK_STAT.toggle = !WORK_STAT.toggle"
            :class="`pl-home-profile--workBoard-toggle ${WORK_STAT.toggle}`"></div>
      </div>
    </div>

    <!-- 캘린더 -->
    <template v-if="computedUserType === 'MANAGER'">
      <div class="mt-8 px-8">
        <div class="pl-calendar-mini is-bg-transparent">
          <v-date-picker
              v-model="picker"
              full-width
              no-title
              color="#1E6FDA"
              locale="ko-KR"
              :first-day-of-week="0"
              scrollable
              :day-format="mixin_getDate"
              @click:event="navCalendar"
              :events="arrayEventsCalendar"
          ></v-date-picker>
        </div>
        <div class="is-border-top pl-simple-count-list">
          <div
              class="pl-simple-count-list--unit"
              style="cursor:pointer;"
              v-for="item in DATE_STAT"
              :key="item.cd"
              @click="navCalendar(item.se)"
          >
            <strong class="pl-simple-count-list--unit-count">{{ item.count }}</strong>
            <div class="mt-1">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 팀장: 상담 모니터링 -->
    <template v-if="computedUserType === 'LEADER'">
      <template v-if="computedUserCenter === '4'">
        <!-- 바로처리 스케줄러 이관 버튼 -->
        <div class="is-mt-m px-4">
          <div class="px-4">
            <div class="d-flex align-center">
              <v-icon class="pl-icon20 statusboard-schedule"></v-icon>
              <div class="pl-subtit ml-1">스케줄러이관 <!--<span class="is-txt-red ml-1">(55)</span>--></div>
              <compo-tooltip-btn
                TitleProp="스케줄러이관 윈도우 팝업 열기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 openPop"
                TooltipPositionProp="bottom"
                @btnClick="mixin_openWindow('LayoutPopup', '1750', '820', {title: '스케줄러이관 목록', compo_name: 'CompoAsTransSchedulerManager'})"
              ></compo-tooltip-btn>
            </div>
          </div>
        </div>
      </template>
      <div class="is-mt-l px-4">
        <div class="px-4">
          <div class="d-flex align-center">
            <v-icon class="pl-icon20 statusboard-monitor"></v-icon>
            <div class="pl-subtit ml-1">상담 모니터링</div>
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-auto "
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              StyleProp="margin-right: 0px"
              @btnClick="mixin_reloadCuttStat('CUTT_MONITOR_STAT')"
            ></compo-tooltip-btn>
          </div>
          <div class="pt-2 is-mt-s is-border-top">
            <ul class="pl-link-list type-home">
              <li
                @click="item.slideNm ? showSlide(item.slideNm, item.tabIndex, item) : item.dialogNm ? showDialog(item.dialogNm) : index === 0 ? [mixin_set_active_tab({PATH_NM:'/CSL_M0501', NODE_TITLE:'상담이력 조회', AUTO_SRCH : true}), $eventBus.$emit('autoHistCuttSrch')]: (computedUserCenter === '4' && (computedUserDefaultCuttTask === 'SHDL' || computedUserDefaultCuttTask === 'M_SHDL') && (index < 5 || index > 6) ) ? asMoveSearchOther(index) : ''"
                :class="`${ item.title === '미처리' ? 'is-border-top pt-2' : '' }`"
                v-for="item, index in CUTT_MONITOR_STAT"
                :key="item.id">
                <span class="pl-link-list-title">
                  <span class="">{{ item.title }}</span>
                </span>
                <span class="ml-auto">
                  <strong :class="`mr-3 ${ item.count > 0 ? 'is-txt-org' : ''}`">{{ item.count }}</strong>
                </span>
              </li>
              <!-- 바로처리센터: 사후처리 -->
              <template v-if="computedUserCenter === '4' && computedUserDefaultCuttTask === 'IBND'">
                <li
                  @click="item.title === '미대상' ? mixin_showDialog(item.dialog) : showSlide(item.slideNm, item.index, item)"
                  :class="item.class"
                  v-for="item, index in CUTT_MONITOR_INBD_AFTER_PROC_STAT"
                  :key="item.id"
                >
                  <span class="pl-link-list-title">
                    <span class="">{{ item.title }}</span>
                  </span>
                  <span class="ml-auto">
                    <strong :class="`${item.TOT_CNT_USE_YN === 'Y' ? '' : 'mr-3'} ${item.count > 0 ? 'is-txt-org' : ''}`">{{ item.count }}</strong>
                    <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                      <strong>/</strong>
                      <strong :class="`mr-3 ${item.countBase > 0 ? 'is-txt-org' : ''}`">{{ item.countBase }}</strong>
                    </template>
                  </span>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <!-- 매니저: 코칭 및 업무 평가  -->
    <template v-if="computedUserType === 'MANAGER'">
      <div class="is-mt-l px-8">
        <div class="d-flex align-center">
          <div class="pl-subtit">코칭 및 업무 평가 </div>
          <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="mixin_reloadCuttStat('COACHING_AND_EVAL_STAT')"
          ></compo-tooltip-btn>
        </div>
        <div class="is-mt-s pt-1 is-border-top">
          <ul class="pl-link-list type-home">
            <li v-for="item,index in COACHING_AND_EVAL_STAT" :key="index"
                @click="item.slideNm ? showSlide(item.slideNm, item.tabIndex, item) :
                (!mixin_isEmpty(item.homeTabNum)?activateTab(item):'')"
            >
              <span class="pl-link-list-title">
                <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                <span class="ml-2">{{ item.title }}</span>
              </span>
              <strong class="ml-auto mr-2 pl-badge is-bg-main">{{ item.count }}</strong>
            </li>

          </ul>
        </div>
      </div>
    </template>

    <!-- 팀장: 공지사항 관리 -->
    <!-- <template v-if="computedUserType === 'LEADER'">
      <div class="is-mt-l px-4">
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 statusboard-my"></v-icon>
          <div class="pl-subtit ml-1">Today</div>
          <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
        </div>
        <div class="pt-2 is-mt-s is-border-top">
          <ul class="pl-link-list type-home">
            <li

                @click="index === 0 ? mixin_showDialog('TodaySchedule' ): index === 1 ? showSlide('slideDaily') : index === 2 ? showSlide('slideNotice') : ''"
                v-for="item, index in SIGN_STAT"
                :key="item.id">
              <span class="pl-link-list-title">
                <span class="ml-2">{{ item.title }}</span>
              </span>
              <strong class="ml-auto mr-3">{{ item.count }}</strong>
            </li>
          </ul>
        </div>
      </div>
    </template> -->
    <!-- 대기,응대,포기 호 -->
    <template v-if="computedUserType === 'LEADER'">
      <div class="is-border-top spacing-wrap sp-4 py-3 px-4 justify-space-between mt-auto">
        <div class="d-flex align-center">
          <span class="pl-label" style="font-size: 14px;">대기</span> <strong style="min-width: 40px" class="ml-2 pl-badge is-lg is-bg-cyan">{{ wait_call }}</strong>
        </div>
        <div class="d-flex align-center">
          <span class="pl-label" style="font-size: 14px;">응대</span> <strong style="min-width: 40px" class="ml-2 pl-badge is-lg is-bg-cyan">{{ response_call }}</strong>
        </div>
        <div class="d-flex align-center">
          <span class="pl-label" style="font-size: 14px;">포기</span> <strong style="min-width: 40px" class="ml-2 pl-badge is-lg is-bg-cyan">{{ cancel_call }}</strong>
        </div>
      </div>
    </template>

    <!-- dialog: 오늘의 일정 -->
    <v-dialog
        v-model="dialogTodaySchedule"
        content-class="dialog-draggable is-maxHeight"
        width="1750"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="오늘의 일정"
          @hide="mixin_hideDialog('TodaySchedule')"
          @submit="submitDialog('TodaySchedule')"
          :FooterProp="false"
          :OpenPopProp="true"
      >
        <template slot="body">
          <HomeTodaySchedule />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import HomeTodaySchedule from '@/views/page/Home/HomeTodaySchedule'


export default {
  name: "HomeProfile", //name은 'MENU_' + 파일명 조합
  props: {},
  components: {
    HomeTodaySchedule
  },
  data() {
    return {
      USER_PROFILE:this.$store.getters["userStore/GE_USER_ROLE"],
      isAdmin3: false,  //관리자 = 콜센터매니저
      isCnsltStaff: false,  //바로처리팀장 = 팀장(부팀장)
      SRCH_DEPT_ID: '',
      DEPT_LIST: [],
      SRCH_USER_ID: '',
      USER_LIST: [],

      tabNum: null,

      // 대기호, 응대호, 포기호
      cancel_call: 0,
      response_call: 0,
      wait_call: 0,

      // dialog 오늘의 일정
      dialogTodaySchedule: false,

      // 근태
      WORK_STAT: {
        weekList: [],
        today: '',
        today_stat: '',
        togleData: [],
        toggle: false,
      },

      // 캘린더
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      arrayEvents: [
        {
          "id": 0,
          "day": "2024-07-01",
          "titleLS": "기념일1",
          "desc": "기념일 세부내용",
          "type": "evt",
          "title": "기념일",
          "icon": "svg-dot-evt"
        },
        {
          "id": 1,
          "day": "2024-07-03",
          "titleLS": "기념일222",
          "desc": "기념일 세부내용222",
          "type": "evt",
          "title": "기념일",
          "icon": "svg-dot-evt"
        },
        {
          "id": 2,
          "day": "2024-07-04",
          "titleLS": "스케쥴임",
          "desc": "스케쥴 세뷰내용",
          "type": "schedule",
          "title": "스케쥴",
          "icon": "svg-dot-sch"
        },
        {
          "id": 3,
          "day": "2024-07-25",
          "titleLS": "크리스마스",
          "desc": "스케쥴 세뷰내용",
          "type": "schedule",
          "title": "스케쥴",
          "icon": "svg-dot-sch"
        }
      ],
      DATE_STAT: [
        { title: '나의 일정', se : 'PSSD', cd : 'MY_CAL_CNT', count: 0 },
        { title: '센터 일정', se : 'CTSD', cd : 'CENTER_CAL_CNT', count: 0 },
        { title: '팀 일정', se : 'TMSD', cd : 'TEAM_CAL_CNT', count: 0 },
        { title: '중요 일정', se : 'ESNTL', cd : 'ESNTL_CNT', count: 0 },
      ],
      // DATE_STAT2: [
      //   { title: '이첩 요청', count: 3, evt: '',},
      //   { title: '이첩 접수', count: 0, evt: ''},
      //   { title: '이첩 반려', count: 0, evt: ''},
      //   { title: '이첩 회수', count: 0, evt: ''},
      // ],

      // 매니저: 평가 및 교육이수
      // EDU_EXAM: [
      //   { title: '상담 코칭', count: 2, icon: 'coaching'},
      //   { title: '업무 평가', count: 1, icon: 'manager_test', slide: 'slideTestExam'},
      //   { title: '상담품질', count: 1, icon: 'edu_license'},
      // ],

      // 팀장: 신청 현황
      SIGN_STAT: [
        { title: '오늘의 일정', count: 9, icon: '', evt: 'TodaySchedule'},
        { title: '데일리', count: 5, icon: '', evt: 'slideDaily'},
        { title: '임대주택 관리 현황', count: 2, icon: '', evt: ''},
      ],

      DATE_STAT3: [
        { title: '자체 사후처리', count: 3, evt: '', index: 0 },
        { title: '협업 사후처리', count: 5, countBase: 2, evt: '', index: 1 },
        { title: '미대상', count: 0, evt: '', dialog: 'Notarget'},
      ],

      schdlData : [],
    }
  },
  computed: {
  },
  watch: {
    picker(){
      for(const item of this.arrayEvents) {
        if (item.day === this.picker && item.type === 'calendar') {
          this.navCalendar();
          break;
        }
      }
    },
    arrayEvents(){
      for(let index = 0; index < this.arrayEvents.length; index++){
        this.arrayEventsCalendar(this.arrayEvents[index].day);
      }
    }
  },
  mounted() {
    //달력 이벤트 초기값
    for(let index = 0; index < this.arrayEvents.length; index++){
      this.arrayEventsCalendar(this.arrayEvents[index].day);
    }
  },
  beforeDestroy(){
    this.$eventBus.$off("EMIT_ICCTIQ_DEPT"); //eventBus 중복방지를 위해 off

  },
  created() {
    if (this.computedUserType !== 'ETC_ADMIN') {
      this.mixin_reloadCuttStat('USER_APLY_PROC_STAT'); //나의 신청/접수 현황
      this.$eventBus.$on("eventRequestApplyList", (e) => {
        this.mixin_reloadCuttStat('USER_APLY_PROC_STAT'); //나의 신청/접수 현황
      });

      if (this.computedUserType === 'LEADER') {//센터장, 팀장(부팀장)
        // 대시보드 > 오늘의근태
        this.mixin_reloadCuttStat('TODAY_USER_WKATTD_STAT');

      }else if (this.computedUserType === 'MANAGER') {//상담사
        this.selectManagerMyTodayWkattdInfo(); //메인 left 상담사 근태 현황

        this.mixin_reloadCuttStat('COACHING_AND_EVAL_STAT'); //코칭 및 업무 평가

        this.getSchdlCnt();
        this.getAllSchdl();
      }

      //IC_CTIQ 대기, 응대, 포기 호 레디스 조회.
      this.$eventBus.$on('EMIT_ICCTIQ_DEPT' , (item) => {
        // this.wait_call = item.SUM_CONN_CNT;
        this.wait_call = item.RTS_WAIT_CNT;
        this.response_call = item.SUM_ANSWER_CNT;
        this.cancel_call = item.SUM_ABDN_CNT;
      });

    }
  },
  methods: {
    activateTab(data) {

      console.log("activateTab : {} " , data );
      if(this.computedUserType === 'MANAGER'){
        this.$store.dispatch('commonStore/AC_COMMON_MANAGER_HOME_TAB', parseInt(data.homeTabNum));
      }else{
        this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', parseInt(data.homeTabNum));

        //LEADER 홈 > 코칭탭 내/외부구분검색을 위한 임시.
        setTimeout(() => {
          if (data.GROUP_ID === 'USER_APLY_PROC_STAT') {
            if (data.title === '코칭 현황(외부)'){
              setTimeout(() => {
                this.$eventBus.$emit('initOutSideYn', {OUTSIDE_YN : 'E', SCH_ST_DT : data.SCH_ST_DT, SCH_END_DT : data.SCH_END_DT});
              }, 500);
            }

            if (data.title === '코칭 현황(내부)'){
              setTimeout(() => {
                this.$eventBus.$emit('initOutSideYn', {OUTSIDE_YN : 'I', SCH_ST_DT : data.SCH_ST_DT, SCH_END_DT : data.SCH_END_DT});
              }, 500);
            }
          }
        }, 500);
      }
    },
    //캘린더에 포인트 찍기
    arrayEventsCalendar(date) {
      let colorArray = [];

      for (let i = 0; i < this.arrayEvents.length; i++) {
        if (this.arrayEvents[i].day === date) {
          if (this.arrayEvents[i].type === "schedule") {
            colorArray.push("#1e6fda");
          } else if (this.arrayEvents[i].type === "evt") {
            colorArray.push("#98C1FF");
          }else if (this.arrayEvents[i].type === "calendar") {
            colorArray.push("#9CB190");
          }
        }
      }
      return colorArray;
    },

    // 팀장 매니저 스왑
    toggleSwap(val){
      this.$emit('Swap', val)
    },

    showSlide(slide, tabNum, item){
      this.$eventBus.$emit('showVSlideXreverse', {slide : slide, tabNum : Number(tabNum), item : item})
    },
    showDialog(dialogNm){
      this.$eventBus.$emit('showRightDialog', {dialogNm : dialogNm});
    },
    //바로처리 검색 결과 출력.
    asMoveSearchOther(index) {
      const srchUserId = this.SRCH_USER_ID != '' ? this.SRCH_USER_ID : this.user_id;
      this.mixinAsMoveSearchOther(index, srchUserId)
    },

    //상담사 > 홈 > left 나의 근태정보
    async selectManagerMyTodayWkattdInfo() {
      let sURL = '/api/biz/common/select/selectManagerMyTodayWkattdInfo';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      let headParam = {head: {"ns": 'lhcs.system.user.dao.AtndnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        let i = 0;
        let responseData = [];
        response.DATA.map(item => {
          if( item.TODAY === 'Y' ) {
            if( !this.mixin_isEmpty(item.WKATTD_ARTCL_CD) ) {
              //금일 근태정보가 있는경우.
              this.WORK_STAT.today = item.WEEKLY_DT_FMT + " " + item.LGN_TIME_HH24MI;
              this.WORK_STAT.today_stat = item.WKATTD_ARTCL_CLSF_CD_NM;
            }else {
              //금일 근태정보가 없는경우.
              this.WORK_STAT.today = item.WEEKLY_DT_FMT;
            }
          }
          if( !this.mixin_isEmpty(item.WKATTD_ARTCL_CD) ) {
            responseData.push(item);  //근태정보있는경우만 토글데이터에
          }
          return i++;
        });
        this.WORK_STAT.weekList = response.DATA;
        this.WORK_STAT.togleData = responseData;
      }
    },
    async getAllSchdl() {
      this.SchdlData=[];
      let sUrl = "/api/biz/common/select/selectScheduleList";
      let postParam = {
        SRCH_USER_YN : 'Y',
        SRCH_YM : this.picker.substring(0,7).replaceAll('-',''),
      };
      let headParam ={
        head:{
          ns : 'palette3.schedule.dao.ScheduleMapper'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG){
        response.DATA.map(item=>{
          item.type = 'calendar'
          item.day = this.mixin_convertDate(item.BGNG_YMD, 'yyyy-MM-dd')
          item.icon = "svg-dot-sch"
          this.arrayEvents.push(item)
        })

      }
    },
    async getSchdlCnt() {
      this.SchdlData=[];
      let sUrl = "/api/biz/common/select/selectMySchdlStat";
      let postParam = {
        SRCH_YM : this.picker.substring(0,7).replaceAll('-',''),
      };
      let headParam ={
        head:{
          ns : 'palette3.schedule.dao.ScheduleMapper'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG){
        let resultObj = response.DATA[0]
        Object.keys(resultObj).some((key) => {
          this.DATE_STAT.map(obj => {
            if (obj.cd === key) {
              obj.count = resultObj[key]
            }
          })
        })
      }
    },
    async navCalendar(data){
      await this.mixin_set_active_tab({ PATH_NM : "/CLD_M0000", FULL_PATH : "캘린더", NODE_TITLE :"캘린더", MENU_EXPLN : "캘린더"})
      if(!this.mixin_isEmpty(data)) {
        setTimeout(() => {
          this.$eventBus.$emit('calType', data);
        }, 300);
      }
    },

    async setActiveTab(item){
      await this.mixin_set_active_tab(item)
      if(!this.mixin_isEmpty(item.item)) {
        setTimeout(() => {
          this.$eventBus.$emit('schDtCvlcptList', {SCH_ST_DT : item.item.SCH_ST_DT, SCH_END_DT : item.item.SCH_END_DT});
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>