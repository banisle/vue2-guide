<template>
  <div style="flex: 1 1 calc(32%);">
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">응대 현황</strong>
      <v-btn-toggle
        v-model="datePeriod"
        class="pl-btn-group type-round ml-2"
        mandatory>
        <v-btn v-for="item in btnGroup" :key="item.id" class="pl-btn">
          {{ item.text }}
        </v-btn>
      </v-btn-toggle>
      <div class="d-flex align-center ml-auto">
        <span>기준일 : {{ mixin_convertDate(base_date, 'yyyy-MM-dd HH:mm:ss') }} </span>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="intervalSelectStat"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box is-mt-s px-5 pt-8 pb-1" style="height: calc(100% - 30px)">
      <!-- chart -->
      <!-- 시간대별 -->
      <template v-if="datePeriod === 0">
        <chartjsBarChart
          class="h180 px-4"
          :chartData="BarData"
          :chartOptions="BarOptions"
          :styles="{ background: '#fff' }"
        ></chartjsBarChart>
      </template>
      <!-- 일별 -->
      <template v-if="datePeriod === 1">
        <chartjsBarChart
          class="h180 px-4"
          :chartData="BarData2"
          :chartOptions="BarOptions2"
          :styles="{ background: '#fff' }"
        ></chartjsBarChart>
      </template>
      <!-- 월별 -->
      <template v-if="datePeriod === 2">
        <chartjsBarChart
          class="h180 px-4"
          :chartData="BarData3"
          :chartOptions="BarOptions3"
          :styles="{ background: '#fff' }"
        ></chartjsBarChart>
      </template>
    </div>
  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart";
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, LineController } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, LineController)


export default {
  name: "HomeLeaderStatTime", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsBarChart,
  },
  data() {
    return {
      intervalStat: null,
      base_date: '',
      // chart
      // 시간대별
      BarData: {
        labels: [],
        datasets: [
           // line
           {
            type: 'line',
            label: '응대호',
            data: [],
            noData: false,
            tension: 0,
            cubicInterpolationMode: "default",
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 2,
            pointHoverRadius: 8,
            borderColor: "rgba(255, 127 ,39, 1)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
          },
           // bar
           {
            label: "인입호",
            backgroundColor: '#4786E3',
            borderRadius: 4,
            borderColor: '#4786E3',
            data: [],
            noData: false,
            borderWidth: 2,
          },
        ],
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
      // 일별
      BarData2: {
        labels: [],
        datasets: [
           // line
           {
            type: 'line',
            label: '응대호',
            data: [],
            noData: false,
            tension: 0,
            cubicInterpolationMode: "default",
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 2,
            pointHoverRadius: 8,
            borderColor: "rgba(255, 127 ,39, 1)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
          },
           // bar
           {
            label: "인입호",
            backgroundColor: '#4786E3',
            borderRadius: 4,
            borderColor: '#4786E3',
            data: [],
            noData: false,
            borderWidth: 2,
          },
        ],
      },
      BarOptions2: {
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
      // 월별
      BarData3: {
        labels: [ ],
        datasets: [
           // line
           {
            type: 'line',
            label: '응대호',
            data: [],
            noData: false,
            tension: 0,
            cubicInterpolationMode: "default",
            borderWidth: 2,
            pointStyle: "circle",
            pointRadius: 2,
            pointHoverRadius: 8,
            borderColor: "rgba(255, 127 ,39, 1)",
            backgroundColor: "rgba(255, 127 ,39, 1)",
          },
           // bar
           {
            label: "인입호",
            backgroundColor: '#4786E3',
            borderRadius: 4,
            borderColor: '#4786E3',
            data: [ ],
            noData: false,
            borderWidth: 2,
          },
        ],
      },
      BarOptions3: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
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

      datePeriod: 0, //초기 selected 값
      btnGroup: [
        { text: '시간대별' },
        { text: '일별' },
        { text: '월별' },
      ],

    }
  },
  beforeDestroy(){
    clearInterval(this.intervalStat);
  },
  async created() {
    this.intervalSelectStat();
    this.intervalStat = setInterval(() => {
       this.intervalSelectStat();
    }, 60000);
  },
  methods: {
    async intervalSelectStat() {
      this.base_date = await this.mixin_getSvrDate("YYYYMMDDHH24MISS");
      this.selectHH();
      this.selectDD();
      this.selectMM();

    },
    async selectHH(){
      const postParam = {
        SRCH_DEPT_ID: this.computedUserDeptId,
        SRCH_DT: this.base_date.substring(0,8),
        SRCH_CTIQS: this.computedUserCTIQ
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/api/external/iprview/selectHH", postParam, headParam);
      console.log( response );
      if (!response.HEADER.ERROR_FLAG) {
        this.BarData.labels = [];
        response.DATA.map((item) => {
          if( !this.mixin_isEmpty(item.PSR_TIME_KEY) ) {
            this.BarData.labels.push(item.PSR_TIME_KEY.substring(8, 10));
            this.BarData.datasets[0].data.push(item.ANSW_CNT); /* 응대호 */
            this.BarData.datasets[1].data.push(item.CONN_CNT); /* 인입호 */
          }
        });
      }
    },
    async selectDD(){
      const postParam = {
        SRCH_DEPT_ID: this.computedUserDeptId,
        SRCH_DT: this.base_date.substring(0,6),
        SRCH_CTIQS: this.computedUserCTIQ
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/api/external/iprview/selectDD", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.BarData2.labels = [];
        response.DATA.map((item) => {
          if( !this.mixin_isEmpty(item.PSR_TIME_KEY) ) {
            this.BarData2.labels.push(item.PSR_TIME_KEY.substring(6, 8));
            this.BarData2.datasets[0].data.push(item.ANSW_CNT); /* 응대호 */
            this.BarData2.datasets[1].data.push(item.CONN_CNT); /* 인입호 */
          }
        });
      }
    },
    async selectMM(){
      const postParam = {
        SRCH_DEPT_ID: this.computedUserDeptId,
        SRCH_DT: this.base_date.substring(0,4),
        SRCH_CTIQS: this.computedUserCTIQ
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/api/external/iprview/selectMM", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.BarData3.labels = [];
        response.DATA.map((item) => {
          if( !this.mixin_isEmpty(item.PSR_TIME_KEY) ) {
            this.BarData3.labels.push(item.PSR_TIME_KEY.substring(4, 6) + "월");
            this.BarData3.datasets[0].data.push(item.ANSW_CNT); /* 응대호 */
            this.BarData3.datasets[1].data.push(item.CONN_CNT); /* 인입호 */
          }
        });
      }
    },
  },
  mounted() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>