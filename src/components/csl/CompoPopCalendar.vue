<template>
  <div class="">
    <!-- search form -->
    <div class="pl-card pl-grid-top">
      <div class="pl-form-inline-wrap" >
        <div
          v-if="computedIsContainAdminGroup"
          class="pl-form-inline" >
          <span class="pl-label">
            팀
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SRCH_DEPT_ID"
              :items="DEPT_LIST"
              class="pl-form type-middle"
              @change="changeSrchDeptId"
            ></v-select>
            <span @click="getShareList()">팀장협업요청 ({{ SHARE_CNT }}건)</span>
          </div>
        </div>
        <div class="pl-form-inline" >
          <span class="pl-label">
            표시기준
          </span>
          <div class="pl-desc">
            <v-radio-group
              v-model="SCHED_TYPE"
              row
              class="pl-radio-group"
              @change="changeSchedType"
            >
              <v-radio
                v-for="(rad01) in SCHED_TYPE_LIST"
                :key="rad01.value"
                :label="rad01.text"
                :value="rad01.value"
                class="pl-radio"
              >
              </v-radio>
            </v-radio-group>


          </div>
        </div>
         <!-- 방문확정일 옵션 -->
         <template v-if="SCHED_TYPE === 'VISIT'">
          <div class="pl-form-inline" >
            <span class="pl-label">
              상세검색
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="SRCH_FRM_NM"
                class="pl-form is-search type-middle"
                placeholder="업체명 입력"
                readonly
                @click="checkFindFrm"
                >
                <template v-slot:append>
                  <v-btn
                    @click="mixin_showDialog('FindAsFrm')"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
              <v-select
                v-if="computedIsContainAdminGroup"
                v-model="VISIT_DEPT_ID"
                :items="DEPT_LIST"
                class="pl-form type-middle"
                placeholder="팀 선택"
              ></v-select>

              <v-text-field
                v-if="!computedIsContainAdminGroup"
                v-model="SRCH_EMP_NMS"
                class="pl-form is-search type-middle"
                placeholder="상담사명(복수선택가능)"
                @click="checkFindCusl"
                readonly
                >
                <template v-slot:append>
                  <v-btn
                    @click="mixin_showDialog('FindCusl')"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>

            </div>
          </div>
        </template>
        <div class="pl-btn-wrap">
          <v-btn class="pl-btn is-esp2 flex-grow-0" >
            새로고침
          </v-btn>
          <v-btn
            class="pl-btn is-icon flex-grow-0"
            @click="getAsSchedulerCalendarList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
        </div>

      </div>
    </div>
    <!-- calendar -->
    <div class="pl-card justify-center d-flex align-center is-border-top">
      <v-btn
          v-model="isBtnClick1"
          fab
          text
          plain
          small
          @click="prev"
      >
        <v-icon small>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <strong
          v-if="$refs.calendar"
          class="text-h5 pl-full-calendar-title">
          {{ computedCalendarTitle }}
      </strong>
      <v-btn
          fab
          text
          small
          plain
          @click="next"
      >
        <v-icon small>
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-btn
          class="pl-btn is-sub"
          @click="setToday"
      >
        오늘
      </v-btn>
    </div>
    <div class="pl-card pl-full-calendar">
      <v-calendar
        ref="calendar"
        v-model="focus_cal"
        color="primary"
        :events="events"
        locale="ko-KR"
        :event-more="false"
        event-overlap-mode="stack"
        event-text-color='black'
        :day-format="getDay"
        :type="type"
      >
      <template v-slot:event="{event}">
        <div :style="!event.clickable && { cursor: 'default', 'pointer-events': 'none' }"
          @click="event.clickable && onEventClick(event)">
          <template v-if="event.cntYn == 'Y'">
            <strong class="pl-badge is-blueGray hover-line" style="width: auto; font-size: 14px;">
              {{ event.name }}
            </strong>
          </template>
          <template v-else>
            <span style="font-size: 14px;">
              {{ event.name }}
            </span>
          </template>
        </div>
      </template>
    </v-calendar>
    </div>

    <!-- dialog: 업체명 조회 -->
    <v-dialog
      v-if="dialogFindAsFrm"
      v-model="dialogFindAsFrm"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="업체 조회"
        @hide="mixin_hideDialog('FindAsFrm')"
        @submit="submitDialog('FindAsFrm')"
        >
        <template slot="body">
          <CompoFindAsFrm
            @setItem="setFrm"
          />
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 상담사 조회 -->
    <v-dialog
      v-if="dialogFindCusl"
      v-model="dialogFindCusl"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="직원 찾기"
          @hide="mixin_hideDialog('FindCusl')"
          @submit="submitDialog('FindCusl')"
        >
        <template slot="body">
          <CompoFindCusl
              ref="CompoFindCusl"
              :PAGING_PROP="true"
              :CHK_YN_PROP="chkYnProp"
              @hideDialog="mixin_hideDialog('FindCusl')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('FindCusl')">닫기</v-btn>
          <v-btn class="pl-btn" v-if="chkYnProp" @click="submitDialog">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoFindAsFrm from '@/components/CompoFindAsFrm.vue';
