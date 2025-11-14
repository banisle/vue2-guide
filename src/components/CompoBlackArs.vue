<template>
  <div style="height: 530px;">

    <div class="is-mt-s">
      <h3 class="pl-subtit">경고 구사 절차</h3>
      <div class="pl-subdesc">
        <p>상황에 맞는 버튼을 클릭 하시면 경고 구사 절차와 안내 문구가 표시됩니다. 절차에 따라 경고 멘트를 ARS로 송출할 수 있습니다.</p>
      </div>
      <!-- 유형 -->
      <div class="is-mt-m" style="display: grid; gap: 8px; grid-template-columns: repeat(4,1fr) ">
        <template v-for="item,blackindex in CAUTION_TYPE_LIST">
          <v-btn
            :key="blackindex"
            :class="`pl-btn is-esp ${blackindex === selectedIndex ? 'is-bg-indigo' : ''}`"
            @click="selectCurrentRequest(item, blackindex)"
            >{{ item.text }}</v-btn>
        </template>
      </div>
      <!-- 경고멘트 -->
      <div class="is-border-sub-top is-mt-m pt-3" v-if="!mixin_isEmpty(selectedIndex)">
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 ai-script "></v-icon>
          <div
            class="pl-subtit ml-1 font-weight-light">경고 멘트 및 구사 횟수 :
            <strong class="is-txt-red ml-1 font-weight-bold">{{CAUTION_TYPE_LIST[selectedIndex].list.length}}회</strong> <strong
            class="font-weight-bold ml-1 mr-1">구사 후 ARS 전환</strong>
            <template v-if="WARN_TYPE_CD !== 'BLC01'"><!-- 성희롱이 아닐때 -->
              <strong>
                (성희롱 외 <span class="is-txt-blue ml-1">{{ CAUTION_TYPE_LIST[selectedIndex].caution }}</span>)
              </strong>
            </template>
            <template v-else>
              <strong class="is-txt-blue">
                ({{ CAUTION_TYPE_LIST[selectedIndex].caution }})
              </strong>
            </template>
          </div>
        </div>
        <div class="step-wrap spacing-wrap sp-4 flex-column is-mt-m" style="height: 67px">
          <div
            class="d-flex align-center"
            v-for="tab, index in CAUTION_TYPE_LIST[selectedIndex].list"
            :key="index">
            <span class="font-weight-bold is-txt-red align-self-start"> [{{ index + 1 }}차]</span>
            <div class="d-flex justify-center align-center ml-2 flex-column">
              <strong>{{ tab.text }}</strong>
            </div>
            <compo-tooltip-btn
              TitleProp="경고멘트 ARS 송출"
              ClassProp="pl-tooltip-btn ml-1"
              IconProp="pl-icon20 main-voc"
              TooltipPositionProp="bottom"
              :MinWidthProp="22"
              :HeightProp="22"
              @btnClick="cautionMent(tab, index)"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
      <div v-else
        class="is-border-sub-top d-flex align-center is-mt-m pt-3">
        <v-icon class="pl-icon20 ai-script "></v-icon>
        <span class="ml-1">배려고객 상황별 절차와 경고 멘트가 조회됩니다.</span>
      </div>
      <!-- form -->
      <div class="pl-form-inline-wrap vertical is-mt-l pt-3 gap-8 is-border-sub-top">
        <div class="pl-form-inline">
          <span class="pl-label" style="flex: 0 0 60px">
            구사 횟수
          </span>
          <div class="spacing-wrap flex-wrap" style="gap: 8px 16px; ">
            <span v-for="item,index in EXEC_CAUTION_LIST" :key="index">
              {{ item.text }} <strong>({{item.time}})</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- info -->
    <div class="is-border-sub-top is-mt-m pt-3 pb-3">
      <h3 class="pl-subtit">임시 차단</h3>
      <div class="pl-subdesc">
        <p v-if="Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6">[임시차단 하기] 버튼을 클릭 하시면 즉시 임시 차단됩니다.</p>
        <p v-else>[배려고객 문자발송] 버튼을 클릭 하시면 대상 고객에게 문자가 발송되고 즉시 임시 차단됩니다.</p>
      </div>
      <div class="pl-rounded-box pa-3 is-mt-s">
        <span class="pl-label">
          <v-icon class="pl-icon20 phone-ban"></v-icon>
          <span class="ml-1">전화번호</span>
          <span class="ml-2 pl-value-txt">{{ mixin_setPhoneNo(CUST_INFO.CUST_PHN_NO) }}</span>
          <v-btn v-if="Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, '')) === 6"
            class="pl-btn is-esp3 ml-auto"
            @click="custTempBlockConfirm"
          >임시차단 하기</v-btn>
          <v-btn v-else
            class="pl-btn is-esp3 ml-auto"
            @click="custTempBlockConfirm"
          >배려고객 문자발송</v-btn>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ipronCallUtil } from '@/store/ipronCallUtil';

