<template>
  <div class="pl-cols flex-grow-1 fill-height">
    <div class="is-vrt is-col-fix px-5" style="width: 50%">
      <div class="is-mt-m">
        <ul class="pl-list-info4">
          <li style="min-height: auto;" class="pt-0 pb-2">
          <span class="pl-list-info-title">
            <v-icon class="pl-icon20 confirm2"></v-icon>
            <span class="ml-1">전체</span>
          </span>
            <div class="pl-list-info-desc mt-0">
              <strong>{{STAT_TOT}}</strong>
            </div>
          </li>
          <li style="min-height: auto;" class="pt-0 pb-2">
          <span class="pl-list-info-title">
            <v-icon class="pl-icon20 manager-stat-cs"></v-icon>
            <span class="ml-1">상담중</span>
          </span>
            <div class="pl-list-info-desc mt-0">
              <strong>{{STAT_50}}</strong>
            </div>
          </li>
          <li style="min-height: auto;" class="pt-0 pb-2">
          <span class="pl-list-info-title">
            <v-icon class="pl-icon20 manager-stat-wait"></v-icon>
            <span class="ml-1">대기중</span>
          </span>
            <div class="pl-list-info-desc mt-0">
              <strong>{{STAT_40}}</strong>
            </div>
          </li>
          <li style="min-height: auto;" class="pt-0 pb-2">
          <span class="pl-list-info-title">
            <v-icon class="pl-icon20 manager-stat-work"></v-icon>
            <span class="ml-1">후처리</span>
          </span>
            <div class="pl-list-info-desc mt-0">
              <strong>{{STAT_60}}</strong>
            </div>
          </li>
          <li style="min-height: auto;" class="pt-0 pb-2">
          <span class="pl-list-info-title">
            <v-icon class="pl-icon20 manager-stat-leave"></v-icon>
            <span class="ml-1">이석</span>
          </span>
            <div class="pl-list-info-desc mt-0">
              <strong>{{STAT_30}}</strong>
            </div>
          </li>
          <li style="min-height: auto;" class="pt-0 pb-2">
          <span class="pl-list-info-title">
            <v-icon class="pl-icon20 manager-stat-logout"></v-icon>
            <span class="ml-1">로그아웃</span>
          </span>
            <div class="pl-list-info-desc mt-0">
              <strong>{{STAT_LOGOUT}}</strong>
            </div>
          </li>
        </ul>
      </div>
      <!-- grid top -->
      <div class="pl-form-inline-wrap is-mt-m" >
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN'">
              <span class="pl-label">
                센터
              </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle is-md"
                placeholder="선택"
                v-model="SRCH_PARAMS_TOP.SRCH_CENTER"
                return-object
                :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '' )"
                @change="SRCH_PARAMS_TOP.SRCH_DEPT.value=''"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN' || computedUserType === 'LEADER'">
              <span class="pl-label">
                소속
              </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
                @change="selectGridList"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            목록내검색
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle flex-grow-1"
              v-model="SRCH_PARAMS_TOP.SRCH_STR"
              placeholder="성명,상태,통화번호" >
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline ml-auto">
          <v-btn class="pl-btn btn is-icon is-trans" @click="downloadPlayer"><v-icon class="pl-icon30 file-down-arrow ml-auto"></v-icon>모니터링플레이어 & 메뉴얼</v-btn>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
          class="pl-grid is-mt-s has-img is-hover"
          :headers="GRID.HEADERS"
          :items="GRID.ITEMS"
          :item-class="isActiveRow"
          :search="SRCH_PARAMS_TOP.SRCH_STR"
          fixed-header
          item-key="index"
          height="calc(100vh - 308px)"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          @click:row="rowSelect"
          :items-per-page="-1"
          :loading="mixin_loadding"
          loading-text="조회중입니다." >
        <template v-slot:item.USER_NM="{ item }">
          <td class="text-center">
            <img :src="item.IMG" :alt="item.USER_NM" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
            <strong :inner-html.prop="`${item.USER_NM.concat('(').concat(item.EXT_NO).concat(')')}` | highlight(SRCH_PARAMS_TOP.SRCH_STR)" class="ml-1"></strong>
          </td>
        </template>
        <template v-slot:item.FINAL_TALK_ANI="{ item }">
          <div :inner-html.prop="item.FINAL_TALK_ANI | highlight(SRCH_PARAMS_TOP.SRCH_STR)"> </div>
        </template>
        <template v-slot:item.AGENT_STATUS="{ item }">
          <span :class="`pl-bullet-txt type-dot ${ mixin_displayStatus(item.AGENT_STATUS, 'STAT_LIST') }`">
            <span :inner-html.prop="item.AGENT_STATUS | highlight(SRCH_PARAMS_TOP.SRCH_STR)"></span>
          </span>
        </template>
      </v-data-table>
      <CompoStompICAGENT />
    </div>
    <!-- 실시간 대화 -->
    <template v-if="selectedRow">
    <div>
      <!-- header -->
      <div>
        <div class="pl-quick-layer-header flex-column align-start">
          <div class="d-flex align-center" style="width: 100%">
            <div class="d-flex align-center">
              <h1>{{ selectedRow.USER_NM }}({{ selectedRow.EXT_NO }})님의 실시간 대화록</h1>
              <span
                style="width: 62px"
                :class="`ml-2 pl-badge ${ mixin_displayStatus(selectedRow.AGENT_STATUS, 'STAT_LIST') }`">{{ selectedRow.AGENT_STATUS }}</span>
            </div>
              <v-switch class="ml-auto pl-switch type-first-label"
                        :disabled="selectedRow.AGENT_STATUS==='통화중'?false:true"
                        v-model="selectedRow.isRealtimeScroll">
                <template v-slot:label>
                  <span class="pl-label">스크롤</span>
                </template>
              </v-switch>
              <v-switch class="pl-switch type-first-label ml-3"
                        :disabled="selectedRow.AGENT_STATUS==='통화중'?false:true"
                        v-model="selectedRow.isRealtimeStt">
                <template v-slot:label>
                  <span class="pl-label">실시간STT</span>
                </template>
              </v-switch>
              <!-- 감청 버튼 -->
              <template>
              <span class="pl-label ml-3">모니터링</span>
                <compo-tooltip-btn
                  TitleProp="모니터링"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 audioListen"
                  TooltipPositionProp="bottom"
                  :DisabledProp="selectedRow.AGENT_STATUS==='통화중'?false:true"
                  @btnClick="execWiretap(selectedRow.EXT_NO)"
                ></compo-tooltip-btn>
              </template>
          </div>
          <div class="">
            <strong class="ml-1" style="flex: 0 0 70px">통화번호</strong>
            <span class="ml-2">{{selectedRow.FINAL_TALK_ANI}}</span>
          </div>
        </div>
      </div>
      <!-- talk log -->
       <template v-if="selectedRow.AGENT_STATUS==='통화중' || selectedRow.AGENT_STATUS==='후처리'">
         <CompoTalkMonitor
             :TalkProp="MONITOR_TALK_DATA"
             :isRealtimeScroll="selectedRow.isRealtimeScroll"
             class="is-vrt is-col-fix"
         />
       </template>
    </div>
    </template>
    <template v-else>
      <div>
        <!-- header -->
        <div>
          <div class="pl-quick-layer-header flex-column align-start">
            <div class="d-flex align-center" style="width: 100%">
              <div class="d-flex align-center">
                <h1>000님의 실시간 대화록(선택안됨)</h1>
              </div>
            </div>
            <div class="">
              <strong class="ml-1" style="flex: 0 0 70px">통화번호</strong>
              <span class="ml-2">000-0000-0000</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CompoStompICAGENT from "@/components/socket/CompoStompICAGENT.vue";
