<template>
  <div>
    <!-- search -->
    <div class="px-6 py-3">
      <div class="pl-form-inline-wrap mt-2">
        <div class="pl-form-inline">
          <div class="pl-desc">
            <v-radio-group v-model="SRCH_PAN_KD" row class="pl-radio-group" >
              <v-radio
                  v-for="(rad01, index) in SRCH_PAN_KD_GROUP"
                  :key="SRCH_PAN_KD_GROUP[index].value"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
              >
              </v-radio>
            </v-radio-group>
          </div>
        </div>
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
        <div class="pl-form-inline">
          <span class="pl-label">
            상태
          </span>
          <div class="pl-desc">
            <v-select
                v-model="SRCH_PAN_SS"
                :items="['전체','공고중','접수중','접수마감','상담요청']"
                class="pl-form type-middle is-sm"
                placeholder="전체"
            />
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap mt-2">
        <div class="pl-form-inline flex-grow-1" >
          <span class="pl-label">
            유형 또는 공고명
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
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
          ></compo-tooltip-btn>
        </div>
      </div>
      <v-data-table
          class="pl-grid is-mt-s"
          :headers="GRID.HEADER"
          :items="GRID.ITEMS"
          fixed-header
          item-key="index"
          height="calc(-435px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          :loading="isLoading"
          @page-count="pageCount = $event">

        <!-- 게시일 -->
        <template v-slot:item.PAN_NT_ST_DTTM="{ item }">
          <span v-if="!mixin_isEmpty(item.PAN_NT_ST_DTTM)">
            {{ mixin_convertDate(item.PAN_NT_ST_DTTM, 'yyyy.MM.dd') }}
          </span>
        </template>
        <!-- 마감일 -->
        <template v-slot:item.CLSG_DT="{ item }">
          <span v-if="!mixin_isEmpty(item.CLSG_DT)">
            {{ mixin_convertDate(item.CLSG_DT, 'yyyy.MM.dd') }}
          </span>
        </template>
        <!-- 상태 -->
        <template v-slot:item.PAN_SS="{ item }">
          <span :class="` is-txt-${mixin_displayStatus(item.PAN_SS, 'STAT_LIST')}`" >{{ item.PAN_SS }}</span>
        </template>
        <template v-slot:item.ARA_NM="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on">
                {{ item.ARA_NM }}</span>
            </template>
            <span>{{ item.ARA_NM }}</span>
          </v-tooltip>
        </template>

        <!-- pdf -->
        <template v-slot:item.ATTACH_NMS="{ item }">
          <div class="spacing-wrap sp-4 justify-center">
            <div v-for="(file, fi) in item.ATTACH_NMS_ARR" >
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on"
                    @click="openViewer(item.ATTACH_PHY_NMS_ARR[fi], item.ATTACH_EXTS_ARR[fi])"
                    class="d-flex align-center justify-center"
                    :style="`cursor: pointer; width: 20px; height: 20px; background-color: ${ getExtColor(item.ATTACH_EXTS_ARR[fi]) }; overflow: hidden; border-radius: 6px;`">
                  <v-icon :class="`pl-icon30 file-${ item.ATTACH_EXTS_ARR[fi]  }`" style="background-size: contain;"></v-icon>
                </span>
                </template>
                <span v-if="item.ATTACH_EXTS_ARR[fi] === 'pdf'">공고문 보기</span>
                <span v-if="item.ATTACH_EXTS_ARR[fi] !== 'pdf'">다운로드</span>
              </v-tooltip>
            </div>
          </div>

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

  </div>
</template>

