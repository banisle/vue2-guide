<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
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
        <!--
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
        </div>-->
        <div class="pl-form-inline">
          <span class="pl-label">
            평가유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-md flex-grow-0"
              placeholder="선택"
              :items="mixin_common_code_get(this.allCodeList, 'TEST_DV', '')"
              v-model="searchParams.EVAL_MNG"
            />
          </div>
        </div>
        <v-btn class="pl-btn is-icon" @click="clickSearchBtn">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>

    <div class="is-border-top pt-2">
      <div>
        <!-- grid top -->
        <div class="pl-grid-top ">
          <div class="pl-grid-top-left">
            <span class="pl-bullet-txt is-blue">평가 월별 평가 결과</span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ goEvalList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="EXCEL_headers"
                :DataBodyProp="goEvalList"
                :FileNameProp="fileName"
                SheetNameProp="평가 월별 결과 현황"
                />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="headers"
          :items="goEvalList"
          item-class="cellClass"
          fixed-header
          item-key="index"
          height="calc(-288px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.EVAL_START_TIME = {item}>
            {{ item.EVAL_ST_DD.substr(8, 2) + ":"+item.EVAL_ST_DD.substr(10, 2) }}
          </template>
          <template v-slot:item.EVAL_END_TIME = {item}>
            {{ item.EVAL_EN_DD.substr(8, 2) + ":"+item.EVAL_EN_DD.substr(10, 2) }}
          </template>

          <template v-slot:item.EVAL_TIME = {item}>
            {{ item.EVAL_TIME }} 분
          </template>

           <!-- 이의제기 -->
          <template v-slot:item.OBJT_TEXT = {item}>
            <span
              v-if="item.OBJT_ID"
              >{{ item.OBJT_TYPE }} <span :class="`is-txt-${mixin_displayStatus(item.OBJT_STTS_CD_NM, 'STAT_LIST2')}`">({{ item.OBJT_STTS_CD_NM }})</span></span>
          </template>

          <!-- :disabled="!item.type09" -->
          <template v-slot:item.view = {item}>
            <v-btn
              @click="showDetail(item.CENTER_ID, item.EVAL_ID)"
              class="pl-btn is-sm is-sub">보기</v-btn>
          </template>
          <template v-slot:item.type10 = {item}>
            <span
              v-if="item.type10"
              v-bind="attrs"
              v-on="on">있음 <span :class="`is-txt-${mixin_displayStatus(item.type10, 'STAT_LIST')}`">({{ item.type10 }})</span></span>
          </template>

        </v-data-table>
      </div>

    </div>
    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogDetail === true "
        class="pl-quick-layer"
        style="width: 800px"
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
  name: "HOME_MANAGER_TAB05", // HOME 업무평가 ( 사용자 )
  components: {
    HOME_TEST_DETAIL,
    QTM_M0400_TEST_DETAIL
  },
  data() {
    return {
      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      //modelDateY: '2024년',
      modelDateM: '6월',
      modelType: '정기평가',

      // dialog
      dialogDetail: false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled:false,
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '평가일', value: 'EVAL_ST_DD_C', align: 'center', width: '110px', sortable: false },
        { text: '평가지 명', value: 'EVAL_TITLE', align: 'left', width: '', sortable: false },
        { text: '평가유형', value: 'EVAL_MNG_NM', align: 'center', width: '9%', sortable: false },
        { text: '시작시간', value: 'EVAL_START_TIME', align: 'center', width: '9%', sortable: false },
        { text: '종료시간', value: 'EVAL_END_TIME', align: 'center', width: '9%', sortable: false },
        { text: '시험시간', value: 'EVAL_TIME', align: 'center', width: '9%', sortable: false },
        { text: '배점', value: 'TOT_SCORE', align: 'center', width: '9%', sortable: false },
        { text: '점수', value: 'EVAL_SCORE', align: 'center', width: '9%', sortable: false },
        { text: '이의제기', value: 'OBJT_TEXT', align: 'center', width: '9%', sortable: false },
        { text: '평가 결과', value: 'view', align: 'center', width: '90px', sortable: false },
      ],
      EXCEL_headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '평가일', value: 'EVAL_ST_DD_C', align: 'center', width: '110px', sortable: false },
        { text: '평가지 명', value: 'EVAL_TITLE', align: 'left', width: '150px', sortable: false },
        { text: '평가유형', value: 'EVAL_MNG_NM', align: 'center', width: '100px', sortable: false },
        { text: '시작시간', value: 'EVAL_START_DTTM', align: 'center', width: '180px', sortable: false },
        { text: '종료시간', value: 'EVAL_END_DTTM', align: 'center', width: '180px', sortable: false },
        { text: '시험시간', value: 'EVAL_TIME', align: 'center', width: '100px', sortable: false },
        { text: '배점', value: 'TOT_SCORE', align: 'center', width: '100px', sortable: false },
        { text: '점수', value: 'EVAL_SCORE', align: 'center', width: '100px', sortable: false },
        { text: '이의제기', value: 'OBJT_TEXT', align: 'center', width: '100px', sortable: false },
        { text: '평가 결과', value: 'view', align: 'center', width: '90px', sortable: false },
      ],
      
      // 상태 컬러
      STAT_LIST: [
        { code: '진행', value: 'blue'},
        { code: '종결', value: 'green'},
      ],
      STAT_LIST2: [
        { code: '종결', value: 'green'},
        { code: '요청', value: 'cyan'},
        { code: '취소', value: 'red'},
        { code: '신청', value: 'org'},
      ],


      // 공통코드
      allCodeList: [],
      // 센터
      DROP_CENTER_LIST: [],

      evl_month_item: [
        { text: "1월", value:'01' },{ text: "2월", value:'02' },
        { text: "3월", value:'03' },{ text: "4월", value:'04' },
        { text: "5월", value:'05' },{ text: "6월", value:'06' },
        { text: "7월", value:'07' },{ text: "8월", value:'08' },
        { text: "9월", value:'09' },{ text: "10월", value:'10' },
        { text: "11월", value:'11' },{ text: "12월", value:'12' },
      ],

      searchParams: {
        CENTER_ID: "",
        EVL_MONTH: "01",
        EVAL_YYYY: this.modelDateY,
        EVAL_MNG:'',
        USER_ID:'',
      },

      modelDateMM: this.$moment(new Date()).format('MM'),

      modelDateY: this.$moment(new Date()).format('YYYY'),
      evl_crtr_code:[],//평가기준 년월
      goEvalList: [],
      qstnPaperData:{},

      fileName: "평가 월별 결과 현황",

    }
  },
  methods: {

    setMonth(){
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;

      if(month < 10){
        this.searchParams.EVL_MONTH = '0'+month;
      }else{
        this.searchParams.EVL_MONTH = month;
      }
    },

    // 사용자별 평가 결과
    showDetail(CENTER_ID, EVAL_ID) {
      this.qstnPaperData = {
          CENTER_ID: this.searchParams.CENTER_ID,
          EVAL_ID: EVAL_ID,
          USER_ID: this.searchParams.USER_ID,
      };
      this.dialogDetail = true;
    },

    closeSlide(){
      this.dialogDetail = false
    },

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectGoEvalList();
    },

    // 평가결과 조회
    async selectGoEvalList(next){
      // 초기화
      this.goEvalList = [];

      //if(this.mixin_isEmpty(this.searchParams.EVL_MONTH)){
      //  this.showAlertInfo({msg:"평가월을 선택해주세요."});
      //  return
      //}

      //let EVAL_DATE_ = this.searchParams.EVL_MONTH != '' ? this.modelDateY+this.searchParams.EVL_MONTH : '';

      let sUrl = '/phone-api/qt/selectEvaluationReportByEmpNo';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        //EVAL_DATE : EVAL_DATE_,
        EVAL_YEAR : this.modelDateY,
        EVAL_MNG: this.searchParams.EVAL_MNG,
      };

      let headParam = {}

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.goEvalList = response.DATA.map(row=>{
          row.EVAL_START_DTTM = this.mixin_convertDate(row.EVAL_ST_DD, 'yyyy-MM-dd HH:mm:ss');
          row.EVAL_END_DTTM = this.mixin_convertDate(row.EVAL_EN_DD, 'yyyy-MM-dd HH:mm:ss');
          row.OBJT_TEXT = this.mixin_isEmpty(row.OBJT_ID) ? "" : row.OBJT_TYPE+"("+row.OBJT_STTS_CD_NM+")";
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
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

    this.selectGoEvalList();
  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();

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