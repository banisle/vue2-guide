<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            업체명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="FRM_NM"
              class="pl-form type-middle is-lg"
              placeholder="업체명 입력" 
              @keydown.enter="searchFrmList()"/>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchFrmList()">
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
      :items="FRM_LIST"
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
      :page.sync="page"
      @page-count="pageCount = $event"
      >
    </v-data-table>
    <div class="pl-pager">
      <div class="pl-pager-row">
        <span>페이지당 항목 수</span>
        <v-select
          class="pl-form"
          :value="ROW_PER_PAGE"
          :items="perPage"
          :item-text="toString(ROW_PER_PAGE)"
          @change="ROW_PER_PAGE = parseInt($event, 10);"
        ></v-select>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        :total-visible="10">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(FRM_LIST, page) }} / {{ totalCount }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchFrmList('next')"
        ></compo-tooltip-btn>
      </span>
    </div>


  </div>
</template>

<script>
export default {
  name: 'CompoFindAsFrm', //업체 조회
  components: {
  },
  data() {
    return {
      // search
      FRM_NM: '',

      FRM_LIST: [],
      SEL_ROW: {},

      isLoading: false,

      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      ROW_PER_PAGE: 15, //페이징 없이 전체 화면 뿌릴때
      pagination: {
        page: 1,
        rowsPerPage: 500,
      },
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '업체명', value: 'FRM_NM', align: '', width: '', sortable: false },
        { text: '사업자 번호', value: 'BRN', align: '', width: '24%', sortable: false },
      ],
    }
  },
  
  mounted() {
  },
  created() {
    this.searchFrmList();
  },
  computed: {
  },
  watch: {
  },
  methods: {

    //업체 조회
    async searchFrmList(next = '') {
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.FRM_LIST = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      
      let postParam = {
        FRM_NM : this.FRM_NM,
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis',
        "ROW_CNT" : this.pagination.rowsPerPage,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisFrmList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.FRM_LIST = [...this.FRM_LIST, ...response.DATA];
        this.totalCount = response.HEADER.TOT_COUNT;

        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1;
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
      this.FRM_NM = '';
      this.searchFrmList();
    },

  },
};
</script>

<style lang="scss" scoped>

</style>