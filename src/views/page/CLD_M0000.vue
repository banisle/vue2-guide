<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- top title -->
      <div class="pl-sublayout-top">
        <div>
          <h1 class="pl-sublayout-top-h1">캘린더</h1>
        </div>
      </div>
      <!-- content -->
      <div class="pl-cols flex-grow-1">
        <!-- left -->
        <div class="is-col-fix is-vrt" style="width: 360px">
          <div class="pl-card">
            <v-btn
                class="pl-btn col-12 is-icon"
                @click="RegSchdl"
            >
              <span class="pl-icon20 edit-white"></span>
              일정쓰기
            </v-btn>
            <!-- DatePicker -->
            <div class="pl-calendar type-mini is-mt-m subheading">
              <v-date-picker
                  v-model="focus_picker"
                  no-title
                  color="#F0F4FF"
                  header-color="#F4F5FF"
                  @input="menu21 = false"
                  first-day-of-week="0"
                  locale="ko-KR"
                  :day-format="mixin_getDate"
                  scrollable
              ></v-date-picker>
            </div>
          </div>
          <v-divider class="mx-5"></v-divider>
          <!-- Schedule Type select -->
          <div class="pl-card">
            <v-list>
              <v-list-item-group
                  v-model="selectedItem"
                  class="pl-full-calendar-viewbtn"
              >
                <v-list-item
                    v-for="item in CAL_SE_GROUP"
                    @click="inputCalendar(item.SE_CD)"
                    :class="{'active' : isActive === 0}"
                >
                  <v-icon :class="`pl-icon20 ${item.SE_CLASS} mr-2`"></v-icon>
                  {{ item.SE_NAME }}
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
        <!-- right -->
        <div class="is-vrt">
          <!-- toolbar -->
          <div class="d-flex align-center py-2 pr-7">
            <!-- 날짜 -->
            <div>
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
                  class="pl-full-calendar-title">
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
            <div>
              <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="getAllSchdl()"
              ></compo-tooltip-btn>
            </div>
            <!-- 일,주,월간 선택 -->
            <div class="ml-auto">
              <v-btn-toggle
                  v-model="datePeriod"
                  mandatory
                  class="pl-btn-group">
                <v-btn
                    class="pl-btn"
                    @click="type='day'"
                >일간
                </v-btn>
                <v-btn
                    class="pl-btn"
                    @click="type='week'">주간
                </v-btn>
                <v-btn
                    class="pl-btn"
                    @click="type='month'">월간
                </v-btn>
              </v-btn-toggle>
            </div>
          </div>
          <div class="pl-card pl-full-calendar">
            <!-- full calendar -->
            <v-calendar
                ref="calendar"
                v-model="focus_cal"
                color="primary"
                :events="events"
                locale="ko-KR"
                :event-more="false"
                event-overlap-mode="stack"
                :day-format="getDay"
                :type="type"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
                @change="mixin_getDatePeriod"
            >
              <template #event="{ event }">
                <!-- 여기에서 표시 내용을 커스터마이징 -->
                <span class="ml-1 pt-5" v-if="event.SCHDL_SE_CD ==='HOLIDAY'">{{ ' ️  ' + event.name }}</span>
                <span class="ml-1" v-else> {{ `${event.start.substring(11, 16)} ${event.name}` }} </span>
              </template>
            </v-calendar>
          </div>
        </div>
      </div>
      <!--상세 모달 -->
      <v-dialog
          v-model="dialogShowSchdl"
          content-class="dialog-draggable"
          hide-overlay
      >
        <div class="draggable-area">
        </div>
        <compo-dialog
            :header-title="selectedEvent.name"
            @hide="mixin_hideDialog('ShowSchdl')"
        >
          <template slot="body">
            <div class="pl-form-inline-wrap vertical label-80">
              <div class="pl-form-inline">
              <span class="pl-label">
<!--                <v-icon size="20" color="#000" >mdi-account-circle-outline</v-icon>-->
                작성자
              </span>
                <div class="pl-desc">
                  {{ selectedEvent.USER_NM }}
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
<!--                <v-icon class="pl-icon20 calendar-date "></v-icon>-->
                일 시
              </span>
                <div class="pl-desc" v-if="!mixin_isEmpty(selectedEvent)">
                  {{ selectedEvent.start.substr(0, 16) }} ~ {{ selectedEvent.end.substr(0, 16) }}
                </div>
              </div>
              <div class="pl-form-inline" v-if="!mixin_isEmpty(selectedEvent.PLC)">
              <span class="pl-label">
