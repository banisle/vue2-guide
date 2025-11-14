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
                  @change="changeCenter"
                ></v-select>
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">
                평가 년월
              </span>
              <div class="pl-desc" style="width: 210px">
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  StyleProp="flex: 0 0 90px"
                  :DateProp.sync="searchParams.ST_STD_MT"/>
                <span class="pl-unit">~</span>
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  StyleProp="flex: 0 0 90px"
                  :DateProp.sync="searchParams.EN_STD_MT"/>
              </div>
            </div> -->

            <div class="pl-form-inline">
              <span class="pl-label">
                평가기간
              </span>
              <div class="pl-desc" style="width: 280px">
                <compo-date-range-picker
                  :StartDayProp.sync="searchParams.STD_ST_DD"
                  :EndDayProp.sync="searchParams.STD_EN_DD"
                  :IsViewDropPickerProp="false"
                />
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                진행상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  placeholder="전체"
                  :items="mixin_common_code_get(this.allCodeList, 'QA_STAT_TP', '전체')"
                  v-model="searchParams.PROC_STAT"
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
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- grid -->
        <div class="is-vrt">
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
                <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaPlanList.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="gridheaders"
                  :DataBodyProp="qaPlanList"
                  FileNameProp="평가 계획 목록"
                  SheetNameProp="sheetDown"
                />
              </div>
            </div>
            <!-- grid -->
            <v-data-table
              class="pl-grid is-mt-s is-hover has-control"
              :headers="gridheaders"
              :items="qaPlanList"
              v-model="checkedPlanList"
              :item-class="isActiveRow"
              show-select
              single-select
              fixed-header
              item-key="ROW_NUM"
              height="180px"
              disable-pagination
              hide-default-footer
              @click:row="clickPlanRow"
              :loading="loading"
              loading-text="조회중입니다."
              no-data-text="등록된 데이터가 없습니다.">
              <template v-slot:item.PROC_STAT_NM="{ item }">
                <span
                  :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT, 'STAT_LIST')}`"
                  style="width: 40px;"
                  >
                {{ item.PROC_STAT_NM }}</span>
              </template>
            </v-data-table>
          </div>
          <!-- tab -->
          <div class="is-border-bottom is-mt-m">
            <v-tabs v-model="tabKey" slider-size="2" class="pl-tabs px-6 is-noborder">
              <CompoTabItems :TabsList=tabsList >
              </CompoTabItems>
              <template v-if="tabKey === 0">
                <v-btn class="pl-btn is-sm align-self-center ml-auto" @click="clickSaveBtn">저장</v-btn>
              </template>
              <template v-else>
                <v-btn class="pl-btn is-sm is-sub align-self-center ml-auto" @click="clickAddPaperBtn" :disabled="!isPlan">평가지 추가</v-btn>
                <v-btn class="pl-btn is-sm align-self-center ml-1" @click="clickDeletePaperBtn" :disabled="!isPlan">삭제</v-btn>
              </template>
            </v-tabs>
          </div>
          <v-tabs-items v-model="tabKey">
            <div class="pl-card-body fill-height">
              <template v-for="(item, index) in tabsList" >
                <v-tab-item :key="index" eager>
                  <div
                    :class="`fill-height tab-contents`">
                    <component :is="item.content" :ref="item.content" @callFunc="(data)=>{callFunc(data)}"></component>
                  </div>
                </v-tab-item>
              </template>
            </div>
          </v-tabs-items>
        </div>
        <!-- 평가 대상자 -->
        <template>
          <QAM_M0400_TARGET ref="QAM_M0400_TARGET" @callFunc="(data)=>{callFunc(data)}"/>
        </template>
        </div>
    </div>

    <v-dialog
        v-model="dialogFindManager"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="직원 찾기"
          @hide="[mixin_hideDialog('FindManager'), initFindMng()]"
          @submit="submitDialog('FindManager')"
      >
        <template slot="body">
          <CompoFindManager
              ref="CompoFindManager"
              :SCH_ROLE_PROP="schRoleProp"
              :PAGING_PROP="pagingProp"
              :CHK_YN_PROP="chkYnProp"
              :SEARCH_INPUT_PROP="SRCH_USER"
              :USER_PROP="USER_PROP"
              @hideDialog="mixin_hideDialog('FindManager')"
          />
          <!-- schRoleProp : 검색 조건 설정 CUSL : 상담사, MANAGER : 상담사를 제외한 LHCS직원 -->
          <!-- PAGING_PROP : 페이징 사용여부 -->
          <!-- chkYnProp : 체크박스 사용여부 / true : 리스트 , false : 오브젝트 리턴-->
          <!-- searchInputProp : 입력 이름 -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="[mixin_hideDialog('FindManager'), initFindMng()]">닫기</v-btn>
          <!-- <v-btn class="pl-btn" v-if="chkYnProp" @click="submitDialog">선택</v-btn> -->
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 일괄 배정 -->
    <v-dialog
      v-model="dialogAlleAssign"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가 대상자 일괄 배정"
        @hide="mixin_hideDialog('AlleAssign')"
        @submit="submitDialog('AlleAssign')"
      >
        <template slot="body">
          <QAM_M0400_DIALOG />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('AlleAssign')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('AlleAssign')">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

 </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoFindSheet from '@/components/CompoFindSheet.vue';
import CompoFindUser from '@/components/CompoFindUser.vue';
import QAM_M0400_TAB_01 from '@/views/page/QAM_M0400_TAB_01'
import QAM_M0400_TAB_02 from '@/views/page/QAM_M0400_TAB_02'
import QAM_M0400_TARGET from '@/views/page/QAM_M0400_TARGET.vue'

export default {
  name: "MENU_QAM_M0400", // 평가 계획 관리
  components: {
    CompoTabItems,
    CompoFindSheet,
    CompoFindUser,
    QAM_M0400_TAB_01,
    QAM_M0400_TAB_02,
    QAM_M0400_TARGET,
  },
  data() {
    return {

      // tab
      tabKey: null,
      tabsList: [
        { title: '평가계획 정보', content: 'QAM_M0400_TAB_01', badge: false},
        { title: '평가지/평가자 정보', content: 'QAM_M0400_TAB_02', badge: false},
      ],

      // grid
      gridheaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '센터', value: 'CENTER_NM', align: 'left', width: '100px',sortable: true },
        { text: '평가년월', value: 'STD_MT', align: 'center', width: '70px',sortable: true },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '50px', sortable: true },
        { text: '평가기간', value: 'STD_DD', align: 'center', width: '150px', sortable: true },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '70px', sortable: true },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '70px', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'left', width: '80px', sortable: true },
      ],

      STAT_LIST: [
        { code: 'CLOSED', value: 'red'},
        { code: 'PROCEEDING', value: 'green'},
      ],

      // dialog: 평가지 찾기
      dialogFindSheet: false,

      // dialog: 사용자 찾기
      dialogFindUser: false,

      // dialog: 일괄배정
      dialogAlleAssign: false,

      dialogFindManager: false,
      SRCH_USER:{},
      schRoleProp: 'CUSL', //조회 업무 구분
      chkYnProp: true, //체크박스사용여무
      pagingProp: false, //페이징여부
      USER_PROP : [],

      // 조회 조건
      searchParams:{
        CENTER_ID: "1"
        , ST_STD_MT: this.$moment().subtract(2, "months").format('YYYY-MM')
        , EN_STD_MT: this.$moment().add(1, "months").format('YYYY-MM')
        , STD_ST_DD: this.$moment().subtract(2, "months").startOf('month').format('YYYY-MM-DD')
        , STD_EN_DD: this.$moment().add(1, "months").endOf('month').format('YYYY-MM-DD')
        , PROC_STAT: ""
      },

      // 공통코드
      allCodeList: [],

      // 센터
      DROP_CENTER_LIST: [],

      // 평가계획 목록
      qaPlanList: [],
      checkedPlanList: [],
      selectedPlan:{},
      loading: false,

      // 평가계획 선택여부
      isPlan: false,

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가계획을 삭제하시겠습니까?', callYes: this.deleteQaPlan, callNo: this.closeAlert, },
        },
        ALERT:{
          FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가계획을 선택해주세요.' },
          DEL_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '마감된 평가계획은 삭제할 수 없습니다.' },
          DEL_FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가지가 등록된 평가계획은 삭제할 수 없습니다.' },
        },
        TOAST : {
          DEL_DONE : {  msg: '평가계획이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

    }
  },
  methods: {

    // 조회 버튼 클릭 이벤트
    clickSearchBtn(){
      this.clickRegistBtn();
      this.selectQaPlanList();
    },

    // 센터 조건 변경 시 이벤트
    changeCenter(){
      this.clickRegistBtn();
      this.selectQaPlanList();
    },

    // 평가지 목록 조회
    async selectQaPlanList(){
      // 초기화
      this.checkedPlanList = [];
      this.selectedPlan = {};

      // let sUrl = '/phone-api/qa/selectQaPlanList';
      let sUrl = '/api/biz/common/select/selectQaPlanList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        // , ST_STD_MT: this.searchParams.ST_STD_MT.replaceAll("-", "")
        // , EN_STD_MT: this.searchParams.EN_STD_MT.replaceAll("-", "")
        , PROC_STAT: this.searchParams.PROC_STAT
        , STD_ST_DD: this.searchParams.STD_ST_DD.replaceAll("-", "")
        , STD_EN_DD: this.searchParams.STD_EN_DD.replaceAll("-", "")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaPlanList'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaPlanList = response.DATA;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 등록 버튼 클릭 이벤트
    clickRegistBtn(){
      let item = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.$moment().format('YYYY-MM')
        , STD_MT_ORD: ""
        , STD_ST_DD: this.$moment().format('YYYY-MM-DD')
        , STD_EN_DD: this.$moment().format('YYYY-MM-DD')
        , RLS_YN:"Y"
        , CLOS_DATE: ""
        , PROC_STAT: "PROCEEDING"
        , RM: ""
      }
      this.isPlan = false;
      this.selectedPlan = {};
      this.setQaPlanData(item);

      // 평가계획 정보 탭 활성화
      this.tabKey = 0;
    },

    // 평가계획 삭제 버튼 클릭 이벤트
    clickDeleteBtn(){
      if(this.checkedPlanList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL01);
        return;
      }

      if(this.checkedPlanList[0].PROC_STAT === "CLOSED"){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL02);
        return;
      }

      if(this.checkedPlanList[0].PAPER_CNT != "0"){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL03);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    async deleteQaPlan(){
      this.closeAlert();

      // let sUrl = '/phone-api/qa/deleteQaPlan';
      let sUrl = '/api/biz/common/delete/deleteQaPlan';

      let postParam = {
        CENTER_ID: this.checkedPlanList[0].CENTER_ID
        , STD_MT: this.checkedPlanList[0].STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.checkedPlanList[0].STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'deleteQaPlan'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.clickSearchBtn();
        this.showToast(this.MESSAGE.TOAST.DEL_DONE);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가계획정보 초기화
    initData(){
      if(this.$refs.QAM_M0400_TAB_01) this.$refs.QAM_M0400_TAB_01[0].initData();
      if(this.$refs.QAM_M0400_TAB_02) this.$refs.QAM_M0400_TAB_02[0].initData();
      if(this.$refs.QAM_M0400_TARGET) this.$refs.QAM_M0400_TARGET.initData();
    },

    // 저장 버튼 클릭 시 이벤트
    clickSaveBtn(){
      if(this.$refs.QAM_M0400_TAB_01) this.$refs.QAM_M0400_TAB_01[0].clickSaveBtn();
    },

    // 평가지 추가 버튼 클릭 이벤트
    clickAddPaperBtn(){
      if(this.$refs.QAM_M0400_TAB_02) this.$refs.QAM_M0400_TAB_02[0].openFindSheetPopup();
    },
    
    // 평가지 삭제 버튼
    clickDeletePaperBtn(){
      if(this.$refs.QAM_M0400_TAB_02) this.$refs.QAM_M0400_TAB_02[0].clickDeleteBtn01();
    },

    // 평가계획 클릭 이벤트
    clickPlanRow(item){
      this.selectedPlan = item;
      this.isPlan = !(this.mixin_isEmpty(item.CENTER_ID) || this.mixin_isEmpty(item.STD_MT) || this.mixin_isEmpty(item.STD_MT_ORD));
      this.setQaPlanData(item);
    },

    // 평가계획 정보 셋팅
    setQaPlanData(obj){
      this.initData();
      if(this.$refs.QAM_M0400_TAB_01 && this.$refs.QAM_M0400_TAB_02){
        this.$refs.QAM_M0400_TAB_01[0].setQaPlanData(obj);
        this.$refs.QAM_M0400_TAB_02[0].setQaPlanData(obj);
      }
    },
    
    // 하위 컴포넌트 emit 처리 함수
    async callFunc(data){
      if(data.type == "SET_TGT"){
        // 평가대상자 조회
        if(this.$refs.QAM_M0400_TARGET) this.$refs.QAM_M0400_TARGET.setQaPlanData(data.obj, data.mngrList, data.checkedList);
      }else if(data.type == "PLAN_LIST"){
        // 평가계획 재조회 및 선택 처리
        await this.selectQaPlanList();
        if(!this.mixin_isEmpty(data.obj)){
          let temp = this.qaPlanList.filter(row=>{return row.CENTER_ID == data.obj.CENTER_ID 
                                            && row.STD_MT == data.obj.STD_MT 
                                            && row.STD_MT_ORD == data.obj.STD_MT_ORD});

          if(temp.length > 0){
            this.clickPlanRow(temp[0]);
          }
        }
      }else if(data.type == "MNGR_LIST"){
        // 평가자 재조회
        if(this.$refs.QAM_M0400_TAB_02) this.$refs.QAM_M0400_TAB_02[0].selectQaPlanMngrList(data.obj);
      }
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedPlan ? "active" : "";
      return activeClass;
    },

    showDetail(){
      this.dialogSmsDetail = true
    },
  },
  async mounted() {

    // 공통코드 조회
    let codeList = ['QA_STAT_TP'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.selectQaPlanList();

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