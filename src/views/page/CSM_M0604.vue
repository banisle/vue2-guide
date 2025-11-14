<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                업로드일자
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                  :StartDayProp.sync="srchParam.srchStartDt"
                  :EndDayProp.sync="srchParam.srchEndDt"
                  @startDayChange="mixin_testLog(srchParam.srchStartDt)"
                  @endDayChange="mixin_testLog(srchParam.srchEndDt)"
                  ParentStyleProp="width: 306px"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                성공여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  placeholder="선택"
                  :items="statusList"
                  v-model="srchParam.srchStts"
                />
              </div>
            </div>

            <div>
              <v-btn class="pl-btn is-icon"
                     @click="getErrList(false)"
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
      <div class="pl-card-body fill-height">
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">관심지역 업로드 리스트</strong>
          </div>
          <div class="pl-grid-top-right ">

            <v-btn
                v-if="!btnToggle"
                @click="toggleCompo"
                class="pl-btn is-icon is-trans"
            >
              <span class="pl-icon20 upload-all"></span>
              일괄 업로드
            </v-btn>
            <span v-if="btnToggle"
                  class="pl-btn is-icon is-trans"
            >
              {{ progressMsg }}
            </span>
          </div>
        </div>
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="interestErrList"
          fixed-header
          item-key="ROW_NUMBER"
          height="180px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          :item-class="isActiveRow"
          @click:row="rowSelect"
          @dblclick:row="mixin_showDialog('LawInfo')"
          no-data-text="등록된 데이터가 없습니다."
          @page-count="pageCount = $event">
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
            보기 {{ mixin_getPagePeriod(interestErrList, page) }} / {{ totCnt }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp="nextDisabled"
              @btnClick="getErrList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
        <!-- 관심지역 업로드 상세 리스트 -->
        <div class="is-mt-m">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">관심지역 업로드 상세 리스트</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt2 }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid is-mt-s "
            :headers="headers2"
            :items="interestErrDtl"
            fixed-header
            item-key="ROW_NUMBER"
            height="330px"
            :items-per-page="ROW_PER_PAGE2"
            hide-default-footer
            :page.sync="page2"
            :loading="isLoadingErr"
            @dblclick:row="mixin_showDialog('LawInfo')"
            no-data-text="등록된 데이터가 없습니다."
            @page-count="pageCount2 = $event">
          </v-data-table>
          <div class="pl-pager">
            <div class="pl-pager-row"/>
          <v-pagination
              v-model="page2"
              :length="pageCount2"
              circle
              :total-visible="10">
          </v-pagination>
            <span class="pl-pager-period"/>
          </div>
        </div>
      </div>
    </div>
  <compo-excel-upload
      :ShowProp="dialogShowProp"
      :HeaderProp="excelHeader"
      :SampleProp="{FILE_NM : 'interestarea_upload_sample.xlsx', FILE_URL : '/web/excel/interestarea_upload_sample.xlsx'}"
      @closeCompo="toggleCompo"
      @upload="beforeUpload"
  >
  </compo-excel-upload>
  </div>
</template>

<script>
import compoExcelUpload from "@/components/CompoExcelUpload.vue";
export default {
  name: 'MENU_CSM_M0604', //관심지역 업로드 관리
  components: {
    compoExcelUpload
  },
  data() {
    return {
      dialogShowProp: false,

      statusList : [
        {text : '전체', value : ''},
        {text : '성공', value : 'Y'},
        {text : '실패', value : 'N'},
      ],
      // 조회용 파라미터
      srchParam : {
       srchStartDt : this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
       srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
       srchStts : '',
      },
      interestErrList : [],
      interestErrDtl : [],
      selectedRow : {},
      totCnt : 0,
      totCnt2 : 0,
      uploadData : {},

      isLoadingErr : false,
      // top grid
      page: 1,
      pageCount: 0,
      perPage: [5,20,50,100],
      ROW_PER_PAGE: 5,
      ROW_PER_PAGE2: 10,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '파일명', value: 'FILE_NM', align: '', width: '' , sortable: false},
        { text: '성공여부', value: 'ERRFG_NM', align: 'center', width: '12%' , sortable: false},
        { text: '실패 건', value: 'ERRKEY_CNT', align: 'center', width: '12%' , sortable: false},
        { text: '전체 건', value: 'ALL_CNT', align: 'center', width: '12%' , sortable: false},
        { text: '등록자', value: 'USER_NM', align: 'center', width: '12%' , sortable: false},
        { text: '등록일시', value: 'REG_DT', align: 'center', width: '12%' , sortable: false},
      ],
      // bottom grid
      page2: 1,
      pageCount2: 0,
      perPage2: [15,30,50,100],
      headers2: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable: false },
        { text: '성공여부', value: 'ERRFG_NM', align: 'center', width: '9%' , sortable: false},
        { text: '에러위치', value: 'ERRKEY', align: 'center', width: '9%' , sortable: false},
        { text: '시/도 오류', value: 'SIDO_ERR', align: 'center', width: '9%' , sortable: false},
        { text: '시/군/구 오류', value: 'SIGUNGU_ERR', align: 'center', width: '9%' , sortable: false},
        { text: '지구오류', value: 'JIGU_ERR', align: 'center', width: '9%' , sortable: false},
        { text: '유형오류', value: 'CSELTYPE_ERR', align: 'center', width: '9%' , sortable: false},
        { text: '전화번호오류', value: 'CELLPHONE_ERR', align: 'center', width: '9%' , sortable: false},
        { text: '지역매칭오류', value: 'AREA_ERR', align: 'center', width: '9%' , sortable: false},
        { text: '초과오류', value: 'OVER_REG', align: 'center', width: '9%' , sortable: false},
        { text: '중복오류', value: 'DUP_REG', align: 'center', width: '9%' , sortable: false},
        { text: '0건오류', value: 'ZERO_REG', align: 'center', width: '9%' , sortable: false},
      ],
      excelHeader :[
        { text: '전화번호', value: 'MOBILE', align: 'center', width: '20%' , sortable: false},
        { text: '상담유형', value: 'INTEREST_DIV_CD', align: 'center', width: '20%' , sortable: false},
        { text: '시/도', value: 'SIDO_ID', align: 'center', width: '20%' , sortable: false},
        { text: '시/군/구', value: 'SIGUNGU_ID', align: 'center', width: '20%' , sortable: false},
        // { text: '지구', value: 'JIGU_ID', align: 'center', width: '20%' , sortable: false},
      ],
      progressMsg : '',
      btnToggle : false,
    }
  },
  created() {
    this.getErrList(false);
    this.$eventBus.$on("UPLOAD_EXCEL", (msg)=>{
      if(msg.STATUS === 'END'){
        this.getErrList(false);
    //     this.showToastInfo({msg : msg.MSG})
    //     this.btnToggle = !this.btnToggle
    //   }else if(msg.STATUS === 'PRCS'){
    //       this.progressMsg = msg.MSG + `( 전체 ${this.mixin_convertNumToComma(msg.TOT_CNT)}건 중 ${this.mixin_convertNumToComma(msg.PRGS_CNT)}건 성공 / ${this.mixin_convertNumToComma(msg.ERR_CNT)}건 실패 )`
      }
    })
  },
  mounted() {
  },
  methods: {
    rowSelect(item) {
      // console.log(item);
      this.selectedRow = item;
      this.getErrDtl();
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    async getErrList(next){
      this.interestErrDtl = [];
      this.totCnt2 = 0;
      if( !next ){
        this.interestErrList = [];
        this.pagination.page = 1;
        this.nextDisabled = false;
      }
      let sUrl = '/api/biz/common/select/selectErrList'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','') +'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','') +'235959',
        SRCH_STTS : this.srchParam.srchStts,
      }
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.InterestAreaMngMapper',
          sn : 'selectErrList',
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }
      const response = await this.common_postCall(sUrl,postParam,headParam);
      if( !response.HEADER.ERROR_FLAG ){
        this.totCnt = response.HEADER.TOT_COUNT;
        response.DATA.map(item =>{
          this.interestErrList.push({
            ROW_NUMBER : item.ROW_NUMBER,
            ERRGRP_ID : item.ERRGRP_ID,
            FILE_NM : item.FILE_NM,
            ERRFG : item.ERRFG,
            ERRFG_NM : item.ERRFG_NM,
            ERRKEY_CNT : item.ERRKEY_CNT,
            ALL_CNT : item.ALL_CNT,
            REG_DT : this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm'),
            EMP_NO : item.EMP_NO,
            USER_NM : item.USER_NM,
          })
        })
      }
      if(response.HEADER.next !== null && response.HEADER.next !== undefined){
         console.log("response.HEADER.next", response.HEADER.next)
        if(response.HEADER.next === true){
          console.log("response. true")
          this.nextDisabled = false //버튼 활성화
        }else{
          console.log("response. false")
          this.nextDisabled = true  //버튼 비활성화
        }
      }
      //이부분은 체크해볼것
      this.pagination.page += 1
    },
    async getErrDtl(){
      this.isLoadingErr = true
      this.interestErrDtl = []
      let sUrl = '/api/biz/common/select/selectErrDtl'
      let postParam = {
        ERRGRP_ID : this.selectedRow.ERRGRP_ID,
      }
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.InterestAreaMngMapper',
          sn : 'selectErrDtl'
        }
      }
      const response = await this.common_postCall(sUrl,postParam,headParam);
      if( !response.HEADER.ERROR_FLAG ){
        this.totCnt2 = response.HEADER.TOT_COUNT;
        response.DATA.map(item =>{
          this.interestErrDtl.push({
            ROW_NUMBER : item.ROW_NUMBER,
            ERRGRP_ID : item.ERRGRP_ID,
            ERRKEY : item.ERRKEY+'행',
            FILE_NM : item.FILE_NM,
            SIDO_ERR : item.SIDO_ERR,
            SIGUNGU_ERR : item.SIGUNGU_ERR,
            JIGU_ERR : item.JIGU_ERR,
            CSELTYPE_ERR : item.CSELTYPE_ERR,
            CELLPHONE_ERR : item.CELLPHONE_ERR,
            AREA_ERR : item.AREA_ERR,
            OVER_REG : item.OVER_REG,
            DUP_REG : item.DUP_REG,
            ZERO_REG : item.ZERO_REG,
            ALL_CNT : item.ALL_CNT,
            ERRFG : item.ERRFG,
            ERRFG_NM : item.ERRFG_NM,
            REG_DT : item.REG_DT,
            EMP_NO : item.EMP_NO,
          })
        })
      }
      this.isLoadingErr = false
    },
    toggleCompo(){
      this.dialogShowProp = !this.dialogShowProp;
      this.uploadData={}
    },
    beforeUpload(item){
      this.uploadData = _.cloneDeep(item);

      this.showConfirmInfo({msg : '해당 엑셀 파일을 등록하시겠습니까?', callYes: ()=>{
          this.upload();
          this.closeAlert();
        },
        callNo: this.closeAlert
      })
    },
    async upload(){
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let sUrl = '/phone-api/cuttMng/interestArea/insertInterestAreaByExcel'
      let postParam = {
        interestAreaData : this.uploadData.DATA,
        FILE_NM : this.uploadData.FILE_NM
      }
      let headParam = {
        head : {
          DATA_OBJECT : 'interestAreaData'
        }
        , timeout : 3600000
      }
      const response = await this.common_postCall(sUrl,postParam,headParam)
      if(!response.HEADER.ERROR_FLAG){
        this.showAlertInfo({msg : '엑셀 업로드를 시작합니다.', callAfter : ()=>{
            this.closeAlert();
            this.uploadData = {}
            this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
          }})
      }else{
        this.showAlertCaution({msg : '처리중 문제가 발생했습니다.'})
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
      }
    },
  },
  computed: {
  },
  watch: {
  },
  beforeDestroy() {
    this.$eventBus.$off("UPLOAD_EXCEL");
  },
};
</script>

<style lang="scss" scoped>

</style>
