<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          해피콜일자
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
              :StartDayProp.sync="srchParam.srchStartDt"
              :EndDayProp.sync="srchParam.srchEndDt"
            :IsViewDropPickerProp="false"
            :selectTermProp="true"
            ParentStyleProp="width: 370px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
       <span class="pl-label">
          설문지
        </span>
        <div class="pl-desc">
          <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="SRCH_COMBO_PROP.HPC_SURVEY_LIST"
              v-model="srchParam.srchPaperId"
              item-text="PAPER_TITLE"
              item-value="PAPER_ID"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          지역본부
        </span>
        <div class="pl-desc">
          <v-select
              class="pl-form type-middle"
              placeholder="선택"
              :items="SRCH_COMBO_PROP.ARA_HDQ_CD_LIST"
              v-model="srchParam.srchAraHdqCd"
              @change="resetSrchMgof"
              ref="srchParam.srchAraHdqCd"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          단지
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form is-search type-middle is-lg"
            placeholder="검색어 입력"
            @keydown.enter="openSrchMgof"
            v-model="srchParam.srchMgofNm"
            clearable
            @change="()=>{
              if(mixin_isEmpty(srchParam.srchMgofNm)) srchParam.srchMgofCd = ''
            }"
          >
          <template v-slot:append>
            <v-btn
              @click="openSrchMgof"
              class="pl-btn has-icon-only">
              <span class="pl-icon20 in-search"></span>
            </v-btn>
          </template>
        </v-text-field>
        </div>
      </div>

      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="getStatsHpcResult"
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
              <strong class="pl-bullet-txt is-blue">단지별 통계</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
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
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan is-header-lg"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="index"
        height="calc(100vh - 346px)"
        :items-per-page="itemsRowSpan.length"
        :loading="isLoading"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        >
        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" colspan="3" >합계</td>
                  <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "CMPL_CNT") }} </td>
                  <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC_CNT") }} </td>
                  <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC_SUCC_CNT") }} </td>
                  <td class="text-right"> {{ mixin_avg_field(this.itemsRowSpan, "HC_SUCC_RATE") }} </td>
                  <td class="text-right"> {{ mixin_avg_field(this.itemsRowSpan, "EXMP_AVG") }} </td>
                  <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "DIS1_CNT") }} </td>
                  <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "DIS2_CNT") }} </td>
                  <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "DIS3_CNT") }} </td>
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
  name: 'CSM_M1102_TAB02', //해피콜 결과 통계 - 단지별
  components: {
    
  },
  props : {
    SRCH_COMBO_PROP : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '10%', sortable: false },
        { text: '업체명', value: 'DIV_NM', align: '', width: '', sortable: false },
        { text: '완료건수', value: 'CMPL_CNT', align: 'right', width: '9%', sortable: false },
        { text: '해피콜조사건수', value: 'HC_CNT', align: 'right', width: '9%', sortable: false },
        { text: '해피콜성공건수', value: 'HC_SUCC_CNT', align: 'right', width: '9%', sortable: false },
        { text: '해피콜성공률', value: 'HC_SUCC_RATE', align: 'right', width: '9%', sortable: false },
        { text: '평균점수', value: 'EXMP_AVG', align: 'right', width: '9%', sortable: false },
        { text: '처리불만', value: 'DIS1_CNT', align: 'right', width: '9%', sortable: false },
        { text: '품질불만', value: 'DIS2_CNT', align: 'right', width: '9%', sortable: false },
        { text: '허위보고', value: 'DIS3_CNT', align: 'right', width: '9%', sortable: false },
      ],
      itemsRowSpan: [],
      srchParam : {
        srchType : 'MGOF',
        srchStartDt : this.$moment().format("YYYY-MM-DD"),
        srchEndDt : this.$moment().format("YYYY-MM-DD"),
        srchCustcoId : '4',
        srchStartHour : '',
        srchEndHour : '',
        srchPaperId : '',
        srchAraHdqCd : '',
        srchHpcCd : '',
        srchMgofNm : '',
        srchMgofCd : '',
      },
      isLoading : false,
      HOUR_DROP : Array.from({ length: 24 }, (_, i) => ({ text: `${i}시`, value: i })),
    }
  },
  created() {
    this.setPaperId()
  },
  methods: {
    setPaperId(){
      if(!this.mixin_isEmpty(this.SRCH_COMBO_PROP.HPC_SURVEY_LIST[0])){
        this.srchParam.srchPaperId = this.SRCH_COMBO_PROP.HPC_SURVEY_LIST[0].PAPER_ID
      }
    },
    openSrchMgof(){
      if (this.mixin_isEmpty(this.srchParam.srchAraHdqCd)) {
        this.showToastCaution({
          msg: '지역본부를 선택하세요.', callAfter: () => {
            // this.setFocus("srchParam.srchAraHdqCd");
            this.setDropDown('srchParam.srchAraHdqCd');
          }
        })
      }else{
        this.mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD : this.srchParam.srchAraHdqCd ,MGOF_NM : this.srchParam.srchMgofNm}});
      }
    },
    setBldgAdr(item) {
      this.srchParam.srchAraHdqCd = item.ARA_HDQ_CD;
      this.srchParam.srchMgofCd = item.MGOF_CD;
      if (item.BLDG_ADR && item.BLDG_ADR != '') {
        this.srchParam.srchMgofNm = item.BLDG_ADR;
      } else {
        this.srchParam.srchMgofNm = item.MGOF_NM;
      }
    },
    resetSrchMgof(){
      this.srchParam.srchMgofNm  = '';
      this.srchParam.srchMgofCd  = '';
    },
    async getStatsHpcResult(){
      this.itemsRowSpan = []
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsHpcResult'
      let postParam ={
        SRCH_TYPE : this.srchParam.srchType,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_PAPER_ID : this.srchParam.srchPaperId,
        SRCH_ARA_HDQ_CD : this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD : this.srchParam.srchMgofCd,
      }
      let headParam = {
        head : {
          ns:'lhcs.statistics.dao.xml.StatisticsHappyCallMapper'
        },
        timeout : 300000
      }
      try{
        const response = await this.common_postCall(sUrl,postParam, headParam)
        if( !response.HEADER.ERROR_FLAG ){
          response.DATA.map(item=>{
            Object.keys(item).some((key) => {
              if(key.includes("CNT")){
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            this.itemsRowSpan.push(item)
          })
        }
      }catch(e){
        this.isLoading = false;
      }
      this.isLoading = false;
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    "SRCH_COMBO_PROP.HPC_SURVEY_LIST" :{
      handler(){
        this.setPaperId();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>