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
        <div class="pl-form-inline">
          <span class="pl-label">
            유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-sm"
              :items="mixin_common_code_get(common_code,'TAM','전체')"
              v-model="SRCH_PARAMS_TOP.SRCH_CRTN_ARTCL_CD"
              @change="selectGridList"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <v-btn class="pl-btn is-icon"  @click="selectGridList">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>

    <div class="is-border-top pt-2">
      <div class="pl-cols">
        <div>
          <!-- grid top -->
          <div class="pl-grid-top ">
            <div class="pl-grid-top-left">
              <span class="pl-bullet-txt is-blue">조회조건 총 보정시간 <strong class="ml-1">({{ GRID.ITEMS_WHOL_MNT_TOTAL }}분)</strong></span>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 건</span>
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
              :DataHeaderProp="GRID.HEADERS"
              :DataBodyProp="GRID.ITEMS"
              :FileNameProp="fileName"
              SheetNameProp="보정시간 현황"
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
        <!-- 보정시간 요약 -->
        <div class="is-col-fix ml-6 d-flex" style="width: 20%; margin-top: 38px;">
          <div class="pl-table-box flex-grow-1">
            <div class="pl-table-box--head">
              <v-icon class="pl-icon20 stat-sign"></v-icon>
              <span class="pl-subtit ml-1">보정시간 요약</span>
            </div>
            <div class="pl-table-box--body py-3 px-5 spacing-wrap sp-8 flex-column">
              <div class="d-flex align-center">
                <span style="flex: 0 0 100px">{{modelBaseDate}} 시작일</span>
                <strong> {{ SRCH_PARAMS_TOP.SRCH_ST }}</strong>
              </div>
              <div class="d-flex align-center">
                <span style="flex: 0 0 100px">{{modelBaseDate}} 종료일</span>
                <strong >{{ SRCH_PARAMS_TOP.SRCH_END }}</strong>
              </div>
              <div class="is-mt-s is-txt-blue text-center">
                <span >총 보정시간  </span>
                <strong class="ml-2 font-decimal" style="font-size: 18px">{{ SUMMARY.STAT_AMT }} 분</strong>
              </div>

              <div class="is-border-sub-top is-mt-s pt-3">
                <div class="spacing-wrap sp-8 flex-column">
                  <div
                    class="d-flex align-center"
                    v-for="item in SUMMARY.ITEMS"
                    :key="item.id">
                      <span style="flex: 0 0 80px">{{ item.CRTN_ARTCL_NM }}</span>
                      <strong :class="`ml-auto ${item.class}`">{{ item.WHOL_MNT_SUMMARY }} 분</strong>
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
  name: "HOME_MANAGER_TAB03", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      common_code:[],
      evl_crtr_code:[], //평가기준 년월
      SRCH_PARAMS_TOP:{
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_CRTN_ARTCL_CD: '',
      },

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      // grid
      GRID:{
        HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '최종처리일시', value: 'MDFCN_DTTM', align: 'center', width: '160px', sortable: false },
          { text: '처리자', value: 'MDFR_ID_NM', align: 'center', width: '111px', sortable: false },
          { text: '처리일', value: 'APLCN_YMD_DD', align: 'center', width: '133px', sortable: false },
          { text: '항목', value: 'CRTN_ARTCL_CD_NM', align: 'left', width: '111px', sortable: false },
          { text: '내용', value: 'RSN', align: 'left', width: '235px', sortable: false },
          { text: '시작', value: 'BGNG_HR', align: 'center', width: '77px', sortable: false },
          { text: '종료', value: 'END_HR', align: 'center', width: '77px', sortable: false },
          { text: '점심', value: 'LUNCH_HR', align: 'center', width: '77px', sortable: false },
          { text: '총 시간', value: 'WHOL_MNT', align: 'center', width: '77px', sortable: false },
        ],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
        ITEMS_WHOL_MNT_TOTAL:0,
      },

      SUMMARY: {
        STAT_AMT:0,
        ITEMS: []
      },

      fileName: '보정시간 현황',
    }
  },
  methods: {
    async selectGridList() {

      this.selectSummaryList();

      this.GRID.ITEMS = [];
      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/selectEmpHrCrtnPeriodUserList';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.SRCH_CRTN_ARTCL_CD = this.SRCH_PARAMS_TOP.SRCH_CRTN_ARTCL_CD;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {head:{ns : 'lhcs.system.user.dao.HrCrtnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let i = 0;
        response.DATA.map(item => {
          if( i === 0 ) {
            this.GRID.ITEMS_WHOL_MNT_TOTAL = item.WHOL_MNT_TOTAL;  /* 조회조건 총 보정시간. */
          }
          return i++;
        });

        this.GRID.ITEMS = response.DATA;
        this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    async selectSummaryList() {

      this.GRID.ITEMS = [];
      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/selectEmpAdorsubPeriodUserSummary';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {head:{ns : 'lhcs.system.user.dao.HrCrtnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let i = 0;
        response.DATA.map(item => {
          if( i === 0 ) {
            this.SUMMARY.STAT_AMT = item.WHOL_MNT_TOTAL_SUMMARY;  /* 조회조건 총 보정시간. */
          }
          return i++;
        });
        if( this.mixin_isEmpty(this.SUMMARY.STAT_AMT) ) this.SUMMARY.STAT_AMT = 0;
        this.SUMMARY.ITEMS = response.DATA;
      }else {
        this.SUMMARY.ITEMS = [];
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

    let codeName = ['TAM'/* 시간보정 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);

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