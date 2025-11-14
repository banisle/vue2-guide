<template>
  <div class="pt-3 px-5">
    <div class="spacing-wrap sp-8">
      <div>
        <span class="pl-bullet-txt is-blue">센터장</span>
        <strong >({{ MAGR }})</strong>
      </div>
      <div>
        <span class="">팀장</span>
        <strong >({{ AMLD }})</strong>
      </div>
      <div>
        <span class="">부팀장</span>
        <strong >({{ TMLD }})</strong>
      </div>
    </div>
    <!-- list -->
    <div
      class="is-mt-s pl-notice-list no-link no-hover is-border-sub-top">
      <div
        class="pl-notice-list--unit pl-0"
        v-for="item in CVLCPT_CUTT_LIST">
        <div class="d-flex align-center">
          <img
            :src="item.IMG"
            :alt="item.USER_NM"
            class="align-self-start"
            style="max-width: 35px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          <div class="ml-3">
            <div>
              <strong style="font-size: 14px">{{ item.USER_NM }}</strong>
              <span class="ml-2 is-txt-sub">{{ item.FULL_DEPT_NM }}</span>
              - <strong>통화일시 <span class="ml-2 is-txt-sub">{{ item.CUTT_DT }}</span></strong>
            </div>
            <div >
              <strong>상담메모 : </strong>
              <span class="ml-1">{{ item.CUTT_CN }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CTM_M0300_TAB_02_DETAIL_TAB_02', //진행 사항 탭
  components: {
  },
  props:{
    CVLCPT_CUTT_LIST:{
      type: Array
      , default: () => []
    }
  },
  data() {
    return {
      MAGR:0, // 센터장
      AMLD:0, // 팀장
      TMLD:0, // 부팀장
    }
  },
  methods: {
    clickSaveBtn(item){
      this.showConfirmInfo({
        msg:'상담요약 내용을 저장하시겠습니까?'
        , callYes: () => {
          this.closeAlert();
          this.updateCvlcptCuttSmrCn(item);
        }
        , callNo: this.closeAlert
      });
    },

    async updateCvlcptCuttSmrCn(item){
      
      let sUrl = '/api/biz/common/update/updateCvlcptCuttSmrCn';

      let postParam = {
        CVLCPT_RCPT_MNG_ID: item.CVLCPT_RCPT_MNG_ID
        , PHN_CUTT_ID: item.PHN_CUTT_ID
        , CUTT_SMR_CN: item.CUTT_SMR_CN
      };

      let headParam = { head : {
        ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
        , sn: "updateCvlcptCuttSmrCn"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : '정상 처리되었습니다.'});
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },
  },
  mounted() {
    this.MAGR = this.CVLCPT_CUTT_LIST.filter(row=>{return row.DUTY_GROUP_CD == "MAGR"}).length;
    this.AMLD = this.CVLCPT_CUTT_LIST.filter(row=>{return row.DUTY_GROUP_CD == "AMLD"}).length;
    this.TMLD = this.CVLCPT_CUTT_LIST.filter(row=>{return row.DUTY_GROUP_CD == "TMLD"}).length;
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