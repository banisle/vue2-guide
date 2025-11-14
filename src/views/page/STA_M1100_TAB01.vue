<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회월
        </span>
        <div class="pl-desc">
          <div class="d-flex">
            <compo-date-picker
              NoTitleProp
              PickerType="month"
              DateType="dateInput"
              :DateProp.sync="srchParam.srchYm"/>
          </div>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          채널
        </span>
        <div class="pl-desc">
          <v-select
              class="pl-form type-middle is-md"
              :items="common_rcpt_chn_list"
              v-model="srchParam.srchRcptChnCd"
              placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
                ref="srchParam.srchAraHdqCd"
                v-model="srchParam.srchAraHdqCd"
                :items="ARA_HDQ_CD_LIST"
                class="pl-form type-middle is-md"
                @change="resetSrchMgof"
                placeholder="선택"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="pl-form-inline">
          <span class="pl-label">
            단지
          </span>
        <div class="pl-desc">
          <v-text-field
              v-model="srchParam.srchMgofNm"
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력"
              @keyup.enter="openSrchMgof"
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
          @click="getStatsHdqMgofByDay"
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
              <strong class="pl-bullet-txt is-blue">일별 통계</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headersExcel"
              :DataBodyProp="[...itemsRowSpan, ...[totCntObject]]"
              :FileNameProp="`지역본부별/단지별_상담현황_일별_${srchParam.srchYm.replaceAll('-','')}`"
              SheetNameProp="일별_상담현황"
              :DisabledProp="mixin_isEmpty(itemsRowSpan)"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan is-header-lg"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="MGOF_CD"
        height="595px"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
	no-data-text="등록된 데이터가 없습니다."
        :loading="isLoading"
        >
        <template v-slot:item="{ item, index }">
          <tr
            :class="mixin_getItemClass(item)"
            :key="index">
            <td
              v-if="index === 0 || item.ARA_HDQ_NM !== itemsRowSpan[index - 1].ARA_HDQ_NM"
              :rowspan="mixin_getRowCount(index, 'ARA_HDQ_NM')"
              style="white-space: pre-wrap;"
              :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.ARA_HDQ_NM }}</td>

            <td class="" style="white-space: pre-wrap;"> {{ item.MGOF_NM }} </td>
            <td class="text-right"> {{ item.CNT_01 }} </td>
            <td class="text-right"> {{ item.CNT_02 }} </td>
            <td class="text-right"> {{ item.CNT_03 }} </td>
            <td class="text-right"> {{ item.CNT_04 }} </td>
            <td class="text-right"> {{ item.CNT_05 }} </td>
            <td class="text-right"> {{ item.CNT_06 }} </td>
            <td class="text-right"> {{ item.CNT_07 }} </td>
            <td class="text-right"> {{ item.CNT_08 }} </td>
            <td class="text-right"> {{ item.CNT_09 }} </td>
            <td class="text-right"> {{ item.CNT_10 }} </td>
            <td class="text-right"> {{ item.CNT_11 }} </td>
            <td class="text-right"> {{ item.CNT_12 }} </td>
            <td class="text-right"> {{ item.CNT_13 }} </td>
            <td class="text-right"> {{ item.CNT_14 }} </td>
            <td class="text-right"> {{ item.CNT_15 }} </td>
            <td class="text-right"> {{ item.CNT_16 }} </td>
            <td class="text-right"> {{ item.CNT_17 }} </td>
            <td class="text-right"> {{ item.CNT_18 }} </td>
            <td class="text-right"> {{ item.CNT_19 }} </td>
            <td class="text-right"> {{ item.CNT_20 }} </td>
            <td class="text-right"> {{ item.CNT_21 }} </td>
            <td class="text-right"> {{ item.CNT_22 }} </td>
            <td class="text-right"> {{ item.CNT_23 }} </td>
            <td class="text-right"> {{ item.CNT_24 }} </td>
            <td class="text-right"> {{ item.CNT_25 }} </td>
            <td class="text-right"> {{ item.CNT_26 }} </td>
            <td class="text-right"> {{ item.CNT_27 }} </td>
            <td class="text-right"> {{ item.CNT_28 }} </td>
            <td class="text-right"> {{ item.CNT_29 }} </td>
            <td class="text-right"> {{ item.CNT_30 }} </td>
            <td class="text-right"> {{ item.CNT_31 }} </td>
            <td class="text-right"> {{ item.CNT_SUM }} </td>
          </tr>
        </template>
        <!-- 합계 -->
        <template slot="footer">
          <div class="pl-grid-sum">
            <table >
              <colgroup>
                <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
              </colgroup>
              <tbody >
                <tr >
                  <td class="pl-grid-sum-head text-center" colspan="2" >총계</td>
                  <td class="text-right"> {{ totCntObject.CNT_01 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_02 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_03 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_04 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_05 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_06 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_07 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_08 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_09 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_10 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_11 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_12 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_13 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_14 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_15 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_16 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_17 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_18 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_19 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_20 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_21 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_22 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_23 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_24 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_25 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_26 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_27 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_28 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_29 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_30 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_31 }} </td>
                  <td class="text-right"> {{ totCntObject.CNT_SUM }} </td>
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
import CompoFindAsMgof from "@/components/CompoFindAsMgof.vue";

