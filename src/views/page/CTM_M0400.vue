<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
    <!-- sub top -->
    <compo-sub-layout-top  >
      <template slot="search">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              조회기간
            </span>
            <div class="pl-desc">
              <compo-date-range-picker
                :StartDayProp.sync="searchParams.FROM_DT"
                :EndDayProp.sync="searchParams.TO_DT"
                ParentStyleProp="width: 306px"
              />
            </div>
          </div>

          <div class="pl-form-inline">
            <span class="pl-label">
              센터
            </span>
            <div class="pl-desc">
              <v-select
                :items="DROP_CENTER_LIST"
                v-model="searchParams.SRCH_CUSTCO_ID"
                class="pl-form type-middle"
                placeholder="전체" />
            </div>
          </div>
          <div>
            <v-btn
              class="pl-btn is-icon"
              @click="clickSearchBtn"
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="clickClearBtn"
            ></compo-tooltip-btn>
          </div>

        </div>
      </template>
    </compo-sub-layout-top>
    <!-- sub content -->
    <div class="pl-card-body">
       <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <strong class="pl-bullet-txt is-blue">센터별 일일업무 보고 현황 </strong>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ gridDataText.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="excelDataHeaders"
            :DataBodyProp="gridDataText"
            FileNameProp="센터별 일일업무 보고 현황"
            SheetNameProp="일일업무 보고서"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover"
        :headers="gridDataHeaders"
        :items="gridDataText"
        fixed-header
        item-key="ROW_NUM"
        height="calc(-306px + 100vh)"
        hide-default-footer
        :items-per-page="ROW_PER_PAGE"
        :page.sync="page"
        @page-count="pageCount = $event"
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">

        <template v-slot:item.LAST_RPT_YN_NM="{ item }">
          <span
            :class="`pl-badge is-${mixin_displayStatus(item.LAST_RPT_YN_NM, 'STAT_LIST')}`"
            style="width: 40px;"
            >
          {{ item.LAST_RPT_YN_NM }}</span>
        </template>

        <!-- 내용 -->
        <template v-slot:item.REPORT_BTN="{ item }">
          <compo-tooltip-btn
            TitleProp="보고서 보기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 board-docu"
            TooltipPositionProp="bottom"
            @btnClick="clickReportBtn(item)"
          ></compo-tooltip-btn>
        </template>
      </v-data-table>

      <div class="pl-pager">
        <div class="pl-pager-row">
          <span>페이지당 항목 수</span>
          <v-select
            class="pl-form"
            v-model="ROW_PER_PAGE"
            :items="perPage"
            :item-text="toString(ROW_PER_PAGE)"
            @change="ROW_PER_PAGE = parseInt(ROW_PER_PAGE);"
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
          보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="selectDayTaskReportList(true)"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

   </div>
   <!-- dialog: 일일 업무 관리 -->
    <v-dialog
      v-model="dialogReport"
      v-if="dialogReport"
      content-class="dialog-draggable is-lg is-nopadding is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="일일 업무 관리"
        @hide="mixin_hideDialog('Report')"
      >
        <template slot="body">
          <!-- component -->
          <CSM_M0200_DIALOG ref="CSM_M0200_DIALOG" :propsData="propsData" :isPreview="true" @refresh="selectDayTaskReportList" @setBtn="(data)=>{isFinal = data == 'Y'?true:false}"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Report')">닫기</v-btn>
          <!-- <v-btn class="pl-btn is-esp" @click="clickFinalBtn" v-if="!isFinal">최종보고</v-btn>
          <v-btn class="pl-btn" @click="clickSaveBtn" v-if="!isFinal">저장</v-btn> -->
        </template>
      </compo-dialog>
    </v-dialog>
 </div>
</template>

<script>
import CSM_M0200_DIALOG from '@/views/page/CSM_M0200_DIALOG'

