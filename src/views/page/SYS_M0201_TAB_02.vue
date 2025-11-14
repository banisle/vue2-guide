<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <!-- 신규 -->
      <div class="pl-form-inline">
        <span class="pl-label">
          <v-checkbox
            class="pl-check ml-2"
            label="LH적용일"
            v-model="SRCH_USER_PARAM.DATE_CHK"
          >
          </v-checkbox>
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
            :StartDayProp.sync="SRCH_USER_PARAM.ST_DT"
            :EndDayProp.sync="SRCH_USER_PARAM.END_DT"
            @startDayChange="mixin_testLog(SRCH_USER_PARAM.ST_DT)"
            @endDayChange="mixin_testLog(SRCH_USER_PARAM.END_DT)"
            ParentStyleProp="width: 306px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          조직그룹
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="combo_custco_list"
            v-model="SRCH_USER_PARAM.CUSTCO"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터/소속
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="CENTER_LIST"
            v-model="SRCH_USER_PARAM.CENTER"
            @change="chgCenter()"
          ></v-select>
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="DEPT_LIST"
            v-model="SRCH_USER_PARAM.DEPT_ID"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          성명
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="SRCH_USER_PARAM.USER_NM"
            class="pl-form type-middle"
            style="width:100px"
            @keydown.enter="srchUser()"
          ></v-text-field>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          사번
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="SRCH_USER_PARAM.LGN_ID"
            class="pl-form type-middle"
            style="width:100px"
            @keydown.enter="srchUser()"
          ></v-text-field>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          내선
        </span>
<!--        <div class="pl-label ">-->
<!--          <v-select-->
<!--              class="pl-form type-middle is-sm"-->
<!--              :items="SRCH_LIST"-->
<!--              item-text="text"-->
<!--              item-value="value"-->
<!--              v-model="SRCH_USER_PARAM.SRCH_NO_TYPE"-->
<!--              @change="()=>{-->
<!--                SRCH_USER_PARAM.EXT_NO = '';-->
<!--                SRCH_USER_PARAM.SRCH_USER_ID = '';-->
<!--              }"-->
<!--          ></v-select>-->
<!--        </div>-->
        <div class="pl-desc">
          <v-text-field
            v-model="SRCH_USER_PARAM.EXT_NO"
            class="pl-form type-middle"
            style="width:100px"
            @keydown.enter="srchUser()"
          ></v-text-field>
<!--          <v-text-field
            :v-model="SRCH_USER_PARAM.SRCH_NO_TYPE ==='EXT_NO' ? SRCH_USER_PARAM.EXT_NO : SRCH_USER_PARAM.USER_ID"
            class="pl-form type-middle"
            @keydown.enter="srchUser()"
          ></v-text-field>-->
        </div>
      </div>
      <div>
        <v-btn
            class="pl-btn is-icon"
            @click="srchUser()"
        >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <!-- 상세  -->
        <!-- <v-tooltip content-class="pl-tooltip bottom" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-menu
              min-width="450"
              bottom
              left
              offset-y
              :close-on-content-click=false
              content-class="pl-menu-drop pa-0"
              v-model="dropDetail"
            >
              <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                <v-btn
                  v-bind="menuAttrs"
                  v-on="menuOn"
                  class="pl-tooltip-btn ml-1"
                  min-width="30"
                  height="30"
                  plain
                  >
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    class="pl-icon20 detail"></v-icon>
                </v-btn>
              </template>
              <div class="">
                <div class="d-flex align-center pl-card">
                  <div class="pl-subtit">상세 검색</div>
                  <v-btn
                    @click="dropDetail = false"
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
                <div class="pl-card">
                  <div class="pl-form-inline-wrap vertical gap-8 label-80">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        인입번호
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form type-middle"
                          placeholder="전화번호 입력"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        고객 ID
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form type-middle"
                          placeholder="고객 ID 입력"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        상담번호
                      </span>
                      <div class="pl-desc">
                        <v-select
                          class="pl-form type-middle"
                          placeholder="상담번호 입력"
                        ></v-select>
                      </div>
                    </div>
                    <div class="pl-form-inline ">
                      <span class="pl-label">
                        티켓 ID
                      </span>
                      <div class="pl-desc">
                        <v-select
                          class="pl-form type-middle"
                          placeholder="티켓 ID 입력"
                        ></v-select>
                      </div>
                    </div>

                    <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s">
                      <span class="pl-label">
                        상담지역
                      </span>
                      <div class="pl-desc">
                        <div class="flex-column spacing-wrap sp-8">
                          <v-select
                            class="pl-form type-middle is-auto"
                            placeholder="선택"
                          ></v-select>
                          <v-select
                            class="pl-form type-middle is-auto"
                            placeholder="선택"
                          ></v-select>
                          <v-select
                            class="pl-form type-middle is-auto"
                            placeholder="선택"
                          ></v-select>
                        </div>
                      </div>
                    </div>

                    <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s">
                      <span class="pl-label">
                        접속정보
                      </span>
                      <div class="pl-desc flex-column">
                        <v-select
                          class="pl-form type-middle is-auto"
                          placeholder="선택"
                        ></v-select>
                        <v-checkbox
                          class="pl-check align-self-start"
                          label="담당자 이관 여부"
                          input-value="true"
                        ></v-checkbox>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="is-border-top pl-btn-wrap pl-card ">
                  <v-btn class="pl-btn is-trans ml-auto" @click="dropDetail = false">닫기</v-btn>
                  <v-btn class="pl-btn">검색</v-btn>
                </div>

              </div>
            </v-menu>
          </template>
          <span>상세</span>
        </v-tooltip> -->
        <compo-tooltip-btn
          TitleProp="초기화"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="initSrch()"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left">
          <v-btn
              class="pl-btn is-icon is-trans"
              @click="openDialog('detail')"
              :disabled="CHK_USER_INFO_ITEM.USER_ID != undefined ? false : true"
          >
            <span
                class="pl-icon20 document"
            ></span>
            선택항목 상세
          </v-btn>
          <!-- <v-btn v-if=" mixin_set_btn(this.$options.name, 'btnUserReg') || $store.getters['userStore/GE_USER_ROLE'].userId == '4'" class="pl-btn is-icon is-trans" @click="[initRegParam(),openDialog('regist')]"> -->
          <v-btn class="pl-btn is-icon is-trans" @click="[initRegParam(),mixin_hideDialog('TransPart'),openDialog('regist')]">
            <span class="pl-icon20 circle-plus"></span>
            등록
          </v-btn>
          <v-btn 
            class="pl-btn is-icon is-trans" 
            :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true"
            @click="[mixin_hideDialog('RegDetail'),mixin_showDialog('TransPart')]">
            <span class="pl-icon20 person-move"></span>
            부서이동
          </v-btn>
          <v-btn class="pl-btn is-icon is-trans"
                  @click="resetBtn('reset')" :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true">
            <span class="pl-icon20 pass-reset"></span>
            비밀번호 초기화
          </v-btn>
          <v-btn
              class="pl-btn is-icon is-trans"
              @click="resetBtn('unlock')"
              :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true"
          >
          <!-- v-if="this.mixin_set_btn(this.$options.name, 'BtnUnlockUser')" -->
            <span class="pl-icon20 unlock"></span>
            잠금 해제
          </v-btn>
          <v-btn class="pl-btn is-icon is-trans"
                  @click="forceResetPwd()" :disabled="CHK_USER_GRID_ITEMS.length != 0 ? false : true">
            <span class="pl-icon20 pass-reset"></span>
            강제 비밀번호 변경
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1">({{ USER_GRID_ITEMS_TOT_CNT }})</em> 건</span>
        </div>
      </div>
      <v-data-table
          v-model="CHK_USER_GRID_ITEMS"
          class="pl-grid has-control is-mt-s is-hover"
          show-select
          :headers="headers"
          :items="USER_GRID_ITEMS"
          :item-class="isActiveRow"
          :single-select="true"
          fixed-header
          item-key="ROW_NUMBER"
          height="calc(100vh - 350px)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          @click:row="rowSelect"
          @dblclick:row="[rowSelect,openDialog('detail')]"
          no-data-text="등록된 데이터가 없습니다."
      >
        <!-- 소속 툴팁 -->
        <template v-slot:item.DEPT_WHOL_PATH="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.DEPT_WHOL_PATH }}</span>
            </template>
            <span>{{ item.DEPT_WHOL_PATH }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <div class="pl-pager">
        <div class="pl-pager-row">
          <span>페이지당 항목 수</span>
          <v-select
              class="pl-form type-middle"
              :value="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt($event, 10);"
          ></v-select>
        </div>
        <v-pagination
            v-model="page"
            :length="pageCount"
            circle
            :total-visible="7">
        </v-pagination>

        <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(USER_GRID_ITEMS, page) }} / {{ USER_GRID_ITEMS.length }}
              <compo-tooltip-btn
                  TitleProp="다음 검색"
                  ClassProp="pl-tooltip-btn is-line"
                  IconProp="pl-icon20 arrow-next-paging"
                  TooltipPositionProp="bottom"
                  :DisabledProp="nextDisabled"
                  @btnClick="srchUser('next')"
              ></compo-tooltip-btn>
        </span>
      </div>
    </div>

    <!-- side panel: 상세정보 -->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        style="width: 750px;"
        :style="tempCenterStyle"
        v-if=" dialogRegDetail === true ">
        <div class="pl-quick-layer-header"><h1>{{USER_PARAMS.REG_YN === 'N' ? '사용자 등록':'직원 상세 정보'}}</h1>
          <!-- <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick=""
          ></compo-tooltip-btn> -->
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogRegDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- side contetl -->
        <SYS_M202_DIALOG_REG
          :CHK_USER_INFO_ITEM="CHK_USER_INFO_ITEM"
          :USER_DPNC_CHK="USER_DPNC_CHK"
          @Close="dialogRegDetail = false"
          @openTransDept="openTransDept"
          @dpcnChk="dpcnChk()"
          @strg_user="strg_user()"
        />

      </div>
    </v-slide-x-reverse-transition>

    <!-- dialog: 부서이동 -->
    <v-dialog
      v-model="dialogTransPart"
      width="350"
      content-class="pl-top-profile-dialog type-center"
      hide-overlay>
      <compo-dialog
        header-title="개인 정보"
        :HideCloseProp=false
        @hide="mixin_hideDialog('TransPart')"
      >
        <template slot="body">
          <SYS_M202_DIALOG_TRANS
            :USER_DEPT="USER_DEPT"
            :TRAN_USER_DEPT="TRAN_USER_DEPT"
            @Close="dialogTransPart = false"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans ml-auto" @click="dialogTransPart = false">닫기</v-btn>
          <v-btn class="pl-btn " @click="[tranUserDept(), dialogTransPart = false]">부서이동</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <v-dialog
        v-model="dialogForcePwdChange"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="강제 비밀번호 변경"
          @hide="closeBtn"
      >
        <template slot="body">
          <v-form ref="form">
            <div class="pl-form-inline-wrap vertical mt-2">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 0">
                  비밀번호
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    v-model="FORCE_PWD"
                    maxlength="100"
                    v-byte-counter="100"
                  />
                </div>
              </div>
            </div>
          </v-form>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="closeForcePwd">닫기</v-btn>
          <v-btn class="pl-btn" @click="forceResetValid">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import gibberish from "../../mixin/gibberish-aes_mixin";
