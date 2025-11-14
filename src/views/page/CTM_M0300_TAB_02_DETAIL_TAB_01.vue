<template>
  <div class="pt-3 px-5">
    <div class="pl-form-inline-wrap vertical label-80 gap-8">
      <div class="pl-form-inline">
        <span class="pl-label">
          민원 분류
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle is-sm"
            v-model="cvlcpltCls1"
            :items="DROP_CVLCPT_CLS1"
            @change="changeCvlcpltCls('1')"
            placeholder="선택"
            :disabled="isFinish && !ADMIN_YN"
          />
          <v-select
            class="pl-form type-middle is-sm"
            v-model="cvlcpltCls2"
            :items="DROP_CVLCPT_CLS2"
            @change="changeCvlcpltCls('2')"
            placeholder="선택"
            :disabled="isFinish && !ADMIN_YN"
          />
          <v-select
            class="pl-form type-middle"
            v-model="CVLCPT_DATA.CVLCPT_CLSF_ID"
            :items="DROP_CVLCPT_CLS3"
            placeholder="선택"
            :disabled="isFinish && !ADMIN_YN"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          민원내용
        </span>
        <div class="pl-desc">
          <v-textarea
            class="pl-form is-noresize"
            v-model="CVLCPT_DATA.CVLCPT_CN"
            :spellcheck="false"
            placeholder="민원내용 입력"
            height="80"
            v-byte-counter="4000"
            :disabled="isFinish"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          보상 여부
        </span>
        <div class="pl-desc">
          <v-checkbox
            v-model="CVLCPT_DATA.CPST_YN"
            class="pl-check"
            :disabled="isFinish"
            @change="changeCpstYn"
          ></v-checkbox>
          <v-text-field
            :disabled="!CVLCPT_DATA.CPST_YN || isFinish"
            v-model="CVLCPT_DATA.CPST_CN"
            class="pl-form type-middle"
            placeholder="보상 요구 내용이 있을 경우 내용 입력"
            />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          블컨 여부
        </span>
        <div class="pl-desc">
          <v-checkbox
            v-model="CVLCPT_DATA.CAUTION_CUST_YN"
            class="pl-check"
            :disabled="isFinish"
            @change="changeCautionCustYn"
          ></v-checkbox>
          <v-text-field
            :disabled="!CVLCPT_DATA.CAUTION_CUST_YN || isFinish"
            v-model="CVLCPT_DATA.CAUTION_CUST_DOC_NO"
            class="pl-form type-middle"
            placeholder="블랙컨슈머인 경우 참조 기안번호 입력"
            />
        </div>
      </div>
    </div>

    <!-- 최종 처리 결과 -->
    <div class="is-mt-l">
      <div class="pl-subtit">최종 처리 결과</div>
      <div class="pt-3 is-mt-s is-border-sub-top">
        <div class="pl-form-inline-wrap vertical label-80 gap-8">
          <div class="pl-form-inline">
            <span class="pl-label">
              진행 상태
            </span>
            <div class="pl-desc">
              <v-radio-group
                v-model="CVLCPT_DATA.PRGRS_STTS_CD"
                row
                class="pl-radio-group"
                @change="changePrgrsSttsCd"
                :disabled="isFinish"
              >
                <v-radio class="pl-radio" label="진행중" value="P"></v-radio>
                <v-radio class="pl-radio" label="종결" value="E"></v-radio>
              </v-radio-group>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              처리 결과
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                v-model="CVLCPT_DATA.PRCS_RSLT_CN"
                :spellcheck="false"
                placeholder="민원 최종 처리결과 내용을 요약하여 입력"
                height="80"
                v-byte-counter="4000"
                :disabled="isFinish"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              개선 방안
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                v-model="CVLCPT_DATA.IPRVMT_CN"
                :spellcheck="false"
                placeholder="개선방안 내용 입력"
                height="80"
                v-byte-counter="4000"
                :disabled="isFinish"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              최종 처리일
            </span>
            <div class="pl-desc">
              <compo-date-picker
                DateType="dateTime"
                :DateProp.sync="CVLCPT_DATA.LAST_PRCS_DATE"
                :TimesProp.sync='CVLCPT_DATA.LAST_PRCS_TIME'
                StyleProp="flex: 1"
                :DisabledProp="CVLCPT_DATA.PRGRS_STTS_CD != 'E' || isFinish"
                />
            </div>
            <span class="pl-label">
              최종 처리자
            </span>
            <div class="pl-desc">
              <!-- TODO 최종 처리자 입력 OR 수정자 -->
              <v-text-field
                v-model="CVLCPT_DATA.LAST_PRCR_NM"
                class="pl-form type-middle is-sm"
                disabled
                />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CTM_M0300_TAB_02_DETAIL_TAB_01', //민원 내용/처리결과 탭
  components: {
  },
  props:{
    CVLCPT_DATA:{
      type:Object
      , default: {}
    },
    isFinish:{
      type: Boolean
      , default: false
    }
  },
  data() {
    return {
      model01: '대내민원',
      model02: '귀책없음',
      model03: '',
      chk01: true,
      chk02: false,

      // 최종처리결과
      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep2: '05:50',
      timeAmpm: '오후',
      model08: '나팀장',

      radioGroupSelected: "진행중",
      radioGroup: [
        {
          text: "진행중",
        },
        {
          text: "종결",
        },
      ],

      cvlcptClsList:[],
      cvlcpltCls1:"",
      cvlcpltCls2:"",

      DROP_CVLCPT_CLS1:[],
      DROP_CVLCPT_CLS2:[],
      DROP_CVLCPT_CLS3:[],

      ADMIN_YN: false,
    }
  },
  methods: {
    async selectCvlcptClsfList(){
      this.cvlcptClsList = [];

      // let sUrl = '/phone-api/cvlcpt/selectCvlcptClsfList';
      let sUrl = '/api/biz/common/select/selectCvlcptClsfList';

      let postParam = {};
      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "selectCvlcptClsfList"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        this.cvlcptClsList = response.DATA.map(row=>{
          row.text = row.CVLCPT_CLSF_NM;
          row.value = row.CVLCPT_CLSF_ID;
          return row;
        });
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 민원분류 변경
    changeCvlcpltCls(type){
      if(type == "1"){
        this.cvlcpltCls2 = "";
        this.CVLCPT_DATA.CVLCPT_CLSF_ID = "";
        this.DROP_CVLCPT_CLS2 = this.cvlcpltCls1 != "" ? [...[{text:"선택", value:""}], ...this.cvlcptClsList.filter(row=>{return row.UP_CVLCPT_CLSF_ID == this.cvlcpltCls1})] : [{text:"선택", value:""}];
        this.DROP_CVLCPT_CLS3 = [{text:"선택", value:""}];
      }else if(type == "2"){
        this.CVLCPT_DATA.CVLCPT_CLSF_ID = "";
        this.DROP_CVLCPT_CLS3 = this.cvlcpltCls2 != "" ? [...[{text:"선택", value:""}], ...this.cvlcptClsList.filter(row=>{return row.UP_CVLCPT_CLSF_ID == this.cvlcpltCls2})] : [{text:"선택", value:""}];
      }else{
        this.cvlcpltCls1 = "";
        this.cvlcpltCls2 = "";
        this.CVLCPT_DATA.CVLCPT_CLSF_ID = "";
        this.DROP_CVLCPT_CLS1 = [...[{text:"선택", value:""}], ...this.cvlcptClsList.filter(row=>{return row.UP_CVLCPT_CLSF_ID == ""})];
        this.DROP_CVLCPT_CLS2 = [{text:"선택", value:""}];
        this.DROP_CVLCPT_CLS3 = [{text:"선택", value:""}];
      }
    },
    
    changeCpstYn(){
      if(!this.CVLCPT_DATA.CPST_YN) this.CVLCPT_DATA.CPST_CN = "";
    },

    changeCautionCustYn(){
      if(!this.CVLCPT_DATA.CAUTION_CUST_YN) this.CVLCPT_DATA.CAUTION_CUST_DOC_NO = "";
    },

    // 진행 상태 변경
    changePrgrsSttsCd(){
      if(this.CVLCPT_DATA.PRGRS_STTS_CD == "E"){
        this.CVLCPT_DATA.LAST_PRCS_DATE = this.$moment().format("YYYY-MM-DD");
        this.CVLCPT_DATA.LAST_PRCS_TIME = this.$moment().format("HH:mm");
      }else{
        this.CVLCPT_DATA.LAST_PRCS_DATE = "";
        this.CVLCPT_DATA.LAST_PRCS_TIME = "";
      }
    },
  },
  async mounted() {
    await this.selectCvlcptClsfList();
    this.changeCvlcpltCls();
    this.ADMIN_YN = this.computedUserType == "ETC_ADMIN";
  },
  created() {
  },
  computed: {
  },
  watch: {
    "CVLCPT_DATA.CVLCPT_CLSF_FULL_PATH_ID"(){
      // 민원분류 셋팅
      if(!this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_CLSF_FULL_PATH_ID)){
        // let cvlcpltCls = this.CVLCPT_DATA.CVLCPT_CLSF_FULL_PATH_ID.split(">");
        this.cvlcpltCls1 = this.CVLCPT_DATA.CVLCPT_CLSF_ID1;
        this.changeCvlcpltCls("1");
        this.cvlcpltCls2 = this.CVLCPT_DATA.CVLCPT_CLSF_ID2;
        this.changeCvlcpltCls("2");
        this.CVLCPT_DATA.CVLCPT_CLSF_ID = this.CVLCPT_DATA.CVLCPT_CLSF_ID3;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>