<script>
export default {
  name: 'CompoRealTalkLogSearch', //공고문 검색
  components: {
  },
  data() {
    return {
      isLoading: false,
      SRCH_ARA_NM: '전체',
      SRCH_PAN_SS: '전체',
      SRCH_CONTS : '',
      SRCH_PAN_KD: "",
      SRCH_PAN_KD_GROUP: [
        { text: "전체", value:"" },
        { text: "임대주택", value:"03" },
        { text: "분양주택", value:"02" },
        { text: "토지", value:"01" },
        { text: "상가", value:"04" },
        { text: "주택매입", value:"NULL" },
      ],

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
          { text: '종류', value: 'PAN_KD_CD_NM', align: 'center', width: '80px', sortable: false, },
          { text: '유형', value: 'AIS_TP_CD_NM', align: 'center', width: '140px', sortable: false, },
          { text: '공고명', value: 'PAN_NM', align: ' pl-text-pre-wrap', width: '', sortable: false, },
          { text: '지역', value: 'ARA_NM', align: 'center', width: '100px', sortable: false, },
          { text: '공고문', value: 'ATTACH_NMS', align: 'center', width: '80px', sortable: false, },
          { text: '게시일', value: 'PAN_NT_ST_DTTM', align: 'center', width: '80px', sortable: false, },
          { text: '마감일', value: 'CLSG_DT', align: 'center', width: '80px', sortable: false, },
          { text: '상태', value: 'PAN_SS', align: 'center', width: '80px', sortable: false, },
        ],
        ITEMS_TOT_CNT:0,
        ITEMS: []
      },

      // 상태 컬러
      STAT_LIST: [
        { code: '공고중', value: 'green'},
        { code: '접수중', value: 'red'},
        { code: '정정공고중', value: 'black'},
        { code: '접수마감', value: 'black'},
      ],
      fileExtList: [
        { name: 'file-pdf', color: '#AE0C00'},
        { name: 'file-hwp', color: '#35AEE7'},
        { name: 'file-xlsx', color: '#017338'},
        { name: 'file-zip', color: '#1E6FDA'},
      ],

    }
  },
  methods: {
    srchReset() {
      this.SRCH_PAN_KD = '전체';
      this.SRCH_ARA_NM = '전체';
      this.SRCH_PAN_SS = '전체';
      this.SRCH_CONTS = "";
    },
    openViewer( id, ext){
      if( ext === 'pdf' ) {
        this.$emit('ChangeTabView', "/upload/eai_panfile/" + id)
      }else {
        window.open("/upload/eai_panfile/" + id, '_blank');
      }
    },

    getExtName(ext){
      let extList = this.fileExtList

      for (let i = 0; i < extList.length; i++) {
        if (extList[i].name.split('-')[1] === ext) {
          return extList[i].name;
        }
      }
    },
    getExtColor(ext){
      let extList = this.fileExtList

      for (let i = 0; i < extList.length; i++) {
        if (extList[i].name.split('-')[1] === ext) {
          return extList[i].color;
        }
      }
    },
    async selectGridList(next) {
      this.isLoading = true;
      if (next !== 'next'){
        this.GRID.ITEMS = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let postParam = {
        SRCH_PAN_KD: this.SRCH_PAN_KD === '전체'?'':this.SRCH_PAN_KD,
        SRCH_ARA_NM: this.SRCH_ARA_NM === '전체'?'':this.SRCH_ARA_NM,
        SRCH_PAN_SS: this.SRCH_PAN_SS === '전체'?'':this.SRCH_PAN_SS,
        SRCH_CONTS: this.SRCH_CONTS,
      }
      let headParam = {
        head: {
          ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : 'Y'
        }
      };
      const response = await this.common_postCall("/system-api/clcn/selectList", postParam, headParam);
      if(response && !response.HEADER.ERROR_FLAG) {
        let responseData = response.DATA;
        responseData.map((item,idx) => {
          responseData[idx]["NO"] = response.HEADER.TOT_COUNT - ((this.pagination.page-1) * this.pagination.rowsPerPage) - idx;
          responseData[idx]["ATTACH_PHY_NMS_ARR"] = item.ATTACH_PHY_NMS.split("|");
          responseData[idx]["ATTACH_NMS_ARR"] = item.ATTACH_NMS.split("|");
          responseData[idx]["ATTACH_EXTS_ARR"] = item.ATTACH_NMS.split("|").map(row => {
            return this.mixin_getExtensionOfFilename(row);
          })
          responseData[idx]["ATTACH_IDS_ARR"] = item.ATTACH_IDS.split("|");
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