<template>
  <div class="is-mt-s">
    <div class="pl-form-inline-wrap vertical label-80 gap-8">
      <div class="pl-form-inline">
        <span class="pl-label">
          임시 차단일
        </span>
        <div class="pl-desc">
          {{ mixin_convertDate(PropData['REG_DT'], 'yyyy-MM-dd HH:mm:ss') }}({{ PropData['CUSL_NM'] + ' - ' + PropData['FULL_DEPT_NM'] }})
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          차단유형
        </span>
        <div class="pl-desc">
          {{ WARN_TYPE_NM }}
        </div>
      </div>

      <!--임시차단이 아닌 경우-->
      <template v-if="CAUTION_CUST_STTS_CD !== 'REQ01' && CAUTION_CUST_STTS_CD !== 'REQ08'">
        <div class="pl-form-inline">
          <span class="pl-label">
            휴게부여
          </span>
          <div class="pl-desc">
            <v-checkbox
              v-model="CUSL_RST_YN"
              class="pl-check"
              label="휴게부여"
              :disabled=true
              >
            </v-checkbox>
            <v-text-field
              v-model="CUSL_RST_HR"
              class="pl-form type-middle is-xs"
              suffix="분"
              :disabled=true
              />
            <v-checkbox
              v-model="CUSL_PCLG_CUTT_YN"
              class="pl-check flex-grow-0"
              label="심리상담"
              :disabled=true
            ></v-checkbox>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            요청자
          </span>
          <div class="pl-desc">
            {{ mixin_isEmpty(RQSTR_NM)?'': RQSTR_DEPT_NM + ' - ' + RQSTR_NM + '(' + (DMND_DT?mixin_convertDate(DMND_DT, 'yyyy-MM-dd HH:mm:ss'):'') + ')' }}
          </div>
        </div>
      </template>
    </div>

    <!--임사차단 이고 팀장(부팀장)인 경우-->
    <template v-if="(CAUTION_CUST_STTS_CD === 'REQ01' || CAUTION_CUST_STTS_CD === 'REQ08') && (computedUserDetailType === 'CENTER_LEADER' || computedUserDetailType === 'TEAM_LEADER')">
      <div class="pl-form-inline-wrap vertical label-80 gap-8 is-border-sub-top pt-3 is-mt-s">
        <div class="pl-form-inline">
          <span class="pl-label">
            처리 구분
          </span>
          <div class="spacing-wrap sp-8 flex-column">
            <div style="display: grid; grid-template-columns: 240px 1fr; ">
              <v-radio-group
                v-model="VOC_REQ_CD"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in mixin_common_code_get(list_common_code, 'VOC_REQ', '')"
                  v-if="rad01.value === 'REQ02' || rad01.value === 'REQ03'"
                  :key="rad01.value"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            휴게 여부
          </span>
          <div class="spacing-wrap sp-8 flex-column">
            <div style="display: grid; grid-template-columns: 240px 1fr; ">
              <div class="spacing-wrap sp-8 align-center">
                <v-checkbox
                  v-model="CUSL_RST_YN"
                  class="pl-check"
                  input-value="true"
                  label="휴게부여"
                  >
                </v-checkbox>
                <v-text-field
                  v-model="CUSL_RST_HR"
                  class="pl-form type-middle is-xs"
                  suffix="분"
                  />
              </div>
              <v-checkbox
                v-model="CUSL_PCLG_CUTT_YN"
                class="pl-check"
                label="심리상담 진행"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!--임시차단, 차단요청, 철회요청이 아닌 경우-->
    <template v-if="computedUserDetailType === 'SYS_ADMIN' || computedUserDetailType === 'SYS_HUMAN' || computedUserDetailType === 'SYS_MANAGER'
      || CAUTION_CUST_STTS_CD === 'REQ04'/*정식차단*/
      || CAUTION_CUST_STTS_CD === 'REQ05'/*철회*/
      || CAUTION_CUST_STTS_CD === 'REQ06'/*철회반려*/
      || CAUTION_CUST_STTS_CD === 'REQ07'/*차단기간 만료 */
    ">
      <div class="pl-form-inline-wrap vertical label-80 gap-8 is-border-sub-top pt-3 is-mt-m">
        <div class="pl-form-inline">
          <span class="pl-label">
            처리결과
          </span>
          <div class="pl-desc">
            <v-select
              v-model="PRC_STTS_CD"
              class="pl-form type-middle"
              :items="PRC_STTS_CD_LIST"
              placeholder="선택"
              :disabled="CAUTION_CUST_STTS_CD === 'REQ04'||CAUTION_CUST_STTS_CD === 'REQ05'||CAUTION_CUST_STTS_CD === 'REQ06'||CAUTION_CUST_STTS_CD === 'REQ07'?true:false"
            ></v-select>
          </div>
          <template v-if="PRC_STTS_CD !== 'REQ08'">
            <span class="pl-label">
              철회사유
            </span>
            <div class="pl-desc">
              <v-select
                v-model="WDRW_RSN_CD"
                class="pl-form type-middle"
                :items="WDRW_RSN_LIST"
                placeholder="선택"
                :disabled="PropData.STTS_CD === 'REQ03'?CAUTION_CUST_STTS_CD === 'REQ04'||CAUTION_CUST_STTS_CD === 'REQ05'||CAUTION_CUST_STTS_CD === 'REQ06'||CAUTION_CUST_STTS_CD === 'REQ07'?true:false:PRC_STTS_CD === 'REQ05'?false:true"
              ></v-select>
            </div>
          </template>
        </div>
        <template v-if="(PropData.STTS_CD === 'REQ02' || CAUTION_CUST_STTS_CD === 'REQ04' || CAUTION_CUST_STTS_CD === 'REQ07') && PRC_STTS_CD !== 'REQ05'">
          <div class="pl-form-inline" v-if="PRC_STTS_CD !== 'REQ08'">
            <span class="pl-label">
              기안자
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="GIVER_NM"
                class="pl-form type-middle"
                placeholder="기안자 입력"
                :disabled="CAUTION_CUST_STTS_CD === 'REQ04'||CAUTION_CUST_STTS_CD === 'REQ05'||CAUTION_CUST_STTS_CD === 'REQ06'||CAUTION_CUST_STTS_CD === 'REQ07'?true:false"
              />
              <v-text-field
                v-model="DRFT_DOC_NO"
                class="pl-form type-middle"
                placeholder="기안 문서번호 입력"
                :disabled="CAUTION_CUST_STTS_CD === 'REQ04'||CAUTION_CUST_STTS_CD === 'REQ05'||CAUTION_CUST_STTS_CD === 'REQ06'||CAUTION_CUST_STTS_CD === 'REQ07'?true:false"
              />
            </div>
          </div>
          <div class="pl-form-inline" v-if="PRC_STTS_CD !== 'REQ08'">
            <span class="pl-label">
              IVR 차단
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="IVR_CUTOFF_PERIOD_CD"
                row
                class="pl-radio-group"
              >
                <v-radio
                  v-for="(rad01, index) in mixin_common_code_get(list_common_code, 'VOC_CUTDAY', '')"
                  :key="rad01.value"
                  :label="rad01.text"
                  :value="rad01.value"
                  class="pl-radio"
                  :disabled="CAUTION_CUST_STTS_CD === 'REQ04'||CAUTION_CUST_STTS_CD === 'REQ05'||CAUTION_CUST_STTS_CD === 'REQ06'||CAUTION_CUST_STTS_CD === 'REQ07'?true:false"
                >
                </v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-form-inline" v-if="PRC_STTS_CD !== 'REQ08'">
            <span class="pl-label">
              차단 기간{{ IVR_CUTOFF_PERIOD_CD }}
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="CUTOFF_BGNG_DT"
                class="pl-form type-middle"
                :disabled="true"
                />
              <span class="pl-unit">~</span>
              <v-text-field
                v-model="CUTOFF_END_DT"
                class="pl-form type-middle flex-grow-0"
                :disabled="true"
                />
            </div>
          </div>
        </template>
        <div class="pl-form-inline">
          <span class="pl-label">
            비고
          </span>
          <div class="pl-desc">
            <v-textarea
              v-model="RMRK"
              class="pl-form is-noresize"
              :spellcheck="false"
              height="80"
              placeholder="기타 내용 입력"
              :disabled="CAUTION_CUST_STTS_CD === 'REQ04'||CAUTION_CUST_STTS_CD === 'REQ05'||CAUTION_CUST_STTS_CD === 'REQ06'||CAUTION_CUST_STTS_CD === 'REQ07'?true:false"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'StatusBoardSlideDetail_TAB_01', //배려고객 상세 - 처리정보
  props:{
    PropData: {
      type: Object,
    },
  },
  components: {
  },
  data() {
    return {
      list_common_code : [],

      TEMP_CUTOFF_ST_DT : '', //임시차단 시작 일시
      CAUTION_CUST_STTS_CD : '', //배려고객 상태
      CUSL_RST_YN : false, //상담사 휴게 여부
      CUSL_RST_HR : '', //상담사 휴게 시간(분)
      CUSL_PCLG_CUTT_YN : false, //상담사 심림 상담 여부

      RQSTR_DEPT_NM : '', //요청자 소속 정보
      RQSTR_NM : '', //요청자 명
      DMND_DT : '', //요청일시

      GIVER_NM : '', //기안자 명
      DRFT_DOC_NO : '', //문서 번호
      IVR_CUTOFF_PERIOD_CD : '', //IVR 차단 기간 코드
      CUTOFF_BGNG_DT : '', //차단 시작 일시
      CUTOFF_END_DT : '', //차단 종료 일시
      RMRK : '', //비고
      WARN_TYPE_NM : '', //차단유형

      PRC_STTS_CD_LIST : [], //처리 결과 코드 목록
      PRC_STTS_CD : 'REQ04', //처리 결과 코드
      
      WDRW_RSN_LIST : [], //철회 사유 코드 목록
      WDRW_RSN_CD : '', //철회 사유 코드

      VOC_REQ_CD: "REQ02", //차단요청
    }
  },
  computed: {
  },
  watch: {
    PRC_STTS_CD(){
      if(this.PRC_STTS_CD !== 'REQ05' && this.PRC_STTS_CD !== 'REQ06') this.WDRW_RSN_CD = '';
    },
    IVR_CUTOFF_PERIOD_CD() {
      if(this.IVR_CUTOFF_PERIOD_CD) this.custCautionPeriodSelect();
    },
    PropData(){
      this.custCautionSelect();
    }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("custCautionProcInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("custCautionReqConfrim"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("custCautionConfrim"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("custCautionWithdrawalConfrim"); //eventBus 중복방지를 위해 off
  },
  async created() {
    //공통코드설정
    let codeName = ['VOC_REQ','VOC_CUTDAY', 'VOC_CALOFF']; //배려고객 요청구분, 배려고객 차단 기간 코드, 철회 사유
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.PRC_STTS_CD_LIST = [];
    if(this.computedUserDetailType === 'CENTER_LEADER' || this.computedUserDetailType === 'TEAM_LEADER'){ //센터장, 팀장(부팀장)
      this.mixin_common_code_get(this.list_common_code, 'VOC_REQ', '').forEach((item, idx) => {
        if(idx > 2 && idx < 6) this.PRC_STTS_CD_LIST.push(item);
      });
    }else if(this.computedUserDetailType === 'SYS_ADMIN' || this.computedUserDetailType === 'SYS_HUMAN' || this.computedUserDetailType === 'SYS_MANAGER'){
      if(this.PropData.STTS_CD === 'REQ02'){ //차단요청
        this.mixin_common_code_get(this.list_common_code, 'VOC_REQ', '').forEach((item, idx) => {
          if((idx > 2 && idx < 4) || idx === 7) this.PRC_STTS_CD_LIST.push(item);
        });
      }else if(this.PropData.STTS_CD === 'REQ03'){ //철회요청
        this.mixin_common_code_get(this.list_common_code, 'VOC_REQ', '').forEach((item, idx) => {
          if(idx > 3 && idx < 6) this.PRC_STTS_CD_LIST.push(item);
        });
        this.PRC_STTS_CD = 'REQ05';
      }else{
        this.mixin_common_code_get(this.list_common_code, 'VOC_REQ', '').forEach((item, idx) => {
          if(idx > 2 && idx < 6) this.PRC_STTS_CD_LIST.push(item);
        });
      }
    }

    this.WDRW_RSN_LIST = this.mixin_common_code_get(this.list_common_code, 'VOC_CALOFF', '');

    this.$eventBus.$on("custCautionReqConfrim", () => {
      this.custCautionReqConfrim(); //배려고객 요청
    });
    
    this.$eventBus.$on("custCautionConfrim", () => {
      this.custCautionConfrim(); //배려고객 처리
    });
    
    this.$eventBus.$on("custCautionWithdrawalConfrim", () => {
      this.custCautionWithdrawalConfrim(); //배려고객 철회 처리
    });

    this.custCautionSelect(); //배려 고객 처리 정보 조회
  },
  methods: {
    //배려고객 처리 내용 조회
    async custCautionSelect(){
      let postParam = {
        CUST_ID : this.PropData.CUST_ID
        , PHN_CUTT_ID : this.PropData.PHN_CUTT_ID
      };

      let headParam = {
        head: {
          ns: "lhcs.cust.dao.CustMapper",
          sn: "custCautionProcSelect"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/custCautionProcSelect", postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        console.log(response.DATA[0]);
        this.PRC_STTS_CD = response.DATA[0].CAUTION_CUST_STTS_CD;
        this.TEMP_CUTOFF_ST_DT = response.DATA[0].TEMP_CUTOFF_ST_DT;//임시차단 시작 일시
        this.CAUTION_CUST_STTS_CD = response.DATA[0].CAUTION_CUST_STTS_CD;
        this.CUSL_RST_YN = response.DATA[0].CUSL_RST_YN === 'Y' ? true : false;
        this.CUSL_RST_HR = response.DATA[0].CUSL_RST_HR;
        this.CUSL_PCLG_CUTT_YN = response.DATA[0].CUSL_PCLG_CUTT_YN === 'Y' ? true : false;
        this.RQSTR_DEPT_NM = response.DATA[0].RQSTR_DEPT_NM;
        this.RQSTR_NM = response.DATA[0].RQSTR_NM;
        this.DMND_DT = response.DATA[0].DMND_DT;

        this.GIVER_NM = response.DATA[0].GIVER_NM;
        this.DRFT_DOC_NO = response.DATA[0].DRFT_DOC_NO;
        this.IVR_CUTOFF_PERIOD_CD = response.DATA[0].IVR_CUTOFF_PERIOD_CD;
        this.WDRW_RSN_CD = response.DATA[0].WDRW_RSN_CD;
        this.CUTOFF_BGNG_DT = response.DATA[0].CUTOFF_BGNG_DT;
        this.CUTOFF_END_DT = response.DATA[0].CUTOFF_END_DT;
        this.RMRK = response.DATA[0].RMRK;
        this.WARN_TYPE_NM = response.DATA[0].WARN_TYPE_NM;

        this.$emit('setCautionCn', response.DATA[0].CAUTION_CN);
      }
    },

    //배려고객 요청 Confirm
    async custCautionReqConfrim(){
      if(this.CUSL_RST_YN){
        if(!this.CUSL_RST_HR){
          this.showAlertInfo({msg : '휴게시간을 입력해 주세요.'});
          return;
        }else{
          if(isNaN(this.CUSL_RST_HR)){
            this.showAlertInfo({msg : '휴게시간은 숫자만 입력 가능 합니다.'});
            return;
          }
        }
      }

      let sMsg = '';
      if(this.VOC_REQ_CD === 'REQ02') sMsg = '차단요청을 하시겠습니까?'
      else sMsg = '철회요청을 하시겠습니까?'

      this.showConfirmInfo({msg: sMsg
        , callYes : ()=>{
          this.custCautionProc(); 
        }
        , callNo : this.closeAlert
      });
    },

    //배려고객 처리 Confirm
    async custCautionConfrim(){

      if(this.PRC_STTS_CD === 'REQ04'){ //정식차단
        if(!this.IVR_CUTOFF_PERIOD_CD){
          this.showAlertInfo({msg : 'IVR 차단 기간을 선택해 주세요.'});
          return;
        }
      }

      if(this.PRC_STTS_CD === 'REQ05') { //철회
        if(!this.WDRW_RSN_CD){
          this.showAlertInfo({msg : '철회요청 사유를 선택해 주세요.'});
          return;
        }
      }

      let sMsg = '';
      if(this.PRC_STTS_CD === 'REQ04') sMsg = '정식차단 처리 하시겠습니까?'
      else if(this.PRC_STTS_CD === 'REQ05') sMsg = '철회 처리 하시겠습니까?'
      else if(this.PRC_STTS_CD === 'REQ06') sMsg = '철회반려 처리 하시겠습니까?'
      else if(this.PRC_STTS_CD === 'REQ08') sMsg = '정식차단 요청을 반려 처리 하시겠습니까?'

      this.showConfirmInfo({msg: sMsg
        , callYes : ()=>{
          this.custCautionProc(); 
        }
        , callNo : this.closeAlert
      });
    },
    
    //배려고객 철회 처리 Confirm
    async custCautionWithdrawalConfrim(){

      let sMsg = '철회 처리 하시겠습니까?'

      this.showConfirmInfo({msg: sMsg
        , callYes : ()=>{
          this.PRC_STTS_CD = 'REQ05';
          this.custCautionProc();
        }
        , callNo : this.closeAlert
      });
    },

    //배려고객 처리
    async custCautionProc(){
      let postParam = {
        CUST_ID : this.PropData.CUST_ID
        , PHN_CUTT_ID : this.PropData.PHN_CUTT_ID
        , USER_DTL_TYPE : this.computedUserDetailType
      };

      //센터장, 팀장(부팀장)인 경우에만 (차단요청, 철회요청) 가능
      if(this.computedUserDetailType === 'CENTER_LEADER' || this.computedUserDetailType === 'TEAM_LEADER'){

        postParam.CAUTION_CUST_STTS_CD = this.VOC_REQ_CD;
        postParam.CUSL_RST_YN = this.CUSL_RST_YN?'Y':'N';
        postParam.CUSL_RST_HR = this.CUSL_RST_HR;
        postParam.CUSL_PCLG_CUTT_YN = this.CUSL_PCLG_CUTT_YN?'Y':'N';
      }else if(this.computedUserDetailType === 'SUPER_ADMIN' || this.computedUserDetailType === 'SYS_ADMIN' || this.computedUserDetailType === 'SYS_HUMAN' || this.computedUserDetailType === 'SYS_MANAGER'){
        if(this.PRC_STTS_CD !== 'REQ05' && this.PRC_STTS_CD !== 'REQ06') this.WDRW_RSN_CD = '';

        postParam.CAUTION_CUST_STTS_CD = this.PRC_STTS_CD;

        if(this.PRC_STTS_CD !== 'REQ08'){
          postParam.WDRW_RSN_CD = this.WDRW_RSN_CD;
          postParam.GIVER_NM = this.GIVER_NM;
          postParam.DRFT_DOC_NO = this.DRFT_DOC_NO;
          postParam.IVR_CUTOFF_PERIOD_CD = this.IVR_CUTOFF_PERIOD_CD;
          postParam.CUTOFF_BGNG_DT = this.CUTOFF_BGNG_DT.replace(/[^0-9]/g, '');
          postParam.CUTOFF_END_DT = this.CUTOFF_END_DT.replace(/[^0-9]/g, '');
        }

        postParam.RMRK = this.RMRK;
      }

      let headParam = {head: {}};
      const response = await this.common_postCall('/api/cust/custCautionProc', postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '정상 처리 되었습니다.'});
        this.$emit('closeModal');
        this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
        
        if(this.computedUserDetailType === 'CENTER_LEADER' || this.computedUserDetailType === 'TEAM_LEADER'){
          this.mixin_reloadCuttStat('BLACK_CUST_STAT');
        }else if(this.computedUserDetailType === 'SYS_HUMAN'){
          this.mixin_reloadCuttStat('SYS_HUMAN_REQ_STAT');
        }else if(this.computedUserDetailType === 'SYS_MANAGER'){
          this.mixin_reloadCuttStat('SYS_MANAGER_REQ_STAT');
        }

        this.$eventBus.$emit('getCustCautionList');
        this.$eventBus.$emit('getCustCautionList1');
        this.$eventBus.$emit('getCustCautionList2');
        this.$eventBus.$emit('getCustCautionList3');
        return;
      }
    },

    //배려고객 차단 기간 조회
    async custCautionPeriodSelect(){
      let postParam = {
        TEMP_YN : 'N'
        , TEMP_CUTOFF_ST_DT : this.PropData['REG_DT']
        , CUTOFF_DT : Number(this.IVR_CUTOFF_PERIOD_CD)
      };

      let headParam = {
        head: {
          ns: "lhcs.cust.dao.CustMapper",
        }
      };
      const response = await this.common_postCall('/api/biz/common/select/custCautionPeriodSelect', postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        this.CUTOFF_BGNG_DT = this.mixin_convertDate(response.DATA[0].ST_DT, 'yyyy-MM-dd')
        this.CUTOFF_END_DT = this.mixin_convertDate(response.DATA[0].END_DT, 'yyyy-MM-dd')
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>