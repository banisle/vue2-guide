<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          평가 연도
        </span>
        <div class="pl-desc">
          <v-select
            :items="DROP_YEAR"
            v-model="searchParams.STD_YEAR"
            class="pl-form type-middle is-sm"
            placeholder="선택"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.CENTER"
            :items="DROP_CENTER_LIST"
            class="pl-form type-middle"
            placeholder="선택"
            return-object
            @change="changeCenter"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          소속
        </span>
        <div class="pl-desc">
          <v-select
            multiple
            :items="DROP_DEPT_LIST"
            v-model="searchParams.DEPT_ID"
            class="pl-form type-middle"
            placeholder="전체"
            @change="changeDept"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상담사
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle is-sm"
            v-model="searchParams.TGT_EMP_NM"
            @keyup.enter="clickSearchBtn"
            placeholder="" />
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
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">월별 현황(환산점수)</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaResultMonthList.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="gridHeaders"
            :DataBodyProp="qaResultMonthList"
            :FileNameProp="fileName"
            SheetNameProp="QA월별현황"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover"
        :headers="gridHeaders"
        :items="qaResultMonthList"
        fixed-header
        item-key="ROW_NUM"
        height="calc(-360px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event"
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
        <!-- 대상자 -->
        <template v-slot:item.TGT_EMP_NM="{ item }">
          <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
        </template>
      </v-data-table>
      <div class="pl-pager">
        <div class="pl-pager-row">
          <span>페이지당 항목 수</span>
          <v-select
            class="pl-form"
            v-model="ROW_PER_PAGE"
            :items="perPage"
            :item-text="toString(ROW_PER_PAGE)"
            @change="ROW_PER_PAGE = parseInt(ROW_PER_PAGE);"
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
          보기 {{ mixin_getPagePeriod(qaResultMonthList, page) }} / {{ qaResultMonthList.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp ="nextDisabled"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'QAM_M0700_TAB_02', //월별현황
  components: {
  },
  data() {
    return {

      common_ognz_list:[],
      DROP_CENTER_LIST:[],
      DROP_DEPT_LIST:[],
      DROP_YEAR:[],

      searchParams:{
        CENTER:{}
        , DEPT_ID:[]
        , STD_YEAR: this.$moment().format("YYYY")
        , TGT_EMP_NM:""
      },

      // 소속 전체 체크 여부
      isAllCheck:false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      nextDisabled: true,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: "",
      },

      loading: false,

      gridHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: '', width: '9%',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '9%',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: '', width: '7%', sortable: true },
        { text: '사번', value: 'TGT_EMP_NO', align: 'center', width: '7%', sortable: true },
        { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '7%', sortable: true },
        { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '6%', sortable: true },
        { text: '1월', value: 'M_01', align: 'center', width: '', sortable: true },
        { text: '2월', value: 'M_02', align: 'center', width: '', sortable: true },
        { text: '3월', value: 'M_03', align: 'center', width: '', sortable: true },
        { text: '4월', value: 'M_04', align: 'center', width: '', sortable: true },
        { text: '5월', value: 'M_05', align: 'center', width: '', sortable: true },
        { text: '6월', value: 'M_06', align: 'center', width: '', sortable: true },
        { text: '7월', value: 'M_07', align: 'center', width: '', sortable: true },
        { text: '8월', value: 'M_08', align: 'center', width: '', sortable: true },
        { text: '9월', value: 'M_09', align: 'center', width: '', sortable: true },
        { text: '10월', value: 'M_10', align: 'center', width: '', sortable: true },
        { text: '11월', value: 'M_11', align: 'center', width: '', sortable: true },
        { text: '12월', value: 'M_12', align: 'center', width: '', sortable: true },
        { text: '평균', value: 'AVG_SCORE', align: 'center', width: '', sortable: true },
      ],

      qaResultMonthList:[],

      fileName:"",

      MESSAGE: {
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {
    // 조회 버튼 클릭
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.STD_YEAR)) return;
      
      this.page = 1;
      this.pagination.page = 1;
      this.selectQaResultMonthReport();
    },

    async selectQaResultMonthReport(){

      // 엑셀 파일명 셋팅
      this.setExcelFileName();

      let sUrl = '/phone-api/qa/selectQaResultMonthReport';
      // let sUrl = '/api/biz/common/select/selectQaResultMonthReport';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , DEPT_ID: this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).join(",")
        , TGT_EMP_NM: this.searchParams.TGT_EMP_NM
        , STD_YEAR: this.searchParams.STD_YEAR
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaResultMonthReport'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaResultMonthList = response.DATA.map(row=>{
          // 프로필 이미지
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          // 점수
          row.M_01 = this.mixin_isEmpty(row.M_01) ? "-" : parseFloat(row.M_01).toFixed(2);
          row.M_02 = this.mixin_isEmpty(row.M_02) ? "-" : parseFloat(row.M_02).toFixed(2);
          row.M_03 = this.mixin_isEmpty(row.M_03) ? "-" : parseFloat(row.M_03).toFixed(2);
          row.M_04 = this.mixin_isEmpty(row.M_04) ? "-" : parseFloat(row.M_04).toFixed(2);
          row.M_05 = this.mixin_isEmpty(row.M_05) ? "-" : parseFloat(row.M_05).toFixed(2);
          row.M_06 = this.mixin_isEmpty(row.M_06) ? "-" : parseFloat(row.M_06).toFixed(2);
          row.M_07 = this.mixin_isEmpty(row.M_07) ? "-" : parseFloat(row.M_07).toFixed(2);
          row.M_08 = this.mixin_isEmpty(row.M_08) ? "-" : parseFloat(row.M_08).toFixed(2);
          row.M_09 = this.mixin_isEmpty(row.M_09) ? "-" : parseFloat(row.M_09).toFixed(2);
          row.M_10 = this.mixin_isEmpty(row.M_10) ? "-" : parseFloat(row.M_10).toFixed(2);
          row.M_11 = this.mixin_isEmpty(row.M_11) ? "-" : parseFloat(row.M_11).toFixed(2);
          row.M_12 = this.mixin_isEmpty(row.M_12) ? "-" : parseFloat(row.M_12).toFixed(2);
          row.AVG_SCORE = parseFloat(row.AVG_SCORE).toFixed(2);

          return row;
        });

        if (Number(response.HEADER.COUNT) < Number(this.pagination.rowsPerPage)) {
          this.nextDisabled = true  //버튼 비활성화
        }else{
          this.nextDisabled = false //버튼 활성화
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      // 소속
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.DROP_DEPT_LIST.unshift({value:"ALL_CHECK", text:"전체"});
      this.searchParams.DEPT_ID = [];
    },

    // 소속 변경 이벤트
    changeDept(){
      this.checkDeptList();
    },

    // 전체 선택 처리
    checkDeptList(){
      let isCheck = this.searchParams.DEPT_ID.includes("ALL_CHECK");

      if(!this.isAllCheck && isCheck){
        this.isAllCheck = true;
        this.searchParams.DEPT_ID = this.DROP_DEPT_LIST.map(row=>{ return row.value});
      }else if(this.isAllCheck && !isCheck){
        this.isAllCheck = false;
        this.searchParams.DEPT_ID = [];
      }else if(this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).length == this.DROP_DEPT_LIST.filter(row=>{return row.value != "ALL_CHECK"}).length){
        this.isAllCheck = true;
        this.searchParams.DEPT_ID = this.DROP_DEPT_LIST.map(row=>{ return row.value});
      }else if(this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).length != this.DROP_DEPT_LIST.filter(row=>{return row.value != "ALL_CHECK"}).length){
        this.isAllCheck = false;
        this.searchParams.DEPT_ID = this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"});
      }
    },

    setExcelFileName(){
      this.fileName = this.searchParams.STD_YEAR + "년_월별_QA결과현황";
    },

    // 평가연도 조회
    async selectQaEvlYear(){
      // let sUrl = '/phone-api/qa/selectQaEvlYear';
      let sUrl = '/api/biz/common/select/selectQaEvlYear';

      let postParam = {};

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectQaEvlYear'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_YEAR = response.DATA.map(row=>{
          row.text = row.YR_TEXT;
          row.value = row.YR;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

  },
  async mounted() {
    this.selectQaEvlYear();

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    this.DROP_CENTER_LIST = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' );

    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    let temp = this.DROP_CENTER_LIST.filter(row=>{return row.CUSTCO_ID == centerId});
    if(temp.length > 0) this.searchParams.CENTER = temp[0];
    else this.searchParams.CENTER = this.DROP_CENTER_LIST[0];

    this.changeCenter();
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