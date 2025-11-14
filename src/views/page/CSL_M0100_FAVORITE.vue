<template>
  <div style="position: relative">
    <template v-if="propToggle">
      <!-- 토글 버튼 -->
      <v-tooltip content-class="pl-tooltip left" left>
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs" v-on="on"
            class="pl-toggle-table-btn"
            @click="toggleEvt">
            관심지역
          </div>
        </template>
        <span>관심지역 숨기기</span>
      </v-tooltip>
      <!-- tabs -->
      <v-tabs
        v-model="tabs1"
        slider-size="2"
        class="pl-tabs type-subtab is-mt-l">
        <template v-for="(item, index) in tabsList" >
          <v-tab
            v-if="item.title"
            :key="index">
            <v-badge
              :value=item.badge
              color="#0073ce"
              bordered
              offset-x="-1"
              offset-y="9"
              dot
            >
              {{ item.title }}
            </v-badge>
            </v-tab>
        </template>
        <div class="ml-auto pl-btn-wrap">
          <template v-if="tabs1 === 0">
            <v-text-field class="pl-form is-md"
              v-model="SCH_CUST_PHN_NO"
              placeholder="휴대폰번호"
              maxlength="14"
              hide-spin-buttons
              type="text"
              @keyup="setPhoneNo('SCH_CUST_PHN_NO')"
              @keyup.enter="$eventBus.$emit('searchCustPhnNo')"
              oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
            />
            <v-btn
              class="pl-btn is-sm"
              @click="$eventBus.$emit('searchCustPhnNo')">
              조회
            </v-btn>
            <v-btn
              class="pl-btn is-sub is-sm"
              :disabled="this.CUST_INFO.CUST_ID && tabsList[0].items.length > 0?false:true"
              @click="custFavorZoneSndSmsConfirm"
            >관심지역 문자발송
            </v-btn>
            <v-btn
              class="pl-btn is-sub is-sm"
              :disabled="SEL_CUST_FAVOR_LIST.length > 0?false:true"
              @click="custFavorZoneValid('DEL')"
            >삭제
            </v-btn>
            <v-btn
              class="pl-btn is-sub is-sm"
              :disabled="this.CUST_INFO.CUST_ID?false:true"
              @click="custFavorZoneDetail('REG')"
            >등록
            </v-btn>
          </template>
        </div>
      </v-tabs>
      <v-tabs-items v-model="tabs1">
        <v-tab-item key="tab1_1" v-for="(item, index) in tabsList" :key="index">
          <div class="tab-contnets mt-2">
            <component :is="item.content" :items="item.items" :loading="item.loading" @custFavorZoneDetail="custFavorZoneDetail"></component>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <template v-else>
      <!-- 토글 버튼 -->
      <v-tooltip content-class="pl-tooltip right" right>
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs" v-on="on"
            class="pl-toggle-table-btn is-false"
            @click="toggleEvt">
            관심지역
          </div>
        </template>
        <span>관심지역 보이기</span>
      </v-tooltip>
    </template>
    <!-- dialog -->
    <v-dialog
      v-model="dialogFavPlace"
      content-class="dialog-draggable"
      width="450"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="관심지역 등록"
        @hide="mixin_hideDialog('FavPlace')"
        @submit="submitDialog('FavPlace')"
      >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical label-100">
            <div class="pl-form-inline">
              <span class="pl-label">
                지구명 검색
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  v-model="SCH_ALL_CUTT_ZONE"
                  class="pl-form type-middle"
                  :items="CUTT_ZONE_ITEMS"
                  v-on:change="changeCuttZoneSch"
                  placeholder="지구명 검색"
                  clearable
                  no-data-text="결과 없음"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                시/도
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  v-model="SCH_CUTT_ZONE[0]"
                  class="pl-form type-middle"
                  :items="getChildCuttZoneItems(0, '')"
                  item-text = "ZONENAME"
                  item-value = "ZONEID"
                  placeholder="선택"
                  v-on:change="changeCuttZoneItems(0)"
                  no-data-text="결과 없음"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                시군구
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  v-model="SCH_CUTT_ZONE[1]"
                  class="pl-form type-middle"
                  :items="getChildCuttZoneItems(1, SCH_CUTT_ZONE[0])"
                  item-text = "ZONENAME"
                  item-value = "ZONEID"
                  placeholder="선택"
                  v-on:change="changeCuttZoneItems(1)"
                  no-data-text="결과 없음"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                지구명
              </span>
              <div class="pl-desc">
                <v-autocomplete
                  v-model="SCH_CUTT_ZONE[2]"
                  class="pl-form type-middle"
                  :items="getChildCuttZoneItems(2, SCH_CUTT_ZONE[1])"
                  item-text = "ZONENAME"
                  item-value = "ZONEID"
                  placeholder="선택"
                  v-on:change="changeCuttZoneItems(2)"
                  no-data-text="결과 없음"
                />
                <!-- <v-text-field
                  class="pl-form is-search type-middle"
                  placeholder="지구명 입력"
                  @keydown.enter="mixin_testLog('search btn')"
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="mixin_testLog('search btn')"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field> -->
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                유형
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="INTEREST_DIV_CD"
                  :items="mixin_common_code_get(list_common_code, 'IAT', '')"
                  class="pl-form type-middle"
                  placeholder="선택"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                휴대전화
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="CUST_PHN_NO"
                  class="pl-form type-middle"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo(CUST_PHN_NO)"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                  >
                </v-text-field>
              </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('FavPlace')">닫기</v-btn>
          <v-btn class="pl-btn" @click="custFavorZoneValid(INTERESTAREA_ID?'MOD':'REG')">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
