<template>
  <div class="pl-call-dialog">
    <div class="pl-call-dialog-portrait" style="background: #c7cee0; border-radius: 50%;">
      <vLottiePlayer
        name="lottieOutbound"
        :autoplay=true
        :loop=true
        width="100px"
        height="100px"
        :animationData="require('@/assets/lottie/animation_outbound.json')"
      />
    </div>
    <div class="pl-form-inline-wrap vertical type-auto is-mt-l">
      <div class="pl-form-inline">
        <span class="pl-label">
          센터구분
        </span>
        <div class="pl-desc">
          {{ computedUserCenterDeptNm }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          발신 번호
        </span>
        <div class="pl-desc">
          {{ this.mixin_setPhoneNo($store.getters["userStore/GE_USER_ROLE"].DSPTCH_NO.replace(/[^0-9]/g, "")) }}
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          수신 번호
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="DataProp.CUST_PHN_NO"
            maxlength="14"
            hide-spin-buttons
            type="text"
            @keyup="setPhoneNo(DataProp.CUST_PHN_NO)"
            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
          />
        </div>
      </div>
    </div>

    <div class="pl-btn-wrap is-mt-l justify-start">
      <v-btn v-if="!CALL_OUT_FLAG" class="pl-btn type-call" @click="outCall()">
        <v-icon class="pl-icon20 phone-white"></v-icon>
        전화 걸기
      </v-btn>
      <v-btn v-if="CALL_OUT_FLAG" class="pl-btn type-call" @click="$emit('ClearCall')">
        <v-icon class="pl-cti-btns is-disabled"></v-icon>
        전화끊기
      </v-btn>
    </div>
  </div>
</template>

<script>
import { ipronCallUtil } from "@/store/ipronCallUtil.js";

  export default {
    name: 'CompoOutCall',
    props: {
      DataProp: {
        type: Object,
      },
    },
    data() {
      return {
        DSPTCH_NO : '', //발신번호
        DSPTCH_NO_LIST : [], //고객사 발신번호 목록

        CALL_OUT_FLAG : false,
      }
    },
    watch: {
    },
    computed: {
    },
    mounted() {

    },
    beforeDestroy(){
      this.$eventBus.$off("OutCallInit"); //eventBus 중복방지를 위해 off
    },
    created() {
      this.inItOutCall();

      //초기화
      this.$eventBus.$on("OutCallInit", () => {
        console.log('this.CALL_OUT_FLAG : ', this.CALL_OUT_FLAG);
        this.inItOutCall();
        this.DataProp.CUST_PHN_NO = '';
        this.DataProp.CUST_ID = '';
        this.CALL_OUT_FLAG = false;
      });
    },
    methods: {
      setPhoneNo(val){
        let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
        this.DataProp.CUST_PHN_NO = res;
      },

      inItOutCall() {
        this.DSPTCH_NO_LIST = [];
        if(this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO){
          this.DSPTCH_NO_LIST = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',');
          this.DSPTCH_NO = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO.split(',')[0];
        }
      },
      //전화걸기
      outCall(){
        if(this.DSPTCH_NO){
          if(this.DataProp.CUST_PHN_NO){
            ipronCallUtil.obCall(this.DataProp.CUST_PHN_NO);
            this.$emit('setCallingFlag', true);
            this.$eventBus.$emit('setCallData', {CUST_ID : this.DataProp.CUST_ID, ani : this.DataProp.CUST_PHN_NO, OB_CALL : true, CVLCPT_RCPT_MNG_ID : this.DataProp.CVLCPT_RCPT_MNG_ID});
            this.CALL_OUT_FLAG = true;
          }else{
            this.showAlertInfo({msg: '수신번호를 입력해 주세요.'});
            return;
          }
        }else{
          this.showAlertInfo({msg: '발신번호를 선택해 주세요.'});
          return;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>