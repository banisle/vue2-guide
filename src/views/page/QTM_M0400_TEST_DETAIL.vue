<template>
  <div style="display: contents">
    <div class="pl-quick-layer-header flex-column pb-0">
      <div class="d-flex" style="position: relative; width: 100%">
        <div style="flex: 0 0 40px">
          <img :src="mixin_isEmpty(testResultDataInfo.IMG) ? require('@/assets/img/@manager_profile_default.png') : testResultDataInfo.IMG" 
          :alt="testResultDataInfo.EVAL_EMP_NM" style="width: 100%; height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
        </div>
        <!--div style="flex: 0 0 40px">
          <img :src="mixin_isEmpty(qaTgtData.IMG) ? require('@/assets/img/@manager_profile_default.png') : qaTgtData.IMG" :alt="qaTgtData.TGT_EMP_NM"  
          style="width: 100%; height: 40px; border-radius: 50%;">
        </div-->
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ testResultDataInfo.EVAL_EMP_NM }}</strong>
            <span class="ml-2 is-txt-sub">{{ testResultDataInfo.CENTER_NM }}-{{ testResultDataInfo.EVAL_DEPT_NM }} </span></div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>평가일시</strong>
              <span class="ml-2">{{ testResultDataInfo.START_TIME_SET }}</span>
            </div>
            <div>
              <strong class="ml-1">평가상태</strong>
              <span class="ml-2">{{ testResultDataInfo.LAST_SBMSN_NM }}</span>
            </div>
            <!--
            <div>
              <strong class="ml-1">평가적용</strong>
              <span class="ml-2">{{ data.PROFILE.test_assign }}</span>
            </div>-->
          </div>
        </div>
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 dialog-close"
          StyleProp="position: absolute; right: 0; top: 0;"
          TooltipPositionProp="bottom"
          @btnClick="close()"
        ></compo-tooltip-btn>
      </div>
      <!-- tab -->
      <v-tabs class="pl-tabs is-mt-s is-noborder" v-model="tabs2">
        <v-tab>평가결과</v-tab>
        <v-tab>
          <v-badge
            :value="!mixin_isEmpty(propsObjtData.OBJT_ID)"
            color="#0073ce"
            bordered
            offset-x="-1"
            offset-y="9"
            dot
          >
          이의제기
          </v-badge>
        </v-tab>
      </v-tabs>
    </div>
    <div class="pl-quick-layer-body pa-0" style="flex: 0 0 calc(100% - 206px);">
      <!-- tab content -->
      <v-tabs-items v-model="tabs2">
        <!-- 평가결과 -->
        <v-tab-item>
          <div class="pa-5">
            <!-- grid -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <span class="pl-subtit">{{ testResultDataInfo.EVAL_TITLE }}</span>
              </div>
            </div>
            <table class="pl-tbl-detail is-mt-s">
            <colgroup>
            </colgroup>
            <thead>
              <tr>
                <th class="px-0">평가일자</th>
                <th class="px-0">시작 시간</th>
                <th class="px-0">답안 제출 시간</th>
                <th class="px-0">배점</th>
                <th class="px-0">맞은 문항 수</th>
                <th class="px-0">틀린 문항 수</th>
                <th class="px-0">점수</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center font-weight-bold"> {{ this.testResultDataInfo.TEST_DT }} </td>
                <td class="text-center">{{ testResultDataInfo.START_TIME }}</td>
                <td class="text-center">{{ testResultDataInfo.END_TIME }}</td>
                <td class="text-center">{{ testResultDataInfo.TOT_SCORE }}</td>
                <td class="text-center">
                    <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #E1FFEF">{{ testResultDataInfo.OK_CNT }}</strong>
                </td>
                <td class="text-center">
                    <strong class="pl-badge ml-2 px-2 is-txt-black" style="background: #DDEBFB">{{ testResultDataInfo.FAIL_CNT }}</strong>
                </td>
                <td class="text-center">{{ testResultDataInfo.EVAL_SCORE }} 점</td>
              </tr>
            </tbody>
          </table>
            <!-- test list  TEST_DATA.list -->
            <div class="is-mt-l">
              <span class="pl-subtit">평가 문항 및 제출 답안</span>
              <div class="is-mt-m is-border-top pt-4 spacing-wrap sp-64 flex-column">
                <div v-for="item,index in testResultData_" :key="item.id">
                  <!-- 제목  {{ item.QSTN_CNTNT }} -->
                  <div class="d-flex" style="position: relative; font-size: 15px;">
                    <strong style="flex: 0 0 20px;">{{ index + 1}}. </strong>
                    <div >
                      <strong style="word-break: keep-all;" v-html="restoreXSS_CrossEditor( item.QSTN_CNTNT)"></strong>
                      <!-- 점수 [정답 {{ item.correct_point }}] [배점 {{ item.assign_point }}] -->
                      <span class="is-txt-blue">
                        [정답 {{ item.QSTN_ANSW }}] [배점 {{ item.QSTN_SCORE }}]<!--  {{item.QSTN_ANSW}} {{item.CRTANS_YN}} -->
                      </span>
                    </div>
                    <v-icon
                      style="width: 70px; height: 70px; position: absolute; top: -18px; left: -8px;"
                      :class="`pl-icon20 ${ item.CORRECT ? 'correct-true' : 'correct-false'}`"></v-icon>
                  </div>
                  <!-- 지문???  v-if="item.example_list"
                  <template v-if="item.EXMPLIST">
                    <div class="pl-test-sample is-border-all py-3 px-5 pt-5 ma-3 mt-5 spacing-wrap sp-4 flex-column">
                      <div
                        class=""
                        v-for="ex in item.EXMPLIST"
                        :key="ex.EXMP_SORT_NO">
                        {{ ex.EXMP_WORD }}
                      </div>
                    </div>
                  </template>
                  -->

                  <!-- 시험지   보기 정보  {{ qindex + 1}}  -->

                  <template v-if="item.QSTN_TYPE === 'D'">
                    <span class="ml-4 is-mt-s">{{ item.ANSW }}</span>
                  </template>
                  <template v-else>
                    <ol class="is-mt-s spacing-wrap sp-8 flex-column" style="font-size: 14px;">
                        <li
                        v-for="q,qindex in item.EXMPLIST"
                        :key="q.id"
                        :style="q.select ? '' : ''"
                        class="d-flex ml-4 align-start">
                        <span
                            style="flex: 0 0 16px; margin-top: 3px; border-radius: 50%; border: 1px solid rgb(110 110 110); display: inline-flex; width: 16px; height: 16px; text-align: center; justify-content: center; font-size: 12px; align-items: center;"
                            :style="q.CHK ? 'color: #fff; background: #333;' : ''">
                             {{q.EXMP_SORT_NO}}
                            </span>
                        <template v-if="q.type === 'icon'">
                            <v-icon :class="`ml-2 pl-icon20 ${ q.EXMP_WORD }`" style="margin-top: 3px"></v-icon>
                        </template>
                        <template v-else>
                            <span class="ml-2">{{ q.EXMP_WORD }}</span>
                        </template>
                        </li>
                    </ol>
                   </template>
                </div>
              </div>
            </div>
          </div>
        </v-tab-item>
        <!-- 이의 제기 -->
        <v-tab-item>
          <CompoObjectionRequest :propsData="propsObjtData" @close="close"/>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { template } from 'lodash';
