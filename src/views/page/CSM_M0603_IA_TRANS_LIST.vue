<template>
  <div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="gridIaList"
      fixed-header
      item-key="index"
      height="571px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      @dblclick:row=""
      :page.sync="page"
      :loading="isLoading"
      no-data-text="등록된 데이터가 없습니다"
      @page-count="pageCount = $event">
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
        보기 {{ mixin_getPagePeriod(gridIaList, page) }} / {{ gridIaList.length }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp="pagination.nextDisabled"
          @btnClick="getAllIaList(true)"
        ></compo-tooltip-btn>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M0603_IA_TRANS_LIST', //관심지역 리스트
  props: {
    ItmesLengthProp:{
      type: Number,
    },
    DataProp : {
      type : Array,
      default : ()=>{
        return []
      }
    },
    SrchProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    },
    srchTrigger : {
      type : Boolean,
      default : false
    },
  },
  components: {
  },
  data() {
    return {

      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,40,60,80,100],
      ROW_PER_PAGE: 20,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'CNSLT_DIV_NM', align: 'left', width: '15%',sortable: false },
        { text: '시/도', value: 'SIDO_NM', align: 'left', width: '8%',sortable: false },
        { text: '시/군/구', value: 'SIGUNGU_NM', align: 'left', width: '10%', sortable: false },
        { text: '지구명', value: 'JIGU_NM', align: 'left', width: '', sortable: false },
        { text: '연락처', value: 'MOBILE', align: 'left', width: '12%', sortable: false },
        { text: '센터구분', value: 'CENTER_NM', align: 'left', width: '15%', sortable: false },
        { text: '수정일', value: 'V_UPD_DT', align: 'left', width: '9%', sortable: true },
      ],
      items: [
        { index: 7341, type00: '통합공공임대', type01: '경기', type02: '과천시', type03: '선택안함', type04: '010-1004-1004', type05: '마이홈상담센터', type06: '2024-06-20', },
        { index: 7342, type00: '국민임대', type01: '경기', type02: '과천시', type03: '선택안함', type04: '010-1004-1004', type05: '마이홈상담센터', type06: '2024-06-20', },
        { index: 7343, type00: '행복주택', type01: '경기', type02: '과천시', type03: '선택안함', type04: '010-1004-1004', type05: '마이홈상담센터', type06: '2024-06-20', },
        { index: 7344, type00: '국민임대', type01: '경기', type02: '과천시', type03: '선택안함', type04: '010-1004-1004', type05: '마이홈상담센터', type06: '2024-06-20', },
        { index: 7345, type00: '통합공공임대', type01: '경기', type02: '과천시', type03: '선택안함', type04: '010-1004-1004', type05: '마이홈상담센터', type06: '2024-06-20', },
      ],

      totCnt : 0,
      isLoading : false,
      pagination: {
        PAGES_CNT : 1,
        ROW_CNT : 500,
        nextDisabled : false
      },
      gridIaList : [],
    }
  },
  methods: {
    updateGridLength() {
      this.$emit('updateGridLength', this.gridTotCnt);
    },
    async getAllIaList(next){
      this.isLoading = true;
      if( !next ){
        this.gridIaList = [];
        this.pagination.PAGES_CNT = 1
        this.pagination.nextDisabled = false;
      }
      let sUrl = '/api/biz/common/select/selectAllIaList'
      let postParam = {
        SRCH_DEL_DT : this.SrchProp.srchDelDt.replaceAll('-','')+'235959',
        SRCH_DT : this.SrchProp.srchDt.replaceAll('-','')+'235959',
        SRCH_DIV_CD : this.SrchProp.srchDivCd,
        SRCH_SIGUNGU_TRGT : this.SrchProp.srchSigunguTrgt ? "Y" : "N",
        SIDO_ID : this.SrchProp.srchZone[0],
        SIGUNGU_ID : this.SrchProp.srchZone[1],
        JIGU_ID : this.SrchProp.srchZone[2],
        SRCH_CENTER_CD : this.SrchProp.srchCntrCd,
      }

      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper',
          sn : 'selectAllIaList',
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        }
      }
      const response = await this.common_postCall(sUrl,postParam,headParam)
      if( !response.HEADER.ERROR_FLAG){
        this.gridTotCnt = response.HEADER.TOT_COUNT;
        this.pagination.PAGES_CNT++
        response.DATA.map(item=>{
          this.gridIaList.push(item)
        })
      }
      if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        if(response.HEADER.next === true){
          this.pagination.nextDisabled = false //버튼 활성화
        }else{
          this.pagination.nextDisabled = true  //버튼 비활성화
        }
      }
      this.isLoading = false;
    },
  },
  mounted() {
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    // gridItems가 변경될 때마다 부모에게 업데이트된 길이를 전달
    srchTrigger() {
      this.getAllIaList(false)
    },
    gridIaList() {
      this.updateGridLength();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>