// 관심지역
import CSL_M0100_FAVOR_TAB01 from './CSL_M0100_FAVOR_TAB01.vue'
import CSL_M0100_FAVOR_TAB02 from './CSL_M0100_FAVOR_TAB02.vue'
import CSL_M0100_FAVOR_TAB03 from './CSL_M0100_FAVOR_TAB03.vue'

export default {
  name: "CSL_M0100_FAVORITE", //name은 'MENU_' + 파일명 조합
  props: {
    propToggle : {
      type: Boolean,
      default: true
    },
    cuttEditAble : {
      type: Boolean,
      default: false
    },
    CUTT_CN : {
      type : String
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    popData: {
      type: Object,
    },
  },
  components: {
    CSL_M0100_FAVOR_TAB01,
    CSL_M0100_FAVOR_TAB02,
    CSL_M0100_FAVOR_TAB03,
  },
  data() {
    return {
      list_common_code : [],
      common_code : [],

      toggleShow: true,
      // 관심지역
      tabs1: null,
      tabsList: [
        { title: '관심지역', content: 'CSL_M0100_FAVOR_TAB01', items: [], loading: false, badge: false},
        { title: '관심지역 이력', content: 'CSL_M0100_FAVOR_TAB02', items: [], loading: false, badge: false},
        { title: '관심지역 발송이력', content: 'CSL_M0100_FAVOR_TAB03', items: [], loading: false, badge: false},
      ],
      dialogFavPlace: false,

      CUST_INFO : {}, //고객정보

      SCH_CUTT_ZONE : new Array(3), //상담지역
      SCH_ALL_CUTT_ZONE : '', //상담지역(검색)

      CUTT_ORG_ITEMS : [],
      CUTT_ZONE_ITEMS : [],

      INTERESTAREA_ID : '', //관심지역 ID
      INTEREST_DIV_CD : '', //관심지역 유형
      CUST_PHN_NO : '', //관심지역 고객 전화번호

      SEL_CUST_FAVOR_INFO : {}, //선택된 관심지역 정보
      SEL_CUST_FAVOR_LIST : [], //삭제할 관심지역

      SCH_CUST_PHN_NO : '', //고객 전화번호 조회
    }
  },
  watch: {
    CUST_INFO() {
      if(this.CUST_INFO.CUST_ID){
        this.SCH_CUST_PHN_NO = '';
        this.getFavorCnt();
        this.getFavorSmsHistCnt();
        this.tabs1 = 0;
        this.callTabList('custFavorList'); //관심지역 목록
      }
    },
    tabs1() {
      if(this.SCH_CUST_PHN_NO || this.CUST_INFO.CUST_ID){
        if(this.tabs1 === 0){
          this.callTabList('custFavorList'); //관심지역 목록
        }else if(this.tabs1 === 1){
          this.callTabList('custFavorHistList'); //관심지역 이력 목록
        }else if(this.tabs1 === 2){
          this.callTabList('custFavorSndHistList'); //관심지역 발송 이력 목록
        }
      }
    },
    CUTT_CN() {
      this.$emit('addCuttCn', this.CUTT_CN);
    },
    RESET_ABLE() {
      // if(this.RESET_ABLE){
        this.CUST_INFO = {};
        this.tabs1 = 0;
        this.tabsList.forEach((tab, idx) => {
          tab.items = [];
          tab.badge = false;
        });
      // }
    },
    CUST_PHN_NO(){
      console.log('CUST_PHN_NO', this.CUST_PHN_NO);
      console.log('CUST_PHN_NO', this.CUST_PHN_NO.substring(0,3));
    }
  },
  computed: {
  },
  beforeDestroy(){
    this.$eventBus.$off("setFavorCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setSelCustFavorList"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setSelCustFavorInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("searchCustPhnNo"); //eventBus 중복방지를 위해 off
  },
  mounted() {
  },
  async created() {
    if(this.popData) this.CUST_INFO = this.popData;

    //공통코드설정
    let codeName = ['IAT']; //관심지역 유형
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    //고객정보
    this.$eventBus.$on("setFavorCustInfo", (CUST_INFO) => {
      this.CUST_INFO = CUST_INFO;
    });

    //관심지역 삭제 선택 row
    this.$eventBus.$on("setSelCustFavorList", (SEL_CUST_FAVOR_LIST) => {
      this.SEL_CUST_FAVOR_LIST = SEL_CUST_FAVOR_LIST;
    });

    //선택된 관심지역 상세 정보
    this.$eventBus.$on("setSelCustFavorInfo", (SEL_CUST_FAVOR_INFO) => {
      this.SEL_CUST_FAVOR_INFO = SEL_CUST_FAVOR_INFO;
    });

    this.$eventBus.$on("searchCustPhnNo", () => {
      this.getFavorCnt();
      this.getFavorSmsHistCnt();
      this.callTabList('custFavorList'); //관심지역 목록
    });

    this.getCuttZoneList();//관심 지역
  },
  methods: {
    toggleEvt(){
      this.toggleShow = !this.toggleShow
      this.$emit("toggleEvt", this.toggleShow );
    },

    async getFavorCnt() {
      let sUrl = '/api/biz/common/select/selectCustFavorCnt';
      let postParam = {
        MOBILE : this.SCH_CUST_PHN_NO?this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, ''):this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '')
      }

      let headParam = {
        head : {
          ns : 'lhcs.cust.dao.CustMapper'
          , sn : 'selectCustFavorCnt'
        }
      }
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          this.tabsList.forEach((tab, idx) => {
            if(idx === 0){
              if(Number(response.DATA[0].INTERESTAREA_CNT) + Number(response.DATA[0].INTERESTAREA_CCT_CNT) > 0){
                tab.badge = true;
              }else{
                tab.badge = false;
              }
            }else if(idx === 1){
              if(Number(response.DATA[0].INTERESTAREA_HST_CNT) > 0){
                tab.badge = true;
              }else{
                tab.badge = false;
              }
            // }else if(idx === 2){
            //   if(Number(response.DATA[0].INTERESTAREA_SMS_HST_CNT) > 0){
            //     tab.badge = true;
            //   }else{
            //     tab.badge = false;
            //   }
            }
          });
        }
      }
    },

    async getFavorSmsHistCnt() {
      let sUrl = '/api/cust/custFavorSndHistCnt';
      let postParam = {
        MOBILE : this.SCH_CUST_PHN_NO?this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, ''):this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '')
      }

      let response  = await this.common_postCall(sUrl, postParam, {head : {}});

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          this.tabsList.forEach((tab, idx) => {
            if(idx === 2){
              if(Number(response.DATA[0].CNT) > 0){
                tab.badge = true;
              }else{
                tab.badge = false;
              }
            }
          });
        }
      }
    },

    async callTabList(sGb) {
      let sUrl = '/api/biz/common/select/'+sGb;
      let postParam = {
        MOBILE : this.SCH_CUST_PHN_NO?this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, ''):this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '')
      }

      let headParam = {
        head : {
          ns : 'lhcs.cust.dao.CustMapper'
          , sn : sGb
        }
      }

      if(sGb === 'custFavorSndHistList') { //관심지역 발송이력인 경우
        sUrl = '/api/biz/common/select/custFavorSndHistList';
        headParam = {head : {
          ns: 'lhcs.cust.dao.CustMapper'
        }};
      }

      this.tabsList[this.tabs1].loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        response.DATA.map(item => {
          item.INTEREST_AREA = item.SIDO_NM + " > " + item.SIGUNGU_NM + " > " + item.JIGU_NM;
          item.PROC_RESULT_NM = (item.PROC_RESULT == "0" || item.PROC_RESULT == "") ? "대기" : item.PROC_RESULT == "1" ? "성공" : item.PROC_RESULT == "5" ? "기타" : "실패";
        })
        this.tabsList[this.tabs1].items = response.DATA;
      }
      this.tabsList[this.tabs1].loading = false;
    },

    //관심 지역 목록 조회
    async getCuttZoneList() {
      let sUrl = '/api/biz/common/select/cuttZoneList';
      let postParam = {}

      if(this.$store.getters['userStore/GE_USER_ROLE'].company.CD != '-1'){
        postParam.SCH_CUSTCO_ID = this.$store.getters['userStore/GE_USER_ROLE'].company.CD;
      }

      let headParam = {
        head : {
          ns : 'lhcs.phone.cutt.dao.PhoneCuttMapper'
          , sn : 'cuttZoneList'
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let arrData = [];
        response.DATA.forEach((item, idx) => {
          if(item.FULL_ZONEID.split(',')[1] !== '99998' && item.FULL_ZONEID.split(',')[1] !== '99999' && item.FULL_ZONE_PATH.split('>')[2] !== '선택안함'){
            arrData.push(item);
          }
        });

        this.CUTT_ORG_ITEMS = arrData;

        let arrCuttZoneItems = await this.mixin_makeOrgTreeData(response.DATA);

        if(arrCuttZoneItems) this.cuttZoneIntgeSchData(arrCuttZoneItems); //상담 유형 검색 데이터 Set
      }
    },

    //관심 지역 검색 Data Set
    cuttZoneIntgeSchData(cuttZone) {
      if(cuttZone){
        cuttZone.forEach(item => {
          if(item.FULL_ZONEID.split(',')[1] !== '99998' && item.FULL_ZONEID.split(',')[1] !== '99999' && item.FULL_ZONE_PATH.split('>')[2] !== '선택안함'){
            if (item.FULL_ZONEID.split(',').length === 4) {
              let reFullPath = '';
              item.FULL_ZONE_PATH.split('>').forEach((txt, idx) => {if(idx>0) reFullPath += ((idx>1)?'>':'')+txt});
              let reFullVal = '';
              item.FULL_ZONEID.split(',').forEach((val, idx) => {if(idx>0) reFullVal += ((idx>1)?',':'')+val});
              this.CUTT_ZONE_ITEMS.push({ value: reFullVal, text: reFullPath, LVL: item.LVL });
            }
            if (item.children) {
              this.cuttZoneIntgeSchData(item.children);
            }
          }
        });
      }
    },

    //관심 지역 하위 item 가져오기
    getChildCuttZoneItems(idx, parentItem) {
      let arrCuttZone = [];

      if(idx === 0){
        if(this.CUTT_ORG_ITEMS.length > 0){
          parentItem = this.CUTT_ORG_ITEMS[0].ZONEID;
          this.CUTT_ORG_ITEMS.map(function(row){
            if(row.PARENTID === parentItem)
              if(row) arrCuttZone.push(row);
          });
        }
      }else{
        if(parentItem){
          this.CUTT_ORG_ITEMS.map(function(row){
            if(row.PARENTID === parentItem)
              if(row) arrCuttZone.push(row);
          });
        }
      }

      return arrCuttZone || [];
    },

    //관심 지역 변경 이벤트
    changeCuttZoneItems(idx){
      this.SCH_CUTT_ZONE.forEach((zone, seq) => {
        if(seq > idx) this.SCH_CUTT_ZONE[seq] = ''; //초기화
      });

      if(idx === 1){
        this.CUTT_ZONE_ITEMS.forEach((zone, seq) => {
          if(zone.value.split(',')[idx] === this.SCH_CUTT_ZONE[idx]){
            if(zone.text.split('>')[idx+1] === '선택안함'){
              if(zone.value.split(',').length === 3){
                this.SCH_ALL_CUTT_ZONE = zone.value;
              }
            }
          }
        });
      }else{
        let selCuttZone = '';
        for(let k=0; k<this.SCH_CUTT_ZONE.length; k++){
          if(this.SCH_CUTT_ZONE[k]) selCuttZone += (selCuttZone?',':'') + this.SCH_CUTT_ZONE[k];
        }

        this.SCH_ALL_CUTT_ZONE = selCuttZone;
      }

      this.changeCuttZoneSch();
    },

    //관심 지역 검색 데이터 변경 이벤트
    changeCuttZoneSch(){
      this.SCH_CUTT_ZONE.forEach((zone, idx) => {
        this.SCH_CUTT_ZONE[idx] = ''; //초기화
      });

      if(this.SCH_ALL_CUTT_ZONE){
        this.SCH_ALL_CUTT_ZONE.split(',').forEach((cuttZone, idx) => {
          for(let k=0; k<this.SCH_CUTT_ZONE.length; k++){
            if(k === idx){
              this.SCH_CUTT_ZONE[k] = cuttZone;
            }
          }
        });
      }
    },

    //관심지역 저장, 수정, 삭제
    custFavorZoneValid(sStat) {
      let sMsg = '선택한 관심지역을 삭제 하시겠습니까?';
      if(sStat === 'REG' || sStat === 'MOD'){
        if(sStat === 'REG') sMsg = '저장 하시겠습니까?';
        else sMsg = '수정 하시겠습니까?';

        if(this.mixin_isEmpty(this.SCH_CUTT_ZONE[2]) || this.mixin_isEmpty(this.INTEREST_DIV_CD)
            || this.mixin_isEmpty(this.CUST_PHN_NO.replace(/[^0-9]/g, '')) || this.CUST_PHN_NO.substring(0,3) !== '010'){
          if(this.mixin_isEmpty(this.SCH_CUTT_ZONE[2])){
            this.showAlert({alertDialogToggle: true, msg: '지구명까지 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }
          if(this.mixin_isEmpty(this.INTEREST_DIV_CD)){
            this.showAlert({alertDialogToggle: true, msg: '유형을 선택해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }
          if(this.mixin_isEmpty(this.CUST_PHN_NO.replace(/[^0-9]/g, ''))){
            this.showAlert({alertDialogToggle: true, msg: '휴대전화 번호를 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
            return;
          }
          if(this.CUST_PHN_NO.substring(0,3) !== '010'){
            return this.showAlert({alertDialogToggle: true, msg: '유효한 휴대전화 번호를 입력해 주세요.', iconClass: 'is-caution', type: 'default'});
          }

        }

      }else if(sStat === 'DEL'){
        if(this.mixin_isEmpty(this.SEL_CUST_FAVOR_LIST)){
          this.showAlert({alertDialogToggle: true, msg: '삭제할 관심지역을 선택해 주세오.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }

      this.showAlert({
          alertDialogToggle: true
          , msg: sMsg
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.custFavorZoneProc();
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    //등록, 수정, 삭제 처리
    async custFavorZoneProc(){
      let sUrl = '/api/cust/custFavorZoneProc';
      let postParam = {
        CUST_NO : this.CUST_INFO.CUST_ID
        , CUST_NM : this.CUST_INFO.CUST_NM
        , INTERESTAREA_ID : this.INTERESTAREA_ID
        , SIDO_ID : this.SCH_CUTT_ZONE[0]
        , SIGUNGU_ID : this.SCH_CUTT_ZONE[1]
        , JIGU_ID : this.SCH_CUTT_ZONE[2]
        , INTEREST_DIV_CD : this.INTEREST_DIV_CD
        , MOBILE : this.CUST_PHN_NO.replace(/[^0-9]/g, '')
        , USER_TEAM_CD : this.$store.getters['userStore/GE_USER_ROLE'].CENTER_DEPT_ID
      }

      if(this.SEL_CUST_FAVOR_LIST.length > 0) postParam.SEL_CUST_FAVOR_LIST = JSON.stringify(this.SEL_CUST_FAVOR_LIST); //삭제

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.callTabList('custFavorList'); //관심지역 목록

        //등록 수정일 경우 등록폼 초기화
        if(this.SEL_CUST_FAVOR_LIST.length === 0){
          if(this.INTERESTAREA_ID){ //수정
            let sModMsg = '관심지역 알리미 서비스 수정 ('+ this.mixin_setPhoneNo(this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, "")) +' > '+ this.mixin_setPhoneNo(this.CUST_PHN_NO.replace(/[^0-9]/g, '')) +')';
            if(this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, "") !== this.CUST_PHN_NO.replace(/[^0-9]/g, '')){
              if(this.CUTT_CN.indexOf(sModMsg) < 0 && this.cuttEditAble){
                this.CUTT_CN = this.CUTT_CN + '\n' + sModMsg;
              }
            }
          }else{ //등록
            let sRegMsg = '관심지역 알리미 서비스 등록 ('+ this.mixin_setPhoneNo(this.CUST_PHN_NO.replace(/[^0-9]/g, '')) +')';
            if(this.CUTT_CN.indexOf(sRegMsg) < 0 && this.cuttEditAble){
              this.CUTT_CN = this.CUTT_CN + '\n' + sRegMsg;
            }
          }

          this.SCH_CUTT_ZONE.forEach((zone, idx) => {
            this.SCH_CUTT_ZONE[idx] = '';
          });
          this.SCH_ALL_CUTT_ZONE = '';
          this.INTERESTAREA_ID = '';
          this.INTEREST_DIV_CD = '';
          this.CUST_PHN_NO = this.mixin_setPhoneNo(this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, ""));

          this.mixin_hideDialog('FavPlace');
        }

        //관심지역 목록 선택 초기화
        this.$eventBus.$emit('inItSelCustFavorList');

        this.$store.commit("alertStore/hideAlert");
      }else{
        if(response.HEADER.ERROR_CODE === -1){
          this.showAlert({alertDialogToggle: true, msg: '관심지역은 13개를 초과하여 등록 할 수 없습니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }else if(response.HEADER.ERROR_CODE === -2){
          this.showAlert({alertDialogToggle: true, msg: '토지 유형은 최대 10건 까지만 등록이 가능 합니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }else if(response.HEADER.ERROR_CODE === -3){
          this.showAlert({alertDialogToggle: true, msg: '분양+임대+상가 조합하여 최대 3건 까지만 등록이 가능 합니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }

        if(response.HEADER.ERROR_CODE > 0){
          this.showAlert({alertDialogToggle: true, msg: '이미 등록되어있는 데이터 입니다.', iconClass: 'is-caution', type: 'default'});
          return;
        }
      }
    },

    //전화번호 하이픈 추가
    setPhoneNo(val){
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.CUST_PHN_NO = res;
    },

    //관심지역 등록 수정 폼
    custFavorZoneDetail(sStat) {
      if(sStat === 'REG'){ //등록인 경우
        this.SCH_CUTT_ZONE.forEach((zone, idx) => {
          this.SCH_CUTT_ZONE[idx] = '';
        });
        this.SCH_ALL_CUTT_ZONE = '';
        this.INTERESTAREA_ID = '';
        this.INTEREST_DIV_CD = '';
        this.CUST_PHN_NO = this.mixin_setPhoneNo(this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, ""));
      }else{ //수정인 경우
        this.SCH_CUTT_ZONE[0] = this.SEL_CUST_FAVOR_INFO.SIDO_ID;
        this.SCH_CUTT_ZONE[1] = this.SEL_CUST_FAVOR_INFO.SIGUNGU_ID;
        this.SCH_CUTT_ZONE[2] = this.SEL_CUST_FAVOR_INFO.JIGU_ID;
        this.SCH_ALL_CUTT_ZONE = this.SEL_CUST_FAVOR_INFO.SIDO_ID+','+this.SEL_CUST_FAVOR_INFO.SIGUNGU_ID+','+this.SEL_CUST_FAVOR_INFO.JIGU_ID;

        this.INTERESTAREA_ID = this.SEL_CUST_FAVOR_INFO.INTERESTAREA_ID;
        this.INTEREST_DIV_CD = this.SEL_CUST_FAVOR_INFO.INTEREST_DIV_CD;
        this.CUST_PHN_NO = this.mixin_setPhoneNo(this.SEL_CUST_FAVOR_INFO.MOBILE.replace(/[^0-9]/g, ""));
      }

      this.mixin_showDialog('FavPlace');
    },

    custFavorZoneSndSmsConfirm(){
      this.showAlert({
          alertDialogToggle: true
          , msg: '오늘 등록된 관심지역을 문자발송 하시겠습니까?'
          , iconClass: 'is-info'
          , type: 'confirm'
          , callYes: () => {
            this.custFavorZoneSndSms();
          }
          , callNo: () => {
            this.$store.commit("alertStore/hideAlert");
          }
      });
    },

    //관심지역 문자발송
    async custFavorZoneSndSms() {
      let currentDate = await this.mixin_getSvrDate("YYYYMMDD");

      let arrTodayFavorZone = [];
      let sms_cntnt_txt = '';
      let iCnt = 0;
      let SIDO_ID = '';
      let SIGUNGU_ID = '';
      let JIGU_ID = '';
      let INTEREST_DIV_CD = '';
      if(this.tabsList[0].items.length > 0){
        sms_cntnt_txt += '[';
        this.tabsList[0].items.forEach((data, idx) => {
          if(currentDate === data.UPD_DT.substr(0, 8)){
            if(iCnt > 0){
              sms_cntnt_txt += ' / ';
            }else {
              SIDO_ID = data.SIDO_ID;
              SIGUNGU_ID = data.SIGUNGU_ID;
              JIGU_ID = data.JIGU_ID;
              INTEREST_DIV_CD = data.INTEREST_DIV_CD;
            }
            sms_cntnt_txt += data.SIDO_NM + ' ' +data.SIGUNGU_NM + ((!!data.JIGU_NM && data.JIGU_NM !== '선택안함') ? (' ' + data.JIGU_NM) : '') + ' - ' + data.INTEREST_DIV_CD_NM;

            arrTodayFavorZone.push(data);
            iCnt++;
          }
        });
        sms_cntnt_txt += ']';
      }

      if(arrTodayFavorZone.length === 0){
        this.showAlert({alertDialogToggle: true, msg: '오늘 등록된 관심지역이 없습니다.', iconClass: 'is-caution', type: 'default'});
        return;
      }else{
        let sUrl = '/api/common/sendSms';
        let postParam = {
          CMD : 'sendSmsIntereatArea'
          , CUST_ID : this.CUST_INFO.CUST_ID
          , MOBILE : this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, '')
          , DSPTCH_NO : this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO //발신번호
          , USER_NM : this.$store.getters['userStore/GE_USER_ROLE'].userName //발신자명
          , TODAY_CUST_FAVOR_LIST : JSON.stringify(arrTodayFavorZone) //오늘 등록된 관심지역 전체
          , SIDO_ID : SIDO_ID
          , SIGUNGU_ID : SIGUNGU_ID
          , JIGU_ID : JIGU_ID
          , INTEREST_DIV_CD : INTEREST_DIV_CD
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.showAlert({alertDialogToggle: true, msg: '전송되었습니다.<br>' + sms_cntnt_txt, iconClass: 'is-info', type: 'default'});
          return;
        }
      }
    },

    //전화번호 하이픈 추가
    setPhoneNo(sTarget){
      let res = this.mixin_setPhoneNo(this[sTarget].replace(/[^0-9]/g, ""));
      this[sTarget] = res;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>