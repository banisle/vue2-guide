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
                상담지역
              </span>
              <div class="pl-desc">
                <compo-cutt-zone-combo
                    :FormSeProp="'SRCH'"
                    :ClearProp="clearProp"
                    @EMIT_CUTT_ZONE="setCuttZone"
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
                @click="getStatsTop3ByZone"
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
                :DataBodyProp="itemsRowSpan"
                :FileNameProp="`지역별_TOP3_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
                SheetNameProp="TOP3"
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
          height="calc(-262px + 100vh)"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer
          :loading="isLoading"
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- rowspan -->
          <template v-slot:item="{ item, index }">
            <tr
              :key="index">
              <td
                v-if="index === 0 || item.SIDO_NM !== itemsRowSpan[index - 1].SIDO_NM"
                :rowspan="mixin_getRowCount(index, 'SIDO_NM')"
                :class="`text-center ${item.cellClass}`">{{ item.SIDO_NM }}</td>

              <td :class="`${item.cellClass || ''} text-left`">{{ item.JIGU_NM }}</td>
              <td :class="`${item.cellClass || ''} text-left`">{{ item.CUTT_TYPE_NM }}</td>
              <td :class="`${item.cellClass || ''} text-center`">{{ item.RK }}</td>
              <td :class="`${item.cellClass || ''} text-right`">{{ item.CNSLT_COMP_CNT }}건</td>
            </tr>
          </template>
        </v-data-table>

      </div>
    </div>
  </div>
</template>

<script>
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";

export default {
  name: 'MENU_STA_M0900', //지역별 TOP3  현황
  components: {
    CompoCuttZoneCombo
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
        { text: '권역', value: 'SIDO_NM', align: 'center', width: '20%', sortable: false },
        { text: '지구', value: 'JIGU_NM', align: 'center', width: '20%', sortable: false },
        { text: '유형', value: 'CUTT_TYPE_NM', align: 'center', width: '20%', sortable: false },
        { text: '순위', value: 'RK', align: 'center', width: '20%', sortable: false },
        { text: '응대건수', value: 'CNSLT_COMP_CNT', align: 'center', width: '20%', sortable: false },
      ],
      headersExcel: [
        { text: '권역', value: 'SIDO_NM', align: 'center', width: '100px', sortable: false },
        { text: '지구', value: 'JIGU_NM', align: 'center', width: '300px', sortable: false },
        { text: '유형', value: 'CUTT_TYPE_NM', align: 'center', width: '200px', sortable: false },
        { text: '순위', value: 'RK', align: 'center', width: '100px', sortable: false },
        { text: '응대건수', value: 'CNSLT_COMP_CNT', align: 'center', width: '100px', sortable: false },
      ],
      itemsRowSpan: [],
      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttZone : [],
        srchCustcoId : '',
        srchDeptId : '',
      },
      clearProp : false,

      list_common_code : [],
      common_ognz_list : [],
      common_rcv_chn_list : [],
      custcoList : [],
      userList : [],
      selectedCustcoItem : {},
      selectedDeptItem : {},
      totCntObject : {},
      isLoading : false,

    }
  },
  async created() {
    // 상담지역 조회
    this.common_ognz_list = await this.mixin_ognz_list();
    // 고객사 목록 조회
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )
    // 접속 고객사에 따라 선택 고객사 기본세팅
    if(this.mixin_isEmpty(this.selectedCustcoItem)){
      if(this.computedUserCenter > 0){
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      }else{
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
  },
  mounted() {
  },
  methods: {
    setCuttZone(data){
      this.srchParam.srchCuttZone = data;
    },
    async getStatsTop3ByZone(){
      this.isLoading = true;
      this.itemsRowSpan =[]
      let sUrl = '/api/biz/common/select/selectStatsTop3ByZone';
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.mixin_isEmpty(this.selectedDeptItem) ? '':this.selectedDeptItem.DEPT_ID,
        SRCH_CUTT_ZONE_1 : this.srchParam.srchCuttZone[0],
        SRCH_CUTT_ZONE_2 : this.srchParam.srchCuttZone[1],
        SRCH_CUTT_ZONE_3 : this.srchParam.srchCuttZone[2],
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsZoneMapper'
        }
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map((item,index) =>{
          Object.keys(item).some((key) => {
            if(key.includes("CNT")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          if(index > 0 && item.SIDO_NM != response.DATA[index-1].SIDO_NM) item.cellClass = 'is-border-top is-border-black'
          this.itemsRowSpan.push(item)
        })
      }
      this.isLoading = false;
    }
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