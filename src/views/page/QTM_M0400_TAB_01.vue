<template>
    <div>
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
                <span class="pl-bullet-txt is-blue"><strong>응시자 현황</strong> [ {{this.propsQstnPlanData.EVAL_TITLE}} ]</span>
            </div>
            <div class="pl-grid-top-utils">
                <span class="pl-counter"
                    >전체
                    <em class="pl-1 is-txt-blue">({{ goEvalByQuestionList.length }})</em>
                    건</span
                >
                <!-- 엑셀 다운로드 버튼
                <compo-tooltip-btn
                    TitleProp="엑셀 다운로드"
                    ClassProp="pl-tooltip-btn "
                    IconProp="pl-icon20 exceldown"
                    TooltipPositionProp="bottom"
                    @btnClick="mixin_testLog('엑셀 다운로드')"
                ></compo-tooltip-btn> -->
                <compo-excel
                    TypeProp="Download"
                    :DataHeaderProp="headers"
                    :DataBodyProp="goEvalByQuestionList"
                    :FileNameProp="fileName"
                    SheetNameProp="평가 결과 문항별 현황"
                />
            </div>
        </div>
        <!-- grid -->
        <v-data-table
            class="pl-grid is-mt-s is-hover"
            :headers="headers"
            :items="goEvalByQuestionList"
            fixed-header
            item-key="index"
            height="348px"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
            @dblclick:row="showDetail"           
            :style="`${computedUserType !== 'ETC_ADMIN' ? 'max-width: calc(100vw - 405px);' : 'max-width: calc(100vw - 290px);'}`"
        >
            <!-- 대상자 -->
            <template v-slot:item.EVAL_EMP_NM="{ item }">
                <img
                    :src="item.IMG"
                    :alt="item.EVAL_EMP_NM"
                    class="pl-grid-portrait"
                    style="width: 20px; height: 20px"
                    @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                />
                <span class="ml-1">{{ item.EVAL_EMP_NM }}</span>
            </template>

            <!-- 응시 -->
            <template v-slot:item.PROC_YN_NM="{ item }">
                <span
                    :class="`is-txt-${mixin_displayStatus(
                        item.PROC_YN_NM,
                        'STAT_LIST',
                    )}`"
                >
                    {{ item.PROC_YN_NM }}</span
                >
            </template>
            <template v-slot:item.SCORE_RANK="{ item }">
                {{ item.SCORE_RANK }}
            </template>
        </v-data-table>

        <!-- side panel : 상담 상세정보-->
        <v-slide-x-reverse-transition>
            <div
                v-if="dialogDetail === true"
                class="pl-quick-layer"
                style="width: 800px"
                :style="tempCenterStyle"
            >
                <!--HOME_TEST_DETAIL @Close="closeSlide()" /-->
                <QTM_M0400_TEST_DETAIL @Close="closeSlide()" 
                :qstnPaperData="qstnPaperData"
                />
            </div>
        </v-slide-x-reverse-transition>
    </div>
</template>

<script>
//import HOME_TEST_DETAIL from "@/views/page/Home/HOME_TEST_DETAIL";
import QTM_M0400_TEST_DETAIL from "@/views/page/QTM_M0400_TEST_DETAIL";

export default {
    name: "QTM_M0400_TAB_01", //평가 결과 관리 - 문항별
    components: {
        QTM_M0400_TEST_DETAIL,
    },
    props: {
        propsQstnPlanData: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            // grid
            page: 1,
            //pageCount: 0,
            //perPage: [15, 30, 50, 100],            
             ROW_PER_PAGE: -1,
            init_HEADERS: [
            { text: "번호", value: "ROW_NUM", align: "center", width: "50px", sortable: false, },
            { text: "성명", value: "EVAL_EMP_NM", align: "left", width: "90px", sortable: true, },
            { text: "사번", value: "EVAL_EMP_NO", align: "left", width: "70px", sortable: true, },
            { text: "소속", value: "EVAL_DEPT_NM", align: "left", width: "100px", sortable: true, },
            { text: "응시여부", value: "PROC_YN_NM", align: "center", width: "6%", sortable: true,},
            { text: "평가 동의 일시", value: "LAST_AGREE_DT", align: "center", width: "140px", sortable: true, },
            { text: "답안 제출 일시", value: "LAST_SBMSN_DT", align: "center", width: "140px", sortable: true, },
            ],
            headers: [],
            items: [
                {
                    index: 151, img: require("@/assets/img/@manager_profile.png"), type01: "한가람", type02: "800001",
                    type03: "마이홈1팀",
                    type04: "응시완료",
                    type05: "2024-06-20 08:55:45",
                    type06: "2024-06-20 08:55:45",
                    type07: 10, type08: 10, type09: 10, type10: 10, type11: 10,
                    type12: 10, type13: 10, type14: 10, type15: 10, type16: 10,
                    type17: 100, type18: 1,
                }
            ],
            STAT_LIST: [{ code: "미응시", value: "org" }],

            searchParams: {
                CENTER_ID: "",
                SRCH_USER_NM: "",
                EVAL_ID: "",
            },

            goEvalByQuestionList: [],

            QTSN_RANGE: [],
            QTSNCnt: 0,

            PAPER_QSTN_CNT_: {},
            qstnPaperData:{},            

            // dialog
            dialogDetail: false,

            fileName: "평가 결과 관리 문항별 현황",
        };
    },
    methods: {

        // 사용자별 평가 결과 
        showDetail(e, { item }) {                          
          this.qstnPaperData = {
              CENTER_ID: this.propsQstnPlanData.CENTER_ID,
              EVAL_ID: this.propsQstnPlanData.EVAL_ID,
              USER_ID: item.EVAL_EMP_NO,              
          };          

          this.dialogDetail = true;
          //this.$refs.
        },

        closeSlide() {
            this.dialogDetail = false;
        },

        changeSearchParams() {
            this.selectEvalPlanResultByQuestion();
        },
        // 조회버튼 클릭
        clickSearchBtn() {               
            alert('eeee ::: ');         
            this.selectEvalPlanResultByQuestion();
        },

        // 재정렬
        parseDataSet() {
            this.QTSNCnt = this.PAPER_QSTN_CNT_;
            this.QTSN_RANGE = [];
            this.headers = [],
            this.headers = Object.assign([], this.init_HEADERS);

            for (let i in this.goEvalByQuestionList) {
                let { EVAL_QSTN_SCORE } = this.goEvalByQuestionList[i]; 

                //console.info("EVAL_QSTN_SCORE :: "+EVAL_QSTN_SCORE);
                EVAL_QSTN_SCORE = EVAL_QSTN_SCORE.split("|"); 
                
                //if (i == 0) {
                    //this.QTSNCnt = EVAL_QSTN_SCORE.length;
                //}
                // "|"을 기준으로 split한 배열을 순회하면서, 
                //기존 this.goEvalByQuestionList[i] 번째인 Row 오브젝트의 EVAL_QSTN_SCORE_SPLIT_ + index라는 Key값으로 문제 점수를 부여
                for (let j = 0; j < this.QTSNCnt; j++) {
                    if(EVAL_QSTN_SCORE.length > 1){
                        this.goEvalByQuestionList[i][`EVAL_QSTN_SCORE_SPLIT_${j}`] = EVAL_QSTN_SCORE[j];
                    }else{
                        this.goEvalByQuestionList[i][`EVAL_QSTN_SCORE_SPLIT_${j}`] = 0;
                    }
                    
                }              
            }

            for (let Qno = 1; Qno <= this.QTSNCnt; Qno++) {
                this.QTSN_RANGE.push({ Qno });
            }

            this.QTSN_RANGE.map((data, i) => {
                this.headers.push({
                    text: "문제" + data.Qno,
                    value: `EVAL_QSTN_SCORE_SPLIT_${i}`, // Header도 위에 EVAL_QSTN_SCORE_SPLIT_0, EVAL_QSTN_SCORE_SPLIT__1, EVAL_QSTN_SCORE_SPLIT_2 키값에 매칭되게 value 바꿈                    
                    align: "center",
                    width: "60px",
                    sortable: true,
                });
            });

            this.headers.push({
                text: "총점",
                value: "EVAL_SCORE",
                align: "center font-weight-bold",
                width: "60px",
                sortable: true,
            });

            this.headers.push({
                text: "순위",
                value: "SCORE_RANK",
                align: "center ",
                width: "60px",
                sortable: true,
            });
        },

        // 결과 조회
        async selectEvalPlanResultByQuestion() {
            console.info("selectEvalPlanResultByQuestion");
            // 초기화
            this.goEvalByQuestionList = [];

            let sUrl = "/phone-api/qt/selectEvalPlanResultByQuestion";
            let postParam = {
                EVAL_ID: this.propsQstnPlanData.EVAL_ID, 
                SRCH_USER_NM : this.propsQstnPlanData.SRCH_USER_NM,
                SRCH_DEPT_ID : this.propsQstnPlanData.SRCH_DEPT_ID,
            };

            let headParam = {};

            let response = await this.common_postCall(
                sUrl,
                postParam,
                headParam,
            );
            if (!response.HEADER.ERROR_FLAG) {
                this.PAPER_QSTN_CNT_ = response.PAPER_QSTN_CNT[0].QSTN_CNT;
                this.goEvalByQuestionList = response.DATA.map((row) => {
                    if (row.ICON_IMG_URI !== "/")
                        row.IMG = "/upload/" + row.ICON_IMG_URI;
                    else
                        row.IMG = require("@/assets/img/@manager_profile_default.png");
                    return row;
                });                
                this.parseDataSet();
            } else {
                this.showAlert(this.MESSAGE.ERROR.ERROR);
            }
        },

        async setQstnPlanData(obj) {
            console.info("setQstnPlanData");
            this.selectEvalPlanResultByQuestion();
        },
    },
    async mounted() {
        //this.setQstnPlanData(this.propsQstnPlanData);
        this.selectEvalPlanResultByQuestion();
    },
    created() {},
    computed: {
        reversedItems() {
            return this.items.slice().reverse();
        },
    },
    watch: {
        propsQstnPlanData(newVal) {
            if (newVal) {
                console.info('watch ::: ' + this.propsQstnPlanData);
                //this.setQstnPlanData(this.propsQstnPlanData);
                this.selectEvalPlanResultByQuestion();
            }
        }
    },
};
</script>

<style lang="scss" scoped></style>
