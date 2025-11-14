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
                  v-model="searchParams.CENTER_ID"
                  :items="DROP_CENTER_LIST"
                  class="pl-form type-middle"
                  placeholder="선택"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가지 종류
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  :items="paperTypeList"
                  v-model="searchParams.PAPER_TYPE"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  :items="mixin_common_code_get(this.allCodeList, 'USE_WT', '전체')"
                  v-model="searchParams.USE_YN"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가지명
              </span>
              <div class="pl-desc">
               <v-text-field
                class="pl-form type-middle is-lg"
                placeholder="평가지명 입력"
                v-model="searchParams.PAPER_NM"
               ></v-text-field>
              </div>
            </div>
            <div>
              <v-btn
                class="pl-btn is-icon"
                @click="selectQaPaperList">
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
            <v-btn class="pl-btn is-icon is-trans" @click="clickRegistBtn">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans" @click="clickDeleteBtn">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaPaperList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridHeaders"
              :DataBodyProp="qaPaperList"
              FileNameProp="평가지 목록"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover has-control"
          :headers="gridHeaders"
          :items="qaPaperList"
          show-select
          fixed-header
          item-key="ROW_NUM"
          height="calc(-262px + 100vh)"
          hide-default-footer
          disable-pagination
          v-model="checkedPaperList"
          @dblclick:row="dblClickRow"
          :loading="loading"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 문항관리 -->
          <template v-slot:item.QSTN_BTN="{ item }">
            <compo-tooltip-btn
              TitleProp="문항관리"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 content-list"
              TooltipPositionProp="bottom"
              @btnClick="showQstnMngPopup(item)"
            ></compo-tooltip-btn>
          </template>

          <!-- 평가지 -->
          <template v-slot:item.PAPER_BTN="{ item }">
            <compo-tooltip-btn
              TitleProp="미리보기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 board-docu"
              TooltipPositionProp="bottom"
              @btnClick="openQaPaperPreview(item)"
            ></compo-tooltip-btn>
          </template>

          <!-- 사용여부 -->
          <template v-slot:item.USE_YN_NM="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.USE_YN, 'STAT_LIST')}`"
              style="width: 50px;"
              >
            {{ item.USE_YN_NM }}</span>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- side panel : 평가지 등록 -->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        :style="tempCenterStyle"
        v-if=" dialogDetail === true ">
        <div class="pl-quick-layer-header"><h1>평가지 등록</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
         <QAM_M0300_DETAIL
          ref="QAM_M0300_DETAIL"
          @Close="dialogDetail = false"
          @Select="selectQaPaperList"
          :propsQaPaperData="qaPaperData"
          />

      </div>
    </v-slide-x-reverse-transition>

    <!-- side panel : 문항관리 -->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer"
        style="width: 1000px;"
        :style="tempCenterStyle"
        v-if=" dialogManageDetail === true ">
        <div class="pl-quick-layer-header"><h1>평가지 문항 관리</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogManageDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
         <QAM_M0300_MANAGE_DETAIL
          ref="QAM_M0300_MANAGE_DETAIL"
          :propsQaPaperData="qaPaperData"
          @Close="dialogManageDetail = false"
          @Select="selectQaPaperList"
          />

      </div>
    </v-slide-x-reverse-transition>

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
          :isPreview="true"
        />
      </div>
    </v-slide-x-reverse-transition>

 </div>
</template>

<script>
import QAM_M0300_DETAIL from './QAM_M0300_DETAIL';
import QAM_M0300_MANAGE_DETAIL from './QAM_M0300_MANAGE_DETAIL';
import QAM_M0500_CS_DETAIL from '@/views/page/QAM_M0500_CS_DETAIL';

