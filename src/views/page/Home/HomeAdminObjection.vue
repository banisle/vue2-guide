<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">이의제기 현황 </strong>
    </div>
    <div class="pl-rounded-box is-mt-s ">
      <div class="d-flex align-center px-5" style="height: 54px;">
        <strong class="pl-subtit">오늘의 이의제기 신청</strong>
        <div class=" ml-auto">
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="더보기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            @btnClick="mixin_set_active_tab({PATH_NM:'/CTM_M0600', NODE_TITLE:'이의제기 관리'})"
          ></compo-tooltip-btn>
        </div>

      </div>
      <!-- chart -->
      <div class="pl-cols d-flex flex-column px-5 py-5 is-border-top" >
        <div class="flex-grow-1">
          <chartjsBarChart
            class="h130"
            :chartData="BarData"
            :chartOptions="BarOptions"
            :styles="{ background: '#fff' }"
          ></chartjsBarChart>
        </div>
        <div
          class="d-flex align-center is-border-sub-top pt-3"
          style="margin-top: 28px;">
          <div class="d-flex flex-grow-1">
            <div
              class="pl-monitor-list--unit flex-grow-1"
              v-for="item in MONITOR_STAT"
              :key="item.id">
              <span class="pl-subtit is-txt-darkgray">{{ item.title }}</span>
              <strong
                :class="item.color"
                style="font-size: 16px;"
                class="pt-3 font-decimal">{{ item.count }}</strong>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import chartjsDoughnutChart from "@/components/chartjsDoughnutChart";
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: 'HomeAdminObjection', //이의제기 현황
  components: {
    chartjsDoughnutChart,
    chartjsBarChart
  },
  data() {
    return {
      today_count: 0,
      // chart
      BarData: {
        labels: [
          '상담품질평가',
          '업무능력평가',
        ],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [ 0,0,0 ],
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

      MONITOR_STAT: [
        { title: '전체', color: 'is-txt-blue', count: 0, },
        { title: '진행중', color: 'is-txt-green', count: 0, },
        { title: '종결', color: 'is-txt-darkgray', count: 0, },
      ],
    }
  },
  methods: {

    async selectHomeObjtCnt(){
      // let sUrl = '/phone-api/qa/selectHomeObjtCnt';
      let sUrl = '/api/biz/common/select/selectHomeObjtCnt';

      let postParam = {};

      let headParam = { head : {
         ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectHomeObjtCnt'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        let list = response.DATA;
        this.BarData.datasets[0].data = list.map(row=>{return parseInt(row.OBJT_CNT)});
        this.today_count = this.mixin_sum_field(list, "OBJT_CNT");

        for(let i=0; i<list.length; i++){
          this.MONITOR_STAT[1].count += parseInt(list[i].APPLY_CNT);
          this.MONITOR_STAT[2].count += parseInt(list[i].END_CNT);
        }

        this.MONITOR_STAT[0].count = (this.MONITOR_STAT[1].count + this.MONITOR_STAT[2].count);

      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    async selectHomeSttsObjtCnt(){
      // let sUrl = '/phone-api/objt/selectHomeSttsObjtCnt';
      let sUrl = '/api/biz/common/select/selectHomeSttsObjtCnt';

      let postParam = {};

      let headParam = { head : {
         ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectHomeSttsObjtCnt'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.MONITOR_STAT[1].count = parseInt(response.DATA.filter(row=>{return row.STTS_CD == "ARGUTP03"})[0].OBJT_CNT);
        this.MONITOR_STAT[2].count = parseInt(response.DATA.filter(row=>{return row.STTS_CD == "ARGUTP04"})[0].OBJT_CNT);
        this.MONITOR_STAT[0].count = (this.MONITOR_STAT[1].count + this.MONITOR_STAT[2].count);
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

  },
  mounted() {
    this.selectHomeObjtCnt();
    // this.selectHomeSttsObjtCnt();
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