<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            부서명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="DEP_NM"
              class="pl-form type-middle"
              style="width: 195px"
              placeholder="부서명 입력"
              @keyup.enter="searchDepList"
            />
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0"
            @click="searchDepList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="DEP_LIST"
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
  name: 'CompoFindAsDep', //담당자부서 검색
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
      DEP_NM: '',


      //담당자부서 목록
      DEP_LIST: [],

      SEL_ROW: {},
      isLoading: false,

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '부서코드', value: 'DEP_CD', align: 'center', width: '80px', sortable: false },
        { text: '부서명', value: 'DEP_NM', align: '', width: '',sortable: false },
        { text: '상위부서명', value: 'UPP_DEP_NM', align: '', width: '',sortable: false },
        { text: '최상위부서명', value: 'UPP_UPP_DEP_NM', align: '', width: '',sortable: false },
      ],
    }
  },
  mounted() {
  },
  async created() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //부서 검색
    async searchDepList() {
      if(this.DEP_NM == '') {
        this.showAlertInfo({msg:"부서명을 입력하세요."})
        return;
      }
      this.DEP_LIST = [];
      let postParam = {
        DEP_NM: this.DEP_NM,
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisDepList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.DEP_LIST = response.DATA;
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

  },
};
</script>

<style lang="scss" scoped>

</style>