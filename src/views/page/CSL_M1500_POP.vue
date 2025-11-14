<template>
  <div>
    <v-form ref="form">
      <div class="pl-card">
        <div class="pl-form-inline-wrap vertical label-100 gap-8">
          <div class="pl-form-inline">
          <span class="pl-label">
            센터
          </span>
            <div class="pl-desc" style=" width: 393px; ">
              <v-select
                  v-model="saveParam.CUSTCO_ID"
                  :items="center_list"
                  class="pl-form type-middle"
                  value="pl-form"
                  item-text="DEPT_NM"
                  item-value="CUSTCO_ID"
                  :rules="validateRules.required"
                  :disabled="computedUserCenter !== '-1'"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            상담일/시간
          </span>
            <div class="pl-desc">
              <compo-date-picker
                  DateType="dateInput"
                  :DateProp.sync="saveParam.CUTT_YMD"/>
              <v-select
                  v-model="saveParam.CUTT_HR"
                  :items="comboCuttHr"
                  item-text="text"
                  item-value="value"
                  class="pl-form type-middle is-xs"
                  placeholder="시"
                  :rules="validateRules.required"
              />
              <v-select
                  v-model="saveParam.CUTT_MIN"
                  :items="comboCuttMin"
                  class="pl-form type-middle is-xs"
                  placeholder="분"
                  item-text="text"
                  item-value="value"
                  :rules="validateRules.required"
              />
              <v-autocomplete
                  v-model="saveParam.CUTT_SEC"
                  :items="comboCuttSec"
                  class="pl-form type-middle is-xs flex-grow-0"
                  item-text="text"
                  item-value="value"
                  placeholder="초"
                  :rules="validateRules.required"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            불만 유형
          </span>
            <div class="pl-desc" style=" width: 393px; ">
              <v-select
                  v-model="saveParam.VOC_CVLCPT_TYPE_CD"
                  class="pl-form type-middle"
                  placeholder="불만 유형 선택"
                  :items="mixin_common_code_get(common_code, 'VOC_CMP_TP', '')"
                  :rules="validateRules.required"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            내용
          </span>
            <div class="pl-desc">
              <v-textarea
                  v-model="saveParam.CN"
                  class="pl-form is-noresize"
                  height="200"
                  placeholder="내용(상세히 기술)"
                  :rules="validateRules.required"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            처리 결과
          </span>
            <div class="pl-desc" style=" width: 393px; ">
              <v-select
                  v-model="saveParam.VOC_PRCS_RSLT_CD"
                  class="pl-form type-middle"
                  placeholder="처리 결과 선택"
                  :items="mixin_common_code_get(common_code, 'VOC_PRS_TP', '')"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            지역
          </span>
            <div class="pl-desc" style=" width: 393px; ">
              <v-text-field
                  v-model="saveParam.RGN_NM"
                  class="pl-form type-middle flex-grow-1"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            지구
          </span>
            <div class="pl-desc" style=" width: 393px; ">
              <v-text-field
                  v-model="saveParam.DSTRCT_NM"
                  class="pl-form type-middle flex-grow-1"
              />
            </div>
          </div>
          <div class="pl-form-inline">
          <span class="pl-label">
            {{ saveParam.CUSTCO_ID === '4' ? '상담번호' : '고객 인입번호' }}
          </span>
            <div class="pl-desc" style=" width: 393px; ">
              <v-text-field
                  v-if="saveParam.CUSTCO_ID === '4'"
                  class="pl-form type-middle flex-grow-1"
                  :rules="validateRules.required"
                  v-model="saveParam.PHN_CUTT_ID"
              />
              <v-text-field
                  v-else
                  class="pl-form type-middle flex-grow-1"
                  :rules="validateRules.required"
                  v-model="saveParam.CUST_PHN_NO"
              />
              <p class="pl-form-hint">바로처리센터의 경우 <strong>"상담번호"</strong>를 입력하십시오.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-card pl-btn-wrap justify-end is-border-top">
        <v-btn class="pl-btn is-trans " @click="closePop()">닫기</v-btn>

        <v-btn class="pl-btn"
               @click="beforeSave"
        >{{ mixin_isEmpty(saveParam.VOC_ID)? '저장' : '수정' }}</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'CSL_M1500_POP', //모회사 VOC 팝업
  components: {},
  props: {
    injectionObj: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {

      common_code: this.injectionObj.props.common_cd,
      center_list: this.injectionObj.props.center_cd,
      comboCuttHr: Array.from({length: 24}, (_, i) => ({text: `${i}시`, value: `${String(i).padStart(2, '0')}`})),
      comboCuttMin: Array.from({length: 60}, (_, i) => ({text: `${i}분`, value: `${String(i).padStart(2, '0')}`})),
      comboCuttSec: Array.from({length: 60}, (_, i) => ({text: `${i}초`, value: `${String(i).padStart(2, '0')}`})),

      saveParam: {
        VOC_ID: '',
        CUSTCO_ID: '',
        CUTT_DT: this.$moment().format('YYYY-MM-DD'),
        CUTT_YMD: this.$moment().format('YYYY-MM-DD'),
        CUTT_HR: '',
        CUTT_MIN: '',
        CUTT_SEC: '',
        CN: '',
        VOC_CVLCPT_TYPE_CD: '',
        VOC_PRCS_RSLT_CD: '',
        RGN_NM: '',
        DSTRCT_NM: '',
        CUST_PHN_NO: '',
        PHN_CUTT_ID: '',
      },

      validateRules: {
        required: [
          v => !!v || '필수 입력 항목 입니다.',
        ],
      },
    }
  },
  created() {
    console.log(this.injectionObj.data)
  },
  mounted() {
    this.initData()
  },
  methods: {
    closePop() {
      window.close()
    },
    async initData() {
      let now = this.$moment().format('YYYYMMDDHHmmss');
      console.log(this.mixin_convertDate(now, 'yyyy-MM-dd'));
      if (this.mixin_isEmpty(this.injectionObj.data)) {
        this.saveParam = {
          VOC_ID: '',
          CUSTCO_ID: this.computedUserCenter,
          CUTT_DT: now,
          CUTT_YMD: this.mixin_convertDate(now, 'yyyy-MM-dd'),
          CUTT_HR: now.substring(8, 10),
          CUTT_MIN: now.substring(10, 12),
          CUTT_SEC: now.substring(12, 14),
          CN: '',
          VOC_CVLCPT_TYPE_CD: '',
          VOC_PRCS_RSLT_CD: '',
          RGN_NM: '',
          DSTRCT_NM: '',
          CUST_PHN_NO: '',
          PHN_CUTT_ID: '',
        }
        console.log("this.saveParam >>>>>> ", this.saveParam)
      } else {
        this.saveParam = this.injectionObj.data
        this.$set(this.saveParam, "CUTT_YMD" , this.mixin_convertDate(this.saveParam.CUTT_DT, 'yyyy-MM-dd'));
        this.$set(this.saveParam, "CUTT_HR" , this.saveParam.CUTT_DT.substring(8, 10));
        this.$set(this.saveParam, "CUTT_MIN" , this.saveParam.CUTT_DT.substring(10, 12));
        this.$set(this.saveParam, "CUTT_SEC" , this.saveParam.CUTT_DT.substring(12, 14));
      }
    },
    beforeSave() {
      if(!this.$refs.form.validate()){
        this.showToastCaution({msg:'필수 입력값을 확인해 주세요.'})
        return;
      }else{
        this.showConfirmInfo({msg : `${this.mixin_isEmpty(this.saveParam.VOC_ID) ? 'VOC를 등록 하시겠습니까?':'VOC 상세를 수정하시겠습니까?'}`, callYes : ()=>{
            this.save(this.mixin_isEmpty(this.saveParam.VOC_ID)?'insert':'update')
            this.closeAlert()
          },
        callNo : this.closeAlert})
      }
    },
    async save(flag){
     let sUrl = `/api/biz/common/${flag}/${flag}Voc`
      let postParam = {
        VOC_ID : this.saveParam.VOC_ID,
        CUSTCO_ID : this.saveParam.CUSTCO_ID,
        CUTT_DT : this.saveParam.CUTT_YMD.replaceAll('-','')
            + this.saveParam.CUTT_HR
            + this.saveParam.CUTT_MIN
            + this.saveParam.CUTT_SEC,
        VOC_CVLCPT_TYPE_CD : this.saveParam.VOC_CVLCPT_TYPE_CD,
        CN : this.saveParam.CN,
        VOC_PRCS_RSLT_CD : this.saveParam.VOC_PRCS_RSLT_CD,
        RGN_NM : this.saveParam.RGN_NM,
        DSTRCT_NM : this.saveParam.DSTRCT_NM,
        CUST_PHN_NO : this.saveParam.CUSTCO_ID === '4' ? '' : this.saveParam.CUST_PHN_NO,
        PHN_CUTT_ID : this.saveParam.CUSTCO_ID === '4' ? this.saveParam.PHN_CUTT_ID : '',
      }
      let headParam = {
       head : {
         ns : 'lhcs.phone.cuttMng.data.dao.PhoneCuttMngVocMapper'
       }
      }
      if(flag === 'insert'){
        this.$set(headParam.head, "seq_key", "VOC_ID")
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.showToastSuccess({msg : "정상 처리 되었습니다.", callAfter : ()=>{
            window.opener.postMessage({message: true})
            this.closePop();
          }})
      }
    },
  },
  computed: {},
  watch: {
    "injectionObj.data":{
      handler(){
        this.initData()
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>