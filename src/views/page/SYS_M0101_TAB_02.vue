<template>
  <div class="pl-cols fill-height">
    <!-- left -->
    <div class="is-col-fix is-vrt" style="width: 70%">
      <!-- sub top -->
      <div class="pl-form-inline-wrap pl-card-body py-3">
        <div class="pl-form-inline">
          <span class="pl-label">
            근태 유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items= "mixin_common_code_get(this.COMM_CD_DROP_LIST, 'ATDC_TP','전체')"
              v-model="SRCH_ATDC_TY"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            사용 여부
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USE_WT','전체')"
              v-model="SRCH_USE_YN"
            ></v-select>
          </div>
        </div>
        <div>
          <v-btn
            class="pl-btn is-icon"
            @click="srch_atdc"
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
          <div class="pl-grid-top-left">
            <v-btn
              class="pl-btn is-icon is-trans"
              @click="click_strg()"
            >
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-trans"
              @click="clickDel()"
            >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          v-model="CHC_ATDC_LIST"
          class="pl-grid is-mt-s is-hover has-control"
          :headers="headers"
          :items="reversedItems"
          :item-class="isActiveRow"
          show-select
          fixed-header
          item-key="WKATTD_ARTCL_CD"
          height="calc(-318px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          @click:row="select_atdc"
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- 사용 여부 -->
          <template v-slot:item.USE_YN="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.USE_YN, 'STAT_LIST')}`"
              style="width: 60px;"
              >
              {{ item.USE_YN === 'Y' ? '사용' : '사용안함 '}}
            </span>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- detail -->
    <div class="d-flex flex-column">
      <div class="pl-card flex-grow-1 pl-scroll-body">
        <div class="pl-subtit">근태코드 상세 정보 </div>
        <div class="pl-subdesc">
          <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오.</p>
        </div>
        <!-- form -->
        <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
          <div class="pl-form-inline">
            <span class="pl-label">
              근태 유형
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle flex-grow-0"
                placeholder="선택"
                :items="mixin_common_code_get(this.COMM_CD_DROP_LIST, 'ATDC_TP')"
                v-model="ATDC_TY"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              근태 코드
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="코드 입력"
                v-model="ATDC_CD"
              ></v-text-field>
              <v-btn
                class="pl-btn is-esp flex-grow-0"
                @click="atdcDpcnCheck"
              >중복체크</v-btn>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              근태 코드명
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="코드명 입력"
                v-model="ATDC_NM"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              코드 약어
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="약어 입력"
                v-model="ATDC_SHORT_NM"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              근무 인정율
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="근무 인정율"
                v-model="RFLT_RT"
                @input="validateInput"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              정렬 순서
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="SORT_ORD"
                class="pl-form type-middle flex-grow-1"
                placeholder=""
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              코드 설명
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                placeholder="설명 입력 "
                height="200"
                v-model="ATDC_EXPLN"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              사용 여부
            </span>
            <div class="pl-desc">
              <v-select
                :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USE_WT')"
                v-model="USE_YN"
                class="pl-form type-middle flex-grow-0"
                placeholder="선택"
              ></v-select>
            </div>
          </div>
        </div>
      </div>
        <!-- bottom -->
        <div class="pl-card is-border text-right">
          <v-btn class="pl-btn" @click="strg_atdc" :disabled="REG_MDFCN == 'MDFCN' ? (SEL_ATDC.WKATTD_ARTCL_CD == ATDC_CD ? false : DPCN_CHK) : DPCN_CHK">저장</v-btn>
        </div>
    </div>

  </div>
</template>

<script>

import { nextTick } from 'vue';

