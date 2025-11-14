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
                  class="pl-form type-middle"
                  placeholder="선택"
                  :items="DROP_CENTER_LIST"
                  v-model="searchParams.CENTER_ID"
                  @change="changeSearchParams"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  :items="mixin_common_code_get(allCodeList, 'USE_WT', '전체')"
                  v-model="searchParams.USE_YN"
                  @change="changeSearchParams"
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
                <v-btn class="pl-btn is-icon is-trans" @click="clickRegBtn">
                  <span class="pl-icon20 circle-plus"></span>
                  등록
                </v-btn>
                <v-btn class="pl-btn is-icon is-trans"
                  @click="clickDeleteBtn">
                  <span class="pl-icon20 trash"></span>
                  삭제
                </v-btn>
              </div>
              <div class="pl-grid-top-utils">
                <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ this.qaTypeList.length }})</em> 건</span>
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="gridHeaders"
                  :DataBodyProp="qaTypeList"
                  FileNameProp="분류유형 목록"
                  SheetNameProp="sheetDown"
                />
              </div>
            </div>
            <!-- grid -->
            <v-data-table
              class="pl-grid is-mt-s is-hover has-control"
              :headers="gridHeaders"
              :items="qaTypeList"
              :item-class="isActiveRow"
              v-model="checkedQaTypeList"
              show-select
              fixed-header
              item-key="ROW_NUM"
              height="calc(-262px + 100vh)"
              hide-default-footer
              disable-pagination
              @click:row="clickRow"
              :loading="loading"
              loading-text="조회중입니다."
              no-data-text="등록된 데이터가 없습니다.">
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
        <!-- detail -->
        <div class="is-col-fix d-flex flex-column" style="width: 40%">
          <div class="pl-card flex-grow-1">
            <h2 class="pl-subtit">분류유형 상세 정보</h2>
            <div class="pl-subdesc">
              <p>분류 유형에 문항이 등록된 경우 삭제할 수 없습니다.</p>
            </div>
            <!-- form -->
            <v-form ref="form" lazy-validation>
              <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    센터
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="qaType.CENTER_ID"
                      :items="DROP_CENTER_LIST"
                      class="pl-form type-middle flex-grow-0"
                      placeholder="선택"
                      disabled
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    코드 ID
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle flex-grow-1"
                      placeholder="코드 ID"
                      :disabled="true"
                      :rules="validateRules.CD_ID"
                      v-model="qaType.CD_ID"
                      @change="changeQaTyCdId"
                      v-byte-counter="60"
                    ></v-text-field>
                    <!-- <v-btn
                      class="pl-btn is-esp flex-grow-0"
                      @click="clickDuplicationCheckBtn">중복 체크</v-btn> -->
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    코드명
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle"
                      placeholder="코드명"
                      :rules="validateRules.CD_NM"
                      v-model="qaType.CD_NM"
                      v-byte-counter="300"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      placeholder="분류유형 설명 입력"
                      v-model="qaType.CD_EXPLN"
                      :spellcheck="false"
                      v-byte-counter="1000"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    정렬 순서
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle flex-grow-0 is-xs"
                      placeholder="정렬순서"
                      v-model="qaType.SORT_ORD"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      :rules="validateRules.SORT_ORD"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    사용 여부
                  </span>
                  <div class="pl-desc">
                    <v-radio-group row class="pl-radio-group"
                      v-model="qaType.USE_YN"
                    >
                      <v-radio
                        v-for="(rad01, index) in mixin_common_code_get(allCodeList, 'USE_WT')"
                        :key="index"
                        :label="rad01.text"
                        :value="rad01.value"
                        class="pl-radio"
                      >
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </div>
            </v-form>
          </div>
          <!-- bottom -->
          <div class="pl-card is-border text-right">
            <v-btn class="pl-btn" @click="clickSaveBtn">저장</v-btn>
          </div>
        </div>
      </div>
    </div>
 </div>
</template>

<script>