export default {
  name: 'STA_M1100_TAB01', //일별 통계
  components: {
    CompoFindAsMgof
  },
  data() {
    return {
      date2: '2024-11',
      date3: '2024-11',
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: '지역본부', value: 'ARA_HDQ_NM', align: '', width: '100px', sortable: false },
        { text: '단지', value: 'MGOF_NM', align: '', width: '200px', sortable: false },
        { text: '01 일', value: 'CNT_01', align: 'center',  sortable: false },
        { text: '02 일', value: 'CNT_02', align: 'center',  sortable: false },
        { text: '03 일', value: 'CNT_03', align: 'center',  sortable: false },
        { text: '04 일', value: 'CNT_04', align: 'center',  sortable: false },
        { text: '05 일', value: 'CNT_05', align: 'center',  sortable: false },
        { text: '06 일', value: 'CNT_06', align: 'center',  sortable: false },
        { text: '07 일', value: 'CNT_07', align: 'center',  sortable: false },
        { text: '08 일', value: 'CNT_08', align: 'center',  sortable: false },
        { text: '09 일', value: 'CNT_09', align: 'center',  sortable: false },
        { text: '10 일', value: 'CNT_10', align: 'center',  sortable: false },
        { text: '11 일', value: 'CNT_11', align: 'center',  sortable: false },
        { text: '12 일', value: 'CNT_12', align: 'center',  sortable: false },
        { text: '13 일', value: 'CNT_13', align: 'center',  sortable: false },
        { text: '14 일', value: 'CNT_14', align: 'center',  sortable: false },
        { text: '15 일', value: 'CNT_15', align: 'center',  sortable: false },
        { text: '16 일', value: 'CNT_16', align: 'center',  sortable: false },
        { text: '17 일', value: 'CNT_17', align: 'center',  sortable: false },
        { text: '18 일', value: 'CNT_18', align: 'center',  sortable: false },
        { text: '19 일', value: 'CNT_19', align: 'center',  sortable: false },
        { text: '20 일', value: 'CNT_20', align: 'center',  sortable: false },
        { text: '21 일', value: 'CNT_21', align: 'center',  sortable: false },
        { text: '22 일', value: 'CNT_22', align: 'center',  sortable: false },
        { text: '23 일', value: 'CNT_23', align: 'center',  sortable: false },
        { text: '24 일', value: 'CNT_24', align: 'center',  sortable: false },
        { text: '25 일', value: 'CNT_25', align: 'center',  sortable: false },
        { text: '26 일', value: 'CNT_26', align: 'center',  sortable: false },
        { text: '27 일', value: 'CNT_27', align: 'center',  sortable: false },
        { text: '28 일', value: 'CNT_28', align: 'center',  sortable: false },
        { text: '29 일', value: 'CNT_29', align: 'center',  sortable: false },
        { text: '30 일', value: 'CNT_30', align: 'center',  sortable: false },
        { text: '31 일', value: 'CNT_31', align: 'center',  sortable: false },
        { text: '합계', value: 'CNT_SUM', align: 'center',  sortable: false },
      ],
      headersExcel: [],
      itemsRowSpan: [],
      totCntObject: {},

      //지역본부 목록
      ARA_HDQ_CD_LIST: [],
      list_common_code: [],
      isLoading:false,
      common_rcpt_chn_list: [],
      srchParam : {
        srchYm : this.$moment().format("YYYY-MM"),
        srchAraHdqCd : '',
        srchMgofCd : '',
        srchMgofNm : '',
        srchRcptChnCd : '',
      }
    }
  },
  async created() {
    let codeName = ['CVC']; //접수채널, 처리매체코드
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    if (this.computedUserCenter < 0) {
      this.common_rcpt_chn_list = await this.mixin_common_code_get(this.list_common_code, 'CVC', '전체')
    } else {
      this.common_rcpt_chn_list = await this.mixin_common_code_get_global(this.list_common_code, 'CVC', this.computedUserCenter, '전체')
    }

    //지역본부 목록 - ARA_HDQ_CD_LIST에 설정함.
    this.mixinAsGetAsAraHdqCdList();

    let header = _.cloneDeep(this.headersRowSpan)
    header.map(item=>{
      if(item.width === null || item.width === '' || item.width === undefined){
        item.width = '100px'
      }
      this.headersExcel.push(item)
    })
  },
  mounted() {
  },
  methods: {
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
      this.srchParam.srchMgofNm  = '';
    },
    openSrchMgof(){
      if (this.mixin_isEmpty(this.srchParam.srchAraHdqCd)) {
        this.showToastCaution({
          msg: '지역본부를 선택하세요.', callAfter: () => {
            this.setDropDown('srchParam.srchAraHdqCd');
          }
        })
      }else{
        this.mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD : this.srchParam.srchAraHdqCd ,MGOF_NM : this.srchParam.srchMgofNm}});
      }
    },
    async getStatsHdqMgofByDay(){
      if (this.mixin_isEmpty(this.srchParam.srchAraHdqCd)) {
        this.showToastCaution({
          msg: '지역본부를 선택하세요.', callAfter: () => {
            // this.setFocus("srchParam.srchAraHdqCd");
            this.setDropDown('srchParam.srchAraHdqCd');
          }
        })
        return
      }
      this.isLoading = true;
      this.itemsRowSpan = []
      let sUrl = '/api/biz/common/select/selectStatsHdqMgofByDay'
      let postParam = {
        SRCH_YM : this.srchParam.srchYm.replaceAll('-',''),
        SRCH_RCPT_CHN_CD : this.srchParam.srchRcptChnCd,
        SRCH_ARA_HDQ_CD : this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD : this.srchParam.srchMgofCd,
      }
      let headParam = {
        head : {
          ns : 'lhcs.statistics.dao.xml.StaticticsAraMgofMapper'
        },
        timeout : 300000
      }

      try {
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                item[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            if (item.MGOF_CD === 'TOT_CNT') {
              this.totCntObject = item;
            } else {
              this.itemsRowSpan.push(item)
            }
          })
          this.isLoading = false;
        }
      }catch(e){
        this.isLoading = false;
      }
    }
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