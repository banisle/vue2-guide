<template>
  <div style="flex: 1 1 20%;">
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">{{ computedUserDetailType === 'CENTER_LEADER' ? '센터':computedUserDetailType === 'TEAM_LEADER' ?'팀':'' }} 상담 현황</strong>
    </div>
    <div class="pl-cols">
      <div class="pl-rounded-box is-mt-s px-5 py-4 is-col-fix" style="width: 38%" >
        <div class="d-flex align-center">
          <span class="pl-label align-self-start" style="font-size: 13px;">채널별 상담 현황 </span>
          <div class="ml-auto">
            조회기준 : {{ SCH_DD_TXT }}
            <!-- <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            :MinWidthProp=22
            :HeightProp=22
            ></compo-tooltip-btn> -->
          </div>
        </div>
        <div class="d-flex align-center is-mt-l" >
          <div class="flex-grow-1">
            <chartjsDoughnutChart
              class=" h120 pa-0 is-mt-s"
              :chartData="DonughtData"
              :chartOptions="DonughtOptions"
              :styles="{ background: '#fff'}"
            ></chartjsDoughnutChart>
          </div>
          <div class="ml-auto mr-2">
            <!-- list -->
            <div class="d-flex flex-column" style="width: 150px">
              <div
                :class="`d-flex align-center ${ index !== 0 && 'is-border-top pt-2 mt-2' } ${item.class}`"
                v-for="item, index in CALL_STAT.list"

                :key="item.id">
                <span :style="`display: inline-block; width: 10px; height: 10px; border-radius:50%; background-color: ${item.color}`"></span>
                <span class="ml-1" >{{ item.title }}</span>
                <span class="ml-auto text-right" style="width: 80px">
                  <strong class="">{{ item.count }}</strong>
                  <span v-if="item.unit" class="ml-1">{{ item.unit }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 일자별 상담 현황 -->
      <HomeLeaderStatWeek class="ml-6" />
    </div>
  </div>
</template>

<script>
import HomeLeaderStatWeek from './HomeLeaderStatWeek.vue'
import Chart from 'chart.js/auto';
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";

export default {
  name: "HomeLeaderStatCS", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsDoughnutChart,
    HomeLeaderStatWeek
  },
  data() {
    return {
      DonughtData: {
        labels: ['IN', 'OUT',],
        datasets: [
          {
            backgroundColor: ["#1E6FDA","#fc8722","#24b36b","#8d57eb"],
            data: [],
            noData: false,
          },
        ],
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
              pointStyleWidth: 11,
              boxHeight: 8,
              generateLabels: (chart) => {
                let dataset = chart.data.datasets[0]; // 첫 번째 데이터셋 가져오기
                return chart.data.labels.map((label, index) => ({
                  text: `${label} (${dataset.data[index]})`, // 범례 텍스트 + 값 추가
                  fillStyle: dataset.backgroundColor[index], // 색상 유지
                  strokeStyle: dataset.backgroundColor[index],
                  hidden: isNaN(dataset.data[index]), // 값이 없으면 숨김 처리
                  index: index,
                }));
              },

            },
          }
        },
      },

      // stat call
      CALL_STAT: {
        list: [
          { title: '전화상담', count: '0', unit: '콜', color:"#1E6FDA" },
          { title: '채팅상담', count: '0', unit: '건', color: "#8d57eb" },
          { title: '문자상담', count: '0', unit: '건', color: '#24b36b'},
        ],
      },

      TOT_CALL_CNT : 0,
      SCH_DD_TXT : '전월 26일 ~ 당월 25일',
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  async created() {
    this.getChnlCuttChartData();
  },
  methods: {
    //채널상담 챠트 DATA
    async getChnlCuttChartData(){
      let sURL = '/api/biz/common/select/chnlCuttStatic';
      let postParam = {USER_DTL_TYPE : this.computedUserDetailType};
      let headParam = {head:{ns:'lhcs.statistics.dao.xml.StaticticsUserMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);

      let DonughtData = this.DonughtData;

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0){
          DonughtData.datasets[0].data.push(response.DATA[0].TOT_IN_CALL_CNT);
          DonughtData.datasets[0].data.push(response.DATA[0].TOT_OUT_CALL_CNT);
          this.TOT_CALL_CNT = Number(response.DATA[0].TOT_IN_CALL_CNT) + Number(response.DATA[0].TOT_OUT_CALL_CNT);

          this.SCH_DD_TXT = this.mixin_convertDate(response.DATA[0].PREV_MMDD, 'yyyy-MM-dd') + ' ~ ' + this.mixin_convertDate(response.DATA[0].NOW_MMDD, 'yyyy-MM-dd');
        }else{
          DonughtData.datasets[0].data = [0,0];
          this.TOT_CALL_CNT = 0;
        }

        let iCnt = 0;
        DonughtData.datasets[0].data.forEach((data, idx) => {
          if(data > 0) iCnt++;
        });

        if(iCnt > 0) DonughtData.datasets[0].noData = false;
        else DonughtData.datasets[0].noData = true;

        this.DonughtData = DonughtData;
        this.CALL_STAT.list[0].count = this.TOT_CALL_CNT;
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>