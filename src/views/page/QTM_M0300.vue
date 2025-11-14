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
              <v-btn
                class="pl-btn is-icon" @click="clickSearchBtn()"
                >
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
            <span class="pl-bullet-txt is-blue">목록에서 <strong>응시현황 항목의 버튼을 클릭</strong> 하시면 응시자별 상세현황을 조회할 수 있습니다.</span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ goEvalPlanList.length }})</em> 건</span>
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
            :DataBodyProp="goEvalPlanList"
            :FileNameProp="fileName"
            SheetNameProp="평가 진행 관리 현황"
          />
          </div>
        </div>
        <!-- grid @dblclick:row="showDetail" -->
        <v-data-table
          class="pl-grid is-mt-s is-hover has-control"
          :headers="headers"
          :items="goEvalPlanList"
          fixed-header
          item-key="ROW_NUM"
          height="calc(-306px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          :page.sync="page"
          @page-count="pageCount = $event">

          <!-- 응시 현황 -->
          <template v-slot:item.PROC_CUST="{ item }">
            <v-btn
              @click="showUserDetail({item})"
              class="pl-btn is-sm">{{ item.PROC_CUST }}</v-btn>
          </template>
          <!-- 진행상태 -->
          <template v-slot:item.STATE="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.STATE, 'STAT_LIST')}`"
              style="width: 60px;"
              >
            {{ item.STATE }}</span>
          </template>

          <!-- 공개 -->
          <template v-slot:item.EXPLAIN_SHOW_YN="{ item }">
            <template v-if="item.EXPLAIN_SHOW_YN === 'Y'">
              <v-btn class="pl-btn is-sm is-esp" @click.stop="clickPaperShowBtn(item, 'N')" :disabled="item.STATE != '평가종료'">공개취소</v-btn>
            </template>
            <template v-else-if="item.EXPLAIN_SHOW_YN === 'N'">
              <v-btn class="pl-btn is-sm" @click.stop="clickPaperShowBtn(item, 'Y')" :disabled="item.STATE != '평가종료'">공개하기</v-btn>
            </template>
            <template v-else>
              <v-btn class="pl-btn is-sm is-sub" >공개불가</v-btn>
            </template>
          </template>

          <!-- 이의제기 기간 -->
          <template v-slot:item.OBJT_RANGE_BTN="{ item }">
            <v-btn
              @click.stop="clickObjtRangeBtn(item)"
              :class="`pl-btn is-sm ${item.OBJT_RANGE_YN == 'Y' ? 'is-esp2' : 'is-sub'}`"
              :disabled="item.STATE != '평가종료'"
              >
              기간 설정
            </v-btn>
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
            보기 {{ mixin_getPagePeriod(goEvalPlanList, page) }} / {{ goEvalPlanList.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="clickSearchBtn(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- dialog:평가 응시 현황 상세 -->
    <v-dialog
      v-model="dialogSelectDetail"
      v-if="dialogSelectDetail"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가 응시 현황 상세"
        @hide="mixin_hideDialog('SelectDetail')"
        @submit="submitDialog('SelectDetail')"
      >
        <template slot="body">
          <QTM_M0300_DETAIL
          ref="QTM_M0300_DETAIL"
          :propsQstnPlanResultData="qstnPlanResultData"
          />
        </template>
      </compo-dialog>
    </v-dialog>



    <!-- dialog: 이의제기기간 - 기간설정  -->
    <v-dialog
      v-model="dialogSetDate"
      v-if="dialogSetDate"
      content-class=""
      width="430"
      hide-overlay>
      <compo-dialog
        @hide="mixin_hideDialog('SetDate')"
        @submit="submitDialog('SetDate')"
      >
        <template slot="header">
          <div class="d-flex align-center px-6 py-4 is-bg-white" >
            <strong style="font-size: 15px">이의제기 기간</strong>
            <v-btn
              @click="mixin_hideDialog('SetDate')"
              plain
              min-width="22"
              height="22"
              class="pl-tooltip-btn ml-auto"
          >
            <v-icon
                small
                class="pl-icon20 dialog-close-black">
            </v-icon>
          </v-btn>
          </div>
        </template>
        <template slot="body" >
          <QTM_M0300_DIALOG ref="QTM_M0300_DIALOG" @close="mixin_hideDialog('SetDate')" @refresh="selectGoEvalPlanList" :propsData="propsData"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SetDate')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickObjtRangeSaveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>


 </div>
</template>

<script>
import QTM_M0300_DETAIL from '@/views/page/QTM_M0300_DETAIL'
import QTM_M0300_DIALOG from '@/views/page/QTM_M0300_DIALOG'

export default {
  name: "MENU_QTM_M0300", // 평가 진행 관리
  components: {
    QTM_M0300_DETAIL,
    QTM_M0300_DIALOG
  },
  data() {
    return {
      // top
      modelTopCenter: '마이홈센터',
      itemsTopCenter: ['마이홈센터'],
      //date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      //date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      int_ST_DT: this.$moment(this.startDate).subtract(2,'months').format('YYYY-MM-DD'), //
      int_END_DT: this.$moment(this.startDate).subtract(-2,'months').format('YYYY-MM-DD'), //

      ST_DT: '',
      END_DT: '',

      // 공통코드
      allCodeList: [],
      // 센터
      DROP_CENTER_LIST: [],

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
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '년도', value: 'EVAL_YYYY', align: 'center', width: '55px',sortable: true },
        { text: '센터', value: 'CENTER_NM', align: 'center', width: '90px',sortable: true },
        { text: '평가 종류', value: 'EVAL_MNG_NM', align: 'center', width: '80px', sortable: true },
        { text: '평가 제목 ', value: 'EVAL_TITLE', align: 'left', width: '', sortable: true },
        { text: '평가 시작일', value: 'EVAL_ST_DD', align: 'center', width: '140px', sortable: true },
        { text: '평가 종료일', value: 'EVAL_EN_DD', align: 'center', width: '140px', sortable: true },
        { text: '대상자', value: 'TOT_CUST', align: 'center', width: '70px', sortable: true },
        { text: '응시 현황', value: 'PROC_CUST', align: 'center', width: '90px', sortable: true },
        { text: '진행상태', value: 'STATE', align: 'center px-0', width: '90px', sortable: true },
        { text: '공개여부', value: 'EXPLAIN_SHOW_YN', align: 'center px-0', width: '90px', sortable: true },
        { text: '공개일자', value: 'EVL_RLS_DT', align: 'center', width: '80px', sortable: true },
        { text: '이의제기', value: 'OBJT_RANGE_BTN', align: 'center px-0', width: '90px', sortable: false },
        { text: '이의제기 마감일', value: 'OBJT_END_DT1', align: 'center', width: '120px', sortable: true },
        { text: '재결요청 마감일', value: 'OBJT_END_DT2', align: 'center', width: '120px', sortable: true },
      ],
      items: [],
      STAT_LIST: [
        { code: '평가전', value: 'yellow'},
        { code: '평가종료', value: 'red'},
        { code: '평가중', value: 'green'},
      ],

      searchParams:{
        CENTER_ID: "",
        QSTN_TYPE: "",
        USE_YN: "",
        SRCH_PAPER_TITLE: "",
        PROC_STAT:"",
        USER_ID:"",
        ST_DT:"",
        END_DT:""
      },

      qstnPlanResultData: {},

      goEvalPlanList:[],

      rsltEvalPlanData: {},

      // dialog: 평가 응시 현황 상세
      dialogSelectDetail: false,

      MESSAGE: {
        CONFIRM: {
          EXPLAIN_SHOW_YN:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '', callYes: this.updatePaperShowYn, callNo: this.closeAlert, },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      fileName : "평가 진행 관리 현황",

      propsData:{},
      // 이의제기 상세
      dialogSetDate: false,

    }
  },
  methods: {

    clickObjtRangeSaveBtn(){
      if(this.$refs.QTM_M0300_DIALOG) this.$refs.QTM_M0300_DIALOG.clickSaveBtn();
    },

    // 이의 기간설정
    clickObjtRangeBtn(item){
      this.propsData = {
        CENTER_ID: item.CENTER_ID
        , PAPER_NM: item.EVAL_TITLE
        , EVAL_ID: item.EVAL_ID
        , OBJT_END_DT_1CYCL: item.OBJT_END_DT_1CYCL
        , OBJT_END_DT_2CYCL: item.OBJT_END_DT_2CYCL
      }
      this.mixin_showDialog('SetDate');
    },

    searchParamsReset(){
      this.searchParams.SRCH_EVAL_TITLE = '';
      this.ST_DT= this.int_ST_DT;
      this.END_DT= this.int_END_DT;
    },

    async updatePaperShowYn(){
      this.closeAlert();
      //let sUrl = '/api/biz/common/update/updatePaperShowYn';
      let sUrl = '/phone-api/qt/updatePaperShowYn';

      let postParam = {
        CENTER_ID: this.rsltEvalPlanData.CUSTCO_ID
        , EVAL_ID: this.rsltEvalPlanData.EVAL_ID
        , USER_ID: this.searchParams.USER_ID
        , EXPLAIN_SHOW_YN: this.rsltEvalPlanData.UPD_EXPLAIN_SHOW_YN
      };

      let headParam = { head : {
        //ns : 'kr.co.hkcloud.lhcs.phone.qt.dao.PhoneQt300Mapper'
        //, sn : 'updatePaperShowYn'
      }};

      console.info(postParam);

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg:(this.rsltEvalPlanData.EXPLAIN_SHOW_YN == "Y" ? "공개" : "공개취소") + " 처리 되었습니다."});
        this.selectGoEvalPlanList();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 공개수정 버튼 클릭 이벤트
    clickPaperShowBtn(item, type){

      this.MESSAGE.CONFIRM.EXPLAIN_SHOW_YN.msg = (type == "Y" ? "공개" : "공개취소") + " 처리 하시겠습니까?";
      this.showAlert(this.MESSAGE.CONFIRM.EXPLAIN_SHOW_YN);

      this.rsltEvalPlanData = item;
      this.rsltEvalPlanData.UPD_EXPLAIN_SHOW_YN = type;
    },

    changeCenter(){
      this.selectGoEvalPlanList();
    },

    changeSearchParams(){
      this.selectGoEvalPlanList();
    },
    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectGoEvalPlanList();
    },

    // 평가지 조회
    async selectGoEvalPlanList(next){
      // 초기화
      this.goEvalPlanList = [];

      if (next == 'next'){
        //
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/phone-api/qt/selectGoEvalPlanList';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        SRCH_EVAL_TITLE : this.searchParams.SRCH_EVAL_TITLE,
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
        this.goEvalPlanList = response.DATA.map(row=>{
          row.OBJT_END_DT1 =  this.mixin_isEmpty(row.OBJT_END_DT_1CYCL) ? "" : this.$moment(row.OBJT_END_DT_1CYCL, 'YYYYMMDDHHmmss').format("YYYY-MM-DD HH:mm");
          row.OBJT_END_DT2 =  this.mixin_isEmpty(row.OBJT_END_DT_2CYCL) ? "" :this.$moment(row.OBJT_END_DT_2CYCL, 'YYYYMMDDHHmmss').format("YYYY-MM-DD HH:mm");
          return row;
        });
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },


    // 평가 대상 사용자
    showUserDetail({item}){
      this.qstnPlanResultData = {
        CENTER_ID : item.CENTER_ID
        , EVAL_ID : item.EVAL_ID
      };
      this.mixin_showDialog('SelectDetail');
    },


  },
  async mounted() {

    let codeList = ['EVST', 'TEST_DV', 'PAPER_ORD'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 사용자 정보
    this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
          this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.selectGoEvalPlanList();
  },
  created() {
    this.ST_DT = this.int_ST_DT;
    this.END_DT = this.int_END_DT;
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>