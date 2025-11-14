<template>
  <div class="flex-grow-1 d-flex flex-column">
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label"> 검색 </span>
          <div class="pl-desc">
            <v-select
                v-model="srchParams.srchTmplSeCd"
                class="pl-form type-middle is-sm"
                :items="TMPL_SE"
                disabled/>
            <v-select
                v-model="srchParams.srchMsgType"
                class="pl-form type-middle"
                :items="mixin_common_code_get(common_code, 'T113', '전체')"
                @change="getSmsTmplList"
                placeholder="선택하세요"
            ></v-select>
            <v-text-field
                class="pl-form type-middle is-lg"
                value=""
                v-model="srchParams.srchTtl"
                placeholder="상용구 제목"
                @keyup.enter="getSmsTmplList"
            />
            <v-btn class="pl-btn is-icon flex-grow-0"
                   @click="getSmsTmplList"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </div>
      </div>

    </div>
    <!-- grid -->
    <v-data-table
        class="pl-grid is-mt-m"
        :headers="headers"
        :items="tmplList"
        fixed-header
        item-key="index"
        height="180px"
        @click:row="selectRow"
        :item-class="isActiveRow"
        :items-per-page="tmplList.length"
        hide-default-footer
	no-data-text="등록된 데이터가 없습니다."
        :page.sync="page"
        @page-count="pageCount = $event">s
      <template v-slot:item.FAV_YN="{ item }">
          <v-icon
              class="pl-icon20"
              :class="item.FAV_YN ? 'favorite-on' : 'favorite'">
          </v-icon>
      </template>
    </v-data-table>
    <!-- 문자 내용 -->
    <div class="is-mt-l flex-grow-1 d-flex flex-column">
      <h3 class="pl-subtit is-h3">문자 내용</h3>
      <div class="d-flex is-mt-m flex-grow-1" style="gap: 24px">
        <div class="pl-rounded-box " style="flex: 1 1 55%">
          <div class="pl-form-inline-wrap px-5 pt-4">
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-icon class="pl-icon20 cs-black"></v-icon>
                <span class="ml-1">수신자</span>
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle"
                    v-model="sendParams.targetNum"
                    maxlength="13"
                    @input="setPhnNum"
                    oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                />
<!--                <v-select-->
<!--                    v-if="targetNumList.length > 1"-->
<!--                    v-model="sendParams.targetNum"-->
<!--                    class="pl-form type-middle"-->
<!--                    :items="targetNumList"-->
<!--                    placeholder="선택하세요"-->
<!--                ></v-select>-->
              </div>
              <span class="pl-label ml-2"> 발신자 </span>
              <div class="pl-desc">
                <v-select
                    v-model="sendParams.outgoingNum"
                    class="pl-form type-middle"
                    :items="outGoingNumList"
                    item-text="SMS_SENDER_NO"
                    item-value="SMS_SENDER_NO"
                    placeholder="선택하세요"
                ></v-select>
              </div>
            </div>
            <!-- 툴팁 버튼 -->
            <compo-tooltip-btn
                TitleProp="초기화"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="initSendParam"
            ></compo-tooltip-btn>
          </div>
          <div class="pa-3">
            <v-textarea
                class="pl-form is-noresize"
                ref="CNTNT"
                height="260"
                @mousedown="setCursorPosition"
                @keydown="setCursorPosition"
                v-byte-counter="4000"
                :spellcheck="false"
                :rules="validateRules.CNTNT"
                v-model="sendParams.cntnt"
            />