import SYS_M202_DIALOG_REG from '@/views/page/SYS_M202_DIALOG_REG'
import SYS_M202_DIALOG_TRANS from '@/views/page/SYS_M202_DIALOG_TRANS'

export default {
  name: 'SYS_M0201_TAB_02', //조직상세
  mixins: [gibberish],
  components: {
    SYS_M202_DIALOG_REG,
    SYS_M202_DIALOG_TRANS
  },
  data() {
    return {
      common_ognz_list:[], //조직
      //search top
      common_code: [],
      common_code_global:[], //공통코드
      combo_custco_list: [],

      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dropDetail: false,

      CENTER_LIST:[],       //센터 리스트
      SRCH_LIST:[
        {text : '내선', value : 'EXT_NO'},
        {text : '사번', value : 'USER_ID'},
      ],       //센터 리스트
      DEPT_LIST:[],         //소속 리스트
      // 사용자 검색 조건
      SRCH_USER_PARAM: {
        DATE_CHK:false,
        ST_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        CUSTCO:'',    //조직그룹
        CENTER:'',    //센터
        DEPT:'',      //소속
        USER_NM:'',   //성명
        EXT_NO:'',   //내선번호
        SRCH_USER_ID:'',   //사번
        SRCH_NO_TYPE : 'EXT_NO'
      },
      //사용자 상세검색 조건
      SRCH_DTL_USER_PARAM: {
        IN_NO: '',      //인입번호
        CUST_ID: '',    //고객ID
        CUTT_ID:'',     //상담번호
        TICKET_ID:'',   //티켓ID
        SITE:'',        //상담지역
        LOG_INFO:'',    //접속정보
      },


      AUTHRT_GROUP_DROP: [],                // 권한 그룹 드롭박스
      AUTHRT_GROUP: '',                     // 권한 그룹

      USER_GRID_ITEMS: [],                 // 사용자정보 GRID ITEMS
      USER_GRID_ITEMS_TOT_CNT: 0,

      // 기존 사용자 정보
      USER_PARAMS: {
        USER_ID:'',

        USER_NM: '',                      //사용자 이름
        LGN_ID: '',                       //사용자 ID
        ORG_LGN_ID: '',                   //기존사용자 ID
        ENTER_DT:'',                      //입사일
        CALL_DT:'',                       //콜센터입사일
        LHCS_EMP_NO:'',                   //주거복지정보사번
        EMP_NO:'',                        //포털사번
        CUSTCO:'',                        //조직그룹
        ORG_CUSTCO:'',                    //기존조직그룹
        DEPT:'',                          //소속
        DEPT_NM:'',                       //소속명
        EPLMT_CD:'',                      //소속
        JBPS_CD:'',                       //직위
        DUTY_CD:'',                       //직급
        DUTY_GROUP_CD:'',                 //직무
        WORK_STTS_CD:'',                  //근무형태
        WORK_TYPE_CD:'',                  //근무유형
        TKCG_RGN_CD:'',                   //담담지역(코드)
        AUTHRT_GROUP:'',                  //권한그룹
        USER_STTS_CD:'',                  //재직여부
        RSGNTN_YMD:'',                    //퇴사일

        SOFT_PHN:'',                      //소프트폰 사용여부
        TRANS_PHN:'',                    //호전환 허용여부
        EXT_NO:'',                        //내선번호
        AGENT_ID:'',                      //AGENT ID
        ACD_GROUP:'',                     //ACD GROUP
        DSPTCH_NO:'',                     //발신번호
        CTI_STTS_CD:'',                   //CTI상태(코드)

        TKCG_TASK_CN: '',                 //담당업무
        TKCG_TASK_CN_EAI:'',              //EAI담당업무
        PHN_NO:'',                        //전화번호
        TEL_NO:'',                        //전화번호

        LH_APLCN_YMD:'',                  //LH적용일
        LH_APLCN_YMD_DD:'',               //LH적용일
        EAI_EXL:'',                       //EAI예외여부

        REG_YN: 'N',                      // 사용자 기등록여부(화면에서만사용)
      },
      USER_DPNC_CHK: false,
      treeItems: [],

      //dialog
      dialogRegDetail: false,
      dialogOrgTree: false,
      dialogTransPart: false,

      currentTime: '',
      startDate: '',
      endDate: '',

      USER_DEPT:{
        CUSTCO_ID:'',
        DEPT_ID:'',
        DEPT_NM:'',
        WORK_BGNG_YMD:'',
      },
      TRAN_USER_DEPT:{
        CUSTCO_ID:'',
        DEPT_ID:'',
        DEPT_NM:'',
        WORK_BGNG_YMD:'',
      },

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100, 500, 1000],
      ROW_PER_PAGE: 30,

      headers: [
        {text: '번호', value: 'ROW_NUMBER', width: '50px', align: 'center', },
        {text: '성명', value: 'USER_NM', width: '90px'},
        {text: '사번', value: 'EMP_NO', width: '80px'},
        {text: '소속', value: 'DEPT_WHOL_PATH', width: ''},
        {text: '직무', value: 'DUTY_GROUP_NM', width: '80px'},
        {text: '고용형태', value: 'EPLMT_CD_NM', width: '80px'},
        {text: '근무형태', value: 'WORK_STTS_CD_NM', width: '100px'},
        {text: '권한그룹', value: 'AUTHOR_GROUP_NM_LIST', width: '100px'},
        {text: '내선번호', value: 'EXT_NO', width: '80px', align: 'center',},
        {text: 'EAI예외', value: 'EAI_EXL_YN', width: '80px', align: 'center',},
        {text: '재직여부', value: 'USER_STTS_CD_NM', width: '80px', align: 'center',},
        {text: '비번오류', value: 'PSWD_FAIL_CNT', width: '80px', align: 'center', },
        {text: '수정일', value: 'MDFCN_DT_DD', width: '80px'},
        {text: 'LH적용일', value: 'NEW_LH_APLCN_YMD', width: '80px'},
      ],
      MESSAGE: {
        CONFIRM: {
          REGIST: {
            alertDialogToggle: true,
            msg: '사용자를 저장 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
          MODIFY: {
            alertDialogToggle: true,
            msg: '사용자 정보를 변경 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
          DELETE: {},
          RESET_PSWD: {
            alertDialogToggle: true,
            msg: "선택한 사용자의 비밀번호를<br> 초기화 하시겠습니까?",
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.resetPswdRtn,
            callNo: this.closeMsg
          },
          UNLOCK_PSWD: {
            alertDialogToggle: true,
            msg: "선택한 사용자의 잠금을 해제 <br>하시겠습니까?",
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.unlockPswdRtn,
            callNo: this.closeMsg
          },
          FORCE_RESET_PSWD: {
            alertDialogToggle: true,
            msg: "선택한 사용자의 비밀번호를<br> 변경 하시겠습니까?",
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.forceResetPwd,
            callNo: this.closeMsg
          },
        },
        ALERT: {
          ALREADY_EXIST: {alertDialogToggle: true, msg: '이미 사용중인 ID 입니다.', iconClass: 'is-caution', type: 'default'},
          USE_PSBLTY: {alertDialogToggle: true, msg: '사용 가능한 ID 입니다.', iconClass: 'is-done', type: 'default'},
          INVALID_LGN_ID: {alertDialogToggle: true, msg: '사용자 ID 중복체크를 해주세요.', iconClass: 'is-info', type: 'default'},
          OVER_LENG_ITEM: {alertDialogToggle: true, msg: '상세 보기는 한 건 씩만 가능합니다.', iconClass: 'is-info', type: 'default'},
          EMPTY_CHK_ITEM: {alertDialogToggle: true, msg: '사용자를 선택하세요.', iconClass: 'is-info', type: 'default'},
          REG_SUCCESS: {alertDialogToggle: true, msg: '처리되었습니다.', iconClass: 'is-done', type: 'default'},
          PSWD_FAIL_CNT_INVALID: {
            alertDialogToggle: true,
            msg: '계정이 잠긴 사용자만 해제할 수 있습니다.',
            iconClass: 'is-done',
            type: 'default'
          },
          RESET_PSWD_SUCCESS: {alertDialogToggle: true, msg: '처리되었습니다.', iconClass: 'is-done', type: 'default'},
          USER_CHECK_LIST_EMPTY: {alertDialogToggle: true, msg: '비밀번호를 변경할 사용자를 선택해 주세요.', iconClass: 'is-caution', type: 'default'},
          FORCE_PWD_EMPTY: {alertDialogToggle: true, msg: '비밀번호를 입력해 주세요.', iconClass: 'is-caution', type: 'default'},
          DUPL_AGENT_ID: {alertDialogToggle: true, msg: '이미 사용중인 AGENT_ID입니다.', iconClass: 'is-caution', type: 'default'},
          
          INVALID_DEPT_ID: {alertDialogToggle: true, msg: '소속은 필수입력항목입니다.', iconClass: 'is-caution', type: 'default'},
        },
        ERROR: {
          GET_USER_INFO_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 정보를 가져올 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
          GET_USER_LIST_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 리스트를 가져올 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
          REG_USER_FAIL: {alertDialogToggle: true, msg: '사용자 등록에 실패했습니다.', iconClass: 'is-caution', type: 'default'},
          GET_PSWD_ENC_KEY_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 등록에 실패했습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
          RESET_USER_PSWD_CHK: {alertDialogToggle: true, msg: '사용자를 선택하세요.', iconClass: 'is-caution', type: 'default'},
          RESET_USER_PSWD_FAIL: {alertDialogToggle: true, msg: '사용자를 선택하세요.', iconClass: 'is-caution', type: 'default'},
        },
        TOAST : {
          SUCCESS : {  msg: '처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      },

      //그리드 페이지속성정의
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled: false,
      rowCnt: 0,

      validateRules: {
        USER_NM: [
          v => !!v || '사용자 이름은(는) 필수 입력 항목입니다.'
        ],
        LGN_ID: [
          v => !!v || '사용자 ID은(는) 필수 입력 항목입니다.',
          v => (v && v.length <= 60) || '사용자 ID는 60자를 넘을 수 없습니다.',
          v => (v || '').indexOf(' ') < 0 || '사용자 ID는 공백을 허용하지 않습니다.',
          v => /^[a-zA-Z0-9]+$/.test(v) || '영문과 숫자만 입력 가능합니다.',
        ],
        AUTHRT_GROUP_SELECT: [
          v => !!v || '권한 그룹은(는) 필수 입력 항목입니다.'
        ],
        CLBK_YN: [
          v => !!v || '콜백여부은(는) 필수 입력 항목입니다.'
        ],
        DPCN_LGN_PM_YN: [
          v => !!v || '중복로그인허용여부은(는) 필수 입력 항목입니다.'
        ],
        USER_STTS_CD: [
          v => !!v || '사용자 상태은(는) 필수 입력 항목입니다.'
        ],
        EML: [
          v => {
            const replaceV = v.replace(/(\s*)/g, '')
            const EmlPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
            return (v && EmlPattern.test(replaceV)) || '이메일 형식에 맞지 않습니다.'
          },
          // v => !!v||'이메일은(는) 필수 입력 항목입니다.'
        ],
        MBL_PHN_NO: [
          v => !!v || '전화번호는 최대 11자리 입니다.',
          v => v.length <= 13 || '전화번호는 최대 11자리 입니다.',
        ],
        DEPT: [
          v => !!v || '소속은 필수 입력 항목입니다.'
        ]
      },


      CHK_USER_INFO_ITEM: {},                      // 그리드에서 선택된 row의 사용자 item = 입력한 사용자 정보
      CHK_ORG_USER:[],                             // 그리드에서 선택되어있었던 ROW의 사용자
      CHK_USER_GRID_ITEMS: [],                     // 그리드에서 체크 된 사용자 item
      NOW_DEPT_ID : '',
      showSelect: false,

      ENCRYPT_KEY: '',                                   // 암호화키
      NO_ENC_PWD: '',

      saveCustDataDiff: [], //개인정보 변경관련.
      dialogForcePwdChange:false,
      FORCE_PWD : '',

      //SWAT 사용자 존재 유무
      SWAT_USER_YN : false,
    }
  },

  watch: {
    // 사용사 상태를 감시하여 상태가 퇴직으로 변경 될 경우 퇴사일자를 현재 날짜로 변경
    CHK_USER_INFO_ITEM: {
      handler(newValue, oldValue) {
        if (newValue.USER_STTS_CD === 'RESIGN' || newValue.USER_STTS_CD === 'DELT') {
          this.endDate = this.$moment().format('YYYY-MM-DD');
        }
      },
      deep: true,
    },

    'USER_PARAMS.LGN_ID': function (NEW_LGN_ID, OLD_LGN_ID) {
      console.log('LGN_ID 변경되었습니다:', OLD_LGN_ID, '========>', NEW_LGN_ID);
      if(NEW_LGN_ID) this.getSwatUserInfo(NEW_LGN_ID);
    },

    CHK_USER_GRID_ITEMS(){
      let newRow = [];
      let userDept = {};
      // if(this.CHK_USER_GRID_ITEMS.length>1){
        // let chkRow = 0;
        // for(let i=0;i<this.CHK_USER_GRID_ITEMS.length;i++){
        //   if(this.CHK_ORG_USER[0].USER_ID == this.CHK_USER_GRID_ITEMS[i].USER_ID){
        //     if(i == 0){
        //       chkRow = 1;
        //     } else {
        //       chkRow = 0;
        //     }
        //     break;
        //   }
        // }
      //   newRow = this.CHK_USER_GRID_ITEMS[chkRow];
      //   this.CHK_USER_GRID_ITEMS = [];
      //   this.CHK_USER_GRID_ITEMS[0] = newRow;
      // }

      if(this.CHK_USER_GRID_ITEMS[0]){
        this.rowSelect(this.CHK_USER_GRID_ITEMS[0]);
        
        userDept = {
          CUSTCO_ID: this.CHK_USER_GRID_ITEMS[0].CUSTCO_ID
          , DEPT_ID: this.CHK_USER_GRID_ITEMS[0].DEPT_ID
          , DEPT_NM: this.CHK_USER_GRID_ITEMS[0].DEPT_NM
          , WORK_BGNG_YMD: this.CHK_USER_GRID_ITEMS[0].WORK_BGNG_YMD
        }
  
        this.USER_DEPT = userDept;
        this.CHK_ORG_USER = this.CHK_USER_GRID_ITEMS;
      }

    },
  },

  computed: {},

  async created() {
    this.$eventBus.$emit('getSwatToken');
    
    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    this.CENTER_LIST = this.mixin_ognz_list_center(this.common_ognz_list, 'ALL', '전체' );
    // this.DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.SRCH_USER_PARAM.CENTER, '전체' );

    //공통코드설정
    let codeName = ['USE_WT', 'T203'/*직위*/, 'T207'/*직급*/];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let codeNameGloal = ['JOB_CL'/*근무유형(CUSTCO별)*/, 'WT'/*근무유형(CUSTCO별)*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );
  },

  async mounted() {

    // this.srchAuthrtGroup();

    //공통코드설정
    let codeName = ['USE_WT','USER_ST', 'USER_SRCH', 'JOB_POST', 'CALB_WT'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    this.combo_custco_list = await this.mixin_custco_list_combo('전체');

    this.srchUser();

    this.setTime();
  },

  methods: {

    setPhoneNo(val) {
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.CHK_USER_INFO_ITEM.MBL_PHN_NO = res;
    },

    // 서버시간으로 기본시간 세팅
    setTime() {
      // this.currentTime = await this.mixin_getSvrDate("YYYY-MM-DD");
      this.startDate = this.$moment().format('YYYY-MM-DD');
      this.endDate = this.$moment(this.startDate).add(1,'years').format('YYYY-MM-DD'); // 퇴사일자 ( 시작일자 1년 후 default)
    },

    initRegParam() {

      // this.USER_PARAMS.USER_ID = '';
      // this.USER_PARAMS.USER_NM = '';
      // this.USER_PARAMS.LGN_ID = '';
      // this.USER_PARAMS.ORG_LGN_ID = '';
      // this.USER_PARAMS.ENTER_DT = '';
      // this.USER_PARAMS.CALL_DT = '';
      // this.USER_PARAMS.LHCS_EMP_NO = '';
      // this.USER_PARAMS.EMP_NO = '';
      // this.USER_PARAMS.CUSTCO = '';
      // this.USER_PARAMS.ORG_CUSTCO = '';
      // this.USER_PARAMS.DEPT = '';
      // this.USER_PARAMS.JBPS_CD = '';
      // this.USER_PARAMS.DUTY_CD = '';
      // this.USER_PARAMS.DUTY_GROUP_CD = '';
      // this.USER_PARAMS.WORK_STTS_CD = '';
      // this.USER_PARAMS.WORK_TYPE_CD = '';
      // this.USER_PARAMS.TKCG_RGN_CD = '';
      // this.USER_PARAMS.AUTHRT_GROUP = '';
      // this.USER_PARAMS.USER_STTS_CD = '';
      // this.USER_PARAMS.RSGNTN_YMD = '';
      // this.USER_PARAMS.SOFT_PHN = true;
      // this.USER_PARAMS.TRANS_PHN = true;
      // this.USER_PARAMS.EXT_NO = '';
      // this.USER_PARAMS.AGENT_ID = '';
      // this.USER_PARAMS.ACD_GROUP = '';
      // this.USER_PARAMS.CTI_STTS_CD = '';
      // this.USER_PARAMS.CHT_USE_YN=false;
      // this.USER_PARAMS.SMS_CUTT_USE_YN=false;
      // this.USER_PARAMS.EML_CUTT_USE_YN=false;
      // this.USER_PARAMS.CHT_USE_YN = '';
      // this.USER_PARAMS.SMS_CUTT_USE_YN = '';
      // this.USER_PARAMS.EML_CUTT_USE_YN = '';
      // this.USER_PARAMS.TKCG_TASK_CN = '';
      // this.USER_PARAMS.TKCG_TASK_CN_EAI = '';
      // this.USER_PARAMS.PHN_NO = '';
      // this.USER_PARAMS.TEL_NO = '';
      // this.USER_PARAMS.LH_APLCN_YMD = '';
      // this.USER_PARAMS.LH_APLCN_YMD_DD = '';
      // this.USER_PARAMS.EAI_EXL_YN = true;
      // this.USER_PARAMS.REG_YN = 'N';


      this.ENCRYPT_KEY = '';
      this.NO_ENC_PWD = '';

      this.USER_DPNC_CHK = false;

      this.CHK_USER_GRID_ITEMS = [];
      this.CHK_USER_INFO_ITEM = {};

      this.setTime();
      this.resetValidation();

    },
    async click_detail() {

      this.saveCustDataDiff = []; //개인정보관련 변경 초기화

      //개인정보관련 로깅용
      this.CHK_USER_INFO_ITEM.trgtId = this.CHK_USER_INFO_ITEM.USER_ID;
      //this.mixin_prvcInqLog('USER_SEL', this.CHK_USER_INFO_ITEM);

      this.CHK_USER_INFO_ITEM.REG_YN = 'Y';

      // this.USER_PARAMS.USER_ID = this.CHK_USER_INFO_ITEM.USER_ID;

      // this.USER_PARAMS.USER_NM=this.CHK_USER_INFO_ITEM.USER_NM                      //사용자 이름
      // this.USER_PARAMS.LGN_ID=this.CHK_USER_INFO_ITEM.LGN_ID                       //사용자 ID
      // this.USER_PARAMS.ORG_LGN_ID=this.CHK_USER_INFO_ITEM.ORG_LGN_ID                       //사용자 ID
      // this.USER_PARAMS.ENTER_DT=this.CHK_USER_INFO_ITEM.LHCS_JNCMP_YMD_DD                      //입사일
      // this.USER_PARAMS.CALL_DT=this.CHK_USER_INFO_ITEM.JNCMP_YMD_DD                      //콜센터입사일
      // this.USER_PARAMS.LHCS_EMP_NO=this.CHK_USER_INFO_ITEM.LHCS_EMP_NO                   //주거복지정보사번
      // this.USER_PARAMS.EMP_NO=this.CHK_USER_INFO_ITEM.EMP_NO                        //포털사번
      // this.USER_PARAMS.CUSTCO=this.CHK_USER_INFO_ITEM.CUSTCO                        //조직그룹
      // this.USER_PARAMS.CUSTCO=this.CHK_USER_INFO_ITEM.ORG_CUSTCO                        //조직그룹
      // this.USER_PARAMS.DEPT=this.CHK_USER_INFO_ITEM.DEPT_ID                          //소속
      // this.USER_PARAMS.JBPS_CD=this.CHK_USER_INFO_ITEM.JBPS_CD                       //직위
      // this.USER_PARAMS.DUTY_CD=this.CHK_USER_INFO_ITEM.DUTY_CD                       //직급
      // this.USER_PARAMS.DUTY_GROUP_CD=this.CHK_USER_INFO_ITEM.DUTY_GROUP_CD                  //직무
      // this.USER_PARAMS.WORK_STTS_CD=this.CHK_USER_INFO_ITEM.WORK_STTS_CD                  //근무형태
      // this.USER_PARAMS.WORK_TYPE_CD=this.CHK_USER_INFO_ITEM.WORK_TYPE_CD                  //근무유형
      // this.USER_PARAMS.TKCG_RGN_CD=this.CHK_USER_INFO_ITEM.TKCG_RGN_CD                   //담담지역(코드)
      // this.USER_PARAMS.AUTHRT_GROUP=this.CHK_USER_INFO_ITEM.AUTHOR_GROUP_ID_LIST                  //권한그룹
      // this.USER_PARAMS.USER_STTS_CD=this.CHK_USER_INFO_ITEM.USER_STTS_CD                  //재직여부
      // this.USER_PARAMS.RSGNTN_YMD=this.CHK_USER_INFO_ITEM.RSGNTN_YMD_DD                    //퇴사일

      // this.USER_PARAMS.SOFT_PHN=this.CHK_USER_INFO_ITEM.SOFT_PHN_USE_YN                      //소프트폰 사용여부
      // this.USER_PARAMS.TRANS_PHN=this.CHK_USER_INFO_ITEM.TRANSPHN_USE_YN                    //호전환 허용여부
      // this.USER_PARAMS.EXT_NO=this.CHK_USER_INFO_ITEM.EXT_NO                        //내선번호
      // this.USER_PARAMS.AGENT_ID=this.CHK_USER_INFO_ITEM.AGENT_ID                      //AGENT ID
      // this.USER_PARAMS.ACD_GROUP=this.CHK_USER_INFO_ITEM.ACD_GROUP                     //ACD GROUP
      // this.USER_PARAMS.CTI_STTS_CD=this.CHK_USER_INFO_ITEM.CTI_STTS_CD                   //CTI상태(코드)

      // this.USER_PARAMS.TKCG_TASK_CN=this.CHK_USER_INFO_ITEM.TKCG_TASK_CN                 //담당업무
      // this.USER_PARAMS.TKCG_TASK_CN_EAI=this.CHK_USER_INFO_ITEM.TKCG_TASK_CN_EAI              //EAI담당업무
      // this.USER_PARAMS.PHN_NO=this.CHK_USER_INFO_ITEM.MBL_PHN_NO                        //전화번호

      // this.USER_PARAMS.LH_APLCN_YMD=this.CHK_USER_INFO_ITEM.LH_APLCN_YMD                  //LH적용일
      // this.USER_PARAMS.LH_APLCN_YMD_DD=this.CHK_USER_INFO_ITEM.LH_APLCN_YMD_DD               //LH적용일
      // this.USER_PARAMS.EAI_EXL_YN=this.CHK_USER_INFO_ITEM.EAI_EXL_YN                    //EAI예외여부
      this.USER_PARAMS = this.CHK_USER_INFO_ITEM;
      console.log("click_detail", this.USER_PARAMS)
    },

    // 사용자 권한 목록 조회
    async srchAuthrtGroup() {

      let sURL = '/api/setting/system/menu-author-manage/author-group/inqire';

      let postParam = {}

      let headParam = {
        head: {}
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)

      if (!resData.HEADER.ERROR_FLAG) {

        for (let i = 0; i < resData.DATA.length; i++) {

          let dropitem = {
            text: resData.DATA[i].AUTHRT_GROUP_NM,
            value: resData.DATA[i].AUTHRT_GROUP_ID,
          };
          let tempData = {text: '전체', value: '',}
          this.AUTHRT_GROUP_DROP.push(tempData);
          this.AUTHRT_GROUP_DROP.push(dropitem);
          this.CHK_USER_INFO_ITEM.AUTHRT_GROUP_DROP.push(dropitem);

        }
      }
    },


    // 사용자 정보 조회
    async srchUser(next) {

      //다음버튼 클릭 유무
      if (next !== 'next') {
        this.mixin_hideDialog('RegDetail');
        this.initRegParam();

        this.USER_GRID_ITEMS = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sURL = '/api/biz/common/select/selectUserList';
      let postParam = {
        TYPE: 'list', //컴포넌트 팝업조회와 구분
        ST_DT : this.SRCH_USER_PARAM.DATE_CHK == true ? this.SRCH_USER_PARAM.ST_DT.replaceAll('-','').replaceAll(' ','') + '000000' : '',
        END_DT : this.SRCH_USER_PARAM.DATE_CHK == true ? this.SRCH_USER_PARAM.END_DT.replaceAll('-','').replaceAll(' ','') + '235959' : '',
        CUSTCO :this.SRCH_USER_PARAM.CUSTCO,    //조직그룹
        CENTER :this.SRCH_USER_PARAM.CENTER,    //센터
        SRCH_DEPT_ID : this.SRCH_USER_PARAM.DEPT_ID,      //소속
        USER_NM : this.SRCH_USER_PARAM.USER_NM,   //성명
        LGN_ID : this.SRCH_USER_PARAM.LGN_ID,   //사번
        EXT_NO : this.SRCH_USER_PARAM.EXT_NO,   //내선번호
        // SRCH_USER_ID:this.SRCH_USER_PARAM.SRCH_USER_ID,   //내선번호
      }
      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.UserMapper',
          "ROW_CNT": this.pagination.rowsPerPage,
          "PAGES_CNT": this.pagination.page,
          "PAGING": "Y",
        }
      }

      let resData = await this.common_postCall(sURL, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {

        for(let k in resData.DATA){
          resData.DATA[k].NEW_LH_APLCN_YMD = this.mixin_convertDate(resData.DATA[k].LH_APLCN_YMD, 'yyyy-MM-dd');
        }
        let response = resData.DATA;

        let i = 0;
        let idx = this.USER_GRID_ITEMS.length + 1

        this.USER_GRID_ITEMS = [...this.USER_GRID_ITEMS, ...response];
        this.USER_GRID_ITEMS_TOT_CNT = resData.HEADER.TOT_COUNT;

        if (resData.HEADER.next !== null && resData.HEADER.next !== undefined) {
          if (resData.HEADER.next === true) {
            this.nextDisabled = false;
          } else {
            this.nextDisabled = true;
          }
        }
        //이부분은 체크해볼것
        this.pagination.page += 1;
        // this.page=1;

      }
    },

    // 사용자 아이디 중복 체크
    async dpcnChk() {

      let sURL = '/api/setting/agent/manage/regist-user/dpnc-chk/inqire';
      let postParam = {
        LGN_ID: this.CHK_USER_INFO_ITEM.LGN_ID,
      }
      let headParam = {
        head: {
          SERVICE: "setting.system.agent.manage",
          METHOD: "inqire",
          ASYNC: false,
          TYPE: "BIZ_SERVICE",
        },
      }

      // 입력폼의 사용자 ID validation 체크
      const isUserIdValid = this.validateRules.LGN_ID.every(rule => rule(this.CHK_USER_INFO_ITEM.LGN_ID) === true);

      // 사용자 ID의 validation을 체크한 다음 api호출
      if (isUserIdValid) {

        let resData = await this.common_postCall(sURL, postParam, headParam)

        if (resData.HEADER.ERROR_FLAG) {
          this.showAlert(this.MESSAGE.ALERT.ALREADY_EXIST);
          this.USER_DPNC_CHK = false;
        } else {
          this.USER_DPNC_CHK = true;
          this.showAlert(this.MESSAGE.ALERT.USE_PSBLTY);
        }
      } else {
        // console.log('User rule unpassed!');
      }


    },
    dpncReset() {
      this.USER_DPNC_CHK = false;
    },


    // 사용자 상세정보, 정보등록 dialog
    openDialog(param) {

      switch (param) {

        case 'detail':
          this.CHK_USER_INFO_ITEM.REG_YN = 'Y';
          this.click_detail();
          this.mixin_showDialog('RegDetail')
          break;

        case 'regist':
          this.CHK_USER_INFO_ITEM.REG_YN = 'N';
          this.CHK_USER_INFO_ITEM.USER_ID = '';
          this.mixin_showDialog('RegDetail')
          break;


      }
    },
    closeBtn() {
      this.mixin_hideDialog('RegDetail')
      this.initRegParam();
    },
    //row 선택
    async rowSelect(item) {
      console.log(item);
      this.CHK_USER_INFO_ITEM = item;
      // this.CHK_USER_GRID_ITEMS = [];

      this.CHK_USER_INFO_ITEM.USER_ID=item.USER_ID;

      this.CHK_USER_INFO_ITEM.USER_NM=item.USER_NM                      //사용자 이름
      this.CHK_USER_INFO_ITEM.LGN_ID=item.LGN_ID                       //사용자 ID
      this.CHK_USER_INFO_ITEM.ORG_LGN_ID=item.LGN_ID                       //사용자 ID
      this.CHK_USER_INFO_ITEM.ENTER_DT=item.LHCS_JNCMP_YMD_DD                      //입사일
      this.CHK_USER_INFO_ITEM.CALL_DT=item.JNCMP_YMD_DD                      //콜센터입사일
      this.CHK_USER_INFO_ITEM.LHCS_EMP_NO=item.LHCS_EMP_NO                   //주거복지정보사번
      this.CHK_USER_INFO_ITEM.EMP_NO=item.EMP_NO                        //포털사번
      this.CHK_USER_INFO_ITEM.CUSTCO=item.CUSTCO_ID                        //조직그룹
      this.CHK_USER_INFO_ITEM.ORG_CUSTCO=item.CUSTCO_ID                        //조직그룹
      this.CHK_USER_INFO_ITEM.DEPT=item.DEPT_ID                          //소속
      this.CHK_USER_INFO_ITEM.DEPT_NM=item.DEPT_NM                          //소속
      this.CHK_USER_INFO_ITEM.EPLMT_CD=item.EPLMT_CD                          //고용형태
      this.CHK_USER_INFO_ITEM.JBPS_CD=item.JBPS_CD                       //직위
      this.CHK_USER_INFO_ITEM.DUTY_CD=item.DUTY_CD                       //직급
      this.CHK_USER_INFO_ITEM.DUTY_GROUP_CD=item.DUTY_GROUP_CD                  //직무그룹
      this.CHK_USER_INFO_ITEM.WORK_STTS_CD=item.WORK_STTS_CD                  //근무형태
      this.CHK_USER_INFO_ITEM.WORK_TYPE_CD=item.WORK_TYPE_CD                  //근무유형
      this.CHK_USER_INFO_ITEM.TKCG_RGN_CD=item.TKCG_RGN_CD                   //담담지역(코드)
      this.CHK_USER_INFO_ITEM.AUTHRT_GROUP=item.AUTHOR_GROUP_ID_LIST                  //권한그룹
      this.CHK_USER_INFO_ITEM.USER_STTS_CD=item.USER_STTS_CD                  //재직여부
      this.CHK_USER_INFO_ITEM.RSGNTN_YMD=item.RSGNTN_YMD_DD                    //퇴사일

      this.CHK_USER_INFO_ITEM.SOFT_PHN=item.SOFT_PHN_USE_YN == 'Y' ? 'Y' : 'N'  //소프트폰 사용여부
      this.CHK_USER_INFO_ITEM.TRANS_PHN=item.TRANSPHN_USE_YN == 'Y' ? 'Y' : 'N'   //호전환 허용여부
      this.CHK_USER_INFO_ITEM.EXT_NO=item.EXT_NO                        //내선번호
      this.CHK_USER_INFO_ITEM.AGENT_ID=item.AGENT_ID                      //AGENT ID
      this.CHK_USER_INFO_ITEM.ACD_GROUP=item.ACD_GROUP                     //ACD GROUP
      this.CHK_USER_INFO_ITEM.DSPTCH_NO=item.DSPTCH_NO                     //발신번호
      this.CHK_USER_INFO_ITEM.CTI_STTS_CD=item.CTI_STTS_CD                   //CTI상태(코드)
      this.CHK_USER_INFO_ITEM.CHT_USE_YN=item.CHT_USE_YN == true || item.CHT_USE_YN == 'Y' ? true : false                     //채팅상담 직원여부
      this.CHK_USER_INFO_ITEM.SMS_CUTT_USE_YN=item.SMS_CUTT_USE_YN == true || item.SMS_CUTT_USE_YN == 'Y' ? true : false           //문자상담 직원여부
      this.CHK_USER_INFO_ITEM.EML_CUTT_USE_YN=item.EML_CUTT_USE_YN == true || item.EML_CUTT_USE_YN == 'Y' ? true : false           //이메일상담 직원여부

      this.CHK_USER_INFO_ITEM.TKCG_TASK_CN=item.TKCG_TASK_CN                 //담당업무
      this.CHK_USER_INFO_ITEM.TKCG_TASK_CN_EAI=item.TKCG_TASK_CN_EAI              //EAI담당업무
      this.CHK_USER_INFO_ITEM.PHN_NO=item.MBL_PHN_NO                        //전화번호
      this.CHK_USER_INFO_ITEM.TEL_NO=item.TEL_NO                        //전화번호

      this.CHK_USER_INFO_ITEM.LH_APLCN_YMD=item.LH_APLCN_YMD                  //LH적용일
      this.CHK_USER_INFO_ITEM.LH_APLCN_YMD_DD=item.LH_APLCN_YMD_DD               //LH적용일
      this.CHK_USER_INFO_ITEM.EAI_EXL=item.EAI_EXL_YN == 'N' ? false : true                    //EAI예외여부

      this.CHK_USER_INFO_ITEM.MNG_CUSL_YN=item.MNG_CUSL_YN == 'Y' ? true : false;  //선임 상담사 여부
      this.CHK_USER_INFO_ITEM.REC_DWNLD_YN=item.REC_DWNLD_YN == 'Y' ? 'Y' : 'N';  //녹취 다운로드 가능 여부
      this.CHK_USER_INFO_ITEM.STT_DWNLD_YN=item.STT_DWNLD_YN == 'Y' ? 'Y' : 'N';  //STT 엑셀 다운로드 가능 여부
      this.CHK_USER_INFO_ITEM.MNG_CUSTCO_DEPT_ID=item.MNG_CUSTCO_DEPT_ID; //담당 센터 ID

      this.USER_PARAMS = this.CHK_USER_INFO_ITEM;
      this.NOW_DEPT_ID = this.USER_PARAMS.DEPT_ID
      console.log("rowSelect", this.USER_PARAMS);
    },

    //row 선택 활성화
    isActiveRow(item) {
      const activeClass = item === this.CHK_USER_INFO_ITEM ? "active" : "";
      // const activeClass = item === this.CHK_USER_GRID_ITEMS ? "active" : "";
      return activeClass;
    },

    // 저장 버튼 클릭 시 validation 체크와 id 중복 체크를 만족하면 저장 메서드 호출
    saveBtn() {

      if (this.validate()) {
        // REGIST, MODIFY 분기
        switch (this.CHK_USER_INFO_ITEM.REG_YN) {

          case 'Y':
            // MODIFY USER
            this.showAlert(this.MESSAGE.CONFIRM.MODIFY)

            break;
          case 'N':
            // 사용자 ID(LGN_ID) 중복체크
            if (this.USER_DPNC_CHK != true) {

              this.showAlert(this.MESSAGE.ALERT.INVALID_LGN_ID);
            } else {
              this.showAlert(this.MESSAGE.CONFIRM.REGIST);
            }
        }
      } else {
        // console.log("fail")
      }

    },

    saveConfirm() {
      let DATA_FLAG = this.CHK_USER_INFO_ITEM.REG_YN === 'N' ? 'I' : "U"
      this.getPswdEncKey(DATA_FLAG);
    },


    /*
    * 사용자 등록
    */

    async registUser(DATA_FLAG, PSWD, strEncryptKey) {
      if(this.CHK_USER_INFO_ITEM.AGENT_ID){
        //AGENT_ID를 입력했을 때
        let url = 'api/setting/agent/manage/checkAgentId';

        let postParams = {
          REG_USER_ID: this.USER_PARAMS.USER_ID,
          AGENT_ID: this.CHK_USER_INFO_ITEM.AGENT_ID,
        };

        let headParams = {
          head: {
          }
        };

        let resDatas = await this.common_postCall(url, postParams, headParams);

        if (resDatas.HEADER.ERROR_FLAG) {
        } else {
          if(parseInt(resDatas.DATA[0].CNT)>0){
            this.showAlert(this.MESSAGE.ALERT.DUPL_AGENT_ID);
            return;
          } 
        }
      }

      let sUrl = 'api/setting/agent/manage/regist';
      let postParam = {
        REG_USER_ID: this.USER_PARAMS.USER_ID,                  // 기등록된 유저 ID
        USER_NM: this.CHK_USER_INFO_ITEM.USER_NM,                             // 등록 유저 이름
        LGN_ID: this.CHK_USER_INFO_ITEM.LGN_ID,                               // 로그인 ID
        ORG_LGN_ID: this.CHK_USER_INFO_ITEM.ORG_LGN_ID,                               // 기존 로그인 ID

        EML: this.CHK_USER_INFO_ITEM.EML,                                     // 이메일
        // MBL_PHN_NO: this.USER_PARAMS.MBL_PHN_NO.replace(/[^0-9]/g, ""),                        // 전화번호
        USER_NNM: this.CHK_USER_INFO_ITEM.USER_NNM,                           // 별칭

        ENTER_DT: this.CHK_USER_INFO_ITEM.ENTER_DT?this.CHK_USER_INFO_ITEM.ENTER_DT.replace(/[^0-9]/g, ''):'',                          //입사일
        CALL_DT: this.CHK_USER_INFO_ITEM.CALL_DT?this.CHK_USER_INFO_ITEM.CALL_DT.replace(/[^0-9]/g, ''):'',                            //콜센터입사일
        LHCS_EMP_NO: this.CHK_USER_INFO_ITEM.LHCS_EMP_NO,                    //주거복지정보사번
        EMP_NO: this.CHK_USER_INFO_ITEM.EMP_NO,                              //사번
        CUSTCO: this.CHK_USER_INFO_ITEM.CUSTCO,                              //조직그룹
        ORG_CUSTCO: this.CHK_USER_INFO_ITEM.ORG_CUSTCO,                              //기존 조직그룹
        DEPT: this.CHK_USER_INFO_ITEM.DEPT_ID,               //소속
        DEPT_ID: this.CHK_USER_INFO_ITEM.DEPT_ID,              // 소속 부서 ID
        DEPT_CHG_YN: this.NOW_DEPT_ID != this.CHK_USER_INFO_ITEM.DEPT_ID ? 'Y' : 'N',  //소속 부서 변경 여부
        EPLMT_CD: this.CHK_USER_INFO_ITEM.EPLMT_CD,         //고용형태
        JBPS_CD: this.CHK_USER_INFO_ITEM.JBPS_CD,                            //직위
        DUTY_CD: this.CHK_USER_INFO_ITEM.DUTY_CD,                            //직급
        DUTY_GROUP_CD: this.CHK_USER_INFO_ITEM.DUTY_GROUP_CD,                //직무
        WORK_STTS_CD: this.CHK_USER_INFO_ITEM.WORK_STTS_CD,                  //근무형태
        WORK_TYPE_CD: this.CHK_USER_INFO_ITEM.WORK_TYPE_CD,                  //근무유형
        TKCG_RGN_CD: this.CHK_USER_INFO_ITEM.TKCG_RGN_CD,                    //담당지역
        AUTHRT_GROUP: this.CHK_USER_INFO_ITEM.AUTHRT_GROUP,                  //권한그룹
        AUTHRT_GROUP_ID: this.CHK_USER_INFO_ITEM.AUTHRT_GROUP,         // 권한 그룹
        JBTTL_CD: this.CHK_USER_INFO_ITEM.JBTTL_CD,                           // 직책
        USER_STTS_CD: this.CHK_USER_INFO_ITEM.USER_STTS_CD,                   // 유저 상태

        CLBK_YN: this.CHK_USER_INFO_ITEM.CLBK_YN,                             // 콜백사용여부
        DPCN_LGN_PM_YN: this.CHK_USER_INFO_ITEM.DPCN_LGN_PM_YN,                             // 콜백사용여부
        JNCMP_YMD: this.dateToStr(this.startDate),                     // 입사일자

        RSGNTN_YMD: this.CHK_USER_INFO_ITEM.RSGNTN_YMD?this.CHK_USER_INFO_ITEM.RSGNTN_YMD.replace(/[^0-9]/g, ''):'',                   //퇴사일자
        // RSGNTN_YMD: this.endDate === '' ? '' : this.dateToStr(this.endDate),                      // 퇴사일자

        USE_YN: this.CHK_USER_INFO_ITEM.USER_STTS_CD === 'WORK' ? 'Y' : 'N',      // 사용여부

        SOFT_PHN: this.CHK_USER_INFO_ITEM.SOFT_PHN == 'Y' ? 'Y' : 'N',                   // 소프트폰 사용여부
        TRANS_PHN: this.CHK_USER_INFO_ITEM.TRANS_PHN == 'Y' ? 'Y' : 'N',                   // 호전환허용여부
        EXT_NO: this.CHK_USER_INFO_ITEM.EXT_NO,                   // 내선번호
        AGENT_ID: this.CHK_USER_INFO_ITEM.AGENT_ID,                   // agent id
        ACD_GROUP: this.CHK_USER_INFO_ITEM.ACD_GROUP,                   // ACD GROUP
        DSPTCH_NO: this.CHK_USER_INFO_ITEM.DSPTCH_NO,                   // 발신번호
        CHT_USE_YN: this.CHK_USER_INFO_ITEM.CHT_USE_YN ? 'Y' : 'N',                   // 채팅상담 직원여부
        SMS_CUTT_USE_YN: this.CHK_USER_INFO_ITEM.SMS_CUTT_USE_YN ? 'Y' : 'N',                   // 문자상담 직원여부
        EML_CUTT_USE_YN: this.CHK_USER_INFO_ITEM.EML_CUTT_USE_YN ? 'Y' : 'N',                   // 이메일상담 직원여부
        CTI_STTS_CD: this.CHK_USER_INFO_ITEM.CTI_STTS_CD,                   // CTI상태
        TKCG_TASK_CN: this.CHK_USER_INFO_ITEM.TKCG_TASK_CN,                   // 담당업무
        TKCG_TASK_CN_EAI: this.CHK_USER_INFO_ITEM.TKCG_TASK_CN_EAI,                   // EAI 담당업무
        PHN_NO: this.CHK_USER_INFO_ITEM.PHN_NO,                   // 전화번호
        TEL_NO: this.CHK_USER_INFO_ITEM.TEL_NO?this.CHK_USER_INFO_ITEM.TEL_NO.replace(/[^0-9#]/g, ''):'',                   // 전화번호
        LH_APLCN_YMD: this.CHK_USER_INFO_ITEM.LH_APLCN_YMD,                   //LH적용일
        EAI_EXL: this.CHK_USER_INFO_ITEM.EAI_EXL == true ? 'Y' : 'N',                   // EAI예외 여부

        REC_DWNLD_YN: this.CHK_USER_INFO_ITEM.REC_DWNLD_YN == 'Y' ? 'Y' : 'N',  //녹취 다운로드 가능 여부
        STT_DWNLD_YN: this.CHK_USER_INFO_ITEM.STT_DWNLD_YN == 'Y' ? 'Y' : 'N',  //STT 엑셀 다운로드 가능 여부

        DATA_FLAG: DATA_FLAG,                                          // DATA_FLAG
        USER_EXPLN : this.CHK_USER_INFO_ITEM.USER_EXPLN,                      // 사용자 설명

        PSWD : DATA_FLAG === "U" ? '' : PSWD,                                                 // 암호화된 비밀번호
        strEncryptKey : DATA_FLAG === "U" ? '' : strEncryptKey,                               // 암호화키
        ENCRYPT_KEY : DATA_FLAG === "U" ? '' : strEncryptKey,                                 // 암호화키
      }

      /*
      9 인재개발팀
      90000008 운영개발팀
      90000009 시스템개발팀
      */
      if(this.CHK_USER_INFO_ITEM.DEPT_ID === '9' || this.CHK_USER_INFO_ITEM.DEPT_ID === '90000008' || this.CHK_USER_INFO_ITEM.DEPT_ID === '90000009'){
        postParam.MNG_CUSTCO_DEPT_ID = this.CHK_USER_INFO_ITEM.MNG_CUSTCO_DEPT_ID; //담당 센터 ID
      }else{
        postParam.MNG_CUSTCO_DEPT_ID = '';
      }

      if(this.CHK_USER_INFO_ITEM.AUTHRT_GROUP === '6'){ //권한그룹이 일반상담사인 경우
        postParam.MNG_CUSL_YN = this.CHK_USER_INFO_ITEM.MNG_CUSL_YN ? 'Y' : 'N'; //선임 상담사 여부
      }else{
        postParam.MNG_CUSL_YN = 'N';
      }

      let chk_authrt_group_change = "N";
      // 개인정보 변경 체크.
      if( postParam.USER_NM != this.USER_PARAMS.USER_NM) this.saveCustDataDiff.push("이름");
      if( postParam.EML != this.USER_PARAMS.EML) this.saveCustDataDiff.push("이메일");
      if( postParam.MBL_PHN_NO != this.USER_PARAMS.MBL_PHN_NO) this.saveCustDataDiff.push("전화번호");
      if( postParam.USER_NNM != this.USER_PARAMS.USER_NNM) this.saveCustDataDiff.push("닉네임");
      if( postParam.AUTHRT_GROUP_ID != this.USER_PARAMS.AUTHRT_GROUP_ID)
      {
        this.saveCustDataDiff.push("권한 그룹");
        if(DATA_FLAG === "U"){
          chk_authrt_group_change = "Y";
        }
      }
      if( postParam.JBTTL_CD != this.USER_PARAMS.JBTTL_CD) this.saveCustDataDiff.push("직책");
      if( postParam.DEPT_ID != this.USER_PARAMS.DEPT_ID) this.saveCustDataDiff.push("소속");
      if( postParam.EPLMT_CD != this.USER_PARAMS.EPLMT_CD) this.saveCustDataDiff.push("고용형태");
      if( postParam.JNCMP_YMD != this.USER_PARAMS.JNCMP_YMD) this.saveCustDataDiff.push("입사 일자");
      if( postParam.RSGNTN_YMD != this.USER_PARAMS.RSGNTN_YMD) this.saveCustDataDiff.push("퇴사 일자");
      if( postParam.CLBK_YN != this.USER_PARAMS.CLBK_YN) this.saveCustDataDiff.push("콜백 여부");
      if( postParam.DPCN_LGN_PM_YN != this.USER_PARAMS.DPCN_LGN_PM_YN) this.saveCustDataDiff.push("중복로그인허용 여부");
      if( postParam.USER_STTS_CD != this.USER_PARAMS.USER_STTS_CD) this.saveCustDataDiff.push("사용자 상태");
      if( postParam.USER_EXPLN != this.USER_PARAMS.USER_EXPLN) this.saveCustDataDiff.push("사용자 설명");

      if( postParam.LGN_ID != this.USER_PARAMS.LGN_ID) this.saveCustDataDiff.push("로그인ID");
      if( postParam.ENTER_DT != this.USER_PARAMS.ENTER_DT) this.saveCustDataDiff.push("입사일");
      if( postParam.CALL_DT != this.USER_PARAMS.CALL_DT) this.saveCustDataDiff.push("콜센터 입사일");
      if( postParam.LHCS_EMP_NO != this.USER_PARAMS.LHCS_EMP_NO) this.saveCustDataDiff.push("LH주거복지정보 사번");
      if( postParam.EMP_NO != this.USER_PARAMS.EMP_NO) this.saveCustDataDiff.push("LH포털 사번");
      if( postParam.CUSTCO != this.USER_PARAMS.CUSTCO) this.saveCustDataDiff.push("조직그룹");
      if( postParam.DEPT != this.USER_PARAMS.DEPT) this.saveCustDataDiff.push("소속");
      if( postParam.JBPS_CD != this.USER_PARAMS.JBPS_CD) this.saveCustDataDiff.push("직위");
      if( postParam.DUTY_CD != this.USER_PARAMS.DUTY_CD) this.saveCustDataDiff.push("직급");
      if( postParam.DUTY_GROUP_CD != this.USER_PARAMS.DUTY_GROUP_CD) this.saveCustDataDiff.push("직무");
      if( postParam.WORK_STTS_CD != this.USER_PARAMS.WORK_STTS_CD) this.saveCustDataDiff.push("근무형태");
      if( postParam.WORK_TYPE_CD != this.USER_PARAMS.WORK_TYPE_CD) this.saveCustDataDiff.push("근무유형");
      if( postParam.TKCG_RGN_CD != this.USER_PARAMS.TKCG_RGN_CD) this.saveCustDataDiff.push("담당지역");
      if( postParam.AUTHRT_GROUP != this.USER_PARAMS.AUTHRT_GROUP) this.saveCustDataDiff.push("권한그룹");
      if( postParam.USER_STTS_CD != this.USER_PARAMS.USER_STTS_CD) this.saveCustDataDiff.push("사용자 상태");
      if( postParam.RSGNTN_YMD != this.USER_PARAMS.RSGNTN_YMD) this.saveCustDataDiff.push("퇴사일자");
      if( postParam.SOFT_PHN != this.USER_PARAMS.SOFT_PHN) this.saveCustDataDiff.push("소프트폰 사용여부");
      if( postParam.TRANS_PHN != this.USER_PARAMS.TRANS_PHN) this.saveCustDataDiff.push("호전환 허용여부");
      if( postParam.EXT_NO != this.USER_PARAMS.EXT_NO) this.saveCustDataDiff.push("내선번호");
      if( postParam.AGENT_ID != this.USER_PARAMS.AGENT_ID) this.saveCustDataDiff.push("AGENT ID");
      if( postParam.ACD_GROUP != this.USER_PARAMS.ACD_GROUP) this.saveCustDataDiff.push("ACD GROUP");
      if( postParam.DSPTCH_NO != this.USER_PARAMS.DSPTCH_NO) this.saveCustDataDiff.push("발신번호");
      if( postParam.CHT_USE_YN != this.USER_PARAMS.CHT_USE_YN) this.saveCustDataDiff.push("채팅상담 직원여부");
      if( postParam.SMS_CUTT_USE_YN != this.USER_PARAMS.SMS_CUTT_USE_YN) this.saveCustDataDiff.push("문자상담 직원여부");
      if( postParam.EML_CUTT_USE_YN != this.USER_PARAMS.EML_CUTT_USE_YN) this.saveCustDataDiff.push("이메일상담 직원여부");
      if( postParam.CTI_STTS_CD != this.USER_PARAMS.CTI_STTS_CD) this.saveCustDataDiff.push("CTI상태");
      if( postParam.TKCG_TASK_CN != this.USER_PARAMS.TKCG_TASK_CN) this.saveCustDataDiff.push("담당업무");
      if( postParam.TKCG_TASK_CN_EAI != this.USER_PARAMS.TKCG_TASK_CN_EAI) this.saveCustDataDiff.push("EAI 담당업무");
      if( postParam.PHN_NO != this.USER_PARAMS.PHN_NO) this.saveCustDataDiff.push("전화번호");
      if( postParam.LH_APLCN_YMD != this.USER_PARAMS.LH_APLCN_YMD) this.saveCustDataDiff.push("LH적용일");
      if( postParam.EAI_EXL != this.USER_PARAMS.EAI_EXL) this.saveCustDataDiff.push("EAI예외 여부");
      
      if( postParam.MNG_CUSL_YN != this.USER_PARAMS.MNG_CUSL_YN) this.saveCustDataDiff.push("선임 상담사 여부");
      if( postParam.REC_DWNLD_YN != this.USER_PARAMS.REC_DWNLD_YN) this.saveCustDataDiff.push("녹취 다운로드 가능여부");
      if( postParam.STT_DWNLD_YN != this.USER_PARAMS.STT_DWNLD_YN) this.saveCustDataDiff.push("STT 엑셀 다운로드 가능여부");
      if( postParam.MNG_CUSTCO_DEPT_ID != this.USER_PARAMS.MNG_CUSTCO_DEPT_ID) this.saveCustDataDiff.push("담당 센터 ID");

      postParam.PRVC_CN = this.saveCustDataDiff.join(",");
      postParam.CHK_AUTHRT_CHG = chk_authrt_group_change;


      let headParam ={
            head:{
            },
      };

      let resData = await this.common_postCall(sUrl,postParam,headParam);

      if(resData.HEADER.ERROR_FLAG){
        if(!this.mixin_isEmpty(resData.HEADER.ERROR_MSG)){
          this.showAlert({alertDialogToggle: true, msg: resData.HEADER.ERROR_MSG, iconClass: 'is-caution', type: 'default'});
        }else{
          this.showAlert(this.MESSAGE.ERROR.REG_USER_FAIL);
        }
      }else{

        //내선번호, agengId, acdGroup가 있을 경우 SWAT 상담사 등록 수정 처리
        if(postParam.EXT_NO && postParam.LGN_ID && postParam.ACD_GROUP){
          //저장 이후 CTI 사용자 등록 및 수정 처리
          try{
            postParam.USER_ID = this.USER_PARAMS.USER_ID;
            this.ctiUserProc(postParam);
          }catch(e){}
        }

        // this.showAlert(this.MESSAGE.ALERT.REG_SUCCESS)
        // this.initRegParam();
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeBtn();
        this.srchUser();

        return ;
      }
    },

    // 저장/수정 form valiate 체크
    validate() {
      return this.$refs.form.validate();
    },

    // 저장/수정 form validate reset
    resetValidation() {
      if(this.$refs.form != undefined) this.$refs.form.resetValidation();
    },

    // alert창 닫기
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },

    strToDate(date) {
      let year = date.slice(0, 4);
      let month = date.slice(4, 6);
      let day = date.slice(6, 8);
      let hour = date.slice(8, 10);
      let min = date.slice(10, 12);
      return `${year}-${month}-${day}`;
    },

    dateToStr(dateString) {
      let year = dateString.slice(0, 4);
      let month = dateString.slice(5, 7);
      let day = dateString.slice(8, 10);

      // Format the date as "YYYYMMDDHHmmss" string
      const formattedDate = `${year}${month}${day}`;
      return formattedDate;
    },


    /**********************************************

     * 사용자 비밀번호 초기화, 잠금 해제

     ***********************************************/

    resetBtn(DATA_FLAG) {
      let chkPswdFailCnt = 0;

      for (let i = 0; i < this.CHK_USER_GRID_ITEMS.length; i++) {
        console.log("this.CHK_USER_GRID_ITEMS[i].PSWD_FAIL_CNT", this.CHK_USER_GRID_ITEMS[i].PSWD_FAIL_CNT);
        if (this.CHK_USER_GRID_ITEMS[i].PSWD_FAIL_CNT !== '5') {
          chkPswdFailCnt++
        }
      }

      if (!this.mixin_isEmpty(this.CHK_USER_GRID_ITEMS)) {
        switch (DATA_FLAG) {
          case 'reset':
            this.showAlert(this.MESSAGE.CONFIRM.RESET_PSWD)
            break;
          case 'unlock' :
            if (chkPswdFailCnt !== 0) {
              this.showAlert(this.MESSAGE.ALERT.PSWD_FAIL_CNT_INVALID)
            } else {
              this.showAlert(this.MESSAGE.CONFIRM.UNLOCK_PSWD);
            }
            break;
        }
      } else {
        this.showAlert(this.MESSAGE.ERROR.RESET_USER_PSWD_CHK)
      }
    },
    resetPswdRtn() {
      this.resetPswd('reset');
    },
    unlockPswdRtn() {
      this.resetPswd('unlock');
    },
    async resetPswd(DATA_FLAG) {

      let strEncryptKey = '';
      let strPassWD = '';
      let post_user_id = '';
      let post_lgn_id = '';

      /*       for(let i = 0; i<this.CHK_USER_GRID_ITEMS.length; i++){
              strEncryptKey[i] = this.CHK_USER_GRID_ITEMS[i].PSWD_ENCPT_CD;
              strPassWD[i] = this.CHK_USER_GRID_ITEMS[i].LGN_ID;
              NEW_PWD[i] = this.common_aesEncrypt(strPassWD, strEncryptKey);
            }
       */

      /*         strEncryptKey = this.CHK_USER_GRID_ITEMS[0].PSWD_ENCPT_CD;
              strPassWD = this.CHK_USER_GRID_ITEMS[0].LGN_ID;


              let NEW_PWD = await this.common_aesEncrypt(strPassWD, strEncryptKey); */

      let postParam = {
        RESET_USER_ID: this.CHK_USER_GRID_ITEMS[0].USER_ID,
        RESET_LGN_ID: this.CHK_USER_GRID_ITEMS[0].LGN_ID,
        TASK_SE_CD: DATA_FLAG === 'reset' ? 'RESET' : 'UNLOCK',
        CUSTCO:this.CHK_USER_GRID_ITEMS[0].CUSTCO_ID
      }

      let sUrl = DATA_FLAG == 'reset' ? 'api/setting/agent/manage/password-initl/process' : 'api/setting/agent/manage/password-lock-initl/process';

      // let postParam =[];
      //     for(let i=0; i<this.CHK_USER_GRID_ITEMS.length ; i++){
      //       postParam[i] = {
      //       RESET_USER_ID : this.CHK_USER_GRID_ITEMS[i].USER_ID,
      //       RESET_LGN_ID : this.CHK_USER_GRID_ITEMS[i].LGN_ID,
      //       ENCRYPT_KEY : strEncryptKey[i],
      //       NEW_PWD :NEW_PWD[i],
      //       }
      //     }

      let headParam = {
        head: {}
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ERROR.RESET_USER_PSWD_FAIL)
      } else {
        // this.showAlert(this.MESSAGE.ALERT.RESET_PSWD_SUCCESS)
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.CHK_USER_GRID_ITEMS = [];
        this.initRegParam();
        this.closeBtn();
        this.srchUser();
      }
    },

    //암호화 모듈
    common_aesEncrypt(strPassWD, strEncryptKey) {
      //생성된 암호화 키 정보를 사용하여 ID와 password필드값을 AES 256bit 알고리즘을 이용하여 암호화한다.
      return gibberish.aesEncrypt(strPassWD, strEncryptKey);
    },


    // 비밀번호 암호화 키
    async getPswdEncKey(DATA_FLAG) {

      let sUrl = 'auth-api/password-encpt/process';

      let postParam = {

        username: this.CHK_USER_INFO_ITEM.LGN_ID,

      };

      let headParam = {
        head: {
          passwordProcess: 'passwordProcess',
          DATA_FLAG: DATA_FLAG,

        }
      };

      let resData = await this.common_postCall(sUrl, postParam, headParam);

      if (resData.HEADER.ERROR_FLAG) {

        this.showAlert(this.MESSAGE.ERROR.GET_PSWD_ENC_KEY_FAIL)

      } else {

        this.ENCRYPT_KEY = resData.DATA[0].ENCRYPT_KEY;
        this.EncryptPswd(resData, DATA_FLAG);
      }
    },


    // 비밀번호 암호화
    EncryptPswd(resData, DATA_FLAG) {
      let strEncryptKey = resData.DATA[0].ENCRYPT_KEY;
      let strPswd = '';
      if (strEncryptKey === "") {
        return;
      }
      if (!this.mixin_isEmpty(DATA_FLAG)) {
        strPswd = this.CHK_USER_INFO_ITEM.LGN_ID;
      }
      let PSWD = this.common_aesEncrypt(strPswd, strEncryptKey)

      switch (DATA_FLAG) {

        case "I" :
          this.registUser(DATA_FLAG, PSWD);
          break;

        case "U" :
          this.registUser(DATA_FLAG, PSWD, strEncryptKey)
          break;

        case "reset":
          break;
      }
    },

    forceResetPwd() {
      this.dialogForcePwdChange = true;
      this.mixin_showDialog('ForcePwdChange');
    },

    forceResetValid() {
      let arrUserId = [];
      if(this.CHK_USER_GRID_ITEMS.length > 0){
        this.CHK_USER_GRID_ITEMS.forEach((user, idx) => {
          arrUserId.push({TARGET_USER_ID: user.USER_ID, TARGET_LGN_ID : user.LGN_ID, TARGET_CUSTCO : user.CUSTCO_ID});
        });
      }

      if(arrUserId.length === 0){
        this.showAlert(this.MESSAGE.ALERT.USER_CHECK_LIST_EMPTY);
        return;
      }

      if(!this.FORCE_PWD){
        this.showAlert(this.MESSAGE.ALERT.FORCE_PWD_EMPTY);
        return;
      }

      this.showConfirmInfo({
        msg : '선택된 사용자의 비밀번호를 강제로 변경 하시겠습니까?'
        , callYes : () => {
          this.forceResetPwdProc();
          this.closeAlert();
        }
        , callNo : this.closeAlert
      });
    },

    async forceResetPwdProc() {

      let arrUserId = [];
      if(this.CHK_USER_GRID_ITEMS.length > 0){
        this.CHK_USER_GRID_ITEMS.forEach((user, idx) => {
          arrUserId.push({TARGET_USER_ID: user.USER_ID, TARGET_LGN_ID : user.LGN_ID, TARGET_CUSTCO : user.CUSTCO_ID});
        });
      }

      let postParam = {
        RESET_PWD_TXT : this.FORCE_PWD
        , arrUserId: arrUserId
      }

      let sUrl = '/api/setting/agent/forceUpdatePassword';

      let headParam = {
        head: {}
      };
      let resData = await this.common_postCall(sUrl, postParam, headParam);
      if (resData.HEADER.ERROR_FLAG) {
        this.showAlert(this.MESSAGE.ERROR.RESET_USER_PSWD_FAIL)
      } else {
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        // this.showAlert(this.MESSAGE.ALERT.RESET_PSWD_SUCCESS)
        this.CHK_USER_GRID_ITEMS = [];
        this.initRegParam();
        this.closeBtn();
        this.srchUser();

        this.closeForcePwd();
      }
    },

    closeForcePwd() {
      this.mixin_hideDialog('ForcePwdChange')
      this.dialogForcePwdChange = false;
      this.FORCE_PWD = '';
    },

    //센터 변경 시 소속 로드
    chgCenter(){
      this.SRCH_USER_PARAM.DEPT = '';
      this.DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.SRCH_USER_PARAM.CENTER, '전체' );
    },

    //사용자 저장버튼 클릭
    strg_user(){
      this.showAlert(this.MESSAGE.CONFIRM.REGIST);
    },

    //부서이동버튼 클릭
    async tranUserDept(){

      if(this.TRAN_USER_DEPT.USER_ID === ''){
        this.showAlertInfo({msg : '고객을 선택해 주세요.'});
        return;
      }
      
      if(this.TRAN_USER_DEPT.CUSTCO_ID === '' || this.TRAN_USER_DEPT.DEPT_ID === ''){
        this.showAlertInfo({msg : '이동할 부서를 선택해 주세요.'});
        return;
      }
      
      if(this.TRAN_USER_DEPT.WORK_BGNG_YMD === ''){
        this.showAlertInfo({msg : '근무 시작일을 선택해 주세요.'});
        return;
      }

      let sURL = '/api/setting/agent/tranUserDept';
      let postParam = {
        TRAN_USER_ID : this.CHK_USER_INFO_ITEM.USER_ID
        , TRAN_CUSTCO_ID : this.TRAN_USER_DEPT.CUSTCO_ID
        , DEPT_ID : this.TRAN_USER_DEPT.DEPT_ID
        , WORK_BGNG_YMD : this.TRAN_USER_DEPT.WORK_BGNG_YMD.replace(/[^0-9]/g, '')
      }
      let headParam = {
        head: {
        }
      }
      let resData = await this.common_postCall(sURL, postParam, headParam);
      if(resData.HEADER.ERROR_FLAG){
        this.showAlertInfo({msg : '해당 사용자의 근무 이력을 확인해 주시기 바랍니다.<br>해당 부서의 근무 시작일이 중복 되었습니다.'});
        return;
      }else{
        if (!this.mixin_isEmpty(resData)) {
          this.showToast(this.MESSAGE.TOAST.SUCCESS);
          this.srchUser();
        }
      }
    },

    //SWAT 상담사 존재 유무 판단용
    async getSwatUserInfo(LGN_ID){
      let _this = this;
      let postParam = {
        token: this.SWAT_TOKEN
        , agentLoginId: LGN_ID
        , tenantId: 2000000001
      }

      $.ajax({
          url: process.env.VUE_APP_SWAT_PROTOCOL + '://'+process.env.VUE_APP_SWAT_IP+':'+process.env.VUE_APP_SWAT_PORT+'/BT-EMS/webservice/api/agent/list.do',
          data : postParam,
          async: true,
          type: "POST",
          crossDomain: true,
          success: function(data) {
              console.log('getSwatUserInfo Result : ', data);
              if(data){
                console.log('data.data.length : ', data.data.length);
                if(data.data.length > 0) _this.SWAT_USER_YN = true;
              }
          },
          error:function(request,status,error){
              console.log("error : " + error);
          }
      });
    },
    
    async ctiUserProc(data){
      let sUrl = process.env.VUE_APP_SWAT_PROTOCOL + '://'+process.env.VUE_APP_SWAT_IP+':'+process.env.VUE_APP_SWAT_PORT+'/BT-EMS/webservice/api/agent/'+(this.SWAT_USER_YN?'update.do'/*수정*/:'insert.do'/*등록*/);

      let postParam = {
        token: this.SWAT_TOKEN
        , agentLoginId: Base64.encode(data.LGN_ID)
        , plainPwd: Base64.encode('1')
        , agentName: data.USER_NM
        , agentAlias: data.LGN_ID
        , groupId: data.ACD_GROUP
        , nodeId: 1
        , tenantId: 2000000001
      }

      //수정인 경우
      if(this.SWAT_USER_YN){
        if(data.USER_STTS_CD === 'WORK'){ //재직인 경우
          postParam.activateYn = 1;//활성화여부(0:비활성, 1:활성)
          postParam.retireYn = 0;//재직여부(0:재직, 1:퇴사)
        }else{
          postParam.activateYn = 0;//활성화여부(0:비활성, 1:활성)
          postParam.retireYn = 1;//재직여부(0:재직, 1:퇴사)
        }
      }

      $.ajax({
          url: sUrl,
          data : postParam,
          async: true,
          type: "POST",
          crossDomain: true,
          success: function(data) {
              console.log('ctiUserProc Result : ', data);
          },
          error:function(request,status,error){
              console.log("error : " + error);
          }
      });
    },

    //검색조건 초기화
    initSrch(){
      this.SRCH_USER_PARAM = {
        DATE_CHK:false,
        ST_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        CUSTCO:'',    //조직그룹
        CENTER:'',    //센터
        DEPT:'',      //소속
        USER_NM:'',   //성명
        EXT_NO:'',   //내선번호
        SRCH_USER_ID:'',   //사번
        SRCH_NO_TYPE : 'EXT_NO'
      };
    },
    openTransDept(userInfo){
      // console.log("userInfo > ", userInfo.USER_ID)
      let transUserInfo = this.USER_GRID_ITEMS.find(item=> item.USER_ID === userInfo.USER_ID)
      this.rowSelect(transUserInfo);

      let userDept = {
        CUSTCO_ID: transUserInfo.CUSTCO_ID
        , DEPT_ID: transUserInfo.DEPT_ID
        , DEPT_NM: transUserInfo.DEPT_NM
        , WORK_BGNG_YMD: transUserInfo.WORK_BGNG_YMD
      }

      this.USER_DEPT = userDept;
      this.CHK_ORG_USER = [transUserInfo];
      console.log("USER_DEPT > ", this.USER_DEPT)
      console.log("TRAN_USER_DEPT > ", this.TRAN_USER_DEPT)

      this.mixin_showDialog('TransPart')

    }
  },
}
</script>

<style lang="scss" scoped>

</style>