<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height" >
        <!-- 트리 -->
        <div class="is-col-fix is-vrt fill-height" style="width: 30%;">
          <div class="pl-card-body py-3 is-border-bottom">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담유형 구분
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="schCuttTypeSeDropItems"
                    placeholder="선택하세요"
                    v-model="SCH_CUTT_TYPE_SE_CD"
                    :disabled="SCH_CUTT_TYPE_SE_CD ==='ITGRT'?true:false"
                    v-byte-counter=""
                  ></v-select>
                </div>
              </div>
              <v-btn
                class="pl-btn is-icon"
                @click="schGetTreeList"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
          <div class="">
            <div class="pl-search-header pl-card-body py-3">
              <div class="is-left">
                <strong>상담유형</strong>
              </div>
              <div class="is-right spacing-wrap sp-4 align-center">
                <v-btn class="pl-btn is-sub is-sm" @click="expandAll('treeDefault')">전체 펼치기</v-btn>
                <v-btn class="pl-btn is-sub is-sm" @click="collapseAll('treeDefault')">전체 접기</v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="getTreeList">
                </compo-tooltip-btn>
              </div>
            </div>
            <div class="pl-card-body pl-tree-body " style="height: calc(-320px + 100vh) ;">
              <v-treeview
                ref="treeDefault"
                activatable
                return-object
                :items="treeItems"
                :open-all="expanded"
                :open-on-click=false
                @update:active="srch_tree_act"
                color="secondary"
                class="pl-tree-view">
                <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.children.length > 0">
                      {{open ? 'pl-icon20 tree-folder-open' : 'pl-icon20 tree-folder'}}
                  </v-icon>
                  <v-icon v-else>
                      {{ 'pl-icon20 tree-file' }}
                  </v-icon>
                </template>
                <template v-slot:label="{ item}">
                  <span>{{ item.name }}</span>
                </template>
              </v-treeview>

            </div>
          </div>
          <div class="pl-card is-border">
            <div class="pl-btn-wrap">
              <!-- new folder 버튼 -->
              <compo-tooltip-btn
                TitleProp="추가"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 is-new-folder"
                TooltipPositionProp="top"
                @btnClick="cuttTypeRegForm"
              ></compo-tooltip-btn>
              <!-- 삭제 버튼 -->
              <compo-tooltip-btn
                TitleProp="삭제"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 trash"
                TooltipPositionProp="top"
                @btnClick="cuttTypeDelCheck"
              ></compo-tooltip-btn>
              <div class="ml-auto">
                <!-- list up 버튼 -->
                <compo-tooltip-btn
                  TitleProp="순서 위로"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 is-list-up"
                  TooltipPositionProp="top"
                  @btnClick="treeNodeMove('UP')"
                ></compo-tooltip-btn>
                <!-- list down 버튼 -->
                <compo-tooltip-btn
                  TitleProp="순서 아래로"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 is-list-down"
                  TooltipPositionProp="top"
                  @btnClick="treeNodeMove('DOWN')"
                ></compo-tooltip-btn>
              </div>
            </div>
          </div>
        </div>
        <!-- 상세정보 입력 -->
        <div class="is-vrt">
          <div class="pl-card">
            <h2 class="pl-subtit">상담유형 상세 정보</h2>
            <div class="pl-subdesc">
              <p>필수 관리 항목을 입력 하신 후 [저장] 버튼을 클릭하십시오. </p>
              <p>상담유형은 설정에 따라 인바운드, 아웃바운드로 구분되어 관리됩니다. </p>
            </div>
          </div>
          <div class="pl-card pt-0 flex-grow-1 pl-scroll-body" style="height: calc(-320px + 100vh) ;">
            <v-form ref="form">
              <div class="pl-card-form-body">
                <div class="pl-form-inline-wrap vertical label-100">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상담유형 구분
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle"
                        disabled
                        required
                        v-model="CUTT_DAIL_CUTT_TYPE_SE_NM"
                        :rules="validateRules.CUTT_TYPE_SE_NM"
                        v-byte-counter="300"
                      />
                    </div>
                  </div>
                  <!-- 추가 -->
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상담유형 코드
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle flex-grow-1"
                        placeholder="코드를 입력하고 중복체크를 해주세요"
                        v-model="CUTT_DAIL_CUTT_TYPE_ID"
                        :rules="validateRules.CUTT_TYPE_ID"
                      />
                      <v-btn
                        class="pl-btn is-esp flex-grow-0"
                        @click="dpcnCheck()"
                        :disabled="REG_MDFCN == 'MDFCN' || CUTT_DAIL_CUTT_TYPE_ID.length == 0 ? true : false"
                      >중복체크</v-btn>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상위 상담유형 명
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle"
                        disabled
                        required
                        v-model="CUTT_DAIL_UP_CUTT_TYPE_NM"
                        :rules="validateRules.UP_CUTT_TYPE_NM"
                        v-byte-counter="200"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      상담유형 명
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle"
                        required
                        v-model="CUTT_DAIL_CUTT_TYPE_NM"
                        :rules="validateRules.CUTT_TYPE_NM"
                        v-byte-counter="200"
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
                        placeholder="설명 입력"
                        height="80"
                        v-model="CUTT_DAIL_CUTT_TYPE_EXPLN"
                        :spellcheck="false"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      사용 여부
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form type-middle"
                        :items="mixin_common_code_get(common_code, 'USE_WT')"
                        placeholder="선택하세요"
                        v-model="CUTT_DAIL_USE_YN"
                        required
                        :rules="validateRules.USE_YN"
                      ></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="CUTT_DAIL_LVL === '2' && DSPTCH_NO_LIST.length > 2">
                    <span class="pl-label">
                      대표 번호
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form type-middle"
                        v-model="CUSTCO_DSPTCH_NO_ID"
                        :items="DSPTCH_NO_LIST"
                        placeholder="선택하세요"
                        required
                        :rules="validateRules.CUSTCO_DSPTCH_NO_ID"
                      ></v-select>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      정렬 순서
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        class="pl-form type-middle "
                        disabled
                        v-model="CUTT_DAIL_SORT_ORD"
                        :readonly=true
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="CUTT_DAIL_CHILD_YN || Number(CUTT_DAIL_LVL) === 5">
                    <span class="pl-label mt-1">
                      핵심 키워드
                    </span>
                    <div class="pl-desc">
                      <v-chip-group active-class="active-tag" column>
                        <v-chip v-for="(tag, index) in CUTT_DAIL_KEY_WORD"
                                :key="index"
                                close
                                small
                                @click:close="deleteTag(tag, index)">
                          {{ mixin_decode(tag) }}
                        </v-chip>
                        <template>
                          <!-- 추가 입력 -->
                          <v-text-field
                              v-model="TAG_VALUE"
                              @keydown.enter="addTag()"
                              :style="computedTagSize"
                              style="min-width: 120px;"
                              placeholder="키워드 입력"
                              :disabled="mixin_isEmpty(CUTT_DAIL_CUTT_TYPE_ID)"
                              class="pl-form is-tag type-small mt-1">
                            <template v-slot:append>
                              <v-btn @click="addTag()" class="pl-btn has-icon-only">
                                <span class="pl-icon20 edit type-small"></span>
                              </v-btn>
                            </template>
                          </v-text-field>
                        </template>
                      </v-chip-group>
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="CUTT_DAIL_CHILD_YN || Number(CUTT_DAIL_LVL) === 5">
                    <span class="pl-label">
                      기타1
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                          class="pl-form type-middle"
                          placeholder="기타1"
                          v-model="DTL_ETC1"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="CUTT_DAIL_CHILD_YN || Number(CUTT_DAIL_LVL) === 5">
                    <span class="pl-label">
                      기타2
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                          class="pl-form type-middle"
                          placeholder="기타2"
                          v-model="DTL_ETC2"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="CUTT_DAIL_CHILD_YN || Number(CUTT_DAIL_LVL) === 5">
                    <span class="pl-label">
                      기타3
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                          class="pl-form type-middle"
                          placeholder="기타3"
                          v-model="DTL_ETC3"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline" v-if="CUTT_DAIL_CHILD_YN || Number(CUTT_DAIL_LVL) === 5">
                    <span class="pl-label">
                      기타4
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                          class="pl-form type-middle"
                          placeholder="기타4"
                          v-model="DTL_ETC4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-form>
          </div>
          <div class="pl-card is-border text-right">
            <v-btn
              class="pl-btn"
              @click="cuttTypeRegValidate"
              :disabled="REG_MDFCN == 'MDFCN' ? false : DPCN_CHK"
              >저장</v-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
      v-model="dialogCsSetting"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="상담 정보 항목 설정"
        @hide="mixin_hideDialog('CsSetting')"
      >
        <template slot="body">
          <p>상담유형 구분과 관리 레벨을 설정할 수 있습니다.</p>
          <div class="pl-form-inline-wrap vertical mt-2 type-auto">
            <div class="pl-form-inline">
              <span class="pl-label">
                상담유형 구분
              </span>
              <div class="pl-desc">
                <v-radio-group
                  row
                  class="pl-radio-group"
                  v-model="CUTT_SETTING.ITGRT_USE_YN"
                >
                  <v-radio
                    v-for="(rad01, index) in radioGroup"
                    :key="radioGroup[index].value"
                    :label="rad01.text"
                    :value="rad01.value"
                    disabled
                    class="pl-radio"
                  >
                  </v-radio>
                </v-radio-group>
                <ul class="pl-list-dot is-no-border  mt-0">
                  <li>기본은 “인/아웃 바운드 통합사용”으로 설정되어 있습니다.</li>
                  <li class="is-txt-error">상담유형 구분은 초기 설정 후 변경이 불가 합니다. 반드시 고객과 협의 후 설정해 주세요.</li>
                </ul>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                상담유형 레벨
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  :items="mixin_common_code_get(this.common_code, 'CUSL_TP_LV')"
                  placeholder="선택하세요"
                  v-model="CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD"
                ></v-select>
                <ul class="pl-list-dot is-no-border  mt-0">
                  <li>분류 레벨은 기본 [3레벨]로 설정되어 있습니다.</li>
                  <li>레벨은 최대 [5레벨]까지 사용할 수 있습니다.</li>
                </ul>
              </div>
            </div>


          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('CsSetting')">닫기</v-btn>
          <v-btn class="pl-btn" @click="showAlert(MESSAGE.CONFIRM.SETTING_REG)">저장</v-btn>
        </template>

      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
