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
                @startDayChange="dayChange('start')"
                @endDayChange="dayChange('end')"
                ParentStyleProp="width: 306px"
              />
            </div>
          </div>

          <div class="pl-form-inline">
            <span class="pl-label">
              유형
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                :items="mixin_common_code_get(common_code,'IAT', '전체')"
                v-model="srchParam.srchDivCd"
                placeholder="전체" />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              센터구분
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle"
                :items="cntrCdList"
                v-model="srchParam.srchCntrCd"
                placeholder="전체" />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              지역
            </span>
<!--            <div class="pl-desc">-->
<!--              <v-select-->
<!--                class="pl-form type-middle is-sm"-->
<!--                placeholder="전체" />-->
<!--              <v-select-->
<!--                class="pl-form type-middle is-sm"-->
<!--                placeholder="전체" />-->
<!--              <v-select-->
<!--                class="pl-form type-middle is-sm"-->
<!--                placeholder="전체" />-->
<!--            </div>-->
            <compo-cutt-zone-combo
                :FormSeProp="'SRCH'"
                :ClearProp="clearProp"
                @EMIT_CUTT_ZONE="setCuttZone"
            />
          </div>
          <div>
            <v-btn
              class="pl-btn is-icon"
              @click="getInterestArea(false)"
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <compo-tooltip-btn
              TitleProp="초기화"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="initSrch"
            ></compo-tooltip-btn>
          </div>

        </div>
      </template>
    </compo-sub-layout-top>
    <!-- sub content -->
    <div class="pl-card-body">
       <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <strong class="pl-bullet-txt is-blue">유형별 관심지역 등록 현황 </strong>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(totCnt) }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn "
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="downloadExcel"
          ></compo-tooltip-btn>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s has-control"
        :headers="headers"
        :items="interestAreaList"
        show-select
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(-306px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :loading="isLoading"
        @dblclick:row=""
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
      >
        <!-- 스크립트명 툴팁 -->
        <template v-slot:item.type01="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.type01 }}</span>
            </template>
            <span>{{ item.type01 }}</span>
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
          보기 {{ mixin_getPagePeriod(interestAreaList, page) }} / {{ mixin_convertNumToComma(interestAreaList.length) }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp="nextDisabled"
            @btnClick="getInterestArea(true)"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

   </div>
  </div>
</template>

<script>

import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CompoFindManager from "@/components/CompoFindManager.vue";

export default {
  name: "MENU_CSM_M0602", //관심지역 현황
  components: {
    CompoFindManager,
    CompoCuttZoneCombo
  },
  data() {
    return {

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'INTEREST_DIV_NM', align: 'left', width: '10%', sortable: true },
        { text: '시/도', value: 'SIDO_NM', align: 'left', width: '10%', sortable: false },
        { text: '시/군/구', value: 'SIGUNGU_NM', align: 'left', width: '12%', sortable: false },
        { text: '지구 명', value: 'JIGU_NM', align: 'left', width: '', sortable: false },
        { text: '고객ID', value: 'CUST_ID', align: 'left', width: '9%', sortable: false },
        { text: '핸드폰 번호', value: 'MOBILE', align: 'left', width: '8%', sortable: false },
        { text: '센터구분', value: 'CENTER_NM', align: 'left', width: '8%', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '6%', sortable: false },
        { text: '등록일', value: 'REG_DT', align: 'left', width: '7%', sortable: false },
        { text: '수정자', value: 'UPD_EMP_NM', align: 'left', width: '6%', sortable: false },
        { text: '수정일', value: 'UPD_DT', align: 'left', width: '7%', sortable: false },
      ],
      headersExcel: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'INTEREST_DIV_NM', align: 'left', width: '10%', sortable: true },
        { text: '시/도', value: 'SIDO_NM', align: 'left', width: '10%', sortable: false },
        { text: '시/군/구', value: 'SIGUNGU_NM', align: 'left', width: '12%', sortable: false },
        { text: '지구 명', value: 'JIGU_NM', align: 'left', width: '', sortable: false },
        { text: '고객ID', value: 'CUST_ID', align: 'left', width: '9%', sortable: false },
        { text: '핸드폰 번호', value: 'MOBILE', align: 'left', width: '8%', sortable: false },
        { text: '센터구분', value: 'CENTER_NM', align: 'left', width: '8%', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '6%', sortable: false },
        { text: '등록일', value: 'REG_DT', align: 'left', width: '7%', sortable: false },
        { text: '수정자', value: 'UPD_EMP_NM', align: 'left', width: '6%', sortable: false },
        { text: '수정일', value: 'UPD_DT', align: 'left', width: '7%', sortable: false },
      ],

      interestAreaList:[],
      totCnt : 0,
      isLoading : false,

      clearProp : false,

      common_code : [],
      cntrCdList : [
        { text : '전체' , value:'' },
        { text : '마이홈콜센터전체' , value:'7000'},
        { text : '종합상담' , value:'7111'},
        { text : '주거지원' , value:'7112'},
        { text : '주거급여' , value:'CT30'},
        { text : '주거급여시스템' , value:'CTexc'},
        { text : '지역본부대면상담' , value:'8000'},
        { text : '청약센터' , value:'CCT'},
        { text : '마이홈상담센터' , value:'DEP10'},
        { text : '공가해소상담센터' , value:'LS10'},
        { text : '전세임대상담센터' , value:'JSP10'},
        { text : '주택지원센터' , value:'HS10'},
        { text : 'IVR', value : 'IVR'},
        { text : '콜봇', value : 'CALLBOT'},
        { text : '기타' , value:'JSP10'},
      ],

      srchParam: {
        srchStartDt:  this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchDivCd: '',
        srchCntrCd: '',
        srchZone : new Array(3),
        srchAllZone: '',
      },
    }
  },
  async created() {
    let codeName = ['IAT']
    await this.getInterestArea(false);
    // this.cntrCdList = await this.mixin_getCenterCombo();
    this.common_code = await this.mixin_common_code_get_all(codeName);
  },
  mounted() {
  },
  methods: {
    dayChange(type){
        if( new Date(this.srchParam.srchStartDt) > new Date(this.srchParam.srchEndDt)){
          if(type ==='start') {
            this.showAlertCaution({msg : '시작일자는 종료일자 이후일 수 없습니다. '})
            this.srchParam.srchStartDt = this.srchParam.srchEndDt
          }else{
            this.showAlertCaution({msg : '종료일자는 시작일자 이전일 수 없습니다. '})
            this.srchParam.srchEndDt = this.srchParam.srchStartDt
          }
        }
    },
    setCuttZone(data){
      this.srchParam.srchZone = []
      this.srchParam.srchZone = data;
      console.log("this.srchParam.srchZone", this.srchParam.srchZone)
    },
    initSrch(){
      this.clearProp = !this.clearProp
      this.srchParam ={
        srchStartDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchDivCd: '',
        srchCntrCd: '',
        srchZone : [],
        srchAllZone: '',
      }
    },
    async getInterestArea( next ){
      this.isLoading = true;

      this.nextDisabled = true

      if( !next ){
        this.totCnt = 0;
        this.interestAreaList = [];
        this.pagination.page = 1;
        this.nextDisabled = false;
      }

      let sUrl = '/api/biz/common/select/selectInterestAreaState'

      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        SRCH_CENTER_CD : this.srchParam.srchCntrCd,
        SRCH_DIV_CD : this.srchParam.srchDivCd,
        SRCH_ZONE_1 : this.srchParam.srchZone[0],
        SRCH_ZONE_2 : this.srchParam.srchZone[1],
        SRCH_ZONE_3 : this.srchParam.srchZone[2],
      }

      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.dao.PhoneCuttZoneMngMapper',
          sn : 'selectInterestAreaState',
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT;
        console.log(response.HEADER)
        response.DATA.map(item => {
              item.MOBILE = this.mixin_setPhoneNo(item.MOBILE);
              item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd');
              item.UPD_DT = this.mixin_convertDate(item.UPD_DT, 'yyyy-MM-dd');
              item.DEL_DT = this.mixin_convertDate(item.DEL_DT, 'yyyy-MM-dd');
          this.interestAreaList.push(item)
        })

        if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
          if (response.HEADER.next) {
            this.nextDisabled = false //버튼 활성화
          } else {
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1;
        this.isLoading = false;
      }
    },
    async downloadExcel(){

      let sHeaderData = '';
      let makeHeader = []
      this.headersExcel.map((item)=>{
        let str = `${item.value}^${item.text}`
        makeHeader.push(str)
      })
      sHeaderData = makeHeader.join(',');

      let sURL = '/api/biz/common/cmmExcelDwnld';
      let postParams = {

        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        SRCH_CENTER_CD : this.srchParam.srchCntrCd,
        SRCH_DIV_CD : this.srchParam.srchDivCd,
        SRCH_ZONE_1 : this.srchParam.srchZone[0] ? this.srchParam.srchZone[0] : '',
        SRCH_ZONE_2 : this.srchParam.srchZone[1] ? this.srchParam.srchZone[1] : '',
        SRCH_ZONE_3 : this.srchParam.srchZone[2] ? this.srchParam.srchZone[2] : '',

        sFileName: '관심지역_현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss'),
        sTitleName: '관심지역현황',
        iExcelLimitRowCnt: 100000,
        serviceNm: 'kr.co.hkcloud.lhcs.phone.cuttMng.dao.PhoneCuttZoneMngMapper',
        sqlId: 'selectInterestAreaState',
        sHeaderData: sHeaderData,
      };
      let headParams = {
        head: '',
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      this.requestServerExcelDownloadApi({
        url: sURL, // required
        headers: {
          // required
          Authorization: "",
        },
        callback: (data) => {
          this.$store.commit("alertStore/hideAlert");
        },
        data: postParams,
      }, '관심지역_현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss'));

    }
  },
  computed: {
  },
  watch: {

  },
};
</script>

<style lang="scss" scoped>

</style>

