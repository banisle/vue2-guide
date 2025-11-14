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
                <v-select
                  v-model="modelPickerDate"
                  :items="itemsPickerDate"
                  @change="setGridHeader"
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                ></v-select>
                <v-select
                  v-model="srchParam.srchYear"
                  :items="YEAR_DROP"
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                ></v-select>
                <template v-if="modelPickerDate === 'Daily'">
                  <v-select
                    v-model="srchParam.srchMonth"
                    :items="MONTH_DROP"
                    class="pl-form type-middle is-sm"
                    placeholder="전체"
                  ></v-select>
                </template>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                제보유형
              </span>
              <div class="pl-desc">
                <v-select
                    :items="common_recm_list"
                    v-model="srchParam.srchRecmCd"
                  class="pl-form type-middle is-md"
                  placeholder="전체"
                ></v-select>
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
                @click="srch"
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
            <strong class="pl-bullet-txt is-blue">제보현황 통계</strong>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="headersExcel"
                :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
                :FileNameProp="`제보현황_${modelPickerDate === 'Monthly'? srchParam.srchYear : srchParam.srchMonth.replaceAll('-','')}`"
                SheetNameProp="제보현황"
                :DisabledProp="mixin_isEmpty(itemsRowSpan)"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-rowspan is-hover"
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          :loading="isLoading"
          loading-text="조회중"
          item-class="cellClass"
          fixed-header
          item-key="index"
          height="651px"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer

          no-data-text="등록된 데이터가 없습니다."
          :page.sync="page"
          @page-count="pageCount = $event"
        >
          <!-- rowspan -->
          <template v-slot:item="{ item, index }">
            <tr
              :class="mixin_getItemClass(item)"
              @dblclick="showDetail()"
              :key="index">
              <td
                v-if="index === 0 || item.DEPT_NM !== itemsRowSpan[index - 1].DEPT_NM"
                :rowspan="mixin_getRowCount(index, 'DEPT_NM')"
                :class="mixin_getHeaderClass(headersRowSpan[0].align)"
                @click="mixin_testLog('hello')"
              >{{ item.DEPT_NM }}</td>
              <td class="text-center">{{ item.USER_NM }}</td>
