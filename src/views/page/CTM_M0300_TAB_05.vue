<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회 연도
        </span>
        <div class="pl-desc">
          <v-select
            v-model="SRCH_YEAR"
            :items="DROP_YEAR_LIST"
            class="pl-form type-middle is-sm"
          ></v-select>
        </div>
      </div>
      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="selectRcptCvlcptState"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="clickResetBtn"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="is-border-top" >
      <div class="pl-cols ">
        <!-- left -->
        <div class="is-col-fix pl-card-body" style="width: 30%">
          <div>
            <!-- 대내외 민원접수 현황 테이블 -->
            <div>
              <div class="pl-grid-top pt-2">
                <strong class="pl-bullet-txt is-blue">대내외 민원 접수 현황</strong>
              </div>
              <table class="pl-tbl-detail is-mt-s">
                <colgroup>
                  <col width="18%" />
                  <col width="20%" />
                  <col width="20%" />
                  <col width="27%" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">구분</th>
                    <th scope="col">대내민원</th>
                    <th scope="col">대외민원</th>
                    <th scope="col">정보공개청구</th>
                    <th scope="col">합계</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in items4">
                    <tr>
                      <td class="text-center"><span class="pl-value-txt">{{ item.REG_YEAR }}</span></td>
                      <td class="text-center"><span class="pl-value-txt">{{ item.IVOC }}</span></td>
                      <td class="text-center"><span class="pl-value-txt">{{ item.OVOC }}</span></td>
                      <td class="text-center"><span class="pl-value-txt">{{ item.LHVOC }}</span></td>
                      <td class="text-center"><span class="pl-value-txt">{{ item.TOT_CNT }}</span></td>
                    </tr>
                  </template>
                  <!-- <tr>
                    <td class="text-center"><span class="pl-value-txt">2023년</span></td>
                    <td class="text-center"><span class="pl-value-txt">201</span></td>
                    <td class="text-center"><span class="pl-value-txt">42</span></td>
                    <td class="text-center"><span class="pl-value-txt">14</span></td>
                    <td class="text-center"><span class="pl-value-txt">257</span></td>
                  </tr>
                  <tr>
                    <td class="text-center"><span class="pl-value-txt">증감</span></td>
                    <td class="text-center"><span class="pl-value-txt">108</span></td>
                    <td class="text-center"><span class="pl-value-txt">1</span></td>
                    <td class="text-center"><span class="pl-value-txt">-7</span></td>
                    <td class="text-center"><span class="pl-value-txt">102</span></td>
                  </tr> -->
                </tbody>
              </table>
            </div>

            <!-- 바차트 -->
            <div class="pl-rounded-box is-mt-m ">
              <div class="d-flex pa-5">
                <strong class="pl-subtit">대ㆍ내외 민원 접수 현황</strong>
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
              </div>
            </div>

            <!-- 도넛 차트 -->
            <div class="pl-rounded-box is-mt-m ">
              <div class="d-flex pa-5">
                <strong class="pl-subtit">민원유형별 접수 현황</strong>
              </div>
              <div class="d-flex align-center px-5 py-5 is-border-top" >
                <div class="flex-grow-1">
                  <chartjsDoughnutChart
                    class="h140 pa-0 is-mt-s ml-5 mr-5"
                    :chartData="DonughtData"
                    :chartOptions="DonughtOptions"
                    :styles="{ background: '#fff',}"
                  ></chartjsDoughnutChart>
                </div>
              </div>
            </div>


          </div>
        </div>
        <!-- right -->
        <div class="pl-card-body is-border-left pl-scroll-body" style="height: calc(100vh - 248px)">
          <!-- 월별 대/내외 민원 접수 현황 -->
          <div>
            <div class="pl-grid-top pt-2">
              <strong class="pl-bullet-txt is-blue">월별 대/내외 민원 접수 현황</strong>
            </div>
            <!-- grid -->
            <v-data-table
              class="pl-grid is-mt-s"
              :headers="headers"
              :items="items.slice(0, items.length-1)"
              fixed-header
              item-key="ROW_NUM"
              height="180px"
              disable-pagination
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              loading-text="조회중입니다."
              :loading="loading">
              <template slot="footer">
                <div class="pl-grid-sum">
                  <table >
                    <colgroup>
                      <col v-for="(col, index) in headers" :key="index" :width=col.width />
                    </colgroup>
                    <tbody >
                      <tr >
                        <td class="pl-grid-sum-head text-center">소계</td>
                        <td class="text-center">
                          {{ items.length > 0 ? items[items.length-1].TOT_CNT : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT1 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT2 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT3 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT4 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT5 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT6 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT7 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT8 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT9 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT10 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT11 : 0 }}
                        </td>
                        <td class="text-center" >
                          {{ items.length > 0 ? items[items.length-1].CNT12 : 0 }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </v-data-table>
          </div>

          <!-- 민원유형별 접수 현황 -->
          <div class="pl-cols is-mt-m">
            <!-- grid -->
            <div>
              <div class="pl-grid-top pt-2">
                <strong class="pl-bullet-txt is-blue">민원유형별 접수 현황</strong>
              </div>
              <v-data-table
                class="pl-grid is-mt-s"
                :headers="headers2"
                :items="items2.slice(0, items2.length-1)"
                fixed-header
                item-key="ROW_NUM"
                height="150px"
                disable-pagination
                hide-default-footer
                no-data-text="등록된 데이터가 없습니다."
                loading-text="조회중입니다."
                :loading="loading">
                <template slot="footer">
                  <div class="pl-grid-sum">
                    <table >
                      <colgroup>
                        <col v-for="(col, index) in headers2" :key="index" :width=col.width />
                      </colgroup>
                      <tbody >
                        <tr >
                          <td class="pl-grid-sum-head text-center">소계</td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].CNT1 : 0 }} </td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].CNT2 : 0 }} </td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].CNT3 : 0 }} </td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].CNT4 : 0 }} </td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].CNT5 : 0 }} </td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].TOT_CNT : 0 }} </td>
                          <td class="text-center"> {{ items2.length > 0 ? items2[items2.length-1].CNT6 : 0 }} </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </v-data-table>
            </div>
            <!-- chart -->
            <div class="is-col-fix" style="width: 41%;">
              <div class="pl-rounded-box is-mt-s ml-5">
                <div class="d-flex pa-5">
                  <strong class="pl-subtit">센터별 민원 접수 현황</strong>
                </div>
                <div class="pl-cols d-flex align-center px-4 pt-4 is-border-top" >
                  <div class="flex-grow-1">
                    <chartjsBarChart
                      class="h140"
                      :chartData="BarData2"
                      :chartOptions="BarOptions2"
                      :styles="{ background: '#fff' }"
                    ></chartjsBarChart>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 민원귀책별 세부 유형 -->
          <!-- grid -->
          <div class="is-mt-m pb-4">
            <div class="pl-grid-top pt-2">
              <strong class="pl-bullet-txt is-blue">민원귀책별 세부 유형</strong>
            </div>
            <v-data-table
              class="pl-grid is-mt-s is-header-lg"
              :headers="headers3"
              :items="items3"
              fixed-header
              item-key="ROW_NUM"
              height="210px"
              hide-default-header
              hide-default-footer
              disable-pagination
              no-data-text="등록된 데이터가 없습니다."
              loading-text="조회중입니다."
              :loading="loading">
              <template v-slot:header>
                <thead class="v-data-table-header multi-row">
                  <tr>
                    <th rowspan="2" width="" class="text-center"><span>민원귀책별 발생건수</span></th>
                    <th colspan="3" width="300px" class="text-center"><span>오안내</span></th>
                    <th colspan="5" class="text-center"><span>미흡안내</span></th>
                    <th colspan="3" width="300px" class="text-center"><span>불친절</span></th>
                  </tr>
                  <tr>
                    <th class="text-center"><span>공고문/안내문 확인 누락</span></th>
                    <th class="text-center"><span>담당자(부서) 오안내</span></th>
                    <th class="text-center"><span>업무미숙지(업무프로세스미준수)</span></th>

                    <th class="text-center"><span>필수탐색/필수안내 미흡</span></th>
                    <th class="text-center"><span>상담자료 활용미흡</span></th>
                    <th class="text-center"><span>시스템 활용미흡</span></th>
                    <th class="text-center"><span>추측성상담(상담미흡)</span></th>
                    <th class="text-center"><span>필요한 부가안내 누락</span></th>

                    <th class="text-center"><span>무성의한 태도</span></th>
                    <th class="text-center"><span>경청(적극성) 부족</span></th>
                    <th class="text-center"><span>정중하지 못한 태도, 맞대응</span></th>
                  </tr>
                </thead>
              </template>
              <template v-slot:body>
                <tbody>
                  <template v-for="item in items3">
                    <tr :key="item.index" >
                        <td rowspan="2" class="text-center" style="vertical-align: middle;">{{ item.REG_YEAR+"년" }}</td>
                        <td class="text-center">{{ item.A_CNT1 }}</td>
                        <td class="text-center">{{ item.A_CNT2 }}</td>
                        <td class="text-center">{{ item.A_CNT3 }}</td>

                        <td class="text-center">{{ item.B_CNT1 }}</td>
                        <td class="text-center">{{ item.B_CNT2 }}</td>
                        <td class="text-center">{{ item.B_CNT3 }}</td>
                        <td class="text-center">{{ item.B_CNT4 }}</td>
                        <td class="text-center">{{ item.B_CNT5 }}</td>

                        <td class="text-center">{{ item.C_CNT1 }}</td>
                        <td class="text-center">{{ item.C_CNT2 }}</td>
                        <td class="text-center">{{ item.C_CNT3 }}</td>
                      </tr>
                      <tr>
                        <td class="is-bg-light text-right is-bold" colspan="3">{{ item.A_TOT_CNT }}</td>
                        <td class="is-bg-light text-right is-bold" colspan="5">{{ item.B_TOT_CNT }}</td>
                        <td class="is-bg-light text-right is-bold" colspan="3">{{ item.C_TOT_CNT }}</td>
                      </tr>
                  </template>
                </tbody>
              </template>
            </v-data-table>
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
  name: 'CTM_M0300_TAB_05', //대내외 민원 접수 현황

  components: {
    chartjsDoughnutChart,
    chartjsBarChart
  },
  data() {
    return {
      // chart
      DonughtData: {
        labels: ['오안내', '미흡한내', '불친절', '업무프로세스 미준수', '귀책없음'],
        datasets: [
          {
            backgroundColor: ["#FFC000","#7F7F7F","#75BDA7","#0070C0","#FF6600"],
            data: [0,0,0,0,0],
            noData: false,
          },
        ],
      },
      DonughtOptions: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const value = tooltipItem.raw;  // 데이터 값
                const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);  // 전체 합
                let percentage = Math.round(((value / total) * 100));  // 퍼센트 계산
                
                const percentages = tooltipItem.dataset.data.map(val => {
                  return Math.round(((val / total) * 100));
                });

                const sumPercent = percentages.reduce((acc, val) => acc + parseInt(val), 0);

                // 퍼센트 합이 100%가 되지 않으면 마지막 항목에 보정
                if (sumPercent !== 100 && tooltipItem.dataIndex == (percentages.length - 1)) {
                  const diff = 100 - sumPercent;
                  percentage = (parseInt(percentages[percentages.length - 1]) + diff).toString();
                }

                // 툴팁에 해당 항목의 퍼센트 표시
                return `${tooltipItem.label}: ${percentage}%`;  // 퍼센트 추가
              }
            }
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              padding: 10,
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'Rounded',
              pointStyleWidth: 11,
              boxHeight: 8,
            },
          }
        },
      },
      BarData: {
        labels: [
          '대내민원',
          '대외민원',
          '공개정보청구',
        ],
        datasets: [
         {
            label: "",
            backgroundColor: "#0070C0",
            data: [0,0,0],
          },
          {
            label: "",
            backgroundColor: "#7F7F7F",
            data: [0,0,0],
          },
        ],
      },
      BarData2: {
        labels: [
          '마이홈센터',
          '바로처리센터',
          '전세임대센터',
          '공가해소센터',
          '주택지원센터',
          '소계',
        ],
        datasets: [
         {
            label: "연간",
            backgroundColor: "#FF6600",
            data: [0,0,0,0,0,0],
          },
        ],
      },
      BarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.6,
        borderRadius: 4,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              pointStyle: 'rect',
              pointStyleWidth: 10,
              usePointStyle: true,
            }
          }
        },
      },
      BarOptions2: {
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.6,
        borderRadius: 4,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              padding: 20,
              pointStyle: 'rect',
              pointStyleWidth: 10,
              usePointStyle: true,
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        }
      },

      // grid : 월별 대/내외 민원 접수 현황
      headers: [
        { text: '센터별', value: 'CENTER_NM', align: 'center', width: '150px', sortable: false },
        { text: '연간', value: 'TOT_CNT', align: 'center is-bg-light', width: '', sortable: false },
        { text: '1월', value: 'CNT1', align: 'center', width: '', sortable: false },
        { text: '2월', value: 'CNT2', align: 'center', width: '', sortable: false },
        { text: '3월', value: 'CNT3', align: 'center', width: '', sortable: false },
        { text: '4월', value: 'CNT4', align: 'center', width: '', sortable: false },
        { text: '5월', value: 'CNT5', align: 'center', width: '', sortable: false },
        { text: '6월', value: 'CNT6', align: 'center', width: '', sortable: false },
        { text: '7월', value: 'CNT7', align: 'center', width: '', sortable: false },
        { text: '8월', value: 'CNT8', align: 'center', width: '', sortable: false },
        { text: '9월', value: 'CNT9', align: 'center', width: '', sortable: false },
        { text: '10월', value: 'CNT10', align: 'center', width: '', sortable: false },
        { text: '11월', value: 'CNT11', align: 'center', width: '', sortable: false },
        { text: '12월', value: 'CNT12', align: 'center', width: '', sortable: false },
      ],
      items: [],

      // grid : 민원유형별 접수 현황
      headers2: [
        { text: '구분', value: 'CVLCPT_SE_CD_NM', align: 'center px-0', width: '120px', sortable: false },
        { text: '오안내', value: 'CNT1', align: 'center px-0', width: '9%', sortable: false },
        { text: '미흡안내', value: 'CNT2', align: 'center px-0', width: '10%', sortable: false },
        { text: '불친절', value: 'CNT3', align: 'center px-0', width: '10%', sortable: false },
        { text: '업무프로세스 미준수', value: 'CNT4', align: 'center px-1', width: '19%', sortable: false },
        { text: '귀책없음', value: 'CNT5', align: 'center px-0', width: '10%', sortable: false },
        { text: '합계', value: 'TOT_CNT', align: 'center px-0', width: '', sortable: false },
        { text: '관리자 사과', value: 'CNT6', align: 'center is-bg-light-yellow', width: '13%', sortable: false },
      ],
      items2: [],

      // grid: 민원귀책별 세부 유형
      headers3: [
        { text: '민원귀책별 발생건수', value: 'REG_YEAR', align: 'center', width: '', sortable: false },
        { text: '공고문/안내문 확인 누락', value: 'A_CNT1', align: 'center', width: '', sortable: false },
        { text: '담당자(부서) 오안내', value: 'A_CNT2', align: 'center', width: '', sortable: false },
        { text: '업무미숙지(업무프로세스미준수)', value: 'A_CNT3', align: 'center', width: '', sortable: false },
        { text: '필수탐색/필수안내 미흡', value: 'B_CNT1', align: 'center', width: '', sortable: false },
        { text: '상담자료 활용미흡', value: 'B_CNT2', align: 'center', width: '', sortable: false },
        { text: '시스템 활용미흡', value: 'B_CNT3', align: 'center', width: '', sortable: false },
        { text: '추측성상담(상담미흡)', value: 'B_CNT4', align: 'center', width: '', sortable: false },
        { text: '필요한 부가안내 누락', value: 'B_CNT5', align: 'center', width: '', sortable: false },
        { text: '무성의한 태도', value: 'C_CNT1', align: 'center', width: '', sortable: false },
        { text: '경청(적극성) 부족', value: 'C_CNT2', align: 'center', width: '', sortable: false },
        { text: '정중하지 못한 태도, 맞대응', value: 'C_CNT3', align: 'center', width: '', sortable: false },
      ],
      items3: [],
      items4: [],

      DROP_YEAR_LIST:[],
      SRCH_YEAR: this.$moment().format("YYYY"),

      loading: false,
    }
  },
  methods: {
    async selectRcptCvlcptState(){
      this.items = [];
      this.items2 = [];
      this.items3 = [];
      this.items4 = [];

      let sUrl = '/phone-api/cvlcpt/selectRcptCvlcptState'
      
      let headParam = {head: {}};
      let postParam = {
        SRCH_YEAR: this.SRCH_YEAR
      };

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      // console.log(response);
      if(!response.HEADER.ERROR_FLAG) {
        // 월별 대내외 민원 접수 현황
        this.items = response.STATE01;
        this.BarData2.datasets[0].data = this.items.map(row=>{return parseInt(row.TOT_CNT)});

        // 민원유형별 접수 현황
        this.items2 = response.STATE02;
        let obj2 = this.items2[this.items2.length-1];
        let donught = [];
        let totCnt = parseInt(obj2.TOT_CNT);
        for(let i=1; i<=5; i++){
          donught.push(parseInt(obj2["CNT"+i]));
        }
        this.DonughtData.datasets[0].data = [...donught];
        
        // 민원귀책별 세부 유형
        this.items3 = response.STATE03;

        // 대내외 민원 접수 현황
        this.items4 = response.STATE04;

        for(let i=0; i<this.items4.length; i++){
          this.BarData.datasets[i].data = [
            parseInt(this.items4[i].IVOC)
            , parseInt(this.items4[i].OVOC)
            , parseInt(this.items4[i].LHVOC)
          ]
          
          this.BarData.datasets[i].label = this.items4[i].REG_YEAR;
        }

        if(this.items4.length > 1){
          this.items4.push({
            REG_YEAR: "증감"
            , IVOC: parseInt(this.items4[0].IVOC) - parseInt(this.items4[1].IVOC)
            , OVOC: parseInt(this.items4[0].OVOC) - parseInt(this.items4[1].OVOC)
            , LHVOC: parseInt(this.items4[0].LHVOC) - parseInt(this.items4[1].LHVOC)
            , TOT_CNT: parseInt(this.items4[0].TOT_CNT) - parseInt(this.items4[1].TOT_CNT)
          })
        }else{
          this.items4.push({
            REG_YEAR: "증감"
            , IVOC: 0
            , OVOC: 0
            , LHVOC: 0
            , TOT_CNT: 0
          })
        }
      }

      this.loading = false;
    },

    async selectCvlcptYear(){
      let sUrl = '/api/biz/common/select/selectCvlcptYear'
      let postParam = {};

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
          , sn : "selectCvlcptYear"
        }
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_YEAR_LIST = response.DATA.map(row=>{
          row.value = row.YR;
          row.text = row.YR_TEXT;
          return row;
        });
      }

      if(this.DROP_YEAR_LIST.length <= 0){
        this.DROP_YEAR_LIST = [{text: this.$moment().format("YYYY")+"년", value:this.$moment().format("YYYY")}];
      }
    },

    clickResetBtn(){
      this.SRCH_YEAR = this.$moment().format("YYYY");
      this.selectRcptCvlcptState();
    }
  },
  async mounted() {
    this.selectCvlcptYear();
    this.selectRcptCvlcptState();
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