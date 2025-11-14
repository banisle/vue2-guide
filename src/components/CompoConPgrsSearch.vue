<template>
  <div>
    <!-- search -->
    <div class="px-6 py-3">
      <div class="pl-form-inline-wrap mt-2">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역
          </span>
          <div class="pl-desc">
            <v-select
                v-model="SRCH_ARA_NM"
                :items="['전체','서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도','강원특별자치도','충청북도','충청남도','전북특별자치도','전라남도','경상북도','경상남도','제주특별자치도']"
                class="pl-form type-middle is-md"
                placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" >
          <span class="pl-label">
            지구명
          </span>
          <div class="pl-desc flex-grow-1">
            <v-text-field
              v-model="SRCH_CONTS"
              class="pl-form type-middle is-auto"
              placeholder="유형 또는 공고명을 입력"
              @keydown.enter="selectGridList()"
            />
          </div>
        </div>
        <div>
          <v-btn class="pl-btn is-icon" @click="selectGridList()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="[srchReset(),selectGridList()]"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- grid -->
    <div class="is-border-top px-6 py-3">
      <div class="pl-grid-top">
        <div class="pl-grid-top-left">
<!--          <span class="pl-bullet-txt is-blue">공고중, 접수중인 공고가 모두 조회됩니다.</span>-->
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 건</span>
        </div>
      </div>
      <v-data-table
        class="pl-grid is-mt-s"
        :headers="GRID.HEADER"
        :items="GRID.ITEMS"
        fixed-header
        item-key="index"
        :style="`${ !isPopup ? 'height: calc(-435px + 100vh)' : 'height: calc(-295px + 100vh)' }`"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        :loading="isLoading"
        @page-count="pageCount = $event">

        <!-- 게시일 -->
        <template v-slot:item.CSST_DT="{ item }">
          <span v-if="!mixin_isEmpty(item.CSST_DT)">
            {{ mixin_convertDate(item.CSST_DT, 'yyyy.MM.dd') }}
          </span>
          ~
          <span v-if="!mixin_isEmpty(item.CCW_DT)">
            {{ mixin_convertDate(item.CCW_DT, 'yyyy.MM.dd') }}
          </span>
        </template>

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
          보기 {{ mixin_getPagePeriod(GRID.ITEMS, page) }} / {{ GRID.ITEMS_TOT_CNT.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="selectGridList('next')"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

    <v-dialog
        v-model="dialogFileDownload"
        width="420"
        content-class="pl-top-profile-dialog type-center"
        persistent>
      <compo-dialog
          header-title="개인 정보"
          @hide="mixin_hideDialog('FileDownload')"
      >
        <template slot="body">

              <div v-for="(file, fi) in selectedFiles" >
                <span class="d-flex align-center is-txt-sub mt-2" @click="openViewer(file.ID,file.EXT);">
                  <a href="#"  ><img width="20px" height="20px" :src="`/image/file_ext_icon/${ file.EXT.toUpperCase() }.png`" @error="function(e){e.target.src='/image/file_ext_icon/Default.png'}" style="background-size: contain;">
                  <strong class="ml-1" style="flex: 0 0 80px">{{ file.NM }}</strong></a>
                </span>
              </div>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CompoRealTalkLogSearch', //공고문 검색
  components: {
  },
  props:{
    popData: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      isPopup: true,
      isLoading: false,
      SRCH_ARA_NM: '전체',
      SRCH_CONTS : '',
      SRCH_PAN_KD: "",
      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,
      GRID: {
        HEADER: [
          { text: '번호', value: 'NO', align: 'center', width: '50px', sortable: false, },
          { text: '지역', value: 'ARA_NM', align: 'center pl-text-pre-wrap', width: '120px', sortable: false, },
          { text: '지구명', value: 'BZDT_NM', align: 'center', width: '150px', sortable: false, },
          { text: '단지', value: 'BNM', align: 'center', width: '100px', sortable: false, },
          { text: '세대수', value: 'HSH_CNT', align: 'center', width: '80px', sortable: false, },
          { text: '공사기간', value: 'CSST_DT', align: 'center', width: '225px', sortable: false, },
          { text: '공정율(%)', value: 'PRCS_RT', align: 'center', width: '80px', sortable: false, },
          { text: '문의처', value: 'IQY_TLNO_RN_CTS', align: 'center', width: '150px', sortable: false, },
        ],
        ITEMS_TOT_CNT:0,
        ITEMS: []
      },
      dialogFileDownload: false,
      selectedItem:{},
      selectedFiles:[],

    }
  },
  methods: {
    srchReset() {
      this.SRCH_PAN_KD = '';
      this.SRCH_ARA_NM = '전체';
      this.SRCH_CONTS = "";
    },
    async selectGridList(next) {
      this.isLoading = true;
      if (next !== 'next'){
        this.GRID.ITEMS = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let postParam = {
        SRCH_ARA_NM: this.SRCH_ARA_NM === '전체'?'':this.SRCH_ARA_NM,
        SRCH_CONTS: this.SRCH_CONTS,
      }
      let headParam = {
        head: {
          ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : 'Y'
        }
      };
      const response = await this.common_postCall("/system-api/clcn/selectConPgrsList", postParam, headParam);
      if(response && !response.HEADER.ERROR_FLAG) {
        let responseData = response.DATA;
        responseData.map((item,idx) => {
          responseData[idx]["NO"] = response.HEADER.TOT_COUNT - ((this.pagination.page-1) * this.pagination.rowsPerPage) - idx;
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.GRID.ITEMS.length > 0) this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
        this.pagination.page += 1;
      }
      this.isLoading = false;
    },
  },
  mounted() {
  },
  created() {
    this.selectGridList();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>