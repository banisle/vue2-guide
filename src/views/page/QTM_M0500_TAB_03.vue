<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
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
          센터
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.CENTER_ID"
            :items="DROP_CENTER_LIST"
            class="pl-form type-middle"
          ></v-select>
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
        <!--
        <compo-tooltip-btn
          TitleProp="초기화 "
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick=""></compo-tooltip-btn>-->
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- chart -->
      <div>
        <!-- top -->
        <div class="pl-grid-top pt-3" >
          <div class="pl-grid-top-left" style="height: 30px;">
            <strong class="pl-bullet-txt is-blue">{{modelDateY}}년 근속연수별 추이</strong>
          </div>
        </div>
        <div class="pl-rounded-box is-mt-s px-5 pt-7 pb-5">
          <chartjsBarChart
            class="h250 px-4"
            :chartData="BarData"
            :chartOptions="BarOptions"
            :styles="{ background: '#fff' }"
          ></chartjsBarChart>
        </div>
      </div>

      <!-- grid -->
      <div class="is-mt-m">
        <!-- top -->
        <div class="pl-grid-top pt-3">
          <div class="pl-grid-top-left" style="height: 30px;">
            <strong class="pl-bullet-txt is-blue">근속연수별 추이 상세</strong>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-img is-header-lg is-mt-s"
          :headers="headers"
          :items="items"
          fixed-header
          item-key="index"
          height="204px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          :page.sync="page"
          @page-count="pageCount = $event">
          <template v-slot:item.type00="{ item }">
            <th class="is-bg-light text-center">
              {{ item.type00 }}
            </th>
          </template>
        </v-data-table>

      </div>


    </div>
  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart"

