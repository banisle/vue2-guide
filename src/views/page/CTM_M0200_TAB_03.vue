<template>
  <div class="fill-height">
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회 기간
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
            :StartDayProp.sync="SCH_ST_DTS"
            :EndDayProp.sync="SCH_END_DTS"
            @startDayChange="mixin_testLog(SCH_ST_DTS)"
            @endDayChange="mixin_testLog(SCH_END_DTS)"
            ParentStyleProp="width: 306px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터
        </span>
        <div class="pl-desc">
          <v-select
            v-model="SCH_DEPT_ID1"
            return-object
            class="pl-form type-middle"
            :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '전체' )"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          차단유형
        </span>
        <div class="pl-desc">
          <v-select
            v-model="WARN_TYPE_CD"
            class="pl-form type-middle"
            :items="mixin_common_code_get(list_common_code, 'VOC_CUTTP', '전체')"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          차단상태
        </span>
        <div class="pl-desc">
          <v-select
            v-model="STTS_CD"
            class="pl-form type-middle"
            :items="STTS_CD_LIST"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          차단 전화번호
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="SCH_CUST_PHN_NO"
            class="pl-form type-middle"
            maxlength="14"
            hide-spin-buttons
            type="text"
            @keyup="setPhoneNo()"
            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            @keyup.enter="getCustCautionList('')"
            />
        </div>
      </div>
      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="getCustCautionList('')"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="srchReset('')"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top fill-height">
      <div class="pl-cols fill-height">
        <div class="is-vrt pl-card-body fill-height" >
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <div class="spacing-wrap sp-8">
                <div>
                  <span class="pl-bullet-txt is-green">임시차단</span>
                  <strong >({{ TEMP_CUTOFF_CNT }})</strong>
                </div>
                <div>
                  <span class="pl-bullet-txt is-blue">정식차단</span>
                  <strong >({{ CUTOFF_CNT }})</strong>
                </div>
                <div>
                  <span class="pl-bullet-txt is-red">기간만료</span>
                  <strong >({{ EXPD_CNT }})</strong>
                </div>
              </div>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
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
            class="pl-grid is-mt-s "
            :headers="headers"
            :items="items"
            fixed-header
            item-key="RNUM"
            height="calc(-360px + 100vh)"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            no-data-text="등록된 데이터가 없습니다."
            :item-class="isActiveRow"
            @click:row="rowClick"
            @dblclick:row="showDetail()"
            :page.sync="page"
            @page-count="pageCount = $event"
            :loading="loading"
            loading-text="조회중입니다."
          >
            <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
              <template v-if="header.telYn">
                <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
              </template>
              <template v-else>
                <template v-if="header.value === 'REG_DT'">
                  {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
                </template>
                <template v-else-if="header.value === 'CUTOFF_BGNG_DT' || header.value === 'CUTOFF_END_DT' || header.value === 'CUTOFF_EXPD_DT'">
                  {{ item[header.value] ? mixin_convertDate(item[header.value], 'yyyy-MM-dd') : '-' }}
                </template>
                <template v-else-if="header.value === 'CUSL_RST_YN'">
                  {{ item[header.value] === 'Y' ? '○' : '' }}
                </template>
                <template v-else-if="header.value === 'CUSL_PCLG_CUTT_YN'">
                  {{ item[header.value] === 'Y' ? '○' : '' }}
                </template>
                <template v-else-if="header.value === 'CUSL_RST_HR'">
                  {{ item[header.value] + (item[header.value] ? ' 분' : '') }}
                </template>
                <template v-else-if="header.value === 'CAUTION_CUST_STTS_NM'">
                  <span
                    :class="`pl-badge is-${mixin_displayStatus(item[header.value], 'STAT_LIST')}`"
                    style="width: 75px;"
                    >
                  {{ item[header.value] }}</span>
                </template>
                <template v-else>{{ item[header.value] }}</template>
              </template>
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
                @btnClick="getCustCautionList('next')"
              ></compo-tooltip-btn>
            </span>
          </div>
        </div>
        <!-- 인입일시 grid -->
        <div class="pl-card-body is-col-fix " style="width: 270px">
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">{{ selectedItem.CUST_PHN_NO ? mixin_setPhoneNo(selectedItem.CUST_PHN_NO.replace(/[^0-9]/g, '')) : '-' }}</strong>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
            class="pl-grid is-mt-s "
            :headers="headers2"
            :items="items2"
            fixed-header
            item-key="RNUM"
            height="calc(-316px + 100vh)"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
	          no-data-text="등록된 데이터가 없습니다."
            :page.sync="page"
            @page-count="pageCount = $event"
          >
            <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers2">
              <template v-if="header.value === 'DRWI_DT'">
                {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
              </template>
              <template v-else>{{ item[header.value] }}</template>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'CTM_M0200_TAB_03', //배려고객 인입 현황
  components: {
  },
  data() {
    return {
      common_ognz_list:[], //조직정보
      list_common_code : [],

      // search
      SCH_DEPT_ID1 : {CUSTCO_ID:''}, //센터
      SCH_ST_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //접수 시작 일자
      SCH_END_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //접수 종료 일자
      WARN_TYPE_CD : '', //차단유형
      STTS_CD : '', //처리결과
      SCH_CUST_PHN_NO : '', //고객 연락처

      STTS_CD_LIST : [], //요청 구분 목록
      SCH_STTS_CD : [],

      // grid
      loading:false,
      loading2:false,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,
      headers: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        { text: '센터', value: 'CUSTCO_NM', align: 'left', width: '', sortable: true },
        { text: '차단 전화번호', value: 'CUST_PHN_NO', align: 'center', width: '13%', sortable: false, telYn: true },
        { text: '상담번호', value: 'RE_PHN_CUTT_ID', align: 'left', width: '8%', sortable: false },
        { text: '차단 유형', value: 'WARN_TYPE_NM', align: 'left', width: '12%', sortable: false },
        { text: '상태', value: 'CAUTION_CUST_STTS_NM', align: 'center', width: '9%',sortable: false },
        { text: '차단 시작일', value: 'CUTOFF_BGNG_DT', align: 'center', width: '9%', sortable: false },
        { text: '차단 종료일', value: 'CUTOFF_END_DT', align: 'center', width: '9%', sortable: false },
        { text: '차단기간', value: 'IVR_CUTOFF_PERIOD_CD', align: 'center', width: '9%', sortable: false },
        { text: '차단 해제일', value: 'CUTOFF_EXPD_DT', align: 'center', width: '9%', sortable: false },
        { text: '차단기간 인입 회수', value: 'CUTOFF_PERIOD_IN_CALL_CNT', align: 'center', width: '9%', sortable: false },
      ],
      items: [],

      selectedItem : {},

      headers2: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        { text: '인입일시', value: 'DRWI_DT', align: 'center', width: '', sortable: true },
      ],
      items2: [],

      STAT_LIST: [
        { code: '임시차단', value: 'green'},
        { code: '정식차단', value: 'blue'},
        { code: '철회', value: 'red'},
        { code: '철회반려', value: 'org'},
      ],

      TEMP_CUTOFF_CNT : 0, //임시차단
      CUTOFF_CNT : 0, //정식차단
      WITHDRAWAL_CNT : 0, //철회
      RETURN_CNT : 0, //반려
      EXPD_CNT : 0, //임시차단 카운트
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("getCustCautionList3"); //eventBus 중복방지를 위해 off
  },
  async created() {
    //공통코드설정
    let codeName = ['VOC_REQ', 'VOC_CUTTP']; //요청 구분
    this.list_common_code = await this.mixin_common_code_get_all(codeName);
    this.common_ognz_list =  await this.mixin_ognz_list();

    this.STTS_CD_LIST = [{text:'전체', value:''}];
    this.mixin_common_code_get(this.list_common_code, 'VOC_REQ', '').forEach((item, idx) => {
      if(idx !== 1 && idx !== 2) this.STTS_CD_LIST.push(item);
    });

    this.$eventBus.$on("getCustCautionList3", () => {
      this.getCustCautionList(); //배려고객 목록
    });

    this.getCustCautionList(''); //배려고객 차단 목록
  },
  methods: {
    //배려고객 목록
    async getCustCautionList(next) {
      let postParam = {
        SCH_ST_DTS : this.SCH_ST_DTS.replace(/[^0-9]/g, '') //검색 시작 일자
        , SCH_END_DTS : this.SCH_END_DTS.replace(/[^0-9]/g, '') //검색 종료 일자
        , SCH_CUSTCO_ID : this.SCH_DEPT_ID1.CUSTCO_ID
        , USER_DTL_TYPE : this.computedUserDetailType
        , WARN_TYPE_CD : this.WARN_TYPE_CD
        , CUSL_NM : this.SCH_CUSL_NM
        , CUST_PHN_NO : this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, '')
      };

      this.SCH_STTS_CD = [];
      if(this.mixin_isEmpty(this.STTS_CD)){
        this.STTS_CD_LIST.forEach((item, idx) => {
          if(item.value){
            this.SCH_STTS_CD.push({STTS_CD : item.value});
            if(item.value === 'REQ01') this.SCH_STTS_CD.push({STTS_CD : 'REQ08'});
          }
        });
      }else{
        this.SCH_STTS_CD.push({STTS_CD : this.STTS_CD});
        if(this.STTS_CD === 'REQ01') this.SCH_STTS_CD.push({STTS_CD : 'REQ08'});
      }

      postParam.SCH_STTS_CD = JSON.stringify(this.SCH_STTS_CD);

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.pagination.page = 1; //페이징 처리 초기화
        this.items = [];
        this.nextDisabled = true;  //버튼 비활성화
      }

      let headParam = {
        head: {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : 'Y',
        }
      };

      this.loading = true;
      const response = await this.common_postCall("/api/cust/custCautionList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        response.DATA.forEach((item, idx) => {
          item.RE_PHN_CUTT_ID = (item.PHN_CUTT_ID === '-1' ? '-': item.PHN_CUTT_ID);
        });

        let tempDataText = response.DATA;
        this.items = [...this.items, ...tempDataText];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;
        else this.gridTotalCnt = 0;

        this.pagination.page += 1;

        // this.TEMP_CUTOFF_CNT = 0; //임시차단
        // this.CUTOFF_CNT = 0; //정식차단
        // this.EXPD_CNT = 0; //기간만료
        // this.items.forEach((data, seq) => {
        //   if(data.CAUTION_CUST_STTS_CD === 'REQ01') this.TEMP_CUTOFF_CNT++;
        //   else if(data.CAUTION_CUST_STTS_CD === 'REQ04') this.CUTOFF_CNT++;
        //   else if(data.CAUTION_CUST_STTS_CD === 'REQ07') this.EXPD_CNT++;
        // });

        this.TEMP_CUTOFF_CNT = response.LABEL_INFO[0].CNT; //임시차단
        this.CUTOFF_CNT = response.LABEL_INFO[3].CNT; //정식차단
        this.EXPD_CNT = response.LABEL_INFO[6].CNT; //기간만료
      }

      this.loading = false;
    },

    //배려고객 차단기간 인입 이력
    async getCutOffInCallHstyList() {
      this.items2 = [];
      let postParam = {
        CUST_PHN_NO : this.selectedItem.CUST_PHN_NO.replace(/[^0-9]/g, '')
        , CUTOFF_BGNG_DT : this.selectedItem.CUTOFF_BGNG_DT + '000000'
        , CUTOFF_END_DT : this.selectedItem.CUTOFF_END_DT + '235959'
      };

      let headParam = {
        head: {
          ns : 'lhcs.cust.dao.CustMapper'
        }
      };

      this.loading2 = true;
      const response = await this.common_postCall("/api/biz/common/select/custCautionInCallHstryList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.items2 = response.DATA;
      }

      this.loading2 = false;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedItem ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.selectedItem = item;
      this.getCutOffInCallHstyList(); //배려고객 차단기간 인입 이력
    },
    showDetail(){
      this.slideDetail = true
    },
    closeSlide(){
      this.slideDetail = false
    },

    //새로고침
    srchReset(){
      this.SCH_DEPT_ID1 = {CUSTCO_ID:''}; //센터
      this.SCH_ST_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //접수 시작 일자
      this.SCH_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10); //접수 종료 일자
      this.WARN_TYPE_CD = '', //차단유형
      this.STTS_CD = '', //처리결과
      this.SCH_CUST_PHN_NO = '', //고객 연락처

      this.getCustCautionList(''); //배려고객 차단 목록
    },

    //전화번호 하이픈 추가
    setPhoneNo(){
      let res = this.mixin_setPhoneNo(this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, ""));
      this.SCH_CUST_PHN_NO = res;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>