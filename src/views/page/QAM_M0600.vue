<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
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
                  @change="changeCenter"
                  return-object
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가 년월
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  StyleProp="width: 90px"
                  :DateProp.sync="searchParams.STD_MT"/>
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
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">차수별 평가 결과 현황</strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaResultPaperList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridheaders1"
              :DataBodyProp="qaResultPaperList"
              FileNameProp="차수별 평가 결과 현황"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover "
          :headers="gridheaders1"
          :items="qaResultPaperList"
          :item-class="isActiveRow"
          fixed-header
          item-key="ROW_NUM"
          height="180px"
          hide-default-footer
          disable-pagination
          @click:row="clickPaperRow"
          :loading="loading01"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 대상자 -->
          <template v-slot:item.TGT_EMP_CNT="{ item }">
            <strong>{{ item.TGT_EMP_CNT }}</strong>
          </template>
          <!-- 평가완료 -->
          <template v-slot:item.COMPLETE_CNT="{ item }">
            <strong class="is-txt-cyan">{{ item.COMPLETE_CNT }}</strong>
          </template>
          <!-- 평가진행률 -->
          <template v-slot:item.COMPLETE_RATE="{ item }">
            {{ item.COMPLETE_RATE }}
          </template>
          <!-- 적용 -->
          <template v-slot:item.APPLY_CNT="{ item }">
            <strong class="is-txt-cyan">{{ item.APPLY_CNT }}</strong>
          </template>
          <!-- 적용율 -->
          <template v-slot:item.APPLY_RATE="{ item }">
            {{ item.APPLY_RATE }}
          </template>
          <!-- 베스트콜 -->
          <template v-slot:item.BEST_CALL_CNT="{ item }">
            <strong class="is-txt-org">{{ item.BEST_CALL_CNT }}</strong>
          </template>

          <!-- 진행상태 -->
          <template v-slot:item.PROC_STAT_NM="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT, 'STAT_LIST')}`"
              style="width: 40px;"
              >
            {{ item.PROC_STAT_NM }}</span>
          </template>
        </v-data-table>

        <!-- grid top -->
        <div class="pl-grid-top is-mt-m">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">{{ this.selectedPaper.FULL_PAPER_NM }}</strong>
          </div>
          <div class="pl-grid-top-utils">

            <!-- 평가결과 조회 조건 -->
            <div class="pl-form-inline-wrap">
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
                  상담사
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="searchParams.TGT_EMP_NM"
                    clearable
                  ></v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <div class="pl-desc">
                  <v-checkbox
                    class="pl-check align-self-start"
                    v-model="searchParams.CALL_TYPE_BEST"
                    label="베스트콜"
                  ></v-checkbox>
                  <v-checkbox
                    class="pl-check align-self-start"
                    v-model="searchParams.CALL_TYPE_WORST"
                    label="워스트콜"
                  ></v-checkbox>
                </div>
              </div>
              <v-btn class="pl-btn" @click="clickSearchBtn2">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>

            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaResultList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridheaders2"
              :DataBodyProp="qaResultList"
              :FileNameProp="selectedPaper.EXCEL_FILE_NM"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover "
          :headers="gridheaders2"
          :items="qaResultList"
          fixed-header
          item-key="ROW_NUM"
          height="446px"
          hide-default-footer
          disable-pagination
          :loading="loading02"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 대상자 -->
          <template v-slot:item.TGT_EMP_NM="{ item }">
            <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
            <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
          </template>

          <!-- 평가상태 -->
          <template v-slot:item.COMPLETE_YN_NM="{ item }">
            <strong :class="`is-txt-${mixin_displayStatus(item.COMPLETE_YN, 'STAT_LIST2')}`">{{ item.COMPLETE_YN_NM }}</strong>
          </template>
          <!-- 적용여부 -->
          <template v-slot:item.APPLY_YN_NM="{ item }">
            <strong :class="`is-txt-${mixin_displayStatus(item.APPLY_YN, 'STAT_LIST2')}`">{{ item.APPLY_YN_NM }}</strong>
          </template>
          <!-- 콜 구분 -->
          <template v-slot:item.CALL_TYPE_NM="{ item }">
            <strong :class="`is-txt-${mixin_displayStatus(item.CALL_TYPE, 'STAT_LIST2')}`">{{ item.CALL_TYPE_NM }}</strong>
          </template>
          <!-- 평가결과 -->
          <template v-slot:item.STD_BTN="{ item }">
            <compo-tooltip-btn
              TitleProp="결과 보기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 manager_test"
              TooltipPositionProp="bottom"
              @btnClick="clickQaResultBtn(item)"
              :DisabledProp=!item.STD_ID
            ></compo-tooltip-btn>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogResult === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px"
              >
        <QAM_M0500_CS_DETAIL
          @Close="closeSlide()"
          :propsQaBaseData="propsQaBaseData"
          :isResult="true"
          :isPreview="true"
        />
      </div>
    </v-slide-x-reverse-transition>

 </div>
