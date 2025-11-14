<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                평가 연도
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  v-model="modelDateY"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,'')"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
              @click="selectEvlCrtrList()" >
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
              <v-btn class="pl-btn is-icon is-trans" @click="initEvlCrtr">
                <span class="pl-icon20 circle-plus"></span>
                등록
              </v-btn>
              <v-btn class="pl-btn is-icon is-trans" @click="deleteItems">
                <span class="pl-icon20 trash"></span>
                삭제
              </v-btn>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ evlCrtrList.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers"
                  :DataBodyProp="evlCrtrList"
                  :FileNameProp="fileName"
                  SheetNameProp="평가기간 설정"
                />
              <!--                :DataBodyProp=""-->
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control is-mt-s"
            :headers="headers"
            :items="evlCrtrList"
            v-model="checkedList"
            :item-class="isActiveRow"
            show-select
            single-select
            fixed-header
            item-key="ROW_NUM"
            @click:row="showDetail"
            height="calc(-288px + 100vh)"
            :items-per-page="-1"
            hide-default-footer
            :loading="mixin_loadding"
            loading-text="조회중입니다."
            no-data-text="등록된 데이터가 없습니다."
            >
          </v-data-table>
        </div>
        <!-- detail -->
        <div class="is-col-fix d-flex flex-column" style="width: 30%">
          <v-form ref="form">
            <div class="pl-card pl-scroll-body" style="height: calc(100vh - 258px);">
              <div class="pl-subtit">평가 기간 상세정보</div>
              <div class="pl-subdesc">
                <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭 하십시오.</p>
              </div>
              <!-- form -->
              <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 연도
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle flex-grow-0"
                      v-model="evlCrtrItem.YR"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      :disabled="editType === 'U'"
                    ></v-text-field>
                    <!--
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      placeholder="선택"
                      :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,'')"
                      v-model="evlCrtrItem.YR"
                      :disabled="editType === 'U'"
                    ></v-select>-->
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 월
                  </span>
                  <div class="pl-desc">
                    <v-select
                    class="pl-form type-middle flex-grow-0"
                    placeholder="선택"
                    :items="allMonths"
                    v-model="evlCrtrItem.MM"
                    :disabled="editType === 'U'"
                  ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 시작일
                  </span>
                  <div class="pl-desc">
                    <compo-date-picker
                      DateType="dateInput"
                      v-model="evlCrtrItem.EVL_BGNG_DAY"
                      :DateProp.sync="startDT"/>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 종료일
                  </span>
                  <div class="pl-desc">
                    <compo-date-picker
                      DateType="dateInput"
                      v-model="evlCrtrItem.EVL_END_DAY"
                      :DateProp.sync="endDT"/>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      placeholder="설명 입력 "
                      height="250"
                      v-model="evlCrtrItem.EXPLN"
                      v-byte-counter="4000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- bottom -->
            <div class="pl-card is-border text-right">
              <v-btn class="pl-btn" @click="saveEvlCrtr()">저장</v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MENU_CTE_M0100', //평가기간 설정
  components: {
  },
  data() {
    return {
      // search
      modelYear: '2024년',

      // grid      
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false},
        { text: '평가 연도', value: 'YR', align: 'center', width: '', sortable: false },
        { text: '평가 월', value: 'MM', align: 'center', width: '11%', sortable: true },
        { text: '평가 시작일', value: 'EVL_BGNG_DAY', align: 'center', width: '13%', sortable: false },
        { text: '평가 종료일', value: 'EVL_END_DAY', align: 'center', width: '13%', sortable: false },
        { text: '근무 일수', value: 'WORK_DAY_COUNT', align: 'center font-weight-bold', width: '13%', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: '', width: '13%', sortable: false },
        { text: '등록일', value: 'REG_DT', align: '', width: '13%', sortable: false },
      ],
      items: [
        {
          index: 1,
          type01: '2024년',
          type02: '01월',
          type03: '2023-12-26',
          type04: '2024-06-20',
          type05: '22일',
          type06: '윤지영',
          type07: '2024-06-20',
        },
      ],
      

      init_startDT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      init_endDT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      startDT: this.init_startDT,
      endDT: this.init_endDT,
      allMonths: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      evl_month_item: [
        { text: "1월", value:'01' },{ text: "2월", value:'02' },
        { text: "3월", value:'03' },{ text: "4월", value:'04' },
        { text: "5월", value:'05' },{ text: "6월", value:'06' },
        { text: "7월", value:'07' },{ text: "8월", value:'08' },
        { text: "9월", value:'09' },{ text: "10월", value:'10' },
        { text: "11월", value:'11' },{ text: "12월", value:'12' },
      ],

      evl_crtr_code:[],//평가기준 년월
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateMM: this.$moment(new Date()).format('MM'),
      evlCrtrList: [],

      checkedList:[],

      evlCrtrItem: {},
      editType: 'S',   //'U'  update
      selectedRow:{},

      fileName:"",

    }
  },
  methods: {

    deleteItems() {

      if (this.checkedList.length === 0) {
        this.showAlert({
          alertDialogToggle: true,
          msg: '삭제할 평가기간을 선택 해주세요.',
          iconClass: 'is-caution',
          type: 'default'
        });
        return;
      }

      this.showConfirmInfo({
        msg: '삭제 하시겠습니까?',  callYes: () => {
            this.delEvlCrtr_act();
            this.$store.commit("alertStore/hideAlert");
          }, callNo:this.closeAlert
        }
      )
    },

    async delEvlCrtr_act(){

      const selectedItem = this.checkedList[0];

      let sUrl = '/api/lhcs/system/user/evlcrtr/deleteEvlCrtr';
      let postParam = {
        YR: selectedItem.YR,
        MM: selectedItem.MM,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : '삭제 되었습니다.'});
        this.selectEvlCrtrList();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    showDetail(e, {item}){
      //this.evlCrtrItem= {
      //  YR : item.YR
      //  , MM : item.MM
      //  , EVL_BGNG_DAY : item.EVL_BGNG_DAY
      //  , EVL_END_DAY : item.EVL_END_DAY
      //}
      this.evlCrtrItem = item;
      this.startDT = item.EVL_BGNG_DAY;
      this.endDT = item.EVL_END_DAY;
      this.editType = 'U';
    },

    setDetail(){
      if(this.evlCrtrList.length > 0){
        //this.evlCrtrItem= {
        //  YR : this.evlCrtrList[0].YR
        //  , MM : this.evlCrtrList[0].MM
        //  , EVL_BGNG_DAY : this.evlCrtrList[0].EVL_BGNG_DAY
        //  , EVL_END_DAY : this.evlCrtrList[0].EVL_END_DAY
        //}
        this.evlCrtrItem = this.evlCrtrList[0];

        this.startDT = this.evlCrtrList[0].EVL_BGNG_DAY;
        this.endDT = this.evlCrtrList[0].EVL_END_DAY;
        this.editType = 'U';
      }
    },

    // 등록 초기화
    initEvlCrtr(){
      this.evlCrtrItem= {};
      this.editType = 'S';

      this.evlCrtrItem.YR = this.modelDateY;
      this.evlCrtrItem.MM = this.modelDateMM;

      this.startDT = this.init_startDT;
      this.endDT = this.init_endDT;

    },

    saveEvlCrtr(){

      if(this.mixin_isEmpty(this.evlCrtrItem.YR) || this.mixin_isEmpty(this.evlCrtrItem.MM)){
        this.showAlert({
            alertDialogToggle: true,
            msg: '평가 연/월 정보를 입력 해주세요. ',
            iconClass: 'is-caution',
            type: 'default'
          });
          return;
      }

      if( this.evlCrtrItem.YR.length != 4   ){
        this.showAlert({
            alertDialogToggle: true,
            msg: '평가 연도 정보를 정확하게 입력 해주세요. ',
            iconClass: 'is-caution',
            type: 'default'
          });
          return;
      }
      
      if(this.editType === 'U'){
        this.saveEvlCrtr_act(this.editType);
      }else{
        this.saveEvlCrtr_chk();
      }
    },

    async saveEvlCrtr_chk(){

      let sUrl = '/api/lhcs/system/user/evlcrtr/selectEvlCrtrInfo';
      let postParam = {
        YR: this.evlCrtrItem.YR,
        MM: this.evlCrtrItem.MM,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {

        if(response.DATA.length > 0){
          // 중복 alert
          this.showAlert({
            alertDialogToggle: true,
            msg: '중복된 평가 연/월 정보가 있습니다.',
            iconClass: 'is-caution',
            type: 'default'
          });
          return;
        }else{
          this.saveEvlCrtr_act(this.editType);
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 등록 저장
    async saveEvlCrtr_act(type){

      const set_EVL_BGNG_DAY = this.startDT.replaceAll('-', '');
      const set_EVL_END_DAY = this.endDT.replaceAll('-', '');

      let sUrl = '/api/lhcs/system/user/evlcrtr/saveEvlCrtr';
      let postParam = {
        YR: this.evlCrtrItem.YR,
        MM: this.evlCrtrItem.MM,
        EVL_BGNG_DAY: set_EVL_BGNG_DAY,
        EVL_END_DAY: set_EVL_END_DAY,
        EXPLN: this.evlCrtrItem.EXPLN,
        JOB_TYPE : type
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : this.editType === 'U' ? '수정 되었습니다.' : '등록 되었습니다.'});
        this.selectEvlCrtrList();
        //
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    async selectEvlCrtrList(){
      // 초기화
      this.evlCrtrList = [];
      this.checkedList = [];
      this.selectedRow= {};
      this.evlCrtrItem= {};
      let sUrl = '/api/lhcs/system/user/evlcrtr/selectEvlCrtrList';
      let postParam = {
        YR: this.modelDateY,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.evlCrtrList = response.DATA;

        this.setDetail();

        this.fileName = "평가기간 현황";
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    isActiveRow(item) {
      const activeClass = item === this.evlCrtrItem ? "active" : "";
      return activeClass;
    },
  },
  mounted() {

    this.selectEvlCrtrList();
  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>