<!--                @input="setCursorPosition"-->
          </div>
        </div>
        <div class="pl-rounded-box px-5 py-4" style="flex: 1 1 45%">
          <div class="">
            <v-tabs
                v-model="tabs2"
                hide-slider
                class="pl-tabs type-fill tab-grow">
              <v-tab>특수문자1</v-tab>
              <v-tab>특수문자2</v-tab>
              <v-tab>특수문자3</v-tab>
            </v-tabs>
          </div>
          <v-tabs-items v-model="tabs2">
            <!-- 특수문자1 -->
            <v-tab-item>
              <ul
                  class="is-mt-m"
                  style="display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, 40px); grid-auto-rows: 40px">
                <li
                    class="d-flex align-center justify-center hover-light-bg"
                    v-for="(char, index) in basicSymbols"
                    @click="addValue(char)"
                    :key="`basic-${index}`">{{ char }}
                </li>
              </ul>
            </v-tab-item>
            <!-- 특수문자2 -->
            <v-tab-item>
              <ul
                  class="is-mt-m"
                  style="display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, 40px); grid-auto-rows: 40px">
                <li
                    class="d-flex align-center justify-center hover-light-bg"
                    v-for="(char, index) in linesAndBrackets"
                    @click="addValue(char)"
                    :key="`line-${index}`">{{ char }}
                </li>
              </ul>
            </v-tab-item>
            <!-- 특수문자3 -->
            <v-tab-item>
              <ul
                  class="is-mt-m"
                  style="display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, 40px); grid-auto-rows: 40px">
                <li
                    class="d-flex align-center justify-center hover-light-bg"
                    v-for="(char, index) in enclosedChars"
                    @click="addValue(char)"
                    :key="`enclosed-${index}`">{{ char }}
                </li>
              </ul>
            </v-tab-item>

          </v-tabs-items>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import compoExcelUpload from "@/components/CompoExcelUpload.vue";