import CompoObjectionRequest from '@/components/CompoObjectionRequest';

export default {
  name: "QTM_M0400_TEST_DETAIL",
  props: {
    popData : {
      type: Object,
    },
    qstnPaperData:{
      type: Object,
      default: () => {},
    }
  },
  components: {
    CompoObjectionRequest,
  },
  data() {
    return {
      tabs2: null,
      data: {
        PROFILE: {
          name: '김미정',
          img: require('@/assets/img/@manager_profile5.png'),
          part: '바로처리센터 - 마이홈1팀',
          test_date: '2024-06-20 09:30:25',
          test_stat: '평가완료',
          test_assign: '적용',
        },
      },


      // 이의 제기
      REJECTION_DATA: {
        date: '2024-06-28 17:00',
        end_date: '2024-06-28 15:35:45',
        stat: '종결',
        list: [
          { img: require('@/assets/img/@manager_profile.png'), name: '김미정', date: '2024-06-25 13:20:45', txt: `2번 문제의 정답이 3번인데 질문의 내용과 의도를 보았을 때 4번도 정답이 맞는 듯 합니다.
이번 2024년 06월 22일 정정 공고된 공고문의 32페이지의 내용을 보면 4번도 정답으로 판단됩니다.
확인 요청 드려요.` },
          { img: require('@/assets/img/@profile_blue_default.png'), name: '평가자', date: '2024-06-25 17:05:35', txt: `안녕하세요. 해당 공고문의 정정 공고문을 확인 해 보았을 때, 해석의 기준을 어떻게 하는지에 따라  기준이 좀 다르다고
판단됩니다. 하여 공고의 정확한 판단을 위해 해당 담당자와 확인 중에 있습니다.
결과가 나오면 다시 안내 드리도록 하겠습니다.` },
          { img: require('@/assets/img/@profile_blue_default.png'), name: '평가자', date: '2024-06-25 17:05:35', txt: `안녕하세요. 해당 공고문 해석 결과 김미정 상담사 님의 말씀처럼 4번도 정답으로 판명되어 정답 처리해 드리겠습니다.
평가 문제와 결과에 혼선을 드려 죄송합니다. ^^
` },
          { img: require('@/assets/img/@manager_profile.png'), name: '김미정', date: '2024-06-26 16:21:18', txt: `네에~ 감사합니다. 수고 하십시오.` },
        ],
        textarea: null,
      },
      // 상태 컬러
      STAT_LIST: [
        { code: '종결', value: 'green'},
        { code: '진행', value: 'cyan'},
      ],



      //
      searchParams:{
        CENTER_ID: "",
        USER_ID: "",
      },
      testResultData: [],
      testResultData_: [],

      testResultDataInfo: {},

      propsObjtData:{
        EVL_SE_CD: "ARGUDV02"  // 업무평가
        , EVAL_DSTN_NO: ""     // 평가대상번호
        , CUSL_ID: ""          // 상담사ID
        , OBJT_ID: ""          // 이의제기ID
        , CENTER_ID: ""           // CUSTCO_ID
      },
    }
  },
  methods: {

    // 재정렬
    parseDataSet() {

        const outputData = [];
        const questionMap = {};
        this.testResultData.forEach(item => {
        const questionId = item.QSTN_NO;
            if (!questionMap[questionId]) {
                questionMap[questionId] = {
                    INDEX_: null,
                    QSTN_SORT: item.QSTN_SORT,   // 문제 번호  ( 1, 2, 3,)
                    QSTN_LEVEL: item.QSTN_LEVEL,
                    TOT_SCORE: item.TOT_SCORE,   // 총점
                    QSTN_CNTNT: this.restoreXSS(item.QSTN_CNTNT),  // 문제 제목
                    PAPER_TITLE: item.PAPER_TITLE,
                    QSTN_SCORE: item.QSTN_SCORE,  // 문제 별 배점
                    QSTN_TYPE: item.QSTN_TYPE,   // 주관식 객관식
                    EXMP_CNT: item.EXMP_CNT,     // 객관식일 경우 보기 개수
                    ANSW_TYPE: item.ANSW_TYPE,   // 단일 , 다중 선택
                    QSTN_ANSW: item.QSTN_ANSW,   // 정답 정보
                    QSTN_CNT: item.QSTN_CNT,   // 문제 총 개수
                    QSTN_NO: questionId,        // 문제 ID ( SEQ )
                    EXAM_CATE_CD : item.EXAM_CATE_CD,
                    ANSW: item.ANSW,  // 사용자 주관식 , 객관식 답안 정보 ( 사용자 입력 )
                    radioGroupSelected: null,
                    EVAL_QSTN_SORT : item.EVAL_QSTN_SORT,
                    EVAL_DSTN_NO: item.EVAL_DSTN_NO,
                    ANSW_SEQ_NO: item.ANSW_SEQ_NO,
                    CORRECT: item.CRTANS_YN == "Y" ? true : false,
                    CRTANS_YN: item.CRTANS_YN,
                    EXMPLIST: []   // 객관식일 경우  보기 정보 리스트
                };
            }
            questionMap[questionId].EXMPLIST.push({
                CHK: false,
                EXMP_SORT_NO: item.EXMP_SORT_NO,   // 보기 번호
                EXMP_WORD: item.EXMP_WORD, // 보기 제목
            });
        });

        Object.values(questionMap).forEach(question => {
            //console.log(` QSTN_TYPE: ${question.QSTN_TYPE} `);
            if(question.QSTN_TYPE == 'S'){
                const correctAnswers = question.ANSW.split(',').map(answer => answer.trim());
                question.EXMPLIST.forEach(exm => {
                    //console.log(`EXMP_SORT_NO: ${exm.EXMP_SORT_NO} correctAnswers: ${correctAnswers}`);
                    const exmpSortNoStr = exm.EXMP_SORT_NO.toString();
                    if (correctAnswers.includes(exmpSortNoStr)) {
                        exm.CHK = true;
                        //console.log(`Compare OK: ${exm.EXMP_SORT_NO} `);
                    }else{
                        exm.CHK = false;
                    }
                });
            }
        });

        for (const question of Object.values(questionMap)) {
            outputData.push(question);
        }

        this.testResultData_ = [];
        this.testResultData_ = outputData;
    },

    setResultDataInfo(){
        console.info(this.testResultDataInfo);

        this.testResultDataInfo.PROC_NM = this.testResultDataInfo[0].PROC_YN == "Y" ? "응시" : "미응시";
        this.testResultDataInfo.LAST_SBMSN_NM = this.testResultDataInfo[0].LAST_SBMSN_YN == "Y" ? "제출완료" : "미완료";
        this.testResultDataInfo.IMG = this.testResultDataInfo[0].IMG;
        this.testResultDataInfo.TEST_DT = this.testResultDataInfo[0].PROC_DT.substr(0, 4)+"-"+this.testResultDataInfo[0].PROC_DT.substr(4, 2)+"-"+this.testResultDataInfo[0].PROC_DT.substr(6, 2);
        this.testResultDataInfo.START_TIME = this.testResultDataInfo[0].PROC_DT.substr(8, 2)+":"+this.testResultDataInfo[0].PROC_DT.substr(10, 2);
        this.testResultDataInfo.END_TIME = this.testResultDataInfo[0].LAST_SBMSN_DT.substr(8, 2)+":"+this.testResultDataInfo[0].LAST_SBMSN_DT.substr(10, 2);
        this.testResultDataInfo.FAIL_CNT = parseInt(this.testResultDataInfo[0].QSTN_CNT) - parseInt(this.testResultDataInfo[0].OK_CNT) ;
        this.testResultDataInfo.EVAL_EMP_NM = this.testResultDataInfo[0].EVAL_EMP_NM;
        this.testResultDataInfo.CENTER_NM = this.testResultDataInfo[0].CENTER_NM;
        this.testResultDataInfo.EVAL_DEPT_NM = this.testResultDataInfo[0].EVAL_DEPT_NM;
        this.testResultDataInfo.START_TIME_SET = this.testResultDataInfo[0].START_TIME_SET;
        this.testResultDataInfo.EVAL_TITLE = this.testResultDataInfo[0].EVAL_TITLE;
        this.testResultDataInfo.TOT_SCORE = this.testResultDataInfo[0].TOT_SCORE;
        this.testResultDataInfo.EVAL_SCORE = this.testResultDataInfo[0].EVAL_SCORE;
        this.testResultDataInfo.OK_CNT = this.testResultDataInfo[0].OK_CNT;
        this.testResultDataInfo.QSTN_CNT = this.testResultDataInfo[0].OK_CNT;

        // 이의제기 정보
        this.propsObjtData.EVAL_DSTN_NO = this.testResultDataInfo[0].EVAL_DSTN_NO;
        this.propsObjtData.CUSL_ID = this.testResultDataInfo[0].EVAL_EMP_NO;
        this.propsObjtData.OBJT_ID = this.testResultDataInfo[0].OBJT_ID;
        this.propsObjtData.CENTER_ID = this.qstnPaperData.CENTER_ID;
    },

    // 평가 결과 정보 가져오기
    async selectEvalQstnPaperResult(){
        // 초기화
      this.testResultData = [];

      let sUrl = '/phone-api/qt/selectQstnResultDataList';
      let postParam = {
        PAPER_ID: this.qstnPaperData.PAPER_ID,
        CENTER_ID: this.qstnPaperData.CENTER_ID,
        EVAL_EMP_NO: this.qstnPaperData.USER_ID,
        EVAL_ID: this.qstnPaperData.EVAL_ID
      };

      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.testResultData = response.DATA;
        this.parseDataSet();

        this.testResultDataInfo = {};

        this.testResultDataInfo = response.TEST_RESULT_DATA.map((row) => {
            if (row.ICON_IMG_URI !== "/")
                  row.IMG = "/upload/" + row.ICON_IMG_URI;
            else
                  row.IMG = require("@/assets/img/@manager_profile_default.png");
            return row;
        });

        this.setResultDataInfo();

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    close(){
      this.$emit('Close')
    }
  },
  async mounted() {
    //this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;
    //this.searchParams.CENTER_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    this.selectEvalQstnPaperResult();
  },
  created() {
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", () => {
      this.selectEvalQstnPaperResult();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
    qstnPaperData(){
      this.selectEvalQstnPaperResult();
    }

  },
};
</script>

<style lang="scss" scoped>

</style>