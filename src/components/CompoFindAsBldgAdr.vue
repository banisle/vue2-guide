<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ARA_HDQ_CD"
              :items="ARA_HDQ_CD_LIST"
              class="pl-form type-middle is-md"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력" 
              @keydown.enter="searchBldgAdrList"/>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            동주소(매입)
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="BLDG_ADR"
              class="pl-form type-middle is-lg"
              placeholder="" 
              @keydown.enter="searchBldgAdrList"/>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchBldgAdrList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="initSrchCondition()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="BLDG_ADR_LIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="390px"
      :items-per-page="ROW_PER_PAGE"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      >
    </v-data-table>


  </div>
</template>

<script>
export default {
  name: 'CompoFindAsBldgAdr', //동주소 검색
  components: {
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //지역본부 목록
      ARA_HDQ_CD_LIST: [],

      // search
      ARA_HDQ_CD: '',
      MGOF_NM: '',
      BLDG_ADR: '',

      //동주소 목록
      BLDG_ADR_LIST: [],

      SEL_ROW: {},
      isLoading: false,

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '단지명', value: 'MGOF_NM',  width: '250px', sortable: false },
        { text: '동', value: 'BLDG_NO', align: 'center', width: '60px', sortable: false },
        { text: '동주소', value: 'BLDG_ADR', align: '', width: '',sortable: false },
        { text: '공급유형', value: 'SPL_TP_NM', align: '', width: '200px', sortable: false },
        { text: '세대수', value: 'ALL_HSH_CNT', align: 'center', width: '60px' , sortable: false},
        { text: '준공일', value: 'CCW_DT', align: 'center', width: '100px', sortable: false },
      ],
      items: [
        { index: 1, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 2, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 3, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 4, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 5, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 6, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 7, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 8, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 9, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 10, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 11, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
        { index: 12, type1: '(NHF12호)파주운정A12(휴아림)', type2: '', type3: '', type4: '기존주택매입임대+임대상가', type5: 748, type6: '2020-08-01' },
      ],

      //알림창 메시지
      MESSAGE : {
        ALERT : {
          REQUIRED_MGOF_NM_BLDG_ADR: {alertDialogToggle: true, msg: '단지명, 동주소 중 하나 이상 입력하세요.', iconClass: 'is-info', type: 'default'}
        },
      }
    }
  },
  mounted() {
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : ''; 
    this.MGOF_NM = this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';

    //지역본부 목록
    await this.mixinAsGetAsAraHdqCdList();

    // 단지명 입력된 경우 조회
    if(!this.mixin_isEmpty(this.MGOF_NM)) this.searchBldgAdrList();
    
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getResponseData (response, strHeadText = '선택') {
      let responseData = [];
      if(!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
              responseData.push({text: item.CD_NM, value: item.CD})
          });
      }
      
      //전체, 선택 등 값이 있다면 추가.
      if (strHeadText != "" && strHeadText != undefined) {
          responseData.unshift({ text: strHeadText, value: "" });
      }
      return responseData;
    },


    //지역본부 목록 조회
    async getAsAraHdqCdList() {
        const postParam = {
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisAraHdqCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        return responseData;
    },

    //동주소 검색
    async searchBldgAdrList() {
      if(this.MGOF_NM == '' && this.BLDG_ADR == '') {
        //단지명, 동주소 중 하나이상 입력하세요.
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_NM_BLDG_ADR);
        return 
      }
      this.BLDG_ADR_LIST = [];
      let postParam = {
        ARA_HDQ_CD: this.ARA_HDQ_CD,
        MGOF_NM: this.MGOF_NM,
        BLDG_ADR: this.BLDG_ADR
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisBldgAdrList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.BLDG_ADR_LIST = response.DATA;
      }
      this.isLoading = false;
    },
    
    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      this.$emit("setItem", this.SEL_ROW);
      this.$emit("sendDataToParent", this.SEL_ROW);
      this.$eventBus.$emit('closeSearchPopup');
    },

    //검색 조건 초기화.
    initSrchCondition() {
      this.ARA_HDQ_CD = '';
      this.MGOF_NM = '';
      this.BLDG_ADR = '';
      
      this.BLDG_ADR_LIST = [];
    },


  },

  
};
</script>

<style lang="scss" scoped>

</style>