export default {
  name: "MENU_QAM_M0100", // 분류유형 관리
  components: {
  },
  data() {
    return {
      // grid
      gridHeaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '60px', sortable: true },
        { text: '센터', value: 'CENTER_NM', align: 'left', width: '120px',sortable: true },
        { text: '코드명', value: 'CD_NM', align: 'left', width: '400px',sortable: true },
        { text: '사용여부', value: 'USE_YN_NM', align: 'center', width: '90px', sortable: true },
        { text: '등록자', value: 'RGTR_NM', align: 'left', width: '110px', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'left', width: '110px', sortable: true },
      ],

      STAT_LIST: [
        { code: 'Y', value: 'blue'},
        { code: 'N', value: 'org'},
      ],


      // detail
      modelCenter: '마이홈센터',
      itemsCenter: ['마이홈센터'],

      // 공통코드
      allCodeList:[],
      sort:[],

      DROP_CENTER_LIST:[],

      // 조회 조건
      searchParams:{
        USE_YN: ""
        , CENTER_ID: ""
      },

      // 분류유형 목록
      qaTypeList:[],

      // 선택 분류유형
      checkedQaTypeList:[],

      // 신규 등록 여부
      isNew: true,

      // 분류유형 상세
      qaType: {
        CD_ID: "",
        CD_NM: "",
        SORT_ORD: "",
        USE_YN: "Y",
        CENTER_ID: "",
        isChecked: false,
      },

      // validate
      validateRules:{
        CD_NM: [
          v => !!v|| '코드명은 필수 입력 항목입니다.',
        ],
        SORT_ORD: [
          v => !!v || '정렬순서는 필수 입력 항목입니다.',
        ]
      },

      selectedRow:{},
      
      loading: false,

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '분류 유형을 저장하시겠습니까?', callYes: this.saveQaType, callNo: this.closeAlert, },
          DELETE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '분류 유형을 삭제하시겠습니까?', callYes: this.deleteQaType, callNo: this.closeAlert, },
        },
        ALERT:{
          CHECK:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '코드 ID에 대해 중복체크를 진행해 주세요.' },
          CHECK_FAIL: { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '중복된 코드 ID가 존재합니다.' },
          CHECK_SUCCESS: { alertDialogToggle: true, iconClass: 'is-done', type: 'default', msg: '사용 가능한 코드 ID 입니다.' },
          CD_ID_NULL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '코드 ID를 입력해주세요.' },
          DEL_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 분류 유형을 선택해주세요..' },
          DEL_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '문항이 등록된 분류 유형은 삭제할 수 없습니다.' },
        },
        TOAST : {
          SAVE_DONE : {  msg: '분류 유형이 저장되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
          DEL_DONE : {  msg: '분류 유형이 삭제되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectQaTypeList();
    },

    // 분류유형 조회
    async selectQaTypeList(){

      // 초기화
      this.checkedQaTypeList = [];
      this.selectedRow = {};
      this.initQaType();

      // let sUrl = '/phone-api/qa/selectQaTypeList';
      let sUrl = '/api/biz/common/select/selectQaTypeList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        USE_YN: this.searchParams.USE_YN
      };
      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlQuestionManageMapper'
        , sn : 'selectQaTypeList'
      } };

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaTypeList = response.DATA;
        response.DATA.map(item=>{
          this.sort.push(item.SORT_ORD)
        })
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 등록버튼 클릭
    clickRegBtn(){
      this.initQaType();
    },

    // 저장버튼 클릭
    clickSaveBtn(){
      // 필수값 확인
      if(!this.validate()) return;
      // 정렬순서 중복 체크
      let temp = this.qaTypeList.filter(row=>{return row.SORT_ORD == this.qaType.SORT_ORD && row.CD_ID != this.qaType.CD_ID});
      if(temp.length > 0) return this.showToastCaution({msg : '중복된 정렬 순서입니다.'});

      // 신규등록 시 중복체크 여부 확인
      // if(!this.qaType.isChecked && this.isNew){
      //   // 중복체크 메세지 안내
      //   this.showAlert(this.MESSAGE.ALERT.CHECK);
      //   return;
      // };

      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 분류유형 저장
    async saveQaType(){

      this.closeAlert();

      let sUrl = '/phone-api/qa/saveQaType';
      let postParam = {
        CD_ID: this.qaType.CD_ID,
        CD_NM: this.qaType.CD_NM,
        CD_EXPLN: this.qaType.CD_EXPLN,
        SORT_ORD: this.qaType.SORT_ORD,
        USE_YN: this.qaType.USE_YN,
        CENTER_ID: this.qaType.CENTER_ID,
        SAVE_TYPE: this.isNew ? "INSERT" : "UPDATE",
        LGN_ID: this.$store.getters['userStore/GE_USER_ROLE'].lgnId,
      };
      let headParam = { head : {} };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);

        // 재조회
        this.selectQaTypeList();

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 중복체크 버튼 클릭
    async clickDuplicationCheckBtn(){
      // 신규 등록인 경우에만 확인
      if(!this.isNew) return;

      // CD_ID 확인
      if(this.mixin_isEmpty(this.qaType.CD_ID)){
        this.showAlert(this.MESSAGE.ALERT.CD_ID_NULL);
        return;
      }

      // let sUrl = '/phone-api/qa/checkDuplicateQaType';
      let sUrl = '/api/biz/common/select/checkDuplicateQaType';

      let postParam = {
        CD_ID: this.qaType.CD_ID,
        CENTER_ID: this.qaType.CENTER_ID,
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlQuestionManageMapper'
        , sn : 'selectQaPlanList'
      } };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        // 조회된 결과 존재 시 중복처리
        this.qaType.isChecked = response.DATA.length > 0 ? false : true;

        if(!this.qaType.isChecked) this.showAlert(this.MESSAGE.ALERT.CHECK_FAIL);
        else this.showAlert(this.MESSAGE.ALERT.CHECK_SUCCESS);

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 삭제버튼 클릭
    clickDeleteBtn(){
      // 삭제 대상 선택 확인
      if(this.checkedQaTypeList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL01);
        return;
      }

      for(let i=0; i<this.checkedQaTypeList.length; i++){
        // 등록된 문항이 존재하는 경우 삭제 불가
        if(this.checkedQaTypeList[i].QSTN_CNT != "0"){
          this.showAlert(this.MESSAGE.ALERT.DEL_FAIL02);
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.DELETE);
    },

    // 분류유형 삭제 처리
    async deleteQaType(){
      this.closeAlert();

      let sUrl = '/phone-api/qa/deleteQaType';
      let postParam = {
        CHECK_LIST: this.checkedQaTypeList.map((row)=> {return {CD_ID: row.CD_ID}}),
        CENTER_ID: this.checkedQaTypeList[0].CENTER_ID,
        LGN_ID: this.$store.getters['userStore/GE_USER_ROLE'].lgnId,
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
        this.selectQaTypeList();

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //필수값 체크
    validate () {
      return this.$refs.form.validate();
    },

    // 코드 ID 변경 이벤트
    changeQaTyCdId(){
      // 신규등록 && 중복체크 완료 후 코드 변경 시 중복체크 여부 false 처리
      if(this.isNew && this.qaType.isChecked){
        this.qaType.isChecked = false;
      }
    },

    // 조회 조건 변경 재조회
    changeSearchParams(){
      this.selectQaTypeList();
    },

    // 상세정보 초기화
    initQaType(){
      // validate 에러 제거
      this.$refs.form.reset();

      this.$nextTick(() => {
        this.isNew = true;

        // 분류유형 상세정보 초기화
        this.qaType.CD_ID = "";
        this.qaType.CD_NM = "";
        this.qaType.CD_EXPLN = "";
        this.qaType.SORT_ORD = "";
        this.qaType.USE_YN = "Y";
        this.qaType.CENTER_ID = this.searchParams.CENTER_ID;
        this.qaType.isChecked = false;

        // this.getCdId();
      });
    },

    clickRow(item){
      this.isNew = false;
      this.selectedRow = item;

      this.qaType.CENTER_ID =  item.CENTER_ID;
      this.qaType.CD_ID = item.CD_ID;
      this.qaType.CD_NM = item.CD_NM;
      this.qaType.SORT_ORD = item.SORT_ORD;
      this.qaType.USE_YN = item.USE_YN;
      this.qaType.CD_EXPLN = item.CD_EXPLN;
      this.qaType.isChecked = false;
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    async getCdId(){
      let sUrl = '/phone-api/qa/getCdId';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
        LGN_ID: this.$store.getters['userStore/GE_USER_ROLE'].lgnId,
      };
      let headParam = {
        head : {
        }
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA) this.qaType.CD_ID = response.DATA[0].CD_ID;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    }
  },
  async mounted() {

    // 공통코드 조회
    let codeList = ['USE_WT'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> { return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    // 분류유형 조회
    this.selectQaTypeList();
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