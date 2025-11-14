<template>
  <div style="display: contents;">
    <div class="pl-quick-layer-header  pb-0 flex-column">
      <div class="d-flex" style="position: relative; width: 100%">
        <div style="flex: 0 0 40px">
          <img :src="data.PROFILE.img" :alt="data.PROFILE.name" style="width: 100%; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
        </div>
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ data.PROFILE.name }}</strong>
            <span class="ml-2 is-txt-sub">{{ data.PROFILE.part }}</span></div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>사번</strong>
              <span class="ml-2">{{ data.PROFILE.id }}</span>
            </div>
            <div>
              <strong class="ml-1">입사일</strong>
              <span class="ml-2">{{ data.PROFILE.enter_company }}</span>
            </div>
            <div>
              <strong class="ml-1">근속 개월</strong>
              <span class="ml-2">{{ data.PROFILE.continue_employ }}</span>개월
            </div>
          </div>
        </div>
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 dialog-close"
          StyleProp="position: absolute; right: 0; top: 0;"
          TooltipPositionProp="bottom"
          @btnClick="close()"
        ></compo-tooltip-btn>
      </div>
      <v-tabs class="pl-tabs  is-mt-s is-noborder" v-model="tabs2">
        <v-tab>(06)종합 평가 실적</v-tab>
        <v-tab>월별 실적 비교</v-tab>
      </v-tabs>
    </div>

    <!-- tabs -->
    <v-tabs-items v-model="tabs2">
      <!-- 종합 평가 실적 -->
      <v-tab-item style="flex: 0 0 100vh">
        <div class="pl-quick-layer-body pb-0" style="height: calc(100% - 223px);">
          <!-- 종합 평가 실적 -->
          <div class="d-flex align-center">
            <span class="pl-subtit">종합 평가 실적</span>
          </div>
          <table class="pl-tbl-detail is-mt-m">
            <thead>
              <tr>
                <th
                  v-for="item in headers1"
                  :width="item.width"
                  :key="item.id">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items1" :key="index">
                <td
                  :class="`text-center ${key === 'type07' ? 'font-weight-bold' : ''}`"
                  v-for="(value, key) in item"
                  :key="key">
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 당월 상담 실적(55) -->
          <div class="d-flex align-center is-mt-l">
            <span class="pl-subtit">당월 상담 실적(55)</span>
          </div>
          <table class="pl-tbl-detail is-mt-m">
            <colgroup>
              <col width="10%">
              <col width="10%">
              <col width="10%">
              <col width="10%">
              <col width="10%">
              <col width="8%">
              <col width="15%">
            </colgroup>
            <thead>
              <tr>
                <th
                  v-for="item in headers2"
                  :colspan="item.colspan"
                  :class="`text-${item.align}`"
                  :key="item.id">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="text-center sub-th">통화건수</th>
                <td class="text-center">51.5</td>
                <td class="text-center">12</td>
                <td class="text-center">100</td>
                <td class="text-center">54.9</td>
                <td class="text-center" rowspan="4"><strong>3</strong></td>
                <td class="" rowspan="4">- 칭찬 콜(15건)<br>- 대외민원(1건)</td>
              </tr>
              <tr>
                <th class="text-center sub-th">상담 시간</th>
                <td class="text-center">04:10:44</td>
                <td class="text-center">20</td>
                <td class="text-center">1</td>
                <td class="text-center">00:39:43</td>
              </tr>
              <tr>
                <th class="text-center sub-th">낫레디</th>
                <td class="text-center">00:47:05</td>
                <td class="text-center">20</td>
                <td class="text-center">1</td>
                <td class="text-center">00:39:43</td>
              </tr>
              <tr>
                <th class="sub-th text-center" colspan="2">총점</th>
                <td class="text-center"><strong>52</strong></td>
                <td class="text-center"><strong>71</strong></td>
                <td class="text-center"></td>
              </tr>
            </tbody>
          </table>

          <!-- 당월 상담 기량(45) -->
          <div class="d-flex align-center is-mt-l">
            <span class="pl-subtit">당월 상담 기량(45)</span>
          </div>
          <table class="pl-tbl-detail is-mt-m">
            <colgroup>
              <col width="8%">
              <col width="7%">
              <col width="8%">
              <col width="7%">
              <col width="8%">
              <col width="6%">
              <col width="6%">
              <col width="6%">
              <col width="6%">
              <col width="6%">
              <col width="6%">
              <col width="6%">
            </colgroup>
            <thead>
              <tr>
                <th rowspan="3">구분</th>
                <th colspan="7">상담품질(35)</th>
                <th colspan="4">업무지식(10)</th>
              </tr>
              <tr>
                <th colspan="2">1차 평가(50%)</th>
                <th colspan="2">2차 평가(50%)</th>
                <th class="pa-0" rowspan="2">평가점수 (A)+(B)</th>
                <th rowspan="2">팀내 순위</th>
                <th rowspan="2">전체 순위</th>
                <th rowspan="2">점수</th>
                <th rowspan="2">평가점수</th>
                <th rowspan="2">순위</th>
                <th rowspan="2">전체 순위</th>
              </tr>
              <tr>
                <th>점수</th>
                <th class="pa-0">평가점수<br>(A)</th>
                <th>점수</th>
                <th class="pa-0">평가점수<br>(B)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center"><strong>2024년 6월</strong></td>
                <td class="text-center">100</td>
                <td class="text-center">17.5</td>
                <td class="text-center">100.0</td>
                <td class="text-center">17.5</td>
                <td class="text-center">35.5</td>
                <td class="text-center">1</td>
                <td class="text-center">1</td>
                <td class="text-center">80.0</td>
                <td class="text-center">8.00</td>
                <td class="text-center">12</td>
                <td class="text-center">175</td>
              </tr>
            </tbody>
          </table>

          <!-- 당월 상담 실적 비교 -->
          <div class="d-flex align-center is-mt-l">
            <span class="pl-subtit">당월 상담 실적 비교</span>
          </div>
          <div class="pl-table-box is-mt-m">
            <div style="display: grid; grid-template-columns: repeat(3,1fr); ">
              <div class=" is-border-right">
                <div class="pl-table-box--head justify-center font-weight-bold">통화건수</div>
                <div class="pl-table-box--body pa-3">
                  <chartjsBarChart
                    cssClasses="h90 px-5 is-mt-s"
                    :chartData="BarData"
                    :chartOptions="BarOptions"
                    :styles="{ background: '#fff' }"
                  ></chartjsBarChart>
                </div>
              </div>
              <div class=" is-border-right">
                <div class="pl-table-box--head justify-center font-weight-bold">상담시간</div>
                <div class="pl-table-box--body pa-3">
                  <chartjsBarChart
                    cssClasses="h90 px-5 is-mt-s"
                    :chartData="BarData"
                    :chartOptions="BarOptions"
                    :styles="{ background: '#fff' }"
                  ></chartjsBarChart>
                </div>
              </div>
              <div class="">
                <div class="pl-table-box--head justify-center font-weight-bold">낫레디</div>
                <div class="pl-table-box--body pa-3">
                  <chartjsBarChart
                    cssClasses="h90 px-5 is-mt-s"
                    :chartData="BarData"
                    :chartOptions="BarOptions"
                    :styles="{ background: '#fff' }"
                  ></chartjsBarChart>
                </div>
              </div>
            </div>
          </div>


        </div>
      </v-tab-item>
      <!-- 월별 실적 비교 -->
      <v-tab-item >
        <div class="pl-quick-layer-body pb-0" style="height: calc(100% - 223px);">
          <!-- 월별 실적비교 그래프 -->
          <div class="d-flex align-center">
            <span class="pl-subtit">월별 실적비교 그래프</span>
          </div>
          <div class="pl-rounded-box is-mt-m pa-3 ">
            <chartjsBarChart
              class="px-4 h350"
              :chartData="BarData2"
              :chartOptions="BarOptions2"
              :styles="{ background: '#fff' }"
            ></chartjsBarChart>
          </div>

          <!-- 월별 종합 평가 실적 -->
          <div class="d-flex align-center is-mt-l">
            <span class="pl-subtit">월별 종합 평가 실적</span>
          </div>
          <table class="pl-tbl-detail is-mt-m">
            <thead>
              <tr>
                <th
                  v-for="item in headers3"
                  :width="item.width"
                  :key="item.id">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items3" :key="index">
                <td
                  :class="`text-center ${key === 'type06' ? 'font-weight-bold' : key === 'type01' ? 'font-weight-bold is-bg-light' : ''}`"
                  v-for="(value, key) in item"
                  :key="key">
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-tab-item>
    </v-tabs-items>

  </div>
