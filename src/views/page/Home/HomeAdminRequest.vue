<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">대/내외 민원 현황</strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="selectTodayCvlcptCnt"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box is-mt-s ">
      <div class="d-flex pa-5">
        <strong class="pl-subtit">오늘의 민원 접수현황</strong>
        <div class="spacing-wrap sp-16 ml-auto">
          <span>접수 <strong>({{ today.request }})</strong></span>
          <span>종결 <strong class="is-txt-cyan">({{ today.done }})</strong></span>
          <span>미종결 <strong class="is-txt-red">({{ today.undone }})</strong></span>
        </div>
      </div>
      <div class="pl-cols d-flex align-center px-5 py-5 is-border-top" >
        <div class="flex-grow-1 is-vrt pr-10">
          <chartjsBarChart
            class=" h140"
            :chartData="BarData"
            :chartOptions="BarOptions"
            :styles="{ background: '#fff' }"
          ></chartjsBarChart>
        </div>
        <div class="ml-auto " style="flex: 0 0 45%">
          <chartjsDoughnutChart
            class="h140 pa-0 is-mt-s"
            :chartData="DonughtData"
            :chartOptions="DonughtOptions"
            :styles="{ background: '#fff', }"
          ></chartjsDoughnutChart>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: 'HomeAdminRequest', //대/내외 민원 현황
  components: {
    chartjsDoughnutChart,
    chartjsBarChart
  },
  data() {
    return {
      BarData: {
        labels: [
          '귀책없음',
          '일반귀책',
          '중대귀책',
        ],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [ 0, 0, 0 ],
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.6,
        borderRadius: 8,
        plugins: {
          legend: {
            display: false,
          }
        },
      },

      DonughtData: {
        labels: ['대내 민원', '대외 민원', '정보공개청구'],
        datasets: [
          {
            backgroundColor: ["#9481F3","#00B0F0","#24b36b"],
            data: [0,0,0],
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
            },
          }
        },
      },
      today: {
        request: 0,
        done: 0,
        undone: 0,
      }
    }
  },
  methods: {
    async selectTodayCvlcptCnt(){
      let sUrl = '/api/biz/common/select/selectTodayCvlcptCnt';

      let postParam = {};

      let headParam = { head : {
        ns : 'lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper'
        , sn : 'selectTodayCvlcptCnt'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.BarData.datasets[0].data = [parseInt(response.DATA[0].CNT1), parseInt(response.DATA[0].CNT2), parseInt(response.DATA[0].CNT3)];
        this.DonughtData.datasets[0].data = [parseInt(response.DATA[0].IVOC_CNT), parseInt(response.DATA[0].OVOC_CNT),  parseInt(response.DATA[0].LHVOC_CNT)];
        this.today.request = parseInt(response.DATA[0].REG_CNT);
        this.today.done = parseInt(response.DATA[0].END_CNT);
        this.today.undone = parseInt(response.DATA[0].NOT_END_CNT);
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    }
  },
  mounted() {
    this.selectTodayCvlcptCnt();
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