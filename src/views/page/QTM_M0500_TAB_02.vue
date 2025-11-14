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
            @change="changeCenter"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          소속
        </span> <!-- placeholder="전체"  -->
        <div class="pl-desc">
          <v-select
              v-model="searchParams.SRCH_DEPT_ID"
              :items="DEPT_ITEMS"
              item-text="DEPT_NM"
              item-value="DEPT_ID"
              class="pl-form type-middle"
            ></v-select>
          <div>
            <v-checkbox
              v-model="USER_STTS_CD"
              class="pl-check"
              label="퇴직자 제외"
              input-value="true"></v-checkbox>
          </div>
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
          @btnClick="searchParamsReset()"></compo-tooltip-btn>-->
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- chart -->
      <div>
        <!-- top -->
        <div class="pl-grid-top pt-3" >
          <div class="pl-grid-top-left" style="height: 30px;">
            <strong class="pl-bullet-txt is-blue">{{searchParams.SRCH_DEPT_NM}}</strong>
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
            <strong class="pl-bullet-txt is-blue">{{modelDateY}}년 평균 추이</strong>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-img is-header-lg is-mt-s"
          :headers="headers"
          :items="items"
          fixed-header
          item-key="index"
          height="124px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          >
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
  name: 'QTM_M0500_TAB_02', //평가보고서 - 평균 추이
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
      items: [],

      evaluationReportList: [],

      searchParams: {
        CENTER_ID: "",
        SRCH_DEPT_ID: '',
        SRCH_DEPT_NM: '',
        SRCH_USER_ID: '',
      },


      evl_crtr_code:[],//평가기준 년월

      DEPT_ITEMS:[],
      modelDateY: this.$moment(new Date()).format('YYYY'),

      DROP_CENTER_LIST:{},

      USER_STTS_CD: true,

    }
  },
  methods: {

    searchParamsReset(){
      this.searchParams.SRCH_DEPT_ID = '';
    },

    setGridData(R_DATA){
      //const uniqueMonths = [...new Set(R_DATA.map(data => data.MM))];
      const uniqueMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      this.headers = [
        { text: '구분', value: 'type00', align: 'center', width: '', sortable: false },
        ...uniqueMonths.map((month, index) => ({
          text: `${month}월`, value: `type${index + 1}`, align: 'center', width: '7%', sortable: false
        }))
      ];

      const mapScoresByMonth = (scoreKey) => {
        const scoreMap = {};
        uniqueMonths.forEach((month, index) => {
          const monthData = R_DATA.find(data => data.MM === month);
          scoreMap[`type${index + 1}`] = monthData ? monthData[scoreKey] : 0; // Set to "0" if no data
        });
        return scoreMap;
      };

      this.items = [
      {
          index: 1,
          type00: '팀평균',
          ...mapScoresByMonth('TEAM_SCORE')
        },
        {
          index: 2,
          type00: '전체평균',
          ...mapScoresByMonth('ALL_SCORE')
        },

      ];
    },

    createBarData(R_DATA) {
      //const labels = [...new Set(R_DATA.map(item => item.MM))].sort((a, b) => a - b).map(mm => `${mm}월`);
      const allMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      const labels = allMonths.map(mm => `${mm}월`);

      const allScoreData = labels.map(label => {
        const month = label.replace("월", "");
        const entry = R_DATA.find(item => item.MM === month);
        return entry ? parseFloat(entry.ALL_SCORE) : 0;
      });
      const teamScoreData = labels.map(label => {
        const month = label.replace("월", "");
        const entry = R_DATA.find(item => item.MM === month);
        return entry ? parseFloat(entry.TEAM_SCORE) : 0;
      });
      const termScores = {
        term1: new Array(labels.length).fill(0)
      };
      R_DATA.forEach(item => {
        const monthIndex = labels.indexOf(`${item.MM}월`);
        if (monthIndex > -1  && item.TERM_SCORE) {
          termScores[monthIndex] = parseFloat(item.TERM_SCORE);
        }
      });
      this.BarData= {};
      this.BarData.labels= labels;
      this.BarData.datasets = [
        {
          type: 'line',
          label: '팀평균',
          data: teamScoreData,
          noData: false,
          tension: 0,
          cubicInterpolationMode: "default",
          borderWidth: 2,
          pointStyle: "circle",
          pointRadius: 2,
          pointHoverRadius: 8,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 1)",
        },
        {
          label: "전체평균",
          backgroundColor: '#4786E3',
          borderRadius: 4,
          borderColor: '#4786E3',
          data: allScoreData,
          noData: false,
          borderWidth: 2,
        },


      ];

    },

    async selectDeptList() {
      console.info("selectDeptList #### ");
      let sUrl = '/phone-api/qt/selectDeptList';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
      };

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.DEPT_ITEMS = [];
        this.DEPT_ITEMS = resData.DATA ;
        this.searchParams.SRCH_DEPT_ID = this.DEPT_ITEMS[0].DEPT_ID;
        //this.searchParams.SRCH_DEPT_NM = this.DEPT_ITEMS[1].text;

        this.selectEvaluationReportList();
      }else {
        this.DEPT_ITEMS = [];
      }
      // this.DEPT_ITEMS.unshift({ DEPT_ID: "",  DEPT_NM: "전체",})
    },

    // 조회버튼 클릭
    clickSearchBtn() {
      if(this.mixin_isEmpty(this.searchParams.SRCH_DEPT_ID)){
        this.showAlertInfo({msg:"소속을 선택 해주세요."});
        return
      }
      this.selectEvaluationReportList();
    },

    changeCenter(){
      this.selectDeptList();
    },

    // 조회
    async selectEvaluationReportList() {
        console.info("selectEvaluationReportList");

        this.BarData= {};
        this.headers = [];

        // 초기화
        this.evaluationReportList = [];

        let sUrl = "/phone-api/qt/selectEvaluationReportChartByTeam";
        let postParam = {
            CENTER_ID: this.searchParams.CENTER_ID,
            EVAL_YYYY: this.modelDateY,
            SRCH_DEPT_ID: this.searchParams.SRCH_DEPT_ID,
            SRCH_USER_STTS_CD: this.USER_STTS_CD == true ? 'WORK' : 'RTRM' ,
        };
        let headParam = {};
        let response = await this.common_postCall(
            sUrl,
            postParam,
            headParam,
        );
        if (!response.HEADER.ERROR_FLAG) {
            this.evaluationReportList = response.DATA;
            this.createBarData(this.evaluationReportList);
            this.setGridData(this.evaluationReportList);

            this.searchParams.SRCH_DEPT_NM = this.evaluationReportList[0].EVAL_DEPT_NM;
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

    this.selectDeptList();
    //this.selectEvaluationReportList();
  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
    //this.BarData= {};
    //this.headers = [];
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>