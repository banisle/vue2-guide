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
              class="pl-form type-middle is-lg"
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
              placeholder=""
              :disabled="isDisabledBldgNo" />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            호
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="HS_NO"
              class="pl-form type-middle is-xss"
              placeholder=""
              @keydown.enter="searchHsNoList"/>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchHsNoList">
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
      :items="HS_NO_LIST"
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
        :total-visible="7">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(HS_NO_LIST, page) }} / {{ totalCount }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchHsNoList('next')"
        ></compo-tooltip-btn>
      </span>
    </div>


  </div>
</template>

<script>
export default {
  name: 'CompoFindAsHsNo', //세대현황 검색
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
      isDisabledBldgNo: false,
      HS_NO: '',
     

      //호 목록
      HS_NO_LIST: [],

      SEL_ROW: {},
      isLoading: false,

      totalCount: 0,
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
        { text: '세대번호', value: 'HS_NO', align: 'center', width: '24%', sortable: false },
        { text: '층', value: 'FLR_NM', align: 'center', width: '24%', sortable: false },
        { text: '사업자코드', value: 'BZ_DST_CD', align: 'center', width: '24%',sortable: false },
        { text: '블록', value: 'BLK', align: 'center', width: '',sortable: false },
      ],
      items: [
        { index: 1, type1: '1001', type2: '10층', type3: 100825, type4: 21,  },
        { index: 2, type1: '1002', type2: '10층', type3: 100825, type4: 21,  },
        { index: 3, type1: '1003', type2: '10층', type3: 100825, type4: 21,  },
        { index: 4, type1: '1004', type2: '10층', type3: 100825, type4: 21,  },
        { index: 5, type1: '1005', type2: '10층', type3: 100825, type4: 21,  },
        { index: 6, type1: '1006', type2: '10층', type3: 100825, type4: 21,  },
        { index: 7, type1: '1007', type2: '10층', type3: 100825, type4: 21,  },
        { index: 8, type1: '1008', type2: '10층', type3: 100825, type4: 21,  },
        { index: 9, type1: '1009', type2: '10층', type3: 100825, type4: 21,  },
        { index: 10, type1: '1020', type2: '10층', type3: 100825, type4: 21,  },
        { index: 11, type1: '1021', type2: '10층', type3: 100825, type4: 21,  },
        { index: 12, type1: '1022', type2: '10층', type3: 100825, type4: 21,  },
        { index: 13, type1: '1023', type2: '10층', type3: 100825, type4: 21,  },
        { index: 14, type1: '1024', type2: '10층', type3: 100825, type4: 21,  },
        { index: 15, type1: '1025', type2: '10층', type3: 100825, type4: 21,  },
        { index: 16, type1: '1026', type2: '10층', type3: 100825, type4: 21,  },
        { index: 17, type1: '1027', type2: '10층', type3: 100825, type4: 21,  },
        { index: 18, type1: '1028', type2: '10층', type3: 100825, type4: 21,  },
      ],
    }
  },
  
  mounted() {
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : ''; 
    this.MGOF_CD = this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : ''; 
    this.MGOF_NM = this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : ''; 
    this.BLDG_NO = this.DataProp.BLDG_NO ? this.DataProp.BLDG_NO : '';
    if(this.BLDG_NO != '') {
      this.isDisabledBldgNo = true;
    }

    //지역본부 목록
    this.mixinAsGetAsAraHdqCdList();

    if(this.ARA_HDQ_CD != '' && this.MGOF_CD != '') {
      this.searchHsNoList();
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


    //호 검색
    async searchHsNoList(next = '') {
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.HS_NO_LIST = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let postParam = {
        MGOF_CD: this.MGOF_CD,
        BLDG_NO: this.BLDG_NO,
        HS_NO: this.HS_NO
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis',
        "ROW_CNT" : this.pagination.rowsPerPage,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",

      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisHsNoList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.HS_NO_LIST = [...this.HS_NO_LIST, ...response.DATA];
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
      // this.$emit("setItem", this.SEL_ROW);
      this.$emit("sendDataToParent", this.SEL_ROW);
      this.$eventBus.$emit('closeSearchPopup');
    },


    //검색 조건 초기화.
    initSrchCondition() {
      this.HS_NO = '';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>