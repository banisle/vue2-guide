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
                    :IsViewDropPickerProp="false"
                    :selectTermProp="true"
                    @startDayChange="()=>{ }"
                    @endDayChange="()=>{ }"
                    ParentStyleProp="width: 370px"
                />
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                접수채널
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle is-md"
                    :items="common_rcv_chn_list"
                    v-model="srchParam.srchRcptChnCd"
                    placeholder="전체"
                ></v-select>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                상담유형
              </span>
              <div class="pl-desc">
                <compo-cutt-type-combo
                    :FormSeProp="'SRCH'"
                    :CustcoProp="mixin_isEmpty(srchParam.srchCustcoId)? computedUserCenter : srchParam.srchCustcoId"
                    :DisabledProp="false"
                    @EMIT_CUTT_TYPE="setCuttType"
                />
              </div>
            </div>


          </div>
          <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
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
                    :disabled="computedUserCenter < 0 ? false : true"
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

            <div class="pl-form-inline">
              <span class="pl-label">
                상담지역
              </span>
              <compo-cutt-zone-combo
                  :FormSeProp="'SRCH'"
                  :ClearProp="clearProp"
                  @EMIT_CUTT_ZONE="setCuttZone"
              />
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                건수
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle is-xs"
                    oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                    suffix="건 이상"
                    v-model="srchParam.srchCnt"
                ></v-text-field>
              </div>
            </div>

            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getStatsResByCuttType"
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
        <!-- 휴가구분 -->
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
                :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
                :FileNameProp="`문의유형별_응대비율_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
                SheetNameProp="문의유형별_응대비율"
                :isMulti="true"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-rowspan"
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          item-class="cellClass"
          fixed-header
          item-key="index"
          :loading="isLoading"
          height="calc(-379px + 100vh)"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          hide-default-header
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- header -->
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th colspan="3" width="" class="text-center"><span>상담유형</span></th>
                <th colspan="3" width="21%" class="text-center"><span>상담건수</span></th>
                <th colspan="3" width="21%" class="text-center"><span>상담유형비율</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>대분류</span></th>
                <th class="text-center"><span>중분류</span></th>
                <th class="text-center"><span>소분류</span></th>
                <th class="text-center"><span>완료</span></th>
                <th class="text-center"><span>이관</span></th>
                <th class="text-center"><span>합계</span></th>
                <th class="text-center">
                  <span>대분류</span>
                  <!-- 툴팁 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="상담유형 대분류의 비율 "
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 question"
                    TooltipPositionProp="bottom"
                  ></compo-tooltip-btn>
                </th>
                <th class="text-center">
                  <span>중분류</span>
                  <!-- 툴팁 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="상담유형 각 대분류내의 중분류의 비율 "
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 question"
                    TooltipPositionProp="bottom"
                  ></compo-tooltip-btn>
                </th>
                <th class="text-center">
                  <span>소분류</span>
                  <!-- 툴팁 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="상담유형 각 중분류내의 소분류의 비율 "
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 question"
                    TooltipPositionProp="bottom"
                  ></compo-tooltip-btn>
                </th>
              </tr>
            </thead>
          </template>
          <!-- rowspan -->
          <template v-slot:item="{ item, index }">
            <tr
              :class="mixin_getItemClass(item)"
              :key="index">
              <td
                v-if="index === 0 || item.L_CUTT_TYPE_NM !== itemsRowSpan[index - 1].L_CUTT_TYPE_NM"
                :rowspan="mixin_getRowCount(index, 'L_CUTT_TYPE_NM')"
                :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.L_CUTT_TYPE_NM }}</td>
              <td
                v-if="index === 0 || item.M_CUTT_TYPE_NM !== itemsRowSpan[index - 1].M_CUTT_TYPE_NM"
                :rowspan="mixin_getRowCount(index, 'M_CUTT_TYPE_NM')"
                :class="`${item.cellClass || ''} text-${item.M_CUTT_TYPE_NM == '소계' ? 'center' : 'left'}`"
                :colspan="`${item.M_CUTT_TYPE_NM == '소계' ? 2 : 1}`"
              >{{ item.M_CUTT_TYPE_NM }}</td>

              <td v-if="item.M_CUTT_TYPE_NM != '소계'" :class="`${item.cellClass || ''} text-${item.S_CUTT_TYPE_NM == '소계' ? 'center' : 'left'}`">{{ item.S_CUTT_TYPE_NM }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.CNSLT_COMP_CNT }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.CNSLT_TRANS_CNT }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.TOT_CNSLT_CNT }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.L_CUTT_TYPE_PER }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.M_CUTT_TYPE_PER }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.S_CUTT_TYPE_PER }}</td>
            </tr>
          </template>
          <!-- 합계 -->
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <colgroup>
                  <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                </colgroup>
                <tbody >
                  <tr >
                    <td class="pl-grid-sum-head text-center" colspan="3">합계</td>
                    <td class="text-right">{{ totCntObject.CNSLT_COMP_CNT }}</td>
                    <td class="text-right">{{ totCntObject.CNSLT_TRANS_CNT }}</td>
                    <td class="text-right">{{ totCntObject.TOT_CNSLT_CNT }}</td>
                    <td class="text-right">{{ totCntObject.L_CUTT_TYPE_PER }}</td>
                    <td class="text-right">{{ totCntObject.M_CUTT_TYPE_PER }}</td>
                    <td class="text-right">{{ totCntObject.S_CUTT_TYPE_PER }}</td>
                  </tr>
                  <tr >
                    <td class="pl-grid-sum-head text-center" colspan="3">비율</td>
                    <td class="text-right">{{ totCntRate.CNSLT_COMP_RATE }}</td>
                    <td class="text-right">{{ totCntRate.CNSLT_TRANS_RATE }}</td>
                    <td class="text-right">{{ totCntRate.TOT_CNSLT_RATE }}</td>
                    <td class="text-right">{{ totCntObject.L_CUTT_TYPE_PER }}</td>
                    <td class="text-right">{{ totCntObject.M_CUTT_TYPE_PER }}</td>
                    <td class="text-right">{{ totCntObject.S_CUTT_TYPE_PER }}</td>
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
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";
export default {
  name: 'MENU_STA_M0600', //문의유형별 응대 비율
  components: {
    CompoCuttZoneCombo,
    CompoCuttTypeCombo
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modelPickerDate: '당일',
      itemsPickerDate: [
        '지정일',
        '당일',
        '전일',
        '일주일전',
        '전월',
        '전분기',
        '전년',
      ],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        { text: '대분류', value: 'L_CUTT_TYPE_NM', align: '', width: '', sortable: false },
        { text: '중분류', value: 'M_CUTT_TYPE_NM', align: '', width: '', sortable: false },
        { text: '소분류', value: 'S_CUTT_TYPE_NM', align: '', width: '', sortable: false },
        { text: '완료', value: 'CNSLT_COMP_CNT', align: '', width: '7%', sortable: false },
        { text: '이관', value: 'CNSLT_TRANS_CNT', align: '', width: '7%', sortable: false },
        { text: '합계', value: 'TOT_CNSLT_CNT', align: '', width: '7%', sortable: false },
        { text: '대분류', value: 'L_CUTT_TYPE_PER', align: '', width: '7%', sortable: false },
        { text: '중분류', value: 'M_CUTT_TYPE_PER', align: '', width: '7%', sortable: false },
        { text: '소분류', value: 'S_CUTT_TYPE_PER', align: '', width: '7%', sortable: false },
      ],
      headersExcel: [
        [
            { text: '상담유형', value: 'L_CUTT_TYPE_NM', align: '', width: '', sortable: false },
            { text: '', value: 'M_CUTT_TYPE_NM', align: '', width: '', sortable: false },
            { text: '', value: 'S_CUTT_TYPE_NM', align: '', width: '', sortable: false },
            { text: '상담건수', value: 'CNSLT_COMP_CNT', align: '', width: '7%', sortable: false },
            { text: '', value: 'CNSLT_TRANS_CNT', align: '', width: '7%', sortable: false },
            { text: '', value: 'TOT_CNSLT_CNT', align: '', width: '7%', sortable: false },
            { text: '상담유형비율', value: 'L_CUTT_TYPE_PER', align: '', width: '7%', sortable: false },
            { text: '', value: 'M_CUTT_TYPE_PER', align: '', width: '7%', sortable: false },
            { text: '', value: 'S_CUTT_TYPE_PER', align: '', width: '7%', sortable: false },
        ],
        [
            { text: '대분류', value: 'L_CUTT_TYPE_NM', align: '', width: '150px', sortable: false },
            { text: '중분류', value: 'M_CUTT_TYPE_NM', align: '', width: '150px', sortable: false },
            { text: '소분류', value: 'S_CUTT_TYPE_NM', align: '', width: '300px', sortable: false },
            { text: '완료', value: 'CNSLT_COMP_CNT', align: '', width: '100px', sortable: false },
            { text: '이관', value: 'CNSLT_TRANS_CNT', align: '', width: '100px', sortable: false },
            { text: '합계', value: 'TOT_CNSLT_CNT', align: '', width: '100px', sortable: false },
            { text: '대분류', value: 'L_CUTT_TYPE_PER', align: '', width: '100px', sortable: false },
            { text: '중분류', value: 'M_CUTT_TYPE_PER', align: '', width: '100px', sortable: false },
            { text: '소분류', value: 'S_CUTT_TYPE_PER', align: '', width: '100px', sortable: false },
        ],
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
      totCntObject: {},
      totCntRate: {},
      isLoading: false,

    }
  },
  async created() {
    let codeName = ['CVC']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    if (this.computedUserCenter < 0) {
      this.common_rcv_chn_list = await this.mixin_common_code_get(this.list_common_code, 'CVC', '전체')
    } else {
      this.common_rcv_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.computedUserCenter, '전체')
    }
    this.common_ognz_list = await this.mixin_ognz_list();
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '')

    if (this.mixin_isEmpty(this.selectedCustcoItem)) {
      if (this.computedUserCenter > 0) {
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      } else {
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
  },
  mounted() {
  },
  methods: {
    setCuttZone(data) {
      this.srchParam.srchCuttZone = data;
    },
    setCuttType(data) {
      this.srchParam.srchCuttType = data.reverse().find((item) => item != null && item != '');
    },
    async getStatsResByCuttType() {
      this.isLoading = true;
      this.itemsRowSpan = []
      let sUrl = '/api/biz/common/select/selectStatsResRateByCuttType';
      let postParam = {
        SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', '') + '000000',
        SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', '') + '235959',
        SRCH_RCPT_CHN_CD: this.srchParam.srchRcptChnCd,
        SRCH_CUTT_TYPE: this.srchParam.srchCuttType,
        SRCH_CUSTCO_ID: this.srchParam.srchCustcoId,
        SRCH_DEPT_ID: this.mixin_isEmpty(this.selectedDeptItem) ? '' : this.selectedDeptItem.DEPT_ID,
        SRCH_CUTT_ZONE_1: this.srchParam.srchCuttZone[0],
        SRCH_CUTT_ZONE_2: this.srchParam.srchCuttZone[1],
        SRCH_CUTT_ZONE_3: this.srchParam.srchCuttZone[2],
        SRCH_CNT: this.srchParam.srchCnt
      }
      let headParam = {
        head: {
          sn: 'selectStatsResRateByCuttType',
          ns: 'lhcs.statistics.dao.xml.StaticticsResponseMapper'
        }
        , timeout : 300000
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      try {
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map((item,index) => {
            if (item.L_CUTT_TYPE_NM === '합계') {
              this.totCntObject = item
            } else {
              if(item.S_CUTT_TYPE_NM ==='소계'){
                item.L_CUTT_TYPE_NM = response.DATA[index-1].L_CUTT_TYPE_NM
                item.M_CUTT_TYPE_NM = response.DATA[index-1].M_CUTT_TYPE_NM
                item.cellClass = 'is-bg-light-yellow'
              }else if(item.M_CUTT_TYPE_NM ==='소계'){
                item.L_CUTT_TYPE_NM = response.DATA[index-1].L_CUTT_TYPE_NM
                item.cellClass = 'is-bg-light-red'
              }
              this.itemsRowSpan.push(item)
            }
          })
          // 상담유형비율 계산
          this.calculateRatios()
          this.itemsRowSpan = this.mixin_setCntWithComma(this.itemsRowSpan)
          if (!this.mixin_isEmpty(this.totCntObject)) {
            this.setRate();
            this.totCntObject = this.mixin_setCntWithComma(this.totCntObject)
          }
        }
      }catch(e){
        this.isLoading = false;
        this.showAlertCaution({msg:'조회 중 문제가 발생했습니다.'})
      }
      this.isLoading = false;
    },
    setRate() {
      this.totCntRate = {}
      let cntObj = this.totCntObject
      let total_comp = typeof cntObj.CNSLT_COMP_CNT === 'string' ? cntObj.CNSLT_COMP_CNT.replaceAll(',', '') : cntObj.CNSLT_COMP_CNT
      let total_trans = typeof cntObj.CNSLT_TRANS_CNT  === 'string' ? cntObj.CNSLT_TRANS_CNT.replaceAll(',', '') : cntObj.CNSLT_TRANS_CNT
      let total_cnt = typeof cntObj.TOT_CNSLT_CNT  === 'string' ? cntObj.TOT_CNSLT_CNT.replaceAll(',', '') : cntObj.TOT_CNSLT_CNT

      let tot_comp_per = Number(total_comp) / Number(total_cnt) * 100;
      let tot_trans_per = Number(total_trans) / Number(total_cnt) * 100;
      let tot_per = tot_comp_per + tot_trans_per;

      this.totCntRate = {
        CNSLT_COMP_RATE: parseFloat(tot_comp_per.toFixed(2)) + '%',
        CNSLT_TRANS_RATE: parseFloat(tot_trans_per.toFixed(2)) + '%',
        TOT_CNSLT_RATE: parseFloat(tot_per.toFixed(0)) + '%',
      }
    },
    calculateRatios() {
      // 1. L_CUTT_TYPE_NM과 M_CUTT_TYPE_NM가 같은 경우 S_CUTT_TYPE_NM "소계"의 총합을 계산하고 비율 구하기
      const groupedByType1AndType2 = this.itemsRowSpan.reduce((acc, obj) => {
        const key = `${obj.L_CUTT_TYPE_NM}-${obj.M_CUTT_TYPE_NM}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});

      const step1Results = [];

      for (const key in groupedByType1AndType2) {
        const group = groupedByType1AndType2[key];
        const subTotalObj = group.find((item) => item.S_CUTT_TYPE_NM === "소계");

        if (subTotalObj) {
          const subTotal = subTotalObj.TOT_CNSLT_CNT;

          group.forEach((obj) => {
            if (obj.S_CUTT_TYPE_NM !== "소계") {
              obj.S_CUTT_TYPE_PER = ((obj.TOT_CNSLT_CNT / subTotal) * 100 >= 100) ?
                  ((obj.TOT_CNSLT_CNT / subTotal) * 100).toFixed(0)+'%' : ((obj.TOT_CNSLT_CNT / subTotal) * 100).toFixed(2)+'%'; // type2 비율 계산
            }
          });
        }

        step1Results.push(...group);
      }
      // 2. L_CUTT_TYPE_NM이 같은 경우 M_CUTT_TYPE_NM "소계"의 총합을 계산하고 비율 구하기
      const groupedByType1 = step1Results.reduce((acc, obj) => {
        const key = obj.L_CUTT_TYPE_NM;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});

      const finalResults = [];

      for (const key in groupedByType1) {
        const group = groupedByType1[key];
        const totalObj = group.find((item) => item.M_CUTT_TYPE_NM === "소계");

        if (totalObj) {
          const total = totalObj.TOT_CNSLT_CNT;

          group.forEach((obj) => {
            if (obj.M_CUTT_TYPE_NM == "소계" || obj.S_CUTT_TYPE_NM == "소계") {
              obj.M_CUTT_TYPE_PER = ((obj.TOT_CNSLT_CNT / total) * 100 >= 100) ?
                  ((obj.TOT_CNSLT_CNT / total) * 100).toFixed(0)+'%' : ((obj.TOT_CNSLT_CNT / total) * 100).toFixed(2)+'%'; // type2 비율 계산
            }
            if(obj.M_CUTT_TYPE_NM == "소계" && obj.S_CUTT_TYPE_NM == ""){
              obj.L_CUTT_TYPE_PER =  ((total / this.totCntObject.TOT_CNSLT_CNT) * 100 >= 100) ?
                  ((total / this.totCntObject.TOT_CNSLT_CNT) * 100).toFixed(0)+'%' : ((total / this.totCntObject.TOT_CNSLT_CNT) * 100).toFixed(2)+'%'; // type2 비율 계산
            }
          });
        }
        finalResults.push(...group);
      }
    },
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
      this.common_rcv_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.selectedCustcoItem.CUSTCO_ID, '전체')
      this.srchParam.srchCuttType = '';
      this.srchParam.srchRcptChnCd = '';
    }
  },
};
</script>

<style lang="scss" scoped>

</style>