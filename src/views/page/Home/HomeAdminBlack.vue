<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">배려고객 현황 </strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="getBalckCount"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box is-mt-s ">
      <div class="d-flex pa-5">
        <strong class="pl-subtit">오늘의 차단 요청</strong>
        <div class="spacing-wrap sp-16 ml-auto">
          <div class="d-flex">
            <span class="pl-label">차단요청</span>
            <span class="pl-badge is-cyan ml-1" style="width: 40px;">{{ today.request }}건</span>
          </div>
          <div class="d-flex">
            <span class="pl-label">철회요청</span>
            <span class="pl-badge is-green ml-1" style="width: 40px;">{{ today.banned }}건</span>
          </div>
        </div>
      </div>
      <div class="d-flex align-center px-5 py-5 is-border-top" >
        <div class="flex-grow-1">
          <chartjsDoughnutChart
            class="h140 pa-0 is-mt-s ml-5 mr-5"
            :chartData="DonughtData"
            :chartOptions="DonughtOptions"
            :styles="{ background: '#fff', width: '150px' }"
          ></chartjsDoughnutChart>
        </div>
        <div class="ml-auto mr-2">
          <!-- list -->
          <div class="d-flex align-centre flex-column" style="width: 180px">
            <div
              :class="`d-flex align-center mt-1 ${item.class}`"
              v-for="item in CALL_STAT.list"

              :key="item.id">
              <span :style="`display: inline-block; width: 10px; height: 10px; border-radius:50%; background-color: ${item.color}`"></span>
              <span class="ml-1" >{{ item.title }}</span>
              <span class="ml-auto text-right" style="width: 80px">
                <strong class="is-txt-cyan">{{ item.count }}</strong> /
                <strong class="is-txt-green">{{ item.base_count }}</strong>

              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";

export default {
  name: 'HomeAdminBlack', //배려고객 현황
  components: {
    chartjsDoughnutChart
  },
  data() {
    return {
      DonughtData: {
        labels: ['마이홈센터', '공가해소센터', '전세임대센터', '바로처리센터', '주택지원센터'],
        datasets: [
          {
            backgroundColor: ["#506FD9","#85B6FF","#596174","#B9BDC9","#848484"],
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
            display: false,
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
      CALL_STAT: {
        list: [
          { CUSTCO_ID : '1', title: '마이홈센터', count: '0', base_count: '0', color:"#506FD9" },
          { CUSTCO_ID : '2', title: '공가해소센터', count: '0', base_count: '0', color: "#85B6FF" },
          { CUSTCO_ID : '3', title: '전세임대센터', count: '0', base_count: '0', color: "#596174" },
          { CUSTCO_ID : '4', title: '바로처리센터', count: '0', base_count: '0', color: '#B9BDC9'},
          { CUSTCO_ID : '5', title: '주택지원센터', count: '0', base_count: '0', color: '#848484'},
        ],
      },
      today: {
        request: 0,
        banned: 0,
      }
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.getBalckCount();
  },
  methods: {
    async getBalckCount() {
      const response = await this.common_postCall("/api/biz/common/select/todayBlackCustReqStat", {}, {head: {ns: "lhcs.cust.dao.CustMapper"}});

      let CALL_STAT = this.CALL_STAT;
      let DonughtData = this.DonughtData;

      CALL_STAT.list.forEach((data, idx) => {
        data.count = 0;
        data.base_count = 0;
      });

      this.today.request = 0;
      this.today.banned = 0;

      if(response && !response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          response.DATA.forEach((item, seq) => {
            CALL_STAT.list.forEach((stat, idx) => {
              if(stat.CUSTCO_ID === item.CUSTCO_ID ){
                stat.count = item.REQ02_CNT;
                stat.base_count = item.REQ03_CNT;

                DonughtData.datasets[0].data.push(item.REQ02_CNT);
              }
            });
          });

          let iCnt = 0;
          DonughtData.datasets[0].data.forEach((data, idx) => {
            if(data > 0) iCnt++;
          });

          if(iCnt > 0) DonughtData.datasets[0].noData = false;
          else DonughtData.datasets[0].noData = true;

          this.DonughtData = DonughtData;
        }
      }

      let iTotalReqCnt = 0;
      let iTotalBanCnt = 0;
      this.CALL_STAT.list.forEach((stat, idx) => {
        iTotalReqCnt += Number(stat.count);
        iTotalBanCnt += Number(stat.base_count);
      });

      this.today.request = iTotalReqCnt;
      this.today.banned = iTotalBanCnt;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>