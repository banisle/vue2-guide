<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
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
          지역본부
        </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="선택"
                    :items="ARA_HDQ_CD_LIST"
                    v-model="srchParam.srchAraHdqCd"
                    @change="initIcpr"
                    ref="srchParam.srchAraHdqCd"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
        <span class="pl-label">
          업체
        </span>
              <div class="pl-desc">
                <v-text-field
                    style="width: 271px;"
                    :disabled="!mixin_isEmpty(srchParam.srchFrmCd)"
                    class="pl-form is-search type-middle"
                    placeholder="검색어 입력"
                    clearable
                    v-model="srchParam.srchFrmNm"
                    @keydown.enter="openIcpr"
                >
                  <template v-slot:append>
                    <v-btn
                        @click="openIcpr"
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
                @click="getStatsHpcType"
                >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">해피콜 처리불만 유형</strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ itemsRowSpan.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>
          </div>
        </div>
        <v-data-table
          class="pl-grid is-mt-s is-rowspan is-header-lg"
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          fixed-header
          item-key="ROW_NUMBER"
          :loading="isLoading"
          height="calc(100vh - 296px)"
          :items-per-page="itemsRowSpan.length"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          >
          <!-- 합계 -->
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <colgroup>
                  <col v-for="(col, ROW_NUMBER) in headersRowSpan" :key="ROW_NUMBER" :width=col.width />
                </colgroup>
                <tbody >
                  <tr >
                    <td class="pl-grid-sum-head text-center" colspan="3" >합계</td>
                    <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC1_CNT") }} </td>
                    <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC2_CNT") }} </td>
                    <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC3_CNT") }} </td>
                    <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC4_CNT") }} </td>
                    <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC5_CNT") }} </td>
                    <td class="text-right"> {{ mixin_sum_field(this.itemsRowSpan, "HC6_CNT") }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- dialog: 업체검색 -->
    <v-dialog
        v-if="dialogFindAsIcpr"
        v-model="dialogFindAsIcpr"
        width="1410"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="담당자 검색"
          @hide="mixin_hideDialog('FindAsIcpr')"
          @="submitDialog('FindAsIcpr')"
      >
        <template slot="body">
          <CompoFindAsIcpr
              :DataProp="{ARA_HDQ_CD : srchParam.srchAraHdqCd}"
              @setItem="setIcpr"
              @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>


<script>
import CompoFindAsIcpr from "@/components/CompoFindAsIcpr.vue";

export default {
  name: 'MENU_STA_M2500', //해피콜 처리불만 유형
  components: {
    CompoFindAsIcpr
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
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '12%', sortable: false },
        { text: '업체명', value: 'FRM_NM', align: '', width: '', sortable: false },
        { text: '보수처리불만', value: 'HC1_CNT', align: 'right', width: '11%', sortable: false },
        { text: '허위보고', value: 'HC2_CNT', align: 'right', width: '11%', sortable: false },
        { text: '보수처리지연', value: 'HC3_CNT', align: 'right', width: '11%', sortable: false },
        { text: '뒷마무리불만', value: 'HC4_CNT', align: 'right', width: '11%', sortable: false },
        { text: '약속미이행', value: 'HC5_CNT', align: 'right', width: '11%', sortable: false },
        { text: '불친절', value: 'HC6_CNT', align: 'right', width: '11%', sortable: false },
      ],
      itemsRowSpan: [
        {
          ROW_NUMBER: 1,
          ARA_HDQ_NM: '강원지역본부',
          FRM_NM: '경인소방이엔지',
          HC1_CNT: 10,
          HC2_CNT: 10,
          HC3_CNT: 10,
          HC4_CNT: 10,
          HC5_CNT: 10,
          HC6_CNT: 10,

        }
      ],
      headersExcel : [],
      srchParam : {
        srchStartDt : this.$moment().format("YYYY-MM-DD"),
        srchEndDt : this.$moment().format("YYYY-MM-DD"),
        srchCustcoId : '4',
        srchAraHdqCd : '',
        srchFrmCd : '',
        srchFrmNm : '',
      },
      isLoading : false,
      HOUR_DROP : Array.from({ length: 24 }, (_, i) => ({ text: `${i}시`, value: i })),
      dialogFindAsIcpr : false,

      ARA_HDQ_CD_LIST : [],
      HPC_SURVEY_LIST : [],
    }
  },
  async created() {
    //지역본부 목록 - ARA_HDQ_CD_LIST에 설정함.
    await this.mixinAsGetAsAraHdqCdList();
  },
  mounted() {
  },
  methods: {
    openIcpr(){
      if(this.mixin_isEmpty(this.srchParam.srchAraHdqCd)){
        this.setDropDown('srchParam.srchAraHdqCd');
        this.showToastCaution({msg:'지역본부를 선택해 주세요.'})
      }else{
        this.mixin_showDialog('FindAsIcpr')
      }
    },
    setIcpr(item) {
      this.srchParam.srchFrmCd = item.FRM_CD;
      this.srchParam.srchFrmNm = item.FRM_NM;
      this.mixin_hideDialog('FindAsIcpr')
    },
    initIcpr(){
      this.srchParam.srchFrmCd = '';
      this.srchParam.srchFrmNm = '';
    },
    async getStatsHpcType(){
      this.itemsRowSpan=[];
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsHpcType'
      let postParam = {
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_ARA_HDQ_CD : this.srchParam.srchAraHdqCd,
        SRCH_FRM_CD : this.srchParam.srchFrmCd,
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
              if (key.includes("CNT")) {
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            this.itemsRowSpan.push(item)
          })
        }else{
          this.showAlertCaution({msg:'조회 중 문제가 발생했습니다.'})
        }
      }catch(e){
        this.isLoading = false
      }
      this.isLoading = false
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