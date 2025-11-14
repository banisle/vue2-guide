<template>
  <div style="flex: 1 1 calc(55% - 24px)">
    <div class="pl-header">
      <div class="pl-header--title">상담정보{{ detailYn?' (상담번호 : '+popData.PHN_CUTT_ID+')': '' }}</div>
      <template v-if="!detailYn && mixin_getCustcoSrvcStat('CNSLT_TOOL_YN')"><!--상담도구 사용인 경우 노출-->
        <v-select
          v-model="CUTT_TOOL_CN"
          :items="CUTT_TOOL_LIST"
          item-text="TITLE"
          item-value="CONTENTS"
          return-object
          class="pl-form is-sm ml-4"
          placeholder="상담도구"
          :disabled="$store.getters['statusStore/GE_CUTT_ING']? false : true"
          @change="pushCuttCn"
        ></v-select>
      </template>
      <template v-if="!detailYn && REDUCDE_OPER_FLAG"><!--운영 단축인 경우 노출-->
        <v-select
          v-model="OPER_SHT"
          :items="OPER_SHT_LIST"
          item-text="text"
          item-value="cd_vl1"
          class="pl-form is-sm ml-4"
          placeholder="운영단축문구"
          @change="pushReduceOprCuttCn"
        ></v-select>
      </template>
      <div class="spacing-wrap sp-4 ml-auto justify-end">
        <!-- 통화예약 -->
        <v-menu
          v-model="modelCallReserve"
          min-width="350"
          bottom
          left
          content-class="pl-menu-drop"
          :close-on-content-click=false
          offset-y
        >
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <!-- <v-btn
              v-bind="menuAttrs"
              v-on="menuOn"
              class="pl-btn is-icon is-sub is-sm"
              :disabled="CUST_INFO.CUST_ID?false:true">
              <v-icon class="pl-icon20 phone"></v-icon>
              통화예약</v-btn> -->
          </template>
          <!-- 통화예약 v-menu -->
          <div class="px-3 py-2">
            <!-- header -->
            <div class="d-flex">
              <h3 style="font-size: 16px">통화예약</h3>
              <v-btn
                @click="modelCallReserve = false"
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
            <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  고객명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form is-search type-middle is-auto"
                    placeholder="고객명 입력"
                    value="나고객"
                    @keydown.enter="mixin_testLog('search btn')"
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="mixin_testLog('search btn')"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  전화번호
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle is-auto"
                    value="010-1004-1004"
                  ></v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  예약일시
                </span>
                <div class="pl-desc">
                  <compo-date-picker
                    DateType="dateTime"
                    :DateProp.sync="date2"
                    :TimesProp.sync='timeStep2'
                    :AmpmProp.sync='timeAmpm'
                    />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  예약내용
                </span>
                <div class="pl-desc">
                  <v-textarea
                    height="90"
                    class="pl-form is-noresize"
                    :spellcheck="false"
                    placeholder="예약내용 입력"
                  />
                </div>
              </div>
            </div>
            <div class="pl-btn-wrap is-mt-m">
              <v-btn
                class="pl-btn is-trans ml-auto"
                @click="modelCallReserve = false">닫기</v-btn>
              <v-btn class="pl-btn">저장</v-btn>
            </div>
          </div>
        </v-menu>
        <!-- 배려고객 ARS -->
        <v-menu
          v-model="modelBalckArs"
          min-width="700"
          max-width="700"
          bottom
          left
          content-class="pl-menu-drop"
          :close-on-content-click=false
          :close-on-click="false"
          offset-y
        >
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <!-- <v-btn
              v-bind="menuAttrs"
              v-on="menuOn"
              class="pl-btn is-icon is-sub is-sm"
              :disabled="CUST_INFO.CUST_ID?false:true">
              <v-icon class="pl-icon20 userBlackARS"></v-icon>
              배려고객 ARS</v-btn> -->
          </template>
          <!-- 배려고객 ARS v-menu -->
          <div class="px-3 py-2">
            <!-- header -->
            <div class="d-flex">
              <h3 style="font-size: 16px">배려고객 ARS</h3>
              <v-btn
                @click="modelBalckArs = false"
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
            <!-- info -->
            <div class="is-mt-m">
              <h3 class="pl-subtit">임시 차단</h3>
              <div class="pl-subdesc">
                <p>[임시차단 하기] 버튼을 클릭 하시면 즉시 임시 차단됩니다.</p>
              </div>
              <div class="pl-rounded-box pa-3 is-mt-s">
                <span class="pl-label">
                  <v-icon class="pl-icon20 phone-ban"></v-icon>
                  <span class="ml-1">전화번호</span>
                  <span class="ml-2 pl-value-txt">{{ dataBalckArs.phone }}</span>
                  <v-btn class="pl-btn is-esp ml-auto">임시차단 하기</v-btn>
                </span>
              </div>
            </div>
            <!-- tab -->
            <v-tabs class="pl-tabs is-mt-s" >
              <v-tab>배려고객 등록 요청</v-tab>
              <v-tab>특이사항</v-tab>
              <!-- 배려고객 등록 요청 -->
              <v-tab-item >
                <div class="is-mt-s">
                  <p>배려고객으로 등록할 유형과 사유를 입력하신 후, [요청하기] 버튼을 클릭하시면 절차에 따라 IVR 차단관리가 진행됩니다. </p>
                  <!-- form -->
                  <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label" style="flex: 0 0 60px">
                        배려 유형
                      </span>
                      <div class="pl-desc">
                        <v-combobox
                          class="pl-form type-middle"
                          :items="dataBalckArs.itemsType"
                          multiple
                          placeholder="선택"
                        />
                      </div>
                    </div>
                    <div class="pl-form-inline">
                      <span class="pl-label" style="flex: 0 0 60px">
                        사유
                      </span>
                      <div class="pl-desc">
                        <v-textarea
                          height="90"
                          class="pl-form is-noresize"
                          :spellcheck="false"
                          placeholder="사유 입력"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 버튼 -->
                <div class="pl-btn-wrap is-mt-m">
                  <v-btn
                    @click="dialogResponseScript = true"
                    class="pl-btn is-icon is-sub is-trans">
                    <span class="pl-icon20 ai-script"></span>
                    응대 스크립트
                  </v-btn>
                  <v-btn
                    class="pl-btn is-trans ml-auto"
                    @click="modelBalckArs = false">닫기</v-btn>
                  <v-btn class="pl-btn">배려고객 요청하기</v-btn>
                </div>
              </v-tab-item>
              <!-- 특이사항 -->
              <v-tab-item >
                <div class="is-mt-s">
                  <p>등록하신 특이사항은 관리자의 승인 후 전화상담 화면 좌측 상단의 고객정보 영역에 조회되어 집니다. </p>
                  <!-- form -->
                  <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
                    <div class="pl-form-inline">
                      <span class="pl-label" style="flex: 0 0 60px">
                        주의 메모
                      </span>
                      <div class="pl-desc">
                        <v-textarea
                          height="90"
                          class="pl-form is-noresize"
                          :spellcheck="false"
                          placeholder="주의메모 입력"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 버튼 -->
                <div class="pl-btn-wrap is-mt-m">
                  <v-btn
                    class="pl-btn is-trans ml-auto"
                    @click="modelBalckArs = false">닫기</v-btn>
                  <v-btn class="pl-btn">주의메모 저장</v-btn>
                </div>
              </v-tab-item>
            </v-tabs>

          </div>
        </v-menu>

        <template v-if="!detailYn">
          <!--요청자와 로그인 사용자가 같고 이첩 대상자가 이첩미확인(ISMACNST016) 상태일 경우 회수 가능-->
          <v-btn
            v-if="RCPT_TRNSF_ID && REQ_EMP_NO === $store.getters['userStore/GE_USER_ROLE'].userId && PRCS_STTS_CD === 'ISMACNST016'"
            class="pl-btn is-esp is-sm"
            :disabled="CUST_INFO.CUST_ID?false:true"
            @click="trnsfReCallConfirm()"
          >이첩회수</v-btn><!--이첩 미확인인 경우만 노출-->
          <v-btn
            v-if="RCPT_TRNSF_ID && REQ_EMP_NO !== $store.getters['userStore/GE_USER_ROLE'].userId && (PRCS_STTS_CD === 'ISMACNST016' || PRCS_STTS_CD === 'ISMACNST004')"
            class="pl-btn is-sub is-sm"
            :disabled="CUST_INFO.CUST_ID?false:true"
            @click="mixin_showDialog('RejectTrans')"
          >이첩반려</v-btn><!--이첩 미확인이거나 이첩 접수인 경우만 노출-->

          <v-btn
            v-if="Number(this.CTI_CALL_STAT.replace('stat', '')) === 6"
            class="pl-btn is-sub is-sm"
            :disabled="CUST_INFO.CUST_ID?false:true"
            @click="$eventBus.$emit('prizeArs')"
          >당첨 ARS (보이는 ARS)</v-btn><!--통화중일때 노출-->
          <v-select
            v-if="Number(this.CTI_CALL_STAT.replace('stat', '')) !== 1"
            v-model="SAVE_AFTER_ACTION"
            :items="SAVE_AFTER_ACTION_LIST"
            return-object
            class="pl-form"
            style="flex: 0 0 120px;"
            placeholder="선택"
            :disabled="editAble ? false : (Number(this.CTI_CALL_STAT.replace('stat', '')) === 4 ? false:true)"
          ></v-select><!--통화중일때 노출-->
          <v-btn
            class="pl-btn is-sm"
            :disabled="$store.getters['statusStore/GE_CUTT_ING']? false : true"
            @click="cuttRegValid"
          >상담저장</v-btn>
          <v-btn
            v-if="$store.getters['statusStore/GE_CUTT_ING']? false : true"
            class="pl-btn is-sm is-esp"
            @click="cuttFormStat(true)"
          >새 상담</v-btn>
          <v-tooltip v-if="$store.getters['statusStore/GE_CUTT_ING']? true : false" content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                min-width="190"
                bottom
                left
                offset-y
              >
                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                  <v-btn
                    v-bind="menuAttrs"
                    v-on="menuOn"
                    class="pl-tooltip-btn"
                    min-width="22"
                    height="22"
                    plain
                    >
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      class="pl-icon20 detail"></v-icon>
                  </v-btn>
                </template>
                <ul class="pl-drop-layer-list">
                  <!-- <li
                    v-for="(item, index) in detailList"
                    :key="index"
                    @click="cuttFormStat(item.editAble)"
                    >
                    <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                    <span class="ml-1">{{ item.title }}</span>
                  </li> -->
                  <li @click="cuttFormStatConfirm">
                    <v-icon class="pl-icon20 in-erase"></v-icon>
                    <span class="ml-1">상담 취소</span>
                  </li>
                </ul>
              </v-menu>
            </template>
            <span>상세</span>
          </v-tooltip>
        </template>
        <template v-else>
          <v-btn v-if="SAVE_BTN_FLAG"
            class="pl-btn is-sm"
            @click="cuttModValid"
          >상담저장</v-btn>
        </template>
      </div>
    </div>
    <div class="is-mt-s">
      <template v-if="!detailYn">
        <CompoCsInfoTable
          :DataProp="CS_INFO"
          :cuttEditAble="editAble"
          :CHG_CUTT_CN="CHG_CUTT_CN"
          :RESET_ABLE="RESET_ABLE"
          :SAVE_AFTER_ACTION="SAVE_AFTER_ACTION"
          @sendCuttCn="sendCuttCn"
          @clear="init"
        />
      </template>
      <template v-else>
        <CompoCsInfoDtlTable
          :popData="popData"
          :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
        />
      </template>

    </div>
    <!-- slide: 응대 스크립트 -->
    <v-slide-x-transition>
      <div v-if=" dialogResponseScript === true "
        class="pl-quick-layer type-left "
        style="width: 975px; z-index: 11;"
        >
        <div class="pl-quick-layer-header ">
          <div class="d-flex align-center">
            <h1>블랙컨슈머 응대 스크립트 </h1>
          </div>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn ml-auto"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick=""
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogResponseScript = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoResponseScript />
      </div>
    </v-slide-x-transition>

    <!-- dialog: 이첩 반려 -->
    <v-dialog
      v-model="dialogRejectTrans"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="반려 내용"
        @hide="closeRejectTrans"
        @submit="submitDialog('RejectTrans')"
      >
        <template slot="body">
          <v-textarea
            v-model="TRNSF_REJECT_REASON"
            class="pl-form is-noresize"
            :spellcheck="false"
            placeholder="반려내용 입력"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="closeRejectTrans">닫기</v-btn>
          <v-btn class="pl-btn" @click="trnsfRejectConfirm">이첩 반려</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoCsInfoTable from '@/components/CompoCsInfoTable'
