<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                센터
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="searchParams.CENTER_ID"
                  :items="DROP_CENTER_LIST"
                  class="pl-form type-middle"
                  placeholder="전체"
                   @change="changeCenter"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                  :StartDayProp.sync="ST_DT"
                  :EndDayProp.sync="END_DT"
                  @startDayChange="mixin_testLog(ST_DT)"
                  @endDayChange="mixin_testLog(END_DT)"
                  ParentStyleProp="width: 306px"
                />
              </div>
            </div>
            <!--
            <div class="pl-form-inline">
              <span class="pl-label">
                진행상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-xs"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            -->
            <div class="pl-form-inline">
              <span class="pl-label">
                평가 제목
              </span>
              <div class="pl-desc">
               <v-text-field
                class="pl-form type-middle is-lg"
                placeholder="검색어 입력"
                v-model="searchParams.SRCH_EVAL_TITLE"
                 @keyup.enter="changeSearchParams"
               ></v-text-field>
              </div>
            </div>
            <div>
              <v-btn  @click="clickSearchBtn('')" class="pl-btn is-icon" >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
              <compo-tooltip-btn
                TitleProp="초기화 "
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="searchParamsReset()"
              ></compo-tooltip-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-trans" @click="clickRegistBtn">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans" @click="clickDeleteBtn">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ evalQstnPlanList.length }})</em> 건</span>
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
              :DataBodyProp="evalQstnPlanList"
              :FileNameProp="fileName"
              SheetNameProp="평가 계획 관리 현황"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover has-control"
          :headers="headers"
          :items="evalQstnPlanList"
          v-model="checkedPlanList"
          show-select
          single-select
          fixed-header
          item-key="ROW_NUM"
          height="calc(-306px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail"
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- 평가시간 -->
          <template v-slot:item.EVAL_TIME="{ item }">
            {{ item.EVAL_TIME }}분
          </template>

          <!-- 대상자 -->
          <template v-slot:item.CUST_CNT="{ item }">
            <v-btn
              @click="showUserDetail({item})"
              class="pl-btn is-sm is-esp">{{ item.CUST_CNT }}명</v-btn>
          </template>

          <!-- 진행상태 -->
          <template v-slot:item.STATE="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.STATE, 'STAT_LIST')}`"
              style="width: 60px;"
              >
            {{ item.STATE }}</span>
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
            보기 {{ mixin_getPagePeriod(evalQstnPlanList, page) }} / {{ evalQstnPlanList.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="clickSearchBtn('next')"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- side panel : 등록 -->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        :style="tempCenterStyle"
        v-if=" dialogDetail === true ">
        <div class="pl-quick-layer-header"><h1>평가 계획 상세</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
         <QTM_M0200_DETAIL
          ref="QTM_M0200_DETAIL"
          @Close="dialogDetail = false"
          @Select="selectEvalQstnPlanList"
          :propsQstnPlanData="qstnPlanData"
          :propsQstnPlanPaperData="addItemSet"
          />

      </div>
    </v-slide-x-reverse-transition>

    <!-- dialog: 평가 대상자 설정 -->
    <v-dialog
      v-model="dialogSelectTarget"
      v-if="dialogSelectTarget"
      content-class="dialog-draggable"
      width="1200"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가 대상자 설정"
        @hide="mixin_hideDialog('SelectTarget')"
        @submit="submitDialog('SelectTarget')"
      >
      !<!-- :propsQstnEvalIdData="checkedPlanList"-->
        <template slot="body">
          <QTM_M0200_DIALOG
          ref="QTM_M0200_DIALOG"
          :propsQstnPlanData="qstnPlanData"
          @refresh="selectEvalQstnPlanList"
          />
        </template>
      </compo-dialog>
    </v-dialog>


 </div>
</template>

<script>
import QTM_M0200_DETAIL from './QTM_M0200_DETAIL'
import QTM_M0200_DIALOG from './QTM_M0200_DIALOG'

export default {
  name: "MENU_QTM_M0200", // 평가계획 관리
  components: {
    QTM_M0200_DETAIL,
    QTM_M0200_DIALOG,
  },
  data() {
    return {
      // top
      modelTopCenter: '마이홈센터',
      itemsTopCenter: ['마이홈센터'],
     // ST_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      //END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      //ST_DT: this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'), // 시작 일자(일주일전)
      int_ST_DT: this.$moment(this.startDate).subtract(2,'months').format('YYYY-MM-DD'), //
      int_END_DT: this.$moment(this.startDate).subtract(-2,'months').format('YYYY-MM-DD'), //

      ST_DT: '',
      END_DT: '',

      // 공통코드
      allCodeList: [],
      // 센터
      DROP_CENTER_LIST: [],

      searchParams:{
        //CUSTCO_ID: "",
        CENTER_ID: "",
        QSTN_TYPE: "",
        USE_YN: "",
        SRCH_EVAL_TITLE: "",
        PROC_STAT:"",
        ST_DT:"",
        END_DT:""
      },

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
        { text: '평가연도', value: 'EVAL_YYYY', align: 'left', width: '5%',sortable: true },
        { text: '센터', value: 'CENTER_NM', align: 'left', width: '8%',sortable: true },
        { text: '평가 제목 ', value: 'EVAL_TITLE', align: 'left', width: '', sortable: true },
        { text: '평가 시작일', value: 'EVAL_ST_DD', align: 'center', width: '10%', sortable: true },
        { text: '평가 종료일', value: 'EVAL_EN_DD', align: 'center', width: '10%', sortable: true },
        { text: '평가 시간', value: 'EVAL_TIME', align: 'center', width: '5%', sortable: false },
        { text: '문제 수', value: 'QSTN_CNT', align: 'center', width: '5%', sortable: false },
        { text: '총 점수', value: 'TOT_SCORE', align: 'center', width: '5%', sortable: false },
        { text: '대상자', value: 'CUST_CNT', align: 'center', width: '5%', sortable: false },
        { text: '진행상태', value: 'STATE', align: 'center px-0', width: '6%', sortable: true },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '6%', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'center', width: '10%', sortable: true },
     ],

      evalQstnPlanList:[],
      checkedPlanList: [],
      qstnPlanData: {},
      addItemSet: {},

      items: [],

      STAT_LIST2: [
        { code: '2', value: 'yellow'},
        { code: '1', value: 'red'},
      ],

      STAT_LIST: [
        { code: '평가전', value: 'yellow'},
        { code: '평가종료', value: 'red'},
        { code: '평가중', value: 'green'},
      ],

      curentTime : this.$moment().format('YYYYMMDDHHmmss'),

      isNew: true,
      isConfirm : true,

      // detail
      dialogDetail: false,

      // dialog: 평가 대상자 관리
      dialogSelectTarget: false,

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가 계획을 삭제하시겠습니까?', callYes: this.deleteQaPaperplan, callNo: this.closeAlert, },
        },
        ALERT:{
          DEL_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가 계획을 선택해주세요..' },
          DEL_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가 시작되었거나 종료된 평가는 삭제/수정할 수 없습니다.' },
        },
        TOAST : {
          DEL_DONE : {  msg: '평가 계획이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      fileName:"",
    }
  },
  methods: {

    searchParamsReset(){
      this.searchParams.SRCH_EVAL_TITLE = '';
      this.ST_DT= this.int_ST_DT;
      this.END_DT= this.int_END_DT;
    },

    changeSearchParams(){
      this.selectEvalQstnPlanList();
    },

    clickRegistBtn(){
      this.isNew = true;
      // 상세정보 초기화
      this.qstnPlanData = {
        CENTER_ID : this.searchParams.CENTER_ID
        , EVAL_TITLE : ""
        , EVAL_ID : ""
        , PAPER_ID : ""
        , EVAL_TIME : 15
        , EVAL_COMMENT: ""
        , EVAL_MNG: ""
        , EVAL_ST_DD: ""
        , EVAL_YYYY: ""
        , isNew: true
        , isConfirm: true
      };
      // 상세팝업 열기
      if(this.dialogDetail){
        // 상세팝업이 열린 상태로 등록 버튼 클릭 시
        this.$refs.QTM_M0200_DETAIL.setQstnPlanData(this.qstnPlanData);
      }else{
        this.dialogDetail = true;
      }
    },

    // 평가 대상 사용자
    showUserDetail({item}){

      if(item.EVAL_ST_DD_CK < this.curentTime){
        this.isConfirm = false;
      }else{
        this.isConfirm = true;
      }
      
      this.qstnPlanData = {
          CENTER_ID : item.CENTER_ID
        , EVAL_ID : item.EVAL_ID
        , isConfirm : this.isConfirm
        , SRCH_EVAL_YEAR : item.EVAL_YYYY
        , SRCH_EVAL_MONTH : item.EVAL_ST_DD_CK.substring(4,6)
      };
      this.$set(this.qstnPlanData, "CENTER_ID", item.CENTER_ID)
      this.$set(this.qstnPlanData, "EVAL_ID", item.EVAL_ID)
      this.$set(this.qstnPlanData, "isConfirm", this.isConfirm)
      this.$set(this.qstnPlanData, "SRCH_EVAL_YEAR", item.EVAL_YYYY)
      this.$set(this.qstnPlanData, "SRCH_EVAL_MONTH", item.EVAL_ST_DD_CK.substring(4,6))
      this.mixin_showDialog('SelectTarget');
      //this.$refs.QTM_M0200_DIALOG.setQstnPlanDataRe(this.qstnPlanData);
    },

    // curentTime(){
    //   const ctDate_ = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString() ;
    //   const ctDate =  ctDate_.replaceAll('-','').replaceAll(' ','').replaceAll(':','').replaceAll('T','').substring(0, 14);
    //   return ctDate;
    // },

    // 내용 수정 창
    showDetail(e, {item}){
      // 평가 시작 전인지 체크
      const ctDate_ = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString() ;
      const ctDate =  ctDate_.replaceAll('-','').replaceAll(' ','').replaceAll(':','').replaceAll('T','').substring(0, 14);

      if(item.EVAL_ST_DD_CK < ctDate){
        this.isConfirm = false;
      }else{
        this.isConfirm = true;
      }

      this.qstnPlanData = {};
      this.addItemSet = {};
      this.addItemSet = {
        PAPER_ID: this.qstnPlanData.PAPER_ID,
        PAPER_TITLE: this.qstnPlanData.PAPER_TITLE,
        QSTN_CNT: this.qstnPlanData.QSTN_CNT,
        TOT_SCORE:this.qstnPlanData.TOT_SCORE,
        QSTN_ARR: this.qstnPlanData.QSTN_ARR,
        QSTN_ARR_NM:this.qstnPlanData.QSTN_ARR_NM,
        EVAL_MNG: this.qstnPlanData.EVAL_MNG,
        EVAL_MNG_NM: this.qstnPlanData.EVAL_MNG_NM
      };

      this.qstnPlanData = {
        CENTER_ID : item.CENTER_ID
        , EVAL_ID : item.EVAL_ID
        , EVAL_TITLE : item.EVAL_TITLE
        , PAPER_ID : item.PAPER_ID
        , PAPER_TITLE : item.PAPER_TITLE
        , EVAL_TIME : item.EVAL_TIME
        , EVAL_COMMENT: item.EVAL_COMMENT
        , EVAL_MNG: item.EVAL_MNG
        , EVAL_MNGNM: item.EVAL_MNG_NM
        , EVAL_ST_DD: item.EVAL_ST_DD
        , EVAL_ST_DD_CK: item.EVAL_ST_DD_CK
        , EVAL_YYYY: item.EVAL_YYYY
        , QSTN_ARR: item.QSTN_ARR
        , QSTN_ARR_NM:item.QSTN_ARR_NM
        , QSTN_CNT: item.QSTN_CNT
        , TOT_SCORE: item.TOT_SCORE
        , isNew: false
        , isConfirm : this.isConfirm
      };

      // 상세팝업 열기
      if(this.dialogDetail){
        // 상세팝업이 열린 상태로 등록 버튼 클릭 시
        this.$refs.QTM_M0200_DETAIL.setQstnPlanData(this.qstnPlanData);
        //this.$refs.QTM_M0200_DETAIL.setQstnPlanPaperData(this.addItemSet);
      }else{
        this.dialogDetail = true;
      }

    },
    // 센터 조건 변경 시 이벤트
    changeCenter(){
      this.dialogDetail = false;
      this.selectEvalQstnPlanList();
    },
    // 조회버튼 클릭
    clickSearchBtn(next){
      this.selectEvalQstnPlanList(next);
    },

    async selectEvalQstnPlanList(next){
      // 초기화
      this.isConfirm = true
      this.evalQstnPlanList = [];
      this.checkedPlanList = [];

      if (next != 'next'){
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/phone-api/qt/selectEvalQstnPlanList';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        SRCH_EVAL_TITLE: this.searchParams.SRCH_EVAL_TITLE,

        ST_DT: this.ST_DT.replaceAll('-','').replaceAll(' ','') + '000000',
        END_DT:this.END_DT.replaceAll('-','').replaceAll(' ','') + '235959',
      };

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.evalQstnPlanList = response.DATA;
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.fileName = "평가 계획 관리 현황";
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //평가 계획 삭제
    clickDeleteBtn(){
      if(this.checkedPlanList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL01);
        return;
      }

      if(this.checkedPlanList[0].EVAL_ST_DD_CK < this.curentTime ){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL02);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    //평가 계획 삭제
    async deleteQaPaperplan(){

      let sUrl = '/phone-api/qt/delEvalQstnPlan';
      let postParam = {
        EVAL_ID: this.checkedPlanList[0].EVAL_ID,
      };

      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.closeAlert();
        this.selectEvalQstnPlanList();
        this.showToast(this.MESSAGE.TOAST.DEL_DONE);

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    }

  },
  async mounted() {
    let codeList = ['EVST'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.selectEvalQstnPlanList();
  },
  created() {
    this.ST_DT = this.int_ST_DT;
    this.END_DT = this.int_END_DT;
  },
  computed: {
    //reversedItems() {
    //  return this.items.slice().reverse();
   // },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>