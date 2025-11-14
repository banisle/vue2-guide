<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div class="pl-desc">
                <v-select
                    v-model="srchParam.selectedRange"
                    class="pl-form type-middle"
                    :items="rangeItems"
                />
              </div>
              <div class="pl-desc" v-if="srchParam.selectedRange ==='REG_DT'">
                <compo-date-range-picker
                    :StartDayProp.sync="srchParam.srchStartDt"
                    :EndDayProp.sync="srchParam.srchEndDt"
                    @startDayChange="mixin_testLog(srchParam.srchStartDt)"
                    @endDayChange="mixin_testLog(srchParam.srchEndDt)"
                    ParentStyleProp="width: 306px"
                />
              </div>
              <div class="pl-desc" v-if="srchParam.selectedRange ==='NOTICE_DT'">
                <compo-date-picker
                    DateType="dateInput"
                    v-model="srchParam.srchNoticeDt"
                    :DateProp.sync="srchParam.srchNoticeDt"/>
              </div>
            </div>

            <div class="pl-form-inline">
            <span class="pl-label">
              상담유형
            </span>
              <div class="pl-desc">
                <v-select
                    v-model="srchParam.srchDivCd"
                    :items="mixin_common_code_get(this.commonCode, 'CD', '전체')"
                    class="pl-form type-middle"
                    placeholder="전체"/>
              </div>
              <!--            <compo-cutt-type-combo-->
              <!--                :FormSeProp="'SRCH_DEPTH_1'"-->
              <!--                :DisabledProp="false"-->
              <!--                :HeadTextProp="['전체','전체','전체','전체']"-->
              <!--                @EMIT_CUTT_TYPE="setCuttType"-->
              <!--            />-->
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              담당본부
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    :items="mixin_common_code_get(this.commonCode, 'T304', '전체')"
                    v-model="srchParam.srchHeadCd"
                    placeholder="전체"/>
              </div>
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              자료분류
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle is-sm"
                    v-model="srchParam.srchDataCd"
                    :items="mixin_common_code_get(this.commonCode, 'T305', '전체')"
                    placeholder="전체"/>
              </div>
            </div>
            <!--          <div class="pl-form-inline">-->
            <!--            <span class="pl-label">-->
            <!--              공고일-->
            <!--            </span>-->
            <!--            <div class="pl-desc">-->
            <!--              <compo-date-picker-->
            <!--                DateType="dateInput"-->
            <!--                v-model="srchParam.srchNoticeDt"-->
            <!--                :DateProp.sync="srchParam.srchNoticeDt"/>-->
            <!--            </div>-->
            <!--          </div>-->
            <div class="pl-form-inline">
            <span class="pl-label">
              제목
            </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle"
                    v-model="srchParam.srchTtl"
                    style="width: 250px;"
                    placeholder=""/>
              </div>
            </div>
            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getCuttDataList(false)"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
              <compo-tooltip-btn
                  TitleProp="초기화"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
              ></compo-tooltip-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-trans" @click="showDetail('insert')">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans"
                   @click="beforeDel"
            >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ cuttDataList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="excelHeaders"
              :DataBodyProp="cuttDataList"
              :FileNameProp="'상담자료목록'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
              HeaderColorProp="00B0F0"
          ></compo-excel>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
            class="pl-grid is-mt-s has-control"
            :headers="headers"
            :items="cuttDataList"
            v-model="chkCuttDataList"
            show-select
            fixed-header
            item-key="ROW_NUMBER"
            height="calc(-306px + 100vh)"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
	    no-data-text="등록된 데이터가 없습니다."
            @click:row="rowClick"
            @dblclick:row="showDetail('update')"
            :page.sync="page"
            @page-count="pageCount = $event">
          <!-- 스크립트명 툴팁 -->
          <template v-slot:item.DATA_TTL="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
              <span
                  v-bind="attrs"
                  v-on="on">
              {{ item.DATA_TTL }}</span>
              </template>
              <span>{{ item.DATA_TTL }}</span>
            </v-tooltip>
          </template>

        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
                class="pl-form"
                :value="ROW_PER_PAGE"
                :items="perPage"
                :item-text="toString(ROW_PER_PAGE)"
                @change="ROW_PER_PAGE = parseInt($event, 10);"
            ></v-select>
          </div>
          <v-pagination
              v-model="page"
              :length="pageCount"
              circle
              :total-visible="7">
          </v-pagination>

          <!-- 더보기 다음 있을때만 노출 -->
          <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(cuttDataList, page) }} / {{ cuttDataList.length }}
          <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp="nextDisabled"
              @btnClick="getCuttDataList(true)"
          ></compo-tooltip-btn>
        </span>
        </div>
      </div>

    </div>
    <!-- side panel : detail -->
    <v-slide-x-reverse-transition>
      <div
          class="pl-quick-layer"
          style="width: 800px;"
          :style="tempCenterStyle"
          v-if=" dialogDetail === true ">
        <div class="pl-quick-layer-header"><h1>{{mixin_isEmpty(selectedRow.DATA_ID) ? '상담자료 등록' : '상담자료 상세'}} </h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeSlide(false)"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CSM_M1300_DETAIL
            ref="CSM_M1300_DETAIL"
            :DetailProp="selectedRow"
            :CmmnCdProp="commonCode"
            @Close="closeSlide(true)"
        />
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import CSM_M1300_DETAIL from './CSM_M1300_DETAIL'
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";

