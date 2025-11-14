<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                    :StartDayProp.sync="srchParam.srchStartDt"
                    :EndDayProp.sync="srchParam.srchEndDt"
                    @startDayChange="mixin_testLog(date2)"
                    @endDayChange="mixin_testLog(date3)"
                    ParentStyleProp="width: 306px"
                />
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label" style="width: 68px">
                센터
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="custcoList"
                    v-model="selectedCustcoItem"
                    return-object
                    :disabled="true"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="width: 56px">
                부서
              </span>
              <div class="pl-desc">
                <v-select
                    v-model="selectedDeptItem"
                    class="pl-form type-middle"
                    :items="mixin_ognz_list_detail(common_ognz_list, selectedCustcoItem.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                    return-object
                    item-value="DEPT_ID"
                    placeholder="전체"
                    :disabled="mixin_isEmpty(selectedCustcoItem)?true:false"
                ></v-select>
              </div>
            </div>

            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getStatsAgentCntctDist"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>


          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16 ">
            <ul class="pl-list-info mt-0">
              <li><strong>사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.</li>
            </ul>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="headersExcel"
                :DataBodyProp="[...itemsRowSpan, ...totCntObject]"
                :FileNameProp="`상담사별_접촉분포_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
                SheetNameProp="상담사별_접촉분포"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
            class="pl-grid is-mt-s is-rowspan "
            :headers="headersRowSpan"
            :items="itemsRowSpan"
            item-class="cellClass"
            fixed-header
            item-key="RNUM"
            height="622px"
            :items-per-page="itemsRowSpan.length"
            :loading="isLoading"
            hide-default-footer
            no-data-text="등록된 데이터가 없습니다."
            @dblclick:row="showDetail()"
            :page.sync="page"
            @page-count="pageCount = $event">
          <!-- 합계 -->
          <template slot="footer">
            <div class="pl-grid-sum">
              <table>
                <colgroup>
                  <col v-for="(col, RNUM) in headersRowSpan" :key="RNUM" :width=col.width />
                </colgroup>
                <tbody>
                <tr v-for="(totRow,i) in totCntObject">
                  <td v-if="totRow" class="pl-grid-sum-head text-center" colspan="3">{{ totRow.USER_NM }}</td>
                  <td class="text-right">{{ totRow.ALL_CNT }}</td>
                  <td class="text-right">{{ totRow.FRM1_CNT }}</td>
                  <td class="text-right">{{ totRow.FRM2_CNT }}</td>
                  <td class="text-right">{{ totRow.CUST_CNT }}</td>
                  <td class="text-right">{{ totRow.MGOF_CNT }}</td>
                  <td class="text-right">{{ totRow.ARA_HDQ_CNT }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </template>
        </v-data-table>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MENU_STA_M1400', //상담사별 접촉분포 통계 비율
  components: {},
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        {text: 'No', value: 'RNUM', align: 'center', width: '50px', sortable: false},
        {text: '팀', value: 'DEPT_NM', align: '', width: '', sortable: false},
        {text: '상담사', value: 'USER_NM', align: '', width: '', sortable: false},
        {text: '총접촉횟수', value: 'ALL_CNT', align: 'right', width: '11%', sortable: false},
        {text: '시공사', value: 'FRM1_CNT', align: 'right', width: '11%', sortable: false},
        {text: '유지보수', value: 'FRM2_CNT', align: 'right', width: '11%', sortable: false},
        {text: '고객', value: 'CUST_CNT', align: 'right', width: '11%', sortable: false},
        {text: '관리소', value: 'MGOF_CNT', align: 'right', width: '11%', sortable: false},
        {text: '본부', value: 'ARA_HDQ_CNT', align: 'right', width: '11%', sortable: false},
      ],
      headersExcel: [
        {text: 'No', value: 'RNUM', align: 'center', width: '50px', sortable: false},
        {text: '팀', value: 'DEPT_NM', align: '', width: '200px', sortable: false},
        {text: '상담사', value: 'USER_NM', align: '', width: '150px', sortable: false},
        {text: '총접촉횟수', value: 'ALL_CNT', align: 'right', width: '100px', sortable: false},
        {text: '시공사', value: 'FRM1_CNT', align: 'right', width: '100px', sortable: false},
        {text: '유지보수', value: 'FRM2_CNT', align: 'right', width: '100px', sortable: false},
        {text: '고객', value: 'CUST_CNT', align: 'right', width: '100px', sortable: false},
        {text: '관리소', value: 'MGOF_CNT', align: 'right', width: '100px', sortable: false},
        {text: '본부', value: 'ARA_HDQ_CNT', align: 'right', width: '100px', sortable: false},
      ],
      itemsRowSpan: [],
      srchParam: {
        srchStartDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttType: '',
        srchCuttZone: [],
        srchCustcoId: '',
        srchDeptId: '',
        srchUserId: '',
        srchCnt: '',
        srchRcptChnCd: '',
      },
      clearProp: false,

      list_common_code: [],
      common_ognz_list: [],
      common_rcv_chn_list: [],
      custcoList: [],
      userList: [],
      selectedCustcoItem: {},
      selectedDeptItem: {},
      totCntObject: [
        {USER_NM: '합계', ALL_CNT: 0, FRM1_CNT: 0, FRM2_CNT: 0, CUST_CNT: 0, MGOF_CNT: 0, ARA_HDQ_CNT: 0},
        {USER_NM: '평균', ALL_CNT: 0, FRM1_CNT: 0, FRM2_CNT: 0, CUST_CNT: 0, MGOF_CNT: 0, ARA_HDQ_CNT: 0}
      ],
      totCntRate: {},
      isLoading: false,

    }
  },
  async created() {
    // 상담지역조회
    this.common_ognz_list = await this.mixin_ognz_list();
    // 고객사 목록 조회
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '')

    // 해당 메뉴는 바로처리 센터에서만 사용하기 때문에 custco_id = 4 고정
    this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === "4")
  },
  mounted() {
  },
  methods: {
    async getStatsAgentCntctDist() {
      this.isLoading = true;
      this.itemsRowSpan = [];
      let sUrl = '/api/biz/common/select/selectStatsAgentCntctDist'
      let postParam = {
        SRCH_CUSTCO_ID: this.srchParam.srchCustcoId,
        SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', ''),
        SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', ''),
        SRCH_DEPT_ID: this.selectedDeptItem.DEPT_ID,
      }
      let headParam = {head: {ns: 'lhcs.statistics.dao.xml.StatisticsFlawMapper', timeout: 300000}}
      try {
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : item[key]
              }
            });
            this.itemsRowSpan.push(item)
          })

          // 합계, 평균
          this.totCntObject.map(item => {
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                if (item.USER_NM === '합계') {
                  item[key] = this.mixin_sum_field(this.itemsRowSpan, key)
                } else {
                  item[key] = this.mixin_avg_field(this.itemsRowSpan, key)
                }
              }
            });
          })
        }
      } catch (e) {
        this.isLoading = false;
      }
      this.isLoading = false;
    }
  },
  computed: {},
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID;
    }
  },
};
</script>

<style lang="scss" scoped>

</style>