<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          분배일자
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
              :StartDayProp.sync="srchParam.srchStartDt"
              :EndDayProp.sync="srchParam.srchEndDt"
              :IsViewDropPickerProp="false"
              :selectTermProp="true"
              @startDayChange="()=>{ }"
              @endDayChange="()=>{ }"
          />
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
              :items="ARA_HDQ_CD_LIST"
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
          @click="getStatsSchdlPrcsMgof"
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
          <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headersGridExcel"
              :DataBodyProp="itemsRowSpan"
              :FileNameProp="`스케줄러_진행실적_단지별_${srchParam.srchStartDt.replaceAll('-','')}_${srchParam.srchEndDt.replaceAll('-','')}`"
              SheetNameProp="단지별_진행실적"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        :loading="isLoading"
        item-key="ROW_NUMBER"
        height="598px"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
	no-data-text="등록된 데이터가 없습니다."
        >
        <template v-slot:item="{ item }">
          <tr class="text-center"
              :key="item.ROW_NUMBER">
            <td v-for="(col,idx) in headersRowSpan" :key="col.value"
                :class="col.value.includes('_CNT')? item[col.value] < 1? 'text-right' : 'text-right is-txt-blue is-hover' : 'text-center'"
                @click="()=>{
                if( idx > 1 && item[col.value] > 0 ) clickedRow(col, item)
              }"
            >
              {{ item[col.value] }}
            </td>
          </tr>
        </template>

        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, idx) in headersRowSpan" :key="idx" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" colspan="3" >합계</td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "ASSGN_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "RSRV_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "VISIT_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "EXP_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "TERMI_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "END_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "SURVEY_CNT")) }}
                  </td>
                  <td class="text-right" >
                    {{ mixin_convertNumToComma(mixin_sum_field(this.itemsRowSpan, "ING_CNT")) }}
                  </td>

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
import axios from "axios";

export default {
  name: 'STA_M1300_TAB02', //단지별 통계
  components: {
  
  },
  data() {
    return {
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '150px', sortable: false },
        { text: '단지', value: 'MGOF_NM', align: 'center', width: '150px', sortable: false },
        { text: '분배건수', value: 'ASSGN_CNT', align: 'center', width: '', sortable: false },
        { text: '통화예약건', value: 'RSRV_CNT', align: 'center', width: '', sortable: false },
        { text: '방문확정건', value: 'VISIT_CNT', align: 'center', width: '', sortable: false },
        { text: '제외', value: 'EXP_CNT', align: 'center', width: '', sortable: false },
        { text: '종결', value: 'TERMI_CNT', align: 'center', width: '', sortable: false },
        { text: '완료', value: 'END_CNT', align: 'center', width: '', sortable: false },
        { text: '해피콜', value: 'SURVEY_CNT', align: 'center', width: '', sortable: false },
        { text: '진행중(미처리)', value: 'ING_CNT', align: 'center', width: '', sortable: false },
      ],
      headersGridExcel: [
        { text: 'No', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '150px', sortable: false },
        { text: '단지', value: 'MGOF_NM', align: 'center', width: '150px', sortable: false },
        { text: '분배건수', value: 'ASSGN_CNT', align: 'center', width: '100px', sortable: false },
        { text: '통화예약건', value: 'RSRV_CNT', align: 'center', width: '100px', sortable: false },
        { text: '방문확정건', value: 'VISIT_CNT', align: 'center', width: '100px', sortable: false },
        { text: '제외', value: 'EXP_CNT', align: 'center', width: '100px', sortable: false },
        { text: '종결', value: 'TERMI_CNT', align: 'center', width: '100px', sortable: false },
        { text: '완료', value: 'END_CNT', align: 'center', width: '100px', sortable: false },
        { text: '해피콜', value: 'SURVEY_CNT', align: 'center', width: '100px', sortable: false },
        { text: '진행중(미처리)', value: 'ING_CNT', align: 'center', width: '100px', sortable: false },
      ],
      itemsRowSpan: [],
      ARA_HDQ_CD_LIST : [],
      srchParam: {
        srchStartDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCustcoId : '4',
        srchAraHdqCd: '',
        srchMgofNm: '',
        srchMgofCd: '',
      },
      isLoading: false,
    }
  },
  async created() {
    //지역본부 목록 - ARA_HDQ_CD_LIST에 설정함.
    await this.mixinAsGetAsAraHdqCdList();
  },
  methods: {
    async getStatsSchdlPrcsMgof(){
      this.itemsRowSpan = []
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsSchdlPrcsMgof'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_ARA_HDQ_CD : this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD : this.srchParam.srchMgofCd,
      }
      let headParam ={
        head : {
          ns : 'lhcs.statistics.dao.xml.StatisticsFlawMapper'
        },
        timeout : 300000,
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          Object.keys(item).some((key) => {
            if (key.includes("CNT")) {
              item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
            }
          });
          this.itemsRowSpan.push(item)
        })
      }else{
        this.showAlertCaution({msg : '조회 중 문제가 발생하였습니다.'})
      }
      this.isLoading = false;
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
    resetSrchMgof(){
      this.srchParam.srchMgofNm  = '';
      this.srchParam.srchMgofCd  = '';
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
    async clickedRow(col, item){
      this.showToastInfo({msg:`${col.text} 엑셀 다운로드 시작`})

      let sUrl = '/api/statistics/Flaw/downloadStatsSchdlPrcs'

      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_MGOF_CD : item.MGOF_CD,
        CLICK_ITEM : col.value
      }
      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `스케줄러 목록_단지별_${col.text}.xlsx`; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    "srchParam.srchMgofNm":{
      handler(){
        if(this.mixin_isEmpty(this.srchParam.srchMgofNm)){
          this.srchParam.srchMgofCd = '';
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>