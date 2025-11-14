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
                :StartDayProp.sync="searchParams.START_DT"
                :EndDayProp.sync="searchParams.END_DT"
                ParentStyleProp="width: 306px"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              센터구분
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  return-object
                  placeholder="전체"
                  :items="DROP_CENTER_LIST"
                  v-model="searchParams.CENTER"
                  :disabled="isDisable"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              민원대상
            </span>
            <div class="pl-desc">
              <v-select
                :items="DROP_VOC_CALL_TP"
                v-model="searchParams.CVLCPT_TRGT_CD"
                class="pl-form type-middle is-sm"
                placeholder="전체"
                @change="changeCvlcptTrgtCd"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              민원분류
            </span>
            <div class="pl-desc">
              <v-select
                :items="DROP_VOC_CALL"
                v-model="searchParams.CVLCPT_CLSF_CD"
                class="pl-form type-middle"
                placeholder="전체"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline" v-if="!isAdmin">
            <span class="pl-label">
              상태
            </span>
            <div class="pl-desc">
              <v-select
                :items="DROP_VOC_CALL_STAT"
                v-model="searchParams.PRGRS_STTS_CD"
                class="pl-form type-middle is-sm"
                placeholder="전체"
              ></v-select>
            </div>
          </div>

          <div>
            <v-btn
              class="pl-btn is-icon"
              @click="clickSearchBtn"
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <compo-tooltip-btn
              TitleProp="초기화"
              ClassProp="pl-tooltip-btn ml-2"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="clearSearchParams"
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
          <v-btn class="pl-btn is-icon is-trans" @click="clickRegBtn">
            <span class="pl-icon20 circle-plus"></span>
            등록
          </v-btn>
          <v-btn class="pl-btn is-icon is-trans"
            @click="clickDeleteBtn">
            <span class="pl-icon20 trash"></span>
             삭제
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="headers"
            :DataBodyProp="items"
            FileNameProp="종합민원 이송 현황"
            SheetNameProp="종합민원 이송 현황"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s has-control is-hover"
        :headers="headers"
        :items="items"
        v-model="checkedList"
        show-select
        fixed-header
        item-key="ROW_NUM"
        height="calc(-306px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        @dblclick:row="openPhnCvlcptPopup"
        :loading="loading"
        :page.sync="page"
        @page-count="pageCount = $event"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
        <!-- 유형 뱃지 -->
        <template v-slot:item.PRGRS_STTS_CD_NM="{ item }">
          <span
            :class="`pl-badge is-${mixin_displayStatus(item.PRGRS_STTS_CD, 'STAT_LIST')}`"
            style="width: 50px;"
            >
          {{ item.PRGRS_STTS_CD_NM }}</span>
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
          보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="selectPhnCvlcptList(true)"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

   </div>
 </div>
</template>