</template>

<script>
import QAM_M0500_CS_DETAIL from '@/views/page/QAM_M0500_CS_DETAIL';

export default {
  name: 'MENU_QAM_M0600', //평가 결과 관리
  components: {
    QAM_M0500_CS_DETAIL,
  },
  data() {
    return {

      // 차수별 평가 결과 현황 grid
      gridheaders1: [
        { text: '평가년월', value: 'STD_MT', align: 'center', width: '100px',sortable: true },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '50px',sortable: true },
        { text: '평가지', value: 'PAPER_NM', align: 'left', width: '370px', sortable: true },
        { text: '대상자', value: 'TGT_EMP_CNT', align: 'center', width: '100px', sortable: true },
        { text: '평가중', value: 'NOT_COMPLETE_CNT', align: 'center', width: '100px', sortable: true },
        { text: '평가완료', value: 'COMPLETE_CNT', align: 'center', width: '100px', sortable: true },
        { text: '결과 미공개', value: 'NOT_APPLY_CNT', align: 'center', width: '100px', sortable: true },
        { text: '결과 공개', value: 'APPLY_CNT', align: 'center', width: '100px', sortable: true },
        // { text: '적용율', value: 'APPLY_RATE', align: 'center', width: '100px', sortable: true },
        { text: '베스트콜', value: 'BEST_CALL_CNT', align: 'center', width: '100px', sortable: true },
        { text: '워스트콜', value: 'WORST_CALL_CNT', align: 'center', width: '100px', sortable: true },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '100px', sortable: true },
      ],

      // (2차) 상담품질 통합평가 변경(24.06)_마이홈센터
      gridheaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: 'left', width: '80px', sortable: true },
        { text: '평가점수', value: 'STD_SCORE', align: 'center', width: '80px', sortable: true },
        { text: '환산점수', value: 'CNVT_SCORE', align: 'center', width: '80px', sortable: true },
        { text: '평가상태', value: 'COMPLETE_YN_NM', align: 'center', width: '80px', sortable: true },
        { text: '결과 공개', value: 'APPLY_YN_NM', align: 'center', width: '80px', sortable: true },
        { text: '콜 구분', value: 'CALL_TYPE_NM', align: 'center', width: '80px', sortable: true },
        { text: '평가자', value: 'MGR_EMP_NM', align: 'left', width: '80px', sortable: true },
        { text: '소속', value: 'MGR_EMP_DEPT', align: 'left', width: '80px', sortable: true },
        { text: '평가일시', value: 'STD_DT', align: 'center', width: '100px', sortable: true },
        { text: '평가결과', value: 'STD_BTN', align: 'center', width: '70px', sortable: false },
      ],
      
      STAT_LIST: [
        { code: 'CLOSED', value: 'red'},
        { code: 'PROCEEDING', value: 'green'},
      ],

      STAT_LIST2: [
        { code: 'Y', value: 'cyan'},
        { code: 'B', value: 'org'},
      ],
      
      common_ognz_list: [],
      DROP_CENTER_LIST: [],
      DROP_DEPT_LIST:[],

      isAllCheck: false,

      //  조회 조건
      searchParams:{
        CENTER: {}
        , STD_MT: this.$moment().format('YYYY-MM')
        , DEPT_ID: []
        , TGT_EMP_NM: ""
        , CALL_TYPE_BEST: false
        , CALL_TYPE_WORST: false
      },

      qaResultPaperList:[],
      selectedPaper:{},
      qaResultList:[],
      allQaResultList:[],

      //dialog
      dialogResult: false,
      propsQaBaseData:{},

      loading01: false,
      loading02: false,
    }
  },
  methods: {

    // 조회 버튼 클릭 이벤트
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.CENTER.CUSTCO_ID)) return;

      if(this.mixin_isEmpty(this.searchParams.STD_MT)){
        this.showAlertInfo({msg:"평가년월을 입력해주세요."});
        return;
      }

      this.selectQaResultPaperList();
    },

    async selectQaResultPaperList(){
      if(this.mixin_isEmpty(this.searchParams.CENTER.CUSTCO_ID)) return;
      
      // 초기화
      this.selectedPaper = {};
      this.qaResultList = [];

      // let sUrl = '/phone-api/qa/selectQaResultPaperList';
      let sUrl = '/api/biz/common/select/selectQaResultPaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlResultManageMapper'
        , sn : 'selectQaResultPaperList'
      }};

      this.loading01 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaResultPaperList = response.DATA.map(row=>{
          row.FULL_PAPER_NM = "(" + row.STD_MT_ORD + "차) " +  row.PAPER_NM;
          row.EXCEL_FILE_NM = row.STD_MT + " (" + row.STD_MT_ORD + "차) " +  row.PAPER_NM;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading01 = false;
    },

    async selectQaResultList(){
      // 초기화
      this.propsQaBaseData = {};

      let sUrl = '/phone-api/qa/selectQaResultList';
      // let sUrl = '/api/biz/common/select/selectQaResultList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
        , DEPT_ID: this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).join(",")
        , CALL_TYPE_BEST: this.searchParams.CALL_TYPE_BEST ? "Y" : "N"
        , CALL_TYPE_WORST: this.searchParams.CALL_TYPE_WORST ? "Y" : "N"
        , TGT_EMP_NM: this.searchParams.TGT_EMP_NM
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlResultManageMapper'
        , sn : 'selectQaResultList'
      }};

      this.loading02 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaResultList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          row.CNVT_SCORE = parseFloat(row.CNVT_SCORE).toFixed(2);
          row.STD_BTN = "";
          return row;
        });
        // this.qaResultFilter();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading02 = false;
    },

    clickSearchBtn2(){
      if(this.mixin_isEmpty(this.selectedPaper)) return;
      this.selectQaResultList();
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      // 소속
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.DROP_DEPT_LIST.unshift({value:"ALL_CHECK", text:"전체"});

      // 초기화
      this.searchParams.DEPT_ID = [];
      this.searchParams.TGT_EMP_NM = "";
      this.searchParams.CALL_TYPE_BEST = false;
      this.searchParams.CALL_TYPE_WORST = false;

      if(this.mixin_isEmpty(this.searchParams.CENTER.CUSTCO_ID)) return;
      if(this.mixin_isEmpty(this.searchParams.STD_MT)) return;

      this.selectQaResultPaperList();
    },

    // 소속 변경 이벤트
    changeDept(){
      this.checkDeptList();
      // if(!this.mixin_isEmpty(this.selectedPaper)) this.qaResultFilter();
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

    qaResultFilter(){
      this.qaResultList = this.allQaResultList.filter(row=>{
        return (this.searchParams.DEPT_ID.length > 0 ? this.searchParams.DEPT_ID.filter(e=>{return e == row.DEPT_ID}).length > 0 : true)
              && (!this.mixin_isEmpty(this.searchParams.TGT_EMP_NM) ? row.TGT_EMP_NM.indexOf(this.searchParams.TGT_EMP_NM) >= 0 : true)
              && (
                (this.searchParams.CALL_TYPE_BEST ? row.CALL_TYPE == "B" : false)
                || (this.searchParams.CALL_TYPE_WORST ? row.CALL_TYPE == "W" : false)
                || ( !this.searchParams.CALL_TYPE_BEST && !this.searchParams.CALL_TYPE_WORST)
              )
      });
    },

    clickQaResultBtn(item){
      this.propsQaBaseData = item;

      // 평가실행 평가지 팝업 열기
      this.dialogResult = true;
    },

    closeSlide(){
      this.dialogResult = false
    },

    clickPaperRow(item){
      this.selectedPaper = item;
      this.selectQaResultList();
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedPaper ? "active" : "";
      return activeClass;
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

    this.selectQaResultPaperList();
  },
  created() {
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", (item) => {
      this.selectQaResultList();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>