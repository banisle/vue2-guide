<template>
  <div>
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
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력"
              disabled />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_USR_DS_CD"
              :items="MNTN_USR_DS_CD_LIST"
              class="pl-form type-middle is-lg"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchAdmFrmList">
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
      :items="ADM_FRM_LIST"
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
  name: 'CompoFindAsAdmFrm', //보수지시(관리소(단지) 관리업체 검색)
  components: {
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      //지역본부 목록
      ARA_HDQ_CD_LIST: [],
      MNTN_USR_DS_CD_LIST: [],

      // search
      ARA_HDQ_CD: '',
      MGOF_CD: '',
      MNTN_USR_DS_CD: '070', //담당자 구분

      ADM_FRM_LIST: [], //관리소(단지) 관리 업체 목록

      SEL_ROW: {},
      isLoading: false,

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '사용자 이름', value: 'USR_NM',  width: '90px', sortable: false },
        { text: '업체명', value: 'FRM_NM',  width: '20%', sortable: false },
        { text: '공종', value: 'MNTN_RPSN_CSTP_NM', align: 'center', width: '80px',sortable: false },
        { text: '담당자 전화번호', value: 'SPPB_TLNO', align: 'center', width: '120px', sortable: false },
        { text: '휴대폰 번호', value: 'MBL_NO', align: 'center', width: '120px' , sortable: false},
        { text: '지급자재 분류', value: 'PAY_MATR_GRP_NM', align: 'center', width: '120px', sortable: false },
        { text: '비고', value: 'RMK',  width: '', sortable: false },
      ],
      items: [
        { index: 1, type1: '나사용1', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 2, type1: '나사용2', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 3, type1: '나사용3', type2: '보은용사촌 주식회사', type3: '', type4: '031-943-4710', type5: '', type6: '', type7: '', },
        { index: 4, type1: '나사용4', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 5, type1: '나사용5', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 6, type1: '나사용6', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '조명', },
        { index: 7, type1: '나사용7', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: 'PL창호 (010-4282-6220), 054-554-3077', },
        { index: 8, type1: '㈜라비체', type2: '사회복지법인 인정재단 인정재활관', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '스마트스위치', },
        { index: 9, type1: '나사용9', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 10, type1: '나사용10', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 11, type1: '㈜라비체', type2: '사회복지법인 인정재단 인정재활관', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '스마트스위치', },
        { index: 12, type1: '나사용9', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
        { index: 13, type1: '나사용10', type2: '보은용사촌 주식회사', type3: '', type4: '', type5: '010-1004-1004', type6: '', type7: '', },
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
    
    //담당자 구분, '070','120' 만 조회.
    this.getMntnUsrDsCdList();

    if(this.ARA_HDQ_CD != '' && this.MGOF_CD != '') {
      this.searchAdmFrmList();
    }

  },
  computed: {
  },
  watch: {
  },
  methods: {
    //담당자 구분, '070','120' 만 조회.
    async getMntnUsrDsCdList() {
      this.MNTN_USR_DS_CD_LIST = await this.mixinAsGetCommonCode("MNTN_USR_DS_CD", ['070','120'])
    },
   

    //호 검색
    async searchAdmFrmList() {
      this.ADM_FRM_LIST = [];
      let postParam = {
        ARA_HDQ_CD: this.ARA_HDQ_CD,
        MGOF_CD: this.MGOF_CD,
        MNTN_USR_DS_CD: this.MNTN_USR_DS_CD,
      };
      let headParam = {head: {}};
      this.isLoading = true;
      //전화번호 복호화 처리로 biz/common 사용 안함.
      const response = await this.common_postCall("/phone-api/as/common/selectCotisAdmFrmList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.ADM_FRM_LIST = response.DATA;
      }
      this.isLoading = false;
    },
    
    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      this.$emit("setItem", this.SEL_ROW);
    },


    //검색 조건 초기화.
    initSrchCondition() {
      //this.MNTN_USR_DS_CD = '';
    },
  },
  
};
</script>

<style lang="scss" scoped>

</style>