import HomeLeaderStatManager from './HomeLeaderStatManager.vue'
import CompoTalkMonitor from '@/components/CompoTalkMonitor'
export default {
  name: "HOME_TEAM_TAB010", //name은 'MENU_' + 파일명 조합
  components: {
    CompoStompICAGENT,
    HomeLeaderStatManager,
    CompoTalkMonitor
  },
  filters: {
    highlight: function(value, query){
      return value.replace(new RegExp(query, "ig"), '<span class=\'orange\'>' + query + '</span>')
    },
  },
  data() {
    return {
      socketWt: null, /*감청용소켓*/
      mip1:'',
      mip2:'',
      mport1:'',
      mport2:'',
      scrip:'',
      scrport:'',

      connectionStatusWt: '',
      common_ognz_list:[], //조직
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_STR:'',
      },
      // grid
      selectedRow: null,
      GRID: {
        HEADERS: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '성명(내선)', value: 'USER_NM', align: 'center', width: '150px' , sortable: false},
          { text: '상태', value: 'AGENT_STATUS', width: '90px', sortable: false},
          { text: '최종 통화번호', value: 'FINAL_TALK_ANI', align: 'center', width: '120px' , sortable: false},
          { text: '시간', value: 'DIFF_SS', align: 'center', width: '90px' , sortable: false},
          { text: '최종 상태변경시간', value: 'STATUS_TIME', align: 'center', width: '150px' , sortable: false},
        ],
        ITEMS:[],
        ITEMS_TOT_CNT:[]
      },
      monitor_interval: null,
      monitor_stt_interval: null,
      STAT_TOT:0,
      STAT_50:0, //상담중
      STAT_40:0, //대기
      STAT_60:0, //후처리
      STAT_30:0, //이성
      STAT_LOGOUT:0, //로그아웃

      // 상태 컬러
      STAT_LIST: [
        { code: '통화중', value:'is-stat-call' },
        { code: '벨울림중', value:'is-stat-call' },
        { code: '다이얼링중', value:'is-stat-call' },
        { code: '대기', value:'is-stat-wait'},
        { code: '후처리', value:'is-stat-work'},
        { code: '이석', value:'is-stat-rest'},
        { code: '이석(식사)', value:'is-stat-rest'},
        { code: '이석(교육)', value:'is-stat-rest'},
        { code: '이석(휴식)', value:'is-stat-rest'},
        { code: '이석(지원)', value:'is-stat-rest'},
        { code: '이석(기타)', value:'is-stat-rest'},
        { code: '이석(확인)', value:'is-stat-rest'},
        { code: '로그아웃', value:'is-stat-out'},
      ],

      MONITOR_TALK_DATA:[],
    }
  },
  methods: {
    // 그리드 click
    rowSelect(idx) {
      this.selectedRow = idx;
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    async selectGridList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.GRID.ITEMS = [];
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectUserList';
      let postParam = {};
      postParam.SRCH_TYPE = 'CUSL';
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }

      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let resData = await this.common_postCall(sURL, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        let response = resData.DATA;
        response.map( (item,i) => {
          if( item.ICON_IMG_URI !== '/' ) {
            response[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            response[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          response[i]["FINAL_TALK_ANI_ORG"] = '';
          response[i]["FINAL_TALK_ANI"] = '';
          response[i]["DIFF_SS"] = '';
          response[i]["AGENT_STATUS"] = '로그아웃';
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...response];
        this.GRID.ITEMS_TOT_CNT = resData.HEADER.TOT_COUNT;
        this.STAT_TOT = this.GRID.ITEMS_TOT_CNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    async initStat() {
      this.STAT_TOT = 0;
      this.STAT_50 = 0; //상담중
      this.STAT_40 = 0; //대기
      this.STAT_60 = 0; //후처리
      this.STAT_30 = 0; //이석
      this.STAT_LOGOUT = 0; //로그아웃
    },
    async selectIpronAgentMonitor( body ) {
      let _this = this;
      await _this.initStat();
      _this.STAT_TOT = _this.GRID.ITEMS_TOT_CNT;

      let responseData = JSON.parse(body.message).MESSAGE;
      let i = 0;
      responseData.map(agentItem => {
        let item = _this.GRID.ITEMS.find((item) => (item.AGENT_ID === agentItem.AGENT_LOGIN_ID ));
        if( item !== undefined ) {
          item.FINAL_TALK_ANI = agentItem.FINAL_TALK_ANI;
          if( !_this.mixin_isEmpty(agentItem.STATUS_TIME)) {
            item.STATUS_TIME = _this.mixin_convertDate(agentItem.STATUS_TIME, 'yyyy-MM-dd HH:mm:ss');
            item.DIFF_SS = _this.getTimeDifference(_this.$moment(new Date()).format('YYYYMMDDHHmmss'), agentItem.STATUS_TIME);
          }
          if( agentItem.AGENT_STATUS === 30 ) { //이석
            if( agentItem.REASON_CODE === 1) {
              item.AGENT_STATUS = '이석(교육)';
            }else if( agentItem.REASON_CODE === 2) {
              item.AGENT_STATUS = '이석(식사)';
            }else if( agentItem.REASON_CODE === 3) {
              item.AGENT_STATUS = '이석(휴식)';
            }else if( agentItem.REASON_CODE === 4) {
              item.AGENT_STATUS = '이석(지원)';
            }else if( agentItem.REASON_CODE === 5) {
              item.AGENT_STATUS = '이석(기타)';
            }else if( agentItem.REASON_CODE === 6) {
              item.AGENT_STATUS = '이석(확인)';
            }else {
              item.AGENT_STATUS = '이석';
            }
            _this.STAT_30++;
          }else if( agentItem.AGENT_STATUS === 40 ) { //대기
            item.AGENT_STATUS = '대기'; _this.STAT_40++;
          }else if( agentItem.AGENT_STATUS === 50 ) { //통화중
            item.AGENT_STATUS = '통화중'; _this.STAT_50++;
          }else if( agentItem.AGENT_STATUS === 51 ) { //벨울림중
            item.AGENT_STATUS = '벨울림중'; _this.STAT_50++;
          }else if( agentItem.AGENT_STATUS === 52 ) { //다이얼링중
            item.AGENT_STATUS = '다이얼링중'; _this.STAT_50++;
          }else if( agentItem.AGENT_STATUS === 60 ) { //후처리
            item.AGENT_STATUS = '후처리'; _this.STAT_60++;
          }else {
            item.AGENT_STATUS = '로그아웃';
          }
        }
      });
      _this.STAT_LOGOUT = _this.STAT_TOT - ( _this.STAT_30 + _this.STAT_40 + _this.STAT_50 + _this.STAT_60 );
    },

    /* 토큰조회 */
    async selectSwatAuthToken() {
      let response = await this.common_postCall("/api/itf/ipron/swat/auth/token.do", {userSabun:'HC_TEST03'}, {});
      if (!response.HEADER.ERROR_FLAG){
        console.log( "selectSwatAuthToken::", response );
      }
    },

    execWiretap( extNo ) {
      this.socketWt = new WebSocket("ws://localhost:8282");
      this.socketWt.addEventListener("open", () => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>감청::::::Message from server: open");
        this.connectionStatusWt = "Connected";
        this.socketWt.send("cmd=3&mrs_ip1=" + this.mip1 + "&mrs_port1=" + this.mport1 + "&mrs_ip2=" + this.mip2 + "&mrs_port2=" + this.mport2 + "&scr_ip=" + this.scrip + "&scr_port=" + this.scrport + "&agent_dn=" + extNo);
      });

      // Handle incoming messages
      this.socketWt.addEventListener("message", (event) => {
      });

      // Handle connection errors
      this.socketWt.addEventListener("error", (error) => {
        this.connectionStatusWt = "Error";
        this.showAlertCaution({msg:"감청플레이어 설치 후 이용해주세요. "});
      });

      // Update status when connection is closed
      this.socketWt.addEventListener("close", () => {
        this.connectionStatusWt = "Disconnected";
        this.socketWt = null;
      });
    },
    downloadPlayer() {
      location.href='/bridgetec/VLCPlayer_20241115.zip';
    },

    getTimeDifference(dateTime1, dateTime2) {
      // 두 날짜 문자열을 Date 객체로 변환
      const parseDate = (dateTime) => {
        const year = parseInt(dateTime.slice(0, 4), 10);
        const month = parseInt(dateTime.slice(4, 6), 10) - 1; // 월은 0부터 시작
        const day = parseInt(dateTime.slice(6, 8), 10);
        const hours = parseInt(dateTime.slice(8, 10), 10);
        const minutes = parseInt(dateTime.slice(10, 12), 10);
        const seconds = parseInt(dateTime.slice(12, 14), 10);
        return new Date(year, month, day, hours, minutes, seconds);
      };

      const date1 = parseDate(dateTime1);
      const date2 = parseDate(dateTime2);

      // 두 날짜의 차이를 초 단위로 계산
      const diffInSeconds = Math.abs((date2 - date1) / 1000); // 밀리초를 초로 변환

      // 시, 분, 초로 변환
      const hours = Math.floor(diffInSeconds / 3600); // 전체 초에서 시 계산
      const minutes = Math.floor((diffInSeconds % 3600) / 60); // 남은 초에서 분 계산
      const seconds = diffInSeconds % 60; // 남은 초 계산

      // 결과 문자열로 반환
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    selectMonitorRecordInfo() {
      let _this = this;
      this.common_postCall_callback(
          '/api/itf/stt/selectMonitorSttData'
          , {EXT_NO: this.selectedRow.EXT_NO}
          , {}
          , function(response) {
            if (!response.HEADER.ERROR_FLAG) {
              _this.MONITOR_TALK_DATA  = response.DATA;
            }else {
              _this.selectedRow.isRealtimeStt = false;
            }
        }
      );
    },
    displayMonitorTalk() {
      this.MONITOR_TALK_DATA = [];
      clearInterval(this.monitor_stt_interval);
      if (this.selectedRow.AGENT_STATUS === '통화중') {
        this.selectedRow.isRealtimeScroll = true;
        this.selectedRow.isRealtimeStt = true;
        this.$eventBus.$emit('setEnterMonitor', this.selectedRow);

        this.selectMonitorRecordInfo();

        // 2초마다 모니터링 조회
        this.monitor_stt_interval = setInterval(() => {
          if (this.leader_home_tab_index === 12) { //모니터링탭 의경우.
            if (this.selectedRow.isRealtimeStt && this.selectedRow.AGENT_STATUS === '통화중') {
              this.selectMonitorRecordInfo();
            }
          }
        }, 3000);
      }
    }
  },
  mounted() {

  },
  async created() {
    this.mip1 = process.env.VUE_APP_IPRON_MRS_IP_ADDR1;
    this.mip2 = process.env.VUE_APP_IPRON_MRS_IP_ADDR2;
    this.mport1 = process.env.VUE_APP_IPRON_MRS_IP_PORT1;
    this.mport2 = process.env.VUE_APP_IPRON_MRS_IP_PORT2;
    this.scrip = process.env.VUE_APP_IPRON_SCR_IP_ADDR;
    this.scrport = process.env.VUE_APP_IPRON_SCR_IP_PORT;
    //조직
    this.common_ognz_list = await this.mixin_ognz_list();

    if( this.computedUserType === 'LEADER' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.computedUserCenter;
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.computedUserCenterDeptId;
      if( this.computedUserDetailType.indexOf("CENTER_LEADER") === -1) {  //센터장이 아닌경우 자기자신부서만.
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
        // this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }else {
        let first_obj = this.mixin_ognz_list_detail_first(this.common_ognz_list, this.computedUserCenterDeptId);
        if( first_obj ) { //첫번째 부서세팅.
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = first_obj.DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = first_obj.DEPT_ID;
        }else {
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }
    }else if( this.computedUserType === 'ETC_ADMIN' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
      this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '10004'; //마이홈1팀
      this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '10004';
    }

    await this.selectGridList();

    this.$eventBus.$on('emitRecieveRedisICAGENT' , (body) => {
      // CompoStompICAGENT 에서 수집한 IC:AGENT 값
      this.selectIpronAgentMonitor( body );
    })

  },
  computed: {
    leader_home_tab_index: {
      get() {
        return this.$store.getters['commonStore/GE_COMMON_LEADER_HOME_TAB'];
      }
    }
  },
  beforeDestroy() {
    console.log("beforeDestory.HOME_TEAM_TAB010");
    this.$eventBus.$off('emitRecieveRedisICAGENT');

    if(this.socketWt) { this.socketWt.close(); this.socketWt = null; }
    clearInterval(this.monitor_interval);
    clearInterval(this.monitor_stt_interval);
  },
  watch: {
    selectedRow() {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> watch.selectedRow", this.selectedRow.AGENT_STATUS);
      this.MONITOR_TALK_DATA = [];
      clearInterval(this.monitor_stt_interval);
      this.$eventBus.$emit('closeCallId', {} );
      if( this.selectedRow.AGENT_STATUS === '통화중' ) {
        this.selectedRow.isRealtimeScroll = true;
        this.selectedRow.isRealtimeStt = true;
        this.$eventBus.$emit('setEnterMonitor', this.selectedRow);

        this.selectMonitorRecordInfo();

        // 2초마다 모니터링 조회
        this.monitor_stt_interval = setInterval(() => {
          if( this.leader_home_tab_index === 12 ) { //모니터링탭 의경우.
            if( this.selectedRow.isRealtimeStt && this.selectedRow.AGENT_STATUS === '통화중') {
              this.selectMonitorRecordInfo();
            }
          }
        }, 3000);
      }else {
        this.selectedRow.isRealtimeScroll = false;
        this.selectedRow.isRealtimeStt = false;
        if( !this.selectedRow.AGENT_STATUS !== '후처리'){
          //this.MONITOR_TALK_DATA = [];
        }
      }
    },
    "selectedRow.AGENT_STATUS": {
      handler() {
        this.displayMonitorTalk();
      }
    },
    "selectedRow.isRealtimeStt": {
      handler() {
        this.displayMonitorTalk();
      }
    },
    leader_home_tab_index() {
    }
  },
};
</script>
<style lang="scss" scoped>
</style>