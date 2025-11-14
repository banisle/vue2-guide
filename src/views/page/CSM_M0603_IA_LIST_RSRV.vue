<template>
  <div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="gridRsrvList"
      fixed-header
      item-key="index"
      height="571px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :loading="isLoading"
      @dblclick:row=""
      :page.sync="page"
      no-data-text="등록된 데이터가 없습니다"
      @page-count="pageCount = $event">
      <!-- 유형 툴팁 -->
      <template v-slot:item.SMS_MSG="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.SMS_MSG }}</span>
          </template>
          <span>{{ item.SMS_MSG }}</span>
        </v-tooltip>
      </template>
      <!-- 발송 -->
      <template v-slot:item.BTN_COL="{ item }">
        <v-btn class="pl-btn is-esp is-sm">즉시</v-btn>
        <v-btn class="pl-btn is-esp3 is-sm ml-1">취소</v-btn>
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
        보기 {{ mixin_getPagePeriod(gridRsrvList, page) }} / {{ gridRsrvList.length }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp="pagination.nextDisabled"
          @btnClick="getIaRsrvList(true)"
        ></compo-tooltip-btn>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M0603_IA_LIST_RSRV', //예약 현황
  props: {
    ItmesLengthProp:{
      type: Number,
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
        { text: '구분', value: 'SE_NM', align: 'left', width: '8%',sortable: false },
        { text: '유형', value: 'GROUP_NM', align: 'left', width: '',sortable: false },
        { text: '발송 건수', value: 'SEND_CNT', align: 'center', width: '8%', sortable: false },
        { text: '날짜', value: 'SEND_DT', align: 'center', width: '12%', sortable: true },
        { text: '시간', value: 'SEND_TIME', align: 'center', width: '10%', sortable: false },
        { text: '발송내용', value: 'SMS_MSG', align: 'left', width: '15%', sortable: false },
        { text: '발송', value: 'BTN_COL', align: 'center', width: '12%', sortable: false },
      ],
      isLoading : false,
      gridRsrvList : [],
      pagination: {
        PAGES_CNT : 1,
        ROW_CNT : 500,
        nextDisabled : false
      },
    }
  },
  created() {
    this.getIaRsrvList(false)
  },
  mounted() {

  },
  methods: {
    updateGridLength() {
      this.$emit('updateGridLength', this.gridTotCnt);
    },
    async getIaRsrvList(next){
      this.isLoading = true;
      if( !next ){
        this.gridRsrvList = [];
        this.pagination.PAGES_CNT = 1
        this.pagination.nextDisabled = false;
      }
      let sUrl = '/api/biz/common/select/selectIaRsrvList'
      let postParam = {
      }

      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper',
          sn : 'selectIaRsrvList',
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
          this.gridRsrvList.push(item)
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
    }
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    gridRsrvList() {
      this.updateGridLength();
    },
    srchTrigger() {
      this.getIaRsrvList(false)
    }
  },
};
</script>

<style lang="scss" scoped>

</style>