import CompoCsInfoDtlTable from '@/components/CompoCsInfoDtlTable'
import CompoResponseScript from '@/views/page/CompoResponseScript'


export default {
  name: "CompoInfoCutt", //상담 - 공통 상담정보(바로처리 제외)
  props: {
    CUST_INFO: {
      type: Object,
    },
    CHG_CUTT_CN: {
      type: String,
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    SCH_CUSTCO_ID: {
      type: String,
      default : ''
    },
    popData: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
      default : false
    },
    detailYn: {
      type: Boolean,
      default : false
    },
  },
  components: {
    CompoCsInfoTable,
    CompoCsInfoDtlTable,
    CompoResponseScript
  },
  data() {
    return {
      list_common_code : [],

      // dialog: 이첩반려
      dialogRejectTrans: false,

      TRNSF_REJECT_REASON : '', //이첩 반려 사유
      PHN_CUTT_ID : '', //상담 ID

      // 통화예약
      modelCallReserve: false,
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep2: '05:50',
      timeAmpm: '오후',

      SAVE_AFTER_ACTION: {text: '저장 후 대기', value: 'stat5', evt: 'Ready', active : false, disabled : false},
      SAVE_AFTER_ACTION_LIST: [],

      // 배려고객 ARS
      modelBalckArs: false,
      dataBalckArs: {
        phone: '010-1004-1004',
        itemsType: [
          {text: '성희롱'},
          {text: '욕설 폭언'},
          {text: '반복억지'},
          {text: '민원요지 불분명'},
          {text: '사유 없는 콜백요청'},
          {text: '반말'},
          {text: '기타'},
        ],
      },
      // slide: 블랙컨슈머 응대 스크립트
      dialogResponseScript: false,

      // 상담정보
      CS_INFO: {
        radioGroupSelected: '동의',
        radioGroup: [
          { text: '동의' },
          { text: '미동의' },
        ],
        radioGroupSelected2: '일반',
        radioGroup2: [
          { text: '일반' },
          { text: '호전환', dialog: 'TransCenter' },
          { text: '호전환(협업)', slide: 'dialogJobParts' },
          // { text: '예약' },
          // { text: '운영단축' },
          { text: '이첩', dialog: 'TransManager' },
        ],
        chn_category01: 'IN',
        chn_category02: '전화',
        category01: '아파트 임대',
        category02: '사전청약',
        category03: '',
        place_category01: '경기',
        place_category02: '화성시',
        place_category03: '화성동탄',
        textareaH: 134,
        textarea: `
문)
답)`
      },
      // 상세
      detailList: [
        // { title: '새 상담', icon: 'selectPart', editAble : true},
        { title: '상담 취소', icon: 'in-erase', editAble : false},
      ],

      editAble : false,
      PRCS_STTS_CD : '', //이첩 상태 코드
      RCPT_TRNSF_ID : '', //이첩 ID
      REQ_EMP_NO : '', //이첩 요청자 ID
      TRANS_EMP_NO : '', //이첩 대상자 ID

      CUTT_TOOL_CN : '', //상담도구 문구구
      CUTT_TOOL_LIST : [], //상담도구

      REDUCDE_OPER_FLAG : false, //운영단축 상담문구 사용여부
      OPER_SHT : {},
      OPER_SHT_LIST : [],

      SAVE_BTN_FLAG : false,
    }
  },
  computed: {
  },
  watch: {
    RESET_ABLE() {
      // if(this.RESET_ABLE){
        this.init();
        this.editAble = false;
        this.CUTT_TOOL_CN = '';
        this.$store.commit("statusStore/MU_CUTT_ING", false);
      // }
    },
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("trnsfBtnCtrl"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setForceCuttIngFlag"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("reduceOprerationCn"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("cuttDtlSaveBtnControl"); //eventBus 중복방지를 위해 off
  },
  async created() {
    if(this.popData){
      this.SCH_CUSTCO_ID = this.SCH_CUSTCO_ID?this.SCH_CUSTCO_ID:this.computedUserCenter;
      this.CUST_INFO = this.popData; //상담상세보기 팝업인 경우
      this.btnControl();
    }

    //공통코드설정
    let codeName = ['CTI_TP', 'CTI_SEAT_MOVE_TP', 'OPER_SHT']; //CTI 메뉴, CTI 이석 종류, 운영단축 상담문구
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

    let CTI_TP = await this.mixin_common_code_get_global(this.list_common_code, 'CTI_TP', this.SCH_CUSTCO_ID, '');
    let CTI_SEAT_MOVE_TP = await this.mixin_common_code_get_global(this.list_common_code, 'CTI_SEAT_MOVE_TP', this.SCH_CUSTCO_ID, '');

    this.SAVE_AFTER_ACTION_LIST = [];

    if(CTI_TP.length > 0){
      CTI_TP.forEach((data, idx) => {
        if(data.cd_vl2 === 'Ready'){
          data.text = '저장 후 ' + data.text;
          data.value = 'stat5'; //대기
          data.evt = data.cd_vl2;
          data.active = false;
          data.disabled = false;

          this.SAVE_AFTER_ACTION_LIST.push(data);
        }
      });
    }

    if(CTI_SEAT_MOVE_TP.length > 0){
      CTI_SEAT_MOVE_TP.forEach((data, idx) => {
        data.text = '저장 후 ' + data.text;
        data.value = 'stat'+(7+idx);
        data.evt = data.cd_vl2;
        data.active = false;
        data.disabled = false;

        this.SAVE_AFTER_ACTION_LIST.push(data);
      });
    }

    this.$eventBus.$on("trnsfBtnCtrl", (item) => {
      this.PRCS_STTS_CD = item.PRCS_STTS_CD;
      this.RCPT_TRNSF_ID = item.RCPT_TRNSF_ID;
      this.TRANS_EMP_NO = item.TRANS_EMP_NO;
      this.REQ_EMP_NO = item.REQ_EMP_NO;
      this.PHN_CUTT_ID = item.PHN_CUTT_ID;
      //이첩, 이관인 경우 상담정보 탭에 데이터 조회
      // if(this.PHN_CUTT_ID){
      //   this.$eventBus.$emit('orgCuttSelect', item);
      //   this.editAble = true;
      // }else{
      //   this.editAble = false;
      //   this.CUTT_TOOL_CN = '';
      // }

      this.$eventBus.$emit('orgCuttSelect', item);
      this.editAble = true;
      this.$store.dispatch("statusStore/AC_CUTT_ING", true);
      this.$emit('setCuttFormEditAble', true);
      // this.cuttFormStat(this.editAble);
    });

    //운영단축 상담문구 컨트롤
    this.$eventBus.$on("reduceOprerationCn", (flag) => {
      this.REDUCDE_OPER_FLAG = flag;

      if(flag){
        this.OPER_SHT = {};
        this.OPER_SHT_LIST = this.mixin_common_code_get_global(this.list_common_code, 'OPER_SHT', this.SCH_CUSTCO_ID, '');
      }else{
        this.OPER_SHT = {};
        this.OPER_SHT_LIST = [];
      }
    });

    //인바운드 혹은 아웃바운드 전화 받은 경우 상담 상태로 변경
    this.$eventBus.$on("setForceCuttIngFlag", (flag) => {
      this.cuttFormStat(flag);
    });

    this.$eventBus.$on("cuttDtlSaveBtnControl", (item) => {
      this.popData = item;
      this.btnControl();
    });

    //상담문구
    this.getCuttToolList();

    //채팅에서 고객정보 조회 -> 새상담,카카오톡,티켓id 넣어준다
    this.$eventBus.$on("searchCustInfoNewCutt", (chtUserKey,chnl) => {
      this.$eventBus.$emit("newCuttOnCsInfoTable",chtUserKey,chnl);
      this.cuttFormStat(true)
    });
  },
  methods: {
    //초기화
    init() {
      this.PRCS_STTS_CD = ''; //이첩 상태 코드
      this.RCPT_TRNSF_ID = ''; //이첩 ID
      this.REQ_EMP_NO = ''; //이첩 요청자 ID
      this.TRANS_EMP_NO = ''; //이첩 대상자 ID
      this.TRNSF_REJECT_REASON = ''; //이첩 반려 사유
      this.PHN_CUTT_ID = ''; //상담 ID

      this.editAble = false;
      this.CUTT_TOOL_CN = '';
    },

    //상담 취소 버튼 이벤트
    cuttFormStatConfirm(){
      this.showConfirmInfo({
        msg : '상담을 취소 하시겠습니까?'
        , callYes : () => {
          this.$store.dispatch("statusStore/AC_CUTT_ING", false);
          this.editAble = false;
          this.$emit('setCuttFormEditAble', false);
          this.init();
          this.closeAlert();
        }
        , callNo : this.closeAlert
      });
    },

    //새 상담 및 상담취소 버튼 이벤트
    cuttFormStat(editAble) {
      if(editAble){
        if(Number(this.CTI_CALL_STAT.replace('stat', '')) > 1 && Number(this.CTI_CALL_STAT.replace('stat', '')) !== 6){
          this.showAlertInfo({msg : 'CTI 로그인 중인 경우 사용 할 수 없습니다.'});
          return;
        }else{
          this.$store.dispatch("statusStore/AC_CUTT_ING", editAble);
          this.editAble = editAble;
          this.$emit('setCuttFormEditAble', editAble);
        }
      }else{
        this.$store.dispatch("statusStore/AC_CUTT_ING", editAble);
        this.editAble = editAble;
        this.$emit('setCuttFormEditAble', editAble);
        this.init()
      }
    },
    sendCuttCn(data){
      this.$emit('sendCuttCn', data);
    },

    cuttRegValid() {
      if(this.CTI_CALL_STAT === 'stat6'){
        this.showAlertInfo({msg : '고객과의 <font color="red">통화중</font>에는 상담저장을 하실 수 없습니다.'});
        return;
      }else{
        this.$eventBus.$emit('custValid', {CUST_ID : this.CUST_INFO.CUST_ID, SAVE_AFTER_ACTION : this.SAVE_AFTER_ACTION});
      }
    },

    //이첩 반려 사유 다이얼로그 닫기
    closeRejectTrans(){
      this.TRNSF_REJECT_REASON = '';
      this.mixin_hideDialog('RejectTrans');
    },

    //이첩 반려 Confirm
    trnsfRejectConfirm(){
      if(this.TRNSF_REJECT_REASON.trim()){
        this.showConfirmInfo({
          msg:'해당 상담정보를 반려 하시겠습니까?'
          , callYes: () => {
            this.trnsfRejectProc();
          }
          , callNo: this.closeAlert
        });
      }else{
        this.showAlertInfo({msg : '반려 사유를 입력해 주세요.'});
        return;
      }
    },

    //이첩 반려 처리
    async trnsfRejectProc() {
      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , PRCS_CHN_CD : 'ISMAPCMC006' //처리 채널 코드(이첩)
        , PRCS_STTS_CD : 'ISMACNST018' //이첩요청반려
        , REQ_CNTNT : this.TRNSF_REJECT_REASON //반려 사유
      }
      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/cutt/cuslTrnsfHistProc', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '반려 처리 되었습니다.'});
        // this.init();
        this.$eventBus.$emit('allReSet')//전체초기화
        this.mixin_reloadCuttStat('TRANSF_STAT');
        this.closeRejectTrans();
        return;
      }
    },

    //이첩 회수 Confirm
    trnsfReCallConfirm(){
      this.showConfirmInfo({
        msg:'이첩 요청을 회수 하시겠습니까?'
        , callYes: () => {
          this.getTrnsfStat();
        }
        , callNo: this.closeAlert
      });
    },

    //이첩 상태 조회
    async getTrnsfStat(){
      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        // , TRANS_TYPE : 'ISMATRDV001'
        , REQ_YN : 'Y'
        , PROC_YN : 'Y'
      }
      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/cutt/selectTrnsfStat', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA){
          if(response.DATA[0].PRCS_STTS_CD === 'ISMACNST016'){
            this.trnsfReCallProc();
          }else{
            this.showAlertInfo({msg : '이첩 대상자가 상담정보를 이첩접수 하거나 반려하여 회수를 진행할 수 없습니다.'});
            this.$eventBus.$emit('allReSet')//전체초기화
            return;
          }
        }
      }

    },

    //이첩 회수 처리
    async trnsfReCallProc(){
      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , PRCS_CHN_CD : 'ISMAPCMC006' //처리 채널 코드(이첩)
        , PRCS_STTS_CD : 'ISMACNST020' //이첩요청회수
      }
      let headParam = {head : {}}

      let response  = await this.common_postCall('/phone-api/cutt/cuslTrnsfHistProc', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '회수 처리 되었습니다.'});
        // this.init();
        this.$eventBus.$emit('allReSet')//전체초기화
        this.mixin_reloadCuttStat('TRANSF_STAT');
        return;
      }
    },

    //운영단축 상담문구 추가
    pushReduceOprCuttCn(value){
      if(value) this.$eventBus.$emit('addCuttCnReduceOper', value);
    },

    //상담문구 추가
    pushCuttCn(item){
      if(item) this.$eventBus.$emit('addCuttCn', item);
    },

    //상담도구
    async getCuttToolList() {
      this.CUTT_TOOL_LIST = [{TITLE:'선택', CONTENTS : ''}];

      let postParam = {
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttToolMngMapper',
        }
      }

      const response = await this.common_postCall('/api/biz/common/select/selectCuttToolList', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.forEach((item, idx) => {
          item.CONTENTS = this.mixin_decode(item.CONTENTS);
          this.CUTT_TOOL_LIST.push(item);
        });
      }

    },

    //저장 버튼 노출 처리
    async btnControl() {
      let currentDate = await this.mixin_getSvrDate("YYYYMMDD");

      if(this.computedUserCenter !== this.popData.CUSTCO_ID){
        this.SAVE_BTN_FLAG = false;
      }else{
        if(this.computedUserType === 'MANAGER'){ //상담사인경우 당일 상담건에 대해서만 수정 가능
          if(this.mixin_convertDate(this.popData.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd') === currentDate) this.SAVE_BTN_FLAG = true;
          else this.SAVE_BTN_FLAG = false;
        }else{ //그외 권한자는 3일 이내 상담건에 대해서만 수정 가능
          if(this.computedUserDetailType === 'TEAM_LEADER'){
            if(this.computedUserDeptId === this.popData.RCPT_DEPT_ID){
              if(currentDate <= this.$moment(this.mixin_convertDate(this.popData.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
                this.SAVE_BTN_FLAG = true;
              }else{
                this.SAVE_BTN_FLAG = false;
              }
            }else{
              this.SAVE_BTN_FLAG = false;
            }
          }else{
            if(currentDate <= this.$moment(this.mixin_convertDate(this.popData.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
              this.SAVE_BTN_FLAG = true;
            }else{
              this.SAVE_BTN_FLAG = false;
            }
          }
        }
      }
    },

    //상담 수정
    cuttModValid() {
      // if(this.CTI_CALL_STAT === 'stat6'){
      //   this.showAlertInfo({msg : '고객과의 <font color="red">통화중</font>에는 상담저장을 하실 수 없습니다.'});
      //   return;
      // }else{
      //   this.$eventBus.$emit('custValid', {CUST_ID : this.CUST_INFO.CUST_ID, SAVE_AFTER_ACTION : this.SAVE_AFTER_ACTION});
      // }
      this.$eventBus.$emit('saveCsDtlInfoValid', this.popData);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>