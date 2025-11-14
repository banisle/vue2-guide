<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                센터
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  v-model="searchParams.CUSTCO_ID"
                  :items="DROP_CENTER_LIST"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                고용형태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  :items="mixin_common_code_get(allCodeList, 'WORK_TP', '전체')"
                  v-model="searchParams.EPLMT_CD"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
              @click="selectEvlGrdList()" >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class=" pl-cols fill-height">
        <!-- 그리드 -->
        <div class="is-vrt pl-card-body">
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
              <v-btn class="pl-btn is-icon is-trans" @click="initEvlGrd">
                <span class="pl-icon20 circle-plus"></span>
                등록
              </v-btn>
              <v-btn class="pl-btn is-icon is-trans" @click="deleteItems">
                <span class="pl-icon20 trash"></span>
                삭제
              </v-btn>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ evlCrtrGrdList.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers"
                  :DataBodyProp="evlCrtrGrdList"
                  :FileNameProp="fileName"
                  SheetNameProp="등급관리 설정"
                />
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control is-mt-s"
            :headers="headers"
            :items="evlCrtrGrdList"
            v-model="checkedGrdList"
            :item-class="isActiveRow"
            show-select
            single-select
            fixed-header
            @click:row="showDetail"
            item-key="ROW_NUM"
            height="calc(-288px + 100vh)"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            >
            <template v-slot:item.AMT="{ item }">
              <span>{{ mixin_convertNumToComma(item.AMT) }}</span>
            </template>

          </v-data-table>
        </div>
        <!-- detail -->
        <div class="is-col-fix d-flex flex-column" style="width: 30%">
          <v-form ref="form">
            <div class="pl-card pl-scroll-body" style="height: calc(100vh - 258px);">
              <div class="pl-subtit">평가 등급 상세정보</div>
              <div class="pl-subdesc">
                <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭 하십시오.</p>
              </div>
              <!-- form -->
              <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    센터
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      :items="DROP_CENTER_LIST"
                      v-model="evlCrtrGrdItem.CUSTCO_ID"
                      placeholder="선택"
                      :disabled="editType === 'U'"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    고용형태
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      :items="mixin_common_code_get(allCodeList, 'WORK_TP', '')"
                      v-model="evlCrtrGrdItem.EPLMT_CD"
                      placeholder="선택"
                      :disabled="editType === 'U'"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    등급
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      :items="mixin_common_code_get(allCodeList, 'PERFORM_LV', '')"
                      v-model="evlCrtrGrdItem.GRD_CD"
                      placeholder="선택"
                      :disabled="editType === 'U'"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    직급
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      :items="mixin_common_code_get(allCodeList, 'T207', '')"
                      v-model="evlCrtrGrdItem.JBGD_CD"
                      placeholder="선택"
                      :disabled="editType === 'U'"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    수당
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form flex-grow-0"
                      v-model="evlCrtrGrdItem.AMT"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    정렬순서
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form flex-grow-0"
                      v-model="evlCrtrGrdItem.SORT_ORD"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    사용여부
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="evlCrtrGrdItem.USE_YN"
                      :items="mixin_common_code_get(allCodeList, 'USE_WT', '')"
                      class="pl-form type-middle flex-grow-0"
                      placeholder="선택"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      v-model="evlCrtrGrdItem.EXPLN"
                      placeholder="설명 입력 "
                      height="250"
                      v-byte-counter="4000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- bottom -->
            <div class="pl-card is-border text-right">
              <v-btn class="pl-btn" @click="saveEvlGrd()">저장</v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MENU_CTE_M0200', //평가 등급 관리
  components: {
  },
  data() {
    return {

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false},
        { text: '센터', value: 'CENTER_NM', align: '', width: '', sortable: true },
        { text: '고용형태', value: 'EPLMT_CD_NM', align: 'center', width: '10%', sortable: false },
        { text: '등급', value: 'GRD_CD_NM', align: 'center', width: '10%', sortable: false },
        { text: '직급', value: 'JBGD_CD_NM', align: 'center', width: '10%', sortable: false },
        { text: '수당', value: 'AMT', align: 'right', width: '12%', sortable: false },
        { text: '사용여부', value: 'USE_YN_NM', align: 'center', width: '11%', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: '', width: '11%', sortable: false },
        { text: '등록일', value: 'REG_DT', align: '', width: '11%', sortable: false },
      ],
      items: [],

      // 공통코드
      allCodeList:[],

      searchParams: {
        CUSTCO_ID: "",
        EPLMT_CD: "",
      },

      DROP_CENTER_LIST:{},

      evlCrtrGrdList: [],
      checkedGrdList: [],
      evlCrtrGrdItem: {},
      editType: 'S',   //'U'  update
      selectedRow:{},
      fileName:"",

    }
  },
  methods: {

    deleteItems() {

      if (this.checkedGrdList.length === 0) {
        this.showAlert({
          alertDialogToggle: true,
          msg: '삭제할 등급을 선택 해주세요.',
          iconClass: 'is-caution',
          type: 'default'
        });
        return;
      }

      this.showConfirmInfo({
        msg: '삭제 하시겠습니까?',  callYes: () => {
            this.delEvlGrd_act();
            this.$store.commit("alertStore/hideAlert");
          }, callNo:this.closeAlert
        }
      )
    },

    async delEvlGrd_act(){

      const selectedItem = this.checkedGrdList[0];

      console.info(selectedItem);

      let sUrl = '/api/lhcs/system/user/evlcrtr/deleteEvlGrd';
      let postParam = {
        PRCS_CUSTCO_ID: selectedItem.CUSTCO_ID,
        EPLMT_CD: selectedItem.EPLMT_CD,
        GRD_CD: selectedItem.GRD_CD,
        JBGD_CD: selectedItem.JBGD_CD,
        EVL_GRD_ID: selectedItem.EVL_GRD_ID,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : '삭제 되었습니다.'});
        this.selectEvlGrdList();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    saveEvlGrd(){

      if(this.mixin_isEmpty(this.evlCrtrGrdItem.CUSTCO_ID)
        || this.mixin_isEmpty(this.evlCrtrGrdItem.EPLMT_CD)
        || this.mixin_isEmpty(this.evlCrtrGrdItem.GRD_CD)
        || this.mixin_isEmpty(this.evlCrtrGrdItem.JBGD_CD)
        || this.mixin_isEmpty(this.evlCrtrGrdItem.AMT)
        || this.mixin_isEmpty(this.evlCrtrGrdItem.SORT_ORD)
        ){
        this.showAlert({
            alertDialogToggle: true,
            msg: '등급 정보를 입력 해주세요. ',
            iconClass: 'is-caution',
            type: 'default'
          });
          return;
      }

      if(this.editType === 'U'){
        this.saveEvlGrd_act(this.editType);
      }else{
        this.saveEvlGrd_chk();
      }
    },

    async saveEvlGrd_chk(){

      let sUrl = '/api/lhcs/system/user/evlcrtr/selectEvlGrdInfo';
      let postParam = {
        SRCH_CUSTCO_ID: this.evlCrtrGrdItem.CUSTCO_ID,
        EPLMT_CD: this.evlCrtrGrdItem.EPLMT_CD,
        GRD_CD: this.evlCrtrGrdItem.GRD_CD,
        JBGD_CD: this.evlCrtrGrdItem.JBGD_CD,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        if(response.DATA.length > 0){
          // 중복 alert
          this.showAlert({
            alertDialogToggle: true,
            msg: '중복된 등급 정보가 있습니다.',
            iconClass: 'is-caution',
            type: 'default'
          });
          return;
        }else{
          this.saveEvlGrd_act(this.editType);
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 등록 저장
    async saveEvlGrd_act(type){

      let sUrl = '/api/lhcs/system/user/evlcrtr/saveEvlGrd';
      let postParam = {
        PRCS_CUSTCO_ID: this.evlCrtrGrdItem.CUSTCO_ID,
        EPLMT_CD: this.evlCrtrGrdItem.EPLMT_CD,
        GRD_CD: this.evlCrtrGrdItem.GRD_CD,
        JBGD_CD: this.evlCrtrGrdItem.JBGD_CD,

        AMT: this.evlCrtrGrdItem.AMT,
        USE_YN: this.evlCrtrGrdItem.USE_YN,
        SORT_ORD: this.evlCrtrGrdItem.SORT_ORD,
        EXPLN: this.evlCrtrGrdItem.EXPLN,
        EVL_GRD_ID: this.evlCrtrGrdItem.EVL_GRD_ID,
        JOB_TYPE : type
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : this.editType === 'U' ? '수정 되었습니다.' : '등록 되었습니다.'});
        this.selectEvlGrdList();
        //
      }else{
        this.showAlert({msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.'});
      }

    },

    showDetail(e, {item}){
      this.evlCrtrGrdItem = item;
      this.editType = 'U';
    },

    setDetail(){
      if(this.evlCrtrGrdList.length > 0){
        this.evlCrtrGrdItem = this.evlCrtrGrdList[0];
        this.editType = 'U';
      }
    },

    // 등록 초기화
    initEvlGrd(){
      this.evlCrtrGrdItem= {};
      this.editType = 'S';
    },

    async selectEvlGrdList(){
      // 초기화
      this.evlCrtrGrdList = [];
      this.checkedGrdList = [];
      this.selectedRow= {};
      this.evlCrtrGrdItem= {};
      let sUrl = '/api/lhcs/system/user/evlcrtr/selectEvlGrdList';
      let postParam = {
        SCH_CUSTCO_ID: this.searchParams.CUSTCO_ID,
        EPLMT_CD: this.searchParams.EPLMT_CD,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.evlCrtrGrdList = response.DATA;

        this.setDetail();

        this.fileName = "등급관리 현황";
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    isActiveRow(item) {
      const activeClass = item === this.evlCrtrGrdItem ? "active" : "";
      return activeClass;
    },

  },
  async mounted() {

    // 공통코드 조회
    let codeList = ['PERFORM_LV', 'WORK_TP', 'T207', 'USE_WT'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);
    //this.allCodeList = await this.mixin_common_code_get_all_global(codeList);

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if (this.DROP_CENTER_LIST.length > 0) {
        this.searchParams.CUSTCO_ID = this.DROP_CENTER_LIST.find((row) => {return row.value == centerId; }) ? centerId : this.DROP_CENTER_LIST[0].value;
    }


    this.selectEvlGrdList();
  },
  async created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>