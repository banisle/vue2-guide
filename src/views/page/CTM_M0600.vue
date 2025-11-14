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
                  :StartDayProp.sync="searchParams.FROM_DT"
                  :EndDayProp.sync="searchParams.TO_DT"
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
                  v-model="searchParams.CENTER"
                  :items="DROP_CENTER_LIST"
                  class="pl-form type-middle"
                  placeholder="전체"
                  return-object
                  @change="changeCenter"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                이의제기 구분
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  placeholder="전체"
                  :items="mixin_common_code_get(this.allCodeList, 'ARGU_DV', '전체')"
                  v-model="searchParams.EVL_SE_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                진행상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                  :items="DROP_STTS_CD_LIST"
                  v-model="searchParams.STTS_CD"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                이의제기자
              </span>
              <div class="pl-desc">
               <v-text-field
                class="pl-form type-middle is-sm"
                placeholder="성명입력"
                v-model="searchParams.REG_USER_NM"
               ></v-text-field>
              </div>
            </div>
            <div>
              <v-btn class="pl-btn is-icon" @click="clickSearchBtn" >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
              <compo-tooltip-btn
                TitleProp="초기화 "
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="clickResetBtn"
              ></compo-tooltip-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <span class="pl-bullet-txt is-blue">신청 <strong>({{ applyCnt }})</strong></span>
            <span class="pl-bullet-txt is-green">종결 <strong>({{ closeCnt }})</strong></span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ gridDataText.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridDataHeaders"
              :DataBodyProp="gridDataText"
              FileNameProp="이의제기목록"
              SheetNameProp="이의제기목록"
            />
          </div>
        </div>
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="gridDataHeaders"
          :items="gridDataText"
          fixed-header
          item-key="ROW_NUM"
          height="calc(-306px + 100vh)"
          hide-default-footer
          @dblclick:row="dblClickRow"
          :items-per-page="ROW_PER_PAGE"
          :page.sync="page"
          @page-count="pageCount = $event"
          :loading="loading"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 이의제기자 -->
          <template v-slot:item.RGTR_NM="{ item }">
            <img :src="item.IMG" :alt="item.RGTR_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
            <span class="ml-1">{{ item.RGTR_NM }}</span>
          </template>
          <!-- 진행상태 -->
          <template v-slot:item.STTS_CD_NM="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.STTS_CD_NM, 'STAT_LIST')}`"
              style="width: 40px;"
              >
            {{ item.STTS_CD_NM }}</span>
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
            보기 {{ mixin_getPagePeriod(gridDataText, page) }} / {{ gridDataText.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="selectObjectionList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>

    <!-- side panel : 업무평가-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogQtmDetail === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px;"
        >
        <QTM_M0400_TEST_DETAIL
          @Close="closeQtmSlide()"
          :qstnPaperData="propsQtmData"
        />
      </div>
    </v-slide-x-reverse-transition>
 </div>
</template>

<script>
import QTM_M0400_TEST_DETAIL from "@/views/page/QTM_M0400_TEST_DETAIL";

export default {
  name: 'MENU_CTM_M0600', //이의제기 관리
  components: {
    QTM_M0400_TEST_DETAIL
  },
  data() {
    return {
      allCodeList:[],
      common_ognz_list:[],
      DROP_CENTER_LIST:[],
      DROP_DEPT_LIST:[],
      DROP_STTS_CD_LIST:[
        {text: "전체", value:""}
        , {text: "신청", value:"ARGUTP03"}
        , {text: "종결", value:"ARGUTP04"}
      ],

      searchParams:{
        FROM_DT: this.$moment().format("YYYY-MM-DD"),
        TO_DT: this.$moment().format("YYYY-MM-DD"),
        CENTER:"",
        UP_DEPT_ID: "",
        DEPT_ID: "",
        EVL_SE_CD: "",
        STTS_CD: "",
        REG_USER_NM:"",
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
      loading: false,

      gridDataHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '60px', sortable: true },
        { text: '이의제기 일자', value: 'REG_DT', align: 'center', width: '100px',sortable: true },
        { text: '이의 제기자', value: 'RGTR_NM', align: 'left', width: '100px',sortable: true },
        { text: '센터 ', value: 'UP_DEPT_NM', align: 'left', width: '120px', sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '120px', sortable: true },
        { text: '이의제기 구분', value: 'EVL_SE_CD_NM', align: '', width: '100px', sortable: true },
        { text: '이의제기 평가지', value: 'TITLE', align: '', width: '', sortable: true },
        { text: '신청구분', value: 'OBJT_TYPE', align: 'center', width: '100px', sortable: true },
        { text: '진행상태', value: 'STTS_CD_NM', align: 'center', width: '100px', sortable: true },
        { text: '종결자', value: 'RSLT_RGTR_NM', align: '', width: '80px', sortable: true },
        { text: '종결일', value: 'RSLT_REG_DT', align: '', width: '150px', sortable: true },
      ],
      gridDataText:[],

      STAT_LIST: [
        { code: '종결', value: 'green'},
        { code: '요청', value: 'cyan'},
        { code: '취소', value: 'red'},
        { code: '신청', value: 'org'},
      ],

      // 신청
      applyCnt: 0,

      // 종결
      closeCnt: 0,

      selectedRow:{},

      // 업무평가
      dialogQtmDetail: false,
      propsQtmData:{
        EVAL_ID: ""
        , USER_ID: ""
        , CENTER_ID: ""
      }

    }
  },
  methods: {

    // 조회 버튼 클릭
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.FROM_DT) || this.mixin_isEmpty(this.searchParams.TO_DT)){
        this.showAlertInfo({msg:"조회기간을 입력해주세요."});
        return false;
      }

      this.selectObjectionList();
    },

    // 이의제기 목록 조회
    async selectObjectionList(next){
      if(!next){
        this.pagination.page = 1
        this.nextDisabled = true;
      }

      // let sUrl = '/phone-api/objt/selectObjectionList';
      let sUrl = '/api/biz/common/select/selectObjectionList';

      let postParam = {
        FROM_DT: this.searchParams.FROM_DT.replaceAll("-", "")
        , TO_DT: this.searchParams.TO_DT.replaceAll("-", "")
        , UP_DEPT_ID: this.searchParams.CENTER.DEPT_ID
        , EVL_SE_CD: this.searchParams.EVL_SE_CD
        , STTS_CD: this.searchParams.STTS_CD
        , REG_USER_NM: this.searchParams.REG_USER_NM
      };

      let headParam = { head : {
        ns : 'lhcs.phone.objt.dao.xml.PhoneObjectionManageMapper'
        , sn : 'selectObjectionList'
        , ROW_CNT: this.pagination.rowsPerPage
        , PAGES_CNT: this.pagination.page
        , PAGING: "Y"
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.applyCnt = 0;
        this.closeCnt = 0;

        this.gridDataText = response.DATA.map(row=>{
          // 프로필 이미지
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');

          row.RSLT_RGTR_NM = this.mixin_nvl(row.RSLT_RGTR_NM, "-");
          row.RSLT_REG_DT = this.mixin_nvl(row.RSLT_REG_DT, "-");

          if(row.STTS_CD === "ARGUTP03") this.applyCnt++;
          else if(row.STTS_CD === "ARGUTP04") this.closeCnt++;

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
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }

      this.loading = false;
    },

    dblClickRow(e, {item}){
      this.selectedRow = item;

      // 슬라이드 닫기 처리
      this.$eventBus.$emit('clearVSlideXreverse');
      this.dialogQtmDetail = false;

      switch(item.EVL_SE_CD){
        case "ARGUDV01":
          // QA평가결과
          this.mixin_showQaResult(item.STD_ID, item.CENTER_ID);
          break;
        case "ARGUDV02":
          // 업무평가
          this.propsQtmData.EVAL_ID = item.EVAL_ID;
          this.propsQtmData.CENTER_ID = item.CENTER_ID;
          this.propsQtmData.USER_ID = item.RGTR_ID;
          this.dialogQtmDetail = true;
          break;
        // case "ARGUDV03":
        //   //코칭
        //   this.mixin_showCoach(item.PHN_CUTT_ID, item.CENTER_ID);
        //   break;
        default:
          break;
      }
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    // 초기화
    clickResetBtn(){
      this.searchParams = {
        FROM_DT: this.$moment().format("YYYY-MM-DD"),
        TO_DT: this.$moment().format("YYYY-MM-DD"),
        CENTER:"",
        UP_DEPT_ID: "",
        DEPT_ID: "",
        EVL_SE_CD: "",
        STTS_CD: "",
        REG_USER_NM:"",
      };
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      // 소속
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.searchParams.DEPT_ID = [];
    },

    // 업무평가 팝업 닫기
    closeQtmSlide(){
      this.dialogQtmDetail = false;
    },

  },
  async mounted() {

    // 공통코드 조회
    let codeList = ['ARGU_DV'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList, "Y");
    // console.log(this.allCodeList)

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    this.DROP_CENTER_LIST = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '전체' );
    this.changeCenter();

    this.selectObjectionList();
  },
  created() {
    // 재조회
    this.$eventBus.$on("refreshObjtGridList", (item) => {
      this.selectObjectionList();
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