export default {
  name: "MENU_CTM_M0400", //일일업무 관리
  components: {
    CSM_M0200_DIALOG
  },
  data() {
    return {
      DROP_CENTER_LIST:[],

      searchParams:{
        FROM_DT: this.$moment().subtract(1, "months").format('YYYY-MM-DD')
        , TO_DT: this.$moment().format("YYYY-MM-DD")
        , SRCH_CUSTCO_ID: ""
      },

      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      nextDisabled: true,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: "",
      },
      loading: false,

      gridDataHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '센터', value: 'DEPT_NM', align: 'left', width: '360px', sortable: true },
        { text: '일자', value: 'RPT_DAY', align: 'center', width: '110px', sortable: true },
        { text: '근무인원 이슈', value: 'WORKER_ISSUE', align: 'center', width: '110px', sortable: true },
        { text: '상담 이슈', value: 'CUTT_ISSUE', align: 'center', width: '110px', sortable: true },
        { text: '민원 현황', value: 'CVLCPT_RCPT', align: 'center', width: '110px', sortable: true },
        { text: '시스템 장애', value: 'SYS_ISSUE', align: 'center', width: '110px', sortable: true },
        { text: '교육', value: 'EDU_CN_TEXT', align: 'center', width: '110px', sortable: true },
        { text: '상태', value: 'LAST_RPT_YN_NM', align: 'center', width: '110px', sortable: true },
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '110px', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'center', width: '150px', sortable: true },
        { text: '보고서', value: 'REPORT_BTN', align: 'center', width: '110px', sortable: false },
      ],

      excelDataHeaders:[
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '센터', value: 'DEPT_NM', align: 'left', width: '360px', sortable: true },
        { text: '일자', value: 'RPT_DAY', align: 'center', width: '110px', sortable: true },
        { text: '근무인원 이슈', value: 'WORKER_ISSUE', align: 'center', width: '110px', sortable: true },
        { text: '근무인원 이슈 내용', value: 'WKATTD_EXCPTNMTTR', align: 'center', width: '200px', sortable: true },
        { text: '기타 상담 현황 비고', value: 'ETC_CUTT_RMRK', align: 'center', width: '200px', sortable: true },
        { text: '상담 이슈', value: 'CUTT_ISSUE', align: 'center', width: '110px', sortable: true },
        { text: '이슈 사항', value: 'CUTT_EXCPTNMTTR1', align: 'center', width: '200px', sortable: true },
        { text: '자체 대응 사항', value: 'CUTT_EXCPTNMTTR2', align: 'center', width: '200px', sortable: true },
        { text: '익일 또는 차주 상담 이슈 예측 사항', value: 'CUTT_EXCPTNMTTR3', align: 'center', width: '200px', sortable: true },
        { text: '민원 현황', value: 'CVLCPT_RCPT', align: 'center', width: '110px', sortable: true },
        { text: '시스템 장애', value: 'SYS_ISSUE', align: 'center', width: '110px', sortable: true },
        { text: '시스템 장애 내용', value: 'SYS_DSBLTY_RSN', align: 'center', width: '200px', sortable: true },
        { text: '교육', value: 'EDU_CN_TEXT', align: 'center', width: '110px', sortable: true },
        { text: '교육 내용', value: 'EDU_CN', align: 'center', width: '200px', sortable: true },
        { text: '상태', value: 'LAST_RPT_YN_NM', align: 'center', width: '110px', sortable: true },
        { text: '등록자', value: 'RGTR_NM', align: 'center', width: '110px', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'center', width: '150px', sortable: true },
      ],

      gridDataText: [],

      STAT_LIST: [
        { code: '보고됨', value: 'blue'},
        { code: '미보고', value: 'red'},
      ],

      //dialog
      dialogReport: false,
      propsData:{
        RPT_DAY: ""
        , SRCH_CUSTCO_ID: ""
      },

      // 최종보고, 저장버튼 표시 여부
      isFinal: false,
    }
  },
  methods: {
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.FROM_DT) || this.mixin_isEmpty(this.searchParams.TO_DT)){
        this.showAlertInfo({msg:""});
        return false;
      }

      this.selectDayTaskReportList();
    },

    // 일일업무 보고서 목록 조회
    async selectDayTaskReportList(next){
      if(!next){
        this.pagination.page = 1
        this.nextDisabled = true;
      }

      // let sUrl = '/phone-api/task/selectDayTaskReportList';
      let sUrl = '/api/biz/common/select/selectDayTaskReportList';

      let postParam = {
        FROM_DT: this.searchParams.FROM_DT.replaceAll("-", "")
        , TO_DT: this.searchParams.TO_DT.replaceAll("-", "")
        , SRCH_CUSTCO_ID: this.searchParams.SRCH_CUSTCO_ID
        , LAST_RPT_YN: "Y"
      };

      let headParam = { head : {
        ns : 'lhcs.phone.cuttMng.task.dao.xml.PhoneDayTaskReportMapper'
        , sn : 'selectDayTaskReportList'
        , ROW_CNT: this.pagination.rowsPerPage
        , PAGES_CNT: this.pagination.page
        , PAGING: "Y"
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.gridDataText = response.DATA.map(row=>{
          row.REPORT_BTN = "";
          return row;
        });

        if (Number(response.HEADER.COUNT) < Number(this.pagination.rowsPerPage)) {
          this.nextDisabled = true  //버튼 비활성화
        }else{
          this.nextDisabled = false //버튼 활성화
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }

      this.loading = false;
    },

    // 보고서 버튼
    clickReportBtn(item){
      this.propsData.RPT_DAY = item.RPT_DAY;
      this.propsData.SRCH_CUSTCO_ID = item.TASK_CUSTCO_ID;
      this.isFinal = item.LAST_RPT_YN == "Y" ? true : false;
      this.dialogReport = true;
    },

    clickClearBtn(){
      this.searchParams = {
        FROM_DT: this.$moment().subtract(1, "months").format('YYYY-MM-DD')
        , TO_DT: this.$moment().format("YYYY-MM-DD")
        , SRCH_CUSTCO_ID: ""
      };
    },
  },
  async mounted() {
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo("전체");
    this.clickSearchBtn();
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