<!--                <v-icon class="pl-icon20 calendar-place "></v-icon>-->
                장 소
              </span>
                <div class="pl-desc">
                  {{ selectedEvent.PLC }}
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
<!--                <v-icon class="pl-icon20 calendar-list "></v-icon>-->
                내 용
              </span>
                <div
                    class="pl-desc"
                    style="white-space: pre-line; word-break: break-all;"
                >
                  <v-textarea
                      class="pl-form is-noresize type-middle"
                      height="300px"
                      v-model="selectedEvent.CN"
                      :readonly="true"
                  ></v-textarea>
                  <!--                {{ selectedEvent.content }}-->
                </div>
              </div>
            </div>
          </template>
          <template slot="footer">
            <div class="pl-btn-wrap">
              <compo-tooltip-btn
                  v-if="selectedEvent.USER_ID === USER_ID"
                  TitleProp="수정"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 edit"
                  TooltipPositionProp="bottom"
                  @btnClick="()=>{
                    mixin_hideDialog('ShowSchdl')
                    mdfSchdl()
                  } "
              ></compo-tooltip-btn>
              <!-- 삭제 버튼 -->
              <compo-tooltip-btn
                  v-if="selectedEvent.USER_ID === USER_ID"
                  TitleProp="삭제"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 trash"
                  TooltipPositionProp="bottom"
                  @btnClick="delSchdlRtn"
              ></compo-tooltip-btn>
            </div>
            <!-- 닫기 버튼 -->
            <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('ShowSchdl')">닫기</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>

      <!-- 등록 모달 -->
      <v-dialog
          v-model="dialogRegSchdl"
          content-class="dialog-draggable"
          hide-overlay>
        <div class="draggable-area">
        </div>
        <compo-dialog
            :header-title="REG_YN==''?'일정 등록':'일정 수정'"
            @hide="[mixin_hideDialog('RegSchdl') ,closeBtn()]"
        >
          <!-- <compo-dialog
            header-title="일정 수정"
            @hide="closeBtn"
          > -->
          <template slot="body">
            <v-form ref="form">
              <p>등록 시 개인 또는 센터일정 캘린더를 잘 확인해 주시기 바랍니다.<br/>
                일정 내용을 입력하신 후 <strong>[저장] 버튼을</strong> 클릭 하십시오.</p>
              <!-- <div class="pl-form-inline-wrap vertical is-mt-m  "> -->
              <div class="pl-form-inline-wrap vertical label-100 ">
                <div class="pl-form-inline mt-5">
              <span class="pl-label">
                제목
              </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form is-lg type-middle"
                        v-model="TTL"
                        :rules="validateRules.TTL"
                        v-byte-counter="200"
                    />
                    <v-checkbox
                        class="pl-check"
                        label="중요"
                        v-model="ESNTL_YN"
                        input-value="false"
                    ></v-checkbox>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                장소
              </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form type-middle"
                        v-model="PLC"
                        v-byte-counter="300"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                일시
              </span>
                  <div class="pl-desc">
                    <div class="pl-calendar-range-form">
                      <compo-date-picker
                          DateType="dateTime"
                          :DateProp.sync="startDate"
                          :TimesProp.sync='startTime'
                          @update:DateProp="setBgngDt"
                          @update:TimesProp="setBgngDt"
                          v-model="BGNG_YMD"
                          :rules="validateRules.BGNG_YMD"
                      />
                      <span class="pl-unit">~</span>
                      <compo-date-picker
                          DateType="dateTime"
                          :DateProp.sync="endDate"
                          :TimesProp.sync="endTime"
                          @update:DateProp="setEndDt"
                          @update:TimesProp="setEndDt"
                          v-model="END_YMD"
                          :rules="validateRules.END_YMD"
                      />
                    </div>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                공개
              </span>
                  <div class="pl-desc">
                    <v-radio-group
                        v-model="RLS_YN"
                        row
                        class="pl-radio-group"
                        :disabled="radioGroupDisabled"
                    >
                      <v-radio
                          v-for="(item, index) in radioGroup"
                          :key="radioGroup[index].text"
                          :label="item.text"
                          :value="item.value"
                          class="pl-radio"
                      >
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                일정구분
              </span>
                  <div class="pl-desc">
                    <v-select
                        class="pl-form type-middle"
                        :items="CALD_CL_DROP"
                        placeholder="선택하세요"
                        v-model="SCHDL_SE_CD"
                        @change="setRadioBtn"
                        :rules="validateRules.SCHDL_SE_CD"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                설명
              </span>
                  <div class="pl-desc">
                    <v-textarea
                        class="pl-form is-noresize"
                        height="300px"
                        placeholder="내용을 입력하세요(최대 4000자)"
                        v-model="CN"
                        :rules="validateRules.CN"
                        :spellcheck="false"
                        v-byte-counter="4000"
                    ></v-textarea>
                  </div>
                </div>
              </div>
            </v-form>
          </template>
          <template slot="footer">
            <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('RegSchdl') ,closeBtn()]">닫기</v-btn>
            <v-btn class="pl-btn" @click="schdlSaveValidate">저장</v-btn>
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import {eventBus} from "@/store/eventBus.js";
import moment from "moment/moment";           //Event Bus