export default {
  name: 'QTM_M0500_TAB_03', //평가결과보고서 - 근속 연수별
  components: {
    chartjsBarChart
  },
  data() {
    return {
      BarData: {
        labels:  [ '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
        datasets: [{
          backgroundColor: [],
          data: [],
          noData: false
        }],
        key:[],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 0,
        barPercentage: .8,
        categoryPercentage: .5,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              pointStyle: 'line',
              pointStyleWidth: 30,
              usePointStyle: true,
            }
          }
        },
      },

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '구분', value: 'type00', align: 'center', width: '', sortable: false },
        { text: '01월', value: 'type01', align: 'center', width: '7%', sortable: false },
        { text: '02월', value: 'type02', align: 'center', width: '7%', sortable: false },
        { text: '03월', value: 'type03', align: 'center', width: '7%', sortable: false },
        { text: '04월', value: 'type04', align: 'center', width: '7%', sortable: false },
        { text: '05월', value: 'type05', align: 'center', width: '7%', sortable: false },
        { text: '06월', value: 'type06', align: 'center', width: '7%', sortable: false },
        { text: '07월', value: 'type07', align: 'center', width: '7%', sortable: false },
        { text: '08월', value: 'type08', align: 'center', width: '7%', sortable: false },
        { text: '09월', value: 'type09', align: 'center', width: '7%', sortable: false },
        { text: '10월', value: 'type10', align: 'center', width: '7%', sortable: false },
        { text: '11월', value: 'type11', align: 'center', width: '7%', sortable: false },
        { text: '12월', value: 'type12', align: 'center', width: '7%', sortable: false },
      ],
      items: [
        /*
        {
          index: 1,
          type00: '1년 이상 ~ 2년 미만',
          type01: 100,
          type02: 70,
          type03: 110,
          type04: 100,
          type05: 110,
          type06: 100,
          type07: 80,
          type08: 100,
          type09: 100,
          type10: 100,
          type11: 100,
          type12: 80,
        },*/

      ],

      evaluationReportChartList: [],

      searchParams: {
        CENTER_ID: "",
        SRCH_DEPT_ID: '',
        SRCH_USER_ID: '',
      },

      USER_STTS_CD: 'WORK',  // 재직여부

      evl_crtr_code:[],//평가기준 년월
      modelDateY: this.$moment(new Date()).format('YYYY'),   // 평가기준년
      DROP_CENTER_LIST:{},
    }
  },
  methods: {

    mapTermType(term) {
      /*
      return term === 'term1' ? '2년이상'
          : term === 'term2' ? '1년이상 2년미만'
          : term === 'term3' ? '6개월이상 1년미만'
          : term === 'term4' ? '6개월미만'
          : '-';
          */
      return term === 'term1' ? '10년이상'
          : term === 'term2' ? '5년~10년'
          : term === 'term3' ? '3년~5년'
          : term === 'term4' ? '2년~3년'
          : term === 'term5' ? '1년~2년'
          : term === 'term6' ? '6개월~1년'
          : term === 'term7' ? '3개월~6개월'
          : term === 'term8' ? '3개월미만'
          : '기타';
    },

    setGridData(R_DATA) {

      const uniqueMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      const groupedData = {};
      const monthlyAllScores = {};
      R_DATA.forEach(entry => {
          const { MM, TERM_TYPE, TERM_SCORE, ALL_SCORE  } = entry;
          if (!groupedData[TERM_TYPE]) groupedData[TERM_TYPE] = {};
          groupedData[TERM_TYPE][MM] = parseFloat(TERM_SCORE) || 0;
          if (!monthlyAllScores[MM]) {
              monthlyAllScores[MM] = parseFloat(ALL_SCORE) || 0;
          }
      });

      const items = [];
      let index = 1;

      Object.keys(groupedData).forEach(termType => {
          const row = { index, type00: this.mapTermType(termType) };
          uniqueMonths.forEach((month, idx) => {
              row[`type${String(idx + 1).padStart(2, '0')}`] = groupedData[termType][month] || 0;
          });
          items.push(row);
          index++;
      });

      const allScoreRow = { index, type00: '전체평균' };
      uniqueMonths.forEach((month, idx) => {
          allScoreRow[`type${String(idx + 1).padStart(2, '0')}`] = monthlyAllScores[month] || 0;
      });

      items.push(allScoreRow);

      this.items = items;
    },

    createBarData(R_DATA) {
      // RGBA 색상 생성 헬퍼 함수
      const rgba = (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;

      // 차트 색상 정의
      const colors = {
        average: rgba(71, 134, 227),    // #4786E3
        term0: rgba(255, 159, 64),      // 기타
        term1: rgba(255, 99, 132),      // 10년이상
        term2: rgba(153, 102, 255),     // 5년~10년
        term3: rgba(75, 192, 192),      // 3년~5년
        term4: rgba(155, 159, 164),     // 2년~3년
        term5: rgba(255, 159, 164),     // 1년~2년
        term6: rgba(0, 195, 0),         // 6개월~1년
        term7: rgba(255, 159, 264),     // 3개월~6개월
        term8: rgba(255, 159, 164),     // 3개월미만
      };

      // 라벨 정의
      const labels_ko = {
        term0: '기타',
        term1: '10년이상',
        term2: '5년~10년',
        term3: '3년~5년',
        term4: '2년~3년',
        term5: '1년~2년',
        term6: '6개월~1년',
        term7: '3개월~6개월',
        term8: '3개월미만',
      };

      // 나머지 코드는 동일
      //const labels = [...new Set(R_DATA.map(item => item.MM))].sort().map(mm => `${mm}월`);      // DATA 기준에 있는 월만 표기
      const allMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];  // 모든 월 표기
      const labels = allMonths.map(mm => `${mm}월`);

      const allScoreData = labels.map(label => {
        const month = label.replace("월", "");
        return R_DATA.find(item => item.MM === month)?.ALL_SCORE || 0;
      });

      const terms = ['term0', 'term1', 'term2', 'term3', 'term4', 'term5', 'term6', 'term7', 'term8'];
      const termScores = Object.fromEntries(
        terms.map(term => [term, new Array(labels.length).fill(0)])
      );

      R_DATA.forEach(item => {
        const monthIndex = labels.indexOf(`${item.MM}월`);
        if (monthIndex > -1 && item.TERM_TYPE && item.TERM_SCORE) {
          termScores[item.TERM_TYPE][monthIndex] = parseFloat(item.TERM_SCORE);
        }
      });

      const lineChartConfig = {
        type: 'line',
        noData: false,
        tension: 0,
        cubicInterpolationMode: "default",
        borderWidth: 2,
        pointStyle: "circle",
        pointRadius: 2,
        pointHoverRadius: 8,
      };

      this.BarData = {
        labels,
        datasets: [
          ...terms.map(term => ({
            ...lineChartConfig,
            label: labels_ko[term],
            data: termScores[term],
            borderColor: colors[term],
            backgroundColor: colors[term],
          })),
          {
            label: "전체평균",
            backgroundColor: colors.average,
            borderRadius: 4,
            borderColor: colors.average,
            data: allScoreData,
            noData: false,
            borderWidth: 2,
          },
        ]
      };
    },

    // 조회버튼 클릭
    clickSearchBtn() {
      this.selectEvaluationReportChartList();
    },
    // 조회
    async selectEvaluationReportChartList() {
        console.info("selectEvaluationReportChartList");
        // 초기화
        this.evaluationReportChartList = [];

        let sUrl = "/phone-api/qt/selectEvaluationReportChartByWork";
        let postParam = {
            CENTER_ID: this.searchParams.CENTER_ID,
            EVAL_YYYY: this.modelDateY,
            SRCH_USER_STTS_CD: this.USER_STTS_CD,
        };

        let headParam = {};

        let response = await this.common_postCall(sUrl, postParam, headParam, );
        if (!response.HEADER.ERROR_FLAG) {
            this.evaluationReportList = response.DATA;
            this.createBarData(this.evaluationReportList);  // 바 그래프 차트 용
            this.setGridData(this.evaluationReportList);  // 그리드 처리용
        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
    },
  },
  async mounted() {
    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if (this.DROP_CENTER_LIST.length > 0) {
        this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find((row) => {return row.value == centerId; }) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.selectEvaluationReportChartList();
  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped></style>