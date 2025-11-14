<template>
  <div>
    <!-- form -->
    <div class="pl-form-inline-wrap vertical gap-8 label-80" >
      <div class="pl-form-inline">
        <span class="pl-label">
          법무법인 명
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="this.lawCorpInfoTrust.LAWCORP_NM"
            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
            :disabled=true
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          위탁업무
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="mixin_common_code_get(this.allCodeList, 'LAW_TP', '')"
            v-model="lawCorpInfoTrust.CSGMTTASK_TYPE_CD"
            :disabled="lawCorpInfoTrust.isLawNew == 'N'"
            @change="(val) => console.log('위탁업무 선택값:', val, this.lawCorpInfoTrust.CSGMTTASK_TYPE_CD)"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          시/도
        </span>
        <div class="pl-desc">
          <v-select
            v-model="depthId"
            :items="zone_1DeptData"
            item-text="ZONENAME"       
            item-value="ZONEID" 
            class="pl-form type-middle is-sm"
            placeholder="선택"
            :disabled="lawCorpInfoTrust.isLawNew == 'N'"
            @change="changeZone"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          시/군/구
        </span>
        <div class="pl-desc">
          <v-select
            v-model="depth2Id"
            :items="zone_2DeptData"
            item-text="ZONENAME"       
            item-value="ZONEID" 
            :disabled="lawCorpInfoTrust.isLawNew == 'N'"
            class="pl-form type-middle is-sm"
            placeholder="선택"            
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          전화번호
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle is-sm flex-grow-1"
            v-model="lawCorpInfoTrust.TELNO"
            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          팩스번호
        </span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle is-sm flex-grow-1"
            v-model="lawCorpInfoTrust.FXNO"
            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
          />
        </div>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M1400_TRUST_DIALOG', //위탁업무 정보
  components: {
  },
  props: {
    propslawcorp:{
      type: Object,
      default: () => {},
    }, 
    propslawcorpTrust:{
      type: Object,
      default: () => {},      
    }
  },
  data() {
    return {
      model01: '사용',
      model02: '서울',

      // left
      ROW_PER_PAGE: -1,
      headers: [
        { text: '시/군/구', value: 'ZONENAME', align: '', width: '' },
      ],
      items: [],
      // right
      headers2: [
        { text: '설정 지역', value: 'ZONENAME', align: '', width: '120px' },
        { text: '전화번호', value: 'TELNO', align: 'center', sortable: false},
        { text: '팩스번호', value: 'FXNO', align: 'center', width: '',sortable: false },
      ],
      items2: [],


      //알림창 메시지
      MESSAGE: {
        CONFIRM: {

        },
        ALERT:{
          ADD_ITEM : {alertDialogToggle: true, msg: '등록할 지역을 선택 해주세요.', iconClass: 'is-info', type: 'default'}
          , REMOVE_ITEM : {alertDialogToggle: true, msg: '삭제할 지역을 선택 해주세요.', iconClass: 'is-info', type: 'default'}
          , FAIL_ITEM : {alertDialogToggle: true, msg: '중복된 위탁업무 정보입니다. 다시 한번 확인 해주세요.', iconClass: 'is-info', type: 'default'}
          , NULL_ITEM : {alertDialogToggle: true, msg: '수정할 위탁업무가 없습니다. 다시 한번 확인 해주세요.', iconClass: 'is-info', type: 'default'}

        },
        TOAST : {
          SAVE_DONE : {  msg: '등록 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
          , EDIT_DONE : {  msg: '수정 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },      

      // 공통코드
      allCodeList: [],
      lawCorpInfo:{},
      lawCorpTrustList: [],
      zone_1DeptData: [],
      zone_2DeptData: [],
      depthId: '',
      depth2Id: '',
      depth: 1,      

      TELNO:'',
      FXNO:'',
      CSGMTTASK_TYPE_CD:'',

      isNew: true,
      lawCorpInfoTrust: {},
      lawCorpTrustCnt: {},

      
    }
  },
  methods: {

    // 신규 등록 
    setLawcorpTrus(){
      this.depthId = '';
      this.depth2Id = '';
      this.depth = 1;
      this.zone_2DeptData = [];
      
      this.lawCorpInfoTrust = {
        isLawNew: 'Y',
        LAWCORP_NM: this.lawCorpInfo.LAWCORP_NM,
        LAWCORP_ID: this.lawCorpInfo.LAWCORP_ID,
        TELNO: '',
        FXNO: '',
        CSGMTTASK_TYPE_CD: ''
      };
      
      this.selectZoneInfo();
    },

    editType(){
      //alert('eee :: '+this.lawCorpInfoTrust.isLawNew);
      //if(!this.lawCorpInfoTrust.isLawNew){
      //  this.editLawcorpTrus();
      //}
    },

    changeData(){
      this.lawCorpInfoTrust={};
      this.lawCorpInfoTrust = JSON.parse(JSON.stringify(this.propslawcorpTrust));
      this.editLawcorpTrus();
    },

    // 수정
    editLawcorpTrus(){
      if (!this.lawCorpInfoTrust) return;
  
      this.depthId = this.lawCorpInfoTrust.depthId;
      this.depth = 2;
      
      // 시/도 데이터 로드 후 시/군/구 데이터 로드
      this.selectZoneInfo().then(() => {
        this.depth2Id = this.lawCorpInfoTrust.ZONEID;
      });
    }, 

    changeZone(){
      this.depth = 2;
      this.depth2Id = ''; // 시/군/구 초기화
      this.selectZoneInfo();
    },

    saveLawcorpTrust(){
      this.savecheck();
    },

    async savecheck(){

      let sUrl = '/phone-api/lawcorp/selectLawCorpTrustCnt';

      if(this.mixin_isEmpty(this.lawCorpInfoTrust.LAWCORP_ID)){        
        this.showAlert(this.MESSAGE.ALERT.NULL_ITEM);
        return;
      }

      if(this.mixin_isEmpty(this.depth2Id)){
        this.showAlert(this.MESSAGE.ALERT.NULL_ITEM);
        return;
      }

      if(this.mixin_isEmpty(this.lawCorpInfoTrust.CSGMTTASK_TYPE_CD)){        
        this.showAlert(this.MESSAGE.ALERT.NULL_ITEM);
        return;
      }

      let postParam = {
        LAWCORP_ID : this.lawCorpInfoTrust.LAWCORP_ID,
        ZONEID: this.depth2Id,
        CSGMTTASK_TYPE_CD: this.lawCorpInfoTrust.CSGMTTASK_TYPE_CD,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {

        this.lawCorpTrustCnt = response.DATA;       

        if(parseInt(this.lawCorpTrustCnt[0].TRUST_CNT) > 0){//FAIL_ITEM
          if(this.lawCorpInfoTrust.isLawNew ==='Y'){
            return this.showAlert(this.MESSAGE.ALERT.FAIL_ITEM);
          }else{
            return this.showConfirmInfo({msg : '위탁업무를 수정 하시겠습니까?', callYes:this.saveLawcorpTrust_, callNo : this.closeAlert})
          }

        }else{
          return this.showConfirmInfo({msg : '위탁업무를 등록 하시겠습니까?', callYes:this.saveLawcorpTrust_, callNo : this.closeAlert})
        }        
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    async saveLawcorpTrust_(flag){
      
      let sUrl = '/phone-api/lawcorp/insertLawCorpTrust';
      let postParam = {
        LAWCORP_ID : this.lawCorpInfoTrust.LAWCORP_ID,
        ZONEID: this.depth2Id,
        CSGMTTASK_TYPE_CD: this.lawCorpInfoTrust.CSGMTTASK_TYPE_CD,
        TELNO:  this.lawCorpInfoTrust.TELNO,
        FXNO: this.lawCorpInfoTrust.FXNO,
        isNew: this.lawCorpInfoTrust.isLawNew =='Y'? 'Y':'N', 
        depthId: this.depthId
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        // 목록 재조회
        this.$emit("refresh");
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);  
        
        if (this.lawCorpInfoTrust.isLawNew === 'Y') {
          // 신규등록인 경우: LAWCORP_ID와 CSGMTTASK_TYPE_CD를 제외한 필드 초기화
          this.depthId = '';
          this.depth2Id = '';
          this.lawCorpInfoTrust = {
            ...this.lawCorpInfoTrust,
            TELNO: '',
            FXNO: '',
            depthId: '',
            ZONEID: ''
          };
          this.zone_2DeptData = [];
        }
        this.closeAlert()
        this.$emit('close');
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 지역정보 내용 검색
    async selectZoneInfo(){

      this.zone_2DeptData = [];
      
      let sUrl = '/phone-api/lawcorp/selectZoneInfo';
      let postParam = {
        DEPTH : this.depth,
        PARENTID: this.depthId,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(this.depth == 1){
          this.zone_1DeptData = [];
          this.zone_1DeptData = response.DATA;
        }else{
          
          this.zone_2DeptData = response.DATA;
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },    

  },
  async mounted() {
    this.lawCorpInfo = JSON.parse(JSON.stringify(this.propslawcorp));
    this.lawCorpInfoTrust = JSON.parse(JSON.stringify(this.propslawcorpTrust));

    let codeList = ['LAW_TP'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);
    this.depth= 1;
    this.selectZoneInfo();

    this.editType();
  },
  async created() {
  },
  computed: {
  },
  watch: {
    propslawcorpTrust: {
      handler(newVal) {
        if (newVal) {
          this.changeData();
        }
      },
      deep: true
    },
    depthId(newVal) {
      if (newVal) {
        this.changeZone();
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>