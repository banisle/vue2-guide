<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                법무법인 명
              </span>
              <div class="pl-desc">
                <v-text-field
                  class="pl-form type-middle"
                  v-model="SRCH_LAWCORP_NM"
                />
              </div>
            </div>

            <v-btn class="pl-btn is-icon" @click="clickSearchBtn()" >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <compo-tooltip-btn
              TitleProp="초기화"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="searchParamsReset()"
            ></compo-tooltip-btn>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body fill-height">
        <div class="pl-cols fill-height" >
          <!-- left -->
          <div class="is-vrt pr-6 is-col-fix" style="width: 40%;">
            <div class="pl-grid-top pt-2">
              <div class="pl-grid-top-left">
                <v-btn class="pl-btn is-icon is-trans" @click="addLaw">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-trans" @click="deleteLawItems">
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1">({{ goLawCorpList.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-mt-s has-control is-hover"
              :headers="headers"
              :items="goLawCorpList"
              fixed-header
              show-select
              single-select
              v-model="selectedList"
              item-key="ROW_NUM"
              height="calc(-262px + 100vh)"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              :page.sync="page"
              @click:row="selectLawItem"
              @dblclick:row="editLawItem"
              no-data-text="등록된 데이터가 없습니다."
              @page-count="pageCount = $event">
              <!-- 유형 뱃지     @click:row="selectLawItem" @dblclick:row="editLawItem"-->
              <template v-slot:item.USE_YN_NM="{ item }">
                <span
                  :class="`pl-badge is-${mixin_displayStatus(item.USE_YN_NM, 'STAT_LIST')}`"
                  style="width: 50px;"
                  >
                {{ item.USE_YN_NM }}</span>
              </template>
              <!--
              <template v-slot:item.LAWCORP_NM="{ item }">
               <span @click="editLawItem({item})">  {{item.LAWCORP_NM}} </span>
              </template>-->
              <!--   요건 변경 
              <template v-slot:item.RPRS_TELNO="{ item }">
               <span>  {{mixin_setPhoneNo(item.RPRS_TELNO.replace(/[^0-9]/g, ""))}} </span>
              </template>
              <template v-slot:item.RPRS_FXNO="{ item }">
               <span>  {{mixin_setPhoneNo(item.RPRS_FXNO.replace(/[^0-9]/g, ""))}} </span>
              </template>-->
            </v-data-table>
          </div>


          <!-- right -->
          <div class="pl-6">
            <div class="pl-grid-top pt-2">
              <div class="pl-grid-top-left">
                <strong class="pl-bullet-txt is-blue">({{selectedLowCorpNm}}) 위탁업무 </strong>
              </div>
              <div class="pl-grid-top-utils">
                <compo-tooltip-btn
                  TitleProp="위탁업무 등록"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 circle-plus"
                  TooltipPositionProp="bottom"
                  @btnClick="addTrust"

                ></compo-tooltip-btn>
                <compo-tooltip-btn
                  TitleProp="위탁업무 삭제"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 trash"
                  TooltipPositionProp="bottom"
                  @btnClick="deleteTrustItems"
                ></compo-tooltip-btn>
                <span class="pl-counter">전체 <em class="pl-1">({{ goLawCorpTrustList.length }})</em> 건</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-mt-s has-control is-hover"
              :headers="headers2"
              :items="goLawCorpTrustList"
              fixed-header
              show-select
              single-select
              v-model="selectedTrustList"
              item-key="ROW_NUM"
              height="calc(-262px + 100vh)"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              @dblclick:row="editTrust"
              no-data-text="등록된 데이터가 없습니다."
              @page-count="pageCount2 = $event">
              <!-- 유형 뱃지 -->
              <template v-slot:item.USE_YN_NM="{ item }">
                <span
                  :class="`pl-badge is-${mixin_displayStatus(item.USE_YN_NM, 'STAT_LIST')}`"
                  style="width: 50px;"
                  >
                {{ item.USE_YN_NM }}</span>
              </template>
              <!-- 요건 변경 
              <template v-slot:item.TELNO="{ item }">
               <span>  {{mixin_setPhoneNo(item.TELNO.replace(/[^0-9]/g, ""))}} </span>
              </template>
              <template v-slot:item.FXNO="{ item }">
               <span>  {{mixin_setPhoneNo(item.FXNO.replace(/[^0-9]/g, ""))}} </span>
              </template>-->
            </v-data-table>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog: 법무법인 정보 -->
    <v-dialog
      v-model="dialogLawInfo"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="법무법인 정보"
        @hide="mixin_hideDialog('LawInfo')"
        @submit="submitDialog('LawInfo')"
      >
        <template slot="body">
          <CSM_M1400_LAW_DIALOG
            ref="CSM_M1400_LAW_DIALOG"
            @close="mixin_hideDialog('LawInfo')"
            @select="this.selectLawCorpList"
            :propslawcorp="lawCorpData"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('LawInfo')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickSaveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>


    <!-- dialog: 위탁업무 정보 -->
    <v-dialog
      v-model="dialogTrustInfo"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="위탁업무 정보"
        @hide="mixin_hideDialog('TrustInfo')"
        @submit="submitDialog('TrustInfo')"
      >
        <template slot="body">
          <CSM_M1400_TRUST_DIALOG
          ref="CSM_M1400_TRUST_DIALOG"
          @close="mixin_hideDialog('TrustInfo')"
          @select="selectLawItemList"
          @refresh="selectLawItemList"
          :propslawcorp="lawCorpData"
          :propslawcorpTrust="lawCorpTrustData"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('TrustInfo')">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickSaveTrust">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CSM_M1400_LAW_DIALOG from '@/views/page/CSM_M1400_LAW_DIALOG'
