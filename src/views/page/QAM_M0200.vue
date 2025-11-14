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
                  @change="changeCenter"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류유형
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-lg"
                  item-value="CD_ID"
                  item-text="CD_NM"
                  :items="DROP_QSTN_TYPE"
                  v-model="searchParams.QSTN_TYPE"
                  @change="changeSearchParams"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                점수 표기방식
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="modelCheckType"
                  :items="itemsCheckType"
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
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
                  @change="changeSearchParams"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                분류 명
              </span>
              <div class="pl-desc">
               <v-text-field
                class="pl-form type-middle is-lg"
                placeholder="분류명 입력"
                v-model="searchParams.QSTN_NM"
                @keyup.enter="changeSearchParams"
               ></v-text-field>
              </div>
            </div>
            <div>
              <v-btn
                class="pl-btn is-icon"
                @click="selectQstnList"
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
            <v-btn class="pl-btn is-icon is-trans"
              :disabled="isDisabledL"
              @click="clickRegistBtn('L')">
              <span class="pl-icon20 folder-plus"></span>
              대분류 등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans"
              :disabled="isDisabledM"
              @click="clickRegistBtn('M')">
              <span class="pl-icon20 group-plus"></span>
              중분류 등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans"
              :disabled="isDisabledS"
              @click="clickRegistBtn('S')">
              <span class="pl-icon20 square-plus"></span>
              소분류 등록
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qstnList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridHeaders"
              :DataBodyProp="qstnList"
              FileNameProp="평가문항 목록"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover has-control"
          :headers="gridHeaders"
          :items="qstnList"
          fixed-header
          item-key="ROW_NUM"
          height="calc(-262px + 100vh)"
          hide-default-footer
          disable-pagination
          show-select
          single-select
          v-model="checkedQstnList"
          @dblclick:row="dblClickRow"
          :loading="loading"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다."
          >
          <!-- 분류명 -->
          <template v-slot:item.QSTN_NM="{ item }">
            <span
              v-if="item.REPLY_CNT != '0'"
              :class="`pl-${item.REPLY_CNT === '1' ? 0 : 4}`">
              <v-icon class="pl-icon20 reply"></v-icon>
            </span>
            <span>{{ item.QSTN_NM }}</span>
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

    <!-- side panel : detail -->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer type-main"
        :style="tempCenterStyle"
        v-if="dialogDetail === true ">
        <div class="pl-quick-layer-header"><h1>평가 문항 상세정보</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
         <QAM_M0200_DETAIL
          ref="QAM_M0200_DETAIL"
          @Close="dialogDetail = false"
          @Select="selectQstnList"
          :propsQstnData="qstnData"
         />
      </div>
    </v-slide-x-reverse-transition>

 </div>
</template>

<script>
import QAM_M0200_DETAIL from './QAM_M0200_DETAIL'