export default {
  name: "CompoSendSms", //name은 'MENU_' + 파일명 조합
  components: {compoExcelUpload},
  props :{
    DataProp :{
      type : Object,
      default : ()=>{
        return {}
      }
    },
    InitProp :{
      type : Boolean,
      default : false
    },
    SendProp :{
      type : Boolean,
      default : false
    }
  },
  data() {
    return {
      CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,
      common_code: [],
      TMPL_SE: [
        {text : '문자', value : 'S'},
        {text : '이메일', value : 'E'}
      ],
      //검색파라미터
      srchParams: {
        srchTmplSeCd: 'S'
        , srchMsgType: ''
        , srchTrgtType: ''
        , srchTrgtUser: ''
        , srchTrgtDept: ''
        , srchTtl: ''
        , srchFavYn : ''
      },
      tmplList :[],
      targetNumList : [],
      outGoingNumList : [],

      selectedRow : {},
      sendParams : {
        targetNum : '',
        outgoingNum : '',
        cntnt : '',
        ttl: '',
        msgType: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: '',
      },
      validateRules: {
        CNTNT: [
          v => !!v || '내용은 필수 입력 항목입니다.',
          v => (v && v.length <= 4000) || '',
        ],
      },
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable: false},
        {text: '구분', value: 'TMPL_SE_NM', width: '120px', sortable: false},
        {text: '대상', value: 'TARGET_NM', width: '10%', sortable: false},
        {text: '메시지 유형', value: 'TYPE_CD_NM', width: '10%', sortable: false},
        {text: '상용구 제목', value: 'TTL', sortable: false},
        {text: '등록자', value: 'USER_NM', width: '100px', sortable: false},
        {text: '등록일', value: 'REG_DT', width: '100px', sortable: false},
        {text: '즐겨찾기', value: 'FAV_YN', align: 'center', width: '70px', sortable: false},
      ],
      items: [],
      afterFocus: false,
      afterKeyDown: 0,

      //문자내용
      tabs1: null,
      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep2: '05:50',
      timeAmpm: '오후',
      tabs2: null,

      // 특수문자
      basicSymbols: [
        '●', '○', '■', '□', '◆', '◇', '★', '☆', '▲', '△', '▼', '▽',
        '♠', '♣', '♥', '♪'
      ],
      linesAndBrackets: [
        '─', '━', '│', '┃', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼',
        '【', '】', '「', '」', '『', '』'
      ],
      enclosedChars: [
        '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
        'ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ', 'ⓖ', 'ⓗ', 'ⓘ', 'ⓙ',
        'ⓞ', 'ⓟ', 'ⓠ', 'ⓡ', 'ⓢ', 'ⓣ', 'ⓤ', 'ⓥ', 'ⓦ', 'ⓧ', 'ⓨ', 'ⓩ'
      ],
      keywords: [
        {text : '하자접수번호', value : '#v_flw_acp_sn'},
        {text : '민원인', value : '#cvpr_nm'},
        {text : '연락처', value : '#mbl_no'},
        {text : '단지동주소', value : '#mgof_nm'},
      ],
    }
  },
  async created() {
    let codeList = ["T113"]; // 공통코드 리스트 T113 - 단문메세지유형
    this.common_code = await this.mixin_common_code_get_all(codeList);

    this.getSmsTmplList();
    this.getOutNumFromConf();

    if (!this.mixin_isEmpty(this.DataProp)) {
      this.targetNumList = Object.keys(this.DataProp)
          .filter(key => key.startsWith("CUST_PHN_NO"))  // "CUST_PHN_NO"로 시작하는 키 필터링
          .map(key => this.DataProp[key]);
      if(this.targetNumList.length > 0) { // 수신자 전화번호 세팅
        this.sendParams.targetNum = this.targetNumList[0]
      }
    }
  },
  methods: {
    async getSmsTmplList(){
      this.tmplList = [];
      let sUrl = '/api/biz/common/select/selectSmsTmplList'
      let postParam = {
        SRCH_TMPL_SE_CD : this.srchParams.srchTmplSeCd,
        SRCH_TTL : this.srchParams.srchTtl,
        SRCH_TYPE_CD : this.srchParams.srchMsgType,
        SRCH_DEPT_ID : this.computedUserDetailType === 'MANAGER' ? this.computedUserDeptId : '',
      }
      let headParam = {
        head : {
          ns : 'lhcs.system.sms.dao.SmsTmplMngMapper',
          sn : 'selectSmsTmplList'
        }
      }
      const response = await this.common_postCall(sUrl,postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          this.tmplList.push({
            ROW_NUMBER : item.ROW_NUMBER,
            TMPL_CONTENTS_ID : item.TMPL_CONTENTS_ID,
            DATA_FLAG : item.DATA_FLAG,
            TMPL_SE_NM : item.DATA_FLAG =='S' ? '문자' : '이메일',
            TTL : item.TTL,
            CNTNT : this.mixin_decode(item.CNTNT),
            REG_DT : this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd'),
            USER_ID : item.USER_ID,
            USER_NM : item.USER_NM,
            TARGET : item.TARGET,
            TARGET_TYPE : item.TARGET_TYPE,
            CUSTCO_ID : item.CUSTCO_ID,
            TARGET_NM : item.TARGET_NM,
            TYPE_CD : item.TYPE_CD,
            TYPE_CD_NM : item.TYPE_CD_NM,
            TMPL_CD : item.TMPL_CD,
            FAV_YN : item.FAV_YN == 'N' ? false : true,
          })
        })
      }
    },
    async getOutNumFromConf(){
      let postParam = {
        IS_UNIQUE : 'N',
        KEY : 'SMS_SENDER_NO'
      }
      let headParam = {
        head : {
          ns: 'lhcs.system.conf.dao.confMngMapper',
          sn: 'selectConf'
        }
      }
      const response = await this.common_postCall('/api/biz/common/select/selectConf', postParam, headParam)
      if( !response.HEADER.ERROR_FLAG){
        response.DATA.map(item=>{
          this.outGoingNumList.push({
            SMS_SENDER_NO : String(item.VAL).slice(0, 4) + '-' + String(item.VAL).slice(4)
          })
        })
        this.sendParams.outgoingNum = this.outGoingNumList[0]["SMS_SENDER_NO"]
      }
    },
    initSendParam() {
      this.sendParams = {
        targetNum : this.targetNumList[0],
        outgoingNum : this.outGoingNumList[0]["SMS_SENDER_NO"],
        cntnt : '',
        ttl: '',
        msgType: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: '',
      };
      this.$refs.CNTNT.reset();

    },
    selectRow(item) {
      let targetNum = this.sendParams.targetNum;
      let outgoingNum = this.sendParams.outgoingNum;
      this.afterFocus = false;
      this.afterKeyDown = false;
      // this.$refs.CNTNT.focus();
      this.selectedRow = item;
      this.sendParams = {
        targetNum : targetNum,
        outgoingNum : outgoingNum,
        ttl: item.TTL,
        msgType: item.TYPE_CD,
        cntnt: this.replaceCntnt(item.CNTNT),
        tmplContentsId: item.TMPL_CONTENTS_ID,
        trgtType: item.TARGET_TYPE,
        trgtDept: item.TARGET_TYPE === 'D' ? item.TARGET : '',
        tmplCd: item.TMPL_CD
      }
    },

    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    //문자 내용 치환변수 치환 처리(바로처리 스케줄러 상세에서 호출 시.)
    replaceCntnt(itemCntnt) {
      console.log("replaceCntnt", itemCntnt)
      let cntnt = itemCntnt
      //바로처리 스케줄러 상세에서 호출 시시
      if(this.DataProp.SRC && this.DataProp.SRC == "FLAW_DETAIL") {
        if(this.DataProp.V_FLW_ACP_SN && this.DataProp.V_FLW_ACP_SN != '') {
          cntnt = cntnt.replace(/#v_flw_acp_sn/gi, this.DataProp.V_FLW_ACP_SN)
        }
        if(this.DataProp.CVPR_NM && this.DataProp.CVPR_NM != '') {
          cntnt = cntnt.replace(/#cvpr_nm/gi, this.DataProp.CVPR_NM)
        }
        if(this.DataProp.MBL_NO && this.DataProp.MBL_NO != '') {
          cntnt = cntnt.replace(/#mbl_no/gi, this.DataProp.MBL_NO)
        }
        if(this.DataProp.MGOF_NM && this.DataProp.MGOF_NM != '') {
          cntnt = cntnt.replace(/#mgof_nm/gi, this.DataProp.MGOF_NM)
        }
        if(this.DataProp.BLDG_NO && this.DataProp.BLDG_NO != '') {
          cntnt = cntnt.replace(/#bldg_no/gi, this.DataProp.BLDG_NO)
        }
        if(this.DataProp.HS_NO && this.DataProp.HS_NO != '') {
          cntnt = cntnt.replace(/#hs_no/gi, this.DataProp.HS_NO)
        }
        if(this.DataProp.FLW_CTS && this.DataProp.FLW_CTS.trim() != "") {
          cntnt = cntnt.replace(/#flw_cts/gi, this.DataProp.FLW_CTS)
        }
        if(this.DataProp.JOB_FRM_NM && this.DataProp.JOB_FRM_NM != "") {
          cntnt = cntnt.replace(/#job_frm_nm/gi, this.DataProp.JOB_FRM_NM)
        }
        if(this.DataProp.DIST_EMP_NM && this.DataProp.DIST_EMP_NM != "") {
          cntnt = cntnt.replace(/#dist_emp_nm/gi, this.DataProp.DIST_EMP_NM)
        }
      }
      return cntnt;
    },

    setPhnNum(text){
      this.sendParams.targetNum = this.mixin_setPhoneNo(text)
    },
    setCursorPosition(event){
      this.afterFocus = true;
      if(event.type === 'keydown') this.afterKeyDown = true;
    },
    addValue(textToInsert) { // 키보드 미입력 - 문자 최초 삽입 시 개행 개수만큼 length를 인식 못함
      const textarea = this.$refs.CNTNT.$refs.input;  // textarea의 실제 DOM 요소 참조
      const orgString = this.sendParams.cntnt;
      let start = this.afterFocus ? textarea.selectionStart : 0
      let end = this.afterFocus ? textarea.selectionEnd : 0
      let nextLineCnt = (orgString.substring(0, start).match(/\n/g) || []).length
      // 현재 텍스트에서 커서 위치에 새 텍스트를 삽입
      this.sendParams.cntnt = orgString.substring(0, this.afterKeyDown ? start : start+nextLineCnt ) + textToInsert + orgString.slice(this.afterKeyDown ? end : end+nextLineCnt );
      //
      // 삽입 후 커서 위치 업데이트
      this.$nextTick(() => {
        this.$refs.CNTNT.$refs.input.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        this.$refs.CNTNT.$refs.input.focus();
      });
    },
    beforeSend(){
      if(this.validate()){
        this.showConfirmInfo({msg: 'SMS를 발송하시겠습니까?'
          , callYes : ()=>{  this.send()  }
          , callNo : this.closeAlert
        })
      }else{
        this.showToastCaution({msg : 'SMS 내용을 입력해주세요'})
      }
    },
    validate() {
      return this.$refs.CNTNT.validate();
    },
    async send(){

      let sUrl = '/api/common/sendSms';
      let postParam = {
        // CMD : 'sendSmsIntereatArea'
        CMD : this.computedUserCenter == '4' ? 'sendAsSms' : 'sendCmmSms'
        , SMS_CNTNT_TXT : this.sendParams.cntnt
        , MOBILE : this.sendParams.targetNum
        , DSPTCH_NO : this.sendParams.outgoingNum.replaceAll('-','') //발신번호
        // , DSPTCH_NO : this.$store.getters["userStore/GE_USER_COMPANY"].DSPTCH_NO //발신번호
        , ACCOUNT_ID : this.$store.getters['userStore/GE_USER_ROLE'].userId //발신자ID
        , ACCOUNT_NAME : this.$store.getters['userStore/GE_USER_ROLE'].userName //발신자명
        , CUST_ID : this.DataProp.CUST_ID
        // , SMS_TYPE : this.getBytes > 80 ? '10' : '00', // 10 - lms , 00 - sms
        // , TODAY_CUST_FAVOR_LIST : JSON.stringify(arrTodayFavorZone) //오늘 등록된 관심지역 전체
        // , SIDO_ID : SIDO_ID
        // , SIGUNGU_ID : SIGUNGU_ID
        // , JIGU_ID : JIGU_ID
        // , INTEREST_DIV_CD : INTEREST_DIV_CD
      }
      if(this.computedUserCenter == '4') {
        postParam.CUSTOMERID = this.DataProp.CUST_IDNTF_NO ? this.DataProp.CUST_IDNTF_NO : ''
      }

      let headParam = {
        head : {
        }
      }
      console.log("postParam 😊 >> ", postParam, this.getBytes)
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.showToastSuccess({msg : '정상 처리되었습니다.', callAfter : ()=>{
            this.initSendParam();
            this.closeAlert();
          }})
      }else{
        this.showToastCaution({msg : 'SMS 발송 중 오류가 발생했습니다.', callAfter : this.closeAlert})
      }
    },
  },
  mounted() {

  },
  computed: {
    getBytes(){
      return new TextEncoder().encode(this.sendParams.cntnt).length
    },
  },
  watch: {
    InitProp(){
      if(this.InitProp){
        this.getSmsTmplList();
        this.getOutNumFromConf();

        if (!this.mixin_isEmpty(this.DataProp)) {
          this.targetNumList = Object.keys(this.DataProp)
              .filter(key => key.startsWith("CUST_PHN_NO"))  // "CUST_PHN_NO"로 시작하는 키 필터링
              .map(key => this.DataProp[key]);
          if(this.targetNumList.length > 0) { // 수신자 전화번호 세팅
            this.sendParams.targetNum = this.targetNumList[0]
          }
        }
      }else{
        this.initSendParam();
      }
    },
    SendProp(){
      this.beforeSend();
    }
  },
};
</script>

<style lang="scss" scoped>

</style>