export default {
  name: "MENU_CSM_M1300", //상담자료 관리
  components: {
    CompoCuttTypeCombo,
    CSM_M1300_DETAIL
  },
  data() {
    return {
      dialogDetail: false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "REG_DT",
        descending: "DESC"
      },
      nextDisabled: false,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '제목', value: 'DATA_TTL', align: 'left', width: '', sortable: true},
        {text: '자료분류', value: 'CNSLT_DATA_NM', align: 'left', width: '10%', sortable: false},
        {text: '상담유형', value: 'DATA_DIV_CD_NM', align: 'left', width: '10%', sortable: false},
        {text: '담당본부', value: 'HEAD_NM', align: 'left', width: '10%', sortable: false},
        {text: '공고일', value: 'NOTICE_DT', align: 'center', width: '7%', sortable: false},
        {text: '사번', value: 'RGTR_ID', align: 'center', width: '5%', sortable: false},
        {text: '등록자', value: 'RGTR_NM', align: 'left', width: '5%', sortable: false},
        {text: '등록일', value: 'REG_DT', align: 'left', width: '9%', sortable: false},
      ],
      excelHeaders: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '제목', value: 'DATA_TTL', align: 'left', width: '200px', sortable: true},
        {text: '자료분류', value: 'CNSLT_DATA_NM', align: 'left', width: '100px', sortable: false},
        {text: '상담유형', value: 'DATA_DIV_CD_NM', align: 'left', width: '150px', sortable: false},
        {text: '담당본부', value: 'HEAD_NM', align: 'left', width: '150px', sortable: false},
        {text: '공고일', value: 'NOTICE_DT', align: 'center', width: '100px', sortable: false},
        {text: '전화번호', value: 'TEL', align: 'left', width: '100px', sortable: false},
        {text: '내용', value: 'PARSED_DATA_CNTNT', align: 'center', width: '400px', sortable: false},
        {text: '사번', value: 'RGTR_ID', align: 'center', width: '100px', sortable: false},
        {text: '등록자', value: 'RGTR_NM', align: 'left', width: '100px', sortable: false},
        {text: '등록일', value: 'REG_DT', align: 'left', width: '120px', sortable: false},
      ],

      cuttDataList: [],
      selectedRow: {},
      rangeItems: [
        {text: '등록일', value: 'REG_DT'},
        {text: '공고일', value: 'NOTICE_DT'}
      ],
      srchParam: {
        selectedRange: 'REG_DT',
        srchStartDt: this.$moment(new Date()).subtract(60, 'days').format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchDivCd: '',
        srchHeadCd: '',
        srchDataCd: '',
        srchNoticeDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchTtl: '',
      },
      saveParam: {},
      commonCode: [],
      chkCuttDataList: [],

    }
  },
  async created() {
    let codeName = ['T304', 'CD', 'T305'] // T304 - 지역본부 , CD - 상담유형 , T305 - 자료구분
    this.commonCode = await this.mixin_common_code_get_all(codeName);
  },
  mounted() {
    this.getCuttDataList(false);
  },
  methods: {
    showDetail(action) {
      if(action ==='insert'){
        this.selectedRow = {}
      }
      this.dialogDetail = true
    },
    rowClick(item) {
      this.selectedRow = item;
      // console.log("selected row TOOL_PROPS", this.selectedRow)
    },
    async getCuttDataList(next) {
      this.chkCuttDataList = []
      if ( !next ) {
        this.cuttDataList = [];
        this.pagination.page = 1
        this.nextDisabled = true;
      }
      // console.log("this.saveParam", this.saveParam)
      let postParam = {
        SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', '') + '000000'
        , SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', '') + '235959'
        , SRCH_DATA_DIV_CD: this.srchParam.srchDivCd
        , SRCH_HEAD_CD: this.srchParam.srchHeadCd
        , SRCH_CNSLT_DATA_CD: this.srchParam.srchDataCd
        , SRCH_NOTICE_DT: this.srchParam.srchNoticeDt.replaceAll('-', '')+ '000000'
        , SRCH_RANGE: this.srchParam.selectedRange
        , SRCH_TTL: this.srchParam.srchTtl
      }

      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.data.dao.PhoneCuttDataMngMapper'
          , sn: 'selectCuttDataList'
          ,ROW_CNT : this.pagination.rowsPerPage
          ,PAGES_CNT : this.pagination.page
          ,PAGING : "Y"
        }
      }

      const response = await this.common_postCall('/api/biz/common/select/selectCuttDataList', postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map((item) => {
              item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd')
              item.NOTICE_DT = this.mixin_convertDate(item.NOTICE_DT, 'yyyy-MM-dd')
              item.MDFCN_DT = this.mixin_convertDate(item.MDFCN_DT, 'yyyy-MM-dd')
              item.PARSED_DATA_CNTNT = this.restoreXSS(item.DATA_CNTNT)
          console.log("FILE_GROUP_KEY ", item.FILE_GROUP_KEY)
              this.cuttDataList.push(item)
            }
        )
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        this.pagination.page += 1;
      }
    },
    closeSlide(afterReg){
      this.$refs.CSM_M1300_DETAIL.chkFileUnsave();
      this.dialogDetail = false;
      this.selectedRow = {};
      if(afterReg){
        this.getCuttDataList(false)
      }
    },
    beforeDel(){
      let noMatchRgtr = 0;
      this.chkCuttDataList.map(item=>{
        // console.log(this.RGTR_ID);
        // console.log(this.user_id);
        if(item.RGTR_ID !== this.user_id) noMatchRgtr++
      })

      if(this.mixin_isEmpty(this.chkCuttDataList)){
        this.showToastCaution({msg : "삭제할 게시판을 선택하세요."})
      }else if( noMatchRgtr > 0 ) {
        this.showToastCaution({msg : "본인이 등록한 상담자료만 삭제할 수 있습니다."})
      }else{
        this.showConfirmCaution({
          msg : "선택한 상담자료는 영구 삭제됩니다. \n계속 하시겠습니까?"
          , callYes : ()=>{ this.deleteData() }
          , callNo : ()=>{ this.$store.commit("alertStore/hideAlert") }})
      }
    },
    async deleteData(){

      let sUrl = '/phone-api/cutt/mng/data/delete/deleteData'

      let postParam = {
        delDataList: this.chkCuttDataList.map(row=>{return {DATA_ID: row.DATA_ID}})
      }

      let headParam ={
        head: {
          DATA_OBJECT : "delDataList"
          , ns:'lhcs.phone.cuttMng.data.dao.PhoneCuttDataMngMapper'
          , sn : 'deleteData'
        }}

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg : '정상 처리되었습니다.', callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
            this.getCuttDataList(false);
          }})
      }else{
        this.showToastCaution({msg : response.HEADER.ERROR_MSG, callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
          }});
      }
    },


  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>

</style>
