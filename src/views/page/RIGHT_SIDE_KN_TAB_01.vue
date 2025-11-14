<template>
  <div>
    <!-- search -->
    <div class="spacing-wrap sp-4 py-4 px-5">
      <v-autocomplete
          class="pl-form type-middle flex-grow-0"
          placeholder="지식분류 검색"
          :items="SCRIPT_CLSF_LIST"
          v-model="SCRIPT_SELECTED_KMS_CLSF_ID"
          v-on:change="getScriptConsList()"
          clearable
          item-text="FULL_PATH"
          item-value="KMS_CLSF_ID"
          no-data-text="결과 없음"
          style="flex-basis: 190px;"
      />
      <v-text-field
          class="pl-form is-search type-middle "
          placeholder="매크로 검색"
          v-model="SCRIPT_KEY_WORD"
          clearable
          @keydown.enter="getScriptConsList(false)"
      >
        <template v-slot:append>
          <v-btn
              @click="getScriptConsList(false)"
              class="pl-btn has-icon-only">
            <span class="pl-icon20 in-search"></span>
          </v-btn>
        </template>
      </v-text-field>
      <div class="ml-2">
        <div class="d-flex">
          <div class="pl-selection-row ml-auto">
            <v-btn-toggle v-model="SCRIPT_TYPE_MODEL" class="pl-btn-group" mandatory>
              <compo-tooltip-btn
                  v-for="(item, idx) in SCRIPT_TYPE_RADIO_ITEMS"
                  :key="idx"
                  :TitleProp="item.text"
                  ClassProp="pl-btn"
                  :IconProp="`pl-icon20 ${item.icon}`"
                  TooltipPositionProp="bottom"
                  @btnClick="() => fnClickScriptSearchCheckbox(item.value)"
              ></compo-tooltip-btn>
            </v-btn-toggle>
          </div>
          <compo-tooltip-btn
              TitleProp="등록"
              ClassProp="pl-tooltip-btn ml-2"
              IconProp="pl-icon20 circle-plus"
              TooltipPositionProp="bottom"
              @btnClick="regScriptDetail()"
          ></compo-tooltip-btn>
        </div>

      </div>
    </div>
    <!-- list -->
    <div
        class="pl-alarm-list-wrap type-script"
        style="height: calc(100vh - 261px);"
    >
      <div
          v-for="(item,index) in SCRIPT_CONTS_LIST"
          :key="index"
          class="pl-alarm-list"
          :class="item.COMM_YN == 'N' ? 'private' : 'public'"
          @click="selectScriptDetail(index)"
      >
        <div class="col-12 pa-0">
          <div class="d-flex">
            <span class="pl-alarm-list-title" v-text=" item.KMS_CONTS_NM "></span>
            <v-tooltip v-if="item.SHORTCUT_NM != null && item.SHORTCUT_NM != ''" content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" class="pl-boxkey ml-auto " style="height: 100%">{{
                    item.SHORTCUT_NM
                  }}</span>
              </template>
              <span>새로붙이기 : ALT + {{ item.SHORTCUT_NM }}<br>이어붙이기 : ALT + SHIFT + {{ item.SHORTCUT_NM }}</span>
            </v-tooltip>

          </div>
          <div v-html="fnNewLineToBr(item.KMS_CONTS_CN)"
               :class="`col-10 pa-0 mt-1 script_detail_line ${item.selected ? 'selected' : ''}`"></div>
          <div v-if="item.selected" class="pl-btn-wrap justify-end is-mt-m">
            <compo-tooltip-btn
                TitleProp="새로붙이기"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 new-paste"
                TooltipPositionProp="bottom"
                @btnClick="fnChatMessagePaste('NEW', item.KMS_CONTS_CN)"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
                TitleProp="이어붙이기"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 continue-paste"
                TooltipPositionProp="bottom"
                @btnClick="fnChatMessagePaste('CONTINUE', item.KMS_CONTS_CN)"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
                TitleProp="수정"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 edit"
                TooltipPositionProp="bottom"
                @btnClick="modifyScriptDetail(item)"
            ></compo-tooltip-btn>

          </div>
        </div>
      </div>
      <!-- 더보기 -->
      <div class="d-flex justify-center is-mt-m pb-3">
        <v-btn class="pl-btn is-round is-sub px-4"
               v-if="pagination.showMoreBtn"
               @click="getScriptConsList(true)">더보기</v-btn>
      </div>
      <!-- no data -->
      <div v-if="SCRIPT_CONTS_LIST.length === 0" class="pl-list-nodata">
        <span>등록된 데이터가 없습니다.</span>
      </div>
    </div>
    <!-- dialog: 상담 매크로 관리 -->
    <v-dialog
        v-model="dialogRegScript"
        content-class="dialog-draggable is-scroll"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="상담 매크로 관리"
          @hide="mixin_hideDialog('RegScript')"
          @submit="submitDialog('RegScript')"
      >
        <template slot="body">
          <v-form ref="scriptFormInfo">
            <div class="pl-form-inline-wrap vertical label-100">
              <div class="pl-form-inline">
                <span class="pl-label">
                  구분
                  <!-- <v-icon class="pl-icon20 required"></v-icon> -->
                </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form type-middle flex-grow-0"
                      :items="[{text:'개인', value: 'N'}, {text:'공통', value: 'Y'}]"
                      v-model="SCRIPT_PRIVATE_INFO.COMM_YN"
                      :disabled="true"
                      label="label"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  지식분류
                </span>
                <div class="pl-desc">
                  <v-autocomplete
                      v-model="SCRIPT_PRIVATE_INFO.KMS_CLSF_ID"
                      ref="SCRIPT_PRIVATE_INFO.KMS_CLSF_ID"
                      @change="fnGetNewSortOrd"
                      class="pl-form"
                      :items="REG_SCRIPT_CLSF_LIST"
                      item-text="FULL_PATH"
                      item-value="KMS_CLSF_ID"
                      placeholder="지식 분류 선택"
                      clearable
                      no-data-text="결과 없음"
                      :rules="validateRules.KMS_CLSF_ID"
                      :disabled="this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y'"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  제목
                </span>
                <div class="pl-desc">
                  <v-text-field
                      class="pl-form type-middle"
                      value="현장 신청 시 구비서류 안내"
                      v-model="SCRIPT_PRIVATE_INFO.KMS_CONTS_NM"
                      :rules="validateRules.KMS_CONTS_NM"
                      :disabled="SCRIPT_PRIVATE_INFO.COMM_YN == 'Y'"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  내용
                </span>
                <div class="pl-desc">
                  <v-textarea
                      class="pl-form is-noresize"
                      v-model="SCRIPT_PRIVATE_INFO.KMS_CONTS_CN"
                      ref="SCRIPT_PRIVATE_INFO.KMS_CONTS_CN"
                      height="250px"
                      :spellcheck="false"
                      :disabled="!(this.SCRIPT_PRIVATE_INFO.COMM_YN == 'N' || (this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y' && this.SCRIPT_PRIVATE_INFO.RGTR_ID == this.user_id))"
                  />
                </div>
              </div>

              <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s">
                <span class="pl-label">
                  핵심 키워드
                </span>
                <div class="pl-desc">
                  <div class="pl-tags-wrap">
                    <v-chip-group active-class="active-tag" column>
                      <v-chip v-for="(tag, index) in SCRIPT_PRIVATE_KEYWORDS"
                              :key="index"
                              close
                              @click:close="deleteTag(tag, index)">
                        {{ tag }}
                      </v-chip>
                      <template>
                        <!-- 추가 입력 -->
                        <v-text-field
                            v-model="SCRIPT_PRIVATE_TAG_VALUE"
                            @keydown.enter="addTag()"
                            :style="computedTagSize"
                            style="min-width: 120px;"
                            ref="SCRIPT_PRIVATE_TAG_VALUE"
                            placeholder="키워드 입력"
                            class="pl-form type-middle is-tag">
                          <template v-slot:append>
                            <v-btn @click="addTag()" class="pl-btn has-icon-only">
                              <span class="pl-icon20 edit"></span>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </template>
                    </v-chip-group>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  표시 순서
                </span>
                <div class="pl-desc">
                  <v-text-field
                      class="pl-form type-middle flex-grow-0"
                      value="1"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  단축 조합키
                </span>
                <div class="pl-desc">
                  <v-select
                      v-model="SCRIPT_PRIVATE_INFO.SHORTCUT_CD"
                      class="pl-form type-middle flex-grow-0"
                      :items="SHORTCUT_KEY_LIST"
                      @change="fnChangeShortcut"
                      item-text="CD_NM_WITH_USING"
                      item-value="CD_ID"
                      return-object
                      placeholder="선택하세요"
                  ></v-select>
                  <div v-if="SELECTED_SHORTCUT != null" class="col-12 pa-0">
                    <div class="d-flex align-center">
                      <!-- 새로붙이기 : <span class="pl-boxkey ml-1">ALT</span> + <span class="pl-boxkey">{{ SELECTED_SHORTCUT.CD_NM }}</span> -->
                      새로붙이기 : <span class="pl-boxkey ml-1">ALT</span> + <span class="pl-boxkey">1</span>
                    </div>
                    <div class="d-flex align-center is-mt-s">
                      <!-- 이어붙이기 : <span class="pl-boxkey ml-1">ALT</span> + <span class="pl-boxkey" style="width: 50px">SHIFT</span> + <span class="pl-boxkey">{{ SELECTED_SHORTCUT.CD_NM }}</span> -->
                      이어붙이기 : <span class="pl-boxkey ml-1">ALT</span> + <span class="pl-boxkey" style="width: 50px">SHIFT</span>
                      + <span class="pl-boxkey">1</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn
              class="pl-btn is-trans"
              @click="closeRegScriptDialog(false)">닫기
          </v-btn>
          <v-btn class="pl-btn is-icon is-trans"
                 v-if="fnCheckAuth(SCRIPT_PRIVATE_INFO.RGTR_ID) && SCRIPT_PRIVATE_INFO.KMS_CONTS_ID != undefined && SCRIPT_PRIVATE_INFO.KMS_CONTS_ID != '' && SCRIPT_PRIVATE_INFO.COMM_YN == 'N'"
                 @click="deleteScriptReq()"
          >
            <v-icon class="pl-icon20 trash"></v-icon>
            삭제
          </v-btn>
          <v-btn
              class="pl-btn"
              @click="saveScriptValid"
          >저장
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>

