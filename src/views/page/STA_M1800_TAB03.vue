<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          상담일자
        </span>
        <div class="pl-desc">
          <div class="d-flex">
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
      </div>

      <div>
        <v-btn
            class="pl-btn is-icon"
            @click="srch"
        >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
            TitleProp="엑셀 다운로드"
            TypeProp="Download"
            :DataHeaderProp="headersExcel"
            :DataBodyProp="[...itemsDelay ,...itemsCompl ,...itemsCompn ,...itemsUnkind ,...itemsKind]"
            :FileNameProp="`지역본부별_VOC_상세_${srchParam.srchStartDt}~${srchParam.srchEndDt}`"
            SheetNameProp="지역본부별VOC상세"
            HeaderColorProp="00B0F0"
            :DisabledProp="mixin_isEmpty([...itemsDelay ,...itemsCompl ,...itemsCompn ,...itemsUnkind ,...itemsKind])"
        ></compo-excel>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body pl-scroll-body pb-6" style="height: calc(-241px + 100vh);">
      <!-- 검색 chk -->
      <div class="pl-rounded-box is-mt-s">
        <div class="px-5 py-3">
          <div class="pl-selection-row">
            <v-checkbox
                v-model="item.selected"
                v-for="(item, DRANK) in SPL_TP_CD_LIST"
                :key="item.vaule"
                :label="item.text"
                class="pl-check"
            ></v-checkbox>
          </div>
        </div>
      </div>


      <div class="spacing-wrap sp-24">
        <!-- 처리지연 -->
        <div>
          <!-- grid top -->
          <div class="pl-grid-top pt-2" style="height: 38px;">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">처리지연</strong>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s"
              :headers="headersRowSpan"
              :items="itemsDelay"
              :loading="isLoading"
              item-class="cellClass"
              fixed-header
              item-key="DRANK"
              height="180px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              @dblclick:row="showDetail()"
              :page.sync="page"
              @page-count="pageCount = $event">
          </v-data-table>
        </div>
        <!-- 처리불만 -->
        <div>
          <!-- grid top -->
          <div class="pl-grid-top pt-2" style="height: 38px;">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">처리불만</strong>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s"
              :headers="headersRowSpan"
              :items="itemsCompl"
              :loading="isLoading"
              item-class="cellClass"
              fixed-header
              item-key="DRANK"
              height="180px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              @dblclick:row="showDetail()"
              :page.sync="page"
              @page-count="pageCount = $event">
          </v-data-table>
        </div>
      </div>
      <div class="spacing-wrap sp-24">
        <!-- 피해보상 -->
        <div>
          <!-- grid top -->
          <div class="pl-grid-top pt-2" style="height: 38px;">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">피해보상</strong>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s"
              :headers="headersRowSpan"
              :items="itemsCompn"
              :loading="isLoading"
              item-class="cellClass"
              fixed-header
              item-key="DRANK"
              height="180px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              @dblclick:row="showDetail()"
              :page.sync="page"
              @page-count="pageCount = $event">
          </v-data-table>
        </div>
        <!-- 직원불친절 -->
        <div>
          <!-- grid top -->
          <div class="pl-grid-top pt-2" style="height: 38px;">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">직원불친절</strong>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s"
              :headers="headersRowSpan"
              :items="itemsUnkind"
              :loading="isLoading"
              item-class="cellClass"
              fixed-header
              item-key="DRANK"
              height="180px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              @dblclick:row="showDetail()"
              :page.sync="page"
              @page-count="pageCount = $event">
          </v-data-table>
        </div>
      </div>
      <div style="width: calc(50% - 12px);">
        <!-- 직원친절 -->
        <div>
          <!-- grid top -->
          <div class="pl-grid-top pt-2" style="height: 38px;">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">직원친절</strong>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s"
              :headers="headersRowSpan"
              :items="itemsKind"
              :loading="isLoading"
              item-class="cellClass"
              fixed-header
              item-key="DRANK"
              height="180px"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              @dblclick:row="showDetail()"
              :page.sync="page"
              @page-count="pageCount = $event">
          </v-data-table>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'STA_M1800_TAB03', //공급유형별TOP5
  components: {},
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      CHK_LIST: [
        {text: "공공분양", selected: false,},
        {text: "후분양", selected: false,},
        {text: "토지임데부분양", selected: false,},
        {text: "공공임대(5년)", selected: false,},
        {text: "공공임대(10년)", selected: false,},
        {text: "공공임대(50년)", selected: false,},
        {text: "공공임대(분납)", selected: false,},
        {text: "장기전세", selected: false,},
        {text: "국민임대", selected: false,},
        {text: "영구임대", selected: false,},
        {text: "기존주택매입임대", selected: false,},
        {text: "신축다세대매입임대", selected: false,},
        {text: "기존주택전세임대", selected: false,},
        {text: "분양용지", selected: false,},
        {text: "행복주택", selected: false,},
        {text: "임대용지(일반임대)", selected: false,},
        {text: "분양상가", selected: false,},
      ],
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        {text: '번호', value: 'DRANK', align: 'center', width: '50px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '15%', sortable: false},
        {text: '단지', value: 'MGOF_NM', align: '', width: '', sortable: false},
        {text: '공급유형', value: 'CD_NM', align: 'center', width: '15%', sortable: false},
        {text: '건수', value: 'CNT', align: 'center', width: '8%', sortable: false},
      ],
      headersExcel: [
        {text: '번호', value: 'DRANK', align: 'center', width: '50px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '400px', sortable: false},
        {text: '단지', value: 'MGOF_NM', align: 'left', width: '800px', sortable: false},
        {text: '공급유형', value: 'CD_NM', align: 'left', width: '200px', sortable: false},
        {text: '건수', value: 'CNT', align: 'center', width: '100px', sortable: false},
        {text: '구분', value: 'DTYPE', align: 'left', width: '100px', sortable: false},
      ],
      itemsDelay: [],
      itemsCompl: [],
      itemsCompn: [],
      itemsUnkind: [],
      itemsKind: [],

      srchParam: {
        srchStartDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttZone: [],
        srchCustcoId: '4',
        srchDeptId: '',
        srchCallTp: '',
        srchRcptChnCd: '',
      },
      selectedCustcoItem: {},
      selectedDeptItem: {},
      totCntObject: {},
      isLoading: false,
      SPL_TP_CD_LIST: [],
    }
  },
  async created() {
    this.SPL_TP_CD_LIST = await this.mixinAsGetCommonCode("SPL_TP_CD",[],'');
    this.SPL_TP_CD_LIST.map(item => {
      item.selected = false;
    })
    console.log(this.SPL_TP_CD_LIST)
  },
  mounted() {
  },
  methods: {
    srch(){
      let selectedCnt = 0
      this.SPL_TP_CD_LIST.map(item=>{
        console.log(item.selected)
        if(item.selected){
          return selectedCnt += 1
        }
      })
      console.log("selectedCnt", selectedCnt)
      if(selectedCnt < 1){
        this.showToastCaution({msg : '공급 유형을 한 개 이상 선택하세요.'})
      }else{
        this.getStatsVocSplTp()
      }
    },
    async getStatsVocSplTp() {
      this.isLoading = true
      this.itemsDelay = []
      this.itemsCompl = []
      this.itemsCompn = []
      this.itemsUnkind = []
      this.itemsKind = []

      let splList = []
      this.SPL_TP_CD_LIST.map(row => {
            if (row.selected === true) {
              splList.push({ SPL_TYPE : row.value})
            }
          })
      let sUrl = '/api/statistics/voc/selectVocSplTp'
      let postParam = {
        splTpList: splList,
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')
      }
      let headParam = {
        head: {
          DATA_OBJECT: "splTpList"
        },
        timeout : 300000
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item => {
          if(item.DTYPE === 'DELAY'){
            this.itemsDelay.push(item)
          }else if(item.DTYPE === 'COMPL'){
            this.itemsCompl.push(item)
          }else if(item.DTYPE === 'COMPN'){
            this.itemsCompn.push(item)
          }else if(item.DTYPE === 'UNKIND'){
            this.itemsUnkind.push(item)
          }else if(item.DTYPE === 'KIND'){
            this.itemsKind.push(item)
          }
        })
      }
      this.isLoading = false
    }
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>

</style>