import CompoFindCusl from '@/components/CompoFindCusl.vue';
export default {
  name: 'CompoPopCalendar', //캘린더 팝업
  components: {
    CompoFindAsFrm,
    CompoFindCusl
  },
  data() {
    return {
      dialogFindAsFrm: false,
      dialogFindCusl: false,
      chkYnProp: true,

      SCHED_TYPE: "RSRV",
      SCHED_TYPE_LIST: [
        { text: "통화예정일", value: "RSRV" },
        { text: "방문확정일", value: "VISIT" },
        { text: "방문예정일", value: "VISIT_PLAN" },
      ],

      SRCH_DEPT_ID: '',
      VISIT_DEPT_ID: '',
      DEPT_LIST: [],

      SRCH_FRM_CD: '',
      SRCH_FRM_NM: '',
      SRCH_CMPNY_EMP_CDS: '',
      SRCH_EMP_NMS: '',

      SHARE_CNT: 0,//팀장협업요청건수


      // calendar
      schdlData: [], // 전체 일정 저장

      focus_cal: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      date: '',
      START_DT: '',
      END_DT: '',

      focus_picker: '',


      isBtnClick1: false,
      isBtnClick2: false,

      isClicking: false,  //클릭 이벤트 중복 막기 위함.
    }
  },
  methods: {
    // 서버 시간 가져오기
    async getServerDate() {
      await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data) => {
        let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
        this.date = cvDate;
        const dateObj = this.parseDateString(this.date)
        this.START_DT = this.getFirstDate(dateObj).replace(/-/gi, "")
        this.END_DT = this.getLastDate(dateObj).replace(/-/gi, "")
      })
    },

    initSearchCondition() {
      if(this.computedIsContainAdminGroup) {
        const checkDept = this.DEPT_LIST.filter(item => item.value == this.computedUserDeptId);
        if(checkDept.length > 0) {
          this.SRCH_DEPT_ID = checkDept[0].value;
        }

        // 협업사후처리,팀장협업요청 건수
        //TODO ::: fn_getCnsltPrcShareCount
        this.getShareCount();

      } else {
        this.SRCH_DEPT_ID = '';
      }

      this.SCHED_TYPE = "RSRV";
      this.SRCH_FRM_CD = '';
      this.SRCH_FRM_NM = '';
      this.SRCH_CMPNY_EMP_CDS = '';
      this.SRCH_EMP_NMS = '';
      this.VISIT_DEPT_ID = '';
    },

    async getDeptList(){
      let postParam = {
        SRCH_TYPE: 'CUSL',
        SRCH_CUSTCO_ID: this.computedUserCenter, // 상담 직원 찾기
      };
      let headParam = {
        head: {
          ns: "palette3.setting.ognz.dao.OgnzMapper",
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectOgnzByRole", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        let tempList = [];
        response.DATA.map((item, index) => {
          if(index == 0) {
            tempList.push({text : '선택', value : ''})
          } else {
            tempList.push({text : item.DEPT_NM, value : item.DEPT_ID})
          }
        })
        this.DEPT_LIST = tempList;
      }
    },

    //캘린더 목록 조회.
    async getAsSchedulerCalendarList() {

      if(this.SRCH_EMP_NMS != "" && this.SRCH_FRM_NM == "") {
        this.showAlertInfo({msg: '다른 상담사를 조회하려면, 업체명도 조회해야합니다.'})
        return false;
      }
      if(this.SCHED_TYPE == '') {
        this.SCHED_TYPE = "RSRV";
      }

      this.events = [];
      const schedType = this.SRCH_DEPT_ID != '' ? "DEPT" : this.SCHED_TYPE
      const postParam = {
        SCHED_TYPE: schedType,
        DEPT_ID: this.SRCH_DEPT_ID,
        VISIT_DEPT_ID: this.VISIT_DEPT_ID,
        START_DT: this.START_DT,
        END_DT: this.END_DT,
        FRM_CD: this.SRCH_FRM_CD,
        FRM_NM: this.SRCH_FRM_NM,
        SRCH_CMPNY_EMP_CDS: this.SRCH_CMPNY_EMP_CDS,
      };
      const headParam = {
          head: {}
      };

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response = await this.common_postCall("/phone-api/as/scheduler/selectAsSchedulerCalendarList", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.schdlData = response.DATA;
        this.schdlData.map(item => {
          this.events.push({
            timed: false,
            type: item.SCHDL_TYPE,
            cntYn: item.SCHDL_TYPE.indexOf("_CNT") > -1 ? "Y" : "N",
            name: item.SCHDL_NM,
            flw_dtl_full_sn: item.FLW_DTL_FULL_SN,
            start: this.ChnDateForm(item.START_DT),
            end: this.ChnDateForm(item.END_DT),
            color: item.CLICK_YN == 'Y' ? "white" : 'pl-no-pointer',
            clickable: item.CLICK_YN == 'Y' ? true : false,
          })
        })
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
      }
    },

    //팀장협업요청건수 조회
    async getShareCount() {
      const postParam = {};
      const headParam = {
        head: {
          ns: "lhcs.phone.as.dao.PhoneAsSchedulerMapper",
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectAsSchedulerCalendarShareCount", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.SHARE_CNT = response.DATA[0].STC2_CNT;
      }
    },

    //팀장협업요청 목록 조회
    async getShareList() {
      this.SCHED_TYPE = 'SHARE';
      this.SRCH_FRM_CD = '';
      this.SRCH_FRM_NM = '';
      this.SRCH_CMPNY_EMP_CDS = '';
      this.SRCH_EMP_NMS = '';
      this.VISIT_DEPT_ID = '';

      this.events = [];
      const postParam = {
        SCHED_TYPE: "SHARE",
        START_DT: this.START_DT,
        END_DT: this.END_DT,
        TAG_COLOR_CD: 'stc2'
      };
      const headParam = {
          head: {}
      };

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response = await this.common_postCall("/phone-api/as/scheduler/selectAsSchedulerCalendarList", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.schdlData = response.DATA;
        this.schdlData.map(item => {
          this.events.push({
            timed: false,
            type: item.SCHDL_TYPE,
            name: item.SCHDL_NM,
            flw_dtl_full_sn: item.FLW_DTL_FULL_SN,
            start: this.ChnDateForm(item.START_DT),
            end: this.ChnDateForm(item.END_DT),
            color: '#FFFFFF',
            clickable: item.CLICK_YN == 'Y' ? true : false,
          })
        })
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
      }
    },

    // 날짜변환 : String(YYYYMMDDHHmmss) to String(YYYY-MM-DD HH:mm:ss)
    ChnDateForm(dateString) {
      let year = dateString.slice(0, 4);
      let month = dateString.slice(4, 6);
      let day = dateString.slice(6, 8);
      let hour = dateString.slice(8, 10);
      let minute = dateString.slice(10, 12);
      let second = dateString.slice(12, 14);

      // Format the date as "YYYY-MM-DD HH:mm:ss" string
      let formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      return formattedDate;
    },

    // 캘린더 일자 표시
    getDay(date) {
      const day = date["day"]
      const day_num = Number(day);
      return day_num;
    },
    setToday() {
      this.focus_cal = this.date.substr(0, 10);
      const dateObj = this.parseDateString(this.date)
      this.START_DT = this.getFirstDate(dateObj).replace(/-/gi, "")
      this.END_DT = this.getLastDate(dateObj).replace(/-/gi, "")
      this.getAsSchedulerCalendarList();
    },
    // 이전 달
    prev(e) {
      const currentDate = this.focus_cal == '' ? this.$refs.calendar.start : this.focus_cal;
      let currentDateObj = this.parseDateString(currentDate);
      currentDateObj.setMonth(currentDateObj.getMonth() - 1);
      let date = this.getFirstDate(currentDateObj);
      this.focus_cal = date;
      //this.$refs.calendar.prev()
      this.START_DT = date.replace(/-/gi, "")
      this.END_DT = this.getLastDate(currentDateObj).replace(/-/gi, "")
      if(this.SCHED_TYPE != 'SHARE') {
        this.getAsSchedulerCalendarList();
      } else {
        this.getShareList();
      }

    },
    // 다음 달
    next() {
      const currentDate = this.focus_cal == '' ? this.$refs.calendar.start : this.focus_cal;
      let currentDateObj = this.parseDateString(currentDate);
      currentDateObj.setMonth(currentDateObj.getMonth() + 1);
      let date = this.getFirstDate(currentDateObj);
      this.focus_cal = date;
      // this.$refs.calendar.next()
      this.START_DT = date.replace(/-/gi, "")
      this.END_DT = this.getLastDate(currentDateObj).replace(/-/gi, "")
      if(this.SCHED_TYPE != 'SHARE') {
        this.getAsSchedulerCalendarList();
      } else {
        this.getShareList();
      }
    },

    onEventClick(event) {
      console.log("onEventClick", event)
      //중복클릭(더블클릭) 방지.
      if(this.isClicking) {
        return
      }
      this.isClicking = true;
      setTimeout(() => {
        this.isClicking = false;
      }, 200);
      const flwDtlFullSnList = event.flw_dtl_full_sn && event.flw_dtl_full_sn != '' ? event.flw_dtl_full_sn.split(",") : [];
      const searchCondition = {SRCH_FROM:"OTHER", SELECT_ROW_YN: 'N', SELECT_ROW_DBL_YN: 'Y', FLW_DTL_FULL_SN_LIST: flwDtlFullSnList};
      let eventMessage = {
        data: {
          message : JSON.stringify(searchCondition)
        }
      };
      //window.opener.postMessage({message: JSON.stringify(searchCondition)})
      //this.$emit("sendDataToParent",  JSON.stringify(searchCondition))
      const eventBusName = "rowDblClickPop";
      const originTabId = "CSL_M0100";
      let parentInstance;

      if (window.opener && window.opener.parentVueInstance) {
        let m0100 = false;
        window.opener.parentVueInstance.mixin_parentSessionStorage();
        if(originTabId === JSON.parse(window.sessionStorage.getItem("vuex")).commonStore.active_tab.id) m0100 = true;

        //전화상담 메뉴 호출.
        if(!m0100) {
          parentInstance = window.opener.parentVueInstance;
          if (typeof parentInstance["mixin_set_active_tab"] === 'function') {
            parentInstance["mixin_set_active_tab"]({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'})
          }
        };
        setTimeout(() => {
          window.opener.parentVueInstance.mixin_parentSessionStorage(); //부모창 sessionStorage 변경 값 확인을 위해 재주입
          parentInstance = window.opener.parentVueInstance;
          //부모창의 이벤트 버스 호출
          if (typeof parentInstance["mixin_setParentEventBus"] === 'function') {
            parentInstance["mixin_setParentEventBus"](eventBusName, eventMessage);
          } else {
            this.showAlert({alertDialogToggle: true, msg: '팝업을 새로 호출 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
            return;
          }
        }, !m0100?1000:10);
      } else {
        this.showAlert({alertDialogToggle: true, msg: '팝업을 새로 호출 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
        return;
      }



    },

    changeSrchDeptId() {
      if(this.SRCH_DEPT_ID != "") {
        this.SCHED_TYPE = 'RSRV'
        this.VISIT_DEPT_ID = ''
        this.SRCH_FRM_CD = '';
        this.SRCH_FRM_NM = '';
        this.SRCH_CMPNY_EMP_CDS = '';
        this.SRCH_EMP_NMS = '';
      }
    },
    changeSchedType() {
      this.SRCH_FRM_CD = '';
      this.SRCH_FRM_NM = '';
      this.SRCH_CMPNY_EMP_CDS = '';
      this.SRCH_EMP_NMS = '';
      if(this.SCHED_TYPE != "RSRV") {
        this.SRCH_DEPT_ID = ''
      }
      if(this.SCHED_TYPE != "VISIT") {
        this.VISIT_DEPT_ID = ''
      }
    },

    getFirstDate(date) {
      date.setDate(1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad with 0 if necessary
      const day = String(date.getDate()).padStart(2, '0'); // Pad the day with 0 if necessary

      // Combine them into the desired format
      return `${year}-${month}-${day}`;
    },
    getLastDate(date) {
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad with 0 if necessary
      const day = String(date.getDate()).padStart(2, '0'); // Pad the day with 0 if necessary

      // Combine them into the desired format
      return `${year}-${month}-${day}`;
    },

    parseDateString(dateString) {
      const parts = dateString.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      return new Date(year, month, day);
    },

    //업체명 검색 다이얼로그 - 업체 선택 시,
    setFrm(item) {
      this.SRCH_FRM_NM = item.FRM_NM;
      this.SRCH_FRM_CD = item.FRM_CD;
      this.mixin_hideDialog('FindAsFrm')
    },

    //상담사 다이얼로그 - 상담사 선택 시,
    setCuslInfo(cuslInfo) {
      cuslInfo.map(item => {
        if( this.SRCH_CMPNY_EMP_CDS == '') {
          this.SRCH_CMPNY_EMP_CDS = item.EMP_NO;
          this.SRCH_EMP_NMS = item.USER_NM;
        } else {
          this.SRCH_CMPNY_EMP_CDS += "," + item.EMP_NO;
          this.SRCH_EMP_NMS += "," + item.USER_NM;
        }
      })

    },

    // 체크박스 사용 시 선택 이벤트
    submitDialog(){
      this.$refs.CompoFindCusl.submitData();
    },

    checkFindCusl() {
      if(this.SRCH_CMPNY_EMP_CDS != '') {
        this.showConfirmInfo({
          msg:'추가 상담사를 초기화 하시겠습니까?'
          , callYes: () => {
            this.SRCH_CMPNY_EMP_CDS = '';
            this.SRCH_EMP_NMS = '';
            this.closeAlert();
          }
          , callNo: this.closeAlert
        });
      } else {
        this.mixin_showDialog('FindCusl')
      }
    },


    //업체명 초기화
    checkFindFrm() {
      if(this.MGOF_NM != '') {
        this.showConfirmInfo({msg: '업체를 초기화 하시겠습니까?'
          , callYes : ()=> {
            this.SRCH_FRM_CD = '';
            this.SRCH_FRM_NM = '';
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })
      } else {
        this.mixin_showDialog('FindAsFrm')
      }
    },
  },
  mounted() {
  },
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuslInfo");
  },
  async created() {
    // 직원 정보 수신
    this.$eventBus.$on('setCuslInfo',(cuslInfo)=> {
      this.setCuslInfo(cuslInfo);
    });

    await this.getServerDate();
    await this.getDeptList();
    this.initSearchCondition();
    this.getAsSchedulerCalendarList();

  },
  computed: {
    computedCalendarTitle() {
      const title = this.$refs.calendar.title;
      let new_year = '';
      let new_month = '';
      let current = this.date.substr(8, 2);
      let select = this.focus_picker.substr(8, 2);

      let arrTitle = [];
      arrTitle = title.split(' ');

      if (arrTitle.length > 3) {
        if (arrTitle.length > 4) {
          if (current < 7 || select < 7) {
            new_year = arrTitle[4];
            new_month = arrTitle[3];
          } else {
            new_year = arrTitle[1];
            new_month = arrTitle[0];
          }
        } else {
          if (current < 7 || select < 7) {
            new_year = arrTitle[3];
            new_month = arrTitle[2];
          } else {
            new_year = arrTitle[3];
            new_month = arrTitle[0];
          }
        }
      } else {
        new_year = arrTitle[1];
        new_month = arrTitle[0];
      }
      return `${new_year}년 ${new_month}`;
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>