<!--                  :class="`${item.cellClass || ''} text-right is-hover`"-->
              <td v-for="(col, idx) in cntColumn" :key="col.value"
                  :class="col.value.includes('CNT')? item[col.value] < 1? 'text-right' : 'text-right is-txt-blue is-hover' : 'text-center'"
                  style="position: relative; cursor: pointer;"
                  @click="setSrchParam(item.USER_ID, col.value)"
                  @dblclick="showDetail"
                 >
                {{ item[col.value] }}
              </td>
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
                    <td class="pl-grid-sum-head text-center" colspan="2">총계</td>
                    <td v-for="(col, idx) in cntColumn" class="text-right is-hover"
                        @click="setSrchParam(totCntObject.USER_ID, col.value)"
                    > {{ totCntObject[col.value] }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </v-data-table>

      </div>
    </div>
    <!-- dialog : 상세 -->
    <v-dialog
      v-model="dialogDetail"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="상담사 제보 상세목록"
        @hide="mixin_hideDialog('Detail')"
      >
        <template slot="body">
          <STA_M1900_DIALOG
              :SRCH_PROP="this.srchParam"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Detail')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import STA_M1900_DIALOG from '@/views/page/STA_M1900_DIALOG'

export default {
  name: 'MENU_STA_M1900', //제보현황 통계
  components: {
    STA_M1900_DIALOG,
  },
  data() {
    return {
      dialogDetail: false,

      modelPickerDate: 'Monthly',
      itemsPickerDate: [
        {text : '월별', value : 'Monthly'},
        {text : '일별', value : 'Daily'},
      ],
      modelPickerYear: '2024',
      YEAR_DROP: [],
      modelPickerDay: '1월',
      MONTH_DROP: [],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        { text: '팀', value: 'DEPT_NM', align: 'center', width: '10%', sortable: false },
        { text: '상담사', value: 'USER_NM', align: 'center', width: '5%', sortable: false },
      ],
      headersExcel: [
        { text: '팀', value: 'DEPT_NM', align: 'center', width: '150px', sortable: false },
        { text: '상담사', value: 'USER_NM', align: 'center', width: '100px', sortable: false },
      ],
      itemsRowSpan: [],
      cntColumn : [],
      excelColumn : [],
      srchParam: {
        srchYear: this.$moment().format('YYYY'),
        srchMonth: '',
        srchCuttType: '',
        srchCuttZone: [],
        srchCustcoId: '',
        srchDeptId: '',
        srchUserId: '',
        srchCnt: '',
        srchRecmCd: '',
      },
      clearProp: false,

      list_common_code: [],
      common_ognz_list: [],
      common_recm_list : [],
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
    const date = new Date();
    const curYear = date.getFullYear();
    for (let i = -10; i < 1; i++) {
      this.YEAR_DROP.unshift({ text: `${curYear + i}년`, value: (curYear + i).toString() });
    }
    for (let i = 1; i < 13; i++) {
      this.MONTH_DROP.push({ text: `${i}월`, value: (i).toString().padStart(2, "0") });
    }
    this.srchParam.srchMonth = this.$moment().format('MM').toString().padStart(2, "0")
    // 헤더 세팅
    this.setGridHeader();

    let codeName = ['RECM']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    if (this.computedUserCenter < 0) {
      this.common_recm_list = await this.mixin_common_code_get(this.list_common_code, 'RECM', '전체')
    } else {
      this.common_recm_list = await this.mixin_common_code_get_global(this.list_common_code, 'RECM', this.computedUserCenter, '전체')
    }
    // 상담지역조회
    this.common_ognz_list = await this.mixin_ognz_list();
    // 고객사 목록 조회
    this.custcoList = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' )

    if (this.mixin_isEmpty(this.selectedCustcoItem)) {
      if (this.computedUserCenter > 0) {
        console.log("this.computedUserCenter", this.computedUserCenter)
        this.selectedCustcoItem = this.custcoList.find(item => item.CUSTCO_ID === this.computedUserCenter)
      } else {
        this.selectedCustcoItem = this.custcoList[0]
      }
    }
  },
  methods: {
    setGridHeader(){
      this.itemsRowSpan = []
      if(this.modelPickerDate === 'Monthly'){
        this.monthHeaders()
      }else{
        this.dayHeaders()
      }
      this.headersRowSpan = [...this.headersRowSpan.slice(0,2), ...this.cntColumn]
      this.headersExcel = [...this.headersExcel.slice(0,2), ...this.excelColumn]
    },
    monthHeaders() {
      this.cntColumn = Array.from({ length: 12 }, (_, i) => ({
        text: `${i + 1}월`,
        value: 'CNT_'+(i + 1).toString().padStart(2, "0"),
        align: 'right',
        width: '3%',
        sortable: false
      }));
      this.excelColumn = Array.from({ length: 12 }, (_, i) => ({
        text: `${i + 1}월`,
        value: 'CNT_'+(i + 1).toString().padStart(2, "0"),
        align: 'right',
        width: '80px',
        sortable: false
      }));
      this.cntColumn.push({ text: '합계', value: 'CNT_SUM', align: 'right', width: '4%', sortable: false })
      this.excelColumn.push({ text: '합계', value: 'CNT_SUM', align: 'right', width: '80px', sortable: false })
    },
    dayHeaders() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 현재 월 (0부터 시작)
      const lastDay = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날 계산

      this.cntColumn = Array.from({ length: lastDay }, (_, i) => ({
        text: `${i + 1}일`,
        value: 'CNT_'+(i + 1).toString().padStart(2, "0"),
        align: 'right',
        width: '3.5%',
        sortable: false
      }));
      this.cntColumn.push({ text: '합계', value: 'CNT_SUM', align: 'right', width: '4%', sortable: false })
      this.excelColumn = Array.from({ length: lastDay }, (_, i) => ({
        text: `${i + 1}일`,
        value: 'CNT_'+(i + 1).toString().padStart(2, "0"),
        align: 'right',
        width: '80px',
        sortable: false
      }));
      this.excelColumn.push({ text: '합계', value: 'CNT_SUM', align: 'right', width: '80px', sortable: false })
    },
    srch(){
        this.getStatsGvifmt(this.modelPickerDate)
    },
    async getStatsGvifmt(se){
      this.isLoading = true;
      this.itemsRowSpan = []
      this.totCntObject = {}
      let sUrl = `/api/biz/common/select/selectStatsGvifmt${se}`
      let postParam = {
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_DEPT_ID : this.selectedDeptItem.DEPT_ID,
        SRCH_GVIFMT_TYPE_CD : this.srchParam.srchRecmCd
      }
      if(se ==='Monthly'){
        this.$set(postParam, 'SRCH_YEAR', this.srchParam.srchYear)
      }else{
        this.$set(postParam, 'SRCH_YEAR', this.srchParam.srchYear)
        this.$set(postParam, 'SRCH_MONTH', this.srchParam.srchMonth)
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsUserMapper'
        }
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          Object.keys(item).some((key) => {
            if(key.includes("CNT")){
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          if(Number(item.USER_ID) === 999999999){
            this.totCntObject = item
          }else{
            this.itemsRowSpan.push(item)
          }
        })
      }
      this.isLoading = false;
    },
    setSrchParam(userId, colValue){

      this.$set(this.srchParam,'srchUserId', userId )
      this.$set(this.srchParam,'srchDeptId', this.selectedDeptItem.DEPT_ID )
      this.$set(this.srchParam,'srchTermType', this.modelPickerDate )
      if(this.modelPickerDate === 'Monthly'){
        this.$set(this.srchParam,'srchMonth', colValue.replaceAll('CNT_','') )
      }else{
        this.$set(this.srchParam,'srchDay', colValue.replaceAll('CNT_','') )
      }
      this.showDetail()
    },
    showDetail(){
      this.mixin_showDialog('Detail')
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    async selectedCustcoItem() {
      this.srchParam.srchCustcoId = ''
      this.srchParam.srchCustcoId = this.selectedCustcoItem.CUSTCO_ID
      this.common_recm_list = await this.mixin_common_code_get_global(this.list_common_code, 'RECM', this.selectedCustcoItem.CUSTCO_ID, '전체')
      this.srchParam.srchRecmCd = '';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>