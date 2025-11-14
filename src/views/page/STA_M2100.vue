<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회기간
              </span>
              <div class="pl-desc" style="width: 224px">
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  StyleProp="flex: 0 0 100px"
                  :DateProp.sync="srchParam.srchStartYm"/>
                <span class="pl-">~</span>
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  StyleProp="flex: 0 0 100px"
                  :DateProp.sync="srchParam.srchEndYm"/>
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

            <div>
              <v-btn
                class="pl-btn is-icon"
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
              <li><strong>사용방법!</strong> 최대 3년을 초과하여 조회하지 않도록 해주세요.</li>
            </ul>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>
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
          height="606px"
          :items-per-page="ROW_PER_PAGE"
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
                <th scope="col" rowspan="3" width="" class="text-center"><span>년월</span></th>
                <th scope="colgroup" colspan="5" width="" class="text-center"><span>총 상담인원</span></th>
                <th scope="colgroup" colspan="7" width="" class="text-center"><span>근속기간별 상담사현황</span></th>
              </tr>
              <tr>
                <th scope="colgroup" colspan="3" class="text-center"><span>풀타임</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>파트타임</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>계</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>3년 초과</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>2년 초과<br>3년 이하</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>1년 초과<br>2년 이하</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>6개월 초과<br>1년 이하</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>3개월 초과<br>6개월 이하</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>3개월 이하</span></th>
                <th scope="col" rowspan="2" class="text-center"><span>계</span></th>
              </tr>
              <tr>
                <th scope="row" class="text-center">일반</th>
                <th scope="row" class="text-center">토지상가</th>
                <th scope="row" class="text-center">소계</th>
              </tr>
            </thead>
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
                    <td class="pl-grid-sum-head text-center" >계</td>

                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type01") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type02") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type03") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type04") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type05") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type06") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type07") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type08") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type09") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type10") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type11") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type12") }}
                    </td>
                  </tr>
                  <tr >
                    <td class="pl-grid-sum-head text-center" >평균</td>

                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type01") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type02") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type03") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type04") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type05") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type06") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type07") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type08") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type09") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type10") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type11") }}
                    </td>
                    <td class="text-right" >
                      {{ mixin_sum_field(this.itemsRowSpan, "type12") }}
                    </td>
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
  name: 'MENU_STA_M2100', //근속기간별 상담사 현황
  components: {
  },
  data() {
    return {
      date2: '2024-12',
      date3: '2024-12',

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        { text: '년월', value: 'type00', align: 'center', width: '120px', sortable: false },
        { text: '일반', value: 'type01', align: 'right', width: '', sortable: false },
        { text: '토지상가', value: 'type02', align: 'right', width: '', sortable: false },
        { text: '소계', value: 'type03', align: 'right', width: '', sortable: false },
        { text: '파트타임', value: 'type04', align: 'right', width: '', sortable: false },
        { text: '계', value: 'type05', align: 'right', width: '', sortable: false },
        { text: '3년초과', value: 'type06', align: 'right', width: '', sortable: false },
        { text: '2년초과 3년이하', value: 'type07', align: 'right', width: '', sortable: false },
        { text: '1년초과 2년이하', value: 'type08', align: 'right', width: '', sortable: false },
        { text: '6개월초과 1년이하', value: 'type09', align: 'right', width: '', sortable: false },
        { text: '3개월초과 6개월이하', value: 'type10', align: 'right', width: '', sortable: false },
        { text: '3개월이하', value: 'type11', align: 'right', width: '', sortable: false },
        { text: '계', value: 'type12', align: 'right', width: '', sortable: false },

      ],
      itemsRowSpan: [
        { index: 1,
          type00: '2024년 01월',
          type01: 14,
          type02: 0,
          type03: 0,
          type04: 582,
          type05: 22,
          type06: 15,
          type07: 15,
          type08: 15,
          type09: 15,
          type10: 15,
          type11: 15,
          type12: 15,
        },
      ],
      srchParam: {
        srchStartYm: this.$moment(new Date()).format('YYYY-MM'),
        srchEndYm: this.$moment(new Date()).format('YYYY-MM'),
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
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
    }
  },
};
</script>

<style lang="scss" scoped>

</style>