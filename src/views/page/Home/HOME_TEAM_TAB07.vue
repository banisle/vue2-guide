<template>
  <div class="px-6">
    <!-- search @change="SRCH_PARAMS_TOP.SRCH_DEPT.value=''" -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
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
                @change="chageCenter"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN' || computedUserType === 'LEADER'">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-autocomplete
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체', 'Y'/*콜센터여부,없으면전체*/ )"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가연도
          </span>
          <div class="pl-desc">
            <v-select
              v-model="modelDateY"
              :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,undefined)"
              class="pl-form type-middle is-sm"/>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가월
          </span>
          <div class="pl-desc">
            <v-select
              v-model="searchParams.EVL_MONTH"
              :items="evl_month_item"
              class="pl-form type-middle is-sm"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            이의제기
          </span>
          <div class="pl-desc">
            <v-select
              v-model="searchParams.OBJT_YN"
              :items="DROP_OBJT_YN"
              class="pl-form type-middle"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            사번
          </span>
          <div class="pl-desc">
           <v-text-field
            class="pl-form type-middle"
            placeholder="사번입력"
            v-model="searchParams.SRCH_USER_ID"
            @keyup.enter="clickSearchBtn"
           ></v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
           <v-text-field
            class="pl-form type-middle"
            placeholder="성명입력"
            v-model="searchParams.SRCH_USER_NM"
            @keyup.enter="clickSearchBtn"
           ></v-text-field>
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon" @click="clickSearchBtn">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left spacing-wrap sp-16 ">
        <span class="pl-bullet-txt is-blue"><strong>{{modelDateY}}년 <span class="is-txt-blue" v-if="!mixin_isEmpty(monthText)">({{monthText}}월)</span> 업무평가 결과 </strong></span>
        <div class="spacing-wrap sp-8 ml-4">
          <div v-if="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED">
            <span>팀 평균</span>
            <strong class="pl-badge is-lg ml-2 px-2 is-txt-black" style="background: #E1FFEF">{{TEAM_AVG_SCORE}}점</strong>
          </div>
          <div>
            <span>센터 평균</span>
            <strong class="pl-badge is-lg ml-2 px-2 is-txt-black" style="background: #DDEBFB">{{CENTER_AVG_SCORE}}점</strong>
          </div>
        </div>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ goEvalList.length }})</em> 명</span>
        <!-- 엑셀 다운로드 버튼
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn>-->

        <compo-excel
            TypeProp="Download"
            :DataHeaderProp="headers"
            :DataBodyProp="goEvalList"
            :FileNameProp="fileName"
            SheetNameProp="업무평가 현황"
          />


      </div>
    </div>

    <!--  goEvalList -->
    <v-data-table
      class="pl-grid has-img is-mt-s is-header-lg"
      :headers="headers"
      :items="goEvalList"
      fixed-header
      item-key="index"
      height="calc(-325px + 100vh)"
      hide-default-header
      hide-default-footer
      :items-per-page="ROW_PER_PAGE"
      :page.sync="page"
      @page-count="pageCount = $event"
      :loading="mixin_loadding"
      no-data-text="등록된 데이터가 없습니다."
     >
      <template v-slot:header="{ props }">
        <thead class="v-data-table-header multi-row">
          <tr>
            <th
              v-for="(header, index) in props.headers" :key="index"
              class="text-center"
              :width="header.width"
              :style="getHeaderStyle(index)">
              {{ header.text }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:item.EVAL_EMP_NM="{ item }">
        <td class="text-center ">
          <img :src="item.IMG" :alt="item.EVAL_EMP_NM" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          <strong class="ml-1">{{ item.EVAL_EMP_NM }}</strong>
        </td>
      </template>
      <!-- 응시여부 -->
      <template v-slot:item.PROC_YN_NM="{ item }">
        <td
          :class="`text-center ${ mixin_displayStatus(item.PROC_YN_NM, 'STAT_LIST')}`">
          <strong>{{ item.PROC_YN_NM }}</strong>
        </td>
      </template>
      <!-- 반영점수 -->
      <template v-slot:item.EVAL_SCORE="{ item }">
        <td
          style="box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px 0px 0 0px var(--primary-color) !important;"
          :style="goEvalList.length == item.ROW_NUM && 'box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px -1px 0 0px var(--primary-color) !important'"
          class="text-center ">
          <strong>{{ item.EVAL_SCORE }}</strong>
        </td>
      </template>
      <!-- 이의제기 -->
      <template v-slot:item.OBJT_TEXT = {item}>
        <span
          v-if="item.OBJT_ID"
          >{{ item.OBJT_TYPE }} <span :class="`is-txt-${mixin_displayStatus(item.OBJT_STTS_CD_NM, 'STAT_LIST2')}`">({{ item.OBJT_STTS_CD_NM }})</span></span>
      </template>
      <!-- 평가결과 버튼 -->
      <template v-slot:item.view="{item}">
        <v-btn
          @click="showDetail(item.CENTER_ID, item.EVAL_ID, item.EVAL_EMP_NO)"
          class="pl-btn is-sub is-sm">보기</v-btn>
      </template>
    </v-data-table>
    <div class="pl-pager">
      <div class="pl-pager-row">
        <span>페이지당 항목 수</span>
        <v-select
          class="pl-form"
          :value="ROW_PER_PAGE"
          :items="perPage"
          :item-text="toString(ROW_PER_PAGE)"
          @change="ROW_PER_PAGE = parseInt($event, 10);"
        ></v-select>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        :total-visible="7">
      </v-pagination>
      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(goEvalList, page) }} / {{ goEvalList.length }}
        <!-- <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp="nextDisabled"
        ></compo-tooltip-btn> -->
      </span>
    </div>

    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogDetail === true "
        class="pl-quick-layer"
        style="width: 800px"
        :style="tempCenterStyle"
              >
        <QTM_M0400_TEST_DETAIL
          @Close="closeSlide()"
          :qstnPaperData="qstnPaperData"
        />
      </div>
    </v-slide-x-reverse-transition>

  </div>
