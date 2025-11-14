<template>
  <div class="pl-examSheet-wrap">
    <div class="pl-examSheet">
      <!-- title -->
      <h1 class="pl-examSheet-title">
        <img src="@/assets/img/lhcs_white.png" alt="lh주거복지" style="height: 30px;">
        <span>{{qstnPaperData.PAPER_TITLE}}</span>
        <div class="pl-examSheet-timewrap">
          <div class="d-flex align-center">
            <v-icon class="pl-icon20 timer-white"></v-icon>
            <div class="ml-1" style="line-height: 1.1;">남은 시간</div>
          </div>
          <span class="pl-examSheet-timewrap-time ml-2 font-decimal">00:00:00</span>
          <!-- 닫기 -->
          <v-btn
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
          </v-btn>
        </div>
      </h1>
      <!-- sheet -->
      <div class="pl-cols" style="height: calc(100vh - 145px)">
        <div class="">
          <div class="pl-examSheet-paper pl-scroll-body">
            <div v-for="item, index in this.paperPreviewData_" :key="item.id">
              <!-- 제목 {{ item.QSTN_CNTNT }} -->
              <div class="d-flex pl-examSheet-paper--title">
                <strong style="flex: 0 0 35px;">{{ index + 1 }}. </strong>
                <strong style="word-break: keep-all;" v-html="restoreXSS_CrossEditor( item.QSTN_CNTNT)"></strong>
              </div>              

              <!-- 정답, 배점 -->
              <template v-if="!preview_mode">
                <div class="spacing-wrap sp-8 ml-9 is-mt-s" style="font-size: 16px;">
                  <div class="d-flex align-center">
                    <strong>정답</strong><strong class="pl-badge is-lg ml-2 px-2 is-txt-black" style="background: rgb(225, 255, 239);">{{ item.QSTN_ANSW }}</strong>
                  </div>
                  <div class="d-flex align-center">
                    <strong>배점</strong><strong class="pl-badge is-lg ml-2 px-2 is-txt-black" style="background: rgb(221, 235, 251);">{{ item.QSTN_SCORE }}</strong>
                  </div>
                </div>
              </template>

              <!-- 문제 보기: 주관식 -->
              <template v-if="item.QSTN_TYPE === 'D'">
                <div class="ml-8 is-mt-m">
                  <v-text-field
                    v-model="item.ANSW"
                    class="pl-form type-middle"
                    style="width: calc(100% - 12px);"
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
                        class="d-flex ml-4 align-start"
                        v-model="item.radioGroupSelected">
                        <v-radio
                            v-for="(q, qindex) in item.EXMPLIST"
                            :key="item.EXMPLIST[qindex].EXMP_WORD"
                            :label="q.EXMP_WORD"
                            :value="q.EXMP_SORT_NO-1"
                            class="pl-radio"
                            @click="handleInputEvalType_(item, q)"
                            >
                            <template v-slot:label>
                                <span
                                :style="qindex === item.radioGroupSelected ? 'color: #fff; background: #333;' : ''"
                                style="margin: 3px 0 0 0;"
                                class="pl-examSheet-paper--example-num ">{{ qindex + 1}}</span>
                                <template v-if="q.QSTN_TYPE === 'icon'">
                                    <v-icon :class="`ml-2 pl-icon20 ${ q.EXMP_WORD }`" style="margin-top: 6px; font-size: 16px;"></v-icon>
                                </template>
                                <template v-else>
                                    <span class="ml-2" style="font-size: 16px;">{{ q.EXMP_WORD }}</span>
                                </template>
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
            <div class="d-flex"><strong style="flex: 0 0 100px">시험시간</strong> <span>{{ TEST_TIME }}</span></div>
            <div class="d-flex"><strong style="flex: 0 0 100px">응시자</strong> <span>{{ USER_NAME }}</span></div>
          </div>
          <!-- correct list -->
          <div class="pl-examSheet-answer--list list-fade-effect">
            <div
              class="d-flex align-center"
              v-for="item in this.paperEvalData"
              :key="item.QSTN_SORT">
              <div class="is-bg-light pa-3 text-center is-border-right" style="flex: 0 0  50px;">
                {{ item.QSTN_SORT }}
              </div>              
              <!-- 주관식 -->
              <template >  
                <v-text-field
                    v-model="item.ANSW"
                    class="ml-4 is-ellips"
                  ></v-text-field>             
                  <!--span class="ml-2 is-ellips">{{ item.AWSW }}</!--span-->
              </template> 
                           
            </div>
          </div>
          <!-- correct list end -->
          <div class="mt-auto px-5 py-5">
            <v-btn class="pl-btn is-esp" style="width: 100%; height: 50px; font-size: 20px;" @click="close_()">답안지 제출</v-btn>
          </div>
        </div>
        <!-- right end -->

      </div>
    </div>
  </div>
