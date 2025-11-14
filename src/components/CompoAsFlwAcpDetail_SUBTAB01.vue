<template>
  <div class="pl-cols">
    <!-- as접수정보 -->
    <!-- HEADER -->
    <div>
      <div class="d-flex align-center">
        <div class="pl-header is-no-boredr">
          <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
          <div class="pl-subtit ml-1">AS 접수 정보</div>
        </div>
        <div class="ml-1">
          : {{FLW_ACP_INFO.V_FLW_ACP_SN}}
        </div>
        <!-- 버튼 -->
        <div class="ml-auto pl-btn-wrap">
          <span v-if="FLW_ACP_INFO.ATCH_CNT > 0"
            class="pl-badge type-light is-red">첨부파일 있음</span>
          <v-btn 
            class="pl-btn is-sm is-sub" 
            @click="btnUpdateFlwPush()">독촉</v-btn>
          
          <!-- 업무종결 -->
          <v-menu
            v-model="dialogUpdateFlwClose"
            min-width="350"
            bottom
            left
            content-class="pl-menu-drop"
            :close-on-content-click=false
            offset-y
          >
            <template v-slot:activator="{attrs: menuAttrs }">
              <v-btn
                v-bind="menuAttrs"
                class="pl-btn is-sub is-sm"
                @click="openFormUpdateFlwClose">업무종결</v-btn>
            </template>
            <!-- 업무종결 등록 v-menu -->
            <div class="px-3 py-2">
              <v-form ref="flwCloseForm">
                <!-- header -->
                <div class="d-flex">
                  <h3 style="font-size: 16px">업무종결 등록</h3>
                  <v-btn
                    @click="dialogUpdateFlwClose = false"
                    plain
                    min-width="22"
                    height="22"
                    class="pl-tooltip-btn ml-auto"
                    >
                    <v-icon
                      small
                      class="pl-icon20 dialog-close-black">
                    </v-icon>
                  </v-btn>
                </div>
                <!-- form -->
                <v-textarea
                  v-model="AGR_MPBL_RSN"
                  height="120"
                  class="pl-form is-noresize is-mt-s"
                  :spellcheck="false"
                  placeholder="업무종결 내용"
                  :rules="validateRulesFlwClose.AGR_MPBL_RSN"
                />
                <div class="pl-btn-wrap is-mt-m">
                  <v-btn
                    class="pl-btn is-trans ml-auto"
                    @click="btnCancelFlwClose">취소</v-btn>
                  <v-btn class="pl-btn" @click="btnUpdateFlwClose">저장</v-btn>
                </div>
              </v-form>
            </div>
          </v-menu>

          <v-btn class="pl-btn is-sm "
            @click="btnUpdateFlwAcp">수정</v-btn>
        </div>
      </div>
      <div class="is-mt-s">
        <v-form ref="formFlwAcp">
          <table class="pl-tbl-detail">
            <colgroup>
              <col width="80px" />
              <col width="225px" />
              <col width="80px" />
              <col width="" />
            </colgroup>
            <tbody>
              <!-- 접수일, 처리상태 : 수정 대상 아님 -->
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    접수일
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.FLW_RGS_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    처리상태
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.FLW_PGRS_SS_NM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
              </tr>
              <!-- 시설구분 : 수정 대상 아님 -->
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    시설구분
                  </span>
                </th>
                <td >
                  <v-select
                    v-model="FLW_ACP_INFO.LCLS_CD"
                    disabled
                    :items="LCLS_CD_LIST"
                    @change="changeLclsCd"
                    class="pl-form is-auto"
                    placeholder=""
                  ></v-select>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    단지/동주소
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.MGOF_NM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
              </tr>
              <!-- 동 호 : 수정 대상 아님 -->
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    동
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.BLDG_NO"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    호
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.HS_NO"
                  disabled
                  class="pl-form is-auto"
                  placeholder=""/>
                </td>
              </tr>
              <!-- 도로명 주소 : 수정 대상 아님-->
              <tr>
                <th scope="row" >
                  <span class="pl-label">
                    도로명 주소
                  </span>
                </th>
                <td colspan="3">
                  <v-text-field
                    v-model="FLW_ACP_INFO.BLDG_ADR"
                    disabled
                    class="pl-form is-auto"
                    placeholder="" />
                </td>
              </tr>
              <!-- 공간, 담당자 정보 : updateType 'ALL'일때만 수정 가능 -->
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    공간
                  </span>
                </th>
                <td >
                  <v-select
                    v-model="FLW_ACP_INFO.SPCE_CD"
                    :items="SPCE_CD_LIST"
                    :disabled="updateType == 'ALL' ? false : true"
                    class="pl-form is-auto"
                    placeholder=""
                    @change="changeSpceCd"
                  ></v-select>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    담당자 정보
                  </span>
                </th>
                <td >
                  <v-text-field
                    v-model="FLW_ACP_INFO.ICPR_EMPNM"
                    disabled
                    class="pl-form is-search is-auto"
                    placeholder=""
                    @click="updateType == 'ALL' ? openFindAsIcpr() : ''"
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="updateType == 'ALL' ? openFindAsIcpr() : ''"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
                </td>
              </tr>
              <!-- (신)공종 : updateType 'ALL' 일 시 수정 가능 -->
              <tr v-if="histType == 'NEW'">
                <th scope="row" >
                  <span class="pl-label">
                    공종
                  </span>
                </th>
                <td colspan="3" >
                  <div class="spacing-wrap sp-4">
                    <v-autocomplete
                      v-model="FLW_ACP_INFO.MNTN_FLW_CS_CD"
                      :items="MNTN_FLW_CS_CD_LIST"
                      class="pl-form is-auto"
                      :disabled="updateType == 'ALL' ? false : true"
                      placeholder=""
                      no-data-text="결과 없음"
                      @click="updateType == 'ALL' ? clickMntnFlwCsCd : ''"
                    />
                    <compo-tooltip-btn
                      TitleProp="검색"
                      ClassProp="pl-tooltip-btn"
                      IconProp="pl-icon20 in-search"
                      :MinWidthProp="22"
                      :HeightProp="22"
                      TooltipPositionProp="bottom"
                      @btnClick="updateType == 'ALL' ? mixin_showDialog('FindAsMntnFlwCs') : ''"
                    ></compo-tooltip-btn>
                  </div>
                </td>
              </tr>
              <!-- (구)공종 : updateType 'ALL' 일 시 수정 가능 -->
              <tr v-if="histType == 'OLD'">
                <th scope="row" >
                  <span class="pl-label">
                    공종
                  </span>
                </th>
                <td colspan="3" >
                  <div class="spacing-wrap sp-4">
                    <v-select
                      v-model="FLW_ACP_INFO.MCLS_CD"
                      class="pl-form is-sm"
                      :items="MCLS_CD_LIST"
                      @change="changeMclsCd"
                      :disabled="updateType == 'ALL' ? (FLW_ACP_INFO.LCLS_CD ? false : true) : true"
                      placeholder=""></v-select>
                    <v-select
                      v-model="FLW_ACP_INFO.SCLS_CD"
                      :items="SCLS_CD_LIST"
                      @change="changeSclsCd"
                      :disabled="updateType == 'ALL' ? (FLW_ACP_INFO.LCLS_CD ? false : true) : true"
                      class="pl-form is-auto"
                      placeholder=""></v-select>
                    <v-select
                      v-model="FLW_ACP_INFO.DCLS_CD"
                      :items="DCLS_CD_LIST"
                      :disabled="updateType == 'ALL' ? (FLW_ACP_INFO.LCLS_CD ? false : true) : true"
                      class="pl-form is-auto"
                      placeholder=""></v-select>
                  </div>
                </td>
              </tr>

              <!-- 접수자, 연락처 : updateType 'NONE' 이 아닐 시, 수정 가능 -->
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    접수자
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.CVPR_NM"
                  class="pl-form is-auto"
                  placeholder="" 
                  :disabled="updateType == 'NONE' ? true : false"
                />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    연락처
                  </span>
                </th>
                <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.MBL_NO"
                  class="pl-form is-auto"
                  placeholder=""
                  :disabled="updateType == 'NONE' ? true : false"
                />
                </td>
              </tr>
              <!-- AS구분, 보수구분 : 수정 대상 아님 -->
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    AS 구분
                  </span>
                </th>
                <td >
                  <div class="spacing-wrap sp-4">
                    <v-select
                      v-model="FLW_ACP_INFO.FLW_DS_CD"
                      :items="FLW_DS_CD_LIST"
                      disabled
                      class="pl-form"
                      placeholder=""
                    ></v-select>
                    <v-text-field
                      v-model="FLW_ACP_INFO.FRM_NM"  
                      class="pl-form is-xs"
                      disabled
                    />
                  </div>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    보수구분
                  </span>
                </th>
                <td>
                  <v-select
                    v-model="FLW_ACP_INFO.FLW_DTL_DS_CD"
                    :items="FLW_DTL_DS_CD_LIST"
                    class="pl-form is-auto"
                    placeholder=""
                    disabled
                  ></v-select>
                </td>
              </tr>
              <!-- AS 접수내용 : updateType 'ALL' 일 시 수정 가능 -->
              <tr>
                <th scope="row" >
                  <span class="pl-label">
                    AS 접수내용
                  </span>
                </th>
                <td colspan="3" class="has-textarea">
                  <v-textarea
                    v-model="FLW_ACP_INFO.FLW_CTS"
                    height="80"
                    class="pl-form is-noresize"
                    :spellcheck="false"
                    :disabled="updateType == 'ALL' ? false : true"
                  />
                </td>
              </tr>
              <!-- 비고 : 수정 대상 아님 -->
              <tr>
                <th scope="row" >
                  <span class="pl-label">
                    비고
                  </span>
                </th>
                <td colspan="3" class="has-textarea">
                  <v-textarea
                    v-model="FLW_ACP_INFO.FLW_RMK"
                    height="40"
                    disabled
                    class="pl-form is-noresize"
                    :spellcheck="false"
                  />
                </td>
              </tr>

            </tbody>
          </table>
        </v-form>
      </div>
    </div>

    <!-- 작업내용 -->
    <div class="ml-4 is-col-fix" style="width: 46%">
      <div class="pl-header is-no-boredr">
        <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
        <div class="pl-subtit ml-1">작업내용 상세 정보</div>
      </div>
      <div class="is-mt-s">
        <table class="pl-tbl-detail">
          <colgroup>
            <col width="80px" />
            <col width="100px" />
            <col width="110px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  담당자
                </span>
              </th>
              <td >
              <v-text-field
                v-model="FLW_ACP_INFO.JOB_ICPR_EMPNM"
                disabled
                class="pl-form is-auto"
                placeholder="" />
              </td>
              <th scope="row">
                <span class="pl-label">
                  업체명
                </span>
              </th>
              <td >
              <v-text-field
                v-model="FLW_ACP_INFO.JOB_FRM_NM"
                disabled
                class="pl-form is-auto"
                placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리자
                </span>
              </th>
              <td >
              <v-text-field
                v-model="FLW_ACP_INFO.PRCR_NM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
              <th scope="row">
                <span class="pl-label">
                  처리자 연락처
                  <!-- 문자 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="문자 보내기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 td-in-sms"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    @btnClick="showSidePanel('SendSms')"
                  ></compo-tooltip-btn>
                </span>
              </th>
              <td >
              <v-text-field
                v-model="FLW_ACP_INFO.PRCR_TLNO"
                disabled
                class="pl-form is-auto"
                placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  본부 이관일
                </span>
              </th>
              <td >
              <v-text-field
                v-model="FLW_ACP_INFO.TRAN_HDQ_DT"
                disabled
                class="pl-form is-auto"
                placeholder="" />
              </td>
              <th scope="row">
                <span class="pl-label">
                  보수 지시일
                </span>
              </th>
              <td >
              <v-text-field
                v-model="FLW_ACP_INFO.RPR_NSTC_DT"
                disabled
                class="pl-form is-auto"
                placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  방문 예정일
                </span>
              </th>
              <td colspan="3">
              <v-text-field
                v-model="FLW_ACP_INFO.VST_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  최초 등록일
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.FST_VST_RGS_DTTM"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
              <th scope="row">
                <span class="pl-label">
                  반려일자
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.TDN_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  반려 사유
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  v-model="FLW_ACP_INFO.TDN_RSN"
                  height="60"
                  disabled
                  class="pl-form is-noresize"
                  :spellcheck="false"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  감독 사유
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  v-model="FLW_ACP_INFO.ARA_HDQ_RSN"
                  height="60"
                  disabled
                  class="pl-form is-noresize"
                  :spellcheck="false"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리기한
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_XPC_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
              <th scope="row">
                <span class="pl-label">
                  완료보고
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_CMPL_RPT_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  AS 처리내용
                </span>
              </th>
              <td colspan="3">
              <v-text-field
                v-model="FLW_ACP_INFO.CTS"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  보수완료
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_CMPL_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
              <th scope="row">
                <span class="pl-label">
                  최종 수정일
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.LST_CHG_DT"
                  disabled
                  class="pl-form is-auto"
                  placeholder="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- dialog: MMA_유지하자분류(공종) 검색 -->
      <v-dialog
        v-if="dialogFindAsMntnFlwCs"
        v-model="dialogFindAsMntnFlwCs"
        content-class="dialog-draggable is-lg"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="AS코드 검색"
          @hide="mixin_hideDialog('FindAsMntnFlwCs')"
        >
          <template slot="body">
            <CompoFindAsMntnFlwCs 
              :DataProp="{LCLS_CD: FLW_ACP_INFO.LCLS_CD, MNTN_SPCE_CD: FLW_ACP_INFO.SPCE_CD}"
              @setItem="setMntnFlwCs"
              @closeDialog="mixin_hideDialog('FindAsMntnFlwCs')"
            />
          </template>
        </compo-dialog>
      </v-dialog>
      <!-- dialog: 담당자 정보 -->
      <v-dialog
        v-if="dialogFindAsIcpr"
        v-model="dialogFindAsIcpr"
        width="1410"
        content-class="dialog-draggable is-lg"
        hide-overlay>
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="담당자 검색"
          @hide="mixin_hideDialog('FindAsIcpr')"
          >
          <template slot="body">
            <CompoFindAsIcpr 
              :DataProp="{ARA_HDQ_CD: FLW_ACP_INFO.ARA_HDQ_CD, MGOF_CD: FLW_ACP_INFO.MGOF_CD, MGOF_NM: FLW_ACP_INFO.MGOF_NM, MNTN_USR_DS_CD: FLW_ACP_INFO.MNTN_USR_DS_CD}"
              @setItem="setIcpr"
              @closeDialog="mixin_hideDialog('FindAsIcpr')"
            />
          </template>
        </compo-dialog>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import CompoFindAsIcpr from '@/components/CompoFindAsIcpr.vue';