</template>

<script>
import HOME_TEST_DETAIL from '@/views/page/Home/HOME_TEST_DETAIL'
import QTM_M0400_TEST_DETAIL from "@/views/page/QTM_M0400_TEST_DETAIL";
export default {
  name: "HOME_TEAM_TAB07", // HOME 업무평가 ( 팀장급 )
  components: {
    HOME_TEST_DETAIL,
    QTM_M0400_TEST_DETAIL
  },
  data() {
    return {
      common_ognz_list : [],
      // search
      //modelBaseDate: '2024년',
      modelBaseMonth: '6월',
      modelBaseType: '전체',

      // dialog
      dialogDetail: false,

      // grid
      page: 1,
      pageCount: 1,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled: false,

      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false,  },
        { text: '성명', value: 'EVAL_EMP_NM', align: 'center', width: '100px', sortable: false,  },
        { text: '소속', value: 'EVAL_DEPT_NM', align: 'center', width: '120px', sortable: false,  },
        { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '120px', sortable: false,  },
        { text: '급수', value: 'JBPS_CD_NM', align: 'center', width: '120px', sortable: false,  },
        { text: '평가일', value: 'EVAL_ST_DD_C', align: 'center', width: '120px', sortable: false,  },
        { text: '응시여부', value: 'PROC_YN_NM', align: 'center', width: '120px', sortable: false,  },
        { text: '총점', value: 'TOT_SCORE', align: 'center', width: '120px', sortable: false,  },
        { text: '반영점수', value: 'EVAL_SCORE', align: 'center', width: '120px', sortable: false,  },
        { text: '팀내순위', value: 'TEAM_RANK', align: 'center', width: '120px', sortable: false,  },
        { text: '전체순위', value: 'CENTER_RANK', align: 'center', width: '120px', sortable: false,  },
        { text: '이의제기', value: 'OBJT_TEXT', align: 'center', width: '120px', sortable: false,  },
        { text: '평가결과', value: 'view', align: 'center', width: '100px', sortable: false,  },
      ],
      items: [],
      STAT_LIST: [
        { code: '응시', value: ''},
        { code: '미응시', value: 'is-txt-red'},
      ],
      // 상태 컬러
      STAT_LIST2: [
        { code: '종결', value: 'green'},
        { code: '요청', value: 'cyan'},
        { code: '취소', value: 'red'},
        { code: '신청', value: 'org'},
      ],

      // 이의제기 콤보 박스
      DROP_OBJT_YN:[
        {text:"전체", value:""},
        {text:"있음", value:"Y"},
        {text:"없음", value:"N"},
      ],


      // 공통코드
      allCodeList: [],
      // 센터
      DROP_CENTER_LIST: [],

      evl_month_item: [
        { text: "전체", value:'' },
        { text: "1월", value:'01' },{ text: "2월", value:'02' },
        { text: "3월", value:'03' },{ text: "4월", value:'04' },
        { text: "5월", value:'05' },{ text: "6월", value:'06' },
        { text: "7월", value:'07' },{ text: "8월", value:'08' },
        { text: "9월", value:'09' },{ text: "10월", value:'10' },
        { text: "11월", value:'11' },{ text: "12월", value:'12' },
      ],

      searchParams: {
        CENTER_ID: "",
        EVL_MONTH: this.$moment().format("MM"),
        EVAL_YYYY: this.modelDateY,
        EVAL_MNG:'',
        USER_ID:'',
        SRCH_USER_NM: '',
        SRCH_USER_ID: '',
      },

      modelDateMM: this.$moment(new Date()).format('MM'),

      modelDateY: this.$moment(new Date()).format('YYYY'),
      evl_crtr_code: [],//평가기준 년월
      goEvalList: [],
      goEvalCenterList: [],
      qstnPaperData:{},

      TEAM_AVG_SCORE: 0,
      CENTER_AVG_SCORE: 0,

      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_ST: this.$moment(new Date()).subtract(60,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
        SRCH_CNSLT_DIV_CD_1:'', //상담유형 대분류
        SRCH_IDNTY_YN: '',  //확인여부
        SRCH_OUTSIDE_YN: '',  //구분 내부I, 외부E
      },

      fileName:"",
      monthText: false,
    }
  },
  methods: {
    getHeaderStyle(index) {
      if (index === 8) {
        return 'box-shadow: inset 1px 0px 0 0px var(--primary-color), inset 0px 1px 0 0px var(--primary-color), inset -1px 1px 0 0px var(--primary-color) !important;';
      }
      return '';
    },
    closeSlide(){
      this.dialogDetail = false
    },

    // 사용자별 평가 결과
    showDetail(CENTER_ID, EVAL_ID, EVAL_EMP_NO) {
      this.qstnPaperData = {
          CENTER_ID: CENTER_ID,
          EVAL_ID: EVAL_ID,
          USER_ID: EVAL_EMP_NO,
      };

      this.dialogDetail = true;
    },

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectGoEvalList();
    },

    chageCenter(){
      this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '';
    },

    // 평가결과 조회
    async selectGoEvalList(){
      // 초기화
      this.goEvalList = [];
      this.goEvalCenterList = [];

      this.TEAM_AVG_SCORE = 0;
      this.CENTER_AVG_SCORE = 0;
      
      this.monthText = this.searchParams.EVL_MONTH;

      let EVAL_DATE_ = this.searchParams.EVL_MONTH != '' ? this.modelDateY+this.searchParams.EVL_MONTH : '';

      let sUrl = '/phone-api/qt/selectEvaluationReportByDeptNo';
      let postParam = {
        //CENTER_ID: this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID != '' ? this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID : '1' , //this.searchParams.CENTER_ID,
        EVAL_DATE : EVAL_DATE_,
        EVAL_YEAR : this.modelDateY,
        EVAL_DEPT_NO : this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID,
        SRCH_USER_NM : this.searchParams.SRCH_USER_NM,
        SRCH_USER_ID : this.searchParams.SRCH_USER_ID
      };

      if(this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID !== '') {
        postParam.CENTER_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID;
      }else {
        postParam.CENTER_ID = "1";
      }
      
      let headParam = {};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.goEvalList = response.DATA.map(row=>{
          row.EVAL_START_DTTM = this.mixin_convertDate(row.EVAL_ST_DD, 'yyyy-MM-dd HH:mm:ss');
          row.EVAL_END_DTTM = this.mixin_convertDate(row.EVAL_EN_DD, 'yyyy-MM-dd HH:mm:ss');
          row.OBJT_TEXT = this.mixin_isEmpty(row.OBJT_ID) ? "" : row.OBJT_TYPE+"("+row.OBJT_STTS_CD_NM+")";
          return row
        });
        this.goEvalCenterList = response.CENTER_REPORT;

        if(this.searchParams.OBJT_YN === 'Y'){
          this.goEvalList = response.DATA.filter(item => item.OBJT_ID !== null && item.OBJT_ID !== '');
        }else if(this.searchParams.OBJT_YN === 'N') {
          this.goEvalList = response.DATA.filter(item => item.OBJT_ID === null || item.OBJT_ID === '');
        }

        if(this.goEvalList.length > 0){
          //this.TEAM_AVG_SCORE = this.getAvgScore("EVAL_SCORE");
          this.TEAM_AVG_SCORE = parseFloat(this.goEvalList[0].AVG_EVAL_SCORE).toFixed(2);
          this._AVG_SCORE = parseFloat(this.goEvalList[0].AVG_EVAL_SCORE).toFixed(2);
          if(this.goEvalCenterList.length > 0){
            this.CENTER_AVG_SCORE = this.getAvgScore_center("EVAL_SCORE");
          }
        }

        this.addCenterRank();
        this.fileName = EVAL_DATE_+"_업무평가 현황";

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    addCenterRank() {
      this.goEvalList = this.goEvalList.map(person => {
        const match = this.goEvalCenterList.find(center =>
          center.EVAL_EMP_NO === person.EVAL_EMP_NO &&
          center.EVAL_ID === person.EVAL_ID
        );

        if (match) {
          person.CENTER_RANK = match.CENTER_RANK;
        }

        return person;
      });
    },

    //팀별 평균의 평균
    getAvgScore_team(col){
      let departmentScores = {};
      let departmentCounts = {};

      for(let i=0; i<this.goEvalList.length; i++){
        const deptNo = this.goEvalList[i].EVAL_DEPT_NO;
        if (!this.mixin_isEmpty(this.goEvalList[i][col])) {
          if (!departmentScores[deptNo]) {
            departmentScores[deptNo] = 0;
            departmentCounts[deptNo] = 0;
          }
          departmentScores[deptNo] += parseFloat(this.goEvalList[i][col]);
          departmentCounts[deptNo]++;
        }
      }

      let averages = {};
      let totalSum = 0;
      let totalCount = 0;

      for (let dept in departmentScores) {
          averages[dept] = (departmentCounts[dept] === 0) ? 0 : (departmentScores[dept] / departmentCounts[dept]).toFixed(2);
          totalSum += parseFloat(averages[dept]);
          totalCount += (departmentCounts[dept] > 0) ? 1 : 0;
      }
      const overallAverage = totalCount === 0 ? 0 : (totalSum / totalCount).toFixed(2);
      return overallAverage;
    },

    // 평균
    getAvgScore(col){
      let sum = 0;
      let cnt = 0;

      // 평가결과가 존재하는 건만 계산
      for(let i=0;i<this.goEvalList.length;i++){
        if(!this.mixin_isEmpty(this.goEvalList[i][col])){
          sum += parseFloat(this.goEvalList[i][col]);
          cnt++;
        }
      }

      return cnt == 0 ? 0 :(sum/cnt).toFixed(2);
    },

    getAvgScore_center(col){
      let sum = 0;
      let cnt = 0;

      // 평가결과가 존재하는 건만 계산
      for(let i=0;i<this.goEvalCenterList.length;i++){
        if(!this.mixin_isEmpty(this.goEvalCenterList[i][col])){
          sum += parseFloat(this.goEvalCenterList[i][col]);
          cnt++;
        }
      }

      return cnt == 0 ? 0 :(sum/cnt).toFixed(2);
    },

  },
  async mounted() {
    // 사용자 정보
    this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;
    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    let codeList = ['TEST_DV'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    this.searchParams.EVL_MONTH = this.modelDateMM;


  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();

    this.common_ognz_list = await this.mixin_ognz_list();//조직

    if( this.computedUserType === 'LEADER' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.computedUserCenter;
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.computedUserCenterDeptId;
      if( this.computedUserDetailType.indexOf("CENTER_LEADER") === -1) {  //센터장이 아닌경우 자기자신부서만.
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
      }else {
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }
    }else if( this.computedUserType === 'ETC_ADMIN' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
    }

    this.selectGoEvalList();

    // 재조회
    this.$eventBus.$on("refreshObjtGridList", () => {
      this.selectGoEvalList();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>