export default {
  name: "MENU_QAM_M0200", // 평가문항 관리
  components: {
    QAM_M0200_DETAIL
  },
  data() {
    return {
      modelCheckType: '자유배점',
      itemsCheckType: ['자유배점'],

      // grid
      gridHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '분류 유형', value: 'QSTN_TYPE_NM', align: 'left', width: '230px',sortable: false },
        { text: '분류명', value: 'QSTN_NM', align: 'left', width: '850px',sortable: false },
        { text: '점수', value: 'TOT_SCORE', align: 'center', width: '70px', sortable: false },
        { text: '사용여부', value: 'USE_YN_NM', align: 'center', width: '90px', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '90px', sortable: false },
        { text: '등록일', value: 'REG_DTTM', align: 'left', width: '140px', sortable: false },
      ],

      STAT_LIST: [
        { code: 'Y', value: 'blue'},
        { code: 'N', value: 'org'},
      ],

      // 공통코드
      allCodeList:[],

      // 조회 조건
      searchParams:{
        CENTER_ID: "",
        QSTN_TYPE: "",
        USE_YN: "",
        QSTN_NM: "",
      },

      // detail
      dialogDetail: false,

      // 분류유형
      DROP_QSTN_TYPE: [],

      // 센터
      DROP_CENTER_LIST: [],

      // 문항목록
      qstnList: [],
      loading: false,

      // 선택 문항목록
      checkedQstnList: [],
      selectedRow: {},

      // 상세정보
      qstnData:{},

      // 등록버튼 활성화 여부
      isDisabledL: false,
      isDisabledM: true,
      isDisabledS: true,

      //알림창 메시지
      MESSAGE: {
        ALERT:{
          REGIST_FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '상위 평가문항을 선택해주세요.' },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

    }
  },
  methods: {

    // 평가문항 조회
    async selectQstnList(){
      // 초기화
      this.checkedQstnList = [];
      // this.selectedRow = {};

      let sUrl = '/phone-api/qa/selectQaQstnList';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        QSTN_TYPE: this.searchParams.QSTN_TYPE,
        QSTN_NM: this.searchParams.QSTN_NM,
        USE_YN: this.searchParams.USE_YN,
      };
      let headParam = { head : {} };

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qstnList = response.DATA;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 등록 버튼 클릭
    clickRegistBtn(type){
      if(type != "L" && this.checkedQstnList.length <= 0) {
        this.showAlert(this.MESSAGE.ALERT.REGIST_FAIL);
        return;
      }

      if(this.dialogDetail) this.dialogDetail = false;

      this.$nextTick(() => {
        // 상세정보 초기화
        this.qstnData = {
          CENTER_ID : this.searchParams.CENTER_ID
          , QSTN_TYPE : ""
          , QSTN_ID : ""
          , QSTN_NM : ""
          , QSTN_DESC: ""
          , QA_LCD: ""
          , QA_MCD: ""
          , QA_SCD: ""
          , QA_LCD_NM: ""
          , QA_MCD_NM: ""
          , STD_OPNN: ""
          , USE_YN: "Y"
          , USE_CNT: ""
          , QSTN_SCORE: ""
          , REGIST_TYPE: type
        };

        if(type == "L"){  // 대분류 등록
          if(this.checkedQstnList.length > 0){
            let row = this.checkedQstnList[0];
            this.qstnData.CENTER_ID = row.CENTER_ID;
            this.qstnData.QSTN_TYPE = row.QSTN_TYPE;
          }else{
            this.qstnData.CENTER_ID = this.searchParams.CENTER_ID;
          }
        }else{  // 중, 소분류 등록
          let row = this.checkedQstnList[0];
          this.qstnData.CENTER_ID = row.CENTER_ID;
          this.qstnData.QSTN_TYPE = row.QSTN_TYPE;
          this.qstnData.QA_LCD = row.QA_LCD;
          this.qstnData.QA_LCD_NM = row.QA_LCD_NM;
          this.qstnData.QA_MCD_NM = row.QA_MCD_NM;
          if(type == "S") {
            this.qstnData.QA_MCD = row.QA_MCD;
            this.qstnData.STD_OPNN = row.STD_OPNN;
          }
        }

        this.dialogDetail = true;
      });
    },

    async selectQaType(){

      this.searchParams.QSTN_TYPE = "";

      let sUrl = '/phone-api/qa/selectQaTypeList';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        USE_YN: "Y",
      };
      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_QSTN_TYPE = response.DATA;
      }else{
        this.DROP_QSTN_TYPE = [];
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      if(this.DROP_QSTN_TYPE.length > 0){
        this.searchParams.QSTN_TYPE = this.DROP_QSTN_TYPE[0].CD_ID;
      }

      this.DROP_QSTN_TYPE.unshift({CD_ID:"", CD_NM:"전체"});
    },

    // 그리드 더블 클릭 시 상세팝업 오픈
    dblClickRow(e, {item}){
      if(this.dialogDetail) this.dialogDetail = false;

      this.$nextTick(() => {
        // 상세정보 초기화
        this.qstnData = {
          CENTER_ID: item.CENTER_ID
          , QSTN_TYPE:item.QSTN_TYPE
          , QSTN_ID:item.QSTN_ID
          , QSTN_NM:item.QSTN_NM
          , QSTN_DESC: item.QSTN_DESC
          , QA_LCD: item.QA_LCD
          , QA_MCD: item.QA_MCD
          , QA_SCD: item.QA_SCD
          , QA_LCD_NM: item.QA_LCD_NM
          , QA_MCD_NM: item.QA_MCD_NM
          , QA_SCD_NM: item.QA_SCD_NM
          , STD_OPNN: item.STD_OPNN
          , USE_YN: item.USE_YN
          , QSTN_SCORE: item.QSTN_SCORE
          , REGIST_TYPE: item.REGIST_TYPE
          , USE_CNT: item.USE_CNT
        };

        this.dialogDetail = true;
      });
    },

    // 센터 변경 이벤트
    async changeCenter(){
      // 상세팝업 닫기
      this.dialogDetail = false;

      // 분류유형 콤보박스 셋팅
      await this.selectQaType();

      //평가문항 재조회
      this.selectQstnList();
    },

    // 조회 조건 변경 재조회
    changeSearchParams(){
      this.selectQstnList();
    },

    clickRow(item){
      // :item-class="isActiveRow"
      // @click:row="clickRow"
      this.selectedRow = item;
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
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

    // 분류유형 콤보박스 셋팅
    await this.selectQaType();

    // 문항 조회
    this.selectQstnList();
  },
  created() {
  },
  computed: {
  },
  watch: {
    // 문항 선택 시 이벤트
    checkedQstnList(newVal, oldVal){
      if(this.checkedQstnList.length > 0){
        if(this.checkedQstnList[0].REPLY_CNT == '0'){        // 대분류 선택 시
          // 중분류 등록 가능
          this.isDisabledM = false;
          this.isDisabledS = true;
          return;
        }else if(this.checkedQstnList[0].REPLY_CNT == '1'){  // 중분류 선택 시
          // 소분류 등록 가능
          this.isDisabledM = true;
          this.isDisabledS = false;
          return;
        }
      }

      this.isDisabledM = true;
      this.isDisabledS = true;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>