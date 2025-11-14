<template>
  <div class="pl-examSheet-wrap">
    <div class="pl-examSheet">
      <!-- title  -->
      <h1 class="pl-examSheet-title">
        <img src="@/assets/img/lhcs_white.png" alt="lh주거복지" style="height: 30px;">
        <span>{{qstnPaperData.EVAL_TITLE}}</span>
        <div class="pl-examSheet-timewrap">
          <div class="d-flex align-center">
            <v-icon class="pl-icon20 timer-white"></v-icon>
            <div class="ml-1" style="line-height: 1.1;">남은 시간</div>
          </div>
          <span class="pl-examSheet-timewrap-time ml-2 font-decimal"> {{ formattedTime }} </span>
          <!-- 닫기 -->
          <!--v-btn
            @click="close()"
            dark
            min-width="30"
            height="30"
            class="pl-tooltip-btn pl-dialog-header-close ml-2"
            >
            <v-icon
              small
              class="pl-icon20 dialog-close">
            </v-icon>
          </!--v-btn -->
        </div>
      </h1>
      <!-- sheet -->
      <div class="pl-cols" style="height: calc(100vh - 145px)">
        <div class="">
          <div class="pl-examSheet-paper pl-scroll-body">
            <div v-for="item, index in this.paperPreviewData_" :key="item.id">
              <!-- 제목  {{ index + 1 }} -->
              <div class="d-flex pl-examSheet-paper--title">
                <strong style="flex: 0 0 35px;"> {{item.EVAL_QSTN_SORT}}. </strong>
                <strong style="word-break: keep-all;" v-html="restoreXSS_CrossEditor( item.QSTN_CNTNT)"></strong>
              </div>

              <!-- 문제 보기: 주관식 -->
              <template v-if="item.QSTN_TYPE === 'D'">
                <div class="ml-8 is-mt-m">
                  <v-text-field
                    v-model="item.ANSW"
                    class="pl-form type-middle"
                    style="width: calc(100% - 12px);"
                    :disabled="isExamLocked"
                    @input="handleInputEval(item)"
                  ></v-text-field>
                </div>
              </template>
              <!-- 문제 보기: 객관식: -->
              <template v-else-if="item.QSTN_TYPE === 'S'">
                <!-- 문제 보기: 객관식: 단일체크 -->
                <template v-if="item.ANSW_TYPE === 'ISMHEVANSS001'">
                  <ol class="pl-examSheet-paper--example">
                    <v-radio-group
                        tag="li"
                        class="pl-examSheet-paper--example"
                        v-model="item.radioGroupSelected">
                        <v-radio
                            v-for="(q, qindex) in item.EXMPLIST"
                            :key="item.EXMPLIST[qindex].EXMP_WORD"
                            :label="q.EXMP_WORD"
                            :value="q.EXMP_SORT_NO-1"
                            :class="`pl-radio mb-0 ml-3 ${qindex !== 0 ? 'mt-4' : ''}`"
                            :disabled="isExamLocked"
                            @click="handleInputEvalType_(item, q)"                            
                            >
                            <template v-slot:label>
                                <span
                                :style="qindex + 1 === Number(item.ANSW) ? 'color: #fff; background: #333;' : ''"
                                style="margin: 3px 0 0 0;"
                                class="pl-examSheet-paper--example-num ">{{ qindex + 1}}</span>
                                <span class="ml-2" style="font-size: 16px;">{{ q.EXMP_WORD }}</span>
                            </template>
                        </v-radio>
                    </v-radio-group>
                  </ol>
                </template>
                <!-- 문제 보기: 객관식: 다중체크 -->
                <template v-else>
                    <ol class="pl-examSheet-paper--example">
                        <li
                            v-for="q,qindex in item.EXMPLIST"
                            :key="q.id"
                            class="d-flex ml-4 align-start">
                            <v-checkbox
                                v-model="q.CHK"
                                class="hover-light-bg"
                                :disabled="isExamLocked"
                                @click="handleInputEvalType(item)"
                            >
                            <template v-slot:label>
                                <span
                                :style="q.CHK ? 'color: #fff; background: #333;' : ''"
                                style="margin: 3px 0 0 0;"
                                class="pl-examSheet-paper--example-num ">{{ qindex + 1}}</span>
                                <span class="ml-2">{{ q.EXMP_WORD }}</span>
                            </template>
                            </v-checkbox>
                        </li>
                    </ol>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- right -->
        <div class="is-col-fix pl-examSheet-answer" >
          <div class="pl-examSheet-answer--title">
            <div class="d-flex"><strong style="flex: 0 0 100px">시험시간</strong> <span>
              {{qstnPaperData.START_TIME}} ~ {{qstnPaperData.END_TIME}} ({{qstnPaperData.EVAL_TIME}}분)</span></div>
            <div class="d-flex"><strong style="flex: 0 0 100px">응시자</strong> <span>{{qstnPaperData.USER_NM}}</span></div>
          </div>
          <!-- correct list -->
          <div class="pl-examSheet-answer--list list-fade-effect">
            <div
              class="d-flex align-center"
              v-for="item in this.paperEvalData"
              :key="item.EVAL_QSTN_SORT">
              <div class="is-bg-light pa-3 text-center is-border-right" style="flex: 0 0  50px;">
                {{ item.EVAL_QSTN_SORT }}
              </div>
              <!--  -->
              <template >
                <v-text-field
                    v-model="item.ANSW"
                    class="pl-form ml-4 is-ellips is-trans"
                    style="pointer-events: none"
                    readonly
                  ></v-text-field>
                  <!--span class="ml-2 is-ellips">{{ item.AWSW }}</!--span-->
              </template>

            </div>
          </div>
          <!-- correct list end -->
          <div class="mt-auto px-5 py-5">
            <v-btn class="pl-btn is-esp" style="width: 100%; height: 50px; font-size: 20px;"
              :disabled="isExamLocked"
              @click="submitExam_confirm('A')">답안지 제출</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { indexOf } from 'lodash';