name:"MENU_SYS_M0400", //name은 'MENU_' + 파일명 조합
components: {
},
data() {
   return {
    tab: null,
    common_code: [],
    // drop
    dropFindParts: false,

    // 조회 영역 콤보
    schCuttTypeSeDropItems: [], //상담유형 구분
    SCH_CUTT_TYPE_SE_CD:'', //상담유형 구분 값
    SCH_EXPSN_ATTR_NM:'', //상담내용 학목 정보 조회
    schExpsnAttrDropItems: [], //항목명

    // dialog
    dialogCsSetting: false,
    radioGroup: [
      { text: "인/아웃 바운드 통합 사용", value: "Y"},
      { text: "인/아웃 바운드 분리 사용", value: "N"},
    ],

    //상담유형 tree
    expanded: false,
    treeItems: [],
    // ACT_TREE_NODE:[],         //활성화된(클릭한) 트리 NODE
    // ACT_TREE_LIST:[],         //활성화된 트리 리스트
    activeItem:[],
    selectedNode: null,

    //상담유형 셋팅 정보
    CUTT_SETTING: {
      ITGRT_USE_YN:'',
      CUTT_TYPE_LMT_LVL_CD:'',
    },

    //상담유형 상세 정보
    REG_MDFCN: 'REG',   //상담유형 등록 수정 구분
    DPCN_CHK: true,     //상담유형 코드 중복체크 상태
    CUTT_DAIL_CUTT_TYPE_SE_CD:'', //상담유형 구분 코드
    CUTT_DAIL_CUTT_TYPE_SE_NM:'', //상담유형 구분 명
    CUTT_DAIL_CUTT_TYPE_ID:'', //상담유형 ID
    CUTT_DAIL_CUTT_TYPE_NM:'', //상담유형 명
    CUTT_DAIL_UP_CUSTCO_ID:'', //상위 고객사 ID
    CUTT_DAIL_UP_CUTT_TYPE_ID:'', //상위 상담유형 ID
    CUTT_DAIL_UP_CUTT_TYPE_NM:'', //상위 상담유형 명
    CUTT_DAIL_CUTT_TYPE_EXPLN:'', //상담유형 설명
    CUTT_DAIL_USE_YN:'', //사용여부
    CUTT_DAIL_SORT_ORD:'', //정렬순서
    CUTT_DAIL_KEY_WORD:[], //핵심 키워드
    CUTT_DAIL_CHILD_YN : false, //하위 요소 있는지 체크
    // CUTT_DAIL_RE_SORT_ORD:'', //정렬순서
    CUTT_DAIL_MAX_SORT_ORD:'', //상위 상담유형의 최대 정렬순서
    CUTT_DAIL_LVL:'',

    TAG_VALUE : '',

    isAttrDisabled:false,
    isDataTpDisabled:false,
    isDataLenDisabled:false,

    valid : true,
    validateRules: {
      CUTT_TYPE_ID: [
        v => !!v || '상담유형 코드 은(는) 필수 입력 항목 입니다.',
      ],
      CUTT_TYPE_SE_NM: [
        v => !!v || '상담유형 구분 은(는) 필수 입력 항목 입니다.',
      ],
      UP_CUTT_TYPE_NM: [
        v => !!v || '상위 상담유형 명 은(는) 필수 입력 항목 입니다.',
      ],
      CUTT_TYPE_NM: [
        v => !!v || '상담유형 명 은(는) 필수 입력 항목 입니다.',
      ],
      USE_YN: [
        v => !!v || '사용여부 은(는) 필수 입력 항목 입니다.',
      ],
      CUSTCO_DSPTCH_NO_ID: [
        v => !!v || '대표번호 은(는) 필수 입력 항목 입니다.',
      ],
    },

    deatilValidateRules: {
      EXPSN_ATTR_NM: [
        v => !!v || '항목명 은(는) 필수 입력 항목 입니다.',
      ],
      EXPSN_ATTR_COL_ID: [
        v => !!v || '항목ID 은(는) 필수 입력 항목 입니다.',
      ],
      DATA_TYPE_CD: [
        v => !!v || '속성 은(는) 필수 입력 항목 입니다.',
      ],
      DATA_LEN :[
        v => !!v || '길이 은(는) 필수 입력 항목 입니다.',
        v => /[0-9]/.test(v) || '숫자만 입력 가능합니다.',
        v => (v >= 0 && v < 501 ) || '0 ~ 500 이내로 입력해 주세요.',
      ],
      ESNTL_YN: [
        v => !!v || '필수여부 은(는) 필수 입력 항목 입니다.',
      ],
      USE_YN: [
        v => !!v || '사용여부 은(는) 필수 입력 항목 입니다.',
      ],
      HSTRY_LIST_EXPSR_YN: [
        v => !!v || '통합접촉이력 노출 은(는) 필수 입력 항목 입니다.',
      ],
      SRCH_STNG_YN: [
        v => !!v || '검색 설정 여부 은(는) 필수 입력 항목 입니다.',
      ],
    },

    //confirm alert 메시지
    MESSAGE : {
      CONFIRM : {
        REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttTypeSave, callNo: this.closeMsg}
        , SETTING_REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttTypeSettingSave, callNo: this.closeMsg}
        , DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.cuttTypeDel, callNo: this.closeMsg}
        , EXPSN_REG : {alertDialogToggle: true, msg: '내용을 저장 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrSave, callNo: this.closeMsg}
        , EXPSN_DEL : {alertDialogToggle: true, msg: '선택된 항목을 삭제 하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.expsnAttrDel, callNo: this.closeMsg}
      },
      ALERT : {
        SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-done', type: 'default'}
        , DEL_NO : {alertDialogToggle: true, msg: '해당 노드는 삭제가 불가 합니다.', iconClass: 'is-caution', type: 'default'}
        , CHECK_NON : {alertDialogToggle: true, msg: '체크된 항목이 존재하지 않습니다.', iconClass: 'is-caution', type: 'default'}
        , CHANGE_NO : {alertDialogToggle: true, msg: '동일 레벨에서만 이동 가능 합니다.', iconClass: 'is-info', type: 'default'}
        , NO_SELECTED : {alertDialogToggle: true, msg: '상담유형을 선택해 주세요.', iconClass: 'is-caution', type: 'default'}
        , LVL_CHECK : {alertDialogToggle: true, msg: '상담유형 레벨이 제한 되어 있어 추가 하실 수 없습니다.<br>상담유형 설정에서 레벨을 변경후 이용해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'}
        , DSPTCH_NO_CHECK : {alertDialogToggle: true, msg: '대표번호가 설정 되지 않았습니다.<br>관리시스템에서 대표번호 등록 후 상담 유형을 추가해 주시기 바랍니다.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_EMPTY_CHECK : {alertDialogToggle: true, msg: '항목 ID를 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_DUPLE_CHECK : {alertDialogToggle: true, msg: '항목 ID에 대해 중복체크를 진행해 주세요.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_DUPLE_TRUE : {alertDialogToggle: true, msg: '사용중인 항목 ID 입니다.', iconClass: 'is-caution', type: 'default'}
        , ATTR_COL_ID_DUPLE_FAIL : {alertDialogToggle: true, msg: '사용 가능한 항목 ID 입니다.', iconClass: 'is-caution', type: 'default'}
        , REG_Y : {alertDialogToggle: true, msg: '사용가능한 상담유형 코드입니다', iconClass: 'is-done', type: 'default'}
        , REG_N : {alertDialogToggle: true, msg: '이미 사용중인 상담유형 코드입니다', iconClass: 'is-caution', type: 'default'}
      },
      ERROR : {
        ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
      },
      TOAST : {
        SUCCESS: {  msg: '정상 처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
      },
    },

    // drag list
    DRAG_LIST : [],

    //상담내용 항목 상세 정보
    DTL_ATTR_ID : '',
    DTL_LNKG_ATTR_ID : '',
    DTL_EXPSN_ATTR_NM : '',
    DTL_EXPSN_ATTR_COL_ID : '',
    DTL_GROUP_CD_ID : '',
    DTL_GROUP_CD_NM : '',
    DTL_DATA_TYPE_CD : '',
    DTL_DATA_LEN : '',
    DTL_SYS_BSC_YN : 'N',
    DTL_INDI_INFO_ENCPT_YN : false,
    DTL_MDFCN_PSBLTY_YN : '',
    DTL_ESNTL_YN : '',
    DTL_USE_YN : '',
    DTL_HSTRY_LIST_EXPSR_YN : '',
    DTL_SRCH_STNG_YN : '',
    DTL_SORT_ORD : 0,
    DTL_ETC1: '',
    DTL_ETC2: '',
    DTL_ETC3: '',
    DTL_ETC4: '',

    SCH_ATTR_CNT : 0, //검색 항목 개수

    isDisabled: true, //항목명 disabled 처리

    SCH_SE : 'CONSEL', //상담내용 확장항목만 찾기위해
    dialogFindParts: '', //확장항목 찾기
    dialogFindIndex: '', //공통코드 찾기

    dragIndex:'',

    DSPTCH_NO_LIST : [], //고객사 발신번호 목록
    CUSTCO_DSPTCH_NO_ID : '',
    EXPSN_ATTR_COL_ID_DUPLE_CHK: false,
  }
 },

  watch: {

  },

  computed: {
    computedTagSize() {
      return `flex: 0 0 ${this.TAG_VALUE.length + 12}ch;`;
    },
  },

  beforeDestroy(){
    this.$eventBus.$off("selCompanyAction"); //eventBus 중복방지를 위해 off
  },

  async created() {
    //상단 고객사 선택시 eventBus 실행(각 페이지별 필요에 의한 내용 구현)
    this.$eventBus.$on("selCompanyAction", (SELECTED_COMPANY) => {
      // console.log(`${this.$options.name} : =====>`, SELECTED_COMPANY.CD_NM);
    });

    //공통코드설정
    let codeName = ['CUSL_TP_LV', 'CUSL_TP_CL', 'USE_WT', 'EXPN_PT', 'REQR_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    //콤보
    this.schCuttTypeSeDropItems = this.mixin_common_code_get(this.common_code, 'CUSL_TP_CL'); //확장구분 콤보

    this.getTreeList();
    // this.getExpsnAttrList();
  },

  mounted() {

  },

  methods: {
    //조회버튼 클릭 이벤트
    schGetTreeList(){
      this.getTreeList();
      this.$refs.form.reset();

      // this.activeItem[0] = this.CUTT_TYPE_ID
      // this.ACT_TREE_NODE = activeItem;
    },
    //상담유형 Tree 목록 조회
    async getTreeList() {
      let sUrl = '/api/biz/common/select/cuttTypeList';
      let postParam = {
        SCH_CUSTCO_ID : -1 //해당 메뉴는 상담센터별로 관리하지 않고 운영관리자(OS관리자)만 사용 하므로 강제로 -1
        , CUTT_TYPE_SE_CD : this.SCH_CUTT_TYPE_SE_CD
      }

      let headParam = {
        head : {
          ns : 'lhcs.phone.cutt.dao.PhoneCuttMapper'
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        //상담유형 정보 셋팅
        if(response.CUTT_TYPE_SETTING){
          if(response.CUTT_TYPE_SETTING.length > 0){
            this.CUTT_SETTING.ITGRT_USE_YN = response.CUTT_TYPE_SETTING[0].ITGRT_USE_YN;
            this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD = response.CUTT_TYPE_SETTING[0].CUTT_TYPE_LMT_LVL_CD;
          }
        }

        //상담유형 설정에서 통합 사용이 아닌 경우 유형구분에서 통합 제거
        if(this.CUTT_SETTING.ITGRT_USE_YN === "N"){
          let tmpCuttTypeSeDropItems = [];
          for(let i=0; i<this.schCuttTypeSeDropItems.length; i++){
            if(this.schCuttTypeSeDropItems[i].value != "ITGRT"){
              tmpCuttTypeSeDropItems.push(this.schCuttTypeSeDropItems[i]);
            }
          }
          this.schCuttTypeSeDropItems = tmpCuttTypeSeDropItems;
        }

        // //상담유형 Tree 데이터
        // if(response.CUTT_TYPE_TREE){
        //   this.treeItems = response.CUTT_TYPE_TREE;
        // }

        if(response.DATA){
          if(response.DATA.length > 0){
            this.CUTT_TYPE_ID = response.DATA[0].CUTT_TYPE_ID;
            this.SCH_CUTT_TYPE_SE_CD = response.DATA[0].CUTT_TYPE_SE_CD;

            this.treeItems = await this.mixin_makeOrgTreeData(response.DATA);
          }
        }

        if(response?.DSPTCH_NO_LIST){
          if(response.DSPTCH_NO_LIST.length > 0){
            this.DSPTCH_NO_LIST = [];
            this.DSPTCH_NO_LIST.push({ text: '선택하세요.', value: '' });
            response.DSPTCH_NO_LIST.forEach((dsptch, idx) => {
              this.DSPTCH_NO_LIST.push({ text: this.mixin_setPhoneNo(dsptch.DSPTCH_NO.replace(/[^0-9]/g, "")), value: dsptch.CUSTCO_DSPTCH_NO_ID });
            });

            if(response.DSPTCH_NO_LIST.length === 1){
              this.CUSTCO_DSPTCH_NO_ID = response.DSPTCH_NO_LIST[0].CUSTCO_DSPTCH_NO_ID;
            }
          }
        }
      }
    },

    closeDropFindParts() {
      this.dropFindParts = false;
    },
    expandAll(id){
      this.expanded = true;
      this.$refs[id].updateAll(true);
    },
    collapseAll(id){
      this.expanded = false;
      this.$refs[id].updateAll(false);
    },

    srch_tree_act(node){
      this.activeItem = node;
      this.selectedNode = this.activeItem[0];
      console.log( this.selectedNode );

      if(this.selectedNode != null){
        this.CUTT_DAIL_CUTT_TYPE_SE_CD = this.selectedNode.CUTT_TYPE_SE_CD;
        this.CUTT_DAIL_CUTT_TYPE_SE_NM = this.selectedNode.CUTT_TYPE_SE_NM;
        this.CUTT_DAIL_UP_CUSTCO_ID = this.selectedNode.CUSTCO_ID;
        this.CUTT_DAIL_UP_CUTT_TYPE_ID = this.selectedNode.UP_CUTT_TYPE_ID;
        this.CUTT_DAIL_UP_CUTT_TYPE_NM = this.selectedNode.UP_CUTT_TYPE_NM;
        this.CUTT_DAIL_CUTT_TYPE_ID = this.selectedNode.CUTT_TYPE_ID;
        this.CUTT_DAIL_CUTT_TYPE_NM = this.selectedNode.CUTT_TYPE_NM;
        this.CUTT_DAIL_CUTT_TYPE_EXPLN = this.selectedNode.CUTT_TYPE_EXPLN;
        this.CUTT_DAIL_USE_YN = this.selectedNode.USE_YN;
        this.CUTT_DAIL_SORT_ORD = this.selectedNode.SORT_ORD;
        // this.CUTT_DAIL_RE_SORT_ORD = this.selectedNode.RE_SORT_ORD;
        this.CUTT_DAIL_MAX_SORT_ORD = this.selectedNode.MAX_SORT_ORD;
        this.CUTT_DAIL_KEY_WORD = this.mixin_isEmpty(this.selectedNode.IDX)?[]:this.selectedNode.IDX.split(',');
        this.CUTT_DAIL_CHILD_YN = this.mixin_isEmpty(this.selectedNode.children) ? true : false;
        this.TAG_VALUE = '';
        this.CUTT_DAIL_LVL = this.selectedNode.LVL;
        this.CUSTCO_DSPTCH_NO_ID = this.DSPTCH_NO_LIST.length > 2?this.selectedNode.CUSTCO_DSPTCH_NO_ID:this.CUSTCO_DSPTCH_NO_ID;
        this.REG_MDFCN = 'MDFCN';
        this.DPCN_CHK = false;
        this.DTL_ETC1 = this.selectedNode.ETC1;
        this.DTL_ETC2 = this.selectedNode.ETC2;
        this.DTL_ETC3 = this.selectedNode.ETC3;
        this.DTL_ETC4 = this.selectedNode.ETC4;
      }
    },

    //등록 form 호출 및 form 초기화
    cuttTypeRegForm() {
      if(this.selectedNode){
        if(parseInt(this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD)+1 <= parseInt(this.selectedNode.LVL)){
          this.showAlert(this.MESSAGE.ALERT.LVL_CHECK);
          return;
        }else{
          this.REG_MDFCN = 'REG';
          this.DPCN_CHK = true;
          this.CUTT_DAIL_UP_CUSTCO_ID = this.selectedNode.CUSTCO_ID;
          this.CUTT_DAIL_UP_CUTT_TYPE_ID = this.selectedNode.CUTT_TYPE_ID;
          this.CUTT_DAIL_UP_CUTT_TYPE_NM = this.selectedNode.CUTT_TYPE_NM;
          this.CUTT_DAIL_CUTT_TYPE_ID = '';
          this.CUTT_DAIL_CUTT_TYPE_NM = '';
          this.CUTT_DAIL_CUTT_TYPE_EXPLN = '';
          this.CUTT_DAIL_USE_YN = 'Y';
          this.CUTT_DAIL_SORT_ORD = '';
          this.CUTT_DAIL_KEY_WORD = [];
          this.TAG_VALUE = '';
          this.DTL_ETC1 = '';
          this.DTL_ETC2 = '';
          this.DTL_ETC3 = '';
          this.DTL_ETC4 = '';
          // this.CUTT_DAIL_RE_SORT_ORD = '';
          if(this.DSPTCH_NO_LIST.length > 2) this.CUSTCO_DSPTCH_NO_ID = '';
          this.CUTT_DAIL_LVL = (parseInt(this.selectedNode.LVL)+1).toString();
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //등록 수정 validate 체크
    cuttTypeRegValidate() {
      if (!this.validate()) {
        return;
      }

      if(this.CUTT_DAIL_LVL === '2'){
        if(!this.$store.getters["userStore/GE_USER_ROLE"].company.DSPTCH_NO){
          this.showAlert(this.MESSAGE.ALERT.DSPTCH_NO_CHECK);
          return;
        }
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
    },

    //validate check
    validate () {
      return this.$refs.form.validate();
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    //상담유형 등록 수정
    async cuttTypeSave() {
      let sUrl = '/api/setting/cuttType/cuttTypeProc';
      let postParam = {
        CUTT_TYPE_SE_CD : this.CUTT_DAIL_CUTT_TYPE_SE_CD
        , UP_CUSTCO_ID : this.CUTT_DAIL_UP_CUSTCO_ID
        , UP_CUTT_TYPE_ID : this.CUTT_DAIL_UP_CUTT_TYPE_ID
        , CUTT_TYPE_ID : this.CUTT_DAIL_CUTT_TYPE_ID
        , CUTT_TYPE_NM : this.CUTT_DAIL_CUTT_TYPE_NM
        , CUTT_TYPE_EXPLN : this.CUTT_DAIL_CUTT_TYPE_EXPLN
        , USE_YN : this.CUTT_DAIL_USE_YN
        , SORT_ORD : this.CUTT_DAIL_SORT_ORD
        , IDX : this.mixin_isEmpty(this.CUTT_DAIL_KEY_WORD) ? '' : this.CUTT_DAIL_KEY_WORD.join(',')
        , CUTT_DAIL_LVL : this.CUTT_DAIL_LVL
        , CUSTCO_DSPTCH_NO_ID : this.CUSTCO_DSPTCH_NO_ID
        , PROC_TYPE: this.REG_MDFCN
        , ETC1: this.DTL_ETC1
        , ETC2: this.DTL_ETC2
        , ETC3: this.DTL_ETC3
        , ETC4: this.DTL_ETC4
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.getTreeList();
        this.closeMsg();
      }
    },

    cuttTypeDelCheck() {
      if(this.selectedNode){
        this.showAlert(this.MESSAGE.CONFIRM.DEL)
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //삭제
    async cuttTypeDel() {
      if(this.CUTT_DAIL_UP_CUTT_TYPE_ID === ''){
        this.showAlert(this.MESSAGE.ALERT.DEL_NO);
        return;
      }

      let sUrl = '/api/setting/cuttType/cuttTypeDel';
      let postParam = {
        CUTT_TYPE_ID: this.CUTT_DAIL_CUTT_TYPE_ID,
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getTreeList();
        this.$refs.form.reset();
      }
    },

    //Node 순서 변경
    async treeNodeMove(type){
      if(this.selectedNode){
        if((type === 'UP' && this.CUTT_DAIL_SORT_ORD > 1)
          || (type === 'DOWN' && this.CUTT_DAIL_SORT_ORD < this.CUTT_DAIL_MAX_SORT_ORD))
        {
          let sUrl = '/api/setting/cuttType/cuttTypeOrderUpdate';
          let postParam = {
            CUTT_TYPE_SE_CD : this.CUTT_DAIL_CUTT_TYPE_SE_CD,
            CUTT_TYPE_ID: this.CUTT_DAIL_CUTT_TYPE_ID,
            UP_CUTT_TYPE_ID: this.CUTT_DAIL_UP_CUTT_TYPE_ID,
            SORT_ORD: this.CUTT_DAIL_SORT_ORD,
            MAX_SORT_ORD: this.CUTT_DAIL_MAX_SORT_ORD,
            ORDER_TYPE: type,
          }

          let headParam = {
            head: {
            }
          }

          let response  = await this.common_postCall(sUrl, postParam, headParam);

          if (!response.HEADER.ERROR_FLAG){
            if(type == 'UP'){
              this.CUTT_DAIL_SORT_ORD = parseInt(this.CUTT_DAIL_SORT_ORD) - 1;
            } else if(type == 'DOWN'){
              this.CUTT_DAIL_SORT_ORD = parseInt(this.CUTT_DAIL_SORT_ORD) + 1;
            }
            this.getTreeList();
          }
        }else{
          this.showAlert(this.MESSAGE.ALERT.CHANGE_NO);
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.NO_SELECTED);
      }
    },

    //상담유형 설정 저장
    async cuttTypeSettingSave() {
      let sUrl = '/api/setting/cuttType/cuttTypeSettingSave';
      let postParam = {
        ITGRT_USE_YN : this.CUTT_SETTING.ITGRT_USE_YN
        , CUTT_TYPE_LMT_LVL_CD : this.CUTT_SETTING.CUTT_TYPE_LMT_LVL_CD
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getTreeList();

      }
    },

    //조회버튼 클릭 이벤트
    schGetExpsnAttrList(){
      this.getExpsnAttrList();
      // this.$refs.form.reset();
    },

    async getExpsnAttrList() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrList';
      let postParam = {
        SE : this.SCH_SE
        , BSC_PVSN_ATTR_YN : "N"
        , EXPSN_ATTR_NM : this.SCH_EXPSN_ATTR_NM
      }

      let headParam = {
        head : {
          PAGING:"Y"
          , ROW_CNT:500
          , PAGES_CNT:1
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let ArrExpsnAttr = [];
        for(let i=0; i<response.DATA.length; i++){
          const expsnAttrObj = response.DATA[i];
          expsnAttrObj.idx = i;
          expsnAttrObj.type = this.getIconClassNm(response.DATA[i].DATA_TYPE_CD);
          expsnAttrObj.disabled = false;
          expsnAttrObj.lock = false;
          expsnAttrObj.selected = false;

          ArrExpsnAttr.push(expsnAttrObj);

          if(expsnAttrObj.SRCH_STNG_YN === 'Y') this.SCH_ATTR_CNT++;
        }

        this.DRAG_LIST = ArrExpsnAttr;

        if(response.DATA.length > 0){
          if(this.dragIndex){
            response.DATA.forEach((listItem, idx) => {
              if(idx === this.dragIndex) this.getExpsnAttrDetailInfo(listItem);
            });
          }else{
            this.getExpsnAttrDetailInfo(response.DATA[0]);
          }
        }
      }
    },

    getIconClassNm(data) {
      let classNm = 'string';
      if(data === 'TXT') classNm = 'string'; //문자형
      else if(data === 'NUM') classNm = 'number'; //숫자형
      else if(data === 'NUM_COMMA') classNm = 'number'; //숫자형(',' 포함)
      else if(data === 'COE') classNm = 'check'; //단일선택형
      else if(data === 'COE_MULTI') classNm = 'check'; //다중선택형
      else if(data === 'DAT') classNm = 'date'; //날짜형
      else if(data === 'POST') classNm = 'post'; //우편번호
      else if(data === 'HASH') classNm = 'hashtag'; //해시태그

      return classNm;
    },

    getExpsnAttrDetailInfo(item){
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });
      item.selected = true;

      this.dragIndex = item.idx;
      this.DTL_ATTR_ID = item.ATTR_ID;
      this.DTL_EXPSN_ATTR_NM = item.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = item.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = item.DATA_TYPE_CD;
      this.dataTypeChange ();
      this.DTL_DATA_LEN = item.DATA_LEN;
      this.DTL_GROUP_CD_ID = item.GROUP_CD_ID;
      this.DTL_GROUP_CD_NM = item.GROUP_CD_NM;
      this.DTL_SYS_BSC_YN = item.SYS_BSC_YN;
      this.DTL_INDI_INFO_ENCPT_YN = item.INDI_INFO_ENCPT_YN === 'Y' ? true:false;
      this.DTL_MDFCN_PSBLTY_YN = item.MDFCN_PSBLTY_YN;
      this.DTL_ESNTL_YN = item.ESNTL_YN;
      this.DTL_USE_YN = item.USE_YN;
      this.DTL_HSTRY_LIST_EXPSR_YN = item.HSTRY_LIST_EXPSR_YN;
      this.DTL_SRCH_STNG_YN = item.SRCH_STNG_YN;
      this.DTL_SORT_ORD = item.SORT_ORD;
      this.DTL_ETC1 = item.ETC1;
      this.DTL_ETC2 = item.ETC2;
      this.DTL_ETC3 = item.ETC3;
      this.DTL_ETC4 = item.ETC4;
      this.EXPSN_ATTR_COL_ID_DUPLE_CHK = item.SYS_BSC_YN==='Y'?true:item.MDFCN_PSBLTY_YN === 'N'?true:false;
    },

    expsnAttrValidate() {
      if (!this.detailValidate()) {
        return;
      }

      if(!this.EXPSN_ATTR_COL_ID_DUPLE_CHK){
        this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_CHECK);
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.EXPSN_REG);
    },

    //validate check
    detailValidate () {
      return this.$refs.detailForm.validate();
    },

    //버튼정보 초기화
    displayOwner(item) {
      return item === 'Y' ? '(시스템 기본항목)' : '(사용자 확장항목)'
    },
    displayDisabled(item) {
      return item === 'N' ? '사용안함' : ''
    },
    displayLock(item) {
      return item === 'N' ? 'list-lock' : 'list-unlock'
    },
    addDragItem() {
      this.DRAG_LIST.forEach((listItem) => {
        listItem.selected = false;
      });

      this.DTL_ATTR_ID = '';
      this.isDisabled = true;
      this.DTL_EXPSN_ATTR_NM = '';
      this.DTL_SYS_BSC_YN = 'N';
      this.DTL_INDI_INFO_ENCPT_YN = false;
      this.DTL_EXPSN_ATTR_COL_ID = '';
      this.isAttrDisabled = false;
      this.isDataLenDisabled = false;
      this.DTL_DATA_TYPE_CD = '';
      this.DTL_GROUP_CD_NM = '';
      this.DTL_DATA_LEN = '';
      this.DTL_ESNTL_YN = '';
      this.DTL_MDFCN_PSBLTY_YN = 'Y';
      this.DTL_USE_YN = '';
      this.DTL_HSTRY_LIST_EXPSR_YN = '';
      this.DTL_SRCH_STNG_YN = '';
      this.DTL_SORT_ORD = this.DRAG_LIST.length + 1;
      this.DTL_ETC1 = '';
      this.DTL_ETC2 = '';
      this.DTL_ETC3 = '';
      this.DTL_ETC4 = '';
    },

    expsnAttrFind(flag) {

      this.isDisabled = flag;

      if (flag) {
        this.mixin_showDialog('FindParts');
      } else {
        // console.log('직접 입력');
      }

      this.dropFindParts = false;
    },

    //확장속성 찾기 선택
    setExpsnAttrItem(selectedItem) {

      this.DTL_LNKG_ATTR_ID = selectedItem.ATTR_ID;
      this.DTL_EXPSN_ATTR_NM = selectedItem.EXPSN_ATTR_NM;
      this.DTL_EXPSN_ATTR_COL_ID = selectedItem.EXPSN_ATTR_COL_ID;
      this.DTL_DATA_TYPE_CD = selectedItem.DATA_TYPE_CD;
      this.DTL_DATA_LEN = selectedItem.DATA_LEN;
      this.DTL_ESNTL_YN = selectedItem.ESNTL_YN;
      this.DTL_USE_YN = selectedItem.USE_YN;
      this.DTL_HSTRY_LIST_EXPSR_YN = selectedItem.HSTRY_LIST_EXPSR_YN;
      this.DTL_SRCH_STNG_YN = selectedItem.SRCH_STNG_YN;
      this.DTL_INDI_INFO_ENCPT_YN = selectedItem.INDI_INFO_ENCPT_YN === 'Y' ? true : false;

      this.isAttrDisabled = true; //항목id 비활성화
      this.isDataTpDisabled = true;
      this.EXPSN_ATTR_COL_ID_DUPLE_CHK = true;

      this.mixin_hideDialog('FindParts');
    },

    //공통코드 찾기 선택
    setCommCdItem(selectedItem) {
      this.DTL_GROUP_CD_NM = selectedItem.CD_NM;
      this.DTL_GROUP_CD_ID = selectedItem.CD_ID;
      this.isDataLenDisabled = true;
      this.DTL_DATA_LEN = 60;

      this.mixin_hideDialog('FindIndex');
    },

    dataTypeChange () {
      if(this.DTL_DATA_TYPE_CD === 'COE' || this.DTL_DATA_TYPE_CD === 'COE_MULTI'){
        this.isDataLenDisabled = true;
        this.DTL_DATA_LEN = 60;
      }else{
        this.DTL_GROUP_CD_ID = '';
        this.DTL_GROUP_CD_NM = '';
        this.isDataLenDisabled = false;
        this.DTL_DATA_LEN = '';
      }
    },

    onDragStart(event) {
      // console.log('Drag started');
      // console.log('Event:', event);
      // Additional logic for drag start
    },
    async onDragEnd(event) {
      let arrAttrId = [];
      for (let value of this.DRAG_LIST) {
        arrAttrId.push(value.ATTR_ID);
      }

      let sUrl = '/api/setting/expsnAttr/expsnAttrReOrder';
      let postParam = {
        arrAttrId : arrAttrId
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.getExpsnAttrList();

        this.dragIndex = event.newIndex;
      }
    },

    //등록 수정
    async expsnAttrSave() {
      if(!this.SCH_SE) return;

      let sUrl = '/api/setting/expsnAttr/expsnAttrProc';
      let postParam = {
        ATTR_ID : this.DTL_ATTR_ID
        , SE : this.SCH_SE //상담내용
        , LNKG_ATTR_ID : this.DTL_LNKG_ATTR_ID
        , EXPSN_ATTR_NM : this.DTL_EXPSN_ATTR_NM
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
        , DATA_TYPE_CD : this.DTL_DATA_TYPE_CD
        , DATA_LEN : (this.DTL_DATA_TYPE_CD==='COE' || this.DTL_DATA_TYPE_CD==='COE_MULTI')?60:this.DTL_DATA_LEN
        , GROUP_CD_ID : this.DTL_GROUP_CD_ID
        , ESNTL_YN : this.DTL_ESNTL_YN
        , USE_YN : this.DTL_USE_YN
        , HSTRY_LIST_EXPSR_YN : this.DTL_HSTRY_LIST_EXPSR_YN
        , SRCH_STNG_YN : this.DTL_INDI_INFO_ENCPT_YN?'N':this.DTL_SRCH_STNG_YN
        , SCRN_EXPSR_YN : 'N'
        , BSC_PVSN_ATTR_YN : 'N'
        , SYS_BSC_YN : 'N'
        , MDFCN_PSBLTY_YN : 'Y'
        , INDI_INFO_ENCPT_YN : (!this.DTL_ATTR_ID?this.DTL_INDI_INFO_ENCPT_YN?'Y':'N':'N')
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getExpsnAttrList();
        this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
      }
    },

    //상담내용 항목 삭제
    async expsnAttrDel() {
      let sUrl = '/api/setting/expsnAttr/expsnAttrDel';
      let postParam = {
        arrAttrId: this.DTL_ATTR_ID,
      }

      let headParam = {
        head : {
        }
      }

      let resData  = await this.common_postCall(sUrl, postParam, headParam);

      if (!resData.HEADER.ERROR_FLAG){
        // this.showAlert(this.MESSAGE.ALERT.SUCCESS);
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
        this.getExpsnAttrList();
        this.$refs.detailForm.reset();
      }
    },

    //항목 ID 중복 체크
    async attrColIdDupleChk() {

      if(!this.DTL_EXPSN_ATTR_COL_ID){
        this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_EMPTY_CHECK);
        return;
      }

      let sURL = '/api/setting/expsnAttr/expsnAttrColIdDupleChk';
      let postParam = {
        SE : 'CONSEL'
        , ATTR_ID : this.DTL_ATTR_ID
        , EXPSN_ATTR_COL_ID : this.DTL_EXPSN_ATTR_COL_ID
      }
      let headParam = {
        head: {
        },
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)

      if (resData.HEADER.ERROR_FLAG) {
        this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
      } else {
        if(resData.DATA[0].expsnAttrColIdBoolean){
          this.EXPSN_ATTR_COL_ID_DUPLE_CHK = false;
          this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_TRUE);
        }else{
          this.EXPSN_ATTR_COL_ID_DUPLE_CHK = true;
          this.showAlert(this.MESSAGE.ALERT.ATTR_COL_ID_DUPLE_FAIL);
        }
      }

    },

    changeGridView () {
      if(this.DTL_INDI_INFO_ENCPT_YN){
        this.DTL_SCRN_EXPSR_YN = 'N';
      }else{
        this.DTL_SCRN_EXPSR_YN = 'Y';
      }
    },

    chkSchCnt(){
      // console.log('this.SCH_ATTR_CNT : ', this.SCH_ATTR_CNT);

      if(this.DTL_SRCH_STNG_YN === 'Y'){
        // if(this.SCH_ATTR_CNT >= 5){
        //   this.DTL_SRCH_STNG_YN = 'N';
        //   this.showAlert(this.MESSAGE.ALERT.SCH_STNG_CNT_OVER);
        //   return;
        // }else{
          if(!this.mixin_isEmpty(this.DTL_ATTR_ID)){
            this.expsnAttrSave();
          }
        // }
      }else{
        if(!this.mixin_isEmpty(this.DTL_ATTR_ID)){
          this.expsnAttrSave();
        }
      }
    },


    //상담유형 코드 중복체크
    async dpcnCheck(){
      let sUrl = '/api/setting/cuttType/dpcnCheck';
      let postParam = {
        CUTT_TYPE_ID: this.CUTT_DAIL_CUTT_TYPE_ID,
      }
      let headParam = {
        head: {
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        //중복이 없을때
        if(resData.DATA[0].CNT == '0'){
          this.showAlert(this.MESSAGE.ALERT.REG_Y);
          this.DPCN_CHK = false;
        } else {
          this.showAlert(this.MESSAGE.ALERT.REG_N);
        }
      }
    },

    addTag(){
      if(this.TAG_VALUE.trim() == '') {
        this.TAG_VALUE = '';
        this.showToastCaution({msg :'핵심 키워드 값을 입력해 주세요.'})
        return;
      }
      const addTag = this.TAG_VALUE.trim();
      this.TAG_VALUE = '';
      this.CUTT_DAIL_KEY_WORD.push(addTag);
    },
    deleteTag(tag, index) {
      this.showToastInfo({msg :'핵심 키워드는 저장 시 반영됩니다.'})
      this.CUTT_DAIL_KEY_WORD.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>