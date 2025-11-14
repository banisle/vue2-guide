<template>
  <div>
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
              <span class="pl-bullet-txt is-blue">
                <strong>응시자 현황</strong> [ {{this.propsQstnPlanData.EVAL_TITLE}} ] </span>
          </div>
          <div class="pl-grid-top-utils">
              <span class="pl-counter"
                  >전체
                  <em class="pl-1 is-txt-blue">({{ getGvalPlanResult.length }})</em>
                  건</span
              >
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                    TypeProp="Download"
                    :DataHeaderProp="headers"
                    :DataBodyProp="getGvalPlanResult"
                    :FileNameProp="fileName"
                    SheetNameProp="평가 결과 범주별 현황"
                />
          </div>
      </div>
      <!-- grid -->
      <v-data-table
          class="pl-grid is-mt-s"
          :headers="headers"
          :items="getGvalPlanResult"
          fixed-header
          hide-default-header
          item-key="index"
          height="348px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail"
          :page.sync="page"
          @page-count="pageCount = $event"
      >
          <template v-slot:header>
              <thead class="v-data-table-header multi-row">
                  <tr>
                      <th rowspan="2" width="50px" class="text-center">
                          <span>번호</span>
                      </th>
                      <th rowspan="2" width="90px" class="">
                          <span>성명</span>
                      </th>
                      <th rowspan="2" width="70px" class="">
                          <span>사번</span>
                      </th>
                      <th rowspan="2" width="100px" class=""><span>소속</span></th>
                      <th rowspan="2" width="5%" class="text-center">
                          <span>응시여부</span>
                      </th>
                      <th rowspan="2" width="140px" class="text-center">
                          <span>평가 동의 일시</span>
                      </th>
                      <th rowspan="2" width="140px" class="text-center">
                          <span>답안 제출 일시</span>
                      </th>
                      <th colspan="8" width="" class="text-center">
                          <span>득점</span>
                      </th>
                      <th colspan="7" width="" class="text-center">
                          <span>정답율(%)</span>
                      </th>
                      <th rowspan="2" width="5%" class="text-center">
                          <span>순위</span>
                      </th>
                  </tr>
                  <tr>
                      <!-- 득점 --> 
                      <th class="text-center"><span>분양</span></th>
                      <th class="text-center"><span>임대</span></th>
                      <th class="text-center"><span>상가/용지</span></th>
                      <th class="text-center"><span>주거복지</span></th>
                      <th class="text-center"><span>보금자리</span></th>
                      <th class="text-center"><span>기타</span></th>
                      <th class="text-center"><span>렌트홈</span></th>
                      <th class="text-center"><span>총점</span></th>


                      <!-- 정답율 -->
                      <th class="text-center"><span>분양</span></th>
                      <th class="text-center"><span>임대</span></th>
                      <th class="text-center"><span>상가/용지</span></th>
                      <th class="text-center"><span>주거복지</span></th>
                      <th class="text-center"><span>보금자리</span></th>
                      <th class="text-center"><span>기타</span></th>
                      <th class="text-center"><span>렌트홈</span></th>
                  </tr>
              </thead>
          </template>
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
          <!-- 평가지 공개 -->
          <template v-slot:item.type04="{ item }">
              <span
                  :class="`is-txt-${mixin_displayStatus(
                      item.type04,
                      'STAT_LIST',
                  )}`"
              >
                  {{ item.type04 }}</span
              >
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
          <template v-slot:item.LAST_SBMSN_DT="{ item }">
              <span v-if=" (item.LAST_SBMSN_DT !== null && item.LAST_SBMSN_DT !== '0' )">{{ item.LAST_SBMSN_DT }}</span>
              <span v-else></span> 
          </template>
          <template v-slot:item.LAST_AGREE_DT="{ item }">
              <span v-if=" (item.LAST_AGREE_DT !== null && item.LAST_AGREE_DT !== '0' )">{{ item.LAST_AGREE_DT }}</span>
              <span v-else></span> 
          </template>
          <template v-slot:item.EVAL_SCORE="{ item }">
            <span :class="`center font-weight-bold`" >{{ item.EVAL_SCORE }}</span>
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
  name: "QTM_M0400_TAB_02", //평가 결과 관리 - 범주별
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
          //ROW_PER_PAGE: 20,
          ROW_PER_PAGE: -1,
          init_HEADERS: [            
          ],         

          headers: [
            
            {text:"번호",value:"ROW_NUM",align:"center",width:"50px",sortable:false,},
            {text:"성명",value:"EVAL_EMP_NM",align:"left",width:"100px",sortable:true,},
            {text:"사번",value:"EVAL_EMP_NO",align:"left",width:"100px",sortable:true,},
            {text:"소속",value:"EVAL_DEPT_NM",align:"left",width:"100px",sortable:true,},
            {text:"응시여부",value:"PROC_YN_NM",align:"center",width:"6%",sortable:true,},
            {text:"평가동의일시",value:"LAST_AGREE_DT",align:"center",width:"100px",sortable:true,},
            {text:"답안제출일시",value:"LAST_SBMSN_DT",align:"center",width:"100px",sortable:true,},

            // 득점 
            {text:"분양",value:"VC01_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"임대",value:"VC02_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"상가/용지",value:"VC03_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"주거복지",value:"VC04_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"보금자리",value:"VC05_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"기타",value:"VC06_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"렌트홈",value:"VC07_SCORE",align:"center",width:"4%",sortable:true,},
            {text:"총점",value:"EVAL_SCORE",align:"center",width:"4%",sortable:true,},

            // 정답율
            {text:"분양",value:"VC01_PER",align:"center",width:"4%",sortable:true,},
            {text:"임대",value:"VC02_PER",align:"center",width:"4%",sortable:true,},
            {text:"상가/용지",value:"VC03_PER",align:"center",width:"4%",sortable:true,},
            {text:"주거복지",value:"VC04_PER",align:"center",width:"4%",sortable:true,},
            {text:"보금자리",value:"VC05_PER",align:"center",width:"4%",sortable:true,},
            {text:"기타",value:"VC06_PER",align:"center",width:"4%",sortable:true,},
            {text:"렌트홈",value:"VC07_PER",align:"center",width:"4%",sortable:true,},


            {text:"순위",value:"SCORE_RANK",align:"center",width:"4%",sortable:true,},
          ],
          items: [
              {
                  index: 151,
                  img: require("@/assets/img/@manager_profile.png"),
                  type01: "한가람",
                  type02: "800001",
                  type03: "마이홈1팀",
                  type04: "응시완료",
                  type05: "2024-06-20 08:55:45",
                  type06: "2024-06-20 08:55:45",
                  type07: 20,
                  type08: 60,
                  type09: 10,
                  type10: 10,
                  type11: 100,
                  type12: 10,
                  type13: 10,
                  type14: 10,
                  type15: 10,
                  type16: 1,
              }
          ],
          STAT_LIST: [{ code: "미응시", value: "org" }],
          // dialog
          dialogDetail: false,

          P_VC_TOTAL_CNT: 0,

          getGvalPlanResult: [],

          P_VC_INFO: [],
          fileName: "평가 결과 관리 범주별 현황",
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
    },

    clickSearchBtn(){
        this.selectEvalPlanResult();
    },

    parseDataSet() {

        //this.headers = [],
        //this.headers = Object.assign([], this.init_HEADERS);

        this.getGvalPlanResult.forEach((data) => {           

            this.P_VC_INFO.forEach((vc) => {
                const cntKey = `${vc.CD_ID}_CNT`;
                const corCntKey = `${vc.CD_ID}_COR_CNT`;
                //const perKey = `${vc.CD_ID.toLowerCase()}_per`;
                const perKey = `${vc.CD_ID}_PER`;

                const cnt = parseFloat(data[cntKey]) || 0;
                const corCnt = parseFloat(data[corCntKey]) || 0;
                data[perKey] = cnt === 0 ? "0" : (Math.round((corCnt / cnt) * 1000) / 10).toString();
            });

            Object.keys(data).forEach((key) => {
                if (data[key] === "" || data[key] === null) {
                    data[key] = "0";
                }
                 if (key === "LAST_SBMSN_DT" && (data[key] === "" || data[key] === null)) {                    
                    data[key] = null; // 또는 다른 적절한 기본값으로 설정
                }
            });

        });

        //console.log(JSON.stringify(this.getGvalPlanResult, null, 2));

    },

    sortByName(a, b) {
        return a.EVAL_EMP_NM.localeCompare(b.EVAL_EMP_NM);
    },

    // 결과 조회
    async selectEvalPlanResult() {
        console.info("selectEvalPlanResult");
        // 초기화
        this.goEvalByQuestionList = [];

        let sUrl = "/phone-api/qt/selectEvalPlanResult";
        let postParam = {
            CENTER_ID: this.propsQstnPlanData.CENTER_ID,
            EVAL_ID: this.propsQstnPlanData.EVAL_ID, 
            PAPER_ID: this.propsQstnPlanData.PAPER_ID,             
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
            this.P_VC_INFO = response.P_VC_INFO;    // 범주 정보 ( {"CD_ID":"VC03","CD_NM":"상가/용지"}  )
            this.P_VC_TOTAL_CNT = this.P_VC_INFO.length;          

            this.getGvalPlanResult = response.DATA.map((row) => {
                row.P_VC_TOTAL_CNT = this.P_VC_TOTAL_CNT;                
                if (row.ICON_IMG_URI !== "/")
                    row.IMG = "/upload/" + row.ICON_IMG_URI;
                else
                    row.IMG = require("@/assets/img/@manager_profile_default.png");
                return row;
            }).sort(this.sortByName);               
            this.parseDataSet();
        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
    },

    closeSlide() {
        this.dialogDetail = false;
    },
  },
  mounted() {
    this.selectEvalPlanResult();
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
                
                this.selectEvalPlanResult();
            }
        }
    },
};
</script>

<style lang="scss" scoped></style>