export default {
  name: 'QTM_M0100_TEST_EXAM', //평가 시험  ( 사용자 )
  components: {
  },
  props: {
    qstnPaperData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      // info
      TEST_TIME: '08:40 ~ 05:55 (15분)',
      USER_NAME: '우성아 ',
      SELECT_LIST: [],
      preview_mode: false,

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          DATA_NULL : {alertDialogToggle: true, msg: '평가 정보가 없습니다.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          MIN_5: {  msg: '5분후에 평가가 종료 됩니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          , REG_SUCCESS: {  msg: '평가 시험 정보가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          , NON_START: {  msg: '평가 시험 정보가 시작전입니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          , END_EVAL: {  msg: '시험 시간이 종료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },

      },
      searchParams:{
        CENTER_ID: "",
        USER_ID: "",
      },

      // 문항
      paperPreviewData: [],
      paperPreviewData_ : [],
      paperEvalData: [],

      //평가지 기본 정보
      evalTestInfo: {},
      evalDbTimeInfo: {},

      // 타이머 처리용
      startTime: null,
      endTime: null,
      currentTime: null,
      isTimerActive: false,
      isExamLocked: false,
      message: '',
      timer: null,
      currentTimeInterval: null,
      alertGiven: false,
    }
  },
  methods: {


    // 주관식 입력시
    handleInputEval(item){
      const findRowIndex = this.paperEvalData.findIndex(
          (rowItem) => rowItem.QSTN_NO === item.QSTN_NO,
      );
      if (findRowIndex > -1) {
        this.$set(this.paperEvalData, findRowIndex, item);
      } else {
         this.paperEvalData.push(item);
      }
      this.submitExam('C');
    },

    // 객관식 입력시 다중
    handleInputEvalType(item){
      const findRowIndex = this.paperEvalData.findIndex(
          (rowItem) => rowItem.QSTN_NO === item.QSTN_NO,
      );
      if (findRowIndex > -1) {
        const selectedAnswers = item.EXMPLIST
          .filter(item => item.CHK)
          .map(item => item.EXMP_SORT_NO);
        item.ANSW = selectedAnswers.join(',');
        this.$set(this.paperEvalData, findRowIndex, item);
      } else {
        this.paperEvalData.push(item);
      }
      this.submitExam('C');
    },

    // 객관식 입력시 단일
    handleInputEvalType_(item, answKist){
      const findRowIndex = this.paperEvalData.findIndex(
          (rowItem) => rowItem.QSTN_NO === item.QSTN_NO,
      );
      if (findRowIndex > -1) {
        item.ANSW = answKist.EXMP_SORT_NO;
        this.$set(this.paperEvalData, findRowIndex, item);
      } else {
        this.paperEvalData.push(item);
      }
      this.submitExam('C');
    },

    // 재정렬
    parseDataSet() {
        const outputData = [];
        const questionMap = {};
        this.paperPreviewData.forEach(item => {
        const questionId = item.QSTN_NO;

            if (!questionMap[questionId]) {
                questionMap[questionId] = {
                    INDEX_: null,
                    QSTN_SORT: item.QSTN_SORT,   // 문제 번호  ( 1, 2, 3,)
                    QSTN_LEVEL: item.QSTN_LEVEL,
                    TOT_SCORE: item.TOT_SCORE,   // 총점
                    QSTN_CNTNT: item.QSTN_CNTNT,  // 문제 제목
                    PAPER_TITLE: item.PAPER_TITLE,
                    QSTN_SCORE: item.QSTN_SCORE,  // 문제 별 배점
                    QSTN_TYPE: item.QSTN_TYPE,   // 주관식 객관식
                    EXMP_CNT: item.EXMP_CNT,     // 객관식일 경우 보기 개수
                    ANSW_TYPE: item.ANSW_TYPE,   // 단일 , 다중 선택
                    //QSTN_ANSW: item.QSTN_ANSW,   // 정답 정보
                    QSTN_CNT: item.QSTN_CNT,   // 문제 총 개수
                    QSTN_NO: questionId,        // 문제 ID ( SEQ )
                    EXAM_CATE_CD : item.EXAM_CATE_CD,
                    ANSW: item.ANSW,  // 사용자 주관식 , 객관식 답변 저장
                    radioGroupSelected: null,
                    EVAL_QSTN_SORT : item.EVAL_QSTN_SORT,
                    EVAL_DSTN_NO: item.EVAL_DSTN_NO,
                    ANSW_SEQ_NO: item.ANSW_SEQ_NO,
                    EXMPLIST: []   // 객관식일 경우  보기 정보 리스트
                };
            }

            questionMap[questionId].EXMPLIST.push({                  // 보기 정보 리스트
                CHK: false,  // 체크박스 , radio 처리용
                EXMP_SORT_NO: item.EXMP_SORT_NO,   // 보기 번호
                EXMP_WORD: item.EXMP_WORD, // 보기 제목
            });
        });

        Object.values(questionMap).forEach(question => {            
            if(question.QSTN_TYPE == 'S'){
                const correctAnswers = question.ANSW.split(',').map(answer => answer.trim());
                question.EXMPLIST.forEach(exm => {                    
                    const exmpSortNoStr = exm.EXMP_SORT_NO.toString();
                    if (correctAnswers.includes(exmpSortNoStr)) {
                        exm.CHK = true;                        
                    }else{
                        exm.CHK = false;
                    }
                });
            }
        });

        for (const question of Object.values(questionMap)) {
            outputData.push(question);
        }

        this.paperPreviewData_ = [];
        this.paperPreviewData_ = outputData;
        this.parseAnswDataSet();
    },

    parseAnswDataSet() {
        const outputDataAnsw = [];
        const questionMapAnsw = {};
        this.paperPreviewData_.forEach(item => {
        const questionId = item.QSTN_NO;

            if (!questionMapAnsw[questionId]) {
                questionMapAnsw[questionId] = {
                    QSTN_SORT: item.QSTN_SORT,
                    TOT_SCORE: item.TOT_SCORE,
                    QSTN_SCORE: item.QSTN_SCORE,
                    QSTN_TYPE: item.QSTN_TYPE,
                    EXMP_CNT: item.EXMP_CNT,
                    ANSW_TYPE: item.ANSW_TYPE,
                    QSTN_ANSW: item.QSTN_ANSW,
                    QSTN_CNT: item.QSTN_CNT,
                    QSTN_NO: questionId,
                    PAPER_ID: item.PAPER_ID,
                    ANSW: item.ANSW,
                    ANSW_: {},
                    ANSW_SEQ_NO: item.ANSW_SEQ_NO,
                    EVAL_DSTN_NO: item.EVAL_DSTN_NO,
                    EXAM_CATE_CD: item.EXAM_CATE_CD,
                    EVAL_QSTN_SORT : item.EVAL_QSTN_SORT,
                };
            }
        });

        for (const answ of Object.values(questionMapAnsw)) {
          outputDataAnsw.push(answ);
        }
        this.paperEvalData = [];
        this.paperEvalData = outputDataAnsw;

        // 기본 답변지 세팅?
    },

    // 평가 문제 정보 가져오기
    async selectEvalQstnPaper(){
        // 초기화
      this.paperPreviewData = [];

      //let sUrl = '/phone-api/qt/comPaperPreview';
      let sUrl = '/phone-api/qt/selectQstnList';
      let postParam = {
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        EVAL_DSTN_NO:this.qstnPaperData.EVAL_DSTN_NO,
        USER_ID: this.qstnPaperData.USER_ID,
        EVAL_ID: this.qstnPaperData.EVAL_ID
      };

      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.paperPreviewData = response.DATA;
        // 예외 처리 해주어야 하는가...
        this.parseDataSet();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 평가 문제지 정보 가져오기 및 타이머 처리
    async fetchExamTimes(){
        // 초기화
        this.evalTestInfo = {};
        let sUrl = "/phone-api/qt/selectEvalTestInfo2";
        let postParam = {
            CENTER_ID: this.qstnPaperData.CENTER_ID,
            USER_ID : this.qstnPaperData.USER_ID,
        };

        let headParam = {};
        let response = await this.common_postCall(
            sUrl,
            postParam,
            headParam,
        );
        if (!response.HEADER.ERROR_FLAG) {

          this.evalTestInfo =  response.DATA;

          if (!this.mixin_isEmpty(this.evalTestInfo)) {

            const STimeString = this.evalTestInfo[0].START_TIME_SET.replace(" ", "T") + "Z"; // UTC 기준으로 설정
            const ETimeString = this.evalTestInfo[0].END_TIME_SET.replace(" ", "T") + "Z"; // UTC 기준으로 설정

            this.startTime = new Date(STimeString).getTime() / 1000; // 시작 시간 (초)
            this.endTime = new Date(ETimeString).getTime() / 1000; // 종료 시간 (초)

            const timeString = this.evalTestInfo[0].C_TIME.replace(" ", "T") + "Z"; // UTC 기준으로 설정
            this.currentTime = new Date(timeString).getTime() / 1000; // 현재 시간 (초)   DB 기준으로 현재 시간을 싱크            
            // 현재 시간과 비교하여 상태 설정
            this.updateStatus();

          }else{
            // 지금 시점에 평가 정보가 없기에
            // 강제 창 닫기??
            this.showAlert(this.MESSAGE.ALERT.DATA_NULL);
          }

        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
    },

    async submitExam_confirm(type) {      

      this.showConfirmInfo({msg: '답안을 제출하고 평가를 종료 하시겠습니까? \n (답안을 한번 제출하시면 평가를 다시 진행할수 없습니다.)'
        , callYes : ()=>{  
            this.submitExam(type);
            this.closeAlert();
         }
        , callNo : this.closeAlert
      });
      //this.closeAlert();
      //this.submitExam(type);
    },

    // 시험 제출 처리
    async submitExam(type) {     

      let sUrl = "/phone-api/qt/saveEvalTest";
      let postParam = {
          CENTER_ID: this.searchParams.CENTER_ID,
          PAPER_ID: this.qstnPaperData.PAPER_ID,
          EVAL_ID: this.qstnPaperData.EVAL_ID,
          USER_ID : this.searchParams.USER_ID,
          EVAL_DSTN_NO: this.qstnPaperData.EVAL_DSTN_NO,
          EVAL_DEPT_NO: this.qstnPaperData.EVAL_DEPT_NO,
          EXAM_CATE_CD: this.qstnPaperData.EXAM_CATE_CD,
          evalQstnPaperExam: this.paperEvalData,
          TYPE: type
      };

      let headParam = { head : {
        DATA_OBJECT: "evalQstnPaperExam"
      }};
      let response = await this.common_postCall(
          sUrl,
          postParam,
          headParam,
      );
      if (!response.HEADER.ERROR_FLAG) {
        if(type === 'A'){
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);

          clearInterval(this.timer);
          clearInterval(this.currentTimeInterval);
          this.isTimerActive = false;         

          // 사이드 패널 닫기?
          // this.$eventBus.$emit('clearVSlideXreverse');

          // 밑바탕 화면에 제출 결과를 처리
          this.$emit("onReFunction", this.qstnPaperData.EVAL_ID);
        }
      } else {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      //this.$eventBus.$emit('clearVSlideXreverse');

    },

    updateStatus() {
      if (this.currentTime < this.startTime) {
        this.message = "시험이 시작되기 전입니다. 잠시 후 다시 시도해 주세요.";
        this.showToast(this.MESSAGE.TOAST.NON_START);
        this.isTimerActive = false;
        clearInterval(this.timer); // 타이머 중지

        this.isExamLocked = true; // 화면 잠금
        this.close();
      } else if (this.currentTime > this.endTime) {

        this.message = "시험 시간이 종료되었습니다.";
        this.showToast(this.MESSAGE.TOAST.END_EVAL);
        this.isTimerActive = false;
        clearInterval(this.timer); // 타이머 중지
        this.isExamLocked = true; // 화면 잠금

        this.currentTime= null;
        this.startTime = null;

        console.info('updateStatus STOP !!! ');

        this.submitExam('A');
        //this.close();

      } else {
        this.message = "";
        this.isTimerActive = true;
        this.startTimer(); // 타이머 시작
        this.isExamLocked = false; // 화면 잠금 해제
      }
    },

    startTimer() {
      console.info('startTimer');
      if(this.isTimerActive){
        this.timer = setInterval(() => {
          // 타이머가 활성화된 동안 1초마다 현재 시간 증가
          if (this.timeLeft <= 0) {
            clearInterval(this.timer);
            this.isTimerActive = false;
            this.message = "시험 시간이 종료되었습니다.";
            this.isExamLocked = true; // 화면 잠금
            //this.showToast(this.MESSAGE.TOAST.END_EVAL);

            this.submitExam('A');

          } else if (!this.alertGiven && this.timeLeft <= 300) { // 5분(300초) 전
            this.showAlertCaution({msg:"5분후에 평가가 종료 됩니다."});
            // this.showToast(this.MESSAGE.TOAST.MIN_5);
            this.alertGiven = true; // 알림을 주었음을 기록
          }
        }, 1000);
      }
      // 1분마다 현재 시간 업데이트
      this.currentTimeInterval = setInterval(this.fetchCurrentTime, 60000);

      // 1초마다 남은 시간 업데이트
      setInterval(() => {
        this.currentTime += 1; // 매초 currentTime 증가
      }, 1000);
    },

    async fetchCurrentTime() {
      console.info('fetchCurrentTime');
      try {

        let sUrl = "/phone-api/qt/getSysDateDB";
        let postParam = {};
        let headParam = {};
        let response = await this.common_postCall(
            sUrl,
            postParam,
            headParam,
        );
        if (!response.HEADER.ERROR_FLAG) {

          this.evalDbTimeInfo = response.DATA;
          const timeString = this.evalDbTimeInfo[0].C_TIME.replace(" ", "T") + "Z"; // UTC 기준으로 설정
          this.currentTime = new Date(timeString).getTime() / 1000; // 현재 시간 (초)

          // 현재 시간이 업데이트 되었으므로 상태를 다시 확인
          //this.updateStatus();

        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }

      } catch (error) {
        console.error('Error syncing exam times:', error);
      }
    },

    startSync() {
      console.info('startSync');
      this.syncInterval = setInterval(this.syncExamTimes, 60000); // 1분마다 동기화
    },

    //test
    close_(){
      console.log(JSON.stringify(this.paperPreviewData_, null, 2));
    },
    //test
    close(){
      // this.mixin_fullscreen_off()
      this.$emit('ConfirmTest')
    }
  },
  async mounted() {

    this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;
    this.searchParams.CENTER_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    this.fetchExamTimes();
    this.selectEvalQstnPaper();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.currentTimeInterval);
  },
  created() {
  },
  computed: {

    timeLeft() {
      return this.endTime ? Math.max(this.endTime - this.currentTime, 0) : 0; // 남은 시간 (초)
    },
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    formattedEndTime() {
      if (this.endTime) {
        const date = new Date(this.endTime * 1000);
        return date.toLocaleTimeString();
      }
      return '';
    },

  },
  watch: {
    paperPreviewData_() {
        console.info('watch ::: ' + this.paperPreviewData_);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>