export default {
  name: "MENU_QAM_M0300", // 평가지 관리
  components: {
    QAM_M0300_DETAIL,
    QAM_M0300_MANAGE_DETAIL,
    QAM_M0500_CS_DETAIL,
  },
  data() {
    return {
      // grid
      gridHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '센터', value: 'CENTER_NM', align: 'left', width: '120px',sortable: true },
        { text: '평가지 종류', value: 'PAPER_TYPE_NM', align: 'left', width: '90px',sortable: false },
        { text: '평가지명', value: 'PAPER_NM', align: 'left', width: '350px', sortable: true },
        { text: '문항수', value: 'QSTN_CNT', align: 'center', width: '80px', sortable: true },
        { text: '총점', value: 'TOT_SCORE', align: 'center', width: '80px', sortable: true },
        { text: '사용건수', value: 'USE_CNT', align: 'center', width: '80px', sortable: true },
        { text: '문항관리', value: 'QSTN_BTN', align: 'center', width: '80px', sortable: false },
        { text: '평가지', value: 'PAPER_BTN', align: 'center', width: '80px', sortable: false },
        { text: '사용여부', value: 'USE_YN_NM', align: 'center', width: '80px', sortable: true },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '100px', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'left', width: '100px', sortable: true },
      ],

      // 공통코드
      allCodeList: [],

      // 센터
      DROP_CENTER_LIST: [],

      // 평가지 리스트
      qaPaperList: [],
      loading: false,

      // 선택 평가지 리스트
      checkedPaperList: [],

      STAT_LIST: [
        { code: 'Y', value: 'blue'},
        { code: 'N', value: 'org'},
      ],

      // detail
      dialogDetail: false,
      dialogResult: false,

      // dialog: 문항관리
      dialogManageDetail: false,

      // 평가지종류 자유배점 고정
      paperTypeList: [{text:"자유배점", value:"OPTION"}],

      // 조회조건
      searchParams:{
        PAPER_TYPE: "OPTION"
        , USE_YN: "Y"
        , CENTER_ID:""
        , PAPER_NM: ""
      },

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가지를 삭제하시겠습니까?', callYes: this.deleteQaPaper, callNo: this.closeAlert, },
        },
        ALERT:{
          REGIST_FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '상위 평가문항을 선택해주세요.' },
          DEL_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가지를 선택해주세요..' },
          DEL_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '사용중인 평가지는 삭제할 수 없습니다.' },
        },
        TOAST : {
          DEL_DONE : {  msg: '분류 유형이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      // 평가지 상세정보
      qaPaperData:{},
      propsQaBaseData:{},
    }
  },
  methods: {

    // 평가지 목록 조회
    async selectQaPaperList(){
      // 초기화
      this.checkedPaperList = [];

      // let sUrl = '/phone-api/qa/selectQaPaperList';
      let sUrl = '/api/biz/common/select/selectQaPaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        PAPER_TYPE: this.searchParams.PAPER_TYPE,
        PAPER_NM: this.searchParams.PAPER_NM,
        USE_YN: this.searchParams.USE_YN,
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaPaperManageMapper'
        , sn : 'selectQaPaperList'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaPaperList = response.DATA.map(row=>{
          row.QSTN_BTN = "";
          row.PAPER_BTN = "";
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 등록 버튼 클릭 이벤트
    clickRegistBtn(){
      if(this.dialogDetail) this.dialogDetail = false;
      this.dialogManageDetail = false;
      this.dialogResult = false;

      this.$nextTick(() => {
        // 상세정보 초기화
        this.qaPaperData = {
          CENTER_ID: this.searchParams.CENTER_ID
          , PAPER_ID: ""
          , PAPER_NM: ""
          , PAPER_TYPE: "OPTION"
          , QSTN_CNT: ""
          , TOT_SCORE: ""
          , USE_CNT: ""
          , PAPER_DESC: ""
          , USE_YN: "Y"
        };

        this.dialogDetail = true;
      });
    },

    dblClickRow(e, {item}){
      if(this.dialogDetail) this.dialogDetail = false;
      this.dialogManageDetail = false;
      this.dialogResult = false;


      this.$nextTick(() => {
        // 상세정보 초기화
        this.qaPaperData = {
          CENTER_ID: item.CENTER_ID
          , PAPER_ID: item.PAPER_ID
          , PAPER_NM: item.PAPER_NM
          , PAPER_TYPE: item.PAPER_TYPE
          , QSTN_CNT: item.QSTN_CNT
          , TOT_SCORE: item.TOT_SCORE
          , USE_CNT: item.USE_CNT
          , PAPER_DESC: item.PAPER_DESC
          , USE_YN: item.USE_YN
        };

        this.dialogDetail = true;
      });
    },

    // 삭제 버튼 클릭 이벤트
    clickDeleteBtn(){
      if(this.checkedPaperList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL01);
        return;
      }

      for(let i=0; i<this.checkedPaperList.length; i++){
        if(this.checkedPaperList[i].USE_CNT != "0"){
          this.showAlert(this.MESSAGE.ALERT.DEL_FAIL02);
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 평가지 삭제
    async deleteQaPaper(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaPaper';
      let postParam = {
        CHECK_LIST: this.checkedPaperList.map((row)=> {return {CENTER_ID:row.CENTER_ID, PAPER_ID: row.PAPER_ID}}),
        CENTER_ID: this.checkedPaperList[0].CENTER_ID,
        USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID,
      };
      let headParam = {
        head : {
          DATA_OBJECT: "CHECK_LIST",
        }
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        this.showToast(this.MESSAGE.TOAST.DEL_DONE);

        // 재조회
        this.selectQaPaperList();

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 문항관리 팝업 오픈
    showQstnMngPopup(item){
      if(this.dialogManageDetail) this.dialogManageDetail = false;

      this.$nextTick(() => {
        this.qaPaperData = item;
        this.dialogManageDetail = true;
      });
    },

    // 평가지 미리보기
    openQaPaperPreview(item){
      // 평가지 팝업 변수 정보 셋팅
      this.propsQaBaseData = item;

      // 평가실행 평가지 팝업 열기
      this.dialogResult = true;
    },

    closeSlide(){
      this.dialogResult = false
    },
  },
  async mounted() {
    // 공통코드 조회
    let codeList = ['USE_WT'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    // 평가지 조회
    this.selectQaPaperList();
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