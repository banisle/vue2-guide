<template>
  <div class="pl-container">
      <div class="pl-card-wrap">
          <!-- sub top -->
          <compo-sub-layout-top>
              <template slot="search">
                  <div class="pl-form-inline-wrap">
                      <div class="pl-form-inline">
                          <span class="pl-label"> 센터 </span>
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
                          <span class="pl-label"> 평가기간 </span>
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
                          <span class="pl-label"> 평가 제목 </span>
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
                              class="pl-btn is-icon"
                              @click="clickSearchBtn()"
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
                    <span class="pl-bullet-txt is-blue">평가 계획별 평가 진행현황</span>
                </div>
                  <div class="pl-grid-top-utils">
                      <span class="pl-counter"
                          >전체
                          <em class="pl-1 is-txt-blue"
                              >({{ goEvalPlanList.length }})</em
                          >
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
                        :DataBodyProp="goEvalPlanList"
                        :FileNameProp="fileName"
                        SheetNameProp="평가 결과 관리 현황"
                        />
                  </div>
              </div>
              <!-- grid class="pl-grid is-mt-s has-control" -->
              <v-data-table
                  class="pl-grid is-mt-s is-hover has-control"
                  :headers="headers"
                  :items="goEvalPlanList"
                  fixed-header
                  item-key="ROW_NUM"
                  height="180px"
                  :items-per-page="ROW_PER_PAGE"
                  hide-default-footer
		          no-data-text="등록된 데이터가 없습니다."
                  @click:row="showDetail"
                  :page.sync="page"
                  @page-count="pageCount = $event"
              >
                  <!-- 평가지 공개 -->
                  <template v-slot:item.EXPLAIN_SHOW_YN="{ item }">
                      <span
                          :class="`pl-badge is-${mixin_displayStatus(
                              item.EXPLAIN_SHOW_YN,
                              'STAT_LIST',
                          )}`"
                          style="width: 60px"
                      >
                          {{ item.EXPLAIN_SHOW_YN_NM }}</span
                      >
                  </template>

                  <!-- 응시율 -->
                  <template v-slot:item.EXAM_RATE="{ item }">
                      {{ mixin_formatNumber(parseInt(item.EXAM_RATE)) }}%
                  </template>

                  <!-- 평균점수 -->
                  <template v-slot:item.AVG_SCORE="{ item }">
                      {{ mixin_formatNumber(parseInt(item.AVG_SCORE)) }}
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
                          @change="ROW_PER_PAGE = parseInt($event, 10)"
                      ></v-select>
                  </div>
                  <v-pagination
                      v-model="page"
                      :length="pageCount"
                      circle
                      :total-visible="7"
                  >
                  </v-pagination>

                  <!-- 더보기 다음 있을때만 노출 -->
                  <span class="pl-pager-period">
                      보기 {{ mixin_getPagePeriod(goEvalPlanList, page) }} /
                      {{ goEvalPlanList.length }}
                      <compo-tooltip-btn
                          TitleProp="다음 검색"
                          ClassProp="pl-tooltip-btn is-line"
                          IconProp="pl-icon20 arrow-next-paging"
                          TooltipPositionProp="bottom"
                          :DisabledProp = "nextDisabled"
                          @btnClick="selectGoEvalPlanList(true)"
                      ></compo-tooltip-btn>
                  </span>
              </div>
              <!-- tab -->
              <template v-if="tabs2 !== null">
                  <div
                      class="is-border-bottom"
                      @hide="mixin_hideDialog('ShowDetail')"
                  >
                      <v-tabs
                          v-model="tabs2"
                          @change="tabChange(tabs2)"
                          slider-size="2"
                          class="pl-tabs is-noborder"
                      >
                          <CompoTabItems :TabsList="tabsList2" ref="CompoTabItems">
                          </CompoTabItems>
                          <div class="pl-form-inline-wrap ml-auto">
                              <div class="pl-form-inline">
                                  <span class="pl-label"> 소속 </span>
                                  <div class="pl-desc">
                                      <v-select
                                        v-model="searchParams.SRCH_DEPT_ID"
                                        :items="DEPT_ITEMS"
                                        item-text="DEPT_NM"
                                        item-value="DEPT_ID"
                                        class="pl-form type-middle"
                                        placeholder="전체"
                                      ></v-select>
                                      <v-text-field
                                          class="pl-form type-middle"
                                          placeholder="성명 입력"
                                          v-model="searchParams.SRCH_USER_NM"
                                      />
                                  </div>
                                  <v-btn class="pl-btn" @click="tabSearch()"
                                      >조회</v-btn
                                  >
                              </div>
                          </div>
                      </v-tabs>
                  </div>
                  <v-tabs-items v-model="tabs2">
                      <div class="fill-height">
                          <template v-for="(item, index) in tabsList2" >
                              <v-tab-item :key="index" >
                                  <div :class="`fill-height tab-contents`">
                                      <component
                                          :is="item.content"
                                          :ref="item.content"
                                          :propsQstnPlanData="qstnPlanData"
                                      ></component>
                                  </div>
                              </v-tab-item>
                          </template>
                      </div>
                  </v-tabs-items>
              </template>
          </div>
      </div>
  </div>
</template>

<script>
import CompoTabItems from "@/components/CompoTabItems.vue";
import QTM_M0400_TAB_01 from "@/views/page/QTM_M0400_TAB_01";
import QTM_M0400_TAB_02 from "@/views/page/QTM_M0400_TAB_02";

export default {
  name: "MENU_QTM_M0400", // 평가 결과 관리
  components: {
      CompoTabItems,
      QTM_M0400_TAB_01,
      QTM_M0400_TAB_02,
  },
  data() {
      return {
          // top
          modelTopCenter: "마이홈센터",
          itemsTopCenter: ["마이홈센터"],
          //date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          //date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

          tartDate: new Date(
              Date.now() - new Date().getTimezoneOffset() * 60000,
          )
              .toISOString()
              .substr(0, 10),
          int_ST_DT: this.$moment(this.startDate)
              .subtract(2, "months")
              .format("YYYY-MM-DD"), //
          int_END_DT: this.$moment(this.startDate)
              .subtract(-2, "months")
              .format("YYYY-MM-DD"), //

           ST_DT: '',
           END_DT: '',

          // grid
          page: 1,
          pageCount: 0,
          perPage: [20, 30, 50, 100],
          ROW_PER_PAGE: 20,
          pagination: {
              page: 1,
              rowsPerPage: 500,
              sortBy: "",
              descending: "",
          },
          nextDisabled: false, //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
          headers: [
              { text: "번호", value: "ROW_NUM", align: "center", width: "50px", sortable: false, },
              { text: "년도", value: "EVAL_YYYY", align: "left", width: "4%", sortable: true, },
              { text: "센터", value: "CENTER_NM", align: "left", width: "8%", sortable: true, },
              { text: "평가 종류", value: "EVAL_MNG_NM", align: "center", width: "6%", sortable: true, },
              { text: "평가 제목", value: "EVAL_TITLE",  align: "left", width: "", sortable: true, },
              { text: "평가 시작일", value: "EVAL_ST_DD", align: "center", width: "10%", sortable: true, },
              { text: "평가 종료일", value: "EVAL_EN_DD", align: "center", width: "10%", sortable: true, },
              { text: "평가지 공개", value: "EXPLAIN_SHOW_YN", align: "center px-0", width: "6%", sortable: true, },
              { text: "대상자", value: "TOT_CUST", align: "center", width: "6%", sortable: true, },
              { text: "응시자", value: "PROC_CUST", align: "center", width: "6%", sortable: true, },
              { text: "응시율", value: "EXAM_RATE", align: "center", width: "6%", sortable: true, },
              { text: "평균점수", value: "AVG_SCORE", align: "center", width: "6%", sortable: true, },
          ],
          items: [
              {
                  index: 1,
                  type01: "2024",
                  type02: "마이홈센터",
                  type03: "정기평가",
                  type04: "24년 04월 업무테스트(일반)",
                  type05: "2024-06-20 10:00",
                  type06: "2024-06-20 10:15",
                  type07: "공개",
                  type08: 128,
                  type09: 128,
                  type10: 100.0,
                  type11: 96.0,
              }
          ],
          STAT_LIST: [
              { code: "N", value: "red" },
              { code: "Y", value: "green" },
          ],

          // tab
          //tabs2: null,
          tabs2: 0,
          tabsList2: [
              { index: 0, title: "문항별", content: "QTM_M0400_TAB_01", badge: false },
              { index: 1, title: "범주별", content: "QTM_M0400_TAB_02", badge: false },
          ],

          DROP_CENTER_LIST: [],

          searchParams: {
              CENTER_ID: "",
              SRCH_DEPT: {},
              SRCH_USER_NM: '',
              QSTN_TYPE: "",
              USE_YN: "",
              SRCH_PAPER_TITLE: "",
              PROC_STAT: "",
              USER_ID: "",
              ST_DT: "",
              END_DT: "",
          },

          DEPT_ITEMS:[],

          goEvalPlanList: [],

          qstnPlanData: {},

          fileName: "평가 결과 관리 현황",
      };
  },
  methods: {

    tabChange(tab){
      this.$emit('Tabchange',tab)
    },

    searchParamsReset(){
      this.searchParams.SRCH_EVAL_TITLE = '';
      this.ST_DT= this.int_ST_DT;
      this.END_DT= this.int_END_DT;
    },

    async selectDeptList(CENTER_ID) {
      console.info("selectDeptList #### ");
      let sUrl = '/phone-api/qt/selectDeptList';
      let postParam = {
        CENTER_ID: CENTER_ID,
      };

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.DEPT_ITEMS = [];
        this.DEPT_ITEMS = resData.DATA ;
        //this.DEPT_ITEMS.push({ DEPT_ID: "",  DEPT_NM: "전체",})
      }else {
        this.DEPT_ITEMS = [];
      }
      this.DEPT_ITEMS.unshift({ DEPT_ID: "",  DEPT_NM: "전체",})
    },

    changeCenter() {
        this.selectGoEvalPlanList();
    },

    changeSearchParams() {
        this.selectGoEvalPlanList();
    },
    // 조회버튼 클릭
    clickSearchBtn() {
        this.selectGoEvalPlanList();
    },

      // 평가지 조회
    async selectGoEvalPlanList(next) {
        // 초기화
        this.goEvalPlanList = [];

        if(!next){
            this.items = [];
            this.pagination.page = 1; //페이징 처리 초기화
            this.nextDisabled = true; //버튼 비활성화
        }

        let sUrl = "/phone-api/qt/selectGoEvalPlanList_M400";
        let postParam = {
            CENTER_ID: this.searchParams.CENTER_ID,
            SRCH_EVAL_TITLE: this.searchParams.SRCH_EVAL_TITLE,
            ST_DT:
                this.ST_DT.replaceAll("-", "").replaceAll(" ", "") +
                "000000",
            END_DT:
                this.END_DT.replaceAll("-", "").replaceAll(" ", "") +
                "235959",
        };

        let headParam = {
            head: {
                ROW_CNT: this.pagination.rowsPerPage,
                PAGES_CNT: this.pagination.page,
                PAGING: "Y",
            },
        };

        let response = await this.common_postCall(
            sUrl,
            postParam,
            headParam,
        );
        if (!response.HEADER.ERROR_FLAG) {
            this.goEvalPlanList = response.DATA;
            //다음
            //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
            if (
                response.HEADER.next !== null &&
                response.HEADER.next !== undefined
            ) {
                if (response.HEADER.next === true) {
                    this.nextDisabled = false; //버튼 활성화
                } else {
                    this.nextDisabled = true; //버튼 비활성화
                }
            }

        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
        this.tabs2 = 0;
    },

    tabSearch() {
        this.qstnPlanData = {
            CENTER_ID: this.qstnPlanData.CENTER_ID,
            EVAL_ID: this.qstnPlanData.EVAL_ID,
            EVAL_TITLE: this.qstnPlanData.EVAL_TITLE,
            PAPER_ID: this.qstnPlanData.PAPER_ID,
            SRCH_DEPT_ID: this.searchParams.SRCH_DEPT_ID,
            SRCH_USER_NM: this.searchParams.SRCH_USER_NM,
        };

        if(this.tabs2 === 0){
            //if(this.$refs.QTM_M0400_TAB_01) this.$refs.QTM_M0400_TAB_01.clickSearchBtn();
        }else{
            //if(this.$refs.QTM_M0400_TAB_02) this.$refs.QTM_M0400_TAB_02.clickSearchBtn();
        }
    },

    showDetail(e, { item }) {
        this.tabs2 = 0;
        this.searchParams.SRCH_DEPT_ID='';
        this.searchParams.SRCH_USER_NM='';
        this.qstnPlanData = {
            CENTER_ID: item.CENTER_ID,
            EVAL_ID: item.EVAL_ID,
            EVAL_TITLE: item.EVAL_TITLE,
            PAPER_ID: item.PAPER_ID,
            SRCH_DEPT_ID: '',
            SRCH_USER_NM: '',
        };
        this.selectDeptList(item.CENTER_ID);
    },
  },
  async mounted() {
    let codeList = ["EVST", "TEST_DV", "PAPER_ORD"];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 사용자 정보
    this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if (this.DROP_CENTER_LIST.length > 0) {
        this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find((row) => {
            return row.value == centerId;
        })
            ? centerId
            : this.DROP_CENTER_LIST[0].value;
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
  watch: {},
};
</script>

<style lang="scss" scoped></style>
