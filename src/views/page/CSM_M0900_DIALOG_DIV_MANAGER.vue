<template>
  <div>
    <!-- search form -->
<!--    <div class="pl-grid-top">-->
<!--      <div class="pl-form-inline-wrap" style="width: 100%;">-->
<!--        <div class="pl-form-inline" style="width: 100%;">-->
<!--          <span class="pl-label">-->
<!--            동주소-->
<!--          </span>-->
<!--          <div class="pl-desc">-->
<!--            <v-text-field-->
<!--            class="pl-form type-middle flex-grow-1"-->
<!--            ></v-text-field>-->

<!--            <v-btn-->
<!--              class="pl-btn is-icon flex-grow-0"-->
<!--            >-->
<!--              <span class="pl-icon20 search"></span>-->
<!--              조회-->
<!--            </v-btn>-->
<!--            &lt;!&ndash; 툴팁 버튼 &ndash;&gt;-->
<!--            <compo-tooltip-btn-->
<!--              TitleProp="초기화"-->
<!--              ClassProp="pl-tooltip-btn flex-grow-0"-->
<!--              IconProp="pl-icon20 refresh"-->
<!--              TooltipPositionProp="bottom"-->
<!--            ></compo-tooltip-btn>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <!-- grid -->
    <v-data-table
      class="pl-grid is-hover is-mt-s has-control"
      :headers="headers"
      :items="BLDG_NO_LIST"
      v-model="chkRow"
      show-select
      fixed-header
      item-key="ROW_NUMBER"
      height="330px"
      width="100%"
      :items-per-page="BLDG_NO_LIST.length"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      :loading="isLoading"
      @page-count="pageCount = $event">
    </v-data-table>
<!--    <div class="pl-pager">-->
<!--      <div class="pl-pager-row" >-->
<!--        <span>페이지당 항목 수</span>-->
<!--        <v-select-->
<!--          class="pl-form"-->
<!--          :value="ROW_PER_PAGE"-->
<!--          :items="perPage"-->
<!--          :item-text="toString(ROW_PER_PAGE)"-->
<!--          @change="ROW_PER_PAGE = parseInt($event, 10);"-->
<!--        ></v-select>-->
<!--      </div>-->
<!--      <v-pagination-->
<!--        v-model="page"-->
<!--        :length="pageCount"-->
<!--        circle-->
<!--        :total-visible="7">-->
<!--      </v-pagination>-->

<!--      &lt;!&ndash; 더보기 다음 있을때만 노출 &ndash;&gt;-->
<!--      <span class="pl-pager-period">-->
<!--        보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}-->
<!--        <compo-tooltip-btn-->
<!--          TitleProp="다음 검색"-->
<!--          ClassProp="pl-tooltip-btn is-line"-->
<!--          IconProp="pl-icon20 arrow-next-paging"-->
<!--          TooltipPositionProp="bottom"-->
<!--        ></compo-tooltip-btn>-->
<!--      </span>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: 'CSM_M0900_DIALOG_DIV_MANAGER', //동별 상담사 분배
  components: {
  },
  props:{
    DataProp :{
      type : Object,
      default : ()=>{
        return {}
      }
    },
    EmitTriggerProp : {
      type : Boolean,
      default : false,
    },

  },
  data() {
    return {
      BLDG_NO_LIST : [],
      chkRow : [],
      MGOF_CD : '',


      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 10,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: '', width: '9%', sortable: false, },
        { text: '동번호', value: 'BLDG_NO', align: '', width: '9%', sortable: false, },
        { text: '동주소', value: 'BLDG_ADR', align: '', width: '', sortable: false, },
        { text: '배분상담사', value: 'TGT_USER_NM', align: 'center', width: '15%', sortable: false, },
      ],
      isLoading : false,
    }
  },
  async created() {
    if( !this.mixin_isEmpty(this.DataProp.MGOF_CD) ){
      await this.searchBldgNoList()
    }
  },
  mounted() {
  },
  methods: {
    //동 검색
    async searchBldgNoList() {
      this.chkRow = [];
      this.BLDG_NO_LIST = [];
      let postParam = {
        SRCH_MGOF_CD: this.DataProp.MGOF_CD,
      };
      let headParam = {head: {
          ns: 'lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper',
          sn: 'selectDngAssgnedUser',
        }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/select/selectDngAssgnedUser", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.BLDG_NO_LIST = response.DATA;
      }
      this.isLoading = false;
    },
    emitRow(){
      this.$emit("EMIT_ROW_DATA", this.chkRow);
    }

  },
  computed: {
  },
  watch: {
    DataProp(){
      if( !this.mixin_isEmpty(this.DataProp.MGOF_CD) ){
        this.DataProp.MGOF_CD
        this.searchBldgNoList()
      }
    },
    EmitTriggerProp(){
      if(!this.mixin_isEmpty(this.chkRow)){
        this.emitRow();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>