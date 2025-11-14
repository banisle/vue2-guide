<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          평가년월
        </span>
        <div class="pl-desc">
          <compo-date-picker
            NoTitleProp
            PickerType="month"
            DateType="dateInput"
            StyleProp="width: 100px"
            :DateProp.sync="searchParams.STD_MT"/>
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
            class="pl-form type-middle"
            placeholder="전체"
            v-model="searchParams.DEPT_ID"
            :items="DROP_DEPT_LIST"
            @change="changeDept"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          회차
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle is-sm"
            placeholder="전체"
            :items="DROP_STD_ORD_LIST"
            v-model="searchParams.STD_MT_ORD"
            @change="changeStdMtOrd"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          평가지
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            style="width: 500px;"
            placeholder="전체 "
            :items="DROP_STD_PAPER_LIST"
            v-model="searchParams.PAPER_ID"
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
            placeholder=""
            v-model="searchParams.TGT_EMP_NM"
            @keyup.enter="clickSearchBtn"
          />
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
              <strong class="pl-bullet-txt is-blue">개인별 평가 결과 현황 </strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaResultList.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="gridHeaders"
            :DataBodyProp="qaResultList"
            :FileNameProp="fileName"
            SheetNameProp="QA결과"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover"
        :headers="gridHeaders"
        :items="qaResultList"
        fixed-header
        item-key="ROW_NUM"
        height="calc(-360px + 100vh)"
        hide-default-footer
        :items-per-page="ROW_PER_PAGE"
        :page.sync="page"
        @page-count="pageCount = $event"
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
        <!-- 대상자 -->
        <template v-slot:item.TGT_EMP_NM="{ item }">
          <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
        </template>
        <template v-slot:[`item.STD_SCORE_${ordItem.STD_HEADER}`]="{ item }" v-for="ordItem in ordHeaderList">
          <span :class="item['STD_SCORE_'+ordItem.STD_HEADER] != '-' ? 'hover-line' : ''" @click="openQaResultPaper(item, ordItem.STD_HEADER)">{{ item['STD_SCORE_'+ordItem.STD_HEADER] }}</span>
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
          보기 {{ mixin_getPagePeriod(qaResultList, page) }} / {{ qaResultList.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp ="nextDisabled"
            @btnClick="selectQaResultReport(true)"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QAM_M0700_TAB_01', //상담품질 결과
  components: {
  },
  data() {
    return {

      dialogResult:false,

      common_ognz_list: [],
      DROP_CENTER_LIST:[],
      DROP_DEPT_LIST:[],
      DROP_STD_ORD_LIST:[
        {value:"", text:"전체"}
      ],
      DROP_STD_PAPER_LIST:[
        {value:"", text:"전체"}
      ],

      searchParams:{
        CENTER:{}
        , DEPT_ID:[]
        , STD_MT: this.$moment().format("YYYY-MM")
        , STD_MT_ORD: ""
        , PAPER_ID:""
        , TGT_EMP_NO:""
        , TGT_EMP_NM: ""
      },

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

      gridHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '센터', value: 'UP_DEPT_NM', align: '', width: '9%',sortable: false },
        { text: '소속', value: 'DEPT_NM', align: '', width: '9%',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: '', width: '7%', sortable: false },
        { text: '사번', value: 'TGT_EMP_NO', align: 'center', width: '7%', sortable: false },
        { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '7%', sortable: false },
        { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '6%', sortable: false },
        { text: '1차', value: 'STD_SCORE_1_1', align: 'center', width: '', sortable: false },
        { text: '2차', value: 'STD_SCORE_2_1', align: 'center', width: '', sortable: false },
        { text: '평균', value: 'AVG_SCORE', align: 'center', width: '', sortable: false },
      ],

      qaResultList:[],
      ordHeaderList:[],
      propsQaBaseData:{},

      isAllCheck: false,

      fileName:"QA결과",
      sheetName:"QA결과",

      loading: false,

      MESSAGE: {
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {
    // 조회 버튼 클릭 이벤트
    async clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.STD_MT)){
        this.showAlertInfo({msg:"평가년월을 입력해주세요."});
        return;
      }
      
      this.page = 1;
      this.pagination.page = 1;
      await this.selectQaStdHeader();
      await this.selectQaResultReport();
    },

    async selectQaResultReport(next){

      // 엑셀 파일명 셋팅
      this.setExcelFileName();

      if(!next){
        this.pagination.page = 1;
        this.nextDisabled = true;
      }

      let sUrl = '/phone-api/qa/selectQaResultReport';
      // let sUrl = '/api/biz/common/select/selectQaResultReport';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
        , PAPER_ID: this.searchParams.PAPER_ID
        , TGT_EMP_NM: this.searchParams.TGT_EMP_NM
        , DEPT_ID: this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).join(",")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'PhoneQaEvlReportManageMapper'
        // , ROW_CNT: this.pagination.rowsPerPage
        // , PAGES_CNT: this.pagination.page
        // , PAGING: "Y"
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaResultList = response.DATA.map(row=>{
          let ordList = row.ORD_LIST.split(",");
          let stdIdList = row.STD_ID_LIST.split(",");
          let stdScoreList = row.STD_SCORE_LIST.split(",");

          // 하이픈으로 초기화
          for(let i=0;i<this.ordHeaderList.length;i++){
            row['STD_SCORE_'+this.ordHeaderList[i].STD_HEADER] = "-";
          }

          for(let i=0; i<ordList.length; i++){
            row['STD_ID_'+ordList[i]] = stdIdList[i];
            row['STD_SCORE_'+ordList[i]] = parseFloat(stdScoreList[i]).toFixed(2);
          }

          row.AVG_SCORE = parseFloat(row.AVG_SCORE).toFixed(2);

          // 프로필 이미지
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

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

    // 헤더 조회
    async selectQaStdHeader(){
      // let sUrl = '/phone-api/qa/selectQaStdHeader';
      let sUrl = '/api/biz/common/select/selectQaStdHeader';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaStdHeader'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.ordHeaderList = response.DATA;

        this.gridHeaders = [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
          { text: '센터', value: 'UP_DEPT_NM', align: '', width: '9%',sortable: true },
          { text: '소속', value: 'DEPT_NM', align: '', width: '9%',sortable: true },
          { text: '대상자', value: 'TGT_EMP_NM', align: '', width: '7%', sortable: true },
          { text: '사번', value: 'TGT_EMP_NO', align: 'center', width: '7%', sortable: true },
          { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '7%', sortable: true },
          { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '6%', sortable: true },
        ]

        if(this.ordHeaderList.length > 0){
          for(let i=0;i<this.ordHeaderList.length;i++){
            this.gridHeaders.push({ text: this.ordHeaderList[i].STD_MT_ORD+"차", value: 'STD_SCORE_'+this.ordHeaderList[i].STD_HEADER, align: 'center', width: '', sortable: true });
          }
          this.gridHeaders.push({ text: '평균', value: 'AVG_SCORE', align: 'center', width: '', sortable: true },);
        }

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 회차 정보 조회
    async selectQaStdMtOrdList(){
      if(this.mixin_isEmpty(this.searchParams.STD_MT)) return;
      this.searchParams.STD_MT_ORD = "";
      this.DROP_STD_PAPER_LIST = [{text:"전체", value:""}];

      // let sUrl = '/phone-api/qa/selectQaStdMtOrdList';
      let sUrl = '/api/biz/common/select/selectQaStdMtOrdList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-","")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaStdMtOrdList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_STD_ORD_LIST = response.DATA.map(row=>{
          row.value = row.STD_MT_ORD;
          row.text = row.STD_MT_ORD_NM;
          return row;
        });

        this.DROP_STD_ORD_LIST.unshift({text:"전체", value:""});
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가지 정보 조회
    async selectQaStdMtOrdPaperList(){

      // let sUrl = '/phone-api/qa/selectQaStdMtOrdPaperList';
      let sUrl = '/api/biz/common/select/selectQaStdMtOrdPaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaStdMtOrdPaperList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_STD_PAPER_LIST = response.DATA.map(row=>{
          row.value = row.PAPER_ID;
          row.text = row.PAPER_NM;
          return row;
        });

        this.DROP_STD_PAPER_LIST.unshift({text:"전체", value:""});
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      // 소속
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.DROP_DEPT_LIST.unshift({value:"ALL_CHECK", text:"전체"});
      this.searchParams.DEPT_ID = [];

      // 회차
      this.selectQaStdMtOrdList();
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

    // 평가년월 변경
    changeStdMt(){
      // 회차
      this.selectQaStdMtOrdList();
    },

    // 회차 변경
    changeStdMtOrd(){
      this.searchParams.PAPER_ID = "";
      this.DROP_STD_PAPER_LIST = [{text:"전체", value:""}];

      if(!this.mixin_isEmpty(this.searchParams.STD_MT_ORD)){
        this.selectQaStdMtOrdPaperList();
      }
    },

    // 평가결과 팝업 열기
    openQaResultPaper(item, ordStr){
      this.mixin_showQaResult(item["STD_ID_"+ordStr], item.CENTER_ID);
    },

    setExcelFileName(){
      if(!this.mixin_isEmpty(this.searchParams.PAPER_ID)){
        let paperNm = this.DROP_STD_PAPER_LIST.filter(row=>{return row.value == this.searchParams.PAPER_ID})[0].PAPER_NM;
        this.fileName = this.searchParams.STD_MT + "_" + this.searchParams.STD_MT_ORD + "차_[" + paperNm + "]_QA결과";
      }else if(!this.mixin_isEmpty(this.searchParams.STD_MT_ORD)){
        this.fileName = this.searchParams.STD_MT + "_" + this.searchParams.STD_MT_ORD + "차_QA결과";
      }else{
        this.fileName = this.searchParams.STD_MT + "_QA결과";
      }
    },
  },
  async mounted() {
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
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", (item) => {
      this.selectQaResultReport();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {

  },
  watch: {
    "searchParams.STD_MT"(){
      this.searchParams.STD_MT = this.searchParams.STD_MT.replace(/^(\d{4})(\d{2})$/, '$1-$2');
      if(this.searchParams.STD_MT.length >= 7){
        this.changeStdMt();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>