<script>
export default {
  name: 'MENU_CSM_M1600', //민원 이송 현황
  components: {
  },
  data() {
    return {
      list_common_code:[],  // 공통코드
      DROP_VOC_CALL_TP:[],  // 민원대상
      DROP_VOC_CALL:[{text:"전체", value:""}],     // 민원분류
      DROP_VOC_CALL_STAT:[],
      VOC_CALL_LIST:{       
        VOC_CALL_01: []
        , VOC_CALL_02: []
        , VOC_CALL_03: []
        , VOC_CALL_04: []
        , VOC_CALL_99: []
      },
      common_ognz_list:[],
      DROP_CENTER_LIST:[],

      // 조회 조건
      searchParams:{
        START_DT: this.$moment().format("YYYY-MM-DD")
        , END_DT: this.$moment().format("YYYY-MM-DD")
        , CENTER: {}
        , CVLCPT_TRGT_CD: ""
        , CVLCPT_CLSF_CD: ""
        , PRGRS_STTS_CD: ""
      },

      isDisable: false,
      isAdmin: false,

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
      nextDisabled : true,
      loading : false,

      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '접수일시', value: 'REG_DT', align: 'center', width: '150px', sortable: true },
        { text: '센터', value: 'REG_CUSTCO_NM', align: 'left', width: '150px', sortable: false },
        { text: '접수자', value: 'RGTR_NM', align: 'left', width: '6%', sortable: false },
        { text: '민원인', value: 'CUST_NM', align: 'left ', width: '6%', sortable: false },
        { text: '민원대상', value: 'CVLCPT_TRGT_CD_NM', align: 'left', width: '6%', sortable: false },
        { text: '민원분류', value: 'CVLCPT_CLSF_CD_NM', align: 'left', width: '8%', sortable: false },
        { text: '민원 제목', value: 'CVLCPT_TTL', align: 'left ', width: '', sortable: false },
        { text: '상태', value: 'PRGRS_STTS_CD_NM', align: 'center', width: '80px', sortable: false },
        { text: '승인일', value: 'LAST_PRCS_DT', align: 'center', width: '7%', sortable: false },
        { text: '승인자', value: 'LAST_PRCR_NM', align: 'left', width: '6%', sortable: false },
      ],
      items: [],

      checkedList:[],

      // 상태 컬러
      STAT_LIST: [
        { code: '01', value: 'blue'},
        { code: '02', value: 'red'},
        { code: '03', value: 'green'},
      ],
    }
  },
  methods: {

    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.START_DT) || this.mixin_isEmpty(this.searchParams.END_DT)){
        this.showAlertInfo({msg: "조회 기간을 입력해주세요."});
        return;
      }

      this.selectPhnCvlcptList(false);
    },

    async selectPhnCvlcptList(next){
      //다음버튼 클릭 유무
      if (!next){
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
        this.checkedList = [];
      }

      let postParam = {
        START_DT : this.searchParams.START_DT.replace(/[^0-9]/g, '')
        , END_DT : this.searchParams.END_DT.replace(/[^0-9]/g, '')
        , SRCH_CUSTCO_ID: this.searchParams.CENTER.CUSTCO_ID
        , CVLCPT_TRGT_CD: this.searchParams.CVLCPT_TRGT_CD
        , CVLCPT_CLSF_CD: this.searchParams.CVLCPT_CLSF_CD
        , PRGRS_STTS_CD: this.searchParams.PRGRS_STTS_CD
      };

      let headParam = {
        head: {
          ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : 'Y'
          , ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
        }
      };

      this.loading = true;
      const response = await this.common_postCall("/api/biz/common/select/selectPhnCvlcptList", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        let tempDataText = response.DATA.map(row=>{
          return row;
        });
        this.items = [...this.items, ...tempDataText];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;

        this.pagination.page += 1;
      }

      this.loading = false;
    },
    
    // 민원 대상 변경 시 호출
    changeCvlcptTrgtCd(){
      this.searchParams.CVLCPT_CLSF_CD = "";
      if(this.mixin_isEmpty(this.searchParams.CVLCPT_TRGT_CD)) this.DROP_VOC_CALL = [{text:"선택", value:""}];
      else this.DROP_VOC_CALL = [...this.VOC_CALL_LIST[this.searchParams.CVLCPT_TRGT_CD]];
    },
    
    // 조회조건 초기화
    clearSearchParams(){
      this.searchParams = {
        START_DT: this.$moment().format("YYYY-MM-DD")
        , END_DT: this.$moment().format("YYYY-MM-DD")
        , CENTER: {}
        , CVLCPT_TRGT_CD: ""
        , CVLCPT_CLSF_CD: ""
        , PRGRS_STTS_CD: ""
      };

      if( this.computedUserType === 'LEADER' ) {
        let centerObj = this.DROP_CENTER_LIST.filter(row=>{return row.CUSTCO_ID == this.computedUserCenter});
        if(centerObj.length > 0){
          this.searchParams.CENTER = centerObj[0];
        }else{
          this.searchParams.CENTER.CUSTCO_ID = this.computedUserCenter;
          this.searchParams.CENTER.DEPT_ID = this.computedUserCenterDeptId;
        }
      } else if(this.computedUserType === 'ETC_ADMIN') {
        this.searchParams.CENTER = "";
        this.searchParams.PRGRS_STTS_CD = "02";
      }
    },

    // 삭제 버튼 클릭
    clickDeleteBtn(){
      if(this.checkedList.length <= 0){
        this.showAlertInfo({msg:"삭제할 민원을 선택해주세요."});
        return;
      }


      for(let i=0; i<this.checkedList.length; i++){
        if(!this.mixin_isEmpty(this.checkedList[i].CVLCPT_CLSF_CD) && this.isAdmin){
          this.showAlertInfo({msg:"민원분류가 입력된 건은 삭제할 수 없습니다."});
          return false;
        }

        for(let i=0; i<this.checkedList.length; i++){
          if(this.checkedList[i].PRGRS_STTS_CD == "02" && !this.isAdmin){
            this.showAlertInfo({msg:"승인 상태인 민원은 삭제할 수 없습니다."});
            return false;
          }
        }
      }

      this.showConfirmCaution({
        msg:'선택한 민원은 영구 삭제됩니다. \n정말 삭제하시겠습니까?'
        , callYes: () => {
          this.deletePhnCvlcpt();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    async deletePhnCvlcpt(){
      let sUrl = '/phone-api/cvlcpt/deletePhnCvlcpt';
      // let sUrl = '/api/biz/common/delete/deletePhnCvlcpt';

      let postParam = {
        DEL_LIST: this.checkedList.map(row=>{return row.PHN_CVLCPT_ID}).join(",")
      };

      let headParam = { head: {
        DATA_OBJECT:"DEL_LIST"
      } };

      let response = await this.common_postCall(sUrl, postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        this.showToastSuccess({msg:"삭제되었습니다."});
        this.clickSearchBtn();
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 종합민원 이송 팝업 호출
    openPhnCvlcptPopup(e, {item}){
      this.mixin_openWindow('LayoutPopup', '850', '815', {compo_name: 'CSM_M1600_POP', title: '종합민원 이송 접수', popData:{PHN_CVLCPT_ID: item.PHN_CVLCPT_ID}, callback : 'savePhnCvlcptCallBack'});
    },

    // 종합민원 이송 접수 콜백함수
    savePhnCvlcptCallBack(data){
      this.clickSearchBtn();
    },

    // 등록 버튼
    clickRegBtn(){
      this.mixin_openWindow('LayoutPopup', '850', '815', {compo_name: 'CSM_M1600_POP', title: '종합민원 이송 접수', popData:{PHN_CVLCPT_ID: ""}, callback : 'clickSearchBtn'});
    },
  },
  async mounted() {
    // 공통코드
    let codeName = ["VOC_CALL_TP", "VOC_CALL_01", "VOC_CALL_02", "VOC_CALL_03", "VOC_CALL_04", "VOC_CALL_99", "VOC_CALL_STAT"];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);
    this.DROP_VOC_CALL_TP = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_TP', '전체');
    this.DROP_VOC_CALL_STAT = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_STAT', '전체');
    this.VOC_CALL_LIST.VOC_CALL_01 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_01', '전체');
    this.VOC_CALL_LIST.VOC_CALL_02 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_02', '전체');
    this.VOC_CALL_LIST.VOC_CALL_03 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_03', '전체');
    this.VOC_CALL_LIST.VOC_CALL_04 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_04', '전체');
    this.VOC_CALL_LIST.VOC_CALL_99 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_99', '전체');

    this.common_ognz_list = await this.mixin_ognz_list();
    this.DROP_CENTER_LIST = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '전체' );

    if( this.computedUserType === 'LEADER' ) {
      let centerObj = this.DROP_CENTER_LIST.filter(row=>{return row.CUSTCO_ID == this.computedUserCenter});
      if(centerObj.length > 0){
        this.searchParams.CENTER = centerObj[0];
      }else{
        this.searchParams.CENTER.CUSTCO_ID = this.computedUserCenter;
        this.searchParams.CENTER.DEPT_ID = this.computedUserCenterDeptId;
      }
      this.isDisable = true;
    } else if(this.computedUserType === 'ETC_ADMIN') {
      this.searchParams.CENTER = "";
      this.searchParams.PRGRS_STTS_CD = "02";
      this.isAdmin = true;
    }

    this.clickSearchBtn();
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