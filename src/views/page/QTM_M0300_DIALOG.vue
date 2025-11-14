<template>
  <div >
    <div class="pl-form-inline-wrap vertical gap-8 label-80">
      <div class="pl-form-inline">
        <span class="pl-label">
          평가지
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="paperNm"
            class="pl-form type-middle"
            disabled
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          이의제기 마감일
        </span>
        <div class="pl-desc">
          <compo-date-picker
            DateType="dateTime"
            :DateProp.sync="objtDt.DT"
            :TimesProp.sync='objtDt.TM'
            :ClearableProp="true"
            StyleProp="min-width: 170px;"
            />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          재결요청 마감일
        </span>
        <div class="pl-desc">
          <compo-date-picker
            DateType="dateTime"
            :DateProp.sync="reObjtDt.DT"
            :TimesProp.sync='reObjtDt.TM'
            :ClearableProp="true"
            StyleProp="min-width: 170px;"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QTM_M0300_DIALOG', //이의제기 기간 - 기간설정
  components: {
  },
  props:{
    propsData:{
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 이의제기 기간
      objtDt:{
        DT: ""
        , TM: ""
      },

      // 재결요청 기간
      reObjtDt:{
        DT: ""
        , TM: ""
      },

      // 평가지명
      paperNm:"",
    }
  },
  methods: {
    clickSaveBtn(){
      if(this.computedObjtEndDt.length != 12){
        this.showAlertInfo({msg:"이의제기 마감일을 정확히 입력해주세요."});
        return;
      }

      if(!this.mixin_isEmpty(this.computedReObjtEndDt)){
        if(this.computedReObjtEndDt.length != 12){
          this.showAlertInfo({msg:"재결요청 마감일을 정확히 입력해주세요."});
          return;
        }

        if(this.computedObjtEndDt > this.computedReObjtEndDt){
          this.showAlertInfo({msg:"재결요청 마감일은 이의제기 마감일보다 커야 합니다."});
          return;
        }
      }

      if(this.mixin_isEmpty(this.computedReObjtEndDt)){
        this.showConfirmCaution({
          msg: "재결요청 마감일을 입력하지 않았습니다.<br>그래도 저장하시겠습니까?"
          , callYes: () => {
            this.closeAlert();
            this.updateObjtDtRange();
          }
          , callNo: this.closeAlert
        });
      }else{
        this.showConfirmInfo({
          msg: "이의제기 기간을 저장하시겠습니까?"
          , callYes: () => {
            this.closeAlert();
            this.updateObjtDtRange();
          }
          , callNo: this.closeAlert
        });
      }
    },    

    async updateObjtDtRange(){
      let sUrl = '/phone-api/qt/updateQt300ObjtDtRange';     

      let postParam = {        
        EVAL_ID: this.propsData.EVAL_ID
        , OBJT_END_DT_1CYCL: this.mixin_isEmpty(this.computedObjtEndDt) ? "" : this.computedObjtEndDt+"00"
        , OBJT_END_DT_2CYCL: this.mixin_isEmpty(this.computedReObjtEndDt) ? "" : this.computedReObjtEndDt+"00"
      };

      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg:"이의제기 기간이 저장되었습니다."});
        this.$emit("refresh");
        this.$emit("close");
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },
  },
  mounted() {
    this.paperNm = this.mixin_nvl(this.propsData.PAPER_NM, "");
    
    if(!this.mixin_isEmpty(this.propsData.OBJT_END_DT_1CYCL)){
      this.objtDt.DT = this.$moment(this.propsData.OBJT_END_DT_1CYCL, "YYYYMMDDhhmmss").format("YYYY-MM-DD");
      this.objtDt.TM = this.$moment(this.propsData.OBJT_END_DT_1CYCL, "YYYYMMDDhhmmss").format("hh:mm");
    }

    if(!this.mixin_isEmpty(this.propsData.OBJT_END_DT_2CYCL)){
      this.reObjtDt.DT = this.$moment(this.propsData.OBJT_END_DT_2CYCL, "YYYYMMDDhhmmss").format("YYYY-MM-DD");
      this.reObjtDt.TM = this.$moment(this.propsData.OBJT_END_DT_2CYCL, "YYYYMMDDhhmmss").format("hh:mm");
    }

    
  },
  created() {
    
  },
  computed: {
    computedObjtEndDt(){
      return (this.objtDt.DT+this.objtDt.TM).replaceAll(/[^0-9]/g,'');
    },
    computedReObjtEndDt(){
      return (this.reObjtDt.DT+this.reObjtDt.TM).replaceAll(/[^0-9]/g,'');
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>