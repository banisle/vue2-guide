<template>
  <div class="pl-quick-layer-body pb-0" style="flex: 0 0 calc(100% - 190px);">
    <!-- 고객정보 -->
    <div class="">
      <div class="">
        <div class="pl-vertical-list type-2">
          <div
            class="pl-vertical-list--unit px-0"
            v-for="item in CUST_INFO"
            :key="item.id">
            <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
            <strong class="ml-1" style="flex: 0 0 70px">{{ item.title }}</strong>
            <span class="ml-2">{{ (item.val) ? item.telYn ? mixin_setPhoneNo(item.val) : item.val : '' }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 상담 상세내역 -->
    <div class="is-border-sub-top is-mt-m pt-6">
      <h3 class="pl-subtit">상담 상세 내용</h3>
      <div class="d-flex align-center is-mt-m">
        <CompoAudioWave
          :AudioProp="qaBaseData"
          :popData="qaBaseData"
          :WidthProp=460
        />
      </div>
      <div class="spacing-wrap sp-8 flex-column is-mt-m">
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 share"></v-icon>
          <strong class="ml-1" style="flex: 0 0 120px">상담 채널</strong>
          <span >{{ (CS_INFO.DRWI_TYPE_CD === 'OUT' ? 'OB' : CS_INFO.DRWI_TYPE_CD) + ' > ' + CS_INFO.RCPT_CHN_NM }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 terms"></v-icon>
          <strong class="ml-1" style="flex: 0 0 120px">개인정보 수집</strong>
          <span >{{ CS_INFO.PRVC_CLCT_AGRE_YN === 'Y' ? '동의' : '미동의' }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 calendar-list"></v-icon>
          <strong class="ml-1" style="flex: 0 0 120px">상담 유형</strong>
          <span >{{ mixin_decode(CS_INFO.CNSLT_DIV_PATH_NM) }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 macro"></v-icon>
          <strong class="ml-1" style="flex: 0 0 120px">처리 방법</strong>
          <span >{{ CS_INFO.PRCS_CHN_NM }}</span>
        </div>
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 calendar-place"></v-icon>
          <strong class="ml-1" style="flex: 0 0 120px">상담 지역</strong>
          <span >{{ CS_INFO.CTPV_NM + ' > ' + CS_INFO.SGG_NM + ' > ' + CS_INFO.DSTRCT_NM }}</span>
        </div>
        <div class="d-flex ">
          <v-icon class="pl-icon20 person-part" style="flex: 0 0 20px"></v-icon>
          <strong class="ml-1" style="flex: 0 0 120px">상담 내용</strong>
          <p class="" style="white-space: pre-line">
            {{ CS_INFO.CUTT_CN }}
          </p>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import CompoAudioWave from '@/components/CompoAudioWave'

export default {
  name: 'QAM_M0500_CS_DETAIL_02', //평가실행관리 - 상담내용
  props: {
    // 평가대상자 정보
    qaBaseData:{
      type: Object,
      default: ()=>{}
    },
  },
  components: {
    CompoAudioWave
  },
  data() {
    return {
      CUST_INFO : [
        { title:'인입번호', icon: 'cs-phone', val: "", telYn : true },
        { title:'휴대전화', val: "", telYn : true },
        { title:'전화번호1', val: "", telYn : true },
        { title:'전화번호2', val: "", telYn : true },
        { title:'전화번호3', val: "", telYn : true },
        { title:'이메일', val: "" },
        { title:'고객 ID', icon: 'cs-black', val: "" },
        { title:'고객명', val: "" },
      ],
      CS_INFO : {},
    }
  },
  methods: {
    // 평가대상자 상담이력 정보 조회
    async selectTgtCnsltData(){

      // let sUrl = '/phone-api/qa/selectTgtCnsltData';
      let sUrl = '/api/biz/common/select/selectTgtCnsltData';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID
        , PHN_CUTT_ID: this.qaBaseData.PHN_CUTT_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectTgtCnsltData'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0){
          this.CS_INFO = response.DATA[0];
          this.CUST_INFO = [
            { title:'인입번호', icon: 'cs-phone', val: this.CS_INFO.CUST_PHN_NO, telYn : true },
            { title:'휴대전화', val: this.CS_INFO.CUST_PHN_NO, telYn : true },
            { title:'전화번호1', val: this.CS_INFO.CUST_PHN_NO1, telYn : true },
            { title:'전화번호2', val: this.CS_INFO.CUST_PHN_NO2, telYn : true },
            { title:'전화번호3', val: this.CS_INFO.CUST_PHN_NO3, telYn : true },
            { title:'이메일', val: this.CS_INFO.EML },
            { title:'고객 ID', icon: 'cs-black', val: this.CS_INFO.CUST_IDNTF_NO },
            { title:'고객명', val: this.CS_INFO.CUST_NM },
          ];
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },
  },
  mounted() {
    // 평가대상자 상담이력 정보 조회
    if(!this.mixin_isEmpty(this.qaBaseData.PHN_CUTT_ID)) this.selectTgtCnsltData();
  },
  created() {
  },
  computed: {
  },
  watch: {
    
  },
};
</script>

<style lang="scss" scoped>

</style>