export default {
  name: "MENU_CLD_M0000", //name은 'MENU_' + 파일명 조합
  props: {
    TYPE: {
      type: String,
      default: "",
    },
  },
  components: {},

  data() {
    return {

      calType: null,

      COMM_CALD_CL: [], // 캘린더 공통코드
      CALD_CL_DROP: [], // 캘린더 공통코드 드롭박스 생성용

      scrhSchdl: '',
      selectedItem: 0, // 일정 보기 버튼 선택
      datePeriod: 2, // 일,주,월간 초기값

      CAL_SE_GROUP: [
        {SE_NAME: '전체 일정 보기', SE_CD: 'ALL', SE_CLASS: 'calendar-all-view'},
        {SE_NAME: '개인 일정 보기', SE_CD: 'PSSD', SE_CLASS: 'calendar-my-view'},
        {SE_NAME: '팀 일정 보기', SE_CD: 'TMSD', SE_CLASS: 'calendar-team-view'},
        {SE_NAME: '센터 일정 보기', SE_CD: 'CTSD', SE_CLASS: 'calendar-center-view'},
        {SE_NAME: '중요 일정 보기', SE_CD: 'ESNTL', SE_CLASS: 'calendar-point-view'},
      ],

      // mini
      // date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)+' '+(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(11, 8),
      date: moment().format('yyyy-MM-DD HH:mm:ss'),
      //date picker

      startDate: '',
      endDate: '',
      startTime: '',

      endTime: '',


      menu21: false,

      eventOverrides: {
        formatShort: 'D',
      },


      // full
      focus_cal: this.$moment(this.date).format('YYYY-MM-DD'),
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],

      focus_picker: '',

      dialogRegSchdl: false,
      dialogShowSchdl: false,

      regDialogTitle: '',

      radioGroupSelected: '',
      radioGroupDisabled: false,
      radioGroup: [
        {
          text: "공개",
          value: "Y"
        },
        {
          text: "비공개",
          value: "N",
        },
      ],

      schdlData: [], // 전체 일정 저장

      USER_AUTHRT_GROUP: '',   // 사용자 권한 체크

      // 일정 등록 데이터

      SCHDL_ID: '',
      USER_ID: '',
      USER_NM: '',
      TTL: '',          // 제목
      ESNTL_YN: false,    // 중요여부
      PLC: '',         // 장소
      BGNG_YMD: '',    // 시작일자
      END_YMD: '',     // 종료일자
      RLS_YN: 'N',      // 공개여부
      SCHDL_SE_CD: 'PSSD', // 일정구분코드
      CN: '',          // 내용
      REG_DT: '',      // 등록 날짜

      REG_YN: false,   // 등록/수정 구분

      valid: true,
      validateRules: {
        TTL: [
          v => !!v || '제목은(는) 필수 입력 항목입니다.'
        ],
        BGNG_YMD: [
          v => !!v || '시작일자 은(는) 필수 입력 항목입니다.'
        ],
        END_YMD: [
          v => !!v || '종료일자 은(는) 필수 입력 항목입니다.'
        ],
        SCHDL_SE_CD: [
          v => !!v || '캘린더 구분 은(는) 필수 입력 항목입니다. '
        ],
        CN: [
          v => (v || '').length <= 4000 || '0 ~ 4000 이내로 입력해 주세요.',
        ]
      },

      // ALERT 메세지
      MESSAGE: {
        CONFIRM: {
          REGIST: {
            alertDialogToggle: true,
            msg: '일정을 등록 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.regSchdlRtn,
            callNo: this.closeMsg
          },
          MODIFY: {
            alertDialogToggle: true,
            msg: '일정을 수정 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.mdfSchdlRtn,
            callNo: this.closeMsg
          },
          DELETE: {
            alertDialogToggle: true,
            iconClass: 'is-info',
            type: 'confirm',
            msg: '일정을 삭제 하시겠습니까?',
            callYes: this.delSchdlData,
            callNo: this.closeMsg
          }
        },
        ALERT: {
          CHK_TTL: {alertDialogToggle: true, msg: '제목을 입력하세요.', iconClass: 'is-info', type: 'default'},
          CHK_BGNG_YMD: {alertDialogToggle: true, msg: '시작 일자를 선택하세요.', iconClass: 'is-info', type: 'default'},
          CHK_END_YMD: {alertDialogToggle: true, msg: '종료 일자를 선택하세요.', iconClass: 'is-info', type: 'default'},
          INVALID_YMD: {alertDialogToggle: true, msg: '유효하지 않은 기간입니다.', iconClass: 'is-info', type: 'default'},
          CHK_SECD: {alertDialogToggle: true, msg: '일정 구분을 선택하세요.', iconClass: 'is-info', type: 'default'},
          ERR_GET_SCHDL: {alertDialogToggle: true, msg: '일정 정보를 가져올 수 없습니다.', iconClass: 'is-info', type: 'default'},
          SCHDL_COMPLETE: {alertDialogToggle: true, msg: '처리 되었습니다.', iconClass: 'is-done', type: 'default'},
          SCHDL_SAVE_FAIL: {alertDialogToggle: true, msg: '저장에 실패 했습니다.', iconClass: 'is-info', type: 'default'},
          SCHDL_DEL_FAIL: {alertDialogToggle: true, msg: '삭제할 수 없습니다.', iconClass: 'is-info', type: 'default'},
          SELECT_DATE: {
            alertDialogToggle: true,
            msg: '종료 일자는 시작 일자보다 빠를 수 없습니다.',
            iconClass: 'is-info',
            type: 'default'
          },
          NONE_AUTHRT: {alertDialogToggle: true, msg: '권한이 없습니다.', iconClass: 'is-info', type: 'default'},

        },
        TOAST: {
          SUCCESS: {
            msg: '정상 처리 되었습니다.',
            class: 'success',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },
          SCHDL_DEL_FAIL: {
            msg: '삭제 중 오류가 발생했습니다.',
            class: 'warning',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },
          SELECT_DATE: {
            msg: '종료 일자는 시작 일자보다 빠를 수 없습니다.',
            class: 'warning',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },
          CHK_BGNG_YMD: {
            msg: '시작 일자를 선택하세요.',
            class: 'warning',
            hasToastIcon: true,
            icon: 'mdi-checkbox-marked-circle',
            time: 2000
          },

        },
      },
      isActive: 0,
      calendarLocale: {
        weekdays: ["일", "월", "화", "수", "목", "금", "토"],
        firstDayOfWeek: 0,
      },
      isBtnClick1: false,
      isBtnClick2: false,
    }
  },
  watch: {
    // SCHDL_SE_CD() {
    //   if (this.SCHDL_SE_CD === 'CTSD') {
    //     this.RLS_YN = 'Y';
    //   }
    // },
    //date picker 날짜 변경 시 calendar 포커스 변경
    focus_picker() {
      this.focus_cal = this.focus_picker;
    },
    // calendar 포커스 변경 시 date picker
    focus_cal() {
      this.getAllSchdl()
      this.focus_picker = this.focus_cal;
      this.startDate = this.focus_cal;
      this.setBgngDt();
      this.endDate = this.focus_cal;
      this.setEndDt();
    },
    // 일정 정보 변경 되면 캘린더 업데이트
    schdlData() {
      this.inputCalendar('ALL');
    },
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
  //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
  created() {
    // this.getServerDate();
    this.initRegData();
    // console.log(this.date)
    // 공통코드
    this.loadCommCd();
    //User_id
    this.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;
    this.USER_NM = this.$store.getters["userStore/GE_USER_ROLE"].userNm;
    this.USER_AUTHRT_GROUP = this.$store.getters["userStore/GE_USER_ROLE"].atrtGroupNm;
    //  일정 등록 데이터 초기화
    this.initRegData();
    // 일정 리스트
    this.getAllSchdl();
    this.$eventBus.$on("calType", (se) => {
      this.setItem(se)
      this.inputCalendar(se)
    });
  },
  mounted() {
  },

  methods: {
    showSlide(slide, tabNum, injectionObj) {
      this.$eventBus.$emit('showVSlideXreverse', {slide: slide, tabNum: tabNum, injectionObj: injectionObj})
    },
    // 캘린더 일자 표시
    getDay(date) {
      const day = date["day"]
      const day_num = Number(day);
      return day_num;
    },
    async loadCommCd() {
      this.COMM_CALD_CL = await this.mixin_common_code_get_all(['CALD_CL']);
      this.CALD_CL_DROP = this.mixin_common_code_get(this.COMM_CALD_CL, 'CALD_CL');
    },
    // 일정 등록 데이터 초기화
    initRegData() {

      if (this.mixin_isEmpty(this.focus_cal)) {
        this.startDate = this.date.substr(0, 10);
        this.endDate = this.date.substr(0, 10);
      } else {
        this.endDate = this.focus_cal; // 현재 달력 포커스 날짜로 초기화
        this.startDate = this.focus_cal; // 현재 달력 포커스 날짜로 초기화
      }
      // 현재시간 + 1시간
      let tempDate = this.mixin_convertDate(this.$moment(this.date).add(1, 'hour').format("YYYYMMDDHHmmss"), 'yyyy-MM-dd HH:mm:ss')

      this.startTime = this.date.substr(11, 5);
      this.endTime = tempDate.substr(11, 5);
      this.setBgngDt();
      this.setEndDt();

      this.TTL = '';          // 제목
      this.ESNTL_YN = false;    // 중요여부
      this.PLC = '';         // 장소
      this.RLS_YN = 'N';      // 공개여부
      this.SCHDL_SE_CD = 'PSSD'; // 일정구분코드
      this.CN = '';          // 내용
      this.SCHDL_ID = '';
      this.REG_YN = false;
    },
    viewDay({date}) {
      this.focus_cal = date;
      this.type = 'day';
      this.datePeriod = 0;
    },
    setToday() {
      this.focus_cal = this.date.substr(0, 10);
    },
    // 다음 달
    prev(e) {
      this.$refs.calendar.prev();
    },
    // 이전 달
    next() {
      this.$refs.calendar.next();
    },
    showEvent({nativeEvent, event}) {
      if (event.SCHDL_SE_CD === 'HOLIDAY') {
        let injectObj = {
          SRCH_APLCN_YMD: event.start.replaceAll('-', '').replaceAll(':', '').substring(0, 8),
          SRCH_WKATTD_ARTCL_CLSF_CD: event.WKATTD_ARTCL_CLSF_CD,
          title: '휴가자 현황',
          CAl_YN: true
        }
        this.showSlide('slideTodayWkattd', null, injectObj)
      } else {
        if (!this.dialogShowSchdl) {
          this.selectedEvent = event;
        }
        this.mixin_showDialog('ShowSchdl');
      }
    },
// 전체 일정 가져오기
    async getAllSchdl() {
      // console.log("🕐 > ", this.focus_cal)
      this.schdlData = [];

      let postParam = {
        SRCH_YM: this.focus_cal.substring(0, 7).replaceAll('-', ''),
      }
      let headParam = {
        head: {
          ns: 'palette3.schedule.dao.ScheduleMapper',
        }
      };
      let response = await this.common_postCall('/api/biz/common/select/selectScheduleList', postParam, headParam);
      if (response.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ALERT.ERR_GET_SCHDL);
      } else {
        this.schdlData = response.DATA;
        this.inputCalendar('ALL');
      }
    },
    setRadioBtn() {
      if (this.SCHDL_SE_CD !== 'PSSD') {
        this.RLS_YN = 'Y';
        this.radioGroupDisabled = true;
      } else {
        this.RLS_YN = 'N';
        this.radioGroupDisabled = false;
      }
    },
// 캘린더에 일정 넣기
    setItem(value) {
      this.selectedItem = this.CAL_SE_GROUP.findIndex(item => item.SE_CD === value)
    },
    inputCalendar(value) {
      const events = [];
      let holidayNm = '';
      let holidayCnt = 0;
      let holidays = _.cloneDeep(this.schdlData);
      if (this.schdlData.length > 0) {
        this.schdlData.map(item => {
          if (item.SCHDL_SE_CD != 'HOLIDAY') {
            item.name = item.ESNTL_YN === 'Y' ? '⭐ ' + item.TTL : item.TTL;

            item.start = this.ChnDateForm(item.BGNG_YMD.replaceAll('-', '').replaceAll(':', ''));
            item.end = this.ChnDateForm(item.END_YMD.replaceAll('-', '').replaceAll(':', ''));
            switch (item.SCHDL_SE_CD) {
              case 'PSSD' :
                item.color = '#FFB22C'
                break;
              case 'TMSD' :
                item.color = '#8EA3A6'
                break;
              case 'CTSD' :
                item.color = '#CA7373'
                break;
            }
            item.regYn = true
            switch (value) {
              case 'ALL':
                events.push(item);
                break;
              case 'PSSD':
                if (item.SCHDL_SE_CD ==='PSSD') {
                  events.push(item);
                }
                break;
              case 'CTSD':
                if (item.SCHDL_SE_CD === 'CTSD') {
                  events.push(item);
                }
                break;
              case 'TMSD':
                if (item.SCHDL_SE_CD === 'TMSD') {
                  events.push(item);
                }
                break;
              case 'ESNTL':
                if (item.ESNTL_YN === 'Y') {
                  events.push(item);
                }
                break;
            }
          }
        })
      }
      if (value === 'ALL' && !this.mixin_isEmpty(holidays.filter(item => item.SCHDL_SE_CD === 'HOLIDAY'))) {
        let grouped = {};
        holidays.filter(item => item.SCHDL_SE_CD === 'HOLIDAY').forEach(item => {
          // console.log('🤦‍♀️🤦‍♀️🤦‍♀️🤦‍♀️ . ', item)
          const {BGNG_YMD, USER_NM} = item;

          if (!grouped[BGNG_YMD]) {
            // reg_dt가 처음 등장한 경우, 새로운 그룹을 생성
            grouped[BGNG_YMD] = {BGNG_YMD, USER_NM, count: 0};
          }

          // 그룹에 해당하는 count를 증가
          grouped[BGNG_YMD].count++;
        });
        console.log("grouped", grouped)
        const result = Object.values(grouped);
        result.map(obj => {
          events.push({
            start: this.ChnDateForm(obj.BGNG_YMD + '080000'),
            end: this.ChnDateForm(obj.BGNG_YMD + '090000'),
            name: obj.count - 1 >= 1 ? '🚗 ' + obj.USER_NM + ' 외 ' + (Number(obj.count) - 1) + '명' : '🚗 ' + obj.USER_NM,
            color: '#605EA1',
            SCHDL_SE_CD: 'HOLIDAY',
            WKATTD_ARTCL_CLSF_CD: obj.WKATTD_ARTCL_CLSF_CD,
          });
        })
      }
      this.events = events;
    },
// 일정쓰기 버튼 클릭 시 모달 OPEN
    RegSchdl() {
      this.mixin_showDialog('RegSchdl')
      // this.initRegData();
    },
    closeBtn() {
      this.resetValidation();           // 등록/수정 모달이 닫히면 validation check 초기화
      this.initRegData();               // 등록/수정 모달이 닫히면 바인딩 된 데이터 초기화
    },
// 등록/수정 창 데이터 초기화
    inputEventData() {
      this.TTL = this.selectedEvent.ESNTL_YN ? this.selectedEvent.name.replace(/^⭐\s*/, '') : this.selectedEvent.name;          // 제목
      this.ESNTL_YN = '';
      this.ESNTL_YN = this.selectedEvent.ESNTL_YN === 'Y' ? true : false;    // 중요여부
      this.PLC = this.selectedEvent.PLC;         // 장소
      this.BGNG_YMD = this.selectedEvent.start;    // 시작일자
      this.startDate = this.selectedEvent.start.substr(0, 10);
      this.startTime = this.selectedEvent.start.substr(11, 5);
      this.END_YMD = this.selectedEvent.end;     // 종료일자
      this.endDate = this.selectedEvent.end.substr(0, 10);
      this.endTime = this.selectedEvent.end.substr(11, 5);
      // console.log("this.selectedEvent.start",this.selectedEvent.end)
      this.RLS_YN = this.selectedEvent.RLS_YN;      // 공개여부
      this.SCHDL_SE_CD = this.selectedEvent.SCHDL_SE_CD; // 일정구분코드
      this.CN = this.selectedEvent.CN;          // 내용
      this.SCHDL_ID = this.selectedEvent.SCHDL_ID;
      this.REG_YN = this.selectedEvent.regYn;
    },
    mdfSchdl() {
      this.inputEventData();
      if (this.selectedEvent.SCHDL_SE_CD === 'PSSD') {            // 개인일정인 경우 제한없이 등록/수정 모달 OPEN
        this.mixin_showDialog('RegSchdl')
      } else if (this.selectedEvent.SCHDL_SE_CD === 'CTSD' || this.selectedEvent.SCHDL_SE_CD === 'TMSD') {      // 센터일정인 경우 로그인한 사용자의 권한 체크 해서 '상담사'인 사용자는 접근불가
        if (this.computedUserDetailType === 'MANAGER') {
          this.showToastCaution({msg: "수정 권한이 없습니다."})
        } else {
          this.mixin_showDialog('RegSchdl')
        }
      }
      this.selectedOpen = false;
      // this.mixin_showDialog('RegSchdl');
    },
    //  CONFIRM alert창에서 취소를 누르면 alert 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
    // 저장 시 전송데이터 비었는지 체크
    schdlSaveValidate() {
      if (this.validate()) {
        if (this.mixin_isEmpty(this.BGNG_YMD)) {
          this.showAlert(this.MESSAGE.ALERT.CHK_BGNG_YMD);
        } else if (this.mixin_isEmpty(this.END_YMD)) {
          this.showAlert(this.MESSAGE.ALERT.CHK_END_YMD);
        } else if (this.BGNG_YMD.length < 19 || this.END_YMD.length < 19) {
          this.showAlert(this.MESSAGE.ALERT.INVALID_YMD);
        } else {
          if (this.REG_YN == true) {                            // 일정 등록 여부를 확인 해서 REGIST와 MODIFY로 분기
            if (this.chkDate()) {
              this.showAlert(this.MESSAGE.CONFIRM.MODIFY);
            }
          } else {
            if (this.chkDate()) {
              this.showAlert(this.MESSAGE.CONFIRM.REGIST);
            }
          }
        }
      }
    },

    // 저장/수정 form valiate 체크
    validate() {
      return this.$refs.form.validate();
    },

    // 저장/수정 form validate reset
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    // 신규 일정 등록
    regSchdlRtn() {
      this.regSchdlData('reg');
    },
    // 기존 일정 수정
    mdfSchdlRtn() {
      this.regSchdlData('mdf')
    },

    // 일정 저장(등록여부(REG_YN)에 따라 insert/update 분기)
    regSchdlData(val) {

      let URLData = '';
      let postParam = {};
      let headParam = {};

      switch (val) {

        case 'reg':

          URLData = "/api/schedule/insert"

          postParam = {
            // SCHDL_ID : '',
            USER_ID: this.USER_ID,
            TTL: this.TTL,                                                       // 제목
            ESNTL_YN: this.ESNTL_YN === true ? 'Y' : 'N',                          // 중요 여부
            BGNG_YMD: this.ChnDateFormToNum(this.BGNG_YMD),                       // 시작 일자
            END_YMD: this.ChnDateFormToNum(this.END_YMD),                         // 종료 일자
            SCHDL_SE_CD: this.SCHDL_SE_CD,                                         // 일정 구분 코드
            RLS_YN: this.RLS_YN,                                                 // 공개 여부
            PLC: this.PLC,                                                        // 장소
            CN: this.CN,                                                          // 내용
          };

          headParam = {
            head: {
              URL: "api.schedule",
              SERVICE: "api.schedule.insert",
              METHOD: "regist",
              ASYNC: 'false',
              TYPE: "BIZ_SERVICE",
            }
          }
          break;
        case 'mdf':
          URLData = "/api/schedule/update"

          postParam = {
            SCHDL_ID: this.SCHDL_ID,
            USER_ID: this.USER_ID,
            TTL: this.TTL,
            ESNTL_YN: this.ESNTL_YN === true ? 'Y' : 'N',
            PLC: this.PLC,
            BGNG_YMD: this.ChnDateFormToNum(this.BGNG_YMD),
            END_YMD: this.ChnDateFormToNum(this.END_YMD),
            RLS_YN: this.RLS_YN,
            SCHDL_SE_CD: this.SCHDL_SE_CD,
            CN: this.CN,
          }
          headParam = {
            head: {
              URL: "api.schedule",
              SERVICE: "api.schedule.update",
              METHOD: "modify",
              ASYNC: 'false',
              TYPE: "BIZ_SERVICE",
            }
          }
          break;
      }

      this.$api
          .post(URLData, postParam, headParam)
          .then((response) => {
            // this.showAlert(this.MESSAGE.ALERT.SCHDL_COMPLETE);
            this.showToast(this.MESSAGE.TOAST.SUCCESS);
            this.closeMsg();
            this.mixin_hideDialog('RegSchdl');
            this.initRegData();                                     // 등록데이터 초기화
            this.resetValidation();                                 // validation check 초기화
            this.getAllSchdl();                                     // 전체 일정 불러오기
          })
          .catch((err) => {
            this.showAlert(this.MESSAGE.ALERT.SCHDL_SAVE_FAIL);
          })

    },

    // 일정 삭제 CONFIRM ALERT
    delSchdlRtn() {

      this.inputEventData();

      if (this.selectedEvent.SCHDL_SE_CD === 'PSSD') {               // 개인일정인 경우 제한없이 등록/수정 모달 OPEN
        this.showConfirmCaution({msg: '일정을 삭제 하시겠습니까?', callYes: this.delSchdlData, callNo: this.closeMsg})
      } else if (this.selectedEvent.SCHDL_SE_CD === 'CTSD' || this.selectedEvent.SCHDL_SE_CD === 'TMSD') {
        // 센터일정 또는 팀일정인 경우 로그인한 사용자의 권한 체크 해서 '상담사'인 사용자는 접근불가
        if (this.computedUserDetailType === 'MANAGER') {
          this.showAlertCaution({msg: '권한이 없습니다.'})
          this.initRegData();                                   // 등록/수정 모달에 저장한 선택 일정 데이터 초기화
        } else {
          this.showConfirmCaution({msg: '일정을 삭제 하시겠습니까?', callYes: this.delSchdlData, callNo: this.closeMsg})
        }
      }
    },

// 일정 삭제 API CALL

    delSchdlData() {

      let URLData = '/api/schedule/delete';
      let postParam = {
        USER_ID: this.USER_ID,
        SCHDL_ID: this.SCHDL_ID,
      }

      let headParam = {
        head: {
          URL: "api.schedule",
          SERVICE: "api.schedule.delete",
          METHOD: "delete",
          ASYNC: 'false',
          TYPE: "BIZ_SERVICE",
        }
      }
      this.$api
          .post(URLData, postParam, headParam)
          .then((response) => {
            // this.showAlert(this.MESSAGE.ALERT.SCHDL_COMPLETE);
            this.showToast(this.MESSAGE.TOAST.SUCCESS);
            this.closeMsg();
            this.mixin_hideDialog('ShowSchdl')
            this.initRegData();
            this.getAllSchdl();
          })
          .catch((err) => {
            this.showToast(this.MESSAGE.TOAST.SCHDL_DEL_FAIL);
          })


    },

    chkUserAuthrt() {
      if (this.selectedEvent.SCHDL_SE_CD === 'CTSD' && this.USER_AUTHRT_GROUP === '상담사') {
        this.showAlert(this.MESSAGE.ALERT.NONE_AUTHRT);
        return false;
      } else {
        return true;
      }
    },

    // 날짜변환 : String(YYYYMMDDHHmmss) to String(YYYY-MM-DD HH:mm:ss)
    ChnDateForm(dateString) {
      if (dateString.length < 10) {
        dateString + '000000'
      }
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

    // 시작 날짜 변환 : String(YYYY:MM:DD hh:mm:ss AM/PM) to String(YYYYMMDDHHmmss)
    ChnDateFormToNum(dateString) {
      let year = dateString.slice(0, 4);
      let month = dateString.slice(5, 7);
      let day = dateString.slice(8, 10);
      let hour = dateString.slice(11, 13);
      let minute = dateString.slice(14, 16);
      let second = dateString.slice(17, 19);
      if (second.length == 0) {
        second = '00';
      }

      // Format the date as "YYYYMMDDHHmmss" string
      const formattedDate = `${year}${month}${day}${hour}${minute}${second}`;

      return formattedDate;
    },

    // 시작 날짜 변환 (기본적인 포맷은 YYYY-MM-DD HH:mm:ss 이고, api 파라미터로 보낼 때 YYYYMMDDHHmmss로 변환)
    setBgngDt(data) {
      let cvtDT = '';
      cvtDT = this.startDate + ' ' + this.startTime + ':00'       // date-picker 에서 YYYY-MM-DD HH:mm 까지만 나오기 때문에 :00(초)를 붙여줌
      this.BGNG_YMD = '';
      this.BGNG_YMD = cvtDT;
    },

    // 종료 날짜 변환 : String(YYYY:MM:DD hh:mm:ss AM/PM) to String(YYYYMMDDHHmmss)
    setEndDt(data) {
      let cvtDT = '';
      cvtDT = this.endDate + ' ' + this.endTime + ':00';
      this.END_YMD = '';
      this.END_YMD = cvtDT;
      // this.chkDate();
    },

    // 시작,종료 일자 check : 시작 일자가 종료 일자보다 앞서면 ALERT창으로 경고
    chkDate() {
      if (!this.mixin_isEmpty(this.BGNG_YMD) && !this.mixin_isEmpty(this.END_YMD)) {

        if (Number(this.ChnDateFormToNum(this.BGNG_YMD)) > Number(this.ChnDateFormToNum(this.END_YMD))) {

          // this.showAlert(this.MESSAGE.ALERT.SELECT_DATE)
          this.showToast(this.MESSAGE.TOAST.SELECT_DATE);
          return false;
        } else {
          return true;
        }

      } else if (this.mixin_isEmpty(this.BGNG_YMD)) {
        // this.showAlert(this.MESSAGE.ALERT.CHK_BGNG_YMD)
        this.showToast(this.MESSAGE.TOAST.CHK_BGNG_YMD);
        return false;
      }
    },
  }
  ,

}
</script>

<style lang="scss" scoped>

</style>