</template>

<script>
import chartjsBarChart from "@/components/chartjsBarChart";

export default {
  name: "HOME_RESULT_DETAIL", //name은 'MENU_' + 파일명 조합
  props: {
    popData : {
      type: Object,
    },
  },
  components: {
    chartjsBarChart
  },
  data() {
    return {
      tabs2: null,
      data: {
        PROFILE: {
          name: '김미정',
          id: '123456',
          img: require('@/assets/img/@manager_profile5.png'),
          part: '바로처리센터 - 마이홈1팀',
          enter_company: '2020-02-25',
          continue_employ: 25,
        },
      },
      // 종합평가실적
      headers1: [
        { text: '평가일', value: 'type01', align: 'center', width: '10%', sortable: false, },
        { text: '상담실적(55)', value: 'type02', align: 'center', width: '13%', sortable: false, },
        { text: '상담기량(45)', value: 'type03', align: 'center', width: '13%', sortable: false, },
        { text: '관리자 평가', value: 'type04', align: 'center', width: '13%', sortable: false, },
        { text: '가/감점', value: 'type05', align: 'center', width: '9%', sortable: false, },
        { text: '총점', value: 'type06', align: 'center', width: '9%', sortable: false, },
        { text: '순위', value: 'type07', align: 'center', width: '9%', sortable: false, },
        { text: '등급', value: 'type08', align: 'center', width: '9%', sortable: false, },
      ],
      items1: [
        {
          type01: '2024년 6월',
          type02: '52.0',
          type03: '43.0',
          type04: '0.0',
          type05: '3.0',
          type06: 98,
          type07: 71,
          type08: 'B등급',
        },
      ],
      // 당월 상담 실적(55)
      headers2: [
        { text: '구분', value: 'type01', align: 'center', width: '10%', sortable: false, },
        { text: '당월실적', value: 'type02', align: 'center', width: '13%', sortable: false, },
        { text: '점수', value: 'type03', align: 'center', width: '13%', sortable: false, },
        { text: '순위', value: 'type04', align: 'center', width: '13%', sortable: false, },
        { text: '그룹 평균', value: 'type05', align: 'center', width: '9%', sortable: false, },
        { text: '가/감점', value: 'type06', align: 'center', width: '20%', sortable: false, colspan: 2},
      ],

      // 월별 종합 평가 실적
      headers3: [
        { text: '구분', value: 'type01', align: 'center', width: '12%', sortable: false, class: 'th'},
        { text: '상담실적', value: 'type02', align: 'center', width: '13%', sortable: false, },
        { text: '상담 기량', value: 'type03', align: 'center', width: '13%', sortable: false, },
        { text: '관리자 평가', value: 'type04', align: 'center', width: '13%', sortable: false, },
        { text: '가/감점', value: 'type05', align: 'center', width: '9%', sortable: false, },
        { text: '총점', value: 'type06', align: 'center', width: '10%', sortable: false,},
        { text: '순위', value: 'type07', align: 'center', width: '10%', sortable: false,},
        { text: '등급', value: 'type08', align: 'center', width: '10%', sortable: false,},
      ],
      items3: [
        {
          type01: '2024년 6월',
          type02: '52.0',
          type03: '43.0',
          type04: '0.0',
          type05: '3.0',
          type06: 98,
          type07: 71,
          type08: 'B등급',
        },
        { type01: '2024년 5월', type02: '52.0', type03: '43.0', type04: '0.0', type05: '3.0', type06: '99.4', type07: 68, type08: 'B등급', },
        { type01: '2024년 4월', type02: '52.0', type03: '43.0', type04: '0.0', type05: '3.0', type06: '99.4', type07: 68, type08: 'B등급', },
        { type01: '2024년 3월', type02: '52.0', type03: '43.0', type04: '0.0', type05: '3.0', type06: '99.4', type07: 68, type08: 'B등급', },
        { type01: '2024년 2월', type02: '52.0', type03: '43.0', type04: '0.0', type05: '3.0', type06: '99.4', type07: 68, type08: 'B등급', },
        { type01: '2024년 1월', type02: '52.0', type03: '43.0', type04: '0.0', type05: '3.0', type06: '99.4', type07: 68, type08: 'B등급', },
      ],

      // 당월 상담 실적 비교
      BarData: {
        labels: ['당월실적', '그룹평균'],
        datasets: [
          {
            backgroundColor: ["#f87979","#3F48CC"],
            data: [1,3],
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        barPercentage: 0,
        barThickness: 50,
        plugins: {
          legend: {
            display: false,
          }
        },
        scales: {
          y: {
            display: false,
            grid:{
              display: false,
            }
          },
          x: {
            display: true,
            grid:{
              display: false,
            }
          }
        }

      },

      //월별 실적비교 그래프
      BarData2: {
        labels: [
          '2024년 06월',
          '2024년 05월',
          '2024년 04월',
          '2024년 03월',
          '2024년 02월',
          '2024년 01월',
        ],
        datasets: [
          {
            backgroundColor: '#4786e3',
            data: [80, 94, 88, 91, 98, 93],
            noData: false
          },
        ],
      },
      BarOptions2: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 8,
        barPercentage: 0,
        barThickness: 20,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          }

        },
      },

    }
  },
  methods: {
    close(){
      this.$emit('Close')
    }
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