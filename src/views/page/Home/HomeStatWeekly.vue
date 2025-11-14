<template>
  <div class="" style="flex: 1 1 calc(35%);">
    <div class="d-flex align-center">
      <div class="d-flex align-center">
        <strong class="pl-card-intop--title">나의 주간 상담 현황</strong>
      </div>
      <div class="d-flex align-center ml-auto">
        <span>2024-06-10(목) 14:34:51 기준</span>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box is-mt-s px-5 py-4" style="height: calc(100% - 29px);">
      <!-- chart -->
      <div style="flex: 1 1 calc(65%);">
        <chartjsBarChart
          class="is-mt-m h200 px-4"
          :chartData="BarData"
          :chartOptions="BarOptions"
          :styles="{ background: '#fff' }"
        ></chartjsBarChart>
      </div>
      <div style="flex: 1 1 250px;" class="is-mt-l">
        <div class="pl-home-statGuage">
          <div v-for="item in STAT_GAUGE" :key="item.id">
            <div class="pl-home-statGuage--title">{{ item.title }}</div>
            <span :class="`pl-home-statGuage--count ${item.count === 100 ? 'perepct' : ''}`">{{ item.count }}</span>
            <span class="pl-home-statGuage--count-unit">%</span>
          </div>
        </div>
        <div class="is-mt-m px-2 d-flex flex-column" style="gap: 8px;">
          <div
            class="d-flex"
            v-for="item in STAT_CALL"
            :key="item.id">
            <span>{{ item.title }}</span>
            <strong class="ml-auto">{{ item.count }}</strong>
            <span class="ml-1">콜</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: "HomeStatWeekly", //name은 'MENU_' + 파일명 조합
  components: {
    chartjsBarChart,
  },
  data() {
    return {
      BarData: {
        labels: [
          '6/10',
          '6/11',
          '6/12',
          '6/13',
          '6/14',
          '6/15',
          '6/16',
        ],
        datasets: [
          {
            label: "인입",
            backgroundColor: "#4F62CD",
            data: [11000,9000,8000,9500,7500,8400,9200],
          },
          {
            label: "응대",
            backgroundColor: "#98C1FF",
            data: [10000,8000,7000,8500,6500,7500,6800],
          },
        ],
      },
      BarOptions: {
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
              boxWidth: 20,
              usePointStyle: true,
              pointStyle: 'Rounded',
              pointStyleWidth: 11,
              boxHeight: 8,
            },
          }
        },
      },
      // stat
      STAT_GAUGE: [
        { title: '응대율', count: 99.4 },
        { title: '서비스 레벨', count: 100 },
      ],
      STAT_CALL: [
        { title: '인입호', count: '43,563' },
        { title: '응대호', count: '43,559' },
        { title: '포기호', count: '120' },
      ],
    }
  },
  methods: {
  },
  mounted() {
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