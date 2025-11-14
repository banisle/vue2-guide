<template>
  <div>

    <!-- 평가 마감 현황 -->
    <div class="pl-grid-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">평가 마감 현황 </strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaClosePaperList.length }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
          TypeProp="Download"
          :DataHeaderProp="gridHeaders1"
          :DataBodyProp="qaClosePaperList"
          FileNameProp="평가 마감 현황"
          SheetNameProp="sheetDown"
        />
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover "
      :headers="gridHeaders1"
      :items="qaClosePaperList"
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
      <!-- 진행상태 -->
      <template v-slot:item.PROC_STAT_NM="{ item }">
        <span
          :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT, 'STAT_LIST')}`"
          style="width: 40px;"
          >
        {{ item.PROC_STAT_NM }}</span>
      </template>
    </v-data-table>

    <div class="pl-cols">
      <!-- 평가 대상사별 현황 -->
      <div class="is-col-fix" style="width: 50%;">
        <div class="pl-grid-top is-mt-m">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">평가 대상자별 현황</strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaCloseTgtList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridHeaders2"
              :DataBodyProp="qaCloseTgtList"
              FileNameProp="평가 대상사별 현황"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover "
          :headers="gridHeaders2"
          :items="qaCloseTgtList"
          fixed-header
          item-key="ROW_NUM"
          height="400px"
          hide-default-footer
          disable-pagination
          :loading="loading02"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 대상자 -->
          <template v-slot:item.TGT_EMP_NM="{ item }">
            <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
            <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
          </template>
        </v-data-table>
      </div>
      <div class="ml-6">
        <!-- 평가자별 현황 -->
        <div>
          <div class="pl-grid-top is-mt-m">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">평가자별 현황</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaCloseMgrList.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DataHeaderProp="gridHeaders3"
                :DataBodyProp="qaCloseMgrList"
                FileNameProp="평가자별 현황"
                SheetNameProp="sheetDown"
              />
            </div>
          </div>
          <!-- grid -->
          <v-data-table
            class="pl-grid is-mt-s "
            :headers="gridHeaders3"
            :items="qaCloseMgrList"
            fixed-header
            item-key="ROW_NUM"
            height="210px"
            hide-default-footer
            disable-pagination
            :loading="loading03"
            loading-text="조회중입니다."
            no-data-text="등록된 데이터가 없습니다.">
          </v-data-table>
        </div>
        <!-- 이의신청 현황 -->
        <div>
          <div class="pl-grid-top is-mt-m">
            <div class="pl-grid-top-left">
              <strong class="pl-bullet-txt is-blue">이의신청 현황 </strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaCloseObjectList.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DataHeaderProp="gridHeaders4"
                :DataBodyProp="qaCloseObjectList"
                FileNameProp="이의신청 현황"
                SheetNameProp="sheetDown"
              />
            </div>
          </div>
          <!-- grid -->
          <v-data-table
            class="pl-grid is-mt-s "
            :headers="gridHeaders4"
            :items="qaCloseObjectList"
            fixed-header
            item-key="ROW_NUM"
            height="134px"
            hide-default-footer
            disable-pagination
            :loading="loading04"
            loading-text="조회중입니다."
            no-data-text="등록된 데이터가 없습니다.">
            <!-- 대상자 -->
            <template v-slot:item.RGTR_NM="{ item }">
              <img :src="item.IMG" :alt="item.RGTR_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
              <span class="ml-1">{{ item.RGTR_NM }}</span>
            </template>

            <template v-slot:item.STTS_CD_NM="{ item }">
              <span
                :class="`pl-badge is-${mixin_displayStatus(item.STTS_CD_NM, 'STAT_LIST2')}`"
                style="width: 40px;"
                >
              {{ item.STTS_CD_NM }}</span>
            </template>

            <template v-slot:item.STD_BTN="{ item }">
              <compo-tooltip-btn
                TitleProp="결과 보기"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 board-docu"
                TooltipPositionProp="bottom"
                @btnClick="openQaResultPaper(item)"
              ></compo-tooltip-btn>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QAM_M0800_TAB_02',//평가 마감 결과
  components: {
  },
  props:{
    propsSearchParams:{
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      propsQaBaseData: {},

      gridHeaders1: [
        { text: '평가년월', value: 'STD_MT', align: 'center', width: '80px',sortable: true },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '50px',sortable: true },
        { text: '평가지', value: 'PAPER_NM', align: 'left', width: '350px', sortable: true },
        { text: '평가기간', value: 'STD_ST_EN_DD', align: 'center', width: '130px', sortable: true },
        { text: '대상자', value: 'TGT_EMP_CNT', align: 'center', width: '100px', sortable: true },
        { text: '평가건수', value: 'STD_CNT', align: 'center', width: '100px', sortable: true },
        { text: '평가점수(환산)', value: 'AVG_SCORE', align: 'center', width: '100px', sortable: true },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '100px', sortable: false },
        { text: '마감일자', value: 'CLOS_DATE', align: 'center', width: '120px', sortable: true },
        { text: '처리자', value: 'UPD_EMP_NM', align: 'center', width: '100px', sortable: true },
      ],
      // 평가 대상자별 현황
      gridHeaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: 'left', width: '90px', sortable: true },
        { text: '평가지 개수', value: 'PAPER_CNT', align: 'center', width: '90px', sortable: true },
        { text: '평가 건수', value: 'STD_CNT', align: 'center', width: '90px', sortable: true },
        { text: '마감점수(환산)', value: 'AVG_SCORE', align: 'center', width: '90px', sortable: true },
      ],

      // 평가자별 현황
      gridHeaders3: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: true },
        { text: '소속', value: 'MGR_DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '평가자', value: 'MGR_EMP_NM', align: 'left', width: '100px',sortable: true },
        { text: '대상자', value: 'TGT_EMP_CNT', align: 'center', width: '100px', sortable: true },
        { text: '평가건수', value: 'STD_CNT', align: 'center', width: '100px', sortable: true },
        { text: '평가점수(환산)', value: 'AVG_SCORE', align: 'center', width: '100px', sortable: true },
        { text: '이의신청 건수', value: 'OBJT_CNT', align: 'center', width: '100px', sortable: true },
      ],
      
      // 이의신청 현황
      gridHeaders4: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: 'left', width: '100px',sortable: true },
        { text: '신청자', value: 'RGTR_NM', align: 'left', width: '90px',sortable: true },
        { text: '이의 신청일', value: 'REG_DT', align: 'center', width: '90px', sortable: true },
        { text: '신청구분', value: 'OBJT_TYPE', align: 'center', width: '90px', sortable: true },
        { text: '처리상태', value: 'STTS_CD_NM', align: 'center', width: '90px', sortable: true },
        { text: '평가지', value: 'STD_BTN', align: 'center', width: '70px', sortable: false },
      ],

      // 평가 마감 현황 목록
      qaClosePaperList:[],
      selectedPaper:{},

      // 평가 마감 대상자별 현황
      qaCloseTgtList:[],

      // 평가 마감 평가자별 현황
      qaCloseMgrList:[],

      // 이의신청 현황
      qaCloseObjectList:[],

      STAT_LIST: [
        { code: 'CLOSED', value: 'red'},
        { code: 'PROCEEDING', value: 'green'},
      ],

      STAT_LIST2: [
        { code: '종결', value: 'blue'},
        { code: '신청', value: 'green'},
      ],

      loading01: false,
      loading02: false,
      loading03: false,
      loading04: false,

      MESSAGE: {
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

    }
  },
  methods: {

    // 조회조건 셋팅 및 조회 처리
    setSearchParams(obj){
      this.searchParams = obj;

      this.selectQaClosePaperList();
    },

    // 평가 마감 결과 조회
    async selectQaClosePaperList(){

      this.selectedPaper = {};
      this.qaCloseTgtList = [];
      this.qaCloseMgrList = [];
      this.qaCloseObjectList = [];

      // let sUrl = '/phone-api/qa/selectQaClosePaperList';
      let sUrl = '/api/biz/common/select/selectQaClosePaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'selectQaClosePaperList'
      }};

      this.loading01 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaClosePaperList = response.DATA.map(row=>{
          row.AVG_SCORE = this.mixin_isEmpty(row.AVG_SCORE) ? "-": parseFloat(row.AVG_SCORE).toFixed(2);
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading01 =  false;
    },

    // 평가대상자별 현황
    async selectQaCloseTgtList(){
      // let sUrl = '/phone-api/qa/selectQaCloseTgtList';
      let sUrl = '/api/biz/common/select/selectQaCloseTgtList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'selectQaCloseTgtList'
      }};

      this.loading02 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaCloseTgtList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          row.PAPER_CNT = this.mixin_nvl(row.PAPER_CNT, "-");
          row.STD_CNT = this.mixin_nvl(row.STD_CNT, "-");
          row.AVG_SCORE = this.mixin_isEmpty(row.AVG_SCORE) ? "-" : parseFloat(row.AVG_SCORE).toFixed(2);
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading02 = false;
    },
    
    // 평가별 현황
    async selectQaCloseMgrList(){
      // let sUrl = '/phone-api/qa/selectQaCloseMgrList';
      let sUrl = '/api/biz/common/select/selectQaCloseMgrList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'selectQaCloseMgrList'
      }};

      this.loading03 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaCloseMgrList = response.DATA.map(row=>{
          row.TGT_EMP_CNT = this.mixin_nvl(row.TGT_EMP_CNT, "-");
          row.STD_CNT = this.mixin_nvl(row.STD_CNT, "-");
          row.AVG_SCORE = this.mixin_isEmpty(row.AVG_SCORE) ? "-" : parseFloat(row.AVG_SCORE).toFixed(2);
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading03 = false;
    },

    // 이의신청 현황
    async selectQaCloseObjectList(){
      // let sUrl = '/phone-api/qa/selectQaCloseObjectList';
      let sUrl = '/api/biz/common/select/selectQaCloseObjectList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlProgressManageMapper'
        , sn : 'selectQaCloseObjectList'
      }};

      this.loading04 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaCloseObjectList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading04 = false;
    },

    // 평가결과 팝업 열기
    openQaResultPaper(item){
      this.mixin_showQaResult(item.STD_ID, item.CENTER_ID);
    },

    clickPaperRow(item){
      this.selectedPaper = item;

      this.selectQaCloseTgtList();
      this.selectQaCloseMgrList();
      this.selectQaCloseObjectList();
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedPaper ? "active" : "";
      return activeClass;
    },
    
    closeSlide(){
      this.dialogResult = false
    }
  },
  mounted() {
    this.setSearchParams(this.propsSearchParams);
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