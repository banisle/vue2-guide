<template>
  <div class="pl-card" style=" height: calc(100% - 90px); display: flex; flex-direction: column; ">
    <!-- 시험 가능 -->
    <template v-if="examMode === 'start'">
      <h3 class="text-center">{{ EVAL_TITLE}}</h3>
      <div class="pl-esp-tit is-mt-m">
        유의사항을 확인하시고 "동의합니다."를 체크하신 후 응시하여 주시기 바랍니다.
      </div>
      <div class="pl-esp-box pa-4">
        <div>
          <strong class="pl-subtit">[평가 정보]</strong>
          <table class="pl-tbl-detail is-mt-s">
            <colgroup>
            </colgroup>
            <thead>
              <tr>
                <th>평가일자</th>
                <th>시작 시간</th>
                <th>종료 시간</th>
                <th>시험 시간</th>
                <th>문항 수</th>
                <th>응시자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center font-weight-bold"> {{ TEST_DT}}</td>
                <td class="text-center">{{ START_TIME }}</td>
                <td class="text-center">{{ END_TIME }}</td>
                <td class="text-center">{{ EVAL_TIME }}분</td>
                <td class="text-center">{{ QSTN_CNT }} 문항</td>
                <td class="text-center">{{ EVAL_EMP_NM }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="is-mt-m">
          <strong class="pl-subtit">[유의사항]</strong>
          <ul class="pl-list-dot is-no-border">
            <li v-for="list in caution_text" :key="list.id">
              {{ list }}
            </li>
          </ul>
        </div>
        <!-- input-value="false" -->
        <div class="d-flex justify-center mt-10">
          <v-checkbox
            class="pl-check"
            v-model="agreeYn"
            >
            <template v-slot:label>
              <strong>상기 응시 유의사항 내용을 확인하고, 동의합니다.</strong>
            </template>
          </v-checkbox>
        </div>
      </div>
      <div class="text-center is-mt-l">
        <v-btn
          @click="showPreviewSheet()"
          :disabled="isExamLocked"
          class="pl-btn is-lg"
          style="width: 180px;">시험 시작</v-btn>
      </div>
      <ul class="pl-list-dot is-mt-m">
        <li>평가 시작시간이 되어야 [시험시작] 버튼이 활성화 되며, 평가에 응시할 수 있습니다.</li>
        <li>평가 종류 후 답안지를 최종 제출하시면 평가 점수를 바로 확인할 수 있습니다.</li>
      </ul>
    </template>
    <!-- 시험 불가능 -->
    <template v-if="examMode === 'ready'">
      <h3 class="text-center pt-10">
        평가가 종료되었거나, 응시할 평가가 없습니다.
      </h3>
      <div class="text-center mt-auto">
        <v-btn
          class="pl-btn is-lg is-trans"
          @click="closeSlide()"
          style="width: 180px;">닫기</v-btn>
      </div>
    </template>
    <!-- 시험 완료 -->
    <template v-if="examMode === 'done'">
      <h3 class="text-center">{{ EVAL_TITLE }} </h3>
      <div class="pl-esp-tit is-mt-m">
        {{ testResultData[0].CENTER_NM }}-{{ testResultData[0].EVAL_DEPT_NM }} ({{ testResultData[0].EVAL_EMP_NM }})님의 평가 결과
      </div>
      <div class="pl-esp-box pa-4">
        <div>
          <strong class="pl-subtit">[답안제출 정보]</strong>
          <table class="pl-tbl-detail is-mt-s">
            <colgroup>
            </colgroup>
            <thead>
              <tr>
                <th class="px-0">평가일자</th>
                <th class="px-0">시작 시간</th>
                <th class="px-0">답안 제출 시간</th>
                <th class="px-0">응시자</th>
                <!-- 
                <th class="px-0">맞은 문항 수</th>
                <th class="px-0">틀린 문항 수</th>
                <th class="px-0">점수</th> -->
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center font-weight-bold"> {{ testResultData.TEST_DT }} </td>
                <td class="text-center">{{ testResultData.START_TIME }}</td>
                <td class="text-center">{{ testResultData.END_TIME }}</td>
                <td class="text-center">{{ testResultData[0].EVAL_EMP_NM }}</td>
                <!--
                <td class="text-center">{{ testResultData[0].OK_CNT }}</td>
                <td class="text-center">{{ testResultData.FAIL_CNT }}</td>
                <td class="text-center">{{ testResultData[0].EVAL_SCORE }}</td>-->
              </tr>
            </tbody>
          </table>
        </div>
        <div class="my-10 d-flex justify-center ">
          <strong class="pl-subtit font-weight-bold" style="font-size: 26px;">&lt;수고하셨습니다&gt;</strong>
        </div>
        <ul class="pl-list-dot is-mt-m">
          <li>평가결과는 "My홈 → 업무평가" 탭 화면에서 자세히 확인하실 수 있습니다.</li>
        </ul>
      </div>
      <div class="text-center mt-auto">
        <v-btn
          class="pl-btn is-lg is-trans"
          @click="closeSlide()"
          style="width: 180px;">닫기</v-btn>
      </div>
    </template>

    <!-- dialog:평가 시작  <Teleport to=".pl-layout-contents"></Teleport> -->
    <template v-if="dialogPreviewSheet">
      
        <!--CompoPreviewSheet @ConfirmTest="dialogPreviewSheet = false"/-->
        <QTM_M0100_TEST_EXAM @ConfirmTest="dialogPreviewSheet = false"
        :qstnPaperData="qstnPaperData"
        @onReFunction="returnData"
        v-if="dialogPreviewSheet"
        />
      
    </template>
  </div>
</template>

<script>
import CompoPreviewSheet from '@/components/CompoPreviewSheet.vue';   // 미리보기용
import QTM_M0100_TEST_EXAM from '@/views/page/QTM_M0100_TEST_EXAM.vue'; // 실제 시험 처리용

export default {
  name: 'HomeTestExam', //오늘의 업무능력 평가
  components: {
    QTM_M0100_TEST_EXAM
  },
  data() {
    return {
      examMode: 'start', //ready, start, done
      title: '24년 06월 업무테스트(일반)',
      test_info: {
        date: '2024-06-20(화)',
        start_time: '08:40',
        end_time: '08:55',
        test_time: 15,
        test_cnt: 10,
        tester: '우성아'
      },
      caution_text: [
        '문항 수: 10문항 (각 10점씩 배점, 100점 만점) / 종료 전 답안 체크를 반드시 확인 해 주십시오.',
        '업무테스트에 응시해 주셔서 감사드리며, 업무테스트를 진행하기에 앞서 부정행위(문제 유출, 사진촬영, 카카오톡 등 메신저 공유 등)의 발견 및 제보를 받을 경우 사실관계에 따라 당월 종합평가에서 제외대상이 될 수 있으며, 경중에 따라 징계 처리 또한 될 수 있음을 유념해주시면 감사하겠습니다.',
        '직원 여러분들의 공정한 경쟁이 본 업무테스트 결과에 반영되길 기대합니다.'
      ],

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          AGREE_YN : {alertDialogToggle: true, msg: '유의사항 동의 확인 해주시기 바랍니다.', iconClass: 'is-info', type: 'default'}
          , DATA_NULL : {alertDialogToggle: true, msg: '평가 정보가 없습니다.', iconClass: 'is-info', type: 'default'}
          , NON_START : {alertDialogToggle: true, msg: '평가 시험 정보가 시작전입니다.', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },

      },

      searchParams:{
        CENTER_ID: "",
        USER_ID: "",
      },
      agreeYn: false,
      dialogPreviewSheet: false,
      evalTestInfo: {},
      qstnPaperData:{},

      EVAL_TITLE:'',
      TEST_DT:'',
      START_TIME:'',
      END_TIME:'',
      EVAL_TIME:'',
      QSTN_CNT:'',
      EVAL_EMP_NM:'',
      EVAL_DSTN_NO:'',
      EVAL_DEPT_NO:'',

      isExamLocked: false,
      testResultData: {},      
    }
  },
  methods: {

    // 평가 제출 결과 보여주기
    async returnData(EVAL_ID){
      this.dialogPreviewSheet = false;
      this.testResultData = {};

      let sUrl = "/phone-api/qt/selectTestResultData";
      let postParam = {
          CENTER_ID: this.searchParams.CENTER_ID,
          //USER_ID : this.searchParams.USER_ID,
          EVAL_EMP_NO: this.searchParams.USER_ID,
          EVAL_ID : EVAL_ID,
      };

      let headParam = {};
      let response = await this.common_postCall(
          sUrl,
          postParam,
          headParam,
      );
      if (!response.HEADER.ERROR_FLAG) {
        this.examMode = 'done';
        this.testResultData = response.DATA;

        this.testResultData.TEST_DT = this.evalTestInfo[0].TEST_DT;
        this.testResultData.START_TIME = this.testResultData[0].PROC_DT.substr(8, 2)+":"+this.testResultData[0].PROC_DT.substr(10, 2);
        this.testResultData.END_TIME = this.testResultData[0].LAST_SBMSN_DT.substr(8, 2)+":"+this.testResultData[0].LAST_SBMSN_DT.substr(10, 2);
        this.testResultData.FAIL_CNT = parseInt(this.testResultData[0].QSTN_CNT) - parseInt(this.testResultData[0].OK_CNT) ;

      }else {
        this.isExamLocked = true;
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 평가 정보 기본 체크
    async selectEvalTestInfo(){

      // 초기화
      this.evalTestInfo = {};

      let sUrl = "/phone-api/qt/selectEvalTestInfo";
      let postParam = {
          CENTER_ID: this.searchParams.CENTER_ID,
          USER_ID : this.searchParams.USER_ID,
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
          this.evalTestInfo[0].START_TIME = this.evalTestInfo[0].EVAL_ST_DD.substr(8, 2)+":"+this.evalTestInfo[0].EVAL_ST_DD.substr(10, 2);
          this.evalTestInfo[0].END_TIME = this.evalTestInfo[0].EVAL_EN_DD.substr(8, 2)+":"+this.evalTestInfo[0].EVAL_EN_DD.substr(10, 2);

          this.EVAL_TITLE = this.evalTestInfo[0].EVAL_TITLE;
          this.TEST_DT = this.evalTestInfo[0].TEST_DT;
          this.START_TIME= this.evalTestInfo[0].START_TIME;
          this.END_TIME= this.evalTestInfo[0].END_TIME;
          this.EVAL_TIME= this.evalTestInfo[0].EVAL_TIME;
          this.QSTN_CNT= this.evalTestInfo[0].QSTN_CNT;
          this.EVAL_EMP_NM= this.evalTestInfo[0].EVAL_EMP_NM;
          this.EVAL_DSTN_NO= this.evalTestInfo[0].EVAL_DSTN_NO;  // 평가 고유 번호
          this.EVAL_DEPT_NO= this.evalTestInfo[0].EVAL_DEPT_NO;

        }else{
          this.isExamLocked = true;
          this.examMode = 'ready';
          //this.showAlert(this.MESSAGE.ALERT.DATA_NULL);
        }

      } else {
        this.isExamLocked = true;
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    async showPreviewSheet(){

      const ctDate_ = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString() ; 
      const ctDate =  ctDate_.replaceAll('-','').replaceAll(' ','').replaceAll(':','').replaceAll('T','').substring(0, 14);

      if(this.evalTestInfo[0].EVAL_ST_DD > ctDate){
        // 시험 시간 전 
        this.showAlert(this.MESSAGE.ALERT.NON_START);
        return;
      }


      if (!this.agreeYn) {
        this.showAlert(this.MESSAGE.ALERT.AGREE_YN);
        return;
      }else{
        // 시험지 창 열기전에
        // 동의 여부 처리 및 시작 시험을 처리 한다.
        let sUrl = '/phone-api/qt/startEvalTest';
        let postParam = {
          PAPER_ID: this.evalTestInfo[0].PAPER_ID,
          CENTER_ID: this.qstnPaperData.CENTER_ID,
          EVAL_DSTN_NO:this.evalTestInfo[0].EVAL_DSTN_NO,
          USER_ID: this.searchParams.USER_ID,
          EVAL_DEPT_NO: this.evalTestInfo[0].EVAL_DEPT_NO,
          EVAL_ID: this.evalTestInfo[0].EVAL_ID,
          QSTN_ARR: this.evalTestInfo[0].QSTN_ARR,
        };

        let headParam = { head : {} };
        let response  = await this.common_postCall(sUrl, postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {

          // 응시 동의 처리후 후  시험지 화면으로 이동
          this.qstnPaperData = {
            CENTER_ID : this.searchParams.CENTER_ID,
            PAPER_ID : this.evalTestInfo[0].PAPER_ID,
            USER_NM : this.evalTestInfo[0].EVAL_EMP_NM,
            EVAL_EMP_ID : this.evalTestInfo[0].EVAL_EMP_ID,
            USER_ID : this.evalTestInfo[0].EVAL_EMP_ID,
            EVAL_TITLE : this.evalTestInfo[0].EVAL_TITLE,            
            START_TIME: this.evalTestInfo[0].START_TIME,  // 화면표시용
            END_TIME: this.evalTestInfo[0].END_TIME, // 화면표시용
            EVAL_TIME: this.evalTestInfo[0].EVAL_TIME,

            START_TIME_SET: this.evalTestInfo[0].START_TIME_SET, // 로직 체크용
            END_TIME_SET: this.evalTestInfo[0].END_TIME_SET,  // 로직 체크용

            EVAL_DEPT_NO: this.evalTestInfo[0].EVAL_DEPT_NO,
            EVAL_DSTN_NO: this.evalTestInfo[0].EVAL_DSTN_NO,
            EVAL_ID: this.evalTestInfo[0].EVAL_ID
          }
          this.dialogPreviewSheet = true
        }else{
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }

        // this.mixin_fullscreen()
      }
    },

    // 평가 정보 가져오기
    selectTestData(){

    },

    closeSlide(){
      this.$eventBus.$emit('clearVSlideXreverse');
      console.log("🚀 ~ closeSlide ~ closeSlide:")
    }
  },
  async mounted() {

    // 사용자 정보
    this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;
    this.searchParams.CENTER_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    this.selectEvalTestInfo();
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>