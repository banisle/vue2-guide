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
              disabled
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
              class="pl-form type-middle"
              style="width: 195px"
              placeholder="단지명 입력"
              disabled />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            동
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="BLDG_NO"
              class="pl-form type-middle is-xss"
              placeholder="" />
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0"
            @click="searchBldgNoList">
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
      :items="BLDG_NO_LIST"
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
  name: 'CompoFindAsBldgNo', //동 검색
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
      MGOF_CD: '',
      MGOF_NM: '',
      BLDG_NO: '',


      //동 목록
      BLDG_NO_LIST: [],

      SEL_ROW: {},
      isLoading: false,

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '동번호', value: 'BLDG_NO', align: 'center', width: '80px', sortable: false },
        { text: '동주소', value: 'BLDG_ADR', align: '', width: '',sortable: false },
      ],
      items: [
        { index: 1, type1: '101', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 2, type1: '102', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 3, type1: '103', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 4, type1: '104', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 5, type1: '105', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 6, type1: '106', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 7, type1: '107', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 8, type1: '108', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 9, type1: '109', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 10, type1: '120', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 11, type1: '121', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 12, type1: '122', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 13, type1: '123', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 14, type1: '124', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 15, type1: '125', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
        { index: 16, type1: '126', type2: '경기도 파주시 운정중앙로 200(목동동,물향기마을 1단지 아파트)',},
      ],
    }
  },
  mounted() {
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : ''; 
    this.MGOF_CD = this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';
    this.MGOF_NM = this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';

    //지역본부 목록
    this.mixinAsGetAsAraHdqCdList();

    if(this.ARA_HDQ_CD != '' && this.MGOF_CD != '') {
      this.searchBldgNoList();
    }

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


    //동 검색
    async searchBldgNoList() {
      this.BLDG_NO_LIST = [];
      let postParam = {
        MGOF_CD: this.MGOF_CD,
        BLDG_NO: this.BLDG_NO
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisBldgNoList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.BLDG_NO_LIST = response.DATA;
      }
      this.isLoading = false;
    },
    
    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      // this.$emit("setItem", this.SEL_ROW);
      this.$emit("sendDataToParent", this.SEL_ROW);
      this.$eventBus.$emit('closeSearchPopup');
    },


    //검색 조건 초기화.
    initSrchCondition() {
      this.BLDG_NO = '';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>