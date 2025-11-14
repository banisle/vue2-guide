<template>
  <div
    v-if="isStatusBoard !== 'none' && this.$route.path !== '/home'"
    :class="`pl-layout-statusboard pos-${isStatusBoard}`">
    <div
      class="pt-6 pl-scroll-body"
      style="height: calc(100vh - 126px); ">
      <div class="d-flex justify-space-between px-4">
        <div
          class="pl-layout-statusboard--topstat"
          v-for="item,index in BOARD_STAT"
          :key="index">
          <strong>{{ item.title }}</strong>
          <strong
            @click="index !== 3 ? showSlide('slideNotice', item.tabIndex-1) : switchCoaching()"
            :class="`font-decimal has-hover type-bg-clr counter mt-1`">{{ item.count }}</strong>
        </div>
      </div>

      <!-- 공지 Rolling -->
      <!-- <div :class="`pl-rolling-wrap is-border-top is-mt-s ${ staticRollList ? 'type-static pt-2' : ''}`">
        <v-icon
          style="margin-top: 1px;"
          class="pl-icon20 notice-alert"></v-icon>
        <template v-if="staticRollList">
          <div
            @click="shrinkRollingList"
            style="width: 180px"
            class="spacing-wrap sp-8 flex-column">
            <div
              class="is-ellips hover-line"
              v-for="item in ROLL_LIST"
              :key="item.id">
              <span class="ml-2">{{ item.subject }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            class="pl-rolling-wrap--unit"
            :class="{ active: index === ROLL_LIST_CURRENT_INDEX, hidden: index !== ROLL_LIST_CURRENT_INDEX }"
            :style="getTopStyle(index)"
            v-for="item, index in ROLL_LIST"
            :key="item.id">
            <span class="ml-1">{{ item.subject }}</span>
          </div>
        </template>
      </div> -->

      <div class="d-flex flex-column is-mt-s" style="gap: 16px;">
        <!-- 개인 전광판 -->
        <div class="pl-layout-statusboard--unit ml-4 mr-3 order-0" >
          <div
            @click="isStatusMyBoard = !isStatusMyBoard"
            :class="`pl-layout-statusboard--unit-title is-toggle active-${isStatusMyBoard}`">
            <v-icon class="pl-icon20 statusboard-my"></v-icon>
            <span class="ml-1">개인 전광판</span>
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn ml-auto "
              IconProp="pl-icon20 refresh is-sm"
              :MinWidthProp=22
              :HeightProp=22
              TooltipPositionProp="bottom"
              StyleProp="margin-right: 20px"
              @btnClick.stop="getAgentState"
            ></compo-tooltip-btn>
          </div>
          <div
            v-if="isStatusMyBoard"
            class="pl-layout-statusboard--unit-content pb-2" >
            <div class="pl-layout-statusboard--myboard">
              <div
                :class="`d-flex ${ item.class }`"
                v-for="item,index in PERSONAL_STAT"
                :key="index">
                <span class="myboard-title">{{ item.title }}</span>
                <span :class="`ml-auto count ${ (index === 0 || index === 1) && 'text-right pr-2' }`">{{ item.count + (item.title === 'IN' || item.title === 'OUT' ? '콜' : '') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 상담 모니터링 -->
        <div class="pl-layout-statusboard--unit type-nobg order-1" >
          <div>
            <div class="pl-layout-statusboard--unit-title" style="margin-right: -6px;">
              <v-icon class="pl-icon20 statusboard-monitor"></v-icon>
              <span class="ml-1">상담 모니터링</span>
              <compo-tooltip-btn
                TitleProp="새로고침"
                ClassProp="pl-tooltip-btn ml-auto "
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                StyleProp="margin-right: 0px"
                @btnClick="reloadCuttStat()"
              ></compo-tooltip-btn>
            </div>
            <!-- 바로처리 스케줄러 - 관리자, 팀장은 팀, 상담사 선택하여 해당 상담사의 모니터링 현황 조회 가능 -->
            <div
              v-if="(computedUserDefaultCuttTask === 'SHDL' || computedUserDefaultCuttTask === 'M_SHDL') && (isAdmin3 || isCnsltStaff)"
              >
              <div class="mb-1 ">
                <v-select
                  v-model="SRCH_DEPT_ID"
                  :items="DEPT_LIST"
                  class="pl-form is-auto type-middle is-bg-white"
                  placeholder="팀 선택"
                  @change="getUserList()"
                ></v-select>
              </div>
              <div class="mb-1 ">
                <v-select
                  v-model="SRCH_USER_ID"
                  :items="USER_LIST"
                  class="pl-form is-auto type-middle is-bg-white"
                  placeholder="상담사 선택"
                  @change="reloadCuttMonitorStatSrchUser()"
                ></v-select>
              </div>
            </div>
            <div class="pl-layout-statusboard--unit-content ">
              <template v-if="CUTT_MONITOR_STAT.length === 0">
                <div style="height: 192px" class="d-flex align-center justify-center">
                  <div class="loading loading03">
                    <span>조</span>
                    <span>회</span>
                    <span>중</span>
                    <span>입</span>
                    <span>니</span>
                    <span>다</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="d-flex flex-column" >
                  <div
                    :class="`d-flex py-1 has-hover type-bg ${ item.title === '미처리' ? 'is-border-top pt-2' : '' }`"
                    @click="item.slideNm ? showSlide(item.slideNm, item.tabIndex) : item.dialogNm ? showDialog(item.dialogNm) : index === 0 ? [mixin_set_active_tab({PATH_NM:'/CSL_M0501', NODE_TITLE:'상담이력 조회', AUTO_SRCH : true}), $eventBus.$emit('autoHistCuttSrch')] : (computedUserCenter === '4' && (computedUserDefaultCuttTask === 'SHDL' || computedUserDefaultCuttTask === 'M_SHDL') && (index < 5 || index > 6) ) ? asMoveSearchOther(index) : ''"
                    v-for="item,index in CUTT_MONITOR_STAT"
                    :key="index">
                    <span>{{ item.title }}</span>
                    <strong
                      :class="`ml-auto text-center rounded-xl ${ item.class } ${item.count > 0 ? 'is-txt-org' : ''}`"
                      >{{ item.count }}</strong>
                    <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                      <strong>/</strong>
                      <strong>{{ item.countBase }}</strong>
                    </template>
                  </div>
                </div>

              </template>
            </div>
          </div>
        </div>

        <!-- 사후처리 : 바로처리센터(인바운드) -->
        <template v-if="computedUserCenter === '4' && computedUserDefaultCuttTask === 'IBND'">
          <div class="pl-layout-statusboard--unit type-nobg order-2" >
            <div>
              <div class="pl-layout-statusboard--unit-title">
                <v-icon class="pl-icon20 statusboard-after"></v-icon>
                <span class="ml-1">사후 처리</span>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn ml-auto "
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  StyleProp="margin-right: 0px"
                  @btnClick="mixin_reloadCuttStat('CUTT_MONITOR_INBD_AFTER_PROC_STAT')"
                ></compo-tooltip-btn>
              </div>
              <div class="pl-layout-statusboard--unit-content ">
                <div class="d-flex flex-column " >
                  <div
                    @click="showSlide(item.slideNm, item.tabIndex)"
                    :class="`d-flex py-1 has-hover type-bg ${ item.class }`"
                    v-for="item,index in CUTT_MONITOR_INBD_AFTER_PROC_STAT"
                    :key="index">
                    <span>{{ item.title }}</span>
                    <strong :class="`ml-auto ${item.count > 0 ? 'is-txt-org' : ''}`">{{ item.count }}</strong>
                    <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                      <strong>/</strong>
                      <strong :class="`${item.countBase > 0 ? 'is-txt-org' : ''}`">{{ item.countBase }}</strong>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 배려고객(상담사가 아닌 경우) -->
        <template v-if="computedUserDetailType !== 'MANAGER'">
          <div class="pl-layout-statusboard--unit type-nobg px-0 order-3" >
            <div class=" ">
              <div class="pl-layout-statusboard--unit-title">
                <v-icon class="pl-icon20 statusboard-black"></v-icon>
                <span class="ml-1">배려고객 요청</span>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn ml-auto "
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  StyleProp="margin-right: 0px"
                  @btnClick="mixin_reloadCuttStat('BLACK_CUST_STAT')"
                ></compo-tooltip-btn>
              </div>
              <div class="pl-layout-statusboard--unit-content pr-0">
                <div class="">
                  <div
                  style="grid-template-columns: repeat(3, 1fr); background-color: #FFF;"
                  class="pl-monitor-list has-hover">
                  <div
                      class="pl-monitor-list--unit"
                      v-for="item,index in BLACK_CUST_STAT"
                      @click="showSlide(item.slideNm, item.tabIndex, BLACK_CUST_STAT[0])"
                      :key="index">
                      <span>{{ item.title }}</span>
                      <strong class="pl-subtit pt-1 font-decimal">{{ item.count }}</strong>
                      <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                        <strong>/</strong>
                        <strong>{{ item.countBase }}</strong>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 제보요청(상담사가 아닌 경우) -->
        <template v-if="computedUserDetailType !== 'MANAGER'">
          <div class="pl-layout-statusboard--unit type-nobg order-4" >
            <div>
              <div class="pl-layout-statusboard--unit-title">
                <v-icon class="pl-icon20 statusboard-request"></v-icon>
                <span class="ml-1">제보 요청</span>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn ml-auto "
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  StyleProp="margin-right: 0px"
                  @btnClick="mixin_reloadCuttStat('GVIFMT_STAT')"
                ></compo-tooltip-btn>
              </div>
              <div class="pl-layout-statusboard--unit-content ">
                <div class="d-flex flex-column " >
                  <div
                    :class="`d-flex py-1 ${ item.class } has-hover type-bg`"
                    @click="showSlide(item.slideNm, item.tabIndex, item)"
                    v-for="item,index in GVIFMT_STAT"
                    :key="index">
                    <span>{{ item.title }}</span>
                    <strong
                    :class="`ml-auto text-center rounded-xl ${ item.class } ${item.count > 0 ? 'is-txt-org' : ''}`"
                    >{{ item.count }}</strong>
                    <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                      <strong>/</strong>
                      <strong>{{ item.countBase }}</strong>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 이첩 현황(공가해소, 전세임대인 경우) -->
        <template v-if="computedUserCenter == '2' || computedUserCenter == '3'">
          <div class="pl-layout-statusboard--unit type-nobg order-5" >
            <div>
              <div class="pl-layout-statusboard--unit-title">
                <v-icon class="pl-icon20 statusboard-leave"></v-icon>
                <span class="ml-1">이첩 현황</span>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn ml-auto "
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  StyleProp="margin-right: 0px"
                  @btnClick="mixin_reloadCuttStat('TRANSF_STAT')"
                ></compo-tooltip-btn>
              </div>
              <div class="pl-layout-statusboard--unit-content ">
                <div class="d-flex flex-column " >
                  <div
                    @click="showSlide(item.slideNm, item.tabIndex)"
                    :class="`d-flex py-1 has-hover type-bg ${ item.class }`"
                    v-for="item,index in TRANSF_STAT"
                    :key="index">
                    <span>{{ item.title }}</span>
                    <strong :class="`ml-auto ${item.count > 0 ? 'is-txt-org' : ''}`">{{ item.count }}</strong>
                    <template v-if="item.TOT_CNT_USE_YN === 'Y'">
                      <strong>/</strong>
                      <strong>{{ item.countBase }}</strong>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>


      <!-- 하단 바 -->
      <div class="pl-layout-statusboard--footer justify-space-around">
        <div>
          <strong class="pl-1">대기호</strong>
          <span class="counter is-bg-cyan is-txt-white">{{ wait_call }}</span>
        </div>
        <div class="">
          <strong>포기호</strong>
          <span class="counter is-bg-cyan is-txt-white">{{ cancel_call }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ipronCallUtil } from "@/store/ipronCallUtil.js";

  export default {
    components: {
    },
    data(){
      return {
        isAdmin3: false,  //관리자 = 콜센터매니저
        isCnsltStaff: false,  //바로처리팀장 = 팀장(부팀장)
        SRCH_DEPT_ID: '',
        DEPT_LIST: [],
        SRCH_USER_ID: '',
        USER_LIST: [],

        // 개인전광판
        // myBoardToggle: false,
        myBoardStat: [
          { title: 'IN', count: '68콜'},
          { title: 'OUT', count: '15콜'},
          { title: '통화', count: '00:00'},
          { title: '후처리', count: '00:00'},
          { title: '휴식', count: '00:00'},
          { title: '식사', count: '00:00'},
          { title: '기타', count: '00:00'},
          { title: '그외', count: '00:00'},
        ],
        // data
        topStat: [
          { title: '긴급', count: 0, class: 'is-txt-blue'},
          { title: '공지', count: 37},
          { title: '팀공지', count: 16},
          { title: '코칭', count: 2}
        ],
        tabNum: null,
        myBoard: {},
        csMonitor: {
          today: { title: '금일상담 현황', count: 0,
            data: { "PRGRM_PARAM": "",
            "NODE_ETC": "0|0",
            "ACT_NM": "",
            "LAYOUT_ID": "",
            "P_NODE_NO": "",
            "USE_YN": "Y",
            "NODE_URL": "",
            "MENU_EXPLN_EN": "Search and view the history of phone consultations and listen to the details and recordings.",
            "BTN_AUTH": "",
            "PATH_NM": "/CSL_M0301",
            "C_NODE_NO": "CSL_M0301",
            "NODE_TITLE": "상담이력",
            "NODE_LVL": "1",
            "SORT_ORD": "5",
            "NODE_TYPE": "F",
            "NODE_URL_MENUID": "",
            "NODE_KEY": "77",
            "FULL_PATH_EN": "Telephone Consultation History",
            "VIEW_TRGT": "LEFT",
            "MENU_EXPLN": "전화상담 이력을 검색하고 조회할 수 있으며 상담상세 내용과 녹취 파일을 청취할 수 있습니다.",
            "FULL_PATH": "상담이력",
            "NODE_TITLE_EN": "Telephone Consultation History",
            "NODE_ID": "77",
            "ICON_CLASS_NM": "log" }
          },
          teamNoToday: { title: '팀 미처리(금일)', count: 32},
          teamNoYesterday: { title: '팀 미처리(전일)', count: 0},
        },
        csMonitor_scheduler: {
          today: { title: '금일상담 현황', count: 0,
            data: { "PRGRM_PARAM": "",
              "NODE_ETC": "0|0",
              "ACT_NM": "",
              "LAYOUT_ID": "",
              "P_NODE_NO": "",
              "USE_YN": "Y",
              "NODE_URL": "",
              "MENU_EXPLN_EN": "Search and view the history of phone consultations and listen to the details and recordings.",
              "BTN_AUTH": "",
              "PATH_NM": "/CSL_M0301",
              "C_NODE_NO": "CSL_M0301",
              "NODE_TITLE": "상담이력",
              "NODE_LVL": "1",
              "SORT_ORD": "5",
              "NODE_TYPE": "F",
              "NODE_URL_MENUID": "",
              "NODE_KEY": "77",
              "FULL_PATH_EN": "Telephone Consultation History",
              "VIEW_TRGT": "LEFT",
              "MENU_EXPLN": "전화상담 이력을 검색하고 조회할 수 있으며 상담상세 내용과 녹취 파일을 청취할 수 있습니다.",
              "FULL_PATH": "상담이력",
              "NODE_TITLE_EN": "Telephone Consultation History",
              "NODE_ID": "77",
              "ICON_CLASS_NM": "log" }
          },
          assignDiv: { title: '배분', count: 0},
          reserveVisit: { title: '방문예정', count: 37},
          reserveCall: { title: '통화예약', count: 0},
          done: { title: '완료', count: 0},
          getTrans: { title: '이관접수', count: 0, tabIndex: 0 },
          requestReject: { title: '반려요청', count: 0, tabIndex: 1 },
        },
        blackUser: {
          undone: { title: '미처리', count: 7},
          yesterday: { title: '전일', count: 1},
          today: { title: '금일', count: 2},
        },
        request: {
          kindness: { title: '친절 콜', count: '23',countBase: '15'},
          promotion: { title: '프로모션', count: '2', countBase: '1'},
        },
        MYHOME_UNDONE_LIST: [
          { title: '미처리', count: 7, class: 'is-border-top pt-2'},
          { title: '통화 예약', count: 0},
          { title: '콜백', count: 0},
        ],
        leave: {
          transRequest: { title: '이첩 요청', count: 3, class: ''},
          transGet: { title: '이첩 접수', count: 0},
          transReject: { title: '이첩 반려', count: 0},
          transRetrieve: { title: '이첩 회수', count: 0},
        },
        AFTER_LIST: {
          self: { title: '자체 사후처리', count: 3, class: '', index: 0,},
          collabo: { title: '협업 사후처리', count: 5, countBase: 2, index: 1,},
        },
        UNDONE_AFTER_LIST: {
          undone: { title: '미처리', count: 7, class: 'is-border-top pt-2', index: 0, slideName: 'slideMyhomeUndone'},
          reserve: { title: '통화예약', count: 0, index: 1, slideName: 'slideMyhomeUndone'},
          callback: { title: '콜백', count: 0, index: 2, slideName: 'slideMyhomeUndone'},
          notarget: { title: '미대상', count: 0, slideName: 'Notarget'},
          req_trans: { title: '이관 요청', count: 0, index: 0, slideName: 'slideCenterTransInbound'},
          rcv_reject: { title: '반려 접수', count: 0, index: 1, slideName: 'slideCenterTransInbound'},
        },

        wait_call: 0,
        response_call: 0,
        cancel_call: 0,

        ROLL_LIST: [
          { subject: '집중호우로 인한 산사태, 홍수, 침수 등 대처 요령' },
          { subject: '여름철 집중호우 침수 피해 사전에 방지한다' },
          { subject: 'LH주거복지정보, 자립준비청년 사회정착을 위한 주거지원 대면교육 제공' },
        ],
        ROLL_LIST_CURRENT_INDEX: 0,
        intervalId: null,
        staticRollList: false,

        // 마이홈 미처리
        MYHHOME_UNDONE_PROFILE: {
          img:  require('@/assets/img/@manager_profile4.png'),
          name: '우성아',
          grade: '주임',
          center: '마이홈센터 - 마이홈2팀',
        },

        CTI_SEAT_MOVE_TP : {}, //이석
      }
    },
    computed: {
      ...mapGetters({
        isStatusBoard: 'commonStore/GE_COMMON_SETTING_STATUSBOARD',
      }),
      isStatusMyBoard: {
        get() {
          return this.$store.getters['commonStore/GE_COMMON_SETTING_STATUSMYBOARD'];
        },
        set(val) {
          this.$store.dispatch('commonStore/AC_COMMON_SETTING_IS_STATUSMYBOARD', val);
        },
      },
    },
    methods: {
      switchCoaching() {
        this.mixin_set_active_tab({PATH_NM:'/home', NODE_TITLE:'홈'});
          setTimeout(() => {
            if(this.computedUserType === 'MANAGER') {
              this.$store.dispatch('commonStore/AC_COMMON_MANAGER_HOME_TAB', 4);  //코칭 탭
              this.$eventBus.$emit('refreshCoachingGridList');

            }else {
              this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', 8); //코칭 탭
            }
          }, 100);
      },
      showSlide(slide, tabNum, item){
        if(this.computedUserCenter === '4' && (this.computedUserDefaultCuttTask === 'SHDL' || this.computedUserDefaultCuttTask === 'M_SHDL')) {
          const srchUserId = this.SRCH_USER_ID != '' ? this.SRCH_USER_ID : this.user_id;
          this.$eventBus.$emit('showVSlideXreverse', {slide : slide, tabNum : Number(tabNum), injectionObj : {SRCH_USER_ID: srchUserId}, item : item}, {tabNum: Number(tabNum)})
        } else {
          this.$eventBus.$emit('showVSlideXreverse', {slide : slide, tabNum : Number(tabNum), item : item}, {tabNum: Number(tabNum)})
        }

      },
      showDialog(dialogNm){
        this.$eventBus.$emit('showRightDialog', {dialogNm : dialogNm});
      },
      // 롤링 공지
      RollList() {
        this.ROLL_LIST_CURRENT_INDEX = (this.ROLL_LIST_CURRENT_INDEX + 1) % this.ROLL_LIST.length;
      },
      getTopStyle(index) {
        if (index === this.ROLL_LIST_CURRENT_INDEX) {
          return { top: '0px' };
        } else if (index === (this.ROLL_LIST_CURRENT_INDEX + this.ROLL_LIST.length - 1) % this.ROLL_LIST.length) {
          return { top: '-38px' };
        } else {
          return { top: '38px' };
        }
      },
      startRotation() {
        this.intervalId = setInterval(this.RollList, 3000);
      },
      stopRotation() {
        clearInterval(this.intervalId);
        this.intervalId = null;
      },
      expandRollingList(){
        this.stopRotation()
        this.staticRollList = true
      },
      shrinkRollingList(){
        this.startRotation()
        this.staticRollList = false
      },

      //상담 모니터링 새로고침
      reloadCuttStat() {
        this.SRCH_DEPT_ID = '';
        this.SRCH_USER_ID = '';
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT')
      },

      //개인전광판
      async setCuslCallTimeInfo(data){
        let arrStat = [];
        arrStat.push({title:'IN', count : data.insuccess});
        arrStat.push({title:'OUT', count : data.outsuccess});
        arrStat.push({title:'통화', count : this.mixin_seconds_toHHMM(Number(data.intalktime) + Number(data.outtalktime))});
        arrStat.push({title:'후처리', count : this.mixin_seconds_toHHMM(Number(data.acwtime))});

        if(data.extensionhandle){
          let MOVE_STAT_TIME = JSON.parse(ipron.GetExtensionData(data.extensionhandle));

          let restTime = 0; //휴식
          let eatTime = 0; //식사
          let etcTime = 0; //기타
          let otherTime = 0; //그외

          // console.log('MOVE_STAT_TIME : ', MOVE_STAT_TIME);
          this.CTI_SEAT_MOVE_TP.forEach((cd, idx) => {
            Object.keys(MOVE_STAT_TIME).forEach((obj, idx) => {
              if(cd.value === obj.split('-')[1]){
                //브리지텍과 한국클라우간 이석 코드에 대해 협의된 내용은 식사가 1 교육이 2 이었으나 상태값 가져 오는 부분은 식사가 2 교육이 1로 되어 있음
                if(cd.value === '1'){ //식사
                  otherTime += Number(MOVE_STAT_TIME[obj]);
                }else if(cd.value === '2'){ //교육
                  eatTime += Number(MOVE_STAT_TIME[obj]);
                }else if(cd.value === '3'){ //휴식
                  restTime += Number(MOVE_STAT_TIME[obj]);
                }else if(cd.value === '4'){ //지원
                  otherTime += Number(MOVE_STAT_TIME[obj]);
                }else if(cd.value === '5'){ //기타
                  etcTime += Number(MOVE_STAT_TIME[obj]);
                }else if(cd.value === '6'){ //확인
                  otherTime += Number(MOVE_STAT_TIME[obj]);
                }
              }
            });
          });

          arrStat.push({title:'휴식', count : this.mixin_seconds_toHHMM(restTime), class: 'type-sub'});
          arrStat.push({title:'식사', count : this.mixin_seconds_toHHMM(eatTime), class: 'type-sub'});
          arrStat.push({title:'기타', count : this.mixin_seconds_toHHMM(etcTime), class: 'type-sub'});
          arrStat.push({title:'그외', count : this.mixin_seconds_toHHMM(otherTime), class: 'type-sub'});

          this.$store.commit("statusStore/MU_PERSONAL_STAT", arrStat);
        }
      },

      getAgentState(){
        ipronCallUtil.getAgentReport();
      },

      //팀 목록 조회
      async getDeptList() {
        this.DEPT_LIST = [{value: '', text: '팀 선택'}];

        let postParam = {
          SRCH_TYPE : 'CUSL',
          SRCH_CUSTCO_ID: this.computedUserCenter
        };
        let headParam = {head: {
          ns: 'palette3.setting.ognz.dao.OgnzMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectOgnzByRole", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            if(item.UP_DEPT_ID != '1') {
              this.DEPT_LIST.push({
                value: item.DEPT_ID,
                text: item.DEPT_NM
              })
            }
          })
        }
      },

      //팀 상담사 목록 조회
      async getUserList() {
        console.log("getUserList", this.SRCH_DEPT_ID)
        this.SRCH_USER_ID = '';
        this.USER_LIST = [{value: '', text: '상담사 선택'}];

        //팀이 선택되었을때만 조회.
        if(this.SRCH_DEPT_ID =='') {
          return;
        }

        let postParam = {
          USER_STTS_CD : 'WORK',
          SRCH_TYPE : 'CUSL',
          SRCH_DEPT_ID: this.SRCH_DEPT_ID
        };
        let headParam = {head: {
          ns: 'lhcs.system.user.dao.UserMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            this.USER_LIST.push({
              value: item.USER_ID,
              text: item.USER_NM
            })
          })
        }
        this.reloadCuttMonitorStatSrchUser();
      },

      //바로처리 스케줄러 - 선택한 팀/상담사의 상담 모니터링 조회.
      reloadCuttMonitorStatSrchUser() {
        //팀/상담사 선택시 선택된 상담사의 상담 모니터링 조회,
        //미선택 시 로그인자의 상담 모니터링 조회.
        if(this.SRCH_DEPT_ID =='' || this.SRCH_USER_ID =='') {
          this.mixin_reloadCuttStat('CUTT_MONITOR_STAT');
          //로그인 사용자자의 태그 목록 및 건수 조회
          this.$eventBus.$emit('setAsSchedulerSchUserData', {DEPT_ID: '', USER_ID: ''});
          return;
        } else {
          const schData = {
            TARGET: 'CUTT_MONITOR_STAT'
            , DEPT_ID : this.SRCH_DEPT_ID //선택된 부서
            , USER_ID : this.SRCH_USER_ID //선택된 사용자 ID
          }
          this.$eventBus.$emit('setStatBoardOtherUser', schData);
          //선택된 상담사의 태그 목록 및 건수 조회
          this.$eventBus.$emit('setAsSchedulerSchUserData', schData);
        }
      },

      //바로처리 검색 결과 출력.
      asMoveSearchOther(index) {
        const srchUserId = this.SRCH_USER_ID != '' ? this.SRCH_USER_ID : this.user_id;
        this.mixinAsMoveSearchOther(index, srchUserId)
      }

    },
    mounted() {
      this.startRotation();
    },
    beforeDestroy() {
      this.stopRotation();
      this.$eventBus.$off("setCuslCallTimeInfo"); //eventBus 중복방지를 위해 off
    },
    async created() {
      this.isAdmin3 = this.computedUserGroupCd.indexOf("CNSLT_ADMIN") > -1 ? true : false;  //관리자 = 콜센터매니저
      this.isCnsltStaff = this.computedUserGroupCd.indexOf("CNSLT_STAFF") > -1 ? true : false;  //바로처리팀장 = 팀장(부팀장)
      let codeName = ['CTI_SEAT_MOVE_TP']; //CTI 메뉴, CTI 이석 종류
      let list_common_code = await this.mixin_common_code_get_all_global(codeName);
      this.CTI_SEAT_MOVE_TP = await this.mixin_common_code_get_global(list_common_code, 'CTI_SEAT_MOVE_TP', this.computedUserCenter, '');

      if((this.computedUserDefaultCuttTask === 'SHDL' || this.computedUserDefaultCuttTask === 'M_SHDL') && (this.isAdmin3 || this.isCnsltStaff)) {
        this.getDeptList();
      }

      //개인전광판
      this.$eventBus.$on("setCuslCallTimeInfo", (data) => {
        this.setCuslCallTimeInfo(data);
      });

      //IC_CTIQ 대기, 응대, 포기 호 레디스 조회.
      this.$eventBus.$on('EMIT_ICCTIQ_DEPT' , (item) => {
        // this.wait_call = item.SUM_CONN_CNT;
        this.wait_call = item.RTS_WAIT_CNT;
        this.response_call = item.SUM_ANSWER_CNT;
        this.cancel_call = item.SUM_ABDN_CNT;
      });
    }
  }
</script>

<style lang="scss" scoped>

</style>