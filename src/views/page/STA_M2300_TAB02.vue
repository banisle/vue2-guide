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
              :selectTermProp="false"
              @startDayChange="initHour"
              @endDayChange="initHour"
              ParentStyleProp="width: 277px"
          />
          <div class="spacing-wrap sp-4">
            <v-select
                class="pl-form type-middle is-xs"
                placeholder="선택"
                :items="HOUR_DROP"
                item-text="text"
                item-value="value"
                v-model="srchParam.srchStartHour"
            ></v-select>
            <span class="pl-unit">~</span>
            <v-select
                class="pl-form type-middle is-xs"
                placeholder="선택"
                :items="secondHours"
                item-text="text"
                item-value="value"
                :item-disabled="disableSelectedHour"
                v-model="srchParam.srchEndHour"
            ></v-select>
          </div>
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
              @change="initIcpr"
              v-model="srchParam.srchAraHdqCd"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          불만유형
        </span>
        <div class="pl-desc">
          <v-select
              class="pl-form type-middle"
              placeholder="선택"
              :items="SRCH_COMBO_PROP.HPC_CODE_LIST"
              v-model="srchParam.srchHpcCd"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          업체
        </span>
        <div class="pl-desc">
<!--              style="width: 271px;"-->
          <v-text-field
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
          @click="getStatsHpcSurveyold"
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
              <strong class="pl-bullet-txt is-blue">(구)해피콜불만현황</strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">검색건 <em class="pl-1 is-txt-blue">({{ itemsRowSpan.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TitleProp="엑셀 다운로드"
              TypeProp="Download"
              :DataHeaderProp="headersExcel"
              :DataBodyProp="itemsRowSpan"
              :FileNameProp="`해피콜 현황_${srchParam.srchStartDt}~${srchParam.srchEndDt}`"
              SheetNameProp="해피콜 현황"
              HeaderColorProp="00B0F0"
          ></compo-excel>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-rowspan is-header-lg"
        style="max-width: calc(100vw - 360px)"
        :headers="headersRowSpan"
        :items="itemsRowSpan"
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(100vh - 316px)"
        :items-per-page="itemsRowSpan.length"
        hide-default-footer
        :loading="isLoading"
        no-data-text="등록된 데이터가 없습니다."
        >
      </v-data-table>
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
  name: 'STA_M2300_TAB02', //해피콜 현황 - 구
  components: {
    CompoFindAsIcpr
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
        { text: '민원인', value: 'CVPR_NM', align: 'center pl-text-pre-wrap px-1', width: '50px', sortable: false },
        { text: '휴대\n전화\n번호', value: 'MBL_NO', align: 'center pl-text-pre-wrap px-1', width: '50px', sortable: false },
        { text: '주소\n(계약정보)', value: 'ADDRESS', align: 'center pl-text-pre-wrap px-1', width: '120px', sortable: false },
        { text: 'AS접수\n번호', value: 'V_FLW_ACP_SN', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
        { text: 'AS구분', value: 'FLW_DS_NM', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
        { text: '단지/동 주소', value: 'MGOF_NM_ADR', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
        { text: '임대유형', value: 'MGOF_TP_NM', align: 'center pl-text-pre-wrap px-1', width: '40px', sortable: false },
        { text: '지역구분', value: 'ARA_HDQ_NM', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
        { text: '시설구분', value: 'LCLS_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '동', value: 'BLDG_NO', align: 'center pl-text-pre-wrap px-1', width: '50px', sortable: false },
        { text: '호', value: 'HS_NO', align: 'center pl-text-pre-wrap px-1', width: '50px', sortable: false },
        { text: '공종', value: 'MNTN_RPSN_CSTP_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '중공종', value: 'SCLS_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '세부공종', value: 'DCLS_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '업체명', value: 'FRM_NM', align: 'center pl-text-pre-wrap px-1', width: '4%', sortable: false },
        { text: '담당자', value: 'ICPR', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '처리자', value: 'PRCR_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '사용자구분', value: 'MNTN_USR_DS_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '경과시간', value: 'RPR_XPC_OV_DAY', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: 'AS내용', value: 'FLW_CTS', align: ' pl-text-pre-wrap px-1', width: '5%', sortable: false },
        { text: '접수일', value: 'FLW_RGS_DT', align: 'center pl-text-pre-wrap px-1', width: '3%', sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '진행상담원', value: 'PRCS_USER_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '등록일자', value: 'REG_DT', align: 'center pl-text-pre-wrap px-1', width: '3%', sortable: false },
        { text: '진행고객', value: 'CALLER_NM', align: 'center pl-text-pre-wrap px-1', width: '', sortable: false },
        { text: '해피콜접수(평균)', value: 'EXMP_AVG', align: 'center pl-text-pre-wrap px-1', width: '40px', sortable: false },
        { text: '1.방문시간', value: 'EXMP_VAL1', align: 'center pl-text-pre-wrap px-1', width: '30px', sortable: false },
        { text: '2.친절', value: 'EXMP_VAL2', align: 'center pl-text-pre-wrap px-1', width: '30px', sortable: false },
        { text: '3.보수만족', value: 'EXMP_VAL3', align: 'center pl-text-pre-wrap px-1', width: '30px', sortable: false },
        { text: '4.뒷마무리', value: 'EXMP_VAL4', align: 'center pl-text-pre-wrap px-1', width: '30px', sortable: false },
        { text: '5.복장', value: 'EXMP_VAL5', align: 'center pl-text-pre-wrap px-1', width: '30px', sortable: false },
        { text: '해피콜처리내용', value: 'CUTT_CN', align: ' pl-text-pre-wrap px-1', width: '4%', sortable: false },
        { text: '불만코드', value: 'HAPPY_CMPL_NM', align: 'center pl-text-pre-wrap px-1', width: '60px', sortable: false },
        { text: '보수\n지시일', value: 'RPR_NSTC_DT', align: 'center pl-text-pre-wrap px-1', width: '3%', sortable: false },
        { text: '완료\n보고일', value: 'RPR_CMPL_RPT_DT', align: 'center pl-text-pre-wrap px-1', width: '3%', sortable: false },
        { text: '완료일', value: 'RPR_CMPL_DT', align: 'center pl-text-pre-wrap px-1', width: '3%', sortable: false },
        { text: '사업자번호', value: 'R_FRM_CD', align: ' pl-text-pre-wrap px-1', width: '3%', sortable: false },
        { text: '권역명', value: 'DISTRICT_NM', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
        { text: '상세단지동주소', value: 'BLDG_ADR', align: ' pl-text-pre-wrap px-1', width: '150px', sortable: false },
        { text: '공간', value: 'SPCE_NM', align: 'center pl-text-pre-wrap px-1', width: '80px', sortable: false },
      ],
      itemsRowSpan: [],
      headersExcel: [],
      srchParam : {
        srchStartDt : this.$moment().format("YYYY-MM-DD"),
        srchEndDt : this.$moment().format("YYYY-MM-DD"),
        srchCustcoId : '4',
        srchStartHour : '',
        srchEndHour : '',
        srchPaperId : '',
        srchAraHdqCd : '',
        srchHpcCd : '',
        srchFrmCd : '',
        srchFrmNm : '',
      },
      isLoading : false,
      HOUR_DROP : Array.from({ length: 24 }, (_, i) => ({ text: `${i}시`, value: i })),
      dialogFindAsIcpr : false,
    }
  },
  created() {
    this.setPaperId()
    let header = _.cloneDeep(this.headersRowSpan);
    header.map(item=>{
      Object.keys(item).some((key) => {
        if(key.includes("width")){
          if(item[key].includes('%')){
            item[key] = Number(item[key].replaceAll('%','px'))*10
          }else if(item[key] === ''){
            item.width = '150px'
          }
        }
      });
      this.headersExcel.push(item)
    })
  },
  mounted() {
  },
  methods: {
    setPaperId(){
      if(!this.mixin_isEmpty(this.SRCH_COMBO_PROP.HPC_SURVEY_LIST[0])){
        this.srchParam.srchPaperId = this.SRCH_COMBO_PROP.HPC_SURVEY_LIST[0].PAPER_ID
      }
    },
    disableSelectedHour(item) {
      // 첫 번째 v-select에서 선택한 항목을 두 번째 v-select에서 비활성화
      return item.value < this.srchParam.srchStartHour;
    },
    initHour(){
      this.srchParam.srchStartHour = '';
      this.srchParam.srchEndHour = '';
    },
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
    async getStatsHpcSurveyold(){
      this.itemsRowSpan=[];
      this.isLoading = true;
      let sUrl = '/api/biz/common/select/selectStatsHpcSurveyOld'
      let postParam = {
        SRCH_CUSTCO_ID : this.srchParam.srchCustcoId,
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-',''),
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-',''),
        SRCH_START_HOUR : this.srchParam.srchStartHour,
        SRCH_END_HOUR : this.srchParam.srchEndHour,
        SRCH_ARA_HDQ_CD : this.srchParam.srchAraHdqCd,
        SRCH_FRM_CD : this.srchParam.srchFrmCd,
        SRCH_HPC_CD : this.srchParam.srchHpcCd
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
           item.MBL_NO = this.mixin_setPhoneNo(item.MBL_NO)
           item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss')
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
    secondHours(){
      return this.HOUR_DROP;
    }
  },
  watch: {
    "SRCH_COMBO_PROP.HPC_SURVEY_LIST" :{
      handler(){
        this.setPaperId()
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>