export default {
  name: 'SYS_M0101_TAB_02', //근태 코드
  components: {
  },
  data() {
    return {
      COMM_CD_USE_LIST:[],                //사용할 공통코드 리스트 ==> 변수명 이미 사용중이기 떄문에 변경해주었음 (COMM_CD_LIST->COMM_CD_USE_LIST)
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

      ATDC_TY_LIST:[],                    //근태유형 리스트
      SRCH_ATDC_TY: '',                   //검색 근태유형
      SRCH_USE_YN: '',                    //검색 사용여부

      CHC_ATDC_LIST:[],                   //근태유형 다중선택

      ATDC_TY:'',                         //근태유형
      ATDC_CD:'',                         //근태코드
      ATDC_NM:'',                         //근태코드명
      ATDC_EXPLN:'',                      //코드설명
      SORT_ORD:'',                        //정렬순서
      USE_YN:'Y',                         //사용여부
      ATDC_SHORT_NM:'',                   //코드약어
      RFLT_RT:'',                         //근무 인정율

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 50,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '근태 유형', value: 'WKATTD_ARTCL_CLSF_NM', align: 'left', width: '8%',sortable: true },
        { text: '근태 코드', value: 'WKATTD_ARTCL_CD', align: 'left', width: '14%',sortable: false },
        { text: '근태 코드명', value: 'WKATTD_ARTCL_NM', align: 'left', width: '', sortable: false },
        { text: '코드약어', value: 'WKATTD_ARTCL_SHORT_NM', align: 'left', width: '12%',sortable: true },
        { text: '근무 인정율', value: 'WKATTD_RFLT_RT', align: 'left', width: '10%',sortable: true },
        { text: '순서', value: 'SORT_ORD', align: 'center', width: '7%', sortable: false },
        { text: '사용 여부', value: 'USE_YN', align: 'center', width: '8%', sortable: false },
        { text: '등록자', value: 'MDFR_NM', align: 'left', width: '10%', sortable: false },
        { text: '등록일', value: 'NEW_MDFCN_DT', align: 'left', width: '8%', sortable: false },
      ],
      items: [
      ],
      // 상태 컬러
      STAT_LIST: [
        { code: '사용', value: 'blue'},
        { code: '사용안함', value: 'yellow'},
      ],

      // detail
      SEL_ATDC:{},          //선택근태코드

      REG_MDFCN:'',         //등록 또는수정 여부
      DPCN_CHK : true,      //중복체크여부

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          DEL : { alertDialogToggle: true, msg: '정말 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.del_yes, callNo: this.closeMsg, }
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '공통코드가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , DEL_SUCCESS : { alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-done', type: 'default' }
          , SORT_ORD_ERR : {alertDialogToggle: true, msg: '정렬순서는 <br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
          , DUPL_CD : {alertDialogToggle: true, msg: '상위 분류코드와 다른 분류코드를 입력해주세요', iconClass: 'is-info', type: 'default'}
          , REG_Y : {alertDialogToggle: true, msg: '사용가능한 코드입니다', iconClass: 'is-done', type: 'default'}
          , REG_N : {alertDialogToggle: true, msg: '이미 사용중인 코드입니다', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , DEL_ONLY_ONE : { alertDialogToggle: true, msg: '하나의 코드만 삭제할 수 있습니다', iconClass: 'is-caution', type: 'default' }
        },
        TOAST : {
          REG_SUCCESS: {  msg: '근태코드가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          , DEL_SUCCESS: {  msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },
    }
  },
  methods: {
    //근태코드 조회
    async srch_atdc(){
      let sUrl = '/api/biz/common/select';
      let postParam = {
        SRCH_ATDC_TY : this.SRCH_ATDC_TY,
        SRCH_USE_YN : this.SRCH_USE_YN,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : 'srchAtdc'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.items = [];
        for(let k in resData.DATA){
          resData.DATA[k].NEW_MDFCN_DT = this.mixin_convertDate(resData.DATA[k].MDFCN_DT, 'yyyy-MM-dd');
        }
        this.items = resData.DATA;
      }
    },

    //근태코드 등록버튼 클릭
    click_strg(){
      this.SEL_ATDC = {ATDC_CD: ''};
      this.ATDC_TY = this.ATDC_TY_LIST[0].value;
      this.ATDC_CD = '';
      this.ATDC_NM = '';
      this.ATDC_EXPLN = '';
      this.SORT_ORD = '';
      this.USE_YN = 'Y';
      this.ATDC_SHORT_NM = '';
      this.RFLT_RT = '';
      this.REG_MDFCN = '';
      this.DPCN_CHK = true;
    },

    //근태코드 중복체크
    async atdcDpcnCheck(){
      let sUrl = '/api/biz/common/select';
      let postParam = {
        ATDC_CD : this.ATDC_CD,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : 'atdcDpcnCheck'
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        //중복이 없을때
        if(resData.DATA[0].CNT == '0'){
          this.showAlert(this.MESSAGE.ALERT.REG_Y);
          this.DPCN_CHK = false;
        } else {
          this.showAlert(this.MESSAGE.ALERT.REG_N);
        }
      }
    },

    //근태코드 클릭
    select_atdc(item){
      this.SEL_ATDC = item;
      this.ATDC_TY = item.WKATTD_ARTCL_CLSF_CD;
      this.ATDC_CD = item.WKATTD_ARTCL_CD;
      this.ATDC_NM = item.WKATTD_ARTCL_NM;
      this.ATDC_EXPLN = item.EXPLN;
      this.SORT_ORD = item.SORT_ORD;
      this.USE_YN = item.USE_YN;
      this.ATDC_SHORT_NM = item.WKATTD_ARTCL_SHORT_NM;
      this.RFLT_RT = item.WKATTD_RFLT_RT;
      this.REG_MDFCN = 'MDFCN';
      this.DPCN_CHK = true;
    },

    //row클릭 색상변경
    isActiveRow(item){
      return item.WKATTD_ARTCL_CD== this.SEL_ATDC.WKATTD_ARTCL_CD? 'active':'';
    },

    //근대코드 등록,수정
    async strg_atdc(){
      let sUrl = this.SEL_ATDC.ATDC_CD == '' ? '/api/biz/common/insert' : '/api/biz/common/update';
      let postParam = {
        ATDC_TY : this.ATDC_TY,
        ATDC_CD : this.ATDC_CD,
        ATDC_NM : this.ATDC_NM,
        ATDC_EXPLN : this.ATDC_EXPLN,
        SORT_ORD : this.SORT_ORD,
        USE_YN : this.USE_YN,
        ATDC_SHORT_NM: this.ATDC_SHORT_NM,
        RFLT_RT: this.RFLT_RT,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : this.SEL_ATDC.ATDC_CD == '' ? 'insertAtdc' : 'updateAtdc'
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS); //등록완료 알림창
        //리스트 재조회
        this.srch_atdc();
      }
    },

    //삭제버튼 클릭
    clickDel(){
      if(this.CHC_ATDC_LIST.length > 1){
        this.showAlert(this.MESSAGE.ERROR.DEL_ONLY_ONE)
      } else if(this.CHC_ATDC_LIST.length == 1) {
        this.showAlert(this.MESSAGE.CONFIRM.DEL)
      }
    },

    //삭제확인 클릭
    async del_yes(){
      let sUrl = '/api/biz/common/update';
      let postParam = {
        ATDC_CD : this.CHC_ATDC_LIST[0].WKATTD_ARTCL_CD,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : 'deleteAtdc'
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS); //등록완료 알림창
        //리스트 재조회
        this.srch_atdc();
        this.closeMsg();
      }
    },

    //삭제취소
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //근무 인정율 숫자+소수점 셋째자리까지
    validateInput(value){
      let regex = /^\d*\.?\d{0,3}$/;
      // 화면 업데이트 강제
      nextTick(() => {
        // 추가적인 로직이 필요할 경우 여기서 처리
        if (value && !regex.test(value)) {
          // 유효하지 않은 경우 마지막 문자를 제거
          this.RFLT_RT = value.slice(0, -1);
        } else {
          this.RFLT_RT = value
        }
      });
    }
  },
  mounted() {
  },
  async created() {
    //공통코드 목록 => 사용할 공통코드 리스트에 넣기
    this.COMM_CD_USE_LIST = [
      "USE_WT"      //사용여부
      , "ATDC_TP"     //코드유형
    ];
    //공통코드별 드롭박스 만들기
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_USE_LIST);

    this.ATDC_TY_LIST = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'ATDC_TP');
    this.ATDC_TY = this.ATDC_TY_LIST[0].value;

    this.srch_atdc();
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    //근무 인정율 숫자+소수점 셋째자리까지
    // RFLT_RT(oldValue,newValue){
    //   let regex = /^\d*\.?\d{0,3}$/;
    //   if (newValue && !regex.test(newValue)) {
    //     // 유효하지 않은 경우 마지막 문자를 제거
    //     this.RFLT_RT = newValue.slice(0, -1);
    //   } else {
    //     this.RFLT_RT = newValue
    //   }
    // }
  },
};
</script>

<style lang="scss" scoped>

</style>