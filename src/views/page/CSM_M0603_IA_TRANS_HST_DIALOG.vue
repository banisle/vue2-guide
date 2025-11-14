<template>
  <div class="fill-height">
    <div class="pl-grid-top">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">관심지역 SMS발송 리스트</strong>
      </div>
      <div class="pl-grid-top-utils spacing-wrap sp-16">
        <span class="pl-counter">총 <em class=" ">({{ monitor.TOT_CNT }})</em> 건</span>
        <span class="pl-counter">성공 <em class=" is-txt-blue">({{ monitor.TOT_SUCCESS_CNT }})</em> 건</span>
        <span class="pl-counter">실패 <em class=" is-txt-red">({{ monitor.TOT_FAIL_CNT }})</em> 건</span>
        <span class="pl-counter">대기 <em class=" is-txt-org">({{ monitor.TOT_WAIT_CNT }})</em> 건</span>
        <span class="pl-counter">기타 <em class=" is-txt-gray">({{ monitor.TOT_ETC_CNT }})</em> 건</span>
        <span class="pl-counter">재발송 <em class=" is-txt-green">({{ monitor.TOT_RESEND_CNT }})</em> 건</span>
      </div>
    </div>
    <div class="pl-cols is-mt-s fill-height">
      <!-- grid -->
      <div class="is-col-fix" style="width: 70%;">
        <v-data-table
          class="pl-grid is-hover"
          :headers="headers"
          :items="detailItems"
          fixed-header
          item-key="ROW_NUMBER"
          height="480px"
          :loading="isLoading"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- 유형 뱃지 -->
          <template v-slot:item.SKB_RESULT_NM="{ item }">
            <span
                v-if="item.PROC_RESULT==='1'"
              :class="`pl-badge is-${mixin_displayStatus(item.PROC_RESULT, 'STAT_LIST')}`"
              style="width: 50px"
              >
            {{ item.SKB_RESULT_NM }}
            </span>
            <v-tooltip content-class="pl-tooltip " bottom
                       v-if="item.PROC_RESULT !== '1'"
            >
              <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on"
                              :class="`pl-badge is-${mixin_displayStatus(item.PROC_RESULT, 'STAT_LIST')}`"
                              style="width: 50px"
                        >
                          {{ item.PROC_RESULT ==='2'? '실패': item.SKB_RESULT_NM.substring(0,5) }}
                        </span>
              </template>
              <span>{{ item.SKB_RESULT_NM }}</span>
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
              height="800px"
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
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp="true"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>

      <!-- textarea -->
      <div class="ml-6">
        <v-textarea
          class="pl-form is-noresize"
          v-model="smsCn"
          height="calc(100vh - 465px)"
          :spellcheck="false"
          :disabled="true"
        />
      </div>



    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M0603_IA_TRANS_HST_DIALOG', //관심지역 SMS발송 리스트
  props : {
    DataProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  components: {
  },
  data() {
    return {
      monitor: {
        TOT_CNT: 0,
        TOT_SUCCESS_CNT: 0,
        TOT_FAIL_CNT: 0,
        TOT_WAIT_CNT: 0,
        TOT_ETC_CNT: 0,
        TOT_RESEND_CNT: 0,
      },
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '전송일시', value: 'SAVE_TIME', align: 'center', width: '20%', sortable: false },
        { text: '유형', value: 'INTEREST_DIV_CD_NM', align: 'center', width: '15%', sortable: false },
        { text: '관심지역', value: 'ZONE_PATH', align: 'center', width: '', sortable: false },
        { text: '수신자번호', value: 'CALLED_NUMBER', align: 'center', width: '15%', sortable: false },
        { text: '결과', value: 'SKB_RESULT_NM', align: 'center', width: '10%', sortable: false },
        { text: '코드', value: 'SKB_RESULT', align: 'center', width: '10%', sortable: false },
      ],
      detailItems: [],
      isLoading : false,

      // 상태 컬러
      STAT_LIST: [
        { code: '0', value: 'yellow'},
        { code: '1', value: 'blue'},
        { code: '2', value: 'red'},
        { code: '5', value: 'blueGray'},
      ],

      smsCn: '',

    }
  },
  created() {
    if(!this.mixin_isEmpty(this.DataProp.SMS_GROUP_HST_ID)){
      this.getInterestGroupDetailHst()
      // this.getItaSmsMsgCn()
    }
  },
  methods: {
    async getInterestGroupDetailHst(){
      this.detailItems = []
      this.monitor = {
        TOT_CNT: 0,
        TOT_SUCCESS_CNT: 0,
        TOT_FAIL_CNT: 0,
        TOT_WAIT_CNT: 0,
        TOT_ETC_CNT: 0,
        TOT_RESEND_CNT: 0,
      }
      this.isLoading = true
      let sUrl = '/api/biz/common/select/selectInterestGroupDetailHst'
      let postParam = {
        SRCH_SMS_GROUP_HST_ID : this.DataProp.SMS_GROUP_HST_ID
      }
      let headParam = {
        head : { ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper'}
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.smsCn = response.DATA[0].SMS_MSG
        response.DATA.map((item,idx)=>{
          if(idx === 0){
            Object.keys(item).some((key) => {
              if (key.includes("CNT")) {
                this.monitor[key] = Number(item[key]) > 999 ? this.mixin_convertNumToComma(Number(item[key])) : Number(item[key])
              }
            });
            
          }
          this.detailItems.push(item)
        })
      }else{
        this.showToastCaution({msg : '조회 중 문제가 발생했습니다.'})
      }
      this.isLoading = false
    },
    async getItaSmsMsgCn(){
      this.smsCn = ''
      let sUrl = '/api/biz/common/external/select/selectItaSmsMsgCn'
      let postParam ={
        SRCH_SMS_GROUP_HST_ID : this.DataProp.SMS_GROUP_HST_ID
      }

      let headParam = {
        head : { ns : 'lhcs.external_db.sms.dao.ExternalMapper_Sms'}
      }
      const response = await this.common_postCall(sUrl, postParam,headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.smsCn = response.DATA[0].message
      }else{
        this.showToastCaution({msg : '조회 중 문제가 발생했습니다.'})
      }
    },
    beforeSend() {
      let smsGroupId = this.DataProp.SMS_GROUP_HST_ID;
      if (this.mixin_isEmpty(smsGroupId)) {
        this.showToastCaution({msg: '발송 대상이 없습니다.'})
      } else {
        this.showConfirmInfo({
          msg: '발송한 SMS 중 대기 또는 실패 고객에게 재발송 됩니다.\n 발송 하시겠습니까?', callYes: () => {
            this.resend(smsGroupId)
            this.closeAlert()
          },
          callNo: this.closeAlert
        })
      }
    },
    async resend(smsGroupId){
      let sUrl = '/api/biz/common/external/update/resendSmsIntereatArea'
      let postParam ={
        SMS_GROUP_HST_ID : smsGroupId
      }
      let headParam = {
        head : { ns : 'lhcs.external_db.sms.dao.ExternalMapper_Sms'}
      }
      try{
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          this.showToastSuccess({msg: '정상 처리 되었습니다.'})
        } else {
          this.showToastCaution({msg: '처리 중 문제가 발생했습니다.'})
        }
      }catch(e){
        this.showToastCaution({msg: '처리 중 문제가 발생했습니다.'})
      }
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    "DataProp.SMS_GROUP_HST_ID" :{
      handler(){
        if(!this.mixin_isEmpty(this.DataProp.SMS_GROUP_HST_ID)){
          this.getInterestGroupDetailHst()
          // this.getItaSmsMsgCn()
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>