export default {
  name: 'CompoBlackArs', //배려고객 ARS
  components: {
  },
  props: {
    CUST_INFO : {
      type: Object,
    },
    CUTT_EXEC_CAUTION_LIST : {
      type: Array,
    },
  },
  data() {
    return {
      list_common_code : [],

      selectedIndex: null,

      CUST_PHN_NO : '', //고객 전화번호
      CAUTION_TYPE_LIST : [], //배려고객 차단 유형
      WARN_TYPE_CD : '', //경고 유형 코드
      WARN_TYPE_NM : '', //경고 유형 명
      EXEC_CAUTION_LIST : [], //경고 구사 이력

      currentType: [],
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("reSetCautionCustInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("lastArsDataDel"); //eventBus 중복방지를 위해 off
  },
  async created() {
    //공통코드설정
    let codeName = ['VOC_CUTTP']; //배려고객 차단유형
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.$eventBus.$on("reSetCautionCustInfo", () => {
      this.init();
    });
    
    this.$eventBus.$on("lastArsDataDel", () => {
      let lastNum = this.EXEC_CAUTION_LIST.length;
      let arrExecCautionList = [];
      if(lastNum > 0){
        this.EXEC_CAUTION_LIST.forEach((data, idx) => {
          if(lastNum !== (idx + 1)) arrExecCautionList.push(data);
        });

        this.EXEC_CAUTION_LIST = arrExecCautionList;
      }

      this.$eventBus.$emit('CUST_CAUTION_HIST', this.EXEC_CAUTION_LIST);
    });

    this.init();
  },
  methods: {
    init(){
      this.selectedIndex = null;
      this.CUST_PHN_NO = '';
      this.WARN_TYPE_CD = '';
      this.WARN_TYPE_NM = '';
      this.EXEC_CAUTION_LIST = [];
      this.CAUTION_TYPE_LIST = [];

      if(this.CUTT_EXEC_CAUTION_LIST.length > 0) this.EXEC_CAUTION_LIST = this.CUTT_EXEC_CAUTION_LIST;
      // this.$eventBus.$emit('CUST_CAUTION_HIST', []);

      this.mixin_common_code_get(this.list_common_code, 'VOC_CUTTP', '').forEach((item, idx) => {
        if(item.value === 'BLC01') { //성희롱
          item.caution = '경고 멘트 구사 생략 후 즉시 ARS 전환 가능';
          item.list = [
            { text: '고객님의 발언은 성희롱에 해당하므로 상담을 종료하고 ARS 로 연결하겠습니다.', }
          ];
        }else if(item.value === 'BLC02') { //욕설
          item.caution = '복합유형 3회 구사';
          item.list = [
            { text: '고객님, 욕설을 삼가해주십시오. 욕설을 하실 경우 상담을 도와드리기 어렵습니다.', }
            , { text: '반복하여 욕설하였으므로 상담을 종료하고, ARS 로 연결하겠습니다.', }
          ];
        }else if(item.value === 'BLC03') { //폭언
          item.caution = '[비하발언], [모욕에 해당하는 발언], [협박에 해당하는 발언]으로 대체 가능';
          item.list = [
            { text: '고객님, 폭언을 삼가해주십시오, 폭언을 하실 경우 상담을 도와드리기 어렵습니다.', }
            , { text: '반복하여 폭언하였으므로 상담을 종료하고 ARS 로 연결하겠습니다. ', }
          ];
        }else if(item.value === 'BLC04') { //반복억지
          item.caution = '복합유형 3회 구사';
          item.list = [
            { text: '고객님, 문의하신 내용에 대해 앞서 모두 안내드렸으며, 동일한 내용 문의시 상담을 도와드리기 어렵습니다.', }
            , { text: '고객님, 문의하신 부분에 대해 추가로 안내드릴 사항은 없습니다.', }
            , { text: '문의하신 부분에 대해 더 이상 안내를 도와 드리기 어려워 상담을 종료하고 ARS 로 연결하겠습니다.', }
          ];
        }else if(item.value === 'BLC05') { //민원불분명
          item.caution = '복합유형 3회 구사';
          item.list = [
            { text: '고객님, 문의내용을 파악하기 어려운 경우 상담을 도와드리기 어렵습니다. 문의 내용을 정확히 말씀해주십시오.', }
            , { text: '다시 한번 말씀드립니다. 고객님, 문의내용을 정확하게 말씀해 주십시오.', }
            , { text: '정확한, 문의 내용을 파악하기 어려워 상담을 종료하고 ARS 로 연결하겠습니다.', }
          ];
        }else if(item.value === 'BLC06') { //사유없는콜백
          item.caution = '복합유형 3회 구사';
          item.list = [
            { text: '고객님, 문의내용없이 콜백만 요청하실 경우 상담을 도와드리기 어렵습니다. ', }
            , { text: '다시 한번 말씀드립니다. 고객님, 문의내용이 없을경우 콜백을 진행하기 어렵습니다. ', }
            , { text: '앞서 충분히 안내드렸으므로 상담을 종료하고 ARS로 연결하겠습니다.', }
          ];
        }else if(item.value === 'BLC07') { //반말
          item.caution = '복합유형 3회 구사';
          item.list = [
            { text: '고객님, 반말을 삼가하여 주십시오. 반말을 하실 경우 상담을 도와드리기 어렵습니다. ', }
            , { text: '다시 한번 말씀드립니다. 고객님, 반말을 삼가하여 주십시오. ', }
            , { text: '지속적으로 반말을 사용하셨으므로 상담을 종료하고 ARS로 연결하겠습니다.', }
          ];
        }
        this.CAUTION_TYPE_LIST.push(item);
      });
    },

    // 배려고객 ARS
    selectCurrentRequest(item, index){
      this.closeAlert();
      this.selectedIndex = index;
      this.WARN_TYPE_CD = item.value;
      this.WARN_TYPE_NM = item.text;
    },
    cautionMent(item, index){
      const ctiNum = Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, ''));

      if(ctiNum === 6){ //통화중
        let sendData = this.CAUTION_TYPE_LIST[this.selectedIndex];
        sendData.ORD = index+1;

        this.showConfirmInfo({
          msg : '<font color="blue"><b>' + sendData.text + '</b></font> <font color="red">' + sendData.ORD + '차</font> 경고 멘트를 내보내시겠습니까?'
          , callYes : () => {
            this.$eventBus.$emit('CUST_CAUTION_ARS', sendData);

            let currentTime = this.$moment().format('HH:mm:ss');
            const blackRequest = { text: item.text, time: currentTime}
            this.EXEC_CAUTION_LIST.push({ text: this.WARN_TYPE_NM, value: this.WARN_TYPE_CD, time: blackRequest.time })

            this.sendCustCautionHist();
            this.closeAlert();
          }
          , callNo : this.closeAlert
        });
      }else{
        this.showAlertInfo({msg : '통화중인 경우에만 멘트 전송이 가능 합니다.'});
        return;
      }
    },

    sendCustCautionHist(){
      this.$eventBus.$emit('CUST_CAUTION_HIST', this.EXEC_CAUTION_LIST);
    },

    //임시 차단하기
    custTempBlockConfirm(){
      let CTI_STAT_INFO = JSON.parse(ipron.GetExtensionData(ipronCallUtil.ExHandle));
      let CTI_STAT = '1';
      if('UEI23' in CTI_STAT_INFO){
        CTI_STAT = CTI_STAT_INFO.UEI23[0];
      }

      if(Number(CTI_STAT) !== 0){
        this.showAlertInfo({msg : 'ARS 멘트 송출 중입니다.<br>해당 멘트 종료 후 다시 시도해 주세요.'});
        return;
      }else{
        const ctiNum = Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, ''));
        let sMsg = '임시 차단 하시겠습니까?';
        let sndSmsYn = 'N';
  
        if(ctiNum !== 6){
          sMsg = '배려고객 문자발송을 하시겠습니까?';
          sndSmsYn = 'Y';
        }
  
        this.showConfirmInfo({
          msg: sMsg
          ,callYes : () => {
            this.custTempBlockConProc(sndSmsYn);
          },
          callNo : this.closeAlert
        });
      }

    },

    //임시 차단
    async custTempBlockConProc(sndSmsYn){
      let URLData = "/api/cust/custCautionCuttProc";
      let postParam = {
        CUST_ID : this.CUST_INFO.CUST_ID
        , PHN_CUTT_ID : -1
        , SEND_SMS_YN : sndSmsYn
      };

      if(sndSmsYn === 'Y'){
        postParam.CUST_ID = this.CUST_INFO.CUST_ID;
        postParam.MOBILE = this.CUST_INFO.CUST_PHN_NO.replace(/[^0-9]/g, "");
        postParam.DSPTCH_NO = this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO //발신번호
        postParam.CUSL_NM = this.$store.getters['userStore/GE_USER_ROLE'].userName //발신자명
      }

      let response = await this.common_postCall(URLData, postParam, {head: {}});

      if (!response.HEADER.ERROR_FLAG){
        if(sndSmsYn === 'Y'){
          // this.$eventBus.$emit('reSetCautionCustInfo'); //배려고객
          this.$eventBus.$emit('CloseBalckArs'); //배려고객 ARS 모달 닫기
        }else{
          this.$eventBus.$emit('CUST_TEMP_BLOCK');
        }
        this.$eventBus.$emit('setBlackCust'); //고객 정보 임시차단 변경
        this.closeAlert();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>