</template>

<script>
import { indexOf } from 'lodash';

export default {
  name: 'QTM_M0100_PAPER_Preview', //평가지 미리보기
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

      // 문항  ( 퍼블 )
      TEST_DATA_LIST: [], 

      paperPreviewData: [],
      paperPreviewData_ : [],
      paperEvalData: [],      

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
    },    


    // 재정렬
    parseDataSet() {
        const outputData = [];
        const questionMap = {};
        this.paperPreviewData.forEach(item => {
        const questionId = item.QSTN_NO;        
            
            if (!questionMap[questionId]) {
                questionMap[questionId] = {
                    QSTN_SORT: item.QSTN_SORT,
                    QSTN_LEVEL: item.QSTN_LEVEL,
                    TOT_SCORE: item.TOT_SCORE,
                    QSTN_CNTNT: item.QSTN_CNTNT,
                    PAPER_TITLE: item.PAPER_TITLE,
                    PAPER_ID: item.ID,
                    QSTN_SCORE: item.QSTN_SCORE,
                    QSTN_TYPE: item.QSTN_TYPE,
                    EXMP_CNT: item.EXMP_CNT,
                    ANSW_TYPE: item.ANSW_TYPE,
                    QSTN_ANSW: item.QSTN_ANSW,
                    QSTN_CNT: item.QSTN_CNT,
                    QSTN_NO: questionId,
                    ANSW: null,
                    radioGroupSelected: null,
                    EXMPLIST: []
                };
            }           
            
            questionMap[questionId].EXMPLIST.push({
                CHK: false,
                EXMP_SORT_NO: item.EXMP_SORT_NO,
                EXMP_WORD: item.EXMP_WORD
            });
        });

        for (const question of Object.values(questionMap)) {
            outputData.push(question);
        }

        this.paperPreviewData_ = [];        
        this.paperPreviewData_ = outputData;
        //this.paperPreviewData_ = JSON.parse(JSON.stringify(outputData));

        this.parseAnswDataSet();

    },

    parseAnswDataSet() {
        const outputDataAnsw = [];
        const questionMapAnsw = {};
        this.paperPreviewData.forEach(item => {
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
                    PAPER_ID: item.ID,
                    ANSW: '',   
                    ANSW_: {},                
                };
            }             
        });

        for (const answ of Object.values(questionMapAnsw)) {
          outputDataAnsw.push(answ);
        }
        this.paperEvalData = [];        
        this.paperEvalData = outputDataAnsw;
        //this.paperEvalData = JSON.parse(JSON.stringify(outputDataAnsw));
    },

    async selectEvalQstnPaperPreview(){
        // 초기화
      this.paperPreviewData = [];          

      let sUrl = '/phone-api/qt/comPaperPreview';
      let postParam = {     
        PAPER_ID: this.qstnPaperData.PAPER_ID,   
        CENTER_ID: this.qstnPaperData.CENTER_ID,        
      };

      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.paperPreviewData = response.DATA;
        this.parseDataSet();        
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 임시 처리 
    async close_(){
/*
        let sUrl = "/phone-api/qt/saveEvalTest";
        let postParam = {
            CENTER_ID: this.qstnPaperData.CENTER_ID,
            PAPER_ID: this.qstnPaperData.PAPER_ID,
            //EVAL_ID: this.qstnPaperData.EVAL_ID,
            //USER_ID : this.searchParams.USER_ID,
            evalQstnPaperExam: this.paperEvalData,
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
            //this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
            console.log('close_');
        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
*/
      this.showConfirmInfo({msg:"답안을 제출 하시겠습니까?(미리보기)",callYes : ()=>{
          this.showToastSuccess({msg : "정상 제출 되었습니다.(미리보기)"})
          this.$emit('ConfirmTest')
          this.closeAlert()
        },
      callNo : this.closeAlert
      })

    },

    close(){
      // this.mixin_fullscreen_off()
      this.$emit('ConfirmTest')
    }
  },
  async mounted() {    
    this.selectEvalQstnPaperPreview();
  },
  created() {
  },
  computed: {
  },
  watch: {
    paperPreviewData_() {
      //console.info('watch ::: ' + this.paperPreviewData_);            
    }

  },
};
</script>

<style lang="scss" scoped>

</style>