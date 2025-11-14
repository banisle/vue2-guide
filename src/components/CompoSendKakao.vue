<template>
  <div class="flex-grow-1 d-flex flex-column">
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label"> 검색 </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle is-sm"
                value="문자"
                disabled/>
            <v-select
                v-model="selectModel01"
                class="pl-form type-middle"
                :items="['카카오 알림톡']"
                disabled
                placeholder="선택하세요"
            ></v-select>
            <v-text-field
                class="pl-form type-middle is-lg"
                v-model="srchTtl"
                placeholder="상용구 제목"
                @keyup.enter="getArlmTmplList"
            />
            <v-btn class="pl-btn is-icon flex-grow-0"
                   @click="getArlmTmplList"
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
        :items-per-page="tmplList.length"
        @click:row="selectRow"
        hide-default-footer
	no-data-text="등록된 데이터가 없습니다."
        :page.sync="page"
        @page-count="pageCount = $event">
      <template v-slot:item.type07="{ item }">
        <v-icon
            class="pl-icon20"
            :class="item.type07 ? 'favorite-on' : 'favorite'">
        </v-icon>
      </template>
    </v-data-table>
    <!-- 알림톡 전송 -->
    <div class="is-mt-l flex-grow-1 d-flex flex-column">
      <h3 class="pl-subtit is-h3">알림톡 전송</h3>
      <div class="d-flex is-mt-m flex-grow-1" style="gap: 24px">
        <div class="pl-rounded-box " style="flex: 1 1 60%">
          <v-form ref="form">
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
                      :rules="validateRules.TARGET_NUM"
                      oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                  />
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
              <div class="pl-selection-row">
                <v-checkbox
                    class="pl-check type-small is-xs"
                    label="엑셀파일등록"
                    v-model="excelChecked"

                >
                </v-checkbox>
              </div>
              <!-- 툴팁 버튼 -->
              <compo-tooltip-btn
                  TitleProp="초기화"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
              ></compo-tooltip-btn>
            </div>
            <div class="pl-form-inline-wrap px-5">
              <div class="pl-form-inline" v-if="excelChecked">
                <span class="pl-label">
                  <span class="ml-1 is-xs">엑셀파일등록</span>
                </span>
                <div class="pl-desc">
                  <!-- 파일 목록 -->
                  <div class="file-tag-wrap">
                  <span class="file-tag">
                    {{ uploadFileName ? uploadFileName : '' }}
                  </span>
                  </div>
                  <!-- 버튼 형식 -->
                  <v-btn class="pl-btn is-xs is-sub" @click="clickAddFiles">엑셀파일 업로드</v-btn>
                  <v-file-input
                      v-show="false"
                      ref="excelRef"
                      @change="[uploadExcel($event, excelHeader), setFileName($event)]"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      counter
                      label="엑셀파일을 선택하세요"
                      :show-size="1000"
                  />
                  <v-btn class="pl-btn is-sub is-xs flex-grow-0" @click="">양식파일 다운로드</v-btn>
                </div>
              </div>
            </div>
            <div class="px-3">
              <div class="pl-form-inline-wrap mt-3 pt-3 is-border-sub-top">
                <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  <span class="ml-1">상용구 제목</span>
                </span>
                  <div class="pl-desc">
                    <v-text-field
                        v-model="sendParams.ttl"
                        class="pl-form type-middle flex-grow-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="pa-3">
              <v-textarea
                  class="pl-form is-noresize"
                  ref="CNTNT"
                  height="200"
                  @mousedown="setCursorPosition"
                  v-byte-counter="2000"
                  :spellcheck="false"
                  :rules="validateRules.CNTNT"
                  v-model="sendParams.cntnt"
              />
            </div>
          </v-form>
        </div>
        <div class="pl-rounded-box px-5 py-4" style="flex: 1 1 40%">
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
                    :key="`basic-${index}`"
                    @click="addValue(char)"
                >{{ char }}
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
                    :key="`line-${index}`"
                    @click="addValue(char)"
                >{{ char }}
                </li>
              </ul>
            </v-tab-item>
            <!-- 특수문자3 -->
            <v-tab-item>
              <ul
                  class="is-mt-m"
                  style="display: grid; gap: 15px; grid-template-columns: repeat(auto-fill, 40px); grid-auto-rows: 40px">
                <li
                    class="d-flex align-center justify-center hover-light-bg"
                    v-for="(char, index) in enclosedChars"
                    :key="`enclosed-${index}`"
                    @click="addValue(char)"
                >{{ char }}
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
export default {
  name: "CompoSendKakao", //알림톡 발송
  components: {},
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    InitProp: {
      type: Boolean,
      default: false
    },
    SendProp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

      selectModel01: '카카오 알림톡',

      srchTtl: '',
      sendParams: {
        targetNum: '',
        outgoingNum: '',
        cntnt: '',
        ttl: '',
        msgType: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: '',
      },

      targetNumList: [],
      outGoingNumList: [],
      tmplList: [],
      selectedRow: {},

      afterFocus: false,
      excelChecked: false,

      uploadFileName: '',
      uploadedFiles : [],
      // grid
      validateRules: {
        CNTNT: [
          v => !!v || '내용은 필수 입력 항목입니다.',
          v => (v && v.length <= 2000) || '',
        ],
        TTL: [
          v => !!v || '내용은 필수 입력 항목입니다.',
        ],
        TARGET_NUM: [
          v => !!v || '수신자 전화번호는 필수 입력 항목입니다.',
        ],
      },
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '60px', sortable: false},
        {text: '구분', value: 'TMPL_SE_NM', width: '120px', sortable: false},
        {text: '메시지 유형', value: 'TYPE_CD_NM', width: '10%', sortable: false},
        {text: '상용구 제목', value: 'TTL', sortable: false},
        {text: '템플릿코드', value: 'TMPL_CD', width: '100px', sortable: false},
        {text: '등록자', value: 'USER_NM', width: '100px', sortable: false},
        {text: '등록일', value: 'REG_DT', width: '100px', sortable: false},
      ],
      items: [
        {index: 15, type01: '문자', type03: '카카오알림', type04: 'AS 진행정보 조회_v2', type05: '우성아', type06: '2024-06-10',},
        {index: 14, type01: '문자', type03: '카카오알림', type04: 'AS 진행정보 조회_v2', type05: '우성아', type06: '2024-06-10',},
        {index: 13, type01: '문자', type03: '카카오알림', type04: 'AS 진행정보 조회_v2', type05: '우성아', type06: '2024-06-10',},
        {index: 12, type01: '문자', type03: '카카오알림', type04: 'AS 진행정보 조회_v2', type05: '우성아', type06: '2024-06-10',},
        {index: 11, type01: '문자', type03: '카카오알림', type04: 'AS 진행정보 조회_v2', type05: '우성아', type06: '2024-06-10',},
        {index: 10, type01: '문자', type03: '카카오알림', type04: 'AS 진행정보 조회_v2', type05: '우성아', type06: '2024-06-10',},
      ],
      selectModel02: '1600-1004',
      //문자내용
      tabs1: null,
      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep2: '05:50',
      timeAmpm: '오후',
      tabs2: null,

      // 특수문자
      basicSymbols: [
        '●', '○', '■', '□', '◆', '◇', '★', '☆', '▲', '△', '▼', '▽',
        '♠', '♣', '♥', '♦', '♪', '♫', '☀', '☁', '☂', '☃', '☯', '☮'
      ],
      linesAndBrackets: [
        '─', '━', '│', '┃', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼',
        '╭', '╮', '╯', '╰', '╱', '╲', '╳', '【', '】', '「', '」', '『', '』'
      ],
      enclosedChars: [
        '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
        'ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ', 'ⓖ', 'ⓗ', 'ⓘ', 'ⓙ',
        'ⓞ', 'ⓟ', 'ⓠ', 'ⓡ', 'ⓢ', 'ⓣ', 'ⓤ', 'ⓥ', 'ⓦ', 'ⓧ', 'ⓨ', 'ⓩ'
      ],
      keywords: [
        {text: '하자접수번호', value: '#v_flw_acp_sn'},
        {text: '민원인', value: '#cvpr_nm'},
        {text: '연락처', value: '#mbl_no'},
        {text: '단지동주소', value: '#mgof_nm'},
      ],


    }
  },
  created() {
    this.getOutNumFromConf();
    this.getArlmTmplList();
    if (!this.mixin_isEmpty(this.DataProp)) {
      this.targetNumList = Object.keys(this.DataProp)
          .filter(key => key.startsWith("CUST_PHN_NO"))  // "CUST_PHN_NO"로 시작하는 키 필터링
          .map(key => this.DataProp[key]);
      if (this.targetNumList.length > 0) { // 수신자 전화번호 세팅
        this.sendParams.targetNum = this.targetNumList[0]
      }
    }

  },
  methods: {
    async getOutNumFromConf() {
      let postParam = {
        IS_UNIQUE: 'N',
        KEY: 'SMS_SENDER_NO'
      }
      let headParam = {
        head: {
          ns: 'lhcs.system.conf.dao.confMngMapper',
          sn: 'selectConf'
        }
      }
      const response = await this.common_postCall('/api/biz/common/select/selectConf', postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          this.outGoingNumList.push({
            SMS_SENDER_NO: String(item.VAL).slice(0, 4) + '-' + String(item.VAL).slice(4)
          })
        })
        this.sendParams.outgoingNum = this.outGoingNumList[0]["SMS_SENDER_NO"];
      }
    },
    async getArlmTmplList() {
      this.tmplList = [];
      let sUrl = '/api/biz/common/select/selectSmsTmplList'
      let postParam = {
        SRCH_TMPL_SE_CD: 'S',
        SRCH_TTL: this.srchTtl,
        SRCH_TYPE_CD: 'SM08',
        SRCH_DEPT_ID: this.computedUserDetailType === 'MANAGER' ? this.computedUserDeptId : '',
      }
      let headParam = {
        head: {
          ns: 'lhcs.system.sms.dao.SmsTmplMngMapper',
          sn: 'selectSmsTmplList'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          this.tmplList.push({
            ROW_NUMBER: item.ROW_NUMBER,
            TMPL_CONTENTS_ID: item.TMPL_CONTENTS_ID,
            DATA_FLAG: item.DATA_FLAG,
            TMPL_SE_NM: item.DATA_FLAG == 'S' ? '문자' : '이메일',
            TTL: item.TTL,
            CNTNT: this.mixin_decode(item.CNTNT),
            REG_DT: this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd'),
            USER_ID: item.USER_ID,
            USER_NM: item.USER_NM,
            TARGET: item.TARGET,
            TARGET_TYPE: item.TARGET_TYPE,
            CUSTCO_ID: item.CUSTCO_ID,
            TARGET_NM: item.TARGET_NM,
            TYPE_CD: item.TYPE_CD,
            TYPE_CD_NM: item.TYPE_CD_NM,
            TMPL_CD: item.TMPL_CD,
            FAV_YN: item.FAV_YN == 'N' ? false : true,
          })
        })
      }
    },
    selectRow(item) {
      let targetNum = this.sendParams.targetNum;
      console.log("targetNum", targetNum)
      let outgoingNum = this.sendParams.outgoingNum;
      console.log("outgoingNum", outgoingNum)
      this.selectedRow = item;
      // this.resetValidate();
      this.sendParams = {
        targetNum: targetNum,
        outgoingNum: outgoingNum,
        ttl: this.mixin_decode(item.TTL),
        msgType: item.TYPE_CD,
        cntnt: item.CNTNT,
        tmplContentsId: item.TMPL_CONTENTS_ID,
        trgtType: item.TARGET_TYPE,
        trgtDept: item.TARGET_TYPE === 'D' ? item.TARGET : '',
        tmplCd: item.TMPL_CD
      }
      console.log("outgoingNum", this.sendParams)
    },
    // 전화번호 셋팅
    setPhnNum(text) {
      this.sendParams.targetNum = this.mixin_setPhoneNo(text)
    },
    setCursorPosition(event) {
      this.afterFocus = true;
    },
    addValue(textToInsert) { //
      const textarea = this.$refs.CNTNT.$refs.input;  // textarea의 실제 DOM 요소 참조
      let start = this.afterFocus ? textarea.selectionStart : 0
      let end = this.afterFocus ? textarea.selectionEnd : 0;

      // 현재 텍스트에서 커서 위치에 새 텍스트를 삽입
      this.sendParams.cntnt = this.sendParams.cntnt.slice(0, start) + textToInsert + this.sendParams.cntnt.slice(end);

      // 삽입 후 커서 위치 업데이트
      this.$nextTick(() => {
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        textarea.focus();
      });
    },
    beforeSend() {
      if(!(this.selectedRow && this.selectedRow.TMPL_CD)) {
				this.showAlertInfo({msg: "상용구를 선택해주세요."});
				return false;
			}

      if (this.validate()) {
        this.showConfirmInfo({
          msg: '알림톡을 발송하시겠습니까?'
          , callYes: this.send
          , callNo: this.closeAlert
        })
      } else {
        this.showToastCaution({msg: '필수 입력 항목을 확인해주세요.'})
      }
    },
    // 알림톡 발송
    async send() {
      let postParam = {
        /* 파라미터 정의 */
        PHONE: this.sendParams.targetNum.replaceAll('-', ''),     // 고객 전화번호
        CALLBACK: this.sendParams.outgoingNum.replaceAll('-', ''),    // 발송자 전화번호
        CODE: this.sendParams.tmplCd,                                                  // 템플릿 코드
        SUBJECT: this.sendParams.ttl,                                                     // 제목
        MSG: this.sendParams.cntnt,                                                       // 내용`
      };
      let headParam = {head: {}}
      console.log("postParampostParam", postParam)
      const response = await this.common_postCall("/phone-api/as/common/insertAtalkKaoSend", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({
          msg: '정상 처리되었습니다.', callAfter: () => {
            this.closeAlert()
          }
        })
      } else {
        this.showToastCaution({msg: '알림톡 발송 중 오류가 발생했습니다.', callAfter: this.closeAlert})
      }
    },
    validate() {
      return this.$refs.form.validate();
    },
    resetValidate() {
      this.$refs.form.reset();
    },
    initSendParam() {
      this.sendParams = {
        targetNum: this.targetNumList[0],
        outgoingNum: this.outGoingNumList[0]["SMS_SENDER_NO"],
        cntnt: '',
        ttl: '',
        msgType: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: '',
      };
      this.resetValidate();
    },
    // 파일등록 클릭
    clickAddFiles() {
      this.$refs.excelRef.$refs.input.value = null;
      this.$refs.excelRef.$refs.input.click();
    },
    setFileName(event) {
      console.log(event)
      console.log(event.name)
      this.uploadFileName = event.name;
      this.uploadedFiles.push(event.File);
    },
  },
  mounted() {
  },
  computed: {},
  watch: {
    InitProp() {
      if (this.InitProp) {
        console.log("request")
        console.log("request", this.DataProp)
        this.getOutNumFromConf();
        this.getArlmTmplList();

        if (!this.mixin_isEmpty(this.DataProp)) {
          this.targetNumList = Object.keys(this.DataProp)
              .filter(key => key.startsWith("CUST_PHN_NO"))  // "CUST_PHN_NO"로 시작하는 키 필터링
              .map(key => this.DataProp[key]);
          if (this.targetNumList.length > 0) { // 수신자 전화번호 세팅
            this.sendParams.targetNum = this.targetNumList[0]
          }
        }
      } else {
        console.log("init")
        this.initSendParam();
      }
    },
    SendProp() {
      this.beforeSend();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>