import CSM_M1400_TRUST_DIALOG from '@/views/page/CSM_M1400_TRUST_DIALOG'
export default {
  name: 'MENU_CSM_M1400', //지역별 법무법인 관리
  components: {
    CSM_M1400_LAW_DIALOG,
    CSM_M1400_TRUST_DIALOG,
  },
  data() {
    return {
      // dialog
      dialogLawInfo: false,
      dialogTrustInfo: false,

      // left grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '법무법인 명', value: 'LAWCORP_NM', align: '', width: '' , sortable: true},
        { text: '대표 전화번호', value: 'RPRS_TELNO', align: '', width: '18%' , sortable: false},
        { text: '대표 팩스번호', value: 'RPRS_FXNO', align: '', width: '18%' , sortable: false},
        { text: '사용여부', value: 'USE_YN_NM', align: 'center', width: '12%' , sortable: false},
      ],
      items: [],
      // right grid
      page2: 1,
      pageCount2: 0,
      headers2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '위탁업무', value: 'CSGMTTASK_TYPE_CD_NM', align: '', width: '15%' , sortable: true},
        { text: '시/도', value: 'UP_ZONENAME', align: '', width: '8%' , sortable: false},
        { text: '시/군/구', value: 'ZONENAME', align: '', width: '10%' , sortable: false},
        { text: '전화번호', value: 'TELNO', align: 'left', width: '25%' , sortable: false},
        { text: '팩스번호', value: 'FXNO', align: 'left', width: '25%' , sortable: false},
        { text: '사용여부', value: 'USE_YN_NM', align: 'center', width: '8%' , sortable: false},
      ],
      items2: [
      ],
      STAT_LIST: [
        { code: '사용', value: 'blue'},
        { code: '사용안함', value: 'red'},
      ],

      lawCorpData: {},
      lawCorpTrustData: {},
      goLawCorpList: [],
      goLawCorpTrustList: [],
      SRCH_LAWCORP_NM: '',

      selectedLowCorpId:'',
      selectedLowCorpNm:'',

      isLawNew: true,
      selectedList: [],
      selectedTrustList: [],

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '선택된 법무법인을 삭제하시겠습니까?', callYes: this.deleteLawItemsAct, callNo: this.closeAlert, }
          , DELETE_TRUST: { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '선택된 위탁업무를 삭제하시겠습니까?', callYes: this.deleteTrustItemsAct, callNo: this.closeAlert }
        },
        ALERT:{
          REMOVE_ITEM : {alertDialogToggle: true, msg: '삭제할 법무법인을 선택 해주세요.', iconClass: 'is-info', type: 'default'}
          , REMOVE_TRUST_ITEM: { alertDialogToggle: true, msg: '삭제할 위탁업무를 선택 해주세요.', iconClass: 'is-info', type: 'default' }
        },
        TOAST : {
          SAVE_DONE : {  msg: '등록 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , EDIT_DONE : {  msg: '수정 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , DEL_DONE : {  msg: '삭제 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

      reg_flag : false,

    }
  },
  methods: {

    searchParamsReset(){
      this.SRCH_LAWCORP_NM = '';
    },

    deleteTrustItems() {
      if (!this.selectedTrustList || this.selectedTrustList.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.REMOVE_TRUST_ITEM);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DELETE_TRUST);
    },

    async deleteTrustItemsAct() {
      const sUrl = '/phone-api/lawcorp/deleteLawCorpTrust';
      const postParam = {
        LAWCORP_ID: this.selectedTrustList[0].LAWCORP_ID,
        ZONEID: this.selectedTrustList[0].ZONEID,
        CSGMTTASK_TYPE_CD: this.selectedTrustList[0].CSGMTTASK_TYPE_CD
      };

      const response = await this.common_postCall(sUrl, postParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.closeAlert();
        this.showToast(this.MESSAGE.TOAST.DEL_DONE);
        // 위탁업무 목록 재조회
        await this.selectLawItemList();
        // 선택 초기화
        this.selectedTrustList = [];
      } else {
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },


    deleteLawItems() {
      if (!this.selectedList || this.selectedList.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.REMOVE_ITEM);
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    async deleteLawItemsAct() {

      try {
        const sUrl = '/phone-api/lawcorp/deleteLawCorp';
        const postParam = {
          LAWCORP_ID: this.selectedList[0].LAWCORP_ID
        };

        const response = await this.common_postCall(sUrl, postParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.closeAlert();
          this.showToast(this.MESSAGE.TOAST.DEL_DONE);
          // 목록 재조회
          await this.selectLawCorpList();
          // 우측 위탁업무 목록 초기화
          this.goLawCorpTrustList = [];
          this.selectedLowCorpId = '';
          this.selectedLowCorpNm = '';
          // 선택 초기화
          this.selectedList = [];
        } else {
          this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
      } catch (error) {
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    addLaw(){
      this.isLawNew = true;
      this.lawCorpData =  {};
      if(this.$refs.CSM_M1400_LAW_DIALOG) this.$refs.CSM_M1400_LAW_DIALOG.setLawcorp();
      this.mixin_showDialog('LawInfo');
    },

    // 법무법인 수정
    editLawItem(e, {item}) {
      this.lawCorpData =  {
        isLawNew: false,
        LAWCORP_ID: item.LAWCORP_ID,
        LAWCORP_NM: item.LAWCORP_NM,
        RPRS_TELNO: item.RPRS_TELNO,
        RPRS_FXNO: item.RPRS_FXNO,
        EXPLN: item.EXPLN,
        SORT_ORD: item.SORT_ORD,
        USE_YN: item.USE_YN,
      };

      this.mixin_showDialog('LawInfo');
    },

    clickSaveTrust(){
      if(this.$refs.CSM_M1400_TRUST_DIALOG) this.$refs.CSM_M1400_TRUST_DIALOG.saveLawcorpTrust();
    },

    addTrust(){
      if(!this.mixin_isEmpty(this.selectedLowCorpId)){

        this.lawCorpTrustData = {};

        this.lawCorpTrustData = {
          isLawNew: 'Y',
          LAWCORP_ID: this.selectedLowCorpId,
          LAWCORP_NM: this.selectedLowCorpNm,
          ZONEID: '',
          CSGMTTASK_TYPE_CD: '',
          TELNO: '',
          FXNO: '',
        };

        this.reg_flag = true;
        if(this.$refs.CSM_M1400_TRUST_DIALOG) this.$refs.CSM_M1400_TRUST_DIALOG.setLawcorpTrus();
        this.mixin_showDialog('TrustInfo');
      }
    },
    editTrust(e, {item}){
      if(!this.mixin_isEmpty(this.selectedLowCorpId)){
        this.lawCorpTrustData = {};

        this.lawCorpTrustData = {
          isLawNew: 'N',
          LAWCORP_ID: item.LAWCORP_ID,
          LAWCORP_NM: item.LAWCORP_NM,
          ZONEID: item.ZONEID,
          CSGMTTASK_TYPE_CD: item.CSGMTTASK_TYPE_CD,
          TELNO: item.TELNO,
          FXNO: item.FXNO,
          depthId: item.PARENTID,
          depth2Id: item.ZONEID,
          UP_ZONENAME: item.UP_ZONENAME,
          ZONENAME: item.ZONENAME,
          PARENTID: item.PARENTID
        };
        this.reg_flag = false;
        //f(this.$refs.CSM_M1400_TRUST_DIALOG) this.$refs.CSM_M1400_TRUST_DIALOG.editLawcorpTrus();
        // 다이얼로그 컴포넌트의 초기화 함수 호출 전에 약간의 지연을 줌
        setTimeout(() => {
          if(this.$refs.CSM_M1400_TRUST_DIALOG) {
            this.$refs.CSM_M1400_TRUST_DIALOG.editLawcorpTrus();
          }
        }, 200);


        this.mixin_showDialog('TrustInfo');
      }
    },

    clickSaveBtn(){
      this.showConfirmInfo({msg : '저장 하시겠습니까?', callYes : ()=>{
          if(this.$refs.CSM_M1400_LAW_DIALOG) this.$refs.CSM_M1400_LAW_DIALOG.saveLawcorp();
          this.closeAlert()
        },
      callNo : this.closeAlert})
    },

    closeLawInfo(){
      this.mixin_hideDialog('LawInfo');
    },

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectLawCorpList();
    },

    // 법무법인 리스트 조회
    async selectLawCorpList(){
      // 초기화
      this.goLawCorpList = [];
      let sUrl = '/phone-api/lawcorp/selectLawCorpList';
      let postParam = {
        SRCH_LAWCORP_NM : this.SRCH_LAWCORP_NM,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.goLawCorpList = response.DATA;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    selectLawItem(item){
      this.selectedLowCorpId= item.LAWCORP_ID;
      this.selectedLowCorpNm= item.LAWCORP_NM;

      this.lawCorpData = {
        LAWCORP_ID: item.LAWCORP_ID,
        LAWCORP_NM: item.LAWCORP_NM,
      };

      this.selectLawItemList();
    },

    // 법인별 위탁업무 내용 검색
    async selectLawItemList(){

      // 초기화
      this.goLawCorpTrustList = [];
      let sUrl = '/phone-api/lawcorp/selectLawCorpTrustList';
      let postParam = {
        LAWCORP_ID : this.selectedLowCorpId,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.goLawCorpTrustList = response.DATA;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

  },
  mounted() {
    this.selectLawCorpList();
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
    reversedItems2() {
      return this.items2.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>