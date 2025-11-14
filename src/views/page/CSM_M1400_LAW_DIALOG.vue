<template>
  <div>
    <div class="pl-form-inline-wrap vertical gap-8 label-80">
      <div class="pl-form-inline">
        <span class="pl-label">
          법무법인 명
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="lawCorpInfo.LAWCORP_NM"            
            :rules="validateRules.LAWCORP_NM"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          대표 전화번호
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="lawCorpInfo.RPRS_TELNO"      
            :rules="validateRules.RPRS_TELNO"            
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          대표 팩스번호
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="lawCorpInfo.RPRS_FXNO"                      
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          설명
        </span>
        <div class="pl-desc">
          <v-textarea
            class="pl-form is-noresize"
            :spellcheck="false"
            placeholder="법무법인 기타 명"
            v-model="lawCorpInfo.EXPLN"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          정렬 순서
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle is-sm flex-grow-0"
            v-model="lawCorpInfo.SORT_ORD"       
            oninput="this.value=this.value.replace(/[^0-9]/g,'')"     
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          사용 여부
        </span>
        <div class="pl-desc">
          <v-select
            v-model="lawCorpInfo.USE_YN"
            :items="useYn"
            class="pl-form type-middle is-sm flex-grow-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M1400_LAW_DIALOG', //법무법인 정보 등록 수정 화면
  components: {
  },
  props: {
    propslawcorp:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      model01: '사용',

      useYn: [
        {text: "사용", value: 'Y'},
        {text: "미사용", value: 'N'},
      ],

      isNew: true,

      lawCorpInfo:{
        isLawNew: true,
        LAWCORP_ID: "",
        LAWCORP_NM:"",
        RPRS_TELNO: "",
        RPRS_FXNO: "", 
        EXPLN: "",  // 설명
        SORT_ORD: "",  // 정렬
        USE_YN: "",        
      }, 

      vaild : true,
      // validate
      validateRules:{
        LAWCORP_NM: [
          v => !!v || '법무법인명은 필수 입력 항목입니다.',
        ],
        RPRS_TELNO: [
          v => !!v|| '대표 전화번호은 필수 입력 항목입니다.',
        ],       
      },

       //알림창 메시지
      MESSAGE : {
        CONFIRM : {
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '법무법인 정보가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {          
          REG_SUCCESS: {  msg: '법무법인 정보가  등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

    }

  },
  methods: {

    setLawcorp(){
      this.lawCorpInfo = {
        isLawNew: true,  // 신규 등록시 true로 설정
        LAWCORP_ID: "",
        LAWCORP_NM: "",
        RPRS_TELNO: "",
        RPRS_FXNO: "", 
        EXPLN: "",
        SORT_ORD: "",
        USE_YN: "Y"  // 기본값 설정
      };
    },

    validate(){
      if(this.mixin_isEmpty(this.lawCorpInfo.LAWCORP_NM)){
        this.showToast({msg: "법무법인명은 필수 입력 항목입니다.", class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 });  
        return;      
      }
      /*
      if(this.mixin_isEmpty(this.lawCorpInfo.RPRS_TELNO)){
        this.showToast({msg: "대표 전화번호은 필수 입력 항목입니다.", class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 });  
        return;      
      }*/
      
    },

    // 법무법인 정보 등록  
    async saveLawcorp(){

      //if(!this.validate()) return;       

      let sUrl = '/phone-api/lawcorp/insertLawCorp';

      let postParam = {
        isNew: this.lawCorpInfo.isLawNew ? 'Y':'N',        
        LAWCORP_NM: this.lawCorpInfo.LAWCORP_NM,
        RPRS_TELNO : this.lawCorpInfo.RPRS_TELNO,
        RPRS_FXNO : this.lawCorpInfo.RPRS_FXNO,   
        EXPLN : this.lawCorpInfo.EXPLN,        
        SORT_ORD : this.lawCorpInfo.SORT_ORD,
        USE_YN: this.lawCorpInfo.USE_YN,
        LAWCORP_ID : this.lawCorpInfo.isLawNew ? '' : this.lawCorpInfo.LAWCORP_ID
      };      

      let headParam = { head : {} };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
        this.showToast({msg: "등록 되었습니다.", class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle', time: 4000 });
        // 목록 재조회
        this.$emit("select");
        // 팝업 닫기
        this.$emit("close");          
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.closeAlert();      
    },
  },
  async mounted() {
    if (this.propslawcorp && Object.keys(this.propslawcorp).length > 0) {
      this.lawCorpInfo = {
        ...JSON.parse(JSON.stringify(this.propslawcorp)),
        isLawNew: false  // 수정시에는 false로 설정
      };
    } else {
      this.setLawcorp();  // 신규 등록시 초기화
    }
  },
  created() {
    
  },
  computed: {
  },
  watch: {
    propslawcorp(newVal) {
      if (newVal && Object.keys(newVal).length > 0) {
        this.lawCorpInfo = {
          ...JSON.parse(JSON.stringify(newVal)),
          isLawNew: false  // 수정시에는 false로 설정
        };
      } else {
        this.setLawcorp();  // 신규 등록시 초기화
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>