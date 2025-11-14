<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          평가 연도
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.STD_YEAR"
            :items="DROP_YEAR"
            class="pl-form type-middle is-sm"
            placeholder="선택"
          ></v-select>
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
            placeholder="선택"
            return-object
            @change="changeCenter"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          소속
        </span>
        <div class="pl-desc">
          <v-select
            multiple
            class="pl-form type-middle"
            v-model="searchParams.DEPT_ID"
            :items="DROP_DEPT_LIST"
            placeholder="전체"
            @change="changeDept"
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
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">점수대별 분포도(환산점수)</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ gridDataText.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="gridDataHeaders"
            :DataBodyProp="gridDataText"
            :FileNameProp="fileName"
            SheetNameProp="QA점수대별분포도"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover"
        :headers="gridDataHeaders"
        :items="gridDataText"
        fixed-header
        item-key="ROW_NUM"
        height="calc(-360px + 100vh)"
        disable-pagination
        hide-default-footer
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
      </v-data-table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'QAM_M0700_TAB_05', //점수대별 분포
  components: {
  },
  data() {
    return {
      common_ognz_list:[],
      DROP_CENTER_LIST:[],
      DROP_DEPT_LIST:[],
      DROP_YEAR:[],

      searchParams:{
        CENTER:{}
        , DEPT_ID:[]
        , STD_YEAR: this.$moment().format("YYYY")
      },

      fileName:"",

      // 소속 전체 체크 여부
      isAllCheck:false,

      // grid
      gridDataHeaders: [
        { text: '평가월', value: 'STD_MT_NM', align: 'center', width: '110px', sortable: false },
        { text: '총 건수', value: 'TOT_CNT', align: 'center', width: '110px',sortable: false },
        { text: '70점 미만', value: 'G_DATA', align: 'center', width: '',sortable: false },
        { text: '70점 이상', value: 'F_DATA', align: 'center', width: '', sortable: false },
        { text: '75점 이상', value: 'E_DATA', align: 'center', width: '', sortable: false },
        { text: '80점 이상', value: 'D_DATA', align: 'center', width: '', sortable: false },
        { text: '85점 이상', value: 'C_DATA', align: 'center', width: '', sortable: false },
        { text: '90점 이상', value: 'B_DATA', align: 'center', width: '', sortable: false },
        { text: '95점 이상', value: 'A_DATA', align: 'center', width: '', sortable: false },
      ],

      gridDataText: [],

      loading: false,
    }
  },
  methods: {
    // 조회 버튼 클릭 이벤트
    clickSearchBtn(){
      this.selectQaResultDistCharReport()
    },

    // 평가보고서 - 점수대별 분포
    async selectQaResultDistCharReport(){
      this.gridDataText = [];

      // 엑셀 파일명 셋팅
      this.setExcelFileName();

      let sUrl = '/phone-api/qa/selectQaResultDistCharReport';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , DEPT_ID: this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).join(",")
        , STD_YEAR: this.searchParams.STD_YEAR
      };

      let headParam = { head : {}};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.gridDataText = response.DATA.map(row=>{
          row.STD_MT_NM = parseInt(row.STD_MT.substring(4,6)) + "월"
          row.A_DATA = this.mixin_isEmpty(row.A_PERCENT)? "-" : parseFloat(row.A_PERCENT).toFixed(1) + " (" + row.A + ")";
          row.B_DATA = this.mixin_isEmpty(row.B_PERCENT)? "-" : parseFloat(row.B_PERCENT).toFixed(1) + " (" + row.B + ")";
          row.C_DATA = this.mixin_isEmpty(row.C_PERCENT)? "-" : parseFloat(row.C_PERCENT).toFixed(1) + " (" + row.C + ")";
          row.D_DATA = this.mixin_isEmpty(row.D_PERCENT)? "-" : parseFloat(row.D_PERCENT).toFixed(1) + " (" + row.D + ")";
          row.E_DATA = this.mixin_isEmpty(row.E_PERCENT)? "-" : parseFloat(row.E_PERCENT).toFixed(1) + " (" + row.E + ")";
          row.F_DATA = this.mixin_isEmpty(row.F_PERCENT)? "-" : parseFloat(row.F_PERCENT).toFixed(1) + " (" + row.F + ")";
          row.G_DATA = this.mixin_isEmpty(row.G_PERCENT)? "-" : parseFloat(row.G_PERCENT).toFixed(1) + " (" + row.G + ")";

          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 평가연도 조회
    async selectQaEvlYear(){
      // let sUrl = '/phone-api/qa/selectQaEvlYear';
      let sUrl = '/api/biz/common/select/selectQaEvlYear';

      let postParam = {};

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectQaEvlYear'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_YEAR = response.DATA.map(row=>{
          row.text = row.YR_TEXT;
          row.value = row.YR;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      // 소속
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.DROP_DEPT_LIST.unshift({value:"ALL_CHECK", text:"전체"});
      this.searchParams.DEPT_ID = [];
    },

    // 소속 변경 이벤트
    changeDept(){
      this.checkDeptList();
    },

    // 전체 선택 처리
    checkDeptList(){
      let isCheck = this.searchParams.DEPT_ID.includes("ALL_CHECK");

      if(!this.isAllCheck && isCheck){
        this.isAllCheck = true;
        this.searchParams.DEPT_ID = this.DROP_DEPT_LIST.map(row=>{ return row.value});
      }else if(this.isAllCheck && !isCheck){
        this.isAllCheck = false;
        this.searchParams.DEPT_ID = [];
      }else if(this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).length == this.DROP_DEPT_LIST.filter(row=>{return row.value != "ALL_CHECK"}).length){
        this.isAllCheck = true;
        this.searchParams.DEPT_ID = this.DROP_DEPT_LIST.map(row=>{ return row.value});
      }else if(this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).length != this.DROP_DEPT_LIST.filter(row=>{return row.value != "ALL_CHECK"}).length){
        this.isAllCheck = false;
        this.searchParams.DEPT_ID = this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"});
      }
    },

    setExcelFileName(){
      this.fileName = this.searchParams.STD_YEAR+"년_월별_점수대별분포도";
    },
  },
  async mounted() {
    this.selectQaEvlYear();

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    this.DROP_CENTER_LIST = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' );

    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    let temp = this.DROP_CENTER_LIST.filter(row=>{return row.CUSTCO_ID == centerId});
    if(temp.length > 0) this.searchParams.CENTER = temp[0];
    else this.searchParams.CENTER = this.DROP_CENTER_LIST[0];

    this.changeCenter();
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