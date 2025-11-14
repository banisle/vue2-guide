<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            AS 코드
          </span>
          <div class="pl-desc">
            <v-select
              v-model="LCLS_CD"
              :items="LCLS_CD_LIST"
              @change="changeLclsCd"
              class="pl-form type-middle is-sm"
              placeholder="선택"
              
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            공간
          </span>
          <div class="pl-desc">
            <div class="spacing-wrap sp-4">
              <v-select
                v-model="MNTN_SPCE_CD"
                :items="MNTN_SPCE_CD_LIST"
                @change="changeMntnSpceCd"
                :disabled="LCLS_CD == ''"
                class="pl-form type-middle is-sm"
                placeholder="선택"
              ></v-select>
              <v-select
                v-model="REON_MTRL_CD"
                :items="REON_MTRL_CD_LIST"
                @change="changeReonMtrlCd"
                :disabled="MNTN_SPCE_CD == ''"
                class="pl-form type-middle "
                placeholder="부위자재 선택"
              ></v-select>
              <v-select
                v-model="MNTN_FLW_TP_CD"
                :items="MNTN_FLW_TP_CD_LIST"
                @change="changeMntnFlwTpCd"
                :disabled="REON_MTRL_CD == ''"
                class="pl-form type-middle "
                placeholder="AS유형 선택"
              ></v-select>
              <v-select
                v-model="MNTN_CSTP_CD"
                :items="MNTN_CSTP_CD_LIST"
                @change="changeMntnCstpCd"
                :disabled="MNTN_FLW_TP_CD == ''"
                class="pl-form type-middle "
                placeholder="공종 선택"
              ></v-select>
              <v-select
                v-model="MNTN_CON_CD"
                :items="MNTN_CON_CD_LIST"
                :disabled="MNTN_CSTP_CD == ''"
                class="pl-form type-middle "
                placeholder="공사 선택"
              ></v-select>
              <div class="ml-2 spacing-wrap sp-4">
                <v-btn class="pl-btn is-icon flex-grow-0" 
                  @click="searchMntnFlwCsCdList()"
                >
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
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="MNTN_FLW_CS_CD_LIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="390px"
      :items-per-page="ROW_PER_PAGE"
      :page.sync="page"
      @page-count="pageCount = $event"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
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
        보기 {{ mixin_getPagePeriod(MNTN_FLW_CS_CD_LIST, page) }} / {{ totalCount }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchMntnFlwCsCdList('next')"
        ></compo-tooltip-btn>
      </span>
    </div>


  </div>
</template>

<script>
export default {
  name: 'CompoFindAsMntnFlwCs', //MMA_유지하자분류(공종) 검색
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
      LCLS_CD: '',  //대분류코드
			MNTN_SPCE_CD: '', //공간코드
			REON_MTRL_CD: '', //부위자재코드
			MNTN_FLW_TP_CD: '', //유지하자유형코드
			MNTN_CSTP_CD: '', //유지공종코드
			MNTN_CON_CD: '',  //유지공사코드

      LCLS_CD_LIST: [],
      MNTN_SPCE_CD_LIST: [],
      REON_MTRL_CD_LIST: [],
			MNTN_FLW_TP_CD_LIST: [],
			MNTN_CSTP_CD_LIST: [],
			MNTN_CON_CD_LIST: [],

      //공종 코드 목록 - 시설구분, 공간값에 따라 변경
      MNTN_FLW_CS_CD_LIST: [],
      SEL_ROW: {},


      // search
      modelCenter: '세대별',
      dropItems: ['세대별'],
      dialogFindDanji: false,

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
      totalCount: 0,
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '대분류', value: 'LCLS_NM', align: 'center', width: '13%', sortable: false },
        { text: '공간', value: 'MNTN_SPCE_NM', align: 'center', width: '13%', sortable: false },
        { text: '부위자재', value: 'REON_MTRL_NM', align: 'center', width: '13%',sortable: false },
        { text: 'AS 유형', value: 'MNTN_FLW_TP_NM', align: 'center', width: '13%', sortable: false },
        { text: '공종', value: 'MNTN_CSTP_NM', align: 'center', width: '13%' , sortable: false},
        { text: '공사', value: 'MNTN_CON_NM', align: '', width: '', sortable: false },
      ],
      items: [
        { index: 1, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 2, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 3, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 4, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 5, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 6, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 7, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 8, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 9, type1: '세대별', type2: '거실', type3: '천장', type4: '마감불량', type5: '건축', type6: '방수공사', },
        { index: 10, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 11, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 12, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 13, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 14, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 15, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
        { index: 16, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '기계', type6: '금수/급탕배관공사', },
        { index: 17, type1: '세대별', type2: '거실', type3: '천장', type4: '누수', type5: '건축', type6: '방수공사', },
      ],
    }
  },
  mounted() {
  },
  async created() {
    if(this.DataProp.LCLS_CD) {
      this.LCLS_CD = this.DataProp.LCLS_CD  //대분류코드
      this.LCLS_CD_LIST = await this.getAsLclsCode("");
    }

    if(this.DataProp.LCLS_CD) {
      this.MNTN_SPCE_CD = this.DataProp.MNTN_SPCE_CD  //공간코드
      this.MNTN_SPCE_CD_LIST = await this.getAsMntnSpceCode(this.LCLS_CD, "")
      this.REON_MTRL_CD_LIST = await this.getAsReonMtrlCode(this.MNTN_SPCE_CD,"")
    }

    
    


    if(this.LCLS_CD != '' && this.MNTN_SPCE_CD != '') {
      await this.searchMntnFlwCsCdList();
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //MMA_유지하자분류관리(공종) 코드 조회
    async searchMntnFlwCsCdList(next = '') {
      
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.MNTN_FLW_CS_CD_LIST = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      
      let postParam = {
        LCLS_CD: this.LCLS_CD,
        MNTN_SPCE_CD: this.MNTN_SPCE_CD,
        REON_MTRL_CD: this.REON_MTRL_CD,
        MNTN_FLW_TP_CD: this.MNTN_FLW_TP_CD,
        MNTN_CSTP_CD: this.MNTN_CSTP_CD,
        MNTN_CON_CD: this.MNTN_CON_CD,
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis',
        "ROW_CNT" : this.pagination.rowsPerPage,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnFlwCsCdList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.MNTN_FLW_CS_CD_LIST = [...this.MNTN_FLW_CS_CD_LIST, ...response.DATA] ;
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

    getResponseData (response, strHeadText) {
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


    //바로처리 시설구분(대분류) 코드 목록 조회
    async getAsLclsCode(strHeadText = "") {
        const postParam = {};
        const headParam = {head: {}};
        const response = await this.common_postCall("/phone-api/as/common/selectCotisLclsCdList", postParam, headParam);
        const responseData = this.getResponseData(response, strHeadText);
        return responseData;
    },


    //시설구분(대분류) 변경 시 공간 코드 목록 조회
    async changeLclsCd(item) {
      this.MNTN_SPCE_CD = '';
      this.MNTN_SPCE_CD_LIST = await this.getAsMntnSpceCode(item, "")
    },

    //바로처리 공간 코드 목록 조회
    async getAsMntnSpceCode(lclsCd, strHeadText = "") {
        const postParam = {
            LCLS_CD: lclsCd
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnSpceCdList", postParam, headParam);
        const responseData = this.getResponseData(response, strHeadText);
        return responseData;
    },


    //공간 변경 시 부위자재 코드 목록 조회
    async changeMntnSpceCd(item) {
      this.REON_MTRL_CD = '';
      this.REON_MTRL_CD_LIST = await this.getAsReonMtrlCode(item, "")
    },

    //부위자재 코드 목록 조회
    async getAsReonMtrlCode(mntnSpceCd, strHeadText = "") {
        const postParam = {
            LCLS_CD: this.LCLS_CD,
            MNTN_SPCE_CD: mntnSpceCd
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisReonMtrlCdList", postParam, headParam);
        const responseData = this.getResponseData(response, strHeadText);
        return responseData;
    },


    //부위자재 변경 시 AS유형 코드 목록 조회
    async changeReonMtrlCd(item) {
      this.MNTN_FLW_TP_CD = '';
      this.MNTN_FLW_TP_CD_LIST = await this.getAsMntnFlwTpCode(item, "")
    },

    //AS유형 코드 목록 조회
    async getAsMntnFlwTpCode(reonMtrlCd, strHeadText = "") {
        const postParam = {
          LCLS_CD: this.LCLS_CD,
          MNTN_SPCE_CD: this.MNTN_SPCE_CD,
          REON_MTRL_CD: reonMtrlCd
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnFlwTpCdList", postParam, headParam);
        const responseData = this.getResponseData(response, strHeadText);
        return responseData;
    },


    //AS유형 변경 시 공종 코드 목록 조회
    async changeMntnFlwTpCd(item) {
      this.MNTN_CSTP_CD = '';
      this.MNTN_CSTP_CD_LIST = await this.getAsMntnCstpCode(item, "")
    },

    //공종 코드 목록 조회
    async getAsMntnCstpCode(mntnFlwTpCd, strHeadText = "") {
        const postParam = {
          LCLS_CD: this.LCLS_CD,
          MNTN_SPCE_CD: this.MNTN_SPCE_CD,
          REON_MTRL_CD: this.REON_MTRL_CD,
          MNTN_FLW_TP_CD: mntnFlwTpCd
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnCstpCdList", postParam, headParam);
        const responseData = this.getResponseData(response, strHeadText);
        return responseData;
    },


    //공종 변경 시 공사 코드 목록 조회
    async changeMntnCstpCd(item) {
      this.MNTN_CON_CD = '';
      this.MNTN_CON_CD_LIST = await this.getAsMntnConCode(item, "")
    },

    //공사 코드 목록 조회
    async getAsMntnConCode(mntnCstpCd, strHeadText = "") {
        const postParam = {
          LCLS_CD: this.LCLS_CD,
          MNTN_SPCE_CD: this.MNTN_SPCE_CD,
          REON_MTRL_CD: this.REON_MTRL_CD,
          MNTN_FLW_TP_CD: this.MNTN_FLW_TP_CD,
          MNTN_CSTP_CD: mntnCstpCd
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnConCdList", postParam, headParam);
        const responseData = this.getResponseData(response, strHeadText);
        return responseData;
    },

    //검색 조건 초기화.
    initSrchCondition() {
      this.LCLS_CD = '';
      this.MNTN_SPCE_CD = '';
      this.REON_MTRL_CD = '';
      this.MNTN_FLW_TP_CD = '';
      this.MNTN_CSTP_CD = '';
      this.MNTN_CON_CD = '';
    },


    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      this.$emit("setItem", this.SEL_ROW);
      this.$emit("sendDataToParent", this.SEL_ROW);
      this.$eventBus.$emit('closeSearchPopup');
    }
      
  },
};
</script>

<style lang="scss" scoped>

</style>