</template>

<script>
import {values} from 'lodash';

export default {
  name: 'RIGHT_SIDE_KN_TAB_01', //상담 매크로
  components: {},
  props: {
    RefreshProp: {
      type: Boolean
    }
  },
  data() {
    return {

      SCRIPT_TYPE_RADIO_ITEMS: [
        {
          icon: 'pl-icon20 sort-all', text: "전체", value: 'ALL', evt: () => {
            this.fnClickScriptSearchCheckbox()
          }
        },
        {
          icon: 'pl-icon20 sort-one', text: "개인", value: 'N', evt: () => {
            this.fnClickScriptSearchCheckbox()
          }
        },
        {
          icon: 'pl-icon20 sort-public', text: "공통", value: 'Y', evt: () => {
            this.fnClickScriptSearchCheckbox()
          }
        },
      ],
      SCRIPT_TYPE_MODEL: 0,
      SCRIPT_COMM_YN: 'ALL',

      // dialog: 등록
      dialogRegScript: false,
      SCRIPT_PRIVATE_KEYWORDS: [],
      SCRIPT_PRIVATE_TAG_VALUE: '',
      SCRIPT_SELECTED_KMS_CLSF_ID: '',

      // list
      SCRIPT_CONTS_LIST: [],

      //스크립트 등록
      SCRIPT_PRIVATE_INFO: {
        KMS_CONTS_ID: '',
        KMS_CLSF_ID: '',
        KMS_CONTS_NM: '',
        KMS_CONTS_CN: '',
        SORT_ORD: '',
        KMS_KEYWD_NMS: [],
        SHORTCUT_CD: ''
      },

      validateRules: {
        KMS_CONTS_ID: [v => !!v || '지식분류는 필수 항목 입니다.'],
        KMS_CONTS_NM: [v => !!v || '스크립트 명은 필수 항목 입니다.'],
        SORT_ORD: [v => !!v || '표시 순서는 필수 항목 입니다.'],
      },

      //단축키 키 목록(콤보박스)
      SHORTCUT_KEY_LIST: [],
      //스크립트 상세 - 선택된 단축키
      SELECTED_SHORTCUT: {},
      selected_script_item: '',

      modelMacro: '개인',

      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      SCRIPT_CLSF_LIST: [],
      SCRIPT_KEY_WORD: '',
      REG_SCRIPT_CLSF_LIST: [],

    }
  },
  created() {
    this.getScriptClsfList();
    this.getScriptConsList();

    // this.getBadgeCount();
  },
  mounted() {
  },
  methods: {
    fnClickScriptSearchCheckbox(val) {
      this.SCRIPT_COMM_YN = val
      this.getScriptConsList(false)
    },
    // 지식정보 카운트 조회
    async getBadgeCount() {
      let sUrl = '/api/km/right/rightContsBadgeConut';

      let postParam = {};
      let headParam = {
        head: {}
      };
      let response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        if (response.DATA) {
          let oData = response.DATA[0];
          this.BADGE.NEW_CNT = oData.NEW_CNT;
          this.BADGE.MY_CNT = oData.MY_CNT;
        }
      }
    },
    //스크립트 등록 - 지식분류 선택 시 새 표시 순서 값 조회.
    async fnGetNewSortOrd() {
      const sUrl = '/api/km/conts/selectNewSortOrd'
      const headParam = {head: {}}
      const postParam = {
        COMM_YN: 'N',
        KMS_CLSF_ID: this.SCRIPT_PRIVATE_INFO.KMS_CLSF_ID
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
        this.SCRIPT_PRIVATE_INFO.SORT_ORD = resData.DATA[0].SORT_ORD
      }
    },
    // 지식분류 조회
    async getScriptClsfList() {
      let sUrl = '/api/km/clsf/clsfTreeList';
      this.SCRIPT_CLSF_LIST = []
      this.REG_SCRIPT_CLSF_LIST = []

      // Yabong TODO :  관리자 여부 확인 요망  -- 변경시 BE Query 도 변경 할 것
      let postParam = {
        USE_YN: "Y",
        ADM_YN: "N",
      };

      let headParam = {
        head: {}
      };
      let response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        if (response.DATA) {
          const clsfList = response.DATA
          clsfList.map((item) => {
            if (item.RIGHT_SCRIPT_CNT !== "0") {
              this.SCRIPT_CLSF_LIST.push(item)
            }
          })

          clsfList.filter(obj =>Number(obj.CUSTCO_ID) == this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID || Number(obj.CUSTCO_ID) == -1).map((item) => {
            if (item.CHILD_CNT === "0") {
              this.REG_SCRIPT_CLSF_LIST.push(item)
            }
          })
        }
      }
    },

    /**
     * 스크립트 콘텐츠 목록 조회
     * @param {string} gubun
     */
    async getScriptConsList(next = false) {
      this.pagination.showMoreBtn = false

      if (next) {
        this.pagination.page += 1;
      } else {
        this.pagination.page = 1;
        this.SCRIPT_CONTS_LIST = [];
      }

      let sUrl = '/api/km/right/rightContsList';
      let postParam = {
        SCRIPT_KMS_CLSF_ID: this.SCRIPT_SELECTED_KMS_CLSF_ID
        , KEY_WORD: this.SCRIPT_KEY_WORD
        , ORDER_BY: this.SCRIPT_ORDER_BY
        , COMM_YN: this.SCRIPT_COMM_YN !== 'ALL' ? this.SCRIPT_COMM_YN : ''
        , SE_CD: 'SCRIPT'
        , SRCH_CENTER_PARTIAL : 'Y'
      };

      let headParam = {
        head: {
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING: "Y",
        }
      };
      let response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        if (response.DATA) {
          let tmpList = response.DATA;
          this.SCRIPT_CONTS_LIST = [...this.SCRIPT_CONTS_LIST, ...tmpList];    // ...append
        }

        if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
          if (response.HEADER.next === true) {
            this.pagination.showMoreBtn = true //버튼 활성화
          } else {
            this.pagination.showMoreBtn = false  //버튼 비활성화
          }
        }
      }
    },

    //스크립트 등록 다이얼로그 닫기.
    closeRegScriptDialog(isRefresh) {
      this.mixin_hideDialog('RegScript')
    },
    async getShortcutKeyList() {
      this.SHORTCUT_KEY_LIST = []
      this.SELECTED_SHORTCUT = {}

      const sUrl = '/api/system/shortcut/selectShortcutKeyList'
      const headParam = {head: {}}
      const postParam = {};

      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
        this.SHORTCUT_KEY_LIST = resData.DATA
        if (this.SCRIPT_PRIVATE_INFO != null && this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != '') {
          for (let i = 0; i < this.SHORTCUT_KEY_LIST.length; i++) {
            if (this.SHORTCUT_KEY_LIST[i].CD_ID == this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD) {
              this.SELECTED_SHORTCUT = this.SHORTCUT_KEY_LIST[i]
              break
            }
          }
        }
      }
    },

    //스크립트 등록
    async regScriptDetail() {
      this.selected_script_item = '';
      this.SCRIPT_PRIVATE_INFO = {COMM_YN: 'N', SHORTCUT_CD: 'NO_USE', SORT_ORD: ''}
      this.SCRIPT_PRIVATE_KEYWORDS = []
      this.SCRIPT_PRIVATE_TAG_VALUE = ''
      this.SELECTED_SHORTCUT = {}
      await this.getShortcutKeyList()
      this.mixin_showDialog('RegScript');
    },
    //스크립트 수정
    async modifyScriptDetail(item) {
      const sUrl = '/api/km/conts/selectContent'
      const headParam = {head: {}}
      const postParam = {
        KMS_CONTS_ID: item.KMS_CONTS_ID,
        KMS_CLSF_ID: item.KMS_CLSF_ID
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
        this.SCRIPT_PRIVATE_INFO = resData.DATA[0]
        this.SCRIPT_PRIVATE_KEYWORDS = []
        this.SCRIPT_PRIVATE_INFO.KMS_KEYWD_NMS = this.SCRIPT_PRIVATE_INFO.KMS_KEYWD_NMS.split(",")
        this.SCRIPT_PRIVATE_INFO.KMS_KEYWD_NMS.forEach((kwyword) => {
          this.SCRIPT_PRIVATE_KEYWORDS.push(kwyword)
        })

        await this.getShortcutKeyList()
      }
      this.mixin_showDialog('RegScript');
    },
    //스크립트 저장 검증
    saveScriptValid() {
      if (this.SCRIPT_PRIVATE_INFO.COMM_YN == 'N' || (this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y' && this.SCRIPT_PRIVATE_INFO.RGTR_ID == this.user_id)) {
        if (!this.$refs.scriptFormInfo.validate()) {
          this.tab = 0;
          return;
        }
        if (this.SCRIPT_PRIVATE_INFO.KMS_CLSF_ID == undefined || this.SCRIPT_PRIVATE_INFO.KMS_CLSF_ID.length == 0) {
          this.showToastCaution({
            msg: '지식 분류를 선택하세요.', callAfter: () => {
              this.setDropDown('SCRIPT_PRIVATE_INFO.KMS_CONTS_ID')
            }
          })
          return;
        }
        if (this.SCRIPT_PRIVATE_INFO.KMS_CONTS_CN == undefined || this.SCRIPT_PRIVATE_INFO.KMS_CONTS_CN.length == 0) {
          this.showToastCaution({
            msg: '스크립트 내용을 입력하세요.', callAfter: () => {
              this.setFocus('SCRIPT_PRIVATE_INFO.KMS_CONTS_CN')
            }
          })
          return;
        }
        if (this.SCRIPT_PRIVATE_KEYWORDS.length == 0) {
          this.tab = 0;
          this.showToastCaution({
            msg: '핵심 키워드는 필수 항목입니다.', callAfter: () => {
              this.setFocus('SCRIPT_PRIVATE_TAG_VALUE')
            }
          })
          return;
        }
      }
      if (this.SELECTED_SHORTCUT.LNK_ID != undefined && this.SELECTED_SHORTCUT.LNK_ID != '' && this.SELECTED_SHORTCUT.LNK_ID != this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID) {
        // this.$nextTick(this.showAlert({alertDialogToggle: true, msg: "스크립트 : '" + this.SELECTED_SHORTCUT.LNK_NM + "'에서 사용중입니다. 변경하시겠습니까?", iconClass: 'is-info', type: 'confirm', callYes: this.saveScript, callNo: this.closeMsg}));
        this.showConfirmInfo({
          msg: "스크립트 : '" + this.SELECTED_SHORTCUT.LNK_NM + "'에서 사용중입니다. 변경하시겠습니까?",
          callYes: this.saveScript,
          callNo: this.closeAlert
        });
      } else {
        this.showConfirmInfo({msg: "저장 하시겠습니까?", callYes: this.saveScript, callNo: this.closeAlert});
      }

    },
    //스크립트 저장
    async saveScript() {
      console.log("this.SCRIPT_PRIVATE_INFO.RGTR_ID == this.userId",  this.SCRIPT_PRIVATE_INFO.RGTR_ID, this.user_id)
      if (this.SCRIPT_PRIVATE_INFO.COMM_YN == 'N' || (this.SCRIPT_PRIVATE_INFO.COMM_YN == 'Y' && this.SCRIPT_PRIVATE_INFO.RGTR_ID == this.user_id)) {
        //개인 스크립트일때만 저장.
        if (!this.$refs.scriptFormInfo.validate()) return;

        const sUrl = '/api/km/conts/mergeContent';
        const headParam = {head: {}};
        const postParam = {
          KMS_CONTS_ID: this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID,
          KMS_CLSF_ID: this.SCRIPT_PRIVATE_INFO.KMS_CLSF_ID,
          KMS_CONTS_NM: this.SCRIPT_PRIVATE_INFO.KMS_CONTS_NM,
          SE_CD: "SCRIPT",
          SORT_ORD: this.SCRIPT_PRIVATE_INFO.SORT_ORD,
          // 우측 지식 정보에서 스크립트 등록 시, 공통_여부 = 'N'(개인 스크립트)
          COMM_YN: 'N',
          //개인 스크립트는 공개 상태로 등록.
          STTS_CD: 'PBIC',
          KMS_CONTS_CN: this.SCRIPT_PRIVATE_INFO.KMS_CONTS_CN,
          LIST: this.getActiveKeywords()
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam);

        if (resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID = resData.DATA[0].KMS_CONTS_ID
          // this.$eventBus.$emit('shortcutReload');
          // this.showAlert(this.MESSAGE.ALERT.SUCCESS)
          // this.closeRegScriptDialog(true);
        }
      }
      //단축키 설정을 했을 시, 단축키 저장 또는 삭제
      if (this.SELECTED_SHORTCUT != null && this.SELECTED_SHORTCUT != undefined && this.SELECTED_SHORTCUT.CD_ID != '') {
        //이 api를 호출하면 alt, alt+shift 두 개가 등록된다. 사용안함일시에는 삭제 처리.
        const sUrl = '/api/km/right/mergeShortcutKmsScript';
        const headParam = {head: {}};
        const postParam = {
          SHORT_TYPE_CD: 'KMS_SCRIPT',
          LNK_ID: this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID,
          KEY_CD: this.SELECTED_SHORTCUT.CD_ID
        }

        let resData = await this.common_postCall(sUrl, postParam, headParam);

        if (resData.HEADER != undefined && !resData.HEADER.ERROR_FLAG) {
          this.showToastSuccess({
            msg: '정상 처리 되었습니다.', callAfter: () => {
              this.$eventBus.$emit('shortcutReload')
              this.closeRegScriptDialog(true)
              this.$emit('refresh')
            }
          })
        }
      } else {
        this.show
        this.showToast(this.MESSAGE.TOAST.SUCCESS)
        this.closeRegScriptDialog(true)
      }
      this.closeAlert()
    },

    getActiveKeywords() {
      let list = [];
      this.SCRIPT_PRIVATE_KEYWORDS.forEach((item) => {
        list.push(item);
      });
      return JSON.stringify(list);
    },


    fnChangeShortcut(item) {
      this.SELECTED_SHORTCUT = item
    },
    addTag() {
      if (this.SCRIPT_PRIVATE_TAG_VALUE.trim() == '') {
        this.SCRIPT_PRIVATE_TAG_VALUE = '';
        this.showAlert(this.MESSAGE.ALERT.EMPTY_SCRIPT_KEYWORD);
        return;
      }
      const addTag = this.SCRIPT_PRIVATE_TAG_VALUE.trim()
      this.SCRIPT_PRIVATE_TAG_VALUE = '';
      this.SCRIPT_PRIVATE_KEYWORDS.push(addTag);
    },
    deleteTag(tag, index) {
      // this.$set(this.KEYWORDS[index],'active',false)
      this.SCRIPT_PRIVATE_KEYWORDS.splice(index, 1)
    },
    // 스크립트
    selectScriptDetail(index) {
      for (let i = 0; i < this.SCRIPT_CONTS_LIST.length; i++) {
        this.$set(this.SCRIPT_CONTS_LIST[i], 'selected', false);
      }
      this.$set(this.SCRIPT_CONTS_LIST[index], 'selected', true);
    },
    //개행 문자 to <br /> 태그 변환
    fnNewLineToBr(str) {
      return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },
    //개인 스크립트 저장, 삭제 버튼 출력 시, 등록자 본인이 맞는지 확인.
    fnCheckAuth(userId) {
      if (userId === this.$store.getters['userStore/GE_USER_ROLE'].userId) {
        return true
      }
      return false
    },
    //스크립트 삭제요청
    deleteScriptReq() {
      // this.showAlert(this.MESSAGE.CONFIRM.DELETE_SCRIPT)
      // this.showConfirmCaution({msg: '선택된 항목을 삭제 하시겠습니까?', callYes: this.deleteScript, callNo: this.closeAlert})
      // this.showConfirmInfo({msg: '선택된 항목을 삭제 하시겠습니까?', callYes: this.deleteScript, callNo: this.closeAlert})
      this.showConfirmCaution({
        msg: "선택된 항목을 삭제 하시겠습니까?",
        callYes: this.deleteScript,
        callNo: this.closeAlert
      });
    },
    async deleteScript() {
      let sUrl = '/api/km/conts/contsProcStts';
      let headParam = {
        head : {}
      }
      let postParam = {
        KMS_CONTS_ID : this.SCRIPT_PRIVATE_INFO.KMS_CONTS_ID,
        STTS_CD : 'DELT',
        SORT_ORD : '999'
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        //단축키 설정을 했을 시, 단축키가 삭제되므로 shortcutReload eventBus 호출.
        if(this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != null && this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != '' && this.SCRIPT_PRIVATE_INFO.SHORTCUT_CD != 'NO_USE') {
          this.$eventBus.$emit('shortcutReload')
        }

        this.showToastSuccess({msg : "정상 처리 되었습니다.", callAfter : ()=>{
            this.closeAlert();
            this.closeRegScriptDialog(true)
            this.getScriptConsList()
          }})
      }
    },
    fnChatMessagePaste(type, message) {
      const activeTab = this.$store.getters["commonStore/GE_COMMON_ACTIVE_TAB"]
      if (activeTab.id === 'CSL_M0100' || activeTab.id === 'CSL_M0200') {
        console.log("message")
        this.$eventBus.$emit('chatMessagePaste', type, message);
      } else {
        this.showToastInfo({msg: 'SNS상담 메뉴에서 사용하실 수 있습니다.'})
      }
    },

  },
  computed: {
    computedTagSize() {
      return `flex: 0 0 ${this.inputTagSize + 12}ch;`;
    },
  },
  watch: {
    RefreshProp() {
      if (!this.mixin_isEmpty(this.RefreshProp)) {
        this.getScriptClsfList();
        this.getScriptConsList();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.script_detail_line {
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  &.selected {
    -webkit-line-clamp: initial;
  }
}
</style>