import CompoFindAsMntnFlwCs from '@/components/CompoFindAsMntnFlwCs.vue';

export default {
  name: "CompoAsFlwAcpDetail_SUBTAB01", //AS 접수정보
  components: {
    CompoFindAsIcpr,
    CompoFindAsMntnFlwCs
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
      default: () => {},
    },
    CustInfoProp: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      //신(NEW), 구(OLD) 구분
      histType: '',

      //사용자 권한
      USER_TYPE: this.$store.getters["userStore/GE_USER_ROLE"].USER_TYPE,
      USER_DETAIL_TYPE: this.$store.getters["userStore/GE_USER_ROLE"].USER_DETAIL_TYPE,
      USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
      DEPT_ID: this.$store.getters["userStore/GE_USER_ROLE"].DEPT_ID,

      //권한 유형 : ALL, SIMPLE, NONE
      updateType: 'NONE',

      //시설구분 코드 목록
      LCLS_CD_LIST: [],
      //AS구분 코드 목록
      FLW_DS_CD_LIST: [],
      //보수구분 코드 목록 - AS 구분값에 따라 변경
      FLW_DTL_DS_CD_LIST: [],
      //공간 코드 목록 - 시설구분값에 따라 변경
      SPCE_CD_LIST: [],
      //공종 코드 목록 - 시설구분, 공간값에 따라 변경
      MNTN_FLW_CS_CD_LIST: [],

      //(구)중분류 코드 목록
      MCLS_CD_LIST: [],
      //(구)소분류 코드 목록
      SCLS_CD_LIST: [],
      //(구)세분류 코드 목록
      DCLS_CD_LIST: [],


      FLW_ACP_INFO: {},
      CUST_INFO_INIT: {
        EMP_NM: ''
      },
      CUST_INFO: {},

      AGR_MPBL_RSN: '', //업무종결 사유


      // AS접수정보
      modelAS01: '수전 > 누수 > 기계 > 수전류공사',
      modelAS02: '시공사하자',
      modelAS03: '일반하자',
      textareaValue: '주방 수전 사용시 헤드부분 누수',

      // 작업내용
      dialogSendSMS: false,
      dialogFindAsMntnFlwCs: false,
      dialogFindAsIcpr: false,

      //업무종결 저장 레이어
      dialogUpdateFlwClose: false,


      isRunSave: false, //AS 접수 등록/수정중인지 여부.


      URG_FLW_YN: '', //긴급AS여부


      validateRules: {
        CVPR_NM: [
          v => !!v || '접수자는 필수 항목 입니다.',
          v => (v && v.length <=5) || '접수자명이 5자를 초과할 수 없습니다.',
        ],
        MBL_NO: [
          v => !!v || '연락처는 필수 항목 입니다.',
        ],
        FLW_DS_CD: [
          v => !!v || 'AS구분은 필수 선택 항목 입니다.',
        ],
        LCLS_CD: [
          v => !!v || '시설구분은 필수 선택 항목 입니다.',
        ],
        SPCE_CD: [
          v => !!v || '공간은 필수 선택 항목 입니다.',
        ],
        FLW_CTS: [
          v => !!v || 'AS 내용은 필수 항목 입니다.',
        ],
        MNTN_FLW_CS_CD: [
          v => !!v || '공종은 필수 항목 입니다.',
        ],
        ICPR_EMPNM: [
          v => !!v || '담당자는 필수 항목 입니다.',
        ],
        PASS: [
        v => true,
        ]
      },


      validateRulesFlwClose: {
        AGR_MPBL_RSN: [
          v => !!v || '업무종결 내용은 필수 항목 입니다.',
        ],
      },

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          UPDATE_FLW_ACP : {alertDialogToggle: true, msg: '수정하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.updateFlwAcp, callNo: this.closeMsg}
          , UPDATE_FLW_PUSH : {alertDialogToggle: true, msg: '콜센터 독촉 진행 하시겠습니까? 진행 시 다시 되돌릴 수 없습니다.', iconClass: 'is-info', type: 'confirm', callYes: this.updateFlwPush, callNo: this.closeMsg}
          , UPDATE_FLW_CLOSE : {alertDialogToggle: true, msg: '업무종결 처리하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.updateFlwClose, callNo: this.closeMsg}
          
        },
        ALERT : {
          REQUIRED_V_FLW_ACP_SN: {alertDialogToggle: true, msg: 'AS접수 내역을 선택해주세요.', iconClass: 'is-info', type: 'default'}
        },
        TOAST : {
          SUCCESS: {  msg: '정상 처리되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
      }

    }
  },
  mounted() {
  },
  async created() {
    if(this.DataProp && this.DataProp.histType) {
      this.histType = this.DataProp.histType;
    } else {
      this.histType = "NEW";
    }
    console.log("created this.histType", this.histType)

    console.log("USER_TYPE", this.USER_TYPE, this.USER_DETAIL_TYPE, this.USER_ID, this.DEPT_ID)
    this.getAsLclsCode();
    this.getAsFlwDsCdCode();

    this.CUST_INFO = this.CustInfoProp ? this.CustInfoProp : this.CUST_INFO_INIT;
    console.log("created====================", this.DataProp)
    if(this.DataProp && this.DataProp.ARA_HDQ_CD) {
      await this.getNewFlwAcpDetail();

      this.changeFlwDsCd();

      this.getAsMntnSpceCode(this.FLW_ACP_INFO.LCLS_CD)
      if(this.histType == "NEW") {
        this.changeSpceCd()
      } else {
        this.getAsMclsCode();
        this.changeMclsCd()
        this.changeSclsCd()
      }
    }
    
    this.setAuth();
  },
  computed: {
  },
  watch: {
    CustInfoProp() {
      this.CUST_INFO = this.CustInfoProp ? this.CustInfoProp : this.CUST_INFO_INIT;
      console.log("watch CustInfoProp this.CUST_INFO.PHN_CUTT_ID", this.CUST_INFO, this.CUST_INFO.PHN_CUTT_ID)
    }
  },
  methods: {
    //권한 설정
    setAuth() {
      const today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)// 현재일
      const isAdmin = this.USER_TYPE == "ETC_ADMIN" && (this.USER_DETAIL_TYPE == "SUPER_ADMIN" || this.USER_DETAIL_TYPE == "SYS_ADMIN") ? true : false; // 관리자 여부
      const isCnsltStaff = this.USER_TYPE == "LEADER" ? true : false; // 팀장 여부
      const isCnsltAgent = this.USER_TYPE == "MANAGER" ? true : false; // 상담사 여부
      const isAcpt = this.FLW_ACP_INFO.FLW_PGRS_SS_CD == "10" || this.FLW_ACP_INFO.FLW_PGRS_SS_CD == "20" ? true : false;//접수 상태 여부
      const isToday = this.FLW_ACP_INFO.FLW_RGS_DT == today ? true : false; // 당일건 여부
      const isMine = this.USER_ID == this.FLW_ACP_INFO.FST_RGS_ID ? true : false; // 본인건 여부
      const isDept = this.CUST_INFO.RCPT_DEPT_ID ==  this.DEPT_ID ? true : false; //본인팀여부
      console.log("isDept", this.CUST_INFO.RCPT_DEPT_ID, this.DEPT_ID)
      console.log("isAdmin", isAdmin, "isCnsltStaff", isCnsltStaff, "isCnsltAgent", isCnsltAgent, "isAcpt", isAcpt, "isToday", isToday, "isMine", isMine, "isDept", isDept)
      
      // 전체 수정 (관리자(팀장제외) && 접수건) or (팀장/팀리더상담사 && 팀여부 && 접수건) or (상담사 && 당일건 && 본인건)
      if ((isAdmin && isAcpt && !isCnsltStaff) || (isCnsltStaff && isDept && isAcpt) || (isCnsltAgent && isAcpt && isToday && isMine)) {
        //AS구분 수정 제외, 보수구분 수정 제외
        this.updateType = "ALL";
      }
      // 접수자, 연락처만 수정 가능 (관리자 && 접수 이외건)
      else if (isAdmin && !isAcpt) {
        this.updateType = "SIMPLE";
       
      }
      // 수정 불가 (상담사 && (지난 접수건 || 본인건 아님))
      else {
        this.updateType = "NONE";
      }
      //this.updateType = "SIMPLE";
      console.log("this.updateType", this.updateType);
    },


    getResponseData (response, strHeadText = "선택") {
      let responseData = [];
      if(!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
              responseData.push({text: item.CD_NM, value: item.CD})
          });
      }
      
      //전체, 선택 등 값이 있다면 추가.
      if (strHeadText != "" && strHeadText != undefined) {
          responseData.unshift({ text: strHeadText, value: "" });
      }
      return responseData;
    },
    //바로처리 공통 코드 목록 조회
    async getAsCommonCode(grpCd, cdIn = [], useYn = "Y") {
        const postParam = {
            GRP_CD: grpCd,
            CD_IN: cdIn,
            USE_YN: useYn,
        };
        const headParam = {head: {}};
        const response = await this.common_postCall("/phone-api/as/common/selectCotisCmnCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        return responseData;
    },

    //AS 구분 코드 조회
    async getAsFlwDsCdCode() {
      this.FLW_DS_CD_LIST = await this.getAsCommonCode("FLW_DS_CD", ['10','20','60'], "Y")
    },

    //바로처리 시설구분 코드 목록 조회
    async getAsLclsCode() {
        const postParam = {};
        const headParam = {head: {}};
        const response = await this.common_postCall("/phone-api/as/common/selectCotisLclsCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        this.LCLS_CD_LIST = responseData;
    },

    //(구)중분류 코드 목록 조회
    async getAsMclsCode() {
      const postParam = {
        LCLS_CD: this.FLW_ACP_INFO.LCLS_CD
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMclsCdList", postParam, headParam);
      const responseData = this.getResponseData(response);
      this.MCLS_CD_LIST = responseData;
    },

    //(구)소분류 코드 목록 조회
    async getAsSclsCode() {
      const postParam = {
        MCLS_CD: this.FLW_ACP_INFO.MCLS_CD
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisSclsCdList", postParam, headParam);
      const responseData = this.getResponseData(response);
      return responseData;
    },

    //(구)세분류 코드 목록 조회
    async getAsDclsCode() {
      const postParam = {
        SCLS_CD: this.FLW_ACP_INFO.SCLS_CD
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisDclsCdList", postParam, headParam);
      const responseData = this.getResponseData(response);
      return responseData;
    },

    //바로처리 공간 코드 목록 조회(신 , 구 조회 쿼리 다름)
    async getAsMntnSpceCode(lclsCd) {
      if(this.histType == "NEW") {
        const postParam = {
            LCLS_CD: lclsCd
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnSpceCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        this.SPCE_CD_LIST = responseData;
      } else {
        this.SPCE_CD_LIST = await this.getAsCommonCode("SPCE_CD", [], "Y")
      }
        

        
    },


    //시설구분 변경 시 공간 코드 조회
    async changeLclsCd(item) {
      this.FLW_ACP_INFO.SPCE_CD = '';
      this.FLW_ACP_INFO.MNTN_FLW_CS_CD = '';
      this.SPCE_CD_LIST = await this.getAsMntnSpceCode(item, "선택")
    },


    //AS구분 변경 시 이벤트(선택 항목별 보수구분 조회, 시공사 하자 선택 시 보수지시 다이얼로그 오픈)
    async changeFlwDsCd(item) {
      if(item) {
        this.FLW_ACP_INFO.FLW_DTL_DS_CD = '';
        //시공사 하자 정보 초기화
        this.FLW_ACP_INFO.PRCR_ID = '';
        this.FLW_ACP_INFO.FRM_NM = '';
        this.FLW_ACP_INFO.PRCR_TLNO = '';
        this.FLW_ACP_INFO.SPPB_TLNO = '';
        this.FLW_ACP_INFO.FRM_CD = '';
        this.FLW_ACP_INFO.FLW_PGRS_SS_CD = '10'; //접수
        this.FLW_ACP_INFO.RPR_XPC_DT = '';
      }
      
      this.FLW_DTL_DS_CD_LIST = [];

      item = this.FLW_ACP_INFO.FLW_DS_CD;

      if(item === "20" && (this.FLW_ACP_INFO.ARA_HDQ_CD == '' || this.FLW_ACP_INFO.MGOF_CD == '')) {
        this.FLW_ACP_INFO.FLW_DS_CD = '';
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_CD);
        return
      }
      
      //보수구분 조회
      if(item == '10' || item == '20' || item == '60' || item == '90') {
        let cdGrp;
        if(item == '10') {
          cdGrp = ["10","20"]
        } else if(item == '20' || item == '60' || item == '90') {
          cdGrp = ["60","70", "80"]
        }
        if(cdGrp && cdGrp.length > 0) {
          this.FLW_DTL_DS_CD_LIST = await this.getAsCommonCode("FLW_DTL_DS_CD", cdGrp)
        }
      }
      
      // //시공사하자 선택 시 보수지시 다이얼로그 오픈
      // item === '20' ? this.openFindAsAdmFrm() : ''
    },

    //공간 선택 시, 공종 목록 조회
    async changeSpceCd(item) {
      if(item) {
        this.FLW_ACP_INFO.MNTN_FLW_CS_CD = '';
      }
      this.MNTN_FLW_CS_CD_LIST = [];

      //시설, 공간 필수 항목 조회
      if(this.FLW_ACP_INFO.LCLS_CD == '' || this.FLW_ACP_INFO.SPCE_CD == '') {
        return;
      }
      //시설구분 + 공간 값으로 공종 조회.
      let postParam = {
        LCLS_CD: this.FLW_ACP_INFO.LCLS_CD,
        MNTN_SPCE_CD: this.FLW_ACP_INFO.SPCE_CD,
        INCLUDE_MNTN_FLW_CS_CD: this.FLW_ACP_INFO.MNTN_FLW_CS_CD //현재 사용되지 않는 공종일 경우 출력되지 않아 강제로 포함시켜서 조회 처리.
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      
      //MMA_유지하자분류관리(공종) 코드 조회
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnFlwCsCdList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.MNTN_FLW_CS_CD_LIST = response.DATA;
        this.MNTN_FLW_CS_CD_LIST.map(item => {
          item.text = item.REON_MTRL_NM + ' - ' + item.MNTN_FLW_TP_NM + ' - ' + item.MNTN_CSTP_NM + ' - ' + item.MNTN_CON_NM;
          item.value = item.MNTN_FLW_CS_CD;
        })
      }
    },


    //(구) 중분류 선택 시 - 소분류 목록 조회
    async changeMclsCd(item) {
      if(item) {
        this.FLW_ACP_INFO.SCLS_CD = '';
        this.FLW_ACP_INFO.DCLS_CD = '';
        this.SCLS_CD_LIST = [];
        this.DCLS_CD_LIST = [];
      }
      this.SCLS_CD_LIST = await this.getAsSclsCode();
    },

    //(구) 소분류 선택 시 - 세분류 목록 조회
    async changeSclsCd(item) {
      if(item) {
        this.FLW_ACP_INFO.DCLS_CD = '';
        this.DCLS_CD_LIST = [];
      }
      this.DCLS_CD_LIST = await this.getAsDclsCode();
    },

    clickMntnFlwCsCd() {
      if(this.FLW_ACP_INFO.LCLS_CD == '' || this.FLW_ACP_INFO.SPCE_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_LCLS_SPCE_CD);
        return;
      }
    },

    //담당자 찾기 다이얼로그 오픈
    openFindAsIcpr() {
      if(this.FLW_ACP_INFO.ARA_HDQ_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_CD);
        return
      }
      this.FLW_ACP_INFO.MNTN_USR_DS_CD = "050";
      
      // AS구분이 유지보수인 경우
      if(this.FLW_ACP_INFO.FLW_DS_CD == "10") {  
        this.FLW_ACP_INFO.MNTN_USR_DS_CD = "bothcd";
      }
      this.mixin_showDialog('FindAsIcpr')
    },


    async getNewFlwAcpDetail() {
      const postParam = {
        HIST_TYPE: this.histType,
        ARA_HDQ_CD : this.DataProp && this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : '',
        FLW_RGS_DT : this.DataProp && this.DataProp.FLW_RGS_DT ? this.DataProp.FLW_RGS_DT : '',
        FLW_ACP_SN : this.DataProp && this.DataProp.FLW_ACP_SN ? this.DataProp.FLW_ACP_SN : '',
        FLW_DTL_SN : this.DataProp && this.DataProp.FLW_DTL_SN ? this.DataProp.FLW_DTL_SN : '',
        MGOF_CD : this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '',
        HNO : this.DataProp && this.DataProp.HNO ? this.DataProp.HNO : '',
      };
      console.log("CompoAsFlwAcpDetail_SUBTAB01 selectCotisFlwAcpDetail", postParam)
      if(postParam.ARA_HDQ_CD == '') {
        //this.showAlertInfo({msg: "상세 조회를 위한 필수 정보가 없습니다.(운영 데이터는2024.09.10 까지의 데이터만 정상 조회됩니다.)"})
        return false;
      }
      
      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/flwacp/selectCotisFlwAcpDetail", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          let tempItem = response.DATA[0];
          tempItem.FLW_DTL_FULL_SN = tempItem.ARA_HDQ_CD + "-" + tempItem.FLW_RGS_DT + "-" + tempItem.FLW_ACP_SN + "-" + tempItem.FLW_DTL_SN;
          
          tempItem.BLDG_NO = tempItem.BLDG_NO ? tempItem.BLDG_NO.replace(/\D/g, "") : '';
          tempItem.HS_NO = tempItem.HS_NO ? tempItem.HS_NO.replace(/\D/g, "") : '';

          tempItem.FLW_RGS_DT = this.mixin_convertDate(tempItem.FLW_RGS_DT, 'yyyy-MM-dd')
          tempItem.MBL_NO = this.mixin_setPhoneNo(tempItem.MBL_NO);
          tempItem.PRCR_TLNO = this.mixin_setPhoneNo(tempItem.PRCR_TLNO);

          tempItem.JOB_ICPR_EMPNM = tempItem.ICPR_EMPNM
          tempItem.JOB_FRM_NM = tempItem.FRM_NM
          tempItem.TDN_DT = this.mixin_convertDate(tempItem.TDN_DT, 'yyyy-MM-dd')
          tempItem.TDN_RSN = tempItem.TDN_RSN && tempItem.TDN_RSN.trim() != "" ?  tempItem.TDN_RSN : tempItem.AGR_MPBL_RSN;
          tempItem.TRAN_HDQ_DT = this.mixin_convertDate(tempItem.TRAN_HDQ_DT, 'yyyy-MM-dd')
          tempItem.RPR_NSTC_DT = this.mixin_convertDate(tempItem.RPR_NSTC_DT, 'yyyy-MM-dd')
          tempItem.VST_DT = this.mixin_convertDate(tempItem.VST_FIR_DT, 'yyyy-MM-dd') + " / " + this.mixin_convertDate(tempItem.VST_SEC_DT, 'yyyy-MM-dd') + " / " + this.mixin_convertDate(tempItem.VST_THI_DT, 'yyyy-MM-dd') + (tempItem.VST_RMK && tempItem.VST_RMK != "" ? " (" + tempItem.VST_RMK + ")" : "" )
          
          tempItem.RPR_XPC_DT = this.mixin_convertDate(tempItem.RPR_XPC_DT, 'yyyy-MM-dd')
          tempItem.RPR_CMPL_RPT_DT = this.mixin_convertDate(tempItem.RPR_CMPL_RPT_DT, 'yyyy-MM-dd')
          tempItem.RPR_CMPL_DT = this.mixin_convertDate(tempItem.RPR_CMPL_DT, 'yyyy-MM-dd')

          tempItem.LST_CHG_DT = (tempItem.LST_CHG_DT ? tempItem.LST_CHG_DT : '') + (tempItem.LST_CHG_NM && tempItem.LST_CHG_NM != "" ? " (" + tempItem.LST_CHG_NM + ")" : "");

          if (tempItem.FLW_DS_CD != "20") {
            tempItem.FRM_CD = '';
            tempItem.FRM_NM = '';
          }

          tempItem.LAST_RPR_DATE = (new Date(Date.now() - (15 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)// 현재일 기준 15일 이전 날짜 계산
          
          this.FLW_ACP_INFO = tempItem;
          await this.getRcvSchedulerStatus();
          this.$emit("setFlwAcpInfo", this.FLW_ACP_INFO);
        }
      }
    },

    //독촉버튼
    btnUpdateFlwPush() {
      
      const flwPgrsSsCd = this.FLW_ACP_INFO.FLW_PGRS_SS_CD;
      if(this.FLW_ACP_INFO.V_FLW_ACP_SN == "") {
        this.showAlert({alertDialogToggle: true, msg: "AS접수 내역을 선택해주세요.", iconClass: 'is-info', type: 'default'});
        return;
      }
      // 10.유지보수 접수건만 진행
      else if (this.FLW_ACP_INFO.FLW_DS_CD != "10") {
        this.showAlert({alertDialogToggle: true, msg: "콜센터 독촉 대상건이 아닙니다. 재 확인 바랍니다.1", iconClass: 'is-info', type: 'default'});
        return;
      }
      // 51.보수처리중  52.보수독촉1회 53.보수독촉2회 아닌것
      else if (flwPgrsSsCd == "10" || flwPgrsSsCd == "11" || flwPgrsSsCd == "20" || flwPgrsSsCd == "25" ||
      flwPgrsSsCd == "30" || flwPgrsSsCd == "40" || flwPgrsSsCd == "45" || flwPgrsSsCd == "47" ||
      flwPgrsSsCd == "53" || flwPgrsSsCd == "60" || flwPgrsSsCd == "70" || flwPgrsSsCd == "80" ||
      flwPgrsSsCd == "90" || flwPgrsSsCd == "91" || flwPgrsSsCd == "99") {
        this.showAlert({alertDialogToggle: true, msg: "콜센터 독촉 대상건이 아닙니다. 재 확인 바랍니다.2", iconClass: 'is-info', type: 'default'});
        return;
      }
      // 보수지시일 기준 15일 계산 확인
      else if (this.FLW_ACP_INFO.RPR_NSTC_DT > this.FLW_ACP_INFO.LAST_RPR_DATE) {
        this.showAlert({alertDialogToggle: true, msg: "지시일로부터 15일이 경과되지 않았습니다. 재 확인 바랍니다.", iconClass: 'is-info', type: 'default'});
        return false;
      }

      console.log("btnFlwPush", flwPgrsSsCd, this.FLW_ACP_INFO.FLW_DS_CD, this.FLW_ACP_INFO.RPR_NSTC_DT, this.FLW_ACP_INFO.LAST_RPR_DATE)
      
      this.showAlert(this.MESSAGE.CONFIRM.UPDATE_FLW_PUSH);
    },

    //독촉 처리
    async updateFlwPush() {
      if (this.FLW_ACP_INFO.MNTN_FLW_CS_CD != '') {
        const spceNm = this.SPCE_CD_LIST.filter(item => item.value == this.FLW_ACP_INFO.SPCE_CD)[0].text;
        const mntnFlwCsNm = this.MNTN_FLW_CS_CD_LIST.filter(item => item.value == this.FLW_ACP_INFO.MNTN_FLW_CS_CD)[0].text;
        this.FLW_ACP_INFO.MSG_FLW_NM = spceNm + "/" + mntnFlwCsNm.split(' - ')[0] + "/" + mntnFlwCsNm.split(' - ')[3];
        console.log("카카오알림톡 공종이름(공간/부위자재/공사) ::: ", spceNm, mntnFlwCsNm, this.FLW_ACP_INFO.MSG_FLW_NM)
      }
      const postParam = {
        ARA_HDQ_CD: this.FLW_ACP_INFO.ARA_HDQ_CD,
		    FLW_RGS_DT: this.FLW_ACP_INFO.FLW_RGS_DT.replace(/-/g, ""),
		    FLW_ACP_SN: this.FLW_ACP_INFO.FLW_ACP_SN,
		    FLW_DTL_SN: this.FLW_ACP_INFO.FLW_DTL_SN,
        HP_NO: this.FLW_ACP_INFO.PRCR_TLNO ? this.FLW_ACP_INFO.PRCR_TLNO.replace(/\D/g, "") : '',
        MGOF_NM: this.FLW_ACP_INFO.MGOF_NM,
        BLDG_NO: this.FLW_ACP_INFO.BLDG_NO,
        HS_NO: this.FLW_ACP_INFO.HS_NO,
        MSG_FLW_NM:  this.FLW_ACP_INFO.MSG_FLW_NM,// 카카오알림톡 공종이름
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/flwacp/updateCotisFlwPush", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.getNewFlwAcpDetail();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
      }
    },


    //업무종결 레이어 오픈
    openFormUpdateFlwClose() {
      if (!(this.USER_TYPE == "LEADER" || this.USER_DETAIL_TYPE == "SUPER_ADMIN" || this.USER_DETAIL_TYPE == "SYS_ADMIN")) {
        this.showAlert({alertDialogToggle: true, msg: "업무종결 권한이 없습니다. - 권한자 : 시스템관리자 / 상담팀장", iconClass: 'is-info', type: 'default'});
        return
      }
    
      if (this.FLW_ACP_INFO && this.FLW_ACP_INFO.V_FLW_ACP_SN && this.FLW_ACP_INFO.V_FLW_ACP_SN == "") {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_V_FLW_ACP_SN);
        return
      }

      const today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      this.AGR_MPBL_RSN = "[콜센터_업무종결 " + today.substring(5,7) + "월 " + today.substring(8,10) + "일]\n"
      this.dialogUpdateFlwClose = true;

    },

    //업무종결 레이어 - 저장 버튼
    btnUpdateFlwClose() {
      if(!this.$refs.flwCloseForm.validate()) {
        return false;
      };
      this.showAlert(this.MESSAGE.CONFIRM.UPDATE_FLW_CLOSE);
    },

    //업무종결 처리
    async updateFlwClose() {
      const postParam = {
        ARA_HDQ_CD: this.FLW_ACP_INFO.ARA_HDQ_CD,
		    FLW_RGS_DT: this.FLW_ACP_INFO.FLW_RGS_DT.replace(/-/g, ""),
		    FLW_ACP_SN: this.FLW_ACP_INFO.FLW_ACP_SN,
		    FLW_DTL_SN: this.FLW_ACP_INFO.FLW_DTL_SN,
        AGR_MPBL_RSN: this.AGR_MPBL_RSN
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/flwacp/updateCotisFlwClose", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.getNewFlwAcpDetail();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
      }
    },


    //업무종결 취소 버튼
    btnCancelFlwClose() {
      this.dialogUpdateFlwClose = false;
      setTimeout(() => {
        this.AGR_MPBL_RSN = '';
      }, 100);
      
    },


    //AS접수 수정 버튼
    btnUpdateFlwAcp() {
      if(this.updateType == 'NONE') {
        this.showAlert({alertDialogToggle: true, msg: "수정 권한이 없습니다.", iconClass: 'is-info', type: 'default'});
        return;
      }

      if (this.FLW_ACP_INFO && this.FLW_ACP_INFO.V_FLW_ACP_SN && this.FLW_ACP_INFO.V_FLW_ACP_SN == "") {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_V_FLW_ACP_SN);
        return
      }

      if(this.FLW_ACP_INFO.LCLS_CD == "3" && this.FLW_ACP_INFO.HNO == "") {
        this.showAlert({alertDialogToggle: true, msg: "해당단지는 cotis에 등록된 단지가 아닙니다.<br/>해당단지는 AS접수가 불가합니다.<br/>cotis에 등록요청해주세요(" + this.MGOF_CD + ")", iconClass: 'is-info', type: 'default'});
        return;
      }
      if(this.FLW_ACP_INFO.LCLS_CD == "2" && this.FLW_ACP_INFO.BLDG_ID == "") {
        this.showAlert({alertDialogToggle: true, msg: "해당단지는 cotis에 등록된 단지가 아닙니다.<br/>해당단지는 AS접수가 불가합니다.<br/>cotis에 등록요청해주세요(" + this.MGOF_CD + ")", iconClass: 'is-info', type: 'default'});
        return;
      }
      if(!this.CUST_INFO.PHN_CUTT_ID || this.CUST_INFO.PHN_CUTT_ID == "") {
        this.showAlert({alertDialogToggle: true, msg: "상담 번호가 존재하지 않습니다.", iconClass: 'is-info', type: 'default'});
        return;
      }
      if(!this.FLW_ACP_INFO.CVPR_NM || this.FLW_ACP_INFO.CVPR_NM == "") {
        this.showAlertInfo({msg: "고객명을 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.MBL_NO || this.FLW_ACP_INFO.MBL_NO == "") {
        this.showAlertInfo({msg: "연락처를 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.FLW_DS_CD || this.FLW_ACP_INFO.FLW_DS_CD == "") {
        this.showAlertInfo({msg: "AS구분을 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.FLW_DS_CD || this.FLW_ACP_INFO.FLW_DS_CD == "") {
        this.showAlertInfo({msg: "AS구분을 입력하셔야 합니다."});
        return;
      }
      if((this.FLW_ACP_INFO.FLW_DS_CD == "10" || this.FLW_ACP_INFO.FLW_DS_CD == "20" || this.FLW_ACP_INFO.FLW_DS_CD == "90") && this.FLW_ACP_INFO.FLW_DTL_DS_CD == "") {
        this.showAlertInfo({msg:"보수구분을 입력하셔야 합니다."});
        return false;
      }
      if(!this.FLW_ACP_INFO.LCLS_CD || this.FLW_ACP_INFO.LCLS_CD == "") {
        this.showAlertInfo({msg: "대분류를 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.SPCE_CD || this.FLW_ACP_INFO.SPCE_CD == "") {
        this.showAlertInfo({msg: "공간을 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.MNTN_FLW_CS_CD || this.FLW_ACP_INFO.MNTN_FLW_CS_CD == "") {
        this.showAlertInfo({msg: "공종을 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.FLW_CTS || this.FLW_ACP_INFO.FLW_CTS == "") {
        this.showAlertInfo({msg: "AS내용을 입력하셔야 합니다."});
        return;
      }
      if(!this.FLW_ACP_INFO.ICPR_EMPNM || this.FLW_ACP_INFO.ICPR_EMPNM == "") {
        this.showAlertInfo({msg: "지역본부담당자/관리소담당자정보를 입력하셔야 합니다."});
        return;
      }


      //validation rule check
      if (!this.detailValidateFlwAcp()) {
        
        return;
      }
      
      

      if(this.FLW_ACP_INFO.FLW_DS_CD == "20" || this.FLW_ACP_INFO.FLW_DS_CD == "90") { // 20:시공사AS  90:만료AS점검
        if(this.FLW_ACP_INFO.FRM_CD == "") {
          this.showAlert({alertDialogToggle: true, msg:"보수지시업체를 선택해 주세요.", iconClass: 'is-info', type: 'default', callAfter: this.openFindAsAdmFrm});
          return false;
        }
      }

      //AS 접수 등록중인지 여부(중복 클릭 방지)
      if(this.isRunSave) {
        this.showAlert({alertDialogToggle: true, msg:"AS 접수가 진행중 입니다.", iconClass: 'is-info', type: 'default'});
        return false;
      }

      this.showAlert(this.MESSAGE.CONFIRM.UPDATE_FLW_ACP);
    },

    //AS접수 상세 - 수정 처리
    async updateFlwAcp() {
      //AS접수 잠금
      this.isRunSave = true;

      //긴급AS여부
      // 상담유형 : AS(05080000) - AS접수(05080100) - 긴급(05080102)
      // if (this.CUST_INFO.CUTT_TYPE_ID == "05080102" && this.FLW_ACP_INFO.FLW_DS_CD == "20") {
      //   this.URG_FLW_YN = "Y";
      // }

      //필수
      let postParam = {
        ARA_HDQ_CD: this.FLW_ACP_INFO.ARA_HDQ_CD,
		    FLW_RGS_DT: this.FLW_ACP_INFO.FLW_RGS_DT,
		    FLW_ACP_SN: this.FLW_ACP_INFO.FLW_ACP_SN,
		    FLW_DTL_SN: this.FLW_ACP_INFO.FLW_DTL_SN,
        
        
        CVPR_NM: this.FLW_ACP_INFO.CVPR_NM,  //접수자
        MBL_NO: this.FLW_ACP_INFO.MBL_NO, //연락처
      }
      //업데이트 유형에 따른 추가 전달 항목
      if(this.updateType == "ALL") {
        postParam.SPCE_CD = this.FLW_ACP_INFO.SPCE_CD
        postParam.ICPR_EMPNO = this.FLW_ACP_INFO.ICPR_EMPNO
        postParam.ICPR_DEP_CD = this.FLW_ACP_INFO.ICPR_DEP_CD
        postParam.MNTN_FLW_CS_CD = this.FLW_ACP_INFO.MNTN_FLW_CS_CD
        postParam.FLW_CTS = this.FLW_ACP_INFO.FLW_CTS
        // postParam.URG_FLW_YN = this.URG_FLW_YN
      }

      console.log("updateFlwAcp.postParam", postParam)

      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/as/flwacp/updateFlwAcp', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.getNewFlwAcpDetail();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
      }

      this.isRunSave = false;
    },

    //validate check
    detailValidateFlwAcp () {
      return this.$refs.formFlwAcp.validate();
    },


    //validateRules의 rule 항목과 값을 받아 해당 항목의 rule이 true가 아닐 시 해당 메세지를 출력한다.
    //Rule을 순서대로 읽어와 먼저 rule을 위반하는 메세지를 showAlert으로 출력한다.
    //필수값 체크 메세지는 출력하지 않는다.(index:0)
    openValidationMessage(validateRulesItem, ruleValue, isShowInx0 = false) {
      try {
        validateRulesItem.map(
          (rule, index) => {
            const validValue = rule(ruleValue);
            if(validValue !== true) {
              //여러 rule 중 하나만 출력하기 위해 throw로 map 벗어남.
              if(index == 0 && isShowInx0 === false) {
                //필수값 메세지는 출력하지 않는다.(index:0)
                throw {isShow:false, message:validValue};
              } else {
                throw {isShow:true, message:validValue};
              }
            }
          }
        )
      } catch(e) {
        if(e.isShow) {
          this.showAlert({alertDialogToggle: true, msg: e.message, iconClass: 'is-caution', type: 'default'});
          return false;
        }
      }
      return true;
    },


    //공종 검색 다이얼로그 - 더블클릭으로 선택 시
    async setMntnFlwCs(item) {
      if(this.FLW_ACP_INFO.LCLS_CD != item.LCLS_CD) {
        this.FLW_ACP_INFO.LCLS_CD = item.LCLS_CD;
        this.SPCE_CD_LIST = await this.getAsMntnSpceCode(this.FLW_ACP_INFO.LCLS_CD, "선택")
      }
      if(this.FLW_ACP_INFO.SPCE_CD != item.MNTN_SPCE_CD) {
        this.FLW_ACP_INFO.SPCE_CD = item.MNTN_SPCE_CD;
        await this.changeSpceCd();
      }
      this.FLW_ACP_INFO.MNTN_FLW_CS_CD = item.MNTN_FLW_CS_CD;
      this.mixin_hideDialog('FindAsMntnFlwCs')
    },

    //담당자 검색 다이얼로그 - 더블클릭으로 선택 시
    setIcpr(item) {
      this.FLW_ACP_INFO.ICPR_EMPNO = item.USR_ID;
      this.FLW_ACP_INFO.ICPR_EMPNM = item.USR_NM;
      
      if(item.DEP_CD_D) {
        this.FLW_ACP_INFO.ICPR_DEP_CD = item.DEP_CD_D;
      }
      if(item.MBL_NO) {
        this.FLW_ACP_INFO.MBL_NO = item.MBL_NO;
      }

      if(item.SPPB_TLNO) {
        this.FLW_ACP_INFO.SPPB_TLNO = item.SPPB_TLNO;
      }

      

      if(item.MNTN_USR_DS_CD && item.MNTN_USR_DS_CD == "050"){ // 담당자구분 050:지역본부담당자
        this.FLW_ACP_INFO.FLW_PGRS_SS_CD = "20"; // 처리상태코드 20 : 접수(이관)
      } else {
         this.FLW_ACP_INFO.FLW_PGRS_SS_CD = "10"; // 처리상태코드 10 : 접수
      }
      
      this.mixin_hideDialog('FindAsIcpr')
    },
    

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

    //스케줄러 진행현황 조회
    async getRcvSchedulerStatus() {
      const postParam = {
        FLW_DTL_FULL_SN: this.FLW_ACP_INFO.FLW_DTL_FULL_SN,
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper'
          }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectCallRcvSchedulerStatus", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          this.FLW_ACP_INFO.SMS_DIST_EMP_NM = response.DATA[0].EMP_NM;
        }
      }
    },

    showSidePanel(name){
      
      let smsInfo = {
        CUST_PHN_NO: this.FLW_ACP_INFO.PRCR_TLNO,
        SRC: 'FLAW_DETAIL',
        
      };
      if(this.FLW_ACP_INFO && this.FLW_ACP_INFO.V_FLW_ACP_SN) {
        const mgofTpCd = this.FLW_ACP_INFO.MGOF_TP_CD;
        const smsFlwInfo = {
          V_FLW_ACP_SN: this.FLW_ACP_INFO.V_FLW_ACP_SN,
          CVPR_NM: this.FLW_ACP_INFO.CVPR_NM,
          MBL_NO: this.FLW_ACP_INFO.MBL_NO,
          MGOF_NM: (mgofTpCd == '16' || mgofTpCd == '17' || mgofTpCd == '18' || mgofTpCd == '16,29') ? this.FLW_ACP_INFO.BLDG_ADR : this.FLW_ACP_INFO.MGOF_NM,
          BLDG_NO: this.FLW_ACP_INFO.BLDG_NO,
          HS_NO: this.FLW_ACP_INFO.HS_NO,
          FLW_CTS: this.FLW_ACP_INFO.FLW_CTS,
          JOB_FRM_NM: this.FLW_ACP_INFO.JOB_FRM_NM,
          BLDG_ADR: this.FLW_ACP_INFO.BLDG_ADR,
          DIST_EMP_NM: this.FLW_ACP_INFO.SMS_DIST_EMP_NM,
        }
        smsInfo = {...smsInfo, ...smsFlwInfo};
      }

      this.$eventBus.$emit('setSidePanelCustInfo', smsInfo);
      if(name.includes('slide')){
        this.$eventBus.$emit('clearVSlideXreverse');
        this.$eventBus.$emit('showRightSlide', {ACT_NM: 'slideEmailSend', active:false});
      }else{
          this.$eventBus.$emit('showRightDialog', {dialogNm : name})
      }
    }

    
  },
};
</script>

<style lang="scss" scoped>

</style>