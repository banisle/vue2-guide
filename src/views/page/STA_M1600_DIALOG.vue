<template>
  <div class="pl-card-body">
    <div class="pl-grid-top">
      <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ detailItems.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="detailItems"
              :FileNameProp="fileName"
              SheetNameProp="업체_및_고객_접촉율"
              HeaderColorProp="00B0F0"
          ></compo-excel>
          <compo-tooltip-btn
              TitleProp="새로고침"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="srch"
          ></compo-tooltip-btn>
      </div>
    </div>
    <v-data-table
        class="pl-grid is-mt-s"
        :headers="headers"
        :items="detailItems"
        fixed-header
        item-key="ROW_NUMBER"
        height="710px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        :loading="isLoading"
        @page-count="pageCount = $event">
      <template v-slot:item.MGOF_TP_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
              <span
                  v-bind="attrs"
                  v-on="on">
              {{ item.MGOF_TP_NM }}</span>
          </template>
          <span>{{ item.MGOF_TP_NM }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.FLW_CTS="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
              <span
                  v-bind="attrs"
                  v-on="on">
              {{ item.FLW_CTS }}</span>
          </template>
          <span>{{ item.FLW_CTS }}</span>
        </v-tooltip>
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
        보기 {{ mixin_getPagePeriod(detailItems, page) }} / {{ detailItems.length }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'STA_M1600_DIALOG', //업체및고객 접촉 - 상세
  components: {},
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    SHOW_PROP: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '45px', sortable: false},
        {text: '분배일자', value: 'ASSGN_YMD', align: 'center', width: '80px', sortable: false},
        {text: '팀', value: 'DEPT_NM', align: 'center', width: '100px', sortable: false},
        {text: '상담사', value: 'USER_NM', align: 'center', width: '60px', sortable: false},
        {text: '공급유형', value: 'MGOF_TP_NM', align: 'center', width: '100px', sortable: false},
        {text: '단지유형', value: 'MNTN_LS_TP_NM', align: 'center', width: '80px', sortable: false},
        {text: '본부명', value: 'ARA_HDQ_NM', align: 'center', width: '100px', sortable: false},
        {text: '단지코드', value: 'MGOF_CD', align: 'center', width: '', sortable: false},
        {text: '단지/동주소', value: 'MGOF_NM', align: 'center', width: '140px', sortable: false},
        {text: '동', value: 'BLDG_NO', align: ' pl-text-pre-wrap', width: '', sortable: false},
        {text: '호', value: 'HS_NO', align: ' pl-text-pre-wrap', width: '', sortable: false},
        {text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: ' pl-text-pre-wrap', width: '120px', sortable: false},
        {text: 'AS내용', value: 'FLW_CTS', align: ' pl-text-pre-wrap', width: '200px', sortable: false},
        {text: '처리상태', value: 'FLW_PGRS_SS_NM', align: ' pl-text-pre-wrap', width: '', sortable: false},
        {text: '공종', value: 'MNTN_RPSN_CSTP_NM', align: ' pl-text-pre-wrap', width: '30px', sortable: false},
        {text: '업체명', value: 'FRM_NM', align: ' pl-text-pre-wrap', width: '', sortable: false},
        {text: '시설구분', value: 'LCLS_NM', align: ' pl-text-pre-wrap', width: '', sortable: false},
        {text: '보수구분', value: 'FLW_DTL_DS_NM', align: ' pl-text-pre-wrap', width: '', sortable: false},
      ],
      detailItems: [],
      totCnt: 0,
      isLoading: false,
      fileName : '',


    }
  },
  created() {
    if (!this.mixin_isEmpty(this.DataProp.srchProp)) {
     this.srch()
    }
  },
  mounted() {
  },
  methods: {
    srch(){
      if(this.DataProp.srchProp.type ==='frmCustCntct'){
        this.getStatsFrmCustCntctDetail()
        this.fileName='상담사별_업체_및_고객_분배/미분배_상세'
      }else{
        this.headers.push({text: '최초접촉일자', value: 'MIN_REG_DT', align: ' pl-text-pre-wrap', width: '90px', sortable: false},)
        this.headers.push({text: '최종접촉일자', value: 'MAX_REG_DT', align: ' pl-text-pre-wrap', width: '90px', sortable: false},)
        this.getStatsFrstCntctPgrsDetail()
        this.fileName='업체별 고객 최초 접촉경과기간 상세'
      }
    },
    async getStatsFrmCustCntctDetail(next) {
      console.log(this.DataProp)
      this.isLoading = true
      this.detailItems = []
      let sUrl = '/api/biz/common/select/selectStatsFrmCustCntctDetail'
      let postParam = this.DataProp.srchProp
      let headParam = {
        head: {
          ns: 'lhcs.statistics.dao.xml.StatisticsFlawMapper',
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      this.totCnt = response.HEADER.TOT_COUNT
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          this.detailItems.push(item)
        })
      } else {
        this.showAlertCaution({msg: '조회 중 오류가 발생했습니다.'})
      }
      this.isLoading = false
    },
    async getStatsFrstCntctPgrsDetail(next) {
      console.log(this.DataProp)
      this.isLoading = true
      this.detailItems = []
      let sUrl = '/api/biz/common/select/selectStatsFrstCntctPgrsDetail'
      let postParam = this.DataProp.srchProp
      let headParam = {
        head: {
          ns: 'lhcs.statistics.dao.xml.StatisticsFlawMapper',
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      this.totCnt = response.HEADER.TOT_COUNT
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          this.detailItems.push(item)
        })
      } else {
        this.showAlertCaution({msg: '조회 중 오류가 발생했습니다.'})
      }
      this.isLoading = false
    },
  },
  computed: {},
  watch: {
    // DataProp: {
    //   handler(newValue, oldValue) {
    //     if (!this.mixin_isEmpty(newValue)) {
    //       this.getStatsFrmCustCntctDetail()
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
};
</script>

<style lang="scss" scoped>

</style>