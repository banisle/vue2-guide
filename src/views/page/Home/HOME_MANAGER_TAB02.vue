<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            기준
          </span>
          <div class="pl-desc">
            <v-select
                v-model="modelBaseDate"
                :items="['조회기간','평가기준']"
                class="pl-form type-middle is-sm"
                placeholder="조회기간"
            ></v-select>
            <template v-if="modelBaseDate === '평가기준'">
              <v-select
                  v-model="modelDateY"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,undefined)"
                  class="pl-form type-middle is-sm"/>
              <v-select
                  v-model="modelDateM"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'month',modelDateY,undefined)"
                  class="pl-form type-middle is-sm"
                  @change="changeCrtrListCombo"
                  return-object/>
            </template>
            <compo-date-range-picker
                ParentStyleProp="width: 300px"
                :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST"
                :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END"
                @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST)"
                @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END)"
            />
          </div>
        </div>
        <v-btn class="pl-btn is-icon" @click="selectGridList">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>

    <div class="pl-cols is-border-top pt-2">
      <div>
        <!-- grid top -->
        <div class="pl-grid-top ">
          <div class="pl-grid-top-left">
            <span class="pl-bullet-txt is-blue">{{modelBaseDate}} 근무 일수 <strong class="ml-1">({{WORK_DAY_COUNT}}일)</strong></span>
          </div>
          <div class="pl-grid-top-utils">
            <v-checkbox v-model="SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN" label="평가적용항목만표시" class="pl-check" @change="selectGridList"></v-checkbox> |
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 건</span>
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
              :DataHeaderProp="GRID.EXCEL_HEADERS"
              :DataBodyProp="GRID.ITEMS"
              :FileNameProp="fileName"
              SheetNameProp="가감점 현황"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="GRID.HEADERS"
          :items="GRID.ITEMS"
          item-class="cellClass"
          fixed-header
          item-key="index"
          height="calc(-288px + 100vh)"
          :items-per-page="-1"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          :loading="mixin_loadding">
        </v-data-table>
      </div>
      <!-- 근태 요약 -->
      <div class="is-col-fix ml-6 d-flex" style="width: 20%; margin-top: 38px;">
        <div class="pl-table-box flex-grow-1">
          <div class="pl-table-box--head">
            <v-icon class="pl-icon20 stat-sign"></v-icon>
            <span class="pl-subtit ml-1">가감점 요약</span>
          </div>
          <div class="pl-table-box--body py-3 px-5 spacing-wrap sp-8 flex-column">
            <div class="d-flex align-center">
              <span style="flex: 0 0 80px">조회 시작일</span>
              <strong>{{ SRCH_PARAMS_TOP.SRCH_ST }}</strong>
            </div>
            <div class="d-flex align-center">
              <span style="flex: 0 0 80px">조회 종료일</span>
              <strong>{{ SRCH_PARAMS_TOP.SRCH_END }}</strong>
            </div>
            <div class="is-border-sub-top is-mt-s pt-3">
              <div class="is-txt-blue text-center">
                <span >가감점</span>
                <strong class="ml-2 font-decimal" style="font-size: 18px">{{ SUMMARY.SCR_TOTAL }}</strong>
              </div>
              <div class="d-flex is-mt-m">
                <div class="text-center is-txt-green flex-grow-1">
                  <v-icon class="pl-icon30 smile-green"></v-icon>
                </div>
                <div class="text-center is-txt-darkgray flex-grow-1">
                  <v-icon class="pl-icon30 smile-black"></v-icon>
                </div>
              </div>
              <div class="d-flex">
                <div class="text-center is-txt-green is-border-sub-right flex-grow-1 py-2">
                  <div class="d-flex flex-column">
                    <span>가점 ({{ SUMMARY.SCR_PLUS_CNT }})</span>
                    <strong class="font-decimal" style="font-size: 14px;">{{ SUMMARY.SCR_PLUS }}</strong>
                  </div>
                </div>
                <div class="text-center is-txt-darkgray flex-grow-1 py-2">
                  <div class="d-flex flex-column">
                    <span>감점 ({{ SUMMARY.SCR_MINUS_CNT }})</span>
                    <strong class="font-decimal" style="font-size: 14px;">{{ SUMMARY.SCR_MINUS }}</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "HOME_MANAGER_TAB02", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      evl_crtr_code:[], //평가기준 년월
      SRCH_PARAMS_TOP:{
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_EVL_APLCN_YN: false,
      },

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      WORK_DAY_COUNT:0,  //조회기간 근무일수


      // grid
      GRID:{
        HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '최종처리일시', value: 'MDFCN_DT', align: 'center', width: '160px', sortable: false },
          { text: '처리자', value: 'MDFR_ID_NM', align: 'center', width: '10%', sortable: false },
          { text: '처리일', value: 'APLCN_YMD_DD', align: 'center', width: '12%', sortable: false },
          { text: '유형', value: 'STRT_YN_NM', align: 'center', width: '6%', sortable: false },
          { text: '항목', value: 'ARTCL_NM', align: 'left', width: '13%', sortable: false },
          { text: '점수', value: 'SCR', align: 'center', width: '6%', sortable: false },
          { text: '내용', value: 'RSN', align: 'left', width: '', sortable: false },
        ],
        EXCEL_HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '최종처리일시', value: 'MDFCN_DT', align: 'center', width: '160px', sortable: false },
          { text: '처리자', value: 'MDFR_ID_NM', align: 'center', width: '100px', sortable: false },
          { text: '처리일', value: 'APLCN_YMD_DD', align: 'center', width: '100px', sortable: false },
          { text: '유형', value: 'STRT_YN_NM', align: 'center', width: '50px', sortable: false },
          { text: '항목', value: 'ARTCL_NM', align: 'left', width: '100px', sortable: false },
          { text: '점수', value: 'SCR', align: 'center', width: '200px', sortable: false },
          { text: '내용', value: 'RSN', align: 'left', width: '200px', sortable: false },
        ],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
      },
      SUMMARY: {
        SCR_TOTAL:0, //가감점 토탈
        SCR_MINUS:0, //감점
        SCR_MINUS_CNT:0, //감점
        SCR_PLUS:0, //가점
        SCR_PLUS_CNT:0, //가점
      },

      fileName: '가감점 현황',
    }
  },
  methods: {
    async selectGridList() {

      this.GRID.ITEMS = [];
      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/selectEmpAdorsubPeriodUserList';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      if( this.SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN ) {
        postParam.SRCH_EVL_APLCN_YN = 'Y';
      }

      //SUMMARY 초기화
      this.SUMMARY.SCR_TOTAL = 0;
      this.SUMMARY.SCR_PLUS = 0;
      this.SUMMARY.SCR_PLUS_CNT = 0;
      this.SUMMARY.SCR_MINUS = 0;
      this.SUMMARY.SCR_MINUS_CNT = 0;

      let headParam = {head:{ns : 'lhcs.system.user.dao.AdorsubMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let i = 0;
        let rt_total = 0;
        let rt_minus = 0;
        response.DATA.map(item => {
          if( i === 0 ) {
            this.WORK_DAY_COUNT = item.WORK_DAY_COUNT;  /* 조회기간 근무일수 */
            this.SUMMARY.SCR_TOTAL = item.SCR_TOTAL;
          }
          if( item.STRT_YN === 'Y' ) {this.SUMMARY.SCR_MINUS = item.STRT_YN_TOTAL; this.SUMMARY.SCR_MINUS_CNT = item.SCR_COUNT_TOTAL; }
          if( item.STRT_YN === 'N' ) {this.SUMMARY.SCR_PLUS = item.STRT_YN_TOTAL; this.SUMMARY.SCR_PLUS_CNT = item.SCR_COUNT_TOTAL; }

          return i++;
        });

        this.GRID.ITEMS = response.DATA;
        this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    changeCrtrListCombo() {
      console.log("changeCrtrListCombo");
      console.log( this.modelDateM );
      if( typeof this.modelDateM === "object") {
        this.SRCH_PARAMS_TOP.SRCH_ST = this.modelDateM.EVL_BGNG_DAY_DD;
        this.SRCH_PARAMS_TOP.SRCH_END = this.modelDateM.EVL_END_DAY_DD;
        this.selectGridList();
      }else {
        this.showToastCaution({msg : '평가기준정보가 없습니다.'})
      }
    }
  },
  mounted() {
  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
    //현재년월 세팅.
    let modelDateMObj = await this.evl_crtr_code.find((item) => (item.YR === this.$moment(new Date()).format('YYYY') && item.MM === this.$moment(new Date()).format('MM') ));
    if( modelDateMObj ) {
      this.modelDateM = {
        text: modelDateMObj.MM_TEXT,
        value: modelDateMObj.MM,
        MM: modelDateMObj.MM,
        EVL_BGNG_DAY: modelDateMObj.EVL_BGNG_DAY,
        EVL_END_DAY: modelDateMObj.EVL_END_DAY,
        EVL_BGNG_DAY_DD: modelDateMObj.EVL_BGNG_DAY_DD,
        EVL_END_DAY_DD: modelDateMObj.EVL_END_DAY_DD,
        WORK_DAY: modelDateMObj.WORK_DAY,
      };
    }

    this.selectGridList();
  },
  computed: {
  },
  watch: {
    modelBaseDate() {
      if( this.modelBaseDate === '조회기간') {
        this.GRID.ITEMS = [];
        this.GRID.ITEMS_TOT_CNT = 0;
        this.SRCH_PARAMS_TOP.SRCH_ST = this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD');
        this.SRCH_PARAMS_TOP.SRCH_END = this.$moment(new Date()).format('YYYY-MM-DD');
        this.selectGridList();
      }else if( this.modelBaseDate === '평가기준') {
        this.GRID.ITEMS = [];
        this.GRID.ITEMS_TOT_CNT = 0;
        this.changeCrtrListCombo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>