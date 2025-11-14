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
            <span class="pl-bullet-txt is-blue">{{modelBaseDate}} 근무 일수 <strong class="ml-1">( {{ USER_WORK_DAY_COUNT }}일 / {{WORK_DAY_COUNT}}일 )</strong></span>
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
              :DataHeaderProp="GRID.EXCEL_HEADERS"
              :DataBodyProp="GRID.ITEMS"
              :FileNameProp="fileName"
              SheetNameProp="근태 현황"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="GRID.HEADERS"
          :items="GRID.ITEMS"
          :item-class="isHldyActiveRow"
          fixed-header
          item-key="ROW_NUMBER"
          height="calc(-288px + 100vh)"
          :items-per-page="-1"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          :loading="mixin_loadding">
          <template v-slot:item.DMND_RSN="{item}">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          {{ item.DMND_RSN }}
                        </span>
              </template>
              <span>{{ item.DMND_RSN }}</span>
            </v-tooltip>
          </template>
        </v-data-table>

      </div>
      <!-- 근태 요약 -->
      <div class="is-col-fix ml-6 d-flex" style="width: 20%; margin-top: 38px;">
        <div class="pl-table-box flex-grow-1">
          <div class="pl-table-box--head">
            <v-icon class="pl-icon20 stat-sign"></v-icon>
            <span class="pl-subtit ml-1">근태 요약</span>
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
            <div class="pl-vertical-list type-2 is-mt-s is-border-sub-top pt-3" >
              <div class="pl-vertical-list--unit"><span>출근</span><strong :class="`ml-auto is-txt-green`">{{CLSF_ATDC_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>연차</span><strong :class="`ml-auto `">{{CLSF_ANUL_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>지각</span><strong :class="`ml-auto is-txt-red`">{{CLSF_LATE_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>휴가</span><strong :class="`ml-auto `">{{CLSF_VCTN_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>결근</span><strong :class="`ml-auto is-txt-red`">{{CLSF_ABST_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>공가</span><strong :class="`ml-auto `">{{CLSF_PBVC_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>반차</span><strong :class="`ml-auto `">{{CLSF_HFAD_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>병가</span><strong :class="`ml-auto `">{{CLSF_SCLV_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>조퇴</span><strong :class="`ml-auto `">{{CLSF_ERLV_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>휴직</span><strong :class="`ml-auto `">{{CLSF_LEAV_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>출장</span><strong :class="`ml-auto `">{{CLSF_BUST_CNT}}</strong></div>
              <div class="pl-vertical-list--unit"><span>기타</span><strong :class="`ml-auto `">{{CLSF_ETC_CNT}}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HOME_MANAGER_TAB01", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      evl_crtr_code:[], //평가기준 년월

      SRCH_PARAMS_TOP:{
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
      },

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      GRID:{
        HEADERS:[
          { text: '일자', value: 'SRCH_DATE_DD', align: 'center', width: '10%', sortable: false },
          { text: '요일', value: 'SRCH_DATE_W', align: 'center', width: '5%', sortable: false },
          { text: '로그인 시간', value: 'LGN_DT', align: 'center', width: '13%', sortable: false },
          { text: '로그아웃 시간', value: 'LGT_DT', align: 'center', width: '13%', sortable: false },
          { text: '근무시간', value: 'DAY_DT', align: 'center', width: '8%', sortable: false },
          { text: '근태유형', value: 'WKATTD_ARTCL_NM', align: 'center', width: '15%', sortable: false },
          { text: '내용', value: 'DMND_RSN', align: 'left', width: '', sortable: false },
        ],
        EXCEL_HEADERS:[
          { text: '일자', value: 'SRCH_DATE_DD', align: 'center', width: '100px', sortable: false },
          { text: '요일', value: 'SRCH_DATE_W', align: 'center', width: '100px', sortable: false },
          { text: '로그인 시간', value: 'LGN_DT', align: 'center', width: '100px', sortable: false },
          { text: '로그아웃 시간', value: 'LGT_DT', align: 'center', width: '100px', sortable: false },
          { text: '근무시간', value: 'DAY_DT', align: 'center', width: '100px', sortable: false },
          { text: '근태유형', value: 'WKATTD_ARTCL_NM', align: 'center', width: '100px', sortable: false },
          { text: '내용', value: 'DMND_RSN', align: 'left', width: '200px', sortable: false },
        ],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
      },
      //SUMMARY
      WORK_DAY_COUNT:0,  //조회기간 근무일수
      USER_WORK_DAY_COUNT:0,  //조회기간 근무일수

      CLSF_ATDC_CNT:0, //출근
      CLSF_LATE_CNT:0, //지각
      CLSF_ABST_CNT:0, //결근
      CLSF_HFAD_CNT:0, //반차
      CLSF_ERLV_CNT:0, //조퇴
      CLSF_BUST_CNT:0, //출장
      CLSF_ANUL_CNT:0, //연차
      CLSF_VCTN_CNT:0, //휴가
      CLSF_PBVC_CNT:0, //공가
      CLSF_SCLV_CNT:0, //병가
      CLSF_LEAV_CNT:0, //휴직
      CLSF_ETC_CNT:0, //기타

      fileName: '근태 현황',
    }
  },
  methods: {
    isHldyActiveRow(item) {
      const activeClass = item.HLDY === 'Y' ? "is-bg-light" : "";
      return activeClass;
    },
    async selectGridList() {

      this.GRID.ITEMS = [];
      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/selectEmpAtndnPeriodUserList';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {head:{ns : 'lhcs.system.user.dao.AtndnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let i = 0;
        let rt_total = 0;
        let rt_minus = 0;
        response.DATA.map(item => {
          response.DATA[i]["SRCH_DATE_DD"] = this.$moment(item.SRCH_DATE).format('YYYY-MM-DD');
          response.DATA[i]["SRCH_DATE_W"] = this.$moment(item.SRCH_DATE).format('dddd').substring(0,1);
          if( !this.mixin_isEmpty( item.DAY_DT )  ) {
            if( item.DAY_DT.length === 4 ) item.DAY_DT = "0" + item.DAY_DT;
          }
          response.DATA[i]["DAY_DT"] = item.DAY_DT;
          if( !this.mixin_isEmpty( item.HLDY_NM )  ) {
            response.DATA[i]["DMND_RSN"] = "("+ item.HLDY_NM + ") "+ response.DATA[i]["DMND_RSN"];
          }
          if( i === 0 ) {
            this.WORK_DAY_COUNT = item.WORK_DAY_COUNT;  /* 조회기간 근무일수 */
            this.USER_WORK_DAY_COUNT = item.USER_WORK_DAY_COUNT; /* 근태카운트 - 근무비율 = 사용자근무일수 */

            this.CLSF_ATDC_CNT = Number(item.CLSF_ATDC_TOTAL) + Number(item.CLSF_LATE_TOTAL);  //출근(출근 + 지각)
            this.CLSF_LATE_CNT = item.CLSF_LATE_TOTAL;  //지각
            this.CLSF_ABST_CNT = item.CLSF_ABST_TOTAL;  //결근
            this.CLSF_HFAD_CNT = item.CLSF_HFAD_TOTAL;  //반차
            this.CLSF_ERLV_CNT = item.CLSF_ERLV_TOTAL;  //조퇴
            this.CLSF_BUST_CNT = item.CLSF_BUST_TOTAL;  //출장
            this.CLSF_ANUL_CNT = item.CLSF_ANUL_TOTAL;  //연차
            this.CLSF_VCTN_CNT = item.CLSF_VCTN_TOTAL;  //휴가
            this.CLSF_PBVC_CNT = item.CLSF_PBVC_TOTAL;  //공가
            this.CLSF_SCLV_CNT = item.CLSF_SCLV_TOTAL;  //병가
            this.CLSF_LEAV_CNT = item.CLSF_LEAV_TOTAL;  //휴직
            this.CLSF_ETC_CNT = item.CLSF_ETC_TOTAL;  //기타
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