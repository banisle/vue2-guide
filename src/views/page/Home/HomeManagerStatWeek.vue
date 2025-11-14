<template>
  <div class="pl-rounded-box is-mt-s px-5 py-4" >
    <div class="d-flex align-center">
      <span class="pl-label align-self-start" style="font-size: 13px;">최근 1주일 상담 현황</span>
      <div class="ml-auto spacing-wrap sp-4">
        <span class="">조회기준 : {{ SCH_DD_TXT }}</span>
        <!-- <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
        ></compo-tooltip-btn> -->
      </div>
    </div>
    <div class="d-flex is-mt-s" style="gap: 24px;">
      <!-- chart -->
      <div class="flex-grow-1">
        <chartjsBarChart
          class=" h130 px-4 is-mt-s"
          :chartData="BarData"
          :chartOptions="BarOptions"
          :styles="{ background: '#fff' }"
        ></chartjsBarChart>
      </div>
      <div class="flex flex-column flex-1" style="flex: 1 0 354px;">
        <div class="py-2 px-4 is-bg-light rounded-lg">
          <div class="d-flex">
            <span class="" style="font-size: 14px">나의 일평균 통화 콜수</span>
            <strong class="ml-auto " style="font-size: 14px">{{ AVG_CALL_CNT }} 콜</strong>
          </div>
          <div class="d-flex mt-2 pt-2  is-border-top" >
            <span class="" style="font-size: 14px">나의 일평균 통화시간</span>
            <strong class="ml-auto " style="font-size: 14px">{{ AVG_CALL_HR }}</strong>
          </div>
        </div>
        <div class="pt-2 px-4">
          <div class="d-flex">
            <span class="" style="font-size: 13px">센터 일평균 콜수</span>
            <strong class="ml-auto " style="font-size: 13px">{{ AVG_CENTER_CALL_CNT }} 콜</strong>
            <v-icon :class="`pl-icon20 triangle-${AVG_CALL_CNT > AVG_CENTER_CALL_CNT ? 'up' : 'down'} ml-1`"></v-icon>
          </div>
          <div class="d-flex is-border-top mt-1 pt-1">
            <span class="" style="font-size: 13px">센터 일평균 통화시간</span>
            <strong class="ml-auto " style="font-size: 13px">{{ AVG_CENTER_CALL_HR }}</strong>
            <v-icon :class="`pl-icon20 triangle-${AVG_CALL_CNT > AVG_CENTER_CALL_CNT ? 'up' : 'down'} ml-1`"></v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: "HomeManagerStatWeek.vue", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsBarChart
  },
  data() {
    return {
      BarData: {
        labels: [
        ],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [0, 0, 0, 0, 0, 0, 0],
            noData: false,
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

      SCH_DD_TXT : '전월 26일 ~ 당월 25일',

      AVG_CENTER_CALL_CNT : 0, //나의 일평균 통화 콜 수
      AVG_CENTER_CALL_HR : 0, //나의 일평균 통화시간
      AVG_CALL_CNT : 0, //나의 일평균 통화 콜 수
      AVG_CALL_HR : 0, //나의 일평균 통화시간
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  async created() {
    this.getRecentWeekCuttStatic();
    this.getCallStaticInfo();
  },
  methods: {
    async getRecentWeekCuttStatic(){
      let sURL = '/api/biz/common/select/ctiStaticChartData';
      let postParam = {USER_DTL_TYPE : this.computedUserDetailType};
      let headParam = {head:{ns:'lhcs.statistics.dao.xml.StaticticsUserMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let arrDate = [];
        response.DATA.forEach((item, idx) => {
          if (!arrDate.includes(item.TARGET_DATE.substring(4,6) + '/' + item.TARGET_DATE.substring(6,8))) {
            arrDate.push(item.TARGET_DATE.substring(4,6) + '/' + item.TARGET_DATE.substring(6,8));
          }
        });

        this.BarData.labels = arrDate;

        response.DATA.forEach((item, idx) => {
          let arrIdx = 0;
          arrDate.forEach((data, seq) => {
            if(item.TARGET_DATE.substring(4,6) + '/' + item.TARGET_DATE.substring(6,8) === data){
              this.BarData.datasets[0].data[arrIdx] = (isNaN(Number(this.BarData.datasets[0].data[arrIdx])) ? 0 : Number(this.BarData.datasets[0].data[arrIdx]))  + (Number(item.RSPD_CNT) + Number(item.DSPTCH_SCS_CNT));
            }else arrIdx++;
          });
        });

        let iCnt = 0;
        this.BarData.datasets[0].data.forEach((data, idx) => {
          if(data > 0) iCnt++;
        });

        if(iCnt > 0) this.BarData.datasets[0].noData = false;
        else this.BarData.datasets[0].noData = true;
      }
    },

    async getCallStaticInfo(){
      let sURL = '/api/biz/common/select/callStaticInfo';
      let postParam = {USER_DTL_TYPE : this.computedUserDetailType};
      let headParam = {head:{ns:'lhcs.statistics.dao.xml.StaticticsUserMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          let sumMyCallCnt = 0;
          let sumMyCallHr = 0;
          let sumCenterCallCnt = 0;
          let sumCenterCallHr = 0;
          let iWorkDay = 0;
          let iTotCuslCnt = 0;
          response.DATA.forEach((item, idx) => {
            if(idx === 0) iWorkDay = Number(item.WORK_DAY); //워크데이

            if(item.DEPT_ID === this.computedUserDeptId){
              sumMyCallCnt = item.SUM_CUSL_CALL_CNT;
              sumMyCallHr = item.SUM_CUSL_CALL_HR;
            }

            sumCenterCallCnt += Number(item.SUM_CALL_CNT); //센터콜수
            sumCenterCallHr += Number(item.SUM_CALL_HR); //센터통화시간
            iTotCuslCnt += Number(item.CUSL_CNT); //센터상담원수
          });

          this.AVG_CENTER_CALL_CNT = isNaN((sumCenterCallCnt/iWorkDay/iTotCuslCnt).toFixed(2))? 0 : (sumCenterCallCnt/iWorkDay/iTotCuslCnt).toFixed(2);
          this.AVG_CENTER_CALL_HR = isNaN(this.mixin_seconds_toHHMMSS((sumCenterCallHr/iWorkDay/iTotCuslCnt).toFixed(0)))? 0 : this.mixin_seconds_toHHMMSS((sumCenterCallHr/iWorkDay/iTotCuslCnt).toFixed(0));
          this.AVG_CALL_CNT = isNaN((sumMyCallCnt/iWorkDay).toFixed(2))? 0 : (sumMyCallCnt/iWorkDay).toFixed(2);
          this.AVG_CALL_HR = isNaN(this.mixin_seconds_toHHMMSS((sumMyCallHr/iWorkDay).toFixed(0)))? 0 : this.mixin_seconds_toHHMMSS((sumMyCallHr/iWorkDay).toFixed(0));

          if(response.DATA.length > 0) this.SCH_DD_TXT = this.mixin_convertDate(response.DATA[0].PREV_MMDD, 'yyyy-MM-dd') + ' ~ ' + this.mixin_convertDate(response.DATA[0].NOW_MMDD, 'yyyy-MM-dd');
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>