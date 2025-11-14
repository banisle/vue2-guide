<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          상담일자
        </span>
        <div class="pl-desc">
          <div class="d-flex">
            <compo-date-range-picker
                :StartDayProp.sync="srchParam.srchStartDt"
                :EndDayProp.sync="srchParam.srchEndDt"
                :IsViewDropPickerProp="false"
                :selectTermProp="true"
                @startDayChange="()=>{ }"
                @endDayChange="()=>{ }"
                ParentStyleProp="width: 370px"
            />
          </div>
        </div>
      </div>

      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="getStatsVocHdqResult"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">지역본부별집계</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              :DataHeaderProp="headersExcel"
              :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
              :FileNameProp="`지역본부별_집계_${srchParam.srchStartDt}~${srchParam.srchEndDt}`"
              SheetNameProp="지역본부별집계"
              HeaderColorProp="00B0F0"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan "
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        :loading="isLoading"
        item-class="cellClass"
        fixed-header
        item-key="ROW_NUMBER"
        height="598px"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        @dblclick:row="showDetail()"
        :page.sync="page"
        @page-count="pageCount = $event">

        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, ROW_NUMBER) in headersRowSpan" :key="ROW_NUMBER" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" colspan="2">합계</td>

                  <td class="text-right" >{{ this.totCntObject.ASSGN_CNT }}</td>
                  <td class="text-right" >{{ this.totCntObject.COMPL_PERCENT }}</td>
                  <td class="text-right" >{{ this.totCntObject.TOT_CNT }}</td>
                  <td class="text-right" >{{ this.totCntObject.DELAY_CNT }}</td>
                  <td class="text-right" >{{ this.totCntObject.COMPL_CNT }}</td>
                  <td class="text-right" >{{ this.totCntObject.COMPN_CNT }}</td>
                  <td class="text-right" >{{ this.totCntObject.UNKIND_CNT }}</td>
                  <td class="text-right" >{{ this.totCntObject.KIND_CNT }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-data-table>

    </div>

  </div>
</template>

<script>
export default {
  name: 'STA_M1800_TAB02', //지역본부별집계
  components: {
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      headersRowSpan: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '구분', value: 'ARA_HDQ_NM', align: '', width: '', sortable: false },
        { text: '접수건', value: 'ASSGN_CNT', align: 'center', width: '', sortable: false },
        { text: '불만율', value: 'COMPL_PERCENT', align: 'center', width: '', sortable: false },
        { text: '합계', value: 'TOT_CNT', align: 'center', width: '', sortable: false },
        { text: '처리지연', value: 'DELAY_CNT', align: 'center', width: '', sortable: false },
        { text: '처리불만', value: 'COMPL_CNT', align: 'center', width: '', sortable: false },
        { text: '피해보상', value: 'COMPN_CNT', align: 'center', width: '', sortable: false },
        { text: '직원불친절', value: 'UNKIND_CNT', align: 'center', width: '', sortable: false },
        { text: '직원친절', value: 'KIND_CNT', align: 'center', width: '', sortable: false },
      ],
      headersExcel: [],
      itemsRowSpan: [],
      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCuttZone : [],
        srchCustcoId : '4',
        srchDeptId : '',
        srchCallTp : '',
        srchRcptChnCd : '',
      },
      selectedCustcoItem : {},
      selectedDeptItem : {},
      totCntObject : {},
      isLoading : false,
    }
  },
  created() {
    let tempHeader = _.cloneDeep(this.headersRowSpan)
    tempHeader.map(item=>{
      if(this.mixin_isEmpty(item.width)) {
        item.width = '120px'
      }else if(Number(item.width.replaceAll('%',''))< 20){
        item.width = '120px'
      }
      this.headersExcel.push(item)
    })
  },
  mounted() {
  },
  methods: {
    async getStatsVocHdqResult(){
      this.itemsRowSpan = []
      this.totCntObject = {}
      this.isLoading = true
      let sUrl = '/api/biz/common/select/selectStatsVocHdqResult'
      let postParam = {
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')
      }
      let headParam ={
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsVocMapper',
        },
        timeout : 300000
      }

      try{
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            if (item.ARA_HDQ_CD === '0') {
              this.totCntObject = item
            } else {
              this.itemsRowSpan.push(item)
            }
            this.isLoading = false;
          })
        }
      }catch(e){
        this.isLoading = false
      }
    }
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>